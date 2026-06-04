#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review';
const sprintId = 'GATE-SHARED-TASK-INGEST-REPAIR-1';
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

function requireRemotePublication(packet, live) {
  const hashPattern = /^[0-9a-f]{40}$/;
  assert(packet.remote_publication_required_before_review === true, 'packet must require remote publication before review');
  assert(packet.remote_publication.reviewed_remote_branch === 'main', 'packet must record reviewed remote branch main');
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
    'direct-review-comments.md',
    'direct-review-comments.json',
    'comment-resolution-log.md',
    'comment-resolution-log.json',
    'closure-proposal.md',
    'closure-proposal.json',
    'human-interview.md',
    'human-interview.json',
  ];
  for (const name of forbidden) {
    const file = path.join(gateDir, name);
    assert(!fs.existsSync(file), `${rel(file)} must not exist before human review comments and closure`);
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
    'independently scrollable source pane',
    'question visibility after source scrolling',
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

function requirePlayableProof({
  transformPath,
  proofPath,
  expectedKind,
  expectedTaskCount,
  expectedContextBlockCount,
  expectedControlsMin,
  expectedVisuals,
}) {
  const transform = readJson(transformPath);
  const proof = readJson(proofPath);
  assert(transform.sourceAuthority.kind === expectedKind, `${transformPath} wrong source authority`);
  assert(proof.status === 'task_transformation_rendering_proof_complete', `${proofPath} wrong proof status`);
  assert(proof.task_transformation.context_before_tasks === true, `${proofPath} aggregate context ordering failed`);
  const playable = proof.task_transformation.playable_lab;
  for (const key of [
    'interactive_controls_rendered',
    'check_buttons_rendered',
    'completion_path_reaches_done',
    'source_pane_independent_scroll',
    'question_visible_after_source_scroll',
  ]) {
    assert(playable[key] === true, `${proofPath} playable_lab.${key} must be true`);
  }
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 3, `${proofPath} must include three screenshots`);
  for (const capture of proof.screenshots) {
    assert(fs.existsSync(abs(capture.file)), `missing screenshot ${capture.file}`);
    assert(capture.proof.contextBlockCount === expectedContextBlockCount, `${capture.case} wrong context block count`);
    assert(capture.proof.taskCardCount === expectedTaskCount, `${capture.case} wrong task count`);
    assert(capture.proof.sourcePanePresent === true, `${capture.case} missing source pane`);
    assert(capture.proof.taskPanePresent === true, `${capture.case} missing task pane`);
    assert(capture.proof.sourcePaneScrollable === true, `${capture.case} source pane is not scrollable`);
    assert(capture.proof.sourcePaneIndependentScroll === true, `${capture.case} source pane is not independent`);
    assert(capture.proof.questionVisibleAfterSourceScroll === true, `${capture.case} prompt lost during source scroll`);
    assert(capture.proof.interactiveControlCount >= expectedControlsMin, `${capture.case} missing controls`);
    assert(capture.proof.checkButtonCount === expectedTaskCount, `${capture.case} missing check buttons`);
    assert(capture.proof.completedTaskCount === expectedTaskCount, `${capture.case} demo path incomplete`);
    assert(capture.proof.labCompleted === true, `${capture.case} lab did not complete`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} has raw images`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table/formula overflow`);
    assert(capture.proof.sourceRefsVisible === true, `${capture.case} source refs not visible`);
    assert(capture.proof.visibleInternalIds === false, `${capture.case} exposes internal ids`);
    if (expectedVisuals.tableCount !== undefined) assert(capture.proof.tableCount === expectedVisuals.tableCount, `${capture.case} wrong table count`);
    if (expectedVisuals.graphCount !== undefined) assert(capture.proof.graphCount === expectedVisuals.graphCount, `${capture.case} wrong graph count`);
    if (expectedVisuals.flowchartCount !== undefined) assert(capture.proof.flowchartCount === expectedVisuals.flowchartCount, `${capture.case} wrong flowchart count`);
  }
  assert(fs.existsSync(abs(proof.lab)), `${proofPath} referenced lab missing`);
  assert(fs.existsSync(abs(proof.screenshot_manifest)), `${proofPath} referenced screenshot manifest missing`);
}

function requireAuthorityAndTraceEvidence() {
  const actual = readJson('reports/json/task-ingest-transform2-actual-exam.json');
  assert(actual.sourceAuthority.kind === 'external_primary', 'actual exam transform must be external_primary');
  assert(actual.sourceAuthority.prompt_pdf.includes('vw-1022-a-25-1-o.pdf#question-3'), 'actual exam prompt PDF ref missing');
  assert(actual.sourceAuthority.correction_pdf.includes('vw-1022-a-25-1-c.pdf#question-3'), 'actual exam correction PDF ref missing');
  assert(actual.answerModelRefs.some((ref) => ref.includes('vw-1022-a-25-1-c.pdf#question-3')), 'actual answer model refs missing');
  assert(readText('reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md').includes('final-answer field alone'), 'actual task-family map must reject final-answer reduction');
  assert(readText('reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md').includes('TaskShellEngine'), 'actual reviewer notes must cite TaskShellEngine');

  const textbook = readJson('reports/json/task-ingest-transform3-textbook.json');
  assert(textbook.sourceAuthority.kind === 'owned_textbook_source', 'textbook transform must be owned_textbook_source');
  assert(textbook.sourceAuthority.authority_note.includes('not official exam authority'), 'textbook authority note must reject official authority');
  assert(textbook.textbookSourceAmbiguity.handling.includes('both valid intervals'), 'textbook ambiguity handling must record both intervals');
  assert(readText('reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md').includes('owned_textbook_source'), 'textbook source map must cite owned source authority');
  assert(readText('reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md').includes('final interval'), 'textbook task-family map must reject final-interval reduction');
  assert(readText('reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-reviewer-notes.md').includes('TaskShellEngine'), 'textbook reviewer notes must cite TaskShellEngine');
}

function requireLabNoLeakage() {
  const actualLab = readText('reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html');
  for (const forbidden of ['ctx-zoohee', 'q3-', '649', '1.684', '1684', '1.035', '1035']) {
    assert(!actualLab.includes(forbidden), `actual lab leaks forbidden detector ${forbidden}`);
  }
  const textbookLab = readText('reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html');
  for (const forbidden of ['ctx-icecream', 'tb113-', '-50', '350']) {
    assert(!textbookLab.includes(forbidden), `textbook lab leaks forbidden detector ${forbidden}`);
  }
}

function requireLeadAndVerification(packet) {
  assert(packet.pre_gate_lead_review.required === true, 'lead review must be required');
  assert(packet.pre_gate_lead_review.status === 'passed_before_direct_review_comments', 'lead review must pass before direct comments');
  assert(packet.pre_gate_lead_review.final_verdict === 'PASS WITH FLAGS' || packet.pre_gate_lead_review.final_verdict === 'PASS', 'lead review final verdict must pass');
  for (const key of ['assignment', 'round1', 'corrections', 'round2']) {
    const text = readText(packet.pre_gate_lead_review[key]);
    assert(text.includes(sprintId), `${packet.pre_gate_lead_review[key]} missing sprint id`);
  }
  const round2 = readText(packet.pre_gate_lead_review.round2);
  assert(round2.includes('Verdict: PASS WITH FLAGS') || round2.includes('Verdict: PASS'), 'lead review round2 must record a pass verdict');
  assert(packet.verification_review.status === 'passed_before_human_review', 'verification review must pass before human review');
  const verification = readText(packet.verification_review.artifact);
  assert(verification.includes('Verdict: PASS'), 'verification review must record PASS');
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
  assert(packet.human_review_comments_started === false, 'human review comments must not be started');
  assert(live.status.includes('playable_lab_evidence_ready'), 'live-output evidence wrong status');
  requireRemotePublication(packet, live);
  requireAllFalse(packet.authority_boundary, 'authority_boundary');
  requireAllFalse(live.product_boundaries, 'product_boundaries');
  requireEvidenceFiles(packet);

  requirePlayableProof({
    transformPath: 'reports/json/task-ingest-transform2-actual-exam.json',
    proofPath: 'reports/json/task-ingest-transform2-actual-exam-proof.json',
    expectedKind: 'external_primary',
    expectedTaskCount: 6,
    expectedContextBlockCount: 4,
    expectedControlsMin: 6,
    expectedVisuals: { tableCount: 1, graphCount: 0, flowchartCount: 0 },
  });
  requirePlayableProof({
    transformPath: 'reports/json/task-ingest-transform3-textbook.json',
    proofPath: 'reports/json/task-ingest-transform3-textbook-proof.json',
    expectedKind: 'owned_textbook_source',
    expectedTaskCount: 9,
    expectedContextBlockCount: 6,
    expectedControlsMin: 9,
    expectedVisuals: { tableCount: 1, graphCount: 1, flowchartCount: 1 },
  });
  requireAuthorityAndTraceEvidence();
  requireLabNoLeakage();
  requireLeadAndVerification(packet);
  requireBoundaryClean();

  const bundle = readText(`reports/review-gates/${gateId}/bundle-urls.md`);
  assert(bundle.includes(`reports/review-gates/${gateId}/review-packet.md`), 'bundle URLs missing review packet');
  assert(bundle.includes(`reports/review-gates/${gateId}/live-output-evidence.json`), 'bundle URLs missing live evidence JSON');

  console.log(`OK ${sprintId} shared task ingest repair review packet`);
}

main();
