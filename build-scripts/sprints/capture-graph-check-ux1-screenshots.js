#!/usr/bin/env node
/**
 * Capture meaningful GRAPH-CHECK-UX-1 proof screenshots through Chromium CDP.
 *
 * Serves generated Book 1 output locally, opens the 1.1.3 Korte check, drives
 * wrong and correct graph/table interactions, and writes screenshots plus
 * reports/json/graph-check-ux1-proof.json.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'GRAPH-CHECK-UX-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GRAPH_CHECK_UX1_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const proofPath = path.join(platformRoot, 'reports', 'json', 'graph-check-ux1-proof.json');
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

const pagePath = '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 korte-check.html';

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

function pageUrl(serverPort) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(pagePath);
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
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
        localStorage.setItem('quizMode', ${JSON.stringify(theme)});
      })()`,
    },
    sessionId
  );
  await sleep(250);
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

async function inspect(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => ({
      title: document.title,
      contextBlocks: document.querySelectorAll('[data-context-block]').length,
      tableCount: document.querySelectorAll('.ts-context-table').length,
      taskCount: document.querySelectorAll('.et-task').length,
      taskShellCount: document.querySelectorAll('.et-task-shell').length,
      graphWorkspace: !!document.querySelector('.ts-graph-construction [data-graph-workspace]'),
      gridLines: document.querySelectorAll('.ts-graph-grid-line').length,
      graphPoints: document.querySelectorAll('.ts-graph-point').length,
      graphLine: !!document.querySelector('[data-graph-line-confirmed="true"]'),
      ordinaryChoiceButtons: document.querySelectorAll('.et-option').length,
      retryFeedback: Array.from(document.querySelectorAll('.et-feedback.is-retry')).map(el => el.innerText.replace(/\\s+/g, ' ').trim()),
      matchFeedback: Array.from(document.querySelectorAll('.et-feedback.is-match')).map(el => el.innerText.replace(/\\s+/g, ' ').trim()),
      completionVisible: document.querySelector('#et-completion') ? !document.querySelector('#et-completion').hidden : false,
      routeCardCount: document.querySelectorAll('.et-route-card').length,
      theme: document.documentElement.getAttribute('data-theme') || 'light',
      viewport: { width: window.innerWidth, height: window.innerHeight },
      bodyText: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 900)
    }))()`
  );
}

async function submitWrongGraph(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const taskId = 'grafiekroute-starten';
      document.querySelector('[data-task-id="' + taskId + '"][data-graph-axis="x"]').value = 'P';
      document.querySelector('[data-task-id="' + taskId + '"][data-graph-axis="y"]').value = 'Q';
      document.querySelector('[data-task-id="' + taskId + '"][data-graph-line-confirmation]').click();
      document.querySelector('.et-task-shell-check[data-task-id="' + taskId + '"]').click();
      return {
        feedback: document.querySelector('#feedback-' + taskId)?.innerText.replace(/\\s+/g, ' ').trim() || '',
        state: document.querySelector('#feedback-' + taskId)?.className || ''
      };
    })()`
  );
}

async function completeCorrectPath(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const graphId = 'grafiekroute-starten';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-axis="x"]').value = 'Q';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-axis="y"]').value = 'P';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-point-index="0"][data-graph-point-axis="x"]').value = '400';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-point-index="0"][data-graph-point-axis="y"]').value = '1,5';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-point-index="1"][data-graph-point-axis="x"]').value = '200';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-point-index="1"][data-graph-point-axis="y"]').value = '2,5';
      document.querySelector('[data-task-id="' + graphId + '"][data-graph-line-confirmation]').click();
      document.querySelector('.et-task-shell-check[data-task-id="' + graphId + '"]').click();

      const readingId = 'grafiekroute-aflezen';
      document.querySelector('[data-task-id="' + readingId + '"][data-input-role="answer"]').value = '225';
      document.querySelector('.et-task-shell-check[data-task-id="' + readingId + '"]').click();

      const routeId = 'grafiekroute-kiezen';
      document.querySelector('.ts-choice[data-task-id="' + routeId + '"][data-choice-id="tabel-naar-grafiek"]').click();
      document.querySelector('.et-task-shell-check[data-task-id="' + routeId + '"]').click();

      return {
        graphFeedback: document.querySelector('#feedback-' + graphId)?.innerText.replace(/\\s+/g, ' ').trim() || '',
        readingFeedback: document.querySelector('#feedback-' + readingId)?.innerText.replace(/\\s+/g, ' ').trim() || '',
        routeFeedback: document.querySelector('#feedback-' + routeId)?.innerText.replace(/\\s+/g, ' ').trim() || '',
        completionVisible: document.querySelector('#et-completion') ? !document.querySelector('#et-completion').hidden : false,
        graphLine: !!document.querySelector('[data-graph-line-confirmed="true"]'),
        graphPoints: document.querySelectorAll('.ts-graph-point').length
      };
    })()`
  );
}

function assertInspection(inspectResult, label) {
  const detail = JSON.stringify(inspectResult, null, 2);
  if (inspectResult.contextBlocks < 2) throw new Error(`${label}: expected context blocks\n${detail}`);
  if (inspectResult.tableCount < 1) throw new Error(`${label}: expected rendered table\n${detail}`);
  if (inspectResult.taskShellCount < 3) throw new Error(`${label}: expected three task-shell cards\n${detail}`);
  if (!inspectResult.graphWorkspace) throw new Error(`${label}: expected graph workspace\n${detail}`);
  if (inspectResult.gridLines < 8) throw new Error(`${label}: expected visible graph grid\n${detail}`);
  if (inspectResult.ordinaryChoiceButtons !== 0) throw new Error(`${label}: ordinary choice buttons should not render\n${detail}`);
}

function writeManifest(proof) {
  const lines = [
    `# ${sprintId} Screenshot Manifest`,
    '',
    'Generated: 2026-06-05',
    '',
    'Rendered `1.1.3` advisory short-check proof. Screenshots are captured from generated Book 1 output through a local static server.',
    '',
    '| Case | Viewport | Theme | Screenshot |',
    '|---|---|---|---|',
  ];
  for (const item of proof.cases) {
    lines.push(`| ${item.id} | ${item.inspection.viewport.width}x${item.inspection.viewport.height} | ${item.inspection.theme} | ${item.screenshot} |`);
  }
  lines.push('');
  lines.push('Boundary: this proof does not authorize target-equivalent completion language, product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use.');
  fs.writeFileSync(manifestPath, lines.join('\n'), 'utf8');
  fs.writeFileSync(manifestJsonPath, JSON.stringify(proof.cases, null, 2), 'utf8');
}

async function main() {
  if (!chromeExe) throw new Error(`Chromium executable not found. Tried: ${chromeCandidates.join(', ')}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `graph-check-ux1-chrome-${Date.now()}`);
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
      schema_version: 1,
      sprint_id: sprintId,
      generated: new Date().toISOString(),
      status: 'complete',
      page: pagePath,
      local_url: pageUrl(serverPort),
      authority: {
        product_route_adoption_authorized: false,
        new_target_equivalent_completion_language_authorized: false,
        diagnostics_authorized: false,
        mastery_or_sequencing_authorized: false,
        pv_authorized: false,
        scale_gate_1_authorized: false,
        student_product_use_authorized: false,
      },
      proof: {},
      cases: [],
    };

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 }, 'light');
    const initial = await inspect(cdp, sessionId);
    assertInspection(initial, 'desktop-initial');
    proof.cases.push({
      id: 'desktop-initial',
      status: 'PASS',
      inspection: initial,
      screenshot: await screenshot(cdp, sessionId, 'desktop-initial.png'),
    });

    const retry = await submitWrongGraph(cdp, sessionId);
    const retryInspection = await inspect(cdp, sessionId);
    assertInspection(retryInspection, 'desktop-wrong-retry');
    if (!/Controleer assen en tabelpunten/i.test(retry.feedback)) throw new Error(`Wrong graph feedback not targeted: ${retry.feedback}`);
    proof.cases.push({
      id: 'desktop-wrong-retry',
      status: 'PASS',
      retry,
      inspection: retryInspection,
      screenshot: await screenshot(cdp, sessionId, 'desktop-wrong-retry.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 }, 'light');
    const correct = await completeCorrectPath(cdp, sessionId);
    const correctInspection = await inspect(cdp, sessionId);
    assertInspection(correctInspection, 'desktop-route-advice');
    if (!correct.graphLine || correct.graphPoints < 2) throw new Error('Correct path did not draw graph line and points');
    if (!correct.completionVisible) throw new Error('Correct path did not reveal advisory completion route');
    proof.cases.push({
      id: 'desktop-route-advice',
      status: 'PASS',
      correct,
      inspection: correctInspection,
      screenshot: await screenshot(cdp, sessionId, 'desktop-route-advice.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 844 }, 'light');
    const mobile = await inspect(cdp, sessionId);
    assertInspection(mobile, 'mobile-initial');
    proof.cases.push({
      id: 'mobile-initial',
      status: 'PASS',
      inspection: mobile,
      screenshot: await screenshot(cdp, sessionId, 'mobile-initial.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 844 }, 'dark');
    const mobileCorrect = await completeCorrectPath(cdp, sessionId);
    const mobileDark = await inspect(cdp, sessionId);
    assertInspection(mobileDark, 'mobile-dark-route-advice');
    if (!mobileCorrect.completionVisible) throw new Error('Mobile dark correct path did not reveal route advice');
    proof.cases.push({
      id: 'mobile-dark-route-advice',
      status: 'PASS',
      correct: mobileCorrect,
      inspection: mobileDark,
      screenshot: await screenshot(cdp, sessionId, 'mobile-dark-route-advice.png'),
    });

    proof.proof = {
      short_check_task_shell_count: initial.taskShellCount,
      short_check_context_block_count: initial.contextBlocks,
      graph_workspace_present: initial.graphWorkspace,
      grid_visible: initial.gridLines >= 8,
      rendered_table_present: initial.tableCount >= 1,
      choice_only: initial.ordinaryChoiceButtons > 0,
      wrong_feedback_targeted: /Controleer assen en tabelpunten/i.test(retry.feedback),
      correct_path_draws_line: correct.graphLine === true,
      correct_path_reaches_route_advice: correct.completionVisible === true,
      mobile_rendered: mobile.viewport.width === 390,
      dark_mode_rendered: mobileDark.theme === 'dark',
    };

    writeManifest(proof);
    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2), 'utf8');
    console.log(`wrote ${path.relative(platformRoot, proofPath)}`);
  } finally {
    try { chrome.kill(); } catch (_error) { /* ignore */ }
    server.close();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
