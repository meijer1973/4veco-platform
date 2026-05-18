#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add or remove team roadmap sources in TEAM_TABS.
 * - Keep generated output under reports/internal-dashboard/ only.
 * - This dashboard is internal/developer-facing; never point OUTPUT_DIR at a
 *   student-facing lesson target.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const OUTPUT_DIR = path.join(REPO_ROOT, 'reports', 'internal-dashboard');
const OUTPUT_HTML = path.join(OUTPUT_DIR, 'index.html');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'dashboard-data.json');

const TEAM_TABS = [
  {
    id: 'platform',
    title: 'Platform',
    subtitle: 'Control Center',
    description:
      'Owns platform guardrails, validator and deploy health, architecture quality, year and multi-year planning, reporting, and cross-team visibility.',
    roadmaps: [
      { label: 'Legacy platform roadmap', path: 'knowledge/old/platform-team-roadmap.md' },
    ],
  },
  {
    id: 'references',
    title: 'References',
    subtitle: 'Knowledge Control',
    description:
      'Owns reference quality, inspection and accountability evidence, exam alignment, skill and goal efficiency, and the question of what should be taught versus omitted.',
    roadmaps: [
      { label: 'References roadmap', path: 'references/reference-team-roadmap.md' },
    ],
  },
  {
    id: 'lessen',
    title: 'Lessen',
    subtitle: 'Effective Teaching',
    description:
      'Owns front-end quality, lesson usability, differentiation, games, visuals, companion material quality, and turning technically valid material into effective teaching.',
    roadmaps: [
      { label: 'Lessen roadmap', path: '../4veco-lessen/lessen-team-roadmap.md' },
    ],
  },
  {
    id: 'innovation',
    title: 'Innovation',
    subtitle: 'Collab Experiments',
    description:
      'Owns controlled experiments in the collab worktrees: better presentations, web-native lesson media, narration, and future ideas before adoption into production workflows.',
    roadmaps: [
      {
        label: 'Innovation platform roadmap',
        path: '../4veco-platform-collab/knowledge/innovation-team-roadmap.md',
      },
      {
        label: 'Innovation output roadmap',
        path: '../4veco-lessen-collab/innovation-team-roadmap.md',
      },
    ],
  },
];

const ISSUE_CATEGORIES = [
  {
    id: 'inspection_accountability',
    label: 'Inspection And Accountability',
    description: 'Evidence, traceability, coverage, and proof that materials meet school, inspection, and exam-program expectations.',
  },
  {
    id: 'reference_quality',
    label: 'Reference Quality',
    description: 'Correctness, freshness, deduplication, source validity, unit quality, term quality, and exam-code links.',
  },
  {
    id: 'didactic_quality',
    label: 'Didactic Quality',
    description: 'Whether the right skills, complexes, goals, sequence, cognitive load, and misconceptions are handled efficiently.',
  },
  {
    id: 'assessment_exam_fit',
    label: 'Assessment And Exam Fit',
    description: 'Alignment with CvTE-style demands, question types, answer models, target skills, and exam realism.',
  },
  {
    id: 'student_teacher_experience',
    label: 'Student And Teacher Experience',
    description: 'Readability, navigation, visuals, games, differentiation, teacher readiness, and classroom usability.',
  },
  {
    id: 'platform_reliability',
    label: 'Platform Reliability',
    description: 'Repeatability and trustworthiness of generators, validators, deploys, links, tests, and reporting routines.',
  },
  {
    id: 'production_readiness',
    label: 'Production Readiness',
    description: 'Release and scaling blockers: incomplete artifacts, unresolved flags, manual steps, rebuild gaps, and known risks.',
  },
  {
    id: 'innovation_transfer',
    label: 'Innovation Transfer',
    description: 'Whether collab experiments are accepted, rejected, revised, or migrated into production workflows.',
  },
];

const QUALITY_REVIEW = 'knowledge/platform-team-companion-quality-gate-review.md';

function relToAbs(relPath) {
  return path.resolve(REPO_ROOT, relPath);
}

function slashPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function readText(relPath) {
  const abs = relToAbs(relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function extractFirstMatch(markdown, pattern) {
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function extractSection(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`, 'm');
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function plainSummary(markdown, maxLength = 520) {
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\|.*\|/g, ' ')
    .replace(/[#>*_`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trim()}...`;
}

function parseMarkdownTable(lines, startIndex) {
  const tableLines = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|') || !line.endsWith('|')) break;
    tableLines.push(line);
  }
  if (tableLines.length < 2) return [];

  const rows = tableLines.map((line) =>
    line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim())
  );
  const headers = rows[0].map((h) => h.toLowerCase());
  return rows.slice(2).map((cells) => {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || '';
    });
    return row;
  });
}

function parseSprintTableAfterHeading(lines, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headingPattern = new RegExp(`^##\\s+${escaped}\\s*$`);
  const headingIndex = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (headingIndex === -1) return [];

  const firstTableLine = lines.findIndex((line, index) => index > headingIndex && line.trim().startsWith('|'));
  if (firstTableLine === -1) return [];

  return parseMarkdownTable(lines, firstTableLine);
}

function parseSprintLedger(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = [
    ...parseSprintTableAfterHeading(lines, 'Sprint Ledger'),
    ...parseSprintTableAfterHeading(lines, 'Closed Sprints'),
  ];
  const seen = new Set();

  return rows.map((row) => ({
    sprint: row.sprint || '',
    name: row.name || row.phase || '',
    completed: normalizeCompleted(row.completed || row.status || ''),
    currentState: row['current state'] || row['primary question'] || '',
    exitGate: row['exit gate'] || '',
  })).filter((row) => {
    const key = `${row.sprint}\u0000${row.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeCompleted(value) {
  const normalized = value.trim().replace(/\*/g, '').toLowerCase();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return 'yes';
  }
  if (normalized === 'yes' || normalized === 'done' || normalized === 'complete' || normalized === 'completed') {
    return 'yes';
  }
  return 'no';
}

function parseRoadmap(source) {
  const markdown = readText(source.path);
  const abs = relToAbs(source.path);
  if (!markdown) {
    return {
      ...source,
      exists: false,
      absolutePath: slashPath(abs),
      generated: '',
      updated: '',
      scope: '',
      summary: 'Roadmap file is missing.',
      sprints: [],
    };
  }

  const currentStatus = extractSection(markdown, 'Current Status') || extractSection(markdown, 'Current State');
  const mission = extractSection(markdown, 'Mission');
  return {
    ...source,
    exists: true,
    absolutePath: slashPath(abs),
    generated: extractFirstMatch(markdown, /^Generated:\s*(.+)$/m),
    updated: extractFirstMatch(markdown, /^Updated:\s*(.+)$/m),
    scope: extractFirstMatch(markdown, /^Scope:\s*(.+)$/m),
    summary: plainSummary(currentStatus || mission || markdown),
    sprints: parseSprintLedger(markdown),
  };
}

function categorizeIssue(title) {
  const t = title.toLowerCase();
  if (t.includes('source') || t.includes('url')) return 'reference_quality';
  if (t.includes('quality ref')) return 'inspection_accountability';
  if (t.includes('game-data') || t.includes('content-quality')) return 'assessment_exam_fit';
  if (t.includes('review flags') || t.includes('manual')) return 'production_readiness';
  if (t.includes('plan-to-output') || t.includes('alignment')) return 'didactic_quality';
  if (t.includes('browser') || t.includes('gate') || t.includes('test')) return 'platform_reliability';
  return 'student_teacher_experience';
}

function parseQualityIssues() {
  const markdown = readText(QUALITY_REVIEW);
  if (!markdown) return [];
  const issues = [];
  const pattern = /^###\s+\d+\.\s+(.+)$/gm;
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    const title = match[1].trim();
    issues.push({
      title,
      category: categorizeIssue(title),
      source: QUALITY_REVIEW,
    });
  }
  return issues;
}

function buildData() {
  const teams = TEAM_TABS.map((team) => {
    const roadmaps = team.roadmaps.map(parseRoadmap);
    const sprints = sortSprintsOpenFirst(roadmaps.flatMap((roadmap) =>
      roadmap.sprints.map((sprint) => ({
        ...sprint,
        roadmap: roadmap.label,
      }))
    ));
    return {
      ...team,
      roadmaps,
      sprints,
      completedCount: sprints.filter((s) => s.completed === 'yes').length,
      openCount: sprints.filter((s) => s.completed !== 'yes').length,
    };
  });

  const issues = parseQualityIssues();
  const issueCounts = {};
  for (const category of ISSUE_CATEGORIES) issueCounts[category.id] = 0;
  for (const issue of issues) issueCounts[issue.category] = (issueCounts[issue.category] || 0) + 1;

  return {
    generatedAt: new Date().toISOString(),
    internalOnly: true,
    teams,
    issueCategories: ISSUE_CATEGORIES.map((category) => ({
      ...category,
      count: issueCounts[category.id] || 0,
    })),
    issues,
    greenGate: [
      {
        command: 'npm.cmd run check:platform',
        lastKnown: 'passes',
        evidence: 'knowledge/old/platform-team-roadmap.md',
      },
      {
        command: 'npm.cmd run check:book -- "..\\4veco-lessen\\Boek 1 - Grondslagen, vraag en aanbod"',
        lastKnown: 'passes',
        evidence: 'knowledge/old/platform-team-roadmap.md',
      },
      {
        command: 'node scripts\\validate-paragraph.js --mode complete --profile student-web "<1.1.1-folder>"',
        lastKnown: 'passes',
        evidence: 'knowledge/old/platform-team-roadmap.md',
      },
    ],
    companionPipeline: [
      {
        paragraph: '1.1.1 Schaarste en economisch denken',
        state: 'Complete technical proof; currently approved pilot surface for dashboard evidence.',
      },
      {
        paragraph: '1.1.2 Percentages en indexcijfers',
        state: 'Historical technical probe passed; test materials cleared and paragraph awaits didactic rebuild.',
      },
    ],
  };
}

function sortSprintsOpenFirst(sprints) {
  return sprints
    .map((sprint, index) => ({ ...sprint, index }))
    .sort((a, b) => {
      const aDone = a.completed === 'yes' ? 1 : 0;
      const bDone = b.completed === 'yes' ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return a.index - b.index;
    })
    .map(({ index, ...sprint }) => sprint);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSprintRows(sprints) {
  if (sprints.length === 0) {
    return '<tr><td colspan="5">No sprint ledger found.</td></tr>';
  }
  return sprints
    .map((sprint) => {
      const statusClass = sprint.completed === 'yes' ? 'done' : 'open';
      return [
        '<tr>',
        `<td>${escapeHtml(sprint.sprint)}</td>`,
        `<td>${escapeHtml(sprint.name)}</td>`,
        `<td><span class="status ${statusClass}">${escapeHtml(sprint.completed)}</span></td>`,
        `<td>${escapeHtml(sprint.currentState || sprint.exitGate)}</td>`,
        `<td>${escapeHtml(sprint.roadmap)}</td>`,
        '</tr>',
      ].join('');
    })
    .join('\n');
}

function renderTeamPanel(team, active) {
  const roadmaps = team.roadmaps
    .map((roadmap) => {
      const existsClass = roadmap.exists ? 'ok' : 'missing';
      const meta = roadmap.updated || roadmap.generated || roadmap.scope || 'No metadata found';
      return `
        <li>
          <strong>${escapeHtml(roadmap.label)}</strong>
          <span class="pill ${existsClass}">${roadmap.exists ? 'found' : 'missing'}</span>
          <code>${escapeHtml(roadmap.path)}</code>
          <p>${escapeHtml(meta)}</p>
          <p>${escapeHtml(roadmap.summary)}</p>
        </li>`;
    })
    .join('\n');

  return `
    <section id="tab-${team.id}" class="tab-panel ${active ? 'active' : ''}" role="tabpanel" aria-labelledby="button-${team.id}">
      <div class="team-header">
        <div>
          <p class="eyebrow">${escapeHtml(team.subtitle)}</p>
          <h2>${escapeHtml(team.title)}</h2>
          <p>${escapeHtml(team.description)}</p>
        </div>
        <div class="metric-strip" aria-label="Sprint summary">
          <div><strong>${team.completedCount}</strong><span>completed</span></div>
          <div><strong>${team.openCount}</strong><span>open</span></div>
        </div>
      </div>
      <h3>Roadmap Sources</h3>
      <ul class="source-list">${roadmaps}</ul>
      <h3>Sprint Ledger</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Sprint</th><th>Name</th><th>Completed</th><th>Current State</th><th>Source</th></tr>
          </thead>
          <tbody>${renderSprintRows(team.sprints)}</tbody>
        </table>
      </div>
    </section>`;
}

function renderDashboard(data) {
  const tabs = data.teams
    .map(
      (team, index) =>
        `<button id="button-${team.id}" class="tab-button ${index === 0 ? 'active' : ''}" role="tab" aria-selected="${index === 0}" aria-controls="tab-${team.id}" data-tab="${team.id}">${escapeHtml(team.title)}</button>`
    )
    .join('\n');

  const panels = data.teams.map((team, index) => renderTeamPanel(team, index === 0)).join('\n');

  const categories = data.issueCategories
    .map(
      (category) => `
        <article class="category">
          <strong>${category.count}</strong>
          <h3>${escapeHtml(category.label)}</h3>
          <p>${escapeHtml(category.description)}</p>
        </article>`
    )
    .join('\n');

  const issues = data.issues
    .map(
      (issue) => `
        <li>
          <span class="status open">${escapeHtml(issue.category)}</span>
          ${escapeHtml(issue.title)}
          <code>${escapeHtml(issue.source)}</code>
        </li>`
    )
    .join('\n');

  const greenGate = data.greenGate
    .map(
      (item) => `
        <li>
          <span class="status done">${escapeHtml(item.lastKnown)}</span>
          <code>${escapeHtml(item.command)}</code>
          <span>${escapeHtml(item.evidence)}</span>
        </li>`
    )
    .join('\n');

  const companion = data.companionPipeline
    .map(
      (item) => `
        <li>
          <strong>${escapeHtml(item.paragraph)}</strong>
          <span>${escapeHtml(item.state)}</span>
        </li>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>4veco Internal Dashboard</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --surface: #ffffff;
      --text: #1d2733;
      --muted: #627084;
      --line: #d9dee7;
      --teal: #0f766e;
      --blue: #1d4ed8;
      --amber: #a16207;
      --green: #15803d;
      --red: #b42318;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }
    header {
      background: #19212d;
      color: #fff;
      padding: 28px clamp(18px, 4vw, 48px);
    }
    header p { max-width: 980px; color: #d7dde7; margin: 8px 0 0; }
    h1, h2, h3 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 32px; }
    h2 { font-size: 24px; }
    h3 { font-size: 16px; margin-top: 24px; }
    main { padding: 24px clamp(18px, 4vw, 48px) 48px; }
    .internal-mark {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      color: #fff;
      border: 1px solid rgba(255,255,255,.35);
      padding: 4px 8px;
      margin-bottom: 14px;
      font-size: 12px;
      text-transform: uppercase;
    }
    .tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--line);
      margin-bottom: 18px;
    }
    .tab-button {
      border: 1px solid var(--line);
      border-bottom: 0;
      background: #eef2f7;
      color: var(--text);
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 700;
    }
    .tab-button.active {
      background: var(--surface);
      color: var(--blue);
    }
    .tab-panel {
      display: none;
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 22px;
    }
    .tab-panel.active { display: block; }
    .team-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 20px;
      align-items: start;
    }
    .eyebrow {
      margin: 0 0 4px;
      color: var(--muted);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
    }
    .metric-strip {
      display: grid;
      grid-template-columns: repeat(2, minmax(86px, 1fr));
      gap: 8px;
    }
    .metric-strip div {
      border: 1px solid var(--line);
      padding: 12px;
      background: #fbfcfe;
      min-width: 86px;
    }
    .metric-strip strong { display: block; font-size: 26px; }
    .metric-strip span { color: var(--muted); font-size: 12px; }
    .source-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
      padding: 0;
      list-style: none;
    }
    .source-list li, .summary-block {
      border: 1px solid var(--line);
      background: #fbfcfe;
      padding: 14px;
    }
    code {
      display: block;
      margin-top: 6px;
      color: #26384f;
      overflow-wrap: anywhere;
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
    }
    .pill, .status {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 7px;
      border: 1px solid var(--line);
      font-size: 12px;
      font-weight: 700;
    }
    .ok, .done { color: var(--green); background: #ecfdf3; border-color: #b7e4c7; }
    .missing, .open { color: var(--amber); background: #fff7ed; border-color: #fed7aa; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
    }
    th { background: #eef2f7; }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-top: 14px;
    }
    .category {
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 14px;
    }
    .category strong {
      display: inline-flex;
      min-width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      background: #e0f2fe;
      color: #075985;
      margin-bottom: 10px;
    }
    .list-panel {
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 18px;
      margin-top: 18px;
    }
    .list-panel ul { margin: 10px 0 0; padding-left: 20px; }
    .list-panel li { margin-bottom: 10px; }
    footer {
      padding: 20px clamp(18px, 4vw, 48px);
      color: var(--muted);
      border-top: 1px solid var(--line);
    }
    @media (max-width: 720px) {
      .team-header { grid-template-columns: 1fr; }
      h1 { font-size: 26px; }
      .tab-button { flex: 1 1 100%; }
    }
  </style>
</head>
<body>
  <header>
    <div class="internal-mark">Internal Dashboard</div>
    <h1>4veco Project Dashboard</h1>
    <p>Developer-facing overview generated from team roadmaps and platform quality reports. This page is not student-facing and must stay out of lesson output.</p>
    <p>Generated: ${escapeHtml(data.generatedAt)}</p>
  </header>
  <main>
    <nav class="tabs" role="tablist" aria-label="Team dashboard tabs">
      ${tabs}
    </nav>
    ${panels}

    <section class="list-panel" aria-labelledby="quality-heading">
      <h2 id="quality-heading">Open Quality Issues By Category</h2>
      <div class="dashboard-grid">${categories}</div>
      <h3>Known Platform Quality-Gate Issues</h3>
      <ul>${issues || '<li>No open issues parsed from the quality-gate review.</li>'}</ul>
    </section>

    <section class="list-panel" aria-labelledby="gate-heading">
      <h2 id="gate-heading">Green-Gate Evidence</h2>
      <ul>${greenGate}</ul>
    </section>

    <section class="list-panel" aria-labelledby="companion-heading">
      <h2 id="companion-heading">Companion Pipeline Status</h2>
      <ul>${companion}</ul>
    </section>
  </main>
  <footer>
    Source data: <code>reports/internal-dashboard/dashboard-data.json</code>
  </footer>
  <script>
    const buttons = Array.from(document.querySelectorAll('.tab-button'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.tab;
        buttons.forEach((b) => {
          const active = b === button;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          panel.classList.toggle('active', panel.id === 'tab-' + id);
        });
      });
    });
  </script>
</body>
</html>`;
}

function main() {
  const data = buildData();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(OUTPUT_HTML, renderDashboard(data));
  console.log(`Internal dashboard written to ${path.relative(REPO_ROOT, OUTPUT_HTML)}`);
  console.log(`Dashboard data written to ${path.relative(REPO_ROOT, OUTPUT_JSON)}`);
}

if (require.main === module) main();

module.exports = {
  buildData,
  parseSprintLedger,
  parseQualityIssues,
  renderDashboard,
};
