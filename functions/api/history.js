// API lịch sử phiên bản: GET ?page=/<đường dẫn trang> → các lần sửa file <page>.html, lấy từ commit trên GitHub.
// Bản cũ do functions/_middleware.js trả ngay tại link trang (/<trang>?v=<sha>), dùng oldVersion() dưới đây,
// để ảnh, file đính kèm (đường dẫn tương đối) và mục lục #… của bản cũ vẫn đúng.
// GITHUB_TOKEN (chỉ đọc) là secret của project Pages; GITHUB_REPO, HISTORY_EXCLUDE khai trong wrangler.toml.
// Lỗi chỉ trả mã lỗi, không kèm token hay nội dung lỗi của GitHub.
import { currentUser } from "./comments.js";

// Chỉ chữ, số, / _ -: không có . % ? # nên không ghép được đường dẫn tới CLAUDE.md, wrangler.toml
const PAGE_RE = /^\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*$/;
const SHA_RE = /^[0-9a-f]{7,40}$/;
const LIST_TTL_MS = 60 * 1000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

// HISTORY_EXCLUDE: các tiền tố đường dẫn không có lịch sử, cách nhau bằng dấu phẩy (vd "/sample/")
const excluded = (page, env) =>
  String(env.HISTORY_EXCLUDE || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .some((prefix) => page.startsWith(prefix));

export const historyEnabled = (page, env) =>
  PAGE_RE.test(page) && !excluded(page, env);

const filePath = (page) =>
  page.slice(1).split("/").map(encodeURIComponent).join("/") + ".html";

const github = (env, path, accept) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: accept || "application/vnd.github+json",
      "User-Agent": "docs-html-history",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

// Lưu đệm trong bộ nhớ của tiến trình Functions đang chạy, để mở bảng / bản cũ liên tục không gọi GitHub mỗi lần
const memo = new Map();

async function versions(page, env) {
  const hit = memo.get(page);
  if (hit && Date.now() - hit.at < LIST_TTL_MS) return hit.list;
  const res = await github(env, `/commits?path=${filePath(page)}&per_page=100`);
  if (!res.ok) throw new Error(`github ${res.status}`);
  const list = (await res.json()).map((c) => ({
    sha: c.sha,
    date: c.commit.committer.date,
    // Tên người sửa lấy theo tên git trong commit; không trả email
    author: (c.commit.author && c.commit.author.name) || "",
    message: c.commit.message.split("\n")[0].slice(0, 200),
  }));
  memo.set(page, { at: Date.now(), list });
  return list;
}

// "02/11/2026 09:57" theo giờ Việt Nam (toLocaleString vi-VN đặt giờ trước ngày)
const fmtDate = (iso) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value]),
  );
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};
const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
const notFound = () => new Response("Not found", { status: 404 });

// Trả nội dung trang ở commit v, kèm dải báo bản cũ ở đầu trang; không gắn script góp ý
export async function oldVersion({ request, env }, page, v, historyTag) {
  if (!(await currentUser(request, env)))
    return new Response("Unauthorized", { status: 401 });
  if (!historyEnabled(page, env) || !SHA_RE.test(v) || !env.GITHUB_TOKEN)
    return notFound();
  let list;
  try {
    list = await versions(page, env);
  } catch {
    return new Response("Không lấy được lịch sử", { status: 502 });
  }
  // Chỉ nhận commit có trong lịch sử của đúng file này (không đọc được bản ở nhánh khác)
  const version = list.find((c) => c.sha.startsWith(v));
  if (!version) return notFound();
  // Nội dung 1 commit không đổi: lưu đệm trên Cloudflare (nếu tên miền hỗ trợ Cache API), tránh gọi GitHub lại
  const cacheKey = new Request(
    `https://history.cache/${env.GITHUB_REPO}/${version.sha}/${filePath(page)}`,
  );
  const cache = globalThis.caches ? caches.default : null;
  let res = cache ? await cache.match(cacheKey).catch(() => null) : null;
  if (!res) {
    res = await github(
      env,
      `/contents/${filePath(page)}?ref=${version.sha}`,
      "application/vnd.github.raw",
    );
    if (res.status === 404)
      return new Response(
        "Bản này không còn nội dung: file bị xoá ở lần sửa này.",
        { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    if (!res.ok) return new Response("Không lấy được lịch sử", { status: 502 });
    res = new Response(await res.text(), {
      headers: { "cache-control": "public, max-age=31536000" },
    });
    if (cache) await cache.put(cacheKey, res.clone()).catch(() => {});
  }
  const banner =
    `<div data-ffm-comment-ui style="position:sticky;top:0;z-index:2147483001;padding:10px 16px;` +
    `background:#fef3c7;border-bottom:1px solid #fcd34d;color:#78350f;` +
    `font:13px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">` +
    `Bản cũ ngày <b>${fmtDate(version.date)}</b>${version.author ? ` của <b>${escapeHtml(version.author)}</b>` : ""} — ${escapeHtml(version.message)} · ` +
    `<a href="${page}" style="color:#1a73e8;font-weight:600">Xem bản mới nhất</a></div>`;
  return new HTMLRewriter()
    .on("body", {
      element: (el) => {
        el.prepend(banner, { html: true });
        el.append(historyTag, { html: true });
      },
    })
    .transform(
      new Response(res.body, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "private, max-age=3600",
        },
      }),
    );
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET") return json({ error: "method" }, 405);
  if (!(await currentUser(request, env)))
    return json({ error: "unauthorized" }, 401);
  const page = String(
    new URL(request.url).searchParams.get("page") || "",
  ).replace(/\.html$/, "");
  if (!historyEnabled(page, env)) return json({ enabled: false });
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO)
    return json({ error: "not_configured" }, 503);
  try {
    return json({ enabled: true, versions: await versions(page, env) });
  } catch {
    return json({ error: "github" }, 502);
  }
}
