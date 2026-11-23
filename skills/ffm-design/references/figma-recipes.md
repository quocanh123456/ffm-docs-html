# Figma recipes · thao tác chuẩn FFM qua Figma MCP (`use_figma`)

Đoạn code dưới đây chạy trong `use_figma` (Plugin API, top-level `await`, `return` để lấy kết quả). Luôn nạp skill `figma-use` trước khi gọi `use_figma`; vẽ màn thì nạp thêm `figma-generate-design`.

## 0. File & ID cần nhớ
| File | fileKey | Vai trò |
|---|---|---|
| 🗂️ Design System_FFM 🗂️ v2 | `bRzGSf4BNsKuwF5w8ISJvT` | Thư viện DS + trang RULES · DESIGN AGENT |
| Master_Data_FFM | `lG7msjZzLDwBl0dfWsspry` | Designer vẽ · page 🛒 OL v2 – Orders (125:2) · 🔐 Permissions (156:2) · 🧱 Local components (3:302) · 🔎 Scan hiện trạng (0:1) |
| Planning_FFM | `JMmW4flVz7gt1jeYsPVWgP` | BA/PM vẽ |
| Visual_Design_FFM | `ridq2pyg8MUzljRgx7MQ04` | Chỉ instance màn chính · 📑 Design screen list (frame 4:72) · 🕘 Changelog (frame 4:210) |
| Rules-Design (template chung) | `dCn2DoelcHrOYd9mDDuuQs` | Không sửa |
| FnB Master Data (mẫu trình bày flow) | `eNy0eET3ta6zfNlLtn44X4` node 247:65823 | Tham chiếu R08.4 |

Collection key (dùng với `figma.teamLibrary`): xem `tokens/figma-variables.json` → `collections.<tên>.key`. 1. Color = `77f8e1c1d7d40d6ce98a19257774d904b714bc3e` · 2. Spacing = `79f2e7c8c60c3c5763ba42b5f68596db2d1f7493` · 3. Radius = `8fdc592ca1afecd0e7f38eec6782f39bbcf215bf` · 4. Effect = `7a6901d3582800b70476c546e4b82ff7c2d022f8`.

## 1. Lấy biến DS trong file khác (library đã bật)
```js
const COLOR = '77f8e1c1d7d40d6ce98a19257774d904b714bc3e';
const lib = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(COLOR);
const want = ['context/bg/base/canvas', 'context/fg/base/primary', 'context/border/base/default'];
const V = {};
for (const n of want) {
  const m = lib.find((v) => v.name === n);
  if (m) V[n] = await figma.variables.importVariableByKeyAsync(m.key);
}
// bind fill
const paint = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', V['context/bg/base/canvas']);
node.fills = [paint];
// bind số (padding / gap / radius): node.setBoundVariable('paddingLeft', spacingVar)
return Object.keys(V);
```
Nếu `getVariablesInLibraryCollectionAsync` báo lỗi → library DS chưa bật trong file đó: nhắc User bật (Assets › Libraries).

## 2. Import component / style theo key
```js
const btnSet = await figma.importComponentSetByKeyAsync('e01d38c5ad11bd6e4d3f42eca5670b7f4f162339'); // Button
const btn = btnSet.children.find((c) => c.name === 'Variant=Default, Size=sm, State=Default').createInstance();
btn.setProperties({ 'Label#…': 'Create order' }); // đọc tên prop đầy đủ từ btn.componentProperties
const icon = await figma.importComponentByKeyAsync('f145e3cb15cfa2360bd31140d82f631db43b83ac'); // icon/plus
const ts = await figma.importStyleByKeyAsync('0b7c62d14ba29088089afdf2e73ae10e0bc05000'); // Body/sm-regular
await text.setTextStyleIdAsync(ts.id);
```
Key đầy đủ: `tokens/components.json`, `tokens/text-styles.json`, `tokens/effect-styles.json`. Màn chính: OL2_1 `dda72796155defacfa1ec444b2a32325f026ed50` · PR_1 `c828e06f2874056f01281d65e95637cdca496aab` · PR_2 `62651f6fa73f9469a61c7b49a01bb5c6b8582138`.

## 3. Section flow chuẩn R08.4
```js
const sec = figma.createSection();
sec.name = 'DSG_<Tên tính năng> · Web';
sec.fills = [{ type: 'SOLID', color: { r: 0x31 / 255, g: 0x31 / 255, b: 0x31 / 255 } }]; // #313131 – được phép không bind
// Lưới: cột 1440 + gap 480 · hàng 960 + gap 320 · lề 100
const COL = 1440 + 480, ROW = 960 + 320, PAD = 100, HEADER_H = 360;
const at = (c, r) => ({ x: PAD + c * COL, y: HEADER_H + PAD + r * ROW });
```
**Title / Header**: frame x 0, y 0, rộng = Section, lề 60 → thẻ `bg/base/canvas` bo `radius/6xl` (32), padding 40, gap 32: ô icon 108 (viền `border/base/default` 2px, bo `radius/4xl`, icon Phosphor 64) · "Flow <tên luồng>" Heading/4xl · "Menu / Màn · /đường-dẫn" Heading/xl `fg/base/secondary` · phải Body/md-regular secondary: `Web · 1440 × 960 · ENG · DS FFM v2 · DD/MM/YYYY · <người>`.

**Mũi tên** (nét trắng 2px, đầu chấm tròn, cuối tam giác):
```js
async function arrow(x1, y1, x2, y2, white) {
  const v = figma.createVector();
  await v.setVectorNetworkAsync({
    vertices: [{ x: 0, y: 0, strokeCap: 'CIRCLE_FILLED' }, { x: x2 - x1, y: y2 - y1, strokeCap: 'ARROW_EQUILATERAL' }],
    segments: [{ start: 0, end: 1 }], regions: [],
  });
  v.x = x1; v.y = y1; v.strokeWeight = 2;
  v.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', white)]; // fg/base/light-solid
  return v;
}
// Nhánh: 3 đỉnh (xuống rồi sang phải) + v.cornerRadius = 12
```
Từ mép phải màn nguồn → mép trái màn đích, y = top màn + 480.
**Pill**: auto-layout, padding 10/16, bo `radius/full`, chữ Body/md-regular `fg/base/light-solid`; xanh lá `bg/success/default` = thao tác chuyển màn (giữa mũi tên ngang) · xanh dương `bg/brand/default` = tên nhánh (trên trục dọc, cách góc rẽ ~320). Gom nét → group **Flow arrows**, pill → group **Flow labels** (trên cùng).

**User flow (R11)**: Start/End pill #1D1D1D chữ trắng · User action chữ nhật bo nhẹ #E4D6F6 viền #B37FEB · Decision thoi #C0DBF6 viền #4096FF · mũi tên đen mảnh, nhánh ghi "Có"/"Không", ghi mã màn. **NOTE** + `@devs` nền `bg/caution/selected`.

## 4. Bảng R06.7
- `Table viewport` (frame clip, `overflowDirection = 'BOTH'`, `minWidth 640`, `minHeight 300`, FILL chiều cao còn lại) › `Table` (VERTICAL) › Header row (40) · `Body` (FILL, clip – các hàng 52) · Summary row (40, ghim đáy).
- Mỗi cột: `layoutSizingHorizontal = 'FILL'` + `minWidth` (OL2: 140/152/160/172/148/116/132/124); cột chọn 40 và ⋯ 56 FIXED.
- Hàng chẵn: `Striped = true` trên Table cell + Table checkbox cell. Header: Table head `Show icon = false`, `Column divider = true`.
- Scrollbar: instance `Orientation=Vertical` ở vùng Body sát phải, `Horizontal` sát đáy Body; thumb = tỉ lệ 1 trang → co giãn instance = track × tỉ lệ / 0.4 trong khung clip bằng track.
- Pagination bar 60 ghim đáy, hairline trên, lề 20; ẩn ở empty / loading / lỗi.

## 5. Đóng component màn chính (R03.7 / R03.8)
```js
const frame = await figma.getNodeByIdAsync('<id màn>');
const comp = figma.createComponentFromNode(frame); // giữ vị trí trong Section
comp.description = 'Màn chính · <Menu> › <Màn> (/đường-dẫn) · Web 1440 × 960 · ENG · cập nhật DD/MM/YYYY · <người vẽ>. Dùng instance ở Visual_Design_FFM; sửa tại đây rồi publish library.';
return { id: comp.id, key: comp.key };
```
Sau đó **nhắc User bấm Publish library** (Agent không publish được) → chờ "đã publish" → ở Visual_Design_FFM: `importComponentByKeyAsync(key)` → instance trên trang module (lưới 1440, cách 200, tên = mã màn) → dòng Design screen list (SCREEN · MENU #1 · SCREEN NAME · ID NAME · LINK) + 1 dòng Changelog (NGÀY · ID NAME · THAY ĐỔI · ISSUE · NGƯỜI).

## 6. Kiểm tra tự động trước bàn giao
```js
// Fill/stroke SOLID chưa bind token (ngoài instance), bỏ qua nền Section #313131 và màu ký hiệu R11
const ALLOW = new Set(['#313131', '#1D1D1D', '#E4D6F6', '#B37FEB', '#C0DBF6', '#4096FF', '#000000', '#FFFFFF']);
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const sec = await figma.getNodeByIdAsync('<section id>');
const bad = [];
const walk = (n, inInst) => {
  const inst = inInst || n.type === 'INSTANCE';
  if (!inst) for (const prop of ['fills', 'strokes']) {
    const arr = n[prop]; if (!Array.isArray(arr)) continue;
    arr.forEach((p, i) => { if (p.type === 'SOLID' && p.visible !== false && !(p.boundVariables && p.boundVariables.color) && !ALLOW.has(hex(p.color))) bad.push(n.id + ' ' + n.name + ' ' + prop + '[' + i + '] ' + hex(p.color)); });
  }
  if ('children' in n) for (const c of n.children) walk(c, inst);
};
walk(sec, false);
const localInst = sec.findAllWithCriteria({ types: ['INSTANCE'] }).filter((i) => i.mainComponent && !i.mainComponent.remote && !/^(OL2|PR)_/.test(i.mainComponent.name)).length;
const hovers = sec.findAllWithCriteria({ types: ['INSTANCE'] }).filter((i) => /State=Hover/.test(i.name) || (i.variantProperties && i.variantProperties.State === 'Hover')).map((i) => i.id);
return { unbound: bad.slice(0, 50), unboundCount: bad.length, localInstances: localInst, hoverInstances: hovers.length };
```
Hover chỉ được có trong sub-section `State · …`. Quét chữ: gom mọi TEXT `characters` → soát theo `ux-writing.md` (Glossary, sentence case, "Please", "!", emoji, độ dài).

## 7. Gotchas đã gặp ở dự án
- Inter dùng style `"Semi Bold"` (có dấu cách). Geist Mono cho Code/sm, Code/xs.
- Slot icon ẩn trong Button mất override màu → icon trên nút Default/Destructive phải là `fg/base/light-solid`.
- Pagination item Previous/Next đang cứng "Trước / Sau" → bản EN override chữ.
- Component mới chỉ import được ở file khác **sau khi publish library**.
- Mỗi `use_figma` chỉ đổi trang 1 lần; đọc nhiều trang dùng `await page.loadAsync()` thay vì đổi trang.
