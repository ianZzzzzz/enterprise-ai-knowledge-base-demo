import { FormEvent, useEffect, useState } from 'react';
import {
  API_BASE_URL,
  ChatResponse,
  DocumentSummary,
  SearchResponse,
  chatWithKnowledgeBase,
  getDocuments,
  getHealth,
  searchKnowledge,
  uploadDocument,
} from './api';
import './styles.css';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

function JsonResult({ data }: { data: unknown }) {
  if (!data) {
    return null;
  }

  return <pre className="result-box">{JSON.stringify(data, null, 2)}</pre>;
}

function App() {
  const [health, setHealth] = useState<string>('checking');
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [uploadState, setUploadState] = useState<RequestState>('idle');
  const [uploadResult, setUploadResult] = useState<unknown>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState<RequestState>('idle');
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [question, setQuestion] = useState('');
  const [chatState, setChatState] = useState<RequestState>('idle');
  const [chatResult, setChatResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string>('');

  async function refreshDocuments() {
    const response = await getDocuments();
    setDocuments(response.documents);
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        const healthResponse = await getHealth();
        setHealth(healthResponse.status);
        await refreshDocuments();
      } catch (currentError) {
        setHealth('unavailable');
        setError(currentError instanceof Error ? currentError.message : '无法连接后端服务');
      }
    }

    void bootstrap();
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('document') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError('请选择一个文档后再上传。');
      return;
    }

    setError('');
    setUploadState('loading');

    try {
      const response = await uploadDocument(file);
      setUploadResult(response);
      setUploadState('success');
      await refreshDocuments();
      form.reset();
    } catch (currentError) {
      setUploadState('error');
      setError(currentError instanceof Error ? currentError.message : '上传失败');
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setError('请输入搜索关键词。');
      return;
    }

    setError('');
    setSearchState('loading');

    try {
      const response = await searchKnowledge(searchQuery.trim());
      setSearchResult(response);
      setSearchState('success');
    } catch (currentError) {
      setSearchState('error');
      setError(currentError instanceof Error ? currentError.message : '搜索失败');
    }
  }

  async function handleChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) {
      setError('请输入问题。');
      return;
    }

    setError('');
    setChatState('loading');

    try {
      const response = await chatWithKnowledgeBase(question.trim());
      setChatResult(response);
      setChatState('success');
    } catch (currentError) {
      setChatState('error');
      setError(currentError instanceof Error ? currentError.message : '问答请求失败');
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Enterprise AI Knowledge Base</p>
        <h1>企业 AI 知识库 Demo</h1>
        <p>通过最小前端页面验证文档上传、知识搜索和 AI 问答流程。</p>
        <div className="status-row">
          <span>API: {API_BASE_URL}</span>
          <span className={`status-pill ${health === 'ok' ? 'ok' : 'warn'}`}>Health: {health}</span>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="grid">
        <article className="card">
          <h2>文档上传</h2>
          <p>选择本地文件并调用 POST /documents/upload。</p>
          <form onSubmit={handleUpload}>
            <input name="document" type="file" />
            <button type="submit" disabled={uploadState === 'loading'}>
              {uploadState === 'loading' ? '上传中...' : '上传文档'}
            </button>
          </form>
          <h3>已知文档</h3>
          <ul className="document-list">
            {documents.map((document) => (
              <li key={document.id}>
                <strong>{document.filename}</strong>
                <span>{document.status}</span>
              </li>
            ))}
          </ul>
          <JsonResult data={uploadResult} />
        </article>

        <article className="card">
          <h2>知识搜索</h2>
          <p>输入关键词并调用 POST /search。</p>
          <form onSubmit={handleSearch}>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="例如：onboarding"
            />
            <button type="submit" disabled={searchState === 'loading'}>
              {searchState === 'loading' ? '搜索中...' : '搜索'}
            </button>
          </form>
          <JsonResult data={searchResult} />
        </article>

        <article className="card">
          <h2>AI 问答</h2>
          <p>输入问题并调用 POST /chat。</p>
          <form onSubmit={handleChat}>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="例如：How do I upload documents?"
              rows={5}
            />
            <button type="submit" disabled={chatState === 'loading'}>
              {chatState === 'loading' ? '生成中...' : '提问'}
            </button>
          </form>
          <JsonResult data={chatResult} />
        </article>
      </section>
    </main>
  );
}

export default App;
