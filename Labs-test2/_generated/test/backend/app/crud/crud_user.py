"""User CRUD operations with tenancy awareness"""
from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models import Organization, User, UserRole
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser:
    def get(self, db: Session, user_id: Optional[int] = None, *, id: Optional[int] = None) -> Optional[User]:
        target_id = user_id if user_id is not None else id
        if target_id is None:
            return None
        return db.query(User).filter(User.id == target_id).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        org = None
        if obj_in.org_id:
            org = db.query(Organization).filter(Organization.id == obj_in.org_id).first()
            if org is None:
                raise ValueError("Organization not found for user creation")
        user = User(
            email=obj_in.email,
            full_name=obj_in.full_name,
            hashed_password=get_password_hash(obj_in.password),
            role=obj_in.role,
            org_id=obj_in.org_id,
            is_active=obj_in.is_active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def update(self, db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return bool(user.is_active)

    def is_super_admin(self, user: User) -> bool:
        return user.role == UserRole.SUPER_ADMIN


user = CRUDUser()
