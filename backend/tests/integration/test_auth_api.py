"""Integration tests for authentication endpoints."""
from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, schemas
from app.config import settings


def _register_payload(email: str, password: str = "register-pass") -> dict:
    return {
        "email": email,
        "password": password,
        "full_name": "Register User",
        "is_superuser": False,
    }


def test_register_creates_user(client: TestClient, db: Session) -> None:
    email = f"reg-{uuid4()}@example.com"

    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=_register_payload(email),
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == email

    stored = crud.user.get_by_email(db, email=email)
    assert stored is not None
    assert stored.full_name == "Register User"


def test_register_duplicate_email_returns_400(client: TestClient, db: Session) -> None:
    email = f"duplicate-{uuid4()}@example.com"
    crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=email,
            password="existing-pass",
            full_name="Existing",
        ),
    )

    response = client.post(
        f"{settings.API_V1_STR}/auth/register",
        json=_register_payload(email),
    )

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_returns_tokens_for_valid_user(
    client: TestClient, superuser
) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={
            "username": superuser.email,
            "password": settings.FIRST_SUPERUSER_PASSWORD,
        },
    )

    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload["token_type"] == "bearer"
    assert "access_token" in payload and payload["access_token"]
    assert "refresh_token" in payload and payload["refresh_token"]


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": "missing@example.com", "password": "bad"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_rejects_inactive_user(client: TestClient, db: Session) -> None:
    email = f"inactive-{uuid4()}@example.com"
    user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=email,
            password="inactive-pass",
            full_name="Inactive",
        ),
    )
    user.is_active = False
    db.add(user)
    db.commit()
    db.refresh(user)

    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": email, "password": "inactive-pass"},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Inactive user"


def test_test_token_returns_authenticated_user(
    client: TestClient, superuser, superuser_token_headers
) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/test-token",
        headers=superuser_token_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == superuser.email
    assert data["is_superuser"] is True
