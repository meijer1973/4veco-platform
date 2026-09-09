// HOW TO ADAPT: pass the paragraph directory; change only the instructional SVG content for another approved target.
// Costs are schematic boxes, not coordinate plots. Exact WE totals and per-unit values are checked below.
const fs = require('fs'); const path = require('path');
const sharp = require('sharp');
const output = path.resolve(process.argv[2]);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360" role="img" aria-labelledby="title desc">
<title id="title">Van maandkosten naar kosten per houder</title><desc id="desc">Links constante kosten: TCK 200 euro per maand; GCK 200 gedeeld door Q. Rechts variabele kosten: TVK 2 maal Q euro per maand; GVK 2 euro per houder. Totale kosten zijn de som.</desc>
<rect width="720" height="360" rx="8" fill="#F7FAFC"/>
<g font-family="Arial, sans-serif" fill="#243746" text-anchor="middle">
<text x="360" y="28" font-size="21" font-weight="bold">Van maandkosten naar kosten per houder</text>
<rect x="25" y="48" width="325" height="100" rx="8" fill="#E2EDF6" stroke="#1A5276"/>
<rect x="370" y="48" width="325" height="100" rx="8" fill="#E5F1E9" stroke="#246344"/>
<text x="187" y="75" font-size="18" font-weight="bold">Constant: TCK = € 200 per maand</text>
<text x="187" y="104" font-size="16">Het totale bedrag blijft gelijk.</text>
<text x="187" y="131" font-size="16">Dezelfde ruimte en machines</text>
<text x="532" y="75" font-size="18" font-weight="bold">Variabel: TVK = 2Q euro per maand</text>
<text x="532" y="104" font-size="16">Het totale bedrag groeit met Q.</text>
<text x="532" y="131" font-size="16">€ 2 materiaal en stroom per houder</text>
<path d="M187 151V188 M180 180L187 188L194 180 M532 151V188 M525 180L532 188L539 180" fill="none" stroke="#243746" stroke-width="2"/>
<text x="105" y="176" font-size="16">deel door Q</text><text x="450" y="176" font-size="16">deel door Q</text>
<rect x="25" y="199" width="325" height="96" rx="8" fill="#E2EDF6" stroke="#1A5276"/>
<rect x="370" y="199" width="325" height="96" rx="8" fill="#E5F1E9" stroke="#246344"/>
<text x="187" y="226" font-size="18" font-weight="bold">GCK = 200 / Q</text>
<text x="187" y="255" font-size="17">100 houders: € 2 per houder</text><text x="187" y="281" font-size="17">200 houders: € 1 per houder</text>
<text x="532" y="226" font-size="18" font-weight="bold">GVK = 2Q / Q = € 2 per houder</text>
<text x="532" y="255" font-size="17">Gelijk bedrag per houder</text><text x="532" y="281" font-size="17">is hier een aanname.</text>
<text x="360" y="324" font-size="17" font-weight="bold">TK = TCK + TVK   •   GTK = GCK + GVK</text>
<text x="360" y="348" font-size="14">Eén maand • 100–200 houders • dezelfde capaciteit • gemiddelden: Q &gt; 0</text>
</g></svg>`;
for (const q of [100,200]) { if (200/q+2 !== (200+2*q)/q) throw Error('Average identity failed'); }
fs.mkdirSync(path.join(output,'_assets'),{recursive:true});
fs.writeFileSync(path.join(output,'_assets/2.1.1_fig_1.svg'),svg);
sharp(Buffer.from(svg)).resize(1440).png().toFile(path.join(output,'_assets/2.1.1_fig_1.png')).then(()=>console.log('Schematic geometry: no plotted curves; box positions within 720×360. SVG and PNG written.'));
