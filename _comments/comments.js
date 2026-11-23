// Góp ý chung cho team trên trang ffm-docs-html, kiểu Google Docs: bôi đen chữ → nút góp ý → lưu vào D1 qua /api/comments.
// functions/_middleware.js tự gắn script này vào mọi trang HTML. Không sửa nội dung trang:
// đoạn được góp ý tô vàng bằng CSS Custom Highlight, giao diện góp ý nằm trong các phần tử có thuộc tính data-ffm-comment-ui.
// Màn hình rộng: thẻ góp ý nằm ở cột bên phải ngang dòng được tô (trang dịch sang trái để chừa cột).
// Màn hình hẹp: số thứ tự cạnh đoạn tô + bảng góp ý ở góc.
(() => {
  if (window.__ffmComments) return;
  window.__ffmComments = true;

  const API = "/api/comments";
  const PAGE = location.pathname.replace(/\.html$/, "");
  const Z = 2147483000;
  const UI = "data-ffm-comment-ui";
  const FONT = '13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const BLUE = "#1a73e8";
  const RAIL_W = 300; // độ rộng cột thẻ góp ý
  const WIDE_MIN = 1100; // màn hình từ độ rộng này trở lên mới hiện cột bên phải
  let me = "";
  let comments = [];
  let showResolved = false;
  let open = false;
  let editor = null;
  let drafting = false; // đang viết góp ý mới ở cột bên phải
  let active = null; // id góp ý đang chọn: thẻ ngang đúng dòng, ô trả lời mở
  let pending = null; // vùng chữ đang bôi đen, chờ bấm nút góp ý
  let marks = [];

  const isWide = () => innerWidth >= WIDE_MIN;
  const make = (tag, css, text) => {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    e.setAttribute(UI, "");
    return e;
  };
  const link = (label, onClick, color = BLUE) => {
    const a = make("button", `border:0;background:none;padding:0;margin-right:10px;color:${color};font:${FONT};cursor:pointer`, label);
    a.addEventListener("click", (e) => { e.stopPropagation(); onClick(a); });
    return a;
  };
  const btn = (label, primary) => make("button", `font:${FONT};padding:4px 12px;border-radius:4px;cursor:pointer;` +
    (primary ? `border:0;background:${BLUE};color:#fff` : `border:0;background:none;color:${BLUE}`), label);
  const find = (selector) => { try { return selector ? document.querySelector(selector) : null; } catch { return null; } };
  const isUi = (node) => {
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    return !!(el && el.closest(`[${UI}]`));
  };
  // "claude:sh@pancake.vn" = câu Claude viết thay sh (service token của Claude), hiện "sh (via Claude)"
  const isClaude = (email) => (email || "").startsWith("claude:");
  const shortName = (email) => (isClaude(email) ? `${shortName(email.slice(7))} (via Claude)` : (email || "").split("@")[0]);
  const ownedByMe = (c) => c.author_email === me || c.author_email === `claude:${me}`;
  // Khách ngoài (email không đuôi @pancake.vn, CLAUDE.md §13): chỉ thấy chuỗi góp ý của mình, không đánh dấu đã xử lý.
  // Team thấy nhãn "Khách xem được" ở chuỗi do khách mở: câu trả lời trong chuỗi đó khách đọc được.
  // Ai là khách do server quyết định (danh sách người xem của từng site, _share/lib.js isTeam): cờ guest / author_guest
  let meGuest = false;
  const iAmGuest = () => meGuest;
  const fmt = (iso) => new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  const toast = (msg) => {
    const t = make("div", "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);padding:8px 14px;" +
      `background:#202124;color:#fff;font:${FONT};border-radius:6px;z-index:${Z + 3}`, msg);
    document.documentElement.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  };

  const selectorOf = (el) => {
    const parts = [];
    for (; el && el.nodeType === 1 && el !== document.documentElement; el = el.parentElement) {
      if (el.id) { parts.unshift("#" + CSS.escape(el.id)); break; }
      let part = el.localName;
      const same = el.parentElement
        ? [...el.parentElement.children].filter((c) => c.localName === el.localName) : [];
      if (same.length > 1) part += `:nth-of-type(${same.indexOf(el) + 1})`;
      parts.unshift(part);
    }
    return parts.join(" > ");
  };

  // Tìm lại đoạn đã bôi đen trong phần tử theo nội dung chữ (Range.toString() = nối các text node)
  const findRange = (c) => {
    const el = find(c.selector);
    if (!el || !c.quote) return null;
    const nodes = [];
    let full = "";
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) { nodes.push([n, full.length]); full += n.data; }
    const start = full.indexOf(c.quote);
    if (start < 0) return null;
    const end = start + c.quote.length;
    const at = (pos, isEnd) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const [n, off] = nodes[i];
        if (isEnd ? off < pos : off <= pos) return [n, pos - off];
      }
    };
    const range = document.createRange();
    range.setStart(...at(start, false));
    range.setEnd(...at(end, true));
    return range;
  };

  const api = async (method, body, query = "") => {
    let res;
    try {
      res = await fetch(API + query, {
        method,
        credentials: "same-origin",
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new Error("Không gửi được góp ý, có thể phiên đăng nhập đã hết: tải lại trang");
    }
    if (res.status === 401) throw new Error("Phiên đăng nhập đã hết: tải lại trang để đăng nhập lại");
    if (!res.ok) throw new Error(`Lỗi máy chủ góp ý (HTTP ${res.status})`);
    return res.json();
  };
  const load = async () => {
    try {
      const data = await api("GET", null, "?page=" + encodeURIComponent(PAGE));
      me = data.me;
      meGuest = data.guest === true;
      comments = data.comments;
      render();
    } catch (e) {
      toast(e.message);
    }
  };
  const act = async (method, body, query) => {
    try { await api(method, body, query); await load(); return true; } catch (e) { toast(e.message); return false; }
  };

  document.head.appendChild(make("style", null,
    "::highlight(ffm-comment){background:rgba(250,204,21,.4)}::highlight(ffm-comment-active){background:rgba(250,204,21,.9)}"));

  // Cột thẻ đặt sát mép phải phần nội dung (.wrap của mẫu trang); không đủ chỗ thì thêm padding-right cho body
  // để nội dung dịch sang trái. Chỉ tính lại khi đổi độ rộng màn hình hoặc đổi có / không có thẻ.
  const GAP = 24;
  const bodyPad = document.body.style.paddingRight;
  let layoutKey = "";
  const contentRight = () => {
    const el = document.querySelector(".wrap, main");
    if (el) return el.getBoundingClientRect().right;
    return document.documentElement.clientWidth - (parseFloat(getComputedStyle(document.body).paddingRight) || 0);
  };
  const applyLayout = () => {
    const need = isWide() && (drafting || marks.some((m) => targetOf(m)));
    const key = `${need}|${document.documentElement.clientWidth}`;
    if (key !== layoutKey) {
      layoutKey = key;
      document.body.style.paddingRight = bodyPad;
      const base = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      let pad = base;
      let k = 0.5; // mép phải nội dung dịch bao nhiêu px khi thêm 1px padding (căn giữa: 0.5, khối bị thu hẹp: tới 1)
      for (let i = 0; need && i < 6; i++) {
        const right = contentRight();
        const missing = right + GAP + RAIL_W + 16 - document.documentElement.clientWidth;
        if (Math.abs(missing) < 2 || (missing < 0 && pad === base)) break;
        const next = Math.max(base, pad + missing / k);
        document.body.style.paddingRight = next + "px";
        const moved = right - contentRight();
        if (next !== pad && moved > 0) k = moved / (next - pad);
        pad = next;
      }
    }
    rail.style.left = contentRight() + GAP + scrollX + "px";
  };

  const closeEditor = () => {
    if (editor) editor.remove();
    editor = null;
    if (drafting) { drafting = false; position(); }
  };
  // r: vị trí neo; at: {left, top} đặt sẵn (cột bên phải), không có thì đặt ngay dưới r
  const openEditor = (r, { title, initial = "", submitLabel = "Gửi", onSubmit, at }) => {
    if (editor) editor.remove();
    const w = at ? RAIL_W : 320;
    const pos = at || { left: r.left, top: r.bottom + 6 };
    editor = make("div", `position:fixed;z-index:${Z + 2};width:${w}px;box-sizing:border-box;background:#fff;border:1px solid #dadce0;` +
      `border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.2);padding:10px;font:${FONT};color:#202124;` +
      `left:${Math.max(8, Math.min(pos.left, innerWidth - w - 8))}px;top:${Math.max(8, Math.min(pos.top, innerHeight - 170))}px`);
    const ta = make("textarea", `width:100%;height:72px;box-sizing:border-box;font:${FONT};padding:6px;` +
      "border:1px solid #dadce0;border-radius:4px;resize:vertical");
    ta.value = initial;
    ta.placeholder = "Viết góp ý (Cmd/Ctrl + Enter để gửi, Esc để huỷ)";
    const ok = btn(submitLabel, true);
    const cancel = btn("Huỷ");
    const submit = async () => {
      const text = ta.value.trim();
      if (!text) return;
      ok.disabled = true;
      if (await onSubmit(text)) closeEditor();
      else ok.disabled = false;
    };
    ok.addEventListener("click", submit);
    cancel.addEventListener("click", closeEditor);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
      if (e.key === "Escape") closeEditor();
    });
    const row = make("div", "display:flex;gap:6px;justify-content:flex-end;margin-top:8px");
    row.append(cancel, ok);
    editor.append(make("div", "font-weight:600;margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap", title), ta, row);
    document.documentElement.appendChild(editor);
    ta.focus();
  };

  // Nút góp ý tròn hiện cạnh vùng bôi đen
  const bubble = make("button", `position:fixed;z-index:${Z + 1};display:none;width:36px;height:36px;padding:0;` +
    "border:0;border-radius:18px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.25);cursor:pointer");
  bubble.title = "Thêm góp ý";
  bubble.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#444" style="vertical-align:middle">' +
    '<path d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4zm-2 13.17L18.83 16H4V4h16v13.17z' +
    'M13 5h-2v4H7v2h4v4h2v-4h4V9h-4z"/></svg>';
  document.documentElement.appendChild(bubble);
  const hideBubble = () => { bubble.style.display = "none"; pending = null; };
  const onSelect = () => setTimeout(() => {
    const sel = getSelection();
    if (!sel.rangeCount || sel.isCollapsed || !sel.toString().trim()) return hideBubble();
    const range = sel.getRangeAt(0);
    if (isUi(range.commonAncestorContainer)) return hideBubble();
    pending = range.cloneRange();
    const r = range.getBoundingClientRect();
    Object.assign(bubble.style, { display: "block", left: Math.max(8, Math.min(r.right - 18, innerWidth - 44)) + "px",
      top: Math.min(r.bottom + 6, innerHeight - 44) + "px" });
  });
  // Bấm vào đoạn đã tô vàng thì chọn góp ý đó; bấm chỗ khác thì bỏ chọn
  const hitMark = (x, y) => marks.find((m) => m.range &&
    [...m.range.getClientRects()].some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom));
  document.addEventListener("mouseup", (e) => {
    if (isUi(e.target)) return;
    onSelect();
    if (!getSelection().isCollapsed) return;
    const m = hitMark(e.clientX, e.clientY);
    const id = m ? m.c.id : null;
    if (id !== active) { active = id; render(); }
  });
  document.addEventListener("keyup", (e) => { if (e.shiftKey || e.key === "Shift") onSelect(); });
  addEventListener("scroll", hideBubble, true);
  bubble.addEventListener("mousedown", (e) => e.preventDefault()); // giữ vùng bôi đen khi bấm nút
  bubble.addEventListener("click", () => {
    if (!pending) return;
    const range = pending;
    hideBubble();
    const c = range.commonAncestorContainer;
    const selector = selectorOf(c.nodeType === 1 ? c : c.parentElement);
    const quote = range.toString().slice(0, 1000);
    drafting = isWide();
    applyLayout(); // chừa cột trước, rồi mới lấy vị trí đoạn chữ (trang đã dịch sang trái)
    const r = range.getBoundingClientRect();
    openEditor(r, {
      title: `Góp ý cho “${quote}”`,
      at: drafting ? { left: contentRight() + GAP, top: r.top } : null,
      onSubmit: async (body) => {
        const done = await act("POST", { page: PAGE, selector, quote, body });
        if (done && !isWide()) { open = true; render(); }
        return done;
      },
    });
  });

  // Cột thẻ góp ý bên phải (màn hình rộng), nút mở bảng góp ý (luôn hiện) và bảng góp ý
  const rail = make("div", `position:absolute;top:0;left:0;width:${RAIL_W}px;z-index:${Z - 2}`);
  const launcher = make("button", `position:fixed;right:16px;bottom:16px;z-index:${Z};padding:8px 14px;border:0;` +
    `border-radius:20px;background:${BLUE};color:#fff;font:${FONT};font-weight:600;cursor:pointer;` +
    "box-shadow:0 2px 8px rgba(0,0,0,.25)");
  launcher.addEventListener("click", () => { open = !open; render(); });
  const panel = make("div", `position:fixed;right:16px;bottom:60px;width:360px;max-height:70vh;display:none;` +
    "flex-direction:column;background:#fff;border:1px solid #dadce0;border-radius:8px;" +
    `box-shadow:0 4px 16px rgba(0,0,0,.2);font:${FONT};color:#202124;z-index:${Z}`);
  document.documentElement.append(rail, panel, launcher);

  const roots = () => comments.filter((c) => !c.parent_id);
  const repliesOf = (root) => comments.filter((c) => c.parent_id === root.id);
  const openRoots = () => roots().filter((c) => !c.resolved_at);
  const targetOf = (m) => m.range || find(m.c.selector);
  const scrollTo = (c) => {
    const m = marks.find((x) => x.c === c);
    const t = m && targetOf(m);
    const el = t && (t.nodeType ? t : t.startContainer.parentElement);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    else toast("Đoạn này không còn trên trang");
  };

  const commentRow = (c, isReply) => {
    const row = make("div", isReply ? "margin-top:8px;padding-top:8px;border-top:1px solid #f1f3f4" : "");
    const head = make("div", "display:flex;gap:6px;align-items:center");
    head.append(make("span", `width:22px;height:22px;border-radius:11px;background:${isClaude(c.author_email) ? "#7c3aed" : BLUE};color:#fff;font-size:11px;` +
      "display:inline-flex;align-items:center;justify-content:center;flex:none", shortName(c.author_email).slice(0, 1).toUpperCase()),
      make("b", null, shortName(c.author_email)),
      make("span", "color:#5f6368;font-size:11px", fmt(c.created_at) + (c.updated_at ? " · đã sửa" : "")));
    row.append(head, make("div", "white-space:pre-wrap;word-break:break-word;margin-top:2px", c.body));
    if (ownedByMe(c)) {
      const actions = make("div", "margin-top:2px");
      actions.append(
        link("Sửa", (a) => openEditor(a.getBoundingClientRect(), {
          title: "Sửa góp ý", initial: c.body, submitLabel: "Lưu", onSubmit: (body) => act("PATCH", { id: c.id, body }),
        }), "#5f6368"),
        link("Xoá", () => {
          if (confirm(c.parent_id ? "Xoá trả lời này?" : "Xoá góp ý này? Các trả lời cũng bị xoá.")) act("DELETE", null, "?id=" + encodeURIComponent(c.id));
        }, "#5f6368"));
      row.append(actions);
    }
    return row;
  };

  // 1 thẻ góp ý (dùng cho cả cột bên phải và bảng góp ý); thẻ đang chọn có ô trả lời
  const threadCard = (c, { quoteLine, gone, inPanel } = {}) => {
    const isActive = c.id === active;
    // Có cột bên phải thì ô trả lời chỉ hiện ở thẻ bên phải, danh sách tất cả góp ý không hiện
    const replyHere = isActive && !c.resolved_at && !(inPanel && isWide());
    const card = make("div", `box-sizing:border-box;background:#fff;border:1px solid ${isActive ? BLUE : "#dadce0"};border-radius:8px;` +
      `padding:10px;font:${FONT};color:#202124;cursor:pointer;transition:top .15s;` +
      (isActive ? "box-shadow:0 2px 10px rgba(0,0,0,.18);" : "") + (c.resolved_at ? "opacity:.6;" : ""));
    card.addEventListener("click", () => {
      if (inPanel && isWide()) {
        // Bấm trong danh sách: đóng danh sách, cuộn tới đoạn đó, chọn thẻ bên phải
        active = c.id;
        open = false;
        render();
        if (!c.resolved_at) scrollTo(c);
      } else if (active !== c.id) {
        active = c.id;
        render();
      }
    });
    if (quoteLine) {
      const q = make("div", "color:#5f6368;font-size:12px;border-left:3px solid #f59e0b;padding-left:6px;margin-bottom:6px;" +
        "white-space:nowrap;overflow:hidden;text-overflow:ellipsis", quoteLine + (gone ? " (không còn trên trang)" : ""));
      q.addEventListener("click", () => scrollTo(c));
      card.append(q);
    }
    if (!iAmGuest() && c.author_guest) {
      card.append(make("div", "display:inline-block;margin-bottom:6px;padding:1px 8px;border-radius:10px;background:#fef3c7;" +
        "color:#92400e;font-size:11px;font-weight:600", "Khách xem được"));
    }
    card.append(commentRow(c, false));
    repliesOf(c).forEach((r) => card.append(commentRow(r, true)));
    if (c.resolved_at) {
      card.append(make("div", "color:#188038;font-size:12px;margin-top:6px", `Đã xử lý bởi ${shortName(c.resolved_by)} lúc ${fmt(c.resolved_at)}`));
    }
    const actions = make("div", "margin-top:8px");
    if (replyHere) {
      const ta = make("textarea", `width:100%;height:52px;box-sizing:border-box;font:${FONT};padding:6px;` +
        "border:1px solid #dadce0;border-radius:4px;resize:vertical");
      ta.placeholder = "Trả lời (Cmd/Ctrl + Enter để gửi)";
      const send = btn("Trả lời", true);
      send.addEventListener("click", async (e) => {
        e.stopPropagation();
        const text = ta.value.trim();
        if (!text) return;
        send.disabled = true;
        if (!(await act("POST", { page: PAGE, parent_id: c.id, body: text }))) send.disabled = false;
      });
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send.click();
        if (e.key === "Escape") { active = null; render(); }
      });
      const row = make("div", "display:flex;gap:6px;justify-content:flex-end;align-items:center;margin-top:6px");
      if (!iAmGuest()) row.append(link("Đã xử lý", () => act("PATCH", { id: c.id, resolved: true })));
      row.append(make("span", "flex:1"), send);
      actions.append(ta, row);
    } else {
      if (!(c.resolved_at && iAmGuest())) {
        actions.append(link(c.resolved_at ? "Mở lại" : "Trả lời", () => {
          if (c.resolved_at) act("PATCH", { id: c.id, resolved: false });
          else card.click(); // cùng cách xử lý như bấm vào thẻ
        }));
      }
      if (!c.resolved_at && !iAmGuest()) actions.append(link("Đã xử lý", () => act("PATCH", { id: c.id, resolved: true })));
    }
    card.append(actions);
    return card;
  };

  const render = () => {
    const openList = openRoots();
    launcher.textContent = `💬 Góp ý (${openList.length})`;
    const wide = isWide();

    marks.forEach((m) => { m.badge.remove(); if (m.card) m.card.remove(); });
    marks = openList.map((c, i) => {
      const badge = make("div", "position:fixed;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;" +
        "border-radius:9px;background:#f59e0b;color:#fff;font:bold 11px/18px sans-serif;text-align:center;" +
        `cursor:pointer;z-index:${Z - 1};display:none`, String(i + 1));
      badge.title = `${shortName(c.author_email)}: ${c.body}`;
      badge.addEventListener("click", () => { active = c.id; open = true; render(); });
      document.documentElement.append(badge);
      const m = { c, badge, range: null, card: null };
      if (wide) {
        m.card = threadCard(c);
        Object.assign(m.card.style, { position: "absolute", left: "0", width: "100%", display: "none" });
        rail.append(m.card);
      }
      return m;
    });
    position();

    panel.style.display = open ? "flex" : "none";
    panel.replaceChildren();
    if (!open) return;
    const head = make("div", "display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #eee");
    const toggle = make("label", "display:flex;gap:4px;align-items:center;color:#5f6368;font-size:12px;cursor:pointer");
    const box = make("input");
    box.type = "checkbox";
    box.checked = showResolved;
    box.addEventListener("change", () => { showResolved = box.checked; render(); });
    toggle.append(box, document.createTextNode("Hiện đã xử lý"));
    head.append(make("b", "flex:1", `Tất cả góp ý (${openList.length})`), toggle, link("Đóng", () => { open = false; render(); }, "#5f6368"));

    const list = make("div", "overflow:auto;padding:8px 12px 10px;display:flex;flex-direction:column;gap:8px");
    const shown = roots().filter((c) => showResolved || !c.resolved_at);
    if (!shown.length) list.append(make("p", "color:#5f6368;margin:10px 0", "Chưa có góp ý. Bôi đen chữ trên trang để thêm góp ý."));
    shown.forEach((c) => {
      const no = openList.indexOf(c);
      const m = marks.find((x) => x.c === c);
      const gone = c.resolved_at ? !findRange(c) && !find(c.selector) : !(m && targetOf(m));
      list.append(threadCard(c, { quoteLine: `${no >= 0 ? "#" + (no + 1) : "✓"} · “${c.quote}”`, gone, inPanel: true }));
    });
    panel.append(head, list,
      make("div", "padding:8px 12px;border-top:1px solid #eee;color:#5f6368;font-size:11px", "Bôi đen chữ trên trang để thêm góp ý · cả team cùng thấy"));
  };

  // Xếp thẻ ở cột bên phải: thẻ đang chọn ngang đúng dòng, thẻ sau đẩy xuống, thẻ trước đẩy lên để không chồng nhau
  const layoutCards = () => {
    marks.forEach((m) => { if (m.card) m.card.style.display = targetOf(m) ? "block" : "none"; }); // hiện trước rồi mới đo chiều cao
    const items = marks.filter((m) => m.card && targetOf(m))
      .map((m) => ({ m, anchor: targetOf(m).getBoundingClientRect().top + scrollY, h: m.card.offsetHeight }))
      .sort((a, b) => a.anchor - b.anchor);
    if (!items.length) return;
    const ai = Math.max(0, items.findIndex((x) => x.m.c.id === active));
    items[ai].top = items[ai].anchor;
    for (let i = ai + 1; i < items.length; i++) items[i].top = Math.max(items[i].anchor, items[i - 1].top + items[i - 1].h + 8);
    for (let i = ai - 1; i >= 0; i--) items[i].top = Math.min(items[i].anchor, items[i + 1].top - items[i].h - 8);
    items.forEach(({ m, top }) => { m.card.style.top = top + "px"; });
  };

  // Cập nhật phần tô vàng, số thứ tự (màn hình hẹp) hoặc vị trí thẻ (màn hình rộng)
  const position = () => {
    marks.forEach((m) => { if (!m.range || !m.range.getClientRects().length) m.range = findRange(m.c); });
    applyLayout();
    const wide = isWide();
    rail.style.display = wide ? "block" : "none";
    const ranges = [];
    let activeRange = null;
    marks.forEach((m) => {
      const t = targetOf(m);
      if (m.range) { if (m.c.id === active) activeRange = m.range; else ranges.push(m.range); }
      if (!t || wide) { m.badge.style.display = "none"; return; }
      const r = t.getBoundingClientRect();
      Object.assign(m.badge.style, { display: "block", left: Math.max(0, r.right - 4) + "px", top: Math.max(0, r.top - 12) + "px" });
    });
    if (wide) layoutCards();
    if (window.CSS && CSS.highlights) {
      CSS.highlights.set("ffm-comment", new Highlight(...ranges));
      CSS.highlights.set("ffm-comment-active", new Highlight(...(activeRange ? [activeRange] : [])));
    }
  };
  addEventListener("scroll", position, true);
  let lastWide = isWide();
  addEventListener("resize", () => { if (isWide() !== lastWide) { lastWide = isWide(); render(); } else position(); });
  setInterval(position, 1000);
  // Lấy góp ý mới của người khác mỗi 30 giây khi tab đang mở và không viết dở
  setInterval(() => {
    const typing = editor || [...rail.querySelectorAll("textarea"), ...panel.querySelectorAll("textarea")].some((t) => t.value.trim());
    if (!document.hidden && !typing) load();
  }, 30000);
  render();
  load();
})();
