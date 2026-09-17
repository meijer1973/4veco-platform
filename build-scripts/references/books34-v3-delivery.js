'use strict';
// One immutable receipt, two explicitly named storage locations. This module
// grants no curriculum authority and never accepts an unknown edition directory.
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const m = require('./migrate-books34-v3');
const {gitBlob} = require('../lib/historical-paths');

function safeFile(root, name) {
  if (typeof name !== 'string' || !name || name.includes('\\') || name.includes(':')
    || name.split('/').some(p => !p || p === '.' || p === '..') || path.isAbsolute(name)) {
    throw new Error('Unsafe source path ' + name);
  }
  const file = path.resolve(root, name);
  const real = fs.realpathSync(file), base = fs.realpathSync(root);
  if (!real.startsWith(base + path.sep) || !fs.statSync(real).isFile()) throw new Error('Escaping/non-file source ' + name);
  return file;
}

function fileInventory(root) {
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Symlink package root');
  const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlink in received package: ' + file);
    if (entry.isDirectory()) return walk(file);
    if (!entry.isFile()) throw new Error('Non-file in received package: ' + file);
    return [path.relative(root, file).replaceAll('\\', '/')];
  });
  return walk(root);
}

function manifestAt(root) {
  const bytes = fs.readFileSync(safeFile(root, 'MANIFEST.sha256.json'));
  if (m.sha(bytes) !== m.MANIFEST_SHA) throw new Error('Unexpected package manifest');
  const manifest = JSON.parse(bytes);
  const allowed = new Set(['MANIFEST.sha256.json', ...manifest.files.map(f => f.path)]);
  if (manifest.files.length !== 813 || allowed.size !== 814) throw new Error('Wrong package file count');
  return {manifest, allowed};
}

function verifyDelivery(repository, prefix, {requireTracked = false} = {}) {
  const root = path.join(repository, prefix), failures = [];
  const {manifest, allowed} = manifestAt(root);
  for (const item of manifest.files) {
    try {
      const bytes = fs.readFileSync(safeFile(root, item.path));
      if (bytes.length !== item.bytes || m.sha(bytes) !== item.sha256) failures.push('Changed delivery ' + prefix + '/' + item.path);
    } catch (error) { failures.push(error.message); }
  }
  try {
    const files = fileInventory(root);
    if (files.length !== 814 || files.some(file => !allowed.has(file))) failures.push('Unexpected package file inventory: ' + prefix);
  } catch (error) { failures.push(error.message); }
  if (requireTracked) {
    const rows = execFileSync('git', ['ls-files', '--stage', '-z', '--', prefix], {cwd: repository, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
    const entries = rows.split('\0').filter(Boolean).map(row => {
      const [info, file] = row.split('\t'), [mode, blob, stage] = info.split(' ');
      return {mode, blob, stage, file};
    });
    if (entries.length !== 814 || entries.some(e => !allowed.has(e.file.slice(prefix.length + 1)))) failures.push('Package not fully tracked: ' + prefix);
    for (const entry of entries) {
      if (entry.mode !== '100644' || entry.stage !== '0' || entry.blob !== gitBlob(fs.readFileSync(path.join(repository, entry.file)))) {
        failures.push('Staged bytes or mode differ ' + entry.file);
      }
    }
  }
  return {failures, allowed, manifest};
}

module.exports = {safeFile, fileInventory, manifestAt, verifyDelivery};
