// HOW TO ADAPT: change the paragraph manifest, teaching model and slide content together.
// Runtime paths come from the installed Presentations skill; never add personal paths here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation, PresentationFile, finalizePresentation, applyPresentationChartFont,
  PYTHON, SKILL, TOOLS, workspace} from '../../presentations/runtime.mjs';

const {root:ROOT,build:BUILD,final:FINAL}=await workspace('323');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',grey:'#6B7C88'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[];
const noteTexts=new WeakMap();
const lessonCommit='9b8304d5031cafac936a56281e144573a25fbbc9';
const edition='edities/books34-v3/books/book-3';
const source=`https://github.com/meijer1973/4veco-lessen/blob/${lessonCommit}/${encodeURI(edition)}/`;
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q = s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,footer='§3.2.3 Winstmaximalisatie bij volkomen concurrentie'){
 const s=p.slides.add();s.background.fill='#FFFFFF';
 text(s,title,60,42,1480,74,title.startsWith('Deze les')?39:49,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,850,1390,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,846,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,pages,explanation,question,pitfall,transition,{example=false,target=false}={}){
 const content=`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 3, geselecteerde v3-editie, gedrukte boekpagina ${pages}. ${source}output/Boek_3_Compleet_v3.pdf\n${target?`Antwoordmodel: ${source}chapters/3.2/Antwoorden.md, opgave 27.\n`:''}${example?'Uitlegvoorbeeld — niet uit het boek. Context, kosten en marktvergelijkingen zijn voor deze les bedacht; de genoemde boekpagina’s onderbouwen alleen de methode.':''}`;
 noteTexts.set(s,content);s.speakerNotes.textFrame.setText(content);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?'#FFFFFF':C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:14,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.','Uitleg bij de lesdoelen.',
 'Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 27.','Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.2.3 Winstmaximalisatie bij volkomen concurrentie');

 overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:`route-number-${i+1}`});text(s,r,116,ys[i],791,hs[i],30,{bold:active===i+1,color:col,name:`route-${i+1}`});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Haalbare productie kiezen,\nwinst berekenen en de\nwinstrechthoek tekenen.',972,244,565,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,400,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 73 · Opgaven 20 en 21\n21: verkennen met theorie p. 70',972,456,565,100,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.2.3 Winstmaximalisatie\nBasis: 22, 23 en 24\nZelfstandig: 25 en 26\nDoelopgave: 27\nMaken en nakijken',972,650,565,184,30,{bold:active===7,name:'overview-homework'});
 notes(s,'69–77',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start20–21 op p73; basis22 op p73 en23–24 op p74; zelfstandig25 op p75 en26 op p76; doel27 op p77. Huiswerk22,23,24,25,26,27 maken en nakijken. Bonus28 en herhaling29–30 extra. Reserveer volgens de docenthandleiding voorlopig twee lessen, met flexibele grens; geen bewezen lesduur. Alle drie basisopgaven blijven in de normale route.\n\nStart20 haalt TO=Pq,GTK=TK/q en TO−TK op. Voor20b geldt de eindige tabelstap ΔTK/Δq uit §3.2.2, p62–64. Start21 vraagt de NIEUWE economische keuze met MO en MK. Laat p70 lezen, de twee richtingen aanwijzen en de eerste redenering proberen. Dit is ondersteunde verkenning. Keer vóór basiswerk terug naar21 en laat de redenering na de uitleg verbeteren. Differentieer waar nodig pas met hulp uit p63.`,active===2?'Welke vergelijking lukt al en waarvoor heb je p. 70 nodig?':'Welke stap moet je nog verbeteren?','Een afgeleide kunnen bepalen betekent niet dat de economische maximumregel al is geleerd.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga naar de volgende lesfase.');
}
function exampleLabel(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,181,1480,45,30,{bold:true,color:C.blue});}
function linesSlide(title,rows,{pages='69–72',example=true,target=false,question='Welke stap onderbouwt je antwoord?',pitfall='Let op de grootheid en eenheid.',transition='Ga naar de volgende stap.'}={}){
 const s=slide(title,target?'§3.2.3 · Opgave 27 · Boekpagina 77':undefined);if(example)exampleLabel(s);
 rows.forEach((t,i)=>text(s,t,60,(example?281:205)+i*(example?140:165),1480,120,39,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink}));
 notes(s,pages,rows.join(' ')+' Benoem de eenheden en vraag naar de reden achter elke stap.',question,pitfall,transition,{example,target});return s;
}
function series(name,x,fn,color,labelIdx=1){return {name,xValues:x.map(v=>+v.toFixed(10)),values:x.map(fn).map(v=>+v.toFixed(10)),line:{fill:color,width:3.3},marker:{symbol:'none'},dataLabelOverrides:[{idx:labelIdx,text:name,showValue:false,showSeriesName:false,showCategoryName:false,textStyle:{typeface:FONT,fontSize:28,bold:true,fill:color}}]};}
function guide(q,y){return {name:'Afleeshulp',xValues:[q,q],values:[0,y],line:{fill:C.grey,width:1.5,style:'dashed'},marker:{symbol:'none'}};}
const own={a:.04,b:2,c:100,P:8,q:75,cap:100,ymax:16};
const target={a:.04,b:4,c:400,P:16,q:150,cap:200,ymax:24};
const chartBox={x:70,y:260,w:1030,h:535};
const plot={x:173,y:286.75,w:875.5,h:422.65};
function firmChart(title,m,{gtk=false,mark=false,rectangle=false,targetQ=false,capacity=null,side=[]}={}){
 const s=slide(title,targetQ?'§3.2.3 · Opgave 27 · Boekpagina 77':'§3.2.3 · Uitlegvoorbeeld — niet uit het boek');
 text(s,'P, GO, MO, MK'+(gtk?' en GTK':'')+' (€ per kg)',80,195,1020,47,31,{bold:true,color:C.blue});
 const priceLabelFraction=capacity===null?.55:.40;
 let data=[series('MK',[0,m.cap*.83,m.cap],q=>2*m.a*q+m.b,C.green),series('P = GO = MO',[0,m.cap*priceLabelFraction,m.cap],()=>m.P,C.blue)];
 if(gtk){const xs=[];for(let q = .5;q<=m.cap;q+=.5)if(m.a*q+m.b+m.c/q<=m.ymax)xs.push(q);data.push(series('GTK',xs,q=>m.a*q+m.b+m.c/q,C.orange,Math.floor(xs.length*.83)));}
 if(mark)data.unshift(guide(m.q,m.P));
 if(capacity!==null)data.unshift({name:'Capaciteit',xValues:[capacity,capacity],values:[0,m.ymax],line:{fill:C.orange,width:2,style:'dashed'},marker:{symbol:'none'}});
 const ch=s.charts.add('scatter',{position:{left:chartBox.x,top:chartBox.y,width:chartBox.w,height:chartBox.h},series:data,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false,showCategoryName:false,showPercent:false,textStyle:{typeface:FONT,fontSize:27}},
 xAxis:{min:0,max:m.cap,majorUnit:m.cap/4,numberFormatCode:'0',title:{text:'q (kg per week)',textStyle:{typeface:FONT,fontSize:28,fill:C.ink}},textStyle:{typeface:FONT,fontSize:27,fill:C.ink},line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:m.ymax,majorUnit:4,numberFormatCode:'0',textStyle:{typeface:FONT,fontSize:27,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 if(rectangle){
  const avg=(m.a*m.q*m.q+m.b*m.q+m.c)/m.q;
  const x=plot.x,y=plot.y+plot.h*(1-m.P/m.ymax),w=plot.w*m.q/m.cap,h=plot.h*(m.P-avg)/m.ymax;
  s.shapes.add({name:'Winstrechthoek',geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:C.green,width:2.3}});
  // Native hatching, clipped mathematically inside the profit rectangle.
  for(let d=-h+12;d<w;d+=18){const x0=Math.max(0,d),y0=Math.max(0,-d),x1=Math.min(w,d+h),y1=Math.min(h,w-d);s.shapes.add({name:'Winstarcering',geometry:'line',position:{left:x+x0,top:y+y0,width:x1-x0,height:y1-y0},line:{fill:C.green,width:1}});}
 }
 side.forEach((t,i)=>text(s,t,1140,290+i*147,390,125,32,{bold:i===0,color:i===0?C.blue:C.ink}));
 notes(s,targetQ?'77':'70–72',`Grafiek van ${targetQ?'de echte doelopgave':'het afzonderlijke uitlegvoorbeeld'}. P=${m.P}; MK = ${2*m.a}q+${m.b}; capaciteit${m.cap}. ${mark?'De afleeslijn markeert q = '+m.q+'.':''} ${gtk?'GTK = TK/q; lees de hoogte bij DEZELFDE gekozen q.':''} ${rectangle?'De bewerkbare arcering ligt tussen GTK(q*) en P, over de breedte q*. Eenheid: (kg/week) × (€/kg) = €/week. De schaal en grafiek zijn exact dezelfde als zonder arcering.':''} ${capacity!==null?'De nieuwe grens is '+capacity+' kg/week. De oorspronkelijke kostenlijn is alleen referentie buiten die grens; productie rechts van de grens is nu onhaalbaar.':''} ${side.join(' ')}`,'Welke hoogte en breedte horen bij deze productie?','Het snijpunt van MO en MK is een bedrag per kg; het is niet de totale winst.','Gebruik de figuur om de berekening te verklaren.',{example:!targetQ,target:targetQ});return s;
}

overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Productie kiezen','Je vergelijkt MO en MK, links én rechts van de kandidaat.'],['Haalbaarheid controleren','Je controleert capaciteit en de relevante grens q = 0.'],['Winst berekenen','Je berekent TO, TK en GTK bij dezelfde gekozen q.'],['Winst tekenen','Je geeft breedte, hoogte en eenheid van de rechthoek.']];
 rows.forEach((a,i)=>{let y=209+i*149;text(s,a[0],60,y,565,90,37,{bold:true,color:C.blue});text(s,a[1],690,y,850,112,35);if(i<3)rule(s,60,y+123,1480);});
 notes(s,'69–72','De afgeleide is voorkennis uit §3.2.2. Nieuw is de economische keuze en de winstvoorstelling. Laat leerlingen de werkwijze verbinden aan doelopgave27.','Waarom is alleen een snijpunt vinden onvoldoende?','De capaciteit kan de kandidaat onhaalbaar maken.','Introduceer een afzonderlijk uitlegvoorbeeld.');
}
{
 const s=slide('Havervlokken: productie voor één week');exampleLabel(s);
 text(s,'P = € 8 per kg     TK = 0,04q² + 2q + 100',60,277,1480,90,46,{bold:true});
 table(s,[['Gegeven','Betekenis'],['Prijsnemer','Alle productie wordt verkocht tegen P = € 8.'],['q en capaciteit','Deelbare kg per week; maximaal 100 kg.'],['TK','Euro per week.'],['Constante kosten','€ 100 is deze week ook bij q = 0 onvermijdbaar.']],60,405,1480,348,[445,1035],33);
 notes(s,'69–72','Eigen context en data, niet uit een toegewezen opgave. Dit voorbeeld introduceert alle handelingen die later in27 nodig zijn. De volledige normale oefenroute blijft zelfstandig te maken.','Welke keuze heeft een prijsnemende onderneming nog?','P is per kg; TK is per week.','Haal de afgeleide kort terug.',{example:true});
}
linesSlide('De afgeleide kort terughalen',['TK = 0,04q² + 2q + 100','MK = 0,08q + 2     (€ per kg)','De constante € 100 verdwijnt uit MK, maar blijft in TK.'],{pages:'62–64',pitfall:'Gebruik voor start20b de gemiddelde tabelstap; hier gebruik je de afgeleide op een punt.',transition:'Gebruik MK nu voor een nieuwe economische keuze.'});
{
 const s=slide('Meer productie: wat doet dat met de winst?');exampleLabel(s);
 table(s,[['q (kg/week)','MO (€/kg)','MK (€/kg)','Kleine uitbreiding'],['50','8','6','Verhoogt de winst'],['75','8','8','Omslagpunt'],['90','8','9,20','Verlaagt de winst']],60,292,1480,327,[345,255,255,625],34);
 text(s,'MO > MK: uitbreiden is gunstig. MO < MK: minder produceren is gunstig.',60,690,1480,135,39,{bold:true,color:C.blue});
 notes(s,'69–70','MK(50)=6; MK(75)=8; MK(90)=9,20. Het gaat om een heel kleine verandering, niet een exact kostbedrag voor één hele extra kg. Alle vergelijkingen liggen binnen de capaciteit van 100 kg. Rechts van 75 kg is inkrimpen gunstig.','Waarom kan meer omzet toch samengaan met minder winst?','Hogere TO alleen bewijst geen hogere winst.','Vind de kandidaat met MO = MK en controleer beide kanten.',{example:true});
}
firmChart('De kandidaat en het maximum',own,{mark:true,side:['8 = 0,08q + 2','q = 75 kg/week','MK stijgt door MO.\n75 ≤ 100: haalbaar.']});
linesSlide('Totale winst bij 75 kg',['TO = 8 × 75 = € 600 per week','TK = 0,04 × 75² + 2 × 75 + 100 = € 475 per week','Winst = 600 − 475 = € 125 per week'],{pitfall:'De constante100 blijft in de totale kosten.',transition:'Verdeel TK over dezelfde75 kg.'});
linesSlide('De winst per kg bij dezelfde productie',['GTK = 475 / 75 = € 6,333… per kg','P − GTK = 8 − 6,333… = € 1,666… per kg','Winst = 75 × (8 − 475 / 75) = € 125 per week'],{pages:'71–72',pitfall:'Rond de GTK niet af voordat je vermenigvuldigt. Gebruik zo nodig TO−TK.',transition:'Maak de breedte en hoogte zichtbaar in de grafiek.'});
firmChart('De winstrechthoek',own,{gtk:true,mark:true,rectangle:true,side:['Winst = € 125\nper week','Breedte: 75 kg/week','Hoogte:\n€ 1,666… per kg']});
firmChart('Als de capaciteit maar 60 kg is',own,{capacity:60,side:['75 kg is onhaalbaar.','MK(60) = € 6,80\nMO = € 8 per kg','Winst stijgt tot 60.\nDus q = 60 kg/week.']});
{
 const s=slide('Niet produceren: de kosten blijven deels bestaan');exampleLabel(s);
 table(s,[['Productie','TO (€ per week)','TK (€ per week)','Winst (€ per week)'],['q = 0','0','100','−100'],['q = 75','600','475','125']],60,312,1480,278,[430,350,350,350],33);
 text(s,'Bij de oorspronkelijke capaciteit van 100 kg is 75 kg beter dan 0.',60,664,1480,118,40,{bold:true,color:C.blue});
 notes(s,'70, 72','Scenarioreset: de oorspronkelijke capaciteit 100 geldt weer. De100 euro constante kosten is deze week onvermijdbaar. Geen productie geeft dus verlies100.125 is hoger dan−100. Dit oordeel gaat over deze week.','Waarom is TK bij q = 0 niet nul?','Een verlies betekent niet zonder meer direct stoppen; vergelijk met de relevante grens.','Scheid veranderingen in prijs en constante kosten.',{example:true});
}
{
 const s=slide('Prijs en constante kosten werken verschillend');exampleLabel(s);
 table(s,[['Eén verandering tegelijk','MO en MK','Beste q bij capaciteit 100'],['Alleen P stijgt van 8 naar 10','MO = 10; MK = 0,08q + 2','q = 100 kg/week'],['Alleen vaste kosten: 100 naar 180','MO = 8; MK blijft 0,08q + 2','q blijft 75 kg/week']],60,306,1480,293,[615,430,435],31);
 text(s,'Hogere vaste kosten verlagen de winst bij dezelfde q met € 80.',60,666,1480,110,40,{bold:true,color:C.blue});
 notes(s,'63, 70, 74','Haal de rekenregel op: een andere constante verdwijnt nog steeds bij differentiëren. Alleen prijs naar10:10=.08q+2 geeft100, precies capaciteit. Alleen constante naar180: q75 blijft optimaal, winst125−80=45. Als beide veranderen, is q100 nog steeds de beste haalbare keuze. Hiermee zijn de bewerkingen voor basis24 voorbereid zonder de toegewezen casus uit te werken.','Welke verandering verschuift MO en welke verandert de constante in TK?','Hogere totale kosten betekenen niet automatisch hogere MK.','Controleer waarom minimum GTK niet de keuze bepaalt.',{example:true});
}
{
 const s=slide('Korte controle: is de laagste GTK het beste?');exampleLabel(s);
 table(s,[['q (kg/week)','GTK (€ per kg)','Totale winst (€ per week)'],['50','6,00','100'],['75','6,333…','125']],60,324,1480,271,[430,525,525],35);
 text(s,'Welke productie kies je bij P = € 8 en capaciteit 100? Waarom?',60,689,1480,110,40,{bold:true,color:C.blue});
 notes(s,'70–71','Laat eerst uitleggen:75, omdat daar MO = MK met stijgende MK en haalbaarheid. Bij50 is GTK lager, maar totale winst100<125. TK(50)=300,TO400,winst100. Keer hierna expliciet terug naar start21 en verbeter de maximumredenering voordat basiswerk begint.','Welke regel bepaalt q en waarvoor gebruik je GTK?','Minimum GTK is niet automatisch maximum totale winst.','Laat21 herzien; zet daarna het overzicht terug.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 27: Korrels voor kwekerijen','§3.2.3 · Opgave 27 · Boekpagina 77');
 text(s,'Een prijsnemende producent verkoopt één standaardkwaliteit korrels.',60,201,1480,116,40);
 text(s,'P = € 16 per kg',60,365,1480,75,47,{bold:true,color:C.blue});
 text(s,'TK = 0,04q² + 4q + 400',60,479,1480,84,48,{bold:true});
 text(s,'q is kg per week; TK is euro per week. Capaciteit: 200 kg.',60,616,1480,96,38);
 text(s,'De € 400 is deze week onvermijdbaar.',60,762,1480,68,40,{bold:true,color:C.orange});
 notes(s,'77','Volledige oorspronkelijke context van doel27. Start de bespreking nadat leerlingen zelf gewerkt hebben. Toon eerst ook de figuur en alle zes vragen zonder oplossingen.','Welke gegevens bepalen haalbaarheid en de uitkomst bij q = 0?','De nieuwe casus heeft andere kosten dan het uitlegvoorbeeld.','Toon de oorspronkelijke grafiek.',{target:true});
}
firmChart('Opgave 27: de gegeven grafiek',target,{gtk:true,targetQ:true,side:['Alle verticale\nbedragen: € per kg','Horizontaal:\nproductie per week','Markeer q en winst\nzelf in het boek.']});
{
 const s=slide('Opgave 27: vragen a, b en c','§3.2.3 · Opgave 27 · Boekpagina 77');
 const qs=[['a (2p)','Stel de functie voor MK op.'],['b (3p)','Bepaal de winstmaximale haalbare q. Onderbouw het maximum met MK links en rechts van je uitkomst.'],['c (3p)','Bereken TO, TK en totale winst bij de gekozen q.']];
 qs.forEach((a,i)=>{let y=213+i*212;text(s,a[0],60,y,200,74,40,{bold:true,color:C.blue});text(s,a[1],310,y,1230,163,40);if(i<2)rule(s,60,y+181,1480);});
 notes(s,'77','Volledige vragena–c zonder antwoorden. Toon ookd–f voor de uitwerking.','Welke controle noemtb naast het oplossen?','Een vergelijking alleen is nog geen onderbouwing.','Toon ook de grafiek-,grens- en capaciteitsvragen.',{target:true});
}
{
 const s=slide('Opgave 27: vragen d, e en f','§3.2.3 · Opgave 27 · Boekpagina 77');
 const qs=[['d (3p)','Bereken GTK en geef in de grafiek q en de winstrechthoek aan. Benoem breedte en hoogte.'],['e (1p)','Vergelijk de winst met niet produceren (q = 0).'],['f (2p)','Door een storing wordt de capaciteit 120 kg. Kostenfunctie en prijs blijven gelijk. Welke q kies je nu? Licht toe; een nieuwe winstberekening is niet nodig.']];
 qs.forEach((a,i)=>{let y=206+i*212;text(s,a[0],60,y,200,74,39,{bold:true,color:C.blue});text(s,a[1],310,y,1230,184,37);if(i<2)rule(s,60,y+181,1480);});
 notes(s,'77','Alledrie volledige vragen behouden. Alles wat de leerlingen nodig hebben staat nu op dia15–18. De antwoorden beginnen pas op de volgende dia.','Welke gegevens veranderen bijf en welke blijven gelijk?','Maak geen nieuwe winstberekening als die niet gevraagd is.','Begin bij de afgeleide en de kandidaat.',{target:true});
}
linesSlide('27a–b: MK en de kandidaat',['TK = 0,04q² + 4q + 400     dus MK = 0,08q + 4','MO = 16.     16 = 0,08q + 4','q = 12 / 0,08 = 150 kg per week','150 ≤ 200 kg: de kandidaat is haalbaar.'],{pages:'77',example:false,target:true,pitfall:'400 verdwijnt uit MK, maar blijft in TK.',transition:'Onderbouw het maximum links en rechts.'});
firmChart('27b: waarom 150 kg een maximum geeft',target,{mark:true,targetQ:true,side:['q = 125: MK = 14<16\nUitbreiden gunstig.','q = 175: MK = 18>16\nInkrimpen gunstig.','MK stijgt door MO.\n150 kg past binnen 200.']});
linesSlide('27c: totale opbrengst, kosten en winst',['TO = 16 × 150 = € 2.400 per week','TK = 0,04 × 150² + 4 × 150 + 400','TK = 900 + 600 + 400 = € 1.900 per week','Winst = 2.400 − 1.900 = € 500 per week'],{pages:'77',example:false,target:true,pitfall:'De vaste400 is ook onderdeel van TK.',transition:'Gebruik dezelfde q om GTK te berekenen.'});
linesSlide('27d: breedte en hoogte van de winst',['GTK = 1.900 / 150 = € 12,666… per kg','Breedte = 150 kg per week','Hoogte = 16 − 1.900 / 150 = € 3,333… per kg','Oppervlakte = 150 × (16 − 1.900 / 150) = € 500 per week'],{pages:'77',example:false,target:true,pitfall:'Gebruik ongeronde GTK. De hoogte is niet16.',transition:'Teken de rechthoek met deze twee grenzen.'});
firmChart('27d: q en de winstrechthoek',target,{gtk:true,mark:true,rectangle:true,targetQ:true,side:['Winst = € 500\nper week','Breedte:\n150 kg/week','Hoogte:\n€ 3,333… per kg']});
{
 const s=slide('27e: vergelijken met niet produceren','§3.2.3 · Opgave 27 · Boekpagina 77');
 table(s,[['q (kg/week)','TO (€ per week)','TK (€ per week)','Winst (€ per week)'],['0','0','400','−400'],['150','2.400','1.900','500']],60,258,1480,320,[430,350,350,350],33);
 text(s,'€ 500 winst is hoger dan € 400 verlies.',60,655,1480,80,44,{bold:true,color:C.blue});
 text(s,'De € 400 constante kosten is ook bij q = 0 onvermijdbaar.',60,768,1480,63,35);
 notes(s,'77','Niet produceren betekent TO0,TK400,winst−400. De gekozen150 kg levert500. De vergelijking gebruikt exact de onvermijdbaarheidsaanname uit de bron.','Waarom is nul productie geen nul winst?','Geen conclusies trekken over een langetermijnmarktmechanisme.','Verklein ten slotte de capaciteit.',{target:true});
}
firmChart('27f: na de storing maximaal 120 kg',target,{capacity:120,targetQ:true,side:['150 kg is onhaalbaar.','MK(120)=13,60<16\nWinst stijgt tot 120.','Kies q = 120 kg/week.\nGeen nieuwe winst-\nberekening nodig.']});
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviewSlides:overviews,sourceCommit:lessonCommit,assignment:{start:[20,21],basis:[22,23,24],independent:[25,26],target:27,homework:[22,23,24,25,26,27]},sourcePrintedPages:{theory:[69,70,71,72],start:73,basis:[73,74],independent:[75,76],target:77}},null,2));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'../content/book-3/presentation-323-ooxml.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'3.2.3 Winstmaximalisatie bij volkomen concurrentie – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:Array.from(new Set(tables)),requiredNativeChartOwnerSlides:Array.from(new Set(charts)),materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,overviews,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
