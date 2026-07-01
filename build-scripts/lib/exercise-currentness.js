const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'references', 'data', 'exercise-surface-manifest.json');

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function repoRelative(filePath) {
  const absolute = path.resolve(filePath);
  if (absolute.toLowerCase().startsWith(ROOT.toLowerCase())) {
    return normalizePath(path.relative(ROOT, absolute));
  }
  return normalizePath(filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadExerciseSurfaceManifest() {
  return readJson(MANIFEST_PATH);
}

function currentSurfaces(manifest = loadExerciseSurfaceManifest()) {
  return (manifest.surfaces || []).filter((surface) => surface.current === true);
}

function currentSourcePaths(manifest = loadExerciseSurfaceManifest()) {
  return currentSurfaces(manifest)
    .map((surface) => surface.source_path)
    .filter(Boolean)
    .map(normalizePath);
}

function currentLessonPaths(manifest = loadExerciseSurfaceManifest()) {
  return currentSurfaces(manifest)
    .map((surface) => surface.generated_path)
    .filter(Boolean)
    .map(normalizePath);
}

function validatorFor(filePath, manifest = loadExerciseSurfaceManifest()) {
  const relative = repoRelative(filePath);
  return (manifest.validators || []).find((validator) => normalizePath(validator.path) === relative);
}

function currentValidators(manifest = loadExerciseSurfaceManifest()) {
  return (manifest.validators || []).filter((validator) => validator.status === 'current');
}

function supersededValidators(manifest = loadExerciseSurfaceManifest()) {
  return (manifest.validators || []).filter((validator) => validator.status === 'superseded' || validator.status === 'historical');
}

function classifyGeneratedLessonSharedPath(filePath) {
  const normalized = normalizePath(filePath);
  const match = normalized.match(/(?:^|\/)shared\/([^/]+)\/(1\.1\.\d+(?:-[^/.]+)?)\.js$/i);
  if (!match) {
    return {
      category: 'outside_known_shared_asset',
      current: false,
      legacy: false,
      family: null,
      path: normalized,
    };
  }

  const family = match[1].toLowerCase();
  const key = match[2].toLowerCase();
  if (family === 'exit-ticket') {
    if (/^1\.1\.\d+$/.test(key)) {
      return { category: 'legacy_exit_ticket_unsuffixed', current: false, legacy: true, family, path: normalized };
    }
    if (/^1\.1\.\d+-exit-ticket$/.test(key)) {
      return { category: 'current_exit_ticket', current: true, legacy: false, family, path: normalized };
    }
    if (/^1\.1\.\d+-korte-check$/.test(key)) {
      return { category: 'current_short_check', current: true, legacy: false, family, path: normalized };
    }
    return { category: 'unknown_exit_ticket_shared_asset', current: false, legacy: false, family, path: normalized };
  }

  const validUnsuffixed = new Set(['procedure', 'reasoning', 'skilltree', 'newsdetective']);
  if (validUnsuffixed.has(family) && /^1\.1\.\d+$/.test(key)) {
    return { category: `current_${family}`, current: true, legacy: false, family, path: normalized };
  }

  return { category: 'unknown_shared_asset', current: false, legacy: false, family, path: normalized };
}

function guardHistoricalChecker(filePath) {
  const manifest = loadExerciseSurfaceManifest();
  const validator = validatorFor(filePath, manifest);
  if (!validator || !['historical', 'superseded'].includes(validator.status)) return;
  if (process.argv.includes('--allow-historical')) return;

  const replacement = validator.superseded_by ? ` Replacement: ${validator.superseded_by}.` : '';
  console.error(
    `${repoRelative(filePath)} is ${validator.status} and must not run as an active validator.${replacement}`
  );
  process.exit(2);
}

module.exports = {
  ROOT,
  MANIFEST_PATH,
  normalizePath,
  repoRelative,
  loadExerciseSurfaceManifest,
  currentSurfaces,
  currentSourcePaths,
  currentLessonPaths,
  validatorFor,
  currentValidators,
  supersededValidators,
  classifyGeneratedLessonSharedPath,
  guardHistoricalChecker,
};
