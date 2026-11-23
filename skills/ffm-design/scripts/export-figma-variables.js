// Chạy trong file Figma "🗂️ Design System_FFM 🗂️" (bRzGSf4BNsKuwF5w8ISJvT)
// qua Figma MCP `use_figma` (dán nguyên đoạn này vào tham số code) hoặc plugin console.
// Trả về toàn bộ variables (alias + resolved), text / effect / paint style và collection key.
// Dùng để cập nhật scripts/build_tokens.py khi DS đổi, rồi chạy lại build.
// Danh sách component + key: xem scripts/export-figma-components.js.

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byId = {}; for (const v of all) byId[v.id] = v;
const colById = {}; for (const c of cols) colById[c.id] = c;
const hex = (c) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  let s = '#' + h(c.r) + h(c.g) + h(c.b);
  if (c.a !== undefined && c.a < 1) s += h(c.a);
  return s.toUpperCase();
};
function resolve(v, d = 0) {
  if (d > 10) return null;
  const c = colById[v.variableCollectionId];
  const val = v.valuesByMode[c.modes[0].modeId];
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    const t = byId[val.id]; return t ? resolve(t, d + 1) : 'EXTERNAL';
  }
  if (val && typeof val === 'object' && 'r' in val) return hex(val);
  return val;
}
const out = {};
for (const c of cols) {
  out[c.name] = { key: c.key, modes: c.modes.map((m) => m.name), vars: {} };
  for (const id of c.variableIds) {
    const v = byId[id]; if (!v) continue;
    const val = v.valuesByMode[c.modes[0].modeId];
    let raw;
    if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') raw = '{' + (byId[val.id] ? byId[val.id].name : '?') + '}';
    else if (val && typeof val === 'object' && 'r' in val) raw = hex(val);
    else raw = val;
    out[c.name].vars[v.name] = { type: v.resolvedType, value: raw, resolved: resolve(v), key: v.key, description: v.description || undefined };
  }
}
const ts = await figma.getLocalTextStylesAsync();
const es = await figma.getLocalEffectStylesAsync();
const ps = await figma.getLocalPaintStylesAsync();
return {
  collections: out,
  textStyles: ts.map((s) => ({ name: s.name, key: s.key, font: s.fontName, size: s.fontSize, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing })),
  effectStyles: es.map((s) => ({ name: s.name, key: s.key, effects: s.effects })),
  paintStyles: ps.map((s) => ({ name: s.name, key: s.key })),
};
