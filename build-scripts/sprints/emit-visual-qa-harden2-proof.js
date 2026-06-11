#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const paths = {
  resetFindings: 'reports/json/checksurface-reset1-quality-findings.json',
  graphCheckProof: 'reports/json/graph-check-ux1-proof.json',
  graphCheckManifest: 'reports/sprints/GRAPH-CHECK-UX-1-screenshots/manifest.json',
  graphCheckReport: 'reports/sprints/GRAPH-CHECK-UX-1-visual-qa-report.md',
  graphExitProof: 'reports/json/graph-exit-ux1-proof.json',
  graphExitManifest: 'reports/sprints/GRAPH-EXIT-UX-1-screenshots/manifest.json',
  graphExitReport: 'reports/sprints/GRAPH-EXIT-UX-1-visual-qa-report.md',
  routeCopyProof: 'reports/json/check-route-copy1-proof.json',
  routeCopyManifest: 'reports/sprints/CHECK-ROUTE-COPY-1-screenshots/manifest.json',
  routeCopyReport: 'reports/sprints/CHECK-ROUTE-COPY-1-visual-qa-report.md',
  shortSource: 'source-data/book-1/exit-ticket/1.1.3-korte-check.json',
  exitSource: 'source-data/book-1/exit-ticket/1.1.3-exit-ticket.json',
  rubric: 'reports/sprints/VISUAL-QA-HARDEN-2-product-qa-rubric.md',
  proofOut: 'reports/json/visual-qa-harden2-proof.json',
  reportOut: 'reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md',
};

function absolute(relPath) {
  return path.join(ROOT, relPath);
}

function readText(relPath) {
  const file = absolute(relPath);
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(readText(relPath));
  } catch (error) {
    throw new Error(`Invalid JSON in ${relPath}: ${error.message}`);
  }
}

function exists(relPath) {
  return fs.existsSync(absolute(relPath));
}

function taskShells(data) {
  return (data.tasks || [])
    .filter((task) => task.type === 'task_shell')
    .map((task) => task.taskShell || {});
}

function caseById(proof, id) {
  return (proof.cases || []).find((entry) => entry.id === id) || null;
}

function manifestCaseById(manifest, id) {
  const entries = Array.isArray(manifest) ? manifest : manifest.screenshots || [];
  return entries.find((entry) => entry.id === id) || null;
}

function inspectionCase(manifest, id) {
  const entry = manifestCaseById(manifest, id);
  return entry && entry.inspection ? entry.inspection : null;
}

function allScreenshotsExist(entries) {
  return entries.every((entry) => {
    const rel = entry.screenshot || entry.path;
    return Boolean(rel && exists(rel));
  });
}

function authorityBoundary(...proofs) {
  const keys = [
    'product_route_adoption_authorized',
    'new_target_equivalent_completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'student_product_use_authorized',
  ];
  return Object.fromEntries(keys.map((key) => [
    key,
    proofs.every((proof) => proof.authority && proof.authority[key] === false) ? false : true,
  ]));
}

function pass(value) {
  return Boolean(value);
}

function checkItem(id, label, passed, evidence, hardFailIf) {
  return {
    id,
    label,
    status: passed ? 'pass' : 'fail',
    evidence,
    hard_fail_if: hardFailIf,
  };
}

function main() {
  const reset = readJson(paths.resetFindings);
  const graphCheck = readJson(paths.graphCheckProof);
  const graphCheckManifest = readJson(paths.graphCheckManifest);
  const graphExit = readJson(paths.graphExitProof);
  const graphExitManifest = readJson(paths.graphExitManifest);
  const routeCopy = readJson(paths.routeCopyProof);
  const routeCopyManifest = readJson(paths.routeCopyManifest);
  const shortSource = readJson(paths.shortSource);
  const exitSource = readJson(paths.exitSource);
  const rubric = readText(paths.rubric);
  const graphCheckReport = readText(paths.graphCheckReport);
  const graphExitReport = readText(paths.graphExitReport);
  const routeCopyReport = readText(paths.routeCopyReport);

  const shortShells = taskShells(shortSource);
  const exitShells = taskShells(exitSource);
  const shortFamilies = new Set(shortShells.map((task) => task.family));
  const exitFamilies = new Set(exitShells.map((task) => task.family));

  const graphCheckDesktop = inspectionCase(graphCheckManifest, 'desktop-initial');
  const graphCheckWrong = caseById(graphCheck, 'desktop-wrong-retry');
  const graphCheckRoute = caseById(graphCheck, 'desktop-route-advice');
  const graphExitDesktop = inspectionCase(graphExitManifest, 'desktop-initial');
  const graphExitScrolled = caseById(graphExit, 'desktop-source-scrolled');
  const graphExitLine = caseById(graphExit, 'desktop-line-confirmed');
  const graphExitCompleted = caseById(graphExit, 'desktop-completed-held');
  const routeCopy113 = caseById(routeCopy, 'desktop-113-check');

  const checks = [
    checkItem(
      'short_graph_table_interaction',
      '1.1.3 advisory short check uses graph/table task-shell interaction',
      shortSource.surface === 'advisory_short_check'
        && shortShells.length === 3
        && shortFamilies.has('graph_construction_substitute')
        && shortFamilies.has('graph_reading')
        && shortFamilies.has('table_value_selection')
        && graphCheck.proof.graph_workspace_present === true
        && graphCheck.proof.choice_only === false,
      [
        `${paths.shortSource}: ${shortShells.length} task-shell tasks`,
        `${paths.graphCheckProof}: graph_workspace_present=${graphCheck.proof.graph_workspace_present}`,
        `${paths.graphCheckProof}: choice_only=${graphCheck.proof.choice_only}`,
      ],
      'Short check is ordinary choice-only or lacks graph/table families'
    ),
    checkItem(
      'short_context_and_workspace',
      '1.1.3 advisory short check has source/table context and rendered graph workspace facts',
      Array.isArray(shortSource.contextBlocks)
        && shortSource.contextBlocks.length >= 2
        && graphCheck.proof.short_check_context_block_count >= 2
        && graphCheck.proof.short_check_task_shell_count === 3
        && graphCheckDesktop
        && graphCheckDesktop.contextBlocks >= 2
        && graphCheckDesktop.gridLines >= 8
        && graphCheckDesktop.ordinaryChoiceButtons === 0,
      [
        `${paths.graphCheckProof}: context=${graphCheck.proof.short_check_context_block_count}, taskShell=${graphCheck.proof.short_check_task_shell_count}`,
        `${paths.graphCheckManifest}: desktop inspection includes contextBlocks, gridLines, ordinaryChoiceButtons`,
      ],
      'Context block count, task-shell count, graph grid, or choice-only guard is missing'
    ),
    checkItem(
      'short_feedback_and_next_action',
      '1.1.3 advisory short check has targeted feedback and route advice',
      graphCheck.proof.wrong_feedback_targeted === true
        && graphCheck.proof.correct_path_reaches_route_advice === true
        && graphCheckWrong
        && /Controleer assen/.test(graphCheckWrong.retry.feedback || '')
        && graphCheckRoute
        && graphCheckRoute.correct
        && /Ga naar tabel naar grafiek/.test(graphCheckRoute.correct.routeFeedback || ''),
      [
        `${paths.graphCheckProof}: wrong_feedback_targeted=${graphCheck.proof.wrong_feedback_targeted}`,
        `${paths.graphCheckProof}: correct_path_reaches_route_advice=${graphCheck.proof.correct_path_reaches_route_advice}`,
      ],
      'Feedback is generic or the short check gives no actionable next route'
    ),
    checkItem(
      'exit_split_workspace',
      '1.1.3 exit ticket uses split source/task graph workspace',
      exitSource.layout
        && exitSource.layout.kind === 'source_task_workspace'
        && graphExit.proof.source_task_workspace_present === true
        && graphExit.proof.source_pane_constrained === true
        && graphExit.proof.source_pane_constrained === true
        && graphExit.proof.current_context_blocks === 'ctx-stationbroodjes-source,ctx-stationbroodjes-table'
        && graphExit.proof.percentage_claim_control_present === true
        && graphExitDesktop
        && graphExitDesktop.sourceTaskWorkspace === true
        && graphExitDesktop.sourcePaneMetrics
        && graphExitDesktop.sourcePaneMetrics.constrained === true,
      [
        `${paths.exitSource}: layout.kind=${exitSource.layout && exitSource.layout.kind}`,
        `${paths.graphExitProof}: source_task_workspace_present=${graphExit.proof.source_task_workspace_present}`,
        `${paths.graphExitProof}: current_context_blocks=${graphExit.proof.current_context_blocks}`,
      ],
      'Source context is rendered only above tasks, stale context is present, or source pane is not constrained'
    ),
    checkItem(
      'exit_graph_workspace_and_line',
      '1.1.3 exit ticket graph remains in the active workspace',
      exitFamilies.has('graph_construction_substitute')
        && exitFamilies.has('graph_reading')
        && exitFamilies.has('calculation_work_capture')
        && graphExit.proof.graph_workspace_present === true
        && graphExit.proof.grid_visible === true
        && graphExit.proof.correct_path_draws_line === true
        && graphExitLine
        && graphExitLine.correct
        && graphExitLine.correct.graphLine === true
        && graphExitLine.inspection
        && graphExitLine.inspection.graphLine === true,
      [
        `${paths.graphExitProof}: graph_workspace_present=${graphExit.proof.graph_workspace_present}`,
        `${paths.graphExitProof}: correct_path_draws_line=${graphExit.proof.correct_path_draws_line}`,
        `${paths.graphExitManifest}: desktop-line-confirmed inspection.graphLine=true`,
      ],
      'Graph line is missing, drawn outside the active workspace, or grid/workspace proof is absent'
    ),
    checkItem(
      'exit_source_scroll_preserves_task',
      'Source scrolling keeps task orientation visible for 1.1.3 exit ticket',
      graphExit.proof.task_visible_after_source_scroll === true
        && graphExitScrolled
        && graphExitScrolled.scroll
        && graphExitScrolled.scroll.taskPaneVisible === true
        && graphExitScrolled.inspection
        && graphExitScrolled.inspection.stickyQuestionStrip === true,
      [
        `${paths.graphExitProof}: task_visible_after_source_scroll=${graphExit.proof.task_visible_after_source_scroll}`,
        `${paths.graphExitProof}: desktop-source-scrolled.scroll.taskPaneVisible=true`,
      ],
      'Source pane scrolling hides the task pane or loses the question strip'
    ),
    checkItem(
      'exit_completion_language_held',
      '1.1.3 exit ticket keeps completion language held after task success',
      graphExit.proof.all_tasks_correct === true
        && graphExit.proof.completion_language_held === true
        && exitSource.targetEquivalent
        && exitSource.targetEquivalent.completionLanguageEligible === false
        && graphExitCompleted
        && graphExitCompleted.correct
        && graphExitCompleted.correct.matchFeedbackCount === 3,
      [
        `${paths.graphExitProof}: all_tasks_correct=${graphExit.proof.all_tasks_correct}`,
        `${paths.graphExitProof}: completion_language_held=${graphExit.proof.completion_language_held}`,
      ],
      '1.1.3 gains target-equivalent completion authority before human review'
    ),
    checkItem(
      'landing_route_distinction',
      'First-three landing pages distinguish advisory and exit routes',
      routeCopy.proof.advisory_and_exit_cards_distinct === true
        && routeCopy.proof.old_generic_copy_absent === true
        && routeCopy113
        && routeCopy113.inspection
        && routeCopy113.inspection.shortPurpose === 'local-practice-advice'
        && routeCopy113.inspection.exitPurpose === 'end-check',
      [
        `${paths.routeCopyProof}: advisory_and_exit_cards_distinct=${routeCopy.proof.advisory_and_exit_cards_distinct}`,
        `${paths.routeCopyProof}: old_generic_copy_absent=${routeCopy.proof.old_generic_copy_absent}`,
      ],
      'Landing pages use generic Check copy or blur advisory versus exit-ticket purpose'
    ),
    checkItem(
      'screenshot_dom_facts',
      'Screenshot proof contains DOM/product inspection facts, not only file paths',
      Array.isArray(graphCheckManifest)
        && graphCheckManifest.every((entry) => entry.inspection && entry.inspection.viewport && entry.inspection.theme)
        && Array.isArray(graphExitManifest)
        && graphExitManifest.every((entry) => entry.inspection && entry.inspection.viewport && entry.inspection.theme)
        && routeCopy.cases.every((entry) => entry.inspection && entry.inspection.viewport && entry.inspection.theme)
        && allScreenshotsExist(graphCheckManifest)
        && allScreenshotsExist(graphExitManifest)
        && allScreenshotsExist(routeCopy.cases),
      [
        `${paths.graphCheckManifest}: inspection objects on all entries`,
        `${paths.graphExitManifest}: inspection objects on all entries`,
        `${paths.routeCopyProof}: inspection objects on all entries`,
      ],
      'Proof only lists screenshot files or pages without DOM/state facts'
    ),
    checkItem(
      'mobile_dark_product_states',
      'Mobile and dark-mode product states are present for graph check, graph exit, and route copy',
      graphCheck.proof.mobile_rendered === true
        && graphCheck.proof.dark_mode_rendered === true
        && graphExit.proof.mobile_rendered === true
        && graphExit.proof.dark_mode_rendered === true
        && routeCopy.proof.mobile_rendered === true
        && routeCopy.proof.dark_mode_rendered === true,
      [
        `${paths.graphCheckProof}: mobile/dark proof true`,
        `${paths.graphExitProof}: mobile/dark proof true`,
        `${paths.routeCopyProof}: mobile/dark proof true`,
      ],
      'Mobile or dark proof is missing for one of the repaired surfaces'
    ),
    checkItem(
      'reports_go_beyond_label_hygiene',
      'Visual QA reports judge interaction/product quality beyond labels and files',
      /Graph workspace present/i.test(graphCheckReport)
        && /Route advice visible/i.test(graphCheckReport)
        && /Source\/task split visible/i.test(graphExitReport)
        && /Task remains visible after source scroll/i.test(graphExitReport)
        && /Advisory card distinct/i.test(routeCopyReport)
        && /End-check card distinct/i.test(routeCopyReport),
      [
        paths.graphCheckReport,
        paths.graphExitReport,
        paths.routeCopyReport,
      ],
      'Visual QA report only verifies labels, screenshots, or file existence'
    ),
    checkItem(
      'student_experience_judgement_required',
      'Pre-gate lead review must include student-experience judgement',
      rubric.includes('typical 4 vwo student')
        && rubric.includes('orient, act, receive feedback, and know the next action')
        && reset.quality_log.some((item) => /student|five-minute|human-readable/i.test(`${item.issue} ${item.proof_required}`)),
      [
        `${paths.rubric}: student experience row`,
        `${paths.resetFindings}: review lab/five-minute walkthrough finding`,
      ],
      'Future lead review can pass from validators/screenshots without product-end-state judgement'
    ),
  ];

  const authority = authorityBoundary(graphCheck, graphExit, routeCopy);
  const authorityOk = Object.values(authority).every((value) => value === false);
  checks.push(checkItem(
    'authority_boundary_preserved',
    'Authority boundary remains false across source proofs',
    authorityOk,
    ['graph-check, graph-exit, and route-copy authority blocks remain false'],
    'Any proof broadens product adoption, completion language, diagnostics, mastery, PV, Scale Gate, or student use'
  ));

  const findings = ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5'];
  const resetFindingsAddressed = findings.map((id) => {
    const finding = (reset.findings || []).find((item) => item.id === id);
    const related = {
      'CSR1-F1': ['short_graph_table_interaction'],
      'CSR1-F2': ['short_context_and_workspace'],
      'CSR1-F3': ['exit_split_workspace', 'exit_graph_workspace_and_line', 'exit_source_scroll_preserves_task'],
      'CSR1-F4': ['screenshot_dom_facts', 'reports_go_beyond_label_hygiene'],
      'CSR1-F5': ['student_experience_judgement_required'],
    }[id] || [];
    return {
      id,
      title: finding ? finding.title : 'unknown',
      status: related.every((checkId) => checks.find((item) => item.id === checkId && item.status === 'pass')) ? 'guarded' : 'unguarded',
      guard_checks: related,
    };
  });

  const status = checks.every((item) => item.status === 'pass')
    && resetFindingsAddressed.every((item) => item.status === 'guarded')
    ? 'complete'
    : 'failed';

  const proof = {
    schema_version: 1,
    sprint_id: 'VISUAL-QA-HARDEN-2',
    generated: new Date().toISOString(),
    status,
    authority,
    source_sprints: [
      'CHECKSURFACE-RESET-1',
      'GRAPH-CHECK-UX-1',
      'GRAPH-EXIT-UX-1',
      'CHECK-ROUTE-COPY-1',
    ],
    checks,
    reset_findings_addressed: resetFindingsAddressed,
    student_experience_judgement: {
      status: 'prepared_for_CHECK-SURFACE-PREGATE-1',
      required: true,
      judgement:
        'A typical 4 vwo student must be able to orient, perform the graph/table action, read targeted feedback, and know the next action before the retry gate can be requested.',
    },
    next_action: 'CHECK-SURFACE-PREGATE-1',
  };

  fs.writeFileSync(absolute(paths.proofOut), `${JSON.stringify(proof, null, 2)}\n`);

  const rows = checks.map((item) => `| ${item.id} | ${item.status} | ${item.label} |`).join('\n');
  const resetRows = resetFindingsAddressed
    .map((item) => `| ${item.id} | ${item.status} | ${item.guard_checks.join(', ')} |`)
    .join('\n');
  const report = `# VISUAL-QA-HARDEN-2 Product QA Report

Generated: 2026-06-05

## Status

${status === 'complete' ? 'PASS.' : 'FAIL.'}

## Scope

This report consolidates visual/product QA for the repaired first-three Check
surface evidence. It prepares CHECK-SURFACE-PREGATE-1; it does not close or
retry the human gate.

## Hard-Fail Checks

| Check | Status | Meaning |
|---|---|---|
${rows}

## Reset Findings Guarded

| Reset finding | Status | Guard checks |
|---|---|---|
${resetRows}

## Student-Experience Judgement Requirement

Before the retry gate, CHECK-SURFACE-PREGATE-1 must judge whether a typical
4 vwo student can:

- see why Korte check and Exit ticket are different;
- use graph/table context for 1.1.3;
- draw or inspect the graph in the task workspace;
- receive targeted feedback instead of generic screenshot proof;
- know the next useful action.

## Authority Boundary

Product-route adoption, new completion language, diagnostics,
mastery/sequencing, PV, Scale Gate 1, and student/product use remain
unauthorized.

## Next Action

Proceed to CHECK-SURFACE-PREGATE-1 only after this report, proof JSON, and
checker pass and are pushed.
`;
  fs.writeFileSync(absolute(paths.reportOut), report);

  if (status !== 'complete') {
    const failed = checks.filter((item) => item.status !== 'pass').map((item) => item.id).join(', ');
    throw new Error(`VISUAL-QA-HARDEN-2 proof failed: ${failed}`);
  }

  console.log(`Wrote ${paths.proofOut}`);
  console.log(`Wrote ${paths.reportOut}`);
}

main();
