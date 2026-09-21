'use strict';
// Bounded inventory adapter for the imported editions' shared chapter folders.
// This never changes the native paragraph validator or confers target approval.
const fs = require('fs'), path = require('path');
const r = require('./exercise-route-revision');
const {verdict} = require('../../scripts/lib/part-a-review-evidence');
const OUTPUT = 'reports/review-gates/exercise-routes-20260921';

function snapshots(manifest, manifestHash) {
  const paragraphSources = manifest.files.filter(row =>
    /\/bronnen\/H[123]\/manuscript\/2\.[123]\.[1234] .+\.md$/.test(row.path)
    || /\/chapters\/[34]\.[123]\/[34]\.[123]\.\d manuscript\.md$/.test(row.path));
  if (paragraphSources.length !== 43) throw new Error('Expected all43 paragraph sources');
  return paragraphSources.map(source => {
    const id = path.posix.basename(source.path).match(/^\d\.\d\.\d/)[0];
    const book = id[0], chapter = id.slice(0, 3);
    const chapterPrefix = book === '2' ? `${r.ROOTS[0]}/bronnen/H${id[2]}/` : `${r.ROOTS[1]}/books/book-${book}/chapters/${chapter}/`;
    const files = manifest.files.filter(row => row.path.startsWith(chapterPrefix)
      || (book === '2' ? row.path.startsWith(r.ROOTS[0]+'/') && !row.path.startsWith(r.ROOTS[0]+'/bronnen/')
        : row.path.startsWith(`${r.ROOTS[1]}/books/book-${book}/book-matter/`)
          || row.path.startsWith(`${r.ROOTS[1]}/books/book-${book}/output/`)
          || row.path.startsWith(`${r.ROOTS[1]}/curriculum/`)
          || row.path.startsWith(`${r.ROOTS[1]}/outlines/`)
          || [`${r.ROOTS[1]}/README.md`, `${r.ROOTS[1]}/SOURCE_OWNERSHIP.md`, `${r.ROOTS[1]}/ROUTE-REVISION-2026-09-21.md`].includes(row.path)));
    const snapshot = {schema_version: 'edition-paragraph-review-v1', paragraph: id, revision: r.REVISION,
      scope: 'Bounded route revision only; not native paragraph-records.js closure or new target approval',
      baseline_lesson_commit: r.BASE, edition_manifest_sha256: manifestHash,
      hash_contract: 'Lesson edition files: exact bytes; platform inputs: UTF-8 with LF',
      platform_inputs: manifest.platform_inputs, files};
    return {id, snapshot, digest: r.sha(JSON.stringify(snapshot))};
  }).sort((a, b) => a.id.localeCompare(b.id));
}

function run({check = false, root = r.ROOT, lessons = path.resolve(root, '../4veco-lessen')} = {}) {
  const verified = r.verify({root, lessons});
  if (!verified.passed || verified.state !== 'exercise-route-revision') throw new Error(JSON.stringify(verified));
  const bytes = fs.readFileSync(path.join(lessons, r.MANIFEST));
  const rows = snapshots(JSON.parse(bytes), r.sha(bytes));
  const folder = path.join(root, OUTPUT);
  if (!check) fs.mkdirSync(folder, {recursive: true});
  for (const {id, snapshot, digest} of rows) {
    const file = path.join(folder, id+'-textbook-review-manifest.json');
    if (!check) fs.writeFileSync(file, JSON.stringify(snapshot, null, 2)+'\n');
    else {
      if (JSON.stringify(JSON.parse(fs.readFileSync(file))) !== JSON.stringify(snapshot)) throw new Error('Stale paragraph revision snapshot '+id);
      const review = fs.readFileSync(path.join(folder, id+'-review.md'), 'utf8');
      if (!['PASS', 'PASS WITH FLAGS'].includes(verdict(review))) throw new Error('No passing scoped verdict '+id);
      const bindings = [...review.matchAll(/^Review manifest SHA256: `([a-f0-9]{64})`\s*$/gm)];
      if (bindings.length !== 1 || bindings[0][1] !== digest) throw new Error('Stale independent review binding '+id);
      if (!review.includes('bounded route revision') || !review.includes('not a native paragraph-records.js closure')) throw new Error('Missing review scope boundary '+id);
    }
  }
  const index = rows.map(({id, digest}) => ({paragraph: id, digest}));
  if (!check) fs.writeFileSync(path.join(folder, 'review-manifest-index.json'), JSON.stringify(index, null, 2)+'\n');
  return {paragraphs: rows.length, mode: check ? 'verify independent bindings' : 'snapshot only; independent review required', index};
}
if (require.main === module) {
  try {const result = run({check: process.argv.includes('--check')}); console.log(JSON.stringify({...result, index: undefined}, null, 2));}
  catch (error) {console.error(error.message); process.exitCode = 1;}
}
module.exports = {OUTPUT, snapshots, run};
