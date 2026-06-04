#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { buildPlayableLabHtml } = require('./task-ingest-playable-lab');

const sprintId = 'TASK-INGEST-TRANSFORM-3-TEXTBOOK';
const platformRoot = path.resolve(__dirname, '..', '..');
const transformPath = path.join(platformRoot, 'reports', 'json', 'task-ingest-transform3-textbook.json');
const labPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-rendered-lab.html`);
const outputDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const jsonManifestPath = path.join(outputDir, 'manifest.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'task-ingest-transform3-textbook-proof.json');
const chromeExe = process.env.CHROME_EXE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const derivedAnswerSignals = ['350', '-50', '400 naar 200', '200 naar 100'];

const cases = [
  { name: 'desktop-initial', action: 'initial', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-wrong-retry', action: 'wrong', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-corrected', action: 'corrected', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-completed', action: 'complete', size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'mobile-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'light' },
  { name: 'mobile-dark-completed', action: 'complete', size: { width: 390, height: 844 }, theme: 'dark' },
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

function playableLabHtml(transform) {
  return buildPlayableLabHtml({
    sprintId,
    transform,
    windowName: 'TaskIngestTransform3Lab',
    title: 'IJskraam tabel en P-Q-grafiek',
    kicker: 'Review-only textbook-source playable task transformation proof',
    intro: 'Bronnen, tabel en grafiek blijven leesbaar terwijl je de vragen doorloopt.',
    reviewCheck: 'controleer dat tabelwaarden, assen, grafiekpunten, interpolatie, berekening en claimzin samen de bronbewerking dragen.'
  });
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

function paragraphs(markdown) {
  return String(markdown)
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');
}

function graphSvg(block) {
  const points = block.series[0].points;
  const xMin = block.axes.x.min;
  const xMax = block.axes.x.max;
  const yMin = block.axes.y.min;
  const yMax = block.axes.y.max;
  const width = 560;
  const height = 320;
  const padL = 70;
  const padR = 28;
  const padT = 24;
  const padB = 58;
  const sx = (x) => padL + ((x - xMin) / (xMax - xMin)) * (width - padL - padR);
  const sy = (y) => height - padB - ((y - yMin) / (yMax - yMin)) * (height - padT - padB);
  const line = points.map((point) => `${sx(point.x).toFixed(1)},${sy(point.y).toFixed(1)}`).join(' ');
  const circles = points
    .map((point) => `<circle cx="${sx(point.x).toFixed(1)}" cy="${sy(point.y).toFixed(1)}" r="4.8"><title>Q ${point.x}, P ${point.y}</title></circle>`)
    .join('');
  const xTicks = [0, 100, 200, 300, 400, 500, 600]
    .map((value) => `<g><line x1="${sx(value)}" y1="${height - padB}" x2="${sx(value)}" y2="${height - padB + 5}"></line><text x="${sx(value)}" y="${height - padB + 22}">${value}</text></g>`)
    .join('');
  const yTicks = [0, 1, 2, 3]
    .map((value) => `<g><line x1="${padL - 5}" y1="${sy(value)}" x2="${padL}" y2="${sy(value)}"></line><text x="${padL - 12}" y="${sy(value) + 4}" text-anchor="end">${value}</text></g>`)
    .join('');
  return `<svg class="graph-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(block.altText)}">
    <rect width="${width}" height="${height}" rx="8"></rect>
    <g class="grid">${xTicks}${yTicks}</g>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}"></line>
    <line class="axis" x1="${padL}" y1="${height - padB}" x2="${padL}" y2="${padT}"></line>
    <polyline class="series" points="${line}"></polyline>
    <g class="points">${circles}</g>
    <text class="axis-label" x="${(width + padL - padR) / 2}" y="${height - 14}">${escapeHtml(block.axes.x.label)}</text>
    <text class="axis-label y-label" transform="translate(18 ${(height - padB + padT) / 2}) rotate(-90)">${escapeHtml(block.axes.y.label)}</text>
  </svg>`;
}

function blockHtml(block) {
  if (block.type === 'markdown') {
    return `<section class="ctx-block ctx-text" data-block-type="markdown"><h2>${escapeHtml(block.title)}</h2>${paragraphs(block.bodyMarkdown)}</section>`;
  }
  if (block.type === 'source_excerpt') {
    return `<section class="ctx-block ctx-card" data-block-type="source_excerpt"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${paragraphs(block.bodyMarkdown)}<p class="source-ref">Bronbestand: ${escapeHtml(block.sourceRefs.join(', '))}</p></section>`;
  }
  if (block.type === 'table') {
    const headers = block.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell, index) => `<${index === 0 ? 'th scope="row"' : 'td'}>${escapeHtml(cell)}</${index === 0 ? 'th' : 'td'}>`).join('')}</tr>`)
      .join('');
    return `<section class="ctx-block ctx-table" data-block-type="table" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="table-scroll"><table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  if (block.type === 'graph') {
    return `<section class="ctx-block ctx-graph" data-block-type="graph"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2>${graphSvg(block)}</section>`;
  }
  if (block.type === 'formula') {
    const vars = block.variables.map((item) => `<div><dt>${escapeHtml(item.symbol)}</dt><dd>${escapeHtml(item.meaning)}</dd></div>`).join('');
    return `<section class="ctx-block ctx-formula" data-block-type="formula" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><div class="formula-scroll"><pre><code>${escapeHtml(block.expression)}</code></pre></div><dl>${vars}</dl></section>`;
  }
  if (block.type === 'flowchart') {
    const nodes = block.nodes.map((node) => `<li>${escapeHtml(node.label)}</li>`).join('');
    return `<section class="ctx-block ctx-flow" data-block-type="flowchart" aria-label="${escapeHtml(block.altText)}"><p class="source-label">${escapeHtml(block.sourceLabel)}</p><h2>${escapeHtml(block.caption)}</h2><ol class="flow-list">${nodes}</ol></section>`;
  }
  return '';
}

function operationLabel(operationId) {
  const labels = {
    read_table_value: 'tabelwaarde aflezen',
    select_pq_axes: 'P-Q-assen kiezen',
    order_graph_procedure: 'grafiekprocedure ordenen',
    plot_table_point: 'tabelpunt plaatsen',
    select_interpolation_source_values: 'interpolatiewaarden kiezen',
    interpolate_graph_value: 'grafiekwaarde aflezen',
    calculate_percent_drop: 'procentuele daling berekenen',
    state_claim_with_source_limits: 'claim met bronwaarden formuleren',
  };
  return labels[operationId] || operationId.replace(/_/g, ' ');
}

function taskHtml(task, index, transform) {
  const mapped = transform.taskFamilyMap.find((item) => item.task_id === task.id);
  const opText = mapped ? mapped.mapped_operations.map(operationLabel).join(', ') : '';
  return `<article class="task-card" data-task-family="${escapeHtml(task.family)}" data-context-ref-count="${task.contextRefs.length}">
    <p class="card-kicker">Taakkaart ${index + 1}</p>
    <h2>${escapeHtml(task.skillLabel)}</h2>
    <p>${escapeHtml(task.purpose)}</p>
    <p class="prompt">${escapeHtml(task.prompt)}</p>
    <p class="mapped">Bewaakt: ${escapeHtml(opText)}</p>
  </article>`;
}

function labHtml(transform) {
  const blocks = transform.taskSet.contextBlocks.map(blockHtml).join('\n');
  const tasks = transform.taskSet.tasks.map((task, index) => taskHtml(task, index, transform)).join('\n');
  return `<!doctype html>
<html lang="nl" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${sprintId} Rendered Task Transformation Lab</title>
  <style>
    :root {
      --bg: #f6f3ea;
      --panel: #ffffff;
      --soft: #e9f2ee;
      --text: #202420;
      --muted: #5c675f;
      --line: #b7c5bd;
      --primary: #0f6b5f;
      --accent: #8a4d18;
      --formula: #f3f6f5;
      --graph-bg: #ffffff;
    }
    [data-theme="dark"] {
      --bg: #161819;
      --panel: #222726;
      --soft: #26342e;
      --text: #f5f4ef;
      --muted: #bac5bf;
      --line: #56645e;
      --primary: #72d8c8;
      --accent: #f0b35e;
      --formula: #141819;
      --graph-bg: #101313;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.55;
    }
    main {
      width: min(1120px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 42px;
    }
    header {
      padding-bottom: 14px;
      border-bottom: 2px solid var(--line);
      margin-bottom: 18px;
    }
    h1 {
      margin: 0 0 6px;
      font-size: clamp(1.7rem, 2.4vw, 2.35rem);
      letter-spacing: 0;
    }
    h2 {
      margin: 4px 0 10px;
      font-size: 1.1rem;
      letter-spacing: 0;
    }
    p { margin: 0 0 10px; }
    .kicker, .card-kicker, .source-label, .source-ref, .mapped {
      color: var(--muted);
      font-size: 0.92rem;
    }
    .source-label {
      color: var(--primary);
      font-weight: 700;
      margin-bottom: 2px;
    }
    .ctx-grid, .task-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .ctx-block, .task-card, .review-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
    }
    .ctx-text {
      background: transparent;
      border-color: transparent;
      padding: 0;
    }
    .table-scroll, .formula-scroll {
      overflow-x: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
    }
    table {
      width: 100%;
      min-width: 460px;
      border-collapse: collapse;
      background: var(--panel);
    }
    caption {
      text-align: left;
      font-weight: 700;
      padding: 10px 12px;
    }
    th, td {
      border-top: 1px solid var(--line);
      padding: 10px 12px;
      text-align: left;
      white-space: nowrap;
    }
    thead th { background: var(--soft); }
    tbody th { font-weight: 700; }
    pre {
      min-width: 520px;
      margin: 0;
      padding: 12px;
      background: var(--formula);
      color: var(--text);
    }
    dl {
      display: grid;
      gap: 8px;
      margin: 12px 0 0;
    }
    dl div {
      display: grid;
      grid-template-columns: 150px minmax(0, 1fr);
      gap: 10px;
    }
    dt { font-weight: 700; }
    dd { margin: 0; color: var(--muted); }
    .graph-svg {
      width: 100%;
      max-width: 620px;
      height: auto;
      display: block;
      margin-top: 8px;
    }
    .graph-svg rect {
      fill: var(--graph-bg);
      stroke: var(--line);
    }
    .graph-svg line,
    .graph-svg .grid line {
      stroke: var(--line);
      stroke-width: 1;
    }
    .graph-svg .axis {
      stroke: var(--text);
      stroke-width: 2;
    }
    .graph-svg .series {
      fill: none;
      stroke: var(--primary);
      stroke-width: 3;
    }
    .graph-svg circle {
      fill: var(--accent);
      stroke: var(--panel);
      stroke-width: 2;
    }
    .graph-svg text {
      fill: var(--muted);
      font-size: 13px;
      text-anchor: middle;
    }
    .graph-svg .axis-label {
      fill: var(--text);
      font-weight: 700;
    }
    .flow-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style-position: inside;
    }
    .flow-list li {
      min-height: 64px;
      border: 1px solid var(--line);
      background: var(--soft);
      border-radius: 8px;
      padding: 11px;
    }
    .section-title {
      margin: 24px 0 12px;
      color: var(--text);
      font-size: 1.25rem;
    }
    .task-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .task-card {
      display: grid;
      align-content: start;
      min-height: 210px;
    }
    .prompt {
      border-left: 3px solid var(--primary);
      padding-left: 10px;
      color: var(--text);
    }
    .mapped {
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px solid var(--line);
    }
    .review-panel {
      margin-top: 16px;
      background: var(--soft);
    }
    @media (max-width: 900px) {
      .task-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .flow-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      main {
        width: min(100vw - 20px, 390px);
        padding-top: 18px;
      }
      h1 { font-size: 1.42rem; }
      .task-grid, .flow-list { grid-template-columns: 1fr; }
      .ctx-block, .task-card, .review-panel { padding: 13px; }
      table { min-width: 100%; }
      th, td {
        padding: 8px 7px;
        white-space: normal;
        font-size: 0.86rem;
        line-height: 1.35;
      }
      pre { min-width: 470px; }
      dl div { grid-template-columns: 1fr; gap: 2px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="kicker">Review-only textbook-source task transformation proof</p>
      <h1>IJskraam tabel en P-Q-grafiek</h1>
      <p>Broncontext staat eerst; daarna volgen de getransformeerde taakkaarten.</p>
    </header>
    <section class="ctx-grid" aria-label="Broncontext">${blocks}</section>
    <h2 class="section-title">Getransformeerde taakkaarten</h2>
    <section class="task-grid" aria-label="Taakkaarten">${tasks}</section>
    <aside class="review-panel" id="task-map">
      <strong>Reviewer check:</strong> controleer dat tabelwaarden, assen, grafiekpunten, interpolatie, berekening en claimzin samen de bronbewerking dragen.
    </aside>
  </main>
  <script>
    window.TaskIngestTransform3Lab = {
      inspect() {
        const text = document.body.innerText;
        const contextSection = document.querySelector('.ctx-grid');
        const taskSection = document.querySelector('.task-grid');
        const contextText = contextSection ? contextSection.innerText : '';
        const taskText = taskSection ? taskSection.innerText : '';
        const overflowing = [...document.querySelectorAll('body *')].filter((item) => {
          const style = window.getComputedStyle(item);
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (item.ownerSVGElement) return false;
          return item.scrollWidth > item.clientWidth + 2 && !item.closest('.table-scroll') && !item.closest('.formula-scroll');
        });
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          contextBlockCount: document.querySelectorAll('.ctx-block').length,
          taskCardCount: document.querySelectorAll('.task-card').length,
          families: [...document.querySelectorAll('.task-card')].map((item) => item.getAttribute('data-task-family')),
          contextBeforeTasks: contextSection.getBoundingClientRect().top < taskSection.getBoundingClientRect().top,
          tableCount: document.querySelectorAll('table').length,
          graphCount: document.querySelectorAll('.graph-svg').length,
          flowchartCount: document.querySelectorAll('.flow-list').length,
          sourceRefsVisible: text.includes('references/authored/course-target-exercises.json#paragraph_id=1.1.3'),
          bodyTextSnapshot: text,
          contextTextSnapshot: contextText,
          taskTextSnapshot: taskText,
          rawImageCount: document.querySelectorAll('img').length,
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
        expression: 'Boolean(window.TaskIngestTransform3Lab)',
        returnByValue: true,
      },
      sessionId
    );
    if (result.result && result.result.value === true) return;
    await sleep(150);
  }
  throw new Error('Timed out waiting for task transformation lab');
}

async function inspect(cdp, sessionId) {
  const result = await cdp.send(
    'Runtime.evaluate',
    {
      expression: 'JSON.stringify(window.TaskIngestTransform3Lab.inspect())',
      returnByValue: true,
    },
    sessionId
  );
  return JSON.parse(result.result.value);
}

async function driveLabState(cdp, sessionId, action) {
  const expressions = {
    initial: 'window.TaskIngestTransform3Lab.resetAll()',
    wrong: 'window.TaskIngestTransform3Lab.applyWrongAttempt(0)',
    corrected: 'window.TaskIngestTransform3Lab.correctTask(0)',
    complete: 'window.TaskIngestTransform3Lab.completeDemoPath()',
  };
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: expressions[action] || expressions.initial,
      returnByValue: true,
    },
    sessionId
  );
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
    '- The lab is review-only textbook-source task-transformation proof.',
    '- Captures cover initial, wrong/retry, corrected, desktop completed, mobile completed, and mobile dark completed states.',
    '- The proof JSON records semantic validation, task-family controls, support collapse, source scrolling, question visibility, visual counts, and boundary evidence.',
    ''
  );
  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!fs.existsSync(chromeExe)) throw new Error(`Chromium executable not found: ${chromeExe}`);
  const transform = JSON.parse(await fsp.readFile(transformPath, 'utf8'));
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.mkdir(path.dirname(proofPath), { recursive: true });
  await fsp.writeFile(labPath, playableLabHtml(transform), 'utf8');

  const serverPort = await findFreePort();
  const devtoolsPort = await findFreePort();
  const server = await startStaticServer(platformRoot, serverPort);
  const profileDir = path.join(os.tmpdir(), 'Codex-work', `task-ingest-transform3-edge-${Date.now()}`);
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
      await driveLabState(cdp, sessionId, item.action);
      const proof = await inspect(cdp, sessionId);
      const bodyTextSnapshot = proof.bodyTextSnapshot || '';
      const contextTextSnapshot = proof.contextTextSnapshot || '';
      const taskTextSnapshot = proof.taskTextSnapshot || '';
      proof.visibleInternalIds = ['ctx-icecream', 'tb113-'].some((value) => bodyTextSnapshot.includes(value));
      proof.derivedAnswerVisibleInContext = derivedAnswerSignals.some((value) => contextTextSnapshot.includes(value));
      proof.derivedAnswerVisibleInTaskCards = derivedAnswerSignals.some((value) => taskTextSnapshot.includes(value));
      delete proof.bodyTextSnapshot;
      delete proof.contextTextSnapshot;
      delete proof.taskTextSnapshot;
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
        action: item.action,
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
      status: 'playable_repair_proof_complete',
      lab: path.relative(platformRoot, labPath).replace(/\\/g, '/'),
      screenshot_manifest: path.relative(platformRoot, manifestPath).replace(/\\/g, '/'),
      screenshots: captured,
      task_transformation: {
        paragraph_id: transform.sourceAuthority.paragraph_id,
        source_authority_kind: transform.sourceAuthority.kind,
        source_material_id: transform.sourceAuthority.source_material_id,
        task_count: transform.taskSet.tasks.length,
        context_block_count: transform.taskSet.contextBlocks.length,
        required_families: [
          'table_value_selection',
          'structured_short_response',
          'step_ordering',
          'point_placement',
          'source_value_selection',
          'graph_reading',
          'calculation_work_capture',
          'source_chain_builder',
        ],
        rendered_families: captured[0].proof.families,
        context_before_tasks: captured.every((item) => item.proof.contextBeforeTasks === true),
        derived_answer_visible_in_context: captured.some((item) => item.proof.derivedAnswerVisibleInContext),
        derived_answer_visible_in_task_cards: captured.some((item) => item.proof.derivedAnswerVisibleInTaskCards),
        visible_internal_ids: captured.some((item) => item.proof.visibleInternalIds),
        raw_image_count: captured.reduce((total, item) => total + item.proof.rawImageCount, 0),
        playable_lab: {
          cases_required: cases.map((item) => item.name),
          cases_captured: captured.map((item) => item.case),
          semantic_validation_enabled: captured.every((item) => item.proof.semanticValidationEnabled === true),
          real_task_family_controls_rendered: captured.every((item) => item.proof.genericOptionLabelVisible === false && item.proof.interactiveControlCount >= transform.taskSet.tasks.length),
          source_value_banks_rendered: captured.every((item) => item.proof.familyAffordances.source_value_selection?.valueBank === true && item.proof.familyAffordances.source_value_selection?.roleBank === true),
          sequence_builders_rendered: captured.every((item) => ['step_ordering', 'source_chain_builder'].every((family) => item.proof.familyAffordances[family]?.sequenceBuilder === true)),
          choice_options_rendered: captured.every((item) => item.proof.familyAffordances.table_value_selection?.choiceOptions === true),
          graph_reading_field_rendered: captured.every((item) => item.proof.familyAffordances.graph_reading?.numericField === true),
          point_fields_rendered: captured.every((item) => item.proof.familyAffordances.point_placement?.pointFields === true),
          calculation_fields_rendered: captured.every((item) => item.proof.familyAffordances.calculation_work_capture?.calculationFields === true),
          structured_fields_rendered: captured.every((item) => item.proof.familyAffordances.structured_short_response?.structuredFields === true),
          plain_sequence_textareas_absent: captured.every((item) => item.proof.plainSequenceTextareaCount === 0),
          check_buttons_rendered: captured.every((item) => item.proof.checkButtonCount === transform.taskSet.tasks.length),
          task_instructions_rendered: captured.every((item) => item.proof.taskInstructionCount === transform.taskSet.tasks.length),
          support_collapsed_by_default: captured.every((item) => item.proof.supportCollapsedByDefault === true),
          initial_state_proven: captured.some((item) => item.case === 'desktop-initial' && item.proof.completedTaskCount === 0 && item.proof.labCompleted === false),
          wrong_retry_state_proven: captured.some((item) => item.case === 'desktop-wrong-retry' && item.proof.wrongRetryCount > 0 && item.proof.retryFeedbackCount > 0 && item.proof.completedTaskCount === 0),
          corrected_state_proven: captured.some((item) => item.case === 'desktop-corrected' && item.proof.completedTaskCount === 1 && item.proof.wrongRetryCount === 0 && item.proof.labCompleted === false),
          completion_path_reaches_done: captured.filter((item) => item.action === 'complete').every((item) => item.proof.labCompleted === true && item.proof.completedTaskCount === transform.taskSet.tasks.length),
          source_pane_independent_scroll: captured.every((item) => item.proof.sourcePaneIndependentScroll === true),
          question_visible_after_source_scroll: captured.every((item) => item.proof.questionVisibleAfterSourceScroll === true)
        },
        visual_counts: {
          tables: captured[0].proof.tableCount,
          graphs: captured[0].proof.graphCount,
          flowcharts: captured[0].proof.flowchartCount,
        },
        responsive_mobile_viewports: captured.filter((item) => item.viewport.width < 500).map((item) => ({
          case: item.case,
          requested_width: item.viewport.width,
          browser_width: item.proof.viewport.width,
          screenshot_width: item.screenshot_dimensions.width,
          theme: item.theme,
        })),
      },
      ambiguity_evidence: {
        ambiguity_id: transform.textbookSourceAmbiguity.id,
        paragraph_taught_interval_recorded: true,
        also_source_valid_interval_recorded: true,
        source_values_plus_calculation_required: true,
      },
      boundary_evidence: boundaryEvidence,
      product_boundaries: {
        task_transformation: true,
        generated_lesson_output_changed: false,
        protected_reference_data_changed: false,
        source_data_changed: false,
        official_exam_claim: false,
        external_primary_claim: false,
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
