const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BINARY_EXTENSIONS = new Set([
  'avif',
  'bmp',
  'docx',
  'exe',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'pdf',
  'png',
  'pptx',
  'webp',
  'woff',
  'woff2',
  'xlsx',
  'zip',
]);

function extension(pathRel) {
  return path.extname(pathRel).replace(/^\./, '').toLowerCase();
}

function shouldNormalizeLineEndings(pathRel, buffer) {
  if (BINARY_EXTENSIONS.has(extension(pathRel))) return false;
  return !buffer.includes(0);
}

function inventoryBytes(filePath, pathRel = filePath) {
  const buffer = fs.readFileSync(filePath);
  if (!shouldNormalizeLineEndings(pathRel, buffer)) return buffer;
  return Buffer.from(buffer.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function fileFingerprint(filePath, pathRel = filePath) {
  const buffer = inventoryBytes(filePath, pathRel);
  return {
    size_bytes: buffer.length,
    sha256: sha256(buffer),
  };
}

module.exports = {
  fileFingerprint,
  inventoryBytes,
};
