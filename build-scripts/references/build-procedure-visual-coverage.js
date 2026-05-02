#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep PV coverage as a dashboard/report layer, not curriculum authority.
 * - Extend coverage dimensions here when later PV gates add publication or
 *   machine-promotion fields.
 * - Do not write to references/machine/ or lesson targets from this script.
 */

const fs = require('fs');
const path = require('path');

const {
  loadProcedureVisualData,
  answerModelStepOrder,
  templatePublicationBlocked,
} = require('../lib/lib-procedure-visual');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_JSON_PATH = 'reports/json/procedure-visual-coverage.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-coverage.md';
const PROJECTION_REPORT_PATH = 'reports/json/procedure-visual-projection-mvp.json';
const GAME_ALIGNMENT_REPORT_PATH = 'reports/json/procedure-game-template-alignment.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const GATE_ID = 'GATE-PV6-coverage-dashboard';
const GATE_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;
const TODAY = '2026-05-02';

const FORBIDDEN_MACHINE_PV_FILES = [
  'references/machine/procedure-templates.json',
  'references/machine/visual-states.json',
  'references/machine/procedure-visual-vocab.json',
  'references/machine/procedure-visual.json',
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

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = selector(item) || '<missing>';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
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

function loadGenerators() {
  try {
    const moduleExports = require(repoPath(GENERATORS_PATH));
    return moduleExports.GEN || moduleExports;
  } catch (error) {
    return {};
  }
}

function assertNoMachinePvFiles() {
  const existing = FORBIDDEN_MACHINE_PV_FILES.filter((relPath) => fs.existsSync(repoPath(relPath)));
  if (existing.length > 0) throw new Error(`Forbidden PV machine registry exists: ${existing.join(', ')}`);
}

function byId(items, field) {
  return new Map(items.map((item) => [item[field], item]));
}

function buildCoverage() {
  assertNoMachinePvFiles();
  const data = loadProcedureVisualData();
  const units = readJson(UNITS_PATH);
  const unitsById = byId(units, 'id');
  const projectionReport = readJson(PROJECTION_REPORT_PATH);
  const gameReport = readJson(GAME_ALIGNMENT_REPORT_PATH);
  const generatorBlocks = collectGeneratorBlocks();
  const generators = loadGenerators();
  const renderByVisualState = new Map();
  for (const result of projectionReport.render_results || []) {
    if (!renderByVisualState.has(result.visual_state_id)) renderByVisualState.set(result.visual_state_id, []);
    renderByVisualState.get(result.visual_state_id).push(result);
  }
  const mappedGameByUnit = new Map();
  for (const alignment of gameReport.alignments || []) {
    if (alignment.unit_id && alignment.status === 'mapped') {
      mappedGameByUnit.set(alignment.unit_id, alignment);
    }
  }

  const linkedUnitRows = (data.links || []).map((link) => {
    const unit = unitsById.get(link.unit_id);
    const template = data.templatesById.get(link.template_id);
    const stepOrder = template ? answerModelStepOrder(template) : [];
    const visualStateIds = template
      ? unique((template.procedure_steps || []).map((step) => step.visual_state_ref))
      : [];
    const surfaceVariants = unique(visualStateIds.flatMap((visualStateId) =>
      (renderByVisualState.get(visualStateId) || []).map((result) => result.surface_id)
    ));
    const renderProofs = visualStateIds.flatMap((visualStateId) =>
      (renderByVisualState.get(visualStateId) || []).map((result) => ({
        visual_state_id: visualStateId,
        surface_id: result.surface_id,
        svg_path: result.svg_path,
      }))
    );
    const isADomain = /^A\d+/.test(link.unit_id);
    const generatorImplemented = Boolean(generators[link.unit_id] || (unit && unit.generator && generators[unit.generator]));
    const generatorBlocked = generatorBlocks.has(link.unit_id);
    const blockerReasons = unique([
      ...(link.projection_blockers || []),
      ...(template ? template.blockers || [] : []),
      ...(generatorBlocked ? ['generator_blocked_non_interactive'] : []),
      ...(!generatorImplemented && isADomain ? ['generator_missing'] : []),
      ...(link.publication && link.publication.student_facing_allowed === false ? ['student_facing_projection_blocked'] : []),
    ]);
    return {
      unit_id: link.unit_id,
      unit_name: unit ? unit.name : null,
      template_id: link.template_id,
      link_status: link.status,
      has_procedure_template: Boolean(template),
      has_visual_state_sequence: visualStateIds.length > 0,
      visual_state_ids: visualStateIds,
      has_surface_variants: surfaceVariants.length > 0,
      surface_variants: surfaceVariants,
      render_proof_count: renderProofs.length,
      render_proofs: renderProofs,
      has_game_mapping: mappedGameByUnit.has(link.unit_id),
      game_mapping_status: mappedGameByUnit.has(link.unit_id) ? 'mapped' : 'not_mapped_or_not_applicable',
      has_answer_model_projection: Boolean(template && template.projections && template.projections.answer_model && stepOrder.length > 0),
      answer_model_step_count: stepOrder.length,
      has_generator_support: generatorImplemented,
      generator_status: generatorImplemented ? 'implemented' : (isADomain ? 'missing_or_blocked' : 'not_applicable_or_not_skilltree'),
      generator_blocked: generatorBlocked,
      generator_block_sources: generatorBlocks.get(link.unit_id) || [],
      publication_allowed: Boolean(link.publication && link.publication.student_facing_allowed),
      blocker_reasons: blockerReasons,
      template_publication_blocked: template ? templatePublicationBlocked(template) : false,
    };
  });

  const templateRows = data.templates.map((template) => {
    const visualStateIds = unique((template.procedure_steps || []).map((step) => step.visual_state_ref));
    const surfaces = unique(visualStateIds.flatMap((visualStateId) =>
      (renderByVisualState.get(visualStateId) || []).map((result) => result.surface_id)
    ));
    return {
      template_id: template.template_id,
      source_unit_ids: template.source_unit_ids || [],
      representation: template.representation,
      projections: template.projections || {},
      visual_state_ids: visualStateIds,
      rendered_surfaces: surfaces,
      answer_model_step_count: answerModelStepOrder(template).length,
      publication_blocked: templatePublicationBlocked(template),
      blockers: template.blockers || [],
    };
  });

  const checks = [
    {
      id: 'pv_linked_units_present',
      status: linkedUnitRows.length >= 6 ? 'passed' : 'failed',
      detail: `${linkedUnitRows.length} PV-linked unit row(s).`,
    },
    {
      id: 'surface_variants_available',
      status: linkedUnitRows.some((row) => row.has_surface_variants) ? 'passed' : 'failed',
      detail: `${linkedUnitRows.filter((row) => row.has_surface_variants).length}/${linkedUnitRows.length} linked units have rendered surface variants.`,
    },
    {
      id: 'game_mapping_visible',
      status: linkedUnitRows.some((row) => row.has_game_mapping) ? 'passed' : 'failed',
      detail: `${linkedUnitRows.filter((row) => row.has_game_mapping).length} mapped procedure-game unit(s).`,
    },
    {
      id: 'answer_model_projection_visible',
      status: linkedUnitRows.every((row) => row.has_answer_model_projection) ? 'passed' : 'failed',
      detail: `${linkedUnitRows.filter((row) => row.has_answer_model_projection).length}/${linkedUnitRows.length} linked units expose answer-model step order.`,
    },
    {
      id: 'generator_blocks_preserved',
      status: linkedUnitRows.some((row) => row.generator_blocked) ? 'passed' : 'failed',
      detail: `${linkedUnitRows.filter((row) => row.generator_blocked).length} linked unit(s) remain generator-blocked.`,
    },
    {
      id: 'publication_blocks_preserved',
      status: linkedUnitRows.every((row) => row.publication_allowed === false && row.template_publication_blocked === true) ? 'passed' : 'failed',
      detail: `${linkedUnitRows.filter((row) => row.publication_allowed === false).length}/${linkedUnitRows.length} linked units block publication.`,
    },
    {
      id: 'no_machine_pv_registry',
      status: 'passed',
      detail: 'No references/machine Procedure-Visual registry exists.',
    },
  ];

  const failed = checks.filter((check) => check.status !== 'passed');
  if (failed.length > 0) {
    throw new Error(`PV coverage checks failed: ${failed.map((check) => check.id).join(', ')}`);
  }

  const report = {
    report_id: 'procedure-visual-coverage',
    sprint_id: 'PV.6',
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-procedure-visual-coverage.js',
    generated_on: new Date().toISOString(),
    status: 'passed',
    policy: {
      diagnostic_only: true,
      curriculum_authority: false,
      machine_registry_created: false,
      student_facing_projection_authorized: false,
      generator_exposure_authorized: false,
      lesson_target_write_authorized: false,
    },
    source_files: [
      'references/data/procedure-visual/procedure-templates.json',
      'references/data/procedure-visual/visual-states.json',
      'references/data/procedure-visual/unit-template-links.json',
      PROJECTION_REPORT_PATH,
      GAME_ALIGNMENT_REPORT_PATH,
      UNITS_PATH,
      GENERATORS_PATH,
    ],
    summary: {
      live_unit_count: units.filter((unit) => !unit.deprecated).length,
      pv_linked_unit_count: linkedUnitRows.length,
      template_count: data.templates.length,
      visual_state_count: data.states.length,
      linked_units_with_visual_state_sequence: linkedUnitRows.filter((row) => row.has_visual_state_sequence).length,
      linked_units_with_surface_variants: linkedUnitRows.filter((row) => row.has_surface_variants).length,
      linked_units_with_game_mapping: linkedUnitRows.filter((row) => row.has_game_mapping).length,
      linked_units_with_answer_model_projection: linkedUnitRows.filter((row) => row.has_answer_model_projection).length,
      linked_units_with_generator_support: linkedUnitRows.filter((row) => row.has_generator_support).length,
      linked_units_generator_blocked: linkedUnitRows.filter((row) => row.generator_blocked).length,
      linked_units_publication_allowed: linkedUnitRows.filter((row) => row.publication_allowed).length,
      render_proof_count: linkedUnitRows.reduce((sum, row) => sum + row.render_proof_count, 0),
      blocker_reason_counts: countBy(linkedUnitRows.flatMap((row) => row.blocker_reasons.map((reason) => ({ reason }))), (item) => item.reason),
    },
    linked_unit_coverage: linkedUnitRows,
    template_coverage: templateRows,
    checks,
    blocked_scope: [
      'PV machine registry promotion',
      'student-facing PV projection',
      'generator exposure for blocked units',
      'lesson target writes',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative use',
    ],
  };

  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, renderMarkdown(report));
  writeGateArtifacts(report);
  return report;
}

function renderMarkdown(report) {
  const unitRows = report.linked_unit_coverage.map((row) => [
    row.unit_id,
    row.template_id,
    row.has_visual_state_sequence ? 'yes' : 'no',
    row.surface_variants.join(', '),
    row.has_game_mapping ? 'yes' : 'no',
    row.has_answer_model_projection ? 'yes' : 'no',
    row.has_generator_support ? 'yes' : 'no',
    row.generator_blocked ? 'yes' : 'no',
    row.blocker_reasons.join(', '),
  ]);
  const checkRows = report.checks.map((check) => [check.id, check.status, check.detail]);
  return `# Procedure-Visual Coverage

Generated by: \`${report.generated_by}\`
Generated on: ${report.generated_on}
Status: \`${report.status}\`

## Summary

- PV-linked units: ${report.summary.pv_linked_unit_count}
- Templates: ${report.summary.template_count}
- Visual states: ${report.summary.visual_state_count}
- Linked units with visual-state sequence: ${report.summary.linked_units_with_visual_state_sequence}
- Linked units with surface variants: ${report.summary.linked_units_with_surface_variants}
- Linked units with game mapping: ${report.summary.linked_units_with_game_mapping}
- Linked units with answer-model projection: ${report.summary.linked_units_with_answer_model_projection}
- Linked units with generator support: ${report.summary.linked_units_with_generator_support}
- Linked units generator-blocked: ${report.summary.linked_units_generator_blocked}
- Linked units publication allowed: ${report.summary.linked_units_publication_allowed}

## Policy

PV coverage is diagnostic/dashboard context only. It is not curriculum authority and does not authorize student-facing PV projection or generator exposure.

## Linked Unit Coverage

${markdownTable(
    ['Unit', 'Template', 'Visual Seq', 'Surfaces', 'Game Mapping', 'Answer Model', 'Generator', 'Generator Blocked', 'Blockers'],
    unitRows
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
    sprint_id: 'PV.6',
    status: 'technical_report_gate',
    generated_by: 'build-scripts/references/build-procedure-visual-coverage.js',
    generated_on: report.generated_on,
    human_review_required: false,
    machine_registry_created: false,
    student_facing_projection_authorized: false,
    evidence: {
      coverage_report: REPORT_JSON_PATH,
      reference_health: 'reports/json/reference-health.json',
    },
    review_questions: [
      'Does PV coverage distinguish templates, visual states, surface variants, game mapping, answer-model step order, generator support, and blockers?',
      'Does the dashboard summary preserve diagnostic-only and non-authority flags?',
      'Are generator-blocked units still visible as blocked?',
    ],
  };
  const closure = {
    gate_id: GATE_ID,
    sprint_id: 'PV.6',
    status: 'pass_with_conditions',
    closure_type: 'technical',
    closed_on: TODAY,
    machine_registry_created: false,
    student_facing_projection_authorized: false,
    generator_exposure_authorized: false,
    report_outputs: [
      REPORT_JSON_PATH,
      REPORT_MD_PATH,
      'reports/json/reference-health.json',
      'reports/markdown/reference-health.md',
    ],
    summary: report.summary,
    conditions: [
      'Keep PV coverage diagnostic-only until a later human publication or promotion gate.',
      'Do not create references/machine Procedure-Visual registries before PV.7 or equivalent gate approval.',
      'Do not expose generator-blocked units to student-facing skill-tree or PV projection.',
      'Do not authorize diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.',
    ],
  };
  writeJson(REVIEW_PACKET_JSON_PATH, packet);
  writeText(REVIEW_PACKET_MD_PATH, `# ${GATE_ID}: Review Packet

Sprint: \`PV.6\`
Status: \`technical_report_gate\`

PV.6 integrates Procedure-Visual coverage into reports and reference health. No student-facing PV projection or machine promotion is authorized.

## Evidence

- Coverage report: \`${REPORT_JSON_PATH}\`
- Reference health: \`reports/json/reference-health.json\`

## Review Questions

${packet.review_questions.map((question) => `- ${question}`).join('\n')}

## Stop Conditions

- No \`references/machine/\` PV registry.
- No lesson-target writes.
- No generator exposure for blocked units.
- No student-facing PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
`);
  writeJson(TECHNICAL_CLOSURE_JSON_PATH, closure);
  writeText(TECHNICAL_CLOSURE_MD_PATH, `# ${GATE_ID}: Technical Closure

Sprint: \`PV.6\`
Status: \`pass_with_conditions\`

PV.6 completed Procedure-Visual coverage and dashboard integration.

## Outputs

${closure.report_outputs.map((output) => `- \`${output}\``).join('\n')}

## Conditions

${closure.conditions.map((condition) => `- ${condition}`).join('\n')}

## Summary

- PV-linked units: ${report.summary.pv_linked_unit_count}
- Linked units with surface variants: ${report.summary.linked_units_with_surface_variants}
- Linked units with game mapping: ${report.summary.linked_units_with_game_mapping}
- Linked units generator-blocked: ${report.summary.linked_units_generator_blocked}
`);
}

if (require.main === module) {
  const report = buildCoverage();
  console.log(`wrote ${REPORT_JSON_PATH}`);
  console.log(`wrote ${REPORT_MD_PATH}`);
  console.log(`wrote ${TECHNICAL_CLOSURE_JSON_PATH}`);
}

module.exports = { buildCoverage };
