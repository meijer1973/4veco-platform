'use strict';

// A bounded owner-requested pedagogical amendment, separate from the immutable
// v3 placement/import decision. It changes no paragraph row or target approval.
const fs = require('fs');
const path = require('path');
const m = require('./migrate-books34-v3');
const REVISION = 'exercise-routes-20260921';
const CONTRACT = 'https://github.com/meijer1973/4veco-platform/blob/main/skills/econ-exercise-builder.md#21-the-routes-and-the-constraint';

function amendOutline(bytes) {
  let text = m.text(bytes);
  const replacements = [
    [/^One numbered paragraph is one complete \*\*55-minute core lesson\*\*[^\n]+$/m,
      'Future paragraphs are designed around the complete supported normal route within 55 minutes. Existing books retain their exercises and goals: report genuine timing conflicts and plan additional lesson time instead of claiming an unsupported fit. The Year 1 allocation remains **12 + 12 + 14 + 17 = 55**; this is a curriculum count, not a classroom timing certificate.'],
    [/^Keep the current printed sequence:[^\n]+$/m,
      `Use the [canonical Part A exercise contract](${CONTRACT}) for section roles, the normal and challenging routes, printed guidance and timing. Mixed paragraphs retain their existing consolidation structure without new theory; document the exception and use their actual support and sections. Preserve paper-first teaching, appropriate Dutch for 4 vwo, explicit units and capacity assumptions, source-supported conclusions and genuine visual support.`],
    [/^Estimate the selected questions[^\n]+$/m,
      'Estimate actual reading, drawing, calculation and explanation steps alongside instruction, example, transitions and feedback. Follow the canonical route contract when including support and bonus time. Keep detailed estimates teacher-facing and identify incomplete older estimates explicitly.'],
    [/^The other overloads identified in F08 remain open\.[^\n]+$/m,
      'The overloads identified in F08 remain open. The route amendment also exposes estimates that omitted guided practice. No split, merger, exercise deletion or goal deferral is authorised by this revision; preserve the targets and report the additional time or missing evidence.'],
  ];
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(text)) throw new Error('Missing route-amendment boundary');
    text = text.replace(pattern, replacement);
  }
  return Buffer.from(text);
}

function currentOutline(bytes, book, root = m.ROOT) {
  const original = fs.readFileSync(path.join(root, m.TRANSPORT, `outlines/book-${book}-outline-v3.md`));
  const rows = m.parseOutline(original, book); // retains the exact receipt pin
  const projected = Buffer.from(String(original).replaceAll('](../curriculum/targets/',
    `](https://github.com/meijer1973/4veco-platform/blob/main/${m.TRANSPORT}/curriculum/targets/`));
  const amended = amendOutline(projected);
  if (m.text(bytes) !== String(amended)) throw new Error(`Book ${book}: unexpected current route amendment`);
  const meta = JSON.parse(fs.readFileSync(path.join(root, m.OUTLINES, `book-${book}-outline.meta.json`)));
  if (meta.pedagogical_amendment?.revision !== REVISION || meta.pedagogical_amendment?.contract !== CONTRACT
    || meta.current_sha256 !== m.sha(amended)) throw new Error(`Book ${book}: stale route-amendment metadata`);
  return rows;
}

function apply(root = m.ROOT, lessons = path.resolve(root, '../4veco-lessen')) {
  for (const book of [3, 4]) {
    const source = fs.readFileSync(path.join(root, m.TRANSPORT, `outlines/book-${book}-outline-v3.md`));
    m.parseOutline(source, book);
    const projected = Buffer.from(String(source).replaceAll('](../curriculum/targets/',
      `](https://github.com/meijer1973/4veco-platform/blob/main/${m.TRANSPORT}/curriculum/targets/`));
    const amended = amendOutline(projected);
    fs.writeFileSync(path.join(root, m.OUTLINES, `book-${book}-outline.md`), amended);
    const metaPath = path.join(root, m.OUTLINES, `book-${book}-outline.meta.json`);
    const meta = JSON.parse(fs.readFileSync(metaPath));
    meta.current_sha256 = m.sha(amended);
    meta.pedagogical_amendment = {revision: REVISION, contract: CONTRACT, owner_request: '2026-09-21: guided practice normal; bonus challenging; preserve exercises and report timing conflicts'};
    meta.technical_projection = 'Original v3 receipt and structural rows preserved. Target links resolve to the immutable transport; the separately validated route amendment governs current pedagogical guidance.';
    fs.writeFileSync(metaPath, m.json(meta));
    fs.writeFileSync(path.join(lessons, m.PACKAGE, `outlines/book-${book}-outline-v3.md`), amendOutline(source));
  }
}

if (require.main === module) apply();
module.exports = {REVISION, CONTRACT, amendOutline, currentOutline, apply};
