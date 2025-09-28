"""
Security utilities
"""
from datetime import datetime, timedelta
from datetime import datetime, timedelta
from typing import Any, Optional, Union
from jose import jwt
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


ALGORITHM = "HS256"


def _create_token(
    subject: Union[str, Any],
    org_id: Optional[int],
    role: Optional[str],
    *,
    expires_delta: Optional[timedelta],
    token_type: str,
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        if token_type == "refresh":
            expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "org_id": org_id,
        "role": role,
        "type": token_type,
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(
    subject: Union[str, Any],
    *,
    org_id: Optional[int],
    role: Optional[str],
    expires_delta: Optional[timedelta] = None,
) -> str:
    return _create_token(subject, org_id, role, expires_delta=expires_delta, token_type="access")


def create_refresh_token(
    subject: Union[str, Any],
    *,
    org_id: Optional[int],
    role: Optional[str],
    expires_delta: Optional[timedelta] = None,
) -> str:
    return _create_token(subject, org_id, role, expires_delta=expires_delta, token_type="refresh")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)