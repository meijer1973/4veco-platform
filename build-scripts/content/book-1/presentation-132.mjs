import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont, PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

// Current Book 1 second edition, not the frozen first-edition web companion.
// Assignment and prerequisite anchors: adjacent edition-qualified manifest.
// HOW TO ADAPT: set discovered runtime environment variables and a fresh absolute
// PRESENTATION_WORKSPACE. Derive new paragraph data from its current sources;
// retain one overview function and recheck final PowerPoint graphs after changes.
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('132');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/173aa9a803897965c572df2c4e7f83cdb135eb1c/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer='§1.3.2 Marktevenwicht'){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,extra=''){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte leerlingboekpagina ${page}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H3/Antwoorden.md\n${extra}`);
}
function enotes(s,page,...args){notes(s,page,...args,'Uitlegvoorbeeld — niet uit het boek. De pennenetuimarkt, functies en cijfers zijn afzonderlijk voor deze presentatie gemaakt. De boekpagina onderwijst de methode, niet deze gegevens. Qv = 72 − 4P voor 0 ≤ P ≤ 18; Qa = 4P − 8 voor 2 ≤ P ≤ 18. P in euro per etui; Q in etuis per week.');}
function table(s,values,x,y,w,h,widths,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}tables.push(p.slides.items.length);return t;
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 20.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §1.3.2 Marktevenwicht');overviews.push(p.slides.items.length);text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],790,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Evenwicht berekenen en tekenen.\nOverschot, verkoop en\nprijsdruk verklaren.',972,244,565,122,31,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 102 · Opgaven 12 en 13\n13: verkennen, theorie p. 96–97',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§1.3.2 Marktevenwicht\nBasis: 14, 15 en 16\nZelfstandig: 17, 18 en 19\nDoelopgave: 20\nMaken en nakijken',972,654,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'96–97, 102–106','Laat dit overzicht staan tijdens '+phase.toLowerCase()+'. Start 12–13 staat op p.102. Opgave 12 haalt terugrekenen en invullen op, onderwezen op p.27 en p.48–49. Opgave 13 verkent een nieuw begrip: laat leerlingen de definitie en uitleg over dezelfde transacties op p.96–97 gebruiken, aanwijzen wat helpt en vragen noteren. Dit is geen toets van al beheerste kennis. Keer vóór het basiswerk terug naar 13: laat de klas opnieuw onderbouwen. Bespreek dan: evenwicht, 60 verkochte bidons, omdat één verkoop dezelfde aankoop is. Basis 14–16 op p.103–104, zelfstandig 17–19 op p.105, doel 20 op p.106. Huiswerk is 14, 15, 16, 17, 18, 19 en 20 maken en nakijken. Bonus 21 en herhaling 22 zijn extra. De volledige route kan meerdere lessen vragen.','Welke denkstap wil je na de uitleg opnieuw proberen?','Start 13 gebruikt nieuwe tweezijdige marktkennis. Een startpoging bewijst geen beheersing.',active===7?'Laat het huiswerk in de agenda schrijven.':'Ga verder naar de volgende lesfase.');return s;
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Evenwicht','Je berekent P, controleert Q in beide functies en legt uit.'],['Een marktgrafiek','Je tekent V en A, met E, schalen, eenheden en hulplijnen.'],['Plannen en verkoop','Je berekent overschotten en bepaalt de verkoop.'],['Prijsdruk','Je verklaart de reacties langs de bestaande lijnen.']];
 rows.forEach((a,i)=>{let y=210+i*145;text(s,a[0],60,y,540,58,38,{bold:true,color:C.blue});text(s,a[1],650,y,880,108,35);if(i<3)rule(s,60,y+117,1480);});
 notes(s,'96','Koppel de doelen aan opgave 20. De klas kende losse vraag- en aanbodplannen. Vandaag worden die bij dezelfde prijs gecombineerd. Twee functies gelijkstellen wordt stap voor stap aangeleerd.','Wanneer passen koop- en verkoopplannen bij elkaar?','Twee functies kennen betekent nog niet dat gelijkstellen al beheerst is.','Introduceer de afzonderlijke pennenetuimarkt.');
}
{
 const s=slide('Koopplannen en verkoopplannen');text(s,'Uitlegvoorbeeld — niet uit het boek',60,184,1480,48,30,{bold:true,color:C.blue});text(s,'Eén soort pennenetui, veel kleine kopers en verkopers',60,255,1480,62,37,{bold:true});
 table(s,[['Collectieve vraag','Collectief aanbod'],['Qᵥ = 72 − 4P','Qₐ = 4P − 8'],['0 ≤ P ≤ 18','2 ≤ P ≤ 18']],60,356,1480,259,[740,740],38);
 text(s,'P: € per etui      Qᵥ en Qₐ: etuis per week',60,673,1480,60,36,{bold:true});text(s,'De overige omstandigheden blijven gelijk.',60,767,1480,50,34);
 enotes(s,'96','Qv is wat alle kopers bij P willen en kunnen kopen; Qa wat verkopers bij dezelfde P willen en kunnen aanbieden. Haal collectieve vraag p.68–69 en aanbod als plan p.86–87 op. Beide functies zijn geldig in het gezamenlijke prijsinterval 2 ≤ P ≤ 18. Deelnemers kunnen elkaar vinden.','Welke eenheid hoort bij P en welke bij Q?','Hoofdletter Q is hier een markttotaal. Aanbod is nog geen verkoop.','Vergelijk de plannen bij enkele prijzen.');
}
{
 const s=slide('Evenwicht: dezelfde hoeveelheid bij dezelfde prijs');text(s,'Pennenetuis',60,188,1480,49,35,{bold:true,color:C.blue});
 table(s,[['P (€ per etui)','Qᵥ (per week)','Qₐ (per week)'],['8','40','24'],['10','32','32'],['12','24','40']],60,289,1480,345,[490,495,495],36);
 text(s,'Evenwichtsprijs: € 10 per etui',60,688,1480,57,41,{bold:true,color:C.blue});text(s,'Evenwichtshoeveelheid: 32 etuis per week',60,769,1480,57,41,{bold:true,color:C.green});
 enotes(s,'96–97','Herhaal substitutie: bij 8 geeft 72 − 4 × 8 = 40 en 4 × 8 − 8 = 24. Bij 10 zijn beide 32. Kopers kopen dezelfde etuis die verkopers verkopen. De 32 transacties tellen niet dubbel. Evenwicht vervult niet alle behoeften en bewijst geen eerlijke verdeling.','Welke rij heeft gelijke plannen?','Tel Qv en Qa niet op tot 64.','Bereken dezelfde prijs algebraïsch.');
}
function algebra(s,rows){rows.forEach((a,i)=>{let y=296+i*114;text(s,a[0],60,y,710,67,46,{bold:i===3,color:i===3?C.blue:C.ink});text(s,a[1],825,y+6,690,65,33);});}
{
 const s=slide('De evenwichtsprijs berekenen');text(s,'In evenwicht: Qᵥ = Qₐ',60,188,1480,65,40,{bold:true,color:C.blue});
 algebra(s,[['72 − 4P = 4P − 8',''],['72 = 8P − 8','+4P aan beide kanten'],['80 = 8P','+8 aan beide kanten'],['P = 10','beide kanten delen door 8']]);text(s,'De prijs van € 10 valt binnen beide domeinen.',60,781,1480,50,33,{bold:true});
 enotes(s,'98','Dit is de eerste vergelijking met P aan beide kanten. Laat elke bewerking hardop benoemen. De terugrekenmethode p.27 en p.49 blijft geldig: aan beide zijden hetzelfde doen. Begin met de economische voorwaarde.','Waarom mag je aan beide kanten 4P optellen?','Een minteken verandert niet vanzelf. Qv = 0 bepaalt een assnijpunt.','Bereken Q en controleer de andere functie.');
}
{
 const s=slide('De hoeveelheid berekenen en controleren');text(s,'P = € 10 per etui',60,191,1480,65,40,{bold:true,color:C.blue});
 text(s,'Vraag',60,308,380,60,36,{bold:true,color:C.blue});text(s,'Qᵥ = 72 − 4 × 10 = 32',465,306,1060,70,44);text(s,'Controle: aanbod',60,444,380,104,36,{bold:true,color:C.green});text(s,'Qₐ = 4 × 10 − 8 = 32',465,443,1060,70,44);rule(s,60,596,1480);text(s,'Bij € 10 per etui sluiten beide plannen voor\n32 etuis per week op elkaar aan.',60,653,1480,153,43,{bold:true});
 enotes(s,'98','Bereken Q uit één functie en controleer onafhankelijk in de andere. Bij een verschil is de prijs of substitutie onjuist. Lees de volledige eenheden mee.','Wat zou een controle-uitkomst van 31 betekenen?','Alleen P=10 is nog geen volledig antwoord.','Maak van de functies een tekening.');
}
{
 const s=slide('Twee punten per rechte lijn');text(s,'Coördinaten: (Q; P). Hoeveelheid eerst.',60,188,1480,60,38,{bold:true,color:C.blue});
 table(s,[['Lijn','Berekening','Punt (Q; P)'],['V','P = 0: Qᵥ = 72\nQᵥ = 0: 72 − 4P = 0, dus P = 18','(72; 0)\n(0; 18)'],['A','Qₐ = 0: 4P − 8 = 0, dus P = 2\nP = 18: Qₐ = 4 × 18 − 8 = 64','(0; 2)\n(64; 18)']],60,290,1480,360,[150,970,360],32);
 text(s,'Q-as: 0–80, stappen van 8. P-as: 0–18, stappen van 2.',60,711,1480,104,36,{bold:true});
 enotes(s,'97–98, 101','Herhaal p.24–25 en p.48–49: kies assen en schaal, bereken twee geldige punten per rechte lijn. Voor A ligt P=0 buiten het domein. Los Qa=0 op of kies een geldige prijs. De tweede A-coördinaat gebruikt de hoogste geldige prijs.','Waarom nemen we bij A niet het punt bij P=0?','Coördinaten zijn (Q;P). De assen hoeven niet dezelfde stapgrootte te hebben.','Teken eerst V.');
}
const EX={v0:72,vb:4,ab:4,ac:8,pmax:18,qmax:80,qunit:8,punit:2,eqP:10,eqQ:32,unit:'etuis per week',punitLabel:'€ per etui'};
const TG={v0:150,vb:10,ab:5,ac:30,pmax:15,qmax:150,qunit:30,punit:3,eqP:12,eqQ:30,unit:'bekers per week',punitLabel:'€ per beker'};
function graph(s,m,{supply=true,equilibrium=false,price=null}={}){
 const rn=v=>Math.round(v*10000)/10000;
 const label=(idx,txt,pos='right')=>({idx,text:txt,position:pos,textStyle:{typeface:FONT,fontSize:28,fill:C.ink,bold:true},showValue:false});
 const series=[{name:'V',xValues:[0,rn(m.v0*.7),m.v0],values:[m.v0/m.vb,rn(m.v0*.3/m.vb),0],line:{fill:C.blue,width:4},marker:{symbol:'none'},dataLabelOverrides:[label(1,'V','top')]}];
 if(supply)series.push({name:'A',xValues:[0,rn((m.ab*m.pmax-m.ac)*.82),m.ab*m.pmax-m.ac],values:[m.ac/m.ab,rn((rn((m.ab*m.pmax-m.ac)*.82)+m.ac)/m.ab),m.pmax],line:{fill:C.green,width:4},marker:{symbol:'none'},dataLabelOverrides:[label(1,'A','bottom')]});
 if(equilibrium){series.push({name:'Hulplijnen E',xValues:[0,m.eqQ,m.eqQ],values:[m.eqP,m.eqP,0],line:{fill:C.muted,width:2,style:'dashed'},marker:{symbol:'none'}});series.push({name:'E',xValues:[m.eqQ],values:[m.eqP],line:{fill:C.ink,width:0},marker:{symbol:'circle',size:10},dataLabelOverrides:[label(0,'E','top')]});}
 if(price!==null){const v=m.v0-m.vb*price,a=m.ab*price-m.ac;series.push({name:'Prijs',xValues:[0,Math.max(v,a)],values:[price,price],line:{fill:C.muted,width:2,style:'dashed'},marker:{symbol:'none'}});series.push({name:'Verschil',xValues:[Math.min(v,a),Math.max(v,a)],values:[price,price],line:{fill:C.orange,width:7},marker:{symbol:'circle',size:7}});series.push({name:'Qv lezen',xValues:[v,v],values:[price,0],line:{fill:C.blue,width:2,style:'dashed'},marker:{symbol:'none'}});series.push({name:'Qa lezen',xValues:[a,a],values:[price,0],line:{fill:C.green,width:2,style:'dashed'},marker:{symbol:'none'}});}
 const ch=s.charts.add('scatter',{position:{left:60,top:241,width:1060,height:555},series,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false},xAxis:{min:0,max:m.qmax,majorUnit:m.qunit,numberFormatCode:'0',title:{text:'Q ('+m.unit+')',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:2}},yAxis:{min:0,max:m.pmax,majorUnit:m.punit,numberFormatCode:'0',title:{text:'P ('+m.punitLabel+')',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:2}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
}
for(const stage of [0,1,2]){
 const s=slide(['De vraaglijn tekenen','De aanbodlijn toevoegen','Het snijpunt en de hulplijnen'][stage]);text(s,'Pennenetuis: dezelfde functies en dezelfde schalen',60,186,1480,47,33,{bold:true,color:C.blue});graph(s,EX,{supply:stage>0,equilibrium:stage===2});
 text(s,['V door\n(0; 18) en\n(72; 0)','A door\n(0; 2) en\n(64; 18)','E = (32; 10)\n\nP = € 10\nQ = 32'][stage],1170,306,365,235,34,{bold:true,color:stage===1?C.green:C.blue});
 text(s,['De lijn daalt:\nbij een hogere P\nis Qᵥ kleiner.','De lijn stijgt:\nbij een hogere P\nis Qₐ groter.','Het punt ligt\nop V én A.\nDezelfde 32 etuis.'][stage],1170,625,365,155,32);
 enotes(s,'97, 101',stage===0?'Plaats (0;18) en (72;0) en verbind ze binnen het domein. Wijs de P-as en Q-as aan.':stage===1?'Voeg (0;2) en (64;18) toe en verbind ze. De assen veranderen niet. De aanbodlijn start bij P=2, waar Q=0.':'Markeer E bij Q=32 en P=10. Trek horizontaal naar P=10 en verticaal naar Q=32. Dit bevestigt beide substituties. Laat de assen aflezen.',stage===2?'Hoe zie je dat E bij beide plannen hoort?':'Waar komt dit lijnpunt vandaan?','Een snijpunt met een as is geen marktevenwicht.',stage===2?'Vergelijk plannen bij een lagere prijs.':'Bouw de grafiek verder op.');
}
{
 const s=slide('Bij € 8 ontstaat een vraagoverschot');text(s,'Pennenetuis: een aanvankelijke prijs onder het evenwicht',60,186,1480,49,33,{bold:true,color:C.blue});graph(s,EX,{price:8});
 text(s,'Qᵥ = 72 − 4 × 8\n     = 40\n\nQₐ = 4 × 8 − 8\n     = 24',1150,268,385,245,32);text(s,'Vraagoverschot\n40 − 24 = 16\netuis per week',1150,608,390,180,36,{bold:true,color:C.orange});
 enotes(s,'99','Alleen de aanvangsprijs is anders. De oranje horizontale afstand is het tekort. Bij dezelfde prijs willen kopers 40 etuis en bieden verkopers 24 aan. Vergelijk hoeveelheden, geen prijzen.','Welke koopplannen kunnen bij €8 niet aansluiten?','Tekort is geen schaarste. Ook in evenwicht zijn middelen schaars.','Bepaal afzonderlijk de verkoop.');
}
{
 const s=slide('Verkoop vraagt een transactieregel');text(s,'Bij € 8: gevraagd 40, aangeboden 24 etuis per week',60,191,1480,67,37,{bold:true});text(s,'Afspraak in dit voorbeeld',60,308,1480,57,36,{bold:true,color:C.blue});text(s,'Alle aangeboden etuis vinden een koper.\nEr is geen andere voorraad. Niets anders belemmert de verkoop.',60,391,1480,155,38);rule(s,60,601,1480);text(s,'Verkoop: 24 etuis per week',60,650,1480,70,48,{bold:true,color:C.green});text(s,'Tekort: 16 etuis per week',60,755,1480,62,39,{bold:true,color:C.orange});
 enotes(s,'99, 102','De 16 ontbrekende etuis zijn geen verkochte etuis. De bronafspraak maakt van de 24 aangeboden etuis 24 transacties. Zonder zo’n regel garanderen de twee plannen de verkoop niet.','Welke etuis worden daadwerkelijk gekocht?','min(Qv,Qa) is hier een gevolg van de afspraak, geen universele verkoopwet.','Verklaar de druk op de prijs.');
}
function pressure(title,up,book=false){const s=slide(title,book?'§1.3.2 Marktevenwicht · Opgave 20 · Boekpagina 106':undefined);
 text(s,book?'Kopers concurreren om het aanbod van 20 bekers.':up?'Meer koopplannen dan verkoopplannen':'Meer verkoopplannen dan koopplannen',60,202,1480,80,43,{bold:true,color:C.orange});
 text(s,book?'De prijs kan stijgen richting € 12 per beker.':up?'De beperkte hoeveelheid geeft opwaartse prijsdruk.':'Het overschot geeft neerwaartse prijsdruk.',60,336,1480,100,42);
 table(s,book?[['Langs dezelfde lijn','Bij € 10','Bij € 12'],['Qᵥ daalt langs V (bekers per week)','50','30'],['Qₐ stijgt langs A (bekers per week)','20','30']]:up?[['Bij prijsstijging van € 8 naar € 10','Eerst','In evenwicht'],['Qᵥ langs V (etuis per week)','40','32'],['Qₐ langs A (etuis per week)','24','32']]:[['Bij prijsdaling van € 12 naar € 10','Eerst','In evenwicht'],['Qᵥ langs V (etuis per week)','24','32'],['Qₐ langs A (etuis per week)','40','32']],60,496,1480,258,[920,280,280],33);
 (book?notes:enotes)(s,book?'106':up?'99, 102':'100',up?'Concurrentie tussen kopers geeft opwaartse druk als de prijs kan aanpassen. Hogere P verlaagt Qv langs V en verhoogt Qa langs A tot beide plannen aansluiten. Aanpassing hoeft niet onmiddellijk te gebeuren.':'Verkopers concurreren om kopers. Bij lagere P groeit Qv en daalt Qa langs dezelfde lijnen. Het vorige geval staat los van dit geval.','Welke actor veroorzaakt prijsdruk en hoe reageren beide kanten?','De lijnen verschuiven niet door de eigen prijs. De overige omstandigheden blijven gelijk.',book?'Controleer alle deelvragen.':up?'Begin een apart geval met een te hoge aanvangsprijs.':'Controleer het verschil tussen tekort en verkoop.');return s;}
pressure('Kopers concurreren bij een tekort',true);
{
 const s=slide('Bij € 12 ontstaat een aanbodoverschot');text(s,'Nieuw geval: dezelfde markt, nu aanvankelijk € 12 per etui',60,188,1480,85,35,{bold:true,color:C.blue});
 table(s,[['Bij € 12','Berekening','Etuis per week'],['Gevraagd','72 − 4 × 12','24'],['Aangeboden','4 × 12 − 8','40'],['Aanbodoverschot','40 − 24','16']],60,320,1480,323,[490,530,460],34);
 text(s,'Alle koopplannen vinden een verkoper, zonder andere beperking.\nVerkoop: 24 etuis per week.',60,705,1480,123,36,{bold:true,color:C.green});
 enotes(s,'100','Reset het scenario: nu is de beginprijs 12. Deelnemers aan de kleinste kant vinden een partner; geen andere voorraden of beperkingen. Aanbod is een plan: alleen als 40 etuis al gemaakt zijn, betekent dit overschot 16 onverkochte etuis in voorraad.','Wie concurreert hier om de andere kant?','Aanbodoverschot betekent niet automatisch geproduceerde voorraad.','Verklaar de prijsdaling.');
}
pressure('Verkopers concurreren om kopers',false);
{
 const s=slide('Korte controle bij het uitlegvoorbeeld');
 ['Bij € 8 zijn Qᵥ = 40 en Qₐ = 24.','“Het tekort is 16, dus er worden 16 etuis verkocht.”','Klopt dit onder onze transactieregel?\nWelke prijsdruk ontstaat?'].forEach((r,i)=>text(s,r,60,220+i*182,1480,155,42,{bold:i===1,color:i===1?C.blue:C.ink}));
 enotes(s,'99, 102','Laat leerlingen eerst zelf een zin formuleren. Bespreek daarna: tekort 16 maar verkoop 24 omdat alle aangeboden etuis een koper vinden. Er is opwaartse prijsdruk. Dit is een korte controle van het uitlegvoorbeeld, geen extra huiswerk.','Welk getal is een verschil en welk getal telt transacties?','Correct het verschil berekenen bewijst niet dat verkoop correct is bepaald.','Keer op het overzicht terug naar start 13 en begin daarna met basis 14–16.');
}
overview('Zelfstandig werken',4);
const tf='§1.3.2 Marktevenwicht · Opgave 20 · Boekpagina 106';
{
 const s=slide('Opgave 20 · Herbruikbare bekers',tf);text(s,'Een markt verkoopt één soort herbruikbare beker. Veel kleine kopers en verkopers kunnen elkaar vinden. De overige omstandigheden blijven gelijk.',60,193,1480,175,38);
 table(s,[['Vraag','Aanbod'],['Qᵥ = 150 − 10P','Qₐ = 5P − 30'],['0 ≤ P ≤ 15','6 ≤ P ≤ 15']],60,435,1480,241,[740,740],38);text(s,'Q is bekers per week; P is euro per beker.',60,750,1480,67,38,{bold:true});
 notes(s,'106','Dit zijn volledige algemene context, functies, domeinen en eenheden van de echte doelopgave 20. De aanvullende transactieregel staat bij d. Toon eerst alle vragen zonder uitwerking.','Welke omstandigheden houdt de bron gelijk?','De etuifuncties gelden hier niet: dit is de bekermarkt uit het boek.','Toon a–c, daarna d–e.');
}
{
 const s=slide('Opgave 20 · Deelvragen a, b en c',tf);text(s,'a. Bereken de evenwichtsprijs. Laat je algebraïsche stappen zien.',60,204,1480,130,39);rule(s,60,365,1480);text(s,'b. Bereken de evenwichtshoeveelheid en controleer die met beide functies. Leg de uitkomst uit in een zin met eenheden.',60,413,1480,150,39);rule(s,60,610,1480);text(s,'c. Teken zelf beide lijnen in één marktgrafiek. Geef de assen, eenheden, schaal, E en hulplijnen naar de evenwichtsprijs en -hoeveelheid aan.',60,659,1480,165,37);
 notes(s,'106','a, b en c zijn volledig getoond zonder antwoorden. Laat leerlingen hun eerdere werk gereedhouden. Nog geen oplossingsstappen: d en e volgen eerst.','Welke onderdelen vraagt c naast de lijnen?','Een tekening zonder eenheden en schalen is onvolledig.','Toon d en e.');
}
{
 const s=slide('Opgave 20 · Deelvragen d en e',tf);text(s,'d. Aan het begin geldt nog een prijs van € 10.\nBereken Qᵥ, Qₐ en het tekort of overschot bij die prijs.\nHoeveel bekers worden verkocht als al het aanbod een koper vindt, er geen andere voorraad is en niets anders de verkoop belemmert?',60,204,1480,286,38);rule(s,60,551,1480);text(s,'e. De prijs kan zich daarna aanpassen. Verklaar de richting van de prijsdruk en de reacties van kopers en verkopers langs de bestaande lijnen.',60,607,1480,201,39);
 notes(s,'106','Alle vijf deelvragen zijn nu beschikbaar. De transactieregel is essentieel voor d. Vraag welke prijs zij bij d invullen: 10, ook als bij a een andere prijs is gevonden.','Wat is gegeven en wat moet je berekenen?','Vervang de beginprijs niet door de evenwichtsprijs.','Bespreek a stapsgewijs.');
}
{
 const s=slide('Opgave 20a · De evenwichtsprijs',tf);text(s,'Evenwicht: Qᵥ = Qₐ',60,190,1480,62,40,{bold:true,color:C.blue});algebra(s,[['150 − 10P = 5P − 30',''],['150 = 15P − 30','+10P aan beide kanten'],['180 = 15P','+30 aan beide kanten'],['P = 12','beide kanten delen door 15']]);text(s,'€ 12 per beker valt binnen beide domeinen.',60,781,1480,50,34,{bold:true});
 notes(s,'106','Begin met de evenwichtsvoorwaarde. Voer iedere bewerking aan beide kanten uit. 12 ligt tussen 6 en 15 en daarmee binnen beide domeinen.','Welke bewerking houdt de gelijkheid intact?','Qv=0 geeft P=15, de vraagasgrens, geen evenwicht.','Vul P=12 in beide functies in.');
}
{
 const s=slide('Opgave 20b · Hoeveelheid en controle',tf);text(s,'Vraag: Qᵥ = 150 − 10 × 12 = 30',60,244,1480,80,45,{bold:true,color:C.blue});text(s,'Aanbod: Qₐ = 5 × 12 − 30 = 30',60,407,1480,80,45,{bold:true,color:C.green});rule(s,60,569,1480);text(s,'Bij € 12 per beker sluiten beide plannen voor\n30 bekers per week op elkaar aan.',60,643,1480,147,43,{bold:true});
 notes(s,'106','Controleer de hoeveelheid uit de vraagfunctie met de aanbodfunctie. Dezelfde 30 bekers worden verkocht en gekocht. Lees de volledige interpretatie hardop.','Waarom is de tweede controle inhoudelijk nuttig?','30 plus 30 zijn geen 60 verkopen.','Bepaal de punten voor de tekening.');
}
{
 const s=slide('Opgave 20c · Punten voor de tekening',tf);table(s,[['Lijn','Berekening','Punt (Q; P)'],['V','Qᵥ = 0: 150 − 10P = 0, dus P = 15\nP = 0: Qᵥ = 150','(0; 15)\n(150; 0)'],['A','Qₐ = 0: 5P − 30 = 0, dus P = 6\nP = 15: Qₐ = 5 × 15 − 30 = 45','(0; 6)\n(45; 15)']],60,219,1480,382,[150,970,360],32);text(s,'Q horizontaal: 0–150, stappen van 30.\nP verticaal: 0–15, stappen van 3.',60,668,1480,141,39,{bold:true,color:C.blue});
 notes(s,'106','Twee geldige punten bepalen iedere rechte lijn. Vraag mag tot P=0, aanbod pas vanaf P=6. A eindigt bij de gegeven P=15 en Q=45. Controleer coördinaten tegen beide functies.','Waarom eindigt A bij (45;15)?','Verleng niet buiten het opgegeven domein.','Plaats eerst V.');
}
for(const stage of [0,1]){
 const s=slide(stage===0?'Opgave 20c · De vraaglijn':'Opgave 20c · Beide lijnen en evenwicht',tf);text(s,'Qᵥ = 150 − 10P                  Qₐ = 5P − 30',60,186,1480,48,34,{bold:true,color:C.blue});graph(s,TG,{supply:stage===1,equilibrium:stage===1});
 text(s,stage===0?'V door\n(0; 15) en\n(150; 0)':'A door\n(0; 6) en\n(45; 15)',1170,284,370,203,35,{bold:true,color:stage===0?C.blue:C.green});text(s,stage===0?'De prijsasgrens\nis € 15.':'E = (30; 12)\n\nP = € 12\nQ = 30',1170,573,370,204,35,{bold:true});
 notes(s,'106',stage===0?'Plaats en verbind de berekende punten. De assen hebben de afgesproken eenheden en gelijke stappen. (0;15) is alleen het vraagassnijpunt.':'Voeg A toe, markeer E en teken hulplijnen bij P=12 en Q=30. De tekening bevestigt a en b. Iedere lijn blijft binnen het eigen domein.',stage===0?'Waarom is €15 niet de evenwichtsprijs?':'Welke berekening controleert de tekening?','Evenwicht is het gemeenschappelijke punt van twee plannen.',stage===0?'Voeg A en E toe.':'Ga voor d terug naar de beginprijs €10.');
}
{
 const s=slide('Opgave 20d · De plannen bij € 10',tf);text(s,'Aan het begin: P = € 10 per beker',60,193,1480,62,39,{bold:true});table(s,[['Grootheid','Berekening','Bekers per week'],['Qᵥ','150 − 10 × 10','50'],['Qₐ','5 × 10 − 30','20'],['Vraagoverschot','50 − 20','30']],60,313,1480,350,[460,560,460],35);text(s,'De kopers willen 30 bekers meer dan het aanbod.',60,742,1480,69,40,{bold:true,color:C.orange});
 notes(s,'106','Vul 10 in zoals d vraagt. Vraag 50 is groter dan aanbod 20: vraagoverschot 30 bekers per week. Dit is toevallig dezelfde 30 als de evenwichtshoeveelheid, maar een ander begrip.','Welke prijs gebruik je voor d?','Neem niet P=12 over uit a.','Lees de transactieregel.');
}
{
 const s=slide('Opgave 20d · De werkelijke verkoop',tf);text(s,'De bron geeft drie voorwaarden',60,198,1480,64,39,{bold:true,color:C.blue});text(s,'Al het aanbod vindt een koper.\nEr is geen andere voorraad.\nNiets anders belemmert de verkoop.',60,310,1480,205,42);rule(s,60,580,1480);text(s,'Verkoop: 20 bekers per week',60,639,1480,76,50,{bold:true,color:C.green});text(s,'De ontbrekende 30 bekers worden niet verkocht.',60,764,1480,66,39);
 notes(s,'106','Alle 20 aangeboden bekers vinden een koper door de gegeven afspraak. Tekort 30 meet niet-uitgevoerde koopplannen. Zonder afspraak volgt werkelijke verkoop niet volledig uit de functies.','Welke broninformatie maakt aanbod hier verkoop?','Verkoop is niet het verschil tussen de plannen.','Verklaar hoe de prijsdruk de plannen dichter bij elkaar brengt.');
}
pressure('Opgave 20e · Opwaartse prijsdruk',true,true);
{
 const s=slide('Antwoordcontrole bij opgave 20');const rows=[['a en b','Gelijke plannen, algebra, beide controles en eenheden.'],['c','Zelf getekend: V, A, E, assen, schalen en hulplijnen.'],['d','Vraagoverschot 30; verkoop volgens de afspraak 20.'],['e','Kopers concurreren; Qᵥ daalt en Qₐ stijgt langs de lijnen.']];rows.forEach((a,i)=>{let y=218+i*140;text(s,a[0],60,y,310,65,40,{bold:true,color:C.blue});text(s,a[1],428,y,1100,108,37);});text(s,'Verbeter één ontbrekende stap of onjuiste uitleg in je eigen werk.',60,798,1480,44,31,{bold:true});
 notes(s,'106','Geef inhoudelijke terugkoppeling op de eigen uitwerking. Een eindgetal alleen volstaat niet als de vraag ook een redenering of grafiek vraagt. Dit bewijst geen beheersing van de hele klas.','Welke stap ontbrak in jouw antwoord?','Een overschot en evenwichtshoeveelheid zijn verschillende begrippen, ook als beide hier 30 zijn.','Laat het huiswerk in de agenda zetten.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides,overviewSlides:overviews,tables,charts,sourceCommit:'173aa9a803897965c572df2c4e7f83cdb135eb1c'},null,2));
console.log('Slides:',p.slides.items.length);
const draft=BUILD+'/candidate.pptx';await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/1.3.2 Marktevenwicht – presentatie.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
