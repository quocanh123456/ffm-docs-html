// Nút 🌙/☀️ đổi chế độ sáng / tối, đặt cuối thanh mục lục (.top-in); trang không có thanh mục lục thì đặt cố định ở góc trên bên phải.
// functions/_middleware.js chỉ gắn script này vào trang theo file mẫu, cùng _theme/theme.css và đoạn script trong <head>
// đặt html[data-theme] trước khi vẽ trang. Lựa chọn lưu ở localStorage "docs-theme"; chưa chọn thì theo cài đặt của máy.
(() => {
  if (window.__docsTheme) return;
  window.__docsTheme = true;

  const KEY = "docs-theme";
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const stored = () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  };

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "docs-theme-btn";
  const paint = () => {
    const dark = root.dataset.theme === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
    btn.title = dark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối";
    btn.setAttribute("aria-label", btn.title);
  };
  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    paint();
  });
  // Người xem chưa tự chọn: đổi theo máy khi máy chuyển sáng / tối
  media.addEventListener("change", (e) => {
    if (stored() === "dark" || stored() === "light") return;
    root.dataset.theme = e.matches ? "dark" : "light";
    paint();
  });

  const bar = document.querySelector(".top-in");
  if (bar) bar.append(btn);
  else {
    btn.classList.add("float");
    document.body.append(btn);
  }
  paint();
})();
