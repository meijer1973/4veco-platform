const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  RETIRED_COMMAND_DIR,
  SOURCE_SKILL,
  validatePptxSkillMirror,
} = require('./check-pptx-skill-mirror');

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pptx-retired-mirror-'));
  fs.mkdirSync(path.join(root, path.dirname(SOURCE_SKILL)), { recursive: true });
  fs.writeFileSync(path.join(root, SOURCE_SKILL), '# PPTX skill\n');
  return root;
}

describe('check-pptx-skill-mirror retired command surface guard', () => {
  test('passes when the canonical skill exists and retired command directory is absent', () => {
    const root = makeTempRoot();

    expect(validatePptxSkillMirror(root, { trackedFiles: [] })).toEqual([]);
  });

  test('fails when any retired command file is present', () => {
    const root = makeTempRoot();
    const commandDir = path.join(root, RETIRED_COMMAND_DIR);
    fs.mkdirSync(commandDir, { recursive: true });
    fs.writeFileSync(path.join(commandDir, 'econ-book-builder.md'), '# stale command\n');

    expect(validatePptxSkillMirror(root, { trackedFiles: [] })).toEqual([
      '.claude/commands is retired but present files remain: .claude/commands/econ-book-builder.md',
    ]);
  });

  test('fails when any retired command file is still tracked', () => {
    const root = makeTempRoot();

    expect(
      validatePptxSkillMirror(root, {
        trackedFiles: ['.claude/commands/econ-quality-control.md'],
      })
    ).toEqual([
      '.claude/commands is retired but tracked files remain: .claude/commands/econ-quality-control.md',
    ]);
  });
});
