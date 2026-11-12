"""Collect design tokens from src/library/*.tsx + src/demo.css into tokens/tokens.json.

Read-only over component code: scans CSS strings for custom-property
definitions (light root rule vs. :where(.dark…) / [data-theme=dark] rule) and
for raw radius / font-size / spacing / shadow literals, merges equal values,
and names them canonically. Run: python scripts/extract-tokens.py
"""
import json, re, collections, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LIB = ROOT / "src" / "library"
OUT = ROOT / "tokens" / "tokens.json"

RULE = re.compile(r"([^{}]+)\{([^{}]*)\}")
DECL = re.compile(r"(--[\w-]+)\s*:\s*([^;}]+)")
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")


def norm_hex(v):
    v = v.strip().lower()
    if not HEX.fullmatch(v):
        return None
    h = v[1:]
    if len(h) in (3, 4):
        h = "".join(c * 2 for c in h)
    if len(h) == 8 and h.endswith("ff"):
        h = h[:6]
    return "#" + h


def is_dark(sel):
    s = sel.lower()
    return "dark" in s


# ---- role from variable name suffix -------------------------------------
ROLES = [
    ("status/danger", r"(danger|err|error|red|bad|fail|neg|del|rose)"),
    ("status/success", r"(ok|success|green|good|pass|pos|add|done|live)"),
    ("status/warning", r"(warn|amber|yellow|caution|pend|mark|hl)"),
    ("status/info", r"(info|blue|sky)"),
    ("accent/soft", r"(accent-?bg|accent-?soft|lit|sel|tint|primary-?bg|focus-?bg)"),
    ("accent/default", r"(accent|primary|brand|link|focus|ring)"),
    ("border/default", r"(line|border|rule|divider|stroke|sep|edge|bd)"),
    ("text/faint", r"(faint|dim|ghost|subtle|placeholder|ph|quiet|disabled)"),
    ("text/muted", r"(muted|mute|soft-?fg|secondary|sub|meta|label|soft)"),
    ("text/primary", r"(fg|text|ink|fore|color|title|head)"),
    ("surface/2", r"(chip|hover|well|track|tile|fill|code|alt|muted-?bg|soft-?bg|raised|panel|card2)"),
    ("bg", r"(bg|page|surface|card|paper|base|back|canvas|preview|sidebar)"),
]


def role_of(name):
    suffix = name.split("-", 3)[-1] if name.count("-") >= 3 else name
    for role, pat in ROLES:
        if re.search(pat, name.lower().lstrip("-")):
            return role
    return None



SLOT_ORDER = ["bg", "surface/1", "surface/2", "surface/3", "border/default", "border/strong",
              "text/primary", "text/secondary", "text/tertiary", "text/inverse",
              "accent/default", "accent/soft", "status/danger", "status/danger-soft",
              "status/success", "status/success-soft", "status/warning", "status/warning-soft",
              "status/mark", "status/violet", "status/teal"]


def hsl(hexv):
    h = hexv[1:7]
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        return 0, 0, l
    d = mx - mn
    s = d / (2 - mx - mn) if l > .5 else d / (mx + mn)
    if mx == r:
        hue = (g - b) / d % 6
    elif mx == g:
        hue = (b - r) / d + 2
    else:
        hue = (r - g) / d + 4
    return hue * 60, s, l


def classify(name, light):
    if len(light) == 9:  # alpha overlay - leave out of the solid palette
        return None
    n = name.lower()
    hue, sat, l = hsl(light)
    if sat < .12:  # neutral
        if l >= .985:
            return "surface/1" if re.search(r"(card|surface|panel|pop|menu|tile)", n) else "bg"
        if l >= .955:
            return "border/default" if re.search(r"(line|border|rule|sep)", n) else "surface/2"
        if l >= .90:
            return "border/default" if re.search(r"(line|border|rule|sep|edge|stroke)", n) else "surface/3"
        if l >= .80:
            return "border/strong"
        if l >= .58:
            return "text/tertiary"
        if l >= .30:
            return "text/secondary"
        return "text/primary"
    if l >= .86:
        if 40 <= hue < 70:
            return "status/mark"
        if hue >= 330 or hue < 20:
            return "status/danger-soft"
        if 80 <= hue < 170:
            return "status/success-soft"
        if 20 <= hue < 40:
            return "status/warning-soft"
        return "accent/soft"
    if hue >= 330 or hue < 15:
        return "status/danger"
    if 15 <= hue < 55:
        return "status/warning"
    if 55 <= hue < 165:
        return "status/success"
    if 165 <= hue < 200:
        return "status/teal"
    if 200 <= hue < 245:
        return "accent/default"
    return "status/violet"


def collect():
    files = sorted(LIB.glob("*.tsx")) + [ROOT / "src" / "demo.css"]
    vars_ = collections.defaultdict(dict)  # (file, var) -> {light, dark}
    raw = {k: collections.Counter() for k in ("radius", "font-size", "space", "shadow", "font-family", "font-weight")}
    raw_users = {k: collections.defaultdict(set) for k in raw}
    for f in files:
        comp = f.stem
        text = f.read_text(encoding="utf-8")
        for sel, body in RULE.findall(text):
            for name, val in DECL.findall(body):
                mode = "dark" if is_dark(sel) else "light"
                vars_[(comp, name)].setdefault(mode, val.strip())
            for prop, key in (("border-radius", "radius"), ("font-size", "font-size"),
                              ("gap", "space"), ("padding", "space"), ("box-shadow", "shadow"),
                              ("font-family", "font-family"), ("font-weight", "font-weight")):
                for m in re.finditer(rf"(?<![\w-]){prop}\s*:\s*([^;}}!]+)", body):
                    v = m.group(1).strip()
                    if "var(" in v:
                        continue
                    vals = [v] if key in ("shadow", "font-family") else v.split()
                    for one in vals:
                        if key in ("radius", "space", "font-size") and not re.fullmatch(r"[\d.]+px", one):
                            continue
                        raw[key][one] += 1
                        raw_users[key][one].add(comp)
            # shorthand font: 400 14px/1.5 Inter
            for m in re.finditer(r"(?<![\w-])font\s*:\s*(\d{3})?\s*([\d.]+px)", body):
                if m.group(1):
                    raw["font-weight"][m.group(1)] += 1
                    raw_users["font-weight"][m.group(1)].add(comp)
                raw["font-size"][m.group(2)] += 1
                raw_users["font-size"][m.group(2)].add(comp)
    return vars_, raw, raw_users


def build():
    vars_, raw, raw_users = collect()
    # ---- colours: classify each (light, dark) pair into a canonical slot ----
    slots = collections.defaultdict(lambda: collections.Counter())
    slot_vars = collections.defaultdict(set)
    usage = collections.defaultdict(set)
    unmapped = []
    for (comp, name), modes in vars_.items():
        light = norm_hex(modes.get("light", "")) if modes.get("light") else None
        if not light:
            continue  # non-colour var (sizes, color-mix, var() refs)
        dark = norm_hex(modes.get("dark", "")) if modes.get("dark") else None
        slot = classify(name, light)
        if slot is None:
            unmapped.append(f"{comp}:{name}={light}")
            continue
        slots[slot][(light, dark or light)] += 1
        slot_vars[slot].add(f"{comp}:{name}")
        usage[comp].add(slot)
    color_tokens = {}
    for slot in SLOT_ORDER:
        if slot not in slots:
            continue
        themed = [(k, c) for k, c in slots[slot].most_common() if k[0] != k[1]]  # prefer pairs that define dark
        (l, d), n = (themed or slots[slot].most_common())[0]
        color_tokens[slot] = {
            "light": l, "dark": d,
            "uses": sum(slots[slot].values()),
            "mergedValues": [f"{a}/{b}" for (a, b), _ in slots[slot].most_common()[1:12]],
            "sourceVars": sorted(slot_vars[slot]),
        }

    def scale(key, prefix, minuse=3):
        out = {}
        for v, n in sorted(raw[key].items(), key=lambda t: float(re.sub(r"[^\d.]", "", t[0]) or 0) if key != "shadow" else -t[1]):
            if n < minuse:
                continue
            nm = f"{prefix}/{v.replace('px', '').replace('.', '_')}" if key in ("radius", "space", "font-size", "font-weight") else None
            out[nm or f"{prefix}/{len(out) + 1}"] = {"value": v, "uses": n, "components": len(raw_users[key][v])}
            for comp in raw_users[key][v]:
                usage[comp].add(nm or f"{prefix}/{len(out)}")
        return out

    tokens = {
        "$meta": {
            "source": "src/library/*.tsx + src/demo.css (generated by scripts/extract-tokens.py)",
            "modes": ["Light", "Dark"],
            "note": "Colours merged by (role, light, dark) value; role inferred from the variable name. "
                    "Names with -2, -3 are less common variants of the same role; palette/* are one-off values. "
                    "Sizes counted from literal px values with >=3 uses.",
        },
        "color": color_tokens,
        "radius": scale("radius", "radius"),
        "space": scale("space", "space", 10),
        "font": {
            "family": scale("font-family", "family", 3),
            "size": scale("font-size", "size"),
            "weight": scale("font-weight", "weight"),
        },
        "shadow": scale("shadow", "shadow", 5),
        "componentTokens": {k: sorted(v) for k, v in sorted(usage.items())},
        "unmappedVars": sorted(unmapped),
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(tokens, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"colors={len(color_tokens)} radius={len(tokens['radius'])} space={len(tokens['space'])} "
          f"size={len(tokens['font']['size'])} shadow={len(tokens['shadow'])} comps={len(usage)} unmapped={len(unmapped)}")


if __name__ == "__main__":
    build()
