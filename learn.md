# 🎓 VIRU Developer Learning Path

> **"To hack the system, you must understand the language."**

This document is a comprehensive glossary and learning guide for developers working on the VIRU codebase. It defines key concepts, specific technologies, and architectural patterns used in this project.

---

## 🧠 Part 1: AI & Agentic Concepts

### LLM (Large Language Model)
The core engine behind VIRU. We use **Ollama** (local) or **OpenAI** (cloud).
*   *Concept*: A neural network trained on massive amounts of text that predicts the next likely word in a sequence.
*   *In VIRU*: We treat the LLM as a "CPU". We send it data + instructions, and it processes them. It does not "think" on its own; it requires our software to guide it.

### RAG (Retrieval-Augmented Generation)
*   *Definition*: A technique to give LLMs "Long-Term Memory".
*   *Problem*: LLMs have a fixed "Context Window" (e.g., 4096 tokens). They cannot read your entire 100-file project at once.
*   *Solution*: We save your code snippet by snippet into a database. When you ask a question, we "Retrieve" only the 5 most relevant snippets and "Augment" the prompt with them before "Generating" the answer.
*   *Files*: `server/src/services/rag.service.ts`

### Vector Embeddings
*   *Definition*: Converting text into a list of numbers (e.g., `[0.1, -0.5, 0.9...]`).
*   *Why*: Computers cannot compare meaning of words directly. Vectors allow us to calculate mathematical distance. Code that does similar things (e.g., "Login Function" and "Auth Service") will be close together in vector space, even if they don't share keywords.
*   *VIRU Use*: We use `compute-cosine-similarity` to match your prompt to stored code chunks.

### Agent / Agentic Workflow
*   *Definition*: An AI system that attempts to achieve a goal autonomously, rather than just answering a question.
*   *Mechanism*: It involves a loop: **Think -> Plan -> Act -> Observe -> Repeat**.
*   *The Swarm*: VIRU uses multiple specialized agents (`ARCHITECT`, `DEVELOPER`, `DEBUGGER`). This is known as a "Mixture of Experts" pattern.

### Hallucination
*   *Definition*: When an LLM confidently states a fact that is false or generates code that doesn't exist.
*   *Mitigation*: We use **Grounding** (providing real file paths via RAG) and **Verification** (running the code in a terminal to see if it errors) to catch hallucinations.

### Multimodal AI ("The Eye")
*   *Definition*: AI that can process inputs other than text, such as Images or Audio.
*   *In VIRU*: We convert user-dropped images into Base64 strings and send them to a vision-capable model (like LLaVA) with a prompt to "transcribe this UI into code".

---

## 💻 Part 2: Web Technologies

### Monorepo
*   *Definition*: Storing multiple distinct projects (Client, Server, Admin) in a single Git repository.
*   *Pros*: Easy code sharing, atomic commits (change frontend and backend in one commit), unified build process.

### HMR (Hot Module Replacement)
*   *Tool*: **Vite**
*   *Definition*: Updating modules in the browser at runtime without a full page refresh.
*   *Benefit*: When you edit `App.tsx`, the changes appear instantly. This keeps the "Agent State" (like chat history) intact while you code.

### Utility-First CSS
*   *Tool*: **TailwindCSS**
*   *Concept*: Instead of writing semantic classes (`.btn-primary`), you write utility classes (`bg-blue-500 text-white rounded`).
*   *Why*: Rapid prototyping. You don't need to switch between `.js` and `.css` files. It guarantees that the site looks consistent because you are constrained to a design system (padding, colors) defined in the config.

### REST API
*   *Tool*: **Express**
*   *Definition*: Representational State Transfer. A standard for Client-Server communication via HTTP.
*   *Endpoints*: URLs like `GET /api/projects` or `POST /api/chat`.
*   *VIRU Style*: We use strict JSON request/response bodies and HTTP status codes (200=OK, 400=Bad Request, 500=Server Error).

### Middleware
*   *Definition*: Functions that run *between* the request coming in and the final route handler.
*   *Example*: `cors()` checks if the website is allowed to talk to the server. `checkAuth()` checks if the user has a valid token. If middleware errors, the request never reaches the logic.

---

## 🏗️ Part 3: Architecture & Patterns

### Service Layer Pattern
*   *Definition*: Separating "Business Logic" from "HTTP Routing".
*   *In VIRU*: 
    *   `index.ts` (Controller): Only receives data and sends responses.
    *   `agent.service.ts` (Service): Does the actual thinking and processing.
*   *Why*: It allows us to reuse logic. For example, the `admin.service` can be called by the API *or* by a background Cron job.

### ORM (Object-Relational Mapping)
*   *Tool*: **Prisma**
*   *Definition*: A library that lets you query a database using your coding language (TypeScript) instead of raw SQL.
*   *Example*: Instead of `SELECT * FROM User WHERE id=1`, we write `db.user.findUnique({ where: { id: 1 } })`.

### JWT (JSON Web Token)
*   *Definition*: A compact URL-safe means of representing claims to be transferred between two parties.
*   *Use*: Authentication. When you log in, the server signs a "Badge" (Token) with a secret key. You send this badge with every request in the `Authorization` header. The server checks the signature to know it's you.

### Hybrid Cloud Deployment
*   *Concept*: Splitting an application between a Public Cloud and a Private Local Machine.
*   *Tool*: **LocalTunnel**.
*   *Flow*: The Frontend lives on Vercel (Fast global CDN). The Backend lives on your Laptop (File System access). The Tunnel acts as a secure bridge connecting them.

---

## 🔍 Part 4: VIRU Specific Terminology

### Neural Link
*   *What*: The visual representation of the Vector Database.
*   *Tech*: Uses `react-force-graph` or Canvas API to render nodes (files) and edges (relationships) in 3D space.

### Overwatch
*   *What*: The Administrative Dashboard.
*   *Role*: It has "God View" over the system. It can see all users, ban IPs, and broadcast messages. It uses a separate port (`5174`) to isolate it from the main user traffic.

### The Sandbox (FS Service)
*   *What*: The `fs.service.ts`.
*   *Why*: Allowing AI to write to disk is dangerous. This service acts as a "Sandbox". It creates, writes, and reads files, but (in future versions) will restrict access to only the `project` directory to prevent the AI from deleting system files.

---

## 📚 Recommended Reading
1.  **React Docs**: [react.dev](https://react.dev) - For understanding Hooks and Components.
2.  **Prisma Guide**: [prisma.io/docs](https://www.prisma.io/docs) - For database modeling.
3.  **Ollama**: [ollama.com](https://ollama.com) - For running local models.
4.  **Prompt Engineering Guide**: [promptingguide.ai](https://www.promptingguide.ai) - To understand how to talk to the agents.

---

*Keep Learning. Keep Building.*
