const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseSprintLedger } = require('./internal-dashboard');
const root = path.resolve(__dirname, '../..');
const lessonRoot = path.resolve(root, '../4veco-lessen');
const lessonTest = fs.existsSync(path.join(lessonRoot, 'lessen-team-roadmap.md')) ? test : test.skip;

function lessonBaseline() {
  const snapshot = path.join(lessonRoot, 'archive/roadmaps/snapshots/lessons-team-20260910.md');
  if (fs.existsSync(snapshot)) return fs.readFileSync(snapshot, 'utf8');
  // Required platform CI supplies lesson main, before the paired archive PR.
  // Still exercise prose coverage against the exact reviewed source version.
  return execFileSync('git', ['show', '57b31a1f4a3d2aa0da3945abbc5a7a0ee5d05e6a:lessen-team-roadmap.md'], {
    cwd: lessonRoot, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
  });
}

function proseBlocks(markdown) {
  let section = '', label = '';
  const blocks = [];
  for (const raw of markdown.replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const text = raw.trim();
    if (/^#{1,3} /.test(text)) {
      section = text.split('\n')[0]; label = '';
    } else if (/^#### /.test(text) || (text.endsWith(':') && text.length < 180 && !/^[-*|>]|^```/.test(text))) {
      label = text.replace(/\s+/g, ' ');
    } else if (section.startsWith('### ') && text && !/^(Required output|Stop condition|Completion|Completed|Position|Status|Remaining blocker):\s/.test(text)) {
      blocks.push({ section, label, text: text.replace(/\s+/g, ' ') });
    }
  }
  return blocks;
}

function changedProseParents(original, current) {
  const originalParents = new Map();
  for (const block of proseBlocks(original)) {
    const key = JSON.stringify([block.section, block.text]);
    if (!originalParents.has(key)) originalParents.set(key, new Set());
    originalParents.get(key).add(block.label);
  }
  return proseBlocks(current).flatMap(block => {
    const parents = originalParents.get(JSON.stringify([block.section, block.text]));
    // Compaction may remove whole blocks; retained unambiguous blocks must keep
    // their semantic parent. Ledger equality cannot establish this property.
    if (!parents || parents.size !== 1 || parents.has(block.label)) return [];
    return [{ section: block.section, expected: [...parents][0], actual: block.label, text: block.text }];
  });
}

function sprintSection(markdown, id) {
  const heading = `### Sprint ${id}:`;
  const start = markdown.indexOf(heading);
  if (start < 0) throw new Error(`Missing sprint section: ${id}`);
  const next = markdown.indexOf('\n### ', start + heading.length);
  return markdown.slice(start, next < 0 ? undefined : next);
}

test('platform retained prose keeps its original work, acceptance and completion boundaries', () => {
  const baseline = fs.readFileSync(path.join(root, 'archive/roadmaps/snapshots/references-team-20260910.md'), 'utf8');
  const current = fs.readFileSync(path.join(root, 'references/reference-team-roadmap.md'), 'utf8');
  expect(changedProseParents(baseline, current)).toEqual([]);
});

lessonTest('all retained lesson prose keeps its original subsection boundaries', () => {
  const current = fs.readFileSync(path.join(lessonRoot, 'lessen-team-roadmap.md'), 'utf8');
  expect(changedProseParents(lessonBaseline(), current)).toEqual([]);
});

const exclusionBoundaries = [
  ['L1.7B-R', 'Exit criteria:'],
  ['L1.7C-0', 'Outcome:'],
  ['L1.7C', 'Closure result:'],
  ['L1.7C-MATH', 'Exit criteria:'],
  ['L2.0', 'Exit criteria:'],
];

lessonTest.each(exclusionBoundaries)('%s keeps exclusions separate from %s', (id, outcomeLabel) => {
  const current = sprintSection(fs.readFileSync(path.join(lessonRoot, 'lessen-team-roadmap.md'), 'utf8'), id);
  const original = sprintSection(lessonBaseline(), id);
  for (const label of ['Out of scope:', outcomeLabel]) {
    const expected = proseBlocks(original).filter(b => b.label === label).map(b => b.text);
    expect(expected.length).toBeGreaterThan(0);
    expect(proseBlocks(current).filter(b => b.label === label).map(b => b.text)).toEqual(expected);
  }
});

lessonTest.each(exclusionBoundaries)('%s regression is detected when %s disappears despite unchanged ledger rows', (id, label) => {
  const baseline = lessonBaseline();
  const section = sprintSection(baseline, id);
  const broken = baseline.replace(section, section.replace(`${label}\n`, ''));
  expect(parseSprintLedger(broken)).toEqual(parseSprintLedger(baseline));
  expect(changedProseParents(baseline, broken)).toEqual(expect.arrayContaining([
    expect.objectContaining({ expected: label }),
  ]));
});
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
