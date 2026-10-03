// Classroom source for Book 1, second edition 2026, §1.1.2.
// HOW TO ADAPT: read the new paragraph and full-book pages; replace the manifest,
// authored teaching examples and target exercise together. Keep overview shared.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const provenance=JSON.parse(await fs.readFile(new URL('./presentation-112-tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('112');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', TITLE='Verhoudingen, percentages en indexcijfers';
const tables=[],slides=[],overviews=[];
const base='https://github.com/meijer1973/4veco-lessen/blob/'+provenance.lessonCommit+'/'+encodeURI(provenance.editionPath)+'/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§1.1.2 '+TITLE,size=52){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,size,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function table(s,values,x,y,w,h,widths,size=34){
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
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, Tweede editie 2026, gedrukte boekpagina ${page}. ${base}boek/Boek_1_Compleet_Tweede_editie.pdf\nBrontekst en antwoordmodel: ${base}bronnen/H1/1.1.2%20Verhoudingen,%20percentages%20en%20indexcijfers%20%E2%80%93%20paragraaf.md ; ${base}bronnen/H1/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Filmclubcontext en gegevens zijn voor deze presentatie ontworpen. De boekpagina onderbouwt de methode, niet deze gegevens.':''}`);
}
function example(title){const s=slide(title);text(s,'Uitlegvoorbeeld — niet uit het boek',60,166,1480,43,28,{color:C.muted});return s;}
function target(title){return slide(title,'§1.1.2 · Opgave 18 · Boekpagina 22');}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 18.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §1.1.2 '+TITLE,undefined,43);
 overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,111,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Per eenheid en aandelen rekenen.\nVeranderingen en indexen berekenen.\nProcenten en punten onderscheiden.',972,244,565,130,30,{name:'overview-goals'});
 rule(s,972,379,568);
 text(s,'Startopdracht',972,400,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 19 · Opgaven 10 en 11\nSteun: theorie p. 13–15\n11: verkennen, later hernemen',972,453,565,120,30,{bold:active===2,name:'overview-start'});
 rule(s,972,587,568);
 text(s,'Huiswerk',972,606,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.1.2 · Maken en nakijken\nBasis: 12, 13 en 14\nZelfstandig: 15, 16 en 17\nDoelopgave: 18',972,664,565,157,30,{bold:active===7,name:'overview-homework'});
 notes(s,'13–16, 19–22',`Laat de dia staan tijdens ${phase.toLowerCase()}. Start: 10–11 (p. 19). Basis: alle drie opgaven 12–14 (p. 19–20). Zelfstandig: 15–17 (p. 21). Doel: 18 (p. 22). Huiswerk is 12, 13, 14, 15, 16, 17 en 18 maken en nakijken. Bonus 19 en herhaling 20–21 zijn extra, niet toegewezen. Verdeel de complete route over meerdere werkmomenten; er is geen gemeten belofte dat dit in één les past.\n\nStartbegeleiding: delen en aftrekken in 10 zijn elementaire rekenbewerkingen, maar hun beheersing is niet vastgesteld. Verwijs bij twijfel over per eenheid naar p. 13; laat vermenigvuldigen terug controleren. 11 vraagt nieuwe leerstof: de oude waarde als basis (p. 14), procentpunten en factor (p. 15). Leerlingen mogen de theorie gebruiken, de juiste regel aanwijzen en twijfel noteren. Beoordeel dit als verkenning. Bij terugkeer naar dit overzicht vóór basiswerk: laat 11 opnieuw proberen, vraag per onderdeel om de basis of eenheid en bespreek onzekerheid. Hernemen van 10 houdt delen en eenheden beschikbaar.`,active===2?'Welke regel helpt je bij de startopdracht?':'Welke opgave is je volgende stap?','Een startopgave met nieuwe kennis is geen bewijs van al beheerste voorkennis.',active===7?'Noteer alle huiswerkopgaven in je agenda.':'Ga verder wanneer de groep klaar is voor de volgende fase.');
}

overview('Startopdracht',2);
{
 const s=slide('De vergelijkingsbasis kiezen');
 const rows=[['Per eenheid of aandeel','Wat staat er onder de deelstreep?'],['Verandering','Wat is de oude waarde?'],['Indexcijfer','Welke vaste basis krijgt 100?'],['Procenten of punten','Bereken je een verschil of een relatieve verandering?']];
 table(s,[['Rekenhandeling','De controle bij elke berekening'],...rows],60,220,1480,505,[610,870],35);
 text(s,'Lees eerst de grootheid, de eenheid en de vergelijking.',60,766,1480,64,38,{bold:true,color:C.blue});
 notes(s,'13–16','Verbind de doelen met opgave 18: a per deelnemer, b prijsverandering, c factor, d–e index en verandering, f–g aandeel en procentpunten. Geen CPI, koopkracht of elasticiteit. De vorige paragraaf toonde per uur naar totaal (p. 7); terug delen en procentuele vergelijkingen worden hier expliciet onderwezen.','Waarmee moet je vergelijken om te weten of iets veel is?','Een groot totaalbedrag zegt zonder aantal nog niets over het bedrag per deelnemer.','Begin met een totaal verdelen.');
}
{
 const s=example('Een bedrag per deelnemer');
 table(s,[['Filmclub: materiaal voor een activiteit','Gegeven'],['Totaal materiaalbedrag','€ 168'],['Aantal deelnemers','24']],60,237,1480,255,[1040,440],36);
 text(s,'Bedrag per deelnemer = totaalbedrag / aantal',60,541,1480,62,40,{bold:true,color:C.blue});
 text(s,'€ 168 / 24 = € 7 per deelnemer',60,644,1480,78,52,{bold:true});
 text(s,'Controle: 24 × € 7 = € 168',60,760,1480,55,36,{color:C.green});
 notes(s,'13','Verdeel het totaal over 24 deelnemers. De uitkomst blijft een geldbedrag, met de eenheid euro per deelnemer. De omgekeerde bewerking is vermenigvuldigen: 24 maal 7 geeft het totaal terug. Dit sluit aan bij per uur maal uren uit §1.1.1, gedrukte p. 7. Delen door nul is niet mogelijk.','Welke hoeveelheid hoort onder de deelstreep?','€ 168 is het totaal; € 7 is het bedrag per deelnemer. Geen percentage berekenen.','Gebruik nu aantallen in teller én noemer.',true);
}
{
 const s=example('Een aandeel en het aantal terugrekenen');
 text(s,'Filmclub: 40 leden van een groep van 160 leerlingen',60,234,1480,67,39,{bold:true});
 text(s,'Aandeel = deel / geheel × 100%',60,347,1480,64,43,{bold:true,color:C.blue});
 text(s,'40 / 160 = 0,25 = 25%',60,437,1480,70,51,{bold:true});
 rule(s,60,548,1480);
 text(s,'Terug naar een aantal: 25% = 25 / 100 = 0,25',60,598,1480,60,38);
 text(s,'0,25 × 160 = 40 leden',60,695,1480,75,50,{bold:true,color:C.green});
 notes(s,'13','Teller en noemer zijn aantallen leerlingen in dezelfde groep. De breuk 0,25 betekent een kwart van het geheel. Voor procenten vermenigvuldig je met 100%. Om van een percentage naar een aantal te gaan, zet je het percentage om naar een decimaal en vermenigvuldig je met het bijbehorende geheel.','Waarom is het antwoord nu geen eurobedrag?','25% is niet 25 leerlingen; het aantal hangt van de groepsgrootte af.','Vergelijk hierna een oude en nieuwe prijs.',true);
}
{
 const s=example('Absolute en procentuele verandering');
 table(s,[['Filmclubpas','Oud','Nieuw'],['Prijs per jaar','€ 16','€ 20']],60,237,1480,180,[800,340,340],36);
 text(s,'Absolute verandering = nieuw − oud',60,466,1480,58,39,{color:C.blue,bold:true});
 text(s,'€ 20 − € 16 = +€ 4 per jaarpas',60,530,1480,65,44,{bold:true});
 text(s,'Procentuele verandering = (nieuw − oud) / oud × 100%',60,648,1480,59,35,{color:C.blue,bold:true});
 text(s,'(20 − 16) / 16 × 100% = +25%',60,723,1480,81,49,{bold:true});
 notes(s,'14','Het verschil is vier euro. De oude zestien euro is de uitgangssituatie: vier is een kwart van zestien. Gebruik op de rekenmachine haakjes rond nieuw min oud. Controle: 25% van 16 is 4; 16 plus 4 is 20.','Waarom deel je door 16 en niet door 20?','Een absoluut verschil staat in de oorspronkelijke eenheid. Het is niet hetzelfde als procentuele verandering.','Draai de vergelijking om en let opnieuw op oud.',true);
}
{
 const s=example('Bij een daling verandert de basis');
 table(s,[['Vergelijking van dezelfde filmclubpas','Oud','Nieuw'],['Terug naar de eerdere prijs','€ 20','€ 16']],60,237,1480,180,[800,340,340],36);
 text(s,'Absolute verandering: € 16 − € 20 = −€ 4',60,471,1480,69,43,{bold:true});
 text(s,'(16 − 20) / 20 × 100% = −20%',60,583,1480,79,51,{bold:true,color:C.blue});
 text(s,'De prijs daalt met 20% van de oude € 20.',60,712,1480,63,39);
 notes(s,'14','De absolute verandering is nu negatief. Absoluut betekent hier oorspronkelijke eenheid, niet altijd positief. De oude waarde van de terugweg is 20. Controle: 20% van 20 is 4; 20 min 4 is 16. De stijging van 16 naar 20 was 25%, de terugweg is een daling van 20%.','Waarom zijn de percentages van de heen- en terugweg verschillend?','Niet delen door 16 omdat die waarde op de vorige dia oud was. Elke vergelijking heeft haar eigen uitgangssituatie.','Gebruik een gegeven percentage om een nieuwe waarde te berekenen.',true);
}
{
 const s=example('Een nieuwe waarde met een factor');
 text(s,'Filmclubpas: € 22 · twee afzonderlijke voorstellen',60,229,1480,60,38,{bold:true});
 table(s,[['Voorstel','Factor','Nieuwe prijs'],['6% stijging','1 + 6 / 100 = 1,06','22 × 1,06 = € 23,32'],['15% korting','1 − 15 / 100 = 0,85','22 × 0,85 = € 18,70']],60,343,1480,307,[420,495,565],34);
 text(s,'Nieuw = oud × factor',60,708,1480,62,46,{bold:true,color:C.blue});
 text(s,'Stijging: factor > 1. Daling: factor < 1.',60,784,1480,46,30);
 notes(s,'15','De oude waarde is 100%: bij een stijging blijft die bestaan en komt 6% erbij. 106% is factor 1,06. Bij 15% korting blijft 85% over: factor 0,85. Dit zijn losse alternatieven op dezelfde 22 euro, geen opeenvolgende wijzigingen. Controleer met de euroverandering: +1,32 of −3,30.','Welke factor hoort bij 100% min 15%?','Alleen maal 0,06 geeft de stijging, niet de nieuwe prijs. Procentpunten vormen geen vermenigvuldigingsfactor.','Leg drie jaarprijzen op één vaste indexbasis.',true);
}
{
 const s=example('Indexcijfers gebruiken één vaste basis');
 text(s,'Filmclubpas · jaar 1 is het basisjaar',60,234,1480,55,39,{bold:true});
 table(s,[['Jaar','Prijs per jaarpas','Prijsindex: jaar 1 = 100'],['1','€ 16','16 / 16 × 100 = 100'],['2','€ 20','20 / 16 × 100 = 125'],['3','€ 22','22 / 16 × 100 = 137,5']],60,333,1480,341,[200,550,730],35);
 text(s,'Index = waarde / basiswaarde × 100',60,727,1480,62,44,{bold:true,color:C.blue});
 notes(s,'16','De vaste basis is steeds de prijs van jaar 1: 16 euro. Index 100 staat voor de hele basiswaarde. Index 137,5 betekent 137,5% van 16 euro, dus 37,5% boven jaar 1. Een index krijgt geen euroteken of procentteken. Vergelijk alleen dezelfde grootheid met dezelfde basis.','Welke noemer blijft in alle drie de rijen staan?','Index 137,5 is geen prijs van € 137,50 en zegt niet hoeveel de prijs sinds jaar 2 steeg.','Maak expliciet onderscheid tussen indexbasis en oude waarde van een verandering.',true);
}
{
 const s=example('Indexpunten en procentuele verandering');
 table(s,[['Filmclubpas','Jaar 2','Jaar 3'],['Prijsindex: jaar 1 = 100','125','137,5']],60,236,1480,188,[800,340,340],36);
 text(s,'Verschil: 137,5 − 125 = 12,5 indexpunten',60,479,1480,65,44,{bold:true});
 text(s,'Verandering vanaf jaar 2: oud = 125',60,591,1480,55,36,{bold:true,color:C.blue});
 text(s,'(137,5 − 125) / 125 × 100% = 10%',60,681,1480,79,47,{bold:true});
 notes(s,'16','Beide indexcijfers hebben dezelfde basis, dus je mag ze vergelijken. Voor een indexverschil trek je af. Voor de relatieve verandering tussen jaar 2 en 3 deel je het verschil door 125, de oude index. De indexbasis blijft jaar 1; de uitgangssituatie van deze verandering is jaar 2. Controle met bedragen: (22−20)/20×100%=10%.','Waarom staat onder deze deelstreep geen 100?','12,5 indexpunten zijn hier 10%, niet 12,5%.','Reken terug van een index naar euro.',true);
}
{
 const s=example('Van index terug naar een bedrag');
 text(s,'Filmclubpas · basisprijs € 16 · prijsindex 137,5',60,240,1480,66,39,{bold:true});
 text(s,'Bedrag = basiswaarde × index / 100',60,372,1480,69,46,{bold:true,color:C.blue});
 text(s,'€ 16 × 137,5 / 100 = € 22',60,492,1480,87,55,{bold:true});
 text(s,'Controle: 22 / 16 × 100 = 137,5',60,676,1480,70,40,{color:C.green});
 notes(s,'16','Index 137,5 betekent factor 1,375 ten opzichte van de basisprijs. Daarom vermenigvuldig je 16 met 137,5 en deel je door 100. Deze terugweg is nodig bij zelfstandige opgave 16b. Bereken expliciet en controleer door de index opnieuw te vinden.','Welke geldwaarde moet bekend zijn om terug te rekenen?','Zonder basisprijs kun je van een index alleen geen eurobedrag maken.','Vergelijk nu deelname: elk jaar heeft zijn eigen groep.',true);
}
{
 const s=example('Een aandeel gebruikt het geheel van dat jaar');
 table(s,[['Filmclub','Jaar 1','Jaar 3'],['Alle leerlingen in de groep','160','200'],['Leden van de filmclub','40','60'],['Aandeel leden','40 / 160 × 100% = 25%','60 / 200 × 100% = 30%']],60,237,1480,373,[580,450,450],33);
 text(s,'Vergelijk leden met alle leerlingen van hetzelfde jaar.',60,685,1480,101,40,{bold:true,color:C.blue});
 notes(s,'13, 15, 18','In jaar 1 vormen 40 leden een deel van 160 leerlingen. In jaar 3 vormen 60 leden een deel van 200. Benoem teller en noemer per jaar voordat je rekent. De groepsgrootte is veranderd; een vastgehouden oude noemer geeft een ander, onjuist aandeel voor jaar 3.','Waarom gebruik je bij 60 leden niet 160 als noemer?','Groei van het aantal leden en groei van het aandeel zijn verschillende vergelijkingen.','Bereken het verschil en de relatieve groei van het aandeel.',true);
}
{
 const s=example('Procentpunten en procenten bij een aandeel');
 text(s,'Filmclub: aandeel leden van 25% naar 30%',60,238,1480,70,43,{bold:true});
 table(s,[['Wat vergelijk je?','Berekening','Uitkomst'],['Verschil tussen percentages','30 − 25','+5 procentpunten'],['Groei t.o.v. het oude aandeel','(30 − 25) / 25 × 100%','+20%']],60,366,1480,290,[530,520,430],33);
 text(s,'Hetzelfde aandeel; twee verschillende beschrijvingen.',60,727,1480,72,39,{bold:true,color:C.blue});
 notes(s,'15, 18','Een procentpunt is het verschil tussen twee percentages. De relatieve groei vraagt vervolgens verschil gedeeld door oud. De 5 procentpunten zijn een vijfde van de oude 25%. Controle: 25% maal 1,20 geeft 30%.','Kan een aandeel tegelijk 5 procentpunten en 20% stijgen?','Schrijf niet 5% als alleen het verschil tussen percentages is berekend.','Laat zien waarom het aantal weer anders groeit.',true);
}
{
 const s=example('Groepsgrootte en aandeel veranderen samen');
 table(s,[['Filmclub: vergelijking','Groep','Aandeel','Aantal leden'],['Oude situatie','160','25%','0,25 × 160 = 40'],['Alleen hoger aandeel','160','30%','0,30 × 160 = 48'],['Alleen grotere groep','200','25%','0,25 × 200 = 50'],['Beide veranderingen','200','30%','0,30 × 200 = 60']],60,233,1480,395,[570,200,200,510],32);
 text(s,'Groei van het aantal: (60 − 40) / 40 × 100% = 50%',60,688,1480,72,41,{bold:true,color:C.blue});
 text(s,'De grotere groep én het hogere aandeel vergroten het aantal.',60,782,1480,44,30);
 notes(s,'13, 15, 18','De twee middelste rijen zijn denkvergelijkingen, geen extra jaren. Houd eerst het geheel gelijk en verander het aandeel; houd dan het aandeel gelijk en verander het geheel. Zet percentages eerst om naar decimalen. In de werkelijke nieuwe situatie verandert beide: 60 leden. Beide veranderingen versterken elkaar. Dit demonstreert de verandering van representatie aandeel naar aantal die opgave 14 vraagt, met eigen cijfers.','Wat houd je gelijk om alleen de invloed van het aandeel te bekijken?','De toename van het aandeel met 20% betekent niet automatisch 20% meer leden wanneer ook het geheel verandert.','Controleer of de drie vergelijkingen uit elkaar blijven.',true);
}
{
 const s=example('Korte controle: welke groei?');
 text(s,'Filmclub: 40 van 160 leerlingen → 60 van 200 leerlingen',60,237,1480,80,40,{bold:true});
 text(s,'“Het aandeel én het aantal zijn met 5% gestegen.”',60,388,1480,140,49,{bold:true,color:C.blue});
 text(s,'Beoordeel beide delen.\nBenoem bij elke berekening de oude waarde.',60,615,1480,150,42);
 notes(s,'13–16, 18','Laat leerlingen kort individueel denken en een basis benoemen. Dit is een begripscheck op het uitlegvoorbeeld, geen nieuwe huiswerkopgave. De volgende dia geeft de uitwerking.','Welk oud getal hoort bij het aandeel en welk bij het aantal?','Dezelfde context maakt aandeel en aantal nog niet dezelfde grootheid.','Toon de drie juiste uitspraken.',true);
}
{
 const s=example('De drie juiste vergelijkingen');
 table(s,[['Vergelijking','Berekening','Uitkomst'],['Aandeel: verschil','30 − 25','+5 procentpunten'],['Aandeel: relatieve groei','(30 − 25) / 25 × 100%','+20%'],['Aantal: relatieve groei','(60 − 40) / 40 × 100%','+50%']],60,264,1480,380,[520,570,390],33);
 text(s,'Kies eerst de grootheid, daarna de passende basis.',60,720,1480,73,41,{bold:true,color:C.blue});
 notes(s,'13–16, 18','Beide delen van de uitspraak waren onjuist. Laat een leerling elke rij in woorden zeggen. Herstel een verkeerde noemer voordat je extra berekeningen vraagt. Laat nu opgave 11 nogmaals proberen met de opgedane uitleg en bespreek onzekerheden vóór het basiswerk.','Welke rij beschrijft het aantal mensen?','Een antwoord zonder procenten of punten blijft dubbelzinnig.','Keer terug naar het overzicht; herneem start 11 en begin daarna bij 12.',true);
}
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 18 · Een workshop voor scholieren');
 text(s,'Een cultureel centrum vergelijkt zijn workshopprijs en het aandeel leerlingen dat deelneemt. Gebruik voor de prijsindex jaar 1 als basis. Alle bedragen en aantallen zijn voor deze opgave gegeven.',60,186,1480,154,35);
 text(s,'In jaar 3 betaalt het centrum € 216 aan materiaal voor de 36 deelnemers. Na jaar 3 wil het de workshopprijs met 8% verhogen.',60,358,1480,106,35,{bold:true});
 table(s,[['Gegeven','Jaar 1','Jaar 2','Jaar 3'],['Prijs per workshop','€ 10','€ 12','€ 15'],['Leerlingen die konden deelnemen','120','150','150'],['Werkelijke deelnemers','24','30','36']],60,500,1480,307,[700,260,260,260],33);
 notes(s,'22','Dit is de volledige context en gegevenstabel van doelopgave 18 uit de tweede editie. Bespreek pas na eigen poging. De drie volgende dia’s tonen alle vragen a–g zonder oplossingen. Laat de groep de boekpagina openhouden zodat alle gegevens beschikbaar blijven.','Welke rij is de noemer bij een deelnamepercentage?','Materiaalbedrag en workshopprijs zijn verschillende bedragen.','Toon eerst a–c, dan d–e en f–g voordat een antwoord verschijnt.');
}
{
 const s=target('Opgave 18 · Vragen a, b en c');
 const a=[['a','Bereken het materiaalbedrag per deelnemer in jaar 3.'],['b','Bereken de absolute en procentuele prijsverandering\nvan jaar 1 naar jaar 2.'],['c','Bereken de aangekondigde workshopprijs na jaar 3.']];
 a.forEach((r,i)=>{const y=210+i*200;text(s,r[0]+')',60,y,70,65,42,{bold:true,color:C.blue});text(s,r[1],165,y,1375,136,41);});
 notes(s,'22','Alle vraagteksten zijn afkomstig uit opgave 18. De gegevens staan op de voorgaande dia en p. 22: €216 voor 36, prijzen 10/12/15, stijging na jaar 3 8%. Nog geen antwoorden onthullen.','Wat is de grootheid bij elk onderdeel?','Bij c is de prijs van jaar 3 het uitgangspunt.','Toon ook de indexvragen.');
}
{
 const s=target('Opgave 18 · Vragen d en e');
 text(s,'d) Bereken de prijsindexcijfers van jaar 2 en jaar 3.',60,221,1480,135,42);
 rule(s,60,405,1480);
 text(s,'e) Bereken met die indexcijfers de prijsverandering van jaar 2 naar jaar 3 in indexpunten én in procenten.',60,470,1480,214,42);
 notes(s,'22','Behoud de twee gevraagde uitkomsten van e. Jaar 1 is de indexbasis, jaar 2 het begin van de verandering in e. Onthul nog geen uitkomsten.','Welke twee tijdsvergelijkingen staan hier?','Een berekening met geldbedragen alleen beantwoordt niet het verzoek om met de indexcijfers te rekenen.','Toon ook f en g voordat de uitwerking begint.');
}
{
 const s=target('Opgave 18 · Vragen f en g');
 text(s,'f) Bereken het deelnamepercentage in jaar 1 en jaar 3. Hoeveel procentpunten is de verandering?',60,218,1480,170,42);
 rule(s,60,427,1480);
 text(s,'g) Een bericht luidt: “Het aandeel deelnemers is met 4% gestegen.” Beoordeel dit bericht met een berekening.',60,492,1480,218,42);
 notes(s,'22','Dit sluit alle zeven subvragen af. De claim uit g blijft exact behouden. Leerlingen hebben nu context, gegevens en elke vraag gezien zonder antwoorden.','Gaat het bericht over het aandeel of het aantal deelnemers?','Een oordeel zonder berekening is bij g niet volledig.','Begin nu bij het materiaalbedrag van a.');
}
{
 const s=target('Opgave 18a · Materiaal per deelnemer');
 text(s,'Jaar 3: € 216 materiaal voor 36 deelnemers',60,217,1480,74,42,{bold:true});
 text(s,'Bedrag per deelnemer = totaal / aantal',60,359,1480,65,44,{bold:true,color:C.blue});
 text(s,'€ 216 / 36 = € 6 per deelnemer',60,479,1480,91,55,{bold:true});
 text(s,'Controle: 36 × € 6 = € 216',60,698,1480,69,41,{color:C.green});
 notes(s,'22','Verdeel 216 euro over alle 36 deelnemers van jaar 3. De uitkomst is euro per deelnemer; het totaal blijft 216 euro. Lees de eenheid hardop en controleer terug.','Waarom deel je niet door de 150 leerlingen?','Het materiaal is in de vraag gekoppeld aan de werkelijke deelnemers.','Vergelijk de workshopprijzen van jaar 1 en 2.');
}
{
 const s=target('Opgave 18b · Prijsverandering');
 table(s,[['Prijs per workshop','Jaar 1: oud','Jaar 2: nieuw'],['Bedrag','€ 10','€ 12']],60,214,1480,180,[660,410,410],35);
 text(s,'Absoluut: € 12 − € 10 = +€ 2 per workshop',60,447,1480,65,43,{bold:true});
 text(s,'Procentueel: (nieuw − oud) / oud × 100%',60,563,1480,65,40,{color:C.blue,bold:true});
 text(s,'(12 − 10) / 10 × 100% = +20%',60,656,1480,80,52,{bold:true});
 text(s,'Controle: 20% van € 10 is € 2.',60,784,1480,47,32,{color:C.green});
 notes(s,'22','Oud is jaar 1: 10 euro. Nieuw is jaar 2: 12 euro. Het verschil 2 euro is een vijfde van de oude prijs. Zowel absoluut als procentueel is gevraagd.','Wat is de oude waarde in deze vergelijking?','Delen door de nieuwe 12 geeft niet de gevraagde verandering vanaf jaar 1.','Gebruik bij c een nieuw beginbedrag: de prijs van jaar 3.');
}
{
 const s=target('Opgave 18c · De aangekondigde prijs');
 text(s,'Prijs in jaar 3: € 15 · aangekondigde stijging: 8%',60,217,1480,73,41,{bold:true});
 text(s,'Factor = 1 + 8 / 100 = 1,08',60,360,1480,70,46,{bold:true,color:C.blue});
 text(s,'Nieuwe prijs = € 15 × 1,08 = € 16,20',60,485,1480,90,51,{bold:true});
 text(s,'Controle: 8% van € 15 = € 1,20; € 15 + € 1,20 = € 16,20.',60,693,1480,116,36,{color:C.green});
 notes(s,'22','De wijziging is aangekondigd na jaar 3, dus 15 euro is de uitgangswaarde. De 100% oude prijs plus 8% wordt factor 1,08. Dit is een aangekondigde nieuwe prijs, geen vierde jaar met geobserveerde gegevens.','Welke prijs blijft voor 100% meetellen?','15 maal 0,08 is alleen de verhoging.','Keer voor de prijsindex terug naar de vaste basis van jaar 1.');
}
{
 const s=target('Opgave 18d · De prijsindexcijfers');
 text(s,'Index = prijs / basisprijs × 100 · jaar 1 = 100',60,208,1480,72,42,{bold:true,color:C.blue});
 table(s,[['Jaar','Prijs per workshop','Berekening','Prijsindex'],['1 (basis)','€ 10','10 / 10 × 100','100'],['2','€ 12','12 / 10 × 100','120'],['3','€ 15','15 / 10 × 100','150']],60,343,1480,366,[260,400,540,280],34);
 text(s,'Elke index vergelijkt met dezelfde basisprijs van € 10.',60,765,1480,58,36,{bold:true});
 notes(s,'22','Jaar 2 is 120% van de basisprijs en krijgt index 120; jaar 3 krijgt index 150. De basisrij is toegevoegd als uitleg, de twee gevraagde indexen zijn jaar 2 en 3. Controleer: 10 maal 1,20 is 12 en 10 maal 1,50 is 15.','Welke geldwaarde blijft in de noemer staan?','Jaar 3 door jaar 2 delen geeft geen index met jaar 1 als basis.','Bereken met de twee indexen de verandering van jaar 2 naar 3.');
}
{
 const s=target('Opgave 18e · Verandering met indexcijfers');
 text(s,'Jaar 2: index 120 → jaar 3: index 150',60,218,1480,70,44,{bold:true});
 text(s,'150 − 120 = 30 indexpunten',60,349,1480,81,51,{bold:true});
 text(s,'(150 − 120) / 120 × 100% = 25%',60,500,1480,81,50,{bold:true,color:C.blue});
 text(s,'Controle met prijzen: (15 − 12) / 12 × 100% = 25%.',60,689,1480,102,37,{color:C.green});
 notes(s,'22','Het verschil is 30 indexpunten. Voor de relatieve groei is de oude index 120 de noemer. Het prijsniveau van jaar 1 blijft de indexbasis, maar de vraag vergelijkt jaar 2 met jaar 3. De controle met bedragen bevestigt de uitkomst.','Waarom is 30 indexpunten hier geen 30%?','De gevraagde groei is niet de 50% ten opzichte van jaar 1.','Gebruik voor de deelname een eigen geheel per jaar.');
}
{
 const s=target('Opgave 18f · Deelnamepercentages');
 table(s,[['','Jaar 1','Jaar 3'],['Werkelijke deelnemers','24','36'],['Leerlingen die konden deelnemen','120','150'],['Aandeel = deel / geheel × 100%','24 / 120 × 100% = 20%','36 / 150 × 100% = 24%']],60,208,1480,368,[600,440,440],32);
 text(s,'Verschil: 24 − 20 = 4 procentpunten',60,645,1480,75,47,{bold:true,color:C.blue});
 text(s,'Controle: 0,20 × 120 = 24 en 0,24 × 150 = 36.',60,770,1480,52,34,{color:C.green});
 notes(s,'22','Gebruik bij elk jaar de leerlingen die in datzelfde jaar konden deelnemen. In jaar 1 is 24/120 20%; in jaar 3 is 36/150 24%. Het verschil tussen percentages wordt uitgedrukt in procentpunten.','Welke noemer hoort bij de 36 deelnemers?','36/120 zou twee verschillende jaren combineren.','Beoordeel het bericht door de 4 procentpunten met het oude aandeel te vergelijken.');
}
{
 const s=target('Opgave 18g · Het bericht beoordelen');
 text(s,'“Het aandeel deelnemers is met 4% gestegen.”',60,205,1480,108,44,{bold:true});
 text(s,'Relatieve verandering = (nieuw − oud) / oud × 100%',60,359,1480,60,36,{color:C.blue,bold:true});
 text(s,'(24 − 20) / 20 × 100% = 20%',60,452,1480,86,53,{bold:true});
 text(s,'Het bericht is onjuist.',60,600,1480,61,44,{bold:true,color:C.orange});
 text(s,'Het aandeel steeg met 4 procentpunten,\nofwel met 20% ten opzichte van het oude aandeel.',60,691,1480,133,40);
 notes(s,'22','De oude 20% is de basis; 4 is een vijfde daarvan. Daarom is de relatieve groei 20%. Het bericht verwart procentpunten met procenten. Controle: 20% maal 1,20 is 24%. Een verandering van het aantal deelnemers is niet gevraagd in dit bericht.','Welke berekening maakt je oordeel controleerbaar?','De noemer 24 hoort bij de nieuwe situatie, niet bij de gevraagde groei vanaf jaar 1.','Controleer het eigen antwoord op volledigheid.');
}
{
 const s=target('Antwoordcontrole bij opgave 18');
 const a=[['a–c · Bedragen','Per deelnemer, oude prijs en nieuwe prijs hebben de juiste eenheid.'],['d–e · Indexen','Vaste basis jaar 1; groei vanaf jaar 2 gebruikt index 120.'],['f–g · Aandelen','Elk jaar zijn eigen geheel; 4 procentpunten is 20% groei.']];
 a.forEach((r,i)=>{const y=223+i*174;text(s,r[0],60,y,560,73,39,{bold:true,color:C.blue});text(s,r[1],660,y,880,116,37);});
 text(s,'Verbeter een ontbrekende stap, eenheid of verklaring.',60,781,1480,54,36,{bold:true});
 notes(s,'22','Controleer alle antwoorden: a 6 euro per deelnemer; b +2 euro per workshop en +20%; c 16,20 euro; d 120 en 150; e +30 indexpunten en +25%; f 20%, 24%, +4 procentpunten; g onjuist, +20% relatieve groei. Reken tussendoor met ongeronde waarden; geld waar nodig op centen, percentages en indexen waar nodig op twee decimalen.','Welke onderbouwing ontbrak nog in je eigen werk?','Een juist getal zonder gevraagde eenheid of redenering is nog geen volledig antwoord.','Laat het overzicht staan voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...provenance,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:[]},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'1.1.2 '+TITLE+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:p.slides.items.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
