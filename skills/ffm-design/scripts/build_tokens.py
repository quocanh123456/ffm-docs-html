#!/usr/bin/env python3
"""
Build FFM design tokens from the source data below.

Source of truth = Figma file "🗂️ Design System_FFM 🗂️" (bRzGSf4BNsKuwF5w8ISJvT).
Data below was exported from Figma on 2026-11-03 (7 collections, 616 variables).
When the Figma variables change: re-run scripts/export-figma-variables.js in Figma
(use_figma / plugin console), compare, update the tables here, then run:

    python3 scripts/build_tokens.py

Outputs (in tokens/):
  figma-variables.json  – every variable, Figma names, alias + resolved value + description
  tokens.json           – flat semantic tokens for code (kebab names, resolved values)
  tokens.css            – CSS custom properties (seed + semantic + spacing/radius/shadow + type)
  shadcn-theme.css      – shadcn/ui variable mapping onto FFM tokens
  text-styles.json, effect-styles.json
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tokens")
os.makedirs(OUT, exist_ok=True)

COLLECTION_KEYS = {
    "🎨 Seed": "6230f62b93ba4b7112b6c9884ded2b7d8604feed",
    "📏 Dimension": "fd36238c954d678088776aeba7e913448d8e6119",
    "📘 Typography": "091e5cae619554ec57a5ee611400c9906cb211bb",
    "1. Color": "77f8e1c1d7d40d6ce98a19257774d904b714bc3e",
    "2. Spacing": "79f2e7c8c60c3c5763ba42b5f68596db2d1f7493",
    "3. Radius": "8fdc592ca1afecd0e7f38eec6782f39bbcf215bf",
    "4. Effect": "7a6901d3582800b70476c546e4b82ff7c2d022f8",
}
MODES = {"🎨 Seed": "FFM", "📏 Dimension": "Value", "📘 Typography": "Value", "1. Color": "Light",
         "2. Spacing": "Value", "3. Radius": "Value", "4. Effect": "Value"}

# ---------------------------------------------------------------- Seed (primitive, hidden)
STEPS10 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
NEUTRAL = {0: "FFFFFF", 50: "FAFAF9", 100: "F5F5F4", 150: "EEEDEB", 200: "E7E5E4", 300: "D6D3D1",
           400: "A8A29E", 500: "78716C", 600: "57534E", 700: "44403C", 800: "292524", 900: "1C1917",
           950: "0C0A09", 1000: "000000"}
PALETTES = [  # (emoji, name, 50..900)
    ("🔷", "blue-brand", "EFF8FF D1E9FF B2DDFF 84CAFF 53B1FD 2E90FA 1570EF 175CD3 1849A9 194185"),
    ("🟢", "green", "F0FDF4 DCFCE7 BBF7D0 86EFAC 4ADE80 22C55E 16A34A 15803D 166534 14532D"),
    ("🔴", "red", "FEF2F2 FEE2E2 FECACA FCA5A5 F87171 EF4444 DC2626 B91C1C 991B1B 7F1D1D"),
    ("🟠", "orange", "FFF7ED FFEDD5 FED7AA FDBA74 FB923C F97316 EA580C C2410C 9A3412 7C2D12"),
    ("🟡", "yellow", "FFFBEB FEF3C7 FDE68A FCD34D FBBF24 F59E0B D97706 B45309 92400E 78350F"),
    ("🔵", "blue", "EFF6FF DBEAFE BFDBFE 93C5FD 60A5FA 3B82F6 2563EB 1D4ED8 1E40AF 1E3A8A"),
    ("🩵", "cyan", "ECFEFF CFFAFE A5F3FC 67E8F9 22D3EE 06B6D4 0891B2 0E7490 155E75 164E63"),
    ("🟣", "purple", "F5F3FF EDE9FE DDD6FE C4B5FD A78BFA 8B5CF6 7C3AED 6D28D9 5B21B6 4C1D95"),
    ("🩷", "pink", "FDF2F8 FCE7F3 FBCFE8 F9A8D4 F472B6 EC4899 DB2777 BE185D 9D174D 831843"),
]
NEUTRAL_ALPHA = {0: "00", 50: "08", 100: "0F", 150: "14", 200: "1A", 300: "29", 400: "4D", 500: "73",
                 600: "99", 700: "B2", 800: "CC", 900: "E0", 950: "F0", 1000: ""}  # base #0C0A09
COLOR_ALPHA = dict(zip(STEPS10, "0D 1A 29 3D 57 75 99 B8 D6 EB".split()))  # base = step 600
WHITE_ALPHA = {50: "0D", 100: "1A", 150: "24", 200: "2E", 300: "42", 400: "66"}

seed = {}
for k, v in NEUTRAL.items():
    seed[f"color/⚪️ neutral/{k}"] = "#" + v
pal_hex = {}
for emo, name, s in PALETTES:
    vals = s.split()
    pal_hex[name] = dict(zip(STEPS10, vals))
    for st, v in zip(STEPS10, vals):
        seed[f"color/{emo} {name}/{st}"] = "#" + v
for k, a in NEUTRAL_ALPHA.items():
    seed[f"color/⚪️ neutral-alpha/{k}"] = "#0C0A09" + a
for emo, name, _ in PALETTES:
    for st in STEPS10:
        seed[f"color/{emo} {name}-alpha/{st}"] = "#" + pal_hex[name][600] + COLOR_ALPHA[st]
for k, a in WHITE_ALPHA.items():
    seed[f"color/⚪️ white-alpha/{k}"] = "#FFFFFF" + a

EMO = {name: emo for emo, name, _ in PALETTES}
EMO["neutral"] = "⚪️"


def S(pal, step, alpha=False):
    """seed variable name"""
    if pal == "white":
        return f"color/⚪️ white-alpha/{step}"
    return f"color/{EMO[pal]} {pal}{'-alpha' if alpha else ''}/{step}"


# ---------------------------------------------------------------- Dimension / Typography
DIMS = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96]
dimension = {f"dm-{d}": d for d in DIMS}
dimension["dm-full"] = 9999
dimension["dm-52"] = 52

typography = {
    "📘 Font family/heading": "Inter", "📘 Font family/body": "Inter",
    "🏋🏻 Font weight/regular": "Regular", "🏋🏻 Font weight/medium": "Medium",
    "🏋🏻 Font weight/semi bold": "Semi Bold", "🏋🏻 Font weight/bold": "Bold",
}
TYPE_SCALE = [("xs", 12, 16, 0), ("sm", 14, 20, 0), ("md", 16, 24, 0), ("lg", 18, 28, -0.2),
              ("xl", 20, 28, -0.3), ("2xl", 24, 32, -0.5), ("3xl", 30, 36, -0.6), ("4xl", 36, 40, -0.8)]
for n, fs, lh, ls in TYPE_SCALE:
    typography[f"✍️ Font size/{n}"] = fs
    typography[f"↕️ Line height/{n}"] = lh
    typography[f"↔️ Letter spacing/{n}"] = ls

# ---------------------------------------------------------------- 1. Color (semantic)
color = {}  # name -> (alias seed name, description)


def C(name, alias, desc=""):
    color[name] = (alias, desc)


C("context/fg/base/header", S("neutral", 950), "Tiêu đề trang, số liệu lớn")
C("context/fg/base/primary", S("neutral", 950), "Chữ chính (foreground)")
C("context/fg/base/secondary", S("neutral", 500), "Chữ phụ, mô tả (muted-foreground)")
C("context/fg/base/placeholder", S("neutral", 400), "Placeholder ô nhập")
C("context/fg/base/hint", S("neutral", 400), "Gợi ý, meta mờ")
C("context/fg/base/disable", S("neutral", 300), "Chữ/icon vô hiệu")
C("context/fg/base/icon", S("neutral", 600), "Icon mặc định")
C("context/fg/base/light-solid", S("neutral", 0), "Chữ/icon trên nền đậm")
C("context/bg/base/canvas", S("neutral", 0), "Nền trang (background)")
C("context/bg/base/surface", S("neutral", 50), "Nền phụ: sidebar, vùng phân khu")
C("context/bg/base/surface-strong", S("neutral", 100), "Nền muted: header bảng, tabs list, block phân cấp")
C("context/bg/base/hover", S("neutral", 150), "Hover item/hàng trên nền canvas hoặc surface (≥1 bậc đậm hơn nền)")
C("context/bg/base/hover-strong", S("neutral", 200), "Hover trên nền surface-strong / pressed")
C("context/bg/base/focus", S("neutral", 300), "Pressed / đang nhấn")
C("context/bg/base/ring", S("blue-brand", 300), "Màu vòng focus")
C("context/bg/base/selected", S("neutral", 200), "Item đang chọn (trung tính) – ≥2 bậc đậm hơn nền")
C("context/bg/base/disabled", S("neutral", 50), "Nền control vô hiệu")
C("context/bg/base/inverse", S("neutral", 900), "Tooltip, toast tối")
C("context/bg/base/card", S("neutral", 0), "Card, popover, dialog")
C("context/bg-overlay/base/surface-on-trans", S("neutral", 0, True))
C("context/bg-overlay/base/surface-on-filled", S("neutral", 50, True))
C("context/bg-overlay/base/hover-on-trans", S("neutral", 200, True), "Hover ghost trên nền trong suốt (10%)")
C("context/bg-overlay/base/hover-on-filled", S("neutral", 300, True), "Hover trên nền màu (16%)")
C("context/bg-overlay/base/focus", S("neutral", 300, True))
C("context/bg-overlay/base/selected", S("neutral", 300, True), "Chọn trên nền bất kỳ (16%)")
C("context/bg-overlay/base/disabled", S("neutral", 50, True))
C("context/bg-overlay/base/scrim", S("neutral", 500, True), "Lớp phủ sau Dialog/Sheet")
C("context/border/base/default", S("neutral", 200), "Viền card, input, bảng (border)")
C("context/border/base/hover", S("neutral", 300), "Viền khi hover")
C("context/border/base/focus", S("blue-brand", 500), "Viền khi focus (ring)")
C("context/border/base/invalid", S("red", 500), "Viền lỗi")
C("context/border/base/selected", S("blue-brand", 600), "Viền item đang chọn")
C("context/border/base/disabled", S("neutral", 150), "Viền vô hiệu")

INTENTS = [
    ("brand", "blue-brand", "Thương hiệu – hành động chính, đang chọn"),
    ("success", "green", "Thành công / hoàn tất"),
    ("warning", "orange", "Cảnh báo / đang hoàn / sắp quá SLA"),
    ("error", "red", "Lỗi / nguy hiểm / cần chú ý"),
    ("info", "blue", "Thông tin / cần xác nhận"),
    ("caution", "yellow", "Lưu ý nhẹ / chờ hàng"),
    ("status-0", "cyan", "Trạng thái: mới, đang vận chuyển"),
    ("status-1", "pink", "Trạng thái: khâu in vận đơn"),
    ("status-2", "purple", "Trạng thái: kho xử lý (nhập, đóng gói)"),
]
for it, pal, desc in INTENTS:
    C(f"context/fg/{it}/primary", S(pal, 700), desc)
    C(f"context/fg/{it}/hover", S(pal, 800))
    C(f"context/fg/{it}/focus", S(pal, 900))
    C(f"context/fg/{it}/selected", S(pal, 700))
    C(f"context/fg/{it}/disabled", S(pal, 300))
    C(f"context/bg/{it}/default", S(pal, 600), desc)
    C(f"context/bg/{it}/hover", S(pal, 700))
    C(f"context/bg/{it}/focus", S(pal, 800))
    C(f"context/bg/{it}/selected", S(pal, 100))
    C(f"context/bg/{it}/disabled", S(pal, 300))
    C(f"context/bg-overlay/{it}/default", S(pal, 100, True), "Nền nhạt (badge soft, alert, hàng bảng) – " + desc)
    C(f"context/bg-overlay/{it}/hover", S(pal, 200, True))
    C(f"context/bg-overlay/{it}/focus", S(pal, 300, True))
    C(f"context/bg-overlay/{it}/selected", S(pal, 200, True))
    C(f"context/bg-overlay/{it}/disabled", S(pal, 50, True))
    C(f"context/border/{it}/default", S(pal, 500), desc)
    C(f"context/border/{it}/hover", S(pal, 600))
    C(f"context/border/{it}/focus", S(pal, 700))
    C(f"context/border/{it}/selected", S(pal, 700))
    C(f"context/border/{it}/disabled", S(pal, 200))
    C(f"context/border/{it}/subtle", S(pal, 300, True), "Viền nhạt cho alert/badge outline")

C("context/bg/inverse/default", S("neutral", 900), "Nền tối: bulk action bar, tooltip")
C("context/bg/inverse/raised", S("neutral", 800), "Nền tối nổi hơn (menu mở từ bulk bar)")
C("context/bg-overlay/inverse/hover", S("white", 100), "Hover trên nền tối (trắng 10%)")
C("context/bg-overlay/inverse/focus", S("white", 200), "Pressed / đang mở trên nền tối (trắng 18%)")
C("context/border/inverse/default", S("neutral", 700), "Viền / vạch ngăn trên nền tối")
C("context/fg/inverse/primary", S("neutral", 50), "Chữ & icon trên nền tối")
C("context/fg/inverse/secondary", S("neutral", 400), "Chữ phụ trên nền tối")
C("context/fg/inverse/danger", S("red", 400), "Hành động nguy hiểm trên nền tối")

# ---------------------------------------------------------------- 2. Spacing / 3. Radius
spacing = {}
for n, d in [("none", 0), ("6xs", 1), ("5xs", 2), ("4xs", 4), ("3xs", 6), ("2xs", 8), ("xs", 10), ("sm", 12),
             ("md", 16), ("lg", 20), ("xl", 24), ("2xl", 32), ("3xl", 40), ("4xl", 48), ("5xl", 64), ("6xl", 80)]:
    spacing[f"padding/{n}"] = (f"dm-{d}", "")
for n, d in [("none", 0), ("3xs", 2), ("2xs", 4), ("xs", 6), ("sm", 8), ("md", 12), ("lg", 16), ("xl", 20),
             ("2xl", 24), ("3xl", 32), ("4xl", 40), ("5xl", 48), ("6xl", 64)]:
    spacing[f"gap/{n}"] = (f"dm-{d}", "")
for n, d, desc in [("icon-xxs", 12, ""), ("icon-xs", 14, ""), ("icon-sm", 16, ""), ("icon-md", 20, ""),
                   ("icon-lg", 24, ""), ("avatar-xs", 24, ""), ("avatar-sm", 32, ""), ("avatar-md", 40, ""),
                   ("avatar-xl", 56, ""), ("control-sm", 32, ""), ("control-md", 36, ""), ("control-lg", 40, ""),
                   ("table-row", 52, "Chiều cao hàng bảng 52 (đủ cho ô 2 dòng)."), ("header", 56, ""),
                   ("sidebar-collapsed", 48, ""), ("table-head", 40, "Chiều cao header bảng 40.")]:
    spacing[f"size/{n}"] = (f"dm-{d}", desc)
radius = {}
for n, d in [("none", "0"), ("2xs", "2"), ("xs", "4"), ("sm", "6"), ("md", "8"), ("lg", "10"), ("xl", "12"),
             ("2xl", "16"), ("3xl", "20"), ("4xl", "24"), ("5xl", "28"), ("6xl", "32"), ("full", "full")]:
    radius[f"radius/{n}"] = (f"dm-{d}", "")

# ---------------------------------------------------------------- 4. Effect
SHADOWS = {  # name: [(x, y, blur, spread, alpha), ...]   colour = black
    "2xs": [(0, 1, 0, 0, 0.05)], "xs": [(0, 1, 2, 0, 0.05)],
    "sm": [(0, 1, 3, 0, 0.10), (0, 1, 2, -1, 0.10)],
    "md": [(0, 4, 6, -1, 0.10), (0, 2, 4, -2, 0.10)],
    "lg": [(0, 10, 15, -3, 0.10), (0, 4, 6, -4, 0.10)],
    "xl": [(0, 20, 25, -5, 0.10), (0, 8, 10, -6, 0.10)],
    "2xl": [(0, 25, 50, -12, 0.25)],
}
A2HEX = {0.05: "0D", 0.10: "1A", 0.25: "40"}
effect = {}
for n, layers in SHADOWS.items():
    for i, (x, y, b, sp, a) in enumerate(layers):
        p = f"{n}/" if len(layers) == 1 else f"{n}/shadow-{i + 1}/"
        effect[p + "color"] = ("#000000" + A2HEX[a], "")
        effect[p + "x"] = (x, ""); effect[p + "y"] = (y, ""); effect[p + "blur"] = (b, ""); effect[p + "spread"] = (sp, "")
effect["ring/brand/color"] = ("{" + S("blue-brand", 500, True) + "}", "")
effect["ring/brand/spread"] = (3, "")
effect["ring/error/color"] = ("{" + S("red", 300, True) + "}", "")
effect["ring/error/spread"] = (3, "")

TEXT_STYLES = [  # name, key, weight, size token
    ("Heading/4xl", "c16dea344cdb64a460e1e29996ee2e76a9323933", "Bold", "4xl"),
    ("Heading/3xl", "74abde42b6da146ce352aea3471f4934207b447a", "Semi Bold", "3xl"),
    ("Heading/2xl", "c66d9a0468f57c229150fa96ee57a4aa335b0509", "Semi Bold", "2xl"),
    ("Heading/xl", "6065539e2a043062e59347676209edddaaa8d8be", "Semi Bold", "xl"),
    ("Heading/lg", "ff234dd0773c587ba665c439d7a2f306bbbd16b5", "Semi Bold", "lg"),
    ("Body/md-regular", "062220115fbde23009c0a8d2a729b81382db51e5", "Regular", "md"),
    ("Body/md-medium", "0e402e2e06eccf0a93ac0d87b132897c245821b9", "Medium", "md"),
    ("Body/md-semibold", "d89e17312466e39397b0fd341398355bc6085c41", "Semi Bold", "md"),
    ("Body/sm-regular", "0b7c62d14ba29088089afdf2e73ae10e0bc05000", "Regular", "sm"),
    ("Body/sm-medium", "baa92b5f3e9cadc292c895b7c7b8d21dfb309f87", "Medium", "sm"),
    ("Body/sm-semibold", "4f2d76b531a445b59e421c24e72d75da3b2873d5", "Semi Bold", "sm"),
    ("Caption/xs-regular", "3c188c5db98a25cadf2e76af3ceab257e86386f3", "Regular", "xs"),
    ("Caption/xs-medium", "46c51890f3bcfb9174ef9be74f3fb691c339f14f", "Medium", "xs"),
    ("Caption/xs-semibold", "ba50984a33fe60c7f91b766611215c0b726c2445", "Semi Bold", "xs"),
]
CODE_STYLES = [("Code/sm", "c7b8f9a97ec1fb2f31d11698c7dac37dac7f5bd7", 13, 20),
               ("Code/xs", "05d0323e44b1ea044ccba8ed01a0d9b82619b0dc", 12, 16)]
EFFECT_STYLE_KEYS = {
    "Shadow/2xs": "f5ff222534fba4d3847c88e1ab2823017ee23613", "Shadow/xs": "4d1b5bc11a93b21446662408ba6bc517fc9b3c14",
    "Shadow/sm": "9648646ade942c9d307fd369e1fe85cf88eeb14d", "Shadow/md": "82e783f0b0327e5b1ec59d2c80260ed471463e54",
    "Shadow/lg": "263e9ebf7ca42a5871076b8ee4484d8f1a466ba0", "Shadow/xl": "3b0756bea550b8c379e4dcad2231614a2d56cf2f",
    "Shadow/2xl": "b364ba4f114032e36d0ebbfe00d97f2e921b8914", "Ring/brand": "3b085765e9dac4654770aa59dae7ffaafecb0473",
    "Ring/error": "d709da5537dfb4207b15d64c1e21bd97dab8230f",
}
WEIGHT_NUM = {"Regular": 400, "Medium": 500, "Semi Bold": 600, "Bold": 700}

# ================================================================= build
ALL = {"🎨 Seed": {k: (v, "") for k, v in seed.items()},
       "📏 Dimension": {k: (v, "") for k, v in dimension.items()},
       "📘 Typography": {k: (v, "") for k, v in typography.items()},
       "1. Color": {k: ("{" + a + "}", d) for k, (a, d) in color.items()},
       "2. Spacing": {k: ("{" + a + "}", d) for k, (a, d) in spacing.items()},
       "3. Radius": {k: ("{" + a + "}", d) for k, (a, d) in radius.items()},
       "4. Effect": effect}
lookup = {}
for col in ALL.values():
    for k, (v, _) in col.items():
        lookup[k] = v


def resolve(v, depth=0):
    if isinstance(v, str) and v.startswith("{") and depth < 10:
        return resolve(lookup[v[1:-1]], depth + 1)
    return v


def vtype(v):
    r = resolve(v)
    if isinstance(r, str) and r.startswith("#"):
        return "COLOR"
    if isinstance(r, (int, float)):
        return "FLOAT"
    return "STRING"


figma_json = {"meta": {
    "source": "Figma · 🗂️ Design System_FFM 🗂️ v2 · fileKey bRzGSf4BNsKuwF5w8ISJvT",
    "exported": "2026-11-03", "note": "value = raw value or {alias}; resolved = final value. Colors #RRGGBB[AA]."},
    "collections": {}}
for cname, vars_ in ALL.items():
    out = {}
    for k, (v, d) in vars_.items():
        e = {"type": vtype(v), "value": v}
        if isinstance(v, str) and v.startswith("{"):
            e["resolved"] = resolve(v)
        if d:
            e["description"] = d
        out[k] = e
    figma_json["collections"][cname] = {"key": COLLECTION_KEYS[cname], "mode": MODES[cname],
                                        "hiddenPrimitive": cname in ("🎨 Seed", "📏 Dimension"),
                                        "count": len(out), "variables": out}
with open(os.path.join(OUT, "figma-variables.json"), "w", encoding="utf-8") as f:
    json.dump(figma_json, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------- code-friendly names
def seed_css(name):  # color/⚪️ neutral-alpha/50 -> neutral-alpha-50
    parts = name.split("/")
    pal = re.sub(r"^[^a-z]+", "", parts[1]).strip()
    return f"{pal}-{parts[2]}"


def sem_css(name):  # context/fg/base/primary -> fg-base-primary
    return name.replace("context/", "").replace("/", "-")


def css_val_alias(v):
    if isinstance(v, str) and v.startswith("{"):
        n = v[1:-1]
        if n.startswith("color/"):
            return f"var(--ffm-{seed_css(n)})"
        if n.startswith("dm-"):
            return "9999px" if n == "dm-full" else f"{lookup[n]}px"
    return v


flat = {"color": {}, "spacing": {}, "radius": {}, "shadow": {}, "font": {}, "text-style": {}}
for k, (a, d) in color.items():
    flat["color"][sem_css(k)] = resolve("{" + a + "}")
for k, (a, d) in spacing.items():
    flat["spacing"][k.replace("/", "-")] = resolve("{" + a + "}")
for k, (a, d) in radius.items():
    flat["radius"][k.split("/")[1]] = resolve("{" + a + "}")
for n, layers in SHADOWS.items():
    flat["shadow"][n] = ", ".join(f"{x}px {y}px {b}px {sp}px rgba(0,0,0,{a})" for x, y, b, sp, a in layers)
flat["shadow"]["ring-brand"] = "0 0 0 3px " + resolve("{" + S("blue-brand", 500, True) + "}")
flat["shadow"]["ring-error"] = "0 0 0 3px " + resolve("{" + S("red", 300, True) + "}")
flat["font"] = {"family-heading": "Inter", "family-body": "Inter", "family-code": "Geist Mono",
                "icon-set": "Phosphor Regular"}
sizes = {n: (fs, lh, ls) for n, fs, lh, ls in TYPE_SCALE}
text_styles = []
for name, key, w, sz in TEXT_STYLES:
    fs, lh, ls = sizes[sz]
    text_styles.append({"name": name, "key": key, "fontFamily": "Inter", "fontStyle": w,
                        "fontWeight": WEIGHT_NUM[w], "fontSize": fs, "lineHeight": lh, "letterSpacing": ls,
                        "boundTo": f"📘 Typography: Font size/{sz}, Line height/{sz}, Letter spacing/{sz}"})
    flat["text-style"][name.lower().replace("/", "-")] = {"size": fs, "line": lh, "weight": WEIGHT_NUM[w], "tracking": ls}
for name, key, fs, lh in CODE_STYLES:
    text_styles.append({"name": name, "key": key, "fontFamily": "Geist Mono", "fontStyle": "Regular",
                        "fontWeight": 400, "fontSize": fs, "lineHeight": lh, "letterSpacing": 0})
    flat["text-style"][name.lower().replace("/", "-")] = {"size": fs, "line": lh, "weight": 400, "tracking": 0, "family": "Geist Mono"}
with open(os.path.join(OUT, "tokens.json"), "w", encoding="utf-8") as f:
    json.dump(flat, f, ensure_ascii=False, indent=2)
with open(os.path.join(OUT, "text-styles.json"), "w", encoding="utf-8") as f:
    json.dump(text_styles, f, ensure_ascii=False, indent=2)
effect_styles = [{"name": f"Shadow/{n}", "key": EFFECT_STYLE_KEYS[f"Shadow/{n}"], "type": "DROP_SHADOW",
                  "layers": [{"x": x, "y": y, "blur": b, "spread": sp, "color": "#000000", "opacity": a} for x, y, b, sp, a in L]}
                 for n, L in SHADOWS.items()]
effect_styles += [
    {"name": "Ring/brand", "key": EFFECT_STYLE_KEYS["Ring/brand"], "type": "DROP_SHADOW",
     "layers": [{"x": 0, "y": 0, "blur": 0, "spread": 3, "color": "#1570EF", "opacity": 0.46}]},
    {"name": "Ring/error", "key": EFFECT_STYLE_KEYS["Ring/error"], "type": "DROP_SHADOW",
     "layers": [{"x": 0, "y": 0, "blur": 0, "spread": 3, "color": "#DC2626", "opacity": 0.24}]}]
with open(os.path.join(OUT, "effect-styles.json"), "w", encoding="utf-8") as f:
    json.dump(effect_styles, f, ensure_ascii=False, indent=2)

# ---------------------------------------------------------------- CSS
L = ["/* FFM Design System v2 – generated by scripts/build_tokens.py from Figma (2026-11-03). Do not edit by hand. */",
     "/* Font: Inter (UI) · Geist Mono (code) · Icon: Phosphor Regular · Light mode only (chưa có Dark mode) */",
     ":root {", "  /* ---- Seed (primitive – không dùng trực tiếp trong component) ---- */"]
for k, v in seed.items():
    L.append(f"  --ffm-{seed_css(k)}: {v};")
L.append("\n  /* ---- 1. Color (semantic) ---- */")
for k, (a, d) in color.items():
    L.append(f"  --ffm-{sem_css(k)}: var(--ffm-{seed_css(a)});" + (f" /* {d} */" if d else ""))
L.append("\n  /* ---- 2. Spacing ---- */")
for k, (a, d) in spacing.items():
    L.append(f"  --ffm-{k.replace('/', '-')}: {lookup[a]}px;")
L.append("\n  /* ---- 3. Radius ---- */")
for k, (a, d) in radius.items():
    L.append(f"  --ffm-{k.replace('/', '-')}: {'9999' if a == 'dm-full' else lookup[a]}px;")
L.append("\n  /* ---- 4. Effect ---- */")
for k, v in flat["shadow"].items():
    L.append(f"  --ffm-shadow-{k}: {v};")
L.append("\n  /* ---- Typography ---- */")
L.append("  --ffm-font-heading: 'Inter', system-ui, sans-serif;")
L.append("  --ffm-font-body: 'Inter', system-ui, sans-serif;")
L.append("  --ffm-font-code: 'Geist Mono', ui-monospace, monospace;")
for n, fs, lh, ls in TYPE_SCALE:
    L.append(f"  --ffm-text-{n}: {fs}px; --ffm-leading-{n}: {lh}px; --ffm-tracking-{n}: {ls}px;")
L.append("}\n")
L.append("/* Text style classes (khớp text style Figma) */")
for t in text_styles:
    cls = t["name"].lower().replace("/", "-")
    fam = "var(--ffm-font-code)" if t["fontFamily"] == "Geist Mono" else ("var(--ffm-font-heading)" if t["name"].startswith("Heading") else "var(--ffm-font-body)")
    L.append(f".ffm-{cls} {{ font-family: {fam}; font-size: {t['fontSize']}px; line-height: {t['lineHeight']}px; "
             f"font-weight: {t['fontWeight']}; letter-spacing: {t['letterSpacing']}px; }}")
with open(os.path.join(OUT, "tokens.css"), "w", encoding="utf-8") as f:
    f.write("\n".join(L) + "\n")

# ---------------------------------------------------------------- shadcn mapping
SH = [("background", "bg-base-canvas"), ("foreground", "fg-base-primary"),
      ("card", "bg-base-card"), ("card-foreground", "fg-base-primary"),
      ("popover", "bg-base-card"), ("popover-foreground", "fg-base-primary"),
      ("primary", "bg-brand-default"), ("primary-foreground", "fg-base-light-solid"),
      ("secondary", "bg-base-surface-strong"), ("secondary-foreground", "fg-base-primary"),
      ("muted", "bg-base-surface-strong"), ("muted-foreground", "fg-base-secondary"),
      ("accent", "bg-base-hover"), ("accent-foreground", "fg-base-primary"),
      ("destructive", "bg-error-default"), ("destructive-foreground", "fg-base-light-solid"),
      ("border", "border-base-default"), ("input", "border-base-default"), ("ring", "border-base-focus"),
      ("sidebar", "bg-base-surface"), ("sidebar-foreground", "fg-base-primary"),
      ("sidebar-accent", "bg-base-selected"), ("sidebar-border", "border-base-default")]
S2 = ["/* shadcn/ui theme → FFM tokens. Import tokens.css trước file này. */", ":root {"]
for a, b in SH:
    S2.append(f"  --{a}: var(--ffm-{b});")
S2.append("  --radius: 12px; /* control = radius/xl 12 · container = radius/2xl 16 (rule #14) */")
S2.append("}")
with open(os.path.join(OUT, "shadcn-theme.css"), "w", encoding="utf-8") as f:
    f.write("\n".join(S2) + "\n")

counts = {c: len(v) for c, v in ALL.items()}
print(json.dumps(counts, ensure_ascii=False), "total", sum(counts.values()))
