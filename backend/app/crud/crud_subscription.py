"""Subscription CRUD operations"""
from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.tenant import Subscription, SubscriptionStatus
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate


class CRUDSubscription(CRUDBase[Subscription, SubscriptionCreate, SubscriptionUpdate]):
    def get_by_tenant(self, db: Session, *, tenant_id: int) -> Optional[Subscription]:
        return db.query(Subscription).filter(Subscription.tenant_id == tenant_id).first()

    def upsert(
        self,
        db: Session,
        *,
        tenant_id: int,
        obj_in: SubscriptionUpdate,
    ) -> Subscription:
        subscription = self.get_by_tenant(db, tenant_id=tenant_id)
        payload = obj_in.dict(exclude_unset=True)
        if subscription:
            for field, value in payload.items():
                setattr(subscription, field, value)
            db.add(subscription)
            db.commit()
            db.refresh(subscription)
            return subscription

        create_payload = SubscriptionCreate(tenant_id=tenant_id, **payload)
        subscription = self.create(db, obj_in=create_payload)
        return subscription

    def cancel(self, db: Session, *, tenant_id: int) -> Optional[Subscription]:
        subscription = self.get_by_tenant(db, tenant_id=tenant_id)
        if not subscription:
            return None
        subscription.status = SubscriptionStatus.CANCELED
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription

    def resume(self, db: Session, *, tenant_id: int) -> Optional[Subscription]:
        subscription = self.get_by_tenant(db, tenant_id=tenant_id)
        if not subscription:
            return None
        subscription.status = SubscriptionStatus.ACTIVE
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription


subscription = CRUDSubscription(Subscription)
