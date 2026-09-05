// HOW TO ADAPT: use a new exact approved target/plan checkpoint; no source writes.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../..'), lessons = path.resolve(root, '../4veco-lessen');
assert.equal(root.replaceAll('\\', '/'), 'C:/wt/book2-part-a-production-20260905/4veco-platform');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const raw = p => fs.readFileSync(p), lf = p => raw(p).toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
const prefix = path.join(root, 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-');
assert.equal(sha(lf(prefix + 'successor-binding-plan.md')), '8acf6dd53026710b28f9130701bc9211b95a51897ee74f7fb4bf6583ef69cf8c');
assert.equal(sha(raw(prefix + 'successor-binding-r2-independent-review.md')), '27439df12c6c47f39318e42c79ebebc2c1b8b93dfefe444ac1f4edc2dcfed8c6');
const work = lf(prefix + '223-successor-work-order.md');
const next = lf(prefix + 'remaining-paragraph-dispatch-plan.md');
const source223 = lf(path.join(root, 'build-scripts/content/book-2/b2_223.py'));
const prior = path.join(lessons, 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit');
const pins = [
  ['2.2.1-textbook-handoff.md', '216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c', '3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811'],
  ['2.2.1-review.md', '24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb', '19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63'],
  ['2.2.1-quality-ref.yaml', 'b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508', '4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa'],
  ['2.2.1 Prijselasticiteit – paragraaf.md', 'e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281', 'ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db']
];
for (const [file, old, current] of pins) {
  assert.equal(source223.split(`"${file}": "${old}"`).length, 2);
  assert.equal(sha(raw(path.join(prior, file))), current);
  assert.equal(sha(lf(path.join(prior, file))), current);
  assert.ok(work.includes(`|${file}|${old}|${current}|`));
}
const registry = JSON.parse(raw(path.join(root, 'references/authored/course-target-exercises.json')));
const targetPins = {
  '2.1.4': 'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691',
  '2.2.4': '4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519',
  '2.3.4': '2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c'
};
for (const [id, pin] of Object.entries(targetPins)) {
  const matches = registry.exercises.filter(e => e.id === id);
  assert.equal(matches.length, 1); const e = matches[0];
  assert.equal(sha(JSON.stringify(e)), pin); assert.ok(next.includes(pin));
  assert.equal(e.introduces_new_theory, false); assert.equal(e.mixed_target_profile.no_new_theory, true);
  assert.deepEqual(e.new_skills_introduced, []); assert.equal(e.lesson_goals.length, 4);
  assert.equal(e.target_exercise.subquestions.length, 6);
  assert.equal(e.target_exercise.subquestions.reduce((n, q) => n + q.points, 0), 14);
  assert.equal(e.record_status, 'candidate_review_ready');
}
// Independent calculations from the just-read frozen cases, not generated answers.
const qBE = 1200 / (5 - 2), normalProfit = 5 * 700 - (1200 + 2 * 700);
assert.equal(qBE, 400); assert.equal(normalProfit, 900);
assert.equal((2600 / 700).toFixed(2), '3.71');
const costs = [2600, 2900, 3250, 3650], revenues = [3500, 4000, 4500, 5000];
const mk = costs.slice(1).map((v, i) => (v - costs[i]) / 100);
const mo = revenues.slice(1).map((v, i) => (v - revenues[i]) / 100);
assert.deepEqual(mk, [3, 3.5, 4]); assert.deepEqual(mo, [5, 5, 5]);
const growth = mo.map((v, i) => v - mk[i]); assert.deepEqual(growth, [2, 1.5, 1]);
assert.ok(growth.every(v => v < 5 - 2)); assert.deepEqual(growth.map(v => v * 100), [200, 150, 100]);
const revenueOld = 10 * 50000, revenueNew = 12 * 43000;
assert.deepEqual([revenueOld, revenueNew, revenueNew - revenueOld], [500000, 516000, 16000]);
assert.equal(15 / 8, 1.875); assert.equal(-4 / 8, -0.5);
assert.equal((9 - 8) / 8 * 100, 12.5); assert.equal(5 / 12.5, 0.4);
const demand = income => 12000 - 400 * 12 + 0.1 * income + 300 * 10;
assert.deepEqual([demand(40000), demand(42000)], [14200, 14400]);
const qe = (80 - 20) / 1.5, pe = 80 - qe;
const cs = 0.5 * qe * (80 - pe), ps = 0.5 * qe * (pe - 20);
assert.deepEqual([qe, pe, cs, ps, cs + ps], [40, 40, 800, 400, 1200]);
const restrictedQ = 30, fixedPrice = 45, wtp = 80 - restrictedQ, mc = 20 + 0.5 * restrictedQ;
const restrictedCS = restrictedQ * (wtp - fixedPrice) + 0.5 * restrictedQ * (80 - wtp);
const restrictedPS = restrictedQ * (fixedPrice - mc) + 0.5 * restrictedQ * (mc - 20);
assert.deepEqual([80 - fixedPrice, (fixedPrice - 20) / 0.5, restrictedCS, restrictedPS], [35, 50, 600, 525]);
const loss = cs + ps - restrictedCS - restrictedPS;
assert.equal(loss, 75); assert.equal(0.5 * (qe - restrictedQ) * (wtp - mc), loss);
assert.ok(80 - 31 > fixedPrice && fixedPrice > 20 + 0.5 * 31);
assert.ok(restrictedPS > ps && restrictedCS + restrictedPS < cs + ps);
console.log(JSON.stringify({result: 'PASS', task: 'root coordination only; no pupil authoring, repin or acceptance',
  work_order_sha256: sha(raw(prefix + '223-successor-work-order.md')),
  dispatch_plan_sha256: sha(raw(prefix + 'remaining-paragraph-dispatch-plan.md')),
  accepted_221_inputs: pins.map(([file, previous, accepted]) => ({file, previous, accepted, raw_equals_LF: true})),
  frozen_mixed_targets: targetPins, points_each: 14, new_theory: false,
  independent_arithmetic: {SmoothBox: {qBE, normalProfit, GTK_exact: '26/7', mk, mo, growth},
    StreamPlus: {revenueOld, revenueNew, PremiumEi: '15/8', BudgetEi: '-1/2', Ek: '2/5', Q: [demand(40000), demand(42000)]},
    bicycles: {qe, pe, cs, ps, restrictedCS, restrictedPS, loss, first_new_trade_WTP: 49, first_new_trade_MC: 35.5}},
  full_223_generation: 'NOT_RUN: this is the pre-change work order; distinct builder must execute S1',
  future_paragraph_plans: 'Require their own distinct builder and independent review', inventory_total: 41}, null, 2));
