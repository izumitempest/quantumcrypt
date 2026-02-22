import sys
import os
from unittest.mock import MagicMock

# Forcefully mock oqs before anything else imports it
oqs_mock = MagicMock()


# Improved MockKEM to behave more like the stateful liboqs class
class BetterMockKEM:
    def __init__(self, alg, sk=None):
        self.alg = alg
        self.sk = sk
        self._last_sk = sk
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
        token = os.urandom(8).hex().encode()
        self._last_pk = b"PK_" + token + b"P" * (self.details["length_public_key"] - len(token) - 3)
        self._last_sk = b"SK_" + token + b"S" * (self.details["length_secret_key"] - len(token) - 3)
        return self._last_pk

    def export_secret_key(self):
        return self._last_sk

    def encap_secret(self, pk):
        token = pk[3:19]
        ct = b"CT_" + token + b"C" * (self.details["length_ciphertext"] - len(token) - 3)
        secret = b"S" * 16 + token  # 32 bytes
        return ct, secret

    def decap_secret(self, ct):
        sk_token = self.sk[3:19]
        ct_token = ct[3:19]
        if sk_token != ct_token:
            raise RuntimeError("MOCK: Decapsulation failed due to token mismatch")
        return b"S" * 16 + sk_token


oqs_mock.KeyEncapsulation = BetterMockKEM


class MockSig:
    def __init__(self, alg, sk=None):
        self.alg = alg
        self.sk = sk

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    def generate_keypair(self):
        token = os.urandom(8).hex().encode()
        self._last_pk = b"SIG_PK_" + token + b"P" * 10
        self._last_sk = b"SIG_SK_" + token + b"S" * 10
        return self._last_pk

    def export_secret_key(self):
        return self._last_sk

    def sign(self, msg):
        token = self.sk[7:23] if self.sk else b"UNKNOWN"
        return b"SIG_FOR_" + token + b"_" + msg

    def verify(self, msg, sig, pk):
        token = pk[7:23]
        expected = b"SIG_FOR_" + token + b"_" + msg
        return sig == expected


oqs_mock.Signature = MockSig
sys.modules["oqs"] = oqs_mock

# Now run pytest
import pytest

sys.exit(pytest.main(["tests/"]))
