#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');

function fail(message) {
  console.error(`check-gate-check-surface-excellent1-review-packet: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function read(relPath) {
  const file = abs(relPath);
  assert(fs.existsSync(file), `missing required file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function requireText(content, pattern, label, file) {
  if (typeof pattern === 'string') {
    assert(content.includes(pattern), `${file} missing ${label}`);
    return;
  }
  assert(pattern.test(content), `${file} missing ${label}`);
}

function rejectText(content, pattern, label, file) {
  assert(!pattern.test(content), `${file} contains forbidden ${label}`);
}

function requireNoPrematureReviewArtifacts() {
  for (const name of [
    'direct-review-comments.md',
    'direct-review-comments.json',
    'comment-resolution-log.md',
    'comment-resolution-log.json',
    'closure-proposal.md',
    'closure-proposal.json',
    'gate-closure.md',
    'gate-closure.json',
  ]) {
    assert(!fs.existsSync(path.join(GATE_DIR, name)), `${name} must not exist before human comments`);
  }
}

function requireEvidenceFiles(packet) {
  for (const relPath of packet.evidence_base) {
    assert(fs.existsSync(abs(relPath)), `packet evidence missing: ${relPath}`);
  }
}

function requirePacketText() {
  const file = `reports/review-gates/${GATE_ID}/review-packet.md`;
  const text = read(file);
  for (const section of [
    '## Review Scope',
    '## What Changed Since The Superseded Packet',
    '## Evidence Base',
    '## Minimum Playable Evidence Inspection',
    '## Calibration Checks',
    '## Planned Review Focus',
    '## Full Planned Review Comment Prompts',
    '## Direct Review Comment Protocol',
    '## Current Stop Conditions',
    '## Comment Resolution And Closure Protocol',
    '## Recommended Next Action',
  ]) {
    requireText(text, section, section, file);
  }
  for (let i = 1; i <= 12; i += 1) {
    requireText(text, `CHECKSURFACE-Q${i}`, `CHECKSURFACE-Q${i}`, file);
  }
  for (const phrase of [
    'superseded',
    'Shared Task And Check-Surface Integrity Policy',
    'checksurface-policy-regression1-proof.json',
    'smoothie',
    'procedure/flowchart context',
    'interval-halving task includes plausible incorrect intervals',
    'reviewed `1.1.2` exit ticket remains',
    'does not authorize product-route adoption',
    'explicit human confirmation',
  ]) {
    requireText(text, phrase, `phrase ${phrase}`, file);
  }
  rejectText(text, /gate closes|gate is closed|Scale Gate 1 authorized|student\/product use is authorized/i, 'premature closure or authority', file);
}

function requirePacketJson(packet, live) {
  assert(packet.gate_id === GATE_ID, 'packet gate id mismatch');
  assert(live.gate_id === GATE_ID, 'live evidence gate id mismatch');
  assert(packet.status === 'renewed_review_packet_ready_not_reviewed_not_closed', 'packet status mismatch');
  assert(packet.supersedes === 'GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review', 'packet must supersede old retry packet');
  assert(packet.human_review_comments_started === false, 'human review comments must not be started');
  assert(packet.human_review_decision === null, 'human review decision must be null');
  assert(packet.gate_closure_authorized === false, 'gate closure must not be authorized');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  for (const source of [
    'source-data/book-1/exit-ticket/1.1.1-korte-check.json',
    'source-data/book-1/exit-ticket/1.1.1-exit-ticket.json',
    'source-data/book-1/exit-ticket/1.1.2-korte-check.json',
    'source-data/book-1/exit-ticket/1.1.2-exit-ticket.json',
    'source-data/book-1/exit-ticket/1.1.3-korte-check.json',
    'source-data/book-1/exit-ticket/1.1.3-exit-ticket.json',
  ]) {
    assert(packet.evidence_base.includes(source), `packet evidence base missing ${source}`);
  }
  for (let i = 1; i <= 12; i += 1) {
    assert(packet.required_review_prompts.includes(`CHECKSURFACE-Q${i}`), `packet missing prompt CHECKSURFACE-Q${i}`);
  }
  for (const decision of [
    'pass_with_flags',
    'pass_with_conditions',
    'hold_for_surface_repair',
    'hold_for_authority_repair',
    'pause_for_roadmap_correction',
    'fail',
  ]) {
    assert(packet.required_decisions.includes(decision), `packet missing decision ${decision}`);
  }
  assert(live.status === 'renewed_packet_ready_not_reviewed_not_closed', 'live status mismatch');
}

function requireAuthority(packet, live) {
  for (const [key, value] of Object.entries(packet.authority_boundary)) {
    if (key === 'generated_lesson_output_already_deployed_as_evidence') {
      assert(value === true, `${key} must be true`);
    } else {
      assert(value === false, `${key} must be false`);
    }
  }
  for (const [key, value] of Object.entries(live.authority)) {
    assert(value === false, `live authority ${key} must be false`);
  }
}

function requireUnderlyingProofs(packet, live) {
  const policy = readJson('reports/json/checksurface-policy-regression1-proof.json');
  const audit = readJson('reports/json/checksurface-excellence-audit-3p-proof.json');
  const checkShortExit = readJson('reports/json/check-short-exit2-proof.json');
  const graphCheck = readJson('reports/json/graph-check-ux1-proof.json');
  const graphExit = readJson('reports/json/graph-exit-ux1-proof.json');
  const visual = readJson('reports/json/visual-qa-harden2-proof.json');

  assert(policy.status === 'passed', 'policy proof must pass');
  assert(policy.negative_fixtures.every((item) => item.caught === true), 'all negative fixtures must be caught');
  assert(audit.status === 'passed_for_renewed_packet_preparation', 'audit proof status mismatch');
  assert(audit.quality.all_six_surfaces_named === true, 'audit must name all six surfaces');
  assert(audit.quality.short_exit_independence_checked === true, 'audit must check independence');
  const surfaces = checkShortExit.proof && checkShortExit.proof.surfaces;
  assert(surfaces && Object.keys(surfaces).length === 6, 'check-short-exit2 proof must record all six surfaces');
  for (const key of ['1.1.1-short', '1.1.1-exit', '1.1.2-short', '1.1.2-exit', '1.1.3-short', '1.1.3-exit']) {
    assert(surfaces[key] && surfaces[key].generated_page_exists === true, `check-short-exit2 proof missing generated surface ${key}`);
  }
  assert(checkShortExit.proof.all_landing_pages_show_two_check_cards === true, 'landing pages must show both check cards');
  assert(surfaces['1.1.3-short'].task_families.includes('graph_construction_substitute'), '1.1.3 short proof must include graph construction');
  assert(surfaces['1.1.3-exit'].interval_halving_check === true, '1.1.3 exit proof must include interval halving');
  assert(graphCheck.proof.graph_workspace_present === true, 'graph short check workspace must exist');
  assert(graphCheck.proof.choice_only === false, 'graph short check must not be choice-only');
  assert(graphExit.proof.source_task_workspace_present === true, 'graph exit source/task workspace must exist');
  assert(graphExit.proof.correct_path_draws_line === true, 'graph exit must draw line');
  assert(graphExit.proof.completion_language_held === true, '1.1.3 completion language must stay held');
  for (const id of ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5']) {
    assert(visual.reset_findings_addressed.some((item) => item.id === id && item.status === 'guarded'), `${id} must remain guarded`);
  }
  for (const key of [
    'policy_regression_passed',
    'audit_matrix_complete',
    'short_graph_table_action',
    'exit_source_task_workspace',
    'exit_procedure_context_removed',
    'axis_labels_delayed',
    'interval_distractors_present',
    'new_exit_completion_language_held',
    'reviewed_112_exit_preserved',
  ]) {
    assert(packet.proof_summary[key] === true, `packet proof summary missing ${key}`);
    assert(live.proof[key] === true, `live proof missing ${key}`);
  }
}

function requireSourceData() {
  const data113Short = readJson('source-data/book-1/exit-ticket/1.1.3-korte-check.json');
  const data113Exit = readJson('source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');
  const data112Exit = readJson('source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
  assert(data113Short.surface === 'advisory_short_check', '1.1.3 short check must be advisory');
  assert(data113Short.contextBlocks.some((block) => block.id === 'ctx-smoothie-short-table'), '1.1.3 short must use smoothie context');
  assert(data113Short.tasks.some((task) => task.taskShell && task.taskShell.interaction.hideAxisLabelsUntilAxisSelection === true), '1.1.3 short must delay axis labels');
  assert(data113Exit.contextBlocks.length === 3, '1.1.3 exit must have source, table, formula context only');
  assert(!data113Exit.contextBlocks.some((block) => /procedure|flowchart/i.test(JSON.stringify(block))), '1.1.3 exit must not include procedure context');
  assert(data113Exit.tasks.some((task) => task.taskShell && task.taskShell.interaction.hideAxisLabelsUntilAxisSelection === true), '1.1.3 exit must delay axis labels');
  const interval = data113Exit.tasks.map((task) => task.taskShell).find((task) => task && task.interaction.selectionMode === 'interval_halving_check');
  assert(interval, '1.1.3 exit must include interval-halving task');
  assert(interval.interaction.intervalOptions.some((option) => option.correct === false), 'interval task must include distractor intervals');
  assert(interval.interaction.conclusionOptions.some((option) => option.correct === false), 'interval task must include distractor conclusions');
  assert(data113Exit.targetEquivalent.completionLanguageEligible === false, '1.1.3 completion language must remain held');
  assert(data112Exit.targetEquivalent.completionLanguageEligible === true, '1.1.2 reviewed completion authority must remain true');
}

function findParagraphDir(paragraphId) {
  const chapterRoot = path.join(LESSON_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');
  const entry = fs.readdirSync(chapterRoot, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith(`${paragraphId} `));
  assert(entry, `missing generated paragraph directory ${paragraphId}`);
  return path.join(chapterRoot, entry.name);
}

function requireGeneratedOutput() {
  for (const paragraphId of ['1.1.1', '1.1.2', '1.1.3']) {
    const dir = findParagraphDir(paragraphId);
    const landing = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    requireText(landing, /data-check-route="advisory"/, `${paragraphId} advisory card`, `${paragraphId}/index.html`);
    requireText(landing, /data-check-route="exit-ticket"/, `${paragraphId} exit card`, `${paragraphId}/index.html`);
  }
  const shared113Short = fs.readFileSync(path.join(LESSON_ROOT, 'shared', 'exit-ticket', '1.1.3-korte-check.js'), 'utf8');
  const shared113Exit = fs.readFileSync(path.join(LESSON_ROOT, 'shared', 'exit-ticket', '1.1.3-exit-ticket.js'), 'utf8');
  requireText(shared113Short, 'ctx-smoothie-short-table', 'deployed smoothie short context', 'shared/exit-ticket/1.1.3-korte-check.js');
  requireText(shared113Exit, 'source_task_workspace', 'deployed source/task workspace', 'shared/exit-ticket/1.1.3-exit-ticket.js');
}

function requireScreenshots(live) {
  for (const relPath of live.screenshots) {
    assert(fs.existsSync(abs(relPath)), `missing screenshot ${relPath}`);
  }
}

function requireReviewLab() {
  const file = `reports/review-gates/${GATE_ID}/review-lab.html`;
  const html = read(file);
  for (const phrase of [
    'Superseded Packet',
    'Policy regression proof',
    'Six-surface audit matrix',
    'Initial smoothie graph/table short check',
    'Line in active workspace',
  ]) {
    requireText(html, phrase, `lab phrase ${phrase}`, file);
  }
}

function requireBundleUrls() {
  const bundle = path.join(GATE_DIR, 'bundle-urls.md');
  assert(fs.existsSync(bundle), 'bundle-urls.md must exist for remote review');
  const text = fs.readFileSync(bundle, 'utf8');
  for (const name of ['review-packet.md', 'review-packet.json', 'live-output-evidence.md', 'live-output-evidence.json', 'review-lab.html']) {
    requireText(text, name, `bundle URL for ${name}`, 'bundle-urls.md');
  }
}

function main() {
  assert(fs.existsSync(GATE_DIR), `missing gate dir ${GATE_DIR}`);
  const packet = readJson(`reports/review-gates/${GATE_ID}/review-packet.json`);
  const live = readJson(`reports/review-gates/${GATE_ID}/live-output-evidence.json`);
  requireNoPrematureReviewArtifacts();
  requireEvidenceFiles(packet);
  requirePacketText();
  requirePacketJson(packet, live);
  requireAuthority(packet, live);
  requireUnderlyingProofs(packet, live);
  requireSourceData();
  requireGeneratedOutput();
  requireScreenshots(live);
  requireReviewLab();
  requireBundleUrls();
  console.log('GATE-CHECK-SURFACE-EXCELLENT-1 packet check passed');
}

main();
