"""Binary patch hooks: apply a list of (offset, expected, replacement) to EXEs."""
from pathlib import Path


def apply_patches(binary: Path, patches: list):
    data = bytearray(binary.read_bytes())
    for offset, expected, replacement in patches:
        if bytes(data[offset:offset+len(expected)]) != expected:
            raise ValueError(f"patch mismatch at offset {offset:#x}")
        data[offset:offset+len(replacement)] = replacement
    binary.write_bytes(bytes(data))
    return len(patches)
