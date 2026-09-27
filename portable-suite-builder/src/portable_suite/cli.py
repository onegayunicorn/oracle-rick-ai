import argparse, json, shutil
from pathlib import Path
from .core.build_engine import build_suite
from .core.validator import validate
from .core.manifest_writer import write_manifest
from .core.launcher_generator import generate_launchers


def main():
    p = argparse.ArgumentParser(prog="portable_suite")
    sub = p.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("build")
    b.add_argument("--input", required=True)
    b.add_argument("--name", required=True)
    b.add_argument("--version", default="1.0.0")
    b.add_argument("--apps", nargs="*", default=["App1"])
    args = p.parse_args()

    if args.cmd == "build":
        bd = Path("builds") / f"{args.name}_{args.version}"
        if bd.exists():
            shutil.rmtree(bd)
        build_suite(bd, args.name, args.version, args.apps)
        generate_launchers(bd, args.name, args.apps)
        errors = validate(bd)
        manifest = write_manifest(bd, bd / "build_manifest.json")
        print(json.dumps({"build_dir": str(bd), "merkle_root": manifest["merkle_root"],
                          "validation_errors": errors}, indent=2))


if __name__ == "__main__":
    main()
