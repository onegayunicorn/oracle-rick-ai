#!/usr/bin/env python3
"""Universal conversion engine core. Supports EXE -> PWA and PWA -> APK.
Run with --serve to launch the FastAPI conversion API + web UI host."""
import os
import json
import shutil
import hashlib
import argparse
import subprocess
from pathlib import Path

BUILDS = Path("builds")
UPLOADS = Path("uploads")
BUILDS.mkdir(exist_ok=True)
UPLOADS.mkdir(exist_ok=True)

ALLOWED_EXTS = {".exe", ".msi", ".bat", ".cmd", ".sh", ".html", ".zip"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def exe_to_pwa(input_path: Path, out_dir: Path) -> dict:
    """Wrap a binary in the PWA template."""
    out_dir.mkdir(parents=True, exist_ok=True)
    template = Path("pwa-template")
    if template.exists():
        shutil.copytree(template, out_dir, dirs_exist_ok=True)
    (out_dir / "assets").mkdir(exist_ok=True)
    shutil.copy(input_path, out_dir / "assets" / "app.bin")
    manifest = {
        "name": input_path.stem,
        "short_name": input_path.stem[:12],
        "start_url": "./index.html",
        "display": "standalone",
        "background_color": "#0f172a",
        "theme_color": "#22d3ee",
        "icons": [
            {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))
    return {"name": input_path.stem, "sha256": sha256_file(input_path), "pwa_dir": str(out_dir)}


def pwa_to_apk(pwa_dir: Path) -> dict:
    """Invoke bubblewrap to package the PWA as APK."""
    apk = pwa_dir / "app-release-signed.apk"
    if apk.exists():
        return {"apk": str(apk)}
    try:
        subprocess.run(
            ["bubblewrap", "build", "--directory", str(pwa_dir)],
            check=False, timeout=300,
        )
    except FileNotFoundError:
        return {"error": "bubblewrap not installed; run scripts/setup.sh"}
    return {"apk": str(apk) if apk.exists() else None, "note": "check PWABuilder fallback"}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--serve", action="store_true")
    p.add_argument("--port", type=int, default=8090)
    p.add_argument("--input", help="input file to convert")
    p.add_argument("--format", choices=["pwa", "apk"], default="pwa")
    args = p.parse_args()

    if args.input:
        result = exe_to_pwa(Path(args.input), BUILDS / Path(args.input).stem)
        if args.format == "apk":
            result.update(pwa_to_apk(BUILDS / Path(args.input).stem))
        print(json.dumps(result, indent=2))
        return

    if args.serve:
        from fastapi import FastAPI, UploadFile, File
        from fastapi.responses import FileResponse
        from fastapi.staticfiles import StaticFiles
        import uvicorn

        app = FastAPI(title="Sovereign Convert")
        app.mount("/ui", StaticFiles(directory="web-ui", html=True), name="ui")

        @app.post("/api/convert")
        async def convert(file: UploadFile = File(...)):
            ext = Path(file.filename).suffix.lower()
            if ext not in ALLOWED_EXTS:
                return {"error": f"unsupported type {ext}"}
            dest = UPLOADS / file.filename
            with open(dest, "wb") as f:
                shutil.copyfileobj(file.file, f)
            return exe_to_pwa(dest, BUILDS / Path(file.filename).stem)

        @app.get("/api/builds")
        async def builds():
            return [str(p) for p in BUILDS.iterdir()]

        uvicorn.run(app, host="0.0.0.0", port=args.port)


if __name__ == "__main__":
    main()
