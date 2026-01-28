import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { CONFIG } from '../config';

interface Deployment {
    projectId: string;
    port: number;
    process: ChildProcess;
    status: 'running' | 'stopped' | 'error';
    url: string;
}

export class DeploymentService {
    private deployments: Map<string, Deployment> = new Map();
    private basePort = 3000;

    async deployProject(projectId: string, projectPath: string): Promise<Deployment> {
        // Check if already running
        if (this.deployments.has(projectId)) {
            return this.deployments.get(projectId)!;
        }

        // Find available port (naive implementation)
        let port = this.basePort + this.deployments.size + 1;

        // Construct full path
        // Assuming projectPath is relative "projects/my_app"
        const fullPath = path.join(CONFIG.WORKSPACE_ROOT, projectPath);

        console.log(`[Deployment] Deploying ${projectId} at ${fullPath} on port ${port}`);

        // We will use 'serve' to serve the directory. 
        // Ideally we should run 'npm run build' first, but for now let's assume static or just serve.
        // If it's a vite app, 'npm run dev' might be better for dev mode, but 'deploy' implies prod.
        // Let's try to run 'npx serve' on the directory.
        // Security Note: This exposes the file system folder.

        const deployProcess = spawn('npx', ['serve', '-p', port.toString(), fullPath], {
            shell: true,
            windowsHide: true
        });

        const deployment: Deployment = {
            projectId,
            port,
            process: deployProcess,
            status: 'running',
            url: `http://localhost:${port}`
        };

        deployProcess.stdout?.on('data', (data) => console.log(`[Deploy ${projectId}]: ${data}`));
        deployProcess.stderr?.on('data', (data) => console.error(`[Deploy ${projectId} ERR]: ${data}`));

        deployProcess.on('close', (code) => {
            console.log(`[Deploy ${projectId}] exited with code ${code}`);
            this.deployments.get(projectId)!.status = 'stopped';
            this.deployments.delete(projectId);
        });

        this.deployments.set(projectId, deployment);
        return deployment;
    }

    async stopDeployment(projectId: string) {
        const deployment = this.deployments.get(projectId);
        if (deployment) {
            deployment.process.kill();
            this.deployments.delete(projectId);
            return true;
        }
        return false;
    }

    getDeployment(projectId: string) {
        return this.deployments.get(projectId);
    }
}

export const deploymentService = new DeploymentService();
