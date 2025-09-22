"""Integration tests for user management endpoints."""
from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud, schemas
from app.config import settings


def _user_payload(email: str, password: str = "created-pass") -> dict:
    return {
        "email": email,
        "password": password,
        "full_name": "Created User",
        "is_superuser": False,
    }


def test_superuser_can_list_users(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    extra_user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=f"list-{uuid4()}@example.com",
            password="list-pass",
            full_name="List User",
        ),
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
    )

    assert response.status_code == 200, response.text
    emails = {item["email"] for item in response.json()}
    assert extra_user.email in emails


def test_list_users_requires_superuser(
    client: TestClient, normal_user_token_headers: dict
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    assert "enough privileges" in response.json()["detail"]


def test_superuser_can_create_user(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    email = f"create-{uuid4()}@example.com"
    response = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=_user_payload(email),
    )

    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == email

    stored = crud.user.get_by_email(db, email=email)
    assert stored is not None


def test_superuser_create_duplicate_returns_400(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    email = f"dup-{uuid4()}@example.com"
    crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=email,
            password="dup-pass",
            full_name="Duplicate",
        ),
    )

    response = client.post(
        f"{settings.API_V1_STR}/users/",
        headers=superuser_token_headers,
        json=_user_payload(email),
    )

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_normal_user_can_read_and_update_self(
    client: TestClient, normal_user_token_headers: dict, db: Session
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/me",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    me = response.json()

    new_name = "Updated Name"
    update_response = client.put(
        f"{settings.API_V1_STR}/users/me",
        headers=normal_user_token_headers,
        json={"full_name": new_name},
    )
    assert update_response.status_code == 200, update_response.text
    updated = update_response.json()
    assert updated["full_name"] == new_name

    db.expire_all()
    stored = crud.user.get(db, id=me["id"])
    assert stored.full_name == new_name


def test_superuser_can_read_and_update_other_user(
    client: TestClient,
    db: Session,
    superuser_token_headers: dict,
) -> None:
    other = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=f"other-{uuid4()}@example.com",
            password="other-pass",
            full_name="Other User",
        ),
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/{other.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    assert response.json()["email"] == other.email

    update_response = client.put(
        f"{settings.API_V1_STR}/users/{other.id}",
        headers=superuser_token_headers,
        json={"full_name": "Renamed"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["full_name"] == "Renamed"


def test_normal_user_cannot_read_other_user(
    client: TestClient,
    db: Session,
    normal_user_token_headers: dict,
) -> None:
    other = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=f"restricted-{uuid4()}@example.com",
            password="restricted",
            full_name="Restricted",
        ),
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/{other.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 400
    assert "enough privileges" in response.json()["detail"]
