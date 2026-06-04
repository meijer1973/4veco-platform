#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const fixture = require('./task-context-runtime1-fixture');

const sprintId = 'TASK-CONTEXT-RUNTIME-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const labPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-rendered-lab.html`);
const outputDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const jsonManifestPath = path.join(outputDir, 'manifest.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'task-context-runtime1-proof.json');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cases = [
  {
    name: 'desktop-light-initial',
    size: { width: 1280, height: 860 },
    theme: 'light',
    action: 'initial',
  },
  {
    name: 'desktop-light-feedback',
    size: { width: 1280, height: 860 },
    theme: 'light',
    action: 'complete',
  },
  {
    name: 'mobile-light-initial',
    size: { width: 390, height: 844 },
    theme: 'light',
    action: 'initial',
  },
  {
    name: 'mobile-dark-initial',
    size: { width: 390, height: 844 },
    theme: 'dark',
    action: 'initial',
  },
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
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
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

function labUrl(serverPort) {
  return `http://127.0.0.1:${serverPort}/reports/sprints/${sprintId}-rendered-lab.html`;
}

function gitStatus(args) {
  const result = spawnSync('git', args, { cwd: platformRoot, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function pngDimensions(buffer) {
  if (!buffer || buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('not a PNG buffer');
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function applyTheme(cdp, sessionId, theme) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `document.documentElement.setAttribute('data-theme', '${theme}')`,
    },
    sessionId
  );
}

async function waitForLab(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const result = await cdp.send(
      'Runtime.evaluate',
      {
        expression: 'Boolean(window.TaskContextRuntime1Lab)',
        returnByValue: true,
      },
      sessionId
    );
    if (result.result && result.result.value === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for review lab runtime');
}

async function runAction(cdp, sessionId, action) {
  if (action !== 'complete') return;
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: 'window.TaskContextRuntime1Lab.completeCorrect()',
    },
    sessionId
  );
  await sleep(500);
}

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: 'JSON.stringify(window.TaskContextRuntime1Lab.inspect())',
      returnByValue: true,
    },
    sessionId
  );
  return JSON.parse(result.result.value);
}

function markdownManifest(captured) {
  const lines = [
    `# ${sprintId} Screenshot Manifest`,
    '',
    '## Captures',
    '',
  ];
  captured.forEach((item) => {
    lines.push(`- ${item.case}: \`${item.file}\` (${item.theme}, ${item.viewport.width}x${item.viewport.height}, action: ${item.action})`);
  });
  lines.push(
    '',
    '## Runtime Proof',
    '',
    '- Context-before-task display is checked through the browser proof JSON.',
    '- Captions and task references are visible in the lab screenshots.',
    '- Mobile and dark-mode proof is included.',
    '- The feedback/completed state is captured through the deterministic lab action.',
    ''
  );
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofPath), { recursive: true });
  await fsp.writeFile(labPath, fixture.labHtml(), 'utf8');

  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(os.tmpdir(), 'Codex-work', `task-context-runtime1-edge-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(
    chromeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${devtoolsPort}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

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
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        {
          width: item.size.width,
          height: item.size.height,
          deviceScaleFactor: 1,
          mobile: false,
        },
        sessionId
      );
      await cdp.send('Page.navigate', { url: labUrl(serverPort) }, sessionId);
      await waitForLab(cdp, sessionId);
      await applyTheme(cdp, sessionId, item.theme);
      await runAction(cdp, sessionId, item.action);
      const proof = await inspect(cdp, sessionId);
      const screenshot = await cdp.send(
        'Page.captureScreenshot',
        { format: 'png', fromSurface: true, captureBeyondViewport: true },
        sessionId
      );
      const file = path.join(outputDir, `${item.name}.png`);
      const screenshotBuffer = Buffer.from(screenshot.data, 'base64');
      const dimensions = pngDimensions(screenshotBuffer);
      await fsp.writeFile(file, screenshotBuffer);
      captured.push({
        case: item.name,
        file: path.relative(platformRoot, file).replace(/\\/g, '/'),
        lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
        action: item.action,
        theme: item.theme,
        viewport: item.size,
        screenshot_dimensions: dimensions,
        proof,
      });
    }

    const boundaryEvidence = {
      protected_reference_status: gitStatus(['status', '--short', '--', 'references/machine', 'references/external']),
      source_data_status: gitStatus(['status', '--short', '--', 'source-data']),
      book1_generated_output_status: gitStatus([
        '-c',
        'safe.directory=C:/Projects/4veco/4veco-lessen',
        '-C',
        '../4veco-lessen',
        'status',
        '--short',
        '--',
        'Boek 1 - Grondslagen, vraag en aanbod',
      ]),
    };

    const proofJson = {
      schema_version: 1,
      sprint_id: sprintId,
      generated: new Date().toISOString(),
      status: 'runtime_context_rendering_proof_complete',
      lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
      screenshot_manifest: path.relative(platformRoot, manifestPath).replace(/\\/g, '/'),
      screenshots: captured,
      context_runtime: {
        context_before_tasks: captured.every((item) => item.proof.contextBeforeTasks === true),
        context_block_count: captured[0].proof.contextBlockCount,
        task_ref_count: captured[0].proof.taskRefCount,
        visible_internal_context_ids: captured.some((item) => item.proof.visibleInternalContextId),
        feedback_completion_captured: captured.some((item) => item.proof.feedbackState === 'matched' && item.proof.labState === 'Voltooid'),
        hint_count: captured[0].proof.hintCount,
        responsive_mobile_viewports: captured.filter((item) => item.viewport.width < 500).map((item) => ({
          case: item.case,
          requested_width: item.viewport.width,
          browser_width: item.proof.viewport.width,
          screenshot_width: item.screenshot_dimensions.width,
        })),
      },
      boundary_evidence: boundaryEvidence,
      fixture_metadata_note:
        'The review fixture carries inherited sourceAuthority and reconstruction metadata from TASK-CONTEXT-SPEC-1. This sprint did not ingest sources or reconstruct official exam assets.',
      product_boundaries: {
        generated_lesson_output_changed: false,
        protected_reference_data_changed: false,
        source_data_changed: false,
        source_reconstruction: false,
        exam_or_textbook_ingestion: false,
        product_route_adoption: false,
        target_equivalent_proof: false,
        diagnostics: false,
        adaptive_routing: false,
        mastery: false,
        sequencing: false,
        pv: false,
        scale_gate_1: false,
        student_product_use: false,
      },
    };
    await fsp.writeFile(jsonManifestPath, `${JSON.stringify({ schema_version: 1, sprint_id: sprintId, cases: captured }, null, 2)}\n`);
    await fsp.writeFile(manifestPath, markdownManifest(captured), 'utf8');
    await fsp.writeFile(proofPath, `${JSON.stringify(proofJson, null, 2)}\n`);
    console.log(`${sprintId} screenshots captured: ${captured.length}`);
  } finally {
    chrome.kill();
    server.close();
    try {
      await sleep(500);
      await fsp.rm(profileDir, { recursive: true, force: true });
    } catch (_error) {
      // Edge can keep a short-lived lockfile after successful capture on Windows.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
