#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review';
const GATE_DIR = path.join(ROOT, 'reports', 'review-gates', GATE_ID);
const OUT = path.join(GATE_DIR, 'gate-playable-task-family-lab.html');

function feedback(title) {
  return {
    matchTitle: 'Goed: ' + title,
    matchText: 'Je handeling bereikt de verwachte eindstaat.',
    retryTitle: 'Nog niet klaar',
    retryText: 'Gebruik de taakcontrols om de ontbrekende of verkeerde stap te herstellen.'
  };
}

function task(id, family, skillLabel, prompt, purpose, interaction, expected) {
  return {
    id,
    family,
    skillLabel,
    prompt,
    purpose,
    interaction,
    expected,
    feedback: feedback(skillLabel),
    practiceRoute: { label: 'Review-only routeplaceholder', href: '#review-only' }
  };
}

const data = {
  schema_version: 1,
  eyebrow: 'Reviewlab',
  title: 'Speelbare taakvormen',
  intro: 'Gebruik de controls en klik per taak op Controleer taak. Het lab telt pas af als de taak echt de verwachte eindstaat bereikt.',
  tasks: [
    task(
      'cloze-text-index',
      'cloze_text',
      'Indexpunten invullen',
      'Vul de indexpunten en de basis in.',
      'Typ de ontbrekende waarden in een begrensde economische zin.',
      {
        segments: [
          { type: 'text', text: 'De stijging is ' },
          { type: 'blank', blankId: 'indexpunten' },
          { type: 'text', text: ' indexpunten. Je deelt door ' },
          { type: 'blank', blankId: 'basis' },
          { type: 'text', text: ' om de procentuele stijging te berekenen.' }
        ],
        blanks: [
          { id: 'indexpunten', label: 'Stijging in indexpunten', placeholder: 'bijv. 4', inputMode: 'decimal' },
          { id: 'basis', label: 'Basis voor procentuele stijging', placeholder: 'bijv. 108', inputMode: 'decimal' }
        ]
      },
      {
        kind: 'cloze_text',
        blanks: {
          indexpunten: { accepted: ['4', '4 indexpunten'] },
          basis: { accepted: ['108'] }
        }
      }
    ),
    task(
      'multi-select-schaarste',
      'multi_select',
      'Complete set kiezen',
      'Welke uitspraken horen bij schaarste?',
      'Selecteer alle juiste uitspraken en laat de afleider weg.',
      {
        inputLabel: 'Uitspraken over schaarste',
        options: [
          { id: 'behoeften', label: 'Behoeften zijn groter dan beschikbare middelen.' },
          { id: 'keuze', label: 'Je moet kiezen tussen alternatieven.' },
          { id: 'alles-kan', label: 'Iedereen kan alles krijgen wat hij wil.' }
        ]
      },
      {
        kind: 'multi_select',
        mode: 'exact_set',
        values: ['behoeften', 'keuze'],
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'matching-concepts',
      'matching_pairs',
      'Begrippen koppelen',
      'Koppel elk begrip aan de juiste betekenis.',
      'Klik eerst een begrip links en daarna de passende betekenis rechts.',
      {
        leftBankLabel: 'Begrippen',
        rightBankLabel: 'Betekenissen',
        pairLabel: 'Gemaakte koppels',
        placeholder: 'Kies links een begrip en daarna rechts de passende betekenis.',
        leftItems: [
          { id: 'schaarste', label: 'Schaarste', description: 'Beperkte middelen tegenover behoeften.', kind: 'answer' },
          { id: 'alternatieve-kosten', label: 'Alternatieve kosten', description: 'Kosten van de keuze die je niet maakt.', kind: 'answer' },
          { id: 'onbeperkte-middelen', label: 'Onbeperkte middelen', description: 'Afleider: dit is juist het tegenovergestelde van schaarste.', kind: 'distractor', distractorFor: 'schaarste' }
        ],
        rightItems: [
          { id: 'behoeften-middelen', label: 'Behoeften groter dan middelen', description: 'Betekenis van schaarste.', kind: 'answer' },
          { id: 'beste-alternatief', label: 'Beste niet-gekozen alternatief', description: 'Betekenis van alternatieve kosten.', kind: 'answer' },
          { id: 'geen-keuze-nodig', label: 'Er is geen keuze nodig', description: 'Afleider: dit past niet bij kiezen onder schaarste.', kind: 'distractor', distractorFor: 'behoeften-middelen' }
        ]
      },
      {
        kind: 'matching_pairs',
        pairs: [
          ['schaarste', 'behoeften-middelen'],
          ['alternatieve-kosten', 'beste-alternatief']
        ],
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'step-order-procent',
      'step_ordering',
      'Stappen ordenen',
      'Zet de stappen voor procentuele verandering in de juiste volgorde.',
      'Klik de procedurestappen in volgorde.',
      {
        steps: [
          { id: 'verschil', label: 'Bereken het verschil', description: 'Nieuw min oud', kind: 'answer' },
          { id: 'deel-door-oud', label: 'Deel door de oude waarde', kind: 'answer' },
          { id: 'keer-100', label: 'Vermenigvuldig met 100%', kind: 'answer' },
          { id: 'deel-door-nieuw', label: 'Deel door de nieuwe waarde', kind: 'distractor', distractorFor: 'deel-door-oud' }
        ],
        separator: ' -> ',
        placeholder: 'Orden de stappen.',
        stepBankLabel: 'Stappenbank',
        sequenceLabel: 'Gekozen volgorde'
      },
      {
        kind: 'step_ordering',
        order: ['verschil', 'deel-door-oud', 'keer-100'],
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'two-tier-index',
      'two_tier_choice',
      'Antwoord en reden kiezen',
      'Wat klopt bij een indexstijging van 108 naar 112?',
      'Kies eerst het antwoord en daarna de reden.',
      {
        answerLabel: 'Kies het antwoord',
        reasonLabel: 'Kies de reden',
        answerOptions: [
          { id: 'vier-indexpunten', label: 'De stijging is 4 indexpunten.', description: '112 min 108 is een verschil in punten.' },
          { id: 'vier-procent', label: 'De stijging is 4 procent.', description: 'Dit verwart indexpunten met procentuele verandering.' }
        ],
        reasonOptions: [
          { id: 'verschil-in-punten', label: 'Indexpunten bereken je door indexgetallen af te trekken.', description: '112 - 108 = 4 indexpunten.' },
          { id: 'delen-door-honderd', label: 'Je deelt altijd door 100.', description: 'Dit is geen goede reden.' }
        ]
      },
      {
        kind: 'two_tier_choice',
        answer: 'vier-indexpunten',
        reason: 'verschil-in-punten',
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'assertion-price',
      'assertion_reason',
      'Stelling en reden beoordelen',
      'Beoordeel de stelling en reden.',
      'Kies de relatie die bij beide zinnen past.',
      {
        assertionLabel: 'Stelling',
        assertionText: 'Als de prijs stijgt, daalt de gevraagde hoeveelheid.',
        reasonLabel: 'Reden',
        reasonText: 'Bij een hogere prijs kopen consumenten meestal minder.',
        optionLabel: 'Kies de juiste relatie',
        options: [
          { id: 'both-correct-explains', label: 'Stelling en reden zijn juist, en de reden ondersteunt de stelling.', description: 'De reden legt uit waarom de gevraagde hoeveelheid daalt.' },
          { id: 'both-correct-no-explain', label: 'Stelling en reden zijn juist, maar de reden ondersteunt de stelling niet.', description: 'Gebruik dit alleen als de reden losstaat.' },
          { id: 'assertion-correct-reason-wrong', label: 'De stelling is juist, maar de reden is onjuist.', description: 'De richting klopt, de uitleg niet.' },
          { id: 'assertion-wrong-reason-correct', label: 'De stelling is onjuist, maar de reden is juist.', description: 'De uitleg kan kloppen terwijl de stelling niet klopt.' },
          { id: 'both-wrong', label: 'Stelling en reden zijn allebei onjuist.', description: 'Kies dit als beide onderdelen niet kloppen.' }
        ]
      },
      {
        kind: 'assertion_reason',
        value: 'both-correct-explains',
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'cloze-tile-index',
      'cloze_tile_select',
      'Invullen met tegels',
      'Vul de indexzin met tegels.',
      'Klik eerst een tegel en daarna de lege plek.',
      {
        segments: [
          { type: 'text', text: 'De stijging is ' },
          { type: 'blank', blankId: 'indexpunten' },
          { type: 'text', text: ' indexpunten. De procentuele basis is ' },
          { type: 'blank', blankId: 'basis' },
          { type: 'text', text: '.' }
        ],
        blanks: [
          { id: 'indexpunten', label: 'Stijging in indexpunten' },
          { id: 'basis', label: 'Basis voor procentuele stijging' }
        ],
        tiles: [
          { id: 'vier', label: '4', kind: 'answer' },
          { id: 'honderdacht', label: '108', kind: 'answer' },
          { id: 'vier-procent', label: '4%', kind: 'distractor', distractorFor: 'indexpunten' }
        ],
        tileBankLabel: 'Tegelbank'
      },
      {
        kind: 'cloze_tile_select',
        blanks: { indexpunten: 'vier', basis: 'honderdacht' }
      }
    ),
    task(
      'sentence-demand',
      'sentence_builder',
      'Redeneerzin bouwen',
      'Bouw de economische redenering.',
      'Klik de fragmenten in een logisch lopende volgorde: oorzaak, context, gevolg.',
      {
        tokens: [
          { id: 'prijs-stijgt', label: 'De prijs stijgt', kind: 'answer' },
          { id: 'vraag-daalt', label: 'de gevraagde hoeveelheid daalt', kind: 'answer' },
          { id: 'hogere-prijs', label: 'bij een hogere prijs', kind: 'answer' },
          { id: 'vraag-stijgt', label: 'de gevraagde hoeveelheid stijgt', kind: 'distractor', distractorFor: 'vraag-daalt' }
        ],
        separator: ' -> ',
        placeholder: 'Bouw je redenering.',
        tokenBankLabel: 'Fragmentbank',
        sequenceLabel: 'Opgebouwde redenering'
      },
      {
        kind: 'sentence_builder',
        tokens: ['prijs-stijgt', 'hogere-prijs', 'vraag-daalt'],
        acceptedSequences: [
          ['prijs-stijgt', 'hogere-prijs', 'vraag-daalt'],
          ['prijs-stijgt', 'vraag-daalt', 'hogere-prijs']
        ]
      }
    ),
    task(
      'formula-percent',
      'formula_builder',
      'Formule bouwen',
      'Bouw de formule voor procentuele verandering.',
      'Klik de formuleblokken in de juiste volgorde.',
      {
        tokens: [
          { id: 'nieuw-min-oud', label: 'nieuw - oud', kind: 'answer', category: 'numerator' },
          { id: 'delen-door-oud', label: '/ oud', kind: 'answer', category: 'denominator' },
          { id: 'keer-100-procent', label: 'x 100%', kind: 'answer', category: 'multiplier' },
          { id: 'delen-door-nieuw', label: '/ nieuw', kind: 'distractor', category: 'denominator', distractorFor: 'delen-door-oud' }
        ],
        separator: ' ',
        placeholder: 'Bouw de formule.',
        tokenBankLabel: 'Formuleblokken',
        sequenceLabel: 'Opgebouwde formule'
      },
      {
        kind: 'formula_builder',
        tokens: ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'],
        acceptedSequences: [['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent']]
      }
    ),
    task(
      'source-values-percent',
      'source_value_selection',
      'Bronwaarden kiezen',
      'Een fietsenwinkel vergelijkt de prijs van dezelfde e-bike in twee jaren. Welke bronwaarden gebruik je voor de procentuele prijsverandering?',
      'Lees de bronregels, kies de twee prijsregels die bij dezelfde e-bike horen en geef daarna zelf aan welke waarde de beginwaarde en welke de eindwaarde is.',
      {
        valueBankLabel: 'Bronwaarden',
        roleLabel: 'Rol',
        values: [
          { id: 'model-stad-2024', label: 'EUR 800', kind: 'answer', sourceLabel: 'E-bike model Stad', unit: 'euro', period: '2024' },
          { id: 'model-stad-2025', label: 'EUR 920', kind: 'answer', sourceLabel: 'E-bike model Stad', unit: 'euro', period: '2025' },
          { id: 'accessoires-2025', label: 'EUR 120', kind: 'distractor', sourceLabel: 'Accessoirespakket', unit: 'euro', period: '2025' },
          { id: 'model-sport-2025', label: 'EUR 1040', kind: 'distractor', sourceLabel: 'E-bike model Sport', unit: 'euro', period: '2025' }
        ],
        roles: [
          { id: 'old', label: 'beginwaarde' },
          { id: 'new', label: 'eindwaarde' }
        ]
      },
      {
        kind: 'source_value_selection',
        selections: [
          { valueId: 'model-stad-2024', role: 'old' },
          { valueId: 'model-stad-2025', role: 'new' }
        ],
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'source-chain-percent',
      'source_chain_builder',
      'Bronketen bouwen',
      'Bron 1 geeft de prijzen van e-bike model Stad: 2024 = EUR 800 en 2025 = EUR 920. Bouw de keten van bron naar antwoord.',
      'Klik de onderdelen in volgorde: bronregel, waarden, bewerking, antwoord, conclusie.',
      {
        nodeBankLabel: 'Bronketen onderdelen',
        sequenceLabel: 'Opgebouwde bronketen',
        placeholder: 'Bouw de bronketen.',
        separator: ' -> ',
        nodes: [
          { id: 'bron', label: 'Lees bron 1: model Stad in 2024 en 2025', kind: 'answer', nodeRole: 'source' },
          { id: 'waarden', label: 'Gebruik 2024 EUR 800 en 2025 EUR 920', kind: 'answer', nodeRole: 'value' },
          { id: 'bewerking', label: '(920 - 800) / 800 x 100%', kind: 'answer', nodeRole: 'operation' },
          { id: 'antwoord', label: '15%', kind: 'answer', nodeRole: 'answer' },
          { id: 'conclusie', label: 'De prijs van model Stad stijgt met 15%', kind: 'answer', nodeRole: 'conclusion' },
          { id: 'accessoires', label: 'Gebruik accessoirespakket 2025 EUR 120', kind: 'distractor', nodeRole: 'value', distractorFor: 'waarden' },
          { id: 'deel-door-nieuw', label: 'Deel door 920', kind: 'distractor', nodeRole: 'operation', distractorFor: 'bewerking' }
        ]
      },
      {
        kind: 'source_chain_builder',
        chain: ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'],
        partialFeedback: 'practice_only'
      }
    ),
    task(
      'label-placement-graph',
      'label_placement',
      'Labels plaatsen',
      'Plaats de grafieklabels op de juiste plekken.',
      'Klik een label en daarna de plek in de visuele structuur.',
      {
        labelBankLabel: 'Labelbank',
        targetRegionLabel: 'Grafiekvlak',
        placementLabel: 'Geplaatste labels',
        visual: {
          kind: 'coordinate_plane',
          title: 'Leeg assenstelsel',
          description: 'Plaats de grootheden op het juiste onderdeel van het grafiekvlak.',
          showLine: false,
          showGrid: false
        },
        labels: [
          { id: 'prijs', label: 'Prijs', description: 'Grootheid uit een prijs-hoeveelheidgrafiek.', kind: 'answer' },
          { id: 'hoeveelheid', label: 'Hoeveelheid', description: 'Grootheid uit een prijs-hoeveelheidgrafiek.', kind: 'answer' },
          { id: 'omzet', label: 'Omzet', description: 'Berekende uitkomst, geen asgrootheid in dit assenstelsel.', kind: 'distractor', distractorFor: 'prijs' }
        ],
        targets: [
          { id: 'axis-left', label: 'As links', description: 'De verticale as van het grafiekvlak.', kind: 'answer', targetRole: 'axis', x: 18, y: 48 },
          { id: 'axis-bottom', label: 'As onder', description: 'De horizontale as van het grafiekvlak.', kind: 'answer', targetRole: 'axis', x: 64, y: 82 },
          { id: 'loose-box', label: 'Los vak', description: 'Een los tekstvak buiten de assen.', kind: 'distractor', targetRole: 'structure_part', distractorFor: 'axis-left', x: 78, y: 18 }
        ]
      },
      {
        kind: 'label_placement',
        placements: [
          { labelId: 'prijs', targetId: 'axis-left' },
          { labelId: 'hoeveelheid', targetId: 'axis-bottom' }
        ],
        partialFeedback: 'practice_only'
      }
    )
  ]
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeScriptJson(value) {
  return String(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

const html = `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GATE-TASK-FAMILY-1 playable task-family lab</title>
  <link rel="stylesheet" href="../../../engines/task-shell.css">
  <style>
    :root { color-scheme: light; --bg:#f4f7fb; --panel:#fff; --text:#132033; --muted:#5d6b80; --line:#d7e1ee; --accent:#176c67; --ok:#176c45; --warn:#9f5a1b; }
    [data-theme="dark"] { color-scheme: dark; --bg:#101927; --panel:#182536; --text:#f1f7fc; --muted:#bcc8d7; --line:#33465d; --accent:#69c9bd; --ok:#7fd7a2; --warn:#f3ae72; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    main { width:min(1120px, calc(100% - 32px)); margin:0 auto; padding:28px 0 44px; }
    .gate-hero, .gate-panel { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:18px; margin-bottom:16px; }
    h1, h2, h3 { margin:0; letter-spacing:0; }
    h1 { font-size:clamp(1.7rem,4vw,2.45rem); line-height:1.08; overflow-wrap:anywhere; }
    p { color:var(--muted); line-height:1.55; }
    .pills { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .pill { border:1px solid var(--line); border-radius:999px; padding:6px 10px; color:var(--muted); font-weight:800; font-size:.9rem; }
    .warning { border-left:4px solid var(--warn); background:color-mix(in srgb, var(--warn) 10%, var(--panel)); padding:10px 12px; color:var(--text); }
    .gate-summary { position:sticky; top:0; z-index:5; display:flex; flex-wrap:wrap; align-items:center; gap:12px; justify-content:space-between; box-shadow:0 8px 24px rgba(15,23,42,.10); }
    .progress { font-weight:900; color:var(--accent); }
    .gate-actions { display:flex; flex-wrap:wrap; gap:8px; }
    .gate-button, .gate-check-task { border:1px solid var(--accent); background:var(--accent); color:#fff; border-radius:8px; padding:9px 12px; font-weight:900; cursor:pointer; }
    .gate-button.secondary { background:transparent; color:var(--accent); }
    .ts-task { position:relative; }
    .gate-task-actions { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:14px; padding-top:12px; border-top:1px solid var(--line); }
    .gate-task-state { color:var(--muted); font-weight:800; }
    .gate-task-state[data-state="matched"] { color:var(--ok); }
    .gate-next-action { display:none; border:1px solid color-mix(in srgb, var(--ok) 65%, var(--line)); background:color-mix(in srgb, var(--ok) 12%, var(--panel)); color:var(--ok); border-radius:8px; padding:8px 10px; font-weight:900; cursor:pointer; }
    .gate-next-action.is-visible { display:inline-flex; align-items:center; }
    .gate-review-tip { margin:8px 0 0; padding:8px 10px; border:1px solid var(--line); border-radius:8px; color:var(--muted); background:color-mix(in srgb, var(--accent) 6%, var(--panel)); font-size:.92rem; }
    .gate-complete { display:none; border:1px solid color-mix(in srgb, var(--ok) 45%, var(--line)); background:color-mix(in srgb, var(--ok) 12%, var(--panel)); border-radius:8px; padding:12px; font-weight:900; color:var(--ok); }
    .gate-complete.is-visible { display:block; }
    .ts-feedback-card.is-matched { border-color:color-mix(in srgb, var(--ok) 55%, var(--line)); background:color-mix(in srgb, var(--ok) 10%, var(--panel)); }
    @media (max-width:720px) { main { width:min(520px, calc(100% - 18px)); padding-top:12px; } .gate-hero,.gate-panel { padding:14px; } .gate-summary { position:static; } }
  </style>
</head>
<body>
  <main>
    <header class="gate-hero">
      <h1>GATE-TASK-FAMILY-1 speelbaar reviewlab</h1>
      <p>Deze pagina is reviewbewijs: de nieuwe taakvormen moeten klikbaar, invulbaar en controleerbaar zijn. Een taak telt pas mee wanneer de echte taak-shell evaluatie een match geeft.</p>
      <div class="pills">
        <span class="pill">review-only</span>
        <span class="pill">geen lesoutput</span>
        <span class="pill">geen productautoriteit</span>
        <span class="pill">target-proof boundary held</span>
      </div>
    </header>
    <section class="gate-panel">
      <h2>Testinstructie voor reviewer</h2>
      <p class="warning">Gebruik deze pagina niet als bewijs voor productadoptie. Dit lab bewijst alleen of de families als speelbare taakvormen te beoordelen zijn.</p>
      <p>Klik of typ per taak. Klik daarna op <strong>Controleer taak</strong>. Een reviewer moet zonder verborgen code kunnen zien wat er gebeurde en wat de volgende handeling is.</p>
    </section>
    <section class="gate-panel gate-summary" id="review-only">
      <div>
        <strong>Voortgang</strong>
        <div class="progress" data-gate-progress>0 / ${data.tasks.length} taken afgerond</div>
      </div>
      <div class="gate-actions">
        <button type="button" class="gate-button secondary" data-gate-reset>Reset lab</button>
        <button type="button" class="gate-button" data-gate-autoplay>Speel correct pad automatisch</button>
      </div>
    </section>
    <section class="gate-panel gate-complete" data-gate-complete>
      Alle twaalf taakvormen hebben een correcte eindstaat bereikt.
    </section>
    <div id="playable-root"></div>
  </main>
  <script src="../../../engines/task-shell-engine.js"></script>
  <script src="../../../engines/task-shell-ui.js"></script>
  <script id="gate-task-data" type="application/json">${escapeScriptJson(JSON.stringify(data))}</script>
  <script>
    (function () {
      'use strict';
      try {
      var data = JSON.parse(document.getElementById('gate-task-data').textContent);
      var root = document.getElementById('playable-root');
      var state = {};

      function taskById(id) {
        return data.tasks.find(function (task) { return task.id === id; });
      }

      function cssEscape(value) {
        return String(value).replace(/["\\\\]/g, '\\\\$&');
      }

      function taskArticle(taskId) {
        return root.querySelector('[data-task="' + cssEscape(taskId) + '"]');
      }

      function firstFocusableIn(article) {
        if (!article) return null;
        return article.querySelector('input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex="0"]');
      }

      function nextTaskId(taskId) {
        var index = data.tasks.findIndex(function (task) { return task.id === taskId; });
        return index >= 0 && index + 1 < data.tasks.length ? data.tasks[index + 1].id : '';
      }

      function feedbackRegion(taskId) {
        var article = taskArticle(taskId);
        return article ? article.querySelector('[data-feedback-for="' + cssEscape(taskId) + '"]') : null;
      }

      function collect(article, task) {
        switch (task.family) {
          case 'cloze_text': return TaskShellUI.collectClozeTextResponse(article, task);
          case 'multi_select': return TaskShellUI.collectMultiSelectResponse(article, task);
          case 'matching_pairs': return TaskShellUI.collectMatchingPairsResponse(article, task);
          case 'step_ordering': return TaskShellUI.collectStepOrderingResponse(article, task);
          case 'two_tier_choice': return TaskShellUI.collectTwoTierChoiceResponse(article, task);
          case 'assertion_reason': return TaskShellUI.collectAssertionReasonResponse(article, task);
          case 'cloze_tile_select': return TaskShellUI.collectClozeTileResponse(article, task);
          case 'sentence_builder': return TaskShellUI.collectSentenceBuilderResponse(article, task);
          case 'formula_builder': return TaskShellUI.collectFormulaBuilderResponse(article, task);
          case 'source_value_selection': return TaskShellUI.collectSourceValueSelectionResponse(article, task);
          case 'source_chain_builder': return TaskShellUI.collectSourceChainBuilderResponse(article, task);
          case 'label_placement': return TaskShellUI.collectLabelPlacementResponse(article, task);
          default: return {};
        }
      }

      function updateProgress() {
        var done = Object.keys(state).filter(function (taskId) { return state[taskId] === true; }).length;
        document.querySelector('[data-gate-progress]').textContent = done + ' / ' + data.tasks.length + ' taken afgerond';
        document.querySelector('[data-gate-complete]').classList.toggle('is-visible', done === data.tasks.length);
      }

      function checkTask(taskId) {
        var task = taskById(taskId);
        var article = taskArticle(taskId);
        var feedback = feedbackRegion(taskId);
        if (!task || !article || !feedback) return null;
        var result = TaskShellEngine.evaluateTask(task, collect(article, task));
        feedback.innerHTML = TaskShellUI.renderFeedback(result);
        feedback.focus();
        state[taskId] = result.matched === true;
        var label = article.querySelector('[data-gate-task-state]');
        if (label) {
          label.textContent = result.matched === true ? 'Afgerond' : 'Nog niet afgerond';
          label.setAttribute('data-state', result.matched === true ? 'matched' : 'retry');
        }
        var nextButton = article.querySelector('[data-gate-next-task]');
        if (nextButton) {
          nextButton.classList.toggle('is-visible', result.matched === true);
          nextButton.textContent = nextButton.getAttribute('data-gate-next-target')
            ? 'Ga naar volgende taak'
            : 'Laatste taak afgerond';
          nextButton.disabled = result.matched !== true;
        }
        updateProgress();
        return result;
      }

      function addCheckButtons() {
        root.querySelectorAll('.ts-task').forEach(function (article) {
          var taskId = article.getAttribute('data-task');
          article.insertAdjacentHTML('beforeend',
            '<div class="gate-task-actions">' +
              '<button type="button" class="gate-check-task" data-gate-check-task="' + taskId + '">Controleer taak</button>' +
              '<span class="gate-task-state" data-gate-task-state data-state="pending">Nog niet afgerond</span>' +
              '<button type="button" class="gate-next-action" data-gate-next-task="' + taskId + '" data-gate-next-target="' + nextTaskId(taskId) + '" disabled>Ga naar volgende taak</button>' +
            '</div>'
          );
          if (['sentence_builder', 'formula_builder', 'step_ordering', 'source_chain_builder'].indexOf(article.getAttribute('data-task-family')) !== -1) {
            article.insertAdjacentHTML('beforeend', '<p class="gate-review-tip">Tip voor herstel: gebruik de kleine pijlknoppen in je gekozen reeks om blokken te verplaatsen, of verwijder een blok met x.</p>');
          }
        });
      }

      function dispatchTaskShellClick(event) {
        return TaskShellUI.handleMultiSelectClick(root, event) ||
          TaskShellUI.handleClozeTileClick(root, event) ||
          TaskShellUI.handleSentenceBuilderClick(root, event) ||
          TaskShellUI.handleFormulaBuilderClick(root, event) ||
          TaskShellUI.handleStepOrderingClick(root, event) ||
          TaskShellUI.handleMatchingPairsClick(root, event) ||
          TaskShellUI.handleTwoTierChoiceClick(root, event) ||
          TaskShellUI.handleAssertionReasonClick(root, event) ||
          TaskShellUI.handleSourceValueSelectionClick(root, event) ||
          TaskShellUI.handleSourceChainBuilderClick(root, event) ||
          TaskShellUI.handleLabelPlacementClick(root, event);
      }

      function click(selector) {
        var element = root.querySelector(selector) || document.querySelector(selector);
        if (!element) throw new Error('Missing selector: ' + selector);
        element.click();
      }

      function fill(selector, value) {
        var element = root.querySelector(selector);
        if (!element) throw new Error('Missing selector: ' + selector);
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }

      function setSelect(selector, value) {
        var element = root.querySelector(selector);
        if (!element) throw new Error('Missing selector: ' + selector);
        element.value = value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }

      function correctPathFor(taskId) {
        var q = function (suffix) { return '[data-task-id="' + taskId + '"]' + suffix; };
        switch (taskId) {
          case 'cloze-text-index':
            fill(q('[data-cloze-text-blank-id="indexpunten"]'), '4');
            fill(q('[data-cloze-text-blank-id="basis"]'), '108');
            break;
          case 'multi-select-schaarste':
            click(q('[data-multi-option-id="behoeften"]'));
            click(q('[data-multi-option-id="keuze"]'));
            break;
          case 'matching-concepts':
            click(q('[data-match-left-id="schaarste"]'));
            click(q('[data-match-right-id="behoeften-middelen"]'));
            click(q('[data-match-left-id="alternatieve-kosten"]'));
            click(q('[data-match-right-id="beste-alternatief"]'));
            break;
          case 'step-order-procent':
            ['verschil', 'deel-door-oud', 'keer-100'].forEach(function (id) { click(q('[data-step-id="' + id + '"]')); });
            break;
          case 'two-tier-index':
            click(q('[data-two-tier-answer-id="vier-indexpunten"]'));
            click(q('[data-two-tier-reason-id="verschil-in-punten"]'));
            break;
          case 'assertion-price':
            click(q('[data-assertion-option-id="both-correct-explains"]'));
            break;
          case 'cloze-tile-index':
            click(q('[data-cloze-tile-id="vier"]'));
            click(q('[data-cloze-blank-id="indexpunten"]'));
            click(q('[data-cloze-tile-id="honderdacht"]'));
            click(q('[data-cloze-blank-id="basis"]'));
            break;
          case 'sentence-demand':
            ['prijs-stijgt', 'hogere-prijs', 'vraag-daalt'].forEach(function (id) { click(q('[data-sentence-token-id="' + id + '"]')); });
            break;
          case 'formula-percent':
            ['nieuw-min-oud', 'delen-door-oud', 'keer-100-procent'].forEach(function (id) { click(q('[data-formula-token-id="' + id + '"]')); });
            break;
          case 'source-values-percent':
            click(q('[data-source-value-id="model-stad-2024"]'));
            setSelect(q('[data-source-role-value-id="model-stad-2024"]'), 'old');
            click(q('[data-source-value-id="model-stad-2025"]'));
            setSelect(q('[data-source-role-value-id="model-stad-2025"]'), 'new');
            break;
          case 'source-chain-percent':
            ['bron', 'waarden', 'bewerking', 'antwoord', 'conclusie'].forEach(function (id) { click(q('[data-source-node-id="' + id + '"]')); });
            break;
          case 'label-placement-graph':
            click(q('[data-label-id="prijs"]'));
            click(q('[data-label-target-id="axis-left"]'));
            click(q('[data-label-id="hoeveelheid"]'));
            click(q('[data-label-target-id="axis-bottom"]'));
            break;
          default:
            throw new Error('No correct path for ' + taskId);
        }
      }

      function autoplayCorrect() {
        data.tasks.forEach(function (task) {
          correctPathFor(task.id);
          checkTask(task.id);
        });
        return {
          total: data.tasks.length,
          matched: Object.keys(state).filter(function (taskId) { return state[taskId] === true; }).length,
          states: Object.assign({}, state)
        };
      }

      function resetLab() {
        state = {};
        root.innerHTML = TaskShellUI.renderStaticHtml(data);
        addCheckButtons();
        updateProgress();
      }

      document.addEventListener('click', function (event) {
        var check = event.target.closest && event.target.closest('[data-gate-check-task]');
        var next = event.target.closest && event.target.closest('[data-gate-next-task]');
        var autoplay = event.target.closest && event.target.closest('[data-gate-autoplay]');
        var reset = event.target.closest && event.target.closest('[data-gate-reset]');
        if (check) {
          checkTask(check.getAttribute('data-gate-check-task'));
          return;
        }
        if (next) {
          var targetTaskId = next.getAttribute('data-gate-next-target');
          var nextArticle = targetTaskId ? taskArticle(targetTaskId) : null;
          var focusTarget = firstFocusableIn(nextArticle) || nextArticle;
          if (nextArticle) {
            nextArticle.scrollIntoView({ block: 'start', behavior: 'instant' });
            if (focusTarget) focusTarget.focus();
          }
          return;
        }
        if (autoplay) {
          resetLab();
          autoplayCorrect();
          return;
        }
        if (reset) {
          resetLab();
          return;
        }
        dispatchTaskShellClick(event);
      });

      resetLab();
      window.GateTaskFamilyLab = {
        data: data,
        checkTask: checkTask,
        autoplayCorrect: autoplayCorrect,
        correctPathFor: correctPathFor,
        state: function () { return Object.assign({}, state); }
      };

      if (new URLSearchParams(window.location.search).get('autoplay') === 'correct') {
        window.setTimeout(function () { autoplayCorrect(); }, 50);
      }
      } catch (error) {
        window.gateTaskFamilyInitError = error && (error.stack || error.message || String(error));
        throw error;
      }
    })();
  </script>
</body>
</html>
`;

fs.mkdirSync(GATE_DIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');
fs.writeFileSync(path.join(GATE_DIR, 'gate-playable-task-family-data.json'), JSON.stringify(data, null, 2), 'utf8');
console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`Wrote ${path.relative(ROOT, path.join(GATE_DIR, 'gate-playable-task-family-data.json'))}`);
