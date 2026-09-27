"""Folder skeleton + appinfo.ini generation (PAF spec)."""
import os
import shutil
from pathlib import Path


def build_skeleton(build_dir: Path, name: str, version: str, publisher: str = "Sovereign"):
    """Create App/, Data/, AppInfo/ with a valid appinfo.ini."""
    (build_dir / "App").mkdir(parents=True, exist_ok=True)
    (build_dir / "Data").mkdir(parents=True, exist_ok=True)
    (build_dir / "AppInfo").mkdir(parents=True, exist_ok=True)
    ini = f"""[Format]
Type=PortableApps.comFormat
Version=3.0

[Details]
Name={name}
AppID={name.replace(' ', '')}
Publisher={publisher}
Version={version}
Language=Multilingual

[License]
Shareable=true
OpenSource=true
Freeware=true

[Control]
Icons=1
Start={name}.exe
"""
    (build_dir / "AppInfo" / "appinfo.ini").write_text(ini)
    return build_dir


def copy_app_payload(build_dir: Path, source: Path):
    if source.exists():
        shutil.copytree(source, build_dir / "App" / source.name, dirs_exist_ok=True)
