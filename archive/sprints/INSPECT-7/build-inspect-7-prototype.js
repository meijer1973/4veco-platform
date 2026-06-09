#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const SOURCE_PATH = path.join(
  REPO_ROOT,
  'references',
  'data',
  'inspection-standards',
  'prototypes',
  'inspect-7-book-1-1.source.json',
);
const JSON_OUTPUT_PATH = path.join(
  REPO_ROOT,
  'reports',
  'inspection-standards',
  'inspect-7-book-1-1-evidence-pack.json',
);
const MD_OUTPUT_PATH = path.join(
  REPO_ROOT,
  'reports',
  'inspection-standards',
  'inspect-7-book-1-1-evidence-pack.md',
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
  return value;
}

function assertPrototypeScope(source) {
  const expectedScope = 'inspect-7-book-1-1';
  if (source?.pack_scope?.scope_id !== expectedScope) {
    throw new Error(`unexpected scope_id: ${source?.pack_scope?.scope_id}`);
  }
  if (source?.privacy_boundary?.personal_data_present !== false) {
    throw new Error('personal data is not allowed in INSPECT-7');
  }
  if (source?.privacy_boundary?.redaction_required !== false) {
    throw new Error('redaction-required source objects are out of scope');
  }
  if (source?.contract_usage !== 'report_only_generator_planning') {
    throw new Error('source does not follow the INSPECT-6 contract usage');
  }
}

function makePack(source) {
  assertPrototypeScope(source);

  const categories = ensureArray(source.category_records, 'category_records');
  const claims = ensureArray(source.claim_records, 'claim_records');
  const requiredCategories = [
    'curriculum_offer',
    'basic_skills',
    'didactic_quality',
    'student_development_and_support',
    'assessment_and_closure',
    'accessibility_and_inclusion',
    'quality_assurance',
    'improvement_cycle',
  ];

  const categoryIds = new Set(categories.map((category) => category.category_id));
  for (const categoryId of requiredCategories) {
    if (!categoryIds.has(categoryId)) {
      throw new Error(`missing required category: ${categoryId}`);
    }
  }

  return {
    schema_version: 1,
    pack_id: 'inspect-7-book-1-1-evidence-pack',
    status: 'report_only_prototype',
    generated_from: 'references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json',
    generator: 'archive/sprints/INSPECT-7/build-inspect-7-prototype.js',
    diagnostic_only: true,
    compliance_claim: false,
    personal_data_present: false,
    scope: source.pack_scope,
    teacher_first_screen: source.teacher_utility,
    official_source_anchors: source.official_source_anchors,
    category_records: categories,
    claim_records: claims,
    privacy_boundary: source.privacy_boundary,
    validation_policy: source.validation_policy,
    review_policy: source.review_policy,
    next_action: source.next_action,
  };
}

function list(items) {
  return ensureArray(items || [], 'list items').map((item) => `- ${item}`).join('\n');
}

function evidenceList(items) {
  return ensureArray(items || [], 'evidence items')
    .map((item) => `- ${item.path}: ${item.summary}`)
    .join('\n');
}

function categorySection(category) {
  return [
    `## ${category.teacher_label}`,
    '',
    `Category: \`${category.category_id}\``,
    '',
    `Evidence state: \`${category.evidence_state}\``,
    `Evidence strength: \`${category.evidence_strength}\``,
    `Evidence finality: \`${ensureArray(category.evidence_finality, 'evidence_finality').join('`, `')}\``,
    '',
    '4veco evidence:',
    '',
    evidenceList(category['4veco_evidence']),
    '',
    'School evidence still needed:',
    '',
    list(category.school_evidence_still_needed),
    '',
    'Weak or missing evidence:',
    '',
    list(category.weak_or_missing_evidence),
    '',
    'Forbidden inference:',
    '',
    list(category.forbidden_inference),
    '',
    'Reviewer flags:',
    '',
    list(category.review_flags),
    '',
    `Owner next action: ${category.owner_next_action}`,
  ].join('\n');
}

function makeMarkdown(pack) {
  const screen = pack.teacher_first_screen;
  const categories = pack.category_records.map(categorySection).join('\n\n');
  const claims = pack.claim_records
    .map((claim) => `- \`${claim.claim_id}\`: ${claim.exact_wording}`)
    .join('\n');

  return [
    '# INSPECT-7 Book 1 Chapter 1.1 Evidence Pack',
    '',
    'Status: report-only prototype',
    'Date: 2026-06-09',
    '',
    '## Scope',
    '',
    screen.scope_summary,
    '',
    '## Safe-Use Note',
    '',
    screen.safe_use_note,
    '',
    '## Evidence Summary',
    '',
    list(screen.category_summary),
    '',
    '## Weak Or Missing Evidence',
    '',
    list(screen.top_weak_or_missing_evidence),
    '',
    '## School-Owned Evidence Still Needed',
    '',
    list(screen.school_evidence_still_needed_summary),
    '',
    '## Recommended Next Action',
    '',
    screen.recommended_next_action,
    '',
    '## Approved Claim Records',
    '',
    claims,
    '',
    categories,
    '',
    '## Privacy Boundary',
    '',
    `Personal data present: \`${pack.privacy_boundary.personal_data_present}\``,
    '',
    pack.privacy_boundary.personal_data_scan_note,
    '',
    '## Required Next Action',
    '',
    pack.next_action,
    '',
  ].join('\n');
}

function main() {
  const source = readJson(SOURCE_PATH);
  const pack = makePack(source);
  fs.mkdirSync(path.dirname(JSON_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(JSON_OUTPUT_PATH, `${JSON.stringify(pack, null, 2)}\n`);
  fs.writeFileSync(MD_OUTPUT_PATH, makeMarkdown(pack));
  console.log(`wrote ${path.relative(REPO_ROOT, JSON_OUTPUT_PATH)}`);
  console.log(`wrote ${path.relative(REPO_ROOT, MD_OUTPUT_PATH)}`);
}

main();
