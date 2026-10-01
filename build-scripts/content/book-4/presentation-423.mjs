// HOW TO ADAPT: use the current paragraph manuscript, printed book pages and
// answer model. Keep one overview source, a separate teaching case, and every
// target question before the first target answer. Runtime paths come from env.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('423');
const sourceManifest=JSON.parse(await fs.readFile(new URL('./presentation-423.manifest.json',import.meta.url),'utf8'));
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',mo:'#7B2D8E'};
const FONT='Arial',tables=[],charts=[],slides=[],overviewSlides=[],graphContracts=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+sourceManifest.lessonCommit+'/edities/books34-v3/books/book-4/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,kind='instruction'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,'§4.2.3 Marktvormen vergelijken',60,848,1380,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title,kind});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, volledige leerlingenboek, gedrukte pagina ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.2/4.2.3%20manuscript.md\nAntwoordmodel en docentroute: ${source}chapters/4.2/Antwoorden.md#antwoord25 en ${source}chapters/4.2/Docenteninformatie.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Fotostudio Licht, context en getallen zijn voor deze presentatie bedacht. De boekverwijzing onderbouwt uitsluitend de methode.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};
 }} tables.push(p.slides.items.length);return t;
}
function lines(s,rows,{y=225,gap=145,left=60,labelWidth=455,size=38}={}){
 rows.forEach(([a,b],i)=>{let top=y+i*gap;text(s,a,left,top,labelWidth,95,size,{bold:true,color:C.blue});text(s,b,left+labelWidth+30,top,1480-labelWidth-30,112,size);if(i<rows.length-1)rule(s,left,top+gap-27,1480);});
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 25.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §4.2.3 Marktvormen vergelijken','overview');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Marktvormen onderbouwen,\nproductverschillen verklaren\nen q, P en winst berekenen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 73 · Opgaven 19 en 20\n20: verkennen, theorie p. 71',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§4.2.3 · Opgaven 21 t/m 25\nBasis: 21 en 22\nZelfstandig: 23 en 24\nDoelopgave: 25\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'71–75',`Laat deze dia staan tijdens ${phase.toLowerCase()}. De normale route is 19–20 start, 21–22 begeleide basis, 23–24 zelfstandig, 25 doel. Huiswerk: 21, 22, 23, 24 en 25 maken en nakijken. Bonus 26 en herhaling 27 zijn extra. Gedrukte boekpagina 73 bevat start en opgave 21, pagina 74 bevat 22–23 en pagina 75 bevat 24–25. De docentenhandleiding noemt hoofdstukpagina 21 respectievelijk 23: dat zijn boekpagina 73 en 75. Opgave 19 haalt GO = MO = P bij de prijsnemer (§4.1.2 p. 17) en TO/MO bij uniforme prijzen (§4.1.3 p. 25–26) terug. Opgave 20 verkent het tellen van zelfstandige ondernemingen tegenover merken. Laat de leerling de eerste alinea en tabel op p. 71 gebruiken; verwacht dit nieuwe onderscheid nog niet zonder steun. Laat vóór de basisopgaven opgave 20 opnieuw beoordelen en bronbewijs noemen. De docentroute reserveert voorlopig twee lessen van 55 minuten, zonder gemeten tijdsfit. Rond de volledige route zo nodig later af.`,active===2?'Welke eerdere rekenregel helpt bij opgave 19?':'Welke opgave en welke denkstap vragen nog hulp?','Merken tellen is iets anders dan zelfstandige aanbieders tellen. Startvragen bewijzen geen beheersing.',active===7?'Noteer het huiswerk en rond zo nodig de route in de volgende les af.':'Ga naar de volgende lesfase zodra de klas eraan toe is.');
}
overview('Startopdracht',2);
{
 const s=slide('Een marktvorm onderbouwen');
 lines(s,[['Aanbieders','Hoeveel ondernemingen beslissen zelfstandig?'],['Product','Welke alternatieven zien kopers als gelijkwaardig?'],['Toetreding','Hoe gemakkelijk kan een nieuwe aanbieder beginnen?']],{y:220,gap:174,labelWidth:400,size:39});
 text(s,'Een bronantwoord noemt de marktvorm én passend bewijs.',60,778,1480,55,36,{bold:true,color:C.green});
 notes(s,'71, 73','Werk achteruit vanuit opgave 25a: een naam alleen is niet genoeg. Herhaal de afbakening uit §4.1.2 p. 16: het gaat om de beschreven markt en de bruikbare alternatieven. Zelfstandige beslissers zijn de aanbieders. De drie kenmerken samen dragen een conclusie. Is informatie afwezig, zeg dan wat nog onbekend is.','Waarom kun je uit alleen een winkelnaam geen marktvorm afleiden?','Een hoge prijs, veel logo’s of één winkel in beeld bewijzen op zichzelf geen marktvorm.','Vergelijk de vier combinaties van kenmerken.');
}
{
 const s=slide('Vier marktvormen');
 table(s,[['Marktvorm','Aanbieders','Product','Toetreding'],['Volkomen\nconcurrentie','Veel kleine','Homogeen','Vrij'],['Monopolistische\nconcurrentie','Veel','Heterogeen','Relatief\neenvoudig'],['Oligopolie','Enkele grote','Homogeen of\nheterogeen','Vaak\nbelemmerd'],['Monopolie','Eén','Geen goed alternatief\nbinnen de markt','Sterk\nbelemmerd']],60,204,1480,486,[430,280,450,320],31);
 text(s,'Homogeen: gelijkwaardig in de ogen van kopers.',60,727,1480,55,35,{bold:true,color:C.blue});
 text(s,'Heterogeen: kopers zien verschillen in bijvoorbeeld smaak of service.',60,786,1480,50,33);
 notes(s,'71','Lees de tabel per kenmerk. Homogeen gaat om de waarneming van kopers, niet alleen om fysiek identieke spullen. Bij monopolistische concurrentie zijn er veel zelfstandige aanbieders met onderscheidende producten. Bij oligopolie domineren enkele ondernemingen; hun producten kunnen gelijkwaardig of verschillend zijn. Toetreding verklaart waarom concurrentiedruk niet zomaar verandert.','Kan een markt met heterogene producten ook een oligopolie zijn?','Monopolistische concurrentie is geen monopolie. Productverschillen alleen bepalen de marktvorm niet.','Pas de kenmerken toe op een nieuw uitlegvoorbeeld.');
}
{
 const s=slide('Fotostudio Licht');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 table(s,[['Gegeven in deze oefencasus','Betekenis'],['Veel onafhankelijke fotostudio’s','Veel zelfstandige aanbieders'],['Verschillen in stijl, locatie en service','Heterogene diensten'],['Een nieuwe studio kan relatief eenvoudig beginnen','Relatief eenvoudige toetreding']],60,263,1480,325,[900,580],33);
 text(s,'Monopolistische concurrentie',60,637,1480,73,47,{bold:true,color:C.green});
 text(s,'Licht kan een eigen prijs vragen. Klanten hebben alternatieven.',60,749,1480,87,37);
 notes(s,'71–72','Dit is een zelfbedachte lokale markt van portretfotografie. Classificeer met de gegevens in plaats van kennis over werkelijke bedrijven. Noem de conclusie en het bewijs hardop. Een eigen stijl kan klanten binden, terwijl andere studio’s concurrentiedruk geven. De onderneming heeft enige prijsruimte.','Welk gegeven voorkomt dat je Licht als monopolist indeelt?','Een eigen stijl maakt de hele markt niet tot een monopolie.','Geef nu het specifieke korte-termijnmodel voor Licht.',true);
}
{
 const s=slide('Het gegeven model van Licht');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 lines(s,[['Vraag voor Licht','P = 50 − 0,50q'],['Totale kosten','TK = 180 + 10q'],['Haalbare productie','0 ≤ q ≤ 60 sessies per week']],{y:263,gap:137,labelWidth:540,size:40});
 text(s,'P: € per sessie. TK: € per week. Vaste kosten blijven bij q = 0.',60,701,1480,52,32);
 text(s,'Uniforme prijs. Concurrenten en overige vraagfactoren blijven gelijk.',60,773,1480,62,32,{bold:true,color:C.green});
 notes(s,'72; methode ook 25–26 en 36–38','Alle getallen en de context zijn bedacht. q is de afzet van één fotostudio per week; Q zou de hele markt betreffen. Binnen ieder verkoopplan betaalt iedere klant dezelfde prijs. Het model geeft de relatie tussen die prijs en de afzet. De 180 euro vaste kosten blijven in deze week ook bij niet produceren bestaan. Het gedrag van andere studio’s, kwaliteit en overige vraagfactoren blijven gelijk.','Welke informatie komt uit de marktbeschrijving en welke uit de functies?','De marktvorm levert op zichzelf geen vraagfunctie en geen winstbedrag op.','Herhaal TO, MO en MK met deze functies.',true);
}
{
 const s=slide('Opbrengsten en marginale kosten');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 table(s,[['Stap','Berekening','Eenheid'],['TO = P × q','(50 − 0,50q)q = 50q − 0,50q²','€ per week'],['MO uit TO','MO = 50 − 1,00q','€ per sessie'],['MK uit TK','TK = 180 + 10q geeft MK = 10','€ per sessie']],60,279,1480,327,[340,820,320],33);
 text(s,'Een lagere uniforme prijs geldt voor alle verkochte sessies.',60,654,1480,90,39,{bold:true,color:C.blue});
 text(s,'Daarom ligt MO bij q > 0 onder P.',60,777,1480,54,38);
 notes(s,'72; voorkennis 25–26','Vermenigvuldig de hele vraagfunctie met q. Differentieer: 50q wordt 50; −0,50q² wordt −1,00q. Bij TK verdwijnt de constante 180 en blijft 10 als MK. Herhaal waarom MO beneden P ligt: in een plan met meer verkopen is de prijs ook lager voor de eenheden die in het andere plan al verkocht zouden zijn. Er is geen terugbetaling op historische verkopen. Bij de kleine prijsnemer blijft de prijs bij extra afzet gelijk en geldt juist GO = MO = P.','Waarom verdubbelt de coëfficiënt van de kwadratische term bij de afleiding?','De vaste kosten verdwijnen uit MK, maar blijven deel van de totale kosten en winst.','Gebruik MO = MK eerst om de hoeveelheid te kiezen.',true);
}
function graph(s,{a,b,mk,cap,q,unit,stage,kind}){
 const price=a-b*q,moZero=a/(2*b),series=[];
 const label=(idx,t,pos,color)=>({idx,text:t,position:pos,showValue:false,textStyle:{typeface:FONT,fontSize:28,bold:true,fill:color}});
 const ser=(name,xs,ys,color,extra={})=>({name,xValues:xs,values:ys,line:{fill:color,width:4},marker:{symbol:'none',size:5},...extra});
 if(stage>=2)series.push(ser('GO = P',[0,cap],[a,a-b*cap],C.blue,{dataLabelOverrides:[label(1,'GO = P','top',C.blue)]}));
 series.push(ser('MO',[0,Math.min(cap,moZero)],[a,Math.max(0,a-2*b*cap)],C.mo,{line:{fill:C.mo,width:4,style:'dashed'},dataLabelOverrides:[label(1,'MO','top',C.mo)]}));
 series.push(ser('MK',[0,cap],[mk,mk],C.orange,{dataLabelOverrides:[label(1,'MK','top',C.orange)]}));
 series.push(ser('Hulplijn q',[q,q],[0,stage>=2?price:mk],C.muted,{line:{fill:C.muted,width:2,style:'dashed'}}));
 if(stage>=2)series.push(ser('Hulplijn P',[0,q],[price,price],C.muted,{line:{fill:C.muted,width:2,style:'dashed'}}));
 series.push(ser('Hoeveelheidskeuze',[q],[mk],C.ink,{marker:{symbol:'circle',size:9}}));
 if(stage>=2)series.push(ser('Prijs bij gekozen q',[q],[price],C.blue,{marker:{symbol:'circle',size:9}}));
 const ch=s.charts.add('scatter',{position:{left:60,top:230,width:1025,height:582},series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:cap,majorUnit:cap===60?10:20,numberFormatCode:'0',title:{text:`q (${unit})`,textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},line:{fill:C.ink,width:2}},
 yAxis:{min:0,max:a,majorUnit:a===50?10:6,numberFormatCode:'0',title:{text:kind==='teaching'?'€ per sessie':'€ per maaltijd',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:26,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:2}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,a,b,mk,cap,q,price,stage,series:series.map(({name,xValues,values})=>({name,xValues,values}))});
 return ch;
}
{
 const s=slide('Licht: eerst de hoeveelheid');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 graph(s,{a:50,b:.5,mk:10,cap:60,q:40,unit:'sessies per week',stage:1,kind:'teaching'});
 text(s,'MO = MK\n50 − q = 10\nq = 40',1120,265,420,170,41,{bold:true,color:C.mo});
 text(s,'Vóór 40: MO > MK\nNa 40: MO < MK',1120,476,420,120,33);
 text(s,'40 past binnen\n60 sessies.',1120,657,420,119,37,{bold:true,color:C.green});
 notes(s,'72; voorkennis 36','Los eerst de marginale vergelijking op: 50 − q = 10, dus q = 40. De winst stijgt tot 40 en daalt erna. Bij 30 is MO 20, groter dan MK 10; bij 45 is MO 5, kleiner dan MK 10. De afzet is haalbaar binnen 60. De grafiek toont de MO-lijn alleen tot haar nulpunt q = 50; daarbuiten is MO negatief en valt zij buiten de niet-negatieve verticale schaal. Het snijpunt ligt op 10 euro per sessie, maar de verkoopprijs is nog niet afgelezen.','Welke grootheid bepaalt het snijpunt van MO en MK?','10 euro is het marginale bedrag, nog niet de prijs die klanten betalen.','Voeg GO toe en lees de prijs bij dezelfde q.',true);
}
{
 const s=slide('Licht: daarna de prijs op GO');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 graph(s,{a:50,b:.5,mk:10,cap:60,q:40,unit:'sessies per week',stage:2,kind:'teaching'});
 text(s,'P = 50 − 0,50q',1120,265,420,104,36,{bold:true,color:C.blue});
 text(s,'P = 50 − 0,50 × 40\nP = € 30 per sessie',1120,422,420,147,34,{bold:true,color:C.blue});
 text(s,'q = 40 blijft gelijk.\nNu lezen we GO af.',1120,655,420,110,33);
 notes(s,'72; voorkennis 37','De assen en de oorspronkelijke lijnen staan op exact dezelfde schaal als op de vorige dia. Ga vanaf q = 40 verticaal naar GO en dan horizontaal naar de prijsas: 30 euro per sessie. GO is bij positieve afzet gelijk aan P omdat alle sessies dezelfde prijs hebben. Gebruik q van één studio, niet Q van de hele markt.','Waarom lees je de verkoopprijs niet op MO?','Het bekende rekenpad maakt Licht niet tot monopolist: de bron noemt veel zelfstandige studio’s.','Bereken de winst met deze hoeveelheid en prijs.',true);
}
{
 const s=slide('Licht: winst per week');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,48,30,{color:C.muted});
 lines(s,[['Totale opbrengst','TO = 30 × 40 = € 1.200'],['Totale kosten','TK = 180 + 10 × 40 = € 580'],['Winst','TO − TK = 1.200 − 580 = € 620']],{y:267,gap:143,labelWidth:460,size:41});
 text(s,'Controle bij q = 0: TO = 0, TK = 180, winst = −€ 180.',60,746,1480,83,36,{bold:true,color:C.green});
 notes(s,'72; voorkennis 38–39','TO en TK zijn totalen in euro per week. Vaste kosten worden eenmaal afgetrokken. Het resultaat van 620 is beter dan −180 euro bij nul productie. Het marginale verloop heeft al aangetoond dat 40 binnen de grenzen de hoogste winst geeft. De gegevens zijn fictief en gelden alleen voor de beschreven week en aannames.','Waar keren de vaste kosten terug in de berekening?','Een correcte hoeveelheid bewijst nog geen positieve winst zonder alle kosten mee te nemen.','Begrens nu wat we uit dit ondernemingsmodel mogen concluderen.',true);
}
{
 const s=slide('De rekenregel en de marktvorm');
 table(s,[['Wat weet je?','Wat kun je daaruit afleiden?'],['Marktkenmerken','Een onderbouwde marktvorm'],['Vraag, kosten en capaciteit van één onderneming','q, P en winst onder die aannames'],['Alleen: enkele grote aanbieders','Nog geen specifieke vraagfunctie']],60,228,1480,368,[740,740],35);
 text(s,'Bij oligopolie kunnen reacties van concurrenten de eigen vraag veranderen.',60,665,1480,130,43,{bold:true,color:C.blue});
 notes(s,'71–72, 74','Scheid classificeren en rekenen. Veel aanbieders betekent niet automatisch dat elke onderneming prijsnemer is. Bij een heterogeen product kan de eigen vraag dalen. Bij enkele grote ondernemingen hangt de vraag mede af van reacties van de andere grote spelers. Deze les bouwt geen spelmatrix of universele oligopolievraagfunctie.','Is een dalende eigen vraaglijn voldoende bewijs voor een monopolie?','Een functie die in één casus is gegeven, geldt niet automatisch voor een andere markt.','Controleer dit onderscheid kort voordat leerlingen zelf oefenen.');
}
{
 const s=slide('Korte controle');
 text(s,'Licht heeft een dalende eigen vraaglijn.',60,223,1480,65,42,{bold:true});
 text(s,'“Dan is Licht een monopolist.”',60,357,1480,100,54,{bold:true,color:C.blue});
 text(s,'Welke gegevens uit de fotostudiocasus ondersteunen of weerleggen dit?',60,569,1480,158,42);
 notes(s,'71–72','Laat leerlingen zelfstandig een kort bronantwoord formuleren. Antwoord: de uitspraak volgt niet. Veel onafhankelijke studio’s, verschillen in stijl en relatief eenvoudige toetreding passen bij monopolistische concurrentie. Ook zo’n onderneming kan een dalende eigen vraag hebben. Dit is een korte controle op het uitlegvoorbeeld, geen boekopgave en geen extra huiswerk.','Welke brongegevens wegen zwaarder dan alleen de vorm van de GO-lijn?','Een rekenprocedure is geen marktvorm.','Keer terug naar de startverkenning en vervolgens naar de volledige oefenroute.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 25 · Bron A','target-question');
 text(s,'Vier afgebakende markten · Boekpagina 75',60,181,1480,48,32,{bold:true,color:C.blue});
 table(s,[['Markt','Brongegevens'],['I','Veel kleine telers bieden een identieke grondstof aan; kopers kennen de prijzen en toetreding is vrij.'],['II','Veel onafhankelijke lunchzaken verschillen in smaak en locatie; toetreding is relatief eenvoudig.'],['III','Drie grote aanbieders bedienen vrijwel de hele markt; een nieuw netwerk bouwen kost veel.'],['IV','Eén aanbieder heeft als enige toegang tot een noodzakelijke voorziening; binnen deze markt zijn geen goede alternatieven.']],60,256,1480,460,[175,1305],32);
 text(s,'Gebruik alleen de beschreven markten en de gegeven korte-termijnberekening.',60,754,1480,80,33,{bold:true});
 notes(s,'75','Dit is de volledige Bron A van doelopgave 25, Marktvorm is het begin. Laat de leerling het eigen werk erbij nemen. Geef nu nog geen classificaties. De complete bron B en alle vijf deelvragen volgen vóór de eerste uitwerking. Er hoort geen opgavefiguur bij Bron A of B; de figuur staat uitsluitend in het antwoordmodel.','Welke bronregels zijn nodig voor jouw classificatie?','De abstracte markten mogen niet worden vervangen door onbewezen aannames over echte bedrijven.','Lees ook Bron B zonder oplossingen.');
}
{
 const s=slide('Opgave 25 · Bron B','target-question');
 text(s,'Lunchzaak Puur · Boekpagina 75',60,181,1480,48,32,{bold:true,color:C.blue});
 text(s,'Puur hoort bij markt II. Voor één dag geldt:',60,267,1480,60,39);
 text(s,'P = 30 − 0,25q       TK = 144 + 6q',60,370,1480,90,48,{bold:true,color:C.blue});
 text(s,'q is maaltijden per dag. P is euro per maaltijd.\nDe productiecapaciteit is 80 maaltijden.\nDe vaste kosten blijven ook bij q = 0 bestaan.',60,505,1480,172,37);
 text(s,'Gedrag van concurrenten, kwaliteit en overige vraagfactoren blijven in deze berekening gelijk.',60,723,1480,110,37,{bold:true});
 notes(s,'75','Toon alle oorspronkelijke gegevens en voorwaarden. De periode is één dag; TK is dus euro per dag. q betreft één lunchzaak. Het gedrag van de andere aanbieders verandert in deze berekening niet. Bereken nog geen marginale functie of optimum op deze vragendia.','Welke beperkingen en vaste aannames zijn expliciet gegeven?','Dit model is geen functie voor de hele markt II.','Toon de deelvragen, zonder oplossingen.');
}
{
 const s=slide('Opgave 25 · Vragen a, b en c','target-question');
 lines(s,[['a · 4 punten','Classificeer I tot en met IV. Geef voor elke markt het beslissende bronbewijs.'],['b · 2 punten','Bepaal voor Puur TO, MO en MK.'],['c · 3 punten','Bereken de winstmaximale haalbare q, de verkoopprijs en de winst.']],{y:218,gap:192,labelWidth:310,size:39});
 notes(s,'75','De vragen zijn volledig overgenomen. Bij a hoort per markt een conclusie met bewijs. Bij c staan drie gevraagde uitkomsten en is haalbaarheid onderdeel van de vraag. Laat eigen antwoorden nog staan; de volgende dia bevat d en e.','Welke onderdelen heb je in je eigen antwoord bij c opgenomen?','Nog geen uitwerking onthullen voordat ook d en e op het scherm hebben gestaan.','Maak de hele opgave compleet met d en e.');
}
{
 const s=slide('Opgave 25 · Vragen d en e','target-question');
 lines(s,[['d · 2 punten','Verklaar waarom Puur geen horizontale GO-lijn hoeft te hebben, ook al zijn er veel aanbieders.'],['e · 2 punten','Mag je de functie van Puur zonder extra broninformatie gebruiken voor markt III? Leg uit.']],{y:245,gap:257,labelWidth:310,size:41});
 text(s,'Vergelijk de bron met je eigen redenering.',60,770,1480,62,31,{color:C.muted});
 notes(s,'75','Nu zijn beide bronblokken en alle deelvragen a tot en met e beschikbaar. Laat leerlingen hun redeneringen naast elkaar houden. De eerstvolgende dia start pas de oplossingen.','Waar vraagt de opgave om een verklaring in plaats van een berekening?','Veel aanbieders is onvoldoende om zonder naar productverschillen te kijken een horizontale GO-lijn af te leiden.','Begin de bespreking met de classificaties en hun bewijs.');
}
{
 const s=slide('Opgave 25a · Marktvorm met bronbewijs','target-answer');
 table(s,[['Markt','Marktvorm','Beslissend bronbewijs'],['I','Volkomen concurrentie','Veel kleine telers, identieke grondstof, vrije toetreding'],['II','Monopolistische\nconcurrentie','Veel onafhankelijke lunchzaken, verschillen in smaak en locatie, eenvoudige toetreding'],['III','Oligopolie','Drie grote aanbieders domineren, hoge kosten voor een nieuw netwerk'],['IV','Monopolie','Eén aanbieder, unieke toegang en geen goede alternatieven binnen de markt']],60,224,1480,520,[160,520,800],32);
 text(s,'De classificatie steunt op de combinatie van kenmerken.',60,776,1480,57,36,{bold:true,color:C.green});
 notes(s,'75','Bespreek één bronrij tegelijk. I is homogeen en kent vrije toetreding. Bij II is de dienstverlening heterogeen terwijl er veel onafhankelijke aanbieders zijn. III wordt gedomineerd door enkele aanbieders met een hoge toetredingsdrempel. Bij IV begrenzen één aanbieder, unieke toegang en het ontbreken van goede alternatieven de conclusie tot deze afgebakende markt. Dit volgt het antwoordmodel 25a.','Welk bronbewijs maakt het onderscheid tussen II en III?','Heterogeniteit op zichzelf is geen bewijs van monopolistische concurrentie.','Ga van de classificatie naar de functies voor de afzonderlijke lunchzaak Puur.');
}
{
 const s=slide('Opgave 25b · TO, MO en MK','target-answer');
 lines(s,[['TO = P × q','TO = (30 − 0,25q)q\nTO = 30q − 0,25q²'],['Marginale opbrengst','MO = 30 − 0,50q'],['Marginale kosten','TK = 144 + 6q geeft MK = 6']],{y:220,gap:174,labelWidth:485,size:41});
 text(s,'TO en TK: € per dag. MO en MK: € per maaltijd.',60,780,1480,55,35,{bold:true,color:C.green});
 notes(s,'75','Werk de haakjes in TO eerst uit. Differentieer vervolgens de twee termen: 30q levert 30 en −0,25q² levert −0,50q. De constante 144 in TK verandert niet bij een marginale uitbreiding, zodat MK = 6. De 144 blijft wel in de winstberekening staan. Dit is de complete uitwerking van 25b.','Waar komt de factor 0,50 in MO vandaan?','MO is niet gelijk aan P bij positieve q onder deze dalende vraag en uniforme prijs.','Kies eerst de hoeveelheid met MO en MK.');
}
{
 const s=slide('Opgave 25c · Haalbare winstmaximale q','target-answer');
 text(s,'MO = MK',60,208,1480,64,46,{bold:true,color:C.mo});
 text(s,'30 − 0,50q = 6       24 = 0,50q       q = 48',60,305,1480,92,46,{bold:true});
 table(s,[['Controle','Gevolg voor de winst'],['Vóór 48: MO > 6','Een kleine uitbreiding verhoogt de winst.'],['Na 48: MO < 6','Een kleine uitbreiding verlaagt de winst.'],['48 ≤ 80 maaltijden per dag','De hoeveelheid past binnen de capaciteit.']],60,451,1480,320,[720,760],33);
 notes(s,'75','Het snijpunt geeft q = (30 − 6)/0,50 = 48 maaltijden per dag. Bij q = 40 is MO 10 > 6. Bij q = 56 is MO 2 < 6. Met de dalende MO-lijn en constante MK geeft dit de winsttop. 48 is ook als geheel aantal maaltijden haalbaar en blijft onder de capaciteit 80. De marktuitkomst van alle lunchzaken samen wordt hier niet berekend.','Welke twee controles maken q = 48 een geschikte keuze?','Alleen MO = MK oplossen zonder verloop of capaciteit te controleren is onvolledig.','Lees bij dezelfde 48 maaltijden de verkoopprijs uit GO.');
}
{
 const s=slide('Opgave 25c · De prijs op GO','target-answer');
 text(s,'Puur: één lunchzaak · Eén dag',60,181,1480,48,32,{bold:true,color:C.blue});
 graph(s,{a:30,b:.25,mk:6,cap:80,q:48,unit:'maaltijden per dag',stage:2,kind:'target'});
 text(s,'q = 48',1120,267,420,71,43,{bold:true});
 text(s,'P = 30 − 0,25 × 48\nP = € 18 per maaltijd',1120,404,420,160,34,{bold:true,color:C.blue});
 text(s,'Bij MO = MK is\nhet bedrag € 6.\nDe prijs op GO is € 18.',1120,628,420,153,33);
 notes(s,'75','De figuur is als bewerkbare grafiek gereconstrueerd uit Bron B en het antwoordmodel. MO = MK bij (48,6), vervolgens GO bij (48,18). De stippellijnen verbinden dezelfde q met de prijsas. De horizontale as stopt bij de capaciteit 80; GO heeft daar waarde 10. MO wordt bij q = 60 nul en is daarbuiten negatief, dus buiten het positieve y-bereik. Prijs = 30 − 0,25 × 48 = 18 euro per maaltijd.','Welke lijn geeft de prijs die de klant bij 48 maaltijden betaalt?','De 6 op het marginale snijpunt is geen verkoopprijs.','Bereken nu beide totalen en hun verschil.');
}
{
 const s=slide('Opgave 25c · Winst en controle','target-answer');
 lines(s,[['Totale opbrengst','TO = 18 × 48 = € 864 per dag'],['Totale kosten','TK = 144 + 6 × 48 = € 432 per dag'],['Winst','864 − 432 = € 432 per dag']],{y:218,gap:151,labelWidth:425,size:39});
 text(s,'Bij q = 0: winst = −€ 144 per dag.',60,696,1480,59,36,{bold:true,color:C.green});
 text(s,'Niet produceren levert minder op dan q = 48.',60,774,1480,60,35);
 notes(s,'75','TO is 864 euro, TK is 144 + 288 = 432 euro, dus de winst is toevallig ook 432 euro per dag. Controleer de vaste kosten eenmaal en neem alle variabele kosten mee. Bij q = 0 blijven de vaste kosten staan en is de winst −144. Aan de capaciteitsgrens 80 is P = 10, TO = 800, TK = 624 en winst = 176, eveneens lager. Met het marginale verloop is de maximale haalbare keuze onderbouwd.','Waarom zijn TK en winst hier allebei 432, terwijl het verschillende grootheden zijn?','De getallen zijn toevallig gelijk. Winst is niet per definitie gelijk aan totale kosten of omzet.','Leg uit waarom de GO-lijn hier kan dalen ondanks het grote aantal aanbieders.');
}
{
 const s=slide('Opgave 25d · Veel aanbieders, eigen prijs','target-answer');
 table(s,[['Volkomen concurrentie','Puur in markt II'],['Homogeen product','Verschillen in smaak en locatie'],['Eén kleine onderneming neemt P als gegeven','Klanten hebben een voorkeur voor een bepaalde zaak'],['GO = MO = P, horizontaal','Puur heeft enige prijsruimte en een dalende eigen GO']],60,236,1480,420,[740,740],35);
 text(s,'Productverschillen verklaren de prijsruimte van Puur.',60,730,1480,90,43,{bold:true,color:C.blue});
 notes(s,'75','De vraag zegt niet dat Puur een horizontale GO-lijn moet hebben. Veel aanbieders zijn slechts één kenmerk. De heterogene diensten zorgen ervoor dat klanten verschillen in smaak en locatie meewegen. Puur heeft daardoor enige invloed op de prijs. De dalende GO geldt voor deze onderneming en deze aannames. De prijsnemer met een homogeen product onder volkomen concurrentie neemt P juist als gegeven.','Welk productkenmerk maakt het prijsnemersmodel hier ongeschikt?','Monopolistische concurrentie en volkomen concurrentie verschillen ondanks hun vele aanbieders.','Beoordeel ten slotte het gebruik van deze functie voor markt III.');
}
{
 const s=slide('Opgave 25e · De functie in een andere markt','target-answer');
 text(s,'Nee, de functie van Puur geldt niet automatisch voor markt III.',60,222,1480,119,45,{bold:true,color:C.blue});
 lines(s,[['Gegeven voor Puur','Vraag en kosten van één lunchzaak, bij gelijk gedrag van concurrenten.'],['Nodig voor markt III','Informatie over de eigen vraag en de reacties van andere grote aanbieders.']],{y:419,gap:176,labelWidth:435,size:37});
 text(s,'Een oligopolie heeft geen universele vraagfunctie.',60,779,1480,54,37,{bold:true,color:C.green});
 notes(s,'75','De weigering moet worden onderbouwd: de gegeven functie hoort bij Puur onder de expliciete voorwaarden van Bron B. Markt III heeft enkele grote aanbieders die elkaars beslissingen kunnen beïnvloeden. Om hun vraag te modelleren moet onder meer duidelijk zijn hoe de concurrenten reageren. Er volgt uit het woord oligopolie dus geen functie P = 30 − 0,25q. Daarmee zijn a tot en met e volledig behandeld. Laat elke leerling één ontbrekend bronargument of rekenstap verbeteren.','Welke extra informatie zou je willen voordat je voor markt III gaat rekenen?','Dezelfde algebra kan bruikbaar zijn als een bron haar aannames geeft, maar de marktvorm alleen levert die aannames niet.','Keer terug naar het lesoverzicht en laat het huiswerk noteren.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slide-manifest.json'),JSON.stringify({slides,overviewSlides,tables,charts,graphContracts},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.2.3 Marktvormen vergelijken – presentatie.pptx'),pythonExecutable:PYTHON,
 integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],
 fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({finalPath:result.finalPath,slides:slides.length,overviewSlides,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
