"""Test configuration"""
from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.database import Base, get_db
from app.models import UserRole
from app.schemas.user import UserCreate
from app.crud import user as crud_user
from main import app
from scripts.seed_data import seed

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def prepare_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestingSessionLocal() as session:
        seed(session)
        # Ensure a deterministic super admin for tests
        if not crud_user.get_by_email(session, email="super@propwise.io"):
            crud_user.create(
                session,
                obj_in=UserCreate(
                    email="super@propwise.io",
                    password="propwise",
                    full_name="Super Admin",
                    role=UserRole.SUPER_ADMIN,
                    org_id=None,
                ),
            )
        session.commit()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client


def login(client: TestClient, username: str, password: str) -> Dict[str, str]:
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": username, "password": password},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(client: TestClient) -> Dict[str, str]:
    return login(client, "admin@acme.io", "propwise")


@pytest.fixture()
def tenant_headers(client: TestClient) -> Dict[str, str]:
    return login(client, "tenant1@acme.io", "propwise")


@pytest.fixture()
def super_admin_headers(client: TestClient) -> Dict[str, str]:
    return login(client, "super@propwise.io", "propwise")
