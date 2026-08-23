const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const checker = require('./check-y1-golden-rollout-wave-1');

const SCRIPT = path.resolve(__dirname, 'check-y1-golden-rollout-wave-1.js');

function baseWave() {
  return {
    schema_version: 2,
    wave_id: checker.WAVE_ID,
    status: 'draft_unbound',
    paragraphs: [...checker.PARAGRAPHS],
    surface_ids: [...checker.EXPECTED_SURFACES],
    scale_gate_1: {
      decision: 'PASS_CONTROLLED_ROLLOUT',
      controlled_wave_eligibility_authorized: true,
    },
    authority: {
      actual_rollout_or_adoption_authorized: false,
      product_route_adoption_authorized: false,
      broad_product_use_authorized: false,
      product_use_authorized: false,
      student_product_use_authorized: false,
      completion_language_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      adaptive_routing_authorized: false,
      summative_use_authorized: false,
      pv_authorized: false,
      generated_lesson_output_changed: false,
      source_data_changed: false,
      engine_behavior_changed: false,
    },
    owner_decision: { platform_pr: 148, comment_id: 4807419611 },
  };
}

function baseManifest() {
  return {
    surfaces: [
      ...checker.EXPECTED_SURFACES.map((id) => ({
        id,
        paragraph: id.slice(0, 5),
        scope: 'first_three_product_proof',
      })),
      { id: '1.1.4-landing-exit-copy', paragraph: '1.1.4', scope: 'same_copy_hygiene', gate_claim: false },
    ],
  };
}

function baseSurfaceContract(id = '1.1.1-korte-check') {
  const advisory = id.endsWith('-korte-check');
  const surface = {
    id,
    paragraph: id.slice(0, 5),
    current: true,
    legacy_unsuffixed_allowed: false,
    completion_language_eligible: false,
    source_path: `source-data/book-1/exit-ticket/${id}.json`,
    generated_path: `shared/exit-ticket/${id}.js`,
    surface: advisory ? 'advisory_short_check' : 'target_equivalent_exit_ticket',
  };
  const data = {
    parNr: surface.paragraph,
    surface: surface.surface,
    layout: { framework: 'golden_exercise_workbench' },
    targetEquivalent: {
      completionLanguageEligible: false,
      candidate: !advisory,
      gateApproved: !advisory,
    },
    metadataAlignment: { targetReadinessEvidence: !advisory },
  };
  return { surface, source: data, generated: JSON.parse(JSON.stringify(data)) };
}

function basePacketAndProof() {
  const authority = baseWave().authority;
  return {
    packet: {
      schema_version: 1,
      sprint_id: checker.WAVE_ID,
      pr_number: 999,
      pr_url: 'https://github.com/meijer1973/4veco-platform/pull/999',
      pr_throughput_class: 'high_authority',
      authority_class: 'product_authority',
      review_autonomy: { level: 'L4' },
      human_decision_required: true,
      auto_merge_allowed_after_ci: false,
      route: 'READY_FOR_HUMAN_REVIEW',
      reviewed_payload_head_sha: 'a'.repeat(40),
      authority_claims: authority,
    },
    proof: {
      schema_version: 2,
      sprint_id: checker.WAVE_ID,
      scale_gate_1: {
        decision: 'PASS_CONTROLLED_ROLLOUT',
        controlled_wave_eligibility_authorized: true,
      },
      authority,
    },
  };
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return String(result.stdout || '').trim();
}

function write(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-golden-check-'));
  git(root, ['init']);
  git(root, ['config', 'user.email', 'test@example.com']);
  git(root, ['config', 'user.name', 'Test']);
  write(root, 'seed.txt', 'seed\n');
  write(root, 'source-data/book-1/exit-ticket/existing.json', '{}\n');
  write(root, 'reports/sprints/Y1-old.md', 'old\n');
  git(root, ['add', '.']);
  git(root, ['commit', '-m', 'base']);
  const base = git(root, ['rev-parse', 'HEAD']);
  const policyPath = path.join(root, 'policy.json');
  fs.appendFileSync(path.join(root, '.git', 'info', 'exclude'), '\npolicy.json\n', 'utf8');
  fs.writeFileSync(policyPath, JSON.stringify({
    changed_path_policy: {
      allowed_exact: ['package.json'],
      allowed_prefixes: ['reports/sprints/Y1-'],
      forbidden_prefixes: ['source-data/', 'engines/'],
      trigger_prefixes: ['reports/sprints/Y1-'],
      trigger_exact: ['package.json'],
    },
  }), 'utf8');
  return { root, base, policyPath };
}

function commit(root, files, message = 'change') {
  for (const [relativePath, content] of Object.entries(files)) {
    if (content === null) fs.rmSync(path.join(root, relativePath));
    else write(root, relativePath, content);
  }
  git(root, ['add', '-A']);
  git(root, ['commit', '-m', message]);
  return git(root, ['rev-parse', 'HEAD']);
}

function runScopeCli({ root, policyPath, base, head, eventMode = 'manual', scopeMode = 'required', env = {} }) {
  return spawnSync(process.execPath, [
    SCRIPT,
    '--scope-only',
    '--repo-root', root,
    '--policy-file', policyPath,
    '--event-mode', eventMode,
    '--scope-mode', scopeMode,
    '--base', base,
    '--head', head,
  ], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

describe('Y1 Golden rollout wave state contracts', () => {
  test('rejects missing and extra surfaces', () => {
    const missing = baseManifest();
    missing.surfaces = missing.surfaces.filter((item) => item.id !== '1.1.3-exit-ticket');
    expect(() => checker.validateWaveAndSurfaces({ wave: baseWave(), manifest: missing, skipFiles: true }))
      .toThrow(/manifest first-three surfaces mismatch/);

    const extra = baseManifest();
    extra.surfaces.push({ id: '1.1.4-exit-ticket', paragraph: '1.1.4', scope: 'first_three_product_proof' });
    expect(() => checker.validateWaveAndSurfaces({ wave: baseWave(), manifest: extra, skipFiles: true }))
      .toThrow(/manifest first-three surfaces mismatch/);
  });

  test('rejects advisory authority drift and source/generated parity drift', () => {
    const contract = baseSurfaceContract();
    contract.source.targetEquivalent.gateApproved = true;
    expect(() => checker.validateSurfaceContract(contract.surface, contract.source, contract.generated))
      .toThrow(/source\/generated surface mismatch|advisory gateApproved must be false/);

    const parity = baseSurfaceContract('1.1.2-exit-ticket');
    parity.generated.surface = 'advisory_short_check';
    expect(() => checker.validateSurfaceContract(parity.surface, parity.source, parity.generated))
      .toThrow(/source\/generated surface mismatch/);
  });

  test('rejects held-authority and controlled-rollout decision drift', () => {
    const wave = baseWave();
    wave.authority.student_product_use_authorized = true;
    expect(() => checker.validateWaveAndSurfaces({ wave, manifest: baseManifest(), skipFiles: true }))
      .toThrow(/student_product_use_authorized must be false/);

    const decision = baseWave();
    decision.scale_gate_1.decision = 'READY_FOR_HUMAN_REVIEW';
    expect(() => checker.validateWaveAndSurfaces({ wave: decision, manifest: baseManifest(), skipFiles: true }))
      .toThrow(/PASS_CONTROLLED_ROLLOUT/);
  });

  test('rejects missing and escaping route links', () => {
    const source = { parNr: '1.1.1', parName: 'Schaarste en economisch denken' };
    expect(() => checker.routeTarget(source, '')).toThrow(/href is empty/);
    expect(() => checker.routeTarget(source, '../../outside.html')).toThrow(/escapes paragraph directory/);
    expect(() => checker.routeTarget(source, 'missing-route.html')).toThrow(/does not resolve/);
  });

  test('rejects missing generated lesson output', () => {
    const platformRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-golden-platform-'));
    const lessonRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-golden-lesson-'));
    const contract = baseSurfaceContract();
    write(platformRoot, contract.surface.source_path, `${JSON.stringify(contract.source)}\n`);
    try {
      expect(() => checker.validateSurfaceState(contract.surface, { platformRoot, lessonRoot }))
        .toThrow(/missing file/);
    } finally {
      fs.rmSync(platformRoot, { recursive: true, force: true });
      fs.rmSync(lessonRoot, { recursive: true, force: true });
    }
  });

  test('classifies rendered inputs separately from navigation destinations', () => {
    const refs = checker.classifyLocalHtmlReferences(`
      <link rel="stylesheet" href="../shared/layout.css">
      <script src="../shared/runtime.js"></script>
      <img src="images/figure.png" alt="">
      <a href="presentation.html">Presentation</a>
    `, 'chapter/paragraph/index.html');
    expect(refs.rendered_inputs).toEqual([
      'chapter/paragraph/images/figure.png',
      'chapter/shared/layout.css',
      'chapter/shared/runtime.js',
    ]);
    expect(refs.navigation_targets).toEqual(['chapter/paragraph/presentation.html']);
  });
});

describe('Y1 Golden rollout wave evidence and governance contracts', () => {
  test('rejects stale or incomplete delta-proof dependency sets', () => {
    const recorded = {
      schema_version: 1,
      sprint_id: checker.WAVE_ID,
      summary: {
        screenshots_reusable: true,
        changed_or_missing_input_count: 0,
        changed_or_missing_paths: [],
        historical_artifact_count: 0,
        historical_artifacts_blob_equal: true,
        screenshot_manifest_integrity_passed: true,
      },
      platform_equal_paths: [{ path: 'a' }],
      lesson_equal_paths: [{ path: 'b' }],
      lesson_existence_only_paths: [],
    };
    const recomputed = {
      summary: {
        screenshots_reusable: true,
        changed_or_missing_input_count: 0,
        changed_or_missing_paths: [],
        historical_artifact_count: 0,
        historical_artifacts_blob_equal: true,
        screenshot_manifest_integrity_passed: true,
      },
      platform_equal_paths: [{ path: 'a' }, { path: 'omitted-runtime.js' }],
      lesson_equal_paths: [{ path: 'b' }],
      lesson_existence_only_paths: [],
    };
    expect(() => checker.validateDeltaProof(recorded, recomputed)).toThrow(/platform_equal_paths mismatch/);
  });

  test('rejects missing exact event wiring', () => {
    const scripts = { scripts: { 'check:y1-golden-rollout-wave-1': 'node build-scripts/sprints/check-y1-golden-rollout-wave-1.js' } };
    expect(() => checker.validateWiringTexts(scripts, 'Validate Y1 Golden rollout wave'))
      .toThrow(/pull-request base SHA/);
  });

  test('rejects contradictory roadmap current-state language', () => {
    const golden = [
      'PASS_CONTROLLED_ROLLOUT', checker.WAVE_ID,
      'GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1',
      'GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1',
      'A96-CALCULATION-ANSWER-FORM-HARDENING-AND-SCALE-GATE-1-REREVIEW-1',
      'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1',
      'HOLD_FOR_GOLDEN_ROUTE_REPAIR',
    ].join('\n');
    const reference = `## Product Proof Track And Scale Gate 1 Decision\nPASS_CONTROLLED_ROLLOUT ${checker.WAVE_ID}\n## Next\n## Immediate Next Sprint\n${checker.WAVE_ID}\n## End`;
    expect(() => checker.validateRoadmapTexts(golden, reference)).toThrow(/stale Golden-route hold/);
  });

  test('rejects stale root-map and dashboard projections', () => {
    const common = `${checker.WAVE_ID} check-y1-golden-rollout-wave-1.js`;
    expect(() => checker.validateNavigationTexts({
      researchMap: common,
      referenceMap: common,
      githubEntry: common,
      urlIndex: `${checker.PATHS.packet}\n${checker.PATHS.proof}`,
      platformAgentIndex: checker.PATHS.packet,
      dashboard: checker.WAVE_ID,
    })).toThrow(/controlled-rollout state/);
  });

  test('rejects null PR binding and L3 classification', () => {
    const { packet, proof } = basePacketAndProof();
    packet.pr_number = null;
    packet.pr_url = null;
    expect(() => checker.validatePacketObjects(packet, proof, false)).toThrow(/pr_number must be bound/);
    packet.pr_number = 999;
    packet.pr_url = 'https://github.com/meijer1973/4veco-platform/pull/999';
    packet.review_autonomy.level = 'L3';
    expect(() => checker.validatePacketObjects(packet, proof, false)).toThrow(/autonomy must be L4/);
  });
});

describe('Y1 Golden rollout wave real Git CLI scope attestation', () => {
  const roots = [];
  afterEach(() => {
    while (roots.length) fs.rmSync(roots.pop(), { recursive: true, force: true });
  });

  test('passes exact pull-request payload history and rejects synthetic merge confusion', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const head = commit(repo.root, { 'reports/sprints/Y1-new.md': 'new\n' });
    const pass = runScopeCli({
      ...repo,
      head,
      eventMode: 'pull_request',
      env: { Y1_GOLDEN_EVENT_BASE_SHA: repo.base, Y1_GOLDEN_EVENT_HEAD_SHA: head },
    });
    expect(pass.status).toBe(0);

    const fail = runScopeCli({
      ...repo,
      head,
      eventMode: 'pull_request',
      env: {
        Y1_GOLDEN_EVENT_BASE_SHA: repo.base,
        Y1_GOLDEN_EVENT_HEAD_SHA: head,
        Y1_GOLDEN_SYNTHETIC_MERGE_SHA: head,
      },
    });
    expect(fail.status).not.toBe(0);
    expect(fail.stderr).toMatch(/synthetic merge SHA/);
  });

  test('passes the actual main-push before/after range', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const head = commit(repo.root, { 'reports/sprints/Y1-new.md': 'new\n' });
    const result = runScopeCli({
      ...repo,
      head,
      eventMode: 'main_push',
      env: { Y1_GOLDEN_EVENT_BASE_SHA: repo.base, Y1_GOLDEN_EVENT_HEAD_SHA: head },
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/"scope_attestation_triggered": true/);
  });

  test('fails closed on stale refs and exact event-ref mismatch', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const head = commit(repo.root, { 'reports/sprints/Y1-new.md': 'new\n' });
    const stale = runScopeCli({ ...repo, base: 'missing-ref', head });
    expect(stale.status).not.toBe(0);
    expect(stale.stderr).toMatch(/rev-parse/);

    const mismatch = runScopeCli({
      ...repo,
      head,
      eventMode: 'main_push',
      env: { Y1_GOLDEN_EVENT_BASE_SHA: head, Y1_GOLDEN_EVENT_HEAD_SHA: head },
    });
    expect(mismatch.status).not.toBe(0);
    expect(mismatch.stderr).toMatch(/base does not match exact event base SHA/);
  });

  test('rejects committed protected and unexpected paths when renewal scope is triggered', () => {
    const protectedRepo = makeRepo();
    roots.push(protectedRepo.root);
    const protectedHead = commit(protectedRepo.root, {
      'reports/sprints/Y1-new.md': 'new\n',
      'source-data/book-1/exit-ticket/forbidden.json': '{}\n',
    });
    const protectedResult = runScopeCli({ ...protectedRepo, head: protectedHead });
    expect(protectedResult.status).not.toBe(0);
    expect(protectedResult.stderr).toMatch(/forbidden committed path/);

    const unexpectedRepo = makeRepo();
    roots.push(unexpectedRepo.root);
    const unexpectedHead = commit(unexpectedRepo.root, {
      'reports/sprints/Y1-new.md': 'new\n',
      'docs/unexpected.md': 'unexpected\n',
    });
    const unexpectedResult = runScopeCli({ ...unexpectedRepo, head: unexpectedHead });
    expect(unexpectedResult.status).not.toBe(0);
    expect(unexpectedResult.stderr).toMatch(/unexpected committed path/);
  });

  test('rejects delete and rename paths across both sides of the name-status entry', () => {
    const deleteRepo = makeRepo();
    roots.push(deleteRepo.root);
    const deleteHead = commit(deleteRepo.root, {
      'reports/sprints/Y1-new.md': 'new\n',
      'source-data/book-1/exit-ticket/existing.json': null,
    });
    const deleteResult = runScopeCli({ ...deleteRepo, head: deleteHead });
    expect(deleteResult.status).not.toBe(0);
    expect(deleteResult.stderr).toMatch(/forbidden committed path/);

    const renameRepo = makeRepo();
    roots.push(renameRepo.root);
    fs.renameSync(
      path.join(renameRepo.root, 'reports/sprints/Y1-old.md'),
      path.join(renameRepo.root, 'renamed-outside-allowlist.md')
    );
    git(renameRepo.root, ['add', '-A']);
    git(renameRepo.root, ['commit', '-m', 'rename']);
    const renameHead = git(renameRepo.root, ['rev-parse', 'HEAD']);
    const renameResult = runScopeCli({ ...renameRepo, head: renameHead });
    expect(renameResult.status).not.toBe(0);
    expect(renameResult.stderr).toMatch(/unexpected committed path/);
  });

  test('does not apply the renewal allowlist to an unrelated future main push in auto mode', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const head = commit(repo.root, { 'docs/future-authorized-work.md': 'future\n' });
    const result = runScopeCli({
      ...repo,
      head,
      eventMode: 'main_push',
      scopeMode: 'auto',
      env: { Y1_GOLDEN_EVENT_BASE_SHA: repo.base, Y1_GOLDEN_EVENT_HEAD_SHA: head },
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/"scope_attestation_triggered": false/);
  });
});
