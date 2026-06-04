#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sprintId = 'CONTEXT-VISUAL-STD-1';
const standardPath = path.join('reports', 'sprints', `${sprintId}-visual-standard.md`);
const contractPath = path.join('reports', 'json', 'context-visual-std1-contract.json');
const specContractPath = path.join('reports', 'json', 'task-context-spec1-contract.json');
const runtimeProofPath = path.join('reports', 'json', 'task-context-runtime1-proof.json');
const runtimeCssPath = path.join('engines', 'task-shell.css');
const runtimeUiPath = path.join('engines', 'task-shell-ui.js');

const requiredBlockTypes = [
  'markdown',
  'source_excerpt',
  'table',
  'svg_figure',
  'graph',
  'flowchart',
  'formula',
  'info_box',
];

const requiredRoadmapTerms = [
  'semantic_tables',
  'reconstructed_svg_graphs',
  'reconstructed_svg_figures',
  'reconstructed_svg_flowcharts',
  'formula_boxes',
  'source_cards',
  'captions',
  'labels',
  'color_tokens',
  'typography',
  'spacing',
  'mobile_behavior',
  'dark_mode',
  'axis_conventions',
  'legend_conventions',
  'svg_sizing',
  'alt_text',
  'source_label_rules',
];

const requiredTokenRoles = [
  'surface',
  'panel',
  'soft_panel',
  'text_primary',
  'text_muted',
  'border',
  'source_accent',
  'comparison_accent',
  'focus_ring',
  'formula_surface',
];

const requiredProductBoundaryKeys = [
  'runtime_css_or_ui_changes_authorized',
  'source_reconstruction_authorized',
  'exam_or_textbook_ingestion_authorized',
  'task_transformation_authorized',
  'generated_lesson_output_authorized',
  'protected_reference_mutation_authorized',
  'source_data_mutation_authorized',
  'product_route_adoption_authorized',
  'target_equivalent_proof_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_or_sequencing_authorized',
  'pv_authorized',
  'scale_gate_1_authorized',
  'student_product_use_authorized',
];

const standardRequiredPhrases = [
  'semantic tables',
  'reconstructed SVG graphs',
  'reconstructed SVG figures',
  'flowcharts',
  'formula boxes',
  'source cards',
  'captions',
  'color tokens',
  'typography',
  'spacing',
  'mobile',
  'dark mode',
  'axis',
  'legend',
  'SVG sizing',
  'alt text',
  'source-label',
  'raw copied screenshot',
  'source-output parity',
  'DUAL-CODING-STD-1',
];

function fail(message) {
  console.error(`Context visual standard check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  assert(fs.existsSync(file), `missing file: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function readText(file) {
  assert(fs.existsSync(file), `missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function sameArray(actual, expected, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} must match required values exactly`);
}

function requireStringArray(value, label) {
  assert(Array.isArray(value) && value.length > 0, `${label} must be a non-empty array`);
  value.forEach((item, index) => {
    assert(typeof item === 'string' && item.trim(), `${label}[${index}] must be a non-empty string`);
  });
}

function runGitStatus(args, label) {
  const result = spawnSync('git', args, { cwd: process.cwd(), encoding: 'utf8' });
  assert(result.status === 0, `${label} git status failed: ${result.stderr || result.stdout}`);
  return (result.stdout || '').trim();
}

const standard = readText(standardPath);
const contract = readJson(contractPath);
const specContract = readJson(specContractPath);
const runtimeProof = readJson(runtimeProofPath);
const runtimeCss = readText(runtimeCssPath);
const runtimeUi = readText(runtimeUiPath);

assert(contract.schema_version === 1, 'contract schema_version must be 1');
assert(contract.sprint_id === sprintId, 'contract has wrong sprint_id');
assert(contract.status === 'visual_standard_only', 'contract status must be visual_standard_only');
assert(contract.standard_path === standardPath.replace(/\\/g, '/'), 'contract must point to visual standard');
assert(contract.source_contract_path === specContractPath.replace(/\\/g, '/'), 'contract must point to TASK-CONTEXT-SPEC-1 contract');
assert(contract.runtime_proof_path === runtimeProofPath.replace(/\\/g, '/'), 'contract must point to TASK-CONTEXT-RUNTIME-1 proof');

sameArray(contract.allowedBlockTypes, requiredBlockTypes, 'allowedBlockTypes');
sameArray(specContract.allowedBlockTypes, requiredBlockTypes, 'TASK-CONTEXT-SPEC-1 allowedBlockTypes');
sameArray(contract.roadmap_terms, requiredRoadmapTerms, 'roadmap_terms');

for (const phrase of standardRequiredPhrases) {
  assert(standard.toLowerCase().includes(phrase.toLowerCase()), `visual standard missing phrase: ${phrase}`);
}

for (const role of requiredTokenRoles) {
  assert(contract.visualTokens && contract.visualTokens[role], `missing visual token role ${role}`);
  assert(typeof contract.visualTokens[role].purpose === 'string' && contract.visualTokens[role].purpose.trim(), `token ${role} needs purpose`);
  assert(typeof contract.visualTokens[role].baseline === 'string' && contract.visualTokens[role].baseline.trim(), `token ${role} needs baseline`);
}

assert(contract.labelRules && contract.labelRules.internalIdsVisible === false, 'internal IDs must be declared hidden');
['Bron', 'Tabel', 'Figuur', 'Schema', 'Formule'].forEach((family) => {
  assert(contract.labelRules.allowedFamilies.includes(family), `label family missing: ${family}`);
});
for (const type of requiredBlockTypes) {
  assert(contract.labelRules.byBlockType[type], `missing label rule for ${type}`);
}

for (const type of requiredBlockTypes) {
  const rule = contract.blockVisualRules && contract.blockVisualRules[type];
  assert(rule, `missing blockVisualRules for ${type}`);
  ['layout', 'typography', 'source_label', 'caption', 'accessibility', 'mobile', 'dark_mode', 'source_output_parity', 'proof'].forEach((key) => {
    requireStringArray(rule[key], `${type}.${key}`);
  });
}

assert(contract.blockVisualRules.table.layout.includes('semantic_table'), 'table rule must require semantic table');
assert(contract.blockVisualRules.table.layout.includes('no_image_table_shortcut'), 'table rule must reject image-table shortcut');
assert(contract.blockVisualRules.svg_figure.layout.includes('stable_viewBox'), 'svg_figure rule must require stable viewBox');
assert(contract.blockVisualRules.svg_figure.layout.includes('no_raw_copied_image'), 'svg_figure rule must reject raw copied image');
assert(contract.blockVisualRules.graph.axis_convention, 'graph rule must define axis convention');
assert(contract.blockVisualRules.graph.legend_convention, 'graph rule must define legend convention');
requireStringArray(contract.blockVisualRules.graph.axis_convention, 'graph.axis_convention');
requireStringArray(contract.blockVisualRules.graph.legend_convention, 'graph.legend_convention');
assert(contract.blockVisualRules.flowchart.layout.includes('arrow_direction_visible'), 'flowchart rule must require arrow direction');
assert(contract.blockVisualRules.formula.layout.includes('monospace_expression'), 'formula rule must require monospace expression');

const proof = contract.proofProfiles || {};
[
  'source_map',
  'visual_fidelity_notes',
  'desktop_light_screenshot',
  'mobile_light_screenshot_390px',
  'mobile_dark_screenshot_390px',
  'alt_text_inventory',
  'checker_output',
  'lead_review_rendered_output',
].forEach((artifact) => {
  assert(proof.future_required_artifacts && proof.future_required_artifacts.includes(artifact), `missing future proof artifact ${artifact}`);
});
['source_output_parity', 'student_legibility', 'mobile_layout', 'dark_mode_contrast', 'accessibility', 'no_internal_ids', 'no_answer_leakage'].forEach((dimension) => {
  assert(proof.review_dimensions && proof.review_dimensions.includes(dimension), `missing review dimension ${dimension}`);
});

assert(contract.sourceOutputParity.source_map_required_for_reconstruction === true, 'source map must be required');
assert(contract.sourceOutputParity.visual_fidelity_notes_required === true, 'visual fidelity notes must be required');
assert(contract.sourceOutputParity.raw_copied_images_allowed === false, 'raw copied images must be disallowed');
assert(contract.sourceOutputParity.human_waiver_required_for_raw_image === true, 'raw-image waiver must be required');
['values', 'labels', 'units', 'axes', 'legends', 'row_order', 'node_order', 'formula_variables'].forEach((item) => {
  assert(contract.sourceOutputParity.compare.includes(item), `source-output parity compare missing ${item}`);
});

assert(contract.mobileDarkRequirements.mobile_viewport_width_px === 390, 'mobile proof width must be 390 px');
assert(contract.mobileDarkRequirements.requires_mobile_light_screenshot === true, 'mobile light proof required');
assert(contract.mobileDarkRequirements.requires_mobile_dark_screenshot === true, 'mobile dark proof required');
assert(contract.mobileDarkRequirements.requires_desktop_light_screenshot === true, 'desktop proof required');
['axes', 'legends', 'labels', 'table_borders', 'arrows', 'formula_operators', 'source_references'].forEach((item) => {
  assert(contract.mobileDarkRequirements.dark_mode_must_not_hide.includes(item), `dark mode must not hide ${item}`);
});

const crosswalk = contract.currentRuntimeCrosswalk || {};
assert(crosswalk.runtime_proof === runtimeProofPath.replace(/\\/g, '/'), 'runtime crosswalk must point to runtime proof');
['.ts-context', '.ts-context-block', '.ts-context-table', '.ts-context-svg', '.ts-context-graph', '.ts-context-formula', '.ts-context-flow', '.ts-context-refs a'].forEach((selector) => {
  assert(Object.values(crosswalk.selectors || {}).includes(selector), `crosswalk missing selector ${selector}`);
});
assert(runtimeCss.includes('.ts-context'), 'runtime CSS baseline must include context styles');
assert(runtimeCss.includes('[data-theme="dark"]'), 'runtime CSS baseline must include dark theme tokens');
assert(runtimeCss.includes('@media (max-width: 640px)'), 'runtime CSS baseline must include mobile rules');
assert(runtimeUi.includes('renderContextBlocks'), 'runtime UI baseline must expose context rendering');
assert(runtimeProof.sprint_id === 'TASK-CONTEXT-RUNTIME-1', 'runtime proof must come from TASK-CONTEXT-RUNTIME-1');
assert(runtimeProof.context_runtime.context_before_tasks === true, 'runtime proof must show context before tasks');
assert(runtimeProof.context_runtime.visible_internal_context_ids === false, 'runtime proof must show no visible internal IDs');

assert(contract.dualCodingAbsorption.main_visual_source_policy_absorbed === true, 'dual-coding visual-source policy must be absorbed');
[
  'source_cards',
  'semantic_tables',
  'reconstructed_svg_figures',
  'reconstructed_svg_graphs',
  'reconstructed_svg_flowcharts',
  'formula_boxes',
  'captions',
  'source_labels',
  'alt_text',
  'mobile_dark_proof',
].forEach((item) => {
  assert(contract.dualCodingAbsorption.absorbed_scope.includes(item), `dual-coding absorption missing ${item}`);
});

for (const key of requiredProductBoundaryKeys) {
  assert(contract.productBoundary && contract.productBoundary[key] === false, `productBoundary.${key} must be false`);
}

const protectedStatus = runGitStatus(['status', '--short', '--', 'references/machine', 'references/external'], 'protected reference');
assert(!protectedStatus, `protected references changed unexpectedly: ${protectedStatus}`);
const sourceDataStatus = runGitStatus(['status', '--short', '--', 'source-data'], 'source-data');
assert(!sourceDataStatus, `source-data changed unexpectedly: ${sourceDataStatus}`);
const lessonBookStatus = runGitStatus(
  [
    '-c',
    'safe.directory=C:/Projects/4veco/4veco-lessen',
    '-C',
    '../4veco-lessen',
    'status',
    '--short',
    '--',
    'Boek 1 - Grondslagen, vraag en aanbod',
  ],
  'Book 1 generated output'
);
assert(!lessonBookStatus, `generated Book 1 output changed unexpectedly: ${lessonBookStatus}`);

console.log('OK context visual standard: coverage, contract, runtime crosswalk, and boundaries pass');
