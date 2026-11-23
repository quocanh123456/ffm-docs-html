# PR · Phân quyền (/admin/order/permission) · 03/11/2026

> Bản đồng bộ từ Project `claude/ffm-permissions-redesign.md`.
Figma: Master_Data_FFM › page `🔐 Permissions`, Section **`DSG_Phân quyền · Web`** (158:1943). EN · dữ liệu dựng (không dùng tên nhân sự thật).
Câu hỏi của màn (đề xuất, chờ chốt): **"Phòng ban này được làm gì, và ai có thêm quyền riêng?"**

## Scan hiện trạng
- Trái: "Department List" dạng cây (CSR 0 · Phòng kinh doanh 6 → Team kinh doanh 1 0), không có tìm kiếm.
- Phải: tên phòng ban + Cancel / Save (disabled khi chưa đổi) · "Active: 1/23 permissions".
- 23 quyền dạng checkbox, không mô tả: **Order** (11) · **Telesale** (7) · **Order status scope** (Viewable / Editable status: checkbox "any status" + multi-select + cảnh báo vàng) · **CSR** (1) · **Statistic** (2) · **Setting › Order configuration** (1).
- **Members (n)** cuối trang: mỗi người "No extra permissions" + nút "Extra permissions" → drawer: quyền từ phòng ban bị khoá, chỉ thêm quyền riêng; áp dụng theo quốc gia đang chọn (PH/TH/MY/ID/SG).
- Vấn đề: tên quyền trùng giữa nhóm, viết hoa lộn xộn, không giải thích quyền làm gì, thành viên bị đẩy xuống cuối trang, nút lặp mỗi hàng, cảnh báo dạng câu giải thích.

## Thiết kế mới (Style principles · mẫu Settings page)
Settings nav 256 (Team › **Permissions** active — giữ tên nhóm "Team") · cột **Departments** 280 (tìm kiếm, + thêm, cây phòng ban có count) · cột nội dung **720**: Breadcrumb → tiêu đề Heading/2xl → meta "6 members · 9 of 21 permissions on" → Tab Underline **Permissions | Members (6)**.
- Permissions: mỗi nhóm là 1 section — **chỉ tiêu đề nhóm, không bộ đếm "x of y on"** — với **Setting row** (tên + 1 câu mô tả kết quả + Switch). Order status scope = 2 Setting row Select → dropdown checkbox có tìm kiếm.
- Đổi là lưu ngay + Toast "Permission updated · Sales can now bulk update orders. · Undo" (bỏ Cancel/Save).
- Members: bảng (Member · Extra permissions · ⋯), bấm hàng mở **sheet Extra permissions** 520: Country (Select) + các nhóm quyền; quyền từ phòng ban = Switch bật + Disabled + "From Sales".
- **Bảng Members (R06.7):** Member Fill min 392 · Extra permissions Fill min 270 · ⋯ 56 cố định; hàng min 52; Table viewport clip + cuộn 2 chiều, min 480 × 300; Scrollbar dọc + ngang (6 / 6 thành viên → thumb hết track).

## Bố cục Section (R08.4)
Section nền #313131 · Title / Header "Flow Phân quyền phòng ban" → NOTE + **User flow – Phân quyền** (184:1519) → PR_1 → (Bật 1 quyền) PR_5 · trục → PR_2 (Mở tab Members) → (Bấm Paolo Cruz) PR_3 · PR_4 (Mở Editable statuses) · PR_6 (Chọn phòng ban CSR).
**@devs:** lưu ngay + Undo cần API hoàn tác · quyền phòng ban bật + Disabled, chỉ thêm quyền riêng theo Country.

| Frame | Nội dung |
|---|---|
| PR_1 Phân quyền – Quyền của phòng ban (**component 201:10447**, màn chính) | Sales · tab Permissions đủ 6 nhóm (cao 2429) |
| PR_2 Phân quyền – Thành viên (**component 201:10448**, màn chính) | Bảng 6 thành viên, ngựa vằn, Table viewport + Scrollbar |
| PR_3 Phân quyền – Quyền riêng của thành viên | Sheet của Paolo Cruz (2 quyền riêng); bảng Members phía sau theo R06.7 |
| PR_4 Phân quyền – Chọn trạng thái được sửa | Dropdown checkbox 9 trạng thái, 5 đã chọn |
| PR_5 Phân quyền – Đã lưu (Toast) | Bật Bulk update orders → Toast + Undo, meta đếm 10/21 |
| PR_6 Phân quyền – Phòng ban trống | CSR 0 thành viên: empty state "No members yet" + Add members |

**Kiểm tra đã chạy:** 0 fill/stroke chưa bind ngoài instance · 0 instance local · không gradient/emoji/chữ tạm · 0 Hover trên màn tĩnh · 0 chuỗi tiếng Việt sót · rà R16 không có P0.

## Câu hỏi mở cho team
- Thành viên được thêm vào phòng ban ở đâu (FFM hay Pancake Work)? Nút "Add members" đang giả định thêm được ngay tại đây.
- Quyền phòng ban có tách theo quốc gia như Extra permissions không?
- Đổi quyền lưu ngay (Toast + Undo) thay cho Cancel/Save – cần BE hỗ trợ undo.

**Còn chờ:** publish Master_Data_FFM để PR_1 bên Visual_Design_FFM nhận bản bỏ bộ đếm · bản VI · responsive 1920 / 2560.
