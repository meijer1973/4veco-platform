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
  formatHoldProjectionRow,
  readFiles,
  sha256SemanticAuthority,
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

function replaceProjectionRow(files, hold) {
  const lines = asText(files[OUTLINE_PATH]).split(/\r?\n/);
  const prefix = `| \`${hold.id}\` |`;
  const index = lines.findIndex((line) => line.startsWith(prefix));
  expect(index).toBeGreaterThanOrEqual(0);
  lines[index] = formatHoldProjectionRow(hold);
  files[OUTLINE_PATH] = `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

function writeMeta(files, meta) {
  meta.semantic_authority.sha256 = sha256SemanticAuthority(files[OUTLINE_PATH]);
  files[META_PATH] = `${JSON.stringify(meta, null, 2)}\n`;
}

function releaseHoldInFiles(files, holdId) {
  const meta = JSON.parse(asText(files[META_PATH]));
  const hold = meta.holds.find((item) => item.id === holdId);
  expect(hold).toBeDefined();
  release(hold);
  replaceProjectionRow(files, hold);
  writeMeta(files, meta);
  return files;
}

function approveOutlineInFiles(files) {
  const meta = JSON.parse(asText(files[META_PATH]));
  const hold = meta.holds.find((item) => item.id === 'H-OUTLINE-OWNER');
  release(hold);
  meta.status = 'approved_with_holds';
  let outline = asText(files[OUTLINE_PATH])
    .replace('Status: `review_ready_with_holds`', 'Status: `approved_with_holds`')
    .replace('Owner approval: `pending`', 'Owner approval: `approved`');
  files[OUTLINE_PATH] = outline;
  replaceProjectionRow(files, hold);
  meta.semantic_authority.sha256 = sha256SemanticAuthority(files[OUTLINE_PATH]);
  meta.owner_approval = {
    status: 'approved',
    approved_version: meta.version,
    approved_outline_sha256: meta.semantic_authority.sha256,
    approved_pr: 999,
    approved_commit: 'a'.repeat(40),
  };
  files[META_PATH] = `${JSON.stringify(meta, null, 2)}\n`;
  return files;
}

function mutateProjectionCell(files, holdId, cellIndex, replacement) {
  const lines = asText(files[OUTLINE_PATH]).split(/\r?\n/);
  const prefix = `| \`${holdId}\` |`;
  const index = lines.findIndex((line) => line.startsWith(prefix));
  expect(index).toBeGreaterThanOrEqual(0);
  const cells = lines[index].split('|');
  expect(cells).toHaveLength(10);
  cells[cellIndex + 1] = ` ${replacement} `;
  lines[index] = cells.join('|');
  files[OUTLINE_PATH] = `${lines.join('\n').replace(/\n+$/, '')}\n`;
  return files;
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

  test('outline owner decision is allowed, owner evidence releases approved use, and merge remains separately governed', () => {
    expect(findBookOutlineFailures(cloneFiles(), { action: 'outline_owner_decision' })).toEqual([]);

    const approvedFiles = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(approvedFiles, { requireApproved: true })).toEqual([]);
    expect(findBookOutlineFailures(approvedFiles, { action: 'approved_outline_use' })).toEqual([]);

    const meta = JSON.parse(asText(approvedFiles[META_PATH]));
    expect(blockingHoldsForAction(meta, { action: 'merge' }).map((hold) => hold.id)).toContain('H-MERGE-GOVERNANCE');
  });

  test('Gate 0B-1 decision and release transition reaches approved goal use', () => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { action: 'goal_owner_decision', paragraph: '2.1.1' })).toEqual([]);
    releaseHoldInFiles(files, 'H-211-GATE0B1');
    expect(findBookOutlineFailures(files, { action: 'approved_goal_use', paragraph: '2.1.1' })).toEqual([]);
  });

  test('target-authority repair and release transition reaches target integration', () => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { action: 'target_authority_repair', paragraph: '2.1.2' })).toEqual([]);
    releaseHoldInFiles(files, 'H-212-STALE-REF');
    expect(findBookOutlineFailures(files, { action: 'target_authority_integration', paragraph: '2.1.2' })).toEqual([]);
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

  test('typed lesson-plan scopes block Chapter 2.3 without leaking into Chapter 2.1 or §2.1.1', () => {
    const files = approveOutlineInFiles(cloneFiles());
    releaseHoldInFiles(files, 'H-211-GATE0B1');

    expect(findBookOutlineFailures(files, { action: 'goal_design', paragraph: '2.1.1' })).toEqual([]);
    expect(findBookOutlineFailures(files, { action: 'lesson_authoring', paragraph: '2.1.1' })).toEqual([]);
    expect(findBookOutlineFailures(files, { action: 'chapter_production', chapter: '2.1' })).toEqual([]);
    expect(findBookOutlineFailures(files, { action: 'lesson_authoring', paragraph: '2.2.3' })).toEqual([]);

    const chapter23Failures = findBookOutlineFailures(files, { action: 'chapter_production', chapter: '2.3' });
    expect(chapter23Failures).toEqual(expect.arrayContaining([
      expect.stringContaining('H-CHAPTER-23-PLAN'),
    ]));
  });

  test('rejects a typo or unregistered typed hold scope', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      meta.holds.find((hold) => hold.id === 'H-CHAPTER-23-PLAN').scope = ['chapter:2.33'];
    }), 'uses unregistered typed scope chapter:2.33');
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

  test('rejects a resolution action that is not explicitly permitted', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      meta.holds.find((hold) => hold.id === 'H-212-STALE-REF').permits = ['goal_design'];
    }), 'resolution action target_authority_repair must be explicitly permitted');
  });

  test.each([
    ['status', 1, 'released'],
    ['scope', 2, '`paragraph:2.1.2`'],
    ['blocks', 3, '`approved_goal_use`, `paragraph_production`'],
    ['permits', 4, '`goal_design`, `target_design`, `specialist_review`'],
    ['resolution_actions', 5, '`goal_owner_decision`'],
    ['release_condition', 6, 'A different release condition.'],
    ['release_evidence', 7, 'released_by=owner; released_on=2026-09-01; evidence_ref=wrong reference'],
  ])('rejects Markdown/metadata hold projection drift for %s', (field, cellIndex, replacement) => {
    const files = mutateProjectionCell(cloneFiles(), 'H-211-GATE0B1', cellIndex, replacement);
    expectFailure(files, `hold H-211-GATE0B1 projection mismatch for ${field}`);
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

  test('rejects stale GitHub entrypoint Part A template routing or approved-use wording', () => {
    expectFailure(mutate('AGENT_GITHUB_ENTRY.md', 'Part A uses `build-scripts/templates/template-textbook-paragraph-plan.md`', 'Part A uses `build-scripts/templates/template-paragraph-plan.md`'), 'GitHub entry map must route Part A to the textbook-plan template');
    expectFailure(mutate('AGENT_GITHUB_ENTRY.md', 'only for approved authority, production, or integration actions', 'before any paragraph use'), 'GitHub entry map must scope approved-use mode');
  });

  test('rejects missing npm and CI wiring', () => {
    expectFailure(mutateJson('package.json', (pkg) => { delete pkg.scripts['check:book-outline-currentness']; }), 'check:book-outline-currentness script');
    expectFailure(mutate('.github/workflows/platform-ci.yml', '      - name: Validate Book 2 outline currentness\n        run: npm run check:book-outline-currentness\n'), 'platform CI wiring');
  });

  test('approved-use mode fails closed while owner approval is pending', () => {
    expectFailure(cloneFiles(), 'approved mode requires approved or approved_with_holds status', { requireApproved: true });
  });

  test('approved-use mode requires exact approval pins and released owner hold evidence', () => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { requireApproved: true })).toEqual([]);
  });
});
