// Hàm dùng chung cho chức năng chia sẻ trang với khách ngoài (functions/_middleware.js, functions/api/share.js,
// functions/api/comments.js). Đặt ngoài functions/ để Pages không coi file này là 1 route.
// Khách = người không phải team (isTeam bên dưới). Khách chỉ xem được trang có thẻ <meta name="share" content="guest"> và đã được
// duyệt (dòng approved trong bảng share_grants, _share/schema.sql). Người phụ trách trang lấy từ thẻ
// <meta name="owner" content="x@pancake.vn"> của chính trang (CLAUDE.md §6), tiêu đề lấy từ <title>.

export const TEAM_SUFFIX = "@pancake.vn";
// Ngoài người phụ trách từng trang, anh SH duyệt / thu hồi được mọi trang; trang thiếu owner thì email gửi anh SH
export const SUPER_APPROVER = "sh@pancake.vn";

// "/ffm/wms/x.html", "ffm/wms/x/" → "ffm/wms/x"
export const sharePage = (path) =>
  String(path || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html$/, "");

// Người xem mọi trang ("team"). Mặc định: email đuôi @pancake.vn (ffm-docs-html). Site có biến TEAM_LIST = "d1"
// (bigate-docs-html) thì chỉ những email trong bảng share_team (_share/schema.sql), đọc lại tối đa 1 lần mỗi phút.
// "claude:<email>" chỉ có khi service token của Claude đã được kiểm tra (functions/api/comments.js currentUser) → luôn là team.
// await configureTeam(env) phải được gọi đầu mỗi request (middleware và từng API) trước khi dùng isTeam.
let teamEmails = null;
let teamCache = { emails: null, at: 0 };
export async function configureTeam(env) {
  if (env.TEAM_LIST !== "d1") {
    teamEmails = null;
    return;
  }
  if (!teamCache.emails || Date.now() - teamCache.at >= 60 * 1000) {
    try {
      const { results } = await env.COMMENTS_DB.prepare("SELECT email FROM share_team").all();
      teamCache = { emails: new Set(results.map((r) => String(r.email).toLowerCase())), at: Date.now() };
    } catch (e) {
      // Đọc lỗi thì dùng danh sách lần trước; chưa có lần nào thì báo lỗi (không coi mọi người là team hay là khách)
      if (!teamCache.emails) throw e;
    }
  }
  teamEmails = teamCache.emails;
}
export const isTeam = (email) => {
  if (!email) return false;
  const e = email.toLowerCase();
  if (e.startsWith("claude:")) return true;
  return teamEmails ? teamEmails.has(e) : e.endsWith(TEAM_SUFFIX);
};

const OWNER_TAG = /<meta\b[^>]*\sname=["']owner["'][^>]*>/i;
const SHARE_TAG = /<meta\b[^>]*\sname=["']share["'][^>]*>/i;
// File khách được tải: mọi đường dẫn ảnh, video, tệp đính kèm cùng site mà trang dùng (src, srcset, href, data-src,
// url(...) trong CSS). Khớp với GUEST_FILE ở functions/_middleware.js
export const GUEST_FILE_EXT = /\.(webp|png|jpe?g|gif|svg|avif|mp4|webm|mov|pdf|zip|csv|xlsx?)$/i;
const IMAGE_REF = /(?:\s(?:src|href|data-src|srcset)\s*=\s*["']([^"']+)["'])|(?:url\(\s*["']?([^"')]+)["']?\s*\))/gi;
const CONTENT_ATTR = /\scontent=["']([^"']*)["']/i;
const TITLE_TAG = /<title>([^<]*)<\/title>/i;
const unescapeHtml = (s) =>
  s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]);
// Đường dẫn ảnh cùng site mà trang dùng, dạng pathname đã chuẩn hoá (so trực tiếp với url.pathname của request ảnh)
function pageImages(html, pageUrl) {
  const images = new Set();
  for (const m of html.matchAll(IMAGE_REF)) {
    for (const part of (m[1] || m[2] || "").split(",")) {
      const ref = part.trim().split(/\s+/)[0];
      if (!ref || ref.startsWith("data:")) continue;
      try {
        const u = new URL(ref, pageUrl);
        if (u.origin === pageUrl.origin && GUEST_FILE_EXT.test(u.pathname)) images.add(u.pathname);
      } catch {
        // đường dẫn hỏng: bỏ qua
      }
    }
  }
  return images;
}

// trang → { owner, title, shared, images, at }; giữ 5 phút trong 1 isolate. Đổi owner phải push → Pages tạo bản deploy mới với
// isolate mới nên có hiệu lực ngay; chỉ khi chạy `wrangler pages dev` ở máy (sửa HTML không nạp lại worker) mới thấy owner cũ.
const metaCache = new Map();

// Owner, tiêu đề, trạng thái chia sẻ và danh sách ảnh của trang, đọc từ file trang qua env.ASSETS.
// Owner thiếu / không phải 1 email @pancake.vn → anh SH. Trang không đọc được → shared = false.
export async function pageMeta(env, origin, page) {
  const hit = metaCache.get(page);
  if (hit && Date.now() - hit.at < 5 * 60 * 1000) return hit;
  const pageUrl = new URL("/" + page, origin);
  let html = "";
  let ok = false;
  try {
    const res = await env.ASSETS.fetch(pageUrl);
    if (res.ok && (res.headers.get("content-type") || "").includes("text/html")) {
      // Bỏ comment HTML: thẻ share / owner / ảnh nằm trong <!-- --> không có hiệu lực
      html = (await res.text()).replace(/<!--[\s\S]*?-->/g, "");
      ok = true;
    }
  } catch {
    html = "";
  }
  // Thẻ owner / share / <title> chỉ tìm trong <head>: chuỗi giống thẻ trong nội dung, script, SVG không bị lấy nhầm
  const head = html.split(/<\/head>/i)[0];
  const attr = (re) => ((head.match(re)?.[0].match(CONTENT_ATTR)?.[1]) || "").trim().toLowerCase();
  const owner = attr(OWNER_TAG);
  const title = unescapeHtml((head.match(TITLE_TAG)?.[1] || "").trim());
  const meta = {
    owner: /^[a-z0-9._%+-]+@pancake\.vn$/.test(owner) ? owner : SUPER_APPROVER,
    title: title || page,
    shared: ok && attr(SHARE_TAG) === "guest",
    images: ok ? pageImages(html, pageUrl) : new Set(),
    at: Date.now(),
  };
  // Đọc trang lỗi thì không lưu, để lần sau đọc lại thay vì giữ owner mặc định 5 phút
  if (ok) metaCache.set(page, meta);
  return meta;
}

export const canDecide = (email, owner) => {
  const e = String(email || "").toLowerCase();
  return e === owner || e === SUPER_APPROVER;
};

export const grantOf = (db, page, email) =>
  db
    .prepare("SELECT * FROM share_grants WHERE page = ? AND email = ?")
    .bind(page, String(email).toLowerCase())
    .first();

// Đường dẫn có dạng trang (không đuôi hoặc đuôi .html): chỉ những đường dẫn này mới đọc file để xem thẻ share
export const looksLikePage = (path) => /(^|\/)[^./]*(\.html)?$/.test(String(path || "")) && !!sharePage(path);

// Khách đã được duyệt xem trang chứa đường dẫn này chưa (trang phải còn thẻ share)
export async function guestCanView(env, origin, path, email) {
  const page = sharePage(path);
  if (!email || !looksLikePage(page)) return false;
  const grant = await grantOf(env.COMMENTS_DB, page, email);
  if (!grant || grant.status !== "approved") return false;
  return (await pageMeta(env, origin, page)).shared;
}

// Khách tải ảnh: ảnh phải nằm trong 1 trang mà khách đã được duyệt và trang đó còn thẻ share
export async function guestCanLoadImage(env, origin, pathname, email) {
  if (!email) return false;
  const { results } = await env.COMMENTS_DB.prepare("SELECT page FROM share_grants WHERE email = ? AND status = 'approved'")
    .bind(String(email).toLowerCase())
    .all();
  for (const { page } of results) {
    const meta = await pageMeta(env, origin, page);
    if (meta.shared && meta.images.has(pathname)) return true;
  }
  return false;
}

export const escapeHtml = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// Nhờ FFM gửi email (POST /api/docs_share/notify của sea-fulfillment, khoá ở header x-docs-share-secret).
// Thiếu cấu hình (chạy ở máy) hoặc FFM lỗi thì trả false; yêu cầu / quyết định vẫn đã lưu.
export async function notify(env, payload) {
  if (!env.FFM_API_BASE || !env.DOCS_SHARE_SECRET) return false;
  try {
    const res = await fetch(
      `${env.FFM_API_BASE.replace(/\/+$/, "")}/api/docs_share/notify`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-docs-share-secret": env.DOCS_SHARE_SECRET,
        },
        body: JSON.stringify(payload),
      },
    );
    // FFM trả HTTP 200 + success: false khi không nhận ra host ("Invalid app!"), nên phải đọc cả body
    const body = await res.json().catch(() => null);
    return res.ok && body?.success === true;
  } catch {
    return false;
  }
}
