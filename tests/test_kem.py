"""
Unit tests for KEM (Key Encapsulation Mechanism) implementations.
"""

import pytest
from quantumcrypt.kem import MLKEM768, MLKEM1024, KeyPair
from quantumcrypt.exceptions import (
    KeyGenerationError,
    EncryptionError,
    DecryptionError,
    InvalidKeyError,
)


class TestMLKEM768:
    """Tests for ML-KEM-768 implementation."""

    def test_keypair_generation(self):
        """Test that keypair generation works and produces valid keys."""
        kem = MLKEM768()
        keypair = kem.generate_keypair()

        assert isinstance(keypair, KeyPair)
        assert isinstance(keypair.public_key, bytes)
        assert isinstance(keypair.secret_key, bytes)
        assert len(keypair.public_key) > 0
        assert len(keypair.secret_key) > 0
        assert keypair.algorithm == "ML-KEM-768"

    def test_encapsulation_decapsulation_roundtrip(self):
        """Test that encapsulation and decapsulation recover the same secret."""
        kem = MLKEM768()
        keypair = kem.generate_keypair()

        # Encapsulate
        ciphertext, shared_secret = kem.encapsulate(keypair.public_key)

        # Decapsulate
        recovered_secret = kem.decapsulate(keypair.secret_key, ciphertext)

        # Verify secrets match
        assert shared_secret == recovered_secret
        assert len(shared_secret) == 32  # 256-bit shared secret

    def test_different_keypairs_produce_different_secrets(self):
        """Test that different keypairs produce different shared secrets."""
        kem = MLKEM768()

        keypair1 = kem.generate_keypair()
        keypair2 = kem.generate_keypair()

        _, secret1 = kem.encapsulate(keypair1.public_key)
        _, secret2 = kem.encapsulate(keypair2.public_key)

        assert secret1 != secret2

    def test_invalid_public_key_raises_error(self):
        """Test that invalid public keys raise InvalidKeyError."""
        kem = MLKEM768()

        # Wrong type
        with pytest.raises(InvalidKeyError):
            kem.encapsulate("not bytes")  # type: ignore

        # Wrong size
        with pytest.raises(InvalidKeyError):
            kem.encapsulate(b"too short")

    def test_invalid_secret_key_raises_error(self):
        """Test that invalid secret keys raise InvalidKeyError."""
        kem = MLKEM768()
        keypair = kem.generate_keypair()
        ciphertext, _ = kem.encapsulate(keypair.public_key)

        # Wrong type
        with pytest.raises(InvalidKeyError):
            kem.decapsulate("not bytes", ciphertext)  # type: ignore

        # Wrong key
        wrong_key = b"x" * len(keypair.secret_key)
        with pytest.raises(DecryptionError):
            kem.decapsulate(wrong_key, ciphertext)

    def test_invalid_ciphertext_raises_error(self):
        """Test that invalid ciphertext raises InvalidKeyError."""
        kem = MLKEM768()
        keypair = kem.generate_keypair()

        # Wrong type
        with pytest.raises(InvalidKeyError):
            kem.decapsulate(keypair.secret_key, "not bytes")  # type: ignore

        # Wrong size
        with pytest.raises(InvalidKeyError):
            kem.decapsulate(keypair.secret_key, b"too short")


class TestMLKEM1024:
    """Tests for ML-KEM-1024 implementation."""

    def test_keypair_generation(self):
        """Test that keypair generation works for ML-KEM-1024."""
        kem = MLKEM1024()
        keypair = kem.generate_keypair()

        assert isinstance(keypair, KeyPair)
        assert keypair.algorithm == "ML-KEM-1024"
        # ML-KEM-1024 has larger keys than ML-KEM-768
        assert len(keypair.public_key) > 1184
        assert len(keypair.secret_key) > 2400

    def test_encapsulation_decapsulation_roundtrip(self):
        """Test roundtrip for ML-KEM-1024."""
        kem = MLKEM1024()
        keypair = kem.generate_keypair()

        ciphertext, shared_secret = kem.encapsulate(keypair.public_key)
        recovered_secret = kem.decapsulate(keypair.secret_key, ciphertext)

        assert shared_secret == recovered_secret
        assert len(shared_secret) == 32


class TestKeyPair:
    """Tests for KeyPair class."""

    def test_keypair_initialization(self):
        """Test KeyPair initialization."""
        public = b"public_key_data"
        secret = b"secret_key_data"
        algorithm = "ML-KEM-768"

        keypair = KeyPair(public, secret, algorithm)

        assert keypair.public_key == public
        assert keypair.secret_key == secret
        assert keypair.algorithm == algorithm

    def test_keypair_repr(self):
        """Test KeyPair string representation."""
        keypair = KeyPair(b"pub", b"secret", "ML-KEM-768")
        repr_str = repr(keypair)

        assert "ML-KEM-768" in repr_str
        assert "public_key_size=3" in repr_str
        assert "secret_key_size=6" in repr_str
