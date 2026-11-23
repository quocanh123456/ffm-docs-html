# ffm-design · skill thiết kế FFM

Skill cho Claude để thiết kế **Pancake Fulfillment (FFM)** — fulfillment.pancake.vn — đúng Rules, Design System và UX writing của dự án. Mở một session Claude mới, cài skill này là session đó vẽ / review / viết chữ / lấy token giống hệt session gốc.

**Phiên bản:** v1.2 · 04/11/2026 · Ming Đoàn (Designer) · UX writing, mục viết code FE: Sơn Hoàng
**Nơi lưu:** repo private `pancake-vn/ffm-docs-html`, thư mục `skills/ffm-design`. Hướng dẫn cài cho team: https://ffm-docs-html.pages.dev/ffm/design-system/huong-dan-skill-ffm-design
**Nguồn chuẩn:** Figma `🗂️ Design System_FFM 🗂️` v2 (`bRzGSf4BNsKuwF5w8ISJvT`) — token xuất trực tiếp từ file ngày 03/11/2026 và đã đối chiếu lại (616 biến · 213 component key khớp 100%).

## Bên trong có gì
```
skills/ffm-design/
├── SKILL.md                         ← Claude đọc đầu tiên: quy trình, magic word, luật cứng, chỉ đường tới file khác
├── references/
│   ├── rules-design-agent.md        ← Rules FFM v1.8 (R01 config, R01.1 ai vẽ ở đâu, R03.7/R03.8 Visual Design + "Publish",
│   │                                   R04 quy trình, R06.7 bảng, R08.4 trình bày flow, R11 user flow, R14 checklist, R15 anti-slop)
│   ├── design-system.md             ← DS v2: style principles (Attio), List page, Settings, 19 quy tắc đã chốt, Table v2, nhật ký
│   ├── ux-writing.md                ← R16 · UX writing FFM v1.2 (voice, tone, độ dài, Glossary EN/VI, điều cấm, mức lỗi P0–P2)
│   ├── figma-recipes.md             ← code Plugin API: import token/component theo key, dựng Section #313131, mũi tên, pill, bảng, đóng component, audit
│   ├── component-catalog.md         ← 111 component + 102 icon + 20 paint style + 3 màn chính, kèm key và prop
│   ├── code-fe.md                   ← viết code FE trong repo sea-fulfillment-web theo DS v2 (antd không bắt buộc, token --ffm-*, tự kiểm tra)
│   └── screens/
│       ├── orders-list.md           ← OL2 · Danh sách đơn (13 màn)
│       └── permissions.md           ← PR · Phân quyền (6 màn)
├── tokens/
│   ├── figma-variables.json         ← 616 biến, đúng tên Figma, alias + giá trị resolve + mô tả + collection key
│   ├── tokens.css                   ← CSS variables --ffm-* + class text style
│   ├── shadcn-theme.css             ← map biến shadcn/ui sang token FFM
│   ├── tokens.json                  ← bản phẳng cho Tailwind / JS
│   ├── text-styles.json · effect-styles.json · components.json
└── scripts/
    ├── build_tokens.py              ← sinh lại toàn bộ tokens/ (python3, không cần thư viện ngoài)
    ├── build_catalog.py             ← sinh lại references/component-catalog.md
    ├── export-figma-variables.js    ← chạy trong Figma (use_figma) để xuất lại biến khi DS đổi
    ├── export-figma-components.js   ← chạy trong Figma để xuất lại component + key
    └── validate.py                  ← kiểm tra repo trước khi push
```

## Cài đặt
BA, Designer, dev dùng Claude Code: dán prompt cài đặt ở trang hướng dẫn cho team (link ở đầu file), Claude Code tự làm. Lệnh tương đương:
```bash
# cài 1 lần (máy đã đăng nhập gh; đã có bản clone ffm-docs-html thì dùng bản đó)
gh repo clone pancake-vn/ffm-docs-html ~/.agents/ffm-docs-html
mkdir -p ~/.claude/skills
ln -s ~/.agents/ffm-docs-html/skills/ffm-design ~/.claude/skills/ffm-design

# khi có bản mới
git -C ~/.agents/ffm-docs-html pull
```
Mở session Claude Code mới → nói "Vẽ màn … cho FFM" (hoặc gõ `/ffm-design`), Claude tự nạp skill. Mỗi người chỉ cài 1 bản: không clone thêm skill vào `.claude/skills` của repo khác. Đã có `~/.claude/skills/ffm-design` từ trước (cài theo README cũ) thì xoá thư mục đó trước khi tạo liên kết, nếu không liên kết bị tạo lồng vào bên trong và Claude vẫn nạp bản cũ.

Người chỉ dùng claude.ai: nén thư mục `skills/ffm-design` thành zip có thư mục gốc `ffm-design/` → Customize → Skills → "+" → Create skill → Upload a skill. Có bản mới thì xoá bản cũ rồi tải lại.

### Cần có để vẽ trên Figma
1. **Figma MCP** đăng nhập bằng tài khoản có quyền theo vai: BA xem DS FFM, sửa Planning_FFM và Visual_Design_FFM (bước "Publish" ghi vào file này) · Designer sửa Master_Data_FFM, Visual_Design_FFM, DS FFM, xem Planning_FFM · Dev xem Master_Data_FFM và Visual_Design_FFM. Cần thêm 2 skill Figma `figma-use` và `figma-generate-design`.
2. Trong file đang vẽ, **bật library** `🗂️ Design System_FFM 🗂️` (Assets › Libraries). Không bật thì import token / component theo key sẽ lỗi.
3. (Tuỳ chọn) Mobbin connector để research.

## Cách dùng nhanh
| Gõ | Claude làm |
|---|---|
| `Vẽ <tính năng>` / `Design <tính năng>` | Quy trình R04: hỏi vai trò → chọn file → phạm vi → quét Rules + DS → research → vẽ → tự kiểm tra → cập nhật Visual Design |
| `Publish <tính năng / link Section>` | R03.8: kiểm tra flow → chọn màn chính → đóng component → nhắc bấm Publish library → đồng bộ Visual_Design_FFM |
| `quét Rules` | Đọc trang RULES trên Figma, cập nhật `references/rules-design-agent.md` |
| `Review chữ màn …` | Soát theo `ux-writing.md`, báo P0 / P1 / P2 |
| `Cho mình token màu / CSS` | Lấy từ `tokens/` |

## Dùng token trong code
Repo `sea-fulfillment-web`: làm theo `references/code-fe.md`. Nơi khác:
```html
<link rel="stylesheet" href="tokens/tokens.css" />
<link rel="stylesheet" href="tokens/shadcn-theme.css" />  <!-- nếu dùng shadcn/ui -->
```
```css
.order-row:nth-child(even) { background: var(--ffm-bg-base-surface); }
.cta { background: var(--ffm-bg-brand-default); color: var(--ffm-fg-base-light-solid); border-radius: var(--ffm-radius-xl); }
```
Chỉ dùng biến semantic (`--ffm-fg-*`, `--ffm-bg-*`, `--ffm-border-*`, `--ffm-padding-*`, `--ffm-gap-*`, `--ffm-radius-*`), không dùng seed (`--ffm-neutral-500`) trực tiếp. Chỉ có mode Light.

## Cập nhật khi DS / Rules đổi
1. Figma đổi biến → chạy `scripts/export-figma-variables.js` qua `use_figma` → sửa bảng trong `scripts/build_tokens.py` → `python3 scripts/build_tokens.py`.
2. Component đổi → chạy `scripts/export-figma-components.js` → cập nhật `tokens/components.json` → `python3 scripts/build_catalog.py`.
3. Rules / UX writing đổi → sửa file trong `references/`, tăng phiên bản, ghi 1 dòng `CHANGELOG.md`.
4. `python3 scripts/validate.py` → commit vào repo ffm-docs-html (chỉ `git add` file trong `skills/ffm-design`) → `git pull --rebase` → push → báo trong nhóm để mọi người `git pull`.

## Lưu ý về nơi lưu
Cloudflare Pages đưa mọi file của repo ffm-docs-html lên web, nên các file trong skill cũng mở được qua link `ffm-docs-html.pages.dev` (chỉ email @pancake.vn). Skill có mã file và key component Figma nội bộ: không ghi token, mật khẩu vào skill. Không đổi tên thư mục `skills/ffm-design` (máy mọi người đang liên kết tới đây).
