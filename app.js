// ─── DOM references ───────────────────────────────────────────────────────────

const scanBtn               = document.getElementById('scanBtn');
const ipAddressInput        = document.getElementById('ipAddress');
const loader                = document.getElementById('loader');
const resultsSection        = document.getElementById('resultsSection');
const resultsTableBody      = document.querySelector('#resultsTable tbody');
const recommendationsSection = document.getElementById('recommendationsSection');
const recommendationsList   = document.getElementById('recommendationsList');

// ─── Scan trigger ─────────────────────────────────────────────────────────────

scanBtn.addEventListener('click', async () => {
    let ip = ipAddressInput.value.trim();

    if (!ip) {
        alert('Please enter a target IP address.');
        return;
    }

    // Basic IPv4 validation (localhost is also accepted)
    const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;
    if (!ipRegex.test(ip) && ip !== 'localhost' && ip !== '127.0.0.1') {
        alert('Invalid IPv4 address format.');
        return;
    }

    // Normalise localhost for net module on the backend
    if (ip === 'localhost') ip = '127.0.0.1';

    // Reset UI state
    resultsSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');
    resultsTableBody.innerHTML = '';
    recommendationsList.innerHTML = '';
    scanBtn.disabled = true;
    loader.classList.remove('hidden');

    try {
        // Relative URL — works on any domain (local dev or Render production)
        const response = await fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Server returned an error response.');
        }

        renderResults(data.results);
        renderRecommendations(data.results);
        resultsSection.classList.remove('hidden');

    } catch (err) {
        alert('Scan failed: ' + err.message);
    } finally {
        scanBtn.disabled = false;
        loader.classList.add('hidden');
    }
});

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderResults(results) {
    // Display ports sorted numerically
    const sorted = [...results].sort((a, b) => a.port - b.port);

    sorted.forEach((result) => {
        const row = document.createElement('tr');

        let riskClass;
        if (result.status === 'open') {
            if (result.risk === 'High')   riskClass = 'risk-high';
            else if (result.risk === 'Medium') riskClass = 'risk-medium';
            else                          riskClass = 'risk-low';
        } else {
            riskClass = 'risk-low';
            result.risk = 'None';
        }

        row.innerHTML = `
            <td>${result.port}</td>
            <td>${result.service}</td>
            <td class="status-${result.status}">${result.status.toUpperCase()}</td>
            <td class="${riskClass}">${result.risk.toUpperCase()}</td>
        `;
        resultsTableBody.appendChild(row);
    });
}

function renderRecommendations(results) {
    const openHighRisk = results.filter((r) => r.status === 'open' && r.risk === 'High');
    if (openHighRisk.length === 0) return;

    const advisories = {
        21:   'Port 21 (FTP) is exposed. FTP transmits data and credentials in plain text. Migrate to SFTP (port 22) or FTPS immediately.',
        23:   'Port 23 (Telnet) is exposed. Telnet passes all traffic in plain text. Replace it with SSH (port 22) for encrypted remote access.',
        445:  'Port 445 (SMB) is exposed — the WannaCry attack vector. Apply MS17-010 patch, disable SMBv1, and block this port at the firewall.',
        3389: 'Port 3389 (RDP) is exposed. Never expose RDP directly to the internet. Gate it behind a VPN and enforce Network Level Authentication (NLA).',
    };

    openHighRisk.forEach((result) => {
        if (advisories[result.port]) {
            const li = document.createElement('li');
            li.textContent = advisories[result.port];
            recommendationsList.appendChild(li);
        }
    });

    recommendationsSection.classList.remove('hidden');
}

// ─── Keyboard shortcut ────────────────────────────────────────────────────────

ipAddressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') scanBtn.click();
});
