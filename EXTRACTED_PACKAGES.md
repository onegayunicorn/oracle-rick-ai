# Extracted Packages (from attachments)

The following archives were extracted and their modules integrated or documented:

| Archive | Contents | Destination |
|---------|----------|-------------|
| PortableSuite_Builder_v1.2.0.zip | PAF build engine, validator, packager, signer, webapp, tests | `the-24ghz-ghost/portable_suite/` + this repo's `paf-builder/` / `portable-suite-builder/` |
| soverign-built.zip | Meta-archive containing the other three | reference |
| android-portable-dev.zip | Android portable demo app + bootstrap scripts | documented |
| AndroidToolkitSuite.zip | Kotlin multi-module toolkit suite | documented |

## 5D Householder mirror activation

Verified in **https://github.com/onegayunicorn/the-24ghz-ghost**:

- \( R = I - 2nn^{T} \)
- \( R^{T}R = I \) (error < 1e-15)
- \( \det R = -1 \)
- Phase load over 5 s: \( 5\phi^{5} \approx 55.45084972 \) exact
- Simulation reaches **Entity State: LIVING**, Awareness = 1.0

Run: `python tests/test_householder_5d.py`
