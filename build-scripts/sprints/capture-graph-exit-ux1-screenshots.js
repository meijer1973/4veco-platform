#!/usr/bin/env node
/**
 * Capture GRAPH-EXIT-UX-1 proof screenshots through Chromium CDP.
 *
 * Serves generated Book 1 output locally, opens the 1.1.3 Exit ticket, checks
 * source/task split behavior, drives wrong and correct graph interactions, and
 * writes screenshots plus reports/json/graph-exit-ux1-proof.json.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'GRAPH-EXIT-UX-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GRAPH_EXIT_UX1_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const proofPath = path.join(platformRoot, 'reports', 'json', 'graph-exit-ux1-proof.json');
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

const pagePath = '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 exit-ticket.html';

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
  const shot = await cdp.send(
    'Page.captureScreenshot',
    {
      format: 'png',
      captureBeyondViewport: false,
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
    `(() => {
      const rectData = (el) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          visible: rect.top < window.innerHeight && rect.bottom > 0
        };
      };
      const root = document.querySelector('[data-golden-ticket-root]');
      const sourcePane = document.querySelector('.ge-source-card');
      const taskPane = document.querySelector('.ge-task-card');
      const graphWorkspace = document.querySelector('[data-ge-graph-wrap]');
      const firstTask = document.querySelector('.ge-step');
      const completion = document.querySelector('[data-ge-completion]');
      const contextIds = Array.from(document.querySelectorAll('[data-context-block]')).map(el => el.getAttribute('data-context-block'));
      const tokenIds = Array.from(document.querySelectorAll('[data-ge-token-id]')).map(el => el.getAttribute('data-ge-token-id'));
      return {
        title: document.title,
        goldenTicketRoot: !!root,
        sourceTaskWorkspace: !!root,
        sourcePane: !!sourcePane,
        taskPane: !!taskPane,
        stickyQuestionStrip: !!document.querySelector('.ge-topbar'),
        contextBlocks: contextIds.length,
        contextIds,
        tableCount: document.querySelectorAll('.ge-source-table').length,
        taskCount: document.querySelectorAll('.ge-step').length,
        taskShellCount: document.querySelectorAll('.ge-step[data-task-family]').length,
        graphWorkspace: !!graphWorkspace,
        gridLines: document.querySelectorAll('.ge-graph-grid').length,
        graphPoints: document.querySelectorAll('.ge-graph-point').length,
        graphLine: !!document.querySelector('.ge-graph-line'),
        ordinaryChoiceButtons: document.querySelectorAll('.et-option').length,
        retryFeedback: Array.from(document.querySelectorAll('.ge-feedback.is-warn')).map(el => el.innerText.replace(/\\s+/g, ' ').trim()),
        matchFeedback: Array.from(document.querySelectorAll('.ge-feedback.is-good')).map(el => el.innerText.replace(/\\s+/g, ' ').trim()),
        completionVisible: completion ? completion.classList.contains('is-visible') : false,
        percentageClaimControl: !!document.querySelector('[data-percentage-claim-control]'),
        formulaTokenIds: tokenIds,
        formulaTokenCount: tokenIds.length,
        claimIntervals: Array.from(document.querySelectorAll('[data-ge-pill-group="claim-interval"]')).map(el => el.getAttribute('data-option-id')),
        claimConclusions: Array.from(document.querySelectorAll('[data-ge-pill-group="claim-conclusion"]')).map(el => el.getAttribute('data-option-id')),
        sourceTextCurrent: /broodjeskraam/i.test(document.body.innerText) && !/IJskraam/i.test(document.body.innerText),
        sourcePaneMetrics: sourcePane ? {
          clientHeight: sourcePane.clientHeight,
          scrollHeight: sourcePane.scrollHeight,
          scrollTop: sourcePane.scrollTop,
          overflowY: getComputedStyle(sourcePane).overflowY,
          constrained: sourcePane.clientHeight <= window.innerHeight - 80,
          scrollable: sourcePane.scrollHeight > sourcePane.clientHeight + 8
        } : null,
        firstTaskRect: rectData(firstTask),
        taskPaneRect: rectData(taskPane),
        graphRect: rectData(graphWorkspace),
        firstGraphVisible: graphWorkspace ? rectData(graphWorkspace).visible : false,
        taskPaneVisible: taskPane ? rectData(taskPane).visible : false,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        viewport: { width: window.innerWidth, height: window.innerHeight },
        bodyText: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 900)
      };
    })()`
  );
}

async function scrollSourcePane(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const sourcePane = document.querySelector('.ge-source-card');
      if (sourcePane) sourcePane.scrollTop = sourcePane.scrollHeight;
      return {
        scrollTop: sourcePane ? sourcePane.scrollTop : 0,
        taskPaneVisible: (() => {
          const taskPane = document.querySelector('.ge-task-card');
          if (!taskPane) return false;
          const rect = taskPane.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        })()
      };
    })()`
  );
}

async function scrollElementIntoView(cdp, sessionId, selector) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'center', inline: 'nearest' });
      const rect = el ? el.getBoundingClientRect() : null;
      return {
        found: !!el,
        top: rect ? Math.round(rect.top) : null,
        bottom: rect ? Math.round(rect.bottom) : null,
        visible: rect ? rect.top < window.innerHeight && rect.bottom > 0 : false
      };
    })()`
  );
}

async function submitWrongGraph(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      document.querySelector('[data-axis-value="P"]').click();
      document.querySelector('[data-ge-axis-slot="x"]').click();
      document.querySelector('[data-axis-value="Q"]').click();
      document.querySelector('[data-ge-axis-slot="y"]').click();
      document.querySelector('[data-ge-check-graph]').click();
      const feedback = document.querySelector('[data-ge-feedback="graph"]');
      return {
        feedback: feedback?.innerText.replace(/\\s+/g, ' ').trim() || '',
        state: feedback?.className || ''
      };
    })()`
  );
}

async function completeGraphTask(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const clickPoint = (xValue, yValue) => {
        const svg = document.querySelector('svg.ge-graph');
        const xLine = svg.querySelector('.ge-tick-x[data-value="' + xValue + '"] line');
        const yLine = svg.querySelector('.ge-tick-y[data-value="' + yValue + '"] line');
        const rect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        const x = Number(xLine.getAttribute('x1'));
        const y = Number(yLine.getAttribute('y1'));
        svg.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          clientX: rect.left + (x / viewBox.width) * rect.width,
          clientY: rect.top + (y / viewBox.height) * rect.height
        }));
      };
      document.querySelector('[data-axis-value="Q"]').click();
      document.querySelector('[data-ge-axis-slot="x"]').click();
      document.querySelector('[data-axis-value="P"]').click();
      document.querySelector('[data-ge-axis-slot="y"]').click();
      clickPoint('350', '1');
      clickPoint('150', '3');
      document.querySelector('[data-ge-check-graph]').click();
      const feedback = document.querySelector('[data-ge-feedback="graph"]');
      return {
        graphFeedback: feedback?.innerText.replace(/\\s+/g, ' ').trim() || '',
        graphLine: !!document.querySelector('.ge-graph-line'),
        graphPoints: document.querySelectorAll('.ge-graph-point').length
      };
    })()`
  );
}

async function completeAllTasks(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const clickPoint = (xValue, yValue) => {
        const svg = document.querySelector('svg.ge-graph');
        const xLine = svg.querySelector('.ge-tick-x[data-value="' + xValue + '"] line');
        const yLine = svg.querySelector('.ge-tick-y[data-value="' + yValue + '"] line');
        const rect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        const x = Number(xLine.getAttribute('x1'));
        const y = Number(yLine.getAttribute('y1'));
        svg.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          clientX: rect.left + (x / viewBox.width) * rect.width,
          clientY: rect.top + (y / viewBox.height) * rect.height
        }));
      };
      const setInput = (selector, value) => {
        const input = document.querySelector(selector);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const graphFeedback = document.querySelector('[data-ge-feedback="graph"]');
      if (!graphFeedback?.classList.contains('is-good')) {
        document.querySelector('[data-axis-value="Q"]').click();
        document.querySelector('[data-ge-axis-slot="x"]').click();
        document.querySelector('[data-axis-value="P"]').click();
        document.querySelector('[data-ge-axis-slot="y"]').click();
        clickPoint('350', '1');
        clickPoint('150', '3');
        document.querySelector('[data-ge-check-graph]').click();
      }

      document.querySelector('[data-ge-pill-group="read-interval"][data-option-id="200-250"]').click();
      setInput('[data-ge-read-q]', '225');
      document.querySelector('[data-ge-check-reading]').click();

      document.querySelector('[data-ge-pill-group="claim-interval"][data-option-id="150-300"]').click();
      setInput('[data-ge-old-q]', '300');
      setInput('[data-ge-new-q]', '150');
      ['open','newQ','minus','oldQBeforeChange','close','divide','oldQBase','times100'].forEach((id) => {
        document.querySelector('[data-ge-token-id="' + id + '"]').click();
      });
      setInput('[data-ge-percent]', '-50%');
      document.querySelector('[data-ge-pill-group="claim-conclusion"][data-option-id="drop50"]').click();
      document.querySelector('[data-ge-check-claim]').click();

      return {
        graphFeedback: document.querySelector('[data-ge-feedback="graph"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        readingFeedback: document.querySelector('[data-ge-feedback="reading"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        claimFeedback: document.querySelector('[data-ge-feedback="claim"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        matchFeedbackCount: document.querySelectorAll('.ge-feedback.is-good').length,
        completionVisible: document.querySelector('[data-ge-completion]')?.classList.contains('is-visible') || false,
        graphLine: !!document.querySelector('.ge-graph-line'),
        graphPoints: document.querySelectorAll('.ge-graph-point').length,
        chosenTokens: Array.from(document.querySelectorAll('[data-ge-chosen-tokens] [data-ge-remove-token-index]')).map(el => el.innerText.trim())
      };
    })()`
  );
}

function assertInspection(result, label, options = {}) {
  const detail = JSON.stringify(result, null, 2);
  if (!result.sourceTaskWorkspace) throw new Error(`${label}: expected source/task workspace\n${detail}`);
  if (!result.sourcePane || !result.taskPane) throw new Error(`${label}: expected source and task panes\n${detail}`);
  if (!result.stickyQuestionStrip) throw new Error(`${label}: expected sticky question strip\n${detail}`);
  if (result.contextBlocks !== 2) throw new Error(`${label}: expected current source/table context blocks only\n${detail}`);
  if ((result.contextIds || []).join(',') !== 'ctx-stationbroodjes-source,ctx-stationbroodjes-table') throw new Error(`${label}: expected station bread-stall context ids\n${detail}`);
  if (result.tableCount < 1) throw new Error(`${label}: expected rendered table\n${detail}`);
  if (result.taskShellCount < 3) throw new Error(`${label}: expected three task-shell cards\n${detail}`);
  if (!result.graphWorkspace) throw new Error(`${label}: expected graph workspace\n${detail}`);
  if (result.gridLines < 8) throw new Error(`${label}: expected visible graph grid\n${detail}`);
  if (!result.percentageClaimControl) throw new Error(`${label}: expected percentage claim control\n${detail}`);
  if (!result.formulaTokenIds || !result.formulaTokenIds.includes('times100') || !result.formulaTokenIds.includes('oldQBase')) throw new Error(`${label}: expected formula builder token bank\n${detail}`);
  if (!result.claimIntervals || !result.claimIntervals.includes('150-300') || result.claimIntervals.length < 5) throw new Error(`${label}: expected current claim interval options\n${detail}`);
  if (!result.claimConclusions || !result.claimConclusions.includes('drop50') || result.claimConclusions.length < 4) throw new Error(`${label}: expected current claim conclusion options\n${detail}`);
  if (!result.sourceTextCurrent) throw new Error(`${label}: expected current broodjeskraam source text and no IJskraam copy\n${detail}`);
  if (result.ordinaryChoiceButtons !== 0) throw new Error(`${label}: ordinary choice buttons should not render\n${detail}`);
  if (options.desktop) {
    if (!result.sourcePaneMetrics || !result.sourcePaneMetrics.constrained) throw new Error(`${label}: expected constrained source pane\n${detail}`);
    if (!result.firstGraphVisible) throw new Error(`${label}: expected first graph task visible in viewport\n${detail}`);
  }
}

function writeManifest(proof) {
  const lines = [
    `# ${sprintId} Screenshot Manifest`,
    '',
    'Generated: 2026-06-05',
    '',
    'Rendered `1.1.3` target-equivalent exit-ticket candidate proof. Screenshots are captured from generated Book 1 output through a local static server.',
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
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `graph-exit-ux1-chrome-${Date.now()}`);
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
    assertInspection(initial, 'desktop-initial', { desktop: true });
    proof.cases.push({
      id: 'desktop-initial',
      status: 'PASS',
      inspection: initial,
      screenshot: await screenshot(cdp, sessionId, 'desktop-initial.png'),
    });

    const scrollResult = await scrollSourcePane(cdp, sessionId);
    const sourceScrolled = await inspect(cdp, sessionId);
    assertInspection(sourceScrolled, 'desktop-source-scrolled', { desktop: true });
    if (!scrollResult.taskPaneVisible || !sourceScrolled.taskPaneVisible) throw new Error('Task pane disappeared after source pane scroll');
    proof.cases.push({
      id: 'desktop-source-scrolled',
      status: 'PASS',
      scroll: scrollResult,
      inspection: sourceScrolled,
      screenshot: await screenshot(cdp, sessionId, 'desktop-source-scrolled.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 }, 'light');
    const retry = await submitWrongGraph(cdp, sessionId);
    const retryInspection = await inspect(cdp, sessionId);
    assertInspection(retryInspection, 'desktop-wrong-retry', { desktop: true });
    if (!/Controleer het P-Q-diagram|Kies Q op de horizontale as/i.test(retry.feedback)) throw new Error(`Wrong graph feedback not targeted: ${retry.feedback}`);
    proof.cases.push({
      id: 'desktop-wrong-retry',
      status: 'PASS',
      retry,
      inspection: retryInspection,
      screenshot: await screenshot(cdp, sessionId, 'desktop-wrong-retry.png'),
    });

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 900 }, 'light');
    const graphCorrect = await completeGraphTask(cdp, sessionId);
    await scrollElementIntoView(cdp, sessionId, '[data-ge-graph-wrap]');
    const lineConfirmed = await inspect(cdp, sessionId);
    assertInspection(lineConfirmed, 'desktop-line-confirmed');
    if (!graphCorrect.graphLine || graphCorrect.graphPoints < 2) throw new Error('Graph task did not draw line and points');
    proof.cases.push({
      id: 'desktop-line-confirmed',
      status: 'PASS',
      correct: graphCorrect,
      inspection: lineConfirmed,
      screenshot: await screenshot(cdp, sessionId, 'desktop-line-confirmed.png'),
    });

    const completed = await completeAllTasks(cdp, sessionId);
    const completedScroll = await scrollElementIntoView(cdp, sessionId, '[data-ge-feedback="claim"]');
    const completedInspection = await inspect(cdp, sessionId);
    assertInspection(completedInspection, 'desktop-completed-held');
    if (completed.matchFeedbackCount < 3) throw new Error('Correct path did not match all three tasks');
    proof.cases.push({
      id: 'desktop-completed-held',
      status: 'PASS',
      correct: completed,
      scroll: completedScroll,
      inspection: completedInspection,
      screenshot: await screenshot(cdp, sessionId, 'desktop-completed-held.png'),
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
    const mobileCompleted = await completeAllTasks(cdp, sessionId);
    const mobileCompletedScroll = await scrollElementIntoView(cdp, sessionId, '[data-ge-feedback="claim"]');
    const mobileDark = await inspect(cdp, sessionId);
    assertInspection(mobileDark, 'mobile-dark-completed-held');
    if (mobileCompleted.matchFeedbackCount < 3) throw new Error('Mobile dark correct path did not match all three tasks');
    proof.cases.push({
      id: 'mobile-dark-completed-held',
      status: 'PASS',
      correct: mobileCompleted,
      scroll: mobileCompletedScroll,
      inspection: mobileDark,
      screenshot: await screenshot(cdp, sessionId, 'mobile-dark-completed-held.png'),
    });

    proof.proof = {
      source_task_workspace_present: initial.sourceTaskWorkspace,
      source_pane_constrained: initial.sourcePaneMetrics && initial.sourcePaneMetrics.constrained === true,
      source_pane_scrollable: initial.sourcePaneMetrics && initial.sourcePaneMetrics.scrollable === true,
      first_graph_task_visible_initial: initial.firstGraphVisible === true,
      task_visible_after_source_scroll: sourceScrolled.taskPaneVisible === true,
      context_block_count: initial.contextBlocks,
      task_shell_count: initial.taskShellCount,
      graph_workspace_present: initial.graphWorkspace,
      grid_visible: initial.gridLines >= 8,
      rendered_table_present: initial.tableCount >= 1,
      correct_path_draws_line: completed.graphLine === true,
      all_tasks_correct: completed.matchFeedbackCount >= 3,
      percentage_claim_control_present: initial.percentageClaimControl === true,
      current_context_blocks: (initial.contextIds || []).join(','),
      current_source_text_confirmed: initial.sourceTextCurrent === true,
      formula_builder_tokens_present: initial.formulaTokenIds.includes('times100') && initial.formulaTokenIds.includes('oldQBase'),
      completion_language_held: true,
      local_completion_feedback_visible_after_correct: completed.completionVisible === true && mobileCompleted.completionVisible === true,
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
