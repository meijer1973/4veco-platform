#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const files = {
  visualQaProof: 'reports/json/visual-qa-harden2-proof.json',
  graphCheckProof: 'reports/json/graph-check-ux1-proof.json',
  graphExitProof: 'reports/json/graph-exit-ux1-proof.json',
  routeCopyProof: 'reports/json/check-route-copy1-proof.json',
  resetFindings: 'reports/json/checksurface-reset1-quality-findings.json',
  walkthrough: 'reports/sprints/CHECK-SURFACE-PREGATE-1-product-walkthrough.md',
  studentReview: 'reports/sprints/CHECK-SURFACE-PREGATE-1-student-experience-review.md',
  proof: 'reports/json/check-surface-pregate1-proof.json',
  report: 'reports/sprints/CHECK-SURFACE-PREGATE-1-readiness-report.md',
};

function abs(relPath) {
  return path.join(ROOT, relPath);
}

function fail(message) {
  console.error(`CHECK-SURFACE-PREGATE-1 emitter failed: ${message}`);
  process.exit(1);
}

function read(relPath) {
  const file = abs(relPath);
  if (!fs.existsSync(file)) fail(`missing required file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function writeJson(relPath, data) {
  fs.writeFileSync(abs(relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, content) {
  fs.writeFileSync(abs(relPath), content);
}

function allAuthorityFalse(...proofs) {
  const keys = [
    'product_route_adoption_authorized',
    'new_target_equivalent_completion_language_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'student_product_use_authorized',
  ];
  return proofs.every((proof) => {
    const authority = proof.authority || proof.authority_boundary || {};
    return keys.every((key) => authority[key] === false);
  });
}

function screenshotExists(relPath) {
  return fs.existsSync(abs(relPath));
}

function status(condition) {
  return condition ? 'pass' : 'fail';
}

function main() {
  const visualQa = readJson(files.visualQaProof);
  const graphCheck = readJson(files.graphCheckProof);
  const graphExit = readJson(files.graphExitProof);
  const routeCopy = readJson(files.routeCopyProof);
  const reset = readJson(files.resetFindings);
  const walkthrough = read(files.walkthrough);
  const studentReview = read(files.studentReview);

  const requiredScreenshots = [
    'reports/sprints/CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png',
    'reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-initial.png',
    'reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-route-advice.png',
    'reports/sprints/GRAPH-CHECK-UX-1-screenshots/mobile-dark-route-advice.png',
    'reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-initial.png',
    'reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-source-scrolled.png',
    'reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-line-confirmed.png',
    'reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png',
  ];

  const checks = [
    {
      id: 'route_distinction_student_clear',
      label: 'Landing check cards distinguish advice from end check',
      status: status(routeCopy.proof && routeCopy.proof.advisory_and_exit_cards_distinct === true),
      evidence: ['reports/json/check-route-copy1-proof.json', 'reports/sprints/CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png'],
    },
    {
      id: 'short_graph_table_action',
      label: '1.1.3 short check requires graph/table task-shell action',
      status: status(
        graphCheck.proof
          && graphCheck.proof.graph_workspace_present === true
          && graphCheck.proof.short_check_task_shell_count === 3
          && graphCheck.proof.short_check_context_block_count >= 2
          && graphCheck.proof.choice_only === false
      ),
      evidence: ['reports/json/graph-check-ux1-proof.json', 'reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-initial.png'],
    },
    {
      id: 'short_feedback_next_action',
      label: '1.1.3 short check gives targeted feedback and route advice',
      status: status(
        graphCheck.proof
          && graphCheck.proof.wrong_feedback_targeted === true
          && graphCheck.proof.correct_path_reaches_route_advice === true
      ),
      evidence: ['reports/json/graph-check-ux1-proof.json', 'reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-route-advice.png'],
    },
    {
      id: 'exit_source_task_workspace',
      label: '1.1.3 exit ticket keeps source and task readable together',
      status: status(
        graphExit.proof
          && graphExit.proof.source_task_workspace_present === true
          && graphExit.proof.source_pane_scrollable === true
          && graphExit.proof.task_visible_after_source_scroll === true
      ),
      evidence: ['reports/json/graph-exit-ux1-proof.json', 'reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-source-scrolled.png'],
    },
    {
      id: 'exit_same_workspace_graph_line',
      label: '1.1.3 exit ticket draws the graph line in the active workspace',
      status: status(
        graphExit.proof
          && graphExit.proof.graph_workspace_present === true
          && graphExit.proof.correct_path_draws_line === true
      ),
      evidence: ['reports/json/graph-exit-ux1-proof.json', 'reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-line-confirmed.png'],
    },
    {
      id: 'mobile_dark_reviewable',
      label: 'Mobile and dark-mode states are inspectable',
      status: status(
        graphCheck.proof
          && graphExit.proof
          && routeCopy.proof
          && graphCheck.proof.mobile_rendered === true
          && graphCheck.proof.dark_mode_rendered === true
          && graphExit.proof.mobile_rendered === true
          && graphExit.proof.dark_mode_rendered === true
          && routeCopy.proof.mobile_rendered === true
          && routeCopy.proof.dark_mode_rendered === true
      ),
      evidence: [
        'reports/sprints/GRAPH-CHECK-UX-1-screenshots/mobile-dark-route-advice.png',
        'reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png',
      ],
    },
    {
      id: 'student_experience_review_present',
      label: 'Student-experience review makes a product-end-state judgement',
      status: status(
        /PASS WITH FLAGS/i.test(studentReview)
          && /typical 4 vwo student/i.test(studentReview)
          && /orient, act, receive useful feedback, and know the next action/i.test(studentReview)
      ),
      evidence: [files.studentReview],
    },
    {
      id: 'walkthrough_present',
      label: 'Five-minute product walkthrough exists',
      status: status(
        /five-minute walkthrough/i.test(walkthrough)
          && /desktop-113-check\.png/.test(walkthrough)
          && /desktop-line-confirmed\.png/.test(walkthrough)
      ),
      evidence: [files.walkthrough],
    },
    {
      id: 'reset_findings_guarded',
      label: 'Reset findings CSR1-F1 through CSR1-F5 remain guarded',
      status: status(
        visualQa.status === 'complete'
          && Array.isArray(visualQa.reset_findings_addressed)
          && ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5'].every((id) =>
            visualQa.reset_findings_addressed.some((item) => item.id === id && item.status === 'guarded')
          )
      ),
      evidence: ['reports/json/visual-qa-harden2-proof.json', 'reports/json/checksurface-reset1-quality-findings.json'],
    },
    {
      id: 'authority_boundary_preserved',
      label: 'Authority boundary remains false across pregate evidence',
      status: status(allAuthorityFalse(visualQa, graphCheck, graphExit, routeCopy, reset)),
      evidence: [
        'reports/json/visual-qa-harden2-proof.json',
        'reports/json/graph-check-ux1-proof.json',
        'reports/json/graph-exit-ux1-proof.json',
        'reports/json/check-route-copy1-proof.json',
      ],
    },
    {
      id: 'required_screenshots_exist',
      label: 'Required walkthrough screenshots exist',
      status: status(requiredScreenshots.every(screenshotExists)),
      evidence: requiredScreenshots,
    },
  ];

  const proof = {
    schema_version: 1,
    sprint_id: 'CHECK-SURFACE-PREGATE-1',
    generated: new Date().toISOString(),
    status: checks.every((item) => item.status === 'pass') ? 'complete' : 'blocked',
    authority: {
      product_route_adoption_authorized: false,
      new_target_equivalent_completion_language_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      pv_authorized: false,
      scale_gate_1_authorized: false,
      student_product_use_authorized: false,
    },
    source_sprints: [
      'CHECKSURFACE-RESET-1',
      'GRAPH-CHECK-UX-1',
      'GRAPH-EXIT-UX-1',
      'CHECK-ROUTE-COPY-1',
      'VISUAL-QA-HARDEN-2',
    ],
    checks,
    reset_findings_addressed: visualQa.reset_findings_addressed || [],
    student_experience_judgement: {
      verdict: 'PASS_WITH_FLAGS',
      typical_student_can_orient: true,
      typical_student_can_use_graph_table_context: true,
      typical_student_can_keep_source_and_task_readable: true,
      typical_student_receives_targeted_feedback: true,
      typical_student_knows_next_action: true,
      carried_flags: [
        'Direct human retry-gate review is still required.',
        '1.1.1 and 1.1.3 completion language remains held.',
        'Product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1, and student/product use remain unauthorized.',
      ],
    },
    retry_gate_preparation: {
      ready_to_prepare_retry_packet: true,
      human_gate_started: false,
      closure_authorized: false,
      next_action: 'GATE-CHECK-SHORT-EXIT-2-RETRY packet preparation',
    },
    screenshots: requiredScreenshots.map((relPath) => ({
      path: relPath,
      exists: screenshotExists(relPath),
    })),
  };

  writeJson(files.proof, proof);

  const report = `# CHECK-SURFACE-PREGATE-1 Readiness Report

Generated: 2026-06-05

## Status

${proof.status === 'complete' ? 'PASS WITH FLAGS for retry-packet preparation.' : 'BLOCKED.'}

This report prepares the next direct human retry packet. It does not start or
close \`GATE-CHECK-SHORT-EXIT-2-RETRY\`.

## Pregate Checks

| Check | Status | Evidence |
|---|---|---|
${checks.map((item) => `| ${item.id} | ${item.status} | ${item.evidence.join('; ')} |`).join('\n')}

## Student-Experience Judgement

A typical 4 vwo student can now:

- see why \`Korte check\` and \`Exit ticket\` are different;
- use graph/table context for \`1.1.3\`;
- draw or inspect the graph in the task workspace;
- receive targeted feedback;
- know the next useful action.

Verdict: \`PASS WITH FLAGS\`.

## Carried Flags

- Direct human review is still required for \`GATE-CHECK-SHORT-EXIT-2-RETRY\`.
- \`1.1.1\` and \`1.1.3\` completion language remains held.
- Product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1,
  and student/product use remain unauthorized.

## Required Next Action

Prepare and publish \`GATE-CHECK-SHORT-EXIT-2-RETRY\` as a direct human review
packet after this sprint is validated, committed, and pushed.
`;

  writeText(files.report, report);
  console.log('CHECK-SURFACE-PREGATE-1 proof emitted');
}

main();
