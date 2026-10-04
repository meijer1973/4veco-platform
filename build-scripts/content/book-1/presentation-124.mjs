import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

// Current classroom edition. Do not reuse the frozen first-edition web model.
const HERE=path.dirname(fileURLToPath(import.meta.url));
const facts=JSON.parse(await fs.readFile(path.join(HERE,'presentation-124.tweede-editie-2026.manifest.json'),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('124');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB'};
const FONT='Arial', tables=[],charts=[],slides=[],overviews=[],graphContracts=[];
const source=`https://github.com/meijer1973/4veco-lessen/blob/${facts.sourceCommit}/Boek%201%20-%20Grondslagen%2C%20vraag%20en%20aanbod/edities/tweede-editie-2026/`;
const title='§1.2.4 Gemengde opgaven: vraag';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,48),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(t,footer=title){const s=p.slides.add();s.background.fill=C.paper;text(s,t,60,42,1480,78,52,{bold:true});rule(s,60,146,1480);text(s,footer,60,848,1380,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title:t});return s;}
function notes(s,pages,explanation,question,pitfall,transition,extra=''){s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 1, tweede editie 2026, gedrukte pagina ${pages}. ${source}boek/Boek_1_Compleet_Tweede_editie.pdf\nAntwoordmodel: ${source}bronnen/H2/Antwoorden.md#ans37\n${extra}`);}
function table(s,values,x,y,w,h,widths,size=32){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const a=t.getCell(r,c);a.fill=r===0?C.ink:(r%2?C.paper:C.pale);a.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}tables.push(p.slides.items.length);return t;}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Korte herhaling en aanpak.','Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van opgave 37.','Zet je huiswerk in je agenda.'];
function overview(phase,active){const s=slide('Deze les: §1.2.4 Gemengde opgaven');overviews.push(p.slides.items.length);text(s,'Nu: '+phase,60,112,1450,40,30,{bold:true,color:C.blue,name:'phase'});text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,345,410,485,613,701,774],hs=[86,50,50,111,77,50,50];route.forEach((r,i)=>{text(s,(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color:active===i+1?C.blue:C.ink,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:active===i+1?C.blue:C.ink,name:'route-'+(i+1)});});text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Vraagfuncties combineren.\nBewegen en verschuiven verklaren.\nKoopbeslissingen onderbouwen.',972,244,565,135,30,{name:'overview-goals'});rule(s,972,391,568);text(s,'Startopdracht',972,419,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 78 · Opgave 34\nSteun: p. 14 en p. 46–47',972,474,565,89,30,{name:'overview-start'});rule(s,972,578,568);text(s,'Huiswerk',972,604,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§1.2.4 · Opgaven 34–38\nGemengd: 34–36 · Doel: 37\n38: bonusopgave\nMaken en nakijken',972,661,565,157,30,{name:'overview-homework'});notes(s,'78–82',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Begin met de eerste echte gemengde opgave, 34 op p. 78. Vervolg: 35 op p. 78, 36 op p. 79, daarna doel 37 met bronnen p. 80 en vragen p. 81. Huiswerk: alle gemengde opgaven 34, 35, 36, 37 en 38 maken en nakijken, waarbij 38 op p. 82 het bonuslabel behoudt. Deze gemengde paragraaf kent geen afzonderlijk basisblok: voeg geen fictieve basis- of startopgaven toe. 37 is gekozen voor bespreking omdat alle hoofdstukbewerkingen samenkomen. De boekplanning schat 63 minuten voor de normale gemengde route. Dat is geen gemeten duur en geen garantie dat alles in één les past. Start 34 gebruikt eerder uitgelegde kennis: betalingsbereidheid en gelijkheid op p. 46–47, procentuele verandering op p. 14. Verwijs bij twijfel daarheen. Bij terugkeer naar dit overzicht na de korte herhaling laat je leerlingen hun aanpak van 34 nalopen, zonder vooraf hun uitwerking te onthullen. Bij 36d: p. 60 legt expliciet uit dat meer kopers de groepsvraag kunnen veranderen zonder dat een bestaande koper meer vraagt.`,'Welke bron en welke eerder geleerde regel heb je nodig?','Start 34 is herhaling van eerder onderwezen bewerkingen; dit bewijst nog geen beheersing door de klas.',active===7?'Laat het huiswerk in de agenda zetten.':'Ga verder naar de volgende lesfase wanneer de klas daarvoor klaar is.');return s;}
overview('Startopdracht',2);
{
 const s=slide('Korte herhaling: kopen bij een gegeven prijs');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,184,1480,49,31,{bold:true,color:C.blue});
 text(s,'Lina heeft € 8, € 5 en € 1 over voor drie extra stickers.',60,262,1480,70,39);
 table(s,[['Sticker','Eerste','Tweede','Derde'],['Betalingsbereidheid','€ 8','€ 5','€ 1'],['Kopen bij € 5?','Ja','Ja, bij gelijkheid','Nee']],60,367,1480,266,[470,310,380,320],32);
 text(s,'Lina wil 2 stickers kopen bij € 5 per sticker.',60,695,1480,78,44,{bold:true,color:C.green});
 notes(s,'14, 46–47','Dit is een eigen voorbeeld met losse eenheden, niet een boekopgave. Geef voldoende budget en beschikbare stickers als aannamen. De gelijkheidsafspraak maakt de tweede sticker een aankoop. Vraag leerlingen per eenheid te vergelijken. Alleen als de start laat zien dat het nodig is: herhaal procenten met een andere prijsverandering, € 5 naar € 6. (6 − 5) / 5 × 100% = 20%. De oude prijs vormt de basis. Houd dit kort en ga bij problemen terug naar de uitleg op p. 14.','Welke sticker ligt precies op de koopgrens?','De betalingsbereidheden gelden per extra sticker, niet voor alle stickers samen.','Wissel nu expliciet naar een afzonderlijk lineair model van rondvaartkaartjes.','Eigen context en getallen. De geciteerde boekpagina’s onderbouwen alleen de methode.');
}
{
 const s=slide('Korte herhaling: twee groepen samen');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,184,1480,49,31,{bold:true,color:C.blue});
 text(s,'Rondvaart: kaartjes per week, P in euro per kaartje',60,251,1480,62,36);
 text(s,'Qₐ = 18 − 2P     voor 0 ≤ P ≤ 9\nQᵦ = 30 − 2P     voor 0 ≤ P ≤ 15',60,340,1480,131,43);
 text(s,'Q = (18 − 2P) + (30 − 2P) = 48 − 4P',60,516,1480,74,43,{bold:true,color:C.blue});
 text(s,'Gemeenschappelijk interval: 0 ≤ P ≤ 9',60,605,1480,57,35,{bold:true});
 text(s,'Bij € 3: 12 + 24 = 36 kaartjes per week',60,732,1480,62,40,{bold:true,color:C.green});
 notes(s,'68–71','Eigen geconstrueerd model, los van Lina’s stickers. Beide groepen zijn disjunct en betalen dezelfde prijs voor hetzelfde product in dezelfde week. Alle overige omstandigheden blijven gelijk. Boven de eigen koopgrens draagt een groep nul bij. Verzamel de constante termen en daarna de P-termen. Op het gemeenschappelijke interval tot en met € 9 zijn beide regels geldig. Controleer Q bij € 3: A 18 − 6 = 12, B 30 − 6 = 24, samen 36. Buiten dit interval opnieuw per groep rekenen.','Waarom deel je de som niet door twee?','Een groepsgemiddelde is niet de totale vraag. Tel personen die al in een groep zitten niet opnieuw mee.','Lees dezelfde functie in de omgekeerde richting.','Eigen context en getallen. Boekpagina’s onderbouwen de methode.');
}
{
 const s=slide('Korte herhaling: terugrekenen en controleren');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,184,1480,49,31,{bold:true,color:C.blue});
 text(s,'Rondvaart: welke prijs hoort bij 28 kaartjes per week?',60,256,1480,75,38);
 text(s,'28 = 48 − 4P\n28 + 4P = 48\n4P = 20\nP = € 5 per kaartje',60,366,790,274,43,{bold:true});
 text(s,'Aan beide kanten +4P\nAan beide kanten −28\nAan beide kanten ÷4',925,425,615,186,32,{color:C.muted});
 text(s,'Controle: 48 − 4 × 5 = 28 kaartjes per week',60,693,1480,70,38,{bold:true,color:C.green});
 text(s,'Dezelfde relatie met P links: P = 12 − 0,25Q',60,780,1480,54,33);
 notes(s,'48–51, 69–72','De prijs € 5 ligt binnen 0 ≤ P ≤ 9. Elke regel gebruikt dezelfde bewerking aan beide kanten. Een andere schrijfwijze van dezelfde relatie is P = 12 − 0,25Q. Als Q onbekend is bij P = 3: 3 = 12 − 0,25Q, dus 0,25Q = 9 en Q = 36; terugcontrole 12 − 0,25 × 36 = 3. Hiermee wordt de schrijfwijze in gemengde oefening 36 kort opgehaald zonder die boekopgave uit te werken. In de grafiek blijft Q horizontaal en P verticaal, ook wanneer P links staat.','Welke eenheid hoort bij de onbekende?','De letter links in de formule bepaalt niet de horizontale as.','Bekijk het effect van een eigen prijsverandering op dezelfde vraaglijn.','Eigen rondvaartmodel, geen boekgegevens.');
}
function series(name,xValues,values,color=C.blue,width=4,symbol='none',style='solid'){return {name,xValues,values,line:{fill:color,width,style},marker:{symbol,size:10,fill:color,line:{fill:color,width:1}}};}
function chart(s,key,stage){const target=key==='target',a=target?60:48,b=target?6:4,delta=target?12:8,maxP=target?8:9,oldP=target?4:3,newP=target?6:4,qOld=a-b*oldP,qMid=a-b*newP,qFinal=qMid+delta;
 const ss=[series('V₀',[a-b*maxP,a],[maxP,0])];
 if(stage>=2)ss.push(series('V₁',[a+delta-b*maxP,a+delta],[maxP,0],C.orange));
 if(stage>=1){ss.push(series('A',[qOld],[oldP],C.blue,0,'circle'),series('B',[qMid],[newP],C.ink,0,'square'));}
 if(stage>=2)ss.push(series('C',[qFinal],[newP],C.orange,0,'diamond'),series('Vergelijking bij dezelfde prijs',[qMid,qFinal],[newP,newP],C.muted,2,'none','dashed'));
 const ch=s.charts.add('scatter',{position:{left:60,top:252,width:1080,height:565},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,xAxis:{min:0,max:target?84:60,majorUnit:target?12:12,numberFormatCode:'0',title:{text:target?'Q (halfuren per week)':'Q (kaartjes per week)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:12,majorUnit:2,numberFormatCode:'0',title:{text:target?'P (€ per halfuur)':'P (€ per kaartje)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:25,fill:C.ink},line:{fill:C.ink,width:1.5},majorGridlines:{fill:C.line,width:1}},chartFill:C.paper,plotAreaFill:C.paper});applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphContracts.push({slide:p.slides.items.length,key,stage,a,b,delta,maxP,series:ss.map(({name,xValues,values})=>({name,xValues,values}))});return {qOld,qMid,qFinal};}
for(const stage of [1,2]){
 const s=slide(stage===1?'Korte herhaling: alleen de eigen prijs':'Korte herhaling: een substituut wordt duurder');
 text(s,'Uitlegvoorbeeld — niet uit het boek',60,184,1480,49,31,{bold:true,color:C.blue});chart(s,'example',stage);
 text(s,stage===1?'Rondvaart\nP: € 3 naar € 4':'Waterfietsen\nwordt duurder',1190,266,350,118,34,{bold:true});
 text(s,stage===1?'Q = 48 − 4P\n\n36 naar 32\nkaartjes per week':'Gegeven: bij elke\nprijs +8 kaartjes\nper week',1190,440,350,199,31);
 text(s,stage===1?'A naar B:\nlangs V₀':'V₁: Q = 56 − 4P\nBij € 4: Q = 40',1190,690,350,130,31,{bold:true,color:stage===1?C.blue:C.orange});
 notes(s,'58–61, 69–72',stage===1?'Eigen rondvaartmodel. Onder verder gelijke omstandigheden stijgt de kaartjesprijs van € 3 naar € 4. Q wordt 48 − 4 × 4 = 32 in plaats van 36 kaartjes per week. A = (36; 3), B = (32; 4). Laat zien dat beide op V₀ liggen. Eindpunten voor 0 ≤ P ≤ 9: (12; 9) en (48; 0). De lijn wordt niet naar de P-as verlengd.':'In deze eigen bron zijn waterfietsen een substituut voor rondvaart. De waterfietsprijs stijgt. Gegeven is een toename van 8 kaartjes per week bij elke prijs van € 0 tot en met € 9. Dus Q nieuw = 48 − 4P + 8 = 56 − 4P, met eindpunten (20; 9) en (56; 0). Bij P = 4: Q = 40. C = (40; 4). Vergelijk B en C horizontaal bij dezelfde prijs. Netto: 36 − 4 + 8 = 40. B is een denkstap, geen waargenomen tussensituatie. Er is geen aanbodmodel.','Welke prijs verandert en welke lijn hoort erbij?','Eigen prijs geeft een beweging langs de lijn; de hogere prijs van het genoemde substituut veroorzaakt de verschuiving.',stage===1?'Voeg daarna het andere prijseffect toe bij dezelfde rondvaartprijs.':'Leerlingen vervolgen het gemengde werk.','Eigen context en getallen. De boekpagina’s onderbouwen de methode.');
}
overview('Gemengde opgaven',4);
const tf=title+' · Opgave 37 · Boekpagina 80–81';
{
 const s=slide('Opgave 37 · Tafeltennistijd bij Club Noord',tf);
 text(s,'Bron A · Twee groepen, één prijs',60,188,1480,61,38,{bold:true,color:C.blue});
 text(s,'Iedereen betaalt P euro per halfuur.\nQₐ en Qᵦ zijn halfuren per week.',60,285,1480,110,38);
 table(s,[['Groep','Vraagfunctie','Geldigheid'],['A','Qₐ = 24 − 3P','0 ≤ P ≤ 8'],['B','Qᵦ = 36 − 3P','0 ≤ P ≤ 12']],60,438,1480,247,[290,600,590],35);
 text(s,'Oude prijs: € 4 per halfuur. Boven de eigen koopgrens: vraag nul.\nOverige omstandigheden aanvankelijk gelijk. Geconstrueerde modelgegevens.\nAanbod en beschikbaarheid ontbreken.',60,714,1480,119,31);
 notes(s,'80','Toon de echte gegevens uit bron A. Andere omstandigheden zijn aanvankelijk gelijk. Alle cijfers zijn geconstrueerde modelgegevens. De club onderzoekt uitsluitend de vraag: er staat geen informatie over aanbod of beschikbaarheid. Geef nog geen somfunctie of berekende vraag.','Welke grootheden en perioden geeft de bron?','De twee groepen hebben verschillende koopgrenzen.','Lees eerst ook bron B en C, daarna alle vragen.');
}
{
 const s=slide('Opgave 37 · Bron B: twee veranderingen',tf);
 text(s,'De club verhoogt P naar € 6 per halfuur.',60,214,1480,75,42,{bold:true,color:C.blue});
 text(s,'Tegelijk wordt bowlen duurder.\nVoor deze kopers is bowlen een substituut.',60,363,1480,126,42);
 text(s,'Daardoor: bij elke prijs van € 0 tot en met € 8\n12 halfuren per week extra vraag naar tafeltennistijd.',60,561,1480,157,41,{bold:true,color:C.orange});
 text(s,'Alle overige omstandigheden blijven gelijk.',60,771,1480,60,34);
 notes(s,'80','Lees bron B zonder alvast een nieuwe formule of netto-uitkomst te onthullen. Bewaar het afgebakende prijsinterval en de periode. De eigen prijs en de prijs van bowlen veranderen tegelijk.','Welke twee veranderingen noemt de bron precies?','De bron geeft een prijs van een substituut, geen verandering van voorkeur.','Lees bron C voordat je de vragen bespreekt.');
}
{
 const s=slide('Opgave 37 · Bron C: Sem',tf);
 text(s,'Sem is al meegeteld in groep A.',60,214,1480,73,44,{bold:true,color:C.blue});
 text(s,'Zijn betalingsbereidheid voor vier extra halfuren:',60,344,1480,66,38);
 table(s,[['Extra halfuur','Eerste','Tweede','Derde','Vierde'],['Maximaal per halfuur','€ 7','€ 6','€ 4','€ 2']],60,458,1480,191,[470,252,253,252,253],32);
 text(s,'Bij gelijkheid wil Sem kopen.\nZijn budget beperkt hem niet extra.',60,718,1480,107,38);
 notes(s,'80','Dit zijn de echte bron-C-gegevens. Geef nog geen antwoord op f. De zin over groep A behoort tot de bron en moet zichtbaar blijven.','Welke gegevens heb je nodig voor Sems koopbeslissing?','Een brongegeven is nog geen uitgewerkt antwoord. Laat leerlingen eerst hun eigen redenering vergelijken.','Toon de oningevulde beginfiguur.');
}
{
 const s=slide('Opgave 37 · Figuur 22: de oorspronkelijke vraag',tf);text(s,'Alleen het oorspronkelijke lijnstuk voor 0 ≤ P ≤ 8',60,184,1480,57,35,{bold:true,color:C.blue});chart(s,'target',0);text(s,'V₀\n\nDe antwoord-\nmarkeringen\nvoeg je zelf toe.',1190,327,350,253,34);text(s,'Q horizontaal\nP verticaal',1190,688,350,116,33,{bold:true});notes(s,'80','De native grafiek reproduceert figuur 22 met hetzelfde oorspronkelijke lijnstuk: (12; 8) naar (60; 0). De x-as loopt iets verder, tot 84, om de latere curveaanduiding leesbaar te houden; het boek gebruikt 72. De prijsas behoudt 0–12. Er staan geen antwoordpunten of nieuwe lijn in deze vraagfase.','Welk prijsinterval mag je straks aanvullen?','De lijn hoeft niet doorgetrokken te worden naar de prijsas.','Laat alle deelvragen zien voordat de antwoorden verschijnen.');
}
{
 const s=slide('Opgave 37 · Vragen a, b en c',tf);
 const qs=[['a','Stel uit bron A de gezamenlijke vraagfunctie op voor 0 ≤ P ≤ 8. Bereken de oude vraag bij € 4 en controleer door beide groepen afzonderlijk te berekenen.'],['b','Welke prijs hoort volgens de oorspronkelijke gezamenlijke functie bij Q = 30 halfuren per week? Controleer je antwoord.'],['c','Bekijk de twee veranderingen uit bron B afzonderlijk. Bereken eerst de hoeveelheid na alleen de eigen prijsstijging. Benoem daarna de specifieke factor en de richting van het andere effect.']];qs.forEach(([k,v],i)=>{let y=213+i*201;text(s,k+'.',60,y,60,65,37,{bold:true,color:C.blue});text(s,v,140,y,1390,170,36);if(i<2)rule(s,60,y+181,1480);});notes(s,'81','Dit zijn alle deelvragen a–c van de echte doelopgave. Gebruik de drie bronnen en figuur 22 op p. 80. Bij berekeningen worden de eenheid en bij verklaringen de specifieke oorzaak gevraagd. Antwoorden blijven nog buiten beeld.','Welke bron gebruik je per deelvraag?','Sla controleberekeningen niet over.','Toon ook d–f, pas daarna beginnen de antwoorden.');
}
{
 const s=slide('Opgave 37 · Vragen d, e en f',tf);
 const qs=[['d','Teken de nieuwe gezamenlijke vraaglijn voor 0 ≤ P ≤ 8 in figuur 22. Markeer A (oud), B (alleen de eigen prijsstijging) en C (beide veranderingen); noteer de coördinaten.'],['e','Bereken de uiteindelijke gezamenlijke vraag. Beoordeel daarmee de uitspraak: “Het totaal blijft gelijk, dus de eigen prijsstijging heeft geen effect.”'],['f','Hoeveel halfuren wil Sem volgens bron C bij € 6 kopen? Mag je die hoeveelheid nog bij de uitkomst van e optellen? Leg uit.']];qs.forEach(([k,v],i)=>{let y=205+i*180;text(s,k+'.',60,y,60,65,37,{bold:true,color:C.blue});text(s,v,140,y,1390,149,35);if(i<2)rule(s,60,y+157,1480);});text(s,'Conclusie: gevraagde tafeltennistijd onder de modelaannamen.',60,787,1480,48,31,{bold:true});notes(s,'81','Dit zijn alle deelvragen d–f van de echte doelopgave. Laat de bronbeperking zichtbaar: er wordt gevraagd, niet bewezen verkocht. Alle context, brongegevens, de gegeven figuur en alle zes deelvragen zijn nu beschikbaar vóór de eerste antwoorddia.','Welk deel van jouw antwoord moet je kunnen verklaren?','Een gelijk totaal betekent niet automatisch dat de afzonderlijke effecten nul zijn.','Start nu met a: de functie en de oude hoeveelheid.');
}
{
 const s=slide('Opgave 37a · De gezamenlijke vraag',tf);
 text(s,'Q = Qₐ + Qᵦ',60,195,1480,65,42,{bold:true,color:C.blue});
 text(s,'Q = (24 − 3P) + (36 − 3P)\nQ = 60 − 6P, voor 0 ≤ P ≤ 8',60,291,1480,147,45,{bold:true});
 text(s,'Bij € 4: Q = 60 − 6 × 4 = 36 halfuren per week',60,493,1480,82,41,{bold:true,color:C.green});
 table(s,[['Controle bij € 4','Groep A','Groep B','Samen'],['Halfuren per week','24 − 3 × 4 = 12','36 − 3 × 4 = 24','12 + 24 = 36']],60,649,1480,157,[400,365,365,350],31);
 notes(s,'80–81','Bron A levert beide functies. Tel hoeveelheden bij dezelfde prijs op. De groep-A-grens van € 8 begrenst dit gezamenlijke lijnstuk. Bij de oude prijs € 4 is de gezamenlijke vraag 36 halfuren per week. De afzonderlijke berekeningen leveren 12 en 24; dezelfde som bevestigt de uitkomst.','Waarom staat het interval naast de somfunctie?','De ruwe somfunctie mag niet zonder meer boven € 8 gebruikt worden.','Reken met de oorspronkelijke functie terug naar een prijs.');
}
{
 const s=slide('Opgave 37b · De prijs bij 30 halfuren',tf);
 text(s,'30 = 60 − 6P\n30 + 6P = 60\n6P = 30\nP = € 5 per halfuur',60,219,1480,306,48,{bold:true});
 text(s,'Controle: 60 − 6 × 5 = 30 halfuren per week',60,600,1480,83,41,{bold:true,color:C.green});
 text(s,'€ 5 ligt binnen het geldige interval van € 0 tot en met € 8.',60,749,1480,82,35);
 notes(s,'81','Voeg aan beide kanten 6P toe, trek vervolgens 30 af, deel door 6. Controleer in de oorspronkelijke gezamenlijke functie én op het interval. Het antwoord is een prijs per halfuur.','Hoe controleer je zowel de algebra als de geldigheid?','Verwissel Q en P niet.','Splits de twee veranderingen uit bron B.');
}
{
 const s=slide('Opgave 37c · Twee oorzaken afzonderlijk',tf);
 text(s,'Alleen de tafeltennisprijs: € 4 naar € 6',60,201,1480,66,39,{bold:true,color:C.blue});
 text(s,'Q = 60 − 6 × 6 = 24 halfuren per week\nVan 36 naar 24: 12 halfuren minder, langs V₀.',60,294,1480,133,41);
 rule(s,60,463,1480);
 text(s,'Bowlen wordt duurder: prijs van een substituut',60,509,1480,75,39,{bold:true,color:C.orange});
 text(s,'Bij iedere prijs 12 halfuren per week meer vraag.\nDe tafeltennisvraag verschuift naar rechts.',60,625,1480,141,40);
 notes(s,'80–81','Het eigen-prijseffect is een daling van 36 naar 24. De andere specifieke factor is de hogere prijs van het substituut bowlen. Die verhoogt de vraag bij elke prijs op het gegeven interval. Dit is niet een onbenoemde smaakverandering. De tussenstap met alleen de tafeltennisprijs is analytisch, geen gemeten tijdsvolgorde.','Welke prijs veroorzaakt de beweging, welke de verschuiving?','Noem de onderzochte markt: tafeltennistijd.','Stel eerst de nieuwe functie op en bepaal de eindpunten.');
}
{
 const s=slide('Opgave 37d · De nieuwe lijn voorbereiden',tf);
 text(s,'V₁: Q = (60 − 6P) + 12 = 72 − 6P',60,207,1480,80,44,{bold:true,color:C.orange});
 text(s,'Alleen voor 0 ≤ P ≤ 8. Coördinaten: (Q; P).',60,319,1480,67,36);
 table(s,[['Prijs','Oorspronkelijke V₀','Nieuwe V₁'],['P = 0','Q = 60  →  (60; 0)','Q = 72  →  (72; 0)'],['P = 8','Q = 12  →  (12; 8)','Q = 24  →  (24; 8)']],60,445,1480,281,[260,610,610],34);
 text(s,'Verbind per lijn de twee eindpunten binnen het interval.',60,773,1480,61,34,{bold:true});
 notes(s,'80–81','Tel de constante toename 12 bij de oude functie. Vul de onder- en bovengrens van het gegeven prijsinterval in. Het gevraagde nieuwe lijnstuk eindigt bij (24; 8), niet op de P-as. De oude eindpunten zijn zichtbaar ter controle. Alle hoeveelheden zijn halfuren per week.','Waarom stoppen beide lijnen bij P = 8?','De rekenkundige P-asafsnede van de nieuwe formule valt buiten de gegeven geldigheid.','Teken eerst de oude situatie A en de tussenstap B op V₀.');
}
for(const stage of [1,2]){
 const s=slide(stage===1?'Opgave 37d · A en B op de oude lijn':'Opgave 37d · C op de nieuwe lijn',tf);
 text(s,stage===1?'A: oud · B: alleen de eigen prijsstijging':'C: beide veranderingen · verschuiving bij dezelfde prijs',60,184,1480,57,35,{bold:true,color:C.blue});chart(s,'target',stage);
 text(s,'A = (36; 4)\nB = (24; 6)'+(stage===2?'\nC = (36; 6)':''),1190,300,350,210,34,{bold:true});
 text(s,stage===1?'V₀: Q = 60 − 6P\n\nA naar B:\nlangs dezelfde lijn':'V₀: Q = 60 − 6P\nV₁: Q = 72 − 6P\n\nBij P = 6:\n24 naar 36',1190,573,350,246,31,{color:stage===1?C.blue:C.orange});
 notes(s,'80–81',stage===1?'A = (36; 4) is de oude situatie. B = (24; 6) ligt op dezelfde V₀ en stelt alleen de eigen-prijsverandering voor. Controleer 60 − 6 × 4 = 36 en 60 − 6 × 6 = 24. De assen zijn identiek aan de oorspronkelijke figuur in deze presentatie.':'De nieuwe V₁ loopt door (24; 8) en (72; 0). C = (36; 6) ligt op V₁: 72 − 6 × 6 = 36. De horizontale stippellijn van B naar C vergelijkt de vraag bij € 6. Deze afstand is 12 halfuren per week. A en C hebben dezelfde Q maar verschillende P. B blijft een denkstap; er is geen aanbod of evenwicht weergegeven.','Welke lijn hoort bij de oude en welke bij de gewijzigde omstandigheden?','Schrijf eerst de hoeveelheid en dan de prijs in een coördinaat.',stage===1?'Voeg V₁ en C toe met dezelfde assenschalen.':'Beoordeel de uitspraak over het gelijke totaal.');
}
{
 const s=slide('Opgave 37e · Gelijk totaal, twee effecten',tf);
 text(s,'Q nieuw = 72 − 6 × 6 = 36 halfuren per week',60,210,1480,78,42,{bold:true,color:C.green});
 table(s,[['Stap','Verandering (halfuren per week)'],['Alleen hogere tafeltennisprijs','−12'],['Hogere prijs van substituut bowlen','+12'],['Netto','0']],60,358,1480,304,[960,520],34);
 text(s,'De uitspraak is onjuist: de effecten heffen elkaar precies op.',60,733,1480,91,41,{bold:true,color:C.orange});
 notes(s,'81','De uiteindelijke vraag is 36, gelijk aan de oude hoeveelheid. De eigen prijs had wél effect: zonder de duurdere bowling zou de hoeveelheid 24 zijn. Het substituuteffect voegt 12 toe. Controle: 36 − 12 + 12 = 36 halfuren per week. Deze nulverandering is specifiek voor de gegeven effectgroottes.','Wat zou de vraag zijn zonder de verandering van de bowlingprijs?','Hetzelfde totaal bewijst niet dat er niets is veranderd.','Onderzoek tot slot Sem als koper binnen de groep.');
}
{
 const s=slide('Opgave 37f · Sem telt al mee',tf);
 table(s,[['Extra halfuur','Eerste','Tweede','Derde','Vierde'],['Betalingsbereidheid','€ 7','€ 6','€ 4','€ 2'],['Bij prijs € 6','Wel','Wel: gelijkheid','Niet','Niet']],60,237,1480,276,[440,250,290,250,250],31);
 text(s,'Sem wil 2 halfuren kopen bij € 6 per halfuur.',60,574,1480,83,43,{bold:true,color:C.green});
 text(s,'Hij zit al in groep A. Nogmaals optellen zou dubbeltelling zijn.',60,720,1480,104,40,{bold:true,color:C.orange});
 notes(s,'80–81','Vergelijk per halfuur: 7 ≥ 6 en 6 = 6, maar 4 < 6 en 2 < 6. Dus Sem wil twee halfuren. Zijn budget beperkt hem niet verder. De bron noemt hem expliciet als al meegeteld in A. Hij komt daarom niet bovenop de gezamenlijke 36. Zijn individuele beslissing illustreert een deel van de bestaande groep.','Welke bronzin voorkomt een extra optelling?','Een herkenbare persoon binnen een groepsbron is geen extra groep.','Controleer nu hoe ver de economische conclusie mag gaan.');
}
{
 const s=slide('Antwoordcontrole · Wat zegt de bron?');
 text(s,'36 halfuren tafeltennistijd per week gevraagd',60,235,1480,89,46,{bold:true,color:C.green});
 text(s,'Bij € 6 per halfuur, na beide veranderingen,\nonder de gegeven modelaannamen.',60,368,1480,133,42);
 rule(s,60,555,1480);
 text(s,'Aanbod en beschikbaarheid ontbreken.\nFeitelijke verkoop is hiermee niet vastgesteld.',60,604,1480,137,41,{bold:true,color:C.blue});
 text(s,'Verbeter één ontbrekende eenheid, controle of verklaring.',60,788,1480,48,32);
 notes(s,'49, 79–81','Loop het eigen antwoord na: a som, interval en groepscontrole; b prijs en controle; c specifieke oorzaken; d twee lijnstukken, assen, A/B/C; e berekening en twee effecten; f gelijkheid en geen dubbeltelling. De club onderzoekt de koopkant, niet de gerealiseerde transacties. Vraag en aanbod samen komen in hoofdstuk 1.3.','Welke extra informatie zou je nodig hebben voor een uitspraak over verkoop?','Gevraagde hoeveelheid is geen bewijs van werkelijk verkochte hoeveelheid.','Laat de afsluitende overzichtsdia staan.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...facts,slides,overviewSlides:overviews,tableSlides:tables,chartSlides:charts},null,2));
await fs.writeFile(path.join(BUILD,'graph-contracts.json'),JSON.stringify(graphContracts,null,2));
const draft=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(draft);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),draft]);
execFileSync(PYTHON,[path.join(HERE,'presentation-124-chart-labels.py'),draft]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),draft]);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(FINAL,facts.outputStem+'.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:SKILL+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'reference',families:[FONT],referencePath:path.resolve(HERE,'../../../../4veco-lessen',facts.acceptedReference.path),referenceSha256:facts.acceptedReference.sha256},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:BUILD+'/validation-final.json'});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
