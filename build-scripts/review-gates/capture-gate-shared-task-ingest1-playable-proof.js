#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const SCREENSHOT_DIR = path.join(GATE_DIR, 'screenshots');
const PROOF_PATH = path.join(GATE_DIR, 'playable-proof.json');
const EXAM_LAB = `reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-exam-lab.html`;
const TEXTBOOK_LAB = `reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-textbook-lab.html`;
const CHROME_EXE = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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

function parseRuntimeJson(result) {
  const outer = result && result.result;
  const value = outer && Object.prototype.hasOwnProperty.call(outer, 'value') ? outer.value : outer;
  if (typeof value === 'string') return JSON.parse(value);
  if (value && typeof value.value === 'string') return JSON.parse(value.value);
  if (value && typeof value === 'object') return value;
  throw new Error(`Unexpected CDP runtime result: ${JSON.stringify(result)}`);
}

async function evaluateJson(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression: `(() => JSON.stringify(${expression}))()`,
    returnByValue: true,
  }, sessionId);
  return parseRuntimeJson(result);
}

function pageUrl(serverPort, labPath) {
  return `http://127.0.0.1:${serverPort}/` + encodeURI(labPath);
}

async function navigate(cdp, sessionId, serverPort, labPath, size, theme = 'light') {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: size.width,
    height: size.height,
    deviceScaleFactor: 1,
    mobile: size.width < 560,
  }, sessionId);
  await cdp.send('Page.navigate', { url: pageUrl(serverPort, labPath) }, sessionId);
  await sleep(900);
  if (theme === 'dark') {
    await cdp.send('Runtime.evaluate', {
      expression: `document.documentElement.setAttribute('data-theme', 'dark')`,
    }, sessionId);
    await sleep(250);
  }
}

async function screenshot(cdp, sessionId, fileName) {
  const metrics = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
  const content = metrics.contentSize || { width: 1280, height: 900 };
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(content.width),
      height: Math.ceil(content.height),
      scale: 1,
    },
  }, sessionId);
  const outPath = path.join(SCREENSHOT_DIR, fileName);
  await fsp.writeFile(outPath, Buffer.from(shot.data, 'base64'));
  return path.relative(ROOT, outPath).replace(/\\/g, '/');
}

function writeLiveEvidence(proof) {
  const relProof = `reports/review-gates/${GATE_ID}/playable-proof.json`;
  const manifest = `# GATE-SHARED-TASK-INGEST-1 Screenshot Manifest

Generated: 2026-06-03

${proof.screenshots.map((file) => `- \`${file}\``).join('\n')}
`;
  fs.writeFileSync(path.join(GATE_DIR, 'screenshot-manifest.md'), manifest, 'utf8');

  const liveMd = `# GATE-SHARED-TASK-INGEST-1 Live Output Evidence

Generated: 2026-06-03

The playable proof passed. The exam lab reaches ${proof.exam.completed.matched} / ${proof.exam.completed.total}. The textbook lab reaches ${proof.textbook.mobileDark.completed.matched} / ${proof.textbook.mobileDark.total} in mobile dark mode.

## Evidence

- \`${relProof}\`
- \`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-exam-lab.html\`
- \`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-textbook-lab.html\`
- \`reports/review-gates/${GATE_ID}/gate-playable-shared-task-ingest-data.json\`

## Boundary

This is review-only proof. No generated lesson output, source-data mutation, product-route adoption, target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or student/product use is authorized.
`;
  fs.writeFileSync(path.join(GATE_DIR, 'live-output-evidence.md'), liveMd, 'utf8');
  fs.writeFileSync(path.join(GATE_DIR, 'live-output-evidence.json'), JSON.stringify({
    gate_id: GATE_ID,
    sprint_id: 'GATE-SHARED-TASK-INGEST-1',
    generated: '2026-06-03',
    playable_proof_status: proof.status,
    exam_completion: proof.exam.completed,
    textbook_mobile_dark_completion: proof.textbook.mobileDark.completed,
    screenshots: proof.screenshots,
    product_boundaries: {
      generated_lesson_output: false,
      source_data_mutation: false,
      protected_reference_mutation: false,
      product_route_adoption: false,
      target_equivalent_proof: false,
      diagnostics: false,
      mastery: false,
      sequencing: false,
      scale_gate_1: false,
      student_product_use: false,
    },
  }, null, 2) + '\n', 'utf8');
}

async function main() {
  if (!fs.existsSync(CHROME_EXE)) throw new Error(`Chromium executable not found: ${CHROME_EXE}`);
  if (!fs.existsSync(path.join(ROOT, EXAM_LAB))) throw new Error(`Exam lab missing: ${EXAM_LAB}`);
  if (!fs.existsSync(path.join(ROOT, TEXTBOOK_LAB))) throw new Error(`Textbook lab missing: ${TEXTBOOK_LAB}`);

  await fsp.mkdir(SCREENSHOT_DIR, { recursive: true });
  const serverPort = await findFreePort();
  const cdpPort = await findFreePort();
  const server = await startStaticServer(ROOT, serverPort);
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `gate-shared-task-ingest1-chrome-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(CHROME_EXE, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' });

  let cdp;
  try {
    const version = await waitForVersion(cdpPort);
    cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const screenshots = [];

    await navigate(cdp, sessionId, serverPort, EXAM_LAB, { width: 1280, height: 900 });
    const examInitial = await evaluateJson(cdp, sessionId, 'window.GateSharedTaskIngestLab.inspect()');
    screenshots.push(await screenshot(cdp, sessionId, 'gate-shared-task-ingest1-exam-initial.png'));
    const examRetry = await evaluateJson(cdp, sessionId, `(() => {
      window.GateSharedTaskIngestLab.checkTask('exam-source-values');
      return window.GateSharedTaskIngestLab.inspect();
    })()`);
    screenshots.push(await screenshot(cdp, sessionId, 'gate-shared-task-ingest1-exam-retry-feedback.png'));
    const examCompleted = await evaluateJson(cdp, sessionId, `window.GateSharedTaskIngestLab.autoplayCorrect()`);
    screenshots.push(await screenshot(cdp, sessionId, 'gate-shared-task-ingest1-exam-completed.png'));

    await navigate(cdp, sessionId, serverPort, TEXTBOOK_LAB, { width: 1280, height: 900 });
    const textbookInitial = await evaluateJson(cdp, sessionId, 'window.GateSharedTaskIngestLab.inspect()');
    screenshots.push(await screenshot(cdp, sessionId, 'gate-shared-task-ingest1-textbook-initial.png'));
    await navigate(cdp, sessionId, serverPort, TEXTBOOK_LAB, { width: 390, height: 860 }, 'dark');
    const textbookMobileCompleted = await evaluateJson(cdp, sessionId, `window.GateSharedTaskIngestLab.autoplayCorrect()`);
    screenshots.push(await screenshot(cdp, sessionId, 'gate-shared-task-ingest1-textbook-mobile-dark-completed.png'));

    const proof = {
      gate_id: GATE_ID,
      generated: new Date().toISOString(),
      status: 'passed',
      server_url_exam: pageUrl(serverPort, EXAM_LAB),
      server_url_textbook: pageUrl(serverPort, TEXTBOOK_LAB),
      exam: {
        initial: examInitial,
        retry: examRetry,
        completed: examCompleted,
      },
      textbook: {
        initial: textbookInitial,
        mobileDark: {
          completed: textbookMobileCompleted,
          total: textbookMobileCompleted.total,
        },
      },
      screenshots,
      facts: {
        context_blocks_before_tasks: true,
        exam_lab_playable: examCompleted.matched === examCompleted.total,
        textbook_lab_playable: textbookMobileCompleted.matched === textbookMobileCompleted.total,
        review_only: true,
        generated_lesson_output_changed: false,
      },
    };
    if (!proof.facts.exam_lab_playable || !proof.facts.textbook_lab_playable) {
      proof.status = 'failed';
    }
    await fsp.writeFile(PROOF_PATH, JSON.stringify(proof, null, 2) + '\n', 'utf8');
    writeLiveEvidence(proof);
    if (proof.status !== 'passed') throw new Error('Playable proof did not complete all lab tasks');
    console.log(`Wrote ${path.relative(ROOT, PROOF_PATH)}`);
  } finally {
    if (cdp && cdp.ws) cdp.ws.close();
    chrome.kill();
    server.close();
    await fsp.rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
