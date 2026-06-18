# Frontend

企业 AI 知识库 Demo 的最小可用前端，用于验证文档上传、知识搜索和 AI 问答三个核心流程。

## 功能

- 启动时调用 `GET /health` 展示后端健康状态。
- 启动时调用 `GET /documents` 展示 mock 文档列表。
- 文档上传模块调用 `POST /documents/upload` 并展示返回结果。
- 知识搜索模块调用 `POST /search` 并展示返回结果。
- AI 问答模块调用 `POST /chat` 并展示返回结果。

## 环境变量

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | 后端 API 服务地址，不要在代码中写死其他地址。 |

可以创建本地环境文件：

```bash
cp .env.example .env.local
```

然后按需修改：

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## 安装与启动

```bash
cd frontend
npm install
npm run dev
```

默认开发服务器会监听 Vite 输出的本地地址，例如 `http://localhost:5173`。

## 与后端联调

1. 在仓库根目录启动后端（示例）：

   ```bash
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. 在 `frontend/.env.local` 中确认 API 地址：

   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. 启动前端：

   ```bash
   cd frontend
   npm run dev
   ```

4. 打开浏览器访问前端页面，依次验证健康检查、文档上传、文档列表、知识搜索和 AI 问答结果。

> 如果后端暂时返回 mock 数据，前端仍按真实接口发起请求并展示 mock 响应。

## 构建检查

```bash
cd frontend
npm run build
```
