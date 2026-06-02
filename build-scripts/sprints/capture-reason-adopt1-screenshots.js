#!/usr/bin/env node
/**
 * Capture REASON-ADOPT-1 playable reasoning/task-shell screenshots.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.REASON_ADOPT1_BOOK_ROOT || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const outputDir = path.resolve(platformRoot, 'reports', 'sprints', 'REASON-ADOPT-1-screenshots');
const chromeExe = process.env.CHROME_EXE
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pageFiles = {
  '1.1.1': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken \u2013 redeneer-spel.html',
  '1.1.2': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers \u2013 redeneer-spel.html',
  '1.1.3': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 redeneer-spel.html'
};

const cases = [
  { name: 'desktop-light-111-mode0-initial', parNr: '1.1.1', mode: 0, theme: 'light', size: { width: 1280, height: 820 }, action: 'initial', expectedState: null },
  { name: 'desktop-light-111-mode0-retry', parNr: '1.1.1', mode: 0, theme: 'light', size: { width: 1280, height: 820 }, action: 'wrong-order', expectedState: 'retry' },
  { name: 'desktop-light-112-mode1-matched', parNr: '1.1.2', mode: 1, theme: 'light', size: { width: 1280, height: 820 }, action: 'correct-order', expectedState: 'matched' },
  { name: 'mobile-light-113-mode3-matched', parNr: '1.1.3', mode: 3, theme: 'light', size: { width: 390, height: 844 }, action: 'correct-order', expectedState: 'matched' },
  { name: 'desktop-dark-111-mode5-self-check', parNr: '1.1.1', mode: 5, theme: 'dark', size: { width: 1280, height: 820 }, action: 'self-check', expectedState: 'self_check' }
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
    http.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
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

function pageUrl(serverPort, parNr) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(pageFiles[parNr]);
}

async function applyTheme(cdp, sessionId, theme) {
  await cdp.send('Runtime.evaluate', {
    expression: `try {
      localStorage.setItem('quizMode', '${theme}');
      document.documentElement.setAttribute('data-theme', '${theme}');
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.textContent = '${theme}' === 'dark' ? 'Lichte modus' : 'Donkere modus';
    } catch(e) {}`
  }, sessionId);
}

async function runAction(cdp, sessionId, item) {
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const mode = document.querySelector('[data-mode="${item.mode}"]');
      if (mode) mode.click();
    })()`
  }, sessionId);
  await sleep(900);

  if (item.action === 'initial') return;

  if (item.action === 'self-check') {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('[data-reasoning-task-shell="REASON-UX-2"] [data-input-role="answer"]');
        if (input) {
          input.value = 'De oorzaak staat eerst, daarna leg ik de tussenstap uit en sluit ik af met de conclusie.';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = document.querySelector('#r-check-btn');
        if (button) button.click();
      })()`
    }, sessionId);
    await sleep(800);
    return;
  }

  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const tokens = Array.from(document.querySelectorAll('[data-reasoning-task-shell="REASON-ADOPT-1"] [data-step-id]'));
      const order = tokens
        .map((token) => token.getAttribute('data-step-id'))
        .filter((id) => id && !id.includes('distractor'))
        .sort((a, b) => {
          const an = Number((a.match(/\\d+/) || ['0'])[0]);
          const bn = Number((b.match(/\\d+/) || ['0'])[0]);
          return an - bn;
        });
      if ('${item.action}' === 'wrong-order' && order.length > 1) {
        const first = order[0];
        order[0] = order[1];
        order[1] = first;
      }
      for (const id of order) {
        const token = document.querySelector('[data-reasoning-task-shell="REASON-ADOPT-1"] [data-step-id="' + id + '"]');
        if (token) token.click();
      }
      const button = document.querySelector('#r-check-btn');
      if (button) button.click();
    })()`
  }, sessionId);
  await sleep(900);
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `reason-adopt1-chrome-${Date.now()}`);
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
      await cdp.send('Page.navigate', { url: pageUrl(serverPort, item.parNr) }, sessionId);
      await sleep(1200);
      await applyTheme(cdp, sessionId, item.theme);
      await runAction(cdp, sessionId, item);

      const proof = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const route = document.querySelector('.skill-map-route');
          const shell = document.querySelector('[data-reasoning-task-shell]');
          const adoptShell = document.querySelector('[data-reasoning-task-shell="REASON-ADOPT-1"]');
          const uxShell = document.querySelector('[data-reasoning-task-shell="REASON-UX-2"]');
          const task = document.querySelector('.ts-task');
          const feedback = document.querySelector('.ts-feedback-card');
          const globalFeedback = document.querySelector('#r-feedback.r-show');
          const next = document.querySelector('#r-next-btn');
          const check = document.querySelector('#r-check-btn');
          const selected = document.querySelectorAll('[data-step-selected-id]');
          const rect = shell ? shell.getBoundingClientRect() : null;
          return {
            title: document.title,
            routeText: route ? route.innerText.replace(/\\s+/g, ' ').trim() : '',
            shellText: shell ? shell.innerText.replace(/\\s+/g, ' ').trim() : '',
            taskFamily: task ? task.getAttribute('data-task-family') : null,
            shellMarker: adoptShell ? 'REASON-ADOPT-1' : (uxShell ? 'REASON-UX-2' : null),
            feedbackState: feedback ? feedback.getAttribute('data-feedback-state') : null,
            globalFeedbackVisible: Boolean(globalFeedback),
            nextVisible: next ? getComputedStyle(next).display !== 'none' : false,
            checkVisible: check ? getComputedStyle(check).display !== 'none' : false,
            selectedCount: selected.length,
            shellRect: rect ? { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) } : null,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) }
          };
        })()`,
        returnByValue: true
      }, sessionId);
      const value = proof.result && proof.result.value;
      if (!value || !value.routeText) {
        throw new Error(`${item.name}: missing skill-map route proof`);
      }
      if (!value.shellText || !value.taskFamily) {
        throw new Error(`${item.name}: missing task-shell proof`);
      }
      if (item.mode === 5 && (value.shellMarker !== 'REASON-UX-2' || value.taskFamily !== 'structured_reasoning')) {
        throw new Error(`${item.name}: missing structured reasoning shell proof`);
      }
      if (item.mode !== 5 && (value.shellMarker !== 'REASON-ADOPT-1' || value.taskFamily !== 'step_ordering')) {
        throw new Error(`${item.name}: missing adopted step_ordering shell proof`);
      }
      if (item.expectedState && value.feedbackState !== item.expectedState) {
        throw new Error(`${item.name}: expected feedback state ${item.expectedState}, got ${value.feedbackState}`);
      }
      if (item.expectedState && !value.nextVisible) {
        throw new Error(`${item.name}: missing next-action proof`);
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
        parNr: item.parNr,
        mode: item.mode,
        theme: item.theme,
        action: item.action,
        url: pageUrl(serverPort, item.parNr),
        screenshot: outPath,
        route_text: value.routeText,
        shell_text: value.shellText,
        task_family: value.taskFamily,
        shell_marker: value.shellMarker,
        feedback_state: value.feedbackState,
        global_feedback_visible: value.globalFeedbackVisible,
        next_visible: value.nextVisible,
        check_visible: value.checkVisible,
        selected_count: value.selectedCount,
        shell_rect: value.shellRect,
        viewport: value.viewport,
        page: value.page
      });
    }

    await fsp.writeFile(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify({ captured_on: '2026-06-02', book_root: bookRoot, cases: manifest }, null, 2),
      'utf8'
    );

    const manifestMd = [
      '# REASON-ADOPT-1 Screenshot Manifest',
      '',
      'Generated: 2026-06-02',
      '',
      'These screenshots are route-specific proof for generated Book 1 reasoning pages. They do not authorize target-equivalent claims, diagnostics, mastery, sequencing, Scale Gate 1, or product use.',
      '',
      '| Case | Paragraph | Mode | Theme | Proof | Screenshot |',
      '|---|---|---:|---|---|---|',
      ...manifest.map((entry) => {
        const proof = [
          entry.shell_marker,
          entry.task_family,
          entry.feedback_state ? `feedback=${entry.feedback_state}` : 'initial',
          entry.global_feedback_visible ? 'global feedback visible' : 'global feedback hidden',
          entry.next_visible ? 'next action visible' : 'next action not yet shown'
        ].join('; ');
        const rel = path.relative(platformRoot, entry.screenshot).replace(/\\/g, '/');
        return `| ${entry.name} | ${entry.parNr} | ${entry.mode} | ${entry.theme} | ${proof} | \`${rel}\` |`;
      })
    ].join('\n') + '\n';
    await fsp.writeFile(path.join(platformRoot, 'reports', 'sprints', 'REASON-ADOPT-1-screenshot-manifest.md'), manifestMd, 'utf8');
    console.log(`Captured ${manifest.length} REASON-ADOPT-1 screenshots in ${outputDir}`);
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

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
