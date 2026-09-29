// HOW TO ADAPT: inspect the new paragraph, its answers and printed book pages first.
// Reuse the layout helpers, but author a separate teaching example and complete target discussion.
// Runtime paths come from the installed presentation runtime; no local paths belong here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse(await fs.readFile(path.join(HERE,'presentation-221.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('221');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], slides=[], overviews=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/${facts.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
const title='§2.2.1 Prijselasticiteit';
const exampleLabel='Uitlegvoorbeeld — niet uit het boek';
const targetFooter=title+' · Opgave 7 · Boekpagina 42';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,86,label.startsWith('Deze les:')?48:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition,{authored=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chatuitgave 2026, revisie 21 september 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\n${authored?'Uitlegvoorbeeld — niet uit het boek. KleiKamer, FotoFlex en alle voorbeeldgegevens zijn voor deze presentatie bedacht. De boekpagina’s zijn uitsluitend de bron voor de methode.':`Antwoordmodel: ${source}bronnen/H2/${encodeURIComponent('2.2 Elasticiteit – antwoorden.md')}`}\n${extra}`);
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
function example(s){text(s,exampleLabel,60,179,1480,45,28,{color:C.muted});}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 `Bespreken van de doelopgave: opgave ${facts.assignment.target}.`,
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{
  const col=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Procenten en Ev berekenen.\nVraag indelen en vergelijken.\nEen mogelijke reden uitleggen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,`Pagina ${facts.sourcePrintedPages.start}\nOpgaven ${facts.assignment.start.join(' en ')}`,972,459,565,95,33,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.2.1 Prijselasticiteit\nBasis: 3 en 4\nZelfstandig: 5 en 6\nDoelopgave: 7\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'40–42',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start: 1 en 2 op pagina 40. Basis: 3 op pagina 40 en 4 op pagina 41. Zelfstandig: 5 en 6 op pagina 41. Doel: 7 op pagina 42. Huiswerk: 3, 4, 5, 6 en 7 maken en nakijken. Bonus 8 en herhaling 9–10 zijn extra. Plan aanvullende werktijd als de hele route niet binnen deze les past.`,active===2?'Welke oude waarde heb je nodig bij de startopdracht?':'Bij welke opgave wil je hulp?', 'Een negatieve elasticiteit is niet automatisch een zwakke reactie.',active===7?'Laat leerlingen hun huiswerk in de agenda noteren.':'Ga verder als de klas aan de volgende fase toe is.',{extra:'Startantwoorden alleen voor de docent: 1a (10−8)/8×100%=+25%; 1b (108−120)/120×100%=−10%. 2a −1<−0,4<0, prijsinelastisch. 2b Bij −2 is de procentuele reactie sterker dan bij −0,4. Gedrukte pagina 40 is fysieke PDF-pagina 42.'});
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Berekenen','Je gebruikt oude waarden voor %ΔP en %ΔQv.\nDaarna bereken je Ev.'],['Indelen en uitleggen','Je vergelijkt Ev mét teken met −1 en 0.'],['Prijsgevoeligheid vergelijken','Je legt uit waar Qv procentueel sterker reageert.'],['Een verklaring beoordelen','Je onderscheidt een mogelijke reden van een bewezen oorzaak.']];
 rows.forEach((r,i)=>{const y=205+i*151;text(s,r[0],60,y,600,100,37,{bold:true,color:C.blue});text(s,r[1],695,y,840,110,35);if(i<3)rule(s,60,y+126,1480);});
 notes(s,'36–39','De vier doelen komen terug in doelopgave 7. Herhaal dat P de eigen prijs is en Qv de gevraagde hoeveelheid. Elasticiteit vergelijkt relatieve veranderingen en geen losse eurobedragen of aantallen.','Wat maakt een prijsverandering groot of klein?','Een daling met tien klanten betekent zonder beginhoeveelheid nog geen sterke reactie.','Maak de methode zichtbaar met een eigen voorbeeld.');
}
{
 const s=slide('Een prijswijziging bij KleiKamer');example(s);
 text(s,'Bezoeken aan een keramiekatelier',60,256,1480,60,39,{bold:true,color:C.blue});
 table(s,[['Grootheid','Oud','Nieuw'],['P (€ per bezoek)','40','44'],['Qv (bezoeken per maand)','300','282']],60,355,1480,296,[740,370,370],36);
 text(s,'Andere vraagfactoren blijven gelijk: ceteris paribus.',60,718,1480,90,39,{bold:true});
 notes(s,'36–37','KleiKamer verhoogt de prijs. We nemen in dit bedachte voorbeeld aan dat inkomen, voorkeuren en andere vraagfactoren gelijk blijven. De eigen prijs verandert, dus we onderzoeken een beweging langs dezelfde vraaglijn. Vergelijk niet 4 euro met 18 bezoeken: zet beide veranderingen om in procenten.','Waarom kun je € 4 stijging niet direct vergelijken met 18 bezoeken minder?','Verschillende grootheden en eenheden zijn pas als relatieve veranderingen vergelijkbaar.','Bereken eerst de procentuele prijsverandering.',{authored:true});
}
{
 const s=slide('De procentuele prijsverandering');example(s);
 text(s,'P: € 40 wordt € 44 per bezoek',60,260,1480,75,44,{bold:true,color:C.blue});
 text(s,'%ΔP = (nieuw − oud) / oud × 100%',60,387,1480,80,45);
 text(s,'= (44 − 40) / 40 × 100%',60,492,1480,82,48);
 text(s,'= +10%',60,615,1480,95,62,{bold:true,color:C.blue});
 text(s,'De € 4 stijging is 10% van de oude prijs.',60,763,1480,65,37);
 notes(s,'37','De verandering is 44−40=4 euro per bezoek. Deel door de oude prijs 40, niet door 44. Vermenigvuldig 0,10 met 100% om +10% te krijgen. Het plusteken benoemt de stijging. Bewaar eventuele tussenuitkomsten ongerond.','Welk bedrag is hier de vergelijkingsbasis?','Delen door 44 gebruikt de nieuwe waarde en geeft een andere meting.','Gebruik precies dezelfde formule voor Qv.',{authored:true});
}
{
 const s=slide('De procentuele hoeveelheidsverandering');example(s);
 text(s,'Qv: 300 wordt 282 bezoeken per maand',60,260,1480,75,44,{bold:true,color:C.green});
 text(s,'%ΔQv = (nieuw − oud) / oud × 100%',60,387,1480,80,45);
 text(s,'= (282 − 300) / 300 × 100%',60,492,1480,82,48);
 text(s,'= −6%',60,615,1480,95,62,{bold:true,color:C.green});
 text(s,'De 18 bezoeken minder zijn 6% van de oude hoeveelheid.',60,763,1480,65,37);
 notes(s,'37','Nieuw min oud is 282−300=−18 bezoeken per maand. Deel door 300 en vermenigvuldig met 100%: −6%. Dezelfde oude-waardemethode geldt voor beide percentages. Controle: 6% van 300 is 18, en 300−18=282.','Waar komt het minteken vandaan?','Draai nieuw en oud niet om om van de daling een positief getal te maken.','Deel nu de reactie van de hoeveelheid door de prijsverandering.',{authored:true});
}
{
 const s=slide('Prijselasticiteit van de vraag');example(s);
 text(s,'Ev = %ΔQv / %ΔP',60,270,1480,88,58,{bold:true,color:C.blue});
 text(s,'Ev = −6% / +10% = −0,6',60,404,1480,90,57,{bold:true});
 rule(s,60,547,1480);
 text(s,'De hoeveelheid daalt procentueel 0,6 maal zo sterk\nals de prijs stijgt.',60,598,1480,140,42,{bold:true,color:C.green});
 text(s,'Ev heeft geen eenheid en geen procentteken.',60,784,1480,50,34);
 notes(s,'36–37','De reactie staat boven de breuk en de eigen prijsverandering eronder. Deel −6 door +10: −0,6. Negatief betekent dat P en Qv tegengesteld veranderen. In deze meting hoort bij 1% prijsstijging gemiddeld 0,6% hoeveelheidsdaling. Dit is geen gegarandeerde voorspelling voor een volgende prijswijziging. Gebruik positieve oude P en Qv; bij %ΔP=0 is deze verhouding niet te berekenen.','Waarom krijgt Ev geen procentteken?','−0,6 betekent niet een daling van 0,6 bezoek of een daling van 0,6% in totaal. De gemeten totale daling is 6%.','Vergelijk de uitkomst met −1 en 0.',{authored:true});
}
{
 const s=slide('De vraag indelen');
 table(s,[['Ev','Indeling','Qv reageert procentueel…'],['−1 < Ev < 0','Prijsinelastisch','minder sterk dan P'],['Ev = −1','Unitair elastisch','even sterk als P'],['Ev < −1','Prijselastisch','sterker dan P'],['Ev = 0','Volkomen prijsinelastisch','niet: Qv blijft gelijk']],60,211,1480,443,[370,520,590],32);
 text(s,'KleiKamer: −1 < −0,6 < 0',60,707,1480,69,45,{bold:true,color:C.blue});
 text(s,'Prijsinelastisch: Qv reageert, maar procentueel minder sterk.',60,785,1480,55,34);
 notes(s,'38','Lees de grenzen inclusief het minteken. In de gewone gevallen in deze paragraaf is Ev negatief. −0,6 ligt tussen −1 en 0. Bij −1 zijn beide procentuele veranderingen even groot, met tegengestelde richting. Bij 0 verandert Qv niet ondanks een prijsverandering. De laatste twee regels zijn een grensgeval en een classificatie, geen losse boekopgaven.','In welke rij past −0,6 en waarom?','Negatief is niet hetzelfde als prijsinelastisch. Prijsinelastisch betekent meestal wel een reactie.','Vergelijk KleiKamer met een andere aanbieder.',{authored:true});
}
{
 const s=slide('Prijsgevoeligheid vergelijken');example(s);
 table(s,[['Aanbieder','Ev','Vergelijking','Indeling'],['KleiKamer','−0,6','−1 < −0,6 < 0','Prijsinelastisch'],['FotoFlex','−1,4','−1,4 < −1','Prijselastisch']],60,276,1480,303,[430,230,440,380],33);
 text(s,'FotoFlex reageert procentueel sterker op de eigen prijs.',60,636,1480,105,44,{bold:true,color:C.blue});
 text(s,'Absolute aantallen verloren klanten kun je niet vergelijken.',60,786,1480,50,33);
 notes(s,'38–39','Bij FotoFlex is in een afzonderlijke fictieve prijsverhoging Ev=−1,4 gemeten. Qv reageert er per procent prijsverandering sterker dan bij −0,6. Gebruik het woord procentueel. De beginhoeveelheid en prijsstap bij FotoFlex ontbreken, dus je kunt niet concluderen dat FotoFlex meer klanten in absolute aantallen verliest.','Waarom is −1,4 een sterkere reactie dan −0,6?','Het kleinere negatieve getal kan juist een sterkere relatieve reactie aangeven.','Zoek een mogelijke economische verklaring, zonder een oorzaak als feit te presenteren.',{authored:true});
}
{
 const s=slide('Een mogelijke verklaring');example(s);
 text(s,'FotoFlex: misschien zijn vergelijkbare fotoworkshops\nmakkelijk beschikbaar.',60,284,1480,133,44,{bold:true,color:C.blue});
 text(s,'Overstappen wordt dan makkelijker. Dat kan passen\nbij de sterkere prijsreactie.',60,462,1480,139,42);
 rule(s,60,647,1480);
 text(s,'De cijfers meten de reactie. Ze bewijzen deze oorzaak niet.',60,705,1480,121,41,{bold:true,color:C.orange});
 notes(s,'38–39','Geef de causale redenering: meer geschikte alternatieven maakt overstappen bij een prijsstijging makkelijker, zodat Qv sterker kan dalen. We weten hier niet hoeveel alternatieven er werkelijk zijn. Ook uitstelbaarheid of een groter budgetaandeel kan een mogelijke verklaring zijn. Houd inkomen als vraagfactor gelijk: er wordt geen inkomenselasticiteit berekend.','Welk deel van deze uitleg is gemeten, en welk deel is een mogelijkheid?','Bedenk geen bewezen klantmotieven op basis van alleen twee elasticiteiten.','Controleer of het teken ook bij een prijsdaling duidelijk is.',{authored:true});
}
{
 const s=slide('Korte controle: een prijsdaling');example(s);
 text(s,'Een apart scenario bij KleiKamer',60,248,1480,60,40,{bold:true,color:C.blue});
 table(s,[['Grootheid','Oud','Nieuw'],['P (€ per bezoek)','40','36'],['Qv (bezoeken per maand)','300','345']],60,347,1480,265,[740,370,370],34);
 text(s,'Bereken %ΔP, %ΔQv en Ev. Welke indeling past?',60,681,1480,73,40,{bold:true});
 text(s,'Kan Ev negatief zijn terwijl Qv stijgt?',60,784,1480,53,37);
 notes(s,'37–38','Laat leerlingen kort rekenen. Dit is een nieuw, afzonderlijk scenario vanuit de oude 40 euro en 300 bezoeken. Het is niet het terugdraaien van de eerste wijziging. Andere vraagfactoren blijven gelijk. De volgende dia geeft de oplossing; deze controle voegt geen huiswerk toe.','Welk teken krijgt de noemer bij een prijsdaling?','Kijk bij het teken naar teller én noemer, niet alleen naar Qv.','Bespreek de berekening nadat leerlingen hebben gereageerd.',{authored:true});
}
{
 const s=slide('Prijsdaling: het teken en de sterkte');example(s);
 text(s,'%ΔP = (36 − 40) / 40 × 100% = −10%',60,271,1480,80,45,{color:C.blue});
 text(s,'%ΔQv = (345 − 300) / 300 × 100% = +15%',60,397,1480,80,43,{color:C.green});
 text(s,'Ev = +15% / −10% = −1,5',60,532,1480,89,55,{bold:true});
 text(s,'−1,5 < −1: prijselastische vraag',60,664,1480,70,43,{bold:true,color:C.orange});
 text(s,'P daalt en Qv stijgt: de richting blijft tegengesteld.',60,782,1480,57,37);
 notes(s,'37–38','Positief gedeeld door negatief is negatief. Het aantal bezoeken stijgt met 15%, de prijs daalt met 10%. Qv reageert procentueel anderhalf maal zo sterk als P. Controle: 10% van 40 is 4 en 15% van 300 is 45. Dit andere scenario heeft een andere elasticiteit; veronderstel geen constante elasticiteit bij elke prijs.','Waarom betekent een negatieve Ev niet dat Qv altijd daalt?','Gebruik niet −15% voor een hoeveelheidsstijging om een verwacht minteken te forceren.','Laat het overzicht staan tijdens de oefenroute.',{authored:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 7 · Bioscoop Nova en StreamNow',targetFooter);
 text(s,'Bioscoop Nova verhoogt de ticketprijs.',60,193,1480,65,40,{bold:true});
 table(s,[['Bioscoop Nova','Oud','Nieuw'],['Ticketprijs (€ per ticket)','10','12'],['Qv (tickets per week)','500','420']],60,303,1480,278,[740,370,370],34);
 text(s,'Bij StreamNow is voor een andere prijsverhoging\nEv = −2 gemeten.',60,631,1480,102,38,{bold:true,color:C.blue});
 text(s,'Gebruik voor Nova de oude waarde als noemer\nen Ev = %ΔQv / %ΔP.',60,757,1480,85,32);
 notes(s,'42','Dit zijn alle gegevens uit de werkelijke doelopgave 7. De stijging van 10 naar 12 euro en daling van 500 naar 420 tickets per week staan in de tabel. StreamNow heeft een andere prijsverhoging, met alleen Ev=−2 gegeven. Toon eerst ook alle deelvragen, daarna pas de antwoordstappen.','Welke gegevens horen bij Nova en welke bij StreamNow?','Neem de prijsstap van Nova niet zomaar over voor StreamNow.','Toon vragen a en b en daarna c en d.');
}
{
 const s=slide('Opgave 7 · Deelvragen a en b',targetFooter);
 text(s,'a) Bereken voor Bioscoop Nova de procentuele prijsverandering, de procentuele verandering van de gevraagde hoeveelheid en Ev. (3 punten)',60,212,1480,219,41);
 rule(s,60,475,1480);
 text(s,'b) Classificeer de vraag naar bioscoopkaartjes en leg in gewone taal uit wat Ev = −0,8 betekent. (2 punten)',60,546,1480,201,41);
 notes(s,'42','Laat leerlingen hun eigen poging erbij houden. De −0,8 staat al in de oorspronkelijke deelvraag b en blijft daarom zichtbaar. Dat is een gegeven in de vraag, niet een voortijdige antwoordberekening. De volledige oplossing volgt pas nadat ook c en d getoond zijn.','Welke drie berekeningen vraagt deel a?','Alleen het getal uit vraag b overschrijven is geen berekening voor a.','Maak alle overige deelvragen beschikbaar.');
}
{
 const s=slide('Opgave 7 · Deelvragen c en d',targetFooter);
 text(s,'c) Classificeer de vraag naar StreamNow met Ev = −2 en vergelijk de prijsgevoeligheid met die van Bioscoop Nova. (2 punten)',60,211,1480,203,41);
 rule(s,60,459,1480);
 text(s,'d) Geef één plausibele contextverklaring voor het verschil in prijsgevoeligheid. Baseer je verklaring niet op een andere elasticiteitssoort. (2 punten)',60,526,1480,217,41);
 notes(s,'42','Alle deelvragen a–d zijn nu volledig getoond, inclusief punten. De doelvraag vraagt geen inkomenselasticiteit en geen omzetadvies. Deel c vraagt zowel de indeling als een relatieve vergelijking.','Welke woorden helpen je om bij d een mogelijkheid te formuleren?','Een contextverhaal moet verklaren waarom de reactie op de eigen prijs kan verschillen.','Begin de uitwerking met de twee percentages voor Nova.');
}
{
 const s=slide('Opgave 7a · Beide procentuele veranderingen',targetFooter);
 text(s,'Prijs: € 10 wordt € 12 per ticket',60,200,1480,57,36,{bold:true,color:C.blue});
 text(s,'%ΔP = (12 − 10) / 10 × 100% = +20%',60,287,1480,105,46,{bold:true});
 rule(s,60,426,1480);
 text(s,'Hoeveelheid: 500 wordt 420 tickets per week',60,479,1480,57,36,{bold:true,color:C.green});
 text(s,'%ΔQv = (420 − 500) / 500 × 100% = −16%',60,568,1480,105,44,{bold:true});
 text(s,'Controle: 20% van € 10 = € 2. 16% van 500 = 80 tickets.',60,765,1480,65,35);
 notes(s,'42','Gebruik in beide gevallen (nieuw−oud)/oud×100%. De prijsverandering is 2/10=0,20; de hoeveelheidsverandering is −80/500=−0,16. Dat levert +20% en −16%. Benoem de oorspronkelijke eenheden en de weekperiode. Controleer de richtingen en reken terug naar de verschillen.','Welke oude waarden staan onder de twee breuken?','Niet delen door 12 of 420 en het minteken bij de hoeveelheidsdaling niet vergeten.','Deel de procentuele hoeveelheidsreactie door de procentuele prijsverandering.');
}
{
 const s=slide('Opgave 7a · Ev berekenen',targetFooter);
 text(s,'Ev = %ΔQv / %ΔP',60,240,1480,94,58,{bold:true,color:C.blue});
 text(s,'Ev = −16% / +20% = −0,8',60,403,1480,106,60,{bold:true});
 text(s,'Het minteken: P en Qv bewegen tegengesteld.',60,596,1480,103,42,{bold:true,color:C.green});
 text(s,'Controle: −0,8 × (+20%) = −16%. Ev is geen percentage.',60,777,1480,59,35);
 notes(s,'42','Deel reactie door prijswijziging: −16/20=−0,8. De procenttekens vallen in de verhouding weg. De controle vermenigvuldigt de uitkomst met de prijsverandering en levert de hoeveelheidsverandering terug.','Wat zou er fout gaan als je de twee percentages verwisselt?','+20/−16 geeft −1,25 en meet de omgekeerde verhouding.','Vertaal het getal naar indeling en economische betekenis.');
}
{
 const s=slide('Opgave 7b · Prijsinelastische vraag',targetFooter);
 text(s,'−1 < −0,8 < 0',60,219,1480,111,67,{bold:true,color:C.blue});
 text(s,'De procentuele hoeveelheidsdaling is 0,8 maal\nde procentuele prijsstijging.',60,387,1480,146,46,{bold:true});
 table(s,[['Prijsstijging','Hoeveelheidsdaling'],['20%','16%']],60,580,1480,175,[740,740],37);
 text(s,'Dit beschrijft de onderzochte prijswijziging.',60,790,1480,49,34,{color:C.muted});
 notes(s,'42','De vraag is prijsinelastisch: Qv daalt procentueel minder sterk dan P stijgt. In de meting is de daling 16% bij een prijsstijging van 20%. Ook goed: gemiddeld 0,8% hoeveelheidsdaling per 1% prijsstijging in deze meting. Het is geen zekere voorspelling voor elke volgende prijs.','Waarom betekent prijsinelastisch hier niet dat de bezoekers niet reageren?','De hoeveelheid daalt met 80 tickets per week en dus wel degelijk. −0,8 is niet −0,8 ticket.','Vergelijk de relatieve reactie met StreamNow.');
}
{
 const s=slide('Opgave 7c · StreamNow vergelijken met Nova',targetFooter);
 table(s,[['Aanbieder','Ev','Vergelijking','Indeling'],['Bioscoop Nova','−0,8','−1 < −0,8 < 0','Prijsinelastisch'],['StreamNow','−2','−2 < −1','Prijselastisch']],60,216,1480,305,[430,230,440,380],33);
 text(s,'StreamNow is hier prijsgevoeliger: Qv reageert\nprocentueel sterker op P.',60,591,1480,140,44,{bold:true,color:C.blue});
 text(s,'Zonder beginhoeveelheid geen vergelijking van verloren klanten.',60,785,1480,54,32);
 notes(s,'42','−2 ligt onder −1, dus StreamNow heeft prijselastische vraag. Per procent prijsverandering is de procentuele reactie bij StreamNow sterker dan bij Nova: factor 2 tegenover 0,8. Dat is een vergelijking van relatieve reacties op de eigen prijs. De hoeveelheid en prijsstap van StreamNow zijn niet gegeven.','Waarom kun je niet zeggen welke aanbieder de meeste klanten verliest?','Verwar een sterkere procentuele reactie niet met een groter absoluut aantal.','Geef één mogelijke verklaring die bij deze context past.');
}
{
 const s=slide('Opgave 7d · Een plausibele contextverklaring',targetFooter);
 text(s,'Een streamingabonnement is mogelijk makkelijker\nop te zeggen of te vervangen dan een bioscoopbezoek.',60,232,1480,158,43,{bold:true,color:C.blue});
 text(s,'Dat kan de sterkere prijsreactie bij StreamNow verklaren.',60,455,1480,121,43);
 rule(s,60,630,1480);
 text(s,'Mogelijke verklaring: de cijfers bewijzen dit klantgedrag niet.',60,702,1480,126,42,{bold:true,color:C.orange});
 notes(s,'42','Dit is één modelantwoord, geen bewezen beschrijving van alle klanten. Leg de verbinding uit: geschikte alternatieven of makkelijk opzeggen maken uitwijken na een prijsstijging makkelijker; daardoor kan de gevraagde hoeveelheid sterker dalen. Ook andere plausibele contextverklaringen zijn goed. Gebruik woorden als mogelijk of kan. Het gaat om prijsgevoeligheid, niet om een veranderend inkomen of een berekening van kruislingse elasticiteit.','Welke schakel verbindt de alternatieven met een sterkere reactie op de eigen prijs?','Beweer niet dat de cijfers aantonen dat alle klanten overstappen.','Laat leerlingen hun eigen antwoord op alle onderdelen controleren.');
}
{
 const s=slide('Antwoordcontrole bij opgave 7',targetFooter);
 const rows=[['a · Berekenen','+20%, −16% en Ev = −0,8, met berekeningen.'],['b · Indelen en uitleggen','Prijsinelastisch. Qv reageert procentueel\n0,8 maal zo sterk als P.'],['c · Vergelijken','StreamNow: prijselastisch en relatief prijsgevoeliger.'],['d · Verklaren','Een mogelijke contextreden, gekoppeld aan prijsgevoeligheid.']];
 rows.forEach((r,i)=>{let y=208+i*142;text(s,r[0],60,y,500,75,36,{bold:true,color:C.blue});text(s,r[1],620,y,920,111,35);});
 text(s,'Verbeter een ontbrekende berekening of redenering in je antwoord.',60,798,1480,47,32,{bold:true});
 notes(s,'42','Loop alle vier onderdelen na. Alleen een eindgetal is onvoldoende waar een berekening of uitleg gevraagd wordt. Vraag leerlingen een concrete verbetering te schrijven. De check uit het boek noemt oude noemers, minteken, cijfermatige vergelijking en mogelijke versus bewezen verklaring.','Welk onderdeel van je eigen antwoord kun je preciezer maken?','Een plausibele oorzaak is niet automatisch door deze cijfers bewezen.','Rond af met het gedeelde overzicht en het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

if(JSON.stringify(overviews)!==JSON.stringify(facts.overviewSlides))throw Error('Overview sequence differs from manifest');
await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...facts,slides,tableSlides:tables,chartSlides:[]},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.2.1 Prijselasticiteit – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:[],verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
