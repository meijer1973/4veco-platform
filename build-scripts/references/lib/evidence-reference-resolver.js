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
  const rawFragment = normalized.slice(hashIndex + 1);
  let fragment = rawFragment;
  let fragmentError = null;
  try {
    fragment = decodeURIComponent(rawFragment);
  } catch (error) {
    fragmentError = `malformed URI fragment: ${error.message}`;
  }
  return {
    relativePath: normalized.slice(0, hashIndex),
    fragment,
    fragmentError,
  };
}

function isUrl(value) {
  return /^https?:\/\//.test(String(value || ''));
}

function pointerJoin(pointer, key) {
  if (pointer === '$') return `${pointer}.${key}`;
  return `${pointer}.${key}`;
}

function isWithinRoot(root, absolutePath) {
  const resolvedRoot = path.resolve(root);
  const relative = path.relative(resolvedRoot, absolutePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function examQuestionAnchor(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!value.exam || value.opgave_num == null || value.question_num == null) return null;
  return `${value.exam}:opgave-${value.opgave_num}:question-${value.question_num}`;
}

function shouldUseSyntheticExamAnchor(pointer) {
  return !/\.(?:source_)?record_locator$|\.source_locator$/i.test(pointer);
}

function addAnchor(anchors, entries, candidate, pointer, kind) {
  if (typeof candidate !== 'string' || candidate.length === 0) return;
  const locations = anchors.get(candidate) || [];
  locations.push(pointer);
  anchors.set(candidate, locations);
  const entryList = entries.get(candidate) || [];
  entryList.push({ pointer, kind });
  entries.set(candidate, entryList);
}

function collectAnchors(value, anchors = new Map(), duplicateAnchorIds = [], pointer = '$', entries = new Map()) {
  if (!value || typeof value !== 'object') return { anchors, duplicateAnchorIds, entries };

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectAnchors(item, anchors, duplicateAnchorIds, `${pointer}[${index}]`, entries));
    return { anchors, duplicateAnchorIds, entries };
  }

  addAnchor(anchors, entries, value.anchor_id, pointer, 'anchor_id');
  addAnchor(anchors, entries, value.id, pointer, 'id');
  addAnchor(anchors, entries, value.requirement_id, pointer, 'requirement_id');
  addAnchor(anchors, entries, value.repair_id, pointer, 'repair_id');
  addAnchor(anchors, entries, value.exam_item_id, pointer, 'exam_item_id');
  addAnchor(anchors, entries, value.source_exam_item_id, pointer, 'source_exam_item_id');
  addAnchor(anchors, entries, value.extraction_id, pointer, 'extraction_id');
  addAnchor(anchors, entries, value.source_material_id, pointer, 'source_material_id');
  addAnchor(anchors, entries, value.overlay_id, pointer, 'overlay_id');
  addAnchor(anchors, entries, value.storage_id, pointer, 'storage_id');
  addAnchor(anchors, entries, value.answer_skill_id, pointer, 'answer_skill_id');
  addAnchor(anchors, entries, value.reviewed_equivalent_id, pointer, 'reviewed_equivalent_id');
  addAnchor(anchors, entries, value.misconception_id, pointer, 'misconception_id');
  addAnchor(anchors, entries, value.record_id, pointer, 'record_id');
  addAnchor(anchors, entries, value.question_id, pointer, 'question_id');
  addAnchor(anchors, entries, value.operation_id, pointer, 'operation_id');
  addAnchor(anchors, entries, value.render_id, pointer, 'render_id');
  addAnchor(anchors, entries, value.gate_id, pointer, 'gate_id');
  addAnchor(anchors, entries, value.package_id, pointer, 'package_id');
  if (shouldUseSyntheticExamAnchor(pointer)) {
    addAnchor(anchors, entries, examQuestionAnchor(value), pointer, 'exam_question_anchor');
  }

  if (typeof value.anchor_id === 'string' && value.anchor_id.length > 0) {
    const locations = anchors.get(`anchor_id:${value.anchor_id}`) || [];
    locations.push(pointer);
    anchors.set(`anchor_id:${value.anchor_id}`, locations);
    if (locations.length > 1) duplicateAnchorIds.push({ anchor_id: value.anchor_id, locations: [...locations] });
  }

  for (const [key, item] of Object.entries(value)) {
    collectAnchors(item, anchors, duplicateAnchorIds, pointerJoin(pointer, key), entries);
  }

  return { anchors, duplicateAnchorIds, entries };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function resolveEvidenceRef(root, reference, options = {}) {
  if (typeof reference !== 'string' || reference.trim().length === 0) {
    return { ok: false, reference, reason: 'reference must be a non-empty string' };
  }
  if (isUrl(reference)) {
    if (options.allowUrls === true) return { ok: true, reference, type: 'url' };
    return {
      ok: false,
      reference,
      reason: 'URL evidence references are not allowed unless allowUrls is true',
    };
  }

  const { relativePath, fragment, fragmentError } = splitRef(reference);
  if (fragmentError) {
    return { ok: false, reference, relativePath, fragment, reason: fragmentError };
  }
  const absolutePath = path.resolve(root, relativePath);
  if (!isWithinRoot(root, absolutePath)) {
    return {
      ok: false,
      reference,
      relativePath,
      reason: `resolved path escapes repository root: ${relativePath}`,
    };
  }
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

  const { anchors, duplicateAnchorIds, entries } = collectAnchors(json);
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
  const uniquePointers = [...new Set((entries.get(fragment) || []).map((entry) => entry.pointer))];
  if (!topLevelMatch && uniquePointers.length > 1) {
    return {
      ok: false,
      reference,
      relativePath,
      fragment,
      reason: `ambiguous JSON fragment anchor: ${fragment}`,
      locations: uniquePointers,
    };
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
  isWithinRoot,
  normalizePath,
  resolveEvidenceRef,
  splitRef,
  validateEvidenceRefs,
};
