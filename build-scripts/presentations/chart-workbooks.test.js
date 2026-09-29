'use strict';
const path = require('path');
const {spawnSync} = require('child_process');

test('embedded chart workbooks match caches and reject mutations in either direction', () => {
  const python = process.env.RUNTIME_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  const result = spawnSync(python, ['-X', 'utf8', path.join(__dirname, 'test_chart_workbooks.py')], {encoding: 'utf8'});
  if (result.error || result.status !== 0) throw new Error(String(result.error || '') + result.stdout + result.stderr);
});
