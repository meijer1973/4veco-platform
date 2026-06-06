#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review';
const gateDir = path.join(platformRoot, 'reports', 'review-gates', gateId);

function fail(message) {
  console.error(`check-checksurface-reset1: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(relativePath) {
  const file = path.resolve(platformRoot, relativePath);
  assert(fs.existsSync(file), `missing ${relativePath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}

function requireNoClosureArtifacts() {
  for (const name of [
    'closure-proposal.md',
    'closure-proposal.json',
    'gate-closure.md',
    'gate-closure.json',
  ]) {
    assert(!fs.existsSync(path.join(gateDir, name)), `${name} must not exist for held REVISE gate`);
  }
}

function requireReviewComments() {
  const commentsText = readText(`reports/review-gates/${gateId}/direct-review-comments.md`);
  const comments = readJson(`reports/review-gates/${gateId}/direct-review-comments.json`);
  const resolutionText = readText(`reports/review-gates/${gateId}/comment-resolution-log.md`);
  const resolution = readJson(`reports/review-gates/${gateId}/comment-resolution-log.json`);

  assert(comments.decision === 'REVISE', 'direct review decision must be REVISE');
  assert(comments.gate_direction === 'hold_for_surface_repair', 'gate direction must be hold_for_surface_repair');
  assert(comments.additional_direction === 'replan_before_next_human_gate', 'additional direction must require replan before next human gate');
  assert(comments.gate_closed === false, 'direct comments must not close the gate');
  assert(comments.closure_authorized === false, 'direct comments must not authorize closure');
  assert(comments.small_patch_revise === false, 'direct comments must reject a small-patch revise');
  assert(resolution.gate_closed === false, 'resolution log must keep the gate open');
  assert(resolution.closure_artifacts_authorized === false, 'resolution log must not authorize closure artifacts');

  for (let index = 1; index <= 12; index += 1) {
    const id = `CHECKSURFACE-Q${index}`;
    assert(commentsText.includes(id), `direct comments missing ${id}`);
    assert(comments.comments.some((comment) => comment.id === id), `direct comments JSON missing ${id}`);
  }

  for (const phrase of [
    '1.1.3-short',
    'task_shell_count: 0',
    'context_block_count: 0',
    'GRAPH-CHECK-UX-1',
    'GRAPH-EXIT-UX-1',
    'CHECK-SURFACE-PREGATE-1',
    'Do not write `closure-proposal.md/json`',
  ]) {
    assert(commentsText.includes(phrase) || resolutionText.includes(phrase), `review logs missing phrase: ${phrase}`);
  }
}

function requireProofFindings() {
  const proof = readJson('reports/json/check-short-exit2-proof.json');
  const surfaces = proof.proof && proof.proof.surfaces ? proof.proof.surfaces : {};
  const short113 = surfaces['1.1.3-short'];
  const exit113 = surfaces['1.1.3-exit'];
  assert(short113, 'proof missing 1.1.3-short surface');
  assert(exit113, 'proof missing 1.1.3-exit surface');
  assert(short113.context_block_count === 0, '1.1.3-short context_block_count must remain recorded as 0 in reset baseline');
  assert(short113.task_shell_count === 0, '1.1.3-short task_shell_count must remain recorded as 0 in reset baseline');
  assert(short113.graph_workspace_required === false, '1.1.3-short graph_workspace_required must remain false in reset baseline');
  assert(Array.isArray(exit113.task_families), '1.1.3-exit must record task families');
  assert(exit113.task_families.includes('graph_construction_substitute'), '1.1.3-exit must record graph_construction_substitute data');
  assert(exit113.context_block_count > 0, '1.1.3-exit must record source context blocks');
}

function requireSourceFindings() {
  const shortData = readJson('source-data/book-1/exit-ticket/1.1.3-korte-check.json');
  assert(shortData.surface === 'advisory_short_check', '1.1.3 short check must remain advisory in reset baseline');
  assert(!Array.isArray(shortData.contextBlocks) || shortData.contextBlocks.length === 0, '1.1.3 short check must have no context blocks in reset baseline');
  assert(Array.isArray(shortData.tasks) && shortData.tasks.length === 3, '1.1.3 short check must record three baseline tasks');
  assert(shortData.tasks.every((task) => task.type === 'choice'), '1.1.3 short check baseline must be choice-only');
}

function requireAudit() {
  const audit = readText('reports/sprints/CHECKSURFACE-RESET-1-product-quality-audit.md');
  const findings = readJson('reports/json/checksurface-reset1-quality-findings.json');

  assert(findings.status === 'product_quality_reset_recorded', 'findings status mismatch');
  assert(findings.gate_decision === 'REVISE', 'findings must record REVISE');
  assert(findings.gate_direction === 'hold_for_surface_repair', 'findings must record hold_for_surface_repair');
  assert(findings.additional_direction === 'replan_before_next_human_gate', 'findings must record replan direction');
  assert(findings.gate_closed === false, 'findings must not mark gate closed');
  assert(findings.closure_authorized === false, 'findings must not authorize closure');
  assert(findings.next_human_gate_allowed_now === false, 'findings must block immediate next human gate');

  const requiredSequence = [
    'CHECKSURFACE-RESET-1',
    'GRAPH-CHECK-UX-1',
    'GRAPH-EXIT-UX-1',
    'CHECK-ROUTE-COPY-1',
    'VISUAL-QA-HARDEN-2',
    'CHECK-SURFACE-PREGATE-1',
    'GATE-CHECK-SHORT-EXIT-2-RETRY',
  ];
  assert(JSON.stringify(findings.required_next_sequence) === JSON.stringify(requiredSequence), 'required sprint sequence mismatch');

  const requiredFindings = ['CSR1-F1', 'CSR1-F2', 'CSR1-F3', 'CSR1-F4', 'CSR1-F5'];
  for (const id of requiredFindings) {
    assert(findings.findings.some((finding) => finding.id === id), `findings JSON missing ${id}`);
  }

  for (const phrase of [
    '1.1.3` Short Check Lacks Graph/Table Interaction',
    'context_block_count = 0',
    'task_shell_count = 0',
    'Exit Ticket Has Better Data But Weak Rendered Product',
    'Visual QA Was Insufficient',
    'Lead Review Missed Product-Experience Blockers',
  ]) {
    assert(audit.includes(phrase), `audit missing phrase: ${phrase}`);
  }
}

function requireSprintAuditTrail() {
  const requiredFiles = [
    'reports/sprints/CHECKSURFACE-RESET-1-plan.md',
    'reports/sprints/CHECKSURFACE-RESET-1-baseline.md',
    'reports/sprints/CHECKSURFACE-RESET-1-planning-review.md',
    'reports/sprints/CHECKSURFACE-RESET-1-command-log.md',
    'reports/sprints/CHECKSURFACE-RESET-1-command-log.jsonl',
    'reports/sprints/CHECKSURFACE-RESET-1-lead-review-assignment.md',
    'reports/sprints/CHECKSURFACE-RESET-1-lead-review-round1.md',
    'reports/sprints/CHECKSURFACE-RESET-1-lead-review-corrections.md',
    'reports/sprints/CHECKSURFACE-RESET-1-lead-review-round2.md',
    'reports/sprints/CHECKSURFACE-RESET-1-verification-review.md',
    'reports/sprints/CHECKSURFACE-RESET-1-result.md',
  ];
  for (const file of requiredFiles) {
    readText(file);
  }
  const result = readText('reports/sprints/CHECKSURFACE-RESET-1-result.md');
  assert(result.includes('Proceed to `GRAPH-CHECK-UX-1`'), 'result must name GRAPH-CHECK-UX-1 as next action');
}

function requirePacketAndRoadmapState() {
  const packetText = readText(`reports/review-gates/${gateId}/review-packet.md`);
  const packet = readJson(`reports/review-gates/${gateId}/review-packet.json`);
  const roadmap = readText('references/reference-team-roadmap.md');

  assert(packet.status === 'direct_human_review_returned_revise_not_closed', 'packet JSON status must record returned REVISE');
  assert(packet.human_review_comments_started === true, 'packet JSON must record human comments started');
  assert(packet.human_review_decision === 'REVISE', 'packet JSON must record REVISE decision');
  assert(packet.gate_direction === 'hold_for_surface_repair', 'packet JSON must record gate direction');
  assert(packet.gate_closure_authorized === false, 'packet JSON must keep closure unauthorized');
  assert(packetText.includes('Status: direct human review returned `REVISE`'), 'packet markdown must record returned REVISE');
  assert(packetText.includes('Do not close this gate'), 'packet markdown must instruct no closure');

  for (const expected of [
    'hold_for_surface_repair',
    'CHECKSURFACE-RESET-1',
    'GRAPH-CHECK-UX-1',
    'GRAPH-EXIT-UX-1',
    'CHECK-ROUTE-COPY-1',
    'VISUAL-QA-HARDEN-2',
    'CHECK-SURFACE-PREGATE-1',
    'GATE-CHECK-SHORT-EXIT-2-RETRY',
  ]) {
    assert(roadmap.includes(expected), `roadmap missing ${expected}`);
  }
}

function requirePriorLeadReviewEvidence() {
  const lead = readText('reports/sprints/CHECK-SHORT-EXIT-2-lead-review-round2.md');
  assert(lead.includes('Verdict: PASS WITH FLAGS'), 'prior lead review baseline must record PASS WITH FLAGS');
  assert(lead.includes('No blocking findings remain'), 'prior lead review baseline must record missed no-blocker conclusion');
}

function main() {
  assert(fs.existsSync(gateDir), `missing gate dir ${gateId}`);
  requireNoClosureArtifacts();
  requireReviewComments();
  requireProofFindings();
  requireSourceFindings();
  requireAudit();
  requireSprintAuditTrail();
  requirePacketAndRoadmapState();
  requirePriorLeadReviewEvidence();
  console.log('OK CHECKSURFACE-RESET-1 product-quality reset recorded');
}

main();
