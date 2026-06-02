#!/usr/bin/env node
/**
 * Capture REASON-PLAY-1 usability proof screenshots for generated reasoning pages.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.REASON_PLAY1_BOOK_ROOT || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const outputDir = path.join(platformRoot, 'reports', 'sprints', 'REASON-PLAY-1-screenshots');
const proofJson = path.join(platformRoot, 'reports', 'json', 'reason-play1-screenshot-proof.json');
const manifestMd = path.join(platformRoot, 'reports', 'sprints', 'REASON-PLAY-1-screenshot-manifest.md');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pageFiles = {
  '1.1.1': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken \u2013 redeneer-spel.html',
  '1.1.2': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers \u2013 redeneer-spel.html',
  '1.1.3': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 redeneer-spel.html'
};

const cases = [
  {
    name: 'desktop-light-111-mode0-compact-controls',
    parNr: '1.1.1',
    mode: 0,
    theme: 'light',
    size: { width: 1280, height: 820 },
    action: 'select-correct-no-check',
    proof: 'selected sequence shows compact move/remove controls before check'
  },
  {
    name: 'desktop-light-111-mode0-retry-dual-feedback',
    parNr: '1.1.1',
    mode: 0,
    theme: 'light',
    size: { width: 1280, height: 900 },
    action: 'wrong-order',
    expectedState: 'retry',
    proof: 'wrong order shows local task-shell retry feedback plus global reasoning feedback and next action'
  },
  {
    name: 'desktop-light-112-mode1-matched-next-action',
    parNr: '1.1.2',
    mode: 1,
    theme: 'light',
    size: { width: 1280, height: 820 },
    action: 'correct-order',
    expectedState: 'matched',
    proof: 'correct claim/reason/evidence bridge shows matched feedback and next action'
  },
  {
    name: 'mobile-light-113-mode3-route-placement',
    parNr: '1.1.3',
    mode: 3,
    theme: 'light',
    size: { width: 390, height: 900 },
    action: 'correct-order',
    expectedState: 'matched',
    proof: 'mobile checked long task shows ordered-chain bridge, feedback, next action, and route-panel placement'
  },
  {
    name: 'desktop-dark-111-mode5-route-contrast',
    parNr: '1.1.1',
    mode: 5,
    theme: 'dark',
    size: { width: 1280, height: 900 },
    action: 'self-check',
    expectedState: 'self_check',
    proof: 'dark-mode structured reasoning self-check includes route panel and feedback'
  }
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

function pageUrl(port, parNr) {
  return `http://127.0.0.1:${port}/` + encodeURI(pageFiles[parNr]);
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true
  }, sessionId);
  return result.result && result.result.value;
}

async function applyTheme(cdp, sessionId, theme) {
  await evaluate(cdp, sessionId, `(() => {
    localStorage.setItem('quizMode', '${theme}');
    document.documentElement.setAttribute('data-theme', '${theme}');
  })()`);
}

async function runAction(cdp, sessionId, item) {
  await evaluate(cdp, sessionId, `(() => {
    const button = document.querySelector('[data-mode="${item.mode}"]');
    if (button) button.click();
  })()`);
  await sleep(800);

  if (item.action === 'self-check') {
    await evaluate(cdp, sessionId, `(() => {
      const input = document.querySelector('[data-reasoning-task-shell="REASON-UX-2"] [data-input-role="answer"]');
      if (input) {
        input.value = 'De oorzaak staat eerst, daarna volgt de tussenstap en de conclusie sluit aan op de vraag.';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const check = document.querySelector('#r-check-btn');
      if (check) check.click();
    })()`);
    await sleep(800);
    return;
  }

  await evaluate(cdp, sessionId, `(() => {
    const tokens = Array.from(document.querySelectorAll('[data-reasoning-task-shell="REASON-ADOPT-1"] [data-step-id]'));
    const order = tokens
      .map((token) => token.getAttribute('data-step-id'))
      .filter((id) => id && !/distractor/i.test(id))
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
    order.forEach((id) => {
      const token = document.querySelector('[data-reasoning-task-shell="REASON-ADOPT-1"] [data-step-id="' + id + '"]');
      if (token) token.click();
    });
    if ('${item.action}' !== 'select-correct-no-check') {
      const check = document.querySelector('#r-check-btn');
      if (check) check.click();
    }
  })()`);
  await sleep(900);
}

async function inspect(cdp, sessionId) {
  return evaluate(cdp, sessionId, `(() => {
    const route = document.querySelector('.skill-map-route');
    const shell = document.querySelector('[data-reasoning-task-shell]');
    const task = document.querySelector('.ts-task');
    const feedback = document.querySelector('.ts-feedback-card');
    const globalFeedback = document.querySelector('#r-feedback.r-show');
    const next = document.querySelector('#r-next-btn');
    const selected = document.querySelectorAll('[data-step-selected-id]');
    const compact = document.querySelectorAll('.ts-step-move, .ts-step-remove');
    const routeRect = route ? route.getBoundingClientRect() : null;
    const shellRect = shell ? shell.getBoundingClientRect() : null;
    const markerEl = document.querySelector('[data-reasoning-task-shell="REASON-ADOPT-1"], [data-reasoning-task-shell="REASON-UX-2"]');
    return {
      title: document.title,
      routeText: route ? route.innerText.replace(/\\s+/g, ' ').trim() : '',
      shellText: shell ? shell.innerText.replace(/\\s+/g, ' ').trim() : '',
      taskFamily: task ? task.getAttribute('data-task-family') : null,
      shellMarker: markerEl ? markerEl.getAttribute('data-reasoning-task-shell') : null,
      feedbackState: feedback ? feedback.getAttribute('data-feedback-state') : null,
      globalFeedbackVisible: Boolean(globalFeedback),
      nextVisible: next ? getComputedStyle(next).display !== 'none' : false,
      selectedCount: selected.length,
      compactControlCount: compact.length,
      compactControlLabels: Array.from(compact).slice(0, 8).map((button) => button.getAttribute('aria-label') || button.textContent.trim()),
      routeRect: routeRect ? { x: Math.round(routeRect.x), y: Math.round(routeRect.y), width: Math.round(routeRect.width), height: Math.round(routeRect.height) } : null,
      shellRect: shellRect ? { x: Math.round(shellRect.x), y: Math.round(shellRect.y), width: Math.round(shellRect.width), height: Math.round(shellRect.height) } : null,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) }
    };
  })()`);
}

function validateCase(item, proof) {
  if (!proof.routeText) throw new Error(`${item.name}: missing route-panel proof`);
  if (!proof.shellText || !proof.taskFamily) throw new Error(`${item.name}: missing task-shell proof`);
  if (item.mode === 5) {
    if (proof.shellMarker !== 'REASON-UX-2' || proof.taskFamily !== 'structured_reasoning') {
      throw new Error(`${item.name}: expected structured_reasoning self-check`);
    }
  } else if (proof.shellMarker !== 'REASON-ADOPT-1' || proof.taskFamily !== 'step_ordering') {
    throw new Error(`${item.name}: expected adopted step_ordering task`);
  }
  if (item.expectedState && proof.feedbackState !== item.expectedState) {
    throw new Error(`${item.name}: expected feedback ${item.expectedState}, got ${proof.feedbackState}`);
  }
  if (item.expectedState && !proof.globalFeedbackVisible) {
    throw new Error(`${item.name}: missing global feedback proof`);
  }
  if (item.expectedState && !proof.nextVisible) {
    throw new Error(`${item.name}: missing next-action proof`);
  }
  if (item.action === 'select-correct-no-check' && proof.compactControlCount < 2) {
    throw new Error(`${item.name}: compact controls were not visible after selection`);
  }
}

async function capture(cdp, sessionId, outPath) {
  const metrics = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
  const content = metrics.contentSize || { width: 1280, height: 900 };
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
  await fsp.writeFile(outPath, Buffer.from(screenshot.data, 'base64'));
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofJson), { recursive: true });

  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `reason-play1-chrome-${Date.now()}`);
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

    const captured = [];
    for (const item of cases) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: item.size.width,
        height: item.size.height,
        deviceScaleFactor: 1,
        mobile: item.size.width < 500
      }, sessionId);
      await cdp.send('Page.navigate', { url: pageUrl(serverPort, item.parNr) }, sessionId);
      await sleep(1100);
      await applyTheme(cdp, sessionId, item.theme);
      await runAction(cdp, sessionId, item);
      const proof = await inspect(cdp, sessionId);
      validateCase(item, proof);

      const screenshotPath = path.join(outputDir, `${item.name}.png`);
      await capture(cdp, sessionId, screenshotPath);
      const stats = await fsp.stat(screenshotPath);
      if (stats.size < 20000) throw new Error(`${item.name}: screenshot too small (${stats.size} bytes)`);
      captured.push({
        name: item.name,
        paragraph: item.parNr,
        mode: item.mode,
        theme: item.theme,
        action: item.action,
        proof: item.proof,
        url: pageUrl(serverPort, item.parNr),
        screenshot: path.relative(platformRoot, screenshotPath).replace(/\\/g, '/'),
        ...proof
      });
    }

    const proof = {
      schema_version: 1,
      sprint_id: 'REASON-PLAY-1',
      generated_on: '2026-06-02',
      status: 'screenshot_proof_captured',
      book_root: bookRoot,
      cases: captured,
      authority: {
        target_equivalent_claims_authorized: false,
        diagnostics_authorized: false,
        mastery_or_sequencing_authorized: false,
        scale_gate_1_authorized: false,
        student_or_product_use_authorized: false
      }
    };
    await fsp.writeFile(proofJson, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');

    const lines = [
      '# REASON-PLAY-1 Screenshot Manifest',
      '',
      'Generated: 2026-06-02',
      '',
      'Status: screenshot proof captured for usability-agent and later human-gate review; no product authority.',
      '',
      '| Case | Paragraph | Mode | Theme | Proof | Screenshot |',
      '|---|---|---:|---|---|---|',
      ...captured.map((entry) => {
        const bits = [
          entry.proof,
          entry.feedbackState ? `feedback=${entry.feedbackState}` : 'pre-check',
          entry.globalFeedbackVisible ? 'global feedback visible' : 'global feedback hidden',
          entry.nextVisible ? 'next action visible' : 'next action not shown',
          `compact controls=${entry.compactControlCount}`,
          entry.routeRect ? `route y=${entry.routeRect.y}` : 'route missing'
        ].join('; ');
        return `| ${entry.name} | ${entry.paragraph} | ${entry.mode} | ${entry.theme} | ${bits} | \`${entry.screenshot}\` |`;
      })
    ];
    await fsp.writeFile(manifestMd, `${lines.join('\n')}\n`, 'utf8');
    console.log(`Captured ${captured.length} REASON-PLAY-1 screenshots in ${outputDir}`);
  } finally {
    chrome.kill();
    server.close();
    await sleep(500);
    await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
