# OL2 · Danh sách đơn (/admin/order)

> Bản đồng bộ từ Project `claude/ffm-order-list-redesign.md`.
Figma: Master_Data_FFM (lG7msjZzLDwBl0dfWsspry) › page `🛒 OL v2 – Orders` › Section **`DSG_Danh sách đơn · Web`** (130:5676). EN · ₱ · dữ liệu dựng (không dùng dữ liệu khách thật).
Câu hỏi của màn (đề xuất, chờ chốt): **"Đơn nào đang cần mình xử lý ngay?"**

## Lịch sử
- 02/11: phương án A/B/C (VI, style ElevenLabs).
- 03/11 sáng: OL_E (Attio, EN) — **đã xoá, chất lượng chưa đạt**.
- 03/11 14:45: **OL2** dựng lại từ đầu theo DS v2 + Style principles.
- 03/11 15:40: View tabs kiểu Attio (16 trạng thái, tràn vào More); DS thêm Tab trigger `Style=View` + Tab overflow.
- 03/11 18:00: Áp Rules FFM (tên Section/màn, Header bar, NOTE, User flow, mũi tên, @devs, State Hover riêng).
- 03/11 18:30: R08.4 (Section #313131, Title/Header ôm ngang, mũi tên trắng + pill).
- 03/11 20:30: R06.7 (cột Fill + min, Table viewport, Scrollbar); thêm OL2_13 màn hẹp 1280.
- 03/11 21:10: Pagination bar ghim đáy (OL2_1–7, 11–13).
- 03/11 21:30: Bảng kéo kín tới Pagination; 12 dòng (OL2_11: 13).

## Khung màn (1440 × 960)
Page header 56 → **View tabs 44** (tab view + More + View settings) → **Toolbar 52** (Sort · Filter | Import / Export · Create order) → Filter bar 48 khi có điều kiện → **Table viewport** FILL (bảng tràn viền, Column divider, ngựa vằn, header không icon; dòng trong Body clip, Summary ghim đáy) → **Pagination bar 60** (ghim đáy). Lề ngang `padding/lg` 20, không card bao bảng.

**Bảng (R06.7):** cột chọn 40 cố định; 8 cột Fill, min: Order ID 140 · Customer 152 · Status 160 · Issue 172 · Courier 148 · COD 116 · Assignee 132 · Updated 124 (tổng 1184 = khít 1440). Hàng min 52, header / Summary 40. Table viewport clip + cuộn 2 chiều, min 640 × 300. Scrollbar dọc (thumb 11 / 30; OL2_11: 12 / 30), Scrollbar ngang (1440 đủ cột; 1280: 1024 / 1184 = 86%).

| Cột | Nội dung ô |
|---|---|
| Order ID | Link (Body/sm-medium) + dòng phụ thời gian tạo |
| Customer | Tên + SĐT PH (`+63 917 …`) |
| Status | Badge Soft theo quy ước trạng thái |
| Issue | Dot + lý do (vd. No waybill yet, Address unclear) |
| Courier | Tên hãng + waybill (hoặc Muted "No waybill yet") |
| COD | Number căn phải, `₱1,240` |
| Assignee | User (Avatar 24 + tên) |
| Updated | `HH:mm · Mon D` (cột đang sort) |

**Pagination bar:** `Orders: 1–30 of 107` · Previous (disabled) · 1 (active) 2 3 4 · Next · `30 / page`. OL2_6: `Selected: 3 of 107 · COD: ₱2,439` (Bulk action bar nổi phía trên, cách 16). OL2_11: `1–30 of 49`, 2 trang. Không có ở OL2_8 / 9 / 10.

**View tabs** (thứ tự sản phẩm, count mẫu): All 545 · New 40 · Needs attention 107 · Restocking 46 · Needs confirmation 12 · Pending 31 · Confirmed 21 · Ready to print 34 · Printed 8 · Packing 47 · Ready for pickup 42 · Shipped 28 · Delivered 50 · Returning 41 · Returned 49 · Canceled 96. Ở 1440 hiện 5 tab + **More 11** (1280: 4 tab + More 12). Chọn view trong More → thế vào ô tab cuối, Active.

## Bố cục Section (R08.4)
Title / Header "Flow Danh sách đơn hàng" → NOTE + **User flow – Danh sách đơn** (182:8150) → OL2_9 → (Tải xong) OL2_1 → (Bấm More) OL2_2 → (Chọn Returned) OL2_11 · trục "Tải xong" → OL2_10 · trục "Bấm More" → OL2_3 / OL2_4 / OL2_5 / OL2_6 / OL2_7 · OL2_5 → (Không có kết quả) OL2_8 · sub-section **State · Hover tab** (OL2_12) · sub-section **State · Bảng hẹp 1280** (OL2_13).

| Frame | Nội dung |
|---|---|
| OL2_1 Danh sách đơn – Mặc định (**component 201:8946**, màn chính) | Tab Needs attention Active, 12 hàng (dòng cuối cắt) + Pagination |
| OL2_2 … – Mở More views | More mở: Search views · More views (11 view ẩn + count) · Saved views · Save as new view |
| OL2_3 … – View settings | Layout: Columns 8 of 14, Row density, Group by · This view: Save changes ⌘S, Save as new view, Refresh data |
| OL2_4 … – Import / Export | Import orders / Import history · Export this view / Export all orders |
| OL2_5 … – Bộ lọc | Where Created is within Last 7 days · and COD is over ₱400 · Add condition · Clear filters |
| OL2_6 … – Chọn nhiều đơn | 3 hàng Selected + Bulk action bar · Pagination `Selected: 3 of 107 · COD: ₱2,439` |
| OL2_7 … – Chi tiết đơn (Drawer) | Drawer md + rail: Status, Issue, Customer, Created, Courier, Warehouse, COD |
| OL2_8 … – Không có kết quả | "No orders match your filters" + Clear filters (không Pagination) |
| OL2_9 … – Đang tải | Skeleton Line theo lưới cột (không Pagination) |
| OL2_10 … – Lỗi tải | "Couldn't load orders" + Try again (không Pagination) |
| OL2_11 … – View chọn từ More (Returned) | Returned thế vào ô tab cuối, Summary 49 · ₱41,260 · `1–30 of 49` |
| OL2_12 … – Hover tab | State · Hover tab: hover tab Restocking |
| OL2_13 … – Màn hẹp 1280 (cuộn ngang) | State · Bảng hẹp 1280: khung bảng 1024 < 1184 → Scrollbar ngang 86% |

**@devs:** Summary row (count cột đầu, sum cột COD, theo view + bộ lọc, toàn bộ kết quả) · Pagination (đổi trang giữ view + lọc + sort, đổi 30 / page về trang 1, ẩn ở empty / loading / lỗi) · chọn view trong More thế vào ô tab cuối · Filter bar chỉ hiện khi có ≥1 điều kiện.

**Kiểm tra đã chạy:** 0 fill/stroke chưa bind ngoài instance (trừ nền Section #313131 và màu ký hiệu R11) · 0 instance local · 1 nút Default mỗi màn · 0 Hover trên màn tĩnh · chip lọc khớp dữ liệu · soát chữ EN (không P0).

**Glossary EN dùng trên màn:** Create order · Clear filters · Courier · view / More views / Saved views · Needs attention / Needs confirmation · Ready to print · Ready for pickup · No waybill yet · Previous / Next · 30 / page · thời gian `HH:mm · Mon D`.

**Còn chờ:** publish Master_Data để instance OL2_1 ở Visual_Design_FFM có Pagination; bản VI; responsive 1920 / 2560; ghim trái cột chọn + Order ID khi cuộn ngang.
