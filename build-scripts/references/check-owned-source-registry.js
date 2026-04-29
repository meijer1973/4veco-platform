#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Extend REQUIRED_SURFACES when new canonical owned roots are added.
 * - Keep policy checks explicit. This validator protects authority boundaries.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/owned-source-registry.json';
const TARGET_EXERCISES_PATH = 'references/authored/course-target-exercises.json';
const OLD_BLUEPRINT = 'knowledge/course_blueprint_v4.md';
const NEW_BLUEPRINT = 'references/owned/course-blueprint-v4.md';

const REQUIRED_SURFACES = [
  'owned:course-blueprint-v4',
  'owned:course-blueprint-v4-meta',
  'authored:course-target-exercises',
  'lesson-root:book-1',
];

const REQUIRED_SURFACE_TYPES = [
  'course_blueprint',
  'course_blueprint_metadata',
  'target_exercise_index',
  'active_lesson_root',
  'chapter_plan',
  'paragraph_markdown',
  'opgaven_markdown',
  'answer_model_markdown',
  'visual_svg_source',
];

function fail(message) {
  console.error(`Owned source registry check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function countString(value, needle) {
  return String(value).split(needle).length - 1;
}

function main() {
  if (!fs.existsSync(repoPath(REGISTRY_PATH))) fail(`missing ${REGISTRY_PATH}`);
  const registry = readJson(REGISTRY_PATH);

  if (registry.schema_version !== 1) fail('schema_version must be 1');
  if (registry.registry_id !== 'owned-source-registry') fail('registry_id must be owned-source-registry');
  if (!Array.isArray(registry.source_surfaces)) fail('source_surfaces must be an array');
  if (!Array.isArray(registry.companion_artifact_types)) fail('companion_artifact_types must be an array');
  if (registry.companion_artifact_types.length < 16) {
    fail(`expected at least 16 companion/source artifact types, got ${registry.companion_artifact_types.length}`);
  }

  const surfaces = new Map(registry.source_surfaces.map((surface) => [surface.surface_id, surface]));
  for (const surfaceId of REQUIRED_SURFACES) {
    if (!surfaces.has(surfaceId)) fail(`missing required surface ${surfaceId}`);
  }

  const types = new Set(registry.source_surfaces.map((surface) => surface.source_surface_type));
  for (const type of REQUIRED_SURFACE_TYPES) {
    if (!types.has(type)) fail(`missing required source surface type ${type}`);
  }

  const policy = registry.authority_policy || {};
  if (policy.projection_edges_must_be_separate_from_evidence_edges !== true) {
    fail('projection/evidence separation policy must be true');
  }
  if (policy.generated_outputs_are_primary_evidence !== false) {
    fail('generated outputs must not be primary evidence');
  }
  if (policy.lesson_exposition_can_override_external_authority !== false) {
    fail('lesson exposition must not override external authority');
  }
  if (policy.lesson_exposition_can_override_machine_registry !== false) {
    fail('lesson exposition must not override machine registry');
  }

  for (const surface of registry.source_surfaces) {
    for (const field of ['surface_id', 'path', 'source_surface_type', 'source_status', 'authority_level', 'authority_weight', 'evidence_use', 'projection_policy']) {
      if (surface[field] === undefined || surface[field] === null || surface[field] === '') {
        fail(`${surface.surface_id || '<unknown>'} missing ${field}`);
      }
    }
    if (['generated_projection', 'implementation_output'].includes(surface.source_status) && surface.primary_evidence !== false) {
      fail(`${surface.surface_id} is ${surface.source_status} but primary_evidence is not false`);
    }
    if (surface.source_status === 'implementation_output' && !surface.not_allowed_use.includes('primary_evidence')) {
      fail(`${surface.surface_id} implementation output must block primary_evidence`);
    }
    if (surface.source_status === 'generated_projection' && !surface.not_allowed_use.includes('primary_evidence')) {
      fail(`${surface.surface_id} generated projection must block primary_evidence`);
    }
  }

  const targetText = fs.readFileSync(repoPath(TARGET_EXERCISES_PATH), 'utf8');
  const oldCount = countString(targetText, OLD_BLUEPRINT);
  const newCount = countString(targetText, NEW_BLUEPRINT);
  if (oldCount !== 0) fail(`${TARGET_EXERCISES_PATH} still contains ${oldCount} stale blueprint references`);
  if (newCount < 50) fail(`${TARGET_EXERCISES_PATH} should contain repaired blueprint references; found ${newCount}`);

  const targetSurface = surfaces.get('authored:course-target-exercises');
  if (targetSurface.stale_blueprint_reference_count !== 0) {
    fail('target exercise registry surface still reports stale blueprint references');
  }

  console.log(`OK owned source registry: ${registry.source_surfaces.length} surfaces, ${registry.companion_artifact_types.length} artifact types`);
}

if (require.main === module) main();
