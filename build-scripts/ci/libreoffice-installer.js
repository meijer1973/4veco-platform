#!/usr/bin/env node
// Pin the same release previously selected by Chocolatey; direct official-listed
// mirrors avoid its unbounded redirect timeout. Never trust a cache without hashing.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const manifest = require('./libreoffice-installer.json');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function validateManifest(pin) {
  if (!/^\d+\.\d+\.\d+$/.test(pin.version) ||
      pin.filename !== `LibreOffice_${pin.version}_Win_x86-64.msi` ||
      !/^[a-f0-9]{64}$/.test(pin.sha256) || !Array.isArray(pin.urls) ||
      pin.urls.length < 1 || pin.urls.length > 3) throw new Error('Invalid LibreOffice installer pin');
  for (const value of pin.urls) {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password ||
        !url.pathname.endsWith(`/${pin.filename}`)) throw new Error('Invalid LibreOffice installer URL');
  }
}

function download(url, output) {
  execFileSync(process.platform === 'win32' ? 'curl.exe' : 'curl', [
    '--fail', '--location', '--proto', '=https', '--proto-redir', '=https',
    '--connect-timeout', '15', '--max-time', '180', '--speed-limit', '262144',
    '--speed-time', '30', '--silent', '--show-error', '--output', output, url,
  ], { timeout: 190000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
}

function ensureInstaller(cacheDirectory, options = {}) {
  const pin = options.manifest || manifest;
  validateManifest(pin);
  const fetch = options.download || download;
  const warn = options.warn || (message => console.error(message));
  fs.mkdirSync(cacheDirectory, { recursive: true });
  const installer = path.resolve(cacheDirectory, pin.filename);
  const partial = `${installer}.download`;
  const attempts = [];
  if (fs.existsSync(installer)) {
    if (fs.lstatSync(installer).isSymbolicLink() || !fs.statSync(installer).isFile()) {
      throw new Error('LibreOffice installer cache is not a regular file');
    }
    if (sha256(installer) === pin.sha256) {
      return { installer, version: pin.version, sha256: pin.sha256, source: 'verified-cache', attempts };
    }
    warn('Discarding LibreOffice installer cache with an incorrect SHA-256');
    fs.rmSync(installer);
  }
  for (const url of pin.urls) {
    try {
      fs.rmSync(partial, { force: true });
      fetch(url, partial);
      if (sha256(partial) !== pin.sha256) throw new Error('LibreOffice installer SHA-256 mismatch');
      fs.renameSync(partial, installer);
      attempts.push({ url, result: 'verified' });
      return { installer, version: pin.version, sha256: pin.sha256, source: url, attempts };
    } catch (error) {
      attempts.push({ url, result: 'failed', error: error.message });
      warn(`LibreOffice mirror failed: ${url}: ${error.message}`);
    } finally {
      fs.rmSync(partial, { force: true });
    }
  }
  throw new Error(`All ${pin.urls.length} pinned LibreOffice mirrors failed: ${JSON.stringify(attempts)}`);
}

function verifyInstalled(sofficePath, options = {}) {
  const pin = options.manifest || manifest;
  validateManifest(pin);
  if (!fs.existsSync(sofficePath) || !fs.statSync(sofficePath).isFile()) {
    throw new Error('Installed soffice.exe is missing');
  }
  // The console launcher returns stdout on Windows; it belongs to the same install.
  const consolePath = path.join(path.dirname(sofficePath), 'soffice.com');
  if (!fs.existsSync(consolePath)) throw new Error('Installed soffice.com is missing');
  const readVersion = options.readVersion || (() => execFileSync(consolePath, ['--version'], {
    encoding: 'utf8', timeout: 30000, windowsHide: true,
  }));
  const output = readVersion().trim();
  const escaped = pin.version.replace(/\./g, '\\.');
  if (!new RegExp(`^LibreOffice ${escaped}(?:\\.\\d+)?(?:\\s|$)`).test(output)) {
    throw new Error(`Installed LibreOffice version differs from ${pin.version}: ${output}`);
  }
  return { version_output: output, soffice_path: sofficePath, soffice_sha256: sha256(sofficePath) };
}

if (require.main === module) {
  try {
    const [command, location] = process.argv.slice(2);
    if (!location || !['download', 'verify'].includes(command)) {
      throw new Error('Usage: libreoffice-installer.js download <cache-dir> | verify <soffice.exe>');
    }
    const evidence = command === 'download' ? ensureInstaller(location) : verifyInstalled(location);
    console.log(JSON.stringify(evidence, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { ensureInstaller, verifyInstalled, validateManifest, manifest, download };
