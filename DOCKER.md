# 🐳 VIRU Docker Distribution Guide

This guide explains how to distribute VIRU as a Docker application, making it super easy for anyone to install and run.

---

## 📦 For End Users: How to Install VIRU

### Prerequisites
1. **Install Docker Desktop** (One-time setup):
   - **Windows/Mac**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - **Linux**: Follow instructions at [docs.docker.com/engine/install](https://docs.docker.com/engine/install/)

2. **Install Ollama** (For local AI):
   - Download from [ollama.com](https://ollama.com)
   - Pull a model: `ollama pull mistral`

### Installation (2 Simple Steps)

```bash
# 1. Clone the repository
git clone https://github.com/rajpratham1/VIRU.git
cd VIRU

# 2. Start everything with Docker
docker-compose up -d
```

That's it! 🎉

### Access Points
- **Main Interface**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **API Server**: http://localhost:5000

### Stop VIRU
```bash
docker-compose down
```

---

## 🚀 For Developers: Publishing to Docker Hub

### Step 1: Create Docker Hub Account
1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up for free
3. Create a new repository named `viru` (make it public)

### Step 2: Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### Step 3: Build and Tag Images

```bash
# Build all images
docker-compose build

# Tag images for Docker Hub
docker tag viru-server:latest rajpratham1/viru-server:latest
docker tag viru-client:latest rajpratham1/viru-client:latest
docker tag viru-admin:latest rajpratham1/viru-admin:latest

# Optional: Tag with version numbers
docker tag viru-server:latest rajpratham1/viru-server:1.0.0
```

### Step 4: Push to Docker Hub

```bash
# Push all images
docker push rajpratham1/viru-server:latest
docker push rajpratham1/viru-client:latest
docker push rajpratham1/viru-admin:latest

# Push versioned tags
docker push rajpratham1/viru-server:1.0.0
```

### Step 5: Update docker-compose.yml for Public Use

Replace local builds with public images:

```yaml
version: '3.8'

services:
  server:
    image: rajpratham1/viru-server:latest
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - AI_MODEL_URL=http://host.docker.internal:11434
    volumes:
      - viru_data:/app/brain

  client:
    image: rajpratham1/viru-client:latest
    ports:
      - "5173:80"
    depends_on:
      - server

  admin:
    image: rajpratham1/viru-admin:latest
    ports:
      - "5174:80"
    depends_on:
      - server

volumes:
  viru_data:
```

Now users can just run `docker-compose up` without building anything!

---

## 🔧 Troubleshooting

### "Cannot connect to Ollama"
**Problem**: Docker containers can't reach Ollama on your host machine.

**Solution**: Use `host.docker.internal` instead of `localhost`:
```yaml
environment:
  - AI_MODEL_URL=http://host.docker.internal:11434
```

### "Database is locked"
**Problem**: Multiple containers trying to access SQLite.

**Solution**: Use Docker volumes for persistence:
```yaml
volumes:
  - viru_data:/app/brain
  - viru_db:/app/prisma
```

### "Port already in use"
**Problem**: Ports 5000, 5173, or 5174 are occupied.

**Solution**: Change the port mappings:
```yaml
ports:
  - "8080:5000"  # Access via localhost:8080
```

---

## 📊 Docker Hub Statistics

After publishing, track your image stats:
- **Pulls**: How many times your image was downloaded
- **Stars**: Community favorites
- **Size**: Keep images under 1GB for better download speed

---

## 🎓 Best Practices

1. **Multi-stage Builds**: Already implemented! Keeps images small.
2. **Version Tags**: Always tag with version numbers (`1.0.0`) + `latest`
3. **ENV Variables**: Use `.env` file for sensitive data (don't commit it!)
4. **Health Checks**: Add to docker-compose for auto-restart on failures
5. **Security Scans**: Docker Hub auto-scans for vulnerabilities

---

**Need Help?** Open an issue on GitHub or join our Discord community.
