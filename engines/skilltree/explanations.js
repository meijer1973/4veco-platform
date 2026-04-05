/**
 * SkillTree Explanations — Detailed per-skill explanations for students.
 * UMD module: sets window.SKILL_TREE_EXPLANATIONS in browser, module.exports in Node.js.
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.SKILL_TREE_EXPLANATIONS = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    return {

/* ══════════════════════════════════════════════════════════════
 *  LAAG 0 — FUNDAMENT
 * ══════════════════════════════════════════════════════════════ */

F1: {
    title: 'Lineaire functie opstellen',
    sections: [
        { type: 'uitleg', content: 'Een lineaire functie is een rechte lijn die je schrijft als y = ax + b. In de economie gebruiken we vaak P en Q in plaats van y en x. De letter a is de richtingscoëfficiënt (hoe steil de lijn loopt) en b is het snijpunt met de verticale as. Als je twee punten kent, kun je a berekenen met: a = (y₂ − y₁) / (x₂ − x₁). Daarna vul je één punt in om b te vinden.' },
        { type: 'formule', content: 'y = a × x + b\n\na = (y₂ − y₁) / (x₂ − x₁)\n\nVul daarna één punt in om b te berekenen.' },
        { type: 'voorbeeld', title: 'Vraagfunctie opstellen uit twee punten', content: 'Gegeven: bij P = 10 is Qv = 80, en bij P = 20 is Qv = 60.\n\nStap 1: a = (60 − 80) / (20 − 10) = −20 / 10 = −2\nStap 2: Qv = −2P + b → vul punt in: 80 = −2 × 10 + b → 80 = −20 + b → b = 100\n\nDe vraagfunctie is: Qv = −2P + 100' },
        { type: 'tip', content: 'Een vraagfunctie heeft altijd een negatieve richtingscoëfficiënt (hogere prijs → minder vraag). Een aanbodfunctie heeft altijd een positieve (hogere prijs → meer aanbod). Controleer dit altijd als check!' },
        { type: 'valkuil', content: 'Let op de volgorde: als je Qv als functie van P opstelt, dan is P de x en Q de y. Draai je de punten om in de breuk (P₂ − P₁ boven in plaats van onder), dan krijg je de verkeerde richtingscoëfficiënt.' },
        { type: 'check', content: 'Kun je uit twee prijs-hoeveelheidcombinaties zelf een lineaire vraag- of aanbodfunctie opstellen?' }
    ]
},
F2: {
    title: 'Vergelijking oplossen',
    sections: [
        { type: 'uitleg', content: 'Bij het oplossen van een vergelijking zoek je de waarde van de onbekende (vaak P of Q) waarvoor de vergelijking klopt. De basisregel is: wat je links doet, doe je ook rechts. Je werkt stap voor stap de onbekende vrij door optellen, aftrekken, vermenigvuldigen of delen. Houd je werk netjes — schrijf elke stap onder de vorige.' },
        { type: 'formule', content: 'Werkwijze:\n1. Breng alle termen met de onbekende naar één kant\n2. Breng alle getallen naar de andere kant\n3. Deel door het getal vóór de onbekende' },
        { type: 'voorbeeld', title: 'Los op: 100 − 2P = 20 + 3P', content: 'Stap 1: Breng P-termen naar rechts → 100 = 20 + 3P + 2P\nStap 2: Vereenvoudig → 100 = 20 + 5P\nStap 3: Trek 20 af → 80 = 5P\nStap 4: Deel door 5 → P = 16' },
        { type: 'tip', content: 'Controleer je antwoord! Vul P = 16 terug in beide kanten: links 100 − 2×16 = 68, rechts 20 + 3×16 = 68. Klopt!' },
        { type: 'valkuil', content: 'Als je een term naar de andere kant verplaatst, vergeet dan niet het teken om te draaien. −2P naar de andere kant wordt +2P, niet −2P.' },
        { type: 'check', content: 'Kun je een vergelijking met één onbekende stap voor stap oplossen en je antwoord controleren?' }
    ]
},
F3: {
    title: 'Functie omschrijven (P↔Q)',
    sections: [
        { type: 'uitleg', content: 'Soms heb je Qv als functie van P (bijv. Qv = 100 − 2P), maar heb je P als functie van Q nodig — of andersom. Dit heet omschrijven. Je lost eigenlijk de vergelijking op naar de andere variabele. Dit is handig als je bijvoorbeeld de prijs wilt berekenen bij een gegeven hoeveelheid, of als je de TO-functie wilt opstellen.' },
        { type: 'formule', content: 'Van Q = aP + b naar P:\n1. Trek b af: Q − b = aP\n2. Deel door a: P = (Q − b) / a' },
        { type: 'voorbeeld', title: 'Schrijf Qv = 100 − 2P om naar P', content: 'Qv = 100 − 2P\nStap 1: 2P = 100 − Qv\nStap 2: P = (100 − Qv) / 2\nStap 3: P = 50 − 0,5Qv\n\nCheck: als Qv = 60, dan P = 50 − 0,5 × 60 = 50 − 30 = 20.\nOrigineel: Qv = 100 − 2 × 20 = 60. ✓' },
        { type: 'tip', content: 'Na het omschrijven kun je altijd checken door een getal in te vullen in beide versies. Je moet hetzelfde antwoord krijgen.' },
        { type: 'valkuil', content: 'Bij Qv = 100 − 2P is het verleidelijk om te delen door 2 en dan te schrijven P = 50 − Qv. Maar je vergeet dan de 0,5 vóór Qv. Elke term moet door 2 gedeeld worden!' },
        { type: 'check', content: 'Kun je een vraagfunctie omschrijven van Q als functie van P naar P als functie van Q?' }
    ]
},
F4: {
    title: 'Substitueren',
    sections: [
        { type: 'uitleg', content: 'Substitueren betekent: een waarde invullen in een formule en het resultaat uitrekenen. Dit is een basisvaardigheid die je overal in de economie nodig hebt. Let goed op de volgorde van bewerkingen: eerst machtsverheffen, dan vermenigvuldigen/delen, dan optellen/aftrekken. Schrijf tussenresultaten op om fouten te voorkomen.' },
        { type: 'formule', content: 'Volgorde van bewerkingen: Haakjes → Machten → ×/÷ → +/−\n\nVul de gegeven waarde in overal waar de variabele staat.' },
        { type: 'voorbeeld', title: 'Bereken TK als Q = 5', content: 'Gegeven: TK = 200 + 8Q + 0,5Q²\n\nVul Q = 5 in:\nTK = 200 + 8 × 5 + 0,5 × 5²\nTK = 200 + 40 + 0,5 × 25\nTK = 200 + 40 + 12,50\nTK = 252,50' },
        { type: 'tip', content: 'Schrijf na het invullen eerst de hele berekening uit voordat je gaat rekenen. Zo zie je precies wat je moet doen en maak je minder fouten.' },
        { type: 'valkuil', content: 'Bij 0,5Q² moet je eerst Q kwadrateren en dan pas vermenigvuldigen met 0,5. Dus 0,5 × 5² = 0,5 × 25 = 12,50. Niet: (0,5 × 5)² = 2,5² = 6,25!' },
        { type: 'check', content: 'Kun je een waarde correct invullen in een formule met meerdere termen en het resultaat uitrekenen?' }
    ]
},
F7: {
    title: 'Snijpunt met P-as berekenen',
    sections: [
        { type: 'uitleg', content: 'Het snijpunt met de P-as (de verticale as in een V/A-diagram) vind je door Q = 0 in te vullen. Dit punt geeft de maximale prijs aan die consumenten willen betalen (bij een vraagcurve) of de minimale prijs waarvoor producenten willen aanbieden (bij een aanbodcurve). Je hebt hiervoor de functie in de vorm P = ... nodig.' },
        { type: 'formule', content: 'Snijpunt P-as: vul Q = 0 in de functie P = f(Q)\n\nAls je Qv = 100 − 2P hebt, schrijf eerst om naar P = 50 − 0,5Q.' },
        { type: 'voorbeeld', title: 'Snijpunt P-as bij Qv = 100 − 2P', content: 'Stap 1: Schrijf om naar P = 50 − 0,5Q\nStap 2: Vul Q = 0 in → P = 50 − 0,5 × 0 = 50\n\nHet snijpunt met de P-as is (Q, P) = (0, 50).\nDit betekent: bij een prijs van €50 is de gevraagde hoeveelheid nul.' },
        { type: 'tip', content: 'Het snijpunt met de P-as is altijd het getal dat overblijft als Q wegvalt. Bij P = 50 − 0,5Q is dat gewoon 50. Je hoeft eigenlijk alleen Q = 0 te "denken".' },
        { type: 'valkuil', content: 'Verwar het snijpunt met de P-as niet met het snijpunt met de Q-as. Voor de P-as vul je Q = 0 in; voor de Q-as vul je P = 0 in. In een V/A-diagram staat P verticaal!' },
        { type: 'check', content: 'Kun je het snijpunt met de P-as berekenen als je een vraag- of aanbodfunctie hebt?' }
    ]
},

/* ══════════════════════════════════════════════════════════════
 *  LAAG 1 — BOUWSTENEN
 * ══════════════════════════════════════════════════════════════ */

B1: {
    title: 'Evenwichtsprijs & -hoeveelheid',
    sections: [
        { type: 'uitleg', content: 'Het marktevenwicht is het punt waar de gevraagde hoeveelheid precies gelijk is aan de aangeboden hoeveelheid. Om dit te berekenen stel je de vraagfunctie gelijk aan de aanbodfunctie en los je op naar P. De prijs die je vindt is de evenwichtsprijs. Daarna vul je die prijs in om de evenwichtshoeveelheid te berekenen.' },
        { type: 'formule', content: 'In evenwicht: Qv = Qa\n\n1. Stel de twee functies aan elkaar gelijk\n2. Los op naar P → evenwichtsprijs (P*)\n3. Vul P* in een van de functies → evenwichtshoeveelheid (Q*)' },
        { type: 'voorbeeld', title: 'Bereken het marktevenwicht', content: 'Gegeven: Qv = 100 − 2P en Qa = 20 + 3P\n\nStap 1: 100 − 2P = 20 + 3P\nStap 2: 80 = 5P → P* = 16\nStap 3: Qv = 100 − 2 × 16 = 68\n\nControle: Qa = 20 + 3 × 16 = 68 ✓\n\nEvenwicht: P* = 16, Q* = 68' },
        { type: 'tip', content: 'Vul de evenwichtsprijs altijd in BEIDE functies in als controle. Je moet dezelfde Q krijgen. Zo weet je zeker dat je geen rekenfout hebt gemaakt.' },
        { type: 'valkuil', content: 'Vergeet niet de evenwichtshoeveelheid te berekenen! Veel leerlingen stoppen na het vinden van P* en vergeten Q* nog in te vullen. De opgave vraagt bijna altijd naar beide.' },
        { type: 'check', content: 'Kun je uit een vraag- en aanbodfunctie de evenwichtsprijs en evenwichtshoeveelheid berekenen?' }
    ]
},
B2: {
    title: 'TO-functie opstellen',
    sections: [
        { type: 'uitleg', content: 'De totale opbrengst (TO) is het bedrag dat een bedrijf ontvangt uit de verkoop van producten. Je berekent TO door de prijs te vermenigvuldigen met de hoeveelheid. Als je de prijs als functie van Q hebt, kun je TO als functie van Q schrijven. Bij volkomen concurrentie is de prijs constant, dus is TO een lineaire functie. Bij andere marktvormen is TO vaak een kwadratische functie.' },
        { type: 'formule', content: 'TO = P × Q\n\nAls P een functie van Q is (bijv. P = 50 − 0,5Q):\nTO = (50 − 0,5Q) × Q = 50Q − 0,5Q²' },
        { type: 'voorbeeld', title: 'TO-functie bij een monopolist', content: 'Gegeven: P = 80 − 2Q\n\nTO = P × Q\nTO = (80 − 2Q) × Q\nTO = 80Q − 2Q²\n\nBij Q = 10: TO = 80 × 10 − 2 × 100 = 800 − 200 = 600' },
        { type: 'tip', content: 'Bij volkomen concurrentie is P een vast getal (bijv. P = 12), dus TO = 12Q — een rechte lijn. Bij een monopolie is P een functie van Q, dus TO wordt een berg (parabool).' },
        { type: 'valkuil', content: 'Vergeet niet de haakjes als je P × Q uitrekent! Bij P = 80 − 2Q moet je (80 − 2Q) × Q doen, niet 80 − 2Q × Q. Zonder haakjes vergeet je 80 te vermenigvuldigen met Q.' },
        { type: 'check', content: 'Kun je een TO-functie opstellen als je de prijsfunctie kent, zowel bij volkomen concurrentie als bij een monopolie?' }
    ]
},
B3: {
    title: 'TK-functie herkennen',
    sections: [
        { type: 'uitleg', content: 'De totale kosten (TK) bestaan uit vaste kosten (TCK) en variabele kosten (TVK). Vaste kosten zijn onafhankelijk van de productie (bijv. huur), variabele kosten stijgen met de hoeveelheid (bijv. grondstoffen). In een TK-functie zijn de vaste kosten het getal zonder Q, en de variabele kosten de termen mét Q. Soms is TK lineair (TK = 200 + 8Q), soms kwadratisch (TK = 200 + 8Q + 0,5Q²).' },
        { type: 'formule', content: 'TK = TCK + TVK\nTK = vaste kosten + variabele kosten per stuk × Q\n\nBij kwadratische TK:\nTK = TCK + vQ + cQ²' },
        { type: 'voorbeeld', title: 'Herken de kostenonderdelen', content: 'Gegeven: TK = 500 + 12Q + 0,3Q²\n\nTCK (vast) = 500 → dit betaal je ook als Q = 0\nTVK (variabel) = 12Q + 0,3Q²\n\nBij Q = 0: TK = 500 (alleen vaste kosten)\nBij Q = 10: TK = 500 + 120 + 30 = 650' },
        { type: 'tip', content: 'Het getal dat "los" staat (zonder Q erachter) is altijd de vaste kosten. Alles met een Q erin is variabel. Bij Q = 0 blijven alleen de vaste kosten over — een handige check.' },
        { type: 'valkuil', content: 'Bij TK = 12Q + 0,3Q² denken leerlingen soms dat er geen vaste kosten zijn. Dat klopt! TCK = 0. Niet elk bedrijf heeft vaste kosten in de opgave — check dit door Q = 0 in te vullen.' },
        { type: 'check', content: 'Kun je in een TK-functie de vaste en variabele kosten aanwijzen en de totale kosten bij een bepaalde Q berekenen?' }
    ]
},
B4: {
    title: 'Collectief aanbod',
    sections: [
        { type: 'uitleg', content: 'Het collectieve (markt)aanbod is de som van alle individuele aanbodfuncties. Als alle aanbieders identiek zijn, vermenigvuldig je de individuele aanbodfunctie met het aantal aanbieders. Let op: je telt de hoeveelheden op bij dezelfde prijs, dus je moet Q als functie van P hebben. Als je functies in de vorm P = ... hebt, schrijf dan eerst om naar Q = ... voordat je optelt.' },
        { type: 'formule', content: 'Bij n identieke aanbieders:\nQa,collectief = n × Qa,individueel\n\nBij verschillende aanbieders:\nQa,collectief = Qa1 + Qa2 + Qa3 + ...' },
        { type: 'voorbeeld', title: '50 identieke aanbieders', content: 'Individueel aanbod: qa = −5 + 2P\n\nCollectief aanbod: Qa = 50 × (−5 + 2P)\nQa = −250 + 100P\n\nCheck bij P = 10:\nIndividueel: qa = −5 + 20 = 15\nCollectief: Qa = −250 + 1000 = 750 = 50 × 15 ✓' },
        { type: 'tip', content: 'Onthoud: je telt hoeveelheden (Q) op, niet prijzen. Daarom moet je de functies in de vorm Q = ... hebben. Tel je per ongeluk de P-functies op, dan krijg je onzin.' },
        { type: 'valkuil', content: 'Als je Qa = 50 × (−5 + 2P) uitwerkt, vergeet dan niet BEIDE termen te vermenigvuldigen: 50 × −5 = −250 en 50 × 2P = 100P. Niet: −5 + 100P.' },
        { type: 'check', content: 'Kun je het collectieve aanbod berekenen als je de individuele aanbodfunctie en het aantal aanbieders kent?' }
    ]
},
F5: {
    title: 'Oppervlakte driehoek',
    sections: [
        { type: 'uitleg', content: 'In economische grafieken bereken je vaak de oppervlakte van een driehoek. Dit gebruik je bijvoorbeeld voor het consumentensurplus, producentensurplus of het welvaartsverlies. De driehoek wordt gevormd door snijpunten van lijnen met elkaar en met de assen. Je moet eerst de coördinaten van de hoekpunten bepalen voordat je kunt rekenen.' },
        { type: 'formule', content: 'Oppervlakte driehoek = ½ × basis × hoogte\n\nDe basis en hoogte staan altijd LOODRECHT op elkaar.' },
        { type: 'voorbeeld', title: 'Consumentensurplus berekenen', content: 'Gegeven: P* = 16, Q* = 68, snijpunt vraagcurve met P-as = 50\n\nDe driehoek van het consumentensurplus:\n• Basis = Q* = 68 (langs de horizontale as)\n• Hoogte = 50 − 16 = 34 (van P* tot snijpunt P-as)\n\nCS = ½ × 68 × 34 = 1.156' },
        { type: 'tip', content: 'Teken de driehoek altijd in de grafiek en markeer basis en hoogte. Zo zie je direct welke afstanden je moet berekenen. De basis en hoogte zijn altijd afstanden, dus altijd positief.' },
        { type: 'valkuil', content: 'Verwar de hoogte niet met de P-waarde zelf. De hoogte is het verschil tussen twee P-waarden (bijv. 50 − 16 = 34), niet de P-waarde zelf (50). Hetzelfde geldt voor de basis bij Q-waarden.' },
        { type: 'check', content: 'Kun je in een vraag-en-aanboddiagram de driehoek van het consumentensurplus of producentensurplus herkennen en de oppervlakte berekenen?' }
    ]
},
F6: {
    title: 'Afgeleide bepalen',
    sections: [
        { type: 'uitleg', content: 'De afgeleide van een functie geeft de helling aan: hoeveel verandert y als x met 1 toeneemt? In de economie gebruik je de afgeleide voor marginale grootheden: de marginale opbrengst (afgeleide van TO) en de marginale kosten (afgeleide van TK). De basisregel is: bij een term axⁿ wordt de afgeleide n × a × xⁿ⁻¹. Een constante (getal zonder x) verdwijnt.' },
        { type: 'formule', content: 'Afleidingsregels:\n• Constante c → 0\n• aQ → a\n• aQ² → 2aQ\n• aQ³ → 3aQ²\n\nKort: "exponent ervoor, exponent min 1"' },
        { type: 'voorbeeld', title: 'Afgeleide van TK = 200 + 8Q + 0,5Q²', content: 'TK = 200 + 8Q + 0,5Q²\n\nTerm voor term:\n• 200 → 0 (constante verdwijnt)\n• 8Q → 8 (de Q valt weg)\n• 0,5Q² → 2 × 0,5 × Q = 1Q = Q\n\nMK = dTK/dQ = 8 + Q' },
        { type: 'tip', content: 'Ezelsbruggetje: "Haal de macht naar voren en verlaag de macht met 1." Dus bij 3Q² wordt het 2 × 3 × Q¹ = 6Q. Bij 5Q wordt het 1 × 5 × Q⁰ = 5 (want Q⁰ = 1).' },
        { type: 'valkuil', content: 'Een veelgemaakte fout: de constante vergeten te schrappen. Bij TK = 200 + 8Q is de afgeleide 8, niet 200 + 8. De 200 verdwijnt omdat vaste kosten niet veranderen als Q verandert.' },
        { type: 'check', content: 'Kun je de afgeleide bepalen van een functie met constanten, lineaire termen en kwadratische termen?' }
    ]
},
B8: {
    title: 'Prijselasticiteit van de vraag',
    sections: [
        { type: 'uitleg', content: 'De prijselasticiteit van de vraag (Ev) meet hoe sterk de gevraagde hoeveelheid reageert op een prijsverandering. Een Ev van −2 betekent: als de prijs met 1% stijgt, daalt de vraag met 2%. De Ev is altijd negatief (hogere prijs → minder vraag). Als |Ev| > 1 is de vraag elastisch (gevoelig voor prijs), als |Ev| < 1 is de vraag inelastisch (weinig gevoelig).' },
        { type: 'formule', content: 'Ev = %ΔQv / %ΔP\n\nDaarbij:\n%ΔQv = (ΔQv / Qv) × 100%\n%ΔP = (ΔP / P) × 100%\n\nOf direct: Ev = (ΔQv / ΔP) × (P / Qv)' },
        { type: 'voorbeeld', title: 'Prijselasticiteit berekenen', content: 'De prijs stijgt van €20 naar €22, de vraag daalt van 80 naar 72.\n\n%ΔP = (2/20) × 100% = 10%\n%ΔQv = (−8/80) × 100% = −10%\n\nEv = −10% / 10% = −1\n\nDe vraag is unitair elastisch: de procentuele daling van Q is precies gelijk aan de procentuele stijging van P.' },
        { type: 'tip', content: 'Gebruik de oorspronkelijke waarden (vóór de verandering) als deler bij het berekenen van de procentuele verandering. ΔQ deel je door de oude Q, ΔP door de oude P.' },
        { type: 'valkuil', content: 'Vergeet het minteken niet! De vraag DAALT als de prijs stijgt, dus ΔQv is negatief. De Ev is daarom altijd negatief. Als je een positief getal uitkomt, heb je waarschijnlijk het teken van ΔQ vergeten.' },
        { type: 'check', content: 'Kun je de prijselasticiteit berekenen en bepalen of de vraag elastisch of inelastisch is?' }
    ]
},
B9: {
    title: 'Kruiselasticiteit',
    sections: [
        { type: 'uitleg', content: 'De kruiselasticiteit (Ekr) meet hoe de vraag naar product A reageert op een prijsverandering van product B. Een positieve Ekr betekent dat de producten substituten zijn (de prijs van B stijgt → meer vraag naar A, bijv. boter en margarine). Een negatieve Ekr betekent dat het complementaire goederen zijn (prijs van B stijgt → minder vraag naar A, bijv. printers en inkt).' },
        { type: 'formule', content: 'Ekr = %ΔQa / %ΔPb\n\nDaarbij:\n%ΔQa = procentuele verandering van de vraag naar product A\n%ΔPb = procentuele verandering van de prijs van product B' },
        { type: 'voorbeeld', title: 'Kruiselasticiteit van Cola en Pepsi', content: 'De prijs van Pepsi stijgt met 10%. De vraag naar Cola stijgt met 8%.\n\nEkr = %ΔQ(Cola) / %ΔP(Pepsi) = +8% / +10% = +0,8\n\nEkr > 0 → Cola en Pepsi zijn substituten (vervangproducten).\nDat klopt: als Pepsi duurder wordt, kopen mensen meer Cola.' },
        { type: 'tip', content: 'Positief = substituten (vervangen elkaar). Negatief = complementen (horen bij elkaar). Rond nul = geen verband. Onthoud: bij substituten gaan de veranderingen dezelfde kant op (+/+ of −/−), dus de uitkomst is positief.' },
        { type: 'valkuil', content: 'Let goed op welk product de Q is en welk product de P. Bij kruiselasticiteit gaat de Q over het ENE product en de P over het ANDERE. Wissel je ze om, dan meet je iets heel anders.' },
        { type: 'check', content: 'Kun je de kruiselasticiteit berekenen en aan de hand van het teken bepalen of producten substituten of complementen zijn?' }
    ]
},
B10: {
    title: 'Inkomenselasticiteit',
    sections: [
        { type: 'uitleg', content: 'De inkomenselasticiteit (Ei) meet hoe de vraag naar een product reageert op een verandering van het inkomen. Een positieve Ei betekent een normaal goed (meer inkomen → meer vraag). Een negatieve Ei betekent een inferieur goed (meer inkomen → minder vraag, bijv. budgetmerken). Een Ei groter dan 1 duidt op een luxegoed (de vraag stijgt sneller dan het inkomen).' },
        { type: 'formule', content: 'Ei = %ΔQ / %ΔY\n\nDaarbij:\n%ΔQ = procentuele verandering van de gevraagde hoeveelheid\n%ΔY = procentuele verandering van het inkomen (Y = yield/income)' },
        { type: 'voorbeeld', title: 'Inkomenselasticiteit van restaurantbezoek', content: 'Het inkomen stijgt met 5%. Het aantal restaurantbezoeken stijgt met 15%.\n\nEi = %ΔQ / %ΔY = +15% / +5% = +3,0\n\nEi > 1 → restaurantbezoek is een luxegoed.\nDe vraag stijgt 3× zo snel als het inkomen.' },
        { type: 'tip', content: 'Drie categorieën: Ei < 0 = inferieur goed, 0 < Ei < 1 = noodzakelijk goed, Ei > 1 = luxegoed. Denk: brood (noodzakelijk, Ei laag) vs. vakanties (luxe, Ei hoog) vs. budgetnoedels (inferieur, Ei negatief).' },
        { type: 'valkuil', content: 'Verwar inkomenselasticiteit niet met prijselasticiteit! Bij Ei gaat het om de verandering van het INKOMEN, niet de prijs. De formule lijkt sterk op Ev, maar de noemer is anders (%ΔY in plaats van %ΔP).' },
        { type: 'check', content: 'Kun je de inkomenselasticiteit berekenen en bepalen of een goed normaal, inferieur of luxe is?' }
    ]
},
B11: {
    title: 'Comparatief voordeel bepalen',
    sections: [
        { type: 'uitleg', content: 'Comparatief voordeel betekent dat een land (of persoon) iets kan produceren tegen lagere alternatieve kosten dan een ander land. Zelfs als een land overal slechter in is, kan het toch voordelig zijn om te specialiseren in het product waar het relatief het minst slecht in is. Je vergelijkt niet de absolute productie, maar de alternatieve kosten: hoeveel van het ene product moet je opgeven om meer van het andere te maken?' },
        { type: 'formule', content: 'Alternatieve kosten van product X = hoeveelheid Y die je opgeeft / hoeveelheid X die je erbij krijgt\n\nHet land met de LAAGSTE alternatieve kosten voor een product heeft het comparatief voordeel in dat product.' },
        { type: 'voorbeeld', title: 'Nederland vs. België', content: 'Per werkdag kan:\n• Nederland: 10 kazen OF 5 fietsen maken\n• België: 6 kazen OF 4 fietsen maken\n\nAlternatieve kosten kaas:\n• NL: 1 kaas kost 5/10 = 0,5 fiets\n• BE: 1 kaas kost 4/6 = 0,67 fiets\n→ NL heeft comparatief voordeel in kaas (lagere alt. kosten)\n\nAlternatieve kosten fiets:\n• NL: 1 fiets kost 10/5 = 2 kazen\n• BE: 1 fiets kost 6/4 = 1,5 kazen\n→ BE heeft comparatief voordeel in fietsen (lagere alt. kosten)' },
        { type: 'tip', content: 'De alternatieve kosten zijn altijd elkaars omgekeerde. Als 1 kaas = 0,5 fiets, dan is 1 fiets = 1/0,5 = 2 kazen. Je hoeft dus maar één berekening per land te doen!' },
        { type: 'valkuil', content: 'Verwar absoluut en comparatief voordeel niet! Nederland maakt meer van ALLES (absoluut voordeel). Maar België heeft comparatief voordeel in fietsen omdat het daar relatief het minst slecht in is. Handel is gebaseerd op comparatief voordeel.' },
        { type: 'check', content: 'Kun je van twee landen de alternatieve kosten berekenen en bepalen wie het comparatief voordeel heeft in welk product?' }
    ]
},

/* ══════════════════════════════════════════════════════════════
 *  LAAG 2 — MARGINALE GROOTHEDEN
 * ══════════════════════════════════════════════════════════════ */

B5: {
    title: 'MO bepalen',
    sections: [
        { type: 'uitleg', content: 'De marginale opbrengst (MO) geeft aan hoeveel de totale opbrengst verandert als je één product meer verkoopt. Je berekent MO door de afgeleide te nemen van de TO-functie. Bij volkomen concurrentie is MO gelijk aan de marktprijs (een constant getal). Bij een monopolie daalt de MO als Q stijgt, omdat de monopolist de prijs moet verlagen om meer te verkopen.' },
        { type: 'formule', content: 'MO = dTO/dQ (de afgeleide van TO naar Q)\n\nBij volkomen concurrentie (TO = P × Q): MO = P\nBij monopolie (TO = aQ + bQ²): MO = a + 2bQ' },
        { type: 'voorbeeld', title: 'MO bij een monopolist', content: 'Gegeven: P = 80 − 2Q, dus TO = 80Q − 2Q²\n\nMO = dTO/dQ\n• 80Q → 80\n• −2Q² → −4Q\n\nMO = 80 − 4Q\n\nBij Q = 10: MO = 80 − 40 = 40\nDit betekent: het 11e product levert ongeveer €40 extra op.' },
        { type: 'tip', content: 'Bij een monopolie heeft de MO-lijn altijd dezelfde snijpunt met de P-as als de vraaglijn, maar een dubbele helling. Als P = 80 − 2Q, dan MO = 80 − 4Q. Het snijpunt (80) is hetzelfde, de helling (−4) is twee keer zo steil.' },
        { type: 'valkuil', content: 'MO is niet hetzelfde als de prijs! Bij een monopolie is MO < P (behalve bij Q = 0). Dit komt doordat de monopolist de prijs op álle producten moet verlagen om er één extra te verkopen.' },
        { type: 'check', content: 'Kun je de MO-functie afleiden uit de TO-functie en het verschil uitleggen tussen MO bij volkomen concurrentie en bij een monopolie?' }
    ]
},
B6: {
    title: 'MK bepalen',
    sections: [
        { type: 'uitleg', content: 'De marginale kosten (MK) geven aan hoeveel de totale kosten stijgen als je één product meer maakt. Je berekent MK door de afgeleide te nemen van de TK-functie. De vaste kosten verdwijnen bij het afleiden (die veranderen niet met Q). Bij een lineaire TK-functie zijn de MK constant. Bij een kwadratische TK-functie stijgen de MK met Q.' },
        { type: 'formule', content: 'MK = dTK/dQ (de afgeleide van TK naar Q)\n\nBij TK = TCK + vQ: MK = v (constant)\nBij TK = TCK + vQ + cQ²: MK = v + 2cQ (stijgend)' },
        { type: 'voorbeeld', title: 'MK bij kwadratische TK', content: 'Gegeven: TK = 500 + 12Q + 0,3Q²\n\nMK = dTK/dQ\n• 500 → 0\n• 12Q → 12\n• 0,3Q² → 0,6Q\n\nMK = 12 + 0,6Q\n\nBij Q = 20: MK = 12 + 0,6 × 20 = 12 + 12 = 24\nHet 21e product kost ongeveer €24 extra om te maken.' },
        { type: 'tip', content: 'De MK-functie begint op de verticale as bij de variabele kosten per stuk (het getal vóór Q in de TK-functie). De vaste kosten zijn volledig verdwenen — die doen er niet toe voor de beslissing "produceer ik er nog eentje?".' },
        { type: 'valkuil', content: 'Verwar MK niet met GTK (gemiddelde totale kosten). MK gaat over de kosten van het VOLGENDE product, GTK over de gemiddelde kosten van ALLE producten. MK = afgeleide, GTK = delen.' },
        { type: 'check', content: 'Kun je de MK-functie afleiden uit een TK-functie en uitleggen waarom de vaste kosten verdwijnen?' }
    ]
},
B7: {
    title: 'GTK bepalen',
    sections: [
        { type: 'uitleg', content: 'De gemiddelde totale kosten (GTK) zijn de totale kosten gedeeld door de hoeveelheid. GTK geeft aan hoeveel elk product gemiddeld kost. De GTK-curve heeft vaak een U-vorm: eerst dalen de GTK (omdat de vaste kosten over meer producten worden verdeeld), daarna stijgen ze weer (door toenemende variabele kosten). Het laagste punt van de GTK is het break-evenpunt bij prijsbeleid.' },
        { type: 'formule', content: 'GTK = TK / Q\n\nBij TK = TCK + vQ + cQ²:\nGTK = TCK/Q + v + cQ' },
        { type: 'voorbeeld', title: 'GTK berekenen', content: 'Gegeven: TK = 500 + 12Q + 0,3Q²\n\nGTK = TK / Q\nGTK = 500/Q + 12 + 0,3Q\n\nBij Q = 10: GTK = 500/10 + 12 + 0,3 × 10 = 50 + 12 + 3 = 65\nBij Q = 50: GTK = 500/50 + 12 + 0,3 × 50 = 10 + 12 + 15 = 37' },
        { type: 'tip', content: 'Het eerste deel (TCK/Q) daalt als Q stijgt — dat is het "schaalvoordeel". Het laatste deel (cQ) stijgt als Q stijgt. Samen vormen ze de U-vorm. Het optimale punt zit waar de daling en stijging in balans zijn.' },
        { type: 'valkuil', content: 'Deel ELKE term apart door Q! Bij TK = 500 + 12Q + 0,3Q²: het wordt 500/Q + 12 + 0,3Q. Niet: (500 + 12Q + 0,3Q²) als geheel delen waarbij je vergeet de Q² te vereenvoudigen tot Q.' },
        { type: 'check', content: 'Kun je de GTK berekenen bij een gegeven Q, en uitleggen waarom de GTK-curve een U-vorm heeft?' }
    ]
},

/* ══════════════════════════════════════════════════════════════
 *  LAAG 3 — SAMENGESTELD
 * ══════════════════════════════════════════════════════════════ */

S1: {
    title: 'Surplus berekenen (CS/PS)',
    sections: [
        { type: 'uitleg', content: 'Het consumentensurplus (CS) is het verschil tussen wat consumenten bereid zijn te betalen en wat ze daadwerkelijk betalen. Het producentensurplus (PS) is het verschil tussen de marktprijs en de minimale prijs waartegen producenten willen aanbieden. Beide surplussen kun je aflezen als driehoeken in de vraag-/aanbodgrafiek.\n\nStap 1: Bereken het marktevenwicht (P* en Q*) door Qv = Qa te stellen.\nStap 2: Bepaal het snijpunt van de vraaglijn (voor CS) of aanbodlijn (voor PS) met de P-as door Q = 0 in te vullen.\nStap 3: Bereken de oppervlakte van de driehoek met de formule ½ × basis × hoogte.' },
        { type: 'formule', content: 'CS = ½ × Q* × (Pmax − P*)\nPS = ½ × Q* × (P* − Pmin)\n\nWaarbij Pmax = snijpunt vraaglijn met P-as en Pmin = snijpunt aanbodlijn met P-as.' },
        { type: 'voorbeeld', title: 'CS berekenen bij Qv = 80 − 2P en Qa = −10 + 3P', content: 'Stap 1: Evenwicht → 80 − 2P = −10 + 3P → 90 = 5P → P* = 18, Q* = 80 − 2×18 = 44.\nStap 2: Snijpunt vraaglijn met P-as → Q = 0 → 80 = 2P → Pmax = 40.\nStap 3: CS = ½ × 44 × (40 − 18) = ½ × 44 × 22 = 484.' },
        { type: 'tip', content: 'Teken altijd eerst de grafiek met P* en Pmax (of Pmin). De driehoek ligt dan letterlijk voor je neus. De basis van de driehoek is Q*, de hoogte is het prijsverschil.' },
        { type: 'valkuil', content: 'Vergeet niet om de vraaglijn om te schrijven naar P als functie van Q voordat je Pmax bepaalt. Als je Qv = 80 − 2P hebt, is Pmax niet 80, maar 80/2 = 40. Veel leerlingen vullen per ongeluk het verkeerde snijpunt in.' },
        { type: 'check', content: 'Kun je bij een gegeven vraag- en aanbodfunctie zowel het consumentensurplus als het producentensurplus berekenen als driehoeksoppervlakte?' }
    ]
},
S2: {
    title: 'MO = MK oplossen',
    sections: [
        { type: 'uitleg', content: 'Een bedrijf maximaliseert zijn winst bij de hoeveelheid waar de marginale opbrengst (MO) gelijk is aan de marginale kosten (MK). Zolang MO > MK levert elk extra product meer op dan het kost, dus loont het om meer te produceren. Zodra MO < MK kost een extra product meer dan het oplevert.\n\nStap 1: Stel de MO-functie op (afgeleide van TO) en de MK-functie (afgeleide van TK).\nStap 2: Stel MO = MK.\nStap 3: Los de vergelijking op naar Q.' },
        { type: 'formule', content: 'Winstmaximalisatie: MO = MK\n\nBij een lineaire vraagfunctie P = a − bQ:\nTO = P × Q = aQ − bQ²\nMO = a − 2bQ (let op: dubbele helling!)' },
        { type: 'voorbeeld', title: 'Winstmaximalisatie met MO = 60 − 4Q en MK = 10 + 2Q', content: 'Stap 1: MO en MK zijn al gegeven.\nStap 2: 60 − 4Q = 10 + 2Q\nStap 3: 50 = 6Q → Q* = 8,3 (afgerond).\n\nBij Q* = 8,3 is de winst maximaal.' },
        { type: 'tip', content: 'Bij een lineaire vraaglijn P = a − bQ is MO altijd a − 2bQ. De MO-lijn heeft dus dezelfde startwaarde maar een dubbele helling vergeleken met de vraaglijn. Dit hoef je niet elke keer opnieuw af te leiden.' },
        { type: 'valkuil', content: 'Verwar MO niet met de prijs! MO = MK geeft je de optimale hoeveelheid Q*. De bijbehorende prijs vind je door Q* in te vullen in de vraaglijn, niet in de MO-functie.' },
        { type: 'check', content: 'Kun je bij een gegeven vraagfunctie en kostenfunctie de winstmaximaliserende hoeveelheid vinden door MO = MK op te lossen?' }
    ]
},
S3: {
    title: 'Winst = TO − TK',
    sections: [
        { type: 'uitleg', content: 'De winst bereken je door de totale opbrengst (TO) min de totale kosten (TK). Dit lijkt eenvoudig, maar je moet eerst TO en TK correct berekenen bij de gegeven hoeveelheid. De TO-functie stel je op via TO = P × Q, en de TK-functie is meestal gegeven.\n\nStap 1: Bereken TO bij de gevraagde Q door Q in te vullen in de TO-functie.\nStap 2: Bereken TK bij dezelfde Q door Q in te vullen in de TK-functie.\nStap 3: Trek af: Winst = TO − TK. Een negatief antwoord betekent verlies.' },
        { type: 'formule', content: 'Winst (W) = TO − TK\nTO = P × Q\nTK = variabele kosten + constante kosten\n\nIs de uitkomst negatief? Dan maakt het bedrijf verlies.' },
        { type: 'voorbeeld', title: 'Winst bij TO = 50Q − 2Q² en TK = Q² + 8Q + 100, bij Q = 7', content: 'Stap 1: TO = 50×7 − 2×49 = 350 − 98 = 252.\nStap 2: TK = 49 + 56 + 100 = 205.\nStap 3: Winst = 252 − 205 = 47.' },
        { type: 'tip', content: 'Let goed op het verschil tussen Q en Q². Bij Q = 7 is Q² = 49. Schrijf de berekening stap voor stap uit, dan maak je minder rekenfouten.' },
        { type: 'valkuil', content: 'Vergeet de constante kosten niet! In TK = Q² + 8Q + 100 is dat getal 100 de vaste kosten. Als je die weglaat, bereken je de winst veel te hoog.' },
        { type: 'check', content: 'Kun je bij een gegeven TO-functie en TK-functie de winst berekenen bij een bepaalde hoeveelheid?' }
    ]
},
S4: {
    title: 'Break-even (TO = TK)',
    sections: [
        { type: 'uitleg', content: 'Bij het break-evenpunt is de winst precies nul: het bedrijf verdient exact genoeg om alle kosten te dekken. Je vindt dit punt door TO = TK te stellen en de vergelijking op te lossen. Vaak leidt dit tot een kwadratische vergelijking met twee oplossingen — twee break-evenpunten.\n\nStap 1: Stel TO = TK.\nStap 2: Herschrijf naar de standaardvorm aQ² + bQ + c = 0.\nStap 3: Los op met de abc-formule of ontbinden in factoren.\nStap 4: Tussen de twee break-evenpunten maakt het bedrijf winst.' },
        { type: 'formule', content: 'Break-even: TO = TK → Winst = 0\n\nabc-formule: Q = (−b ± √(b² − 4ac)) / 2a\n\nTussen Q₁ en Q₂ (de twee break-evenpunten) is er winst.' },
        { type: 'voorbeeld', title: 'Break-even bij TO = 40Q en TK = 2Q² + 6Q + 72', content: 'Stap 1: 40Q = 2Q² + 6Q + 72\nStap 2: 0 = 2Q² − 34Q + 72 → deel door 2: Q² − 17Q + 36 = 0\nStap 3: D = 289 − 144 = 145 → Q = (17 ± √145)/2 → Q₁ ≈ 2,5 en Q₂ ≈ 14,5.\nStap 4: Bij Q tussen 2,5 en 14,5 maakt het bedrijf winst.' },
        { type: 'tip', content: 'Controleer je antwoord: vul beide Q-waarden terug in TO en TK. Ze moeten gelijk zijn. Zijn ze dat niet? Dan heb je een rekenfout gemaakt.' },
        { type: 'valkuil', content: 'Bij het herschrijven naar de standaardvorm verplaats je alle termen naar één kant. Pas op met het minteken! Als je TO = 40Q naar rechts brengt, wordt de Q-term negatief: het teken draait om.' },
        { type: 'check', content: 'Kun je de break-evenhoeveelheden vinden en bepalen bij welke hoeveelheden er winst of verlies is?' }
    ]
},
S5: {
    title: 'Evenwicht met heffing',
    sections: [
        { type: 'uitleg', content: 'Wanneer de overheid een heffing (accijns) oplegt aan producenten, verschuift de aanbodcurve omhoog. De producent ontvangt niet meer P, maar P − heffing. Dit vul je in de aanbodfunctie in, waardoor een nieuwe aanbodfunctie ontstaat. Daarna los je het nieuwe evenwicht op.\n\nStap 1: Vervang P door (P − heffing) in de aanbodfunctie.\nStap 2: Werk de nieuwe aanbodfunctie uit.\nStap 3: Stel de nieuwe Qa gelijk aan Qv en los op naar P.\nStap 4: Bereken de nieuwe Q* door de nieuwe P* in te vullen.' },
        { type: 'formule', content: 'Heffing bij producent: vervang P door (P − t) in Qa\n\nQa_nieuw = Qa(P − t)\n\nDe consumentenprijs stijgt, de producentenprijs daalt.\nDe heffing wordt verdeeld over consumenten en producenten.' },
        { type: 'voorbeeld', title: 'Heffing van €4 bij Qv = 60 − 3P en Qa = −6 + 2P', content: 'Stap 1: Producent ontvangt P − 4 → Qa = −6 + 2(P − 4) = −6 + 2P − 8 = −14 + 2P.\nStap 2: Nieuwe Qa = −14 + 2P.\nStap 3: 60 − 3P = −14 + 2P → 74 = 5P → P* = 14,8.\nStap 4: Q* = 60 − 3×14,8 = 15,6.\n\nOude evenwicht was P = 13,2 — de prijs is met €1,60 gestegen (niet de volle €4).' },
        { type: 'tip', content: 'De heffing wordt nooit volledig doorberekend aan de consument. Hoe steiler de vraaglijn (inelastische vraag), hoe groter het deel dat de consument betaalt. Controleer: de prijsstijging voor de consument + prijsdaling voor de producent = heffing.' },
        { type: 'valkuil', content: 'Let op het teken! Bij een heffing ontvangt de producent MINDER: P − t. Bij een subsidie ontvangt hij MEER: P + s. Als je het teken omdraait, schuift de curve de verkeerde kant op.' },
        { type: 'check', content: 'Kun je na een heffing de nieuwe evenwichtsprijs en -hoeveelheid berekenen en uitleggen hoe de heffing verdeeld wordt?' }
    ]
},
S6: {
    title: 'Collectief aanbod bepalen',
    sections: [
        { type: 'uitleg', content: 'Het collectieve (markt)aanbod is de som van alle individuele aanbodcurves. Als bedrijven identiek zijn, vermenigvuldig je het individuele aanbod met het aantal bedrijven. Je moet de individuele aanbodfunctie dan wel eerst omschrijven naar Q als functie van P.\n\nStap 1: Schrijf de individuele aanbodfunctie om naar Qi als functie van P.\nStap 2: Bepaal de minimale prijs (bij welke P begint het bedrijf aan te bieden: Qi = 0).\nStap 3: Vermenigvuldig Qi met het aantal bedrijven: Qcollectief = n × Qi.' },
        { type: 'formule', content: 'Bij n identieke bedrijven:\nQcollectief = n × Qi(P)\n\nBij verschillende bedrijven:\nQcollectief = Q₁(P) + Q₂(P) + ...\n\nLet op: tel alleen bedrijven mee die bij die prijs daadwerkelijk aanbieden (Qi ≥ 0).' },
        { type: 'voorbeeld', title: '3 identieke bedrijven met P = 2Qi + 6', content: 'Stap 1: Omschrijven → Qi = (P − 6) / 2.\nStap 2: Minimumprijs → Qi = 0 bij P = 6. Onder €6 biedt niemand aan.\nStap 3: Qcol = 3 × (P − 6) / 2 = 1,5P − 9.\n\nBij P = 12: Qcol = 1,5 × 12 − 9 = 9.' },
        { type: 'tip', content: 'Je telt Q-waarden op, niet P-waarden! Schrijf daarom altijd eerst om naar Q = ...(P) voordat je gaat optellen. Horizontaal optellen in de grafiek = Q-waarden bij dezelfde P optellen.' },
        { type: 'valkuil', content: 'Als bedrijven een verschillende minimumprijs hebben, biedt het ene bedrijf al aan terwijl het andere nog niet produceert. Je collectieve aanbodcurve heeft dan een knik. Tel alleen bedrijven mee waarvoor Qi > 0 bij die prijs.' },
        { type: 'check', content: 'Kun je van individuele aanbodcurves naar een collectieve aanbodcurve rekenen, ook als de bedrijven niet identiek zijn?' }
    ]
},
S7: {
    title: 'Minimumprijs analyseren',
    sections: [
        { type: 'uitleg', content: 'Een minimumprijs is een door de overheid vastgestelde prijs die hoger ligt dan de evenwichtsprijs. Dit beschermt producenten (denk aan het minimumloon of landbouwprijzen). Omdat de prijs hoger is dan het evenwicht, willen producenten meer aanbieden en consumenten minder kopen: er ontstaat een aanbodoverschot.\n\nStap 1: Bereken het marktevenwicht zonder ingrijpen (P* en Q*).\nStap 2: Controleer: is de minimumprijs hoger dan P*? Zo niet, dan heeft de minimumprijs geen effect.\nStap 3: Bereken Qv en Qa bij de minimumprijs.\nStap 4: Overschot = Qa − Qv.' },
        { type: 'formule', content: 'Minimumprijs (Pmin) > P*:\n\nAanbodoverschot = Qa(Pmin) − Qv(Pmin)\n\nEr wordt verhandeld: Qv(Pmin) — de vraag bepaalt de verhandelde hoeveelheid.' },
        { type: 'voorbeeld', title: 'Minimumprijs van €16 bij Qv = 60 − 2P en Qa = −4 + 3P', content: 'Stap 1: 60 − 2P = −4 + 3P → P* = 12,8 en Q* = 34,4.\nStap 2: Pmin = 16 > 12,8 ✓ — de minimumprijs is bindend.\nStap 3: Qv = 60 − 2×16 = 28. Qa = −4 + 3×16 = 44.\nStap 4: Overschot = 44 − 28 = 16 stuks onverkocht.' },
        { type: 'tip', content: 'Een minimumprijs werkt alleen als hij boven de evenwichtsprijs ligt. Ligt hij eronder, dan is de marktprijs al hoger en verandert er niets. Denk: minimum = vloer. De vloer moet boven het evenwicht liggen om effect te hebben.' },
        { type: 'valkuil', content: 'Bij een minimumprijs bepaalt de vraagzijde hoeveel er verhandeld wordt, niet het aanbod. Producenten willen 44 stuks leveren, maar consumenten kopen er maar 28. Er worden dus 28 stuks verkocht, niet 44.' },
        { type: 'check', content: 'Kun je bij een minimumprijs het aanbodoverschot berekenen en uitleggen waarom de vraag de verhandelde hoeveelheid bepaalt?' }
    ]
},
S8: {
    title: 'Maximumprijs analyseren',
    sections: [
        { type: 'uitleg', content: 'Een maximumprijs is een door de overheid vastgestelde prijs die lager ligt dan de evenwichtsprijs. Dit beschermt consumenten (denk aan huurprijzen of prijsplafonds voor energie). Omdat de prijs lager is dan het evenwicht, willen consumenten meer kopen en producenten minder aanbieden: er ontstaat een vraagoverschot (tekort).\n\nStap 1: Bereken het marktevenwicht zonder ingrijpen.\nStap 2: Controleer: is de maximumprijs lager dan P*? Zo niet, dan heeft de maximumprijs geen effect.\nStap 3: Bereken Qv en Qa bij de maximumprijs.\nStap 4: Tekort = Qv − Qa.' },
        { type: 'formule', content: 'Maximumprijs (Pmax) < P*:\n\nVraagoverschot (tekort) = Qv(Pmax) − Qa(Pmax)\n\nEr wordt verhandeld: Qa(Pmax) — het aanbod bepaalt de verhandelde hoeveelheid.' },
        { type: 'voorbeeld', title: 'Maximumprijs van €10 bij Qv = 70 − 3P en Qa = −5 + 2P', content: 'Stap 1: 70 − 3P = −5 + 2P → P* = 15 en Q* = 25.\nStap 2: Pmax = 10 < 15 ✓ — de maximumprijs is bindend.\nStap 3: Qv = 70 − 3×10 = 40. Qa = −5 + 2×10 = 15.\nStap 4: Tekort = 40 − 15 = 25 stuks. Er worden maar 15 verhandeld.' },
        { type: 'tip', content: 'Een maximumprijs werkt alleen als hij onder de evenwichtsprijs ligt. Denk: maximum = plafond. Het plafond moet onder het evenwicht zitten om effect te hebben. Andersom dan bij de minimumprijs!' },
        { type: 'valkuil', content: 'Bij een maximumprijs bepaalt de aanbodzijde hoeveel er verhandeld wordt. Consumenten willen 40 stuks, maar producenten leveren er maar 15. Er worden dus 15 verhandeld — niet 40. Het tekort leidt vaak tot wachtlijsten of zwarte markten.' },
        { type: 'check', content: 'Kun je bij een maximumprijs het vraagoverschot berekenen en uitleggen welke bijeffecten (zwarte markt, wachtlijsten) kunnen ontstaan?' }
    ]
},
S9: {
    title: 'Subsidie analyseren',
    sections: [
        { type: 'uitleg', content: 'Een subsidie is het tegenovergestelde van een heffing: de overheid geeft geld aan producenten per verkocht product. De producent ontvangt effectief P + subsidie. Hierdoor verschuift de aanbodcurve naar rechts (omlaag): bij elke prijs wordt meer aangeboden. De marktprijs daalt en de verhandelde hoeveelheid stijgt.\n\nStap 1: Vervang P door (P + subsidie) in de aanbodfunctie.\nStap 2: Werk de nieuwe aanbodfunctie uit.\nStap 3: Los het nieuwe evenwicht op (nieuwe Qa = Qv).\nStap 4: Bereken de totale subsidiekosten voor de overheid: subsidie × Q*_nieuw.' },
        { type: 'formule', content: 'Subsidie bij producent: vervang P door (P + s) in Qa\n\nQa_nieuw = Qa(P + s)\n\nTotale subsidiekosten = s × Q*_nieuw\nConsumentenprijs daalt, producentenprijs stijgt.' },
        { type: 'voorbeeld', title: 'Subsidie van €5 bij Qv = 80 − 4P en Qa = −10 + 2P', content: 'Stap 1: Qa = −10 + 2(P + 5) = −10 + 2P + 10 = 2P.\nStap 2: Nieuwe Qa = 2P.\nStap 3: 80 − 4P = 2P → 80 = 6P → P* = 13,3. Q* = 80 − 4×13,3 = 26,7.\nStap 4: Totale subsidie = 5 × 26,7 = €133,50.\n\nOude P* was (80+10)/6 = 15. De prijs daalt met €1,70 — niet de volle €5.' },
        { type: 'tip', content: 'Net als bij een heffing wordt de subsidie verdeeld: consumenten profiteren door een lagere prijs, producenten profiteren door een hogere ontvangst. Hoe inelastischer de vraag, hoe meer het voordeel bij de consument terechtkomt.' },
        { type: 'valkuil', content: 'Bij een subsidie ontvangt de producent P + s, niet P − s. Het teken is tegengesteld aan een heffing! Als je P − s invult, verschuift de curve de verkeerde kant op en wordt je antwoord fout.' },
        { type: 'check', content: 'Kun je het effect van een subsidie op prijs, hoeveelheid en overheidsuitgaven berekenen?' }
    ]
},
S10: {
    title: 'MK = GTK oplossen',
    sections: [
        { type: 'uitleg', content: 'Het punt waar MK = GTK is het minimum van de GTK-curve. Dit punt heet de efficiënte schaal: hier zijn de gemiddelde kosten per stuk het laagst. Bij volkomen mededinging is dit op de lange termijn de marktprijs.\n\nStap 1: Stel de MK-functie op (afgeleide van TK).\nStap 2: Stel de GTK-functie op (TK gedeeld door Q).\nStap 3: Stel MK = GTK en vereenvoudig.\nStap 4: Los de vergelijking op naar Q.' },
        { type: 'formule', content: 'TK = aQ² + bQ + c\nMK = 2aQ + b (afgeleide)\nGTK = aQ + b + c/Q (delen door Q)\n\nMK = GTK → 2aQ + b = aQ + b + c/Q → aQ = c/Q → Q² = c/a → Q = √(c/a)' },
        { type: 'voorbeeld', title: 'Efficiënte schaal bij TK = 2Q² + 5Q + 72', content: 'Stap 1: MK = 4Q + 5.\nStap 2: GTK = 2Q + 5 + 72/Q.\nStap 3: 4Q + 5 = 2Q + 5 + 72/Q → 2Q = 72/Q.\nStap 4: Q² = 36 → Q = 6.\n\nBij Q = 6 zijn de gemiddelde kosten minimaal: GTK = 12 + 5 + 12 = 29.' },
        { type: 'tip', content: 'De truc is dat b (de lineaire term) aan beide kanten wegvalt. Je houdt altijd over: aQ = c/Q. Vermenigvuldig beide kanten met Q en je krijgt Q² = c/a. Daarna alleen nog worteltrekken.' },
        { type: 'valkuil', content: 'GTK is niet de afgeleide van TK! GTK = TK/Q. Veel leerlingen halen GTK en MK door elkaar. MK = afgeleide (de helling), GTK = gemiddelde (totaal gedeeld door Q). Dit zijn twee heel verschillende dingen.' },
        { type: 'check', content: 'Kun je het minimum van de GTK-curve vinden door MK = GTK op te lossen?' }
    ]
},

/* ══════════════════════════════════════════════════════════════
 *  LAAG 4 — GEVORDERD
 * ══════════════════════════════════════════════════════════════ */

E1: {
    title: 'Break-even analyse',
    sections: [
        { type: 'uitleg', content: 'Een volledige break-evenanalyse gaat verder dan alleen de break-evenpunten vinden. Je bepaalt ook bij welke hoeveelheden er winst of verlies is, en hoe groot de winst is bij een bepaalde Q. Dit geeft een compleet beeld van de winstgevendheid van een bedrijf.\n\nStap 1: Stel TO = TK en herschrijf naar standaardvorm (aQ² + bQ + c = 0).\nStap 2: Los op met de abc-formule → twee break-evenpunten Q₁ en Q₂.\nStap 3: Bepaal het winstgebied: tussen Q₁ en Q₂ is er winst.\nStap 4: Bereken de winst bij een specifieke hoeveelheid: W = TO − TK.\nStap 5: Optioneel — bereken de maximale winst (bij Q waar MO = MK).' },
        { type: 'formule', content: 'Break-even: TO = TK → aQ² + bQ + c = 0\nabc-formule: Q = (−b ± √(b² − 4ac)) / 2a\n\nWinstgebied: Q₁ < Q < Q₂\nMaximale winst: bij Q waar MO = MK' },
        { type: 'voorbeeld', title: 'Break-even bij P = 50 en TK = Q² + 10Q + 96', content: 'Stap 1: 50Q = Q² + 10Q + 96 → Q² − 40Q + 96 = 0.\nStap 2: D = 1600 − 384 = 1216. Q = (40 ± 34,9) / 2 → Q₁ ≈ 2,6 en Q₂ ≈ 37,4.\nStap 3: Tussen Q = 2,6 en Q = 37,4 maakt het bedrijf winst.\nStap 4: Bij Q = 20: TO = 1000, TK = 400 + 200 + 96 = 696. Winst = 304.' },
        { type: 'tip', content: 'Controleer altijd of de discriminant (D = b² − 4ac) positief is. Is D negatief, dan zijn er geen break-evenpunten en maakt het bedrijf altijd verlies (of altijd winst, maar dat is zeldzaam in een opgave).' },
        { type: 'valkuil', content: 'Bij het herschrijven naar de standaardvorm verandert het teken van de Q-term. Als TO = 50Q, dan krijg je −50Q aan de andere kant. Controleer: de coëfficiënt van Q moet gelijk zijn aan (b_TK − P), niet (P − b_TK).' },
        { type: 'check', content: 'Kun je een volledige break-evenanalyse uitvoeren: break-evenpunten vinden, het winstgebied bepalen en de winst bij een specifieke Q berekenen?' }
    ]
},
E2: {
    title: 'Consumentensurplus',
    sections: [
        { type: 'uitleg', content: 'Bij deze vaardigheid bereken je het consumentensurplus volledig vanuit de functies, zonder dat het evenwicht al gegeven is. Je moet dus eerst zelf het evenwicht uitrekenen en het snijpunt met de P-as bepalen, voordat je de driehoeksoppervlakte kunt berekenen.\n\nStap 1: Bereken de evenwichtsprijs P* door Qv = Qa te stellen.\nStap 2: Bereken de evenwichtshoeveelheid Q* door P* in te vullen.\nStap 3: Bepaal Pmax (snijpunt vraaglijn met P-as: vul Q = 0 in).\nStap 4: CS = ½ × Q* × (Pmax − P*).' },
        { type: 'formule', content: 'CS = ½ × Q* × (Pmax − P*)\n\nWaarbij:\n- Q* = evenwichtshoeveelheid\n- Pmax = maximale betalingsbereidheid (Q = 0 in vraaglijn)\n- P* = evenwichtsprijs' },
        { type: 'voorbeeld', title: 'CS bij Qv = 100 − 4P en Qa = −20 + 2P', content: 'Stap 1: 100 − 4P = −20 + 2P → 120 = 6P → P* = 20.\nStap 2: Q* = 100 − 4×20 = 20.\nStap 3: Pmax → Q = 0 → 100 = 4P → Pmax = 25.\nStap 4: CS = ½ × 20 × (25 − 20) = ½ × 20 × 5 = 50.' },
        { type: 'tip', content: 'Maak een schets! Teken de vraaglijn en aanbodlijn, markeer P*, Q* en Pmax. Dan zie je de driehoek die je moet berekenen. De hoogte is altijd verticaal (Pmax − P*) en de basis is horizontaal (Q*).' },
        { type: 'valkuil', content: 'Pmax is niet de coëfficiënt vóór P in de vraaglijn. Bij Qv = 100 − 4P moet je Q = 0 invullen: 100 = 4P → Pmax = 25. Niet 100!' },
        { type: 'check', content: 'Kun je het consumentensurplus volledig zelfstandig berekenen vanuit de vraag- en aanbodfunctie?' }
    ]
},
E3: {
    title: 'Individueel → collectief aanbod',
    sections: [
        { type: 'uitleg', content: 'Als er meerdere groepen aanbieders zijn met verschillende kostenfuncties, moet je het collectieve aanbod stap voor stap opbouwen. Elke groep heeft een eigen minimumprijs en een eigen aanbodfunctie. Bij lage prijzen biedt misschien maar één groep aan; bij hogere prijzen komen er meer aanbieders bij.\n\nStap 1: Schrijf elke individuele aanbodlijn om naar Qi als functie van P.\nStap 2: Bepaal per groep de minimumprijs (waar Qi = 0).\nStap 3: Vermenigvuldig per groep met het aantal bedrijven.\nStap 4: Tel de groepen op bij de gevraagde prijs (alleen als Qi > 0).' },
        { type: 'formule', content: 'Groep A (n₁ bedrijven): Qa_tot = n₁ × Qi_A(P), mits P ≥ Pmin_A\nGroep B (n₂ bedrijven): Qb_tot = n₂ × Qi_B(P), mits P ≥ Pmin_B\n\nQcollectief = Qa_tot + Qb_tot (alleen positieve termen)' },
        { type: 'voorbeeld', title: '2 bedrijven type A (P = Q + 4) en 1 bedrijf type B (P = 2Q + 8)', content: 'Stap 1: Qi_A = P − 4. Qi_B = (P − 8)/2.\nStap 2: Pmin_A = 4. Pmin_B = 8.\nStap 3: Bij P = 10: Qa_tot = 2 × (10 − 4) = 12. Qb_tot = 1 × (10 − 8)/2 = 1.\nStap 4: Qcol = 12 + 1 = 13.\n\nLet op: bij P = 6 biedt groep B nog niet aan! Qcol = 2 × (6 − 4) = 4.' },
        { type: 'tip', content: 'Orden de groepen op minimumprijs (laag naar hoog). De collectieve aanbodcurve heeft een knik bij elke minimumprijs waar een nieuwe groep toetreedt. Geef in je antwoord altijd aan bij welke prijs de knik zit.' },
        { type: 'valkuil', content: 'Als groep B een minimumprijs van €8 heeft en je rekent bij P = 6, dan is Qi_B = (6−8)/2 = −1. Dat is negatief — je mag die niet meetellen! Negatief aanbod bestaat niet. Zet Qi_B = 0 bij prijzen onder Pmin_B.' },
        { type: 'check', content: 'Kun je bij twee groepen aanbieders met verschillende kostenstructuren het totale marktaanbod bepalen en de knikpunten aanwijzen?' }
    ]
},
E5: {
    title: 'Optimale productie bij VM',
    sections: [
        { type: 'uitleg', content: 'Bij volkomen mededinging (VM) is het individuele bedrijf een prijsnemer: het kan de marktprijs niet beïnvloeden. De optimale productie ligt waar P = MK. Het bedrijf maakt winst als P > GTK bij die hoeveelheid, en verlies als P < GTK.\n\nStap 1: Stel P = MK en los op naar Q (de optimale hoeveelheid).\nStap 2: Bereken TK bij Q* en daaruit GTK = TK/Q*.\nStap 3: Bereken winst per stuk = P − GTK.\nStap 4: Bereken totale winst = winst per stuk × Q*.' },
        { type: 'formule', content: 'Bij VM: P = MO = MK (de marktprijs is de MO)\n\nOptimale Q: los P = MK op\nWinst per stuk = P − GTK\nTotale winst = (P − GTK) × Q*' },
        { type: 'voorbeeld', title: 'P = 30, TK = 0,5Q² + 4Q + 80', content: 'Stap 1: MK = Q + 4. P = MK → 30 = Q + 4 → Q* = 26.\nStap 2: TK = 0,5×676 + 4×26 + 80 = 338 + 104 + 80 = 522. GTK = 522/26 = 20,08.\nStap 3: Winst/stuk = 30 − 20,08 = 9,92.\nStap 4: Totale winst = 9,92 × 26 = 257,92.' },
        { type: 'tip', content: 'Bij VM geldt: P = MO. Waarom? Omdat elke extra eenheid tegen dezelfde marktprijs wordt verkocht. MO is dus constant en gelijk aan P. Dit maakt de berekening eenvoudiger dan bij een monopolist.' },
        { type: 'valkuil', content: 'Winst is niet P × Q! Dat is de totale opbrengst. Winst = TO − TK = (P − GTK) × Q. Vergeet niet de kosten eraf te trekken. Veel leerlingen stoppen na het berekenen van TO en vergeten TK.' },
        { type: 'check', content: 'Kun je bij een gegeven marktprijs en kostenfunctie de optimale productie en bijbehorende winst berekenen voor een bedrijf bij volkomen mededinging?' }
    ]
},

/* ══════════════════════════════════════════════════════════════
 *  LAAG 5 — EINDBAZEN
 * ══════════════════════════════════════════════════════════════ */

E4: {
    title: 'Welvaartsverlies belasting',
    sections: [
        { type: 'uitleg', content: 'Een belasting verstoort het marktevenwicht: de verhandelde hoeveelheid daalt. Het welvaartsverlies (deadweight loss) is de welvaart die verloren gaat doordat transacties niet meer plaatsvinden. In de grafiek is dit de driehoek tussen de oude en nieuwe hoeveelheid, met de heffing als hoogte.\n\nStap 1: Bereken het oude evenwicht (P* en Q* zonder heffing).\nStap 2: Bereken het nieuwe evenwicht (P*_nieuw en Q*_nieuw met heffing).\nStap 3: Bereken het welvaartsverlies: DWL = ½ × (Q_oud − Q_nieuw) × heffing.' },
        { type: 'formule', content: 'Welvaartsverlies (DWL) = ½ × ΔQ × t\n\nWaarbij:\n- ΔQ = Q*_oud − Q*_nieuw (daling in verhandelde hoeveelheid)\n- t = heffing per stuk' },
        { type: 'voorbeeld', title: 'DWL bij heffing van €6, Q_oud = 30, Q_nieuw = 21', content: 'Stap 1: Q_oud = 30 (berekend uit evenwicht zonder heffing).\nStap 2: Q_nieuw = 21 (berekend uit evenwicht met heffing).\nStap 3: DWL = ½ × (30 − 21) × 6 = ½ × 9 × 6 = 27.\n\nEr gaat €27 aan welvaart verloren door de belasting.' },
        { type: 'tip', content: 'Het welvaartsverlies is altijd een driehoek, nooit een rechthoek. De rechthoek (heffing × Q_nieuw) is de belastingopbrengst voor de overheid — dat is geen verlies, maar een herverdeling. Alleen de driehoek is echt weg.' },
        { type: 'valkuil', content: 'Verwar het welvaartsverlies niet met de totale belastingopbrengst. De belastingopbrengst = t × Q_nieuw (een rechthoek). Het welvaartsverlies = ½ × (Q_oud − Q_nieuw) × t (een driehoek). Dit zijn twee verschillende dingen!' },
        { type: 'check', content: 'Kun je het welvaartsverlies van een belasting berekenen en uitleggen waarom het een driehoek is en geen rechthoek?' }
    ]
},
E6: {
    title: 'Effecten invoerrecht',
    sections: [
        { type: 'uitleg', content: 'Een invoerrecht (importtarief) is een heffing op geïmporteerde goederen. Het verhoogt de binnenlandse prijs van P_wereld naar P_wereld + tarief. Hierdoor veranderen er vier dingen tegelijk: de binnenlandse productie stijgt, de consumptie daalt, de import krimpt, en de overheid ontvangt inkomsten.\n\nStap 1: Bereken Qv en Qa bij de wereldmarktprijs → import = Qv − Qa.\nStap 2: Bereken de nieuwe binnenlandse prijs: P_nieuw = P_wereld + tarief.\nStap 3: Bereken Qv en Qa bij P_nieuw → nieuwe import = Qv_nieuw − Qa_nieuw.\nStap 4: Overheidsinkomsten = tarief × nieuwe import.' },
        { type: 'formule', content: 'Zonder invoerrecht: Import = Qv(Pw) − Qa(Pw)\nMet invoerrecht: Import = Qv(Pw + t) − Qa(Pw + t)\n\nOverheidsinkomsten = t × import_nieuw\nBinnenlandse productie stijgt: Qa(Pw + t) > Qa(Pw)' },
        { type: 'voorbeeld', title: 'Invoerrecht van €3 bij Pw = 12, Qv = 90 − 2P, Qa = −10 + 3P', content: 'Stap 1: Bij P = 12: Qv = 66, Qa = 26. Import = 66 − 26 = 40.\nStap 2: P_nieuw = 12 + 3 = 15.\nStap 3: Bij P = 15: Qv = 60, Qa = 35. Import = 60 − 35 = 25.\nStap 4: Overheidsinkomsten = 3 × 25 = 75.\n\nImport daalt van 40 naar 25, binnenlandse productie stijgt van 26 naar 35.' },
        { type: 'tip', content: 'Maak een tabel met twee kolommen: "zonder invoerrecht" en "met invoerrecht". Vul voor beide de Qv, Qa, import en prijs in. Dan heb je een helder overzicht van alle effecten.' },
        { type: 'valkuil', content: 'Het invoerrecht verandert niet de binnenlandse vraag- of aanbodfuncties zelf. Het verandert alleen de prijs waartegen gehandeld wordt. Pas dus niet de functies aan, maar vul de nieuwe prijs (Pw + t) in de bestaande functies in.' },
        { type: 'check', content: 'Kun je alle vier de effecten van een invoerrecht berekenen: verandering in productie, consumptie, import en overheidsinkomsten?' }
    ]
},
E7: {
    title: 'Max. winst monopolist',
    sections: [
        { type: 'uitleg', content: 'Een monopolist maximaliseert winst door te produceren waar MO = MK. Anders dan bij VM bepaalt de monopolist zelf de prijs via de vraaglijn. Na het vinden van Q* moet je dus de prijs aflezen uit de vraaglijn, niet uit MO of MK.\n\nStap 1: Stel de MO-functie op (als P = a − bQ, dan MO = a − 2bQ).\nStap 2: Stel MO = MK en los op naar Q*.\nStap 3: Vul Q* in de vraaglijn om P* te vinden.\nStap 4: Bereken TO = P* × Q*.\nStap 5: Bereken TK bij Q*.\nStap 6: Winst = TO − TK.' },
        { type: 'formule', content: 'Vraaglijn: P = a − bQ → MO = a − 2bQ\nWinstmaximum: MO = MK → Q*\nPrijs: P* = a − bQ* (aflezen uit vraaglijn!)\nWinst = P* × Q* − TK(Q*)' },
        { type: 'voorbeeld', title: 'Monopolist met P = 80 − 2Q en TK = Q² + 10Q + 100', content: 'Stap 1: MO = 80 − 4Q. MK = 2Q + 10.\nStap 2: 80 − 4Q = 2Q + 10 → 70 = 6Q → Q* = 11,7 (afgerond).\nStap 3: P* = 80 − 2×11,7 = 56,6.\nStap 4: TO = 56,6 × 11,7 = 662,2.\nStap 5: TK = 136,9 + 117 + 100 = 353,9.\nStap 6: Winst = 662,2 − 353,9 = 308,3.' },
        { type: 'tip', content: 'De monopolist zit op de vraaglijn, niet op de MO-lijn. MO gebruik je alleen om Q* te vinden. De prijs lees je af op de vraaglijn bij Q*. Dit is altijd hoger dan MO bij Q*, want MO daalt sneller dan P.' },
        { type: 'valkuil', content: 'Gebruik niet MO als prijs! Bij Q* = 11,7 is MO = 80 − 4×11,7 = 33,2, maar de prijs is P = 80 − 2×11,7 = 56,6. Als je MO als prijs gebruikt, bereken je de TO veel te laag en krijg je een verkeerde winst.' },
        { type: 'check', content: 'Kun je de volledige winstberekening van een monopolist uitvoeren: van MO = MK naar Q*, P*, en uiteindelijk de winst?' }
    ]
},
E8: {
    title: 'Prijsdiscriminatie',
    sections: [
        { type: 'uitleg', content: 'Bij prijsdiscriminatie verkoopt een monopolist hetzelfde product tegen verschillende prijzen op verschillende markten. De monopolist maximaliseert de winst op elke markt apart door MO = MK te stellen per markt. De MK is voor beide markten gelijk (zelfde fabriek), maar de MO verschilt per markt (verschillende vraaglijnen).\n\nStap 1: Stel MO₁ = MK en los op naar Q₁.\nStap 2: Vul Q₁ in de vraaglijn van markt 1 → P₁.\nStap 3: Stel MO₂ = MK en los op naar Q₂.\nStap 4: Vul Q₂ in de vraaglijn van markt 2 → P₂.\nStap 5: Bereken winst per markt: (P − MK) × Q.\nStap 6: Totale winst = winst markt 1 + winst markt 2.' },
        { type: 'formule', content: 'Per markt: MO_i = MK → Q_i*\nP_i = vraaglijn_i(Q_i*)\nWinst_i = (P_i − MK) × Q_i*\n\nTotale winst = Σ Winst_i\n\nBij constante MK: winst_i = (P_i − MK) × Q_i' },
        { type: 'voorbeeld', title: 'MK = 15 constant. Markt 1: P = 70 − 2Q. Markt 2: P = 100 − 5Q.', content: 'Stap 1: MO₁ = 70 − 4Q₁ = 15 → Q₁ = 13,75.\nStap 2: P₁ = 70 − 2×13,75 = 42,50.\nStap 3: MO₂ = 100 − 10Q₂ = 15 → Q₂ = 8,5.\nStap 4: P₂ = 100 − 5×8,5 = 57,50.\nStap 5: Winst₁ = (42,50 − 15) × 13,75 = 378,13. Winst₂ = (57,50 − 15) × 8,5 = 361,25.\nStap 6: Totaal = 378,13 + 361,25 = 739,38.' },
        { type: 'tip', content: 'De markt met de steilere vraaglijn (meer inelastische vraag) krijgt de hogere prijs. Logisch: als consumenten toch blijven kopen, kan de monopolist meer vragen. Controleer altijd: de prijs verschilt, de MK is gelijk.' },
        { type: 'valkuil', content: 'Gebruik niet dezelfde Q voor beide markten! Elke markt heeft een eigen vraaglijn, dus een eigen MO, een eigen Q* en een eigen P*. Los ze apart op. De enige constante over markten heen is MK.' },
        { type: 'check', content: 'Kun je bij twee markten met verschillende vraaglijnen de optimale prijs, hoeveelheid en winst per markt berekenen?' }
    ]
},
E9: {
    title: 'Lange-termijnevenwicht VM',
    sections: [
        { type: 'uitleg', content: 'Op de lange termijn bij volkomen mededinging kunnen bedrijven vrij toe- en uittreden. Als bedrijven winst maken, treden er nieuwe bedrijven toe, waardoor het aanbod stijgt en de prijs daalt. Dit proces stopt pas als de winst nul is: P = GTK. Tegelijk geldt P = MK (winstmaximalisatie). Dus op lange termijn: P = MK = GTK, en dat punt is het minimum van de GTK-curve.\n\nStap 1: Vind Q* waar MK = GTK (het minimum van GTK — zie S10).\nStap 2: Bereken MK (of GTK) bij Q* — dit is de lange-termijnprijs.\nStap 3: Verifieer: P = MK = GTK.\nStap 4: Bereken de winst: die moet (nagenoeg) nul zijn.' },
        { type: 'formule', content: 'Lange-termijnevenwicht VM:\nP = MK = GTK = minimum van GTK-curve\n\nWinst per stuk = P − GTK = 0\nTotale winst = 0\n\nVind Q*: los MK = GTK op (zie S10).\nPrijs = MK(Q*) = GTK(Q*).' },
        { type: 'voorbeeld', title: 'Lange termijn bij TK = Q² + 6Q + 25', content: 'Stap 1: MK = 2Q + 6. GTK = Q + 6 + 25/Q.\nMK = GTK → 2Q + 6 = Q + 6 + 25/Q → Q = 25/Q → Q² = 25 → Q* = 5.\nStap 2: MK(5) = 10 + 6 = 16. GTK(5) = 5 + 6 + 5 = 16. ✓\nStap 3: P = 16.\nStap 4: Winst/stuk = 16 − 16 = 0. Klopt: op de lange termijn is de winst nul.' },
        { type: 'tip', content: 'Het lange-termijnevenwicht bij VM is eigenlijk S10 plus de conclusie dat P = die minimale GTK. Als je S10 kunt, hoef je alleen nog te onthouden dat de prijs gelijk is aan MK = GTK bij dat punt. Winst = 0 is het controle-antwoord.' },
        { type: 'valkuil', content: 'Winst = 0 betekent niet dat het bedrijf geen geld verdient! De kosten in TK bevatten al een normaal ondernemersinkomen (de impliciete kosten). Economische winst = 0 betekent dat het bedrijf precies genoeg verdient om in de markt te blijven, niet meer en niet minder.' },
        { type: 'check', content: 'Kun je het lange-termijnevenwicht bij volkomen mededinging bepalen en uitleggen waarom de winst nul is?' }
    ]
}

    };
});
