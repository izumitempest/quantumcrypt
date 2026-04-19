import pytest
from quantumcrypt import SecureChannel


def test_hybrid_disabled():
    """Test that creating a hybrid channel explicitly raises NotImplementedError."""
    with pytest.raises(NotImplementedError) as exc_info:
        channel = SecureChannel(hybrid=True)
    
    assert "disabled" in str(exc_info.value).lower()


def test_hybrid_create_disabled():
    """Test standard developer pathway for hybrid explicitly raises NotImplementedError."""
    with pytest.raises(NotImplementedError) as exc_info:
        channel = SecureChannel.create(hybrid=True)
        
    assert "disabled" in str(exc_info.value).lower()
