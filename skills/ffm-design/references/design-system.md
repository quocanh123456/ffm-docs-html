# DESIGN SYSTEM_FFM_2026 – Pancake Fulfillment Design System v2 (cập nhật 03/11/2026)

> Bản đồng bộ từ Project `claude/DESIGN SYSTEM_FFM_2026.md`. Giá trị token đầy đủ: `tokens/figma-variables.json` (616 biến), `tokens/tokens.css`, `tokens/tokens.json`. Component + key: `tokens/components.json`, `references/component-catalog.md`.

v2 thay thế hoàn toàn v1 (Ant/Roboto). Style: **shadcn/ui** (hướng shadcnstudio – bo mềm, sạch) · **định hướng thị giác Attio** (bảng tràn viền, settings dạng hàng) · Font **Inter** (code: **Geist Mono**) · Icon **Phosphor Regular** · Brand **xanh dương** · Neutral **tông ấm (stone)** · Token theo cấu trúc **Design System FNB** (không dùng component token).

Figma (thư viện "🗂️ Design System_FFM 🗂️"): https://www.figma.com/design/bRzGSf4BNsKuwF5w8ISJvT
- Trang **🧭 Style principles** (page 117:55) – nguồn chuẩn cho mục "Style principles" bên dưới. **Đồng bộ 2 chiều**: sửa nguyên lý ở Figma thì cập nhật doc này và ngược lại, ghi vào Nhật ký thay đổi.
- Màn áp dụng: Master_Data_FFM https://www.figma.com/design/lG7msjZzLDwBl0dfWsspry (page `🛒 OL v2 – Orders`, Section 130:5676)
- Tham chiếu token: FNB DS `TEvdB3hrUCZbkr7wXwGmsS` (chỉ lấy cấu trúc Seed / Dimension / Typography / 1. Color / 2. Spacing / 3. Radius / 4. Effect).
- Tham chiếu style: Attio web trên Mobbin – https://mobbin.com/apps/attio-web-f8618f57-3608-4752-9643-94b510d99b43/892acdf2-7578-4df0-aea7-1ffed421dae6/screens

## Token – tóm tắt nhanh
| Collection | Tầng | Nội dung | Số biến |
|---|---|---|---|
| 🎨 Seed | Primitive, **không bind trực tiếp** | neutral (stone 0–1000), blue-brand, green, red, orange, yellow, blue, cyan, purple, pink + `-alpha`, white-alpha | 214 |
| 📏 Dimension | Primitive, **không bind trực tiếp** | `dm-0 … dm-96, dm-52, dm-full` | 25 |
| 📘 Typography | Primitive | Inter, weight, size xs–4xl, line height, letter spacing | 30 |
| 1. Color | Semantic | `context/{fg\|bg\|bg-overlay\|border}/{intent}/{state}` | 230 |
| 2. Spacing | Semantic | padding/* · gap/* · size/* | 45 |
| 3. Radius | Semantic | xs 4 · sm 6 · md 8 · lg 10 · xl 12 · 2xl 16 · 3xl 20 · 4xl 24 · 5xl 28 · 6xl 32 · full | 13 |
| 4. Effect | Semantic | shadow 2xs–2xl, ring brand / error | 59 |

**Intent:** base · brand · success · warning · error · info · caution · status-0 (cyan) · status-1 (pink) · status-2 (purple) · inverse.
Mỗi intent (trừ base/inverse) có: `fg/{i}/primary|hover|focus|selected|disabled` (700/800/900/700/300) · `bg/{i}/default|hover|focus|selected|disabled` (600/700/800/100/300) · `bg-overlay/{i}/default|hover|focus|selected|disabled` (alpha 100/200/300/200/50) · `border/{i}/default|hover|focus|selected|disabled|subtle` (500/600/700/700/200/alpha 300).

Màu hay dùng nhất:
| Token | Giá trị | Dùng cho |
|---|---|---|
| `context/bg/base/canvas` | #FFFFFF | Nền trang |
| `context/bg/base/surface` | #FAFAF9 | Sidebar, hàng chẵn bảng (Striped) |
| `context/bg/base/surface-strong` | #F5F5F4 | Header bảng, Summary row, ô count tab |
| `context/bg/base/hover` | #EEEDEB | Hover |
| `context/bg/base/selected` | #E7E5E4 | Item đang chọn |
| `context/fg/base/primary` | #0C0A09 | Chữ chính |
| `context/fg/base/secondary` | #78716C | Chữ phụ |
| `context/fg/base/hint` | #A8A29E | Meta mờ |
| `context/fg/base/icon` | #57534E | Icon |
| `context/border/base/default` | #E7E5E4 | Hairline 1px |
| `context/bg/brand/default` | #1570EF | CTA chính (1/khu vực) |
| `context/fg/brand/primary` | #175CD3 | Link |
| `context/bg/inverse/default` | #1C1917 | Bulk action bar, tooltip |
| `context/bg/caution/selected` | #FEF3C7 | Nền ghi chú `@devs` trên canvas |

Spacing: padding none 0 · 6xs 1 · 5xs 2 · 4xs 4 · 3xs 6 · 2xs 8 · xs 10 · sm 12 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40 · 4xl 48 · 5xl 64 · 6xl 80 — gap none 0 · 3xs 2 · 2xs 4 · xs 6 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 40 · 5xl 48 · 6xl 64 — size icon 12/14/16/20/24 · avatar 24/32/40/56 · control-sm 32 · control-md 36 · control-lg 40 · table-row 52 · table-head 40 · header 56 · sidebar-collapsed 48.

Text style (16): Heading/4xl 36/40 Bold · Heading/3xl 30/36 · Heading/2xl 24/32 · Heading/xl 20/28 · Heading/lg 18/28 (Semi Bold) · Body/md-regular|medium|semibold 16/24 · Body/sm-regular|medium|semibold 14/20 · Caption/xs-regular|medium|semibold 12/16 · Code/sm 13/20 · Code/xs 12/16 (Geist Mono). Letter spacing âm từ lg trở lên (−0.2 … −0.8).
Effect style (9): Shadow/2xs · xs · sm · md (Popover/Dropdown/Command) · lg (Dialog/Drawer) · xl · 2xl · Ring/brand · Ring/error. Paint style: **Avatar/Photo 01–20**.

## Style principles (Attio-inspired) – mục tiêu: thoáng · dễ quét · sạch · nhìn lâu không mỏi · ngăn nắp
| Nguyên lý | Ý chính | Quy tắc cụ thể |
|---|---|---|
| **Thoáng** | Khoảng trắng làm khung, không phải hộp | Bảng + thanh công cụ tràn viền vùng nội dung, không bọc card · nhóm cách nhau 24–32, trong nhóm 8–12 · không lồng card trong card |
| **Dễ quét** | Mắt đi theo cột, không theo màu | Mỗi cột 1 loại dữ liệu, header chỉ có nhãn chữ Semibold (không icon) · số căn phải, cùng định dạng · dòng phụ Caption xám · tối đa 1 điểm màu/ô (Badge hoặc Dot) |
| **Sạch** | ~90% trung tính, màu chỉ để báo nghĩa | Brand chỉ cho CTA chính, link, trạng thái chọn, focus · hairline 1px `border/base/default` · bóng chỉ cho lớp nổi · không chú thích trên màn (#9) |
| **Nhìn lâu không mỏi** | Ít tương phản gắt, nhịp chữ đều | Nền canvas trắng ấm, chữ `fg/base/primary` · Body/sm 14/20 mặc định · Semibold chỉ cho tiêu đề · icon 16 `fg/base/icon` |
| **Ngăn nắp** | Mỗi thứ có 1 chỗ cố định | Page header → View tabs → Toolbar → (Filter bar khi có điều kiện) → Bảng → Summary → **Pagination (đáy màn)** · trái = xem/lọc, phải = cài đặt view, Import/Export, CTA · spacing bội số 4 theo token |

### List page (khung màn danh sách) – cập nhật 03/11 21:10
| Vùng | Cao | Nội dung | Token / component |
|---|---|---|---|
| Page header | 56 | **Component `Page header`**: tiêu đề (Body/md-semibold) · phải: **Header search** 320 (⌘K) · thông báo · ⋯ (prop Title, Show search, Show notifications, Show more) | `size/header` · Page header · Header search |
| **View tabs** | 44 | Hàng riêng, tràn viền, hairline dưới: **Tab trigger · Style=View** theo thứ tự trạng thái của sản phẩm (icon + nhãn + count) → **Tab overflow "More n ⌄"** khi hết chỗ → phải: **View settings** (Ghost) | Tab trigger View · Tab overflow · `gap/2xs` |
| **Toolbar** | 52 | Trái: Sort · Filter (Outline sm, count = số điều kiện; không có điều kiện thì tắt count). Phải: Import / Export (Outline) · 1 CTA Default | Button sm · `gap/sm` |
| **Filter bar** | 48 | **Chỉ hiện khi có điều kiện lọc đang áp dụng** – hàng riêng dưới Toolbar: chip điều kiện (Secondary + ×) · Add filter (Ghost + plus) · phải: Clear filters (Ghost). Không có điều kiện → ẩn cả hàng | Button sm · `gap/sm` · hairline dưới |
| Table head | 40 | Nền **`bg/base/surface-strong`** · nhãn **Body/sm-semibold**, **không icon** (tách header khỏi dữ liệu) · Column divider bật · số căn phải | Table head · `size/table-head` |
| Table row | 52 / 36 | **Ngựa vằn**: hàng lẻ `bg/base/canvas`, hàng chẵn bật `Striped` → `bg/base/surface` · Default 2 dòng · Compact 1 dòng (View settings › Row density) | Table cell · `size/table-row` · `size/control-md` |
| Summary row | 40 | Nền đậm hơn bảng **`bg/base/surface-strong`** · count ở cột đầu, sum ở cột tiền (giá trị Body/sm-semibold `fg/base/primary`, nhãn `fg/base/secondary`), ô khác Empty (Add khi hover) | **Table summary cell** |
| **Pagination bar** | 60 | Ghim đáy màn; **bảng kéo kín xuống sát thanh** (Table viewport FILL, dòng trong Body clip, Summary ghim đáy viewport – không khoảng hở), hairline trên, lề `padding/lg`, nền canvas: DS **Pagination** – trái tóm tắt "Nhãn: Giá trị" (`Orders: 1–30 of 107`; khi chọn nhiều: `Selected: 3 of 107 · COD: ₱2,439`) · số trang (Previous · 1 2 3 4 · Next) · ngoài cùng phải **"30 / page"**. Ẩn ở empty / loading / lỗi. Scrollbar dọc tính theo số dòng của 1 trang (vd. 11 / 30) | Pagination · Pagination item · Select |
| Lề ngang | 20 | Lề các thanh; bảng chạm sát mép vùng nội dung | `padding/lg` |

**Tràn tab (overflow):** xếp tab theo thứ tự cho tới khi chạm max width của cụm tab (bề ngang hàng − View settings) → phần còn lại vào **More** (Count = số view bị ẩn). Dropdown More = Command: ô *Search views* · nhóm **More views** (view ẩn + count) · **Saved views** · *Save as new view*. Chọn một view trong More → view đó **thế vào ô tab cuối cùng** trước More và chuyển Active; thứ tự các tab khác giữ nguyên.

### Full table (cập nhật Table v2)
- Nên: tràn hết bề ngang, cuộn ngang bằng Scrollbar, checkbox + cột đầu ghim trái · **bật Column divider** (lưới hairline như bảng tính) · header không icon, chỉ nhãn chữ · ô trống = Muted "Chưa có" · hover `bg/base/hover`, chọn `bg/base/selected`, chi tiết mở Drawer phải · luôn có Summary row + Pagination ở đáy.
- Tránh: bọc bảng trong card có lề · tô nền cả hàng để báo lỗi / pill màu đặc · >10 cột mặc định · nút lặp trên từng hàng (dùng ⋯ / Bulk bar) · chữ đậm/màu cho dữ liệu thường (chỉ Mã đơn là Link) · chú thích/thời gian cập nhật trên thanh.

### Settings page
- Điều hướng trái 256 (nền `bg/base/surface`, viền phải): header "‹ Cài đặt", nhóm có nhãn Caption/xs-medium + caret, item = Sidebar menu item (Active cho mục đang mở).
- Cột nội dung **720 căn giữa**, lề trên 32: Breadcrumb → tiêu đề Heading/2xl → các section cách nhau 32.
- Section = tiêu đề Body/md-semibold + khối hàng viền `border/base/default`, bo `radius/2xl`; mỗi cài đặt là 1 **Setting row** (tiêu đề Body/sm-medium + mô tả 1 câu Body/sm-regular secondary bên trái, control căn phải: Select 240 / Switch không nhãn / Button Outline sm); hàng cuối tắt Divider.
- Switch/Select lưu ngay + Toast; chỉ nhóm nhiều ô nhập mới có nút Lưu cuối section. Hành động không hoàn tác gom vào **Vùng nguy hiểm** cuối trang (Destructive sm + Dialog).
- Mô tả trong Setting row là ngoại lệ hợp lệ của rule #9 (nói kết quả của cài đặt, 1 câu, không "Mẹo"/"Tìm hiểu thêm").
- Tránh: form 2 cột label-trên-input · >5 tab ngang · thanh "Lưu thay đổi" cố định · card lồng card, nền màu cho section · hành động nguy hiểm lẫn giữa section.

### Ngôn ngữ thị giác
- Màu: ~90% neutral (canvas, surface, border, fg/base/*); brand cho 1 CTA Default/khu vực, link, mục chọn, focus; intent chỉ cho Badge Soft + Dot.
- Chữ: Heading/2xl (tiêu đề settings) · Body/md-semibold (page header, section) · Body/sm-regular dữ liệu · Body/sm-medium nhãn hàng, nút · Caption/xs dòng phụ, nhãn nhóm · tối đa 3 cỡ chữ/màn.
- Viền & lớp: hairline phân vùng (không dùng nền xám) · bề mặt phẳng không bóng; Shadow/md cho Popover/Dropdown/Command, Shadow/lg cho Dialog/Drawer · bo theo rule #14.
- Icon & nhịp: Phosphor 16 trước nhãn (nút, nav, tab view – **không** dùng ở header bảng) · control 32 trong thanh/bảng, 36 trong form · spacing 4/8/12/16/20/24/32.

### Checklist bàn giao (DS)
Bảng tràn viền + Column divider + ngựa vằn (hàng chẵn Striped) + header nền đậm không icon + Summary row + **Pagination ở đáy (ẩn ở empty/loading/lỗi)** · thứ tự thanh đúng (Page header → View tabs → Toolbar) · tab view đủ trạng thái của sản phẩm, tràn thì vào More · 1 nút Default/khu vực · không chú thích trên màn · chip lọc khớp dữ liệu trong bảng · settings cột 720 + Setting row + Vùng nguy hiểm cuối · mọi giá trị bind token · icon trên nút màu đặc cùng màu nhãn (không còn icon xám trên nền brand) · màn tĩnh dùng state Default.

## Quy tắc đã chốt (do user yêu cầu)
1. **Nhãn nút không ghép số** (cấm "Hoàn tất đóng gói · 2"). Cần số lượng → bật `Show count` trên Button (badge tròn).
2. **Thẻ chỉ số / pipeline không đánh số thứ tự** ("1. Mới" → "Mới").
3. **Phân trang**: tóm tắt bên trái · nút trang · ô chọn số dòng "30 / trang" (EN: "30 / page") ở ngoài cùng bên phải, **không có chữ "Số dòng"**. Tóm tắt dạng **"Nhãn: Giá trị"** – nhãn Body/sm-regular `fg/base/secondary`, giá trị Body/sm-medium `fg/base/primary`, ngăn bằng "·" `fg/base/hint` (tối đa 3 cặp). **03/11 21:10 – màn danh sách dùng Summary row + Pagination ở đáy** (thay quy tắc cũ "cuộn thay phân trang"); EN: "Previous / Next".
4. **Hover/chọn đủ tương phản**: hover = nền +1 bậc (neutral/150), chọn = +2 bậc (neutral/200) + icon brand + Medium.
5. **Bulk action bar nền tối** (ClickUp) – không đổi màu theo brand; nổi phía trên Pagination bar (cách 16).
6. **Bảng dùng chuẩn Table v2** (xem dưới) cho mọi màn.
7. **Nhãn nút ngắn gọn 1–2 từ** khi ngữ cảnh đã rõ đối tượng (vd trong drawer đơn: "Gọi", "Xác nhận").
8. **Không đặt ghi chú số liệu phụ** kiểu "Cập nhật 10:04" trên thanh lọc/bảng.
9. **Chống AI-slop – không viết chữ chú thích/giải thích trên UI** (vd "6 reasons with 0 orders hidden", "Mẹo: …", "Hiển thị X kết quả phù hợp"). UI chỉ chứa nhãn, dữ liệu và hành động; thứ gì bị ẩn thì cứ ẩn, không thông báo. Giải thích thiết kế để ở ghi chú Figma/tài liệu, không nằm trong màn. *(Ngoại lệ: mô tả 1 câu trong Setting row.)*
10. **Phân biệt Tab và Badge.** Thứ bấm để chuyển nội dung / lọc nhanh = **Tab** → không chấm màu, không màu intent. Màu intent chỉ dùng cho **Badge** (trạng thái) và dữ liệu trong bảng.
11. **Tab có 3 style**:
    - **View** (03/11 – kiểu Attio, cho hàng view của màn danh sách): ô cao 32 (`size/control-sm`) bo `radius/xl`, padding ngang 10, icon Phosphor 16 + nhãn Body/sm-medium + **ô count** (Caption/xs-medium `fg/base/secondary`, nền `bg/base/surface-strong`, bo `radius/sm`); thân tab cao 44 (padding trên 6 · ô 32 · gap 4 · gạch 2). Default: chữ `fg/base/secondary`, icon `fg/base/icon`; Hover: nền ô `bg/base/hover`; **Active: ô nền `bg/base/canvas` + viền `border/base/default` + gạch chân 2px `fg/base/primary`**. Prop: Label, Count, Show count, **Icon**, **Show icon**. Tràn → **Tab overflow** ("More" + count + caret; Default/Hover/Open).
    - **Underline** (tab cấp 1 trong nội dung): cao 40 (`size/control-lg`), chữ Body/sm-medium; mặc định `fg/base/secondary`, chọn `fg/base/primary` + gạch chân 2px `fg/base/primary` (đen, không dùng brand); list có viền dưới `border/base/default`, gap 20 (`gap/xl`).
    - **Pill** (tab con / lọc nhanh trong trang): cao 32 (`size/control-sm`), padding ngang 12 (`padding/sm`), bo `radius/full`, gap trong 6, gap giữa các tab 4 (`gap/2xs`); không viền, không bóng, không nền container; hover `bg/base/hover`; **chọn = nền `bg/brand/selected` (xanh primary nhạt) + chữ và số đếm `fg/brand/selected` (xanh primary)**.
    - Underline/Pill hiển thị số đếm **"Nhãn (123)"** – chữ thường Body/sm-regular `fg/base/hint` (Pill chọn: `fg/brand/selected`; Underline chọn: `fg/base/secondary`). Dấu ngoặc nằm sẵn trong component, property `Count` **chỉ nhập số**. View dùng ô count, cũng chỉ nhập số.
12. **Thanh lọc (filter bar)**: các Select lọc → **Divider dọc 16px** → nút "Add filter" (Ghost + funnel) · bên phải là nhóm Button icon Ghost: **Save view (icon/floppy-disk)** · Làm mới · Cột. Không đặt "Save view" dạng nút có chữ ở bên trái. *(Màn danh sách theo Style principles: gom Save view / Làm mới / Cột vào "View settings" ở cuối hàng View tabs.)*
13. **Vùng cuộn** dùng component **Scrollbar** (không vẽ thanh cuộn tay): track 10px trong suốt, thumb 8px bo tròn, đặt sát mép trong cách 2px; dọc cho list/drawer/dropdown, ngang cho bảng nhiều cột.
14. **Thang bo góc mềm (12–16px)** – chỉ đổi binding trong component, **không đổi giá trị biến radius, không đổi màu**:
    - **Control cao 32–40 → `radius/xl` (12)**: Button, Button icon, Input, Select, Textarea, Input group, Phone input, Combobox/Date/Time trigger, Pagination item, Dropdown/Command item, Toggle, Navigation trigger, Calendar day, Sidebar menu item, Drawer rail item, Bulk action item, Bulk selection pill, App icon, Alert, Card slot, Sheet list, Drawer hint, Sidebar app switcher, List item, Kanban card, Sortable item, Aspect ratio, **Tab trigger View / Tab overflow (ô)**.
    - **Container → `radius/2xl` (16)**: Card, Stat card, App card, Dialog, Toast, Dropdown menu, Command, Popover, Context menu, Hover card, Navigation panel, Kanban column, Carousel slide, Code block, Accordion (Card), Bulk action bar, Table card (pattern), Receipt, khối Setting row (Settings section), card/panel ghép tay trong màn.
    - **Phần tử nhỏ**: Badge `radius/md` (8) · Checkbox box `radius/sm` (6) · Kbd / Inline code / **ô count của Tab View** `radius/sm` (6) · Tooltip / Chart tooltip / Menubar trigger `radius/lg` (10) · Drawer property row `radius/lg` (10).
    - **Giữ tròn hẳn `radius/full`**: Tab Pill, Count badge, Avatar, Switch, Radio, Scrollbar, SLA meter, Slider, Progress, Step indicator, Carousel dot/nút.
    - **Lồng nhau**: bo trong = bo ngoài − padding (vd Dropdown/Command 16, padding 4 → item 12; Toggle group Outline 12, padding 2 → item 10).
15. **Icon = Phosphor Regular** (phosphoricons.com), 16px mặc định (24 trong khối lớn). Mỗi icon là **1 lớp "Vector" dạng fill** (không dùng nét) bind `context/fg/base/icon`. Đổi màu icon trong component bằng **fill** của lớp Vector – nhờ vậy Instance swap icon trong Button/Input… không bao giờ lệch màu. Thêm icon mới: lấy SVG Regular → 1 lớp "Vector" → bind fill. Tên component theo tên Phosphor (`icon/magnifying-glass`, `icon/caret-down`…).
16. **Avatar**: Initials **luôn 2 chữ** (họ + tên, "Minh Đoàn" → MĐ) với 9 màu (Neutral, Blue, Green, Orange, Red, Yellow, Cyan, Pink, Purple – nền `bg-overlay/{intent}/default`, chữ `fg/{intent}/primary`); gán cố định 1 màu/người. Ảnh demo: `Type=Image` + đổi fill style **Avatar/Photo 01–20** (ảnh Unsplash).
17. **Style Attio là định hướng thị giác chung** (03/11): bảng tràn viền dạng lưới, settings dạng hàng một cột 720, gần như chỉ dùng trung tính – chi tiết ở mục Style principles và trang Figma 🧭 Style principles.
18. **View tabs phải đủ trạng thái của sản phẩm** (03/11): All · New · Needs attention · Restocking · Needs confirmation · Pending · Confirmed · Ready to print · Printed · Packing · Ready for pickup · Shipped · Delivered · Returning · Returned · Canceled (VI: Tất cả · Mới · Cần xử lý · Chờ nhập hàng · Cần xác nhận · Chờ hàng · Đã xác nhận · Chờ in · Đã in · Đang đóng gói · Chờ lấy hàng · Đã gửi hàng · Đã giao · Đang hoàn · Đã hoàn · Đã huỷ). Không bỏ bớt trạng thái; hết chỗ thì gom vào More.
19. **Sidebar có 2 trạng thái, đổi bằng property `Mode`** (03/11): **Expanded 256** / **Collapsed 48** (`size/sidebar-collapsed`). Chuyển bằng nút `sidebar-simple` trên Site header. Collapsed: chỉ icon 32 căn giữa; nhãn nhóm thay bằng gạch ngang 16px `border/base/default` (nhóm đầu để trống); badge số đổi thành **chấm brand 8px** góc trên phải (theo `Show badge`); header/footer giữ cao 68 để **hàng icon cùng toạ độ y với Expanded** (đổi Mode không bị nhảy). Hover icon ở Collapsed → **Tooltip `Side=Right`** hiện tên mục.

## Table v2 – chuẩn chung
- Cột: chọn 40 · **Mã đơn** = Link + dòng phụ · **Khách hàng** = tên + SĐT · **Sản phẩm** = tên + SKU/kệ · **Vận chuyển** = ĐVVC + mã vận đơn · **SL/COD** = Number căn phải (tiền âm màu error, dấu "−") · **Trạng thái** = Badge Soft · **Ở bước này** = SLA meter · **Nhân viên** = User · cuối = Action (⋯).
- Header: nền `bg/base/surface-strong`, **`Show icon` tắt** (không icon, mặc định đã tắt), nhãn Body/sm-semibold. **Ngựa vằn**: bật `Striped` cho Table cell + Table checkbox cell ở hàng chẵn (nền `bg/base/surface`); hover/selected/attention vẫn theo màu trạng thái. **Column divider bật** cho head/cell/summary trên màn danh sách. Cuối bảng có **Summary row** (Table summary cell: count / sum), đáy màn có **Pagination bar**.
- Có ngựa vằn (03/11 – thay quy tắc cũ "không zebra"); không tô nền cả hàng để báo lỗi; tối đa ~10 cột mặc định. Hàng Attention/trùng phải có dòng phụ nêu lý do. Bảng tràn viền, không bọc card.

## Components (style shadcn) – theo trang
- **Icon**: 102 icon Phosphor Regular.
- **Button**: Button (+Show count) · Button icon · **Button group · Toggle**: Toggle · Toggle group · Button group (Outline/Split/Vertical)
- **Badge** · Count badge · **Typography · Code**: Typography (H1–Caption) · Inline code · Blockquote · Bullet list · Code block (Light/Dark) · **Divider** · **Scroll area** (Scrollbar)
- **Input & Form**: Input · Select · Textarea · Field · Dropdown menu (+item) · **Input nâng cao**: Label · Input group · Input OTP (+slot) · Phone input · Slider (Single/Range)
- **Command · Combobox**: Command item · Command group label · Command · Combobox · Autocomplete · **Calendar · Date picker**: Calendar day · Calendar · Date picker · Time picker
- Checkbox · Radio · Switch · **Tabs** (Tab trigger Pill / Underline / **View** · **Tab overflow**) · **List · Kanban · Sortable** · **Carousel · Aspect ratio · Resizable**
- **Table** (head +icon/Column divider · cell 9 type +Column divider · checkbox cell · SLA meter · **Table summary cell**) · **Navigation**: Breadcrumb · Navigation menu · Menubar · Pagination
- **Accordion · Stepper · Rating** · Card · Stat card · **Avatar (Image / Initials 9 màu / Icon × 24·32·40·56)** · App icon · App card
- **Feedback**: Progress · Skeleton · Spinner · Kbd · Alert · Toast · Tooltip (**Top / Bottom / Right**) · Chart tooltip
- **Popover · Context menu** · Dialog · Sheet · **Bill · Receipt**: Receipt · Receipt row · Receipt item · Receipt divider · Bulk action item / pill / bar · Drawer / property row / header / rail item · **Sidebar (Mode Expanded / Collapsed)** · Sidebar menu item (Expanded / Collapsed × Default/Hover/Active) · Site header · **Page header** · **Header search** · **Settings**: Setting row

## Quy ước trạng thái đơn (Badge Soft)
Mới, Đang giao = status-0 · Cần xác nhận = info · Chờ hàng = caution · Đã xác nhận = success · Chờ nhập hàng, Đang đóng gói = status-2 · Chờ in, Đã in = status-1 · Đang hoàn = warning · Đã giao = success · Đã hoàn = error · Đã huỷ = neutral.
Receipt: Paid = success · Pending = warning · Failed = error · Refunded = info.

## Pattern (trang Order list)
- `OL_01 Danh sách đơn hàng` – Table v2, 2 dòng chọn + Bulk action bar.
- `OL_02 Chi tiết đơn (Drawer)` – Drawer md 640 mở đè bên phải.
- Mẫu chuẩn mới: **List page** và **Settings** trên trang 🧭 Style principles; bản áp dụng đầy đủ: Master_Data `🛒 OL v2 – Orders`.

## Nhật ký thay đổi
- 03/11 21:30 – **Bảng kéo kín tới Pagination** (user chốt): Table viewport FILL chiều cao còn lại, dòng gom vào khung Body (FILL, clip – dòng cuối bị cắt báo còn cuộn), Summary ghim đáy ngay trên Pagination; OL2 khôi phục 12 dòng (OL2_11: 13 dòng); Scrollbar dọc theo chiều cao Body.
- 03/11 21:10 – **Màn danh sách có Pagination** (user chốt, thay quy tắc "Summary row + cuộn thay phân trang" – sửa cả R15.6 trên trang Rules · C): Master_Data OL2_1–7, OL2_11–13 thêm **Pagination bar** ghim đáy (DS Pagination, EN: `Orders: 1–30 of 107`, Previous · 1 2 3 4 · Next, `30 / page`; OL2_6 `Selected: 3 of 107 · COD: ₱2,439`; OL2_11 `1–30 of 49`, 2 trang). Màn có Filter bar còn 11 dòng để không che Summary; Scrollbar dọc = số dòng / 30. Không thêm ở OL2_8 / 9 / 10 (empty / loading / lỗi). Changelog Visual_Design_FFM +1 dòng (OL2_1).
- 03/11 20:10 – **Sidebar Collapsed cập nhật** (trang Sidebar & Header): header/footer cao 68 như Expanded, slot nhãn nhóm 24px (gạch ngang 16px từ nhóm thứ 2) → 7 hàng icon trùng y với Expanded; **Sidebar menu item** Collapsed thêm **chấm badge** (bind `Show badge`) + giữ nhãn ẩn (bind `Label`); **Tooltip** thêm variant **`Side=Right`**; demo "State · Hover (Collapsed)" cạnh component.
- 03/11 16:10 – **Bảng ngựa vằn + header đậm** (user chốt, thay quy tắc "không zebra"): Table cell (36 variant) và Table checkbox cell thêm prop **`Striped`** (BOOLEAN, mặc định tắt) – lớp `Stripe` dưới cùng, chừa hairline đáy; Default → `bg/base/surface`, Hover/Selected/Attention → giữ màu trạng thái. Table head Default/Sorted + checkbox Header → nền **`bg/base/surface-strong`** (Hover giữ `bg/base/hover`).
- 03/11 16:05 – **Header bảng bỏ toàn bộ icon** (user chốt): Table head `Show icon` mặc định tắt.
- 03/11 16:00 – **Component mới**: **Header search** (`State=Default|Hover|Focus`, prop Placeholder, Show shortcut; rộng 320, `radius/xl`) và **Page header** (Title · Header search · Notifications · More; cao `size/header`, lề `padding/lg`, hairline dưới).
- 03/11 15:55 – **Sửa lỗi icon tối trên nút màu đặc**: fill Vector trong slot icon = màu nhãn của variant (Default/Destructive `fg/base/light-solid`, Link `fg/brand/primary`, Outline/Ghost/Secondary `fg/base/icon`).
- 03/11 15:50 – **Table head** nhãn → **Body/sm-semibold**. **Table summary cell**: nền → **`bg/base/surface-strong`**, giá trị → Body/sm-semibold, nhãn → `fg/base/secondary`.
- 03/11 15:45 – **Chip lọc tách hàng riêng**: điều kiện lọc nằm ở Filter bar riêng, chỉ hiện khi có điều kiện.
- 03/11 15:40 – **Tab trigger thêm `Style=View`** + component set mới **Tab overflow**. List page đổi khung: View tabs thành hàng riêng, Toolbar gộp Sort/Filter + Import/Export + CTA.
- 03/11 14:45 – **Style principles (Attio)**: trang mới 🧭 Style principles; Table head `Show icon` + `Column divider`; Table cell `Column divider`; mới **Table summary cell**; trang **Settings** với **Setting row**.
- 03/11 14:30 – **Icon → Phosphor Regular** (102 icon); Avatar `Type=Image`, `Color` 9 màu, Size 56; 20 paint style `Avatar/Photo 01–20`; trang `Bill · Receipt`.
- 03/11 13:30 – Bổ sung 57 component theo danh mục shadcnstudio (11 trang mới); text style Code/sm, Code/xs.
- 03/11 12:45 – Bo góc mềm hơn (rule #14). 12:35 – Scrollbar. 12:25 – Tab Pill Active brand selected. 12:20 – Divider. 11:30 – Tabs Pill/Underline, Chart tooltip.
- 03/11 10:00 – **Table v2**: hàng 52, header 40; Table cell type Number / User / Dot / SLA; SLA meter.
- 02/11 22:30 – Brand xanh lá → xanh dương (`🔷 blue-brand` 600 = `#1570EF`); neutral zinc → stone.

## Việc còn chờ
- **Pagination item** Previous / Next đang là chữ tiếng Việt cứng ("Trước" / "Sau") – file EN đang override chữ; cần prop `Label` hoặc thuộc tính ngôn ngữ.
- **Publish** Sidebar Collapsed + Tooltip Side=Right.
- Cập nhật mock List page trên trang Figma 🧭 Style principles theo khung View tabs + Toolbar.
- `Skeleton / Table row` đang cố định chiều rộng → làm theo lưới cột. Select chưa phân biệt placeholder / giá trị đã chọn. Bulk action bar còn label tiếng Việt cứng.
- `Column divider` đang mặc định **tắt** – cân nhắc bật mặc định.
- Dựng màn Settings thật cho FFM (Cài đặt kho, Vận chuyển, Thông báo) theo mẫu Setting row.
- Giới hạn: Slider / Scrollbar / Progress chỉnh thumb/fill thủ công trong instance; khuyết tròn Receipt divider lấy màu `bg/base/surface`.
- Pattern OL_01: hàng "Lệch đối soát" tô nền hồng cả hàng (State=Attention) – trái rule Table v2.
- Drawer DS chưa có footer hành động. Switch 32×18 vs quyết định #10 (40×22) – cần team chốt. **Chưa có Dark mode.**
