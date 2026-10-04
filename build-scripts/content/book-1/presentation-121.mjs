import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

// HOW TO ADAPT: derive the current paragraph's assignment and prerequisites first;
// retain shared overview geometry but replace authored examples and target coverage.
// Current Book 1 second edition; source/assignment provenance is kept separately.
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('121');
const provenance=JSON.parse(await fs.readFile(new URL('./presentation-121.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+provenance.lessonCommit+'/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte boekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H2/Antwoorden.md\n${extra}`);
}
function slide(title,footer='§1.2.1 Betalingsbereidheid en individuele vraag'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,90,title.startsWith('Deze les')?43:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,849,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,846,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 8.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §1.2.1 Betalingsbereidheid en individuele vraag');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,109,1450,40,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],789,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Koopkeuzes verklaren.\nRekenen en tekenen met vraag.\nConclusies begrenzen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 52 · Opgaven 1 en 2\n2a: verkennen, theorie p. 46',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.2.1 · Opgaven 3 t/m 8\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7 · Doel: 8\nMaken en nakijken',972,656,565,165,30,{bold:active===7,name:'overview-homework'});
 notes(s,'46, 52–56','Laat het overzicht staan tijdens '+phase.toLowerCase()+'. Start: 1–2 op p. 52. Basis: 3 op p. 53, 4–5 op p. 54. Zelfstandig: 6–7 op p. 55. Doel: 8 op p. 56. Huiswerk: 3, 4, 5, 6, 7 en 8 maken en nakijken. Bonus 9 en herhaling 10–11 zijn extra. Opgave 1 herhaalt invullen en terugrekenen uit §1.1.3, p. 27. Opgave 2b herhaalt (hoeveelheid; prijs) uit p. 24–25. Opgave 2a is een eerste verkenning van de koopregel: laat de leerling de definitie en gelijkheidsafspraak op p. 46 lezen, die regel in eigen woorden noemen en twijfel noteren. Verwacht nog geen beheerste nieuwe kennis. Bij de terugkeer naar dit overzicht vóór basiswerk: laat 2a opnieuw proberen, bespreek de redenering en bied zo nodig steun. De complete route mag over meer lessen doorlopen.','Welke regel gebruik je bij 2a? Waar vind je die?','Een startopgave met nieuwe inhoud is geen onbegeleide voorkennistoets.',active===2?'We bespreken de begrippen en doen een afzonderlijk uitlegvoorbeeld.':active===4?'Na de eigen poging bespreken we doelopgave 8.':'Noteer het resterende werk in je agenda.');
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,175,1480,42,29,{bold:true,color:C.blue});}
overview('Startopdracht',2);
{
 const s=slide('De handelingen van deze les');
 const rows=[['Kiezen','Vergelijk de prijs met de waarde van elke extra eenheid.'],['Rekenen','Bereken q, reken terug naar P en bepaal snijpunten.'],['Tekenen','Zet (q; P) op passende assen en controleer de lijn.'],['Uitleggen','Verklaar de prijsreactie en begrens je conclusie.']];
 rows.forEach((r,i)=>{const y=219+i*144;text(s,r[0],60,y,345,65,42,{bold:true,color:C.blue});text(s,r[1],430,y,1090,110,39);});
 notes(s,'46–51','De doelopgave vraagt twee verschillende situaties: losse koopbeslissingen en een lineair model. Benoem de koppeling tussen betekenis, formule, grafiek en conclusie. De inhoud van dit voorbeeld loopt mee met alle zes onderdelen van doelopgave 8.','Wat heb je bij een grafiek behalve getallen nog nodig?','Een vraagfunctie beschrijft een koopplan onder voorwaarden.','Haal eerst de rekenprocedure kort terug.');
}
{
 const s=slide('Invullen en terugrekenen');example(s);
 text(s,'Materiaalhuur: T = 7 + 3n',60,253,1480,66,45,{bold:true});
 text(s,'n = 5 materialen',60,367,650,60,38,{bold:true,color:C.blue});
 text(s,'T = 7 + 3 × 5\nT = € 22',60,450,650,165,46);
 text(s,'T = € 31',835,367,680,60,38,{bold:true,color:C.green});
 text(s,'31 = 7 + 3n\n24 = 3n      (beide kanten −7)\nn = 8          (beide kanten ÷3)',835,450,690,210,37);
 text(s,'Controle: 7 + 3 × 8 = € 31',60,748,1480,62,40,{bold:true});
 notes(s,'27','Korte opfrissing, met eigen data: T is totale huur in euro, n het aantal materialen; hele aantallen 0–20. Eerst vermenigvuldigen. Trek bij terugrekenen aan beide kanten 7 af en deel beide kanten door 3. Dit is eerder onderwezen op p. 27; het is geen uitwerking van startopgave 1.','Waarom doen we aan beide kanten dezelfde bewerking?','Een term verplaatsen zonder bewerking te verklaren verbergt de rekenstap.','Gebruik vervolgens de nieuwe economische koopregel.','Eigen context en data; p. 27 ondersteunt alleen de methode.');
}
{
 const s=slide('Betalingsbereidheid per extra eenheid');example(s);
 text(s,'Lotte koopt zakjes bloemenzaad. De prijs is € 6 per zakje.',60,253,1480,92,39,{bold:true});
 table(s,[['Extra zakje','1e','2e','3e','4e'],['Maximaal over','€ 11','€ 8','€ 6','€ 3'],['Koopt bij € 6?','Ja','Ja','Ja','Nee']],60,388,1480,255,[490,247,247,248,248],34);
 text(s,'Waarde ≥ prijs → kopen',60,696,900,62,46,{bold:true,color:C.green});
 text(s,'Voldoende budget en verkrijgbaar; bij gelijkheid koopt zij ook.',60,780,1480,45,30);
 notes(s,'46','Betalingsbereidheid is het maximale bedrag voor die bepaalde extra eenheid. Vergelijk elk bedrag afzonderlijk met 6. 11 en 8 zijn hoger; 6 is gelijk en telt volgens de afspraak mee; 3 is lager. Zij koopt drie zakjes. De waarde van het eerste zakje is niet de totale waarde.','Waarom telt het derde zakje mee?','Je telt niet de vier waarden op om het aantal te bepalen.','Bekijk wat een prijsverandering doet met dezelfde waarden.','Eigen context en data, geen boekopgave.');
}
{
 const s=slide('Andere prijs, dezelfde betalingsbereidheid');example(s);
 table(s,[['Prijs per zakje','Gekocht door Lotte','Reden'],['€ 9','1 zakje','Alleen € 11 is minstens € 9.'],['€ 6','3 zakjes','€ 11, € 8 en € 6 zijn minstens € 6.']],60,274,1480,280,[365,380,735],34);
 text(s,'De prijs verandert; de vier waarden blijven € 11, € 8, € 6 en € 3.',60,617,1480,102,39,{bold:true,color:C.blue});
 text(s,'Bij € 6: voordeel = (11 − 6) + (8 − 6) + (6 − 6) = € 7',60,755,1480,64,34);
 notes(s,'47','Dezelfde waarden leiden bij verschillende prijzen tot andere aantallen. Benoem de laatste regel kort als consumentensurplus: het verschil tussen waarde en betaling voor de gekochte eenheden, geen uitbetaling. Dit is slechts een kennismaking, geen te leren oppervlaktemethode. Losse eenheden geven sprongen; een rechte lijn volgt niet automatisch uit vier waarden.','Is Lotte minder gaan waarderen wanneer de prijs stijgt?','Een gewijzigde koopkeuze bewijst geen gewijzigde betalingsbereidheid.','We beginnen een aparte situatie met een deelbare hoeveelheid en een lineair model.','Eigen context en data; de uitleg blijft binnen de introductie op p. 47.');
}
{
 const s=slide('Een afzonderlijk lineair vraagmodel');example(s);
 text(s,'Samira koopt losse thee',60,256,1480,58,43,{bold:true});
 text(s,'q = 24 − 3P',60,375,780,95,64,{bold:true,color:C.blue});
 text(s,'q: thee in ons per maand\nP: euro per ons',890,377,630,142,39);
 text(s,'0 ≤ P ≤ 8    en    0 ≤ q ≤ 24',60,544,1480,65,44);
 text(s,'Eén koper · overige omstandigheden gelijk (ceteris paribus)',60,672,1480,103,38,{bold:true});
 notes(s,'47–49','Individuele vraag verbindt prijs met de hoeveelheid die één koper wil en kan kopen. Voor Samira nemen we een lineair verband aan binnen deze grenzen. Dit is geen omzetting van Lottes vier zakjes. Thee is deelbaar; een lineair model is een extra vereenvoudiging. 3P betekent 3 maal P.','Wat houden we gelijk terwijl we de prijs veranderen?','Veel losse koopbeslissingen worden niet vanzelf precies deze rechte lijn.','Vul twee prijzen in en houd de eenheden vast.','Eigen context en data; q is ons thee per maand, P euro per ons.');
}
{
 const s=slide('Hoeveelheid bij een gegeven prijs');example(s);
 text(s,'Samira: q = 24 − 3P',60,246,1480,64,42,{bold:true,color:C.blue});
 table(s,[['P (€ per ons)','Invullen','q (ons per maand)'],['2','24 − 3 × 2','18'],['6','24 − 3 × 6','6']],60,354,1480,283,[350,630,500],37);
 text(s,'Een hogere prijs → minder gevraagde thee, ceteris paribus.',60,710,1480,105,41,{bold:true});
 notes(s,'48, 50','Vermenigvuldig eerst en trek daarna af. Bij twee euro kiest zij achttien ons per maand; bij zes euro zes ons. Het minteken geeft de negatieve prijsreactie binnen dit model. Per euro prijsstijging daalt q met drie ons per maand.','Welke grootheid is gegeven en welke bereken je?','24 − 3 × 2 is niet 21 × 2.','Reken nu terug van een hoeveelheid naar de prijs.','Eigen context en data.');
}
{
 const s=slide('Prijs bij een gegeven hoeveelheid');example(s);
 text(s,'Samira vraagt 9 ons thee per maand',60,243,1480,60,41,{bold:true});
 const r=[['9 = 24 − 3P','Vul q = 9 in.'],['9 + 3P = 24','Tel aan beide kanten 3P op.'],['3P = 15','Trek aan beide kanten 9 af.'],['P = € 5 per ons','Deel beide kanten door 3.']];
 r.forEach((a,i)=>{let y=350+i*96;text(s,a[0],60,y,700,66,43,{bold:i===3,color:i===3?C.green:C.ink});text(s,a[1],820,y,710,70,35);});
 text(s,'Controle: 24 − 3 × 5 = 9 ons per maand; € 5 ligt tussen € 0 en € 8.',60,780,1480,48,31,{bold:true});
 notes(s,'49–50','De onbekende is P. Houd de vergelijking gelijk met dezelfde bewerking aan beide kanten. De prijs is vijf euro per ons, niet vijf ons. Controleer in de oorspronkelijke functie en controleer de geldigheid.','Waarom voegen we hier 3P aan beide kanten toe?','De negatieve coëfficiënt vraagt aandacht; schrijf de bewerking expliciet.','De hele functie kan ook met P links geschreven worden.','Eigen context en data.');
}
{
 const s=slide('Dezelfde relatie met P links');example(s);
 const r=[['q = 24 − 3P','Beginfunctie'],['q + 3P = 24','Beide kanten +3P'],['3P = 24 − q','Beide kanten −q'],['P = 8 − ⅓q','Beide kanten ÷3']];
 r.forEach((a,i)=>{let y=275+i*116;text(s,a[0],60,y,740,72,49,{bold:i===3,color:i===3?C.blue:C.ink});text(s,a[1],870,y,650,70,37);});
 text(s,'Bij q = 9: P = 8 − 9/3 = € 5 per ons',60,772,1480,62,38,{bold:true});
 notes(s,'49','Dit is dezelfde relatie, geen nieuwe vraag. Gebruik de exacte breuk één derde of delen door drie; rond de coëfficiënt niet af. De geldigheid blijft 0 tot 24 ons per maand. Controleer met de eerder gevonden combinatie.','Verandert Samira’s gedrag door de andere schrijfwijze?','Een omgeschreven functie mag de data of geldigheid niet veranderen.','Gebruik nulwaarden om de twee assnijpunten te vinden.','Eigen context en data.');
}
{
 const s=slide('Snijpunten met de assen');example(s);
 text(s,'Samira: q = 24 − 3P',60,247,1480,65,43,{bold:true});
 table(s,[['Snijpunt','Zet de andere variabele op nul','Coördinaat (q; P)'],['Met de q-as','P = 0 → q = 24 − 3 × 0 = 24','(24; 0)'],['Met de P-as','q = 0 → 3P = 24 → P = 8','(0; 8)']],60,354,1480,295,[340,690,450],34);
 text(s,'Bij P = € 0 vraagt zij 24 ons; dat is geen voorspelde werkelijke aankoop.',60,725,1480,103,37,{bold:true,color:C.orange});
 notes(s,'48–50','Op de horizontale q-as is de verticale prijs nul. Op de verticale P-as is de hoeveelheid nul. Bereken beide uit de functie. Controleer 24 − 3 maal 8 = 0. Het domein eindigt hier; boven acht euro gebruiken we geen negatieve aankoop.','Welke variabele is nul op de P-as?','Wissel de nul niet om; coördinaten blijven (q; P).','Teken eerst de assen en plaats deze twee punten.','Eigen context en data.');
}
function graph(title,a,b,stage,target=false){
 const maxP=a/b,maxQ=a,s=slide(title,target?'§1.2.1 · Opgave 8d–e · Boekpagina 56':undefined);
 if(!target)example(s);else text(s,'Amir: q = 20 − 4P',60,177,1480,45,33,{bold:true,color:C.blue});
 const pts=target?[[12,2],[8,3]]:[[18,2],[6,6]];
 const series=stage===0?[
  {name:'Snijpunt P-as',xValues:[0],values:[maxP],line:{fill:C.blue,width:0},marker:{symbol:'circle',size:10}},
  {name:'Snijpunt q-as',xValues:[maxQ],values:[0],line:{fill:C.blue,width:0},marker:{symbol:'circle',size:10}}
 ]:[{name:'V',xValues:[0,maxQ],values:[maxP,0],line:{fill:C.blue,width:4},marker:{symbol:'circle',size:8}}];
 if(stage===2){pts.forEach(([q,P],i)=>{series.push({name:'Hulplijn '+(i+1),xValues:[0,q,q],values:[P,P,0],line:{fill:i?C.orange:C.green,width:2,style:'dashed'},marker:{symbol:'none'}});series.push({name:i?'B':'A',xValues:[q],values:[P],line:{fill:C.blue,width:0},marker:{symbol:i?'square':'circle',size:10}});});}
 const ch=s.charts.add('scatter',{position:{left:60,top:245,width:1040,height:575},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,xAxis:{min:0,max:maxQ,majorUnit:target?4:6,numberFormatCode:'0',title:{text:target?'q (liter per maand)':'q (ons per maand)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:maxP,majorUnit:target?1:2,numberFormatCode:'0',title:{text:target?'P (€ per liter)':'P (€ per ons)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 if(stage>0)text(s,'V',480,350,80,55,37,{bold:true,color:C.blue});
 if(stage===2){
  // These labels use the verified PowerPoint plot bounds. Reinspect after changing the chart box.
  const labelPoints=target?[[725,488],[540,395]]:[[860,555],[400,324]];
  labelPoints.forEach(([x,y],i)=>text(s,i?'B':'A',x,y,55,50,32,{bold:true,color:C.ink}));
 }
 text(s,stage===0?'1. Assen en schaal':stage===1?'2. Verbind de punten':'3. Controleer punten',1140,266,400,106,35,{bold:true});
 text(s,stage===0?`q horizontaal\nP verticaal\n\n(0; ${maxP}) en (${maxQ}; 0)` :stage===1?`Eén rechte lijn\nbinnen de grenzen\n\nq = ${a} − ${b}P`:`A = (${pts[0].join('; ')})\nB = (${pts[1].join('; ')})\n\nEerst q, daarna P.`,1140,407,390,290,35);
 notes(s,target?'56':'24–25, 48–51',stage===0?'Kies gelijke stappen binnen elke as. De assen mogen onderling verschillende stapgroottes hebben. Zet eerst hoeveelheid en dan prijs neer. Plaats de twee berekende snijpunten.':stage===1?'Een rechte lijn ligt vast door de twee berekende punten. Verbind alleen binnen het geldige interval. Controleer de dalende richting bij q horizontaal en P verticaal.':'De hulplijn begint bij de prijs, loopt horizontaal naar V en dan verticaal naar de hoeveelheid. Controleer beide punten ook met de formule. Bij de hogere prijs ligt het punt linksboven: minder gevraagde hoeveelheid.',stage===0?'Waar staat q = 0?':stage===1?'Waarom mogen we buiten de gegeven grenzen niet doortekenen?':'Welke lijn hoort bij de hogere prijs?','Coördinaten zijn (q; P), niet (P; q). Alleen een passende schaal is niet genoeg: de punten moeten kloppen.',target?'Leg het verschil tussen gevraagde hoeveelheid en feitelijke aankoop uit.':stage===2?'Wat kunnen we wel en niet concluderen?':'Voeg de volgende stap toe.',target?'Werkelijke boekopgave 8; antwoordmodel 8d–e.':'Eigen theemodel; de boekpagina’s ondersteunen de methode.');
}
graph('Een vraaglijn tekenen: assen en snijpunten',24,3,0);
graph('Een vraaglijn tekenen: de rechte lijn',24,3,1);
graph('De formule en de grafiek controleren',24,3,2);
{
 const s=slide('Vraag en feitelijke aankoop');example(s);
 table(s,[['Wel uit het model','Nog niet vastgesteld'],['P: € 2 → € 6 per ons','Welke prijs werkelijk geldt'],['q: 18 → 6 ons per maand','Of de thee verkrijgbaar is'],['12 ons minder gevraagd, ceteris paribus','Hoeveel Samira feitelijk koopt']],60,277,1480,350,[740,740],34);
 text(s,'Controle: bij P = € 9 geeft de formule −3. Dat is geen aankoop.',60,704,1480,102,39,{bold:true,color:C.orange});
 notes(s,'49, 51','De prijsstijging met vier euro leidt binnen het model tot twaalf ons minder vraag per maand. Het model beschrijft voorwaardelijke keuzes. De verkoop volgt er niet alleen uit. Bij negen euro valt de invulling buiten 0–8; negatieve vraag is geen geldige hoeveelheid. Vraag boven de koopgrens is nul, geen −3.','Wat ontbreekt om de feitelijke aankoop te kennen?','Noem geen vraagpunt een evenwicht; er is geen aanbodmodel.','Keer terug naar 2a en begin daarna de basisopgaven.','Eigen context en data.');
}
overview('Oefenen',4);
{
 const s=slide('Opgave 8 · Fotoprints en een sapmodel','§1.2.1 · Doelopgave 8 · Boekpagina 56');
 text(s,'Bron A · Iris',60,208,1480,62,40,{bold:true,color:C.blue});
 text(s,'Iris wil voor vier extra fotoprints maximaal € 12, € 9, € 5 en € 2 betalen. Elke print kost € 5. Zij heeft voldoende budget; bij gelijkheid koopt zij ook.',60,299,1480,192,40);
 text(s,'Bron B · Een andere situatie',60,529,1480,60,40,{bold:true,color:C.green});
 text(s,'Voor Amir geldt q = 20 − 4P. q is sap in liter per maand, P euro per liter. De functie geldt voor 0 ≤ P ≤ 5. Alle overige omstandigheden blijven gelijk.',60,622,1480,190,40);
 notes(s,'56','Lees beide bronnen volledig. Bron A is een rij koopbeslissingen. Bron B is een andere situatie met een lineair model. Eerst worden alle deelvragen getoond, daarna komen de antwoorden.','Welke bron hoort bij losse eenheden?','Gebruik Amirs functie niet voor Iris.','Bekijk eerst vragen a–c.');
}
{
 const s=slide('Opgave 8 · Vragen a–c','§1.2.1 · Doelopgave 8 · Boekpagina 56');
 const r=[['a','Hoeveel fotoprints koopt Iris volgens bron A? Leg uit.'],['b','Bereken met bron B de gevraagde hoeveelheid bij P = € 2 en bij P = € 3.'],['c','Bereken de prijs die hoort bij q = 6 liter per maand. Controleer je antwoord.']];
 r.forEach((v,i)=>{const y=246+190*i;text(s,v[0]+'.',60,y,80,70,43,{bold:true,color:C.blue});text(s,v[1],160,y,1380,140,42);});
 notes(s,'56','Laat leerlingen hun reeds gemaakte antwoorden paraat houden. Laat ze eerst aanwijzen welke bron en welke grootheid bij elke vraag horen. Geef nu nog geen oplossing.','Wat is bij c gegeven en wat is onbekend?','Een antwoord bij c moet ook een controle bevatten.','Bekijk d–f voordat er antwoorden worden onthuld.');
}
{
 const s=slide('Opgave 8 · Vragen d–f','§1.2.1 · Doelopgave 8 · Boekpagina 56');
 const r=[['d','Bereken beide snijpunten van de vraaglijn uit bron B.'],['e','Teken die vraaglijn in je schrift en markeer de twee punten uit b. Vermeld variabelen, eenheden en een bruikbare schaal.'],['f','Leg uit wat de prijsstijging van € 2 naar € 3 voor Amirs vraag betekent. Kun je daarmee ook zijn feitelijke aankoop vaststellen?']];
 r.forEach((v,i)=>{const y=234+202*i;text(s,v[0]+'.',60,y,80,70,43,{bold:true,color:C.blue});text(s,v[1],160,y,1380,184,40);});
 notes(s,'56','Nu zijn alle zes vragen beschikbaar zonder antwoorden. Laat leerlingen desgewenst terugbladeren naar de bronnendia; de volledige bron staat op boekpagina 56. Bespreek pas hierna de uitwerkingen.','Welke controle kun je bij e uitvoeren?','Het eindgetal van b beantwoordt f nog niet.','Begin de bespreking met Iris.');
}
{
 const s=slide('Opgave 8a · De koopbeslissing van Iris','§1.2.1 · Opgave 8a · Boekpagina 56');
 table(s,[['Extra fotoprint','1e','2e','3e','4e'],['Betalingsbereidheid','€ 12','€ 9','€ 5','€ 2'],['Vergelijk met € 5','12 > 5','9 > 5','5 = 5','2 < 5'],['Koopt zij?','Ja','Ja','Ja','Nee']],60,238,1480,350,[460,255,255,255,255],34);
 text(s,'Iris koopt 3 fotoprints.',60,664,1480,68,48,{bold:true,color:C.green});
 text(s,'Ook bij gelijkheid koopt zij; de vierde print is haar minder dan € 5 waard.',60,756,1480,74,34);
 notes(s,'56','Vergelijk elke extra print met de gegeven prijs. De eerste drie voldoen; de vierde niet. De gelijkheidsafspraak en het voldoende budget staan expliciet in de bron.','Welke afspraak maakt de derde print beslisbaar?','De € 12 hoort bij de eerste print, niet bij alle prints samen.','Wissel expliciet naar bron B: Amir.');
}
{
 const s=slide('Opgave 8b · Amir: hoeveelheid bij prijs','§1.2.1 · Opgave 8b · Boekpagina 56');
 text(s,'Bron B: q = 20 − 4P',60,216,1480,72,48,{bold:true,color:C.blue});
 table(s,[['P (€ per liter)','Berekening','q (liter per maand)'],['2','20 − 4 × 2 = 20 − 8','12'],['3','20 − 4 × 3 = 20 − 12','8']],60,355,1480,293,[350,630,500],37);
 text(s,'Beide prijzen vallen binnen 0 ≤ P ≤ 5.',60,734,1480,72,41,{bold:true});
 notes(s,'56','Vul de prijs op de plaats van P in; vermenigvuldig eerst. De uitkomsten zijn twaalf en acht liter per maand. De periode is niet per week.','Wat betekent het getal 4 vóór P hier?','P in euro per liter wordt niet de eenheid van q.','Reken terug naar de prijs bij zes liter.');
}
{
 const s=slide('Opgave 8c · Amir: prijs bij 6 liter','§1.2.1 · Opgave 8c · Boekpagina 56');
 const rows=[['6 = 20 − 4P','Vul q = 6 in.'],['6 + 4P = 20','Beide kanten +4P'],['4P = 14','Beide kanten −6'],['P = € 3,50 per liter','Beide kanten ÷4']];
 rows.forEach((r,i)=>{const y=222+116*i;text(s,r[0],60,y,800,77,46,{bold:i===3,color:i===3?C.green:C.ink});text(s,r[1],940,y,600,77,36);});
 text(s,'Controle: 20 − 4 × 3,50 = 6 liter per maand.',60,713,1480,61,40,{bold:true});
 text(s,'€ 3,50 ligt tussen € 0 en € 5.',60,786,1480,44,30);
 notes(s,'56','Toon iedere equivalente vergelijking. Veertien gedeeld door vier is drie euro vijftig per liter. Controleer zowel de functie als het gegeven interval.','Waarom is € 3,50 een prijs en geen hoeveelheid?','Rond hier niet af naar hele euro’s.','Bereken de twee snijpunten.');
}
{
 const s=slide('Opgave 8d · Beide snijpunten','§1.2.1 · Opgave 8d · Boekpagina 56');
 table(s,[['As','Berekening met q = 20 − 4P','(q; P)'],['q-as','P = 0 → q = 20 − 4 × 0 = 20','(20; 0)'],['P-as','q = 0 → 4P = 20 → P = 5','(0; 5)']],60,257,1480,330,[310,790,380],36);
 text(s,'Controle P-as: 20 − 4 × 5 = 0 liter per maand.',60,663,1480,82,41,{bold:true,color:C.blue});
 text(s,'Teken alleen het gegeven bereik: 0 ≤ P ≤ 5 en 0 ≤ q ≤ 20.',60,771,1480,54,34);
 notes(s,'56','Maak bij elk snijpunt zichtbaar welke variabele nul is. De maximumhoeveelheid bij nulprijs is twintig liter per maand. Bij vijf euro is q nul. Dit zijn geen twee marktprijzen.','Welke coördinaat is nul op de horizontale as?','Een negatieve hoeveelheid buiten dit bereik is geen aankoop.','Gebruik de snijpunten voor de tekening en controleer de twee punten uit b.');
}
graph('Opgave 8e · Vraaglijn met controlepunten',20,4,2,true);
{
 const s=slide('Opgave 8f · Vraagreactie en conclusie','§1.2.1 · Opgave 8f · Boekpagina 56');
 table(s,[['Prijsstijging','Gevraagde hoeveelheid','Verschil'],['€ 2 → € 3 per liter','12 → 8 liter per maand','8 − 12 = −4 liter per maand']],60,265,1480,205,[470,550,460],35);
 text(s,'4 liter per maand minder gevraagd, ceteris paribus.',60,542,1480,90,44,{bold:true,color:C.blue});
 text(s,'Feitelijke aankoop? Niet vast te stellen met alleen deze vraagfunctie.',60,672,1480,110,40,{bold:true,color:C.orange});
 notes(s,'56','De prijs stijgt met één euro per liter; volgens dezelfde vraagfunctie daalt de gevraagde hoeveelheid met vier liter per maand. Benoem alle overige omstandigheden gelijk. De functie geeft voorwaardelijke hoeveelheden bij veronderstelde prijzen. De werkelijke prijs en beschikbaarheid zijn niet vastgesteld. Laat leerlingen ontbrekende eenheden, controles of redeneringen in hun eigen antwoorden aanvullen.','Wat weet je wel en welke informatie ontbreekt nog?','Schrijf niet automatisch dat Amir vier liter minder heeft gekocht.','Laat de laatste overzichtsdia staan en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides:overviews,tables,charts},null,2));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),candidate]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'1.2.1 Betalingsbereidheid en individuele vraag – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables,charts,finalPath:result.finalPath,integrity:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
