"""Generate PAF icon (ico/png) from source image."""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None


def generate_icon(source: Path, out_ico: Path, sizes=(16, 32, 48, 128, 256)):
    if Image is None:
        raise ImportError("pip install Pillow for icon generation")
    img = Image.open(source).convert("RGBA")
    imgs = [img.resize((s, s), Image.LANCZOS) for s in sizes]
    imgs[0].save(out_ico, format="ICO", sizes=[(s, s) for s in sizes])
    return out_ico
