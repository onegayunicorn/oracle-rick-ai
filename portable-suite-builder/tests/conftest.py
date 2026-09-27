import pytest, tempfile
from pathlib import Path

@pytest.fixture
def build_dir():
    d = Path(tempfile.mkdtemp()) / "TestSuite_1.0.0"
    d.mkdir()
    return d
