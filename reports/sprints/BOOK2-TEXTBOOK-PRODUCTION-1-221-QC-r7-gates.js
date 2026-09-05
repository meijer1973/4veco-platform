'use strict';
// Distinct specialist-owned wrapper: preserve Windows path arguments, use actual git scope.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const folder = path.join(lessons, 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit');
const scope = require('../../build-scripts/workflows/check-paragraph-lane-scope');
for (const profile of ['student-web', 'publisher-print']) {
  process.stdout.write(execFileSync(process.execPath, ['scripts/validate-paragraph.js',
    '--mode', 'part-a', '--profile', profile, folder], { cwd:root, encoding:'utf8' }));
}
const results = {};
// The repository lane checker requires an implementation-owned change. Review-only
// deltas are checked exactly below; its normal lane gate uses the real correction
// bases (including the actual six-wording-change source), not synthetic paths.
for (const [name, cwd, base, lane] of [
  ['platform', root, '92862e370fd997634aa505c24b74c773c05039f4', 'shared'],
  ['lessons', lessons, 'abe73479d900c1c3dd4cccb9c568305eb58c7a18', 'textbook'],
]) {
  const git = args => execFileSync('git', ['-c','core.quotepath=false',...args], {cwd,encoding:'utf8'}).trim().split('\n').filter(Boolean);
  const ownBase = name==='platform' ? '298c9e359e27d63c8950c4fc7e93491173c2b0fd' : '73e552fb83bc3a79b9bec1f15bd3919af2a5ea0b';
  const ownPaths = [...new Set([...git(['diff','--name-only',ownBase]), ...git(['ls-files','--others','--exclude-standard'])])];
  for (const p of ownPaths) {
    const allowed = name==='platform'
      ? p.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7') || p.startsWith('reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-QC-r7-grayscale/') || ['reports/url-index.md','AGENT_GITHUB_ENTRY.md','RESEARCH_AGENT_MAP.md','RESEARCH_AGENT_MAP_REFERENCES.md','reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md'].includes(p)
      : false; // REVISE: no lesson writes permitted, including quality-ref.
    if (!allowed) throw new Error(`Outside independent review assignment: ${p}`);
  }
  const paths = [...new Set([...git(['diff','--name-only',base]), ...git(['ls-files','--others','--exclude-standard'])])];
  const result = scope.checkLaneScope({lane,changedPaths:paths});
  results[name] = {own_base:ownBase, own_review_delta:ownPaths, correction_base:base, ...result};
  process.stdout.write(scope.formatSummary(result)+'\n');
  if (!result.ok) throw new Error(`${name} lane scope failed`);
  execFileSync('git',['diff','--check'],{cwd,stdio:'inherit'});
}
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-scope.json'),
  JSON.stringify({method:'Exact review-only allowlist, then normal paired lane classifier on actual correction-base diff plus untracked files; no fixture or exception',...results},null,2)+'\n');
