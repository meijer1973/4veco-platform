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

function requireReturnedReviewArtifacts(packet) {
  assert(packet.human_review_comments_started === true, 'human review comments must be recorded as started/returned');
  assert(packet.human_review_decision === 'hold_for_playable_repair', 'human review decision must be hold_for_playable_repair');
  assert(packet.gate_closure_authorized === false, 'gate closure must not be authorized');
  assert(packet.required_next_sprint === 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-1', 'packet must name required playable repair sprint');
  const comments = readJson(`reports/review-gates/${gateId}/direct-review-comments.json`);
  const resolution = readJson(`reports/review-gates/${gateId}/comment-resolution-log.json`);
  assert(comments.decision === 'hold_for_playable_repair', 'direct-review-comments decision must be hold_for_playable_repair');
  assert(comments.review_verdict === 'REVISE', 'direct-review-comments must record REVISE');
  assert(resolution.status === 'repair_evidence_prepared_awaiting_renewed_review', 'comment-resolution-log status must keep renewed review open');
  assert(resolution.gate_closure_authorized === false, 'comment-resolution-log must not authorize closure');
  assert(resolution.renewed_human_review_required === true, 'comment-resolution-log must require renewed review');
  assert(fs.existsSync(path.join(gateDir, 'direct-review-comments.md')), 'missing direct-review-comments.md');
  assert(fs.existsSync(path.join(gateDir, 'comment-resolution-log.md')), 'missing comment-resolution-log.md');
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
  assert(proof.status === 'playable_repair_proof_complete', `${proofPath} wrong proof status`);
  assert(proof.task_transformation.context_before_tasks === true, `${proofPath} aggregate context ordering failed`);
  assert(proof.task_transformation.visible_internal_ids === false, `${proofPath} exposes internal ids`);
  assert(proof.task_transformation.raw_image_count === 0, `${proofPath} contains raw images`);
  const playable = proof.task_transformation.playable_lab;
  for (const key of [
    'semantic_validation_enabled',
    'real_task_family_controls_rendered',
    'source_value_banks_rendered',
    'sequence_builders_rendered',
    'plain_sequence_textareas_absent',
    'check_buttons_rendered',
    'task_instructions_rendered',
    'support_collapsed_by_default',
    'initial_state_proven',
    'wrong_retry_state_proven',
    'corrected_state_proven',
    'completion_path_reaches_done',
    'source_pane_independent_scroll',
    'question_visible_after_source_scroll',
  ]) {
    assert(playable[key] === true, `${proofPath} playable_lab.${key} must be true`);
  }
  const requiredCases = new Map([
    ['desktop-initial', { width: 1280, theme: 'light', action: 'initial' }],
    ['desktop-wrong-retry', { width: 1280, theme: 'light', action: 'wrong' }],
    ['desktop-corrected', { width: 1280, theme: 'light', action: 'corrected' }],
    ['desktop-completed', { width: 1280, theme: 'light', action: 'complete' }],
    ['mobile-completed', { width: 390, theme: 'light', action: 'complete' }],
    ['mobile-dark-completed', { width: 390, theme: 'dark', action: 'complete' }],
  ]);
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === requiredCases.size, `${proofPath} must include six screenshots`);
  for (const capture of proof.screenshots) {
    const expected = requiredCases.get(capture.case);
    assert(expected, `${proofPath} unexpected screenshot case ${capture.case}`);
    assert(capture.theme === expected.theme, `${capture.case} wrong theme`);
    assert(capture.action === expected.action, `${capture.case} wrong action`);
    assert(capture.viewport.width === expected.width, `${capture.case} wrong viewport width`);
    assert(fs.existsSync(abs(capture.file)), `missing screenshot ${capture.file}`);
    assert(capture.proof.contextBlockCount === expectedContextBlockCount, `${capture.case} wrong context block count`);
    assert(capture.proof.taskCardCount === expectedTaskCount, `${capture.case} wrong task count`);
    assert(capture.proof.semanticValidationEnabled === true, `${capture.case} missing semantic validation`);
    assert(capture.proof.genericOptionLabelVisible === false, `${capture.case} renders generic controls`);
    assert(capture.proof.supportBoxCount >= 1, `${capture.case} missing support boxes`);
    assert(capture.proof.supportCollapsedByDefault === true, `${capture.case} support is not collapsed`);
    assert(capture.proof.plainSequenceTextareaCount === 0, `${capture.case} renders plain sequence textareas`);
    assert(capture.proof.taskInstructionCount === expectedTaskCount, `${capture.case} missing concrete instructions`);
    assert(capture.proof.sourcePanePresent === true, `${capture.case} missing source pane`);
    assert(capture.proof.taskPanePresent === true, `${capture.case} missing task pane`);
    assert(capture.proof.sourcePaneScrollable === true, `${capture.case} source pane is not scrollable`);
    assert(capture.proof.sourcePaneIndependentScroll === true, `${capture.case} source pane is not independent`);
    assert(capture.proof.questionVisibleAfterSourceScroll === true, `${capture.case} prompt lost during source scroll`);
    assert(capture.proof.interactiveControlCount >= expectedControlsMin, `${capture.case} missing controls`);
    assert(capture.proof.checkButtonCount === expectedTaskCount, `${capture.case} missing check buttons`);
    if (capture.case === 'desktop-initial') {
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should start incomplete`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not be complete`);
    } else if (capture.case === 'desktop-wrong-retry') {
      assert(capture.proof.wrongRetryCount > 0, `${capture.case} missing retry state`);
      assert(capture.proof.retryFeedbackCount > 0, `${capture.case} missing retry feedback`);
      assert(capture.proof.completedTaskCount === 0, `${capture.case} should reject wrong attempt`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete after wrong attempt`);
    } else if (capture.case === 'desktop-corrected') {
      assert(capture.proof.completedTaskCount === 1, `${capture.case} should complete exactly one corrected card`);
      assert(capture.proof.wrongRetryCount === 0, `${capture.case} should clear retry state after correction`);
      assert(capture.proof.labCompleted === false, `${capture.case} should not complete the whole lab`);
    } else {
      assert(capture.proof.completedTaskCount === expectedTaskCount, `${capture.case} completion path incomplete`);
      assert(capture.proof.labCompleted === true, `${capture.case} lab did not complete`);
    }
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
  for (const forbidden of ['ctx-zoohee', 'q3-', 'Keuze A', 'Keuze B']) {
    assert(!actualLab.includes(forbidden), `actual lab leaks forbidden detector ${forbidden}`);
  }
  assert(actualLab.includes('data-semantic-validation="required"'), 'actual lab must require semantic validation');
  assert(actualLab.includes('support-box'), 'actual lab must include collapsed support boxes');
  const textbookLab = readText('reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html');
  for (const forbidden of ['ctx-icecream', 'tb113-', 'Keuze A', 'Keuze B']) {
    assert(!textbookLab.includes(forbidden), `textbook lab leaks forbidden detector ${forbidden}`);
  }
  assert(textbookLab.includes('data-semantic-validation="required"'), 'textbook lab must require semantic validation');
  assert(textbookLab.includes('support-box'), 'textbook lab must include collapsed support boxes');
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

function requirePlayableRepairReview(packet) {
  const repair = packet.playable_repair_review;
  assert(repair && repair.required === true, 'playable repair review metadata must be present and required');
  assert(repair.sprint_id === 'SHARED-TASK-INGEST-PLAYABLE-REPAIR-1', 'playable repair review must name repair sprint');
  assert(repair.status === 'passed_after_playable_repair_before_new_human_review', 'playable repair review must pass before renewed human review');
  for (const key of ['lead_assignment', 'lead_round1', 'lead_corrections', 'lead_round2', 'verification']) {
    assert(repair[key], `playable repair review missing ${key}`);
    const text = readText(repair[key]);
    assert(text.includes('SHARED-TASK-INGEST-PLAYABLE-REPAIR-1'), `${repair[key]} missing repair sprint id`);
  }
  const round2 = readText(repair.lead_round2);
  assert(round2.includes('Verdict: PASS') || round2.includes('Verdict: PASS WITH FLAGS'), 'repair lead round2 must pass');
  const verification = readText(repair.verification);
  assert(verification.includes('Verdict: PASS'), 'repair verification must pass');
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
  requireReturnedReviewArtifacts(packet);
  assert(live.status.includes('playable_repair_evidence_ready'), 'live-output evidence wrong status');
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
  requirePlayableRepairReview(packet);
  requireBoundaryClean();

  const bundle = readText(`reports/review-gates/${gateId}/bundle-urls.md`);
  assert(bundle.includes(`reports/review-gates/${gateId}/review-packet.md`), 'bundle URLs missing review packet');
  assert(bundle.includes(`reports/review-gates/${gateId}/live-output-evidence.json`), 'bundle URLs missing live evidence JSON');

  console.log(`OK ${sprintId} shared task ingest repair review packet`);
}

main();
