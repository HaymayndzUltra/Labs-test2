"""Tests for CRUD operations around the user model."""
from sqlalchemy.orm import Session

from app import crud
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def _clear_users(db: Session) -> None:
    db.query(User).delete()
    db.commit()


def test_user_crud_create_and_authenticate(db: Session) -> None:
    """Creating a user should hash the password and allow authentication."""
    _clear_users(db)

    user_in = UserCreate(
        email="crud-user@example.com",
        password="initial-pass",
        full_name="CRUD User",
        is_superuser=False,
    )
    user = crud.user.create(db, obj_in=user_in)

    assert user.email == user_in.email
    assert user.hashed_password != user_in.password
    assert crud.user.authenticate(
        db, email=user_in.email, password=user_in.password
    )
    assert crud.user.authenticate(db, email=user_in.email, password="wrong") is None
    assert crud.user.is_active(user)
    assert not crud.user.is_superuser(user)


def test_user_update_changes_password(db: Session) -> None:
    """Updating a user should hash the new password and persist profile changes."""
    _clear_users(db)

    user = crud.user.create(
        db,
        obj_in=UserCreate(
            email="update-user@example.com",
            password="start-pass",
            full_name="To Update",
            is_superuser=True,
        ),
    )

    updated = crud.user.update(
        db,
        db_obj=user,
        obj_in=UserUpdate(full_name="Updated Name", password="new-pass"),
    )

    assert updated.full_name == "Updated Name"
    assert security.verify_password("new-pass", updated.hashed_password)
    assert crud.user.is_superuser(updated)


def test_user_flags_can_be_toggled(db: Session) -> None:
    """is_active and is_superuser helpers should reflect persisted state."""
    _clear_users(db)

    user = crud.user.create(
        db,
        obj_in=UserCreate(
            email="flag-user@example.com",
            password="flag-pass",
            full_name="Flagged",
            is_superuser=False,
        ),
    )

    assert crud.user.is_active(user)
    assert not crud.user.is_superuser(user)

    user.is_active = False
    db.add(user)
    db.commit()
    db.refresh(user)

    assert not crud.user.is_active(user)

    user.is_superuser = True
    db.add(user)
    db.commit()
    db.refresh(user)

    assert crud.user.is_superuser(user)
