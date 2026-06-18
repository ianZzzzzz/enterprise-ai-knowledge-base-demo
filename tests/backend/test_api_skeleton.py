"""Tests for mock backend API skeleton endpoints."""

from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_check_returns_ok() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_documents_returns_mock_documents() -> None:
    response = client.get("/documents")

    assert response.status_code == 200
    assert response.json()["documents"][0]["id"] == "doc_mock_001"


def test_upload_document_returns_mock_metadata() -> None:
    response = client.post(
        "/documents/upload",
        files={"file": ("sample.txt", b"hello", "text/plain")},
    )

    assert response.status_code == 200
    assert response.json()["document"]["filename"] == "sample.txt"


def test_search_returns_mock_results() -> None:
    response = client.post("/search", json={"query": "onboarding", "top_k": 3})

    assert response.status_code == 200
    assert response.json()["query"] == "onboarding"
    assert response.json()["results"]


def test_chat_returns_mock_answer() -> None:
    response = client.post("/chat", json={"question": "How do I upload documents?"})

    assert response.status_code == 200
    assert "Mock answer" in response.json()["answer"]
    assert response.json()["sources"]
