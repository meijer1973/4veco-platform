#!/usr/bin/env node
/**
 * Capture CHECKSURFACE-113-EXEMPLAR-REVIEW-1 screenshot evidence.
 *
 * Serves generated Book 1 output locally and captures the 1.1.3 exit-ticket
 * first viewport in desktop light mode and mobile dark mode. This writes
 * review evidence only; it does not mutate lesson output.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'CHECKSURFACE-113-EXEMPLAR-REVIEW-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.CHECKSURFACE_113_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(screenshotDir, 'manifest.json');
const pagePath =
  '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 exit-ticket.html';

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

const cases = [
  {
    name: 'desktop-light-initial',
    theme: 'light',
    size: { width: 1280, height: 760 },
    mobile: false,
  },
  {
    name: 'mobile-dark-initial',
    theme: 'dark',
    size: { width: 390, height: 844 },
    mobile: true,
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
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
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
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
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

function pageUrl(serverPort) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(pagePath);
}

function parseRuntimeJson(result) {
  const value = result && result.result && result.result.value;
  if (typeof value !== 'string') {
    throw new Error(`Unexpected Runtime.evaluate result: ${JSON.stringify(result)}`);
  }
  return JSON.parse(value);
}

async function evaluateJson(cdp, sessionId, expression) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => JSON.stringify(${expression}))()`,
      returnByValue: true,
    },
    sessionId
  );
  return parseRuntimeJson(result);
}

async function main() {
  if (!chromeExe) {
    throw new Error(`Chromium executable not found. Tried: ${chromeCandidates.join(', ')}`);
  }

  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `checksurface-113-review-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });

  const chrome = spawn(
    chromeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${devtoolsPort}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  try {
    const version = await waitForVersion(devtoolsPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const manifest = [];
    for (const item of cases) {
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        {
          width: item.size.width,
          height: item.size.height,
          deviceScaleFactor: 1,
          mobile: item.mobile,
        },
        sessionId
      );
      await cdp.send('Page.navigate', { url: pageUrl(serverPort) }, sessionId);
      await sleep(1200);
      await cdp.send(
        'Runtime.evaluate',
        {
          expression: `(() => {
            localStorage.setItem('quizMode', ${JSON.stringify(item.theme)});
            document.documentElement.setAttribute('data-theme', ${JSON.stringify(item.theme)});
            const toggle = document.getElementById('theme-toggle');
            if (toggle) toggle.textContent = ${JSON.stringify(item.theme === 'dark' ? 'Lichte modus' : 'Donkere modus')};
          })()`,
        },
        sessionId
      );
      await sleep(300);

      const proof = await evaluateJson(
        cdp,
        sessionId,
        `(() => {
          const taskFamilies = Array.from(document.querySelectorAll('[data-task-family], .ts-task'))
            .map((node) => node.getAttribute('data-task-family'))
            .filter(Boolean);
          const placeholders = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder]'))
            .map((node) => node.getAttribute('placeholder'));
          const graph = document.querySelector('[data-point-snap-mode], .ts-graph-canvas, .ts-graph-workspace');
          return {
            title: document.title,
            url: location.href,
            theme: document.documentElement.getAttribute('data-theme') || 'light',
            toggleText: document.getElementById('theme-toggle') ? document.getElementById('theme-toggle').textContent.trim() : null,
            taskFamilies,
            taskFamilyCount: taskFamilies.length,
            graphWorkspace: !!graph,
            snapMode: document.querySelector('[data-point-snap-mode]') ? document.querySelector('[data-point-snap-mode]').getAttribute('data-point-snap-mode') : null,
            intervalOptionCount: document.querySelectorAll('[data-interval-option], .ts-graph-reading-option').length,
            formulaContextPresent: /formulecontext|formule context|gegeven formule/i.test(document.body.textContent || ''),
            completionDiagnosticTextPresent: /voltooid|diagnos|mastery|beheers/i.test(document.body.textContent || ''),
            placeholders,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
            firstViewportText: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 500)
          };
        })()`
      );

      if (!proof.title || !proof.taskFamilies.includes('graph_construction_substitute')) {
        throw new Error(`${item.name}: generated exit-ticket task families were not detected`);
      }
      if (proof.formulaContextPresent || proof.completionDiagnosticTextPresent) {
        throw new Error(`${item.name}: forbidden formula/completion diagnostic text detected`);
      }

      const screenshot = await cdp.send(
        'Page.captureScreenshot',
        {
          format: 'png',
          captureBeyondViewport: false,
        },
        sessionId
      );
      const outPath = path.join(screenshotDir, `${item.name}.png`);
      await fsp.writeFile(outPath, Buffer.from(screenshot.data, 'base64'));
      manifest.push({
        name: item.name,
        theme: item.theme,
        viewport: item.size,
        url: proof.url,
        screenshot: path.relative(platformRoot, outPath).replace(/\\/g, '/'),
        proof,
      });
    }

    await fsp.writeFile(
      manifestPath,
      JSON.stringify(
        {
          captured_on: '2026-06-07',
          sprint_id: sprintId,
          book_root: bookRoot,
          page_path: pagePath,
          capture_surface: 'headless Chromium CDP screenshot fallback after in-app browser screenshot capture timed out',
          cases: manifest,
        },
        null,
        2
      ) + '\n',
      'utf8'
    );
    console.log(`Captured ${manifest.length} CHECKSURFACE-113 review screenshots in ${screenshotDir}`);
  } finally {
    chrome.kill();
    server.close();
    await sleep(500);
    try {
      await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (_error) {
      // Best-effort cleanup.
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
