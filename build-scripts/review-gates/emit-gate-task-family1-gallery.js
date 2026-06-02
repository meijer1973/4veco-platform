#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = path.join(
  ROOT,
  'reports',
  'review-gates',
  'GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review'
);
const OUT = path.join(GATE_DIR, 'gate-rendered-family-gallery.html');
const OUT_CONSTRUCTION = path.join(GATE_DIR, 'gate-rendered-construction-gallery.html');
const OUT_FEEDBACK = path.join(GATE_DIR, 'gate-rendered-feedback-gallery.html');
const OUT_DARK = path.join(GATE_DIR, 'gate-rendered-dark-gallery.html');
const OUT_MOBILE = path.join(GATE_DIR, 'gate-rendered-mobile-gallery.html');
const OUT_CONSTRUCTION_DETAIL = path.join(GATE_DIR, 'gate-rendered-construction-detail-gallery.html');
const OUT_FEEDBACK_DETAIL = path.join(GATE_DIR, 'gate-rendered-feedback-detail-gallery.html');
const OUT_MOBILE_CONTROLS = path.join(GATE_DIR, 'gate-rendered-mobile-controls-gallery.html');

const FIXTURES = [
  {
    group: 'Structured choice families',
    family: 'cloze_text',
    title: 'Typed inline blanks',
    note: 'Bounded typed blanks for index, source-label, or reasoning statements.',
    file: 'reports/sprints/TASK-FAMILY-CLOZE-1-rendered-fixture.html'
  },
  {
    group: 'Structured choice families',
    family: 'multi_select',
    title: 'Complete-set selection',
    note: 'Select all required options without turning richer operations into simple choice.',
    file: 'reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html'
  },
  {
    group: 'Structured choice families',
    family: 'step_ordering',
    title: 'Procedure ordering',
    note: 'Shows procedure control and cannot replace final calculation or constructed response.',
    file: 'reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html'
  },
  {
    group: 'Structured choice families',
    family: 'matching_pairs',
    title: 'One-to-one matching',
    note: 'Concept/source/formula matching with many-to-one matching deferred.',
    file: 'reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html'
  },
  {
    group: 'Structured choice families',
    family: 'two_tier_choice',
    title: 'Answer plus reason',
    note: 'Separates answer recognition from reason choice without diagnostic profiling.',
    file: 'reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html'
  },
  {
    group: 'Structured choice families',
    family: 'assertion_reason',
    title: 'Assertion and reason relation',
    note: 'Sparse reviewed relation judgement, not generic quiz variety.',
    file: 'reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html'
  },
  {
    group: 'Constrained construction families',
    family: 'cloze_tile_select',
    title: 'Tile-select cloze',
    note: 'Inline blanks filled from a controlled tile bank.',
    file: 'reports/sprints/TASK-FAMILY-CLOZE-TILE-1-rendered-fixture.html'
  },
  {
    group: 'Constrained construction families',
    family: 'sentence_builder',
    title: 'Sentence builder',
    note: 'Build reasoning sentence or causal chain from fragments.',
    file: 'reports/sprints/TASK-FAMILY-SENTENCE-1-rendered-fixture.html'
  },
  {
    group: 'Constrained construction families',
    family: 'formula_builder',
    title: 'Formula builder',
    note: 'Build formulas from reviewed blocks before separate calculation work.',
    file: 'reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html'
  },
  {
    group: 'Constrained construction families',
    family: 'source_value_selection / source_chain_builder',
    title: 'Source value and chain builder',
    note: 'Choose values, roles, and source-to-answer chain elements.',
    file: 'reports/sprints/TASK-FAMILY-SOURCE-1-rendered-fixture.html'
  },
  {
    group: 'Constrained construction families',
    family: 'label_placement',
    title: 'Label placement',
    note: 'Place graph/formula/source labels on visible targets.',
    file: 'reports/sprints/TASK-FAMILY-LABEL-1-rendered-fixture.html'
  }
];

function fail(message) {
  console.error(`GATE-TASK-FAMILY-1 gallery emit failed: ${message}`);
  process.exit(1);
}

function read(relativePath) {
  const file = path.join(ROOT, relativePath);
  if (!fs.existsSync(file)) fail(`missing fixture: ${relativePath}`);
  return fs.readFileSync(file, 'utf8');
}

function extractBody(html, relativePath) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (match) return match[1].trim();
  if (/<article|<section|<main|<div/i.test(html)) return html.trim();
  fail(`fixture has no body or rendered fragment: ${relativePath}`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function card(item) {
  const html = extractBody(read(item.file), item.file);
  return `
    <article class="family-card" data-family="${escapeHtml(item.family)}">
      <header class="family-head">
        <p class="family-id">${escapeHtml(item.family)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.note)}</p>
        <a href="../../sprints/${escapeHtml(path.basename(item.file))}">Open validated fixture</a>
      </header>
      <div class="embedded-fixture">
        ${html}
      </div>
    </article>`;
}

const groups = {};
FIXTURES.forEach((item) => {
  if (!groups[item.group]) groups[item.group] = [];
  groups[item.group].push(item);
});

const sections = Object.entries(groups).map(([group, items]) => `
  <section id="${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
    <h2>${escapeHtml(group)}</h2>
    <div class="grid">
      ${items.map(card).join('\n')}
    </div>
  </section>
`).join('\n');

function page({ title, bodyAttrs = '', intro, body }) {
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GATE-TASK-FAMILY-1 rendered task-family proof</title>
  <link rel="stylesheet" href="../../../engines/task-shell.css">
  <style>
    :root {
      color-scheme: light;
      --gate-bg: #f5f7fa;
      --gate-panel: #ffffff;
      --gate-text: #172033;
      --gate-muted: #59677a;
      --gate-line: #d7e0ea;
      --gate-accent: #176c67;
      --gate-warn: #9f5a1b;
    }
    [data-theme="dark"] {
      color-scheme: dark;
      --gate-bg: #0f1722;
      --gate-panel: #182333;
      --gate-text: #edf4fb;
      --gate-muted: #b7c4d2;
      --gate-line: #31445a;
      --gate-accent: #65c7bb;
      --gate-warn: #f0a765;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--gate-bg);
      color: var(--gate-text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 44px;
    }
    .gate-hero, .gate-section, section {
      background: var(--gate-panel);
      border: 1px solid var(--gate-line);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 18px;
      box-shadow: 0 12px 30px rgba(16, 24, 40, 0.08);
    }
    h1, h2, h3 { margin: 0; letter-spacing: 0; }
    h1 {
      font-size: clamp(1.7rem, 4vw, 2.4rem);
      line-height: 1.08;
      overflow-wrap: anywhere;
    }
    h2 { font-size: clamp(1.2rem, 3vw, 1.55rem); }
    h3 { font-size: 1rem; }
    p { color: var(--gate-muted); }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      padding: 6px 10px;
      border: 1px solid var(--gate-line);
      border-radius: 999px;
      color: var(--gate-muted);
      font-weight: 700;
      font-size: 0.9rem;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .warning {
      border-left: 4px solid var(--gate-warn);
      padding: 12px 14px;
      background: color-mix(in srgb, var(--gate-warn) 10%, var(--gate-panel));
      color: var(--gate-text);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .family-card {
      overflow: hidden;
      border: 1px solid var(--gate-line);
      border-radius: 8px;
      background: var(--gate-bg);
    }
    .family-head {
      padding: 14px;
      border-bottom: 1px solid var(--gate-line);
      background: var(--gate-panel);
    }
    .family-head p { margin: 5px 0 0; }
    .family-id {
      margin: 0;
      color: var(--gate-accent);
      font-weight: 800;
      font-size: 0.82rem;
    }
    .family-head a {
      display: inline-flex;
      margin-top: 8px;
      color: var(--gate-accent);
      font-weight: 800;
    }
    .embedded-fixture {
      max-height: 560px;
      overflow: auto;
      padding: 12px;
      background: var(--gate-bg);
    }
    .embedded-fixture .fixture-shell,
    .embedded-fixture .ts-shell,
    .embedded-fixture main {
      width: 100%;
      margin: 0;
      padding: 0;
    }
    .embedded-fixture section {
      box-shadow: none;
      margin: 0 0 12px;
    }
    .focus-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
      padding: 0;
      list-style: none;
    }
    .focus-list li {
      border: 1px solid var(--gate-line);
      border-radius: 8px;
      padding: 10px;
      color: var(--gate-muted);
      background: var(--gate-bg);
    }
    @media (max-width: 720px) {
      main { width: min(680px, calc(100% - 18px)); padding-top: 14px; }
      .gate-hero, .gate-section, section { padding: 14px; }
      .grid, .focus-list { grid-template-columns: 1fr; }
      .embedded-fixture { max-height: 620px; }
    }
    [data-mobile-proof] main {
      width: min(360px, calc(100% - 16px));
      padding-top: 12px;
    }
    [data-mobile-proof] .gate-hero,
    [data-mobile-proof] .gate-section,
    [data-mobile-proof] section {
      padding: 12px;
    }
    [data-mobile-proof] .grid,
    [data-mobile-proof] .focus-list {
      grid-template-columns: 1fr;
    }
    [data-mobile-proof] h1 {
      font-size: 1.35rem;
    }
    [data-mobile-proof] .meta {
      display: grid;
      grid-template-columns: 1fr;
    }
    [data-mobile-proof] .embedded-fixture {
      max-height: 620px;
    }
    [data-controls-proof] #review-boundary,
    [data-feedback-proof] #review-boundary {
      display: none;
    }
    [data-controls-proof] .gate-hero {
      margin-bottom: 10px;
    }
    [data-controls-proof] .family-head p,
    [data-controls-proof] .family-head a {
      display: none;
    }
    [data-feedback-proof] .embedded-fixture .ts-task > *:not(.ts-feedback),
    [data-feedback-proof] .embedded-fixture .ts-task > .ts-feedback:empty {
      display: none;
    }
    [data-feedback-proof] .family-head p,
    [data-feedback-proof] .family-head a,
    [data-feedback-proof] .embedded-fixture .ts-shell-head,
    [data-feedback-proof] .embedded-fixture section:not(:has(.ts-feedback-card)),
    [data-feedback-proof] .embedded-fixture .ts-task:not(:has(.ts-feedback-card)) {
      display: none;
    }
    [data-feedback-proof] .embedded-fixture {
      max-height: 700px;
    }
    [data-feedback-proof] .embedded-fixture .ts-feedback {
      margin-top: 0;
    }
    [data-feedback-proof] .embedded-fixture .ts-feedback:empty::before {
      content: "No rendered feedback card in this fixture state.";
      display: block;
      color: var(--gate-muted);
      padding: 10px;
    }
  </style>
</head>
<body${bodyAttrs}>
  <main>
    <header class="gate-hero">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(intro)}</p>
      <div class="meta">
        <span class="pill">review-only</span>
        <span class="pill">no generated lesson output</span>
        <span class="pill">no product authority</span>
        <span class="pill">target-proof boundary held</span>
      </div>
    </header>

    <section id="review-boundary" class="gate-section">
      <h2>Review boundary</h2>
      <p class="warning">These families may support later practice or check designs only after separate bounded adoption planning. They do not by themselves prove target-equivalent readiness, diagnostics, mastery, sequencing, summative status, or Scale Gate 1 readiness.</p>
    </section>

    ${body}

    <section id="focus-proof" class="gate-section">
      <h2>Focus and keyboard proof to review</h2>
      <p>The checker requires focus-plan coverage for the task families below. The human reviewer should still inspect whether the visible controls make keyboard order understandable.</p>
      <ul class="focus-list">
        <li>tiles/blanks for cloze tile selection</li>
        <li>tokens and sequence regions for sentence/formula/step/source-chain builders</li>
        <li>left/right controls and pair summary for matching pairs</li>
        <li>answer/reason controls and summary for two-tier choice</li>
        <li>assertion relation controls and summary</li>
        <li>label bank, visual targets, and placement summary</li>
      </ul>
    </section>

    <section id="dark-surface" class="gate-section" data-theme="dark">
      <h2>Dark-mode review surface</h2>
      <p>This section uses the gate fixture dark-mode variables. Inspect alongside the embedded source fixture, which carries a dark/narrow state from the implementation sprint.</p>
      <p class="warning">Dark mode must remain readable, but this gate still does not authorize product-route adoption.</p>
    </section>
  </main>
</body>
</html>
`;
}

const output = page({
  title: 'GATE-TASK-FAMILY-1 rendered proof',
  intro: 'This reviewer fixture embeds rendered artifacts from the closed task-family implementation sprints. It is evidence for human review only; it does not adopt these families in generated lessons or product routes.',
  body: sections
});

const constructionSection = `
  <section id="constrained-construction-families">
    <h2>Constrained construction families</h2>
    <div class="grid">
      ${groups['Constrained construction families'].map(card).join('\n')}
    </div>
  </section>`;

const constructionDetailSection = `
  <section id="construction-detail">
    <h2>Formula, source, and label construction details</h2>
    <div class="grid">
      ${FIXTURES.filter((item) => /formula_builder|source|label_placement/.test(item.family)).map(card).join('\n')}
    </div>
  </section>`;

const feedbackSection = `
  <section id="feedback-states">
    <h2>Feedback-state inspection</h2>
    <p>These rendered fixtures include after-click or retry/self-check states where the implementation sprint supplied them. Feedback remains neutral practice feedback only.</p>
    <div class="grid">
      ${FIXTURES.filter((item) => /source|assertion|multi_select|step_ordering|two_tier/.test(item.family)).map(card).join('\n')}
    </div>
  </section>`;

const feedbackDetailSection = `
  <section id="feedback-detail">
    <h2>Visible practice-only feedback cards</h2>
    <p>Only the feedback regions are shown in this support page so the human reviewer can inspect the feedback language directly.</p>
    <div class="grid">
      ${FIXTURES.filter((item) => /multi_select|step_ordering|matching_pairs|source|label_placement|assertion_reason/.test(item.family)).map(card).join('\n')}
    </div>
  </section>`;

const darkSection = `
  <section id="dark-surface" class="gate-section" data-theme="dark">
    <h2>Dark-mode review surface</h2>
    <p>This support page uses the gate fixture dark-mode variables and embeds the dark/narrow source fixture plus assertion-reason dark-state evidence.</p>
    <p class="warning">Dark mode must remain readable, but this gate still does not authorize product-route adoption.</p>
    <div class="grid">
      ${FIXTURES.filter((item) => /source|assertion|label_placement/.test(item.family)).map(card).join('\n')}
    </div>
  </section>`;

const mobileControlsSection = `
  <section id="mobile-controls">
    <h2>Narrow viewport with visible controls</h2>
    <div class="grid">
      ${FIXTURES.filter((item) => /cloze_text|cloze_tile_select/.test(item.family)).map(card).join('\n')}
    </div>
  </section>`;

fs.mkdirSync(GATE_DIR, { recursive: true });
fs.writeFileSync(OUT, output, 'utf8');
fs.writeFileSync(OUT_CONSTRUCTION, page({
  title: 'GATE-TASK-FAMILY-1 construction proof',
  intro: 'Construction-family screenshot support page for cloze tile, sentence, formula, source, and label interactions.',
  body: constructionSection
}), 'utf8');
fs.writeFileSync(OUT_CONSTRUCTION_DETAIL, page({
  title: 'GATE-TASK-FAMILY-1 construction detail proof',
  intro: 'Targeted screenshot support page for formula, source, and label construction interactions.',
  body: constructionDetailSection
}), 'utf8');
fs.writeFileSync(OUT_FEEDBACK, page({
  title: 'GATE-TASK-FAMILY-1 feedback proof',
  intro: 'Feedback-state screenshot support page. The evidence must remain practice-only and non-diagnostic.',
  body: feedbackSection
}), 'utf8');
fs.writeFileSync(OUT_FEEDBACK_DETAIL, page({
  title: 'GATE-TASK-FAMILY-1 feedback detail proof',
  intro: 'Targeted screenshot support page showing visible practice-only feedback cards.',
  bodyAttrs: ' data-feedback-proof="true"',
  body: feedbackDetailSection
}), 'utf8');
fs.writeFileSync(OUT_DARK, page({
  title: 'GATE-TASK-FAMILY-1 dark-mode proof',
  intro: 'Dark-mode screenshot support page for the human reviewer.',
  bodyAttrs: ' data-theme="dark"',
  body: darkSection
}), 'utf8');
fs.writeFileSync(OUT_MOBILE, page({
  title: 'GATE-TASK-FAMILY-1 mobile proof',
  intro: 'Forced narrow-layout screenshot support page for the human reviewer.',
  bodyAttrs: ' data-mobile-proof="true"',
  body: sections
}), 'utf8');
fs.writeFileSync(OUT_MOBILE_CONTROLS, page({
  title: 'GATE-TASK-FAMILY-1 mobile controls proof',
  intro: 'Narrow-layout screenshot support page with actual task controls visible.',
  bodyAttrs: ' data-mobile-proof="true" data-controls-proof="true"',
  body: mobileControlsSection
}), 'utf8');
console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_CONSTRUCTION)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_CONSTRUCTION_DETAIL)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_FEEDBACK)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_FEEDBACK_DETAIL)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_DARK)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_MOBILE)}`);
console.log(`Wrote ${path.relative(ROOT, OUT_MOBILE_CONTROLS)}`);
