# ffm-docs-html

File HTML trao đổi của team FFM, Bigate, POS, CRM. Cloudflare Pages hiển thị mỗi file ở 1 link cố định:

```
https://ffm-docs-html.pages.dev/<product>/<topic>/<file-name>
```

Người xem đăng nhập bằng email công ty (Cloudflare Access) một lần, sau đó mở link như trang web bình thường.

## Cập nhật file

1. Sửa file HTML (tay hoặc nhờ AI), giữ nguyên tên và thư mục.
2. `git add <đúng file vừa sửa>` → `git commit` → `git push`.
3. Khoảng 1 phút sau, link cũ hiện nội dung mới.

Quy chuẩn đầy đủ (thư mục theo sản phẩm, đặt tên, các bước tạo / sửa trang, quy chuẩn thiết kế §9): xem [CLAUDE.md](CLAUDE.md). Trang mới bắt đầu từ mẫu [sample/mau-thiet-ke.html](sample/mau-thiet-ke.html).
