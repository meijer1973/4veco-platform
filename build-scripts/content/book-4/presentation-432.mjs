import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,PLATFORM,workspace} from '../../presentations/runtime.mjs';

const M=JSON.parse(await fs.readFile(new URL('./presentation-432.manifest.json',import.meta.url),'utf8'));
for(const item of M.sources){
 const bytes=await fs.readFile(path.resolve(PLATFORM,'../4veco-lessen',item.path));
 if(createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw new Error('Source changed: '+item.path);
}
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('432');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E7449',orange:'#A94D16',line:'#C6D2DB',pale:'#EFF4F7',muted:'#445B6B'};
const FONT='Arial',title='Arbeidsaanbod, participatie en evenwicht';
const tables=[],charts=[],slides=[],graphs=[],overviews=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/'+M.lessonCommit+'/edities/books34-v3/books/book-4/';
const example='Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,role='instruction'){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,t,60,42,1480,77,role==='overview'?44:50,{bold:true});rule(s,60,146,1480);
 text(s,'§4.3.2 '+title,60,848,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:t,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 const prose=v=>v.replace(/(?<=[\p{L}])(?=\d)|(?<=\d)(?=[\p{L}])/gu,' ').replace(/(?<=[:;,])(?=\S)/g,' ');
 [explanation,question,pitfall,transition]=[explanation,question,pitfall,transition].map(prose);
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, editie books34-v3, gedrukte complete-boekpagina ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nMethode en opgaven: ${source}chapters/4.3/4.3.2%20manuscript.md\nAntwoorden: ${source}chapters/4.3/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Dijkstad en de markt voor baliemedewerkers met eigen aantallen en functies. De boekpagina onderbouwt de methode, niet deze gegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?'#FFFFFF':C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:14,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
function labelExample(s){text(s,example,60,177,1480,48,29,{bold:true,color:C.blue});}
const overviewData={
 route:['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 16.','Zet je huiswerk in je agenda.'],
 goals:'Groepen onderscheiden.\nBruto en netto berekenen.\nLoon en werkgelegenheid vinden.',
 start:'Pagina 128 · Opgaven 10 en 11\n11: verkennen, theorie p. 124',
 homework:'§4.3.2 · Opgaven 12 t/m 16\nBasis: 12 en 13\nZelfstandig: 14 en 15\nDoelopgave: 16\nMaken en nakijken'
};
function overview(phase,active){
 const s=slide('Deze les: §4.3.2 '+title,'overview');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1460,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 overviewData.route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+i});text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color:col,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,overviewData.goals,972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,overviewData.start,972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,overviewData.homework,972,654,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'124, 128–130',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 10 herhaalt gelijkstellen, invullen en deel/geheel × 100%. Bij haperende algebra: groepeer de termen, deel door de coëfficiënt en vul terug in. De bekende evenwichtsroute is uitgewerkt in Boek 3 §3.1.4, hoofdstukpagina 30; vandaag veranderen variabelen en eenheden. Start 11 is een verkenning van de nieuwe bevolkingsindeling. Laat leerlingen op p.124 de definitie van beroepsbevolking en de voorwaarden recent zoeken en direct beschikbaar aanwijzen. Zij noteren twijfel en gebruiken die steun, zonder dat dit als beheerste voorkennis telt. Keer vóór basiswerk terug naar 11: opnieuw indelen en de gebruikte voorwaarden uitleggen. Bespreek eventueel het reeds gemaakte startwerk. Basis 12–13 staat op p.128, zelfstandig 14–15 op p.129, doel 16 op p.130. Huiswerk 12,13,14,15,16 maken en nakijken. Bonus 17 en herhaling 18 zijn extra. De docentenroute reserveert voorlopig twee lessen van 55 minuten; een tijdsfit is niet gemeten. Rond de volledige route zo nodig later af.`, 'Welke voorwaarde uit de definitie helpt je bij opgave 11?', 'Geen betaald werk hebben is op zichzelf onvoldoende om als werkloos te tellen.',active===7?'Laat het huiswerk noteren. Volgende paragraaf: werkloosheid en veranderingen.':'Ga verder wanneer de klas aan de volgende fase toe is.');
}
const E={id:'example',a:180,b:6,c:-36,d:6,wmin:6,wmax:30,L:72,w:18,xmax:160,ymax:32,xstep:40,ystep:8};
const T={id:'target',a:240,b:10,c:-40,d:10,wmin:4,wmax:24,L:100,w:14,xmax:240,ymax:28,xstep:40,ystep:5};
function graph(s,m,stage){
 const series=[];
 const add=(name,x,y,color,style='solid',width=3)=>series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}});
 const tag=(name,x,y,color=C.ink)=>series.push({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:name,position:'t',showValue:false,textStyle:{typeface:FONT,fontSize:28,fill:color,bold:true}}]});
 add('Lᵥ',[m.a-m.b*m.wmax,m.a-m.b*m.wmin],[m.wmax,m.wmin],C.blue);
 tag('Lᵥ',m.a-m.b*(m.wmin+3),m.wmin+3+m.ymax*.07,C.blue);
 if(stage!=='demand'){
  add('Lₐ',[m.c+m.d*m.wmin,m.c+m.d*m.wmax],[m.wmin,m.wmax],C.green);
  tag('Lₐ',m.c+m.d*(m.wmax-3),m.wmax-3+m.ymax*.07,C.green);
 }
 if(stage==='equilibrium'){
  add('loonhulplijn',[0,m.L],[m.w,m.w],C.muted,'dashed',2);
  add('hoeveelheidhulplijn',[m.L,m.L],[0,m.w],C.muted,'dashed',2);
  series.push({name:'evenwicht',xValues:[m.L],values:[m.w],line:{fill:'none',width:0},marker:{symbol:'circle',size:9,fill:C.orange,line:{fill:C.orange,width:1}}});
  tag('E',m.L+m.xmax*.10,m.w+m.ymax*.02,C.orange);
 }
 for(const item of series){item.xValues=item.xValues.map(v=>+v.toFixed(6));item.values=item.values.map(v=>+v.toFixed(6));}
 const ch=s.charts.add('scatter',{position:{left:60,top:235,width:1050,height:560},series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:'L (personen)',textStyle:{typeface:FONT,fontSize:28,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'w (€ per uur)',textStyle:{typeface:FONT,fontSize:28,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,stage,series});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 table(s,[['Bewerking','Wat laat je zien?'],['Groepen onderscheiden','Werkzaam, werkloos of niet-beroepsbevolking'],['Participatie berekenen','De juiste teller en dezelfde bevolkingsnoemer'],['Evenwicht bepalen','Lᵥ = Lₐ, invullen en E tekenen']],60,232,1480,414,[555,925],35);
 text(s,'Bevolkingstelling en sectormodel beschrijven verschillende groepen.',60,728,1480,90,39,{bold:true,color:C.blue});
 notes(s,'124–127','Koppel de doelen aan 16a, 16b en 16c. De leerlingen combineren straks een regiotelling met een apart sectormodel. Niet elk getal heeft hetzelfde object of dezelfde eenheid.','Welke twee soorten bron ga je gebruiken?','Een getelde beroepsbevolking is niet automatisch het aanbod bij elk loon.','Begin met de voorwaarden voor de bevolkingsgroepen.');
}
{
 const s=slide('Wie behoort tot de beroepsbevolking?');
 text(s,'Bevolking van 15 tot 75 jaar',60,187,1480,65,38,{bold:true,color:C.blue});
 table(s,[['Situatie','Groep'],['Betaald werk','Werkzame beroepsbevolking'],['Geen betaald werk + recent gezocht\n+ direct beschikbaar','Werkloze beroepsbevolking'],['Geen betaald werk + niet recent gezocht\nof niet direct beschikbaar','Niet-beroepsbevolking']],60,283,1480,377,[780,700],34);
 text(s,'Beroepsbevolking = werkenden + werklozen',60,727,1480,75,43,{bold:true,color:C.green});
 notes(s,'124','Werkzaam telt ook bij weinig betaalde uren. Werkloos vereist alle drie de genoemde voorwaarden. Bij de niet-beroepsbevolking is geen betaald werk gegeven en ontbreekt minstens één van zoeken of beschikbaarheid. Leeftijdsbereik: 15-jarigen wel, 75-jarigen niet. Student-zijn bepaalt de groep niet.','Kan een leerling met een betaalde bijbaan tot de beroepsbevolking horen?','Tel werklozen niet nogmaals bij een al gegeven beroepsbevolking op.','Gebruik de indeling bij de eigen regiotelling.');
}
{
 const s=slide('Dijkstad: de bevolking indelen');labelExample(s);
 table(s,[['Inwoners van 15 tot 75 jaar','Personen'],['Werkenden','1.560'],['Werklozen','240'],['Niet-beroepsbevolking','600'],['Bevolking','2.400']],60,258,850,414,[640,210],34);
 text(s,'Beroepsbevolking',990,300,550,58,36,{bold:true,color:C.green});
 text(s,'1.560 + 240\n= 1.800 personen',990,395,550,139,43,{bold:true});
 text(s,'Controle: 1.800 + 600 = 2.400 personen',60,746,1480,68,39,{bold:true});
 notes(s,'124–125','Geconstrueerde telling Dijkstad. Beide deelnemende groepen samen vormen 1.800 personen. Niet-deelnemers tellen wel in de totale bevolking mee. Controleer dat de categorieën samen 2.400 zijn.','Waarom tellen de 240 mensen zonder werk toch mee in de beroepsbevolking?','De 600 niet-deelnemers horen niet bij de beroepsbevolking.','Gebruik deze telling voor twee participatiepercentages.',true);
}
{
 const s=slide('Bruto en netto: dezelfde noemer');
 table(s,[['Percentage','Teller','Noemer'],['Bruto-participatie','Werkenden + werklozen','Bevolking'],['Netto-participatie','Werkenden','Bevolking']],60,255,1480,310,[490,610,380],35);
 text(s,'Participatie = teller / bevolking × 100%',60,638,1480,70,46,{bold:true,color:C.blue});
 text(s,'Kies bij teller én noemer hetzelfde leeftijdsbereik.',60,749,1480,66,37);
 notes(s,'125','Bij bruto tel je allen die aan de arbeidsmarkt deelnemen. Netto telt mensen met betaald werk. Deel beide door de opgegeven bevolking van dezelfde leeftijdsgroep en vermenigvuldig met 100 procent. Dit herhaalt deel/geheel uit start 10b met een nieuw economisch onderscheid.','Welke teller verandert wanneer iemand zonder baan actief gaat zoeken en beschikbaar is?','De beroepsbevolking is hier geen noemer. Het werkloosheidspercentage krijgt in §4.3.3 een andere noemer.','Vul de Dijkstad-cijfers in.');
}
{
 const s=slide('Dijkstad: bruto 75%, netto 65%');labelExample(s);
 text(s,'Bruto-participatie',60,285,650,60,39,{bold:true,color:C.blue});
 text(s,'1.800 / 2.400 × 100% = 75%',60,363,1480,83,49,{bold:true});rule(s,60,495,1480);
 text(s,'Netto-participatie',60,535,650,60,39,{bold:true,color:C.green});
 text(s,'1.560 / 2.400 × 100% = 65%',60,613,1480,83,49,{bold:true});
 text(s,'Controle: bruto ≥ netto en beide ≤ 100%',60,755,1480,59,36);
 notes(s,'125','Dezelfde 2.400 inwoners vormen beide noemers. 75% neemt deel, 65% heeft betaald werk. Het verschil is 10 procentpunt van de hele bevolking. Dat verschil is niet het werkloosheidspercentage.','Waarom verandert de noemer niet?','Verschil in procentpunten is iets anders dan een procentuele verandering of het werkloosheidspercentage.','Vervolgens een apart model: arbeid bij verschillende lonen.',true);
}
{
 const s=slide('Van productmarkt naar arbeidsmarkt');
 table(s,[['Bekende markt','Arbeidsmarkt'],['Prijs P','Uurloon w in € per uur'],['Gevraagde hoeveelheid Qᵥ','Arbeidsvraag Lᵥ door werkgevers'],['Aangeboden hoeveelheid Qₐ','Arbeidsaanbod Lₐ door huishoudens'],['Qᵥ = Qₐ','Lᵥ = Lₐ']],60,229,1480,447,[620,860],34);
 text(s,'Uitlegvoorbeeld en doelopgave: personen, ieder 20 uur per week.',60,742,1480,73,38,{bold:true,color:C.blue});
 notes(s,'126; voorkennis p.114–115','Werkgevers kopen arbeid, huishoudens bieden arbeid. Herhaal §4.3.1: uren, personen en fte zijn verschillende grootheden. Hier bepaalt de bron L als personen met elk 20 uur per week. Wissel deze as niet stilzwijgend met uren of euro. De algebra van gelijkstellen blijft gelijk.','Wie koopt jouw werktijd als je een bijbaan hebt?','In dagelijks taalgebruik biedt een werkgever een baan aan; economisch vraagt hij arbeid.','Lees eerst de context en aannamen van het eigen sectorvoorbeeld.');
}
{
 const s=slide('Een aparte markt: baliemedewerkers');labelExample(s);
 text(s,'Lᵥ = 180 − 6w',60,278,720,74,50,{bold:true,color:C.blue});
 text(s,'Lₐ = −36 + 6w',825,278,710,74,50,{bold:true,color:C.green});
 table(s,[['Grootheid / aanname','Afspraak'],['L','Personen, ieder 20 uur per week'],['w','Uurloon in euro; € 6 ≤ w ≤ € 30'],['Markt','Veel werkgevers en werknemers; vergelijkbare arbeid'],['Aanpassing','Vrij loon, geen loonvloer, direct passende matches']],60,420,1480,371,[455,1025],32);
 notes(s,'126–127','Eigen model voor baliemedewerkers, los van de Dijkstad-telling. Bij elk gegeven loon geeft de vraagfunctie het aantal personen dat werkgevers willen inzetten en de aanbodfunctie hoeveel mensen hun arbeid aanbieden. Andere omstandigheden blijven gelijk. Beide functies zijn alleen geldig op het aangegeven domein. De modelafspraken maken gelijk gevraagde en aangeboden arbeid tot gevulde werkgelegenheid.','Waarom moet de bron vermelden dat passende matches direct ontstaan?','Een modeluitkomst is geen telling van alle werkenden of werklozen in Dijkstad.','Teken eerst arbeidsvraag en let op de asbetekenis.',true);
}
{
 const s=slide('Arbeidsvraag bij verschillende lonen');labelExample(s);graph(s,E,'demand');
 text(s,'Lᵥ = 180 − 6w',1150,267,390,70,38,{bold:true,color:C.blue});
 text(s,'w = € 12\nLᵥ = 108 personen\n\nw = € 24\nLᵥ = 36 personen',1150,382,390,245,33);
 text(s,'Alleen het loon verandert.',1150,709,390,93,34,{bold:true});
 notes(s,'126; voorkennis p.117','Vul de lonen in: 180−72=108 en 180−144=36. Loon staat verticaal, personen horizontaal. Bij hoger loon willen werkgevers minder personen inzetten, ceteris paribus. De lijn is alleen getekend voor 6 tot 30 euro per uur.','Waar ligt het punt met 108 personen en 12 euro per uur?','Een hoger loon verplaatst hier het punt langs dezelfde vraaglijn.','Voeg het arbeidsaanbod bij dezelfde lonen en dezelfde schaal toe.',true);
}
{
 const s=slide('Arbeidsaanbod bij verschillende lonen');labelExample(s);graph(s,E,'both');
 text(s,'Lₐ = −36 + 6w',1150,267,390,70,38,{bold:true,color:C.green});
 text(s,'w = € 12\nLₐ = 36 personen\n\nw = € 24\nLₐ = 108 personen',1150,382,390,245,33);
 text(s,'Stijgende aanbodlijn in dit model',1150,709,390,98,34,{bold:true});
 notes(s,'125–126','Vul aanbod in: −36+72=36 en −36+144=108. Een hoger loon trekt in dit model meer aanbieders aan. Hier liggen uren per persoon vast. Het boek bespreekt algemener ook veranderingen van uren. Tijd, zorgtaken, opleiding en voorkeuren blijven gelijk. Meer beschikbare gekwalificeerde werknemers kan de gehele lijn verschuiven. Bij uitsluitend een ander loon beweeg je langs de lijn.','Bij welk loon zouden beide aantallen gelijk zijn?','De aanbodlijn is een vereenvoudiging voor deze markt, geen algemene garantie dat ieder mens bij hoger loon meer werkt.','Bereken het snijpunt met gelijkstellen.',true);
}
{
 const s=slide('Evenwicht: gelijkstellen en terug invullen');labelExample(s);
 const rows=[['Gelijkstellen','180 − 6w = −36 + 6w'],['Oplossen','216 = 12w, dus w = € 18 per uur'],['Invullen','Lᵥ = 180 − 6 × 18 = 72 personen'],['Controleren','Lₐ = −36 + 6 × 18 = 72 personen']];
 rows.forEach((r,i)=>{let y=274+i*125;text(s,r[0],60,y,370,70,34,{bold:true,color:C.blue});text(s,r[1],465,y,1075,80,39,{bold:i===1});if(i<3)rule(s,60,y+91,1480);});
 text(s,'€ 18 ligt binnen het domein van € 6 tot en met € 30.',60,794,1480,43,30);
 notes(s,'126–127','Breng −36 naar links en −6w naar rechts: 180+36=12w. Deel beide kanten door 12. Vul w18 in beide functies terug in. De twee uitkomsten zijn gelijk en niet-negatief. De eenheid van w is euro per uur, van L personen.','Waarom rekenen we na het loon ook nog L uit?','w18 is geen hoeveelheid arbeid; de evenwichtsvergelijking geeft eerst het loon.','Markeer de berekende coördinaten op de grafiek.',true);
}
{
 const s=slide('Het evenwicht tekenen');labelExample(s);graph(s,E,'equilibrium');
 text(s,'E = (72; 18)',1150,283,390,78,43,{bold:true,color:C.orange});
 text(s,'Horizontaal\n72 personen\n\nVerticaal\n€ 18 per uur',1150,410,390,259,35);
 text(s,'72 passende matches',1150,727,390,71,34,{bold:true});
 notes(s,'126–127','E ligt bij L72 en w18. Trek een verticale hulplijn naar de hoeveelheidsas en een horizontale hulplijn naar de loonas. Beide arbeidslijnen lopen door dit punt. Onder de gegeven vrije loonaanpassing en directe matching werken deze 72 personen in het model.','Welke coördinaat schrijf je eerst: personen of loon?','E=(18;72) verwisselt de assen. De grafiek telt geen euro horizontaal.','Leg de modeluitkomst naast de telling, met de bron erbij.',true);
}
{
 const s=slide('Regiotelling en sectormodel');labelExample(s);
 table(s,[['Dijkstad: waargenomen telling','Baliemedewerkers: vereenvoudigd model'],['2.400 inwoners van 15 tot 75 jaar','Personen met elk 20 uur per week'],['1.800 personen in de beroepsbevolking','72 personen werken bij € 18 per uur'],['Eén regio op een telmoment','Eén aparte markt bij modelaannamen']],60,274,1480,370,[740,740],34);
 text(s,'72 personen vervangen de regiotelling van 1.800 personen niet.',60,727,1480,89,39,{bold:true,color:C.blue});
 notes(s,'125–127','De twee bronnen hebben een ander object. Een beroepsbevolking omvat werkenden en werklozen uit een regio. De sectoruitkomst is de werkgelegenheid onder een expliciet loon- en matchingmodel. Je mag 72 niet van 1.800 aftrekken om regionale werkloosheid te vinden.','Welke bron gebruik je voor de bruto-participatie?','De hele beroepsbevolking vormt geen vast arbeidsaanbod bij alle lonen.','Controleer of de leerlingen de gekozen noemer en het punt E kunnen uitleggen.',true);
}
{
 const s=slide('Korte controle vóór het oefenen');
 text(s,'Dijkstad',60,227,650,65,42,{bold:true,color:C.blue});
 text(s,'Welke noemer hoort bij bruto én netto?\nWaarom telt iemand zonder werk soms wel mee?',60,320,1450,127,40);
 rule(s,60,498,1480);text(s,'Baliemedewerkers',60,541,900,63,42,{bold:true,color:C.green});
 text(s,'Wat betekent E = (72; 18)?\nWat verandert als alleen het loon verandert?',60,634,1450,139,40);
 notes(s,'124–127','Antwoorden: noemer2.400 inwoners; iemand zonder werk telt bij bruto mee als die recent zoekt en direct beschikbaar is. E betekent72 personen bij18 euro per uur. Alleen loonverandering is beweging langs bestaande lijnen, geen verschuiving. Laat leerlingen één antwoord uitleggen en bied bij twijfel de passende vorige dia opnieuw aan.','Welke bron of afspraak gebruikte je in je antwoord?','Een goed getal zonder passende eenheid of reden is nog geen volledige uitleg.','Keer op het overzicht eerst terug naar start11, daarna basis12–13. De controle voegt geen huiswerk toe.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 16 · Waterstad en de bezorgsector','target-question');
 text(s,'Bron A',60,197,1480,63,40,{bold:true,color:C.blue});
 text(s,'Waterstad telt 5.000 inwoners van 15 tot 75 jaar.',60,291,1480,87,42);
 table(s,[['Groep','Personen'],['Werkenden','3.000'],['Werklozen','500'],['Niet-deelnemers','1.500']],60,407,1480,323,[1090,390],36);
 text(s,'Boekpagina 130 · Eerst alle bronnen en deelvragen',60,780,1480,46,30,{color:C.muted});
 notes(s,'130','Dit is de volledige inhoud van bronA uit opgave16, nu als tabel. Laat leerlingen hun gemaakte werk erbij houden, maar toon nog geen oplossingen. BronB komt apart.','Welke leeftijdsgroep beschrijft bron A?','De beroepsbevolking is hier nog niet gegeven als afzonderlijk totaal.','Lees nu de volledige bron B.');
}
{
 const s=slide('Opgave 16 · Bron B','target-question');
 text(s,'Een afzonderlijk model voor bezorgers',60,195,1480,63,39,{bold:true});
 text(s,'Lᵥ = 240 − 10w',60,302,735,73,50,{bold:true,color:C.blue});
 text(s,'Lₐ = −40 + 10w',825,302,710,73,50,{bold:true,color:C.green});
 text(s,'L is het aantal personen met 20 uur per week.\nw is het uurloon in euro.',60,436,1480,128,41);
 text(s,'Het model geldt voor € 4 ≤ w ≤ € 24.',60,612,1480,69,41);
 text(s,'Het loon is flexibel; er zijn geen zoekproblemen of loonafspraken.',60,730,1480,97,39);
 notes(s,'130','Alle data, eenheden en aannamen van bronB zijn overgenomen. Deze sector heeft eigen functies. De cijfers en uitkomst van baliemedewerkers gelden hier niet.','Welke afspraken maken loonaanpassing en passende matches mogelijk?','Neem geen loon of hoeveelheid over uit het uitlegvoorbeeld.','Laat alle deelvragen zien voordat er antwoorden verschijnen.');
}
{
 const s=slide('Opgave 16 · Alle deelvragen','target-question');
 const qs=[['a · 3 punten','Bereken met bron A de beroepsbevolking en de bruto- en netto-participatie.'],['b · 3 punten','Bereken met bron B het evenwichtsloon en de werkgelegenheid. Markeer E in de basisgrafiek hieronder.'],['c · 2 punten','Leg uit wie bij dit loon arbeid vragen en aanbieden. Waarom vervangt de modeluitkomst de regiotelling niet?']];
 qs.forEach((r,i)=>{let y=220+i*190;text(s,r[0],60,y,275,79,36,{bold:true,color:C.blue});text(s,r[1],370,y,1165,149,38);if(i<2)rule(s,60,y+160,1480);});
 text(s,'De basisgrafiek bij b staat op de volgende dia. Boekpagina 130.',60,792,1480,44,29,{color:C.muted});
 notes(s,'130','Alle drie subvragen en puntenwaarden zijn letterlijk behouden. Hieronder verwijst in het boek naar de basisgrafiek; toon die nu op de volgende dia. Er zijn nog geen antwoorden onthuld.','Bij welke vraag gebruik je welke bron?','16c vraagt zowel de actoren als de reden waarom het model de telling niet vervangt.','Toon de basisgrafiek zonder het berekende punt E.');
}
{
 const s=slide('Opgave 16b · Basisgrafiek','target-question');graph(s,T,'both');
 text(s,'Lᵥ = 240 − 10w',1150,271,390,76,35,{bold:true,color:C.blue});
 text(s,'Lₐ = −40 + 10w',1150,383,390,76,35,{bold:true,color:C.green});
 text(s,'Markeer E met loon en hoeveelheid.',1150,527,390,145,38,{bold:true});
 text(s,'€ 4 ≤ w ≤ € 24',1150,719,390,73,34);
 notes(s,'130','Basisgrafiek bij de volledige opgave16. Dezelfde functies, eenheden en assenschaal als de boekfiguur. De getekende lijnstukken zijn begrensd op het expliciete geldigheidsgebied uit bronB. De boekfiguur en deze presentatie gebruiken uitsluitend het geldige bereik 4≤w≤24. Dit verandert geen brongegeven of gevraagde bewerking. Laat het berekende punt en hulplijnen eerst door leerlingen aanwijzen, zonder oplossing te tonen.','Hoe zet je straks een berekend loon en aantal personen in deze grafiek?','De functies zijn buiten het aangegeven domein geen geldige voorspelling.','Begin nu de antwoorden bij bron A.');
}
{
 const s=slide('Opgave 16a · De beroepsbevolking','target-answer');
 text(s,'Beroepsbevolking = werkenden + werklozen',60,234,1480,91,43,{bold:true,color:C.blue});
 text(s,'3.000 + 500 = 3.500 personen',60,393,1480,109,57,{bold:true});
 rule(s,60,566,1480);text(s,'Controle met bron A',60,611,1480,63,36,{bold:true});
 text(s,'3.500 + 1.500 = 5.000 inwoners',60,704,1480,82,44);
 notes(s,'130','Tel werkenden en werklozen bij elkaar:3.500. De niet-deelnemers tellen niet bij de beroepsbevolking. Samen met die1.500 is de totale bevolking wel5.000.','Waarom hoort de500 bij de teller van bruto?','Tel werklozen niet nogmaals bij3.500 op.','Gebruik de totale bevolking als noemer voor beide percentages.');
}
{
 const s=slide('Opgave 16a · Bruto- en netto-participatie','target-answer');
 text(s,'Bruto: beroepsbevolking / bevolking × 100%',60,238,1480,71,37,{bold:true,color:C.blue});
 text(s,'3.500 / 5.000 × 100% = 70%',60,348,1480,93,53,{bold:true});rule(s,60,503,1480);
 text(s,'Netto: werkenden / bevolking × 100%',60,546,1480,71,37,{bold:true,color:C.green});
 text(s,'3.000 / 5.000 × 100% = 60%',60,659,1480,93,53,{bold:true});
 notes(s,'130','Werk beide breuken uit met dezelfde noemer5.000. Bruto70%, netto60%. Controle: bruto is groter dan netto en beide vallen tussen0 en100. 70−60 is10 procentpunt, het aandeel werklozen in de hele bevolking.','Welke twee getallen verschillen in deze berekeningen?','500/3.500 is geen participatiepercentage.','Ga naar bron B en los eerst het loon op.');
}
{
 const s=slide('Opgave 16b · Evenwichtsloon en werkgelegenheid','target-answer');
 const rows=[['Gelijkstellen','240 − 10w = −40 + 10w'],['Oplossen','280 = 20w, dus w = € 14 per uur'],['Invullen','Lᵥ = 240 − 10 × 14 = 100 personen'],['Controleren','Lₐ = −40 + 10 × 14 = 100 personen']];
 rows.forEach((r,i)=>{let y=225+i*132;text(s,r[0],60,y,360,78,34,{bold:true,color:C.blue});text(s,r[1],448,y,1090,88,39,{bold:i===1});if(i<3)rule(s,60,y+100,1480);});
 text(s,'€ 14 ligt binnen het domein van € 4 tot en met € 24.',60,790,1480,46,31);
 notes(s,'130','Tel40 bij beide kanten op en breng−10w naar rechts. Deel280 door20. Bereken daarna de hoeveelheid in beide functies. Door de gegeven directe matching is100 personen ook de werkgelegenheid. Iedere persoon werkt20 uur per week; de gevraagde werkgelegenheid is in personen.','Welke berekening controleert dat beide marktpartijen het eens zijn?','100 personen is geen uurloon en geen aantal uren.','Markeer precies dit punt E, met twee hulplijnen.');
}
{
 const s=slide('Opgave 16b · E in de grafiek','target-answer');graph(s,T,'equilibrium');
 text(s,'E = (100; 14)',1150,285,390,77,41,{bold:true,color:C.orange});
 text(s,'Werkgelegenheid\n100 personen\n\nEvenwichtsloon\n€ 14 per uur',1150,413,390,276,35);
 text(s,'Ieder 20 uur per week',1150,734,390,72,32);
 notes(s,'130','E ligt op het snijpunt bijL100 en w14. De verticale hulplijn bereikt100 op de horizontale as, de horizontale hulplijn14 op de verticale as. Beide assen blijven gelijk aan de vraagdia. Het getal100 ligt tussen80 en120;14 ligt net onder15.','Hoe controleer je E met beide functies?','Het snijpunt geeft geen werkloosheidspercentage.','Verklaar nu de actoren en het verschil met de regiotelling.');
}
{
 const s=slide('Opgave 16c · Wie vraagt en wie biedt aan?','target-answer');
 table(s,[['Werkgevers','Huishoudens'],['Vragen arbeid van 100 personen','Bieden arbeid van 100 personen aan'],['Betalen € 14 per gewerkt uur','Ontvangen € 14 per gewerkt uur']],60,246,1480,311,[740,740],35);
 text(s,'Bron B: aparte sector onder vereenvoudigende aannamen',60,622,1480,86,39,{bold:true,color:C.blue});
 text(s,'Bron A: telling van alle inwoners binnen het leeftijdsbereik',60,734,1480,89,39,{bold:true,color:C.green});
 notes(s,'130','Werkgevers vragen arbeid en huishoudens bieden die arbeid.100 personen horen uitsluitend bij het aparte bezorgmodel. BronA telt alle inwoners van15 tot75jaar in Waterstad op een moment. Andere populatie, ander object en modelaannamen: de modeluitkomst vervangt daarom de regiotelling niet. Laat leerlingen hun antwoord op16c controleren op beide gevraagde delen.','Waarom mag je100 niet van3.500 aftrekken om de werkloosheid in Waterstad te vinden?','Een sectormodel met directe matches verklaart niet zonder extra gegevens alle waargenomen regionale werkloosheid.','Laat ontbrekende eenheden, hulplijnen of redeneringen verbeteren. Ga terug naar het overzicht voor huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,tables,charts,overviewSlides:overviews,graphs,sourceManifest:M},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft],{stdio:'inherit'});
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft],{stdio:'inherit'});
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.3.2 Arbeidsaanbod, participatie en evenwicht – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
