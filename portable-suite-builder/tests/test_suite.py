from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from portable_suite.core.build_engine import build_suite
from portable_suite.core.validator import validate
from portable_suite.core.manifest_writer import write_manifest


def test_full_pipeline(build_dir):
    build_suite(build_dir, "TestSuite", "1.0.0", ["Notepad", "Calc"])
    assert validate(build_dir) == []
    m = write_manifest(build_dir, build_dir / "build_manifest.json")
    assert len(m["merkle_root"]) == 64
    assert (build_dir / ".nomedia").exists()
    print("[OK] portable suite pipeline passes")


if __name__ == "__main__":
    import tempfile
    from pathlib import Path
    d = Path(tempfile.mkdtemp()) / "T_1.0.0"
    test_full_pipeline(d)
