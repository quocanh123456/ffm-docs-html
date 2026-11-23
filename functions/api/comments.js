// API góp ý: GET ?page= | ?open=1 · POST {page, selector, quote, body, parent_id?} · PATCH {id, resolved? | body?} · DELETE ?id=
// Người viết lấy từ JWT của Cloudflare Access (header Cf-Access-Jwt-Assertion), đã kiểm tra chữ ký, aud, iss, hạn.
// Service token của Claude (common_name = CLAUDE_CLIENT_ID) ghi với tên "claude:<CLAUDE_ON_BEHALF>" (Claude viết thay người đó).
// Chỉ người viết sửa / xoá được góp ý của mình (người được viết thay cũng sửa / xoá được câu Claude viết thay họ);
// ai đăng nhập cũng trả lời và đánh dấu đã xử lý được.

import { isTeam, configureTeam, guestCanView, sharePage } from "../../_share/lib.js";

const LIMITS = { page: 300, selector: 1000, quote: 1000, body: 4000 };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
const normPage = (page) =>
  String(page || "")
    .slice(0, LIMITS.page)
    .replace(/\.html$/, "");
const now = () => new Date().toISOString();
// Header Origin có thể là "null" (trang mở từ file, iframe sandbox): không phân tích được thì coi như khác host
const originHost = (origin) => {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
};

let certs = { keys: null, fetchedAt: 0 };

// force: JWT mang kid chưa có trong danh sách đã tải (Access vừa đổi khoá ký) → tải lại, tối đa 1 lần mỗi phút
async function accessKeys(env, force = false) {
  const age = Date.now() - certs.fetchedAt;
  if (certs.keys && (force ? age < 60 * 1000 : age < 3600 * 1000))
    return certs.keys;
  try {
    const res = await fetch(
      `https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`,
    );
    if (!res.ok) throw new Error(`certs HTTP ${res.status}`);
    certs = { keys: (await res.json()).keys || [], fetchedAt: Date.now() };
  } catch (e) {
    // Tải khoá lỗi thì dùng lại khoá đã tải lần trước: middleware kiểm JWT ở mọi request, lỗi tạm thời
    // không được làm cả team bị coi là khách (CLAUDE.md §13)
    if (certs.keys) return certs.keys;
    throw e;
  }
  return certs.keys;
}

const b64url = (s) =>
  Uint8Array.from(
    atob(
      s
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(s.length / 4) * 4, "="),
    ),
    (c) => c.charCodeAt(0),
  );
const decodeJson = (s) => JSON.parse(new TextDecoder().decode(b64url(s)));

export async function currentUser(request, env) {
  // Chỉ dùng khi chạy `wrangler pages dev` ở máy (không có Access): biến này không khai báo trong wrangler.toml
  const host = new URL(request.url).hostname;
  if (env.LOCAL_DEV_EMAIL && (host === "localhost" || host === "127.0.0.1"))
    return env.LOCAL_DEV_EMAIL;

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  const [h, p, sig] = (token || "").split(".");
  if (!sig) return null;
  try {
    const kid = decodeJson(h).kid;
    const jwk =
      (await accessKeys(env)).find((k) => k.kid === kid) ||
      (await accessKeys(env, true)).find((k) => k.kid === kid);
    if (!jwk) return null;
    const algo = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
    const key = await crypto.subtle.importKey("jwk", jwk, algo, false, [
      "verify",
    ]);
    const valid = await crypto.subtle.verify(
      algo,
      key,
      b64url(sig),
      new TextEncoder().encode(`${h}.${p}`),
    );
    if (!valid) return null;
    const claims = decodeJson(p);
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    // ACCESS_AUD: AUD của các app Access phủ site, cách nhau dấu phẩy (app tên miền chính + app *.ffm-docs-html.pages.dev, CLAUDE.md §13)
    const allowed = String(env.ACCESS_AUD || "").split(",").map((a) => a.trim()).filter(Boolean);
    if (!aud.some((a) => allowed.includes(a))) return null;
    if (claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
    if (!claims.exp || claims.exp * 1000 < Date.now()) return null;
    if (claims.email) return claims.email;
    // Service token không có email; common_name là client id của token
    if (env.CLAUDE_CLIENT_ID && claims.common_name === env.CLAUDE_CLIENT_ID)
      return `claude:${env.CLAUDE_ON_BEHALF}`;
    return null;
  } catch {
    return null;
  }
}

// Giao diện góp ý không tự đoán ai là khách theo email: server gắn cờ cho người đang xem và cho từng góp ý
const withGuestFlag = (c) => ({ ...c, author_guest: !isTeam(c.author_email) });

export async function onRequest({ request, env }) {
  await configureTeam(env);
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (request.method !== "GET" && origin && originHost(origin) !== url.host)
    return json({ error: "origin" }, 403);

  const email = await currentUser(request, env);
  if (!email) return json({ error: "unauthorized" }, 401);
  const db = env.COMMENTS_DB;
  const find = (id) =>
    db.prepare("SELECT * FROM comments WHERE id = ?").bind(id).first();
  const owns = (row) =>
    row.author_email === email || row.author_email === `claude:${email}`;

  // Khách ngoài (CLAUDE.md §13): chỉ trên trang đã được duyệt, chỉ chuỗi góp ý do chính mình mở (kèm câu team trả lời);
  // không xem góp ý mọi trang, không đánh dấu đã xử lý. Góp ý nội bộ của team trên cùng trang không trả về cho khách.
  if (!isTeam(email)) {
    const canView = (page) => guestCanView(env, url.origin, page, email);
    if (request.method === "GET") {
      const page = normPage(url.searchParams.get("page"));
      if (url.searchParams.get("open") || !(await canView(page)))
        return json({ error: "forbidden" }, 403);
      const { results } = await db
        .prepare(
          `SELECT * FROM comments WHERE page = ? AND (
             (parent_id IS NULL AND author_email = ?)
             OR parent_id IN (SELECT id FROM comments WHERE page = ? AND parent_id IS NULL AND author_email = ?))
           ORDER BY created_at`,
        )
        .bind(page, email, page, email)
        .all();
      // Khách không cần email đầy đủ của team: giữ phần trước @ (giao diện chỉ hiện phần này)
      // "claude:sh@pancake.vn" → "claude:sh": giao diện vẫn hiện "sh (via Claude)"
      const hide = (e) => {
        const base = (e || "").replace(/^claude:/, "");
        return e && isTeam(base) ? e.slice(0, e.length - base.length) + base.split("@")[0] : e;
      };
      return json({
        me: email,
        guest: true,
        comments: results.map((c) => ({ ...withGuestFlag(c), author_email: hide(c.author_email), resolved_by: hide(c.resolved_by) })),
      });
    }
    if (request.method === "POST") {
      const b = await request.clone().json().catch(() => null);
      const parent = b?.parent_id ? await find(b.parent_id) : null;
      if (parent && parent.author_email !== email)
        return json({ error: "forbidden" }, 403);
      if (!(await canView(parent ? parent.page : normPage(b?.page))))
        return json({ error: "forbidden" }, 403);
    }
    if (request.method === "PATCH") {
      const b = await request.clone().json().catch(() => null);
      if (!b || typeof b !== "object") return json({ error: "invalid body" }, 400);
      if ("resolved" in b) return json({ error: "forbidden" }, 403);
      const row = b?.id && (await find(b.id));
      // Khách chỉ sửa được góp ý của chính mình; không trả dòng của người khác (góp ý nội bộ)
      if (row && (!owns(row) || !(await canView(row.page))))
        return json({ error: "forbidden" }, 403);
    }
    if (request.method === "DELETE") {
      const row = await find(url.searchParams.get("id"));
      if (row && !(await canView(row.page)))
        return json({ error: "forbidden" }, 403);
    }
  }

  if (request.method === "GET" && url.searchParams.get("open")) {
    // Góp ý chưa xử lý trên mọi trang, kèm trả lời của chúng
    const { results } = await db
      .prepare(
        `SELECT c.* FROM comments c
         LEFT JOIN comments r ON r.id = c.parent_id
         WHERE (c.parent_id IS NULL AND c.resolved_at IS NULL)
            OR (c.parent_id IS NOT NULL AND r.resolved_at IS NULL)
         ORDER BY c.page, c.created_at LIMIT 1000`,
      )
      .all();
    return json({ me: email, guest: false, comments: results.map(withGuestFlag) });
  }

  if (request.method === "GET") {
    const page = normPage(url.searchParams.get("page"));
    const { results } = await db
      .prepare("SELECT * FROM comments WHERE page = ? ORDER BY created_at")
      .bind(page)
      .all();
    return json({ me: email, guest: false, comments: results.map(withGuestFlag) });
  }

  if (request.method === "POST") {
    const b = await request.json().catch(() => null);
    const body = String(b?.body || "").trim();
    if (!body) return json({ error: "body is required" }, 400);
    // Khách: lưu đúng dạng khoá trang mà giao diện dùng ("/ffm/wms/x"), không theo chuỗi khách tự gửi
    let page = isTeam(email) ? normPage(b.page) : "/" + sharePage(b.page);
    let parent = null;
    if (b.parent_id) {
      parent = await find(b.parent_id);
      if (!parent || parent.parent_id)
        return json({ error: "parent not found" }, 404);
      page = parent.page; // trả lời luôn thuộc trang của góp ý gốc
    }
    const row = {
      id: crypto.randomUUID(),
      page,
      parent_id: parent ? parent.id : null,
      selector: parent
        ? null
        : String(b.selector || "").slice(0, LIMITS.selector),
      quote: parent ? null : String(b.quote || "").slice(0, LIMITS.quote),
      body: body.slice(0, LIMITS.body),
      author_email: email,
      created_at: now(),
    };
    await db
      .prepare(
        "INSERT INTO comments (id, page, parent_id, selector, quote, body, author_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        row.id,
        row.page,
        row.parent_id,
        row.selector,
        row.quote,
        row.body,
        row.author_email,
        row.created_at,
      )
      .run();
    return json(row, 201);
  }

  if (request.method === "PATCH") {
    const b = await request.json().catch(() => null);
    const row = b?.id && (await find(b.id));
    if (!row) return json({ error: "not found" }, 404);
    if ("resolved" in b) {
      if (row.parent_id)
        return json({ error: "only root comments can be resolved" }, 400);
      await db
        .prepare(
          "UPDATE comments SET resolved_at = ?, resolved_by = ? WHERE id = ?",
        )
        .bind(b.resolved ? now() : null, b.resolved ? email : null, row.id)
        .run();
    }
    if ("body" in b) {
      if (!owns(row)) return json({ error: "forbidden" }, 403);
      const body = String(b.body || "").trim();
      if (!body) return json({ error: "body is required" }, 400);
      await db
        .prepare("UPDATE comments SET body = ?, updated_at = ? WHERE id = ?")
        .bind(body.slice(0, LIMITS.body), now(), row.id)
        .run();
    }
    return json(await find(row.id));
  }

  if (request.method === "DELETE") {
    const row = await find(url.searchParams.get("id"));
    if (!row) return json({ error: "not found" }, 404);
    if (!owns(row)) return json({ error: "forbidden" }, 403);
    // Xoá góp ý gốc thì xoá luôn các trả lời của nó
    await db.batch([
      db.prepare("DELETE FROM comments WHERE parent_id = ?").bind(row.id),
      db.prepare("DELETE FROM comments WHERE id = ?").bind(row.id),
    ]);
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
}
