"""Generate PAF icons (ico + png) from source image."""
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    Image = None


def generate(source: Path, out_ico: Path, out_png: Path):
    if Image is None:
        raise ImportError("pip install Pillow")
    img = Image.open(source).convert("RGBA")
    sizes = [16, 32, 48, 128, 256]
    imgs = [img.resize((s, s), Image.LANCZOS) for s in sizes]
    imgs[0].save(out_ico, format="ICO", sizes=[(s, s) for s in sizes])
    img.resize((512, 512), Image.LANCZOS).save(out_png)
