# Backend Service

This directory contains the minimal FastAPI backend for the Enterprise AI Knowledge Base Demo.

## Setup

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Install test dependencies when running the test suite:

```bash
pip install -r tests/requirements.txt
```

## Start the API

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Open the interactive API docs at <http://localhost:8000/docs>.

## Available Endpoints

- `GET /health` returns service health status.
- `POST /documents/upload` accepts a document file and returns mock upload metadata.
- `GET /documents` returns mock document metadata.
- `POST /search` accepts a search query and returns mock search results.
- `POST /chat` accepts a question and returns a mock answer with mock sources.

Current responses are intentionally mocked. Document parsing, vector retrieval, and LLM calls are not implemented yet.

## Run Tests

From the repository root:

```bash
pytest tests/backend
```
