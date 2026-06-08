#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const TaskShellEngine = require('../../engines/task-shell-engine');
const TaskShellUI = require('../../engines/task-shell-ui');
const data = require('./mtu-ans-proof-impl1-a96-data');

const platformRoot = path.resolve(__dirname, '..', '..');
const sprintId = data.sprintId;
const labPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-rendered-lab.html`);
const outputDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const jsonManifestPath = path.join(outputDir, 'manifest.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'mtu-ans-proof-impl1-a96-proof.json');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cases = [
  { name: 'desktop-initial', action: 'initial', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-retry-feedback', action: 'final-answer-only', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-next-action', action: 'correct-next-action', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-completed', action: 'complete', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'mobile-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'light' },
  { name: 'mobile-dark-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'dark' }
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function labHtml() {
  TaskShellEngine.validateTaskSet(data.taskSet);
  const shell = TaskShellUI.renderStaticHtml(data.taskSet);
  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(sprintId)} A96 proof lab</title>
  <link rel="stylesheet" href="../../engines/task-shell.css">
  <style>
    :root { color-scheme: light; --proof-bg: #f7f9fb; --proof-panel: #ffffff; --proof-text: #16202a; --proof-line: #c8d2dc; --proof-accent: #166a5b; }
    [data-theme="dark"] { color-scheme: dark; --proof-bg: #101418; --proof-panel: #171d23; --proof-text: #eef4f8; --proof-line: #3a4652; --proof-accent: #5bc2a8; }
    body { margin: 0; background: var(--proof-bg); color: var(--proof-text); font: 16px/1.55 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .proof-layout { max-width: 1120px; margin: 0 auto; padding: 24px; }
    .proof-meta { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; align-items: start; margin-bottom: 20px; }
    .proof-meta h1 { margin: 0 0 8px; font-size: 1.8rem; letter-spacing: 0; }
    .proof-meta p { margin: 0; max-width: 70ch; }
    .proof-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .proof-badge { border: 1px solid var(--proof-line); padding: 4px 8px; border-radius: 6px; font-size: .86rem; background: var(--proof-panel); }
    .proof-controls { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0; }
    .proof-controls button, .proof-next button { border: 1px solid var(--proof-line); background: var(--proof-panel); color: var(--proof-text); border-radius: 6px; padding: 10px 12px; font: inherit; cursor: pointer; }
    .proof-controls button.primary, .proof-next button.primary { background: var(--proof-accent); border-color: var(--proof-accent); color: #fff; }
    .proof-next { margin-top: 18px; padding: 16px; border: 1px solid var(--proof-line); background: var(--proof-panel); border-radius: 8px; }
    .proof-next[hidden] { display: none; }
    .proof-shell { background: var(--proof-panel); border: 1px solid var(--proof-line); border-radius: 8px; padding: 18px; }
    .proof-completed { margin-top: 18px; padding: 16px; border: 1px solid var(--proof-line); border-radius: 8px; background: var(--proof-panel); }
    .proof-completed[hidden] { display: none; }
    .ts-shell { background: transparent; }
    .ts-context { margin-bottom: 16px; }
    @media (max-width: 640px) {
      .proof-layout { padding: 14px; }
      .proof-meta { grid-template-columns: 1fr; }
      .proof-meta h1 { font-size: 1.35rem; }
      .proof-shell { padding: 12px; }
    }
  </style>
</head>
<body data-a96-proof-lab="${escapeHtml(sprintId)}" data-proof-state="initial">
  <main class="proof-layout">
    <header class="proof-meta">
      <div>
        <h1>A96 route-specific answer-form proof</h1>
        <p>Review-only lab tied to reviewed 1.1.2 calculation work. It requires method, labelled substitution, intermediate work, final answer, notation, and a short contextual conclusion.</p>
        <div class="proof-badges" aria-label="Proof boundaries">
          <span class="proof-badge">route-specific</span>
          <span class="proof-badge">no GEN_A96</span>
          <span class="proof-badge">no generic route row</span>
          <span class="proof-badge">no product adoption</span>
        </div>
      </div>
      <button type="button" data-action="toggle-theme">Dark</button>
    </header>
    <section class="proof-shell" aria-label="Rendered shared task-shell proof">
      ${shell}
      <div class="proof-controls" aria-label="Proof controls">
        <button type="button" data-action="check-task">Check current answer</button>
        <button type="button" data-action="run-final-answer-only">Fill final-answer-only</button>
        <button type="button" class="primary" data-action="run-correct">Fill complete A96 answer</button>
        <button type="button" data-action="reset-task">Reset</button>
      </div>
      <aside class="proof-next" data-proof-next-action hidden>
        <strong>Next action</strong>
        <p>Feedback has accepted the full calculation answer form. The route link stays a review-lab next action, not product adoption.</p>
        <a class="ts-feedback-action" href="${escapeHtml(data.reviewedRoute.route_href)}">Open reviewed 1.1.2 rekenroute reference</a>
        <button type="button" class="primary" data-action="complete-proof">Mark proof complete</button>
      </aside>
      <section class="proof-completed" data-proof-completed hidden>
        <strong>Completed state</strong>
        <p>The proof path reached completion after the full A96 answer action matched.</p>
      </section>
    </section>
  </main>
  <script src="../../engines/task-shell-engine.js"></script>
  <script src="../../engines/task-shell-ui.js"></script>
  <script>
    window.__A96_TASK__ = ${safeJson(data.strictA96Task)};
    window.__A96_PASSING_RESPONSE__ = ${safeJson(data.passingResponse)};
    window.__A96_NEGATIVE_RESPONSES__ = ${safeJson(data.negativeResponses)};
    window.__A96_REQUIRED_PARTS__ = ${safeJson(data.requiredActionParts)};
    (function () {
      var task = window.__A96_TASK__;
      function input(role) {
        return document.querySelector('[data-task-id="' + task.id + '"][data-input-role="' + role + '"]');
      }
      function feedback() {
        return document.querySelector('[data-feedback-for="' + task.id + '"]');
      }
      function resizeWorkField() {
        var work = input('work');
        if (!work) return;
        work.style.height = 'auto';
        if (work.value) work.style.height = Math.max(work.scrollHeight, 180) + 'px';
      }
      function setValues(response) {
        input('work').value = response.work || '';
        input('final-answer').value = response.finalAnswer || '';
        input('unit-notation').value = response.unitNotation || '';
        resizeWorkField();
      }
      function setPanels(result) {
        var next = document.querySelector('[data-proof-next-action]');
        var completed = document.querySelector('[data-proof-completed]');
        next.hidden = !(result && result.matched === true);
        completed.hidden = true;
        document.body.setAttribute('data-proof-state', result && result.matched === true ? 'next-action' : 'retry-feedback');
      }
      function checkCurrent() {
        var response = window.TaskShellUI.collectCalculationResponse(document, task);
        var result = window.TaskShellEngine.evaluateTask(task, response);
        feedback().innerHTML = window.TaskShellUI.renderFeedback(result);
        window.__A96_LAST_RESULT__ = result;
        setPanels(result);
        return result;
      }
      function reset() {
        setValues({ work: '', finalAnswer: '', unitNotation: '' });
        feedback().innerHTML = '';
        document.querySelector('[data-proof-next-action]').hidden = true;
        document.querySelector('[data-proof-completed]').hidden = true;
        document.body.setAttribute('data-proof-state', 'initial');
      }
      window.__A96Proof = {
        runCase: function (name) {
          reset();
          if (name === 'correct') setValues(window.__A96_PASSING_RESPONSE__);
          else setValues(window.__A96_NEGATIVE_RESPONSES__[name] || {});
          return checkCurrent();
        },
        complete: function () {
          var result = window.__A96Proof.runCase('correct');
          if (result.matched === true) {
            document.querySelector('[data-proof-completed]').hidden = false;
            document.body.setAttribute('data-proof-state', 'completed');
          }
          return result;
        },
        reset: reset,
        checkCurrent: checkCurrent
      };
      document.addEventListener('click', function (event) {
        var action = event.target && event.target.getAttribute('data-action');
        if (!action) return;
        if (action === 'check-task') checkCurrent();
        if (action === 'run-final-answer-only') window.__A96Proof.runCase('finalAnswerOnly');
        if (action === 'run-correct') window.__A96Proof.runCase('correct');
        if (action === 'reset-task') reset();
        if (action === 'complete-proof') window.__A96Proof.complete();
        if (action === 'toggle-theme') {
          var nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          event.target.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
        }
      });
    })();
  </script>
</body>
</html>`;
}

function labUrl(serverPort) {
  return `http://127.0.0.1:${serverPort}/reports/sprints/${sprintId}-rendered-lab.html`;
}

function pngDimensions(buffer) {
  if (!buffer || buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('not a PNG buffer');
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

async function applyTheme(cdp, sessionId, theme) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', '${theme}');
        var toggle = document.querySelector('[data-action="toggle-theme"]');
        if (toggle) toggle.textContent = '${theme}' === 'dark' ? 'Light' : 'Dark';
      })()`
    },
    sessionId
  );
}

async function runAction(cdp, sessionId, action) {
  const actions = {
    initial: 'window.__A96Proof.reset();',
    'final-answer-only': "window.__A96Proof.runCase('finalAnswerOnly');",
    'correct-next-action': "window.__A96Proof.runCase('correct');",
    complete: 'window.__A96Proof.complete();'
  };
  const expression = actions[action] || actions.initial;
  await cdp.send('Runtime.evaluate', { expression: `(() => { ${expression} })()` }, sessionId);
  await sleep(500);
}

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => JSON.stringify({
        state: document.body.getAttribute('data-proof-state'),
        theme: document.documentElement.getAttribute('data-theme'),
        viewport: { width: window.innerWidth, height: window.innerHeight },
        taskFamily: document.querySelector('.ts-task[data-task-family]')?.getAttribute('data-task-family') || '',
        workFieldCount: document.querySelectorAll('[data-input-role="work"]').length,
        finalAnswerFieldCount: document.querySelectorAll('[data-input-role="final-answer"]').length,
        unitNotationFieldCount: document.querySelectorAll('[data-input-role="unit-notation"]').length,
        criteriaVisibleBeforeCheck: document.querySelectorAll('.ts-criteria').length > 0,
        feedbackState: document.querySelector('[data-feedback-state]')?.getAttribute('data-feedback-state') || '',
        feedbackText: document.querySelector('[data-feedback-for]')?.innerText || '',
        nextActionVisible: !document.querySelector('[data-proof-next-action]')?.hidden,
        completedVisible: !document.querySelector('[data-proof-completed]')?.hidden,
        requiredParts: window.__A96_REQUIRED_PARTS || [],
        lastMatched: window.__A96_LAST_RESULT__ ? window.__A96_LAST_RESULT__.matched : null,
        routeLinkCount: document.querySelectorAll('a[href*="wiskundevaardigheden"]').length,
        visibleInternalIdCount: (document.body.innerText.match(/\\b(?:A80|A81|A96|A97|A98|A99|GEN_A96)\\b/g) || []).length,
        overflowingCount: Array.from(document.querySelectorAll('body *')).filter(function (el) {
          var style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          return el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0;
        }).length
      }))()`,
      returnByValue: true
    },
    sessionId
  );
  const value = result.result && result.result.value;
  return typeof value === 'string' ? JSON.parse(value) : value;
}

function evaluationProof() {
  const cases = {};
  cases.passing = TaskShellEngine.evaluateTask(data.strictA96Task, data.passingResponse).matched === true;
  Object.entries(data.negativeResponses).forEach(([name, response]) => {
    cases[name] = TaskShellEngine.evaluateTask(data.strictA96Task, response).matched === true;
  });
  return cases;
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  await fsp.mkdir(path.dirname(labPath), { recursive: true });
  await fsp.mkdir(path.dirname(proofPath), { recursive: true });
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.writeFile(labPath, labHtml());

  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(os.tmpdir(), 'Codex-work', `mtu-ans-proof-impl1-edge-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(
    chromeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--remote-debugging-port=${devtoolsPort}`,
      `--user-data-dir=${profileDir}`,
      'about:blank'
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

    const manifestCases = [];
    for (const item of cases) {
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        {
          width: item.size.width,
          height: item.size.height,
          deviceScaleFactor: 1,
          mobile: item.size.width < 500
        },
        sessionId
      );
      await cdp.send('Page.navigate', { url: labUrl(serverPort) }, sessionId);
      await sleep(900);
      await applyTheme(cdp, sessionId, item.theme);
      await runAction(cdp, sessionId, item.action);
      const proof = await inspect(cdp, sessionId);
      const screenshot = await cdp.send(
        'Page.captureScreenshot',
        { format: 'png', fromSurface: true, captureBeyondViewport: true },
        sessionId
      );
      const file = path.join(outputDir, `${item.name}.png`);
      const buffer = Buffer.from(screenshot.data, 'base64');
      await fsp.writeFile(file, buffer);
      manifestCases.push({
        case: item.name,
        file: path.relative(platformRoot, file).replace(/\\/g, '/'),
        lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
        action: item.action,
        theme: item.theme,
        viewport: item.size,
        screenshot_dimensions: pngDimensions(buffer),
        proof
      });
    }

    const manifest = {
      schema_version: 1,
      sprint_id: sprintId,
      generated: new Date().toISOString(),
      cases: manifestCases
    };
    await fsp.writeFile(jsonManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const proof = {
      schema_version: 1,
      sprint_id: sprintId,
      generated: manifest.generated,
      status: 'route_specific_a96_proof_captured',
      lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
      screenshot_manifest: path.relative(platformRoot, manifestPath).replace(/\\/g, '/'),
      screenshot_manifest_json: path.relative(platformRoot, jsonManifestPath).replace(/\\/g, '/'),
      reviewed_route: data.reviewedRoute,
      answer_form_unit: 'A96',
      required_action_parts: data.requiredActionParts,
      source_task: {
        source_file: data.reviewedRoute.source_file,
        source_task_id: data.sourceTaskId,
        prompt_matches_reviewed_source: data.strictA96Task.prompt === data.sourceTask.prompt
      },
      checker_cases: evaluationProof(),
      screenshots: manifestCases,
      non_regression: {
        a96_generic_route_exposure: false,
        gen_a96_implemented: false,
        a81_standalone_pass_allowed: false,
        a99_unblocked: false
      },
      product_boundaries: {
        route_specific_lab_proof: true,
        generated_lesson_output_changed: false,
        protected_reference_data_changed: false,
        source_data_changed: false,
        product_route_adoption: false,
        target_equivalent_claim: false,
        diagnostics: false,
        mastery: false,
        sequencing: false,
        pv_projection: false,
        scale_gate_1: false,
        student_product_use: false
      }
    };
    await fsp.writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);

    await fsp.writeFile(
      manifestPath,
      `# ${sprintId} Screenshot Manifest

Generated: ${manifest.generated}

Rendered lab: \`${proof.lab}\`

This is review-only rendered proof for the bounded A96 route-specific answer
form lab. It is not generated lesson output and does not authorize product
route adoption.

## Cases

| Case | Theme | Viewport | State proof | File |
|---|---|---|---|---|
${manifestCases
  .map((item) => `| ${item.case} | ${item.theme} | ${item.viewport.width}x${item.viewport.height} | ${item.proof.state} | \`${item.file}\` |`)
  .join('\n')}
`
    );

    console.log(`${sprintId} screenshots captured: ${manifestCases.length}`);
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
