#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');

function fail(message) {
  throw new Error(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function normalizePathForReport(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function findParagraphDir(bookRoot) {
  const chapterRoot = path.join(bookRoot, '1.1 Hoofdstuk Economisch denken en rekenen');
  if (!fs.existsSync(chapterRoot)) fail(`missing chapter root: ${chapterRoot}`);
  const entry = fs.readdirSync(chapterRoot, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith('1.1.3 '));
  if (!entry) fail('missing 1.1.3 paragraph directory');
  return path.join(chapterRoot, entry.name);
}

function findGeneratedExitPage(bookRoot) {
  const dir = findParagraphDir(bookRoot);
  const entry = fs.readdirSync(dir, { withFileTypes: true })
    .find((item) => item.isFile() && /exit-ticket\.html$/i.test(item.name));
  if (!entry) fail('missing 1.1.3 exit-ticket HTML page');
  return path.join(dir, entry.name);
}

function loadedHrefOrSrc(html, fileName) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('<(?:link|script)\\b[^>]*(?:href|src)=["\'][^"\']*' + escaped + '["\'][^>]*>', 'i');
  return pattern.test(html);
}

function assertContains(html, regex, message) {
  if (!regex.test(html)) fail(message);
}

function assertNotContains(html, regex, message) {
  if (regex.test(html)) fail(message);
}

function mixedGoldenLegacyClassAttrs(html) {
  const matches = [];
  const attrPattern = /\bclass\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrPattern.exec(html))) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    const hasGolden = classes.some((name) => /^ge-/.test(name));
    const hasLegacy = classes.some((name) => /^et-/.test(name) || /^ts-/.test(name) || /task-shell/.test(name) || name === 'app-shell');
    if (hasGolden && hasLegacy) {
      matches.push(match[1]);
    }
  }
  return matches;
}

function checkHtml(html, options = {}) {
  const label = options.label || 'golden ticket route';
  const errors = [];
  function collect(fn) {
    try {
      fn();
    } catch (error) {
      errors.push(error.message);
    }
  }

  collect(() => assertNotContains(html, /\bid\s*=\s*["']exit-ticket-app["']/i, `${label}: #exit-ticket-app must be absent`));
  ['golden-ticket-layout.css', 'golden-ticket-graph.js', 'golden-ticket-layout.js'].forEach((fileName) => {
    collect(() => {
      if (!loadedHrefOrSrc(html, fileName)) fail(`${label}: must load ${fileName}`);
    });
  });
  ['task-shell.css', 'exit-ticket.css', 'skill-map-route.css'].forEach((fileName) => {
    collect(() => {
      if (loadedHrefOrSrc(html, fileName)) fail(`${label}: must not load ${fileName}`);
    });
  });
  ['skill-map-route-ui.js', 'task-shell-engine.js', 'task-shell-ui.js', 'exit-ticket-engine.js', 'exit-ticket-ui.js'].forEach((fileName) => {
    collect(() => {
      if (loadedHrefOrSrc(html, fileName)) fail(`${label}: must not load ${fileName}`);
    });
  });

  const mixed = mixedGoldenLegacyClassAttrs(html);
  if (mixed.length) {
    errors.push(`${label}: class attributes mix golden and legacy classes: ${mixed.join(' | ')}`);
  }

  collect(() => assertNotContains(html, /\b(?:et-page|et-topbar|et-back|et-theme-toggle|et-card|et-task|task-shell-card|app-shell)\b/i, `${label}: legacy task-shell/app-shell classes must be absent`));
  collect(() => assertContains(html, /<header\b[^>]*class\s*=\s*["'][^"']*\bge-topbar\b[^"']*["'][^>]*>/i, `${label}: header.ge-topbar is required`));
  collect(() => assertNotContains(html, /<header\b[^>]*class\s*=\s*["'][^"']*\bge-topbar\b[^"']*\bet-/i, `${label}: header must not mix ge-topbar with et-*`));
  collect(() => assertContains(html, /<main\b[^>]*class\s*=\s*["'][^"']*\bge-page\b[^"']*["'][^>]*data-golden-ticket-root/i, `${label}: main.ge-page[data-golden-ticket-root] is required`));
  collect(() => assertNotContains(html, /<main\b[^>]*class\s*=\s*["'][^"']*\bge-page\b[^"']*\bet-page/i, `${label}: main.ge-page must not also be et-page`));
  collect(() => assertContains(html, /<section\b[^>]*class\s*=\s*["'][^"']*\bge-hero\b[^"']*["']/i, `${label}: .ge-hero is required`));
  collect(() => assertContains(html, /<div\b[^>]*class\s*=\s*["'][^"']*\bge-hero-card\b[^"']*["']/i, `${label}: .ge-hero-card is required`));
  collect(() => assertContains(html, /<nav\b[^>]*class\s*=\s*["'][^"']*\bge-route-panel\b[^"']*["']/i, `${label}: .ge-route-panel is required`));
  collect(() => assertContains(html, /<section\b[^>]*class\s*=\s*["'][^"']*\bge-workbench\b[^"']*["']/i, `${label}: .ge-workbench is required`));
  collect(() => assertContains(html, /<aside\b[^>]*class\s*=\s*["'][^"']*\bge-source-card\b[^"']*["']/i, `${label}: .ge-source-card is required`));
  collect(() => assertContains(html, /<h2>\s*Bron 1\s+—\s+broodjeskraam bij het station\s*<\/h2>/i, `${label}: source title must match golden source heading`));
  collect(() => assertNotContains(html, />\s*Bekijk eerst de bron\s*</i, `${label}: generic source pane title must be absent`));
  collect(() => assertNotContains(html, />\s*Tabel 1\s+-\s+Prijs en verkochte broodjes\s*</i, `${label}: table caption must not compete with source title`));
  collect(() => assertContains(html, /<section\b[^>]*class\s*=\s*["'][^"']*\bge-task-card\b[^"']*["']/i, `${label}: .ge-task-card is required`));
  collect(() => assertContains(html, /\bclass\s*=\s*["'][^"']*\bge-lock-overlay\b/i, `${label}: locked follow-up overlay is required`));
  collect(() => assertNotContains(html, /<input\b[^>]*\btype\s*=\s*["']?checkbox\b/i, `${label}: student-facing checkbox controls must be absent`));
  collect(() => assertNotContains(html, /\bdata-ge-connect-line\b/i, `${label}: old connect-line checkbox control must be absent`));
  collect(() => assertNotContains(html, /\bdata-ge-line-shape\b|\bdata-line-shape-value\b/i, `${label}: student-facing line-shape controls must be absent`));
  collect(() => assertNotContains(html, /(?:Verbind mijn punten|Verbind de punten|Trek lijn door punten)/i, `${label}: student-facing connect-line prompt text must be absent`));
  collect(() => assertNotContains(html, />\s*(?:Lijnvorm|Dalend|Stijgend|Horizontaal|Geen duidelijk verband)\s*</i, `${label}: student-facing slope answer text must be absent`));
  collect(() => assertContains(html, /<svg\b[^>]*class\s*=\s*["'][^"']*\bge-graph\b[^"']*["'][^>]*data-graph-id\s*=\s*["']golden-ticket-113["']/i, `${label}: graph SVG with golden id is required`));
  collect(() => assertContains(html, /data-expected-x-label\s*=\s*["']Hoeveelheid Q \(broodjes\)["']/i, `${label}: graph expected x-axis label is missing`));
  collect(() => assertContains(html, /data-expected-y-label\s*=\s*["']Prijs P \(EUR\)["']/i, `${label}: graph expected y-axis label is missing`));
  collect(() => assertContains(html, /data-expected-points\s*=\s*["'][^"']*350,1[^"']*300,1\.5[^"']*250,2[^"']*200,2\.5[^"']*150,3/i, `${label}: graph expected points are missing`));
  collect(() => assertContains(html, /data-line-or-shape\s*=\s*["']decreasing["']/i, `${label}: graph line shape is missing`));
  collect(() => assertContains(html, /<a\b[^>]*class\s*=\s*["'][^"']*\bge-back\b[^"']*["'][^>]*href\s*=\s*["']index\.html["']/i, `${label}: back link must target index.html`));
  collect(() => assertContains(html, /1\.1\.3%20Grafieken%20en%20tabellen%20%E2%80%93%20grafiekenspel\.html/i, `${label}: graph practice route link is missing`));
  collect(() => assertContains(html, /\.\.\/1\.1\.2%20Percentages%20en%20indexcijfers\/1\.1\.2%20Percentages%20en%20indexcijfers%20%E2%80%93%20wiskundevaardigheden\.html/i, `${label}: percentage practice route link is missing`));

  if (errors.length) {
    const error = new Error(errors.join('\n'));
    error.errors = errors;
    throw error;
  }

  return {
    ok: true,
    checks: {
      old_mount_absent: true,
      old_css_absent: true,
      old_ui_absent: true,
      golden_assets_present: true,
      mixed_classes_absent: true,
      golden_root_present: true,
      graph_values_present: true,
      routing_present: true
    }
  };
}

function parseArgs(argv) {
  const args = {
    bookRoot: DEFAULT_BOOK_ROOT,
    fixture: null,
    expectFail: false
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--book-root') {
      args.bookRoot = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--fixture') {
      args.fixture = path.resolve(argv[i + 1]);
      i += 1;
    } else if (arg === '--expect-fail') {
      args.expectFail = true;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetFile = args.fixture || findGeneratedExitPage(args.bookRoot);
  const html = read(targetFile);
  try {
    const result = checkHtml(html, { label: normalizePathForReport(targetFile) });
    if (args.expectFail) {
      console.error('Expected boundary checker to fail, but it passed.');
      process.exit(1);
    }
    console.log(JSON.stringify({
      ok: true,
      checked: normalizePathForReport(targetFile),
      result
    }, null, 2));
  } catch (error) {
    if (args.expectFail) {
      console.log(JSON.stringify({
        ok: true,
        expected_failure: true,
        checked: normalizePathForReport(targetFile),
        errors: error.errors || [error.message]
      }, null, 2));
      return;
    }
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkHtml,
  findGeneratedExitPage,
  mixedGoldenLegacyClassAttrs,
  parseArgs
};
