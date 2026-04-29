# Finding and placing YouTube videos

## Task
For each paragraph, find **3 Dutch-language YouTube videos** that explain the subject matter at VWO level. Create one HTML file per paragraph following the existing format.

## File location and naming
- **Folder:** `X.Y.Z Paragraaf – [Naam]/2. Leren/`
- **Filename:** `X.Y.Z [Naam] – youtube-videos.html`
- Use the existing HTML template (cards with thumbnail, channel name, and button). Refer to an existing file as an example, e.g. `3.1.1 Markt en marktstructuur – youtube-videos.html`.

## Video selection criteria
1. **Language:** Dutch
2. **Level:** VWO economics (upper secondary), matching the paragraph content
3. **Quality:** Clear explanation, factually correct, not outdated
4. **Duration:** Preferably 5–15 minutes (no full lectures)
5. **Variety:** Preferably from different channels

## Preferred channels (search here first)
- [Gijs van den Brekel](https://www.youtube.com/@gijsvandenbrekel) — color: `#2e86c1`
- [Meester Patrick](https://www.youtube.com/@MeesterPatrick) — color: `#27ae60`
- [Frank Economie](https://www.youtube.com/@FrankEconomie) — color: `#e67e22`

If these channels do not have a suitable video for a paragraph, search further on YouTube. Give other channels a neutral color (`#7f8c8d`).

## HTML format per video card
```html
<div class="card" style="border-left-color: [channel-color];">
  <div class="card-inner">
    <a href="[youtube-url]" target="_blank" class="thumb-link">
      <img src="https://img.youtube.com/vi/[VIDEO_ID]/mqdefault.jpg" alt="[title]" class="thumb">
      <div class="play-overlay">▶</div>
    </a>
    <div class="card-text">
      <h3><a href="[youtube-url]" target="_blank">[title]</a></h3>
      <p class="channel" style="color:[channel-color];">📺 [channel-name]</p>
      <a class="btn" href="[youtube-url]" target="_blank" style="background:[channel-color];">
        ▶ Bekijk op YouTube
      </a>
    </div>
  </div>
</div>
```

## Workflow
1. Read the learning objectives for each paragraph (from the presentation or "uitleg vaardigheden")
2. Find 3 videos that cover these learning objectives
3. Generate the HTML file with the full page structure (copy head/style from an existing file)
4. Save in the correct `2. Leren/` folder

## Expected result
Each paragraph has an `X.Y.Z [Naam] – youtube-videos.html` in `2. Leren/` with 3 video cards, thumbnails, and direct YouTube links.
