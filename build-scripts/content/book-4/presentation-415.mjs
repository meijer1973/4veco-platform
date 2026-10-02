// HOW TO ADAPT: read the current book, answers, teacher route and printed footers.
// One overview source serves start, practice and closure. Runtime paths are external.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('415');
const M=JSON.parse(await fs.readFile(new URL('./presentation-415.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',title='4.1.5 Gemengde opgaven concurrentie en monopolie';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${M.lessonCommit}/edities/books34-v3/books/book-4/`;
const slides=[],tables=[],charts=[],overviewSlides=[],graphSpecs=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(heading,footer='§4.1.5 Gemengde opgaven: concurrentie en monopolie'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,heading,60,42,1480,96,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:heading});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, commit ${M.lessonCommit}. Gedrukte boekpagina ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.1/4.1.5%20manuscript.md\nAntwoorden: ${source}chapters/4.1/Antwoorden.md\nDocent: ${source}chapters/4.1/Docenteninformatie.md\n${extra}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function rows(s,values,{y=225,step=172,size=40}={}){
 values.forEach(([label,value],i)=>{text(s,label,60,y+i*step,470,120,34,{bold:true,color:C.blue});text(s,value,565,y+i*step,975,130,size);if(i<values.length-1)rule(s,60,y+i*step+140,1480);});
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Korte herhaling en aanpak.','Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 45.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=p.slides.add();s.background.fill=C.paper;overviewSlides.push(p.slides.items.length);slides.push({number:p.slides.items.length,title:'Deze les: §4.1.5 Gemengde opgaven: concurrentie en monopolie'});
 text(s,'Deze les: §4.1.5 Gemengde opgaven\nConcurrentie en monopolie',60,30,1480,110,46,{bold:true,name:'overview-title'});
 text(s,'Nu: '+phase,60,151,1480,43,30,{bold:true,color:C.blue,name:'phase'});rule(s,60,202,1480);
 text(s,'Lesroute',60,230,835,45,35,{bold:true});
 const ys=[291,381,438,495,602,696,773],hs=[83,45,45,95,80,60,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,230,568,45,35,{bold:true});
 text(s,'Model kiezen; q, prijs en winst\nberekenen. Fouten verbeteren\nen conclusies onderbouwen.',972,289,568,130,30,{name:'overview-goals'});rule(s,972,420,568);
 text(s,'Startopdracht',972,445,568,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 46 · Opgave 41\nEerste gemengde opgave',972,500,568,86,30,{bold:active===2,name:'overview-start'});rule(s,972,596,568);
 text(s,'Huiswerk',972,616,568,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.1.5 · Opgaven 41, 41A, 42–48\nVoorbereiding: 41, 41A, 42–44\nDoel: 45 · Verder oefenen: 46–48\nMaken en nakijken',972,678,568,156,30,{bold:active===7,name:'overview-homework'});
 text(s,'§4.1.5 · Boekpagina’s 46–50',60,848,1350,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 notes(s,'46–50',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start is de eerste werkelijke gemengde opgave, 41. De docentroute noemt voorbereiding 41, 41A, 42–44 en doeloefening 45. Er zijn geen aparte basis-, zelfstandige, bonus- of herhalingssecties. Huiswerk is alle gemengde opgaven: 41, 41A en 42 tot en met 48, maken en nakijken. 46–48 blijven dus inbegrepen. Start 41 haalt eerder onderwezen bronselectie uit §4.1.2 op: afgebakende markt, vervangers, toetredingsbarrière en gegeven marktprijs (boek p.16–19). Dit is retrieval, geen nieuwe procedure. Bespreek na de poging zo nodig waarom een foto geen volledig marktbeeld bewijst. Controleer dat leerlingen de verschillende markten los houden. De hele oefenroute heeft geen bewezen eenlesfit; vervolg kan als huiswerk of in een volgende les.`,phase==='Startopdracht'?'Welk brongegeven beslist jouw keuze?':'Welke opgave of stap vraagt nog uitleg?','Voorbereiding betekent hier gemengde oefening, niet een nieuw bedachte basisroute.',active===7?'Laat het volledige huiswerk noteren en inventariseer welke aanpak nog steun vraagt.':'Ga door naar de volgende lesfase.','Gebruik de gedrukte paginanummers uit de complete boek-PDF.');
}
function graph(s,{a,b,c,d,xmax=80,ymax=32,q,stage=0,label='KleurFix',capacity=60}){
 const series=[{name:'GO = P',xValues:[0,xmax],values:[a,a-b*xmax],line:{fill:C.blue,width:4},marker:{symbol:'none'}},{name:'MO',xValues:[0,xmax],values:[a,a-2*b*xmax],line:{fill:C.purple,width:4,style:'dashed'},marker:{symbol:'none'}},{name:'MK',xValues:[0,xmax],values:[d,d+2*c*xmax],line:{fill:C.orange,width:4},marker:{symbol:'none'}}];
 const price=a-b*q, marginal=a-2*b*q;
 if(stage>=1)series.push({name:'q-hulplijn',xValues:[q,q],values:[0,stage>=2?price:marginal],line:{fill:C.muted,width:2,style:'dashed'},marker:{symbol:'none'}},{name:'MO = MK',xValues:[q],values:[marginal],line:{fill:'none',width:0},marker:{symbol:'circle',size:10,fill:C.purple}});
 if(stage>=2)series.push({name:'P-hulplijn',xValues:[0,q],values:[price,price],line:{fill:C.blue,width:2,style:'dashed'},marker:{symbol:'none'}},{name:'Prijs op GO',xValues:[q],values:[price],line:{fill:'none',width:0},marker:{symbol:'circle',size:10,fill:C.blue}});
 const ch=s.charts.add('scatter',{position:{left:60,top:224,width:1100,height:584},series,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false},xAxis:{min:0,max:xmax,majorUnit:xmax===80?10:8,numberFormatCode:'0',title:{text:'q (kg per week)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:ymax,majorUnit:xmax===80?4:5,numberFormatCode:'0',title:{text:'Bedrag (€ per kg)',textStyle:{typeface:FONT,fontSize:26,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:0.6},line:{fill:C.ink,width:1.5}},chartFill:C.paper,chartLine:{fill:'none',width:0},plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphSpecs.push({slide:p.slides.items.length,label,a,b,c,d,xmax,ymax,q,stage,capacity,series});
 // Direct labels on curve segments, away from their crossings and guides.
 if(xmax===80){text(s,'GO = P',962,462,160,42,28,{bold:true,color:C.blue});text(s,'MK',992,337,80,42,28,{bold:true,color:C.orange});text(s,'MO',916,653,90,42,28,{bold:true,color:C.purple});}
 else{text(s,'GO = P',902,444,175,42,28,{bold:true,color:C.blue});text(s,'MK',967,529,90,42,28,{bold:true,color:C.orange});text(s,'MO',935,602,90,42,28,{bold:true,color:C.purple});}
 return ch;
}
overview('Startopdracht',2);
{
 const s=slide('De bron bepaalt de opbrengstroute');
 table(s,[['Wat vergelijk je?','Prijsnemer','Monopolist'],['Bronbewijs','Veel kleine aanbieders,\ngelijkwaardig product','Eén aanbieder, geen goede\nvervangers, barrière'],['Opbrengst','P = GO = MO\nMarktprijs is gegeven','GO = P uit de vraag\nMO volgt uit TO'],['Keuze van q','MO vergelijken met MK','MO vergelijken met MK'],['Daarna','Haalbaarheid en winst controleren','P uit GO; haalbaarheid\nen winst controleren']],60,215,1480,537,[350,540,590],31);
 notes(s,'16–19, 35–40','Korte herhaling na de startpoging. Vraag naar het beslissende brongegeven, niet naar de uiterlijke vorm van het bedrijf. GO is bij uniforme prijzen de verkoopprijs. De prijsnemer kan tegen de gegeven prijs afzetten binnen het model; bij een monopolist vereist meer afzet een lagere uniforme prijs. MO = MK is een kandidaatregel: controleer richting, capaciteit en waar nodig q = 0.','Welke lijn geeft de prijs bij elk model?','Een eigen merk bewijst geen monopolie. De marginale vergelijking alleen geeft nog geen volledige productieaanbeveling.','Pas de bekende stappen toe op een apart uitlegvoorbeeld.');
}
{
 const s=slide('Gel Nova: de marginale functies');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,177,1480,44,29,{bold:true,color:C.blue});
 text(s,'Exclusief procedé; geen goede vervangers in deze afgebakende markt.',60,234,1480,62,33);
 rows(s,[['Vraag en omzet','P = 26 − 0,25q\nTO = (26 − 0,25q)q = 26q − 0,25q²'],['Marginale opbrengst','MO = 26 − 0,50q'],['Totale en marginale kosten','TK = 0,125q² + 5q + 72\nMK = 0,25q + 5']],{y:340,step:153,size:37});
 text(s,'q: kg per week · P: €/kg · TK: €/week · Capaciteit: 36 kg per week',60,808,1480,34,25);
 notes(s,'25, 40','Zelfbedacht voorbeeld Gel Nova. Alle kg in een plan krijgen dezelfde prijs; 72 euro blijft deze week ook zonder productie bestaan. De bron maakt dit een monopolie. Vermenigvuldig de hele vraagfunctie met q. Differentieer daarna TO en TK. De constante 72 valt in MK weg maar blijft in TK. Data, context en uitkomsten zijn niet uit het boek.','Welke term in de kosten heeft afgeleide nul?','De constante kosten uit de winstberekening weglaten omdat hun afgeleide nul is.','Kies q, controleer de capaciteit en bepaal de prijs.','Eigen voorbeeld; alleen de methode is ontleend aan §4.1.3 en §4.1.4.');
}
{
 const s=slide('Gel Nova: eerst q, daarna de prijs');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,177,1480,44,29,{bold:true,color:C.blue});
 graph(s,{a:26,b:0.25,c:0.125,d:5,xmax:40,ymax:30,q:28,stage:2,capacity:36,label:'Gel Nova'});
 text(s,'26 − 0,50q\n= 0,25q + 5\n\nq = 28 kg',1190,248,350,190,34,{bold:true});
 text(s,'P = 26 − 0,25 × 28\nP = € 19 per kg',1190,513,350,119,32,{bold:true,color:C.blue});
 text(s,'MO = MK = € 12\nCapaciteit: 36 kg',1190,707,350,94,30);
 notes(s,'36–37, 40','Eigen voorbeeld. 21 = 0,75q geeft q = 28. MO daalt en MK stijgt: vóór 28 is uitbreiden gunstig, erna ongunstig. 28 is haalbaar bij capaciteit 36. Op het snijpunt is het marginale bedrag 12 euro per kg. Ga bij dezelfde q naar GO: 26 − 7 = 19 euro per kg. De grafiek toont functies tot 40 om de lijnrichting te zien; alleen q tot 36 is haalbaar. Laat de klas de route eerst mondeling terughalen, wijs daarna de hulplijnen aan.','Waarom betalen kopers 19 euro en geen 12 euro?','Een getal op MO gelijkstellen aan de verkoopprijs.','Controleer vervolgens de totale winst en de keuze om te produceren.','Uitlegvoorbeeld — niet uit het boek.');
}
{
 const s=slide('Gel Nova: winst en haalbaarheid');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,177,1480,44,29,{bold:true,color:C.blue});
 rows(s,[['Opbrengst','TO = 19 × 28 = € 532 per week'],['Kosten','TK = 0,125 × 28² + 5 × 28 + 72\nTK = 98 + 140 + 72 = € 310 per week'],['Winst','532 − 310 = € 222 per week\nBij q = 0: 0 − 72 = −€ 72 per week']],{y:257,step:170,size:38});
 text(s,'Bij een lagere capaciteitsgrens: controleer opnieuw de beste haalbare q.',60,797,1480,42,30,{bold:true,color:C.orange});
 notes(s,'38–40','Eigen voorbeeld. Positieve winst 222 is hoger dan het verlies 72 bij niet produceren. Controle via gemiddelden: (19 − 310/28) × 28 = 222, met ongeronde GTK. Bij een hypothetische capaciteit van 20 is 28 onhaalbaar. MO(20)=16 en MK(20)=10, dus winst neemt nog toe tot die grens. q=20 geeft P=21, TO=420, TK=222 en winst=198, beter dan q=0. Dit is extra uitleg binnen hetzelfde eigen voorbeeld; het is geen antwoord op toegewezen opgave 47. Een grotere capaciteit verplicht niet tot volledig benutten.','Wat moet je opnieuw controleren als de capaciteit daalt?','Maximale omzet en maximale winst verwarren, of altijd de volle capaciteit kiezen.','Herhaal de overige rekenbegrippen kort voordat leerlingen zelf aan de slag gaan.','Eigen context en getallen; boek alleen als methodebron.');
}
{
 const s=slide('Rekensteun bij de gemengde opgaven');
 table(s,[['Bewerking','Aanpak'],['Totalen en gemiddelden','TO = P × q     TK = GTK × q\nWinst = TO − TK = (P − GTK) × q'],['Procentuele verandering','(nieuw − oud) / oud × 100%'],['Prijselasticiteit','Ev = %Δq / %ΔP\nEv < −1: prijselastisch'],['Een conclusie controleren','Maximum van tabelrijen of van alle haalbare q?\nWinst van één bedrijf of gevolgen voor anderen?']],60,225,1480,545,[520,960],32);
 notes(s,'24–25, 35–40, 47, 50','Korte formuleherhaling. Bij q > 0 zijn GO=TO/q en GTK=TK/q. Break-even betekent TO=TK. Bij percentages is de oude waarde de noemer. Voor dalende vraag: Ev < −1 elastisch; −1 < Ev < 0 inelastisch; Ev = −1 unitair. Bij discrete veranderingen bereken je beide omzetten rechtstreeks, niet via een absolute vuistregel. Een uniforme prijsverlaging geeft opbrengst op extra kg en minder opbrengst op de eerder in het andere plan verkochte kg. Een tabelmaximum betreft alleen de gegeven plannen; een winstmaximum betreft de onderneming en is geen welvaartsoordeel. Haal bij 41A zo nodig de betekenis van normale beloning terug uit §4.1.1; los 41A hier niet vooraf op.','Welke vergelijking heb je nodig om break-even te toetsen?','Een hoger TO als bewijs voor een winstmaximum gebruiken.','Laat het overzicht staan en laat leerlingen de gemengde oefenroute zelf uitwerken.','Elasticiteitsmethode: Book 2, chat-2026, §2.2.1 Rekenen met de oude waarde en §2.2.2 Elasticiteit en omzet; exacte bestanden en hashes in bronmanifest.');
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 45 · Bron A: KleurFix','Opgave 45 · Boekpagina 48');
 text(s,'KleurFix verkoopt als enige een specifiek pigmentmengsel.',60,225,1480,110,44);
 text(s,'Voor de beschreven periode heeft het bedrijf exclusief toegang tot een noodzakelijke grondstof.',60,389,1480,145,43);
 text(s,'Er zijn binnen de afgebakende markt geen goede vervangers. Het bedrijf gebruikt een geel logo.',60,618,1480,145,43);
 notes(s,'48','Volledige bron A bij de werkelijke doeloefening 45. Leerlingen hebben deze eerst zelf geprobeerd. Geef nu eerst de drie bronnen, figuur en alle vragen; onthul nog geen antwoord.','Welke gegevens staan letterlijk in de bron?','Het antwoord op 45a nu al aanwijzen.','Lees de rekengegevens van bron B.');
}
{
 const s=slide('Opgave 45 · Bron B: de monopolist','Opgave 45 · Boekpagina 48');
 text(s,'P = 32 − 0,20q\nTK = 0,10q² + 8q + 120',60,224,1480,150,48,{bold:true,color:C.blue});
 text(s,'q: kg per week     P: euro per kg     TK: euro per week',60,413,1480,75,35);
 text(s,'De productiecapaciteit is 60 kg.\nDe € 120 is deze week onvermijdbaar.',60,538,1480,130,40);
 text(s,'Alle kg binnen een plan worden tegen dezelfde prijs verkocht.',60,736,1480,80,37);
 notes(s,'48','Volledige bron B in leesbare onderdelen. De uniforme prijs hoort bij één verkoopplan. De kosten 120 bestaan ook bij nul productie. Leg gegevens alleen vast, geef nog geen marginale functies of uitkomst.','In welke eenheid staat iedere formule?','Een bedrag per kg met een totaal per week verwarren.','Bekijk figuur 21 zonder oplossingen.');
}
{
 const s=slide('Opgave 45 · Figuur 21','Opgave 45 · Boekpagina 48');
 graph(s,{a:32,b:0.2,c:0.1,d:8,q:40,stage:0});
 text(s,'Bron B · KleurFix',1190,261,350,95,35,{bold:true});
 text(s,'De drie lijnen\nzijn gegeven.',1190,402,350,109,34);
 text(s,'Markeer straks\nje gekozen q\nen prijsroute.',1190,558,350,154,33,{bold:true,color:C.blue});
 text(s,'Capaciteit: 60 kg',1190,772,350,43,28);
 notes(s,'48','Figuur 21, opnieuw gezet als native XY-grafiek met dezelfde functies en assen: q 0–80 kg per week, bedrag 0–32 euro per kg. De drie lijnen zijn gegeven. Markeer op de volgende pagina je gekozen hoeveelheids- en prijsroute in deze figuur. De originele figuur toont ook waarden buiten capaciteit 60; die zijn geen haalbare productieplannen. Nog geen gekozen q of hulplijnen tonen.','Welke drie lijnen staan in de bronfiguur?','Alle getekende hoeveelheden automatisch haalbaar noemen.','Lees bron C op een afzonderlijke markt.','Figuurbron: '+source+'chapters/4.1/_assets/4.1.4_target.svg');
}
{
 const s=slide('Opgave 45 · Bron C: een afzonderlijke prijsnemer','Opgave 45 · Boekpagina 48');
 text(s,'Een kleine leverancier verkoopt op een andere markt een standaardmengsel. Hij neemt P = € 18 per kg als gegeven.',60,206,1480,144,40);
 text(s,'TK = 0,10q² + 8q + 120\nCapaciteit: 60 kg per week',60,403,1480,135,44,{bold:true,color:C.blue});
 text(s,'Zijn producten zijn gelijkwaardig aan die van vele andere leveranciers. De € 120 blijft deze week ook zonder productie bestaan.',60,585,1480,147,38);
 text(s,'B en C zijn afzonderlijke oefencases op verschillende markten.',60,790,1480,46,31,{bold:true});
 notes(s,'48','Volledige bron C. De prijsnemer verkoopt het standaardmengsel op een andere markt. B en C zijn afzonderlijke oefencases, niet twee beleidsvarianten van dezelfde markt. De kostenformule is bewust gelijk gehouden om de opbrengstroutes te vergelijken. De vragen staan op de tegenoverliggende boekpagina.','Welke gegevens zijn gelijk aan bron B en welke verschillen?','De twee bedrijven behandelen als voor en na monopolievorming.','Toon nu alle deelvragen zonder oplossingen.');
}
const questions=[
 ['a. (2p)','Noem het brongegeven dat de toetredingsbarrière verklaart. Welk genoemd detail heb je niet nodig voor de berekeningen?'],
 ['b. (3p)','Stel voor KleurFix TO, MO en MK op. Bereken de winstmaximale q en controleer het marginale verloop en de productiecapaciteit.'],
 ['c. (3p)','Bereken voor KleurFix de verkoopprijs en de totale winst. Laat zien dat niet produceren geen betere keuze voor deze week is.'],
 ['d. (2p)','Markeer in figuur 21 de gekozen q en P. Gebruik hulplijnen die duidelijk maken welke lijn je voor elk getal gebruikt.'],
 ['e. (3p)','Bereken voor de prijsnemer uit bron C de winstmaximale haalbare q en de totale winst. Leg uit waar zijn verkoopprijs vandaan komt.'],
 ['f. (2p)','Een leerling zegt: “Bij beide ondernemingen gebruik ik MO = MK,\ndus bij beide lees ik de prijs uit het snijpunt af.”\nBeoordeel. Gebruik beide berekende prijzen en het marginale bedrag van KleurFix.']
];
for(let i=0;i<3;i++){
 const s=slide(`Opgave 45 · Vragen ${'ace'[i]} en ${'bdf'[i]}`,'Opgave 45 · Boekpagina 49');
 text(s,'Gebruik bronnen A, B en C en figuur 21 op pagina 48.',60,182,1480,70,33,{bold:true,color:C.blue});
 questions.slice(i*2,i*2+2).forEach(([label,value],j)=>{text(s,label,60,303+j*253,155,74,38,{bold:true});text(s,value,237,303+j*253,1303,225,i===2?38:40);});
 notes(s,'48–49','Volledige oorspronkelijke deelvragen, inclusief punten. Alle bronnen en vragen gaan vóór de eerste antwoorddia. Gebruik de gedrukte pagina 48 uit het complete boek; de manuscriptverwijzing 44 is lokaal. Geef denktijd en laat leerlingen hun eigen aanpak erbij houden.','Welke deelvraag vraagt een berekening, welke vraagt bronbewijs?','Een getal zonder eenheid of een berekening zonder modelkeuze als volledig antwoord accepteren.',i===2?'Begin nu pas de stapsgewijze bespreking van a tot en met f.':'Lees de volgende twee deelvragen.');
}
{
 const s=slide('45a · Het bewijs voor de toetredingsbarrière','Opgave 45a · Boekpagina’s 48–49');
 rows(s,[['Beslissend brongegeven','Exclusieve toegang tot\neen noodzakelijke grondstof'],['Economische uitleg','Andere bedrijven kunnen niet\nover die grondstof beschikken.'],['Niet nodig voor rekenen','Het gele logo']],{y:240,step:185,size:43});
 notes(s,'48–49','Antwoord 45a. Verbind het gegeven exclusieve toegang aan het verhinderen van toetreding. Eén aanbieder en geen goede vervangers beschrijven de marktsituatie; de grondstoftoegang verklaart de barrière. Het logo levert geen relevante rekeninformatie.','Welke woorden verklaren waarom een andere aanbieder niet kan beginnen?','Een kleur of merknaam als toetredingsbarrière gebruiken.','Stel de drie gevraagde functies op.');
}
{
 const s=slide('45b · TO, MO en MK opstellen','Opgave 45b · Boekpagina’s 48–49');
 rows(s,[['Totale opbrengst','TO = (32 − 0,20q) × q\nTO = 32q − 0,20q²'],['Marginale opbrengst','MO = 32 − 0,40q'],['Marginale kosten','TK = 0,10q² + 8q + 120\nMK = 0,20q + 8']],{y:235,step:185,size:43});
 notes(s,'48–49','Antwoordmodel 45b. De gehele prijsfunctie maal q geeft TO. Neem de afgeleide: 32q wordt 32; −0,20q² wordt −0,40q. Bij kosten wordt 0,10q² 0,20q; 8q wordt 8; 120 heeft afgeleide nul. TO/TK in euro per week, MO/MK in euro per kg.','Waarom is de eerste term van TO 32q?','Alleen de tweede term van P met q vermenigvuldigen.','Los MO = MK op en controleer het karakter van de uitkomst.');
}
{
 const s=slide('45b · De hoeveelheid en de controles','Opgave 45b · Boekpagina’s 48–49');
 text(s,'32 − 0,40q = 0,20q + 8\n24 = 0,60q\nq = 40 kg per week',60,211,1480,236,46,{bold:true,color:C.blue});
 table(s,[['Vóór 40 kg','Bij 40 kg','Na 40 kg'],['MO > MK\nWinst stijgt','MO = MK\nOmslagpunt','MO < MK\nWinst daalt']],60,509,1480,200,[493,494,493],34);
 text(s,'40 ≤ 60: de gekozen afzet past binnen de productiecapaciteit.',60,771,1480,62,37,{bold:true,color:C.green});
 notes(s,'48–49','MO is dalend en MK stijgend. Bij q=30 is MO=20 en MK=14; bij q=50 is MO=12 en MK=18. De winst stijgt dus vóór de kruising en daalt daarna, niet andersom. q=40 is binnen capaciteit 60. De keuze bij nul productie controleren we bij c.','Wat bewijst dat het snijpunt een maximum oplevert?','MO = MK opschrijven zonder marginale richting en haalbaarheid te controleren.','Bereken de prijs op GO en de twee totalen.');
}
{
 const s=slide('45c · Verkoopprijs, opbrengst en kosten','Opgave 45c · Boekpagina’s 48–49');
 rows(s,[['Verkoopprijs op GO','P = 32 − 0,20 × 40\nP = € 24 per kg'],['Totale opbrengst','TO = 24 × 40\nTO = € 960 per week'],['Totale kosten','TK = 0,10 × 40² + 8 × 40 + 120\nTK = 160 + 320 + 120 = € 600 per week']],{y:226,step:193,size:40});
 notes(s,'48–49','Antwoordmodel 45c. Lees de prijs uit de vraagfunctie bij dezelfde q=40. Bereken TO=24 maal 40. Kwadrateer 40 vóór vermenigvuldiging met 0,10. Neem ook de onvermijdbare kosten 120 mee. Controle TO=32×40−0,20×40²=1280−320=960.','Welke functie geeft het bedrag dat de kopers betalen?','De marginale 16 euro per kg als verkoopprijs gebruiken.','Vergelijk de winst met het alternatief niet produceren.');
}
{
 const s=slide('45c · Produceren of niet produceren?','Opgave 45c · Boekpagina’s 48–49');
 table(s,[['Weekplan','TO','TK','Winst'],['40 kg produceren','€ 960','€ 600','€ 360'],['0 kg produceren','€ 0','€ 120','−€ 120']],60,262,1480,326,[550,310,310,310],36);
 text(s,'€ 360 per week is beter dan −€ 120 per week.',60,667,1480,77,45,{bold:true,color:C.green});
 text(s,'De onvermijdbare € 120 blijft in beide plannen bestaan.',60,780,1480,48,32);
 notes(s,'48–49','Winst is TO−TK: 960−600=360 per week. Niet produceren geeft 0−120=−120. Produceren is 480 euro beter. Dit is de keuze voor deze week, geen langetermijnbesluit. Controle via GTK: 600/40=15 euro/kg; (24−15)×40=360.','Welke kosten verdwijnen niet bij q = 0?','Nul productie gelijkstellen aan nul totale kosten.','Markeer de berekende hoeveelheid in de figuur.');
}
{
 const s=slide('45d · De hoeveelheid onder MO = MK','Opgave 45d · Boekpagina’s 48–49');graph(s,{a:32,b:0.2,c:0.1,d:8,q:40,stage:1});
 text(s,'MO = MK',1190,267,350,65,42,{bold:true,color:C.purple});
 text(s,'q = 40 kg\nper week',1190,383,350,130,40,{bold:true});
 text(s,'Snijpuntbedrag:\n€ 16 per kg',1190,597,350,110,33);
 notes(s,'48–49','Eerste stap 45d. De verticale hulplijn verbindt het snijpunt (40,16) met q=40 op de horizontale as. Dit is het marginale bedrag. De functies en asschalen blijven exact gelijk aan de onopgeloste figuur. Alleen de gekozen route verschijnt erbij.','Welke as geeft de gekozen hoeveelheid?','De 16 euro bij het snijpunt als verkoopprijs markeren.','Ga bij dezelfde q naar de GO-lijn.');
}
{
 const s=slide('45d · De prijs staat op GO','Opgave 45d · Boekpagina’s 48–49');graph(s,{a:32,b:0.2,c:0.1,d:8,q:40,stage:2});
 text(s,'Dezelfde q = 40',1190,264,350,100,38,{bold:true});
 text(s,'Prijs op GO:\n€ 24 per kg',1190,426,350,126,40,{bold:true,color:C.blue});
 text(s,'MO = MK:\n€ 16 per kg',1190,653,350,105,33,{color:C.purple});
 notes(s,'48–49','Tweede stap 45d. Verleng bij q=40 tot GO: punt (40,24). De horizontale hulplijn gaat van dit prijspunt naar de verticale as. 24 is P; 16 blijft MO=MK. Vraag leerlingen beide lijnen bij hun eigen tekening expliciet te benoemen.','Hoe laat jouw hulplijn zien dat je P van GO hebt afgelezen?','Een horizontale hulplijn vanuit het MO/MK-snijpunt als prijsroute gebruiken.','Begin de afzonderlijke prijsnemerscase met zijn gegeven marktprijs.');
}
{
 const s=slide('45e · De prijsnemer kiest zijn hoeveelheid','Opgave 45e · Boekpagina’s 48–49');
 text(s,'P = GO = MO = € 18 per kg',60,217,1480,80,48,{bold:true,color:C.blue});
 text(s,'18 = 0,20q + 8\n10 = 0,20q\nq = 50 kg per week',60,359,1480,226,46,{bold:true});
 text(s,'MK stijgt door MO: vóór 50 stijgt de winst, erna daalt zij.',60,666,1480,69,37);
 text(s,'50 ≤ 60: de hoeveelheid is haalbaar.',60,768,1480,64,39,{bold:true,color:C.green});
 notes(s,'48–49','Antwoord 45e. Markt C geeft P=18; één kleine leverancier neemt deze prijs als gegeven. Dus MO=18. Dezelfde kostenfunctie geeft MK=0,20q+8. q=50 ligt binnen capaciteit. Bij 40 is MK=16<18, bij 60 is MK=20>18. De winst stijgt eerst en daalt daarna.','Waar komt de 18 euro per kg vandaan?','De vraagfunctie van KleurFix op de andere markt gebruiken.','Bereken de totalen bij de prijsnemer.');
}
{
 const s=slide('45e · De winst van de prijsnemer','Opgave 45e · Boekpagina’s 48–49');
 rows(s,[['Opbrengst','TO = 18 × 50 = € 900 per week'],['Kosten','TK = 0,10 × 50² + 8 × 50 + 120\nTK = 250 + 400 + 120 = € 770 per week'],['Winst','900 − 770 = € 130 per week']],{y:245,step:178,size:40});
 text(s,'Controle: bij q = 0 is de winst −€ 120 per week.',60,794,1480,46,32,{bold:true,color:C.green});
 notes(s,'48–49','Antwoordmodel 45e: winst 130 euro per week. De aanvullende controle tegen q=0 bevestigt de beste weekkeuze: 130 is beter dan −120. Bij capaciteit 60 is TO=1080, TK=960 en winst=120, lager dan bij 50. Dit is geen reden om bedrijven op verschillende markten maatschappelijk te rangschikken.','Waarom gebruik je voor TK 50² en voor TO 18 × 50?','De capaciteit 60 invullen terwijl de winstmaximale hoeveelheid 50 is.','Beoordeel de foutmethode uit deelvraag f.');
}
{
 const s=slide('45f · Dezelfde hoeveelheidregel, andere prijsroute','Opgave 45f · Boekpagina’s 48–49');
 table(s,[['Bij de gekozen q','KleurFix','Prijsnemer'],['MO = MK bepaalt q','40 kg per week','50 kg per week'],['Marginaal bedrag','€ 16 per kg','€ 18 per kg'],['Verkoopprijs','GO = € 24 per kg','P = GO = MO = € 18 per kg']],60,237,1480,411,[510,480,490],33);
 text(s,'De leerling verwart bij KleurFix MO met de verkoopprijs.',60,702,1480,66,40,{bold:true,color:C.orange});
 text(s,'Twee afzonderlijke markten: geen conclusie over maatschappelijke welvaart.',60,791,1480,42,30);
 notes(s,'48–49','Antwoord 45f vereist beide prijzen én het marginale bedrag van KleurFix. De hoeveelheidregel is bij beide gebruikt. Bij prijsnemer vallen GO en MO samen, bij KleurFix niet. Daarom is de uitspraak voor beide samen onjuist: 16 is geen verkoopprijs van KleurFix, 24 wel; de andere leverancier ontvangt 18. Hun winstverschil bewijst niets over het effect van monopolievorming, want het zijn afzonderlijke markten. Laat leerlingen de fout in hun eigen antwoord precies aanwijzen en verbeteren.','Voor welk bedrijf klopt aflezen bij het snijpunt wel, en waarom?','Een groter winstbedrag gelijkstellen aan groter voordeel voor de samenleving.','Keer terug naar het overzicht en noteer alle huiswerkopgaven.');
}
overview('Afsluiting en huiswerk',7);
await fs.writeFile(path.join(BUILD,'slide-manifest.json'),JSON.stringify({slides,tables,charts,overviewSlides,graphSpecs,source:M},null,2));
const draft=path.join(BUILD,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[fileURLToPath(new URL('./presentation-415-package.py',import.meta.url)),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const r=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,final:r.finalPath,layout:r.presentationLayout.findingCount,package:r.packageIntegrity.status,import:r.firstPartyImport.passed}));
