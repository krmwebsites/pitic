"""
Valmistab Pitici brändifailid originaallogodest (pitic.ee).
Originaalid: tools/source/pitic-lockup-original.png, tools/source/pitic-mark-original.png

Skript ei joonista logo ümber ega muuda selle proportsioone. Ta ainult:
  * kärbib ära tühja lõuendi logo ümbert (kunstiteos ise jääb puutumata),
  * eraldab roosetist ühtlase heleda tausta (alfakanal),
  * mastaabib proportsioone säilitades ikoonideks ja OG-pildiks.

Käivita:  python tools/build-brand-assets.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "source"
BRAND = ROOT / "public" / "brand"
APP = ROOT / "src" / "app"
FONTS = SRC / "fonts"

INK = (20, 18, 16)
INK_2 = (87, 83, 76)
PAPER = (242, 241, 237)
PUNANE = (195, 25, 35)
RULE = (213, 210, 202)


def trim_alpha(im: Image.Image) -> Image.Image:
    """Kärbib läbipaistva ääre. Proportsioonid ei muutu — ainult lõuend."""
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def key_out_background(im: Image.Image, bg=(249, 249, 249), fg_green=27) -> Image.Image:
    """Eraldab ühtlase heleda tausta punaselt märgilt ja taastab alfakanali."""
    im = im.convert("RGBA")
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    src = im.load()
    dst = out.load()
    span = bg[1] - fg_green
    for y in range(h):
        for x in range(w):
            r, g, b, _ = src[x, y]
            a = (bg[1] - g) / span
            a = 0.0 if a < 0 else (1.0 if a > 1 else a)
            if a <= 0.004:
                dst[x, y] = (0, 0, 0, 0)
                continue
            px = []
            for c, bgc in zip((r, g, b), bg):
                v = (c - bgc * (1 - a)) / a
                px.append(0 if v < 0 else (255 if v > 255 else int(round(v))))
            dst[x, y] = (px[0], px[1], px[2], int(round(a * 255)))
    return out


def fit(im: Image.Image, width: int) -> Image.Image:
    if im.width == width:
        return im
    height = max(1, round(im.height * width / im.width))
    return im.resize((width, height), Image.LANCZOS)


def load_font(name: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONTS / name), size)
    if weight is not None:
        try:
            font.set_variation_by_axes([weight])
        except Exception:
            pass
    return font


def tracked(draw, xy, text, font, fill, tracking=0.0):
    """Joonistab teksti tähevahega (Pillow ei toeta letter-spacing't)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def measure_tracked(draw, text, font, tracking=0.0) -> float:
    if not text:
        return 0.0
    return sum(draw.textlength(c, font=font) for c in text) + tracking * (len(text) - 1)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)

    lockup = trim_alpha(Image.open(SRC / "pitic-lockup-original.png").convert("RGBA"))
    mark = trim_alpha(key_out_background(Image.open(SRC / "pitic-mark-original.png")))

    lockup.save(BRAND / "pitic-logo.png", optimize=True)
    mark.save(BRAND / "pitic-mark.png", optimize=True)
    print(f"pitic-logo.png  {lockup.size}")
    print(f"pitic-mark.png  {mark.size}")

    # --- rakenduse ikoonid -------------------------------------------------
    def square(src: Image.Image, size: int, pad_ratio: float, bg=None) -> Image.Image:
        inner = round(size * (1 - 2 * pad_ratio))
        art = src.copy()
        art.thumbnail((inner, inner), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), bg if bg else (0, 0, 0, 0))
        canvas.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))
        return canvas

    square(mark, 512, 0.10).save(APP / "icon.png", optimize=True)
    square(mark, 180, 0.14, PAPER + (255,)).convert("RGB").save(APP / "apple-icon.png", optimize=True)
    ico = square(mark, 64, 0.06)
    ico.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("icon.png / apple-icon.png / favicon.ico")

    # --- Open Graph -------------------------------------------------------
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(og)
    M = 84

    logo = fit(lockup, 300)
    og.paste(logo, (M, M - 6), logo)

    d.line([(M, 214), (W - M, 214)], fill=RULE, width=2)

    display = load_font("Jost.ttf", 74, 600)
    d.text((M, 258), "Ruumide rent", font=display, fill=INK)
    d.text((M, 344), "Keila kesklinnas", font=display, fill=INK)

    mono = load_font("IBMPlexMono.ttf", 24, 500)
    tracked(d, (M, 468), "JÕUSAAL · NÕUPIDAMISTE RUUM · SUURSAAL", mono, INK_2, 1.6)

    small = load_font("IBMPlexMono.ttf", 22, 500)
    tracked(d, (M, 512), "KESKVÄLJAK 15, KEILA", small, PUNANE, 1.6)

    big_mark = fit(mark, 300)
    og.paste(big_mark, (W - M - big_mark.width, H - M - big_mark.height + 10), big_mark)

    d.line([(M, H - 44), (W - M, H - 44)], fill=RULE, width=2)
    og.save(APP / "opengraph-image.png", optimize=True, quality=92)
    print(f"opengraph-image.png  {og.size}")


if __name__ == "__main__":
    main()
