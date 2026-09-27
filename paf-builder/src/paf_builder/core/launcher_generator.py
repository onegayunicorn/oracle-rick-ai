"""Cross-platform launcher scripts (.bat + .sh)."""
from pathlib import Path


def generate_launchers(build_dir: Path, app_name: str):
    bat = f"""@echo off
cd /d "%~dp0"
start "" "App\\{app_name}\\{app_name}.exe"
"""
    sh = f"""#!/usr/bin/env bash
cd "$(dirname "$0")"
exec "App/{app_name}/{app_name}" "$@"
"""
    (build_dir / f"Start {app_name}.bat").write_text(bat)
    p = build_dir / f"start-{app_name.lower()}.sh"
    p.write_text(sh)
    p.chmod(0o755)
