# Build Stage
FROM node:18-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose Port
EXPOSE 5000

# Start Command - Use tsx to run TypeScript directly
CMD ["npx", "tsx", "src/index.ts"]
