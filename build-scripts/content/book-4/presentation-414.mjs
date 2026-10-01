// HOW TO ADAPT: derive the assignment and prerequisites from the current book.
// Keep teaching data separate from assigned work; preserve the shared overview.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
  PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const provenance=JSON.parse(await fs.readFile(path.join(HERE,'presentation-414.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('414');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',title='Winstmaximalisatie bij monopolie';
const source='https://github.com/meijer1973/4veco-lessen/blob/'+provenance.sourceCommit+'/edities/books34-v3/books/book-4/';
const slides=[],tables=[],charts=[],overviewSlides=[],graphContracts=[];
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,role='teaching'){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,t,60,40,1480,84,t.startsWith('Deze les:')?43:49,{bold:true});rule(s,60,146,1480);
 text(s,'§4.1.4 '+title+(role.startsWith('target')?' · Opgave 38 · Boekpagina 44':''),60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});
 slides.push({number:p.slides.items.length,title:t,role});return s;
}
function notes(s,page,explanation,question,pitfall,transition,authored=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, gedrukte boekpagina ${page}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.1/4.1.4%20manuscript.md\nAntwoordmodel: ${source}chapters/4.1/Antwoorden.md\n${authored?'Eigen onderwijsmodel Pigment Pura: context en getallen zijn voor deze uitleg gemaakt, niet uit het boek. Boekpagina’s onderbouwen alleen de methode.':''}`);
}
function example(s){text(s,'Pigment Pura · Uitlegvoorbeeld — niet uit het boek',60,177,1480,49,30,{bold:true,color:C.blue});}
function table(s,values,x,y,w,h,widths,size=32){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);
  cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:17,right:14,top:10,bottom:10}};
 }}tables.push(p.slides.items.length);return t;
}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 38.','Zet je huiswerk in je agenda.'];
const overviewData={goals:'Haalbare q kiezen en controleren.\nP op GO lezen, winst berekenen.\nDe grafische route uitleggen.',start:'Pagina 41 · Opgaven 31 en 32\n32: verkennen met theorie p. 37',homework:'§4.1.4 · Maken en nakijken\nBasis: 33, 34 en 35\nZelfstandig: 36 en 37\nDoelopgave: 38'};
function overview(phase,active){
 const s=slide('Deze les: §4.1.4 '+title,'overview');overviewSlides.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1480,39,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+(i+1)});text(s,r,116,ys[i],794,hs[i],30,{bold:active===i+1,color,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,568,45,35,{bold:true});text(s,overviewData.goals,972,244,568,122,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,568,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,overviewData.start,972,459,568,103,30,{name:'overview-start'});rule(s,972,580,568);
 text(s,'Huiswerk',972,610,568,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,overviewData.homework,972,669,568,165,30,{name:'overview-homework'});
 notes(s,'35–45',`Laat de dia staan tijdens ${phase.toLowerCase()}. Start 31–32 en basis 33 staan op p.41, basis 34–35 op p.42, zelfstandig 36–37 op p.43, doel 38 op p.44. Huiswerk is 33,34,35,36,37,38 maken en nakijken. Bonus 39 en herhaling 40 op p.45 zijn extra. Opgave 31 haalt TO/MO uit §4.1.3 en MK uit §3.2.2 op; de marginale vergelijking is onderwezen in §3.2.3. Bij 32 is GO=P bekend, maar de combinatie met het monopolie-optimum wordt vandaag expliciet gemaakt. Laat leerlingen de prijsroute op p.37 erbij nemen, het onderscheid tussen marginale en gemiddelde bedragen aanwijzen en hun twijfel noteren. Dit is ondersteund verkennen. Vóór het basiswerk laat je 32 opnieuw proberen en bespreek je waarom TK nog nodig is voor winst. Geen aanname dat eerder onderwezen ook al beheerst is. De volledige route kan doorlopen in een volgende les; twee lessen zijn een planningsadvies zonder praktijkmeting.`,'Welke stap kun je al, en waar twijfel je nog?','Gedrukte boekpagina’s gebruiken: de manuscriptmetadata noemt voor start 37 en voor doel 40, maar de complete PDF drukt 41 en 44 af.','Ga naar de volgende lesfase; bij afsluiting noteert iedereen het huiswerk.');
}
const E={name:'Pigment Pura',a:36,b:.30,c:.15,d:9,f:90,cap:50,q:30,xmax:50,ymax:40};
const T={name:'Korrels Nova',a:40,b:.25,c:.125,d:10,f:200,cap:80,q:40,xmax:80,ymax:40};
function graph(s,m,stage,{wide=false}={}){
 const pos={left:60,top:263,width:wide?1480:990,height:545};
 const series=[],pv=m.a-m.b*m.q,marg=m.a-2*m.b*m.q,gtk=(m.c*m.q*m.q+m.d*m.q+m.f)/m.q;
 const line=(name,x,y,color,style='solid',width=3)=>series.push({name,xValues:x,values:y,line:{fill:color,width,style},marker:{symbol:'none'}});
 const label=(name,x,y,color=C.ink,position='t',marker=false)=>{
  // Separate exact point markers from text anchors: the exporter does not retain
  // scatter label positions. Keep labels in whitespace without moving points.
  if(marker){series.push({name:'Punt '+name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'circle',size:8,fill:color,line:{fill:color,width:1}}});x+=m.xmax*.018;y+=name==='1'?-3:2.2;}
  if(name.startsWith('q = '))y=2.8;
  if(name.startsWith('P = '))y+=2.5;
  series.push({name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:'none'},dataLabelOverrides:[{idx:0,text:name,showValue:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}]});
 };
 const haveGO=stage!=='quantity';
 if(haveGO){line('GO = P',[0,m.xmax],[m.a,m.a-m.b*m.xmax],C.blue);label('GO = P',m.xmax*.25,m.a-m.b*m.xmax*.25+2.8,C.blue,'t');}
 if(stage!=='profit'){
  line('MO',[0,Math.min(m.xmax,m.a/(2*m.b))],[m.a,Math.max(0,m.a-2*m.b*m.xmax)],C.purple,'dashed');
  line('MK',[0,m.xmax],[m.d,2*m.c*m.xmax+m.d],C.orange);
  label('MO',m.xmax*.69,m.a-2*m.b*m.xmax*.69-2.8,C.purple,'b');
  label('MK',m.xmax*.83,2*m.c*m.xmax*.83+m.d+(m.name==='Pigment Pura'?-3.5:3),C.orange,'b');
 }
 if(['quantity','price','answer-quantity','answer-price'].includes(stage)){
  line('Hulplijn q',[m.q,m.q],[0,marg],C.muted,'dashed',2);
  label('1',m.q,marg,C.ink,'l',true);label('q = '+m.q,m.q,0,C.ink,'t');
 }
 if(['price','answer-price'].includes(stage)){
  line('Van MO/MK naar GO',[m.q,m.q],[marg,pv],C.blue,'dashed',2);
  line('Hulplijn P',[0,m.q],[pv,pv],C.blue,'dashed',2);
  label('2',m.q,pv,C.ink,'r',true);label('P = '+pv,0,pv,C.blue,'r');
 }
 if(stage==='profit'){
  const xs=Array.from({length:46},(_,i)=>i+5),ys=xs.map(q=>m.c*q+m.d+m.f/q);
  line('GTK',xs,ys,C.orange);label('GTK',43,m.c*43+m.d+m.f/43-3,C.orange,'b');
  line('Winstrechthoek',[0,m.q,m.q,0,0],[gtk,gtk,pv,pv,gtk],C.green,'solid',4);
  label('winst',m.q*.43,(pv+gtk)/2,C.green);label('q = '+m.q,m.q,0,C.ink,'t');
  line('Hulplijn gekozen q',[m.q,m.q],[0,gtk],C.muted,'dashed',2);
 }
 for(const ser of series){ser.xValues=ser.xValues.map(v=>+v.toFixed(6));ser.values=ser.values.map(v=>+v.toFixed(6));}
 const ch=s.charts.add('scatter',{position:pos,series,scatterOptions:{style:'line'},hasLegend:false,
  xAxis:{min:0,max:m.xmax,majorUnit:10,numberFormatCode:'0',title:{text:'q (kg per week)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
  yAxis:{min:0,max:m.ymax,majorUnit:10,numberFormatCode:'0',title:{text:'Bedrag (€ per kg)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphContracts.push({slide:p.slides.items.length,model:m,stage,series});return ch;
}
function target(t,role='target-answer'){return slide(t,role);}
overview('Startopdracht',2);
{
 const s=slide('De prijsroute bij een monopolist');
 table(s,[['Stap','Prijsnemer: bekend','Monopolist: vandaag'],['Hoeveelheid kiezen','MO = MK, dan controleren','MO = MK, dan controleren'],['Verkoopprijs vinden','Gegeven marktprijs\nP = GO = MO','P aflezen op GO\nbij de gekozen q'],['Winst berekenen','TO − TK','TO − TK']],60,221,1480,422,[360,560,560],32);
 text(s,'Hoeveelheid, verkoopprijs en winst zijn drie verschillende uitkomsten.',60,717,1480,111,40,{bold:true,color:C.blue});
 notes(s,'35–38','Activeer de marginale keuze uit §3.2.3. Die regel blijft bruikbaar. Nieuw is de extra stap naar GO, omdat MO bij uniforme monopolieprijzen onder P ligt. Laat de leerling de gekozen q vasthouden wanneer hij de prijs leest. Controleer het verloop, de capaciteit en waar nodig q=0. Het snijpunt is eerst een kandidaat.','Welke lijn vertelt wat de kopers betalen?','De prijsnemersregel P=MK rechtstreeks overnemen geeft hier een verkeerde afzet.','Gebruik een afzonderlijk voorbeeld om elke stap te laten zien.');
}
{
 const s=slide('Een verkoopplan voor Pigment Pura');example(s);
 text(s,'Pura is de enige aanbieder van een specifiek pigment.',60,259,1480,62,38,{bold:true});
 text(s,'P = 36 − 0,30q',60,378,1480,71,49,{bold:true,color:C.blue});
 text(s,'TK = 0,15q² + 9q + 90',60,484,1480,74,49,{bold:true,color:C.orange});
 text(s,'q: kg per week · P: € per kg · TK: € per week',60,607,1480,59,34);
 text(s,'Capaciteit: 50 kg per week. Alle kg hebben dezelfde prijs.\nDe € 90 blijft deze week verschuldigd, ook bij q = 0.',60,706,1480,121,35);
 notes(s,'35–40','Eigen fictief model, geen boekopgave. Kilogrammen zijn deelbaar en alle geproduceerde kg worden verkocht. We vergelijken plannen voor dezelfde week; bij elk plan geldt één prijs. De capaciteit is 50 kg en de 90 euro is onvermijdbaar. Onderzoek achtereenvolgens marginale functies, afzet, prijs en winst.','Waarom kun je niet tegelijk méér verkopen en dezelfde prijs houden?','Deze getallen horen niet bij opgaven 31–38. Neem ze niet over in het huiswerk.','Stel TO op en differentieer de totalen.',true);
}
{
 const s=slide('Van totale naar marginale bedragen');example(s);
 text(s,'TO = P × q = (36 − 0,30q) × q = 36q − 0,30q²',60,255,1480,78,42,{bold:true,color:C.blue});
 table(s,[['Totaal (€ per week)','Afgeleide (€ per kg)'],['TO = 36q − 0,30q²','MO = 36 − 0,60q'],['TK = 0,15q² + 9q + 90','MK = 0,30q + 9']],60,379,1480,270,[805,675],37);
 text(s,'q²-term: coëfficiënt × 2, dan q.\nEen constant bedrag draagt 0 bij aan de afgeleide.',60,708,1480,118,37,{bold:true});
 notes(s,'36, 40','Haal §3.2.2 term voor term op: 36q wordt36, −0,30q² wordt−0,60q, 0,15q² wordt0,30q, 9q wordt9, 90 wordt0. TO ontstaat door de volledige vraagfunctie met q te vermenigvuldigen. MO is een puntwaarde bij een kleine uitbreiding, geen totaal of tabelstap. De vaste kosten verdwijnen alleen uit MK.','Waarom staat de €90 nog wel in TK, maar niet in MK?','Niet alleen P differentiëren: begin met TO=P×q. Vergeet het minteken niet.','Vergelijk MO en MK om een kandidaat te vinden.',true);
}
{
 const s=slide('De kandidaat én de controle');example(s);
 text(s,'36 − 0,60q = 0,30q + 9',60,254,1480,69,47,{bold:true});
 text(s,'27 = 0,90q        q = 30 kg per week',60,346,1480,74,47,{bold:true,color:C.blue});
 table(s,[['q (kg per week)','MO (€ per kg)','MK (€ per kg)','Kleine uitbreiding'],['20','24','15','Winst stijgt'],['40','12','21','Winst daalt']],60,457,1480,249,[405,300,300,475],31);
 text(s,'MO daalt, MK stijgt. 30 kg past binnen de capaciteit van 50 kg.',60,758,1480,69,37,{bold:true});
 notes(s,'36, 40','Los eerst de vergelijking op. Daarna geeft het verloop het bewijs: MO−MK=27−0,90q is positief vóór30 en negatief erna. De tabel controleert twee punten. q30 is niet negatief en ligt onder50. De vergelijking met q0 volgt bij de winstberekening.','Waarom is alleen MO=MK opschrijven nog niet genoeg?','Het teken van MO−MK geeft de richting van winst, niet het winstbedrag.','Markeer de afzet in een grafiek.',true);
}
{
 const s=slide('Het snijpunt bepaalt de hoeveelheid');example(s);graph(s,E,'quantity');
 text(s,'1  MO = MK',1090,293,450,70,41,{bold:true});
 text(s,'q = 30 kg\nper week',1090,401,450,123,43,{bold:true,color:C.blue});
 text(s,'Het snijpuntbedrag:\n€ 18 per kg\nvoor MO en MK',1090,614,450,171,35);
 notes(s,'36','De assen geven kg per week en euro per kg. MO daalt en MK stijgt. Wijs het snijpunt (30;18) aan en volg de verticale hulplijn naar q30. De y-waarde18 is een marginaal bedrag. De volgende dia houdt assen en schaal gelijk.','Welke coördinaat geeft de hoeveelheid?','De €18 is hier nog niet de verkoopprijs.','Voeg GO toe en blijf bij dezelfde q.',true);
}
{
 const s=slide('Dezelfde hoeveelheid, de prijs op GO');example(s);graph(s,E,'price');
 text(s,'2  P op GO',1090,293,450,70,41,{bold:true,color:C.blue});
 text(s,'P = 36 − 0,30 × 30\n= € 27 per kg',1090,413,450,134,36,{bold:true});
 text(s,'Controle in de vraag:\n27 = 36 − 0,30q\ngeeft q = 30.',1090,647,450,161,33);
 notes(s,'37','Houd q30 vast. Ga vanuit punt1 omhoog tot punt2 op GO en lees horizontaal27 af. De consument betaalt27. MO en MK zijn18. Prijs en afzet zijn één combinatie op de vraaglijn. De uniforme prijsverlaging raakt alle kg en verklaart waarom MO lager ligt.','Waarom gebruik je voor de prijs niet het MO/MK-snijpunt?','De monopolist kan niet q30 kiezen en vervolgens een willekeurige prijs vragen.','Gebruik de verkoopprijs in TO.',true);
}
{
 const s=slide('De winst in euro per week');example(s);
 text(s,'q = 30 kg per week, P = € 27 per kg',60,258,1480,68,42,{bold:true,color:C.blue});
 table(s,[['Grootheid','Berekening','€ per week'],['TO','27 × 30','810'],['TK','0,15 × 30² + 9 × 30 + 90','495'],['Winst','810 − 495','315']],60,377,1480,325,[270,870,340],34);
 text(s,'Bij q = 0: TO = 0 en TK = 90. Winst = −€ 90 per week.',60,755,1480,73,36,{bold:true});
 notes(s,'38–40','Bereken eerst30²=900. TK=135+270+90=495. TO810 minTK495 geeft315 per week. Bij q0 blijven de vaste kosten90 bestaan. Produceren geeft een beter resultaat dan−90. Dit is de beschreven week, geen langetermijnbeslissing over sluiting.','Waar komen de constante kosten terug?','Winst is geen euro per kg. MO−MK=0 betekent niet dat de winst nul is.','Vertaal totale winst naar een oppervlakte.',true);
}
{
 const s=slide('Winst per kg maal het aantal kg');example(s);graph(s,E,'profit');
 text(s,'GTK = 495 / 30\n= € 16,50 per kg',1090,274,450,125,35,{bold:true});
 text(s,'Hoogte: 27 − 16,50\n= € 10,50 per kg\nBreedte: 30 kg per week',1090,455,450,166,32);
 text(s,'Winst = 10,50 × 30\n= € 315 per week',1090,702,450,115,35,{bold:true,color:C.green});
 notes(s,'38','De groene rechthoek loopt van0 tot30 kg en vanGTK(30)=16,5 totP27. De getekende GTK-lijn is0,15q+9+90/q, alleen bijq>0. De rechthoek gebruikt het GTK-bedrag bij de gekozen q, niet de hele kromme als grens. Euro per kg maal kg per week geeft euro per week. Bij grafieken van TO en TK als totalen zou winst een verticale afstand zijn.','Waarom gebruiken we GTK en niet MK als onderrand?','De groene oppervlakte is winst, geen consumentensurplus of welvaartsverlies.','Onderzoek nu wat een lagere capaciteit verandert.',true);
}
{
 const s=slide('Een capaciteit vóór het snijpunt');example(s);
 text(s,'Nieuwe situatie: Pura kan maximaal 20 kg per week maken.',60,260,1480,95,41,{bold:true});
 text(s,'Kandidaat q = 30 is onhaalbaar.\nBij q = 20: MO = 24 > MK = 15.',60,391,1480,139,42,{bold:true,color:C.blue});
 text(s,'De winst stijgt tot de grens. Kies q = 20 kg per week.',60,563,1480,66,39);
 text(s,'P = 36 − 0,30 × 20 = € 30 per kg\nTO = 600, TK = 330, winst = € 270 per week',60,674,1480,133,37,{bold:true});
 notes(s,'39','Reset alleen de capaciteit naar20; vraag en kosten blijven gelijk. MO−MK is positief op0 tot20, dus de beste haalbare afzet is20. TK=0,15×400+180+90=330. Winst270 is beter dan−90 bijq0. Na de haalbaarheidskeuze moet P opnieuw bij de werkelijke q worden berekend.','Waarom hoort de oude prijs27 niet bij het nieuwe plan?','Een capaciteitsgrens is geen nieuwe vraaglijn en het is geen afrondingsprobleem.','Zet de capaciteit terug op50 voor de volgende vergelijking.',true);
}
{
 const s=slide('Alleen de constante kosten veranderen');example(s);
 text(s,'Terug naar capaciteit 50 kg. Alleen € 90 wordt € 240.',60,260,1480,92,40,{bold:true});
 text(s,'MK blijft 0,30q + 9',60,397,1480,76,48,{bold:true,color:C.orange});
 text(s,'q blijft 30 kg per week. P blijft € 27 per kg.',60,523,1480,83,41,{bold:true});
 text(s,'De winst daalt met € 150:\n€ 315 − € 150 = € 165 per week',60,671,1480,132,43,{bold:true,color:C.green});
 notes(s,'38–39, 42','Reset naar de oorspronkelijke Pura-context, met alleen hogere vaste kosten. Omdat deze in de week bij alle q onvermijdbaar zijn, verandert de marginale vergelijking niet. Vergelijk metq0:−240. Een nog grotere stijging kan de maximale winst negatief maken zonder de beste q te veranderen.','Welke kosten veranderen de marginale productieafweging?','Hogere totale kosten betekenen niet automatisch een hogere MK of een lagere q.','Bekijk nu afzonderlijk een verandering van de vraag.',true);
}
{
 const s=slide('Een grotere vraag verandert MO');example(s);
 text(s,'Opnieuw het beginmodel: TK = 0,15q² + 9q + 90, capaciteit 50.',60,255,1480,86,35,{bold:true});
 text(s,'Nieuwe vraag: P = 45 − 0,30q',60,378,1480,70,43,{bold:true,color:C.blue});
 text(s,'TO = 45q − 0,30q², dus MO = 45 − 0,60q\n45 − 0,60q = 0,30q + 9 geeft q = 40',60,482,1480,148,39);
 text(s,'P = 45 − 0,30 × 40 = € 33 per kg',60,684,1480,80,44,{bold:true,color:C.blue});
 text(s,'Ook bij hogere vaste kosten blijft deze marginale vergelijking gelijk.',60,791,1480,43,30);
 notes(s,'36–40, 42','Start weer met de oorspronkelijke vaste kosten90 en capaciteit50. De nieuwe vraag geeft een hogere MO. De kandidaat40 past binnen50; MO−MK=36−0,90q is positief vóór40 en negatief erna. Prijs33 hoort bij de nieuwe vraag. Met zowel deze vraag als vaste kosten240 blijven q40 enP33 gelden. De winst is dan1320−(240+360+240)=480. Dit maakt afzonderlijke veranderingen eerst en daarna samen onderzoeken expliciet, zoals nodig voor35.','Welke functie verandert als er meer belangstelling is?','Verwar een verandering van de vraag niet met alleen een ander vast kostenbedrag.','Keer terug naar start32 en begin dan met de basisopgaven.',true);
}
overview('Zelfstandig werken',4);
{
 const s=target('Opgave 38 · Korrels Nova','target-context');
 text(s,'Nova is de enige aanbieder van een specifiek materiaal.',60,205,1480,89,41,{bold:true});
 text(s,'P = 40 − 0,25q\nTK = 0,125q² + 10q + 200',60,328,1480,160,49,{bold:true,color:C.blue});
 text(s,'q: kg per week · P: € per kg · TK: € per week',60,550,1480,60,35);
 text(s,'Capaciteit: 80 kg. De € 200 is ook bij q = 0 onvermijdbaar.\nDe hoeveelheden zijn deelbaar. Iedere kg heeft binnen een\nverkoopplan dezelfde prijs.',60,667,1480,166,36);
 notes(s,'44','Dit is de volledige bron van doeloefening38, na de eigen poging van leerlingen. Gebruik de bron en figuur20. De volgende dia toont de onverwerkte figuur; daarna volgen alle deelvragen zonder oplossing.','Welke aannames begrenzen de berekening?','Pura is afgesloten. Gebruik nu uitsluitend de gegevens van Nova.','Toon figuur20 zonder hulplijnen of antwoorden.');
}
{
 const s=target('Opgave 38 · Figuur 20','target-context');graph(s,T,'question',{wide:true});
 text(s,'Gebruik deze grafiek bij de bron en de deelvragen.',60,185,1480,55,35,{bold:true});
 notes(s,'44','Figuur20 is als bewerkbare XY-grafiek overgenomen: q0–80, bedrag0–40, GO=40−0,25q, MO=40−0,50q enMK=0,25q+10. De lijnen staan al in het boek. Leerlingen voegen later alleen de gevraagde route en labels toe. Er zijn hier nog geen oplossingshulplijnen.','Welke drie lijnen staan al gegeven?','Een punt waar GO en MK elkaar snijden is niet automatisch het winstmaximum.','Lees eerst de deelvragena–c en daarna d–f.');
}
{
 const s=target('Opgave 38 · Deelvragen a, b en c','target-question');
 text(s,'a. (2p) Stel TO, MO en MK op.',60,209,1480,91,42,{bold:true});rule(s,60,342,1480);
 text(s,'b. (3p) Bereken de winstmaximale haalbare q.\nControleer het verloop van MO tegenover MK en de capaciteit.',60,391,1480,156,40);rule(s,60,594,1480);
 text(s,'c. (1p) Bereken de bijbehorende verkoopprijs.',60,659,1480,122,41,{bold:true});
 notes(s,'44','De eerste drie vragen zijn volledig overgenomen. Laat nog geen antwoorden zien. Bron en figuur staan op de twee voorafgaande dia’s en in het boek.','Welke controle hoort uitdrukkelijk bij vraagb?','Vraagb vraagt meer dan een vergelijking oplossen.','Toon ook de drie resterende deelvragen.');
}
{
 const s=target('Opgave 38 · Deelvragen d, e en f','target-question');
 text(s,'d. (3p) Bereken TO, TK, winst en GTK.\nControleer ook de uitkomst bij q = 0.',60,195,1480,131,40);rule(s,60,356,1480);
 text(s,'e. (2p) Markeer in de grafiek de gekozen q en P.\nMaak met hulplijnen zichtbaar hoe je van MO = MK\nnaar de verkoopprijs gaat.',60,393,1480,171,40);rule(s,60,594,1480);
 text(s,'f. (2p) Een leerling gebruikt P = MK en vindt q = 60.\nLeg uit waarom dit niet de juiste winstkeuze is.\nGebruik de marginale bedragen bij q = 60.',60,634,1480,184,40);
 notes(s,'44','Nu zijn alle zes vragen beschikbaar zonder oplossingen. Geef gelegenheid om de eigen berekeningen te vergelijken met wat precies gevraagd wordt. De q60 in vraagf hoort bij de beschreven foutmethode, niet bij ons antwoord.','Welke twee verschillende soorten eurobedragen vraagt d?','Alleen een eindgetal voldoet niet aan de vragen over onderbouwing en hulplijnen.','Begin de uitwerking bij TO, MO en MK.');
}
{
 const s=target('Opgave 38a · TO, MO en MK');
 text(s,'TO = (40 − 0,25q) × q = 40q − 0,25q²',60,208,1480,87,46,{bold:true,color:C.blue});
 text(s,'MO = 40 − 0,50q',60,353,1480,88,49,{bold:true,color:C.purple});rule(s,60,478,1480);
 text(s,'TK = 0,125q² + 10q + 200',60,528,1480,78,43);
 text(s,'MK = 0,25q + 10',60,660,1480,78,49,{bold:true,color:C.orange});
 text(s,'TO en TK: € per week. MO en MK: € per kg.',60,783,1480,47,33);
 notes(s,'44','Modelantwoorda: TO40q−0,25q²; MO40−0,50q; MK0,25q+10. Laat alle termen zien: 2×0,125q=0,25q,10q geeft10 en200 geeft0.','Waarom wordt de helling van MO −0,50?','De constante kosten200 verdwijnen niet uit TK.','Stel MO gelijk aan MK.');
}
{
 const s=target('Opgave 38b · De kandidaat-afzet');
 text(s,'MO = MK',60,207,1480,69,42,{bold:true});
 text(s,'40 − 0,50q = 0,25q + 10',60,330,1480,80,51,{bold:true});
 text(s,'30 = 0,75q',60,486,1480,79,51);
 text(s,'q = 40 kg per week',60,643,1480,93,57,{bold:true,color:C.blue});
 notes(s,'44','Breng de q-termen naar rechts en de constanten naar links:40−10=0,25q+0,50q. Deel30 door0,75. Deze kandidaat moet nog gecontroleerd worden.','Welke stap voorkomt een tekenfout?','Het gelijkstellen van P aan MK hoort niet bij deze berekening.','Controleer richting en capaciteit.');
}
{
 const s=target('Opgave 38b · Waarom is dit een maximum?');
 table(s,[['q (kg per week)','MO (€ per kg)','MK (€ per kg)','Bij kleine uitbreiding'],['20','30','15','Winst stijgt'],['40','20','20','Omslagpunt'],['60','10','25','Winst daalt']],60,221,1480,351,[405,300,300,475],31);
 text(s,'MO daalt en MK stijgt: de winst stijgt vóór 40 en daalt erna.',60,637,1480,96,39,{bold:true});
 text(s,'Haalbaar: 0 ≤ 40 ≤ 80 kg per week.',60,770,1480,58,41,{bold:true,color:C.blue});
 notes(s,'44','Dit is het volledige b-antwoord uit het model. MO−MK=30−0,75q verandert van positief naar negatief bij40. De gekozen40 ligt binnen de capaciteit80. De q0-controle volgt bijd.','Waarom kunnen de twee controlepunten samen met het lijnverloop het maximum onderbouwen?','Niet ieder willekeurig snijpunt geeft zonder controle een maximum.','Lees de verkoopprijs bij deze q.');
}
{
 const s=target('Opgave 38c · De verkoopprijs');
 text(s,'q = 40 kg per week',60,207,1480,78,45,{bold:true});
 text(s,'P = 40 − 0,25 × 40',60,369,1480,85,51,{bold:true,color:C.blue});
 text(s,'P = € 30 per kg',60,529,1480,98,58,{bold:true,color:C.blue});
 text(s,'Bij dezelfde q zijn MO en MK € 20 per kg.',60,735,1480,83,41);
 notes(s,'44','Modelantwoordc is30 euro per kg. Dit volgt uit GO, niet uit de marginale opbrengst20. Invullen in de vraag controleert de combinatie40kg en30euro.','Wat betaalt een koper per kg?','De y-waarde20 van het snijpunt is niet de verkoopprijs.','Bereken de totale bedragen met P30 en q40.');
}
{
 const s=target('Opgave 38d · Totale opbrengst, kosten en winst');
 table(s,[['Grootheid','Invullen','€ per week'],['TO','30 × 40','1.200'],['TK','0,125 × 40² + 10 × 40 + 200','800'],['Winst','1.200 − 800','400']],60,221,1480,378,[280,860,340],34);
 text(s,'TK = 200 + 400 + 200 = € 800 per week',60,660,1480,73,43,{bold:true,color:C.orange});
 text(s,'Ook de onvermijdbare constante kosten tellen mee.',60,781,1480,49,35);
 notes(s,'44','Modelantwoordd eerste deel: TO1200, TK800, winst400. Eerst40²=1600, dan maal0,125=200. Variabele lineaire kosten zijn400; vaste kosten200. Gebruik P30 en niet MO20 in TO.','Welke drie termen tellen op tot TK?','Een juist winstbedrag zonder eenheid of berekening is onvolledig.','Bereken GTK en controleer niet produceren.');
}
{
 const s=target('Opgave 38d · GTK en niet produceren');
 text(s,'GTK = TK / q = 800 / 40 = € 20 per kg',60,211,1480,98,46,{bold:true});
 text(s,'Controle: (P − GTK) × q\n= (30 − 20) × 40 = € 400 per week',60,362,1480,149,43,{bold:true,color:C.green});rule(s,60,558,1480);
 text(s,'Bij q = 0: TO = 0 en TK = € 200 per week.\nWinst = −€ 200 per week.',60,608,1480,135,40);
 text(s,'€ 400 is beter dan −€ 200. Niet produceren is niet beter.',60,781,1480,52,36,{bold:true});
 notes(s,'44','Tweede deel van d: GTK800/40=20perkg. Controle met winst perkg10 maal40 bevestigt400perweek. GTK en MO hebben toevallig allebei de waarde20, maar een andere betekenis. Bijq0 is GTK ongedefinieerd; totale winst is wel te berekenen en is−200.','Waarom is winst bij q0 niet nul?','GTK20 is niet altijd gelijk aan MK20. Hier vallen de waarden toevallig samen.','Laat de grafische route nu in twee stappen zien.');
}
{
 const s=target('Opgave 38e · Eerst de gekozen q');graph(s,T,'answer-quantity');
 text(s,'1  MO = MK',1090,293,450,70,41,{bold:true});
 text(s,'Snijpunt:\n(40; 20)',1090,407,450,118,41);
 text(s,'Hulplijn naar\nq = 40 kg per week',1090,637,450,141,36,{bold:true,color:C.blue});
 notes(s,'44','Markeer het snijpunt van MO en MK bij(40;20). Trek een verticale hulplijn naar de horizontale as. De q-label40 hoort bij die hulplijn. GO blijft al zichtbaar, zoals in figuur20.','Wat lees je op de horizontale as af?','Lees niet de20 op de verticale as als verkoopprijs.','Ga bij q40 naar de GO-lijn.');
}
{
 const s=target('Opgave 38e · Daarna de prijs op GO');graph(s,T,'answer-price');
 text(s,'2  GO geeft P',1090,293,450,70,41,{bold:true,color:C.blue});
 text(s,'Zelfde q = 40\nP = € 30 per kg',1090,410,450,129,41,{bold:true});
 text(s,'Eerst verticaal naar GO,\ndan horizontaal naar\nde prijsas.',1090,643,450,148,34);
 notes(s,'44','Volledige routee: MO/MK-snijpunt naarq40; bij dezelfde40 omhoog tot GO op30; horizontale hulplijn naar de bedrag-as. Punten1 en2 zijn verschillende punten bij dezelfde hoeveelheid. Vergelijk met de eigen tekening van de leerling.','Welke hulplijn ontbrak nog in je eigen figuur?','Verplaats q niet naar het GO/MK-snijpunt bij60.','Onderzoek nu de foutmethode bijq60.');
}
{
 const s=target('Opgave 38f · Waarom P = MK hier niet werkt');
 table(s,[['Bij q = 60 kg per week','Invullen','€ per kg'],['P','40 − 0,25 × 60','25'],['MK','0,25 × 60 + 10','25'],['MO','40 − 0,50 × 60','10']],60,214,1480,355,[600,560,320],33);
 text(s,'MO < MK: iets minder produceren verhoogt de winst.',60,630,1480,99,42,{bold:true,color:C.orange});
 text(s,'Extra controle: winst bij 60 kg = 1.500 − 1.250 = € 250 per week.\nDat is lager dan € 400 bij 40 kg.',60,751,1480,87,31);
 notes(s,'44','Modelantwoordf: P25 enMK25, maarMO10. Bij een kleine vermindering bespaar je meer kosten dan je opbrengst misloopt; de winst stijgt. De marginale bedragen leveren de gevraagde weerlegging. Aanvullende totale controle: TO25×60=1500, TK0,125×3600+600+200=1250, winst250. Dat is lager dan400.','Welke vergelijking geeft hier de richting van winst?','P=MK is de prijsnemersregel alleen omdat daar P=MO. Bij deze monopolist ontbreekt die gelijkheid.','Verbeter een fout in je eigen antwoord en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'slides.json'),JSON.stringify({slides,overviewSlides,nativeTableSlides:tables,nativeChartSlides:charts,graphContracts},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft],{stdio:'inherit'});
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft],{stdio:'inherit'});
const referencePath=path.resolve(HERE,'../../../../4veco-lessen','Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/bronnen/H1/paragrafen/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – presentatie.pptx');
const referenceSha256=createHash('sha256').update(await fs.readFile(referencePath)).digest('hex');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.1.4 '+title+' – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'reference',families:[FONT],referencePath,referenceSha256},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
