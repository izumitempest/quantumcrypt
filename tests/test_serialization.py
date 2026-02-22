import pytest
from quantumcrypt.kem import MLKEM768


def test_keypair_serialization_roundtrip():
    kem = MLKEM768()
    keypair = kem.generate_keypair()

    # Serialize to dict
    data = keypair.to_dict()
    assert data["algorithm"] == "ML-KEM-768"
    assert "public_key" in data
    assert "secret_key" in data

    # Deserialize from dict
    new_keypair = keypair.from_dict(data)
    assert new_keypair.algorithm == keypair.algorithm
    assert new_keypair.public_key == keypair.public_key
    assert new_keypair.secret_key == keypair.secret_key


def test_public_key_only_serialization():
    kem = MLKEM768()
    kp = kem.generate_keypair()

    # Simulate public key only (e.g. from recipient)
    from quantumcrypt.kem import KeyPair

    public_only = KeyPair(kp.public_key, b"", kp.algorithm)

    data = public_only.to_dict()
    assert data["secret_key"] is None or data["secret_key"] == ""

    restored = KeyPair.from_dict(data)
    assert restored.public_key == kp.public_key
    assert restored.secret_key == b""
