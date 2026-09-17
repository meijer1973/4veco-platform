// HOW TO ADAPT: add reviewed relocations to archive/relocations.json. Opt in
// only at historical-document readers; never use this for runtime/spec lookup.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cache = new Map();

function relativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') ||
      path.posix.isAbsolute(value) || /^[A-Za-z]:/.test(value) ||
      value.split('/').some(p => p === '..' || p === '.' || p === '')) {
    throw new Error(`Invalid historical relative path: ${value}`);
  }
  return value;
}

function loadRelocations(root) {
  root = path.resolve(root);
  const file = path.join(root, 'archive', 'relocations.json');
  if (!fs.existsSync(file)) return [];
  const stamp = fs.statSync(file).mtimeMs;
  if (cache.get(root)?.stamp === stamp) return cache.get(root).entries;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schema_version !== 1 || !Array.isArray(data.entries)) throw new Error('Invalid archive relocation manifest');
  const sources = new Set(), destinations = new Set();
  for (const entry of data.entries) {
    const src = relativePath(entry.original_path), dst = relativePath(entry.archived_path);
    if (!dst.startsWith('archive/') || src === dst) throw new Error(`Invalid archive destination: ${dst}`);
    if (sources.has(src.toLowerCase()) || destinations.has(dst.toLowerCase())) throw new Error('Ambiguous archive relocation');
    if (!/^[a-f0-9]{40}$/.test(entry.original_blob) || !/^[a-f0-9]{40}$/.test(entry.final_blob || entry.original_blob)) throw new Error('Invalid archive blob');
    sources.add(src.toLowerCase()); destinations.add(dst.toLowerCase());
  }
  cache.set(root, { stamp, entries: data.entries });
  return data.entries;
}

function relocationFor(root, file) {
  if (typeof file !== 'string') return null;
  const rel = path.relative(path.resolve(root), path.resolve(file)).replace(/\\/g, '/');
  return loadRelocations(root).find(e => e.kind !== 'snapshot' && (e.original_path === rel || e.archived_path === rel)) || null;
}

function resolveHistoricalPath(root, file) {
  const entry = relocationFor(root, file);
  if (!entry) return file; // No implicit basename, directory or active-file fallback.
  if (fs.existsSync(path.join(root, entry.original_path))) throw new Error(`Ambiguous historical source still exists: ${entry.original_path}`);
  return path.join(path.resolve(root), entry.archived_path);
}

function gitBlob(bytes) {
  return crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

function historicalReader(root = process.cwd()) {
  root = path.resolve(root);
  return new Proxy(fs, { get(target, key) {
    if (key === 'readFileSync') return (file, options) => {
      const entry = relocationFor(root, file);
      const physical = resolveHistoricalPath(root, file);
      if (entry) {
        const bytes = fs.readFileSync(physical);
        if (gitBlob(bytes) !== (entry.final_blob || entry.original_blob)) throw new Error(`Historical blob mismatch: ${entry.archived_path}`);
      }
      return fs.readFileSync(physical, options);
    };
    if (key === 'existsSync' || key === 'statSync') return (file, ...args) => {
      const entry = relocationFor(root, file);
      const physical = resolveHistoricalPath(root, file);
      if (entry && fs.existsSync(physical) && gitBlob(fs.readFileSync(physical)) !== (entry.final_blob || entry.original_blob)) {
        throw new Error(`Historical blob mismatch: ${entry.archived_path}`);
      }
      return fs[key](physical, ...args);
    };
    return target[key];
  }});
}

function assertActiveSprint(root, sprintId) {
  if (loadRelocations(root).some(e => e.topic === sprintId && e.original_path.startsWith('reports/sprints/'))) {
    throw new Error(`Sprint ${sprintId} is archived; do not replay commands or recreate historical logs`);
  }
}

function archiveInventoryPaths(root) {
  const metadata = ['archive/README.md', 'archive/index.json', 'archive/index.md', 'archive/relocations.json', 'archive/cleanup-deletions.json'];
  return [...new Set([...metadata, ...loadRelocations(root).map(e => e.archived_path)])]
    .filter(p => fs.existsSync(path.join(root, p)));
}

module.exports = { loadRelocations, resolveHistoricalPath, historicalReader, assertActiveSprint, gitBlob, archiveInventoryPaths };
