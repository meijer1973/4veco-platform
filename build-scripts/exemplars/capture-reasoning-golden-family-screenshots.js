#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');
const { allCompositions } = require('./reasoning-golden-family-data');

const ROOT = path.resolve(__dirname, '..', '..');
const outputDir = path.join(ROOT, 'reports', 'reasoning-golden-family', 'screenshots');
const chromeExe = process.env.CHROME_EXE
  || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cases = allCompositions.flatMap((composition) => ([
  { composition, state: 'initial', scenario: null, theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'partial', scenario: 'partial', theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'wrong_retry', scenario: 'wrong', theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'correct', scenario: 'correct', theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'answer_preview', scenario: 'correct', theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'next_action', scenario: 'correct', theme: 'light', size: { width: 1280, height: 860 } },
  { composition, state: 'mobile_dark_correct', scenario: 'correct', theme: 'dark', size: { width: 390, height: 844 } },
  { composition, state: 'keyboard_focus', scenario: null, theme: 'light', size: { width: 1280, height: 860 } }
]));

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
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    const filePath = path.resolve(root, decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html');
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

function pageUrl(serverPort, composition) {
  return `http://127.0.0.1:${serverPort}/reports/reasoning-golden-family/generated/${composition.composition_id}.html`;
}

async function applyTheme(cdp, sessionId, theme) {
  await cdp.send('Runtime.evaluate', {
    expression: `document.documentElement.setAttribute('data-theme', '${theme}');`
  }, sessionId);
}

async function runScenario(cdp, sessionId, scenario) {
  if (!scenario) return;
  await cdp.send('Runtime.evaluate', {
    expression: `window.ReasoningGameComposer && window.ReasoningGameComposer.applyScenario('${scenario}')`
  }, sessionId);
  await sleep(450);
}

async function applyView(cdp, sessionId, state) {
  const selectors = {
    partial: '.selected, [data-step-selected-id], [data-source-selected-node-id], [data-answer-row-id].selected, [data-graph-evidence-selected-point-id], [data-selected-tile]:not([data-selected-tile=""])',
    wrong_retry: '.ts-feedback-card[data-feedback-state="retry"]',
    correct: '.ts-feedback-card[data-feedback-state="matched"]',
    answer_preview: '[data-answer-preview]',
    next_action: '.ts-feedback-action'
  };
  const selector = selectors[state];
  if (!selector) return;
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('${selector}'));
      const target = items[items.length - 1];
      if (!target) return false;
      target.scrollIntoView({ block: 'center', inline: 'nearest' });
      if (typeof target.focus === 'function') target.focus({ preventScroll: true });
      return true;
    })()`
  }, sessionId);
  await sleep(250);
}

async function dispatchTab(cdp, sessionId) {
  const base = {
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9
  };
  await cdp.send('Input.dispatchKeyEvent', { ...base, type: 'keyDown' }, sessionId);
  await cdp.send('Input.dispatchKeyEvent', { ...base, type: 'keyUp' }, sessionId);
}

async function exerciseKeyboardFocus(cdp, sessionId) {
  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const composition = window.ReasoningGameComposer.data();
      const firstTask = composition.taskSet.tasks[0];
      window.__rgKeyboardFocusPlan = window.TaskShellEngine.focusPlan(firstTask);
      window.__rgKeyboardTraversalMatched = false;
      const taskPane = document.querySelector('[data-rg-task-pane]');
      if (taskPane) taskPane.scrollTop = 0;
      window.scrollTo(0, 0);
      if (!document.body.hasAttribute('tabindex')) document.body.setAttribute('tabindex', '-1');
      document.body.focus({ preventScroll: true });
      return window.__rgKeyboardFocusPlan;
    })()`,
    returnByValue: true
  }, sessionId);

  for (let i = 0; i < 32; i += 1) {
    await dispatchTab(cdp, sessionId);
    await sleep(75);
    const result = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const active = document.activeElement;
        const plan = window.__rgKeyboardFocusPlan || [];
        function visibleInViewport(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 &&
            rect.bottom > 0 && rect.right > 0 &&
            rect.top < window.innerHeight && rect.left < window.innerWidth;
        }
        const selector = plan.find((candidate) => {
          try { return active && active.matches(candidate); } catch (_error) { return false; }
        }) || '';
        if (selector) {
          active.scrollIntoView({ block: 'center', inline: 'nearest' });
          window.__rgKeyboardTraversalMatched = true;
          return {
            matched: true,
            selector,
            tag: active.tagName,
            text: active.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80),
            visible: visibleInViewport(active)
          };
        }
        return {
          matched: false,
          tag: active ? active.tagName : null,
          id: active ? active.id : '',
          text: active ? active.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80) : ''
        };
      })()`,
      returnByValue: true
    }, sessionId);
    const value = result.result && result.result.value;
    if (value && value.matched && value.visible) {
      await sleep(250);
      return value;
    }
  }
  return null;
}

async function collectProof(cdp, sessionId, item) {
  const result = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const composition = window.ReasoningGameComposer.data();
      const workspace = document.querySelector('[data-rg-workspace]');
      const sourcePane = document.querySelector('[data-rg-source-pane]');
      const taskPane = document.querySelector('[data-rg-task-pane]');
      const feedbackStates = Array.from(document.querySelectorAll('.ts-feedback-card')).map((el) => el.getAttribute('data-feedback-state'));
      const feedbackCards = Array.from(document.querySelectorAll('.ts-feedback-card')).map((el) => ({
        state: el.getAttribute('data-feedback-state'),
        text: el.textContent.replace(/\\s+/g, ' ').trim(),
        visible: visibleInViewport(el)
      }));
      function visibleInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
          rect.bottom > 0 && rect.right > 0 &&
          rect.top < window.innerHeight && rect.left < window.innerWidth;
      }
      const answerPreview = Array.from(document.querySelectorAll('[data-answer-preview]')).map((el) => ({
        text: el.textContent.replace(/\\s+/g, ' ').trim(),
        complete: el.classList.contains('is-complete'),
        visible: visibleInViewport(el)
      }));
      const nextActions = Array.from(document.querySelectorAll('.ts-feedback-action')).map((el) => ({
        text: el.textContent.replace(/\\s+/g, ' ').trim(),
        href: el.getAttribute('href') || '',
        visible: visibleInViewport(el)
      }));
      const graphTargets = Array.from(document.querySelectorAll('[data-graph-evidence-point-id]')).map((el) => {
        const rect = el.getBoundingClientRect();
        return { width: Math.round(rect.width), height: Math.round(rect.height), id: el.getAttribute('data-graph-evidence-point-id') };
      });
      const selected = document.querySelectorAll([
        '.selected',
        '[data-step-selected-id]',
        '[data-source-selected-node-id]',
        '[data-sentence-selected-token-id]',
        '[data-formula-selected-token-id]',
        '[data-answer-row-id].selected',
        '[data-graph-evidence-selected-point-id]',
        '[data-selected-tile]:not([data-selected-tile=""])'
      ].join(',')).length;
      const firstTask = composition.taskSet.tasks[0];
      const focusPlan = window.TaskShellEngine.focusPlan(firstTask);
      function focusCandidate(selector) {
        const matches = Array.from(document.querySelectorAll(selector));
        return matches.find((candidate) => {
          const rect = candidate.getBoundingClientRect();
          return !candidate.disabled && rect.width > 0 && rect.height > 0;
        });
      }
      let focusEl = null;
      let focusSelector = '';
      for (const selector of focusPlan) {
        focusEl = focusCandidate(selector);
        if (focusEl) {
          focusSelector = selector;
          break;
        }
      }
      const active = document.activeElement;
      const activeSelector = focusPlan.find((selector) => {
        try { return active && active.matches(selector); } catch (_error) { return false; }
      }) || '';
      const sourceStyle = sourcePane ? getComputedStyle(sourcePane) : null;
      const taskStyle = taskPane ? getComputedStyle(taskPane) : null;
      const mobile = window.innerWidth < 760;
      return {
        title: document.title,
        compositionId: composition.composition_id,
        layout: workspace ? workspace.getAttribute('data-rg-layout') : null,
        taskFamilies: composition.taskSet.tasks.map((task) => task.family),
        taskCount: composition.taskSet.tasks.length,
        checkButtonCount: document.querySelectorAll('[data-rg-check-task]').length,
        feedbackStates,
        feedbackCards,
        answerPreview,
        nextActions,
        graphTargets,
        minGraphTarget: graphTargets.length ? Math.min(...graphTargets.map((target) => Math.min(target.width, target.height))) : null,
        selectedCount: selected,
        modePickerVisible: Boolean(document.querySelector('[data-mode], [data-legacy-mode], .mode-picker')),
        focusProof: {
          selector: focusSelector,
          candidateAvailable: Boolean(focusEl),
          activeSelector,
          activeTag: active ? active.tagName : null,
          activeText: active ? active.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80) : '',
          activeMatches: Boolean(activeSelector),
          keyboardTraversal: window.__rgKeyboardTraversalMatched === true
        },
        paneProof: {
          mobile,
          sourceOverflowY: sourceStyle ? sourceStyle.overflowY : null,
          taskOverflowY: taskStyle ? taskStyle.overflowY : null,
          sourceOverscroll: sourceStyle ? sourceStyle.overscrollBehaviorY : null,
          taskOverscroll: taskStyle ? taskStyle.overscrollBehaviorY : null,
          sourceMaxHeight: sourceStyle ? sourceStyle.maxHeight : null,
          taskMaxHeight: taskStyle ? taskStyle.maxHeight : null
        },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        page: { width: Math.ceil(document.documentElement.scrollWidth), height: Math.ceil(document.documentElement.scrollHeight) }
      };
    })()`,
    returnByValue: true
  }, sessionId);
  const value = result.result && result.result.value;
  if (!value || value.compositionId !== item.composition.composition_id) {
    throw new Error(`${item.composition.composition_id}/${item.state}: composition proof missing`);
  }
  if (value.modePickerVisible) {
    throw new Error(`${item.composition.composition_id}/${item.state}: legacy mode picker visible`);
  }
  if (value.checkButtonCount !== value.taskCount) {
    throw new Error(`${item.composition.composition_id}/${item.state}: missing check buttons`);
  }
  if (item.state === 'partial' && value.selectedCount < 1) {
    throw new Error(`${item.composition.composition_id}/${item.state}: partial state has no selected control`);
  }
  if (item.state === 'wrong_retry' && !value.feedbackStates.includes('retry')) {
    throw new Error(`${item.composition.composition_id}/${item.state}: retry feedback not rendered`);
  }
  if (item.state === 'wrong_retry' && !value.feedbackCards.some((card) => card.state === 'retry' && card.visible)) {
    throw new Error(`${item.composition.composition_id}/${item.state}: retry feedback is not visible`);
  }
  if ((item.state === 'correct' || item.state === 'answer_preview' || item.state === 'next_action' || item.state === 'mobile_dark_correct') && !value.feedbackStates.includes('matched')) {
    throw new Error(`${item.composition.composition_id}/${item.state}: matched feedback not rendered`);
  }
  if ((item.state === 'correct' || item.state === 'answer_preview' || item.state === 'next_action' || item.state === 'mobile_dark_correct') && !value.answerPreview.some((preview) => preview.complete)) {
    throw new Error(`${item.composition.composition_id}/${item.state}: final answer preview not complete`);
  }
  if (item.state === 'answer_preview' && !value.answerPreview.some((preview) => preview.complete && preview.visible)) {
    throw new Error(`${item.composition.composition_id}/${item.state}: final answer preview not visible`);
  }
  if (item.state === 'next_action' && !value.nextActions.some((action) => action.visible && action.text)) {
    throw new Error(`${item.composition.composition_id}/${item.state}: next action is not visible`);
  }
  if (value.graphTargets.length && value.minGraphTarget < 44) {
    throw new Error(`${item.composition.composition_id}/${item.state}: graph target below 44px`);
  }
  if (!value.focusProof.candidateAvailable) {
    throw new Error(`${item.composition.composition_id}/${item.state}: focus target unavailable`);
  }
  if (item.state === 'keyboard_focus' && (!value.focusProof.keyboardTraversal || !value.focusProof.activeMatches)) {
    throw new Error(`${item.composition.composition_id}/${item.state}: keyboard traversal did not reach focus target`);
  }
  if (item.size.width >= 760 && value.layout === 'dual_pane_source_task_workspace') {
    if (value.paneProof.sourceOverflowY !== 'auto' || value.paneProof.taskOverflowY !== 'auto') {
      throw new Error(`${item.composition.composition_id}/${item.state}: desktop panes are not independently scrollable`);
    }
    if (value.paneProof.sourceOverscroll !== 'contain' || value.paneProof.taskOverscroll !== 'contain') {
      throw new Error(`${item.composition.composition_id}/${item.state}: desktop pane overscroll is not contained`);
    }
  }
  if (item.size.width < 760 && value.layout === 'dual_pane_source_task_workspace') {
    if (value.paneProof.sourceOverflowY !== 'visible' || value.paneProof.taskOverflowY !== 'visible') {
      throw new Error(`${item.composition.composition_id}/${item.state}: mobile panes should use natural flow`);
    }
  }
  return value;
}

async function captureScreenshot(cdp, sessionId, outPath) {
  const metrics = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
  const content = metrics.contentSize || { width: 1280, height: 860 };
  const screenshot = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(content.width),
      height: Math.ceil(content.height),
      scale: 1
    }
  }, sessionId);
  await fsp.writeFile(outPath, Buffer.from(screenshot.data, 'base64'));
}

async function main() {
  if (!fs.existsSync(chromeExe)) {
    throw new Error(`Chromium executable not found: ${chromeExe}`);
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(ROOT, serverPort);
  const profileDir = path.join('C:\\tmp\\Codex-work', `reasoning-golden-family-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${devtoolsPort}`,
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  try {
    const version = await waitForVersion(devtoolsPort);
    const cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const manifest = [];
    for (const item of cases) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: item.size.width,
        height: item.size.height,
        deviceScaleFactor: 1,
        mobile: item.size.width < 760
      }, sessionId);
      await cdp.send('Page.navigate', { url: pageUrl(serverPort, item.composition) }, sessionId);
      await sleep(900);
      await applyTheme(cdp, sessionId, item.theme);
      await runScenario(cdp, sessionId, item.scenario);
      await applyView(cdp, sessionId, item.state);
      if (item.state === 'keyboard_focus') await exerciseKeyboardFocus(cdp, sessionId);
      const proof = await collectProof(cdp, sessionId, item);
      const name = `${item.composition.composition_id}-${item.state}`;
      const outPath = path.join(outputDir, `${name}.png`);
      await captureScreenshot(cdp, sessionId, outPath);
      manifest.push({
        name,
        composition_id: item.composition.composition_id,
        state: item.state,
        theme: item.theme,
        scenario: item.scenario,
        url: `reports/reasoning-golden-family/generated/${item.composition.composition_id}.html`,
        screenshot: path.relative(ROOT, outPath).replace(/\\/g, '/'),
        proof
      });
    }

    const manifestJson = {
      schema_version: 1,
      goal: 'GOAL-REASONING-GOLDEN-FAMILY-1',
      captured_on: '2026-06-23',
      cases: manifest
    };
    await fsp.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2) + '\n', 'utf8');
    const manifestMd = [
      '# Reasoning Golden Family Screenshot Manifest',
      '',
      'Generated: 2026-06-23',
      '',
      'These screenshots cover initial, partial, wrong/retry, correct, answer-preview, mobile/dark, focus, graph target, and scroll-isolation states. They do not authorize product rollout.',
      '',
      '| Case | State | Theme | Proof | Screenshot |',
      '| --- | --- | --- | --- | --- |',
      ...manifest.map((entry) => {
        const proofBits = [
          entry.proof.taskFamilies.join('+'),
          entry.proof.feedbackStates.length ? `feedback=${entry.proof.feedbackStates.join(',')}` : 'no feedback yet',
          entry.proof.answerPreview.some((preview) => preview.complete && preview.visible) ? 'answer preview visible' : 'answer preview not in viewport',
          entry.proof.nextActions.some((action) => action.visible) ? 'next action visible' : 'next action not in viewport',
          entry.proof.minGraphTarget ? `graph target min=${entry.proof.minGraphTarget}` : 'no graph target',
          entry.state === 'keyboard_focus'
            ? (entry.proof.focusProof.keyboardTraversal && entry.proof.focusProof.activeMatches ? 'keyboard focus ok' : 'keyboard focus missing')
            : (entry.proof.focusProof.candidateAvailable ? 'focus target available' : 'focus target missing')
        ].join('; ');
        return `| ${entry.name} | ${entry.state} | ${entry.theme} | ${proofBits} | \`${entry.screenshot}\` |`;
      })
    ].join('\n') + '\n';
    await fsp.writeFile(path.join(ROOT, 'reports', 'reasoning-golden-family', 'screenshot-manifest.md'), manifestMd, 'utf8');

    const proofPath = path.join(ROOT, 'reports', 'json', 'reasoning-golden-family-proof.json');
    const proofJson = JSON.parse(await fsp.readFile(proofPath, 'utf8'));
    proofJson.screenshot_manifest = 'reports/reasoning-golden-family/screenshots/manifest.json';
    proofJson.screenshot_cases = manifest.map((entry) => ({
      name: entry.name,
      composition_id: entry.composition_id,
      state: entry.state,
      screenshot: entry.screenshot,
      feedback_states: entry.proof.feedbackStates,
      feedback_visible: entry.proof.feedbackCards.some((card) => card.visible),
      answer_preview_visible: entry.proof.answerPreview.some((preview) => preview.complete && preview.visible),
      next_action_visible: entry.proof.nextActions.some((action) => action.visible),
      min_graph_target: entry.proof.minGraphTarget,
      focus_ok: entry.state === 'keyboard_focus' ? entry.proof.focusProof.activeMatches : entry.proof.focusProof.candidateAvailable,
      keyboard_focus_ok: entry.state === 'keyboard_focus'
        ? entry.proof.focusProof.keyboardTraversal && entry.proof.focusProof.activeMatches
        : null,
      pane_proof: entry.proof.paneProof
    }));
    await fsp.writeFile(proofPath, JSON.stringify(proofJson, null, 2) + '\n', 'utf8');
    console.log(`Captured ${manifest.length} reasoning golden family screenshots in ${path.relative(ROOT, outputDir)}`);
  } finally {
    chrome.kill();
    server.close();
    await sleep(500);
    try {
      await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (_error) {
      // Temporary browser profile cleanup is best-effort.
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
