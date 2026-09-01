'use strict';

const path = require('path');

const {
  AUTHORITY_PATHS,
  META_PATH,
  OUTLINE_PATH,
  TARGET_REGISTRY_PATH,
  WORKFLOW_SURFACES,
  asText,
  blockingHoldsForAction,
  findBookOutlineFailures,
  readFiles,
} = require('./check-book-outline-currentness');

const root = path.resolve(__dirname, '..', '..');

function cloneFiles() {
  return Object.fromEntries(Object.entries(readFiles(root)).map(([file, value]) => [file, value === null ? null : Buffer.from(value)]));
}

function mutate(file, search, replacement = '') {
  const files = cloneFiles();
  const text = asText(files[file]);
  expect(text).toContain(search);
  files[file] = text.replace(search, replacement);
  return files;
}

function mutateAll(file, search, replacement = '') {
  const files = cloneFiles();
  const text = asText(files[file]);
  expect(text).toContain(search);
  files[file] = text.split(search).join(replacement);
  return files;
}

function mutateJson(file, mutator) {
  const files = cloneFiles();
  const value = JSON.parse(asText(files[file]));
  mutator(value);
  files[file] = `${JSON.stringify(value, null, 2)}\n`;
  return files;
}

function expectFailure(files, fragment, options = {}) {
  const failures = findBookOutlineFailures(files, options);
  expect(failures.some((failure) => failure.includes(fragment))).toBe(true);
}

function release(hold) {
  hold.status = 'released';
  hold.release_evidence = {
    released_by: 'owner@example.test',
    released_on: '2026-09-01',
    evidence_ref: 'PR #999 exact-head approval',
  };
}

describe('Book 2 outline currentness contract', () => {
  test('current prose authority, compact metadata, holds, targets, and workflows pass structural mode', () => {
    expect(findBookOutlineFailures(cloneFiles())).toEqual([]);
  });

  test('file hashes are invariant across LF and CRLF checkouts', () => {
    const lfFiles = Object.fromEntries(Object.entries(cloneFiles()).map(([file, value]) => [file, value === null ? null : asText(value).replace(/\r\n?/g, '\n')]));
    const crlfFiles = Object.fromEntries(Object.entries(lfFiles).map(([file, value]) => [file, value === null ? null : value.replace(/\n/g, '\r\n')]));
    expect(findBookOutlineFailures(lfFiles)).toEqual([]);
    expect(findBookOutlineFailures(crlfFiles)).toEqual([]);
  });

  test.each(AUTHORITY_PATHS)('rejects a stale authority source hash: %s', (file) => {
    expectFailure(mutate(file, asText(cloneFiles()[file]).slice(0, 20), 'mutated source bytes'), `authority hash is stale for ${file}`);
  });

  test('rejects a stale canonical prose hash', () => {
    expectFailure(mutate(OUTLINE_PATH, '# Book 2 Outline', '# Mutated Book 2 Outline'), 'semantic_authority.sha256 is stale');
  });

  test('rejects missing and reordered compact target pins', () => {
    expectFailure(mutateJson(META_PATH, (meta) => meta.target_registry_pins.splice(1, 1)), 'exactly 12 compact target registry pins');
    expectFailure(mutateJson(META_PATH, (meta) => {
      [meta.target_registry_pins[0], meta.target_registry_pins[1]] = [meta.target_registry_pins[1], meta.target_registry_pins[0]];
    }), 'target registry pin IDs are missing or reordered');
  });

  test('rejects changed target kind and status pins', () => {
    expectFailure(mutateJson(META_PATH, (meta) => { meta.target_registry_pins[0].kind = 'gemengde_opgaven'; }), 'paragraph kind does not match');
    expectFailure(mutateJson(META_PATH, (meta) => { meta.target_registry_pins[8].target_status = 'reviewed_final'; }), 'target status does not match');
  });

  test('rejects a stale target record hash after registry mutation', () => {
    const files = cloneFiles();
    const registry = JSON.parse(asText(files[TARGET_REGISTRY_PATH]));
    registry.exercises.find((record) => record.id === '2.1.1').lesson_goals.push('mutated goal');
    files[TARGET_REGISTRY_PATH] = `${JSON.stringify(registry, null, 2)}\n`;
    expectFailure(files, '2.1.1 target record hash is stale');
  });

  test.each([
    'role',
    'chapter_dependency',
    'prior_teaching',
    'retrieval',
    'interleave',
    'operation_emphasis',
    'misconception_boundary',
    'non_goals',
    'prepares_for',
    'model_conditions',
  ])('rejects duplicated semantic metadata field: %s', (field) => {
    expectFailure(mutateJson(META_PATH, (meta) => { meta.target_registry_pins[0][field] = 'duplicated prose semantics'; }), 'semantic field is prohibited in machine metadata');
  });

  test('rejects any non-compact target pin field even when it is not a named semantic key', () => {
    expectFailure(mutateJson(META_PATH, (meta) => { meta.target_registry_pins[0].notes = 'duplicate outline'; }), 'target pin must stay compact');
  });

  test('rejects a missing canonical semantic foundation row', () => {
    expectFailure(mutate(OUTLINE_PATH, '| 2.1.1 |', '| 2.1.X |'), 'canonical foundation dimensions row 2.1.1 is missing');
  });

  test('permits Gate 0B-1 goal design while approval and production holds remain open', () => {
    expect(findBookOutlineFailures(cloneFiles(), { action: 'goal_design', paragraph: '2.1.1' })).toEqual([]);
  });

  test('blocks paragraph production for 2.1.1 with both matching open holds', () => {
    const failures = findBookOutlineFailures(cloneFiles(), { action: 'paragraph_production', paragraph: '2.1.1' });
    expect(failures).toEqual(expect.arrayContaining([
      expect.stringContaining('H-OUTLINE-OWNER'),
      expect.stringContaining('H-211-GATE0B1'),
    ]));
  });

  test('an unrelated paragraph hold does not block the current paragraph action', () => {
    const meta = JSON.parse(asText(cloneFiles()[META_PATH]));
    const blockers = blockingHoldsForAction(meta, { action: 'formal_output_choice_teaching', paragraph: '2.2.1' });
    expect(blockers).toEqual([]);
  });

  test('an out-of-scope lesson hold does not block chapter planning', () => {
    expect(findBookOutlineFailures(cloneFiles(), { action: 'chapter_planning', chapter: '2.1' })).toEqual([]);
  });

  test('a hold can transition from open to released with evidence', () => {
    const meta = JSON.parse(asText(cloneFiles()[META_PATH]));
    const hold = meta.holds.find((item) => item.id === 'H-211-GATE0B1');
    expect(hold.status).toBe('open');
    release(hold);
    expect(blockingHoldsForAction(meta, { action: 'paragraph_production', paragraph: '2.1.1' }).map((item) => item.id)).not.toContain('H-211-GATE0B1');
  });

  test('rejects a released hold without complete release evidence', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      const hold = meta.holds.find((item) => item.id === 'H-211-GATE0B1');
      hold.status = 'released';
      hold.release_evidence = { released_by: 'owner' };
    }), 'released hold H-211-GATE0B1 requires released_by, released_on, and evidence_ref');
  });

  test('a released hold no longer blocks its formerly blocked action', () => {
    const meta = JSON.parse(asText(cloneFiles()[META_PATH]));
    release(meta.holds.find((item) => item.id === 'H-211-GATE0B1'));
    const blockers = blockingHoldsForAction(meta, { action: 'paragraph_production', paragraph: '2.1.1' });
    expect(blockers.map((item) => item.id)).not.toContain('H-211-GATE0B1');
  });

  test('rejects release evidence on an open hold', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      meta.holds[1].release_evidence = { released_by: 'owner', released_on: '2026-09-01', evidence_ref: 'invalid while open' };
    }), 'open hold H-211-GATE0B1 must have null release_evidence');
  });

  test('rejects an action listed in both blocks and permits', () => {
    expectFailure(mutateJson(META_PATH, (meta) => meta.holds[1].permits.push('paragraph_production')), 'cannot both block and permit paragraph_production');
  });

  test('rejects a prose hold erased from lifecycle metadata without hardcoding its ID', () => {
    expectFailure(mutateJson(META_PATH, (meta) => { meta.holds = meta.holds.filter((hold) => hold.id !== 'H-212-STALE-REF'); }), 'prose hold H-212-STALE-REF is missing from lifecycle metadata');
  });

  test.each(WORKFLOW_SURFACES.slice(0, 6))('rejects loss of Book foundation pointer from %s', (file) => {
    expectFailure(mutateAll(file, 'Book foundation check', 'Foundation information'), 'Book foundation check is missing');
  });

  test('rejects loss of explicit Part A textbook-plan ownership', () => {
    expectFailure(mutate('BUILD-PARAGRAPH.md', 'Part A owns `X.Y.Z-textbook-plan.md`', 'The plan exists'), 'Part A ownership statement is missing');
  });

  test('rejects Part B claim to foundation ownership', () => {
    expectFailure(mutate('build-scripts/templates/template-paragraph-plan.md', 'Part B companion implementation plan', 'shared implementation plan'), 'Part B plan ownership is missing');
  });

  test('rejects missing npm and CI wiring', () => {
    expectFailure(mutateJson('package.json', (pkg) => { delete pkg.scripts['check:book-outline-currentness']; }), 'check:book-outline-currentness script');
    expectFailure(mutate('.github/workflows/platform-ci.yml', '      - name: Validate Book 2 outline currentness\n        run: npm run check:book-outline-currentness\n'), 'platform CI wiring');
  });

  test('approved-use mode fails closed while owner approval is pending', () => {
    expectFailure(cloneFiles(), 'approved mode requires approved or approved_with_holds status', { requireApproved: true });
  });

  test('approved-use mode requires exact approval pins and released owner hold evidence', () => {
    const files = mutateJson(META_PATH, (meta) => {
      meta.status = 'approved_with_holds';
      meta.owner_approval = {
        status: 'approved',
        approved_version: meta.version,
        approved_outline_sha256: meta.semantic_authority.sha256,
        approved_pr: 999,
        approved_commit: 'a'.repeat(40),
      };
      release(meta.holds.find((hold) => hold.id === 'H-OUTLINE-OWNER'));
    });
    expect(findBookOutlineFailures(files, { requireApproved: true })).toEqual([]);
  });
});
