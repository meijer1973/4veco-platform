/**
 * lib-begeleide-inoefening.js
 * ══════════════════════════════════════════════════════════════════════
 * Reusable library for generating Begeleide Inoefening Word documents.
 * Based on Template D from econ-word-templates skill v3.
 *
 * HOW TO ADAPT:
 * 1. Require this module in your paragraph-specific script
 * 2. Define your oefeningen array (see buildBegeleideInoefeningSplit for schema)
 * 3. Call buildBegeleideInoefeningSplit() with your data
 * 4. The library generates both vragen and vragen & antwoorden documents
 * ══════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat,
} = require("docx");

// ── Page Setup (A4) ──
const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
};
const CW = 9026; // content width in DXA

// ── Color Palette ──
const C = {
  dBlue:      "1A5276",
  dBlueLt:    "EBF5FB",
  dBlueDk:    "154360",
  dAmber:     "E67E22",
  dAmberLt:   "FEF5E7",
  dAmberDk:   "BA6A1C",
  dGreen:     "1E8449",
  dGreenLt:   "E8F8F0",
  dGreenDk:   "186A3B",
  navy:       "1E2761",
  white:      "FFFFFF",
  dark:       "2D3748",
  gray:       "718096",
  lightGray:  "F7F8FA",
  borderGray: "CBD5E0",
  red:        "D9534F",
  lightRed:   "FDE8E8",
  blue:       "1A5276",
  lightBlue:  "EBF5FB",
  green:      "1E8449",
  lightGreen: "E8F5E9",
  rowAlt:     "F7FAFC",
  purple:     "7B2D8E",
  lightPurple:"F3E8F9",
  stepBg:     "FFF8E1",
  stepBorder: "F9A825",
};

// ── Domain Definitions ──
const DOMAINS = {
  markt:   { label: "Marktanalyse",     color: C.dBlue,  light: C.dBlueLt,  dark: C.dBlueDk  },
  bedrijf: { label: "Bedrijfseconomie", color: C.dAmber, light: C.dAmberLt, dark: C.dAmberDk },
  arbeid:  { label: "Arbeidsmarkt",     color: C.dGreen, light: C.dGreenLt, dark: C.dGreenDk },
};

// ── Document Styles ──
const DOC_STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
      quickFormat: true,
      run: { size: 30, bold: true, font: "Arial", color: C.navy },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
    },
    {
      id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
      quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: C.blue },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
    },
  ],
};

// ── Text Helpers ──
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const rp = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
});

const h2d = (text, domainColor) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: domainColor })],
});

// ── Domain Banner ──
function domainBanner(domain, skillNumber, skillTitle) {
  const d = DOMAINS[domain];
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [600, CW - 600],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.color },
          left:   { style: BorderStyle.SINGLE, size: 1, color: d.color },
          right:  { style: BorderStyle.NONE, size: 0, color: d.color },
        },
        shading: { fill: d.color, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 120, right: 80 },
        width: { size: 600, type: WidthType.DXA },
        verticalAlign: "center",
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: String(skillNumber), bold: true, font: "Arial", size: 32, color: C.white })],
        })],
      }),
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 1, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.color },
          left:   { style: BorderStyle.NONE, size: 0, color: d.color },
          right:  { style: BorderStyle.SINGLE, size: 1, color: d.color },
        },
        shading: { fill: d.light, type: ShadingType.CLEAR },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        width: { size: CW - 600, type: WidthType.DXA },
        verticalAlign: "center",
        children: [
          new Paragraph({
            children: [new TextRun({ text: skillTitle, bold: true, font: "Arial", size: 28, color: d.dark })],
          }),
          new Paragraph({
            spacing: { before: 40 },
            children: [new TextRun({ text: d.label, font: "Arial", size: 18, color: d.color, italics: true })],
          }),
        ],
      }),
    ] })],
  });
}

// ── Formula Box ──
function formulaBox(lines, accentColor = C.borderGray) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        left:   { style: BorderStyle.SINGLE, size: 8, color: accentColor },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
      },
      shading: { fill: C.lightGray, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 240, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: lines.map(line => new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: line, font: "Consolas", size: 22, color: C.dark })],
      })),
    })] })],
  });
}

// ── Tip / Warning / Check Boxes ──
function tipBox(text, color = C.blue, bg = C.lightBlue, label = "\u2728 Tip: ") {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: bg },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: bg },
        left:   { style: BorderStyle.SINGLE, size: 12, color: color },
        right:  { style: BorderStyle.SINGLE, size: 1, color: bg },
      },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [new Paragraph({ children: [
        new TextRun({ text: label, bold: true, font: "Arial", size: 22, color }),
        new TextRun({ text, font: "Arial", size: 22, color: C.dark }),
      ]})],
    })] })],
  });
}

function warningBox(text) {
  return tipBox(text, C.red, C.lightRed, "\u26A0 Let op: ");
}

function checkBox(text) {
  return tipBox(text, C.green, C.lightGreen, "\u2705 Controle: ");
}

// ── Scaffolding Boxes ──
function denkstapBox(lines) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.stepBg },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.stepBg },
        left:   { style: BorderStyle.SINGLE, size: 12, color: C.stepBorder },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.stepBg },
      },
      shading: { fill: C.stepBg, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "\u25B6 Denkstappen:", bold: true, font: "Arial", size: 22, color: C.stepBorder }),
        ]}),
        ...lines.map((line, i) => new Paragraph({ spacing: { after: 60 }, children: [
          new TextRun({ text: `${i + 1}. `, bold: true, font: "Arial", size: 22, color: C.stepBorder }),
          new TextRun({ text: line, font: "Arial", size: 22, color: C.dark }),
        ]})),
      ],
    })] })],
  });
}

function hintBox(text) {
  return tipBox(text, C.purple, C.lightPurple, "\u25B6 Hint:");
}

function formuleHerinneringBox(lines) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
        left:   { style: BorderStyle.SINGLE, size: 8, color: C.dAmber },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.borderGray },
      },
      shading: { fill: C.lightGray, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 240, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "\u25B6 Formule-herinnering:", bold: true, font: "Arial", size: 20, color: C.dAmber }),
        ]}),
        ...lines.map(line => new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: line, font: "Consolas", size: 22, color: C.dark })],
        })),
      ],
    })] })],
  });
}

function answerBox(lines) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
        left:   { style: BorderStyle.SINGLE, size: 8, color: C.dGreen },
        right:  { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt },
      },
      shading: { fill: C.lightGreen, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: lines.map(line => new Paragraph({
        spacing: { after: 80 },
        children: typeof line === "string"
          ? [new TextRun({ text: line, font: "Arial", size: 22, color: C.dark })]
          : line.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
      })),
    })] })],
  });
}

function uitlegBox(text) {
  return tipBox(text, C.dBlue, C.dBlueLt, "\u25B6 Uitleg:");
}

// ── Answer Space (dotted lines for vragen-document) ──
function answerSpace(lineCount = 3) {
  const lines = [];
  for (let i = 0; i < lineCount; i++) {
    lines.push(new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: " ", font: "Arial", size: 22 })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.borderGray, space: 1 } },
    }));
    lines.push(sp(120));
  }
  return lines;
}

// ── Summary Schema ──
function summarySchema(rows, domainColor) {
  const col1W = Math.round(CW * 0.28);
  const col2W = CW - col1W;
  const hdrBrd = {
    top:    { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    left:   { style: BorderStyle.SINGLE, size: 1, color: domainColor },
    right:  { style: BorderStyle.SINGLE, size: 1, color: domainColor },
  };
  const rowBrd = {
    top:    { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    left:   { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
    right:  { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
  };
  const cellM = { top: 80, bottom: 80, left: 140, right: 140 };

  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [col1W, col2W],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: hdrBrd,
          shading: { fill: domainColor, type: ShadingType.CLEAR },
          margins: cellM, width: { size: CW, type: WidthType.DXA },
          columnSpan: 2,
          children: [new Paragraph({ children: [
            new TextRun({ text: "\u25A0 Samenvatting", bold: true, font: "Arial", size: 22, color: C.white }),
          ]})],
        }),
      ]}),
      ...rows.map((r, i) => new TableRow({ children: [
        new TableCell({
          borders: rowBrd,
          shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR },
          margins: cellM, width: { size: col1W, type: WidthType.DXA },
          children: [new Paragraph({ children: [
            new TextRun({ text: r[0], bold: true, font: "Arial", size: 20, color: domainColor }),
          ]})],
        }),
        new TableCell({
          borders: rowBrd,
          shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR },
          margins: cellM, width: { size: col2W, type: WidthType.DXA },
          children: [new Paragraph({ children: [
            new TextRun({ text: r[1], font: "Arial", size: 20, color: C.dark }),
          ]})],
        }),
      ]})),
    ],
  });
}

// ── Domain Legend ──
function domainLegend() {
  const entries = Object.values(DOMAINS);
  const colW = Math.floor(CW / 3);
  const lastColW = CW - colW * 2;
  const cellM = { top: 80, bottom: 80, left: 100, right: 100 };
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [colW, colW, lastColW],
    rows: [new TableRow({ children: entries.map((d, i) =>
      new TableCell({
        borders: {
          top:    { style: BorderStyle.SINGLE, size: 6, color: d.color },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: d.light },
          left:   { style: BorderStyle.SINGLE, size: 1, color: d.light },
          right:  { style: BorderStyle.SINGLE, size: 1, color: d.light },
        },
        shading: { fill: d.light, type: ShadingType.CLEAR },
        margins: cellM,
        width: { size: i === 2 ? lastColW : colW, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: d.label, bold: true, font: "Arial", size: 20, color: d.color }),
        ]})],
      })
    ) })],
  });
}

// ── Title Block ──
function titleBlock(title, subtitle) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: title, bold: true, font: "Arial", size: 48, color: C.navy })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 26, color: C.gray })],
    }),
  ];
}

// ── Header & Footer ──
function makeHeader(text) {
  return new Header({ children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text, font: "Arial", size: 18, color: C.gray, italics: true })],
    }),
  ]});
}

function makeFooter() {
  return new Footer({ children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Pagina ", font: "Arial", size: 18, color: C.gray }),
        new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: C.gray }),
      ],
    }),
  ]});
}

// ══════════════════════════════════════════════════════════════════════
// MAIN BUILD FUNCTION
// ══════════════════════════════════════════════════════════════════════

/**
 * Build a Begeleide Inoefening document.
 *
 * @param {string} paragraafNr - e.g. "3.1.1"
 * @param {string} onderwerp - e.g. "Markt en marktstructuur"
 * @param {string} headerText - e.g. "Paragraaf 3.1.1 Markt en marktstructuur"
 * @param {Array} oefeningen - array of exercise objects (see schema below)
 * @param {Array} samenvattendSchema - final summary rows [["key","val"], ...]
 * @param {boolean} includeAnswers - false for vragen, true for vragen & antwoorden
 *
 * Exercise schema:
 * {
 *   nr: 1,
 *   title: "De prijskeuze van een monopolist",
 *   domain: "markt" | "bedrijf" | "arbeid",
 *   introText: "optional context paragraph",
 *   formules: ["p = -Q + 50", ...],        // optional context formulas
 *   deelvragen: [{
 *     label: "Vraag 2a — Leid MK af",
 *     vraagText: "The actual question text",   // optional, for displaying question
 *     denkstappen: ["step 1", "step 2"],       // optional
 *     hint: "A short nudge",                   // optional
 *     formuleHerinnering: ["MK = TK'"],        // optional
 *     invulformaat: "MK = ............",        // optional, vragen-doc only
 *     antwoord: [                               // antwoorden-doc only
 *       "line 1",
 *       [{ text: "MK: ", bold: true }, { text: "0,5Q" }],
 *     ],
 *     uitleg: "Why this answer is correct",     // antwoorden-doc only
 *     answerLines: 3,                           // nr of answer lines if no invulformaat
 *     warning: "Common mistake text",           // optional warning box
 *   }],
 * }
 */
async function buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, samenvattendSchema, includeAnswers = false) {
  const suffix = includeAnswers ? "Vragen & Antwoorden" : "Vragen";
  const children = [];

  // ── TITLE PAGE ──
  children.push(sp(600));
  children.push(...titleBlock(onderwerp, `Begeleide Inoefening \u2014 Paragraaf ${paragraafNr}`));
  children.push(sp(100));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: suffix, bold: true, font: "Arial", size: 28, color: C.dAmber })],
  }));
  children.push(sp(200));
  children.push(domainLegend());
  children.push(sp(300));

  // Intro text
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({
      text: "Dit document bevat oefeningen met denkstappen,",
      font: "Arial", size: 22, color: C.gray,
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [new TextRun({
      text: "formule-herinneringen en hints die je stap voor stap helpen.",
      font: "Arial", size: 22, color: C.gray,
    })],
  }));

  // Study tip
  if (includeAnswers) {
    children.push(tipBox("Dit document bevat de vragen \u00e9n de uitgewerkte antwoorden met uitleg. Probeer altijd eerst zelf de vraag te beantwoorden voordat je het antwoord leest!", C.dAmber, C.dAmberLt, "\u25B6 Studietip:"));
  } else {
    children.push(tipBox("Bij elke oefening vind je denkstappen en hints. Gebruik deze om stap voor stap tot het antwoord te komen. Na afloop kun je je antwoorden controleren met het antwoordendocument.", C.dAmber, C.dAmberLt, "\u25B6 Werkwijze:"));
  }

  // ── LEGEND PAGE ──
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 240 },
    children: [new TextRun({ text: "Zo werkt dit document", bold: true, font: "Arial", size: 30, color: C.navy })],
  }));
  children.push(p("In dit document vind je verschillende soorten hulpkaders:"));
  children.push(sp());
  children.push(denkstapBox(["Stappen die je kunt volgen om tot het antwoord te komen"]));
  children.push(sp(60));
  children.push(hintBox("Een korte hint die je op weg helpt"));
  children.push(sp(60));
  children.push(formuleHerinneringBox(["Formules die je nodig hebt voor de opgave"]));
  children.push(sp(60));
  children.push(warningBox("Iets waar je extra op moet letten"));
  children.push(sp(60));
  if (includeAnswers) {
    children.push(answerBox(["Het uitgewerkte antwoord"]));
    children.push(sp(60));
    children.push(uitlegBox("Waarom dit het goede antwoord is \u2014 de redenering erachter"));
    children.push(sp(60));
  }
  children.push(checkBox("Een controle-check om te zien of je op de goede weg zit"));

  // ── OEFENINGEN ──
  oefeningen.forEach(oef => {
    const d = DOMAINS[oef.domain];
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(domainBanner(oef.domain, oef.nr, oef.title));
    children.push(sp());

    if (oef.introText) { children.push(p(oef.introText)); children.push(sp()); }
    if (oef.formules) { children.push(formulaBox(oef.formules, d.color)); children.push(sp()); }

    oef.deelvragen.forEach(dv => {
      children.push(h2d(dv.label, d.color));
      if (dv.vraagText) {
        children.push(p(dv.vraagText));
      }
      children.push(sp(40));
      if (dv.denkstappen) { children.push(denkstapBox(dv.denkstappen)); children.push(sp()); }
      if (dv.hint) { children.push(hintBox(dv.hint)); children.push(sp()); }
      if (dv.formuleHerinnering) { children.push(formuleHerinneringBox(dv.formuleHerinnering)); children.push(sp()); }
      if (dv.warning) { children.push(warningBox(dv.warning)); children.push(sp()); }

      if (includeAnswers && dv.antwoord) {
        children.push(answerBox(dv.antwoord));
        children.push(sp(40));
        if (dv.uitleg) { children.push(uitlegBox(dv.uitleg)); }
      } else if (!includeAnswers && dv.invulformaat) {
        // Show invulformaat lines in Consolas
        const invulLines = Array.isArray(dv.invulformaat) ? dv.invulformaat : [dv.invulformaat];
        invulLines.forEach(line => {
          children.push(new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: line, font: "Consolas", size: 22, color: C.dark })],
          }));
        });
        children.push(sp());
      } else if (!includeAnswers) {
        children.push(...answerSpace(dv.answerLines || 3));
      }
      children.push(sp());
    });
  });

  // ── SAMENVATTEND SCHEMA ──
  if (samenvattendSchema && samenvattendSchema.length > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 240 },
      children: [new TextRun({ text: "Samenvattend schema", bold: true, font: "Arial", size: 30, color: C.navy })],
    }));
    children.push(p("De belangrijkste kernregels van dit onderwerp op een rij:"));
    children.push(sp());
    children.push(summarySchema(samenvattendSchema, C.dBlue));
  }

  // Build document
  const doc = new Document({
    styles: DOC_STYLES,
    sections: [{
      properties: { page: PAGE },
      headers: { default: makeHeader(`${headerText} \u2014 ${suffix}`) },
      footers: { default: makeFooter() },
      children,
    }],
  });
  return await Packer.toBuffer(doc);
}

/**
 * Convenience: build both documents at once and write to disk.
 */
async function buildBegeleideInoefeningSplit(paragraafNr, onderwerp, headerText, oefeningen, samenvattendSchema, outputDir) {
  const vragen = await buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, samenvattendSchema, false);
  const antwoorden = await buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, samenvattendSchema, true);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const vragenPath = `${outputDir}/${paragraafNr} Begeleide Inoefening - Vragen.docx`;
  const antwoordenPath = `${outputDir}/${paragraafNr} Begeleide Inoefening - Vragen & Antwoorden.docx`;

  fs.writeFileSync(vragenPath, vragen);
  fs.writeFileSync(antwoordenPath, antwoorden);

  console.log(`  Vragen:      ${vragenPath} (${(vragen.length / 1024).toFixed(0)} KB)`);
  console.log(`  Antwoorden:  ${antwoordenPath} (${(antwoorden.length / 1024).toFixed(0)} KB)`);

  return { vragenPath, antwoordenPath };
}

module.exports = {
  buildBegeleideInoefening,
  buildBegeleideInoefeningSplit,
  C, DOMAINS, CW,
  // Export components for direct use if needed
  sp, p, rp, h2d,
  domainBanner, formulaBox, tipBox, warningBox, checkBox,
  denkstapBox, hintBox, formuleHerinneringBox, answerBox, uitlegBox, answerSpace,
  summarySchema, domainLegend, titleBlock, makeHeader, makeFooter,
};
