// HOW TO ADAPT: read the classroom recipe and full source questions/answers.
// Update the adjacent source manifest and derive all geometry from the functions.
// Runtime paths are supplied through build-scripts/presentations/runtime.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
 PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';

const authored=JSON.parse(await fs.readFile(fileURLToPath(new URL('./presentation-234.manifest.json',import.meta.url)),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('234');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#17658A',green:'#20665B',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',cs:'#BBDDF1',ps:'#B5E7CC',loss:'#F4BCB4'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[],geometry=[];
const base=`https://github.com/meijer1973/4veco-lessen/blob/${authored.sourceCommit}/`+encodeURI(authored.sourceEdition)+'/';
const foot='§2.3.4 Gemengde opgaven';
const targetFoot=foot+' · Opgave 3 · Boekpagina 105–106';
const exampleFoot=foot+' · Uitlegvoorbeeld — niet uit het boek';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=foot){const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,52,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;}
function notes(s,page,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: ${example?'Zelfgemaakt uitlegvoorbeeld Kano’s. Context, gegevens en uitkomsten zijn niet uit het boek. Methoden: ':''}Leerlingenboek Boek 2, chat-2026, gedrukte pagina ${page}. ${base}boek/Boek_2_Compleet.pdf\nAntwoordmodel: ${base}bronnen/H3/${encodeURIComponent('2.3 Surplus en welvaart – antwoorden.md')}${example?' (alleen boekopgaven, niet de verzonnen kanomarkt).':''}`);}
function table(s,values,x,y,w,h,widths,size=32){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const z=t.getCell(r,c);z.fill=r===0?C.ink:(r%2?C.paper:C.pale);z.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 3.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){const s=slide('Deze les: §2.3.4 Gemengde opgaven');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,606,700,774],hs=[80,45,45,125,73,65,52];
 route.forEach((r,i)=>{let col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Evenwicht en surplus berekenen.\nWelvaartsverlies bepalen.\nEfficiëntie en eerlijkheid scheiden.',972,244,565,123,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 102 · Opgave 1\nSteun: theorie p. 83–85',972,459,565,95,30,{name:'overview-start',bold:active===2});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§2.3.4 · Opgaven 1, 2, 3, 4, 5, 6, 7\n4 = bonus · 5–7 = herhaling\nVerder: 2 · Doelopgave: 3\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework',bold:active===7});
 notes(s,'102–107',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start is opgave 1 (p. 102). Er is geen afzonderlijke basis- of zelfstandige sectie: werk na 1 verder aan 2 (p. 103–104) en doel 3 (p. 105–106). Het huiswerk volgens de classroomroute is alle gemengde opgaven 1, 2, 3, 4, 5, 6 en 7 maken en nakijken, met het bonuslabel bij 4 en herhaling bij 5–7 behouden. Dit is een ruimere huiswerkopdracht dan de gedifferentieerde boekroute. De volledige route hoeft niet in één les af te zijn. Start 1 haalt werkelijk onderwezen stof uit §2.3.2 p. 83–85 op: functies gelijkstellen, driehoeken, vergelijking betalingsbereidheid/MK en de grens tussen maximaal TS en eerlijkheid. Bij moeite laat je die uitleg gebruiken en hun eerste vastgelopen stap aanwijzen. Terug bij dit overzicht vóór verder oefenen laat je het startantwoord verbeteren. Meer TS alleen bewijst geen gelijk voordeel voor iedereen.`, 'Waar loopt jouw berekening of redenering vast?', 'De paginanummers zijn de gedrukte boekvoeten. Page 102 is fysieke PDF-pagina 104. Geen nieuwe theorie aannemen op basis van een eerdere paragraaftitel.',active===7?'Laat het volledige huiswerk in de agenda zetten.':'Volg de aangegeven lesfase.');
 return s;}

// Every shaded diagram uses the same numeric XY chart viewport. Fixed inner
// plot layout is applied to the saved chart XML before finalization.
const box={left:60,top:222,width:960,height:590};
const frac={x:.14,y:.06,w:.82,h:.80};
const plot={left:box.left+box.width*frac.x,top:box.top+box.height*frac.y,width:box.width*frac.w,height:box.height*frac.h};
function graph(s,{maxQ=80,maxP=80,d0=80,ds=1,a0=20,as=.5,price=null,cut=null,equilibrium=false,regions=[],splits=[]}={}){
 const X=q=>plot.left+q/maxQ*plot.width,Y=v=>plot.top+(1-v/maxP)*plot.height;
 const polys=[];
 for(const [name,pts,fill] of regions){const xs=pts.map(a=>X(a[0])),ys=pts.map(a=>Y(a[1]));const l=Math.min(...xs),t=Math.min(...ys),w=Math.max(...xs)-l,h=Math.max(...ys)-t;
  const commands=pts.map((a,i)=>({[i?'lineTo':'moveTo']:{x:X(a[0])-l,y:Y(a[1])-t}}));commands.push({close:{}});
  s.shapes.add({geometry:'custom',name:'area-'+name,position:{left:l,top:t,width:w,height:h},fill,line:{fill:'none',width:0},customPaths:[{width:w,height:h,commands}]});polys.push({name,points:pts,position:{left:l,top:t,width:w,height:h},commands});}
 const endQ=Math.min(maxQ,d0/ds),aEnd=Math.min(maxQ,(maxP-a0)/as);
 const series=[{name:'V',xValues:[0,endQ],values:[d0,d0-ds*endQ],line:{fill:C.blue,width:4},marker:{symbol:'none'}},{name:'A = MK',xValues:[0,aEnd],values:[a0,a0+as*aEnd],line:{fill:C.green,width:4},marker:{symbol:'none'}}];
 const qe=(d0-a0)/(ds+as),pe=d0-ds*qe;
 if(price!==null)series.push({name:'Transactieprijs',xValues:[0,maxQ],values:[price,price],line:{fill:C.orange,width:2.5,style:'dashed'},marker:{symbol:'none'}});
 if(cut!==null)series.push({name:'Boekingsgrens',xValues:[cut,cut],values:[0,maxP],line:{fill:C.muted,width:2,style:'dashed'},marker:{symbol:'none'}});
 if(equilibrium){series.push({name:'Pe',xValues:[0,qe],values:[pe,pe],line:{fill:C.muted,width:1.5,style:'dashed'},marker:{symbol:'none'}});series.push({name:'Qe',xValues:[qe,qe],values:[pe,0],line:{fill:C.muted,width:1.5,style:'dashed'},marker:{symbol:'none'}});series.push({name:'E',xValues:[qe],values:[pe],line:{fill:C.ink,width:0},marker:{symbol:'circle',size:9,fill:C.ink}});}
 for(const v of splits)series.push({name:'Splitsing '+v,xValues:[0,cut],values:[v,v],line:{fill:C.muted,width:1.4,style:'dashed'},marker:{symbol:'none'}});
 const ch=s.charts.add('scatter',{position:box,series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:maxQ,majorUnit:maxQ===80?10:4,numberFormatCode:'0',title:{text:'Q (huurfietsen)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:maxP,majorUnit:10,numberFormatCode:'0',title:{text:'P (€ per huurfiets)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:.6},line:{fill:C.ink,width:1.5}},chartFill:'none',plotAreaFill:'none'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,'V',X(69),Y(11)-45,60,38,28,{bold:true,color:C.blue});text(s,'A = MK',X(63),Y(51.5)-52,150,38,28,{bold:true,color:C.green});
 if(equilibrium)text(s,'E',X(qe)+12,Y(pe)-42,50,40,27,{bold:true});
 if(price!==null)text(s,'P = '+price,X(62),Y(price)+8,150,36,26,{bold:true,color:C.orange});
 if(cut!==null)text(s,'Q = '+cut,X(cut)-50,plot.top-44,145,37,26,{bold:true,color:C.muted});
 for(const v of splits)text(s,String(v),X(cut)+10,Y(v)-36,75,34,25,{bold:true,color:C.muted});
 geometry.push({slide:p.slides.items.length,box,frac,plot,maxQ,maxP,d0,ds,a0,as,price,cut,equilibrium,regions:polys,series});
 return {X,Y};}
function right(s,heading,body,tail='',color=C.blue){text(s,heading,1080,226,460,70,38,{bold:true,color});text(s,body,1080,322,460,340,34);if(tail)text(s,tail,1080,689,460,128,34,{bold:true,color});}

overview('Startopdracht',2);
{
 const s=slide('Aanpak bij gemengde opgaven');
 const rows=[['1 · Hoeveelheid','Vrij evenwicht of werkelijke transacties?'],['2 · Gebied','Wie handelt? Waar stoppen CS en PS?'],['3 · Berekening','Basis en hoogte, euro’s, daarna CS + PS.'],['4 · Beoordeling','Verlies, haalbare verbetering en eerlijkheid.']];
 rows.forEach((r,i)=>{const y=217+i*144;text(s,r[0],60,y,485,65,39,{bold:true,color:C.blue});text(s,r[1],570,y,970,90,37);if(i<3)rule(s,60,y+110,1480);});
 notes(s,'83–85, 91–96','Haal de bestaande rekenroute op. In het vrije evenwicht stel je V gelijk aan A. Onder een boekingsregel bepaal je eerst Qv, Qa en de bindende grens. Controleer welke partijen handelen. CS ligt onder V en boven P; PS boven A = MK en onder P. Reken alleen met werkelijk verhandelde eenheden. De rekenroute uit p. 92 is hoeveelheid, grenshoogten, rechthoek en driehoek, som. Voor Pareto is naast voordeel ook haalbaarheid en geen nadeel nodig.','Welke keuze moet vóór een oppervlakteberekening komen?','Een gegeven prijs legt niet zelfstandig het aantal transacties vast.','Herhaal de methode met een apart kort kanovoorbeeld.');
}
{
 const s=slide('Kano’s: het vrije evenwicht',exampleFoot);
 text(s,'Vraag: P = 42 − 2Q       Aanbod/MK: P = 6 + Q',60,198,1480,63,40,{bold:true,color:C.blue});
 text(s,'P in € per kanoplaats · Q in kanoplaatsen',60,275,1480,50,31);
 text(s,'42 − 2Q = 6 + Q        36 = 3Q',60,368,1480,65,43);
 text(s,'Qe = 12 plaatsen          Pe = 42 − 2 × 12 = € 18',60,454,1480,65,43,{bold:true});
 table(s,[['Gebied','Basis × hoogte × ½','Surplus'],['CS','½ × 12 × (42 − 18)','€ 144'],['PS','½ × 12 × (18 − 6)','€ 72'],['TS','144 + 72','€ 216']],60,562,1480,246,[270,880,330],32);
 notes(s,'83–85','Zelfgemaakt voorbeeld Kano’s, met eigen context en getallen. Binnen dit eenvoudige marktmodel geeft A de MK weer, zijn er geen extra handelskosten en geen gevolgen voor anderen. Q is het aantal kanoplaatsen in dezelfde boekingsronde. Beide functies gelijkstellen geeft Qe = 12. Invullen in beide functies geeft P = 18. Voor CS is de hoogte 42 − 18 = 24 euro per plaats. Voor PS is deze 18 − 6 = 12. De basis is 12 plaatsen. Een oppervlakte geeft euro, niet euro per plaats.','Waarom zijn de twee hoogten verschillend?','De verticale intercepten zijn geen surplusbedragen.','Beperk nu het aantal boekingen in dezelfde kanomarkt.',true);
}
{
 const s=slide('Kano’s: acht werkelijke transacties',exampleFoot);
 text(s,'Boekingsgrens: 8 plaatsen tegen € 20 per plaats',60,188,1480,59,40,{bold:true,color:C.blue});
 text(s,'Qv = 11 · Qa = 14 · Hoogste betalingsbereidheid, laagste MK',60,266,1480,58,33);
 text(s,'Bij Q = 8: betalingsbereidheid = € 26, MK = € 14',60,346,1480,64,39,{bold:true});
 table(s,[['Gebied','Rechthoek','Driehoek','Samen'],['CS','8 × (26 − 20) = 48','½ × 8 × (42 − 26) = 64','€ 112'],['PS','8 × (20 − 14) = 48','½ × 8 × (14 − 6) = 32','€ 80']],60,460,1480,264,[180,480,550,270],30);
 text(s,'TS = 112 + 80 = € 192',60,767,1480,60,42,{bold:true,color:C.orange});
 notes(s,'91–92, 95','Bij P = 20: 20 = 42 − 2Qv, dus Qv = 11. 20 = 6 + Qa, dus Qa = 14. De boekingsgrens van 8 bindt. Gegeven toewijzing: hoogste betalingsbereidheden, laagste MK. Lees op Q = 8 de randhoogten af: 42 − 16 = 26 en 6 + 8 = 14. CS heeft een rechthoek van hoogte 6 en driehoek van hoogte 16. PS heeft een rechthoek van hoogte 6 en driehoek van hoogte 8. Alle basissen zijn 8 plaatsen. Laat leerlingen de oppervlakken beschrijven met de eerdere boekgrafiek op p. 92 als steun.','Waarom is het hele CS-gebied geen driehoek?','Alleen de driehoek tellen zou het voordeel bij de laatste transactie weglaten.','Vergelijk TS en toets één mogelijke extra boeking.',true);
}
{
 const s=slide('Kano’s: verlies en een mogelijke verbetering',exampleFoot);
 text(s,'Welvaartsverlies = 216 − 192 = € 24',60,198,1480,64,43,{bold:true,color:C.orange});
 text(s,'Controle: ½ × (12 − 8) × (26 − 14) = € 24',60,285,1480,64,39);
 table(s,[['Mogelijke 9e transactie','Berekening voordeel'],['Nieuwe koper','24 − 20 = € 4'],['Nieuwe verkoper','20 − 15 = € 5']],60,405,1480,243,[740,740],35);
 text(s,'Verruiming is kosteloos en technisch mogelijk.\nPrijs en bestaande transacties blijven gelijk; anderen lijden geen nadeel.',60,691,1480,111,34,{bold:true});
 notes(s,'93–96','In dit eigen voorbeeld kunnen technisch minstens 12 plaatsen worden geboekt. Verruiming kost niets. De prijs blijft 20, bestaande transacties blijven gelijk en er zijn geen gevolgen voor buitenstaanders. Bij Q = 9 is betalingsbereidheid 42 − 18 = 24 en MK = 6 + 9 = 15. Beide nieuwe partijen hebben voordeel en niemand gaat achteruit. Dat is een haalbare Paretoverbetering; de beperking op 8 is niet Pareto-efficiënt. De berekende TS-vergelijking geeft op zichzelf geen oordeel over eerlijkheid. De twee puntvoordelen vormen het bewijs voor die mogelijke transactie, niet een exacte integraal over een heel interval.','Welke voorwaarden zijn naast positief voordeel nodig?','Terugkeer naar het vrije evenwicht is niet automatisch voor iedereen gunstig: ook de prijs verandert.','Keer terug naar opgave 1 en laat daarna zelfstandig verder oefenen.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 3 · Huurfietsen op een eiland',targetFoot);
 text(s,'Op een eiland worden huurfietsen verhandeld.',60,194,1480,66,41,{bold:true});
 text(s,'Vraag: P = 80 − Q',60,309,1480,71,47,{bold:true,color:C.blue});
 text(s,'Aanbod: P = 20 + 0,5Q',60,414,1480,71,47,{bold:true,color:C.green});
 text(s,'P in euro per huurfiets · Q in huurfietsen\nBinnen deze opgave lees je de aanbodlijn als MK.',60,527,1480,118,36);
 text(s,'Zonder beperking ontstaat een marktevenwicht.\nEen bron vermeldt ook dat de meeste fietsen blauw zijn;\ndat gegeven is economisch niet relevant.',60,693,1480,136,34);
 notes(s,'105','Begin de bespreking nadat de leerlingen opgave 3 hebben geprobeerd. Dit zijn de boekgegevens, inclusief de irrelevante fietskleur. De bron noemt zelf dat die kleur economisch niet relevant is. Toon daarna de boekingsregel, de basisgrafiek, alle hulpcijfers en alle zes vragen voordat je enige uitwerking onthult.','Welke functies beschrijven deze markt?','Q staat voor huurfietsen, niet voor euro of een geldbedrag.','Lees de volledige boekingsregel.');
}
{
 const s=slide('Opgave 3 · De boekingsregel',targetFoot);
 table(s,[['In het hoogseizoen','Gegeven'],['Transactieprijs','€ 45 per huurfiets'],['Boekingsgrens','Maximaal 30 boekingen'],['Technische ruimte','Minstens 40 transacties'],['Verruiming','Kosteloos']],60,194,1480,357,[660,820],35);
 text(s,'De 30 fietsen gaan naar de huurders met de hoogste betalingsbereidheid en komen van verhuurders met de laagste MK.',60,603,1480,111,36,{bold:true});
 text(s,'Bij verruiming blijven prijs en bestaande transacties ongewijzigd.',60,752,1480,78,36);
 notes(s,'105','Behoud alle voorwaarden uit de bron. De selectie van kopers en verkopers bepaalt welke gebieden bij het surplus horen. Het maximum is een kosteloos verruimbare administratieve boekingsgrens, geen fysieke capaciteit van 30. Het systeem kan minstens 40 transacties verwerken.','Wat verandert wel, en wat blijft gelijk als één boeking extra wordt toegestaan?','Geen minimumprijsbeleid of extra beleidsmechanisme toevoegen: de regel is een gegeven van de opgave.','Toon de oorspronkelijke basisgrafiek in bewerkbare vorm.');
}
{
 const s=slide('Opgave 3 · Basisgrafiek',targetFoot);graph(s);
 right(s,'Gegeven lijnen','V: P = 80 − Q\n\nA = MK:\nP = 20 + 0,5Q','De markeringen\nkomen later.');
 notes(s,'105','Dit is de basisgrafiek uit figuur 2, met dezelfde functies, domeinen en schalen: Q en P lopen beide van 0 tot 80. De grafiek is als native XY-grafiek gereconstrueerd. Vrij evenwicht, surplusgebieden en verlies zijn nog niet gemarkeerd. Bij vraag 4 arceren leerlingen in de gegeven grafiek en tekenen de lijnen niet opnieuw.','Welke grootheden en eenheden staan op de assen?','Het kruispunt is zichtbaar in de bron, maar nog niet met E of berekende waarden gemarkeerd.','Toon alle hulpcijfers die de bron aanbiedt.');
}
{
 const s=slide('Opgave 3 · Hulpcijfers uit de bron',targetFoot);
 table(s,[['Toestand','Qv','Qa','Betalingsbereidheid','Marginale kosten'],['P = € 45\nen Q = 30','35','50','€ 50 bij Q = 30','€ 35 bij Q = 30'],['Mogelijke\n31e transactie','—','—','€ 49','€ 35,50']],60,231,1480,341,[355,130,130,445,420],31);
 text(s,'Omdat Qv = 35 en Qa = 50, is de boekingsgrens van 30 bindend.',60,638,1480,112,39,{bold:true});
 notes(s,'105','De volledige tabel staat al in de boekbron. Het tonen ervan is het aanbieden van de opgavegegevens, geen vroegtijdige onthulling van een uitgewerkt antwoord. In beide situaties gelden bedragen per huurfiets. De boekbron licht zelf toe waarom de grens bindt.','Welke cijfers horen bij de 30e en welke bij de mogelijke 31e transactie?','Gebruik de grenswaarden 50 en 35 voor de oppervlakken tot 30. De 49 en 35,50 dienen voor de Pareto-toets.','Toon nu eerst alle zes vragen zonder uitwerkingen.');
}
{
 const s=slide('Opgave 3 · Vragen 1–3',targetFoot);
 const qs=['Selecteer de gegevens die nodig zijn om het vrije evenwicht te berekenen, noem het irrelevante gegeven en bereken Pe en Qe.','Bereken bij het vrije evenwicht CS, PS en TS.','Bereken bij 30 transacties en P = € 45 met de gegeven allocatieregel CS, PS en TS. Gebruik de hulpcijfers en alleen rechthoeken en driehoeken.'];
 qs.forEach((q,i)=>{let y=[211,412,565][i];text(s,`${i+1})`,60,y,75,65,39,{bold:true,color:C.blue});text(s,q,160,y,1370,[160,110,200][i],38);});
 notes(s,'106','Dit zijn de volledige eerste drie deelvragen. Laat ze beschikbaar zijn vóór de bespreking. De brondia’s kunnen worden teruggehaald. Vraag 1 vraagt zowel bronselectie als berekening. Vraag 3 vraagt expliciet alleen rechthoeken en driehoeken.','Welke van jouw stappen vraagt straks uitleg?','Geen trapeziumformule als vervanging voor de gevraagde methode.','Toon ook vragen 4–6 voordat de antwoorden volgen.');
}
{
 const s=slide('Opgave 3 · Vragen 4–6',targetFoot);
 const qs=['Bereken het welvaartsverlies en arceer dit in de basisgrafiek. Benoem basis en hoogte; teken de vraag- en aanbodlijn niet opnieuw.','Een verhuurder zegt: ‘PS is bij de beperking hoger, dus de uitkomst is Pareto-efficiënt.’ Beoordeel deze uitspraak met beide TS-waarden en de gegeven betalingsbereidheid en marginale kosten van de 31e transactie.','Leg uit waarom de efficiëntievergelijking niet bepaalt welke uitkomst eerlijker is.'];
 qs.forEach((q,i)=>{let y=[200,384,683][i];text(s,`${i+4})`,60,y,75,65,38,{bold:true,color:C.blue});text(s,q,160,y,1370,[165,270,136][i],36);});
 notes(s,'106','Dit zijn de volledige vragen 4, 5 en 6. Alle zes vragen zijn nu aangeboden, met volledige bronnen. Begin pas op de volgende dia aan de uitwerking. Vraag 5 vraagt twee bewijzen: vergelijking van de totalen en een concrete haalbare verbetering via de 31e transactie.','Wat moet jouw antwoord bij vraag 5 méér bevatten dan een groter totaal?','Efficiëntie en eerlijkheid vragen verschillende redeneringen.','Start bij de bronselectie en het vrije evenwicht.');
}
{
 const s=slide('Opgave 3.1 · Vrij evenwicht',targetFoot);graph(s,{equilibrium:true});
 right(s,'Benodigd: V en A','80 − Q = 20 + 0,5Q\n60 = 1,5Q\n\nQe = 40 huurfietsen\nPe = 80 − 40\n     = € 40 per huurfiets','Blauwe fietskleur:\nniet nodig.');
 notes(s,'105–106','Vraag 1: selecteer beide functies. De kleur van de fietsen is irrelevant. Trek 20 af en tel Q op aan beide kanten. 60 = 1,5Q geeft 40. Invullen in de vraag geeft 40 euro. Controle via aanbod: 20 + 0,5 × 40 = 40. Het punt E is (40; 40), met Q eerst. Dezelfde assen en lijnen blijven in volgende diagrammen behouden.','Hoe controleer je de gevonden prijs met de andere functie?','Gebruik niet de regelprijs 45 als vrije evenwichtsprijs.','Kies de surplusgebieden in het vrije evenwicht.');
}
{
 const s=slide('Opgave 3.2 · Surplus in het vrije evenwicht',targetFoot);
 const g=graph(s,{equilibrium:true,regions:[['CS',[[0,40],[0,80],[40,40]],C.cs],['PS',[[0,20],[0,40],[40,40]],C.ps]]});
 text(s,'CS',g.X(8),g.Y(55),90,42,29,{bold:true});text(s,'PS',g.X(8),g.Y(35),90,42,29,{bold:true});
 right(s,'Basis: 40 huurfietsen','CS = ½ × 40 × (80 − 40)\n     = € 800\n\nPS = ½ × 40 × (40 − 20)\n     = € 400','TS = 800 + 400\n     = € 1.200');
 notes(s,'105–106','Hoogte CS = 80 − 40 = 40 euro per huurfiets. Hoogte PS = 40 − 20 = 20 euro per huurfiets. Beide hebben een basis van 40 huurfietsen. CS ligt onder V en boven P = 40. PS ligt onder die prijs en boven A = MK. De som is het gehele gebied tussen V en A tot 40.','Waarom is CS hier tweemaal zo groot als PS?','Het volledige prijsmaalhoeveelheid-vlak is omzet, geen PS.','Reset naar de boekingsregel: prijs 45, werkelijk 30.');
}
{
 const s=slide('Opgave 3.3 · Werkelijke handel en toewijzing',targetFoot);
 table(s,[['Grootheid bij P = € 45','Berekening / gegeven','Aantal huurfietsen'],['Gevraagd: Qv','45 = 80 − Qv','35'],['Aangeboden: Qa','45 = 20 + 0,5Qa','50'],['Werkelijk verhandeld','Boekingsgrens bindt','30']],60,207,1480,322,[490,640,350],32);
 text(s,'De 30 hoogste betalingsbereidheden en de 30 laagste MK',60,577,1480,97,40,{bold:true,color:C.blue});
 text(s,'Rand bij Q = 30:\nV: 80 − 30 = € 50       A = MK: 20 + 0,5 × 30 = € 35',60,715,1480,112,38);
 notes(s,'105–106','De hulpcijfers 35 en 50 zijn uit de functies te controleren. De grens van 30 ligt onder beide gewenste hoeveelheden. Daarom ligt de rechterrand van beide surplusgebieden op 30. De gegeven efficiënte toewijzing binnen die 30 transacties maakt de standaardgebieden geldig. Zonder die afspraak kunnen dezelfde prijs en hoeveelheid een ander TS opleveren, zoals bonus 4 laat zien.','Welke hoeveelheid bepaalt de breedte van elk gebied?','Teken geen gebied tot Qv = 35 of Qa = 50.','Bereken eerst het kopersvoordeel bij de regel.');
}
{
 const s=slide('Opgave 3.3 · CS bij dertig transacties',targetFoot);
 const g=graph(s,{price:45,cut:30,splits:[50],regions:[['CS-rectangle',[[0,45],[0,50],[30,50],[30,45]],C.cs],['CS-triangle',[[0,50],[0,80],[30,50]],C.cs]]});
 text(s,'CS',g.X(7),g.Y(65),90,42,29,{bold:true});
 right(s,'Rechthoek + driehoek','30 × (50 − 45) = 150\n\n½ × 30 × (80 − 50)\n= 450\n\nHoogten: € 5 en € 30\nper huurfiets.','CS = 150 + 450\n     = € 600');
 notes(s,'105–106','Op Q = 30 is V = 50. De regelprijs is 45. Alle 30 huurders hebben minstens 5 euro voordeel: de rechthoek. Boven 50 tot de vraaglijn ligt extra voordeel van huurders met hogere betalingsbereidheid: de driehoek met hoogte 80 − 50 = 30. Beide basissen zijn 30 huurfietsen. Som 150 + 450 = 600 euro. De horizontale stippellijn op 50 splitst het gebied.','Welk deel mis je als je alleen een driehoek rekent?','De hoogte van de driehoek is 80 − 50, niet 80 − 45.','Bereken hetzelfde soort splitsing bij de verhuurders.');
}
{
 const s=slide('Opgave 3.3 · PS bij dertig transacties',targetFoot);
 const g=graph(s,{price:45,cut:30,splits:[35],regions:[['PS-rectangle',[[0,35],[0,45],[30,45],[30,35]],C.ps],['PS-triangle',[[0,20],[0,35],[30,35]],C.ps]]});
 text(s,'PS',g.X(7),g.Y(44),90,34,27,{bold:true});
 right(s,'Rechthoek + driehoek','30 × (45 − 35) = 300\n\n½ × 30 × (35 − 20)\n= 225\n\nHoogten: € 10 en € 15\nper huurfiets.','PS = 300 + 225\n     = € 525',C.green);
 notes(s,'105–106','Op Q = 30 zijn de MK 35. Alle 30 verhuurders krijgen minstens 45 − 35 = 10 euro boven hun MK. Die rechthoek is 300. Onder 35 ligt het extra voordeel van de verhuurders met lagere MK: ½ × 30 × (35 − 20) = 225. Som = 525 euro. De stippellijn op 35 splitst het gebied.','Waarom hoort het gebied onder de MK-lijn niet bij PS?','Kosten en voordeel zijn verschillende delen van de opbrengst. PS is ook niet automatisch winst: constante kosten moeten nog worden betaald.','Tel CS en PS op en vergelijk de twee situaties.');
}
{
 const s=slide('Opgave 3.3 · Twee situaties vergelijken',targetFoot);
 table(s,[['Situatie','CS','PS','TS = CS + PS'],['Vrij: Q = 40, P = € 40','€ 800','€ 400','€ 1.200'],['Regel: Q = 30, P = € 45','€ 600','€ 525','€ 1.125'],['Verandering','−€ 200','+€ 125','−€ 75']],60,230,1480,348,[610,260,260,350],34);
 text(s,'Onder de regel: TS = 600 + 525 = € 1.125',60,641,1480,75,43,{bold:true});
 text(s,'Verhuurders krijgen meer voordeel; het gezamenlijke voordeel daalt.',60,758,1480,71,36,{bold:true,color:C.orange});
 notes(s,'105–106','Maak eerst de som 600 + 525 = 1125. Vergelijk pas daarna met het vrije evenwicht. CS daalt 200, PS stijgt 125, TS daalt 75. Deze verdelingsverschuiving en de daling van het totaal worden uit elkaar gehouden. Dit vormt ook het cijferdeel van het antwoord op vraag 5.','Kan PS stijgen terwijl TS daalt?','Meer voordeel voor één groep bewijst geen efficiëntere uitkomst.','Lokaliseer de ontbrekende 75 euro in de grafiek.');
}
{
 const s=slide('Opgave 3.4 · Welvaartsverlies',targetFoot);
 const g=graph(s,{price:45,cut:30,equilibrium:true,regions:[['loss',[[30,35],[30,50],[40,40]],C.loss]]});
 // Exact hatch segments inside the triangle, in the same economic coordinates.
 for(let q=31;q<40;q+=1.5){const ylo=20+.5*q,yhi=80-q;s.shapes.add({geometry:'line',name:'loss-hatch-'+q,position:{left:g.X(q),top:g.Y(yhi),width:0,height:g.Y(ylo)-g.Y(yhi)},line:{fill:C.orange,width:1.2}});}
 text(s,'Welvaartsverlies',g.X(48),g.Y(76),290,44,27,{bold:true,color:C.orange});
 s.shapes.add({geometry:'line',name:'loss-leader',position:{left:g.X(36),top:g.Y(68),width:g.X(48)-g.X(36),height:g.Y(41)-g.Y(68),verticalFlip:true},line:{fill:C.orange,width:1.5}});
 right(s,'Verschil in TS','1.200 − 1.125 = € 75\n\nBasis: 40 − 30 = 10\nhuurfietsen\nHoogte: 50 − 35 = € 15\nper huurfiets','½ × 10 × 15 = € 75',C.orange);
 notes(s,'105–106','Arceer in de bestaande basisgrafiek de driehoek met hoekpunten (30;50), (40;40), (30;35). Zij ligt tussen V en A van Q = 30 tot Q = 40. De horizontale afstand is 10 huurfietsen; de verticale afstand aan de grens is 15 euro per huurfiets. Verlies = ½ × 10 × 15 = 75 euro, gelijk aan 1200 − 1125. De arcering laat het voordeel van niet-doorgegane transacties zien.','Welke drie hoekpunten begrenzen het verlies?','De hoogte is niet de prijs 45 en ook niet de prijsstijging 5.','Beoordeel nu de claim met een concrete extra transactie.');
}
{
 const s=slide('Opgave 3.5 · De mogelijke 31e transactie',targetFoot);
 text(s,'PS stijgt: € 400 naar € 525. TS daalt: € 1.200 naar € 1.125.',60,187,1480,99,38,{bold:true,color:C.orange});
 table(s,[['Wie gaat vooruit bij dezelfde prijs van € 45?','Voordeel'],['Nieuwe huurder: betalingsbereidheid € 49','49 − 45 = € 4'],['Nieuwe verhuurder: MK € 35,50','45 − 35,50 = € 9,50']],60,327,1480,247,[1050,430],34);
 text(s,'Haalbaar: technische ruimte en kosteloze verruiming.\nNiemand slechter af: prijs en bestaande transacties blijven gelijk.',60,619,1480,103,34);
 text(s,'Een Paretoverbetering is mogelijk. De beperking is niet Pareto-efficiënt.',60,758,1480,69,37,{bold:true,color:C.blue});
 notes(s,'105–106','De uitspraak is onjuist. Het hogere PS bewijst geen efficiëntie: TS daalt. Een zelfstandige Pareto-toets gebruikt de gegeven 31e transactie. De nieuwe huurder wint 4 euro, de nieuwe verhuurder 9,50. Het platform heeft technisch ruimte, verruimen kost niets en bestaande transacties en prijzen blijven gelijk. Binnen de gegeven modelcontext lijdt niemand nadeel. Er bestaat dus een haalbare verbetering. De overgang naar het gehele vrije evenwicht is niet nodig voor dit bewijs en zou door de lagere prijs niet automatisch een Paretoverbetering voor iedereen zijn. De puntvoordelen worden niet als exacte oppervlakte over een geheel interval voorgesteld.','Welke drie onderdelen maken dit een Pareto-bewijs?','Een verschil in TS alleen bewijst niet dat niemand slechter af wordt.','Scheid de efficiëntieconclusie van een oordeel over eerlijkheid.');
}
{
 const s=slide('Opgave 3.6 · Efficiëntie en eerlijkheid',targetFoot);
 table(s,[['De berekening laat zien','Een oordeel over eerlijkheid vraagt'],['Hoe groot CS, PS en TS zijn','Een norm voor een eerlijke verdeling'],['Welk voordeel door minder handel ontbreekt','Een afweging van belangen en waarden'],['Of een haalbare Paretoverbetering bestaat','Informatie over wie welk voordeel krijgt']],60,223,1480,365,[740,740],34);
 text(s,'De efficiëntievergelijking bepaalt niet welke verdeling eerlijker is.',60,654,1480,102,43,{bold:true,color:C.blue});
 text(s,'Verbeter één ontbrekende stap of verklaring in je eigen antwoord.',60,779,1480,52,32);
 notes(s,'105–106','De berekeningen tonen de verdeling tussen groepen en het gerealiseerde totale voordeel. Zij geven geen norm voor een eerlijke verdeling, bijvoorbeeld gelijkheid, behoefte of verdienste. Bovendien tonen groepstotalen niet de verdeling binnen de groepen. Beide uitkomsten kunnen door verschillende mensen anders worden gewaardeerd. Controleer het hele eigen antwoord: bronselectie; 40 en 40; 800/400/1200; 600/525/1125; verlies 75 en juiste arcering; haalbare 31e transactie; apart waardeoordeel.','Welke extra norm gebruik je als je een uitkomst eerlijker noemt?','Pareto-efficiënt is geen synoniem voor rechtvaardig.','Laat de gezamenlijke overzichtsdia staan voor afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...authored,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,geometry},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const patch=`import sys,zipfile,xml.etree.ElementTree as E,os\np=sys.argv[1]\nns='http://schemas.openxmlformats.org/drawingml/2006/chart'\nE.register_namespace('c',ns)\nwith zipfile.ZipFile(p) as z: files={n:z.read(n) for n in z.namelist()}\nfor n,b in list(files.items()):\n if '/charts/' not in n or not n.endswith('.xml'): continue\n r=E.fromstring(b)\n a=r.find('.//{'+ns+'}plotArea')\n if a is None: continue\n l=a.find('{'+ns+'}layout')\n if l is not None: a.remove(l)\n l=E.Element('{'+ns+'}layout');a.insert(0,l);m=E.SubElement(l,'{'+ns+'}manualLayout')\n for k,v in [('layoutTarget','inner'),('xMode','edge'),('yMode','edge'),('wMode','factor'),('hMode','factor'),('x','${frac.x}'),('y','${frac.y}'),('w','${frac.w}'),('h','${frac.h}')]:E.SubElement(m,'{'+ns+'}'+k,{'val':v})\n files[n]=E.tostring(r,encoding='utf-8',xml_declaration=True)\nwith zipfile.ZipFile(p+'.tmp','w',zipfile.ZIP_DEFLATED) as z:\n for n,b in files.items():z.writestr(n,b)\nos.replace(p+'.tmp',p)\n`;
await fs.writeFile(path.join(BUILD,'plot-layout.py'),patch);execFileSync(PYTHON,[path.join(BUILD,'plot-layout.py'),candidate]);
const tableOwners=[...new Set(tables)];
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'2.3.4 Gemengde opgaven – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
