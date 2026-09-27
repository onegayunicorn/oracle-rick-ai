"""RSA/HMAC signing + verification for suite builds."""
import hashlib, hmac, json
from pathlib import Path

try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding, rsa
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False


def hmac_sign(manifest_path: Path, key: bytes) -> str:
    data = manifest_path.read_bytes()
    return hmac.new(key, data, hashlib.sha256).hexdigest()


def rsa_sign(manifest_path: Path, private_key_pem: Path) -> str:
    if not HAS_CRYPTO:
        raise ImportError("pip install cryptography for RSA signing")
    priv = serialization.load_pem_private_key(private_key_pem.read_bytes(), password=None)
    sig = priv.sign(manifest_path.read_bytes(), padding.PKCS1v15(), hashes.SHA256())
    return sig.hex()


def generate_keypair(out_dir: Path):
    if not HAS_CRYPTO:
        raise ImportError("pip install cryptography")
    priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    (out_dir / "signing_key.pem").write_bytes(
        priv.private_bytes(serialization.Encoding.PEM,
                           serialization.PrivateFormat.PKCS8,
                           serialization.NoEncryption()))
    (out_dir / "verifying_key.pub").write_bytes(
        priv.public_key().public_bytes(serialization.Encoding.PEM,
                                       serialization.PublicFormat.SubjectPublicKeyInfo))
