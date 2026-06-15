#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const SPRINT_ID = 'GOLDEN-SURFACE-VISUAL-REVIEW-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.GOLDEN_SURFACE_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const screenshotDir = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshots`);
const manifestJsonPath = path.join(screenshotDir, 'manifest.json');
const manifestMdPath = path.join(platformRoot, 'reports', 'sprints', `${SPRINT_ID}-screenshot-manifest.md`);
const proofJsonPath = path.join(platformRoot, 'reports', 'json', 'golden-surface-visual-review-1-proof.json');

const chromeCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromeExe = chromeCandidates.find((candidate) => fs.existsSync(candidate));

const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const paragraphDirs = {
  '1.1.2': '1.1.2 Percentages en indexcijfers',
  '1.1.3': '1.1.3 Grafieken en tabellen',
};

const surfaces = [
  {
    id: '112-exit-ticket',
    paragraph: '1.1.2',
    suffix: 'exit-ticket',
    sourceKey: '1.1.2-exit-ticket',
    label: '1.1.2 exit ticket',
    authority: 'target_equivalent_held',
  },
  {
    id: '112-korte-check',
    paragraph: '1.1.2',
    suffix: 'korte-check',
    sourceKey: '1.1.2-korte-check',
    label: '1.1.2 advisory short check',
    authority: 'advisory_only',
  },
  {
    id: '113-exit-ticket',
    paragraph: '1.1.3',
    suffix: 'exit-ticket',
    sourceKey: '1.1.3-exit-ticket',
    label: '1.1.3 exit ticket',
    authority: 'target_equivalent_held',
  },
];

const viewports = [
  { id: 'desktop-light', width: 1280, height: 900, theme: 'light' },
  { id: 'mobile-light', width: 390, height: 844, theme: 'light' },
  { id: 'mobile-dark', width: 390, height: 844, theme: 'dark' },
];

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function bookRel(file) {
  return path.relative(bookRoot, file).replace(/\\/g, '/');
}

function pageRel(surface) {
  const parDir = paragraphDirs[surface.paragraph];
  return `${chapterDir}/${parDir}/${parDir} \u2013 ${surface.suffix}.html`;
}

function pageAbs(surface) {
  return path.join(bookRoot, pageRel(surface));
}

function urlPath(surface) {
  return pageRel(surface).split('/').map(encodeURIComponent).join('/');
}

function dataAbs(surface) {
  return path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${surface.sourceKey}.json`);
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForScreenshot(file, timeoutMs) {
  const started = Date.now();
  let lastSize = -1;
  let stableSince = 0;
  while (Date.now() - started < timeoutMs) {
    if (fs.existsSync(file)) {
      const size = fs.statSync(file).size;
      if (size > 0) {
        if (size === lastSize) {
          if (!stableSince) stableSince = Date.now();
          if (Date.now() - stableSince >= 300) return true;
        } else {
          lastSize = size;
          stableSince = 0;
        }
      }
    }
    await delay(100);
  }
  return false;
}

function captureScreenshot(url, file, viewport) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--disable-extensions',
      '--disable-background-networking',
      '--run-all-compositor-stages-before-draw',
      `--window-size=${viewport.width},${viewport.height}`,
      `--screenshot=${file}`,
    ];
    if (viewport.theme === 'dark') args.push('--force-dark-mode');
    args.push(url);

    const child = spawn(chromeExe, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;
    function settle(fn) {
      if (settled) return;
      settled = true;
      fn();
    }
    const timer = setTimeout(async () => {
      if (settled) return;
      if (await waitForScreenshot(file, 1500)) {
        try { child.kill(); } catch (_error) { /* noop */ }
        settle(resolve);
        return;
      }
      try { child.kill(); } catch (_error) { /* noop */ }
      settle(() => reject(new Error(`Screenshot timed out for ${file}: ${(stderr || stdout).trim()}`)));
    }, 30000);
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      clearTimeout(timer);
      settle(() => reject(error));
    });
    child.on('close', async (code) => {
      if (settled) return;
      clearTimeout(timer);
      if (await waitForScreenshot(file, 5000)) {
        settle(resolve);
        return;
      }
      settle(() => reject(new Error(`Screenshot failed (${code}) for ${file}: ${(stderr || stdout).trim()}`)));
    });
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
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
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < 10000) {
    try {
      return await getJson(`http://127.0.0.1:${port}/json/version`);
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  throw lastError || new Error('Timed out waiting for Chrome DevTools');
}

function openCdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();

    ws.onopen = () => {
      resolve({
        send(method, params, sessionId) {
          const id = nextId++;
          const message = { id, method, params: params || {} };
          if (sessionId) message.sessionId = sessionId;
          return new Promise((innerResolve, innerReject) => {
            pending.set(id, { resolve: innerResolve, reject: innerReject });
            ws.send(JSON.stringify(message));
          });
        },
        close() {
          ws.close();
        },
      });
    };

    ws.onerror = (error) => reject(error);
    ws.onmessage = (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id || !pending.has(message.id)) return;
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        entry.reject(new Error(message.error.message || JSON.stringify(message.error)));
      } else {
        entry.resolve(message.result || {});
      }
    };
  });
}

async function evaluateJson(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }, sessionId);
  if (!result.result || result.result.type !== 'object') {
    throw new Error(`Unexpected Runtime.evaluate result: ${JSON.stringify(result)}`);
  }
  return result.result.value;
}

async function inspectRuntimeProofs(port) {
  const cdpPort = await findFreePort();
  const profileDir = path.join(process.env.TEMP || 'C:\\tmp\\Codex-work', `golden-surface-visual-review1-chrome-${Date.now()}`);
  await fsp.mkdir(profileDir, { recursive: true });
  const chrome = spawn(chromeExe, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--disable-extensions',
    '--disable-background-networking',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let cdp;
  try {
    const version = await waitForVersion(cdpPort);
    cdp = await openCdp(version.webSocketDebuggerUrl);
    const target = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    const runtimeProofs = [];
    for (const surface of surfaces) {
      for (const viewport of viewports) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: viewport.width < 520,
        }, sessionId);
        await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/${urlPath(surface)}` }, sessionId);
        await delay(900);
        await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            try { localStorage.setItem('quizMode', '${viewport.theme}'); } catch (_error) {}
            document.documentElement.setAttribute('data-theme', '${viewport.theme}');
          })()`,
          returnByValue: true,
        }, sessionId);
        await delay(200);
        const proof = await evaluateJson(cdp, sessionId, `(() => {
          const doc = document.documentElement;
          const body = document.body;
          const viewportWidth = Math.max(window.innerWidth || 0, doc.clientWidth || 0);
          const nodes = Array.from(document.body ? document.body.querySelectorAll('*') : []);
          const overflowing = nodes.map((node) => {
            const rect = node.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return null;
            const left = Math.floor(rect.left);
            const right = Math.ceil(rect.right);
            if (left >= -1 && right <= viewportWidth + 1) return null;
            const text = (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim();
            return {
              tag: node.tagName.toLowerCase(),
              className: typeof node.className === 'string' ? node.className : '',
              text: text.slice(0, 120),
              left,
              right,
              width: Math.ceil(rect.width)
            };
          }).filter(Boolean).slice(0, 20);
          const contentOverflowing = nodes.map((node) => {
            if (!(node instanceof HTMLElement)) return null;
            if (node.clientWidth <= 0 || node.scrollWidth <= node.clientWidth + 1) return null;
            const text = (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim();
            return {
              tag: node.tagName.toLowerCase(),
              className: typeof node.className === 'string' ? node.className : '',
              text: text.slice(0, 120),
              scrollWidth: node.scrollWidth,
              clientWidth: node.clientWidth
            };
          }).filter(Boolean).slice(0, 20);
          const tokenIds = Array.from(document.querySelectorAll('[data-ge-token-id]')).map((node) => node.getAttribute('data-ge-token-id'));
          const tokenLabels = Array.from(document.querySelectorAll('[data-ge-token-id]')).map((node) => ({
            id: node.getAttribute('data-ge-token-id'),
            label: (node.innerText || node.textContent || '').replace(/\\s+/g, ' ').trim()
          }));
          const visibleAnswerLabels = tokenLabels
            .filter((item) => item.label)
            .reduce((map, item) => {
              map[item.label] = (map[item.label] || 0) + 1;
              return map;
            }, {});
          return {
            theme: doc.getAttribute('data-theme'),
            viewport: { width: window.innerWidth, height: window.innerHeight },
            page: {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              bodyScrollWidth: body ? body.scrollWidth : 0,
              bodyClientWidth: body ? body.clientWidth : 0
            },
            horizontal_overflow: doc.scrollWidth > doc.clientWidth + 1 || (body && body.scrollWidth > body.clientWidth + 1) || overflowing.length > 0 || contentOverflowing.length > 0,
            overflowing,
            content_overflowing: contentOverflowing,
            token_ids: tokenIds,
            token_labels: tokenLabels,
            duplicate_visible_token_labels: Object.keys(visibleAnswerLabels).filter((label) => visibleAnswerLabels[label] > 1)
          };
        })()`);
        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true }, sessionId);
        const screenshotFile = path.join(screenshotDir, `${surface.id}-${viewport.id}.png`);
        await fsp.writeFile(screenshotFile, Buffer.from(screenshot.data, 'base64'));
        runtimeProofs.push({
          surface_id: surface.id,
          surface_label: surface.label,
          viewport_id: viewport.id,
          requested_viewport: viewport,
          screenshot_path: rel(screenshotFile),
          screenshot_bytes: fs.statSync(screenshotFile).size,
          capture_method: 'headless_chromium_cdp_device_metrics',
          ...proof,
        });
      }
    }
    return runtimeProofs;
  } finally {
    if (cdp) cdp.close();
    try { chrome.kill(); } catch (_error) { /* noop */ }
    try {
      await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (_error) {
      // Temporary browser profile cleanup is best-effort.
    }
  }
}

function loadedHrefOrSrc(html, fileName) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('<(?:link|script)\\b[^>]*(?:href|src)=["\'][^"\']*' + escaped + '["\'][^>]*>', 'i').test(html);
}

function mixedGoldenLegacyClassAttrs(html) {
  const matches = [];
  const attrPattern = /\bclass\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrPattern.exec(html))) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    const hasGolden = classes.some((name) => /^ge-/.test(name));
    const hasLegacy = classes.some((name) => /^et-/.test(name) || /^ts-/.test(name) || /task-shell/.test(name) || name === 'app-shell');
    if (hasGolden && hasLegacy) matches.push(match[1]);
  }
  return matches;
}

function linksIn(html, file) {
  const links = [];
  const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const href = match[1];
    if (/^(?:https?:|mailto:|#)/i.test(href)) {
      links.push({ href, checked: false, reason: 'external_or_fragment' });
      continue;
    }
    const target = path.resolve(path.dirname(file), decodeURIComponent(href));
    links.push({
      href,
      checked: true,
      target: bookRel(target),
      exists: fs.existsSync(target),
    });
  }
  return links;
}

function htmlFacts(html, file) {
  const mixedClasses = mixedGoldenLegacyClassAttrs(html);
  const linkFacts = linksIn(html, file);
  return {
    golden_root_present: /<main\b[^>]*class\s*=\s*["'][^"']*\bge-page\b[^"']*["'][^>]*data-golden-ticket-root/i.test(html),
    exit_ticket_app_absent: !/\bid\s*=\s*["']exit-ticket-app["']/i.test(html),
    legacy_shell_classes_absent: !/\b(?:et-page|et-topbar|et-back|et-theme-toggle|app-shell)\b/i.test(html),
    mixed_golden_legacy_classes_absent: mixedClasses.length === 0,
    mixed_golden_legacy_classes: mixedClasses,
    golden_assets_present: ['golden-ticket-layout.css', 'golden-ticket-layout.js'].every((asset) => loadedHrefOrSrc(html, asset)),
    legacy_css_absent: ['task-shell.css', 'exit-ticket.css', 'skill-map-route.css'].every((asset) => !loadedHrefOrSrc(html, asset)),
    legacy_ui_absent: ['task-shell-ui.js', 'exit-ticket-ui.js', 'skill-map-route-ui.js'].every((asset) => !loadedHrefOrSrc(html, asset)),
    old_internal_labels_absent: !/\b(?:oldQden|oldQnum|TODO|FIXME|placeholder_needs_review)\b/i.test(html),
    answer_giving_placeholders_absent: !/(?:Bijvoorbeeld\s+15|Bijvoorbeeld\s+108|Bijvoorbeeld\s+3,7|Bijvoorbeeld\s+4 indexpunten)/i.test(html),
    fake_graph_controls_absent: !/(?:data-ge-connect-line|data-ge-line-shape|data-line-shape-value|Verbind mijn punten|Verbind de punten|Trek lijn door punten|>\s*(?:Lijnvorm|Dalend|Stijgend|Horizontaal|Geen duidelijk verband)\s*<)/i.test(html),
    links: linkFacts,
    links_resolve: linkFacts.filter((item) => item.checked).every((item) => item.exists),
  };
}

function sourceFacts(data, surface) {
  const target = data.targetEquivalent || {};
  const metadata = data.metadataAlignment || {};
  const advisory = data.advisory || {};
  const taskFamilies = (data.tasks || []).map((task) => task.taskShell ? task.taskShell.family : task.type);
  return {
    surface: data.surface,
    layout_framework: data.layout && data.layout.framework,
    layout_variant: data.layout && data.layout.variant || null,
    target_equivalent_candidate: target.candidate === true,
    gate_approved_false: target.gateApproved === false,
    completion_language_eligible_false: target.completionLanguageEligible === false,
    target_readiness_evidence_false: metadata.targetReadinessEvidence === false,
    advisory_target_equivalent_proof_false: surface.authority === 'advisory_only' ? advisory.targetEquivalentProof === false : null,
    advisory_hints_absent: surface.authority === 'advisory_only' ? advisory.hintsAbsent === true : null,
    advisory_route_advice: surface.authority === 'advisory_only' ? advisory.routeAdvice === true : null,
    task_families: taskFamilies,
  };
}

function verdictForSurface(facts, surface) {
  const required = [
    facts.html.golden_root_present,
    facts.html.exit_ticket_app_absent,
    facts.html.legacy_shell_classes_absent,
    facts.html.mixed_golden_legacy_classes_absent,
    facts.html.golden_assets_present,
    facts.html.legacy_css_absent,
    facts.html.legacy_ui_absent,
    facts.html.old_internal_labels_absent,
    facts.html.answer_giving_placeholders_absent,
    facts.html.links_resolve,
    facts.source.gate_approved_false,
    facts.source.completion_language_eligible_false,
    facts.source.target_readiness_evidence_false,
    facts.runtime.mobile_horizontal_overflow_absent,
  ];
  if (surface.id === '113-exit-ticket') {
    required.push(
      facts.html.fake_graph_controls_absent,
      facts.runtime.old_formula_token_ids_absent,
      facts.runtime.duplicate_visible_token_labels_absent
    );
  }
  if (surface.authority === 'advisory_only') {
    required.push(
      facts.source.target_equivalent_candidate === false,
      facts.source.advisory_target_equivalent_proof_false,
      facts.source.advisory_hints_absent,
      facts.source.advisory_route_advice
    );
  }
  return required.every(Boolean) ? 'PASS' : 'REVISE';
}

function mdManifest(proof) {
  const lines = [
    '# GOLDEN-SURFACE-VISUAL-REVIEW-1 Screenshot Manifest',
    '',
    `Generated: ${proof.generated_at}`,
    '',
    '## Scope',
    '',
    '- `1.1.2` exit ticket',
    '- `1.1.2` advisory short check',
    '- `1.1.3` exit ticket',
    '- shared `golden-ticket-layout.js` / `golden-ticket-layout.css` runtime',
    '',
    '## Screenshots',
    '',
    '| Surface | Viewport | Theme | Path |',
    '|---|---|---|---|',
  ];
  for (const item of proof.screenshots) {
    lines.push(`| ${item.surface_label} | ${item.viewport.width}x${item.viewport.height} | ${item.viewport.theme} | \`${item.path}\` |`);
  }
  lines.push('', '## DOM Evidence Summary', '');
  for (const surface of proof.surfaces) {
    lines.push(`### ${surface.label}`, '');
    lines.push(`- Verdict: \`${surface.verdict}\``);
    lines.push(`- Golden root present: ${surface.html.golden_root_present}`);
    lines.push(`- Legacy shell absent: ${surface.html.exit_ticket_app_absent && surface.html.legacy_shell_classes_absent}`);
    lines.push(`- Legacy CSS/runtime absent: ${surface.html.legacy_css_absent && surface.html.legacy_ui_absent}`);
    lines.push(`- Links resolve: ${surface.html.links_resolve}`);
    lines.push(`- Authority held: ${surface.source.gate_approved_false && surface.source.completion_language_eligible_false && surface.source.target_readiness_evidence_false}`);
    lines.push(`- Mobile horizontal overflow absent: ${surface.runtime.mobile_horizontal_overflow_absent}`);
    if (surface.id === '113-exit-ticket') {
      lines.push(`- Fake graph controls absent: ${surface.html.fake_graph_controls_absent}`);
      lines.push(`- Old formula-token ids absent: ${surface.runtime.old_formula_token_ids_absent}`);
      lines.push(`- Duplicate visible token labels absent: ${surface.runtime.duplicate_visible_token_labels_absent}`);
    }
    lines.push('');
  }
  while (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!chromeExe) throw new Error('No Chrome/Edge executable found. Set CHROME_EXE to capture screenshots.');
  if (!fs.existsSync(bookRoot)) throw new Error(`Missing Book 1 root: ${bookRoot}`);

  await fsp.mkdir(screenshotDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofJsonPath), { recursive: true });

  const port = await findFreePort();
  const server = await startStaticServer(bookRoot, port);
  let screenshots = [];
  let runtimeProofs = [];
  try {
    for (const surface of surfaces) {
      const pageFile = pageAbs(surface);
      if (!fs.existsSync(pageFile)) throw new Error(`Missing rendered page: ${pageFile}`);
    }
    runtimeProofs = await inspectRuntimeProofs(port);
    screenshots = runtimeProofs.map((proof) => ({
      surface_id: proof.surface_id,
      surface_label: proof.surface_label,
      viewport: proof.requested_viewport,
      path: proof.screenshot_path,
      bytes: proof.screenshot_bytes,
      capture_method: proof.capture_method,
    }));
  } finally {
    server.close();
  }

  const surfaceProof = surfaces.map((surface) => {
    const pageFile = pageAbs(surface);
    const dataFile = dataAbs(surface);
    const html = readText(pageFile);
    const data = readJson(dataFile);
    const runtimeViewports = runtimeProofs.filter((proof) => proof.surface_id === surface.id);
    const mobileRuntime = runtimeViewports.filter((proof) => /^mobile/.test(proof.viewport_id));
    const tokenIds = runtimeViewports.flatMap((proof) => proof.token_ids || []);
    const duplicateLabels = runtimeViewports.flatMap((proof) => proof.duplicate_visible_token_labels || []);
    const facts = {
      id: surface.id,
      label: surface.label,
      paragraph: surface.paragraph,
      rendered_page: bookRel(pageFile),
      source_data: rel(dataFile),
      source: sourceFacts(data, surface),
      html: htmlFacts(html, pageFile),
      runtime: {
        viewports: runtimeViewports,
        mobile_horizontal_overflow_absent: mobileRuntime.length > 0 && mobileRuntime.every((proof) => proof.horizontal_overflow === false),
        old_formula_token_ids_absent: !tokenIds.some((id) => id === 'oldQden' || id === 'oldQnum'),
        duplicate_visible_token_labels_absent: duplicateLabels.length === 0,
      },
    };
    facts.verdict = verdictForSurface(facts, surface);
    return facts;
  });

  const proof = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_at: new Date().toISOString(),
    book_root: bookRoot,
    chrome_executable: chromeExe,
    scope_note: 'Captures existing generated lesson output only; the capture step is read-only. For the revision pass, generated lesson output was refreshed beforehand through the platform deploy pipeline.',
    surfaces: surfaceProof,
    screenshots,
    runtime_proofs: runtimeProofs,
    overall_verdict: surfaceProof.every((surface) => surface.verdict === 'PASS') ? 'PASS' : 'REVISE',
    authority_boundary: {
      generated_lesson_output_mutated_by_repair_deploy: true,
      generated_lesson_output_mutated_by_capture: false,
      target_exercise_registry_mutated: false,
      product_route_adoption_authorized: false,
      target_equivalent_completion_authorized: false,
      diagnostics_mastery_pv_scale_gate_student_use_authorized: false,
    },
  };

  await fsp.writeFile(proofJsonPath, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
  await fsp.writeFile(manifestJsonPath, `${JSON.stringify({ screenshots }, null, 2)}\n`, 'utf8');
  await fsp.writeFile(manifestMdPath, mdManifest(proof), 'utf8');
  console.log(`Wrote ${rel(proofJsonPath)}`);
  console.log(`Wrote ${rel(manifestMdPath)}`);
  console.log(`Verdict: ${proof.overall_verdict}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
