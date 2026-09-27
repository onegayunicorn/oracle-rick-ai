"""Parse PWA manifest.json -> PAF suite metadata."""
import json
from pathlib import Path


def parse(manifest_path: Path) -> dict:
    m = json.loads(manifest_path.read_text())
    return {"name": m.get("name", "App"), "version": m.get("version", "1.0.0"),
            "icons": m.get("icons", []), "start_url": m.get("start_url", "./index.html")}
