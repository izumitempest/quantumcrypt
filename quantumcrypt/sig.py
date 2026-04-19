"""
Digital Signatures using NIST-approved algorithms (ML-DSA / Dilithium).
"""

from typing import Optional
import oqs
from quantumcrypt.kem import KeyPair
from quantumcrypt.exceptions import (
    KeyGenerationError,
    EncryptionError,
    DecryptionError,
)


class MLDSA:
    """Base class for ML-DSA (Dilithium) signatures."""

    def __init__(self, algorithm_name: str, display_name: str):
        self.algorithm_name = algorithm_name
        self.display_name = display_name
        try:
            self._sig = oqs.Signature(self.algorithm_name)
        except Exception as e:
            raise KeyGenerationError(f"Failed to initialize {self.display_name}: {e}")

    def generate_keypair(self) -> KeyPair:
        """Generate a new signature key pair."""
        try:
            public_key = self._sig.generate_keypair()
            secret_key = self._sig.export_secret_key()
            return KeyPair(public_key, secret_key, self.display_name)
        except Exception as e:
            raise KeyGenerationError(f"Key generation failed: {e}")

    def sign(self, message: bytes, secret_key: bytes) -> bytes:
        """Sign a message using the secret key."""
        try:
            with oqs.Signature(self.algorithm_name, secret_key) as signer:
                signature = signer.sign(message)
            return signature
        except Exception as e:
            raise EncryptionError(f"Signing failed: {e}")

    def verify(self, message: bytes, signature: bytes, public_key: bytes) -> bool:
        """Verify a signature using the public key.

        Returns:
            True if the signature is valid, False otherwise.
            Raises exceptions for invalid key/signature formats or system faults.
        """
        return self._sig.verify(message, signature, public_key)


class MLDSA44(MLDSA):
    """ML-DSA-44 (Dilithium2) - NIST Level 2."""

    def __init__(self):
        super().__init__("Dilithium2", "ML-DSA-44")


class MLDSA65(MLDSA):
    """ML-DSA-65 (Dilithium3) - NIST Level 3."""

    def __init__(self):
        super().__init__("Dilithium3", "ML-DSA-65")


class MLDSA87(MLDSA):
    """ML-DSA-87 (Dilithium5) - NIST Level 5."""

    def __init__(self):
        super().__init__("Dilithium5", "ML-DSA-87")
