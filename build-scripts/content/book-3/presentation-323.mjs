// HOW TO ADAPT: preserve the shared overview and model-driven XY geometry.
// Update the source manifest, teaching example and actual target together.
// Runtime discovery and build commands: docs/workflows/classroom-presentation.md.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('323');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',red:'#B14542',purple:'#7B2D8E',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', title='Winstmaximalisatie bij volkomen concurrentie';
const origin='https://github.com/meijer1973/4veco-lessen/blob/9b8304d5031cafac936a56281e144573a25fbbc9/edities/books34-v3/books/book-3/';
const example={a:.1,b:3,c:90,P:15,cap:90,q:60,maxY:24,step:15};
const target={a:.04,b:4,c:400,P:16,cap:200,q:150,maxY:24,step:50};
const tables=[],charts=[],slides=[],graphs=[],overviews=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const z=s.shapes.add({geometry:'textbox',name:name||str.slice(0,55),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 z.text=str;z.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return z;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,kind='example'){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,t,60,40,1480,91,t.startsWith('Deze les')?40:50,{bold:true});rule(s,60,146,1480);
 const f=kind==='example'?'Uitlegvoorbeeld — niet uit het boek':kind==='target'?'§3.2.3 · Opgave 27 · Boekpagina 77':'§3.2.3 · '+title;
 text(s,f,60,848,1400,32,21,{color:C.muted});text(s,String(p.slides.items.length),1470,848,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:t,kind});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=true){
 const prose=t=>t.replace(/([\p{L}]{2,})(\d+)/gu,'$1 $2').replace(/(\d+)(euro|minuten)/g,'$1 $2');
 explanation=prose(explanation);question=prose(question);pitfall=prose(pitfall);transition=prose(transition);
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3 v3, gedrukte volledige-boekpagina ${page}. ${origin}output/Boek_3_Compleet_v3.pdf\nBrontekst: ${origin}chapters/3.2/3.2.3%20manuscript.md\nAntwoordmodel: ${origin}chapters/3.2/Antwoorden.md\n${authored?'Uitlegvoorbeeld — niet uit het boek. Context en data van Vezelwerk zijn voor deze les gemaakt. De bronpagina onderbouwt de methode, niet deze getallen.':''}`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 values.forEach((r,i)=>{t.rows[i].height=h/values.length;r.forEach((_,j)=>{const c=t.getCell(i,j);c.fill=i===0?C.ink:(i%2?'#FFFFFF':C.pale);c.text.style={typeface:FONT,fontSize:size,color:i===0?'#FFFFFF':C.ink,bold:i===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};});});tables.push(p.slides.items.length);return t;
}
function lines(s,rows,{top=220,gap=145,size=44}={}){rows.forEach((r,i)=>text(s,r,60,top+i*gap,1480,gap-20,size,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink}));}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 27.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.2.3 '+title,'overview');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,38,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'De beste haalbare q onderbouwen.\nWinst berekenen en als\nrechthoek weergeven.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true});
 text(s,'Pagina 73 · Opgaven 20 en 21\n21: verkennen, theorie p. 69–70',972,459,565,95,30,{name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true});
 text(s,'§3.2.3\nBasis: 22, 23 en 24\nZelfstandig: 25 en 26\nDoelopgave: 27\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework'});
 notes(s,'69–77',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start 20–21 op p73. Basis 22 op p73, 23–24 op p74; zelfstandig 25 op p75 en 26 op p76; doel27 op p77. Huiswerk22,23,24,25,26,27 maken en nakijken. Bonus28 en herhaling29–30 zijn extra. Opgave20 haalt TO, GTK, winst en interval-MK op. Opgave21 vraagt een nieuwe keuze-redenering: laat leerlingen de theorie op p69–70 lezen, het verschil MO–MK gebruiken en hun twijfel opschrijven. Geen toets van al beheerste stof. Keer vóór basiswerk terug naar21: laat beide situaties opnieuw verklaren na de uitleg. Zo nodig extra begeleiding vóór22. Docenteninformatie adviseert voorlopig twee lessen van55 minuten, zonder gemeten tijdsfit. Plan een passende pauze na basiswerk; laat het huiswerk de route afronden.`, 'Welke stap kun je al, en bij welke stap gebruik je de theorie?', 'Het hoofdstukpaginanummer21 is complete-boekpagina73. Opgave21 is verkenning.', active===7?'Laat het volledige huiswerk in de agenda zetten.':'Volg de volgende lesfase; houd tijd voor begeleide inoefening.',false);
 return s;
}
function series(name,xs,ys,color,{label,idx=xs.length-1,pos='top',width=4,dash=false}={}){
 // Ten decimal places preserve sub-pixel geometry and Excel's numeric precision.
 const portable=v=>Number(v.toFixed(10));
 return {name,xValues:xs.map(portable),values:ys.map(portable),line:{fill:color,width,...(dash?{style:'dashed'}:{})},marker:{symbol:'none'},...(label?{dataLabelOverrides:[{idx,text:label,position:pos,showValue:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}]}:{})};
}
function graph(s,m,{mk=true,gtk=false,chosen=false,profit=false,capLine=null}={}){
 const ss=[],A=m.a,B=m.b,K=m.c,q=m.q,g=A*q+B+K/q;
 if(profit){
  // Editable hatching inside the exact economic rectangle, in chart coordinates.
  for(let x=0;x<q;x+=q/18){let xe=Math.min(q,x+q/12);ss.push(series('winstarcering',[x,xe],[g,m.P], '#C9DDD5',{width:1.5}));}
  ss.push(series('winstrechthoek',[0,q,q,0,0],[g,g,m.P,m.P,g],C.green,{width:3}));
 }
 ss.push(series('P = GO = MO',[0,m.cap*(gtk?.50:.18),m.cap],[m.P,m.P,m.P],C.blue,{label:'P = GO = MO',idx:1}));
 if(mk)ss.push(series('MK',[0,m.cap*.82,m.cap],[B,2*A*m.cap*.82+B,2*A*m.cap+B],C.orange,{label:'MK',idx:1}));
 if(gtk){
  // Start exactly at top boundary; GTK is undefined at q=0.
  const lo=((m.maxY-B)-Math.sqrt((m.maxY-B)**2-4*A*K))/(2*A);
  const xs=[...new Set([lo,...Array.from({length:141},(_,i)=>lo+(m.cap-lo)*i/140),q,Math.sqrt(K/A)])].sort((a,b)=>a-b);
  const labelIdx=xs.findIndex(x=>x>=m.cap*.9);
  ss.push(series('GTK',xs,xs.map(x=>A*x+B+K/x),C.red,{label:'GTK',idx:labelIdx,pos:'bottom'}));
 }
 if(chosen){
  ss.push(series('gekozen q',[q,q],[0,m.P],C.muted,{dash:true,width:2}));
  ss.push(series('q-label',[q],[1.5],C.muted,{width:0,label:'q = '+q,idx:0,pos:'left'}));
 }
 if(capLine!==null)ss.push(series('capaciteit',[capLine,capLine],[0,m.maxY],C.muted,{dash:true,width:2,label:'capaciteit '+capLine,idx:1,pos:'left'}));
 const chart=s.charts.add('scatter',{position:{left:60,top:235,width:1050,height:566},series:ss,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{min:0,max:m.cap,majorUnit:m.step,numberFormatCode:'0',title:{text:'q (kg per week)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:m.maxY,majorUnit:4,numberFormatCode:'0',title:{text:'Kosten en opbrengsten (€ per kg)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(chart,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,options:{mk,gtk,chosen,profit,capLine},series:ss});
}
function side(s,heading,body,conclusion=''){text(s,heading,1160,242,380,95,34,{bold:true,color:C.blue});text(s,body,1160,370,380,260,34);if(conclusion)text(s,conclusion,1160,690,380,138,32,{bold:true,color:C.green});}

overview('Startopdracht',2);
{
 const s=slide('Vezelwerk: één prijsnemende onderneming');
 text(s,'Standaardkwaliteit vezelvlokken, verkocht per kg',60,190,1480,60,36,{bold:true,color:C.blue});
 table(s,[['Gegeven','Voor deze week'],['Prijs','P = € 15 per kg'],['Totale kosten','TK = 0,10q² + 3q + 90'],['Hoeveelheid en capaciteit','q in kg per week, maximaal 90 kg'],['Constante kosten','€ 90, ook bij q = 0']],60,285,1480,402,[610,870]);
 text(s,'Elke geproduceerde kg wordt verkocht. Kilogrammen zijn deelbaar.',60,747,1480,70,34,{bold:true});
 notes(s,'69–72','Nieuw uitlegvoorbeeld. Vezelwerk is klein en neemt de marktprijs over. TO=15q en MO=15. Alle kosten zijn per week. De90 euro blijft ook bij nul productie verschuldigd. Herhaal voor start20: GTK=TK/q bij q>0, winst=TO−TK. De vraag is nu welke q de grootste haalbare winst geeft.','Welke opbrengst geeft een kleine uitbreiding?','De marktprijs blijft gelijk bij de keuze van één kleine producent.','Haal eerst de bekende afgeleide op.');
}
{
 const s=slide('Opfrissen: van TK naar MK');
 text(s,'TK = 0,10q² + 3q + 90',60,191,1480,70,43,{bold:true});
 table(s,[['Term in TK','Afgeleide'],['0,10q²','2 × 0,10q = 0,20q'],['3q','3'],['90','0']],60,300,1480,340,[740,740],36);
 text(s,'MK = 0,20q + 3   (€ per kg)',60,713,1480,77,46,{bold:true,color:C.orange});
 notes(s,'62–64; methode toegepast op69–72','§3.2.2 leert term voor term afleiden. Tabelstap: ΔTK/Δq meet gemiddelde extra kosten over een interval. De afgeleide meet de puntwaarde voor een zeer kleine uitbreiding. De90 verdwijnt alleen uit MK, niet uit TK of de winst.','Welke term verandert niet als q toeneemt?','MK is euro per kg, TK euro per week. MK is geen exact verschil voor elke hele extra kg.','Vergelijk deze extra kosten met de vaste opbrengst per kg.');
}
{
 const s=slide('De opbrengst van extra productie');graph(s,example,{mk:false});side(s,'Prijsnemer','P = GO = MO\n= € 15 per kg','Dezelfde prijs bij elke haalbare q.');
 notes(s,'56,69–70','Lees de assen. Het gaat om één onderneming, met kleine q. De verticale as toont bedragen per kg. Elke kleine uitbreiding levert per kg15 euro op. Toon eerst alleen MO, zodat de kostenvergelijking de volgende stap is.','Waarom is deze lijn horizontaal?','Dit is niet de vraaglijn van de hele markt.','Voeg MK toe op exact dezelfde assen.');
}
{
 const s=slide('Meer produceren: wat gebeurt er met de winst?');graph(s,example);side(s,'Links en rechts','Bij q = 45:\nMK = 12 < MO\n\nBij q = 75:\nMK = 18 > MO','Eerst stijgt de winst, daarna daalt zij.');
 notes(s,'69–70','Bij45 kost een kleine uitbreiding12 euro per kg en levert15 op. Winst neemt toe. Bij75 kost extra productie18 en levert15 op. Minder produceren bespaart dan meer dan aan opbrengst vervalt. MK stijgt overal in dit model. Dit is precies de nieuwe redenering die start21 verkent.','Waarom helpt minder produceren rechts van het snijpunt?','Een positieve totale winst bewijst niet dat verdere uitbreiding gunstig is.','Bereken het snijpunt en toets de haalbaarheid.');
}
{
 const s=slide('De beste haalbare productie');
 lines(s,['MO = MK:  15 = 0,20q + 3','12 = 0,20q','q = 60 kg per week'],{top:215,gap:130,size:48});
 text(s,'MK stijgt door MO heen. 60 ≤ 90, dus de keuze is haalbaar.',60,660,1480,90,40,{bold:true,color:C.green});
 notes(s,'70','Trek3 aan beide kanten af en deel door0,20. De vergelijking geeft een kandidaat. De vorige grafiek bevestigt een maximum: MO−MK wisselt van positief naar negatief.60 ligt binnen90. Vergelijk straks ook met nul productie.','Welke controles maken van de kandidaat een bruikbaar advies?','MO=MK is geen los bewijs en hoeft bij een grensmaximum niet te gelden.','Bereken de totale winst bij dezezelfde q.');
}
{
 const s=slide('Totale winst bij q = 60');
 lines(s,['TO = 15 × 60 = € 900 per week','TK = 0,10 × 60² + 3 × 60 + 90\n      = 360 + 180 + 90 = € 630 per week','Winst = 900 − 630 = € 270 per week'],{top:205,gap:180,size:42});
 text(s,'Bij q = 0: winst = 0 − 90 = −€ 90 per week. € 270 is hoger.',60,750,1480,70,34,{bold:true,color:C.green});
 notes(s,'71–72','Bereken eerst60²=3600. Pas daarna maal0,10. De constante kosten90 tellen mee. Bij q=0 is TO0 en TK90: winst−90.270>−90, dus produceren is beter.','Welke kosten blijven na het differentiëren in TK staan?','Het snijpunt levert de hoeveelheid, niet het totale winstbedrag.','Verdeel de totale kosten over de gekozen hoeveelheid.');
}
{
 const s=slide('GTK bij de gekozen productie');graph(s,example,{gtk:true,chosen:true});side(s,'Bij q = 60','GTK = 630 / 60\n= € 10,50 per kg\n\nP − GTK =\n15 − 10,50\n= € 4,50 per kg');
 notes(s,'71','Voeg GTK toe nadat q is gekozen. De GTK-curve volgt0,10q+3+90/q en is alleen bij q>0 gedefinieerd. Wijs GTK bij60 aan. Het minimum ligt bij30, maar daar is MO nog groter dan MK. Dat minimum kiest dus niet de winstmaximale q.','Bij welke q moet je GTK aflezen?','Gebruik niet automatisch het laagste punt van GTK.','Maak van winst per kg de totale weekwinst.');
}
{
 const s=slide('Winst als rechthoek');graph(s,example,{gtk:true,chosen:true,profit:true});side(s,'Winstoppervlakte','Breedte: 60 kg/week\n\nHoogte:\n€ 4,50 per kg','60 × 4,50 =\n€ 270 per week');
 notes(s,'71','De arcering loopt horizontaal van0 tot60 en verticaal van10,50 tot15. Hoogte=prijs min GTK bij60. kg/week maal euro/kg wordt euro/week. In Boek2 stonden TO en TK als totalen verticaal: winst was een afstand. Hier staan bedragen per kg verticaal: winst is een oppervlakte. GTK bij q=0 is niet gedefinieerd; de horizontale ondergrens gebruikt GTK(60), niet GTK(0).','Waarom is de hoogte niet15 euro?','De hele omzetrechthoek is groter dan de winstrechthoek.','Bekijk wat een lagere capaciteit met de keuze doet.');
}
{
 const s=slide('Een lagere capaciteit: maximaal 45 kg');graph(s,example,{capLine:45});side(s,'Nieuwe grens','60 is onhaalbaar.\n\nMK(45) =\n0,20 × 45 + 3\n= € 12 per kg','12 < 15:\nkies q = 45.');
 notes(s,'70,72,76','Alleen capaciteit verandert van90 naar45. Voor alle haalbare q blijft MK lager dan MO, dus de winst stijgt tot de grens. Het maximum ligt nu bij45. Nulproductie levert−90; bij45 TO675, TK427,50 en winst247,50. De grafiek toont de oorspronkelijke modelcurve ter vergelijking; rechts van45 is nu onhaalbaar.','Waarom is de capaciteit hier de beste keuze?','Een capaciteitsgrens is niet altijd optimaal: bewijs eerst dat winst tot de grens stijgt.','Herstel capaciteit90 en bekijk een andere soort verandering.');
}
{
 const s=slide('Alleen de constante kosten veranderen');
 text(s,'Weer capaciteit 90 kg en P = € 15 per kg',60,190,1480,65,36,{bold:true,color:C.blue});
 table(s,[['','Eerst','Hogere constante kosten'],['TK','0,10q² + 3q + 90','0,10q² + 3q + 150'],['MK','0,20q + 3','0,20q + 3'],['Beste q','60 kg per week','60 kg per week'],['Winst bij q = 60','€ 270 per week','€ 210 per week']],60,300,1480,380,[350,515,615],32);
 text(s,'De € 60 extra kosten verlagen de winst, maar veranderen MK niet.',60,745,1480,78,38,{bold:true,color:C.green});
 notes(s,'63–64,70–72','Scenario reset: oorspronkelijke capaciteit90 en P15. Alleen c stijgt90 naar150. De marginale vergelijking verandert niet. Bij60 is TO900 en TK690, winst210. Ook deze constante kosten zijn deze week onvermijdbaar. Vergelijk met q0:−150, dus60 blijft beter.','Waarom blijft q gelijk terwijl winst daalt?','Hogere totale kosten betekenen niet automatisch hogere marginale kosten. Deze conclusie geldt voor deze week en aannames.','Herstel de oorspronkelijke kosten en verander alleen de prijs.');
}
{
 const s=slide('Alleen de marktprijs stijgt');
 text(s,'Weer TK = 0,10q² + 3q + 90 en capaciteit 90 kg',60,190,1480,70,36,{bold:true,color:C.blue});
 lines(s,['Nieuwe prijs: MO = P = € 17 per kg','17 = 0,20q + 3   ⇒   q = 70 kg per week','70 ≤ 90. MK stijgt door de nieuwe MO heen.'],{top:320,gap:155,size:42});
 notes(s,'70–72; toepassing ter voorbereiding op24','Alleen P verandert naar17. De kostenfunctie en MK blijven hetzelfde. Bij q60 is MK15, nu lager dan MO17, zodat uitbreiden nog winst toevoegt. Vergelijk links/rechts70: MK(65)=16 en MK(75)=18. Capaciteit90 is ruim genoeg. Als daarnaast alleen de onvermijdbare constante kosten veranderen, blijft deze marginale q70.','Waarom leidt deze verandering wel tot een andere q?','De marktprijs is gegeven, de onderneming verhoogt haar eigen prijs niet zelfstandig.','Laat leerlingen kort de juiste werkwijze verwoorden.');
}
{
 const s=slide('Controle van je aanpak','lesson');
 text(s,'“De laagste GTK geeft altijd de hoogste totale winst.”',60,226,1480,150,48,{bold:true,color:C.blue});
 text(s,'Klopt dit? Gebruik MO en MK in je verklaring.',60,440,1480,100,42);
 text(s,'Welke controles horen nog bij een productieadvies?',60,650,1480,90,40);
 notes(s,'70–72','Laat leerlingen eerst zelf antwoorden. Onjuist: eerst q kiezen via de marginale vergelijking en haalbaarheid, daarna GTK bij die q voor het winstbedrag. In Vezelwerk ligt minimum GTK bij30, daar MK9<MO15. Bij60 ligt de grootste winst. Noem capaciteit, beide kanten van het snijpunt en vergelijking met nulproductie. Laat daarna start21 opnieuw verklaren zonder het te behandelen als eerdere beheersing.','Waarom kun je de beste q niet alleen uit GTK aflezen?','Een mooi winstbedrag is geen bewijs van een maximum.','Keer terug naar de overzichtsdia en begeleid eerst22–24.',false);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 27 · Korrels voor kwekerijen','target');
 text(s,'Een prijsnemende producent verkoopt één standaardkwaliteit korrels.',60,189,1480,106,40,{bold:true});
 table(s,[['Gegeven','Waarde'],['Prijs','P = € 16 per kg'],['Totale kosten','TK = 0,04q² + 4q + 400'],['Eenheden','q: kg per week; TK: euro per week'],['Productiecapaciteit','200 kg per week'],['Constante kosten','De € 400 is deze week onvermijdbaar.']],60,330,1480,435,[530,950],34);
 notes(s,'77','Start de bespreking na de eigen poging. Dit zijn de volledige oorspronkelijke context en gegevens. De volgende dia toont de gegeven grafiek en daarna volgen alle vragen zonder antwoorden.','Welke gegevens gaan over één kg en welke over een hele week?','De400 is ook verschuldigd bij niet produceren.','Toon de oningevulde ondernemingsgrafiek.',false);
}
{
 const s=slide('Opgave 27 · De gegeven grafiek','target');graph(s,target,{gtk:true});side(s,'Eén onderneming','Alle verticale bedragen zijn per kg.\n\nDe horizontale as geeft productie per week.');
 notes(s,'77','Native reconstructie van figuur8 in de bron, dezelfde functies, domein0–200 en y-as0–24. Nog geen gekozen hoeveelheid, q-markering of winstvlak onthullen. De lijnen bevatten dezelfde informatie als de gegeven figuur.','Waar zou je straks een gekozen q markeren?','Lees de eenheid eerst, geef nog geen uitkomst weg.','Toon eerst alle zes deelvragen.',false);
}
{
 const s=slide('Opgave 27 · Deelvragen a, b en c','target');
 lines(s,['a. (2p) Stel de functie voor MK op.','b. (3p) Bepaal de winstmaximale haalbare q.\nOnderbouw het maximum met MK links en rechts van je uitkomst.','c. (3p) Bereken TO, TK en totale winst bij de gekozen q.'],{top:205,gap:205,size:38});
 notes(s,'77','Lees de daadwerkelijke vragen. Geef hier geen oplossingsstappen of eindgetallen. Bij b horen keuze, haalbaarheid en onderbouwing links/rechts.','Welke bewijslast zit in het woord onderbouw?','Alleen MO=MK opschrijven beantwoordt b niet volledig.','Toon ook d, e en f voordat de bespreking begint.',false);
}
{
 const s=slide('Opgave 27 · Deelvragen d, e en f','target');
 lines(s,['d. (3p) Bereken GTK en geef in de grafiek q en de\nwinstrechthoek aan. Benoem breedte en hoogte.','e. (1p) Vergelijk de winst met niet produceren (q = 0).','f. (2p) Door een storing wordt de capaciteit 120 kg.\nKostenfunctie en prijs blijven gelijk. Welke q kies je nu?\nLicht toe; een nieuwe winstberekening is niet nodig.'],{top:198,gap:199,size:37});
 notes(s,'77','Hiermee zijn alle zes oorspronkelijke deelvragen beschikbaar. Wacht met oplossingen tot leerlingen hun poging erbij hebben. Deelvraag f vraagt geen nieuwe winstberekening.','Wat verandert er in f, en wat blijft gelijk?','De storing verandert alleen de grens, niet de kostenfunctie.','Begin nu de uitwerking met MK.',false);
}
{
 const s=slide('Opgave 27a · Marginale kosten','target');
 text(s,'TK = 0,04q² + 4q + 400',60,190,1480,75,45,{bold:true});
 table(s,[['Term','Bijdrage aan MK'],['0,04q²','2 × 0,04q = 0,08q'],['4q','4'],['400','0']],60,310,1480,320,[740,740],37);
 text(s,'MK = 0,08q + 4   (€ per kg)',60,718,1480,76,48,{bold:true,color:C.orange});
 notes(s,'77','Volledig antwoord a: differentieer elke term. De afgeleide geeft de kostenstijging per extra kg in het doorlopende model. De400 blijft in TK.','Waarom staat400 niet in MK?','Constante kosten verdwijnen niet uit de totale winstberekening.','Gebruik MO16 om de kandidaat te vinden.',false);
}
{
 const s=slide('Opgave 27b · De kandidaat en de capaciteit','target');
 lines(s,['MO = P = 16   en   MK = 0,08q + 4','16 = 0,08q + 4   ⇒   12 = 0,08q','q = 12 / 0,08 = 150 kg per week','150 ≤ 200: de productie is haalbaar.'],{top:202,gap:147,size:43});
 notes(s,'77','Los stap voor stap op en geef de eenheid. Capaciteitscontrole150≤200. Dit is nog niet de volledige onderbouwing: bekijk de MK-waarden links en rechts op de volgende dia.','Waarom is de vergelijking alleen nog niet voldoende?','Een onhaalbaar snijpunt mag geen productieadvies worden.','Controleer de verandering van winst aan beide kanten.',false);
}
{
 const s=slide('Opgave 27b · Waarom is dit een maximum?','target');graph(s,target,{chosen:true});side(s,'MK stijgt','q = 125:\nMK = 14 < 16\n\nq = 175:\nMK = 18 > 16','Winst stijgt vóór 150 en daalt erna.');
 notes(s,'77','MK(125)=0,08×125+4=14; MK(175)=18. MK stijgt door MO heen. Links levert kleine uitbreiding meer op dan zij kost. Rechts verlaagt verdere uitbreiding de winst. Samen met de capaciteit onderbouwt dit de keuze150.','Wat betekent MO>MK voor de verandering van winst?','Het snijpunt is geen winstbedrag en geen minimum van GTK.','Bereken de totalen bij150.',false);
}
{
 const s=slide('Opgave 27c · Opbrengst, kosten en winst','target');
 lines(s,['TO = 16 × 150 = € 2.400 per week','TK = 0,04 × 150² + 4 × 150 + 400\n      = 900 + 600 + 400 = € 1.900 per week','Winst = 2.400 − 1.900 = € 500 per week'],{top:205,gap:184,size:41});
 notes(s,'77','Eerst150²=22500; maal0,04=900. Dan600 en400 optellen. Geen kosten vergeten. TO en TK horen bij dezelfde productie en periode.','Waarom moet de400 erbij, terwijl die niet in MK stond?','0,04×150² is niet (0,04×150)².','Bereken GTK bij dezelfde150.',false);
}
{
 const s=slide('Opgave 27d · GTK en winst per kg','target');
 lines(s,['GTK = TK / q = 1.900 / 150\n        = € 12,666… per kg ≈ € 12,67 per kg','P − GTK = 16 − 1.900 / 150\n                = € 3,333… per kg','Reken verder met de ongeronde breuk.'],{top:200,gap:202,size:43});
 notes(s,'77','Gebruik1900/150 exact. Winst per kg=10/3. Afgerond GTK12,67 mag voor rapportage, maar500 krijg je exact via ongeronde waarden of TO−TK.','Welke waarde gebruik je voor de onderkant van de winstrechthoek?','GTK bij het minimum van de curve is niet GTK bij150.','Markeer150 en arceer de rechthoek.',false);
}
{
 const s=slide('Opgave 27d · De winstrechthoek','target');graph(s,target,{gtk:true,chosen:true,profit:true});side(s,'Winst = € 500','Breedte:\n150 kg per week\n\nHoogte:\n€ 3,333… per kg','150 × (16 −\n1.900 / 150) = 500');
 notes(s,'77','Volledige grafische beantwoording d. Markering op150. Arcering van0 tot150 en van1900/150 tot16. GTK bij150 bepaalt de ondergrens. Oppervlakte500 euro/week. De breedte is hoeveelheid per week; de hoogte winst per kg.','Waarom loopt de arcering niet vanaf nul euro?','Opbrengst is niet hetzelfde als winst.','Vergelijk vervolgens met niet produceren.',false);
}
{
 const s=slide('Opgave 27e · Niet produceren','target');
 table(s,[['Keuze','TO per week','TK per week','Winst per week'],['q = 0','€ 0','€ 400','−€ 400'],['q = 150','€ 2.400','€ 1.900','€ 500']],60,251,1480,295,[400,360,360,360],34);
 text(s,'€ 500 > −€ 400: produceren is deze week gunstiger.',60,641,1480,111,44,{bold:true,color:C.green});
 notes(s,'77','Bij0 is TO0; TK400 omdat deze kosten deze week onvermijdbaar zijn. Winst−400. De keuze150 is900 euro gunstiger, maar de winst zelf is500. Beperk het oordeel tot deze week.','Welke kosten verdwijnen wel en welke blijven bij q=0?','Niet produceren betekent hier niet dat alle kosten nul worden.','Verander nu alleen de capaciteit.',false);
}
{
 const s=slide('Opgave 27f · Een storing beperkt de productie','target');graph(s,target,{capLine:120});side(s,'Maximaal 120 kg','150 is onhaalbaar.\n\nMK(120) =\n0,08 × 120 + 4\n= € 13,60 per kg','13,60 < 16:\nkies q = 120.');
 notes(s,'77','Kosten en prijs blijven gelijk. Tot120 blijft MO16 boven de stijgende MK. De winst stijgt op het hele haalbare domein en bereikt het maximum bij120. Het onhaalbare snijpunt150 blijft alleen als vergelijking in beeld. Geen nieuwe winstberekening vereist.','Waarom kies je120 hoewel MO daar niet gelijk is aan MK?','Een maximum kan op een grens liggen. MO=MK is geen noodzakelijke voorwaarde voor een grensmaximum.','Laat leerlingen ontbrekende redeneringen verbeteren en zet het huiswerk in de agenda.',false);
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviews,tables,charts,graphs},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.2.3 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,integrity:result.packageIntegrity.status,layout:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
