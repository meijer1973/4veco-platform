const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  INDEX_PATHS,
  refreshBundleAgentIndexes,
  runTrustedGeneration,
} = require('./refresh-bundle-agent-indexes');

const trustedRoot = path.resolve(__dirname, '..', '..');
const refreshHelperPath = 'build-scripts/review-gates/refresh-bundle-agent-indexes.js';
const refreshHelperUrl = `https://raw.githubusercontent.com/meijer1973/4veco-platform/main/${refreshHelperPath}`;

function markdownSection(text, start, end) {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) throw new Error(`missing section start: ${start}`);
  const endIndex = end ? text.indexOf(end, startIndex + start.length) : text.length;
  if (end && endIndex === -1) throw new Error(`missing section end: ${end}`);
  return text.slice(startIndex, endIndex);
}

function parseJsonFence(text, label) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) throw new Error(`missing JSON fence: ${label}`);
  return JSON.parse(match[1]);
}

function countOccurrences(text, needle) {
  return text.split(needle).length - 1;
}

function removeFromSection(text, start, end, needle) {
  const section = markdownSection(text, start, end);
  if (!section.includes(needle)) throw new Error(`missing mutation target in ${start}: ${needle}`);
  return text.replace(section, section.replace(needle, ''));
}

function validateRefreshHelperNavigation(input) {
  const failures = [];
  const requireValue = (condition, id) => {
    if (!condition) failures.push(id);
  };

  const entryPoints = markdownSection(input.researchMap, '## Entry Points', '## Index Anchors');
  const humanEntryPoints = markdownSection(entryPoints, 'Human-readable:', 'Machine-readable:');
  const machineEntryPoints = parseJsonFence(
    markdownSection(entryPoints, 'Machine-readable:', 'entry_points (full URLs):'),
    'entry_points'
  );
  const entryPointUrls = markdownSection(
    entryPoints,
    'entry_points (full URLs):',
    'Cross-repo entry point (4veco-lessen):'
  );
  requireValue(humanEntryPoints.includes(`- \`${refreshHelperPath}\``), 'entry_points.human');
  requireValue(machineEntryPoints.entry_points.includes(refreshHelperPath), 'entry_points.machine');
  requireValue(countOccurrences(entryPointUrls, `- ${refreshHelperUrl}`) === 2, 'entry_points.urls');

  const anchors = markdownSection(input.researchMap, '## Index Anchors', '## Path Registry');
  const anchorJson = parseJsonFence(anchors, 'index_anchors');
  const anchorUrls = markdownSection(anchors, 'index_anchors (full URLs):', null);
  requireValue(
    anchorJson.bundle_agent_index_refresh_runner === refreshHelperPath,
    'index_anchors.machine'
  );
  requireValue(anchorUrls.includes(`- ${refreshHelperUrl}`), 'index_anchors.urls');

  const pathRegistry = markdownSection(input.researchMap, '## Path Registry', '## Layer Semantics');
  const registryJson = parseJsonFence(pathRegistry, 'path_registry');
  const governanceUrls = markdownSection(
    pathRegistry,
    'pr_governance_paths (full URLs):',
    'reference_paths (full URLs):'
  );
  requireValue(registryJson.pr_governance_paths.includes(refreshHelperPath), 'pr_governance_paths.machine');
  requireValue(governanceUrls.includes(`- ${refreshHelperUrl}`), 'pr_governance_paths.urls');

  const traversal = markdownSection(input.researchMap, '## Agent Traversal Protocol', '## Dependency Flow');
  const bundleTraversal = traversal
    .split(/\r?\n/)
    .find((line) => line.includes('paired platform/lesson bundle readiness and integration ->'));
  requireValue(bundleTraversal && bundleTraversal.includes(`\`${refreshHelperPath}\``), 'traversal.bundle');

  const taskRouting = markdownSection(input.researchMap, '## Research Task Routing', '## Agent Rules');
  const taskRoutingJson = parseJsonFence(taskRouting, 'research_task_routing');
  requireValue(taskRoutingJson.pr_governance.includes(refreshHelperPath), 'task_routing.pr_governance');

  const bundleQuestion = input.githubEntry
    .split(/\r?\n/)
    .find((line) => line.startsWith('| How should a paired platform/lesson PR bundle'));
  const usefulEntryPoints = markdownSection(input.githubEntry, 'Useful entry points:', 'Task-routing guidance:');
  const bundleGuidance = markdownSection(
    input.githubEntry,
    '- Use the cross-repo bundle compatibility workflow',
    null
  );
  requireValue(bundleQuestion && bundleQuestion.includes(`\`${refreshHelperPath}\``), 'github_entry.bundle_question');
  requireValue(usefulEntryPoints.includes(`- \`${refreshHelperPath}\``), 'github_entry.useful_entry_points');
  requireValue(bundleGuidance.includes(`\`${refreshHelperPath}\` after the lesson`), 'github_entry.bundle_guidance');

  const urlIndexGovernanceSource = markdownSection(
    input.urlIndexSource,
    "lines.push('## PR Governance');",
    "lines.push('## Roadmaps');"
  );
  const urlIndexGovernance = markdownSection(input.urlIndex, '## PR Governance', '## Roadmaps');
  requireValue(
    urlIndexGovernanceSource.includes(`platform('${refreshHelperPath}')`),
    'url_index.source_pr_governance'
  );
  requireValue(urlIndexGovernance.includes(`- ${refreshHelperUrl}`), 'url_index.generated_pr_governance');

  return failures;
}

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return result.stdout.trim();
}

function commit(cwd, message) {
  git(['add', '.'], cwd);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', message], cwd);
  return git(['rev-parse', 'HEAD'], cwd);
}

function initRemote(root, name) {
  const work = path.join(root, `${name}-work`);
  const bare = path.join(root, `${name}.git`);
  fs.mkdirSync(work, { recursive: true });
  git(['init', '-b', 'main'], work);
  git(['config', 'core.autocrlf', 'false'], work);
  git(['init', '--bare', bare], root);
  git(['remote', 'add', 'origin', bare], work);
  return { work, bare };
}

function setupFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bundle-index-refresh-test-'));
  const platform = initRemote(root, 'platform');
  const lesson = initRemote(root, 'lesson');

  fs.writeFileSync(path.join(platform.work, 'README.md'), '# platform\n');
  fs.mkdirSync(path.join(platform.work, 'reports'));
  for (const relativePath of INDEX_PATHS) {
    const absolutePath = path.join(platform.work, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, relativePath.endsWith('.json') ? '{}\n' : '# stale\n');
  }
  commit(platform.work, 'platform base');
  git(['checkout', '-b', 'codex/controller'], platform.work);
  fs.writeFileSync(path.join(platform.work, 'controller.txt'), 'payload\n');
  const platformPayload = commit(platform.work, 'platform payload');
  git(['push', '-u', 'origin', 'codex/controller'], platform.work);
  git(['push', '-u', 'origin', 'main'], platform.work);

  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'old route\n');
  commit(lesson.work, 'lesson base');
  git(['checkout', '-b', 'agent/lesson-payload'], lesson.work);
  fs.writeFileSync(path.join(lesson.work, 'AGENTS.md'), 'canonical route\n');
  const lessonPayload = commit(lesson.work, 'lesson payload');
  git(['checkout', 'main'], lesson.work);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'merge', '--no-ff', 'agent/lesson-payload', '-m', 'merge lesson payload'], lesson.work);
  const lessonMerge = git(['rev-parse', 'HEAD'], lesson.work);
  git(['push', '-u', 'origin', 'main'], lesson.work);

  return {
    root,
    platform,
    lesson,
    platformPayload,
    lessonPayload,
    lessonMerge,
  };
}

describe('trusted bundle agent-index refresh', () => {
  test('keeps the trusted refresh helper discoverable in every canonical navigation surface', () => {
    expect(validateRefreshHelperNavigation({
      researchMap: fs.readFileSync(path.join(trustedRoot, 'RESEARCH_AGENT_MAP.md'), 'utf8'),
      githubEntry: fs.readFileSync(path.join(trustedRoot, 'AGENT_GITHUB_ENTRY.md'), 'utf8'),
      urlIndexSource: fs.readFileSync(
        path.join(trustedRoot, 'build-scripts', 'sprints', 'emit-url-index.js'),
        'utf8'
      ),
      urlIndex: fs.readFileSync(path.join(trustedRoot, 'reports', 'url-index.md'), 'utf8'),
    })).toEqual([]);
  });

  test.each([
    ['entry_points.human', 'researchMap', 'Human-readable:', 'Machine-readable:', `- \`${refreshHelperPath}\``],
    ['entry_points.machine', 'researchMap', 'Machine-readable:', 'entry_points (full URLs):', `    "${refreshHelperPath}",`],
    ['entry_points.urls', 'researchMap', 'entry_points (full URLs):', 'Cross-repo entry point (4veco-lessen):', `- ${refreshHelperUrl}`],
    ['index_anchors.machine', 'researchMap', '## Index Anchors', 'index_anchors (full URLs):', `  "bundle_agent_index_refresh_runner": "${refreshHelperPath}",`],
    ['index_anchors.urls', 'researchMap', 'index_anchors (full URLs):', '## Path Registry', `- ${refreshHelperUrl}`],
    ['pr_governance_paths.machine', 'researchMap', '## Path Registry', 'pr_governance_paths (full URLs):', `    "${refreshHelperPath}",`],
    ['pr_governance_paths.urls', 'researchMap', 'pr_governance_paths (full URLs):', 'reference_paths (full URLs):', `- ${refreshHelperUrl}`],
    ['traversal.bundle', 'researchMap', '## Agent Traversal Protocol', '## Dependency Flow', `\`${refreshHelperPath}\``],
    ['task_routing.pr_governance', 'researchMap', '## Research Task Routing', '## Agent Rules', `    "${refreshHelperPath}",`],
    ['github_entry.bundle_question', 'githubEntry', '| How should a paired platform/lesson PR bundle', '| How should active governance wording', `\`${refreshHelperPath}\``],
    ['github_entry.useful_entry_points', 'githubEntry', 'Useful entry points:', 'Task-routing guidance:', `- \`${refreshHelperPath}\``],
    ['github_entry.bundle_guidance', 'githubEntry', '- Use the cross-repo bundle compatibility workflow', null, `\`${refreshHelperPath}\``],
    ['url_index.source_pr_governance', 'urlIndexSource', "lines.push('## PR Governance');", "lines.push('## Roadmaps');", `  lines.push(\`- \${platform('${refreshHelperPath}')}\`);`],
    ['url_index.generated_pr_governance', 'urlIndex', '## PR Governance', '## Roadmaps', `- ${refreshHelperUrl}`],
  ])('fails when %s is omitted from its exact section', (expected, field, start, end, needle) => {
    const input = {
      researchMap: fs.readFileSync(path.join(trustedRoot, 'RESEARCH_AGENT_MAP.md'), 'utf8'),
      githubEntry: fs.readFileSync(path.join(trustedRoot, 'AGENT_GITHUB_ENTRY.md'), 'utf8'),
      urlIndexSource: fs.readFileSync(
        path.join(trustedRoot, 'build-scripts', 'sprints', 'emit-url-index.js'),
        'utf8'
      ),
      urlIndex: fs.readFileSync(path.join(trustedRoot, 'reports', 'url-index.md'), 'utf8'),
    };
    input[field] = removeFromSection(input[field], start, end, needle);

    expect(validateRefreshHelperNavigation(input)).toContain(expected);
  });

  test('creates one canonical refresh commit for a distinct lesson merge commit and reuses it', () => {
    const fixture = setupFixture();
    try {
      expect(fixture.lessonMerge).not.toBe(fixture.lessonPayload);
      const first = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      });

      expect(first).toMatchObject({
        ok: true,
        status: 'created',
        previous_platform_head_sha: fixture.platformPayload,
        lesson_merge_commit_sha: fixture.lessonMerge,
        changed_paths: INDEX_PATHS,
        trusted_executor: 'platform-main',
      });
      expect(first.platform_integration_head_sha).not.toBe(fixture.platformPayload);
      expect(git(['--git-dir', fixture.platform.bare, 'rev-parse', 'refs/heads/codex/controller'], fixture.root))
        .toBe(first.platform_integration_head_sha);
      const lessonIndex = JSON.parse(git([
        '--git-dir', fixture.platform.bare,
        'show', `${first.platform_integration_head_sha}:reports/github-agent-index-lessen.json`,
      ], fixture.root));
      expect(lessonIndex.source_commit).toBe(fixture.lessonMerge);
      expect(lessonIndex.source_branch).toBe('origin/main');

      const second = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: first.platform_integration_head_sha,
        },
      });
      expect(second).toMatchObject({
        ok: true,
        status: 'reused',
        platform_integration_head_sha: first.platform_integration_head_sha,
        lesson_merge_commit_sha: fixture.lessonMerge,
      });
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('rejects a tampered index-only descendant instead of stacking another refresh', () => {
    const fixture = setupFixture();
    try {
      const first = refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      });
      const tamperWork = path.join(fixture.root, 'tamper-work');
      git(['clone', '--branch', 'codex/controller', fixture.platform.bare, tamperWork], fixture.root);
      fs.writeFileSync(path.join(tamperWork, INDEX_PATHS[0]), '{"tampered":true}\n');
      const tampered = commit(tamperWork, 'tamper generated indexes');
      git(['push', 'origin', 'codex/controller'], tamperWork);

      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: tampered,
        },
      })).toThrow(/stale or tampered|unexpected paths/);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('fails closed at clone/fetch and lineage boundaries', () => {
    const fixture = setupFixture();
    try {
      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: 'f'.repeat(40),
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/fetch|failed/);

      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: 'e'.repeat(40),
        lessonMergeSha: fixture.lessonMerge,
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/not an ancestor/);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);

  test('fails closed on generator errors, unexpected files, and nondeterminism', () => {
    for (const mode of ['error', 'unexpected', 'nondeterministic']) {
      const fixture = setupFixture();
      try {
        let generation = 0;
        const injectedGeneration = (input) => {
          if (mode === 'error') throw new Error('injected generation failure');
          runTrustedGeneration(input);
          generation += 1;
          if (mode === 'unexpected') {
            fs.writeFileSync(path.join(input.platformRoot, 'unexpected.txt'), 'unexpected\n');
          }
          if (mode === 'nondeterministic') {
            fs.appendFileSync(
              path.join(input.platformRoot, INDEX_PATHS[0]),
              `\n${generation}\n`
            );
          }
        };
        expect(() => refreshBundleAgentIndexes({
          trustedRoot,
          platformRemote: fixture.platform.bare,
          lessonRemote: fixture.lesson.bare,
          reviewedPlatformPayloadSha: fixture.platformPayload,
          lessonMergeSha: fixture.lessonMerge,
          runTrustedGeneration: injectedGeneration,
          platformPr: {
            headRefName: 'codex/controller',
            headRefOid: fixture.platformPayload,
          },
        })).toThrow(
          mode === 'error'
            ? /injected generation failure/
            : mode === 'unexpected'
              ? /unexpected paths/
              : /not deterministic/
        );
      } finally {
        fs.rmSync(fixture.root, { recursive: true, force: true });
      }
    }
  }, 60000);

  test('fails closed when push is rejected or the PR refetch observes another head', () => {
    for (const mode of ['push', 'refetch']) {
      const fixture = setupFixture();
      try {
        if (mode === 'push') {
          const hook = path.join(fixture.platform.bare, 'hooks', 'pre-receive');
          fs.writeFileSync(hook, '#!/bin/sh\nexit 1\n');
          fs.chmodSync(hook, 0o755);
        }
        expect(() => refreshBundleAgentIndexes({
          trustedRoot,
          platformRemote: fixture.platform.bare,
          lessonRemote: fixture.lesson.bare,
          reviewedPlatformPayloadSha: fixture.platformPayload,
          lessonMergeSha: fixture.lessonMerge,
          fetchPlatformPr: mode === 'refetch'
            ? () => ({ headRefOid: fixture.platformPayload })
            : undefined,
          platformPr: {
            headRefName: 'codex/controller',
            headRefOid: fixture.platformPayload,
          },
        })).toThrow(mode === 'push' ? /push.*failed/i : /push\/refetch head mismatch/);
      } finally {
        fs.rmSync(fixture.root, { recursive: true, force: true });
      }
    }
  }, 60000);

  test('commit failure leaves the controller branch at the reviewed payload', () => {
    const fixture = setupFixture();
    try {
      expect(() => refreshBundleAgentIndexes({
        trustedRoot,
        platformRemote: fixture.platform.bare,
        lessonRemote: fixture.lesson.bare,
        reviewedPlatformPayloadSha: fixture.platformPayload,
        lessonMergeSha: fixture.lessonMerge,
        commitGeneratedIndexes: () => {
          throw new Error('injected commit failure');
        },
        platformPr: {
          headRefName: 'codex/controller',
          headRefOid: fixture.platformPayload,
        },
      })).toThrow(/injected commit failure/);
      expect(git([
        '--git-dir', fixture.platform.bare,
        'rev-parse', 'refs/heads/codex/controller',
      ], fixture.root)).toBe(fixture.platformPayload);
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  }, 30000);
});
