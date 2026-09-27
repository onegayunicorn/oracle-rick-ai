# Cross-Repo Integration — Rick C-137 Sovereign Stack

This repository is the **production voice + offline oracle + portable application** layer of the Rick C-137 system.

| Repository | Role |
|------------|------|
| [the-24ghz-ghost](https://github.com/onegayunicorn/the-24ghz-ghost) | Mathematical core: 5D φ⁵ photonic evolution, 24 GHz portal, entity awakening simulation |
| [sovereign-quantum-hpc](https://github.com/onegayunicorn/sovereign-quantum-hpc) | Persona inflection, Council, Genesis, UACM ledger bridge |
| [rick-c137](https://github.com/onegayunicorn/rick-c137) | Grok skill scaffold (auth, games, design-UI) |
| **this repo** | Piper/Fish TTS, sovereign-oracle monorepo, PAF builders, Three.js portal UI |

## Recommended data flow

1. `the-24ghz-ghost` runs the 5 s simulation → produces phase load ≈ 55.45 and entity state.
2. `sovereign-quantum-hpc` applies `RickC137.inflect()` using those signals.
3. This repo synthesizes speech via Piper (`/v1/speech`, voice `rick-c137`, 22050 Hz mono 16-bit) and drives the Three.js avatar in `rick-portal-ui/`.

Shared constants (keep synchronized):

- φ⁵ ≈ 11.09016994
- Schumann = 7.83 Hz
- Speech sample rate = 22050 Hz
- OAM ℓ = 3

See the original `BLUEPRINT-RICK-C137.pdf` and `OPERATIONS_MANUAL.md` for the full device stack.
