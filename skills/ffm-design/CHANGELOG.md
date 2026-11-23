# Changelog

## v1.2 · 04/11/2026 · Sơn Hoàng
- README: cài từ repo ffm-docs-html (`skills/ffm-design`), cây thư mục có `references/code-fe.md`, bỏ phần đẩy lên repo riêng.
- R16: thị trường theo các nước FFM đang hỗ trợ; tiền tệ theo quốc gia của dữ liệu, ₫ chỉ khi có thị trường Việt Nam (ux-writing.md, SKILL.md, rules-design-agent.md).
- Rút gọn `description` của SKILL.md còn dưới 200 ký tự để claude.ai nhận file zip; phần chi tiết chuyển xuống thân SKILL.md.

## v1.1 · 04/11/2026 · Sơn Hoàng
- Thêm `references/code-fe.md`: cách viết code FE theo DS v2 trong repo sea-fulfillment-web (nguồn thiết kế, antd không bắt buộc, token qua `styles/ffm-tokens.css`, tự kiểm tra). SKILL.md trỏ tới file này và bỏ qua quy trình R04 khi viết code.
- Skill chuyển vào repo ffm-docs-html, thư mục `skills/ffm-design`.

## v1.0 · 03/11/2026 · Ming Đoàn
- Đóng gói toàn bộ dự án FFM thành skill `ffm-design`.
- Gồm: Rules Design Agent v1.8 · Design System FFM v2 (19 quy tắc) · UX writing FFM v1.1 (Sơn Hoàng) · hồ sơ màn OL2 (13 màn) và PR (6 màn).
- Token xuất từ Figma DS `bRzGSf4BNsKuwF5w8ISJvT` ngày 03/11/2026: 7 collection · 616 biến (Seed 214 · Dimension 25 · Typography 30 · 1. Color 230 · 2. Spacing 45 · 3. Radius 13 · 4. Effect 59) · 16 text style · 9 effect style · 20 paint style.
- 111 component + 102 icon kèm key, đối chiếu với file Figma: khớp 213/213.
- Xuất thêm `tokens.css`, `shadcn-theme.css`, `tokens.json` để dùng trong code.
