"""Integration tests for authentication endpoints."""
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.config import settings
from app.schemas.user import UserCreate
from app.models.user import User


def _clear_users(db: Session) -> None:
    db.query(User).delete()
    db.commit()


def test_auth_flow_endpoints(client: TestClient, db: Session) -> None:
    """Users should be able to log in, register and recover passwords."""
    _clear_users(db)

    # Seed the superuser so login/token endpoints succeed.
    crud.user.create(
        db,
        obj_in=UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            full_name="Admin User",
            is_superuser=True,
        ),
    )

    login_response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={
            "username": settings.FIRST_SUPERUSER,
            "password": settings.FIRST_SUPERUSER_PASSWORD,
        },
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    me_response = client.post(
        f"{settings.API_V1_STR}/auth/login/test-token", headers=headers
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == settings.FIRST_SUPERUSER

    new_user_payload = {
        "email": "newuser@example.com",
        "password": "new-password",
        "full_name": "New User",
    }
    register_response = client.post(
        f"{settings.API_V1_STR}/auth/register", json=new_user_payload
    )
    assert register_response.status_code == 200
    assert register_response.json()["email"] == new_user_payload["email"]

    recover_response = client.post(
        f"{settings.API_V1_STR}/auth/password-recovery/{new_user_payload['email']}"
    )
    assert recover_response.status_code == 200
    assert "msg" in recover_response.json()

    missing_response = client.post(
        f"{settings.API_V1_STR}/auth/password-recovery/missing@example.com"
    )
    assert missing_response.status_code == 404
