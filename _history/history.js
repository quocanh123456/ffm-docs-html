// Nút "🕘 Lịch sử" trên mọi trang: danh sách các lần sửa trang (lấy từ /api/history), bấm 1 dòng mở bản cũ ở tab mới.
// functions/_middleware.js tự gắn script này vào mọi trang HTML (cả bản cũ /<trang>?v=<sha>).
// Phần tử giao diện mang thuộc tính data-ffm-comment-ui để chức năng góp ý bỏ qua khi người xem bôi đen chữ trong đó.
(() => {
  if (window.__ffmHistory) return;
  window.__ffmHistory = true;

  const PAGE = location.pathname.replace(/\.html$/, "");
  const CURRENT = new URLSearchParams(location.search).get("v");
  const Z = 2147483000;
  const UI = "data-ffm-comment-ui";
  const FONT =
    '13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const BLUE = "#1a73e8";
  let open = false;
  let data = null; // { versions } hoặc { error }

  const make = (tag, css, text) => {
    const e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text != null) e.textContent = text;
    e.setAttribute(UI, "");
    return e;
  };
  // "02/11/2026 09:57" theo giờ Việt Nam, khớp dải báo bản cũ (toLocaleString vi-VN đặt giờ trước ngày)
  const fmt = (iso) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit",
      year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
  };

  const launcher = make(
    "button",
    `position:fixed;right:16px;bottom:16px;z-index:${Z};padding:8px 14px;border:1px solid #dadce0;` +
      `border-radius:20px;background:#fff;color:#202124;font:${FONT};font-weight:600;cursor:pointer;` +
      "box-shadow:0 2px 8px rgba(0,0,0,.2)",
    "🕘 Lịch sử",
  );
  launcher.addEventListener("click", () => {
    open = !open;
    render();
  });
  const panel = make(
    "div",
    `position:fixed;right:16px;bottom:60px;width:360px;max-height:70vh;display:none;` +
      "flex-direction:column;background:#fff;border:1px solid #dadce0;border-radius:8px;" +
      `box-shadow:0 4px 16px rgba(0,0,0,.2);font:${FONT};color:#202124;z-index:${Z}`,
  );

  // Đặt nút bên trái nút "💬 Góp ý" (nút đó đổi độ rộng theo số góp ý); bản cũ không có nút góp ý thì đặt sát góc
  const place = () => {
    const comments = [...document.querySelectorAll(`button[${UI}]`)].find(
      (b) => b !== launcher && b.textContent.startsWith("💬"),
    );
    const right = comments ? comments.offsetWidth + 24 : 16;
    launcher.style.right = `${right}px`;
    panel.style.right = `${right}px`;
  };

  const render = () => {
    const count = data && data.versions ? data.versions.length : 0;
    launcher.textContent = count ? `🕘 Lịch sử (${count})` : "🕘 Lịch sử";
    place();
    panel.style.display = open ? "flex" : "none";
    panel.replaceChildren();
    if (!open) return;
    const head = make(
      "div",
      "display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #eee",
    );
    const close = make(
      "button",
      `border:0;background:none;padding:0;color:#5f6368;font:${FONT};cursor:pointer`,
      "Đóng",
    );
    close.addEventListener("click", () => {
      open = false;
      render();
    });
    head.append(make("b", "flex:1", `Lịch sử sửa trang (${count})`), close);
    const list = make(
      "div",
      "overflow:auto;padding:6px 12px 10px;display:flex;flex-direction:column;gap:4px",
    );
    if (!data)
      list.append(make("p", "color:#5f6368;margin:10px 0", "Đang tải…"));
    else if (data.error)
      list.append(
        make(
          "p",
          "color:#b91c1c;margin:10px 0",
          "Không lấy được lịch sử. Báo người quản trị trang kiểm tra token GitHub.",
        ),
      );
    else if (!count)
      list.append(
        make("p", "color:#5f6368;margin:10px 0", "Trang chưa có lịch sử sửa."),
      );
    else
      data.versions.forEach((ver, i) => {
        const current = CURRENT ? ver.sha.startsWith(CURRENT) : i === 0;
        const row = make(
          "a",
          `display:block;padding:8px 10px;border-radius:6px;text-decoration:none;color:#202124;` +
            (current ? "background:#e8f0fe" : "background:#f8f9fa"),
        );
        row.href = i === 0 ? PAGE : `${PAGE}?v=${ver.sha.slice(0, 7)}`;
        row.target = "_blank";
        row.rel = "noopener";
        const top = make(
          "div",
          "display:flex;gap:6px;align-items:center;color:#5f6368;font-size:12px",
        );
        top.append(make("span", "flex:1", `${fmt(ver.date)} (giờ VN)${ver.author ? ` · ${ver.author}` : ""}`));
        if (i === 0)
          top.append(make("span", "color:#137333;font-weight:600", "mới nhất"));
        if (current)
          top.append(make("span", `color:${BLUE};font-weight:600`, "đang xem"));
        row.append(top, make("div", "margin-top:2px", ver.message));
        list.append(row);
      });
    panel.append(head, list);
  };

  (async () => {
    let res;
    try {
      res = await fetch(`/api/history?page=${encodeURIComponent(PAGE)}`, {
        credentials: "same-origin",
      });
      const body = await res.json();
      if (body.enabled === false) return; // trang không có lịch sử (vd thư mục sample/ của bigate-docs-html): không hiện nút
      data = res.ok ? body : { error: body.error || res.status };
    } catch {
      data = { error: res ? res.status : "network" };
    }
    document.documentElement.append(panel, launcher);
    render();
    // Nút góp ý vẽ sau (chờ API góp ý) và đổi độ rộng khi số góp ý đổi: đặt lại vị trí mỗi giây
    setInterval(place, 1000);
  })();
})();
