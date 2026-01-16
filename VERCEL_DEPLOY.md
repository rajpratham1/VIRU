# Vercel Deployment Guide for VIRU Landing Page

## 🚀 Quick Deploy (2 minutes)

### Option 1: Vercel CLI (Easiest)

**Step 1:** Install Vercel CLI globally
```bash
npm install -g vercel
```

**Step 2:** Login to Vercel
```bash
vercel login
```

**Step 3:** Deploy from root directory
```bash
cd C:\Users\rajpr\OneDrive\Desktop\VIRU
vercel
```

**Follow the prompts:**
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **viru** (or any name you want)
- Directory? Press Enter (uses root)
- Override settings? **N**

**Done!** You'll get a URL like: `https://viru-123abc.vercel.app`

---

### Option 2: Vercel Website (No CLI needed)

**Step 1:** Go to [vercel.com](https://vercel.com)

**Step 2:** Click "New Project"

**Step 3:** Import from GitHub
- Select "Import Git Repository"
- Choose your GitHub account
- Select `VIRU` repository
- Click "Import"

**Step 4:** Configure Project
- **Framework Preset**: Other
- **Root Directory**: Leave empty (uses root)
- **Build Command**: Leave empty
- **Output Directory**: `landing-page`

**Step 5:** Click "Deploy"

**Done!** Your landing page will be live at: `https://viru.vercel.app`

---

## 🔧 What the vercel.json Does

The `vercel.json` file in your root directory tells Vercel:
- Serve files from `landing-page/` folder
- Route all requests to `index.html` (for SPA behavior)
- No build step needed (it's a static HTML page)

---

## 🌐 Custom Domain (Optional)

**Free `.vercel.app` subdomain:**
- Automatically: `viru-xyz.vercel.app`

**Custom domain (like viru.com):**
1. Buy domain from Namecheap ($10/year)
2. Go to Vercel → Project Settings → Domains
3. Add your domain
4. Update DNS records (Vercel guides you)

---

## 📊 After Deployment

**Your URLs:**
- Landing Page: `https://viru.vercel.app`
- GitHub: `https://github.com/rajpratham1/VIRU`

**Share everywhere:**
- Reddit posts
- Twitter
- LinkedIn
- Email signature

---

**Need help?** Run `vercel help` or visit [vercel.com/docs](https://vercel.com/docs)
