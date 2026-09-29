// HOW TO ADAPT: read the classroom recipe and the new paragraph's complete sources.
// Replace the manifest, assignment and teaching moves, not just paragraph numbers.
// Runtime paths are supplied by the installed presentation skill, never stored here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse((await fs.readFile(path.join(HERE,'presentation-212.manifest.json'),'utf8')).replace(/^\uFEFF/,''));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('212');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[], charts=[], slides=[], overviews=[], graphContracts=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/${facts.sourceEdition.split('/').map(encodeURIComponent).join('/')}/`;
const title='§2.1.2 Opbrengsten, winst en break-even';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(label,footer=title){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,label,60,42,1480,86,label.startsWith('Deze les:')?46:52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:label});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: leerlingenboek Boek 2, chatuitgave 2026, revisie 21 september 2026, gedrukte pagina ${page}. ${source}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${source}bronnen/H1/${encodeURIComponent('2.1 Kosten en opbrengsten – antwoorden.md')}\n${extra}`);
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
 text(s,'TO, GO en winst berekenen.\nBreak-even en hele aantallen.\nTK, TO en winst tekenen.',972,244,565,122,31,{name:'overview-goals'});
 rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 14 · Opgaven 1 en 2\n2: verkennen, theorie p. 10–11',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 rule(s,972,570,568);
 text(s,'Huiswerk',972,591,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.1.2\nBasis: 3, 4 en 5\nZelfstandig: 6 en 7\nDoelopgave: 8\nMaken en nakijken',972,650,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'14–17',(`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start: 1 en 2 op pagina 14. Basis: alle begeleide opgaven 3, 4 en 5 op pagina 14–16. Zelfstandig: 6 en 7 op pagina 16. Doel: 8 op pagina 17. Huiswerk: opgaven 3, 4, 5, 6, 7 en 8 maken en nakijken. Bonus 9 en herhaling 10–11 zijn extra. Plan vervolgwerktijd als de volledige route meer dan één les vraagt.` + "\n\nStart en terugblik: Opgave 1 gebruikt de kostenfuncties en gemiddelde kosten uit §2.1.1, dia 4 en 7–9. TO, GO en winst zijn nieuwe formele begrippen. Lees voor opgave 2 de betekenis en formules op p. 10–11. Laat leerlingen bij deze verkenning aanwijzen welke uitleg zij gebruiken en hun twijfel noteren. Verwacht de nieuwe bewerking nog niet zonder steun. Bij terugkeer naar dit overzicht vóór het basiswerk: laat leerlingen opgave 2 opnieuw proberen na de uitleg, bespreek hun redenering en geef zo nodig extra steun. Dit is een verkennende start, geen toets van al beheerste nieuwe leerstof."),active===2?'Welke kostenkennis kun je bij de start gebruiken?':'Bij welke opgave ben je en welke stap vraagt hulp?', 'Het gedrukte paginanummer 14 staat op fysieke PDF-pagina 16. Omzet is nog geen winst.',active===7?'Laat het huiswerk in de agenda noteren.':'Ga door naar de volgende lesfase zodra dat past bij de klas.', 'Startantwoorden: 1a TK = 180 + 3 × 40 = € 300 per week en GTK = 300 / 40 = € 7,50 per badge. 1b TCK = € 180 per week en variabel € 3 per badge. 2a TO = 4 × 80 = € 320 voor de activiteit; GO = 320 / 80 = € 4 per kaart; winst = 320 − 250 = € 70. 2b De € 320 is omzet; de kosten moeten er nog af.');
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Opbrengsten en winst','TO en GO berekenen, GO = P verklaren en kosten aftrekken.'],['Break-even','TO = TK oplossen en de uitkomst vertalen naar hele producten.'],['Tekenen en aflezen','TK en TO tekenen, het snijpunt markeren\nen winst als verticale afstand tonen.']];
 rows.forEach((r,i)=>{let y=220+i*195;text(s,r[0],60,y,580,65,40,{bold:true,color:C.blue});text(s,r[1],685,y,850,120,38);if(i<2)rule(s,60,y+153,1480);});
 notes(s,'10–13','Koppel elk doel aan opgave 8. De kostenfunctie uit §2.1.1 is het vertrekpunt. Alle geproduceerde producten worden verkocht, tenzij een opgave anders zegt. Vergelijk steeds dezelfde periode en blijf binnen de capaciteit.','Wat moet je behalve de opbrengst weten om winst te bepalen?','Een hoog verkoopbedrag garandeert geen winst.','Gebruik WafelWagen als doorlopend voorbeeld.');
}
{
 const s=slide('WafelWagen: opbrengst totaal en per wafel');
 text(s,'Vaste prijs: € 5 per wafel. Capaciteit: 150 wafels per dag.',60,192,1480,70,36,{bold:true,color:C.blue});
 table(s,[['Q (wafels per dag)','TO = 5Q (€ per dag)','GO = TO / Q (€ per wafel)'],['50','5 × 50 = 250','250 / 50 = 5'],['100','5 × 100 = 500','500 / 100 = 5']],60,315,1480,310,[450,480,550],32);
 text(s,'TO = P × Q',60,699,610,67,48,{bold:true,color:C.blue});
 text(s,'GO = P bij Q > 0',810,699,730,67,48,{bold:true,color:C.green});
 notes(s,'10, 13','Opbrengst is het verkoopbedrag, ook omzet genoemd. P is euro per wafel en Q wafels per dag. Vermenigvuldigen geeft TO in euro per dag. Delen door Q geeft GO in euro per wafel. Iedere verkochte wafel brengt dezelfde € 5 op, dus GO blijft gelijk bij meer verkopen. Alle gemaakte wafels worden verkocht.','Wat verandert bij tweemaal zoveel verkochte wafels?','Bij Q = 0 kun je GO niet berekenen. TO en GO hebben verschillende eenheden.','Trek vervolgens alle kosten af van de opbrengst.');
}
{
 const s=slide('Winst: opbrengst na aftrek van alle kosten');
 text(s,'WafelWagen: TO = 5Q en TK = 250 + 2Q',60,190,1480,70,40,{bold:true});
 table(s,[['Q (wafels/dag)','TO (€ per dag)','TK (€ per dag)','Winst (€ per dag)'],['50','5 × 50 = 250','250 + 2 × 50 = 350','250 − 350 = −100'],['100','5 × 100 = 500','250 + 2 × 100 = 450','500 − 450 = 50']],60,306,1480,320,[310,340,425,405],31);
 text(s,'Winst = TO − TK',60,695,740,78,48,{bold:true,color:C.green});
 text(s,'Negatieve winst = verlies',865,705,675,104,37,{bold:true,color:C.orange});
 notes(s,'11, 13','De kraam kost € 250 per dag. Ingrediënten en verpakking kosten € 2 per wafel. Bij 50 wafels zijn de kosten hoger dan de opbrengst: € 100 verlies. Bij 100 wafels blijft € 50 winst over. Bij Q = 0 is TO nul maar TK € 250, dus verlies € 250.','Waarom trek je naast de ingrediënten ook de kraamkosten af?','Vergeet de constante kosten niet. Een minteken bij winst betekent een verliesbedrag.','Zoek de hoeveelheid waarbij beide totalen gelijk zijn.');
}
{
 const s=slide('Break-even: de opbrengst dekt alle kosten');
 text(s,'Alle producten samen',60,220,690,58,36,{bold:true,color:C.blue});
 text(s,'TO = TK',60,327,690,105,68,{bold:true});
 text(s,'Winst = 0',60,477,690,80,47,{bold:true,color:C.green});
 text(s,'Per product, bij Q > 0',825,220,710,58,36,{bold:true,color:C.blue});
 text(s,'TO / Q = TK / Q',825,327,710,88,49,{bold:true});
 text(s,'GO = GTK',825,477,710,80,47,{bold:true,color:C.green});
 rule(s,60,631,1480);text(s,'Bij een vaste prijs geldt hier ook P = GTK.',60,690,1480,82,42,{bold:true});
 notes(s,'11','Break-even betekent geen winst en geen verlies. TO en TK kunnen allebei positief zijn. Deel beide totalen door dezelfde positieve hoeveelheid om GO = GTK te krijgen. Omdat de prijs vast is, is GO = P.','Zijn TO en TK nul als de winst nul is?','Winst nul is niet hetzelfde als geen verkoop.','Bereken de break-even-afzet van WafelWagen.');
}
{
 const s=slide('WafelWagen: break-even berekenen');
 const rows=[['TO = TK','Opbrengst gelijk aan kosten'],['5Q = 250 + 2Q','Functies invullen'],['3Q = 250','Aan beide kanten 2Q aftrekken'],['Q = 250 / 3 = 83,333…','Delen door 3']];
 rows.forEach((r,i)=>{let y=215+i*135;text(s,r[0],60,y,900,82,44,{bold:true,color:i===3?C.green:C.ink});text(s,r[1],1020,y+6,520,94,32);});
 text(s,'Snijpunt: Q ≈ 83,33 wafels per dag',60,779,1480,57,36,{bold:true,color:C.blue});
 notes(s,'11, 13','Werk met de ongeronde Q = 250 / 3. TO = 5 × (250 / 3) = 416,666… en TK = 250 + 2 × (250 / 3) = 416,666… euro per dag. Het snijpunt is dus ongeveer (83,33; 416,67).','Welke bewerking doe je aan beide kanten van de vergelijking?','Rond de hoeveelheid niet tussendoor af als je de opbrengst in het snijpunt berekent.','Controleer nu wat mogelijk is met hele wafels.');
}
{
 const s=slide('Hele wafels: het eerste aantal zonder verlies');
 text(s,'De berekende grens ligt tussen 83 en 84 wafels per dag.',60,189,1480,91,39,{bold:true,color:C.blue});
 table(s,[['Q (wafels/dag)','TO (€ per dag)','TK (€ per dag)','Winst (€ per dag)'],['83','415','416','−1'],['84','420','418','+2']],60,326,1480,295,[390,360,360,370],33);
 text(s,'84 wafels: € 2 winst per dag',60,678,1480,72,48,{bold:true,color:C.green});
 text(s,'84 past binnen de capaciteit van 150 wafels per dag.',60,785,1480,50,33);
 notes(s,'11, 13','Het model heeft een doorlopende hoeveelheid, echte wafels zijn heel. De winst stijgt hier bij elke extra wafel met € 3. Daarom controleer je het gehele aantal onder en boven de grens. 83 geeft verlies, 84 geeft winst. Het eerste gehele aantal zonder verlies is 84 en ligt binnen de capaciteit.','Waarom is afronden naar 83 hier geen bruikbaar antwoord?','Bij 84 is de winst niet exact nul. Noem het eerste gehele aantal zonder verlies apart van de modelgrens.','Zet de functies daarna om in grafiekpunten.');
}
{
 const s=slide('Twee punten bepalen iedere rechte lijn');
 text(s,'WafelWagen: een punt is (Q; bedrag).',60,190,1480,60,38,{bold:true,color:C.blue});
 table(s,[['Lijn','Punt bij Q = 0','Punt bij Q = 100'],['TK = 250 + 2Q','(0; 250)','(100; 450)'],['TO = 5Q','(0; 0)','(100; 500)']],60,322,1480,295,[640,420,420],35);
 text(s,'Horizontaal: Q, wafels per dag',60,687,1480,61,40,{bold:true});
 text(s,'Verticaal: TO en TK, euro per dag',60,770,1480,61,40,{bold:true});
 notes(s,'12–13','Vul voor iedere lijn twee verschillende hoeveelheden in. Kies daarna een regelmatige schaal en zet eerst de assen en punten neer. Trek de rechte lijnen tot de capaciteit van 150 wafels. De as mag voor labels verder lopen, de functies niet.','Waar begint TK als er geen wafels worden verkocht?','Wissel de coördinaten niet om: eerst hoeveelheid, dan totaalbedrag.','Teken eerst TK, daarna TO en het snijpunt.');
}
const examples={
 wafel:{name:'WafelWagen',capacity:150,fixed:250,variable:2,price:5,q:100,unit:'wafels per dag',period:'dag',xmax:180,xstep:30,ymax:800,ystep:200,beText:'83,33',moneyText:'416,67',page:'12–13'},
 bread:{name:'De Korenaar',capacity:1000,fixed:500,variable:0.8,price:1.5,q:1000,unit:'broden per maand',period:'maand',xmax:1200,xstep:200,ymax:1800,ystep:300,beText:'714,29',moneyText:'1.071,43',page:'17'}
};
function graph(key,stage){
 const m=examples[key],target=key==='bread';
 const label=target?['Opgave 8d · Eerst TK','Opgave 8d · TO en het snijpunt','Opgave 8d · Winst als verticale afstand'][stage-1]:['WafelWagen: de kostenlijn','WafelWagen: opbrengst en break-even','WafelWagen: winst en verlies aflezen'][stage-1];
 const s=slide(label,target?title+' · Opgave 8 · Boekpagina 17':title);
 const be=m.fixed/(m.price-m.variable),to=q=>m.price*q,tk=q=>m.fixed+m.variable*q;
 function line(name,xs,ys,col,width=4,style='solid',symbol='none'){
  // Chart workbooks use Excel's decimal precision. Keep 14 significant digits
  // only at export; the algebra and intersection calculations remain unrounded.
  return {name,xValues:xs.map(v=>Number(v.toPrecision(14))),values:ys.map(v=>Number(v.toPrecision(14))),line:{fill:col,width,style},marker:{symbol,size:9,fill:col,line:{fill:col,width:1}}};
 }
 const series=[line('TK',[0,m.capacity],[tk(0),tk(m.capacity)],C.orange)];
 if(stage>=2)series.push(line('TO',[0,m.capacity],[to(0),to(m.capacity)],C.blue),line('Break-even',[be],[to(be)],C.ink,0,'solid','diamond'));
 if(stage===3){
  series.push(line('Winstafstand',[m.q,m.q],[tk(m.q),to(m.q)],C.green,7));
  if(!target)series.push(line('Verliesafstand',[50,50],[to(50),tk(50)],C.orange,7));
 }
 const ch=s.charts.add('scatter',{position:{left:60,top:210,width:1040,height:605},series,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'#,##0',title:{text:`Q (${m.unit})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'#,##0',title:{text:`TO en TK (€ per ${m.period})`,textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 graphContracts.push({slide:p.slides.items.length,key,stage,...m,be,series:series.map(({name,xValues,values})=>({name,xValues,values}))});
 if(stage===1){
  text(s,target?'TK = 500 + 0,80Q':'TK = 250 + 2Q',1140,252,400,70,33,{bold:true,color:C.orange});
  text(s,target?'Bij Q = 0:\n€ 500 kosten.':'Bij Q = 0:\n€ 250 kosten.',1140,388,400,132,34);
  text(s,`Capaciteit:\n${target?'1.000 broden\nper maand':'150 wafels\nper dag'}`,1140,629,400,163,34,{bold:true});
 }else if(stage===2){
  text(s,'Break-even',1140,252,400,58,37,{bold:true,color:C.blue});
  text(s,`Q ≈ ${m.beText}\nTO = TK\n≈ € ${m.moneyText}`,1140,348,400,170,34);
  text(s,'Links: verlies\nTO < TK\n\nRechts: winst\nTO > TK',1140,589,400,230,32,{bold:true});
 }else{
  text(s,target?'Bij Q = 1.000':'Bij Q = 100',1140,252,400,57,36,{bold:true});
  text(s,target?'TO = € 1.500\nTK = € 1.300\nWinst = € 200':'TO = € 500\nTK = € 450\nWinst = € 50',1140,341,400,176,34,{bold:true,color:C.green});
  text(s,target?'Per maand.\nDe verticale afstand\nis TO − TK.':'Bij Q = 50:\n€ 250 − € 350\n= −€ 100 per dag.',1140,609,400,175,32);
 }
 notes(s,m.page,stage===1?`Teken TK door (0; ${m.fixed}) en (${m.capacity}; ${tk(m.capacity)}). De lijn stopt bij de capaciteit van ${m.capacity} ${m.unit}. De assen gebruiken een regelmatige schaal en beginnen bij nul.`:stage===2?`Voeg TO toe door (0; 0) en (${m.capacity}; ${to(m.capacity)}). Markeer het exacte snijpunt met de berekende Q = ${m.fixed} / (${m.price} − ${m.variable}); rond alleen het label af tot ${m.beText}. De bijbehorende TO en TK zijn ongeveer € ${m.moneyText} per ${m.period}. Links ligt TO onder TK, rechts erboven, tot de capaciteit.`:`Lees beide bedragen bij dezelfde Q = ${m.q} af. Het verticale lijnstuk loopt van TK = ${tk(m.q)} tot TO = ${to(m.q)} euro per ${m.period}. Het verschil is ${to(m.q)-tk(m.q)} euro winst per ${m.period}. ${target?'De winstzone ligt rechts van het snijpunt tot en met 1000 broden.':'Bij Q = 50 loopt het verlieslijnstuk van 250 tot 350: € 100 verlies per dag.'}`,stage===1?'Waarom begint TK boven nul?':stage===2?'Waar zijn beide totale bedragen gelijk?':'Waarom geeft dit lijnstuk winst weer?', 'Een oppervlakte tussen TO en TK is geen winstbedrag. De verticale as bevat al totale bedragen. De assen lopen voor labels iets verder door, de functies stoppen bij de capaciteit.',stage===1?'Voeg de opbrengstenlijn toe op dezelfde assen.':stage===2?'Lees vervolgens beide lijnhoogten bij één hoeveelheid.':target?'Controleer je eigen antwoord met alle gevraagde onderdelen.':'Controleer kort het begrip voordat leerlingen gaan oefenen.');
}
graph('wafel',1);graph('wafel',2);graph('wafel',3);
function check(reveal){
 const s=slide('Korte controle: 84 wafels');
 text(s,'“Bij 84 wafels is WafelWagen precies break-even.”',60,215,1480,148,48,{bold:true,color:C.blue});
 if(!reveal)text(s,'Klopt dit?\nGebruik TO en TK om je antwoord uit te leggen.',60,485,1480,180,44);
 else{
  text(s,'TO = 5 × 84 = € 420 per dag',60,441,1480,72,44);
  text(s,'TK = 250 + 2 × 84 = € 418 per dag',60,553,1480,72,44);
  text(s,'Winst = € 2 per dag',60,683,1480,74,48,{bold:true,color:C.green});
  text(s,'84 is het eerste gehele aantal zonder verlies.',60,789,1480,51,33,{bold:true});
 }
 notes(s,'11, 13',reveal?'De uitspraak klopt niet. Bij 84 wafels is er € 2 winst. Exact break-even ligt bij Q = 250 / 3. 84 is wel het eerste gehele aantal zonder verlies.':'Laat leerlingen eerst individueel kiezen en daarna hun berekening uitleggen. Onthul de uitkomst pas op de volgende dia. Dit is een korte begripscontrole op het boekvoorbeeld.', 'Wat is het verschil tussen winst nul en geen verlies?', 'Rond de modelgrens niet af en noem dat daarna exact break-even.',reveal?'Laat de overzichtsdia staan tijdens het werken.':'Toon de berekeningen nadat leerlingen hebben geantwoord.');
}
check(false);check(true);
overview('Zelfstandig werken',4);
const targetFooter=title+' · Opgave 8 · Boekpagina 17';
{
 const s=slide('Opgave 8 · Bakkerij De Korenaar',targetFooter);
 text(s,'De Korenaar heeft de kostenfunctie TK = 500 + 0,80Q.',60,208,1480,110,42,{bold:true});
 text(s,'Ieder brood wordt verkocht voor een vaste prijs van € 1,50.',60,355,1480,110,42,{bold:true,color:C.blue});
 text(s,'De capaciteit is 1.000 broden per maand.',60,508,1480,75,40);
 rule(s,60,629,1480);
 text(s,'Q is het aantal broden per maand.\nTotale bedragen zijn in euro per maand.',60,684,1480,135,38);
 notes(s,'17','Start de bespreking nadat leerlingen opgave 8 zelf geprobeerd hebben. Deze gegevens komen volledig uit de doelopgave. Alle broden worden verkocht. Laat eerst alle deelvragen zien voordat je een uitwerking toont.','Welke grootheden en eenheden staan in de gegevens?','De vaste prijs is een bedrag per brood; TK is een totaal per maand.','Toon de eerste twee deelvragen.');
}
{
 const s=slide('Opgave 8 · Deelvragen a en b',targetFooter);
 text(s,'a) Stel de functie voor TO op.\nLeg voor Q > 0 uit waarom GO hier gelijk is aan de prijs.',60,230,1480,178,43);
 rule(s,60,471,1480);
 text(s,'b) Bereken de winst bij Q = 500 en bij Q = 1.000.',60,543,1480,151,43);
 notes(s,'17','Toon deze deelvragen zonder antwoorden. Laat leerlingen hun schrift erbij houden. Bij a hoort behalve de functie ook een verklaring; bij b horen twee berekeningen met eenheden.','Welke verklaring vraagt deelvraag a naast de formule?','Alleen een eindbedrag zonder berekening en eenheid is geen volledige uitwerking.','Toon ook c en d voordat je antwoorden bespreekt.');
}
{
 const s=slide('Opgave 8 · Deelvragen c en d',targetFooter);
 text(s,'c) Los algebraïsch TO = TK op. Noteer zowel de break-even-afzet volgens de rechte lijnen als het eerste gehele aantal broden waarbij geen verlies ontstaat.',60,197,1480,204,38);
 rule(s,60,447,1480);
 text(s,'d) Teken TK en TO in één assenstelsel. Benoem beide assen met grootheid en eenheid. Markeer het break-evenpunt en geef aan waar winst en waar verlies ontstaat. Geef bij Q = 1.000 de winst van € 200 weer als verticale afstand. Kleur geen oppervlakte als winst.',60,499,1480,303,38);
 notes(s,'17','Dit zijn de volledige deelvragen c en d. De € 200 is al gegeven in de oorspronkelijke vraag d, dus laat dit staan. Er zijn nog geen antwoordberekeningen getoond. Bij c zijn zowel de modelgrens als het eerste gehele aantal gevraagd.','Welke onderdelen moeten zichtbaar zijn in je grafiek?', 'Winst als oppervlakte is hier onjuist. Ook assen, eenheden en de verlieszone horen bij het antwoord.', 'Begin de uitwerking bij TO en GO.');
}
{
 const s=slide('Opgave 8a · TO en GO',targetFooter);
 text(s,'TO = P × Q = 1,50Q',60,219,1480,90,54,{bold:true,color:C.blue});
 text(s,'Totale opbrengst in euro per maand',60,322,1480,61,35);
 rule(s,60,436,1480);
 text(s,'GO = TO / Q = 1,50Q / Q = € 1,50 per brood',60,493,1480,112,43,{bold:true,color:C.green});
 text(s,'Bij Q > 0. Ieder brood brengt dezelfde prijs op.',60,697,1480,107,40);
 notes(s,'17','Vermenigvuldig de prijs per brood met het aantal verkochte broden per maand. Deel voor GO de totale opbrengst door Q. Omdat ieder brood dezelfde € 1,50 opbrengt, is de gemiddelde opbrengst diezelfde prijs.','Waarom stijgt GO niet als er meer broden worden verkocht?','Bij Q = 0 is GO niet gedefinieerd. De eenheid van GO is euro per brood.','Bereken winst door TO en TK bij dezelfde Q in te vullen.');
}
function targetProfit(q){
 const large=q===1000,s=slide(`Opgave 8b · ${large?'1.000':'500'} broden`,targetFooter);
 text(s,`Q = ${large?'1.000':'500'} broden per maand`,60,194,1480,66,38,{bold:true,color:C.blue});
 text(s,large?'TO = 1,50 × 1.000 = € 1.500':'TO = 1,50 × 500 = € 750',60,325,1480,82,48);
 text(s,large?'TK = 500 + 0,80 × 1.000 = € 1.300':'TK = 500 + 0,80 × 500 = € 900',60,467,1480,83,46);
 rule(s,60,601,1480);
 text(s,large?'Winst = 1.500 − 1.300 = € 200 per maand':'Winst = 750 − 900 = −€ 150 per maand',60,657,1480,90,43,{bold:true,color:large?C.green:C.orange});
 text(s,large?'De opbrengst dekt alle kosten en laat € 200 over.':'De opbrengst dekt niet alle kosten: € 150 verlies.',60,781,1480,55,33);
 notes(s,'17',large?'Vul 1000 in beide functies in. De opbrengst is 1500, de kosten zijn 500 + 800 = 1300 en de winst is 200 euro per maand. De capaciteit is precies bereikt.':'Vul 500 in beide functies in. TO = 750, TK = 500 + 400 = 900 en de winst is −150 euro per maand. Het minteken betekent € 150 verlies.', 'Welk bedrag trek je van welk bedrag af?', 'Trek alle kosten af, inclusief de 500 euro vaste kosten.',large?'Bereken nu de hoeveelheid waarbij het resultaat precies nul is.':'Herhaal deze stappen voor 1000 broden.');
}
targetProfit(500);targetProfit(1000);
{
 const s=slide('Opgave 8c · De exacte break-evengrens',targetFooter);
 const rows=[['TO = TK','Opbrengst gelijk aan kosten'],['1,50Q = 500 + 0,80Q','Functies invullen'],['0,70Q = 500','Aan beide kanten 0,80Q aftrekken'],['Q = 500 / 0,70 = 714,285714…','Delen door 0,70']];
 rows.forEach((r,i)=>{let y=210+i*134;text(s,r[0],60,y,1000,84,i===3?41:43,{bold:true,color:i===3?C.green:C.ink});text(s,r[1],1100,y+5,440,95,30);});
 text(s,'Volgens de rechte lijnen: ongeveer 714,29 broden per maand',60,780,1480,55,35,{bold:true,color:C.blue});
 notes(s,'17','De exacte hoeveelheid is 500 / 0,70 = 5000 / 7. De prijs is € 1,50, dus TO = 1,50 × (500 / 0,70) = € 1071,428571… per maand. Substitutie in TK geeft hetzelfde bedrag. Rond pas het getoonde snijpunt af tot (714,29; 1071,43).','Waarom gebruik je bij de opbrengstberekening de ongeronde Q?','De lijnberekening levert geen geheel verkoopbaar brood op.','Controleer de twee omliggende gehele aantallen.');
}
{
 const s=slide('Opgave 8c · Het eerste gehele aantal',targetFooter);
 text(s,'Winst = TO − TK = 0,70Q − 500',60,195,1480,76,45,{bold:true,color:C.blue});
 table(s,[['Q (broden per maand)','Berekening winst','Resultaat per maand'],['714','0,70 × 714 − 500','−€ 0,20'],['715','0,70 × 715 − 500','+€ 0,50']],60,328,1480,296,[440,590,450],34);
 text(s,'715 broden per maand: het eerste aantal zonder verlies',60,679,1480,98,42,{bold:true,color:C.green});
 text(s,'715 ≤ 1.000, dus dit past binnen de capaciteit.',60,788,1480,52,34);
 notes(s,'17','Vereenvoudig TO − TK tot 0,70Q − 500. De winst neemt hier toe met Q. Bij 714 broden ontstaat nog € 0,20 verlies. Bij 715 ontstaat € 0,50 winst. Het eerste gehele aantal zonder verlies is daarom 715, binnen de capaciteit van 1000.','Waarom is 714 ondanks afronding niet voldoende?','715 broden is niet exact break-even: de winst is € 0,50.','Bereid de grafiek voor met twee punten per lijn.');
}
{
 const s=slide('Opgave 8d · Punten voor de grafiek',targetFooter);
 table(s,[['Lijn','Bij Q = 0','Bij Q = 1.000'],['TK = 500 + 0,80Q','(0; 500)','(1.000; 1.300)'],['TO = 1,50Q','(0; 0)','(1.000; 1.500)']],60,230,1480,310,[650,370,460],34);
 text(s,'Horizontaal: Q, broden per maand',60,606,1480,61,39,{bold:true});
 text(s,'Verticaal: TO en TK, euro per maand',60,686,1480,61,39,{bold:true});
 text(s,'De lijnen stoppen bij 1.000 broden per maand.',60,782,1480,52,34,{color:C.blue});
 notes(s,'17','Bereken eerst twee punten per lijn en kies een regelmatige schaal. Gebruik de eerdere totalen bij Q = 1000 als tweede punt. De kostenlijn begint bij 500, de opbrengstenlijn bij nul.','Welke eerdere berekeningen kun je voor de grafiek hergebruiken?','Een lijn moet zowel een naam als de juiste coördinaten hebben.','Teken eerst de kostenlijn.');
}
graph('bread',1);graph('bread',2);graph('bread',3);
{
 const s=slide('Antwoordcontrole bij opgave 8');
 const rows=[['a · Opbrengsten','TO = 1,50Q en GO = € 1,50 per brood, met verklaring.'],['b · Winst','Bij 500: −€ 150. Bij 1.000: +€ 200 per maand.'],['c · Break-even','Modelgrens ≈ 714,29. Eerste gehele aantal: 715 broden.'],['d · Grafiek','Assen, lijnen, snijpunt, winst/verlies en verticale € 200.']];
 rows.forEach((r,i)=>{const y=210+i*142;text(s,r[0],60,y,480,65,37,{bold:true,color:C.blue});text(s,r[1],575,y,960,102,35);});
 text(s,'Verbeter één ontbrekende stap of uitleg in je eigen antwoord.',60,791,1480,49,32,{bold:true});
 notes(s,'17','Laat leerlingen controleren of hun antwoord alle vier de onderdelen bevat. Bij c hoort de controle 714 geeft −0,20 en 715 geeft +0,50 euro per maand. Bij d hoort het snijpunt (714,29; 1071,43) en de verticale afstand van 1300 tot 1500 bij Q = 1000. De functies gelden tot de capaciteit.','Welke stap of verklaring moet je nog aanvullen?','Een correct eindgetal vervangt de gevraagde redenering of grafiek niet.','Laat het afsluitende overzicht staan en laat het huiswerk noteren.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...facts,slides,overviewSlides:overviews,tableSlides:tables,chartSlides:charts},null,2));
await fs.writeFile(path.join(BUILD,'graph-contracts.json'),JSON.stringify(graphContracts,null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(HERE,'presentation-212-chart-labels.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'2.1.2 Opbrengsten, winst en break-even – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
