import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

// Manual CORS Middleware - Brute Force Allow
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(express.json());

import { AgentService } from './agents/agent.service';
import { fsService } from './services/fs.service';
import { aiService } from './services/ai.service';
import { ragService } from './services/rag.service';
import { authService } from './services/auth.service';
import { projectService } from './services/project.service';
import { deploymentService } from './services/deployment.service';
import { adminService } from './services/admin.service'; // Import Admin Service
import { promises as fs } from 'fs';
import path from 'path';
import { authenticateToken, AuthRequest } from './middleware/auth';
import { autopilotService } from './services/autopilot.service';

// ...

const agentService = new AgentService();

app.get('/', (req, res) => {
    res.send({ status: 'VIRU Server Online', version: '1.0.0', mode: 'Self-Hosted' });
});

import { prisma } from './db';

app.get('/api/files', async (req, res) => {
    try {
        const path = (req.query.path as string) || '.';
        const files = await fsService.listFiles(path);
        res.json({ files });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/files/content', async (req, res) => {
    try {
        const path = req.query.path as string;
        if (!path) return res.status(400).json({ error: 'Path required' });
        const content = await fsService.readFile(path);
        res.json({ content });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/files/content', async (req, res) => {
    try {
        const { path, content } = req.body;
        if (!path || content === undefined) return res.status(400).json({ error: 'Path and content required' });
        await fsService.writeFile(path, content);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/db/stats', async (req, res) => {
    try {
        const projectCount = await prisma.project.count();
        const userCount = await prisma.user.count();
        const msgCount = await prisma.message.count();

        // Mock data for table view (since we might be empty)
        const recentProjects = await prisma.project.findMany({ take: 5, orderBy: { updatedAt: 'desc' } });

        res.json({
            stats: {
                projects: projectCount,
                users: userCount,
                messages: msgCount
            },
            recentProjects
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        const result = await authService.register(username, password);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

// RAG: Ingest Document
app.post('/api/rag/ingest', async (req, res) => {
    try {
        const { filename, content } = req.body;
        if (!filename || !content) return res.status(400).json({ error: 'Missing filename or content' });

        const stats = await ragService.addDocument(filename, content);
        res.json({ success: true, stats });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// RAG: Get Stats
app.get('/api/rag/stats', (req, res) => {
    res.json(ragService.getStats());
});

app.get('/api/rag/graph', (req, res) => {
    res.json(ragService.getGraphData());
});

// History Endpoint
app.get('/api/chat/history', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.id;
        const messages = await prisma.message.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: 100 // Limit to last 100 messages for now
        });
        res.json({ messages });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Agent Configuration Endpoints
const AGENTS_FILE = path.join(__dirname, '../brain/agents.json');

app.get('/api/agents', authenticateToken, async (req: AuthRequest, res) => {
    try {
        await fsService.ensureDir(path.dirname(AGENTS_FILE));
        // Create default if not exists
        try {
            await fs.access(AGENTS_FILE);
        } catch {
            const defaultAgents = {
                "ROOT": { "description": "The main software engineer.", "systemPrompt": "You are VIRU..." }
            };
            await fs.writeFile(AGENTS_FILE, JSON.stringify(defaultAgents, null, 2));
        }

        const data = await fs.readFile(AGENTS_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load agents' });
    }
});

app.post('/api/agents', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const agents = req.body;
        await fs.writeFile(AGENTS_FILE, JSON.stringify(agents, null, 2));
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: 'Failed to save agents' });
    }
});

// Project Endpoints
app.post('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name required' });
        const project = await projectService.createProject(req.user.id, name);
        res.json(project);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const projects = await projectService.getUserProjects(req.user.id);
        res.json(projects);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Deployment Endpoints
app.post('/api/deploy/:projectId', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { projectId } = req.params;
        const project = await projectService.getProject(projectId);

        if (!project) return res.status(404).json({ error: 'Project not found' });
        // Check ownership
        if (project.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        const result = await deploymentService.deployProject(projectId, project.path);
        res.json({ status: 'deployed', url: result.url, port: result.port });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/deploy/:projectId/stop', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { projectId } = req.params;
        const result = await deploymentService.stopDeployment(projectId);
        res.json({ success: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Endpoints (Privileged)
// In a real app, middleware would check for req.user.isAdmin
app.get('/api/admin/users', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/broadcast', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { message, type } = req.body;
        const result = await adminService.broadcastMessage(message, type);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/tier', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { userId, tier } = req.body;
        const result = await adminService.updateUserTier(userId, tier);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Autopilot
app.post('/api/autopilot/start', authenticateToken, async (req: AuthRequest, res) => {
    // Fire and forget - don't wait for completion
    const { projectId, goal } = req.body;
    const userId = req.user.id;

    // Start background mission
    autopilotService.startMission(projectId, userId, goal);

    res.json({ status: 'started', message: 'Autopilot mission initiated.' });
});

import { visionService } from './services/vision.service';

app.post('/api/vision/analyze', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { image, prompt, projectId } = req.body;
        if (!image) return res.status(400).json({ error: 'Image data required' });

        const result = await visionService.analyzeImage(projectId, req.user.id, image, prompt);
        res.json({ response: result, agent: 'VISION_CORE' });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/chat', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { prompt, projectId } = req.body;
        const userId = req.user.id;

        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

        // Save User Message
        await prisma.message.create({
            data: { role: 'user', content: prompt, userId, projectId }
        });

        // RAG Lookup
        const context = await ragService.constructContext(prompt);
        let finalResponse = "";
        let agentIdentity = "ROOT";

        if (context) {
            finalResponse = await aiService.generate(prompt, undefined, context);
            agentIdentity = "RAG_SYSTEM";
        } else {
            // Get Project Path if exists
            let projectPath = "";
            if (projectId) {
                const project = await projectService.getProject(projectId);
                if (project) projectPath = project.path;
            }

            const result = await agentService.process(prompt, projectPath);
            finalResponse = result.response;
            agentIdentity = result.agent;
        }

        // Save AI Message
        await prisma.message.create({
            data: { role: 'ai', content: finalResponse, userId, agent: agentIdentity, projectId }
        });

        res.json({ response: finalResponse, agent: agentIdentity });
    } catch (error: any) {
        console.error(error);
        await fs.appendFile('error.log', `${new Date().toISOString()} - ${error.stack || error}\n`);
        res.status(500).json({ error: 'Internal System Error: ' + error.message });
    }
});

app.listen(CONFIG.PORT, () => {
    console.log(`\n🚀 VIRU System Online`);
    console.log(`📡 Server running on http://localhost:${CONFIG.PORT}`);
    console.log(`🧠 AI Core connected to ${CONFIG.AI_MODEL_URL}`);
});
