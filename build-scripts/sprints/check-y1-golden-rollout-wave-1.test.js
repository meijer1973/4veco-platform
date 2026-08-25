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
      automatic_repository_wide_migration_authorized: false,
    },
    authority: {
      actual_rollout_or_adoption_authorized: false,
      automatic_repository_wide_migration_authorized: false,
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
      reviewed_payload_head_sha: 'c'.repeat(40),
      authority_claims: authority,
      proof: { rendered_renewal: checker.PATHS.renderedRenewal },
    },
    proof: {
      schema_version: 2,
      sprint_id: checker.WAVE_ID,
      scale_gate_1: {
        decision: 'PASS_CONTROLLED_ROLLOUT',
        controlled_wave_eligibility_authorized: true,
        automatic_repository_wide_migration_authorized: false,
      },
      rendered_evidence: {
        reviewed_platform_payload_sha: 'c'.repeat(40),
        lesson_snapshot_sha: 'f'.repeat(40),
        rendered_renewal: checker.PATHS.renderedRenewal,
        reuse_status: 'verified_exact_rendered_equivalence',
        screenshots_recaptured: true,
        verified_rendered_renewal_count: 1,
        changed_or_missing_input_count: 1,
        unresolved_changed_or_missing_input_count: 0,
      },
      authority,
    },
  };
}

function baseDeltaRecord() {
  return {
    schema_version: 2,
    sprint_id: checker.WAVE_ID,
    commit_chain: {
      platform: { capture_payload: 'a'.repeat(40), old_pr_ci: 'b'.repeat(40), renewal_payload: 'c'.repeat(40) },
      lesson: { capture_payload: 'd'.repeat(40), old_pr_ci: 'e'.repeat(40), renewal_snapshot: 'f'.repeat(40) },
    },
    dependency_discovery: {
      capture_pages_from_scale_proof: true,
      local_browser_assets_from_capture_inspection: true,
      html_src_require_blob_equality: true,
      html_link_href_require_blob_equality: true,
      anchor_href_require_existence_only: true,
      navigation_destination_content_outside_screenshot_claim: true,
      landing_route_targets_exist_at_all_commits: true,
      platform_source_generator_runtime_and_proof_inputs_explicit: true,
      proof_defined_list_accepted_without_cross_check: false,
      changed_capture_inputs_require_verified_rendered_renewal: true,
    },
    summary: {
      screenshots_reusable: true,
      recapture_required: false,
      changed_or_missing_input_count: 1,
      changed_or_missing_paths: ['b'],
      verified_rendered_renewal_count: 1,
      verified_rendered_renewal_paths: ['b'],
      unresolved_changed_or_missing_input_count: 0,
      unresolved_changed_or_missing_paths: [],
      replacement_capture_count: 1,
      exact_rendered_equivalence_count: 1,
      historical_artifact_count: 1,
      historical_artifacts_blob_equal: true,
      screenshot_manifest_integrity_passed: true,
    },
    platform_equal_paths: [{ path: 'a', blobs: { renewal_payload: 'blob-a' }, status: 'equal' }],
    lesson_equal_paths: [{ path: 'b', blobs: { renewal_snapshot: 'blob-b' }, status: 'changed' }],
    lesson_existence_only_paths: [{ path: 'c', blobs: { renewal_snapshot: 'blob-c' }, status: 'present' }],
    rendered_renewals: [{ evidence_path: 'reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-rendered-renewal.json', status: 'exact_rendered_equivalence' }],
  };
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return String(result.stdout || '').trim();
}

function syntheticCommit(root, parent, files) {
  const indexPath = path.join(os.tmpdir(), `y1-golden-index-${process.pid}-${Date.now()}-${Math.random()}`);
  const env = {
    ...process.env,
    GIT_INDEX_FILE: indexPath,
    GIT_AUTHOR_NAME: 'Y1 Golden Test',
    GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'Y1 Golden Test',
    GIT_COMMITTER_EMAIL: 'test@example.com',
  };
  const run = (args, input = undefined) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', env, input });
    if (result.status !== 0) throw new Error(result.stderr || result.stdout);
    return String(result.stdout || '').trim();
  };
  try {
    run(['read-tree', parent]);
    for (const [relativePath, content] of Object.entries(files)) {
      const blob = run(['hash-object', '-w', '--stdin'], content);
      run(['update-index', '--add', '--cacheinfo', '100644', blob, relativePath]);
    }
    const tree = run(['write-tree']);
    return run(['commit-tree', tree, '-p', parent], 'synthetic full-mode test\n');
  } finally {
    fs.rmSync(indexPath, { force: true });
  }
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

function runScopeCli({ root, policyPath, base, head, eventMode = 'manual', scopeMode = 'required', scopeOnly = true, allowUnbound = false, env = {} }) {
  const args = [
    SCRIPT,
    '--repo-root', root,
    '--policy-file', policyPath,
    '--event-mode', eventMode,
    '--scope-mode', scopeMode,
    '--base', base,
    '--head', head,
  ];
  if (scopeOnly) args.splice(1, 0, '--scope-only');
  if (allowUnbound) args.push('--allow-unbound-packet');
  return spawnSync(process.execPath, args, {
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

    const migration = baseWave();
    migration.authority.automatic_repository_wide_migration_authorized = true;
    expect(() => checker.validateWaveAndSurfaces({ wave: migration, manifest: baseManifest(), skipFiles: true }))
      .toThrow(/automatic_repository_wide_migration_authorized must be false/);

    const decision = baseWave();
    decision.scale_gate_1.decision = 'READY_FOR_HUMAN_REVIEW';
    expect(() => checker.validateWaveAndSurfaces({ wave: decision, manifest: baseManifest(), skipFiles: true }))
      .toThrow(/PASS_CONTROLLED_ROLLOUT/);
  });

  test('rejects missing and escaping route links', () => {
    const source = { parNr: '1.1.1', parName: 'Schaarste en economisch denken' };
    expect(() => checker.routeTarget(source, '')).toThrow(/href is empty/);
    expect(() => checker.routeTarget(source, '../../../outside.html')).toThrow(/escapes Book 1 root/);
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

  test('rejects exact legacy assets without rejecting generated exit-ticket data', () => {
    expect(checker.containsLegacyAsset('<script src="../../shared/exit-ticket/1.1.1-exit-ticket.js"></script>')).toBe(false);
    expect(checker.containsLegacyAsset('<script src="../../shared/exit-ticket.js"></script>')).toBe(true);
    expect(checker.containsLegacyAsset('<link href="../../shared/task-shell.css" rel="stylesheet">')).toBe(true);
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
  test('accepts the exact one-capture rendered-equivalence renewal', () => {
    const root = path.resolve(__dirname, '..', '..');
    const scaleProof = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.scaleProof), 'utf8'));
    const renewal = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.renderedRenewal), 'utf8'));
    const result = checker.validateRenderedRenewal(renewal, scaleProof, {
      renewedLessonRef: renewal.lesson.renewed_snapshot_sha,
    });
    expect(result.capture_id).toBe('112-normal-practice-desktop-light-opgaven');
    expect(result.changed_pixels).toBe(0);
    expect(result.status).toBe('exact_rendered_equivalence');
  });

  test('keeps the changed opgaven page in the rendered dependency set', () => {
    const root = path.resolve(__dirname, '..', '..');
    const scaleProof = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.scaleProof), 'utf8'));
    const renewal = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.renderedRenewal), 'utf8'));
    const dependencies = checker.deriveLessonDependencies(
      scaleProof,
      renewal.lesson.historical_capture_sha,
      renewal.lesson.renewed_snapshot_sha
    );
    expect(dependencies.equal_paths).toContain(renewal.lesson.page_path);
  });

  test.each([
    ['changed pixel', (record) => { record.pixel_comparison.changed_pixels = 1; }, /changed-pixel result mismatch/],
    ['wrong page', (record) => { record.lesson.page_path = 'wrong.html'; }, /lesson page mismatch/],
    ['multiple captures', (record) => { record.canonical_process.capture_count = 2; }, /exactly one selected capture/],
    ['stale screenshot hash', (record) => { record.renewed_capture.sha256 = '0'.repeat(64); }, /replacement screenshot hash mismatch/],
    ['failed visual review', (record) => { record.human_visual_review.status = 'FAIL'; }, /human visual review must pass/],
    ['stale visual review hash', (record) => { record.human_visual_review.review_sha256 = '0'.repeat(64); }, /visual review hash mismatch/],
    ['authority escalation', (record) => { record.authority.merge_authorized = true; }, /authority.merge_authorized must be false/],
    ['missing required authority hold', (record) => { delete record.authority.merge_authorized; record.authority.unrelated_placeholder = false; }, /authority keys mismatch/],
  ])('rejects a rendered renewal with %s', (_label, mutate, pattern) => {
    const root = path.resolve(__dirname, '..', '..');
    const scaleProof = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.scaleProof), 'utf8'));
    const renewal = JSON.parse(fs.readFileSync(path.join(root, checker.PATHS.renderedRenewal), 'utf8'));
    mutate(renewal);
    expect(() => checker.validateRenderedRenewal(renewal, scaleProof)).toThrow(pattern);
  });

  test('rejects stale or incomplete delta-proof dependency sets', () => {
    const recorded = baseDeltaRecord();
    const recomputed = structuredClone(recorded);
    recomputed.platform_equal_paths.push({ path: 'omitted-runtime.js', blobs: {}, status: 'equal' });
    expect(() => checker.validateDeltaProof(recorded, recomputed)).toThrow(/platform_equal_paths mismatch/);
  });

  test('rejects stale delta commit chains, classifier flags, blobs, counts, and reuse decisions', () => {
    const mutateAndExpect = (mutate, pattern) => {
      const recorded = baseDeltaRecord();
      const recomputed = structuredClone(recorded);
      mutate(recorded, recomputed);
      expect(() => checker.validateDeltaProof(recorded, recomputed)).toThrow(pattern);
    };
    mutateAndExpect((recorded) => { recorded.commit_chain.platform.renewal_payload = '9'.repeat(40); }, /commit chain is stale/);
    mutateAndExpect((recorded) => { recorded.dependency_discovery.anchor_href_require_existence_only = false; }, /dependency classification is stale/);
    mutateAndExpect((recorded) => { recorded.platform_equal_paths[0].blobs.renewal_payload = 'stale'; }, /blob evidence is stale/);
    mutateAndExpect((recorded) => { recorded.summary.historical_artifact_count = 2; }, /artifact count is stale/);
    mutateAndExpect((recorded) => { recorded.summary.screenshots_reusable = false; }, /reuse decision is stale/);
    mutateAndExpect((recorded) => { recorded.summary.recapture_required = true; }, /complete summary is stale/);
    mutateAndExpect((recorded) => { recorded.rendered_renewals[0].status = 'stale'; }, /rendered renewal evidence is stale/);
  });

  test('limits the post-payload evidence tail to deterministic evidence paths', () => {
    expect(checker.evidenceTailPathAllowed('reports/json/y1-golden-rollout-wave-1-rendered-delta-proof.json')).toBe(true);
    expect(checker.evidenceTailPathAllowed('reports/sprints/Y1-GOLDEN-ROLLOUT-WAVE-1-lead-review-round2.md')).toBe(true);
    expect(checker.evidenceTailPathAllowed('build-scripts/sprints/check-y1-golden-rollout-wave-1.js')).toBe(false);
    expect(checker.evidenceTailPathAllowed('source-data/book-1/exit-ticket/1.1.1-exit-ticket.json')).toBe(false);
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
      'All six surfaces keep `completionLanguageEligible:false`',
      'Exit tickets record bounded target-readiness evidence',
      'HOLD_FOR_GOLDEN_ROUTE_REPAIR',
    ].join('\n');
    const reference = `## Product Proof Track And Scale Gate 1 Decision\nPASS_CONTROLLED_ROLLOUT ${checker.WAVE_ID}\nExit tickets remain target-readiness-only with completion language held.\n## Next\n## Immediate Next Sprint\n${checker.WAVE_ID}\nTarget-readiness evidence is approved while completion language remains held.\n## End`;
    expect(() => checker.validateRoadmapTexts(golden, reference)).toThrow(/stale Golden-route hold/);
  });

  test('rejects stale active-roadmap readiness and check-surface review language', () => {
    const golden = [
      'PASS_CONTROLLED_ROLLOUT', checker.WAVE_ID,
      'GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1',
      'GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1',
      'A96-CALCULATION-ANSWER-FORM-HARDENING-AND-SCALE-GATE-1-REREVIEW-1',
      'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1',
      'All six surfaces keep `completionLanguageEligible:false`',
      'Exit tickets record bounded target-readiness evidence',
    ].join('\n');
    const stale = `## Product Proof Track And Scale Gate 1 Decision\nPASS_CONTROLLED_ROLLOUT ${checker.WAVE_ID}\nExit tickets remain target-readiness-only with completion language held.\n## Next\n## Immediate Next Sprint\n${checker.WAVE_ID}\nThe renewed packet is the next direct human review surface.\nThe transfer keeps target-equivalent readiness and completion language held pending review.\n## End`;
    expect(() => checker.validateRoadmapTexts(golden, stale)).toThrow(/stale check-surface review action|incorrectly holds accepted target readiness/);
  });

  test('rejects stale root-map and dashboard projections', () => {
    const common = `${checker.WAVE_ID} check-y1-golden-rollout-wave-1.js`;
    expect(() => checker.validateNavigationTexts({
      researchMap: common,
      referenceMap: common,
      githubEntry: common,
      urlIndex: `${checker.PATHS.bundleUrls}\n${checker.PATHS.proof}\n${checker.PATHS.deltaProof}\n${checker.PATHS.renderedRenewal}`,
      bundleUrls: `${checker.PATHS.packet}\n${checker.PATHS.renderedRenewal}`,
      platformAgentIndex: checker.PATHS.packet,
      dashboard: checker.WAVE_ID,
    })).toThrow(/controlled-rollout state/);
  });

  test('rejects null PR binding and L3 classification', () => {
    const { packet, proof } = basePacketAndProof();
    const delta = baseDeltaRecord();
    packet.pr_number = null;
    packet.pr_url = null;
    expect(() => checker.validatePacketObjects(packet, proof, false, delta)).toThrow(/pr_number must be bound/);
    packet.pr_number = 999;
    packet.pr_url = 'https://github.com/meijer1973/4veco-platform/pull/999';
    packet.review_autonomy.level = 'L3';
    expect(() => checker.validatePacketObjects(packet, proof, false, delta)).toThrow(/autonomy must be L4/);
  });

  test('cross-binds packet PR URL and reviewed payload to proof and delta evidence', () => {
    const { packet, proof } = basePacketAndProof();
    const delta = baseDeltaRecord();
    packet.pr_url = 'https://github.com/meijer1973/4veco-platform/pull/998';
    expect(() => checker.validatePacketObjects(packet, proof, false, delta)).toThrow(/pr_url must match pr_number/);

    packet.pr_url = 'https://github.com/meijer1973/4veco-platform/pull/999';
    packet.reviewed_payload_head_sha = 'd'.repeat(40);
    expect(() => checker.validatePacketObjects(packet, proof, false, delta)).toThrow(/payload SHA must match delta-proof renewal payload/);
  });

  test('rejects unresolved rendered drift even when packet and proof counts are made consistent', () => {
    const { packet, proof } = basePacketAndProof();
    const delta = baseDeltaRecord();
    delta.summary.unresolved_changed_or_missing_input_count = 1;
    delta.summary.unresolved_changed_or_missing_paths = ['unverified.html'];
    delta.summary.screenshots_reusable = false;
    delta.summary.recapture_required = true;
    proof.rendered_evidence.unresolved_changed_or_missing_input_count = 1;
    expect(() => checker.validatePacketObjects(packet, proof, false, delta)).toThrow(/zero unresolved rendered inputs/);
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

    const exactHeadCheckout = runScopeCli({
      ...repo,
      head,
      eventMode: 'pull_request',
      env: {
        Y1_GOLDEN_EVENT_BASE_SHA: repo.base,
        Y1_GOLDEN_EVENT_HEAD_SHA: head,
        Y1_GOLDEN_SYNTHETIC_MERGE_SHA: '0'.repeat(40),
      },
    });
    expect(exactHeadCheckout.status).toBe(0);

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

  test('reads Unicode Git paths through the batch protocol', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const relativePath = 'bewijs/route – exit-ticket.html';
    const head = commit(repo.root, {
      [relativePath]: '<main>bewijs</main>\n',
      'bewijs/empty.html': '',
    });

    expect(checker.gitBlob(head, relativePath, repo.root)).toMatch(/^[0-9a-f]{40}$/);
    expect(checker.gitShow(head, relativePath, repo.root)).toBe('<main>bewijs</main>\n');
    expect(checker.gitBlob(head, 'bewijs/empty.html', repo.root)).toMatch(/^[0-9a-f]{40}$/);
    expect(checker.gitShow(head, 'bewijs/empty.html', repo.root)).toBe('');
    expect(checker.gitBlob(head, 'bewijs/missing.html', repo.root)).toBeNull();
    expect(checker.gitShow(head, 'bewijs/missing.html', repo.root)).toBeNull();
    expect(() => checker.gitShow(head, 'bewijs/line\nbreak.html', repo.root)).toThrow(/forbidden control character/);
    expect(() => checker.gitBlob(head, 'bewijs/carriage\rreturn.html', repo.root)).toThrow(/forbidden control character/);
    expect(() => checker.gitBlob(head, relativePath, path.join(repo.root, 'missing-root'))).toThrow(/git cat-file --batch-check failed/);
    expect(() => checker.parseGitBlobHeader('not a batch header', `${head}:x`, 'x')).toThrow(/unexpected git cat-file header/);
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

  test('shared infrastructure paths do not activate the renewal allowlist for future mixed work', () => {
    const actualPolicyPath = path.resolve(__dirname, '..', '..', 'references', 'data', 'exercises', 'y1-golden-rollout-wave-1.json');
    const actualPolicy = JSON.parse(fs.readFileSync(actualPolicyPath, 'utf8')).changed_path_policy;
    const sharedPaths = [
      '.github/workflows/platform-ci.yml',
      'package.json',
      'build-scripts/sprints/emit-url-index.js',
    ];

    for (const sharedPath of sharedPaths) expect(actualPolicy.allowed_exact).toContain(sharedPath);
    for (const sharedPath of sharedPaths) expect(actualPolicy.trigger_exact).not.toContain(sharedPath);
    const captureTool = 'build-scripts/sprints/capture-y1-golden-rollout-wave-1-rendered-renewal.js';
    expect(actualPolicy.allowed_exact).toContain(captureTool);
    expect(actualPolicy.trigger_exact).toContain(captureTool);

    for (let mask = 1; mask < (1 << sharedPaths.length); mask += 1) {
      const repo = makeRepo();
      roots.push(repo.root);
      const files = { 'docs/future-authorized-work.md': 'future\n' };
      for (let index = 0; index < sharedPaths.length; index += 1) {
        if (mask & (1 << index)) files[sharedPaths[index]] = `shared ${index}\n`;
      }
      const head = commit(repo.root, files, `shared subset ${mask}`);
      const result = runScopeCli({
        ...repo,
        policyPath: actualPolicyPath,
        head,
        eventMode: 'main_push',
        scopeMode: 'auto',
        env: { Y1_GOLDEN_EVENT_BASE_SHA: repo.base, Y1_GOLDEN_EVENT_HEAD_SHA: head },
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toMatch(/"scope_attestation_triggered": false/);
    }
  });

  test('a Y1-specific trigger still rejects unrelated mixed work', () => {
    const repo = makeRepo();
    roots.push(repo.root);
    const actualPolicyPath = path.resolve(__dirname, '..', '..', 'references', 'data', 'exercises', 'y1-golden-rollout-wave-1.json');
    const head = commit(repo.root, {
      'build-scripts/sprints/check-y1-golden-rollout-wave-1.js': 'y1 repair\n',
      'docs/future-authorized-work.md': 'future\n',
    });
    const result = runScopeCli({
      ...repo,
      policyPath: actualPolicyPath,
      head,
      eventMode: 'main_push',
      scopeMode: 'auto',
      env: { Y1_GOLDEN_EVENT_BASE_SHA: repo.base, Y1_GOLDEN_EVENT_HEAD_SHA: head },
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unexpected committed path changed: docs\/future-authorized-work\.md/);
  });

  test('full mode keeps state checks for unrelated work and rejects rendered-input drift', () => {
    const root = path.resolve(__dirname, '..', '..');
    const base = git(root, ['rev-parse', 'HEAD']);
    const policyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'y1-golden-policy-'));
    roots.push(policyRoot);
    const policyPath = path.join(policyRoot, 'policy.json');
    fs.writeFileSync(policyPath, JSON.stringify({
      changed_path_policy: {
        allowed_exact: ['package.json'],
        allowed_prefixes: ['reports/sprints/Y1-'],
        forbidden_prefixes: ['source-data/', 'engines/'],
        trigger_prefixes: ['reports/sprints/Y1-'],
        trigger_exact: ['package.json'],
      },
    }), 'utf8');

    const unrelatedHead = syntheticCommit(root, base, { 'docs/future-authorized-work.md': 'future\n' });
    const common = {
      repoRoot: root,
      policyFile: policyPath,
      base,
      eventMode: 'main_push',
      scopeMode: 'auto',
      scopeOnly: false,
      allowUnbound: true,
      writeDeltaProof: false,
      writeDeltaProofOnly: false,
      lessonHead: 'f09fd6e88edc5049b026b16b0158e7e188091d2d',
      eventBaseSha: base,
    };
    const unrelated = checker.run({
      ...common,
      head: unrelatedHead,
      eventHeadSha: unrelatedHead,
    });
    expect(unrelated.scope.triggered).toBe(false);
    expect(unrelated.exact_head_delta.rendered_inputs_unchanged).toBe(true);

    const renderedDriftHead = syntheticCommit(root, base, {
      'build-scripts/platform/build-landing-page.js': 'module.exports = { unauthorizedDrift: true };\n',
    });
    expect(() => checker.run({
      ...common,
      head: renderedDriftHead,
      eventHeadSha: renderedDriftHead,
    })).toThrow(/platform rendered inputs changed after reviewed payload/);
  });
});
