"""Unit tests for CRUD operations on users."""
from __future__ import annotations

from uuid import uuid4

from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.security import verify_password


def _unique_email() -> str:
    return f"user-{uuid4()}@example.com"


def test_create_user_hashes_password(db: Session) -> None:
    password = "super-secret"
    user_in = schemas.UserCreate(
        email=_unique_email(),
        password=password,
        full_name="Unit Test",
    )
    user = crud.user.create(db, obj_in=user_in)

    assert user.email == user_in.email
    assert user.full_name == user_in.full_name
    assert user.hashed_password != password
    assert verify_password(password, user.hashed_password)


def test_get_by_email_returns_user(db: Session) -> None:
    user_in = schemas.UserCreate(
        email=_unique_email(),
        password="password",
        full_name="Lookup User",
    )
    created = crud.user.create(db, obj_in=user_in)

    fetched = crud.user.get_by_email(db, email=user_in.email)
    assert fetched is not None
    assert fetched.id == created.id


def test_update_user_allows_password_change(db: Session) -> None:
    original_password = "old-pass"
    user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password=original_password,
            full_name="Updater",
        ),
    )

    updated = crud.user.update(
        db,
        db_obj=user,
        obj_in=schemas.UserUpdate(full_name="Updated", password="new-pass"),
    )

    assert updated.full_name == "Updated"
    assert verify_password("new-pass", updated.hashed_password)
    assert not verify_password(original_password, updated.hashed_password)


def test_authenticate_success(db: Session) -> None:
    password = "letmein"
    user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password=password,
            full_name="Auth User",
        ),
    )

    authenticated = crud.user.authenticate(db, email=user.email, password=password)
    assert authenticated is not None
    assert authenticated.id == user.id


def test_authenticate_wrong_password_returns_none(db: Session) -> None:
    user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password="correct",
            full_name="Wrong Password",
        ),
    )

    assert crud.user.authenticate(db, email=user.email, password="incorrect") is None


def test_authenticate_unknown_user_returns_none(db: Session) -> None:
    assert (
        crud.user.authenticate(
            db, email="missing@example.com", password="whatever"
        )
        is None
    )


def test_is_active_and_is_superuser_flags(db: Session) -> None:
    active_user = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password="active",
            full_name="Active User",
        ),
    )

    inactive = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password="inactive",
            full_name="Inactive User",
            is_superuser=False,
        ),
    )
    inactive.is_active = False
    db.add(inactive)
    db.commit()
    db.refresh(inactive)

    superuser = crud.user.create(
        db,
        obj_in=schemas.UserCreate(
            email=_unique_email(),
            password="admin",
            full_name="Admin User",
            is_superuser=True,
        ),
    )

    assert crud.user.is_active(active_user) is True
    assert crud.user.is_active(inactive) is False
    assert crud.user.is_superuser(active_user) is False
    assert crud.user.is_superuser(superuser) is True
