#!/usr/bin/env node
'use strict';
// HOW TO ADAPT: this exports an existing PDF edition without rebuilding it or
// manufacturing current review evidence. New content uses validate-paragraph.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { committedFiles, blob } = require('./lib/committed-paragraph-files');
const { PARA_TYPES, classifyParagraph } = require('./lib/paragraph-types');

function reproduce({ lessons, sha, paragraph, output }) {
  const root = fs.realpathSync(execFileSync('git', ['-C', lessons, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim());
  const files = committedFiles(root, sha, paragraph);
  const kinds = PARA_TYPES[classifyParagraph(path.posix.basename(paragraph))].requiredPdf;
  const pdfs = kinds.map(kind => {
    const matches = files.filter(file => !file.relative.includes('/') && file.relative.replace(/–/g, '-').endsWith(` - ${kind}.pdf`));
    if (matches.length !== 1) throw new Error(`Edition must contain exactly one committed ${kind}.pdf; found ${matches.length}`);
    return matches[0];
  });
  const destination = path.resolve(fs.realpathSync(path.dirname(path.resolve(output))), path.basename(output));
  for (const protectedRoot of [root, fs.realpathSync(path.resolve(__dirname, '..'))]) {
    const relative = path.relative(protectedRoot, destination);
    if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) throw new Error('Edition output must be outside the lesson and platform repositories');
  }
  const payloads = pdfs.map(file => ({ file, bytes: blob(root, file) }));
  for (const { file, bytes } of payloads) {
    if (!bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) throw new Error(`Committed artifact is not a PDF: ${file.path}`);
  }
  fs.mkdirSync(destination); // Existing output is never overwritten.
  const artifacts = payloads.map(({ file, bytes }) => {
    fs.writeFileSync(path.join(destination, file.relative), bytes, { flag: 'wx' });
    return { source_path: file.path, git_blob: file.oid, output_file: file.relative,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
  });
  return { operation: 'reproduce-existing-edition', lesson_sha: sha, paragraph,
    result: 'EXPORTED_COMMITTED_PDFS', current_review: 'NOT_PERFORMED', artifacts,
    note: 'Exact committed PDF bytes only. No rebuild, current-content PASS, source approval or publication/integration authorization is created.' };
}
function main(argv) {
  const [lessons, sha, paragraph, output, ...extra] = argv;
  if (!output || extra.length) throw new Error('Usage: node scripts/reproduce-paragraph-edition.js <lesson-repo> <edition-sha> <paragraph-path> <new-output-directory>');
  console.log(JSON.stringify(reproduce({ lessons, sha, paragraph, output }), null, 2));
}
module.exports = { reproduce, main };
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
