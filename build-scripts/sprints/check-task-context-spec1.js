#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CONTRACT_PATH = path.join('reports', 'json', 'task-context-spec1-contract.json');
const EXAM_AUTHORITY_PATH = path.join('reports', 'json', 'exam-source-authority1-contract.json');

const REQUIRED_BLOCK_TYPES = [
  'markdown',
  'source_excerpt',
  'table',
  'svg_figure',
  'graph',
  'flowchart',
  'formula',
  'info_box',
];

const REQUIRED_NEGATIVES = [
  'missing_alt_text',
  'missing_context_refs',
  'unknown_context_ref',
  'unreferenced_source_block',
  'answer_hint_leakage',
  'raw_copied_image',
  'inconsistent_caption',
  'internal_code_exposure',
];

const BOUNDARY_KEYS = [
  'runtime_rendering_authorized',
  'source_reconstruction_authorized',
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

function fail(message) {
  console.error(`Task context spec check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, label, errors) {
  if (typeof value !== 'string' || value.trim().length === 0) errors.push(`${label} must be a non-empty string`);
}

function collectStudentText(value, out = []) {
  if (typeof value === 'string') {
    const text = value.trim();
    if (text) out.push(text);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStudentText(item, out));
    return out;
  }
  if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (['id', 'type', 'sourceMaterialId', 'sourceRefs', 'sourceAuthority'].includes(key)) continue;
      collectStudentText(item, out);
    }
  }
  return out;
}

function hasInternalCode(text) {
  return /\b(?:MTU|PV|A\d{2}|G\d{2}|D\d{2})\b/.test(text);
}

function hasAnswerLeak(text) {
  return /correctAnswer|expectedResponse|answerIs|antwoord\s+is|juiste antwoord|(?:EUR|€|euro)\s*649|649\s*(?:EUR|€|euro)/i.test(text);
}

function checkStudentText(value, label, errors) {
  for (const text of collectStudentText(value)) {
    if (hasInternalCode(text)) errors.push(`${label} exposes internal code`);
    if (hasAnswerLeak(text)) errors.push(`${label} leaks answer hint`);
  }
}

function validateBlock(block, rules, sourceAuthority, errors) {
  if (!isObject(block)) {
    errors.push('context block must be an object');
    return;
  }
  requireString(block.id, 'context block id', errors);
  if (block.id && !/^ctx-[a-z0-9-]+$/.test(block.id)) errors.push(`context block ${block.id} has unstable id`);
  if (!REQUIRED_BLOCK_TYPES.includes(block.type)) errors.push(`context block ${block.id || '<missing>'} has unsupported type ${block.type}`);

  const rule = rules[block.type];
  if (!rule) return;
  for (const key of rule.required || []) {
    if (!(key in block)) errors.push(`${block.id} missing required field ${key}`);
  }
  if (rule.altTextRequired) requireString(block.altText, `${block.id}.altText`, errors);
  if (rule.captionPrefix) {
    requireString(block.caption, `${block.id}.caption`, errors);
    if (typeof block.caption === 'string' && !block.caption.startsWith(`${rule.captionPrefix} `)) {
      errors.push(`${block.id} caption must start with ${rule.captionPrefix}`);
    }
  }
  if (block.type === 'table') {
    if (!Array.isArray(block.columns) || block.columns.length === 0) errors.push(`${block.id} table columns required`);
    if (!Array.isArray(block.rows) || block.rows.length === 0) errors.push(`${block.id} table rows required`);
  }
  if (block.type === 'svg_figure') {
    if (block.rawCopiedImage === true || block.rawImagePath) errors.push(`${block.id} uses raw copied image`);
    if (!block.reconstruction || block.reconstruction.status !== 'reconstructed_from_source') {
      errors.push(`${block.id} requires reconstruction metadata`);
    }
    if (block.reconstruction && block.reconstruction.rawCopiedImage !== false) {
      errors.push(`${block.id} reconstruction must declare rawCopiedImage false`);
    }
    if (
      sourceAuthority &&
      block.reconstruction &&
      block.reconstruction.sourceMaterialId !== sourceAuthority.source_material_id
    ) {
      errors.push(`${block.id} reconstruction sourceMaterialId must match sourceAuthority`);
    }
  }
  if (sourceAuthority && block.sourceMaterialId && block.sourceMaterialId !== sourceAuthority.source_material_id) {
    errors.push(`${block.id} sourceMaterialId must match sourceAuthority`);
  }
  if (sourceAuthority && block.sourceMaterialId !== undefined) {
    requireString(block.sourceMaterialId, `${block.id}.sourceMaterialId`, errors);
  }
  if (sourceAuthority && Array.isArray(block.sourceRefs) && !block.sourceRefs.includes(sourceAuthority.prompt_pdf)) {
    errors.push(`${block.id} sourceRefs must include sourceAuthority prompt_pdf`);
  }
  if (block.type === 'image') errors.push(`${block.id} raw image block is not allowed`);
  checkStudentText(block, block.id || 'context block', errors);
}

function validateBundle(bundle, contract) {
  const errors = [];
  if (!isObject(bundle)) return ['bundle must be an object'];
  requireString(bundle.bundle_id, 'bundle_id', errors);
  if (!isObject(bundle.sourceAuthority)) errors.push('bundle sourceAuthority required');
  else if (JSON.stringify(bundle.sourceAuthority) !== JSON.stringify(contract.sourceAuthority)) {
    errors.push('bundle sourceAuthority must match contract sourceAuthority');
  }
  if (!Array.isArray(bundle.contextBlocks) || bundle.contextBlocks.length === 0) {
    errors.push('contextBlocks must be a non-empty array');
    return errors;
  }
  const ids = new Set();
  for (const block of bundle.contextBlocks) {
    validateBlock(block, contract.blockTypeRules || {}, contract.sourceAuthority, errors);
    if (block && block.id) {
      if (ids.has(block.id)) errors.push(`duplicate context block id ${block.id}`);
      ids.add(block.id);
    }
  }

  if (!Array.isArray(bundle.tasks) || bundle.tasks.length === 0) errors.push('tasks must be a non-empty array');
  const referenced = new Set();
  for (const task of bundle.tasks || []) {
    requireString(task.id, 'task id', errors);
    requireString(task.prompt, `${task.id || 'task'}.prompt`, errors);
    if (!Array.isArray(task.contextRefs) || task.contextRefs.length === 0) {
      errors.push(`${task.id || 'task'} missing contextRefs`);
    } else {
      for (const ref of task.contextRefs) {
        if (!ids.has(ref)) errors.push(`${task.id || 'task'} references unknown context block ${ref}`);
        referenced.add(ref);
      }
    }
    checkStudentText(task, task.id || 'task', errors);
  }

  for (const block of bundle.contextBlocks) {
    if (block.allowUnreferencedForReviewOnly === true) continue;
    if (!referenced.has(block.id)) errors.push(`${block.id} is unreferenced`);
  }

  return errors;
}

function requireNoErrors(errors, label) {
  if (errors.length) fail(`${label}: ${errors.join('; ')}`);
}

function requireErrorContaining(errors, label, expected) {
  if (!errors.some((error) => error.includes(expected))) {
    fail(`${label}: expected error containing "${expected}", got: ${errors.join('; ') || '<none>'}`);
  }
}

const contract = readJson(CONTRACT_PATH);
const examAuthority = readJson(EXAM_AUTHORITY_PATH);

if (contract.schema_version !== 1) fail(`${CONTRACT_PATH} must have schema_version 1`);
if (contract.sprint_id !== 'TASK-CONTEXT-SPEC-1') fail(`${CONTRACT_PATH} has wrong sprint_id`);
if (JSON.stringify(contract.sourceAuthority) !== JSON.stringify(examAuthority.sourceAuthority)) {
  fail('context contract sourceAuthority must match EXAM-SOURCE-AUTH-1 sourceAuthority');
}
if (JSON.stringify(contract.allowedBlockTypes) !== JSON.stringify(REQUIRED_BLOCK_TYPES)) {
  fail('allowedBlockTypes must match required block types exactly');
}
for (const type of REQUIRED_BLOCK_TYPES) {
  if (!contract.blockTypeRules || !contract.blockTypeRules[type]) fail(`missing blockTypeRules for ${type}`);
}
if (JSON.stringify(contract.negativeFixtureInventory) !== JSON.stringify(REQUIRED_NEGATIVES)) {
  fail('negativeFixtureInventory must match required rejection categories exactly');
}
for (const key of BOUNDARY_KEYS) {
  if (!contract.productBoundary || contract.productBoundary[key] !== false) {
    fail(`productBoundary.${key} must be present and false`);
  }
}

const positiveTypes = new Set((contract.positiveFixture.contextBlocks || []).map((block) => block.type));
for (const type of REQUIRED_BLOCK_TYPES) {
  if (!positiveTypes.has(type)) fail(`positive fixture missing block type ${type}`);
}
requireNoErrors(validateBundle(contract.positiveFixture, contract), 'positive fixture');

function mutatePositive(mutator) {
  const fixture = clone(contract.positiveFixture);
  mutator(fixture);
  return validateBundle(fixture, contract);
}

requireErrorContaining(
  mutatePositive((fixture) => {
    delete fixture.contextBlocks.find((block) => block.type === 'graph').altText;
  }),
  'missing alt text negative fixture',
  'altText'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    delete fixture.tasks[0].contextRefs;
  }),
  'missing contextRefs negative fixture',
  'missing contextRefs'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.tasks[0].contextRefs = ['ctx-does-not-exist'];
  }),
  'unknown contextRef negative fixture',
  'unknown context block'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.contextBlocks.push({
      id: 'ctx-unreferenced-source',
      type: 'source_excerpt',
      sourceLabel: 'Bron 2',
      caption: 'Bron 2: Extra bron',
      bodyMarkdown: 'Deze bron is niet gekoppeld aan een taak.',
      sourceRefs: ['references/external/exams/vw-1022-a-25-1-o.pdf#question-3'],
      accessibilitySummary: 'Extra bron zonder taakverwijzing.'
    });
  }),
  'unreferenced source block negative fixture',
  'is unreferenced'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.contextBlocks[0].bodyMarkdown = 'Het juiste antwoord is EUR 649.';
  }),
  'answer leakage negative fixture',
  'leaks answer hint'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.tasks[0].hint = 'Kijk naar 649 euro als grensbedrag.';
    fixture.tasks[0].feedback = 'Je gebruikt precies de juiste drempel.';
  }),
  'hint and feedback leakage negative fixture',
  'leaks answer hint'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.tasks[0].feedback = 'Het antwoord is 649 euro.';
  }),
  'feedback-only leakage negative fixture',
  'leaks answer hint'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    const block = fixture.contextBlocks.find((item) => item.type === 'svg_figure');
    block.rawImagePath = 'raw/copied-exam-image.png';
    block.reconstruction.rawCopiedImage = true;
  }),
  'raw copied image negative fixture',
  'raw copied image'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.contextBlocks.find((block) => block.type === 'table').caption = 'Figuur 1: Verkeerde caption';
  }),
  'inconsistent caption negative fixture',
  'caption must start with Tabel'
);

requireErrorContaining(
  mutatePositive((fixture) => {
    fixture.tasks[0].prompt = 'Gebruik A15 om de bron te controleren.';
  }),
  'internal-code exposure negative fixture',
  'exposes internal code'
);

console.log('OK task context spec: contextBlocks/contextRefs contract and negative fixtures pass');
