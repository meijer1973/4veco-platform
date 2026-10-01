// HOW TO ADAPT: edit the paragraph manifest, lesson text and model objects together.
// Supply the installed runtime via environment variables; use a fresh workspace.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('434');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial',tables=[],charts=[],slides=[],graphs=[],overviews=[];
const BASE='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/books/book-4/';
const E={name:'Reparatiewerkplaatsen',d:150,b:5,a:-30,c:5,lo:6,hi:30,eq:18,q:60,floor:20,qv:50,qa:70,h:24,xmax:120,ymax:32,xstep:20,ystep:4};
const T={name:'Sorteercentra',d:220,b:10,a:-20,c:10,lo:2,hi:22,eq:12,q:100,floor:14,qv:80,qa:120,h:25,xmax:220,ymax:24,xstep:40,ystep:4};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,kind='instruction'){
 const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,'§4.3.4 Minimumloon'+(kind.startsWith('target')?' · Opgave 34 · Boekpagina 147':''),60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,kind});return s;
}
function notes(s,page,explain,question,pitfall,transition,{example=false,extra=''}={}){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explain}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, gedrukte boekpagina ${page}. ${BASE}output/Boek_4_Compleet_v3.pdf\nManuscript en antwoordmodel: ${BASE}chapters/4.3/4.3.4%20manuscript.md ; ${BASE}chapters/4.3/Antwoorden.md\n${example?'Uitlegvoorbeeld — niet uit het boek. Reparatiewerkplaatsen, functies, 24 uur en bedragen zijn zelf gekozen onderwijsgegevens. De boekpagina onderbouwt uitsluitend de methode. ':''}${extra}`);
}
function table(s,v,x=60,y=230,w=1480,h=360,widths,size=33){
 const t=s.tables.add({rows:v.length,columns:v[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values:v});t.borders.assign({fill:C.line,width:1,style:'solid'});
 v.forEach((r,i)=>{t.rows[i].height=h/v.length;r.forEach((_,j)=>{const z=t.getCell(i,j);z.fill=i===0?C.ink:(i%2?C.paper:C.pale);z.text.style={typeface:FONT,fontSize:size,color:i===0?'#FFFFFF':C.ink,bold:i===0,verticalAlignment:'middle',insets:{left:17,right:15,top:10,bottom:10}};});});tables.push(p.slides.items.length);return t;
}
function tag(s){text(s,'Uitlegvoorbeeld — niet uit het boek',60,174,1480,42,28,{color:C.blue,bold:true});}
function lines(s,rows,{y=265,gap=135,size=43}={}){rows.forEach((r,i)=>text(s,r,60,y+i*gap,1480,gap-15,size,{bold:i===rows.length-1,color:i===rows.length-1?C.blue:C.ink}));}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 34.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §4.3.4 Minimumloon','overview');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Bindendheid bepalen. Werk en\nloonsom berekenen. Gevolgen\nvoor groepen verklaren.',972,244,565,122,31,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 145 · Opgaven 28 en 29\n29: verkennen, theorie p. 143',972,459,565,95,30,{bold:active===2,name:'overview-start'});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.3.4 Minimumloon\nBasis: 30 en 31\nZelfstandig: 32 en 33\nDoelopgave: 34\nMaken en nakijken',972,654,565,178,30,{bold:active===7,name:'overview-homework'});
 notes(s,'141–147',`Laat dit overzicht staan tijdens ${phase.toLowerCase()}. Start 28–29: p. 145; basis 30: p. 145 en 31: p. 146; zelfstandig 32–33: p. 146; doel 34: p. 147. Huiswerk is 30, 31, 32, 33 en 34 maken en nakijken. Bonus 35 en herhaling 36 zijn extra.\n\n28 haalt de minimumprijs zonder opkoop terug uit §3.1.5, uitleg ‘Begin zonder aankoopgarantie’. Bij 29 is personen maal uren bekend uit §4.3.1, maar de loonsom is hier een nieuwe combinatie. Laat de definitie en formule op p. 143 lezen, eenheden onderstrepen en eerst betaalde uren bepalen. Geen antwoord vooraf geven. Keer bij het overzicht vóór basiswerk terug naar 29: laat leerlingen hun opzet en eenheid verbeteren na de uitleg.\n\nDe docentbron adviseert voorlopig twee lessen van 55 minuten; dit is niet gemeten. Laat huiswerk of een vervolg de route afronden; schrap geen basiswerk.`, 'Welke stap kun je al, en bij welke stap helpt p. 143?', 'Gebruik complete-boekpagina’s, niet de lokale hoofdstukpagina’s 33–35.',active===7?'Laat het huiswerk noteren.':'Ga naar de volgende lesfase.',{extra:'Alleen voor feedback na eigen poging: 28: 60 producten verkocht, 40 overschot per week. 29: 15 × 20 × 50 = € 15.000 per week.'});
}
function ser(name,pts,color,width=4,style='solid'){return {name,xValues:pts.map(a=>a[0]),values:pts.map(a=>a[1]),line:{fill:color,width,style},marker:{symbol:'none'}};}
function label(name,x,y,color=C.ink,pos='t',dot=false){return {name,xValues:[x],values:[y],line:{fill:'none',width:0},marker:{symbol:dot?'circle':'none',size:8,fill:color,line:{fill:color,width:1}},dataLabelOverrides:[{idx:0,text:name,position:({t:'top',b:'bottom',r:'right',l:'left'})[pos]||pos,showValue:false,textStyle:{typeface:FONT,fontSize:26,fill:color,bold:true}}]};}
function graph(s,m,mode){
 const ss=[ser('Lᵥ',[[m.d-m.b*m.hi,m.hi],[m.d-m.b*m.lo,m.lo]],C.blue),ser('Lₐ',[[m.a+m.c*m.lo,m.lo],[m.a+m.c*m.hi,m.hi]],C.green)];
 ss.push(label('Lᵥ',m.d-m.b*(m.hi-2),m.hi-2,C.blue,'t'),label('Lₐ',m.a+m.c*(m.hi-2),m.hi-2,C.green,'t'));
 if(mode==='free'||mode==='nonbinding'){
  ss.push(ser('Evenwichtsloon',[[0,m.eq],[m.q,m.eq]],C.muted,2,'dashed'),ser('Evenwichtshoeveelheid',[[m.q,0],[m.q,m.eq]],C.muted,2,'dashed'),label('E',m.q,m.eq,C.ink,'t',true));
 }
 if(mode==='nonbinding')ss.push(ser('Minimum € 16',[[0,16],[m.xmax,16]],C.orange,3,'dashed'),label('minimum = 16',m.xmax-15,16,C.orange,'t'));
 if(mode==='floor'){
  ss.push(ser('Loonvloer',[[0,m.floor],[m.xmax,m.floor]],C.orange,3,'dashed'),ser('Gevraagde personen',[[m.qv,0],[m.qv,m.floor]],C.blue,2,'dashed'),ser('Aangeboden personen',[[m.qa,0],[m.qa,m.floor]],C.green,2,'dashed'));
  ss.push(label('w = '+m.floor,m.xmax*.86,m.floor,C.orange,'t'),label(String(m.qv),m.qv,0,C.blue,'t'),label(String(m.qa),m.qa,0,C.green,'t'));
  ss.push(ser('Aanbodoverschot',[[m.qv,m.floor],[m.qa,m.floor]],C.orange,7));
 }
 const ch=s.charts.add('scatter',{position:{left:60,top:242,width:1060,height:560},series:ss,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false},xAxis:{min:0,max:m.xmax,majorUnit:m.xstep,numberFormatCode:'0',title:{text:'L (personen)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:m.ymax,majorUnit:m.ystep,numberFormatCode:'0',title:{text:'w (€ per uur)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:1},line:{fill:C.ink,width:1.5}},chartFill:C.paper,plotAreaFill:C.paper});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,mode,series:ss.map(({name,xValues,values})=>({name,xValues,values}))});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 const rows=[['Bindendheid','Vergelijk de loonvloer met het vrije evenwichtsloon.'],['Betaald werk','Bereken vraag, aanbod, werkgelegenheid en overschot.'],['Loonsom','Reken personen om naar betaalde uren per week.'],['Verdeling','Verklaar wie een hoger inkomen krijgt en wie niet.']];
 rows.forEach((a,i)=>{text(s,a[0],60,212+i*145,470,65,38,{bold:true,color:C.blue});text(s,a[1],560,212+i*145,980,110,36);});
 notes(s,'141–144','Deze doelen komen samen in opgave 34. Het uurloon zegt nog niet hoeveel werk of loon alle werknemers samen krijgen. Alle loonbedragen in deze les zijn fictief.','Is een hoger uurloon genoeg om het totale loon te kennen?','We onderzoeken een model, geen actuele wettelijke tarieven.','Haal eerst de bekende minimumprijsprocedure op.');
}
{
 const s=slide('Minimumprijs en minimumloon');
 table(s,[['Bekende goederenmarkt','Arbeidsmarkt'],['Prijs P per product','Uurloon w'],['Producten Q','Arbeid L: personen of uren'],['Vraag door kopers','Arbeidsvraag door werkgevers'],['Aanbod is nog geen verkoop','Arbeidsaanbod is nog geen betaald werk']],60,215,1480,440,[740,740],35);
 text(s,'Eerst het vrije evenwicht, daarna de ondergrens.',60,722,1480,80,42,{bold:true,color:C.blue});
 notes(s,'141','Herhaal §3.1.5: zonder opkoop worden alleen gevraagde producten verkocht. Op de arbeidsmarkt vragen werkgevers arbeid en bieden werknemers arbeid aan. Een loonvloer is een ondergrens. Er is geen automatische overheidsaankoop van ongebruikte arbeid.','Wie vraagt arbeid en wie biedt arbeid aan?','Een bedrijf biedt een baan aan, maar vraagt economisch arbeid.','Gebruik een nieuwe, afzonderlijke voorbeeldmarkt.');
}
{
 const s=slide('Reparatiewerkplaatsen');tag(s);
 lines(s,['Lᵥ = 150 − 5w       Lₐ = −30 + 5w','L = personen, ieder 24 betaalde uren per week','w = brutouurloon in euro; € 6 ≤ w ≤ € 30'],{y:270,gap:135,size:40});
 text(s,'Concurrerende werkgevers · vergelijkbare arbeid\nGeen vacatures of zoekproblemen · alle gevraagde plaatsen gevuld',60,698,1480,110,32);
 notes(s,'141–144','Eigen onderwijsmodel met onveranderde functies en 24 uur per persoon per week. Neem naleving van de ondergrens aan. Eerst rekenen we zonder vloer, daarna met een minimum van 20 euro. We volgen geen individuele werknemers.','Welke grootheid geeft L weer?','L is geen aantal uren; vermenigvuldig later met 24.','Bereken het vrije evenwicht.',{example:true});
}
{
 const s=slide('Vrij evenwicht');tag(s);
 lines(s,['150 − 5w = −30 + 5w','180 = 10w     →     w = € 18 per uur','L = 150 − 5 × 18 = 60 personen','Controle: −30 + 5 × 18 = 60 personen'],{y:252,gap:134,size:43});
 notes(s,'141–144','Stel de twee hoeveelheden gelijk en los het loon op. Vul 18 in de vraagfunctie in. Controleer met aanbod. De vraag en het aanbod gebruiken dezelfde eenheid.','Waarom stel je hier Lᵥ gelijk aan Lₐ?','Een loon in euro is geen werkgelegenheid in personen.','Lees dezelfde uitkomst in de grafiek.',{example:true});
}
{
 const s=slide('Het evenwicht in de grafiek');tag(s);graph(s,E,'free');
 text(s,'E = (60; 18)',1160,282,380,60,37,{bold:true,color:C.blue});text(s,'60 personen\n€ 18 per uur',1160,392,380,160,36);text(s,'Loon verticaal\nArbeid horizontaal',1160,626,380,120,32);
 notes(s,'141–144','De dalende lijn is arbeidsvraag, de stijgende arbeidsaanbod. Het snijpunt heeft eerst de horizontale hoeveelheid en dan het verticale loon. Controleer de hulplijnen.','Welke as geeft het aantal personen?','Draai de coördinaten van E niet om.','Vergelijk eerst met een minimum onder het evenwicht.',{example:true});
}
{
 const s=slide('Een niet-bindend minimumloon');tag(s);graph(s,E,'nonbinding');
 text(s,'Minimum: € 16',1160,273,380,75,36,{bold:true,color:C.orange});text(s,'€ 18 blijft\ntoegestaan.',1160,404,380,130,38,{bold:true});text(s,'Loon: € 18\nWerk: 60 personen',1160,626,380,140,34);
 notes(s,'141','De ondergrens van 16 ligt onder het vrije loon van 18. Het evenwicht blijft toegestaan, dus loon en werkgelegenheid blijven gelijk. Bij gelijkheid met het evenwichtsloon dwingt de vloer evenmin een verandering af.','Moet iedereen nu precies het minimum verdienen?','Een minimum is geen voorgeschreven exact loon.','Verhoog in dezelfde markt de ondergrens naar 20 euro.',{example:true});
}
{
 const s=slide('Een bindend minimumloon');tag(s);
 text(s,'€ 20 > € 18: het vrije evenwicht is niet toegestaan.',60,252,1480,100,43,{bold:true,color:C.orange});
 lines(s,['Lᵥ = 150 − 5 × 20 = 50 personen','Lₐ = −30 + 5 × 20 = 70 personen','Werkgelegenheid = 50 personen'],{y:399,gap:132,size:43});
 notes(s,'142','Naleving van de vloer maakt het loon in dit model 20. Vul ditzelfde loon in beide functies in. Werkgevers vullen alle 50 gevraagde plaatsen; niet alle 70 aanbieders krijgen werk.','Welk loon vul je in beide functies in?','De bestaande lijnen verschuiven niet door alleen de loonvloer.','Markeer de twee hoeveelheden op de bestaande lijnen.',{example:true});
}
{
 const s=slide('Aanbodoverschot bij de loonvloer');tag(s);graph(s,E,'floor');
 text(s,'70 − 50 = 20',1160,271,380,65,38,{bold:true,color:C.orange});text(s,'20 personen\nwillen werken,\nmaar krijgen\ngeen baan.',1160,381,380,225,35);text(s,'Horizontale afstand\nGeen oppervlakte',1160,666,380,115,31,{bold:true});
 notes(s,'142','Trek de horizontale vloer bij 20 euro. Lees links de vraag van 50 en rechts het aanbod van 70. Trek verticale hulplijnen naar de hoeveelheidsas. De dikke horizontale afstand is 20 personen. Alle niet-geplaatste aanbieders zoeken en zijn beschikbaar.','Hoe lees je het overschot af?','Het overschot is niet de hele aangeboden hoeveelheid of een oppervlakte. Geen automatische opkoop door de overheid.','Vergelijk met de eerdere 60 werkenden.',{example:true});
}
{
 const s=slide('Minder werkenden en extra aanbieders');tag(s);
 table(s,[['Personen','Oud','Nieuw','Verschil'],['Werkenden','60','50','10 minder'],['Arbeidsaanbod','60','70','10 extra']],60,259,1480,284,[580,260,260,380],36);
 text(s,'20 personen overschot = 10 minder werkenden + 10 extra aanbieders',60,617,1480,126,42,{bold:true,color:C.orange});
 notes(s,'142','Er werken 10 minder personen en 10 extra personen bieden arbeid aan. Dat geeft samen een overschot van 20. Dit is een vergelijking van aantallen, geen individuele loopbaanregistratie. Wie hetzelfde aantal uren blijft werken krijgt een hoger weekloon.','Waarom is 20 overschot niet hetzelfde als 20 verloren banen?','Zeg niet dat alle nieuwe werklozen eerder werk hadden.','Bereken nu hoeveel loon daadwerkelijk wordt betaald.',{example:true});
}
{
 const s=slide('Loonsom: loon over betaalde uren');tag(s);
 text(s,'Loonsom per week = uurloon × uren per werknemer × werkenden',60,240,1480,130,43,{bold:true,color:C.blue});
 table(s,[['','Betaalde uren per week','Loonsom per week'],['Oud','24 × 60 = 1.440 uur','€ 18 × 1.440 = € 25.920'],['Nieuw','24 × 50 = 1.200 uur','€ 20 × 1.200 = € 24.000']],60,437,1480,280,[190,620,670],34);
 text(s,'De 70 aanbieders worden niet allemaal betaald.',60,764,1480,59,35,{bold:true});
 notes(s,'143','De loonsom is het totale brutoloon dat alle werkenden samen ontvangen per week. Eerst personen naar uren, daarna uren maal euro per uur. Laat de eenheden mee wegvallen. Het product w × L in een grafiek met personen vereist nog de factor 24 uur per persoon per week.','Met welk aantal personen reken je nieuw?','Het hogere loon geldt niet als inkomen voor alle aanbieders.','Vergelijk nieuw met oud in procenten.',{example:true});
}
{
 const s=slide('De verandering van de loonsom');tag(s);
 lines(s,['Verandering = (nieuw − oud) / oud × 100%','(24.000 − 25.920) / 25.920 × 100% ≈ −7,41%'],{y:269,gap:148,size:43});
 text(s,'Het hogere uurloon compenseert hier de daling\nvan het aantal betaalde uren niet.',60,583,1480,130,41,{bold:true,color:C.orange});
 text(s,'Een andere reactie van betaald werk kan de loonsom laten stijgen.',60,759,1480,68,32);
 notes(s,'143','Het verschil is min 1920 euro per week. Deel door de oude 25920. Reken zonder tussentijds afronden. Uurloon stijgt 11,11 procent, uren dalen 16,67 procent. De combinatie geeft min 7,4074 procent, niet het verschil van de percentages. Er bestaat geen vaste richting voor de loonsom.','Waarom staat het oude bedrag in de noemer?','Een hoger minimumloon betekent niet in ieder model een lagere loonsom. De bron bepaalt de reactie.','Controleer de redenering kort.',{example:true});
}
{
 const s=slide('Korte controle');tag(s);
 text(s,'“Iedereen verdient meer, want het uurloon stijgt.”',60,270,1480,135,49,{bold:true,color:C.blue});
 text(s,'Voor welke groep klopt dit bij dezelfde uren?\nWelke groep ontvangt dit hogere loon niet?',60,529,1480,175,41);
 notes(s,'142–143','Laat leerlingen het onderscheid verwoorden. Wie werk behoudt en 24 uur blijft werken: 18 × 24 = 432 naar 20 × 24 = 480 euro per week. De 20 niet-geplaatste aanbieders ontvangen hier geen loon. Individuele baanbehouders zijn niet bekend.','Welke voorwaarde moet je aan een hoger weekloon toevoegen?','Een modeluitkomst is geen algemene empirische voorspelling voor elke echte minimumloonsverhoging.','Keer terug naar start 29 en laat basiswerk beginnen.',{example:true});
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 34 · Een loonvloer in de sorteercentra','target-question');
 text(s,'Lᵥ = 220 − 10w     en     Lₐ = −20 + 10w',60,217,1480,78,44,{bold:true,color:C.blue});
 text(s,'Voor € 2 ≤ w ≤ € 22. L is het aantal personen met ieder 25 betaalde uren per week; w is het brutouurloon in euro.',60,335,1480,132,37);
 text(s,'Een fictief minimumloon wordt € 14.',60,505,1480,73,43,{bold:true,color:C.orange});
 text(s,'Werkgevers concurreren; er zijn geen vacatures of zoekproblemen. Alle gevraagde plaatsen worden gevuld. Alle aanbieders zonder baan zoeken en zijn direct beschikbaar.',60,626,1480,181,36);
 notes(s,'147','Dit is de volledige oorspronkelijke context van doelopgave 34. De markt en arbeidsduur zijn anders dan in het uitlegvoorbeeld. Alle vragen en de basisgrafiek komen eerst, zonder uitwerking.','Welke arbeidsduur hoort bij deze opgave?','Gebruik 25 uur, niet de 24 uur uit het uitlegvoorbeeld.','Toon deelvragen a en b.');
}
{
 const s=slide('Opgave 34 · Deelvragen a en b','target-question');
 text(s,'a. (2p) Bereken het vrije evenwicht en bepaal of de loonvloer bindend is.',60,233,1480,160,41);
 rule(s,60,440,1480);
 text(s,'b. (3p) Bereken bij de loonvloer arbeidsvraag, arbeidsaanbod, werkgelegenheid en aanbodoverschot. Geef de loonvloer en beide hoeveelheden aan in de basisgrafiek.',60,499,1480,243,41);
 notes(s,'147','Lees de volledige deelvragen zonder antwoorden. Bij b zijn zowel vier hoeveelheidsbegrippen als grafische markering gevraagd.','Welke onderdelen moet je antwoord op b bevatten?','Een juiste uitkomst zonder gevraagde grafiek is onvolledig.','Toon de basisgrafiek.');
}
{
 const s=slide('Opgave 34 · Basisgrafiek','target-question');graph(s,T,'base');
 text(s,'Lᵥ = 220 − 10w\nLₐ = −20 + 10w',1145,283,395,170,32,{bold:true});text(s,'Vul de loonvloer,\nvraag en aanbod\naan; teken de lijnen\nniet opnieuw.',1145,501,395,228,34);
 text(s,'Functies voor € 2 ≤ w ≤ € 22',60,178,1480,46,29,{color:C.blue});
 notes(s,'147','De bestaande vraag- en aanbodlijnen zijn hier bewerkbaar weergegeven met dezelfde functies, assen en schaal. Alleen het opgegeven domein 2 tot 22 euro wordt getekend. Voeg nog geen antwoorden toe; c en d volgen eerst.','Wat moet je aan deze grafiek toevoegen?','De horizontale as geeft personen, niet uren.','Toon de overige deelvragen.');
}
{
 const s=slide('Opgave 34 · Deelvragen c en d','target-question');
 text(s,'c. (3p) Bereken de loonsom vóór en na de verandering en de procentuele verandering.',60,237,1480,164,41);rule(s,60,455,1480);
 text(s,'d. (2p) Leg uit waarom “alle 40 hebben hun baan verloren” en “iedereen verdient meer” geen juiste conclusies zijn.',60,519,1480,195,41);
 notes(s,'147','Nu zijn de context, basisgrafiek en alle vier deelvragen beschikbaar zonder oplossingen. Laat leerlingen eigen werk ernaast leggen voordat de bespreking begint.','Welke twee uitspraken vraagt d te beoordelen?','De 40 in de vraag is geen reden om de berekening bij b over te slaan.','Begin de uitwerking bij het vrije evenwicht.');
}
{
 const s=slide('Opgave 34a · Evenwicht en bindendheid','target-answer');
 lines(s,['220 − 10w = −20 + 10w','240 = 20w     →     w = € 12 per uur','L = 220 − 10 × 12 = 100 personen','€ 14 > € 12: de loonvloer is bindend'],{y:227,gap:148,size:45});
 notes(s,'147','Gelijkstellen levert 12 euro. Invullen geeft 100 personen. Controle met aanbod: −20 + 120 = 100. Het minimum van 14 ligt boven het vrije evenwicht, dus dat evenwicht is niet toegestaan.','Hoe controleer je de 100 personen met de andere functie?','De conclusie bindend vereist vergelijking met het berekende vrije loon.','Bereken beide hoeveelheden bij 14 euro.');
}
{
 const s=slide('Opgave 34b · Vraag, aanbod en betaald werk','target-answer');
 lines(s,['Lᵥ = 220 − 10 × 14 = 80 personen','Lₐ = −20 + 10 × 14 = 120 personen','Werkgelegenheid = 80 personen','Aanbodoverschot = 120 − 80 = 40 personen'],{y:226,gap:146,size:43});
 notes(s,'147','Het loon wordt 14 euro. Werkgevers willen 80 plaatsen vullen en alle gevraagde plaatsen worden gevuld. Van 120 aanbieders krijgen er 40 geen werk; de bron zegt dat zij zoeken en direct beschikbaar zijn.','Waarom is werkgelegenheid hier gelijk aan arbeidsvraag?','120 aanbieders betekent geen 120 gevulde arbeidsplaatsen.','Zet deze uitkomsten in de basisgrafiek.');
}
{
 const s=slide('Opgave 34b · De loonvloer in de grafiek','target-answer');graph(s,T,'floor');
 text(s,'Bij € 14 per uur',1150,258,390,70,35,{bold:true,color:C.orange});text(s,'Vraag: 80\nAanbod: 120',1150,386,390,141,37,{bold:true});text(s,'120 − 80 = 40\npersonen overschot',1150,615,390,140,34);
 notes(s,'147','Teken de vloer horizontaal bij 14 euro. De snijpunten zijn (80;14) op vraag en (120;14) op aanbod. Lees de hoeveelheden verticaal naar de L-as. De dikke horizontale afstand geeft het overschot van 40 personen; de oorspronkelijke lijnen blijven staan.','Welke afstand laat de 40 zien?','De loonvloer verschuift de lijnen niet; alle getekende curvepunten liggen in het opgegeven domein.','Gebruik alleen de 80 werkenden voor de nieuwe loonsom.');
}
{
 const s=slide('Opgave 34c · Loonsommen vergelijken','target-answer');
 table(s,[['','Oud','Nieuw'],['Uurloon','€ 12','€ 14'],['Werkenden','100 personen','80 personen'],['Betaalde uren per week','25 × 100 = 2.500','25 × 80 = 2.000'],['Loonsom per week','12 × 2.500 = € 30.000','14 × 2.000 = € 28.000']],60,218,1480,479,[540,470,470],33);
 text(s,'Uurloon stijgt; betaalde uren dalen van 2.500 naar 2.000.',60,754,1480,75,39,{bold:true,color:C.blue});
 notes(s,'147','Vermenigvuldig steeds met de gegeven 25 uur per persoon per week. De loonsom gebruikt in de oude situatie 100 en in de nieuwe 80 werkenden. Niet 120. Voor en na hebben dezelfde week als periode.','Waar komt de factor 25 vandaan?','w maal personen mist de arbeidsduur.','Deel het verschil door de oude loonsom.');
}
{
 const s=slide('Opgave 34c · Procentuele verandering','target-answer');
 lines(s,['Verandering = (nieuw − oud) / oud × 100%','(28.000 − 30.000) / 30.000 × 100%','= −6,666…% ≈ −6,67%'],{y:226,gap:145,size:44});
 text(s,'De loonsom daalt met € 2.000 per week.\nHet hogere uurloon compenseert de daling van betaalde uren niet.',60,676,1480,140,38,{bold:true,color:C.orange});
 notes(s,'147','De oude 30000 is de basis. Bewaar ongeronde tussenuitkomsten en rond de procentuele verandering op twee decimalen af. Min betekent een daling. Dit is de gezamenlijke loonsom, niet het weekloon van iemand die blijft werken.','Waarom is de noemer 30000 en niet 28000?','Trek niet simpelweg de procentuele veranderingen van loon en werk van elkaar af.','Beoordeel de eerste uitspraak uit d.');
}
{
 const s=slide('Opgave 34d · Hebben alle 40 hun baan verloren?','target-answer');
 table(s,[['Verandering','Berekening','Personen'],['Minder werkenden','100 − 80','20'],['Extra aanbieders','120 − 100','20'],['Nieuw aanbodoverschot','20 + 20','40']],60,230,1480,354,[620,490,370],36);
 text(s,'40 zonder werk is niet hetzelfde als 40 verloren banen.',60,645,1480,113,43,{bold:true,color:C.orange});
 notes(s,'147','Eerst waren er 100 werkenden en aanbieders. Nu zijn er 80 werkenden en 120 aanbieders. De daling van werk is 20; de toename van aanbod eveneens 20. Zonder individuele gegevens weet je niet welke personen werk behouden of verliezen.','Welk oud aantal heb je nodig voor beide vergelijkingen?','Een aanbodoverschot vergelijkt nieuw aanbod met nieuw werk; baanverlies vergelijkt oud en nieuw werk.','Beoordeel daarna of iedereen meer verdient.');
}
{
 const s=slide('Opgave 34d · Verdient iedereen meer?','target-answer');
 text(s,'Wie werk houdt en 25 uur blijft werken:',60,223,1480,71,40,{bold:true,color:C.blue});
 text(s,'€ 12 × 25 = € 300     →     € 14 × 25 = € 350 per week',60,336,1480,117,43,{bold:true});rule(s,60,507,1480);
 text(s,'40 aanbieders krijgen in dit model geen baan.\nZij ontvangen het hogere loon dus niet.',60,554,1480,142,42);
 text(s,'De uitkomst geldt onder de gegeven modelaannames.',60,758,1480,61,34,{bold:true,color:C.orange});
 notes(s,'147','Alleen de blijvende werknemer met dezelfde uren heeft het hogere weekloon. De niet-geplaatste aanbieders ontvangen in deze markt geen loon. Andere inkomensbronnen zijn niet gegeven. Trek geen algemene uitspraak over iedere echte minimumloonverhoging.','Welke voorwaarde maakt de eerste zin juist?','Hoger uurloon, hoger individueel weekloon en hogere totale loonsom zijn verschillende uitspraken.','Laat leerlingen hun eigen antwoord nalopen.');
}
{
 const s=slide('Antwoordcontrole bij opgave 34','target-answer');
 const r=[['a','€ 12 en 100 personen; € 14 is bindend.'],['b','Vraag 80, aanbod 120, werk 80, overschot 40; grafiek erbij.'],['c','€ 30.000 → € 28.000 per week; −6,67%.'],['d','20 minder werkenden én 20 extra aanbieders; inkomen per groep.']];
 r.forEach((a,i)=>{text(s,a[0],60,218+i*137,85,63,42,{bold:true,color:C.blue});text(s,a[1],183,218+i*137,1357,102,36);});
 text(s,'Verbeter een ontbrekende eenheid, stap of verklaring.',60,782,1480,48,32,{bold:true});
 notes(s,'147','Controleer alle vier onderdelen: algebra plus binding; invullen plus grafiek; loonsommen plus juiste noemer; beide onjuiste uitspraken onderbouwen. Laat een leerling één verbetering verwoorden.','Wat ontbreekt nog in jouw antwoord?','Een eindgetal vervangt de gevraagde redenering niet.','Zet het huiswerk in de agenda.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviewSlides:overviews,tableSlides:tables,chartSlides:charts,graphs,models:{E,T}},null,2));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,'4.3.4 Minimumloon – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
