# Skill: Universal Format Converter (EXE → PWA → APK → General)

## Triggers
When the user asks to convert an EXE/MSI/binary/zip to a PWA, APK, or portable
format; or to "wrap" a legacy app for mobile/offline use.

## Workflow
1. Identify input type (`.exe`, `.msi`, `.bat`, `.sh`, `.html`, `.zip`).
2. Check `web-ui/config.json` limits (max 200 MB, allowed types).
3. Run `scripts/convert.py --input <file> --format pwa|apk`.
4. For APK: ensure signing config (`config/signing-env.sh`) or use PWABuilder.
5. Output: `builds/<name>/` PWA + optional signed APK + `build_manifest.json`.

## References
- `references/EXE-TO-PWA.md`, `references/EXE-TO-APK.md`, `references/GENERAL-CONVERT.md`
