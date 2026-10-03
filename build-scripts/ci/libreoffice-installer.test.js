const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');
const { ensureInstaller, verifyInstalled, validateManifest, manifest } = require('./libreoffice-installer');

describe('pinned LibreOffice acquisition and installed runtime', () => {
  let root;
  const payload = Buffer.from('fixture MSI bytes');
  const pin = { ...manifest, sha256: crypto.createHash('sha256').update(payload).digest('hex') };
  const warn = () => {};
  beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'libreoffice-installer-')); });
  afterEach(() => { fs.rmSync(root, { recursive: true, force: true }); });

  test('checks the saved pin and rejects unsafe names, protocols and unbounded mirror lists', () => {
    expect(() => validateManifest(manifest)).not.toThrow();
    for (const edit of [{ filename: '../other.msi' }, { sha256: 'bad' },
      { urls: ['http://example.test/' + pin.filename] }, { urls: Array(4).fill(pin.urls[0]) }]) {
      expect(() => validateManifest({ ...pin, ...edit })).toThrow();
    }
  });

  test('network failure and wrong bytes cannot publish a partial installer; a later verified mirror can', () => {
    const seen = [];
    const result = ensureInstaller(root, { manifest: pin, warn, download(url, output) {
      seen.push(url);
      fs.writeFileSync(output, seen.length === 3 ? payload : 'incorrect/partial download');
      if (seen.length === 1) throw new Error('HTTP 504');
    } });
    expect(seen).toEqual(pin.urls);
    expect(result.attempts.map(attempt => attempt.result)).toEqual(['failed', 'failed', 'verified']);
    expect(fs.readFileSync(result.installer)).toEqual(payload);
    expect(fs.existsSync(`${result.installer}.download`)).toBe(false);
  });

  test('rehashes restored cache bytes and replaces a corrupted cache', () => {
    const installer = path.join(root, pin.filename);
    fs.writeFileSync(installer, 'corrupted cache');
    const download = jest.fn((_url, output) => fs.writeFileSync(output, payload));
    const first = ensureInstaller(root, { manifest: pin, warn, download });
    expect(first.source).toBe(pin.urls[0]);
    expect(download).toHaveBeenCalledTimes(1);
    const second = ensureInstaller(root, { manifest: pin, warn, download });
    expect(second.source).toBe('verified-cache');
    expect(download).toHaveBeenCalledTimes(1);
  });

  test('fails closed when every mirror fails integrity checking', () => {
    expect(() => ensureInstaller(root, { manifest: pin, warn,
      download(_url, output) { fs.writeFileSync(output, 'wrong installer'); },
    })).toThrow(/All 3 pinned LibreOffice mirrors failed/);
    expect(fs.readdirSync(root)).toEqual([]);
  });

  test('requires both installed launchers and the pinned executable version', () => {
    const executable = path.join(root, 'soffice.exe');
    const readVersion = () => 'LibreOffice 26.2.6.2 build-hash\r\n';
    expect(() => verifyInstalled(executable, { readVersion })).toThrow(/missing/);
    fs.writeFileSync(executable, 'fixture executable');
    expect(() => verifyInstalled(executable, { readVersion })).toThrow(/soffice.com is missing/);
    fs.writeFileSync(path.join(root, 'soffice.com'), 'fixture console launcher');
    expect(verifyInstalled(executable, { readVersion }).version_output).toBe('LibreOffice 26.2.6.2 build-hash');
    for (const output of ['LibreOffice 26.2.60.2 build-hash', 'LibreOffice 26.8.0.1 build-hash', '']) {
      expect(() => verifyInstalled(executable, { readVersion: () => output })).toThrow(/version differs/);
    }
  });
});

test('full CI uses a verified pinned installer and retains all rendering proof gates', () => {
  const workflow = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../.github/workflows/platform-ci.yml'), 'utf8'));
  const steps = workflow.jobs['validate-platform'].steps;
  const install = steps.find(step => step.name === 'Install presentation proof tools');
  expect(install.run).toContain('./build-scripts/ci/install-libreoffice.ps1');
  expect(install.run).not.toContain('choco install libreoffice-fresh');
  expect(install['continue-on-error']).toBeUndefined();
  const cache = steps.find(step => step.name === 'Cache pinned LibreOffice installer');
  expect(cache.with.key).toContain("hashFiles('4veco-platform/build-scripts/ci/libreoffice-installer.json')");
  expect(cache.with['restore-keys']).toBeUndefined();
  for (const name of ['Validate platform Jest suite', 'Build presentation-v2 registered decks',
    'Validate presentation-v2 HTML QA', 'Validate presentation-v2 PPTX proof', 'Validate Y1 Golden rollout wave']) {
    const step = steps.find(item => item.name === name);
    expect(step.if).toBe("steps.ci-scope.outputs.maintenance != 'true'");
    expect(step['continue-on-error']).toBeUndefined();
  }
});
