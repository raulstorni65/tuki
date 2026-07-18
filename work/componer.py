"""
Compone, para cada par (marca, país), una imagen 16:9 lista para el slot
.producto-media del sitio:

    fondo degradado con el color de la marca
  + la gift card REAL (la que subió el usuario), con sombra
  + una chapa con la bandera del país y el nombre

Las banderas se dibujan con PIL (no dependemos de un renderer de SVG).
Salida: site/img/cards/{marca}-{iso}.webp
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

UP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "originales")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site", "img", "cards")
FONT_B = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FONT_M = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"

W, H = 1280, 720

# Imagen real subida por marca. Prime Video no tiene: se queda con el SVG dibujado.
CARDS = {
    "google-play": "google_play.webp",
    "netflix": "netflix.webp",
    "spotify": "spotify_card.png",
    "disney-plus": "disney_plus.png",
}

# Fondo elegido para que CADA tarjeta contraste (la de Netflix es blanca,
# la de Disney+ es azul oscuro, etc.)
BACKDROP = {
    "netflix":     ((74, 10, 16), (22, 3, 6)),
    "google-play": ((2, 147, 95), (0, 64, 46)),
    "spotify":     ((18, 61, 36), (4, 18, 10)),
    "disney-plus": ((201, 216, 255), (126, 155, 238)),
    "prime-video": ((150, 220, 244), (26, 122, 156)),
}
# ¿El fondo es claro? entonces el texto auxiliar va oscuro
LIGHT_BG = {"disney-plus", "prime-video"}

PAISES = {
    "AR": "Argentina", "PE": "Perú", "CL": "Chile",
    "CO": "Colombia", "MX": "México",
}


def gradiente(size, c1, c2):
    """Degradado diagonal suave."""
    w, h = size
    base = Image.new("RGB", (w, h), c1)
    top = Image.new("RGB", (w, h), c2)
    mask = Image.new("L", (w, h))
    md = mask.load()
    for y in range(h):
        for x in range(0, w, 4):
            v = int(255 * ((x / w) * 0.45 + (y / h) * 0.55))
            for dx in range(4):
                if x + dx < w:
                    md[x + dx, y] = min(255, v)
    base.paste(top, (0, 0), mask)
    return base


def brillo(img, cx, cy, r, alpha=46):
    """Halo radial claro, da profundidad al fondo."""
    glow = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(glow)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=alpha)
    glow = glow.filter(ImageFilter.GaussianBlur(r / 2.6))
    img.paste(Image.new("RGB", img.size, (255, 255, 255)), (0, 0), glow)
    return img


def puntitos(img, alpha=13, step=26):
    """Textura de puntos muy sutil."""
    layer = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(layer)
    for y in range(0, img.size[1], step):
        for x in range(0, img.size[0], step):
            d.ellipse([x, y, x + 2, y + 2], fill=alpha)
    img.paste(Image.new("RGB", img.size, (255, 255, 255)), (0, 0), layer)
    return img


def redondear(im, radio):
    """Aplica esquinas redondeadas a una imagen RGBA."""
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1],
                                           radius=radio, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def bandera(iso, w, h):
    """Dibuja la bandera del país, con esquinas redondeadas."""
    f = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    d = ImageDraw.Draw(f)
    if iso == "AR":
        d.rectangle([0, 0, w, h / 3], fill=(116, 172, 223))
        d.rectangle([0, 2 * h / 3, w, h], fill=(116, 172, 223))
        r = h * 0.17
        d.ellipse([w / 2 - r, h / 2 - r, w / 2 + r, h / 2 + r], fill=(246, 180, 14))
    elif iso == "PE":
        d.rectangle([0, 0, w / 3, h], fill=(217, 16, 35))
        d.rectangle([2 * w / 3, 0, w, h], fill=(217, 16, 35))
    elif iso == "CL":
        d.rectangle([0, h / 2, w, h], fill=(213, 43, 30))
        d.rectangle([0, 0, w / 3, h / 2], fill=(0, 57, 166))
        cx, cy, r = w / 6, h / 4, h * 0.13
        pts = []
        import math
        for i in range(10):
            ang = math.radians(-90 + i * 36)
            rr = r if i % 2 == 0 else r * 0.42
            pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
        d.polygon(pts, fill=(255, 255, 255))
    elif iso == "CO":
        d.rectangle([0, 0, w, h / 2], fill=(252, 209, 22))
        d.rectangle([0, h / 2, w, 3 * h / 4], fill=(0, 56, 147))
        d.rectangle([0, 3 * h / 4, w, h], fill=(206, 17, 38))
    elif iso == "MX":
        d.rectangle([0, 0, w / 3, h], fill=(0, 99, 65))
        d.rectangle([2 * w / 3, 0, w, h], fill=(200, 16, 46))
        r = h * 0.16
        d.ellipse([w / 2 - r, h / 2 - r, w / 2 + r, h / 2 + r],
                  outline=(139, 94, 52), width=max(2, int(h * 0.045)))
    return redondear(f, max(3, int(h * 0.12)))


def chapa(iso, oscuro_sobre_claro):
    """Pastilla blanca con la bandera + el nombre del país."""
    nombre = PAISES[iso]
    fb = ImageFont.truetype(FONT_B, 30)
    fm = ImageFont.truetype(FONT_M, 19)
    tw = ImageDraw.Draw(Image.new("RGB", (1, 1))).textlength(nombre, font=fb)
    lw = ImageDraw.Draw(Image.new("RGB", (1, 1))).textlength(f"Región {iso}", font=fm)
    fw, fh = 62, 42
    pad = 22
    ancho = int(pad + fw + 16 + max(tw, lw) + pad)
    alto = 92
    pill = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
    d = ImageDraw.Draw(pill)
    d.rounded_rectangle([0, 0, ancho - 1, alto - 1], radius=alto // 2,
                        fill=(255, 255, 255, 246))
    fl = bandera(iso, fw, fh)
    pill.paste(fl, (pad, (alto - fh) // 2), fl)
    d.text((pad + fw + 16, 18), nombre, font=fb, fill=(18, 21, 26))
    d.text((pad + fw + 16, 54), f"Región {iso}", font=fm, fill=(107, 114, 128))
    return pill


def tarjeta_prime_video(w=641, h=859):
    """Prime Video no tiene imagen real cargada: dibujamos una tarjeta propia
    en el mismo formato vertical que las demás, para que el set quede parejo."""
    card = Image.new("RGBA", (w, h), (26, 43, 61, 255))
    d = ImageDraw.Draw(card)
    # Degradado vertical sutil
    for y in range(h):
        t = y / h
        c = (int(26 + 6 * t), int(43 - 10 * t), int(61 - 14 * t))
        d.line([(0, y), (w, y)], fill=c)
    # Colgante troquelado, como las tarjetas físicas
    d.rounded_rectangle([w / 2 - 62, 52, w / 2 + 62, 92], radius=20, fill=(58, 76, 95))
    f_marca = ImageFont.truetype(FONT_B, 76)
    f_pie = ImageFont.truetype(FONT_B, 30)
    tw = d.textlength("prime", font=f_marca)
    x0 = (w - tw) / 2
    d.text((x0, h * 0.38), "prime", font=f_marca, fill=(255, 255, 255))
    # Arco cian característico, debajo de la palabra
    d.arc([x0 - 6, h * 0.44, x0 + tw + 6, h * 0.60], start=15, end=165,
          fill=(0, 168, 225), width=9)
    f_sub = ImageFont.truetype(FONT_M, 42)
    sw = d.textlength("video", font=f_sub)
    d.text(((w - sw) / 2, h * 0.575), "video", font=f_sub, fill=(214, 232, 245))
    pw = d.textlength("GIFT CARD", font=f_pie)
    d.text(((w - pw) / 2, h * 0.86), "GIFT CARD", font=f_pie, fill=(0, 168, 225))
    return card


def componer(marca, iso):
    c1, c2 = BACKDROP[marca]
    lienzo = gradiente((W, H), c1, c2)
    lienzo = brillo(lienzo, int(W * 0.78), int(H * 0.12), 340,
                    alpha=30 if marca in LIGHT_BG else 52)
    lienzo = puntitos(lienzo, alpha=9 if marca in LIGHT_BG else 14)
    lienzo = lienzo.convert("RGBA")

    # La gift card real, escalada a lo alto del lienzo
    if marca in CARDS:
        card = Image.open(os.path.join(UP, CARDS[marca])).convert("RGBA")
    else:
        card = tarjeta_prime_video()
    alto_obj = int(H * 0.80)
    escala = alto_obj / card.size[1]
    card = card.resize((int(card.size[0] * escala), alto_obj), Image.LANCZOS)
    card = redondear(card, 18)

    cx = (W - card.size[0]) // 2
    cy = (H - card.size[1]) // 2

    # Sombra bajo la tarjeta
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rounded_rectangle(
        [cx + 10, cy + 20, cx + card.size[0] + 10, cy + card.size[1] + 22],
        radius=18, fill=(0, 0, 0, 130))
    sombra = sombra.filter(ImageFilter.GaussianBlur(26))
    lienzo = Image.alpha_composite(lienzo, sombra)
    lienzo.paste(card, (cx, cy), card)

    # Chapa con la bandera, abajo a la izquierda
    ch = chapa(iso, marca in LIGHT_BG)
    lienzo.paste(ch, (44, H - ch.size[1] - 44), ch)

    os.makedirs(OUT, exist_ok=True)
    destino = os.path.join(OUT, f"{marca}-{iso.lower()}.webp")
    lienzo.convert("RGB").save(destino, "WEBP", quality=88, method=6)
    return destino, os.path.getsize(destino)


# Pares que existen en el catálogo
MARCAS_IMG = ["google-play", "netflix", "spotify", "disney-plus", "prime-video"]
PARES = [(m, iso) for m in MARCAS_IMG for iso in ["AR", "PE", "CL", "CO", "MX"]]

if __name__ == "__main__":
    for marca, iso in PARES:
        p, size = componer(marca, iso)
        print(f"  {os.path.basename(p):<28} {size/1024:6.1f} KB")
    print(f"\n{len(PARES)} imágenes compuestas")
