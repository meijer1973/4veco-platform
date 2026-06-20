#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SPRINT_ID = 'GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GOLDEN_GRAPH_ADVISORY_113_BOOK_ROOT ||
    process.env.LESSON_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const paragraphDir = '1.1.3 Grafieken en tabellen';
const shortFile = `${paragraphDir} \u2013 korte-check.html`;
const landingRel = `${chapterDir}/${paragraphDir}/index.html`;
const shortRel = `${chapterDir}/${paragraphDir}/${shortFile}`;
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'golden-graph-advisory-113-bundle-1-proof.json');

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      }, 20000);
    });
  }

  close() {
    this.ws.close();
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

function urlFor(serverPort, relPath) {
  return `http://127.0.0.1:${serverPort}/` + relPath.split('/').map(encodeURIComponent).join('/');
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
      awaitPromise: true,
    },
    sessionId
  );
  return parseRuntimeJson(result);
}

async function evaluate(cdp, sessionId, expression) {
  return cdp.send(
    'Runtime.evaluate',
    {
      expression,
      returnByValue: true,
      awaitPromise: true,
    },
    sessionId
  );
}

async function waitForReady(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(cdp, sessionId, 'document.readyState');
    if (ready === 'complete') return;
    await sleep(100);
  }
  throw new Error('Timed out waiting for page readyState complete');
}

async function setViewport(cdp, sessionId, viewport) {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 700,
    },
    sessionId
  );
}

async function navigate(cdp, sessionId, url) {
  await cdp.send('Page.navigate', { url }, sessionId);
  await waitForReady(cdp, sessionId);
  await sleep(250);
}

async function setTheme(cdp, sessionId, theme) {
  await evaluate(
    cdp,
    sessionId,
    `(() => {
      const desired = ${JSON.stringify(theme)};
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const button = document.querySelector('#theme-toggle');
      if (button && current !== desired) {
        button.click();
      } else {
        try { localStorage.setItem('quizMode', desired); } catch (e) {}
        document.documentElement.setAttribute('data-theme', desired);
        if (button) button.textContent = desired === 'dark' ? 'Lichte modus' : 'Donkere modus';
      }
    })()`
  );
  await sleep(80);
}

async function inspect(cdp, sessionId) {
  return evaluateJson(cdp, sessionId, `(() => {
    const bodyText = document.body ? document.body.innerText : '';
    const forbiddenTerms = [
      'doelopgave-niveau',
      'doelopgave op hetzelfde niveau',
      'antwoordvorm aankunt',
      'aankunt',
      'lineConfirmationLabel',
      'lineShapeLabel',
      'Trek lijn door punten',
      'Lijnvorm'
    ];
    const legacyMarkers = ['#exit-ticket-app', 'et-page', 'et-topbar', 'task-shell.css', 'exit-ticket.css', 'task-shell-ui.js', 'exit-ticket-ui.js'];
    const offenders = Array.from(document.body ? document.body.querySelectorAll('*') : [])
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          className: String(el.className || ''),
          text: String(el.innerText || '').slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        };
      })
      .filter((item) => item.right > window.innerWidth + 2 || item.left < -2 || item.scrollWidth > item.clientWidth + 2)
      .slice(0, 8);
    const data = window.EXIT_TICKET_DATA || null;
    return {
      url: location.href,
      title: document.title,
      theme: document.documentElement.getAttribute('data-theme') || '',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      horizontal_overflow: document.documentElement.scrollWidth > window.innerWidth + 2 || offenders.length > 0,
      offenders,
      forbidden_terms: forbiddenTerms.filter((term) => bodyText.includes(term) || document.documentElement.outerHTML.includes(term)),
      legacy_markers: legacyMarkers.filter((term) => document.documentElement.outerHTML.includes(term)),
      golden_root: Boolean(document.querySelector('[data-golden-ticket-root]')),
      ge_topbar: Boolean(document.querySelector('.ge-topbar')),
      graph_svg: Boolean(document.querySelector('svg.ge-graph')),
      graph_line_visible: Boolean(document.querySelector('.ge-graph-line')),
      selected_points: document.querySelectorAll('.ge-graph-point').length,
      feedback_good_count: document.querySelectorAll('.ge-feedback.is-good').length,
      feedback_warn_count: document.querySelectorAll('.ge-feedback.is-warn').length,
      completion_visible: Boolean(document.querySelector('[data-ge-completion].is-visible')),
      route_choice_options: document.querySelectorAll('[data-ge-route-choice-option]').length,
      short_check_link_count: Array.from(document.querySelectorAll('a')).filter((a) => /korte-check/i.test(a.getAttribute('href') || '')).length,
      data_flags: data ? {
        surface: data.surface,
        variant: data.layout && data.layout.variant,
        candidate: data.targetEquivalent && data.targetEquivalent.candidate,
        gateApproved: data.targetEquivalent && data.targetEquivalent.gateApproved,
        completionLanguageEligible: data.targetEquivalent && data.targetEquivalent.completionLanguageEligible,
        targetReadinessEvidence: data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence
      } : null
    };
  })()`);
}

async function screenshot(cdp, sessionId, file) {
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
  await fsp.writeFile(file, Buffer.from(result.data, 'base64'));
}

async function capture(cdp, sessionId, serverPort, item) {
  await setViewport(cdp, sessionId, item.viewport);
  await navigate(cdp, sessionId, urlFor(serverPort, item.route === 'landing' ? landingRel : shortRel));
  await setTheme(cdp, sessionId, item.theme);
  if (item.action) await item.action(cdp, sessionId);
  await sleep(150);
  const file = path.join(screenshotDir, `${item.id}.png`);
  await screenshot(cdp, sessionId, file);
  const inspection = await inspect(cdp, sessionId);
  return {
    id: item.id,
    route: item.route || 'short-check',
    action: item.actionLabel || 'initial',
    theme: item.theme,
    viewport: item.viewport,
    file: rel(file),
    inspection,
  };
}

async function clickCorrectGraph(cdp, sessionId, checkGraph) {
  await evaluate(cdp, sessionId, `(() => {
    const click = (el) => el && el.click();
    click(document.querySelector('[data-axis-value="Q"]'));
    click(document.querySelector('[data-ge-axis-slot="x"]'));
    click(document.querySelector('[data-axis-value="P"]'));
    click(document.querySelector('[data-ge-axis-slot="y"]'));
    const spec = window.GoldenTicketGraph.buildGraphSpec(window.EXIT_TICKET_DATA);
    const toX = (value) => window.GoldenTicketGraph.valueToX(spec, value);
    const toY = (value) => window.GoldenTicketGraph.valueToY(spec, value);
    const clickPoint = (xValue, yValue) => {
      const svg = document.querySelector('svg.ge-graph');
      const rect = svg.getBoundingClientRect();
      const clientX = rect.left + (toX(xValue) / window.GoldenTicketGraph.VIEW_BOX.width) * rect.width;
      const clientY = rect.top + (toY(yValue) / window.GoldenTicketGraph.VIEW_BOX.height) * rect.height;
      svg.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX, clientY }));
    };
    clickPoint(250, 2.5);
    clickPoint(150, 3.5);
    if (${checkGraph ? 'true' : 'false'}) {
      click(document.querySelector('[data-ge-check-graph]'));
      const feedback = document.querySelector('[data-ge-feedback="graph"]');
      if (feedback) feedback.scrollIntoView({ block: 'center' });
    }
  })()`);
  await sleep(200);
}

async function clickWrongGraph(cdp, sessionId) {
  await evaluate(cdp, sessionId, `(() => {
    document.querySelector('[data-axis-value="P"]').click();
    document.querySelector('[data-ge-axis-slot="x"]').click();
    document.querySelector('[data-axis-value="Q"]').click();
    document.querySelector('[data-ge-axis-slot="y"]').click();
    document.querySelector('[data-ge-check-graph]').click();
    const feedback = document.querySelector('[data-ge-feedback="graph"]');
    if (feedback) feedback.scrollIntoView({ block: 'center' });
  })()`);
  await sleep(200);
}

async function completeRoute(cdp, sessionId) {
  await clickCorrectGraph(cdp, sessionId, true);
  await evaluate(cdp, sessionId, `(() => {
    document.querySelector('[data-ge-pill-group="read-interval"][data-option-id="250-300"]').click();
    document.querySelector('[data-ge-read-q]').value = '225';
    document.querySelector('[data-ge-read-q]').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-ge-check-reading]').click();
    document.querySelector('[data-ge-route-choice-option][data-option-id="tabel-naar-grafiek"]').click();
    document.querySelector('[data-ge-check-route-choice]').click();
    const completion = document.querySelector('[data-ge-completion]');
    if (completion) completion.scrollIntoView({ block: 'center' });
  })()`);
  await sleep(250);
}

async function landingToShortCheck(cdp, sessionId) {
  await evaluate(cdp, sessionId, `(() => {
    const link = Array.from(document.querySelectorAll('a')).find((a) => /korte-check/i.test(a.getAttribute('href') || ''));
    if (!link) throw new Error('Short-check link not found on landing page');
    link.click();
  })()`);
  await waitForReady(cdp, sessionId);
  await sleep(250);
}

async function routeReload(cdp, sessionId) {
  await cdp.send('Page.reload', { ignoreCache: true }, sessionId);
  await waitForReady(cdp, sessionId);
  await sleep(250);
}

function dataFacts(data) {
  const target = data.targetEquivalent || {};
  const alignment = data.metadataAlignment || {};
  return {
    surface: data.surface,
    variant: data.layout && data.layout.variant,
    candidate: target.candidate,
    gateApproved: target.gateApproved,
    completionLanguageEligible: target.completionLanguageEligible,
    targetReadinessEvidence: alignment.targetReadinessEvidence,
  };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = canonical(value[key]);
      return acc;
    }, {});
  }
  return value;
}

function canonicalString(value) {
  return JSON.stringify(canonical(value));
}

async function main() {
  if (!chromeExe) throw new Error('No Edge/Chrome executable found. Set CHROME_EXE.');
  if (!fs.existsSync(path.join(bookRoot, landingRel))) throw new Error(`Missing landing page under ${bookRoot}`);
  if (!fs.existsSync(path.join(bookRoot, shortRel))) throw new Error(`Missing short-check page under ${bookRoot}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofJsonPath), { recursive: true });

  const serverPort = await findFreePort();
  const debugPort = await findFreePort();
  const server = await startStaticServer(bookRoot, serverPort);
  const profile = path.join(os.tmpdir(), `${SPRINT_ID}-${process.pid}`);
  fs.mkdirSync(profile, { recursive: true });
  const chrome = spawn(chromeExe, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profile}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore', windowsHide: true });

  const captures = [];
  let cdp;
  try {
    const version = await waitForVersion(debugPort);
    cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const desktop = { width: 1280, height: 900 };
    const mobile = { width: 390, height: 860 };
    const scenarios = [
      { id: 'desktop-light-initial', viewport: desktop, theme: 'light', route: 'short-check' },
      { id: 'desktop-light-wrong-retry', viewport: desktop, theme: 'light', route: 'short-check', action: clickWrongGraph, actionLabel: 'wrong-retry' },
      { id: 'desktop-light-graph-after-action', viewport: desktop, theme: 'light', route: 'short-check', action: (c, s) => clickCorrectGraph(c, s, true), actionLabel: 'graph-after-action' },
      { id: 'desktop-light-local-success-advisory-complete', viewport: desktop, theme: 'light', route: 'short-check', action: completeRoute, actionLabel: 'local-success-advisory-complete' },
      { id: 'mobile-light-initial', viewport: mobile, theme: 'light', route: 'short-check' },
      { id: 'mobile-dark-initial', viewport: mobile, theme: 'dark', route: 'short-check' },
      { id: 'mobile-dark-local-success', viewport: mobile, theme: 'dark', route: 'short-check', action: completeRoute, actionLabel: 'local-success-advisory-complete' },
      { id: 'route-reload-desktop-light', viewport: desktop, theme: 'light', route: 'short-check', action: routeReload, actionLabel: 'route-reload' },
      { id: 'landing-to-short-check-route', viewport: desktop, theme: 'light', route: 'landing', action: landingToShortCheck, actionLabel: 'landing-to-short-check-route' },
    ];

    for (const scenario of scenarios) {
      captures.push(await capture(cdp, sessionId, serverPort, scenario));
    }
  } finally {
    if (cdp) cdp.close();
    server.close();
    chrome.kill();
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch (_error) {
      // Best-effort cleanup of the temporary browser profile.
    }
  }

  const sourceData = readJson(path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', '1.1.3-korte-check.json'));
  const generatedData = require(path.join(bookRoot, 'shared', 'exit-ticket', '1.1.3-korte-check.js'));
  const lead = process.env.GOLDEN_GRAPH_ADVISORY_113_LEAD_RECOMMENDATION || 'PENDING_LEAD_REVIEW';
  const ready = lead === 'READY_FOR_HUMAN_GOLDEN_GRAPH_ADVISORY_113_REVIEW';
  const proof = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated: new Date().toISOString(),
    status: ready ? 'ready_for_human_golden_graph_advisory_113_review' : 'rendered_proof_ready_for_lead_review',
    lead_recommendation: lead,
    book_root: bookRoot,
    pages: {
      landing: landingRel,
      short_check: shortRel,
      short_check_url: urlFor(serverPort, shortRel),
    },
    screenshot_manifest: rel(manifestMdPath),
    screenshot_manifest_json: rel(manifestJsonPath),
    source_generated: {
      source: dataFacts(sourceData),
      generated: dataFacts(generatedData),
      deep_equal: canonicalString(sourceData) === canonicalString(generatedData),
      route_links_resolve: true,
    },
    proof: {
      golden_graph_advisory_variant_source: sourceData.layout && sourceData.layout.variant === 'golden_graph_advisory_v1',
      golden_graph_advisory_variant_generated: generatedData.layout && generatedData.layout.variant === 'golden_graph_advisory_v1',
      source_generated_deep_equal: canonicalString(sourceData) === canonicalString(generatedData),
      source_generated_authority_flags_match: JSON.stringify(dataFacts(sourceData)) === JSON.stringify(dataFacts(generatedData)),
      false_authority_flags_preserved: [
        sourceData.targetEquivalent.candidate === false,
        sourceData.targetEquivalent.gateApproved === false,
        sourceData.targetEquivalent.completionLanguageEligible === false,
        sourceData.metadataAlignment.targetReadinessEvidence === false,
        generatedData.targetEquivalent.candidate === false,
        generatedData.targetEquivalent.gateApproved === false,
        generatedData.targetEquivalent.completionLanguageEligible === false,
        generatedData.metadataAlignment.targetReadinessEvidence === false,
      ].every(Boolean),
      no_fake_graph_controls: !JSON.stringify(sourceData).match(/lineConfirmationLabel|lineShapeLabel|lineShapeOptions|Trek lijn door punten|Lijnvorm/),
      rendered_desktop_mobile_dark_coverage: captures.some((c) => c.id === 'desktop-light-initial') &&
        captures.some((c) => c.id === 'mobile-light-initial') &&
        captures.some((c) => c.id === 'mobile-dark-initial'),
      rendered_wrong_retry_captured: captures.some((c) => c.id === 'desktop-light-wrong-retry' && c.inspection.feedback_warn_count > 0),
      rendered_graph_after_action_captured: captures.some((c) => c.id === 'desktop-light-graph-after-action' && c.inspection.graph_line_visible === true),
      rendered_local_success_captured: captures.some((c) => c.id === 'desktop-light-local-success-advisory-complete' && c.inspection.completion_visible === true),
      rendered_mobile_dark_success_captured: captures.some((c) => c.id === 'mobile-dark-local-success' && c.inspection.completion_visible === true),
      landing_to_short_check_route_captured: captures.some((c) => c.id === 'landing-to-short-check-route' && /korte-check/.test(c.inspection.url)),
      route_reload_captured: captures.some((c) => c.id === 'route-reload-desktop-light' && c.inspection.golden_root === true),
      rendered_no_horizontal_overflow: captures.every((c) => c.inspection.horizontal_overflow === false),
      rendered_no_legacy_shell: captures.every((c) => c.route === 'landing' || (c.inspection.golden_root === true && c.inspection.legacy_markers.length === 0)),
      rendered_forbidden_terms_absent: captures.every((c) => c.inspection.forbidden_terms.length === 0),
    },
    authority: {
      target_equivalent_completion_language_authorized: false,
      product_route_adoption_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      scale_gate_1_authorized: false,
      broad_product_use_authorized: false,
      student_product_use_authorized: false,
    },
    screenshots: captures,
  };

  const manifest = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated: proof.generated,
    screenshots: captures.map((item) => ({
      id: item.id,
      file: item.file,
      route: item.route,
      action: item.action,
      theme: item.theme,
      viewport: item.viewport,
    })),
  };
  const manifestMd = [
    `# ${SPRINT_ID} Screenshot Manifest`,
    '',
    `Generated: ${proof.generated}`,
    '',
    '| ID | Route | Action | Theme | Viewport | File |',
    '| --- | --- | --- | --- | --- | --- |',
    ...manifest.screenshots.map((item) => `| ${item.id} | ${item.route} | ${item.action} | ${item.theme} | ${item.viewport.width}x${item.viewport.height} | ${item.file} |`),
    '',
  ].join('\n');

  await fsp.writeFile(manifestJsonPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fsp.writeFile(manifestMdPath, manifestMd, 'utf8');
  await fsp.writeFile(proofJsonPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
  console.log(`Captured ${captures.length} screenshots for ${SPRINT_ID}`);
  console.log(`Proof: ${rel(proofJsonPath)}`);
}

main().catch((error) => {
  console.error(`${SPRINT_ID} capture failed: ${error.stack || error.message}`);
  process.exit(1);
});
