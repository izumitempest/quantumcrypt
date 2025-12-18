"""
Basic encryption and decryption example using QuantumCrypt.

This demonstrates the simplest way to use QuantumCrypt for secure communication.
"""

from quantumcrypt import SecureChannel


def main():
    print("QuantumCrypt - Basic Encryption Example")
    print("=" * 50)

    # Create a secure channel (generates keypair automatically)
    channel = SecureChannel.create()
    print(f"\n✓ Created {channel}")

    # Original message
    message = b"Hello, this is a quantum-resistant encrypted message!"
    print(f"\n📝 Original message: {message.decode()}")

    # Encrypt the message
    encrypted = channel.encrypt(message)
    print(f"\n🔒 Encrypted ({len(encrypted)} bytes)")
    print(f"   First 50 bytes: {encrypted[:50].hex()}...")

    # Decrypt the message
    decrypted = channel.decrypt(encrypted)
    print(f"\n🔓 Decrypted: {decrypted.decode()}")

    # Verify
    assert decrypted == message
    print("\n✅ Success! Message encrypted and decrypted correctly.")

    # Show key sizes
    print(f"\n📊 Key sizes:")
    print(f"   Public key:  {len(channel.keypair.public_key):,} bytes")
    print(f"   Secret key:  {len(channel.keypair.secret_key):,} bytes")
    print(f"   Ciphertext:  {len(encrypted):,} bytes")
    print(f"   Overhead:    {len(encrypted) - len(message):,} bytes")


if __name__ == "__main__":
    main()
