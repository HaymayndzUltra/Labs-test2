"""API integration tests"""
from typing import Dict

from fastapi.testclient import TestClient

from app.config import settings
from app.models import Organization, Tenant


def test_health_check(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == f"{settings.PROJECT_NAME} API"


def test_admin_can_fetch_tenants(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/tenants", headers=admin_headers)
    assert response.status_code == 200
    tenants = response.json()
    assert any(tenant["email"] == "john@example.com" for tenant in tenants)


def test_tenant_scope_isolated(
    client: TestClient, tenant_headers: Dict[str, str], db_session
) -> None:
    skyline = db_session.query(Organization).filter(Organization.name == "Skyline Properties").first()
    assert skyline is not None
    scoped_headers = dict(tenant_headers)
    scoped_headers["x-org-id"] = str(skyline.id)
    response = client.get(f"{settings.API_V1_STR}/tenants", headers=scoped_headers)
    assert response.status_code == 403


def test_dashboard_kpis(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/dashboard/kpis", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_tenants"] >= 1
    assert data["open_tickets"] >= 0


def test_dashboard_trends(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/dashboard/trends", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "rent_collection" in data
    assert len(data["rent_collection"]) >= 1


def test_ai_monthly_summary(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/ai/monthly-summary",
        headers=admin_headers,
        json={"month": "2025-09"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "Acme" in data["organization"]


def test_reports_return_pdf(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.post(
        f"{settings.API_V1_STR}/reports/org-monthly",
        headers=admin_headers,
        params={"month": "2025-09"},
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF")


def test_super_admin_can_scope_other_org(
    client: TestClient, super_admin_headers: Dict[str, str], db_session
) -> None:
    skyline = db_session.query(Organization).filter(Organization.name == "Skyline Properties").first()
    assert skyline is not None
    headers = dict(super_admin_headers)
    headers["x-org-id"] = str(skyline.id)
    response = client.get(f"{settings.API_V1_STR}/buildings", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data


def test_building_units(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/buildings", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    building = next((b for b in data if b["name"] == "Tower A"), None)
    assert building is not None
    assert any(unit["name"] == "A-101" for unit in building["units"])


def test_dashboard_heatmap(client: TestClient, admin_headers: Dict[str, str]) -> None:
    response = client.get(f"{settings.API_V1_STR}/dashboard/student-activity", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["points"]


def test_ticket_lifecycle(
    client: TestClient, admin_headers: Dict[str, str], db_session
) -> None:
    tenant = (
        db_session.query(Tenant)
        .filter(Tenant.email == "john@example.com")
        .first()
    )
    assert tenant is not None
    payload = {
        "title": "HVAC issue",
        "description": "Air conditioning not cooling",
        "priority": "medium",
        "status": "Open",
        "tenant_id": tenant.id,
    }
    response = client.post(f"{settings.API_V1_STR}/tickets", headers=admin_headers, json=payload)
    assert response.status_code == 201
    ticket_id = response.json()["id"]
    detail = client.get(f"{settings.API_V1_STR}/tickets/{ticket_id}", headers=admin_headers)
    assert detail.status_code == 200
    update = {"status": "Closed"}
    response = client.patch(
        f"{settings.API_V1_STR}/tickets/{ticket_id}", headers=admin_headers, json=update
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Closed"
