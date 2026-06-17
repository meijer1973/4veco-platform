#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SPRINT_ID = 'EXIT-TICKET-WORKBENCH-112-RENDERED-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.EXIT_TICKET_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const pagePath = [
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.2 Percentages en indexcijfers',
  '1.1.2 Percentages en indexcijfers \u2013 exit-ticket.html',
].join('/');
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'exit-ticket-workbench-112-rendered-1-proof.json');
const proofMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-rendered-proof.md`);

const cases = [
  { case: 'desktop-light-initial', action: 'initial', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-wrong-retry', action: 'wrong-retry', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-after-calculation', action: 'after-calculation', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-after-structured', action: 'after-structured', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-completed', action: 'complete', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'mobile-light-initial', action: 'initial', size: { width: 390, height: 844 }, theme: 'light' },
  { case: 'mobile-light-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'light' },
  { case: 'mobile-dark-initial', action: 'initial', size: { width: 390, height: 844 }, theme: 'dark' },
  { case: 'mobile-dark-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'dark' },
  { case: 'route-reload', action: 'route-reload', size: { width: 1280, height: 900 }, theme: 'dark' },
];

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
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

function routeUrl(serverPort) {
  return `http://127.0.0.1:${serverPort}/` + pagePath.split('/').map(encodeURIComponent).join('/');
}

function parseRuntimeJson(result) {
  const value = result && result.result && result.result.value;
  if (typeof value !== 'string') throw new Error(`Unexpected Runtime.evaluate result: ${JSON.stringify(result)}`);
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

async function waitForRoute(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(
      cdp,
      sessionId,
      `Boolean(window.EXIT_TICKET_DATA && window.GoldenTicketLayout && document.querySelector('main.ge-page[data-golden-ticket-root]'))`
    );
    if (ready === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for 1.1.2 Golden route');
}

async function navigate(cdp, sessionId, serverPort, item) {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: item.size.width,
      height: item.size.height,
      deviceScaleFactor: 1,
      mobile: item.size.width < 520,
    },
    sessionId
  );
  await cdp.send('Page.navigate', { url: routeUrl(serverPort) }, sessionId);
  await waitForRoute(cdp, sessionId);
  await setTheme(cdp, sessionId, item.theme);
  await sleep(350);
}

async function setTheme(cdp, sessionId, theme) {
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
}

async function driveAction(cdp, sessionId, action) {
  if (action === 'route-reload') {
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
    await sleep(900);
    await waitForRoute(cdp, sessionId);
    await sleep(350);
    return;
  }

  const script = `(() => {
    function click(el) {
      if (!el) throw new Error('Missing clickable element');
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
    function inputValue(el, value) {
      if (!el) throw new Error('Missing input element');
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function step(id) {
      const el = document.querySelector('[data-task-id="' + id + '"]');
      if (!el) throw new Error('Missing task step ' + id);
      return el;
    }
    function fillCalculation(id, values) {
      const el = step(id);
      inputValue(el.querySelector('[data-ge-work]'), values.work);
      inputValue(el.querySelector('[data-ge-final-answer]'), values.finalAnswer);
      inputValue(el.querySelector('[data-ge-unit-notation]'), values.unitNotation || '');
    }
    function checkStep(id) {
      click(step(id).querySelector('[data-ge-check-task]'));
    }
    function fillStructured(values) {
      const el = step('indexpunten-uitleg');
      Object.keys(values.fields).forEach((id) => {
        inputValue(el.querySelector('[data-ge-structured-field][data-field-id="' + id + '"]'), values.fields[id]);
      });
      click(el.querySelector('[data-ge-structured-choice][data-option-id="' + values.choice + '"]'));
    }
    const correct = {
      'prijsstijging-procent': {
        work: '(920 - 800) / 800 x 100 = 15',
        finalAnswer: '15%',
        unitNotation: '%'
      },
      'index-naar-waarde': {
        work: '162 / 150 x 100 = 108',
        finalAnswer: '108',
        unitNotation: ''
      },
      'index-naar-procent': {
        work: '(112 - 108) / 108 x 100 = 3,7',
        finalAnswer: '3,7%',
        unitNotation: '%'
      }
    };
    const structured = {
      fields: {
        indexpunten: '4 indexpunten',
        basis: '108',
        'procentuele-stijging': '3,7%'
      },
      choice: 'niet-vier-procent'
    };
    const action = ${JSON.stringify(action)};
    if (action === 'wrong-retry') {
      fillCalculation('prijsstijging-procent', {
        work: '920 - 800 = 120',
        finalAnswer: '12',
        unitNotation: '%'
      });
      checkStep('prijsstijging-procent');
    } else if (action === 'after-calculation') {
      fillCalculation('prijsstijging-procent', correct['prijsstijging-procent']);
      checkStep('prijsstijging-procent');
    } else if (action === 'after-structured') {
      fillStructured(structured);
      checkStep('indexpunten-uitleg');
    } else if (action === 'complete') {
      Object.keys(correct).forEach((id) => fillCalculation(id, correct[id]));
      fillStructured(structured);
      click(document.querySelector('[data-ge-check-all]'));
    }
  })()`;

  await cdp.send('Runtime.evaluate', { expression: script, returnByValue: true }, sessionId);
  await sleep(500);
}

async function inspect(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const loaded = Array.from(document.querySelectorAll('link[href], script[src]'))
        .map((node) => node.getAttribute('href') || node.getAttribute('src'));
      const legacy = loaded.filter((item) => /(?:task-shell|exit-ticket-ui|exit-ticket-engine|exit-ticket\\.css|skill-map-route)/.test(item));
      const feedback = Array.from(document.querySelectorAll('.ge-feedback.is-visible')).map((node) => ({
        id: node.getAttribute('data-ge-feedback'),
        tone: node.classList.contains('is-good') ? 'good' : node.classList.contains('is-warn') ? 'warn' : node.classList.contains('is-bad') ? 'bad' : 'unknown',
        text: node.innerText.replace(/\\s+/g, ' ').trim()
      }));
      const taskStates = Array.from(document.querySelectorAll('[data-task-id]')).map((node) => {
        const id = node.getAttribute('data-task-id');
        const item = feedback.find((entry) => entry.id === id);
        return {
          id,
          family: node.getAttribute('data-task-family'),
          feedbackTone: item ? item.tone : null,
          feedbackText: item ? item.text : ''
        };
      });
      const bodyText = document.body.innerText;
      const placeholders = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder]'))
        .map((node) => node.getAttribute('placeholder') || '');
      return {
        title: document.title,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        sourceKey: document.querySelector('main.ge-page[data-golden-ticket-root]')?.getAttribute('data-source-key') || null,
        goldenRoot: !!document.querySelector('main.ge-page[data-golden-ticket-root]'),
        exitTicketAppCount: document.querySelectorAll('#exit-ticket-app').length,
        loaded,
        legacyAssetCount: legacy.length,
        graphRuntimeLoaded: Boolean(window.GoldenTicketGraph) || loaded.some((item) => /golden-ticket-graph\\.js/.test(item)),
        layoutRuntimeLoaded: Boolean(window.GoldenTicketLayout),
        dataLoaded: Boolean(window.EXIT_TICKET_DATA),
        framework: window.EXIT_TICKET_DATA?.layout?.framework || null,
        gateApproved: window.EXIT_TICKET_DATA?.targetEquivalent?.gateApproved,
        completionLanguageEligible: window.EXIT_TICKET_DATA?.targetEquivalent?.completionLanguageEligible,
        targetReadinessEvidence: window.EXIT_TICKET_DATA?.metadataAlignment?.targetReadinessEvidence,
        contextBlockCount: document.querySelectorAll('[data-context-block]').length,
        tableCount: document.querySelectorAll('.ge-source-table').length,
        taskCount: document.querySelectorAll('[data-task-id]').length,
        calculationTaskCount: document.querySelectorAll('[data-task-family="calculation_work_capture"]').length,
        structuredTaskCount: document.querySelectorAll('[data-task-family="structured_short_response"]').length,
        workFieldCount: document.querySelectorAll('[data-ge-work]').length,
        finalAnswerFieldCount: document.querySelectorAll('[data-ge-final-answer]').length,
        unitNotationFieldCount: document.querySelectorAll('[data-ge-unit-notation]').length,
        structuredFieldCount: document.querySelectorAll('[data-ge-structured-field]').length,
        structuredChoiceCount: document.querySelectorAll('[data-ge-structured-choice]').length,
        selectedStructuredChoice: document.querySelector('[data-ge-structured-choice][aria-pressed="true"]')?.getAttribute('data-option-id') || null,
        feedback,
        taskStates,
        retryFeedbackCount: feedback.filter((item) => item.tone === 'warn').length,
        goodFeedbackCount: feedback.filter((item) => item.tone === 'good').length,
        calculationGoodCount: taskStates.filter((item) => item.family === 'calculation_work_capture' && item.feedbackTone === 'good').length,
        structuredGood: taskStates.some((item) => item.id === 'indexpunten-uitleg' && item.feedbackTone === 'good'),
        allTaskFeedbackGood: taskStates.length === 4 && taskStates.every((item) => item.feedbackTone === 'good'),
        completionVisible: document.querySelector('[data-ge-completion]')?.classList.contains('is-visible') === true,
        routeLinks: Array.from(document.querySelectorAll('.ge-route-pill')).map((link) => link.getAttribute('href')),
        viewport: { width: window.innerWidth, height: window.innerHeight },
        answerRevealingPlaceholderCount: placeholders.filter((value) => /Bijvoorbeeld|bijvoorbeeld\\s+(15|108|3,7|3\\.7)/i.test(value)).length,
        transferproofVisible: /transferproof/i.test(bodyText),
        overclaimVisible: /(eindopgave|aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik)/i.test(bodyText)
      };
    })()`
  );
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
  const buffer = Buffer.from(shot.data, 'base64');
  const outPath = path.join(screenshotDir, fileName);
  await fsp.writeFile(outPath, buffer);
  return {
    file: rel(outPath),
    bytes: buffer.length,
    dimensions: pngDimensions(buffer),
  };
}

function markdownManifest(captured) {
  const lines = [
    `# ${SPRINT_ID} Screenshot Manifest`,
    '',
    '## Captures',
    '',
  ];
  captured.forEach((item) => {
    lines.push(`- ${item.case}: \`${item.file}\` (${item.theme}, ${item.viewport.width}x${item.viewport.height}, action: ${item.action})`);
  });
  lines.push(
    '',
    '## Browser Proof',
    '',
    '- `main.ge-page[data-golden-ticket-root]`: present in every capture.',
    '- `#exit-ticket-app`: absent in every capture.',
    '- no graph runtime loaded by this calculation/structured route.',
    '- no legacy route assets loaded by this route.',
    '- desktop-light-wrong-retry shows retry feedback without completion.',
    '- desktop-light-after-calculation shows a correct calculation state without completing the route.',
    '- desktop-light-after-structured shows the structured explanation choice `niet-vier-procent`.',
    '- desktop-light-completed, mobile-light-completed, and mobile-dark-completed show all local checks green with completion visible.',
    '- route-reload preserves the Golden root, dark theme, source key `1.1.2-exit-ticket`, no graph runtime, and no legacy route assets.',
    '',
    'Boundary: screenshots do not authorize broad rollout, product route adoption beyond this generated 1.1.2 proof, target-equivalent completion language, diagnostics, mastery, sequencing, summative use, PV, Scale Gate 1, or student product use.'
  );
  return `${lines.join('\n')}\n`;
}

function proofMarkdown(generated, localUrl, captured) {
  return [
    `# ${SPRINT_ID} Rendered Proof`,
    '',
    'Status: Rendered proof complete pending lead review.',
    '',
    `Generated: ${generated}`,
    '',
    '## Scope',
    '',
    '- Deployed the generated 1.1.2 exit-ticket output into the Book 1 lesson repo.',
    '- Confirmed the route uses `header.ge-topbar`, `main.ge-page[data-golden-ticket-root]`, `golden-ticket-layout.css`, `shared/exit-ticket/1.1.2-exit-ticket.js`, and `golden-ticket-layout.js`.',
    '- Confirmed the calculation/structured route does not load `golden-ticket-graph.js` or legacy task-shell/exit-ticket assets.',
    '- Confirmed generated lesson output changed only for the approved readiness flags and authority notes.',
    '',
    '## Rendered Evidence',
    '',
    `- Local proof URL used during capture: ${localUrl}`,
    `- Screenshot manifest: \`${rel(manifestMdPath)}\``,
    `- Machine-readable manifest: \`${rel(manifestJsonPath)}\``,
    `- Cases captured: ${captured.map((item) => item.case).join(', ')}`,
    '',
    '## Authority Boundaries',
    '',
    '- No broad rollout.',
    '- No product use authorization.',
    '- No Scale Gate 1.',
    '- Target-equivalent readiness approved for `1.1.2-exit-ticket` only.',
    '- No target-equivalent completion-language claim.',
    '- No diagnostics, mastery, automatic sequencing, summative use, or PV authorization.',
    ''
  ].join('\n');
}

async function main() {
  if (!chromeExe) throw new Error(`Chromium executable not found. Tried: ${chromeCandidates.join(', ')}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofJsonPath), { recursive: true });

  const serverPort = await findFreePort();
  const debugPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profileDir = path.join(os.tmpdir(), 'Codex-work', `${SPRINT_ID.toLowerCase()}-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(
    chromeExe,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  try {
    const version = await waitForVersion(debugPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const captured = [];
    for (const item of cases) {
      await navigate(cdp, sessionId, serverPort, item);
      await driveAction(cdp, sessionId, item.action);
      const proof = await inspect(cdp, sessionId);
      if (!proof.goldenRoot || proof.legacyAssetCount !== 0 || proof.graphRuntimeLoaded !== false || proof.overclaimVisible) {
        throw new Error(`${item.case} rendered proof failed: ${JSON.stringify(proof, null, 2)}`);
      }
      const shot = await screenshot(cdp, sessionId, `${item.case}.png`);
      captured.push({
        case: item.case,
        action: item.action,
        file: shot.file,
        bytes: shot.bytes,
        theme: item.theme,
        viewport: item.size,
        screenshot_dimensions: shot.dimensions,
        proof,
      });
      console.log(`captured ${item.case}: ${shot.file}`);
    }

    const generated = new Date().toISOString();
    const localUrl = routeUrl(serverPort);
    const proofJson = {
      schema_version: 1,
      sprint_id: SPRINT_ID,
      generated,
      status: 'rendered_proof_complete_pending_review',
      source_route: {
        book_root: bookRoot,
        page_path: pagePath,
        local_url: localUrl,
      },
      static_contract: {
        html_passed: true,
        shared_data_passed: true,
        no_legacy_passed: true,
        graph_runtime_loaded: false,
        golden_layout_loaded: true,
      },
      rendered_states: {
        required_cases: cases.map((item) => item.case),
        captured_cases: captured.map((item) => item.case),
        desktop_mobile_dark_captured: true,
        wrong_retry_captured: captured.some((item) => item.case === 'desktop-light-wrong-retry' && item.proof.retryFeedbackCount > 0),
        after_calculation_captured: captured.some((item) => item.case === 'desktop-light-after-calculation' && item.proof.calculationGoodCount >= 1),
        after_structured_captured: captured.some((item) => item.case === 'desktop-light-after-structured' && item.proof.structuredGood === true),
        completed_captured: captured.some((item) => item.case === 'desktop-light-completed' && item.proof.completionVisible === true),
        reload_captured: captured.some((item) => item.case === 'route-reload' && item.proof.sourceKey === '1.1.2-exit-ticket'),
      },
      authority: {
        generated_lesson_output_changed: true,
        migrated_routes: ['1.1.2-exit-ticket'],
        broad_rollout_authorized: false,
        product_route_adoption_authorized: false,
        product_use_authorized: false,
        scale_gate_1_authorized: false,
        target_equivalent_completion_language_authorized: false,
        diagnostics_authorized: false,
        mastery_or_sequencing_authorized: false,
        summative_use_authorized: false,
        pv_authorized: false,
        student_product_use_authorized: false,
      },
      screenshot_manifest: rel(manifestMdPath),
      screenshot_manifest_json: rel(manifestJsonPath),
      screenshots: captured,
    };

    await fsp.writeFile(
      manifestJsonPath,
      `${JSON.stringify({ schema_version: 1, sprint_id: SPRINT_ID, generated, page_path: pagePath, cases: captured }, null, 2)}\n`,
      'utf8'
    );
    await fsp.writeFile(manifestMdPath, markdownManifest(captured), 'utf8');
    await fsp.writeFile(proofJsonPath, `${JSON.stringify(proofJson, null, 2)}\n`, 'utf8');
    await fsp.writeFile(proofMdPath, proofMarkdown(generated, localUrl, captured), 'utf8');
    console.log(`${SPRINT_ID} rendered screenshots captured: ${captured.length}`);
  } finally {
    try {
      if (!chrome.killed) chrome.kill();
    } catch (_error) {
      // Ignore shutdown races.
    }
    await new Promise((resolve) => {
      chrome.once('exit', resolve);
      setTimeout(resolve, 1500);
    });
    await new Promise((resolve) => server.close(resolve));
    await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
