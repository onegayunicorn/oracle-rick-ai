#!/usr/bin/env python3
"""Create and validate ONNX Runtime quantized/FP16 Piper model variants."""
from __future__ import annotations
import argparse, json
from pathlib import Path
import onnx
import onnxruntime as ort
from onnxruntime.quantization import QuantType, quantize_dynamic
from onnxconverter_common import float16

def validate(path: Path) -> dict:
    model = onnx.load(str(path))
    onnx.checker.check_model(model)
    session = ort.InferenceSession(str(path), providers=["CPUExecutionProvider"])
    return {"path": str(path), "size_bytes": path.stat().st_size,
            "inputs": [x.name for x in session.get_inputs()],
            "outputs": [x.name for x in session.get_outputs()],
            "providers": session.get_providers()}

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, type=Path)
    ap.add_argument("--output-dir", required=True, type=Path)
    ap.add_argument("--prefix", default="rick_c137")
    ap.add_argument("--int8", action="store_true")
    ap.add_argument("--fp16", action="store_true")
    args = ap.parse_args()
    if not args.int8 and not args.fp16:
        ap.error("select at least one of --int8 or --fp16")
    src = args.input.resolve()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    results = {"source": validate(src), "variants": []}
    if args.int8:
        out = args.output_dir / f"{args.prefix}.int8.onnx"
        quantize_dynamic(model_input=str(src), model_output=str(out),
                         weight_type=QuantType.QInt8, per_channel=True,
                         reduce_range=False)
        item = validate(out); item["method"] = "onnxruntime.quantize_dynamic"
        results["variants"].append(item)
    if args.fp16:
        out = args.output_dir / f"{args.prefix}.fp16.onnx"
        model = onnx.load(str(src))
        onnx.save(float16.convert_float_to_float16(model, keep_io_types=True), str(out))
        item = validate(out); item["method"] = "onnxconverter-common.float16"
        results["variants"].append(item)
    report = args.output_dir / f"{args.prefix}.quantization.json"
    report.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
