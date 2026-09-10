'use strict';
// HOW TO ADAPT: read immutable Git blobs, never checkout filters or local-only
// files. Shared by exact-pair validation and historical PDF reproduction.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function git(root, args, options = {}) {
  return execFileSync('git', ['-C', root, ...args], { maxBuffer: 64 * 1024 * 1024, ...options });
}
function paragraphPath(relative) {
  if (!relative || path.isAbsolute(relative) || /[\\:\x00-\x1f]/.test(relative) || relative.split('/').some(piece => ['', '.', '..'].includes(piece))) {
    throw new Error('Use a repository-relative paragraph path with forward slashes');
  }
  if (!/^\d+\.\d+\.\d+\s+.+/.test(path.posix.basename(relative))) throw new Error('Expected paragraph folder X.Y.Z Name');
  return relative;
}
function committedFiles(root, sha, relative) {
  paragraphPath(relative);
  if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('Require a full lowercase 40-character edition commit SHA');
  git(root, ['cat-file', '-e', `${sha}^{commit}`]);
  const tree = git(root, ['ls-tree', '-rz', '--full-tree', sha], { encoding: 'utf8' });
  const files = tree.split('\0').filter(Boolean).map(line => {
    const match = line.match(/^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/);
    if (!match) throw new Error('Invalid Git tree entry');
    return { mode: match[1], type: match[2], oid: match[3], path: match[4] };
  }).filter(file => file.path === relative || file.path.startsWith(`${relative}/`));
  if (!files.length) throw new Error(`Paragraph is absent from commit ${sha}: ${relative}`);
  for (const file of files) {
    if (file.type !== 'blob' || !['100644', '100755'].includes(file.mode)) throw new Error(`Unsupported committed input (symlink/submodule): ${file.path}`);
    const local = file.path.slice(relative.length + 1);
    if (!local || /[\\:\x00-\x1f]/.test(local) || local.split('/').some(piece => ['', '.', '..'].includes(piece))) throw new Error(`Unsafe committed paragraph path: ${file.path}`);
    file.relative = local;
  }
  return files;
}
function blob(root, file) { return git(root, ['cat-file', 'blob', file.oid]); }
function materialize(root, files, destination) {
  // Callers supply a newly created, private directory. No caller-selected
  // checkout hooks, filters or lesson build scripts are executed.
  for (const file of files) {
    const target = path.join(destination, file.relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, blob(root, file), { flag: 'wx' });
  }
}
module.exports = { paragraphPath, committedFiles, blob, materialize };
