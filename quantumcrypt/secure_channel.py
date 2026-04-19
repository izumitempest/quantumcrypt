"""
High-level SecureChannel API for easy encryption/decryption.

This is the main interface most developers should use. It provides simple,
secure defaults while hiding cryptographic complexity.
"""

from typing import Tuple
from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import os

from cryptography.hazmat.primitives.asymmetric import x25519
from quantumcrypt.kem import MLKEM768, MLKEM1024, KeyPair
from quantumcrypt.exceptions import EncryptionError, DecryptionError


class SecureSession:
    """
    A lightweight, symmetric session for encrypting multiple messages.
    
    Instead of performing a heavy KEM encapsulation per-message,
    use SecureChannel.initiate_session() to generate a SecureSession, 
    and encrypt subsequent messages symmetrically.
    """
    def __init__(self, aes_key: bytes):
        self._aes_key = aes_key
        self._aesgcm = AESGCM(self._aes_key)

    def encrypt(self, plaintext: bytes) -> bytes:
        """Symmetrically encrypt a message."""
        nonce = os.urandom(12)
        ciphertext = self._aesgcm.encrypt(nonce, plaintext, None)
        return nonce + ciphertext

    def decrypt(self, package: bytes) -> bytes:
        """Symmetrically decrypt a message."""
        if len(package) < 28: # 12 nonce + 16 MAC minimum 
            raise DecryptionError("Package too short")
        nonce = package[:12]
        ciphertext = package[12:]
        try:
            return self._aesgcm.decrypt(nonce, ciphertext, None)
        except Exception as e:
            raise DecryptionError(f"Session decryption failed: {e}")


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
        hybrid: bool = False,
    ):
        """
        Initialize a SecureChannel.

        Args:
            keypair: Optional pre-generated keypair. If None, will generate new one.
            algorithm: KEM algorithm to use ("ML-KEM-768" or "ML-KEM-1024")
            hybrid: Hybrid mode (currently not implemented, will raise NotImplementedError if True)
        """
        self.algorithm = algorithm
        self.keypair: Optional[KeyPair] = keypair
        self.hybrid = hybrid
        self.x25519_key = None

        if self.hybrid:
            raise NotImplementedError(
                "Hybrid mode is disabled in this beta. Proper static X25519 key packaging "
                "is planned for v0.2.0. Do not use simulated classical secrets."
            )

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
    def create(cls, algorithm: str = "ML-KEM-768", hybrid: bool = False) -> "SecureChannel":
        """
        Create a new SecureChannel with a fresh keypair.

        This is the recommended way to create a SecureChannel. It automatically
        generates a new keypair using the specified algorithm.

        Args:
            algorithm: KEM algorithm ("ML-KEM-768" or "ML-KEM-1024")
            hybrid: Whether to use hybrid encryption mode (default: False)

        Returns:
            Initialized SecureChannel ready for encryption

        Example:
            >>> channel = SecureChannel.create()
            >>> encrypted = channel.encrypt(b"hello world")
        """
        return cls(algorithm=algorithm, hybrid=hybrid)

    @classmethod
    def from_public_key(cls, public_key: bytes, algorithm: str = "ML-KEM-768") -> "SecureChannel":
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
            kem_ciphertext, shared_secret = self._kem.encapsulate(self.keypair.public_key)

            # Step 2: Derive AES key from shared secret using HKDF
            aes_key = HKDF(
                algorithm=hashes.SHA256(),
                length=32,  # 256 bits for AES-256
                salt=None,
                info=b"quantumcrypt-aes-key",
            ).derive(shared_secret)

            # Step 3: Construct cryptographic header
            flags = 0x00
            kem_ct_len = len(kem_ciphertext).to_bytes(4, "big")
            header = b"\x01" + bytes([flags]) + kem_ct_len + kem_ciphertext

            # Step 4: Encrypt plaintext with AES-256-GCM using header as AAD
            nonce = os.urandom(12)  # 96-bit nonce for GCM
            aesgcm = AESGCM(aes_key)
            ciphertext = aesgcm.encrypt(nonce, plaintext, header)

            # Step 5: Package everything together
            package = header + nonce + ciphertext

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
            if len(package) < 6:  # min size: version(1) + flags(1) + ct_len(4)
                raise DecryptionError("Invalid package: too short")

            version = package[0]
            flags = package[1]
            if version != 1:
                raise DecryptionError(f"Unsupported package version: {version}")

            kem_ct_len = int.from_bytes(package[2:6], "big")
            
            # Security Fix: Prevent DoS via unbounded length slicing
            expected_ct_len = self._kem.details["length_ciphertext"]
            if kem_ct_len != expected_ct_len:
                raise DecryptionError(f"Invalid KEM ciphertext length: expected {expected_ct_len}, got {kem_ct_len}")

            offset = 6

            kem_ciphertext = package[offset : offset + kem_ct_len]
            offset += kem_ct_len

            # Reconstruct the header for AAD verification
            header = package[:offset]

            nonce = package[offset : offset + 12]
            offset += 12

            ciphertext = package[offset:]

            # Step 2: Recover shared secret using ML-KEM
            shared_secret = self._kem.decapsulate(self.keypair.secret_key, kem_ciphertext)

            # Step 3: Derive AES key from shared secret
            aes_key = HKDF(
                algorithm=hashes.SHA256(),
                length=32,
                salt=None,
                info=b"quantumcrypt-aes-key",
            ).derive(shared_secret)

            # Step 4: Decrypt ciphertext with AES-256-GCM using AAD verification
            aesgcm = AESGCM(aes_key)
            plaintext = aesgcm.decrypt(nonce, ciphertext, header)

            return plaintext

        except Exception as e:
            raise DecryptionError(f"Decryption failed: {e}")

    def initiate_session(self) -> Tuple[bytes, SecureSession]:
        """
        Establish a symmetric session to avoid per-message KEM overhead.
        
        Returns:
            Tuple containing the KEM ciphertext (handshake packet) to send to receiver,
            and the SecureSession object for symmetric message encryption.
        """
        if self.keypair is None:
            raise EncryptionError("No keypair available")
            
        kem_ciphertext, shared_secret = self._kem.encapsulate(self.keypair.public_key)
        aes_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b"quantumcrypt-aes-key",
        ).derive(shared_secret)
        
        return kem_ciphertext, SecureSession(aes_key)

    def accept_session(self, kem_ciphertext: bytes) -> SecureSession:
        """
        Accept a KEM handshake and return a symmetric SecureSession.
        """
        if self.keypair is None or not self.keypair.secret_key:
            raise DecryptionError("No secret key available")
            
        shared_secret = self._kem.decapsulate(self.keypair.secret_key, kem_ciphertext)
        aes_key = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b"quantumcrypt-aes-key",
        ).derive(shared_secret)
        
        return SecureSession(aes_key)

    def __repr__(self) -> str:
        has_secret = bool(self.keypair and self.keypair.secret_key)
        return f"SecureChannel(algorithm='{self.algorithm}', " f"can_decrypt={has_secret})"
