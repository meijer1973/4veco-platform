#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SPRINT_ID = 'B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.B1_111_BOOK_ROOT ||
    process.env.LESSON_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const paragraphPath = [
  '1.1 Hoofdstuk Economisch denken en rekenen',
  '1.1.1 Schaarste en economisch denken',
].join('/');
const pagePath = [
  paragraphPath,
  '1.1.1 Schaarste en economisch denken \u2013 exit-ticket.html',
].join('/');
const landingPath = [paragraphPath, 'index.html'].join('/');
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'b1-target-evidence-111-rendered-closure-and-flag-bundle-1-proof.json');
const proofMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-rendered-proof.md`);

const cases = [
  { case: 'desktop-light-initial', route: 'exit-ticket', action: 'initial', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-wrong-retry', route: 'exit-ticket', action: 'wrong-retry', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'desktop-light-completed-held', route: 'exit-ticket', action: 'complete', size: { width: 1280, height: 900 }, theme: 'light' },
  { case: 'mobile-light-initial', route: 'exit-ticket', action: 'initial', size: { width: 390, height: 844 }, theme: 'light' },
  { case: 'mobile-light-completed-held', route: 'exit-ticket', action: 'complete', size: { width: 390, height: 844 }, theme: 'light' },
  { case: 'mobile-dark-initial', route: 'exit-ticket', action: 'initial', size: { width: 390, height: 844 }, theme: 'dark' },
  { case: 'mobile-dark-completed-held', route: 'exit-ticket', action: 'complete', size: { width: 390, height: 844 }, theme: 'dark' },
  { case: 'route-reload-completed-held', route: 'exit-ticket', action: 'route-reload-complete', size: { width: 1280, height: 900 }, theme: 'dark' },
  { case: 'landing-mobile-light-neutral', route: 'landing', action: 'initial', size: { width: 390, height: 844 }, theme: 'light' },
  { case: 'landing-desktop-dark-neutral', route: 'landing', action: 'initial', size: { width: 1280, height: 900 }, theme: 'dark' },
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

function urlFor(serverPort, route) {
  const relative = route === 'landing' ? landingPath : pagePath;
  return `http://127.0.0.1:${serverPort}/` + relative.split('/').map(encodeURIComponent).join('/');
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

async function waitForExitTicket(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(
      cdp,
      sessionId,
      `Boolean(window.EXIT_TICKET_DATA && window.ExitTicketEngine && window.ExitTicketUI && document.querySelector('#exit-ticket-app .et-task-shell'))`
    );
    if (ready === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for 1.1.1 exit-ticket route');
}

async function waitForLanding(cdp, sessionId) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(
      cdp,
      sessionId,
      `Boolean(document.querySelector('[data-route-layer="exit-ticket"]') && document.querySelector('.content'))`
    );
    if (ready === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for 1.1.1 landing route');
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
  await cdp.send('Page.navigate', { url: urlFor(serverPort, item.route) }, sessionId);
  if (item.route === 'landing') await waitForLanding(cdp, sessionId);
  else await waitForExitTicket(cdp, sessionId);
  await setTheme(cdp, sessionId, item.theme);
  await sleep(350);
}

async function driveExitTicket(cdp, sessionId, action) {
  if (action === 'initial') return;
  if (action === 'route-reload-complete') {
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
    await waitForExitTicket(cdp, sessionId);
    await setTheme(cdp, sessionId, 'dark');
    await sleep(350);
    return driveExitTicket(cdp, sessionId, 'complete');
  }

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
    const action = ${JSON.stringify(action)};
    const correct = {
      'tarwe-opbrengst': { work: '500 x 10', finalAnswer: '5000', unitNotation: 'euro' },
      'alternatieve-kosten-mais': { work: '350 x 10', finalAnswer: '3500', unitNotation: 'euro' },
      'buurvrouw-gemengd': { work: '500 x 6 plus 350 x 4 = 4400', finalAnswer: '4400', unitNotation: 'euro' }
    };
    const structured = {
      fields: {
        boer: '5000 euro',
        buurvrouw: '4400 euro',
        schaarste: 'grond is schaars'
      },
      choice: 'boer-beter'
    };
    if (action === 'wrong-retry') {
      fillCalculation('tarwe-opbrengst', { work: 'ik gok', finalAnswer: '5000', unitNotation: 'euro' });
      check('tarwe-opbrengst');
      return;
    }
    if (action === 'complete') {
      Object.keys(correct).forEach((id) => {
        fillCalculation(id, correct[id]);
        check(id);
      });
      fillStructured(structured);
      check('betere-keuze-uitleg');
    }
  })()`;

  await cdp.send('Runtime.evaluate', { expression: script, returnByValue: true }, sessionId);
  await sleep(500);
}

async function inspectExitTicket(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const loaded = Array.from(document.querySelectorAll('link[href], script[src]'))
        .map((node) => node.getAttribute('href') || node.getAttribute('src'));
      const bodyText = document.body.innerText.replace(/\\s+/g, ' ').trim();
      const placeholders = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder]'))
        .map((node) => node.getAttribute('placeholder') || '');
      const feedback = Array.from(document.querySelectorAll('.et-feedback')).map((node) => ({
        id: node.id.replace(/^feedback-/, ''),
        className: node.className,
        isMatch: node.classList.contains('is-match'),
        isRetry: node.classList.contains('is-retry'),
        text: node.innerText.replace(/\\s+/g, ' ').trim()
      }));
      const taskStates = Array.from(document.querySelectorAll('article.et-task-shell[data-task]')).map((node) => {
        const id = node.getAttribute('data-task');
        const item = feedback.find((entry) => entry.id === id);
        return {
          id,
          family: window.EXIT_TICKET_DATA?.tasks?.find((task) => task.id === id)?.taskShell?.family || null,
          feedbackClass: item ? item.className : '',
          matched: item ? item.isMatch : false,
          retry: item ? item.isRetry : false
        };
      });
      const completion = document.querySelector('#et-completion');
      const engineProgressProbe = (() => {
        const engine = new window.ExitTicketEngine({ data: window.EXIT_TICKET_DATA });
        const finalOnly = engine.checkTask('tarwe-opbrengst', {
          work: 'ik gok',
          finalAnswer: '5000',
          unitNotation: 'euro'
        });
        const afterFinalOnly = engine.getProgress();
        const completeEngine = new window.ExitTicketEngine({ data: window.EXIT_TICKET_DATA });
        completeEngine.checkTask('tarwe-opbrengst', { work: '500 x 10', finalAnswer: '5000', unitNotation: 'euro' });
        completeEngine.checkTask('alternatieve-kosten-mais', { work: '350 x 10', finalAnswer: '3500', unitNotation: 'euro' });
        completeEngine.checkTask('buurvrouw-gemengd', { work: '500 x 6 plus 350 x 4 = 4400', finalAnswer: '4400', unitNotation: 'euro' });
        completeEngine.checkTask('betere-keuze-uitleg', {
          fields: { boer: '5000 euro', buurvrouw: '4400 euro', schaarste: 'grond is schaars' },
          choice: 'boer-beter'
        });
        return {
          finalAnswerOnlyRejected: finalOnly.matched === false,
          finalAnswerOnlyProgress: afterFinalOnly,
          completeCorrectProgress: completeEngine.getProgress()
        };
      })();
      const overflowX = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth + 2;
      return {
        route: 'exit-ticket',
        title: document.title,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        dataLoaded: Boolean(window.EXIT_TICKET_DATA),
        engineLoaded: Boolean(window.ExitTicketEngine),
        uiLoaded: Boolean(window.ExitTicketUI),
        legacyRoot: Boolean(document.querySelector('#exit-ticket-app')),
        taskShellRuntimeLoaded: Boolean(window.TaskShellUI && window.TaskShellEngine),
        goldenRoot: Boolean(document.querySelector('main.ge-page[data-golden-ticket-root]')),
        loaded,
        parNr: window.EXIT_TICKET_DATA?.parNr || null,
        surface: window.EXIT_TICKET_DATA?.surface || null,
        gateApproved: window.EXIT_TICKET_DATA?.targetEquivalent?.gateApproved,
        completionLanguageEligible: window.EXIT_TICKET_DATA?.targetEquivalent?.completionLanguageEligible,
        targetReadinessEvidence: window.EXIT_TICKET_DATA?.metadataAlignment?.targetReadinessEvidence,
        metadataStatus: window.EXIT_TICKET_DATA?.metadataAlignment?.status || null,
        taskCount: document.querySelectorAll('article.et-task-shell[data-task]').length,
        calculationTaskCount: taskStates.filter((task) => task.family === 'calculation_work_capture').length,
        structuredTaskCount: taskStates.filter((task) => task.family === 'structured_short_response').length,
        workFieldCount: document.querySelectorAll('[data-input-role="work"]').length,
        finalAnswerFieldCount: document.querySelectorAll('[data-input-role="final-answer"]').length,
        unitNotationFieldCount: document.querySelectorAll('[data-input-role="unit-notation"]').length,
        structuredFieldCount: document.querySelectorAll('[data-input-role="structured-field"]').length,
        structuredChoiceCount: document.querySelectorAll('.ts-choice[data-task-id="betere-keuze-uitleg"]').length,
        selectedStructuredChoice: document.querySelector('.ts-choice[data-task-id="betere-keuze-uitleg"].selected')?.getAttribute('data-choice-id') || null,
        feedback,
        taskStates,
        retryFeedbackCount: feedback.filter((item) => item.isRetry).length,
        matchFeedbackCount: feedback.filter((item) => item.isMatch).length,
        allTaskFeedbackMatch: taskStates.length === 4 && taskStates.every((task) => task.matched === true),
        completionHidden: completion ? completion.hidden || getComputedStyle(completion).display === 'none' : null,
        completionVisible: completion ? !(completion.hidden || getComputedStyle(completion).display === 'none') : false,
        completionText: completion ? completion.innerText.replace(/\\s+/g, ' ').trim() : '',
        visibleWinst: /\\bwinst\\b/i.test(bodyText),
        visibleOpbrengst: /\\bopbrengst\\b/i.test(bodyText),
        answerRevealingPlaceholderCount: placeholders.filter((value) => /Bijvoorbeeld|\\b(?:5000|3500|4400)\\b|grond is (?:beperkt|schaars)|euro/i.test(value)).length,
        studentVisibleInternalCode: /\\b(?:A43|B01|B02|PV|MTU)\\b/.test(bodyText),
        overclaimVisible: /(aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik|doelopgave-niveau|doelopgave op hetzelfde niveau)/i.test(bodyText),
        horizontalOverflow: overflowX,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        engineProgressProbe
      };
    })()`
  );
}

async function inspectLanding(cdp, sessionId) {
  return evaluateJson(
    cdp,
    sessionId,
    `(() => {
      const bodyText = document.body.innerText.replace(/\\s+/g, ' ').trim();
      const overflowX = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth + 2;
      const exitTicketLinks = Array.from(document.querySelectorAll('[data-route-layer="exit-ticket"]')).map((node) => ({
        tag: node.tagName.toLowerCase(),
        href: node.getAttribute('href'),
        text: node.innerText.replace(/\\s+/g, ' ').trim()
      }));
      return {
        route: 'landing',
        title: document.title,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        exitTicketLinks,
        neutralExitTicketCopyPresent: bodyText.includes('Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen.'),
        contentBoxSizingPresent: Array.from(document.querySelectorAll('style')).some((node) => /box-sizing:\\s*border-box/.test(node.textContent || '')),
        overclaimVisible: /(aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1|productgebruik|doelopgave-niveau|doelopgave op hetzelfde niveau)/i.test(bodyText),
        horizontalOverflow: overflowX,
        viewport: { width: window.innerWidth, height: window.innerHeight }
      };
    })()`
  );
}

async function inspect(cdp, sessionId, route) {
  if (route === 'landing') return inspectLanding(cdp, sessionId);
  return inspectExitTicket(cdp, sessionId);
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

function assertCaseProof(item, proof) {
  if (proof.route === 'landing') {
    if (!proof.neutralExitTicketCopyPresent || !proof.contentBoxSizingPresent || proof.overclaimVisible || proof.horizontalOverflow) {
      throw new Error(`${item.case} landing proof failed: ${JSON.stringify(proof, null, 2)}`);
    }
    return;
  }
  if (
    proof.parNr !== '1.1.1' ||
    proof.surface !== 'target_equivalent_exit_ticket' ||
    proof.taskCount !== 4 ||
    proof.calculationTaskCount !== 3 ||
    proof.structuredTaskCount !== 1 ||
    proof.gateApproved !== true ||
    proof.completionLanguageEligible !== false ||
    proof.targetReadinessEvidence !== true ||
    proof.metadataStatus !== 'target_equivalent_aligned' ||
    proof.visibleWinst !== true ||
    proof.visibleOpbrengst !== false ||
    proof.answerRevealingPlaceholderCount !== 0 ||
    proof.studentVisibleInternalCode !== false ||
    proof.overclaimVisible !== false ||
    proof.horizontalOverflow !== false ||
    proof.engineProgressProbe.finalAnswerOnlyRejected !== true ||
    proof.engineProgressProbe.completeCorrectProgress.proofCandidate !== true ||
    proof.engineProgressProbe.completeCorrectProgress.gateApproved !== true ||
    proof.engineProgressProbe.completeCorrectProgress.completionLanguageEligible !== false
  ) {
    throw new Error(`${item.case} exit-ticket proof failed: ${JSON.stringify(proof, null, 2)}`);
  }
  if (item.action === 'wrong-retry' && proof.retryFeedbackCount < 1) {
    throw new Error(`${item.case} must show retry feedback: ${JSON.stringify(proof, null, 2)}`);
  }
  if ((item.action === 'complete' || item.action === 'route-reload-complete') && (!proof.allTaskFeedbackMatch || !proof.completionHidden)) {
    throw new Error(`${item.case} must complete locally while completion stays hidden: ${JSON.stringify(proof, null, 2)}`);
  }
}

function markdownManifest(captured) {
  const lines = [`# ${SPRINT_ID} Screenshot Manifest`, '', '## Captures', ''];
  captured.forEach((item) => {
    lines.push(`- ${item.case}: \`${item.file}\` (${item.theme}, ${item.viewport.width}x${item.viewport.height}, ${item.route}, action: ${item.action})`);
  });
  lines.push(
    '',
    '## Browser Proof',
    '',
    '- 1.1.1 exit-ticket route loads the generated legacy exit-ticket shell with four task-shell tasks.',
    '- desktop-light-wrong-retry shows retry feedback when a correct final answer is paired with invalid work.',
    '- desktop-light-completed-held, mobile-light-completed-held, mobile-dark-completed-held, and route-reload-completed-held show all local checks matched while the completion block stays hidden.',
    '- mobile-light-initial and mobile-dark-initial show the 390px initial route in light and dark themes without horizontal overflow.',
    '- landing-mobile-light-neutral and landing-desktop-dark-neutral show neutral exit-ticket copy without readiness or product-use overclaims.',
    '',
    'Boundary: screenshots do not authorize product-route adoption, diagnostics, mastery, PV, Scale Gate 1, student/product use, or target-equivalent completion language.'
  );
  return `${lines.join('\n')}\n`;
}

function proofMarkdown(generated, exitUrl, landingUrl, captured) {
  return [
    `# ${SPRINT_ID} Rendered Proof`,
    '',
    'Status: Rendered proof complete; narrow target-readiness flags are approved and completion remains held.',
    '',
    `Generated: ${generated}`,
    '',
    '## Scope',
    '',
    '- Captured current rendered 1.1.1 exit-ticket output from the generated lesson repo.',
    '- Confirmed local answer checking can identify complete correct work as a proof candidate.',
    '- Confirmed target-readiness flags are approved in rendered output.',
    '- Confirmed completion authority remains held in rendered output.',
    '- Confirmed the paragraph landing tile keeps neutral exit-ticket copy.',
    '',
    '## Rendered Evidence',
    '',
    `- Exit-ticket proof URL used during capture: ${exitUrl}`,
    `- Landing proof URL used during capture: ${landingUrl}`,
    `- Screenshot manifest: \`${rel(manifestMdPath)}\``,
    `- Machine-readable manifest: \`${rel(manifestJsonPath)}\``,
    `- Cases captured: ${captured.map((item) => item.case).join(', ')}`,
    '',
    '## Authority Boundaries',
    '',
    '- `targetEquivalent.gateApproved`: true at capture time.',
    '- `metadataAlignment.targetReadinessEvidence`: true at capture time.',
    '- `targetEquivalent.completionLanguageEligible`: false at capture time.',
    '- No product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, summative use, or student/product-use authorization.',
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
      if (item.route === 'exit-ticket') await driveExitTicket(cdp, sessionId, item.action);
      const proof = await inspect(cdp, sessionId, item.route);
      assertCaseProof(item, proof);
      const shot = await screenshot(cdp, sessionId, `${item.case}.png`);
      captured.push({
        case: item.case,
        route: item.route,
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
    const exitUrl = urlFor(serverPort, 'exit-ticket');
    const landingUrl = urlFor(serverPort, 'landing');
    const proofJson = {
      schema_version: 1,
      sprint_id: SPRINT_ID,
      generated,
      status: 'rendered_proof_complete_readiness_approved_completion_held',
      source_route: {
        book_root: bookRoot,
        exit_ticket_page_path: pagePath,
        landing_page_path: landingPath,
        exit_ticket_local_url: exitUrl,
        landing_local_url: landingUrl,
      },
      rendered_states: {
        required_cases: cases.map((item) => item.case),
        captured_cases: captured.map((item) => item.case),
        desktop_mobile_dark_captured: true,
        wrong_retry_captured: captured.some((item) => item.case === 'desktop-light-wrong-retry' && item.proof.retryFeedbackCount > 0),
        completed_held_captured: captured.some((item) => item.case === 'desktop-light-completed-held' && item.proof.allTaskFeedbackMatch && item.proof.completionHidden),
        mobile_completed_held_captured: captured.some((item) => item.case === 'mobile-light-completed-held' && item.proof.allTaskFeedbackMatch && item.proof.completionHidden),
        route_reload_completed_held_captured: captured.some((item) => item.case === 'route-reload-completed-held' && item.proof.allTaskFeedbackMatch && item.proof.completionHidden),
        landing_neutral_captured: captured.some((item) => item.route === 'landing' && item.proof.neutralExitTicketCopyPresent),
      },
      readiness_at_capture: {
        gate_approved: true,
        target_readiness_evidence: true,
        metadata_status: 'target_equivalent_aligned',
        completion_language_eligible: false,
        complete_correct_attempt_is_proof_candidate: true,
        final_answer_only_rejected: true,
      },
      authority: {
        generated_lesson_output_changed: true,
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
        human_review_completed_for_readiness: true,
        human_review_required_to_close: false,
        human_review_required_for_downstream_closure: true,
      },
      screenshot_manifest: rel(manifestMdPath),
      screenshot_manifest_json: rel(manifestJsonPath),
      screenshots: captured,
    };

    await fsp.writeFile(
      manifestJsonPath,
      `${JSON.stringify({ schema_version: 1, sprint_id: SPRINT_ID, generated, page_path: pagePath, landing_path: landingPath, cases: captured }, null, 2)}\n`,
      'utf8'
    );
    await fsp.writeFile(manifestMdPath, markdownManifest(captured), 'utf8');
    await fsp.writeFile(proofJsonPath, `${JSON.stringify(proofJson, null, 2)}\n`, 'utf8');
    await fsp.writeFile(proofMdPath, proofMarkdown(generated, exitUrl, landingUrl, captured), 'utf8');
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
