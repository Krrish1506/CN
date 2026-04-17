# 🚀 Render Deployment Guide — CN Project (Single Link)

## Pre-Requisites Checklist

Before opening Render, confirm these are done:

- [x] `server.js` uses Express and serves static files
- [x] `app.js` uses `fetch('/scan')` (relative URL — no hardcoded domain)
- [x] `package.json` has `"start": "node server.js"` and `express` in dependencies
- [x] `.gitignore` contains `node_modules/`
- [x] All changes pushed to `https://github.com/Krrish1506/CN`

---

## Step 1 — Create a Render Account

1. Go to → **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up using your **GitHub account** (click "Continue with GitHub")
4. Authorize Render to access your GitHub repositories

---

## Step 2 — Create a New Web Service

1. After logging in, click the **"New +"** button (top-right of dashboard)
2. From the dropdown, select → **"Web Service"**

---

## Step 3 — Connect Your GitHub Repository

1. You will see **"Connect a repository"**
2. Click **"Connect account"** under GitHub (if first time)
3. A GitHub permissions popup will appear:
   - Select **"Only select repositories"**
   - Choose **`Krrish1506/CN`** from the list
   - Click **"Install & Authorize"**
4. Back on Render, your repo `Krrish1506/CN` will appear
5. Click the **"Connect"** button next to it

---

## Step 4 — Fill the Web Service Form

This is the most important step. Fill every field exactly as shown below:

---

### SECTION: Basic Info

| Field | What to enter |
|-------|--------------|
| **Name** | `cn` *(or any name — this becomes part of your URL)* |
| **Region** | `Singapore (Southeast Asia)` *(closest for India)* |
| **Branch** | `main` |
| **Root Directory** | *(leave completely blank)* |

---

### SECTION: Build & Deploy

| Field | What to enter |
|-------|--------------|
| **Runtime** | `Node` ← **select this from the dropdown** |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

> ⚠️ Do NOT enter `npm start` — use `node server.js` directly so Render uses exactly your file.

---

### SECTION: Instance Type

| Option | What to select |
|--------|---------------|
| **Instance Type** | `Free` ← select the Free tier |

> ℹ️ Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up. This is normal.

---

### SECTION: Environment Variables

> You do NOT need any environment variables for this project.
> `PORT` is automatically set by Render — your `server.js` already reads `process.env.PORT`.

Leave this section empty.

---

### SECTION: Advanced (optional, can skip)

Leave all advanced settings at their defaults.

---

## Step 5 — Deploy

1. Click the **"Create Web Service"** button at the bottom
2. Render will start the build process automatically
3. You will see live build logs — wait for:

```
==> Build successful
==> Starting service with 'node server.js'
[+] LAN Security Breach Analyzer — ready on port 10000
```

Build takes approximately **60–90 seconds**.

---

## Step 6 — Get Your Public URL

After deployment succeeds:

- Your URL appears at the **top of the Render dashboard** for that service
- Format: `https://cn-xxxx.onrender.com` *(xxxx = random string Render assigns)*
- Example: `https://cn-yu1y.onrender.com`

---

## Step 7 — Test Everything

Open your URL in the browser and verify:

| Test | Expected Result |
|------|----------------|
| Open `https://cn-xxxx.onrender.com/` | LAN Security Breach Analyzer UI loads |
| Enter `192.168.1.1` and click Execute Scan | Spinner shows → results table appears |
| Open `/style.css` in browser | CSS file loads (200 OK) |
| Open `/app.js` in browser | JS file loads (200 OK) |

---

## Single Link Architecture — How It Works

```
User opens https://cn-xxxx.onrender.com/
        │
        ▼
  Express Server (server.js)
        │
        ├── GET /          → serves index.html  (UI)
        ├── GET /style.css → serves style.css
        ├── GET /app.js    → serves app.js
        │
        └── POST /scan     → runs port scanner → returns JSON
```

**One URL. One server. Frontend + Backend on the same domain.**  
No CORS issues. No separate links. No environment switching.

---

## Auto-Deploy (Bonus)

Render auto-deploys on every `git push` to `main`.

So your workflow going forward is simply:

```bash
# make changes to any file
git add .
git commit -m "your message"
git push origin main
# Render auto-detects and re-deploys in ~60 seconds
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails with `Cannot find module 'express'` | Check `package.json` has `"express"` in dependencies |
| App crashes on start | Check Start Command is `node server.js` (not `npm start`) |
| UI loads but scan gives error | Check browser console — likely a JS error in `app.js` |
| 404 on `/` | Make sure `express.static(__dirname)` is in `server.js` |
| Slow first load | Normal — free tier sleeps. Wait 30s and retry |
