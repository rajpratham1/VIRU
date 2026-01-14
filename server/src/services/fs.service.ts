import { promises as fs } from 'fs';
import path from 'path';
import { CONFIG } from '../config';

export class FileSystemService {
    private isSafePath(targetPath: string): boolean {
        // Simple safety check preventing .. escape
        const relative = path.relative(process.cwd(), targetPath);
        return !relative.startsWith('..') && !path.isAbsolute(relative);
    }

    async listFiles(dir: string) {
        // if (!this.isSafePath(dir)) throw new Error("Access Denied: Path Traversal Detected");
        // Allowing absolute paths for now for usability in this specific context, 
        // but normally we would restrict to a project root.

        const entries = await fs.readdir(dir, { withFileTypes: true });
        return entries.map(e => ({
            name: e.name,
            type: e.isDirectory() ? 'directory' : 'file',
            path: path.join(dir, e.name)
        }));
    }

    async readFile(filePath: string) {
        // if (!this.isSafePath(filePath)) throw new Error("Access Denied");
        return await fs.readFile(filePath, 'utf-8');
    }

    async writeFile(filePath: string, content: string) {
        // if (!this.isSafePath(filePath)) throw new Error("Access Denied");
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        return await fs.writeFile(filePath, content);
    }

    async ensureDir(dirPath: string) {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

export const fsService = new FileSystemService();
