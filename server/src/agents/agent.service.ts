import { aiService } from '../services/ai.service';
import { fsService } from '../services/fs.service';
import { AGENT_PROMPTS } from './prompts';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

type AgentType = 'ROOT' | 'ARCHITECT' | 'DEVELOPER' | 'DEBUGGER' | 'GIT_SPECIALIST';

export class AgentService {
    async process(userPrompt: string, projectPath: string = ""): Promise<{ response: string, agent: AgentType }> {
        // 1. Intent Classification
        let agent: AgentType = 'ROOT';
        const lower = userPrompt.toLowerCase();

        if (lower.includes('design') || lower.includes('architecture') || lower.includes('plan')) {
            agent = 'ARCHITECT';
        } else if (lower.includes('write') || lower.includes('code') || lower.includes('create') || lower.includes('function') || lower.includes('component')) {
            agent = 'DEVELOPER';
        } else if (lower.includes('fix') || lower.includes('error') || lower.includes('debug') || lower.includes('fail')) {
            agent = 'DEBUGGER';
        } else if (lower.includes('git') || lower.includes('repo') || lower.includes('commit') || lower.includes('push')) {
            agent = 'GIT_SPECIALIST';
        }

        console.log(`[AgentService] Routing to: ${agent}`);

        // 2. Load Prompts Dynamically
        let systemPrompt = "";
        try {
            const brainPath = path.join(__dirname, '../../brain/agents.json');
            const data = await fsService.readFile(brainPath); // Use fsService or raw fs
            const agents = JSON.parse(data);
            systemPrompt = agents[agent]?.systemPrompt || AGENT_PROMPTS.ROOT; // Fallback
        } catch (e) {
            console.error("Failed to load dynamic agents, using fallback.");
            systemPrompt = AGENT_PROMPTS[agent] || AGENT_PROMPTS.ROOT;
        }

        // 3. AI Generation
        let response = await aiService.generate(userPrompt, systemPrompt);

        // 4. Tool Execution (File Writing)
        if (agent === 'DEVELOPER' && response.includes('>>> START_FILE:')) {
            response = await this.handleFileOperations(response, projectPath);
        }

        // 5. Command Execution (Git)
        if (agent === 'GIT_SPECIALIST' && response.includes('>>> EXEC_CMD:')) {
            response = await this.handleCommandOperations(response);
        }

        return { response, agent };
    }

    private async handleFileOperations(response: string, projectPath: string): Promise<string> {
        const fileRegex = />>> START_FILE: (.*?)\n([\s\S]*?)>>> END_FILE/g;
        let match;
        let finalResponse = response;

        while ((match = fileRegex.exec(response)) !== null) {
            const [fullMatch, filePath, content] = match;
            const cleanPath = filePath.trim();
            const cleanContent = content.trim();

            // Resolve Path with Project Context
            // If projectPath is "projects/my_app", and cleanPath is "src/App.tsx",
            // The full relative path to root should be "projects/my_app/src/App.tsx"
            // fsService uses relative paths from root.
            const targetPath = projectPath ? path.join(projectPath, cleanPath) : cleanPath;

            console.log(`[AgentService] Writing file: ${targetPath}`);

            try {
                // Ensure directory exists (fsService needs to handle this, or we rely on it throwing if not)
                // For simplicity, we assume fsService.writeFile handles it or we catch error
                await fsService.writeFile(cleanPath, cleanContent);

                finalResponse = finalResponse.replace(fullMatch, `\n✅ **SUCCESS**: File created at \`${cleanPath}\`\n\`\`\`\n${cleanContent.substring(0, 100)}...\n\`\`\``);
            } catch (error: any) {
                console.error(`[AgentService] Write Failed: ${error.message}`);
                finalResponse = finalResponse.replace(fullMatch, `\n❌ **ERROR**: Failed to write file \`${cleanPath}\`. Reason: ${error.message}`);
            }
        }
        return finalResponse;
    }

    private async handleCommandOperations(response: string): Promise<string> {
        const cmdRegex = />>> EXEC_CMD: (.*?)(?:\n|$)/g;
        let match;
        let finalResponse = response;

        while ((match = cmdRegex.exec(response)) !== null) {
            const [fullMatch, command] = match;
            const cleanCommand = command.trim();

            console.log(`[AgentService] Executing: ${cleanCommand}`);

            try {
                // Security Check: Only allow git commands for now to prevent dangerous ops
                if (!cleanCommand.startsWith('git ')) {
                    throw new Error("Security Restriction: Only 'git' commands are allowed in this version.");
                }

                // Execute
                const { stdout, stderr } = await execAsync(cleanCommand, { cwd: process.cwd() }); // Run in root

                let output = stdout || stderr;
                finalResponse = finalResponse.replace(fullMatch, `\n💻 **Executed**: \`${cleanCommand}\`\n\`\`\`\n${output ? output.substring(0, 200) : 'Done (No Output)'}\n\`\`\``);

            } catch (error: any) {
                console.error(`[AgentService] Command Failed: ${error.message}`);
                finalResponse = finalResponse.replace(fullMatch, `\n❌ **Command Error**: \`${cleanCommand}\`\n> ${error.message}`);
            }
        }
        return finalResponse;
    }
}

export const agentService = new AgentService();
