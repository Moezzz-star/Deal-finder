# 🛍️ Deal Finder

**Deal Finder** is an AI-powered product search and recommendation platform. Users can input queries via text or voice, and the system intelligently retrieves the top 10 optimized deals using a combination of local product data, web scraping, and a local RAG (Retrieval-Augmented Generation) engine powered by LLaMA.

---

## ✨ Features

- 🎙️ Prompt-based product search (text & voice)
- 🧠 Local RAG system with LLaMA via Ollama + Faiss
- 🌍 Real-time web scraping + local product database
- 🧮 Multicriteria ranking (price, condition, rating, availability)
- 📦 Vector search using `pgvector` and `faiss`
- ⚡ Intelligent caching with Redis
- 🖥️ Modern web UI using React.js
- 🔐 Optional authentication (Clerk/Auth0)

---

## ⚙️ Tech Stack

| Component          | Technology                      |
|-------------------|----------------------------------|
| Frontend          | React.js                         |
| Backend API       | Node.js (Express)                |
| LLM / RAG Engine  | Python, LangGraph, Ollama, Faiss |
| Vector DB         | PostgreSQL + `pgvector`          |
| Scraping          | Puppeteer / Playwright / APIs    |
| Cache             | Redis                            |
| Deployment        | Docker + Kubernetes              |
| Orchestration     | Docker Compose / Helm (prod)     |

---

## 🧠 High-Level Architecture

```text
[User]
   │
   ▼
[React Frontend]
   │
   ▼
[Node.js Backend API]
   │             │
   ▼             ▼
[PostgreSQL]     [LLM Service (Python)]
   ▲                   ▲
   │                   │
[Scraper] ───────→ [Vector Indexing (Faiss)]
