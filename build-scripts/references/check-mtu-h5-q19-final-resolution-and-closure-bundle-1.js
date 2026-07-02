#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  buildRawReferenceUrl,
  buildRawUrl,
  parseRepoFromPackageJson,
} = require('../sprints/emit-gate-bundle-urls.js');

const ROOT = process.cwd();
const PACKAGE_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.json');
const PACKAGE_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-q19-final-resolution-and-closure-bundle-1.md');
const GATE_ID = 'GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const GATE_JSON = path.join(GATE_DIR, 'review-packet.json');
const GATE_MD = path.join(GATE_DIR, 'review-packet.md');
const GATE_BUNDLE = path.join(GATE_DIR, 'bundle-urls.md');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.md');
const H5_VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');
const SOURCE_OVERLAY = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'source-annex-extraction-overlays.json');
const URL_INDEX = path.join(ROOT, 'reports', 'url-index.md');
const AGENT_INDEX = path.join(ROOT, 'reports', 'github-agent-index-platform.md');
const AGENT_INDEX_JSON = path.join(ROOT, 'reports', 'github-agent-index-platform.json');

const PACKAGE_ID = 'MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1';
const STATUS = 'pending_human_review_after_more_than_satisfied_q19_closure_execution';
const START_COMMIT = 'e8dfc9e8303187ffc9babd220ba3d74ae5cd19eb';
const REVIEW_BRANCH = 'codex/mtu-h5-q19-final-resolution-closure-bundle-1-20260620';
const Q3_RECORD_ID = 'vw-1022-a-25-1-o:opgave-1:question-3';
const Q15_RECORD_ID = 'vw-1022-a-25-1-o:opgave-3:question-15';
const Q19_RECORD_ID = 'vw-1022-a-25-1-o:opgave-4:question-19';
const Q27_RECORD_ID = 'vw-1022-a-25-2-o:opgave-6:question-27';
const ANSWER_REF = 'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json#EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION';
const GLOBAL_NEGATIVE = 'MTUH5-NEGATIVE-negative-solo-q2-function-construction-overtrigger-FAILS-AS-EXPECTED';

const REQUIRED_UNITS = ['A42', 'D10', 'D13', 'A81'];
const FORBIDDEN_ROUTE_TAGS = ['full_graph_construction', 'calculus_route', 'function_construction'];
const FINAL_REFS = {
  'q19-step-1': 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json#Q19_STEP1_LABOR_MARKET_SHIFT_REVIEWED_EQUIVALENT',
  'q19-step-2': 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json#Q19_STEP2_CURACAO_INFLATION_SHIFT_REVIEWED_EQUIVALENT',
  'q19-step-3': 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json#Q19_STEP3_ARUBA_INFLATION_SHIFT_REVIEWED_EQUIVALENT',
};
const OPERATION_UNITS = {
  'q19-step-1': ['A42', 'D10', 'A81'],
  'q19-step-2': ['A42', 'D10', 'D13', 'A81'],
  'q19-step-3': ['A42', 'D10', 'D13', 'A81'],
};
const RENDERED_EVIDENCE = [
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-08.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-09.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-13.png',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-14.png',
];
const DIRECT_RENDERED_ANCHOR = 'Q19_DIRECT_RENDERED_OFFICIAL_EVIDENCE_REVIEWED_EQUIVALENT';
const DIRECT_RENDERED_REF = `reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json#${DIRECT_RENDERED_ANCHOR}`;
const REPAIR_REVIEW_VERDICT = 'MORE_THAN_SATISFIED_TO_APPROVE_REPAIRED_Q19_FINAL_CLOSURE_SURFACE';
const REPAIR_LEAD_VERDICT = 'APPROVE_REPAIRED_Q19_FINAL_CLOSURE_SURFACE';
const EXPECTED_RENDERED_MANIFEST = [
  {
    render_id: 'q19-opgave-08',
    role: 'official_prompt_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-25-1-o.pdf',
    source_pdf_sha256: '1b0f56fa3794e92584979e8407c4b8f61c59285047efe8ad1b25d7294bdd83fc',
    page_number: 8,
    rendered_png_path: 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-08.png',
    rendered_png_sha256: 'c72f5f53de8c608fa3399b60f2043533ba956d4a6993842d2cb62d3a403d9bc2',
    width_px: 1489,
    height_px: 2105,
    render_method: 'Poppler pdftoppm -png -r 180 -f 8 -l 9 references/external/exams/vw-1022-a-25-1-o.pdf reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave',
  },
  {
    render_id: 'q19-opgave-09',
    role: 'official_source_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-25-1-o.pdf',
    source_pdf_sha256: '1b0f56fa3794e92584979e8407c4b8f61c59285047efe8ad1b25d7294bdd83fc',
    page_number: 9,
    rendered_png_path: 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave-09.png',
    rendered_png_sha256: '23fdf99038e6fd03ff9e4b89b5d458417711407f6e66d9f9ee55bea517fa3c37',
    width_px: 1489,
    height_px: 2105,
    render_method: 'Poppler pdftoppm -png -r 180 -f 8 -l 9 references/external/exams/vw-1022-a-25-1-o.pdf reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-opgave',
  },
  {
    render_id: 'q19-correction-13',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-25-1-c.pdf',
    source_pdf_sha256: 'd10773314c943fb2082dd81368f25ac41936855a3125435b52f0406c6f5fd617',
    page_number: 13,
    rendered_png_path: 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-13.png',
    rendered_png_sha256: '66fb080fd6b5bfd66b14f7ce82f8017ec3ec1b136b744fc9154a79a9a4bda016',
    width_px: 1489,
    height_px: 2105,
    render_method: 'Poppler pdftoppm -png -r 180 -f 13 -l 14 references/external/exams/vw-1022-a-25-1-c.pdf reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction',
  },
  {
    render_id: 'q19-correction-14',
    role: 'official_correction_model_page',
    source_pdf_path: 'references/external/exams/vw-1022-a-25-1-c.pdf',
    source_pdf_sha256: 'd10773314c943fb2082dd81368f25ac41936855a3125435b52f0406c6f5fd617',
    page_number: 14,
    rendered_png_path: 'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction-14.png',
    rendered_png_sha256: '67acbc146c3aec98210dc80c315ef2fdfc5a2b276536c476097e172a6c25486a',
    width_px: 1489,
    height_px: 2105,
    render_method: 'Poppler pdftoppm -png -r 180 -f 13 -l 14 references/external/exams/vw-1022-a-25-1-c.pdf reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1-evidence/q19-correction',
  },
];
const HISTORICAL_SUPERSEDED = [
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json',
  'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.md',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-source-graph-reasoning-package-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q27-step2-q15-closure-readiness-bundle-1/review-packet.md',
];

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'authored_target_exercise_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_authorized',
  'unit_split_authorized',
  'unit_merge_authorized',
  'unit_deprecation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'source_overlay_mutation_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
  'scale_gate_1_authorized',
];

const ALLOWED_CHANGED_PATHS = new Set([
  'build-scripts/references/build-mtu-h5-regression-report.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-equivalent-execution-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-final-resolution-and-closure-bundle-1.js',
  'build-scripts/references/check-mtu-h5-q19-procedure-semantic-fit-package-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js',
  'build-scripts/references/check-mtu-h5-q19-source-graph-reasoning-package-1.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-levy-capacity-package-2.js',
  'build-scripts/references/check-mtu-h5-q27-incidence-scaling-levy-capacity-package-1.js',
  'build-scripts/references/check-mtu-h5-q27-step2-q15-closure-readiness-bundle-1.js',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.md',
  ...RENDERED_EVIDENCE,
  ...HISTORICAL_SUPERSEDED,
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-regression-report.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.json',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/review-packet.md',
  'reports/review-gates/GATE-MTU-H5-Q19-final-resolution-and-closure-bundle-1/bundle-urls.md',
  'reports/url-index.md',
  'reports/github-agent-index-platform.json',
  'reports/github-agent-index-platform.md',
  'reports/github-agent-index-lessen.json',
  'reports/github-agent-index-lessen.md',
]);

const FORBIDDEN_CHANGED_PREFIXES = [
  'references/machine/',
  'references/external/',
  'references/authored/',
  'references/data/exam-ingestion/',
  'references/candidates/',
  'reports/candidates/',
  'lesson-output/',
  'lessons/',
  'product/',
  'diagnostics/',
  'pv/',
];

function fail(message) {
  throw new Error(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/^"|"$/g, '');
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function requireText(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function requireIncludes(values, value, context) {
  if (!Array.isArray(values) || !values.includes(value)) fail(`${context} must include ${value}`);
}

function requireNotIncludes(values, value, context) {
  if (Array.isArray(values) && values.includes(value)) fail(`${context} must not include ${value}`);
}

function requireIncludesAll(values, required, context) {
  for (const value of required) requireIncludes(values, value, context);
}

function requireExact(values, expected, context) {
  const actual = [...(values || [])].sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((value, index) => value !== wanted[index])) {
    fail(`${context} mismatch; expected ${wanted.join(', ')}, got ${actual.join(', ')}`);
  }
}

function requireEqual(actual, expected, context) {
  if (actual !== expected) fail(`${context} mismatch; expected ${expected}, got ${actual}`);
}

function requireFalseBoundary(boundary, context) {
  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!boundary || boundary[key] !== false) fail(`${context}.${key} must be false`);
  }
}

function sha256File(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function pngDimensions(file) {
  if (!fs.existsSync(file)) fail(`missing PNG: ${rel(file)}`);
  const buffer = fs.readFileSync(file);
  if (buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') fail(`${rel(file)} must be a PNG render`);
  if (buffer.toString('ascii', 12, 16) !== 'IHDR') fail(`${rel(file)} missing PNG IHDR chunk`);
  return {
    width_px: buffer.readUInt32BE(16),
    height_px: buffer.readUInt32BE(20),
  };
}

function collectAnchorIds(value, ids = new Map(), pointer = '$') {
  if (!value || typeof value !== 'object') return ids;
  if (!Array.isArray(value) && typeof value.anchor_id === 'string') {
    const locations = ids.get(value.anchor_id) || [];
    locations.push(pointer);
    ids.set(value.anchor_id, locations);
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectAnchorIds(item, ids, `${pointer}[${index}]`));
  } else {
    Object.entries(value).forEach(([key, item]) => collectAnchorIds(item, ids, `${pointer}.${key}`));
  }
  return ids;
}

function requireUniquePackageAnchor(packet, anchorId) {
  const ids = collectAnchorIds(packet);
  const locations = ids.get(anchorId) || [];
  if (locations.length !== 1) fail(`package anchor ${anchorId} must resolve exactly once, got ${locations.length}`);
  if (!packet[anchorId] || packet[anchorId].anchor_id !== anchorId) {
    fail(`package must define top-level manifest object ${anchorId}`);
  }
  for (const [id, anchorLocations] of ids.entries()) {
    if (anchorLocations.length > 1) fail(`duplicate package anchor ${id}: ${anchorLocations.join(', ')}`);
  }
  return packet[anchorId];
}

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function requireGitSuccess(args, message) {
  const run = git(args);
  if (run.status !== 0) fail(`${message}: ${(run.stderr || run.stdout || '').trim()}`);
  return run.stdout.trim();
}

function runValidator(fixturePath = FIXTURE, expectFail = false) {
  const args = [
    rel(H5_VALIDATOR),
    '--fixture',
    path.isAbsolute(fixturePath) ? fixturePath : rel(fixturePath),
  ];
  if (expectFail) args.push('--expect-fail');
  args.push('--json');
  const run = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (run.status !== 0) fail(`validator failed: ${(run.stderr || run.stdout).trim()}`);
  return JSON.parse(run.stdout);
}

function records(fixture) {
  return fixture.records || fixture.question_records || [];
}

function findRecord(fixture, recordId) {
  const record = records(fixture).find((item) => item.record_id === recordId);
  if (!record) fail(`missing fixture record ${recordId}`);
  return record;
}

function findOperation(record, operationId) {
  const operation = (record.official_correction_model_operations || []).find((item) => item.operation_id === operationId);
  if (!operation) fail(`missing operation ${operationId}`);
  return operation;
}

function bucketIds(result, bucket, recordId) {
  return (result.buckets?.[bucket] || [])
    .filter((item) => !recordId || item.record_id === recordId)
    .map((item) => item.assertion_id);
}

function allQ19SourceRecords(overlay) {
  return [...(overlay.graph_overlays || []), ...(overlay.source_annex_overlays || [])]
    .filter((record) => record.source_exam_item_id === Q19_RECORD_ID);
}

function writeTempFixture(fixture, prefix) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const tempFixture = path.join(tempDir, 'fixture.json');
  fs.writeFileSync(tempFixture, `${JSON.stringify(fixture, null, 2)}\n`, 'utf8');
  return { tempDir, tempFixture };
}

function expectFailure(fn, context) {
  let rejected = false;
  try {
    fn();
  } catch (_error) {
    rejected = true;
  }
  if (!rejected) fail(`${context} must be rejected`);
}

function requireRenderedEvidenceManifest(packet) {
  const manifest = requireUniquePackageAnchor(packet, DIRECT_RENDERED_ANCHOR);
  requireEqual(manifest.reviewed_equivalent_ref, DIRECT_RENDERED_REF, 'direct rendered manifest ref');
  requireEqual(manifest.covered_record_id, Q19_RECORD_ID, 'direct rendered manifest covered record');
  requireExact(manifest.covered_operation_ids || [], Object.keys(OPERATION_UNITS), 'direct rendered manifest covered operations');
  requireEqual(manifest.render_tool?.tool, 'Poppler pdftoppm', 'direct rendered manifest render tool');
  requireEqual(manifest.render_tool?.format, 'png', 'direct rendered manifest render format');
  requireEqual(manifest.render_tool?.dpi, 180, 'direct rendered manifest render dpi');

  const records = manifest.records || [];
  if (records.length !== EXPECTED_RENDERED_MANIFEST.length) {
    fail(`direct rendered manifest must contain ${EXPECTED_RENDERED_MANIFEST.length} records`);
  }
  const byId = new Map(records.map((record) => [record.render_id, record]));
  if (byId.size !== records.length) fail('direct rendered manifest render_id values must be unique');
  const seenPages = new Set();
  const seenPngs = new Set();
  for (const expected of EXPECTED_RENDERED_MANIFEST) {
    const record = byId.get(expected.render_id);
    if (!record) fail(`direct rendered manifest missing ${expected.render_id}`);
    for (const [key, value] of Object.entries(expected)) {
      requireEqual(record[key], value, `${expected.render_id}.${key}`);
    }
    const pageKey = `${record.source_pdf_path}#page=${record.page_number}`;
    if (seenPages.has(pageKey)) fail(`direct rendered manifest duplicates page ${pageKey}`);
    seenPages.add(pageKey);
    if (seenPngs.has(record.rendered_png_path)) fail(`direct rendered manifest duplicates PNG ${record.rendered_png_path}`);
    seenPngs.add(record.rendered_png_path);
    requireEqual(sha256File(path.join(ROOT, record.source_pdf_path)), record.source_pdf_sha256, `${expected.render_id}.source_pdf_sha256`);
    requireEqual(sha256File(path.join(ROOT, record.rendered_png_path)), record.rendered_png_sha256, `${expected.render_id}.rendered_png_sha256`);
    const dimensions = pngDimensions(path.join(ROOT, record.rendered_png_path));
    requireEqual(dimensions.width_px, record.width_px, `${expected.render_id}.width_px`);
    requireEqual(dimensions.height_px, record.height_px, `${expected.render_id}.height_px`);
  }
}

function requirePackage(packet, gate) {
  if (packet.schema_version !== 1 || packet.sprint_id !== 'MTU-H5') fail('package header mismatch');
  if (packet.package_id !== PACKAGE_ID || packet.gate_id !== GATE_ID) fail('package id mismatch');
  if (packet.status !== STATUS || gate.status !== 'pending_human_review') fail('package/gate status mismatch');
  if (packet.start_commit !== START_COMMIT || packet.review_branch !== REVIEW_BRANCH) fail('package start commit or branch mismatch');
  if (gate.review_standard !== 'REV-STD-1') fail('gate must use REV-STD-1');
  if (!gate.product_end_state || !gate.original_sprint_gate_spec) fail('gate must cite product end-state and original sprint/gate spec');
  if (packet.mtu_h5_mapping_regression_surface_closed_by_this_packet !== true) {
    fail('package must claim only MTU-H5 mapping-regression surface closure');
  }
  if (packet.product_route_readiness_claimed !== false || packet.scale_gate_1_authorized !== false) {
    fail('package must not claim product route or Scale Gate 1 authorization');
  }
  if (packet.post_execution_actual_state?.overall?.failed !== 0 ||
      packet.post_execution_actual_state?.overall?.review_required !== 0 ||
      packet.post_execution_actual_state?.q19?.failed !== 0 ||
      packet.post_execution_actual_state?.q19?.review_required !== 0) {
    fail('package post-execution state must be q19 0/0 and overall 0/0');
  }
  requireFalseBoundary(packet.authority_boundary, 'package.authority_boundary');
  requireFalseBoundary(gate.authority_boundary, 'gate.authority_boundary');
  requireIncludesAll(packet.source_evidence || [], [DIRECT_RENDERED_REF, ...RENDERED_EVIDENCE], 'package source evidence');
  requireIncludesAll(gate.must_review || [], [
    rel(PACKAGE_JSON),
    rel(PACKAGE_MD),
    rel(__filename),
    rel(FIXTURE),
    rel(REPORT_JSON),
    rel(REPORT_MD),
    ...RENDERED_EVIDENCE,
  ], 'gate must_review');

  for (const row of packet.subagent_review_results || []) {
    if (row.verdict !== 'MORE_THAN_SATISFIED_TO_CLEAR_Q19') {
      fail(`${row.agent} verdict must be MORE_THAN_SATISFIED_TO_CLEAR_Q19`);
    }
  }
  requireIncludesAll((packet.subagent_review_results || []).map((row) => row.agent), [
    'teacher',
    'economist',
    'quality_inspection',
  ], 'package subagent results');
  if (packet.subagent_lead_review?.lead_verdict !== 'APPROVE_Q19_FINAL_RESOLUTION_EXECUTION') {
    fail('lead review verdict mismatch');
  }
  for (const row of packet.repair_subagent_review_results || []) {
    if (row.verdict !== REPAIR_REVIEW_VERDICT) {
      fail(`${row.agent} repair verdict must be ${REPAIR_REVIEW_VERDICT}`);
    }
  }
  requireIncludesAll((packet.repair_subagent_review_results || []).map((row) => row.agent), [
    'teacher',
    'economist',
    'quality_inspection',
  ], 'package repair subagent results');
  if (packet.repair_subagent_lead_review?.lead_verdict !== REPAIR_LEAD_VERDICT) {
    fail(`repair lead review verdict must be ${REPAIR_LEAD_VERDICT}`);
  }
  if (gate.review_results?.repair_lead !== REPAIR_LEAD_VERDICT) {
    fail(`gate repair lead verdict must be ${REPAIR_LEAD_VERDICT}`);
  }
  for (const key of ['repair_teacher', 'repair_economist', 'repair_quality_inspection']) {
    if (gate.review_results?.[key] !== REPAIR_REVIEW_VERDICT) {
      fail(`gate review_results.${key} must be ${REPAIR_REVIEW_VERDICT}`);
    }
  }

  for (const operation of packet.operation_evidence_surface || []) {
    const expectedRef = FINAL_REFS[operation.operation_id];
    if (!expectedRef) fail(`unexpected package operation ${operation.operation_id}`);
    if (operation.decision !== 'close_by_reviewed_equivalent') fail(`${operation.operation_id}.decision mismatch`);
    requireIncludes(operation.reviewed_equivalent_ref ? [operation.reviewed_equivalent_ref] : [], expectedRef, `${operation.operation_id}.reviewed_equivalent_ref`);
    requireEqual(operation.direct_rendered_evidence_manifest_ref, DIRECT_RENDERED_REF, `${operation.operation_id}.direct_rendered_evidence_manifest_ref`);
    requireExact(operation.required_mtu_ids || [], OPERATION_UNITS[operation.operation_id], `${operation.operation_id}.required_mtu_ids`);
    requireIncludes(operation.forbidden_mtu_ids || [], 'A45', `${operation.operation_id}.forbidden_mtu_ids`);
    requireIncludesAll(operation.forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operation.operation_id}.forbidden_route_tags`);
    requireIncludesAll(operation.rendered_evidence || [], RENDERED_EVIDENCE, `${operation.operation_id}.rendered_evidence`);
  }
}

function requireFixtureShape(fixture) {
  const q19 = findRecord(fixture, Q19_RECORD_ID);
  if (q19.question_word !== 'teken') fail('q19 question_word must be teken');
  requireExact(q19.mapped_mtu_ids || [], REQUIRED_UNITS, 'q19 mapped MTUs');
  requireNotIncludes(q19.mapped_mtu_ids || [], 'A45', 'q19 mapped MTUs');
  requireIncludesAll(q19.source_evidence_paths || [], [
    ...RENDERED_EVIDENCE,
    DIRECT_RENDERED_REF,
  ], 'q19 source evidence paths');

  for (const operationId of Object.keys(OPERATION_UNITS)) {
    const operation = findOperation(q19, operationId);
    requireExact(operation.mapped_mtu_ids || [], OPERATION_UNITS[operationId], `${operationId}.mapped_mtu_ids`);
    requireExact(operation.expected_required_mtu_ids || [], OPERATION_UNITS[operationId], `${operationId}.expected_required_mtu_ids`);
    requireIncludes(operation.reviewed_equivalent_refs || [], FINAL_REFS[operationId], `${operationId}.reviewed_equivalent_refs`);
    requireExact(operation.answer_form_reviewed_equivalent_refs || [], [ANSWER_REF], `${operationId}.answer_form_reviewed_equivalent_refs`);
    requireIncludes(operation.expected_forbidden_mtu_ids || [], 'A45', `${operationId}.expected_forbidden_mtu_ids`);
    requireIncludesAll(operation.expected_forbidden_route_tags || [], FORBIDDEN_ROUTE_TAGS, `${operationId}.expected_forbidden_route_tags`);
    requireExact(operation.review_required_hooks || [], [], `${operationId}.review_required_hooks`);
    requireExact(operation.procedure_review_required_unit_ids || [], [], `${operationId}.procedure_review_required_unit_ids`);
    requireExact(operation.expected_procedure_unit_ids || [], OPERATION_UNITS[operationId], `${operationId}.expected_procedure_unit_ids`);
    if (operation.scale_factor_expected !== false) fail(`${operationId}.scale_factor_expected must be false`);
    if (operation.incidence_or_pass_through_expected !== false) fail(`${operationId}.incidence_or_pass_through_expected must be false`);
    if (operation.missing_answer_form_expected !== false) fail(`${operationId}.missing_answer_form_expected must be false`);
    if (!Array.isArray(operation.expected_misconception_refs) || operation.expected_misconception_refs.length === 0) {
      fail(`${operationId}.expected_misconception_refs must remain populated`);
    }
  }
}

function requireValidatorState() {
  const result = runValidator();
  if (result.status !== 'passed') fail(`validator status must be passed, got ${result.status}`);
  for (const bucket of ['failed', 'review_required', 'blocked']) {
    if ((result.buckets?.[bucket] || []).length !== 0) fail(`validator ${bucket} bucket must be empty`);
  }
  for (const recordId of [Q3_RECORD_ID, Q15_RECORD_ID, Q19_RECORD_ID, Q27_RECORD_ID]) {
    requireExact(bucketIds(result, 'failed', recordId), [], `${recordId} failed assertions`);
    requireExact(bucketIds(result, 'review_required', recordId), [], `${recordId} review assertions`);
  }
  requireIncludes(bucketIds(result, 'passed'), GLOBAL_NEGATIVE, 'global negative guard');
}

function requireReportState() {
  const report = readJson(REPORT_JSON);
  const reportText = `${JSON.stringify(report)}\n${readText(REPORT_MD)}`;
  if (report.status !== 'passed') fail('report status must be passed');
  if (report.bucket_totals?.failed !== 0 || report.bucket_totals?.review_required !== 0 || report.bucket_totals?.blocked !== 0) {
    fail('report totals must be 0 failed / 0 review_required / 0 blocked');
  }
  for (const question of ['q3', 'q15', 'q19', 'q27']) {
    if (report.question_bucket_counts?.[question]?.failed !== 0 ||
        report.question_bucket_counts?.[question]?.review_required !== 0) {
      fail(`report ${question} counts must be 0/0`);
    }
    if (report.remaining_lane_status?.[question]?.blocks_mtu_h5_closure !== false) {
      fail(`report ${question} must not block MTU-H5 regression closure`);
    }
  }
  if (report.remaining_lane_status?.q19?.status !== 'clean_after_q19_final_resolution_reviewed_equivalent') {
    fail('report q19 status must be clean after final resolution');
  }
  if (report.mtu_h5_mapping_regression_surface_closed !== true) {
    fail('report must mark the MTU-H5 mapping regression surface closed');
  }
  if (report.completion_claimed !== false) fail('report must not claim product completion');
  for (const stale of [
    'q19 remains a source/graph/reasoning review blocker',
    'q19 remains a source/graph/procedure/reasoning review blocker',
    'MTU-H5 final closure and product-route readiness remain blocked until the separately held q19',
  ]) {
    if (reportText.includes(stale)) fail(`report must not include stale q19 blocker text: ${stale}`);
  }
  for (const required of [
    'q19 is clean after the final reviewed-equivalent resolution bundle',
    'MTU-H5 mapping-regression closure evidence is prepared for human review',
    'student/product use remain unauthorized',
  ]) {
    requireText(reportText, required, 'report');
  }
}

function requireSourceOverlayStillHistorical() {
  const overlay = readJson(SOURCE_OVERLAY);
  const q19Records = allQ19SourceRecords(overlay);
  if (q19Records.length !== 5) fail('source overlay must still expose five q19 records');
  for (const record of q19Records) {
    if (record.extraction_status !== 'partial_with_blocking_gap') {
      fail(`${record.extraction_id}.extraction_status must remain partial_with_blocking_gap`);
    }
    if (record.review_state !== 'blocked') fail(`${record.extraction_id}.review_state must remain blocked`);
    requireIncludesAll(record.blocking_gap_ids || [], ['q19-source-annex-gap', 'q19-graph-object-gap'], `${record.extraction_id}.blocking_gap_ids`);
  }
}

function requireNegativeGuards() {
  const fixture = readJson(FIXTURE);
  requireFixtureShape(fixture);

  const a45Clone = JSON.parse(JSON.stringify(fixture));
  const q19A45 = findRecord(a45Clone, Q19_RECORD_ID);
  const addA45 = (values) => {
    if (Array.isArray(values) && !values.includes('A45')) values.push('A45');
  };
  addA45(q19A45.mapped_mtu_ids);
  for (const operation of q19A45.official_correction_model_operations || []) addA45(operation.mapped_mtu_ids);
  let temp = writeTempFixture(a45Clone, 'mtu-h5-q19-final-a45-');
  try {
    const negative = runValidator(temp.tempFixture, true);
    for (const operationId of Object.keys(OPERATION_UNITS)) {
      requireIncludes(bucketIds(negative, 'failed', Q19_RECORD_ID), `${Q19_RECORD_ID}:${operationId}:ASSERT-OVER-TRIGGER`, 'A45 negative failed assertions');
    }
  } finally {
    fs.rmSync(temp.tempDir, { recursive: true, force: true });
  }

  const routeClone = JSON.parse(JSON.stringify(fixture));
  const q19Route = findRecord(routeClone, Q19_RECORD_ID);
  const addRoute = (values) => {
    if (Array.isArray(values) && !values.includes('full_graph_construction')) values.push('full_graph_construction');
  };
  addRoute(q19Route.mapped_route_tags);
  for (const operation of q19Route.official_correction_model_operations || []) addRoute(operation.mapped_route_tags);
  temp = writeTempFixture(routeClone, 'mtu-h5-q19-final-route-');
  try {
    const negative = runValidator(temp.tempFixture, true);
    for (const operationId of Object.keys(OPERATION_UNITS)) {
      requireIncludes(bucketIds(negative, 'failed', Q19_RECORD_ID), `${Q19_RECORD_ID}:${operationId}:ASSERT-FORBIDDEN-ROUTE-full_graph_construction`, 'forbidden route negative failed assertions');
    }
  } finally {
    fs.rmSync(temp.tempDir, { recursive: true, force: true });
  }

  const answerFormClone = JSON.parse(JSON.stringify(fixture));
  const q19Answer = findRecord(answerFormClone, Q19_RECORD_ID);
  for (const operation of q19Answer.official_correction_model_operations || []) operation.answer_form_reviewed_equivalent_refs = [];
  temp = writeTempFixture(answerFormClone, 'mtu-h5-q19-final-answer-form-');
  try {
    const negative = runValidator(temp.tempFixture, true);
    for (const operationId of Object.keys(OPERATION_UNITS)) {
      requireIncludes(bucketIds(negative, 'failed', Q19_RECORD_ID), `${Q19_RECORD_ID}:${operationId}:ASSERT-ANSWER-FORM-MISSING`, 'answer-form negative failed assertions');
    }
  } finally {
    fs.rmSync(temp.tempDir, { recursive: true, force: true });
  }

  const hookClone = JSON.parse(JSON.stringify(fixture));
  findOperation(findRecord(hookClone, Q19_RECORD_ID), 'q19-step-2').review_required_hooks = [
    'q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support',
  ];
  temp = writeTempFixture(hookClone, 'mtu-h5-q19-final-hook-');
  try {
    const negative = runValidator(temp.tempFixture);
    if (negative.status === 'passed') fail('reintroduced q19 hook negative must not pass');
    requireIncludes(bucketIds(negative, 'review_required', Q19_RECORD_ID), `${Q19_RECORD_ID}:q19-step-2:ASSERT-REVIEW-q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support`, 'hook negative review assertions');
  } finally {
    fs.rmSync(temp.tempDir, { recursive: true, force: true });
  }

  const procedureClone = JSON.parse(JSON.stringify(fixture));
  findOperation(findRecord(procedureClone, Q19_RECORD_ID), 'q19-step-1').procedure_review_required_unit_ids = ['A42'];
  temp = writeTempFixture(procedureClone, 'mtu-h5-q19-final-procedure-');
  try {
    const negative = runValidator(temp.tempFixture);
    requireIncludes(bucketIds(negative, 'review_required', Q19_RECORD_ID), `${Q19_RECORD_ID}:q19-step-1:ASSERT-PROCEDURE-REVIEW-A42`, 'procedure negative review assertions');
  } finally {
    fs.rmSync(temp.tempDir, { recursive: true, force: true });
  }

  const evidenceClone = JSON.parse(JSON.stringify(fixture));
  const q19Evidence = findRecord(evidenceClone, Q19_RECORD_ID);
  q19Evidence.source_evidence_paths = (q19Evidence.source_evidence_paths || [])
    .filter((value) => !value.includes('mtu-h5-q19-final-resolution-and-closure-bundle-1'));
  for (const operation of q19Evidence.official_correction_model_operations || []) operation.reviewed_equivalent_refs = [];
  expectFailure(() => requireFixtureShape(evidenceClone), 'temporary q19 closure-evidence-loss clone');
}

function requireSupersededHistoricalNotes() {
  for (const file of HISTORICAL_SUPERSEDED) {
    const text = readText(path.join(ROOT, file));
    requireText(text, 'superseded_by', file);
    requireText(text, 'MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1', file);
  }
}

function changedPathsFromStatus() {
  const run = git(['status', '--porcelain=v1', '--untracked-files=all']);
  if (run.status !== 0) fail(`git status failed: ${run.stderr.trim()}`);
  const paths = [];
  for (const line of run.stdout.split(/\r?\n/).filter(Boolean)) {
    let value = line.slice(3).trim();
    if (value.includes(' -> ')) value = value.split(' -> ').pop();
    paths.push(normalizePath(value));
  }
  return paths;
}

function changedPathsFromDiff(args) {
  const run = git(args);
  if (run.status !== 0) return [];
  return run.stdout.split(/\r?\n/).filter(Boolean).map(normalizePath);
}

function requireChangedPathBoundary() {
  const paths = new Set([
    ...changedPathsFromDiff(['diff', '--name-only', 'origin/main...HEAD']),
    ...changedPathsFromDiff(['diff', '--name-only']),
    ...changedPathsFromDiff(['diff', '--cached', '--name-only']),
    ...changedPathsFromStatus(),
  ]);
  for (const changedPath of paths) {
    if (FORBIDDEN_CHANGED_PREFIXES.some((prefix) => changedPath.startsWith(prefix))) {
      fail(`forbidden protected path changed: ${changedPath}`);
    }
    if (!ALLOWED_CHANGED_PATHS.has(changedPath)) fail(`unexpected changed path: ${changedPath}`);
  }
}

function requireRemoteDiscoverability(packet, gate) {
  const bundle = readText(GATE_BUNDLE);
  const urlIndex = readText(URL_INDEX);
  const agentMd = readText(AGENT_INDEX);
  const agentJson = readJson(AGENT_INDEX_JSON);
  const agentFiles = new Set(Object.values(agentJson.groups || {}).flat());
  const { owner, repo } = parseRepoFromPackageJson();
  const refs = new Set([
    ...(gate.must_review || []),
    ...(gate.evidence_base || []),
    rel(GATE_JSON),
    rel(GATE_MD),
    rel(GATE_BUNDLE),
  ]);
  for (const ref of refs) requireText(bundle, buildRawReferenceUrl(owner, repo, packet.review_branch, ref), 'bundle URLs');
  requireText(urlIndex, buildRawUrl(owner, repo, 'main', rel(GATE_BUNDLE)), 'url index');
  for (const ref of [rel(PACKAGE_JSON), rel(PACKAGE_MD), rel(__filename), rel(GATE_JSON), rel(GATE_MD), rel(GATE_BUNDLE), ...RENDERED_EVIDENCE]) {
    requireText(agentMd, ref, 'agent index markdown');
    if (!agentFiles.has(ref)) fail(`agent index JSON missing ${ref}`);
  }
}

function requireMarkdown() {
  for (const [text, context] of [[readText(PACKAGE_MD), 'package markdown'], [readText(GATE_MD), 'gate markdown']]) {
    for (const needle of [
      'MTU-H5',
      'REV-STD-1',
      'q19',
      '0 failed / 0 review_required',
      'A42',
      'D10',
      'D13',
      'A81',
      'A45',
      'full_graph_construction',
      'student/product use',
      'Scale Gate 1',
      'superseded_by',
      DIRECT_RENDERED_ANCHOR,
      'SHA-256',
      'pdftoppm',
      REPAIR_REVIEW_VERDICT,
      REPAIR_LEAD_VERDICT,
    ]) {
      requireText(text, needle, context);
    }
  }
}

function main() {
  const packet = readJson(PACKAGE_JSON);
  const gate = readJson(GATE_JSON);
  requireGitSuccess(['cat-file', '-e', `${START_COMMIT}:reports/mtu-hardening/mtu-h5-regression-fixture.json`], 'start commit must contain MTU-H5 fixture');
  requirePackage(packet, gate);
  requireRenderedEvidenceManifest(packet);
  requireFixtureShape(readJson(FIXTURE));
  requireValidatorState();
  requireReportState();
  requireSourceOverlayStillHistorical();
  requireNegativeGuards();
  requireSupersededHistoricalNotes();
  requireMarkdown();
  requireRemoteDiscoverability(packet, gate);
  requireChangedPathBoundary();
  console.log('OK MTU-H5 q19 final resolution and closure bundle 1: q19 0/0, MTU-H5 regression surface passed, product/student use still unauthorized');
}

try {
  main();
} catch (error) {
  console.error(`MTU-H5 q19 final resolution and closure bundle 1 check failed: ${error.message}`);
  process.exit(1);
}
