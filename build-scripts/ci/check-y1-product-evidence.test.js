const crypto = require('crypto');
const { execFileSync } = require('child_process');
const current = require('../sprints/check-y1-golden-rollout-wave-1-current');
const historical = require('../sprints/check-y1-golden-rollout-wave-1');
const { BOOK1, verifyBook1Review, verifyBindings, verifyEventScope, verifyCurrentLesson, run } = require('./check-y1-product-evidence');
const content = Buffer.from('sealed historical evidence\n');
const binding = { path: 'capture.json', sha256: crypto.createHash('sha256').update(content).digest('hex') };
const record = { successor_sources: [{ ...binding, path: 'verifier.js' }], retained_historical_artifacts: [binding] };

describe('explicit current lesson retirement does not inherit historical screenshots', () => {
  const classroom = require('../books/book1-classroom-scope');
  const previousLessonRoot = current.LESSON_ROOT;
  afterEach(() => { current.LESSON_ROOT = previousLessonRoot; jest.restoreAllMocks(); });
  test('bounded retirement authenticates the accepted predecessor and reports changed current pages honestly', () => {
    current.LESSON_ROOT = current.ROOT; // Git fixture for the current SHA lookup only.
    jest.spyOn(current, 'validateLesson').mockImplementation(ref => {
      if (ref === 'HEAD') throw Error('retired lesson routes');
      if (ref === classroom.LESSON_BASE) return {rendered_inputs_unchanged: true};
      throw Error('unexpected historical ref');
    });
    jest.spyOn(classroom, 'verify').mockReturnValue({passed: true, removals: ['retired.pptx'], entry_changes: ['old-index.html']});
    const result = verifyCurrentLesson();
    expect(result.historical_capture_attests_current_retired_pages).toBe(false);
    expect(result.rendered_inputs_unchanged).toBe(false);
    expect(result.new_capture_performed).toBe(false);
    expect(result.retirement_successor.scope_verified).toBe(true);
    expect(current.validateLesson).toHaveBeenCalledWith(classroom.LESSON_BASE);
  });
  test.each([{passed: false}, {passed: true, removals: [], entry_changes: []}])('an unrelated failure never becomes historical acceptance %#', scope => {
    jest.spyOn(current, 'validateLesson').mockImplementation(() => {throw Error('unexpected current bytes');});
    jest.spyOn(classroom, 'verify').mockReturnValue(scope);
    expect(verifyCurrentLesson).toThrow('unexpected current bytes');
    expect(current.validateLesson).toHaveBeenCalledTimes(1);
  });
});
test('current product validation verifies every bound source and historical artifact', () => {
  const seen = [];
  verifyBindings(record, file => { seen.push(file); return content; });
  expect(seen).toEqual(['verifier.js', 'capture.json']);
});

describe('product run connects historical provenance to the actual current pair', () => {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const certificate = JSON.parse(execFileSync('git', ['show', `HEAD:${current.CERTIFICATE}`]));
  const args = ['--event-mode', 'manual', '--scope-mode', 'auto', '--base', BOOK1.platformBase,
    '--head', head, '--lesson-head', 'HEAD'];
  const priorPayload = 'b5a4bb38dfe3cc405a2ee1af6c633783f86d234a';
  let originalBase, originalHead;
  beforeEach(() => {
    originalBase = process.env.Y1_GOLDEN_EVENT_BASE_SHA;
    originalHead = process.env.Y1_GOLDEN_EVENT_HEAD_SHA;
    jest.spyOn(current, 'buildCertificate').mockReturnValue(certificate);
    jest.spyOn(current, 'validateRuntimeAttributes').mockReturnValue({});
    jest.spyOn(current, 'verifyRuntimeCheckout').mockReturnValue(undefined);
    jest.spyOn(current, 'validateLesson').mockReturnValue({ rendered_inputs_unchanged: true });
    jest.spyOn(historical, 'validateEventRefs');
    jest.spyOn(historical, 'selectScopeDelta');
    jest.spyOn(historical, 'validateChangedEntries');
    jest.spyOn(historical, 'run').mockReturnValue({ exact_head_delta: {
      platform_payload_sha: priorPayload, platform_exact_head_sha: BOOK1.platformBase,
    } });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    for (const [key, value] of [['Y1_GOLDEN_EVENT_BASE_SHA', originalBase], ['Y1_GOLDEN_EVENT_HEAD_SHA', originalHead]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });

  test('retains current event, runtime, scope and actual lesson validators while labelling frozen proof refs', () => {
    const result = run(args);
    expect(historical.validateEventRefs).toHaveBeenCalledWith(expect.objectContaining({ eventMode: 'manual' }),
      expect.objectContaining({ base_sha: BOOK1.platformBase, head_sha: head }), current.ROOT);
    expect(historical.selectScopeDelta).toHaveBeenCalledWith(expect.objectContaining({ head_sha: head }),
      expect.any(Object), current.ROOT);
    expect(historical.validateChangedEntries).toHaveBeenCalled();
    expect(current.validateRuntimeAttributes).toHaveBeenCalledWith(head);
    expect(current.verifyRuntimeCheckout).toHaveBeenCalledWith(certificate, head);
    expect(current.validateLesson).toHaveBeenCalledWith('HEAD');
    expect(historical.run).toHaveBeenCalledWith({ eventMode: 'manual', scopeMode: 'auto',
      base: BOOK1.platformBase, head: BOOK1.platformBase, lessonHead: current.SNAPSHOT });
    expect(result.current_platform_sha).toBe(head);
    expect(result.current_event_validation.head_sha).toBe(head);
    expect(result.historical_validation.verified_through_platform_sha).toBe(BOOK1.platformBase);
  }, 30000);

  test('rejects mismatched actual PR refs before accepting any historical proof', () => {
    process.env.Y1_GOLDEN_EVENT_BASE_SHA = head;
    process.env.Y1_GOLDEN_EVENT_HEAD_SHA = head;
    const prArgs = [...args]; prArgs[1] = 'pull_request';
    expect(() => run(prArgs)).toThrow(/base does not match exact event/);
    expect(historical.run).not.toHaveBeenCalled();
    expect(current.buildCertificate).not.toHaveBeenCalled();
  });

  test('a historical PASS cannot conceal changed current lesson inputs or missing routes', () => {
    current.validateLesson.mockImplementation(() => { throw new Error('current lesson rendered input changed'); });
    expect(() => run(args)).toThrow('current lesson rendered input changed');
    expect(historical.run).toHaveBeenCalled();
    expect(current.validateLesson).toHaveBeenCalledWith('HEAD');
  }, 30000);

  test('a triggered actual scope retains the historical evidence-tail rejection at current HEAD', () => {
    historical.validateChangedEntries.mockReturnValue({ triggered: true, changed_paths: [BOOK1.path] });
    const tail = jest.spyOn(historical, 'validateEvidenceTail').mockImplementation(() => { throw new Error('rejected current tail'); });
    expect(() => run(args)).toThrow('rejected current tail');
    expect(tail).toHaveBeenCalledWith(priorPayload, head);
    expect(current.validateLesson).not.toHaveBeenCalled();
  }, 30000);
});

describe('successor keeps current event and scope validation', () => {
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const delta = { base_sha: BOOK1.platformBase, head_sha: head, entries: [{ status: 'M', path: BOOK1.path }] };
  const options = { eventMode: 'pull_request', scopeMode: 'auto',
    eventBaseSha: BOOK1.platformBase, eventHeadSha: head };
  const policy = { trigger_exact: ['sealed-capture.json'], allowed_exact: ['sealed-capture.json'] };

  test('reports the actual current delta, not the immutable historical proof refs', () => {
    expect(verifyEventScope(options, delta, policy)).toMatchObject({
      base_sha: BOOK1.platformBase, head_sha: head, scope_attestation_triggered: false,
      changed_paths: [BOOK1.path],
    });
  });

  test.each([
    { eventBaseSha: head },
    { eventHeadSha: BOOK1.platformBase },
  ])('rejects wrong current event refs %#', mutation => {
    expect(() => verifyEventScope({ ...options, ...mutation }, delta, policy)).toThrow(/does not match exact event/);
  });

  test('a protected Y1 change still triggers original scope rejection', () => {
    const triggered = { ...delta, entries: [...delta.entries, { status: 'M', path: 'sealed-capture.json' }] };
    expect(() => verifyEventScope(options, triggered, policy)).toThrow(/unexpected committed path changed/);
  });
});
test.each(['verifier.js', 'capture.json'])('changed %s remains rejected', changed => {
  expect(() => verifyBindings(record, file => file === changed ? Buffer.from('changed') : content)).toThrow(/Bound Y1 source or historical artifact changed/);
});
test('missing evidence remains a failure', () => {
  expect(() => verifyBindings(record, () => { throw new Error('missing'); })).toThrow('missing');
});

describe('finite Book 1 landing-source successor', () => {
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  const readGit = ref => execFileSync('git', ['show', `${ref}:${BOOK1.path}`]);
  const original = readGit(BOOK1.platformBase);
  const revised = readGit('HEAD');
  const sourceRecord = { successor_sources: [], retained_historical_artifacts: [
    { path: BOOK1.path, sha256: BOOK1.before }, binding,
  ] };
  function fixture(edit = {}) {
    const manifest = { revision: BOOK1.revision, platform_base: BOOK1.platformBase, lessons_base: BOOK1.lessonBase,
      platform: [{ path: BOOK1.path, sha256: BOOK1.after, bytes: revised.length }], ...edit.manifest };
    const bytes = Buffer.from(JSON.stringify(manifest));
    const files = {
      [BOOK1.path]: revised,
      [BOOK1.manifest]: bytes,
      [BOOK1.pin]: Buffer.from(JSON.stringify({ revision: BOOK1.revision, manifest_sha256: sha(bytes), ...edit.pin })),
      [BOOK1.review]: Buffer.from(edit.review || `Verdict: PASS with flags\nReview manifest SHA256: \`${sha(bytes)}\`\n`),
      [binding.path]: content, ...edit.files,
    };
    const read = file => { if (!files[file]) throw new Error('missing ' + file); return files[file]; };
    return { read, options: { readBaseline: () => original } };
  }

  test('the two exact Git blobs differ only by the reviewed pre-write entry guard', () => {
    expect(sha(original)).toBe(BOOK1.before);
    expect(sha(revised)).toBe(BOOK1.after);
    const guard = [
      '  // The new textbook edition has its own source-owned entry builder. Legacy',
      '  // companion generation must never replace that entry with first-edition IDs.',
      "  const currentEdition=path.join(MODULE_BASE,'edities/tweede-editie-2026/manifest.json');",
      '  if (!ONLY_ID && fs.existsSync(currentEdition)) {',
      "    throw new Error('Book 1 second-edition entry: use build-scripts/books/book1_second_edition/publish.py. Legacy companion pages remain first edition.');",
      '  }',
    ].join('\n');
    expect(revised.toString()).toBe(original.toString().replace('function main() {\n', `function main() {\n${guard}\n`));
  });

  test('accepts only the exact source successor with preserved original bytes and a current independent review', () => {
    const { read, options } = fixture();
    const result = verifyBindings(sourceRecord, read, options);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ path: BOOK1.path, historical_sha256: BOOK1.before,
      current_sha256: BOOK1.after, historical_platform_sha: BOOK1.platformBase });
    expect(() => verifyBindings(sourceRecord, read)).toThrow(/Bound Y1/);
    expect(() => verifyBindings(sourceRecord, read, { readBaseline: () => Buffer.from('changed history') }))
      .toThrow(/Original Y1 landing source is not preserved/);
  });

  test.each([
    { files: { [BOOK1.path]: Buffer.concat([revised, Buffer.from('// unrelated edit')]) } },
    { files: { [binding.path]: Buffer.from('altered capture') } },
    { files: { [BOOK1.review]: null } },
    { pin: { manifest_sha256: '0'.repeat(64) } },
    { review: 'Verdict: FAIL\n' },
    { review: 'Verdict: PASS\nReview manifest SHA256: `obsolete`\n' },
    { manifest: { platform_base: '0'.repeat(40) } },
    { manifest: { lessons_base: '0'.repeat(40) } },
    { manifest: { platform: [] } },
    { manifest: { platform: [{ path: BOOK1.path, sha256: BOOK1.before, bytes: revised.length }] } },
    { manifest: { platform: [{ path: BOOK1.path, sha256: BOOK1.after, bytes: 1 }] } },
    { manifest: { platform: Array(2).fill({ path: BOOK1.path, sha256: BOOK1.after, bytes: revised.length }) } },
  ])('rejects unreviewed source, history, receipt or review mutation %#', edit => {
    const { read, options } = fixture(edit);
    expect(() => verifyBindings(sourceRecord, read, options)).toThrow();
  });

  test('a newly repinned manifest still needs a matching independent review', () => {
    const { read } = fixture({ manifest: { note: 'new candidate' },
      review: 'Verdict: PASS\nReview manifest SHA256: `older-manifest`\n' });
    expect(() => verifyBook1Review(read)).toThrow(/independent review does not bind/);
  });
});
