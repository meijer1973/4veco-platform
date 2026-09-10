#!/usr/bin/env node
// HOW TO ADAPT: change reviewed relocation/deletion metadata, never broaden
// deletion patterns. This checker is read-only and may run from any directory.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { loadRelocations, gitBlob } = require('../lib/historical-paths');
const platform = path.resolve(__dirname, '../..');
const roots = { '4veco-platform': platform, '4veco-lessen': path.resolve(platform,'../4veco-lessen') };
function git(root, args) {
  const p = spawnSync('git', args, {cwd:root,encoding:'utf8'});
  if (p.status) throw new Error(p.stderr);
  return p.stdout.trim();
}
function checkRepository(repo, root) {
  const manifest = path.join(root,'archive/relocations.json');
  if (!fs.existsSync(manifest)) {
    if (repo === '4veco-platform' || process.argv.includes('--require-paired')) throw new Error(`Missing archive metadata: ${repo}`);
    return { repository:repo, skipped:'paired cleanup not present at supplied lesson ref' };
  }
  const entries = loadRelocations(root);
  let moves=0, snapshots=0;
  for (const entry of entries) {
    const final = path.join(root,entry.archived_path);
    if (!fs.existsSync(final)) throw new Error(`Missing archive: ${entry.archived_path}`);
    if (gitBlob(fs.readFileSync(final)) !== (entry.final_blob || entry.original_blob)) throw new Error(`Archive blob mismatch: ${entry.archived_path}`);
    if (git(root,['rev-parse',`${entry.source_commit}:${entry.original_path}`]) !== entry.original_blob) throw new Error(`Original blob mismatch: ${entry.original_path}`);
    if (entry.kind === 'snapshot') snapshots++;
    else { moves++; if (fs.existsSync(path.join(root,entry.original_path))) throw new Error(`Historical source recreated: ${entry.original_path}`); }
  }
  const removals = JSON.parse(fs.readFileSync(path.join(root,'archive/cleanup-deletions.json'),'utf8')).entries;
  for (const entry of removals) {
    if (fs.existsSync(path.join(root,entry.path))) throw new Error(`Deleted file recreated: ${entry.path}`);
    if (git(root,['rev-parse',`${entry.source_commit}:${entry.path}`]) !== entry.original_blob) throw new Error(`Deletion baseline mismatch: ${entry.path}`);
    if (entry.retained_copy && gitBlob(fs.readFileSync(path.join(roots[entry.retained_copy.repository],entry.retained_copy.path))) !== entry.original_blob) throw new Error(`Retained duplicate changed: ${entry.path}`);
  }
  const current = spawnSync('rg',['--files','.'],{cwd:root,encoding:'utf8'});
  if (current.status !== 0) throw new Error(`Cannot verify default search: ${current.stderr}`);
  if (current.stdout.split(/\r?\n/).some(p=>p.replace(/\\/g,'/').replace(/^\.\//,'').startsWith('archive/'))) throw new Error('Archive leaked into default search');
  return {repository:repo,moves,deletions:removals.length,snapshots,blobs:'preserved',default_search:'current only'};
}
try { console.log(JSON.stringify(Object.entries(roots).map(([r,p])=>checkRepository(r,p)),null,2)); }
catch(e) { console.error(e.message); process.exitCode=1; }
