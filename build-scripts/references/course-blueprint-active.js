const fs = require('fs');
const path = require('path');

const TARGET_EXERCISES_PATH = 'references/authored/course-target-exercises.json';

function repoPath(repoRoot, relPath) {
  return path.join(repoRoot, relPath);
}

function readJson(repoRoot, relPath) {
  return JSON.parse(fs.readFileSync(repoPath(repoRoot, relPath), 'utf8'));
}

function normalizeVersion(version) {
  return String(version || '').trim().toLowerCase();
}

function versionSlug(version) {
  return normalizeVersion(version).replace(/[^a-z0-9.-]+/g, '-').replace(/^-|-$/g, '');
}

function metaPathForBlueprint(blueprintPath) {
  return String(blueprintPath || '').replace(/\.md$/i, '.meta.json');
}

function activeBlueprintInfo(repoRoot) {
  const targetExercises = readJson(repoRoot, TARGET_EXERCISES_PATH);
  const version = normalizeVersion(targetExercises.blueprint_version);
  const slug = versionSlug(version);
  const blueprintPath = targetExercises.blueprint_source;
  if (!version) throw new Error(`${TARGET_EXERCISES_PATH} missing blueprint_version`);
  if (!blueprintPath) throw new Error(`${TARGET_EXERCISES_PATH} missing blueprint_source`);
  return {
    targetExercisesPath: TARGET_EXERCISES_PATH,
    targetExercises,
    version,
    versionSlug: slug,
    blueprintPath,
    metaPath: metaPathForBlueprint(blueprintPath),
    surfaceId: `owned:course-blueprint-${slug}`,
    metaSurfaceId: `owned:course-blueprint-${slug}-meta`,
    title: `Course Blueprint ${version.toUpperCase()}`,
    metaTitle: `Course Blueprint ${version.toUpperCase()} metadata`,
  };
}

function countStaleBlueprintReferences(targetExercises, activeBlueprintPath) {
  const text = JSON.stringify(targetExercises);
  const legacyNeedles = [
    'knowledge/course_blueprint_v4.md',
    'references/owned/course-blueprint-v4.md',
  ].filter((needle) => needle !== activeBlueprintPath);
  return legacyNeedles.reduce((count, needle) => (
    count + (text.split(needle).length - 1)
  ), 0);
}

module.exports = {
  TARGET_EXERCISES_PATH,
  activeBlueprintInfo,
  countStaleBlueprintReferences,
  metaPathForBlueprint,
  normalizeVersion,
  versionSlug,
};
