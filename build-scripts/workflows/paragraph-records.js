#!/usr/bin/env node
'use strict';
// HOW TO ADAPT: keep human teaching decisions in the plan. These commands only
// project checked source state and an existing independent review.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const authority = require('./check-book-outline-currentness');
const evidence = require('../../scripts/lib/part-a-review-evidence');
const ROOT = path.resolve(__dirname, '../..');

function foundation(folder, action, root = ROOT) {
  const { id } = evidence.identity(folder);
  if (!authority.EXPECTED_ORDER.includes(id)) throw new Error('Foundation projection currently supports registered Book 2 paragraphs only');
  if (!authority.REGISTERED_ACTIONS.includes(action)) throw new Error('Specify a registered --action; authority is action-specific');
  const options = authority.parseCli(['--root', root, '--require-approved', '--action', action, '--paragraph', id]);
  const files = authority.readFiles(root);
  const failures = authority.findBookOutlineFailures(files, options);
  const meta = JSON.parse(authority.asText(files[authority.META_PATH]));
  const chapterPlan = path.join(folder, '..', '_chapter-plan.md');
  const chapterPin = meta.read_only_lesson_evidence.chapter_plans.find(p => p.chapter === id.split('.').slice(0, 2).join('.'));
  const chapterHash = fs.existsSync(chapterPlan) ? authority.sha256CanonicalText(fs.readFileSync(chapterPlan)) : null;
  if (!chapterHash) failures.push('Local _chapter-plan.md is missing');
  return {
    schema_version: 1, paragraph: id, action, require_approved: true,
    decision: failures.length ? 'BLOCKED' : 'PASS', failures,
    lifecycle: {
      current_status: meta.status, owner_approval: meta.owner_approval,
      interpretation: 'Current validated metadata and action holds determine authority. Historical draft/review-ready narrative labels in the approved outline are provenance, not a new permission or veto. Teaching semantics remain in the canonical Markdown.',
    },
    outline: { ...meta.semantic_authority, version: meta.version },
    sources: meta.authority_sources.map(source => ({ ...source,
      actual_sha256: authority.sha256CanonicalText(files[source.path]) })),
    target: meta.target_registry_pins.find(pin => pin.id === id),
    chapter_plan: { path: '../_chapter-plan.md', actual_sha256: chapterHash,
      historical_pin: chapterPin || null, matches_historical_pin: chapterHash === chapterPin?.sha256,
      note: 'Historical audit provenance is not current chapter approval. Author must establish current chapter-plan authority in the pedagogical plan.' },
    holds: meta.holds.map(hold => ({ ...hold,
      scope_matches: authority.holdScopeMatches(hold, options),
      blocks_requested_action: authority.blockingHoldsForAction(meta, options).includes(hold) })),
  };
}

function quality(folder) {
  const review = evidence.checkReview(folder);
  if (!review.ok) throw new Error(review.errors.join('\n'));
  const { id } = evidence.identity(folder);
  const file = path.join(folder, `${id}-quality-ref.yaml`);
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const parsed = yaml.safeLoad(previous) || {};
  if (Object.keys(parsed).length && parsed.schema_version !== 2) throw new Error('Migrate the legacy quality record to schema_version 2 explicitly before projecting Part A');
  if (Object.hasOwn(parsed, 'partA') && !/^partA:/m.test(previous)) throw new Error('Quoted or aliased top-level Part A keys require explicit normalization before projection');
  const manifest = evidence.snapshot(folder);
  const assets = manifest.files.filter(item => item.path.startsWith('_assets/') && /\.(svg|png)$/.test(item.path));
  const names = new Set(assets.map(item => item.path));
  const missing = [...new Set(assets.map(item => item.path.replace(/\.(svg|png)$/, '')).flatMap(base =>
    ['svg', 'png'].map(ext => `${base}.${ext}`).filter(name => !names.has(name))))].sort();
  const compliant = assets.every(item => new RegExp(`^_assets/${id.replace(/\./g, '\\.')}_(fig|ex|we|mc|news)_[A-Za-z0-9]+(?:_(slide|doc|summary|web_light|web_dark))?\\.(svg|png)$`).test(item.path));
  const partA = { ...(parsed.partA || {}), review_file: `${id}-review.md`,
    review_verdict: review.verdict, review_manifest_sha256: review.manifestDigest,
    inventory: manifest.files.map(item => item.path),
    assets: { ...(parsed.partA?.assets || {}), missing, svgpng_paired: missing.length === 0, naming_compliant: compliant } };
  const block = yaml.safeDump({ partA }, { lineWidth: -1, noRefs: true });
  // Replace only this lane's block. Keep companion bytes/comments and all other
  // metadata unchanged, including authored pedagogical quality evidence.
  let output = previous || 'schema_version: 2\n';
  if (/^partA:/m.test(output)) output = output.replace(/^partA:[^\n]*(?:\n(?!(?:[^\s#][^\n]*:))[^\n]*)*/m, block.trimEnd());
  else output = `${output.trimEnd()}\n${block}`;
  // Anchors may cross lane boundaries. Reject a projection that would break an
  // alias or alter another top-level value, before touching the existing file.
  const candidate = yaml.safeLoad(output);
  for (const key of Object.keys(parsed).filter(key => key !== 'partA')) {
    if (JSON.stringify(candidate[key]) !== JSON.stringify(parsed[key])) throw new Error(`Projection would change ${key}; normalize YAML anchors explicitly first`);
  }
  if (JSON.stringify(candidate.partA) !== JSON.stringify(partA)) throw new Error('Part A projection did not round-trip through YAML');
  fs.writeFileSync(file, `${output.trimEnd()}\n`);
  return partA;
}

function main(argv) {
  const [command, folderArg, ...rest] = argv;
  if (!folderArg || !['snapshot', 'quality', 'foundation'].includes(command)) throw new Error('Usage: node build-scripts/workflows/paragraph-records.js snapshot|quality|foundation <paragraph-folder> [--action ACTION]');
  const folder = path.resolve(folderArg);
  if (command === 'snapshot') {
    if (rest.length) throw new Error('Unexpected snapshot arguments');
    console.log(`Review manifest SHA256: \`${evidence.writeSnapshot(folder)}\``);
    console.log('Snapshot only; the independent reviewer must bind this digest after reviewing its files.');
  } else if (command === 'quality') {
    if (rest.length) throw new Error('Unexpected quality arguments');
    console.log(JSON.stringify(quality(folder), null, 2));
  } else {
    if (rest.length !== 2 || rest[0] !== '--action') throw new Error('Foundation requires --action ACTION');
    const record = foundation(folder, rest[1]);
    fs.writeFileSync(path.join(folder, `${record.paragraph}-textbook-foundation.json`), `${JSON.stringify(record, null, 2)}\n`);
    console.log(`Foundation ${record.paragraph} / ${record.action}: ${record.decision}`);
    console.log(`Saved ${record.paragraph}-textbook-foundation.json (pins, inventory and scoped holds).`);
    for (const failure of record.failures) console.error(`- ${failure}`);
    return record.decision === 'PASS' ? 0 : 1;
  }
  return 0;
}
module.exports = { foundation, quality, main };
if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
