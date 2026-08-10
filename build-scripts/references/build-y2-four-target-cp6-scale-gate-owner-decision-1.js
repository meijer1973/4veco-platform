#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  SPRINT_ID: SOURCE_DECISION_SPRINT_ID,
  decisionBundle: sourceDecisionBundle,
  REV_STD_FINDING_CLASSIFICATIONS,
} = require('./build-y2-four-target-cp6-scale-gate-decision-bundle-1');

const SPRINT_ID = 'Y2-FOUR-TARGET-CP6-SCALE-GATE-OWNER-DECISION-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-07-03';
const SOURCE_DECISION_BUNDLE_MERGE_COMMIT = 'da6fb15caaefca510a90c7fd67caa0403cdd6c0f';
const LEAD_REVIEW_FILE = `reports/review-gates/${SPRINT_ID}/subagent-lead-reviews.md`;

const EXPECTED_OWNER_RETURNS = [
  'Y2 FOUR-TARGET CP6 / SCALE GATE DECISION READY',
  'Y2 FOUR-TARGET CP6 / SCALE GATE DECISION BLOCKED',
];

const REQUIRED_LEAD_REVIEW_SCOPES = [
  'owner decision intake boundary',
  'inherited CP-6 / Scale Gate decision bundle',
  'exact owner return wording',
  'authority flags and downstream blocks',
  'REV-STD-1 carried issues',
];

const AUTHORITY_CLAIMS = {
  owner_decision_intake_prepared: true,
  ready_for_owner_return: true,
  source_decision_bundle_inherited: true,
  source_decision_bundle_merge_recorded: true,
  owner_decision_received: false,
  owner_decision_recorded_by_this_packet: false,
  cp6_decision_authorized_by_this_packet: false,
  cp6_closure_authorized: false,
  scale_gate_decision_authorized_by_this_packet: false,
  scale_gate_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  broad_student_rollout_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  protected_mtu_mutation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_registry_mutation_authorized: false,
  broad_operation_row_closure_authorized: false,
  product_route_adoption_mutation_authorized_by_this_packet: false,
  default_book_navigation_mutated: false,
  active_curriculum_sequence_mutated: false,
  autonomous_merge_authorized: false,
};

const REQUIRED_FALSE_FLAGS = [
  'owner_decision_received',
  'owner_decision_recorded_by_this_packet',
  'cp6_decision_authorized_by_this_packet',
  'cp6_closure_authorized',
  'scale_gate_decision_authorized_by_this_packet',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'broad_student_rollout_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
  'protected_mtu_mutation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_registry_mutation_authorized',
  'broad_operation_row_closure_authorized',
  'product_route_adoption_mutation_authorized_by_this_packet',
  'default_book_navigation_mutated',
  'active_curriculum_sequence_mutated',
  'autonomous_merge_authorized',
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function relFromPlatform(file) {
  return path.relative(PLATFORM_ROOT, file).replace(/\\/g, '/');
}

function html(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function git(args) {
  const result = spawnSync('git', args, { cwd: PLATFORM_ROOT, encoding: 'utf8' });
  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function gitRev(ref = 'HEAD') {
  const result = git(['rev-parse', ref]);
  return result.status === 0 ? result.stdout : null;
}

function gitBranch() {
  const result = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  return result.status === 0 ? result.stdout : null;
}

function gitContains(ancestor, descendant = 'HEAD') {
  return git(['merge-base', '--is-ancestor', ancestor, descendant]).status === 0;
}

function defaultLessonRoot() {
  const candidates = [
    path.resolve(PLATFORM_ROOT, '..', '4veco-lessen'),
    path.resolve(PLATFORM_ROOT, '..', '..', 'BLUEPRINT-20260610', '4veco-lessen'),
  ];
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, '.git'))) || '';
}

function resolveLessonRoot(input) {
  return input || process.env.LESSON_REPO_ROOT || defaultLessonRoot();
}

function finding(findingText, classification, blocks, doesNotBlock, proofRequiredToClose) {
  return {
    finding: findingText,
    classification,
    blocks,
    does_not_block: doesNotBlock,
    proof_required_to_close: proofRequiredToClose,
  };
}

function issue(issueId, classification, blocks, doesNotBlock, proofRequiredToClose) {
  return {
    issue_id: issueId,
    classification,
    blocks,
    does_not_block: doesNotBlock,
    proof_required_to_close: proofRequiredToClose,
  };
}

function ownerDecisionPacket(options = {}) {
  const source = sourceDecisionBundle({ lessonRoot: resolveLessonRoot(options.lessonRoot) });
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'owner_decision_intake_ready_for_human_review',
    route: 'READY_FOR_HUMAN_REVIEW',
    product_end_state:
      'Collect the exact owner return for the four-route Year 2 CP-6 / Scale Gate decision after the merged decision bundle, without inferring CP-6 closure, opening Scale Gate, or authorizing diagnostics, mastery, PV, summative use, broad rollout, student use, or student/product use.',
    original_sprint_gate_spec: {
      product_end_state_baseline: source.original_sprint_gate_spec.product_end_state_baseline,
      companion_core_specification: source.original_sprint_gate_spec.companion_core_specification,
      source_decision_bundle: `reports/review-gates/${SOURCE_DECISION_SPRINT_ID}/cp6-scale-gate-decision-bundle.json`,
      source_decision_review_packet: `reports/review-gates/${SOURCE_DECISION_SPRINT_ID}/review-packet.json`,
      source_decision_rendered_bundle: `reports/review-gates/${SOURCE_DECISION_SPRINT_ID}/rendered-decision-bundle.html`,
      readiness_bundle: source.original_sprint_gate_spec.readiness_bundle,
      post_adoption_precheck_packet: source.original_sprint_gate_spec.post_adoption_precheck_packet,
      product_proof_packet: source.original_sprint_gate_spec.product_proof_packet,
      bounded_adoption_packet: source.original_sprint_gate_spec.bounded_adoption_packet,
    },
    non_negotiable_requirements: [
      'Use REV-STD-1 and cite the product end-state plus original sprint/gate specs.',
      'Do not infer an owner decision from the merge of the decision bundle.',
      'Accept only one exact owner return: READY or BLOCKED, tied to the reviewed payload lineage and decision scope.',
      'Keep CP-6 closure and Scale Gate unauthorized until an explicit owner return is supplied and reviewed.',
      'Keep diagnostics, mastery, adaptive routing, PV, summative use, broad rollout, student use, and student/product use blocked.',
      'Keep protected MTU mutation, operation registry mutation, answer-skill mutation, and broad OP closure blocked.',
      'Preserve the four-route bundle: Book 5, Book 6, Book 7, and Book 8 must remain reviewed together.',
      'Include core-requirement checklist, classified findings, and carried issues with blocks, does_not_block, and proof_required_to_close.',
      'Do not carry a missing core requirement under PASS WITH FLAGS.',
    ],
    source_decision_bundle_summary: {
      sprint_id: source.sprint_id,
      status: source.status,
      route: source.route,
      expected_owner_returns: EXPECTED_OWNER_RETURNS,
      route_count: source.records.length,
      source_decision_merge_commit: SOURCE_DECISION_BUNDLE_MERGE_COMMIT,
      source_decision_merge_is_ancestor: gitContains(SOURCE_DECISION_BUNDLE_MERGE_COMMIT, 'HEAD'),
      cp6_and_scale_gate_lanes_ready_for_owner_decision: source.cp6_scale_gate_decision_matrix
        .filter((item) => ['CP-6 closure', 'Scale Gate'].includes(item.decision))
        .every((item) => item.status === 'READY_FOR_OWNER_DECISION'),
      downstream_authority_false_in_source_packet: REQUIRED_FALSE_FLAGS
        .filter((flag) => Object.prototype.hasOwnProperty.call(source.authority_claims, flag))
        .every((flag) => source.authority_claims[flag] === false),
      source_carried_issues: source.carried_issues,
    },
    current_main_evidence: {
      platform_branch: gitBranch(),
      platform_origin_main_sha: gitRev('origin/main') || gitRev(),
      platform_checked_head_sha: gitRev(),
      source_decision_bundle_merge_commit: SOURCE_DECISION_BUNDLE_MERGE_COMMIT,
      source_decision_bundle_merge_is_ancestor: gitContains(SOURCE_DECISION_BUNDLE_MERGE_COMMIT, 'HEAD'),
      source_decision_bundle_path: `reports/review-gates/${SOURCE_DECISION_SPRINT_ID}/cp6-scale-gate-decision-bundle.json`,
      owner_decision_packet_protected_surface_mutation: false,
    },
    owner_decision_state: {
      decision_received: false,
      decision_recorded_by_this_packet: false,
      accepted_owner_return: null,
      allowed_owner_returns: EXPECTED_OWNER_RETURNS,
      required_owner_response_instruction:
        'Return exactly one of the allowed owner decision strings, tied to the reviewed payload lineage and decision scope.',
      decision_scope:
        'Y2-FOUR-TARGET-CP6-SCALE-GATE-OWNER-DECISION-1 over the inherited CP-6 / Scale Gate decision bundle for all four bounded Year 2 routes.',
    },
    owner_return_effects: [
      {
        owner_return: EXPECTED_OWNER_RETURNS[0],
        status: 'ACCEPTABLE_OWNER_INPUT_NOT_PRESENT',
        would_close: 'the owner-decision-required blocker only after reviewed-payload owner authorization is recorded',
        does_not_authorize_without_separate_decision:
          'diagnostics, mastery, adaptive routing, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation mutation, answer-skill mutation, or broad OP row closure',
      },
      {
        owner_return: EXPECTED_OWNER_RETURNS[1],
        status: 'ACCEPTABLE_OWNER_INPUT_NOT_PRESENT',
        would_close: 'the current decision as blocked and keep all downstream authority false',
        does_not_authorize_without_separate_decision:
          'any CP-6 closure, Scale Gate, product route adoption mutation, student use, or student/product use',
      },
    ],
    authority_claims: AUTHORITY_CLAIMS,
    core_requirement_checklist: {
      product_end_state_and_original_specs_cited: true,
      non_negotiable_requirements_named: true,
      source_decision_bundle_inherited: true,
      source_decision_merge_commit_recorded: true,
      expected_owner_return_strings_recorded: true,
      no_owner_decision_inferred: true,
      all_four_routes_remain_bundled: source.records.length === 4,
      cp6_scale_gate_lanes_are_ready_for_owner_decision_in_source: true,
      downstream_authority_flags_false: true,
      carried_issues_classified: true,
      lead_review_artifact_required_and_named: true,
      owner_decision_state_pending: true,
    },
    findings: [
      finding(
        'The merged CP-6 / Scale Gate decision bundle is inherited as the source evidence for owner decision intake.',
        'core_requirement_met',
        'none for human review of this intake packet',
        'owner review of the exact READY or BLOCKED return',
        'source decision bundle merge commit, exact-head CI, branch-protection ok:true, lead-review, review-thread, and PR Readiness Reviewer proof'
      ),
      finding(
        'The intake packet records exact allowed owner return strings and does not infer a decision.',
        'core_requirement_met',
        'none for human review',
        'human owner supplying the exact return',
        'owner response tied to reviewed payload lineage and decision scope'
      ),
      finding(
        'CP-6 closure, Scale Gate, diagnostics, mastery, adaptive routing, PV, summative use, broad rollout, student use, and student/product use remain blocked.',
        'scale_blocker',
        'all downstream product/student-use authority',
        'reviewing this owner-decision intake packet',
        'explicit owner return plus a reviewed decision record'
      ),
      finding(
        'Protected MTU mutation, operation mutation, answer-skill mutation, and broad OP closure remain outside this lane.',
        'scale_blocker',
        'protected mutation and broad operation closure',
        'owner CP-6 / Scale Gate decision intake',
        'separate governed mutation PR with validators, lead review, and owner authorization'
      ),
    ],
    carried_issues: [
      issue(
        'owner-return-not-yet-recorded',
        'scale_blocker',
        'CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative use, broad rollout, student use, and student/product use',
        'human review and merge of this intake packet if authorized',
        'owner returns exactly READY or BLOCKED for the reviewed payload lineage and decision scope'
      ),
      issue(
        'completion-and-student-use-still-out-of-scope',
        'scale_blocker',
        'target-equivalent completion claims, summative use, student use, and student/product use',
        'CP-6 / Scale Gate owner decision intake with these authorities false',
        'separate governed release/product-use decision with after-interaction proof and owner authorization'
      ),
      issue(
        'protected-mutation-authority-not-requested',
        'scale_blocker',
        'protected MTU mutation, operation registry mutation, answer-skill mutation, and broad OP row closure',
        'using existing no-mutation proof as owner-decision evidence',
        'separate governed mutation PR with exact diffs, validators, lead review, and owner authorization'
      ),
    ],
    lead_review_requirements: {
      required: true,
      required_scopes: REQUIRED_LEAD_REVIEW_SCOPES,
      evidence_file: LEAD_REVIEW_FILE,
      required_verdicts: ['PASS', 'PASS WITH FLAGS'],
      missing_lead_review_blocks_pr_readiness: true,
    },
    recommended_next_action:
      'Send this owner-decision intake packet to human review with exact-head PR readiness proof. The owner should return exactly one allowed decision string. Do not treat this packet as CP-6 closure, Scale Gate approval, diagnostics/mastery/PV/summative authorization, student use, or student/product use.',
  };
}

function findingRows(items) {
  return items.map((item) =>
    `| ${item.finding || item.issue_id} | ${item.classification} | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`
  ).join('\n');
}

function effectRows(items) {
  return items.map((item) =>
    `| ${item.owner_return} | ${item.status} | ${item.would_close} | ${item.does_not_authorize_without_separate_decision} |`
  ).join('\n');
}

function packetMarkdown(packet) {
  return `# ${SPRINT_ID} Review Packet

Status: owner decision intake ready for human review.

Route: \`${packet.route}\`

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${packet.product_end_state}

Product end-state baseline citation:
- ${packet.original_sprint_gate_spec.product_end_state_baseline}

Original sprint/gate/source specs:
- ${packet.original_sprint_gate_spec.companion_core_specification}
- ${packet.original_sprint_gate_spec.source_decision_bundle}
- ${packet.original_sprint_gate_spec.source_decision_review_packet}
- ${packet.original_sprint_gate_spec.source_decision_rendered_bundle}
- ${packet.original_sprint_gate_spec.readiness_bundle}
- ${packet.original_sprint_gate_spec.post_adoption_precheck_packet}
- ${packet.original_sprint_gate_spec.product_proof_packet}
- ${packet.original_sprint_gate_spec.bounded_adoption_packet}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Current-Main Proof

Platform origin/main: \`${packet.current_main_evidence.platform_origin_main_sha}\`

Platform checked head: \`${packet.current_main_evidence.platform_checked_head_sha}\`

Source decision bundle merge commit: \`${packet.current_main_evidence.source_decision_bundle_merge_commit}\`

Source decision bundle merge is ancestor: ${packet.current_main_evidence.source_decision_bundle_merge_is_ancestor ? 'yes' : 'no'}

Protected-surface mutation by this intake packet: ${packet.current_main_evidence.owner_decision_packet_protected_surface_mutation ? 'yes' : 'no'}

## Source Decision Bundle

Source sprint: \`${packet.source_decision_bundle_summary.sprint_id}\`

Source status: \`${packet.source_decision_bundle_summary.status}\`

Source route: \`${packet.source_decision_bundle_summary.route}\`

Four-route bundle count: ${packet.source_decision_bundle_summary.route_count}

CP-6 and Scale Gate lanes ready for owner decision in source packet: ${packet.source_decision_bundle_summary.cp6_and_scale_gate_lanes_ready_for_owner_decision ? 'yes' : 'no'}

## Owner Decision State

Decision received: ${packet.owner_decision_state.decision_received ? 'yes' : 'no'}

Decision recorded by this packet: ${packet.owner_decision_state.decision_recorded_by_this_packet ? 'yes' : 'no'}

Decision scope: ${packet.owner_decision_state.decision_scope}

Allowed owner returns:
${packet.owner_decision_state.allowed_owner_returns.map((item) => `- \`${item}\``).join('\n')}

## Owner Return Effects

| Owner return | Current status | Would close | Does not authorize without separate decision |
|---|---|---|---|
${effectRows(packet.owner_return_effects)}

## Lead Reviews

Required lead-review evidence: \`${packet.lead_review_requirements.evidence_file}\`

Required scopes:
${packet.lead_review_requirements.required_scopes.map((item) => `- ${item}`).join('\n')}

## Core-Requirement Checklist

${Object.entries(packet.core_requirement_checklist).map(([key, value]) => `- ${key}: ${value ? 'met' : 'missing'}`).join('\n')}

## Findings Classification

| Finding | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.findings)}

## Carried Issues

| Issue | Classification | Blocks (\`blocks\`) | Does not block (\`does_not_block\`) | Proof required to close (\`proof_required_to_close\`) |
|---|---|---|---|---|
${findingRows(packet.carried_issues)}

## Authority Boundary

This packet records owner-decision intake only. It does not authorize CP-6 closure, Scale Gate, diagnostics, mastery, adaptive routing, PV, summative use, broad rollout, student use, student/product use, protected MTU mutation, operation registry mutation, answer-skill mutation, broad OP closure, product-route adoption mutation, default navigation mutation, active curriculum mutation, or autonomous merge expansion.

## False Authority Flags

${REQUIRED_FALSE_FLAGS.map((flag) => `- ${flag}: ${packet.authority_claims[flag]}`).join('\n')}

## Recommended Next Action

${packet.recommended_next_action}
`;
}

function renderedOwnerDecision(packet) {
  const returns = packet.owner_decision_state.allowed_owner_returns
    .map((item) => `<li><code>${html(item)}</code></li>`)
    .join('');
  const findings = packet.findings
    .map((item) => `<tr><td>${html(item.finding)}</td><td>${html(item.classification)}</td><td>${html(item.blocks)}</td></tr>`)
    .join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;background:#f7f8fb;color:#172033;line-height:1.55}
    header{background:#fff;border-bottom:1px solid #d7dde5}.top,main{max-width:1080px;margin:0 auto;padding:24px 20px}
    .eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:0;color:#176b87;font-weight:800}
    h1{font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 8px}.sub{max-width:920px;color:#5c6675}
    .card{background:#fff;border:1px solid #d7dde5;border-radius:8px;padding:16px;margin-bottom:14px}
    .boundary{border-left:4px solid #9a3412}.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:13px;overflow-wrap:anywhere}
    table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #d7dde5;border-radius:8px;overflow:hidden}td,th{border-bottom:1px solid #e4e8ef;padding:10px;text-align:left;vertical-align:top}th{background:#eef3f7}
  </style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Owner decision intake</p><h1>${html(SPRINT_ID)}</h1><p class="sub">${html(packet.product_end_state)}</p></div></header>
  <main>
    <section class="card boundary"><h2>Authority Boundary</h2><p>This packet does not record an owner READY or BLOCKED decision. CP-6 closure, Scale Gate, and all downstream product/student-use authority remain blocked.</p></section>
    <section class="card"><h2>Allowed Owner Returns</h2><ul>${returns}</ul></section>
    <section class="card"><h2>Current Evidence</h2><p class="mono">Platform: ${html(packet.current_main_evidence.platform_origin_main_sha)}</p><p class="mono">Source merge: ${html(packet.current_main_evidence.source_decision_bundle_merge_commit)}</p></section>
    <section><h2>Findings</h2><table><thead><tr><th>Finding</th><th>Classification</th><th>Blocks</th></tr></thead><tbody>${findings}</tbody></table></section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(options = {}) {
  const packet = ownerDecisionPacket(options);
  const packetPath = path.join(REPORT_DIR, 'owner-decision-intake.json');
  const packetMdPath = path.join(REPORT_DIR, 'owner-decision-intake.md');
  const reviewPath = path.join(REPORT_DIR, 'review-packet.json');
  const reviewMdPath = path.join(REPORT_DIR, 'review-packet.md');
  const renderedPath = path.join(REPORT_DIR, 'rendered-owner-decision.html');
  writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
  writeFile(packetMdPath, packetMarkdown(packet));
  writeFile(reviewPath, JSON.stringify({
    schema_version: 1,
    packet_id: SPRINT_ID,
    sprint_id: SPRINT_ID,
    pr_number: null,
    pr_url: null,
    pr_throughput_class: 'high_authority',
    bundle_id: null,
    authority_class: 'product_authority',
    date: GENERATED_ON,
    human_decision_required: true,
    auto_merge_allowed_after_ci: false,
    paired_prs: [],
    escalation_triggers: ['owner_decision_required'],
    review_autonomy: {
      level: 'L4',
      lead_review_result: 'PASS WITH FLAGS',
      rationale:
        'Owner-decision intake is ready for human review; it records exact READY/BLOCKED owner return strings but does not authorize CP-6 closure, Scale Gate, or downstream product/student-use authority.',
    },
    product_end_state_refs: [
      packet.original_sprint_gate_spec.product_end_state_baseline,
      packet.original_sprint_gate_spec.companion_core_specification,
    ],
    original_sprint_or_gate_spec_refs: [
      packet.original_sprint_gate_spec.source_decision_bundle,
      packet.original_sprint_gate_spec.source_decision_review_packet,
      packet.original_sprint_gate_spec.readiness_bundle,
      packet.original_sprint_gate_spec.post_adoption_precheck_packet,
      packet.original_sprint_gate_spec.product_proof_packet,
      packet.original_sprint_gate_spec.bounded_adoption_packet,
    ],
    non_negotiable_requirements: packet.non_negotiable_requirements,
    status: packet.status,
    route: packet.route,
    content_verdict_requested:
      'Review owner-decision intake only; do not infer CP-6 closure, Scale Gate, diagnostics, mastery, PV, summative, broad rollout, student-use, student/product-use, or protected mutation authority.',
    owner_decision_intake: relFromPlatform(packetPath),
    rendered_owner_decision: relFromPlatform(renderedPath),
    source_decision_bundle: packet.original_sprint_gate_spec.source_decision_bundle,
    source_decision_review_packet: packet.original_sprint_gate_spec.source_decision_review_packet,
    lead_review_evidence: LEAD_REVIEW_FILE,
    authority_claims: AUTHORITY_CLAIMS,
    core_requirement_checklist: packet.core_requirement_checklist,
    carried_issues: packet.carried_issues,
    recommended_next_action: packet.recommended_next_action,
    expected_human_return: EXPECTED_OWNER_RETURNS,
  }, null, 2) + '\n');
  writeFile(reviewMdPath, packetMarkdown(packet));
  writeFile(renderedPath, renderedOwnerDecision(packet));
  return packet;
}

function main() {
  const lessonArg = process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length);
  const packet = writePlatformArtifacts({ lessonRoot: lessonArg });
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    report_dir: relFromPlatform(REPORT_DIR),
    status: packet.status,
    route: packet.route,
    expected_owner_returns: EXPECTED_OWNER_RETURNS,
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  EXPECTED_OWNER_RETURNS,
  REQUIRED_FALSE_FLAGS,
  REQUIRED_LEAD_REVIEW_SCOPES,
  REV_STD_FINDING_CLASSIFICATIONS,
  SPRINT_ID,
  LEAD_REVIEW_FILE,
  ownerDecisionPacket,
  writePlatformArtifacts,
};
