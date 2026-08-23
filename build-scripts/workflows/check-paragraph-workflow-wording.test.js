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
      files_checked: 12,
      failures: [],
    });
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
