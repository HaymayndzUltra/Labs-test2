"""Pytest fixtures for exercising the FastAPI backend."""
from __future__ import annotations

import os
from typing import Dict, Generator
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app import crud, models, schemas
from app.config import settings
from app.database import Base, get_db
from main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Ensure settings has a usable DATABASE_URL for model imports that create the engine
if not getattr(settings, "DATABASE_URL", None):
    os.environ.setdefault("DATABASE_URL", SQLALCHEMY_DATABASE_URL)
    from importlib import reload

    from app import config as app_config

    reload(app_config)
    settings = app_config.settings

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

TEST_SUPERUSER_EMAIL = settings.FIRST_SUPERUSER
TEST_SUPERUSER_PASSWORD = settings.FIRST_SUPERUSER_PASSWORD


def override_get_db() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def _create_test_database() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c


def ensure_user(
    db: Session,
    *,
    email: str,
    password: str,
    full_name: str = "Test User",
    is_superuser: bool = False,
    is_active: bool = True,
) -> models.User:
    user = crud.user.get_by_email(db, email=email)
    if user:
        if user.is_active != is_active:
            user.is_active = is_active
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    user_in = schemas.UserCreate(
        email=email,
        password=password,
        full_name=full_name,
        is_superuser=is_superuser,
    )
    user = crud.user.create(db, obj_in=user_in)
    if not is_active:
        user.is_active = False
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def authentication_token_from_email(
    *, client: TestClient, email: str, password: str, db: Session
) -> Dict[str, str]:
    ensure_user(db, email=email, password=password)
    login_data = {"username": email, "password": password}
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def superuser(db: Session) -> models.User:
    return ensure_user(
        db,
        email=TEST_SUPERUSER_EMAIL,
        password=TEST_SUPERUSER_PASSWORD,
        full_name="Super User",
        is_superuser=True,
    )


@pytest.fixture(scope="function")
def superuser_token_headers(
    client: TestClient, db: Session, superuser: models.User
) -> Dict[str, str]:
    return authentication_token_from_email(
        client=client,
        email=superuser.email,
        password=TEST_SUPERUSER_PASSWORD,
        db=db,
    )


@pytest.fixture(scope="function")
def normal_user(db: Session) -> models.User:
    email = f"user-{uuid4()}@example.com"
    password = "user-password"
    return ensure_user(
        db,
        email=email,
        password=password,
        full_name="Normal User",
    )


@pytest.fixture(scope="function")
def normal_user_token_headers(
    client: TestClient, db: Session, normal_user: models.User
) -> Dict[str, str]:
    return authentication_token_from_email(
        client=client,
        email=normal_user.email,
        password="user-password",
        db=db,
    )


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    login_data = {
        "username": TEST_SUPERUSER_EMAIL,
        "password": TEST_SUPERUSER_PASSWORD,
    }
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token", data=login_data
    )
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}