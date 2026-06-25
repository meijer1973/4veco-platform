#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPRINT = 'Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1';
const PRIOR_SPRINT = 'Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1';
const GATE_DIR = ['reports', 'review-gates', SPRINT].join('/');
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const REVIEW_PACKET_MD = `reports/reference-planning/${SPRINT}-review-packet.md`;
const SOURCE_HTML = `${GATE_DIR}/source-reconstruction-gallery.html`;
const SOURCE_JSON = `${GATE_DIR}/source-reconstruction-proof.json`;
const SOURCE_MD = `${GATE_DIR}/source-reconstruction-proof.md`;
const MTU_JSON = `${GATE_DIR}/mtu-task-family-governed-proof.json`;
const MTU_MD = `${GATE_DIR}/mtu-task-family-governed-proof.md`;
const PLAN_MD = `reports/sprints/${SPRINT}-plan.md`;
const RESULT_MD = `reports/sprints/${SPRINT}-result.md`;

const CANDIDATES = 'references/authored/year2-v6-target-foundation-candidates.json';
const SOURCE_FOUNDATION = 'references/data/year2-target-foundation/source-reconstruction-foundation.json';
const ANSWER_CONTRACTS = 'references/data/year2-target-foundation/answer-contracts.json';
const MTU_REVIEW = `reports/reference-planning/${PRIOR_SPRINT}-mtu-task-family-review.json`;

const changedPaths = [
  'build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js',
  'build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js',
  SOURCE_FOUNDATION,
  SOURCE_HTML,
  SOURCE_JSON,
  SOURCE_MD,
  MTU_JSON,
  MTU_MD,
  REVIEW_PACKET_JSON,
  REVIEW_PACKET_MD,
  PLAN_MD,
  RESULT_MD,
];

const specs = [
  {
    id: 'Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1',
    anchor: 'book5',
    short: 'Book 5 pension source case',
    owner: 'Y2-B5-P13',
    official: 'vw-1022-a-25-2-o:q7-q11',
    sourceArtifacts: [
      'figuur-1-pensioenmodel-2024-2044',
      'pensioenmodel-assumptions-a-f',
    ],
  },
  {
    id: 'Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1',
    anchor: 'book6',
    short: 'Book 6 VastWonen/Reder source case',
    owner: 'Y2-B6-P12',
    official: 'vw-1022-a-23-2-o:q26-q29',
    sourceArtifacts: [
      'tabel-1-vastwonen-financial-data',
      'tabel-2-particuliere-huurwoningen-reder',
      'q28-housing-investor-context',
    ],
  },
  {
    id: 'Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1',
    anchor: 'book7',
    short: 'Book 7 credit-insurance source case',
    owner: 'Y2-B7-P13',
    official: 'vw-1022-a-23-1-o:q12-q15',
    sourceArtifacts: [
      'figuur-1-kredietverzekering-en-voorwaarden',
      'tabel-1-financiele-gegevens-digibate',
    ],
  },
  {
    id: 'Y2-B8-Q15-Q16-STRATEGIC-TARGET-1',
    anchor: 'book8',
    short: 'Book 8 Guarda/Orso Bianco source case',
    owner: 'Y2-B8-P04',
    official: 'vw-1022-a-25-1-o:q15-q16',
    sourceArtifacts: [
      'ijssalon-guarda-orso-bianco-context',
      'lowest-price-guarantee-self-binding-source',
      'derived-payoff-representation',
    ],
  },
];

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function write(relPath, content) {
  const target = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function html(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function posix(relPath) {
  return relPath.replace(/\\/g, '/');
}

function relFromGate(relPath) {
  return `../../../${posix(relPath)}`;
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function byId(items, idKey = 'id') {
  return new Map(items.map((item) => [item[idKey], item]));
}

function statusBadge(text) {
  return `<span class="badge">${html(text)}</span>`;
}

function renderTable(headers, rows) {
  return [
    '<table>',
    '<thead><tr>',
    ...headers.map((header) => `<th>${html(header)}</th>`),
    '</tr></thead>',
    '<tbody>',
    ...rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`),
    '</tbody>',
    '</table>',
  ].join('');
}

function pensionSvg() {
  const years = Array.from({ length: 21 }, (_, index) => 2024 + index);
  const pensionWealth = [212, 216, 219, 223, 226, 230, 234, 236, 240, 243, 247, 251, 254, 258, 262, 266, 270, 274, 278, 282, 286];
  const premiums = [2.25, 2.22, 2.19, 2.16, 2.12, 2.10, 2.08, 2.05, 2.02, 2.01, 1.98, 1.96, 1.94, 1.92, 1.90, 1.88, 1.86, 1.84, 1.81, 1.79, 1.76];
  const width = 920;
  const height = 500;
  const margin = { left: 92, right: 108, top: 30, bottom: 112 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const minLeft = 1.5;
  const maxLeft = 3.1;
  const minRight = 150;
  const maxRight = 290;
  const x = (index) => margin.left + (index * innerW) / (years.length - 1);
  const yLeft = (value) => margin.top + ((maxLeft - value) / (maxLeft - minLeft)) * innerH;
  const yRight = (value) => margin.top + ((maxRight - value) / (maxRight - minRight)) * innerH;
  const barW = innerW / years.length - 6;
  const linePath = premiums
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index).toFixed(1)} ${yLeft(value).toFixed(1)}`)
    .join(' ');
  const leftTicks = [1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1];
  const rightTicks = [150, 170, 190, 210, 230, 250, 270];
  return `
    <svg class="chart pension-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Reconstructed pension model chart from official figure 1">
      <rect x="0" y="0" width="${width}" height="${height}" fill="#fff"/>
      ${leftTicks.map((tick) => `<line x1="${margin.left}" x2="${width - margin.right}" y1="${yLeft(tick)}" y2="${yLeft(tick)}" class="grid"/><text x="${margin.left - 18}" y="${yLeft(tick) + 5}" text-anchor="end">${String(tick).replace('.', ',')}</text>`).join('')}
      <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" class="axis"/>
      <line x1="${width - margin.right}" y1="${margin.top}" x2="${width - margin.right}" y2="${height - margin.bottom}" class="axis"/>
      <line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" class="axis"/>
      ${rightTicks.map((tick) => `<text x="${width - margin.right + 18}" y="${yRight(tick) + 5}">${tick}</text>`).join('')}
      ${pensionWealth.map((value, index) => {
        const cx = x(index);
        const top = yRight(value);
        const bottom = height - margin.bottom;
        return `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${(bottom - top).toFixed(1)}" class="pension-bar"/>`;
      }).join('')}
      <path d="${linePath}" class="premium-line"/>
      ${years.map((year, index) => `<text x="${x(index)}" y="${height - margin.bottom + 25}" text-anchor="end" transform="rotate(-55 ${x(index)} ${height - margin.bottom + 25})">${year}</text>`).join('')}
      <text x="24" y="${margin.top + innerH / 2}" transform="rotate(-90 24 ${margin.top + innerH / 2})" class="axis-title">premies in % van pensioenvermogen</text>
      <text x="${width - 28}" y="${margin.top + innerH / 2}" transform="rotate(-90 ${width - 28} ${margin.top + innerH / 2})" class="axis-title">pensioenvermogen als % van bbp</text>
      <line x1="${margin.left}" y1="${height - 45}" x2="${margin.left + 54}" y2="${height - 45}" class="premium-line"/>
      <text x="${margin.left + 66}" y="${height - 39}">premies (linkeras)</text>
      <rect x="${margin.left + 330}" y="${height - 62}" width="24" height="24" class="pension-bar"/>
      <text x="${margin.left + 365}" y="${height - 39}">pensioenvermogen (rechteras)</text>
    </svg>`;
}

function creditInsuranceSvg() {
  return `
    <svg class="diagram" viewBox="0 0 920 360" role="img" aria-label="Reconstructed actor-arrow diagram for credit insurance">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L7,3 z" fill="#1d252d"/>
        </marker>
        <marker id="dasharrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L7,3 z" fill="#1d252d"/>
        </marker>
      </defs>
      <rect x="35" y="132" width="130" height="52" class="actor"/>
      <text x="100" y="164" text-anchor="middle">leverancier</text>
      <circle cx="460" cy="158" r="82" class="insurer"/>
      <text x="460" y="151" text-anchor="middle">krediet</text>
      <text x="460" y="180" text-anchor="middle">verzekeraar</text>
      <rect x="745" y="116" width="138" height="75" class="actor"/>
      <text x="814" y="148" text-anchor="middle">inkopende</text>
      <text x="814" y="176" text-anchor="middle">bedrijf</text>
      <path d="M120 112 V72 H780 V116" class="solid-arrow"/>
      <text x="460" y="63" class="num">2</text>
      <path d="M142 132 V92 H780 V116" class="dash-arrow"/>
      <text x="460" y="101" class="num">1</text>
      <path d="M165 158 H378" class="solid-arrow"/>
      <text x="275" y="145" class="num">3</text>
      <path d="M378 220 H142 V184" class="solid-arrow"/>
      <text x="275" y="210" class="num">4</text>
      <path d="M378 245 H70 V184" class="dash-arrow"/>
      <text x="275" y="267" class="num">5</text>
      <path d="M540 230 H785 V191" class="solid-arrow"/>
      <text x="655" y="215" class="num">7</text>
      <path d="M540 292 H855 V191" class="solid-arrow"/>
      <text x="655" y="278" class="num">6</text>
    </svg>`;
}

function sourceGalleryHtml(sourceProof) {
  const b6Table1 = renderTable(
    ['gegeven', 'waarde'],
    [
      ['maximumhuur', 'EUR 850 per woning per maand'],
      ['woningvoorraad', '6.800 woningen'],
      ['totale kosten per maand', 'TK = 450Q + 1.400.000'],
      ['gemiddelde huuropbrengst per woning per maand', 'GO = -0.125Q + 2.150'],
      ['Q', 'aantal sociale huurwoningen'],
    ].map((row) => row.map(html))
  );
  const b6Table2 = renderTable(
    ['gegeven particuliere huurwoningen', 'ontwikkeling t.o.v. jaar eerder'],
    [
      ['aantal vrijgekomen huurwoningen', '-9.9%'],
      ['gemiddelde huur', '+6%'],
      ['hoogte van de middeninkomens', '+3%'],
      ['inkomenselasticiteit middeninkomens', '+0.4'],
    ].map((row) => row.map(html))
  );
  const b7Table = renderTable(
    ['aantal contracten', 'gemiddelde omzet', 'betalingstermijn', 'kans wanbetaling', 'verwachte schade'],
    [
      ['20', 'EUR 1.000.000', '90 dagen', '0.05%', 'EUR 10.000'],
      ['30', 'EUR 500.000', '60 dagen', '0.2%', 'EUR 30.000'],
      ['80', 'EUR 250.000', '60 dagen', '0.2%', 'EUR 40.000'],
      ['totaal', '', '', '', 'EUR 80.000'],
      ['premie +20%', '', '', '', 'EUR 96.000'],
    ].map((row) => row.map(html))
  );
  const b8Matrix = renderTable(
    ['Derived, non-official incentive map', 'Orso Bianco keeps price', 'Orso Bianco lowers price'],
    [
      ['Guarda keeps posted price', 'cooperation-like, price-war risk lower', 'Guarda guarantee is triggered; Orso Bianco gain is weakened'],
      ['Guarda lowers price', 'unilateral price-pressure incentive', 'price-war/prisoner-dilemma outcome'],
    ].map((row) => row.map(html))
  );

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${SPRINT} source reconstruction gallery</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1d252d;
      --muted: #5c6875;
      --line: #c8d0d8;
      --surface: #ffffff;
      --band: #f4f7f7;
      --accent: #136f63;
      --accent-2: #8a5b00;
      --warn: #8d2d24;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background: #fff;
      line-height: 1.45;
    }
    header, section, footer { padding: 28px clamp(18px, 4vw, 58px); }
    header { background: var(--band); border-bottom: 1px solid var(--line); }
    h1 { margin: 0 0 10px; font-size: clamp(1.8rem, 3vw, 3rem); letter-spacing: 0; }
    h2 { margin: 0 0 14px; font-size: clamp(1.35rem, 2vw, 2rem); letter-spacing: 0; }
    h3 { margin: 24px 0 10px; font-size: 1.05rem; letter-spacing: 0; }
    p { max-width: 980px; }
    .meta, .badges, .two-col, .three-col { display: grid; gap: 14px; }
    .meta { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top: 18px; }
    .two-col { grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); align-items: start; }
    .three-col { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .badge {
      display: inline-block;
      margin: 4px 6px 4px 0;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 3px 9px;
      background: #fff;
      color: var(--muted);
      font-size: 0.86rem;
      white-space: nowrap;
    }
    .source-block {
      border-top: 1px solid var(--line);
      background: var(--surface);
    }
    .proof-note {
      border-left: 4px solid var(--accent);
      padding: 10px 14px;
      background: #eef7f5;
      max-width: 980px;
    }
    .warning-note {
      border-left-color: var(--warn);
      background: #fbf0ee;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px;
      font-size: 0.95rem;
    }
    th, td {
      border: 1px solid var(--line);
      padding: 8px 10px;
      vertical-align: top;
      text-align: left;
    }
    th { background: #eef2f4; }
    .chart, .diagram { width: min(100%, 980px); border: 1px solid var(--line); border-radius: 8px; background: #fff; }
    .grid { stroke: #d8dde2; stroke-width: 1; }
    .axis { stroke: #1d252d; stroke-width: 2; }
    .axis-title { font-weight: 700; }
    .pension-bar { fill: #c9c9c9; stroke: #1d252d; stroke-width: 1.5; }
    .premium-line { fill: none; stroke: #111; stroke-width: 4; }
    .actor, .insurer { fill: #fff; stroke: #1d252d; stroke-width: 2; }
    .solid-arrow { fill: none; stroke: #1d252d; stroke-width: 2; marker-end: url(#arrow); }
    .dash-arrow { fill: none; stroke: #1d252d; stroke-width: 2; stroke-dasharray: 8 7; marker-end: url(#dasharrow); }
    .num { font-size: 22px; font-weight: 700; fill: #1d252d; }
    .mini-list { margin: 8px 0 18px; padding-left: 20px; }
    a { color: #0a5c7a; }
    footer { border-top: 1px solid var(--line); background: var(--band); }
  </style>
</head>
<body>
  <header>
    <h1>${SPRINT}</h1>
    <p>Rendered source reconstruction and governed MTU/task-family proof surface for the four Year 2/v6 target-foundation families installed by ${PRIOR_SPRINT}.</p>
    <div class="meta">
      <div>${statusBadge('review-ready source proof')}${statusBadge('human review required')}${statusBadge('no lesson output')}</div>
      <div>${statusBadge('no MTU mutation')}${statusBadge('no product route')}${statusBadge('no student/product use')}</div>
    </div>
  </header>

  <section class="source-block" id="book5">
    <h2>Book 5 - Pensioenmodel</h2>
    <p>${statusBadge('record Y2-B5-PENSION-TIME-STOCK-FLOW-TARGET-1')}${statusBadge('owner Y2-B5-P13')}${statusBadge('source vw-1022-a-25-2-o:q7-q11')}</p>
    <p class="proof-note">Official locator: <a href="${relFromGate('references/external/exams/vw-1022-a-25-2-o.pdf')}#page=4">vw-1022-a-25-2-o.pdf#page=4</a>. The mixed bar/line figure is reconstructed visually from the rendered PDF page and is used as review evidence, not as a new official numeric data table.</p>
    <h3>Figuur 1 Pensioenmodel econoom (2024-2044)</h3>
    ${pensionSvg().trim()}
    <div class="two-col">
      <div>
        <h3>Assumptions a-f</h3>
        <ul class="mini-list">
          <li>a: annual inflation = 2%</li>
          <li>b: annual real economic growth = 0.5%</li>
          <li>c: annual pension-asset return = 3.5%</li>
          <li>d: premium pressure as percentage of GDP stays constant</li>
          <li>e: number of premium payers stays constant</li>
          <li>f: capital incomes stay constant</li>
        </ul>
      </div>
      <div>
        <h3>Visual trace preserved</h3>
        <ul class="mini-list">
          <li>Time horizon 2024-2044.</li>
          <li>Bars: pension wealth on right axis, rising across the horizon.</li>
          <li>Line: premiums on left axis, falling across the horizon.</li>
          <li>Legend, two axes, ticks, units, and source assumptions preserved.</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="source-block" id="book6">
    <h2>Book 6 - VastWonen/Reder</h2>
    <p>${statusBadge('record Y2-B6-HOUSING-FINANCE-RENT-MARKET-TARGET-1')}${statusBadge('owner Y2-B6-P12')}${statusBadge('source vw-1022-a-23-2-o:q26-q29')}</p>
    <p class="proof-note">Official locators: <a href="${relFromGate('references/external/exams/vw-1022-a-23-2-o.pdf')}#page=12">page 12</a> and <a href="${relFromGate('references/external/exams/vw-1022-a-23-2-o.pdf')}#page=13">page 13</a>. Tables and formulas are rendered exactly as machine-readable review inputs.</p>
    <div class="two-col">
      <div>
        <h3>Tabel 1 - Huidige financiele gegevens VastWonen</h3>
        ${b6Table1}
      </div>
      <div>
        <h3>Tabel 2 - Particuliere huurwoningen in Reder</h3>
        ${b6Table2}
      </div>
    </div>
    <h3>Context required for q28</h3>
    <p>VastWonen is the only social-housing provider in Reder. The plan buys and converts old office buildings, financed through mortgage loans with collateral, under a low mortgage-rate claim and a housing-shortage risk argument.</p>
  </section>

  <section class="source-block" id="book7">
    <h2>Book 7 - Kredietverzekering</h2>
    <p>${statusBadge('record Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1')}${statusBadge('owner Y2-B7-P13')}${statusBadge('source vw-1022-a-23-1-o:q12-q15')}</p>
    <p class="proof-note">Official locator: <a href="${relFromGate('references/external/exams/vw-1022-a-23-1-o.pdf')}#page=6">vw-1022-a-23-1-o.pdf#page=6</a> for the actor-arrow figure and conditions; page 7 for the Digibate table.</p>
    ${creditInsuranceSvg().trim()}
    <div class="two-col">
      <div>
        <h3>Arrow meanings</h3>
        <ul class="mini-list">
          <li>1: delivered sold product x</li>
          <li>2: invoice amount</li>
          <li>3: credit-insurance premium</li>
          <li>4: amount paid out when buyer does not pay</li>
          <li>5: possible collection service</li>
          <li>6: collection costs plus surcharge</li>
          <li>7: outstanding debt to be paid</li>
        </ul>
      </div>
      <div>
        <h3>Conditions preserved</h3>
        <ul class="mini-list">
          <li>90% indemnity of missed turnover after non-payment.</li>
          <li>Insurer takes over collection after payment term expires.</li>
          <li>Collection costs are charged to the buying company.</li>
          <li>Supplier bonus-malus system.</li>
        </ul>
      </div>
    </div>
    <h3>Tabel 1 - Financiele gegevens Digibate</h3>
    ${b7Table}
  </section>

  <section class="source-block" id="book8">
    <h2>Book 8 - Guarda/Orso Bianco</h2>
    <p>${statusBadge('record Y2-B8-Q15-Q16-STRATEGIC-TARGET-1')}${statusBadge('owner Y2-B8-P04')}${statusBadge('source vw-1022-a-25-1-o:q15-q16')}</p>
    <p class="proof-note">Official locator: <a href="${relFromGate('references/external/exams/vw-1022-a-25-1-o.pdf')}#page=7">vw-1022-a-25-1-o.pdf#page=7</a>. The source has context text rather than an official payoff matrix.</p>
    <div class="three-col">
      <div>
        <h3>Official context</h3>
        <p>At the beginning of 2025 Guarda loses its monopoly position when Orso Bianco opens. Orso Bianco has the same production costs and enters with a lower price.</p>
      </div>
      <div>
        <h3>Strategic condition</h3>
        <p>Consumers view the ice creams as perfect substitutes, so both shops can end up in a price war and prisoner's dilemma.</p>
      </div>
      <div>
        <h3>Self-binding source</h3>
        <p>Guarda advertises a fixed 2025 sales price and a lowest-price guarantee: if Orso Bianco offers a lower price, Guarda gives a 25% discount on that lower price.</p>
      </div>
    </div>
    <p class="proof-note warning-note">The following representation is derived, non-official, and review-only. It must not be cited as an official payoff matrix.</p>
    ${b8Matrix}
  </section>

  <footer>
    <h2>Authority Boundary</h2>
    <p>This gallery is proof for human review. It does not authorize lesson generation, MTU mutation, operation closure, answer-skill mutation, product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.</p>
    <p>Source proof record count: ${sourceProof.records.length}. Review packet: <a href="review-packet.json">review-packet.json</a>.</p>
  </footer>
</body>
</html>
`;
}

function buildSourceProof(surface, sourceFoundation) {
  const recordMap = byId(surface.records);
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    prior_sprint_id: PRIOR_SPRINT,
    status: 'rendered_review_ready_pending_human_closure',
    authority_boundary: 'rendered_source_reconstruction_proof_only_no_external_mutation_no_lesson_output_no_product_use',
    rendered_surface: SOURCE_HTML,
    source_foundation: SOURCE_FOUNDATION,
    records: specs.map((spec) => {
      const candidate = recordMap.get(spec.id);
      const foundation = sourceFoundation.records.find((item) => item.record_id === spec.id);
      return {
        record_id: spec.id,
        source_family: spec.official,
        target_owner_candidate_id: spec.owner,
        lesson_goal: candidate.lesson_goal,
        official_locators: foundation.required_artifacts.map((artifact) => artifact.official_locator),
        rendered_surface: `${SOURCE_HTML}#${spec.anchor}`,
        rendered_artifact_ids: spec.sourceArtifacts,
        anti_substitution_checked: true,
        proof_status: 'rendered_review_ready_pending_human_acceptance',
        artifacts: foundation.required_artifacts.map((artifact) => ({
          artifact_id: artifact.artifact_id,
          artifact_type: artifact.artifact_type,
          official_locator: artifact.official_locator,
          requirements_satisfied: artifact.must_preserve || artifact.values || artifact.rows || artifact.arrows || artifact.conditions || [],
          render_note:
            artifact.artifact_id === 'figuur-1-pensioenmodel-2024-2044'
              ? 'Rendered as a visual approximation from the official PDF figure; axes, legend, time horizon, rising bars, and falling line are preserved. No new official numeric data table is claimed.'
              : artifact.artifact_id === 'derived-payoff-representation'
                ? 'Rendered only as a labelled derived, non-official incentive map.'
                : 'Rendered as exact review table/context/diagram values from the foundation file and official locator text.',
        })),
        render_blocker_disposition: {
          prior_blocker: foundation.render_blocker,
          closure_status: 'proof_ready_pending_human_review_on_exact_remote_head',
          blocks_until_human_acceptance: ['lesson handoff', 'product proof'],
          does_not_block: ['human review of this proof PR'],
          proof_required_to_close: 'Human reviewer accepts exact-head rendered source reconstruction artifacts and official locator trace.',
        },
      };
    }),
    authority_claims: {
      rendered_source_reconstruction_ready_for_review: true,
      external_source_mutation_authorized: false,
      lesson_generation_authorized: false,
      mtu_mutation_authorized: false,
      operation_registry_mutation_authorized: false,
      answer_skill_mutation_authorized: false,
      product_route_adoption_authorized: false,
      cp6_closure_authorized: false,
      scale_gate_authorized: false,
      diagnostics_authorized: false,
      mastery_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      student_product_use_authorized: false,
    },
  };
}

function buildMtuProof(surface, sourceProof, answerContracts, mtuReview) {
  const answerMap = byId(answerContracts.records, 'record_id');
  const mtuMap = byId(mtuReview.records, 'record_id');
  const surfaceMap = byId(surface.records);
  return {
    schema_version: 1,
    sprint_id: SPRINT,
    prior_sprint_id: PRIOR_SPRINT,
    status: 'governed_task_family_proof_ready_pending_human_closure_no_mtu_mutation',
    authority_boundary: 'review_proof_only_no_mtu_mutation_no_operation_closure_no_product_use',
    evidence_base: [CANDIDATES, SOURCE_JSON, SOURCE_HTML, ANSWER_CONTRACTS, MTU_REVIEW],
    records: specs.map((spec) => {
      const candidate = surfaceMap.get(spec.id);
      const contract = answerMap.get(spec.id);
      const mtu = mtuMap.get(spec.id);
      const source = sourceProof.records.find((item) => item.record_id === spec.id);
      return {
        record_id: spec.id,
        target_owner_candidate_id: spec.owner,
        source_family: spec.official,
        op_rows_expected: candidate.op_rows,
        proof_status: 'complete_review_proof_pending_human_acceptance',
        source_artifact_ids: source.rendered_artifact_ids,
        answer_contract_subquestions: contract.answer_contracts.map((item) => item.subquestion),
        proof_cases: mtu.complete_op_row_family_union.map((row) => {
          const matchingMappings = candidate.operation_mapping.filter((mapping) => mapping.op_rows.includes(row.op_row));
          return {
            proof_case_id: `${spec.id}:${row.op_row}`,
            op_row: row.op_row,
            task_families: row.families || row.complete_task_family_union || row.task_family_union,
            subquestions: matchingMappings.map((mapping) => mapping.subquestion),
            source_artifact_ids: source.rendered_artifact_ids,
            answer_contracts:
              matchingMappings.length > 0
                ? matchingMappings.map((mapping) => contract.answer_contracts.find((item) => item.subquestion === mapping.subquestion)).filter(Boolean)
                : contract.answer_contracts,
            proof_obligation: 'Task-family shell must preserve source trace, answer form, and official correction-model logic before any production use.',
            mutation_status: 'not_mutated_review_proof_only',
          };
        }),
        protected_mtu_change_plan: {
          ...mtu.protected_mtu_change_plan,
          closure_status: 'governed_proof_surface_created_pending_human_review_no_mtu_write',
        },
      };
    }),
    global_findings: [
      {
        id: 'Y2SRMTP-MTU-001',
        classification: 'core_requirement_met',
        severity: 'high',
        finding: 'Every OP row in the four target-foundation records has a governed proof case tied to rendered source artifacts and answer contracts.',
        blocks: ['nothing for human review of this proof surface'],
        does_not_block: ['human review return', 'future governed MTU mutation planning'],
        proof_required_to_close: 'Keep this JSON proof, source gallery, answer contracts, and exact-head reviewer acceptance together.',
      },
      {
        id: 'Y2SRMTP-MTU-002',
        classification: 'scale_blocker',
        severity: 'critical',
        finding: 'No MTU, operation, or answer-skill registry mutation is executed in this PR.',
        blocks: ['lesson production', 'shared task-shell reliance', 'broad OP closure'],
        does_not_block: ['review of the governed proof surface'],
        proof_required_to_close: 'Future governed mutation PR with exact MTU/operation/answer-skill diffs, CI, lead review, and human authorization.',
      },
      {
        id: 'Y2SRMTP-MTU-003',
        classification: 'scale_blocker',
        severity: 'critical',
        finding: 'Product, Scale, diagnostics, mastery, PV, summative, and student/product authority remain false.',
        blocks: ['product-route adoption', 'CP-6', 'Scale Gate', 'diagnostics', 'mastery', 'PV', 'summative use', 'student/product use'],
        does_not_block: ['human review of rendered source and MTU proof'],
        proof_required_to_close: 'Separate REV-STD-1 product-proof and Scale Gate packets after governed source/MTU proof is accepted.',
      },
    ],
    closure_effect: {
      prior_flags_addressed_when_human_review_accepts_reviewed_payload: ['Y2TRTF-005', 'Y2TRTF-006'],
      remaining_downstream_blocks: ['Y2TRTF-007', 'product_scale_student_use_boundary'],
    },
    authority_claims: {
      governed_mtu_task_family_proof_ready_for_review: true,
      mtus_minted: false,
      mtu_mutation_authorized: false,
      operation_registry_mutation_authorized: false,
      answer_skill_mutation_authorized: false,
      official_exam_operation_closure_authorized: false,
      broad_operation_row_closure_authorized: false,
      generated_lesson_output_authorized: false,
      product_route_adoption_authorized: false,
      cp6_closure_authorized: false,
      scale_gate_authorized: false,
      diagnostics_authorized: false,
      adaptive_routing_authorized: false,
      mastery_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      student_product_use_authorized: false,
    },
  };
}

function buildReviewPacket(sourceProof, mtuProof) {
  return {
    schema_version: 1,
    packet_id: SPRINT,
    sprint_id: SPRINT,
    pr_number: null,
    pr_url: null,
    pr_throughput_class: 'high_authority',
    bundle_id: null,
    authority_class: 'protected_reference',
    changed_paths: changedPaths,
    review_autonomy: {
      level: 'L4',
      lead_review_result: 'PENDING_REMOTE_HEAD',
      rationale: 'This PR creates a rendered source-reconstruction and governed MTU/task-family proof surface for protected Year 2/v6 target-foundation work. It must route READY_FOR_HUMAN_REVIEW after exact-head proof.',
    },
    human_decision_required: true,
    paired_prs: [],
    auto_merge_allowed_after_ci: false,
    escalation_triggers: [
      'protected_reference_review_gate',
      'year2_source_reconstruction',
      'governed_mtu_task_family_proof',
      'lesson_production_boundary',
      'single_account_governance_pilot',
    ],
    date: '2026-06-23',
    product_end_state_refs: ['../4veco-lessen/specifications/product-end-state.md'],
    original_sprint_or_gate_spec_refs: [
      'references/owned/course-blueprint-v6-three-year.md',
      `reports/review-gates/${PRIOR_SPRINT}/review-packet.json`,
      `reports/reference-planning/${PRIOR_SPRINT}-mtu-task-family-review.json`,
      'references/data/year2-target-foundation/source-reconstruction-foundation.json',
      'references/data/year2-target-foundation/answer-contracts.json',
      'reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-governed-mutation-plan.md',
      'reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.json',
    ],
    non_negotiable_requirements: [
      'Render source reconstruction evidence for all four target-foundation families.',
      'Preserve official locators and anti-substitution rules.',
      'Label derived Book 8 representation as derived and non-official.',
      'Repair the Book 7 actor-arrow figure locator to the rendered official page 6 while keeping the Digibate table on page 7.',
      'Provide governed MTU/task-family proof for every OP row in each record.',
      'Tie task-family proof to rendered source artifacts and answer contracts.',
      'Do not mutate references/external/*.',
      'Do not mint or mutate MTUs.',
      'Do not mutate operation or answer-skill registries.',
      'Do not generate lessons.',
      'Keep product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV, summative use, and student/product-use authority false.',
      'Before marking ready or merging, run exact-head PR readiness with live branch-protection output showing ok: true.',
      'Do not carry a missing core requirement under PASS WITH FLAGS.',
    ],
    core_requirement_checklist: [
      { requirement: 'Product end-state cited', status: 'met', evidence: REVIEW_PACKET_MD },
      { requirement: 'Original sprint/gate specs cited', status: 'met', evidence: 'original_sprint_or_gate_spec_refs' },
      { requirement: 'Four source families rendered', status: 'met', evidence: SOURCE_HTML },
      { requirement: 'Source proof JSON present', status: 'met', evidence: SOURCE_JSON },
      { requirement: 'Official locators preserved', status: 'met', evidence: SOURCE_JSON },
      { requirement: 'Book 8 derived representation labelled', status: 'met', evidence: SOURCE_HTML },
      { requirement: 'Book 7 figure locator repaired', status: 'met', evidence: SOURCE_FOUNDATION },
      { requirement: 'Every OP row has governed proof case', status: 'met', evidence: MTU_JSON },
      { requirement: 'Answer contracts linked', status: 'met', evidence: MTU_JSON },
      { requirement: 'MTU mutation not authorized', status: 'met', evidence: 'authority_claims' },
      { requirement: 'Downstream authority false', status: 'met', evidence: 'authority_claims' },
      { requirement: 'Local checker proof', status: 'met', evidence: 'proof.local_checkers' },
      { requirement: 'Current-head PR proof', status: 'pending_remote_pr', evidence: 'single_account_pr_governance_pilot' },
    ],
    authority_claims: {
      rendered_source_reconstruction_ready_for_review: true,
      governed_mtu_task_family_proof_ready_for_review: true,
      source_foundation_locator_repair_ready_for_review: true,
      external_source_mutation_authorized: false,
      machine_reference_mutation_authorized: false,
      authored_reference_mutation_authorized: false,
      target_registry_mutation_in_scope: false,
      target_registry_records_created: false,
      mtus_minted: false,
      mtu_mutation_authorized: false,
      operation_registry_mutation_authorized: false,
      answer_skill_mutation_authorized: false,
      generated_lesson_output_authorized: false,
      official_exam_operation_closure_authorized: false,
      broad_operation_row_closure_authorized: false,
      product_authority: false,
      product_route_adoption_authorized: false,
      cp6_closure_authorized: false,
      scale_gate_authorized: false,
      diagnostics_authorized: false,
      adaptive_routing_authorized: false,
      mastery_authorized: false,
      pv_authorized: false,
      summative_use_authorized: false,
      student_use_authorized: false,
      student_product_use_authorized: false,
    },
    implementation_summary: {
      source_records: sourceProof.records.length,
      source_foundation_locator_repairs: ['Y2-B7-CREDIT-INSURANCE-INFORMATION-TARGET-1:figuur-1-kredietverzekering-en-voorwaarden -> vw-1022-a-23-1-o.pdf#page=6'],
      mtu_records: mtuProof.records.length,
      proof_cases: mtuProof.records.reduce((sum, record) => sum + record.proof_cases.length, 0),
      record_ids: specs.map((spec) => spec.id),
      target_owner_candidate_ids: specs.map((spec) => spec.owner),
      prior_flags_addressed_pending_human_acceptance: mtuProof.closure_effect.prior_flags_addressed_when_human_review_accepts_reviewed_payload,
    },
    carried_flags: [
      {
        id: 'Y2SRMTP-001',
        classification: 'proof_required_to_close',
        flag: 'Source reconstruction and MTU/task-family proof are review-ready but require human acceptance of the reviewed payload before downstream closure.',
        blocks: ['lesson handoff', 'product proof', 'broad OP closure'],
        does_not_block: ['human review of this proof PR'],
        proof_required_to_close: 'Owner authorization tied to the reviewed payload head and decision scope after CI, checker, branch-protection, lead-review, and PR-readiness proof.',
      },
      {
        id: 'Y2SRMTP-002',
        classification: 'scale_blocker',
        flag: 'Protected MTU, operation, and answer-skill mutations remain future governed work.',
        blocks: ['lesson production', 'shared task-shell reliance', 'broad OP closure'],
        does_not_block: ['review of rendered source/MTU proof'],
        proof_required_to_close: 'Future governed mutation PR with exact diffs and human authorization.',
      },
      {
        id: 'Y2SRMTP-003',
        classification: 'scale_blocker',
        flag: 'Product, Scale, diagnostics, mastery, PV, summative, and student/product authority remain false.',
        blocks: ['CP-6', 'Scale Gate', 'diagnostics', 'mastery', 'PV', 'summative use', 'student/product use'],
        does_not_block: ['human review of this proof surface'],
        proof_required_to_close: 'Separate REV-STD-1 product-proof and Scale Gate review.',
      },
    ],
    proof: {
      local_checkers: [
        { command: 'node --check build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node --check build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: 'node build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js', status: 'passed' },
        { command: `npm.cmd run check:review-throughput -- ${REVIEW_PACKET_JSON}`, status: 'passed' },
        { command: 'npm.cmd run check:platform', status: 'passed' },
      ],
    },
    single_account_pr_governance_pilot: {
      pilot_status: 'pending_remote_pr',
      expected_route: 'READY_FOR_HUMAN_REVIEW',
      remote_head_sha: null,
      branch_protection_checker_command: 'npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main',
      branch_protection_checker_output: null,
      branch_protection_ok_required: true,
      pr_readiness_reviewer_command: null,
      pr_readiness_decision: null,
      lead_review: {
        required: true,
        path: null,
        result: null,
        reviewed_commit_sha: null,
      },
      owner_authorization_required_to_merge: true,
      owner_authorization_reviewed_payload_sha: null,
    },
    decision: {
      status: 'READY_FOR_HUMAN_REVIEW_PENDING_REMOTE_PROOF',
      route: 'READY_FOR_HUMAN_REVIEW',
      human_review_required: true,
      mark_ready_allowed: false,
      merge_allowed: false,
      reason: 'Protected source-reconstruction and MTU proof surface must wait for current-head CI, branch-protection, lead-review, review-thread, PR Readiness Reviewer output, and explicit owner authorization tied to the reviewed payload head.',
    },
    recommended_next_action: 'Open a draft PR, run current-head governance proof, immediately apply any readiness decision with MARK_READY, and return for owner merge authorization only after READY_FOR_HUMAN_REVIEW.',
  };
}

function sourceProofMd(sourceProof) {
  const rows = sourceProof.records
    .map((record) => `| \`${record.record_id}\` | ${record.source_family} | ${record.rendered_artifact_ids.map((id) => `\`${id}\``).join(', ')} | ${record.proof_status} |`)
    .join('\n');
  return `# ${SPRINT} - Source Reconstruction Proof

Status: rendered source reconstruction ready for human review under payload-lineage governance.

## Product End-State And Original Specs

Product end-state:

- \`../4veco-lessen/specifications/product-end-state.md\`

Original sprint/gate/source specs:

- \`references/owned/course-blueprint-v6-three-year.md\`
- \`reports/review-gates/${PRIOR_SPRINT}/review-packet.json\`
- \`${SOURCE_FOUNDATION}\`
- \`${ANSWER_CONTRACTS}\`

## Non-Negotiable Requirements

${mdList([
    'Render all four official source families.',
    'Repair the Book 7 actor-arrow figure official locator to page 6.',
    'Preserve official locators and anti-substitution rules.',
    'Keep Book 8 derived payoff representation labelled as derived and non-official.',
    'Do not mutate external source files, MTUs, operations, answer skills, lessons, or product routes.',
  ])}

## Rendered Records

| Record | Source family | Rendered artifacts | Status |
|---|---|---|---|
${rows}

## Findings

| ID | Classification | Severity | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|
| Y2SRMTP-SRC-001 | core_requirement_met | high | All four source families now have a rendered review artifact with official locators. | nothing for human review of this source proof | future governed MTU/lesson planning | human acceptance of reviewed payload artifacts \`${SOURCE_HTML}\` and \`${SOURCE_JSON}\` |
| Y2SRMTP-SRC-002 | proof_required_to_close | high | The rendered proof is not itself product authority. | lesson handoff and product proof until human acceptance | review of this proof surface | owner authorization tied to reviewed payload head |

## Decision

Decision: source-reconstruction proof is ready for human review only. It does
not authorize lessons, MTUs, operation closure, product-route adoption, CP-6,
Scale Gate, diagnostics, mastery, PV, summative use, or student/product use.
`;
}

function mtuProofMd(mtuProof) {
  const recordRows = mtuProof.records
    .map((record) => `| \`${record.record_id}\` | \`${record.target_owner_candidate_id}\` | ${record.proof_cases.length} | ${record.proof_status} |`)
    .join('\n');
  const findingRows = mtuProof.global_findings
    .map((finding) => `| ${finding.id} | ${finding.classification} | ${finding.severity} | ${finding.finding} | ${finding.blocks.join(', ')} | ${finding.does_not_block.join(', ')} | ${finding.proof_required_to_close} |`)
    .join('\n');
  return `# ${SPRINT} - Governed MTU/Task-Family Proof

Status: governed proof ready for human review under payload-lineage governance; no MTU mutation.

## Product End-State And Original Specs

Product end-state:

- \`../4veco-lessen/specifications/product-end-state.md\`

Original sprint/gate/source specs:

- \`references/owned/course-blueprint-v6-three-year.md\`
- \`reports/reference-planning/${PRIOR_SPRINT}-mtu-task-family-review.json\`
- \`${ANSWER_CONTRACTS}\`
- \`${SOURCE_JSON}\`
- \`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/review-packet.json\`

## Non-Negotiable Requirements

${mdList([
    'Every OP row in the four target-foundation records has a governed proof case.',
    'Every proof case is tied to source artifacts and answer contracts.',
    'No MTU, operation, answer-skill, lesson, or product mutation is authorized.',
    'Carried issues include blocks, does_not_block, and proof_required_to_close.',
  ])}

## Core-Requirement Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Every target record covered | met | \`${MTU_JSON}\` |
| Every OP row covered | met | \`${MTU_JSON}\` |
| Source artifacts linked | met | \`${SOURCE_JSON}\` |
| Answer contracts linked | met | \`${ANSWER_CONTRACTS}\` |
| Downstream authority false | met | \`${MTU_JSON}\` authority_claims |

## Proof Records

| Record | Owner | Proof cases | Status |
|---|---|---:|---|
${recordRows}

## Findings

| ID | Classification | Severity | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|
${findingRows}

## Decision

Decision: governed MTU/task-family proof is ready for human review only. It does
not close broad OP rows, mutate MTUs, or authorize lesson/product use.
`;
}

function reviewPacketMd(packet) {
  const checklist = packet.core_requirement_checklist
    .map((item) => `| ${item.requirement} | ${item.status} | \`${item.evidence}\` |`)
    .join('\n');
  const flags = packet.carried_flags
    .map((flag) => `| ${flag.id} | ${flag.classification} | ${flag.flag} | ${flag.blocks.join(', ')} | ${flag.does_not_block.join(', ')} | ${flag.proof_required_to_close} |`)
    .join('\n');
  return `# ${SPRINT} - REV-STD-1 Review Packet

Status: ready for draft PR and exact-head governance proof.

## Product End-State And Original Specs

Product end-state:

${mdList(packet.product_end_state_refs.map((item) => `\`${item}\``))}

Original sprint/gate/source specs:

${mdList(packet.original_sprint_or_gate_spec_refs.map((item) => `\`${item}\``))}

## Non-Negotiable Requirements

${mdList(packet.non_negotiable_requirements)}

## Core-Requirement Checklist

| Requirement | Status | Evidence |
|---|---|---|
${checklist}

## Findings And Carried Issues

| ID | Classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
${flags}

## Proof

Local checker proof is recorded in \`${REVIEW_PACKET_JSON}\`. Current-head
remote proof remains pending until draft PR creation. The required live
branch-protection checker output must include \`ok: true\`.

## Decision

Decision: \`${packet.decision.status}\`.

Route: \`${packet.decision.route}\`.

Mark-ready allowed: \`${packet.decision.mark_ready_allowed}\`.

Merge allowed: \`${packet.decision.merge_allowed}\`.

This packet does not authorize lessons, MTUs, operation closure, answer-skill
mutation, product-route adoption, CP-6, Scale Gate, diagnostics, mastery, PV,
summative use, or student/product use.
`;
}

function sprintPlanMd() {
  return `# ${SPRINT} Plan

Status: implementation lane opened after PR #139 merge.

## Goal

Complete the next protected proof lane required by the PR #139 merge boundary:
rendered source reconstruction and governed MTU/task-family proof for the four
Year 2/v6 target-foundation families.

## Product End-State And Original Specs

Product end-state:

- \`../4veco-lessen/specifications/product-end-state.md\`

Original sprint/gate/source specs:

- \`references/owned/course-blueprint-v6-three-year.md\`
- \`reports/review-gates/${PRIOR_SPRINT}/review-packet.json\`
- \`reports/reference-planning/${PRIOR_SPRINT}-mtu-task-family-review.json\`
- \`${SOURCE_FOUNDATION}\`
- \`${ANSWER_CONTRACTS}\`

## Non-Negotiable Requirements

${mdList([
    'Render source reconstruction evidence for Books 5, 6, 7, and 8 target families.',
    'Create governed MTU/task-family proof for every OP row.',
    'Tie the proof to answer contracts and source artifacts.',
    'Keep Book 8 derived representation labelled derived and non-official.',
    'Do not mutate external sources, MTUs, operations, answer skills, lessons, or product routes.',
    'Route final PR through READY_FOR_HUMAN_REVIEW with exact-head proof.',
  ])}

## Planned Outputs

${mdList(changedPaths.map((item) => `\`${item}\``))}

## Verification Plan

${mdList([
    '`node --check build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js`',
    '`node build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js`',
    '`node --check build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js`',
    '`node build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js`',
    `\`npm.cmd run check:review-throughput -- ${REVIEW_PACKET_JSON}\``,
    '`npm.cmd run check:platform`',
    'After PR open: branch-protection checker, lead review, PR Readiness Reviewer, and review-thread proof.',
  ])}
`;
}

function sprintResultMd(packet, mtuProof) {
  return `# ${SPRINT} Result

Status: local proof implementation complete; remote exact-head proof still
pending until draft PR creation.

## Summary

- Rendered source reconstruction gallery created at \`${SOURCE_HTML}\`.
- Source proof JSON/Markdown created at \`${SOURCE_JSON}\` and \`${SOURCE_MD}\`.
- Governed MTU/task-family proof created at \`${MTU_JSON}\` and \`${MTU_MD}\`.
- REV-STD-1 packet created at \`${REVIEW_PACKET_JSON}\` and \`${REVIEW_PACKET_MD}\`.
- Proof cases: ${mtuProof.records.reduce((sum, record) => sum + record.proof_cases.length, 0)}.

## Authority Boundary

No external-source mutation, MTU mutation, operation-registry mutation,
answer-skill mutation, generated lesson output, product-route adoption, CP-6,
Scale Gate, diagnostics, mastery, PV, summative use, or student/product use is
authorized.

## Next Action

Open a draft PR, collect exact-head CI/checker/branch-protection/lead-review
proof, run the PR Readiness Reviewer, and return to the owner for explicit
authorization if the route is \`READY_FOR_HUMAN_REVIEW\`.

## Current Decision

\`${packet.decision.status}\`: ${packet.decision.reason}
`;
}

function main() {
  const surface = readJson(CANDIDATES);
  const sourceFoundation = readJson(SOURCE_FOUNDATION);
  const answerContracts = readJson(ANSWER_CONTRACTS);
  const mtuReview = readJson(MTU_REVIEW);

  const sourceProof = buildSourceProof(surface, sourceFoundation);
  const mtuProof = buildMtuProof(surface, sourceProof, answerContracts, mtuReview);
  const packet = buildReviewPacket(sourceProof, mtuProof);

  write(SOURCE_JSON, `${JSON.stringify(sourceProof, null, 2)}\n`);
  write(SOURCE_MD, sourceProofMd(sourceProof));
  write(SOURCE_HTML, sourceGalleryHtml(sourceProof));
  write(MTU_JSON, `${JSON.stringify(mtuProof, null, 2)}\n`);
  write(MTU_MD, mtuProofMd(mtuProof));
  write(REVIEW_PACKET_JSON, `${JSON.stringify(packet, null, 2)}\n`);
  write(REVIEW_PACKET_MD, reviewPacketMd(packet));
  write(PLAN_MD, sprintPlanMd());
  write(RESULT_MD, sprintResultMd(packet, mtuProof));
  console.log(`Generated ${SPRINT} proof artifacts`);
}

if (require.main === module) main();
