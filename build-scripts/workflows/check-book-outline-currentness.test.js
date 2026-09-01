'use strict';

const path = require('path');

const {
  APPROVAL_PR_NUMBER,
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
  sha256,
  sha256CanonicalText,
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

function release(hold, evidence = {}) {
  hold.status = 'released';
  hold.release_evidence = {
    resolved_via: hold.resolution_actions[0],
    released_by: 'owner@example.test',
    released_on: '2026-09-01',
    evidence_ref: 'https://github.com/meijer1973/4veco-platform/issues/218#issuecomment-test',
    ...evidence,
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
  expect(hold.resolution_actions).not.toContain('target_authority_integration');
  release(hold);
  replaceProjectionRow(files, hold);
  writeMeta(files, meta);
  return files;
}

function integrateTargetHoldInFiles(files, holdId, paragraph) {
  const registry = JSON.parse(asText(files[TARGET_REGISTRY_PATH]));
  const record = registry.exercises.find((item) => item.id === paragraph);
  expect(record).toBeDefined();
  record.record_status = 'reviewed_final';
  record.integration_test_marker = `integrated-${paragraph}`;
  files[TARGET_REGISTRY_PATH] = `${JSON.stringify(registry, null, 2)}\n`;

  const meta = JSON.parse(asText(files[META_PATH]));
  const authority = meta.authority_sources.find((item) => item.path === TARGET_REGISTRY_PATH);
  authority.sha256 = sha256CanonicalText(files[TARGET_REGISTRY_PATH]);
  const pin = meta.target_registry_pins.find((item) => item.id === paragraph);
  pin.target_status = record.record_status;
  pin.target_record_sha256 = sha256(JSON.stringify(record));

  const hold = meta.holds.find((item) => item.id === holdId);
  expect(hold).toBeDefined();
  expect(hold.resolution_actions).toEqual(['target_authority_integration']);
  release(hold, {
    subject_id: paragraph,
    subject_sha256: pin.target_record_sha256,
    integrated_commit: 'c'.repeat(40),
  });
  replaceProjectionRow(files, hold);
  writeMeta(files, meta);
  return files;
}

function approveOutlineInFiles(files) {
  const meta = JSON.parse(asText(files[META_PATH]));
  const approvedOutlineHash = sha256SemanticAuthority(files[OUTLINE_PATH]);
  const reviewedHead = 'b'.repeat(40);
  const decisionRef = 'https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-1234567890';
  const hold = meta.holds.find((item) => item.id === 'H-OUTLINE-OWNER');
  release(hold, {
    released_by: 'owner@example.test',
    released_on: '2026-09-01',
    evidence_ref: decisionRef,
    subject_id: meta.version,
    subject_sha256: approvedOutlineHash,
    reviewed_pr: APPROVAL_PR_NUMBER,
    reviewed_head: reviewedHead,
  });
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
    approved_outline_sha256: approvedOutlineHash,
    approved_pr: APPROVAL_PR_NUMBER,
    approved_commit: reviewedHead,
    decision_ref: decisionRef,
    decided_on: '2026-09-01',
    decided_by: 'owner@example.test',
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

  test('lifecycle-only header and hold transitions preserve the semantic hash', () => {
    const files = cloneFiles();
    const before = sha256SemanticAuthority(files[OUTLINE_PATH]);
    const approvedFiles = approveOutlineInFiles(files);
    expect(sha256SemanticAuthority(approvedFiles[OUTLINE_PATH])).toBe(before);
    expect(JSON.parse(asText(approvedFiles[META_PATH])).owner_approval.approved_outline_sha256).toBe(before);
  });

  test.each([
    ['Status: `review_ready_with_holds`', 'Status: `approved_with_holds`', 'status does not match metadata'],
    ['Owner approval: `pending`', 'Owner approval: `approved`', 'owner approval status does not match metadata'],
  ])('validates excluded lifecycle header separately: %s', (current, replacement, failure) => {
    const files = mutate(OUTLINE_PATH, current, replacement);
    expect(sha256SemanticAuthority(files[OUTLINE_PATH])).toBe(sha256SemanticAuthority(cloneFiles()[OUTLINE_PATH]));
    expectFailure(files, failure);
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

    const preApprovalHash = sha256SemanticAuthority(cloneFiles()[OUTLINE_PATH]);
    const approvedFiles = approveOutlineInFiles(cloneFiles());
    expect(sha256SemanticAuthority(approvedFiles[OUTLINE_PATH])).toBe(preApprovalHash);
    expect(findBookOutlineFailures(approvedFiles, { requireApproved: true })).toEqual([]);
    expect(findBookOutlineFailures(approvedFiles, { action: 'approved_outline_use' })).toEqual([]);

    const meta = JSON.parse(asText(approvedFiles[META_PATH]));
    expect(blockingHoldsForAction(meta, { action: 'merge' }).map((hold) => hold.id)).toContain('H-MERGE-GOVERNANCE');
  });

  test.each([
    ['approved_pr', 999, 'approved_pr must match the exact owner-reviewed PR binding'],
    ['approved_commit', 'a'.repeat(40), 'approved_commit must match the exact owner-reviewed head'],
    ['decision_ref', 'https://example.test/shape-valid-comment', 'decision_ref must match the exact owner decision/comment reference'],
    ['decided_on', '2026-08-31', 'decided_on must match the owner release date'],
    ['decided_by', 'other-owner@example.test', 'decided_by must match the owner release identity'],
  ])('approved mode rejects a shape-valid but non-matching %s', (field, value, failure) => {
    const files = approveOutlineInFiles(cloneFiles());
    const meta = JSON.parse(asText(files[META_PATH]));
    meta.owner_approval[field] = value;
    files[META_PATH] = `${JSON.stringify(meta, null, 2)}\n`;
    expectFailure(files, failure, { requireApproved: true });
  });

  test('semantic content changes the hash and invalidates an existing owner approval', () => {
    const files = approveOutlineInFiles(cloneFiles());
    const approvedHash = sha256SemanticAuthority(files[OUTLINE_PATH]);
    files[OUTLINE_PATH] = asText(files[OUTLINE_PATH]).replace(
      'Book 2 turns the market foundations from Book 1',
      'Book 2 materially changes the market foundations from Book 1',
    );
    const changedHash = sha256SemanticAuthority(files[OUTLINE_PATH]);
    expect(changedHash).not.toBe(approvedHash);
    const meta = JSON.parse(asText(files[META_PATH]));
    meta.semantic_authority.sha256 = changedHash;
    files[META_PATH] = `${JSON.stringify(meta, null, 2)}\n`;
    expectFailure(files, 'approved_outline_sha256 must match semantic_authority.sha256', { requireApproved: true });
  });

  test('§2.1.1 goal approval and target integration are separate production milestones', () => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { action: 'goal_owner_decision', paragraph: '2.1.1' })).toEqual([]);
    releaseHoldInFiles(files, 'H-211-GATE0B1');
    expect(findBookOutlineFailures(files, { action: 'approved_goal_use', paragraph: '2.1.1' })).toEqual([]);
    expectFailure(files, 'action paragraph_production is blocked by open hold H-211-TARGET-INTEGRATION', { action: 'paragraph_production', paragraph: '2.1.1' });
    expect(findBookOutlineFailures(files, { action: 'target_authority_repair', paragraph: '2.1.1' })).toEqual([]);
    expect(findBookOutlineFailures(files, { action: 'target_authority_integration', paragraph: '2.1.1' })).toEqual([]);
    integrateTargetHoldInFiles(files, 'H-211-TARGET-INTEGRATION', '2.1.1');
    expect(findBookOutlineFailures(files, { action: 'paragraph_production', paragraph: '2.1.1' })).toEqual([]);
  });

  test.each([
    ['H-212-STALE-REF', '2.1.2'],
    ['H-213-DELTAQ', '2.1.3'],
  ])('%s requires repair, integration, an exact refreshed pin, and integration evidence before production', (holdId, paragraph) => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { action: 'target_authority_repair', paragraph })).toEqual([]);
    expectFailure(files, `action paragraph_production is blocked by open hold ${holdId}`, { action: 'paragraph_production', paragraph });
    expect(findBookOutlineFailures(files, { action: 'target_authority_integration', paragraph })).toEqual([]);
    integrateTargetHoldInFiles(files, holdId, paragraph);
    expect(findBookOutlineFailures(files, { action: 'paragraph_production', paragraph })).toEqual([]);
  });

  test.each([
    ['H-231-V5', '2.3.1'],
    ['H-232-V5', '2.3.2'],
    ['H-233-V5-REF', '2.3.3'],
    ['H-234-PLACEHOLDER', '2.3.4'],
  ])('%s releases only through exact target integration while independent chapter holds remain', (holdId, paragraph) => {
    const files = approveOutlineInFiles(cloneFiles());
    expect(findBookOutlineFailures(files, { action: 'target_authority_repair', paragraph })).toEqual([]);
    expect(blockingHoldsForAction(JSON.parse(asText(files[META_PATH])), { action: 'paragraph_production', paragraph }).map((hold) => hold.id)).toContain(holdId);
    expect(findBookOutlineFailures(files, { action: 'target_authority_integration', paragraph })).toEqual([]);
    integrateTargetHoldInFiles(files, holdId, paragraph);
    const blockers = blockingHoldsForAction(JSON.parse(asText(files[META_PATH])), { action: 'paragraph_production', paragraph }).map((hold) => hold.id);
    expect(blockers).not.toContain(holdId);
    expect(blockers).toContain('H-CHAPTER-23-PLAN');
  });

  test('blocks paragraph production for 2.1.1 with both matching open holds', () => {
    const failures = findBookOutlineFailures(cloneFiles(), { action: 'paragraph_production', paragraph: '2.1.1' });
    expect(failures).toEqual(expect.arrayContaining([
      expect.stringContaining('H-OUTLINE-OWNER'),
      expect.stringContaining('H-211-TARGET-INTEGRATION'),
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
    integrateTargetHoldInFiles(files, 'H-211-TARGET-INTEGRATION', '2.1.1');

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

  test('a single-milestone goal hold can transition from open to released with evidence', () => {
    const meta = JSON.parse(asText(cloneFiles()[META_PATH]));
    const hold = meta.holds.find((item) => item.id === 'H-211-GATE0B1');
    expect(hold.status).toBe('open');
    release(hold);
    expect(blockingHoldsForAction(meta, { action: 'approved_goal_use', paragraph: '2.1.1' }).map((item) => item.id)).not.toContain('H-211-GATE0B1');
  });

  test('rejects a released hold without complete release evidence', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      const hold = meta.holds.find((item) => item.id === 'H-211-GATE0B1');
      hold.status = 'released';
      hold.release_evidence = { released_by: 'owner' };
    }), 'released hold H-211-GATE0B1 requires resolved_via, released_by, released_on, and evidence_ref');
  });

  test('a released hold no longer blocks its formerly blocked action', () => {
    const meta = JSON.parse(asText(cloneFiles()[META_PATH]));
    release(meta.holds.find((item) => item.id === 'H-211-GATE0B1'));
    const blockers = blockingHoldsForAction(meta, { action: 'approved_goal_use', paragraph: '2.1.1' });
    expect(blockers.map((item) => item.id)).not.toContain('H-211-GATE0B1');
  });

  test('rejects release evidence on an open hold', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      meta.holds[1].release_evidence = { released_by: 'owner', released_on: '2026-09-01', evidence_ref: 'invalid while open' };
    }), 'open hold H-211-GATE0B1 must have null release_evidence');
  });

  test('rejects an action listed in both blocks and permits', () => {
    expectFailure(mutateJson(META_PATH, (meta) => meta.holds[1].permits.push('approved_goal_use')), 'cannot both block and permit approved_goal_use');
  });

  test('rejects a resolution action that is not explicitly permitted', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      meta.holds.find((hold) => hold.id === 'H-212-STALE-REF').permits = ['goal_design'];
    }), 'resolution action target_authority_integration must be explicitly permitted');
  });

  test('rejects a generic multi-action release instead of split lifecycle milestones', () => {
    expectFailure(mutateJson(META_PATH, (meta) => {
      const hold = meta.holds.find((item) => item.id === 'H-211-GATE0B1');
      hold.permits.push('target_authority_repair');
      hold.resolution_actions.push('target_authority_repair');
    }), 'requires exactly one resolution action');
  });

  test.each([
    ['subject_id', '2.1.3', 'subject_id must match its single paragraph scope'],
    ['subject_sha256', 'd'.repeat(64), 'subject_sha256 must match the current target registry pin'],
    ['integrated_commit', 'a'.repeat(39), 'requires a full integrated_commit SHA'],
  ])('rejects target release evidence with a non-matching %s', (field, value, failure) => {
    const files = approveOutlineInFiles(cloneFiles());
    integrateTargetHoldInFiles(files, 'H-212-STALE-REF', '2.1.2');
    const meta = JSON.parse(asText(files[META_PATH]));
    const hold = meta.holds.find((item) => item.id === 'H-212-STALE-REF');
    hold.release_evidence[field] = value;
    replaceProjectionRow(files, hold);
    writeMeta(files, meta);
    expectFailure(files, failure);
  });

  test.each([
    ['status', 1, 'released'],
    ['scope', 2, '`paragraph:2.1.2`'],
    ['blocks', 3, '`approved_goal_use`, `paragraph_production`'],
    ['permits', 4, '`goal_design`, `target_design`, `specialist_review`'],
    ['resolution_actions', 5, '`target_authority_repair`'],
    ['release_condition', 6, 'A different release condition.'],
    ['release_evidence', 7, 'resolved_via=goal_owner_decision; released_by=owner; released_on=2026-09-01; evidence_ref=wrong reference'],
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
