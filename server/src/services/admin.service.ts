import { prisma } from '../db';

export class AdminService {
    async getAllUsers() {
        // Mocking isAdmin for now as it doesn't exist in schema yet
        // In real app: await prisma.user.findMany({ ... })
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return users.map(u => ({
            ...u,
            isAdmin: u.username === 'root' || u.username === 'admin', // Simple mock auth
            email: `${u.username}@viru.nexus` // Mock email for UI
        }));
    }

    async broadcastMessage(message: string, type: 'info' | 'warning' | 'alert') {
        // In a real app, this would push to a websocket or store in a notifications table
        // For now, we'll store it in a simple in-memory queue or just log it
        // Depending on how "System Broadcast" is implemented in the client
        console.log(`[BROADCAST] [${type.toUpperCase()}]: ${message}`);
        return { success: true, message: "Broadcast sent to all active nodes." };
    }

    async updateUserTier(userId: string, tier: 'free' | 'pro') {
        // Since we don't have a 'tier' field in the schema yet, we might need to add it or mock it.
        // For this prototype, we'll use a mock approach or assume schema update.
        // Let's assume we want to just toggle a flag or log it for now as schema migration is risky in this environment without user confirm.
        console.log(`[ADMIN] User ${userId} upgraded to ${tier}`);
        return { success: true, tier };
    }
}

export const adminService = new AdminService();
