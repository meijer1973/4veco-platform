#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ReasoningComposer = require('../../engines/reasoning-composer');
const {
  exemplarCompositions,
  blindTransfer,
  allCompositions
} = require('./reasoning-golden-family-data');

const ROOT = path.resolve(__dirname, '..', '..');
const LIBRARY_COMPOSITIONS = path.join(ROOT, 'references', 'exemplars', 'product-excellence', 'reasoning-games', 'compositions');
const REPORT_DIR = path.join(ROOT, 'reports', 'reasoning-golden-family');
const GENERATED_DIR = path.join(REPORT_DIR, 'generated');
const BLIND_DIR = path.join(REPORT_DIR, 'blind-transfer');
const JSON_DIR = path.join(ROOT, 'reports', 'json');

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function pageName(composition) {
  return `${composition.composition_id}.html`;
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeCompositionJson() {
  fs.mkdirSync(LIBRARY_COMPOSITIONS, { recursive: true });
  exemplarCompositions.forEach((composition) => {
    writeFile(path.join(LIBRARY_COMPOSITIONS, `${composition.composition_id}.json`), jsonText(composition));
  });
  writeFile(path.join(BLIND_DIR, `${blindTransfer.composition_id}.json`), jsonText(blindTransfer));
}

function writePages() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  allCompositions.forEach((composition) => {
    const html = ReasoningComposer.renderCompositionPage(composition);
    writeFile(path.join(GENERATED_DIR, pageName(composition)), html);
  });
}

function galleryHtml() {
  const cards = allCompositions.map((composition) => {
    const isBlind = composition.composition_id === blindTransfer.composition_id;
    return [
      '<article class="rg-gallery-item">',
      `<div class="rg-gallery-meta"><span>${isBlind ? 'Blind transfer' : 'Golden exemplar'}</span><span>${composition.archetype_id}</span></div>`,
      `<h2>${escapeHtml(composition.title)}</h2>`,
      `<p>${escapeHtml(composition.goal)}</p>`,
      `<p><strong>Reasoning target:</strong> ${escapeHtml(composition.targetBrief.reasoningTarget)}</p>`,
      `<p><strong>Selected exemplar:</strong> ${escapeHtml(composition.selected_exemplar_ids.join(', '))}</p>`,
      `<a class="rg-gallery-link" href="generated/${pageName(composition)}">Open rendered game</a>`,
      '</article>'
    ].join('\n');
  }).join('\n');
  return '<!doctype html>\n' +
    '<html lang="nl">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>Reasoning Golden Family Gallery</title>\n' +
    '<link rel="stylesheet" href="../../engines/task-shell.css">\n' +
    '<link rel="stylesheet" href="reasoning-composer-gallery.css">\n' +
    '</head>\n' +
    '<body>\n' +
    '<main class="rg-page rg-gallery">\n' +
    '<header>\n' +
    '<p class="ts-eyebrow">GOAL-REASONING-GOLDEN-FAMILY-1</p>\n' +
    '<h1>Reasoning Golden Family Gallery</h1>\n' +
    '<p>Rendered composer pages for the four golden exemplars plus one blind transfer. These are proof artifacts, not product rollout approval.</p>\n' +
    '</header>\n' +
    '<section class="rg-gallery-grid">\n' +
    cards +
    '\n</section>\n' +
    '</main>\n' +
    '</body>\n' +
    '</html>\n';
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildProof() {
  const proof = {
    schema_version: 1,
    goal: 'GOAL-REASONING-GOLDEN-FAMILY-1',
    generated: '2026-06-23',
    rule: 'copy product grammar; re-derive reasoning grammar',
    authority: {
      student_product_adoption: false,
      target_equivalent_proof: false,
      diagnostics: false,
      mastery_or_sequencing: false,
      summative_use: false,
      scale_gate: false
    },
    gallery: 'reports/reasoning-golden-family/gallery.html',
    generated_pages: allCompositions.map((composition) => ({
      composition_id: composition.composition_id,
      archetype_id: composition.archetype_id,
      selected_exemplar_ids: composition.selected_exemplar_ids,
      page: `reports/reasoning-golden-family/generated/${pageName(composition)}`,
      json: composition.composition_id === blindTransfer.composition_id
        ? `reports/reasoning-golden-family/blind-transfer/${composition.composition_id}.json`
        : `references/exemplars/product-excellence/reasoning-games/compositions/${composition.composition_id}.json`,
      proof: ReasoningComposer.buildProof(composition),
      blind_transfer: composition.composition_id === blindTransfer.composition_id ? composition.blindTransfer : undefined
    }))
  };
  const existingProofPath = path.join(JSON_DIR, 'reasoning-golden-family-proof.json');
  const screenshotManifestPath = path.join(REPORT_DIR, 'screenshots', 'manifest.json');
  if (fs.existsSync(existingProofPath) && fs.existsSync(screenshotManifestPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(existingProofPath, 'utf8'));
      if (existing.screenshot_manifest === 'reports/reasoning-golden-family/screenshots/manifest.json' && Array.isArray(existing.screenshot_cases)) {
        proof.screenshot_manifest = existing.screenshot_manifest;
        proof.screenshot_cases = existing.screenshot_cases;
      }
    } catch (_error) {
      // Fresh generation can run before screenshot proof exists.
    }
  }
  return proof;
}

function proofMarkdown(proof) {
  return [
    '# Reasoning Golden Family Gallery Proof',
    '',
    'Generated: 2026-06-23',
    '',
    'Rule: `copy product grammar; re-derive reasoning grammar`.',
    '',
    'These rendered pages are repository proof artifacts. They do not authorize product rollout, diagnostics, mastery, automatic sequencing, summative use, Scale Gate claims, or target-equivalent completion language.',
    '',
    '| Composition | Archetype | Page | JSON |',
    '| --- | --- | --- | --- |',
    ...proof.generated_pages.map((entry) => `| ${entry.composition_id} | ${entry.archetype_id} | \`${entry.page}\` | \`${entry.json}\` |`),
    '',
    'Required screenshot proof is produced by `build-scripts/exemplars/capture-reasoning-golden-family-screenshots.js`.'
  ].join('\n') + '\n';
}

function main() {
  allCompositions.forEach((composition) => ReasoningComposer.validateComposition(composition));
  writeCompositionJson();
  writePages();
  writeFile(path.join(REPORT_DIR, 'gallery.html'), galleryHtml());
  const proof = buildProof();
  writeFile(path.join(JSON_DIR, 'reasoning-golden-family-proof.json'), jsonText(proof));
  writeFile(path.join(REPORT_DIR, 'gallery-proof.md'), proofMarkdown(proof));
  console.log(`Generated ${allCompositions.length} reasoning-game gallery pages in ${rel(GENERATED_DIR)}`);
}

main();
