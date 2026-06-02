#!/usr/bin/env node
/**
 * Validate REASON-PLAY-1 usability-agent and screenshot proof artifacts.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');

function fail(message) {
  console.error(`REASON-PLAY-1 usability check failed: ${message}`);
  process.exit(1);
}

function readText(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) fail(`missing ${relPath}`);
  return fs.readFileSync(fullPath, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(readText(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function requireFalseFlags(authority, source) {
  const forbidden = [
    'target_equivalent_claims_authorized',
    'completion_language_authorized',
    'diagnostics_authorized',
    'adaptive_routing_authorized',
    'mastery_or_sequencing_authorized',
    'student_facing_ai_authorized',
    'summative_use_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'student_or_product_use_authorized'
  ];
  for (const key of forbidden) {
    if (Object.prototype.hasOwnProperty.call(authority || {}, key) && authority[key] !== false) {
      fail(`${source} must keep ${key}=false`);
    }
  }
}

function containsAll(text, relPath, patterns) {
  for (const pattern of patterns) {
    if (!pattern.test(text)) fail(`${relPath} missing required pattern ${pattern}`);
  }
}

const assignment = readText('reports/sprints/REASON-PLAY-1-usability-agent-assignment.md');
containsAll(assignment, 'assignment', [
  /observable decision points/i,
  /1\.1\.1[\s\S]*\|\s*`0`/i,
  /1\.1\.2[\s\S]*\|\s*`1`/i,
  /1\.1\.3[\s\S]*\|\s*`3`/i,
  /1\.1\.1[\s\S]*\|\s*`5`/i,
  /Do not report private chain-of-thought/i,
  /Forbidden Claims/i
]);

const usability = readJson('reports/json/reason-play1-usability.json');
if (usability.sprint_id !== 'REASON-PLAY-1') fail('usability JSON has wrong sprint_id');
if (usability.status !== 'pass_with_flags') fail('usability JSON must record pass_with_flags');
if (!Array.isArray(usability.evidence && usability.evidence.agent_reports) || usability.evidence.agent_reports.length < 2) {
  fail('usability JSON must list at least two agent reports');
}
if (!Array.isArray(usability.case_decisions) || usability.case_decisions.length < 4) {
  fail('usability JSON must include at least four case decisions');
}
for (const required of [
  ['1.1.1', 0],
  ['1.1.2', 1],
  ['1.1.3', 3],
  ['1.1.1', 5]
]) {
  const found = usability.case_decisions.some((entry) => entry.paragraph === required[0] && entry.mode === required[1]);
  if (!found) fail(`missing case decision ${required[0]} mode ${required[1]}`);
}
if (!usability.risk_decisions || usability.risk_decisions.dual_feedback !== 'acceptable_with_flag') {
  fail('dual feedback decision must be acceptable_with_flag');
}
if (!usability.risk_decisions || usability.risk_decisions.mobile_route_panel !== 'carry_flag') {
  fail('mobile route-panel decision must carry flag');
}
if (!usability.risk_decisions || usability.risk_decisions.compact_controls !== 'carry_accessibility_adoption_flag') {
  fail('compact controls decision must carry accessibility/adoption flag');
}
if (!usability.repair_decision || usability.repair_decision.blocking_repair_required !== false) {
  fail('repair decision must record no blocking repair required');
}
requireFalseFlags(usability.authority, 'usability JSON');

for (const relPath of usability.evidence.agent_reports) {
  const report = readText(relPath);
  containsAll(report, relPath, [
    /PASS WITH FLAGS/i,
    /1\.1\.1[\s\S]*mode\s*0/i,
    /1\.1\.2[\s\S]*mode\s*1/i,
    /1\.1\.3[\s\S]*mode\s*3/i,
    /mode\s*5/i,
    /Dual feedback/i,
    /Mobile route/i,
    /Dark/i,
    /Compact/i
  ]);
}

const analysis = readText('reports/sprints/REASON-PLAY-1-usability-analysis.md');
containsAll(analysis, 'analysis', [
  /PASS WITH FLAGS/i,
  /No blocking repair/i,
  /deterministic rendered-output capture/i,
  /compact/i,
  /mobile route-panel/i,
  /dark/i,
  /flow-diagram/i,
  /does not authorize target-equivalent/i
]);

const screenshotProof = readJson('reports/json/reason-play1-screenshot-proof.json');
if (screenshotProof.sprint_id !== 'REASON-PLAY-1') fail('screenshot proof has wrong sprint_id');
if (!Array.isArray(screenshotProof.cases) || screenshotProof.cases.length < 5) {
  fail('screenshot proof must include at least five cases');
}
requireFalseFlags(screenshotProof.authority, 'screenshot proof');
for (const name of [
  'desktop-light-111-mode0-compact-controls',
  'desktop-light-111-mode0-retry-dual-feedback',
  'desktop-light-112-mode1-matched-next-action',
  'mobile-light-113-mode3-route-placement',
  'desktop-dark-111-mode5-route-contrast'
]) {
  const entry = screenshotProof.cases.find((item) => item.name === name);
  if (!entry) fail(`missing screenshot proof case ${name}`);
  if (!entry.routeText || !entry.shellText || !entry.taskFamily) fail(`${name} lacks route/task proof text`);
  const screenshot = path.join(root, entry.screenshot || '');
  if (!fs.existsSync(screenshot)) fail(`${name} screenshot missing: ${entry.screenshot}`);
  const size = fs.statSync(screenshot).size;
  if (size < 20000) fail(`${name} screenshot appears too small: ${size} bytes`);
}

const manifest = readText('reports/sprints/REASON-PLAY-1-screenshot-manifest.md');
containsAll(manifest, 'screenshot manifest', [
  /desktop-light-111-mode0-compact-controls/,
  /desktop-light-111-mode0-retry-dual-feedback/,
  /desktop-light-112-mode1-matched-next-action/,
  /mobile-light-113-mode3-route-placement/,
  /desktop-dark-111-mode5-route-contrast/
]);

console.log('OK REASON-PLAY-1 usability proof');
