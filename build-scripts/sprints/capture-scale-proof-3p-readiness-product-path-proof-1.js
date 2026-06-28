#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const A96ProofData = require('./mtu-ans-proof-impl1-a96-data');

const SPRINT_ID = 'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1';
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
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'scale-proof-3p-readiness-product-path-proof-1-proof.json');

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
    exit_shell: 'golden_exercise_workbench',
    short_shell: 'golden_exercise_workbench',
    representative_practice_suffix: 'redeneer-spel',
    start_suffix: 'instapquiz',
    learn_suffix: 'uitleg vaardigheden',
    skill_map_suffix: 'wiskundevaardigheden',
    normal_practice_suffix: 'opgaven',
  },
  {
    id: '1.1.2',
    dir: '1.1.2 Percentages en indexcijfers',
    exit_shell: 'golden_exercise_workbench',
    short_shell: 'golden_exercise_workbench',
    representative_practice_suffix: 'wiskundevaardigheden',
    start_suffix: 'instapquiz',
    learn_suffix: 'uitleg vaardigheden',
    skill_map_suffix: 'wiskundevaardigheden',
    normal_practice_suffix: 'opgaven',
  },
  {
    id: '1.1.3',
    dir: '1.1.3 Grafieken en tabellen',
    exit_shell: 'golden_exercise_workbench',
    short_shell: 'golden_exercise_workbench',
    representative_practice_suffix: 'grafiekenspel',
    start_suffix: 'instapquiz',
    learn_suffix: 'uitleg vaardigheden',
    skill_map_suffix: 'wiskundevaardigheden',
    normal_practice_suffix: 'opgaven',
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
          : (${JSON.stringify(['practice', 'start', 'learn', 'skill-map', 'normal-practice'].includes(surface))}
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

async function driveGolden111Complete(cdp, sessionId) {
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
      'tarwe-opbrengst': { work: '500 x 10', finalAnswer: '5000', unitNotation: 'euro' },
      'alternatieve-kosten-mais': { work: '350 x 10', finalAnswer: '3500', unitNotation: 'euro' },
      'buurvrouw-gemengd': { work: '500 x 6 plus 350 x 4 = 4400', finalAnswer: '4400', unitNotation: 'euro' }
    };
    Object.keys(correct).forEach((id) => fillCalculation(id, correct[id]));
    const structured = step('betere-keuze-uitleg');
    const fields = { boer: '5000 euro', buurvrouw: '4400 euro', schaarste: 'grond is schaars' };
    Object.keys(fields).forEach((id) => {
      inputValue(structured.querySelector('[data-ge-structured-field][data-field-id="' + id + '"]'), fields[id]);
    });
    click(structured.querySelector('[data-ge-structured-choice][data-option-id="boer-beter"]'));
    click(document.querySelector('[data-ge-check-all]'));
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveGolden111Complete');
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
    function fillAnswerForm(id, values) {
      const el = step(id);
      values.methodTokens.forEach((tokenId) => {
        click(el.querySelector('[data-ge-formula-token-id="' + tokenId + '"]'));
      });
      Object.keys(values.substitution).forEach((fieldId) => {
        inputValue(el.querySelector('[data-ge-substitution-field][data-field-id="' + fieldId + '"]'), values.substitution[fieldId]);
      });
      inputValue(el.querySelector('[data-ge-final-answer]'), values.finalAnswer);
      inputValue(el.querySelector('[data-ge-unit-notation]'), values.notation || '');
      inputValue(el.querySelector('[data-ge-conclusion]'), values.conclusion);
    }
    fillAnswerForm('prijsstijging-procent', {
      methodTokens: ['open','newPrice','minus','oldPrice','close','divide','oldPrice','times100'],
      substitution: { newPrice: '920', oldPriceNumerator: '800', oldPriceDenominator: '800' },
      finalAnswer: '15',
      notation: '%',
      conclusion: 'De prijs van de fiets stijgt met 15 procent.'
    });
    const correct = {
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

async function driveGolden112A96State(cdp, sessionId, response, options = {}) {
  const script = `(() => {
    function click(el) {
      if (!el) throw new Error('Missing clickable element');
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
    function inputValue(el, value) {
      if (!el) throw new Error('Missing input element');
      el.value = value == null ? '' : String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const response = ${JSON.stringify(response || {})};
    const step = document.querySelector('[data-task-id="prijsstijging-procent"]');
    if (!step) throw new Error('Missing A96 answer-form step');
    (response.methodTokens || []).forEach((tokenId) => {
      click(step.querySelector('[data-ge-formula-token-id="' + tokenId + '"]'));
    });
    const substitution = response.substitution || {};
    Object.keys(substitution).forEach((fieldId) => {
      inputValue(step.querySelector('[data-ge-substitution-field][data-field-id="' + fieldId + '"]'), substitution[fieldId]);
    });
    inputValue(step.querySelector('[data-ge-final-answer]'), response.finalAnswer || '');
    inputValue(step.querySelector('[data-ge-unit-notation]'), response.notation || '');
    inputValue(step.querySelector('[data-ge-conclusion]'), response.conclusion || '');
    click(step.querySelector('[data-ge-check-task]'));
    if (${JSON.stringify(options.exemplarComparison === true)}) {
      const existing = document.querySelector('[data-a96-exemplar-comparison]');
      if (existing) existing.remove();
      const panel = document.createElement('section');
      panel.setAttribute('data-a96-exemplar-comparison', 'true');
      panel.style.cssText = 'margin:16px 0;padding:16px;border:2px solid #0f766e;background:#fff;color:#111;display:grid;grid-template-columns:1fr 1fr;gap:12px;font:14px system-ui,sans-serif;';
      panel.innerHTML =
        '<div><h3 style="margin:0 0 8px;font-size:16px;">Rendered A96 response</h3>' +
        '<p>Formula: (nieuwe prijs - oude prijs) / oude prijs x 100%</p>' +
        '<p>Substitution: (920 - 800) / 800 x 100%</p>' +
        '<p>Answer: 15%</p>' +
        '<p>Conclusion: De prijs van de fiets stijgt met 15 procent.</p></div>' +
        '<div><h3 style="margin:0 0 8px;font-size:16px;">A96 v3 exemplar</h3>' +
        '<p>Required: formula or calculation method</p>' +
        '<p>Required: labelled substitution with source values</p>' +
        '<p>Required: final answer plus percent notation</p>' +
        '<p>Required: contextual direction sentence</p></div>';
      step.after(panel);
      panel.scrollIntoView({ block: 'center', inline: 'nearest' });
    } else {
      step.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveGolden112A96State');
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

async function driveAdvisoryShortCheckComplete(cdp, sessionId, paragraphId) {
  const choices = {
    '1.1.1': {
      'schaarste-kern': 'b',
      'middel-herkennen': 'a',
      'alternatieve-kosten': 'b',
      'gratis-is-niet-gratis': 'a',
    },
    '1.1.2': {
      'oude-waarde-als-basis': 'a',
      'index-zonder-procent': 'b',
      'indexpunten-niet-procent': 'a',
    },
  }[paragraphId];
  if (!choices) return undefined;
  const script = `(() => {
    const choices = ${JSON.stringify(choices)};
    function click(el) {
      if (!el) throw new Error('Missing clickable element');
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
    Object.keys(choices).forEach((taskId) => {
      const step = document.querySelector('[data-task-id="' + taskId + '"]');
      if (!step) throw new Error('Missing advisory step ' + taskId);
      click(step.querySelector('[data-ge-choice-option][data-option-id="' + choices[taskId] + '"]'));
    });
    click(document.querySelector('[data-ge-check-all]'));
  })()`;
  await runPageScript(cdp, sessionId, script, `driveAdvisoryShortCheckComplete:${paragraphId}`);
  await sleep(500);
}

async function driveGraphAdvisoryShortCheckComplete(cdp, sessionId) {
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
    clickPoint('250', '2.5');
    clickPoint('150', '3.5');
    document.querySelector('[data-ge-check-graph]').click();
    document.querySelector('[data-ge-pill-group="read-interval"][data-option-id="250-300"]').click();
    setInput('[data-ge-read-q]', '225');
    document.querySelector('[data-ge-check-reading]').click();
    document.querySelector('[data-ge-route-choice-option][data-option-id="tabel-naar-grafiek"]').click();
    document.querySelector('[data-ge-check-route-choice]').click();
  })()`;
  await runPageScript(cdp, sessionId, script, 'driveGraphAdvisoryShortCheckComplete');
  await sleep(500);
}

async function driveCompletedState(cdp, sessionId, paragraphId) {
  if (paragraphId === '1.1.1') return driveGolden111Complete(cdp, sessionId);
  if (paragraphId === '1.1.2') return driveGolden112Complete(cdp, sessionId);
  if (paragraphId === '1.1.3') return driveGolden113Complete(cdp, sessionId);
  return undefined;
}

async function driveShortCheckCompletedState(cdp, sessionId, paragraphId) {
  if (paragraphId === '1.1.3') return driveGraphAdvisoryShortCheckComplete(cdp, sessionId);
  return driveAdvisoryShortCheckComplete(cdp, sessionId, paragraphId);
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

async function scrollToA96AnswerForm(cdp, sessionId) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        const step = document.querySelector('[data-task-id="prijsstijging-procent"]');
        if (!step) return false;
        const el =
          step.querySelector('[data-ge-formula-token-id]') ||
          step.querySelector('[data-ge-substitution-field]') ||
          step.querySelector('[data-ge-final-answer]') ||
          step;
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        return true;
      })()`,
      returnByValue: true,
    },
    sessionId
  );
  await sleep(250);
}

async function scrollToA96Feedback(cdp, sessionId) {
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        const step = document.querySelector('[data-task-id="prijsstijging-procent"]');
        if (!step) return false;
        const candidates = [
          '.ge-feedback.is-visible',
          '[data-ge-answer-form-feedback]:not([hidden])',
          '[data-ge-check-task]',
          '[data-ge-conclusion]',
          '[data-ge-final-answer]'
        ];
        const el = candidates.map((selector) => step.querySelector(selector)).find(Boolean);
        if (!el) return false;
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        return true;
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
      const isVisible = (node) => {
        if (!node) return false;
        const style = getComputedStyle(node);
        if (node.hidden || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || 1) === 0) return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      };
      const feedback = Array.from(document.querySelectorAll('.et-feedback, .ge-feedback.is-visible')).map((node) => ({
        selector: node.className || node.getAttribute('data-ge-feedback') || '',
        tone: node.classList.contains('is-good') || node.classList.contains('is-match') ? 'good' :
          node.classList.contains('is-warn') || node.classList.contains('is-retry') ? 'warn' :
          node.classList.contains('is-bad') ? 'bad' : 'unknown',
        text: node.innerText.replace(/\\s+/g, ' ').trim(),
        visible_in_viewport: isVisible(node)
      }));
      const completionNodes = Array.from(document.querySelectorAll('[data-ge-completion], .et-completion, [data-completion]')).map((node) => ({
        text: node.innerText.replace(/\\s+/g, ' ').trim(),
        hidden: node.hidden || getComputedStyle(node).display === 'none' || getComputedStyle(node).visibility === 'hidden',
        className: node.className || '',
        visible: !(node.hidden || getComputedStyle(node).display === 'none' || getComputedStyle(node).visibility === 'hidden')
      }));
      const a96Step = document.querySelector('[data-task-id="prijsstijging-procent"]');
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
        a96_answer_form: a96Step ? {
          present: a96Step.hasAttribute('data-ge-answer-form-task'),
          family: a96Step.getAttribute('data-task-family'),
          formula_token_count: a96Step.querySelectorAll('[data-ge-formula-token-id]').length,
          selected_formula_token_count: a96Step.querySelectorAll('[data-ge-selected-formula-token-id]').length,
          substitution_field_ids: Array.from(a96Step.querySelectorAll('[data-ge-substitution-field]')).map((node) => node.getAttribute('data-field-id')),
          substitution_placeholders: Array.from(a96Step.querySelectorAll('[data-ge-substitution-field]')).map((node) => node.getAttribute('placeholder') || ''),
          answer_giving_placeholder_count: Array.from(a96Step.querySelectorAll('[data-ge-substitution-field]'))
            .map((node) => node.getAttribute('placeholder') || '')
            .filter((value) => /^(?:920|800)$/.test(value.trim())).length,
          final_answer_field_present: Boolean(a96Step.querySelector('[data-ge-final-answer]')),
          notation_field_present: Boolean(a96Step.querySelector('[data-ge-unit-notation]')),
          conclusion_field_present: Boolean(a96Step.querySelector('[data-ge-conclusion]')),
          old_work_textarea_present: Boolean(a96Step.querySelector('[data-ge-work]')),
          missing_feedback_count: a96Step.querySelectorAll('[data-ge-answer-form-feedback] li').length,
          missing_feedback_text: Array.from(a96Step.querySelectorAll('[data-ge-answer-form-feedback] li'))
            .map((node) => node.innerText.replace(/\\s+/g, ' ').trim()),
          answer_form_visible_in_viewport: Array.from(a96Step.querySelectorAll('[data-ge-formula-token-id], [data-ge-substitution-field], [data-ge-final-answer], [data-ge-unit-notation], [data-ge-conclusion]'))
            .some(isVisible),
          feedback_visible_in_viewport: Array.from(a96Step.querySelectorAll('.ge-feedback.is-visible, [data-ge-answer-form-feedback]:not([hidden])'))
            .some(isVisible),
          exemplar_comparison_present: Boolean(document.querySelector('[data-a96-exemplar-comparison]'))
        } : null,
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

function taskShellFamily(task) {
  if (task && task.taskShell && task.taskShell.family) return task.taskShell.family;
  return task && task.family || task && task.type || null;
}

function taskShellById(data, id) {
  const wrapper = (data.tasks || []).find((task) => task && task.id === id);
  return wrapper && wrapper.taskShell || null;
}

function hasNoDuplicateAnswerTokenLabels(task) {
  const labels = new Map();
  const tokens = (((task || {}).interaction || {}).formula || {}).tokens || [];
  for (const token of tokens) {
    if (token.kind !== 'answer') continue;
    const label = String(token.label || '').trim().toLowerCase();
    if (!label) continue;
    if (labels.has(label) && labels.get(label) !== token.id) return false;
    labels.set(label, token.id);
  }
  return true;
}

function a96AnswerFormReady(data) {
  const task = taskShellById(data, 'prijsstijging-procent');
  if (!task || task.family !== 'calculation_answer_form_capture') return false;
  const expected = task.expected || {};
  const formula = ((task.interaction || {}).formula || {});
  const displayOrder = (formula.tokens || []).map((token) => token.id);
  const methodTokens = expected.methodTokens || [];
  const oldPriceToken = (formula.tokens || []).find((token) => token.id === 'oldPrice');
  const requiredFields = ['newPrice', 'oldPriceNumerator', 'oldPriceDenominator'];
  const substitutionFields = (((task.interaction || {}).substitution || {}).fields || []).map((field) => field.id);
  return (
    expected.kind === 'calculation_answer_form' &&
    JSON.stringify(methodTokens) === JSON.stringify(['open', 'newPrice', 'minus', 'oldPrice', 'close', 'divide', 'oldPrice', 'times100']) &&
    JSON.stringify(displayOrder) !== JSON.stringify(methodTokens) &&
    oldPriceToken && oldPriceToken.maxUses === 2 &&
    requiredFields.every((fieldId) => substitutionFields.includes(fieldId)) &&
    expected.substitution &&
    expected.substitution.oldPriceDenominator &&
    expected.substitution.oldPriceDenominator.value === 800 &&
    expected.notation &&
    expected.notation.required === true &&
    expected.answerFormProof &&
    expected.answerFormProof.unit_id === 'A96' &&
    expected.answerFormProof.route_specific === true &&
    hasNoDuplicateAnswerTokenLabels(task)
  );
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
      taskFamilies: Array.isArray(source.tasks) ? source.tasks.map(taskShellFamily).filter(Boolean) : [],
      a96AnswerFormReady: key === '1.1.2-exit-ticket' ? a96AnswerFormReady(source) : null,
    },
    generated: {
      surface: generated.surface,
      gateApproved: Boolean(generated.targetEquivalent && generated.targetEquivalent.gateApproved === true),
      completionLanguageEligible: Boolean(generated.targetEquivalent && generated.targetEquivalent.completionLanguageEligible === true),
      targetReadinessEvidence: Boolean(generated.metadataAlignment && generated.metadataAlignment.targetReadinessEvidence === true),
      metadataStatus: generated.metadataAlignment && generated.metadataAlignment.status || null,
      layoutFramework: generated.layout && generated.layout.framework || null,
      taskCount: Array.isArray(generated.tasks) ? generated.tasks.length : 0,
      taskFamilies: Array.isArray(generated.tasks) ? generated.tasks.map(taskShellFamily).filter(Boolean) : [],
      a96AnswerFormReady: key === '1.1.2-exit-ticket' ? a96AnswerFormReady(generated) : null,
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
      id: `${base}-start-desktop-light-${paragraph.start_suffix.replace(/\s+/g, '-')}`,
      paragraph: paragraph.id,
      surface: 'start',
      path: pageRel(paragraph, paragraph.start_suffix),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-learn-desktop-light-${paragraph.learn_suffix.replace(/\s+/g, '-')}`,
      paragraph: paragraph.id,
      surface: 'learn',
      path: pageRel(paragraph, paragraph.learn_suffix),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-skill-map-desktop-light-${paragraph.skill_map_suffix.replace(/\s+/g, '-')}`,
      paragraph: paragraph.id,
      surface: 'skill-map',
      path: pageRel(paragraph, paragraph.skill_map_suffix),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-normal-practice-desktop-light-${paragraph.normal_practice_suffix.replace(/\s+/g, '-')}`,
      paragraph: paragraph.id,
      surface: 'normal-practice',
      path: pageRel(paragraph, paragraph.normal_practice_suffix),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-short-check-desktop-light`,
      paragraph: paragraph.id,
      surface: 'short-check',
      action: 'initial',
      path: pageRel(paragraph, 'korte-check'),
      theme: 'light',
      viewport: { width: 1280, height: 900 },
    });
    cases.push({
      id: `${base}-short-check-desktop-light-completed-feedback`,
      paragraph: paragraph.id,
      surface: 'short-check',
      action: 'complete',
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
    if (paragraph.id === '1.1.2') {
      cases.push({
        id: `${base}-exit-ticket-mobile-light-initial`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'initial',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 390, height: 844 },
        a96_scroll: 'answer-form',
      });
      cases.push({
        id: `${base}-exit-ticket-desktop-dark-initial`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'initial',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'dark',
        viewport: { width: 1280, height: 900 },
      });
      cases.push({
        id: `${base}-a96-partial-wrong-formula-feedback`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-partial-wrong-formula',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: {
          ...A96ProofData.passingResponse,
          methodTokens: ['open', 'newPrice', 'plus']
        },
        expected_missing_parts: ['formula'],
      });
      cases.push({
        id: `${base}-a96-wrong-denominator-feedback`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-wrong-denominator',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.negativeResponses.wrongDenominator,
        expected_missing_parts: ['substitution'],
      });
      cases.push({
        id: `${base}-a96-missing-substitution-feedback`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-missing-substitution',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.negativeResponses.missingSubstitution,
        expected_missing_parts: ['substitution'],
      });
      cases.push({
        id: `${base}-a96-missing-notation-feedback`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-missing-notation',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.negativeResponses.missingNotation,
        expected_missing_parts: ['notation'],
      });
      cases.push({
        id: `${base}-a96-missing-parts-feedback-list`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-missing-parts-feedback',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.negativeResponses.finalAnswerOnly,
        expected_missing_parts: ['formula', 'substitution'],
      });
      cases.push({
        id: `${base}-a96-correct-response-feedback`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-correct-response',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.passingResponse,
        expected_missing_parts: [],
      });
      cases.push({
        id: `${base}-a96-v3-exemplar-comparison`,
        paragraph: paragraph.id,
        surface: 'exit-ticket',
        action: 'a96-exemplar-comparison',
        path: pageRel(paragraph, 'exit-ticket'),
        theme: 'light',
        viewport: { width: 1280, height: 900 },
        a96_response: A96ProofData.passingResponse,
        exemplar_comparison: true,
        expected_missing_parts: [],
      });
    }
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
        blocks: ['SCALE-PROOF-3P readiness packet', 'Scale Gate 1 preparation'],
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
    if (config.action === 'complete' && config.surface === 'exit-ticket') {
      await driveCompletedState(cdp, sessionId, config.paragraph);
      await scrollToCompletionOrFeedback(cdp, sessionId);
    }
    if (config.action === 'complete' && config.surface === 'short-check') {
      await driveShortCheckCompletedState(cdp, sessionId, config.paragraph);
      await scrollToCompletionOrFeedback(cdp, sessionId);
    }
    if (config.a96_response && config.surface === 'exit-ticket' && config.paragraph === '1.1.2') {
      await driveGolden112A96State(cdp, sessionId, config.a96_response, {
        exemplarComparison: config.exemplar_comparison === true,
      });
      if (config.exemplar_comparison !== true) {
        await scrollToA96Feedback(cdp, sessionId);
      }
    } else if (config.a96_scroll === 'answer-form' && config.surface === 'exit-ticket' && config.paragraph === '1.1.2') {
      await scrollToA96AnswerForm(cdp, sessionId);
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

function a96RenderedProofReady(surface_data, captures) {
  const exit112 = surface_data['1.1.2'] && surface_data['1.1.2'].exit_ticket;
  if (!exit112 || exit112.source.a96AnswerFormReady !== true || exit112.generated.a96AnswerFormReady !== true) {
    return false;
  }
  const rendered = captures.filter((item) => item.paragraph === '1.1.2' && item.surface === 'exit-ticket');
  if (!rendered.length) return false;
  const allRenderedControlsPresent = rendered.every((item) => {
    const proof = item.inspection && item.inspection.a96_answer_form;
    return proof &&
      proof.present === true &&
      proof.family === 'calculation_answer_form_capture' &&
      proof.formula_token_count >= 8 &&
      proof.substitution_field_ids.includes('newPrice') &&
      proof.substitution_field_ids.includes('oldPriceNumerator') &&
      proof.substitution_field_ids.includes('oldPriceDenominator') &&
      proof.answer_giving_placeholder_count === 0 &&
      proof.final_answer_field_present === true &&
      proof.notation_field_present === true &&
      proof.conclusion_field_present === true &&
      proof.old_work_textarea_present === false;
  });
  if (!allRenderedControlsPresent) return false;

  const byAction = new Map(rendered.map((item) => [item.action, item]));
  const requiredInitialStates = [
    byAction.get('initial'),
    rendered.find((item) => item.action === 'initial' && item.viewport.width === 390),
    rendered.find((item) => item.action === 'initial' && item.theme === 'dark'),
  ];
  if (requiredInitialStates.some((item) => !item)) return false;

  const negativeActions = [
    'a96-partial-wrong-formula',
    'a96-wrong-denominator',
    'a96-missing-substitution',
    'a96-missing-notation',
    'a96-missing-parts-feedback',
  ];
  const negativesReady = negativeActions.every((action) => {
    const item = byAction.get(action);
    const proof = item && item.inspection && item.inspection.a96_answer_form;
    return proof && proof.missing_feedback_count > 0;
  });
  if (!negativesReady) return false;

  const correct = byAction.get('a96-correct-response');
  const correctProof = correct && correct.inspection && correct.inspection.a96_answer_form;
  if (!correct || correct.inspection.feedback_good_count <= 0 || !correctProof || correctProof.missing_feedback_count !== 0) {
    return false;
  }

  const completed = rendered.find((item) => item.action === 'complete' && item.inspection.data_flags && item.inspection.data_flags.completionLanguageEligible === false);
  if (!completed) return false;

  const exemplar = byAction.get('a96-exemplar-comparison');
  const exemplarProof = exemplar && exemplar.inspection && exemplar.inspection.a96_answer_form;
  return Boolean(exemplarProof && exemplarProof.exemplar_comparison_present === true);
}

function summarizeProof(routeInventory, surface_data, captures, authority_issues, authorityCopyAudit) {
  const exitFlags = Object.values(surface_data).map((item) => item.exit_ticket);
  const shortFlags = Object.values(surface_data).map((item) => item.short_check);
  const completedCaptures = captures.filter((item) => item.action === 'complete');
  const a96Ready = a96RenderedProofReady(surface_data, captures);
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
    all_first_three_check_exit_surfaces_golden: Object.values(surface_data).every(
      (item) =>
        item.exit_ticket.rendered_shell === 'golden_exercise_workbench' &&
        item.short_check.rendered_shell === 'golden_exercise_workbench'
    ),
    start_learn_oefen_skill_practice_captured: paragraphs.every((paragraph) => {
      const paragraphCaptures = captures.filter((item) => item.paragraph === paragraph.id);
      return ['start', 'learn', 'skill-map', 'normal-practice', 'practice'].every((surface) =>
        paragraphCaptures.some((item) => item.surface === surface && item.viewport.width === 1280)
      );
    }),
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
    advisory_feedback_states_captured: paragraphs.every((paragraph) =>
      captures.some(
        (item) =>
          item.paragraph === paragraph.id &&
          item.surface === 'short-check' &&
          item.action === 'complete' &&
          item.inspection.feedback_good_count > 0
      )
    ),
    a96_dedicated_rendered_states_ready: a96Ready,
    a96_calculation_answer_form_refinement_ready: a96Ready,
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

function scaleGateReadiness(proofSummary, authorityIssues) {
  const productPathEvidenceReady =
    proofSummary.all_required_route_families_present === true &&
    proofSummary.all_landing_links_resolve === true &&
    proofSummary.exit_tickets_target_readiness_approved === true &&
    proofSummary.short_checks_advisory_only === true &&
    proofSummary.all_first_three_check_exit_surfaces_golden === true &&
    proofSummary.start_learn_oefen_skill_practice_captured === true &&
    proofSummary.rendered_desktop_mobile_dark_coverage === true &&
    proofSummary.completed_feedback_states_captured === true &&
    proofSummary.advisory_feedback_states_captured === true &&
    proofSummary.target_completion_language_held_in_completed_exit_routes === true &&
    proofSummary.no_broad_authority_terms_in_captures === true &&
    proofSummary.first_three_landing_authority_copy_neutral === true;
  const scaleGateReadyForHumanReview =
    productPathEvidenceReady &&
    proofSummary.a96_calculation_answer_form_refinement_ready === true &&
    authorityIssues.length === 0;

  return {
    product_path_evidence_ready_for_human_review: productPathEvidenceReady && authorityIssues.length === 0,
    scale_gate_1_ready_for_human_review: scaleGateReadyForHumanReview,
    scale_gate_1_ready: scaleGateReadyForHumanReview,
    scale_gate_1_authority_status: scaleGateReadyForHumanReview
      ? 'READY_FOR_HUMAN_REVIEW_NOT_AUTHORIZED'
      : 'HELD_PENDING_REPAIR',
    scale_gate_1_hold_reason: scaleGateReadyForHumanReview
      ? null
      : proofSummary.a96_calculation_answer_form_refinement_ready === true
        ? 'AUTHORITY_BOUNDARY_REPAIR_REQUIRED'
        : 'A96_CALCULATION_ANSWER_FORM_REFINEMENT_REQUIRED_OR_HUMAN_WAIVER',
    a96_calculation_answer_form_refinement_ready: proofSummary.a96_calculation_answer_form_refinement_ready === true,
    product_route_adoption_authorized: false,
    diagnostics_mastery_pv_student_use_authorized: false,
    claim_scope: 'first_three_paragraphs_rendered_product_path_only',
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
    const proofSummary = summarizeProof(routeInventory, surfaceData, captures, authorityIssues, authorityCopyAudit);
    const scaleReadiness = scaleGateReadiness(proofSummary, authorityIssues);
    const status = authorityIssues.length > 0
      ? 'hold_for_authority_boundary_repair'
      : scaleReadiness.scale_gate_1_ready_for_human_review
        ? 'scale_gate_1_ready_for_human_review'
        : 'scale_proof_3p_product_path_ready_with_a96_hold';
    const leadRecommendation = authorityIssues.length > 0
      ? 'HOLD_FOR_AUTHORITY_BOUNDARY_REPAIR'
      : scaleReadiness.scale_gate_1_ready_for_human_review
        ? 'READY_FOR_HUMAN_SCALE_GATE_1_REVIEW'
        : 'HOLD_FOR_A96_CALCULATION_REFINEMENT_FOR_SCALE_GATE_1';
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
      proof: proofSummary,
      scale_gate_readiness: scaleReadiness,
      next_repair_sprint: authorityIssues.length > 0
        ? SPRINT_ID
        : scaleReadiness.scale_gate_1_ready_for_human_review
          ? null
          : 'A96-CALCULATION-ANSWER-FORM-REFINEMENT-1',
      next_gate_action: scaleReadiness.scale_gate_1_ready_for_human_review
        ? 'Human Scale Gate 1 review may evaluate closure; no product/student-use authority is granted by this proof.'
        : 'Repair remaining hold and recapture proof.',
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
