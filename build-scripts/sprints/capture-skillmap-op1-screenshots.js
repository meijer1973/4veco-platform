#!/usr/bin/env node
/**
 * Capture SKILLMAP-OP-1 rendered screenshots through headless Chromium CDP.
 *
 * HOW TO ADAPT:
 * - Keep cases aligned with check-skillmap-op1-route-output.js.
 * - Prefer adding targeted route screenshots over broad full-site captures.
 * - This script assumes a local static server is already serving the Book 1
 *   root. It does not mutate lesson output.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const outputDir = path.resolve(__dirname, '..', '..', 'reports', 'sprints', 'SKILLMAP-OP-1-screenshots');
const baseUrl = process.env.SKILLMAP_OP1_BASE_URL || 'http://localhost:8321/';
const chromeExe = process.env.CHROME_EXE
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  || path.join(process.env.USERPROFILE || '', '.cache', 'puppeteer', 'chrome', 'win64-146.0.7680.153', 'chrome-win64', 'chrome.exe');

const cases = [
  { name: 'desktop-111-reasoning', size: { width: 1280, height: 720 }, file: '1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – redeneer-spel.html' },
  { name: 'desktop-112-reasoning', size: { width: 1280, height: 720 }, file: '1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – redeneer-spel.html' },
  { name: 'desktop-112-math', size: { width: 1280, height: 720 }, file: '1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – wiskundevaardigheden.html' },
  { name: 'mobile-112-math', size: { width: 390, height: 844 }, file: '1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – wiskundevaardigheden.html' },
  { name: 'desktop-113-graph', size: { width: 1280, height: 720 }, file: '1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – grafiekenspel.html' },
  { name: 'mobile-113-graph', size: { width: 390, height: 844 }, file: '1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – grafiekenspel.html' }
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

function routeUrl(file) {
  return baseUrl + encodeURI(`1.1 Hoofdstuk Economisch denken en rekenen/${file}`);
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const port = await findFreePort();
  const profileDir = path.join('C:\\tmp\\Codex-work', `skillmap-op1-chrome-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  try {
    const version = await waitForVersion(port);
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
      const url = routeUrl(item.file);
      await cdp.send('Page.navigate', { url }, sessionId);
      await sleep(1600);
      const routeInfo = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const route = document.querySelector('.skill-map-route');
          const rect = route ? route.getBoundingClientRect() : null;
          const text = route ? route.innerText.replace(/\\s+/g, ' ').trim() : '';
          return {
            title: document.title,
            text,
            routeCount: document.querySelectorAll('.skill-map-route').length,
            rect: rect ? { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) } : null,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) }
          };
        })()`,
        returnByValue: true
      }, sessionId);
      const value = routeInfo.result && routeInfo.result.value;
      if (!value || value.routeCount !== 1) {
        throw new Error(`${item.name}: expected one route panel, got ${value && value.routeCount}`);
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
        url,
        screenshot: outPath,
        route_text: value.text,
        route_rect: value.rect,
        viewport: value.viewport,
        page: value.page
      });
    }
    await fsp.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify({ captured_on: '2026-05-31', cases: manifest }, null, 2),
      'utf8'
    );
    console.log(`Captured ${manifest.length} SKILLMAP-OP-1 screenshots in ${outputDir}`);
  } finally {
    chrome.kill();
    await sleep(500);
    try {
      await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (_error) {
      // Browser profile cleanup is best-effort; files live in the temp area.
    }
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
