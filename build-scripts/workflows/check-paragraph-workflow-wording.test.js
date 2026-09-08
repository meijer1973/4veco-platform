'use strict';

const fs = require('fs');
const path = require('path');

const {
  RULES,
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
      files_checked: new Set([...RULES.map((rule) => rule.file), ...NAVIGATION_FILES]).size,
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

  test.each([
    ['agents/README.md', 'Platform/generator changes, companion interaction work, protected-source\nor curriculum changes, and governance or review-policy changes are outside this\nexception.'],
    ['agents/README.md', 'Mixed tasks retain the review required by their consequential changes.'],
    ['agents/README.md', 'An explicit owner request or applicable specialist/human gate still applies.'],
    ['agents/README.md', 'separate from every author whose content they review'],
    ['agents/lead-reviewer-agent.md', 'absent separate specialist reports alone are not a blocker within this exception'],
    ['agents/lead-reviewer-agent.md', 'unless eligible routine Part A has genuine recorded teacher coverage in its independent `econ-paragraph-review`'],
    ['agents/lead-reviewer-agent.md', 'unless eligible routine Part A has genuine recorded student coverage in its independent `econ-paragraph-review`'],
    ['agents/lead-reviewer-agent.md', 'Consolidated content review lacks required coverage, comes from its author, or contains an unresolved FAIL'],
    ['skills/econ-paragraph-review.md', 'No source-authority hold or publication safeguard is waived.'],
    ['skills/econ-paragraph-review.md', '## 2. Verdict\n\n**PASS**'],
    ['skills/econ-paragraph-review.md', 'isolated figure crops do not replace full-page proof'],
    ['skills/econ-paragraph-review.md', 'Changed values require rechecking affected\ncalculations, graphs, and answers; pagination changes require inspection of\naffected neighbouring pages'],
    ['skills/econ-chapter-builder.md', 'Every paragraph still needs\nidentifiable coverage/findings and its required report'],
    ['skills/econ-chapter-builder.md', 'Required structural lead review and\nindependent PR-readiness remain separate release responsibilities.'],
    ['skills/econ-consolidation-builder.md', 'outside the exception retain separate review routing and all explicit specialist gates'],
  ])('fails a removed routine-review boundary or required coverage: %s / %s', (file, clause) => {
    const rule = RULES.find((entry) => entry.file === file);
    const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
    expect(text).toContain(clause);
    expect(findRuleFailures(file, text.replace(clause, ''), rule.required, rule.forbidden)).not.toEqual([]);
  });
});
