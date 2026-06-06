#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const files = {
  plan: 'reports/sprints/CHECK-SURFACE-PREGATE-1-plan.md',
  baseline: 'reports/sprints/CHECK-SURFACE-PREGATE-1-baseline.md',
  planningReview: 'reports/sprints/CHECK-SURFACE-PREGATE-1-planning-review.md',
  walkthrough: 'reports/sprints/CHECK-SURFACE-PREGATE-1-product-walkthrough.md',
  studentReview: 'reports/sprints/CHECK-SURFACE-PREGATE-1-student-experience-review.md',
  proof: 'reports/json/check-surface-pregate1-proof.json',
  report: 'reports/sprints/CHECK-SURFACE-PREGATE-1-readiness-report.md',
  commandLog: 'reports/sprints/CHECK-SURFACE-PREGATE-1-command-log.md',
  commandLogJsonl: 'reports/sprints/CHECK-SURFACE-PREGATE-1-command-log.jsonl',
  leadAssignment: 'reports/sprints/CHECK-SURFACE-PREGATE-1-lead-review-assignment.md',
  leadRound1: 'reports/sprints/CHECK-SURFACE-PREGATE-1-lead-review-round1.md',
  leadCorrections: 'reports/sprints/CHECK-SURFACE-PREGATE-1-lead-review-corrections.md',
  leadRound2: 'reports/sprints/CHECK-SURFACE-PREGATE-1-lead-review-round2.md',
  verification: 'reports/sprints/CHECK-SURFACE-PREGATE-1-verification-review.md',
  result: 'reports/sprints/CHECK-SURFACE-PREGATE-1-result.md',
  visualQaProof: 'reports/json/visual-qa-harden2-proof.json',
  graphCheckProof: 'reports/json/graph-check-ux1-proof.json',
  graphExitProof: 'reports/json/graph-exit-ux1-proof.json',
  routeCopyProof: 'reports/json/check-route-copy1-proof.json',
  roadmap: 'references/reference-team-roadmap.md',
};

function fail(message) {
  console.error(`CHECK-SURFACE-PREGATE-1 check failed: ${message}`);
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

function checkRequiredDocs() {
  for (const relPath of Object.values(files)) {
    if (relPath.endsWith('.md') || relPath.endsWith('.json') || relPath.endsWith('.jsonl')) {
      assert(fs.existsSync(abs(relPath)), `missing required file: ${relPath}`);
    }
  }

  const plan = read(files.plan);
  for (const text of [
    'Quality Floor',
    'Specification Requirements Fulfilled',
    'Evidence Needed',
    'Review Gate',
    'Stop Conditions',
    'GATE-CHECK-SHORT-EXIT-2-RETRY',
  ]) {
    requireText(plan, text, `plan section ${text}`, files.plan);
  }
  rejectText(plan, /Scale Gate 1 authorized|product-route adoption authorized|student\/product use is authorized/i, 'authority overclaim', files.plan);

  const walkthrough = read(files.walkthrough);
  requireText(walkthrough, 'five-minute walkthrough', 'walkthrough description', files.walkthrough);
  requireText(walkthrough, 'desktop-113-check.png', 'landing screenshot', files.walkthrough);
  requireText(walkthrough, 'desktop-line-confirmed.png', 'line-confirmed screenshot', files.walkthrough);
  requireText(walkthrough, 'PASS WITH FLAGS', 'walkthrough verdict', files.walkthrough);

  const studentReview = read(files.studentReview);
  requireText(studentReview, 'typical 4 vwo student', 'student persona', files.studentReview);
  requireText(studentReview, 'orient, act, receive useful feedback, and know the next action', 'student-experience judgement', files.studentReview);
  requireText(studentReview, 'PASS WITH FLAGS', 'student review verdict', files.studentReview);

  const leadRound2 = read(files.leadRound2);
  requireText(leadRound2, 'PASS WITH FLAGS', 'round-2 verdict', files.leadRound2);
  requireText(leadRound2, 'GATE-CHECK-SHORT-EXIT-2-RETRY', 'retry gate next action', files.leadRound2);

  const result = read(files.result);
  requireText(result, 'Complete after pregate validation and map refresh', 'result status', files.result);
  requireText(result, 'Required Next Action', 'result next action', files.result);
  requireText(result, 'GATE-CHECK-SHORT-EXIT-2-RETRY', 'retry next action', files.result);
}

function checkCommandLogJsonl() {
  const lines = read(files.commandLogJsonl).split(/\r?\n/).filter(Boolean);
  assert(lines.length >= 12, 'command log JSONL must record baseline and inspection evidence');
  for (const line of lines) {
    try {
      JSON.parse(line);
    } catch (error) {
      fail(`command log JSONL has invalid line: ${error.message}`);
    }
  }
}

function checkProof() {
  const proof = readJson(files.proof);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === 'CHECK-SURFACE-PREGATE-1', 'proof sprint_id mismatch');
  assert(proof.status === 'complete', 'proof status must be complete');
  assert(Array.isArray(proof.checks) && proof.checks.length >= 10, 'proof must contain pregate checks');
  assert(proof.checks.every((item) => item.status === 'pass'), 'all pregate checks must pass');

  for (const id of [
    'route_distinction_student_clear',
    'short_graph_table_action',
    'short_feedback_next_action',
    'exit_source_task_workspace',
    'exit_same_workspace_graph_line',
    'mobile_dark_reviewable',
    'student_experience_review_present',
    'walkthrough_present',
    'reset_findings_guarded',
    'authority_boundary_preserved',
    'required_screenshots_exist',
  ]) {
    assert(proof.checks.some((item) => item.id === id && item.status === 'pass'), `proof missing passing check ${id}`);
  }

  const authority = proof.authority || {};
  for (const key of [
    'product_route_adoption_authorized',
    'new_target_equivalent_completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'student_product_use_authorized',
  ]) {
    assert(authority[key] === false, `authority ${key} must remain false`);
  }

  assert(proof.student_experience_judgement && proof.student_experience_judgement.verdict === 'PASS_WITH_FLAGS', 'student-experience verdict must be PASS_WITH_FLAGS');
  assert(proof.student_experience_judgement.typical_student_can_orient === true, 'student must be able to orient');
  assert(proof.student_experience_judgement.typical_student_can_use_graph_table_context === true, 'student must be able to use graph/table context');
  assert(proof.student_experience_judgement.typical_student_can_keep_source_and_task_readable === true, 'student must keep source/task readable');
  assert(proof.student_experience_judgement.typical_student_receives_targeted_feedback === true, 'student must receive targeted feedback');
  assert(proof.student_experience_judgement.typical_student_knows_next_action === true, 'student must know next action');

  assert(proof.retry_gate_preparation && proof.retry_gate_preparation.ready_to_prepare_retry_packet === true, 'retry packet must be ready to prepare');
  assert(proof.retry_gate_preparation.human_gate_started === false, 'pregate must not start human gate');
  assert(proof.retry_gate_preparation.closure_authorized === false, 'pregate must not authorize closure');
}

function checkUnderlyingProofs() {
  const visualQa = readJson(files.visualQaProof);
  const graphCheck = readJson(files.graphCheckProof);
  const graphExit = readJson(files.graphExitProof);
  const routeCopy = readJson(files.routeCopyProof);

  assert(visualQa.status === 'complete', 'visual QA hardening proof must be complete');
  assert(visualQa.checks.every((item) => item.status === 'pass'), 'visual QA hardening checks must pass');
  for (const id of ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5']) {
    assert(visualQa.reset_findings_addressed.some((item) => item.id === id && item.status === 'guarded'), `${id} must remain guarded`);
  }

  assert(graphCheck.proof.graph_workspace_present === true, 'short-check graph workspace must be present');
  assert(graphCheck.proof.choice_only === false, 'short check must not be choice-only');
  assert(graphCheck.proof.wrong_feedback_targeted === true, 'short check must have targeted wrong feedback');
  assert(graphCheck.proof.correct_path_reaches_route_advice === true, 'short check must reach route advice');

  assert(graphExit.proof.source_task_workspace_present === true, 'exit ticket must have source/task workspace');
  assert(graphExit.proof.source_pane_scrollable === true, 'exit source pane must be scrollable');
  assert(graphExit.proof.task_visible_after_source_scroll === true, 'exit task must remain visible after source scroll');
  assert(graphExit.proof.correct_path_draws_line === true, 'exit graph line must be drawn');
  assert(graphExit.proof.completion_language_held === true, '1.1.3 completion language must stay held');

  assert(routeCopy.proof.advisory_and_exit_cards_distinct === true, 'route cards must remain distinct');
  assert(routeCopy.proof.old_generic_copy_absent === true, 'old generic route copy must be absent');
  assert(routeCopy.proof.forbidden_authority_absent === true, 'forbidden authority must be absent');
}

function checkReportAndRoadmap() {
  const report = read(files.report);
  requireText(report, 'PASS WITH FLAGS for retry-packet preparation', 'readiness verdict', files.report);
  requireText(report, 'Student-Experience Judgement', 'student section', files.report);
  requireText(report, 'GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review', 'renewed retry gate next action', files.report);
  rejectText(report, /gate closes|Scale Gate 1 authorized|product-route adoption authorized/i, 'closure or authority overclaim', files.report);

  const roadmap = read(files.roadmap);
  requireText(roadmap, 'CHECK-SURFACE-PREGATE-1', 'roadmap pregate mention', files.roadmap);
  requireText(roadmap, /CHECK-SURFACE-PREGATE-1[\s\S]{0,500}baseline repair evidence/, 'roadmap superseded-baseline marker', files.roadmap);
  requireText(roadmap, 'CHECKSURFACE-POLICY-REGRESSION-1', 'roadmap inserted policy-regression next action', files.roadmap);
  rejectText(roadmap, /Direct human\s+review comments are next/i, 'stale direct-review next action', files.roadmap);
}

function main() {
  checkRequiredDocs();
  checkCommandLogJsonl();
  checkProof();
  checkUnderlyingProofs();
  checkReportAndRoadmap();
  console.log('CHECK-SURFACE-PREGATE-1 check passed');
}

main();
