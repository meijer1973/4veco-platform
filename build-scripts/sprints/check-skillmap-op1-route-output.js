#!/usr/bin/env node
/**
 * Validate SKILLMAP-OP-1 generated route output.
 *
 * HOW TO ADAPT:
 * - Keep this checker focused on rendered route proof, not broad browser QA.
 * - Add cases when new paragraphs receive explicit skillMapRoutes.
 * - Do not relax internal-code or prohibited-claim checks without updating the
 *   sprint plan and product-boundary rationale.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SkillMapEngine = require('../../engines/skill-map-engine');
const SkillMapRouteUI = require('../../engines/skill-map-route-ui');

const bookRoot = path.resolve(
  process.argv[2] || path.join(__dirname, '..', '..', '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';

const routeCases = [
  {
    par: '1.1.1',
    name: 'Schaarste en economisch denken',
    routeKey: 'reasoning',
    surface: 'reasoning-game',
    page: '1.1.1 Schaarste en economisch denken \u2013 redeneer-spel.html',
    expected: ['Schaarste als kerneconomisch probleem', 'Alternatieve kosten in een keuze-situatie']
  },
  {
    par: '1.1.2',
    name: 'Percentages en indexcijfers',
    routeKey: 'reasoning',
    surface: 'reasoning-game',
    page: '1.1.2 Percentages en indexcijfers \u2013 redeneer-spel.html',
    expected: ['Procentuele verandering berekenen', 'Prijsindex (CPI) berekenen']
  },
  {
    par: '1.1.2',
    name: 'Percentages en indexcijfers',
    routeKey: 'calculation',
    surface: 'calculation-game',
    page: '1.1.2 Percentages en indexcijfers \u2013 wiskundevaardigheden.html',
    expected: ['Procentuele verandering berekenen', 'Prijsindex (CPI) berekenen']
  },
  {
    par: '1.1.2',
    name: 'Percentages en indexcijfers',
    routeKey: 'graphical',
    surface: 'graphical-game',
    page: '1.1.2 Percentages en indexcijfers \u2013 grafiekenspel.html',
    expected: ['Waarden aflezen uit staafdiagram', 'Waarden aflezen uit lijngrafiek']
  },
  {
    par: '1.1.3',
    name: 'Grafieken en tabellen',
    routeKey: 'reasoning',
    surface: 'reasoning-game',
    page: '1.1.3 Grafieken en tabellen \u2013 redeneer-spel.html',
    expected: ['Tabelwaarden selecteren voor berekening', 'Waarden aflezen uit staafdiagram']
  },
  {
    par: '1.1.3',
    name: 'Grafieken en tabellen',
    routeKey: 'calculation',
    surface: 'calculation-game',
    page: '1.1.3 Grafieken en tabellen \u2013 wiskundevaardigheden.html',
    expected: ['Tabelwaarden selecteren voor berekening', 'Procentuele verandering berekenen']
  },
  {
    par: '1.1.3',
    name: 'Grafieken en tabellen',
    routeKey: 'graphical',
    surface: 'graphical-game',
    page: '1.1.3 Grafieken en tabellen \u2013 grafiekenspel.html',
    expected: ['Tabelwaarden selecteren voor berekening', 'Waarden aflezen uit lijngrafiek']
  }
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireFresh(filePath) {
  const resolved = require.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function loadSkillTreeData(par) {
  const filePath = path.join(bookRoot, 'shared', 'skilltree', `${par}.js`);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(filePath), context, { filename: filePath });
  return context.window.SKILL_TREE_DATA;
}

function paragraphPagePath(testCase) {
  return path.join(
    bookRoot,
    CHAPTER,
    `${testCase.par} ${testCase.name}`,
    testCase.page
  );
}

function visibleText(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function checkNoStudentCodeLeak(text, label) {
  assert(!/\b[A-Z]\d{2}\b/.test(text), `${label}: visible route leaks internal MTU code`);
}

function checkNoProductClaim(text, label) {
  const prohibited = /beheerst|meesterschap|summatief|\bcijfer\b|cijfer geven|permanente beheersing|adaptieve route|Je hebt laten zien dat je de eindopgave/i;
  assert(!prohibited.test(text), `${label}: visible route contains prohibited product claim`);
}

function main() {
  const basePath = path.join(bookRoot, 'shared', 'skilltree', 'base-elements.js');
  const elements = requireFresh(basePath);
  assert(Array.isArray(elements.SKILLS), 'Generated base-elements.js must export SKILLS');
  assert(Array.isArray(elements.ROUTE_SKILLS), 'Generated base-elements.js must export ROUTE_SKILLS');
  assert(!elements.SKILLS.some(skill => skill.id === 'B01'), 'B01 must not become a runnable skill-tree exercise');
  assert(elements.ROUTE_SKILLS.some(skill => skill.id === 'B01'), 'B01 must be available for route display');
  assert(elements.ROUTE_SKILLS.some(skill => skill.id === 'B02'), 'B02 must be available for route display');

  for (const testCase of routeCases) {
    const data = loadSkillTreeData(testCase.par);
    assert(data && data.skillMapRoutes, `${testCase.par}: missing skillMapRoutes`);
    assert(data.skillMapRoutes[testCase.routeKey], `${testCase.par} ${testCase.routeKey}: missing route config`);

    const routeOptions = SkillMapRouteUI.getRouteOptions(
      testCase.routeKey,
      { mode: 'compact', maxVisibleAvailable: 3 },
      data
    );
    assert(routeOptions.enabled !== false, `${testCase.par} ${testCase.routeKey}: route is disabled`);
    assert(routeOptions.paragraphTarget, `${testCase.par} ${testCase.routeKey}: missing paragraph target`);
    assert(routeOptions.practiceHref, `${testCase.par} ${testCase.routeKey}: missing practice link`);

    const request = SkillMapEngine.createRequest(testCase.surface, {
      paragraph: testCase.par,
      ...routeOptions
    });
    const html = SkillMapRouteUI.renderRequest(request, {
      elements,
      data,
      stars: {},
      ...routeOptions
    });
    const text = visibleText(html);
    assert(html.includes('skill-map-route-item'), `${testCase.par} ${testCase.routeKey}: no route items rendered`);
    assert(!text.includes('Deze route is nog niet gevuld'), `${testCase.par} ${testCase.routeKey}: route is empty`);
    assert(text.includes('Paragraafdoel'), `${testCase.par} ${testCase.routeKey}: paragraph target is not visible`);
    assert(text.includes('Focus:'), `${testCase.par} ${testCase.routeKey}: recommended focus is not visible`);
    assert(text.includes('Alleen lokale oefenvoortgang'), `${testCase.par} ${testCase.routeKey}: boundary copy missing`);
    assert(html.includes(`href="${routeOptions.practiceHref}"`), `${testCase.par} ${testCase.routeKey}: practice link not rendered`);
    for (const expected of testCase.expected) {
      assert(text.includes(expected), `${testCase.par} ${testCase.routeKey}: missing expected route label: ${expected}`);
    }
    checkNoStudentCodeLeak(text, `${testCase.par} ${testCase.routeKey}`);
    checkNoProductClaim(text, `${testCase.par} ${testCase.routeKey}`);

    const pageText = read(paragraphPagePath(testCase));
    assert(pageText.includes('skill-map-route.css'), `${testCase.page}: missing shared route CSS`);
    assert(pageText.includes('skill-map-route-ui.js'), `${testCase.page}: missing shared route UI script`);
    assert(pageText.includes('skill-map-engine.js'), `${testCase.page}: missing shared route engine script`);
  }

  console.log(`SKILLMAP-OP-1 route output OK (${routeCases.length} routes checked)`);
}

try {
  main();
} catch (error) {
  console.error(`SKILLMAP-OP-1 route output check failed: ${error.message}`);
  process.exit(1);
}
