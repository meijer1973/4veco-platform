---
name: econ-word-templates
description: "Reusable JavaScript templates for creating professional, visually rich Word documents (.docx) for economics education. Contains ready-to-use functions for domain-colored section banners, formula boxes with accent stripes, tip/warning/check boxes, summary schema tables, visual tables of contents, domain legends, definition tables, and full document scaffolds for vaardigheden-documents, voorkennis-documents, nieuwsopdrachten, and begeleide inoefening documents. Use this skill whenever building Word documents for economics lessons in combination with the docx skill and the economic-graph skill. Trigger when the user asks for uitleg vaardigheden, uitleg voorkennis, nieuwsopdracht, begeleide inoefening, or any economics lesson handout as a .docx file. Also trigger when the user mentions dual coding, kleurcodering, samenvattend schema, visuele inhoudsopgave, scaffolding, denkstappen, or hints for economics materials."
---

# Economics Word Document Templates v3

Reusable JavaScript code for building professional, visually rich economics lesson documents with docx-js. All templates produce A4 documents with consistent styling, domain-based color coding, headers, footers, and page numbers.

**Key design principles (dual coding):**
- Every skill section gets a **domain color** (blue/amber/green) so students see structure at a glance
- Every skill section ends with a **summary schema** reinforcing the content
- Documents open with a **visual table of contents** showing all skills by domain
- Formula boxes have **colored accent stripes** matching their domain
- Begeleide inoefening documents use **scaffolding boxes** (denkstappen, hints, formule-herinneringen) to guide students step by step

**Always read the docx skill first** for installation, validation, and packing instructions. This skill provides the *content templates*; the docx skill provides the *toolchain*.

**Naming convention for scaffolding materials:** Always call these "begeleide inoefening" — never use labels like "basisniveau", "makkelijke versie", or "hulp bij moeite". The framing must be positive and neutral so students feel supported, not labeled.

---

## PART 1: SETUP & IMPORTS

Every document script starts with this block. Copy it verbatim.

```javascript
const fs = require("fs");
const sharp = require("sharp");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat,
} = require("docx");
```

### Page Setup (A4, standard margins)

```javascript
const PAGE = {
  size: { width: 11906, height: 16838 },           // A4 in DXA
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
};
const CW = 9026; // content width: 11906 - 2×1440 in DXA

// For nieuwsopdracht (tighter margins to fit more on page 1)
const PAGE_TIGHT = {
  size: { width: 11906, height: 16838 },
  margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
};
const CW_TIGHT = 9638; // 11906 - 2×1134
```

### Color Palette (with domain system)

The palette has three tiers: **base colors** used everywhere, **four domain color families** for visual grouping (one per chapter), and **scaffolding colors** for begeleide inoefening.

```javascript
const C = {
  // ── Domain 0: Markten (teal family) ──
  dTeal:      "17A2B8",   // primary — H1 chapter accent
  dTealLt:    "E8F8FB",   // light  — card/banner backgrounds
  dTealDk:    "117A8B",   // dark   — heading text
  // ── Domain 1: Marktanalyse (blue family) ──
  dBlue:      "1A5276",   // primary — banners, headings, accents
  dBlueLt:    "EBF5FB",   // light  — banner background, TOC highlight
  dBlueDk:    "154360",   // dark   — banner title text
  // ── Domain 2: Bedrijfseconomie (amber family) ──
  dAmber:     "E67E22",   // primary
  dAmberLt:   "FEF5E7",   // light
  dAmberDk:   "BA6A1C",   // dark
  // ── Domain 3: Arbeidsmarkt (green family) ──
  dGreen:     "1E8449",   // primary
  dGreenLt:   "E8F8F0",   // light
  dGreenDk:   "186A3B",   // dark
  // ── Base colors ──
  navy:       "1E2761",   // document title, TOC header, key takeaways
  white:      "FFFFFF",
  dark:       "2D3748",   // body text
  gray:       "718096",   // footers, captions, subtitles
  lightGray:  "F7F8FA",   // formula box background
  borderGray: "CBD5E0",   // formula box default border
  red:        "D9534F",   // warning boxes, accents
  lightRed:   "FDE8E8",   // warning box background
  blue:       "1A5276",   // tip boxes (alias of dBlue)
  lightBlue:  "EBF5FB",   // tip box background (alias of dBlueLt)
  green:      "1E8449",   // check boxes (alias of dGreen)
  lightGreen: "E8F5E9",   // check box background
  rowAlt:     "F7FAFC",   // alternating table row
  // ── Scaffolding colors (begeleide inoefening) ──
  purple:     "7B2D8E",   // hint boxes
  lightPurple:"F3E8F9",   // hint box background
  stepBg:     "FFF8E1",   // denkstappen box background
  stepBorder: "F9A825",   // denkstappen box accent (warm yellow)
};
```

### Domain Definitions

Use these objects to look up colors and labels per domain. There are two domain sets: one for **vaardigheden** documents (economic domains) and one for **voorkennis** documents (prerequisite skill types). Both use the same three color families.

```javascript
// For vaardigheden documents
const DOMAINS = {
  markten: { label: "Markten",           color: C.dTeal,  light: C.dTealLt,  dark: C.dTealDk  },
  markt:   { label: "Marktanalyse",      color: C.dBlue,  light: C.dBlueLt,  dark: C.dBlueDk  },
  bedrijf: { label: "Bedrijfseconomie",  color: C.dAmber, light: C.dAmberLt, dark: C.dAmberDk },
  arbeid:  { label: "Arbeidsmarkt",      color: C.dGreen, light: C.dGreenLt, dark: C.dGreenDk },
};

// For voorkennis documents
const VK_DOMAINS = {
  wiskunde:   { label: "Wiskundig",   color: C.dBlue,  light: C.dBlueLt,  dark: C.dBlueDk  },
  economisch: { label: "Economisch",  color: C.dAmber, light: C.dAmberLt, dark: C.dAmberDk },
  grafisch:   { label: "Grafisch",    color: C.dGreen, light: C.dGreenLt, dark: C.dGreenDk },
};
```

**Assigning vaardigheden-domains:** classify each skill by its primary economic domain:
- markt: marktevenwicht, verschuivingen V/A, prijsvorming, surplus
- bedrijf: winstmaximalisatie, MO/MK, kostenberekening, marktvorm
- arbeid: arbeidsmarkt, werkloosheid, minimumloon, cao

**Assigning voorkennis-domains:** classify each prerequisite by its skill type:
- wiskunde: lineaire functies, differentiëren, vergelijkingen oplossen, machten
- economisch: TO, TK, MO, MK, GTK, CS — begripsdefinities en economische relaties
- grafisch: grafieken lezen, snijpunten aflezen, oppervlakten berekenen, assen interpreteren

---

## PART 2: REUSABLE COMPONENTS

### Text Helpers

```javascript
const sp = (after = 80) => new Paragraph({ spacing: { after }, children: [] });

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, font: "Arial", size: 22, color: C.dark, ...opts })],
});

const rp = (runs) => new Paragraph({
  spacing: { after: 120 },
  children: runs.map(r => new TextRun({ font: "Arial", size: 22, color: C.dark, ...r })),
});

// Domain-aware heading: uses the domain color instead of a fixed color
const h2d = (text, domainColor) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 200, after: 120 },
  children: [new TextRun({ text, bold: true, font: "Arial", size: 24, color: domainColor })],
});
```

### Domain Banner

Full-width colored banner with skill number badge + title + domain label. Use at the start of each skill section. Pass `domainSet` to use VK_DOMAINS for voorkennis docs (defaults to DOMAINS).

```javascript
function domainBanner(domain, skillNumber, skillTitle, domainSet = DOMAINS) {
  const d = domainSet[domain];
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [600, CW - 600],
    rows: [new TableRow({ children: [
      // Number badge (solid color)
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
      // Title area (light background)
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
```

### Formula Box (with domain accent)

Monospace text in a gray box. The left border uses the domain color as an accent stripe for visual grouping. Pass the domain color as `accentColor`; falls back to neutral gray.

```javascript
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
```

### Tip / Warning / Check Boxes

Colored left border + light background. Same API as before but with slightly more padding.

```javascript
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
```

### Scaffolding Boxes (NEW in v3 — for begeleide inoefening)

These boxes are used exclusively in begeleide inoefening documents to guide students step by step. Each has a distinct visual style so students can quickly recognize what kind of help is being offered.

```javascript
// Denkstappen: numbered thinking steps with warm yellow accent
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
          new TextRun({ text: "\uD83D\uDCA1 Denkstappen:", bold: true, font: "Arial", size: 22, color: C.stepBorder }),
        ]}),
        ...lines.map((line, i) => new Paragraph({ spacing: { after: 60 }, children: [
          new TextRun({ text: `${i + 1}. `, bold: true, font: "Arial", size: 22, color: C.stepBorder }),
          new TextRun({ text: line, font: "Arial", size: 22, color: C.dark }),
        ]})),
      ],
    })] })],
  });
}

// Hint: purple accent, short nudge in the right direction
function hintBox(text) {
  return tipBox(text, C.purple, C.lightPurple, "\uD83D\uDD0D Hint: ");
}

// Formule-herinnering: domain-colored formula reminder box
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
          new TextRun({ text: "\uD83D\uDCDD Formule-herinnering:", bold: true, font: "Arial", size: 20, color: C.dAmber }),
        ]}),
        ...lines.map(line => new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: line, font: "Consolas", size: 22, color: C.dark })],
        })),
      ],
    })] })],
  });
}

// Answer box: green accent, for antwoorden-document only
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

// Uitleg box: blue accent, explains WHY the answer is correct
function uitlegBox(text) {
  return tipBox(text, C.dBlue, C.dBlueLt, "\uD83D\uDCD6 Uitleg: ");
}
```

### Answer Space (for vragen-document)

Generates dotted lines for students to write answers on.

```javascript
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
```

### Summary Schema

Compact two-column table with domain-colored header. Place after each skill's tip/warning box. The last row should always be "Verband met" pointing to related skill numbers.

```javascript
function summarySchema(rows, domainColor) {
  // rows = [["Kernbegrip", "Marktevenwicht: Qv = Qa"], ["Verband met", "→ Vaardigheid 2, 5"], ...]
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
      // Header (spans full width)
      new TableRow({ children: [
        new TableCell({
          borders: hdrBrd,
          shading: { fill: domainColor, type: ShadingType.CLEAR },
          margins: cellM, width: { size: CW, type: WidthType.DXA },
          columnSpan: 2,
          children: [new Paragraph({ children: [
            new TextRun({ text: "\uD83D\uDCCB Samenvatting", bold: true, font: "Arial", size: 22, color: C.white }),
          ]})],
        }),
      ]}),
      // Data rows
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
```

### Visual Table of Contents

Color-coded overview table for the front matter. Takes an array of skill entries.

```javascript
function visualTOC(skills, domainSet = DOMAINS) {
  // skills = [{ nr: "1", title: "Marktevenwicht", domain: "markt", desc: "Qv = Qa als startpunt" }, ...]
  const colNr = 500, colTitle = 3200, colDesc = 3726, colDomain = 1600;
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, left: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, right: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } };
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, bottom: { style: BorderStyle.SINGLE, size: 2, color: C.navy }, left: { style: BorderStyle.SINGLE, size: 1, color: C.navy }, right: { style: BorderStyle.SINGLE, size: 1, color: C.navy } };
  const cellM = { top: 100, bottom: 100, left: 120, right: 120 };

  const headerRow = new TableRow({ children: [
    ...[["Nr.", colNr], ["Vaardigheid", colTitle], ["Omschrijving", colDesc], ["Domein", colDomain]].map(([txt, w]) =>
      new TableCell({
        borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR },
        margins: cellM, width: { size: w, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: txt, bold: true, font: "Arial", size: 20, color: C.white })] })],
      })
    ),
  ]});

  const dataRows = skills.map((s, i) => {
    const d = domainSet[s.domain];
    return new TableRow({ children: [
      new TableCell({ borders: rowBrd, shading: { fill: d.light, type: ShadingType.CLEAR }, margins: cellM, width: { size: colNr, type: WidthType.DXA }, verticalAlign: "center",
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s.nr, bold: true, font: "Arial", size: 22, color: d.color })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? "FAFBFC" : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: colTitle, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: s.title, bold: true, font: "Arial", size: 21, color: C.dark })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? "FAFBFC" : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: colDesc, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: s.desc, font: "Arial", size: 20, color: C.gray })] })], }),
      new TableCell({ borders: rowBrd, shading: { fill: d.light, type: ShadingType.CLEAR }, margins: cellM, width: { size: colDomain, type: WidthType.DXA }, verticalAlign: "center",
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: d.label, bold: true, font: "Arial", size: 18, color: d.color })] })], }),
    ]});
  });

  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [colNr, colTitle, colDesc, colDomain], rows: [headerRow, ...dataRows] });
}
```

### Domain Legend

Three-column strip showing all domain colors. Place on the title page. Pass `domainSet` for voorkennis docs.

```javascript
function domainLegend(domainSet = DOMAINS) {
  const entries = Object.values(domainSet);
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
```

### Definition Table

Two-column table with dark header row and alternating rows. Unchanged from v1.

```javascript
function defTable(rows, width = CW) {
  const col1W = Math.round(width * 0.31);
  const col2W = width - col1W;
  const hdrBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: C.blue }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.blue }, left: { style: BorderStyle.SINGLE, size: 1, color: C.blue }, right: { style: BorderStyle.SINGLE, size: 1, color: C.blue } };
  const rowBrd = { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } };
  const cellM = { top: 80, bottom: 80, left: 120, right: 120 };
  return new Table({
    width: { size: width, type: WidthType.DXA }, columnWidths: [col1W, col2W],
    rows: [
      new TableRow({ children: [
        new TableCell({ borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: cellM, width: { size: col1W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "Begrip", bold: true, font: "Arial", size: 22, color: C.white })] })], }),
        new TableCell({ borders: hdrBrd, shading: { fill: C.navy, type: ShadingType.CLEAR }, margins: cellM, width: { size: col2W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "Betekenis", bold: true, font: "Arial", size: 22, color: C.white })] })], }),
      ]}),
      ...rows.map((r, i) => new TableRow({ children: [
        new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: col1W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: r[0], bold: true, font: "Arial", size: 22 })] })], }),
        new TableCell({ borders: rowBrd, shading: { fill: i % 2 === 0 ? C.rowAlt : C.white, type: ShadingType.CLEAR }, margins: cellM, width: { size: col2W, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: r[1], font: "Arial", size: 22 })] })], }),
      ]})),
    ],
  });
}
```

---

## PART 3: DOCUMENT SCAFFOLDS

### Document Styles

```javascript
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
```

### Header & Footer Factory

```javascript
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
```

### Title Block (for title page)

```javascript
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
```

### Checklist & Numbered Questions

```javascript
const CHECKLIST_NUMBERING = {
  reference: "checklist",
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2610",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } },
  }],
};

function checklistItem(text) {
  return new Paragraph({
    numbering: { reference: "checklist", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}

const QUESTION_NUMBERING = {
  reference: "questions",
  levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 540, hanging: 360 } } },
  }],
};

function question(text) {
  return new Paragraph({
    numbering: { reference: "questions", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}
```

---

## PART 4: FULL DOCUMENT TEMPLATES

### Template A: Uitleg vaardigheden (v2 — with domains)

Same as v2. See previous version for full code. Structure:
1. Title page with domain legend
2. Visual TOC page
3. Per vaardigheid: domain banner → waarom → hoe (formula box) → voorbeeld → tip/warning/check → summary schema

### Template B: Uitleg voorkennis (v2 — with domains)

Same as v2. See previous version for full code. Structure:
1. Title page with domain legend (VK_DOMAINS)
2. Visual TOC page
3. Per hoofdstuk: domain banner → uitleg → voorbeeld → controle check → summary schema
4. Checklist page

### Template C: Nieuwsopdracht

Same as v1/v2. See previous version for full code. Structure:
1. Page 1: news article + visual (fits on one page)
2. Page 2: 7 questions with ascending difficulty
3. Page 3: answer key

### Template D: Begeleide Inoefening (NEW in v3)

Produces TWO documents from the same content: a **vragen-document** (with scaffolding but no answers) and a **vragen & antwoorden-document** (with scaffolding + answers + uitleg).

```javascript
async function buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, includeAnswers = false) {
  // oefeningen = [{
  //   nr: 1,
  //   title: "De prijskeuze van een monopolist",
  //   domain: "bedrijf",           // "markt" | "bedrijf" | "arbeid"
  //   introText: "Een monopolist verkoopt...",  // optional context paragraph
  //   formules: ["p = –Q + 50", "TK = 0,25Q²"],  // optional formula box
  //   deelvragen: [{
  //     label: "Vraag 2a — Leid MK, GTK en MO af",
  //     denkstappen: ["MK = afgeleide van TK", ...],  // optional
  //     hint: "Vul de vraaglijn in voor p",           // optional
  //     formuleHerinnering: ["MK = TK'", ...],        // optional
  //     invulformaat: "MK = ............",             // vragen-doc: partial answer template
  //     antwoord: [                                    // antwoorden-doc only
  //       [{ text: "MK: ", bold: true }, { text: "0,5Q" }],
  //     ],
  //     uitleg: "Bij MK differentieer je TK...",       // antwoorden-doc only
  //   }],
  //   samenvatting: [["Kernregel", "MO = MK"], ...],  // optional end-of-exercise schema
  // }]

  const suffix = includeAnswers ? "Vragen & Antwoorden" : "Vragen";
  const children = [];

  // ── TITLE PAGE ──
  children.push(sp(600));
  children.push(...titleBlock(onderwerp, `Begeleide Inoefening — Paragraaf ${paragraafNr}`));
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
    children.push(tipBox("Dit document bevat de vragen én de uitgewerkte antwoorden met uitleg. Probeer altijd eerst zelf de vraag te beantwoorden voordat je het antwoord leest!", C.dAmber, C.dAmberLt, "\uD83D\uDCD6 Studietip: "));
  } else {
    children.push(tipBox("Bij elke oefening vind je denkstappen en hints. Gebruik deze om stap voor stap tot het antwoord te komen. Na afloop kun je je antwoorden controleren met het antwoordendocument.", C.dAmber, C.dAmberLt, "\uD83D\uDE80 Werkwijze: "));
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
    children.push(uitlegBox("Waarom dit het goede antwoord is — de redenering erachter"));
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
      children.push(sp(40));
      if (dv.denkstappen) { children.push(denkstapBox(dv.denkstappen)); children.push(sp()); }
      if (dv.hint) { children.push(hintBox(dv.hint)); children.push(sp()); }
      if (dv.formuleHerinnering) { children.push(formuleHerinneringBox(dv.formuleHerinnering)); children.push(sp()); }

      if (includeAnswers && dv.antwoord) {
        children.push(answerBox(dv.antwoord));
        children.push(sp(40));
        if (dv.uitleg) { children.push(uitlegBox(dv.uitleg)); }
      } else if (dv.invulformaat) {
        children.push(p(dv.invulformaat));
      } else {
        children.push(...answerSpace(3));
      }
      children.push(sp());
    });

    if (oef.samenvatting) {
      children.push(summarySchema(oef.samenvatting, d.color));
      children.push(sp());
    }
  });

  // Build document
  const doc = new Document({
    styles: DOC_STYLES,
    sections: [{
      properties: { page: PAGE },
      headers: { default: makeHeader(`${headerText} — ${suffix}`) },
      footers: { default: makeFooter() },
      children,
    }],
  });
  return await Packer.toBuffer(doc);
}

// Convenience: build both documents at once
async function buildBegeleideInoefeningSplit(paragraafNr, onderwerp, headerText, oefeningen) {
  const vragen = await buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, false);
  const antwoorden = await buildBegeleideInoefening(paragraafNr, onderwerp, headerText, oefeningen, true);
  return { vragen, antwoorden };
}
```

---

## PART 5: SVG → PNG FOR WORD

When embedding graphs or visuals in Word, use this pipeline:

```javascript
async function svgToPngBuffer(svgString, w = 1400, h = 700) {
  return await sharp(Buffer.from(svgString)).resize(w, h).png().toBuffer();
}
```

For bar charts, spin diagrams, and other simple visuals, see the **economic-graph skill Part 3**.

---

## PART 6: QA CHECKLIST FOR WORD DOCUMENTS

Run after every build:

### Vaardigheden document (v2)
1. Does every chapter have: **domain banner** + waarom + hoe + voorbeeld + tip + **summary schema**?
2. Does the title page have the **domain legend** (3-color strip)?
3. Is there a **visual TOC** on page 2 with all skills by domain?
4. Are formula boxes left-aligned monospace with a **domain-colored accent stripe**?
5. Does every summary schema end with a **"Verband met"** row linking to related skills?
6. Are tip boxes colored in the **domain color** (not always blue)?
7. Are warning boxes still red regardless of domain?
8. Does the document have headers, footers, and page numbers?
9. Is it self-readable without the presentation?
10. Are domain assignments consistent? (same skill = same domain color throughout)

### Voorkennis document (v2)
1. Does the title page have the **domain legend** (wiskundig/economisch/grafisch)?
2. Is there a **visual TOC** on page 2 with all chapters by domain?
3. Does every chapter have: **domain banner** + uitleg + voorbeeld + controle + **summary schema**?
4. Are domain assignments correct? (wiskunde = rekenen/algebra, economisch = begrippen, grafisch = grafieken)
5. Are subheadings colored in the **domain color** (not always blue)?
6. Is there a checklist at the end with "Ik kan..." items?
7. Are the checkbox bullets (☐) rendering correctly?

### Nieuwsopdracht
1. Does page 1 fit on ONE page (title + news + visual)?
2. Is the visual understandable in 5 seconds?
3. Are there exactly 7 questions with ascending difficulty?
4. Does the answer key match every question exactly?
5. Is the news recent and relevant for the Netherlands?

### Begeleide inoefening (NEW v3)
1. Are TWO documents generated (vragen + vragen & antwoorden)?
2. Does the legend page explain ALL box types used in the document?
3. Does every oefening start with a **domain banner**?
4. Are **denkstappen** numbered and logically ordered?
5. Do **formule-herinneringen** contain only formulas needed for THAT specific question?
6. Are **hints** concise (1-2 sentences max)?
7. In the antwoorden-doc: does every answer have an **uitleg** explaining the reasoning?
8. In the vragen-doc: are there **invulformaten** (partial answer templates) for calculation questions?
9. Is the language positive? No references to difficulty level or "hulp bij moeite" — only "begeleide inoefening"
10. Does the document end with a **samenvattend schema** for the whole topic?

**If any answer is "no", fix before delivering.**

---

## CHANGELOG v2 → v3

| What changed | v2 | v3 |
|---|---|---|
| Templates | A (vaardigheden), B (voorkennis), C (nieuwsopdracht) | Added **D (begeleide inoefening)** |
| Color palette | Base + 3 domains | Added **scaffolding colors** (purple, stepBg, stepBorder) |
| New components | None | `denkstapBox()`, `hintBox()`, `formuleHerinneringBox()`, `answerBox()`, `uitlegBox()`, `answerSpace()` |
| Split output | Single doc per template | Template D produces **two docs** (vragen + antwoorden) from same data |
| Naming policy | None | **"Begeleide inoefening"** — never label as easy/basic/hulp |
| Description | Triggers on 4 doc types | Added triggers for scaffolding, denkstappen, hints |

---

## NEVER DO

- Use WidthType.PERCENTAGE (breaks in Google Docs)
- Forget cell margins (unreadable cramped text)
- Use ShadingType.SOLID (causes black backgrounds)
- Skip validate.py after building
- Hardcode page width without accounting for margins
- Mix fonts within a document (stick to Arial throughout)
- Use font sizes below 11pt (size: 22 in half-points)
- Create formula boxes without Consolas font
- Skip the spacer (sp()) between components — they need breathing room
- Assign a skill to the wrong domain (check: is it about the market, the firm, or the labor market?)
- Assign a voorkennis chapter to the wrong domain (check: is it math, economics, or graph reading?)
- Forget the "Verband met" row in summary schemas — this makes cross-references explicit
- Use a domain color for warning boxes — warnings are always red regardless of domain
- Generate SVG infographics or mindmaps for Word documents — quality is too unpredictable for stable output
- Label begeleide inoefening as "makkelijk", "basisniveau", or "hulp" — always use neutral, positive framing

---

Apply this skill to the following task: $ARGUMENTS
