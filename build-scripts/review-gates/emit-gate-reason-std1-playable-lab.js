#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-REASON-STD-1-reasoning-unified-task-shell-human-evidence-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const OUT_HTML = path.join(GATE_DIR, 'gate-playable-reasoning-lab.html');
const OUT_DATA = path.join(GATE_DIR, 'gate-playable-reasoning-data.json');
const BOOK_ROOT = path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');

const ReasoningEngine = require(path.join(ROOT, 'engines', 'reasoning-engine.js'));
const TaskShellEngine = require(path.join(ROOT, 'engines', 'task-shell-engine.js'));

const CASES = [
  {
    id: 'play-p111-mode0-order',
    paragraph: '1.1.1',
    mode: 0,
    title: '1.1.1 mode 0 - Stappen ordenen',
    reviewIssue: 'Proves local shared-shell step_ordering practice.',
  },
  {
    id: 'play-p112-mode1-claim-route',
    paragraph: '1.1.2',
    mode: 1,
    title: '1.1.2 mode 1 - Deelvragen opbouwen',
    reviewIssue: 'Proves claim-reason-evidence as a step_ordering bridge.',
  },
  {
    id: 'play-p113-mode3-flow-bridge',
    paragraph: '1.1.3',
    mode: 3,
    title: '1.1.3 mode 3 - Stroomdiagram bouwen bridge',
    reviewIssue: 'Proves ordered-chain bridge only; not full visual flow construction.',
  },
  {
    id: 'play-p112-mode5-self-check',
    paragraph: '1.1.2',
    mode: 5,
    title: '1.1.2 mode 5 - Redeneerantwoord opbouwen',
    reviewIssue: 'Proves structured_reasoning self-check only; not evaluated answer-quality proof.',
    selfCheckAnswer:
      'De index stijgt van 108 naar 112. Dat is 4 indexpunten. Voor procentuele stijging deel je door de oude index 108, dus ongeveer 3,7 procent.',
  },
];

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function loadReasoningSource(paragraph) {
  const sourceCsv = path.join(ROOT, 'source-data', 'book-1', 'reasoning', `${paragraph}.csv`);
  if (fs.existsSync(sourceCsv)) {
    return {
      csv: readText(sourceCsv),
      domain: 'economics',
      provenance: 'platform_source_csv',
      sourcePath: rel(sourceCsv),
    };
  }

  const generatedJs = path.join(BOOK_ROOT, 'shared', 'reasoning', `${paragraph}.js`);
  if (!fs.existsSync(generatedJs)) {
    throw new Error(`No reasoning source or generated data found for ${paragraph}`);
  }
  const sandbox = {};
  vm.runInNewContext(readText(generatedJs), sandbox, { filename: generatedJs });
  if (!sandbox.REASONING_CSV || !sandbox.REASONING_META) {
    throw new Error(`Generated reasoning data did not expose REASONING_CSV/REASONING_META: ${generatedJs}`);
  }
  return {
    csv: sandbox.REASONING_CSV,
    domain: sandbox.REASONING_META.domain || 'economics',
    provenance: 'generated_lesson_reasoning_data',
    sourcePath: path.relative(ROOT, generatedJs).replace(/\\/g, '/'),
  };
}

function withDeterministicRandom(callback) {
  const originalRandom = Math.random;
  let seed = 91021;
  Math.random = function deterministicRandom() {
    seed = (seed * 48271) % 0x7fffffff;
    return seed / 0x7fffffff;
  };
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function collectCase(config) {
  const source = loadReasoningSource(config.paragraph);
  const round = withDeterministicRandom(() => {
    const engine = new ReasoningEngine({
      csvString: source.csv,
      domain: source.domain,
      parNr: config.paragraph,
      roundsPerGame: 1,
    });
    engine.startGame(config.mode);
    return engine.getRound();
  });
  if (!round.taskShellTask) {
    throw new Error(`${config.paragraph} mode ${config.mode} did not produce taskShellTask`);
  }
  const task = clone(round.taskShellTask);
  task.id = config.id;
  task.practiceRoute = { label: 'Review-only routeplaceholder', href: '#review-only' };
  TaskShellEngine.validateTask(task);

  const completionStates = task.family === 'structured_reasoning' ? ['self_check'] : ['matched'];
  const correctResponse =
    task.family === 'structured_reasoning'
      ? config.selfCheckAnswer || 'Oorzaak, tussenstap en conclusie.'
      : { order: clone(task.expected.order || []) };

  return {
    id: config.id,
    paragraph: config.paragraph,
    mode: config.mode,
    title: config.title,
    reviewIssue: config.reviewIssue,
    provenance: source.provenance,
    sourcePath: source.sourcePath,
    domain: source.domain,
    standardFamily: clone(round.standardFamily || null),
    scaffold: round.answerFormScaffold ? clone(round.answerFormScaffold) : null,
    task,
    completionStates,
    correctResponse,
  };
}

function buildData() {
  return {
    schema_version: 1,
    gate_id: GATE_ID,
    generated: '2026-06-02',
    status: 'review_only_playable_reasoning_lab',
    title: 'GATE-REASON-STD-1 speelbaar reasoning reviewlab',
    intro:
      'Gebruik de zichtbare taakcontrols en klik per case op Controleer case. Het lab telt pas af wanneer de echte task-shell evaluatie de verwachte eindstaat bereikt.',
    cases: CASES.map(collectCase),
    heldLanes: [
      {
        mode: 2,
        label: 'Vind de fout',
        status: 'local_error_repair_only',
        reason: 'Nog geen reviewed shared-shell error-repair/two-tier adoption.',
      },
      {
        mode: 4,
        label: 'Structuren matchen',
        status: 'held_for_classification_with_explanation_redesign',
        reason: 'Classification-with-explanation needs a separate reviewed task-family design.',
      },
    ],
    boundaries: {
      generated_lesson_output_mutation: false,
      source_data_mutation: false,
      engine_implementation: false,
      target_equivalent_reasoning_proof: false,
      diagnostics: false,
      mastery: false,
      sequencing: false,
      scale_gate_1: false,
      student_product_use: false,
    },
  };
}

function html(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${data.title}</title>
  <link rel="stylesheet" href="../../../engines/task-shell.css">
  <style>
    :root { color-scheme: light; --bg:#f4f7fb; --panel:#fff; --text:#132033; --muted:#5d6b80; --line:#d7e1ee; --accent:#176c67; --ok:#176c45; --warn:#9f5a1b; --soft:#eef7f6; }
    [data-theme="dark"] { color-scheme: dark; --bg:#101927; --panel:#182536; --text:#f1f7fc; --muted:#bcc8d7; --line:#33465d; --accent:#69c9bd; --ok:#7fd7a2; --warn:#f3ae72; --soft:#162d33; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    main { width:min(1120px, calc(100% - 32px)); margin:0 auto; padding:28px 0 44px; }
    .gate-hero, .gate-panel, .gate-case, .gate-held-card { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:18px; margin-bottom:16px; }
    h1, h2, h3 { margin:0; letter-spacing:0; }
    h1 { font-size:clamp(1.65rem,4vw,2.35rem); line-height:1.08; overflow-wrap:anywhere; }
    h2 { font-size:1.22rem; }
    h3 { font-size:1rem; }
    p { color:var(--muted); line-height:1.55; }
    .pills, .case-meta, .gate-actions { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
    .pill { border:1px solid var(--line); border-radius:999px; padding:6px 10px; color:var(--muted); font-weight:800; font-size:.88rem; }
    .warning { border-left:4px solid var(--warn); background:color-mix(in srgb, var(--warn) 10%, var(--panel)); padding:10px 12px; color:var(--text); }
    .gate-summary { position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; align-items:center; gap:12px; justify-content:space-between; box-shadow:0 8px 24px rgba(15,23,42,.10); }
    .progress { font-weight:900; color:var(--accent); }
    .gate-button, .gate-check-case { border:1px solid var(--accent); background:var(--accent); color:#fff; border-radius:8px; padding:9px 12px; font-weight:900; cursor:pointer; }
    .gate-button.secondary { background:transparent; color:var(--accent); }
    .gate-case-head { display:grid; grid-template-columns:minmax(0,1fr) minmax(260px, 34%); gap:14px; align-items:start; margin-bottom:14px; }
    .scaffold { border:1px solid var(--line); border-radius:8px; padding:12px; background:var(--soft); }
    .scaffold ul { margin:8px 0 0 18px; padding:0; color:var(--muted); }
    .case-actions { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:14px; padding-top:12px; border-top:1px solid var(--line); }
    .case-state { color:var(--muted); font-weight:800; }
    .case-state[data-state="complete"] { color:var(--ok); }
    .case-next-action { display:none; border:1px solid color-mix(in srgb, var(--ok) 65%, var(--line)); background:color-mix(in srgb, var(--ok) 12%, var(--panel)); color:var(--ok); border-radius:8px; padding:8px 10px; font-weight:900; cursor:pointer; }
    .case-next-action.is-visible { display:inline-flex; align-items:center; }
    .gate-complete { display:none; border:1px solid color-mix(in srgb, var(--ok) 45%, var(--line)); background:color-mix(in srgb, var(--ok) 12%, var(--panel)); border-radius:8px; padding:12px; font-weight:900; color:var(--ok); }
    .gate-complete.is-visible { display:block; }
    .ts-task { margin:0; }
    .ts-feedback-card.is-self_check { border-color:color-mix(in srgb, var(--accent) 55%, var(--line)); background:color-mix(in srgb, var(--accent) 10%, var(--panel)); }
    @media (max-width:760px) {
      main { width:min(520px, calc(100% - 18px)); padding-top:12px; }
      .gate-hero,.gate-panel,.gate-case,.gate-held-card { padding:14px; }
      .gate-summary { position:static; }
      .gate-case-head { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <main>
    <header class="gate-hero">
      <h1>${data.title}</h1>
      <p>${data.intro}</p>
      <div class="pills">
        <span class="pill">review-only</span>
        <span class="pill">playable proof</span>
        <span class="pill">actual task-shell evaluation</span>
        <span class="pill">no product authority</span>
      </div>
    </header>
    <section class="gate-panel" id="review-only">
      <h2>Testinstructie voor reviewer</h2>
      <p class="warning">Deze pagina is geen lesoutput en geen productroute. Gebruik de zichtbare knoppen, tekstvelden en volgordeblokken om de reasoning evidence echt te testen.</p>
      <p>Een case telt pas mee wanneer de task-shell engine een correcte eindstaat geeft. Voor mode 5 telt alleen de zelfcheck-eindstaat, niet een inhoudelijke beoordeling.</p>
    </section>
    <section class="gate-panel gate-summary">
      <div>
        <strong>Voortgang</strong>
        <div class="progress" data-gate-progress>0 / ${data.cases.length} cases afgerond</div>
      </div>
      <div class="gate-actions">
        <button type="button" class="gate-button secondary" data-gate-reset>Reset lab</button>
        <button type="button" class="gate-button" data-gate-autoplay>Speel correct pad automatisch</button>
      </div>
    </section>
    <section class="gate-panel gate-complete" data-gate-complete>
      Alle speelbare reasoning cases hebben de verwachte eindstaat bereikt.
    </section>
    <div id="playable-root"></div>
    <section class="gate-panel">
      <h2>Held lanes</h2>
      <div id="held-root"></div>
    </section>
  </main>
  <script src="../../../engines/task-shell-engine.js"></script>
  <script src="../../../engines/task-shell-ui.js"></script>
  <script id="gate-reasoning-data" type="application/json">${json}</script>
  <script>
    (function () {
      'use strict';
      try {
        var data = JSON.parse(document.getElementById('gate-reasoning-data').textContent);
        var root = document.getElementById('playable-root');
        var heldRoot = document.getElementById('held-root');
        var state = {};

        function escapeHtml(value) {
          return window.TaskShellUI.escapeHtml(value == null ? '' : String(value));
        }

        function cssEscape(value) {
          if (window.CSS && CSS.escape) return CSS.escape(value);
          return String(value).replace(/["\\\\]/g, '\\\\$&');
        }

        function caseById(caseId) {
          return data.cases.find(function (entry) { return entry.id === caseId; });
        }

        function nextCaseId(caseId) {
          var index = data.cases.findIndex(function (entry) { return entry.id === caseId; });
          return index >= 0 && index + 1 < data.cases.length ? data.cases[index + 1].id : '';
        }

        function articleFor(caseId) {
          return root.querySelector('[data-task="' + cssEscape(caseId) + '"]');
        }

        function caseEl(caseId) {
          return root.querySelector('[data-case-id="' + cssEscape(caseId) + '"]');
        }

        function feedbackRegion(caseId) {
          var article = articleFor(caseId);
          return article ? article.querySelector('[data-feedback-for="' + cssEscape(caseId) + '"]') : null;
        }

        function firstFocusableIn(caseId) {
          var el = caseEl(caseId);
          return el ? el.querySelector('input:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]') : null;
        }

        function scaffoldHtml(scaffold) {
          if (!scaffold) return '<div class="scaffold"><strong>Geen antwoordvorm-cue</strong><p>Deze case test alleen de taak-shell interactie.</p></div>';
          var items = (scaffold.checklist || []).slice(0, 4).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('');
          return '<div class="scaffold">' +
            '<strong>Antwoordvorm oefenen: ' + escapeHtml(scaffold.studentLabel || scaffold.lane || 'scaffold') + '</strong>' +
            '<p>' + escapeHtml(scaffold.studentPurpose || 'Lokale oefencue voor antwoordopbouw.') + '</p>' +
            (items ? '<ul>' + items + '</ul>' : '') +
          '</div>';
        }

        function renderCase(entry, index) {
          return '<section class="gate-case" data-case-id="' + escapeHtml(entry.id) + '">' +
            '<div class="gate-case-head">' +
              '<div>' +
                '<h2>' + escapeHtml(entry.title) + '</h2>' +
                '<p>' + escapeHtml(entry.reviewIssue) + '</p>' +
                '<div class="case-meta">' +
                  '<span class="pill">' + escapeHtml(entry.paragraph) + '</span>' +
                  '<span class="pill">mode ' + escapeHtml(entry.mode) + '</span>' +
                  '<span class="pill">' + escapeHtml(entry.task.family) + '</span>' +
                  '<span class="pill">' + escapeHtml(entry.provenance) + '</span>' +
                '</div>' +
              '</div>' +
              scaffoldHtml(entry.scaffold) +
            '</div>' +
            window.TaskShellUI.renderTask(entry.task, index) +
            '<div class="case-actions">' +
              '<button type="button" class="gate-check-case" data-gate-check-case="' + escapeHtml(entry.id) + '">Controleer case</button>' +
              '<span class="case-state" data-case-state data-state="pending">Nog niet afgerond</span>' +
              '<button type="button" class="case-next-action" data-gate-next-case="' + escapeHtml(entry.id) + '" data-gate-next-target="' + escapeHtml(nextCaseId(entry.id)) + '" disabled>Ga naar volgende case</button>' +
            '</div>' +
          '</section>';
        }

        function renderHeldLanes() {
          heldRoot.innerHTML = data.heldLanes.map(function (lane) {
            return '<article class="gate-held-card">' +
              '<h3>Mode ' + escapeHtml(lane.mode) + ' - ' + escapeHtml(lane.label) + '</h3>' +
              '<p><strong>Status:</strong> ' + escapeHtml(lane.status) + '</p>' +
              '<p>' + escapeHtml(lane.reason) + '</p>' +
            '</article>';
          }).join('');
        }

        function collect(entry, article) {
          if (entry.task.family === 'step_ordering') return window.TaskShellUI.collectStepOrderingResponse(article, entry.task);
          if (entry.task.family === 'structured_reasoning') {
            var textarea = article.querySelector('[data-input-role="answer"]');
            return textarea ? textarea.value : '';
          }
          return {};
        }

        function isComplete(entry, result) {
          return entry.completionStates.indexOf(result.state) !== -1;
        }

        function updateProgress() {
          var done = Object.keys(state).filter(function (caseId) { return state[caseId] === true; }).length;
          document.querySelector('[data-gate-progress]').textContent = done + ' / ' + data.cases.length + ' cases afgerond';
          document.querySelector('[data-gate-complete]').classList.toggle('is-visible', done === data.cases.length);
        }

        function checkCase(caseId) {
          var entry = caseById(caseId);
          var article = articleFor(caseId);
          var feedback = feedbackRegion(caseId);
          if (!entry || !article || !feedback) return null;
          var result = window.TaskShellEngine.evaluateTask(entry.task, collect(entry, article));
          feedback.innerHTML = window.TaskShellUI.renderFeedback(result);
          feedback.focus();
          var complete = isComplete(entry, result);
          state[caseId] = complete;
          var wrapper = caseEl(caseId);
          var label = wrapper && wrapper.querySelector('[data-case-state]');
          if (label) {
            label.textContent = complete ? 'Afgerond' : 'Nog niet afgerond';
            label.setAttribute('data-state', complete ? 'complete' : 'retry');
          }
          var nextButton = wrapper && wrapper.querySelector('[data-gate-next-case]');
          if (nextButton) {
            nextButton.classList.toggle('is-visible', complete);
            nextButton.disabled = !complete;
            nextButton.textContent = nextButton.getAttribute('data-gate-next-target') ? 'Ga naar volgende case' : 'Laatste case afgerond';
          }
          updateProgress();
          return result;
        }

        function setStructuredAnswer(entry) {
          var article = articleFor(entry.id);
          var textarea = article && article.querySelector('[data-input-role="answer"]');
          if (textarea) {
            textarea.value = entry.correctResponse;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }

        function selectStepOrder(entry) {
          var article = articleFor(entry.id);
          var order = entry.correctResponse.order || [];
          order.forEach(function (stepId) {
            var button = article && article.querySelector('[data-task-id="' + cssEscape(entry.id) + '"][data-step-id="' + cssEscape(stepId) + '"]');
            if (!button) throw new Error('Missing step selector for ' + entry.id + ': ' + stepId);
            button.click();
          });
        }

        function runCorrectPathFor(caseId) {
          var entry = caseById(caseId);
          if (!entry) throw new Error('Missing case: ' + caseId);
          if (entry.task.family === 'step_ordering') selectStepOrder(entry);
          else if (entry.task.family === 'structured_reasoning') setStructuredAnswer(entry);
          else throw new Error('Unsupported playable family: ' + entry.task.family);
          return checkCase(caseId);
        }

        function runAllCorrect() {
          data.cases.forEach(function (entry) {
            runCorrectPathFor(entry.id);
          });
          return inspectState();
        }

        function inspectState() {
          return {
            title: document.title,
            caseCount: data.cases.length,
            taskCount: root.querySelectorAll('.ts-task').length,
            checkButtonCount: root.querySelectorAll('[data-gate-check-case]').length,
            feedbackCount: root.querySelectorAll('.ts-feedback').length,
            completedCount: Object.keys(state).filter(function (caseId) { return state[caseId] === true; }).length,
            completedVisible: document.querySelector('[data-gate-complete]').classList.contains('is-visible'),
            progressText: document.querySelector('[data-gate-progress]').textContent,
            visibleNextActions: root.querySelectorAll('.case-next-action.is-visible').length,
            retryStates: root.querySelectorAll('[data-case-state][data-state="retry"]').length,
            completeStates: root.querySelectorAll('[data-case-state][data-state="complete"]').length,
            activeElementText: document.activeElement ? document.activeElement.textContent.trim().slice(0, 80) : '',
            activeElementTag: document.activeElement ? document.activeElement.tagName : '',
            theme: document.documentElement.getAttribute('data-theme') || 'light',
            hasTaskShellUI: typeof window.TaskShellUI,
            hasTaskShellEngine: typeof window.TaskShellEngine,
            initError: window.gateReasonStd1InitError || ''
          };
        }

        function handleClick(event) {
          if (window.TaskShellUI.handleStepOrderingClick(root, event)) return;
          var check = event.target.closest('[data-gate-check-case]');
          if (check) {
            checkCase(check.getAttribute('data-gate-check-case'));
            return;
          }
          var next = event.target.closest('[data-gate-next-case]');
          if (next) {
            var target = next.getAttribute('data-gate-next-target');
            if (target) {
              var focusTarget = firstFocusableIn(target);
              if (focusTarget) focusTarget.focus({ preventScroll: false });
            }
            return;
          }
          if (event.target.closest('[data-gate-reset]')) {
            window.location.reload();
            return;
          }
          if (event.target.closest('[data-gate-autoplay]')) {
            runAllCorrect();
          }
        }

        root.innerHTML = data.cases.map(renderCase).join('');
        renderHeldLanes();
        document.addEventListener('click', handleClick);
        updateProgress();
        window.gateReasonStd1 = {
          checkCase: checkCase,
          runCorrectPathFor: runCorrectPathFor,
          runAllCorrect: runAllCorrect,
          inspectState: inspectState,
          data: data
        };
      } catch (error) {
        window.gateReasonStd1InitError = error && error.stack ? error.stack : String(error);
        document.body.insertAdjacentHTML('afterbegin', '<pre style="white-space:pre-wrap;background:#fee;color:#600;padding:16px;">' + String(window.gateReasonStd1InitError).replace(/[&<>]/g, function (ch) { return ({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]); }) + '</pre>');
      }
    })();
  </script>
</body>
</html>
`;
}

const data = buildData();
fs.mkdirSync(GATE_DIR, { recursive: true });
fs.writeFileSync(OUT_DATA, JSON.stringify(data, null, 2) + '\n', 'utf8');
fs.writeFileSync(OUT_HTML, html(data), 'utf8');
console.log(`Wrote ${rel(OUT_HTML)} and ${rel(OUT_DATA)}`);
