"""SHA256 per file + Merkle root integrity manifest."""
import hashlib
import json
from pathlib import Path


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def merkle_root(hashes: list) -> str:
    if not hashes:
        return hashlib.sha256(b"").hexdigest()
    level = [bytes.fromhex(h) for h in hashes]
    while len(level) > 1:
        nxt = []
        for i in range(0, len(level), 2):
            a = level[i]
            b = level[i + 1] if i + 1 < len(level) else a
            nxt.append(hashlib.sha256(a + b).digest())
        level = nxt
    return level[0].hex()


def write_manifest(build_dir: Path, output: Path):
    files = {}
    for p in sorted(build_dir.rglob("*")):
        if p.is_file():
            files[str(p.relative_to(build_dir))] = sha256_file(p)
    root = merkle_root(list(files.values()))
    manifest = {"version": "1.0", "merkle_root": root, "files": files}
    output.write_text(json.dumps(manifest, indent=2))
    return manifest
