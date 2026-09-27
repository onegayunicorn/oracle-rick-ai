import tempfile, json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from paf_builder.core.build_engine import build_skeleton
from paf_builder.core.validator import validate
from paf_builder.core.manifest_writer import write_manifest, merkle_root


def test_build_and_validate():
    d = Path(tempfile.mkdtemp()) / "MyApp_1.0.0"
    build_skeleton(d, "MyApp", "1.0.0")
    assert validate(d) == []
    m = write_manifest(d, d / "build_manifest.json")
    assert "merkle_root" in m
    assert len(m["merkle_root"]) == 64
    print("[OK] paf builder builds + validates + manifests")


if __name__ == "__main__":
    test_build_and_validate()
