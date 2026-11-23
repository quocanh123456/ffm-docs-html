# UX writing rules · Pancake Fulfillment (FFM)

Phiên bản v1.2 · áp dụng 04/11/2026 · phụ trách Sơn Hoàng · duyệt Sơn Hoàng
> Bản đồng bộ từ Project `claude/ffm-ux-writing-rules.md`. Figma: DS FFM › Rules · C khung R16 (177:55) + trang Rules · E · UX writing (web) (180:56). Khác R07 → **R16 (file này) thắng**.

## 1. Dự án
- Sản phẩm: Giúp đội vận hành xử lý đơn từ lúc nhận tới lúc giao: xác nhận, in, đóng gói, bàn giao vận chuyển và theo dõi hoàn.
- Đường dẫn: fulfillment.pancake.vn
- Nền tảng: Web
- Ngôn ngữ giao diện: English, Tiếng Việt · viết trước: English

## 2. Người dùng & bối cảnh
- Nhóm người dùng: Nhân viên kho, Nhân viên đóng gói, CSKH / Telesale, Quản lý vận hành, Admin hệ thống
- Mức thuật ngữ: Nghiệp vụ
- Thị trường: Philippines, Thái Lan, Malaysia, Indonesia, Singapore, Campuchia, Lào, Myanmar (các nước FFM đang hỗ trợ; có thể thêm Việt Nam khi FFM mở rộng)
- Bối cảnh: Desktop 1440 trở lên, dùng liên tục cả ca. Quét danh sách hàng trăm đơn và cần thấy đơn cần xử lý trong vài giây. Nhiều người dùng ở PH, TH, MY, ID, SG, KH, LA, MM đọc giao diện tiếng Anh như ngôn ngữ thứ hai.
- Vấn đề chữ cần sửa: Tên quyền trùng giữa các nhóm, viết hoa lộn xộn, không nói quyền làm gì. Cảnh báo viết thành câu giải thích dài. Nhãn nút ghép số đếm.

## 3. Voice
| Thuộc tính | Nghĩa là | Không phải là | Nên | Tránh |
|---|---|---|---|---|
| Rõ ràng | Gọi đúng tên việc người dùng đang làm, dùng từ nghiệp vụ quen thuộc | Kỹ thuật, mơ hồ, tên tính năng nội bộ | Print waybill | Execute print job |
| Ngắn gọn | Mỗi chữ có việc; nhãn 1–2 từ khi ngữ cảnh đã rõ đối tượng | Cụt tới mức phải đoán | Confirm (trong drawer đơn) | Click here to confirm this order |
| Bình tĩnh | Báo sự thật và cách sửa, không đổ lỗi cho người dùng | Hốt hoảng, dấu chấm than, xin lỗi dài dòng | Couldn't load orders · Try again | Oops! Something went wrong!! |
| Trung tính | UI chỉ có nhãn, dữ liệu và hành động | Chú thích, mẹo, tự khen | No orders match your filters | Showing 0 results that match your filters |

- Mức trang trọng: 3/5 (trung tính)
- Xưng hô VI: Lược chủ ngữ · EN: Chỉ dùng you
- "Vui lòng" / "Please": Không dùng

## 4. Tone theo tình huống
| Tình huống | Sắc thái | Quy tắc | Ví dụ |
|---|---|---|---|
| Thành công | Ngắn, xác nhận kết quả | Nói cái đã đổi; có Undo nếu hoàn tác được. Không "Success!" | Permission updated · Sales can now bulk update orders. · Undo |
| Lỗi hệ thống | Bình tĩnh, nhận phần lỗi về hệ thống | Chuyện gì xảy ra + 1 hành động. Không mã lỗi trơn | Couldn't load orders · Try again |
| Lỗi do nhập liệu | Hướng dẫn, không đổ lỗi | Nói điều kiện đúng ngay dưới trường, không "Invalid" | Enter a phone number with 10–11 digits |
| Hành động phá huỷ | Nghiêm túc, cụ thể | Tiêu đề là câu hỏi có đối tượng + số lượng; nút lặp lại đúng động từ | Cancel 3 orders? · Cancel orders / Keep orders |
| Empty state | Trung tính, chỉ đường | 1 câu + 1 hành động | No orders match your filters · Clear filters |
| Đang tải | Im lặng | Skeleton theo lưới cột, không chữ "Loading…" | — |
| Lần đầu sử dụng | Chỉ việc đầu tiên | Nói việc cần làm đầu tiên bằng 1 nút | No members yet · Add members |

## 5. Quy tắc trình bày
- Viết hoa EN: Sentence case · VI: Chữ đầu + tên riêng
- Dấu chấm: Không chấm ở nhãn, tiêu đề, nút · chấm than: Không dùng · emoji: Cấm
- Số: 1,234 · căn phải, tabular · 0 in "0", thiếu in "—"
- Tiền tệ: theo quốc gia của dữ liệu, ví dụ ₱41,260 (PH) · ฿1,250 (TH); ₫ chỉ dùng khi FFM có thị trường Việt Nam
- Ngày giờ: HH:mm · Mon D (EN) · HH:mm · DD/MM (VI)
- Số điện thoại: Theo định dạng quốc gia, có khoảng trắng nhóm số
- Cắt chữ: Cắt cuối bằng "…", hiện đủ trong Tooltip; Order ID không cắt
- Viết tắt: Được dùng: COD, SKU, ID. Không dùng trên UI: ĐVVC → Đơn vị vận chuyển, SL → Số lượng, KH → Khách hàng.

### Giới hạn độ dài
| Thành phần | Tối đa |
|---|---|
| Nút | 1–3 từ · ≤ 20 ký tự |
| Tiêu đề trang | 1–4 từ, danh từ |
| Tab view | 1–3 từ |
| Toast | 1 câu · ≤ 60 ký tự + 1 hành động |
| Tooltip | ≤ 80 ký tự |
| Badge | 1–2 từ |
| Mô tả Setting row | 1 câu · ≤ 90 ký tự |

## 6. Mẫu theo thành phần
| Thành phần | Công thức | Nên | Tránh |
|---|---|---|---|
| Nút | Động từ + đối tượng; 1–2 từ khi ngữ cảnh đã rõ; không ghép số (dùng Show count) | Create order | Order creation · Hoàn tất đóng gói · 2 |
| Tiêu đề trang / section | Danh từ, không emoji, không bộ đếm phụ | Orders | 📦 Manage your orders · Orders 2 of 7 on |
| Header bảng | Danh từ, sentence case, không icon | Order ID | ORDER ID |
| Nhãn trường | Danh từ, không dấu hai chấm | Customer name | Customer name: |
| Placeholder | Ví dụ định dạng, không lặp lại nhãn | +63 917 123 4567 | Enter phone number |
| Empty state | 1 câu + 1 hành động | No orders match your filters · Clear filters | Hiển thị 0 kết quả phù hợp |
| Thông báo lỗi | Chuyện gì xảy ra + cách sửa | Couldn't load orders · Try again | Error 500 |
| Toast | Kết quả + Undo khi hoàn tác được | Order canceled · Undo | Success! |
| Dialog xác nhận | Tiêu đề là câu hỏi; nút là động từ cụ thể | Cancel 3 orders? · Cancel orders | Are you sure? · OK |
| Ô trống | Muted "Chưa có" / "No …"; ô số thiếu in "—" | No waybill yet | N/A, null |
| Setting row | Tên quyền + 1 câu nói kết quả | Bulk update orders · Change the status of many orders at once | Mẹo: bật để tiết kiệm thời gian |
| Badge trạng thái | Đúng tên trạng thái trong Glossary | Needs confirmation | Pending confirm |

## 7. Glossary
| Tiếng Việt | English | Định nghĩa | Từ tránh |
|---|---|---|---|
| Đơn hàng | Order | Một yêu cầu giao hàng của khách | Đơn, Order item |
| Tạo đơn | Create order | — | Add order, New order |
| Đơn vị vận chuyển | Courier | Hãng nhận và giao hàng | Carrier, ĐVVC |
| Mã vận đơn | Waybill | Mã của đơn vị vận chuyển | Tracking code |
| Chưa có mã vận đơn | No waybill yet | — | N/A |
| Thu hộ | COD | Tiền người nhận trả khi nhận hàng | Cash on delivery (trên bảng) |
| Chế độ xem | View | Bộ lọc + cột + sắp xếp đã lưu | Tab, Filter preset |
| Xoá bộ lọc | Clear filters | — | Reset, Remove all |
| Cần xử lý | Needs attention | Đơn có vấn đề cần người xử lý | Problem orders |
| Cần xác nhận | Needs confirmation | — | Pending confirm |
| Chờ in | Ready to print | — | To print |
| Chờ lấy hàng | Ready for pickup | — | Waiting pickup |
| Đang hoàn | Returning | — | Return in progress |
| Đã huỷ | Canceled | — | Cancelled |
| Phòng ban | Department | — | Team, Group (ngoại lệ: "Team" là tên nhóm điều hướng Settings › Team) |
| Quyền riêng | Extra permissions | Quyền thêm cho 1 thành viên, ngoài quyền phòng ban | Additional rights |

Trạng thái đơn đầy đủ (View tabs, thứ tự sản phẩm) — EN / VI: All / Tất cả · New / Mới · Needs attention / Cần xử lý · Restocking / Chờ nhập hàng · Needs confirmation / Cần xác nhận · Pending / Chờ hàng · Confirmed / Đã xác nhận · Ready to print / Chờ in · Printed / Đã in · Packing / Đang đóng gói · Ready for pickup / Chờ lấy hàng · Shipped / Đã gửi hàng · Delivered / Đã giao · Returning / Đang hoàn · Returned / Đã hoàn · Canceled / Đã huỷ.

## 8. Dễ tiếp cận & bao trùm
- Link nói rõ đích đến, không dùng "bấm vào đây"
- Không chỉ đường bằng vị trí hay màu ("bên phải", "nút xanh")
- Trạng thái luôn có chữ, không chỉ dựa vào màu
- Nút chỉ có icon phải có tooltip và aria-label
- Thông báo lỗi gắn với trường, trình đọc màn hình đọc được
- Ngôn ngữ trung tính giới, không định kiến vùng miền

## 9. Điều cấm
- Chữ chú thích, "Mẹo", "Hiển thị X kết quả" trên UI
- Emoji trong tiêu đề, nút, tab
- Nhãn nút ghép số ("Hoàn tất đóng gói · 2")
- Đánh số thứ tự trên thẻ ("1. Mới")
- Bộ đếm phụ ở tiêu đề section / nhóm ("2 of 7 on")
- Header bảng VIẾT HOA
- Chữ tạm, Lorem ipsum, "Nguyễn Văn A"
- "Oops", đùa cợt trong thông báo lỗi
- Dùng từ đồng nghĩa cho cùng một khái niệm
- Ghi chú thời gian kiểu "Cập nhật 10:04" trên thanh lọc
- "Are you sure?" kèm nút OK / Cancel

Khác: Dữ liệu mẫu phải như thật (có số lẻ, có 0, tên dài) và không dùng dữ liệu khách thật.

## 10. Quy trình & duyệt
- Ai viết: Designer viết ngay khi vẽ, không để chữ tạm
- Review khi: Khi vẽ flow, Trước bàn giao Dev, Khi BA gõ "Publish"
- Công cụ: ux-writing (EN), ux-writing-vi (VI), figma-ux-writing-review
- Dịch: Chốt bản EN trước. Dịch VI theo Glossary, dịch ý không dịch từng chữ. Kiểm tra lại độ dài bản VI trên màn hẹp 1280.
- Cập nhật: Thêm từ mới vào Glossary trước khi dùng trên màn. Mỗi lần sửa rules tăng phiên bản và ghi 1 dòng nhật ký.

### Mức lỗi
| Mức | Định nghĩa | Xử lý |
|---|---|---|
| P0 | Sai nghĩa, sai Glossary, chữ tạm, sai chính tả, câu gây hiểu sai hành động | Sửa trước bàn giao |
| P1 | Lệch voice / tone, vượt giới hạn độ dài, sai viết hoa | Sửa trong vòng phát hành |
| P2 | Gợi ý văn phong | Ghi lại, sửa khi tiện |

Mẫu báo cáo review: bảng `Màn · Thành phần · Chữ hiện tại · Vấn đề · Mức · Đề xuất`, kết luận số P0 / P1 / P2.

## Nhật ký
- 03/11/2026 · v1.0 · Bản đầu · Sơn Hoàng
- 03/11/2026 · v1.1 · Ngoại lệ Glossary: giữ "Team" làm tên nhóm điều hướng Settings › Team · cấm bộ đếm phụ ở tiêu đề section ("2 of 7 on") · Ming Đoàn
- 04/11/2026 · v1.2 · Thị trường theo các nước FFM đang hỗ trợ; tiền tệ theo quốc gia của dữ liệu, ₫ chỉ khi có thị trường Việt Nam · Sơn Hoàng
