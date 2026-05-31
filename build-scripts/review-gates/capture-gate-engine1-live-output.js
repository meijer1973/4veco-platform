#!/usr/bin/env node
/**
 * Capture and verify the minimum live-output inspection for GATE-ENGINE-1.
 *
 * This script serves the checked-out Book 1 lesson output locally, drives a
 * headless browser, captures screenshots, and writes a review-gate inspection
 * report. It does not mutate lesson output.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GATE_ENGINE1_BOOK_ROOT || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const gateDir = path.resolve(platformRoot, 'reports', 'review-gates', 'GATE-ENGINE-1-four-engine-operational-integration');
const screenshotDir = path.join(gateDir, 'live-output-screenshots');
const jsonPath = path.join(gateDir, 'live-output-inspection.json');
const mdPath = path.join(gateDir, 'live-output-inspection.md');
const chromeExe = process.env.CHROME_EXE
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const paths = {
  landing111: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html',
  check111: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken \u2013 exit-ticket.html',
  math112Landing: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/index.html',
  math112: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers \u2013 wiskundevaardigheden.html',
  graph113Landing: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/index.html',
  graph113: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 grafiekenspel.html',
  reasoning111: '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken \u2013 redeneer-spel.html'
};

const cases = [
  {
    id: '111-landing-check-route',
    surface: '1.1.1 landing page',
    path: paths.landing111,
    theme: 'light',
    size: { width: 1280, height: 760 },
    action: 'none',
    requirements: ['landing', 'advisory-check-link']
  },
  {
    id: '111-advisory-check-feedback',
    surface: '1.1.1 advisory Check route',
    path: paths.check111,
    theme: 'light',
    size: { width: 1280, height: 760 },
    action: 'exit-ticket-feedback',
    requirements: ['advisory-check', 'feedback', 'not-target-equivalent']
  },
  {
    id: '112-landing-math-route',
    surface: '1.1.2 landing page',
    path: paths.math112Landing,
    theme: 'light',
    size: { width: 1280, height: 760 },
    action: 'none',
    requirements: ['landing', 'math-link']
  },
  {
    id: '112-math-mobile-dark-feedback',
    surface: '1.1.2 Rekenen/math route',
    path: paths.math112,
    theme: 'dark',
    size: { width: 390, height: 844 },
    action: 'math-wrong-answer',
    requirements: ['math-task-shell', 'feedback', 'mobile', 'dark']
  },
  {
    id: '113-landing-graph-route',
    surface: '1.1.3 landing page',
    path: paths.graph113Landing,
    theme: 'light',
    size: { width: 1280, height: 760 },
    action: 'none',
    requirements: ['landing', 'graph-link']
  },
  {
    id: '113-graph-feedback',
    surface: '1.1.3 Grafieken route',
    path: paths.graph113,
    theme: 'dark',
    size: { width: 1280, height: 760 },
    action: 'graph-answer-first',
    requirements: ['graph-task-shell', 'feedback', 'dark']
  },
  {
    id: '111-reasoning-mobile-feedback',
    surface: 'reasoning route with shared task shell',
    path: paths.reasoning111,
    theme: 'light',
    size: { width: 390, height: 844 },
    action: 'reasoning-self-check',
    requirements: ['reasoning-task-shell', 'feedback', 'mobile']
  }
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
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
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

function pageUrl(serverPort, file) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(file);
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

async function runAction(cdp, sessionId, action) {
  if (action === 'none') return;
  if (action === 'exit-ticket-feedback') {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const option = document.querySelector('.et-option[data-task-id="schaarste-kern"][data-answer-id="a"]');
        if (option) option.click();
      })()`
    }, sessionId);
  }
  if (action === 'math-wrong-answer') {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-skill="A38"]');
        if (card) card.click();
      })()`
    }, sessionId);
    await sleep(700);
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('[data-skilltree-task-shell="MATH-UX-2"] [data-input-role="answer"]');
        if (input) input.value = '0';
        const button = document.querySelector('[data-action="check-task-shell"]');
        if (button) button.click();
      })()`
    }, sessionId);
  }
  if (action === 'graph-answer-first') {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const option = document.querySelector('.ts-choice[data-choice-id="b"]');
        if (option) option.click();
        const button = document.querySelector('#g-task-check-btn');
        if (button) button.click();
      })()`
    }, sessionId);
  }
  if (action === 'reasoning-self-check') {
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const mode = document.querySelector('[data-mode="5"]');
        if (mode) mode.click();
      })()`
    }, sessionId);
    await sleep(700);
    await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('[data-reasoning-task-shell="REASON-UX-2"] [data-input-role="answer"]');
        if (input) {
          input.value = 'Ik noem eerst de oorzaak, daarna de tussenstap en sluit af met de conclusie.';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = document.querySelector('#r-check-btn');
        if (button) button.click();
      })()`
    }, sessionId);
  }
  await sleep(700);
}

function assertCase(item, proof) {
  const text = `${proof.bodyText} ${proof.routeText} ${proof.shellText} ${proof.feedbackText}`.toLowerCase();
  const forbidden = [
    'je hebt bewezen dat je de eindopgave kunt',
    'mastery',
    'summatief',
    'automatisch door'
  ];
  const forbiddenHit = forbidden.find(term => text.includes(term));
  if (forbiddenHit) {
    throw new Error(`${item.id}: forbidden product/claim language found: ${forbiddenHit}`);
  }
  if (item.requirements.includes('advisory-check-link') && !text.includes('korte check')) {
    throw new Error(`${item.id}: missing Korte check link`);
  }
  if (item.requirements.includes('advisory-check')) {
    if (proof.exitTicketTitle !== 'Korte check') throw new Error(`${item.id}: short check title is not Korte check`);
    if (proof.targetReadinessEvidence !== false) throw new Error(`${item.id}: targetReadinessEvidence must be false`);
    if (!proof.feedbackText) throw new Error(`${item.id}: missing advisory-check feedback`);
  }
  if (item.requirements.includes('math-link') && !(text.includes('wiskunde') || text.includes('rekenen'))) {
    throw new Error(`${item.id}: missing math/rekenen route language`);
  }
  if (item.requirements.includes('graph-link') && !text.includes('grafiek')) {
    throw new Error(`${item.id}: missing graph route language`);
  }
  if (item.requirements.includes('math-task-shell') && (!proof.mathShell || !proof.taskFamily)) {
    throw new Error(`${item.id}: missing math task-shell proof`);
  }
  if (item.requirements.includes('graph-task-shell') && (!proof.graphShell || !proof.taskFamily)) {
    throw new Error(`${item.id}: missing graph task-shell proof`);
  }
  if (item.requirements.includes('reasoning-task-shell') && (!proof.reasoningShell || proof.taskFamily !== 'structured_reasoning')) {
    throw new Error(`${item.id}: missing structured reasoning task-shell proof`);
  }
  if (item.requirements.includes('feedback') && !proof.feedbackText && !proof.feedbackState) {
    throw new Error(`${item.id}: missing feedback proof`);
  }
}

function mdEscape(value) {
  return String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function toMarkdown(report) {
  const rows = report.cases.map(item => {
    const evidence = [
      item.requirements.includes('advisory-check-link') ? 'Korte check visible' : '',
      item.requirements.includes('math-link') ? 'Rekenen/math route visible' : '',
      item.requirements.includes('graph-link') ? 'Grafieken route visible' : '',
      item.proof.exitTicketTitle ? `title=${item.proof.exitTicketTitle}` : '',
      item.proof.targetReadinessEvidence === false ? 'targetReadinessEvidence=false' : '',
      item.proof.taskFamily ? `task=${item.proof.taskFamily}` : '',
      item.proof.feedbackState ? `feedback=${item.proof.feedbackState}` : ''
    ].filter(Boolean).join('; ');
    return `| ${item.id} | ${mdEscape(item.surface)} | ${item.theme} ${item.viewport.width}x${item.viewport.height} | PASS | ${mdEscape(evidence)} | \`${path.relative(platformRoot, item.screenshot).replace(/\\/g, '/')}\` |`;
  }).join('\n');

  return `# GATE-ENGINE-1 Live Output Inspection

Generated: ${report.generated_on}

Status: PASS. Minimum rendered-output inspection completed; no product
authority.

Reviewed remote commit/hash: \`${report.reviewed_remote_commit}\`

## Scope

This inspection served the checked-out Book 1 output locally and inspected the
minimum live surfaces named in the corrected GATE-ENGINE-1 review packet. It did
not regenerate lesson output and does not authorize implementation, target-
equivalent completion language, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or product use.

## Minimum Inspection Results

| Case | Surface | Viewport | Result | Evidence | Screenshot |
|---|---|---:|---|---|---|
${rows}

## Boundary Findings

- The \`1.1.1\` check renders as \`Korte check\`.
- \`1.1.1\` check metadata keeps \`targetReadinessEvidence: false\`.
- No inspected rendered surface used the forbidden proof phrase
  \`Je hebt bewezen dat je de eindopgave kunt\`.
- Math, graph, and reasoning feedback states rendered through the current
  task surfaces.
- The dark-mode requirement is covered by the math and graph task states.
- The mobile/narrow route-panel requirement is covered by math and reasoning
  task states.

## Operational Meaning

This satisfies the GATE-ENGINE-1 Q1 condition that live rendered output be
inspected before closure. It does not convert the advisory short check into a
target-equivalent exit ticket.
`;
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `gate-engine1-chrome-${Date.now()}`);
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

    const inspected = [];
    for (const item of cases) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: item.size.width,
        height: item.size.height,
        deviceScaleFactor: 1,
        mobile: item.size.width < 500
      }, sessionId);
      const url = pageUrl(serverPort, item.path);
      await cdp.send('Page.navigate', { url }, sessionId);
      await sleep(1200);
      await applyTheme(cdp, sessionId, item.theme);
      await runAction(cdp, sessionId, item.action);

      const proofResult = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const route = document.querySelector('.skill-map-route, .et-route-panel, [data-route-layer]');
          const mathShell = document.querySelector('[data-skilltree-task-shell="MATH-UX-2"]');
          const graphShell = document.querySelector('[data-graph-task-shell="GRAPH-UX-2"]');
          const reasoningShell = document.querySelector('[data-reasoning-task-shell="REASON-UX-2"]');
          const task = document.querySelector('.ts-task');
          const feedback = document.querySelector('.ts-feedback-card, .et-feedback.is-match, .et-feedback.is-retry, #r-feedback.r-show');
          const titleNode = document.querySelector('.et-hero h1, h1, title');
          return {
            title: document.title,
            bodyText: document.body ? document.body.innerText.replace(/\\s+/g, ' ').trim().slice(0, 2000) : '',
            routeText: route ? route.innerText.replace(/\\s+/g, ' ').trim() : '',
            shellText: (mathShell || graphShell || reasoningShell) ? (mathShell || graphShell || reasoningShell).innerText.replace(/\\s+/g, ' ').trim() : '',
            feedbackText: feedback ? feedback.innerText.replace(/\\s+/g, ' ').trim() : '',
            feedbackState: feedback ? (feedback.getAttribute('data-feedback-state') || feedback.className) : '',
            taskFamily: task ? task.getAttribute('data-task-family') : null,
            mathShell: Boolean(mathShell),
            graphShell: Boolean(graphShell),
            reasoningShell: Boolean(reasoningShell),
            exitTicketTitle: window.EXIT_TICKET_DATA ? window.EXIT_TICKET_DATA.title : null,
            targetReadinessEvidence: window.EXIT_TICKET_DATA && window.EXIT_TICKET_DATA.metadataAlignment ? window.EXIT_TICKET_DATA.metadataAlignment.targetReadinessEvidence : null,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) },
            heading: titleNode ? titleNode.textContent : ''
          };
        })()`,
        returnByValue: true
      }, sessionId);
      const proof = proofResult.result && proofResult.result.value;
      if (!proof) throw new Error(`${item.id}: missing proof object`);
      assertCase(item, proof);

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
      const screenshotPath = path.join(screenshotDir, `${item.id}.png`);
      await fsp.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
      inspected.push({
        id: item.id,
        surface: item.surface,
        url,
        source_path: item.path,
        theme: item.theme,
        action: item.action,
        requirements: item.requirements,
        viewport: proof.viewport,
        page: proof.page,
        proof,
        screenshot: screenshotPath
      });
    }

    const reviewedRemoteCommit = process.env.GATE_ENGINE1_REVIEWED_COMMIT || '';
    const report = {
      schema_version: 1,
      gate_id: 'GATE-ENGINE-1-four-engine-operational-integration',
      generated_on: '2026-05-31',
      status: 'pass_minimum_live_output_inspection',
      reviewed_remote_commit: reviewedRemoteCommit,
      book_root: bookRoot,
      browser: chromeExe,
      cases: inspected
    };
    await fsp.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8');
    await fsp.writeFile(mdPath, toMarkdown(report), 'utf8');
    console.log(`GATE-ENGINE-1 live output inspection PASS (${inspected.length} cases)`);
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
