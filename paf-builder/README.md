# PAF Builder — PortableApps.com Format Packager

Builds a PortableApps-format directory from any app: `App/`, `Data/`,
`AppInfo/appinfo.ini`, cross-platform launchers, plus a Merkle-root integrity
manifest. Output: a distributable `.zip` ready for the PortableApps platform.

## Usage
```bash
pip install -r requirements.txt
python -m paf_builder --input /path/to/app --name MyNotepad --version 1.0.0
# -> builds/MyNotepad_1.0.0/ + MyNotepad_1.0.0.zip + build_manifest.json
```

## Layers
1. **Build** — folder skeleton + `appinfo.ini`
2. **Validate** — PAF spec compliance checks
3. **Integrity** — SHA256 per file -> Merkle root -> `build_manifest.json`
4. **Launchers** — generate `.bat` + `.sh` cross-platform start scripts
5. **Package** — distributable zip

## Layout
```
paf-builder/
├── src/paf_builder/
│   ├── core/  build_engine, validator, manifest_writer, launcher_generator,
│   │          pwa_manifest_parser, icon_generator
│   └── builder_ui.py   (Tkinter GUI, optional)
├── templates/  AppInfo/appinfo.ini, App/, Data/
├── keys/       signing keys (git-ignored)
├── builds/     output
└── tests/
```
