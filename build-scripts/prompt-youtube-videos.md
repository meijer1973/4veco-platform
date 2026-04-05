# YouTube-video's zoeken en plaatsen

## Opdracht
Zoek voor elke paragraaf **3 Nederlandstalige YouTube-video's** die de leerstof uitleggen op VWO-niveau. Maak per paragraaf een HTML-bestand volgens het bestaande format.

## Bestandslocatie en naamgeving
- **Map:** `X.Y.Z Paragraaf – [Naam]/2. Leren/`
- **Bestandsnaam:** `X.Y.Z [Naam] – youtube-videos.html`
- Gebruik het bestaande HTML-template (cards met thumbnail, kanaalnaam, en knop). Zie een bestaand bestand als voorbeeld, bijv. `3.1.1 Markt en marktstructuur – youtube-videos.html`.

## Selectiecriteria video's
1. **Taal:** Nederlands
2. **Niveau:** VWO economie (bovenbouw), passend bij de paragraafinhoud
3. **Kwaliteit:** Duidelijke uitleg, correct vakinhoudelijk, niet verouderd
4. **Duur:** Bij voorkeur 5–15 minuten (geen volledige colleges)
5. **Variatie:** Liefst van verschillende kanalen

## Voorkeurskanalen (zoek hier eerst)
- [Gijs van den Brekel](https://www.youtube.com/@gijsvandenbrekel) — kleur: `#2e86c1`
- [Meester Patrick](https://www.youtube.com/@MeesterPatrick) — kleur: `#27ae60`
- [Frank Economie](https://www.youtube.com/@FrankEconomie) — kleur: `#e67e22`

Als deze kanalen geen passende video voor een paragraaf hebben, zoek dan verder op YouTube. Geef andere kanalen een neutrale kleur (`#7f8c8d`).

## HTML-format per video-card
```html
<div class="card" style="border-left-color: [kanaalkleur];">
  <div class="card-inner">
    <a href="[youtube-url]" target="_blank" class="thumb-link">
      <img src="https://img.youtube.com/vi/[VIDEO_ID]/mqdefault.jpg" alt="[titel]" class="thumb">
      <div class="play-overlay">▶</div>
    </a>
    <div class="card-text">
      <h3><a href="[youtube-url]" target="_blank">[titel]</a></h3>
      <p class="channel" style="color:[kanaalkleur];">📺 [kanaalnaam]</p>
      <a class="btn" href="[youtube-url]" target="_blank" style="background:[kanaalkleur];">
        ▶ Bekijk op YouTube
      </a>
    </div>
  </div>
</div>
```

## Werkwijze
1. Lees per paragraaf de leerdoelen (uit de presentatie of uitleg vaardigheden)
2. Zoek 3 video's die deze leerdoelen dekken
3. Genereer het HTML-bestand met de volledige pagina-structuur (kopieer head/style uit een bestaand bestand)
4. Sla op in de juiste `2. Leren/` map

## Verwacht eindresultaat
Elke paragraaf heeft een `X.Y.Z [Naam] – youtube-videos.html` in `2. Leren/` met 3 video-cards, thumbnails, en directe YouTube-links.
