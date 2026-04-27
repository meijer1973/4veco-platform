#!/usr/bin/env node
/**
 * Apply the R4.5 human-approved micro-unit mutation set.
 *
 * HOW TO ADAPT:
 * - Change only the sprint spec path below for a later reviewed packet.
 * - Keep mutations routed through term-* and unit-* CLIs.
 * - Keep the dry-run dependency phase before applying edges.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPEC_PATH = path.join(REPO_ROOT, 'references/data/sprints/R4.5-approved-mutations.json');
const TERMS_JSON = path.join(REPO_ROOT, 'references/machine/begrippen.json');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const LOG_JSON = path.join(REPO_ROOT, 'reports/review-gates/GATE-R4-micro-unit-quality/R4.5-mutation-log.json');
const LOG_MD = path.join(REPO_ROOT, 'reports/review-gates/GATE-R4-micro-unit-quality/R4.5-mutation-log.md');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadTerms() {
  return readJson(TERMS_JSON).terms || {};
}

function loadUnits() {
  return readJson(UNITS_JSON);
}

function findUnit(id) {
  return loadUnits().find((unit) => unit.id === id);
}

function run(command, args, log, step) {
  const result = spawnSync(process.execPath, [command, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  const entry = {
    step,
    command: ['node', command, ...args].join(' '),
    status: result.status === 0 ? 'passed' : 'failed',
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
  log.commands.push(entry);
  if (result.status !== 0) {
    const err = new Error(`${step} failed`);
    err.entry = entry;
    throw err;
  }
  return entry;
}

function sameArray(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function writeLog(log) {
  fs.mkdirSync(path.dirname(LOG_JSON), { recursive: true });
  fs.writeFileSync(LOG_JSON, JSON.stringify(log, null, 2) + '\n');

  const lines = [
    '# R4.5 Mutation Log',
    '',
    `Generated on: ${log.generated_on}`,
    '',
    `Status: ${log.status}`,
    '',
    '## Summary',
    '',
    `- terms_added: ${log.summary.terms_added}`,
    `- terms_existing: ${log.summary.terms_existing}`,
    `- unit_term_updates_applied: ${log.summary.unit_term_updates_applied}`,
    `- dependency_edges_applied: ${log.summary.dependency_edges_applied}`,
    `- dependency_edges_existing: ${log.summary.dependency_edges_existing}`,
    `- units_added: ${log.summary.units_added}`,
    `- units_existing: ${log.summary.units_existing}`,
    '',
    '## Commands',
    '',
  ];
  for (const command of log.commands) {
    lines.push(`- ${command.status}: \`${command.command}\``);
    if (command.stdout) lines.push(`  - stdout: ${command.stdout}`);
    if (command.stderr) lines.push(`  - stderr: ${command.stderr}`);
  }
  lines.push('', '## Held For Later Review', '');
  for (const item of log.held_for_design_review) lines.push(`- ${item}`);
  fs.writeFileSync(LOG_MD, lines.join('\n') + '\n');
}

function main() {
  const spec = readJson(SPEC_PATH);
  const log = {
    sprint_id: spec.sprint_id,
    generated_on: new Date().toISOString(),
    status: 'running',
    spec_path: path.relative(REPO_ROOT, SPEC_PATH).replace(/\\/g, '/'),
    decision_source: spec.decision_source,
    commands: [],
    applied: {
      terms_added: [],
      unit_term_updates: [],
      dependency_edges: [],
      units_added: [],
    },
    noops: {
      terms_existing: [],
      unit_term_updates_already_current: [],
      dependency_edges_existing: [],
      units_existing: [],
    },
    held_for_design_review: spec.held_for_design_review || [],
    constraints: spec.constraints || [],
    summary: {},
  };

  try {
    for (const term of spec.terms_to_add || []) {
      if (loadTerms()[term.id]) {
        log.noops.terms_existing.push(term.id);
        continue;
      }
      const addSpec = { ...term, related_terms: [] };
      run('build-scripts/references/term-add.js', ['--spec', JSON.stringify(addSpec)], log, `add term ${term.id}`);
      log.applied.terms_added.push(term.id);
    }

    for (const term of spec.terms_to_add || []) {
      if (!Array.isArray(term.related_terms) || term.related_terms.length === 0) continue;
      const current = loadTerms()[term.id];
      if (!current) throw new Error(`term relation patch target not found: ${term.id}`);
      if (sameArray(current.related_terms, term.related_terms)) continue;
      run('build-scripts/references/term-update.js', ['--id', term.id, '--spec', JSON.stringify({ related_terms: term.related_terms })], log, `update related terms ${term.id}`);
    }

    for (const patch of spec.unit_term_updates || []) {
      const unit = findUnit(patch.id);
      if (!unit) throw new Error(`unit term update target not found: ${patch.id}`);
      if (sameArray(unit.terms, patch.terms)) {
        log.noops.unit_term_updates_already_current.push(patch.id);
        continue;
      }
      run('build-scripts/references/unit-update.js', ['--id', patch.id, '--spec', JSON.stringify({ terms: patch.terms })], log, `update terms ${patch.id}`);
      log.applied.unit_term_updates.push({ id: patch.id, terms: patch.terms });
    }

    for (const [from, to] of spec.dependency_edges || []) {
      const unit = findUnit(from);
      if (!unit) throw new Error(`edge source not found: ${from}`);
      if (!findUnit(to)) throw new Error(`edge target not found: ${to}`);
      if ((unit.needs || []).includes(to)) {
        log.noops.dependency_edges_existing.push([from, to]);
        continue;
      }
      run('build-scripts/references/unit-add-dep.js', ['--from', from, '--to', to, '--dry-run'], log, `dry-run edge ${from}->${to}`);
    }

    for (const [from, to] of spec.dependency_edges || []) {
      const unit = findUnit(from);
      if ((unit.needs || []).includes(to)) continue;
      run('build-scripts/references/unit-add-dep.js', ['--from', from, '--to', to], log, `apply edge ${from}->${to}`);
      log.applied.dependency_edges.push([from, to]);
    }

    for (const unitSpec of spec.units_to_add || []) {
      if (findUnit(unitSpec.id)) {
        log.noops.units_existing.push(unitSpec.id);
        continue;
      }
      run('build-scripts/references/unit-add.js', ['--spec', JSON.stringify(unitSpec)], log, `add unit ${unitSpec.id}`);
      log.applied.units_added.push(unitSpec.id);
    }

    run('build-scripts/references/build-unit-index.js', [], log, 'rebuild unit index');
    run('build-scripts/references/build-begrippen-index.js', [], log, 'rebuild begrippen index');

    log.status = 'completed';
  } catch (err) {
    log.status = 'failed';
    log.error = err.message;
    if (err.entry) log.failed_command = err.entry;
    writeLog(finalize(log));
    console.error(err.message);
    process.exit(1);
  }

  writeLog(finalize(log));
  console.log(`OK  R4.5 approved mutations applied (${LOG_JSON})`);
}

function finalize(log) {
  log.generated_on = new Date().toISOString();
  log.summary = {
    terms_added: log.applied.terms_added.length,
    terms_existing: log.noops.terms_existing.length,
    unit_term_updates_applied: log.applied.unit_term_updates.length,
    dependency_edges_applied: log.applied.dependency_edges.length,
    dependency_edges_existing: log.noops.dependency_edges_existing.length,
    units_added: log.applied.units_added.length,
    units_existing: log.noops.units_existing.length,
  };
  return log;
}

if (require.main === module) main();
