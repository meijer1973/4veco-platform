#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`Sprint bundle check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function readMarkdown(file) {
  return fs.readFileSync(file, 'utf8');
}

function exists(file, label) {
  if (!fs.existsSync(file)) fail(`missing ${label}: ${file}`);
}

function runNode(script, target) {
  const result = spawnSync(process.execPath, [script, target], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`validator failed: node ${script} ${target}`);
  }
}

function toPosix(file) {
  return file.replace(/\\/g, '/');
}

function resolvePlanPath(sprintId) {
  const coLocatedPlanPath = path.join('reports', 'sprints', `${sprintId}-plan.md`);
  const legacyPlanPath = path.join('docs', 'sprints', `${sprintId}-plan.md`);
  if (fs.existsSync(coLocatedPlanPath)) return coLocatedPlanPath;
  if (fs.existsSync(legacyPlanPath)) return legacyPlanPath;
  return coLocatedPlanPath;
}

function leadReviewPaths(sprintId) {
  return {
    assignment: path.join('reports', 'sprints', `${sprintId}-lead-review-assignment.md`),
    round1: path.join('reports', 'sprints', `${sprintId}-lead-review-round1.md`),
    corrections: path.join('reports', 'sprints', `${sprintId}-lead-review-corrections.md`),
    round2: path.join('reports', 'sprints', `${sprintId}-lead-review-round2.md`),
  };
}

const LEAD_REVIEW_POLICY_EFFECTIVE_ON = '2026-05-31';
const LEAD_REVIEW_STRICT_SCHEMA_VERSION = 2;
const COMMAND_LOG_POLICY_EFFECTIVE_ON = '2026-06-03';
const LEGACY_EXEMPTIONS_PATH = path.join(
  'references',
  'data',
  'sprints',
  'lead-review-policy-legacy-exemptions.json'
);
const REQUIRED_LEAD_REVIEW_SECTIONS = [
  '## Scope',
  '## Review Plan',
  '## Consolidated Verdict',
  '## Blocking Findings',
  '## Specialist Findings',
  '## Test Evidence',
  '## Learning Quality Evidence',
  '## Student Experience Evidence',
  '## Ownership and Handoff',
  '## Required Next Action',
];

function dateOnOrAfter(value, cutoff) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && value.slice(0, 10) >= cutoff;
}

function hasLeadReviewExemption(planJson) {
  const exemption = planJson.lead_review_exemption;
  return Boolean(
    exemption &&
      typeof exemption === 'object' &&
      typeof exemption.reason === 'string' &&
      exemption.reason.trim() &&
      typeof exemption.approved_by === 'string' &&
      exemption.approved_by.trim() &&
      typeof exemption.approval_evidence === 'string' &&
      exemption.approval_evidence.trim() &&
      typeof exemption.reviewed_on === 'string' &&
      exemption.reviewed_on.trim()
  );
}

function loadLegacyLeadReviewExemptions() {
  if (!fs.existsSync(LEGACY_EXEMPTIONS_PATH)) {
    fail(`missing lead-review legacy exemption list: ${LEGACY_EXEMPTIONS_PATH}`);
  }
  const data = readJson(LEGACY_EXEMPTIONS_PATH);
  if (data.schema_version !== 1) fail(`${LEGACY_EXEMPTIONS_PATH} must have schema_version 1`);
  if (!Array.isArray(data.grandfathered_sprint_ids)) {
    fail(`${LEGACY_EXEMPTIONS_PATH} must include grandfathered_sprint_ids`);
  }
  return new Set(data.grandfathered_sprint_ids);
}

function inferHumanGate(planMarkdown, sprintId) {
  return (
    /^GATE-/.test(sprintId) ||
    /human-interview\.md|gate-closure\.json|review-packet\.md|Review Packet|Calibration Questions|Full Planned Review Questions|Human Review And Gate Closure/i.test(
      planMarkdown
    )
  );
}

function countBacktickedPaths(markdown) {
  const matches = markdown.match(/`(?:reports|references|build-scripts|engines|docs|AGENTS\.md|..\/4veco-lessen)[^`]*`/g);
  return matches ? matches.length : 0;
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : '';
}

function validateLeadReviewReport(file, sprintId, roundLabel, expectedFinalVerdict) {
  const markdown = readMarkdown(file);
  if (!/^# Lead Review Summary/m.test(markdown)) {
    fail(`${file} must start with "# Lead Review Summary"`);
  }
  if (!new RegExp(`Sprint:\\s*\`${sprintId}\``).test(markdown)) {
    fail(`${file} must identify Sprint: \`${sprintId}\``);
  }
  if (!new RegExp(`Round:\\s*${roundLabel}`, 'i').test(markdown)) {
    fail(`${file} must identify Round: ${roundLabel}`);
  }
  for (const heading of REQUIRED_LEAD_REVIEW_SECTIONS) {
    if (!markdown.includes(heading)) fail(`${file} missing required lead-review section: ${heading}`);
  }
  if (!/Evidence inspected:/i.test(section(markdown, '## Scope'))) {
    fail(`${file} Scope must include Evidence inspected`);
  }
  if (countBacktickedPaths(markdown) < 3) {
    fail(`${file} must cite at least three inspected paths in backticks`);
  }
  if (!/\|\s*Review\/Test\s*\|\s*Agent or tool\s*\|\s*Required evidence\s*\|\s*Status\s*\|/i.test(section(markdown, '## Review Plan'))) {
    fail(`${file} Review Plan must include Review/Test, Agent or tool, Required evidence, and Status columns`);
  }
  const verdictMatch = section(markdown, '## Consolidated Verdict').match(/Verdict:\s*(PASS WITH FLAGS|PASS|REVISE|FAIL|PAUSE)/i);
  if (!verdictMatch) fail(`${file} Consolidated Verdict must include a verdict`);
  const verdict = verdictMatch[1].toUpperCase();
  if (expectedFinalVerdict && verdict !== expectedFinalVerdict.toUpperCase()) {
    fail(`${file} verdict ${verdict} must match result metadata final verdict ${expectedFinalVerdict}`);
  }
  if (expectedFinalVerdict && verdict === 'PASS WITH FLAGS' && !/flag/i.test(markdown)) {
    fail(`${file} PASS WITH FLAGS must describe carried flags`);
  }
  if (!/(None|No blocking|blocking)/i.test(section(markdown, '## Blocking Findings'))) {
    fail(`${file} Blocking Findings must explicitly state whether blockers exist`);
  }
  if (section(markdown, '## Required Next Action').length < 20) {
    fail(`${file} Required Next Action must be concrete`);
  }
}

function validateLeadReviewSupportFile(file, sprintId, label, requiredPatterns) {
  const markdown = readMarkdown(file);
  if (!new RegExp(sprintId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(markdown)) {
    fail(`${file} must identify sprint ${sprintId}`);
  }
  for (const [name, pattern] of requiredPatterns) {
    if (!pattern.test(markdown)) fail(`${file} missing ${label} content: ${name}`);
  }
}

function validateLeadReviewFlags(resultJsonPath, leadReview) {
  if (leadReview.final_verdict === 'PASS') {
    if (Array.isArray(leadReview.flags) && leadReview.flags.length > 0) {
      fail(`${resultJsonPath} lead_review.flags must be empty or omitted when final_verdict is PASS`);
    }
    return;
  }
  if (leadReview.final_verdict !== 'PASS WITH FLAGS') return;
  if (!Array.isArray(leadReview.flags) || leadReview.flags.length === 0) {
    fail(`${resultJsonPath} lead_review.flags must list carried flags when final_verdict is PASS WITH FLAGS`);
  }
  for (const [index, flag] of leadReview.flags.entries()) {
    if (!flag || typeof flag !== 'object') {
      fail(`${resultJsonPath} lead_review.flags[${index}] must be an object`);
    }
    for (const key of ['id', 'description', 'disposition', 'owner', 'next_action']) {
      if (typeof flag[key] !== 'string' || !flag[key].trim()) {
        fail(`${resultJsonPath} lead_review.flags[${index}].${key} must be a non-empty string`);
      }
    }
    if (!/^(carry_forward|accepted_follow_up|product_scale_blocker|waived_by_human)$/.test(flag.disposition)) {
      fail(`${resultJsonPath} lead_review.flags[${index}].disposition has unsupported value: ${flag.disposition}`);
    }
    if (flag.blocking !== false) {
      fail(`${resultJsonPath} lead_review.flags[${index}].blocking must be false for PASS WITH FLAGS`);
    }
  }
}

function readCommandLog(sprintId) {
  const file = path.join('reports', 'sprints', `${sprintId}-command-log.jsonl`);
  if (!fs.existsSync(file)) fail(`missing command log: ${file}`);
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        fail(`${file}:${index + 1} invalid JSON: ${error.message}`);
      }
    });
}

function validateCommandLogEvidence(sprintId, resultJsonPath, resultJson) {
  const entries = readCommandLog(sprintId);
  for (const [index, test] of resultJson.acceptance_tests.entries()) {
    if (!test || test.status !== 'passed') continue;
    if (typeof test.command !== 'string' || !test.command.trim()) {
      fail(`${resultJsonPath} acceptance_tests[${index}].command must be a non-empty string`);
    }
    if (canSkipCurrentlyRunningCommand(test.command)) continue;
    const matched = entries.some((entry) => entry.command === test.command && entry.exit_code === 0);
    if (!matched) {
      fail(`${resultJsonPath} passed command lacks command-log exit_code 0 evidence: ${test.command}`);
    }
  }
}

function quoteArg(arg) {
  if (/^[A-Za-z0-9_./:+=@%-]+$/.test(arg)) return arg;
  return JSON.stringify(arg);
}

function currentInvocationCommand() {
  const script = path.relative(process.cwd(), process.argv[1]).replace(/\\/g, '/');
  return ['node', script, ...process.argv.slice(2)].map(quoteArg).join(' ');
}

function canSkipCurrentlyRunningCommand(command) {
  return process.env.SPRINT_COMMAND_UNDER_RUN === command && currentInvocationCommand() === command;
}

function requireBacktickedPath(markdown, sectionHeading, expectedPath) {
  const pattern = new RegExp(`## ${sectionHeading}\\s+([\\s\\S]*?)(?=\\n## |$)`);
  const match = markdown.match(pattern);
  if (!match) fail(`missing ${sectionHeading} section`);
  if (!match[1].includes(`\`${expectedPath}\``)) {
    fail(`${sectionHeading} must reference \`${expectedPath}\``);
  }
}

const args = process.argv.slice(2);
const sprintId = args.find((arg) => !arg.startsWith('--'));
const requireComplete = args.includes('--complete');
const allowTestFixture =
  process.env.SPRINT_BUNDLE_ALLOW_TEST_FIXTURES === '1' && /^TEST-[A-Z-]+-\d+[A-Z]?$/.test(args.find((arg) => !arg.startsWith('--')) || '');

if (!sprintId) fail('missing sprint id, for example R2.3');
if (!/^(?:[A-Z]\d+(?:\.\d+)?[A-Z]?(?:-[A-Z0-9]+)?|[A-Z]{2,}\.\d+[a-z]?|[A-Z]{2,}-(?:[A-Z]+\d+[A-Z]?|\d+[A-Z]?)|[A-Z]+(?:-[A-Z]+)*-\d+[A-Z]?|(?=.*\d)[A-Z0-9.]+(?:-[A-Z0-9.]+)+)$/.test(sprintId) && sprintId !== 'EXAMPLE') {
  fail(`unexpected sprint id format: ${sprintId}`);
}

const planPath = resolvePlanPath(sprintId);
const planJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.plan.json`);
const baselinePath = path.join('reports', 'sprints', `${sprintId}-baseline.md`);
const resultPath = path.join('reports', 'sprints', `${sprintId}-result.md`);
const diffPath = path.join('reports', 'sprints', `${sprintId}-diff-summary.md`);
const resultJsonPath = path.join('references', 'data', 'sprints', `${sprintId}.result.json`);

exists(planPath, 'sprint plan');
exists(planJsonPath, 'sprint plan JSON');
exists(baselinePath, 'sprint baseline');

runNode(path.join('build-scripts', 'sprints', 'check-sprint-plan.js'), planPath);
runNode(path.join('build-scripts', 'sprints', 'check-scope-language.js'), planJsonPath);

const planJson = readJson(planJsonPath);
const planMarkdown = readMarkdown(planPath);
if (planJson.sprint_id !== sprintId) fail(`${planJsonPath} has wrong sprint_id`);
if (planJson.plan !== toPosix(planPath)) fail(`${planJsonPath} must point to ${planPath}`);
if (!Array.isArray(planJson.acceptance_tests) || planJson.acceptance_tests.length === 0) {
  fail(`${planJsonPath} must include acceptance_tests`);
}
if (typeof planJson.protected_reference_data_changes_allowed !== 'boolean') {
  fail(`${planJsonPath} must declare protected_reference_data_changes_allowed`);
}
const legacyLeadReviewExemptions = loadLegacyLeadReviewExemptions();
const isLegacyLeadReviewExempt = legacyLeadReviewExemptions.has(sprintId);
const isHumanGate = planJson.human_review_required === true || inferHumanGate(planMarkdown, sprintId);
const leadPolicyApplies =
  sprintId !== 'EXAMPLE' &&
  (!isLegacyLeadReviewExempt ||
    dateOnOrAfter(planJson.created, LEAD_REVIEW_POLICY_EFFECTIVE_ON) ||
    planJson.lead_review_required === true);
const commandLogPolicyApplies = dateOnOrAfter(planJson.created, COMMAND_LOG_POLICY_EFFECTIVE_ON);
if (leadPolicyApplies && planJson.lead_review_required !== true && !hasLeadReviewExemption(planJson)) {
  fail(
    `${planJsonPath} must declare lead_review_required: true or a lead_review_exemption for sprints created on or after ${LEAD_REVIEW_POLICY_EFFECTIVE_ON}`
  );
}
if (leadPolicyApplies && !isLegacyLeadReviewExempt && planJson.lead_review_schema_version !== LEAD_REVIEW_STRICT_SCHEMA_VERSION) {
  fail(`${planJsonPath} must declare lead_review_schema_version: ${LEAD_REVIEW_STRICT_SCHEMA_VERSION}`);
}
if (leadPolicyApplies && isHumanGate && planJson.lead_review_exemption) {
  fail(`${planJsonPath} human-review sprints cannot use lead_review_exemption`);
}
if (
  leadPolicyApplies &&
  isHumanGate &&
  planJson.lead_review_phase !== 'before_human_gate'
) {
  fail(`${planJsonPath} human-review sprints must set lead_review_phase: "before_human_gate"`);
}
if (inferHumanGate(planMarkdown, sprintId)) {
  if (planJson.human_review_required !== true) fail(`${planJsonPath} must declare human_review_required: true`);
  if (!planJson.gate_id) fail(`${planJsonPath} must declare gate_id`);
  if (!planJson.review_packet) fail(`${planJsonPath} must declare review_packet`);
  if (!Array.isArray(planJson.valid_gate_statuses) || planJson.valid_gate_statuses.length === 0) {
    fail(`${planJsonPath} must declare valid_gate_statuses`);
  }
}

const baseline = readMarkdown(baselinePath);
if (!new RegExp(`# Sprint ${sprintId}: Baseline`).test(baseline)) {
  fail(`${baselinePath} must start with "# Sprint ${sprintId}: Baseline"`);
}
requireBacktickedPath(baseline, 'Plan reference', toPosix(planPath));
if (!/## Data integrity notes/.test(baseline)) fail(`${baselinePath} must include Data integrity notes`);
if (!/references\/machine\/|references\/external\/|protected reference data/i.test(baseline)) {
  fail(`${baselinePath} must mention protected reference data status`);
}

if (requireComplete) {
  exists(resultPath, 'sprint result');
  exists(diffPath, 'sprint diff summary');
  exists(resultJsonPath, 'sprint result JSON');

  runNode(path.join('build-scripts', 'sprints', 'check-sprint-result.js'), resultPath);

  const resultJson = readJson(resultJsonPath);
  if (resultJson.sprint_id !== sprintId) fail(`${resultJsonPath} has wrong sprint_id`);
  if (resultJson.status !== 'completed') fail(`${resultJsonPath} must have status "completed"`);
  if (resultJson.plan !== toPosix(planPath)) fail(`${resultJsonPath} must point to ${planPath}`);
  if (resultJson.baseline !== toPosix(baselinePath)) fail(`${resultJsonPath} must point to ${baselinePath}`);
  if (resultJson.result !== toPosix(resultPath)) fail(`${resultJsonPath} must point to ${resultPath}`);
  if (resultJson.diff_summary !== toPosix(diffPath)) fail(`${resultJsonPath} must point to ${diffPath}`);
  if (!Array.isArray(resultJson.acceptance_tests) || resultJson.acceptance_tests.length === 0) {
    fail(`${resultJsonPath} must include acceptance_tests`);
  }
  for (const [index, test] of resultJson.acceptance_tests.entries()) {
    if (!test || typeof test.command !== 'string' || typeof test.status !== 'string') {
      fail(`${resultJsonPath} acceptance_tests[${index}] must include command and status`);
    }
    if (!/^(passed|failed|skipped_with_reason)$/.test(test.status)) {
      fail(`${resultJsonPath} acceptance_tests[${index}] has unsupported status: ${test.status}`);
    }
  }
  if (commandLogPolicyApplies) {
    validateCommandLogEvidence(sprintId, resultJsonPath, resultJson);
  }
  if (typeof resultJson.protected_reference_data_changed !== 'boolean') {
    fail(`${resultJsonPath} must declare protected_reference_data_changed`);
  }

  const leadReviewRequired =
    leadPolicyApplies ||
    planJson.lead_review_required === true ||
    resultJson.lead_review_required === true ||
    Boolean(resultJson.lead_review);
  const strictLeadPolicyApplies = leadPolicyApplies && !isLegacyLeadReviewExempt;
  if (leadReviewRequired) {
    const expected = leadReviewPaths(sprintId);
    const leadReview = resultJson.lead_review;
    if (!leadReview || typeof leadReview !== 'object') {
      fail(`${resultJsonPath} must include lead_review when lead review is required`);
    }
    for (const [key, file] of Object.entries(expected)) {
      exists(file, `lead review ${key}`);
      if (leadReview[key] !== toPosix(file)) {
        fail(`${resultJsonPath} lead_review.${key} must point to ${toPosix(file)}`);
      }
    }
    if (!['PASS', 'PASS WITH FLAGS'].includes(leadReview.final_verdict)) {
      fail(`${resultJsonPath} lead_review.final_verdict must be PASS or PASS WITH FLAGS`);
    }
    if (strictLeadPolicyApplies) {
      if (resultJson.lead_review_schema_version !== LEAD_REVIEW_STRICT_SCHEMA_VERSION) {
        fail(`${resultJsonPath} must declare lead_review_schema_version: ${LEAD_REVIEW_STRICT_SCHEMA_VERSION}`);
      }
      validateLeadReviewSupportFile(expected.assignment, sprintId, 'assignment', [
        ['scope', /scope|artifact|task/i],
        ['evidence', /evidence|inspect/i],
        ['reviewer', /lead reviewer|agent/i],
      ]);
      validateLeadReviewReport(expected.round1, sprintId, 'lead review round 1');
      validateLeadReviewSupportFile(expected.corrections, sprintId, 'corrections', [
        ['round-1 verdict', /round-?1|round 1/i],
        ['correction record', /correction|applied|resolved|accepted/i],
        ['round-2 readiness', /round-?2|round 2|recheck/i],
      ]);
      validateLeadReviewReport(expected.round2, sprintId, 'lead review round 2', leadReview.final_verdict);
      validateLeadReviewFlags(resultJsonPath, leadReview);
      if (commandLogPolicyApplies) {
        const substanceResult = spawnSync(
          process.execPath,
          [path.join('build-scripts', 'sprints', 'check-lead-review-substance.js'), sprintId],
          { cwd: process.cwd(), encoding: 'utf8' }
        );
        if (substanceResult.status !== 0) {
          process.stderr.write(substanceResult.stdout || '');
          process.stderr.write(substanceResult.stderr || '');
          fail(`validator failed: node build-scripts/sprints/check-lead-review-substance.js ${sprintId}`);
        }
      }
    }
  }

  if (commandLogPolicyApplies) {
    const batchResult = spawnSync(
      process.execPath,
      [path.join('build-scripts', 'sprints', 'check-batch-sprint-closure.js'), '--working-tree'],
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    if (batchResult.status !== 0) {
      process.stderr.write(batchResult.stdout || '');
      process.stderr.write(batchResult.stderr || '');
      fail('validator failed: node build-scripts/sprints/check-batch-sprint-closure.js --working-tree');
    }
  }

  const diff = readMarkdown(diffPath);
  if (!new RegExp(`# Sprint ${sprintId}: Diff Summary`).test(diff)) {
    fail(`${diffPath} must start with "# Sprint ${sprintId}: Diff Summary"`);
  }
  if (!/references\/machine\/|references\/external\/|Protected surfaces/i.test(diff)) {
    fail(`${diffPath} must mention protected surfaces`);
  }

  if (planJson.gate_id) {
    runNode(path.join('build-scripts', 'sprints', 'check-bundle-urls.js'), planJson.gate_id);
  }

  // url-index.md must reflect the current set of gates and their bundle-urls.md
  // files; rerun the emitter and diff against disk via the --check mode.
  const indexResult = spawnSync(
    process.execPath,
    [path.join('build-scripts', 'sprints', 'emit-url-index.js'), '--check'],
    { cwd: process.cwd(), encoding: 'utf8' }
  );
  if (indexResult.status !== 0) {
    process.stderr.write(indexResult.stdout || '');
    process.stderr.write(indexResult.stderr || '');
    fail('reports/url-index.md is stale or missing');
  }
}

const roadmapPath = path.join('references', 'reference-team-roadmap.md');
if (fs.existsSync(roadmapPath) && !allowTestFixture) {
  const roadmap = readMarkdown(roadmapPath);
  const rowPattern = new RegExp(`\\| ${sprintId.replace('.', '\\.')} \\|[^\\n]+\\| (yes|no) \\|`);
  const row = roadmap.match(rowPattern);
  if (!row) fail(`${roadmapPath} must include ${sprintId} in the sprint ledger`);
  if (requireComplete && row[1] !== 'yes') {
    fail(`${roadmapPath} must mark ${sprintId} completed when --complete is used`);
  }
}

console.log(`OK sprint bundle: ${sprintId}${requireComplete ? ' complete' : ' planned/active'}`);
