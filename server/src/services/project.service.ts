import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { CONFIG } from '../config';

const prisma = new PrismaClient();

export class ProjectService {
    async createProject(userId: string, name: string) {
        // Sanitize name for folder creation
        const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const projectPath = path.join(CONFIG.WORKSPACE_ROOT, '..', safeName); // Create sibling to default workspace for now? Or subfolder?
        // Let's make it subfolders of a "projects" dir if possible, or just siblings.
        // For safety, let's keep them inside the current root for now, or use a master PROJECTS_ROOT.
        // Assuming WORKSPACE_ROOT is like C:\Users\rajpr\OneDrive\Desktop\VIRU\workspace

        // Actually, let's just create a folder
        try {
            await fs.mkdir(projectPath, { recursive: true });
        } catch (e) {
            console.log("Folder might exist, proceeding...");
        }

        const project = await prisma.project.create({
            data: {
                name,
                path: projectPath,
                userId
            }
        });
        return project;
    }

    async getUserProjects(userId: string) {
        return await prisma.project.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async getProject(id: string) {
        return await prisma.project.findUnique({ where: { id } });
    }
}

export const projectService = new ProjectService();
