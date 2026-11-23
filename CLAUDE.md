# Quy tắc repo ffm-docs-html

Repo chứa trang HTML trao đổi của team FFM, POS, CRM. Trang Bigate đặt ở repo riêng `bigate-docs-html` (link `bigate-docs-html.pages.dev`, người xem là từng email được thêm tay), quy định ở `~/Documents/Myworkspace/bigate-docs-html/CLAUDE.md`. Cloudflare Pages tự deploy mỗi lần push nhánh `main`; mỗi file ứng với 1 link cố định mà người khác đã lưu trên Panchat. Người xem phải đăng nhập bằng email `@pancake.vn` (Cloudflare Access); khách ngoài chỉ xem được trang đã chia sẻ và được duyệt (§13).

Khi user yêu cầu "tạo trang HTML cho team", "gửi team file HTML", hoặc đưa 1 link `ffm-docs-html.pages.dev`, làm theo file này.

## 1. Link ↔ file

- Link: `https://ffm-docs-html.pages.dev/<product>/<topic>/<file-name>` ↔ file: `<product>/<topic>/<file-name>.html`.
- Link báo cho user và team viết KHÔNG có đuôi `.html`. Cloudflare Pages trả 308 từ link có đuôi sang link không đuôi, nên cả 2 dạng đều mở được.
- Gặp link trong yêu cầu: bỏ `https://ffm-docs-html.pages.dev/`, thêm `.html` → đường dẫn file trong repo. Chạy `git pull` rồi đọc file. Không đọc nội dung qua link: link yêu cầu đăng nhập, `curl` chỉ nhận 302 sang trang đăng nhập.
- Repo local: `~/Documents/Myworkspace/ffm-docs-html`. Máy chưa có thì `gh repo clone pancake-vn/ffm-docs-html ~/Documents/Myworkspace/ffm-docs-html`.

## 2. Thư mục theo sản phẩm (`<product>`)

| Thư mục | Sản phẩm | Dấu hiệu nhận biết |
|---|---|---|
| `ffm/` | FFM | repo `sea-fulfillment` (phần KHÔNG thuộc module CA), `sea-fulfillment-web`; nội dung về kho, đơn, đối soát, phí của FFM |
| _(repo riêng)_ | Bigate (còn gọi CA) | repo `bigate-web`; trong `sea-fulfillment` là module CA (`lib/app/ca/`, `controllers/ca/`, bảng `ca_*`); task ở Panchat workspace Bigate (w5676) → KHÔNG đặt ở repo này, làm theo `bigate-docs-html/CLAUDE.md` |
| `pos/` | POS | repo `pos-api`, `pos-ssr` |
| `crm/` | CRM Enterprise | repo `sea-crm-be`, `sea-crm-web` |
| `shared/` | Không gắn riêng 1 sản phẩm | chỉ dùng khi user nói rõ |
| `skills/` | Skill AI dùng chung của team (vd `skills/ffm-design`: Design System FFM, người phụ trách Ming Đoàn; hướng dẫn cài ở `ffm/design-system/huong-dan-skill-ffm-design`) | không phải trang nội dung, không đặt trang HTML vào đây; chỉ người phụ trách skill, hoặc người được người phụ trách đồng ý, sửa thư mục của skill đó; không đổi tên thư mục (máy mọi người liên kết `~/.claude/skills/<tên>` tới đây); file trong này cũng mở được qua link nên không ghi token, mật khẩu |
| `sample/` | File mẫu: kiểm tra deploy (`hello.html`), mẫu thiết kế (`mau-thiet-ke.html`, §9) | không đặt nội dung thật |
| `functions/`, `_comments/`, `wrangler.toml` | Chức năng góp ý trên trang (§10) | không phải trang nội dung; không đặt trang vào đây |
| `_share/` | Chia sẻ trang cho khách ngoài (§13) | không phải trang nội dung; không sửa khi chia sẻ thêm trang (chia sẻ = thẻ share trong chính trang, §13) |

Tự xác định thư mục theo thứ tự, gặp dấu hiệu đầu tiên thì dừng:

1. User nói rõ sản phẩm hoặc đường dẫn → dùng đúng như vậy.
2. Nội dung trang (task / issue Panchat, module code, màn hình được nhắc tới) chỉ thuộc 1 sản phẩm → dùng sản phẩm đó. Ví dụ đang mở repo `sea-fulfillment` nhưng trang nói về module CA → trang Bigate, đặt ở repo `bigate-docs-html`.
3. Repo mà session đang làm việc (thư mục gốc workspace) → tra bảng trên.
4. Không xác định được, hoặc các dấu hiệu chỉ ra từ 2 sản phẩm trở lên (ví dụ luồng đơn POS ↔ FFM; repo `sea-fulfillment` mà không rõ phần FFM hay CA) → **hỏi user 1 câu trước khi tạo file**: nêu các thư mục có thể chọn, hệ quả của từng lựa chọn (link sẽ là gì), và đề xuất 1 thư mục kèm lý do. Không tự đoán.

Khi tạo file, báo cho user 1 dòng: thư mục đã chọn + dấu hiệu dùng để chọn (ví dụ "chọn `ffm/` vì task #447 thuộc module phí fulfillment").

## 3. Đặt tên `<topic>` và `<file-name>`

- Thư mục (`<product>`, `<topic>`) đặt bằng tiếng Anh. Chỉ `<file-name>` được viết tiếng Việt không dấu (hoặc tiếng Anh).
- Chữ thường, không dấu, không khoảng trắng, nối bằng `-`.
- `<topic>` = module hoặc tính năng, tiếng Anh, ưu tiên đúng tên module trong code (vd `reconciliation`, `picking`, `fulfillment-fee`, `permission`).
- `<file-name>` ngắn gọn, tối đa khoảng 5 từ. Trang gắn với issue / task Panchat thì đặt số issue ở đầu (vd `447-bao-gia-theo-size`).
- Sau khi đã push: KHÔNG đổi tên, KHÔNG chuyển thư mục, KHÔNG xoá file — link cũ sẽ trả 404. Nội dung không còn dùng thì để lại 1 dòng ghi chú trong file kèm link sang trang mới.
- Cập nhật nội dung thì sửa trên chính file đó, không tạo bản `-v2`, `-moi`.

## 4. Tạo trang mới

1. Xác định thư mục (§2) và tên file (§3).
2. `git pull`, rồi kiểm tra đường dẫn chưa có file. Đã có → hỏi user: sửa file đó, hay chọn tên khác.
3. Viết file theo §6 và §9 (bắt đầu từ `sample/mau-thiet-ke.html`).
4. Kiểm tra hiển thị và thao tác theo §9.6, rồi mở bằng `open <file>` để user xem trước ở máy local; sửa theo yêu cầu.
5. Lần push đầu của trang: hỏi user email `@pancake.vn` của người phụ trách trang (owner) nếu chưa có, ghi thẻ owner vào `<head>` (§6), chạy `bash _share/check-owner.sh`; script báo thiếu owner thì dừng, không push. Người phụ trách nhận email và duyệt khi khách ngoài xin xem trang (§13).
6. Commit đúng file đó (§8). Chỉ push khi user yêu cầu ("push", "gửi team").
7. Sau khi push, chờ khoảng 1 phút rồi báo link đầy đủ (không đuôi `.html`). Không gửi link trước khi push: trang chưa deploy, người mở thấy 404.

## 5. Sửa trang có sẵn

1. Đổi link sang đường dẫn file (§1), `git pull`.
2. Sửa trên đúng file đó, mở `open <file>` cho user xem trước.
3. Commit; push khi user yêu cầu; báo lại đúng link cũ.
4. Người khác vừa sửa cùng file (`git pull --rebase` báo xung đột) → hỏi user giữ phần nào, không tự chọn bản.

## 6. Nội dung file

- 1 file tự chứa đủ: CSS, JS viết trong file. Không nạp thư viện vẽ sơ đồ (Mermaid…), xem §9.3; biểu đồ số liệu (Chart.js) nạp qua CDN khi thật sự cần. Ảnh đặt cùng thư mục, dùng đường dẫn tương đối.
- Có `<html lang="vi">`, `<meta charset="utf-8">`, `<title>` = tiêu đề trang.
- Trang mới bắt buộc có `<meta name="owner" content="<email>@pancake.vn">` trong `<head>`, viết đúng dạng này (chữ thường, `name` trước `content`): email người phụ trách trang, không tự đoán, không dùng email gmail. Đổi người phụ trách thì sửa thẻ này. Trang cũ chưa có thẻ thì thêm khi chia sẻ cho khách ngoài (§13).
- Đầu trang ghi: tiêu đề, ngày cập nhật cuối, link task / issue Panchat nếu có. Mỗi lần sửa thì cập nhật ngày.
- Viết tiếng Việt phổ thông; tên có thật trong code (bảng, field, status, tên màn hình) giữ nguyên tiếng Anh.

## 7. Không ghi dữ liệu nhạy cảm

Không ghi token, mật khẩu, API key, số điện thoại / địa chỉ / tên khách hàng thật, dữ liệu xuất từ DB prod. Cần ví dụ thì dùng dữ liệu mẫu.

## 8. Commit

- Nhiều người và nhiều session AI cùng sửa repo: chỉ `git add <đúng file của mình>`, cấm `git add -A` / `git add .`.
- Commit message tiếng Việt, nêu trang nào và đổi gì (vd `ffm/fulfillment-fee/447-bao-gia-theo-size: thêm bảng phí theo size`).
- `git pull --rebase` trước khi `git push`.

## 9. Quy chuẩn thiết kế

Người đọc (BA, GIP, dev, vận hành) đọc lướt trên trình duyệt. Trang phải gọn, hiện đại, nhìn là hiểu; sơ đồ và màn hình vẽ đẹp như sản phẩm thật, không dùng sơ đồ sinh tự động hay khung ký tự.

### 9.1 Bắt đầu từ file mẫu

- Mọi trang mới chép nguyên khối `<style>` của `sample/mau-thiet-ke.html` (mở link `https://ffm-docs-html.pages.dev/sample/mau-thiet-ke` để xem), rồi lấy các thành phần cần dùng trong `<body>`. Không tự đặt thêm màu, cỡ chữ, bo góc, đổ bóng.
- Cần thành phần mẫu chưa có → thêm vào `sample/mau-thiet-ke.html` trước (cùng commit), rồi mới dùng ở trang. Repo `bigate-docs-html` giữ bản chép riêng của file mẫu này (team Bigate không xem được repo này): sửa khối `<style>` của file mẫu thì chép đúng khối đó sang `~/Documents/Myworkspace/bigate-docs-html/sample/mau-thiet-ke.html` trong cùng lượt; phần ví dụ trong `<body>` bên đó viết bằng thuật ngữ Bigate, không chép nội dung FFM sang.
- Sửa trang cũ chưa theo mẫu: chỉ chuyển sang mẫu khi user yêu cầu hoặc khi sửa lại phần lớn trang.

### 9.2 Bố cục

| Thành phần | Quy định |
|---|---|
| Thanh mục lục | Dính trên đầu (`.top`), mỗi mục 1 link neo `#id` |
| Phần mở đầu | `.hero`: loại trang, tiêu đề, 1–2 câu kết luận, chip issue / task (link), ngày cập nhật, phiên bản code đã đối chiếu |
| Thẻ số liệu | `.kpis`, tối đa 4 thẻ, mỗi thẻ 1 con số + 1 dòng giải thích |
| Roadmap bên trái | Trang có lộ trình phase hoặc danh sách đã xử lý / chưa xử lý (trang tiến độ, plan nhiều phase, kế hoạch theo đợt): BẮT BUỘC có `<aside class="roadmap">` là con đầu tiên của `.wrap`, dính bên trái khi cuộn (lề phải để cho cột thẻ góp ý). Mỗi phase 1 dòng `li.done` / `li.cur` / `li.todo` (tên + 1 dòng trạng thái, link tới mục chi tiết), 2 ô `Đã xử lý` / `Chưa xử lý` có số đếm, dưới đó tối đa 5 việc chưa xử lý. Sửa trạng thái ở thân trang thì sửa cả roadmap. Khổ ≤ 1100px tự chuyển thành dải ngang dính dưới thanh mục lục |
| Mục | `.sec-h`: số thứ tự 2 chữ số + tiêu đề + 1 dòng mô tả; nội dung đặt trong thẻ (`.card`, `.row`, `.dcard`) |
| Khổ trang | Rộng tối đa 1180px (trang có roadmap: 1500px, roadmap chiếm cột trái 260px), nền `--bg`; khổ ≤ 960px tự chuyển về 1 cột |

Thứ tự mục gợi ý: hiện trạng → kiến trúc / luồng → prototype → quyết định → dữ liệu → lộ trình, plan → deploy, hoàn tác, rủi ro. Bỏ mục không cần, không thêm mục rỗng.

### 9.3 Sơ đồ — vẽ bằng HTML / CSS, không dùng Mermaid

Không dùng Mermaid, PlantUML, khung ký tự ASCII hay ảnh chụp sơ đồ: nhìn cũ, chữ nhỏ, không đổi màu theo mẫu được. Chọn thành phần theo loại sơ đồ:

| Muốn thể hiện | Thành phần trong mẫu |
|---|---|
| Kiến trúc, các hệ thống gọi nhau | `.arch`: khối màu theo sản phẩm (`.z-ffm`, `.z-crm`, `.z-pos`, `.z-bigate`, `.z-pid`) + mũi tên `.arrow` có nhãn |
| Luồng nhiều bên (thay sequence diagram) | `.seq`: mỗi bên 1 cột, mỗi bước 1 hàng có số; luồng lỗi dùng `.msg.err` (đỏ) |
| Luồng tuần tự ngắn, thứ tự deploy | `.pipe`: dải bước có số; bước người dùng tự chạy dùng `.s.you` |
| Cây (tổ chức, danh mục, cha–con) | `.node` + `.t-ul` có đường nối |
| Bảng dữ liệu, schema | `.tbl`: cột mới nền tím + nhãn `mới`, bảng mới tiêu đề tím |
| Trạng thái của 1 đối tượng | `.pipe` với mỗi ô là 1 status (giữ đúng tên status trong code), nhánh phụ đặt hàng dưới |
| Lộ trình theo phase | `.phases`, phase hiện tại `.cur` |

Mỗi sơ đồ kèm 1–2 câu `.caption` nói sơ đồ cho thấy điều gì. Sơ đồ quá phức tạp cho các thành phần trên thì vẽ SVG viết tay trong file, dùng đúng biến màu của mẫu.

### 9.4 Prototype màn hình

- Trang nói về thay đổi giao diện (màn mới, đổi cột, thêm nút, đổi luồng thao tác) thì BẮT BUỘC có mục Prototype.
- Vẽ bằng HTML / CSS giống giao diện thật của sản phẩm theo context task / issue: đúng tên màn hình, menu, cột, nút, nhãn, trạng thái như trong code và trong task. Thanh địa chỉ ghi đúng đường dẫn màn hình.
- Phong cách theo sản phẩm:
  - **FFM**: theo Design System FFM v2. Trước khi vẽ, BẮT BUỘC đọc skill `ffm-design` (`skills/ffm-design/SKILL.md`, rồi `references/design-system.md` cho bố cục List page / Settings / bảng, `references/ux-writing.md` cho chữ trên giao diện và Glossary EN / VI). Dùng khung `.proto.ffm2` và các class `f2-*` của mẫu; trong khung chỉ dùng biến `--ffm-*` (tên trùng `skills/ffm-design/tokens/tokens.css`), không viết mã màu. Thiếu thành phần thì thêm vào mẫu theo §9.1, lấy giá trị từ `tokens/tokens.css`.
  - **Ngôn ngữ prototype FFM**: BẮT BUỘC đủ EN và VI, chuyển bằng nút EN / VI trên thanh địa chỉ như prototype mẫu (mọi chữ trên giao diện lấy từ bảng `T` theo khoá `data-t`, không viết chữ thẳng trong HTML). Vẽ EN trước; VI thêm sau khi chốt EN, nhưng phải có trước khi giao dev. Chữ VI theo Glossary của skill, dịch ý, không dịch từng chữ.
  - **Bigate**: khung `.proto.bgt` của mẫu: kiểu antd, menu trái theo màu của bigate-web (`src/styles/globals.css`). Trang FFM cũ đã vẽ bằng `.proto` giữ nguyên, chỉ chuyển sang `.proto.ffm2` khi vẽ lại phần prototype.
  - **CRM**: theo giao diện sea-crm-web.
- Dữ liệu mẫu giống thật (tên người Việt, mã đơn, số tiền theo đúng nước), không lấy dữ liệu prod (§7).
- Thao tác được như người dùng đang dùng: bấm nút, đổi tab, tìm kiếm, bật / tắt công tắc, mở / đóng drawer hoặc modal, nhập form kèm kiểm tra lỗi, thông báo thành công / lỗi, bảng cập nhật theo thao tác. Viết JS thuần trong file: giữ trạng thái trong 1 mảng / object, mỗi thao tác cập nhật rồi vẽ lại.
- Đánh dấu chỗ thay đổi so với hiện tại bằng `.changed` (viền tím nét đứt); dòng mô tả của mục ghi "Bấm thử: …" liệt kê các thao tác làm được.
- Luồng nhiều màn: mỗi màn 1 prototype hoặc 1 prototype có chuyển màn, theo đúng thứ tự người dùng đi.
- Drawer, modal, thông báo nằm trong khung prototype không được đẩy lệch hay che phần còn lại: khung dùng `overflow: clip` (không chỉ `hidden`), phần tử đang ẩn đặt `visibility: hidden`, đặt con trỏ vào ô nhập sau khi hiệu ứng mở xong và kèm `focus({ preventScroll: true })`. Lỗi đã gặp: focus lúc drawer còn ngoài khung làm trình duyệt cuộn ngang, nửa trái màn hình bị che.

### 9.5 Quyết định, plan, cảnh báo

- Quyết định: `.dcard`; phương án đã chọn trong `.choice` (dấu tích xanh), phương án bỏ gạch ngang trong `.alt`; câu hỏi chưa chốt dùng `.choice.open` (tím) kèm đề xuất và người trả lời.
- Plan: `.steps`, mỗi bước 1 tiêu đề + nhãn phụ thuộc (`.dep.par` song song, `.dep` tuần tự, `.dep.you` người dùng tự chạy) + dòng `Verify:`.
- Trạng thái: `.pill` — `p-ok` xong, `p-mid` đang làm / chờ, `p-bad` chưa có / lỗi, `p-info` thông tin, `p-new` mới.
- Cảnh báo, rủi ro, hoàn tác: `.note` (`n-warn`, `n-red`, `n-info`); mỗi mục tối đa 1–2 khối.
- Lệnh, SQL: khối `pre` nền tối; SQL chỉ là truy vấn đọc.

### 9.6 Kiểm tra trước khi commit

1. Chụp toàn trang ở khổ 1360px (chrome-devtools `emulate` không đổi được khổ cửa sổ thật, dùng Chrome chạy nền):
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1360,<chiều cao> --screenshot=/tmp/check.png "file://$PWD/<file>.html"`, rồi cắt ảnh thành từng đoạn ~1400px để xem.
2. Không có chữ bị cắt, tràn ngang, chồng lên nhau; mũi tên và nhãn đúng chỗ. Trang có đủ màu (phần mở đầu nền tím, nhãn `.pill` có màu): mất màu là khối style chép thiếu biến `:root` — dòng ngay sau thẻ style mở phải là `:root {`.
3. Prototype: mở trang, bấm thử từng thao tác đã liệt kê ở "Bấm thử" (hoặc gọi `click()` qua chrome-devtools `evaluate_script`), mọi thao tác ra đúng kết quả, console không có lỗi. Sau khi mở / đóng drawer, modal: `scrollLeft` và `scrollTop` của khung prototype vẫn bằng 0, và chụp ảnh lúc drawer đang mở để xem phần còn lại không bị che (chép file ra `/tmp`, chèn `<script>setTimeout(()=>document.querySelector("[data-act=open]").click(),100)</script>` trước `</body>`, chụp bằng lệnh ở bước 1 kèm `--virtual-time-budget=3000`; ảnh của tab chrome-devtools chạy nền có thể là khung hình cũ).


## 10. Góp ý trên trang

Mọi trang có chức năng góp ý kiểu Google Docs: người xem bôi đen chữ → bấm nút góp ý → góp ý lưu ngay, cả team thấy kèm email người viết, trả lời và đánh dấu "Đã xử lý" được; chỉ người viết sửa / xoá được góp ý của mình. Nút "💬 Góp ý (N)" ở góc phải dưới mở bảng góp ý.

- Không thêm gì vào file trang: `functions/_middleware.js` tự gắn `<script src="/_comments/comments.js">` vào mọi trang HTML khi Cloudflare trả về.
- Góp ý lưu trong D1 (`ffm-docs-comments` cho nhánh `main`, `ffm-docs-comments-preview` cho các nhánh khác), khai báo trong `wrangler.toml`; API `functions/api/comments.js`, bảng ở `_comments/schema.sql`. Người viết lấy từ JWT của Cloudflare Access.
- Góp ý gắn theo đoạn chữ được bôi đen. Sửa trang làm đoạn đó không còn thì góp ý vẫn ở bảng góp ý, ghi "(không còn trên trang)". Khi sửa trang theo góp ý, giữ nguyên đoạn chữ chưa xử lý xong để góp ý vẫn tìm thấy.
- Không đổi tên, chuyển, xoá `functions/`, `_comments/`, `wrangler.toml`. Sửa các file này chỉ khi user yêu cầu sửa chức năng góp ý; thử ở máy bằng `npx wrangler pages dev . --binding LOCAL_DEV_EMAIL=<email>` (wrangler bản mới cần Node 22 trở lên).
- Claude đọc và trả lời góp ý bằng service token Access (khoá ở `~/.config/ffm-docs-comments/service-token.env` trên máy SH, không ghi vào repo): `python3 ~/.claude/scripts/team_comments.py list <link trang>` hoặc `list --open` (góp ý chưa xử lý mọi trang); `reply <id> "Đã sửa: <sửa gì>"`. Câu trả lời hiện tên "sh (via Claude)".
- Chỉ đọc góp ý khi user yêu cầu ("xem góp ý trang X"). Sửa trang theo góp ý → commit / push theo §4–§5 → trả lời "Đã sửa: …" trong góp ý đó. Không đánh dấu "Đã xử lý": người góp ý tự kiểm tra rồi đánh dấu. Góp ý chưa rõ ý thì trả lời bằng câu hỏi, không tự đoán.

## 11. Lịch sử phiên bản

Mọi trang có nút "🕘 Lịch sử (N)" bên trái nút Góp ý: danh sách các lần sửa trang (ngày giờ, tên người sửa theo tên git trong commit, dòng đầu của commit message; không hiện email), bấm 1 dòng thì mở bản cũ ở tab mới tại `/<trang>?v=<sha>`. Bản cũ có dải vàng "Bản cũ ngày … · Xem bản mới nhất" và không có nút góp ý.

- Không thêm gì vào file trang: `functions/_middleware.js` tự gắn `<script src="/_history/history.js">`; danh sách và bản cũ do `functions/api/history.js` lấy từ commit trên GitHub (repo khai ở biến `GITHUB_REPO` trong `wrangler.toml`).
- Dòng đầu của commit message hiện cho người xem: viết đúng §8 (trang nào, đổi gì), không viết câu chỉ người làm hiểu.
- Lịch sử lấy theo đường dẫn file: đổi tên / chuyển file thì mất phần lịch sử trước đó (thêm 1 lý do để không đổi tên, §3). Bấm vào lần sửa đã xoá file thì trang báo "file bị xoá ở lần sửa này". Ảnh trong bản cũ là ảnh hiện tại cùng thư mục (không lấy theo commit): thay ảnh thì đặt tên file ảnh mới, không ghi đè ảnh cũ.
- Đã push thì bản cũ luôn mở lại được, kể cả nội dung sau đó đã xoá khỏi trang. Lỡ push dữ liệu nhạy cảm (§7) → báo anh SH ngay; muốn xoá hẳn phải viết lại lịch sử git của repo.
- Token GitHub: secret `GITHUB_TOKEN` của project Pages `ffm-docs-html` (cả bản thật và `--env preview`), loại fine-grained, chỉ quyền đọc Contents của `ffm-docs-html` và `bigate-docs-html`. Token hết hạn thì bảng lịch sử báo "Không lấy được lịch sử", trang vẫn xem bình thường. Gia hạn: anh SH tạo token mới rồi chạy `npx wrangler pages secret put GITHUB_TOKEN --project-name ffm-docs-html` rồi chạy lại lệnh đó có thêm `--env preview` (làm cho cả 2 project). Token hiện tại tên "Html Team Token" (tài khoản GitHub của anh SH), hết hạn ngày 04/11/2027: trước ngày đó tạo token mới và lưu lại.
- `functions/api/history.js`, `_history/history.js` giống hệt bản ở `bigate-docs-html`; sửa thì sửa cả 2 repo.

## 12. Chế độ sáng / tối

Trang theo file mẫu có nút 🌙/☀️ ở cuối thanh mục lục (trang không có thanh mục lục thì nút nằm cố định ở góc trên bên phải). Người xem chưa bấm nút thì trang đi theo cài đặt sáng / tối của máy; đã bấm thì trình duyệt lưu lựa chọn ở localStorage `docs-theme` cho mọi trang.

- Không thêm gì vào file trang: `functions/_middleware.js` gắn `/_theme/theme.css` và 1 đoạn script đặt `html[data-theme]` vào `<head>` (đặt trước khi vẽ trang để trang không hiện nền sáng rồi mới chuyển tối), gắn `/_theme/theme.js` (nút) vào cuối `<body>`; cả bản cũ `?v=` cũng có.
- Chỉ trang có biến `--slate-bg` (khối style chép từ file mẫu) mới được gắn. Trang tự viết CSS riêng giữ nền sáng, không có nút: CSS riêng có thể trùng tên biến với mẫu, áp theme tối vào chỉ đổi được một phần màu. Muốn trang cũ có chế độ tối thì chuyển trang đó sang file mẫu (§9.1).
- `_theme/theme.css` đổi biến `:root` sang màu tối và có luật tối cho từng màu viết cứng của khối style mẫu (`#fff`, `#f1f3f8`, viền nhạt…). Thêm thành phần mẫu có màu viết cứng thì thêm luật tối tương ứng vào `theme.css` trong cùng commit, rồi chụp kiểm tra ở cả 2 chế độ (§9.6, chạy Chrome với `--blink-settings=preferredColorScheme=0` để có chế độ tối).
- Khung prototype (`.proto`, `.proto.ffm2`) giữ nền sáng như giao diện thật: `theme.css` trả lại biến màu sáng cho phần bên trong khung. Bảng góp ý, bảng lịch sử được đảo màu cả khối.
- Trang thêm màu viết cứng ngoài khối style mẫu (nền trắng tự đặt) sẽ vẫn trắng trong chế độ tối: dùng biến của mẫu (`var(--card)`, `var(--line)`…) thay vì viết mã màu.
- `_theme/` giống hệt bản ở `bigate-docs-html`; sửa thì sửa cả 2 repo. Không đổi tên, chuyển, xoá thư mục này.

## 13. Chia sẻ trang cho khách ngoài

Khách ngoài (email không đuôi `@pancake.vn`) mở đúng link team đang dùng, đăng nhập bằng mã Cloudflare gửi về email, bấm "Xin quyền xem" và ghi lý do. Người phụ trách trang nhận email (server FFM gửi) rồi duyệt ở `/_share/manage`; khách xem được trang đó tới khi bị thu hồi.

- Chia sẻ thêm trang (kể cả trang cũ, link giữ nguyên): trong `<head>` của trang có thẻ owner (§6, thiếu thì hỏi user rồi thêm) và thêm `<meta name="share" content="guest">`, chạy `bash _share/check-owner.sh`, commit, push. Thẻ share viết đúng dạng `<meta name="share" content="guest">`, đứng đầu dòng, trong `<head>`. Thôi chia sẻ: xoá thẻ share (khách đã được duyệt cũng không xem được nữa; dòng duyệt vẫn còn ở `/_share/manage`); thẻ nằm trong comment `<!-- -->` coi như đã xoá. Trang vừa gắn thẻ mà chưa có khách nào xin thì `/_share/manage` chưa liệt kê; mở `/_share/manage?page=<đường dẫn trang>`. Không cần vào Cloudflare. Người phụ trách lấy từ thẻ owner của trang, tiêu đề trong email lấy từ `<title>`; trang thiếu owner thì email gửi `sh@pancake.vn`. Trang không có thẻ share thì khách thấy "Trang này chưa được chia sẻ với bạn".
- Duyệt / từ chối / thu hồi: chỉ người phụ trách trang đó và `sh@pancake.vn`. Thành viên team khác xem được danh sách ở `/_share/manage`.
- Khách đã được duyệt: thấy bản mới nhất của trang, dùng góp ý nhưng chỉ thấy chuỗi góp ý do chính mình mở (kèm câu team trả lời), không đánh dấu "Đã xử lý", không có Lịch sử, không mở được trang khác. Team thấy nhãn "Khách xem được" ở chuỗi của khách: câu trả lời trong chuỗi đó khách đọc được. Trao đổi nội bộ về trang đã chia sẻ thì mở chuỗi góp ý mới, không trả lời trong chuỗi của khách.
- Ảnh: khách đã được duyệt tải được mọi ảnh cùng site mà trang dùng (`src`, `srcset`, `href`, `data-src`, `url(...)` trong CSS; hàm `pageImages` ở `_share/lib.js`), ảnh để ở thư mục nào cũng được. Ảnh nạp bằng JavaScript ghép chuỗi đường dẫn thì không nhận ra được → hiện thành ô hỏng với khách: viết đường dẫn ảnh đầy đủ trong HTML. Ngược lại, mọi chuỗi dạng đường dẫn ảnh trong trang (kể cả chữ ví dụ `url(...)`, link `<a href>` tới ảnh của trang khác) đều cho khách tải ảnh đó: trang chia sẻ không trỏ tới ảnh nội bộ của trang khác.
- Cách chặn: Cloudflare Access chỉ xác nhận email của khách (policy "Khách ngoài" cho mọi email). Policy này CHỈ gắn vào app Access của đúng tên miền `ffm-docs-html.pages.dev`; app của `*.ffm-docs-html.pages.dev` (bản deploy cũ, bản preview từng nhánh) giữ chỉ email `@pancake.vn`, vì bản deploy tạo trước khi có chức năng này chạy middleware cũ, không chặn khách. Việc khách được xem gì nằm ở `functions/_middleware.js` (hàm `guestRequest`), `functions/api/comments.js` (khối `!isTeam(email)`), `functions/api/share.js`, các hàm dùng chung ở `_share/lib.js`, quyền lưu ở bảng `share_grants` của D1 `COMMENTS_DB` (`_share/schema.sql`). Middleware là lớp chặn duy nhất với khách: sửa các file này thì chạy lại bộ kiểm tra ở máy với `--binding LOCAL_DEV_EMAIL=<email khách>` cho trang khác, `/api/*`, `?v=`, góp ý của người khác.
- Email: `functions/api/share.js` gọi `POST /api/docs_share/notify` của sea-fulfillment, khoá ở header `x-docs-share-secret`. Biến `FFM_API_BASE` (wrangler.toml) và secret `DOCS_SHARE_SECRET` của project Pages (cả `--env preview`); phía FFM là `docs_share_secret` trong `config/prod.secret.exs`. Thiếu cấu hình hoặc FFM lỗi thì yêu cầu / quyết định vẫn lưu, chỉ không có email.
- Code chia sẻ dùng chung với `bigate-docs-html` (`_share/`, `functions/api/share.js`, `functions/api/comments.js`, `_comments/comments.js`, phần khách của `functions/_middleware.js`): sửa thì sửa cả 2 repo. Bigate đặt `TEAM_LIST = "d1"`: người xem mọi trang lấy từ bảng `share_team`; đọc bảng lỗi ở lần đầu của 1 isolate thì cả site trả lỗi 500 (không mở quyền cho ai).
- Khách đã được duyệt tải được file mà trang dùng: ảnh, video (`mp4`, `webm`, `mov`), `pdf`, `zip`, `csv`, `xls(x)` (`GUEST_FILE_EXT` ở `_share/lib.js`).
- Mỗi khách đăng nhập chiếm 1 chỗ trong 50 chỗ của gói Cloudflare Zero Trust Free; khách xong việc thì xoá ở Zero Trust → Users. Hết chỗ thì cả thành viên team mới cũng không đăng nhập được: mỗi tháng kiểm tra số người dùng ở Zero Trust → Users, xoá người lạ chưa từng được duyệt.
- `ACCESS_AUD` (wrangler.toml) là danh sách AUD cách nhau dấu phẩy, gồm AUD của mọi app Access phủ site (app tên miền chính và app `*.ffm-docs-html.pages.dev`). Tách / tạo lại app Access thì lấy AUD mới (`curl -sI https://<host>/`, giá trị `kid=` trong `location`) và thêm vào danh sách trước khi gắn app vào host; thiếu AUD thì JWT của team bị từ chối và cả team bị coi là khách.
- Không rollback bản production về bản deploy tạo trước khi có chức năng này (trước commit `ce12059`) khi policy "Khách ngoài" còn gắn vào app: bản cũ không có middleware chặn khách, khách đăng nhập được sẽ xem được mọi trang. Cần rollback thì gỡ policy khách khỏi app trước.
- Pages Functions gói Free giới hạn 100.000 request/ngày. Ở Settings → Functions của project Pages, chế độ khi vượt hạn mức phải là fail closed (trả lỗi), không để fail open (bỏ qua Functions, trả thẳng file tĩnh), vì fail open thì khách xem được mọi trang.
- Tạo bảng `share_grants` (chỉ cần 1 lần cho mỗi database, đã chạy cho cả 2): `npx wrangler d1 execute ffm-docs-comments --remote --file _share/schema.sql` và `npx wrangler d1 execute ffm-docs-comments-preview --env preview --remote --file _share/schema.sql`. Thứ tự lúc triển khai lần đầu: FFM có `POST /api/docs_share/notify` và `docs_share_secret` → bảng D1 + secret Pages → push middleware → tách app Access của `*.ffm-docs-html.pages.dev` khỏi app tên miền chính, thêm AUD mới vào `ACCESS_AUD`, push → mới gắn policy khách vào app tên miền chính. Gắn policy khi 2 host còn chung 1 app thì khách mở được bản deploy cũ `<mã>.ffm-docs-html.pages.dev` (không có middleware) và xem được mọi trang.
