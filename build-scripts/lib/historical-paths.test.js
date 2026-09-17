const fs = require('fs');
const os = require('os');
const path = require('path');
const { historicalReader, resolveHistoricalPath, assertActiveSprint, gitBlob, loadRelocations } = require('./historical-paths');
let root, old, archived, manifest;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'historical-path-'));
  old = path.join(root, 'reports/sprints/OLD-result.md');
  archived = path.join(root, 'archive/sprints/OLD/result.md');
  fs.mkdirSync(path.dirname(archived), { recursive: true });
  fs.writeFileSync(archived, 'Original verdict: HOLD\n');
  manifest = { schema_version: 1, entries: [{ original_path: 'reports/sprints/OLD-result.md', archived_path: 'archive/sprints/OLD/result.md', original_blob: gitBlob(fs.readFileSync(archived)), topic: 'OLD' }] };
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
function save() { fs.writeFileSync(path.join(root, 'archive/relocations.json'), JSON.stringify(manifest)); }
test('declared historical reads preserve logical identity and original bytes', () => {
  save(); const reader = historicalReader(root);
  expect(reader.existsSync(old)).toBe(true);
  expect(reader.readFileSync(old, 'utf8')).toBe('Original verdict: HOLD\n');
  expect(resolveHistoricalPath(root, old)).toBe(archived);
  expect(fs.existsSync(old)).toBe(false);
});
test('explicit repository root resolves absolute records from an external cwd', () => {
  save();
  expect(path.resolve(process.cwd())).not.toBe(root);
  expect(historicalReader(root).readFileSync(old, 'utf8')).toBe('Original verdict: HOLD\n');
});
test('missing and corrupted evidence fail', () => {
  save(); const reader = historicalReader(root);
  fs.writeFileSync(archived, 'PASS\n');
  expect(() => reader.existsSync(old)).toThrow(/blob mismatch/);
  expect(() => reader.readFileSync(old)).toThrow(/blob mismatch/);
  fs.unlinkSync(archived);
  expect(reader.existsSync(old)).toBe(false);
  expect(() => reader.readFileSync(old)).toThrow();
});
test('a missing active file never resolves by basename', () => {
  save(); const active = path.join(root, 'current/result.md');
  expect(resolveHistoricalPath(root, active)).toBe(active);
  expect(historicalReader(root).existsSync(active)).toBe(false);
  expect(() => historicalReader(root).readFileSync(active)).toThrow();
});
test('ambiguous sources, duplicate destinations and traversal fail', () => {
  manifest.entries.push({ ...manifest.entries[0], original_path: 'another.md' }); save();
  expect(() => historicalReader(root).readFileSync(old)).toThrow(/Ambiguous/);
  manifest.entries.pop(); manifest.entries[0].archived_path = 'archive/../current.md'; save();
  expect(() => resolveHistoricalPath(root, old)).toThrow(/Invalid/);
});
test('archived command execution is rejected before a new log can be emitted', () => {
  save(); expect(() => assertActiveSprint(root, 'OLD')).toThrow(/do not replay/);
  expect(() => assertActiveSprint(root, 'NEW')).not.toThrow();
});
test('snapshots of one active path require distinct exact commits and never redirect', () => {
  const item={...manifest.entries[0],kind:'snapshot',original_path:'references/current.md',source_commit:'a'.repeat(40)};
  manifest.entries=[item,{...item,archived_path:'archive/snapshots/later.md',source_commit:'b'.repeat(40)}];save();
  expect(loadRelocations(root)).toHaveLength(2);
  const active=path.join(root,item.original_path);
  expect(resolveHistoricalPath(root,active)).toBe(active);
  expect(historicalReader(root).existsSync(active)).toBe(false);
});
test.each(['same commit','missing commit','same destination'])('snapshot rejects %s',fault=>{
  const item={...manifest.entries[0],kind:'snapshot',source_commit:'a'.repeat(40)};
  const second={...item,archived_path:'archive/snapshots/later.md',source_commit:'b'.repeat(40)};
  if(fault==='same commit')second.source_commit=item.source_commit;
  if(fault==='missing commit')delete second.source_commit;
  if(fault==='same destination')second.archived_path=item.archived_path;
  manifest.entries=[item,second];save();expect(()=>loadRelocations(root)).toThrow();
});
