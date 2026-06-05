#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const files = {
  plan: 'reports/sprints/VISUAL-QA-HARDEN-2-plan.md',
  baseline: 'reports/sprints/VISUAL-QA-HARDEN-2-baseline.md',
  planningReview: 'reports/sprints/VISUAL-QA-HARDEN-2-planning-review.md',
  rubric: 'reports/sprints/VISUAL-QA-HARDEN-2-product-qa-rubric.md',
  proof: 'reports/json/visual-qa-harden2-proof.json',
  report: 'reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md',
  commandLog: 'reports/sprints/VISUAL-QA-HARDEN-2-command-log.md',
  commandLogJsonl: 'reports/sprints/VISUAL-QA-HARDEN-2-command-log.jsonl',
  leadAssignment: 'reports/sprints/VISUAL-QA-HARDEN-2-lead-review-assignment.md',
  leadRound1: 'reports/sprints/VISUAL-QA-HARDEN-2-lead-review-round1.md',
  leadCorrections: 'reports/sprints/VISUAL-QA-HARDEN-2-lead-review-corrections.md',
  leadRound2: 'reports/sprints/VISUAL-QA-HARDEN-2-lead-review-round2.md',
  verification: 'reports/sprints/VISUAL-QA-HARDEN-2-verification-review.md',
  result: 'reports/sprints/VISUAL-QA-HARDEN-2-result.md',
  graphCheckProof: 'reports/json/graph-check-ux1-proof.json',
  graphExitProof: 'reports/json/graph-exit-ux1-proof.json',
  routeCopyProof: 'reports/json/check-route-copy1-proof.json',
  shortSource: 'source-data/book-1/exit-ticket/1.1.3-korte-check.json',
  exitSource: 'source-data/book-1/exit-ticket/1.1.3-exit-ticket.json',
  roadmap: 'references/reference-team-roadmap.md',
};

function fail(message) {
  console.error(`VISUAL-QA-HARDEN-2 check failed: ${message}`);
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

function taskShells(data) {
  return (data.tasks || [])
    .filter((task) => task.type === 'task_shell')
    .map((task) => task.taskShell || {});
}

function checkCommandLogJsonl() {
  const lines = read(files.commandLogJsonl).split(/\r?\n/).filter(Boolean);
  assert(lines.length >= 7, 'command log JSONL must record baseline inspection commands');
  for (const line of lines) {
    try {
      JSON.parse(line);
    } catch (error) {
      fail(`command log JSONL has invalid line: ${error.message}`);
    }
  }
}

function checkRequiredDocs() {
  for (const key of [
    'plan',
    'baseline',
    'planningReview',
    'rubric',
    'proof',
    'report',
    'commandLog',
    'commandLogJsonl',
    'leadAssignment',
    'leadRound1',
    'leadCorrections',
    'leadRound2',
    'verification',
    'result',
  ]) {
    assert(fs.existsSync(abs(files[key])), `missing ${files[key]}`);
  }
  const plan = read(files.plan);
  requireText(plan, 'Quality Floor', 'quality floor', files.plan);
  requireText(plan, 'Specification Requirements Fulfilled', 'specification requirements', files.plan);
  requireText(plan, 'Evidence Needed', 'evidence list', files.plan);
  requireText(plan, 'Review Gate', 'review gate', files.plan);
  requireText(plan, 'Stop Conditions', 'stop conditions', files.plan);
  requireText(plan, 'CHECK-SURFACE-PREGATE-1', 'pregate next gate', files.plan);
  rejectText(plan, /Scale Gate 1 authorized|product-route adoption authorized|student\/product use is authorized/i, 'authority overclaim', files.plan);

  const leadRound2 = read(files.leadRound2);
  requireText(leadRound2, 'PASS WITH FLAGS', 'round-2 verdict', files.leadRound2);
  requireText(leadRound2, 'CHECK-SURFACE-PREGATE-1', 'pregate carried flag', files.leadRound2);
  const result = read(files.result);
  requireText(result, 'Complete after visual/product QA proof hardening', 'result status', files.result);
  requireText(result, 'Required Next Action', 'result next action', files.result);

  const rubric = read(files.rubric);
  for (const text of [
    '1.1.3` advisory short check',
    'Source/task split workspace',
    'DOM inspection objects',
    'typical 4 vwo student',
    'CSR1-F1',
    'CSR1-F5',
  ]) {
    requireText(rubric, text, `rubric text ${text}`, files.rubric);
  }
}

function checkSourceStillMatchesRubric() {
  const shortSource = readJson(files.shortSource);
  const exitSource = readJson(files.exitSource);
  const shortShells = taskShells(shortSource);
  const exitShells = taskShells(exitSource);
  const shortFamilies = new Set(shortShells.map((task) => task.family));
  const exitFamilies = new Set(exitShells.map((task) => task.family));

  assert(shortSource.surface === 'advisory_short_check', '1.1.3 short check must remain advisory');
  assert(Array.isArray(shortSource.contextBlocks) && shortSource.contextBlocks.length >= 2, '1.1.3 short check must keep context blocks');
  assert(shortSource.tasks.every((task) => task.type === 'task_shell'), '1.1.3 short check must not return to choice-only tasks');
  assert(shortFamilies.has('graph_construction_substitute'), '1.1.3 short check must keep graph construction substitute');
  assert(shortFamilies.has('graph_reading'), '1.1.3 short check must keep graph reading');
  assert(shortFamilies.has('table_value_selection'), '1.1.3 short check must keep table value/route selection');

  assert(exitSource.layout && exitSource.layout.kind === 'source_task_workspace', '1.1.3 exit ticket must keep source/task workspace layout');
  assert(Array.isArray(exitSource.contextBlocks) && exitSource.contextBlocks.length === 4, '1.1.3 exit ticket must keep four context blocks');
  assert(exitFamilies.has('graph_construction_substitute'), '1.1.3 exit ticket must keep graph construction substitute');
  assert(exitFamilies.has('graph_reading'), '1.1.3 exit ticket must keep graph reading');
  assert(exitFamilies.has('calculation_work_capture'), '1.1.3 exit ticket must keep calculation/halving task');
  assert(exitSource.targetEquivalent && exitSource.targetEquivalent.gateApproved === false, '1.1.3 exit ticket must remain unapproved before retry gate');
  assert(exitSource.targetEquivalent && exitSource.targetEquivalent.completionLanguageEligible === false, '1.1.3 exit ticket completion language must remain held');
}

function checkProof() {
  const proof = readJson(files.proof);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === 'VISUAL-QA-HARDEN-2', 'proof sprint_id mismatch');
  assert(proof.status === 'complete', 'proof status must be complete');
  assert(Array.isArray(proof.checks) && proof.checks.length >= 12, 'proof must record hard-fail checks');
  assert(proof.checks.every((item) => item.status === 'pass'), 'every hard-fail check must pass');
  assert(Array.isArray(proof.reset_findings_addressed), 'proof must record reset findings');
  for (const id of ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5']) {
    const finding = proof.reset_findings_addressed.find((item) => item.id === id);
    assert(finding && finding.status === 'guarded', `${id} must be guarded`);
  }
  for (const id of [
    'short_graph_table_interaction',
    'short_context_and_workspace',
    'short_feedback_and_next_action',
    'exit_split_workspace',
    'exit_graph_workspace_and_line',
    'exit_source_scroll_preserves_task',
    'exit_completion_language_held',
    'landing_route_distinction',
    'screenshot_dom_facts',
    'reports_go_beyond_label_hygiene',
    'student_experience_judgement_required',
    'authority_boundary_preserved',
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

  assert(
    proof.student_experience_judgement
      && proof.student_experience_judgement.required === true
      && /orient, perform the graph\/table action, read targeted feedback, and know the next action/.test(proof.student_experience_judgement.judgement),
    'proof must require student-experience judgement'
  );
}

function checkUnderlyingProofs() {
  const graphCheck = readJson(files.graphCheckProof);
  const graphExit = readJson(files.graphExitProof);
  const routeCopy = readJson(files.routeCopyProof);

  assert(graphCheck.proof.graph_workspace_present === true, 'graph-check proof must show graph workspace');
  assert(graphCheck.proof.choice_only === false, 'graph-check proof must reject choice-only short check');
  assert(graphCheck.proof.wrong_feedback_targeted === true, 'graph-check proof must show targeted wrong feedback');
  assert(graphCheck.proof.correct_path_reaches_route_advice === true, 'graph-check proof must show route advice');
  assert(graphCheck.proof.mobile_rendered === true && graphCheck.proof.dark_mode_rendered === true, 'graph-check proof must show mobile/dark');

  assert(graphExit.proof.source_task_workspace_present === true, 'graph-exit proof must show source/task workspace');
  assert(graphExit.proof.source_pane_scrollable === true, 'graph-exit proof must show scrollable source pane');
  assert(graphExit.proof.task_visible_after_source_scroll === true, 'graph-exit proof must show task visible after source scroll');
  assert(graphExit.proof.correct_path_draws_line === true, 'graph-exit proof must show same-workspace line');
  assert(graphExit.proof.completion_language_held === true, 'graph-exit proof must keep completion language held');

  assert(routeCopy.proof.advisory_and_exit_cards_distinct === true, 'route-copy proof must show route distinction');
  assert(routeCopy.proof.old_generic_copy_absent === true, 'route-copy proof must reject old generic copy');
  assert(routeCopy.proof.forbidden_authority_absent === true, 'route-copy proof must reject forbidden authority');
}

function checkReportAndRoadmap() {
  const report = read(files.report);
  requireText(report, 'Hard-Fail Checks', 'hard-fail checks section', files.report);
  requireText(report, 'Reset Findings Guarded', 'reset findings section', files.report);
  requireText(report, 'Student-Experience Judgement Requirement', 'student-experience section', files.report);
  requireText(report, 'CHECK-SURFACE-PREGATE-1', 'next action', files.report);
  rejectText(report, /gate closes|PASS WITH FLAGS/i, 'gate closure language', files.report);

  const roadmap = read(files.roadmap);
  requireText(roadmap, 'VISUAL-QA-HARDEN-2', 'roadmap sprint mention', files.roadmap);
  requireText(roadmap, /VISUAL-QA-HARDEN-2[\s\S]{0,650}next/i, 'roadmap next-sprint context', files.roadmap);
}

function main() {
  checkRequiredDocs();
  checkCommandLogJsonl();
  checkSourceStillMatchesRubric();
  checkProof();
  checkUnderlyingProofs();
  checkReportAndRoadmap();
  console.log('VISUAL-QA-HARDEN-2 check passed');
}

main();
