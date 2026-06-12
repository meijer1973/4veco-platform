#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const REPORT_JSON = path.join(ROOT, 'reports', 'sprints', 'REV-STD-1-flag-disposition.json');
const REPORT_MD = path.join(ROOT, 'reports', 'sprints', 'REV-STD-1-flag-disposition.md');

const STATUS_CLASSIFICATIONS = new Set([
  'stale',
  'real_blocker',
  'non_blocking_carry_flag',
  'scope_boundary',
  'missing_evidence_blocker',
  'historical_archive_flag',
]);

const FINDING_CLASSIFICATIONS = new Set([
  'core_requirement_met',
  'quality_improvement_available',
  'minor_carry_flag',
  'scale_blocker',
  'core_spec_failure',
]);

const EXPECTED_IDS = [
  'REVSTD1-REVIEW-STANDARD-HARDENING',
  'REVSTD1-LESSON-GATE-SHARED-STALE',
  'REVSTD1-SHARED-TASK-INGEST-CARRY',
  'REVSTD1-CHECK-SHORT-EXIT-2',
  'REVSTD1-SCALE-PROOF-3P',
  'REVSTD1-GATE-PRODUCT-3P',
  'REVSTD1-SCALE-GATE-1',
  'REVSTD1-GAME-ROUTE-AFFORDANCE',
  'REVSTD1-SKILLMAP-PRODUCT',
  'REVSTD1-REASONING-ADOPTION',
  'REVSTD1-DUAL-CODING-TASK-SELECTION',
  'REVSTD1-ENGINE-UNIFY',
  'REVSTD1-CHECKSURFACE-113-EXEMPLAR',
  'REVSTD1-ANSWER-FORM-GENERATOR',
  'REVSTD1-TASK-FAMILY-ADOPTION',
  'REVSTD1-TASK-SHELL-UX-CARRY',
  'REVSTD1-CI-RUNNER-MONITOR',
  'REVSTD1-HISTORICAL-DRAFT-FLAGS',
  'REVSTD1-PRODUCT-BOUNDARY',
];

function fail(message) {
  console.error(`check-rev-std1-flag-disposition: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  assert(fs.existsSync(file), `missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function resolveEvidence(relPath) {
  if (relPath.startsWith('../4veco-lessen/')) {
    return path.join(LESSON_ROOT, relPath.slice('../4veco-lessen/'.length));
  }
  return path.join(ROOT, relPath);
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function nonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(nonEmptyString);
}

function requireText(file, pattern, label) {
  const text = read(file);
  if (typeof pattern === 'string') {
    assert(text.includes(pattern), `${file} missing ${label}`);
    return text;
  }
  assert(pattern.test(text), `${file} missing ${label}`);
  return text;
}

function validateReport() {
  const report = readJson(REPORT_JSON);
  const markdown = read(REPORT_MD);

  assert(report.schema_version === 1, 'report schema_version must be 1');
  assert(report.sprint_id === 'REV-STD-1', 'report sprint_id mismatch');
  assert(report.generated_on === '2026-06-10', 'report generated_on mismatch');
  assert(report.summary && report.summary.unresolved_core_spec_failures === 0, 'core spec failures must be zero');
  assert(report.summary.product_authority_changed === false, 'REV-STD-1 must not change product authority');
  assert(nonEmptyStringArray(report.scope), 'report scope must be non-empty');

  for (const classification of STATUS_CLASSIFICATIONS) {
    assert(report.status_classifications.includes(classification), `missing status classification ${classification}`);
  }
  for (const classification of FINDING_CLASSIFICATIONS) {
    assert(report.finding_classifications.includes(classification), `missing finding classification ${classification}`);
  }

  assert(Array.isArray(report.dispositions), 'report dispositions must be an array');
  const dispositionsById = new Map(report.dispositions.map((item) => [item.id, item]));
  for (const id of EXPECTED_IDS) {
    assert(dispositionsById.has(id), `missing disposition ${id}`);
    assert(markdown.includes(id), `markdown missing disposition ${id}`);
  }

  for (const [index, item] of report.dispositions.entries()) {
    for (const key of ['id', 'source', 'status_classification', 'finding_classification', 'description', 'proof_required_to_close', 'owner', 'next_action']) {
      assert(nonEmptyString(item[key]), `dispositions[${index}].${key} must be a non-empty string`);
    }
    assert(STATUS_CLASSIFICATIONS.has(item.status_classification), `${item.id} has invalid status classification`);
    assert(FINDING_CLASSIFICATIONS.has(item.finding_classification), `${item.id} has invalid finding classification`);
    assert(nonEmptyStringArray(item.evidence), `${item.id} evidence must be a non-empty string array`);
    assert(nonEmptyStringArray(item.blocks), `${item.id} blocks must be a non-empty string array`);
    assert(nonEmptyStringArray(item.does_not_block), `${item.id} does_not_block must be a non-empty string array`);
    for (const evidencePath of item.evidence) {
      assert(fs.existsSync(resolveEvidence(evidencePath)), `${item.id} missing evidence path: ${evidencePath}`);
    }
    if (item.finding_classification === 'core_spec_failure') {
      fail(`${item.id} must not leave an active core_spec_failure in REV-STD-1 closure`);
    }
    if (item.finding_classification === 'scale_blocker') {
      assert(
        item.blocks.some((entry) => /Scale Gate|product|adoption|target-equivalent|readiness|route|claim|authority/i.test(entry)),
        `${item.id} scale blocker must name a blocked claim or authority`
      );
    }
  }

  for (const blockerId of report.summary.residual_scale_blockers || []) {
    const item = dispositionsById.get(blockerId);
    assert(item, `summary residual blocker missing disposition ${blockerId}`);
    assert(item.finding_classification === 'scale_blocker', `${blockerId} must be a scale_blocker`);
  }
}

function validateInstructionSurfaces() {
  const lead = path.join(ROOT, 'agents', 'lead-reviewer-agent.md');
  for (const phrase of [
    '../4veco-lessen/specifications/product-end-state.md',
    'original sprint or gate specification',
    'non-negotiable requirements',
    'core-requirement checklist',
    '## Finding Classification',
    'core_spec_failure',
    'scale_blocker',
    'minor_carry_flag',
    'quality_improvement_available',
    'core_requirement_met',
    'Proof required to close',
  ]) {
    requireText(lead, phrase, `lead reviewer phrase ${phrase}`);
  }

  const companion = path.join(LESSON_ROOT, 'specifications', 'companion-core-specifications.md');
  for (const phrase of [
    'specifications/product-end-state.md',
    'original sprint or gate specification',
    'non-negotiable requirements',
    'core-requirement checklist',
    'core_spec_failure',
    'scale_blocker',
    'minor_carry_flag',
    'quality_improvement_available',
    'core_requirement_met',
    'blocks, what it does not block, and the',
  ]) {
    requireText(companion, phrase, `companion spec phrase ${phrase}`);
  }

  const standard = path.join(LESSON_ROOT, 'archive', 'sprints', 'REV-STD-1', 'REV-STD-1-review-standard.md');
  for (const phrase of [
    'Status: IMPLEMENTED',
    'specifications/product-end-state.md',
    'original sprint or gate specification',
    'Finding Classification',
    'core_spec_failure',
    'PASS WITH FLAGS',
    'Proof required to close',
  ]) {
    requireText(standard, phrase, `REV-STD-1 standard phrase ${phrase}`);
  }
}

function validateCheckerSurfaces() {
  const bundle = path.join(ROOT, 'build-scripts', 'sprints', 'check-sprint-bundle.js');
  for (const phrase of [
    'LEAD_REVIEW_SCHEMA_VERSION_V3',
    'LEAD_REVIEW_FINDING_POLICY_EFFECTIVE_ON',
    'lead_review.findings',
    '## Finding Classification',
    'blocks',
    'does_not_block',
    'proof_required_to_close',
    'core_spec_failure',
  ]) {
    requireText(bundle, phrase, `bundle checker phrase ${phrase}`);
  }

  const fixtures = path.join(ROOT, 'build-scripts', 'sprints', 'check-lead-review-strict-fixtures.js');
  for (const phrase of [
    'TEST-STRICT-7',
    'TEST-STRICT-8',
    'lead_review.findings must list classified findings',
    'lead_review_schema_version: 3',
  ]) {
    requireText(fixtures, phrase, `strict fixture phrase ${phrase}`);
  }
}

function validateActivePacket() {
  const packetMd = path.join(
    ROOT,
    'reports',
    'review-gates',
    'GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review',
    'review-packet.md'
  );
  const packetJsonPath = path.join(
    ROOT,
    'reports',
    'review-gates',
    'GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review',
    'review-packet.json'
  );
  for (const phrase of [
    '../4veco-lessen/specifications/product-end-state.md',
    '## Non-Negotiable Requirements',
    '## Core-Requirement Checklist',
    '## Finding Classification Rule',
    'core_spec_failure',
    'proof required to close',
    'current Golden Workbench transfer held pending review',
  ]) {
    requireText(packetMd, phrase, `active packet phrase ${phrase}`);
  }
  const packetJson = readJson(packetJsonPath);
  assert(
    packetJson.required_baselines.product_end_state === '../4veco-lessen/specifications/product-end-state.md',
    'active packet JSON must require product_end_state'
  );
  assert(nonEmptyStringArray(packetJson.non_negotiable_requirements), 'active packet JSON must list non-negotiable requirements');
  assert(Array.isArray(packetJson.core_requirement_checklist) && packetJson.core_requirement_checklist.length >= 6, 'active packet JSON must include checklist');
  assert(packetJson.proof_summary.current_112_transfer_held === true, 'active packet JSON must keep current 1.1.2 transfer held');
  for (const classification of FINDING_CLASSIFICATIONS) {
    assert(packetJson.finding_classifications.includes(classification), `active packet missing ${classification}`);
  }
}

function validateRoadmaps() {
  const platformRoadmap = path.join(ROOT, 'references', 'reference-team-roadmap.md');
  const lessonRoadmap = path.join(LESSON_ROOT, 'lessen-team-roadmap.md');
  const platformText = read(platformRoadmap);
  const lessonText = read(lessonRoadmap);

  assert(/\| REV-STD-1 \| Core-Spec Review Standard Hardening \| yes \|/.test(platformText), 'platform roadmap must mark REV-STD-1 closed');
  assert(/\| REV-STD-1 \| Core-Spec Review Standard Hardening \| \*\*2026-06-10\*\* \|/.test(lessonText), 'lesson roadmap must mark REV-STD-1 closed');
  assert(/REV-STD-1` is now closed as review-standard hardening only/.test(platformText), 'platform Scale Gate row must describe REV-STD-1 closure boundary');
  assert(/REV-STD-1` is closed as review-standard hardening only/.test(lessonText), 'lesson Scale Gate row must describe REV-STD-1 closure boundary');
  assert(/GATE-SHARED-TASK-INGEST-REPAIR-1 \| Shared Task Context And Ingestion Repair Human Review \| \*\*2026-06-05\*\*/.test(lessonText), 'lesson roadmap must sync GATE-SHARED closure');
}

function main() {
  validateReport();
  validateInstructionSurfaces();
  validateCheckerSurfaces();
  validateActivePacket();
  validateRoadmaps();
  console.log('REV-STD-1 flag disposition check passed');
}

main();
