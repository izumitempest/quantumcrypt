"""
Unit tests for SecureChannel high-level API.
"""

import pytest
from quantumcrypt import SecureChannel
from quantumcrypt.exceptions import EncryptionError, DecryptionError


class TestSecureChannel:
    """Tests for SecureChannel class."""

    def test_create_channel(self):
        """Test creating a new SecureChannel."""
        channel = SecureChannel.create()

        assert channel is not None
        assert channel.algorithm == "ML-KEM-768"
        assert channel.keypair is not None
        assert len(channel.keypair.public_key) > 0
        assert len(channel.keypair.secret_key) > 0

    def test_create_with_ml_kem_1024(self):
        """Test creating channel with ML-KEM-1024."""
        channel = SecureChannel.create(algorithm="ML-KEM-1024")

        assert channel.algorithm == "ML-KEM-1024"
        # Larger keys for higher security level
        assert len(channel.keypair.public_key) > 1184

    def test_encryption_decryption_roundtrip(self):
        """Test that encryption and decryption work correctly."""
        channel = SecureChannel.create()
        plaintext = b"Hello, quantum-resistant world!"

        # Encrypt
        encrypted = channel.encrypt(plaintext)

        # Decrypt
        decrypted = channel.decrypt(encrypted)

        assert decrypted == plaintext

    def test_encryption_produces_different_ciphertexts(self):
        """Test that encrypting the same data twice produces different ciphertexts."""
        channel = SecureChannel.create()
        plaintext = b"same message"

        encrypted1 = channel.encrypt(plaintext)
        encrypted2 = channel.encrypt(plaintext)

        # Should be different due to random nonce
        assert encrypted1 != encrypted2

        # But both should decrypt to same plaintext
        assert channel.decrypt(encrypted1) == plaintext
        assert channel.decrypt(encrypted2) == plaintext

    def test_encrypt_various_sizes(self):
        """Test encryption with different message sizes."""
        channel = SecureChannel.create()

        test_cases = [
            b"x",  # 1 byte
            b"short",  # small
            b"a" * 1000,  # medium
            b"b" * 100_000,  # large
        ]

        for plaintext in test_cases:
            encrypted = channel.encrypt(plaintext)
            decrypted = channel.decrypt(encrypted)
            assert decrypted == plaintext, f"Failed for {len(plaintext)} bytes"

    def test_encrypt_empty_message(self):
        """Test encrypting empty message."""
        channel = SecureChannel.create()

        encrypted = channel.encrypt(b"")
        decrypted = channel.decrypt(encrypted)

        assert decrypted == b""

    def test_from_public_key(self):
        """Test creating channel from public key for encryption."""
        # Receiver generates keypair
        receiver = SecureChannel.create()
        public_key = receiver.keypair.public_key

        # Sender uses receiver's public key
        sender = SecureChannel.from_public_key(public_key)

        # Sender encrypts
        plaintext = b"secret message"
        encrypted = sender.encrypt(plaintext)

        # Receiver decrypts
        decrypted = receiver.decrypt(encrypted)

        assert decrypted == plaintext

    def test_wrong_key_decryption_fails(self):
        """Test that decryption with wrong key fails."""
        channel1 = SecureChannel.create()
        channel2 = SecureChannel.create()

        plaintext = b"secret"
        encrypted = channel1.encrypt(plaintext)

        # Try to decrypt with different channel's key
        with pytest.raises(DecryptionError):
            channel2.decrypt(encrypted)

    def test_corrupted_ciphertext_fails(self):
        """Test that corrupted ciphertext fails to decrypt (AES-GCM Tag Failure)."""
        channel = SecureChannel.create()
        encrypted = bytearray(channel.encrypt(b"test"))

        # Mutate the AES-GCM MAC at the very end
        encrypted[-1] ^= 0xFF

        with pytest.raises(DecryptionError):
            channel.decrypt(bytes(encrypted))

    def test_header_malleability_fails(self):
        """Test that modifying the unencrypted header fails decryption."""
        channel = SecureChannel.create()
        encrypted = bytearray(channel.encrypt(b"test message"))

        # Mutate version (byte 0)
        encrypted[0] = 0x99
        with pytest.raises(DecryptionError):
            channel.decrypt(bytes(encrypted))
            
        encrypted[0] = 0x01 # restore
        
        # Mutate flags (byte 1)
        encrypted[1] ^= 0xFF
        with pytest.raises(DecryptionError):
            channel.decrypt(bytes(encrypted))

    def test_kem_ciphertext_corruption_fails(self):
        """Test that corrupting KEM layer fails properly."""
        channel = SecureChannel.create()
        encrypted = bytearray(channel.encrypt(b"test message"))

        # KEM CT starts at offset 6
        encrypted[6] ^= 0xFF  # Flip a bit in KEM CT

        with pytest.raises(DecryptionError):
            channel.decrypt(bytes(encrypted))

    def test_invalid_package_format_fails(self):
        """Test that invalid package format raises error."""
        channel = SecureChannel.create()

        with pytest.raises(DecryptionError):
            channel.decrypt(b"too short")

        with pytest.raises(DecryptionError):
            channel.decrypt(b"x" * 10)

    def test_encrypt_non_bytes_raises_error(self):
        """Test that encrypting non-bytes raises TypeError."""
        channel = SecureChannel.create()

        with pytest.raises(TypeError):
            channel.encrypt("string")  # type: ignore

        with pytest.raises(TypeError):
            channel.encrypt(12345)  # type: ignore

    def test_decrypt_non_bytes_raises_error(self):
        """Test that decrypting non-bytes raises TypeError."""
        channel = SecureChannel.create()

        with pytest.raises(TypeError):
            channel.decrypt("string")  # type: ignore

    def test_channel_repr(self):
        """Test string representation of SecureChannel."""
        channel = SecureChannel.create()
        repr_str = repr(channel)

        assert "SecureChannel" in repr_str
        assert "ML-KEM-768" in repr_str
        assert "can_decrypt=True" in repr_str


class TestSecureChannelIntegration:
    """Integration tests for real-world usage scenarios."""

    def test_sender_receiver_flow(self):
        """Test complete sender-receiver communication flow."""
        # 1. Receiver generates keypair and shares public key
        receiver = SecureChannel.create()
        receiver_public_key = receiver.keypair.public_key

        # 2. Sender creates channel with receiver's public key
        sender = SecureChannel.from_public_key(receiver_public_key)

        # 3. Sender encrypts multiple messages
        messages = [
            b"Message 1: Hello",
            b"Message 2: How are you?",
            b"Message 3: Secret data",
        ]

        encrypted_messages = [sender.encrypt(msg) for msg in messages]

        # 4. Receiver decrypts all messages
        for i, encrypted in enumerate(encrypted_messages):
            decrypted = receiver.decrypt(encrypted)
            assert decrypted == messages[i]

    def test_multiple_channels_independent(self):
        """Test that multiple channels are independent and don't interfere."""
        alice = SecureChannel.create()
        bob = SecureChannel.create()
        charlie = SecureChannel.create()

        # Each encrypts their own message
        alice_msg = alice.encrypt(b"Alice's secret")
        bob_msg = bob.encrypt(b"Bob's secret")
        charlie_msg = charlie.encrypt(b"Charlie's secret")

        # Each can only decrypt their own
        assert alice.decrypt(alice_msg) == b"Alice's secret"
        assert bob.decrypt(bob_msg) == b"Bob's secret"
        assert charlie.decrypt(charlie_msg) == b"Charlie's secret"

        # Cross-decryption fails
        with pytest.raises(DecryptionError):
            alice.decrypt(bob_msg)

        with pytest.raises(DecryptionError):
            bob.decrypt(charlie_msg)
