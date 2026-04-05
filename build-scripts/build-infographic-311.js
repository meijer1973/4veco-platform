/**
 * Samenvatting 3.1.1 Markt en marktstructuur
 * One-page visual summary in Word format.
 */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak,
} = require("docx");

const PAGE = {
  size: { width: 11906, height: 16838 },
  margin: { top: 720, right: 720, bottom: 720, left: 720 },
};
const CW = 10466; // wider content area for infographic

const C = {
  navy:       "1E2761",
  white:      "FFFFFF",
  dark:       "2D3748",
  gray:       "718096",
  lightGray:  "F7F8FA",
  dBlue:      "1A5276",
  dBlueLt:    "EBF5FB",
  dBlueDk:    "154360",
  dAmber:     "E67E22",
  dAmberLt:   "FEF5E7",
  dAmberDk:   "BA6A1C",
  dGreen:     "1E8449",
  dGreenLt:   "E8F8F0",
  dGreenDk:   "186A3B",
  red:        "D9534F",
  lightRed:   "FDE8E8",
  rowAlt:     "F7FAFC",
};

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: C.white },
  bottom: { style: BorderStyle.NONE, size: 0, color: C.white },
  left: { style: BorderStyle.NONE, size: 0, color: C.white },
  right: { style: BorderStyle.NONE, size: 0, color: C.white },
};

function colorBorder(color) {
  return {
    top: { style: BorderStyle.SINGLE, size: 1, color },
    bottom: { style: BorderStyle.SINGLE, size: 1, color },
    left: { style: BorderStyle.SINGLE, size: 1, color },
    right: { style: BorderStyle.SINGLE, size: 1, color },
  };
}

const sp = (after = 60) => new Paragraph({ spacing: { after }, children: [] });

async function build() {
  const children = [];

  // ── TITLE BANNER ──
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: colorBorder(C.navy),
      shading: { fill: C.navy, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 300, right: 300 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "3.1.1  ", font: "Arial", size: 36, color: C.dAmber, bold: true }),
            new TextRun({ text: "Markt en marktstructuur", font: "Arial", size: 36, color: C.white, bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 60 },
          children: [new TextRun({ text: "De bouwstenen van elke markt in \u00e9\u00e9n overzicht", font: "Arial", size: 22, color: C.dBlueLt, italics: true })],
        }),
      ],
    })] })],
  }));
  children.push(sp(100));

  // ── ROW 1: Concrete vs Abstracte markt ──
  const halfW = Math.floor((CW - 200) / 2);

  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [
      // Section header spanning full width
      new TableRow({ children: [
        new TableCell({
          borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.dBlue } },
          margins: { top: 40, bottom: 60, left: 100, right: 100 },
          width: { size: CW, type: WidthType.DXA },
          columnSpan: 3,
          children: [new Paragraph({
            children: [
              new TextRun({ text: "\uD83C\uDFEA  ", font: "Arial", size: 24 }),
              new TextRun({ text: "Soort markt", font: "Arial", size: 24, bold: true, color: C.dBlue }),
              new TextRun({ text: "   \u2014   Waar ontmoeten vragers en aanbieders elkaar?", font: "Arial", size: 20, color: C.gray }),
            ],
          })],
        }),
      ]}),
      // Two cards
      new TableRow({ children: [
        // Concrete markt
        new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dBlue }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt } },
          shading: { fill: C.dBlueLt, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          width: { size: halfW, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
              new TextRun({ text: "Concrete markt", font: "Arial", size: 22, bold: true, color: C.dBlueDk }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
              new TextRun({ text: "Fysieke plek", font: "Arial", size: 20, color: C.dark }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "Vismarkt \u2022 Winkel \u2022 Veiling", font: "Arial", size: 18, color: C.gray, italics: true }),
            ]}),
          ],
        }),
        // Spacer
        new TableCell({
          borders: noBorder,
          width: { size: 200, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "vs.", font: "Arial", size: 20, color: C.gray, bold: true }),
          ]})],
        }),
        // Abstracte markt
        new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dAmber }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt } },
          shading: { fill: C.dAmberLt, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          width: { size: halfW, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
              new TextRun({ text: "Abstracte markt", font: "Arial", size: 22, bold: true, color: C.dAmberDk }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
              new TextRun({ text: "Geen fysieke locatie", font: "Arial", size: 20, color: C.dark }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "Huizenmarkt \u2022 Oliemarkt \u2022 Internet", font: "Arial", size: 18, color: C.gray, italics: true }),
            ]}),
          ],
        }),
      ]}),
    ],
  }));
  children.push(sp(100));

  // ── ROW 2: Homogeen vs Heterogeen ──
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.dGreen } },
          margins: { top: 40, bottom: 60, left: 100, right: 100 },
          width: { size: CW, type: WidthType.DXA },
          columnSpan: 3,
          children: [new Paragraph({
            children: [
              new TextRun({ text: "\uD83D\uDCE6  ", font: "Arial", size: 24 }),
              new TextRun({ text: "Producttype", font: "Arial", size: 24, bold: true, color: C.dGreen }),
              new TextRun({ text: "   \u2014   Hoe ziet de consument het product?", font: "Arial", size: 20, color: C.gray }),
            ],
          })],
        }),
      ]}),
      new TableRow({ children: [
        new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dGreen }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt } },
          shading: { fill: C.dGreenLt, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          width: { size: halfW, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
              new TextRun({ text: "Homogeen product", font: "Arial", size: 22, bold: true, color: C.dGreenDk }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
              new TextRun({ text: "Geen verschil \u2192 prijs is alles", font: "Arial", size: 20, color: C.dark }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "Benzine \u2022 Elektriciteit \u2022 Tarwe", font: "Arial", size: 18, color: C.gray, italics: true }),
            ]}),
          ],
        }),
        new TableCell({
          borders: noBorder,
          width: { size: 200, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "vs.", font: "Arial", size: 20, color: C.gray, bold: true }),
          ]})],
        }),
        new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dAmber }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dAmberLt } },
          shading: { fill: C.dAmberLt, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          width: { size: halfW, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [
              new TextRun({ text: "Heterogeen product", font: "Arial", size: 22, bold: true, color: C.dAmberDk }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
              new TextRun({ text: "W\u00e9l verschil \u2192 merk & kwaliteit tellen", font: "Arial", size: 20, color: C.dark }),
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "Auto\u2019s \u2022 Restaurants \u2022 Telefoons", font: "Arial", size: 18, color: C.gray, italics: true }),
            ]}),
          ],
        }),
      ]}),
    ],
  }));
  children.push(sp(100));

  // ── ROW 3: Toetredingsdrempels ──
  const thirdW = Math.floor((CW - 300) / 3);
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.dAmber } },
        margins: { top: 40, bottom: 60, left: 100, right: 100 },
        width: { size: CW, type: WidthType.DXA },
        children: [new Paragraph({
          children: [
            new TextRun({ text: "\uD83D\uDEA7  ", font: "Arial", size: 24 }),
            new TextRun({ text: "Toetredingsdrempels", font: "Arial", size: 24, bold: true, color: C.dAmber }),
            new TextRun({ text: "   \u2014   Hoe makkelijk kunnen nieuwe bedrijven toetreden?", font: "Arial", size: 20, color: C.gray }),
          ],
        })],
      }),
    ] })],
  }));
  // Drempels: hoog vs laag in compact form
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [halfW, 200, halfW],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.red }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed }, left: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed }, right: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed } },
        shading: { fill: C.lightRed, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        width: { size: halfW, type: WidthType.DXA },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
            new TextRun({ text: "\u26D4  Hoge drempels", font: "Arial", size: 21, bold: true, color: C.red }),
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "Hoog startkapitaal \u2022 Vergunningen\nNaamsbekendheid \u2022 Netwerk nodig", font: "Arial", size: 18, color: C.dark }),
          ]}),
        ],
      }),
      new TableCell({
        borders: noBorder, width: { size: 200, type: WidthType.DXA },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "vs.", font: "Arial", size: 20, color: C.gray, bold: true }),
        ]})],
      }),
      new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dGreen }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt } },
        shading: { fill: C.dGreenLt, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        width: { size: halfW, type: WidthType.DXA },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [
            new TextRun({ text: "\u2705  Lage drempels", font: "Arial", size: 21, bold: true, color: C.dGreen }),
          ]}),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "Weinig kapitaal \u2022 Geen vergunning\nBijles \u2022 Freelance \u2022 Straatverkoop", font: "Arial", size: 18, color: C.dark }),
          ]}),
        ],
      }),
    ] })],
  }));
  children.push(sp(100));

  // ── ROW 4: DE TWEE KETENS (core insight) ──
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: { ...noBorder, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.navy } },
        margins: { top: 40, bottom: 60, left: 100, right: 100 },
        width: { size: CW, type: WidthType.DXA },
        children: [new Paragraph({
          children: [
            new TextRun({ text: "\uD83D\uDD17  ", font: "Arial", size: 24 }),
            new TextRun({ text: "De twee ketens", font: "Arial", size: 24, bold: true, color: C.navy }),
            new TextRun({ text: "   \u2014   Het kernverband van dit hoofdstuk", font: "Arial", size: 20, color: C.gray }),
          ],
        })],
      }),
    ] })],
  }));

  // Chain 1: hoge drempels
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.red }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed }, left: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed }, right: { style: BorderStyle.SINGLE, size: 1, color: C.lightRed } },
      shading: { fill: C.lightRed, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Hoge drempels", font: "Arial", size: 22, bold: true, color: C.red }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Weinig aanbieders", font: "Arial", size: 22, bold: true, color: C.dark }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Minder concurrentie", font: "Arial", size: 22, bold: true, color: C.dark }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Hogere prijs  \u26A0", font: "Arial", size: 22, bold: true, color: C.red }),
        ]}),
      ],
    })] })],
  }));
  children.push(sp(40));

  // Chain 2: lage drempels
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 6, color: C.dGreen }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, left: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dGreenLt } },
      shading: { fill: C.dGreenLt, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Lage drempels", font: "Arial", size: 22, bold: true, color: C.dGreen }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Veel aanbieders", font: "Arial", size: 22, bold: true, color: C.dark }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Meer concurrentie", font: "Arial", size: 22, bold: true, color: C.dark }),
          new TextRun({ text: "   \u27A1   ", font: "Arial", size: 22, color: C.gray }),
          new TextRun({ text: "Lagere prijs  \u2705", font: "Arial", size: 22, bold: true, color: C.dGreen }),
        ]}),
      ],
    })] })],
  }));
  children.push(sp(80));

  // ── FOOTER: Voorbeeld ──
  children.push(new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt }, bottom: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt }, left: { style: BorderStyle.SINGLE, size: 12, color: C.dBlue }, right: { style: BorderStyle.SINGLE, size: 1, color: C.dBlueLt } },
      shading: { fill: C.dBlueLt, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 200, right: 200 },
      width: { size: CW, type: WidthType.DXA },
      children: [new Paragraph({ children: [
        new TextRun({ text: "\uD83D\uDCF1 Voorbeeld: ", bold: true, font: "Arial", size: 20, color: C.dBlue }),
        new TextRun({ text: "Toen KPN een monopolie had op telecom, waren de prijzen hoog (hoge drempels \u2192 weinig concurrentie). Na toetreding van Vodafone en T-Mobile daalden de prijzen (lagere drempels \u2192 meer concurrentie).", font: "Arial", size: 20, color: C.dark }),
      ]})],
    })] })],
  }));

  // ── BUILD ──
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{
      properties: { page: PAGE },
      children,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const outPath = "3.1.1 Markt en marktstructuur \u2013 samenvatting.docx";
  fs.writeFileSync(outPath, buf);
  console.log(`Generated: ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
