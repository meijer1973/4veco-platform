#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this as a release-readiness/reporting layer. It does not mint units
 *   and does not create interactive practice generators.
 * - A-domain units without GEN implementations must remain non-interactive
 *   until a later generator sprint implements and validates them.
 * - Do not write to references/machine/, references/external/, authored
 *   source files, RAG chunks, or lesson targets from this script.
 */

const fs = require('fs');
const path = require('path');

const { buildSkilltreeBundleData } = require('../../scripts/deploy');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'RX.6';
const GATE_ID = 'GATE-RX6-skilltree-generator-integration';
const TODAY = '2026-05-03';

const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const BASE_ELEMENTS_PATH = 'engines/skilltree/base-elements.js';
const DEPLOY_PATH = 'scripts/deploy.js';
const BLOCK_PATH = 'references/data/sprints/RX.6-generator-blocked-units.json';
const REPORT_JSON_PATH = 'reports/json/skilltree-generator-readiness.json';
const REPORT_MD_PATH = 'reports/markdown/skilltree-generator-readiness.md';
const GATE_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;

const BLOCKED_DOWNSTREAM_USES = [
  'student-facing skill-tree exposure for generator-blocked units',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'automatic sequencing',
  'mastery decisions',
  'summative decisions',
  'student-facing PV projection for generator-blocked units',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

function loadGenerators() {
  const moduleExports = require(repoPath(GENERATORS_PATH));
  return moduleExports.GEN || moduleExports;
}

function activeADomainUnits(units) {
  return units
    .filter((unit) => /^A\d+/.test(unit.id) && !unit.deprecated)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

function generatorName(unit) {
  return unit.generator || `GEN_${unit.id}`;
}

function generatorImplemented(unit, generators) {
  return Boolean(generators[unit.id] || generators[generatorName(unit)]);
}

function collectGeneratorBlocks() {
  const roots = [repoPath('references/data/sprints'), repoPath('reports/review-gates')];
  const blocked = new Map();
  for (const root of roots) {
    for (const full of walkFiles(root)) {
      if (!/generator-blocked-units\.json$/i.test(full)) continue;
      const rel = path.relative(REPO_ROOT, full).replace(/\\/g, '/');
      const data = JSON.parse(fs.readFileSync(full, 'utf8'));
      const ids = new Set(data.generator_blocked_units || []);
      for (const unit of data.units || []) {
        if (unit.unit_id) ids.add(unit.unit_id);
      }
      for (const unitId of ids) {
        if (!blocked.has(unitId)) blocked.set(unitId, []);
        blocked.get(unitId).push(rel);
      }
    }
  }
  return blocked;
}

function writeGeneratorBlockFile(missingUnits) {
  const block = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: 'active_block',
    generated_on: new Date().toISOString(),
    source_gate: `${GATE_DIR}/technical-closure.json`,
    blocked_reason: 'active A-domain catalog units without generator implementations must be non-interactive until a later generator sprint implements and validates them',
    student_facing_skilltree_use_allowed: false,
    pv_projection_allowed: false,
    unit_count: missingUnits.length,
    generator_blocked_units: missingUnits.map((unit) => unit.id),
    units: missingUnits.map((unit) => ({
      unit_id: unit.id,
      name: unit.name,
      generator: generatorName(unit),
      generator_implemented: false,
      generator_status: 'missing_generator_implementation',
      student_facing_skilltree_use_allowed: false,
      pv_projection_allowed: false,
      non_interactive_until_generator_validates: true,
      proof_required_to_unblock: [
        `${generatorName(unit)} implemented in the skill-tree generator layer`,
        'generator coverage validator passes',
        'deployed browser bundle exports the unit as interactive',
        'student-facing skill-tree exposure is explicitly approved in a later sprint',
      ],
    })),
    blocked_downstream_uses: BLOCKED_DOWNSTREAM_USES,
  };
  writeJson(BLOCK_PATH, block);
  return block;
}

function byId(items) {
  return new Set(items.map((item) => item.id));
}

function ids(items) {
  return items.map((item) => item.id).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function sameIds(left, right) {
  const a = ids(left);
  const b = ids(right);
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function buildReadiness() {
  const units = readJson(UNITS_PATH);
  const generators = loadGenerators();
  const activeUnits = activeADomainUnits(units);
  const interactiveUnits = activeUnits.filter((unit) => generatorImplemented(unit, generators));
  const missingUnits = activeUnits.filter((unit) => !generatorImplemented(unit, generators));
  const blockFile = writeGeneratorBlockFile(missingUnits);
  const generatorBlocks = collectGeneratorBlocks();
  const elements = require(repoPath(BASE_ELEMENTS_PATH));
  const deployBundleData = buildSkilltreeBundleData(units, generators);

  const elementInteractive = elements.SKILLS.map((skill) => ({ id: skill.id }));
  const elementBlocked = elements.GENERATOR_BLOCKED_SKILLS.map((skill) => ({ id: skill.id }));
  const deployInteractive = deployBundleData.skills.map((skill) => ({ id: skill.id }));
  const deployBlocked = deployBundleData.generatorBlockedSkills.map((skill) => ({ id: skill.id }));
  const interactiveIdSet = byId(interactiveUnits);
  const missingIdSet = byId(missingUnits);

  const rows = activeUnits.map((unit) => {
    const implemented = generatorImplemented(unit, generators);
    const blockSources = generatorBlocks.get(unit.id) || [];
    const inInteractive = interactiveIdSet.has(unit.id);
    const inMissing = missingIdSet.has(unit.id);
    return {
      unit_id: unit.id,
      name: unit.name,
      aspects: unit.aspects || [],
      declared_generator: generatorName(unit),
      generator_implemented: implemented,
      generator_blocked: !implemented,
      generator_block_sources: blockSources,
      interactive_skilltree_use_allowed: implemented,
      student_facing_skilltree_use_allowed: implemented,
      base_elements_export: inInteractive ? 'interactive' : (inMissing ? 'generator_blocked' : 'not_exported'),
      deploy_bundle_export: deployBundleData.skills.some((skill) => skill.id === unit.id)
        ? 'interactive'
        : (deployBundleData.generatorBlockedSkills.some((skill) => skill.id === unit.id) ? 'generator_blocked' : 'not_exported'),
      needs_filtered_for_interactive_tree: implemented
        ? (unit.needs || []).filter((need) => interactiveIdSet.has(need))
        : [],
      proof_required_to_unblock: implemented
        ? []
        : [
            `${generatorName(unit)} implemented in the skill-tree generator layer`,
            'generator coverage validator passes',
            'student-facing skill-tree exposure is explicitly approved in a later sprint',
          ],
    };
  });

  const untrackedMissing = rows.filter((row) => row.generator_blocked && row.generator_block_sources.length === 0);
  const blockedInteractiveLeaks = rows.filter((row) =>
    row.generator_blocked &&
    (row.base_elements_export === 'interactive' || row.deploy_bundle_export === 'interactive')
  );

  const checks = [
    {
      id: 'source_base_elements_split_matches_generators',
      status: sameIds(interactiveUnits, elementInteractive) && sameIds(missingUnits, elementBlocked) ? 'passed' : 'failed',
      detail: `${elements.SKILLS.length} interactive and ${elements.GENERATOR_BLOCKED_SKILLS.length} blocked rows in source base-elements.`,
    },
    {
      id: 'deploy_bundle_split_matches_source',
      status: sameIds(elementInteractive, deployInteractive) && sameIds(elementBlocked, deployBlocked) ? 'passed' : 'failed',
      detail: `${deployBundleData.skills.length} interactive and ${deployBundleData.generatorBlockedSkills.length} blocked rows in deploy bundle data.`,
    },
    {
      id: 'blocked_units_have_explicit_noninteractive_status',
      status: untrackedMissing.length === 0 ? 'passed' : 'failed',
      detail: `${missingUnits.length - untrackedMissing.length}/${missingUnits.length} missing-generator units have explicit generator-block records.`,
    },
    {
      id: 'no_missing_generator_unit_is_interactive',
      status: blockedInteractiveLeaks.length === 0 ? 'passed' : 'failed',
      detail: `${blockedInteractiveLeaks.length} blocked unit(s) leaked into interactive exports.`,
    },
    {
      id: 'student_facing_controls_preserved',
      status: rows.every((row) => row.generator_implemented || row.student_facing_skilltree_use_allowed === false) ? 'passed' : 'failed',
      detail: 'Missing-generator rows are marked student_facing_skilltree_use_allowed=false.',
    },
    {
      id: 'rx6_generator_block_file_written',
      status: blockFile.unit_count === missingUnits.length ? 'passed' : 'failed',
      detail: `${BLOCK_PATH} records ${blockFile.unit_count} blocked unit(s).`,
    },
  ];

  const failedChecks = checks.filter((check) => check.status !== 'passed');
  const report = {
    schema_version: 1,
    report_id: 'skilltree-generator-readiness',
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-skilltree-generator-readiness.js',
    generated_on: new Date().toISOString(),
    status: failedChecks.length === 0 ? 'passed' : 'failed',
    policy: {
      diagnostic_only: true,
      student_facing_skilltree_use_authorized: false,
      generator_exposure_for_blocked_units_authorized: false,
      pv_projection_authorized: false,
      lesson_target_write_authorized: false,
      machine_registry_created: false,
    },
    source_files: [
      UNITS_PATH,
      GENERATORS_PATH,
      BASE_ELEMENTS_PATH,
      DEPLOY_PATH,
      BLOCK_PATH,
    ],
    summary: {
      active_a_domain_count: activeUnits.length,
      interactive_skill_count: interactiveUnits.length,
      generator_blocked_count: missingUnits.length,
      explicit_generator_block_count: rows.filter((row) => row.generator_blocked && row.generator_block_sources.length > 0).length,
      untracked_missing_generator_count: untrackedMissing.length,
      deploy_interactive_skill_count: deployBundleData.skills.length,
      deploy_generator_blocked_count: deployBundleData.generatorBlockedSkills.length,
      blocked_interactive_leak_count: blockedInteractiveLeaks.length,
    },
    rows,
    checks,
    blocked_scope: BLOCKED_DOWNSTREAM_USES,
  };

  if (failedChecks.length > 0) {
    report.failure_details = failedChecks.map((check) => `${check.id}: ${check.detail}`);
  }

  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, renderMarkdown(report));
  writeGateArtifacts(report);

  if (failedChecks.length > 0) {
    throw new Error(`skilltree generator readiness failed: ${failedChecks.map((check) => check.id).join(', ')}`);
  }
  return report;
}

function renderMarkdown(report) {
  const rows = report.rows.map((row) => [
    row.unit_id,
    row.name,
    row.generator_implemented ? 'yes' : 'no',
    row.generator_blocked ? 'yes' : 'no',
    row.base_elements_export,
    row.deploy_bundle_export,
    row.student_facing_skilltree_use_allowed ? 'yes' : 'no',
    row.generator_block_sources.join(', '),
  ]);
  const checkRows = report.checks.map((check) => [check.id, check.status, check.detail]);
  return `# Skilltree Generator Readiness

Generated by: \`${report.generated_by}\`
Generated on: ${report.generated_on}
Status: \`${report.status}\`

## Summary

- Active A-domain units: ${report.summary.active_a_domain_count}
- Interactive generator-backed skilltree units: ${report.summary.interactive_skill_count}
- Generator-blocked A-domain units: ${report.summary.generator_blocked_count}
- Explicit generator-block records: ${report.summary.explicit_generator_block_count}
- Untracked missing generators: ${report.summary.untracked_missing_generator_count}
- Deployed interactive units: ${report.summary.deploy_interactive_skill_count}
- Deployed blocked rows: ${report.summary.deploy_generator_blocked_count}

## Policy

This report is diagnostic/release-readiness proof only. It does not implement generators and does not authorize student-facing exposure for blocked units.

## Unit Readiness

${markdownTable(
    ['Unit', 'Name', 'Generator', 'Blocked', 'Source Export', 'Deploy Export', 'Student Use', 'Block Sources'],
    rows
  )}

## Checks

${markdownTable(['Check', 'Status', 'Detail'], checkRows)}
`;
}

function markdownTable(headers, rows) {
  const lines = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    lines.push(`| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>')).join(' | ')} |`);
  }
  return lines.join('\n');
}

function writeGateArtifacts(report) {
  const packet = {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: 'technical_release_readiness_gate',
    generated_by: 'build-scripts/references/build-skilltree-generator-readiness.js',
    generated_on: report.generated_on,
    human_review_required: false,
    machine_registry_created: false,
    student_facing_skilltree_use_authorized: false,
    evidence: {
      readiness_report: REPORT_JSON_PATH,
      generator_block_file: BLOCK_PATH,
      skilltree_test: 'npx.cmd jest engines/tests/skilltree-data.test.js --runInBand',
    },
    review_questions: [
      'Does the skill-tree expose only generator-backed units as interactive?',
      'Are all missing-generator units explicitly marked non-interactive?',
      'Does the deploy browser bundle preserve the same split as source base-elements?',
      'Are student-facing skill-tree/PV/diagnostic/adaptive uses still blocked for missing-generator units?',
    ],
  };
  const closure = {
    gate_id: GATE_ID,
    sprint_id: SPRINT_ID,
    status: report.status === 'passed' ? 'pass_with_conditions' : 'failed',
    closure_type: 'technical',
    closed_on: TODAY,
    student_facing_skilltree_use_authorized: false,
    generator_exposure_for_blocked_units_authorized: false,
    pv_projection_authorized: false,
    report_outputs: [
      REPORT_JSON_PATH,
      REPORT_MD_PATH,
      BLOCK_PATH,
    ],
    summary: report.summary,
    conditions: [
      'Keep generator-blocked A-domain units non-interactive until their generators exist and validate.',
      'Do not expose generator-blocked units in student-facing skill-tree or PV projection.',
      'Do not authorize diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.',
      'Remove a unit from the generator-block list only through a later validated generator sprint.',
    ],
  };
  writeJson(REVIEW_PACKET_JSON_PATH, packet);
  writeText(REVIEW_PACKET_MD_PATH, `# ${GATE_ID}: Review Packet

Sprint: \`${SPRINT_ID}\`
Status: \`technical_release_readiness_gate\`

RX.6 makes skill-tree generator readiness explicit. It does not implement new generators and does not authorize student-facing use for generator-blocked units.

## Evidence

- Readiness report: \`${REPORT_JSON_PATH}\`
- Generator block file: \`${BLOCK_PATH}\`
- Test command: \`npx.cmd jest engines/tests/skilltree-data.test.js --runInBand\`

## Review Questions

${packet.review_questions.map((question) => `- ${question}`).join('\n')}

## Stop Conditions

- No missing-generator A-domain unit may appear as an interactive skill.
- The deploy browser bundle must preserve the same split as source \`base-elements.js\`.
- No student-facing skill-tree/PV/diagnostic/adaptive/mastery/summative use is authorized for blocked units.
`);
  writeJson(TECHNICAL_CLOSURE_JSON_PATH, closure);
  writeText(TECHNICAL_CLOSURE_MD_PATH, `# ${GATE_ID}: Technical Closure

Sprint: \`${SPRINT_ID}\`
Status: \`${closure.status}\`

RX.6 completed skill-tree generator integration by separating generator-backed interactive nodes from explicit non-interactive generator-blocked catalog units.

## Outputs

${closure.report_outputs.map((output) => `- \`${output}\``).join('\n')}

## Summary

- Active A-domain units: ${report.summary.active_a_domain_count}
- Interactive skilltree units: ${report.summary.interactive_skill_count}
- Generator-blocked units: ${report.summary.generator_blocked_count}
- Untracked missing generators: ${report.summary.untracked_missing_generator_count}
- Deployed blocked rows: ${report.summary.deploy_generator_blocked_count}

## Conditions

${closure.conditions.map((condition) => `- ${condition}`).join('\n')}
`);
}

if (require.main === module) {
  const report = buildReadiness();
  console.log(`wrote ${REPORT_JSON_PATH}`);
  console.log(`wrote ${REPORT_MD_PATH}`);
  console.log(`wrote ${BLOCK_PATH}`);
}

module.exports = { buildReadiness };
