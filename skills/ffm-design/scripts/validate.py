#!/usr/bin/env python3
"""Kiểm tra skill ffm-design trước khi push."""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
err = []

# 1. SKILL.md frontmatter
s = open(os.path.join(ROOT, "SKILL.md"), encoding="utf-8").read()
m = re.match(r"^---\nname: ([a-z0-9-]+)\ndescription: (.+?)\n---\n", s, re.S)
if not m:
    err.append("SKILL.md: thiếu frontmatter name/description")
else:
    if len(m.group(2)) > 200:
        err.append("SKILL.md: description > 200 ký tự (claude.ai không nhận)")
    if "<" in m.group(2) or ">" in m.group(2):
        err.append("SKILL.md: description có dấu < >")

# 2. Mọi đường dẫn file được nhắc trong SKILL.md / README phải tồn tại
for doc in ("SKILL.md", "README.md"):
    t = open(os.path.join(ROOT, doc), encoding="utf-8").read()
    for p in set(re.findall(r"`((?:references|tokens|scripts)/[\w./-]+\.(?:md|json|css|py|js))`", t)):
        if not os.path.exists(os.path.join(ROOT, p)):
            err.append(f"{doc}: không thấy {p}")

# 3. JSON hợp lệ + số lượng token
for f in os.listdir(os.path.join(ROOT, "tokens")):
    if f.endswith(".json"):
        try:
            json.load(open(os.path.join(ROOT, "tokens", f), encoding="utf-8"))
        except Exception as e:
            err.append(f"tokens/{f}: JSON lỗi {e}")
fv = json.load(open(os.path.join(ROOT, "tokens", "figma-variables.json"), encoding="utf-8"))
expect = {"🎨 Seed": 214, "📏 Dimension": 25, "📘 Typography": 30, "1. Color": 230, "2. Spacing": 45, "3. Radius": 13, "4. Effect": 59}
for c, n in expect.items():
    got = len(fv["collections"][c]["variables"])
    if got != n:
        err.append(f"{c}: {got} biến (cần {n})")
for c in fv["collections"].values():
    for k, v in c["variables"].items():
        r = v.get("resolved", v["value"])
        if isinstance(r, str) and r.startswith("{"):
            err.append(f"alias chưa resolve: {k}")

# 4. Key component đúng định dạng, không trùng
cj = json.load(open(os.path.join(ROOT, "tokens", "components.json"), encoding="utf-8"))
keys = [x[1] for v in cj["pages"].values() for x in v] + list(cj["icons"]["items"].values())
bad = [k for k in keys if not re.fullmatch(r"[0-9a-f]{40}", k)]
if bad:
    err.append(f"key sai định dạng: {bad[:5]}")
if len(set(keys)) != len(keys):
    err.append("key component bị trùng")

# 5. CSS: mọi var() tham chiếu tới biến có khai báo
css = open(os.path.join(ROOT, "tokens", "tokens.css"), encoding="utf-8").read()
decl = set(re.findall(r"(--ffm-[\w-]+):", css))
used = set(re.findall(r"var\((--ffm-[\w-]+)\)", css))
miss = used - decl
if miss:
    err.append(f"tokens.css: var chưa khai báo {sorted(miss)[:5]}")
sh = open(os.path.join(ROOT, "tokens", "shadcn-theme.css"), encoding="utf-8").read()
miss2 = set(re.findall(r"var\((--ffm-[\w-]+)\)", sh)) - decl
if miss2:
    err.append(f"shadcn-theme.css: var chưa khai báo {sorted(miss2)}")

print(f"variables {sum(expect.values())} · components+icons {len(keys)} · css vars {len(decl)}")
if err:
    print("LỖI:\n- " + "\n- ".join(err)); sys.exit(1)
print("OK – sẵn sàng push")
