"""Parse a PWA manifest.json -> PAF metadata."""
import json
from pathlib import Path


def parse_pwa_manifest(manifest_path: Path) -> dict:
    m = json.loads(manifest_path.read_text())
    return {
        "name": m.get("name", "App"),
        "version": m.get("version", "1.0.0"),
        "icons": m.get("icons", []),
        "start_url": m.get("start_url", "./index.html"),
    }
