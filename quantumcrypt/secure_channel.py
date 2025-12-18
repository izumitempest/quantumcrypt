"""
High-level SecureChannel API for easy encryption/decryption.

This is the main interface most developers should use. It provides simple,
secure defaults while hiding cryptographic complexity.
"""

from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os

from quantumcrypt.kem import MLKEM768, MLKEM1024, KeyPair
from quantumcrypt.exceptions import EncryptionError, DecryptionError


class SecureChannel:
    """
    High-level API for quantum-resistant encryption and decryption.
    
    This class provides a simple interface for encrypting and decrypting data
    using post-quantum cryptography. It combines ML-KEM for key exchange with
    AES-256-GCM for data encryption.
    
    Example:
        >>> # Sender side
        >>> channel = SecureChannel.create()
        >>> encrypted_package = channel.encrypt(b"secret message")
        >>> 
        >>> # Send encrypted_package and channel.keypair.public_key to receiver
        >>> 
        >>> # Receiver side
        >>> received_channel = SecureChannel.from_public_key(public_key)
        >>> decrypted = received_channel.decrypt(encrypted_package)
    """

    def __init__(
        self,
        keypair: Optional[KeyPair] = None,
        algorithm: str = "ML-KEM-768",
    ):
        """
        Initialize a SecureChannel.
        
        Args:
            keypair: Optional pre-generated keypair. If None, will generate new one.
            algorithm: KEM algorithm to use ("ML-KEM-768" or "ML-KEM-1024")
        """
        self.algorithm = algorithm
        self.keypair: Optional[KeyPair] = keypair

        # Select KEM algorithm
        if algorithm == "ML-KEM-768":
            self._kem = MLKEM768()
        elif algorithm == "ML-KEM-1024":
            self._kem = MLKEM1024()
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")

        # Generate keypair if not provided
        if self.keypair is None:
            self.keypair = self._kem.generate_keypair()

    @classmethod
    def create(cls, algorithm: str = "ML-KEM-768") -> "SecureChannel":
        """
        Create a new SecureChannel with a fresh keypair.
        
        This is the recommended way to create a SecureChannel. It automatically
        generates a new keypair using the specified algorithm.
        
        Args:
            algorithm: KEM algorithm ("ML-KEM-768" or "ML-KEM-1024")
            
        Returns:
            Initialized SecureChannel ready for encryption
            
        Example:
            >>> channel = SecureChannel.create()
            >>> encrypted = channel.encrypt(b"hello world")
        """
        return cls(algorithm=algorithm)

    @classmethod
    def from_public_key(
        cls, public_key: bytes, algorithm: str = "ML-KEM-768"
    ) -> "SecureChannel":
        """
        Create a SecureChannel from a public key (for encryption only).
        
        Use this when you have received someone's public key and want to
        send them encrypted data.
        
        Args:
            public_key: Public key bytes from the recipient
            algorithm: KEM algorithm used to generate the public key
            
        Returns:
            SecureChannel that can encrypt (but not decrypt)
            
        Example:
            >>> # Receiver's key
            >>> receiver = SecureChannel.create()
            >>> public_key = receiver.keypair.public_key
            >>> 
            >>> # Sender uses receiver's public key
            >>> sender = SecureChannel.from_public_key(public_key)
            >>> encrypted = sender.encrypt(b"secret")
        """
        # Create a fake keypair with only the public key
        # This channel can only encrypt, not decrypt
        fake_keypair = KeyPair(public_key, b"", algorithm)
        return cls(keypair=fake_keypair, algorithm=algorithm)

    def encrypt(self, plaintext: bytes) -> bytes:
        """
        Encrypt data using post-quantum cryptography.
        
        This method:
        1. Generates a random shared secret using ML-KEM
        2. Derives an AES key from the shared secret
        3. Encrypts the plaintext with AES-256-GCM
        4. Returns ciphertext + nonce + KEM ciphertext
        
        Args:
            plaintext: Data to encrypt (bytes)
            
        Returns:
            Encrypted package containing all necessary data for decryption
            
        Raises:
            EncryptionError: If encryption fails
            
        Example:
            >>> channel = SecureChannel.create()
            >>> encrypted = channel.encrypt(b"secret message")
        """
        if not isinstance(plaintext, bytes):
            raise TypeError("Plaintext must be bytes")

        if self.keypair is None:
            raise EncryptionError("No keypair available")

        try:
            # Step 1: Use ML-KEM to generate shared secret
            kem_ciphertext, shared_secret = self._kem.encapsulate(
                self.keypair.public_key
            )

            # Step 2: Derive AES key from shared secret using HKDF
            aes_key = HKDF(
                algorithm=hashes.SHA256(),
                length=32,  # 256 bits for AES-256
                salt=None,
                info=b"quantumcrypt-aes-key",
            ).derive(shared_secret)

            # Step 3: Encrypt plaintext with AES-256-GCM
            nonce = os.urandom(12)  # 96-bit nonce for GCM
            aesgcm = AESGCM(aes_key)
            ciphertext = aesgcm.encrypt(nonce, plaintext, None)

            # Step 4: Package everything together
            # Format: [kem_ciphertext_length (4 bytes)][kem_ciphertext][nonce (12 bytes)][ciphertext]
            kem_ct_len = len(kem_ciphertext).to_bytes(4, "big")
            package = kem_ct_len + kem_ciphertext + nonce + ciphertext

            return package

        except Exception as e:
            raise EncryptionError(f"Encryption failed: {e}")

    def decrypt(self, package: bytes) -> bytes:
        """
        Decrypt data encrypted with encrypt().
        
        This method reverses the encryption process:
        1. Extracts the KEM ciphertext
        2. Recovers the shared secret using ML-KEM
        3. Derives the AES key
        4. Decrypts the data with AES-256-GCM
        
        Args:
            package: Encrypted package from encrypt()
            
        Returns:
            Original plaintext bytes
            
        Raises:
            DecryptionError: If decryption fails or package is invalid
            
        Example:
            >>> channel = SecureChannel.create()
            >>> encrypted = channel.encrypt(b"secret")
            >>> decrypted = channel.decrypt(encrypted)
            >>> assert decrypted == b"secret"
        """
        if not isinstance(package, bytes):
            raise TypeError("Package must be bytes")

        if self.keypair is None or not self.keypair.secret_key:
            raise DecryptionError("No secret key available for decryption")

        try:
            # Step 1: Unpack the encrypted package
            if len(package) < 4:
                raise DecryptionError("Invalid package: too short")

            kem_ct_len = int.from_bytes(package[:4], "big")
            offset = 4

            if len(package) < offset + kem_ct_len + 12:
                raise DecryptionError("Invalid package: incomplete data")

            kem_ciphertext = package[offset : offset + kem_ct_len]
            offset += kem_ct_len

            nonce = package[offset : offset + 12]
            offset += 12

            ciphertext = package[offset:]

            # Step 2: Recover shared secret using ML-KEM
            shared_secret = self._kem.decapsulate(
                self.keypair.secret_key, kem_ciphertext
            )

            # Step 3: Derive AES key from shared secret
            aes_key = HKDF(
                algorithm=hashes.SHA256(),
                length=32,
                salt=None,
                info=b"quantumcrypt-aes-key",
            ).derive(shared_secret)

            # Step 4: Decrypt ciphertext with AES-256-GCM
            aesgcm = AESGCM(aes_key)
            plaintext = aesgcm.decrypt(nonce, ciphertext, None)

            return plaintext

        except Exception as e:
            raise DecryptionError(f"Decryption failed: {e}")

    def __repr__(self) -> str:
        has_secret = bool(self.keypair and self.keypair.secret_key)
        return (
            f"SecureChannel(algorithm='{self.algorithm}', "
            f"can_decrypt={has_secret})"
        )
