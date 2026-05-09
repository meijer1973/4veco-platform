/**
 * Meaningful alt-text registry for §1.1.1 companion visuals.
 *
 * Keyed by asset base (matches the htmlAssetName used in builders, before
 * the surface suffix `_doc / _slide / _summary / _web_light / _web_dark`).
 *
 * Used by every §1.1.1 builder via require(); converters consume the value
 * through the docx convention `descr="asset-alt:<text>"`.
 *
 * Adding a new visual: add an entry here AND pass `ALT[base]` to the
 * builder's image-embed helper. Per-paragraph builders fail loudly when a
 * lookup is missing, so omissions cannot ship.
 *
 * Voorkennis review (1.1.1-companion-visual-review.md, HF-4) flagged that
 * HTML emitted `alt="1.1.1_ex_1"` and DOCX emitted `descr="asset:1.1.1_ex_1"`
 * — filename / asset-id shaped, not meaningful for screen readers. This
 * registry is the L1.5V Bucket A4 fix.
 */

module.exports = {
  "1.1.1_fig_1": "Infographic: brede behoeften-trechter (zakgeld, vrije tijd, ruimte, aandacht) loopt door een schaarste-filter naar een smal keuze-uitstroompunt — illustreert dat behoeften groter zijn dan beschikbare middelen.",
  "1.1.1_fig_2": "Keuzediagram met twee alternatieven naast elkaar; de gekozen optie levert de opbrengst, het beste niet-gekozen alternatief wordt aangewezen als de alternatieve kosten.",
  "1.1.1_fig_3": "Flowchart van de vier stappen om alternatieve kosten en nettowaarde te bepalen: (1) alternatieven benoemen, (2) opbrengst per alternatief berekenen, (3) beste niet-gekozen alternatief = alternatieve kosten, (4) nettowaarde = opbrengst gekozen min alternatieve kosten.",
  "1.1.1_we_1":  "Uitgewerkt voorbeeld tarwe versus maïs op 10 hectare: tarwe levert €500 per hectare op (totaal €5.000), maïs €350 per hectare (totaal €3.500); de alternatieve kosten van tarwe kiezen zijn €3.500 en de nettowaarde €1.500.",
  "1.1.1_ex_1":  "Staafdiagram met winst per hectare voor drie gewassen: tarwe €500, maïs €350, zonnebloemen €300 — duidelijk verschil in opbrengst tussen de alternatieven.",
  "1.1.1_news_woningtekort": "Staafdiagram met de vraag naar sociale huurwoningen versus het aanbod in Nederland: vraag is aanzienlijk hoger dan aanbod, zichtbaar tekort.",
};
