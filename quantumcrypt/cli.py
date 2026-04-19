"""
Command-line interface for QuantumCrypt.
"""

import argparse
import sys
import json
import os
import getpass
from quantumcrypt import SecureChannel
from quantumcrypt.kem import KeyPair, MLKEM768, MLKEM1024
from quantumcrypt.sig import MLDSA44, MLDSA65, MLDSA87
from quantumcrypt.exceptions import EncryptionError, DecryptionError


def check_overwrite(filepath):
    """Check if file exists and ask for confirmation to overwrite."""
    if os.path.exists(filepath):
        resp = input(f"File '{filepath}' already exists. Overwrite? [y/N]: ")
        if resp.lower() != "y":
            print("Operation cancelled.")
            sys.exit(1)


def cmd_keygen(args):
    """Handle keypair generation."""
    if args.type == "kem":
        engine = MLKEM1024() if args.alg == "ML-KEM-1024" else MLKEM768()
    else:
        if args.alg == "ML-DSA-44":
            engine = MLDSA44()
        elif args.alg == "ML-DSA-87":
            engine = MLDSA87()
        else:
            engine = MLDSA65()

    kp = engine.generate_keypair()
    
    # Prompt for password to secure the key
    print("WARNING: Secret keys should be encrypted for storage.")
    pwd = getpass.getpass("Enter password to encrypt secret key (leave blank for unencrypted hex): ")
    password = pwd if pwd.strip() else None

    data = kp.to_dict(password=password)

    if args.out:
        check_overwrite(args.out)
        flags = os.O_CREAT | os.O_WRONLY | os.O_TRUNC
        fd = os.open(args.out, flags, 0o600)
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, indent=2)
        print(f"Keypair saved securely to {args.out} (0600)")
    else:
        print(json.dumps(data, indent=2))


def cmd_encrypt(args):
    """Handle file encryption."""
    with open(args.input, "rb") as f:
        plaintext = f.read()

    if args.key:
        with open(args.key, "r") as f:
            key_data = json.load(f)
            
        password = None
        if key_data.get("encrypted"):
            password = getpass.getpass("Enter password to decrypt key: ")
            
        kp = KeyPair.from_dict(key_data, password=password)
        channel = SecureChannel(keypair=kp, algorithm=kp.algorithm, hybrid=args.hybrid)
    else:
        channel = SecureChannel.create(hybrid=args.hybrid)
        print("Warning: Fresh keypair generated. You will need the public key to decrypt.")

    try:
        package = channel.encrypt(plaintext)
        check_overwrite(args.output)
        with open(args.output, "wb") as f:
            f.write(package)
        print(f"Encrypted data saved to {args.output}")
    except EncryptionError as e:
        print(f"Error: {e}")
        sys.exit(1)


def cmd_decrypt(args):
    """Handle file decryption."""
    with open(args.input, "rb") as f:
        package = f.read()

    with open(args.key, "r") as f:
        key_data = json.load(f)
        
    password = None
    if key_data.get("encrypted"):
        password = getpass.getpass("Enter password to decrypt secret key: ")
        
    kp = KeyPair.from_dict(key_data, password=password)

    channel = SecureChannel(keypair=kp, algorithm=kp.algorithm)

    try:
        plaintext = channel.decrypt(package)
        check_overwrite(args.output)
        with open(args.output, "wb") as f:
            f.write(plaintext)
        print(f"Decrypted data saved to {args.output}")
    except DecryptionError as e:
        print(f"Error: {e}")
        sys.exit(1)


def cmd_sign(args):
    """Handle file signing."""
    with open(args.input, "rb") as f:
        data = f.read()

    with open(args.key, "r") as f:
        key_data = json.load(f)
        
    password = None
    if key_data.get("encrypted"):
        password = getpass.getpass("Enter password to decrypt secret key: ")
        
    kp = KeyPair.from_dict(key_data, password=password)

    if "ML-DSA-44" in kp.algorithm:
        engine = MLDSA44()
    elif "ML-DSA-87" in kp.algorithm:
        engine = MLDSA87()
    else:
        engine = MLDSA65()

    try:
        signature = engine.sign(data, kp.secret_key)
        check_overwrite(args.output)
        with open(args.output, "wb") as f:
            f.write(signature)
        print(f"Signature saved to {args.output}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def cmd_verify(args):
    """Handle signature verification."""
    with open(args.input, "rb") as f:
        data = f.read()

    with open(args.sig, "rb") as f:
        signature = f.read()

    with open(args.key, "r") as f:
        key_data = json.load(f)
        
    password = None
    if key_data.get("encrypted"):
        password = getpass.getpass("Enter password to load key: ")
        
    kp = KeyPair.from_dict(key_data, password=password)

    if "ML-DSA-44" in kp.algorithm:
        engine = MLDSA44()
    elif "ML-DSA-87" in kp.algorithm:
        engine = MLDSA87()
    else:
        engine = MLDSA65()

    if engine.verify(data, signature, kp.public_key):
        print("Verification SUCCESSFUL ✅")
    else:
        print("Verification FAILED ❌")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="QuantumCrypt CLI Utility")
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Keygen
    kp_parser = subparsers.add_parser("keygen", help="Generate a new keypair")
    kp_parser.add_argument("--type", choices=["kem", "sig"], default="kem", help="Key type")
    kp_parser.add_argument("--alg", help="Algorithm name")
    kp_parser.add_argument("--out", help="Output JSON file")

    # Encrypt
    enc_parser = subparsers.add_parser("encrypt", help="Encrypt a file")
    enc_parser.add_argument("input", help="Input file")
    enc_parser.add_argument("output", help="Output file")
    enc_parser.add_argument(
        "--key", help="Public key JSON file (optional, generates fresh if missing)"
    )
    enc_parser.add_argument("--hybrid", action="store_true", help="Enable hybrid mode")

    # Decrypt
    dec_parser = subparsers.add_parser("decrypt", help="Decrypt a file")
    dec_parser.add_argument("input", help="Input file")
    dec_parser.add_argument("output", help="Output file")
    dec_parser.add_argument("--key", required=True, help="Secret key JSON file")

    # Sign
    sig_parser = subparsers.add_parser("sign", help="Sign a file")
    sig_parser.add_argument("input", help="Input file")
    sig_parser.add_argument("output", help="Output signature file")
    sig_parser.add_argument("--key", required=True, help="Secret key JSON file")

    # Verify
    ver_parser = subparsers.add_parser("verify", help="Verify a signature")
    ver_parser.add_argument("input", help="Input file")
    ver_parser.add_argument("--sig", required=True, help="Signature file")
    ver_parser.add_argument("--key", required=True, help="Public key JSON file")

    args = parser.parse_args()

    if args.command == "keygen":
        cmd_keygen(args)
    elif args.command == "encrypt":
        cmd_encrypt(args)
    elif args.command == "decrypt":
        cmd_decrypt(args)
    elif args.command == "sign":
        cmd_sign(args)
    elif args.command == "verify":
        cmd_verify(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
