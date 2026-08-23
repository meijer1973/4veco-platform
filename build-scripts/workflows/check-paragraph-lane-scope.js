#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VALID_LANES = new Set(['textbook', 'companion', 'shared']);
const CATEGORY_LABELS = {
  partA_textbook: 'Part A textbook',
  partB_companion: 'Part B companion',
  shared_platform: 'shared platform',
  generated_indexes: 'generated index/report',
  review_evidence: 'review evidence',
  unknown: 'unknown',
};

const SHARED_PLATFORM_PREFIXES = [
  '.github/',
  'agents/',
  'archive/',
  'build-scripts/',
  'docs/',
  'engines/',
  'knowledge/',
  'references/',
  'scripts/',
  'skills/',
  'source-data/',
  'tools/',
];

const SHARED_PLATFORM_ROOT_FILES = new Set([
  '.gitattributes',
  '.gitignore',
  'agents.md',
  'agent_github_entry.md',
  'batch-closure-waiver.md',
  'build-chapter.md',
  'build-paragraph.md',
  'license',
  'package-lock.json',
  'package.json',
  'research_agent_map.md',
  'research_agent_map_references.md',
  'research_agent_prompt.md',
  'research_agent_prompt_references.md',
]);

const GENERATED_INDEX_FILES = new Set([
  'agent_github_entry.md',
  'research_agent_map.md',
  'research_agent_map_references.md',
  'reports/url-index.md',
]);

const COMPANION_SUFFIXES = [
  'instapquiz.html',
  'nieuws-detective.html',
  'uitleg voorkennis.html',
  'uitleg voorkennis.docx',
  'presentatie.pptx',
  'presentatie.html',
  'uitleg vaardigheden.html',
  'uitleg vaardigheden.docx',
  'nieuws met visual.html',
  'nieuws met visual.docx',
  'samenvatting.html',
  'samenvatting.docx',
  'youtube-videos.html',
  'stappenplan.html',
  'korte-check.html',
  'exit-ticket.html',
  'redeneer-spel.html',
  'wiskundevaardigheden.html',
  'begeleide inoefening.html',
  'begeleide inoefening - vragen.docx',
  'begeleide inoefening - antwoorden.docx',
  'basis - vragen.docx',
  'basis - antwoorden.docx',
  'midden - vragen.docx',
  'midden - antwoorden.docx',
  'verrijking - vragen.docx',
  'verrijking - antwoorden.docx',
];

function normalizePath(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+/g, '/');
}

function normalizedLower(value) {
  return normalizePath(value).toLowerCase();
}

function basenameLower(value) {
  return path.posix.basename(normalizedLower(value));
}

function matchesDashSuffix(filePath, suffix) {
  const base = basenameLower(filePath).replace(/\u2013/g, '-');
  return base.endsWith(` - ${suffix}`);
}

function isGeneratedIndexPath(filePath) {
  const p = normalizedLower(filePath);
  return GENERATED_INDEX_FILES.has(p)
    || /^reports\/github-agent-index-[^/]+\.(md|json)$/.test(p)
    || /^reports\/github-agent-index\.(md|json)$/.test(p);
}

function isReviewEvidencePath(filePath) {
  const p = normalizedLower(filePath);
  if (
    (p.startsWith('reports/review-gates/') && /\.(md|json|txt)$/.test(p))
    || p.startsWith('reports/sprints/')
    || p.startsWith('archive/sprints/')
  ) return true;
  if (/\/evidence\/.+\.(md|json|txt)$/i.test(p)) return true;
  if (/(^|\/)\d+\.\d+\.\d+-quality-ref\.ya?ml$/.test(p)) return true;
  return false;
}

function isSharedPlatformPath(filePath) {
  const p = normalizedLower(filePath);
  if (SHARED_PLATFORM_ROOT_FILES.has(p)) return true;
  return SHARED_PLATFORM_PREFIXES.some((prefix) => p.startsWith(prefix));
}

function isPartBCompanionPath(filePath) {
  const p = normalizedLower(filePath);
  const base = basenameLower(filePath);
  if (base === '_paragraph-plan.md') return true;
  if (base === 'index.html') return true;
  if (/(^|\/)shared\/(questions|reasoning|newsdetective|procedure|skilltree)\/.+\.(js|json|csv)$/.test(p)) return true;
  if (/(^|\/)_assets\/.+_(slide|doc|summary|web_light|web_dark)\.(svg|png|jpg|jpeg|webp)$/.test(p)) return true;
  if (/(^|\/)\d+\.\d+\.\d+-companion-visual-review\.md$/.test(p)) return true;
  return COMPANION_SUFFIXES.some((suffix) => matchesDashSuffix(filePath, suffix));
}

function isPartATextbookPath(filePath) {
  const p = normalizedLower(filePath);
  const base = basenameLower(filePath).replace(/\u2013/g, '-');
  if (base === 'build_pdf.py') return true;
  if (/(^|\/)\d+\.\d+\.\d+-review\.md$/.test(p)) return true;
  if (/(^|\/)\d+\.\d+\.\d+-textbook-handoff\.md$/.test(p)) return true;
  if (/(^|\/)\d+\.\d+\.\d+-target-contract\.md$/.test(p)) return true;
  if (/(^|\/)_assets\/.+_(fig|we|ex)_.+\.(svg|png|jpg|jpeg|webp)$/.test(p)) return true;
  return /\s-\s(paragraaf|opgaven|antwoorden|samenvatting|toets|toetsmatrijs)\.(md|html|pdf)$/.test(base);
}

function classifyPath(filePath) {
  const normalized = normalizePath(filePath);
  if (!normalized) return { path: normalized, category: 'unknown' };
  if (isGeneratedIndexPath(normalized)) return { path: normalized, category: 'generated_indexes' };
  if (isReviewEvidencePath(normalized)) return { path: normalized, category: 'review_evidence' };
  if (isSharedPlatformPath(normalized)) return { path: normalized, category: 'shared_platform' };
  if (isPartBCompanionPath(normalized)) return { path: normalized, category: 'partB_companion' };
  if (isPartATextbookPath(normalized)) return { path: normalized, category: 'partA_textbook' };
  return { path: normalized, category: 'unknown' };
}

function classifyChangedPaths(paths) {
  const buckets = {
    partA_textbook: [],
    partB_companion: [],
    shared_platform: [],
    generated_indexes: [],
    review_evidence: [],
    unknown: [],
  };
  for (const changedPath of paths || []) {
    const item = classifyPath(changedPath);
    buckets[item.category].push(item.path);
  }
  return buckets;
}

function validateLaneScopeException(exceptionRecord) {
  const failures = [];
  if (!exceptionRecord) return { ok: false, failures: ['lane-scope exception is missing'] };
  const record = exceptionRecord.lane_scope_exception || exceptionRecord;
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return { ok: false, failures: ['lane-scope exception must be an object'] };
  }
  if (record.allowed !== true) failures.push('lane_scope_exception.allowed must be true');
  if (typeof record.reason !== 'string' || record.reason.trim().length < 12) {
    failures.push('lane_scope_exception.reason must explain the boundary crossing');
  }
  if (typeof record.review_required !== 'string' || record.review_required.trim().length < 5) {
    failures.push('lane_scope_exception.review_required is required');
  }
  if (record.human_visibility !== true) failures.push('lane_scope_exception.human_visibility must be true');
  return { ok: failures.length === 0, failures };
}

function hasOnlyTail(categories, hasLaneOwnedQualityRefChange = false) {
  if (hasLaneOwnedQualityRefChange) return false;
  return categories.partA_textbook.length === 0
    && categories.partB_companion.length === 0
    && categories.shared_platform.length === 0
    && categories.unknown.length === 0
    && (categories.generated_indexes.length > 0 || categories.review_evidence.length > 0);
}

function extractTopLevelBlock(text, name) {
  const lines = String(text || '').split(/\r?\n/);
  const startRe = new RegExp(`^${name}:\\s*$`);
  const topKeyRe = /^[A-Za-z_][A-Za-z0-9_]*:\s*.*$/;
  const startIdx = lines.findIndex((line) => startRe.test(line));
  if (startIdx < 0) return '';
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i += 1) {
    if (topKeyRe.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return lines.slice(startIdx + 1, endIdx).join('\n').trim();
}

function stripTopLevelBlock(text, name) {
  const lines = String(text || '').split(/\r?\n/);
  const startRe = new RegExp(`^${name}:\\s*$`);
  const topKeyRe = /^[A-Za-z_][A-Za-z0-9_]*:\s*.*$/;
  const startIdx = lines.findIndex((line) => startRe.test(line));
  if (startIdx < 0) return lines;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i += 1) {
    if (topKeyRe.test(lines[i])) {
      endIdx = i;
      break;
    }
  }
  return [...lines.slice(0, startIdx), ...lines.slice(endIdx)];
}

function legacyPartAContent(text) {
  return stripTopLevelBlock(String(text || ''), 'companion').join('\n').trim();
}

function changedQualityRefBlocks(beforeText, afterText) {
  const before = beforeText || '';
  const after = afterText || '';
  const beforePartA = extractTopLevelBlock(before, 'partA') || legacyPartAContent(before);
  const afterPartA = extractTopLevelBlock(after, 'partA') || legacyPartAContent(after);
  const beforeCompanion = extractTopLevelBlock(before, 'companion');
  const afterCompanion = extractTopLevelBlock(after, 'companion');
  const blocks = [];
  if (beforePartA !== afterPartA) blocks.push('partA');
  if (beforeCompanion !== afterCompanion) blocks.push('companion');
  return blocks;
}

function qualityRefOwnershipSummary(qualityRefChanges = []) {
  const summary = {
    partA: false,
    companion: false,
    paths: [],
  };
  for (const change of qualityRefChanges || []) {
    const blocks = new Set(change.blocks || []);
    if (blocks.has('partA')) summary.partA = true;
    if (blocks.has('companion')) summary.companion = true;
    if (change.path) summary.paths.push(change.path);
  }
  return summary;
}

function checkLaneScope({ lane, changedPaths, exception = null, qualityRefChanges = [] }) {
  if (!VALID_LANES.has(lane)) {
    throw new Error(`invalid lane: ${lane}`);
  }

  const categories = classifyChangedPaths(changedPaths);
  const failures = [];
  const warnings = [];
  const qualityRefOwnership = qualityRefOwnershipSummary(qualityRefChanges);
  const laneOwnedQualityRef = (lane === 'textbook' && qualityRefOwnership.partA)
    || (lane === 'companion' && qualityRefOwnership.companion);
  const exceptionSummary = exception ? validateLaneScopeException(exception) : { ok: false, failures: [] };
  const hasException = Boolean(exception) && exceptionSummary.ok;
  const hasChangedPaths = Object.values(categories).some((items) => items.length > 0);

  if (!hasChangedPaths) {
    failures.push('no changed paths to classify');
  }
  if (exception && !exceptionSummary.ok) {
    failures.push(...exceptionSummary.failures);
  }
  if (categories.unknown.length > 0) {
    failures.push(`unknown paths require explicit classification: ${categories.unknown.join(', ')}`);
  }

  if (lane === 'textbook') {
    if (categories.shared_platform.length > 0) {
      failures.push(`textbook lane may not change shared platform files: ${categories.shared_platform.join(', ')}`);
    }
    if (categories.partB_companion.length > 0 && !hasException) {
      failures.push(`textbook lane may not change companion files: ${categories.partB_companion.join(', ')}`);
    }
    if (qualityRefOwnership.companion && !hasException) {
      failures.push(`textbook lane may not change quality-ref companion block: ${qualityRefOwnership.paths.join(', ')}`);
    }
    if (categories.partA_textbook.length === 0 && !qualityRefOwnership.partA) {
      failures.push('textbook lane needs at least one Part A textbook change');
    }
  } else if (lane === 'companion') {
    if (categories.shared_platform.length > 0) {
      failures.push(`companion lane may not change shared platform files: ${categories.shared_platform.join(', ')}`);
    }
    if (categories.partA_textbook.length > 0 && !hasException) {
      failures.push(`companion lane may not change Part A textbook files: ${categories.partA_textbook.join(', ')}`);
    }
    if (qualityRefOwnership.partA && !hasException) {
      failures.push(`companion lane may not change quality-ref partA block: ${qualityRefOwnership.paths.join(', ')}`);
    }
    if (categories.partB_companion.length === 0 && !qualityRefOwnership.companion) {
      failures.push('companion lane needs at least one Part B companion change');
    }
  } else if (lane === 'shared') {
    if (categories.partA_textbook.length > 0) {
      failures.push(`shared lane may not change Part A textbook files: ${categories.partA_textbook.join(', ')}`);
    }
    if (categories.partB_companion.length > 0) {
      failures.push(`shared lane may not change Part B companion files: ${categories.partB_companion.join(', ')}`);
    }
    if ((qualityRefOwnership.partA || qualityRefOwnership.companion) && !hasException) {
      failures.push(`shared lane may not change lesson quality-ref blocks: ${qualityRefOwnership.paths.join(', ')}`);
    }
    if (categories.shared_platform.length === 0) {
      failures.push('shared lane needs at least one shared platform change');
    }
  }

  if (hasOnlyTail(categories, laneOwnedQualityRef)) {
    failures.push('generated index/report or review-evidence changes are allowed only with lane-owned changes');
  }
  if (hasException) {
    warnings.push('lane-scope exception accepted; human review must verify the boundary crossing');
  }

  return {
    ok: failures.length === 0,
    lane,
    categories,
    qualityRefChanges,
    failures,
    warnings,
    exception: exception ? {
      present: true,
      ok: exceptionSummary.ok,
      failures: exceptionSummary.failures,
    } : {
      present: false,
      ok: false,
      failures: [],
    },
  };
}

function parseArgs(argv) {
  const options = {
    lane: null,
    base: 'origin/main',
    head: 'HEAD',
    cwd: null,
    fixture: null,
    exceptionFile: null,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--lane') {
      options.lane = argv[++i];
    } else if (arg.startsWith('--lane=')) {
      options.lane = arg.slice('--lane='.length);
    } else if (arg === '--base') {
      options.base = argv[++i];
    } else if (arg.startsWith('--base=')) {
      options.base = arg.slice('--base='.length);
    } else if (arg === '--head') {
      options.head = argv[++i];
    } else if (arg.startsWith('--head=')) {
      options.head = arg.slice('--head='.length);
    } else if (arg === '--cwd') {
      options.cwd = argv[++i];
    } else if (arg.startsWith('--cwd=')) {
      options.cwd = arg.slice('--cwd='.length);
    } else if (arg === '--fixture') {
      options.fixture = argv[++i];
    } else if (arg.startsWith('--fixture=')) {
      options.fixture = arg.slice('--fixture='.length);
    } else if (arg === '--exception-file') {
      options.exceptionFile = argv[++i];
    } else if (arg.startsWith('--exception-file=')) {
      options.exceptionFile = arg.slice('--exception-file='.length);
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  if (!options.help) {
    if (!options.lane) throw new Error('missing required --lane textbook|companion|shared');
    if (!VALID_LANES.has(options.lane)) throw new Error(`invalid --lane: ${options.lane}`);
    if (!options.fixture && (!options.base || !options.head)) {
      throw new Error('missing --base or --head');
    }
  }
  return options;
}

function usage() {
  return [
    'Usage:',
    '  node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook|companion|shared --base origin/main --head HEAD',
    '  node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD',
    '  node build-scripts/workflows/check-paragraph-lane-scope.js --lane companion --fixture fixture.json',
    '',
    'Fixture shape:',
    '  { "changed_paths": ["..."], "lane_scope_exception": { "allowed": true, "reason": "...", "review_required": "...", "human_visibility": true } }',
  ].join('\n');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'));
}

function changedPathsFromGit(base, head, cwd = process.cwd()) {
  const result = spawnSync('git', ['diff', '--name-only', '--diff-filter=ACMRTD', `${base}...${head}`], {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git diff failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function readGitFileAt(revision, filePath, cwd = process.cwd()) {
  const result = spawnSync('git', ['show', `${revision}:${filePath}`], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
  });
  if (result.status !== 0) return null;
  return result.stdout;
}

function qualityRefChangesFromGit(base, head, cwd = process.cwd(), changedPaths = null) {
  const paths = (changedPaths || changedPathsFromGit(base, head, cwd))
    .filter((changedPath) => /(^|\/)\d+\.\d+\.\d+-quality-ref\.ya?ml$/i.test(normalizePath(changedPath)));
  const changes = [];
  for (const changedPath of paths) {
    const beforeText = readGitFileAt(base, changedPath, cwd);
    const afterText = readGitFileAt(head, changedPath, cwd);
    const blocks = changedQualityRefBlocks(beforeText, afterText);
    if (blocks.length > 0) {
      changes.push({ path: normalizePath(changedPath), blocks });
    }
  }
  return changes;
}

function formatSummary(summary) {
  const lines = [];
  lines.push(`Paragraph lane scope: ${summary.ok ? 'PASS' : 'FAIL'} (${summary.lane})`);
  for (const [category, label] of Object.entries(CATEGORY_LABELS)) {
    const items = summary.categories[category] || [];
    if (items.length === 0) continue;
    lines.push(`- ${label}: ${items.length}`);
    for (const item of items) lines.push(`  - ${item}`);
  }
  for (const warning of summary.warnings) lines.push(`WARN: ${warning}`);
  for (const failure of summary.failures) lines.push(`FAIL: ${failure}`);
  return lines.join('\n');
}

function runCli(argv = process.argv.slice(2), cwd = process.cwd()) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(error.message);
    console.error(usage());
    return 2;
  }

  if (options.help) {
    console.log(usage());
    return 0;
  }

  try {
    let changedPaths;
    let qualityRefChanges = [];
    let exception = null;
    if (options.fixture) {
      const fixture = readJson(options.fixture);
      changedPaths = fixture.changed_paths || fixture.paths || [];
      qualityRefChanges = fixture.quality_ref_changes || [];
      exception = fixture.lane_scope_exception
        ? { lane_scope_exception: fixture.lane_scope_exception }
        : null;
    } else {
      const targetCwd = options.cwd ? path.resolve(cwd, options.cwd) : cwd;
      changedPaths = changedPathsFromGit(options.base, options.head, targetCwd);
      qualityRefChanges = qualityRefChangesFromGit(options.base, options.head, targetCwd, changedPaths);
    }
    if (options.exceptionFile) {
      exception = readJson(options.exceptionFile);
    }
    const summary = checkLaneScope({
      lane: options.lane,
      changedPaths,
      exception,
      qualityRefChanges,
    });
    if (options.json) console.log(JSON.stringify(summary, null, 2));
    else console.log(formatSummary(summary));
    return summary.ok ? 0 : 1;
  } catch (error) {
    console.error(`Paragraph lane scope check failed: ${error.message}`);
    return 2;
  }
}

if (require.main === module) {
  process.exit(runCli());
}

module.exports = {
  CATEGORY_LABELS,
  normalizePath,
  classifyPath,
  classifyChangedPaths,
  validateLaneScopeException,
  changedQualityRefBlocks,
  checkLaneScope,
  parseArgs,
  changedPathsFromGit,
  qualityRefChangesFromGit,
  formatSummary,
  runCli,
};
