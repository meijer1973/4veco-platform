const fs = require('fs');
const os = require('os');
const path = require('path');

function removeTempPath(file, dir) {
  try {
    fs.unlinkSync(file);
  } catch (_error) {
    // Best-effort cleanup for a temporary transport file.
  }
  try {
    fs.rmdirSync(dir);
  } catch (_error) {
    // Best-effort cleanup for the temporary transport directory.
  }
}

function runGhWithJsonInput(runGh, args, payload, options = {}) {
  if (typeof runGh !== 'function') {
    throw new Error('runGhWithJsonInput requires a gh runner');
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), '4veco-gh-api-'));
  const file = path.join(dir, 'payload.json');
  try {
    fs.writeFileSync(file, JSON.stringify(payload), 'utf8');
    return runGh([...args, '--input', file], options);
  } finally {
    removeTempPath(file, dir);
  }
}

module.exports = {
  runGhWithJsonInput,
};
