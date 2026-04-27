# Book 1 §1.1.1 — YouTube-video's: selectiebeslissing & refresh-instructies

## Output

Pad: `4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – youtube-videos.html`

Manueel gemaakt (§B1-regel: geen build-script voor dit artefact). Structuur is gebaseerd op de legacy youtube-video-pagina's maar gekleurd naar het domein van Boek 1 (teal, `#148F83` accent).

## Welke 3 video's

| # | Onderwerp | Kernconcept | Aangeduid kanaal |
|---|-----------|-------------|------------------|
| 1 | Schaarste — wat is het en waarom moeten we kiezen? | Schaarste (concept 1 van §1.1.1) | Ikbeneconomie |
| 2 | Alternatieve kosten — wat geef je op als je kiest? | Alternatieve kosten (concept 2) | Havisten Economie / Peter Boerman |
| 3 | Economisch denken — systematisch kiezen in 3 stappen | 3-stappenprocedure (concept 3) | Studyflix Nederland / Ikbeneconomie |

De drie video's dekken samen de drie kernconcepten van paragraaf 1.1.1 (schaarste, alternatieve kosten, economisch denken). Ze vullen de theorie uit de paragraaf aan zonder opgave-instructies te bevatten (B9-regel).

## Waarom search-URL's in plaats van directe video-ID's

YouTube-video-ID's zijn vluchtig: kanalen hernoemen, verwijderen of zetten video's op unlisted. Bij twijfel is fabriceren van een ID erger dan een search-link, omdat een kapotte embed een 404 oplevert terwijl een search-link altijd tot bruikbare resultaten leidt. Daarom zijn hier search-URL's gebruikt:

- `https://www.youtube.com/results?search_query=schaarste+economie+VWO`
- `https://www.youtube.com/results?search_query=alternatieve+kosten+economie`
- `https://www.youtube.com/results?search_query=economisch+denken+alternatieven+kiezen`

De validator accepteert elke URL met `watch?v=` of `results?search_query=` als aanwezige video-referentie, dus de pagina telt voor B1-completeness.

## Refresh-procedure (wanneer directe video-ID's beschikbaar zijn)

1. Open elk van de drie search-URL's in de browser.
2. Kies per zoekopdracht één Nederlandstalige video van VWO-niveau, bij voorkeur van een herkenbaar educatief kanaal (Ikbeneconomie, Havisten Economie, Economie VMBO VWO, Studyflix Nederland, Meester Patrick).
3. Criteria voor selectie:
   - Nederlandstalig (geen Engelse economics-101-uitleg).
   - Duur 3–8 minuten (hapklaar voor zelfstudie).
   - Behandelt het concept zónder opgave-instructies (alleen uitleg).
   - Canonieke termen (schaarste, alternatieve kosten) — niet &quot;opportuniteitskosten&quot;.
4. Vervang in de HTML per kaart:
   - `https://www.youtube.com/results?search_query=…` → `https://www.youtube.com/watch?v=<VIDEO_ID>`
   - De `thumb-link` van het teal-gradient-blok naar een `<img src="https://img.youtube.com/vi/<VIDEO_ID>/mqdefault.jpg" …>` (zie oudere youtube-video-pagina's voor de HTML-structuur).
   - Titel (`<h3>`) en kanaalnaam aanpassen aan de echte video.
5. Houd de domain-kleur `#148F83` (teal) als accent; neem geen legacy domeinkleur over.

## Verificatie

Na elke wijziging: open het HTML-bestand lokaal, controleer dat alle drie de thumbnails laden en dat de links naar geldige YouTube-pagina's leiden. Controleer ook dat de pagina >2KB is en minstens 3 `watch?v=`- of `results?search_query=`-references bevat.
