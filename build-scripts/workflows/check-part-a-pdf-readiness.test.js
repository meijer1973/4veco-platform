'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const checker = path.resolve(__dirname, 'check-part-a-pdf-readiness.js');
const DASH = '\u2013';

function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || '').trim());
  return result.stdout.trim();
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function addParagraph(root, relative, options = {}) {
  const name = path.basename(relative);
  const roles = options.roles || (options.consolidation
    ? ['opgaven', 'antwoorden']
    : ['paragraaf', 'opgaven', 'antwoorden']);
  for (const role of roles) {
    write(path.join(root, relative, `${name} ${DASH} ${role}.md`), `# ${role}\n`);
    if (options.missingPdf !== role) {
      write(path.join(root, relative, `${name} ${DASH} ${role}.pdf`), Buffer.alloc(12000, 1));
    }
  }
  if (!options.missingBuildScript) {
    write(path.join(root, relative, 'build_pdf.py'), '# build\n');
  }
}

function makeLessonRepo(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'part-a-pdf-readiness-'));
  git(root, ['init', '-b', 'main']);
  addParagraph(root, 'Boek 1 - Fixture/1.1 Hoofdstuk/1.1.1 Theory', options.theory || {});
  addParagraph(root, 'Boek 1 - Fixture/1.1 Hoofdstuk/1.1.2 Gemengde opgaven', {
    consolidation: true,
    ...(options.consolidation || {}),
  });
  addParagraph(root, 'Boek 1 - Fixture/1.1 Hoofdstuk/1.1.3 Actieve samenvatting', {
    roles: ['samenvatting', 'antwoorden'],
  });
  addParagraph(root, 'Boek 1 - Fixture/1.1 Hoofdstuk/1.1.4 Proeftoets', {
    roles: ['toets', 'antwoorden', 'toetsmatrijs'],
  });
  addParagraph(root, 'archive/1.1.9 Archived', { missingBuildScript: true });
  git(root, ['add', '.']);
  git(root, ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'fixture']);
  const head = git(root, ['rev-parse', 'HEAD']);
  git(root, ['update-ref', 'refs/remotes/origin/main', head]);
  return { root, head };
}

function run(repo, expectedSha = repo.head) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'part-a-pdf-evidence-'));
  const jsonOut = path.join(outDir, 'inventory.json');
  const markdownOut = path.join(outDir, 'inventory.md');
  const result = spawnSync(process.execPath, [
    checker,
    '--lesson-root', repo.root,
    '--expected-lesson-sha', expectedSha,
    '--json-out', jsonOut,
    '--markdown-out', markdownOut,
  ], { encoding: 'utf8' });
  return {
    ...result,
    outDir,
    jsonOut,
    markdownOut,
    report: fs.existsSync(jsonOut) ? JSON.parse(fs.readFileSync(jsonOut, 'utf8')) : null,
  };
}

describe('check-part-a-pdf-readiness', () => {
  test('passes and binds evidence to a clean lesson origin/main', () => {
    const repo = makeLessonRepo();
    const result = run(repo);
    try {
      expect(result.status).toBe(0);
      expect(result.report.ok).toBe(true);
      expect(result.report.observed_head_sha).toBe(repo.head);
      expect(result.report.observed_origin_main_sha).toBe(repo.head);
      expect(result.report.summary).toEqual({
        paragraphs_checked: 4,
        passed: 4,
        failed: 0,
        by_type: {
          consolidation: 1,
          'testprep-summary': 1,
          'testprep-examskills': 0,
          'testprep-integration': 0,
          'testprep-practicetest': 1,
          theory: 1,
        },
      });
      expect(fs.readFileSync(result.markdownOut, 'utf8')).toContain('Verdict: `PASS`');
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
      fs.rmSync(result.outDir, { recursive: true, force: true });
    }
  });

  test('fails when build_pdf.py is missing', () => {
    const repo = makeLessonRepo({ theory: { missingBuildScript: true } });
    const result = run(repo);
    try {
      expect(result.status).toBe(1);
      expect(result.report.ok).toBe(false);
      expect(result.report.failures.join('\n')).toMatch(/missing build_pdf\.py/);
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
      fs.rmSync(result.outDir, { recursive: true, force: true });
    }
  });

  test('fails when any required paragraph PDF is missing', () => {
    const repo = makeLessonRepo({ consolidation: { missingPdf: 'antwoorden' } });
    const result = run(repo);
    try {
      expect(result.status).toBe(1);
      expect(result.report.ok).toBe(false);
      expect(result.report.failures.join('\n')).toMatch(/missing antwoorden\.pdf/);
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
      fs.rmSync(result.outDir, { recursive: true, force: true });
    }
  });

  test('fails when expected SHA does not match HEAD and origin/main', () => {
    const repo = makeLessonRepo();
    const result = run(repo, '0'.repeat(40));
    try {
      expect(result.status).toBe(1);
      expect(result.report.ok).toBe(false);
      expect(result.report.failures.join('\n')).toMatch(/does not match expected lesson SHA/);
    } finally {
      fs.rmSync(repo.root, { recursive: true, force: true });
      fs.rmSync(result.outDir, { recursive: true, force: true });
    }
  });
});
