"""Unit tests for security helper utilities."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from jose import jwt

from app.core import security


def _decode(token: str) -> dict:
    return jwt.decode(
        token, security.settings.SECRET_KEY, algorithms=[security.ALGORITHM]
    )


def test_create_access_token_contains_subject_and_expiry() -> None:
    token = security.create_access_token("user-id")
    payload = _decode(token)

    assert payload["sub"] == "user-id"
    assert "exp" in payload


def test_create_access_token_respects_expires_delta() -> None:
    expires = timedelta(minutes=5)
    token = security.create_access_token("abc", expires_delta=expires)
    payload = _decode(token)

    exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    remaining = exp_time - datetime.now(timezone.utc)
    assert remaining.total_seconds() == pytest.approx(expires.total_seconds(), rel=0.05)


def test_create_refresh_token_marks_type_refresh() -> None:
    expires = timedelta(days=2)
    token = security.create_refresh_token("refresh-me", expires_delta=expires)
    payload = _decode(token)

    assert payload["sub"] == "refresh-me"
    assert payload["type"] == "refresh"

    exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    remaining = exp_time - datetime.now(timezone.utc)
    assert remaining.total_seconds() == pytest.approx(expires.total_seconds(), rel=0.05)


def test_password_hash_roundtrip() -> None:
    password = "complex-pass"
    hashed = security.get_password_hash(password)

    assert hashed != password
    assert security.verify_password(password, hashed) is True
    assert security.verify_password("wrong", hashed) is False
