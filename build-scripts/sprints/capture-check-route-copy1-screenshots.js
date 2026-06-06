#!/usr/bin/env node
/**
 * Capture CHECK-ROUTE-COPY-1 proof screenshots through Chromium CDP.
 *
 * Serves generated Book 1 output locally, opens the first-three paragraph
 * landing pages, scrolls to the Check section, and writes screenshots plus
 * reports/json/check-route-copy1-proof.json.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'CHECK-ROUTE-COPY-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.CHECK_ROUTE_COPY1_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const proofPath = path.join(platformRoot, 'reports', 'json', 'check-route-copy1-proof.json');
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

const pages = {
  '1.1.1': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/index.html',
  '1.1.2': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/index.html',
  '1.1.3': '1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/index.html',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rmWithRetry(target) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      await fsp.rm(target, { recursive: true, force: true });
      return;
    } catch (error) {
      if (!/EBUSY|EPERM|ENOTEMPTY/i.test(error.code || error.message || '')) throw error;
      await sleep(250 + attempt * 150);
    }
  }
  await fsp.rm(target, { recursive: true, force: true });
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

function pageUrl(serverPort, paragraphId) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(pages[paragraphId]);
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

async function navigate(cdp, sessionId, serverPort, paragraphId, size, theme = 'light') {
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
  await cdp.send('Page.navigate', { url: pageUrl(serverPort, paragraphId) }, sessionId);
  await sleep(700);
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
        localStorage.setItem('quizMode', ${JSON.stringify(theme)});
        const section = document.querySelector('#check');
        if (section) section.scrollIntoView({ block: 'start' });
      })()`,
    },
    sessionId
  );
  await sleep(350);
}

async function screenshot(cdp, sessionId, fileName) {
  const shot = await cdp.send(
    'Page.captureScreenshot',
    {
      format: 'png',
      captureBeyondViewport: false,
      fromSurface: true,
    },
    sessionId
  );
  const target = path.join(screenshotDir, fileName);
  await fsp.writeFile(target, Buffer.from(shot.data, 'base64'));
  return path.relative(platformRoot, target).replace(/\\/g, '/');
}

async function inspect(cdp, sessionId) {
  return evaluateJson(cdp, sessionId, `(() => {
    const section = document.querySelector('#check');
    const short = document.querySelector('[data-check-route="advisory"]');
    const exit = document.querySelector('[data-check-route="exit-ticket"]');
    const rect = section ? section.getBoundingClientRect() : null;
    const text = section ? section.innerText.replace(/\\s+/g, ' ').trim() : '';
    return {
      title: document.title,
      sectionVisible: !!rect && rect.top < window.innerHeight && rect.bottom > 0,
      checkText: text,
      shortCard: !!short,
      exitCard: !!exit,
      shortPurpose: short ? short.getAttribute('data-check-purpose') : null,
      exitPurpose: exit ? exit.getAttribute('data-check-purpose') : null,
      oldGenericCopy: /Kies wat je nog wilt oefenen|Maak de volledige paragraaf-check/i.test(text),
      forbiddenAuthority: /\\b(?:diagnostisch|diagnose|mastery|sequencing|summatief|cijfer|Scale Gate|PV|beheerst|bewezen|aangetoond)\\b/i.test(text),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      theme: document.documentElement.getAttribute('data-theme') || 'light'
    };
  })()`);
}

function assertCase(entry) {
  const text = entry.inspection.checkText || '';
  const normalized = text.toLowerCase();
  const ok = entry.inspection.sectionVisible &&
    entry.inspection.shortCard &&
    entry.inspection.exitCard &&
    entry.inspection.shortPurpose === 'local-practice-advice' &&
    entry.inspection.exitPurpose === 'end-check' &&
    normalized.includes('eerst oefenadvies, daarna eindcheck') &&
    normalized.includes('korte check') &&
    normalized.includes('advies') &&
    normalized.includes('krijg lokaal oefenadvies') &&
    normalized.includes('dit is geen eindcheck') &&
    normalized.includes('exit ticket') &&
    normalized.includes('eindcheck') &&
    normalized.includes('dezelfde soort denkstappen als de eindopgave') &&
    !entry.inspection.oldGenericCopy &&
    !entry.inspection.forbiddenAuthority;
  entry.status = ok ? 'PASS' : 'FAIL';
  return entry;
}

async function captureCase(cdp, sessionId, serverPort, config) {
  await navigate(cdp, sessionId, serverPort, config.paragraph, config.viewport, config.theme || 'light');
  const inspection = await inspect(cdp, sessionId);
  const screenshotPath = await screenshot(cdp, sessionId, `${config.id}.png`);
  return assertCase({
    id: config.id,
    paragraph: config.paragraph,
    status: 'PENDING',
    inspection,
    screenshot: screenshotPath,
  });
}

async function main() {
  if (!chromeExe) throw new Error('No Chrome or Edge executable found for screenshot capture');
  await fsp.mkdir(screenshotDir, { recursive: true });

  const serverPort = await findFreePort();
  const debugPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const userDataDir = path.join(platformRoot, '.tmp', `${sprintId.toLowerCase()}-chrome-${Date.now()}`);
  await rmWithRetry(userDataDir);
  await fsp.mkdir(userDataDir, { recursive: true });

  const chrome = spawn(chromeExe, [
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    const version = await waitForVersion(debugPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const cases = [];
    for (const paragraph of ['1.1.1', '1.1.2', '1.1.3']) {
      cases.push(await captureCase(cdp, sessionId, serverPort, {
        id: `desktop-${paragraph.replace(/\./g, '')}-check`,
        paragraph,
        viewport: { width: 1280, height: 900 },
        theme: 'light',
      }));
    }
    cases.push(await captureCase(cdp, sessionId, serverPort, {
      id: 'mobile-113-check',
      paragraph: '1.1.3',
      viewport: { width: 390, height: 760 },
      theme: 'light',
    }));
    cases.push(await captureCase(cdp, sessionId, serverPort, {
      id: 'mobile-dark-113-check',
      paragraph: '1.1.3',
      viewport: { width: 390, height: 760 },
      theme: 'dark',
    }));

    const complete = cases.every((entry) => entry.status === 'PASS');
    const proof = {
      schema_version: 1,
      sprint_id: sprintId,
      generated: new Date().toISOString(),
      status: complete ? 'complete' : 'failed',
      authority: {
        product_route_adoption_authorized: false,
        new_target_equivalent_completion_language_authorized: false,
        diagnostics_authorized: false,
        mastery_or_sequencing_authorized: false,
        pv_authorized: false,
        scale_gate_1_authorized: false,
        student_product_use_authorized: false,
      },
      proof: {
        first_three_landing_pages_checked: true,
        advisory_and_exit_cards_distinct: cases.every((entry) => entry.inspection.shortCard && entry.inspection.exitCard),
        old_generic_copy_absent: cases.every((entry) => !entry.inspection.oldGenericCopy),
        forbidden_authority_absent: cases.every((entry) => !entry.inspection.forbiddenAuthority),
        mobile_rendered: cases.some((entry) => entry.id === 'mobile-113-check' && entry.status === 'PASS'),
        dark_mode_rendered: cases.some((entry) => entry.id === 'mobile-dark-113-check' && entry.status === 'PASS'),
      },
      cases,
    };
    await fsp.writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);

    const manifest = {
      sprint_id: sprintId,
      generated: proof.generated,
      screenshots: cases.map((entry) => ({ id: entry.id, status: entry.status, path: entry.screenshot })),
    };
    await fsp.writeFile(manifestJsonPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await fsp.writeFile(
      manifestPath,
      [
        `# ${sprintId} Screenshot Manifest`,
        '',
        `Generated: ${proof.generated}`,
        '',
        ...cases.map((entry) => `- ${entry.id}: \`${entry.screenshot}\` (${entry.status})`),
        '',
      ].join('\n')
    );

    if (!complete) {
      throw new Error(`One or more route-copy screenshots failed: ${cases.filter((entry) => entry.status !== 'PASS').map((entry) => entry.id).join(', ')}`);
    }
    console.log(`wrote ${path.relative(platformRoot, proofPath)}`);
  } finally {
    if (!chrome.killed) chrome.kill();
    await new Promise((resolve) => {
      chrome.once('exit', resolve);
      setTimeout(resolve, 1500);
    });
    await new Promise((resolve) => server.close(resolve));
    await rmWithRetry(userDataDir);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
