# Viết code FE theo Design System FFM v2 · repo sea-fulfillment-web

Đọc file này khi được yêu cầu dựng hoặc sửa màn trong repo `sea-fulfillment-web` (Next.js 12, React 18) theo thiết kế FFM v2, thường kèm link frame Figma. Khi viết code: **không** chạy quy trình vẽ R04, **không** hỏi "Designer hay BA/PM?", không vẽ hay sửa gì trên Figma.

## 1. Nguồn thiết kế
- Màn chính: frame trong **Visual_Design_FFM** (link có `node-id`, lấy bằng Copy link to selection).
- Trạng thái phụ (empty, loading, lỗi, hover, drawer, toast) và ghi chú `@devs`: Section của tính năng trong **Master_Data_FFM** (R03 trong `rules-design-agent.md`).
- Đọc frame bằng Figma MCP. Không có Figma MCP thì gọi Figma REST API bằng token cá nhân của người dùng lưu ở `~/.figma_token` (quyền `file_content:read`, header `X-Figma-Token`, `GET /v1/files/<file_key>/nodes?ids=<node-id>`). Không in token ra màn hình hay log.
- Không có link thiết kế → hỏi người dùng link, không tự nghĩ ra giao diện. Thiết kế thiếu trạng thái mà code cần → hỏi Designer, ghi chỗ thiếu vào báo cáo.
- Giá trị trên frame lệch token → dùng token, báo chỗ lệch cho Designer.

## 2. Thư viện giao diện: thiết kế của Ming là chuẩn, antd không bắt buộc
- Mục tiêu là màn giống thiết kế. antd 5 (đang có trong repo) chỉ dùng khi chỉnh được cho khớp thiết kế bằng props, `className` và CSS dùng biến `--ffm-*`.
- antd không khớp được (ví dụ bảng tràn viền có Column divider, View tabs, Setting row, Badge Soft, Bulk action bar) → tự viết component React + CSS dùng biến `--ffm-*`.
- Trước khi viết component mới: tìm component FFM v2 đã có trong repo (`grep -rln "var(--ffm-" components`) và dùng lại. Component dùng chung đặt tên theo tên component trong DS (`component-catalog.md`), ví dụ `SettingRow`, `TableSummaryRow`.
- Không thêm thư viện giao diện hay CSS mới (Tailwind, shadcn/ui, Radix, styled-components) khi techlead chưa đồng ý. `tokens/shadcn-theme.css` không dùng ở repo này.
- Ngoại lệ: icon theo DS dùng `@phosphor-icons/react` (weight Regular, 16px, màu `var(--ffm-fg-base-icon)`). Repo chưa có thư viện này thì thêm vào `package.json` và ghi lý do trong PR.

## 3. Token trong code
- Biến token nạp một lần cho toàn app: file `styles/ffm-tokens.css` chép nguyên từ `tokens/tokens.css` của skill, thêm 1 dòng comment đầu ghi phiên bản skill (theo `CHANGELOG.md`), import trong `pages/_app.js` cạnh `import 'sass/index.scss'` (`import 'styles/ffm-tokens.css';`). Repo chưa có file này thì tạo trong PR đầu tiên làm theo thiết kế v2. File chỉ khai báo biến trong `:root` và class `.ffm-*`, không đổi giao diện màn cũ.
- Chỉ dùng biến semantic: `--ffm-fg-*`, `--ffm-bg-*`, `--ffm-bg-overlay-*`, `--ffm-border-*`, `--ffm-padding-*`, `--ffm-gap-*`, `--ffm-size-*`, `--ffm-radius-*`, `--ffm-shadow-*`, và class chữ `.ffm-body-sm-regular`, `.ffm-caption-xs-medium`… Không dùng biến seed (các nhóm màu gốc `--ffm-neutral-*`, `--ffm-blue-*`, `--ffm-blue-brand-*`, `--ffm-cyan-*`, `--ffm-green-*`, `--ffm-orange-*`, `--ffm-pink-*`, `--ffm-purple-*`, `--ffm-red-*`, `--ffm-yellow-*`, `--ffm-white-alpha-*`), không viết mã màu hex hay `rgb()`, không đặt số px ngoài thang token. Kích thước đã có token thì dùng token (`--ffm-size-header` 56, `--ffm-size-table-head` 40, `--ffm-size-table-row` 52, `--ffm-size-control-*`); số px chỉ dùng cho kích thước thiết kế ghi rõ mà chưa có token (min width cột bảng ở R06.7; View tabs 44, Toolbar 52, Filter bar 48, Summary row 40, Pagination 60).
- Ming báo token đổi: chép lại `tokens/tokens.css` vào `styles/ffm-tokens.css`, sửa phiên bản ở dòng đầu.
- Không bật theme antd toàn cục (`ConfigProvider theme` ở `pages/_app.js`), không đổi font của cả app, khi chưa có task riêng: làm vậy đổi giao diện mọi màn cũ. Font Inter: class `.ffm-*` đã khai báo, nhưng app chưa nạp font thì trình duyệt dùng `system-ui`. Nạp font Inter cho cả app là việc chung, hỏi techlead trước; chưa nạp thì ghi vào báo cáo.
- Chỉ áp dụng thiết kế v2 cho các màn thuộc task; màn khác giữ nguyên.

## 4. Quy tắc giao diện khi code
Rút từ `design-system.md`, R06.7, R15, R16; chi tiết và số đo xem file gốc.
- **List page**: Page header 56 → View tabs 44 → Toolbar 52 → Filter bar 48 (chỉ khi có điều kiện lọc) → bảng tràn viền → Summary row 40 → Pagination ghim đáy. Summary row và Pagination ẩn ở trạng thái empty, loading, lỗi. Lề ngang 20. Không bọc bảng trong card.
- **Bảng**: header 40, nền `--ffm-bg-base-surface-strong`, chữ Semibold, sentence case, không icon. Hàng 52 (Compact 36), hàng chẵn nền `--ffm-bg-base-surface`. Bật Column divider. Số căn phải, `font-variant-numeric: tabular-nums`. Cột chọn và cột đầu ghim trái khi cuộn ngang. Cột có min width theo R06.7.
- **Màu**: mỗi màn 1 nút Primary (R15; `design-system.md` ghi "mỗi khu vực", khi khác nhau thì Rules thắng, màn có nhiều khu vực thì hỏi Designer). Brand chỉ cho CTA, link mã đơn, mục đang chọn, focus. Trạng thái dùng Badge Soft hoặc Dot, không tô nền cả hàng.
- **Chữ**: theo `ux-writing.md` (R16). Mọi chữ qua i18n của repo (`useTranslation` của `react-i18next`), đủ EN và VI. Không để chữ tạm.
- **Số và tiền**: 0 in "0", thiếu dữ liệu in "—". Tiền theo quốc gia của dữ liệu, không viết cứng ký hiệu tiền; dùng hàm định dạng sẵn có của repo (ví dụ `renderMoneyValue` ở `utils/render.js`). Lưu ý `renderMoneyValue` in `_` khi thiếu giá trị và có dấu cách giữa ký hiệu tiền với số: ô thiếu dữ liệu phải tự in "—" trước khi gọi hàm; định dạng của hàm lệch ví dụ R16 (`₱41,260`) thì ghi vào báo cáo để Designer và techlead quyết định, không tự sửa hàm dùng chung.
- **Trạng thái**: empty = 1 câu + 1 hành động; loading = skeleton theo lưới cột, không chữ "Loading…"; lỗi = 1 câu + nút thử lại. Làm đúng như frame trong Master_Data_FFM.

## 5. Tự kiểm tra trước khi báo xong
1. Thay đổi so với nhánh gốc (gồm cả file mới chưa `git add`) không có mã màu mới, không dùng biến seed. Chạy 2 lệnh, bỏ qua kết quả nằm trong comment (ví dụ số issue `#123`):
   - File đã theo dõi: `git diff origin/develop -- . ':!styles/ffm-tokens.css' | grep -nE '^\+.*(#[0-9a-fA-F]{3,8}\b|(rgb|hsl)a?\(|--ffm-(neutral|blue|cyan|green|orange|pink|purple|red|yellow|white)-)'`
   - File mới: `git ls-files -o --exclude-standard -z -- . ':!styles/ffm-tokens.css' | xargs -0 grep -nE '(#[0-9a-fA-F]{3,8}\b|(rgb|hsl)a?\(|--ffm-(neutral|blue|cyan|green|orange|pink|purple|red|yellow|white)-)' /dev/null`
2. Chụp màn đã code (chrome-devtools, khi dev server đang chạy), đặt cạnh ảnh frame Figma. Liệt kê chỗ còn lệch kèm lý do.
3. Đối chiếu phần áp dụng cho code của checklist R14: thứ tự các thanh, 1 Primary, header bảng không icon, Summary row, Pagination, đủ trạng thái, chữ đúng R16, đủ EN và VI.
4. Quy định riêng của repo FE (`CLAUDE.md` / `AGENTS.md` của repo: test, map status ở `utils/tools.js`, supported countries) vẫn áp dụng như bình thường.
