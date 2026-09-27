import argparse
import json
import shutil
import zipfile
from pathlib import Path

from .core.build_engine import build_skeleton, copy_app_payload
from .core.validator import validate
from .core.manifest_writer import write_manifest
from .core.launcher_generator import generate_launchers


def main():
    p = argparse.ArgumentParser(prog="paf_builder")
    p.add_argument("--input", required=True, help="path to app payload")
    p.add_argument("--name", required=True)
    p.add_argument("--version", default="1.0.0")
    p.add_argument("--out", default="builds")
    args = p.parse_args()

    build_dir = Path(args.out) / f"{args.name}_{args.version}"
    if build_dir.exists():
        shutil.rmtree(build_dir)
    build_skeleton(build_dir, args.name, args.version)
    copy_app_payload(build_dir, Path(args.input))
    generate_launchers(build_dir, args.name)

    errors = validate(build_dir)
    if errors:
        print("[WARN] validation issues:", errors)

    manifest = write_manifest(build_dir, build_dir / "build_manifest.json")
    zip_path = build_dir.with_suffix(".zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for f in build_dir.rglob("*"):
            if f.is_file():
                z.write(f, f.relative_to(build_dir.parent))
    print(json.dumps({"build_dir": str(build_dir), "zip": str(zip_path),
                      "merkle_root": manifest["merkle_root"],
                      "files": len(manifest["files"])}, indent=2))


if __name__ == "__main__":
    main()
