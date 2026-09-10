const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { buildIndex } = require('./github-agent-index');
const { buildArchiveIndex } = require('./archive-index');
let root;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-navigation-'));
  execFileSync('git', ['init', '-q'], { cwd: root });
  for (const file of ['source.js','archive/sprints/OLD/Boek 1 - Old/check-old.md','reports/github-agent-index-platform.md']) {
    fs.mkdirSync(path.dirname(path.join(root,file)), { recursive: true });
    fs.writeFileSync(path.join(root,file), 'historical/current fixture\n');
  }
  execFileSync('git', ['add', '.'], { cwd: root });
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
test('current retrieval excludes archives and complete inventories; complete contract retains every path', () => {
  const complete = buildIndex('4veco-platform',root);
  const current = buildIndex('4veco-platform',root,{view:'current'});
  expect(complete.file_count).toBe(3);
  expect(current.file_count).toBe(1);
  expect(complete.groups.archive).toEqual(['archive/sprints/OLD/Boek 1 - Old/check-old.md']);
  expect(complete.groups.validators).toEqual([]);
  expect(complete.groups['book folders']).toEqual([]);
  expect(Object.values(current.groups).flat()).toContain('source.js');
  expect(Object.values(current.groups).flat().some(p=>p.startsWith('archive/'))).toBe(false);
});
test('pre-existing archive packets are inventoried without declaring new authority', () => {
  const complete = buildIndex('4veco-platform',root);
  const archive = buildArchiveIndex('4veco-platform',root,{...complete,source_commit:'a'.repeat(40)});
  expect(archive.entries).toHaveLength(1);
  expect(archive.entries[0].original_path).toBe('archive/sprints/OLD/Boek 1 - Old/check-old.md');
  expect(archive.entries[0].original_url).toContain('/blob/'+'a'.repeat(40)+'/');
  expect(archive.entries[0]).not.toHaveProperty('status');
});

test('archive inventory retains Git-quoted Unicode paths and historical outputs', () => {
  const file = 'archive/outputs/oud – antwoorden.md';
  fs.mkdirSync(path.dirname(path.join(root, file)), {recursive:true});
  fs.writeFileSync(path.join(root, file), 'preserved history\n');
  execFileSync('git', ['add', '.'], {cwd:root});
  const complete = buildIndex('4veco-platform', root);
  expect(complete.groups.archive).toContain(file);
  const archive = buildArchiveIndex('4veco-platform', root, {...complete,source_commit:'a'.repeat(40)});
  expect(archive.entries.some(e=>e.archived_path===file)).toBe(true);
});
