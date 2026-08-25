'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

test('book builder Python regression suite passes', () => {
  const testFile = path.join(__dirname, 'test_lib_book.py');
  const result = spawnSync('python', [testFile], {
    cwd: __dirname,
    encoding: 'utf8',
  });

  expect(result.status).toBe(0);
  expect(result.stderr).toMatch(/Ran 7 tests/);
  expect(result.stderr).toMatch(/OK/);
});
