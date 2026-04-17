# 🛡️ LAN Security Breach Analyzer

> **Scan any IP address and instantly find out which network doors are left wide open — before a hacker does.**

🌐 **Live Demo:** [https://lan-breach-detection-system.onrender.com](https://lan-breach-detection-system.onrender.com)

---

## 🤔 What Is This Project?

Imagine your computer or server is like a **building with 65,535 doors** (called **ports**).

- Some doors are meant to be open — like the main entrance (Port 80 for websites)
- Some doors should always stay locked — like the back door (Port 23, Telnet)
- If a wrong door is left open, **a hacker can walk right in**

This tool acts like a **security guard** that checks 10 of the most critical doors on any IP address you specify and tells you:

- ✅ Which doors are **open** or **closed**
- ⚠️ What **service** is running behind each door
- 🔴 How **risky** each open door is (High / Medium / Low)
- 💡 What you should **do about it** if a dangerous door is found open

---

## 🖥️ What Does It Look Like?

The interface is designed like a **hacker terminal** — dark background, green text, monospace font.

You type in an IP address, click **"Execute Scan"**, and within seconds you get a full table showing the status of all 10 scanned ports.

```
root@analyzer:~# target_ip   [192.168.1.1]   [EXECUTE SCAN]

PORT    SERVICE    STATUS    RISK LEVEL
─────────────────────────────────────────
21      FTP        CLOSED    NONE
22      SSH        OPEN      MEDIUM
23      Telnet     CLOSED    NONE
80      HTTP       OPEN      LOW
445     SMB        CLOSED    NONE
3389    RDP        OPEN      HIGH ← ⚠️ Danger!
...
```

---

## 📖 Real-World Context — The WannaCry 2017 Attack

This project was built with a **real cyberattack as its case study**.

### What happened?
In May 2017, a ransomware called **WannaCry** infected over **200,000 computers** across **150 countries** — including hospitals, banks, and government offices.

### How did it spread?
It exploited **Port 445 (SMB)** — a door that was left open on millions of Windows machines and was never patched.

### What's the lesson?
> Open ports = Open attack surfaces.
> If you don't know which ports are open on your network, you are flying blind.

This tool helps you **see exactly what's exposed** — just like a professional security scanner.

---

## 🔍 Which Ports Does It Scan?

| Port | Service | What It Does | Risk Level |
|------|---------|-------------|----------|
| **21** | FTP | File transfer — sends passwords in plain text | 🔴 High |
| **22** | SSH | Secure remote login | 🟡 Medium |
| **23** | Telnet | Old remote login — sends everything in plain text | 🔴 High |
| **25** | SMTP | Email sending | 🟡 Medium |
| **80** | HTTP | Regular websites | 🟢 Low |
| **443** | HTTPS | Secure websites | 🟢 Low |
| **445** | SMB | Windows file sharing (WannaCry's door) | 🔴 High |
| **3306** | MySQL | Database access | 🟡 Medium |
| **3389** | RDP | Remote Desktop (control another PC remotely) | 🔴 High |
| **8080** | HTTP-Alt | Alternate web server port | 🟢 Low |

---

## ⚙️ How Does It Work? (Simple Explanation)

```
You enter an IP address
         ↓
Your browser sends it to the server
         ↓
The server tries to "knock on" each of the 10 ports
(like trying 10 different doors of a building)
         ↓
If a door opens → Port is OPEN
If nothing responds → Port is CLOSED
         ↓
Results are sent back and displayed in a table
```

Behind the scenes, the server uses a **TCP socket connection** — the same method that real network security professionals use to probe for open services.

---

## 🧱 Project Architecture

This project uses a **Single Link Architecture** — meaning:

- **One URL** handles everything
- The **same server** that powers the scanner also delivers the website
- No separate frontend/backend links

```
https://lan-breach-detection-system.onrender.com
               │
               ▼
        Express.js Server
               │
       ┌───────┴────────┐
       ▼                ▼
  Serves Website    Runs Port Scanner
  (index.html,      (POST /scan API)
   style.css,
   app.js)
```

---

## 🗂️ File Structure

```
CN/
│
├── server.js        → The brain — Express server that:
│                        • Serves the website files
│                        • Handles the /scan API
│                        • Runs the actual port scanner
│
├── index.html       → The website structure (what you see)
│
├── style.css        → The terminal-style visual design
│
├── app.js           → Frontend logic:
│                        • Reads the IP you type
│                        • Sends it to the server
│                        • Displays scan results in the table
│
├── package.json     → Project settings and dependencies
│
├── .gitignore       → Tells Git to ignore node_modules/
│
└── tasks/
    ├── deployment.md  → Render deployment guide (completed)
    └── todo.md        → Project task list
```

---

## 🚀 Technology Used

| Technology | Role |
|-----------|------|
| **Node.js** | Runtime — runs JavaScript on the server |
| **Express.js** | Web framework — handles routes and static files |
| **net** (built-in) | TCP socket module — does the actual port scanning |
| **HTML / CSS / JS** | Frontend — the website interface |
| **Render** | Cloud hosting — makes the app publicly accessible |
| **GitHub** | Version control — stores and tracks all code changes |

---

## 💡 How to Use It

1. **Open the website:** [https://lan-breach-detection-system.onrender.com](https://lan-breach-detection-system.onrender.com)

2. **Enter an IP address** in the terminal-style input field
   - Example: `192.168.1.1` (your home router)
   - Example: `45.33.32.156` (a public test server — scanme.nmap.org)
   - Example: `127.0.0.1` (your own machine — localhost)

3. **Click "Execute Scan"** — the spinner will appear while scanning

4. **Read the results table:**
   - `OPEN` in white = the port is actively responding
   - `CLOSED` in grey = the port is not accessible
   - 🔴 `HIGH` risk = immediate concern if the port is open
   - 🟡 `MEDIUM` risk = review and monitor
   - 🟢 `LOW` risk = generally safe

5. **Read the recommendations** (if any HIGH risk ports are open) — they appear below the table with specific advice

---

## ⚠️ Important: Ethical & Legal Notice

> **Only scan IP addresses that you own or have explicit permission to scan.**

Scanning someone else's server or network without permission is:
- Illegal in most countries
- A violation of computer misuse laws (like the Computer Fraud and Abuse Act)

This tool is built for **educational purposes** and **testing your own systems only**.

---

## 🏗️ Run It Locally (On Your Own Computer)

If you want to run this project on your own machine for development:

### Prerequisites
- [Node.js](https://nodejs.org/) installed (version 18 or above)
- [Git](https://git-scm.com/) installed

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Krrish1506/CN.git

# 2. Go into the project folder
cd CN

# 3. Install dependencies
npm install

# 4. Start the server
node server.js

# 5. Open your browser and go to:
# http://localhost:3000
```

---

## ☁️ Deployment

This project is deployed on **Render** (a free cloud platform).

| Detail | Value |
|--------|-------|
| **Platform** | Render (Free Tier) |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Live URL** | https://lan-breach-detection-system.onrender.com |
| **Auto-Deploy** | Yes — every `git push` to `main` triggers a re-deploy |

> ℹ️ **Note about Free Tier:** The free instance "sleeps" after 15 minutes of no traffic. The first visit after a sleep period may take 20–30 seconds to wake up. This is completely normal.

---

## 🧪 Verified Scan Results

Tested against `45.33.32.156` (scanme.nmap.org — a public target for testing):

| Port | Service | Result |
|------|---------|--------|
| 22 | SSH | ✅ OPEN (expected — it's a test server) |
| 80 | HTTP | ✅ OPEN (expected — it hosts a webpage) |
| All others | Various | ✅ CLOSED (correct) |

---

## 👨‍💻 Author

**Krrish** — Computer Networks Assignment Project

- GitHub: [@Krrish1506](https://github.com/Krrish1506)
- Repository: [github.com/Krrish1506/CN](https://github.com/Krrish1506/CN)

---

## 📚 What I Learned Building This

- How **TCP ports** work and why they are critical to network security
- How real port scanners like **Nmap** probe open connections
- How the **WannaCry attack** exploited an open SMB port (CVE MS17-010)
- How to build a **full-stack Node.js app** with Express
- How to deploy a project to production using **Render**
- How **single-domain architecture** eliminates CORS problems entirely

---

*Built as part of a Computer Networks course assignment.*
