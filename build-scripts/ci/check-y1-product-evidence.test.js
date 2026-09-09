const crypto = require('crypto');
const { verifyBindings } = require('./check-y1-product-evidence');
const content = Buffer.from('sealed historical evidence\n');
const binding = { path: 'capture.json', sha256: crypto.createHash('sha256').update(content).digest('hex') };
const record = { successor_sources: [{ ...binding, path: 'verifier.js' }], retained_historical_artifacts: [binding] };
test('current product validation verifies every bound source and historical artifact', () => {
  const seen = [];
  verifyBindings(record, file => { seen.push(file); return content; });
  expect(seen).toEqual(['verifier.js', 'capture.json']);
});
test.each(['verifier.js', 'capture.json'])('changed %s remains rejected', changed => {
  expect(() => verifyBindings(record, file => file === changed ? Buffer.from('changed') : content)).toThrow(/Bound Y1 source or historical artifact changed/);
});
test('missing evidence remains a failure', () => {
  expect(() => verifyBindings(record, () => { throw new Error('missing'); })).toThrow('missing');
});
