import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

// Classroom companion to Book 1, second edition 2026. No first-edition content.
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('113');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',TITLE='Tabellen, grafieken en formules';
const stem='1.1.3 '+TITLE+' – presentatie';
const lessonCommit='173aa9a803897965c572df2c4e7f83cdb135eb1c';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+lessonCommit+'/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/';
const manifest=[],tables=[],charts=[],overviewSlides=[],geometry=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function line(s,x,y,w,h=0,color=C.line,dashed=false,width=2){return s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:h},line:{fill:color,width,style:dashed?'dashed':'solid'}});}
function slide(title,{target=false,example=false}={}){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,76,title.length>56?46:52,{bold:true});line(s,60,146,1480);
 text(s,target?'§1.1.3 · Opgave 30 · Boekpagina 36':'§1.1.3 '+TITLE,60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 if(example)text(s,'Uitlegvoorbeeld — niet uit het boek',60,170,1480,43,27,{color:C.blue,bold:true});
 manifest.push({number:p.slides.items.length,title,kind:target?'target':example?'authored-example':'lesson'});return s;
}
function notes(s,page,explanation,question,misconception,transition,{example=false}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${misconception}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte pagina ${page} van het complete leerlingenboek. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nLesbron: ${source}bronnen/H1/1.1.3%20Tabellen%2C%20grafieken%20en%20formules%20%E2%80%93%20paragraaf.md\nAntwoordmodel: ${source}bronnen/H1/Antwoorden.md${example?'\nAuteursvoorbeeld: eigen context en getallen voor deze lespresentatie. De boekpagina onderbouwt de methode, niet deze gegevens.':''}`);
}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?C.paper:C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 30.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §1.1.3 '+TITLE);overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Grafieken tekenen en interpoleren,\nformules gebruiken, oppervlaktes\nbepalen en claims controleren.',972,244,565,122,30,{name:'overview-goals'});
 line(s,972,374,568);text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 32 · Opgaven 22 en 23\n23: verkennen, theorie p. 24–25',972,459,565,95,30,{bold:active===2,name:'overview-start'});
 line(s,972,570,568);text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§1.1.3\nBasis: 24, 25 en 26\nZelfstandig: 27, 28 en 29\nDoelopgave: 30\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'24–25, 32–36',`Laat het overzicht staan tijdens ${phase.toLowerCase()}. Start: 22–23 op p. 32. Basis: 24 op p. 32, 25–26 op p. 33. Zelfstandig: 27 op p. 34, 28–29 op p. 35. Doel: 30 op p. 36. Huiswerk: 24, 25, 26, 27, 28, 29 en 30 maken en nakijken. Bonus 31 en herhaling 32–33 zijn niet toegewezen. De complete route mag meerdere lesmomenten beslaan.\n\nVoorkennis: 22a geeft aftrekken en delen expliciet in de opdracht; 22b gebruikt de procentuele verandering die op p. 14 is onderwezen. Controleer bij 22b de oude waarde als noemer. Opgave 23 is verkennend: de volgorde van coördinaten en het verschil tussen een prijs–hoeveelheidsgrafiek en een tijdreeks zijn nieuwe handelingen. Laat leerlingen bij 23 de uitleg en figuren op p. 24–25 gebruiken, vooral horizontale waarde eerst en het kader over tijdreeksen. Laat ze de gebruikte steun aanwijzen en hun twijfel noteren. Vraag nog geen onbegeleide beheersing.\n\nBij terugkeer vóór het basiswerk: laat 23 opnieuw proberen, bespreek welke grootheid horizontaal staat en waarom, en herstel eventuele verwarring. De opgaven beginnen pas na die terugkeer. Houd liniaal en ruitjespapier klaar.`, 'Welke grootheid hoort bij de eerste coördinaat?','Een gemaakte startopgave bewijst nog geen duurzame beheersing.','Startfase: begin met het eigen uitlegvoorbeeld. Oefenfase: basis 24–26. Afsluiting: noteer het resterende huiswerk.');
}
function graph(s,{xs,ys,xmax,ymax,xstep,ystep,stage='line',point=null,time=false,position={left:60,top:236,width:1000,height:555}}){
 const series=stage==='points'?xs.map((x,i)=>({name:`Punt (${x}; ${ys[i]})`,xValues:[x],values:[ys[i]],fill:C.blue,line:{fill:C.blue,width:1},marker:{symbol:'circle',size:8}})):[{name:time?'Inschrijvingen':stage==='frame'?'Assenframe':'Gegeven model',xValues:stage==='frame'?[0,xmax]:xs,values:stage==='frame'?[0,0]:ys,line:{fill:stage==='frame'?'#FFFFFF':C.blue,width:stage==='frame'?0:4},marker:{symbol:stage==='frame'?'none':'circle',size:8}}];
 if(point){series.push({name:'Afleeshulp',xValues:[0,point[0],point[0]],values:[point[1],point[1],0],line:{fill:C.orange,width:2,style:'dashed'},marker:{symbol:'none',size:4}});}
 const ch=s.charts.add('scatter',{position,series,scatterOptions:{style:stage==='points'?'marker':'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{min:0,max:xmax,majorUnit:xstep,numberFormatCode:'0',title:{text:time?'Dag t':'Q (reserveringen per middag)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},yAxis:{min:0,max:ymax,majorUnit:ystep,numberFormatCode:'0',title:{text:time?'Totaal aantal inschrijvingen':'P (€ per reservering)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 geometry.push({slide:p.slides.items.length,type:'scatter',stage,xs,ys,xmax,ymax,xstep,ystep,point,time});return ch;
}
function plotArea(s,{x,y,w=580,h=430,left,right,bottom,top,maxX=12,maxY=10,triangle=false,label=true}){
 const plot={x:x+80,y:y+42,w:w-125,h:h-130};
 const px=v=>plot.x+v/maxX*plot.w,py=v=>plot.y+plot.h-v/maxY*plot.h;
 line(s,px(0),py(0),plot.w,0,C.ink,false,2);line(s,px(0),py(maxY),0,plot.h,C.ink,false,2);
 text(s,'Verticale positie (m)',x+5,y-4,w-20,35,23,{color:C.muted});
 text(s,'Horizontale positie (m)',x+30,y+h-44,w-35,35,23,{align:'center',color:C.muted});
 [0,left,right].forEach(v=>text(s,String(v),px(v)-22,py(0)+13,45,32,24,{align:'center'}));
 [bottom,top].forEach(v=>{text(s,String(v),px(0)-47,py(v)-17,35,35,24,{align:'right'});line(s,px(0),py(v),px(left)-px(0),0,C.muted,true,1);});
 [left,right].forEach(v=>line(s,px(v),py(bottom),0,py(0)-py(bottom),C.muted,true,1));
 const points=triangle?[[left,bottom],[right,bottom],[left,top]]:[[left,bottom],[right,bottom],[right,top],[left,top]];
 const drawn=points.map(([a,b])=>[px(a),py(b)]),minx=px(left),miny=py(top),sw=px(right)-minx,sh=py(bottom)-miny;
 s.shapes.add({geometry:'custom',name:triangle?'plattegrond-driehoek':'plattegrond-rechthoek',position:{left:minx,top:miny,width:sw,height:sh},fill:triangle?'#D4E5DF':'#D5E6EF',line:{fill:triangle?C.green:C.blue,width:3},customPaths:[{width:sw,height:sh,commands:[{moveTo:{x:drawn[0][0]-minx,y:drawn[0][1]-miny}},...drawn.slice(1).map(([a,b])=>({lineTo:{x:a-minx,y:b-miny}})),{close:{}}]}]});
 if(label)text(s,triangle?'Driehoek':'Rechthoek',x+80,y+h-85,w-125,36,27,{bold:true,align:'center',color:triangle?C.green:C.blue});
 geometry.push({slide:p.slides.items.length,type:'area',triangle,values:{left,right,bottom,top,maxX,maxY},plot,drawn});
}
overview('Startopdracht',2);
{
 const s=slide('Een model voor een museumworkshop',{example:true});
 text(s,'Een museum verwacht reserveringen bij drie mogelijke prijzen.',60,245,1480,70,39,{bold:true});
 table(s,[['P (€ per reservering)','3','7','11'],['Q (reserveringen per middag)','180','140','100']],60,361,1480,200,[790,230,230,230],34);
 text(s,'Overige omstandigheden blijven gelijk.\nTussen de drie punten gebruiken we een rechte lijn.',60,629,1480,122,38);
 notes(s,'24–26','Introduceer deze eigen, fictieve modeltabel. Lees één prijs met het bijbehorende aantal. Het model beschrijft verwachtingen voor één middag, geen waargenomen feiten. We tekenen alleen tussen de opgegeven eindpunten. Het museumvoorbeeld staat los van alle opgegeven boekopgaven.','Hoeveel reserveringen verwacht het museum bij € 7?','Gebruik de tabelwaarden niet als gegarandeerde aantallen.','Kies eerst de assen en schalen.',{example:true});
}
{
 const s=slide('Assen en schaal',{example:true});
 graph(s,{xs:[180,140,100],ys:[3,7,11],xmax:200,ymax:12,xstep:20,ystep:2,stage:'frame'});
 text(s,'Horizontaal: Q\n0 tot 200, stappen van 20',1100,260,440,130,34,{bold:true,color:C.blue});
 text(s,'Verticaal: P\n0 tot 12, stappen van 2',1100,440,440,130,34,{bold:true,color:C.green});
 text(s,'Gelijke afstanden op één as\ngeven gelijke verschillen.',1100,641,440,141,32);
 notes(s,'24–25','Kies Q horizontaal en P verticaal voor deze prijs–hoeveelheidsgrafiek. Benoem variabele, eenheid en periode. Laat bij de schaal zien dat twee opeenvolgende vakken op dezelfde as steeds hetzelfde verschil voorstellen. De twee assen hoeven geen gelijke stapgrootte te hebben.','Waarom past 0 tot 200 bij het grootste aantal 180?','Een regelmatige schaal is belangrijker dan evenveel getallen op beide assen.','Plaats de drie punten.',{example:true});
}
for(const stage of ['points','line']){
 const s=slide(stage==='points'?'Coördinaten: horizontaal eerst':'Het gegeven rechte lijnstuk',{example:true});
 graph(s,{xs:[180,140,100],ys:[3,7,11],xmax:200,ymax:12,xstep:20,ystep:2,stage});
 text(s,'P = 3 en Q = 180\nwordt (180; 3)',1100,260,440,132,34,{bold:true,color:C.blue});
 text(s,'(140; 7)\n(100; 11)',1100,440,440,120,36,{bold:true});
 text(s,stage==='points'?'Controleer ieder punt\nmet de tabel.':'Alleen tussen\nde gegeven punten.',1100,641,440,141,34,{bold:true,color:C.orange});
 notes(s,'24–25',stage==='points'?'Wijs de route aan: eerst 180 langs de horizontale as, daarna omhoog naar 3. De horizontale waarde komt voor de puntkomma. Controleer ook 140 met 7 en 100 met 11.':'Verbind dezelfde drie punten met rechte lijnstukken. Dat volgt hier uit de opgegeven modelaanname. Trek niet zonder broninformatie door tot een as of voorbij de eindpunten.','Welke coördinaat noem je als eerste?','Een netjes getrokken lijn buiten het gegeven gebied is nog geen betrouwbare voorspelling.',stage==='points'?'Verbind de punten volgens de modelaanname.':'Lees nu een tussenwaarde af.',{example:true});
}
{
 const s=slide('Interpoleren bij P = € 6',{example:true});
 graph(s,{xs:[180,140,100],ys:[3,7,11],xmax:200,ymax:12,xstep:20,ystep:2,point:[150,6]});
 text(s,'Van € 3 naar € 7',1100,250,440,50,34,{bold:true});
 text(s,'Deel van het interval:\n(6 − 3) / (7 − 3) = ¾',1100,333,440,127,31);
 text(s,'Daling: ¾ × 40 = 30',1100,516,440,81,32,{bold:true,color:C.blue});
 text(s,'Q = 180 − 30 = 150\nreserveringen per middag',1100,672,440,114,32,{bold:true,color:C.orange});
 notes(s,'26','De prijs 6 ligt drie kwart van de weg van 3 naar 7. Over het hele interval daalt Q met 180 − 140 = 40. Drie kwart daarvan is 30. Trek die 30 af van het eerste aantal. De hulplijnen tonen eerst horizontaal vanaf P = 6 naar de lijn, daarna omlaag naar Q = 150. Bij echte metingen is deze tussenwaarde slechts een schatting, tenzij een lineair model is afgesproken.','Waarom neem je drie kwart en niet de helft?','Niet elke tussenprijs ligt halverwege. Vergelijk bij de fractie prijs met prijs en pas daarna dezelfde fractie toe op het aantalverschil.','Controleer een uitspraak over de tabel met de bekende procentformule.',{example:true});
}
{
 const s=slide('Een procentuele claim controleren',{example:true});
 text(s,'“Van € 3 naar € 7 daalt het aantal met 40%.”',60,244,1480,87,43,{bold:true,color:C.blue});
 table(s,[['','Oud','Nieuw'],['Reserveringen per middag','180','140']],60,380,1480,180,[800,340,340],34);
 text(s,'(nieuw − oud) / oud × 100%',60,608,1480,65,42);
 text(s,'(140 − 180) / 180 × 100% ≈ −22,22%',60,704,1480,65,44,{bold:true});
 notes(s,'14, 29–30','Haal de methode uit §1.1.2 p. 14 kort op. De afname is 40 reserveringen. Het percentage gebruikt het oude aantal 180 als basis. De claim is onjuist: de modeluitkomst daalt met ongeveer 22,22%, niet 40%. Rond alleen het eindpercentage af. Dit is een modelvergelijking bij gelijkblijvende omstandigheden.','Wat staat er onder de deelstreep?','Een absolute afname van 40 is geen daling van 40%.','Een formule is een andere manier om gegevens te verbinden.',{example:true});
}
{
 const s=slide('Een formule invullen',{example:true});
 text(s,'Spellenhuur: T = 12 + 4n',60,244,1480,82,52,{bold:true,color:C.blue});
 text(s,'T: bedrag in euro. n: aantal spellen, hele aantallen 0 t/m 15.',60,351,1480,65,33);
 table(s,[['Betekenis','Bedrag'],['Startbedrag','€ 12'],['Per spel','€ 4']],60,451,690,230,[360,330],32);
 text(s,'Bij n = 3',850,457,690,56,37,{bold:true});
 text(s,'T = 12 + 4 × 3\nT = 12 + 12 = € 24',850,554,690,143,43,{bold:true});
 text(s,'Eerst vermenigvuldigen, daarna optellen.',60,768,1480,58,35,{color:C.orange,bold:true});
 notes(s,'27','Deze eigen betaalregel is geen les over kostensoorten. 4n betekent 4 maal n. De 12 is euro, de 4 euro per spel. Vul de 3 op de plaats van n in en werk volgens de rekenvolgorde. Controleer dat 3 een toegestaan geheel aantal is.','Wat betekent de 4 in deze formule?','12 + 4 eerst uitrekenen zou de formule veranderen.','Keer de bewerkingen om als het totale bedrag bekend is.',{example:true});
}
{
 const s=slide('Terugrekenen met dezelfde bewerking aan beide kanten',{example:true});
 text(s,'Spellenhuur: T = 12 + 4n. Gegeven: T = € 44.',60,241,1480,71,38,{bold:true});
 table(s,[['Vergelijking','Bewerking'],['44 = 12 + 4n','Aan beide kanten 12 aftrekken'],['44 − 12 = 12 + 4n − 12','Dus 32 = 4n'],['32 / 4 = 4n / 4','Aan beide kanten delen door 4'],['n = 8 spellen','Geheel aantal binnen 0 t/m 15']],60,350,1480,349,[730,750],32);
 text(s,'Controle: 12 + 4 × 8 = € 44',60,752,1480,68,43,{bold:true,color:C.green});
 notes(s,'27','Maak de optelling eerst ongedaan door van beide kanten 12 af te trekken. Deel vervolgens beide kanten door 4. De vergelijking blijft gelijkwaardig. Vul het gevonden aantal terug in en controleer ook het bereik.','Waarom trek je eerst 12 af en deel je pas daarna?','Een getal naar de andere kant zetten verklaart nog niet waarom de gelijkheid behouden blijft.','Vergelijk twee aantallen in dezelfde betaalregel.',{example:true});
}
{
 const s=slide('Tweemaal zoveel spellen',{example:true});
 text(s,'Dezelfde betaalregel: T = 12 + 4n',60,246,1480,68,41,{bold:true});
 table(s,[['Aantal spellen','Berekening','Bedrag'],['3','12 + 4 × 3','€ 24'],['6','12 + 4 × 6','€ 36']],60,366,1480,280,[420,660,400],34);
 text(s,'Het startbedrag blijft € 12.',60,714,1480,76,43,{bold:true,color:C.orange});
 notes(s,'27','Bij verdubbeling van n verdubbelt alleen 4n. De 12 wordt niet verdubbeld. Het totaal gaat van 24 naar 36, terwijl een verdubbeld totaal 48 zou zijn. Dit bereidt zelfstandig 28c voor met andere context en data. We voegen geen kostenterminologie toe.','Welk deel wordt bij tweemaal zoveel spellen wel tweemaal zo groot?','Een lineaire formule met een startbedrag is niet automatisch een evenredig verband.','Ga naar posities op een plattegrond.',{example:true});
}
{
 const s=slide('Basis en hoogte zijn afstanden',{example:true});
 text(s,'Twee vormen op een tuinplattegrond',60,237,1480,57,37,{bold:true});
 plotArea(s,{x:60,y:333,w:660,h:432,left:3,right:10,bottom:2,top:5});
 plotArea(s,{x:840,y:333,w:660,h:432,left:3,right:10,bottom:2,top:5,triangle:true});
 text(s,'Basis = 10 − 3 = 7 m',60,783,700,54,34,{bold:true,color:C.blue});
 text(s,'Hoogte = 5 − 2 = 3 m',840,783,700,54,34,{bold:true,color:C.green});
 notes(s,'28','De figuren zijn een eigen plattegrondvoorbeeld. Beide assen geven een positie in meter. De basis loopt van 3 tot 10, de hoogte van 2 tot 5. Wijs beide afstanden aan. Bij de driehoek staat de hoogte loodrecht op de horizontale basis.','Waarom is de hoogte 3 meter en niet 5 meter?','Een aspositie of een schuine zijde is niet automatisch de hoogte.','Gebruik die twee afstanden in de oppervlakteformules.',{example:true});
}
{
 const s=slide('Oppervlakte met dezelfde basis en hoogte',{example:true});
 plotArea(s,{x:60,y:271,w:660,h:400,left:3,right:10,bottom:2,top:5});
 plotArea(s,{x:840,y:271,w:660,h:400,left:3,right:10,bottom:2,top:5,triangle:true});
 text(s,'Rechthoek = basis × hoogte\n7 × 3 = 21 m²',60,701,700,122,38,{bold:true,color:C.blue});
 text(s,'Driehoek = ½ × basis × hoogte\n½ × 7 × 3 = 10,5 m²',840,701,700,122,38,{bold:true,color:C.green});
 notes(s,'28','Het product van de afstanden 7 en 3 is 21 vierkante meter. De driehoek beslaat de helft van de rechthoek met dezelfde basis en hoogte: 10,5 vierkante meter. Meters maal meters geeft vierkante meter. Hier behandelen we uitsluitend geometrie.','Waarom staat bij de driehoek de factor een half?','Er hoort hier geen economische surplusbetekenis bij de oppervlakte.','Een tijdreeks vraagt weer andere asbetekenissen.',{example:true});
}
{
 const s=slide('Verschil per dag bij ongelijke intervallen',{example:true});
 graph(s,{xs:[1,4,6],ys:[12,30,42],xmax:6,ymax:48,xstep:1,ystep:12,time:true,position:{left:60,top:272,width:920,height:529}});
 table(s,[['Dag','1','4','6'],['Totaal','12','30','42']],1030,273,510,140,[174,112,112,112],29);
 text(s,'Van dag 1 tot dag 4',1030,461,510,55,34,{bold:true});
 text(s,'(30 − 12) / (4 − 1)\n= 18 / 3\n= 6 inschrijvingen per dag',1030,551,510,194,33,{bold:true,color:C.blue});
 notes(s,'29','Een eigen fictieve inzamelingsactiviteit telt inschrijvingen op drie dagen. Tijd staat horizontaal. De eerste tabelstap duurt drie dagen, de tweede twee. Bereken bij de eerste stap 18 gedeeld door 3, en bij de tweede 12 gedeeld door 2: beide gemiddeld 6 per dag. De verbonden meetpunten helpen het verloop te lezen, maar zijn geen bewijs voor precies zes op elke afzonderlijke dag.','Waarom deel je de toename 18 door 3?','Eén stap in de tabel is niet altijd één dag.','Pas de keuze van de noemer toe op een verschil per euro.',{example:true});
}
{
 const s=slide('Verschil per euro prijsstijging',{example:true});
 text(s,'Terug naar de museumworkshop',60,239,1480,64,40,{bold:true,color:C.blue});
 table(s,[['Prijs P (€ per reservering)','3','11'],['Q (reserveringen per middag)','180','100']],60,345,1480,190,[800,340,340],33);
 text(s,'Afname / prijsverschil = (180 − 100) / (11 − 3)',60,598,1480,70,42);
 text(s,'80 / 8 = 10 reserveringen minder per euro prijsstijging',60,700,1480,100,40,{bold:true,color:C.orange});
 notes(s,'13, 29','Dezelfde methode krijgt een andere noemer: per euro prijsstijging vraagt om delen door het prijsverschil. Dat verschil is 11 − 3 = 8 euro. De hoeveelheid daalt met 180 − 100 = 80 reserveringen, dus gemiddeld 10 reserveringen minder per euro prijsstijging. In de prijs–hoeveelheidsgrafiek staat P verticaal; de gevraagde eenheid bepaalt toch dat het prijsverschil onder de deelstreep komt. Dit is een verandering in modeluitkomsten, geen algemene vraagwet. Het eigene museumvoorbeeld houdt de toegewezen opgave 27d beschikbaar voor zelfstandig werk.','Waarom deel je hier door 8 en niet door 80?','De horizontale as bepaalt niet automatisch wat onder de deelstreep komt. Lees wat per eenheid gevraagd wordt.','Begrens wat een bron ondersteunt.',{example:true});
}
{
 const s=slide('Wat ondersteunt de bron?',{example:true});
 table(s,[['Model museumworkshop','Waarnemingen inschrijvingen'],['Rechte lijn tussen punten is gegeven.','Alleen dag 1, 4 en 6 zijn geregistreerd.'],['P = € 6 geeft Q = 150 in het model.','Gemiddeld 6 per dag over elk interval.'],['Buiten de eindpunten geen voorspelling.','Verloop tussendoor blijft onbekend.']],60,264,1480,391,[740,740],32);
 text(s,'“De stijging komt door een herinneringsbericht.”',60,700,1480,66,41,{bold:true,color:C.orange});
 text(s,'De bron bevat geen informatie over de oorzaak.',60,785,1480,47,31,{bold:true});
 notes(s,'26, 29','Vergelijk expliciete modelaannames met meetpunten. Binnen het lineaire model volgt de tussenwaarde uit de afspraak. Bij waarnemingen is lineair interpoleren een schatting. De tijdreeks zegt ook niets over een oorzaak: een herinneringsbericht is niet in de bron vermeld. Laat leerlingen één ondersteunde en één niet-ondersteunde uitspraak noemen.','Kun je weten of op dag 2 precies 18 inschrijvingen waren?','Een lijn tussen metingen bewijst geen exacte tussenwaarden; tijdsvolgorde bewijst geen causaliteit.','Keer terug naar start 23 en begin daarna bij basis 24–26.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 30 · Bron A',{target:true});
 text(s,'Reserveren, huren en meten',60,186,1480,64,41,{bold:true,color:C.blue});
 text(s,'Een verhuurder gebruikt onderstaande reserveringstabel voor één middag. De overige omstandigheden blijven gelijk. Tussen de punten geldt een rechte lijn.',60,301,1480,173,38);
 table(s,[['P (€ per reservering)','2','5','8'],['Q (reserveringen per middag)','100','70','40']],60,541,1480,200,[790,230,230,230],34);
 notes(s,'36','Dit is de werkelijke doelopgave 30 uit het boek. Start de bespreking nadat leerlingen deze zelf hebben geprobeerd. De drie bronnen A, B en C zijn afzonderlijke situaties. Deze dia toont bron A zonder antwoord.','Welke informatie is een modelaanname?','Verwar de gegevens van bron A niet met de formule of plattegrond.','Toon a, b en c, daarna de andere bronnen en vragen.');
}
{
 const s=slide('Opgave 30 · Vragen bij bron A',{target:true});
 text(s,'a. Teken bij bron A zelf een prijs–hoeveelheidsgrafiek op ruitjespapier, met schalen, eenheden en de drie punten.',60,215,1480,130,38);
 line(s,60,390,1480);
 text(s,'b. Bepaal met lineaire interpolatie Q bij P = € 4.',60,434,1480,103,39);
 line(s,60,588,1480);
 text(s,'c. Een bericht stelt: “Tussen P = € 2 en P = € 5 daalt het aantal met ongeveer 43%.” Controleer de uitspraak.',60,636,1480,151,38);
 notes(s,'36','Lees alle deelvragen bij bron A. De bronwaarden blijven op de vorige dia beschikbaar. Geef nog geen antwoorden: ook d tot en met g moeten eerst voor iedereen zichtbaar zijn.','Welke weergave maak je zelf bij a?','Bij c is een onderbouwd oordeel nodig.','Toon bron B en vragen d en e.');
}
{
 const s=slide('Opgave 30 · Bron B en vragen d–e',{target:true});
 text(s,'Voor de huur van verlichting geldt T = 8 + 2n.',60,213,1480,71,42,{bold:true,color:C.blue});
 text(s,'T is het bedrag in euro.\nn is het aantal lampjes, van 0 tot en met 30.',60,322,1480,129,38);
 line(s,60,496,1480);
 text(s,'d. Bereken met bron B het bedrag bij n = 6.',60,548,1480,88,39);
 text(s,'e. Bereken met bron B het aantal lampjes bij T = € 32. Controleer.',60,695,1480,114,39);
 notes(s,'36','De rekenregel en het geldige aantal zijn letterlijk uit bron B. Benoem de betekenis van T en n, maar stel nog geen uitwerking op.','Wat is bij d bekend en wat bij e?','De letter n staat voor lampjes, niet voor reserveringen uit bron A.','Toon ook bron C en de laatste twee vragen.');
}
{
 const s=slide('Opgave 30 · Bron C en vragen f–g',{target:true});
 text(s,'De figuur is een plattegrond met posities in meters.',60,182,1480,57,36,{bold:true});
 plotArea(s,{x:70,y:283,w:660,h:365,left:2,right:8,bottom:4,top:8,maxX:10,maxY:9});
 plotArea(s,{x:840,y:283,w:660,h:365,left:2,right:8,bottom:4,top:8,maxX:10,maxY:9,triangle:true});
 text(s,'f. Bereken met bron C de oppervlakte van de rechthoek.',60,674,1480,62,36);
 text(s,'g. Bereken met bron C de oppervlakte van de driehoek.\nLaat zien welke basis en hoogte je gebruikt.',60,743,1480,96,36);
 notes(s,'36','De plattegrond is als bewerkbare figuur overgenomen uit bron C: horizontale posities 2 en 8; verticale posities 4 en 8. De rechthoek en driehoek hebben dezelfde basis en hoogte. De grafiek bevat geen uitkomsten. Nu zijn alle bronnen en vragen a tot en met g getoond.','Welke posities begrenzen de hoogte?','De prijs–hoeveelheidsgrafiek uit a hoort niet bij deze plattegrond.','Begin pas nu met de oplossingen, bij bron A.');
}
{
 const s=slide('Opgave 30a · Punten en lijnstukken',{target:true});
 graph(s,{xs:[100,70,40],ys:[2,5,8],xmax:120,ymax:10,xstep:20,ystep:2});
 text(s,'Q horizontaal\nP verticaal',1100,238,440,114,37,{bold:true,color:C.blue});
 text(s,'(100; 2)\n(70; 5)\n(40; 8)',1100,409,440,159,38,{bold:true});
 text(s,'Schalen, eenheden\nen drie punten',1100,664,440,114,34,{color:C.orange,bold:true});
 notes(s,'36','Kies bijvoorbeeld Q van 0 tot 120 in stappen van 20 en P van 0 tot 10 in stappen van 2. Plaats de drie punten met de horizontale waarde eerst. Verbind ze met rechte lijnstukken, alleen tussen de opgegeven eindpunten. Controleer elk punt met de tabel.','Waar ligt (70; 5) tussen de schaalwaarden?','70 en 5 hoeven geen benoemde grote schaalstrepen te zijn: plaats ze evenredig ertussen.','Gebruik de lijn voor P = 4.');
}
{
 const s=slide('Opgave 30b · Lineair interpoleren',{target:true});
 graph(s,{xs:[100,70,40],ys:[2,5,8],xmax:120,ymax:10,xstep:20,ystep:2,point:[80,4]});
 text(s,'Prijsinterval € 2 tot € 5',1100,239,440,88,33,{bold:true});
 text(s,'(4 − 2) / (5 − 2) = ⅔',1100,371,440,96,32);
 text(s,'Q = 100 − ⅔ × 30\nQ = 80',1100,520,440,123,34,{bold:true,color:C.orange});
 text(s,'80 reserveringen\nper middag',1100,710,440,104,32,{bold:true});
 notes(s,'36','Het prijsinterval is 3 euro. De prijs 4 ligt 2 euro boven 2, dus op twee derde van het interval. Q daalt over het hele stuk met 100 − 70 = 30. Twee derde daarvan is 20, dus 100 − 20 = 80. De hulplijnen sluiten aan bij het punt (80; 4). Controleer dat 80 tussen 70 en 100 ligt en bij de gegeven rechte lijn past.','Waarom trek je 20 af?','P = 4 is niet het midden van 2 en 5.','Controleer de claim met de oude hoeveelheid als basis.');
}
{
 const s=slide('Opgave 30c · De juiste vergelijkingsbasis',{target:true});
 table(s,[['Prijs P','€ 2','€ 5'],['Q (reserveringen per middag)','100','70']],60,217,1480,192,[790,345,345],34);
 text(s,'(70 − 100) / 100 × 100% = −30%',60,480,1480,76,48,{bold:true,color:C.blue});
 text(s,'De uitspraak is onjuist: het aantal daalt met 30%.',60,606,1480,102,41,{bold:true});
 text(s,'De oude 100 is de basis. Delen door 70 gebruikt de nieuwe waarde.',60,754,1480,75,34,{color:C.orange});
 notes(s,'14, 36','De daling is 30 ten opzichte van 100. De procentuele verandering is daarom min 30 procent. De ongeveer 43 procent ontstaat bij 30 gedeeld door de nieuwe 70, maar dat is niet de gevraagde daling ten opzichte van oud. De conclusie blijft een modeluitkomst voor deze reserveringstabel.','Waar komt de foutieve 43% ongeveer vandaan?','De verkeerde noemer kan een plausibel percentage opleveren.','Ga naar de onafhankelijke betaalregel van bron B.');
}
{
 const s=slide('Opgave 30d · Het bedrag bij zes lampjes',{target:true});
 text(s,'Bron B: T = 8 + 2n',60,215,1480,85,52,{bold:true,color:C.blue});
 text(s,'n = 6',60,354,1480,75,45);
 text(s,'T = 8 + 2 × 6\nT = 8 + 12\nT = € 20',60,475,1480,248,52,{bold:true});
 text(s,'6 lampjes valt binnen 0 tot en met 30.',60,783,1480,51,34,{color:C.green});
 notes(s,'36','Vervang n door 6. Bereken eerst 2 maal 6 en tel daarna 8 op. Het resultaat is 20 euro. De eenheid van T is een totaalbedrag in euro, niet euro per lampje.','Welke bewerking doe je als eerste?','Tel 8 en 2 niet eerst op.','Reken nu terug van het bedrag naar het aantal.');
}
{
 const s=slide('Opgave 30e · Het aantal bij € 32',{target:true});
 table(s,[['Vergelijking','Bewerking'],['32 = 8 + 2n','Aan beide kanten 8 aftrekken'],['32 − 8 = 8 + 2n − 8','Dus 24 = 2n'],['24 / 2 = 2n / 2','Aan beide kanten delen door 2'],['n = 12 lampjes','12 is een geldig geheel aantal']],60,221,1480,383,[730,750],33);
 text(s,'Controle: 8 + 2 × 12 = € 32',60,661,1480,72,45,{bold:true,color:C.green});
 text(s,'12 ligt tussen 0 en 30.',60,778,1480,57,36);
 notes(s,'36','Laat iedere stap en dezelfde bewerking aan beide kanten zien. Trek 8 af, deel door 2. Het gevonden antwoord geeft na invullen weer 32 euro en valt binnen de geldige aantallen. Beide controles horen bij een volledig antwoord.','Hoe controleer je het antwoord in de oorspronkelijke formule?','Een juist rekenantwoord kan buiten het geldige bereik van de bron liggen; hier is dat niet zo.','Gebruik voor bron C de afstanden tussen posities.');
}
{
 const s=slide('Opgave 30f · De rechthoek',{target:true});
 plotArea(s,{x:60,y:268,w:700,h:475,left:2,right:8,bottom:4,top:8,maxX:10,maxY:9});
 text(s,'Basis = 8 − 2 = 6 m',880,249,650,75,42,{bold:true,color:C.blue});
 text(s,'Hoogte = 8 − 4 = 4 m',880,376,650,83,42,{bold:true});
 text(s,'Oppervlakte = basis × hoogte\n= 6 × 4\n= 24 m²',880,535,650,203,40,{bold:true,color:C.orange});
 notes(s,'36','Neem horizontaal het verschil 8 min 2 en verticaal 8 min 4. De rechthoek is 6 meter breed en 4 meter hoog. De oppervlakte is 24 vierkante meter. Wijs de gebruikte afstanden op de plattegrond aan.','Waarom is de hoogte niet 8 meter?','De vorm begint verticaal op 4 meter. Vermenigvuldig dus niet 6 met 8.','Gebruik voor de driehoek dezelfde afstanden.');
}
{
 const s=slide('Opgave 30g · De driehoek',{target:true});
 plotArea(s,{x:60,y:268,w:700,h:475,left:2,right:8,bottom:4,top:8,maxX:10,maxY:9,triangle:true});
 text(s,'Basis = 8 − 2 = 6 m',880,249,650,75,42,{bold:true,color:C.green});
 text(s,'Hoogte = 8 − 4 = 4 m',880,376,650,83,42,{bold:true});
 text(s,'Oppervlakte = ½ × basis × hoogte\n= ½ × 6 × 4\n= 12 m²',880,535,650,203,38,{bold:true,color:C.orange});
 notes(s,'36','De driehoek gebruikt dezelfde horizontale basis van 6 en dezelfde loodrechte hoogte van 4 als de rechthoek. Met de factor een half ontstaat 12 vierkante meter. Controle: het resultaat is de helft van 24.','Welke zijde staat loodrecht op de basis?','Gebruik niet de schuine zijde als hoogte.','Laat leerlingen ontbrekende stappen in hun eigen werk herstellen.');
}
{
 const s=slide('Antwoordcontrole bij opgave 30',{target:true});
 const items=[['a–c · Bron A','Schalen, eenheden, drie punten, tussenwaarde en juiste basis.'],['d–e · Bron B','Invullen, beide kanten gelijk bewerken en terug controleren.'],['f–g · Bron C','Afstanden als basis en hoogte, daarna oppervlakte in m².']];
 items.forEach((a,i)=>{const y=230+i*174;text(s,a[0],60,y,435,72,36,{bold:true,color:C.blue});text(s,a[1],540,y,990,125,37);});
 text(s,'Verbeter één ontbrekende stap of onjuiste uitleg in je eigen antwoord.',60,791,1480,48,31,{bold:true});
 notes(s,'36','Laat leerlingen hun uitwerking vergelijken met de volledige bespreking. Antwoorden: a (100;2), (70;5), (40;8); b 80 reserveringen per middag; c daling 30%; d 20 euro; e 12 lampjes met controle; f 24 m²; g 12 m². Vraag herstel van de berekening of verklaring, niet alleen het overschrijven van een eindgetal.','Welke stap voeg je nog toe?','Een getal zonder eenheid of gevraagde redenering is geen volledig antwoord.','Toon het identieke overzicht voor de agenda.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(BUILD+'/manifest.json',JSON.stringify({slides:manifest,overviewSlides,lessonCommit,assignment:{start:[22,23],basis:[24,25,26],independent:[27,28,29],target:30,homework:[24,25,26,27,28,29,30]},sourcePrintedPages:{start:32,basis:[32,33],independent:[34,35],target:36}},null,2));
await fs.writeFile(BUILD+'/geometry.json',JSON.stringify(geometry,null,2));
const draft=BUILD+'/candidate.pptx';await(await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(BUILD+'/presentation.json',JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:FINAL+'/'+stem+'.pptx',pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...Array.from(new Set(tables)).flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:[...new Set(tables)],requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:p.slides.items.length,overviewSlides,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
