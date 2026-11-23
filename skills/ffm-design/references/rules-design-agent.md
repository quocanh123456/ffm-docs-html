# FFM – Rules Design Agent (bắt buộc) · v1.8 · 03/11/2026

> Bản đồng bộ từ Project `claude/ffm-rules-design-agent.md`. Nguồn chuẩn trên Figma: file **🗂️ Design System_FFM 🗂️** (bRzGSf4BNsKuwF5w8ISJvT) › nhóm trang **——— RULES · DESIGN AGENT ———**.

**Các trang Rules trên Figma:**
- 🧠 Rules · Mục lục (page 156:56, frame 161:55) — bảng mã khung, link "Mở →"
- ↪ Rules · A · Thiết lập & Đồng bộ (156:57) — R00 (157:64) · R01 CONFIG (157:82)
- ↪ Rules · B · Vai trò & Quy trình (156:58) — R02–R05 (R03.7 Visual Design · R03.8 Magic Word "Publish")
- ↪ Rules · C · Quy tắc thiết kế (156:59) — R06–R11 (R06.7 bảng, R08.4 trình bày flow, ví dụ User flow) · R15 + R15.6 ngoại lệ FFM · **R16 UX writing FFM** (177:55)
- ↪ Rules · D · Style, Ghi nhớ & Kiểm tra (156:60) — R12 Style Profile · R13 Nhật ký · R14 Checklist
- ↪ **Rules · E · UX writing (web)** (page 180:55, frame 180:56) — bộ UX writing dạng trang docs

Trình bày bằng token + text style DS FFM (trang 1440, bg/base/canvas, Heading/3xl · Heading/lg · Body/md-semibold · Body/sm, thẻ bg/base/surface radius/2xl, Divider). Layer giữ mã (R06 · …, R06.3) để "quét Rules" hoạt động.
Template gốc dùng chung mọi dự án: file **Rules-Design** v1.6 (dCn2DoelcHrOYd9mDDuuQs) — FFM không sửa template; phụ lục Pancake (E) chỉ có ở template.

**Đồng bộ 2 chiều (R00):** sửa ở Figma → nói "quét Rules" → cập nhật doc này + tăng phiên bản + ghi Nhật ký R13. Lệch mà không rõ bên nào mới hơn → hiện cả 2, hỏi User.

**Thứ tự ưu tiên khi đọc:** Rules FFM (trang RULES trong DS + file này) → `ux-writing.md` (chữ) → `design-system.md` (token, component, 19 quy tắc DS) → doc từng màn (`screens/`).

## R01 · CONFIG FFM
| Key | Giá trị |
|---|---|
| PROJECT_NAME | Pancake Fulfillment (FFM) — fulfillment.pancake.vn |
| TEAM_NAME | `<chưa có>` |
| PLATFORMS | Web (chưa có Mobile) |
| UI_LANGUAGES | VI, ENG — ENG vẽ trước, VI vẽ sau khi chốt ENG (chốt 03/11) |
| AGENT_LANGUAGE | Tiếng Việt |
| DS_WEB | 🗂️ Design System_FFM 🗂️ v2 (bRzGSf4BNsKuwF5w8ISJvT) |
| DS_DEPRECATED | DS FFM v1 (Ant · Roboto · xanh lá) — không dùng |
| DS_SCAN_TARGETS | Nhóm trang RULES · DESIGN AGENT · 📖 Getting started · 🧭 Style principles (117:55) · Variables 1. Color / 2. Spacing / 3. Radius / 4. Effect / 📘 Typography |
| DS_FORBIDDEN | Trang 📘 Cover · không bind trực tiếp Primitive ẩn (🎨 Seed, 📏 Dimension) |
| MASTER_DATA_FILE | Master_Data_FFM (lG7msjZzLDwBl0dfWsspry) — **đã publish library** (màn chính là component). **Chỉ Designer vẽ**; 1 page = 1 tính năng, cập nhật ngay trên page có sẵn |
| PLANNING_FILE | **Planning_FFM** (JMmW4flVz7gt1jeYsPVWgP) — https://www.figma.com/design/JMmW4flVz7gt1jeYsPVWgP/Planning_FFM — **nơi BA/PM vẽ** (chốt 03/11) |
| PLANNING_PAGES | 1 page = 1 tính năng, đặt cùng tên với page bên Master_Data_FFM (vd. `🛒 Orders`, `🔐 Permissions`). Hiện file mới có `Page 1` → tạo page khi BA bắt đầu tính năng |
| VISUAL_DESIGN_FILE | **Visual_Design_FFM** (ridq2pyg8MUzljRgx7MQ04) — chỉ màn chính, instance từ Master_Data_FFM (và Planning_FFM khi BA "Publish", R03.8) |
| VISUAL_INDEX_PAGE | 📑 Design screen list › frame `Design screen list_FFM` (4:72) |
| CHANGELOG_PAGE | 🕘 Changelog (frame `Changelog_FFM` 4:210) |
| GUIDELINE_FILE | `<chưa có>` |
| VIEWPORT_WEB_BASE / RESP | 1440 × 960 / 1920 × 1080; 2560 × 1440 |
| SECTION_PREFIX | DSG_ |
| ISSUE_NUMBERING | `<chưa có>` |
| Viết tắt đã dùng | OL2 = Danh sách đơn (v2) · PR = Phân quyền |
| UX_WRITING_RULES / UX_REVIEW_SKILL | **R16 · `ux-writing.md` (v1.2 · Sơn Hoàng)** + ux-writing-vi (VI), ux-writing (ENG) / figma-ux-writing-review — R16 thắng khi khác |
| ANTI_SLOP_FILE | R15 + ngoại lệ FFM R15.6 |
| MEMORY_LOCATION | Project Fullfillment_Design · khung R13 trang Rules · D trong file DS FFM · (repo này: `CHANGELOG.md`) |

### R01.1 · Ai vẽ ở đâu (chốt 03/11)
| Vai trò | File vẽ | Được làm | Không được |
|---|---|---|---|
| **BA/PM** | **Planning_FFM**, page theo tính năng | User flow + màn yêu cầu bằng component DS FFM, đủ trạng thái, NOTE; vẽ xong flow → gõ **"Publish"** (R03.8) | Tự tạo component / publish (Agent làm khi có "Publish"), sửa DS, sửa Master_Data_FFM / Visual_Design_FFM |
| **Designer** | **Master_Data_FFM**, page theo tính năng (sửa trực tiếp page có sẵn) | Toàn bộ quy trình R04, đóng component màn chính, publish | — |
| (Visual) | Visual_Design_FFM | Chỉ instance màn chính (R03.7) | Vẽ / copy tay |
- Luồng: BA vẽ ở Planning_FFM → "Publish" → màn chính lên Visual_Design_FFM (nguồn Planning) → Designer lấy làm **nguồn yêu cầu** (R10: không chép bố cục/màu) → vẽ chuẩn vào page tính năng ở Master_Data_FFM → Swap instance Visual Design sang nguồn Master Data.
- Sửa tính năng đã có (Designer) → sửa trực tiếp trên page đó: giữ mã màn cũ, màn mới nối tiếp số (vd. OL2_14), cập nhật NOTE + User flow + `@devs`; màn chính đổi → R03.7.
- Dev không vẽ; đọc Master_Data_FFM (Section flow + `@devs`) và Visual_Design_FFM.

## R04 · Quy trình mỗi lần có lệnh Vẽ / Design (không bỏ bước ✔)
0. **Chuẩn bị ✔** — đọc R01, kiểm tra kết nối (Figma MCP, Mobbin).
1. **Hỏi vai trò ✔** — Designer hay BA/PM (user Ming Đoàn là Designer) → **chọn file theo R01.1**.
2. **Phạm vi ✔** — Web/Mobile, tên + viết tắt, **page tính năng** trong file của vai trò, **câu hỏi của màn**.
3. **Quét Rules + DS ✔**.
4. **Quét page tính năng ✔** (Designer: Master_Data_FFM + bản BA trong Planning_FFM nếu có), Style Profile.
5. **Research Mobbin + web ✔** (gửi tham khảo kèm link).
6. **Vẽ** — chữ viết theo R16 ngay khi vẽ.
7. **Tự kiểm tra ✔** — UX review theo R16, sửa hết P0, soát slop, checklist R14.
8. **Cập nhật Visual Design ✔** — Designer: R03.7 (giai đoạn đầu cập nhật ngay) · BA/PM: chỉ khi gõ "Publish" (R03.8).
9. **Học & ghi nhớ ✔** — Nhật ký R13 + Project.

### R03.7 · Visual Design FFM — thư mục màn CHÍNH (bắt buộc)
- File **Visual_Design_FFM** chỉ chứa **màn chính** của mỗi tính năng (màn Default của từng view / tab). **Không** đưa màn lân cận: popover, menu, drawer, toast, empty / loading / lỗi, hover, màn hẹp, OPTION.
- Trang **📑 Design screen list**: bảng thư mục theo mẫu sẵn có (cell = component `Component 1` Title / Body): **SCREEN · MENU #1 · SCREEN NAME · ID NAME · LINK**, đi từ ngoài vào trong (module → menu → màn); LINK nhảy tới instance màn trong file. Mỗi module 1 trang màn (**🛒 Orders**, **⚙️ Settings · Permissions** …). Trang **🕘 Changelog**: NGÀY · ID NAME · THAY ĐỔI · ISSUE · NGƯỜI.
- Màn chính ở Master_Data_FFM **đóng thành Component** (giữ tên mã, vd. `OL2_1 Danh sách đơn – Mặc định`; description ghi menu · đường dẫn · khung · ngôn ngữ · ngày). Visual Design chỉ dùng **instance** của component → sửa ở Master Data, **publish library**, Visual Design nhận cập nhật (Accept update). Không vẽ / copy tay.
- **Sau khi thiết kế bất kỳ tính năng nào** → màn chính có thay đổi thì cập nhật component + publish, thêm / sửa dòng thư mục và 1 dòng Changelog. **Giai đoạn đầu (vẽ lại mới)**: cập nhật ngay khi màn chính dựng xong, không chờ chốt Issue.
- Màn chính mới: đóng component → **publish** (component mới chỉ import được sau khi publish) → đặt instance vào trang module (lưới 1440, cách 200, tên = mã màn) → thêm dòng thư mục (LINK → instance) + Changelog.

### R03.8 · Magic Word "Publish" — đồng bộ sang Visual Design (bắt buộc)
- BA / PM (hoặc Designer) vẽ **xong hoàn toàn 1 flow** → gõ **"Publish"** (kèm tên tính năng / link Section) để Agent đồng bộ sang Visual_Design_FFM. BA / PM không tự đóng component, không tự publish.
- Agent làm theo thứ tự:
  1. **Kiểm tra** flow theo R14 + R06.7 + R08.4 + **UX writing R16** (đủ trạng thái, User flow, chữ, bảng) — còn lỗi thì liệt kê và dừng, chưa đồng bộ.
  2. **Chọn màn chính** (màn Default từng view / tab, R03.7) và báo lại để xác nhận.
  3. **Đóng component** màn chính ngay trong file đã vẽ flow (hoặc cập nhật component có sẵn), description ghi menu · đường dẫn · khung · ngôn ngữ · ngày · người vẽ.
  4. **Nhắc người có quyền Edit bấm Publish library** của file đó (Planning_FFM / Master_Data_FFM) — Agent không tự publish được → chờ xác nhận "đã publish".
  5. **Đồng bộ Visual Design**: đặt / cập nhật instance ở trang module, thêm / sửa dòng Design screen list (LINK → instance), thêm 1 dòng Changelog (NGƯỜI = người gõ Publish).
  6. **Báo lại** link màn trong Visual Design + danh sách đã đổi; ghi Nhật ký R13.
- Designer vẽ chuẩn lại flow của BA ở Master_Data_FFM → **Swap** instance trong Visual Design sang component Master Data, Changelog ghi "chuyển nguồn Planning → Master Data".
- Chưa gõ "Publish" → Agent không đẩy flow đang vẽ dở sang Visual Design.

## Quy tắc trình bày trong file (R06–R11) – áp cho mọi Section FFM
- **Section**: `DSG_<tên tính năng> · Web`. **Screen**: `<Viết tắt>_<STT> <mô tả tiếng Việt>` (vd. `OL2_1 Danh sách đơn – Mặc định`). Viết tắt mới → đưa 2–3 gợi ý, User chọn.
- Section chỉ chứa: Title / Header · **NOTE** · **User flow** · màn hình · mũi tên · nhãn (+ ghi chú `@devs` cạnh màn, nền `bg/caution/selected`). Xong việc không để frame thừa.
- **User flow** (R11) mỗi Section: flowchart trái → phải; Start/End viên thuốc #1D1D1D chữ trắng · User action chữ nhật bo nhẹ #E4D6F6 viền #B37FEB · Decision hình thoi #C0DBF6 viền #4096FF; mũi tên đen mảnh, rẽ/gộp nhánh bằng đường cong mềm; nhánh thoi ghi "Có"/"Không"; ghi mã màn.
- **Trạng thái** (R06.4): vẽ đủ empty · loading · hover · lỗi · giới hạn nền tảng. Màn tĩnh, màn nền sau overlay → Default (kể cả nút đang mở menu). Hover chỉ trong sub-section **State · …** riêng, đúng 1 phần tử, có ghi chú "Hover vào … hiển thị …".
- Nhiều phương án → sub-section OPTION 1, OPTION 2. Component có chữ → thuộc tính ngôn ngữ.
- Dùng lại màn có sẵn = mang màn thật sang, không placeholder (R09). Mockup BA/PM chỉ là nguồn yêu cầu, không chép bố cục/màu (R10) – bàn giao ghi chỗ đã quy đổi.
- Designer được tạo component (xin phép khi cần component mới), gom vào Section `DSG_<tên> · Components` cạnh flow. BA/PM → không tạo component. Không sửa file DS khi chưa được phép (R06.1). **Ngoại lệ**: màn chính được đóng component ngay tại chỗ trong Section flow (R03.7, R03.8).
- UX writing viết ngay khi vẽ theo **R16**, không chữ tạm.

### R06.7 · Bảng (Table) — co giãn, min size & cuộn (bắt buộc)
- Cột dữ liệu **Fill** theo bề ngang khung, màn rộng hơn thì giãn ra; chỉ cột chọn (40) và cột hành động ⋯ (56) cố định.
- Mỗi cột có **min width** = độ rộng đủ đọc dữ liệu ở màn chuẩn 1440 (OL2: Order ID 140 · Customer 152 · Status 160 · Issue 172 · Courier 148 · COD 116 · Assignee 132 · Updated 124 → tổng 1184; PR Members: Member 392 · Extra permissions 270 · ⋯ 56). Hàng **min height** 52 (Compact 36), header và Summary 40. Summary row cũng Fill + min theo cột.
- Bảng bọc trong khung **Table viewport**: clip, cuộn 2 chiều (overflow BOTH), **min 640 × 300** (đủ header + 5 dòng; bảng trong Settings min 480 × 300).
- Tổng min width > bề ngang khung → **cuộn ngang**, không bóp cột dưới min; cột chọn + cột đầu ghim trái khi cuộn.
- Màn dạng bảng **luôn đặt instance Scrollbar** (component DS) để Dev thấy vùng cuộn: **Scrollbar / Dọc** ở vùng dòng (dưới header, sát phải), **Scrollbar / Ngang** sát đáy vùng dòng; thumb theo tỉ lệ hiển thị / tổng của **1 trang** (vd. 11 / 30 dòng; 1024 / 1184 px → 86%). Instance không cho chỉnh thumb → đặt instance trong khung clip bằng track (absolute, constraint theo cạnh), co giãn instance = track × tỉ lệ / 0.4 (thumb mặc định 40% track). Empty / lỗi chỉ cần Scrollbar ngang.
- **Pagination bar** ghim đáy màn danh sách: hairline trên, lề `padding/lg`, DS **Pagination** ("Orders: 1–30 of 107" · số trang · "30 / page"); ẩn ở empty / loading / lỗi.
- **Bảng kéo kín tới Pagination** (không để khoảng hở): Table viewport **FILL** chiều cao còn lại; các dòng nằm trong khung **Body** (FILL, clip) → dòng cuối bị cắt để báo còn cuộn; **Summary row ghim đáy viewport**, sát trên Pagination; Scrollbar dọc = chiều cao Body, Scrollbar ngang sát đáy Body.
- Bảng nhiều cột → vẽ thêm **1 màn hẹp 1280** trong sub-section **State · Bảng hẹp 1280** thể hiện cuộn ngang (vd. OL2_13).

### R08.4 · Trình bày flow (bắt buộc; mẫu: FnB Master Data `eNy0eET3ta6zfNlLtn44X4` node 247:65823; chuẩn FFM: `DSG_Danh sách đơn · Web` 130:5676)
- **Mỗi flow / luồng = 1 Section tối màu, nền `#313131`** (màu trình bày cố định, được phép không bind token như màu ký hiệu R11). Màn, NOTE, User flow đặt trên nền tối, lề 100.
- **Title / Header ôm hết chiều ngang Section** (x 0, y 0, rộng = Section; Section đổi kích thước → kéo lại): lề 60 → thẻ sáng `bg/base/canvas` bo `radius/6xl`, padding 40, gap 32 → ô icon 108 (nền canvas, viền `border/base/default` 2px, bo `radius/4xl`, icon Phosphor 64) · tiêu đề **Heading/4xl** "Flow <tên luồng>" · đường dẫn **Heading/xl** `fg/base/secondary` "Menu / Màn · /đường-dẫn" · bên phải Body/md-regular secondary: nền tảng · khung · ngôn ngữ · DS · ngày · người.
- **Mũi tên**: nét trắng 2px `fg/base/light-solid`, đầu **chấm tròn đặc** (CIRCLE_FILLED), cuối **mũi tên tam giác** (ARROW_EQUILATERAL); từ mép phải màn nguồn tới mép trái màn đích, ngang ở giữa chiều cao màn (y + 480).
- **Pill xanh lá** `bg/success/default` giữa mũi tên ngang = thao tác chuyển màn ("Bấm More") · **Pill xanh dương** `bg/brand/default` trên trục dọc = tên nhánh ("Bấm Filter"). Pill bo `radius/full`, padding 10/16, Body/md-regular trắng, động từ + đối tượng.
- **Rẽ nhánh**: 1 trục dọc đi xuống từ giữa mũi tên ngang (dưới pill xanh lá), bẻ góc **bo 12** sang phải vào mép trái màn đích; màn của các nhánh xếp thành cột ngay bên phải trục; mỗi nhánh 1 pill xanh dương trên trục, cách góc rẽ ~320.
- Lưới: cột 1440 + gap 480 (pill nằm giữa gap), hàng 960 + gap 320. Gom nét vào group **Flow arrows**, pill vào group **Flow labels** đặt trên cùng (pill không bị nét đè, không lộ tên frame trên canvas).

## R15 · Chống AI-slop + ngoại lệ FFM (R15.6)
- Mỗi màn có 1 câu hỏi; khối/số lớn nhất trả lời câu đó. Màu chỉ cho dữ liệu, trạng thái, 1 Primary/màn; chrome trung tính; bề mặt phẳng; tiêu đề là danh từ, không emoji; số căn phải, tabular, có dấu ngàn, 0 in "0", thiếu in "—".
- Dữ liệu mẫu như thật (có số lẻ, có 0, tên dài); tổng = cộng dòng; không "Nguyễn Văn A", Lorem.
- Cấm: gradient/glow/blur · icon tròn trên KPI, sparkline KPI, 4 card KPI rời · chart cầu vồng · emoji · Primary trên tab/chip/link · header bảng chữ hoa · chip đặc màu mọi dòng · lưới đều gây ô mồ côi.
- **Ngoại lệ FFM (thắng R15)**: bảng **được ngựa vằn** (hàng chẵn `Striped` → `bg/base/surface`, header `bg/base/surface-strong`, chữ thường Semibold, không icon) · ô trống theo DS Muted ("Chưa có"/"No …"), ô số thiếu in "—" · **màn danh sách có Summary row + Pagination ở đáy** (trừ empty / loading / lỗi) — chốt 03/11 21:10.

## R16 · UX writing FFM (bắt buộc — bản đầy đủ: `ux-writing.md`)
Áp dụng mỗi lần vẽ / làm UI UX; khác R07 → **R16 thắng**.
- **Voice**: Rõ ràng · Ngắn gọn · Bình tĩnh · Trung tính. Trang trọng 3/5 · VI lược chủ ngữ · EN chỉ "you" · **không "Vui lòng" / "Please"**. **Viết English trước**, VI dịch theo Glossary.
- **Tone**: thành công = cái đã đổi + Undo · lỗi hệ thống = chuyện gì + 1 hành động · lỗi nhập liệu = điều kiện đúng dưới trường, không "Invalid" · phá huỷ = câu hỏi có đối tượng + số lượng, nút lặp động từ · empty = 1 câu + 1 hành động · đang tải = skeleton, không "Loading…".
- **Trình bày**: EN Sentence case · không chấm ở nhãn / tiêu đề / nút, không chấm than, cấm emoji · số 1,234, 0 = "0", thiếu = "—" · tiền theo quốc gia của dữ liệu (₱41,260 PH · ฿1,250 TH) · HH:mm · Mon D (EN) / HH:mm · DD/MM (VI) · cắt "…" + Tooltip, Order ID không cắt · viết tắt chỉ COD, SKU, ID.
- **Độ dài tối đa**: Nút 1–3 từ ≤ 20 ký tự · Tiêu đề trang 1–4 từ · Tab view 1–3 từ · Toast 1 câu ≤ 60 + 1 hành động · Tooltip ≤ 80 · Badge 1–2 từ · Mô tả Setting row 1 câu ≤ 90.
- **Glossary** bắt buộc (xem `ux-writing.md` §7). Từ mới → thêm vào Glossary trước khi dùng.
- **Mức lỗi**: P0 sửa trước bàn giao · P1 sửa trong vòng phát hành · P2 gợi ý. Review: khi vẽ flow · trước bàn giao Dev · khi BA gõ "Publish".
- Ghi nhận 03/11: dấu hai chấm ở cặp tóm tắt Pagination / Bulk bar ("Orders:", "Selected:", "COD:") theo DS #3 "Nhãn: Giá trị" (không phải nhãn trường) → hợp lệ; nhóm điều hướng Settings tên "Team" → ngoại lệ Glossary v1.1.

## R14 · Checklist bàn giao (rút gọn)
- [ ] R01 đã đọc · vai trò · **đúng file theo R01.1** (BA/PM → Planning_FFM · Designer → Master_Data_FFM)
- [ ] Web/Mobile, tên + viết tắt, page tính năng, câu hỏi màn
- [ ] DS mới nhất (v2), không DS cũ; mọi màu/spacing/radius/chữ bind token (trừ nền Section #313131 và màu ký hiệu R11)
- [ ] Không component chưa phép · màn có sẵn mang sang thật · không chép mockup
- [ ] Soát slop R15 (+ ngoại lệ R15.6)
- [ ] Đủ trạng thái (empty · loading · lỗi · hover), Hover trong State riêng, màn tĩnh = Default
- [ ] Bảng theo R06.7 (Fill + min, Table viewport, Scrollbar, Summary, Pagination bar, màn hẹp 1280)
- [ ] Chữ đúng R16 (EN trước, sentence case, không "Please", không emoji / chấm than, đúng Glossary, trong giới hạn độ dài, tone đúng tình huống), **không còn P0**
- [ ] Đủ VI/ENG (FFM: VI sau khi chốt ENG)
- [ ] Section đúng tên `DSG_… · Web` + nền #313131, Title / Header ôm hết chiều ngang, mũi tên trắng chấm tròn + pill xanh lá / xanh dương (R08.4)
- [ ] User flow đúng ký hiệu R11 · NOTE · `@devs` · không frame thừa
- [ ] (Designer) màn chính là component đã publish, instance trong Visual Design đúng bản mới, có dòng thư mục + Changelog (R03.7)
- [ ] Flow của BA chỉ lên Visual Design sau khi có "Publish" (R03.8)
- [ ] Ghi R12/R13 + Project

## R12.3 · Style Profile FFM (chờ User xác nhận)
Attio-inspired · ~90% trung tính stone · brand xanh dương #1570EF chỉ cho CTA/link/chọn/focus · Inter 14/20 · bo 12 (control) / 16 (container) · hairline 1px · bảng tràn viền ngựa vằn + Column divider · settings 1 cột 720 dạng Setting row · Phosphor Regular 16.

## R13.2 · Nhật ký
- 02–03/11 · DS FFM v2 (shadcn/ui + Attio, Inter, Phosphor, brand xanh dương, stone); 18 quy tắc DS · Ming Đoàn
- 03/11 · Khởi tạo Rules FFM từ template v1.6; điền R01, Style Profile R12.3 (chờ xác nhận) · Ming Đoàn
- 03/11 · Giữ bảng ngựa vằn (R15.6) · Bản VI vẽ sau khi chốt ENG · Ming Đoàn
- 03/11 · Áp Rules vào Master_Data_FFM (tên Section/screen, header, User flow, mũi tên, State Hover) · Ming Đoàn
- 03/11 · Chuyển Rules FFM về file DS FFM (nhóm trang RULES · DESIGN AGENT, v1.1) · Ming Đoàn
- 03/11 · **R08.4 trình bày flow** theo mẫu FnB Master Data (v1.2) · Ming Đoàn
- 03/11 · Nền Section flow chuẩn **#313131** · Ming Đoàn
- 03/11 · Thêm quy tắc DS #19 Sidebar Expanded / Collapsed · Ming Đoàn
- 03/11 · **R06.7 bảng** (v1.3) · Ming Đoàn
- 03/11 · **R03.7 Visual Design** (v1.4) · Ming Đoàn
- 03/11 20:48 · Master_Data_FFM: 1 page = 1 tính năng (v1.5) · Ming Đoàn
- 03/11 20:55 · Master_Data_FFM publish lại → instance OL2_1, PR_1, PR_2 vào Visual_Design_FFM · Ming Đoàn
- 03/11 20:58 · **PLANNING_FILE = Planning_FFM**; thêm **R01.1 Ai vẽ ở đâu** (v1.6) · Ming Đoàn
- 03/11 21:00 · **R03.8 Magic Word "Publish"** · Ming Đoàn
- 03/11 21:10 · **Màn danh sách có Pagination** (v1.7) · Ming Đoàn
- 03/11 21:30 · Bảng kéo kín tới Pagination (R06.7) · Ming Đoàn
- 03/11 21:35 · **R16 · UX writing FFM** (v1.8) · Ming Đoàn
- 03/11 21:50 · Đóng gói toàn bộ dự án thành skill `ffm-design` (repo `FFM_Design_skill`) · Ming Đoàn
- 04/11 · R16: tiền tệ theo quốc gia của dữ liệu, thị trường theo các nước FFM đang hỗ trợ (bản md; khung R16 trên Figma chưa sửa) · Sơn Hoàng

## Đã áp dụng – Master_Data_FFM
| Section | Bố cục |
|---|---|
| `DSG_Danh sách đơn · Web` (130:5676, page 🛒 OL v2 – Orders) | Hàng 1: OL2_9 → (Tải xong) **OL2_1 (component 201:8946)** → (Bấm More) OL2_2 → (Chọn Returned) OL2_11 · trục từ "Tải xong" → OL2_10 · trục từ "Bấm More" → cột OL2_3 · OL2_4 · OL2_5 · OL2_6 · OL2_7 · OL2_5 → (Không có kết quả) OL2_8 · State · Hover tab (OL2_12) · State · Bảng hẹp 1280 (OL2_13) · NOTE + User flow (182:8150) · 3 @devs |
| `DSG_Phân quyền · Web` (158:1943, page 🔐 Permissions) | **PR_1 (201:10447)** → (Bật 1 quyền) PR_5 · trục → **PR_2 (201:10448)** (Mở tab Members) → (Bấm Paolo Cruz) PR_3 · PR_4 · PR_6 · NOTE + User flow (184:1519) · 2 @devs |

## Visual_Design_FFM (03/11)
| Trang | Nội dung |
|---|---|
| 📑 Design screen list | Frame `Design screen list_FFM` (4:72): Orders · Danh sách đơn · Danh sách đơn hàng · OL2_1 · Settings · Team › Permissions · Quyền của phòng ban · PR_1 · Thành viên · PR_2; LINK "Screen" → instance |
| 🛒 Orders | Instance `OL2_1 Danh sách đơn – Mặc định` (6:1910) |
| ⚙️ Settings · Permissions | Instance `PR_1` (6:3695) · `PR_2` (6:4355) |
| 🕘 Changelog | `Changelog_FFM` (4:210): 4 dòng 03/11 |

## Còn thiếu / việc chờ
- Publish Master_Data_FFM để instance OL2_1 bên Visual_Design_FFM nhận Pagination (Accept update).
- Pagination item trong DS có chữ "Trước / Sau" cứng → cần prop Label / ngôn ngữ.
- Đồng bộ khung **R01 CONFIG trên Figma** (Rules · A, 157:82) với v1.6.
- Planning_FFM mới có `Page 1`; BA cần bật library DS FFM. Để "Publish" chạy được: Planning_FFM cũng phải publish library và được bật trong Visual_Design_FFM.
- Điền TEAM_NAME, GUIDELINE_FILE, ISSUE_NUMBERING.
- Bản VI cho OL2 và Permissions + responsive 1920 / 2560 sau khi chốt.
- Cân nhắc đưa **Title / Header**, **Flow pill**, **Table viewport** thành component DS; Scrollbar nên có property độ dài thumb; token riêng cho nền Section #313131.
- Ghim trái cột chọn + Order ID khi cuộn ngang chưa dựng tách lớp trong màn.
