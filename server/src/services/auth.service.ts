import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { CONFIG } from '../config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'viru-secret-key-change-me';

export class AuthService {

    async register(username: string, password: string) {
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) throw new Error('Username already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        // Generate Token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        return { user: { id: user.id, username: user.username }, token };
    }

    async login(username: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) throw new Error('Invalid credentials');

        // Check password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid credentials');

        // Generate Token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        return { user: { id: user.id, username: user.username }, token };
    }
}

export const authService = new AuthService();
