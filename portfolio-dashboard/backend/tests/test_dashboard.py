from datetime import datetime

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_get_kpis():
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] == 24
    assert payload["completed"] == 10
    assert payload["active"] == 12
    assert payload["pending"] == 2
    assert "progress" in payload
    assert payload["progress"]["percentage"] == 41


def test_get_weekly_analytics():
    response = client.get("/api/v1/weekly-analytics")
    assert response.status_code == 200
    payload = response.json()
    assert "days" in payload
    assert len(payload["days"]) == 7
    first_day = payload["days"][0]
    assert {"label", "projects", "completed", "change"}.issubset(first_day.keys())


def test_get_reminders():
    response = client.get("/api/v1/reminders")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["reminders"]) >= 2
    reminder = payload["reminders"][0]
    assert reminder["type"] in {"meeting", "deadline", "alert", "task"}
    # ensure due_date is ISO formatted
    datetime.fromisoformat(reminder["due_date"])


def test_get_team():
    response = client.get("/api/v1/team")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["members"]) == 4
    member = payload["members"][0]
    assert {"name", "role", "status", "focus"}.issubset(member.keys())


def test_get_tasks():
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    payload = response.json()
    assert len(payload["tasks"]) >= 3
    task = payload["tasks"][0]
    assert {"title", "project", "priority", "status", "assignee"}.issubset(task.keys())
