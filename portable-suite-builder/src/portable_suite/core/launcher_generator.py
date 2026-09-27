"""Cross-platform launchers: [Name].bat (Windows) + [Name].sh (POSIX)."""
from pathlib import Path


def generate_launchers(build_dir: Path, suite_name: str, apps: list):
    menu = "\n".join(f'  echo "  {i+1}. {a}"' for i, a in enumerate(apps))
    bat = f"""@echo off
title {suite_name} Suite
:menu
echo {suite_name} — Portable Suite
{menu}
set /p c=Choose app: 
start "" "App\\%c%\\%c%.exe"
"""
    sh = f"""#!/usr/bin/env bash
cd "$(dirname "$0")"
select app in {' '.join(apps)}; do
  [ -n "$app" ] && exec "App/$app/$app" "$@"
done
"""
    (build_dir / f"Start {suite_name}.bat").write_text(bat)
    p = build_dir / f"start-{suite_name.lower()}.sh"
    p.write_text(sh)
    p.chmod(0o755)
