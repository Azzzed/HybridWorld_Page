"""
Genera las fuentes Archivo del sitio (src/fonts/*.woff2) a partir de las
variables originales de Google Fonts (assets-src/fonts, licencia OFL).

Por qué: con next/font/google se precargaban la Archivo normal (99 KB) y la
cursiva (88 KB) completas. Aquí se recortan a lo que el sitio usa, sin cambiar
cómo se ven esos usos:

  - Normal: pesos 400–900 y anchos 66–125 (los de styles/tokens.css y el CSS
    de los componentes), con los caracteres del subconjunto "latin" de Google.
  - Cursiva: solo la usa el titular del hero (hero-scroll.css), en peso 900 y
    ancho 125 (118 en el móvil de las sucursales) y en mayúsculas. Se fija el
    peso en 900 y el ancho queda variable entre 118 y 125.

Si un componente nuevo usa la cursiva u otro peso o ancho fuera de estos
rangos, hay que ampliarlos aquí y volver a generar.

Uso (Python 3 con fonttools y brotli):
  pip install fonttools brotli
  python3 scripts/build-fonts.py
"""

from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "fonts"
OUT = ROOT / "src" / "fonts"

# El subconjunto "latin" de Google Fonts (el mismo unicode-range que servía next/font/google)
LATIN = [
    *range(0x0000, 0x0100), 0x0131, 0x0152, 0x0153, 0x02BB, 0x02BC, 0x02C6, 0x02DA, 0x02DC,
    0x0304, 0x0308, 0x0329, *range(0x2000, 0x2070), 0x20AC, 0x2122, 0x2191, 0x2193,
    0x2212, 0x2215, 0xFEFF, 0xFFFD,
]

FONTS = [
    ("Archivo[wdth,wght].ttf", "archivo.woff2", {"wght": (400, 900), "wdth": (66, 125)}),
    ("Archivo-Italic[wdth,wght].ttf", "archivo-italic-900.woff2", {"wght": 900, "wdth": (118, 125)}),
]


def build(src: str, out: str, axes: dict) -> None:
    font = TTFont(SRC / src)
    # Primero el subconjunto de caracteres y después los ejes: al revés, fonttools
    # falla con los glifos vacíos (U+FEFF) que no tienen variaciones
    options = subset.Options()
    options.layout_features = ["*"]  # kerning y ligaduras, como el original
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=LATIN)
    subsetter.subset(font)
    font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    OUT.mkdir(parents=True, exist_ok=True)
    font.save(OUT / out)
    print(f"{out}: {(OUT / out).stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    for args in FONTS:
        build(*args)
