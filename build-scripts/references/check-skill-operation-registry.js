#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend required tag/operation checks after CP-4 closes.
 * - Keep the required_units / exercise_operations / skill_tags separation
 *   explicit.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/skill-operation-registry.json';
const REPORT_JSON_PATH = 'reports/json/skill-operation-registry.json';
const REPORT_MD_PATH = 'reports/markdown/skill-operation-registry.md';
const SCHEMA_PATH = 'references/schemas/skill-operation-registry.schema.json';
const CP4_PACKET_MD = 'reports/review-gates/GATE-CP4-skill-registry-coexistence/review-packet.md';
const CP4_PACKET_JSON = 'reports/review-gates/GATE-CP4-skill-registry-coexistence/review-packet.json';
const MACHINE_OPERATION_REGISTRY = 'references/machine/exercise-operations.json';
const MACHINE_TAG_REGISTRY = 'references/machine/skill-tags.json';

const REQUIRED_BROAD_TAGS = [
  'rekenen',
  'grafisch',
  'redeneren',
  'begrippen',
  'bron-info',
  'standpunt',
  'strategisch',
  'toetsvaardigheden',
  'onderzoek',
];

function fail(message) {
  console.error(`Skill operation registry check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function exists(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function main() {
  for (const file of [REGISTRY_PATH, REPORT_JSON_PATH, REPORT_MD_PATH, SCHEMA_PATH, CP4_PACKET_MD, CP4_PACKET_JSON]) {
    if (!exists(file)) fail(`missing ${file}`);
  }
  if (exists(MACHINE_OPERATION_REGISTRY)) fail(`unexpected machine operation registry: ${MACHINE_OPERATION_REGISTRY}`);
  if (exists(MACHINE_TAG_REGISTRY)) fail(`unexpected machine tag registry: ${MACHINE_TAG_REGISTRY}`);

  const schema = readJson(SCHEMA_PATH);
  for (const field of ['field_policy', 'skill_tags', 'exercise_operations', 'coexistence_issues']) {
    if (!(schema.required || []).includes(field)) fail(`${SCHEMA_PATH} must require ${field}`);
  }

  const registry = readJson(REGISTRY_PATH);
  const report = readJson(REPORT_JSON_PATH);
  const packet = readJson(CP4_PACKET_JSON);
  const packetMd = fs.readFileSync(repoPath(CP4_PACKET_MD), 'utf8');

  if (registry.schema_version !== 1) fail('schema_version must be 1');
  if (registry.registry_id !== 'skill-operation-registry') fail('registry_id must be skill-operation-registry');
  if (registry.status !== 'prepared_for_cp4_review') fail('registry must stop at prepared_for_cp4_review');
  if (!registry.storage_decision || registry.storage_decision.machine_registry_created !== false) {
    fail('machine_registry_created must be false');
  }
  if (!registry.storage_decision.registry_location || !registry.storage_decision.registry_location.startsWith('references/data/')) {
    fail('registry must live under references/data/');
  }

  const policy = registry.field_policy || {};
  if (!policy.required_units || policy.required_units.status !== 'canonical') fail('required_units must be canonical');
  if (!policy.exercise_operations || !policy.exercise_operations.status.includes('provisional')) fail('exercise_operations must remain provisional');
  if (!policy.skill_tags || !policy.skill_tags.status.includes('canonical_field_name')) fail('skill_tags field name must remain canonical');
  if (!policy.required_skills || policy.required_skills.status !== 'legacy_source_field_only') {
    fail('required_skills must remain legacy_source_field_only');
  }

  const broadTags = new Set((registry.skill_tags || []).map((tag) => tag.tag_id));
  for (const tag of REQUIRED_BROAD_TAGS) {
    if (!broadTags.has(tag)) fail(`missing broad skill tag ${tag}`);
  }
  if (!Array.isArray(registry.overlay_skill_tags_observed) || registry.overlay_skill_tags_observed.length === 0) {
    fail('overlay_skill_tags_observed must expose the S4 dry-run coexistence issue');
  }
  if (!Array.isArray(registry.exercise_operations) || registry.exercise_operations.length < 29) {
    fail('expected at least RX.1 operation records');
  }

  const operationIds = new Set();
  let mappedCount = 0;
  for (const op of registry.exercise_operations) {
    for (const field of ['operation_id', 'name', 'status', 'governance_status', 'source_path', 'mapped_unit_ids']) {
      if (op[field] === undefined || op[field] === null || op[field] === '') fail(`${op.operation_id || '<unknown>'} missing ${field}`);
    }
    if (operationIds.has(op.operation_id)) fail(`duplicate operation_id ${op.operation_id}`);
    operationIds.add(op.operation_id);
    if (op.governance_status !== 'provisional_until_cp4') fail(`${op.operation_id} must remain provisional_until_cp4`);
    if (!Array.isArray(op.mapped_unit_ids)) fail(`${op.operation_id} mapped_unit_ids must be an array`);
    if (op.mapped_unit_ids.length > 0) mappedCount += 1;
  }
  if (mappedCount < 10) fail(`expected at least 10 mapped operations, got ${mappedCount}`);

  const issueIds = new Set((registry.coexistence_issues || []).map((issue) => issue.issue_id));
  for (const issue of ['S7-COEX-001', 'S7-COEX-002', 'S7-COEX-003']) {
    if (!issueIds.has(issue)) fail(`missing coexistence issue ${issue}`);
  }

  if (report.status !== 'prepared_for_cp4_review') fail('report must be prepared_for_cp4_review');
  if (report.summary.exercise_operation_count !== registry.exercise_operations.length) {
    fail('report operation count must match registry');
  }

  if (packet.gate_id !== 'GATE-CP4-skill-registry-coexistence') fail('wrong CP-4 gate id');
  if (!Array.isArray(packet.review_questions) || packet.review_questions.length < 8) {
    fail('CP-4 packet must list all review questions');
  }
  for (const question of packet.review_questions) {
    if (!packetMd.includes(question.id)) fail(`CP-4 Markdown packet missing ${question.id}`);
  }
  if (!packet.blocked_until_gate_closure.includes('machine registry promotion')) {
    fail('CP-4 packet must block machine registry promotion');
  }

  console.log(`OK skill operation registry: ${registry.skill_tags.length} tags, ${registry.exercise_operations.length} operations`);
}

if (require.main === module) main();
