#!/usr/bin/env node
/**
 * Capture rendered gallery screenshots for GATE-TASK-FAMILY-1.
 *
 * The gallery pages are review-only proof surfaces. This script serves the
 * platform repo locally, opens the proof pages in headless Edge/Chrome, and
 * refreshes the static screenshot evidence used by the human-review packet.
 * It does not mutate lesson output or product routes.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review';
const gateDir = path.join(platformRoot, 'reports', 'review-gates', gateId);
const screenshotDir = path.join(gateDir, 'screenshots');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const CASES = [
  {
    id: 'desktop-overview',
    page: 'gate-rendered-family-gallery.html',
    file: 'gate-task-family1-desktop-overview.png',
    width: 1280,
    height: 900,
  },
  {
    id: 'construction-overview',
    page: 'gate-rendered-construction-gallery.html',
    file: 'gate-task-family1-construction-overview.png',
    width: 1280,
    height: 900,
  },
  {
    id: 'construction-detail',
    page: 'gate-rendered-construction-detail-gallery.html',
    file: 'gate-task-family1-construction-detail.png',
    width: 1280,
    height: 900,
  },
  {
    id: 'mobile-narrow',
    page: 'gate-rendered-mobile-gallery.html',
    file: 'gate-task-family1-mobile-narrow.png',
    width: 390,
    height: 900,
  },
  {
    id: 'mobile-controls',
    page: 'gate-rendered-mobile-controls-gallery.html',
    file: 'gate-task-family1-mobile-controls.png',
    width: 480,
    height: 920,
  },
  {
    id: 'dark-mode',
    page: 'gate-rendered-dark-gallery.html',
    file: 'gate-task-family1-dark-mode.png',
    width: 1280,
    height: 900,
  },
  {
    id: 'feedback-states',
    page: 'gate-rendered-feedback-gallery.html',
    file: 'gate-task-family1-feedback-states.png',
    width: 1280,
    height: 900,
  },
  {
    id: 'feedback-detail',
    page: 'gate-rendered-feedback-detail-gallery.html',
    file: 'gate-task-family1-feedback-detail.png',
    width: 1280,
    height: 900,
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

function startStaticServer(root, port) {
  const resolvedRoot = path.resolve(root);
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const decoded = decodeURIComponent(url.pathname);
    const filePath = path.resolve(resolvedRoot, decoded === '/' ? 'index.html' : decoded.slice(1));
    if (!filePath.startsWith(resolvedRoot)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    fs.readFile(filePath, (error, buffer) => {
      if (error) {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': contentType(filePath) });
      res.end(buffer);
    });
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`GET ${url} returned ${res.statusCode}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      })
      .on('error', reject);
  });
}

async function waitForVersion(port) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      return await getJson(`http://127.0.0.1:${port}/json/version`);
    } catch (_error) {
      await sleep(150);
    }
  }
  throw new Error('Timed out waiting for Chromium DevTools endpoint');
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
        else resolve(message.result || {});
      }
    };
  }

  send(method, params = {}, sessionId = undefined) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 15000);
    });
  }
}

async function openCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  return new CdpClient(ws);
}

function caseUrl(serverPort, item) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(path.join('reports', 'review-gates', gateId, item.page).replace(/\\/g, '/'));
}

async function navigate(cdp, sessionId, serverPort, item) {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: item.width,
      height: item.height,
      deviceScaleFactor: 1,
      mobile: item.width < 520,
    },
    sessionId
  );
  await cdp.send('Page.navigate', { url: caseUrl(serverPort, item) }, sessionId);
  await sleep(900);
}

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => JSON.stringify({
        title: document.title,
        cards: document.querySelectorAll('.family-card').length,
        taskCards: document.querySelectorAll('.ts-task').length,
        text: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 1200),
        hasOldPriceLeak: /oude prijs|nieuwe prijs|prijslabel|hoeveelheidlabel|Lees de prijstabel|Prijs keer afzet|Opbrengst min kosten/.test(document.body.innerText),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }))()`,
      returnByValue: true,
    },
    sessionId
  );
  return JSON.parse(result.result.value);
}

async function screenshot(cdp, sessionId, fileName) {
  const metrics = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
  const content = metrics.contentSize || { width: 1280, height: 900 };
  const shot = await cdp.send(
    'Page.captureScreenshot',
    {
      format: 'png',
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: Math.ceil(content.width),
        height: Math.ceil(content.height),
        scale: 1,
      },
    },
    sessionId
  );
  const outPath = path.join(screenshotDir, fileName);
  await fsp.writeFile(outPath, Buffer.from(shot.data, 'base64'));
  return path.relative(platformRoot, outPath).replace(/\\/g, '/');
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `gate-task-family1-gallery-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(
    chromeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  try {
    const version = await waitForVersion(cdpPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    for (const item of CASES) {
      await navigate(cdp, sessionId, serverPort, item);
      const pageInspection = await inspect(cdp, sessionId);
      if (pageInspection.hasOldPriceLeak) {
        throw new Error(`${item.page} still contains stale answer-giving or invalid-distractor text`);
      }
      if (pageInspection.taskCards < 1) {
        throw new Error(`${item.page} did not render task cards`);
      }
      const out = await screenshot(cdp, sessionId, item.file);
      console.log(`Captured ${item.id}: ${out}`);
    }
  } finally {
    server.close();
    chrome.kill();
    await fsp.rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
