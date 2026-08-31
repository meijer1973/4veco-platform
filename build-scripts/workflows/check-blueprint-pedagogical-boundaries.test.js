'use strict';

const path = require('path');

const {
  POINTER_SURFACES,
  POLICY_PATH,
  V5_META_PATH,
  V6_META_PATH,
  findBoundaryFailures,
  normalizeSourceText,
  readFiles,
} = require('./check-blueprint-pedagogical-boundaries');

const root = path.resolve(__dirname, '..', '..');

function cloneFiles() {
  return { ...readFiles(root) };
}

function mutate(file, search, replacement = '') {
  const files = cloneFiles();
  expect(files[file]).toContain(search);
  files[file] = files[file].replace(search, replacement);
  return files;
}

function mutateJson(file, mutator) {
  const files = cloneFiles();
  const value = JSON.parse(files[file]);
  mutator(value);
  files[file] = `${JSON.stringify(value, null, 2)}\n`;
  return files;
}

function expectFailure(files, fragment) {
  const failures = findBoundaryFailures(files);
  expect(failures.some((failure) => failure.includes(fragment))).toBe(true);
}

describe('blueprint pedagogical-boundary source contract', () => {
  test('normalizes source line endings', () => {
    expect(normalizeSourceText('alpha\r\nbeta\rgamma')).toBe('alpha\nbeta\ngamma');
  });

  test('current platform policy, metadata, pointers, and wiring pass', () => {
    expect(findBoundaryFailures(cloneFiles())).toEqual([]);
  });

  test('fails closed when the owned policy file is missing', () => {
    const files = cloneFiles();
    files[POLICY_PATH] = null;
    expectFailure(files, 'required source file is missing');
  });

  test.each([
    ['explanation or context for an approved lesson goal or target operation', 'bounded explanation/context'],
    ['retrieval of a prerequisite that was already taught', 'already-taught prerequisite'],
    ['explicitly optional perspective that does not become part of the core\n  route', 'optional-perspective'],
    ['may not fill a `Covered` cell', 'preview-to-Covered'],
    ['It is not evidence of mastery', 'preview-to-mastery'],
    ['reviewed target exercise or an approved lesson goal', 'goal/target authorization'],
    ['must not displace practice of an approved target operation', 'target-practice displacement'],
    ['whole-lesson equation of at most 55 minutes', '55-minute route'],
    ['do not remove a target operation to make room', 'target-operation preservation'],
  ])('rejects deletion of critical policy clause: %s', (text, failure) => {
    expectFailure(mutate(POLICY_PATH, text), failure);
  });

  test('rejects omission of any protected Part A target stage', () => {
    expectFailure(mutate(POLICY_PATH, 'the current-content Startopgaven check, '), 'protected Part A target stages');
  });

  test('rejects shortened §2.1.1 or later cost/revenue/profit teaching', () => {
    expectFailure(
      mutate(POLICY_PATH, 'Book 2 §2.1.1 must still\nteach its reviewed cost relations and procedures in full'),
      'Book 2 §2.1.1 formal-teaching'
    );
    expectFailure(
      mutate(POLICY_PATH, 'revenue, profit, and break-even teaching must still provide its own formal\ninstruction and target-level practice'),
      'revenue/profit/break-even'
    );
  });

  test('rejects loss of the Book 1 first-edition freeze', () => {
    expectFailure(mutate(POLICY_PATH, 'The first edition of Book 1 is already printed and is frozen'), 'Book 1 first-edition freeze');
  });

  test.each([V5_META_PATH, V6_META_PATH])('requires the exact normative policy path in %s', (file) => {
    expectFailure(
      mutateJson(file, (meta) => {
        meta.normative_clarifications = ['references/owned/wrong-policy.md'];
      }),
      'normative_clarifications must contain exactly'
    );
  });

  test.each([
    ['preview_is_mastery', true],
    ['later_formal_treatment_still_required', false],
    ['preview_cannot_fill_target_coverage', false],
    ['preview_cannot_add_untargeted_independent_operation', false],
    ['preview_cannot_displace_target_route_or_timing', false],
  ])('requires exact pedagogical metadata flag %s', (key, value) => {
    for (const file of [V5_META_PATH, V6_META_PATH]) {
      expectFailure(
        mutateJson(file, (meta) => {
          meta.pedagogical_scope_policy[key] = value;
        }),
        `pedagogical_scope_policy.${key}`
      );
    }
  });

  test('requires the operational contract path in both metadata files', () => {
    for (const file of [V5_META_PATH, V6_META_PATH]) {
      expectFailure(
        mutateJson(file, (meta) => {
          meta.pedagogical_scope_policy.part_a_exercise_authoring_contract = 'BUILD-PARAGRAPH.md';
        }),
        'part_a_exercise_authoring_contract'
      );
    }
  });

  test('protects the active target registry pointer and v5 counts', () => {
    expectFailure(
      mutateJson(V5_META_PATH, (meta) => {
        meta.active_target_exercise_registry = 'references/authored/other.json';
      }),
      'active_target_exercise_registry'
    );
    expectFailure(
      mutateJson(V5_META_PATH, (meta) => {
        meta.paragraph_counts['2'] = 13;
      }),
      'Year 1 paragraph counts changed'
    );
    expectFailure(
      mutateJson(V5_META_PATH, (meta) => {
        meta.total_count_bearing_paragraphs = 55;
      }),
      'total_count_bearing_paragraphs'
    );
  });

  test('protects the v6 11-book, 4+4+3, count, and Book 11 role model', () => {
    expectFailure(
      mutateJson(V6_META_PATH, (meta) => {
        meta.assessment_structure.books_total = 12;
      }),
      'books_total'
    );
    expectFailure(
      mutateJson(V6_META_PATH, (meta) => {
        meta.assessment_structure.books_by_year['2'] = [5, 6, 7];
      }),
      'books_by_year route changed'
    );
    expectFailure(
      mutateJson(V6_META_PATH, (meta) => {
        meta.final_planning_count_model.count_bearing_by_book['11'] = 10;
      }),
      'count-bearing book model changed'
    );
    expectFailure(
      mutateJson(V6_META_PATH, (meta) => {
        meta.final_planning_count_model.book_11_model.scheduled_timed_paper_repair_cycles = 3;
      }),
      'Book 11 9+4 role model changed'
    );
  });

  test.each(POINTER_SURFACES)('rejects policy-pointer loss from %s', (file) => {
    expectFailure(
      mutate(file, '`references/owned/course-blueprint-pedagogical-boundaries.md`'),
      'must point to references/owned/course-blueprint-pedagogical-boundaries.md'
    );
  });

  test('requires checker discovery in the GitHub entry map', () => {
    expectFailure(
      mutate('AGENT_GITHUB_ENTRY.md', '`build-scripts/workflows/check-blueprint-pedagogical-boundaries.js`'),
      'GitHub entry map'
    );
  });

  test('requires exact npm and platform-CI wiring', () => {
    expectFailure(
      mutateJson('package.json', (pkg) => {
        delete pkg.scripts['check:blueprint-pedagogical-boundaries'];
      }),
      'check:blueprint-pedagogical-boundaries script'
    );
    expectFailure(
      mutate(
        '.github/workflows/platform-ci.yml',
        '      - name: Validate blueprint pedagogical boundaries\n        run: npm run check:blueprint-pedagogical-boundaries\n'
      ),
      'platform CI wiring'
    );
  });

  test('checker is platform-only and does not inspect lesson output', () => {
    const allPaths = Object.keys(cloneFiles());
    expect(allPaths.every((file) => !file.includes('4veco-lessen'))).toBe(true);
    expect(allPaths.every((file) => !file.includes('Boek 1'))).toBe(true);
  });
});
