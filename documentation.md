# 🦅 VIRU v2.0 - The Comprehensive Documentation

> **Virtual Intelligence Response Unit (VIRU)**
> *Self-Hosted | Agentic | Autonomous*

This document serves as the **Ultimate Source of Truth** for the VIRU ecosystem. It covers the architecture, technology choices, deployment strategies, and internal logic in extreme detail. It is designed for developers, contributors, and power users who want to understand *exactly* how VIRU works under the hood.

---

## 📑 Table of Contents

1.  [Philosophy & Vision](#1-philosophy--vision)
2.  [Technology Stack (The "Why" & "Where")](#2-technology-stack-the-why--where)
    *   [Frontend (The Neural Interface)](#21-frontend-client)
    *   [Backend (The Brain)](#22-backend-server)
    *   [Database (Memory)](#23-database-sqlite--prisma)
    *   [Admin Portal (Overwatch)](#24-admin-portal-overwatch)
3. - [**Core Architecture**](#core-architecture)
- [**Technology Choices**](#technology-choices)
- [**System Modules**](#system-modules)
- [**Deployment**](#deployment)
- [**Web Presence**](#web-presence)
- [**Legal & Compliance**](#legal-compliance)
- [**Contributing**](#contributing)
4.  [Directory Structure Deep-Dive](#4-directory-structure-deep-dive)
5.  [Core Modules Explained](#5-core-modules-explained)
    *   [The Eye (Vision-to-Code)](#the-eye-vision-to-code)
    *   [Neural Link (RAG System)](#neural-link-rag-system)
    *   [God Mode (Voice Integration)](#god-mode-voice-integration)
6.  [Deployment Strategy](#6-deployment-strategy)
    *   [Hybrid Cloud Model](#hybrid-cloud-model)
    *   [Vercel + LocalTunnel](#vercel--localtunnel)
7.  [Developer Guide](#7-developer-guide)
8.  [Troubleshooting & FAQ](#8-troubleshooting--faq)

---

## 1. Philosophy & Vision

VIRU was built to answer a simple question: **"What if your IDE was alive?"**

Most AI coding assistants (Copilot, ChatGPT) are passive. They wait for you to type. VIRU is **Agentic**. It has:
1.  **Agency**: It can make decisions, run commands, and fix its own errors.
2.  **Persistence**: It remembers your project history via Vector Database.
3.  **Omnipresence**: It sees your screen (Vision) and hears your voice (Audio).

The goal is to move from "Pair Programming" to "Director-level Programming", where you guide the AI high-level, and it handles the implementation details.

---

## 2. Technology Stack (The "Why" & "Where")

We chose a "Local-First" stack to ensure privacy, speed, and zero vendor lock-in.

### 2.1 Frontend (`/client`)
The "Neural Interface" is where the user interacts with VIRU.

*   **React 19 (`react`)**:
    *   *Where*: The core UI library.
    *   *Why*: React's component-based architecture is perfect for complex state management (Terminal history, RAG visualization). Version 19 brings simplified hooks and better performance.
*   **Vite (`vite`)**:
    *   *Where*: Build tool and Dev Server.
    *   *Why*: Instant Hot Module Replacement (HMR). Unlike Webpack, Vite uses native ES modules, making the dev experience 10x faster.
*   **TailwindCSS (`tailwindcss`)**:
    *   *Where*: Styling.
    *   *Why*: Utility-first CSS allows us to build the "Cyberpunk/Sci-Fi" aesthetic rapidly without writing thousands of lines of custom `.css` files.
*   **Lucide React (`lucide-react`)**:
    *   *Where*: Icons.
    *   *Why*: Lightweight, consistent SVG icons that render perfectly at any size.
*   **Framer Motion (`framer-motion`)**:
    *   *Where*: Animations.
    *   *Why*: Powering the smooth transitions, the "breathing" AI orb, and the Neural Link starfield.
*   **React Syntax Highlighter**:
    *   *Where*: Code blocks in chat.
    *   *Why*: Provides VS Code-like syntax coloring for generated code.

### 2.2 Backend (`/server`)
The "Brain" that processes logic and connects to the file system.

*   **Node.js**:
    *   *Where*: Runtime environment.
    *   *Why*: Allows us to use JavaScript/TypeScript across the full stack. Excellent ecosystem for file system operations (`fs`) and child processes.
*   **Express (`express`)**:
    *   *Where*: API Framework.
    *   *Why*: Battle-tested, minimalist web server. Handles the REST API endpoints (`/api/chat`, `/api/projects`).
*   **TypeScript (`typescript`)**:
    *   *Where*: The entire codebase.
    *   *Why*: Type safety is non-negotiable for a system that writes code. It prevents silly runtime errors like `undefined is not a function`.
*   **Compute Cosine Similarity**:
    *   *Where*: RAG Service.
    *   *Why*: A lightweight math library effectively finds the "distance" between two text vectors to retrieve relevant memories.
*   **LocalTunnel (`localtunnel`)**:
    *   *Where*: Deployment.
    *   *Why*: Instantly exposes the `localhost:5000` port to a public URL (`https://...loca.lt`), allowing the Vercel-hosted frontend to talk to your local backend.

### 2.3 Database (`SQLite` + `Prisma`)
*   **SQLite**:
    *   *Where*: `server/prisma/dev.db`
    *   *Why*: Serverless, single-file database. Zero configuration required. Perfect for a self-hosted desktop app.
*   **Prisma ORM**:
    *   *Where*: Database interaction.
    *   *Why*: Provides a type-safe client (`db.user.findMany()`). It manages schema migrations automagically.

### 2.4 Admin Portal (`/admin`)
*   **Reason for Separation**: The Admin portal ("Overwatch") is a separate React app running on port `5174`. It mimics a SaaS architecture where the "System Admin" (you) has a higher level of control than the standard User interface.

---

## 3. System Architecture

### Data Flow Diagram
When you type "Create a login form" into the terminal, here is the journey:

1.  **Input**: React Component (`Terminal.tsx`) captures text.
2.  **API Call**: `POST /api/chat` sent to Express Server.
3.  **Auth Middleware**: Server validates `Authorization: Bearer <token>`.
4.  **Agent Router**: `AgentService` analyzes keywords.
    *   *"Create"* -> **DEVELOPER** Agent.
5.  **Context Injection**: `RagService` searches `knowledge_vector_store.json` for similar code.
6.  **Inference**: Prompt + Context sent to **Ollama** (Local LLM).
7.  **Execution**:
    *   AI response: `>>> START_FILE: Login.tsx ...`
    *   `FsService` parses this and writes the file to disk.
8.  **Response**: Server sends final text back to Frontend.

### The Agent Router Logic
Located in `server/src/agents/agent.service.ts`.
It uses a deterministic "Intent Classification" system:
*   `fix, bug, error` -> **DEBUGGER**
*   `plan, architecture` -> **ARCHITECT**
*   `git, push, commit` -> **GIT_SPECIALIST**
*   `create, write, code` -> **DEVELOPER**
*   *Default* -> **ROOT** (General Chat)

---

## 4. Directory Structure Deep-Dive

```
VIRU/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # React UI Components
│   │   │   ├── Terminal.tsx # Main Chat Interface
│   │   │   ├── Workspace.tsx # File Tree
│   │   │   └── NeuralLink.tsx # 3D Graph View
│   │   ├── hooks/          # Custom Hooks (useAuth, useSocket)
│   │   └── config.ts       # API URL Configuration
│   └── package.json
│
├── server/                 # Backend Application
│   ├── src/
│   │   ├── agents/         # Agent Personas & Router
│   │   │   ├── agent.service.ts
│   │   │   └── prompts.ts  # System Prompts for each role
│   │   ├── services/       # Business Logic
│   │   │   ├── ai.service.ts   # Wrapper for Ollama/OpenAI
│   │   │   ├── rag.service.ts  # Vector DB Logic
│   │   │   ├── vision.service.ts # Image Processing
│   │   │   └── fs.service.ts   # Safe File System Access
│   │   └── index.ts        # Server Entrypoint
│   ├── prisma/             # Database Config
│   │   └── schema.prisma   # DB Models (User, Project, Message)
│   └── brain/              # Persistent AI Data
│       ├── agents.json     # Dynamic Agent Config
│       └── knowledge_vector_store.json # RAG Memory
│
├── admin/                  # Overwatch Dashboard
│   └── src/components/     # Admin UI
│
├── docker-compose.yml      # Container Orchestration
└── package.json            # Root Scripts (npm run dev)
```

---

## 5. Core Modules Explained

### The Eye (Vision-to-Code)
*   **How it works**:
    1.  User drags an image to the Terminal.
    2.  `Terminal.tsx` converts it to Base64.
    3.  Sent to `server/src/services/vision.service.ts`.
    4.  The service constructs a prompt for a Multimodal Model (like LLaVA or GPT-4o): *"Analyze this image and output React/Tailwind code to replicate it."*
    5.  The code is returned and can be auto-written to a file.

### Neural Link (RAG System)
*   **Purpose**: To give the AI context about your project that doesn't fit in the standard context window.
*   **Mechanism**:
    *   It recursively scans your `WORKSPACE_ROOT`.
    *   It "chunks" code files into small segments (e.g., 500 characters).
    *   It embeds them into 768-dimensional vectors.
    *   When you ask a question, it finds the "nearest neighbors" in vector space.

### God Mode (Voice Integration)
*   **Speech-to-Text (STT)**: Uses the browser's native `SpeechRecognition` API (in Chrome/Edge) for zero-latency transcription.
*   **Wake Word**: Currently manual activation via "Mic" button, but "Hey VIRU" logic is prepared in `brain/audio_triggers.json` (planned).

---

## 6. Deployment Strategy

We use a **Hybrid Cloud** model. This is unique to VIRU.

### The Problem
Traditional web apps live on a cloud server (AWS, Vercel). But VIRU needs to edit files on **YOUR** computer. A cloud server cannot touch your local C: drive.

### The Solution
1.  **Frontend on Cloud**: The React UI is hosted on **Vercel** (`https://viru-phi.vercel.app`). This gives you a fast, accessible URL you can open on your phone or tablet.
2.  **Backend on Local**: The Node server runs on your machine.
3.  **The Tunnel**: We use `localtunnel` to bore a secure hole through your firewall.
    *   Local: `http://localhost:5000`
    *   Public: `https://viru-rajpratham-gen1.loca.lt`

### Deployment Steps
1.  **Start Local**: Run `npm run dev` in the root. This starts the Backend + Tunnel.
2.  **Copy URL**: Copy the Tunnel URL from the terminal.
3.  **Configure Vercel**:
    *   Go to your project on Vercel.com.
    *   Settings -> Environment Variables.
    *   Set `VITE_API_URL` = `https://viru-rajpratham-gen1.loca.lt`.
4.  **Redeploy**: Click "Redeploy" on Vercel.

Now, the Cloud UI controls your Local Machine. 🤯

---

## 7. Developer Guide

### Adding a New API Route
1.  Open `server/src/index.ts`.
2.  Add `app.get('/api/new-route', (req, res) => { ... })`.
3.  Restart server (Nodemon handles this automatically).

### Changing Agent Prompts
1.  You do **not** need to restart.
2.  Edit `server/brain/agents.json`.
3.  The `AgentService` reads this file on every request, so changes are instant.

### Customizing the Theme
1.  Open `client/src/index.css`.
2.  We use CSS Variables for the "Matrix Green" theme (`--color-primary`). Change these hex codes to re-skin the entire app.

---

## 8. Troubleshooting & FAQ

### "It says Network Error"
*   **Cause**: The Frontend cannot reach the Backend.
*   **Fix**:
    1.  Is `npm run dev` running locally?
    2.  Check the browser console (F12) -> Network Tab. Is the API URL correct?
    3.  If using the Tunnel, open the Tunnel URL in a new tab. It might ask for a "Bypass" password (your public IP).

### "The AI is hallucinating files"
*   **Cause**: The RAG context is outdated.
*   **Fix**: Run the command `/reset-memory` (if implemented) or manually delete `server/brain/knowledge_vector_store.json` to force a rebuild.

### "Prisma Error: Database is locked"
*   **Cause**: SQLite writes are serial.
*   **Fix**: This usually happens if you have the database open in a viewer (like DBeaver) while the app tries to write. Close external viewers.

---

**VIRU System Documentation**
*Maintained by the Core Engineering Team*
*Reach out to Raj Pratham for architectural inquiries.*
