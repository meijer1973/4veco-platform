#!/usr/bin/env node
/**
 * Capture GRAPH-UX-2 graph/task-shell screenshots through headless Chromium.
 *
 * HOW TO ADAPT:
 * - Keep captures tied to proof requirements in GRAPH-UX-2.
 * - Prefer small, named evidence cases over broad screenshots.
 * - This script serves the generated Book 1 root locally and does not mutate
 *   lesson output.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GRAPH_UX2_BOOK_ROOT || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const outputDir = path.resolve(platformRoot, 'reports', 'sprints', 'GRAPH-UX-2-screenshots');
const chromeExe = process.env.CHROME_EXE
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cases = [
  { name: 'desktop-light-113-graph-task-shell', theme: 'light', size: { width: 1280, height: 760 }, action: 'none' },
  { name: 'mobile-light-113-graph-route-first', theme: 'light', size: { width: 390, height: 844 }, action: 'none' },
  { name: 'desktop-dark-113-graph-task-shell', theme: 'dark', size: { width: 1280, height: 760 }, action: 'none' },
  { name: 'mobile-dark-113-graph-feedback', theme: 'dark', size: { width: 390, height: 844 }, action: 'answer-first' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  return 'application/octet-stream';
}

function startStaticServer(root, port) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const decoded = decodeURIComponent(url.pathname);
    const filePath = path.resolve(root, decoded === '/' ? 'index.html' : decoded.slice(1));
    if (!filePath.startsWith(root)) {
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
    http.get(url, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
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
    }).on('error', reject);
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
    ws.onmessage = event => {
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
  const file = '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 grafiekenspel.html';
  return `http://127.0.0.1:${serverPort}/` + encodeURI(file);
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `graph-ux2-chrome-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${devtoolsPort}`,
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

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
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: item.size.width,
        height: item.size.height,
        deviceScaleFactor: 1,
        mobile: item.size.width < 500
      }, sessionId);
      await cdp.send('Page.navigate', { url: pageUrl(serverPort) }, sessionId);
      await sleep(1200);
      await cdp.send('Runtime.evaluate', {
        expression: `try {
          localStorage.setItem('quizMode', '${item.theme}');
          document.documentElement.setAttribute('data-theme', '${item.theme}');
          const toggle = document.getElementById('theme-toggle');
          if (toggle) toggle.textContent = '${item.theme}' === 'dark' ? 'Lichte modus' : 'Donkere modus';
        } catch(e) {}`
      }, sessionId);
      if (item.action === 'answer-first') {
        await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const option = document.querySelector('.ts-choice[data-choice-id="b"]');
            if (option) option.click();
            const button = document.querySelector('#g-task-check-btn');
            if (button) button.click();
          })()`
        }, sessionId);
        await sleep(600);
      }
      const proof = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const route = document.querySelector('.skill-map-route');
          const shell = document.querySelector('[data-graph-task-shell="GRAPH-UX-2"]');
          const task = document.querySelector('.ts-task');
          const feedback = document.querySelector('.ts-feedback-card');
          const rect = shell ? shell.getBoundingClientRect() : null;
          return {
            title: document.title,
            routeText: route ? route.innerText.replace(/\\s+/g, ' ').trim() : '',
            shellText: shell ? shell.innerText.replace(/\\s+/g, ' ').trim() : '',
            taskFamily: task ? task.getAttribute('data-task-family') : null,
            feedbackState: feedback ? feedback.className : null,
            shellRect: rect ? { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) } : null,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) }
          };
        })()`,
        returnByValue: true
      }, sessionId);
      const value = proof.result && proof.result.value;
      if (!value || !value.routeText || !value.shellText || !value.taskFamily) {
        throw new Error(`${item.name}: missing route/task-shell proof`);
      }
      const metrics = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
      const content = metrics.contentSize || { width: item.size.width, height: item.size.height };
      const screenshot = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: {
          x: 0,
          y: 0,
          width: Math.ceil(content.width),
          height: Math.ceil(content.height),
          scale: 1
        }
      }, sessionId);
      const outPath = path.join(outputDir, `${item.name}.png`);
      await fsp.writeFile(outPath, Buffer.from(screenshot.data, 'base64'));
      manifest.push({
        name: item.name,
        theme: item.theme,
        action: item.action,
        url: pageUrl(serverPort),
        screenshot: outPath,
        route_text: value.routeText,
        shell_text: value.shellText,
        task_family: value.taskFamily,
        feedback_state: value.feedbackState,
        shell_rect: value.shellRect,
        viewport: value.viewport,
        page: value.page
      });
    }
    await fsp.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify({ captured_on: '2026-05-31', book_root: bookRoot, cases: manifest }, null, 2),
      'utf8'
    );
    console.log(`Captured ${manifest.length} GRAPH-UX-2 screenshots in ${outputDir}`);
  } finally {
    chrome.kill();
    server.close();
    await sleep(500);
    try {
      await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (_error) {
      // Temporary browser profile cleanup is best-effort.
    }
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
