# 🚀 Render Deployment Guide — CN Project (Single Link)

## Pre-Requisites Checklist

- [x] `server.js` uses Express and serves static files
- [x] `app.js` uses `fetch('/scan')` (relative URL — no hardcoded domain)
- [x] `package.json` has `"start": "node server.js"` and `express` in dependencies
- [x] `.gitignore` contains `node_modules/`
- [x] All changes pushed to `https://github.com/Krrish1506/CN`

---

## ~~Step 1 — Create a Render Account~~ ✅ DONE

~~Go to https://render.com → Sign up using GitHub account~~

---

## ~~Step 2 — Create a New Web Service~~ ✅ DONE

~~Click "New +" → Select "Web Service"~~

---

## ~~Step 3 — Connect GitHub Repository~~ ✅ DONE

~~Connected: `Krrish1506 / CN` (visible in screenshot — "6m ago")~~

---

## ~~Step 4 — Fill the Web Service Form~~ ✅ DONE

All fields confirmed from screenshots:

---

### ~~SECTION: Basic Info~~ ✅ DONE

| Field | Entered Value | Status |
|-------|--------------|--------|
| **Name** | `LAN_Breach_detection_system` | ✅ Filled |
| **Region** | `Singapore (Southeast Asia)` | ✅ Selected (purple highlight) |
| **Branch** | `main` | ✅ Selected |
| **Root Directory** | *(blank)* | ✅ Correct — left empty |

---

### ~~SECTION: Build & Deploy~~ ✅ DONE

| Field | Entered Value | Status |
|-------|--------------|--------|
| **Language** | `Node` | ✅ Auto-detected |
| **Build Command** | `npm install` | ✅ Correct |
| **Start Command** | `node server.js` | ✅ Correct |

---

### ~~SECTION: Instance Type~~ ✅ DONE

| Option | Selected | Status |
|--------|----------|--------|
| **Free** — $0/month, 512 MB RAM, 0.1 CPU | ✅ Selected (purple) | ✅ Correct |

> ℹ️ Free tier spins down after inactivity. First request after sleep takes ~30 seconds. Normal behaviour.

---

## ➡️ Step 5 — DEPLOY NOW (NEXT ACTION)

> **You are here. This is the only remaining step.**

1. Scroll all the way to the **bottom** of the Render page
2. Click the **"Create Web Service"** button (purple button at the bottom)
3. You will be taken to the build logs screen
4. Wait for the logs to show:

```
==> Build successful
==> Starting service with 'node server.js'
[+] LAN Security Breach Analyzer — ready on port 10000
```

Build takes approximately **60–90 seconds**.

---

## Step 6 — Get Your Public URL

After the build succeeds:

- Your live URL appears at the **top-left** of the Render service dashboard
- Format: `https://lan-breach-detection-system-xxxx.onrender.com`
- **Open that URL in your browser** — the full UI should load instantly

---

## Step 7 — Test Everything

| Test | Expected Result |
|------|----------------|
| Open `https://lan-breach-detection-system-xxxx.onrender.com/` | LAN Security Breach Analyzer UI loads ✅ |
| Enter `192.168.1.1` → click "Execute Scan" | Spinner → results table appears ✅ |
| Open `/style.css` in browser | CSS file loads (200 OK) ✅ |
| Open `/app.js` in browser | JS file loads (200 OK) ✅ |

---

## Single Link Architecture — How It Works

```
User opens https://lan-breach-detection-system.onrender.com/
        │
        ▼
  Express Server (server.js)
        │
        ├── GET /          → serves index.html  (UI loads)
        ├── GET /style.css → serves style.css
        ├── GET /app.js    → serves app.js
        │
        └── POST /scan     → runs port scanner → returns JSON
```

**One URL. One server. Frontend + Backend on the same domain.**
No CORS issues. No separate links. No environment switching.

---

## Auto-Deploy (After First Deploy)

Every future `git push` will trigger an automatic re-deploy on Render:

```bash
git add .
git commit -m "your message"
git push origin main
# Render detects the push and re-deploys in ~60 seconds automatically
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails: `Cannot find module 'express'` | Check `package.json` has `express` in dependencies |
| App crashes on start | Confirm Start Command is `node server.js` |
| UI loads but scan gives error | Open browser DevTools Console — check for JS errors |
| 404 on `/` | Ensure `express.static(__dirname)` is in `server.js` |
| Slow first load (~30s) | Normal — free tier sleeps after inactivity |
