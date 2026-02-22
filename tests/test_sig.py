import pytest
from quantumcrypt.sig import MLDSA44, MLDSA65, MLDSA87


@pytest.mark.parametrize("sig_class", [MLDSA44, MLDSA65, MLDSA87])
def test_signature_roundtrip(sig_class):
    sig_engine = sig_class()
    keypair = sig_engine.generate_keypair()

    message = b"Test message for signing"
    signature = sig_engine.sign(message, keypair.secret_key)

    assert sig_engine.verify(message, signature, keypair.public_key) is True
    assert sig_engine.verify(b"tampered message", signature, keypair.public_key) is False


def test_signature_invalid_keys():
    sig_engine = MLDSA44()
    keypair = sig_engine.generate_keypair()
    other_keypair = sig_engine.generate_keypair()

    message = b"Test message"
    signature = sig_engine.sign(message, keypair.secret_key)

    # Verification with wrong public key should fail
    assert sig_engine.verify(message, signature, other_keypair.public_key) is False
