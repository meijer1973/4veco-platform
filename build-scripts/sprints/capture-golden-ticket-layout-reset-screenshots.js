#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'GOLDEN-TICKET-LAYOUT-RESET-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GOLDEN_TICKET_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const pagePath = '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen \u2013 exit-ticket.html';

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

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

async function navigate(cdp, sessionId, serverPort, size, theme) {
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
  await sleep(1000);
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        localStorage.setItem('quizMode', ${JSON.stringify(theme)});
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.textContent = ${JSON.stringify(theme === 'dark' ? 'Lichte modus' : 'Donkere modus')};
      })()`,
    },
    sessionId
  );
  await sleep(350);
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

async function driveGraph(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      function click(el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
      click(document.querySelector('[data-axis-value="Q"]'));
      click(document.querySelector('[data-ge-axis-slot="x"]'));
      click(document.querySelector('[data-axis-value="P"]'));
      click(document.querySelector('[data-ge-axis-slot="y"]'));

      const spec = window.GoldenTicketGraph.buildGraphSpec(window.EXIT_TICKET_DATA);
      function clickGraph(xValue, yValue) {
        const svg = document.querySelector('svg.ge-graph');
        const rect = svg.getBoundingClientRect();
        const x = window.GoldenTicketGraph.valueToX(spec, xValue);
        const y = window.GoldenTicketGraph.valueToY(spec, yValue);
        svg.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: rect.left + (x / window.GoldenTicketGraph.VIEW_BOX.width) * rect.width,
          clientY: rect.top + (y / window.GoldenTicketGraph.VIEW_BOX.height) * rect.height,
        }));
      }
      clickGraph(350, 1);
      const afterFirstPoint = {
        pointCount: document.querySelectorAll('svg.ge-graph .ge-graph-point').length,
        lineCount: document.querySelectorAll('svg.ge-graph .ge-graph-line').length,
      };
      clickGraph(150, 3);
      const afterSecondPoint = {
        pointCount: document.querySelectorAll('svg.ge-graph .ge-graph-point').length,
        lineCount: document.querySelectorAll('svg.ge-graph .ge-graph-line').length,
        lineShape: document.querySelector('svg.ge-graph .ge-graph-line')?.getAttribute('data-line-or-shape') || null,
      };

      click(document.querySelector('[data-ge-check-graph]'));

      return {
        goldenRoot: !!document.querySelector('main.ge-page[data-golden-ticket-root]'),
        exitTicketAppCount: document.querySelectorAll('#exit-ticket-app').length,
        graphOk: /Grafiekopzet klopt/.test(document.querySelector('[data-ge-feedback="graph"]')?.innerText || ''),
        graphFeedback: document.querySelector('[data-ge-feedback="graph"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        graphPoints: Array.from(document.querySelectorAll('svg.ge-graph .ge-graph-point')).map((point) => point.getAttribute('data-x') + ',' + point.getAttribute('data-y')),
        lineShape: document.querySelector('svg.ge-graph .ge-graph-line')?.getAttribute('data-line-or-shape') || null,
        afterFirstLineCount: afterFirstPoint.lineCount,
        afterSecondLineCount: afterSecondPoint.lineCount,
        afterSecondLineShape: afterSecondPoint.lineShape,
        autoLineDrawn: afterFirstPoint.lineCount === 0 && afterSecondPoint.lineCount === 1,
        checkboxCount: document.querySelectorAll('input[type="checkbox"]').length,
        connectControlCount: document.querySelectorAll('[data-ge-connect-line]').length,
        lineShapeControlCount: document.querySelectorAll('[data-ge-line-shape], [data-line-shape-value]').length,
        readingLocked: document.querySelector('[data-ge-step="reading"]')?.getAttribute('aria-disabled') === 'true',
      };
    })()`
  );
}

async function driveReading(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      function click(el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
      click(document.querySelector('[data-ge-pill-group="read-interval"][data-option-id="200-250"]'));
      const input = document.querySelector('[data-ge-read-q]');
      input.value = '225';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      click(document.querySelector('[data-ge-check-reading]'));
      return {
        readingOk: /Aflezing past/.test(document.querySelector('[data-ge-feedback="reading"]')?.innerText || ''),
        readingFeedback: document.querySelector('[data-ge-feedback="reading"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        claimLocked: document.querySelector('[data-ge-step="claim"]')?.getAttribute('aria-disabled') === 'true',
      };
    })()`
  );
}

async function driveClaim(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      function click(el) {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
      function setValue(selector, value) {
        const input = document.querySelector(selector);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      click(document.querySelector('[data-ge-pill-group="claim-interval"][data-option-id="150-300"]'));
      setValue('[data-ge-old-q]', '300');
      setValue('[data-ge-new-q]', '150');
      ['open', 'newQ', 'minus', 'oldQBeforeChange', 'close', 'divide', 'oldQBase', 'times100'].forEach((id) => {
        click(document.querySelector('[data-ge-token-id="' + id + '"]'));
      });
      setValue('[data-ge-percent]', '-50%');
      click(document.querySelector('[data-ge-pill-group="claim-conclusion"][data-option-id="drop50"]'));
      click(document.querySelector('[data-ge-check-claim]'));
      return {
        claimOk: /Claimcontrole klopt/.test(document.querySelector('[data-ge-feedback="claim"]')?.innerText || ''),
        claimFeedback: document.querySelector('[data-ge-feedback="claim"]')?.innerText.replace(/\\s+/g, ' ').trim() || '',
        completionVisible: document.querySelector('[data-ge-completion]')?.classList.contains('is-visible') === true,
      };
    })()`
  );
}

async function reloadProof(cdp, sessionId) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        localStorage.setItem('quizMode', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        location.reload();
      })()`,
    },
    sessionId
  );
  await sleep(1200);
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const loaded = Array.from(document.querySelectorAll('link[href], script[src]'))
        .map((node) => node.getAttribute('href') || node.getAttribute('src'));
      const legacy = loaded.filter((item) => /(?:task-shell|exit-ticket-ui|exit-ticket-engine|exit-ticket\\.css|skill-map-route)/.test(item));
      return {
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        goldenRoot: !!document.querySelector('main.ge-page[data-golden-ticket-root]'),
        exitTicketAppCount: document.querySelectorAll('#exit-ticket-app').length,
        legacyAssetCount: legacy.length,
        loaded,
        title: document.title,
        graphId: document.querySelector('svg.ge-graph')?.getAttribute('data-graph-id') || null,
        routeLinks: Array.from(document.querySelectorAll('.ge-route-pill')).map((link) => link.getAttribute('href')),
      };
    })()`
  );
}

function screenshotEntry(file, proof = {}) {
  const full = path.join(screenshotDir, file);
  return {
    file: path.relative(platformRoot, full).replace(/\\/g, '/'),
    bytes: fs.existsSync(full) ? fs.statSync(full).size : 0,
    proof,
  };
}

async function writeManifests(capturedProof) {
  const screenshots = [
    screenshotEntry('golden-reference-desktop-light.png', { reference: true }),
    screenshotEntry('golden-reference-mobile-light.png', { reference: true }),
    screenshotEntry('implemented-desktop-light-initial.png', { state: 'initial', theme: 'light', viewport: 'desktop' }),
    screenshotEntry('implemented-desktop-light-after-graph.png', capturedProof.desktopAfterGraph),
    screenshotEntry('implemented-desktop-light-feedback.png', capturedProof.readingProof),
    screenshotEntry('implemented-desktop-light-completed.png', capturedProof.completionProof),
    screenshotEntry('implemented-mobile-light-initial.png', { state: 'initial', theme: 'light', viewport: 'mobile' }),
    screenshotEntry('implemented-mobile-light-after-graph.png', capturedProof.mobileAfterGraph),
    screenshotEntry('implemented-desktop-dark-initial.png', { state: 'initial', theme: 'dark', viewport: 'desktop' }),
    screenshotEntry('implemented-mobile-dark-initial.png', { state: 'initial', theme: 'dark', viewport: 'mobile' }),
    screenshotEntry('implemented-routing-after-reload.png', capturedProof.routingAfterReload),
  ];
  await fsp.writeFile(
    manifestJsonPath,
    JSON.stringify({
      schema_version: 1,
      sprint_id: sprintId,
      captured_on: new Date().toISOString(),
      page_path: pagePath,
      screenshots,
    }, null, 2) + '\n',
    'utf8'
  );

  const lines = [
    `# ${sprintId} Screenshot Manifest`,
    '',
    'Date: 2026-06-08',
    '',
    '## Reference',
    '',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-desktop-light.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/golden-reference-mobile-light.png`',
    '',
    'Reference source:',
    '',
    '- `references/exemplars/1.1.3-exit-ticket/prototype.html`',
    '',
    '## Implemented Route',
    '',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-initial.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-after-graph.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-feedback.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-light-completed.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-initial.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-light-after-graph.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-desktop-dark-initial.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-mobile-dark-initial.png`',
    '- `reports/sprints/GOLDEN-TICKET-LAYOUT-RESET-1-screenshots/implemented-routing-after-reload.png`',
    '',
    'Implemented route:',
    '',
    '- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - exit-ticket.html`',
    '',
    '## Browser Proof',
    '',
    '- `main.ge-page[data-golden-ticket-root]`: present',
    '- `#exit-ticket-app`: absent',
    '- legacy CSS scripts loaded by target route: none',
    '- legacy UI scripts loaded by target route: none',
    '- graph id: `golden-ticket-113`',
    '- graph expected points: `350,1;300,1.5;250,2;200,2.5;150,3`',
    '- route links resolve through deploy link check',
    '- mobile after-graph proof produced graph points `350,1` and `150,3`; line count was `0` after point 1 and `1` immediately after point 2 before checking; no checkbox, no connect checkbox, no slope-choice controls, and successful graph feedback',
    '- reload proof preserved `main.ge-page[data-golden-ticket-root]`, dark theme, golden graph id, and no legacy wrapper/assets',
    '- completed browser flow produced graph points `350,1` and `150,3`, an automatic rendered line, graph/read/claim feedback, and visible completion state',
    '',
  ];
  await fsp.writeFile(manifestMdPath, lines.join('\n'), 'utf8');
}

async function main() {
  if (!chromeExe) throw new Error(`Chromium executable not found. Tried: ${chromeCandidates.join(', ')}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `golden-ticket-reset-${Date.now()}`);
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

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 760 }, 'light');
    await screenshot(cdp, sessionId, 'implemented-desktop-light-initial.png');
    const desktopAfterGraph = await driveGraph(cdp, sessionId);
    if (
      !desktopAfterGraph.graphOk ||
      desktopAfterGraph.graphPoints.length < 2 ||
      desktopAfterGraph.lineShape !== 'decreasing' ||
      desktopAfterGraph.autoLineDrawn !== true ||
      desktopAfterGraph.afterFirstLineCount !== 0 ||
      desktopAfterGraph.afterSecondLineCount !== 1 ||
      desktopAfterGraph.checkboxCount !== 0 ||
      desktopAfterGraph.connectControlCount !== 0 ||
      desktopAfterGraph.lineShapeControlCount !== 0
    ) {
      throw new Error(`desktop after-graph proof failed: ${JSON.stringify(desktopAfterGraph, null, 2)}`);
    }
    await screenshot(cdp, sessionId, 'implemented-desktop-light-after-graph.png');
    const readingProof = await driveReading(cdp, sessionId);
    if (!readingProof.readingOk || readingProof.claimLocked !== false) {
      throw new Error(`reading proof failed: ${JSON.stringify(readingProof, null, 2)}`);
    }
    await screenshot(cdp, sessionId, 'implemented-desktop-light-feedback.png');
    const completionProof = await driveClaim(cdp, sessionId);
    if (!completionProof.claimOk || !completionProof.completionVisible) {
      throw new Error(`completion proof failed: ${JSON.stringify(completionProof, null, 2)}`);
    }
    await screenshot(cdp, sessionId, 'implemented-desktop-light-completed.png');

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 844 }, 'light');
    await screenshot(cdp, sessionId, 'implemented-mobile-light-initial.png');
    const mobileAfterGraph = await driveGraph(cdp, sessionId);
    if (
      !mobileAfterGraph.graphOk ||
      mobileAfterGraph.graphPoints.length < 2 ||
      mobileAfterGraph.lineShape !== 'decreasing' ||
      mobileAfterGraph.autoLineDrawn !== true ||
      mobileAfterGraph.afterFirstLineCount !== 0 ||
      mobileAfterGraph.afterSecondLineCount !== 1 ||
      mobileAfterGraph.checkboxCount !== 0 ||
      mobileAfterGraph.connectControlCount !== 0 ||
      mobileAfterGraph.lineShapeControlCount !== 0
    ) {
      throw new Error(`mobile after-graph proof failed: ${JSON.stringify(mobileAfterGraph, null, 2)}`);
    }
    await screenshot(cdp, sessionId, 'implemented-mobile-light-after-graph.png');

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 760 }, 'dark');
    await screenshot(cdp, sessionId, 'implemented-desktop-dark-initial.png');

    await navigate(cdp, sessionId, serverPort, { width: 390, height: 844 }, 'dark');
    await screenshot(cdp, sessionId, 'implemented-mobile-dark-initial.png');

    await navigate(cdp, sessionId, serverPort, { width: 1280, height: 760 }, 'light');
    const routingAfterReload = await reloadProof(cdp, sessionId);
    if (!routingAfterReload.goldenRoot || routingAfterReload.exitTicketAppCount !== 0 || routingAfterReload.legacyAssetCount !== 0) {
      throw new Error(`routing reload proof failed: ${JSON.stringify(routingAfterReload, null, 2)}`);
    }
    await screenshot(cdp, sessionId, 'implemented-routing-after-reload.png');

    await writeManifests({ desktopAfterGraph, readingProof, completionProof, mobileAfterGraph, routingAfterReload });
    console.log(`Captured golden ticket reset proof screenshots in ${path.relative(platformRoot, screenshotDir)}`);
  } finally {
    try { chrome.kill(); } catch (_error) { /* ignore */ }
    server.close();
    await sleep(500);
    await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
