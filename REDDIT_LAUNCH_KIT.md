# Reddit Launch Kit - VIRU

## 📝 POST 1: For r/LocalLLaMA (Primary Target)

### Title:
```
[Project] VIRU - I built a free, self-hosted AI coding assistant with vision, voice, and autopilot (ChatGPT alternative)
```

### Post Body:
```markdown
Hey r/LocalLLaMA! 👋

I spent the last few months building **VIRU** - a completely free, self-hosted alternative to ChatGPT and GitHub Copilot that runs entirely on your machine using Ollama.

## What makes it different?

**It's actually agentic** - not just a chatbot:
- **The Eye**: Drop a UI screenshot → get instant React/Tailwind code
- **Autopilot**: Writes code, tests it, reads errors, fixes itself in a loop
- **God Mode**: Continuous voice input (hands-free coding)
- **The Neural Link**: RAG system with 3D visualization of your project memory
- **Multi-Agent**: Specialized agents (Architect, Developer, Debugger, Git Specialist)

## Tech Stack
- Frontend: React 19, Vite, TailwindCSS
- Backend: Node.js, Express, TypeScript
- AI: Ollama (works with Mistral, Llama, CodeLlama, etc.)
- Database: SQLite + Prisma
- Deployment: Docker (2-command setup)

## Installation

Literally 2 commands:
```bash
git clone https://github.com/rajpratham1/VIRU.git
cd VIRU
docker-compose up -d
```

Then visit http://localhost:5173

## Why I built this

I was spending $20/month on ChatGPT Plus and still couldn't give it file system access or run it offline. VIRU solves all of that while being completely free and private.

**GitHub**: https://github.com/rajpratham1/VIRU  
**License**: MIT (fully open source)

## What's Next?
- VS Code extension for real-time completion
- Web search integration
- Team collaboration features

Would love your feedback! What features would make you switch from ChatGPT?

---

**Note**: Requires Docker + Ollama (both free). Works on Windows/Mac/Linux.
```

---

## 📝 POST 2: For r/selfhosted

### Title:
```
VIRU - Self-hosted AI coding assistant that costs $0/month (alternative to GitHub Copilot)
```

### Post Body:
```markdown
I built a self-hosted AI coding assistant that's actually useful.

## The Problem
- GitHub Copilot: $10-19/month
- ChatGPT Plus: $20/month
- Cursor: $20/month
- All send your code to the cloud 😬

## The Solution: VIRU
100% self-hosted AI that:
- Writes and deploys code autonomously
- Has vision (screenshot → code)
- Has voice input (God Mode for hands-free coding)
- Self-heals (autopilot that fixes its own errors)
- Costs $0/month forever

## Setup

**Requirements:**
- Docker Desktop
- Ollama (for local AI)

**Installation:**
```bash
git clone https://github.com/rajpratham1/VIRU.git
cd VIRU
docker-compose up -d
```

Access at http://localhost:5173

## Privacy
Your code, conversations, and data **never leave your machine**. No telemetry, no logging, no cloud API calls.

## Features
- Multi-agent system (Architect, Developer, Debugger)
- RAG for project memory
- File system access (actually edits your code)
- Git integration
- Web deployment via LocalTunnel

**GitHub**: https://github.com/rajpratham1/VIRU  
**License**: MIT

Happy to answer questions! 🚀
```

---

## 🖼️ IMAGE GUIDE: What Screenshots to Capture

### Image 1: **The Dashboard** (Required - Main Image)
**What to show:**
- VIRU dashboard with project list
- Dark theme looking professional
- Show 2-3 demo projects

**How to capture:**
1. Open VIRU at http://localhost:5173
2. Make sure you have some projects created
3. Take a full-screen screenshot
4. Use **Windows Snipping Tool** (Win + Shift + S)
5. **Crop** to just the browser window (no desktop/taskbar)

**File name:** `viru-dashboard.png`

---

### Image 2: **The Eye - Vision Demo** (Highly Recommended)
**What to show:**
- Split view: Original screenshot on left, generated code on right

**How to create:**
1. Find a nice UI screenshot (e.g., a login form from Dribbble)
2. Drag it into VIRU terminal
3. Take screenshot WHILE VIRU is responding with code
4. Use an image editor to create side-by-side comparison

**File name:** `viru-vision-demo.png`

---

### Image 3: **Terminal in Action** (Required)
**What to show:**
- Terminal with colorful agent responses
- Show different agents (Architect in blue, Developer in green)
- Include some actual code being generated

**How to capture:**
1. Ask VIRU: "Create a React todo app component"
2. Wait for the response to show
3. Screenshot the terminal with the full conversation
4. Make sure the **agent icons and colors** are visible

**File name:** `viru-terminal.png`

---

### Image 4: **3D Neural Link** (Optional but Cool)
**What to show:**
- The Neural Link 3D visualization tab

**How to capture:**
1. Click "Neural Link" tab
2. Let the 3D graph load
3. Screenshot the full view

**File name:** `viru-neural-link.png`

---

### Image 5: **Autopilot in Action** (Powerful for Reddit)
**What to show:**
- Terminal showing autopilot fixing errors in a loop

**How to create:**
1. Run `/autopilot create a calculator app`
2. Screenshot the terminal showing the iterative fixing process
3. Capture at least 2-3 iterations

**File name:** `viru-autopilot.png`

---

## 🎨 Image Creation Tools (Free)

### Option 1: Simple Collage (Recommended)
Use **Canva** (free):
1. Go to canva.com
2. Create "Social Media Post" (1200x630px)
3. Upload your screenshots
4. Arrange in a grid (2x2 or 3 images side-by-side)
5. Add text: "VIRU - Free Self-Hosted AI"
6. Download as PNG

**Template Layout:**
```
┌─────────────┬─────────────┐
│  Dashboard  │  Terminal   │
├─────────────┴─────────────┤
│    Vision Demo (wide)     │
└───────────────────────────┘
```

### Option 2: Professional Banner
Use **Figma** (free):
1. Create 1920x1080px frame
2. Dark gradient background (#0a0a0a → #1a1a1a)
3. Add your best screenshot (faded in center)
4. Overlay text:
   - "VIRU" (large, white)
   - "Free Self-Hosted AI Coding Assistant" (smaller)
   - "$0/month • 100% Private • Open Source"
5. Export as PNG

---

## 📸 Quick Screenshot Checklist

Before posting:
- [ ] Dashboard looks professional (no errors/empty state)
- [ ] Terminal shows colorful, interesting output
- [ ] At least ONE screenshot showing actual code generation
- [ ] Images are **high resolution** (not blurry)
- [ ] Images are **cropped** (no desktop/taskbar)
- [ ] Text is readable (zoom in to check)

---

## 🎯 Posting Strategy

### Best Time to Post:
- **r/LocalLLaMA**: Tuesday-Thursday, 9am-11am EST
- **r/selfhosted**: Wednesday-Friday, 10am-2pm EST

### Image Recommendations:
1. **For r/LocalLLaMA**: Use a collage showing all features (3-4 images)
2. **For r/selfhosted**: Use dashboard + terminal (2 images max, they prefer simplicity)

### Reddit Image Upload:
1. Click "Create Post"
2. Choose "Image & Video"
3. Upload your collage
4. Paste the post text
5. Add flair (usually "Project" or "Showcase")

---

## 💡 Pro Tips

1. **Reply quickly**: Be online for first 30 minutes to answer questions
2. **Be humble**: "Would love feedback" > "This is amazing"
3. **Engage**: Upvote and respond to every comment
4. **Cross-post**: After 24 hours, share to r/programming, r/opensource
5. **Update post**: Edit with "EDIT: Thanks for all the feedback!" after 100+ upvotes

---

## 🚨 Common Questions to Prepare For

**Q: "How is this different from ChatGPT?"**
A: "VIRU has direct file system access and runs 100% locally. Your code never leaves your machine, and it's free forever."

**Q: "Why not just use Cursor/GitHub Copilot?"**
A: "Those cost $10-20/month and send your code to the cloud. VIRU is self-hosted and free."

**Q: "What LLM models does it support?"**
A: "Any Ollama model: Mistral, Llama, CodeLlama, DeepSeek, etc. You can even use OpenAI if you prefer."

**Q: "Can it actually write real code or just demos?"**
A: "I've used it to build full apps. The autopilot feature iterates on errors until the code works."

**Q: "Installation is too hard, can you make it easier?"**
A: "Working on a VS Code extension and one-click installer. For now, Docker is the easiest (2 commands)."

---

## 📊 Success Metrics

**Good Launch:**
- 50+ upvotes in 24 hours
- 20+ comments
- 100+ GitHub stars

**Great Launch:**
- 200+ upvotes
- 50+ comments
- 500+ stars
- Cross-posted to other subs

**Viral:**
- 1000+ upvotes
- Front page of r/LocalLLaMA
- Featured in newsletters
- 2000+ stars

---

## 🎬 Bonus: Video Alternative

Instead of images, record a **30-second GIF**:

**Tools:**
- ScreenToGif (Windows, free)
- Kap (Mac, free)

**What to record:**
1. Open VIRU (0-5s)
2. Type a prompt (5-10s)
3. Show code generation (10-20s)
4. Show result/preview (20-30s)

**Upload as:**
- Reddit native video
- OR convert to GIF and upload to Imgur

---

**Ready to post?** Create your images, then paste the Reddit post text. You'll get way more engagement with good visuals! 🚀
