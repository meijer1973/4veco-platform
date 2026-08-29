'use strict';

const path = require('path');

const {
  ACTIVE_SURFACES,
  readFiles,
  findContractFailures,
} = require('./check-part-a-exercise-authoring-contract');

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

function mutateAll(file, search, replacement = '') {
  const files = cloneFiles();
  expect(files[file]).toContain(search);
  files[file] = files[file].split(search).join(replacement);
  return files;
}

function expectFailure(files, fragment, options) {
  const failures = findContractFailures(files, options);
  expect(failures.some((failure) => failure.includes(fragment))).toBe(true);
}

describe('Part A exercise authoring source contract', () => {
  test('current platform guidance passes without inspecting lesson output', () => {
    expect(findContractFailures(cloneFiles())).toEqual([]);
    expect(ACTIVE_SURFACES.every((file) => !file.includes('4veco-lessen'))).toBe(true);
  });

  test('rejects reordered or interrupted canonical headings', () => {
    const files = mutate(
      'skills/econ-exercise-builder.md',
      '2. Startopgaven\n3. Begeleide inoefening',
      '2. Begeleide inoefening\n3. Startopgaven'
    );
    expectFailure(files, 'canonical seven-heading block');

    const interrupted = mutate(
      'skills/econ-exercise-builder.md',
      '2. Startopgaven\n3. Begeleide inoefening',
      '2. Startopgaven\n3. Samenvatting\n4. Begeleide inoefening'
    );
    expectFailure(interrupted, 'canonical seven-heading block');
  });

  test('rejects extra or intervening headings in the operational template', () => {
    const extraStartHeading = mutate(
      'skills/econ-exercise-builder.md',
      '## Startopgaven\n\n**Opgave 1 — Ophalen**',
      '## Startopgaven\n\n## Voorkennis ophalen\n\n**Opgave 1 — Ophalen**'
    );
    expectFailure(extraStartHeading, 'operational template must contain exactly');

    const websiteStage = mutate(
      'skills/econ-exercise-builder.md',
      '[Fully solved example — students read, not solve]\n\n## Startopgaven',
      '[Fully solved example — students read, not solve]\n\n## Website-help\n\n## Startopgaven'
    );
    expectFailure(websiteStage, 'operational template must contain exactly');
  });

  test('rejects reordered paragraph diagram and build-guide sequence', () => {
    expectFailure(
      mutate(
        'skills/econ-textbook-paragraph.md',
        '│ 7. ZELFSTANDIGE OEFENING                    │\n│ 8. DOELOEFENING',
        '│ 7. DOELOEFENING                             │\n│ 8. ZELFSTANDIGE OEFENING'
      ),
      'canonical paragraph structure diagram'
    );
    expectFailure(
      mutate(
        'BUILD-PARAGRAPH.md',
        '3. Begeleide inoefening\n4. Zelfstandige oefening',
        '3. Zelfstandige oefening\n4. Begeleide inoefening'
      ),
      'canonical seven-heading block'
    );
  });

  test.each([
    ['retrieval of prerequisites already taught', 'Startopgaven retrieval role missing'],
    ['compact check of\n   current-content comprehension', 'Startopgaven comprehension role missing'],
    ['deliberately fades', 'optional guided/fading rule missing'],
    ['introduces no\n   new theory', 'closing-review rule missing'],
    ['Book 1 output is frozen', 'Book 1 freeze missing'],
  ])('rejects removal of %s', (needle, failure) => {
    expectFailure(mutate('skills/econ-exercise-builder.md', needle), failure);
  });

  test('rejects removal of route, neutral skip wording, and flexibility semantics', () => {
    expectFailure(
      mutateAll('skills/econ-exercise-builder.md', 'Korte route:'),
      'core route note missing'
    );
    expectFailure(
      mutateAll('skills/econ-exercise-builder.md', 'Heb je deze hulp niet nodig?'),
      'neutral guided skip wording missing'
    );
    const files = mutate(
      'skills/econ-exercise-builder.md',
      '**Denkertje / Bonusopgave** builds cognitive flexibility with a new',
      '**Denkertje / Bonusopgave** adds routine calculation with a new'
    );
    expectFailure(files, 'bonus cognitive-flexibility rule missing');
  });

  test('rejects fake or stale lesson-time proof', () => {
    expectFailure(
      mutate('skills/econ-exercise-builder.md', 'ranges below are recommendations, not proof by themselves'),
      'range-sum-is-not-proof safeguard missing'
    );
    const files = cloneFiles();
    files['skills/econ-textbook-paragraph.md'] += '\nExercise set fits 40–60 min of student work.\n';
    expectFailure(files, 'stale 40–60-minute exercise-set timing rule');
  });

  test('rejects review severity downgrade and target-absent graph demand', () => {
    expectFailure(
      mutate(
        'skills/econ-paragraph-review.md',
        'Any missing, reordered, or intervening top-level stage is a FAIL.',
        'Any missing, reordered, or intervening top-level stage is a FLAG.'
      ),
      'review adjacency hard-fail severity missing'
    );
    expectFailure(
      mutate(
        'skills/econ-paragraph-review.md',
        'produce their own graph/table only when graph/table production is a target operation',
        'produce their own graphs/tables in every doeloefening'
      ),
      'target-conditional representation rule missing'
    );
  });

  test.each([
    ['prerequisite-retrieval task is\n   normally 3–5 minutes', 'Start retrieval 3–5-minute norm missing'],
    ['teacher may assign that printed retrieval task at\n   the beginning of the lesson', 'classroom-order/printed-order clarification missing'],
    ['may not expand into adjacent\n   content or hide enrichment inside the core route', 'independent-practice scope boundary missing'],
    ['Light\n   adaptation is allowed only where the blueprint or responsible owner\n   authorizes it', 'authorized target-adaptation rule missing'],
  ])('rejects removal of bounded clarification %s', (needle, failure) => {
    expectFailure(mutate('skills/econ-exercise-builder.md', needle), failure);
  });

  test('rejects legacy terminology and lesson-output scope expansion', () => {
    const files = cloneFiles();
    files['skills/econ-didactiek.md'] += '\nStartoefeningen are mandatory.\n';
    expectFailure(files, 'legacy Startoefening/Startoefeningen');

    expectFailure(
      cloneFiles(),
      'platform-source-only and non-retroactive',
      { activeSurfaces: [...ACTIVE_SURFACES, '../4veco-lessen/book-1/paragraph.md'] }
    );
  });

  test('rejects Part B route wording without an explicit boundary', () => {
    const files = cloneFiles();
    files['skills/econ-didactiek.md'] += '\nUse Start -> Leer -> Check -> Oefen -> Exit ticket.\n';
    expectFailure(files, 'companion route is not explicitly bounded to Part B');
  });

  test('rejects missing CI and navigation wiring', () => {
    expectFailure(
      mutate('.github/workflows/platform-ci.yml', 'npm run check:part-a-exercise-authoring-contract'),
      'explicit CI checker step missing'
    );
    expectFailure(
      mutateAll('AGENT_GITHUB_ENTRY.md', 'build-scripts/workflows/check-part-a-exercise-authoring-contract.js'),
      'navigation entry missing'
    );
  });
});
