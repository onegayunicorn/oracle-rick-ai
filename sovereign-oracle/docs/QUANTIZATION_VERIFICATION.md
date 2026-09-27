# Rick C-137 Piper Quantization Verification

## Naming correction
Q4_K_M, Q5_K_M, and Q8_0 are not established Piper/ONNX Runtime quantization variants. They are commonly associated with GGUF/llama.cpp. They must not be used as evidence that a Piper ONNX voice has been quantized.

Canonical candidate variants:
- fp32: exported/reference ONNX model
- fp16: ONNX float16 conversion where the target runtime supports it
- int8: ONNX Runtime integer quantization, subject to operator compatibility
- base: compatibility alias for the reference model

ONNX Runtime also documents limited 4-bit weight-only quantization for specific operators. That facility is not equivalent to GGUF Q4_K_M and must not be applied to Piper without model-specific validation.

## Promotion gates
A generated variant is candidate status after:
1. ONNX checker passes.
2. ONNX Runtime creates a CPU execution session.
3. Piper loads the model and synthesizes audio.
4. Output WAV has the expected sample rate and non-zero audio.
5. A fixed speech corpus is compared against the FP32 reference.
6. Real-device latency, RSS, and audio quality are measured on x86_64 and ARM64.

Only after all six gates may a variant be marked verified.

## Commands
From sovereign-oracle/:

    python3 -m venv .venv-quant
    . .venv-quant/bin/activate
    pip install -r training/piper/requirements-quantization.txt

    python training/piper/quantize-onnx.py       --input services/piper-tts/models/rick_c137.onnx       --output-dir services/piper-tts/models       --int8 --fp16

The script writes a machine-readable rick_c137.quantization.json report.

## Evidence boundary
The repository does not currently contain a trained Rick C-137 ONNX model. Until that model exists and the gates above are executed, int8/fp16 performance, ARM speedups, and quality parity remain unverified engineering targets.
