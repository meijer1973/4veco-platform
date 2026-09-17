# Bouwomgeving en tekstcodering

## Vastgelegde, daadwerkelijk gebruikte omgeving

De gerepareerde levering is gebouwd met **CPython 3.13.5 op Linux**, WeasyPrint **68.0**, PyMuPDF **1.26.7**, markdown-it-py **4.2.0**, BeautifulSoup **4.14.3**, CairoSVG **2.8.2** en Pillow **12.3.0**. `requirements.txt` bewaart de hoofdpakketten; `requirements-render-lock.txt` fixeert ook de hier aanwezige rendererafhankelijkheden. Installeer niet ongemerkt de nieuwste WeasyPrint in plaats van de vastgelegde versie.

`checks/render-environment.json` bevat interpreter-, bibliotheek-, fontmatch- en fonthashgegevens. De gebruikte families zijn **Lato 2.015**, **DejaVu Sans 2.37** en **DejaVu Sans Mono 2.37**, met de benodigde reguliere/vette/cursieve/zware varianten. Er zijn **geen fontbestanden** in de levering opgenomen. De systeemfonts moeten lokaal beschikbaar zijn; een fallback is geen bewezen pixelgelijke reproductie.

Leg de eigen omgeving vast met:

```text
python build/environment_report.py --output local-render-environment.json
python -m weasyprint --info
```

Het eerste bestand beschrijft de eigen machine. De referentie onder `checks/` beschrijft deze levering. Afwezigheid van `pkg-config`-metadata betekent niet dat Pango/Cairo ontbreekt: de vastgelegde runtimeversies en de geslaagde render zijn hiervoor de relevante gegevens.

## Tekst-I/O

De actuele bouw-, export-, register- en verificatiescripts openen tekst expliciet als UTF-8; tekstschrijfacties gebruiken waar relevant expliciete LF-regels. Ze vertrouwen niet op de Windows-codepage. De CSV-schrijfwijze houdt expliciet rekening met `newline`.

`PYTHONUTF8=1` blijft een nuttige extra instelling voor Python en subprocessen, maar is **niet** meer de enige reparatie voor R4. De regressietests en recordexport zijn daarnaast gecontroleerd met een niet-UTF-8-standaardlocale en uitgeschakelde Python-UTF8-modus. Dat is een encodingtest op Linux, geen Windows-buildclaim.

## Windows / PowerShell

De meegeleverde PDFs kunnen zonder herbouw worden geïmporteerd. Voor lokaal aanpassen of de controleherbouw:

1. Gebruik een afzonderlijke virtuele omgeving, bij voorkeur Python 3.13.x overeenkomstig deze levering.
2. Zorg dat de Pythonbibliotheek van WeasyPrint **en** Pango met zijn native afhankelijkheden werken. Alleen een los WeasyPrint-executable installeert niet automatisch de door deze scripts geïmporteerde Pythonbibliotheek.
3. Installeer Lato en de DejaVu Sans-/Sans Mono-varianten. Controleer of dezelfde fonts ook voor het bouwproces beschikbaar zijn.
4. Installeer de gepinde Pythonpakketten en voer de controles uit.

Voorbeeld in PowerShell, vanuit de pakketroot, na de native installatie:

```powershell
py -3.13 -m venv .venv
$py = Join-Path $PWD '.venv\Scripts\python.exe'
$env:PYTHONUTF8 = '1'
& $py -m pip install -r requirements-render-lock.txt
& $py -m weasyprint --info
& $py -m unittest discover -s tests -v
& $py build/build_all.py
```

WeasyPrint 68.0 documenteert voor de Pythonbibliotheek op Windows de MSYS2-installatie van Pango. Als DLLs niet gevonden worden, controleer de werkelijke DLL-map; bij een standaardinstallatie kan bijvoorbeeld `$env:WEASYPRINT_DLL_DIRECTORIES = 'C:\msys64\mingw64\bin'` nodig zijn. CairoSVG gebruikt bovendien Cairo; controleer ook `python -c "import cairosvg"`. Volg de officiële installatie-aanwijzingen voor ontbrekende native bibliotheken, niet een willekeurige downgrade van de renderer. Gebruik geen admin-bypass of uitgeschakelde beveiliging om dit op te lossen.

Een Linuxomgeving onder WSL is een gedocumenteerd alternatief. Installeer daar dezelfde gepinde Pythonpakketten, Pango/Cairo en fonts. Ook WSL geeft zonder overeenkomende native bibliotheken en fonts geen automatische pixelgarantie.

## Herbouw vergelijken

Verifieer eerst de ongewijzigde ontvangst met `python verify_manifest.py`. Kopieer daarna het pakket naar een afzonderlijke map en bouw die kopie. Vergelijk de twee complete sets vanuit de ontvangen pakketroot:

```text
python build/compare_rebuild.py PAD_NAAR_SCHONE_HERBOUW
```

PDF-binaire metadata mag door generatie verschillen. De meegeleverde vergelijking controleert tekst, paginatallen en elke gerenderde pagina in **dezelfde** software-/fontomgeving. Een andere omgeving kan raster-/fontverschillen geven. Rapporteer die eerlijk en inspecteer de gewijzigde pagina's; verlaag de inhouds- of overflowcontroles niet en presenteer een tekstmatch niet als een pixelmatch.

**Er is in deze herstelronde geen native Windows-build uitgevoerd.** De lokale coding agent voert zijn platform-/repositorychecks uit en legt zijn omgeving vast. Een geslaagde import is evenmin een bewijs dat de vijf bekende lestijdproblemen zijn opgelost.

## Primaire documentatie, geraadpleegd 16 september 2026

- WeasyPrint 68.0, installatie, Windows/WSL, DLLs en fonts: https://doc.courtbouillon.org/weasyprint/v68.0/first_steps.html
- Python 3.13, expliciete codering en UTF-8-modus: https://docs.python.org/3.13/library/io.html
- CairoSVG, installatie en rasteruitvoer: https://cairosvg.org/documentation/
