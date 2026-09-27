"""Folder skeleton + appinfo.ini for PAF suites (multiple apps)."""
import shutil
from pathlib import Path


def build_suite(build_dir: Path, name: str, version: str, apps: list, publisher="Sovereign"):
    for sub in ["App", "Data", "AppInfo", "Other", "Other/Source"]:
        (build_dir / sub).mkdir(parents=True, exist_ok=True)
    (build_dir / ".nomedia").write_text("")  # Android: exclude from gallery
    ini = f"""[Format]
Type=PortableApps.comFormat
Version=3.0
Suite=true

[Details]
Name={name}
AppID={name.replace(' ', '')}Suite
Publisher={publisher}
Version={version}
Language=Multilingual
Apps={len(apps)}

[Control]
Start={name}Menu.exe
"""
    (build_dir / "AppInfo" / "appinfo.ini").write_text(ini)
    for app in apps:
        (build_dir / "App" / app).mkdir(exist_ok=True)
    return build_dir
