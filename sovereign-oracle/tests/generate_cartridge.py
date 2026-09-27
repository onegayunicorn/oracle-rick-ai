#!/usr/bin/env python3
"""Reproducible Cartridge Generator: injects executable manifests into PNG tEXt chunks."""
import struct
import zlib
import json
import sys


def inject_cartridge(input_path: str, output_path: str, manifest: dict):
    with open(input_path, "rb") as f:
        png_data = f.read()

    if png_data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Invalid PNG file signature.")

    keyword = b"oracle_manifest"
    text_payload = json.dumps(manifest).encode("utf-8")
    chunk_data = keyword + b"\x00" + text_payload

    length = struct.pack(">I", len(chunk_data))
    chunk_type = b"tEXt"
    crc = struct.pack(">I", zlib.crc32(chunk_type + chunk_data) & 0xFFFFFFFF)
    new_chunk = length + chunk_type + chunk_data + crc

    iend_idx = png_data.rfind(b"IEND") - 4
    synthesized_png = png_data[:iend_idx] + new_chunk + png_data[iend_idx:]

    with open(output_path, "wb") as f:
        f.write(synthesized_png)
    print(f"[+] Cartridge successfully compiled to: {output_path}")


if __name__ == "__main__":
    test_manifest = {
        "version": "1.0.0",
        "pipeline": "cascade-alpha",
        "pressureThreshold": 80,
        "script": "return 'Telemetry locked at pressure: ' + pressure;",
    }
    input_file = sys.argv[1] if len(sys.argv) > 1 else "base_icon.png"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "cartridge_ready.png"
    inject_cartridge(input_file, output_file, test_manifest)
