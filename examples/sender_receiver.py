"""
Sender-receiver communication example.

This demonstrates how two parties can communicate securely using QuantumCrypt.
The receiver generates a keypair and shares their public key. The sender uses
that public key to encrypt messages that only the receiver can decrypt.
"""

from quantumcrypt import SecureChannel


def main():
    print("QuantumCrypt - Sender-Receiver Example")
    print("=" * 50)

    # === RECEIVER SIDE ===
    print("\n👤 RECEIVER: Generating keypair...")
    receiver = SecureChannel.create()
    receiver_public_key = receiver.keypair.public_key
    print(f"✓ Generated keypair ({len(receiver_public_key)} byte public key)")

    # Receiver shares public key with sender (e.g., over the internet)
    print("\n📤 RECEIVER → SENDER: Sharing public key")

    # === SENDER SIDE ===
    print("\n👤 SENDER: Received public key, creating secure channel...")
    sender = SecureChannel.from_public_key(receiver_public_key)
    print("✓ Created sender channel")

    # Sender encrypts messages
    messages = [
        b"Message 1: Hello from the sender!",
        b"Message 2: This is a secure channel.",
        b"Message 3: Only you can read this.",
    ]

    encrypted_messages = []
    for i, msg in enumerate(messages, 1):
        encrypted = sender.encrypt(msg)
        encrypted_messages.append(encrypted)
        print(f"\n🔒 SENDER: Encrypted message {i} ({len(encrypted)} bytes)")

    # Send encrypted messages to receiver
    print("\n📤 SENDER → RECEIVER: Sending encrypted messages")

    # === RECEIVER SIDE ===
    print("\n👤 RECEIVER: Decrypting messages...")
    for i, encrypted in enumerate(encrypted_messages, 1):
        decrypted = receiver.decrypt(encrypted)
        print(f"\n🔓 Message {i}: {decrypted.decode()}")

    print("\n✅ Success! All messages transmitted securely.")


if __name__ == "__main__":
    main()
