# PortableSuite Builder — Operations Manual

Builds complete PortableApps.com Format (PAF) suites from any set of binaries,
web apps, or PWA manifests — with RSA/HMAC signing, binary patching hooks,
URL→PAF webapp wrapper, and a Merkle-root integrity manifest.

## Quick Start
```bash
pip install -r requirements.txt
python -m portable_suite build --input ./myapps --name "MySuite" --version 1.0.0
# -> builds/MySuite_1.0.0/  (App/ Data/ AppInfo/ Other/ + launchers + manifest)
```

## Layout
```
portable-suite-builder/
├── src/portable_suite/
│   ├── core/      build_engine, validator, manifest_writer, launcher_generator,
│   │              pwa_manifest_parser, icon_generator, signer (RSA/HMAC)
│   ├── patcher/   binary patch hooks
│   ├── webapp/    URL -> PAF wrapper
│   └── cli.py
├── Platform/Builder/   build pipeline definitions
├── signing/ + keys/    RSA keys (git-ignored)
├── settings/ logs/ shared/ assets/ help/ Docs/
├── tests/        conftest + fixtures
├── PAF_SPEC.md, APPS2_ANALYSIS.md
└── builds/       output
```
