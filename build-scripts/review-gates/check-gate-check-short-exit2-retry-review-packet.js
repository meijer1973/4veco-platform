#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');

function fail(message) {
  console.error(`check-gate-check-short-exit2-retry-review-packet: ${message}`);
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

function git(args, cwd = ROOT) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function requireEvidenceFiles(packet) {
  for (const relPath of packet.evidence_base) {
    assert(fs.existsSync(abs(relPath)), `packet evidence missing: ${relPath}`);
  }
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
    assert(!fs.existsSync(path.join(GATE_DIR, name)), `${name} must not exist before retry review comments`);
  }
}

function requirePacketText() {
  const file = `reports/review-gates/${GATE_ID}/review-packet.md`;
  const text = read(file);
  for (const section of [
    '## Review Scope',
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
    'REVISE',
    'hold_for_surface_repair',
    'CHECK-SURFACE-PREGATE-1',
    'graph/table task-shell interaction',
    'source/task graph workspace',
    'completion language must remain held',
    'reviewed `1.1.2` local completion-language authority',
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
  assert(packet.status === 'retry_review_packet_ready_not_reviewed_not_closed', 'packet status mismatch');
  assert(packet.human_review_comments_started === false, 'human review comments must not be started');
  assert(packet.human_review_decision === null, 'human review decision must be null');
  assert(packet.gate_closure_authorized === false, 'gate closure must not be authorized');
  assert(packet.prior_review_result.decision === 'REVISE', 'prior review decision must be REVISE');
  assert(packet.prior_review_result.gate_direction === 'hold_for_surface_repair', 'prior gate direction mismatch');
  assert(packet.prior_review_result.additional_direction === 'replan_before_next_human_gate', 'prior additional direction mismatch');
  for (const id of [
    'CHECKSURFACE-Q1',
    'CHECKSURFACE-Q2',
    'CHECKSURFACE-Q3',
    'CHECKSURFACE-Q4',
    'CHECKSURFACE-Q5',
    'CHECKSURFACE-Q6',
    'CHECKSURFACE-Q7',
    'CHECKSURFACE-Q8',
    'CHECKSURFACE-Q9',
    'CHECKSURFACE-Q10',
    'CHECKSURFACE-Q11',
    'CHECKSURFACE-Q12',
  ]) {
    assert(packet.required_review_prompts.includes(id), `packet missing prompt ${id}`);
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
  assert(live.status === 'ready_for_direct_human_review_not_closed', 'live status mismatch');
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

function requireRemoteMetadata(packet, live) {
  const hash = /^[0-9a-f]{40}$/;
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assert(hash.test(packet.remote_publication.reviewed_platform_commit_hash), 'packet platform hash must be 40 hex');
  assert(hash.test(packet.remote_publication.generated_lesson_commit_hash), 'packet lesson hash must be 40 hex');
  assert(live.remote_publication.platform_reviewed_evidence_commit === packet.remote_publication.reviewed_platform_commit_hash, 'live platform hash mismatch');
  assert(live.remote_publication.lesson_commit === packet.remote_publication.generated_lesson_commit_hash, 'live lesson hash mismatch');

  git(['fetch', '--prune', 'origin']);
  const remoteRef = `origin/${packet.remote_publication.reviewed_platform_branch}`;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', packet.remote_publication.reviewed_platform_commit_hash, remoteRef], {
      cwd: ROOT,
      stdio: 'pipe',
    });
  } catch (_error) {
    fail(`reviewed platform hash is not an ancestor of ${remoteRef}`);
  }

  const lessonRemote = git(['ls-remote', 'origin', packet.remote_publication.generated_lesson_branch], path.resolve(ROOT, '..', '4veco-lessen'));
  assert(lessonRemote.includes(packet.remote_publication.generated_lesson_commit_hash), 'lesson reviewed hash not found on remote branch');
}

function requireUnderlyingProofs(packet, live) {
  const pregate = readJson('reports/json/check-surface-pregate1-proof.json');
  const visual = readJson('reports/json/visual-qa-harden2-proof.json');
  const graphCheck = readJson('reports/json/graph-check-ux1-proof.json');
  const graphExit = readJson('reports/json/graph-exit-ux1-proof.json');
  const routeCopy = readJson('reports/json/check-route-copy1-proof.json');

  assert(pregate.status === 'complete', 'pregate proof must be complete');
  assert(pregate.retry_gate_preparation.ready_to_prepare_retry_packet === true, 'pregate must allow retry packet preparation');
  assert(pregate.retry_gate_preparation.human_gate_started === false, 'pregate must not start human gate');
  assert(pregate.retry_gate_preparation.closure_authorized === false, 'pregate must not authorize closure');
  assert(pregate.student_experience_judgement.verdict === 'PASS_WITH_FLAGS', 'pregate student verdict mismatch');

  for (const check of [
    'route_distinction_student_clear',
    'short_graph_table_action',
    'short_feedback_next_action',
    'exit_source_task_workspace',
    'exit_same_workspace_graph_line',
    'mobile_dark_reviewable',
    'reset_findings_guarded',
    'authority_boundary_preserved',
  ]) {
    assert(pregate.checks.some((item) => item.id === check && item.status === 'pass'), `pregate missing passing check ${check}`);
    assert(packet.proof_summary[check] === true || check === 'authority_boundary_preserved', `packet proof summary missing ${check}`);
    assert(live.proof[check] === true || check === 'authority_boundary_preserved', `live proof missing ${check}`);
  }

  for (const id of ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5']) {
    assert(visual.reset_findings_addressed.some((item) => item.id === id && item.status === 'guarded'), `${id} must remain guarded`);
  }

  assert(routeCopy.proof.advisory_and_exit_cards_distinct === true, 'route copy proof must pass');
  assert(graphCheck.proof.graph_workspace_present === true, 'graph short check workspace must exist');
  assert(graphCheck.proof.choice_only === false, 'graph short check must not be choice-only');
  assert(graphCheck.proof.correct_path_reaches_route_advice === true, 'graph short check must reach route advice');
  assert(graphExit.proof.source_task_workspace_present === true, 'graph exit source/task workspace must exist');
  assert(graphExit.proof.task_visible_after_source_scroll === true, 'graph exit task must remain visible after source scroll');
  assert(graphExit.proof.correct_path_draws_line === true, 'graph exit must draw line');
  assert(graphExit.proof.completion_language_held === true, '1.1.3 completion language must stay held');
}

function sourcePath(key) {
  return `source-data/book-1/exit-ticket/${key}.json`;
}

function requireSourceData() {
  const expected = [
    ['1.1.1-korte-check', 'advisory_short_check', false, false],
    ['1.1.1-exit-ticket', 'target_equivalent_exit_ticket', false, false],
    ['1.1.2-korte-check', 'advisory_short_check', false, false],
    ['1.1.2-exit-ticket', 'target_equivalent_exit_ticket', true, true],
    ['1.1.3-korte-check', 'advisory_short_check', false, false],
    ['1.1.3-exit-ticket', 'target_equivalent_exit_ticket', false, false],
  ];
  for (const [key, surface, approved, eligible] of expected) {
    const data = readJson(sourcePath(key));
    assert(data.surface === surface, `${key} surface mismatch`);
    const target = data.targetEquivalent || {};
    assert(Boolean(target.gateApproved) === approved, `${key} gateApproved mismatch`);
    assert(Boolean(target.completionLanguageEligible) === eligible, `${key} completionLanguageEligible mismatch`);
  }
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
    assert(fs.existsSync(path.join(dir, 'index.html')), `${paragraphId} missing landing page`);
    assert(fs.readdirSync(dir).some((file) => file.endsWith('korte-check.html')), `${paragraphId} missing korte-check page`);
    assert(fs.readdirSync(dir).some((file) => file.endsWith('exit-ticket.html')), `${paragraphId} missing exit-ticket page`);
  }
}

function requireReviewLab(live) {
  const file = `reports/review-gates/${GATE_ID}/review-lab.html`;
  const lab = read(file);
  for (const label of [
    '1.1.3 landing route cards',
    'Initial graph/table short check',
    'Targeted retry feedback',
    'Completed route advice',
    'Initial source/task workspace',
    'Source scrolled, task visible',
    'Line in active workspace',
    'Mobile dark completed, completion held',
  ]) {
    requireText(lab, label, `review lab label ${label}`, file);
  }
  for (const screenshot of live.screenshots) {
    assert(fs.existsSync(abs(screenshot)), `missing screenshot ${screenshot}`);
    const name = path.basename(screenshot);
    requireText(lab, name, `review lab screenshot ${name}`, file);
  }
}

function requireBundleUrls() {
  const bundle = path.join(GATE_DIR, 'bundle-urls.md');
  assert(fs.existsSync(bundle), 'bundle-urls.md must exist');
  const text = fs.readFileSync(bundle, 'utf8');
  for (const name of ['review-packet.md', 'review-packet.json', 'live-output-evidence.md', 'live-output-evidence.json', 'review-lab.html']) {
    requireText(text, name, `bundle URL ${name}`, 'bundle-urls.md');
  }
}

function requireRoadmap() {
  const roadmap = read('references/reference-team-roadmap.md');
  requireText(roadmap, 'GATE-CHECK-SHORT-EXIT-2-RETRY', 'retry gate roadmap marker', 'references/reference-team-roadmap.md');
  requireText(roadmap, /direct human review comments/i, 'human review next action', 'references/reference-team-roadmap.md');
}

function main() {
  assert(fs.existsSync(GATE_DIR), `missing gate directory ${GATE_ID}`);
  const packet = readJson(`reports/review-gates/${GATE_ID}/review-packet.json`);
  const live = readJson(`reports/review-gates/${GATE_ID}/live-output-evidence.json`);
  requireEvidenceFiles(packet);
  requireNoPrematureReviewArtifacts();
  requirePacketText();
  requirePacketJson(packet, live);
  requireAuthority(packet, live);
  requireRemoteMetadata(packet, live);
  requireUnderlyingProofs(packet, live);
  requireSourceData();
  requireGeneratedOutput();
  requireReviewLab(live);
  requireBundleUrls();
  requireRoadmap();
  console.log(`OK review packet: ${GATE_ID}`);
}

main();
