#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SPRINT_ID = 'Y2-FOUR-TARGET-CROSS-REPO-LESSON-PRODUCTION-1';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const REPORT_DIR = path.join(PLATFORM_ROOT, 'reports', 'review-gates', SPRINT_ID);
const GENERATED_ON = '2026-06-26';
const LESSON_OUTPUT_ROOT = 'year2-candidate-lessons/four-target-lesson-production-1';

const AUTHORITY_CLAIMS = {
  cross_repo_lesson_candidate_output_created_for_review: true,
  all_four_owner_paragraphs_included: true,
  source_context_first_layout: true,
  advisory_short_checks_created: true,
  target_equivalent_exit_ticket_candidates_created: true,
  rendered_candidate_output_created: true,
  active_v5_registry_mutated: false,
  external_source_mutation_authorized: false,
  live_mtu_registry_mutated: false,
  operation_registry_mutation_authorized: false,
  answer_skill_registry_mutation_authorized: false,
  broad_operation_row_closure_authorized: false,
  product_route_adoption_authorized: false,
  product_authority: false,
  cp6_closure_authorized: false,
  scale_gate_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  student_use_authorized: false,
  student_product_use_authorized: false,
  autonomous_merge_authorized: false
};

const SOURCE_INPUTS = {
  governed_support_handoff: 'reports/review-gates/Y2-GOVERNED-SUPPORT-CLOSURE-BUNDLE-1/generator-handoff-manifests.json',
  lesson_eligibility_overlay: 'references/data/year2-target-foundation/lesson-production-eligibility-overlay.json',
  canonical_source_assets: 'references/data/year2-target-foundation/canonical-source-assets.json',
  answer_contracts: 'references/data/year2-target-foundation/answer-contracts.json',
  target_candidates: 'references/authored/year2-v6-target-foundation-candidates.json',
  original_sprint_gate_spec: 'reports/review-gates/Y2-GOVERNED-SUPPORT-CLOSURE-BUNDLE-1/review-packet.json',
  book_architecture: 'reports/reference-planning/Y2-ROOT-MAPPING-1-book-architecture.md'
};

const ROUTES = [
  {
    record_id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    owner_id: 'Y2-B5-P13',
    book: 5,
    paragraph_code: '5.4.2',
    book_folder: 'Boek 5 - Tijd, voorraden en pensioenen',
    chapter_folder: '5.4 Hoofdstuk Duurzaamheid en bronanalyse',
    paragraph_folder: '5.4.2 Pensioenmodel en koopkracht',
    title: 'Pensioenmodel en koopkracht',
    route_label: 'Pensioenmodel bronroute',
    lesson_goal: 'Gebruik het officiele pensioenmodel om ruilen over de tijd, voorraad/grootheid, indexatie, verhoudingen en koopkracht uit te leggen.',
    prerequisites: ['Pensioenstelsel', 'indexatie', 'voorraad en stroomgrootheid', 'ruilen over de tijd'],
    source_refs: [
      'references/external/exams/vw-1022-a-25-2-o.pdf#page=4-5',
      'references/data/year2-target-foundation/canonical-source-assets.json#figuur-1-pensioenmodel-2024-2044',
      'references/data/year2-target-foundation/canonical-source-assets.json#pensioenmodel-assumptions-a-f'
    ],
    source_blocks: [
      {
        kind: 'pension_chart',
        label: 'Bron 1',
        title: 'Pensioenmodel 2024-2044',
        body: 'De figuur is een schematisch model. Gebruik de richting van de lijnen en staven, niet losse exacte getallen uit de tekening.',
        facts: [
          'pensioenvermogen stijgt in verhouding tot bbp',
          'premiedruk als deel van pensioenvermogen daalt',
          'pensioenuitgaven volgen welvaartsindexatie'
        ]
      },
      {
        kind: 'table',
        label: 'Bron 2',
        title: 'Aannames bij het model',
        columns: ['Aannames', 'Waarde of regel'],
        rows: [
          ['Inflatie per jaar', '2%'],
          ['Reele economische groei per jaar', '0.5%'],
          ['Rendement pensioenvermogen per jaar', '3.5%'],
          ['Premiedruk als percentage van bbp', 'constant'],
          ['Aantal premiebetalers', 'constant']
        ],
        alt: 'Tabel met aannames over inflatie, reele groei, rendement, premiedruk en premiebetalers.'
      }
    ],
    explanation: [
      {
        heading: 'Lees eerst de bronrichting',
        text: 'Het model laat ontwikkelingen door de tijd zien. Een stroomgrootheid hoort bij een periode, een voorraadgrootheid bij een moment.'
      },
      {
        heading: 'Koppel aannames aan het mechanisme',
        text: 'Inflatie en reele groei verhogen nominaal inkomen. Als pensioenen welvaartsgeindexeerd zijn, bewegen uitgaven mee met dat inkomen.'
      },
      {
        heading: 'Maak de verhouding zichtbaar',
        text: 'Als pensioenvermogen sneller groeit dan bbp, kan een premie die constant blijft als bbp-deel toch dalen als aandeel van pensioenvermogen.'
      }
    ],
    practice_steps: [
      'Markeer welke bronzin over een moment gaat en welke over een periode.',
      'Leg in twee schakels uit waarom welvaartsindexatie hogere pensioenuitgaven geeft.',
      'Formuleer een verhouding: premie vergeleken met pensioenvermogen.'
    ],
    short_check: [
      {
        id: 'stock-flow',
        prompt: 'Netto opgebouwd pensioensparen wordt gemeten op een peildatum. Wat past daarbij?',
        options: [
          ['a', 'Een voorraadgrootheid.'],
          ['b', 'Een stroomgrootheid per jaar.'],
          ['c', 'Alleen een prijsindex.']
        ],
        answer: 'a',
        feedback: 'Een peildatum wijst op een voorraadgrootheid.'
      },
      {
        id: 'indexation',
        prompt: 'Welke bronkoppeling verklaart stijgende pensioenuitgaven?',
        options: [
          ['a', 'Inflatie en reele groei verhogen nominaal inkomen; indexatie laat uitgaven meebewegen.'],
          ['b', 'Alleen het aantal premiebetalers bepaalt de uitgaven.'],
          ['c', 'Een constant bbp-deel betekent dat alle verhoudingen gelijk blijven.']
        ],
        answer: 'a',
        feedback: 'De twee schakels zijn inkomen omhoog en uitgaven mee via indexatie.'
      },
      {
        id: 'ratio',
        prompt: 'Waarom kan premie als deel van pensioenvermogen dalen?',
        options: [
          ['a', 'Omdat pensioenvermogen sneller stijgt dan de premiegrondslag.'],
          ['b', 'Omdat je exacte punten uit de schets mag aflezen.'],
          ['c', 'Omdat inflatie altijd nul is.']
        ],
        answer: 'a',
        feedback: 'Gebruik de richting van de verhouding, niet exacte getallen uit de schets.'
      }
    ],
    exit_ticket: [
      {
        id: 'classify-saving',
        prompt: 'Classificeer opgebouwd pensioensparen als voorraad of stroom en onderbouw met de bron.',
        required_groups: [['voorraad', 'moment', 'peildatum'], ['pensioen', 'opgebouwd']]
      },
      {
        id: 'indexation-chain',
        prompt: 'Leg in twee schakels uit waarom welvaartsindexatie hogere pensioenuitgaven kan geven.',
        required_groups: [['inflatie', 'reele groei', 'nominaal inkomen'], ['indexatie', 'meebewegen', 'uitgaven']]
      },
      {
        id: 'premium-wealth',
        prompt: 'Leg uit waarom premie als deel van pensioenvermogen kan dalen terwijl premie als bbp-deel constant blijft.',
        required_groups: [['pensioenvermogen', 'vermogen'], ['bbp', 'constant'], ['verhouding', 'aandeel', 'daalt']]
      }
    ],
    exit_ticket_model: 'Een goed antwoord gebruikt de pensioensource eerst, noemt voorraad versus stroom, en maakt daarna een tweeschakelsuitleg met verhouding of koopkracht.'
  },
  {
    record_id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    owner_id: 'Y2-B6-P12',
    book: 6,
    paragraph_code: '6.4.2',
    book_folder: 'Boek 6 - Rente, obligaties en woningmarkt',
    chapter_folder: '6.4 Hoofdstuk Financiele broncases',
    paragraph_folder: '6.4.2 Woningfinanciering en huurmarkt',
    title: 'Woningfinanciering en huurmarkt',
    route_label: 'VastWonen en Reder bronroute',
    lesson_goal: 'Gebruik de VastWonen/Reder-bronnen om wachtlijst, omzetmaximale productie, hypotheekrisico en huurmarktgegevens te verklaren.',
    prerequisites: ['vraagfunctie', 'totale opbrengst', 'marginale opbrengst', 'inkomenselasticiteit', 'hypotheekrente'],
    source_refs: [
      'references/external/exams/vw-1022-a-23-2-o.pdf#page=12-13',
      'references/data/year2-target-foundation/canonical-source-assets.json#tabel-1-vastwonen-financial-data',
      'references/data/year2-target-foundation/canonical-source-assets.json#tabel-2-particuliere-huurwoningen-reder'
    ],
    source_blocks: [
      {
        kind: 'table',
        label: 'Bron 1',
        title: 'VastWonen sociale huur',
        columns: ['Gegeven', 'Waarde'],
        rows: [
          ['Maximale huur', 'EUR 850'],
          ['Vraag bij maximale huur', '10,400 woningen'],
          ['Woningvoorraad', '6,800 woningen'],
          ['Gemiddelde opbrengst', 'GO = -0.125Q + 2,150'],
          ['Omzetmaximale Q', '8,600 woningen'],
          ['Omzetmaximale huur', 'EUR 1,075']
        ],
        alt: 'Tabel met huur, vraag, voorraad, opbrengstfunctie en omzetmaximale keuze.'
      },
      {
        kind: 'table',
        label: 'Bron 2',
        title: 'Particuliere huurmarkt Reder',
        columns: ['Gegeven', 'Waarde'],
        rows: [
          ['Vrijkomende huurwoningen', '-9.9%'],
          ['Gemiddelde huur', '+6%'],
          ['Middeninkomens', '+3%'],
          ['Inkomenselasticiteit', '+0.4']
        ],
        alt: 'Tabel met aanbod, huur, middeninkomens en inkomenselasticiteit.'
      }
    ],
    explanation: [
      {
        heading: 'Begin bij de wachtlijst',
        text: 'Vraag bij EUR 850 is 10,400 woningen. Trek de voorraad van 6,800 woningen af om de wachtlijst te vinden.'
      },
      {
        heading: 'Gebruik opbrengst voor de keuze',
        text: 'De omzetmaximale keuze gebruikt Q = 8,600 en P = EUR 1,075. De opbrengst is Q maal P.'
      },
      {
        heading: 'Verbind finance met huurmarkt',
        text: 'Lage hypotheekrente verlaagt rentelasten. Een krappe huurmarkt kan huurinkomsten stabieler maken, terwijl inkomensgroei met positieve elasticiteit de vraag ondersteunt.'
      }
    ],
    practice_steps: [
      'Kies alleen vraag en voorraad voor de wachtlijst.',
      'Bereken totale opbrengst met Q maal P.',
      'Maak een bronketen van inkomensgroei, positieve elasticiteit en krapper aanbod naar hogere huur.'
    ],
    short_check: [
      {
        id: 'waiting-list',
        prompt: 'Welke berekening hoort bij de wachtlijst bij EUR 850?',
        options: [
          ['a', '10,400 - 6,800 = 3,600 woningen.'],
          ['b', '8,600 - 6,800 = 1,800 woningen.'],
          ['c', '1,075 x 8,600 = 9,245,000 euro.']
        ],
        answer: 'a',
        feedback: 'Voor de wachtlijst gebruik je vraag bij de maximale huur min voorraad.'
      },
      {
        id: 'revenue',
        prompt: 'Welke opbrengst hoort bij Q = 8,600 en P = EUR 1,075?',
        options: [
          ['a', 'EUR 9,245,000.'],
          ['b', 'EUR 3,600.'],
          ['c', 'EUR 1,400,000.']
        ],
        answer: 'a',
        feedback: 'Totale opbrengst is Q maal P: 8,600 x 1,075.'
      },
      {
        id: 'rent-chain',
        prompt: 'Welke bronketen verklaart hogere huur?',
        options: [
          ['a', 'Middeninkomens stijgen, elasticiteit is positief, en minder woningen komen vrij.'],
          ['b', 'Elasticiteit is negatief en aanbod stijgt sterk.'],
          ['c', 'Alleen hypotheekrente bepaalt de huur.']
        ],
        answer: 'a',
        feedback: 'Vraagdruk en een beperkter aanbod ondersteunen de huurtoename.'
      }
    ],
    exit_ticket: [
      {
        id: 'waiting-list-open',
        prompt: 'Bereken de wachtlijst bij EUR 850 en noem de eenheid.',
        required_groups: [['10400', '10,400'], ['6800', '6,800'], ['3600', '3,600'], ['woningen']]
      },
      {
        id: 'revenue-open',
        prompt: 'Bereken de totale opbrengst bij Q = 8,600 en P = EUR 1,075.',
        required_groups: [['8600', '8,600'], ['1075', '1,075'], ['9245000', '9,245,000'], ['eur', 'euro']]
      },
      {
        id: 'rent-market-open',
        prompt: 'Leg met Bron 2 uit waarom de huur kan stijgen.',
        required_groups: [['middeninkomens', 'inkomen'], ['elasticiteit', 'positief'], ['vrijkomende', 'aanbod', '-9.9'], ['huur', 'stijgt']]
      }
    ],
    exit_ticket_model: 'Een goed antwoord rekent met bronwaarden, bewaart eenheden, gebruikt de juiste opbrengst- en marginale-opbrengststappen, en sluit af met een brongebonden huurmarktuitleg.'
  },
  {
    record_id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    owner_id: 'Y2-B7-P13',
    book: 7,
    paragraph_code: '7.4.1',
    book_folder: 'Boek 7 - Risico, verzekering en informatie',
    chapter_folder: '7.4 Hoofdstuk Risicobronnen',
    paragraph_folder: '7.4.1 Kredietverzekering en informatieproblemen',
    title: 'Kredietverzekering en informatieproblemen',
    route_label: 'Kredietverzekering bronroute',
    lesson_goal: 'Gebruik de kredietverzekeringsbron om informatieproblemen, prikkels, verwachte schade en premieopslag te verklaren.',
    prerequisites: ['verwachte waarde', 'moreel risico', 'averechtse selectie', 'principaal-agent', 'verzekeringspremie'],
    source_refs: [
      'references/external/exams/vw-1022-a-23-1-o.pdf#page=6-7',
      'references/data/year2-target-foundation/canonical-source-assets.json#figuur-1-kredietverzekering-en-voorwaarden',
      'references/data/year2-target-foundation/canonical-source-assets.json#tabel-1-financiele-gegevens-digibate'
    ],
    source_blocks: [
      {
        kind: 'flow',
        label: 'Bron 1',
        title: 'Kredietverzekering en voorwaarden',
        body: 'Leverancier, kredietverzekeraar en kopende onderneming hebben verschillende informatie en prikkels. Incassokosten worden bij de kopende onderneming gelegd.',
        facts: [
          'kredietverzekeraar is principaal',
          'kopende onderneming is agent',
          'incassokosten bij koper verminderen wanbetalingsprikkel',
          'bonus-malus en eigen risico veranderen claimprikkels'
        ]
      },
      {
        kind: 'table',
        label: 'Bron 2',
        title: 'Financiele gegevens Digibate',
        columns: ['Contracten', 'Omzet per contract', 'Kans op wanbetaling'],
        rows: [
          ['20', 'EUR 1,000,000', '0.05%'],
          ['30', 'EUR 500,000', '0.2%'],
          ['80', 'EUR 250,000', '0.2%']
        ],
        alt: 'Tabel met aantallen contracten, omzet per contract en kans op wanbetaling.'
      }
    ],
    explanation: [
      {
        heading: 'Benoem actor en prikkel',
        text: 'De verzekeraar wil minder wanbetaling en minder onzorgvuldig gedrag. De kopende onderneming reageert op kosten en voorwaarden.'
      },
      {
        heading: 'Reken verwachte schade apart uit',
        text: 'Gebruik contractaantal maal omzet per contract maal kans op wanbetaling per rij. De goedgekeurde route geeft EUR 80,000 verwachte schade.'
      },
      {
        heading: 'Voeg premieopslag toe',
        text: 'Een opslag van 20% betekent vermenigvuldigen met 1.20. De totale premie wordt EUR 96,000.'
      }
    ],
    practice_steps: [
      'Koppel principaal en agent aan de juiste actoren.',
      'Leg een verzekeringsvoorwaarde uit als prikkelverandering.',
      'Bereken verwachte schade en voeg 20% opslag toe.'
    ],
    short_check: [
      {
        id: 'principal-agent',
        prompt: 'Welke actorrol past bij deze bronroute?',
        options: [
          ['a', 'Kredietverzekeraar principaal, kopende onderneming agent.'],
          ['b', 'Leverancier principaal, verzekeraar agent.'],
          ['c', 'Alle partijen hebben dezelfde prikkel.']
        ],
        answer: 'a',
        feedback: 'De verzekeraar stelt voorwaarden om gedrag van de koper te sturen.'
      },
      {
        id: 'collection-cost',
        prompt: 'Waarom kunnen incassokosten bij de koper het informatieprobleem verminderen?',
        options: [
          ['a', 'De koper krijgt een financiele prikkel om op tijd te betalen.'],
          ['b', 'De verzekeraar betaalt altijd alle kosten zelf.'],
          ['c', 'De leverancier hoeft geen premie meer te betalen.']
        ],
        answer: 'a',
        feedback: 'De voorwaarde verandert de prikkel van de kopende onderneming.'
      },
      {
        id: 'markup',
        prompt: 'Welke premie volgt uit EUR 80,000 verwachte schade en 20% opslag?',
        options: [
          ['a', 'EUR 96,000.'],
          ['b', 'EUR 64,000.'],
          ['c', 'EUR 80,020.']
        ],
        answer: 'a',
        feedback: 'Vermenigvuldig met 1.20.'
      }
    ],
    exit_ticket: [
      {
        id: 'actor-condition',
        prompt: 'Noem principaal en agent en leg uit hoe incassokosten de prikkel veranderen.',
        required_groups: [['kredietverzekeraar', 'verzekeraar'], ['principaal'], ['kopende onderneming', 'koper'], ['agent'], ['incassokosten', 'kosten'], ['prikkel', 'wanbetaling']]
      },
      {
        id: 'expected-damage',
        prompt: 'Bereken de totale premie vanuit EUR 80,000 verwachte schade en 20% opslag.',
        required_groups: [['80000', '80,000'], ['1.20', '20%'], ['96000', '96,000'], ['eur', 'euro']]
      },
      {
        id: 'information-chain',
        prompt: 'Leg een voorwaarde uit die moreel risico of averechtse selectie vermindert.',
        required_groups: [['bonus-malus', 'eigen risico', 'verplicht'], ['prikkel', 'selectie', 'risico'], ['verzekeraar', 'koper', 'leverancier']]
      }
    ],
    exit_ticket_model: 'Een goed antwoord bindt actorrollen aan de bron, gebruikt een tweeschakels prikkelverklaring, en rekent de premie als EUR 80,000 maal 1.20.'
  },
  {
    record_id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    owner_id: 'Y2-B8-P04',
    book: 8,
    paragraph_code: '8.1.4',
    book_folder: 'Boek 8 - Strategie, publieke goederen en groei',
    chapter_folder: '8.1 Hoofdstuk Strategische interactie',
    paragraph_folder: '8.1.4 Zelfbinding en prijzenoorlog',
    title: 'Zelfbinding en prijzenoorlog',
    route_label: 'Guarda en Orso Bianco bronroute',
    lesson_goal: 'Gebruik de Guarda/Orso Bianco-bron om dominante strategie, prisoners dilemma, zelfbinding en prijsprikkels uit te leggen.',
    prerequisites: ['strategische interactie', 'dominante strategie', 'prisoners dilemma', 'zelfbinding', 'prijsgarantie'],
    source_refs: [
      'references/external/exams/vw-1022-a-25-1-o.pdf#page=7',
      'references/data/year2-target-foundation/canonical-source-assets.json#ijssalon-guarda-orso-bianco-context',
      'references/data/year2-target-foundation/canonical-source-assets.json#lowest-price-guarantee-self-binding-source',
      'references/data/year2-target-foundation/canonical-source-assets.json#derived-payoff-representation'
    ],
    source_blocks: [
      {
        kind: 'flow',
        label: 'Bron 1',
        title: 'Guarda en Orso Bianco',
        body: 'Orso Bianco komt de markt binnen met een lagere prijs. Consumenten zien de ijsjes als perfecte substituten.',
        facts: [
          'Guarda verliest monopoliepositie',
          'Orso Bianco opent met lagere prijs',
          'beide bedrijven hebben dezelfde productiekosten',
          'perfecte substituten versterken de prijsprikkel'
        ]
      },
      {
        kind: 'payoff',
        label: 'Afgeleide kaart',
        title: 'Afgeleide prikkelkaart, niet de officiele bron',
        body: 'Gebruik deze kaart alleen na Bron 1. De kaart ordent prikkels, maar vervangt de bron niet.',
        facts: [
          'ieder bedrijf heeft een prikkel om prijs te verlagen',
          'gezamenlijk kan een prijzenoorlog slechter uitpakken',
          'laagsteprijsgarantie maakt zelfbinding geloofwaardiger'
        ]
      }
    ],
    explanation: [
      {
        heading: 'Officiele context eerst',
        text: 'Start met de bronfeiten: lagere prijs, perfecte substituten en dezelfde kosten. Pas daarna mag je een afgeleide prikkelkaart gebruiken.'
      },
      {
        heading: 'Dominante strategie en dilemma',
        text: 'Als elke onderneming individueel voordeel ziet in verlagen, kan de uitkomst voor beiden slechter zijn dan samenwerken.'
      },
      {
        heading: 'Zelfbinding verandert prikkels',
        text: 'Een laagsteprijsgarantie maakt de belofte geloofwaardiger en verkleint voor de ander de winst van een prijzenoorlog.'
      }
    ],
    practice_steps: [
      'Benoem eerst het bronfeit over perfecte substituten.',
      'Leg de individuele prijsprikkel uit.',
      'Gebruik zelfbinding om de veranderde prikkel van de concurrent te verklaren.'
    ],
    short_check: [
      {
        id: 'source-order',
        prompt: 'Wat komt eerst in de uitleg?',
        options: [
          ['a', 'De officiele context over prijzen en substituten.'],
          ['b', 'Een afgeleide kaart als enige bron.'],
          ['c', 'Alleen een algemene definitie van speltheorie.']
        ],
        answer: 'a',
        feedback: 'De broncontext blijft leidend; de kaart is alleen een hulpmiddel.'
      },
      {
        id: 'dominant-strategy',
        prompt: 'Waarom is prijs verlagen aantrekkelijk voor elk bedrijf afzonderlijk?',
        options: [
          ['a', 'Omdat consumenten de ijsjes als perfecte substituten zien.'],
          ['b', 'Omdat beide bedrijven verplicht samenwerken.'],
          ['c', 'Omdat een hogere prijs altijd meer klanten geeft.']
        ],
        answer: 'a',
        feedback: 'Bij perfecte substituten kan een lagere prijs klanten aantrekken.'
      },
      {
        id: 'self-binding',
        prompt: 'Wat doet een laagsteprijsgarantie in deze bronroute?',
        options: [
          ['a', 'Zij maakt de belofte om een lagere prijs te volgen geloofwaardiger.'],
          ['b', 'Zij maakt alle prijzen wettelijk vast.'],
          ['c', 'Zij verwijdert alle concurrentie.']
        ],
        answer: 'a',
        feedback: 'De garantie verandert de verwachte opbrengst van prijsverlaging door de ander.'
      }
    ],
    exit_ticket: [
      {
        id: 'dominant-open',
        prompt: 'Leg uit waarom prijs verlagen voor elk bedrijf afzonderlijk aantrekkelijk kan zijn.',
        required_groups: [['prijs', 'verlagen'], ['perfecte substituten', 'substituten'], ['klanten', 'vraag', 'afzet']]
      },
      {
        id: 'dilemma-open',
        prompt: 'Leg uit waarom de uitkomst een prisoners dilemma kan zijn.',
        required_groups: [['individueel', 'ieder'], ['gezamenlijk', 'beide'], ['slechter', 'prijzenoorlog']]
      },
      {
        id: 'binding-open',
        prompt: 'Leg in twee schakels uit hoe een laagsteprijsgarantie de prikkel van Orso Bianco verandert.',
        required_groups: [['garantie', 'laagsteprijs'], ['geloofwaardig', 'zelfbinding'], ['prikkel', 'minder voordeel', 'prijs verlagen']]
      }
    ],
    exit_ticket_model: 'Een goed antwoord gebruikt de officiele context eerst, labelt de prikkelkaart als afgeleid, en geeft twee expliciete schakels voor zelfbinding.'
  }
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(PLATFORM_ROOT, relativePath), 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function html(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function attr(value) {
  return html(value);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function rel(...parts) {
  return parts.join('/').replace(/\\/g, '/');
}

function routeOutput(route) {
  const base = rel(LESSON_OUTPUT_ROOT, `book-${route.book}`, `${route.paragraph_code}-${slug(route.title)}`);
  return {
    base,
    plan: rel(base, '_paragraph-plan.md'),
    index: rel(base, 'index.html'),
    route: rel(base, `${route.paragraph_code}-route.html`),
    short_check: rel(base, `${route.paragraph_code}-korte-check.html`),
    exit_ticket: rel(base, `${route.paragraph_code}-exit-ticket.html`),
    contract: rel(base, 'route-contract.json')
  };
}

function pathInsideLessonOutput(outputPath) {
  return outputPath.startsWith(`${LESSON_OUTPUT_ROOT}/`)
    ? outputPath.slice(LESSON_OUTPUT_ROOT.length + 1)
    : outputPath;
}

function generatedRoutes() {
  return ROUTES.map((route) => ({
    ...route,
    output: routeOutput(route),
    route_contract: {
      record_id: route.record_id,
      target_owner_candidate_id: route.owner_id,
      paragraph_code: route.paragraph_code,
      lesson_goal: route.lesson_goal,
      source_refs: route.source_refs,
      prerequisites: route.prerequisites,
      required_surfaces: ['route', 'advisory_short_check', 'target_equivalent_exit_ticket_candidate'],
      target_equivalent_exit_ticket_requirements: route.exit_ticket.map((task) => task.prompt),
      authority_boundary: 'generated_candidate_lesson_output_for_review_only_no_product_route_adoption_no_student_product_use'
    }
  }));
}

function validateInputs() {
  const handoff = readJson(SOURCE_INPUTS.governed_support_handoff);
  const overlay = readJson(SOURCE_INPUTS.lesson_eligibility_overlay);
  const candidates = readJson(SOURCE_INPUTS.target_candidates);
  const assets = readJson(SOURCE_INPUTS.canonical_source_assets);

  const handoffRecords = new Set((handoff.records || []).map((record) => record.record_id));
  const overlayRecords = new Set((overlay.records || []).map((record) => record.record_id));
  const candidateRecords = new Set((candidates.records || []).map((record) => record.id));
  const assetRecords = new Set((assets.records || []).map((record) => record.record_id));
  for (const route of ROUTES) {
    if (!handoffRecords.has(route.record_id)) throw new Error(`Missing handoff record: ${route.record_id}`);
    if (!overlayRecords.has(route.record_id)) throw new Error(`Missing eligibility overlay record: ${route.record_id}`);
    if (!candidateRecords.has(route.record_id)) throw new Error(`Missing candidate record: ${route.record_id}`);
    if (!assetRecords.has(route.record_id)) throw new Error(`Missing canonical asset record: ${route.record_id}`);
  }
}

function renderSourceBlock(block) {
  if (block.kind === 'table') {
    return `<section class="source-block visual-object">
      <p class="source-label">${html(block.label)}</p>
      <h3>${html(block.title)}</h3>
      <div class="table-wrap"><table aria-label="${attr(block.alt || block.title)}">
        <thead><tr>${block.columns.map((column) => `<th>${html(column)}</th>`).join('')}</tr></thead>
        <tbody>${block.rows.map((row) => `<tr>${row.map((cell) => `<td>${html(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </section>`;
  }
  if (block.kind === 'pension_chart') {
    return `<section class="source-block source-figure visual-object">
      <p class="source-label">${html(block.label)}</p>
      <h3>${html(block.title)}</h3>
      <p>${html(block.body)}</p>
      <div class="pension-visual" role="img" aria-label="Schematische pensioenfiguur met stijgend pensioenvermogen en dalende premiedruk als aandeel van vermogen.">
        <div class="bars"><span style="height:34%"></span><span style="height:48%"></span><span style="height:66%"></span><span style="height:82%"></span></div>
        <svg viewBox="0 0 320 150" aria-hidden="true">
          <polyline points="20,105 110,88 205,62 300,35" fill="none" stroke="#1e5b6f" stroke-width="5" stroke-linecap="round" />
          <polyline points="20,48 110,64 205,85 300,112" fill="none" stroke="#8a3ffc" stroke-width="5" stroke-linecap="round" />
        </svg>
      </div>
      <ul>${block.facts.map((fact) => `<li>${html(fact)}</li>`).join('')}</ul>
    </section>`;
  }
  if (block.kind === 'payoff') {
    return `<section class="source-block visual-object">
      <p class="source-label">${html(block.label)}</p>
      <h3>${html(block.title)}</h3>
      <p>${html(block.body)}</p>
      <div class="payoff-map" role="img" aria-label="Afgeleide prikkelkaart met prijs hoog en prijs laag voor twee aanbieders.">
        <span></span><b>Orso hoog</b><b>Orso laag</b>
        <b>Guarda hoog</b><p>rustige markt</p><p>Guarda verliest vraag</p>
        <b>Guarda laag</b><p>Guarda wint vraag</p><p>prijzenoorlog</p>
      </div>
      <ul>${block.facts.map((fact) => `<li>${html(fact)}</li>`).join('')}</ul>
    </section>`;
  }
  return `<section class="source-block visual-object">
    <p class="source-label">${html(block.label)}</p>
    <h3>${html(block.title)}</h3>
    <p>${html(block.body)}</p>
    <ul>${block.facts.map((fact) => `<li>${html(fact)}</li>`).join('')}</ul>
  </section>`;
}

function css() {
  return `:root{--ink:#1f2937;--muted:#5f6b7a;--line:#d7dde5;--paper:#fff;--wash:#f4f7fb;--accent:#176b87;--accent2:#7f4acb;--good:#0f766e;--warn:#9a3412}
:root[data-theme="dark"]{--ink:#f5f7fb;--muted:#c2ccda;--line:#405064;--paper:#182232;--wash:#0f1724;--accent:#62c7e7;--accent2:#c59bff;--good:#5eead4;--warn:#fdba74}
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;line-height:1.55;color:var(--ink);background:var(--wash)}a{color:var(--accent)}header{background:#ffffff;border-bottom:1px solid var(--line)}.top{max-width:1120px;margin:0 auto;padding:22px 20px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}h1{font-size:clamp(28px,4vw,44px);line-height:1.1;margin:6px 0 8px}h2{font-size:24px;margin:0 0 12px}h3{font-size:18px;margin:0 0 8px}.sub{max-width:780px;color:var(--muted);font-size:17px}.page{max-width:1120px;margin:0 auto;padding:24px 20px 48px}.layout{display:grid;grid-template-columns:minmax(280px,420px) minmax(0,1fr);gap:20px;align-items:start}.source-pane,.work-pane,.panel,.task{background:var(--paper);border:1px solid var(--line);border-radius:8px}.source-pane,.work-pane{padding:18px}.source-pane{position:sticky;top:12px}.source-block{border-top:1px solid var(--line);padding-top:16px;margin-top:16px}.source-block:first-child{border-top:0;padding-top:0;margin-top:0}.source-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);font-weight:800;margin:0 0 5px}ul{padding-left:20px}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}th{background:#eef5f7}.steps{display:grid;gap:12px}.step{border-left:4px solid var(--accent);padding:12px 14px;background:#f9fbfd;border-radius:6px}.route-nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.route-nav a,.button,button{border:1px solid var(--accent);background:#fff;color:var(--accent);border-radius:6px;padding:10px 12px;font-weight:700;text-decoration:none;cursor:pointer}.route-nav a.primary,.button.primary,button.primary{background:var(--accent);color:white}.task{padding:16px;margin:0 0 14px}.choice-grid{display:grid;gap:9px;margin-top:10px}.choice{display:block;width:100%;text-align:left}.choice[aria-pressed=true]{background:#e6f4f1;border-color:var(--good);color:var(--good)}.feedback{margin-top:10px;padding:10px;border-radius:6px;background:#f7fafc;border:1px solid var(--line)}.feedback.good{border-color:var(--good);color:var(--good);background:#ecfdf5}.feedback.warn{border-color:var(--warn);color:var(--warn);background:#fff7ed}textarea{width:100%;min-height:110px;border:1px solid var(--line);border-radius:6px;padding:10px;font:inherit;resize:vertical;background:var(--paper);color:var(--ink)}.answer-note{color:var(--muted);font-size:14px}.pension-visual{position:relative;height:180px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(#fff,#eef7fb);overflow:hidden}.pension-visual .bars{position:absolute;left:24px;right:24px;bottom:22px;height:120px;display:flex;align-items:end;gap:22px}.pension-visual .bars span{flex:1;background:#b7d7e8;border-radius:6px 6px 0 0}.pension-visual svg{position:absolute;inset:14px;width:calc(100% - 28px);height:150px}.payoff-map{display:grid;grid-template-columns:110px 1fr 1fr;border:1px solid var(--line);border-radius:8px;overflow:hidden}.payoff-map>*{padding:10px;border:1px solid var(--line);margin:0}.payoff-map b{background:#eef5f7}.payoff-map p{background:#fff}.meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.meta-grid .panel{padding:14px}.bundle-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.bundle-list a{display:block;background:#fff;border:1px solid var(--line);border-radius:8px;padding:16px;text-decoration:none;color:var(--ink)}.bundle-list strong{display:block;color:var(--accent);margin-bottom:4px}:root[data-theme="dark"] header{background:#182232}:root[data-theme="dark"] th,:root[data-theme="dark"] .step,:root[data-theme="dark"] .payoff-map b{background:#223149}:root[data-theme="dark"] .route-nav a,:root[data-theme="dark"] .button,:root[data-theme="dark"] button{background:#101827;color:var(--accent)}:root[data-theme="dark"] .route-nav a.primary,:root[data-theme="dark"] .button.primary,:root[data-theme="dark"] button.primary{background:var(--accent);color:#09111d}:root[data-theme="dark"] .choice[aria-pressed=true]{background:#103a35}:root[data-theme="dark"] .feedback{background:#101827}:root[data-theme="dark"] .feedback.good{background:#0b302d}:root[data-theme="dark"] .feedback.warn{background:#3a2414}:root[data-theme="dark"] .pension-visual{background:linear-gradient(#142033,#20334a)}:root[data-theme="dark"] .pension-visual .bars{background:transparent}:root[data-theme="dark"] .pension-visual .bars span{background:#3e6a82}:root[data-theme="dark"] .payoff-map p,:root[data-theme="dark"] .bundle-list a{background:var(--paper)}@media (max-width:820px){.layout{grid-template-columns:1fr}.source-pane{position:static}.meta-grid,.bundle-list{grid-template-columns:1fr}}`;
}

function scriptForInteractive() {
  return `<script>
(function(){
  function norm(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\s+/g,' ');}
  document.addEventListener('click',function(event){
    var choice=event.target.closest('[data-answer]');
    if(choice){
      var task=choice.closest('[data-task]');
      task.querySelectorAll('[data-answer]').forEach(function(btn){btn.setAttribute('aria-pressed','false');});
      choice.setAttribute('aria-pressed','true');
      var ok=choice.getAttribute('data-answer')===task.getAttribute('data-correct');
      var fb=task.querySelector('[data-feedback]');
      fb.className='feedback '+(ok?'good':'warn');
      fb.textContent=ok?task.getAttribute('data-good'):task.getAttribute('data-retry');
      return;
    }
    var check=event.target.closest('[data-open-check]');
    if(check){
      var task=check.closest('[data-open-task]');
      var text=norm(task.querySelector('textarea').value);
      var groups=JSON.parse(task.getAttribute('data-required'));
      var missing=groups.filter(function(group){return !group.some(function(term){return text.indexOf(norm(term))!==-1;});});
      var fb=task.querySelector('[data-feedback]');
      if(missing.length===0){
        fb.className='feedback good';
        fb.textContent='Je antwoord bevat de bronstappen die bij deze vraag horen.';
      }else{
        fb.className='feedback warn';
        fb.textContent='Werk je antwoord aan met meer bronwaarden, actorrollen of een duidelijke tweede schakel.';
      }
    }
  });
})();
</script>`;
}

function shell(route, title, active, body) {
  const output = routeOutput(route);
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(route.paragraph_code)} ${html(route.title)} - ${html(title)}</title>
  <style>${css()}</style>
</head>
<body>
  <header>
    <div class="top">
      <p class="eyebrow">${html(route.paragraph_code)} ${html(route.title)}</p>
      <h1>${html(title)}</h1>
      <p class="sub">${html(route.lesson_goal)}</p>
      <nav class="route-nav" aria-label="Lesonderdelen">
        <a class="${active === 'index' ? 'primary' : ''}" href="${html(path.basename(output.index))}">Overzicht</a>
        <a class="${active === 'route' ? 'primary' : ''}" href="${html(path.basename(output.route))}">Uitleg en oefenen</a>
        <a class="${active === 'short' ? 'primary' : ''}" href="${html(path.basename(output.short_check))}">Korte check</a>
        <a class="${active === 'exit' ? 'primary' : ''}" href="${html(path.basename(output.exit_ticket))}">Exit ticket</a>
      </nav>
    </div>
  </header>
  <main class="page">
${body}
  </main>
${scriptForInteractive()}
</body>
</html>`;
}

function sourcePane(route) {
  return `<aside class="source-pane" aria-label="Bronnen">
    ${route.source_blocks.map(renderSourceBlock).join('\n')}
  </aside>`;
}

function routePage(route) {
  const body = `<div class="layout lesson-shell">
  ${sourcePane(route)}
  <section class="work-pane">
    <h2>Uitlegroute</h2>
    <div class="steps">
      ${route.explanation.map((item, index) => `<article class="step"><p class="source-label">Stap ${index + 1}</p><h3>${html(item.heading)}</h3><p>${html(item.text)}</p></article>`).join('\n')}
    </div>
    <h2 style="margin-top:24px">Oefenroute</h2>
    ${route.practice_steps.map((step, index) => `<article class="task"><p class="source-label">Oefening ${index + 1}</p><p>${html(step)}</p><p class="answer-note">Schrijf je redenering eerst in bronwoorden en maak daarna pas de conclusie.</p></article>`).join('\n')}
  </section>
</div>`;
  return shell(route, 'Uitleg en oefenen', 'route', body);
}

function shortCheckPage(route) {
  const body = `<div class="layout lesson-shell">
  ${sourcePane(route)}
  <section class="work-pane">
    <h2>Korte check</h2>
    <p class="answer-note">Gebruik je keuze om te bepalen welke oefenstap je nog wilt herhalen.</p>
    ${route.short_check.map((task, index) => `<article class="task" data-task="${attr(task.id)}" data-correct="${attr(task.answer)}" data-good="${attr(task.feedback)}" data-retry="Lees de bron nog eens en probeer de oefenstap opnieuw.">
      <p class="source-label">Vraag ${index + 1}</p>
      <h3>${html(task.prompt)}</h3>
      <div class="choice-grid">
        ${task.options.map(([id, label]) => `<button type="button" class="choice" data-answer="${attr(id)}" aria-pressed="false">${html(id.toUpperCase())}. ${html(label)}</button>`).join('\n')}
      </div>
      <div class="feedback" data-feedback aria-live="polite">Kies een antwoord.</div>
    </article>`).join('\n')}
  </section>
</div>`;
  return shell(route, 'Korte check', 'short', body);
}

function exitTicketPage(route) {
  const output = routeOutput(route);
  const body = `<div class="layout lesson-shell" id="exit-ticket-app">
  ${sourcePane(route)}
  <section class="work-pane">
    <h2>Exit ticket</h2>
    <p class="answer-note">Beantwoord elke vraag met bronwoorden, berekening of twee duidelijke schakels.</p>
    <nav class="route-nav" aria-label="Oefenroute">
      <a class="et-route-card" href="${html(path.basename(output.route))}">Uitleg en oefenen</a>
      <a class="et-route-card" href="${html(path.basename(output.short_check))}">Korte check</a>
    </nav>
    ${route.exit_ticket.map((task, index) => `<article class="task et-task" data-open-task="${attr(task.id)}" data-required="${attr(JSON.stringify(task.required_groups))}">
      <p class="source-label">Vraag ${index + 1}</p>
      <h3>${html(task.prompt)}</h3>
      <textarea aria-label="${attr(task.prompt)}"></textarea>
      <button type="button" class="primary" data-open-check>Controleer lokaal</button>
      <div class="feedback" data-feedback aria-live="polite">Nog niet gecontroleerd.</div>
    </article>`).join('\n')}
    <article class="task">
      <h3>Waar een volledig antwoord aan voldoet</h3>
      <p>${html(route.exit_ticket_model)}</p>
    </article>
  </section>
</div>`;
  return shell(route, 'Exit ticket', 'exit', body);
}

function paragraphIndex(route) {
  const output = routeOutput(route);
  const body = `<section class="panel" style="padding:18px">
    <h2>${html(route.route_label)}</h2>
    <p>${html(route.lesson_goal)}</p>
    <div class="meta-grid" style="margin:16px 0">
      <div class="panel"><p class="source-label">Voorkennis</p><p>${route.prerequisites.map(html).join(', ')}</p></div>
      <div class="panel"><p class="source-label">Bronnen</p><p>${route.source_refs.map(html).join('<br>')}</p></div>
    </div>
    <nav class="route-nav">
      <a class="primary" href="${html(path.basename(output.route))}">Uitleg en oefenen</a>
      <a href="${html(path.basename(output.short_check))}">Korte check</a>
      <a href="${html(path.basename(output.exit_ticket))}">Exit ticket</a>
    </nav>
  </section>`;
  return shell(route, 'Overzicht', 'index', body);
}

function paragraphPlan(route) {
  return `# Paragraph Plan: ${route.paragraph_code} ${route.title}

Generated by ${SPRINT_ID} on ${GENERATED_ON}.

## Product End-State And Original Spec

Product end-state: complete student-facing Year 2 candidate routes for the reviewed owner paragraph, with source-first explanation, advisory short check, and target-equivalent exit-ticket candidate.

Original sprint/gate spec:
- ${SOURCE_INPUTS.original_sprint_gate_spec}
- ${SOURCE_INPUTS.governed_support_handoff}
- ${SOURCE_INPUTS.lesson_eligibility_overlay}

## Non-Negotiable Requirements

- Preserve owner paragraph ${route.owner_id} and record ${route.record_id}.
- Use the approved source family before tasks.
- Include route, short check, and exit ticket.
- Do not claim product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.

## Core-Requirement Checklist

| Requirement | Status |
|---|---|
| Paragraph target alignment | met |
| Student-facing explanation and practice route | met |
| Advisory short check | met |
| Target-equivalent exit-ticket candidate | met |
| Source-first layout | met |
| Authority boundary preserved | met |

## Source References

${route.source_refs.map((source) => `- ${source}`).join('\n')}

## Practice Route

${route.practice_steps.map((step) => `- ${step}`).join('\n')}

## Exit Ticket Candidate

${route.exit_ticket.map((task) => `- ${task.prompt}`).join('\n')}
`;
}

function bundleIndex(routes) {
  const links = routes.map((route) => {
    const output = routeOutput(route);
    const href = pathInsideLessonOutput(output.index);
    return `<a href="${attr(href)}"><strong>${html(route.paragraph_code)} ${html(route.title)}</strong><span>${html(route.route_label)}</span></a>`;
  }).join('\n');
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Year 2 candidate lessons</title>
  <style>${css()}</style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Year 2 candidate bundle</p><h1>Vier bronroutes</h1><p class="sub">Kies een route voor uitleg, korte check en exit ticket.</p></div></header>
  <main class="page"><section class="bundle-list">${links}</section></main>
</body>
</html>`;
}

function lessonManifest(routes) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'generated_candidate_lesson_output_for_cross_repo_product_review',
    platform_source: {
      repository: 'meijer1973/4veco-platform',
      report_dir: `reports/review-gates/${SPRINT_ID}`
    },
    lesson_output_root: LESSON_OUTPUT_ROOT,
    records: routes.map((route) => ({
      record_id: route.record_id,
      target_owner_candidate_id: route.owner_id,
      paragraph_code: route.paragraph_code,
      title: route.title,
      output: route.output,
      surfaces: {
        route: route.output.route,
        advisory_short_check: route.output.short_check,
        target_equivalent_exit_ticket_candidate: route.output.exit_ticket
      },
      required_source_refs: route.source_refs,
      exit_ticket_prompts: route.exit_ticket.map((task) => task.prompt)
    })),
    authority_claims: AUTHORITY_CLAIMS
  };
}

function collectScreenshotProof() {
  const screenshotDir = path.join(REPORT_DIR, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    return {
      status: 'pending',
      proof_required_to_close: 'Run scripts/qa-student-web-pages.js against the twelve route/check/exit-ticket pages.'
    };
  }
  const files = fs.readdirSync(screenshotDir)
    .filter((file) => file.endsWith('.png'))
    .sort();
  const cases = files.map((file) => {
    const name = file.replace(/\.png$/, '');
    const parts = name.split('-');
    return {
      file: `reports/review-gates/${SPRINT_ID}/screenshots/${file}`,
      paragraph: parts.slice(0, 3).join('.'),
      surface: parts.slice(3, -2).join('-'),
      viewport: parts[parts.length - 2],
      theme: parts[parts.length - 1]
    };
  });
  return {
    status: 'captured',
    screenshot_dir: `reports/review-gates/${SPRINT_ID}/screenshots`,
    manifest_json: `reports/review-gates/${SPRINT_ID}/screenshot-manifest.json`,
    manifest_md: `reports/review-gates/${SPRINT_ID}/screenshot-manifest.md`,
    screenshot_count: files.length,
    expected_count: 48,
    qa_command: 'node scripts/qa-student-web-pages.js reports/review-gates/Y2-FOUR-TARGET-CROSS-REPO-LESSON-PRODUCTION-1/screenshots <twelve generated route/check/exit-ticket pages>',
    cases
  };
}

function writeScreenshotManifest(proof) {
  if (!proof || proof.status !== 'captured') return;
  writeFile(path.join(REPORT_DIR, 'screenshot-manifest.json'), JSON.stringify(proof, null, 2) + '\n');
  const rows = proof.cases.map((item) => `| ${item.paragraph} | ${item.surface} | ${item.viewport} | ${item.theme} | \`${item.file}\` |`).join('\n');
  writeFile(path.join(REPORT_DIR, 'screenshot-manifest.md'), `# ${SPRINT_ID} Screenshot Manifest

Rendered QA command: \`${proof.qa_command}\`

Screenshot count: ${proof.screenshot_count}/${proof.expected_count}

| Paragraph | Surface | Viewport | Theme | File |
|---|---|---|---|---|
${rows}
`);
}

function platformBundle(routes, screenshotProof = collectScreenshotProof()) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    status: 'four_target_cross_repo_lesson_candidate_bundle_ready_for_lead_review',
    product_end_state: 'Complete source-first candidate lesson routes for all four reviewed Year 2 owner paragraphs, paired with generated lesson output for product review.',
    original_sprint_gate_spec: SOURCE_INPUTS,
    non_negotiable_requirements: [
      'Include all four owner paragraphs in one bundle.',
      'Cite product end-state and original sprint/gate spec.',
      'Use approved source assets before tasks.',
      'Include explanation/practice route, advisory short check, and target-equivalent exit-ticket candidate for every paragraph.',
      'Preserve the no-product-route-adoption and no-student-use authority boundary.',
      'Require human review before merge because this is protected Year 2 product-authority work.'
    ],
    records: routes.map((route) => ({
      record_id: route.record_id,
      target_owner_candidate_id: route.owner_id,
      paragraph_code: route.paragraph_code,
      lesson_goal: route.lesson_goal,
      source_refs: route.source_refs,
      prerequisites: route.prerequisites,
      source_blocks: route.source_blocks,
      explanation: route.explanation,
      practice_steps: route.practice_steps,
      short_check: route.short_check,
      exit_ticket: route.exit_ticket,
      lesson_output: route.output,
      core_requirement_checklist: {
        paragraph_plan_target_alignment: true,
        student_facing_explanation_practice_route: true,
        advisory_short_check: true,
        target_equivalent_exit_ticket_candidate: true,
        source_first_layout: true,
        rendered_candidate_output: true,
        authority_boundary_preserved: true
      },
      carried_issues: [
        {
          issue_id: 'product-route-and-student-use-still-blocked',
          classification: 'scale_blocker',
          blocks: 'product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product use',
          does_not_block: 'human review of this cross-repo candidate lesson-production bundle',
          proof_required_to_close: 'separate product-proof gate after human-approved rendered output and authority review'
        }
      ]
    })),
    rendered_screenshot_proof: screenshotProof,
    cross_repo_merge_order: [
      '1. Merge platform authoritative source/generator PR after READY_FOR_HUMAN_REVIEW owner authorization.',
      '2. Merge paired 4veco-lessen generated candidate-output PR after platform PR lands and exact-head readiness is renewed.',
      '3. Do not route product adoption or student use from this merge.'
    ],
    lead_review_requirements: [
      'economics/source fidelity',
      'teacher feasibility',
      'source/visual fidelity',
      'task-shell/runtime',
      'answer-form/exit-ticket equivalence',
      'accessibility/mobile',
      'authority/completion-language'
    ],
    authority_claims: AUTHORITY_CLAIMS
  };
}

function reviewPacketMarkdown(bundle) {
  const rows = bundle.records.map((record) => `| ${record.target_owner_candidate_id} | ${record.paragraph_code} | route + short check + exit-ticket candidate | met |`).join('\n');
  const screenshotLine = bundle.rendered_screenshot_proof && bundle.rendered_screenshot_proof.status === 'captured'
    ? `Rendered proof: ${bundle.rendered_screenshot_proof.screenshot_count}/${bundle.rendered_screenshot_proof.expected_count} screenshots captured. See \`${bundle.rendered_screenshot_proof.manifest_md}\`.`
    : `Rendered proof: pending screenshot capture. ${bundle.rendered_screenshot_proof.proof_required_to_close}`;
  return `# ${SPRINT_ID} Review Packet

Status: generated for lead review and human product review.

## Product End-State And Original Sprint/Gate Spec

Product end-state: ${bundle.product_end_state}

Original sprint/gate/source specs:
- ${SOURCE_INPUTS.original_sprint_gate_spec}
- ${SOURCE_INPUTS.governed_support_handoff}
- ${SOURCE_INPUTS.lesson_eligibility_overlay}
- ${SOURCE_INPUTS.canonical_source_assets}
- ${SOURCE_INPUTS.answer_contracts}
- ${SOURCE_INPUTS.book_architecture}

## Non-Negotiable Requirements

${bundle.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Core-Requirement Checklist

${screenshotLine}

| Owner paragraph | Paragraph code | Required surfaces | Status |
|---|---|---|---|
${rows}

## Findings Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| Lead reviews not yet attached in this generated packet | proof_required_to_close | human review readiness | local generation and static validation | attach required read-only lead reviews before final product-review return |
| Product-route and student-use authority remains closed | scale_blocker | product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, student/product use | candidate lesson-output review | separate product-proof gate and explicit owner authorization |

## Cross-Repo Merge Order

${bundle.cross_repo_merge_order.map((item) => `- ${item}`).join('\n')}

## Authority Boundary

This packet creates candidate lesson output for review. It does not authorize lesson adoption into the product route, protected MTU mutation, broad operation closure, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.
`;
}

function renderedProofHtml(bundle) {
  const cards = bundle.records.map((record) => `<article class="task">
    <p class="source-label">${html(record.target_owner_candidate_id)}</p>
    <h3>${html(record.paragraph_code)} ${html(record.lesson_output.base.split('/').pop())}</h3>
    <ul>
      <li>Route: ${html(record.lesson_output.route)}</li>
      <li>Korte check: ${html(record.lesson_output.short_check)}</li>
      <li>Exit ticket: ${html(record.lesson_output.exit_ticket)}</li>
    </ul>
  </article>`).join('\n');
  const screenshotProof = bundle.rendered_screenshot_proof || {};
  const screenshotSummary = screenshotProof.status === 'captured'
    ? `<p class="sub">Rendered screenshot proof captured: ${html(screenshotProof.screenshot_count)}/${html(screenshotProof.expected_count)} screenshots. Manifest: ${html(screenshotProof.manifest_md)}</p>`
    : `<p class="sub">Screenshot proof pending.</p>`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(SPRINT_ID)} rendered proof</title>
  <style>${css()}</style>
</head>
<body>
  <header><div class="top"><p class="eyebrow">Rendered candidate proof</p><h1>${html(SPRINT_ID)}</h1><p class="sub">All four owner paragraphs have route, advisory short check, and target-equivalent exit-ticket candidate output paths.</p>${screenshotSummary}</div></header>
  <main class="page">
    <section class="meta-grid">${cards}</section>
  </main>
</body>
</html>`;
}

function writePlatformArtifacts(routes) {
  validateInputs();
  const screenshotProof = collectScreenshotProof();
  writeScreenshotManifest(screenshotProof);
  const bundle = platformBundle(routes, screenshotProof);
  writeFile(path.join(REPORT_DIR, 'lesson-production-bundle.json'), JSON.stringify(bundle, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'lesson-production-bundle.md'), reviewPacketMarkdown(bundle));
  writeFile(path.join(REPORT_DIR, 'rendered-product-proof.html'), renderedProofHtml(bundle));
  writeFile(path.join(REPORT_DIR, 'review-packet.json'), JSON.stringify({
    schema_version: 1,
    sprint_id: SPRINT_ID,
    status: 'generated_for_lead_review_before_human_product_review',
    content_verdict_requested: 'YEAR 2 FOUR-TARGET LESSON BUNDLE READY FOR PRODUCT REVIEW after lead reviews and exact-head proof',
    bundle: `reports/review-gates/${SPRINT_ID}/lesson-production-bundle.json`,
    rendered_proof: `reports/review-gates/${SPRINT_ID}/rendered-product-proof.html`,
    authority_claims: AUTHORITY_CLAIMS
  }, null, 2) + '\n');
  writeFile(path.join(REPORT_DIR, 'review-packet.md'), reviewPacketMarkdown(bundle));
  return bundle;
}

function writeLessonArtifacts(lessonRoot, routes) {
  const root = path.resolve(lessonRoot);
  const bundleRoot = path.join(root, ...LESSON_OUTPUT_ROOT.split('/'));
  ensureDir(bundleRoot);
  writeFile(path.join(bundleRoot, 'index.html'), bundleIndex(routes));
  const manifest = lessonManifest(routes);
  writeFile(path.join(bundleRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  writeFile(path.join(bundleRoot, 'route-contracts.json'), JSON.stringify(routes.map((route) => route.route_contract), null, 2) + '\n');

  for (const route of routes) {
    const output = route.output;
    writeFile(path.join(root, output.plan), paragraphPlan(route));
    writeFile(path.join(root, output.index), paragraphIndex(route));
    writeFile(path.join(root, output.route), routePage(route));
    writeFile(path.join(root, output.short_check), shortCheckPage(route));
    writeFile(path.join(root, output.exit_ticket), exitTicketPage(route));
    writeFile(path.join(root, output.contract), JSON.stringify(route.route_contract, null, 2) + '\n');
  }
  return manifest;
}

function main() {
  const routes = generatedRoutes();
  const bundle = writePlatformArtifacts(routes);
  const lessonRoot = process.env.LESSON_REPO_ROOT || process.argv.find((arg) => arg.startsWith('--lesson-root='))?.slice('--lesson-root='.length);
  let manifest = null;
  if (lessonRoot) {
    manifest = writeLessonArtifacts(lessonRoot, routes);
  }
  console.log(JSON.stringify({
    ok: true,
    sprint_id: SPRINT_ID,
    platform_report_dir: path.relative(PLATFORM_ROOT, REPORT_DIR).replace(/\\/g, '/'),
    records: bundle.records.length,
    lesson_output_written: Boolean(manifest),
    lesson_output_root: manifest ? manifest.lesson_output_root : null
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  AUTHORITY_CLAIMS,
  ROUTES,
  SOURCE_INPUTS,
  SPRINT_ID,
  generatedRoutes,
  lessonManifest,
  platformBundle,
  routeOutput,
  writeLessonArtifacts,
  writePlatformArtifacts
};
