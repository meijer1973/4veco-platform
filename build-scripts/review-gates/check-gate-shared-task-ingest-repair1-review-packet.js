#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review';
const sprintId = 'GATE-SHARED-TASK-INGEST-REPAIR-1';
const repair2Id = 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-2';
const gateDir = path.join(platformRoot, 'reports', 'review-gates', gateId);

function fail(message) {
  console.error(`check-gate-shared-task-ingest-repair1-review-packet: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(relativePath) {
  return path.resolve(platformRoot, relativePath);
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function readText(relativePath) {
  const file = abs(relativePath);
  assert(fs.existsSync(file), `missing ${relativePath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function gitStatus(args) {
  return execFileSync('git', args, { cwd: platformRoot, encoding: 'utf8' }).trim();
}

function runNode(script) {
  try {
    execFileSync(process.execPath, [script], { cwd: platformRoot, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    process.stdout.write(error.stdout || '');
    process.stderr.write(error.stderr || '');
    fail(`validator failed: node ${script}`);
  }
}

function requireRemotePublication(packet, live) {
  const hashPattern = /^[0-9a-f]{40}$/;
  const branchPattern = /^(main|codex\/[A-Za-z0-9._/-]+)$/;
  assert(packet.remote_publication_required_before_review === true, 'packet must require remote publication before review');
  assert(branchPattern.test(packet.remote_publication.reviewed_remote_branch), 'packet must record reviewed remote branch main or codex/*');
  assert(hashPattern.test(packet.remote_publication.reviewed_remote_commit_hash), 'packet must record reviewed remote commit hash');
  assert(packet.remote_publication.review_may_start === true, 'packet must allow review only after remote publication');
  assert(live.remote_publication.reviewed_remote_branch === packet.remote_publication.reviewed_remote_branch, 'live evidence branch mismatch');
  assert(live.remote_publication.reviewed_remote_commit_hash === packet.remote_publication.reviewed_remote_commit_hash, 'live evidence commit hash mismatch');
  assert(live.remote_publication.review_may_start === true, 'live evidence must allow review only after remote publication');
}

function requireNoPrematureClosure() {
  const forbidden = [
    'gate-closure.md',
    'gate-closure.json',
    'closure-proposal.md',
    'closure-proposal.json',
    'human-interview.md',
    'human-interview.json',
  ];
  for (const name of forbidden) {
    const file = path.join(gateDir, name);
    assert(!fs.existsSync(file), `${rel(file)} must not exist before renewed comments and explicit closure confirmation`);
  }
}

function requireAllFalse(object, label) {
  for (const [key, value] of Object.entries(object)) {
    assert(value === false, `${label}.${key} must be false`);
  }
}

function requirePacketText() {
  const text = readText(`reports/review-gates/${gateId}/review-packet.md`);
  const requiredSections = [
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
  ];
  for (const section of requiredSections) assert(text.includes(section), `review packet missing section ${section}`);
  for (let i = 1; i <= 12; i += 1) assert(text.includes(`SHAREDINGEST-Q${i}`), `review packet missing prompt SHAREDINGEST-Q${i}`);
  for (const phrase of [
    'Target-task economy',
    'graph_construction_substitute',
    'prompt block is rendered inside the source pane',
    'completed graph is visible before graph-construction success',
    'direct packet comments',
    'explicit human confirmation',
    'does not authorize generated lesson output',
    'not official exam authority',
  ]) {
    assert(text.includes(phrase), `review packet missing required phrase: ${phrase}`);
  }
}

function requireEvidenceFiles(packet) {
  for (const relativePath of packet.evidence_base) {
    const file = path.resolve(platformRoot, relativePath);
    assert(fs.existsSync(file), `evidence_base path missing: ${relativePath}`);
  }
}

function requireReviewArtifacts(packet) {
  assert(packet.human_review_comments_started === true, 'human review comments must be recorded as started/returned');
  assert(packet.human_review_decision === 'hold_for_playable_repair', 'human review decision must be hold_for_playable_repair');
  assert(packet.gate_closure_authorized === false, 'gate closure must not be authorized');
  assert(packet.required_next_sprint === repair2Id, 'packet must name repair2 as the required repair sprint from renewed review');

  const firstComments = readJson(`reports/review-gates/${gateId}/direct-review-comments.json`);
  const firstResolution = readJson(`reports/review-gates/${gateId}/comment-resolution-log.json`);
  const renewedComments = readJson(`reports/review-gates/${gateId}/renewed-direct-review-comments.json`);
  const renewedResolution = readJson(`reports/review-gates/${gateId}/renewed-comment-resolution-log.json`);
  assert(firstComments.decision === 'hold_for_playable_repair', 'first comments decision must be hold_for_playable_repair');
  assert(firstResolution.gate_closure_authorized === false, 'first resolution must not authorize closure');
  assert(renewedComments.decision === 'hold_for_playable_repair', 'renewed comments decision must be hold_for_playable_repair');
  assert(renewedComments.review_verdict === 'REVISE', 'renewed comments must record REVISE');
  assert(renewedComments.required_next_sprint === repair2Id, 'renewed comments must require repair2');
  assert(renewedResolution.status === 'renewed_revise_accepted_repair2_required' || renewedResolution.status === 'repair2_evidence_prepared_awaiting_renewed_review', 'renewed resolution status must keep gate open');
  assert(renewedResolution.gate_closure_authorized === false, 'renewed resolution must not authorize closure');
}

function requireRepair2Review(packet) {
  const repair = packet.playable_repair_review2;
  assert(repair && repair.required === true, 'repair2 review metadata must be present and required');
  assert(repair.sprint_id === repair2Id, 'repair2 metadata must name repair2 sprint');
  assert(repair.status === 'passed_after_target_task_repair_before_new_human_review', 'repair2 must pass before renewed human review');
  for (const key of ['planning_review', 'lead_assignment', 'lead_round1', 'lead_corrections', 'lead_round2', 'verification', 'visual_qa_report', 'transformation_economy_report']) {
    assert(repair[key], `repair2 metadata missing ${key}`);
    const text = readText(repair[key]);
    assert(text.includes(repair2Id) || text.includes('TASK-INGEST-TRANSFORM'), `${repair[key]} missing repair/task sprint id`);
  }
  const round2 = readText(repair.lead_round2);
  assert(round2.includes('Verdict: PASS') || round2.includes('Verdict: PASS WITH FLAGS'), 'repair2 lead round2 must pass');
  const verification = readText(repair.verification);
  assert(verification.includes('Verdict: PASS'), 'repair2 verification must pass');
}

function requireLiveEvidence(live) {
  assert(live.status.includes('target_task_repair_evidence_ready'), 'live-output evidence wrong status');
  assert(live.playable_labs.actual_exam.task_count === 3, 'live evidence actual exam task count must be 3');
  assert(live.playable_labs.textbook.task_count === 3, 'live evidence textbook task count must be 3');
  assert(live.playable_labs.textbook.playable_lab.graph_construction_controls_rendered === true, 'live evidence missing graph construction controls');
  assert(live.playable_labs.textbook.playable_lab.prompt_not_in_source_pane === true, 'live evidence missing prompt/source guard');
  assert(live.playable_labs.textbook.playable_lab.completed_graph_hidden_before_attempt === true, 'live evidence missing completed graph guard');
  assert(live.playable_labs.textbook.playable_lab.graph_workspace_width_pass === true, 'live evidence missing graph workspace visual QA pass');
  assert(live.playable_labs.actual_exam.playable_lab.sequence_builders_removed_as_required_cards === true, 'live evidence must show exam support builders removed');
}

function requireBoundaryClean() {
  assert(gitStatus(['status', '--short', '--', 'references/machine', 'references/external']) === '', 'protected reference paths changed');
  assert(gitStatus(['status', '--short', '--', 'source-data']) === '', 'source-data paths changed');
  assert(
    gitStatus([
      '-c',
      'safe.directory=C:/Projects/4veco/4veco-lessen',
      '-C',
      '../4veco-lessen',
      'status',
      '--short',
      '--',
      'Boek 1 - Grondslagen, vraag en aanbod',
    ]) === '',
    'Book 1 generated-output paths changed'
  );
}

function main() {
  assert(fs.existsSync(gateDir), `missing gate directory ${rel(gateDir)}`);
  requireNoPrematureClosure();
  requirePacketText();

  const packet = readJson(`reports/review-gates/${gateId}/review-packet.json`);
  const live = readJson(`reports/review-gates/${gateId}/live-output-evidence.json`);
  assert(packet.schema_version === 1, 'review-packet schema_version must be 1');
  assert(packet.gate_id === gateId, 'review-packet wrong gate_id');
  assert(packet.sprint_id === sprintId, 'review-packet wrong sprint_id');
  assert(packet.human_review_mode === 'direct_packet_comments', 'review-packet must use direct comments');
  requireReviewArtifacts(packet);
  requireRemotePublication(packet, live);
  requireAllFalse(packet.authority_boundary, 'authority_boundary');
  requireAllFalse(live.product_boundaries, 'product_boundaries');
  requireEvidenceFiles(packet);
  requireRepair2Review(packet);
  requireLiveEvidence(live);

  runNode('build-scripts/sprints/check-task-ingest-transform2-actual-exam.js');
  runNode('build-scripts/sprints/check-task-ingest-transform3-textbook.js');
  requireBoundaryClean();

  const bundle = readText(`reports/review-gates/${gateId}/bundle-urls.md`);
  assert(bundle.includes(`reports/review-gates/${gateId}/review-packet.md`), 'bundle URLs missing review packet');
  assert(bundle.includes(`reports/review-gates/${gateId}/live-output-evidence.json`), 'bundle URLs missing live evidence JSON');
  assert(bundle.includes(`reports/review-gates/${gateId}/renewed-direct-review-comments.md`), 'bundle URLs missing renewed comments');

  console.log(`OK ${sprintId} shared task ingest repair review packet after repair2`);
}

main();
