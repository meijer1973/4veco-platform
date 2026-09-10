'use strict';

const fs = require('fs');
const path = require('path');

const {
  CANONICAL_NAVIGATION_PATHS,
  LEGACY_PROFILE_LINKS,
  MAP_ANCHOR_KEYS,
  NAVIGATION_FILES,
  findRuleFailures,
  findNavigationFailures,
  findEntryLinkFailures,
  markdownAnchors,
  checkParagraphWorkflowWording,
} = require('./check-paragraph-workflow-wording');
const { buildBody } = require('../sprints/emit-url-index');

const root = path.resolve(__dirname, '..', '..');
const rawMain = 'https://raw.githubusercontent.com/meijer1973/4veco-platform/main/';

function readNavigationFiles() {
  const files = Object.fromEntries(NAVIGATION_FILES.map((file) => [
    file,
    fs.readFileSync(path.join(root, file), 'utf8'),
  ]));
  files['reports/url-index.md'] = buildBody('main');
  return files;
}

function replaceInSection(text, start, end, needle, replacement = '') {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) throw new Error(`missing section start: ${start}`);
  const endIndex = end ? text.indexOf(end, startIndex + start.length) : text.length;
  if (end && endIndex === -1) throw new Error(`missing section end: ${end}`);
  const section = text.slice(startIndex, endIndex);
  if (!section.includes(needle)) throw new Error(`missing mutation target: ${needle}`);
  return text.slice(0, startIndex) + section.replace(needle, replacement) + text.slice(endIndex);
}

function mutateNavigationFile(input, file, start, end, needle) {
  const mutated = { ...input };
  mutated[file] = replaceInSection(mutated[file], start, end, needle);
  return mutated;
}

function navigationMutationCases() {
  const cases = [];
  for (const canonicalPath of CANONICAL_NAVIGATION_PATHS) {
    const rawUrl = `${rawMain}${canonicalPath}`;
    const anchorKey = MAP_ANCHOR_KEYS[canonicalPath];
    cases.push(
      [
        `research human list: ${canonicalPath}`,
        'RESEARCH_AGENT_MAP.md',
        'Human-readable:',
        'Machine-readable:',
        `- \`${canonicalPath}\``,
        `RESEARCH_AGENT_MAP.md: human-readable entry missing ${canonicalPath}`,
      ],
      [
        `research entry URL list: ${canonicalPath}`,
        'RESEARCH_AGENT_MAP.md',
        'entry_points (full URLs):',
        '## Index Anchors',
        `- ${rawUrl}`,
        `RESEARCH_AGENT_MAP.md: entry-point URL missing ${canonicalPath}`,
      ],
      [
        `research anchor JSON: ${canonicalPath}`,
        'RESEARCH_AGENT_MAP.md',
        '## Index Anchors',
        'index_anchors (full URLs):',
        `  "${anchorKey}": "${canonicalPath}",`,
        `RESEARCH_AGENT_MAP.md: index-anchor JSON missing ${canonicalPath}`,
      ],
      [
        `research anchor URL list: ${canonicalPath}`,
        'RESEARCH_AGENT_MAP.md',
        'index_anchors (full URLs):',
        '## Path Registry',
        `- ${rawUrl}`,
        `RESEARCH_AGENT_MAP.md: index-anchor URL missing ${canonicalPath}`,
      ],
      [
        `GitHub routing row: ${canonicalPath}`,
        'AGENT_GITHUB_ENTRY.md',
        '| How should paragraph work be split',
        '\n| How should accessibility',
        `\`${canonicalPath}\``,
        `AGENT_GITHUB_ENTRY.md: routing row missing ${canonicalPath}`,
      ],
      [
        `GitHub useful list: ${canonicalPath}`,
        'AGENT_GITHUB_ENTRY.md',
        'Useful entry points:',
        'Task-routing guidance:',
        `- \`${canonicalPath}\``,
        `AGENT_GITHUB_ENTRY.md: useful entry missing ${canonicalPath}`,
      ],
      [
        `URL-index source: ${canonicalPath}`,
        'build-scripts/sprints/emit-url-index.js',
        "lines.push('## Repo Operating Rules');",
        "lines.push('## PR Governance');",
        `platform('${canonicalPath}')`,
        `build-scripts/sprints/emit-url-index.js: Repo Operating Rules missing ${canonicalPath}`,
      ],
      [
        `generated URL index: ${canonicalPath}`,
        'reports/url-index.md',
        '## Repo Operating Rules',
        '## PR Governance',
        `- ${rawUrl}`,
        `reports/url-index.md: Repo Operating Rules missing ${canonicalPath}`,
      ]
    );
  }
  for (const [file, href] of Object.entries(LEGACY_PROFILE_LINKS)) {
    cases.push([
      `legacy profile Markdown link: ${file}`,
      file,
      '',
      null,
      `](${href})`,
      `${file}: missing relative Markdown link to legacy profile`,
    ]);
  }
  return cases;
}

describe('check-paragraph-workflow-wording', () => {
  test('active workflow surfaces preserve the two-lane and full-route contract', () => {
    expect(checkParagraphWorkflowWording()).toEqual({
      ok: true,
      files_checked: 13,
      failures: [],
    });
  });

  function entryFixture(overrides = {}, includeLessonEntry = true) {
    const files = {
      'docs/workflows/part-a-start.md': '[review](../../AGENTS.md#source-integrity-and-learning-quality)',
      'docs/workflows/paired-paragraph-ci.md': '# Paired paragraph CI',
      'AGENTS.md': '# Guide\n## Source integrity and learning quality\n[spec](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/product-vision.md)\nLocal: `../4veco-lessen/specifications/product-vision.md`',
      'BUILD-PARAGRAPH.md': '[quality](AGENTS.md#source-integrity-and-learning-quality)',
      'skills/econ-chapter-builder.md': '[quality](../AGENTS.md#source-integrity-and-learning-quality)',
      '../4veco-lessen/AGENTS.md': '[guide](https://github.com/meijer1973/4veco-platform/blob/main/AGENTS.md)\nLocal: `../4veco-platform/AGENTS.md`',
      '../4veco-lessen/specifications/product-vision.md': '# Product vision',
      ...overrides,
    };
    const absoluteFiles = new Map(Object.entries(files).map(([file, text]) => [path.resolve(root, file), text]));
    return findEntryLinkFailures(root, { includeLessonEntry, read: (file) => absoluteFiles.get(file) ?? null });
  }

  test('entry links resolve in both repositories, including the nested skill and local path instructions', () => {
    expect(entryFixture()).toEqual([]);
  });

  test.each([
    ['docs/workflows/part-a-start.md', '[review](missing.md)', /linked file missing/],
    ['docs/workflows/part-a-start.md', '[review](../../AGENTS.md#obsolete)', /linked section missing/],
    ['AGENTS.md', '[spec](../4veco-lessen/specifications/product-vision.md)', /cross-repository hyperlink/],
    ['../4veco-lessen/AGENTS.md', '[guide](../4veco-platform/AGENTS.md)', /cross-repository hyperlink/],
    ['../4veco-lessen/AGENTS.md', null, /entry navigation surface missing/],
    ['AGENTS.md', '[spec](https://github.com/wrong-owner/4veco-lessen/blob/main/specifications/product-vision.md)', /unexpected entry-guide GitHub destination/],
    ['AGENTS.md', '[spec](https://github.com/meijer1973/4veco-lessen/blob/main/specifications/missing.md)', /linked file missing/],
    ['BUILD-PARAGRAPH.md', '[Design Principles](AGENTS.md#design-principles)', /linked section missing/],
    ['BUILD-PARAGRAPH.md', '[quality](AGENTS.md#)', /linked section fragment is empty/],
    ['skills/econ-chapter-builder.md', '[quality](../AGENTS.md#)', /linked section fragment is empty/],
    ['skills/econ-chapter-builder.md', '[Design Principles](../AGENTS.md#design-principles)', /linked section missing/],
    ['skills/econ-chapter-builder.md', 'see AGENTS.md, Design Principles section', /missing linked AGENTS.md section guidance/],
  ])('rejects broken entry navigation in %s: %s', (file, text, expected) => {
    expect(entryFixture({ [file]: text })).toEqual(expect.arrayContaining([expect.stringMatching(expected)]));
  });

  test('default platform validation permits the older lesson entry used by platform-first CI', () => {
    expect(entryFixture({ '../4veco-lessen/AGENTS.md': '[guide](../4veco-platform/AGENTS.md)' }, false)).toEqual([]);
  });

  test('entry fragments follow heading slugs, duplicate suffixes and explicit compatibility anchors', () => {
    expect(markdownAnchors('# A **heading**!\n## A **heading**!\n```md\n# Not a section\n```\n<a name="old-section"></a>')).toEqual(
      new Set(['a-heading', 'a-heading-1', 'old-section'])
    );
  });

  test.each(navigationMutationCases())(
    'fails the exact navigation placement when omitted: %s',
    (_label, file, start, end, needle, expected) => {
      const input = mutateNavigationFile(readNavigationFiles(), file, start, end, needle);
      expect(findNavigationFailures(input)).toContain(expected);
    }
  );

  test('flags stale publisher-only PDF wording', () => {
    const failures = findRuleFailures(
      'fixture.md',
      'PDF output belongs to Part A / publisher-print unless a future decision changes it.',
      []
    );

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatch(/contains stale wording/);
  });

  test('flags a missing baseline-versus-product distinction', () => {
    const failures = findRuleFailures(
      'fixture.md',
      'The validator has fourteen files.',
      [/14-file baseline is not the complete product route/i],
      []
    );

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatch(/missing required wording/);
  });
});
