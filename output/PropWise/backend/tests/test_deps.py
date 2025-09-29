"""Tests for API dependency helpers."""
import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api import deps
from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate


def _prepare_user(db: Session, **overrides) -> User:
    defaults = dict(
        email="deps-user@example.com",
        password="deps-pass",
        full_name="Deps User",
        is_superuser=False,
    )
    defaults.update(overrides)
    return crud.user.create(db, obj_in=UserCreate(**defaults))


def _clear_users(db: Session) -> None:
    db.query(User).delete()
    db.commit()


def test_get_current_user_validation(db: Session) -> None:
    """get_current_user should validate tokens and user presence."""
    _clear_users(db)
    user = _prepare_user(db)
    token = security.create_access_token(user.id)

    fetched = deps.get_current_user(db=db, token=token)
    assert fetched.id == user.id

    db.delete(fetched)
    db.commit()

    with pytest.raises(HTTPException):
        deps.get_current_user(db=db, token=token)

    with pytest.raises(HTTPException):
        deps.get_current_user(db=db, token="not-a-token")


def test_active_user_checks(db: Session) -> None:
    """Active and superuser guards should enforce invariants."""
    _clear_users(db)
    user = _prepare_user(db)

    # Inactive user should raise from get_current_active_user
    user.is_active = False
    db.add(user)
    db.commit()
    db.refresh(user)

    with pytest.raises(HTTPException):
        deps.get_current_active_user(current_user=user)

    # Reactivate and promote to superuser
    user.is_active = True
    user.is_superuser = True
    db.add(user)
    db.commit()
    db.refresh(user)

    assert deps.get_current_active_user(current_user=user) == user
    assert deps.get_current_active_superuser(current_user=user) == user

    # Demote superuser to ensure guard raises
    user.is_superuser = False
    db.add(user)
    db.commit()
    db.refresh(user)

    with pytest.raises(HTTPException):
        deps.get_current_active_superuser(current_user=user)
