"""
Key Encapsulation Mechanism (KEM) implementations using NIST-approved algorithms.

This module provides ML-KEM (formerly Kyber) implementations with different
security levels, as standardized in FIPS 203.
"""

from typing import Tuple, Optional
import oqs

from quantumcrypt.exceptions import (
    KeyGenerationError,
    EncryptionError,
    DecryptionError,
    InvalidKeyError,
)


class KeyPair:
    """
    Represents a cryptographic key pair (public and secret keys).
    
    Attributes:
        public_key: The public key bytes
        secret_key: The secret key bytes (should be kept confidential)
        algorithm: Name of the algorithm used to generate this keypair
    """

    def __init__(self, public_key: bytes, secret_key: bytes, algorithm: str):
        """
        Initialize a KeyPair.
        
        Args:
            public_key: Public key bytes
            secret_key: Secret key bytes
            algorithm: Algorithm identifier (e.g., "ML-KEM-768")
        """
        self.public_key = public_key
        self.secret_key = secret_key
        self.algorithm = algorithm

    def __repr__(self) -> str:
        return (
            f"KeyPair(algorithm='{self.algorithm}', "
            f"public_key_size={len(self.public_key)}, "
            f"secret_key_size={len(self.secret_key)})"
        )


class MLKEM768:
    """
    ML-KEM-768 (formerly Kyber768) implementation.
    
    This is the recommended algorithm for most applications, providing
    security level 3 (equivalent to AES-192). It offers a good balance
    between performance and security.
    
    Security Level: NIST Level 3 (192-bit)
    Public Key: 1,184 bytes
    Secret Key: 2,400 bytes
    Ciphertext: 1,088 bytes
    
    Example:
        >>> kem = MLKEM768()
        >>> keypair = kem.generate_keypair()
        >>> 
        >>> # Encapsulation (sender side)
        >>> ciphertext, shared_secret = kem.encapsulate(keypair.public_key)
        >>> 
        >>> # Decapsulation (receiver side)
        >>> recovered_secret = kem.decapsulate(keypair.secret_key, ciphertext)
        >>> assert shared_secret == recovered_secret
    """

    ALGORITHM_NAME = "Kyber768"  # liboqs uses old name
    DISPLAY_NAME = "ML-KEM-768"

    def __init__(self) -> None:
        """Initialize ML-KEM-768 algorithm."""
        try:
            self._kem = oqs.KeyEncapsulation(self.ALGORITHM_NAME)
        except Exception as e:
            raise KeyGenerationError(f"Failed to initialize {self.DISPLAY_NAME}: {e}")

    def generate_keypair(self) -> KeyPair:
        """
        Generate a new key pair.
        
        Returns:
            KeyPair object containing public and secret keys
            
        Raises:
            KeyGenerationError: If key generation fails
        """
        try:
            public_key = self._kem.generate_keypair()
            secret_key = self._kem.export_secret_key()
            return KeyPair(public_key, secret_key, self.DISPLAY_NAME)
        except Exception as e:
            raise KeyGenerationError(f"Key generation failed: {e}")

    def encapsulate(self, public_key: bytes) -> Tuple[bytes, bytes]:
        """
        Encapsulate a shared secret using the public key.
        
        This generates a random shared secret and encrypts it with the
        public key. The ciphertext can be sent over an insecure channel.
        
        Args:
            public_key: Public key bytes from generate_keypair()
            
        Returns:
            Tuple of (ciphertext, shared_secret)
            - ciphertext: Encrypted key material to send to recipient
            - shared_secret: Secret key material (keep confidential)
            
        Raises:
            EncryptionError: If encapsulation fails
            InvalidKeyError: If public key is invalid
        """
        if not isinstance(public_key, bytes):
            raise InvalidKeyError("Public key must be bytes")

        if len(public_key) != self._kem.details["length_public_key"]:
            raise InvalidKeyError(
                f"Invalid public key size: expected "
                f"{self._kem.details['length_public_key']}, "
                f"got {len(public_key)}"
            )

        try:
            ciphertext, shared_secret = self._kem.encap_secret(public_key)
            return ciphertext, shared_secret
        except Exception as e:
            raise EncryptionError(f"Encapsulation failed: {e}")

    def decapsulate(self, secret_key: bytes, ciphertext: bytes) -> bytes:
        """
        Decapsulate the shared secret using the secret key.
        
        This recovers the shared secret from the ciphertext using the
        secret key. The recovered secret will match the one from encapsulate().
        
        Args:
            secret_key: Secret key bytes from generate_keypair()
            ciphertext: Ciphertext from encapsulate()
            
        Returns:
            Shared secret bytes (matches encapsulate output)
            
        Raises:
            DecryptionError: If decapsulation fails
            InvalidKeyError: If secret key or ciphertext is invalid
        """
        if not isinstance(secret_key, bytes):
            raise InvalidKeyError("Secret key must be bytes")

        if not isinstance(ciphertext, bytes):
            raise InvalidKeyError("Ciphertext must be bytes")

        if len(ciphertext) != self._kem.details["length_ciphertext"]:
            raise InvalidKeyError(
                f"Invalid ciphertext size: expected "
                f"{self._kem.details['length_ciphertext']}, "
                f"got {len(ciphertext)}"
            )

        try:
            # Import the secret key and decapsulate
            with oqs.KeyEncapsulation(self.ALGORITHM_NAME, secret_key) as kem:
                shared_secret = kem.decap_secret(ciphertext)
            return shared_secret
        except Exception as e:
            raise DecryptionError(f"Decapsulation failed: {e}")


class MLKEM1024:
    """
    ML-KEM-1024 (formerly Kyber1024) implementation.
    
    This provides the highest security level, suitable for applications
    requiring long-term security or those handling highly sensitive data.
    
    Security Level: NIST Level 5 (256-bit, equivalent to AES-256)
    Public Key: 1,568 bytes
    Secret Key: 3,168 bytes
    Ciphertext: 1,568 bytes
    
    Note: Higher security comes with larger key sizes and slightly
    slower performance compared to ML-KEM-768.
    
    Example:
        >>> kem = MLKEM1024()
        >>> keypair = kem.generate_keypair()
        >>> ciphertext, shared_secret = kem.encapsulate(keypair.public_key)
        >>> recovered = kem.decapsulate(keypair.secret_key, ciphertext)
        >>> assert shared_secret == recovered
    """

    ALGORITHM_NAME = "Kyber1024"  # liboqs uses old name
    DISPLAY_NAME = "ML-KEM-1024"

    def __init__(self) -> None:
        """Initialize ML-KEM-1024 algorithm."""
        try:
            self._kem = oqs.KeyEncapsulation(self.ALGORITHM_NAME)
        except Exception as e:
            raise KeyGenerationError(f"Failed to initialize {self.DISPLAY_NAME}: {e}")

    def generate_keypair(self) -> KeyPair:
        """
        Generate a new key pair.
        
        Returns:
            KeyPair object containing public and secret keys
            
        Raises:
            KeyGenerationError: If key generation fails
        """
        try:
            public_key = self._kem.generate_keypair()
            secret_key = self._kem.export_secret_key()
            return KeyPair(public_key, secret_key, self.DISPLAY_NAME)
        except Exception as e:
            raise KeyGenerationError(f"Key generation failed: {e}")

    def encapsulate(self, public_key: bytes) -> Tuple[bytes, bytes]:
        """
        Encapsulate a shared secret using the public key.
        
        Args:
            public_key: Public key bytes from generate_keypair()
            
        Returns:
            Tuple of (ciphertext, shared_secret)
            
        Raises:
            EncryptionError: If encapsulation fails
            InvalidKeyError: If public key is invalid
        """
        if not isinstance(public_key, bytes):
            raise InvalidKeyError("Public key must be bytes")

        if len(public_key) != self._kem.details["length_public_key"]:
            raise InvalidKeyError(
                f"Invalid public key size: expected "
                f"{self._kem.details['length_public_key']}, "
                f"got {len(public_key)}"
            )

        try:
            ciphertext, shared_secret = self._kem.encap_secret(public_key)
            return ciphertext, shared_secret
        except Exception as e:
            raise EncryptionError(f"Encapsulation failed: {e}")

    def decapsulate(self, secret_key: bytes, ciphertext: bytes) -> bytes:
        """
        Decapsulate the shared secret using the secret key.
        
        Args:
            secret_key: Secret key bytes from generate_keypair()
            ciphertext: Ciphertext from encapsulate()
            
        Returns:
            Shared secret bytes
            
        Raises:
            DecryptionError: If decapsulation fails
            InvalidKeyError: If secret key or ciphertext is invalid
        """
        if not isinstance(secret_key, bytes):
            raise InvalidKeyError("Secret key must be bytes")

        if not isinstance(ciphertext, bytes):
            raise InvalidKeyError("Ciphertext must be bytes")

        if len(ciphertext) != self._kem.details["length_ciphertext"]:
            raise InvalidKeyError(
                f"Invalid ciphertext size: expected "
                f"{self._kem.details['length_ciphertext']}, "
                f"got {len(ciphertext)}"
            )

        try:
            with oqs.KeyEncapsulation(self.ALGORITHM_NAME, secret_key) as kem:
                shared_secret = kem.decap_secret(ciphertext)
            return shared_secret
        except Exception as e:
            raise DecryptionError(f"Decapsulation failed: {e}")
