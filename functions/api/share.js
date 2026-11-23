// API chia sẻ trang với khách ngoài (quy định ở CLAUDE.md §13):
//   POST {page, reason}            khách xin quyền xem 1 trang có thẻ <meta name="share" content="guest"> → dòng pending + email người phụ trách
//   GET  [?page=]                  team: các trang đã có yêu cầu (hoặc đúng trang ?page=) + các yêu cầu / quyền đã cấp
//   PATCH {id, action}             người phụ trách trang hoặc anh SH: approve | reject | revoke; approve thì email báo khách
import { currentUser } from "./comments.js";
import {
  sharePage,
  looksLikePage,
  isTeam,
  configureTeam,
  canDecide,
  grantOf,
  notify,
  pageMeta,
} from "../../_share/lib.js";

const REASON_MAX = 1000;
const RENOTIFY_MS = 10 * 60 * 1000; // xin lại khi đang chờ: chỉ gửi email lại sau 10 phút

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
const now = () => new Date().toISOString();
// Link trong email: tên miền chính của site (biến SITE_URL trong wrangler.toml); tên miền có mã bản deploy, preview
// không được dùng vì FFM chỉ nhận link của tên miền chính
const pageUrl = (origin, page) => `${origin}/${page}`;
const manageUrl = (origin, page) =>
  `${origin}/_share/manage?page=${encodeURIComponent(page)}`;

export async function onRequest({ request, env }) {
  await configureTeam(env);
  const url = new URL(request.url);
  const site = String(env.SITE_URL || url.origin).replace(/\/+$/, "");
  const origin = request.headers.get("Origin");
  let originHost = null;
  try {
    originHost = origin && new URL(origin).host;
  } catch {
    originHost = null; // Origin "null" (trang mở từ file, iframe sandbox) → coi như khác host
  }
  if (request.method !== "GET" && origin && originHost !== url.host)
    return json({ error: "origin" }, 403);

  const email = await currentUser(request, env);
  if (!email) return json({ error: "unauthorized" }, 401);
  const db = env.COMMENTS_DB;

  if (request.method === "POST") {
    if (isTeam(email))
      return json({ error: "team members can already view every page" }, 400);
    const b = await request.json().catch(() => null);
    const page = sharePage(b?.page);
    const info = looksLikePage(page) ? await pageMeta(env, url.origin, page) : { shared: false };
    if (!info.shared) return json({ error: "page is not shared" }, 404);
    const reason = String(b?.reason || "")
      .trim()
      .slice(0, REASON_MAX);
    if (!reason) return json({ error: "reason is required" }, 400);

    const guest = email.toLowerCase();
    const grant = await grantOf(db, page, guest);
    if (grant && grant.status === "approved")
      return json({ status: "approved" });
    if (
      grant &&
      grant.status === "pending" &&
      Date.now() - Date.parse(grant.requested_at) < RENOTIFY_MS
    )
      // Email lần trước vẫn còn hiệu lực: không gửi lại, không trả notified (trang xin quyền chỉ báo lỗi email khi notified === false)
      return json({ status: "pending", resent: false });

    await db
      .prepare(
        `INSERT INTO share_grants (id, page, email, status, reason, requested_at) VALUES (?, ?, ?, 'pending', ?, ?)
         ON CONFLICT (page, email) DO UPDATE SET status = 'pending', reason = excluded.reason,
           requested_at = excluded.requested_at, decided_at = NULL, decided_by = NULL`,
      )
      .bind(crypto.randomUUID(), page, guest, reason, now())
      .run();
    const notified = await notify(env, {
      type: "request",
      to: info.owner,
      guest_email: guest,
      page,
      page_title: info.title,
      page_url: pageUrl(site, page),
      manage_url: manageUrl(site, page),
      reason,
    });
    return json({ status: "pending", notified });
  }

  if (!isTeam(email)) return json({ error: "forbidden" }, 403);

  if (request.method === "GET") {
    const only = sharePage(url.searchParams.get("page"));
    // Không có danh sách trang chia sẻ chung (thẻ share nằm trong từng trang): liệt kê các trang đã có yêu cầu,
    // cộng trang ?page= nếu có
    const { results: used } = await db.prepare("SELECT DISTINCT page FROM share_grants").all();
    const names = only ? [only] : [...new Set(used.map((r) => r.page))];
    const pages = await Promise.all(
      names.filter(looksLikePage).map(async (page) => {
        const { owner, title, shared } = await pageMeta(env, url.origin, page);
        return { page, owner, title, shared, can_decide: canDecide(email, owner) };
      }),
    );
    const { results } = await db
      .prepare(
        only
          ? "SELECT * FROM share_grants WHERE page = ? ORDER BY requested_at DESC"
          : "SELECT * FROM share_grants ORDER BY requested_at DESC LIMIT 1000",
      )
      .bind(...(only ? [only] : []))
      .all();
    return json({ me: email, pages, grants: results });
  }

  if (request.method === "PATCH") {
    const b = await request.json().catch(() => null);
    const row =
      b?.id &&
      (await db
        .prepare("SELECT * FROM share_grants WHERE id = ?")
        .bind(b.id)
        .first());
    if (!row) return json({ error: "not found" }, 404);
    const info = await pageMeta(env, url.origin, row.page);
    if (!canDecide(email, info.owner))
      return json({ error: "only the page owner can decide" }, 403);
    const next = { approve: "approved", reject: "rejected", revoke: "revoked" }[
      b.action
    ];
    if (!next)
      return json({ error: "action must be approve | reject | revoke" }, 400);
    // Trang đã bỏ thẻ share: vẫn từ chối / thu hồi được, không duyệt mới
    if (next === "approved" && !info.shared)
      return json({ error: "page is not shared" }, 409);
    await db
      .prepare(
        "UPDATE share_grants SET status = ?, decided_at = ?, decided_by = ? WHERE id = ?",
      )
      .bind(next, now(), email.toLowerCase(), row.id)
      .run();
    let notified = false;
    if (next === "approved" && row.status !== "approved") {
      notified = await notify(env, {
        type: "approved",
        to: row.email,
        guest_email: row.email,
        page: row.page,
        page_title: info.title,
        page_url: pageUrl(site, row.page),
      });
    }
    const updated = await db
      .prepare("SELECT * FROM share_grants WHERE id = ?")
      .bind(row.id)
      .first();
    return json({ ...updated, notified });
  }

  return json({ error: "method not allowed" }, 405);
}
