export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export type HealthResponse = {
  status: string;
};

export type DocumentSummary = {
  id: string;
  filename: string;
  status: string;
};

export type DocumentsResponse = {
  documents: DocumentSummary[];
};

export type UploadResponse = {
  document: DocumentSummary;
  message: string;
};

export type SearchResult = {
  document_id: string;
  snippet: string;
  score: number;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
};

export type ChatResponse = {
  answer: string;
  sources: SearchResult[];
};

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>('/health');
}

export function getDocuments(): Promise<DocumentsResponse> {
  return requestJson<DocumentsResponse>('/documents');
}

export function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return requestJson<UploadResponse>('/documents/upload', {
    method: 'POST',
    body: formData,
  });
}

export function searchKnowledge(query: string, topK = 3): Promise<SearchResponse> {
  return requestJson<SearchResponse>('/search', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK }),
  });
}

export function chatWithKnowledgeBase(question: string): Promise<ChatResponse> {
  return requestJson<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}
