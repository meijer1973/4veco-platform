#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const sprintId = 'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM';
const platformRoot = path.resolve(__dirname, '..', '..');
const reconstructionPath = path.join(platformRoot, 'reports', 'json', 'source-reconstruct2-actual-exam.json');
const labPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-rendered-lab.html`);
const outputDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const jsonManifestPath = path.join(outputDir, 'manifest.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'source-reconstruct2-actual-exam-proof.json');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const forbiddenAnswerAmounts = ['649', '1.684', '1684', '1.035', '1035'];

const cases = [
  { name: 'desktop-light', size: { width: 1280, height: 860 }, theme: 'light' },
  { name: 'mobile-light', size: { width: 390, height: 844 }, theme: 'light' },
  { name: 'mobile-dark', size: { width: 390, height: 844 }, theme: 'dark' },
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderParagraphs(markdown) {
  return String(markdown)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');
}

function blockHtml(block) {
  if (block.type === 'markdown') {
    return `
      <section class="source-block source-block-text" data-block-type="markdown" data-context-id="${escapeHtml(block.id)}">
        <h2>${escapeHtml(block.title)}</h2>
        ${renderParagraphs(block.bodyMarkdown)}
      </section>`;
  }
  if (block.type === 'source_excerpt') {
    return `
      <section class="source-block source-card" data-block-type="source_excerpt" data-context-id="${escapeHtml(block.id)}">
        <p class="source-label">${escapeHtml(block.sourceLabel)}</p>
        <h2>${escapeHtml(block.caption)}</h2>
        ${renderParagraphs(block.bodyMarkdown)}
        <p class="source-ref">Bronbestand: ${escapeHtml(block.sourceRefs.join(', '))}</p>
      </section>`;
  }
  if (block.type === 'table') {
    const headers = block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${escapeHtml(cell)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`)
      .join('');
    return `
      <section class="source-block source-table-block" data-block-type="table" data-context-id="${escapeHtml(block.id)}" aria-label="${escapeHtml(block.altText)}">
        <p class="source-label">${escapeHtml(block.sourceLabel)}</p>
        <h2>${escapeHtml(block.caption)}</h2>
        <div class="table-scroll">
          <table>
            <caption>${escapeHtml(block.caption)}</caption>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
  }
  if (block.type === 'formula') {
    return `
      <section class="source-block source-formula" data-block-type="formula" data-context-id="${escapeHtml(block.id)}" aria-label="${escapeHtml(block.altText)}">
        <p class="source-label">${escapeHtml(block.sourceLabel)}</p>
        <h2>${escapeHtml(block.caption)}</h2>
        <pre><code>${escapeHtml(block.expression)}</code></pre>
        <dl>
          ${block.variables.map((item) => `<div><dt>${escapeHtml(item.symbol)}</dt><dd>${escapeHtml(item.meaning)}</dd></div>`).join('')}
        </dl>
      </section>`;
  }
  throw new Error(`Unsupported block type for lab: ${block.type}`);
}

function labHtml(reconstruction) {
  const blocks = reconstruction.contextBlocks.map(blockHtml).join('\n');
  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${sprintId} Rendered Source Lab</title>
  <style>
    :root {
      --ts-bg: #f7f5ef;
      --ts-panel: #ffffff;
      --ts-soft: #eef5f1;
      --ts-text: #1d2523;
      --ts-muted: #5b6965;
      --ts-line: #b8c5be;
      --ts-primary: #11605f;
      --ts-accent: #8f4f20;
      --ts-focus: #1a73e8;
      --ts-formula: #f4f7f6;
    }
    [data-theme="dark"] {
      --ts-bg: #161b1d;
      --ts-panel: #22282b;
      --ts-soft: #26342f;
      --ts-text: #f4f7f3;
      --ts-muted: #b8c4bd;
      --ts-line: #53635c;
      --ts-primary: #69d2c8;
      --ts-accent: #f0b35e;
      --ts-focus: #9ecbff;
      --ts-formula: #14191a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--ts-bg);
      color: var(--ts-text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.55;
    }
    main {
      width: min(1040px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 40px;
    }
    header {
      margin-bottom: 18px;
      border-bottom: 2px solid var(--ts-line);
      padding-bottom: 14px;
    }
    h1 {
      margin: 0 0 6px;
      font-size: clamp(1.7rem, 2.4vw, 2.25rem);
      letter-spacing: 0;
    }
    h2 {
      margin: 4px 0 10px;
      font-size: 1.15rem;
      letter-spacing: 0;
    }
    p { margin: 0 0 10px; }
    .kicker,
    .source-label,
    .source-ref {
      color: var(--ts-muted);
      font-size: 0.92rem;
    }
    .source-label {
      margin: 0 0 2px;
      color: var(--ts-primary);
      font-weight: 700;
    }
    .source-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .source-block {
      background: var(--ts-panel);
      border: 1px solid var(--ts-line);
      border-radius: 8px;
      padding: 16px;
    }
    .source-block-text {
      background: transparent;
      border-color: transparent;
      padding: 0;
    }
    .source-card,
    .source-table-block,
    .source-formula {
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
    }
    .table-scroll {
      overflow-x: auto;
      border: 1px solid var(--ts-line);
      border-radius: 8px;
    }
    table {
      width: 100%;
      min-width: 620px;
      border-collapse: collapse;
      background: var(--ts-panel);
    }
    caption {
      text-align: left;
      font-weight: 700;
      padding: 10px 12px;
      color: var(--ts-text);
    }
    th,
    td {
      border-top: 1px solid var(--ts-line);
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
      white-space: nowrap;
    }
    thead th {
      background: var(--ts-soft);
      color: var(--ts-text);
    }
    tbody th { font-weight: 700; }
    pre {
      margin: 0 0 10px;
      overflow-x: auto;
      padding: 12px;
      background: var(--ts-formula);
      border: 1px solid var(--ts-line);
      border-radius: 8px;
      color: var(--ts-text);
      font-size: 1rem;
    }
    dl {
      display: grid;
      gap: 8px;
      margin: 0;
    }
    dl div {
      display: grid;
      grid-template-columns: 160px minmax(0, 1fr);
      gap: 10px;
    }
    dt { font-weight: 700; }
    dd { margin: 0; color: var(--ts-muted); }
    .review-panel {
      margin-top: 16px;
      padding: 14px 16px;
      background: var(--ts-soft);
      border: 1px solid var(--ts-line);
      border-radius: 8px;
      color: var(--ts-text);
    }
    @media (max-width: 640px) {
      main {
        width: min(100vw - 20px, 390px);
        padding-top: 18px;
      }
      h1 { font-size: 1.45rem; }
      .source-block { padding: 13px; }
      dl div { grid-template-columns: 1fr; gap: 2px; }
      table { min-width: 100%; }
      th, td {
        padding: 8px 7px;
        white-space: normal;
        font-size: 0.86rem;
        line-height: 1.35;
      }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="kicker">Review-only source reconstruction proof</p>
      <h1>Zoohee! zorgverzekering</h1>
      <p>De bron staat voor de vergelijking. Het antwoordbedrag blijft buiten dit scherm.</p>
    </header>
    <section class="source-grid" aria-label="Gereconstrueerde broncontext">
      ${blocks}
    </section>
    <aside class="review-panel">
      <strong>Reviewer check:</strong> controleer bronlabel, tabelwaarden, eenheden, rijvolgorde en mobiel/donker renderen.
    </aside>
  </main>
  <script>
    window.SourceReconstruct2Lab = {
      inspect() {
        const text = document.body.innerText;
        const blocks = [...document.querySelectorAll('.source-block')];
        const tables = [...document.querySelectorAll('table')];
        const images = [...document.querySelectorAll('img')];
        const sourceLabels = [...document.querySelectorAll('.source-label')].map((item) => item.textContent.trim());
        const captions = [...document.querySelectorAll('caption, .source-card h2, .source-table-block h2, .source-formula h2')].map((item) => item.textContent.trim());
        const overflowing = [...document.querySelectorAll('body *')].filter((item) => {
          const style = window.getComputedStyle(item);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          return item.scrollWidth > item.clientWidth + 2 && !item.closest('.table-scroll');
        });
        const contextTop = document.querySelector('.source-grid').getBoundingClientRect().top;
        const reviewTop = document.querySelector('.review-panel').getBoundingClientRect().top;
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          contextBlockCount: blocks.length,
          contextBeforeComparison: contextTop < reviewTop,
          sourceCardCount: document.querySelectorAll('.source-card').length,
          tableCount: tables.length,
          formulaCount: document.querySelectorAll('.source-formula').length,
          sourceLabels,
          captions,
          tableHeaders: [...document.querySelectorAll('thead th')].map((item) => item.textContent.trim()),
          tableValues: ['wettelijk eigen risico', '385', '108,25', 'verhoogd eigen risico', '885', '86,25'].map((value) => ({
            value,
            visible: text.includes(value)
          })),
          sourceRefsVisible: text.includes('references/external/exams/vw-1022-a-25-1-o.pdf#question-3'),
          rawImageCount: images.length,
          altCarrierCount: document.querySelectorAll('[aria-label]').length,
          visibleInternalContextIds: /ctx-zoohee/.test(text),
          overflowingCount: overflowing.length,
          overflowingTags: overflowing.slice(0, 8).map((item) => item.tagName.toLowerCase())
        };
      }
    };
  </script>
</body>
</html>`;
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
        expression: 'Boolean(window.SourceReconstruct2Lab)',
        returnByValue: true,
      },
      sessionId
    );
    if (result.result && result.result.value === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for source reconstruction lab');
}

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: 'JSON.stringify(window.SourceReconstruct2Lab.inspect())',
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
    lines.push(`- ${item.case}: \`${item.file}\` (${item.theme}, ${item.viewport.width}x${item.viewport.height})`);
  });
  lines.push(
    '',
    '## Review Notes',
    '',
    '- The lab is review-only source reconstruction proof.',
    '- Captures cover desktop light, mobile light at 390px, and mobile dark at 390px.',
    '- The proof JSON records captions, labels, table values, source refs, and boundary evidence.',
    ''
  );
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  const reconstruction = JSON.parse(await fsp.readFile(reconstructionPath, 'utf8'));
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofPath), { recursive: true });
  await fsp.writeFile(labPath, labHtml(reconstruction), 'utf8');

  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(os.tmpdir(), 'Codex-work', `source-reconstruct2-edge-${Date.now()}`);
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
          mobile: item.size.width < 500,
        },
        sessionId
      );
      await cdp.send('Page.navigate', { url: labUrl(serverPort) }, sessionId);
      await waitForLab(cdp, sessionId);
      await applyTheme(cdp, sessionId, item.theme);
      await sleep(250);
      const proof = await inspect(cdp, sessionId);
      const bodyText = await cdp.send(
        'Runtime.evaluate',
        {
          expression: 'document.body.innerText',
          returnByValue: true,
        },
        sessionId
      );
      proof.answerAmountVisible = forbiddenAnswerAmounts.some((value) => String(bodyText.result.value || '').includes(value));
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
      status: 'source_reconstruction_rendering_proof_complete',
      lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
      screenshot_manifest: path.relative(platformRoot, manifestPath).replace(/\\/g, '/'),
      screenshots: captured,
      source_reconstruction: {
        exam_item_id: reconstruction.sourceAuthority.exam_item_id,
        source_material_id: reconstruction.sourceAuthority.source_material_id,
        context_before_comparison: captured.every((item) => item.proof.contextBeforeComparison === true),
        table_count: captured[0].proof.tableCount,
        source_card_count: captured[0].proof.sourceCardCount,
        formula_count: captured[0].proof.formulaCount,
        visible_internal_context_ids: captured.some((item) => item.proof.visibleInternalContextIds),
        answer_amount_visible: captured.some((item) => item.proof.answerAmountVisible),
        raw_image_count: captured.reduce((total, item) => total + item.proof.rawImageCount, 0),
        table_values_visible: captured.every((item) => item.proof.tableValues.every((value) => value.visible === true)),
        responsive_mobile_viewports: captured.filter((item) => item.viewport.width < 500).map((item) => ({
          case: item.case,
          requested_width: item.viewport.width,
          browser_width: item.proof.viewport.width,
          screenshot_width: item.screenshot_dimensions.width,
          theme: item.theme,
        })),
      },
      boundary_evidence: boundaryEvidence,
      product_boundaries: {
        source_reconstruction: true,
        generated_lesson_output_changed: false,
        protected_reference_data_changed: false,
        source_data_changed: false,
        task_transformation: false,
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
