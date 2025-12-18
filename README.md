# QuantumCrypt 🔐

**Developer-friendly Python library for post-quantum cryptography**

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-beta-orange)](https://github.com/quantumcrypt/quantumcrypt)

QuantumCrypt provides quantum-resistant encryption methods based on NIST-approved algorithms, with a focus on ease of use and practical integration into modern Python applications.

## Why QuantumCrypt?

🚀 **Simple API** - Get started with 3 lines of code  
🔒 **Quantum-Resistant** - Uses NIST-standardized ML-KEM (formerly Kyber)  
🛡️ **Secure by Default** - Combines ML-KEM with AES-256-GCM  
📦 **Zero Config** - Works out of the box with sensible defaults  
🎯 **Type-Safe** - Full type hints for IDE support

## Quick Start

```bash
pip install quantumcrypt
```

### Basic Usage

```python
from quantumcrypt import SecureChannel

# Create a secure channel
channel = SecureChannel.create()

# Encrypt data
encrypted = channel.encrypt(b"secret message")

# Decrypt data
decrypted = channel.decrypt(encrypted)
```

### Sender-Receiver Communication

```python
from quantumcrypt import SecureChannel

# Receiver generates keypair
receiver = SecureChannel.create()
public_key = receiver.keypair.public_key

# Sender uses receiver's public key
sender = SecureChannel.from_public_key(public_key)
encrypted = sender.encrypt(b"secret message")

# Receiver decrypts
decrypted = receiver.decrypt(encrypted)
```

## Features

### Currently Supported (v0.1.0-beta)

- **ML-KEM-768** - NIST-standardized key encapsulation (FIPS 203)
- **ML-KEM-1024** - Higher security level for sensitive applications
- **Hybrid Encryption** - Combines KEM with AES-256-GCM for data encryption
- **High-Level API** - `SecureChannel` for simple encryption/decryption
- **Low-Level Access** - Direct access to KEM primitives when needed
- **Type Safety** - Comprehensive type hints for better IDE support
- **Comprehensive Tests** - >90% code coverage

### Planned Features (v0.2+)

- ML-DSA (Dilithium) digital signatures
- Django/Flask/FastAPI integrations
- Key management utilities (rotation, storage)
- Migration toolkit for transitioning from classical crypto
- Hybrid mode combining RSA + ML-KEM

## Installation

### Requirements

- Python 3.8 or higher
- liboqs-python (installed automatically)

### Install from PyPI

```bash
pip install quantumcrypt
```

### Install from Source

```bash
git clone https://github.com/quantumcrypt/quantumcrypt
cd quantumcrypt
pip install -e .
```

### Development Installation

```bash
pip install -e ".[dev]"
```

## Documentation

### API Reference

#### `SecureChannel`

High-level API for encryption and decryption.

```python
from quantumcrypt import SecureChannel

# Create with default algorithm (ML-KEM-768)
channel = SecureChannel.create()

# Or specify algorithm
channel = SecureChannel.create(algorithm="ML-KEM-1024")

# Encrypt
encrypted = channel.encrypt(plaintext: bytes) -> bytes

# Decrypt
decrypted = channel.decrypt(ciphertext: bytes) -> bytes
```

#### Low-Level KEM API

For advanced users who need direct access to key encapsulation:

```python
from quantumcrypt.kem import MLKEM768

kem = MLKEM768()
keypair = kem.generate_keypair()

# Encapsulation (sender)
ciphertext, shared_secret = kem.encapsulate(keypair.public_key)

# Decapsulation (receiver)
recovered_secret = kem.decapsulate(keypair.secret_key, ciphertext)
```

### Algorithms

| Algorithm   | Security Level         | Public Key  | Secret Key  | Ciphertext  |
| ----------- | ---------------------- | ----------- | ----------- | ----------- |
| ML-KEM-768  | NIST Level 3 (192-bit) | 1,184 bytes | 2,400 bytes | 1,088 bytes |
| ML-KEM-1024 | NIST Level 5 (256-bit) | 1,568 bytes | 3,168 bytes | 1,568 bytes |

**Recommendation:** Use ML-KEM-768 for most applications. Use ML-KEM-1024 for highly sensitive data requiring maximum security.

## Examples

See the [`examples/`](examples/) directory for more:

- [basic_encryption.py](examples/basic_encryption.py) - Simple encryption/decryption
- [sender_receiver.py](examples/sender_receiver.py) - Two-party communication

## Security Considerations

### ⚠️ Important Notes

1. **Beta Software** - This is v0.1.0-beta. Do NOT use in production without thorough testing.
2. **No Security Audit Yet** - A professional cryptographic audit is planned before v1.0.
3. **Built on liboqs** - This library wraps the Open Quantum Safe `liboqs` library, which provides the actual cryptographic implementations.
4. **Key Management** - You are responsible for securely storing secret keys.
5. **Quantum Threat Timeline** - While quantum computers capable of breaking RSA don't exist yet (predicted 2029-2034), transitioning now protects against "harvest now, decrypt later" attacks.

### Best Practices

- ✅ Always use `SecureChannel.create()` to generate fresh keypairs
- ✅ Never reuse the same keypair for multiple recipients
- ✅ Protect secret keys - never transmit or store them in plain text
- ✅ Use secure key storage (e.g., HSM, system keychain)
- ✅ Regularly rotate keys according to your security policy
- ❌ Don't roll your own crypto - use this library's high-level API

## Testing

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# With coverage
pytest --cov=quantumcrypt --cov-report=html

# Run specific test file
pytest tests/test_secure_channel.py
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/quantumcrypt/quantumcrypt
cd quantumcrypt
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black quantumcrypt tests

# Type checking
mypy quantumcrypt

# Linting
ruff quantumcrypt tests
```

## Roadmap

### v0.1.0-beta (Current)

- ✅ ML-KEM-768 and ML-KEM-1024 implementations
- ✅ High-level SecureChannel API
- ✅ Comprehensive test suite
- ✅ Basic documentation and examples

### v0.2.0 (Planned)

- [ ] ML-DSA (Dilithium) digital signatures
- [ ] Framework integrations (Django, Flask, FastAPI)
- [ ] Key serialization and storage utilities
- [ ] Performance optimizations

### v1.0.0 (Future)

- [ ] Professional security audit
- [ ] Full documentation site
- [ ] Migration toolkit for legacy crypto
- [ ] Hybrid classical + PQC mode
- [ ] Production-ready release

## FAQ

### Q: Is this secure?

A: QuantumCrypt builds on `liboqs`, which implements NIST-standardized algorithms. However, this is beta software and hasn't undergone an independent security audit yet.

### Q: When should I use this?

A: Start experimenting now, plan for production use after v1.0 (post-audit). If you handle data that must remain secret for 10+ years, consider using PQC today.

### Q: Is it compatible with other PQC libraries?

A: The underlying algorithms (ML-KEM) are standardized, but the message format is specific to QuantumCrypt. For interoperability, use the low-level KEM API directly.

### Q: What about classical + PQC hybrid mode?

A: Planned for v0.2. The current implementation uses ML-KEM + AES-256, which provides quantum resistance for the key exchange.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Open Quantum Safe (OQS) project for `liboqs`
- NIST for the post-quantum cryptography standardization effort
- The cryptography community for ongoing research and development

## Support

- 📧 Email: lilice308@gmail.com
- 💬 Discussions: [GitHub Discussions](https://github.com/quantumcrypt/quantumcrypt/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/quantumcrypt/quantumcrypt/issues)
- 📖 Docs: [quantumcrypt.readthedocs.io](https://quantumcrypt.readthedocs.io)

---

**⚠️ Remember: Quantum computers capable of breaking current encryption are predicted by 2029-2034. Start your PQC transition today!**
