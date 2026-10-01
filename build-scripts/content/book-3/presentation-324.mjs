// HOW TO ADAPT: derive assignments from the selected edition's complete sources.
// Keep teaching examples distinct from assigned work. Runtime paths come from
// the installed presentation skill; export/render in a fresh private workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
 PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

const authored=JSON.parse(await fs.readFile(fileURLToPath(new URL('./presentation-324.manifest.json',import.meta.url)),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('324');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',profit:'#C4E8D8'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[],geometry=[];
const base=`https://github.com/meijer1973/4veco-lessen/blob/${authored.sourceCommit}/${authored.sourceEdition}/`;
const foot='§3.2.4 Gemengde opgaven: de prijsnemende onderneming';
const targetFoot='§3.2.4 · Opgave 35 · Boekpagina 82–83';
const exampleFoot='§3.2.4 · Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=foot,overview=false){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,38,1480,overview?112:94,overview?44:52,{bold:true,name:'title'});
 rule(s,60,overview?203:146,1480);
 text(s,footer,60,849,1400,28,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,846,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;
}
function notes(s,page,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: ${example?'Zelfgemaakt uitlegvoorbeeld Gestandaardiseerde klei. Context en cijfers zijn niet uit het boek. Het boek is uitsluitend de bron voor de methoden. ':''}Leerlingenboek Boek 3, editie books34-v3, gedrukte boekpagina ${page}. ${base}output/Boek_3_Compleet_v3.pdf\nParagraafbron: ${base}chapters/3.2/3.2.4%20manuscript.md\nAntwoordmodel bij de boekopgaven: ${base}chapters/3.2/Antwoorden.md\nDocentroute: ${base}chapters/3.2/Docenteninformatie.md`);
}
function table(s,values,x,y,w,h,widths,size=34){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const z=t.getCell(r,c);z.fill=r===0?C.ink:(r%2?C.paper:C.pale);z.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 35.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){
 const s=slide('Deze les: §3.2.4 Gemengde opgaven:\nde prijsnemende onderneming',foot,true);
 overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,156,1480,39,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,226,835,46,35,{bold:true});
 const ys=[283,381,440,501,609,701,786],hs=[87,46,46,96,81,72,45];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;
  text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});
  text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});
 });
 text(s,'Lesdoelen',972,226,568,46,35,{bold:true});
 text(s,'Marktprijs en productie bepalen.\nHaalbaarheid en winst controleren.\nQ en q uit elkaar houden.',972,283,568,116,30,{name:'overview-goals'});
 rule(s,972,408,568);
 text(s,'Startopdracht',972,430,568,46,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 79 · Opgave 31\nSteun: §3.2.1, p. 54–56',972,487,568,80,30,{bold:active===2,name:'overview-start'});
 rule(s,972,576,568);
 text(s,'Huiswerk',972,597,568,46,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.2.4 · Opgaven 31 t/m 37\nOefenen: 31–34 · Doel: 35\n36: bonus · 37: herhaling\nMaken en nakijken',972,655,568,170,30,{bold:active===7,name:'overview-homework'});
 notes(s,'54–56, 79–84',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start is de eerste echte gemengde opgave, dus 31, niet een verzonnen opgave 1. Opgave 31 staat op boekpagina 79, 32 op 80, 33–34 op 81, doel 35 op 82–83, bonus 36 en herhaling 37 op 84. Deze gemengde paragraaf heeft geen aparte basis- of zelfstandige secties. De classroom-afspraak is alle gemengde opgaven als huiswerk: 31 t/m 37 maken en nakijken, met de bonus- en herhalingslabels behouden. Dit wijkt van de boekroute af, die bonus en herhaling aanvullend noemt. De hele route is niet aantoonbaar één les. Laat onaf werk thuis of in een volgende les afronden.\n\nStart 31 haalt bestaande technieken op: marktevenwicht, TO, GO/MO en prijsnemerschap uit §3.2.1. Bij vastlopen: laat de leerling p. 54–56 gebruiken en benoemen welke bron bij de markt of één onderneming hoort. Bij terugkeer naar deze dia vóór zelfstandig werk: laat 31b–c opnieuw uitleggen. Geef zo nodig feedback vóór 32–35.`,
  active===2?'Welk gegeven hoort bij alle molens samen?':'Welke stap vraagt nog om hulp?',
  'Een markthoeveelheid Q is niet de productie q van de molen. De hoofdstuk-PDF gebruikt andere paginanummers dan het complete boek.',
  active===7?'Noteer 31 t/m 37 maken en nakijken in de agenda.':'Gebruik de korte herhaling, of vervolg het oefenwerk.');
}

// Native XY plots. Shapes used for profit shading remain editable and derive
// from the exact same coordinate transform as the native chart plot rectangle.
const frac={x:.14,y:.08,w:.80,h:.76};
const defaultBox={left:20,top:229,width:1000,height:583};
function graph(s,{kind='firm',box=defaultBox,a=.02,b=4,c=200,maxQ=250,maxP=24,price=null,cut=null,profit=false,gtk=true,eq=null,marketNew=true}={}){
 const plot={left:box.left+box.width*frac.x,top:box.top+box.height*frac.y,width:box.width*frac.w,height:box.height*frac.h};
 const X=q=>plot.left+q/maxQ*plot.width,Y=v=>plot.top+(maxP-v)/maxP*plot.height;
 const series=[],polygons=[];
 // Workbook literals use 12 significant digits; plotting error stays below
 // 1e-8 px. Teaching calculations keep exact values until displayed results.
 const literal=n=>Number(n.toPrecision(12));
 const add=(name,pts,color,width=3,dash)=>series.push({name,xValues:pts.map(z=>literal(z[0])),values:pts.map(z=>literal(z[1])),line:{fill:color,width,...(dash?{dash}: {})},marker:{symbol:'none'}});
 if(kind==='market'){
  maxQ=50;maxP=24;
  add('V₀',[[0,12],[30,0]],C.muted,3,'dash');
  if(marketNew)add('V₁',[[0,20],[50,0]],C.blue);
  add('A₀',[[0,4],[50,24]],C.green);
  if(eq){add('E-horizontaal',[[0,eq[1]],[eq[0],eq[1]]],C.muted,1.4,'dash');add('E-verticaal',[[eq[0],0],[eq[0],eq[1]]],C.muted,1.4,'dash');}
 }else{
  if(profit){
   const g=a*cut+b+c/cut,pts=[[0,g],[cut,g],[cut,price],[0,price]];
   const pos={left:X(0),top:Y(price),width:X(cut)-X(0),height:Y(g)-Y(price)};
   s.shapes.add({geometry:'rect',name:'profit-area',position:pos,fill:C.profit,line:{fill:C.green,width:1}});
   polygons.push({name:'profit-area',points:pts,position:pos});
   // Hatch lines are native objects with both ends exactly on the rectangle.
   for(let q=5;q<cut;q+=10)s.shapes.add({geometry:'line',name:'profit-hatch-'+q,position:{left:X(q),top:Y(price),width:0,height:Y(g)-Y(price)},line:{fill:C.green,width:.7}});
  }
  add('MK',[[0,b],[maxQ,2*a*maxQ+b]],C.green);
  if(gtk){
   const candidates=new Set([Math.sqrt(c/a),...(cut?[cut]:[])]);
   for(let q=.5;q<=maxQ;q+=.5)candidates.add(q);
   // Clip the asymptotic GTK at the visible top; never draw GTK at q=0.
   const topQ=((maxP-b)-Math.sqrt((maxP-b)**2-4*a*c))/(2*a);
   candidates.add(topQ);
   const pts=[...candidates].sort((l,r)=>l-r).filter(q=>q>=topQ-1e-8&&q<=maxQ).map(q=>[q,a*q+b+c/q]);
   add('GTK',pts,C.orange);
  }
  if(price!==null)add('P = GO = MO',[[0,price],[maxQ,price]],C.blue);
  if(cut!==null)add('q gekozen',[[cut,0],[cut,price]],C.muted,1.4,'dash');
 }
 const chart=s.charts.add('scatter',{position:box,series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:maxQ,majorUnit:kind==='market'?10:(maxQ===250?50:20),numberFormatCode:'0',title:{text:kind==='market'?'Q (× 1.000 kg per week)':'q (kg per week)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:23,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:maxP,majorUnit:4,numberFormatCode:'0',title:{text:kind==='market'?'P (€ per kg)':(gtk?'P, MK, GTK (€ per kg)':'P, MK (€ per kg)'),textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:23,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:.6}},chartFill:'none',plotAreaFill:'none'});
 applyPresentationChartFont(chart,{fontFamily:FONT});charts.push(p.slides.items.length);
 if(kind==='market'){
  text(s,'V₀',X(22),Y(3.2)-42,64,37,25,{bold:true,color:C.muted});
  if(marketNew)text(s,'V₁',X(42),Y(3.2)-42,64,37,25,{bold:true,color:C.blue});
  text(s,'A₀',X(34),Y(17.6)-39,65,37,25,{bold:true,color:C.green});
  if(eq){text(s,eq[0]===10?'E₀':'E₁',X(eq[0])+14,Y(eq[1])-43,66,39,27,{bold:true});}
 }else{
  text(s,'MK',X(maxQ*.82),Y(2*a*maxQ*.82+b)-45,85,38,26,{bold:true,color:C.green});
  if(gtk)text(s,'GTK',X(maxQ*.84),Y(a*maxQ*.84+b+c/(maxQ*.84))+12,95,38,26,{bold:true,color:C.orange});
  if(price!==null)text(s,'P = GO = MO',X(maxQ*.48),Y(price)-43,255,40,26,{bold:true,color:C.blue});
 }
 geometry.push({slide:p.slides.items.length,kind,box,frac,plot,maxQ,maxP,a,b,c,price,cut,profit,gtk,eq,marketNew,series,polygons});return {X,Y,plot};
}
function right(s,title,body,tail='',color=C.blue){text(s,title,1050,216,490,90,38,{bold:true,color});text(s,body,1050,332,490,327,34);if(tail)text(s,tail,1050,701,490,118,36,{bold:true,color});}

overview('Startopdracht',2);
{
 const s=slide('Korte herhaling · Eerst de markt',exampleFoot);
 text(s,'Gestandaardiseerde klei · veel kleine prijsnemers',60,188,1480,61,38,{bold:true,color:C.blue});
 text(s,'Qv = 18.000 − 1.000P       Qa = 1.000P − 2.000',60,285,1480,62,42,{bold:true});
 text(s,'P in € per kg · Q in kg per week',60,358,1480,50,31);
 text(s,'18.000 − 1.000P = 1.000P − 2.000',60,451,1480,65,44);
 text(s,'20.000 = 2.000P        P = € 10 per kg',60,546,1480,65,44,{bold:true});
 text(s,'Q = 1.000 × 10 − 2.000 = 8.000 kg per week',60,641,1480,65,42);
 text(s,'Eén onderneming neemt de prijs over: P = GO = MO = € 10 per kg.',60,757,1480,70,36,{bold:true,color:C.blue});
 notes(s,'54–56','Dit is een zelfgemaakt onderwijsmodel. Er zijn veel kleine aanbieders van dezelfde kwaliteit klei, prijzen zijn bekend. De markt geeft de prijs: vraag gelijk aan aanbod, oplossen, terug invullen. Controleer bij 10 dat de vraag ook 8000 is. Eén onderneming neemt de prijs over. Haar q volgt pas uit haar eigen kosten en capaciteit. De context en getallen zijn anders dan alle opgaven 31–37.','Welk getal neem je mee naar één onderneming?','8000 is de markt-Q, geen productieadvies voor één bedrijf.','Gebruik nu de kosten van één kleiproducent.',true);
}
{
 const s=slide('Korte herhaling · De productie kiezen',exampleFoot);
 text(s,'TK = 0,05q² + 2q + 120       Capaciteit: 100 kg per week',60,189,1480,66,39,{bold:true});
 text(s,'MK = 0,10q + 2       MO = 10',60,287,1480,63,42,{bold:true,color:C.blue});
 text(s,'10 = 0,10q + 2        q = 80 kg per week',60,383,1480,66,44,{bold:true});
 table(s,[['Rond de kandidaat','Vergelijking','Gevolg voor winst'],['q = 60','MK = 8 < MO = 10','Extra productie helpt'],['q = 90','MK = 11 > MO = 10','Extra productie schaadt']],60,497,1480,256,[390,520,570],34);
 text(s,'80 ≤ 100: haalbaar. MK stijgt door MO.',60,778,1480,53,37,{bold:true,color:C.green});
 notes(s,'62–64, 69–72','q is kg per week, TK euro per week. Alle productie kan tegen 10 euro worden verkocht. De 120 euro constante kosten zijn deze week ook bij nul productie onvermijdbaar. Differentieer per term: 0,05q² wordt 0,10q, 2q wordt 2, 120 wordt 0. Dat de constante verdwijnt uit MK verwijdert haar niet uit TK. Controleer met 60 en 90 de richting rond 80, plus de capaciteit. De winst bij nul wordt op de volgende dia vergeleken.','Waarom is alleen MO = MK opschrijven onvoldoende?','Het minimum van GTK beantwoordt een andere vraag dan het maximum van totale winst.','Bereken alle totalen en GTK bij precies dezelfde q.',true);
}
{
 const s=slide('Korte herhaling · De winst weergeven',exampleFoot);
 graph(s,{a:.05,b:2,c:120,maxQ:100,maxP:16,price:10,cut:80,profit:true});
 right(s,'Bij q = 80 kg per week','TO = 10 × 80 = € 800\nTK = 320 + 160 + 120\n     = € 600\nGTK = 600 / 80\n        = € 7,50 per kg','Winst = 80 × (10 − 7,50)\n= € 200 per week',C.green);
 notes(s,'71–72','De rechthoek loopt van q=0 tot 80 en van 7,50 tot 10 euro per kg. Het is de winst: breedte maal hoogte. TK = 0,05 × 80² + 2 × 80 + 120 = 600. TO=800 en winst=200. GTK bij dezelfde 80 is 7,50, niet het laagste punt van GTK. Bij q=0 bedraagt de winst −120, zodat 80 beter is. Wijs de vier grenzen van de rechthoek in de figuur aan.','Wat zijn de eenheden van breedte, hoogte en oppervlakte?','10 euro is de prijs per kg, geen totale winst. De GTK-curve bestaat niet bij q=0, maar de rechthoek strekt wel tot de verticale as.','Controleer ook een bindende capaciteitsgrens.',true);
}
{
 const s=slide('Korte herhaling · Als de capaciteit bindt',exampleFoot);
 text(s,'Dezelfde kleiproducent, maar nu maximaal 70 kg per week',60,199,1480,98,40,{bold:true,color:C.orange});
 table(s,[['Controle','Uitkomst'],['Kandidaat uit MO = MK','80 kg per week is onhaalbaar'],['Bij de grens q = 70','MK = 0,10 × 70 + 2 = € 9 per kg'],['Tot de grens','MO = 10 > MK: winst stijgt nog']],60,352,1480,310,[460,1020],35);
 text(s,'Beste haalbare productie: 70 kg per week',60,718,1480,70,45,{bold:true,color:C.green});
 notes(s,'70, 72, 76','Dit is een expliciete scenarioverandering ten opzichte van de vorige dia: capaciteit 70 in plaats van 100. Prijs en kostentechniek blijven gelijk. Omdat MK op het hele haalbare interval lager is dan 10, stijgt de winst tot de grens. We zoeken geen nieuw kruispunt binnen de capaciteit. Deze korte herhaling ondersteunt opgave 33. Laat bij bonus 36 teruggrijpen op hetzelfde onderscheid tussen een nulwinstuitkomst en bewijs van het maximum.','Welke controle voorkomt een onuitvoerbaar productieadvies?','Een capaciteitsgrens is alleen optimaal als de winst tot die grens blijft stijgen.','Laat opgave 31 kort terugkomen en ga zelfstandig verder.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 35 · Kweekkorrels op twee momenten',targetFoot);
 text(s,'Bron A · De markt',60,188,1480,55,40,{bold:true,color:C.blue});
 text(s,'Veel kleine bedrijven verkopen dezelfde kwaliteit kweekkorrels.\nKopers kennen de prijzen.',60,261,1480,99,36);
 text(s,'Beginsituatie: Qv₀ = 30.000 − 2.500P\n                        Qa₀ = 2.500P − 10.000',60,394,1480,118,43,{bold:true});
 text(s,'Door een nieuwe toepassing neemt de vraag toe tot\nQv₁ = 50.000 − 2.500P.',60,554,1480,111,40,{bold:true,color:C.blue});
 text(s,'In de onderzochte korte periode verandert het aantal bedrijven niet:\nQa₀ blijft gelden. Q is kg per week; P is euro per kg.',60,714,1480,115,35);
 notes(s,'82','Lees de complete marktbron na de zelfstandige poging. Deze doelopgave combineert precies de hoofdstukdoelen: twee marktevenwichten, prijs overnemen, afgeleide, marginale keuze, capaciteit, winst en percentages. Daarom bespreken we de werkelijk genummerde doelopgave 35 en niet een willekeurige extra opgave. Het aantal bedrijven is op beide onderzochte momenten gelijk; voeg geen toetreding of langetermijnprijs toe. Toon eerst ook bron B, de basisgrafieken en alle vijf vragen voordat antwoorden verschijnen.','Wat verandert tussen de twee momenten?','De vraagverschuiving betekent geen verschuiving van de kostencurve van een bedrijf.','Lees de kostenbron en de twee basisgrafieken.');
}
{
 const s=slide('Opgave 35 · Bron B en figuur 1',targetFoot);
 text(s,'Voor iedere onderneming: TK = 0,02q² + 4q + 200',60,178,1480,58,40,{bold:true});
 text(s,'q is kg per week; capaciteit is 250 kg. Alle productie wordt verkocht.',60,251,1480,58,34);
 text(s,'De hele markt',180,335,620,40,31,{bold:true});
 text(s,'Eén onderneming',950,335,590,40,31,{bold:true});
 graph(s,{kind:'market',box:{left:25,top:380,width:760,height:430},maxQ:50,maxP:24});
 graph(s,{box:{left:805,top:380,width:760,height:430}});
 notes(s,'82','Bron B geeft dezelfde kostenfunctie voor iedere onderneming. De basisgrafieken zijn inhoudelijk gelijk aan figuur 1: markt met V₀,V₁,A₀; onderneming met MK en GTK. Het boek tekent Q in duizenden kg en q in kg. De curves geven gegevens; de gevraagde evenwichtsmarkering, opbrengstlijn en winstrechthoek staan hier nog niet. Gebruik eerst de beginsituatie en daarna het moment direct na de vraagverandering. Laat tussenresultaten staan.','Hoe lees je 20 op de linker horizontale as?','De schaalfactor ×1000 hoort alleen bij Q, niet bij q.','Toon de volledige vragen a en b, nog zonder uitwerking.');
}
{
 const s=slide('Opgave 35 · Vragen a en b',targetFoot);
 text(s,'Gebruik bronnen A en B en figuur 1 op boekpagina 82.',60,186,1480,63,35,{bold:true,color:C.blue});
 text(s,'a. (3p)',60,288,190,65,40,{bold:true});
 text(s,'Bereken in de beginsituatie P₀ en Q₀. Eén onderneming kiest dan\nq = 100. Controleer met TO en TK dat haar winst nul is.',262,288,1278,167,39);
 rule(s,60,481,1480);
 text(s,'b. (2p)',60,536,190,65,40,{bold:true});
 text(s,'Bereken direct na de vraagstijging, bij het gegeven ongewijzigde\naanbod, P₁ en Q₁. Markeer het nieuwe evenwicht E₁ in de\nmarktgrafiek.',262,536,1278,190,39);
 notes(s,'82–83','Dit is de volledige vraagtekst van a en b met puntenaantallen. Het gegeven q=100 en de te controleren nulwinst zijn deel van vraag a, geen vervroegde uitwerking. Wacht met rekenen tot c, d en e ook zichtbaar zijn geweest.','Welke gegevens gebruik je voor a, welke veranderen bij b?','q=100 in a is gegeven. Dat getal mag niet in de marktaanbodfunctie worden ingevuld als Q.','Lees ook c, d en e.');
}
{
 const s=slide('Opgave 35 · Vragen c, d en e',targetFoot);
 const qs=[['c. (3p)','Stel MK op. Bepaal bij P₁ de winstmaximale q van één onderneming.\nControleer de capaciteit en het verloop van MO en MK.'],['d. (3p)','Bereken de winst en GTK bij die q. Teken rechts de nieuwe\nP = GO = MO-lijn en arceer de winstrechthoek.'],['e. (2p)','Vergelijk de procentuele stijging van Q met die van q. Waarom zijn\nQ en q ondanks die vergelijking niet dezelfde grootheid?']];
 qs.forEach((q,i)=>{const y=200+i*190;text(s,q[0],60,y,190,64,38,{bold:true});text(s,q[1],262,y,1278,146,37);if(i<2)rule(s,60,y+156,1480);});
 text(s,'Reken met ongeronde tussenuitkomsten. Benoem markt of onderneming.',60,793,1480,42,30,{bold:true,color:C.blue});
 notes(s,'83','Alle deelvragen a–e zijn nu volledig beschikbaar geweest, na alle bronnen. Vraag c vereist méér dan een snijpunt, d méér dan een eindbedrag, e zowel een berekening als betekenis. Laat een leerling eerst de aanpak geven. Eventueel terugbladeren naar de bronnen.','Wat moet je controleren vóór je winst berekent?','De rechthoek gebruikt GTK bij de gekozen q. Geen nieuwe langetermijnvraag toevoegen.','Begin nu pas de stapsgewijze uitwerking bij a.');
}
{
 const s=slide('35a · De markt in de beginsituatie',targetFoot);
 graph(s,{kind:'market',maxQ:50,eq:[10,8],marketNew:false});
 right(s,'Qv₀ = Qa₀','30.000 − 2.500P\n= 2.500P − 10.000\n\n40.000 = 5.000P\nP₀ = € 8 per kg','Q₀ = 10.000 kg\nper week');
 notes(s,'82–83','Stel 30000−2500P gelijk aan 2500P−10000. Breng de 10000 naar links en de −2500P naar rechts, zodat 40000=5000P. P=8. Vul in aanbod in: 2500×8−10000=10000. Controleer vraag: 30000−2500×8=10000. In de grafiek is E₀=(10;8), want de hoeveelheidsschaal is ×1000. Het wegvallen van V₁ op deze begin-dia richt de aandacht op de eerste situatie; de schaal blijft gelijk.','Welke twee berekeningen controleren hetzelfde Q₀?','De coördinaat 10 betekent 10000 kg per week.','Controleer de nulwinst van één onderneming bij de gegeven q=100.');
}
{
 const s=slide('35a · Nulwinst controleren',targetFoot);
 text(s,'P₀ = € 8 per kg       Gegeven q = 100 kg per week',60,193,1480,65,40,{bold:true,color:C.blue});
 table(s,[['Grootheid','Invullen bij q = 100','Per week'],['TO','8 × 100','€ 800'],['TK','0,02 × 100² + 4 × 100 + 200','€ 800'],['Winst','800 − 800','€ 0']],60,334,1480,363,[300,890,290],36);
 text(s,'De opbrengst dekt precies alle gegeven kosten.',60,753,1480,67,42,{bold:true,color:C.green});
 notes(s,'82–83','TK=200+400+200=800. TO=8×100=800. De winst is het verschil, dus nul. Dat is hier uitsluitend een rekenuitkomst. Het boek vraagt geen uitleg over normale ondernemersbeloning, toetreding of langetermijnevenwicht.','Waar zitten de constante kosten in deze berekening?','Nulwinst op zichzelf bewijst niet dat q=100 optimaal is; daarvoor is een marginale controle nodig.','Verander nu alleen de marktvraag volgens bron A.');
}
{
 const s=slide('35b · Direct na de vraagstijging',targetFoot);
 graph(s,{kind:'market',maxQ:50,eq:[20,12]});
 right(s,'Qv₁ = Qa₀','50.000 − 2.500P\n= 2.500P − 10.000\n\n60.000 = 5.000P\nP₁ = € 12 per kg','Q₁ = 20.000 kg\nper week');
 notes(s,'82–83','Qa₀ blijft volgens de bron gelden. Los 50000−2500P=2500P−10000 op: 60000=5000P, P=12. Aanbod: 2500×12−10000=20000. Vraag geeft 50000−2500×12=20000. Markeer E₁ op (20;12) in de getoonde schaal. V verschuift rechts, de markt beweegt langs de gegeven aanbodlijn. De grotere productie komt van de bestaande ondernemingen; er wordt geen toetreding verondersteld.','Welke lijn verschuift, langs welke lijn beweegt het evenwicht?','Ongewijzigd aanbod betekent dezelfde aanbodfunctie, niet dezelfde aangeboden hoeveelheid.','Neem de nieuwe prijs mee naar één onderneming.');
}
{
 const s=slide('35c · Marginale kosten en kandidaat-q',targetFoot);
 text(s,'TK = 0,02q² + 4q + 200',60,194,1480,64,44,{bold:true});
 table(s,[['Term in TK','Afgeleide'],['0,02q²','0,04q'],['4q','4'],['200','0']],60,310,1480,276,[740,740],36);
 text(s,'MK = 0,04q + 4       MO = P₁ = 12',60,630,1480,63,42,{bold:true,color:C.blue});
 text(s,'12 = 0,04q + 4        8 = 0,04q        q = 200 kg per week',60,745,1480,77,40,{bold:true});
 notes(s,'62–64, 82–83','Gebruik de afgeleide uit §3.2.2 term voor term. Het gegeven TK beschrijft één onderneming, dus q is de kleine letter. De prijsnemer ontvangt bij elke kleine uitbreiding dezelfde 12 euro per kg. De oplossing 200 is vooralsnog een kandidaat, de controles volgen op de volgende dia.','Waarom komt 200 uit TK niet terug in MK?','De constante 200 uit de kostenfunctie is euro per week; de gevonden q=200 is kg per week. Gelijke getallen maken de grootheden niet gelijk.','Controleer beide kanten van de kandidaat en de capaciteit.');
}
{
 const s=slide('35c · Het maximum en de capaciteit',targetFoot);
 graph(s,{price:12,cut:200,gtk:false});
 right(s,'200 ≤ 250: haalbaar','Bij q = 150:\nMK = 10 < MO = 12\nWinst stijgt.\n\nBij q = 250:\nMK = 14 > MO = 12\nWinst daalt.','Beste productie:\n200 kg per week',C.green);
 notes(s,'70, 82–83','MK stijgt lineair. Vóór 200 ligt MK lager dan MO en kan de winst door uitbreiding stijgen. Na 200 ligt MK hoger dan MO en kost verdere uitbreiding winst. De capaciteit 250 maakt de kandidaat 200 haalbaar. De controle links en rechts plus haalbaarheid onderbouwt het maximum in dit doorlopende model. De vergelijking met niet produceren wordt bevestigd door de positieve winst op de volgende dia.','Welke richting heeft de winstverandering net rechts van 200?','Het snijpunt heeft als verticale waarde 12 euro per kg, niet 12 euro winst.','Bereken nu het totale resultaat bij q=200.');
}
{
 const s=slide('35d · Winst en GTK bij dezelfde q',targetFoot);
 text(s,'P₁ = € 12 per kg       q = 200 kg per week',60,188,1480,65,42,{bold:true,color:C.blue});
 table(s,[['Grootheid','Berekening','Uitkomst'],['TO','12 × 200','€ 2.400 per week'],['TK','0,02 × 200² + 4 × 200 + 200','€ 1.800 per week'],['Winst','2.400 − 1.800','€ 600 per week'],['GTK','1.800 / 200','€ 9 per kg']],60,310,1480,420,[270,780,430],34);
 text(s,'TK = 800 + 800 + 200. De constante kosten blijven meetellen.',60,771,1480,61,35,{bold:true});
 notes(s,'71–72, 82–83','Werk eerst het kwadraat uit: 200²=40000; maal 0,02 geeft 800. Tel 4×200=800 en 200 constante kosten op. TO2400 min TK1800 geeft 600 per week. GTK1800/200=9 euro per kg. Bij nul productie geeft de verstrekte TK-functie 200 euro kosten en nul opbrengst, dus −200 winst. 600 is hoger. Het maximum ligt binnen de capaciteit en overtreft de niet-produceren-grens.','Welk bedrag hoort op de verticale as van de ondernemingsgrafiek?','GTK is 9 euro per kg. 1800 euro totale kosten hoort niet op die as.','Teken de opbrengstlijn en arceer met precies deze q en GTK.');
}
{
 const s=slide('35d · De winstrechthoek',targetFoot);
 graph(s,{price:12,cut:200,profit:true});
 right(s,'P = GO = MO = 12','Breedte: 200 kg/week\n\nHoogte: 12 − 9\n           = € 3 per kg\n\nGTK bij q = 200: € 9','200 × 3 = € 600\nper week',C.green);
 notes(s,'71, 82–83','Teken de horizontale opbrengstlijn op 12 euro per kg. Lees bij q200 de GTK9. De gearceerde rechthoek loopt horizontaal van 0 tot 200 en verticaal van 9 tot 12. De breedte is kg per week en de hoogte euro per kg, dus de oppervlakte euro per week. Dit is hetzelfde resultaat als TO−TK. GTK is U-vormig met minimum bij q100 en GTK8; dat minimum bepaalt bij P12 niet de optimale productie. Het rechthoekdeel onder MK heeft geen zelfstandige kostenbetekenis: winst is TO minus alle kosten.','Welke vier grenswaarden bepalen de rechthoek?','De winst ligt niet onder de hele prijslijn en niet tussen P en MK. Gebruik GTK op dezelfde gekozen q.','Vergelijk ten slotte de veranderingen van markt en onderneming.');
}
{
 const s=slide('35e · Dezelfde procentuele stijging',targetFoot);
 table(s,[['Grootheid','Eerst','Daarna','Verandering'],['Q: hele markt','10.000 kg/week','20.000 kg/week','+100%'],['q: één onderneming','100 kg/week','200 kg/week','+100%']],60,222,1480,286,[490,350,350,290],32);
 text(s,'Q: (20.000 − 10.000) / 10.000 × 100% = 100%',60,558,1480,61,38);
 text(s,'q: (200 − 100) / 100 × 100% = 100%',60,642,1480,61,38);
 text(s,'Q telt alle ondernemingen samen; q beschrijft één bedrijf.',60,760,1480,67,41,{bold:true,color:C.blue});
 notes(s,'82–83','Gebruik telkens de eigen oude hoeveelheid als noemer. Beide hoeveelheden verdubbelen, maar Q betreft alle ondernemingen en q één bedrijf. De absolute toenamen verschillen: 10000 versus 100 kg per week. De bron houdt het aantal ondernemingen gelijk en gebruikt dezelfde kostenfunctie per bedrijf. Deze modeluitkomst is geen algemene regel dat Q en q altijd even sterk veranderen. Laat leerlingen in hun eigen oplossing één ontbrekende reken- of redeneerstap aanvullen.','Waarom is een gelijke procentuele verandering geen gelijke hoeveelheid?','100% betekent een verdubbeling, niet dat de nieuwe waarde 100 kg is.','Sluit af met dezelfde overzichtsdia en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...authored,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,geometry},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
// Pin native plot bounds so that editable shading and labels share its scale.
const patch=`import sys,zipfile,xml.etree.ElementTree as E,os\np=sys.argv[1]\nns='http://schemas.openxmlformats.org/drawingml/2006/chart'\nE.register_namespace('c',ns)\nwith zipfile.ZipFile(p) as z: files={n:z.read(n) for n in z.namelist()}\nfor n,b in list(files.items()):\n if '/charts/' not in n or not n.endswith('.xml'): continue\n r=E.fromstring(b)\n a=r.find('.//{'+ns+'}plotArea')\n if a is None: continue\n l=a.find('{'+ns+'}layout')\n if l is not None: a.remove(l)\n l=E.Element('{'+ns+'}layout');a.insert(0,l);m=E.SubElement(l,'{'+ns+'}manualLayout')\n for k,v in [('layoutTarget','inner'),('xMode','edge'),('yMode','edge'),('wMode','factor'),('hMode','factor'),('x','${frac.x}'),('y','${frac.y}'),('w','${frac.w}'),('h','${frac.h}')]:E.SubElement(m,'{'+ns+'}'+k,{'val':v})\n files[n]=E.tostring(r,encoding='utf-8',xml_declaration=True)\nwith zipfile.ZipFile(p+'.tmp','w',zipfile.ZIP_DEFLATED) as z:\n for n,b in files.items():z.writestr(n,b)\nos.replace(p+'.tmp',p)\n`;
await fs.writeFile(path.join(BUILD,'plot-layout.py'),patch);execFileSync(PYTHON,[path.join(BUILD,'plot-layout.py'),candidate]);
const tableOwners=[...new Set(tables)],chartOwners=[...new Set(charts)];
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'3.2.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:chartOwners,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
