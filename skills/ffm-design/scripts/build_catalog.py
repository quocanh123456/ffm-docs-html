#!/usr/bin/env python3
"""Sinh references/component-catalog.md từ tokens/components.json."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, "tokens", "components.json"), encoding="utf-8"))
L = ["# Component catalog · DS FFM v2",
     "",
     "> Sinh tự động từ `tokens/components.json` (`python3 scripts/build_catalog.py`). "
     "Import: `figma.importComponentSetByKeyAsync(key)` cho component có variant, `figma.importComponentByKeyAsync(key)` cho component đơn / icon. "
     "Prop: T = Text · B = Boolean · I = Instance swap.",
     ""]
n = 0
for page, items in d["pages"].items():
    L += [f"## {page}", "", "| Component | Variant | Prop khác | Key |", "|---|---|---|---|"]
    for name, key, var, props in items:
        L.append(f"| {name} | {var.replace('|', ' / ') or '—'} | {props or '—'} | `{key}` |")
        n += 1
    L.append("")
icons = d["icons"]["items"]
L += [f"## Icon ({len(icons)} · Phosphor Regular 16)", "", d["icons"]["note"], "",
      "| Icon | Key |", "|---|---|"]
L += [f"| {k} | `{v}` |" for k, v in icons.items()]
L += ["", "## Paint style", "", d["paintStyles"]["note"], ""]
L += [f"- {k}: `{v}`" for k, v in d["paintStyles"]["items"].items()]
L += ["", "## Màn chính (Master_Data_FFM)", "", "| Màn | Key | Node | Mô tả |", "|---|---|---|---|"]
L += [f"| {a} | `{b}` | {c} | {e} |" for a, b, c, e in d["screens"]["items"]]
open(os.path.join(ROOT, "references", "component-catalog.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
print("components", n, "icons", len(icons))
