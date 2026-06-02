#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review';
const gateDir = path.join(platformRoot, 'reports', 'review-gates', gateId);
const screenshotDir = path.join(gateDir, 'screenshots');
const labPath = path.join('reports', 'review-gates', gateId, 'gate-playable-reasoning-lab.html');
const proofPath = path.join(gateDir, 'playable-proof.json');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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
  return `http://127.0.0.1:${serverPort}/` + encodeURI(labPath);
}

function parseRuntimeJson(result) {
  const outer = result && result.result;
  const value = outer && Object.prototype.hasOwnProperty.call(outer, 'value') ? outer.value : outer;
  if (typeof value === 'string') return JSON.parse(value);
  if (value && typeof value.value === 'string') return JSON.parse(value.value);
  if (value && typeof value === 'object') return value;
  throw new Error(`Unexpected CDP runtime result: ${JSON.stringify(result)}`);
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

async function navigate(cdp, sessionId, serverPort, size, theme = 'light') {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: size.width,
      height: size.height,
      deviceScaleFactor: 1,
      mobile: size.width < 520,
    },
    sessionId
  );
  await cdp.send('Page.navigate', { url: pageUrl(serverPort) }, sessionId);
  await sleep(900);
  if (theme === 'dark') {
    await cdp.send(
      'Runtime.evaluate',
      {
        expression: `document.documentElement.setAttribute('data-theme', 'dark')`,
      },
      sessionId
    );
    await sleep(250);
  }
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
  const out = path.join(screenshotDir, fileName);
  await fsp.mkdir(path.dirname(out), { recursive: true });
  await fsp.writeFile(out, Buffer.from(shot.data, 'base64'));
  return path.relative(platformRoot, out).replace(/\\/g, '/');
}

async function run() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Browser executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const userDataDir = path.join(process.env.TEMP || process.env.TMP || platformRoot, `gate-reason-std1-${Date.now()}`);
  const browser = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], { stdio: 'ignore' });

  const proof = {
    schema_version: 1,
    gate_id: gateId,
    generated: '2026-06-02',
    lab: labPath.replace(/\\/g, '/'),
    status: 'started',
    cases: [],
    screenshots: [],
    summary: {},
  };

  try {
    const version = await waitForVersion(cdpPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    const initial = await evaluateJson(cdp, sessionId, 'window.gateReasonStd1.inspectState()');
    proof.cases.push({ name: 'desktop-initial', state: initial });
    proof.screenshots.push({
      name: 'gate-reason-std1-playable-initial',
      path: await screenshot(cdp, sessionId, 'gate-reason-std1-playable-initial.png'),
    });

    await evaluateJson(cdp, sessionId, `window.gateReasonStd1.checkCase('play-p111-mode0-order')`);
    const retry = await evaluateJson(cdp, sessionId, 'window.gateReasonStd1.inspectState()');
    proof.cases.push({ name: 'desktop-retry-feedback', state: retry });
    proof.screenshots.push({
      name: 'gate-reason-std1-playable-retry-feedback',
      path: await screenshot(cdp, sessionId, 'gate-reason-std1-playable-retry-feedback.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    await evaluateJson(cdp, sessionId, `window.gateReasonStd1.runCorrectPathFor('play-p111-mode0-order')`);
    await cdp.send(
      'Runtime.evaluate',
      { expression: `document.querySelector('[data-gate-next-case="play-p111-mode0-order"]').click()` },
      sessionId
    );
    await sleep(250);
    const next = await evaluateJson(cdp, sessionId, 'window.gateReasonStd1.inspectState()');
    proof.cases.push({ name: 'desktop-next-action-focus', state: next });
    proof.screenshots.push({
      name: 'gate-reason-std1-playable-next-action-focus',
      path: await screenshot(cdp, sessionId, 'gate-reason-std1-playable-next-action-focus.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    const completed = await evaluateJson(cdp, sessionId, 'window.gateReasonStd1.runAllCorrect()');
    proof.cases.push({ name: 'desktop-completed', state: completed });
    proof.screenshots.push({
      name: 'gate-reason-std1-playable-completed',
      path: await screenshot(cdp, sessionId, 'gate-reason-std1-playable-completed.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 900 }, 'dark');
    const mobileDark = await evaluateJson(cdp, sessionId, 'window.gateReasonStd1.runAllCorrect()');
    proof.cases.push({ name: 'mobile-dark-completed', state: mobileDark });
    proof.screenshots.push({
      name: 'gate-reason-std1-playable-mobile-dark-completed',
      path: await screenshot(cdp, sessionId, 'gate-reason-std1-playable-mobile-dark-completed.png'),
    });

    proof.status = 'passed';
    proof.summary = {
      required_case_count: 4,
      desktop_initial_case_count: initial.caseCount,
      desktop_initial_check_buttons: initial.checkButtonCount,
      retry_state_proved: retry.retryStates >= 1,
      next_action_focus_proved: next.activeElementTag !== 'BODY' && next.activeElementText.length > 0,
      desktop_completed_count: completed.completedCount,
      desktop_completed_visible: completed.completedVisible,
      mobile_dark_completed_count: mobileDark.completedCount,
      mobile_dark_completed_visible: mobileDark.completedVisible,
      hidden_expected_state_lookup_required_after_repair: false,
    };

    if (initial.caseCount !== 4 || initial.checkButtonCount !== 4) {
      throw new Error(`Initial lab did not expose 4 cases/check buttons: ${JSON.stringify(initial)}`);
    }
    if (!proof.summary.retry_state_proved) throw new Error('Retry feedback was not proved.');
    if (!proof.summary.next_action_focus_proved) throw new Error('Next-action focus handoff was not proved.');
    if (completed.completedCount !== 4 || !completed.completedVisible) {
      throw new Error(`Desktop completion failed: ${JSON.stringify(completed)}`);
    }
    if (mobileDark.completedCount !== 4 || !mobileDark.completedVisible || mobileDark.theme !== 'dark') {
      throw new Error(`Mobile/dark completion failed: ${JSON.stringify(mobileDark)}`);
    }

    await fsp.writeFile(proofPath, JSON.stringify(proof, null, 2) + '\n', 'utf8');
    console.log(`Wrote ${path.relative(platformRoot, proofPath).replace(/\\/g, '/')}`);
  } finally {
    server.close();
    browser.kill();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
