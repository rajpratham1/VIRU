import { aiService } from './ai.service';
import { prisma } from '../db';

export class VisionService {
    async analyzeImage(projectId: string, userId: string, imageBase64: string, prompt: string) {
        console.log(`[Vision] Analyzing image for Project ${projectId}...`);

        // We assume the user has a vision-capable model. 
        // LLaVA is standard for Ollama. If not present, this might fail or fallback to text-only (garbage out).
        // We'll try to use 'llava' specifically for vision, or fallback to the default if the user overrides.
        const visionModel = 'llava';

        try {
            // 1. Send to AI
            const response = await aiService.generate(
                prompt || "Describe this UI and write the comprehensive React code to recreate it. Use Tailwind CSS.",
                "You are an expert Frontend Engineer. Your job is to convert UI screenshots into pixel-perfect React code.",
                undefined,
                [imageBase64],
                visionModel
            );

            // 2. Log key events
            await prisma.message.create({
                data: {
                    role: 'user',
                    content: `[Uploaded Image] ${prompt}`,
                    userId,
                    projectId
                }
            });

            await prisma.message.create({
                data: {
                    role: 'ai',
                    content: response,
                    userId,
                    projectId,
                    agent: 'VISION_CORE'
                }
            });

            return response;

        } catch (error: any) {
            console.error("[Vision] Error:", error.message);
            // Fallback suggestions
            if (error.message.includes("not found")) {
                return "❌ **Vision Model Missing**: Please run `ollama pull llava` in your terminal to enable vision capabilities.";
            }
            throw error;
        }
    }
}

export const visionService = new VisionService();
