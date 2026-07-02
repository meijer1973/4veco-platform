const fs = require('fs');
const os = require('os');
const path = require('path');

const { resolveEvidenceRef } = require('./lib/evidence-reference-resolver');

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

describe('evidence-reference-resolver', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-ref-'));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  test('resolves a valid unique anchor', () => {
    writeJson(path.join(root, 'packet.json'), { records: [{ anchor_id: 'A1', value: 1 }] });

    const result = resolveEvidenceRef(root, 'packet.json#A1');

    expect(result.ok).toBe(true);
    expect(result.type).toBe('json-fragment');
    expect(result.fragment_verified).toBe(true);
    expect(result.locations).toEqual(['$.records[0]']);
  });

  test('preserves synthetic exam-question anchor support', () => {
    writeJson(path.join(root, 'questions.json'), {
      records: [{ exam: 'vw-1022-a-24-1-o', opgave_num: 1, question_num: 3 }],
    });

    const result = resolveEvidenceRef(root, 'questions.json#vw-1022-a-24-1-o:opgave-1:question-3');

    expect(result.ok).toBe(true);
    expect(result.locations).toEqual(['$.records[0]']);
  });

  test('resolves explicit H5 evidence identifier fields', () => {
    writeJson(path.join(root, 'packet.json'), {
      rows: [
        { requirement_id: 'q3-calc-1' },
        { answer_skill_id: 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION' },
        { reviewed_equivalent_id: 'Q19_DIRECT_RENDERED_OFFICIAL_EVIDENCE_REVIEWED_EQUIVALENT' },
      ],
    });

    expect(resolveEvidenceRef(root, 'packet.json#q3-calc-1').ok).toBe(true);
    expect(resolveEvidenceRef(root, 'packet.json#EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION').ok).toBe(true);
    expect(resolveEvidenceRef(root, 'packet.json#Q19_DIRECT_RENDERED_OFFICIAL_EVIDENCE_REVIEWED_EQUIVALENT').ok).toBe(true);
  });

  test('rejects a missing anchor', () => {
    writeJson(path.join(root, 'packet.json'), { records: [{ anchor_id: 'A1' }] });

    const result = resolveEvidenceRef(root, 'packet.json#missing');

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/missing JSON fragment anchor/);
  });

  test('rejects duplicate anchor_id values', () => {
    writeJson(path.join(root, 'packet.json'), {
      records: [{ anchor_id: 'A1' }, { anchor_id: 'A1' }],
    });

    const result = resolveEvidenceRef(root, 'packet.json#A1');

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/duplicate anchor_id/);
    expect(result.duplicateAnchorIds).toHaveLength(1);
  });

  test('rejects ambiguous generic ids', () => {
    writeJson(path.join(root, 'packet.json'), {
      records: [{ id: 'same' }, { operation_id: 'same' }],
    });

    const result = resolveEvidenceRef(root, 'packet.json#same');

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/ambiguous JSON fragment anchor/);
    expect(result.locations).toEqual(['$.records[0]', '$.records[1]']);
  });

  test('rejects a path that escapes the repository root', () => {
    const outside = path.join(path.dirname(root), 'outside-evidence.json');
    writeJson(outside, { anchor_id: 'OUTSIDE' });

    const result = resolveEvidenceRef(root, `../${path.basename(outside)}#OUTSIDE`);

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/escapes repository root/);
    fs.rmSync(outside, { force: true });
  });

  test('rejects malformed percent encoding in fragments', () => {
    writeJson(path.join(root, 'packet.json'), { records: [{ anchor_id: 'A1' }] });

    const result = resolveEvidenceRef(root, 'packet.json#%E0%A4%A');

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/malformed URI fragment/);
  });

  test('rejects HTTP URLs unless explicitly allowed', () => {
    const rejected = resolveEvidenceRef(root, 'https://example.test/evidence.json#A1');
    const accepted = resolveEvidenceRef(root, 'https://example.test/evidence.json#A1', { allowUrls: true });

    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toMatch(/allowUrls/);
    expect(accepted.ok).toBe(true);
    expect(accepted.type).toBe('url');
  });
});
