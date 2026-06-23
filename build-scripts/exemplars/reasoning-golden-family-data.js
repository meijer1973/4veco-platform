const authority = {
  golden_reference: true,
  student_product_adoption: false,
  target_equivalent_proof: false,
  diagnostics: false,
  mastery_or_sequencing: false,
  summative_use: false,
  scale_gate: false
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function route(label) {
  return { label, href: '#next' };
}

function feedback(matchTitle, matchText, retryTitle, retryText) {
  return { matchTitle, matchText, retryTitle, retryText };
}

function withEvidence(expected, refs) {
  return {
    ...expected,
    sourceEvidenceRefs: Array.isArray(refs) ? refs : [refs]
  };
}

function markdownContext(id, title, bodyMarkdown, accessibilitySummary) {
  return { id, type: 'markdown', title, bodyMarkdown, accessibilitySummary };
}

function compositionBase(overrides) {
  return {
    schema_version: 1,
    authority: clone(authority),
    layout: {
      type: 'dual_pane_source_task_workspace',
      desktopIndependentScroll: true,
      mobileFlow: 'source_before_tasks',
      defaultRoute: 'reasoning_composer'
    },
    ...overrides
  };
}

function allRefs(taskSet) {
  return (taskSet.contextBlocks || []).map((block) => block.id);
}

function withContextRefs(taskSet) {
  const refs = allRefs(taskSet);
  taskSet.tasks = taskSet.tasks.map((task) => ({ ...task, contextRefs: refs }));
  return taskSet;
}

function functionalAnswerTask({ id, prompt, template, rows, expectedRows, sourceEvidenceRefs, matchTitle, matchText, retryTitle, retryText }) {
  return {
    id,
    family: 'functional_answer_builder',
    skillLabel: 'Antwoorddelen kiezen',
    purpose: 'Bouw een antwoord waarin elke regel een eigen functie heeft.',
    prompt,
    interaction: {
      rowGroupLabel: 'Antwoordregels',
      answerPreview: {
        label: 'Opgebouwd antwoord',
        placeholder: 'Kies per regel een onderdeel.',
        template
      },
      answerRows: rows
    },
    expected: withEvidence({
      kind: 'functional_answer_builder',
      rows: expectedRows,
      partialFeedback: 'practice_only'
    }, sourceEvidenceRefs),
    feedback: feedback(matchTitle, matchText, retryTitle, retryText),
    practiceRoute: route('Verder oefenen met deze redenering')
  };
}

function marketPriceMechanism() {
  const taskSet = withContextRefs({
    schema_version: 1,
    title: 'Prijsmechanisme fietsenmarkt',
    contextBlocks: [
      markdownContext(
        'ctx-market-source',
        'Situatie',
        'Een gemeente haalt parkeerplekken weg in het centrum en maakt fietsenstallingen aantrekkelijker. Meer bezoekers overwegen een fiets te kopen. Het aantal fietsen in winkels verandert op korte termijn niet.',
        'Korte marktsituatie met veranderende voorkeur en vast aanbod.'
      )
    ],
    tasks: [
      {
        id: 'market-chain',
        family: 'step_ordering',
        skillLabel: 'Causale keten ordenen',
        purpose: 'Zet de economische stappen in een controleerbare volgorde.',
        prompt: 'Zet de schakels van de marktreactie in de juiste volgorde.',
        interaction: {
          stepBankLabel: 'Schakelbank',
          sequenceLabel: 'Opgebouwde keten',
          placeholder: 'Kies de schakels van oorzaak naar gevolg.',
          separator: ' -> ',
          steps: [
            { id: 'demand-up', label: 'De vraag naar fietsen neemt toe.', kind: 'answer' },
            { id: 'parking-change', label: 'Parkeren wordt minder aantrekkelijk.', kind: 'answer', internalRationale: 'Start uit de bron.' },
            { id: 'shortage', label: 'Er ontstaat een vraagoverschot.', kind: 'answer' },
            { id: 'demand-down', label: 'De vraag naar fietsen neemt af.', kind: 'distractor', distractorFor: 'demand-up' },
            { id: 'bike-attractive', label: 'Fietsen wordt relatief aantrekkelijker.', kind: 'answer' },
            { id: 'price-pressure', label: 'De evenwichtsprijs komt hoger uit.', kind: 'answer' },
            { id: 'supply-same', label: 'Het aanbod blijft eerst gelijk.', kind: 'answer' }
          ]
        },
        expected: withEvidence({
          kind: 'step_ordering',
          order: ['parking-change', 'bike-attractive', 'demand-up', 'supply-same', 'shortage', 'price-pressure'],
          partialFeedback: 'practice_only'
        }, 'ctx-market-source'),
        feedback: feedback(
          'Keten klopt',
          'De stappen lopen van bronoorzaak naar marktgevolg.',
          'Controleer de richting',
          'Let op: aantrekkelijker fietsen geeft meer vraag, niet minder.'
        ),
        practiceRoute: route('Door naar verbindingswoorden')
      },
      {
        id: 'market-connectors',
        family: 'cloze_tile_select',
        skillLabel: 'Verbanden in zinnen plaatsen',
        purpose: 'Maak van losse schakels leesbare redeneerzinnen.',
        prompt: 'Vul de verbindingswoorden in de zinnen aan.',
        interaction: {
          allowReuse: true,
          segments: [
            { type: 'text', text: 'Fietsen wordt aantrekkelijker, ' },
            { type: 'blank', blankId: 'c1' },
            { type: 'text', text: ' neemt de vraag naar fietsen toe. De vraag stijgt, ' },
            { type: 'blank', blankId: 'c2' },
            { type: 'text', text: ' het aanbod eerst gelijk blijft. Er ontstaat een vraagoverschot, ' },
            { type: 'blank', blankId: 'c3' },
            { type: 'text', text: ' komt de evenwichtsprijs hoger uit.' }
          ],
          blanks: [
            { id: 'c1', label: 'oorzaak-gevolg 1' },
            { id: 'c2', label: 'tegenstelling met aanbod' },
            { id: 'c3', label: 'conclusie' }
          ],
          tiles: [
            { id: 'daardoor', label: 'daardoor', kind: 'answer' },
            { id: 'terwijl', label: 'terwijl', kind: 'answer' },
            { id: 'dus', label: 'dus', kind: 'answer' },
            { id: 'maar', label: 'maar', kind: 'distractor', distractorFor: 'c1' }
          ]
        },
        expected: withEvidence({
          kind: 'cloze_tile_select',
          blanks: { c1: 'daardoor', c2: 'terwijl', c3: 'dus' }
        }, 'ctx-market-source'),
        feedback: feedback(
          'Zinnen lopen logisch',
          'De verbindingswoorden passen bij oorzaak, contrast en conclusie.',
          'Lees de hele zin',
          'Kies het woord dat de functie van de zin duidelijk maakt.'
        ),
        practiceRoute: route('Door naar het antwoord')
      },
      functionalAnswerTask({
        id: 'market-answer',
        prompt: 'Bouw de uitleg met oorzaak, mechanisme en conclusie.',
        template: '{{oorzaak}} {{mechanisme}} {{conclusie}}',
        rows: [
          {
            id: 'oorzaak',
            label: 'Oorzaak',
            options: [
              { id: 'parking', label: 'Door minder parkeerplekken wordt fietsen aantrekkelijker.', kind: 'answer' },
              { id: 'stock', label: 'Door meer voorraad fietsen verandert de markt.', kind: 'distractor', distractorFor: 'parking' }
            ]
          },
          {
            id: 'mechanisme',
            label: 'Mechanisme',
            options: [
              { id: 'excess-demand', label: 'De vraag stijgt terwijl het aanbod eerst gelijk blijft, waardoor een vraagoverschot ontstaat.', kind: 'answer' },
              { id: 'market-pressure', label: 'Er is alleen algemene druk op de markt.', kind: 'distractor', distractorFor: 'excess-demand' }
            ]
          },
          {
            id: 'conclusie',
            label: 'Conclusie',
            options: [
              { id: 'price-up', label: 'Daarom komt de evenwichtsprijs hoger uit.', kind: 'answer' },
              { id: 'price-down', label: 'Daarom komt de evenwichtsprijs lager uit.', kind: 'distractor', distractorFor: 'price-up' }
            ]
          }
        ],
        expectedRows: { oorzaak: 'parking', mechanisme: 'excess-demand', conclusie: 'price-up' },
        sourceEvidenceRefs: ['ctx-market-source'],
        matchTitle: 'Uitleg is compleet',
        matchText: 'Je antwoord bevat bronoorzaak, marktmechanisme en conclusie.',
        retryTitle: 'Maak de uitleg economischer',
        retryText: 'Zorg dat het mechanisme tussen oorzaak en prijs zichtbaar is.'
      })
    ]
  });

  return compositionBase({
    composition_id: 'reasoning-market-price-mechanism-composed-v1',
    title: 'Prijsmechanisme uitleggen',
    goal: 'Leg uit hoe een verandering rond parkeren doorwerkt in de fietsenmarkt.',
    archetype_id: 'causal_mechanism',
    selected_exemplar_ids: ['reasoning-market-price-mechanism-v3'],
    targetBrief: {
      reasoningTarget: 'Explain a market outcome through a causal demand and supply mechanism.',
      centralMisconception: 'The student jumps from situation to conclusion without market mechanism.',
      sourceEvidenceType: 'short market source',
      requiredAnswerForm: 'cause, mechanism, conclusion',
      mustNotTest: 'subtle language distinction between equivalent connectors',
      candidateArchetype: 'causal_mechanism',
      selectedGoldenExemplars: ['reasoning-market-price-mechanism-v3'],
      mechanicFit: 'The chain and sentence tasks expose the causal links before the answer builder.'
    },
    taskSet,
    proofScenarios: {
      partial: { responses: [{ taskId: 'market-chain', response: { order: ['parking-change', 'bike-attractive', 'demand-up'] }, check: false }] },
      wrong: { responses: [{ taskId: 'market-chain', response: { order: ['parking-change', 'demand-down', 'supply-same'] } }] },
      correct: {
        responses: [
          { taskId: 'market-chain', response: { order: ['parking-change', 'bike-attractive', 'demand-up', 'supply-same', 'shortage', 'price-pressure'] } },
          { taskId: 'market-connectors', response: { blanks: { c1: 'daardoor', c2: 'terwijl', c3: 'dus' } } },
          { taskId: 'market-answer', response: { rows: { oorzaak: 'parking', mechanisme: 'excess-demand', conclusie: 'price-up' } } }
        ]
      }
    }
  });
}

function choiceCompass() {
  const taskSet = withContextRefs({
    schema_version: 1,
    title: 'Schaarste en alternatieve kosten',
    contextBlocks: [
      markdownContext(
        'ctx-choice-source',
        'Situatie',
        'Eva heeft zaterdagmiddag vier uur. Ze kan werken voor 40 euro, leren voor economie ter waarde van 30 euro, of naar de film ter waarde van 15 euro. Ze kiest werken.',
        'Korte keuzecontext met beperkte tijd en vergelijkbare waarden voor drie alternatieven.'
      )
    ],
    tasks: [
      {
        id: 'choice-scarcity',
        family: 'multi_select',
        skillLabel: 'Schaarste herkennen',
        purpose: 'Kies de bronfeiten die laten zien dat Eva moet kiezen.',
        prompt: 'Kies precies twee feiten die schaarste laten zien.',
        interaction: {
          inputLabel: 'Bronfeiten',
          options: [
            { id: 'time-limited', label: 'Eva heeft maar vier uur.' },
            { id: 'activities-conflict', label: 'Ze kan de activiteiten niet allemaal tegelijk doen.' },
            { id: 'work-money', label: 'Werken levert 40 euro op.' },
            { id: 'movie-value', label: 'Naar de film is 15 euro waard.' }
          ]
        },
        expected: withEvidence({
          kind: 'multi_select',
          mode: 'exact_set',
          values: ['time-limited', 'activities-conflict'],
          partialFeedback: 'practice_only'
        }, 'ctx-choice-source'),
        feedback: feedback(
          'Schaarste is zichtbaar',
          'Je kiest beperkte tijd en de noodzaak om te kiezen.',
          'Kijk naar beperkt middel en keuze',
          'Niet elke waardevolle optie is automatisch schaarstebewijs.'
        ),
        practiceRoute: route('Door naar alternatieve kosten')
      },
      {
        id: 'choice-cost',
        family: 'choice',
        skillLabel: 'Alternatieve kosten kiezen',
        purpose: 'Kies het beste niet-gekozen alternatief.',
        prompt: 'Wat zijn Eva haar alternatieve kosten van werken?',
        interaction: {
          inputLabel: 'Alternatieve kosten',
          options: [
            { id: 'study', label: 'Leren voor economie', internalRationale: 'Beste niet-gekozen alternatief: 30 euro.' },
            { id: 'work', label: 'Werken voor 40 euro', internalRationale: 'Gekozen optie, dus geen alternatieve kosten.' },
            { id: 'study-plus-movie', label: 'Leren en film samen', internalRationale: 'Telt niet-gekozen opties onterecht op.' }
          ]
        },
        expected: withEvidence({ kind: 'choice', value: 'study' }, 'ctx-choice-source'),
        feedback: feedback(
          'Beste alternatief gekozen',
          'Alternatieve kosten zijn het beste alternatief dat Eva opgeeft.',
          'Kies niet de gekozen optie',
          'Alternatieve kosten zijn niet de som van alle alternatieven.'
        ),
        practiceRoute: route('Door naar uitleg')
      },
      functionalAnswerTask({
        id: 'choice-answer',
        prompt: 'Bouw een korte uitleg over schaarste en alternatieve kosten.',
        template: '{{scarcity}} {{cost}} {{notSum}}',
        rows: [
          {
            id: 'scarcity',
            label: 'Schaarste',
            options: [
              { id: 'limited-choice', label: 'Er is schaarste omdat Eva beperkte tijd heeft en moet kiezen.', kind: 'answer' },
              { id: 'no-scarcity-profit', label: 'Er is geen schaarste omdat werken geld oplevert.', kind: 'distractor', distractorFor: 'limited-choice' }
            ]
          },
          {
            id: 'cost',
            label: 'Kosten',
            options: [
              { id: 'best-forgone', label: 'De alternatieve kosten zijn leren voor economie.', kind: 'answer' },
              { id: 'chosen-work', label: 'De alternatieve kosten zijn werken voor 40 euro.', kind: 'distractor', distractorFor: 'best-forgone' }
            ]
          },
          {
            id: 'notSum',
            label: 'Niet optellen',
            options: [
              { id: 'not-all', label: 'Je telt niet alle niet-gekozen opties bij elkaar op.', kind: 'answer' },
              { id: 'all-options', label: 'Je telt leren en film samen op.', kind: 'distractor', distractorFor: 'not-all' }
            ]
          }
        ],
        expectedRows: { scarcity: 'limited-choice', cost: 'best-forgone', notSum: 'not-all' },
        sourceEvidenceRefs: ['ctx-choice-source'],
        matchTitle: 'Uitleg klopt',
        matchText: 'Je onderscheidt schaarste, gekozen optie en beste niet-gekozen alternatief.',
        retryTitle: 'Controleer de keuze',
        retryText: 'Gebruik beperkte tijd en het beste alternatief dat Eva opgeeft.'
      })
    ]
  });

  return compositionBase({
    composition_id: 'reasoning-choice-compass-composed-v1',
    title: 'Keuze en alternatieve kosten',
    goal: 'Gebruik de situatie om schaarste en alternatieve kosten uit elkaar te houden.',
    archetype_id: 'choice_and_evidence',
    selected_exemplar_ids: ['reasoning-1.1.1-choice-compass-v1'],
    targetBrief: {
      reasoningTarget: 'Select scarcity facts and identify the best forgone alternative.',
      centralMisconception: 'The chosen option or the sum of all alternatives is called opportunity cost.',
      sourceEvidenceType: 'short choice scenario',
      requiredAnswerForm: 'scarcity, cost, not-sum explanation',
      mustNotTest: 'six-step ordered flowchart',
      candidateArchetype: 'choice_and_evidence',
      selectedGoldenExemplars: ['reasoning-1.1.1-choice-compass-v1'],
      mechanicFit: 'Evidence selection and final answer rows preserve the choice reasoning without imposing artificial order.'
    },
    taskSet,
    proofScenarios: {
      partial: { responses: [{ taskId: 'choice-scarcity', response: { values: ['time-limited'] }, check: false }] },
      wrong: { responses: [{ taskId: 'choice-cost', response: { value: 'work' } }] },
      correct: {
        responses: [
          { taskId: 'choice-scarcity', response: { values: ['time-limited', 'activities-conflict'] } },
          { taskId: 'choice-cost', response: { value: 'study' } },
          { taskId: 'choice-answer', response: { rows: { scarcity: 'limited-choice', cost: 'best-forgone', notSum: 'not-all' } } }
        ]
      }
    }
  });
}

function indexCheck() {
  const taskSet = withContextRefs({
    schema_version: 1,
    title: 'Indexclaim controleren',
    contextBlocks: [
      markdownContext(
        'ctx-index-source',
        'Claim',
        'Een prijsindex stijgt van 120 naar 126. Een leerling schrijft: de prijs is met 6 procent gestegen.',
        'Korte indexclaim met oude en nieuwe indexwaarde.'
      )
    ],
    tasks: [
      {
        id: 'index-unit',
        family: 'choice',
        skillLabel: 'Eenheid herkennen',
        purpose: 'Bepaal wat 126 min 120 betekent.',
        prompt: 'Wat betekent het verschil 126 - 120 = 6?',
        interaction: {
          inputLabel: 'Betekenis van het verschil',
          options: [
            { id: 'index-points', label: '6 indexpunten', internalRationale: 'Het verschil tussen twee indexcijfers.' },
            { id: 'percent', label: '6 procent', internalRationale: 'Verwart indexpunten met procentuele verandering.' },
            { id: 'euro', label: '6 euro', internalRationale: 'Verwart indexcijfer met eurobedrag.' }
          ]
        },
        expected: withEvidence({ kind: 'choice', value: 'index-points' }, 'ctx-index-source'),
        feedback: feedback(
          'Eenheid klopt',
          'Het verschil tussen indexcijfers noem je indexpunten.',
          'Let op de eenheid',
          'Een verschil in indexcijfers is nog geen procentuele verandering.'
        ),
        practiceRoute: route('Door naar de controle')
      },
      {
        id: 'index-checks',
        family: 'multi_select',
        skillLabel: 'Controle kiezen',
        purpose: 'Kies twee manieren die dezelfde procentuele verandering controleren.',
        prompt: 'Kies twee geldige controles voor de procentuele stijging.',
        interaction: {
          inputLabel: 'Controles',
          options: [
            { id: 'index-base', label: '(126 - 120) / 120 x 100%' },
            { id: 'price-base', label: 'Nieuwe prijs min oude prijs, gedeeld door oude prijs x 100%' },
            { id: 'divide-new', label: '(126 - 120) / 126 x 100%' },
            { id: 'minus-is-percent', label: '126 - 120 is meteen 6%' }
          ]
        },
        expected: withEvidence({
          kind: 'multi_select',
          mode: 'exact_set',
          values: ['index-base', 'price-base'],
          partialFeedback: 'practice_only'
        }, 'ctx-index-source'),
        feedback: feedback(
          'Controles passen',
          'Beide controles gebruiken de oude waarde als basis.',
          'Controleer de basis',
          'De oude waarde is de basis voor procentuele verandering.'
        ),
        practiceRoute: route('Door naar de verbeterde claim')
      },
      functionalAnswerTask({
        id: 'index-answer',
        prompt: 'Verbeter de claim met eenheid, basis en conclusie.',
        template: '{{unit}} {{base}} {{claim}}',
        rows: [
          {
            id: 'unit',
            label: 'Eenheid',
            options: [
              { id: 'six-points', label: 'Het verschil is 6 indexpunten.', kind: 'answer' },
              { id: 'six-percent', label: 'Het verschil is 6 procent.', kind: 'distractor', distractorFor: 'six-points' }
            ]
          },
          {
            id: 'base',
            label: 'Basis',
            options: [
              { id: 'old-120', label: 'Je deelt door de oude index 120.', kind: 'answer' },
              { id: 'new-126', label: 'Je deelt door de nieuwe index 126.', kind: 'distractor', distractorFor: 'old-120' }
            ]
          },
          {
            id: 'claim',
            label: 'Claim',
            options: [
              { id: 'five-percent', label: 'De stijging is 5 procent, dus de claim 6 procent klopt niet.', kind: 'answer' },
              { id: 'six-ok', label: 'De claim 6 procent klopt omdat 126 - 120 = 6.', kind: 'distractor', distractorFor: 'five-percent' }
            ]
          }
        ],
        expectedRows: { unit: 'six-points', base: 'old-120', claim: 'five-percent' },
        sourceEvidenceRefs: ['ctx-index-source'],
        matchTitle: 'Claim is verbeterd',
        matchText: 'Je onderscheidt indexpunten, basis en procentuele verandering.',
        retryTitle: 'Controleer de basis',
        retryText: 'Gebruik de oude index als referentie.'
      })
    ]
  });

  return compositionBase({
    composition_id: 'reasoning-index-check-composed-v1',
    title: 'Indexclaim verbeteren',
    goal: 'Controleer of een uitspraak over indexpunten en procenten precies genoeg is.',
    archetype_id: 'reference_value_and_claim_repair',
    selected_exemplar_ids: ['reasoning-1.1.2-index-check-v1'],
    targetBrief: {
      reasoningTarget: 'Repair an index claim by separating difference, unit, reference value and conclusion.',
      centralMisconception: 'Subtracting index numbers is treated as a percent change.',
      sourceEvidenceType: 'index values and claim',
      requiredAnswerForm: 'unit, reference value, corrected claim',
      mustNotTest: 'calculation drill only',
      candidateArchetype: 'reference_value_and_claim_repair',
      selectedGoldenExemplars: ['reasoning-1.1.2-index-check-v1'],
      mechanicFit: 'Choice and equivalence selection reveal the reference-value reasoning before answer repair.'
    },
    taskSet,
    proofScenarios: {
      partial: { responses: [{ taskId: 'index-checks', response: { values: ['index-base'] }, check: false }] },
      wrong: { responses: [{ taskId: 'index-unit', response: { value: 'percent' } }] },
      correct: {
        responses: [
          { taskId: 'index-unit', response: { value: 'index-points' } },
          { taskId: 'index-checks', response: { values: ['index-base', 'price-base'] } },
          { taskId: 'index-answer', response: { rows: { unit: 'six-points', base: 'old-120', claim: 'five-percent' } } }
        ]
      }
    }
  });
}

function graphEditorial() {
  const graph = {
    title: 'Vraag naar broodjes',
    altText: 'Grafiek waarin bij prijs 2 de hoeveelheid 600 is en bij prijs 8 de hoeveelheid 300 is.',
      axes: {
        x: { label: 'Prijs P', min: 0, max: 10, ticks: [0, 2, 5, 8, 10] },
        y: { label: 'Hoeveelheid Q', min: 0, max: 700, ticks: [300, 600] }
      },
    series: [
      {
        label: 'Vraag',
        points: [
          { id: 'p2-q600', x: 2, y: 600, label: 'P=2, Q=600', kind: 'answer' },
          { id: 'p8-q300', x: 8, y: 300, label: 'P=8, Q=300', kind: 'answer' },
          { id: 'p5-estimate', x: 5, y: 450, label: 'P=5 op de lijn', kind: 'distractor', distractorFor: 'p2-q600', pathPoint: false }
        ]
      }
    ]
  };
  const taskSet = withContextRefs({
    schema_version: 1,
    title: 'Grafiekclaim redigeren',
    contextBlocks: [
      markdownContext(
        'ctx-graph-claim',
        'Claim',
        'Een kop boven een artikel zegt: als de prijs van broodjes stijgt van 2 naar 8 euro, halveert de verkoop altijd.',
        'Korte claim die met grafiekwaarden moet worden begrensd.'
      ),
      {
        id: 'ctx-graph-table',
        type: 'table',
        sourceLabel: 'Tabel 1',
        caption: 'Tabel 1: Prijs en hoeveelheid broodjes',
        sourceMaterialId: 'broodjes-vraag',
        columns: ['Prijs P', 'Hoeveelheid Q'],
        rows: [[2, 600], [8, 300]],
        altText: 'Tabel met waargenomen prijzen 2 en 8 en hoeveelheden 600 en 300.'
      }
    ],
    tasks: [
      {
        id: 'graph-points',
        family: 'graph_evidence_selector',
        skillLabel: 'Grafiekpunten kiezen',
        purpose: 'Kies direct de punten waarop de claim steunt.',
        prompt: 'Kies de twee waargenomen punten die de kop vergelijkt.',
        interaction: {
          maxSelections: 2,
          hitTargetPx: 44,
          trayLabel: 'Gekozen punten',
          placeholder: 'Kies twee punten in de grafiek.',
          graph
        },
        expected: withEvidence({
          kind: 'graph_evidence_selector',
          pointIds: ['p2-q600', 'p8-q300'],
          partialFeedback: 'practice_only'
        }, ['ctx-graph-claim', 'ctx-graph-table']),
        feedback: feedback(
          'Punten passen',
          'Deze twee waargenomen punten horen bij de vergelijking in de kop.',
          'Kies de waargenomen eindpunten',
          'Gebruik de punten die de kop daadwerkelijk vergelijkt.'
        ),
        practiceRoute: route('Door naar claimtaal')
      },
      {
        id: 'graph-estimate-status',
        family: 'choice',
        skillLabel: 'Schatting begrenzen',
        purpose: 'Maak onderscheid tussen waarnemen, schatten en te exact formuleren.',
        prompt: 'Wat mag je bij P=5 zeggen op basis van de lijn tussen de waargenomen punten?',
        reasoningOperationSignature: 'observation_vs_interpolation_epistemic_status',
        interaction: {
          inputLabel: 'Uitspraak bij P=5',
          options: [
            { id: 'approx-450', label: 'Q is ongeveer 450 broodjes.', internalRationale: 'Verdedigbare interpolatie op de getekende lijn.' },
            { id: 'exact-450', label: 'Q is precies 450 broodjes.', internalRationale: 'Overclaimt exactheid; P=5 staat niet als waarneming in de tabel.' },
            { id: 'no-statement', label: 'Je kunt niets zeggen tussen P=2 en P=8.', internalRationale: 'Negeert dat de getekende lijn een schatting ondersteunt.' }
          ]
        },
        expected: withEvidence({
          kind: 'choice',
          value: 'approx-450',
          operationSignature: 'observation_vs_interpolation_epistemic_status',
          epistemicStatus: 'supported_estimate_not_exact_observation',
          estimateAtX: 5
        }, ['ctx-graph-claim', 'ctx-graph-table']),
        feedback: feedback(
          'Schatting goed begrensd',
          'Bij P=5 kun je de lijn gebruiken voor ongeveer 450, maar niet doen alsof het een exact waargenomen tabelpunt is.',
          'Let op exact of ongeveer',
          'Gebruik de lijn als schatting en de tabel voor wat direct is waargenomen.'
        ),
        practiceRoute: route('Door naar claimtaal')
      },
      {
        id: 'graph-scope',
        family: 'choice',
        skillLabel: 'Claimsterkte kiezen',
        purpose: 'Kies taal die bij de bron past.',
        prompt: 'Welke formulering past het best bij de grafiek?',
        interaction: {
          inputLabel: 'Formulering',
          options: [
            { id: 'observed-interval', label: 'Tussen P=2 en P=8 daalt Q van 600 naar 300.', internalRationale: 'Blijft bij waargenomen punten.' },
            { id: 'always-half', label: 'Elke prijsstijging halveert de verkoop.', internalRationale: 'Maakt een te algemene regel.' },
            { id: 'cause-only-price', label: 'De prijs is de enige oorzaak van de daling.', internalRationale: 'De grafiek toont geen volledige oorzaak op zichzelf.' }
          ]
        },
        expected: withEvidence({ kind: 'choice', value: 'observed-interval' }, ['ctx-graph-claim', 'ctx-graph-table']),
        feedback: feedback(
          'Claim is voorzichtig',
          'Je blijft bij wat de grafiek ondersteunt.',
          'Maak de claim minder algemeen',
          'Een grafiekvergelijking is geen algemene wet of volledige oorzaak.'
        ),
        practiceRoute: route('Door naar conclusie')
      },
      functionalAnswerTask({
        id: 'graph-answer',
        prompt: 'Bouw een redactieadvies met waarden, interpretatie en grens.',
        template: '{{values}} {{interpretation}} {{scope}}',
        rows: [
          {
            id: 'values',
            label: 'Waarden',
            options: [
              { id: 'observed-values', label: 'Bij P=2 is Q=600 en bij P=8 is Q=300.', kind: 'answer' },
              { id: 'exact-middle', label: 'Bij P=5 is Q exact 450 door de lijn.', kind: 'distractor', distractorFor: 'observed-values' }
            ]
          },
          {
            id: 'interpretation',
            label: 'Interpretatie',
            options: [
              { id: 'interval-drop', label: 'In dit interval is de hoeveelheid lager bij de hogere prijs.', kind: 'answer' },
              { id: 'causal-proof', label: 'Daarmee is de prijs de volledige oorzaak.', kind: 'distractor', distractorFor: 'interval-drop' }
            ]
          },
          {
            id: 'scope',
            label: 'Grens',
            options: [
              { id: 'headline-too-strong', label: 'Het woord altijd is te sterk voor deze bron.', kind: 'answer' },
              { id: 'headline-correct', label: 'De kop is in alle situaties precies.', kind: 'distractor', distractorFor: 'headline-too-strong' }
            ]
          }
        ],
        expectedRows: { values: 'observed-values', interpretation: 'interval-drop', scope: 'headline-too-strong' },
        sourceEvidenceRefs: ['ctx-graph-claim', 'ctx-graph-table'],
        matchTitle: 'Advies is begrensd',
        matchText: 'Je gebruikt de grafiekwaarden zonder een te sterke algemene claim.',
        retryTitle: 'Beperk de conclusie',
        retryText: 'Gebruik wat de bron laat zien en vermijd woorden als altijd.'
      })
    ]
  });

  return compositionBase({
    composition_id: 'reasoning-graph-editorial-composed-v1',
    title: 'Grafiekclaim redigeren',
    goal: 'Gebruik grafiekwaarden om te bepalen hoe sterk een kop mag zijn.',
    archetype_id: 'graph_evidence_and_epistemic_scope',
    selected_exemplar_ids: ['reasoning-1.1.3-graph-editorial-v2'],
    targetBrief: {
      reasoningTarget: 'Use observed graph values and interpolated estimates to bound an editorial claim.',
      centralMisconception: 'A comparison between two points becomes either an exact middle observation or a universal causal rule.',
      sourceEvidenceType: 'claim, table and graph',
      requiredAnswerForm: 'values, interpretation, scope',
      mustNotTest: 'graph construction',
      candidateArchetype: 'graph_evidence_and_epistemic_scope',
      selectedGoldenExemplars: ['reasoning-1.1.3-graph-editorial-v2'],
      mechanicFit: 'Graph point selection, estimate-status choice and answer rows preserve observation-versus-interpolation reasoning.'
    },
    taskSet,
    proofScenarios: {
      partial: { responses: [{ taskId: 'graph-points', response: { pointIds: ['p2-q600'] }, check: false }] },
      wrong: { responses: [{ taskId: 'graph-estimate-status', response: { value: 'exact-450' } }] },
      correct: {
        responses: [
          { taskId: 'graph-points', response: { pointIds: ['p2-q600', 'p8-q300'] } },
          { taskId: 'graph-estimate-status', response: { value: 'approx-450' } },
          { taskId: 'graph-scope', response: { value: 'observed-interval' } },
          { taskId: 'graph-answer', response: { rows: { values: 'observed-values', interpretation: 'interval-drop', scope: 'headline-too-strong' } } }
        ]
      }
    }
  });
}

function blindTransferDemandFactors() {
  const taskSet = withContextRefs({
    schema_version: 1,
    title: 'Vraagfactoren transfer',
    contextBlocks: [
      markdownContext(
        'ctx-demand-source',
        'Situatie uit 1.2.2',
        'De prijs van boter blijft 2 euro. Op het journaal vertellen wetenschappers dat margarine ongezond is. De volgende week kopen consumenten meer boter.',
        'Korte bron over boter en margarine met prijs- en koopinformatie.'
      )
    ],
    tasks: [
      {
        id: 'demand-factor',
        family: 'choice',
        skillLabel: 'Vraagfactor kiezen',
        purpose: 'Bepaal of de eigen prijs verandert of een andere vraagfactor.',
        prompt: 'Welke oorzaak verandert de vraag naar boter?',
        interaction: {
          inputLabel: 'Oorzaak',
          options: [
            { id: 'substitute-preference', label: 'Het nieuws over margarine.', internalRationale: 'Raakt voorkeuren en substituten.' },
            { id: 'own-price', label: 'Een hogere boterprijs.', internalRationale: 'In de bron blijft de prijs van boter gelijk.' },
            { id: 'supply-change', label: 'Minder aanbod van boter.', internalRationale: 'De bron gaat over vraag, niet aanbod.' }
          ]
        },
        expected: withEvidence({ kind: 'choice', value: 'substitute-preference' }, 'ctx-demand-source'),
        feedback: feedback(
          'Vraagfactor gekozen',
          'De eigen prijs van boter blijft gelijk; een andere factor verandert de vraag.',
          'Lees de prijszin nauwkeurig',
          'Als de eigen prijs gelijk blijft, zoek je een vraagfactor.'
        ),
        practiceRoute: route('Door naar richting')
      },
      {
        id: 'demand-chain',
        family: 'step_ordering',
        skillLabel: 'Vraagverschuiving ordenen',
        purpose: 'Zet de redenering van bron naar grafiekactie op volgorde.',
        prompt: 'Orden de stappen voor de vraaglijn van boter.',
        interaction: {
          stepBankLabel: 'Schakelbank',
          sequenceLabel: 'Opgebouwde redenering',
          placeholder: 'Kies de schakels.',
          separator: ' -> ',
          steps: [
            { id: 'butter-more', label: 'Bij dezelfde prijs willen consumenten meer boter.', kind: 'answer' },
            { id: 'movement', label: 'Je beweegt langs dezelfde vraaglijn omhoog.', kind: 'distractor', distractorFor: 'shift-right' },
            { id: 'price-same', label: 'De prijs van boter blijft gelijk.', kind: 'answer' },
            { id: 'shift-right', label: 'De vraaglijn van boter verschuift naar rechts.', kind: 'answer' },
            { id: 'margarine-less', label: 'Margarine wordt minder aantrekkelijk.', kind: 'answer' }
          ]
        },
        expected: withEvidence({
          kind: 'step_ordering',
          order: ['price-same', 'margarine-less', 'butter-more', 'shift-right'],
          partialFeedback: 'practice_only'
        }, 'ctx-demand-source'),
        feedback: feedback(
          'Redenering past',
          'Je maakt onderscheid tussen eigen prijs en vraagfactor.',
          'Controleer verschuiving of beweging',
          'Bij dezelfde eigen prijs en meer vraag verschuift de lijn.'
        ),
        practiceRoute: route('Door naar antwoord')
      },
      functionalAnswerTask({
        id: 'demand-answer',
        prompt: 'Bouw het antwoord met oorzaak, onderscheid en richting.',
        template: '{{cause}} {{distinction}} {{direction}}',
        rows: [
          {
            id: 'cause',
            label: 'Oorzaak',
            options: [
              { id: 'other-factor', label: 'De oorzaak is een andere vraagfactor dan de eigen prijs van boter.', kind: 'answer' },
              { id: 'own-price-cause', label: 'De oorzaak is een hogere prijs van boter.', kind: 'distractor', distractorFor: 'other-factor' }
            ]
          },
          {
            id: 'distinction',
            label: 'Onderscheid',
            options: [
              { id: 'same-price', label: 'Omdat de prijs gelijk blijft, beweeg je niet langs de bestaande lijn.', kind: 'answer' },
              { id: 'same-line', label: 'Omdat de prijs gelijk blijft, blijft de hele vraag gelijk.', kind: 'distractor', distractorFor: 'same-price' }
            ]
          },
          {
            id: 'direction',
            label: 'Richting',
            options: [
              { id: 'right-shift', label: 'De vraaglijn verschuift naar rechts: bij elke prijs willen consumenten meer boter.', kind: 'answer' },
              { id: 'left-shift', label: 'De vraaglijn verschuift naar links: bij elke prijs willen consumenten minder boter.', kind: 'distractor', distractorFor: 'right-shift' }
            ]
          }
        ],
        expectedRows: { cause: 'other-factor', distinction: 'same-price', direction: 'right-shift' },
        sourceEvidenceRefs: ['ctx-demand-source'],
        matchTitle: 'Transferantwoord klopt',
        matchText: 'Je onderscheidt eigen prijs, vraagfactor en verschuiving.',
        retryTitle: 'Maak het onderscheid scherper',
        retryText: 'Gebruik de prijszin en de richting van de vraagverandering.'
      })
    ]
  });

  return compositionBase({
    composition_id: 'blind-transfer-1.2.2-demand-factors-v1',
    title: 'Blind transfer: vraagfactoren',
    goal: 'Bepaal of een nieuwe situatie een beweging langs of een verschuiving van de vraaglijn geeft.',
    archetype_id: 'causal_mechanism',
    selected_exemplar_ids: ['reasoning-market-price-mechanism-v3', 'reasoning-1.1.1-choice-compass-v1'],
    targetBrief: {
      reasoningTarget: 'Distinguish own-price movement from a demand-shift caused by another factor.',
      centralMisconception: 'Every change in quantity is treated as movement along the same demand line.',
      sourceEvidenceType: 'unseen 1.2.2 source paragraph about butter and margarine',
      requiredAnswerForm: 'cause, distinction, direction',
      mustNotTest: 'drawing the graph as the main challenge',
      candidateArchetype: 'causal_mechanism',
      selectedGoldenExemplars: ['reasoning-market-price-mechanism-v3', 'reasoning-1.1.1-choice-compass-v1'],
      mechanicFit: 'The product grammar transfers: source fact, causal chain, and visible answer functions. The reasoning grammar is re-derived for demand factors.'
    },
    taskSet,
    proofScenarios: {
      partial: { responses: [{ taskId: 'demand-chain', response: { order: ['price-same', 'margarine-less'] }, check: false }] },
      wrong: { responses: [{ taskId: 'demand-factor', response: { value: 'own-price' } }] },
      correct: {
        responses: [
          { taskId: 'demand-factor', response: { value: 'substitute-preference' } },
          { taskId: 'demand-chain', response: { order: ['price-same', 'margarine-less', 'butter-more', 'shift-right'] } },
          { taskId: 'demand-answer', response: { rows: { cause: 'other-factor', distinction: 'same-price', direction: 'right-shift' } } }
        ]
      }
    },
    blindTransfer: {
      unseenParagraph: '1.2.2 Vraagfactoren',
      sourceChecked: 'Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren/1.2.2 Vraagfactoren – paragraaf.md',
      noHumanMicroSpecification: true,
      transferRule: 'copy product grammar; re-derive reasoning grammar'
    }
  });
}

const exemplarCompositions = [
  marketPriceMechanism(),
  choiceCompass(),
  indexCheck(),
  graphEditorial()
];

const blindTransfer = blindTransferDemandFactors();

module.exports = {
  authority,
  exemplarCompositions,
  blindTransfer,
  allCompositions: exemplarCompositions.concat([blindTransfer])
};
