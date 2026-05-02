#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep generated visuals under reports/ until a later publication gate.
 * - Add new renderers through build-scripts/lib/lib-visual-state-renderer.js.
 * - Do not write to references/machine/ or lesson targets from this script.
 */

const fs = require('fs');
const path = require('path');

const { validateProcedureVisualRegistry } = require('./validate-procedure-visual-registry.js');
const {
  loadProcedureVisualData,
  buildTemplateProjectionModel,
  visualStatePublicationBlocked,
} = require('../lib/lib-procedure-visual');
const {
  requiredSurfaceIds,
  renderVisualState,
} = require('../lib/lib-visual-state-renderer');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const REPORT_JSON_PATH = 'reports/json/procedure-visual-projection-mvp.json';
const REPORT_MD_PATH = 'reports/markdown/procedure-visual-projection-mvp.md';
const SVG_DIR = 'reports/procedure-visual-projections';
const PROCEDURE_GAME_ALIGNMENT_PATH = 'reports/json/procedure-game-template-alignment.json';
const GATE_ID = 'GATE-PV5-visual-projection-mvp';
const GATE_DIR = `reports/review-gates/${GATE_ID}`;
const REVIEW_PACKET_JSON_PATH = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD_PATH = `${GATE_DIR}/review-packet.md`;
const TECHNICAL_CLOSURE_JSON_PATH = `${GATE_DIR}/technical-closure.json`;
const TECHNICAL_CLOSURE_MD_PATH = `${GATE_DIR}/technical-closure.md`;

const REQUIRED_RENDERERS = ['formula_trace', 'flowchart', 'table_trace', 'graph_stage'];
const REQUIRED_SURFACES = ['web_light', 'web_dark', 'slide', 'docx'];
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

function safeResetDir(relPath) {
  const full = repoPath(relPath);
  const resolved = path.resolve(full);
  const expected = path.resolve(repoPath('reports'));
  if (!resolved.startsWith(expected)) {
    throw new Error(`refusing to reset path outside reports/: ${relPath}`);
  }
  fs.rmSync(full, { recursive: true, force: true });
  fs.mkdirSync(full, { recursive: true });
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || '<missing>';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function writeSvg(renderResult) {
  const filename = `${renderResult.visual_state_id}--${renderResult.surface_id}.svg`;
  const relPath = `${SVG_DIR}/${filename}`;
  writeText(relPath, renderResult.svg);
  return relPath;
}

function assertNoMachinePvFiles() {
  const existing = FORBIDDEN_MACHINE_PV_FILES.filter((relPath) => fs.existsSync(repoPath(relPath)));
  if (existing.length > 0) {
    throw new Error(`Forbidden PV machine registry exists: ${existing.join(', ')}`);
  }
}

function buildReport() {
  assertNoMachinePvFiles();
  const validation = validateProcedureVisualRegistry();
  const data = loadProcedureVisualData();
  const procedureGameAlignment = readJson(PROCEDURE_GAME_ALIGNMENT_PATH);

  safeResetDir(SVG_DIR);

  const renderResults = [];
  for (const visualState of data.states) {
    const surfaces = requiredSurfaceIds(visualState);
    for (const surfaceId of surfaces) {
      const renderResult = renderVisualState(visualState, { surface_id: surfaceId });
      renderResult.svg_path = writeSvg(renderResult);
      renderResult.publication_allowed = false;
      renderResults.push(renderResult);
    }
  }

  const renderByStateSurface = new Map(
    renderResults.map((result) => [`${result.visual_state_id}:${result.surface_id}`, result])
  );
  const templateModels = data.templates.map((template) => {
    const model = buildTemplateProjectionModel(template, data.statesById);
    const visualIds = model.visual_state_sequence.filter((item) => item.found).map((item) => item.visual_state_id);
    const surfaces = unique(visualIds.flatMap((visualId) =>
      renderResults
        .filter((result) => result.visual_state_id === visualId)
        .map((result) => result.surface_id)
    ));
    const renderedVisualStates = visualIds.map((visualId) => ({
      visual_state_id: visualId,
      rendered_surfaces: renderResults
        .filter((result) => result.visual_state_id === visualId)
        .map((result) => ({
          surface_id: result.surface_id,
          renderer: result.renderer,
          svg_path: result.svg_path,
          svg_sha256: result.svg_sha256,
        })),
    }));
    return {
      ...model,
      rendered_surfaces: surfaces,
      rendered_visual_states: renderedVisualStates,
      all_visual_states_rendered: visualIds.every((visualId) =>
        requiredSurfaceIds(data.statesById.get(visualId)).every((surfaceId) =>
          renderByStateSurface.has(`${visualId}:${surfaceId}`)
        )
      ),
    };
  });

  const rendererCounts = countBy(renderResults, 'renderer');
  const surfaceCounts = countBy(renderResults, 'surface_id');
  const visualStatePublicationBlockedCount = data.states.filter(visualStatePublicationBlocked).length;
  const allRequiredRenderersPresent = REQUIRED_RENDERERS.every((renderer) => rendererCounts[renderer] > 0);
  const allRequiredSurfacesPresent = REQUIRED_SURFACES.every((surface) => surfaceCounts[surface] > 0);
  const onePilotAllCoreSurfaces = templateModels.some((model) =>
    REQUIRED_SURFACES.every((surface) => model.rendered_surfaces.includes(surface))
  );

  const checks = [
    {
      id: 'pv_registry_validates',
      status: validation.status === 'passed' ? 'passed' : 'failed',
      detail: `${validation.summary.real_template_count} templates and ${validation.summary.real_visual_state_count} visual states validate.`,
    },
    ...REQUIRED_RENDERERS.map((renderer) => ({
      id: `renderer:${renderer}`,
      status: rendererCounts[renderer] > 0 ? 'passed' : 'failed',
      detail: `${rendererCounts[renderer] || 0} SVG projection(s) rendered.`,
    })),
    ...REQUIRED_SURFACES.map((surface) => ({
      id: `surface:${surface}`,
      status: surfaceCounts[surface] > 0 ? 'passed' : 'failed',
      detail: `${surfaceCounts[surface] || 0} SVG projection(s) rendered.`,
    })),
    {
      id: 'one_pilot_core_surfaces',
      status: onePilotAllCoreSurfaces ? 'passed' : 'failed',
      detail: 'At least one pilot template renders web_light, web_dark, slide, and docx/doc proof surfaces.',
    },
    {
      id: 'procedure_game_alignment_available',
      status: procedureGameAlignment.summary.mapped_pilot_count >= 1 ? 'passed' : 'failed',
      detail: `${procedureGameAlignment.summary.mapped_pilot_count} mapped procedure-game pilot(s) available from PV.4.`,
    },
    {
      id: 'answer_model_step_order_available',
      status: templateModels.every((model) => model.answer_model_step_order.length > 0) ? 'passed' : 'failed',
      detail: `${templateModels.length} template(s) expose ordered student-visible procedure steps.`,
    },
    {
      id: 'publication_blocked',
      status: templateModels.every((model) => model.publication_blocked) && visualStatePublicationBlockedCount === data.states.length ? 'passed' : 'failed',
      detail: `${templateModels.filter((model) => model.publication_blocked).length}/${templateModels.length} templates and ${visualStatePublicationBlockedCount}/${data.states.length} visual states block student-facing publication.`,
    },
    {
      id: 'no_machine_pv_registry',
      status: 'passed',
      detail: 'No references/machine Procedure-Visual registry exists.',
    },
  ];

  const failed = checks.filter((check) => check.status !== 'passed');
  if (failed.length > 0) {
    throw new Error(`PV.5 projection checks failed: ${failed.map((check) => check.id).join(', ')}`);
  }

  const report = {
    report_id: 'procedure-visual-projection-mvp',
    sprint_id: 'PV.5',
    gate_id: GATE_ID,
    generated_by: 'build-scripts/references/build-procedure-visual-projection-mvp.js',
    generated_on: new Date().toISOString(),
    status: 'passed',
    policy: {
      report_only: true,
      machine_registry_created: false,
      student_facing_projection_authorized: false,
      dynamic_graph_manipulation_authorized: false,
      lesson_target_write_authorized: false,
    },
    summary: {
      template_count: data.templates.length,
      visual_state_count: data.states.length,
      render_result_count: renderResults.length,
      renderer_counts: rendererCounts,
      surface_counts: surfaceCounts,
      all_required_renderers_present: allRequiredRenderersPresent,
      all_required_surfaces_present: allRequiredSurfacesPresent,
      one_pilot_all_core_surfaces: onePilotAllCoreSurfaces,
      mapped_procedure_game_pilot_count: procedureGameAlignment.summary.mapped_pilot_count,
      publication_blocked_template_count: templateModels.filter((model) => model.publication_blocked).length,
      publication_blocked_visual_state_count: visualStatePublicationBlockedCount,
    },
    template_projection_models: templateModels,
    render_results: renderResults.map((result) => ({
      visual_state_id: result.visual_state_id,
      visual_type: result.visual_type,
      surface_id: result.surface_id,
      surface_key: result.surface_key,
      renderer: result.renderer,
      status: result.status,
      svg_path: result.svg_path,
      svg_sha256: result.svg_sha256,
      svg_char_count: result.svg_char_count,
      checks: result.checks,
      warnings: result.warnings,
      publication_allowed: result.publication_allowed,
    })),
    procedure_game_alignment_proof: {
      source_report: PROCEDURE_GAME_ALIGNMENT_PATH,
      mapped_pilot_count: procedureGameAlignment.summary.mapped_pilot_count,
      legacy_unmapped_count: procedureGameAlignment.summary.legacy_unmapped_count,
      student_facing_projection_allowed: procedureGameAlignment.summary.student_facing_projection_allowed,
    },
    checks,
    blocked_scope: [
      'references/machine Procedure-Visual registries',
      'student-facing PV projection',
      'dynamic graph manipulation',
      'forced procedure-game migration',
      'visual publication into lesson targets',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative use',
    ],
  };

  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, renderMarkdownReport(report));
  writeGateArtifacts(report);
  return report;
}

function renderMarkdownReport(report) {
  const renderRows = report.render_results
    .map((result) => `| ${result.visual_state_id} | ${result.visual_type} | ${result.surface_id} | ${result.renderer} | ${result.svg_path} | ${result.svg_char_count} |`)
    .join('\n');
  const templateRows = report.template_projection_models
    .map((model) => `| ${model.template_id} | ${model.source_unit_ids.join(', ')} | ${model.visual_state_sequence.map((item) => item.visual_state_id).join(', ')} | ${model.rendered_surfaces.join(', ')} | ${model.answer_model_step_order.length} | ${model.publication_blocked ? 'yes' : 'no'} |`)
    .join('\n');
  const checkRows = report.checks
    .map((check) => `| ${check.id} | ${check.status} | ${check.detail} |`)
    .join('\n');

  return `# Procedure-Visual Projection MVP

Generated by: \`${report.generated_by}\`
Generated on: ${report.generated_on}
Status: \`${report.status}\`

## Summary

- Templates: ${report.summary.template_count}
- Visual states: ${report.summary.visual_state_count}
- SVG projection proofs: ${report.summary.render_result_count}
- Renderer counts: ${Object.entries(report.summary.renderer_counts).map(([key, value]) => `${key}=${value}`).join(', ')}
- Surface counts: ${Object.entries(report.summary.surface_counts).map(([key, value]) => `${key}=${value}`).join(', ')}
- Mapped procedure-game pilots: ${report.summary.mapped_procedure_game_pilot_count}
- Student-facing projection authorized: \`${report.policy.student_facing_projection_authorized}\`
- Machine registry created: \`${report.policy.machine_registry_created}\`

## Template Projection Models

| Template | Units | Visual States | Rendered Surfaces | Answer Steps | Publication Blocked |
| --- | --- | --- | --- | ---: | --- |
${templateRows}

## Render Results

| Visual State | Type | Surface | Renderer | SVG Path | SVG Chars |
| --- | --- | --- | --- | --- | ---: |
${renderRows}

## Checks

| Check | Status | Detail |
| --- | --- | --- |
${checkRows}

## Boundary

PV.5 creates report-side SVG proofs and reusable renderer libraries only. It does not write lesson targets, create PV machine registries, authorize dynamic graph manipulation, or authorize student-facing PV projection.
`;
}

function writeGateArtifacts(report) {
  const packet = {
    gate_id: GATE_ID,
    sprint_id: 'PV.5',
    status: 'technical_report_gate',
    generated_by: 'build-scripts/references/build-procedure-visual-projection-mvp.js',
    generated_on: report.generated_on,
    mutation_authorized: false,
    machine_registry_created: false,
    student_facing_projection_authorized: false,
    dynamic_graph_manipulation_authorized: false,
    evidence: {
      projection_report: REPORT_JSON_PATH,
      svg_directory: SVG_DIR,
      procedure_game_alignment_report: PROCEDURE_GAME_ALIGNMENT_PATH,
    },
    review_questions: [
      'Do all four non-dynamic PV renderer families produce proof artifacts?',
      'Do core surfaces render for at least one pilot template?',
      'Is procedure-game alignment available without forced migration?',
      'Are answer-model step orders available from PV templates?',
      'Are publication and machine-promotion blocks preserved?',
    ],
  };
  const closure = {
    gate_id: GATE_ID,
    sprint_id: 'PV.5',
    status: 'pass_with_conditions',
    closure_type: 'technical',
    closed_on: TODAY,
    machine_registry_created: false,
    student_facing_projection_authorized: false,
    dynamic_graph_manipulation_authorized: false,
    report_outputs: [
      REPORT_JSON_PATH,
      REPORT_MD_PATH,
      SVG_DIR,
    ],
    summary: report.summary,
    conditions: [
      'Keep SVG projection proofs under reports/ until a later publication gate.',
      'Do not create references/machine Procedure-Visual registries before PV.7 or an equivalent human promotion gate.',
      'Do not expose PV projections to students before generator/projection support and publication controls exist.',
      'Do not treat static graph-stage rendering as dynamic graph manipulation.',
      'Do not authorize diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.',
    ],
  };

  writeJson(REVIEW_PACKET_JSON_PATH, packet);
  writeText(REVIEW_PACKET_MD_PATH, `# ${GATE_ID}: Review Packet

Sprint: \`PV.5\`
Status: \`technical_report_gate\`

PV.5 validates non-dynamic Procedure-Visual projection rendering for formula trace, flowchart, table trace, and static graph-stage pilot data. No student-facing publication is authorized.

## Evidence

- Projection report: \`${REPORT_JSON_PATH}\`
- SVG proof directory: \`${SVG_DIR}\`
- Procedure-game alignment report: \`${PROCEDURE_GAME_ALIGNMENT_PATH}\`

## Review Questions

${packet.review_questions.map((question) => `- ${question}`).join('\n')}

## Stop Conditions

- No \`references/machine/\` PV registry.
- No lesson-target writes.
- No dynamic graph manipulation.
- No student-facing PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
`);

  writeJson(TECHNICAL_CLOSURE_JSON_PATH, closure);
  writeText(TECHNICAL_CLOSURE_MD_PATH, `# ${GATE_ID}: Technical Closure

Sprint: \`PV.5\`
Status: \`pass_with_conditions\`

PV.5 completed the report-side visual projection MVP.

## Outputs

${closure.report_outputs.map((output) => `- \`${output}\``).join('\n')}

## Conditions

${closure.conditions.map((condition) => `- ${condition}`).join('\n')}

## Summary

- SVG projection proofs: ${report.summary.render_result_count}
- Renderer counts: ${Object.entries(report.summary.renderer_counts).map(([key, value]) => `${key}=${value}`).join(', ')}
- Surface counts: ${Object.entries(report.summary.surface_counts).map(([key, value]) => `${key}=${value}`).join(', ')}
- Mapped procedure-game pilots: ${report.summary.mapped_procedure_game_pilot_count}
`);
}

if (require.main === module) {
  const report = buildReport();
  console.log(`wrote ${REPORT_JSON_PATH}`);
  console.log(`wrote ${REPORT_MD_PATH}`);
  console.log(`wrote ${report.summary.render_result_count} SVG projection proof(s) under ${SVG_DIR}`);
}

module.exports = { buildReport };
