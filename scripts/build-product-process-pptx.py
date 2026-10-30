"""
Build Flex Trim™ / Carter Millwork master product & process review PowerPoint.
Visual language mirrors the website (tiles, emblems, timeline, map, logos).

Run:
  python scripts/prepare-pptx-assets.py
  python scripts/build-product-process-pptx.py
"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image as PILImage
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = ROOT / "Project_Info" / "_pptx_assets"
OUT = ROOT / "Project_Info" / "Flex-Trim-Product-Process-Review.pptx"

PRIMARY = RGBColor(0x9F, 0x1B, 0x20)
NEAR_BLACK = RGBColor(0x17, 0x17, 0x17)
NEUTRAL_700 = RGBColor(0x40, 0x40, 0x40)
NEUTRAL_600 = RGBColor(0x52, 0x52, 0x52)
NEUTRAL_500 = RGBColor(0x73, 0x73, 0x73)
NEUTRAL_400 = RGBColor(0xA3, 0xA3, 0xA3)
NEUTRAL_200 = RGBColor(0xE5, 0xE5, 0xE5)
NEUTRAL_100 = RGBColor(0xF5, 0xF5, 0xF5)
NEUTRAL_50 = RGBColor(0xFA, 0xFA, 0xFA)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
SOFT_RED = RGBColor(0xFE, 0xF2, 0xF2)  # red-50-ish
FONT = "Calibri"

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)
MARGIN = Inches(0.55)
CONTENT_TOP = Inches(1.05)


def set_run_font(run, *, size, bold=False, color=NEAR_BLACK):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = FONT


def enable_wrap(tf):
    """Force text to wrap inside the shape instead of running as one overflowing line."""
    tf.word_wrap = True
    try:
        tf.auto_size = MSO_AUTO_SIZE.NONE
    except Exception:
        pass


def ptext(p, text, *, size=14, bold=False, color=NEAR_BLACK, align=PP_ALIGN.LEFT, before=0, after=4):
    p.alignment = align
    p.space_before = Pt(before)
    p.space_after = Pt(after)
    p.text = text
    for run in p.runs:
        set_run_font(run, size=size, bold=bold, color=color)


def write_lines(tf, lines, *, align=PP_ALIGN.LEFT):
    enable_wrap(tf)
    for i, (text, kwargs) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        kw = {"align": align, **kwargs}
        ptext(p, text, **kw)


def rect(slide, left, top, width, height, fill, line=None, rounded=False):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
        left,
        top,
        width,
        height,
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if rounded:
        try:
            shape.adjustments[0] = 0.12
        except Exception:
            pass
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(1)
    return shape


def oval(slide, left, top, width, height, fill, line=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(1.5)
    return shape


def textbox(slide, left, top, width, height):
    box = slide.shapes.add_textbox(left, top, width, height)
    enable_wrap(box.text_frame)
    return box


def picture(slide, path, left, top, width=None, height=None):
    if path is None or not Path(path).exists():
        return None
    kwargs = {}
    if width is not None:
        kwargs["width"] = width
    if height is not None:
        kwargs["height"] = height
    return slide.shapes.add_picture(str(path), left, top, **kwargs)


ACCENT_TOP_H = Inches(0.42)
ACCENT_SIDE_W = Inches(0.42)
ACCENT_BOTTOM_H = Inches(0.85)


def add_top_accent(slide):
    """Header-style crimson accent — flat top, arched underside."""
    arch = ASSETS / "accent-arch-top.png"
    if not arch.exists():
        arch = ASSETS / "accent-arch-top-test.png"
    if arch.exists():
        picture(slide, arch, 0, 0, width=SLIDE_W, height=ACCENT_TOP_H)
        return
    rect(slide, 0, 0, SLIDE_W, Inches(0.04), PRIMARY)


def add_side_accent(slide):
    """Left crimson accent — flat outer edge, arched into the content."""
    arch = ASSETS / "accent-arch-side.png"
    if arch.exists():
        picture(slide, arch, 0, 0, width=ACCENT_SIDE_W, height=SLIDE_H)
        return
    rect(slide, 0, 0, Inches(0.18), SLIDE_H, PRIMARY)


def add_bottom_accent(slide, *, height=ACCENT_BOTTOM_H):
    """Bottom crimson accent — flat bottom edge, arched top into content."""
    arch = ASSETS / "accent-arch-bottom.png"
    if arch.exists():
        picture(slide, arch, 0, SLIDE_H - height, width=SLIDE_W, height=height)
        return
    rect(slide, 0, SLIDE_H - height, SLIDE_W, height, PRIMARY)


def add_chrome(slide, title: str, subtitle: str | None = None, *, center_title=False):
    rect(slide, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    add_top_accent(slide)
    align = PP_ALIGN.CENTER if center_title else PP_ALIGN.LEFT
    left = MARGIN if not center_title else Inches(1.5)
    width = Inches(12.2) if not center_title else Inches(10.3)
    title_top = Inches(0.48)
    t = textbox(slide, left, title_top, width, Inches(0.5))
    ptext(t.text_frame.paragraphs[0], title, size=26, bold=True, color=NEAR_BLACK, align=align, after=0)
    if subtitle:
        s = textbox(slide, left, title_top + Inches(0.46), width, Inches(0.32))
        ptext(s.text_frame.paragraphs[0], subtitle, size=12, color=NEUTRAL_600, align=align, after=0)
    # footer
    rect(slide, 0, SLIDE_H - Inches(0.32), SLIDE_W, Inches(0.32), NEUTRAL_50)
    f = textbox(slide, MARGIN, SLIDE_H - Inches(0.28), Inches(10), Inches(0.24))
    ptext(f.text_frame.paragraphs[0], "Flex Trim™  ·  Carter Millwork, Inc.", size=9, color=NEUTRAL_400, after=0)


def section_slide(prs, kicker: str, title: str, blurb: str = ""):
    """Soft section opener — white with curved left accent."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    rect(slide, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    add_side_accent(slide)
    k = textbox(slide, Inches(0.75), Inches(2.55), Inches(11), Inches(0.35))
    ptext(k.text_frame.paragraphs[0], kicker.upper(), size=12, bold=True, color=PRIMARY, after=0)
    t = textbox(slide, Inches(0.75), Inches(2.95), Inches(11.5), Inches(0.7))
    ptext(t.text_frame.paragraphs[0], title, size=36, bold=True, color=NEAR_BLACK, after=0)
    if blurb:
        b = textbox(slide, Inches(0.75), Inches(3.8), Inches(10.5), Inches(1))
        ptext(b.text_frame.paragraphs[0], blurb, size=15, color=NEUTRAL_600, after=0)
    return slide


def content_slide(prs, title, subtitle=None, *, center_title=False):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_chrome(slide, title, subtitle, center_title=center_title)
    return slide


def bullets(slide, items, *, left=MARGIN, top=CONTENT_TOP, width=Inches(12.2), height=Inches(5.6), size=14):
    box = textbox(slide, left, top, width, height)
    write_lines(
        box.text_frame,
        [(f"•  {item}", {"size": size, "color": NEUTRAL_600, "after": 8}) for item in items],
    )


def two_col(slide, left_items, right_items, *, top=CONTENT_TOP, size=13):
    bullets(slide, left_items, left=MARGIN, top=top, width=Inches(5.9), size=size)
    bullets(slide, right_items, left=Inches(6.9), top=top, width=Inches(5.9), size=size)


def prepare_image(path: Path, max_side: int = 1400):
    if not path.exists():
        return None
    try:
        with PILImage.open(path) as im:
            if path.suffix.lower() in {".webp"} or im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            elif im.mode == "RGBA" and path.suffix.lower() in {".jpg", ".jpeg"}:
                im = im.convert("RGB")
            im.thumbnail((max_side, max_side), PILImage.Resampling.LANCZOS)
            buf = io.BytesIO()
            fmt = "PNG" if path.suffix.lower() == ".png" and im.mode == "RGBA" else "JPEG"
            if fmt == "JPEG" and im.mode != "RGB":
                im = im.convert("RGB")
            im.save(buf, format=fmt, quality=85)
            buf.seek(0)
            return buf
    except Exception:
        return str(path) if path.suffix.lower() in {".jpg", ".jpeg", ".png"} else None


def gallery_images(category: str, limit: int = 8) -> list[Path]:
    folder = PUBLIC / "gallery" / category
    if not folder.exists():
        return []
    return sorted(
        [p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}],
        key=lambda p: p.name.lower(),
    )[:limit]


def image_grid(slide, paths, *, left=MARGIN, top=CONTENT_TOP, width=Inches(12.2), height=Inches(5.6), cols=4, rows=2):
    gap = Inches(0.12)
    cell_w = (width - gap * (cols - 1)) / cols
    cell_h = (height - gap * (rows - 1)) / rows
    items = list(paths[: cols * rows])
    while len(items) < cols * rows:
        items.append(None)
    for i, item in enumerate(items):
        r, c = divmod(i, cols)
        x = left + c * (cell_w + gap)
        y = top + r * (cell_h + gap)
        rect(slide, x, y, cell_w, cell_h, WHITE, NEUTRAL_200, rounded=True)
        if item is None:
            lab = textbox(slide, x, y + cell_h / 2 - Inches(0.12), cell_w, Inches(0.28))
            ptext(lab.text_frame.paragraphs[0], "Add image", size=11, color=NEUTRAL_400, align=PP_ALIGN.CENTER, after=0)
            continue
        img = prepare_image(item)
        if img is None:
            continue
        inset = Inches(0.06)
        try:
            slide.shapes.add_picture(img, x + inset, y + inset, width=cell_w - 2 * inset, height=cell_h - 2 * inset)
        except Exception:
            pass


# ---------- Site-faithful compositions ----------

BENEFITS = [
    ("benefit-expertise", "Decades of trusted expertise", "Going back to 1963, we consolidated the knowledge of six companies into one trusted brand."),
    ("benefit-value", "Value-engineered with a lifetime warranty", "Generally faster than radiused wood, costs up to 70% less, and allows quick on-site adjustments."),
    ("benefit-interior", "Interior & exterior compatible", "Indoor use, or exterior with an exterior finish coating."),
    ("benefit-impact", "Impact-resistant & chip-proof", "Hard polyurethane resists dents and is chip-proof."),
    ("benefit-moisture", "Moisture & rot proof", "Resists water absorption; will not warp or decay."),
    ("benefit-insect", "Insect proof", "Resin-based material that naturally repels insects."),
    ("benefit-install", "Easy to install", "Cuts, nails, and glues with standard wood millwork tools."),
    ("benefit-stain", "Stainable & paintable", "All product is paintable; stain-grade reproduces wood species grain."),
    ("benefit-pfas", "PFAS & VOC free", "Manufactured without PFAS or VOCs."),
]

UPGRADES = [
    ("upgrade-flexibility", "Additional flexibility", "Zzz Flex®", "Premium elastomer composite for intricate patterns, tight radii, and cold-weather climates.", "Available NC & UT · Xtrulinear capable"),
    ("upgrade-feather", "Reduced weight", "Ultra-Flex", "40–50% lighter syntactic polyurethane. Pre-primed, back-sanded for glue adhesion.", "Manufactured exclusively at our Utah plant."),
    ("upgrade-fire", "Commercial fire ratings", "Ultra-Fire Flex", "ASTM E84 Class B fire-rated moulding for commercial builds.", "Manufactured exclusively at our Utah plant."),
    ("upgrade-tooling", "Enhanced machinability", "Machinable S4S", "Mill short straight custom runs on conventional woodworking equipment.", "Manufactured exclusively at our Utah plant."),
    ("upgrade-spiral", "Extended lengths", "Xtrulinear®", "Continuous 12'–500' on a spool — fewer joints, less waste.", "Available from NC and UT plants."),
]

TIMELINE = [
    ("1963", "Ultra-Flex Moulding established — original inventor of flexible moulding (Escondido, CA)."),
    ("1985", "Flex Trim™ established in Rancho Cucamonga, CA and Garner, NC."),
    ("1993", "Zago Flexible Mouldings established in Newark, NJ."),
    ("Feb 1995", "Carter Millwork founded in Linwood, NC by Ned and Sally Carter."),
    ("Jul 1999", "Flexible Moulding International founded in Provo, UT by Theron Anderson."),
    ("Jan 2007", "Second-generation Greg and Alan Carter purchase Carter Millwork."),
    ("Nov 2008", "Acquires Flex Trim™; production moves to North Carolina."),
    ("Jan 2009", "Acquires Flexible Moulding International → Flex Trim West. Matt & Kacey Anderson lead West."),
    ("Apr 2012", "Acquires Ultra-Flex; consolidates into Utah facility."),
    ("Mar 2014", "Acquires Flexgrain; consolidates into North Carolina."),
    ("Jul 2014", "Acquires Zago; consolidates into North Carolina."),
    ("Apr 2017", "Relocates to larger Lexington, NC facility."),
    ("Jan 2021", "Greg Carter assumes sole ownership."),
    ("Jan 2025", "Third-generation Jackson Carter joins — engineering focus on manufacturing & digital workflows."),
]


def slide_advantages(prs):
    """Homepage-style 3×3 white tiles with emblem badges."""
    slide = content_slide(prs, "The Flex Trim™ advantage", None, center_title=True)
    # push content down a bit after centered title
    cols, rows = 3, 3
    gap_x, gap_y = Inches(0.22), Inches(0.18)
    grid_left, grid_top = MARGIN, Inches(1.0)
    grid_w, grid_h = Inches(12.2), Inches(5.9)
    cell_w = (grid_w - gap_x * (cols - 1)) / cols
    cell_h = (grid_h - gap_y * (rows - 1)) / rows

    for i, (badge_key, title, body) in enumerate(BENEFITS):
        r, c = divmod(i, cols)
        x = grid_left + c * (cell_w + gap_x)
        y = grid_top + r * (cell_h + gap_y)
        rect(slide, x, y, cell_w, cell_h, WHITE, NEUTRAL_200, rounded=True)

        badge = ASSETS / f"badge-{badge_key}.png"
        if badge.exists():
            picture(slide, badge, x + Inches(0.22), y + Inches(0.22), height=Inches(0.48))

        title_left = x + Inches(0.82)
        tb = textbox(slide, title_left, y + Inches(0.22), cell_w - Inches(1.0), Inches(0.55))
        # Match site: value-engineered title can wrap to two lines
        if badge_key == "benefit-value":
            write_lines(
                tb.text_frame,
                [
                    ("Value-engineered with a", {"size": 12, "bold": True, "color": NEAR_BLACK, "after": 0}),
                    ("lifetime warranty", {"size": 12, "bold": True, "color": PRIMARY, "after": 0}),
                ],
            )
        else:
            ptext(tb.text_frame.paragraphs[0], title, size=12, bold=True, color=NEAR_BLACK, after=0)

        bb = textbox(slide, x + Inches(0.22), y + Inches(0.85), cell_w - Inches(0.4), cell_h - Inches(1.0))
        ptext(bb.text_frame.paragraphs[0], body, size=11, color=NEUTRAL_600, after=0)


def slide_advantages_list(prs):
    """Product-overview list layout: right-aligned title | emblem | description."""
    slide = content_slide(prs, "The Flex Trim™ advantage", "Product overview layout", center_title=True)
    top = Inches(1.0)
    row_h = Inches(0.58)
    for i, (badge_key, title, body) in enumerate(BENEFITS):
        y = top + i * row_h
        # title right-aligned
        t = textbox(slide, MARGIN, y, Inches(3.6), row_h - Inches(0.05))
        lines = title.split(" with a ") if "with a" in title else None
        if badge_key == "benefit-value":
            write_lines(
                t.text_frame,
                [
                    ("Value-engineered with a", {"size": 11, "bold": True, "color": NEAR_BLACK, "align": PP_ALIGN.RIGHT, "after": 0}),
                    ("lifetime warranty", {"size": 11, "bold": True, "color": PRIMARY, "align": PP_ALIGN.RIGHT, "after": 0}),
                ],
                align=PP_ALIGN.RIGHT,
            )
        else:
            # two-line titles like site where natural
            parts = {
                "benefit-expertise": ("Decades of", "trusted expertise"),
                "benefit-interior": ("Interior & exterior", "compatible"),
                "benefit-impact": ("Impact-resistant &", "chip-proof"),
                "benefit-moisture": ("Moisture & rot", "proof"),
                "benefit-insect": ("Insect", "proof"),
                "benefit-install": ("Easy to", "install"),
                "benefit-stain": ("Stainable &", "paintable"),
                "benefit-pfas": ("PFAS &", "VOC free"),
            }.get(badge_key)
            if parts:
                write_lines(
                    t.text_frame,
                    [
                        (parts[0], {"size": 11, "bold": True, "color": NEAR_BLACK, "align": PP_ALIGN.RIGHT, "after": 0}),
                        (parts[1], {"size": 11, "bold": True, "color": NEAR_BLACK, "align": PP_ALIGN.RIGHT, "after": 0}),
                    ],
                    align=PP_ALIGN.RIGHT,
                )
            else:
                ptext(t.text_frame.paragraphs[0], title, size=11, bold=True, color=NEAR_BLACK, align=PP_ALIGN.RIGHT, after=0)

        badge = ASSETS / f"badge-{badge_key}.png"
        if badge.exists():
            picture(slide, badge, Inches(4.4), y + Inches(0.02), height=Inches(0.42))

        b = textbox(slide, Inches(5.1), y + Inches(0.05), Inches(7.6), row_h - Inches(0.08))
        ptext(b.text_frame.paragraphs[0], body, size=11, color=NEUTRAL_600, after=0)


def slide_upgrades_overview(prs):
    """Material upgrade cards — matches collapsed card look with emblem + product name."""
    slide = content_slide(prs, "Specialized material upgrades", None, center_title=True)
    n = 5
    gap = Inches(0.18)
    left = MARGIN
    top = Inches(1.15)
    width = Inches(12.2)
    card_w = (width - gap * (n - 1)) / n
    card_h = Inches(5.5)

    for i, (badge_key, title, product, desc, footnote) in enumerate(UPGRADES):
        x = left + i * (card_w + gap)
        rect(slide, x, top, card_w, card_h, WHITE, NEUTRAL_200, rounded=True)
        # soft gradient feel: light fill strip at bottom
        rect(slide, x + Inches(0.04), top + card_h - Inches(0.04), card_w - Inches(0.08), Inches(0.04), NEUTRAL_50)

        badge = ASSETS / f"badge-{badge_key}.png"
        if badge.exists():
            picture(slide, badge, x + (card_w - Inches(0.95)) / 2, top + Inches(0.35), height=Inches(0.95))

        t = textbox(slide, x + Inches(0.12), top + Inches(1.5), card_w - Inches(0.24), Inches(0.7))
        ptext(t.text_frame.paragraphs[0], title, size=12, bold=True, color=NEAR_BLACK, align=PP_ALIGN.CENTER, after=2)
        p = textbox(slide, x + Inches(0.12), top + Inches(2.15), card_w - Inches(0.24), Inches(0.4))
        ptext(p.text_frame.paragraphs[0], product, size=13, bold=True, color=PRIMARY, align=PP_ALIGN.CENTER, after=0)

        # divider
        rect(slide, x + Inches(0.25), top + Inches(2.7), card_w - Inches(0.5), Inches(0.015), NEUTRAL_200)

        d = textbox(slide, x + Inches(0.18), top + Inches(2.9), card_w - Inches(0.36), Inches(1.7))
        ptext(d.text_frame.paragraphs[0], desc, size=11, color=NEUTRAL_600, align=PP_ALIGN.CENTER, after=0)

        f = textbox(slide, x + Inches(0.18), top + Inches(4.7), card_w - Inches(0.36), Inches(0.55))
        ptext(f.text_frame.paragraphs[0], footnote, size=10, color=NEUTRAL_500, align=PP_ALIGN.CENTER, after=0)


def slide_comparison(prs):
    """Material comparison with product logos and crimson rating dots."""
    slide = content_slide(prs, "Material comparison", None, center_title=True)

    columns = ["Flex Trim", "Zzz Flex", "Ultra-Flex", "Ultra-Fire Flex", "Machinable S4S"]
    logos = [
        ASSETS / "logo-flex-trim-product.jpg",
        ASSETS / "logo-zzz-flex.png",
        ASSETS / "logo-ultra-flex.png",
        ASSETS / "logo-ultra-fire-flex.png",
        ASSETS / "logo-machinable-s4s.png",
    ]
    rows = [
        ("Flexibility", ["OOO", "OOOO", "OO", "OO", "OO"]),
        ("Paintability", ["OOOO", "OOOO", "OOOO", "OOOO", "OOOO"]),
        ("Stainability", ["OOOO", "OOOO", "OOOO", "OOOO", "N/A"]),
        ("Lightweight", ["OO", "OO", "OOOO", "OOOO", "OOOO"]),
        ("Machinability", ["OO", "OO", "OOO", "OOO", "OOOO"]),
        ("Moisture & insect", ["OOOO", "OOOO", "OOOO", "OOOO", "OOOO"]),
        ("Interior & exterior", ["OOOO", "OOOO", "OOOO", "OOOO", "OOOO"]),
        ("Extended lengths", ["X", "X", "N/A", "N/A", "N/A"]),
        ("Plant", ["NC & UT", "NC & UT", "UT", "UT", "UT"]),
        ("Warranty", ["Lifetime", "Lifetime", "Lifetime", "Lifetime", "Lifetime"]),
    ]

    # Card container
    card_left, card_top = MARGIN, Inches(0.95)
    card_w, card_h = Inches(12.2), Inches(5.85)
    rect(slide, card_left, card_top, card_w, card_h, WHITE, NEUTRAL_200, rounded=True)

    label_w = Inches(2.35)
    col_w = (card_w - label_w) / 5
    header_h = Inches(0.85)
    row_h = Inches(0.42)
    legend_h = Inches(0.55)

    # header logos
    for i, logo in enumerate(logos):
        x = card_left + label_w + i * col_w
        if logo.exists():
            # contain within column
            picture(slide, logo, x + Inches(0.15), card_top + Inches(0.18), width=col_w - Inches(0.3))

    rect(slide, card_left, card_top + header_h, card_w, Inches(0.015), NEUTRAL_200)

    def rating_cell(value, cx, cy):
        if value in {"OO", "OOO", "OOOO", "O"}:
            count = len(value)
            dot = Inches(0.12)
            gap = Inches(0.05)
            total = count * dot + (count - 1) * gap
            start = cx - total / 2
            for i in range(count):
                oval(slide, start + i * (dot + gap), cy - dot / 2, dot, dot, PRIMARY)
        elif value.upper() == "X":
            # checkmark via text
            t = textbox(slide, cx - Inches(0.15), cy - Inches(0.12), Inches(0.3), Inches(0.24))
            ptext(t.text_frame.paragraphs[0], "✓", size=12, bold=True, color=PRIMARY, align=PP_ALIGN.CENTER, after=0)
        elif value == "N/A":
            t = textbox(slide, cx - Inches(0.35), cy - Inches(0.12), Inches(0.7), Inches(0.24))
            ptext(t.text_frame.paragraphs[0], "N/A", size=10, color=NEUTRAL_400, align=PP_ALIGN.CENTER, after=0)
        else:
            t = textbox(slide, cx - Inches(0.55), cy - Inches(0.12), Inches(1.1), Inches(0.24))
            ptext(t.text_frame.paragraphs[0], value, size=10, bold=True, color=NEUTRAL_700, align=PP_ALIGN.CENTER, after=0)

    for r, (label, values) in enumerate(rows):
        y = card_top + header_h + r * row_h
        if r % 2 == 1:
            rect(slide, card_left + Inches(0.02), y, card_w - Inches(0.04), row_h, NEUTRAL_50)
        # sticky-style label
        lb = textbox(slide, card_left + Inches(0.15), y + Inches(0.08), label_w - Inches(0.2), Inches(0.3))
        color = PRIMARY if label in {"Extended lengths", "Warranty"} else NEAR_BLACK
        ptext(lb.text_frame.paragraphs[0], label, size=11, bold=True, color=color, after=0)
        for c, val in enumerate(values):
            cx = card_left + label_w + c * col_w + col_w / 2
            cy = y + row_h / 2
            rating_cell(val, cx, cy)

    # legend footer
    ly = card_top + card_h - legend_h
    rect(slide, card_left, ly, card_w, legend_h, NEUTRAL_50)
    legend = [("●", "Basic"), ("●●", "Standard"), ("●●●", "Premium"), ("●●●●", "Elite")]
    # draw real dots for legend
    lx = card_left + Inches(0.35)
    for count, label in [(1, "Basic"), (2, "Standard"), (3, "Premium"), (4, "Elite")]:
        for i in range(count):
            oval(slide, lx + i * Inches(0.16), ly + Inches(0.2), Inches(0.12), Inches(0.12), PRIMARY)
        t = textbox(slide, lx + count * Inches(0.16) + Inches(0.08), ly + Inches(0.16), Inches(1.1), Inches(0.25))
        ptext(t.text_frame.paragraphs[0], label, size=11, color=NEUTRAL_700, after=0)
        lx += Inches(2.2)


def slide_timeline(prs, items):
    """Two-column timeline on a single slide — date · dot · wrapping card text."""
    slide = content_slide(prs, "Our legacy of innovation", "1963 – present", center_title=True)

    cols = 2
    per_col = (len(items) + cols - 1) // cols
    top = Inches(1.0)
    bottom = Inches(6.95)
    available = bottom - top
    row_h = available / per_col
    col_w = Inches(6.05)
    gap = Inches(0.2)
    date_w = Inches(1.15)
    dot_size = Inches(0.16)

    for col in range(cols):
        col_items = items[col * per_col : (col + 1) * per_col]
        col_left = MARGIN + col * (col_w + gap)
        line_x = col_left + date_w + Inches(0.12)
        if col_items:
            line_h = row_h * (len(col_items) - 1) + Inches(0.2)
            rect(slide, line_x - Inches(0.008), top + Inches(0.12), Inches(0.016), line_h, NEUTRAL_200)

        for i, (date, text) in enumerate(col_items):
            y = top + i * row_h
            d = textbox(slide, col_left, y + Inches(0.06), date_w, Inches(0.45))
            ptext(d.text_frame.paragraphs[0], date, size=11, bold=True, color=PRIMARY, align=PP_ALIGN.RIGHT, after=0)

            oval(slide, line_x - dot_size / 2, y + Inches(0.1), dot_size, dot_size, WHITE, PRIMARY)
            oval(
                slide,
                line_x - Inches(0.035),
                y + Inches(0.13),
                Inches(0.07),
                Inches(0.07),
                PRIMARY,
            )

            card_left = line_x + Inches(0.16)
            card_w = col_left + col_w - card_left
            card_h = row_h - Inches(0.08)
            rect(slide, card_left, y, card_w, card_h, NEUTRAL_50, NEUTRAL_200, rounded=True)
            tb = textbox(slide, card_left + Inches(0.12), y + Inches(0.06), card_w - Inches(0.22), card_h - Inches(0.1))
            enable_wrap(tb.text_frame)
            ptext(tb.text_frame.paragraphs[0], text, size=10, color=NEUTRAL_600, after=0)


def slide_locations(prs):
    slide = content_slide(prs, "Service coverage by state", "Two-coast manufacturing — shorter lead times, local support", center_title=True)

    map_path = PUBLIC / "company-info" / "state-vs-facility.png"
    # Map left-ish
    map_left, map_top = Inches(0.4), Inches(1.05)
    map_w = Inches(8.6)
    if map_path.exists():
        picture(slide, map_path, map_left, map_top, width=map_w)

    # Legend on right of map
    legend = [
        (RGBColor(0xD9, 0xD9, 0xD9), False, "Served by both NC and UT facilities"),
        (WHITE, True, "Served by NC facility"),
        (RGBColor(0x96, 0x96, 0x96), False, "Served by UT facility"),
    ]
    lx, ly = Inches(9.3), Inches(1.8)
    for fill, bordered, label in legend:
        sw = rect(slide, lx, ly, Inches(0.35), Inches(0.35), fill, NEUTRAL_400 if bordered else RGBColor(0xC0, 0xC0, 0xC0), rounded=False)
        t = textbox(slide, lx + Inches(0.5), ly, Inches(3.3), Inches(0.5))
        ptext(t.text_frame.paragraphs[0], label, size=12, bold=True, color=NEAR_BLACK, after=0)
        ly += Inches(0.7)

    # Facility cards bottom
    facilities = [
        ("Flex Trim East", ["117 Cedar Lane Drive", "Lexington, NC 27292"], "(800) 861-0734", ["orders@carterflex.com", "support@carterflex.com"]),
        ("Flex Trim West", ["533 South 500 West", "Provo, UT 84601"], "(877) 877-4595", ["orders@flextrim.com"]),
    ]
    for i, (name, addr, phone, emails) in enumerate(facilities):
        x = MARGIN + i * Inches(6.2)
        y = Inches(5.55)
        w = Inches(5.95)
        h = Inches(1.45)
        # both emphasized equally for master deck
        rect(slide, x, y, w, h, SOFT_RED if i == 0 else NEUTRAL_50, PRIMARY if i == 0 else NEUTRAL_200, rounded=True)
        t = textbox(slide, x + Inches(0.2), y + Inches(0.12), w - Inches(0.4), Inches(0.3))
        ptext(t.text_frame.paragraphs[0], name, size=14, bold=True, color=NEAR_BLACK, after=0)
        body = textbox(slide, x + Inches(0.2), y + Inches(0.42), w - Inches(0.4), Inches(0.95))
        lines = [
            (", ".join(addr), {"size": 11, "color": NEUTRAL_600, "after": 2}),
            (phone, {"size": 12, "bold": True, "color": PRIMARY, "after": 2}),
        ]
        for em in emails:
            lines.append((em, {"size": 11, "color": PRIMARY, "after": 1}))
        write_lines(body.text_frame, lines)


def slide_who_we_are(prs):
    slide = content_slide(prs, "The industry leaders in flexible moulding")
    bullets(
        slide,
        [
            "Carter Millwork, Inc. unites Flex Trim™, Carter Millwork, Ultra-Flex, Zago, Flexible Moulding International, and Flexgrain",
            "Second-generation, family-owned — Lexington, North Carolina",
            "Hands-on management; we never make a promise we cannot keep",
            "Largest flexible moulding supplier — primary goal is to be the best",
            "AWI supplier member since 2012",
            "Trusted from multi-million-dollar estates to historic church restorations",
        ],
        top=Inches(1.15),
        width=Inches(9.2),
        size=14,
    )
    usa = PUBLIC / "company-info" / "made-in-usa.jpg"
    awi = PUBLIC / "logos" / "awi.png"
    if usa.exists():
        picture(slide, usa, Inches(10.3), Inches(1.4), width=Inches(2.3))
    if awi.exists():
        picture(slide, awi, Inches(10.5), Inches(3.0), width=Inches(1.9))


# ---------- Build ----------

def build():
    if not (ASSETS / "badge-benefit-expertise.png").exists():
        raise SystemExit("Run scripts/prepare-pptx-assets.py first.")

    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    blank = prs.slide_layouts[6]

    # TITLE
    s = prs.slides.add_slide(blank)
    rect(s, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    add_top_accent(s)
    ft = PUBLIC / "logos" / "flex-trim.jpg"
    cm = ASSETS / "carter-millwork.png"
    if not cm.exists():
        cm = ROOT / "Project_Info" / "_pptx_assets" / "carter-millwork.png"
    if ft.exists():
        picture(s, ft, MARGIN, Inches(1.7), height=Inches(0.95))
    if cm.exists():
        picture(s, cm, Inches(5.3), Inches(1.95), height=Inches(0.5))
    t = textbox(s, MARGIN, Inches(3.1), Inches(11), Inches(0.6))
    ptext(t.text_frame.paragraphs[0], "Product & Process Review", size=34, bold=True, color=NEAR_BLACK, after=0)
    sub = textbox(s, MARGIN, Inches(3.75), Inches(10), Inches(0.7))
    ptext(sub.text_frame.paragraphs[0], "Master overview for new and existing customers.\nCurved trim made easy.", size=15, color=NEUTRAL_600, after=0)
    usa = PUBLIC / "company-info" / "made-in-usa.jpg"
    awi = PUBLIC / "logos" / "awi.png"
    if usa.exists():
        picture(s, usa, Inches(10.5), Inches(1.55), width=Inches(2.2))
    if awi.exists():
        picture(s, awi, Inches(10.75), Inches(2.65), width=Inches(1.7))
    add_bottom_accent(s, height=Inches(0.85))
    f = textbox(s, MARGIN, SLIDE_H - Inches(0.58), Inches(12), Inches(0.35))
    ptext(f.text_frame.paragraphs[0], "Made in USA  ·  AWI Supplier Member since 2012  ·  East (NC) & West (UT)", size=13, color=WHITE, after=0)

    # AGENDA
    s = content_slide(prs, "Agenda")
    two_col(
        s,
        [
            "Company history & locations",
            "Flex Trim™ product overview",
            "Flex Trim™ advantages",
            "Applications",
            "Material details & upgrades",
            "Stock items & stock list",
            "Production-ready profiles",
        ],
        [
            "Made-to-Match process",
            "Bullnose & tight radii",
            "What you need to order",
            "How to measure",
            "Installation",
            "Website tools & resources",
            "Warranty, returns & values",
        ],
        size=15,
    )

    # COMPANY
    section_slide(prs, "01  Company", "History & locations", "Family-owned. Two coasts. Industry leaders in flexible moulding.")
    slide_who_we_are(prs)
    slide_timeline(prs, TIMELINE)
    slide_locations(prs)

    # PRODUCT + ADVANTAGES
    section_slide(prs, "02  Product", "Flex Trim™ overview & advantages")
    s = content_slide(prs, "Flex Trim™ product overview", "The look of custom wood at a fraction of the cost")
    bullets(
        s,
        [
            "Polyurethane flexible moulding for places rigid wood cannot bend",
            "Replicates complex profiles, decorative accessories, and wood grain",
            "Flex Trim™ = original polymer resin blend — default for most jobs",
            "Paint-grade always; many profiles stainable",
            "Interior & exterior (with exterior coating) · Lifetime warranty",
            "250+ stock · 40,000+ tooled profiles · Made-to-Match",
        ],
        size=15,
    )
    slide_advantages(prs)
    slide_advantages_list(prs)

    # APPLICATIONS
    section_slide(prs, "03  Applications", "Where Flex Trim™ is used", "Image boards — add or swap photos as needed.")
    applications = [
        ("arched-radius-casing", "Arched & radius casing", "Pre-bent casing for arched doorways and round windows"),
        ("curved-walls", "Curved walls", "Flexible base, chair rail, and crown for staircases and radius walls"),
        ("vaulted-domed-ceilings", "Vaulted & domed ceilings", "Pre-bent crown for changing pitches, barrel vaults, and domes"),
        ("decorative-applied-mouldings", "Decorative applied mouldings", "Panels, curved wainscoting, geometric applied details"),
        ("historical-reproductions", "Historical reproductions", "Match antique / hard-to-find profiles and accessories"),
        ("stained-flex-trim", "Stained Flex Trim™", "Stain-grade installs showing species grain"),
        ("outdoor-installations", "Outdoor installations", "Exterior trim with proper exterior coating"),
        ("on-the-job-site", "On the job site", "Install context and field conditions"),
        ("featured", "Featured projects", "Standout and creator / media features"),
    ]
    for cat, title, subtitle in applications:
        s = content_slide(prs, title, subtitle)
        imgs = gallery_images(cat, 8)
        if not imgs and cat == "historical-reproductions":
            overview = PUBLIC / "product-info" / "product-overview" / "historical-reproductions.jpg"
            imgs = [overview] if overview.exists() else []
        image_grid(s, imgs)

    # MATERIALS
    section_slide(prs, "04  Materials", "Material details & upgrades", "Choose the formulation that fits the job.")
    s = content_slide(prs, "Material details", "Flex Trim™ base material")
    left = [
        "Flex Trim™ — original polymer resin / polyurethane blend",
        "Default choice for most applications",
        "Durable, consistent, cost-effective",
        "Paint-grade; many stainable",
        "Interior & exterior rated · NC & UT · Lifetime warranty",
    ]
    right = [
        "Specialized upgrades:",
        "Zzz Flex® — max flexibility",
        "Ultra-Flex — 40–50% lighter (UT)",
        "Ultra-Fire Flex — ASTM E84 Class B (UT)",
        "Machinable S4S — mill short straight runs (UT)",
        "Xtrulinear® — continuous 12'–500' spools",
    ]
    two_col(s, left, right, size=14)
    ec1 = PUBLIC / "product-info" / "ec1.jpg"
    # keep text clean

    slide_upgrades_overview(prs)

    # Detail slides for each upgrade with large badge
    for badge_key, title, product, desc, footnote in UPGRADES:
        s = content_slide(prs, product, title)
        badge = ASSETS / f"badge-{badge_key}.png"
        if badge.exists():
            picture(s, badge, MARGIN, Inches(1.3), height=Inches(1.15))
        body = textbox(s, Inches(2.0), Inches(1.4), Inches(10.5), Inches(1.2))
        write_lines(
            body.text_frame,
            [
                (desc, {"size": 16, "color": NEUTRAL_600, "after": 10}),
                (footnote, {"size": 13, "color": NEUTRAL_500, "after": 0}),
            ],
        )
        extras = {
            "Zzz Flex®": [
                "Highest flexibility rating in the family",
                "Best for small / intricate patterns, tight radii, cold climates",
                "Available as Xtrulinear® extended lengths",
                "Lifetime warranty",
            ],
            "Ultra-Flex": [
                "Syntactic polyurethane — 40–50% lighter than standard Flex Trim™",
                "Pre-primed for finishing · back-sanded for glue adhesion",
                "Indoor or outdoor · not available as extended lengths",
                "Lifetime warranty",
            ],
            "Ultra-Fire Flex": [
                "ASTM E84 tested — Class B flame spread",
                "Confirm application / specification with our team",
                "Tech docs available in Resources",
                "Lifetime warranty",
            ],
            "Machinable S4S": [
                "Thickness ½\"–2\" · Width 1¾\"–16\" · Length 8'–12'",
                "Paint grade only · bending style 1 only for recommended curved uses",
                "Cannot generally be used for radius casing, crown, or style 2 bends",
                "Machines like MDF; carbide preferred; feed 15–30 fpm",
            ],
            "Xtrulinear®": [
                "Flex Trim™ or Zzz Flex® · 12' to 500' on a spool",
                "Typically ~30% premium · ships LTL / pallet only",
                "Straight pieces only — style 2 cannot be spooled",
                "Oversized profiles / lengths may be coiled in a box",
            ],
        }.get(product, [])
        if extras:
            bullets(s, extras, top=Inches(3.0), size=14)

    s = content_slide(prs, "Xtrulinear® spool capacity", "Approximate feet per spool by profile size")
    # simple 4 cards
    spool = [("500'", '¾" × ¾"'), ("250'", '½" × 2"'), ("100'", '¾" × 2¼"'), ("75'", '¾" × 3½"')]
    for i, (ft_len, size) in enumerate(spool):
        x = MARGIN + i * Inches(3.1)
        rect(s, x, Inches(1.4), Inches(2.9), Inches(2.2), WHITE, NEUTRAL_200, rounded=True)
        a = textbox(s, x, Inches(1.7), Inches(2.9), Inches(0.6))
        ptext(a.text_frame.paragraphs[0], ft_len, size=28, bold=True, color=PRIMARY, align=PP_ALIGN.CENTER, after=0)
        b = textbox(s, x, Inches(2.5), Inches(2.9), Inches(0.5))
        ptext(b.text_frame.paragraphs[0], size, size=14, color=NEUTRAL_600, align=PP_ALIGN.CENTER, after=0)
    coil = PUBLIC / "product-info" / "coils" / "EC127-COIL.jpg"
    if coil.exists():
        picture(s, coil, Inches(4.5), Inches(4.0), height=Inches(2.6))

    slide_comparison(prs)

    s = content_slide(prs, "Stainable Flex Trim™", "Grain, finish, and handling")
    two_col(
        s,
        [
            "Mold process reproduces stain-grade wood species / grain from the sample",
            "Grain is surface-only (embossed)",
            "Finish with heavy-bodied gel stain only, then clear coat",
            "Do not sand stain-grade — removes grain permanently",
            "Cannot invent or change grain from a sample / existing mold",
        ],
        [
            "We supply raw unstained flex; customer chooses stain color",
            "Example grains: Knotty Alder, Mahogany, Maple",
            "Gel on resin dries slower than wood — fully dry before next coat",
            "Contact us for available stain-grade profiles",
        ],
        size=13,
    )

    # CATALOG PATHS
    section_slide(prs, "05  Catalog paths", "Stock · Profiles · Made-to-Match")
    s = content_slide(prs, "Stock items", "250+ configurations ready to ship")
    bullets(
        s,
        [
            "250+ part configurations on the shelf for immediate shipping",
            "Usually ships within 24 hours of receiving the order",
            "Categories: Back band · Base · Base cap · Brick mould · Casing · Chair rail · Corner & cove · Crown · Flat stock / S4S · Miscellaneous · Panel mould · Rake · Shoe & quarter round · Stop",
            "Browse online or use the printable stock list (Carter Millwork Stock List.pdf)",
        ],
        size=14,
    )

    s = content_slide(prs, "Stock browser & printable stock list")
    two_col(
        s,
        [
            "Website: Products → Browse stock items",
            "Filter by moulding section / configuration",
            "View part details, bending notes, and order paths",
        ],
        [
            "Printable PDF: Carter Millwork Stock List.pdf",
            "Also under Resources → Stock list",
            "Keep a copy on the truck / in the showroom",
        ],
        size=14,
    )

    s = content_slide(prs, "Production-ready profiles", "40,000+ tooled profiles for custom applications")
    bullets(
        s,
        [
            "Growing library of 40,000+ tooled profiles ready for custom production",
            "Catalog / website shows a fraction of available profiles",
            "Lead times: existing mold ≤ ~2 weeks · new mold ≤ ~3 weeks",
            "Browse by moulding type — 40+ types from Apron to Tongue & groove",
        ],
        size=15,
    )

    s = content_slide(prs, "Profile browser — moulding types")
    bullets(
        s,
        [
            "Website: Products → Browse / select profiles",
            "Search by moulding type, dimensions, and keywords",
            "Apron, Astragal, Back band, Base, Base cap, Bed mould, Brick mould, Bullnose, Cabinet lip mould, Casing, Chair rail, Chair rail backer, Chamfer, Corner, Cove, Crown, Crown backer, Decorative, Dentil, E1E, E2E, Flat stock, Frieze, Half-round, Hand rail, Mantle, Miscellaneous, Mullion, Panel mould, Pencil mould, Picture mould, Quarter round, Rake, Rope, Screen bead, Shoe, Solid back crown, Stool, Stop, Tongue & groove",
        ],
        size=12,
    )

    s = content_slide(prs, "Made-to-Match", "Copy your unique or historic profile")
    two_col(
        s,
        [
            "1. Send rigid moulding (any material)",
            "2. We create a precision custom mold",
            "3. We ship matching flexible parts",
            "",
            "If checking inventory first, provide:",
            "To-scale drawing or tracing · thickness & width",
            "Supplier + profile name · wood species / material",
        ],
        [
            "Physical model generally required (except simple flats)",
            "Max part length = mold / model length · standard mold 12 ft",
            "Packages > 8 ft may ship as joined pieces; stain shows splice",
            "Also copies accessories (corbels, carvings, etc.)",
            "Lead times: stock 24 hrs · existing ≤2 wks · new ≤3 wks",
        ],
        size=12,
    )

    s = content_slide(prs, "Bullnose corners & tight radii")
    bullets(
        s,
        [
            "Virtually no radius limitations via alternative tooling — down to a “zero” radius miter cut",
            "Tight-radius items are paint grade only (finish like primed poplar)",
            "Requires special tooling — discuss with Flex Trim before quoting or ordering",
            "Straight pieces should never be used for bullnose corners",
            "Warranty excludes bullnose / tight-radius ordered as straight pieces",
        ],
        size=14,
    )

    # ORDERING
    section_slide(prs, "06  Ordering", "What you need to order")
    s = content_slide(prs, "Who is ordering?")
    audiences = [
        ("Architects / designers", "Specify profiles, radii, materials; catalog, drawings, quote request"),
        ("Contractors / builders", "Install-ready parts via dealers & online; pin nails + polyurethane adhesive"),
        ("Dealers / distributors", "Stock + custom programs; East/West order contacts"),
        ("Homeowners", "Buy via dealers / online retailers (availability varies)"),
        ("Existing customers", "Reorder by part # / account; order status tool"),
        ("Shared outcome", "~70% less than traditional machined radiused wood millwork"),
    ]
    for i, (title, body) in enumerate(audiences):
        r, c = divmod(i, 3)
        x = MARGIN + c * Inches(4.15)
        y = Inches(1.2) + r * Inches(2.5)
        rect(s, x, y, Inches(4.0), Inches(2.25), WHITE, NEUTRAL_200, rounded=True)
        t = textbox(s, x + Inches(0.2), y + Inches(0.25), Inches(3.6), Inches(0.4))
        ptext(t.text_frame.paragraphs[0], title, size=14, bold=True, color=PRIMARY, after=0)
        b = textbox(s, x + Inches(0.2), y + Inches(0.75), Inches(3.6), Inches(1.2))
        ptext(b.text_frame.paragraphs[0], body, size=12, color=NEUTRAL_600, after=0)

    s = content_slide(prs, "Bending styles")
    for i, (title, body) in enumerate(
        [
            ("Style #1 — Straight pieces", "Bent “long-ways” against the thin dimension (like a belt).\n\nExamples: base, base cap, base shoe, chair rail, jamb.\n\nFlexibility depends on thickness × width."),
            ("Style #2 — Pre-bent", "Bent “sideways” against the wide dimension (like a rainbow).\n\nExamples: casing, crown, crown ceiling backer.\n\nTypical min radius ≈ 3× profile width (up to ~3½\" wide)."),
        ]
    ):
        x = MARGIN + i * Inches(6.2)
        rect(s, x, Inches(1.2), Inches(5.95), Inches(5.2), WHITE, NEUTRAL_200, rounded=True)
        t = textbox(s, x + Inches(0.3), Inches(1.45), Inches(5.35), Inches(0.5))
        ptext(t.text_frame.paragraphs[0], title, size=16, bold=True, color=PRIMARY, after=0)
        b = textbox(s, x + Inches(0.3), Inches(2.15), Inches(5.35), Inches(3.8))
        ptext(b.text_frame.paragraphs[0], body, size=14, color=NEUTRAL_600, after=0)

    s = content_slide(prs, "Ordering — casing & pre-bent parts")
    bullets(
        s,
        [
            "Regular radius (half-round, eyebrow): no template — width & rise or length & radius",
            "Irregular (oval, elliptical): physical template required",
            "Default orientation: thick edge out — specify if thick edge in",
            "Default bend: entire piece to radius; miter where straight trim begins/ends",
            "Straight legs optional but must be requested; stock half-rounds ship without legs",
        ],
        size=14,
    )

    s = content_slide(prs, "Ordering — radius crown")
    bullets(
        s,
        [
            "Specify ISR (concave; bottom longer) or OSR (convex; top longer)",
            "Provide wall radius, ISR/OSR, backer offset, profile locations; sketch helpful",
            "Straight-radius-straight corners: prefer quarter-circle with legs disclosed up front",
            "Curved ceilings: tudor ski-slope looks OSR but is ISR; dormer/barrel vault look ISR but are OSR",
        ],
        size=14,
    )

    s = content_slide(prs, "Quote request essentials")
    two_col(
        s,
        [
            "Applications: Doorway, Window, Baseboard, Crown, Panel/Chair Rail, Accessory, Other",
            "Arch styles: Half-round, Eyebrow, Elliptical, Radius Corners, Gothic, Straight, Other, Curved Wall",
            "Components: Casing, Jamb, Back Band, Brick Mould, Stop, Other",
            "Per profile: part #, thickness, width, painted/stained, grain, sides",
        ],
        [
            "Crown: ISR / OSR",
            "Contact: Business, Location, Name, Email, Phone, account Y/N",
            "Printable forms: Arc & Straight · Crown",
            "Lead times: stock 24 hrs · existing mold ≤2 wks · new mold ≤3 wks",
        ],
        size=12,
    )

    # MEASURE
    section_slide(prs, "07  Measure", "How to measure")
    s = content_slide(prs, "How to measure — what we need", "1 of 3")
    bullets(
        s,
        [
            "Provide radius, length, and shape — plus any straight legs",
            "Regular arcs: dimensions enough to quote and produce",
            "Irregular curves: dimensions for quote; template required to order",
            "Printable gauges (Actual / 100%): Radius Gauge · Bullnose Corner Radius Gauge",
        ],
        size=15,
    )
    s = content_slide(prs, "How to measure — radius casing", "2 of 3")
    bullets(
        s,
        [
            "Shapes: Half-round · Eyebrow · Quarter round · Elliptical · Circle · Oval",
            "Elliptical & Oval: dimensions to quote; template to order",
            "Circles = two half-rounds · Ovals = top and bottom halves",
        ],
        size=15,
    )
    s = content_slide(prs, "How to measure — crown, corners & tight spots", "3 of 3")
    bullets(
        s,
        [
            "ISR / OSR crown and corners — measure width, rise, radiused length",
            "Bullnose: straight edge or printable bullnose gauge",
            "Minimum radius check: fold paper to 5.5\" width; measure rise from center to curve",
        ],
        size=15,
    )

    # INSTALL
    section_slide(prs, "08  Install", "Installation")
    s = content_slide(prs, "Installation — prepare & machine")
    two_col(
        s,
        [
            "Unroll / relax; verify profile",
            "Warm to ~80°F — never open flame",
            "Clean with mineral spirits or soap & water",
            "Flat mounting surface required",
            "Paint / stain only after installation",
        ],
        [
            "Standard woodworking tools",
            "Router: shallow passes",
            "Prefer slower blade speeds",
            "Never sand or shape stain-grade",
        ],
        size=14,
    )
    s = content_slide(prs, "Installation — fasten & finish")
    two_col(
        s,
        [
            "Floating crown: blocking every 4–8\"",
            "Adhesive: PL Premium Max (or equivalent) — never wood glue",
            "Pin nails preferred; never staples",
            "Don’t force into place",
        ],
        [
            "Bondo-like fillers; standard caulk for seams",
            "Any int/ext paint except pre-catalyzed epoxy",
            "Stain: gel only + clearcoat",
            "Install videos on the website",
        ],
        size=14,
    )

    # TOOLS
    section_slide(prs, "09  Website", "Tools & resources")
    s = content_slide(prs, "Length & radius calculator")
    bullets(
        s,
        [
            "Shapes: Eyebrow · Half-round · Elliptical · Full circle · Oval · Radius-only crown",
            "Inputs: Width / Height / Rise / Diameter / Straight Legs",
            "Outputs: required length (+ optional exact / radius)",
        ],
        left=MARGIN,
        top=Inches(1.2),
        width=Inches(6.5),
        size=14,
    )
    rect(s, Inches(7.4), Inches(1.2), Inches(5.3), Inches(5.0), NEUTRAL_50, NEUTRAL_200, rounded=True)
    ph = textbox(s, Inches(7.4), Inches(3.4), Inches(5.3), Inches(0.4))
    ptext(ph.text_frame.paragraphs[0], "Add calculator screenshot", size=13, color=NEUTRAL_400, align=PP_ALIGN.CENTER, after=0)

    s = content_slide(prs, "Check order status")
    two_col(
        s,
        [
            "Required: billing ZIP",
            "Plus: sales order # or PO #",
            "6-digit SO numbers padded to 7",
        ],
        [
            "East: (800) 861-0734",
            "West: (877) 877-4595",
            "Add order-status screenshot",
        ],
        size=14,
    )

    s = content_slide(prs, "Resources")
    resources = [
        ("Brochure", "Carter Millwork Brochure.pdf"),
        ("Catalog", "Carter Millwork Catalog.pdf"),
        ("Stock list", "Carter Millwork Stock List.pdf"),
        ("Technical data", "Product Data Sheet · MSDS · LEED · Prop 65"),
        ("Order forms", "Arc & Straight · Crown"),
        ("Radius gauges", "Radius Gauge · Bullnose Corner Radius Gauge"),
        ("Fire / rating docs", "Ultra-Fire Class B · Ultra-Flex Class C · Flex Trim fire-rated"),
    ]
    for i, (title, body) in enumerate(resources):
        y = Inches(1.15) + i * Inches(0.7)
        rect(s, MARGIN, y, Inches(12.2), Inches(0.6), WHITE if i % 2 == 0 else NEUTRAL_50, NEUTRAL_200, rounded=True)
        t = textbox(s, MARGIN + Inches(0.25), y + Inches(0.15), Inches(2.8), Inches(0.35))
        ptext(t.text_frame.paragraphs[0], title, size=13, bold=True, color=PRIMARY, after=0)
        b = textbox(s, Inches(3.6), y + Inches(0.15), Inches(8.8), Inches(0.35))
        ptext(b.text_frame.paragraphs[0], body, size=12, color=NEUTRAL_600, after=0)

    # POLICIES
    section_slide(prs, "10  Policies", "Warranty & returns")
    s = content_slide(prs, "Limited lifetime warranty")
    two_col(
        s,
        [
            "Manufacturing defects in materials / workmanship for the lifetime of the product",
            "Non-transferable; original installation only",
            "Remedy: replace or refund purchase price — no labor",
            "Claim within 60 days of discovering defect",
            "orders@carterflex.com · (800) 861-0734",
        ],
        [
            "Key exclusions:",
            "Ellipticals ordered as eyebrow arcs",
            "Bullnose / tight-radius ordered as straight",
            "Style 2 / crown ordered straight without approval",
            "Painted/stained before install; sanded before stain",
            "Staples / incompatible adhesives",
        ],
        size=12,
    )

    s = content_slide(prs, "Returns")
    bullets(
        s,
        [
            "Contact before shipping anything back — RMA required",
            "Stock (unused + resellable): return freight + 25% restocking",
            "Custom: not eligible; rare case-by-case → freight + 30–50% if approved",
            "Manufacturing defects → limited lifetime warranty",
        ],
        size=15,
    )

    # CLOSING
    section_slide(prs, "11  Closing", "Our values")
    s = content_slide(prs, "Our values")
    bullets(
        s,
        [
            "We grow carefully — never promise what we cannot deliver",
            "Goal: not the biggest — the best",
            "Treat people the way you want to be treated",
            "Do the right thing the first time, and do it on time",
            "If you make a mistake, fix it immediately",
            "Say what you are going to do, and do what you say",
            "Nothing falls into “it’s not my job”",
        ],
        size=14,
    )

    s = content_slide(prs, "Message from the CEO")
    box = textbox(s, MARGIN, Inches(1.4), Inches(12.2), Inches(4.5))
    write_lines(
        box.text_frame,
        [
            (
                "What we are most proud of is hearing from customers that we are among their best suppliers — that when they place an order with us, it arrives on time and the parts are right the first time. And if we do make a mistake, we jump through hoops to make it right.",
                {"size": 17, "color": NEUTRAL_600, "after": 18},
            ),
            (
                "Our objective is to stay out of sight and out of mind from the moment an order is placed until the customer is ready to place the next one.",
                {"size": 17, "color": NEUTRAL_600, "after": 24},
            ),
            ("We never make a promise we cannot keep.", {"size": 20, "bold": True, "color": PRIMARY, "after": 20}),
            ("— Greg Carter, CEO · Carter Millwork / Flex Trim™", {"size": 13, "color": NEUTRAL_400, "after": 0}),
        ],
    )

    s = prs.slides.add_slide(blank)
    rect(s, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    add_top_accent(s)
    t = textbox(s, MARGIN, Inches(2.0), Inches(12), Inches(0.6))
    ptext(t.text_frame.paragraphs[0], "Thank you", size=40, bold=True, color=NEAR_BLACK, after=0)
    sub = textbox(s, MARGIN, Inches(2.7), Inches(12), Inches(0.4))
    ptext(sub.text_frame.paragraphs[0], "Let’s specify the next curve together.", size=16, color=NEUTRAL_600, after=0)
    for i, (name, lines) in enumerate(
        [
            ("Flex Trim East", ["Lexington, NC", "(800) 861-0734", "orders@carterflex.com"]),
            ("Flex Trim West", ["Provo, UT", "(877) 877-4595", "orders@flextrim.com"]),
        ]
    ):
        x = MARGIN + i * Inches(6.2)
        rect(s, x, Inches(3.6), Inches(5.95), Inches(2.0), WHITE, NEUTRAL_200, rounded=True)
        tb = textbox(s, x + Inches(0.3), Inches(3.85), Inches(5.35), Inches(1.6))
        write_lines(
            tb.text_frame,
            [(name, {"size": 16, "bold": True, "color": PRIMARY, "after": 6})]
            + [(ln, {"size": 13, "color": NEUTRAL_600, "after": 3}) for ln in lines],
        )
    add_bottom_accent(s, height=Inches(0.7))
    f = textbox(s, MARGIN, SLIDE_H - Inches(0.48), Inches(12), Inches(0.3))
    ptext(f.text_frame.paragraphs[0], "flextrim.com  ·  Made in USA  ·  AWI Supplier Member", size=13, color=WHITE, after=0)

    # Final pass: every text frame wraps inside its box
    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            enable_wrap(shape.text_frame)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(OUT))
    print(f"Wrote {OUT}")
    print(f"Slides: {len(prs.slides)}")


if __name__ == "__main__":
    build()
