'use strict';
const path = require('path');
const {spawnSync} = require('child_process');

test('straight-scatter repair preserves data, custom labels, smooth charts and other package parts', () => {
  // setup-python installs support packages here; later Windows tool installers
  // can put another Python on PATH. Use the configured interpreter explicitly.
  const configuredPython = process.env.pythonLocation
    ? path.join(process.env.pythonLocation, process.platform === 'win32' ? 'python.exe' : 'bin/python')
    : null;
  const python = process.env.RUNTIME_PYTHON || configuredPython || (process.platform === 'win32' ? 'python' : 'python3');
  const result = spawnSync(python, ['-X', 'utf8', path.join(__dirname, 'test_straight_scatter.py')], {encoding: 'utf8'});
  if (result.error || result.status !== 0) throw new Error(String(result.error || '') + result.stdout + result.stderr);
});
