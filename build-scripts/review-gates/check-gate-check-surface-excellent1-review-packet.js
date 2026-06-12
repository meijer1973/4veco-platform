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

function requireReviewArtifactState(packet) {
  const closureRecorded =
    packet.gate_closed === true ||
    packet.status === 'closed_pass_with_flags_no_downstream_authority';
  const proposalStarted =
    closureRecorded ||
    packet.closure_proposal_started === true ||
    packet.status === 'closure_proposal_ready_pass_with_flags_not_closed';

  const closureArtifacts = ['gate-closure.md', 'gate-closure.json'];
  if (closureRecorded) {
    for (const name of closureArtifacts) {
      assert(fs.existsSync(path.join(GATE_DIR, name)), `${name} must exist after explicit gate closure confirmation`);
    }
  } else {
    for (const name of closureArtifacts) {
      assert(!fs.existsSync(path.join(GATE_DIR, name)), `${name} must not exist before explicit gate closure authorization`);
    }
  }

  const reviewArtifacts = [
    'direct-review-comments.md',
    'direct-review-comments.json',
    'comment-resolution-log.md',
    'comment-resolution-log.json',
  ];
  if (packet.human_review_comments_started === true) {
    for (const name of reviewArtifacts) {
      assert(fs.existsSync(path.join(GATE_DIR, name)), `${name} must exist after human review comments are recorded`);
    }
    const commentsText = read(`reports/review-gates/${GATE_ID}/direct-review-comments.md`);
    const comments = readJson(`reports/review-gates/${GATE_ID}/direct-review-comments.json`);
    const resolutionText = read(`reports/review-gates/${GATE_ID}/comment-resolution-log.md`);
    const resolution = readJson(`reports/review-gates/${GATE_ID}/comment-resolution-log.json`);
    assert(comments.gate_direction === 'hold_for_surface_repair', 'direct comments must record hold_for_surface_repair');
    assert(comments.human_review_decision === 'hold_for_surface_repair', 'direct comments must record the human review decision');
    assert(Array.isArray(comments.findings) && comments.findings.length === 12, 'direct comments must record twelve CHECKSURFACE findings');
    assert(resolution.gate_direction === 'hold_for_surface_repair', 'resolution log must preserve held gate direction');
    assert(resolution.gate_closed === false, 'resolution log must keep the gate open');
    assert(resolution.closure_artifacts_authorized === false, 'resolution log must not authorize closure artifacts');
    for (let i = 1; i <= 12; i += 1) {
      const id = `CHECKSURFACE-Q${i}`;
      assert(commentsText.includes(id), `direct comments markdown missing ${id}`);
      assert(resolutionText.includes(id), `resolution log markdown missing ${id}`);
      const finding = comments.findings.find((item) => item.id === id);
      assert(finding, `direct comments JSON missing ${id}`);
      assert(finding.classification, `${id} must include a classification`);
      assert(Array.isArray(finding.blocks), `${id} must include blocks`);
      assert(Array.isArray(finding.does_not_block), `${id} must include does_not_block`);
      assert(finding.proof_required_to_close, `${id} must include proof_required_to_close`);
    }
  } else {
    for (const name of reviewArtifacts) {
      assert(!fs.existsSync(path.join(GATE_DIR, name)), `${name} must not exist before human comments`);
    }
  }

  const proposalArtifacts = [
    'renewed-review-comments.md',
    'renewed-review-comments.json',
    'closure-proposal.md',
    'closure-proposal.json',
  ];
  if (proposalStarted) {
    for (const name of proposalArtifacts) {
      assert(fs.existsSync(path.join(GATE_DIR, name)), `${name} must exist after renewed pass-with-flags review`);
    }
    const renewedText = read(`reports/review-gates/${GATE_ID}/renewed-review-comments.md`);
    const renewed = readJson(`reports/review-gates/${GATE_ID}/renewed-review-comments.json`);
    const proposalText = read(`reports/review-gates/${GATE_ID}/closure-proposal.md`);
    const proposal = readJson(`reports/review-gates/${GATE_ID}/closure-proposal.json`);

    assert(renewed.gate_direction === 'pass_with_flags', 'renewed review must record pass_with_flags');
    assert(renewed.human_review_decision === 'pass_with_flags', 'renewed comments must record pass_with_flags');
    assert(renewed.no_active_core_spec_failure_for_this_gate === true, 'renewed comments must clear active core failures for this gate');
    assert(renewed.gate_closed === false, 'renewed comments must keep the gate open');
    assert(renewed.closure_artifacts_authorized === false, 'renewed comments must not authorize closure artifacts');
    assert(Array.isArray(renewed.findings) && renewed.findings.length === 12, 'renewed comments must record twelve CHECKSURFACE findings');
    for (let i = 1; i <= 12; i += 1) {
      const id = `CHECKSURFACE-Q${i}`;
      assert(renewedText.includes(id), `renewed comments markdown missing ${id}`);
      const finding = renewed.findings.find((item) => item.id === id);
      assert(finding, `renewed comments JSON missing ${id}`);
      assert(finding.classification, `${id} renewed finding must include a classification`);
      assert(Array.isArray(finding.blocks), `${id} renewed finding must include blocks`);
      assert(Array.isArray(finding.does_not_block), `${id} renewed finding must include does_not_block`);
      assert(finding.proof_required_to_close, `${id} renewed finding must include proof_required_to_close`);
    }
    for (const id of ['CF-1', 'CF-2', 'CF-3']) {
      const flag = renewed.carried_flags && renewed.carried_flags.find((item) => item.id === id);
      assert(flag, `renewed comments missing carried flag ${id}`);
      assert(flag.classification, `${id} must include classification`);
      assert(Array.isArray(flag.blocks), `${id} must include blocks`);
      assert(Array.isArray(flag.does_not_block), `${id} must include does_not_block`);
      assert(flag.proof_required_to_close, `${id} must include proof_required_to_close`);
    }

    assert(proposal.gate_direction === 'pass_with_flags', 'closure proposal must preserve pass_with_flags');
    assert(proposal.renewed_human_review_decision === 'pass_with_flags', 'closure proposal must cite renewed decision');
    assert(proposal.no_active_core_spec_failure_for_this_gate === true, 'closure proposal must record no active core failure');
    assert(proposal.gate_closed === false, 'closure proposal must keep the gate open');
    assert(proposal.gate_closure_artifacts_authorized === false, 'closure proposal must not authorize closure artifacts');
    assert(proposal.explicit_human_confirmation_required === true, 'closure proposal must require explicit human confirmation');
    assert(proposal.authority && proposal.authority.product_route_adoption_authorized === false, 'closure proposal must not authorize product route');
    assert(proposal.authority.scale_gate_1_authorized === false, 'closure proposal must not authorize Scale Gate 1');
    requireText(proposalText, 'Renewed direct human review returned: `pass_with_flags`', 'renewed decision', 'closure-proposal.md');
    requireText(proposalText, 'No active `core_spec_failure` remains', 'core failure clearance', 'closure-proposal.md');
    requireText(proposalText, '`gate-closure.md/json`', 'gate closure artifact hold', 'closure-proposal.md');
  } else {
    for (const name of proposalArtifacts) {
      assert(!fs.existsSync(path.join(GATE_DIR, name)), `${name} must not exist before renewed pass-with-flags review`);
    }
  }

  if (closureRecorded) {
    const closureText = read(`reports/review-gates/${GATE_ID}/gate-closure.md`);
    const closure = readJson(`reports/review-gates/${GATE_ID}/gate-closure.json`);
    assert(closure.gate_direction === 'pass_with_flags', 'gate closure must preserve pass_with_flags');
    assert(closure.gate_closed === true, 'gate closure must mark this gate closed');
    assert(closure.human_confirmation_received === true, 'gate closure must cite explicit human confirmation');
    assert(closure.no_active_core_spec_failure_for_this_gate === true, 'gate closure must record no active core failure');
    assert(closure.scope === 'first-three check-surface evidence only', 'gate closure scope must stay narrow');
    assert(closure.authority && closure.authority.product_route_adoption_authorized === false, 'gate closure must not authorize product route');
    assert(closure.authority.new_target_equivalent_completion_language_authorized === false, 'gate closure must not authorize completion language');
    assert(closure.authority.diagnostics_authorized === false, 'gate closure must not authorize diagnostics');
    assert(closure.authority.mastery_or_sequencing_authorized === false, 'gate closure must not authorize mastery or sequencing');
    assert(closure.authority.pv_authorized === false, 'gate closure must not authorize PV');
    assert(closure.authority.scale_gate_1_authorized === false, 'gate closure must not authorize Scale Gate 1');
    assert(closure.authority.student_product_use_authorized === false, 'gate closure must not authorize student/product use');
    for (const id of ['CF-1', 'CF-2', 'CF-3']) {
      const flag = closure.carried_flags && closure.carried_flags.find((item) => item.id === id);
      assert(flag, `gate closure missing carried flag ${id}`);
      assert(flag.classification, `${id} closure flag must include classification`);
      assert(Array.isArray(flag.blocks), `${id} closure flag must include blocks`);
      assert(Array.isArray(flag.does_not_block), `${id} closure flag must include does_not_block`);
      assert(flag.proof_required_to_close, `${id} closure flag must include proof_required_to_close`);
    }
    requireText(closureText, 'Status: closed with carried flags', 'closure status', 'gate-closure.md');
    requireText(closureText, 'first-three check-surface evidence only', 'narrow closure scope', 'gate-closure.md');
    requireText(closureText, 'No active `core_spec_failure` remains', 'core failure clearance', 'gate-closure.md');
    requireText(closureText, 'remain unauthorized', 'downstream authority hold', 'gate-closure.md');
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
    '## Non-Negotiable Requirements',
    '## Core-Requirement Checklist',
    '## Finding Classification Rule',
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
    '../4veco-lessen/specifications/product-end-state.md',
    'reports/sprints/CHECK-SHORT-EXIT-2-plan.md',
    'Non-Negotiable Requirements',
    'Core-Requirement Checklist',
    'core_spec_failure',
    'proof required to close',
    'Shared Task And Check-Surface Integrity Policy',
    'checksurface-policy-regression1-proof.json',
    'smoothie',
    'procedure/flowchart context',
    'interval-halving task includes plausible incorrect intervals',
    'Golden Workbench transfer holds target-equivalent readiness',
    'does not authorize product-route adoption',
    'Renewed direct human review returned: pass_with_flags',
    'No active core_spec_failure remains',
    'Gate closure confirmed',
    'explicit human confirmation',
  ]) {
    requireText(text, phrase, `phrase ${phrase}`, file);
  }
  rejectText(text, /gate closes|gate is closed|Scale Gate 1 authorized|student\/product use is authorized/i, 'premature closure or authority', file);
}

function requirePacketJson(packet, live) {
  assert(packet.gate_id === GATE_ID, 'packet gate id mismatch');
  assert(live.gate_id === GATE_ID, 'live evidence gate id mismatch');
  assert(
    [
      'renewed_review_packet_ready_not_reviewed_not_closed',
      'direct_review_returned_hold_for_surface_repair_not_closed',
      'closure_proposal_ready_pass_with_flags_not_closed',
      'closed_pass_with_flags_no_downstream_authority',
    ].includes(packet.status),
    'packet status mismatch'
  );
  assert(packet.supersedes === 'GATE-CHECK-SHORT-EXIT-2-RETRY-first-three-check-surfaces-review', 'packet must supersede old retry packet');
  const closureRecorded =
    packet.gate_closed === true ||
    packet.status === 'closed_pass_with_flags_no_downstream_authority';
  const proposalStarted =
    closureRecorded ||
    packet.closure_proposal_started === true ||
    packet.status === 'closure_proposal_ready_pass_with_flags_not_closed';
  if (closureRecorded) {
    assert(packet.human_review_comments_started === true, 'gate closure requires human comments');
    assert(packet.human_review_decision === 'pass_with_flags', 'latest human review decision must record pass_with_flags');
    assert(packet.gate_direction === 'pass_with_flags', 'latest gate direction must record pass_with_flags');
    assert(packet.gate_closure_authorized === true, 'gate closure must be authorized after explicit confirmation');
    assert(packet.confirmed_gate_closure && packet.confirmed_gate_closure.human_confirmation_received === true, 'packet must record explicit closure confirmation');
    assert(packet.confirmed_gate_closure.gate_closed === true, 'packet must record gate closure');
    assert(packet.confirmed_gate_closure.no_active_core_spec_failure_for_this_gate === true, 'packet must record no active core failure at closure');
  } else if (proposalStarted) {
    assert(packet.human_review_comments_started === true, 'closure proposal requires human comments');
    assert(packet.human_review_decision === 'pass_with_flags', 'latest human review decision must record pass_with_flags');
    assert(packet.gate_direction === 'pass_with_flags', 'latest gate direction must record pass_with_flags');
    assert(packet.renewed_human_review && packet.renewed_human_review.no_active_core_spec_failure_for_this_gate === true, 'packet must record no active core failure after renewed review');
    assert(packet.gate_closure_authorized === false, 'closure proposal must not authorize gate closure');
  } else if (packet.human_review_comments_started === true) {
    assert(packet.human_review_decision === 'hold_for_surface_repair', 'human review decision must record hold_for_surface_repair');
    assert(packet.gate_direction === 'hold_for_surface_repair', 'packet gate direction must record hold_for_surface_repair');
  } else {
    assert(packet.human_review_decision === null, 'human review decision must be null before comments');
  }
  assert(packet.gate_closure_authorized === closureRecorded, 'gate closure authorization must match recorded closure state');
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required');
  assert(
    packet.required_baselines &&
      packet.required_baselines.product_end_state === '../4veco-lessen/specifications/product-end-state.md',
    'packet must require product-end-state baseline'
  );
  assert(
    packet.required_baselines.original_sprint_spec === 'reports/sprints/CHECK-SHORT-EXIT-2-plan.md',
    'packet must require original sprint spec'
  );
  assert(
    Array.isArray(packet.non_negotiable_requirements) && packet.non_negotiable_requirements.length >= 6,
    'packet must list non-negotiable requirements'
  );
  assert(
    Array.isArray(packet.core_requirement_checklist) && packet.core_requirement_checklist.length >= 6,
    'packet must include core requirement checklist'
  );
  assert(Array.isArray(packet.finding_classifications), 'packet must include finding classifications');
  for (const classification of [
    'core_requirement_met',
    'quality_improvement_available',
    'minor_carry_flag',
    'scale_blocker',
    'core_spec_failure',
  ]) {
    assert(packet.finding_classifications.includes(classification), `packet missing finding classification ${classification}`);
  }
  for (const source of [
    '../4veco-lessen/specifications/product-end-state.md',
    '../4veco-lessen/specifications/companion-core-specifications.md',
    'reports/sprints/CHECK-SHORT-EXIT-2-plan.md',
    'reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md',
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
  assert(
    [
      'renewed_packet_ready_not_reviewed_not_closed',
      'evidence_refresh_repair_ready_for_re_review_not_closed',
      'renewed_review_pass_with_flags_closure_proposal_ready_not_closed',
      'gate_closed_pass_with_flags_no_downstream_authority',
    ].includes(live.status),
    'live status mismatch'
  );
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
  assert(surfaces['1.1.3-exit'].context_block_count === 2, '1.1.3 exit proof must record current source/table context only');
  assert(
    surfaces['1.1.3-exit'].context_ids.join(',') === 'ctx-stationbroodjes-source,ctx-stationbroodjes-table',
    '1.1.3 exit proof must record current station bread-stall context ids'
  );
  assert(surfaces['1.1.3-exit'].percentage_claim_control === true, '1.1.3 exit proof must include percentage claim control');
  assert(surfaces['1.1.3-exit'].formula_builder_present === true, '1.1.3 exit proof must include formula builder evidence');
  assert(surfaces['1.1.3-exit'].source_text_current === true, '1.1.3 exit proof must not carry stale IJskraam copy');
  assert(checkShortExit.proof.current_112_transfer_held === true, 'check-short-exit2 proof must record current 1.1.2 Golden Workbench transfer as held');
  assert(graphCheck.proof.graph_workspace_present === true, 'graph short check workspace must exist');
  assert(graphCheck.proof.choice_only === false, 'graph short check must not be choice-only');
  assert(graphExit.proof.source_task_workspace_present === true, 'graph exit source/task workspace must exist');
  assert(graphExit.proof.correct_path_draws_line === true, 'graph exit must draw line');
  assert(graphExit.proof.percentage_claim_control_present === true, 'graph exit must include percentage claim control');
  assert(graphExit.proof.current_context_blocks === 'ctx-stationbroodjes-source,ctx-stationbroodjes-table', 'graph exit proof must record current context ids');
  assert(graphExit.proof.current_source_text_confirmed === true, 'graph exit proof must confirm current source text');
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
    'current_112_transfer_held',
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
  assert(data113Exit.contextBlocks.length === 2, '1.1.3 exit must have source and table context only');
  assert(data113Exit.contextBlocks.some((block) => block.id === 'ctx-stationbroodjes-source'), '1.1.3 exit must include source context');
  assert(data113Exit.contextBlocks.some((block) => block.id === 'ctx-stationbroodjes-table'), '1.1.3 exit must include table context');
  assert(!data113Exit.contextBlocks.some((block) => /procedure|flowchart/i.test(JSON.stringify(block))), '1.1.3 exit must not include procedure context');
  assert(data113Exit.tasks.some((task) => task.taskShell && task.taskShell.interaction.hideAxisLabelsUntilAxisSelection === true), '1.1.3 exit must delay axis labels');
  const interval = data113Exit.tasks
    .map((task) => task.taskShell)
    .find(
      (task) =>
        task &&
        task.interaction &&
        ['interval_halving_check', 'percentage_claim_control'].includes(task.interaction.selectionMode)
    );
  assert(interval, '1.1.3 exit must include interval/percentage-claim control task');
  assert(interval.interaction.intervalOptions.some((option) => option.correct === false), 'interval task must include distractor intervals');
  assert(interval.interaction.conclusionOptions.some((option) => option.correct === false), 'interval task must include distractor conclusions');
  assert(data113Exit.targetEquivalent.completionLanguageEligible === false, '1.1.3 completion language must remain held');
  assert(data112Exit.targetEquivalent.candidate === true, '1.1.2 transfer must remain a target-equivalent candidate');
  assert(data112Exit.targetEquivalent.gateApproved === false, '1.1.2 Golden Workbench transfer must remain unapproved');
  assert(data112Exit.targetEquivalent.completionLanguageEligible === false, '1.1.2 Golden Workbench completion language must remain held');
  assert(
    JSON.stringify(data112Exit).includes('Golden Workbench transfer holds target-equivalent readiness and completion language pending review'),
    '1.1.2 source data must record the current Golden Workbench hold'
  );
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
  const required = ['review-packet.md', 'review-packet.json', 'live-output-evidence.md', 'live-output-evidence.json', 'review-lab.html'];
  for (const name of [
    'renewed-review-comments.md',
    'renewed-review-comments.json',
    'closure-proposal.md',
    'closure-proposal.json',
    'gate-closure.md',
    'gate-closure.json',
  ]) {
    if (fs.existsSync(path.join(GATE_DIR, name))) required.push(name);
  }
  for (const name of required) {
    requireText(text, name, `bundle URL for ${name}`, 'bundle-urls.md');
  }
}

function main() {
  assert(fs.existsSync(GATE_DIR), `missing gate dir ${GATE_DIR}`);
  const packet = readJson(`reports/review-gates/${GATE_ID}/review-packet.json`);
  const live = readJson(`reports/review-gates/${GATE_ID}/live-output-evidence.json`);
  requireReviewArtifactState(packet);
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
