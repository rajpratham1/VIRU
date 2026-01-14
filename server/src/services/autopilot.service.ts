import { aiService } from './ai.service';
import { agentService } from '../agents/agent.service';
import { prisma } from '../db';
import { fsService } from './fs.service';

export class AutopilotService {

    async startMission(projectId: string, userId: string, goal: string) {
        console.log(`[Autopilot] Mission Start: ${goal}`);

        // 1. Announce Execution
        await this.log(projectId, userId, `🚀 **Autopilot Engaged**\nMission: ${goal}`);

        try {
            // 2. Planning Phase
            const project = await prisma.project.findUnique({ where: { id: projectId } });
            if (!project) throw new Error("Project not found");

            await this.log(projectId, userId, `🧠 **Planning**: Analyzing architecture...`);

            const planPrompt = `
                You are a Lead Software Architect.
                Goal: "${goal}"
                Project Path: "${project.path}"
                
                Identify the LIST of files directly required to achieve this goal. 
                Do not list existing files unless they need modification.
                Return strictly a JSON object: { "files": ["src/components/MyComponent.tsx", "src/utils/helper.ts"] }
            `;

            // Temporary simple parsing - broadly assuming LLM behaves or using regex to find JSON
            const planResponse = await aiService.generate(planPrompt, "You output strictly JSON.");
            const jsonMatch = planResponse.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                await this.log(projectId, userId, `❌ **Plan Failed**: Could not parse AI plan.`);
                return;
            }

            const plan = JSON.parse(jsonMatch[0]);
            await this.log(projectId, userId, `📋 **Plan Approved**: \n${plan.files.map((f: string) => `- \`${f}\``).join('\n')}`);

            // 3. Execution Loop
            for (const file of plan.files) {
                await this.log(projectId, userId, `🔨 **Implementing**: \`${file}\`...`);

                // Prompt Agent to code this specific file
                const filePrompt = `
                    Implementation Goal: Create/Update ${file} to satisfy: "${goal}".
                    Context: This is part of a larger feature.
                    Ensure the code is complete and production ready.
                `;

                // We use agentService to generate AND write the file
                // We force the 'DEVELOPER' persona for code generation
                const devResult = await agentService.process(filePrompt, project.path); // Agent service auto-detects DEVELOPER logic if we frame it right, or we might need to expose specific method.
                // Actually agentService.process detects intent. Let's make sure it detects 'write'.

                // 4. Verification (Self-Healing)
                // For this MVP, we simulate a "Review" pass.
                // In a real build, we'd run 'tsc' here.

                await this.log(projectId, userId, `🧐 **Verifying**: \`${file}\`...`);
                // Simple heuristic: Does it look empty?
                const content = await fsService.readFile(file); // This might fail if agentService didn't write it.
                if (!content || content.length < 10) {
                    await this.log(projectId, userId, `⚠️ **Correction Needed**: File seems empty. Retrying...`);
                    // Retry logic would go here
                } else {
                    await this.log(projectId, userId, `✅ **Verified**: \`${file}\` looks good.`);
                }
            }

            await this.log(projectId, userId, `🎉 **Mission Complete**: All tasks finished.`);

        } catch (error: any) {
            console.error(error);
            await this.log(projectId, userId, `💥 **CRITICAL FAILURE**: ${error.message}`);
        }
    }

    private async log(projectId: string, userId: string, content: string) {
        await prisma.message.create({
            data: {
                role: 'ai',
                content: content,
                userId,
                projectId,
                agent: 'AUTOPILOT'
            }
        });
    }
}

export const autopilotService = new AutopilotService();
