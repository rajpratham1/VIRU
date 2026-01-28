# 🦅 VIRU v1.0: The Autonomous AI Infrastructure

> **"Virtual Intelligence Response Unit"** — A Self-Hosted, Agentic Operating System.

![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-brightgreen)
![Version](https://img.shields.io/badge/VERSION-1.0.0-blue)
![License](https://img.shields.io/badge/LICENSE-MIT-green)
![Stack](https://img.shields.io/badge/STACK-MERN%20%2B%20LOCAL%20LLM-orange)

**Free alternative to ChatGPT and GitHub Copilot** - VIRU is a privacy-first, self-hosted AI coding assistant that runs 100% locally. Unlike cloud-based alternatives, your code never leaves your machine, and there are no monthly subscription fees.

## 🔍 Keywords
`ChatGPT alternative` · `GitHub Copilot alternative` · `free AI coding assistant` · `local LLM` · `self-hosted AI` · `privacy-first AI` · `open-source coding assistant` · `autonomous AI agent` · `Ollama` · `local AI developer tool`

## 🌐 Web Presence

**Landing Page**: [viru.vercel.app](https://viru-ptif.vercel.app/) _(Deploy your own from `landing-page/`)_  
**GitHub**: [github.com/rajpratham1/VIRU](https://github.com/rajpratham1/VIRU)  
**License**: MIT (100% Free & Open Source)

## 📁 Repository Structure

This repository contains:
- **`/client`** - React frontend (main VIRU interface)
- **`/server`** - Node.js backend (AI engine)
- **`/admin`** - Admin dashboard
- **`/landing-page`** - Marketing website (not needed for VIRU to run)

**To download VIRU**: Use the "Download ZIP" button which excludes the landing page automatically.  
**To deploy landing page**: See `landing-page/README.md`

---

## ⚡ Key Capabilities

### 1. 👁️ The Eye (Vision-to-Code)
**"See it, Build it."**
*   Drag and drop any UI screenshot into the terminal.
*   VIRU analyzes the image using Multimodal AI (LLaVA/GPT-4V) and writes the complete React/Tailwind code to replicate it.

### 2. 🗣️ The Voice (God Mode)
**"Hands-free Coding."**
*   **Command Mode**: Click the Mic for single instructions.
*   **God Mode (∞)**: Continuous conversations. VIRU listens, thinks, executes, and speaks back.

### 3. 🧠 The Neural Link (RAG Memory)
**"Total Recall."**
*   VIRU maintains a persistent **Vector Database** of your project.
*   It remembers context from previous conversations and documents.
*   **Visualizer**: View your project's memory as a 3D interactive starfield.

### 4. ✈️ Autopilot (Self-Healing)
**"Code that fixes itself."**
*   Command: `/autopilot <goal>`
*   VIRU writes code, runs tests, reads errors, and fixes itself in a loop.

### 5. 🛡️ Overwatch (Admin Portal)
**"Control Everything."**
*   A standalone SaaS Dashboard running on port `5174`.
*   Manage users, broadcast system-wide alerts, and manage subscription tiers.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite, TailwindCSS
*   **Backend**: Node.js, Express, TypeScript
*   **Database**: SQLite + Prisma ORM
*   **AI Engine**: Ollama (Local) or OpenAI (Cloud)
*   **Infrastructure**: Docker, LocalTunnel

---

## 🚀 Quick Start

### 🐳 Method 1: Docker (Recommended for Everyone)

**Prerequisites:**
1.  [Docker Desktop](https://www.docker.com/products/docker-desktop)
2.  [Ollama](https://ollama.com) → Run: `ollama pull mistral`

**Installation:**

```bash
git clone https://github.com/rajpratham1/VIRU.git
cd VIRU
docker-compose up -d
```

**Access:**
*   **Main Console**: http://localhost:5173
*   **Admin Dashboard**: http://localhost:5174
*   **API**: http://localhost:5000

**Stop:** `docker-compose down`

> 📘 See [DOCKER.md](DOCKER.md) for publishing to Docker Hub

---

### 💻 Method 2: Manual Setup (For Developers)

**Prerequisites:** Node.js v18+, Ollama

```bash
# Clone & Install
git clone https://github.com/rajpratham1/VIRU.git
cd VIRU
npm install
cd client && npm install && cd ..
cd server && npm install && npx prisma generate && npx prisma db push && cd ..
cd admin && npm install && cd ..

# Run
npm run dev
```

---

## 🌐 Deployment (Hybrid Cloud)

VIRU runs **locally** but can be accessed from **anywhere** via:

1.  **Backend**: Runs on your machine with auto-tunnel: `https://viru-rajpratham-gen1.loca.lt`
2.  **Frontend**: Deployed to Vercel
3.  **Connection**: Set Vercel env `VITE_API_URL` to your tunnel URL

---

## ⚠️ Troubleshooting

**CORS/Network Error:**
*   Ensure backend is running
*   Visit tunnel URL once to bypass IP check

**500 Error:**
*   Check `server/error.log`
*   Verify Ollama is running: `ollama list`

**Docker Issues:**
*   Can't connect to Ollama? Use `AI_MODEL_URL=http://host.docker.internal:11434`
*   Port conflicts? Change ports in `docker-compose.yml`

---

## 📚 Documentation

*   [DOCKER.md](DOCKER.md) - Docker distribution guide
*   [documentation.md](documentation.md) - Full technical docs
*   [learn.md](learn.md) - Developer glossary

---

## 📜 License

MIT License - See [LICENSE](LICENSE)

---

## 👥 Credits

**Architect**: Raj Pratham  
**System**: VIRU (Virtual Intelligence Response Unit)

*"Engineered for the Future."*
