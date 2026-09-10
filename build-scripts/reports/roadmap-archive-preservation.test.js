const fs = require('fs');
const path = require('path');
const { parseSprintLedger } = require('./internal-dashboard');
const root = path.resolve(__dirname, '../..');
test.each([
  ['references/reference-team-roadmap.md', 'archive/roadmaps/snapshots/references-team-20260910.md', root],
  ['lessen-team-roadmap.md', 'archive/roadmaps/snapshots/lessons-team-20260910.md', path.resolve(root,'../4veco-lessen')],
])('compaction preserves every parsed sprint status and carried condition: %s', (live, snapshot, repo) => {
  // Platform CI normally supplies lesson main before its paired PR is merged.
  // Compare the paired snapshot when present; platform coverage is unconditional.
  if (!fs.existsSync(path.join(repo,snapshot)) && repo !== root) return;
  const original = fs.readFileSync(path.join(repo,snapshot),'utf8');
  const current = fs.readFileSync(path.join(repo,live),'utf8');
  expect(parseSprintLedger(current)).toEqual(parseSprintLedger(original));
});
test('protected legacy and unresolved compatibility plans remain explicit', () => {
  const current = fs.readFileSync(path.join(root,'references/reference-team-roadmap.md'),'utf8');
  for (const id of ['R9.0','R9.01','PV-G4','S7']) expect(current).toContain(id);
  const open = fs.readFileSync(path.join(root,'docs/maintenance/open-items.md'),'utf8');
  expect(open).toContain('No result JSON establishes closure');
  expect(open).toContain('L-CP6E');
});
