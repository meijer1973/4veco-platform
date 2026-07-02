#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SPRINT_ID = 'GATE-PRODUCT-3P-AUTHORITY-COPY-REPAIR-AND-REREVIEW-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GATE_PRODUCT_3P_BOOK_ROOT ||
    process.env.LESSON_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const screenshotManifestJsonPath = path.join(screenshotDir, 'manifest.json');
const screenshotManifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const routeInventoryMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-route-inventory.md`);
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'gate-product-3p-authority-copy-repair-and-rereview-1-proof.json');

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

const paragraphs = [
  {
    id: '1.1.1',
    dir: '1.1.1 Schaarste en economisch denken',
    exit_shell: 'legacy_task_shell',
    short_shell: 'legacy_task_shell',
    representative_practice_suffix: 'redeneer-spel',
  },
  {
    id: '1.1.2',
    dir: '1.1.2 Percentages en indexcijfers',
    exit_shell: 'golden_exercise_workbench',
    short_shell: 'golden_exercise_workbench_advisory',
    representative_practice_suffix: 'wiskundevaardigheden',
  },
  {
    id: '1.1.3',
    dir: '1.1.3 Grafieken en tabellen',
    exit_shell: 'golden_exercise_workbench',
    short_shell: 'legacy_task_shell',
    representative_practice_suffix: 'grafiekenspel',
  },
];

const sameCopyHygieneParagraphs = [
  {
    id: '1.1.4',
    dir: '1.1.4 Gemengde opgaven',
  },
];

const neutralExitRowCopy = 'Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend.';
const neutralExitTileCopy = 'Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen.';
const forbiddenAuthorityCopyRegex = /doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|aankunt|adaptieve oefenroute|adaptieve oefeningen|adaptief|voorgestelde volgende oefening|op basis van (?:je )?lokale voortgang/gi;

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function bookRel(file) {
  return path.relative(bookRoot, file).replace(/\\/g, '/');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function paragraphDir(paragraph) {
  return path.join(bookRoot, chapterDir, paragraph.dir);
}

function pageRel(paragraph, suffix) {
  if (!suffix) return `${chapterDir}/${paragraph.dir}/index.html`;
  return `${chapterDir}/${paragraph.dir}/${paragraph.dir} \u2013 ${suffix}.html`;
}

function pageAbs(paragraph, suffix) {
  return path.join(bookRoot, pageRel(paragraph, suffix));
}

function sourceDataPath(key) {
  return path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${key}.json`);
}

function generatedDataPath(key) {
  return path.join(bookRoot, 'shared', 'exit-ticket', `${key}.js`);
}

function requireFresh(file) {
  const resolved = require.resolve(file);
  delete require.cache[resolved];
  return require(resolved);
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

async function runPageScript(cdp, sessionId, expression, label) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression,
      returnByValue: true,
      awaitPromise: true,
    },
    sessionId
  );
  if (result.exceptionDetails) {
    const details = result.exceptionDetails;
    const exception = details.exception && (details.exception.description || details.exception.value);
    throw new Error(`${label || 'page script'} failed: ${exception || details.text || 'unknown Runtime.evaluate error'}`);
  }
  return result;
}

async function waitForReady(cdp, sessionId, surface) {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(
      cdp,
      sessionId,
      `Boolean(document.body && document.body.innerText && (
        ${JSON.stringify(surface)} === 'landing'
          ? document.querySelector('[data-route-layer]')
          : (${JSON.stringify(surface)} === 'practice'
            ? document.body.innerText.length > 100
            : (window.EXIT_TICKET_DATA && (document.querySelector('[data-golden-ticket-root]') || document.querySelector('#exit-ticket-app'))))
      ))`
    );
    if (ready === true) return;
    await sleep(150);
  }
  throw new Error(`Timed out waiting for ${surface} route`);
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
      returnByValue: true,
    },
    sessionId
  );
}

async function scrollToSelector(cdp, sessionId, selector) {
  if (!selector) return;
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        return true;
      })()`,
      returnByValue: true,
    },
    sessionId
  );
}

async function navigate(cdp, sessionId, serverPort, config) {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    {
      width: config.viewport.width,
      height: config.viewport.height,
      deviceScaleFactor: 1,
      mobile: config.viewport.width < 520,
    },
    sessionId
  );
  await cdp.send('Page.navigate', { url: urlFor(serverPort, config.path) }, sessionId);
  await waitForReady(cdp, sessionId, config.surface);
  await setTheme(cdp, sessionId, config.theme);
  if (config.scroll_selector) {
    await sleep(250);
    await scrollToSelector(cdp, sessionId, config.scroll_selector);
    await sleep(250);
    await scrollToSelector(cdp, sessionId, config.scroll_selector);
  }
  await sleep(350);
}

async function driveLegacy111Complete(cdp, sessionId) {
  const script = `(() => {
    function click(selector) {
      const el = document.querySelector(selector);
      if (!el) throw new Error('Missing clickable element: ' + selector);
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
    function inputValue(selector, value) {
      const el = document.querySelector(selector);
      if (!el) throw new Error('Missing input element: ' + selector);
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function fillCalculation(id, values) {
      inputValue('[data-task-id="' + id + '"][data-input-role="work"]', values.work);
      inputValue('[data-task-id="' + id + '"][data-input-role="final-answer"]', values.finalAnswer);
      inputValue('[data-task-id="' + id + '"][data-input-role="unit-notation"]', values.unitNotation || '');
    }
    function check(id) {
      click('.et-task-shell-check[data-task-id="' + id + '"]');
    }
    function fillStructured(values) {
      Object.keys(values.fields).forEach((id) => {
        inputValue('[data-task-id="betere-keuze-uitleg"][data-input-role="structured-field"][data-field-id="' + id + '"]', values.fields[id]);
      });
      click('.ts-choice[data-task-id="betere-keuze-uitleg"][data-choice-id="' + values.choice + '"]');
    }
    const correct = {
      'tarwe-opbrengst': { work: '500 x 10', finalAnswer: '5000', unitNotation: 'euro' },
      'alternatieve-kosten-mais': { work: '350 x 10', finalAnswer: '3500', unitNotation: 'euro' },
      'buurvrouw-gemengd': { work: '500 x 6 plus 350 x 4 = 4400', finalAnswer: '4400', unitNotation: 'euro' }
    };
    Object.keys(correct).forEach((id) => {
      fillCalculation(id, correct[id]);
      check(id);
    });
    fillStructured({
      fields: { boer: '5000 euro', buurvrouw: '4400 euro', schaarste: 'grond is schaars' },
      choice: 'boer-beter'
    });
    check('betere-keuze-uitleg');
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveLegacy111Complete');
  await sleep(500);
}

async function driveGolden112Complete(cdp, sessionId) {
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
    const correct = {
      'prijsstijging-procent': { work: '(920 - 800) / 800 x 100 = 15', finalAnswer: '15%', unitNotation: '%' },
      'index-naar-waarde': { work: '162 / 150 x 100 = 108', finalAnswer: '108', unitNotation: '' },
      'index-naar-procent': { work: '(112 - 108) / 108 x 100 = 3,7', finalAnswer: '3,7%', unitNotation: '%' }
    };
    Object.keys(correct).forEach((id) => fillCalculation(id, correct[id]));
    const structured = step('indexpunten-uitleg');
    inputValue(structured.querySelector('[data-ge-structured-field][data-field-id="indexpunten"]'), '4 indexpunten');
    inputValue(structured.querySelector('[data-ge-structured-field][data-field-id="basis"]'), '108');
    inputValue(structured.querySelector('[data-ge-structured-field][data-field-id="procentuele-stijging"]'), '3,7%');
    click(structured.querySelector('[data-ge-structured-choice][data-option-id="niet-vier-procent"]'));
    click(document.querySelector('[data-ge-check-all]'));
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveGolden112Complete');
  await sleep(500);
}

async function driveGolden113Complete(cdp, sessionId) {
  const script = `(() => {
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
      if (!input) throw new Error('Missing input ' + selector);
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    document.querySelector('[data-axis-value="Q"]').click();
    document.querySelector('[data-ge-axis-slot="x"]').click();
    document.querySelector('[data-axis-value="P"]').click();
    document.querySelector('[data-ge-axis-slot="y"]').click();
    clickPoint('350', '1');
    clickPoint('150', '3');
    document.querySelector('[data-ge-check-graph]').click();
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
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveGolden113Complete');
  await sleep(500);
}

async function driveCompletedState(cdp, sessionId, paragraphId) {
  if (paragraphId === '1.1.1') return driveLegacy111Complete(cdp, sessionId);
  if (paragraphId === '1.1.2') return driveGolden112Complete(cdp, sessionId);
  if (paragraphId === '1.1.3') return driveGolden113Complete(cdp, sessionId);
  return undefined;
}

async function scrollToCompletionOrFeedback(cdp, sessionId) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        const candidates = [
          '[data-ge-completion]',
          '[data-ge-feedback="claim"]',
          '[data-ge-feedback]',
          '.et-feedback.is-match',
          '.ge-feedback.is-visible',
          '.et-completion'
        ];
        const el = candidates.map((selector) => document.querySelector(selector)).find(Boolean);
        if (el) el.scrollIntoView({ block: 'center', inline: 'nearest' });
      })()`,
      returnByValue: true,
    },
    sessionId
  );
  await sleep(250);
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
  const shot = await cdp.send(
    'Page.captureScreenshot',
    {
      format: 'png',
      captureBeyondViewport: false,
      fromSurface: true,
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

async function inspectPage(cdp, sessionId, surface) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const text = document.body ? document.body.innerText.replace(/\\s+/g, ' ').trim() : '';
      const loaded = Array.from(document.querySelectorAll('link[href], script[src]'))
        .map((node) => node.getAttribute('href') || node.getAttribute('src'));
      const feedback = Array.from(document.querySelectorAll('.et-feedback, .ge-feedback.is-visible')).map((node) => ({
        selector: node.className || node.getAttribute('data-ge-feedback') || '',
        tone: node.classList.contains('is-good') || node.classList.contains('is-match') ? 'good' :
          node.classList.contains('is-warn') || node.classList.contains('is-retry') ? 'warn' :
          node.classList.contains('is-bad') ? 'bad' : 'unknown',
        text: node.innerText.replace(/\\s+/g, ' ').trim()
      }));
      const completionNodes = Array.from(document.querySelectorAll('[data-ge-completion], .et-completion, [data-completion]')).map((node) => ({
        text: node.innerText.replace(/\\s+/g, ' ').trim(),
        hidden: node.hidden || getComputedStyle(node).display === 'none' || getComputedStyle(node).visibility === 'hidden',
        className: node.className || '',
        visible: !(node.hidden || getComputedStyle(node).display === 'none' || getComputedStyle(node).visibility === 'hidden')
      }));
      const doc = document.documentElement;
      const body = document.body;
      const forbidden = Array.from(new Set((text.match(/diagnost\\w*|mastery|sequencing|summatief|summative|Scale Gate|\\bPV\\b|productgebruik|student product|studentgebruik|adaptieve oefenroute|adaptieve oefeningen|adaptief|voorgestelde volgende oefening|op basis van (?:je )?lokale voortgang/gi) || [])));
      const targetCompletionTerms = Array.from(new Set((text.match(/doelopgave-niveau|doelopgave op hetzelfde niveau|antwoordvorm aankunt|aankunt|bewezen|aangetoond|je beheerst|voltooid/gi) || [])));
      return {
        surface: ${JSON.stringify(surface)},
        title: document.title,
        theme: doc.getAttribute('data-theme') || 'light',
        viewport: { width: window.innerWidth, height: window.innerHeight },
        horizontal_overflow: Math.max(doc.scrollWidth || 0, body ? body.scrollWidth || 0 : 0) > window.innerWidth + 2,
        body_text_excerpt: text.slice(0, 900),
        forbidden_authority_terms: forbidden,
        target_completion_terms: targetCompletionTerms,
        roots: {
          landing_route_layer_count: document.querySelectorAll('[data-route-layer]').length,
          legacy_exit_ticket_app: Boolean(document.querySelector('#exit-ticket-app')),
          golden_ticket_root: Boolean(document.querySelector('[data-golden-ticket-root]')),
          source_key: document.querySelector('[data-golden-ticket-root]')?.getAttribute('data-source-key') || window.EXIT_TICKET_DATA?.id || null
        },
        data_flags: window.EXIT_TICKET_DATA ? {
          surface: window.EXIT_TICKET_DATA.surface || null,
          parNr: window.EXIT_TICKET_DATA.parNr || null,
          gateApproved: window.EXIT_TICKET_DATA.targetEquivalent?.gateApproved,
          completionLanguageEligible: window.EXIT_TICKET_DATA.targetEquivalent?.completionLanguageEligible,
          targetReadinessEvidence: window.EXIT_TICKET_DATA.metadataAlignment?.targetReadinessEvidence,
          metadataStatus: window.EXIT_TICKET_DATA.metadataAlignment?.status || null,
          layoutFramework: window.EXIT_TICKET_DATA.layout?.framework || null
        } : null,
        task_counts: {
          legacy_task_shell: document.querySelectorAll('article.et-task-shell[data-task]').length,
          golden_task: document.querySelectorAll('[data-task-id]').length,
          golden_graph: document.querySelectorAll('[data-ge-graph-wrap]').length,
          context_blocks: document.querySelectorAll('[data-context-block]').length
        },
        feedback,
        feedback_good_count: feedback.filter((item) => item.tone === 'good').length,
        completion_nodes: completionNodes,
        visible_completion_text: completionNodes.filter((node) => node.visible).map((node) => node.text).join(' '),
        loaded_assets: loaded
      };
    })()`
  );
}

function stripTags(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rarr;/g, '->')
    .replace(/\s+/g, ' ')
    .trim();
}

function attrValue(attrs, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i');
  const match = pattern.exec(attrs || '');
  return match ? match[1] : null;
}

function extractAnchors(html, baseFile) {
  const anchors = [];
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attrs = match[1];
    const href = attrValue(attrs, 'href');
    if (!href) continue;
    const cleanHref = href.split('#')[0];
    let target = null;
    let exists = null;
    if (cleanHref && !/^(?:https?:|mailto:|#)/i.test(cleanHref)) {
      target = path.resolve(path.dirname(baseFile), decodeURIComponent(cleanHref));
      exists = fs.existsSync(target);
    }
    anchors.push({
      href,
      route_layer: attrValue(attrs, 'data-route-layer'),
      tile_id: attrValue(attrs, 'data-tile-id'),
      tile_state: attrValue(attrs, 'data-tile-state'),
      text: stripTags(match[2]),
      target: target ? bookRel(target) : null,
      exists,
    });
  }
  return anchors;
}

function sectionText(html, id) {
  const marker = new RegExp(`<div\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
  const match = marker.exec(html);
  if (!match) return '';
  const rest = html.slice(match.index);
  const next = rest.slice(match[0].length).search(/<div\b[^>]*\bclass=["'][^"']*\blearning-row\b/i);
  const section = next >= 0 ? rest.slice(0, match[0].length + next) : rest;
  return stripTags(section);
}

function routeFamilyFromAnchor(anchor) {
  const haystack = `${anchor.href} ${anchor.text} ${anchor.route_layer || ''} ${anchor.tile_id || ''}`.toLowerCase();
  const families = [];
  if (anchor.href.startsWith('#start') || /instapquiz|nieuws/.test(haystack)) families.push('start');
  if (anchor.href.startsWith('#leer') || /uitleg|presentatie|leerpad|vaardigheden/.test(haystack)) families.push('leer');
  if (anchor.href.startsWith('#check') || /korte-check|kort advies/.test(haystack)) families.push('check');
  if (anchor.href.startsWith('#oefen') || /begeleide|opgaven|oefen/.test(haystack)) families.push('oefen');
  if (anchor.href.startsWith('#exit-ticket') || /exit-ticket|eindcontrole/.test(haystack)) families.push('exit-ticket');
  if (/redeneer-spel|stappenplan|wiskundevaardigheden|grafiekenspel|skill/.test(haystack)) families.push('skill-map-or-learn-path');
  if (/begeleide|opgaven/.test(haystack)) families.push('normal-practice');
  return [...new Set(families)];
}

function buildRouteInventory() {
  const requiredFamilies = [
    'start',
    'leer',
    'oefen',
    'skill-map-or-learn-path',
    'normal-practice',
    'check',
    'exit-ticket',
  ];
  const inventory = paragraphs.map((paragraph) => {
    const file = pageAbs(paragraph);
    const html = readText(file);
    const anchors = extractAnchors(html, file).map((anchor) => ({
      ...anchor,
      families: routeFamilyFromAnchor(anchor),
    }));
    const families = {};
    for (const family of requiredFamilies) {
      families[family] = anchors.filter((anchor) => anchor.families.includes(family));
    }
    const localLinks = anchors.filter((anchor) => anchor.exists !== null);
    return {
      paragraph: paragraph.id,
      title: paragraph.dir,
      landing: bookRel(file),
      exit_row_text: sectionText(html, 'exit-ticket'),
      check_row_text: sectionText(html, 'check'),
      families,
      link_resolution: {
        checked: localLinks.length,
        unresolved: localLinks.filter((anchor) => anchor.exists !== true),
      },
      all_required_families_present: requiredFamilies.every((family) => families[family].length > 0),
    };
  });
  return {
    required_families: requiredFamilies,
    paragraphs: inventory,
  };
}

function copyAuditEntry(paragraph, gateClaim) {
  const file = pageAbs(paragraph);
  const html = readText(file);
  const exitRowText = sectionText(html, 'exit-ticket');
  const forbiddenMatches = Array.from(new Set((exitRowText.match(forbiddenAuthorityCopyRegex) || [])));
  return {
    paragraph: paragraph.id,
    title: paragraph.dir,
    gate_claim: gateClaim,
    landing: bookRel(file),
    row_copy: neutralExitRowCopy,
    tile_copy: neutralExitTileCopy,
    exit_row_text: exitRowText,
    neutral_row_copy_present: exitRowText.includes(neutralExitRowCopy),
    neutral_tile_copy_present: exitRowText.includes(neutralExitTileCopy),
    forbidden_authority_copy_absent: forbiddenMatches.length === 0,
    forbidden_matches: forbiddenMatches,
  };
}

function buildAuthorityCopyAudit(routeInventory) {
  return {
    first_three_gate_claim: routeInventory.paragraphs.map((paragraph) =>
      copyAuditEntry(
        {
          id: paragraph.paragraph,
          dir: paragraph.title,
        },
        true
      )
    ),
    same_copy_hygiene_not_gate_claim: sameCopyHygieneParagraphs.map((paragraph) =>
      copyAuditEntry(paragraph, false)
    ),
  };
}

function surfaceFacts(paragraph, suffix) {
  const key = `${paragraph.id}-${suffix}`;
  const source = readJson(sourceDataPath(key));
  const generated = requireFresh(generatedDataPath(key));
  const html = readText(pageAbs(paragraph, suffix));
  return {
    key,
    page: bookRel(pageAbs(paragraph, suffix)),
    source: {
      surface: source.surface,
      gateApproved: Boolean(source.targetEquivalent && source.targetEquivalent.gateApproved === true),
      completionLanguageEligible: Boolean(source.targetEquivalent && source.targetEquivalent.completionLanguageEligible === true),
      targetReadinessEvidence: Boolean(source.metadataAlignment && source.metadataAlignment.targetReadinessEvidence === true),
      metadataStatus: source.metadataAlignment && source.metadataAlignment.status || null,
      layoutFramework: source.layout && source.layout.framework || null,
      advisoryTargetEquivalentProof: source.advisory && source.advisory.targetEquivalentProof,
      taskCount: Array.isArray(source.tasks) ? source.tasks.length : 0,
    },
    generated: {
      surface: generated.surface,
      gateApproved: Boolean(generated.targetEquivalent && generated.targetEquivalent.gateApproved === true),
      completionLanguageEligible: Boolean(generated.targetEquivalent && generated.targetEquivalent.completionLanguageEligible === true),
      targetReadinessEvidence: Boolean(generated.metadataAlignment && generated.metadataAlignment.targetReadinessEvidence === true),
      metadataStatus: generated.metadataAlignment && generated.metadataAlignment.status || null,
      layoutFramework: generated.layout && generated.layout.framework || null,
      taskCount: Array.isArray(generated.tasks) ? generated.tasks.length : 0,
    },
    rendered_shell: html.includes('data-golden-ticket-root')
      ? 'golden_exercise_workbench'
      : html.includes('exit-ticket-app')
        ? 'legacy_task_shell'
        : 'unknown',
    links_resolve: extractAnchors(html, pageAbs(paragraph, suffix))
      .filter((anchor) => anchor.exists !== null)
      .every((anchor) => anchor.exists === true),
  };
}

function buildSurfaceFacts() {
  const facts = {};
  for (const paragraph of paragraphs) {
    facts[paragraph.id] = {
      exit_ticket: surfaceFacts(paragraph, 'exit-ticket'),
      short_check: surfaceFacts(paragraph, 'korte-check'),
      expected_shells: {
        exit_ticket: paragraph.exit_shell,
        short_check: paragraph.short_shell,
      },
    };
  }
  return facts;
}

function buildCases() {
  const cases = [];
  for (const paragraph of paragraphs) {
    const base = paragraph.id.replace(/\./g, '');
    cases.push({
      id: `${base}-landing-desktop-light-overview`,
      paragraph: paragraph.id,
      surface: 'landing',
      path: pageRel(paragraph),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
      scroll_selector: '.route-strip',
    });
    cases.push({
      id: `${base}-landing-mobile-dark-exit-row`,
      paragraph: paragraph.id,
      surface: 'landing',
      path: pageRel(paragraph),
      theme: 'dark',
      viewport: { width: 390, height: 844 },
      scroll_selector: '#exit-ticket .tile',
    });
    cases.push({
      id: `${base}-short-check-desktop-light`,
      paragraph: paragraph.id,
      surface: 'short-check',
      path: pageRel(paragraph, 'korte-check'),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-exit-ticket-desktop-light-initial`,
      paragraph: paragraph.id,
      surface: 'exit-ticket',
      action: 'initial',
      path: pageRel(paragraph, 'exit-ticket'),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-exit-ticket-desktop-light-completed-feedback`,
      paragraph: paragraph.id,
      surface: 'exit-ticket',
      action: 'complete',
      path: pageRel(paragraph, 'exit-ticket'),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-exit-ticket-mobile-dark-completed-feedback`,
      paragraph: paragraph.id,
      surface: 'exit-ticket',
      action: 'complete',
      path: pageRel(paragraph, 'exit-ticket'),
      theme: 'dark',
      viewport: { width: 390, height: 844 },
    });
    cases.push({
      id: `${base}-practice-desktop-light-${paragraph.representative_practice_suffix}`,
      paragraph: paragraph.id,
      surface: 'practice',
      path: pageRel(paragraph, paragraph.representative_practice_suffix),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
  }
  for (const paragraph of sameCopyHygieneParagraphs) {
    const base = paragraph.id.replace(/\./g, '');
    cases.push({
      id: `${base}-landing-mobile-dark-exit-row-same-copy-hygiene`,
      paragraph: paragraph.id,
      surface: 'landing',
      action: 'same-copy-hygiene',
      path: pageRel(paragraph),
      theme: 'dark',
      viewport: { width: 390, height: 844 },
      scroll_selector: '#exit-ticket .tile',
      gate_claim: false,
    });
  }
  return cases;
}

function buildAuthorityIssues(routeInventory, captures) {
  const issues = [];
  for (const item of routeInventory.paragraphs) {
    const text = item.exit_row_text;
    const matches = Array.from(new Set((text.match(forbiddenAuthorityCopyRegex) || [])));
    if (matches.length > 0) {
      issues.push({
        id: `${item.paragraph}-landing-exit-copy-target-capability`,
        paragraph: item.paragraph,
        classification: 'blocks',
        severity: 'core_requirement_missing',
        surface: 'landing_exit_ticket_tile',
        matches,
        evidence: text,
        blocks: ['GATE-PRODUCT-3P closure', 'Scale Gate 1 closure', 'student/product use'],
        does_not_block: ['ordinary scoped repair work', 'readiness flag preservation'],
        proof_required_to_close: 'Replace capability/completion-style exit tile wording with neutral end-control, feedback, and next-step language while completionLanguageEligible remains false; recapture first-three rendered path proof.',
      });
    }
  }
  for (const capture of captures) {
    if (capture.inspection && capture.inspection.forbidden_authority_terms.length > 0) {
      issues.push({
        id: `${capture.id}-forbidden-authority-term`,
        paragraph: capture.paragraph,
        classification: 'blocks',
        severity: 'authority_boundary',
        surface: capture.surface,
        matches: capture.inspection.forbidden_authority_terms,
        evidence: capture.inspection.body_text_excerpt,
        blocks: ['GATE-PRODUCT-3P closure'],
        does_not_block: ['narrow evidence repair'],
        proof_required_to_close: 'Remove forbidden product/diagnostics/mastery/PV/Scale/student-use language and recapture the route.',
      });
    }
  }
  return issues;
}

function authorityBoundary() {
  return {
    product_route_adoption_authorized: false,
    product_use_authorized: false,
    student_product_use_authorized: false,
    scale_gate_1_authorized: false,
    diagnostics_authorized: false,
    mastery_or_sequencing_authorized: false,
    adaptive_routing_authorized: false,
    summative_use_authorized: false,
    pv_authorized: false,
    target_equivalent_completion_language_authorized: false,
  };
}

function writeScreenshotManifest(generated, captures) {
  const lines = [
    `# ${SPRINT_ID} Screenshot Manifest`,
    '',
    `Generated: ${generated}`,
    '',
    'Screenshots were captured from generated Book 1 output served from the local lesson worktree.',
    '',
    '| Case | Paragraph | Surface | Theme | Viewport | File |',
    '|---|---|---|---|---|---|',
  ];
  for (const item of captures) {
    lines.push(`| ${item.id} | ${item.paragraph} | ${item.surface}${item.action ? `/${item.action}` : ''} | ${item.theme} | ${item.viewport.width}x${item.viewport.height} | \`${item.screenshot.file}\` |`);
  }
  lines.push('');
  lines.push('Boundary: this manifest does not authorize product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, summative use, student/product use, or target-equivalent completion language.');
  lines.push('');
  return fsp.writeFile(screenshotManifestMdPath, lines.join('\n'), 'utf8');
}

function writeRouteInventory(generated, routeInventory, authorityCopyAudit) {
  const lines = [
    `# ${SPRINT_ID} Route Inventory`,
    '',
    `Generated: ${generated}`,
    '',
    '| Paragraph | Family | Resolved route links |',
    '|---|---|---|',
  ];
  for (const paragraph of routeInventory.paragraphs) {
    for (const family of routeInventory.required_families) {
      const links = paragraph.families[family]
        .filter((anchor) => anchor.exists !== null)
        .map((anchor) => `${anchor.text || anchor.href} -> ${anchor.target} (${anchor.exists ? 'exists' : 'missing'})`);
      lines.push(`| ${paragraph.paragraph} | ${family} | ${links.length ? links.join('<br>') : 'MISSING'} |`);
    }
  }
  lines.push('');
  lines.push('## Link Resolution');
  lines.push('');
  for (const paragraph of routeInventory.paragraphs) {
    lines.push(`- ${paragraph.paragraph}: ${paragraph.link_resolution.checked} local links checked; unresolved ${paragraph.link_resolution.unresolved.length}.`);
  }
  lines.push('');
  lines.push('## Exit Row Authority Copy');
  lines.push('');
  for (const paragraph of routeInventory.paragraphs) {
    lines.push(`- ${paragraph.paragraph}: ${paragraph.exit_row_text}`);
  }
  lines.push('');
  lines.push('## Authority Copy Audit');
  lines.push('');
  lines.push('First-three entries are part of the `GATE-PRODUCT-3P` evidence claim.');
  lines.push('');
  for (const paragraph of authorityCopyAudit.first_three_gate_claim) {
    lines.push(`- ${paragraph.paragraph}: neutral row=${paragraph.neutral_row_copy_present}; neutral tile=${paragraph.neutral_tile_copy_present}; forbidden absent=${paragraph.forbidden_authority_copy_absent}.`);
  }
  lines.push('');
  lines.push('Same-copy hygiene only; not part of the first-three gate claim.');
  lines.push('');
  for (const paragraph of authorityCopyAudit.same_copy_hygiene_not_gate_claim) {
    lines.push(`- ${paragraph.paragraph}: neutral row=${paragraph.neutral_row_copy_present}; neutral tile=${paragraph.neutral_tile_copy_present}; forbidden absent=${paragraph.forbidden_authority_copy_absent}; gate_claim=${paragraph.gate_claim}.`);
  }
  lines.push('');
  return fsp.writeFile(routeInventoryMdPath, lines.join('\n'), 'utf8');
}

async function captureCases(cdp, sessionId, serverPort, cases) {
  const captures = [];
  for (const config of cases) {
    await navigate(cdp, sessionId, serverPort, config);
    if (config.action === 'complete') {
      await driveCompletedState(cdp, sessionId, config.paragraph);
      await scrollToCompletionOrFeedback(cdp, sessionId);
    }
    const inspection = await inspectPage(cdp, sessionId, config.surface);
    const shot = await screenshot(cdp, sessionId, `${config.id}.png`);
    captures.push({
      ...config,
      screenshot: shot,
      inspection,
    });
    console.log(`captured ${config.id}: ${shot.file}`);
  }
  return captures;
}

function summarizeProof(routeInventory, surface_data, captures, authority_issues, authorityCopyAudit) {
  const exitFlags = Object.values(surface_data).map((item) => item.exit_ticket);
  const shortFlags = Object.values(surface_data).map((item) => item.short_check);
  const completedCaptures = captures.filter((item) => item.action === 'complete');
  return {
    all_required_route_families_present: routeInventory.paragraphs.every((item) => item.all_required_families_present),
    all_landing_links_resolve: routeInventory.paragraphs.every((item) => item.link_resolution.unresolved.length === 0),
    exit_tickets_target_readiness_approved: exitFlags.every(
      (item) =>
        item.source.gateApproved === true &&
        item.source.targetReadinessEvidence === true &&
        item.source.completionLanguageEligible === false &&
        item.source.metadataStatus === 'target_equivalent_aligned' &&
        item.generated.gateApproved === true &&
        item.generated.targetReadinessEvidence === true &&
        item.generated.completionLanguageEligible === false &&
        item.generated.metadataStatus === 'target_equivalent_aligned'
    ),
    short_checks_advisory_only: shortFlags.every(
      (item) =>
        item.source.surface === 'advisory_short_check' &&
        item.source.gateApproved === false &&
        item.source.targetReadinessEvidence === false &&
        item.source.completionLanguageEligible === false &&
        item.generated.surface === 'advisory_short_check' &&
        item.generated.gateApproved === false &&
        item.generated.targetReadinessEvidence === false &&
        item.generated.completionLanguageEligible === false
    ),
    expected_shells_confirmed:
      surface_data['1.1.1'].exit_ticket.rendered_shell === 'legacy_task_shell' &&
      surface_data['1.1.2'].exit_ticket.rendered_shell === 'golden_exercise_workbench' &&
      surface_data['1.1.3'].exit_ticket.rendered_shell === 'golden_exercise_workbench',
    rendered_desktop_mobile_dark_coverage: paragraphs.every((paragraph) => {
      const paragraphCaptures = captures.filter((item) => item.paragraph === paragraph.id);
      return (
        paragraphCaptures.some((item) => item.viewport.width === 1280 && item.theme === 'light') &&
        paragraphCaptures.some((item) => item.viewport.width === 390 && item.theme === 'dark')
      );
    }),
    completed_feedback_states_captured: paragraphs.every((paragraph) =>
      completedCaptures.some((item) => item.paragraph === paragraph.id && item.inspection.feedback_good_count > 0)
    ),
    target_completion_language_held_in_completed_exit_routes: completedCaptures.every((item) =>
      item.inspection.data_flags && item.inspection.data_flags.completionLanguageEligible === false
    ),
    no_broad_authority_terms_in_captures: captures.every((item) => item.inspection.forbidden_authority_terms.length === 0),
    first_three_landing_authority_copy_neutral: authorityCopyAudit.first_three_gate_claim.every(
      (item) =>
        item.neutral_row_copy_present === true &&
        item.neutral_tile_copy_present === true &&
        item.forbidden_authority_copy_absent === true
    ),
    same_copy_hygiene_114_neutral_not_gate_claim: authorityCopyAudit.same_copy_hygiene_not_gate_claim.every(
      (item) =>
        item.gate_claim === false &&
        item.neutral_row_copy_present === true &&
        item.neutral_tile_copy_present === true &&
        item.forbidden_authority_copy_absent === true
    ),
    authority_copy_issue_count: authority_issues.length,
  };
}

async function main() {
  if (!chromeExe) throw new Error(`Chromium executable not found. Tried: ${chromeCandidates.join(', ')}`);
  if (!fs.existsSync(bookRoot)) throw new Error(`Missing Book 1 root: ${bookRoot}`);
  await fsp.mkdir(screenshotDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofJsonPath), { recursive: true });

  const generated = new Date().toISOString();
  const routeInventory = buildRouteInventory();
  const authorityCopyAudit = buildAuthorityCopyAudit(routeInventory);
  const surfaceData = buildSurfaceFacts();
  const cases = buildCases();
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

  let cdp;
  try {
    const version = await waitForVersion(debugPort);
    cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const captures = await captureCases(cdp, sessionId, serverPort, cases);
    const authorityIssues = buildAuthorityIssues(routeInventory, captures);
    const status = authorityIssues.length > 0
      ? 'hold_for_authority_boundary_repair'
      : 'ready_for_human_gate_product_3p_review';
    const leadRecommendation = authorityIssues.length > 0
      ? 'HOLD_FOR_AUTHORITY_BOUNDARY_REPAIR'
      : 'READY_FOR_HUMAN_GATE_PRODUCT_3P_REVIEW';
    const proof = {
      schema_version: 1,
      sprint_id: SPRINT_ID,
      generated,
      status,
      lead_recommendation: leadRecommendation,
      source_route: {
        platform_root: platformRoot,
        book_root: bookRoot,
        local_server: `http://127.0.0.1:${serverPort}`,
      },
      product_end_state_ref: '../4veco-lessen/specifications/product-end-state.md',
      original_gate_spec_ref: '../4veco-lessen/specifications/companion-core-specifications.md',
      authority: authorityBoundary(),
      route_inventory: routeInventory,
      authority_copy_audit: authorityCopyAudit,
      surface_data: surfaceData,
      screenshots: captures,
      screenshot_manifest: rel(screenshotManifestMdPath),
      screenshot_manifest_json: rel(screenshotManifestJsonPath),
      route_inventory_markdown: rel(routeInventoryMdPath),
      authority_issues: authorityIssues,
      proof: summarizeProof(routeInventory, surfaceData, captures, authorityIssues, authorityCopyAudit),
      next_repair_sprint: authorityIssues.length > 0
        ? SPRINT_ID
        : null,
    };

    await fsp.writeFile(
      screenshotManifestJsonPath,
      `${JSON.stringify({ schema_version: 1, sprint_id: SPRINT_ID, generated, screenshots: captures }, null, 2)}\n`,
      'utf8'
    );
    await writeScreenshotManifest(generated, captures);
    await writeRouteInventory(generated, routeInventory, authorityCopyAudit);
    await fsp.writeFile(proofJsonPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
    console.log(`wrote ${rel(proofJsonPath)} (${status})`);
  } finally {
    if (cdp) cdp.close();
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
