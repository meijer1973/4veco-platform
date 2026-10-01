// HOW TO ADAPT: read the current manuscript, answers and complete-book footers.
// Keep new teaching data separate from assigned work. Reuse overview() unchanged.
// Runtime paths are supplied by the installed presentation runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('433');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',line:'#C6D2DB',pale:'#EFF4F7',muted:'#445B6B'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[],graphs=[];
const source='https://github.com/meijer1973/4veco-lessen/blob/e734532a42b27732ac25ce990fc9448b12309d28/edities/books34-v3/books/book-4/';
const E={old:220,new:180,b:10,a:-20,k:10,minW:2,maxW:18,xmax:200,ymax:20,xstep:40,ystep:4,w0:12,l0:100,w1:10,l1:80,fixedDemand:60};
const T={old:180,new:144,b:6,a:-12,k:6,minW:2,maxW:24,xmax:180,ymax:30,xstep:40,ystep:5,w0:16,l0:84,w1:13,l1:66,fixedDemand:48};
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,55),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:C.line,width:2}});}
function slide(title,example=false){
 const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,60,40,1480,88,title.startsWith('Deze les')?40:50,{bold:true});rule(s,60,146,1480);
 text(s,example?'Uitlegvoorbeeld — niet uit het boek':'§4.3.3 Werkloosheid en veranderingen op de arbeidsmarkt',60,848,1400,30,21,{color:C.muted});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted});slides.push({number:p.slides.items.length,title,example});return s;
}
function notes(s,pages,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, v3, book34-lesson-balance-v3-20260915, gedrukte complete-boekpagina ${pages}. ${source}output/Boek_4_Compleet_v3.pdf\nManuscript: ${source}chapters/4.3/4.3.3%20manuscript.md\nAntwoordmodel: ${source}chapters/4.3/Antwoorden.md#a433\n${example?'Uitlegvoorbeeld — niet uit het boek. Heuvelregio en de aparte fietsreparatiesector, inclusief alle aantallen en functies, zijn voor deze uitleg bedacht. Boekpagina’s onderbouwen uitsluitend de methode.':''}`);
}
function table(s,values,x=60,y=245,w=1480,h=360,widths=null,size=33){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths||Array(values[0].length).fill(w/values[0].length),values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:r%2?'#FFFFFF':C.pale;cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;
}
function rows(s,items,y=240,gap=125,size=43){items.forEach((r,i)=>text(s,r,60,y+i*gap,1480,gap-15,size,{bold:i===items.length-1,color:i===items.length-1?C.blue:C.ink}));}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Uitleg bij de lesdoelen.','Begin bij de basisopgaven en stel vragen. Lukt dat goed, ga dan naar de zelfstandige oefening. Maak daarna de doelopgave en kijk vervolgens je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 25.','Zet je huiswerk in je agenda.'];
function overview(phase,active){
 const s=slide('Deze les: §4.3.3 Werkloosheid en veranderingen op de arbeidsmarkt');overviews.push(p.slides.items.length);text(s,'Nu: '+phase,60,106,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});const ys=[244,336,390,446,636,716,774],hs=[80,45,45,177,73,50,52];
 route.forEach((r,i)=>{const color=active===i+1?C.blue:C.ink;text(s,String(i+1)+'.',60,ys[i],48,hs[i],30,{bold:true,color,name:'route-number-'+i});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color,name:'route-'+i});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Werkloosheid berekenen en\nverklaren. Flexibel en vast loon\nvergelijken. Model en telling\nonderscheiden.',972,240,565,142,30,{name:'overview-goals'});rule(s,972,387,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 137 · Opgaven 19 en 20\n20: verkennen met theorie\nop p. 132–133',972,455,565,111,30,{name:'overview-start'});rule(s,972,579,568);
 text(s,'Huiswerk',972,596,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.3.3\nBasis: 21 en 22\nZelfstandig: 23 en 24\nDoelopgave: 25\nMaken en nakijken',972,648,565,180,30,{name:'overview-homework'});
 notes(s,'124–126, 132–139',`Laat dit overzicht staan tijdens ${phase}. Start 19–20 staat op p. 137; basis 21 op p. 137 en 22 op p. 138; zelfstandig 23–24 op p. 138; doel 25 op p. 139. Huiswerk: 21,22,23,24,25 maken en nakijken. Bonus 26 en herhaling 27 zijn extra. Opgave 19 haalt beroepsbevolking en bruto-participatie uit §4.3.2 p. 124–125 op. Opgave 20 vraagt nieuwe leerstof: bij a de werkloosheidsnoemer op p. 132 en bij b frictiewerkloosheid op p. 133. Laat die uitleg lezen en twijfel noteren, zonder de oplossing vooraf te geven. Dit is ondersteunde verkenning, geen toets van beheerste voorkennis. Bij de tweede overview: laat 20 opnieuw beantwoorden en motiveren vóór 21. Bij twijfel herhaal dia 3 of 6. Startantwoorden voor de docent: 19 beroepsbevolking 2.800, bruto 70%; 20a nee, beroepsbevolking is de noemer; 20b frictiewerkloosheid. Docenteninformatie reserveert voorlopig twee lessen van 55 minuten; dat is geen gemeten tijdsfit. Verplaats de lesgrens zo nodig en behoud alle basisopgaven.`, 'Welke vraag vraagt om nieuwe uitleg?','De hoofdstukpaginanummers 20–28 zijn in het complete boek 132–140. Gebruik de gedrukte boekvoet.',active===7?'Noteer het huiswerk en rond af.':'Ga verder zodra de klas aan de volgende fase toe is.');return s;
}
function ser(name,points,color,width=4,labels=[]){return {name,xValues:points.map(v=>v[0]),values:points.map(v=>v[1]),line:{fill:color,width},marker:{symbol:'none'},dataLabelOverrides:labels.map(([idx,label,position='r'])=>({idx,text:label,position,showValue:false,showSeriesName:false,textStyle:{typeface:FONT,fontSize:25,fill:color,bold:true}}))};}
function graph(s,m,{shift=false,old=false,newPoint=false,fixed=false,arrow=false}={}){
 const ss=[],lp=(name,x,y,color=C.ink)=>ss.push({...ser(name,[[x,y]],color,0,[[0,name,'ctr']]),line:{fill:'none',width:0}});
 const guide=(name,pts,color=C.muted)=>ss.push({...ser(name,pts,color,1.4),line:{fill:color,width:1.4,style:'dashed'}});
 const point=(name,l,w,color)=>ss.push({...ser(name,[[l,w]],color,0),marker:{symbol:'circle',size:10}});
 if(old){guide('E0 horizontaal',[[0,m.w0],[m.l0,m.w0]]);guide('E0 verticaal',[[m.l0,0],[m.l0,m.w0]]);}
 if(newPoint){guide('E1 horizontaal',[[0,m.w1],[m.l1,m.w1]],C.orange);guide('E1 verticaal',[[m.l1,0],[m.l1,m.w1]],C.orange);}
 if(fixed){guide('vast loon',[[0,m.w0],[m.l0,m.w0]],C.orange);guide('vraag vast loon',[[m.fixedDemand,0],[m.fixedDemand,m.w0]]);guide('aanbod vast loon',[[m.l0,0],[m.l0,m.w0]]);}
 ss.push(ser('Arbeidsvraag oud',[[m.old-m.b*m.maxW,m.maxW],[m.old-m.b*m.minW,m.minW]],C.blue));
 ss.push(ser('Arbeidsaanbod',[[m.a+m.k*m.minW,m.minW],[m.a+m.k*m.maxW,m.maxW]],C.green));
 if(shift)ss.push({...ser('Arbeidsvraag nieuw',[[m.new-m.b*m.maxW,m.maxW],[m.new-m.b*m.minW,m.minW]],C.orange),line:{fill:C.orange,width:4,style:'dashed'}});
 const labelY=m===E?17.5:23;
 lp('Lᵥ oud',m.old-m.b*labelY+14,labelY+1.35,C.blue);lp('Lₐ',m.a+m.k*m.maxW+9,m.maxW+.8,C.green);
 if(shift)lp('Lᵥ nieuw',0,m.maxW+.9,C.orange);
 if(arrow){const wy=m===E?6:7,x0=m.old-m.b*wy,x1=m.new-m.b*wy;ss.push(ser('vraagverschuiving',[[x0,wy],[x1,wy]],C.orange,3));ss.push(ser('pijlpunt',[[x1+5,wy-.4],[x1,wy],[x1+5,wy+.4]],C.orange,3));}
 if(old){point('E0',m.l0,m.w0,C.blue);lp('E₀',m.l0+9,m.w0,C.blue);}
 if(newPoint){point('E1',m.l1,m.w1,C.orange);lp('E₁',m.l1-2,m.w1-2.2,C.orange);}
 if(fixed){point('nieuwe vraag bij vast loon',m.fixedDemand,m.w0,C.orange);point('aanbod bij vast loon',m.l0,m.w0,C.green);ss.push(ser('aanbodoverschot',[[m.fixedDemand,m.w0],[m.l0,m.w0]],C.orange,6));lp(String(m.fixedDemand),m.fixedDemand,-0+1.1,C.orange);lp(String(m.l0),m.l0,1.1,C.green);}
 const ax={numberFormatCode:'0',textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}};
 const ch=s.charts.add('scatter',{position:{left:45,top:208,width:1050,height:596},series:ss,scatterOptions:{style:'lineWithMarkers'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{...ax,min:0,max:m.xmax,majorUnit:m.xstep,title:{text:'L (personen)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}}},yAxis:{...ax,min:0,max:m.ymax,majorUnit:m.ystep,title:{text:'w (€ per uur)',textStyle:{typeface:FONT,fontSize:27,fill:C.ink}},majorGridlines:{fill:C.line,width:1}},chartFill:'#FFFFFF',plotAreaFill:'#FFFFFF'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);graphs.push({slide:p.slides.items.length,model:m,options:{shift,old,newPoint,fixed,arrow},series:ss});
}
overview('Startopdracht',2);
{
 const s=slide('Wat kun je na deze les?');
 [['Teller en noemer','Het werkloosheidspercentage berekenen.'],['Oorzaak','Conjuncturele en structurele werkloosheid verklaren.'],['Arbeidsmarktmodel','Een vraagverschuiving verwerken bij flexibel en vast loon.'],['Aannamen','Uitleggen waarom een model een regiotelling niet vervangt.']].forEach((a,i)=>{text(s,a[0],60,220+i*146,470,60,39,{bold:true,color:C.blue});text(s,a[1],570,220+i*146,965,105,36);});
 notes(s,'132–136','Verbind de doelen met de drie delen van opgave 25. Oorzaak en modelaannamen horen bij het antwoord, naast de berekeningen.','Welke grootheid wil je berekenen als iemand vraagt hoeveel mensen werkloos zijn?','Minder werkgelegenheid is niet automatisch hetzelfde aantal extra werklozen.','Haal de groepen en de eerdere noemer op.');
}
{
 const s=slide('Dezelfde groepen, een andere noemer');
 text(s,'Beroepsbevolking = werkenden + werklozen',60,204,1480,70,46,{bold:true,color:C.blue});
 table(s,[['Percentage','Teller','Noemer'],['Bruto-participatie','Beroepsbevolking','Bevolking van 15 tot 75 jaar'],['Werkloosheidspercentage','Werklozen','Beroepsbevolking']],60,320,1480,320,[560,440,480],33);
 text(s,'Werkloos: geen betaald werk, recent gezocht én direct beschikbaar.',60,705,1480,98,36,{bold:true});
 notes(s,'124–125, 132','Haal de definitie uit §4.3.2 op. De beroepsbevolking omvat beide groepen. Bij bruto-participatie is de bevolking de noemer. Voor werkloosheid kiezen we nu de beroepsbevolking. Benoem expliciet de verandering van noemer, zonder opgave 20 al uit te werken.','Bij welke groep hoort iemand die niet werkt en niet zoekt?','Niet iedereen zonder baan is werkloos. Een gegeven beroepsbevolking bevat de werklozen al.','Pas dit toe op een nieuwe, fictieve regio.');
}
{
 const s=slide('Werkloosheid in Heuvelregio',true);
 table(s,[['Werkenden','Werklozen','Vacatures'],['1.380 personen','120 personen','75 plaatsen']],60,208,1480,180,null,36);
 text(s,'Elke werkende heeft één baan.',60,416,1480,48,32);
 rows(s,['Beroepsbevolking = 1.380 + 120 = 1.500 personen','Werkloosheidspercentage = 120 / 1.500 × 100%','8% van de beroepsbevolking is werkloos.'],493,111,41);
 notes(s,'132, 136','Eigen fictieve regiotelling. Tel eerst de beroepsbevolking, deel vervolgens de 120 werklozen door 1.500 en vermenigvuldig met 100%. Elke werkende heeft precies één baan; één vacature staat hier voor één gezochte werknemer.','Welke mensen vormen samen de noemer?','De 75 vacatures zijn geen mensen die al een baan hebben gevonden.','Onderzoek waarom aanbod min vraag hier misleidt.',true);
}
{
 const s=slide('Een vacature is nog niet vervuld',true);
 table(s,[['Telling in Heuvelregio','Berekening','Uitkomst'],['Arbeidsaanbod','1.380 + 120','1.500 personen'],['Arbeidsvraag','1.380 + 75','1.455 plaatsen'],['Aanbod min vraag','1.500 − 1.455','45']],60,219,1480,350,[580,450,450],35);
 text(s,'45 = 120 werklozen − 75 vacatures',60,615,1480,72,45,{bold:true,color:C.orange});
 text(s,'De 120 werkzoekenden hebben nog geen baan.',60,723,1480,80,43,{bold:true});
 notes(s,'132–133','In dit voorbeeld zijn personen en banen gekoppeld. Werkenden komen in beide totalen voor en vallen bij aftrekken weg. Je houdt werklozen min vacatures over. Een vacature kan andere vaardigheden, werktijden of een andere reisafstand vragen dan een werkzoekende kan bieden.','Wat trekt de berekening van 45 ten onrechte van de werklozen af?','Ook met veel vacatures kunnen mensen werkloos blijven. Zonder de een-op-eenafspraak mag je banen en personen niet zomaar aftrekken.','Verbind werkloosheid aan de oorzaak in de bron.',true);
}
{
 const s=slide('De oorzaak bepaalt het type werkloosheid');
 table(s,[['Wat beschrijft de bron?','Mechanisme','Type'],['Huishoudens besteden minder','Minder verkopen, minder personeel nodig','Conjunctureel'],['Werk vraagt andere vaardigheden','Arbeid en banen passen onvoldoende bij elkaar','Structureel'],['Tijd nodig tussen passende banen','Zoeken en overstappen kosten tijd','Frictie: hier onderdeel van structureel']],60,218,1480,467,[515,565,400],33);
 text(s,'Een typering krijgt betekenis door de oorzaak uit de bron.',60,735,1480,80,39,{bold:true,color:C.blue});
 notes(s,'133','De voorbeelden in de tabel zijn algemene mechanismen, geen uitwerkingen van de toegewezen opgaven. Structurele mismatch kan ook tussen regio’s bestaan. Frictie rekenen we in deze editie tot structurele werkloosheid. Lang werkloos zijn of weinig vacatures zien is op zichzelf onvoldoende om de oorzaak vast te stellen.','Welke broninformatie onderscheidt een bestedingsprobleem van een mismatch?','Frictie betekent niet automatisch dat de vaardigheden niet passen. Ook een passende match kost zoektijd.','Gebruik een afzonderlijke sector om loonaanpassing te onderzoeken.');
}
{
 const s=slide('Een aparte sector: fietsreparaties',true);
 text(s,'Huishoudens stellen reparaties uit en besteden minder.',60,190,1480,70,39,{bold:true});
 table(s,[['Functie','Vóór de daling','Na de daling'],['Arbeidsvraag','Lᵥ = 220 − 10w','Lᵥ = 180 − 10w'],['Arbeidsaanbod','Lₐ = −20 + 10w','Lₐ = −20 + 10w']],60,304,1480,273,[510,485,485],36);
 text(s,'L: personen, ieder één baan van 20 uur per week.\nw: euro per uur. Geldig voor € 2 ≤ w ≤ € 18.',60,614,1480,100,33);
 text(s,'Geen vacatures of zoekproblemen. Eerst kan het loon vrij aanpassen.',60,754,1480,78,35,{bold:true,color:C.blue});
 notes(s,'134–136','Dit is een eigen sectorvoorbeeld, los van de regiotelling op dia 4–5. Het loon is aanvankelijk flexibel. Vergelijkbare arbeid, geen mismatch, één persoon per baan. Minder bestedingen verlagen opdrachten en arbeidsvraag: conjuncturele oorzaak. We veranderen alleen de arbeidsvraagfunctie.','Welke functie blijft gelijk?','De 1.500 personen uit Heuvelregio zijn geen hoeveelheid in deze aparte sectorfunctie.','Bereken eerst het oude evenwicht als uitgangspunt.',true);
}
{
 const s=slide('Het oude evenwicht',true);graph(s,E,{old:true});
 text(s,'Lᵥ = Lₐ',1118,228,422,60,39,{bold:true,color:C.blue});text(s,'220 − 10w\n= −20 + 10w\n\n240 = 20w\nw = € 12 per uur\n\nL = 220 − 120\nL = 100 personen',1118,315,422,418,33);
 notes(s,'126, 134','Bekende methode uit §4.3.2: gelijkstellen, oplossen, invullen en controleren in de andere functie. Aanbodcontrole: −20 + 10 × 12 = 100. Het punt noteer je als (L;w) = (100;12), hoeveelheid eerst. De hulplijnen wijzen naar beide assen.','Waarom schrijf je 100 horizontaal en 12 verticaal?','De oude werkgelegenheid is 100 personen, niet 100 euro.','Voeg de nieuwe vraaglijn toe op exact dezelfde assen.',true);
}
{
 const s=slide('Minder opdrachten verschuiven de arbeidsvraag',true);graph(s,E,{shift:true,old:true,arrow:true});
 text(s,'Bij elk loon:',1118,238,422,50,35,{bold:true});text(s,'40 personen\nminder gevraagd',1118,307,422,128,38,{bold:true,color:C.orange});text(s,'Minder bestedingen\nMinder reparaties\nMinder arbeidsvraag',1118,480,422,161,33);text(s,'De aanbodlijn\nblijft gelijk.',1118,713,422,94,34,{bold:true,color:C.green});
 notes(s,'133–134','De horizontale pijl vergelijkt bij hetzelfde loon van € 6: oud 160, nieuw 120 personen. Dat verschil van 40 geldt bij ieder gegeven loon. De hele vraaglijn verschuift naar links. Het loon daalt vervolgens als reactie op die verschuiving.','Is minder loon de oorzaak van de vraagverschuiving?','De daling van het loon is een uitkomst, niet de reden voor de verschuiving.','Los het nieuwe evenwicht op.',true);
}
{
 const s=slide('Het nieuwe evenwicht bij flexibel loon',true);
 rows(s,['180 − 10w = −20 + 10w','200 = 20w, dus w = € 10 per uur','Lᵥ = 180 − 10 × 10 = 80 personen','Controle: Lₐ = −20 + 10 × 10 = 80 personen'],223,137,43);
 notes(s,'134, 136','Gebruik de nieuwe vraag en ongewijzigde aanbodfunctie. Los eerst het loon op, vul dan in voor de hoeveelheid. Controleer in de andere functie. Beide hoeveelheden zijn 80, binnen het geldige loondomein.','In welke twee functies controleer je de uitkomst?','Gelijkstellen met de oude vraag zou het oude evenwicht teruggeven.','Verbind de berekende uitkomst met het nieuwe snijpunt.',true);
}
{
 const s=slide('Een verschuiving en een beweging langs een lijn',true);graph(s,E,{shift:true,old:true,newPoint:true});
 text(s,'E₀ = (100; 12)\nE₁ = (80; 10)',1118,238,422,121,36,{bold:true});text(s,'Vraag: verschuiving\nnaar links',1118,434,422,114,35,{bold:true,color:C.orange});text(s,'Aanbod: beweging\nlangs dezelfde lijn',1118,614,422,115,35,{bold:true,color:C.green});
 notes(s,'134','Markeer eerst L = 80 op de horizontale as en w = 10 op de verticale as. Het nieuwe snijpunt ligt linksonder van het oude op dezelfde aanbodlijn. Bij het lagere loon bieden minder mensen arbeid aan. Het aanbodoverschot is nul, hoewel de werkgelegenheid daalt van 100 naar 80.','Waarom tekenen we geen nieuwe aanbodlijn?','Een lagere aangeboden hoeveelheid is hier een beweging langs de lijn, geen verschuiving van het aanbod.','Vergelijk dezelfde vraagdaling met een loon dat blijft staan.',true);
}
{
 const s=slide('Dezelfde vraagdaling bij vast loon',true);
 text(s,'Nieuwe aanname: het uurloon blijft voorlopig € 12.',60,198,1480,75,40,{bold:true,color:C.orange});
 rows(s,['Nieuwe vraag: Lᵥ = 180 − 10 × 12 = 60 personen','Aanbod: Lₐ = −20 + 10 × 12 = 100 personen','Aanbodoverschot = 100 − 60 = 40 personen'],322,140,42);
 text(s,'Alle 60 gevraagde plaatsen worden gevuld.',60,770,1480,65,35,{bold:true});
 notes(s,'135–136','De functies veranderen niet opnieuw. Alleen de loonaanname verandert. Door loonafspraken blijft het uurloon bijvoorbeeld op het oude niveau. Zonder vacatures en mismatch vult de sector alle 60 gevraagde plaatsen. De overige 40 aanbieders willen werken, zoeken en zijn beschikbaar.','Waarom stellen we de functies nu niet gelijk?','Een vast loon vul je in beide functies in. Je zoekt nu geen vrij evenwichtsloon.','Lees het horizontale verschil in de grafiek.',true);
}
{
 const s=slide('Het aanbodoverschot bij € 12',true);graph(s,E,{shift:true,fixed:true});
 text(s,'60 gevraagd\n100 aangeboden',1118,238,422,132,37,{bold:true});text(s,'100 − 60 = 40\npersonen',1118,441,422,120,40,{bold:true,color:C.orange});text(s,'Horizontaal verschil\nbij hetzelfde loon',1118,649,422,120,34);
 notes(s,'135','Lees de twee snijpunten met de horizontale loonlijn: nieuwe vraag 60 en aanbod 100. Het dikke horizontale segment geeft precies 40 personen. Onder de afgesproken voorwaarden is dat modelwerkloosheid.','Welke as meet de omvang van het overschot?','Meet geen verticaal loonverschil en trek hier niet de oude van de nieuwe werkgelegenheid bij flexibel loon af.','Vergelijk beide loonafspraken naast elkaar.',true);
}
{
 const s=slide('De loonaanname verandert de uitkomst',true);
 table(s,[['Na dezelfde vraagdaling','Flexibel loon','Vast loon'],['Uurloon','€ 10','€ 12'],['Werkgelegenheid','80 personen','60 personen'],['Aangeboden arbeid','80 personen','100 personen'],['Aanbodoverschot','0 personen','40 personen']],60,222,1480,425,[650,415,415],34);
 text(s,'De sectorberekening vervangt de telling van Heuvelregio niet.',60,704,1480,108,39,{bold:true,color:C.blue});
 notes(s,'134–136','Bij flexibel loon willen bij € 10 nog 80 mensen arbeid aanbieden en vinden zij alle 80 werk. Bij vast loon zijn er 100 aanbieders en 60 banen. Dit model laat zoekproblemen en vaardighedenverschillen weg; het bewijst niet dat werkelijke werkloosheid geheel uit vaste lonen volgt. In de aparte regiotelling bleven 120 werklozen.','Bewijst een modeloverschot van nul dat Heuvelregio geen werklozen heeft?','Tel de 40 uit het sectormodel niet op bij de 120 uit de regio en vervang die 120 er niet door.','Controleer begrip met dezelfde voorbeeldsituatie.',true);
}
{
 const s=slide('Korte controle',true);
 rows(s,['Bij flexibel loon daalt de werkgelegenheid van 100 naar 80.','Is het aanbodoverschot dan 20 personen?','Leg uit met de nieuwe vraag én het nieuwe aanbod.'],247,165,42);
 notes(s,'134–136','Laat leerlingen kort zelf uitleggen. Antwoord na hun reactie: nee, bij € 10 zijn vraag en aanbod beide 80, zodat het overschot nul is. De 20 is de afname van werkgelegenheid ten opzichte van het oude evenwicht. Bij vast loon gold juist 40 aanbodoverschot.','Welk onderscheid maakt het antwoord volledig?','Banenverlies is niet automatisch het nieuwe aanbodoverschot.','Keer terug naar opgave 20, laat verbeteren en start dan basiswerk 21–22.',true);
}
overview('Oefenen',4);
{
 const s=slide('Opgave 25 · Rivierenregio: cijfers en een sector');
 text(s,'Bron A',60,191,1480,55,38,{bold:true,color:C.blue});
 text(s,'De regio telt 2.700 werkenden, 300 werklozen en 120 vacatures.\nIedere werkende heeft één baan.',60,269,1480,159,40);
 rule(s,60,468,1480);text(s,'25a (3p)',60,509,1480,55,38,{bold:true,color:C.blue});
 text(s,'Bereken met bron A het werkloosheidspercentage. Leg uit waarom\narbeidsaanbod min arbeidsvraag hier niet de werkloosheid geeft.',60,597,1480,176,40);
 notes(s,'139','Letterlijke bron A en deelvraag a. Laat leerlingen bron, teller, noemer en gevraagde verklaring aanwijzen. Geef nog geen oplossingen; bron B, vragen b–c en de basisgrafiek volgen eerst.','Welke informatie beschrijft een waarneming?','De volgende sector is een afzonderlijke modelbron.','Lees eerst ook bron B en alle resterende vragen.');
}
{
 const s=slide('Opgave 25 · Bron B');
 text(s,'In een afzonderlijke sector nemen de opdrachten af doordat\nhuishoudens minder besteden.',60,196,1480,107,39);
 table(s,[['Arbeidsvraag oud','Arbeidsvraag nieuw','Arbeidsaanbod blijft'],['Lᵥ = 180 − 6w','Lᵥ = 144 − 6w','Lₐ = −12 + 6w']],60,343,1480,183,[493,494,493],34);
 text(s,'L is het aantal personen. w is het uurloon in euro.\n€ 2 ≤ w ≤ € 24. Het oude evenwicht is € 16 en 84 personen.\nEr zijn in dit sector-model geen vacatures of zoekproblemen.',60,587,1480,192,37);
 notes(s,'139','Complete bron B, alleen verdeeld over een native tabel en tekst. Het oude evenwicht is gegeven en is geen onthulling van de gevraagde nieuwe uitkomst. Houd de sector en regio strikt gescheiden.','Welke aanname maakt het verschil tussen deze bron en bron A?','Gebruik niet de aantallen van bron A in de sectorfuncties.','Maak de twee resterende deelvragen beschikbaar.');
}
{
 const s=slide('Opgave 25 · Vragen b en c');
 text(s,'25b (3p)',60,205,1480,60,40,{bold:true,color:C.blue});text(s,'Benoem met bron B de oorzaak en bereken het nieuwe\nevenwicht als het loon vrij aanpast.',60,291,1480,141,42);
 rule(s,60,477,1480);text(s,'25c (3p)',60,527,1480,60,40,{bold:true,color:C.blue});text(s,'Markeer het oude en nieuwe evenwicht in de basisgrafiek.\nBereken daarna het aanbodoverschot bij een loon dat € 16 blijft.',60,615,1480,164,42);
 notes(s,'139','Letterlijke deelvragen b en c. Alle drie deelvragen zijn nu beschikbaar. Toon hierna de basisgrafiek zonder ingevulde evenwichtspunten.','Welke twee loonafspraken moet je bij b en c uit elkaar houden?','Een berekening van een nieuw evenwicht beantwoordt nog niet de vraag naar het overschot bij vast loon.','Toon de oningevulde basisgrafiek.');
}
{
 const s=slide('Opgave 25 · Basisgrafiek');graph(s,T,{shift:true});
 text(s,'Lᵥ oud = 180 − 6w\nLᵥ nieuw = 144 − 6w\nLₐ = −12 + 6w',1118,246,422,187,31,{bold:true});text(s,'L: personen\nw: euro per uur',1118,492,422,108,33);text(s,'€ 2 ≤ w ≤ € 24',1118,683,422,62,32,{bold:true});
 notes(s,'139','Native reconstructie van figuur 16 met dezelfde functies, assen en schaal. E0 en E1 zijn nog niet ingevuld. De getekende functies zijn begrensd tot het in bron B gegeven loondomein van 2 tot 24 euro. Laat leerlingen het complete werk eerst tonen of vergelijken.','Waar komen hoeveelheid en uurloon op de assen?','De twee snijpunten moeten bij de juiste oude of nieuwe vraagfunctie horen.','Start pas nu de stapsgewijze uitwerking van a.');
}
{
 const s=slide('Opgave 25a · Het werkloosheidspercentage');
 rows(s,['Beroepsbevolking = werkenden + werklozen','= 2.700 + 300 = 3.000 personen','Werkloosheidspercentage = 300 / 3.000 × 100%','= 10%'],224,139,44);
 notes(s,'139','Stap 1 bepaalt de noemer met bron A. Stap 2 deelt de 300 werklozen door 3.000. De controle is 10% van 3.000 = 300. De 120 vacatures zijn niet in de beroepsbevolking meegeteld.','Welke groep zit in de 3.000?','De noemer is niet alleen de 2.700 werkenden.','Werk de tweede helft van vraag a uit.');
}
{
 const s=slide('Opgave 25a · Waarom aanbod min vraag niet werkt');
 rows(s,['Arbeidsvraag = 2.700 + 120 = 2.820 plaatsen','Arbeidsaanbod − arbeidsvraag = 3.000 − 2.820 = 180','180 = 300 werklozen − 120 vacatures'],217,142,41);
 text(s,'Er zijn nog steeds 300 werklozen. De vacatures zijn niet vervuld.',60,709,1480,102,41,{bold:true,color:C.orange});
 notes(s,'139','Werkenden tellen in vraag en aanbod mee en vallen bij aftrekken weg. De fout is dat je de 120 nog onvervulde vacatures aftrekt van de 300 werklozen. Het antwoordmodel telt in deze bron één werkende per baan.','Waarom is 180 geen werkloosheidstelling?','Een vacature vervult zichzelf niet. Bron A kan mismatch en zoektijd bevatten.','Wissel expliciet naar de afzonderlijke sector uit bron B.');
}
{
 const s=slide('Opgave 25b · Oorzaak en nieuw evenwicht');
 text(s,'Conjunctureel: minder bestedingen, minder opdrachten,\nminder arbeidsvraag.',60,191,1480,106,40,{bold:true,color:C.blue});
 rows(s,['144 − 6w = −12 + 6w','156 = 12w, dus w = € 13 per uur','Lᵥ = 144 − 6 × 13 = 66 personen','Controle: Lₐ = −12 + 6 × 13 = 66 personen'],346,111,40);
 notes(s,'139','Bron B noemt de daling van huishoudelijke bestedingen als oorzaak. Dat ondersteunt conjunctureel. Gebruik de nieuwe vraagfunctie, stel gelijk aan aanbod en controleer beide zijden. De nieuwe werkgelegenheid is 66 personen in de sector.','Welke woorden uit de bron onderbouwen conjunctureel?','Het antwoord geeft geen nieuw percentage voor de regio.','Plaats beide evenwichtspunten in de grafiek.');
}
{
 const s=slide('Opgave 25c · Het oude en nieuwe evenwicht');graph(s,T,{shift:true,old:true,newPoint:true});
 text(s,'E₀ = (84; 16)\nE₁ = (66; 13)',1118,245,422,128,38,{bold:true});text(s,'Eerst L horizontaal,\ndan w verticaal.',1118,466,422,110,34);text(s,'Lagere werkgelegenheid\nen een lager uurloon',1118,675,422,116,33,{bold:true,color:C.orange});
 notes(s,'139','E0 ligt bij oude vraag en aanbod, E1 bij nieuwe vraag en dezelfde aanbodlijn. Controle oud: 180 − 96 = 84 en −12 + 96 = 84. Nieuw: beide 66 bij 13. De hulplijnen sluiten aan op de berekende aswaarden. Het lagere loon geeft een beweging langs de ongewijzigde aanbodlijn.','Hoe zie je welke twee lijnen bij E1 horen?','Schrijf (84;16), niet (16;84): het zijn coördinaten (L;w).','Houd nu het oude loon vast voor het tweede deel van c.');
}
{
 const s=slide('Opgave 25c · Het loon blijft € 16');
 rows(s,['Nieuwe vraag: Lᵥ = 144 − 6 × 16 = 48 personen','Aanbod: Lₐ = −12 + 6 × 16 = 84 personen','Aanbodoverschot = 84 − 48 = 36 personen'],239,157,43);
 text(s,'Geen vacatures of zoekproblemen: 48 plaatsen worden gevuld.',60,767,1480,65,35,{bold:true});
 notes(s,'139','Vul 16 in, niet het zojuist gevonden flexibele loon van 13. Beide hoeveelheden staan in personen. Het overschot is 36, gegeven de modelvoorwaarden. Controle: 48 werkenden + 36 niet-geplaatste aanbieders = 84 aanbieders.','Waarom gebruiken we de nieuwe vraagfunctie en het oude loon?','84 − 66 = 18 is de afname van werkgelegenheid bij flexibel loon; het is niet dit overschot.','Verbind de uitkomst met het horizontale segment.');
}
{
 const s=slide('Opgave 25c · Een horizontaal verschil van 36');graph(s,T,{shift:true,fixed:true});
 text(s,'Bij € 16 per uur:',1118,245,422,65,35,{bold:true});text(s,'48 gevraagd\n84 aangeboden',1118,352,422,131,38);text(s,'84 − 48 = 36\npersonen',1118,583,422,129,41,{bold:true,color:C.orange});
 notes(s,'139','De horizontale lijn bij 16 snijdt de nieuwe vraag bij 48 en het aanbod bij 84. Onder deze modelaannamen zijn 36 mensen zonder sectorbaan. Dit is niet de regiotelling van bron A, waar 300 mensen werkloos zijn.','Welk getal blijft de gemeten regionale werkloosheid?','Een modeluitkomst van 36 vervangt de waarneming van 300 niet.','Controleer de volledige beantwoording en verbeter één stap.');
}
{
 const s=slide('Antwoordcontrole bij opgave 25');
 table(s,[['Onderdeel','Volledig antwoord bevat'],['a','3.000 als noemer, 10%, en de fout van vacatures aftrekken'],['b','Conjuncturele oorzaak, € 13 per uur en 66 personen'],['c','E₀ (84;16), E₁ (66;13), en 84 − 48 = 36 personen']],60,226,1480,381,[315,1165],35);
 text(s,'Verbeter één berekening, eenheid of ontbrekende redenering.',60,705,1480,103,40,{bold:true,color:C.blue});
 notes(s,'139','Laat leerlingen hun eigen antwoordmodel vergelijken. Berekeningen, coördinaten, juiste eenheden en brongebonden verklaringen tellen mee. Laat benoemen waarom de twee bronnen apart blijven.','Welke stap ontbreekt nog in jouw uitwerking?','Alleen eindgetallen noemen dekt de gevraagde uitleg en grafiek niet.','Keer terug naar dezelfde overview en noteer het huiswerk.');
}
overview('Afsluiting / huiswerk',7);
await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({slides,overviews,tables,charts,graphs},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await(await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),candidate]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'4.3.3 Werkloosheid en veranderingen op de arbeidsmarkt – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({final:result.finalPath,slides:slides.length,overviews,tables,charts,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed}));
