// Gắn script góp ý và script lịch sử vào mọi trang HTML khi trả về, để không phải sửa từng file trang.
// /<trang>?v=<sha> trả bản cũ của trang (functions/api/history.js), không gắn góp ý.
// Lỗi khi gắn thì trả nguyên trang gốc, không làm hỏng trang.
import { oldVersion } from "./api/history.js";
import { currentUser } from "./api/comments.js";
import { sharePage, looksLikePage, isTeam, configureTeam, grantOf, escapeHtml, pageMeta, guestCanLoadImage, GUEST_FILE_EXT } from "../_share/lib.js";

// Khách ngoài (người không phải team, _share/lib.js isTeam; Cloudflare Access chỉ xác nhận email bằng mã gửi về hộp thư) chỉ được:
// trang có thẻ <meta name="share" content="guest"> mà mình đã được duyệt (bảng share_grants), trang "Xin quyền xem" của
// trang có thẻ đó, ảnh mà các trang đã được duyệt dùng, /api/share (gửi yêu cầu), /api/comments (API tự giới hạn theo
// trang đã duyệt), script góp ý và file sáng / tối. Mọi đường dẫn khác (trang khác, lịch sử, bản cũ ?v=) trả 403. Access cho mọi email đã xác nhận đi qua,
// nên middleware là lớp chặn duy nhất giữa khách và các trang nội bộ (CLAUDE.md §13).
const GUEST_ASSET = /^\/_theme\/[a-z0-9-]+\.(css|js)$/;
const GUEST_API = new Set(["/api/share", "/api/comments"]);
const GUEST_SCRIPT = "/_comments/comments.js";
// Ảnh: khách tải được ảnh mà 1 trang khách đã được duyệt dùng tới (src / srcset / href / url(...), _share/lib.js pageImages),
// ảnh đặt ở thư mục nào cũng được
// (kể cả video, pdf, zip mà trang nhúng hoặc gắn link: GUEST_FILE_EXT ở _share/lib.js)
const GUEST_IMAGE = GUEST_FILE_EXT;
// Kết quả kiểm tra quyền tải ảnh giữ 30 giây trong 1 isolate (trang có ~30 ảnh, mỗi ảnh 1 truy vấn D1);
// thu hồi quyền chậm tối đa 30 giây với ảnh, trang và góp ý vẫn kiểm tra mỗi lần
const imageGrantCache = new Map();
const IMAGE_GRANT_TTL_MS = 30 * 1000;
const RENOTIFY_MS = 10 * 60 * 1000; // khớp functions/api/share.js: quá 10 phút đang chờ thì cho gửi lại
const VIEWPORT = '<meta name="viewport" content="width=device-width,initial-scale=1">';
const BOX = "font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:0 20px;color:#1f2937;line-height:1.5";
const htmlResponse = (body, status) =>
  new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
// Thanh "Đang xem bởi <email>" ở góc dưới bên trái mọi trang (bên phải đã có nút góp ý, lịch sử, sáng / tối).
// Phiên đăng nhập của Access gắn với cả tên miền, nên đổi email = đăng xuất (/cdn-cgi/access/logout) rồi đăng nhập lại.
// "Đổi email": mở trang đăng xuất ở tab phụ (trang đó không có đường quay về), đóng tab rồi tải lại trang đang xem để
// Access hỏi email mới; trình duyệt chặn tab phụ thì chuyển thẳng sang trang đăng xuất.
const BAR_BTN =
  "margin-left:6px;padding:2px 10px;border:1px solid #dadce0;border-radius:12px;background:#fff;color:#1a73e8;" +
  "font:inherit;cursor:pointer;text-decoration:none;white-space:nowrap";
const viewerBar = (email) => {
  if (!email) return "";
  const team = isTeam(email);
  return (
    '<div id="docs-viewer" style="position:fixed;left:12px;bottom:12px;z-index:2147482990;display:flex;align-items:center;' +
    "flex-wrap:wrap;row-gap:4px;max-width:calc(100vw - 180px);box-sizing:border-box;padding:6px 10px;border:1px solid #dadce0;" +
    'border-radius:16px;background:#fff;color:#3c4043;font:12px/1.4 system-ui,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.15)">' +
    `<span>Đang xem bởi <b>${escapeHtml(email)}</b></span>` +
    (team ? `<a href="/_share/manage" style="${BAR_BTN}">Quản lý chia sẻ</a>` : "") +
    `<button type="button" data-act="switch" style="${BAR_BTN}">Đổi email</button>` +
    `<a href="/cdn-cgi/access/logout" style="${BAR_BTN}">Đăng xuất</a></div>` +
    '<script>document.querySelector(\'#docs-viewer [data-act="switch"]\').addEventListener("click",function(){' +
    'var w=window.open("/cdn-cgi/access/logout","_blank");if(!w){location.href="/cdn-cgi/access/logout";return}' +
    'this.disabled=true;this.textContent="Đang đăng xuất…";' +
    "setTimeout(function(){try{w.close()}catch(e){}location.reload()},3000)});</script>"
  );
};
const denied = (email) =>
  htmlResponse(
    `<!doctype html><html lang="vi"><meta charset="utf-8">${VIEWPORT}<title>Chưa được chia sẻ</title><body style="${BOX}">` +
      "<h2>Trang này chưa được chia sẻ với bạn</h2>" +
      (email ? `<p>Bạn đang đăng nhập bằng <b>${escapeHtml(email)}</b>. Đăng nhập nhầm email thì bấm "Đổi email" ở góc dưới.</p>` : "") +
      "<p>Liên hệ người đã gửi link cho bạn để được chia sẻ trang.</p>" +
      '<p style="color:#6b7280">This page has not been shared with you. Please contact the person who sent you the link.</p>' +
      viewerBar(email) +
      "</body></html>",
    403,
  );

// Trang "Xin quyền xem" cho trang trong danh sách mà khách chưa được duyệt
function requestPage(page, info, grant, email) {
  const status = grant ? grant.status : "";
  const when = grant ? new Date(grant.requested_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "";
  // Đang chờ quá 10 phút (có thể email tới người phụ trách không đi) → cho gửi lại yêu cầu
  const canResend = status === "pending" && Date.now() - Date.parse(grant.requested_at) >= RENOTIFY_MS;
  const notes = {
    pending:
      `Bạn đã gửi yêu cầu lúc ${escapeHtml(when)}. Người phụ trách trang sẽ duyệt; bạn nhận email khi được duyệt.` +
      (canResend ? " Chờ lâu chưa thấy phản hồi thì gửi lại yêu cầu bên dưới." : ""),
    rejected: "Yêu cầu trước của bạn đã bị từ chối. Bạn có thể gửi lại kèm lý do rõ hơn.",
    revoked: "Quyền xem trang của bạn đã bị thu hồi. Bạn có thể xin lại.",
  };
  const form =
    status === "pending" && !canResend
      ? ""
      : '<form id="f"><p><label for="r"><b>Lý do cần xem trang</b> (tên, công ty, mục đích)</label></p>' +
        '<textarea id="r" required maxlength="1000" style="width:100%;height:110px;box-sizing:border-box;padding:8px;font:inherit"></textarea>' +
        '<p><button style="padding:8px 16px;border:0;border-radius:6px;background:#1a73e8;color:#fff;font:inherit;cursor:pointer">' +
        (canResend ? "Gửi lại yêu cầu" : "Xin quyền xem") +
        "</button></p></form>";
  return htmlResponse(
    `<!doctype html><html lang="vi"><meta charset="utf-8">${VIEWPORT}<title>Xin quyền xem: ${escapeHtml(info.title)}</title><body style="${BOX}">` +
      `<h2>${escapeHtml(info.title)}</h2>` +
      `<p>Bạn đang đăng nhập bằng <b>${escapeHtml(email)}</b>. Trang này cần người phụ trách duyệt trước khi bạn xem được.</p>` +
      '<p style="color:#6b7280">You need permission to view this page. Request access below; you will get an email once approved.</p>' +
      `<p id="s" style="color:#92400e">${notes[status] || ""}</p>` +
      form +
      `<script>const f=document.getElementById("f");f&&f.addEventListener("submit",async(e)=>{e.preventDefault();` +
      `const b=f.querySelector("button");b.disabled=true;const s=document.getElementById("s");` +
      `try{const r=await fetch("/api/share",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},` +
      `body:JSON.stringify({page:${JSON.stringify(page)},reason:document.getElementById("r").value})});` +
      `const d=await r.json();if(d.status==="approved"){location.reload();return}` +
      `if(!r.ok)throw new Error(d.error||r.status);f.remove();s.textContent=d.notified===false` +
      `?"Đã lưu yêu cầu nhưng chưa gửi được email cho người phụ trách. Hãy báo người đã gửi link cho bạn."` +
      `:"Đã gửi yêu cầu. Bạn sẽ nhận email khi được duyệt."}` +
      `catch(err){b.disabled=false;s.textContent="Không gửi được yêu cầu, thử lại sau ("+err.message+")."}});</script>` +
      viewerBar(email) +
      "</body></html>",
    200,
  );
}

async function guestRequest(context, url, email) {
  if (GUEST_API.has(url.pathname)) return context.next();
  const method = context.request.method;
  if (method !== "GET" && method !== "HEAD") return denied(email);
  if (GUEST_ASSET.test(url.pathname) || url.pathname === GUEST_SCRIPT) return context.next();
  if (GUEST_IMAGE.test(url.pathname)) {
    if (!email) return denied(email);
    const key = `${email.toLowerCase()}|${url.pathname}`;
    const hit = imageGrantCache.get(key);
    let approved = hit && Date.now() - hit.at < IMAGE_GRANT_TTL_MS ? hit.approved : null;
    if (approved === null) {
      approved = await guestCanLoadImage(context.env, url.origin, url.pathname, email);
      // Khoá theo từng đường dẫn ảnh: giới hạn kích thước để khách gửi đường dẫn lạ liên tục không làm đầy bộ nhớ isolate
      if (imageGrantCache.size >= 5000) imageGrantCache.clear();
      imageGrantCache.set(key, { approved, at: Date.now() });
    }
    if (!approved) return denied(email);
    // Chỉ trả file thật: đường dẫn không có file thì Pages có thể trả trang HTML khác (vd index.html ở gốc).
    // Bỏ ETag / ngày sửa trình duyệt gửi lên: Pages trả 304 (không có content-type ảnh) thì ảnh đã lưu bị thay bằng trang 403
    const request = new Request(context.request);
    request.headers.delete("If-None-Match");
    request.headers.delete("If-Modified-Since");
    const response = await context.next(request);
    const type = response.headers.get("content-type") || "";
    return response.status === 200 && type && !type.includes("text/html") ? response : denied(email);
  }
  const page = sharePage(url.pathname);
  if (!email || !looksLikePage(url.pathname)) return denied(email);
  const info = await pageMeta(context.env, url.origin, page);
  if (!info.shared) return denied(email);
  const grant = await grantOf(context.env.COMMENTS_DB, page, email);
  if (!grant || grant.status !== "approved") return requestPage(page, info, grant, email);
  // Đã duyệt: bản mới nhất (bỏ qua ?v=), có góp ý, không có lịch sử
  const request = new Request(context.request);
  request.headers.delete("If-None-Match");
  request.headers.delete("If-Modified-Since");
  const response = await context.next(request);
  if (!(response.headers.get("content-type") || "").includes("text/html")) return response;
  return withTheme(
    new HTMLRewriter().on("body", { element: (el) => el.append(TAG + viewerBar(email), { html: true }) }).transform(response),
  );
}

const TAG = '<script src="/_comments/comments.js" defer></script>';
const HISTORY_TAG = '<script src="/_history/history.js" defer></script>';
// Chế độ sáng / tối (_theme/): đặt html[data-theme] ngay trong <head> để trang không hiện nền sáng rồi mới chuyển tối
const THEME_HEAD =
  '<link rel="stylesheet" href="/_theme/theme.css">' +
  '<script>try{var t=localStorage.getItem("docs-theme");if(t!=="dark"&&t!=="light")' +
  't=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}</script>';
const THEME_TAG = '<script src="/_theme/theme.js" defer></script>';

// Chỉ trang theo file mẫu (khối style có biến --slate-bg) mới có chế độ tối: trang tự viết CSS riêng
// có thể trùng tên biến với mẫu, áp theme tối vào sẽ chỉ đổi được một phần màu.
async function withTheme(response) {
  if (response.status !== 200 || !(response.headers.get("content-type") || "").includes("text/html"))
    return response;
  const html = await response.text();
  const page = new Response(html, response);
  if (!html.includes("--slate-bg")) return page;
  return new HTMLRewriter()
    .on("head", { element: (el) => el.append(THEME_HEAD, { html: true }) })
    .on("body", { element: (el) => el.append(THEME_TAG, { html: true }) })
    .transform(page);
}

export async function onRequest(context) {
  await configureTeam(context.env);
  const url = new URL(context.request.url);
  const email = await currentUser(context.request, context.env);
  // Có JWT của Access mà không kiểm tra được (khoá ký lỗi, AUD lệch, hết hạn): báo lỗi xác thực, không coi là khách
  if (!email && context.request.headers.get("Cf-Access-Jwt-Assertion"))
    return htmlResponse(
      `<!doctype html><html lang="vi"><meta charset="utf-8">${VIEWPORT}<title>Lỗi xác thực</title><body style="${BOX}">` +
        "<h2>Không xác thực được phiên đăng nhập</h2><p>Tải lại trang. Lỗi còn lặp lại thì báo anh SH.</p>" +
        '<p style="color:#6b7280">Could not verify your sign-in. Please reload the page.</p></body></html>',
      503,
    );
  if (!isTeam(email)) return guestRequest(context, url, email);
  const v = url.searchParams.get("v");
  // Chỉ đường dẫn trang (không đuôi hoặc đuôi .html); ảnh, CSS có ?v= vẫn trả file như thường
  if (v && context.request.method === "GET" && !url.pathname.startsWith("/api/") && /(^|\/)[^./]*(\.html)?$/.test(url.pathname))
    return withTheme(await oldVersion(context, url.pathname.replace(/\.html$/, ""), v, HISTORY_TAG));
  // Trang (không đuôi hoặc đuôi .html): bỏ ETag / ngày sửa mà trình duyệt gửi lên, để Pages luôn trả trang đầy đủ
  // rồi gắn script mới nhất. Giữ ETag thì file trang không đổi → Pages trả 304 → trình duyệt dùng lại bản đã lưu,
  // không có phần mới gắn thêm (vd chế độ tối) cho tới khi trang được sửa.
  let request = context.request;
  if (/(^|\/)[^./]*(\.html)?$/.test(url.pathname)) {
    request = new Request(request);
    request.headers.delete("If-None-Match");
    request.headers.delete("If-Modified-Since");
  }
  const response = await context.next(request);
  if (!(response.headers.get("content-type") || "").includes("text/html"))
    return response;
  // Bản sao để trả trang gốc khi gắn script bị lỗi (body của response đã đưa vào HTMLRewriter thì không đọc lại được)
  const original = response.clone();
  try {
    return await withTheme(
      new HTMLRewriter()
        .on("body", { element: (el) => el.append(TAG + HISTORY_TAG + viewerBar(email), { html: true }) })
        .transform(response),
    );
  } catch {
    return original;
  }
}
