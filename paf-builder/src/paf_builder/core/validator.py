"""PAF spec compliance validator."""
from pathlib import Path

REQUIRED = ["App", "Data", "AppInfo", "AppInfo/appinfo.ini"]


def validate(build_dir: Path) -> list:
    errors = []
    for r in REQUIRED:
        if not (build_dir / r).exists():
            errors.append(f"missing required path: {r}")
    ini = build_dir / "AppInfo" / "appinfo.ini"
    if ini.exists():
        text = ini.read_text()
        for key in ["[Format]", "[Details]", "[Control]"]:
            if key not in text:
                errors.append(f"appinfo.ini missing section {key}")
    return errors
