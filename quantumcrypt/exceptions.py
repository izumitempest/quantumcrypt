"""
Exception classes for QuantumCrypt library.
"""


class QuantumCryptError(Exception):
    """Base exception for all QuantumCrypt errors."""

    pass


class EncryptionError(QuantumCryptError):
    """Raised when encryption operation fails."""

    pass


class DecryptionError(QuantumCryptError):
    """Raised when decryption operation fails."""

    pass


class KeyGenerationError(QuantumCryptError):
    """Raised when key pair generation fails."""

    pass


class InvalidKeyError(QuantumCryptError):
    """Raised when an invalid key is provided."""

    pass


class UnsupportedAlgorithmError(QuantumCryptError):
    """Raised when an unsupported algorithm is requested."""

    pass
