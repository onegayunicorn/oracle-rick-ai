"""PAF spec compliance validator."""
from pathlib import Path

REQUIRED = ["App", "Data", "AppInfo", "AppInfo/appinfo.ini", ".nomedia"]
SECTIONS = ["[Format]", "[Details]", "[Control]"]


def validate(build_dir: Path) -> list:
    errors = []
    for r in REQUIRED:
        if not (build_dir / r).exists():
            errors.append(f"missing: {r}")
    ini = build_dir / "AppInfo" / "appinfo.ini"
    if ini.exists():
        text = ini.read_text()
        for s in SECTIONS:
            if s not in text:
                errors.append(f"appinfo.ini missing section {s}")
    return errors
