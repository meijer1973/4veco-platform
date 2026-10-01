// HOW TO ADAPT: retain the classroom overview and native chart helpers; derive
// assignments, teaching data and target questions anew from the edition manifest.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('412');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[];
const BASE='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/books/book-4/';
const EX='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const sh=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=str;sh.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return sh;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,footer='§4.1.2 Monopolie: kenmerken'){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,pages,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte pagina ${pages} van het COMPLETE boek. ${BASE}output/Boek_4_Compleet_v3.pdf\nLeerlingtekst: ${BASE}chapters/4.1/4.1.2%20manuscript.md\nAntwoorden: ${BASE}chapters/4.1/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Nachtkoepel en de kleine groenteteler zijn zelfgemaakte oefencases. De boekverwijzing betreft de methode, niet deze context of getallen.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.', 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.', 'Bespreken van de doelopgave: opgave 18.', 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §4.1.2 Monopolie: kenmerken');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Monopolie herkennen.\nBarrières en vraaglijnen uitleggen.\nPrijs en afzet berekenen\nen een prijskeuze beoordelen.',972,244,565,151,30,{name:'overview-goals'});rule(s,972,402,568);
 text(s,'Startopdracht',972,426,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 19 · Opgaven 11 en 12\n11: terugblik, steun p. 10\n12: verkennen, theorie p. 16',972,481,565,118,30,{name:'overview-start'});rule(s,972,606,568);
 text(s,'Huiswerk',972,628,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.1.2 · Opgaven 13 t/m 18\nBasis: 13, 14 en 15\nZelfstandig: 16 en 17 · Doel: 18\nMaken en nakijken',972,682,565,154,30,{name:'overview-homework'});
 notes(s,'10, 16, 19–22',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Opgaven 11 en 12 staan op p. 19, basis 13–14 op p. 20 en 15 op p. 21, zelfstandig 16–17 op p. 21 en doel 18 op p. 22. Huiswerk is 13 t/m 18 maken en nakijken. Bonus 19 en herhaling 20 zijn extra. Opgave 11 haalt de prijsnemerprocedure op uit Boek 3 §3.2.3, met herhaald uitgewerkt voorbeeld in Boek 4 §4.1.1 op p. 10: P = GO = MO, MO = MK oplossen, richting MK en capaciteit controleren, TO − TK. Geef bij vastlopen die procedure als steun zonder de opgave voor te rekenen. Opgave 12 is verkenning van marktbegrenzing, nog geen veronderstelde beheersing: laat de uitleg onder 'Kijk eerst welke markt bedoeld wordt' op p. 16 lezen en laat het brongegeven over alternatieven aanwijzen. Keer vóór zelfstandig oefenen naar 12 terug: laat leerlingen hun eigen eerste verklaring verbeteren. De volledige route heeft geen bewezen éénlesfit; de handleiding adviseert voorlopig twee lessen van 55 minuten. Rond zo nodig later af zonder basiswerk over te slaan.`,phase==='Startopdracht'?'Welke vraag kun je met eerdere kennis aanpakken, en welke met de theorie?':'Welke stap uit de oefenroute werk je af?','Hoofdstukpagina 15 is complete-boekpagina 19. Gebruik steeds de gedrukte boekpagina.','Ga naar de volgende lesfase; bij afsluiting: huiswerk in de agenda.');
}
function series(name,x,y,color=C.blue,style='solid',marker='none',labels=[]){return {name,xValues:x,values:y,line:{fill:color,width:style==='dashed'?2:4,style},marker:{symbol:marker,size:8},dataLabelOverrides:labels.map(([idx,txt,pos='top'])=>({idx,text:txt,position:pos,showValue:false,textStyle:{typeface:FONT,fontSize:27,fill:C.ink}}))};}
function graph(s,ss,{x=60,y=220,w=990,h=575,xmax=144,ymax=36,xstep=24,ystep=6,xlabel='q (kaartjes per avond)',ylabel='P (€ per kaartje)'}={}){
 const axis=(title,max,majorUnit)=>({min:0,max,majorUnit,numberFormatCode:'0',title:{text:title,textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}});
 const ch=s.charts.add('scatter',{position:{left:x,top:y,width:w,height:h},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false},xAxis:axis(xlabel,xmax,xstep),yAxis:{...axis(ylabel,ymax,ystep),majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);return ch;
}
const night=(points=false)=>series('Vraag = GO',[0,24,72,96,120],[30,24,12,6,0],C.blue,'solid',points?'circle':'none',[...(points?[[1,'A'],[2,'B']]:[]),[3,'Vraag']]);
function targetSeries(points=true){return [series('Vraag = GO',[0,60,120,180,240],[24,18,12,6,0],C.blue,'solid',points?'circle':'none',[...(points?[[1,'A'],[2,'B']]:[]),[3,'Vraag']]),series('Hulplijn A',[0,60,60],[18,18,0],C.muted,'dashed'),series('Hulplijn B',[0,120,120],[12,12,0],C.muted,'dashed')];}
const targetOpts={xmax:240,ymax:24,xstep:60,ystep:6,xlabel:'q (kaartjes per dag)'};
overview('Startopdracht',2);
{
 const s=slide('Terugblik: de prijsnemer');
 table(s,[['Keuze van één onderneming','Bekende aanpak'],['Gegeven marktprijs','P = GO = MO'],['Productie kiezen','MO = MK oplossen'],['Keuze controleren','MK-verloop, capaciteit en zo nodig q = 0'],['Winst berekenen','TO = P × q, daarna TO − TK']],60,205,1480,455,[630,850],34);
 text(s,'De hele markt bepaalt P. Eén kleine onderneming kiest q.',60,718,1480,91,41,{bold:true,color:C.blue});
 notes(s,'8–10, 17, 19','Haal alleen de bekende procedure op. Boek 3 §3.2.3 behandelt richting van MK, capaciteit en niet produceren. In Boek 4 staat een herhaling in het uitgewerkte voorbeeld van §4.1.1 op p. 10. Bespreek zo nodig een leerlingaanpak bij start 11, maar gebruik de startopgave niet als nieuw uitlegvoorbeeld. Een horizontale ondernemingslijn zegt niets over een horizontale marktvraag.','Welke grootheid ligt voor één kleine prijsnemer vast?','MO = MK zonder haalbaarheid en richting te controleren is geen volledig bewijs.','Onderzoek nu waarom er soms maar één aanbieder overblijft.');
}
{
 const s=slide('Monopolie op een afgebakende markt',EX);
 text(s,'Nachtkoepel verkoopt als enige toegang tot de sterrenkoepel.',60,196,1480,91,40,{bold:true,color:C.blue});
 table(s,[['Welke markt?','Wat vertelt onze oefenbron?'],['Toegang tot deze sterrenkoepel','Eén aanbieder, geen vervangende toegang.'],['Alle avondactiviteiten in de regio','Ook bioscopen en theaters trekken bezoekers.']],60,332,1480,299,[670,810],33);
 text(s,'Monopolie: één aanbieder op de beschreven markt.',60,698,1480,78,42,{bold:true});
 notes(s,'16','Zelfgemaakt voorbeeld: Nachtkoepel heeft als enige toegang tot de koepel, maar bezoekers kunnen een andere avondactiviteit kiezen. Benoem de markt voordat je aanbieders telt. Een merk of een foto van één winkel bewijst niet dat er één aanbieder op de relevante markt is. Laat start 12 daarna opnieuw beoordelen met het eigen brongegeven over goede alternatieven.','Welke producten tel je mee als je de markt afbakent?','Eén merk is niet vanzelf een monopolie op de productmarkt.','Waarom kan een ander bedrijf niet dezelfde toegang aanbieden?',true);
}
{
 const s=slide('Toetredingsbarrières');
 table(s,[['Barrière uit de bron','Gevolg voor een nieuwe aanbieder'],['Exclusieve vergunning','Een ander bedrijf mag de dienst niet aanbieden.'],['Octrooi op een uitvinding','Een ander mag de beschermde uitvinding niet zomaar gebruiken.'],['Onmisbare voorziening','Een ander krijgt geen toegang tot het noodzakelijke middel.']],60,210,1480,425,[620,860],33);
 text(s,'Brongegeven + gevolg voor toetreding = onderbouwde uitleg',60,713,1480,95,40,{bold:true,color:C.blue});
 notes(s,'7–10, 16, 19','Contrasteer met §4.1.1: daar kunnen nieuwe aanbieders bij winst toetreden. Hier moet de bron duidelijk maken wat toetreding verhindert. In het uitlegvoorbeeld heeft alleen Nachtkoepel de sleutel en het gebruiksrecht van de noodzakelijke koepel. Dat is een concrete toegangsbarrière. Een octrooi bewijst op een brede markt met goede vervangers nog geen monopolie.','Wat houdt een nieuwe aanbieder feitelijk tegen?','Een barrière noemen zonder brongegeven of gevolg is te algemeen.','Vergelijk de vraaglijn van een kleine prijsnemer met die van een monopolist.');
}
{
 const s=slide('De vraaglijn van één kleine prijsnemer',EX);
 graph(s,[series('P = GO = MO',[0,40,50],[6,6,6],C.blue,'solid','none',[[1,'P = GO = MO']])],{xmax:50,ymax:10,xstep:10,ystep:2,xlabel:'q (kg per week)',ylabel:'P, GO, MO (€ per kg)'});
 text(s,'P = GO = MO',1110,295,430,60,36,{bold:true,color:C.blue});
 text(s,'Kleine groenteteler\nMarktprijs: € 6 per kg\nCapaciteit: 50 kg per week',1110,392,430,166,32);
 text(s,'q is de afzet van\néén onderneming.',1110,650,430,125,35,{bold:true});
 notes(s,'17','Eigen oefencase, los van Nachtkoepel: een kleine groenteteler is prijsnemer met marktprijs 6 euro per kg en capaciteit 50 kg per week. Binnen het model ontvangt hij bij iedere haalbare afzet dezelfde prijs. Q is de hele markt en kan veel groter zijn. De horizontale lijn is geen marktvraaglijn.','Waar komt de prijs voor deze kleine onderneming vandaan?','De teler kan niet onbeperkt produceren: de lijn stopt bij zijn capaciteit.','Wissel nu expliciet naar Nachtkoepel en kaartjes per avond.',true);
}
{
 const s=slide('De vraaglijn van de monopolist',EX);
 graph(s,[night()]);
 text(s,'Vraag = GO',1110,280,430,58,36,{bold:true,color:C.blue});
 text(s,'Nachtkoepel\nP = 30 − 0,25q\n0 ≤ q ≤ 120',1110,380,430,160,36);
 text(s,'q = Q\nDe enige aanbieder\nbedient de hele markt.',1110,622,430,148,34,{bold:true});
 notes(s,'17–18','Reset de context en eenheid: nu kaartjes per avond. Bij meer afzet daalt de prijs langs deze lijn, met overige vraagfactoren gelijk. Alle verkochte kaartjes hebben in één situatie dezelfde prijs. Dan TO = P × q en GO = TO/q = P voor q > 0. Daarom heet de vraaglijn ook GO. Bij q = 0 is GO niet te berekenen; het intercept is de grenswaarde van de vraagfunctie. Neem P = MO niet over: de marginale opbrengst volgt in §4.1.3.','Waarom is hier q gelijk aan Q?','Prijs en afzet zijn verbonden. Een monopolist kan niet beide onafhankelijk vastzetten.','Vul nu twee hoeveelheden in deze vraagfunctie in.',true);
}
{
 const s=slide('Twee prijs-afzetcombinaties',EX);
 text(s,'Nachtkoepel: P = 30 − 0,25q',60,191,1480,69,42,{bold:true,color:C.blue});
 table(s,[['Afzet per avond','Invullen in de vraagfunctie','Prijs per kaartje'],['A: 24 kaartjes','P = 30 − 0,25 × 24','€ 24'],['B: 72 kaartjes','P = 30 − 0,25 × 72','€ 12']],60,323,1480,310,[390,670,420],34);
 text(s,'Meer kaartjes verkopen vraagt hier om een lagere prijs.',60,702,1480,105,41,{bold:true});
 notes(s,'18','Eigen gegevens. Werk eerst A uit: 0,25 × 24 = 6, dus 30 − 6 = 24 euro per kaartje. Dan B: 0,25 × 72 = 18, dus 30 − 18 = 12 euro per kaartje. Afzet is per avond. Beide hoeveelheden liggen binnen 0 tot 120. Bereken eerst en lees daarna de combinaties af.','Waarom krijgt elk punt twee coördinaten?','q heeft de eenheid kaartjes per avond, P euro per kaartje.','Zoek beide berekende combinaties op de lijn.',true);
}
{
 const s=slide('Eén punt koppelt prijs en afzet',EX);
 graph(s,[night(true),series('Hulplijn A',[0,24,24],[24,24,0],C.muted,'dashed'),series('Hulplijn B',[0,72,72],[12,12,0],C.muted,'dashed')]);
 text(s,'Vraag = GO',1110,253,430,62,35,{bold:true,color:C.blue});
 text(s,'A: (24, 24)\nB: (72, 12)',1110,370,430,120,38,{bold:true});
 text(s,'72 kaartjes voor € 24?\nBij € 24 horen\n24 kaartjes per avond.',1110,577,430,187,33,{color:C.orange,bold:true});
 notes(s,'18, 20','Volg vanaf q eerst omhoog naar de lijn en daarna naar links naar P. De A-hoeveelheid en B-prijs horen bij verschillende punten. De combinatie (72,24) voldoet niet aan P = 30 − 0,25q. Dit is een andere opgave dan de toegewezen boekvragen.','Welk punt hoort bij een afzet van 72?','Een prijs van het ene punt en een afzet van het andere punt vormen geen geldige combinatie.','Je kunt ook beginnen bij een gegeven prijs.',true);
}
{
 const s=slide('De afzet bij een gegeven prijs',EX);
 text(s,'Nachtkoepel vraagt € 18 per kaartje.',60,190,1480,76,42,{bold:true,color:C.blue});
 const rows=[['Vergelijking','18 = 30 − 0,25q'],['Herschikken','0,25q = 30 − 18 = 12'],['Delen','q = 12 / 0,25 = 48 kaartjes per avond'],['Controleren','30 − 0,25 × 48 = 18']];
 rows.forEach(([a,b],i)=>{let y=312+i*120;text(s,a,60,y,365,65,33,{bold:true,color:C.blue});text(s,b,460,y,1080,80,39);});
 notes(s,'18, 20','Dit demonstreert de omgekeerde bewerking voor basisopgave 14b, die na het boekvoorbeeld voor het eerst expliciet gevraagd wordt. Trek niet alleen 18 van 30 af: deel ook door 0,25. Controleer door de gevonden q terug te plaatsen. 48 valt binnen 0–120. Het resultaat betekent dat de bezoekers samen bij deze prijs 48 kaartjes per avond willen kopen.','Hoe controleer je de gevonden hoeveelheid?','Een verschil in euro is nog geen hoeveelheid kaartjes.','Vergelijk nu prijsverandering met verandering van een andere vraagfactor.',true);
}
{
 const s=slide('Een andere eigen prijs: langs de lijn',EX);
 graph(s,[night(true)]);
 text(s,'Vraag = GO',1110,253,430,62,35,{bold:true,color:C.blue});
 text(s,'Prijs: € 24 naar € 12\nAfzet: 24 naar 72',1110,391,430,119,35,{bold:true});
 text(s,'Overige vraagfactoren\nblijven gelijk.\nDe vraaglijn blijft staan.',1110,595,430,163,34);
 notes(s,'17, 21','De prijsverandering kiest een ander punt op dezelfde vraaglijn. A naar B verlaagt P en verhoogt q. Laat een leerling met de hand de richting langs de lijn aanwijzen. Maak de oorzaak expliciet: het gaat om de eigen kaartjesprijs.','Welke factor verandert hier?','Een lagere eigen prijs is geen rechtsverschuiving van de vraaglijn.','Verander nu bezoekersvoorkeuren terwijl we dezelfde prijs vergelijken.',true);
}
{
 const s=slide('Meer belangstelling: een andere vraaglijn',EX);
 graph(s,[series('V0',[0,96,120],[30,6,0],C.muted,'solid','none',[[1,'V₀']]),series('V1',[0,120,144],[36,6,0],C.green,'solid','none',[[1,'V₁']]),series('Vergelijk bij P = 18',[0,72],[18,18],C.muted,'dashed'),series('Oude q',[48,48],[0,18],C.muted,'dashed'),series('Nieuwe q',[72,72],[0,18],C.muted,'dashed')],{xmax:144,ymax:36,xstep:24,ystep:6});
 text(s,'V₀: P = 30 − 0,25q\nV₁: P = 36 − 0,25q',1090,245,455,120,32,{bold:true});
 text(s,'Bij dezelfde € 18:\n48 naar 72 kaartjes\nper avond.',1090,418,455,172,34,{bold:true,color:C.green});
 text(s,'Meer belangstelling\nbij elke prijs.\nDe vraaglijn schuift rechts.',1090,639,455,166,32);
 notes(s,'17, 21','Extra eigen uitlegvoorbeeld voor de bewerking uit basisopgave 15. Een populaire sterrennacht vergroot de belangstelling bij elke prijs. Neem als nieuwe oefenfunctie P = 36 − 0,25q, domein 0–144 en voldoende capaciteit. Vergelijk horizontaal bij 18 euro: q0=(30−18)/0,25=48 en q1=(36−18)/0,25=72. De nieuwe lijn ligt bij elke gemeenschappelijke prijs verder naar rechts. Het is een andere situatie; de eerdere vraagfunctie gold bij onveranderde overige factoren. Combineer oorzaken pas daarna: bij een rechtsverschuiving én lagere prijs groeit afzet door beide effecten. De precieze groei kun je zonder cijfers niet bepalen.','Waarom vergelijken we hier bij dezelfde prijs?','Meer belangstelling en een lagere eigen prijs zijn verschillende oorzaken, ook als beide meer afzet geven.','Controleer het onderscheid en keer terug naar start 12.',true);
}
{
 const s=slide('Korte controle vóór het oefenen');
 table(s,[['Uitspraak','Jouw verklaring'],['Eén merk bewijst een monopolie.','Welke markt en welke alternatieven?'],['De eigen prijs daalt.','Langs de vraaglijn of een andere lijn?'],['GO is gelijk aan P.','Welke afspraak geldt voor de kaartjesprijs?']],60,235,1480,350,[740,740],34);
 text(s,'Terug naar startopgave 12: verbeter je eerste verklaring.',60,670,1480,102,40,{bold:true,color:C.blue});
 notes(s,'16–19, 21','Laat eerst antwoorden. Eén merk bewijst geen monopolie als er goede alternatieven zijn. De eigen prijs verandert de plek op de bestaande lijn. GO = P geldt als alle verkochte eenheden dezelfde prijs krijgen en q > 0. Laat start 12 opnieuw proberen met bronbewijs; dit is terugkeer na verkenning. Help bij een ontbrekende marktgrens voordat leerlingen zelfstandig beginnen.','Welk brongegeven bepaalt of je één aanbieder telt?','De startverkenning is geen bewijs dat nieuwe leerstof al beheerst werd.','Toon het overzicht en start bij basisopgaven 13–15.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 18: Eilandveer','§4.1.2 · Opgave 18 · Boekpagina 22');
 text(s,'Bron A · Eilandveer',60,200,1480,65,40,{bold:true,color:C.blue});
 text(s,'Voor de directe verbinding tussen Haven en Eiland heeft Eilandveer als enige een vergunning. In de onderzochte periode krijgt geen ander bedrijf toegang.',60,303,1480,163,38);
 text(s,'Reizigers kunnen hun reis wel uitstellen of afzien van de overtocht. Alle kaartjes in een gekozen situatie hebben dezelfde prijs.',60,505,1480,155,38);
 text(s,'De capaciteit is 240 kaartjes per dag.',60,720,1480,72,42,{bold:true});
 notes(s,'22','Bespreek de doelopgave nadat leerlingen die zelf hebben geprobeerd. Dit is de volledige Bron A, zonder uitwerking. Laat leerlingen hun eigen werk erbij nemen. De volgende dia toont Bron B en de oorspronkelijke gegevens van figuur 4. Daarna volgen alle vijf deelvragen, vóór de antwoorden.','Welke informatie geeft de bron over de periode en de capaciteit?','Capaciteit en vraag zijn verschillende begrenzingen.','Lees ook Bron B en figuur 4.');
}
{
 const s=slide('Opgave 18: Bron B en figuur 4','§4.1.2 · Opgave 18 · Boekpagina 22');
 text(s,'P = 24 − 0,10q. Overige vraagfactoren blijven gelijk.',60,182,1480,59,36,{bold:true});
 graph(s,targetSeries(),{...targetOpts,y:265,h:540});
 text(s,'Vraag = GO',1110,297,430,60,35,{bold:true,color:C.blue});
 text(s,'P: euro per kaartje\nq: kaartjes per dag\nvan 0 tot 240',1110,426,430,163,33);
 text(s,'Gebruik de lijn om\nde berekende combinaties\nte controleren.',1110,675,430,132,31);
 notes(s,'22','Volledige Bron B met figuur 4 als bewerkbare XY-grafiek. A en B, de hulplijnen en schalen zijn gelijk aan het boek. De figuur bevat in het boek zelf reeds afleesbare coördinaten; dit is bronmateriaal, nog geen uitgewerkte beantwoording. Alle prijzen gelden uniform per gekozen situatie.','Welke grootheden staan op de assen?','De hoeveelheid is per dag, niet per week of per avond zoals in het eerdere uitlegvoorbeeld.','Toon alle vragen voordat je oplossingen bespreekt.');
}
{
 const s=slide('Opgave 18: deelvragen a, b en c','§4.1.2 · Opgave 18 · Boekpagina 22');
 text(s,'Gebruik beide bronnen en figuur 4.',60,185,1480,63,35,{bold:true,color:C.blue});
 text(s,'a. (2p) Welk gegeven vormt hier een toetredingsbarrière? Leg uit waarom dit een monopolie op de beschreven verbinding ondersteunt.',60,290,1480,155,37);
 text(s,'b. (2p) Noem twee verschillen met volkomen concurrentie: één over toetreding en één over de vraaglijn van de onderneming.',60,486,1480,150,37);
 text(s,'c. (2p) Bereken de prijs bij punt A met q = 60 en bij punt B met q = 120.',60,696,1480,118,37);
 notes(s,'22','Toon de volledige vragen a–c zonder oplossingen. Elk onderdeel is 2 punten in het boek. Een bronantwoord vereist gegeven en gevolg. Rekenen bij c betekent substitutie én uitkomst met eenheid. Geef de uitwerking pas na de volgende vragendia.','Welke twee aspecten vraagt b om te vergelijken?','De marktvraag van volkomen concurrentie is iets anders dan de vraaglijn van één kleine onderneming.','Lees ook d en e.');
}
{
 const s=slide('Opgave 18: deelvragen d en e','§4.1.2 · Opgave 18 · Boekpagina 22');
 text(s,'d. (2p) De eigenaar wil 120 kaartjes verkopen voor € 18. Is dat volgens de bron haalbaar? Onderbouw met de vraagfunctie.',60,236,1480,175,40);
 rule(s,60,453,1480);
 text(s,'e. (2p) Beoordeel: “Zonder concurrenten kan ik elke prijs vragen én dezelfde afzet houden.” Gebruik de bron om je antwoord te begrenzen.',60,506,1480,200,40);
 notes(s,'22','Alle vijf deelvragen en beide bronnen zijn nu beschikbaar. Laat leerlingen aangeven waar hun eigen uitwerking twijfelt, zonder al antwoorden te dicteren. Pas daarna begint de bespreking.','Welke bron helpt om de uitspraak bij e te begrenzen?','Een ja/nee-antwoord zonder onderbouwing voldoet niet.','Begin met a: wat belemmert de toegang?');
}
{
 const s=slide('Opgave 18a: de exclusieve vergunning','§4.1.2 · Opgave 18 · Boekpagina 22');
 const rows=[['Brongegeven','Alleen Eilandveer krijgt een vergunning.'],['Gevolg','Andere bedrijven krijgen deze periode geen toegang.'],['Conclusie','Eén aanbieder op de directe verbinding Haven–Eiland.']];
 rows.forEach(([a,b],i)=>{let y=232+175*i;text(s,a,60,y,375,71,36,{bold:true,color:C.blue});text(s,b,470,y,1060,125,40);});
 text(s,'Dit alleenrecht vormt een toetredingsbarrière.',60,767,1480,65,37,{bold:true,color:C.green});
 notes(s,'22','Antwoordmodel 18a. Verbind de exclusieve vergunning met het feit dat een ander niet mag aanbieden. Begrens de conclusie tot de directe verbinding en de onderzochte periode. Claim geen monopolie op alle reizen of alle vakanties.','Waarom is alleen het woord vergunning onvoldoende?','Een gewone vergunning die elke nieuwkomer kan krijgen is niet dezelfde barrière als een exclusieve vergunning.','Vergelijk nu toetreding en ondernemingsvraag.');
}
{
 const s=slide('Opgave 18b: twee verschillen','§4.1.2 · Opgave 18 · Boekpagina 22');
 table(s,[['Kenmerk','Volkomen concurrentie','Eilandveer'],['Toetreding','Vrij','Exclusieve vergunning verhindert toetreding.'],['Vraaglijn onderneming','Horizontaal bij de gegeven marktprijs','Dalend: Eilandveer bedient de hele markt.']],60,231,1480,433,[340,570,570],34);
 text(s,'Vergelijk steeds één onderneming met één onderneming.',60,735,1480,78,39,{bold:true,color:C.blue});
 notes(s,'22','Antwoordmodel 18b. Eén kleine prijsnemer kan binnen zijn capaciteit afzetten tegen de gegeven prijs. De monopolist ziet de dalende vraag van de hele afgebakende markt. Bij beide is GO = P als de prijs uniform is. Het verschil betreft het verloop van P bij een andere q.','Welke lijn hoort bij de hele markt en welke bij een kleine aanbieder?','Veel aanbieders betekent niet dat de gezamenlijke marktvraag horizontaal is.','Bereken de coördinaten van A.');
}
for(const [label,q,price] of [['A',60,18],['B',120,12]]){
 const s=slide(`Opgave 18c: punt ${label}`,'§4.1.2 · Opgave 18 · Boekpagina 22');
 graph(s,[series('Vraag = GO',[0,q,180,240],[24,price,6,0],C.blue,'solid','circle',[[1,label],[2,'Vraag']]),series('Hulplijn',[0,q,q],[price,price,0],C.muted,'dashed')],targetOpts);
 text(s,'Vraag = GO',1100,255,440,60,35,{bold:true,color:C.blue});
 text(s,`q = ${q} kaartjes per dag`,1100,363,440,102,34,{bold:true});
 text(s,`P = 24 − 0,10 × ${q}\nP = 24 − ${q/10}\nP = € ${price} per kaartje`,1100,499,440,191,34);
 text(s,`${label}: (${q}, ${price})`,1100,741,440,62,39,{bold:true,color:C.green});
 notes(s,'22',`Antwoordmodel 18c, punt ${label}. Formule P = 24 − 0,10q, substitutie q = ${q}, aftrek ${q/10}, resultaat ${price} euro per kaartje. Lees ter controle de horizontale en verticale coördinaat langs de hulplijnen. ${q} ligt binnen 0–240.`, 'Wat controleer je op de grafiek na het rekenen?','Noteer niet alleen een getal maar ook euro per kaartje.',label==='A'?'Herhaal voor B.':'Onderzoek het voorstel om de afzet van B met de prijs van A te combineren.');
}
{
 const s=slide('Opgave 18d: 120 kaartjes voor € 18?','§4.1.2 · Opgave 18 · Boekpagina 22');
 text(s,'Bij een prijs van € 18:',60,193,1480,63,38,{bold:true,color:C.blue});
 text(s,'18 = 24 − 0,10q\n0,10q = 6\nq = 6 / 0,10 = 60 kaartjes per dag',60,290,1480,230,44);
 rule(s,60,567,1480);
 text(s,'120 kaartjes per dag vragen om € 12 per kaartje.',60,615,1480,80,41,{bold:true,color:C.orange});
 text(s,'Capaciteit: 120 < 240. De vraag begrenst de verkoop.',60,739,1480,70,37,{bold:true});
 notes(s,'22','Antwoordmodel 18d. Nee: bij 18 euro willen reizigers 60 kaartjes per dag kopen. Controle: 24 − 0,10 × 60 = 18. Voor 120 kaartjes geldt P = 12. De capaciteit van 240 maakt 120 technisch mogelijk, maar creëert geen kopers tegen 18 euro. Alle kaartjes hebben per situatie dezelfde prijs.','Waarom lost extra capaciteit dit voorstel niet op?','Kunnen aanbieden is niet hetzelfde als tegen die prijs kunnen verkopen.','Beoordeel de bredere uitspraak over onbeperkte prijszetting.');
}
{
 const s=slide('Opgave 18e: de grens van marktmacht','§4.1.2 · Opgave 18 · Boekpagina 22');
 table(s,[['Wat kan Eilandveer?','Wat doen reizigers?'],['Invloed uitoefenen op de prijs','De reis uitstellen of afzien van de overtocht.'],['Een combinatie op de vraaglijn kiezen','Bij een hogere prijs minder kaartjes kopen.']],60,224,1480,360,[740,740],35);
 text(s,'De uitspraak is onjuist: alleenrecht neemt de dalende vraag niet weg.',60,661,1480,132,41,{bold:true,color:C.blue});
 notes(s,'22','Antwoordmodel 18e. Het bedrijf kan invloed op P uitoefenen maar niet elke prijs met dezelfde afzet combineren. Bron A noemt uitstellen en niet reizen. Bron B koppelt hogere prijs aan minder afzet. Dit geldt bij de afgebakende verbinding en ongewijzigde overige vraagfactoren. Zonder kosten weten we bovendien niet welke combinatie de meeste winst geeft. Laat leerlingen één ontbrekende reden verbeteren.','Welk concreet gedrag uit Bron A begrenst de marktmacht?','Een alleenrecht op aanbod dwingt niemand tot aankoop.','Rond af met huiswerk en de brug naar opbrengst in §4.1.3.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviews,tables,charts},null,2));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
// PowerPoint otherwise gives individual marker outlines theme colours. Set the
// marker outline only; data-point line overrides also change curve segments.
execFileSync(PYTHON,['-c',`
import sys
from zipfile import ZipFile
from lxml import etree as E
C='http://schemas.openxmlformats.org/drawingml/2006/chart'
A='http://schemas.openxmlformats.org/drawingml/2006/main'
ns={'c':C,'a':A}
with ZipFile(sys.argv[1]) as z: parts=[(i,z.read(i.filename)) for i in z.infolist()]
with ZipFile(sys.argv[1],'w') as z:
 for info,data in parts:
  if '/charts/' in info.filename and info.filename.endswith('.xml'):
   root=E.fromstring(data)
   for sp in root.findall('.//c:marker/c:spPr',ns):
    color=sp.find('a:solidFill/a:srgbClr',ns)
    if color is not None:
     old=sp.find('a:ln',ns)
     if old is not None: sp.remove(old)
     ln=E.SubElement(sp,'{'+A+'}ln',w='12700')
     E.SubElement(E.SubElement(ln,'{'+A+'}solidFill'),'{'+A+'}srgbClr',val=color.get('val'))
   data=E.tostring(root,xml_declaration=True,encoding='UTF-8')
  z.writestr(info,data)
`,draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.1.2 Monopolie - kenmerken – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,tables,charts,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
