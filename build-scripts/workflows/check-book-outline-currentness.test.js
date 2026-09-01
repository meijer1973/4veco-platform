'use strict';

const path = require('path');

const {
  AUTHORITY_PATHS,
  CONTENT_HOLDS,
  META_PATH,
  OUTLINE_PATH,
  TARGET_REGISTRY_PATH,
  WORKFLOW_POINTERS,
  asText,
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

describe('Book 2 outline currentness contract', () => {
  test('current outline, sources, targets, holds, fields, and workflow pointers pass structural mode', () => {
    expect(findBookOutlineFailures(cloneFiles())).toEqual([]);
  });

  test('file hashes are invariant across LF and CRLF checkouts', () => {
    const lfFiles = Object.fromEntries(
      Object.entries(cloneFiles()).map(([file, value]) => [
        file,
        value === null ? null : asText(value).replace(/\r\n?/g, '\n'),
      ])
    );
    const crlfFiles = Object.fromEntries(
      Object.entries(lfFiles).map(([file, value]) => [
        file,
        value === null ? null : value.replace(/\n/g, '\r\n'),
      ])
    );
    expect(findBookOutlineFailures(lfFiles)).toEqual([]);
    expect(findBookOutlineFailures(crlfFiles)).toEqual([]);
  });

  test.each(AUTHORITY_PATHS)('rejects a stale authority source hash: %s', (file) => {
    expectFailure(mutate(file, asText(cloneFiles()[file]).slice(0, 20), 'mutated source bytes'), `authority hash is stale for ${file}`);
  });

  test('rejects a stale outline hash', () => {
    expectFailure(mutate(OUTLINE_PATH, '# Book 2 Outline', '# Mutated Book 2 Outline'), 'outline_sha256 is stale');
  });

  test('rejects missing and reordered Book 2 IDs', () => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.paragraph_order.splice(1, 1);
      }),
      'exact 12 Book 2 IDs'
    );
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        [meta.paragraphs[0], meta.paragraphs[1]] = [meta.paragraphs[1], meta.paragraphs[0]];
      }),
      'paragraph IDs are missing or reordered'
    );
  });

  test('rejects changed kinds and statuses', () => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.paragraphs[0].kind = 'gemengde_opgaven';
      }),
      'paragraph kind does not match'
    );
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.paragraphs[8].target_status = 'reviewed_final';
      }),
      'target status does not match'
    );
  });

  test('rejects stale target record hashes', () => {
    const files = cloneFiles();
    const registry = JSON.parse(asText(files[TARGET_REGISTRY_PATH]));
    registry.exercises.find((record) => record.id === '2.1.1').lesson_goals.push('mutated goal');
    files[TARGET_REGISTRY_PATH] = `${JSON.stringify(registry, null, 2)}\n`;
    expectFailure(files, '2.1.1 target record hash is stale');
  });

  test('rejects a missing required paragraph planning field', () => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        delete meta.paragraphs[0].operation_emphasis;
      }),
      'required paragraph field is missing: operation_emphasis'
    );
  });

  test.each(CONTENT_HOLDS)('rejects erasure of required hold %s', (holdId) => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.holds = meta.holds.filter((hold) => hold.id !== holdId);
        for (const paragraph of meta.paragraphs) paragraph.holds = paragraph.holds.filter((id) => id !== holdId);
      }),
      `required hold is missing: ${holdId}`
    );
  });

  test('rejects an unknown paragraph hold reference', () => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.paragraphs[0].holds.push('H-UNKNOWN');
      }),
      'references unknown hold H-UNKNOWN'
    );
  });

  test('rejects preview-to-mastery promotion', () => {
    expectFailure(
      mutateJson(META_PATH, (meta) => {
        meta.semantic_invariants[0] = 'preview_is_mastery';
      }),
      'semantic invariant missing: preview_or_familiarity_must_not_be_treated_as_mastery'
    );
    expectFailure(
      mutate(
        OUTLINE_PATH,
        'Familiarity or preview that is not prerequisite mastery',
        'Familiarity is mastery'
      ),
      'preview-versus-mastery boundary is missing'
    );
  });

  test.each(WORKFLOW_POINTERS)('rejects loss of Book foundation pointer from %s', (file) => {
    expectFailure(mutateAll(file, 'Book foundation check', 'Foundation information'), 'Book foundation check is missing');
  });

  test('rejects missing npm and CI wiring', () => {
    expectFailure(
      mutateJson('package.json', (pkg) => {
        delete pkg.scripts['check:book-outline-currentness'];
      }),
      'check:book-outline-currentness script'
    );
    expectFailure(
      mutate(
        '.github/workflows/platform-ci.yml',
        '      - name: Validate Book 2 outline currentness\n        run: npm run check:book-outline-currentness\n'
      ),
      'platform CI wiring'
    );
  });

  test('approved-use mode fails closed while owner approval is pending', () => {
    expectFailure(cloneFiles(), 'approved mode requires approved or approved_with_holds status', { requireApproved: true });
  });

  test('approved-use mode requires exact version, outline hash, PR, and commit pins', () => {
    const files = mutateJson(META_PATH, (meta) => {
      meta.status = 'approved_with_holds';
      meta.owner_approval = {
        status: 'approved',
        approved_version: meta.version,
        approved_outline_sha256: meta.outline_sha256,
        approved_pr: 999,
        approved_commit: 'a'.repeat(40),
      };
      meta.holds = meta.holds.filter((hold) => hold.id !== 'H-OUTLINE-OWNER');
      for (const paragraph of meta.paragraphs) paragraph.holds = paragraph.holds.filter((id) => id !== 'H-OUTLINE-OWNER');
    });
    expect(findBookOutlineFailures(files, { requireApproved: true })).toEqual([]);
  });
});
