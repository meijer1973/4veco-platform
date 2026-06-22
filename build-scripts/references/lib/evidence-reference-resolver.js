const fs = require('fs');
const path = require('path');

function normalizePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^"|"$/g, '');
}

function splitRef(reference) {
  const normalized = normalizePath(reference);
  const hashIndex = normalized.indexOf('#');
  if (hashIndex === -1) {
    return { relativePath: normalized, fragment: '' };
  }
  return {
    relativePath: normalized.slice(0, hashIndex),
    fragment: decodeURIComponent(normalized.slice(hashIndex + 1)),
  };
}

function isUrl(value) {
  return /^https?:\/\//.test(String(value || ''));
}

function pointerJoin(pointer, key) {
  if (pointer === '$') return `${pointer}.${key}`;
  return `${pointer}.${key}`;
}

function examQuestionAnchor(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!value.exam || value.opgave_num == null || value.question_num == null) return null;
  return `${value.exam}:opgave-${value.opgave_num}:question-${value.question_num}`;
}

function collectAnchors(value, anchors = new Map(), duplicateAnchorIds = [], pointer = '$') {
  if (!value || typeof value !== 'object') return { anchors, duplicateAnchorIds };

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectAnchors(item, anchors, duplicateAnchorIds, `${pointer}[${index}]`));
    return { anchors, duplicateAnchorIds };
  }

  const candidates = [
    value.anchor_id,
    value.id,
    value.record_id,
    value.question_id,
    value.operation_id,
    value.render_id,
    value.gate_id,
    value.package_id,
    examQuestionAnchor(value),
  ].filter((candidate) => typeof candidate === 'string' && candidate.length > 0);

  for (const candidate of candidates) {
    const locations = anchors.get(candidate) || [];
    locations.push(pointer);
    anchors.set(candidate, locations);
  }

  if (typeof value.anchor_id === 'string' && value.anchor_id.length > 0) {
    const locations = anchors.get(`anchor_id:${value.anchor_id}`) || [];
    locations.push(pointer);
    anchors.set(`anchor_id:${value.anchor_id}`, locations);
    if (locations.length > 1) duplicateAnchorIds.push({ anchor_id: value.anchor_id, locations: [...locations] });
  }

  for (const [key, item] of Object.entries(value)) {
    collectAnchors(item, anchors, duplicateAnchorIds, pointerJoin(pointer, key));
  }

  return { anchors, duplicateAnchorIds };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resolveEvidenceRef(root, reference, options = {}) {
  if (typeof reference !== 'string' || reference.trim().length === 0) {
    return { ok: false, reference, reason: 'reference must be a non-empty string' };
  }
  if (isUrl(reference)) return { ok: true, reference, type: 'url' };

  const { relativePath, fragment } = splitRef(reference);
  const absolutePath = path.resolve(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return { ok: false, reference, relativePath, reason: `missing file: ${relativePath}` };
  }

  if (!fragment) return { ok: true, reference, relativePath, absolutePath, type: 'file' };

  if (!/\.json$/i.test(relativePath)) {
    return {
      ok: true,
      reference,
      relativePath,
      absolutePath,
      type: 'file-fragment',
      fragment,
      fragment_verified: false,
    };
  }

  let json;
  try {
    json = readJson(absolutePath);
  } catch (error) {
    return { ok: false, reference, relativePath, reason: `invalid JSON: ${error.message}` };
  }

  const { anchors, duplicateAnchorIds } = collectAnchors(json);
  if (duplicateAnchorIds.length > 0 && options.rejectDuplicateAnchorIds !== false) {
    return {
      ok: false,
      reference,
      relativePath,
      reason: `duplicate anchor_id values in ${relativePath}: ${duplicateAnchorIds.map((item) => item.anchor_id).join(', ')}`,
      duplicateAnchorIds,
    };
  }

  const topLevelMatch = json && typeof json === 'object' && !Array.isArray(json) && Object.prototype.hasOwnProperty.call(json, fragment);
  const locations = anchors.get(fragment) || [];
  if (!topLevelMatch && locations.length === 0) {
    return { ok: false, reference, relativePath, fragment, reason: `missing JSON fragment anchor: ${fragment}` };
  }

  return {
    ok: true,
    reference,
    relativePath,
    absolutePath,
    type: 'json-fragment',
    fragment,
    fragment_verified: true,
    locations: topLevelMatch ? ['$.top_level_property'] : locations,
  };
}

function validateEvidenceRefs(root, references, options = {}) {
  const errors = [];
  const results = [];
  for (const reference of references || []) {
    const result = resolveEvidenceRef(root, reference, options);
    results.push(result);
    if (!result.ok) errors.push(result);
  }
  return { ok: errors.length === 0, errors, results };
}

module.exports = {
  collectAnchors,
  normalizePath,
  resolveEvidenceRef,
  splitRef,
  validateEvidenceRefs,
};
