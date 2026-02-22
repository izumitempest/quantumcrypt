import pytest
from unittest.mock import patch, MagicMock
from quantumcrypt.cli import main
import sys
import json
import os


@pytest.fixture
def mock_args():
    return ["quantumcrypt"]


def test_keygen_cli(mock_args, tmp_path):
    key_file = tmp_path / "keys.json"
    with patch("sys.argv", mock_args + ["keygen", "--out", str(key_file)]):
        main()

    assert key_file.exists()
    with open(key_file, "r") as f:
        data = json.load(f)
    assert "public_key" in data
    assert "secret_key" in data


def test_encrypt_decrypt_cli_flow(mock_args, tmp_path):
    key_file = tmp_path / "keys.json"
    input_file = tmp_path / "hello.txt"
    enc_file = tmp_path / "hello.enc"
    dec_file = tmp_path / "hello.dec"

    input_file.write_text("Secret Message")

    # 1. Keygen
    with patch("sys.argv", mock_args + ["keygen", "--out", str(key_file)]):
        main()

    # 2. Encrypt
    with patch(
        "sys.argv", mock_args + ["encrypt", str(input_file), str(enc_file), "--key", str(key_file)]
    ):
        main()

    assert enc_file.exists()

    # 3. Decrypt
    with patch(
        "sys.argv", mock_args + ["decrypt", str(enc_file), str(dec_file), "--key", str(key_file)]
    ):
        main()

    assert dec_file.exists()
    assert dec_file.read_text() == "Secret Message"


def test_hybrid_encrypt_cli_flow(mock_args, tmp_path):
    key_file = tmp_path / "keys.json"
    input_file = tmp_path / "hello.txt"
    enc_file = tmp_path / "hello.enc"

    input_file.write_text("Hybrid Message")

    # 1. Keygen
    with patch("sys.argv", mock_args + ["keygen", "--out", str(key_file)]):
        main()

    # 2. Encrypt Hybrid
    with patch(
        "sys.argv",
        mock_args + ["encrypt", str(input_file), str(enc_file), "--key", str(key_file), "--hybrid"],
    ):
        main()

    assert enc_file.exists()
    # Check flags (second byte) - should be 0x01
    with open(enc_file, "rb") as f:
        package = f.read()
        assert package[1] == 0x01


def test_sign_verify_cli_flow(mock_args, tmp_path):
    key_file = tmp_path / "sig_keys.json"
    input_file = tmp_path / "data.txt"
    sig_file = tmp_path / "data.sig"

    input_file.write_text("Important Data")

    # 1. Keygen SIG
    with patch(
        "sys.argv",
        mock_args + ["keygen", "--type", "sig", "--alg", "ML-DSA-65", "--out", str(key_file)],
    ):
        main()

    # 2. Sign
    with patch(
        "sys.argv", mock_args + ["sign", str(input_file), str(sig_file), "--key", str(key_file)]
    ):
        main()

    assert sig_file.exists()

    # 3. Verify
    with patch(
        "sys.argv",
        mock_args + ["verify", str(input_file), "--sig", str(sig_file), "--key", str(key_file)],
    ):
        # We capture stdout to check for success message
        with patch("sys.stdout") as mock_stdout:
            main()
            # print logic in verify: print("Verification SUCCESSFUL ✅")
            any_call_success = any("SUCCESSFUL" in str(call) for call in mock_stdout.mock_calls)
            assert any_call_success
