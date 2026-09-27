"""URL -> PAF wrapper: wraps any URL as a portable "web app" launcher."""
from pathlib import Path


def wrap_url(build_dir: Path, name: str, url: str):
    (build_dir / "App" / name).mkdir(parents=True, exist_ok=True)
    (build_dir / "App" / name / f"{name}.url").write_text(f"[InternetShortcut]\nURL={url}\n")
    (build_dir / "App" / name / f"{name}.bat").write_text(f'@echo off\nstart "" "{url}"\n')
