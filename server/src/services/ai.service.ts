import { CONFIG } from '../config';

interface AIRequest {
    model: string;
    prompt: string;
    stream?: boolean;
}

export class AIService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = CONFIG.AI_MODEL_URL;
    }

    async generate(prompt: string, systemPrompt?: string, context?: string, images?: string[], modelOverride?: string) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 300s (5m) timeout for model loading

        try {
            const model = modelOverride || 'mistral';
            console.log(`[AI Service] Sending request to ${this.baseUrl} (Model: ${model})...`);

            const body: any = {
                model: model,
                prompt: context ? `Context information is below.\n---------------------\n${context}\n---------------------\nGiven the context information and not prior knowledge, answer the query.\nQuery: ${prompt}` : prompt,
                system: systemPrompt || "You are a helpful AI assistant.",
                stream: false
            };

            if (images && images.length > 0) {
                body.images = images; // Ollama expects base64 strings
            }

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log(`[AI Service] Response Status: ${response.status}`);

            if (!response.ok) {
                throw new Error(`AI Service Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error('❌ AI Brain Connection Error:', error.message);

            let msg = `[SYSTEM ALERT]: Neural Core Request Failed.`;
            if (error.name === 'AbortError') {
                msg += `\n\nTimeout: The model is taking too long to load (or download).`;
            } else if (error.cause?.code === 'ECONNREFUSED') {
                msg += `\n\nConnection Refused to ${this.baseUrl}. Is Ollama running?`;
            } else {
                msg += `\n\nError Details: ${error.message}`;
            }

            return msg + `\n\nTroubleshooting:\n1. Open a terminal.\n2. Run: ollama run mistral\n3. Wait for it to chat, then try here again.`;
        }
    }
}

export const aiService = new AIService();
