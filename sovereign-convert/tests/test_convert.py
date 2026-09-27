import json, tempfile
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))
from convert import exe_to_pwa, sha256_file, ALLOWED_EXTS


def test_exe_to_pwa(tmp_path=Path(tempfile.mkdtemp())):
    src = tmp_path / "demo.exe"
    src.write_bytes(b"MZ" + b"\x00" * 64)
    out = tmp_path / "out"
    result = exe_to_pwa(src, out)
    assert result["name"] == "demo"
    assert (out / "manifest.json").exists()
    assert (out / "assets" / "app.bin").exists()
    manifest = json.loads((out / "manifest.json").read_text())
    assert manifest["display"] == "standalone"
    print("[OK] exe_to_pwa produces valid PWA structure")


def test_allowed_exts():
    assert ".exe" in ALLOWED_EXTS
    assert ".apk" not in ALLOWED_EXTS


if __name__ == "__main__":
    test_exe_to_pwa()
    test_allowed_exts()
    print("All tests passed.")
