import { promises as fs } from 'fs';
import path from 'path';
import { CONFIG } from '../config';
import { v4 as uuidv4 } from 'uuid';
import similarity from 'compute-cosine-similarity';

// Simple interface for a "Memory"
interface KnowledgeChunk {
    id: string;
    source: string;
    content: string;
    embedding: number[];
    createdAt: string;
}

export class RagService {
    private knowledgeFile = path.join(__dirname, '../../brain/knowledge_vector_store.json');
    private knowledge: KnowledgeChunk[] = [];
    private brainDir = path.join(__dirname, '../../brain');
    private baseUrl = CONFIG.AI_MODEL_URL;

    constructor() {
        this.init();
    }

    async init() {
        // Ensure brain dir exists
        try {
            await fs.mkdir(this.brainDir, { recursive: true });
        } catch (e) { }

        // Load existing knowledge
        try {
            const data = await fs.readFile(this.knowledgeFile, 'utf-8');
            this.knowledge = JSON.parse(data);
            console.log(`[RAG] Loaded ${this.knowledge.length} memories.`);
        } catch (e) {
            this.knowledge = []; // Init empty
            console.log('[RAG] Initialized new memory store.');
        }
    }

    private async saveDb() {
        await fs.writeFile(this.knowledgeFile, JSON.stringify(this.knowledge, null, 2));
    }

    // Call Ollama to get embeddings
    private async getEmbedding(text: string): Promise<number[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma3:4b', // Use the user's working model
                    prompt: text
                })
            });
            const data = await response.json();
            return data.embedding || [];
        } catch (error) {
            console.error('[RAG] Embedding Error:', error);
            return [];
        }
    }

    async addDocument(filename: string, content: string) {
        console.log(`[RAG] Ingesting: ${filename}`);

        // 1. Chunking (Simple paragraph split for MVP)
        // Ideally should be smarter (overlapping windows), but this is fine for v1.
        const chunks = content.split(/\n\s*\n/).filter(c => c.length > 50);

        for (const text of chunks) {
            const embedding = await this.getEmbedding(text);
            if (embedding.length > 0) {
                this.knowledge.push({
                    id: uuidv4(),
                    source: filename,
                    content: text,
                    embedding: embedding,
                    createdAt: new Date().toISOString()
                });
            }
        }
        await this.saveDb();
        return { chunks: chunks.length };
    }

    async constructContext(query: string, maxResults = 3): Promise<string> {
        if (this.knowledge.length === 0) return "";

        const queryEmbedding = await this.getEmbedding(query);
        if (queryEmbedding.length === 0) return "";

        // Calculate cosine similarity for all chunks
        const scored = this.knowledge.map(chunk => ({
            ...chunk,
            score: similarity(chunk.embedding, queryEmbedding) || 0
        }));

        // Sort by relevance
        scored.sort((a, b) => b.score - a.score);

        // Take top N
        const top = scored.slice(0, maxResults).filter(r => r.score > 0.5); // Min threshold

        if (top.length === 0) return "";

        console.log(`[RAG] Found ${top.length} relevant memories for query.`);

        return top.map(c => `[Context from ${c.source}]:\n${c.content}`).join("\n\n");
    }

    getStats() {
        return {
            documents: new Set(this.knowledge.map(k => k.source)).size,
            chunks: this.knowledge.length
        };
    }

    getGraphData() {
        // Return simplified nodes for visualization
        return this.knowledge.map(k => ({
            id: k.id,
            source: k.source,
            preview: k.content.substring(0, 50) + "..."
        }));
    }
}

export const ragService = new RagService();
