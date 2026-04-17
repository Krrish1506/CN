const express = require('express');
const path    = require('path');
const net     = require('net');

// ─── Config ───────────────────────────────────────────────────────────────────

const PORTS_TO_SCAN = [21, 22, 23, 25, 80, 443, 445, 3306, 3389, 8080];

const PORT_INFO = {
    21:   { service: 'FTP',      risk: 'High'   },
    22:   { service: 'SSH',      risk: 'Medium' },
    23:   { service: 'Telnet',   risk: 'High'   },
    25:   { service: 'SMTP',     risk: 'Medium' },
    80:   { service: 'HTTP',     risk: 'Low'    },
    443:  { service: 'HTTPS',    risk: 'Low'    },
    445:  { service: 'SMB',      risk: 'High'   },
    3306: { service: 'MySQL',    risk: 'Medium' },
    3389: { service: 'RDP',      risk: 'High'   },
    8080: { service: 'HTTP-Alt', risk: 'Low'    },
};

// ─── Port scanner ─────────────────────────────────────────────────────────────

/**
 * Probe a single TCP port on the given host.
 * Resolves with { port, status, service, risk } — never rejects.
 */
function checkPort(port, host) {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        const done = (status) => {
            socket.destroy();
            resolve({ port, status, service: PORT_INFO[port].service, risk: PORT_INFO[port].risk });
        };

        socket.setTimeout(1500);
        socket.on('connect', () => done('open'));
        socket.on('timeout', () => done('closed'));
        socket.on('error',   () => done('closed'));

        socket.connect(port, host);
    });
}

// ─── Express app ──────────────────────────────────────────────────────────────

const app = express();

// Parse incoming JSON bodies
app.use(express.json());

// Serve all static frontend files from the project root
app.use(express.static(path.join(__dirname)));

// ─── API Routes ───────────────────────────────────────────────────────────────

/**
 * POST /scan
 * Body: { "ip": "192.168.1.1" }
 * Returns: { "results": [ { port, status, service, risk }, ... ] }
 */
app.post('/scan', async (req, res) => {
    const { ip } = req.body;

    if (!ip || typeof ip !== 'string' || ip.trim() === '') {
        return res.status(400).json({ error: 'A valid IP address is required.' });
    }

    const target = ip.trim();

    // Basic IPv4 / localhost guard
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;
    if (target !== 'localhost' && target !== '127.0.0.1' && !ipv4Regex.test(target)) {
        return res.status(400).json({ error: 'Invalid IPv4 address format.' });
    }

    try {
        // Scan all ports in parallel for maximum speed
        const results = await Promise.all(PORTS_TO_SCAN.map((p) => checkPort(p, target)));
        return res.json({ results });
    } catch (err) {
        console.error('[scan error]', err);
        return res.status(500).json({ error: 'Internal server error during port scan.' });
    }
});

// Catch-all: serve index.html for any unknown GET route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[+] LAN Security Breach Analyzer — ready on port ${PORT}`);
});
