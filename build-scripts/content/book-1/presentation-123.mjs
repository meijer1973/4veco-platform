import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

// HOW TO ADAPT: derive assignments, prerequisite support and examples from the
// current paragraph first; reuse overview() for all three lesson phases.
// Current Book 1 second edition. The first-edition web companion is not a source.
const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-123.tweede-editie-2026.manifest.json',import.meta.url),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('123');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='Van individuele naar collectieve vraag';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+sourceManifest.sourceCommit+'/'+sourceManifest.sourceEdition.split('/').map(encodeURIComponent).join('/')+'/';
const tables=[],charts=[],manifest=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte pagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H2/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. De ijstheesituatie en getallen zijn voor deze presentatie gemaakt; de boekpagina onderbouwt alleen de methode.':''}`);
}
function slide(heading,footer='§1.2.3 '+title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,86,heading.startsWith('Deze les')?45:50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 manifest.push({number:p.slides.items.length,title:heading});return s;
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
function example(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,44,29,{color:C.muted});}
function xy(s,series,{x=60,y=270,w=1040,h=520,xMax=30,yMax=8,xStep=5,yStep=2,units='liter per week',priceUnit='liter',small=false}={}){
 const f=small?24:27;
 const ch=s.charts.add('scatter',{position:{left:x,top:y,width:w,height:h},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:xMax,majorUnit:xStep,numberFormatCode:'0',title:{text:(small?'q / Q':'Q')+' ('+units+')',textStyle:{typeface:FONT,fontSize:f,fill:C.ink}},textStyle:{typeface:FONT,fontSize:f,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:yMax,majorUnit:yStep,numberFormatCode:'0',title:{text:'P (€ per '+priceUnit+')',textStyle:{typeface:FONT,fontSize:f,fill:C.ink}},textStyle:{typeface:FONT,fontSize:f,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);return ch;
}
function curve(name,xValues,values,color=C.blue){return {name,xValues,values,line:{fill:color,width:4},marker:{symbol:'circle',size:7}};}
function guide(name,xValues,values){return {name,xValues,values,line:{fill:C.muted,width:1.5,style:'dashed'},marker:{symbol:'none'}};}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 30.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §1.2.3 '+title);overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1480,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],i===0?790:779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Hoeveelheden en functies optellen,\nde som tekenen en\nprijsgrenzen bewaken.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 72 · Opgaven 23 en 24\n24: verkennen met theorie p. 68',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.2.3\nBasis: 25, 26 en 27\nZelfstandig: 28 en 29\nDoelopgave: 30\nMaken en nakijken: 25 t/m 30',972,654,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'14, 48–49, 68, 72–76',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Opgaven 23 en 24 staan op p.72. Basis: 25 op p.73, 26–27 op p.74. Zelfstandig 28–29 staan op p.75. Doelopgave 30 staat op p.76. Huiswerk: alle opgaven 25 tot en met 30 maken en nakijken; 31–33 zijn extra. De volledige route hoeft niet in één les af. De docenthandleiding schat de normale route op 137 minuten, zonder leerlingmetingen.\n\nStart 23 is voorkennis: invullen in een gegeven vraagfunctie en procentuele verandering. Bij twijfel verwijs naar p.48–49 voor invullen en q=0 en naar p.14 voor (nieuw−oud)/oud × 100%. Dit zijn eerdere uitlegpagina’s, geen nieuwe opdracht. Start 24 verkent juist de nieuwe collectieve vraag: laat p.68 openleggen, de definitie lezen en aanwijzen waarom je hoeveelheden bij dezelfde prijs optelt. Geef vooraf niet de uitkomst van opgave 24.\n\nBij de tweede overzichtsdia, vóór het basiswerk: laat iedereen opgave 24 opnieuw bekijken en de keuze voor een totaal uitleggen met de zojuist geleerde methode. Bied zo nodig opnieuw p.68 aan. Pas daarna begint het basiswerk. Een eerste poging bewijst geen beheersing.`,phase==='Startopdracht'?'Welke bekende rekenstap lukt al, en waar helpt p.68?':'Welke volgende opgave past bij je plek in de route?','De startverkenning van 24 is geen onaangekondigde toets van nieuw begrip. Gebruik complete-boekpagina’s, geen hoofdstukpagina’s.',phase==='Afsluiting / huiswerk'?'Laat 25 tot en met 30 maken en nakijken in de agenda zetten.':'Ga door naar de volgende fase wanneer de klas eraan toe is.');return s;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const a=[['Collectieve vraag','Je telt hoeveelheden op bij dezelfde prijs.'],['De somfunctie','Je verzamelt gelijke termen en noemt het prijsinterval.'],['De grafiek','Je tekent het geldige lijnstuk met Q horizontaal en P verticaal.'],['Een koopgrens','Je legt uit waarom een groep boven haar grens nul bijdraagt.']];
 a.forEach((r,i)=>{let y=205+i*147;text(s,r[0],60,y,510,62,39,{bold:true,color:C.blue});text(s,r[1],620,y,910,103,36);if(i<3)rule(s,60,y+119,1480);});
 notes(s,'68–72','Deze doelen bereiden alle onderdelen van doelopgave 30 voor. De vraag heeft betrekking op een afgebakende markt. Bij groepen moeten ze afzonderlijk zijn, zodat niemand dubbel meetelt.','Wat moet gelijk blijven voordat je twee hoeveelheden bij elkaar telt?','Een totaal en een gemiddelde beantwoorden verschillende vragen.','Haal twee bekende rekenstappen kort op.');
}
{
 const s=slide('Bekende rekenstappen');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,178,1480,44,29,{color:C.muted});
 text(s,'Invullen in een formule',60,246,1460,60,40,{bold:true,color:C.blue});
 text(s,'q = 20 − 4P   bij P = 3',60,323,1460,65,44);
 text(s,'q = 20 − 4 × 3 = 8',60,409,1460,70,47,{bold:true});
 text(s,'q: liter per week. P: € per liter. Geldig voor 0 ≤ P ≤ 5.',60,482,1480,43,30);rule(s,60,545,1480);
 text(s,'Procentuele verandering',60,587,1460,60,40,{bold:true,color:C.green});
 text(s,'(nieuw − oud) / oud × 100%',60,672,1460,70,46,{bold:true});
 text(s,'De oude hoeveelheid is de basis.',60,775,1460,55,36);
 notes(s,'14, 27, 48–49','Korte terughaalronde na de start: de losstaande oefenformule q=20−4P bij P=3 is zelf gemaakt, geen boekopgave. Gebruik bijvoorbeeld q in liter per week en P in euro per liter, geldig 0≤P≤5. Vermenigvuldig vóór aftrekken. Bij een procentuele verandering bereken je eerst nieuw min oud en deel je door oud; een daling houdt haar minteken. Geef alleen extra uitleg waar de start dat nodig maakt.','Welke bewerking doe je eerst in 20−4×3?','De prijs vermenigvuldigt alleen de coëfficiënt. Het verschil alleen is nog geen procent.','De volgende dia begint een andere, nieuwe ijstheesituatie.');
}
{
 const s=slide('Twee kopers van ijsthee');example(s);
 text(s,'Alleen koper A en B vormen deze voorbeeldmarkt.',60,260,1480,62,39,{bold:true});
 table(s,[['Koper','Vraagfunctie','Geldig bij'],['A','qA = 15 − 3P','0 ≤ P ≤ 5'],['B','qB = 14 − 2P','0 ≤ P ≤ 7']],60,368,1480,253,[300,680,500],37);
 text(s,'q: liter per week       P: euro per liter',60,665,1480,55,36,{bold:true,color:C.blue});
 text(s,'Boven de eigen koopgrens: nul. Overige omstandigheden gelijk.',60,760,1480,65,34);
 notes(s,'68–71','Dit is een afzonderlijk uitlegvoorbeeld, niet een boekopgave. Zet het product en de periode opnieuw vast: ijsthee, liter per week. De twee individuele kopers overlappen niet. De rekenregels zijn lineair en gelden alleen binnen hun prijsgrens; daarboven koopt die koper niets. Kleine q is individueel, grote Q is hier hun gezamenlijke vraag.','Welke prijsgrens hoort bij welke koper?','Neem geen getallen of maandperiode over uit het voorgaande sapmodel of de korte herhaling.','Bereken eerst bij één gemeenschappelijke prijs.',true);
}
{
 const s=slide('Collectieve vraag bij één prijs');example(s);
 text(s,'P = € 2 per liter',60,264,1460,65,45,{bold:true,color:C.blue});
 table(s,[['Koper A','Koper B','Samen'],['15 − 3 × 2 = 9','14 − 2 × 2 = 10','9 + 10 = 19']],60,375,1480,213,[495,495,490],38);
 text(s,'Samen 19 liter per week bij € 2 per liter',60,644,1480,75,46,{bold:true,color:C.green});
 text(s,'(9 + 10) / 2 = 9,5 liter per koper is het gemiddelde.',60,756,1480,63,34);
 notes(s,'68','Controleer vóór het rekenen hetzelfde product, dezelfde periode, dezelfde eenheid en dezelfde prijs. Andere omstandigheden blijven gelijk en niemand telt dubbel. Bij P=2 zijn beide regels geldig. Vermenigvuldig eerst: A 15−6=9 en B 14−4=10. Voor de collectieve vraag telt de som. De prijs blijft 2 euro; het gemiddelde beschrijft een gemiddelde koper, niet de totale hoeveelheid.','Welke grootheid tel je op en welke blijft gelijk?','Tel geen prijzen op en deel het totaal niet door het aantal kopers.','Lees dezelfde som horizontaal in grafieken.',true);
}
{
 const s=slide('Horizontaal optellen bij dezelfde prijs');example(s);
 const info=[['Koper A',[15,9,0],[0,2,5],9,C.blue],['Koper B',[14,10,0],[0,2,7],10,C.green],['Samen',[19],[2],19,C.orange]];
 info.forEach((a,i)=>{const x=40+i*520;text(s,a[0],x+35,257,470,48,36,{bold:true,color:a[4]});xy(s,[curve(a[0],a[1],a[2],a[4]),guide('Prijs 2',[0,a[3]],[2,2]),guide('Hoeveelheid',[a[3],a[3]],[0,2])],{x,y:320,w:500,h:391,small:true});text(s,'('+a[3]+'; 2)',x+35,725,470,55,35,{bold:true,color:a[4]});});
 text(s,'9 + 10 = 19 liter per week. De prijs blijft € 2.',60,797,1480,43,32,{bold:true});
 notes(s,'69','De drie afzonderlijke grafieken hebben exact dezelfde x-schaal 0–30 en P-schaal 0–8. Volg in ieder individueel paneel P=2 horizontaal naar de vraaglijn en vervolgens omlaag. A geeft q=9 en B q=10. De hoeveelheidcoördinaten worden samen 19; P blijft 2. Het laatste paneel toont eerst alleen het punt, nog geen complete somlijn.','Waarom schrijven we het gezamenlijke punt als (19;2) en niet als (2;19)?','Q staat horizontaal; P staat verticaal, ongeacht de volgorde in de formule.','Stel daarna de functie op die bij meer prijzen werkt.',true);
}
{
 const s=slide('De gezamenlijke vraagfunctie');example(s);
 text(s,'Q = qA + qB',60,269,1480,69,46,{bold:true});
 text(s,'Q = (15 − 3P) + (14 − 2P)',60,372,1480,75,48);
 text(s,'15 + 14 = 29          −3P − 2P = −5P',60,486,1480,64,39,{color:C.muted});
 text(s,'Q = 29 − 5P',60,599,1480,76,53,{bold:true,color:C.blue});
 text(s,'Beide rekenregels geldig: 0 ≤ P ≤ 5',60,739,1480,77,40,{bold:true,color:C.orange});
 notes(s,'69, 71','Verzamel gelijksoortige termen. De losse getallen zijn de twee hoeveelheden bij P=0: 15+14=29. Bij een euro prijsstijging vraagt A 3 liter minder en B 2 liter minder, samen 5 liter minder. De somregel geldt alleen waar beide oorspronkelijke regels gelden: tot en met 5. Bij P=5 is A precies nul, en de formule is daar nog geldig.','Waarom stopt de gezamenlijke regel bij 5 en niet bij 7?','Het optellen van de getallen geeft geen toestemming om geldigheidsgrenzen weg te laten.','Controleer de formule met de tabel.',true);
}
{
 const s=slide('De tabel controleert de somfunctie');example(s);
 table(s,[['P (€ per liter)','qA','qB','Q samen'],['0','15','14','29'],['2','9','10','19'],['4','3','6','9'],['5','0','4','4']],60,273,1480,365,[520,320,320,320],37);
 text(s,'Bij P = 4: Q = 29 − 5 × 4 = 9 liter per week',60,695,1480,72,42,{bold:true,color:C.blue});
 text(s,'Dit is gelijk aan 3 + 6 uit de afzonderlijke functies.',60,781,1480,51,34);
 notes(s,'69, 71','Alle hoeveelheden in de tabel zijn liter per week. Reken P=4 voor: A 15−3×4=3, B 14−2×4=6 en totaal 9. De somfunctie geeft ook 9. De controle verbindt tabel en algebra. P=5 mag nog mee omdat A dan precies nul is.','Welke tabelrij laat zien waar A niets meer vraagt?','Een tabelrij heeft één prijs. Tel nooit de hoeveelheid uit twee verschillende prijsrijen op.','Gebruik de grensprijzen voor de eindpunten van de grafiek.',true);
}
{
 const s=slide('De eindpunten van het geldige lijnstuk');example(s);
 text(s,'Q = 29 − 5P, alleen voor 0 ≤ P ≤ 5',60,264,1480,66,42,{bold:true,color:C.blue});
 table(s,[['Prijs','Berekening','Punt (Q; P)'],['P = 0','Q = 29 − 5 × 0 = 29','(29; 0)'],['P = 5','Q = 29 − 5 × 5 = 4','(4; 5)'],['P = 2','Q = 29 − 5 × 2 = 19','(19; 2)']],60,367,1480,300,[300,790,390],36);
 text(s,'Q horizontaal in liter per week. P verticaal in € per liter.',60,724,1480,87,37);
 notes(s,'48–49, 71–72','De vroegere vraaglijn ging tussen twee assnijpunten. Hier is eerst het geldige prijsinterval bepalend: P=0 geeft Q=29, P=5 geeft Q=4. De lijn hoeft dus niet tot de prijsas te lopen. Zet Q als eerste coördinaat. Het bekende P=2-punt controleert de rechte lijn. Kies een schaal waarop alle drie punten passen.','Waarom is (0;5,8) geen eindpunt voor deze opdracht?','Het algebraïsche snijpunt met de P-as ligt buiten 0≤P≤5. Dat is hier geen geldige tekening.','Verbind nu alleen de berekende eindpunten.',true);
}
{
 const s=slide('De gezamenlijke vraag binnen 0 ≤ P ≤ 5');example(s);
 xy(s,[curve('V samen',[29,19,4],[0,2,5]),guide('P=2',[0,19],[2,2]),guide('Q=19',[19,19],[0,2])]);
 text(s,'V samen',1140,294,400,54,37,{bold:true,color:C.blue});
 text(s,'Eindpunten\n(29; 0) en (4; 5)',1140,385,400,125,35,{bold:true});
 text(s,'Controlepunt\n(19; 2)',1140,555,400,113,35);
 text(s,'Stop bij P = 5.',1140,742,400,64,36,{bold:true,color:C.orange});
 notes(s,'69, 71–72','De native XY-grafiek tekent de berekende coördinaten op numerieke assen. De lijn loopt alleen van (29;0) naar (4;5). Het punt bij 2 euro ligt op de lijn en de hulplijnen sluiten precies aan. Wijs de horizontale hoeveelheidsas en verticale prijsas aan.','Waar zie je dat deze lijn bij P=5 nog niet de prijsas raakt?','Een rechte lijn binnen het interval mag je niet automatisch daarbuiten verlengen.','Onderzoek wat er gebeurt bij een hogere prijs.',true);
}
{
 const s=slide('Boven de koopgrens rekent iedere koper apart');example(s);
 text(s,'P = € 6 per liter',60,264,1480,67,43,{bold:true,color:C.orange});
 table(s,[['Koper','Controle van de grens','Geldige vraag'],['A','€ 6 is boven € 5','0 liter per week'],['B','€ 6 ligt tussen € 0 en € 7','14 − 2 × 6 = 2']],60,371,1480,281,[220,730,530],34);
 text(s,'Q = 0 + 2 = 2 liter per week',60,708,1480,76,49,{bold:true,color:C.green});
 notes(s,'70–71','A koopt nul, niet 15−3×6=−3 liter. B koopt nog 2 liter per week. De geldige som is dus 2. De oude somregel zou 29−5×6=−1 geven: daarin wordt B’s 2 verminderd met de niet-bestaande −3 van A. Behoud de vraag van B volledig.','Waarom is A’s bijdrage nul en niet min drie?','Een negatieve rekenuitkomst buiten het prijsinterval is geen negatieve vraag.','Bekijk dezelfde beperking in de grafiek.',true);
}
{
 const s=slide('De gezamenlijke lijn verandert boven € 5');example(s);
 xy(s,[curve('Beide regels geldig',[29,19,9,4],[0,2,4,5]),curve('Alleen B koopt',[4,2,0],[5,6,7],C.orange),guide('P=6',[0,2],[6,6])]);
 text(s,'Tot en met € 5',1140,285,400,55,35,{bold:true,color:C.blue});
 text(s,'Som van beide\nrekenregels',1140,350,400,115,35);
 text(s,'Boven € 5',1140,510,400,55,35,{bold:true,color:C.orange});
 text(s,'Alleen B koopt.\nBij € 6: Q = 2.',1140,575,400,120,35);
 text(s,'Boven € 7: Q = 0.',1140,751,400,55,33,{bold:true});
 notes(s,'70','De schalen zijn hetzelfde als in de vorige gezamenlijke grafiek: Q 0–30 en P 0–8. Tot P=5 loopt het blauwe segment. Daarna volgt de oranje lijn de vraag van B: (4;5), (2;6), (0;7). Boven 7 vragen beiden niets. Een formele stukgewijze formule is geen leerdoel; telkens per koper de grens controleren is genoeg.','Waarom verandert de richting van de lijn bij € 5?','Het verdwijnen van A’s vraag doet B’s vraag niet verdwijnen.','Laat de leerlingen de startverkenning opnieuw bekijken en begin daarna bij basis 25.',true);
}
overview('Zelfstandig werken',4);
const targetFooter='§1.2.3 · Opgave 30 · Boekpagina 76';
{
 const s=slide('Opgave 30 · Reserveringen bij een spellenclub',targetFooter);
 text(s,'Een spellenclub onderzoekt de vraag van twee afzonderlijke groepen.',60,194,1480,111,40,{bold:true});
 table(s,[['Groep','Vraagfunctie','Geldig bij'],['A','QA = 18 − 3P','0 ≤ P ≤ 6'],['B','QB = 24 − 2P','0 ≤ P ≤ 12']],60,350,1480,265,[300,680,500],38);
 text(s,'Q is reserveringen per week. P is euro per reservering.',60,663,1480,67,37,{bold:true,color:C.blue});
 text(s,'Boven de eigen koopgrens vraagt de groep nul.\nDe overige omstandigheden blijven gelijk.',60,746,1480,88,34);
 notes(s,'76','Begin deze bespreking pas na een eigen poging. Dit is de complete oorspronkelijke context uit opgave 30, nu met groepsvragen QA en QB. De volgende twee dia’s geven de lege tabel en alle vragen. Toon eerst alle vragen voordat een antwoorddia verschijnt.','Wat verschilt aan product en eenheid ten opzichte van het uitlegvoorbeeld?','De getallen uit de ijstheesituatie zijn hier niet van toepassing. Dit zijn afzonderlijke groepen, geen individuele liters.','Toon de tabel en vragen a en b zonder antwoord.');
}
{
 const s=slide('Opgave 30 · Vragen a en b',targetFooter);
 text(s,'a. Neem de tabel over en vul alle lege hoeveelheden in.',60,187,1480,80,37);
 table(s,[['P (€ per reservering)','QA','QB','Q samen'],['0','…','…','…'],['2','…','…','…'],['4','…','…','…'],['6','…','…','…']],60,308,1480,351,[610,290,290,290],34);
 text(s,'b. Stel de gezamenlijke vraagfunctie op voor 0 ≤ P ≤ 6.\nControleer de formule met de tabelwaarde bij € 4.',60,714,1480,115,37);
 notes(s,'76','De tabel is leeg zoals in het boek. Dit zijn de volledige deelvragen a en b. De functies staan op de voorafgaande dia. Herhaal die indien nodig zonder de tabel te vullen.','Welke eigen tussenstappen wil je straks vergelijken?','De oplossing verschijnt pas nadat ook c, d en e getoond zijn.','Toon de resterende deelvragen.');
}
{
 const s=slide('Opgave 30 · Vragen c, d en e',targetFooter);
 text(s,'c. Teken in je schrift de gezamenlijke vraag voor 0 ≤ P ≤ 6. Noteer de eindpunten en markeer het punt bij € 4.',60,220,1480,156,40);rule(s,60,408,1480);
 text(s,'d. Bereken de gezamenlijke vraag bij P = € 8.',60,457,1480,95,40);rule(s,60,589,1480);
 text(s,'e. Een leerling trekt de lijn uit c door en vindt bij € 8 een gezamenlijke vraag van 2 reserveringen. Leg uit waarom dit onjuist is.',60,642,1480,175,40);
 notes(s,'76','Nu zijn alle oorspronkelijke vragen zonder oplossing beschikbaar. De 2 reserveringen in e zijn de geciteerde foute leerlinguitkomst uit de vraag, niet het antwoord. Laat leerlingen hun eigen aanpak erbij houden.','Bij welk onderdeel moest je eerst de geldigheidsgrens bekijken?','Bij d geldt niet langer het interval dat b en c noemen.','Begin de uitwerking bij de tabel, met een zichtbare berekening.');
}
{
 const s=slide('Opgave 30a · Eén tabelrij berekenen',targetFooter);
 text(s,'Bij P = € 4 per reservering',60,211,1480,70,44,{bold:true,color:C.blue});
 const r=[['Groep A','QA = 18 − 3 × 4 = 6'],['Groep B','QB = 24 − 2 × 4 = 16'],['Samen','Q = 6 + 16 = 22']];
 r.forEach((a,i)=>{const y=348+i*140;text(s,a[0],60,y,360,72,40,{bold:true,color:i===2?C.orange:C.ink});text(s,a[1],440,y,1100,74,47,{bold:i===2});});
 text(s,'22 reserveringen per week bij € 4 per reservering',60,773,1480,61,38,{bold:true,color:C.green});
 notes(s,'76','Beide regels zijn bij P=4 geldig. Vermenigvuldig eerst en trek dan af. De ene groep vraagt 6 en de andere 16, samen 22. De eenheid is reserveringen per week; de prijs is euro per reservering. Gebruik precies dezelfde werkwijze in iedere rij.','Waarom mag je hier beide oorspronkelijke regels gebruiken?','22 is een hoeveelheid per week, geen prijs en geen voorspelling van daadwerkelijke verkoop.','Vul de overige rijen in.');
}
{
 const s=slide('Opgave 30a · De volledige tabel',targetFooter);
 table(s,[['P (€ per reservering)','QA','QB','Q samen'],['0','18','24','42'],['2','12','20','32'],['4','6','16','22'],['6','0','12','12']],60,241,1480,398,[610,290,290,290],38);
 text(s,'Bij € 6 draagt A precies nul bij.',60,701,1480,63,43,{bold:true,color:C.blue});
 text(s,'Alle hoeveelheden: reserveringen per week',60,784,1480,51,34);
 notes(s,'76','P=0: 18−0=18 en 24−0=24, som42. P=2:18−6=12 en 24−4=20, som32. P=4 is de vorige berekening. P=6:18−18=0 en 24−12=12, som12. De somfunctie blijft op de grens P=6 geldig. Iedere tabelrij gebruikt één prijs.','Welke rij laat de grens van de eerste groep zien?','Nul van A betekent niet nul van de hele markt.','Schrijf dezelfde regel nu als somfunctie.');
}
{
 const s=slide('Opgave 30b · Somfunctie en controle',targetFooter);
 text(s,'Q = (18 − 3P) + (24 − 2P)',60,216,1480,80,49);
 text(s,'Q = 42 − 5P',60,344,1480,85,55,{bold:true,color:C.blue});
 text(s,'Geldig voor 0 ≤ P ≤ 6',60,459,1480,64,39,{bold:true,color:C.orange});rule(s,60,560,1480);
 text(s,'Controle bij € 4',60,607,1480,62,40,{bold:true});
 text(s,'Q = 42 − 5 × 4 = 22 reserveringen per week',60,713,1480,98,44,{bold:true});
 notes(s,'76','18+24=42 en −3P−2P=−5P. De overlap van beide intervallen is 0 tot en met6. Bij4 geeft de somfunctie22, hetzelfde als6+16 in de tabel. Benoem zowel het algebraïsche verzamelen als de economische betekenis van de som.','Hoe bevestigt de tabel de gevonden formule?','Laat het geldigheidsinterval niet weg, ook al past de formule bij alle vier tabelrijen.','Gebruik de twee intervalgrenzen om te tekenen.');
}
{
 const s=slide('Opgave 30c · De punten voor de grafiek',targetFooter);
 table(s,[['P','Q = 42 − 5P','Punt (Q; P)'],['0','42 − 5 × 0 = 42','(42; 0)'],['6','42 − 5 × 6 = 12','(12; 6)'],['4','42 − 5 × 4 = 22','(22; 4)']],60,235,1480,354,[230,785,465],37);
 text(s,'Eindpunten: (42; 0) en (12; 6)',60,655,1480,69,44,{bold:true,color:C.blue});
 text(s,'Q horizontaal. P verticaal. Markeer ook (22; 4).',60,761,1480,62,38);
 notes(s,'76','Gebruik eerst de gevraagde intervalgrenzen P=0 en P=6. Die geven de eindpunten; P=4 geeft het te markeren punt. Q is de eerste coördinaat. Kies bijvoorbeeld Q van 0 tot 50 en P van 0 tot 10, zodat de punten duidelijk passen.','Waarom zoeken we hier geen tweede assnijpunt?','De verlengde lijn bereikt de P-as pas buiten het interval. Dat punt hoort niet bij de gevraagde tekening.','Verbind de eindpunten en markeer het controlepunt.');
}
{
 const s=slide('Opgave 30c · Alleen het gevraagde lijnstuk',targetFooter);
 xy(s,[curve('V samen',[42,22,12],[0,4,6]),guide('P=4',[0,22],[4,4]),guide('Q=22',[22,22],[0,4])],{y:233,h:565,xMax:50,xStep:10,yMax:10,yStep:2,units:'reserveringen per week',priceUnit:'reservering'});
 text(s,'V samen',1140,262,400,57,37,{bold:true,color:C.blue});
 text(s,'(42; 0)\n(12; 6)',1140,365,400,126,40,{bold:true});
 text(s,'Gemarkeerd:\n(22; 4)',1140,548,400,125,37);
 text(s,'0 ≤ P ≤ 6',1140,739,400,65,39,{bold:true,color:C.orange});
 notes(s,'76','De native XY-grafiek bevat de twee eindpunten en het punt bij 4. De horizontale hulplijn eindigt bij(22;4); de verticale bijQ=22. Het lijnstuk eindigt op(12;6), duidelijk vóór de P-as. De assen noemen de juiste eenheden. Andere correcte schalen in leerlingwerk mogen.','Welke markering verbindt de tabelwaarde bij 4 met de grafiek?','Doortrekken voorbij(12;6) verlaat het gevraagde interval.','Bereken nu een prijs buiten dat interval opnieuw per groep.');
}
{
 const s=slide('Opgave 30d · De vraag bij € 8',targetFooter);
 table(s,[['Groep','Eerst de koopgrens','Vraag bij € 8'],['A','€ 8 is boven € 6','QA = 0'],['B','€ 8 ligt binnen 0 tot 12','QB = 24 − 2 × 8 = 8']],60,240,1480,325,[210,680,590],35);
 text(s,'Q = 0 + 8 = 8 reserveringen per week',60,633,1480,79,48,{bold:true,color:C.green});
 text(s,'De resterende vraag van B telt volledig mee.',60,755,1480,67,39);
 notes(s,'76','A’s oorspronkelijke regel is bij 8 niet geldig. Economisch koopt de groep nul. B is nog binnen de eigen grens, dus 24−16=8. Samen8 reserveringen per week bij 8 euro per reservering.','Welke hoeveelheid mag je bij de som van B optellen?','De rekenuitkomst −6 uit A’s oude regel is geen aankoop.','Gebruik dit om de foute verlenging uit e te verklaren.');
}
{
 const s=slide('Opgave 30e · Waarom de verlenging faalt',targetFooter);
 text(s,'De ongeldige berekening',60,218,1480,66,40,{bold:true,color:C.orange});
 text(s,'42 − 5 × 8 = 2',60,315,1480,78,51);
 text(s,'Daarin zit: (18 − 3 × 8) + (24 − 2 × 8) = −6 + 8',60,431,1480,100,38);rule(s,60,570,1480);
 text(s,'A koopt nul. Er verdwijnen geen 6 reserveringen van B.',60,618,1480,100,39,{bold:true});
 text(s,'De geldige som is 0 + 8 = 8 reserveringen per week.',60,752,1480,72,42,{bold:true,color:C.green});
 notes(s,'76','De vraag noemt de onjuiste uitkomst2. Laat zien waar die vandaan komt: de buiten haar interval gebruikte somfunctie telt −6 van A bij 8 van B. De fout is dus inhoudelijk: je trekt niet-bestaande negatieve vraag af. Corrigeer de economische bijdrage van A naar 0 en behoud B’s8.','Welke ongeldige bijdrage zit verstopt in de uitkomst2?','Alleen zeggen dat de formule niet mag is minder volledig dan uitleggen welke negatieve bijdrage het probleem veroorzaakt.','Laat leerlingen ontbrekende stappen in hun eigen antwoord aanvullen.');
}
{
 const s=slide('Controle van je antwoord');
 const a=[['Tabel en formule','Elke rij heeft één prijs. De controle bij € 4 klopt.'],['Geldigheid','Q = 42 − 5P geldt alleen bij 0 ≤ P ≤ 6.'],['Grafiek','Eindpunten en (22; 4) hebben de juiste coördinaten.'],['Verklaring','Bij € 8 draagt A nul bij. B vraagt nog 8 per week.']];
 a.forEach((r,i)=>{let y=204+i*143;text(s,r[0],60,y,435,61,38,{bold:true,color:C.blue});text(s,r[1],545,y,990,112,36);});
 notes(s,'76','Laat leerlingen één concrete ontbrekende stap of verklaring in hun werk verbeteren. Controleer bij de grafiek tevens assen, eenheden, schaal en het beëindigen op(12;6). De tabel, functie en grafiek beschrijven hetzelfde bronmodel binnen het geldige interval.','Welke stap ga je in je eigen uitwerking aanvullen?','Een goed eindgetal zonder de gevraagde tekening of redenering is niet het volledige antwoord.','Sluit af met exact dezelfde route en huiswerkafspraak.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({...sourceManifest,slides:manifest,overviewSlides:overviews,tableSlides:[...new Set(tables)],chartSlides:[...new Set(charts)]},null,2));
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const draft=BUILD+'/candidate.pptx';await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/1.2.3 '+title+' – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...[...new Set(tables)].flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:[...new Set(charts)],materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:p.slides.items.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
