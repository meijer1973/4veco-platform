#!/usr/bin/env node
/**
 * download-exams.js
 *
 * Download CvTE havo/vwo economie exam PDFs from examenblad.nl into
 * references/external/exams/. Per yearly cohort; reruns are idempotent
 * (skip existing files unless --force).
 *
 * Usage:
 *   node build-scripts/references/download-exams.js [--year 2025] [--force]
 *
 * Each exam produces two files:
 *   - <code>-o.pdf   opgaven (question paper)
 *   - <code>-c.pdf   correctievoorschrift (marking scheme, useful for audit)
 *
 * URL pattern (observed 2025):
 *   https://www.examenblad.nl/<year>/<level>/documenten/cse-<tijdvak>/<filename>
 * The wrapper URL 303-redirects to /system/files/exam-document/<YYYY-MM>/<filename>.pdf;
 * curl -L follows the redirect.
 *
 * Filename pattern:
 *   <prefix>-<vak>-a-<yy>-<tijdvak>-<suffix>
 *   where
 *     prefix  = "vw" (vwo) | "ha" (havo)
 *     vak     = 1022 for economie
 *     yy      = two-digit year (25 for 2025)
 *     tijdvak = 1 | 2
 *     suffix  = "o" (opgaven) | "c" (correctievoorschrift)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EXAMS_DIR = path.join(REPO_ROOT, 'references/external/exams');
const VAK_CODE = '1022';

function parseArgs(argv) {
  const out = { year: 2025, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--year') out.year = parseInt(argv[++i], 10);
    else if (a === '--force') out.force = true;
  }
  return out;
}

function buildTargets(year) {
  const yy = String(year).slice(2);
  const levels = [
    { pref: 'vw', pathSeg: 'vwo' },
    { pref: 'ha', pathSeg: 'havo' },
  ];
  const tijdvakken = [1, 2];
  const suffixes = ['o', 'c'];
  const targets = [];
  for (const { pref, pathSeg } of levels) {
    for (const tv of tijdvakken) {
      for (const sfx of suffixes) {
        const code = `${pref}-${VAK_CODE}-a-${yy}-${tv}-${sfx}`;
        const url = `https://www.examenblad.nl/${year}/${pathSeg}/documenten/cse-${tv}/${code}`;
        targets.push({ code, url, file: code + '.pdf' });
      }
    }
  }
  return targets;
}

function download(url, dst) {
  return new Promise((resolve, reject) => {
    function get(u, hops = 0) {
      if (hops > 5) return reject(new Error('too many redirects'));
      https.get(u, res => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, u).toString();
          res.resume();
          return get(loc, hops + 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        }
        const tmp = dst + '.part';
        const w = fs.createWriteStream(tmp);
        res.pipe(w);
        w.on('finish', () => {
          w.close();
          fs.renameSync(tmp, dst);
          resolve(fs.statSync(dst).size);
        });
        w.on('error', err => { w.close(); reject(err); });
      }).on('error', reject);
    }
    get(url);
  });
}

async function main() {
  const { year, force } = parseArgs(process.argv);
  if (!fs.existsSync(EXAMS_DIR)) fs.mkdirSync(EXAMS_DIR, { recursive: true });

  const targets = buildTargets(year);
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const t of targets) {
    const dst = path.join(EXAMS_DIR, t.file);
    if (!force && fs.existsSync(dst)) {
      skipped++;
      console.log(`SKIP  ${t.file} (exists)`);
      continue;
    }
    try {
      const bytes = await download(t.url, dst);
      console.log(`OK    ${t.file} (${(bytes / 1024).toFixed(0)} KB)`);
      downloaded++;
    } catch (err) {
      console.error(`FAIL  ${t.file}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${downloaded} downloaded, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { buildTargets, parseArgs };
