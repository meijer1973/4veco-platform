// HOW TO ADAPT: derive assignments/pages from the current manuscript and full book.
// Keep authored examples separate from practice; update the adjacent source manifest.
// Set runtime variables using the installed Presentations skill; use a fresh workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('426');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='Overheidsingrijpen bij marktfalen';
const sourceCommit='e734532a42b27732ac25ce990fc9448b12309d28';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${sourceCommit}/edities/books34-v3/books/book-4/`;
const tables=[],slides=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,footer=`§4.2.6 ${title}`,size=52){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,85,size,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, gedrukte boekpagina ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.2/4.2.6%20manuscript.md\nAntwoordmodel: ${source}chapters/4.2/Antwoorden.md#antwoord52\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
   cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
  }
 }
 tables.push(p.slides.items.length);return t;
}
function rows(s,items,start=216,gap=145){items.forEach(([a,b],i)=>{const y=start+i*gap;text(s,a,60,y,480,80,38,{bold:true,color:C.blue});text(s,b,590,y,945,110,36);if(i<items.length-1)rule(s,60,y+gap-25,1480);});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 52.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide(`Deze les: §4.2.6 ${title}`,undefined,44);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:`route-number-${i+1}`});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:`route-${i+1}`});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Beleid aan het probleem koppelen;\nplannen doorrekenen; efficiëntie,\nverdeling en uitvoering afwegen.',972,244,565,122,30,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,398,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 101 · Opgaven 46 en 47\n46: verkennen met theorie p. 100\n47: verkennen met theorie p. 99',972,451,565,113,30,{bold:active===2,name:'overview-start'});
 rule(s,972,581,568);
 text(s,'Huiswerk',972,604,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.2.6 · Opgaven 48 t/m 52\nBasis: 48 en 49\nZelfstandig: 50 en 51\nDoelopgave: 52\nMaken en nakijken',972,660,565,182,30,{bold:active===7,name:'overview-homework'});
 notes(s,'99–103',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 46–47 op p. 101; basis 48 op p. 101 en 49 op p. 102; zelfstandig 50–51 op p. 102; doel 52 op p. 103. Huiswerk is 48, 49, 50, 51 en 52 maken en nakijken. Bonus 53 en herhaling 54 zijn extra. Bij 46 is de bekende rekening uit §4.2.4 uitgebreid met echte uitvoeringskosten: laat de uitleg op p. 100 gebruiken. Bij 47 is de stap van instrument naar expliciet criterium nieuw: laat p. 99 gebruiken. Vraag leerlingen de gebruikte steun en hun twijfel te noteren; dit is verkennen, geen toets van beheersing. Vóór het basiswerk: laat 46–47 opnieuw proberen, laat leerlingen uitleggen welke stap is veranderd en geef zo nodig extra steun. De volledige route mag in een volgende les of als huiswerk worden voltooid.`, 'Welke stap kun je al uitleggen, en waar gebruik je de theorie?', 'De handleiding noemt hoofdstukpagina’s 47–52; het complete boek heeft hier gedrukte pagina’s 99–104.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga naar de volgende lesfase wanneer de klas eraan toe is.');
}
const example='Uitlegvoorbeeld — niet uit het boek';
const exampleSource='Eigen geconstrueerd uitlegvoorbeeld Bootreiniging, geen boekopgave. De getallen en context zijn voor deze presentatie gemaakt; de methode volgt §4.2.6 p. 99–100 en §4.2.4 p. 81–82.';
function exslide(t){return slide(t,example);}
function exnotes(s,e,q,m,tr){notes(s,'99–100 (methode)',e,q,m,tr,exampleSource);}

overview('Startopdracht',2);
{
 const s=slide('Probleem, oorzaak en instrument');
 table(s,[['Marktprobleem','Oorzaak','Mogelijk instrument'],['Marktmacht','Afzet beperken voor meer winst','Toetreding mogelijk maken\nof prijskeuze begrenzen'],['Negatief extern effect','Schade aan derden telt\nonvoldoende mee','Heffing of hoeveelheidseis'],['Positief extern effect','Baten voor derden tellen\nonvoldoende mee','Subsidie']],60,215,1480,460,[410,545,525],32);
 text(s,'Een instrument moet de beschreven oorzaak veranderen.',60,731,1480,76,39,{bold:true,color:C.blue});
 notes(s,'99','Verbind iedere rij aan het mechanisme. Marktmacht kan afzetbeperking opleveren; een hoge prijs door schaarste bewijst op zichzelf geen misbruik. Bij externe effecten ontbreken kosten of baten van derden in de private keuze. Een heffing maakt schade onderdeel van de afweging; een nageleefde grens beperkt activiteit rechtstreeks. Een passende subsidie stimuleert activiteit met externe baten. Of een maatregel werkt hangt van de bronvoorwaarden af.','Welk probleem verandert een subsidie wel, en welk probleem niet vanzelf?','Een instrument is geen doel. Een subsidie haalt een toetredingsbarrière niet automatisch weg.','Kies nu waarop je de maatregelen wilt beoordelen.');
}
{
 const s=slide('Efficiëntie, verdeling en budget');
 rows(s,[['Efficiëntie','Hoe groot is het maatschappelijk surplus\nna alle relevante kosten?'],['Verdeling','Welke groepen krijgen of verliezen voordeel?'],['Budget','Hoeveel ontvangt of betaalt de overheid?']],218,167);
 text(s,'Spreek het criterium af vóór je een plan kiest.',60,764,1480,60,39,{bold:true,color:C.orange});
 notes(s,'99–100','Gebruik dezelfde uitkomsten met drie verschillende vragen. Het maatschappelijk surplus telt het voordeel voor iedereen samen binnen het model. Een groepsbelang gaat over de verdeling van dat voordeel. Een budgetbedrag is een geldstroom voor de overheid. Een plan kan op die criteria verschillend scoren. Voor een verandering vergelijk je bovendien met een passende beginsituatie; alleen ontvangsten geven geen welvaartsverandering.','Kan een producent een ander plan verkiezen dan de raad?','Een beter resultaat voor één groep bewijst geen groter maatschappelijk surplus.','Breid de bekende surplusrekening uit met uitvoering.');
}
{
 const s=slide('Uitvoering gebruikt echte middelen');
 table(s,[['Post bij heffing en externe schade','In de maatschappelijke rekening'],['CS + PS','Voordeel van kopers en producenten'],['+ overheidsontvangsten','Overdracht naar de overheid'],['− externe schade','Kosten voor derden'],['− uitvoeringskosten','Verbruik van mensen en middelen']],60,211,1480,474,[755,725],33);
 text(s,'Trek uitvoeringskosten één keer af.',60,735,1480,65,43,{bold:true,color:C.orange});
 notes(s,'100; voorkennis §4.2.4 p. 79 en 82','De heffing is al verwerkt in wat kopers betalen en producenten ontvangen. Daarom voegen we de overheidsontvangst toe aan CS en PS. Schade voor derden en echte uitvoering verbruiken welvaart en worden afgetrokken. Inspecteurs en materieel zijn elders niet inzetbaar: het zijn maatschappelijke kosten, geen gewone overdracht. Gebruik de posten die de bron noemt. Zonder externe effecten vervalt de schadepost; bij subsidie en externe baten geldt de bekende rekening CS + PS − subsidie-uitgaven + externe baten, daarna eventuele uitvoering.','Waarom krijgt belastingopbrengst een plus en uitvoering een min?','Als de bron surplus ná uitvoering geeft, trek je die kosten niet opnieuw af.','Pas dit toe op een apart onderwijsvoorbeeld.');
}
{
 const s=exslide('Bootreiniging · Twee beleidsplannen');
 text(s,'Een concurrerende markt voor reinigingsbeurten veroorzaakt\n€ 6 niet-vergoede schade aan vissers per beurt.',60,205,1480,115,38);
 table(s,[['Model','Gegeven'],['Vraag / aanbod','Pc = 48 − Q      Pp = 6 + Q'],['Eenheden','Q: beurten per dag · prijzen: € per beurt'],['Plan T','Producenten dragen € 6 per beurt af.'],['Plan M','Hoogstens 18 beurten per dag.']],60,362,1480,340,[420,1060],31);
 text(s,'Criterium: maximaal maatschappelijk surplus na uitvoering.',60,756,1480,60,35,{bold:true,color:C.blue});
 exnotes(s,'Alle getallen horen bij dit aparte model. De derde partij bestaat uit vissers die niet worden vergoed. Het relevante probleem is schade die kopers en reinigingsbedrijven niet volledig in hun keuze opnemen. T verandert de private afweging en M begrenst de hoeveelheid. Voor dit voorbeeld worden beide regels nageleefd; bij M handelen kopers met de hoogste betalingsbereidheid en aanbieders met de laagste kosten en wordt toestemming gratis toegewezen. Andere kosten of baten ontbreken. Deze aannamen komen bij de vergelijking terug.','Wie ondervindt nadeel zonder partij bij de reiniging te zijn?','De € 6 schade is geen ontvangen betaling voor de vissers.','Bereken eerst wat de heffing doet met Q.');
}
{
 const s=exslide('Bootreiniging · De heffingswig');
 rows(s,[['Relatie tussen prijzen','Pc = Pp + 6'],['Functies invullen','48 − Q = 6 + Q + 6'],['Oplossen','36 = 2Q\nQ = 18 beurten per dag']],214,166);
 exnotes(s,'Haal de heffingsroute uit §4.2.4 terug. De koper betaalt de prijs op de vraaglijn, de producent houdt de prijs op de oorspronkelijke aanbodlijn over. De € 6 wordt opgeteld bij Pp. Verzamel de Q-termen: 48 − 12 = 2Q, dus Q = 18. Het ongereguleerde evenwicht zou 21 beurten zijn; de heffing vermindert activiteit. M stelt dezelfde bovengrens, maar de verdeling van de opbrengst hoeft niet gelijk te zijn.','Welke prijs ligt bij een producentenheffing hoger?','Gebruik geen MO = MK: dit is een concurrerende markt, geen monopolist.','Vul de hoeveelheid in beide oorspronkelijke functies in.');
}
{
 const s=exslide('Bootreiniging · Prijzen en ontvangsten');
 rows(s,[['Kopersprijs','Pc = 48 − 18 = € 30 per beurt'],['Producentenprijs','Pp = 6 + 18 = € 24 per beurt'],['Overheidsontvangsten','6 × 18 = € 108 per dag']],214,166);
 text(s,'Controle: 30 − 24 = € 6 per beurt.',60,773,1480,55,36,{bold:true,color:C.green});
 exnotes(s,'De producent ontvangt hier netto 24 euro, niet de kopersbetaling van 30 euro. De overheid ontvangt 6 euro op elk van de 18 uitgevoerde beurten: 108 euro per dag. Dat is een overdracht. De schade is 6 × 18 = 108 euro per dag, maar betreft een andere post; de twee vallen alleen numeriek gelijk uit door de gekozen bedragen.','Waarom vermenigvuldig je met 18 en niet alleen met de afname van Q?','Euro per beurt en euro per dag zijn verschillende eenheden.','Vul nu alle partijen en uitvoering in één rekening in.');
}
{
 const s=exslide('Bootreiniging · De volledige rekening');
 text(s,'Gegeven: naleving; bij M efficiënte toewijzing en gratis toestemming.',60,187,1480,78,32,{color:C.blue});
 table(s,[['Post (€ per dag)','Plan T','Plan M'],['CS','162','162'],['PS','162','270'],['+ overheidsontvangsten','108','0'],['− externe schade','108','108'],['Surplus vóór uitvoering','324','324'],['− echte uitvoeringskosten','12','30'],['Surplus na uitvoering','312','294']],60,286,1480,488,[780,350,350],32);
 exnotes(s,'De CS- en PS-bedragen zijn voor dit voorbeeld gegeven en passen bij de functies: CS = ½ × 18 × 18 = 162; bij T is PS = ½ × 18 × 18 = 162. Bij M krijgen producenten ook 6 × 18 = 108 erbij: PS = 270. Voor uitvoering is T: 162 + 162 + 108 − 108 = 324; M: 162 + 270 − 108 = 324. Uitvoering gebruikt 12 respectievelijk 30 euro per dag aan middelen. Dus 324 − 12 = 312 en 324 − 30 = 294. Alle relevante posten staan in de tabel; trek geen tweede keer uitvoeringskosten af.','Welke rij maakt het verschil in het gezamenlijke resultaat?','Meer PS bij M betekent hier niet meer maatschappelijk surplus vóór uitvoering.','Gebruik de uitkomst voor een begrensd advies.');
}
{
 const s=exslide('Bootreiniging · Advies en beperking');
 rows(s,[['Advies bij efficiëntie','Plan T: € 312 in plaats van € 294 per dag.\nVoordeel: € 18 per dag.'],['Verdeling','Producenten hebben meer PS bij plan M.'],['Voorwaarde','Dit advies geldt bij de gegeven naleving,\ntoewijzing en uitvoeringskosten.']],216,165);
 exnotes(s,'Formuleer het advies in één redenering: bij het criterium maximaal maatschappelijk surplus na uitvoering kies ik T, want de opbrengst is 18 euro per dag groter. Dat komt door lagere uitvoeringskosten; de vergelijking vóór uitvoering was gelijk. Een producent kan M verkiezen vanwege het grotere PS. Dat is een ander criterium, geen rekenfout van de raad. Als uitvoering duurder blijkt of de grens slecht wordt nageleefd, kan het advies veranderen.','Welke concrete aanname zou je controleren voordat je het advies gebruikt?','Zeg niet dat T altijd beter is of iedere groep beter af maakt.','Fris voor zelfstandig werk het onderscheid tussen gevraagde en uitgevoerde transacties op.');
}
{
 const s=slide('Maximumprijs · Werkelijke transacties',example);
 text(s,'Apart voorbeeld: Qv = 36 en Qa = 24 ritten per dag.\nGeen extra voorraad; alle aangeboden ritten worden uitgevoerd.\nElke rit veroorzaakt € 5 niet-vergoede schade aan buren.',60,195,1480,157,36);
 table(s,[['Grootheid','Berekening'],['Tekort','36 − 24 = 12 ritten per dag'],['Werkelijke transacties','24 ritten per dag'],['Resterende schade','24 × 5 = € 120 per dag']],60,391,1480,316,[690,790],33);
 text(s,'Een lagere prijs vergoedt de buren niet.',60,761,1480,60,39,{bold:true,color:C.orange});
 notes(s,'102 (toepassing); §4.2.4 p. 77–79','Dit aparte, korte herhaalvoorbeeld ondersteunt de overstap naar opgave 51. Lees de vraag en het aanbod apart. De korte kant bepaalt het aantal mogelijke transacties zonder aanvullende voorraad; de context garandeert hier verkoop van het aanbod. Bereken het tekort met vraag min aanbod, maar de schade met uitgevoerde ritten. Niet alle vragers krijgen een rit en de schade aan buren blijft bestaan. Een volledige welvaartsvergelijking vraagt daarnaast om toewijzing en overige surplusposten.','Gebruik je voor de schade 36, 24 of 12? Waarom?','Een lage prijs is geen schadeloosstelling, en vraag is niet hetzelfde als verkoop.','Maak de antwoordroute expliciet voordat de leerlingen oefenen.','Eigen mini-voorbeeld: ritten, 36/24, € 5. Geen boekopgave of extra huiswerk. Voorkennis: Boek 3 v3 §3.1.4, manuscript “De korte kant bepaalt wat er kan worden verkocht” (hoofdstukpagina 29).');
}
{
 const s=slide('Een beleidsadvies onderbouwen');
 rows(s,[['Probleem en mechanisme','Wie ondervindt schade of mist voordeel?\nHoe grijpt het instrument daarop aan?'],['Berekening en criterium','Vergelijk dezelfde periode en relevante posten.\nPast de uitkomst bij het gekozen criterium?'],['Conclusie en beperking','Kies een plan met een reden.\nNoem een aanname én een verdelingseffect.']],210,171);
 notes(s,'99–102','Laat leerlingen kort de keten hardop toepassen op het uitlegvoorbeeld. Een ontbrekend gegeven is gericht te benoemen: effect op Q, schade per eenheid, surplus, naleving of uitvoering. Bij een vergelijking oud/nieuw bereken je eerst de volledige rekening per situatie en pas daarna het verschil. Gebruik geen effect waarvoor de bron geen steun geeft. Keer nu terug naar start 46–47: laat eerst de eigen redenering verbeteren met de gegeven theorie.','Welke broninformatie heb je nodig om een stellige conclusie te vermijden?','Een losse voorkeur zonder berekening of criterium is geen onderbouwd advies.','Laat het overzicht staan tijdens het oefenen.');
}
overview('Zelfstandig werken',4);
const targetFooter='§4.2.6 · Opgave 52 · Boekpagina 103';
{
 const s=slide('Opgave 52 · Bron A: Geluid in een wijk',targetFooter);
 text(s,'Een concurrerende dienstenmarkt',60,187,1480,56,38,{bold:true,color:C.blue});
 text(s,'Pc = 50 − 0,5Q           Pp = 10 + 0,5Q',60,260,1480,67,46);
 text(s,'Q is diensten per dag; prijzen zijn euro per dienst.\nElke dienst veroorzaakt € 10 externe schade.',60,345,1480,103,35);
 text(s,'Plan H: producenten dragen € 10 per dienst af.\nPlan G: hoogstens 30 diensten per dag.',60,480,1480,102,38,{bold:true});
 text(s,'Bij G krijgen de kopers met de hoogste betalingsbereidheid de diensten,\ngeleverd door de aanbieders met de laagste kosten;\ntoestemming wordt gratis toegewezen. Beide regels worden nageleefd.',60,638,1480,154,33);
 notes(s,'103','Lees de volledige bron A voordat je naar B gaat. Pc is wat kopers betalen, Pp wat producenten na de heffing overhouden. De heffing, grens, externe schade en aannamen zijn brongegevens. Laat de leerlingen de twee plannen herkennen zonder de vragen al uit te werken.','Welke gegevens horen bij de markt, en welke bij het beleid?','De 30 is hier de gegeven grens van G; het antwoord voor H moet nog worden berekend.','Lees bron B en de vergelijkingstabel.');
}
{
 const s=slide('Opgave 52 · Bron B: Vergelijking per dag',targetFooter);
 text(s,'De tabel geeft de berekende surplusposten vóór uitvoering.\nControle en uitvoering gebruiken bij H € 20 per dag aan middelen\nen bij G € 40. Er zijn geen andere kosten of baten.',60,188,1480,139,34);
 table(s,[['Post (€ per dag)','Plan H','Plan G'],['CS','225','225'],['PS','225','525'],['Overheidsontvangsten','Bereken zelf','0'],['Externe schade','300','300']],60,365,1480,340,[760,360,360],33);
 text(s,'De raad kiest voorlopig het plan met het grootste\nmaatschappelijk surplus na uitvoering.',60,748,1480,87,35,{bold:true,color:C.blue});
 notes(s,'103','Alle tabelwaarden zijn letterlijk uit bron B overgenomen. De open cel blijft open tot de antwoordbespreking. De uitvoeringskosten staan buiten de tabel van surplusposten; leerlingen moeten ze straks afzonderlijk verwerken. Het voorlopige criterium van de raad betreft het maatschappelijk surplus na uitvoering.','Welke post ontbreekt nog, en welk criterium staat in de bron?','De tabel geeft nog niet het eindresultaat na uitvoering.','Laat alle vijf deelvragen zien vóór antwoorden worden besproken.');
}
{
 const s=slide('Opgave 52 · Twee plannen voor hetzelfde probleem',targetFooter,46);
 text(s,'Gebruik de bronnen. Het criterium staat in bron B.',60,187,1480,55,34,{bold:true,color:C.blue});
 const qs=[['a. (2p)','Benoem het marktfalen en leg kort uit hoe elk plan erop aangrijpt.'],['b. (3p)','Bereken voor H Q, Pc, Pp en de overheidsontvangsten.'],['c. (3p)','Bereken voor beide plannen het maatschappelijk surplus na uitvoering.'],['d. (2p)','Adviseer een plan volgens het genoemde criterium. Noem één aanname\ndie voor dit advies belangrijk is.'],['e. (2p)','Waarom kan een producent toch voorkeur hebben voor G?\nBetekent dat dat de raad verkeerd rekent?']];
 qs.forEach(([a,b],i)=>{const y=269+i*112;text(s,a,60,y,160,94,32,{bold:true,color:C.blue});text(s,b,235,y,1305,99,32);});
 notes(s,'103','Dit zijn alle deelvragen en punten uit het boek. Laat de klas eerst eigen antwoorden beschikbaar hebben en geef zo nodig tijd om de bronnen op de voorgaande dia’s opnieuw te lezen. Bespreek a tot en met e pas nadat alle vragen toegankelijk zijn geweest.','Bij welke deelvraag wil je jouw redenering vergelijken?','Ga niet meteen van een beleidsvoorkeur uit; het criterium ligt vast in bron B.','Begin de antwoordbespreking met het probleem en het mechanisme.');
}
{
 const s=slide('Opgave 52a · Probleem en werking',targetFooter);
 text(s,'Niet-vergoede geluidsschade aan derden',60,206,1480,85,47,{bold:true,color:C.blue});
 rows(s,[['Plan H: heffing','De heffingswig maakt de activiteit\nminder aantrekkelijk.'],['Plan G: grens','De hoeveelheid wordt rechtstreeks begrensd.']],364,166);
 text(s,'Beide beperken het aantal schadelijke diensten onder de bronvoorwaarden.',60,758,1480,72,34,{bold:true});
 notes(s,'103','Noem de schade én de derde partij. De private keuzes verwerken de niet-vergoede hinder niet volledig: dat is het marktfalen. H brengt via een heffing kosten in de private afweging; G beperkt het aantal diensten direct. Onder de gegeven naleving leveren beide minder schadelijke activiteit op. Ze nemen niet alle resterende schade weg.','Wie valt buiten de markttransactie?','Een heffing is niet vanzelf een vergoeding voor omwonenden.','Bereken de marktuitkomst bij H.');
}
{
 const s=slide('Opgave 52b · Hoeveelheid bij H',targetFooter);
 rows(s,[['Heffingswig','Pc = Pp + 10'],['Invullen','50 − 0,5Q = 10 + 0,5Q + 10'],['Oplossen','50 − 20 = 0,5Q + 0,5Q\nQ = 30 diensten per dag']],220,169);
 notes(s,'103','Schrijf eerst de relatie tussen de twee prijzen. Vul beide oorspronkelijke functies in. Breng de constanten en Q-termen bijeen: 30 = Q. Dit is de berekende hoeveelheid bij H. Dezelfde 30 staat bij G als hoeveelheidgrens in de bron, maar die gelijkheid vervangt deze berekening niet.','Waarom staat de 10 bij de producentenprijs opgeteld?','Een verkeerde tekenkeuze beschrijft een subsidie.','Bereken beide prijzen en de ontvangsten.');
}
{
 const s=slide('Opgave 52b · Prijzen en ontvangsten',targetFooter);
 rows(s,[['Kopersprijs','Pc = 50 − 0,5 × 30 = € 35 per dienst'],['Producentenprijs','Pp = 10 + 0,5 × 30 = € 25 per dienst'],['Overheidsontvangsten','10 × 30 = € 300 per dag']],210,169);
 text(s,'Controle: 35 − 25 = € 10 per dienst.',60,778,1480,54,36,{bold:true,color:C.green});
 notes(s,'103','Vul Q in beide oorspronkelijke functies in. Pc is 35 en Pp is 25 euro per dienst. De overheid ontvangt 10 euro op elk van de 30 diensten: 300 euro per dag. De prijscontrole levert de heffing op. De schade is eveneens 300 euro per dag, maar is een afzonderlijke bronpost.','Welke eenheid hoort bij de 300?','De producent houdt niet de volledige 35 euro over.','Neem de 300 over in de complete maatschappelijke rekening.');
}
{
 const s=slide('Opgave 52c · Surplus na uitvoering',targetFooter);
 table(s,[['Rekening (€ per dag)','Plan H','Plan G'],['CS','225','225'],['+ PS','225','525'],['+ overheidsontvangsten','300','0'],['− externe schade','300','300'],['Vóór uitvoering','450','450'],['− uitvoeringskosten','20','40'],['Na uitvoering','430','410']],60,205,1480,518,[780,350,350],33);
 text(s,'H: 225 + 225 + 300 − 300 − 20 = € 430 per dag\nG: 225 + 525 + 0 − 300 − 40 = € 410 per dag',60,746,1480,86,32,{bold:true,color:C.blue});
 notes(s,'103','Loop per kolom alle posten langs. H: 225 + 225 + 300 − 300 = 450 vóór uitvoering, minus 20 is 430. G: 225 + 525 + 0 − 300 = 450 vóór uitvoering, minus 40 is 410. Controleer het verschil op twee manieren: beide hebben 450 vóór uitvoering en G gebruikt 20 meer middelen, dus H moet 20 hoger eindigen. Alle bedragen zijn per dag.','Waarom is het verschil vóór uitvoering nul?','Overheidsontvangsten en uitvoering zijn geen onderling uitwisselbare posten.','Vergelijk de uitkomsten met het expliciete criterium.');
}
{
 const s=slide('Opgave 52d · Een begrensd advies',targetFooter);
 text(s,'Kies H bij maximaal maatschappelijk surplus na uitvoering.',60,207,1480,113,44,{bold:true,color:C.blue});
 text(s,'€ 430 − € 410 = € 20 meer per dag',60,360,1480,82,52,{bold:true,color:C.green});
 text(s,'Bijvoorbeeld: dit advies veronderstelt dat beide regels\nworden nageleefd, zoals de bron aangeeft.',60,517,1480,116,38);
 text(s,'Bij andere naleving of uitvoeringskosten kan de rangorde veranderen.',60,718,1480,101,36,{color:C.orange});
 notes(s,'103','Geef advies, rekenonderbouwing en aanname in samenhang. H levert 20 euro per dag meer surplus volgens het genoemde criterium. Een relevante aanname is de gegeven naleving. Ook efficiënte toewijzing bij G of juiste schatting van uitvoering zijn goede antwoorden. Licht toe dat andere naleving de aantallen en daarmee schade en surplus kan veranderen. Het model rechtvaardigt geen onvoorwaardelijk advies.','Welke aanname koppel jij aan jouw conclusie?','Alleen “H is beter” zonder criterium, verschil en aanname is onvolledig.','Bekijk waarom een producent toch G kan kiezen.');
}
{
 const s=slide('Opgave 52e · Het belang van producenten',targetFooter);
 table(s,[['Post (€ per dag)','Plan H','Plan G'],['Producentensurplus','225','525'],['Overheidsontvangsten','300','0']],60,228,1480,277,[780,350,350],37);
 text(s,'G geeft producenten € 300 meer surplus per dag.',60,561,1480,78,44,{bold:true,color:C.blue});
 text(s,'Hun verdelingsbelang verschilt van het maatschappelijke criterium.\nDe raad rekent daardoor niet verkeerd.',60,697,1480,124,37);
 notes(s,'103','Bij G krijgen producenten 525 − 225 = 300 euro per dag meer PS. Bij H vloeit die 300 naar de overheid. Vóór uitvoering is het maatschappelijk surplus gelijk, maar de verdeling verschilt. Dat producenten G aantrekkelijker vinden is dus begrijpelijk. De raad gebruikt het gegeven criterium inclusief uitvoering; een andere voorkeur bewijst geen rekenfout. PS is bovendien niet automatisch winst als er constante kosten zijn.','Kan een berekening kloppen terwijl partijen verschillende voorkeuren hebben?','Noem het hogere PS niet automatisch een maatschappelijke winst of winst na alle vaste kosten.','Laat leerlingen hun antwoord langs de vijf deelvragen controleren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 52');
 const items=[['a · Mechanisme','Derden + schade; leg de werking van H én G uit.'],['b · Rekenroute','Q = 30; Pc = € 35; Pp = € 25; ontvangsten € 300 per dag.'],['c · Hele rekening','H: € 430; G: € 410 per dag, inclusief uitvoering.'],['d · Advies','H: € 20 meer per dag; noem een relevante aanname.'],['e · Verdeling','G geeft € 300 meer PS; ander belang, geen rekenfout.']];
 items.forEach(([a,b],i)=>{const y=205+i*108;text(s,a,60,y,340,80,34,{bold:true,color:C.blue});text(s,b,435,y,1105,90,33);});
 text(s,'Verbeter één ontbrekende stap of onderbouwing in je eigen antwoord.',60,781,1480,52,33,{bold:true});
 notes(s,'103','Laat leerlingen de controle gebruiken om hun eigen antwoorden te verbeteren. Bij b zijn tussenstappen en eenheden nodig; bij c alle posten met hun juiste teken. Bij d moet een bronaanname expliciet verbonden zijn aan de conclusie. Bij e moeten het producentenbelang en de maatschappelijke rekening afzonderlijk benoemd worden.','Welke ontbrekende stap maakt jouw antwoord nu vollediger?','Een eindgetal zonder de gevraagde uitleg is geen volledig antwoord.','Keer terug naar het overzicht voor het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:overviews,nativeTables:tables,sourceCommit},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,`4.2.6 ${title} – presentatie.pptx`),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
