# 🦅 VIRU v1.0: The Autonomous AI Infrastructure

> **"Virtual Intelligence Response Unit"** — A Self-Hosted, Agentic Operating System.

![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-brightgreen)
![Version](https://img.shields.io/badge/VERSION-1.0.0-blue)
![License](https://img.shields.io/badge/LICENSE-MIT-green)
![Stack](https://img.shields.io/badge/STACK-MERN%20%2B%20LOCAL%20LLM-orange)

VIRU is an advanced **Agentic IDE** that lives on your desktop. Unlike standard chatbots, VIRU has direct access to your file system, allowing it to write code, execute commands, and deploy applications autonomously. It combines the power of **Local LLMs (Ollama)** with a modern React interface.

---

## ⚡ Key Capabilities

### 1. 👁️ The Eye (Vision-to-Code)
**"See it, Build it."**
*   Drag and drop any UI screenshot into the terminal.
*   VIRU analyzes the image using Multimodal AI (LLaVA/GPT-4V) and writes the complete React/Tailwind code to replicate it.

### 2. 🗣️ The Voice (God Mode)
**"Hands-free Coding."**
*   **Command Mode**: Click the Mic for single instructions.
*   **God Mode (∞)**: Continuous conversations. VIRU listens, thinks, executes, and speaks back. Perfect for "walking and talking" architecture planning.

### 3. 🧠 The Neural Link (RAG Memory)
**"Total Recall."**
*   VIRU maintains a persistent **Vector Database** of your project.
*   It remembers context from previous conversations and documents.
*   **Visualizer**: View your project's memory as a 3D interactive starfield in the "Neural Link" tab.

### 4. ✈️ Autopilot (Self-Healing)
**"Code that fixes itself."**
*   Command: `/autopilot <goal>`
*   VIRU writes code, runs the terminal to check for errors, reads the error logs, and fixes its own mistakes in a loop until the goal is achieved.

### 5. 🛡️ Overwatch (Admin Portal)
**"Control Everything."**
*   A standalone SaaS Dashboard running on port `5174`.
*   Manage users, ban abusers, broadcast system-wide alerts, and manage Subscription Tiers (Free vs Pro).

---

## 🛠️ Technology Stack

*   **Frontend**: React, Vite, TailwindCSS (The "Neural Interface")
*   **Backend**: Node.js, Express, TypeScript (The "Brain")
*   **Database**: SQLite + Prisma ORM
*   **AI Engine**: Ollama (Local) or OpenAI (Cloud)
*   **Infrastructure**: LocalTunnel (for self-hosting), Docker support

---

## � Quick Start Guide

### Prerequisites
1.  **Node.js v18+** installed.
2.  **Ollama** installed and running (`ollama run mistral`).

### Installation

```bash
# 1. Clone the Repository
git clone https://github.com/your-username/viru.git
cd viru

# 2. Install Dependencies (Root + Client + Server + Admin)
npm install
cd client && npm install
cd ../server && npm install
cd ../admin && npm install

# 3. Setup Database
cd ../server
npx prisma generate
npx prisma db push
```

### Running the System

We have engineered a **One-Click Startup** command that launches the Backend, Frontend, Admin Panel, and a Public Tunnel simultaneously.

```bash
# From the Project Root
npm run dev
```

*   **Console**: [http://localhost:5173](http://localhost:5173)
*   **Server**: [http://localhost:5000](http://localhost:5000)
*   **Overwatch**: [http://localhost:5174](http://localhost:5174)

---

## 🌐 Deployment (Hybrid Cloud)

VIRU is designed to be **Self-Hosted** on your machine while accessible from the cloud (e.g., Vercel).

1.  **Backend**: Runs on your laptop/server (`npm run dev`).
    *   It automatically creates a secure tunnel: `https://viru-rajpratham-gen1.loca.lt`
2.  **Frontend**: Deployed to Vercel (`viru.vercel.app`).
    *   Go to Vercel Settings -> Environment Variables.
    *   Set `VITE_API_URL` to your Tunnel URL.

This allows you to control your powerful local machine from a lightweight cloud interface anywhere in the world.

---

## ⚠️ Troubleshooting

**"CORS Error" or "Network Error"**
*   Ensure the Backend is running (`npm run dev`).
*   Verify the Tunnel URL hasn't changed.
*   If using the Tunnel, you may need to visit the Tunnel URL **once** in your browser to bypass the security check (Public IP password).

**"500 Internal Server Error"**
*   Check `server/error.log` for details.
*   Ensure **Ollama** is running (`ollama list` should show models).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## � Credits

**Architect**: Raj Pratham
**System**: VIRU (Virtual Intelligence Response Unit)

*"Engineered for the Future."*