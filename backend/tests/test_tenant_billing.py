"""Tests covering tenant isolation and billing flows."""
from typing import Dict, Tuple

from fastapi.testclient import TestClient

from app.config import settings


def _signup_and_login(client: TestClient, name: str, email: str, password: str) -> Tuple[Dict[str, str], int]:
    signup_payload = {
        "tenant": {
            "name": name,
            "billing_email": f"billing+{email}",
        },
        "owner_email": email,
        "owner_password": password,
        "owner_full_name": "Owner User",
    }
    response = client.post(f"{settings.API_V1_STR}/auth/register", json=signup_payload)
    assert response.status_code == 201

    login_response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": email, "password": password},
    )
    assert login_response.status_code == 200
    token_payload = login_response.json()
    token = token_payload["access_token"]
    tenant_id = token_payload["tenant_id"]
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Tenant-ID": str(tenant_id),
    }
    return headers, tenant_id


def test_tenant_user_isolation(client: TestClient) -> None:
    tenant_one_headers, _ = _signup_and_login(client, "Acme Corp", "owner1@example.com", "secret123")

    # Tenant admin creates an additional member
    new_user_payload = {
        "email": "member@example.com",
        "password": "secret123",
        "full_name": "Member User",
        "tenant_role": "member",
    }
    create_response = client.post(
        f"{settings.API_V1_STR}/users/",
        json=new_user_payload,
        headers=tenant_one_headers,
    )
    assert create_response.status_code == 201
    tenant_user = create_response.json()

    tenant_two_headers, _ = _signup_and_login(client, "Beta Inc", "owner2@example.com", "secret123")

    # Tenant two cannot view tenant one's users
    isolation_response = client.get(
        f"{settings.API_V1_STR}/users/{tenant_user['id']}",
        headers=tenant_two_headers,
    )
    assert isolation_response.status_code in {403, 404}

    tenant_two_listing = client.get(
        f"{settings.API_V1_STR}/users/",
        headers=tenant_two_headers,
    )
    assert tenant_two_listing.status_code == 200
    assert len(tenant_two_listing.json()) == 1  # only owner account


def test_billing_plan_lifecycle(client: TestClient) -> None:
    headers, _ = _signup_and_login(client, "Gamma LLC", "billing-owner@example.com", "secret123")

    subscription_response = client.get(
        f"{settings.API_V1_STR}/billing/subscription",
        headers=headers,
    )
    assert subscription_response.status_code == 200
    subscription = subscription_response.json()
    assert subscription["plan"] == "starter"

    # Upgrade plan
    update_response = client.post(
        f"{settings.API_V1_STR}/billing/subscription",
        json={"plan": "growth", "seats": 25},
        headers=headers,
    )
    assert update_response.status_code == 200
    updated_subscription = update_response.json()
    assert updated_subscription["plan"] == "growth"
    assert updated_subscription["seats"] == 25

    # Cancel subscription
    cancel_response = client.post(
        f"{settings.API_V1_STR}/billing/subscription/cancel",
        headers=headers,
    )
    assert cancel_response.status_code == 200
    assert cancel_response.json()["status"] == "canceled"

    # Resume subscription
    resume_response = client.post(
        f"{settings.API_V1_STR}/billing/subscription/resume",
        headers=headers,
    )
    assert resume_response.status_code == 200
    assert resume_response.json()["status"] == "active"
