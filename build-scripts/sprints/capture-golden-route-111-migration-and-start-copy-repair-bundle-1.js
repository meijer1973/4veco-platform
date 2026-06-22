#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const net = require('net');
const os = require('os');
const { spawn, execSync } = require('child_process');
const { pathToFileURL } = require('url');

const SPRINT_ID = 'GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const defaultBookRoot = path.resolve(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const bookRoot = path.resolve(process.env.GOLDEN_ROUTE_111_BOOK_ROOT || process.env.LESSON_BOOK_ROOT || defaultBookRoot);
const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const proofPath = path.join(platformRoot, 'reports', 'json', 'golden-route-111-migration-and-start-copy-repair-bundle-1-proof.json');

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

const paragraphs = [
  { id: '1.1.1', dir: '1.1.1 Schaarste en economisch denken' },
  { id: '1.1.2', dir: '1.1.2 Percentages en indexcijfers' },
  { id: '1.1.3', dir: '1.1.3 Grafieken en tabellen' },
];

function fail(message) {
  console.error(`${SPRINT_ID} capture failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function pageFile(paragraph, suffix) {
  return path.join(bookRoot, chapterDir, paragraph.dir, `${paragraph.id} ${paragraph.dir.slice(6)} \u2013 ${suffix}.html`);
}

function sourceData(sourceKey) {
  return readJson(path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${sourceKey}.json`));
}

function requireGeneratedData(sourceKey) {
  const file = path.join(bookRoot, 'shared', 'exit-ticket', `${sourceKey}.js`);
  const resolved = require.resolve(file);
  delete require.cache[resolved];
  return require(resolved);
}

function gitHead(repo) {
  try {
    return execSync('git rev-parse HEAD', { cwd: repo, encoding: 'utf8' }).trim();
  } catch (_error) {
    return null;
  }
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    fail(`not a PNG screenshot: ${file}`);
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, { timeout: 2000 }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on('timeout', () => {
      request.destroy(new Error('request timed out'));
    });
    request.on('error', reject);
  });
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = address && address.port;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(`${message.error.message}${message.error.data ? `: ${message.error.data}` : ''}`));
        else resolve(message.result || {});
        return;
      }
      this.events.push(message);
    });
    ws.addEventListener('close', () => {
      for (const { reject } of this.pending.values()) {
        reject(new Error('CDP connection closed'));
      }
      this.pending.clear();
    });
  }

  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => resolve(new CdpClient(ws)));
      ws.addEventListener('error', () => reject(new Error(`CDP WebSocket failed: ${url}`)));
    });
  }

  send(method, params = {}, sessionId = null) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  async close() {
    try {
      this.ws.close();
    } catch (_error) {
      // Closing is best effort; the browser process shutdown below is authoritative.
    }
  }
}

async function waitForBrowser(port, browserProcess) {
  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  let lastError = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (browserProcess.exitCode !== null) {
      throw new Error(`browser exited before DevTools became available`);
    }
    try {
      return await getJson(versionUrl);
    } catch (error) {
      lastError = error;
      await sleep(100);
    }
  }
  throw new Error(`DevTools did not become available: ${lastError ? lastError.message : 'unknown error'}`);
}

async function launchBrowser() {
  if (!chromeExe) {
    fail('No Chrome or Edge executable found. Set CHROME_EXE to a Chromium-compatible browser.');
  }
  const port = await findFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), `${SPRINT_ID.toLowerCase()}-chrome-`));
  const stderr = [];
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--disable-background-networking',
    '--disable-sync',
    '--disable-translate',
    '--disable-features=MediaRouter',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ];
  const browserProcess = spawn(chromeExe, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  browserProcess.stderr.on('data', (chunk) => {
    stderr.push(chunk.toString());
  });
  try {
    const version = await waitForBrowser(port, browserProcess);
    const client = await CdpClient.connect(version.webSocketDebuggerUrl);
    return {
      client,
      async close() {
        await client.close();
        if (browserProcess.exitCode === null) {
          browserProcess.kill();
          await sleep(500);
        }
        if (browserProcess.exitCode === null) {
          browserProcess.kill('SIGKILL');
        }
        fs.rmSync(userDataDir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    if (browserProcess.exitCode === null) browserProcess.kill('SIGKILL');
    fs.rmSync(userDataDir, { recursive: true, force: true });
    throw new Error(`${error.message}${stderr.length ? `\n${stderr.join('').trim()}` : ''}`);
  }
}

async function waitForPageReady(client, sessionId) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = await client.send('Runtime.evaluate', {
      expression: 'document.readyState',
      returnByValue: true,
    }, sessionId);
    if (result.result && result.result.value === 'complete') break;
    await sleep(100);
  }
  await client.send('Runtime.evaluate', {
    expression: 'document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true',
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  await client.send('Runtime.evaluate', {
    expression: 'new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))',
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
}

async function inspectLayout(client, sessionId) {
  const result = await client.send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const documentScrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
      const offenders = [];
      for (const element of Array.from(document.body ? document.body.querySelectorAll('*') : [])) {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;
        const overflowsViewport = rect.left < -1 || rect.right > viewportWidth + 1;
        if (!overflowsViewport) continue;
        offenders.push({
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          className: typeof element.className === 'string' ? element.className : '',
          left: Number(rect.left.toFixed(2)),
          right: Number(rect.right.toFixed(2)),
          width: Number(rect.width.toFixed(2)),
        });
        if (offenders.length >= 12) break;
      }
      const maxScrollWidth = Math.max(documentScrollWidth, bodyScrollWidth);
      return {
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        document_scroll_width: documentScrollWidth,
        body_scroll_width: bodyScrollWidth,
        max_scroll_width: maxScrollWidth,
        horizontal_scroll_overflow: maxScrollWidth > viewportWidth + 1,
        offenders,
        horizontal_overflow: maxScrollWidth > viewportWidth + 1 || offenders.length > 0,
      };
    })()`,
  }, sessionId);
  return result.result.value;
}

async function captureOne(item, browser) {
  if (!fs.existsSync(item.page)) fail(`missing page ${item.page}`);
  const out = path.join(screenshotDir, `${item.id}.png`);
  const target = await browser.client.send('Target.createTarget', {
    url: 'about:blank',
  });
  const attached = await browser.client.send('Target.attachToTarget', {
    targetId: target.targetId,
    flatten: true,
  });
  const sessionId = attached.sessionId;
  await browser.client.send('Page.enable', {}, sessionId);
  await browser.client.send('Runtime.enable', {}, sessionId);
  await browser.client.send('Emulation.setDeviceMetricsOverride', {
    width: item.viewport.width,
    height: item.viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
  }, sessionId);
  await browser.client.send('Page.navigate', { url: pathToFileURL(item.page).href }, sessionId);
  await waitForPageReady(browser.client, sessionId);
  const inspection = await inspectLayout(browser.client, sessionId);
  const screenshot = await browser.client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  }, sessionId);
  fs.writeFileSync(out, Buffer.from(screenshot.data, 'base64'));
  await browser.client.send('Target.closeTarget', { targetId: target.targetId });
  const dimensions = pngDimensions(out);
  if (dimensions.width !== item.viewport.width || dimensions.height !== item.viewport.height) {
    fail(`${item.id} dimensions ${dimensions.width}x${dimensions.height} did not match ${item.viewport.width}x${item.viewport.height}`);
  }
  if (inspection.horizontal_overflow) {
    fail(`${item.id} has horizontal overflow: ${JSON.stringify(inspection.offenders)}`);
  }
  return {
    id: item.id,
    paragraph: item.paragraph,
    surface: item.surface,
    viewport: item.viewport,
    page: path.relative(bookRoot, item.page).replace(/\\/g, '/'),
    file: rel(out),
    inspection,
  };
}

function hasGoldenShell(sourceKey) {
  const html = fs.readFileSync(pageFile(paragraphs[0], sourceKey === '1.1.1-exit-ticket' ? 'exit-ticket' : 'korte-check'), 'utf8');
  return /data-golden-ticket-root/.test(html) &&
    /ge-topbar/.test(html) &&
    /golden-ticket-layout\.css/.test(html) &&
    !/exit-ticket-app|task-shell\.css|exit-ticket-ui\.js|task-shell-ui\.js/.test(html);
}

function startCopyAudit() {
  const forbidden = /Jouw beheersing|beheersing|mastery-dashboard|mastery-container|definitief af te sluiten|doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|aankunt|<span class="stat-label">Gesloten<\/span>/i;
  return paragraphs.map((paragraph) => {
    const html = fs.readFileSync(pageFile(paragraph, 'instapquiz'), 'utf8');
    return {
      paragraph: paragraph.id,
      neutral_oefenstatus_present: /Oefenstatus/.test(html),
      progress_dashboard_present: /progress-dashboard/.test(html),
      neutral_series_copy_present: /Een <strong>reeks van 3<\/strong> laat zien waar je vlot antwoordt/.test(html),
      forbidden_terms_absent: !forbidden.test(html),
    };
  });
}

function completionAudit() {
  const result = {};
  for (const paragraph of paragraphs) {
    const exitSource = sourceData(`${paragraph.id}-exit-ticket`);
    const exitGenerated = requireGeneratedData(`${paragraph.id}-exit-ticket`);
    const shortSource = sourceData(`${paragraph.id}-korte-check`);
    const shortGenerated = requireGeneratedData(`${paragraph.id}-korte-check`);
    result[paragraph.id] = {
      exit_ticket: {
        source_completionLanguageEligible: (exitSource.targetEquivalent || {}).completionLanguageEligible,
        generated_completionLanguageEligible: (exitGenerated.targetEquivalent || {}).completionLanguageEligible,
        source_targetReadinessEvidence: (exitSource.metadataAlignment || {}).targetReadinessEvidence,
        generated_targetReadinessEvidence: (exitGenerated.metadataAlignment || {}).targetReadinessEvidence,
        source_completion_title: (exitSource.completion || {}).title || null,
        generated_completion_title: (exitGenerated.completion || {}).title || null,
      },
      short_check: {
        source_surface: shortSource.surface,
        generated_surface: shortGenerated.surface,
        source_targetReadinessEvidence: (shortSource.metadataAlignment || {}).targetReadinessEvidence,
        generated_targetReadinessEvidence: (shortGenerated.metadataAlignment || {}).targetReadinessEvidence,
        source_completionLanguageEligible: shortSource.targetEquivalent ? shortSource.targetEquivalent.completionLanguageEligible : null,
        generated_completionLanguageEligible: shortGenerated.targetEquivalent ? shortGenerated.targetEquivalent.completionLanguageEligible : null,
      },
    };
  }
  return result;
}

function writeManifestMarkdown(screenshots) {
  const rows = screenshots.map((shot) => `| ${shot.id} | ${shot.paragraph} | ${shot.surface} | ${shot.viewport.width}x${shot.viewport.height} | ${shot.inspection.horizontal_overflow ? 'yes' : 'no'} | ${shot.file} |`).join('\n');
  const text = [
    `# ${SPRINT_ID} Screenshot Manifest`,
    '',
    'These screenshots were captured from generated Book 1 lesson output after regenerating from platform source. Capture uses Chromium DevTools Protocol device metrics so the PNG size and CSS viewport match.',
    '',
    '| id | paragraph | surface | viewport | horizontal overflow | file |',
    '| --- | --- | --- | --- | --- | --- |',
    rows,
    '',
    'Boundary: screenshots support the 1.1.1 Golden route migration and first-three Start-copy repair only. They do not authorize product-route adoption, Scale Gate 1, diagnostics, mastery/sequencing, PV, summative use, broad product use, or student/product use.',
    '',
  ].join('\n');
  fs.writeFileSync(manifestMdPath, text, 'utf8');
}

async function main() {
  fs.rmSync(screenshotDir, { recursive: true, force: true });
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(path.dirname(proofPath), { recursive: true });

  const desktop = { width: 1280, height: 900 };
  const mobile = { width: 390, height: 900 };
  const items = [];
  for (const paragraph of paragraphs) {
    items.push({
      id: `${paragraph.id.replace(/\./g, '-')}-start-desktop`,
      paragraph: paragraph.id,
      surface: 'start',
      viewport: desktop,
      page: pageFile(paragraph, 'instapquiz'),
    });
    items.push({
      id: `${paragraph.id.replace(/\./g, '-')}-start-mobile`,
      paragraph: paragraph.id,
      surface: 'start',
      viewport: mobile,
      page: pageFile(paragraph, 'instapquiz'),
    });
  }
  for (const suffix of ['exit-ticket', 'korte-check']) {
    items.push({
      id: `1-1-1-${suffix}-desktop`,
      paragraph: '1.1.1',
      surface: suffix,
      viewport: desktop,
      page: pageFile(paragraphs[0], suffix),
    });
    items.push({
      id: `1-1-1-${suffix}-mobile`,
      paragraph: '1.1.1',
      surface: suffix,
      viewport: mobile,
      page: pageFile(paragraphs[0], suffix),
    });
  }

  let browser = null;
  let screenshots = [];
  try {
    browser = await launchBrowser();
    for (const item of items) {
      screenshots.push(await captureOne(item, browser));
    }
  } finally {
    if (browser) await browser.close();
  }
  fs.writeFileSync(manifestJsonPath, JSON.stringify({ sprint_id: SPRINT_ID, screenshots }, null, 2) + '\n', 'utf8');
  writeManifestMarkdown(screenshots);

  const startAudit = startCopyAudit();
  const completion = completionAudit();
  const proof = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: new Date().toISOString(),
    status: process.env.GOLDEN_ROUTE_111_PROOF_STATUS || 'ready_for_lead_review',
    platform_head: gitHead(platformRoot),
    lesson_head: gitHead(path.resolve(bookRoot, '..')),
    lesson_book_root: bookRoot,
    authority: {
      product_route_adoption_authorized: false,
      product_use_authorized: false,
      student_product_use_authorized: false,
      scale_gate_1_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      adaptive_routing_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      target_equivalent_completion_language_authorized: false,
    },
    source_generated_parity: {
      '1.1.1-exit-ticket': {
        source_context_blocks: sourceData('1.1.1-exit-ticket').contextBlocks.length,
        generated_context_blocks: requireGeneratedData('1.1.1-exit-ticket').contextBlocks.length,
      },
      '1.1.1-korte-check': {
        source_context_blocks: sourceData('1.1.1-korte-check').contextBlocks.length,
        generated_context_blocks: requireGeneratedData('1.1.1-korte-check').contextBlocks.length,
      },
    },
    start_copy_audit: startAudit,
    completion_audit: completion,
    screenshots,
    screenshot_manifest: rel(manifestMdPath),
    screenshot_manifest_json: rel(manifestJsonPath),
    proof: {
      start_copy_forbidden_terms_absent: startAudit.every((entry) => entry.forbidden_terms_absent),
      start_copy_neutral_oefenstatus_present: startAudit.every((entry) => entry.neutral_oefenstatus_present && entry.progress_dashboard_present),
      golden_111_exit_rendered: hasGoldenShell('1.1.1-exit-ticket'),
      golden_111_short_rendered: hasGoldenShell('1.1.1-korte-check'),
      rendered_no_horizontal_overflow: screenshots.every((shot) => shot.inspection && shot.inspection.horizontal_overflow === false),
      rendered_mobile_no_horizontal_overflow: screenshots
        .filter((shot) => shot.viewport.width === mobile.width)
        .every((shot) => shot.inspection && shot.inspection.horizontal_overflow === false),
      completion_language_held: Object.values(completion).every((entry) =>
        entry.exit_ticket.source_completionLanguageEligible === false &&
        entry.exit_ticket.generated_completionLanguageEligible === false &&
        entry.short_check.source_targetReadinessEvidence === false &&
        entry.short_check.generated_targetReadinessEvidence === false
      ),
      visible_exit_completion_heading_neutral: Object.values(completion).every((entry) =>
        entry.exit_ticket.source_completion_title === 'Werk nagekeken' &&
        entry.exit_ticket.generated_completion_title === 'Werk nagekeken'
      ),
      gate_claim_limited_to_first_three_start_copy_and_111_route_migration: true,
    },
  };
  fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2) + '\n', 'utf8');
  console.log(`Captured ${screenshots.length} screenshots`);
  console.log(`Wrote ${rel(proofPath)}`);
}

main().catch((error) => fail(error.message));
