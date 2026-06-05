#!/usr/bin/env node
/**
 * Capture CHECK-SHORT-EXIT-2 rendered proof screenshots through headless Chromium.
 *
 * This script serves generated Book 1 output locally and writes sprint evidence
 * only. It does not mutate lesson output.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const sprintId = 'CHECK-SHORT-EXIT-2';
const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.env.CHECK_SHORT_EXIT2_BOOK_ROOT ||
    path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const outputDir = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshots`);
const manifestPath = path.join(platformRoot, 'reports', 'sprints', `${sprintId}-screenshot-manifest.md`);
const jsonManifestPath = path.join(outputDir, 'manifest.json');
const proofPath = path.join(platformRoot, 'reports', 'json', 'check-short-exit2-proof.json');
const chromiumCandidates = [
  process.env.CHROME_EXE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const chromiumExe = chromiumCandidates.find((candidate) => fs.existsSync(candidate));

const chapter = '1.1 Hoofdstuk Economisch denken en rekenen';
const paragraphs = {
  '1.1.1': '1.1.1 Schaarste en economisch denken',
  '1.1.2': '1.1.2 Percentages en indexcijfers',
  '1.1.3': '1.1.3 Grafieken en tabellen',
};

function page(paragraphId, suffix) {
  const name = paragraphs[paragraphId];
  if (!suffix) return `${chapter}/${name}/index.html`;
  return `${chapter}/${name}/${name} \u2013 ${suffix}.html`;
}

const cases = [
  { name: 'desktop-111-landing-check', paragraph: '1.1.1', surface: 'landing', path: page('1.1.1'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-111-korte-check', paragraph: '1.1.1', surface: 'short', path: page('1.1.1', 'korte-check'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-111-exit-ticket', paragraph: '1.1.1', surface: 'exit', path: page('1.1.1', 'exit-ticket'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-112-landing-check', paragraph: '1.1.2', surface: 'landing', path: page('1.1.2'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-112-korte-check', paragraph: '1.1.2', surface: 'short', path: page('1.1.2', 'korte-check'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-112-exit-ticket', paragraph: '1.1.2', surface: 'exit', path: page('1.1.2', 'exit-ticket'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-113-landing-check', paragraph: '1.1.3', surface: 'landing', path: page('1.1.3'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-113-korte-check', paragraph: '1.1.3', surface: 'short', path: page('1.1.3', 'korte-check'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'desktop-113-exit-ticket', paragraph: '1.1.3', surface: 'exit', path: page('1.1.3', 'exit-ticket'), size: { width: 1280, height: 900 }, theme: 'light' },
  { name: 'mobile-113-exit-ticket-dark', paragraph: '1.1.3', surface: 'exit', path: page('1.1.3', 'exit-ticket'), size: { width: 390, height: 844 }, theme: 'dark' },
];

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForScreenshotFile(file, timeoutMs) {
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

function runChromiumScreenshot(url, file, item) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--disable-extensions',
      '--disable-background-networking',
      '--run-all-compositor-stages-before-draw',
      `--window-size=${item.size.width},${item.size.height}`,
      `--screenshot=${file}`,
    ];
    if (item.theme === 'dark') {
      args.push('--force-dark-mode');
    }
    args.push(url);
    const child = spawn(chromiumExe, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;
    const settle = (fn) => {
      if (settled) return;
      settled = true;
      fn();
    };
    const timer = setTimeout(async () => {
      if (settled) return;
      if (await waitForScreenshotFile(file, 1500)) {
        try { child.kill(); } catch (_error) { /* ignore */ }
        settle(resolve);
        return;
      }
      try { child.kill(); } catch (_error) { /* ignore */ }
      settle(() => reject(new Error(`Chromium screenshot timed out before writing ${file}: ${(stderr || stdout).trim()}`)));
    }, 30000);
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      if (settled) return;
      clearTimeout(timer);
      settle(() => reject(error));
    });
    child.on('close', async (code) => {
      if (settled) return;
      clearTimeout(timer);
      if (await waitForScreenshotFile(file, 5000)) {
        settle(resolve);
        return;
      }
      settle(() => reject(new Error(`Chromium screenshot failed (${code}): ${(stderr || stdout).trim()}`)));
    });
  });
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function generatedPage(paragraphId, suffix) {
  return path.join(bookRoot, page(paragraphId, suffix));
}

function sourceData(surfaceKey) {
  return readJson(path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${surfaceKey}.json`));
}

function inspectLanding(paragraphId) {
  const html = readText(generatedPage(paragraphId));
  return {
    check_section_visible: /data-route-layer="check"/.test(html),
    korte_check_visible: /Korte check/.test(html),
    exit_ticket_visible: /Exit ticket/.test(html),
    short_copy_visible: /Kies wat je nog wilt oefenen/.test(html),
    exit_copy_visible: /Maak de volledige paragraaf-check/.test(html),
  };
}

function inspectSurface(paragraphId, surface) {
  const key = `${paragraphId}-${surface === 'short' ? 'korte-check' : 'exit-ticket'}`;
  const data = sourceData(key);
  const html = readText(generatedPage(paragraphId, surface === 'short' ? 'korte-check' : 'exit-ticket'));
  const tasks = data.tasks || [];
  const taskShells = tasks.filter((task) => task.type === 'task_shell').map((task) => task.taskShell || {});
  const graphTask = taskShells.find((task) => task.family === 'graph_construction_substitute');
  return {
    data_key: key,
    generated_page_exists: true,
    surface: data.surface,
    gate_approved: data.gateApproved === true,
    completion_language_eligible: data.completionLanguageEligible === true,
    target_readiness_evidence: data.targetReadinessEvidence === true,
    task_count: tasks.length,
    task_shell_count: taskShells.length,
    task_families: taskShells.map((task) => task.family),
    context_block_count: Array.isArray(data.contextBlocks) ? data.contextBlocks.length : 0,
    context_types: (data.contextBlocks || []).map((block) => block.type),
    no_prompt_context_block: !(data.contextBlocks || []).some((block) => block.type === 'prompt' || /prompt/i.test(block.id || '')),
    hidden_hints_allowed: surface === 'short',
    exit_ticket_hint_free: surface !== 'exit' || !html.includes('class="ts-hints"'),
    graph_workspace_required: Boolean(graphTask),
    graph_workspace_contract: graphTask ? {
      x_ticks: graphTask.interaction.axes.x.ticks,
      y_ticks: graphTask.interaction.axes.y.ticks,
      grid_css_available: readText(path.join(platformRoot, 'engines', 'task-shell.css')).includes('.ts-graph-grid-line'),
      same_workspace_line_runtime_available: readText(path.join(platformRoot, 'engines', 'task-shell-ui.js')).includes('data-graph-line-confirmed="true"'),
      axis_options: (graphTask.interaction.axisOptions || []).map((option) => option.label),
      expected_line_shape: graphTask.expected.lineShape,
    } : null,
    interval_halving_check: taskShells.some((task) => task.interaction && task.interaction.selectionMode === 'interval_halving_check'),
    no_completion_section_for_held_candidates: data.completionLanguageEligible !== true,
    rendered_loader_points_to_key: html.includes(`shared/exit-ticket/${key}.js`),
    forbidden_authority_copy_visible: /\b(diagnostisch|diagnose|mastery|sequencing|summatief|summative|AI|Scale Gate|PV)\b/i.test(html),
  };
}

function buildProof(captured) {
  const screenshotBlocked = captured.some((item) => item.capture_error || !item.file);
  const landingProof = Object.fromEntries(Object.keys(paragraphs).map((id) => [id, inspectLanding(id)]));
  const surfaceProof = {};
  for (const paragraphId of Object.keys(paragraphs)) {
    surfaceProof[`${paragraphId}-short`] = inspectSurface(paragraphId, 'short');
    surfaceProof[`${paragraphId}-exit`] = inspectSurface(paragraphId, 'exit');
  }
  return {
    schema_version: 1,
    sprint_id: sprintId,
    generated: new Date().toISOString(),
    status: screenshotBlocked ? 'rendered_proof_blocked_on_browser_screenshots' : 'rendered_proof_ready_for_lead_review',
    screenshot_manifest: path.relative(platformRoot, manifestPath).replace(/\\/g, '/'),
    screenshot_manifest_json: path.relative(platformRoot, jsonManifestPath).replace(/\\/g, '/'),
    screenshots: captured,
    proof: {
      all_screenshots_exist: captured.every((item) => item.file && fs.existsSync(path.join(platformRoot, item.file))),
      screenshot_capture_blocked: screenshotBlocked,
      all_landing_pages_show_two_check_cards: Object.values(landingProof).every((item) => item.korte_check_visible && item.exit_ticket_visible),
      advisory_short_checks_rendered: Object.keys(paragraphs).every((id) => surfaceProof[`${id}-short`].task_count > 0),
      exit_tickets_rendered: Object.keys(paragraphs).every((id) => surfaceProof[`${id}-exit`].task_count > 0),
      short_checks_advisory_only: Object.keys(paragraphs).every((id) => surfaceProof[`${id}-short`].target_readiness_evidence === false),
      new_exit_completion_language_held: ['1.1.1', '1.1.3'].every((id) => surfaceProof[`${id}-exit`].completion_language_eligible === false),
      reviewed_112_exit_preserved: surfaceProof['1.1.2-exit'].gate_approved === true && surfaceProof['1.1.2-exit'].completion_language_eligible === true,
      paragraph_113_context_blocks_rendered: surfaceProof['1.1.3-exit'].context_block_count === 4,
      paragraph_113_graph_workspace_contract_present: surfaceProof['1.1.3-exit'].graph_workspace_required === true,
      paragraph_113_interval_halving_present: surfaceProof['1.1.3-exit'].interval_halving_check === true,
      no_prompt_context_block: Object.values(surfaceProof).every((item) => item.no_prompt_context_block === true),
      no_exit_ticket_content_hints: Object.keys(paragraphs).every((id) => surfaceProof[`${id}-exit`].exit_ticket_hint_free === true),
      no_forbidden_authority_copy: Object.values(surfaceProof).every((item) => item.forbidden_authority_copy_visible === false),
      landing: landingProof,
      surfaces: surfaceProof,
      authority: {
        product_route_adoption_authorized: false,
        new_target_equivalent_completion_language_authorized: false,
        diagnostics_authorized: false,
        mastery_or_sequencing_authorized: false,
        pv_authorized: false,
        scale_gate_1_authorized: false,
      },
    },
  };
}

function writeManifest(captured) {
  const lines = [
    `# ${sprintId} Screenshot Manifest`,
    '',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    captured.some((item) => item.capture_error || !item.file)
      ? 'Rendered Book 1 check-surface proof attempt. Browser screenshot capture is blocked in this local environment; see manifest JSON for per-case errors.'
      : 'Rendered Book 1 check-surface proof. Screenshots are captured from the generated lesson target through a local static server.',
    '',
    '| Case | Surface | Theme | Viewport | File |',
    '|---|---|---|---|---|',
  ];
  for (const item of captured) {
    lines.push(`| ${item.case} | ${item.paragraph} ${item.surface} | ${item.theme} | ${item.viewport.width}x${item.viewport.height} | ${item.file} |`);
  }
  lines.push('');
  lines.push('Boundary: screenshots do not authorize product-route adoption, new target-equivalent completion language, diagnostics, mastery, sequencing, PV, Scale Gate 1, or student/product use.');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  if (!chromiumExe) throw new Error(`Chromium executable not found. Tried: ${chromiumCandidates.join(', ')}`);
  await fsp.mkdir(outputDir, { recursive: true });
  const port = await findFreePort();
  const server = await startStaticServer(bookRoot, port);
  const captured = [];
  try {
    for (const item of cases) {
      const file = path.join(outputDir, `${item.name}.png`);
      let captureError = null;
      try {
        await runChromiumScreenshot(`http://127.0.0.1:${port}/` + encodeURI(item.path), file, item);
      } catch (error) {
        captureError = error.message || String(error);
      }
      captured.push({
        case: item.name,
        paragraph: item.paragraph,
        surface: item.surface,
        path: item.path,
        theme: item.theme,
        viewport: item.size,
        file: fs.existsSync(file) ? path.relative(platformRoot, file).replace(/\\/g, '/') : null,
        capture_error: captureError,
      });
    }
  } finally {
    server.close();
  }
  const manifestJson = {
    schema_version: 1,
    sprint_id: sprintId,
    generated: new Date().toISOString(),
    cases: captured,
  };
  await fsp.writeFile(jsonManifestPath, `${JSON.stringify(manifestJson, null, 2)}\n`, 'utf8');
  await fsp.writeFile(manifestPath, writeManifest(captured), 'utf8');
  await fsp.writeFile(proofPath, `${JSON.stringify(buildProof(captured), null, 2)}\n`, 'utf8');
  const failed = captured.filter((item) => item.capture_error || !item.file).length;
  console.log(`${sprintId} screenshot evidence recorded: ${captured.length - failed} captured, ${failed} blocked`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
