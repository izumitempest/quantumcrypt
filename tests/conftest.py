import os
import sys
from unittest.mock import MagicMock


def setup_mock_oqs():
    oqs_mock = MagicMock()

    # Mock KeyEncapsulation
    class MockKEM:
        def __init__(self, alg, sk=None):
            self.alg = alg
            self.sk = sk
            self.details = {
                "length_public_key": 1184 if "768" in alg else 1568,
                "length_ciphertext": 1088 if "768" in alg else 1568,
                "length_secret_key": 2400 if "768" in alg else 3168,
            }

        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

        def generate_keypair(self):
            return b"mock_pk_" + self.alg.encode()

        def export_secret_key(self):
            return b"mock_sk_" + self.alg.encode()

        def encap_secret(self, pk):
            return b"mock_ct_" + self.alg.encode(), b"mock_secret"

        def decap_secret(self, ct):
            return b"mock_secret"

    oqs_mock.KeyEncapsulation = MockKEM

    # Mock Signature
    class MockSig:
        def __init__(self, alg, sk=None):
            self.alg = alg
            self.sk = sk

        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

        def generate_keypair(self):
            return b"mock_pk_" + self.alg.encode()

        def export_secret_key(self):
            return b"mock_sk_" + self.alg.encode()

        def sign(self, msg):
            return b"mock_sig_for_" + msg[:5]

        def verify(self, msg, sig, pk):
            return b"mock_sig_for_" in sig

    oqs_mock.Signature = MockSig
    sys.modules["oqs"] = oqs_mock


# Aggressively inject mock before any imports in tests
try:
    import oqs

    # If import succeeds but it's a real library, we might still fail on first use
    # Try a simple init to see if it works
    oqs.KeyEncapsulation("Kyber768")
except (ImportError, RuntimeError, Exception):
    setup_mock_oqs()
