#!/usr/bin/env node
/**
 * Capture and verify playable review proof for GATE-TASK-FAMILY-1.
 *
 * This serves the platform repo locally, opens the review-only playable lab in
 * headless Edge/Chrome, captures initial/retry/completed screenshots, and
 * writes a proof JSON. It does not mutate lesson output or product routes.
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
const labPath = path.join('reports', 'review-gates', gateId, 'gate-playable-task-family-lab.html');
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

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => JSON.stringify({
        title: document.title,
        taskCount: document.querySelectorAll('.ts-task').length,
        checkButtonCount: document.querySelectorAll('[data-gate-check-task]').length,
        feedbackCount: document.querySelectorAll('.ts-feedback').length,
        progressText: document.querySelector('[data-gate-progress]')?.textContent || '',
        completedVisible: document.querySelector('[data-gate-complete]')?.classList.contains('is-visible') || false,
        hasTaskShellUI: typeof window.TaskShellUI,
        hasTaskShellEngine: typeof window.TaskShellEngine,
        initError: window.gateTaskFamilyInitError || '',
        rootExists: !!document.getElementById('playable-root'),
        rootHtmlLength: document.getElementById('playable-root')?.innerHTML.length || 0,
        dataLength: document.getElementById('gate-task-data')?.textContent.length || 0,
        matchedStates: Array.from(document.querySelectorAll('[data-gate-task-state]')).filter(el => el.getAttribute('data-state') === 'matched').length,
        retryStates: Array.from(document.querySelectorAll('[data-gate-task-state]')).filter(el => el.getAttribute('data-state') === 'retry').length,
        visibleNextActions: Array.from(document.querySelectorAll('[data-gate-next-task]')).filter(el => el.classList.contains('is-visible')).length,
        text: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 500),
        viewport: { width: window.innerWidth, height: window.innerHeight },
        theme: document.documentElement.getAttribute('data-theme') || 'light'
      }))()`,
      returnByValue: true,
    },
    sessionId
  );
  if (process.env.GATE_TASK_FAMILY1_DEBUG === '1') {
    console.error('Raw inspect result:', JSON.stringify(result, null, 2));
  }
  return parseRuntimeJson(result);
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

function parseRuntimeJson(result) {
  const outer = result && result.result;
  const value = outer && Object.prototype.hasOwnProperty.call(outer, 'value') ? outer.value : outer;
  if (typeof value === 'string') return JSON.parse(value);
  if (value && typeof value.value === 'string') return JSON.parse(value.value);
  if (value && typeof value === 'object') return value;
  throw new Error(`Unexpected CDP runtime result: ${JSON.stringify(result)}`);
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
        expression: `(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('gateTaskFamilyTheme', 'dark');
        })()`,
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
  const outPath = path.join(screenshotDir, fileName);
  await fsp.writeFile(outPath, Buffer.from(shot.data, 'base64'));
  return path.relative(platformRoot, outPath).replace(/\\/g, '/');
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  if (!fs.existsSync(path.join(platformRoot, labPath))) {
    throw new Error(`Playable lab missing; run emit-gate-task-family1-playable-lab.js first: ${labPath}`);
  }

  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `gate-task-family1-chrome-${Date.now()}`);
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

    const proof = {
      gate_id: gateId,
      captured_on: '2026-06-02',
      lab_path: labPath.replace(/\\/g, '/'),
      local_url: pageUrl(serverPort),
      product_authority: false,
      generated_lesson_output_mutated: false,
      cases: [],
    };

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    const initial = await inspect(cdp, sessionId);
    if (initial.taskCount !== 12 || initial.checkButtonCount !== 12) {
      console.error('Initial inspection:', JSON.stringify(initial, null, 2));
      throw new Error(`Expected 12 playable tasks and check buttons, got ${initial.taskCount}/${initial.checkButtonCount}`);
    }
    proof.cases.push({
      id: 'desktop-initial',
      status: 'PASS',
      inspection: initial,
      screenshot: await screenshot(cdp, sessionId, 'gate-task-family1-playable-initial.png'),
    });

    const retry = await evaluateJson(
      cdp,
      sessionId,
      `(() => {
        const button = document.querySelector('[data-gate-check-task="cloze-text-index"]');
        button.click();
        return {
          state: document.querySelector('[data-task="cloze-text-index"] [data-gate-task-state]')?.getAttribute('data-state'),
          feedback: document.querySelector('[data-feedback-for="cloze-text-index"]')?.innerText.replace(/\\s+/g, ' ').trim()
        };
      })()`
    );
    if (retry.state !== 'retry' || !/Nog niet/i.test(retry.feedback || '')) {
      throw new Error(`Retry evidence did not produce an understandable retry state: ${JSON.stringify(retry)}`);
    }
    proof.cases.push({
      id: 'desktop-retry-feedback',
      status: 'PASS',
      inspection: await inspect(cdp, sessionId),
      retry,
      screenshot: await screenshot(cdp, sessionId, 'gate-task-family1-playable-retry-feedback.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    const nextAction = await evaluateJson(
      cdp,
      sessionId,
      `(() => {
        window.GateTaskFamilyLab.correctPathFor('cloze-text-index');
        window.GateTaskFamilyLab.checkTask('cloze-text-index');
        const button = document.querySelector('[data-gate-next-task="cloze-text-index"]');
        const before = {
          buttonText: button?.textContent || '',
          visible: button?.classList.contains('is-visible') || false,
          disabled: button?.disabled === true,
          progress: document.querySelector('[data-gate-progress]')?.textContent || '',
          activeFeedback: document.activeElement?.getAttribute('data-feedback-for') || ''
        };
        button?.click();
        const active = document.activeElement;
        return {
          before,
          after: {
            activeTask: active?.getAttribute('data-task-id') || active?.closest?.('[data-task]')?.getAttribute('data-task') || '',
            activeControl: active?.getAttribute('data-multi-option-id') || active?.tagName || '',
            progress: document.querySelector('[data-gate-progress]')?.textContent || ''
          }
        };
      })()`
    );
    if (
      nextAction.before.visible !== true ||
      nextAction.before.disabled !== false ||
      nextAction.before.activeFeedback !== 'cloze-text-index' ||
      nextAction.after.activeTask !== 'multi-select-schaarste'
    ) {
      throw new Error(`Next-action/focus proof failed: ${JSON.stringify(nextAction)}`);
    }
    proof.cases.push({
      id: 'desktop-next-action-focus',
      status: 'PASS',
      inspection: await inspect(cdp, sessionId),
      next_action: nextAction,
      screenshot: await screenshot(cdp, sessionId, 'gate-task-family1-playable-next-action-focus.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 });
    const completedResult = await evaluateJson(cdp, sessionId, 'window.GateTaskFamilyLab.autoplayCorrect()');
    await sleep(400);
    const completed = await inspect(cdp, sessionId);
    if (completedResult.matched !== 12 || completed.matchedStates !== 12 || completed.completedVisible !== true) {
      throw new Error(`Correct path did not complete all tasks: ${JSON.stringify({ completedResult, completed })}`);
    }
    proof.cases.push({
      id: 'desktop-completed',
      status: 'PASS',
      inspection: completed,
      result: completedResult,
      screenshot: await screenshot(cdp, sessionId, 'gate-task-family1-playable-completed.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 844 }, 'dark');
    const mobileResult = await evaluateJson(cdp, sessionId, 'window.GateTaskFamilyLab.autoplayCorrect()');
    await sleep(400);
    const mobile = await inspect(cdp, sessionId);
    if (mobileResult.matched !== 12 || mobile.matchedStates !== 12 || mobile.theme !== 'dark') {
      throw new Error(`Mobile/dark correct path failed: ${JSON.stringify({ mobileResult, mobile })}`);
    }
    proof.cases.push({
      id: 'mobile-dark-completed',
      status: 'PASS',
      inspection: mobile,
      result: mobileResult,
      screenshot: await screenshot(cdp, sessionId, 'gate-task-family1-playable-mobile-dark-completed.png'),
    });

    proof.all_playable_tasks_completed = true;
    proof.completed_task_count = 12;
    proof.required_task_count = 12;
    await fsp.writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${path.relative(platformRoot, proofPath)}`);
    for (const item of proof.cases) {
      console.log(`Captured ${item.id}: ${item.screenshot}`);
    }
  } finally {
    server.close();
    chrome.kill();
    try {
      await fsp.rm(profileDir, { recursive: true, force: true });
    } catch (_error) {
      // Edge can keep a short lock after successful capture on Windows.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
