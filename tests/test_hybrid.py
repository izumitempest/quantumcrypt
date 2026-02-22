import pytest
from quantumcrypt import SecureChannel


def test_hybrid_roundtrip():
    # Create a hybrid channel
    # Note: SecureChannel needs to be updated to accept hybrid=True in .create()
    # For now we'll test the logic if we can
    channel = SecureChannel(hybrid=True)
    plaintext = b"Hybrid secret message"

    encrypted = channel.encrypt(plaintext)

    # Check if flags indicate hybrid (second byte)
    assert encrypted[1] == 0x01

    decrypted = channel.decrypt(encrypted)
    assert decrypted == plaintext


def test_hybrid_vs_non_hybrid():
    hybrid_ch = SecureChannel(hybrid=True)
    normal_ch = SecureChannel(hybrid=False)

    msg = b"test"

    ct_hybrid = hybrid_ch.encrypt(msg)
    ct_normal = normal_ch.encrypt(msg)

    # Hybrid package should be longer (contains X25519 ephemeral PK)
    assert len(ct_hybrid) > len(ct_normal)

    # Cross-decryption should fail
    with pytest.raises(Exception):
        hybrid_ch.decrypt(ct_normal)

    with pytest.raises(Exception):
        normal_ch.decrypt(ct_hybrid)
