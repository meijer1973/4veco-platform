'use strict';

const { durableLifecycleState, findFailures, readInputs } = require('./check-book2-target-authority-remediation');
const { approvalBlockLifecycleMode } = require('./check-book2-candidate-approval-block');

let baseline;

beforeAll(() => { baseline = readInputs(); });

function clone() {
  return structuredClone(baseline);
}

function expectFailure(input, fragment) {
  expect(findFailures(input)).toEqual(expect.arrayContaining([expect.stringContaining(fragment)]));
}

function candidate(input, id) {
  return input.candidates.find((item) => item.id === id);
}

describe('Book 2 target authority remediation contract', () => {
  test('the exact twelve-record candidate package passes', () => {
    expect(findFailures(clone())).toEqual([]);
  });

  test('rejects a registry that differs from the exact candidate package', () => {
    const input = clone();
    input.registry.exercises.find((item) => item.id === '2.1.1').lesson_goals[0] += ' Gewijzigd.';
    expectFailure(input, 'active registry Book 2 records must exactly equal');
  });

  test('rejects candidate approval data before an owner decision', () => {
    const input = clone();
    input.meta.holds.find((hold) => hold.id === 'H-229-211-CANDIDATE').candidate_binding.approved_by = 'invented-owner';
    expectFailure(input, 'candidate approval fields must stay null');
  });

  test('rejects incomplete candidate hold coverage and stale package hashes', () => {
    const input = clone();
    input.meta.holds = input.meta.holds.filter((hold) => hold.id !== 'H-229-214-CANDIDATE');
    expectFailure(input, 'candidate holds must cover all twelve');

    const stale = clone();
    stale.alignment.candidate_package_sha256 = 'a'.repeat(64);
    expectFailure(stale, 'alignment candidate package hash is stale');
  });

  test('protects the historical released 2.1.1 binding and evidence', () => {
    const input = clone();
    input.meta.holds.find((hold) => hold.id === 'H-211-TARGET-INTEGRATION').release_evidence.subject_sha256 = 'a'.repeat(64);
    expectFailure(input, 'historical released 2.1.1 target binding/evidence changed');
  });

  test('proves non-Book-2 records and machine units outside A17 are unchanged', () => {
    const registryInput = clone();
    registryInput.registry.exercises.find((item) => item.module !== 2).difficulty = 'MUTATED';
    expectFailure(registryInput, 'a non-Book-2 target record changed');

    const unitInput = clone();
    const units = unitInput.units.units || unitInput.units;
    units.find((unit) => unit.id !== 'A17').name += ' mutated';
    expectFailure(unitInput, 'changed outside A17 scope');
  });

  test('durable CI mode does not freeze unrelated data and retires after the candidate transition', () => {
    const futureUnrelated = clone();
    futureUnrelated.registry.exercises.find((item) => item.module !== 2).difficulty = 'FUTURE_REVIEWED_VALUE';
    const futureUnits = futureUnrelated.units.units || futureUnrelated.units;
    futureUnits.find((unit) => unit.id !== 'A17').name += ' future reviewed update';
    expect(findFailures(futureUnrelated, { durable: true })).toEqual([]);

    const transitioned = clone();
    transitioned.meta.issue_229_candidate = {
      ...transitioned.meta.issue_229_candidate,
      status: 'integrated',
      approval_status: 'integrated',
      integrated_commit: 'a'.repeat(40),
      integration_evidence_ref: 'https://github.com/meijer1973/4veco-platform/pull/230',
    };
    for (const hold of transitioned.meta.holds.filter((item) => item.candidate_binding)) {
      const binding = hold.candidate_binding;
      hold.status = 'released';
      hold.target_binding = {
        blocked_baseline_sha256: binding.blocked_baseline_sha256,
        approved_replacement_sha256: binding.candidate_replacement_sha256,
        approval_ref: 'https://github.com/meijer1973/4veco-platform/issues/229#issuecomment-owner-approval',
        approved_by: 'owner@example.test',
        approved_on: '2026-09-05',
      };
      delete hold.candidate_binding;
      hold.release_evidence = {
        resolved_via: 'target_authority_integration',
        released_by: 'owner@example.test',
        released_on: '2026-09-05',
        evidence_ref: 'https://github.com/meijer1973/4veco-platform/pull/230',
        subject_id: hold.scope.find((scope) => scope.startsWith('paragraph:')).slice('paragraph:'.length),
        subject_sha256: hold.target_binding.approved_replacement_sha256,
        integrated_commit: 'a'.repeat(40),
      };
    }
    const transitionedEiHold = transitioned.meta.holds.find((hold) => hold.id === 'H-229-EI-SUPERSESSION');
    transitionedEiHold.status = 'released';
    transitionedEiHold.release_evidence = {
      resolved_via: 'outline_owner_decision',
      released_by: 'owner@example.test',
      released_on: '2026-09-05',
      evidence_ref: 'https://github.com/meijer1973/4veco-platform/issues/229#issuecomment-outline-owner-decision',
    };
    transitioned.registry.exercises.find((item) => item.id === '2.1.1').lesson_goals[0] += ' Later governed revision.';
    expect(findFailures(transitioned, { durable: true })).toEqual([]);
    expect(durableLifecycleState(transitioned.meta)).toEqual({ mode: 'retired', failures: [] });
    expect(approvalBlockLifecycleMode(transitioned.meta)).toBe('retired');

    const openEiSupersession = structuredClone(transitioned);
    const openEiHold = openEiSupersession.meta.holds.find((hold) => hold.id === 'H-229-EI-SUPERSESSION');
    openEiHold.status = 'open';
    openEiHold.release_evidence = null;
    expect(findFailures(openEiSupersession, { durable: true })).toEqual(expect.arrayContaining([
      expect.stringContaining('requires a released Ei supersession hold'),
    ]));
    expect(() => approvalBlockLifecycleMode(openEiSupersession.meta)).toThrow('requires a released Ei supersession hold');

    const invalidEiEvidence = structuredClone(transitioned);
    invalidEiEvidence.meta.holds.find((hold) => hold.id === 'H-229-EI-SUPERSESSION').release_evidence.resolved_via = 'target_authority_integration';
    expect(findFailures(invalidEiEvidence, { durable: true })).toEqual(expect.arrayContaining([
      expect.stringContaining('requires valid outline-owner-decision evidence'),
    ]));
    expect(() => approvalBlockLifecycleMode(invalidEiEvidence.meta)).toThrow('requires valid outline-owner-decision evidence');

    const wrongPackage = structuredClone(transitioned);
    wrongPackage.meta.issue_229_candidate.package_sha256 = 'b'.repeat(64);
    expect(findFailures(wrongPackage, { durable: true })).toEqual(expect.arrayContaining([
      expect.stringContaining('requires the exact reviewed package hash'),
    ]));
    expect(() => approvalBlockLifecycleMode(wrongPackage.meta)).toThrow('requires the exact reviewed package hash');

    for (const invalidStatus of ['typo', null, undefined]) {
      const invalid = clone();
      if (invalidStatus === undefined) delete invalid.meta.issue_229_candidate.approval_status;
      else invalid.meta.issue_229_candidate.approval_status = invalidStatus;
      expect(findFailures(invalid, { durable: true })).toEqual(expect.arrayContaining([
        expect.stringContaining('approval_status must be pending or integrated'),
      ]));
      expect(() => approvalBlockLifecycleMode(invalid.meta)).toThrow('approval_status must be pending or integrated');
    }

    const incompleteTerminal = clone();
    incompleteTerminal.meta.issue_229_candidate.approval_status = 'integrated';
    expect(findFailures(incompleteTerminal, { durable: true })).toEqual(expect.arrayContaining([
      expect.stringContaining('durable terminal state requires status integrated'),
      expect.stringContaining('durable terminal state requires a full integrated_commit'),
      expect.stringContaining('durable terminal state requires a released target binding'),
    ]));
    expect(() => approvalBlockLifecycleMode(incompleteTerminal.meta)).toThrow('durable terminal state');
  });

  test('rejects the stale Ei category and invented boundary classifications', () => {
    const staleTerm = clone();
    const units = staleTerm.units.units || staleTerm.units;
    units.find((unit) => unit.id === 'A17').procedure[2] = 'Ei tussen nul en één is een noodzakelijk goed.';
    expectFailure(staleTerm, 'canonical three-way Ei route');

    const boundary = clone();
    const boundaryUnits = boundary.units.units || boundary.units;
    boundaryUnits.find((unit) => unit.id === 'A17').procedure[2] = boundaryUnits.find((unit) => unit.id === 'A17').procedure[2].replace('Ei = 0 en Ei = 1 zijn grenswaarden', 'Ei = 0 is normaal en Ei = 1 is luxe');
    expectFailure(boundary, 'preserve Ei=0 and Ei=1 as explicit boundaries');
  });

  test('scopes forbidden-language detection to student-facing candidate fields', () => {
    const input = clone();
    candidate(input, '2.2.3').target_exercise.subquestions[0].prompt = 'Calculate Ei en noem dit een noodzakelijk goed.';
    expectFailure(input, 'English instruction verb');
    expectFailure(input, 'forbidden Ei category noodzakelijk');
  });

  test('rejects forbidden pseudo-terms, stale notation, and unsupported surplus shapes', () => {
    const production = clone();
    candidate(production, '2.1.1').target_exercise.context += ' Binnen dit productiegebied.';
    expectFailure(production, 'forbidden pseudo-term productiegebied');

    const cross = clone();
    candidate(cross, '2.2.3').target_exercise.context = candidate(cross, '2.2.3').target_exercise.context.replace(/\bEk\b/g, 'Ekr');
    expectFailure(cross, 'authored Ek notation');

    const surplus = clone();
    candidate(surplus, '2.3.4').short_answer_model['3'] = 'PS is een trapezium van €525.';
    expectFailure(surplus, 'only rectangles and triangles');
  });

  test('rejects hidden answer work and non-bidirectional goal/question alignment', () => {
    const hidden = clone();
    delete candidate(hidden, '2.1.2').short_answer_model.d;
    expectFailure(hidden, 'short answer labels must exactly match');

    const unmapped = clone();
    unmapped.alignment.records.find((item) => item.id === '2.1.4').operations[2].questions = [];
    expectFailure(unmapped, 'operation has no visible question');
    expectFailure(unmapped, 'not every point-bearing question maps back to a goal');

    const missingGoal = clone();
    missingGoal.alignment.records.find((item) => item.id === '2.1.2').operations.pop();
    expectFailure(missingGoal, 'not every lesson goal maps to an operation');
  });

  test('rejects table work hidden outside the point-bearing prompts', () => {
    const input = clone();
    const record = candidate(input, '2.1.3');
    record.target_exercise.subquestions.find((question) => question.label === 'a').prompt = 'Bekijk tabel Linea.';
    record.target_exercise.subquestions.find((question) => question.label === 'd').prompt = 'Bekijk tabel Curva.';
    expectFailure(input, 'visible Linea table-completion action');
    expectFailure(input, 'visible Curva interval-table action');
  });

  test('rejects incomplete operation evidence and excessive workload', () => {
    const evidence = clone();
    delete evidence.alignment.records[0].operations[0].source_sufficiency;
    expectFailure(evidence, 'each alignment operation requires exact evidence fields');

    const workload = clone();
    workload.alignment.records.find((item) => item.id === '2.2.3').estimated_minutes = 13;
    expectFailure(workload, 'workload estimate is outside its budget');

    const questionTimes = clone();
    questionTimes.alignment.records.find((item) => item.id === '2.1.2').question_time_minutes.d = 4;
    expectFailure(questionTimes, 'question-time budget must sum to estimated_minutes');

    const missingTime = clone();
    delete missingTime.alignment.records.find((item) => item.id === '2.1.2').question_time_minutes.d;
    expectFailure(missingTime, 'question-time labels must exactly match');

    const missingActions = clone();
    delete missingActions.alignment.records.find((item) => item.id === '2.1.2').question_budgets;
    expectFailure(missingActions, 'action budgets must exactly cover');

    const labelDrift = clone();
    labelDrift.alignment.records.find((item) => item.id === '2.1.2').question_budgets[0].label = 'x';
    expectFailure(labelDrift, 'action budgets must exactly cover');

    const minuteDrift = clone();
    minuteDrift.alignment.records.find((item) => item.id === '2.1.2').question_budgets[0].minutes = 3;
    expectFailure(minuteDrift, 'action-budget minutes differ');

    const pointDrift = clone();
    pointDrift.alignment.records.find((item) => item.id === '2.1.2').question_budgets[0].points = 3;
    expectFailure(pointDrift, 'action-budget points differ');

    const emptyActions = clone();
    emptyActions.alignment.records.find((item) => item.id === '2.1.2').question_budgets[0].observable_actions = [];
    expectFailure(emptyActions, 'observable actions are missing');

    const addedAction = clone();
    addedAction.alignment.records.find((item) => item.id === '2.1.2').question_budgets[0].observable_actions.push('voegt een extra onbegrote conclusie toe');
    expectFailure(addedAction, 'observable actions exceed available points');

    const points = clone();
    candidate(points, '2.1.1').target_exercise.subquestions[0].points = 5;
    expectFailure(points, 'four-point maximum');
  });

  test('rejects mixed-target overload and a complete graph-from-scratch instruction', () => {
    const overload = clone();
    const record = candidate(overload, '2.3.4');
    record.target_exercise.subquestions.push({ label: '7', points: 1, prompt: 'Extra vraag.' });
    record.short_answer_model['7'] = 'Extra antwoord.';
    expectFailure(overload, 'mixed target requires four to six questions');

    const graph = clone();
    candidate(graph, '2.3.4').target_exercise.subquestions[3].prompt = 'Teken de vraag- en aanbodlijn volledig opnieuw en arceer het verlies.';
    expectFailure(graph, 'may not require a complete graph from scratch');

    const points = clone();
    candidate(points, '2.2.4').target_exercise.subquestions[0].points = 3;
    expectFailure(points, 'at least 80%');
  });

  test('rejects placeholder and structurally empty mixed-target sources', () => {
    const input = clone();
    const sources = candidate(input, '2.3.4').target_exercise.sources;
    for (const source of sources) {
      source.content = 'Bron volgt.';
      if (source.type === 'table') source.rows = [];
    }
    expectFailure(input, 'placeholder or empty source content');
    expectFailure(input, 'table requires concrete rows');
  });

  test('compares the human and machine alignment maps', () => {
    const input = clone();
    input.alignmentMarkdown = input.alignmentMarkdown.replace('Machine map: goal 1 → a,b; goal 2 → c; goal 3 → d; goal 4 → d', 'Machine map: stale');
    expectFailure(input, 'alignment Markdown goal/question map is stale');
  });

  test('rejects the stale dependency and incorrect break-even representation', () => {
    const dependency = clone();
    candidate(dependency, '2.1.2').target_exercise.context = 'Gebruik de bakkerij uit §1.3.2.';
    expectFailure(dependency, 'stale Book 1 bakery dependency');

    const breakEven = clone();
    candidate(breakEven, '2.1.2').short_answer_model.c = 'Break-even is 714 broden.';
    expectFailure(breakEven, 'continuous break-even');
    expectFailure(breakEven, 'whole-unit break-even');

    const graph = clone();
    candidate(graph, '2.1.2').short_answer_model.d = 'De winst is een gearceerde oppervlakte van €200.';
    expectFailure(graph, 'profit as vertical distance');
  });

  test('rejects a raw table difference and formal output-choice drift', () => {
    const delta = clone();
    candidate(delta, '2.1.3').short_answer_model.b = 'MK=230−200=€30.';
    expectFailure(delta, 'explicit Delta Q denominator');

    const outputChoice = clone();
    candidate(outputChoice, '2.1.3').target_exercise.subquestions[4].prompt = 'Bepaal met MO=MK de winstmaximaliserende afzet.';
    expectFailure(outputChoice, 'output-choice boundary');

    const leakedAnswers = clone();
    candidate(leakedAnswers, '2.1.3').target_exercise.subquestions[3].prompt = 'Bereken MK en vul MK=€5, €15 en €25 in.';
    expectFailure(leakedAnswers, 'expected Curva MK answers leak');
  });

  test('rejects stale elasticity codes and missing numerical contrast', () => {
    const code = clone();
    candidate(code, '2.2.1').exam_codes = ['A2.4', 'A2.5', 'D1.3'];
    expectFailure(code, 'stale exam code D1.3');

    const contrast = clone();
    candidate(contrast, '2.2.1').short_answer_model.c = 'Ev=−0,8.';
    expectFailure(contrast, 'elastic contrast');

    const percentagePoints = clone();
    candidate(percentagePoints, '2.2.3').exam_codes.push('A2.5');
    expectFailure(percentagePoints, 'A2.5 may not be claimed');
  });

  test('rejects missing total-cost and normal-good operations in point-bearing prompts', () => {
    const totalCost = clone();
    candidate(totalCost, '2.1.1').target_exercise.subquestions.find((question) => question.label === 'e').prompt = 'Leg de gemiddelde kosten uit.';
    expectFailure(totalCost, 'visible total-cost comparison');

    const normalGood = clone();
    candidate(normalGood, '2.2.3').target_exercise.subquestions.find((question) => question.label === 'd').prompt = 'Bereken beide functiewaarden en noem de richting.';
    expectFailure(normalGood, 'visible normal-good Ei operation');
  });

  test('rejects demand-only equilibrium wording', () => {
    const input = clone();
    candidate(input, '2.3.1').target_exercise.subquestions[0].prompt = 'Bereken de evenwichtshoeveelheid bij P=€20.';
    expectFailure(input, 'demand-only wording');
  });

  test('rejects unbounded supply-as-MC and social-welfare claims', () => {
    const supply = clone();
    candidate(supply, '2.3.2').target_exercise.context = 'De aanbodlijn is altijd gelijk aan marginale kosten.';
    expectFailure(supply, 'bounded supply-as-MC');

    const welfare = clone();
    candidate(welfare, '2.3.2').short_answer_model.e = 'Daarom is dit altijd de beste maatschappelijke uitkomst.';
    expectFailure(welfare, 'social-welfare boundary');
  });

  test('rejects an incomplete Pareto transaction chain', () => {
    const definition = clone();
    candidate(definition, '2.3.3').short_answer_model.a = 'De uitkomst is efficiënt.';
    expectFailure(definition, 'Pareto definition');

    const transactions = clone();
    candidate(transactions, '2.3.3').short_answer_model.b = 'Bij P=25 zijn er 40 kaartjes.';
    expectFailure(transactions, 'strictly binding transaction chain');
  });

  test('rejects a non-binding limit, missing Pareto feasibility, and the unbounded finite-change rule', () => {
    const binding = clone();
    candidate(binding, '2.3.4').short_answer_model['3'] = candidate(binding, '2.3.4').short_answer_model['3'].replace('Qd=35 en Qs=50', 'Qd=30 en Qs=30');
    expectFailure(binding, 'strictly binding transaction chain');

    const pareto = clone();
    candidate(pareto, '2.3.3').target_exercise.context = candidate(pareto, '2.3.3').target_exercise.context.replace('kosteloos verruimbare reserveringsregel', 'harde fysieke capaciteitsgrens');
    expectFailure(pareto, 'removable rule');

    const revenue = clone();
    candidate(revenue, '2.2.2').short_answer_model.e = 'Bij inelastische vraag stijgt omzet altijd.';
    expectFailure(revenue, 'local revenue rule boundary');
  });

  test('rejects semantically invalid or missing skill links', () => {
    const invalid = clone();
    candidate(invalid, '2.3.3').required_skills.push('A32');
    expectFailure(invalid, 'semantically invalid required skill A32');

    const missing = clone();
    candidate(missing, '2.3.4').required_skills = candidate(missing, '2.3.4').required_skills.filter((skill) => skill !== 'D20');
    expectFailure(missing, 'required skill D20 is missing');

    const wrongRevenueUnit = clone();
    candidate(wrongRevenueUnit, '2.2.2').required_skills.push('D25');
    expectFailure(wrongRevenueUnit, 'D25 must not be cited');

    const missingPrerequisite = clone();
    candidate(missingPrerequisite, '2.2.3').required_skills = candidate(missingPrerequisite, '2.2.3').required_skills.filter((skill) => skill !== 'A15');
    expectFailure(missingPrerequisite, 'required skill A15 is missing');

    const missingFunctionRoute = clone();
    candidate(missingFunctionRoute, '2.2.4').required_skills = candidate(missingFunctionRoute, '2.2.4').required_skills.filter((skill) => skill !== 'D27');
    expectFailure(missingFunctionRoute, 'required skill D27 is missing');
  });

  test('rejects incorrect surplus anchors', () => {
    for (const [id, label, fragment] of [
      ['2.3.1', 'd', 'CS area'],
      ['2.3.2', 'c', 'CS/PS'],
      ['2.3.3', 'd', 'DWL'],
      ['2.3.4', '4', 'DWL'],
    ]) {
      const input = clone();
      candidate(input, id).short_answer_model[label] = 'De uitkomst is €0.';
      const failures = findFailures(input);
      expect(failures.some((failure) => failure.includes(id))).toBe(true);
      expect(failures.length).toBeGreaterThan(0);
    }
  });
});
