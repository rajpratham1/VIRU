import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 5000,
    AI_MODEL_URL: process.env.AI_MODEL_URL || 'http://localhost:11434', // Default to Ollama
    DB_PATH: process.env.DATABASE_URL || 'file:./dev.db',
    WORKSPACE_ROOT: process.env.WORKSPACE_ROOT || '../', // Allow editing of the repo itself or neighbors
};
