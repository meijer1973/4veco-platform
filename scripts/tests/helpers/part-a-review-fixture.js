'use strict';
const fs = require('fs');
const path = require('path');
const { identity, writeSnapshot } = require('../../lib/part-a-review-evidence');
// Test-only reviewer stand-in. Production snapshot generation never writes a verdict.
module.exports = function bindFixtureReview(folder) {
  const id = identity(folder).id;
  const file = path.join(folder, `${id}-review.md`);
  if (!fs.existsSync(file)) return;
  const digest = writeSnapshot(folder);
  const text = fs.readFileSync(file, 'utf8').replace(/^Review manifest SHA256:.*\n?/gm, '');
  fs.writeFileSync(file, `${text}\nReview manifest SHA256: \`${digest}\`\n`);
};
