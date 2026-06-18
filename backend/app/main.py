"""Minimal FastAPI backend for the enterprise AI knowledge base demo."""

from typing import Annotated

from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel, Field

app = FastAPI(
    title="Enterprise AI Knowledge Base API",
    description="Minimal backend service with mock knowledge base endpoints.",
    version="0.1.0",
)


class HealthResponse(BaseModel):
    """Health check response payload."""

    status: str = Field(..., examples=["ok"])


class DocumentSummary(BaseModel):
    """Document metadata returned by the documents API."""

    id: str
    filename: str
    status: str


class UploadResponse(BaseModel):
    """Mock upload response payload."""

    document: DocumentSummary
    message: str


class DocumentsResponse(BaseModel):
    """Document list response payload."""

    documents: list[DocumentSummary]


class SearchRequest(BaseModel):
    """Knowledge base search request payload."""

    query: str = Field(..., min_length=1, examples=["What is the onboarding process?"])
    top_k: int = Field(default=3, ge=1, le=20)


class SearchResult(BaseModel):
    """Mock search result payload."""

    document_id: str
    snippet: str
    score: float


class SearchResponse(BaseModel):
    """Knowledge base search response payload."""

    query: str
    results: list[SearchResult]


class ChatRequest(BaseModel):
    """Knowledge base chat request payload."""

    question: str = Field(..., min_length=1, examples=["How do I upload a document?"])


class ChatResponse(BaseModel):
    """Mock chat response payload."""

    answer: str
    sources: list[SearchResult]


MOCK_DOCUMENTS = [
    DocumentSummary(id="doc_mock_001", filename="example-handbook.pdf", status="indexed"),
]


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health_check() -> HealthResponse:
    """Return service health status."""

    return HealthResponse(status="ok")


@app.post("/documents/upload", response_model=UploadResponse, tags=["documents"])
async def upload_document(file: Annotated[UploadFile, File(...)]) -> UploadResponse:
    """Accept a document upload and return mock metadata for the uploaded file."""

    return UploadResponse(
        document=DocumentSummary(
            id="doc_mock_upload",
            filename=file.filename or "uploaded-document",
            status="uploaded_mock",
        ),
        message="Document upload accepted. Parsing and indexing are not implemented yet.",
    )


@app.get("/documents", response_model=DocumentsResponse, tags=["documents"])
def list_documents() -> DocumentsResponse:
    """Return mock document metadata."""

    return DocumentsResponse(documents=MOCK_DOCUMENTS)


@app.post("/search", response_model=SearchResponse, tags=["knowledge-base"])
def search_knowledge_base(request: SearchRequest) -> SearchResponse:
    """Return mock search results for the requested query."""

    return SearchResponse(
        query=request.query,
        results=[
            SearchResult(
                document_id="doc_mock_001",
                snippet="Mock search result. Vector retrieval is not implemented yet.",
                score=0.99,
            )
        ][: request.top_k],
    )


@app.post("/chat", response_model=ChatResponse, tags=["knowledge-base"])
def chat_with_knowledge_base(request: ChatRequest) -> ChatResponse:
    """Return a mock answer for a knowledge base question."""

    return ChatResponse(
        answer=(
            f"Mock answer for: {request.question}. "
            "Retrieval augmented generation is not implemented yet."
        ),
        sources=[
            SearchResult(
                document_id="doc_mock_001",
                snippet="Mock source snippet. LLM calls are not implemented yet.",
                score=0.98,
            )
        ],
    )
