"""Tests for security utilities."""
from datetime import timedelta

from jose import jwt

from app.core import security
from app.core.security import ALGORITHM
from app.config import settings


def test_password_hash_roundtrip() -> None:
    """Hashing should round-trip with verify_password."""
    password = "super-secret"
    hashed = security.get_password_hash(password)

    assert hashed != password
    assert security.verify_password(password, hashed)
    assert not security.verify_password("wrong", hashed)


def test_token_generation_includes_subject() -> None:
    """Generated tokens should embed the subject and expiry metadata."""
    subject = "42"
    access_token = security.create_access_token(
        subject, expires_delta=timedelta(minutes=5)
    )
    decoded_access = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[ALGORITHM])

    assert decoded_access["sub"] == subject
    assert "exp" in decoded_access

    refresh_token = security.create_refresh_token(
        subject, expires_delta=timedelta(days=1)
    )
    decoded_refresh = jwt.decode(
        refresh_token, settings.SECRET_KEY, algorithms=[ALGORITHM]
    )

    assert decoded_refresh["sub"] == subject
    assert decoded_refresh["type"] == "refresh"
