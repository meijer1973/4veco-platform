# A4 Plan — Meaningful Alt-Text Infrastructure (L1.5V Bucket A)

**Status:** ready to execute. Read-only research complete; no source files modified.
**Worktree:** `C:/Projects/4veco/4veco-platform-companion` (branch `content/1.1.1-companion-quality`).
**Dependency:** A0 done. A1, A2, A3, A5 already shipped. A4 is the last Bucket A item.

---

## 1. Builder signature audit

Five distinct image-embed helpers exist across the §1.1.1 builders. Each currently bakes `description: "asset:" + htmlAssetName` into the DOCX `descr` attribute. **None** accept an alt-text parameter today.

### 1.1 Current signatures

| Builder | Helper | Signature | Line |
|---|---|---|---|
| `b1-111-voorkennis.js` | `embedAssetImage` | `embedAssetImage(assetsDir, filename, width, height, htmlAssetName=filename)` | 30–42 |
| `b1-111-vaardigheden.js` | `embedAssetImage` (uses module-scope `ASSETS_DIR`) | `embedAssetImage(filename, width, height, htmlAssetName=filename)` | 46–61 |
| `b1-111-samenvatting.js` | `embeddedImage` | `embeddedImage(filename, width, height, htmlAssetName=filename.replace(/\.png$/i, ""))` | 87–99 |
| `b1-111-presentatie.js` | inline `s.addImage({ data, x, y, w, h })` | no alt-text plumbing at all (PptxGenJS) | 217, 251, 307, 352, 390 |
| `b1-111-inoefening.js` | `IMG_FIG_2`/`IMG_WE_1` → `embedAssetFromPath` in `lib-begeleide-inoefening.js` | `embedAssetFromPath(imgPath, width, height, assetName)` | lib-begeleide-inoefening.js 315–329 |
| `b1-111-opgaven.js` | none — does not embed asset images directly | — |
| `b1-111-nieuws.js` | inline `new ImageRun({ ... })` — does NOT set altText at all | no altText prop, no descr | 317–324 |

Slide alt-text via PptxGenJS is **out of scope for L1.5V** per the whole-sprint plan (jest test targets HTML/DOCX only).

### 1.2 Recommended new signature (DOCX path)

```javascript
function embedAssetImage(assetsDir, filename, width, height, assetBase, altText) {
  if (!altText || altText.length < 10) {
    throw new Error(`embedAssetImage: altText required (>=10 chars) for ${assetBase}, got: ${JSON.stringify(altText)}`);
  }
  const imgPath = path.join(assetsDir, filename + ".png");
  if (!fs.existsSync(imgPath)) return null;
  const buf = fs.readFileSync(imgPath);
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({
      data: buf, transformation: { width, height }, type: "png",
      altText: { title: assetBase, description: "asset-alt:" + altText, name: assetBase },
    })],
  });
}
```

Per-paragraph builders fail loudly; the shared `lib-begeleide-inoefening.js` helper logs a warning instead (other paragraphs may not have alt-text yet).

---

## 2. Alt-text registry

### 2.1 File: `build-scripts/content/book-1/b1-111-alt-text.js`

| Asset base | Surfaces | Proposed Dutch alt-text |
|---|---|---|
| `1.1.1_fig_1` | presentatie / vaardigheden / samenvatting | "Infographic: brede behoeften-trechter (zakgeld, vrije tijd, ruimte, aandacht) loopt door een schaarste-filter naar een smal keuze-uitstroompunt — illustreert dat behoeften groter zijn dan beschikbare middelen." |
| `1.1.1_fig_2` | presentatie / vaardigheden / samenvatting / opgaven | "Keuzediagram met twee alternatieven naast elkaar; de gekozen optie levert de opbrengst, het beste niet-gekozen alternatief wordt aangewezen als de alternatieve kosten." |
| `1.1.1_fig_3` | presentatie / vaardigheden / samenvatting | "Flowchart van de vier stappen om alternatieve kosten te bepalen: (1) alternatieven benoemen, (2) opbrengst per alternatief berekenen, (3) beste niet-gekozen alternatief = alternatieve kosten, (4) nettowaarde = opbrengst gekozen min alternatieve kosten." |
| `1.1.1_we_1` | presentatie / vaardigheden / samenvatting / opgaven | "Uitgewerkt voorbeeld tarwe versus maïs op 10 hectare: tarwe levert €500 per hectare op (totaal €5.000), maïs €350 per hectare (totaal €3.500); de alternatieve kosten van tarwe kiezen zijn €3.500 en de nettowaarde €1.500." |
| `1.1.1_ex_1` | voorkennis | "Staafdiagram met winst per hectare voor drie gewassen: tarwe €500, maïs €350, zonnebloemen €300 — duidelijk verschil in opbrengst tussen de alternatieven." |
| `1.1.1_news_woningtekort` | nieuws | "Staafdiagram met de vraag naar sociale huurwoningen versus het aanbod in Nederland: vraag is aanzienlijk hoger dan aanbod, zichtbaar tekort." |

---

## 3. Converter parsing change

### 3.1 Files

- `convert_voorkennis.py` line ~290–292
- `convert_vaardigheden.py` two parse sites (~188–191, ~343–345)
- `convert_samenvatting.py` line ~130
- `convert_begeleide_inoefening.py` line ~134
- `convert_nieuws.py` (optional)

### 3.2 Parse logic

```python
m = re.match(r'^asset(-alt)?:(.*)$', descr or '')
if m:
    is_legacy = m.group(1) is None
    payload = m.group(2)
    if is_legacy:
        sys.stderr.write(f"WARNING: legacy 'asset:' prefix for {payload!r} — migrate builder to pass altText.\n")
        stream.append(('asset_image', {'base': payload, 'alt': payload}))
    else:
        title = docPr.get('title', '') or payload[:30]
        stream.append(('asset_image', {'base': title, 'alt': payload}))
```

Render-site change: `edata` is now a dict; use `edata['base']` for variant resolution and `edata['alt']` for HTML `alt`.

---

## 4. Builder call-site map

| Builder | Line | Asset |
|---|---|---|
| voorkennis | 465 | 1.1.1_ex_1 |
| vaardigheden | 441, 498, 502, 520 | 1.1.1_fig_1 / 1.1.1_fig_3 / 1.1.1_fig_2 / 1.1.1_we_1 |
| samenvatting | 194, 266, 325, 379 | 1.1.1_fig_1 / 1.1.1_fig_2 / 1.1.1_fig_3 / 1.1.1_we_1 |
| inoefening | 43-48, 49-54 | 1.1.1_fig_2 / 1.1.1_we_1 |
| nieuws | 317-324 | 1.1.1_news_woningtekort |

Each builder adds at top: `const ALT = require("./b1-111-alt-text");`

---

## 5. Failure mode

Per-paragraph builders throw if `altText` missing. Shared `lib-begeleide-inoefening.js` warns instead (cross-paragraph backward compat). Converters warn on legacy `asset:` prefix and fall back to asset id.

---

## 6. Regression test

`engines/tests/companion-alt-text-meaningful.test.js`. Reads deployed §1.1.1 voorkennis.html and vaardigheden.html. Asserts every asset `<img alt>`: ≥10 chars, contains a space, doesn't match `^1\.1\.1_(fig|ex|we|mc|news)`. Skip cleanly if files not deployed.

Path: `4veco-lessen/Boek 1 .../1.1 Hoofdstuk .../1.1.1 .../*.html` (correcting agent's path which referenced an obsolete `4veco-leerlingenportaal/`).

---

## 7. Surface-by-surface impact

- DOCX: descr changes, regenerate every DOCX
- HTML: alt changes, run deploy.js
- SVG: unchanged (alt-text lives in embedding metadata, not the SVG)
- PowerPoint: out of scope

---

## 8. Commit plan

**Commit 1:** `feat: meaningful alt-text registry + thread through 5 §1.1.1 builders`
- New `b1-111-alt-text.js`
- All 5 builder files
- `lib-begeleide-inoefening.js`
- Regenerated DOCX in lessen tree (separate lessen commit)

**Commit 2:** `feat: converters parse asset-alt: prefix + jest meaningful-alt regression test`
- All 5 converter files
- New `engines/tests/companion-alt-text-meaningful.test.js`
- Regenerated HTML in lessen tree (separate lessen commit)

---

## 9. Risk register

- Shared lib helper (`embedAssetFromPath`) does NOT throw on missing altText, only warns; backward compat for paragraphs that haven't migrated.
- Other Book-1 paragraphs don't yet exist with content; safe.
- Slide alt-text gets a TODO; not gating.
- Existing list-rendering test fixtures still use `asset:` prefix; converters keep parsing it (with warning).

---

## 10. Acceptance gates

1. All 5 builders exit 0.
2. `npx jest` green including new `companion-alt-text-meaningful.test.js`.
3. `node scripts/deploy.js` produces no `WARNING: legacy 'asset:' prefix` on §1.1.1.
4. Manual: open voorkennis.html devtools, confirm `alt="Staafdiagram..."` (full sentence).
5. Manual: open voorkennis.docx in Word, right-click image → Edit Alt Text → same string.
