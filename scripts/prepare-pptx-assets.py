"""Prepare crimson-tinted emblems, badges, and product logos for the pitch deck."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
EMB = ROOT / "public" / "emblems"
LOGOS = ROOT / "Project_Info" / "Website-Logos"
OUT = ROOT / "Project_Info" / "_pptx_assets"
PRIMARY = (0x9F, 0x1B, 0x20, 255)


def ensure_out() -> None:
    OUT.mkdir(parents=True, exist_ok=True)


def tint_from_rgba(src_path: Path, out_name: str, size: int = 256) -> Path:
    """Force silhouette to primary crimson, preserving alpha."""
    src = Image.open(src_path).convert("RGBA")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    sp, op = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = sp[x, y]
            if a < 12:
                continue
            lum = (r + g + b) / 3
            # Mask assets: dark pixels (or any opaque non-white) define the shape
            if lum > 245 and a > 200:
                continue
            strength = a if lum < 230 else int(a * (1 - (lum - 180) / 75))
            if strength < 10:
                continue
            op[x, y] = (PRIMARY[0], PRIMARY[1], PRIMARY[2], max(0, min(255, strength)))
    out = out.resize((size, size), Image.Resampling.LANCZOS)
    dest = OUT / out_name
    out.save(dest)
    return dest


def badge(icon: Image.Image, out_name: str, badge_size: int = 320, icon_frac: float = 0.5) -> Path:
    canvas = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    # bg-primary/10 circle
    draw.ellipse((0, 0, badge_size - 1, badge_size - 1), fill=(0x9F, 0x1B, 0x20, 28))
    icon = icon.convert("RGBA")
    iw = int(badge_size * icon_frac)
    icon.thumbnail((iw, iw), Image.Resampling.LANCZOS)
    x = (badge_size - icon.width) // 2
    y = (badge_size - icon.height) // 2
    canvas.alpha_composite(icon, (x, y))
    dest = OUT / out_name
    canvas.save(dest)
    return dest


def save_icon(name: str, im: Image.Image) -> Path:
    dest = OUT / f"icon-{name}.png"
    im.save(dest)
    return dest


def make_dollar() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype("arialbd.ttf", 180)
    except OSError:
        font = ImageFont.load_default()
    bbox = d.textbbox((0, 0), "$", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((256 - tw) // 2, (256 - th) // 2 - 12), "$", font=font, fill=PRIMARY)
    return im


def make_sun() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = 128
    r, w = 56, 12
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=PRIMARY, width=w)
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        x1, y1 = cx + math.cos(rad) * 78, cy + math.sin(rad) * 78
        x2, y2 = cx + math.cos(rad) * 110, cy + math.sin(rad) * 110
        d.line((x1, y1, x2, y2), fill=PRIMARY, width=w)
        rr = w // 2
        d.ellipse((x2 - rr, y2 - rr, x2 + rr, y2 + rr), fill=PRIMARY)
    return im


def make_shield_check() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    shield = [(128, 28), (208, 56), (208, 120), (128, 220), (48, 120), (48, 56), (128, 28)]
    d.line(shield, fill=PRIMARY, width=12)
    d.line([(88, 128), (118, 158), (172, 96)], fill=PRIMARY, width=14)
    return im


def make_expertise() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.line([(28, 220), (228, 220)], fill=PRIMARY, width=12)
    d.line([(52, 220), (52, 110), (128, 55), (204, 110), (204, 220)], fill=PRIMARY, width=12)
    d.line([(100, 220), (100, 150), (156, 150), (156, 220)], fill=PRIMARY, width=12)
    for x, y in [(90, 120), (160, 120), (90, 160), (160, 160)]:
        d.ellipse((x - 4, y - 4, x + 4, y + 4), fill=PRIMARY)
    return im


def make_flexibility() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = []
    for i in range(100):
        t = i / 99
        if t < 0.5:
            u = t * 2
            y = ((1 - u) ** 3) * 7 + 3 * ((1 - u) ** 2) * u * 7 + 3 * (1 - u) * (u**2) * 17 + (u**3) * 17
            x = ((1 - u) ** 3) * 3.5 + 3 * ((1 - u) ** 2) * u * 7.5 + 3 * (1 - u) * (u**2) * 7.5 + (u**3) * 12
        else:
            u = (t - 0.5) * 2
            y = ((1 - u) ** 3) * 17 + 3 * ((1 - u) ** 2) * u * 17 + 3 * (1 - u) * (u**2) * 7 + (u**3) * 7
            x = ((1 - u) ** 3) * 12 + 3 * ((1 - u) ** 2) * u * 16.5 + 3 * (1 - u) * (u**2) * 16.5 + (u**3) * 20.5
        pts.append((x / 24 * 256, y / 24 * 256))
    d.line(pts, fill=PRIMARY, width=16, joint="curve")
    for p in (pts[0], pts[-1]):
        d.ellipse((p[0] - 8, p[1] - 8, p[0] + 8, p[1] + 8), fill=PRIMARY)
    return im


def make_tooling() -> Image.Image:
    im = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = cy = 128
    d.ellipse((cx - 95, cy - 95, cx + 95, cy + 95), fill=PRIMARY)
    d.ellipse((cx - 42, cy - 42, cx + 42, cy + 42), fill=(255, 255, 255, 255))

    def rot(pts, deg):
        r = math.radians(deg)
        c, s = math.cos(r), math.sin(r)
        out = []
        for x, y in pts:
            x2, y2 = x - cx, y - cy
            out.append((cx + x2 * c - y2 * s, cy + x2 * s + y2 * c))
        return out

    knife = [(70, 18), (186, 18), (178, 48), (78, 48)]
    for deg in (0, 90, 180, 270):
        d.polygon(rot(knife, deg), fill=PRIMARY)
    return im


def make_map_pin() -> None:
    im = Image.new("RGBA", (160, 240), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((20, 10, 140, 130), fill=PRIMARY)
    d.polygon([(40, 100), (80, 230), (120, 100)], fill=PRIMARY)
    d.ellipse((55, 45, 105, 95), fill=(255, 255, 255, 255))
    im.save(OUT / "map-pin.png")


def _q(t, p0, p1, p2):
    u = 1 - t
    return (
        u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
        u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    )


def make_header_arch_accent() -> None:
    """Site-nav-style crimson accents: top, side, and bottom (high-DPI)."""
    ss = 4
    n = 1600
    design = 86
    bar_ratio = 14 / design

    # Top: flat top edge, arched underside (thicker at ends)
    out_w, out_h = 6000, 280
    w, h = out_w * ss, out_h * ss
    bar_min = int(round(bar_ratio * h))
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    left = (0.0, float(h - 1))
    right = (float(w - 1), float(h - 1))
    ctrl = (w / 2.0, float(bar_min))
    curve = [_q(i / (n - 1), left, ctrl, right) for i in range(n)]
    draw.polygon([(0, 0), (w - 1, 0)] + list(reversed(curve)), fill=PRIMARY)
    top = im.resize((out_w, out_h), Image.Resampling.LANCZOS)
    top.save(OUT / "accent-arch-top.png", optimize=True)
    top.save(OUT / "accent-arch-top-test.png", optimize=True)

    # Side (left): flat left edge, arched right edge into content
    out_sw, out_sh = 280, 4000
    sw, sh = out_sw * ss, out_sh * ss
    bar_min_s = int(round(bar_ratio * sw))
    im_s = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    draw_s = ImageDraw.Draw(im_s)
    top_pt = (float(sw - 1), 0.0)
    bot_pt = (float(sw - 1), float(sh - 1))
    ctrl_s = (float(bar_min_s), sh / 2.0)
    curve_s = [_q(i / (n - 1), top_pt, ctrl_s, bot_pt) for i in range(n)]
    # left edge flush: (0,0)-(0,h), right edge = curve
    draw_s.polygon([(0, 0), (0, sh - 1)] + list(reversed(curve_s)), fill=PRIMARY)
    side = im_s.resize((out_sw, out_sh), Image.Resampling.LANCZOS)
    side.save(OUT / "accent-arch-side.png", optimize=True)

    # Bottom: flat bottom edge, arched top edge into content (mirror of top accent)
    im_b = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_b = ImageDraw.Draw(im_b)
    left_b = (0.0, 0.0)
    right_b = (float(w - 1), 0.0)
    ctrl_b = (w / 2.0, float(h - 1 - bar_min))
    curve_b = [_q(i / (n - 1), left_b, ctrl_b, right_b) for i in range(n)]
    draw_b.polygon([(0, h - 1), (w - 1, h - 1)] + list(reversed(curve_b)), fill=PRIMARY)
    bottom = im_b.resize((out_w, out_h), Image.Resampling.LANCZOS)
    bottom.save(OUT / "accent-arch-bottom.png", optimize=True)


def main() -> None:
    ensure_out()

    masks = {
        "paint": "paint-mask-cropped.png",
        "insect": "insect-mask-cropped-v2.png",
        "moisture": "moisture-mask-cropped-v2.png",
        "health": "health-shield-mask-cropped.png",
        # hammer-mask-cropped is white-on-transparent (invisible when tinted); use full emblem
        "hammer": "hammer.png",
    }
    for key, fname in masks.items():
        tint_from_rgba(EMB / fname, f"icon-{key}.png")

    for name in ("feather", "fire", "spiral"):
        tint_from_rgba(EMB / f"{name}.png", f"icon-{name}.png")

    save_icon("dollar", make_dollar())
    save_icon("sun", make_sun())
    save_icon("shield-check", make_shield_check())
    save_icon("expertise", make_expertise())
    save_icon("flexibility", make_flexibility())
    save_icon("tooling", make_tooling())
    make_map_pin()
    make_header_arch_accent()

    badges = {
        "benefit-expertise": "icon-expertise.png",
        "benefit-value": "icon-dollar.png",
        "benefit-interior": "icon-sun.png",
        "benefit-impact": "icon-shield-check.png",
        "benefit-moisture": "icon-moisture.png",
        "benefit-insect": "icon-insect.png",
        "benefit-install": "icon-hammer.png",
        "benefit-stain": "icon-paint.png",
        "benefit-pfas": "icon-health.png",
        "upgrade-flexibility": "icon-flexibility.png",
        "upgrade-feather": "icon-feather.png",
        "upgrade-fire": "icon-fire.png",
        "upgrade-tooling": "icon-tooling.png",
        "upgrade-spiral": "icon-spiral.png",
    }
    for badge_name, icon_name in badges.items():
        frac = 0.52 if badge_name.startswith("upgrade") else 0.48
        badge(Image.open(OUT / icon_name), f"badge-{badge_name}.png", 320, frac)

    for src_name, dest_name in [
        ("Flex-Trim.jpg", "logo-flex-trim-product.jpg"),
        ("ZZZ-Flex.png", "logo-zzz-flex.png"),
        ("Ultra-Flex.png", "logo-ultra-flex.png"),
        ("Ultra-Fire-Flex.png", "logo-ultra-fire-flex.png"),
        ("Machinable-S4S.png", "logo-machinable-s4s.png"),
    ]:
        im = Image.open(LOGOS / src_name)
        if dest_name.endswith(".png"):
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")
        h = 120
        w = max(1, int(im.width * h / im.height))
        im = im.resize((w, h), Image.Resampling.LANCZOS)
        im.save(OUT / dest_name)

    print(f"Prepared {len(list(OUT.glob('*')))} files in {OUT}")


if __name__ == "__main__":
    main()
