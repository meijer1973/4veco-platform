#!/usr/bin/env node
/**
 * build-skill-tree-viewer.js — embed the current micro-teaching-units
 * catalog into the skill-tree viewer HTML.
 *
 * Reads:
 *   tools/skill-tree-viewer/template.html          (sentinel: __UNITS_DATA__)
 *   references/machine/micro-teaching-units.json   (catalog)
 *
 * Writes:
 *   tools/skill-tree-viewer/index.html             (self-contained, openable via file://)
 *
 * Usage:
 *   node build-scripts/tools/build-skill-tree-viewer.js
 *
 * Run this after any catalog mutation that should be reflected in the
 * viewer. The generated index.html is committed so reviewers can open
 * it directly without running anything.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE = path.join(REPO_ROOT, 'tools', 'skill-tree-viewer', 'template.html');
const OUTPUT = path.join(REPO_ROOT, 'tools', 'skill-tree-viewer', 'index.html');
const DATA = path.join(REPO_ROOT, 'references', 'machine', 'micro-teaching-units.json');

const SENTINEL = '__UNITS_DATA__';

function main() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error(`ERROR  missing template: ${TEMPLATE}`);
    process.exit(1);
  }
  if (!fs.existsSync(DATA)) {
    console.error(`ERROR  missing catalog: ${DATA}`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const units = JSON.parse(fs.readFileSync(DATA, 'utf8'));

  if (!template.includes(SENTINEL)) {
    console.error(`ERROR  template missing sentinel "${SENTINEL}" — nothing to replace`);
    process.exit(1);
  }

  // Trim units to only the fields the viewer reads. Keeps the HTML small
  // and avoids leaking fields that aren't part of the public catalog shape.
  const slim = units.map(u => ({
    id: u.id,
    name: u.name,
    category: u.category,
    layer: u.layer,
    kern: u.kern,
    needs: u.needs || [],
    exam_codes: u.exam_codes || [],
    mastery_target: u.mastery_target,
    aspects: u.aspects || [],
    terms: u.terms || [],
    procedure: u.procedure || [],
    pitfalls: u.pitfalls || [],
    deprecated: u.deprecated || false,
    deprecated_in_favor_of: u.deprecated_in_favor_of || [],
  }));

  const dataJson = JSON.stringify(slim);

  // Sentinel may be inside a <script type="application/json">, so we
  // also escape closing script tags as a defensive measure.
  const safeJson = dataJson.replace(/<\/script/gi, '<\\/script');

  const html = template.replace(SENTINEL, safeJson);
  fs.writeFileSync(OUTPUT, html);

  const bytes = Buffer.byteLength(html, 'utf8');
  console.log(`OK  embedded ${slim.length} units → ${path.relative(REPO_ROOT, OUTPUT)} (${(bytes / 1024).toFixed(1)} kB)`);
}

if (require.main === module) main();
