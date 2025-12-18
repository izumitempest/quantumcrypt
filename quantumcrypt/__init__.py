"""
QuantumCrypt - Developer-friendly Python library for post-quantum cryptography.

This library provides quantum-resistant encryption methods based on NIST-approved
algorithms, with a focus on ease of use and practical integration.

Example:
    >>> from quantumcrypt import SecureChannel
    >>> 
    >>> # Create a secure channel with hybrid encryption
    >>> channel = SecureChannel.create()
    >>> 
    >>> # Encrypt data
    >>> encrypted = channel.encrypt(b"secret message")
    >>> 
    >>> # Decrypt data
    >>> decrypted = channel.decrypt(encrypted)
    >>> assert decrypted == b"secret message"
"""

from typing import List

# Version of the quantumcrypt package
__version__ = "0.1.0-beta"
__author__ = "QuantumCrypt Contributors"
__license__ = "MIT"

# Import main public API
from quantumcrypt.kem import MLKEM768, MLKEM1024, KeyPair
from quantumcrypt.secure_channel import SecureChannel
from quantumcrypt.exceptions import (
    QuantumCryptError,
    EncryptionError,
    DecryptionError,
    KeyGenerationError,
)

__all__: List[str] = [
    # Version info
    "__version__",
    "__author__",
    "__license__",
    # High-level API
    "SecureChannel",
    # KEM algorithms
    "MLKEM768",
    "MLKEM1024",
    "KeyPair",
    # Exceptions
    "QuantumCryptError",
    "EncryptionError",
    "DecryptionError",
    "KeyGenerationError",
]
