"""Tenant CRUD operations"""
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.tenant import SubscriptionStatus, Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate
from app.schemas.subscription import SubscriptionCreate


class CRUDTenant(CRUDBase[Tenant, TenantCreate, TenantUpdate]):
    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(Tenant.slug == slug).first()

    def create(self, db: Session, *, obj_in: TenantCreate) -> Tenant:
        tenant = Tenant(
            name=obj_in.name,
            billing_email=obj_in.billing_email,
            slug=obj_in.slug or self._generate_slug(db, obj_in.name),
            is_active=obj_in.is_active if obj_in.is_active is not None else True,
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        return tenant

    def create_with_subscription(
        self,
        db: Session,
        *,
        tenant_in: TenantCreate,
        subscription_in: Optional[SubscriptionCreate] = None,
    ) -> Tenant:
        tenant = Tenant(
            name=tenant_in.name,
            billing_email=tenant_in.billing_email,
            slug=tenant_in.slug or self._generate_slug(db, tenant_in.name),
            is_active=tenant_in.is_active if tenant_in.is_active is not None else True,
        )
        db.add(tenant)
        db.flush()

        plan = tenant_in.plan
        seats = tenant_in.seats
        status = SubscriptionStatus.TRIALING
        payment_provider = None
        customer_id = None
        current_period_end = datetime.utcnow() + timedelta(days=14)

        if subscription_in is not None:
            payload = subscription_in.dict(exclude_unset=True)
            plan = payload.get('plan', plan)
            seats = payload.get('seats', seats)
            status = payload.get('status', status)
            payment_provider = payload.get('payment_provider', payment_provider)
            customer_id = payload.get('customer_id', customer_id)
            current_period_end = payload.get('current_period_end', current_period_end)

        from app.crud.crud_subscription import subscription as subscription_crud

        subscription_crud.create(
            db,
            obj_in=SubscriptionCreate(
                tenant_id=tenant.id,  # type: ignore[arg-type]
                plan=plan,
                seats=seats,
                status=status,
                payment_provider=payment_provider,
                customer_id=customer_id,
                current_period_end=current_period_end,
            ),
        )

        db.commit()
        db.refresh(tenant)
        return tenant

    def _generate_slug(self, db: Session, name: str) -> str:
        slug_base = "-".join(name.lower().split()) or "tenant"
        slug = slug_base
        index = 1
        while self.get_by_slug(db, slug=slug):
            slug = f"{slug_base}-{index}"
            index += 1
        return slug


tenant = CRUDTenant(Tenant)
