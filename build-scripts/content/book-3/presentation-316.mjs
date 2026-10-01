// HOW TO ADAPT: read the classroom recipe and the current paragraph's full
// questions/answers. Update the adjacent manifest; derive graphs from equations.
// The installed presentation runtime supplies dependencies through runtime.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
 PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const authored=JSON.parse(await fs.readFile(fileURLToPath(new URL('./presentation-316.manifest.json',import.meta.url)),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('316');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#1E8449',orange:'#A94D16',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',tax:'#F8C471',loss:'#F1948A',cs:'#85C1E9',ps:'#82E0AA'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[],geometry=[];
const base=`https://github.com/meijer1973/4veco-lessen/blob/${authored.sourceCommit}/${authored.sourceEdition}/`;
const foot='§3.1.6 Gemengde opgaven: overheidsingrijpen';
const targetFoot=foot+' · Opgave 48 · Boekpagina 50–51';
const exampleFoot='Uitlegvoorbeeld — niet uit het boek · Kaarsenmarkt';
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name,fill='none'}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,60),position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=foot){const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);
 text(s,footer,60,848,1400,30,21,{color:C.muted,name:'footer'});
 text(s,String(p.slides.items.length),1470,845,70,32,22,{align:'right',color:C.muted,name:'slide-number'});
 slides.push({number:p.slides.items.length,title});return s;}
function notes(s,page,explanation,question,pitfall,transition,example=false){
 s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: ${example?'Zelfgemaakt uitlegvoorbeeld Kaarsenmarkt: context en gegevens zijn niet uit het boek. Alleen de methoden komen uit ':''}Boek 3, books34-v3, actuele versie bij lescommit ${authored.sourceCommit}, gedrukte boekpagina ${page}. ${base}books/book-3/output/Boek_3_Compleet_v3.pdf\nAntwoordmodel boekopgaven: ${base}books/book-3/chapters/3.1/Antwoorden.md${example?' (niet het antwoordmodel van dit eigen voorbeeld).':''}`);}
function table(s,values,x,y,w,h,widths,size=32){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});
 for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const z=t.getCell(r,c);z.fill=r===0?C.ink:(r%2?C.paper:C.pale);z.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}
 tables.push(p.slides.items.length);return t;}
const route=[
 'Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.',
 'Maak de startopdracht.',
 'Korte herhaling en aanpak.',
 'Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.',
 'Klaar? Werk aan een ander vak. Geen devices.',
 'Bespreken van de doelopgave: opgave 48.',
 'Zet je huiswerk in je agenda.'
];
function overview(phase,active){const s=slide('Deze les: §3.1.6 Gemengde opgaven');overviews.push(p.slides.items.length);
 text(s,'Overheidsingrijpen · Nu: '+phase,60,112,1480,43,30,{bold:true,color:C.blue,name:'phase'});
 text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,336,390,446,606,700,774],hs=[80,45,45,125,73,65,52];
 route.forEach((r,i)=>{let col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],789,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});
 text(s,'Maatregel en methode kiezen.\nPrijzen, handel en welvaart bepalen.\nEen beleidsclaim onderbouwen.',972,244,565,123,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,403,565,45,35,{bold:true,color:active===2?C.blue:C.ink});
 text(s,'Pagina 48 · Opgave 46\nSteun: uitleg §§3.1.1–3.1.5',972,459,565,95,30,{name:'overview-start',bold:active===2});rule(s,972,570,568);
 text(s,'Huiswerk',972,598,565,45,35,{bold:true,color:active===7?C.blue:C.ink});
 text(s,'§3.1.6 · Opgaven 46, 47, 47A, 48\nVerder oefenen: 47 en 47A (extra)\nDoelopgave: 48\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework',bold:active===7});
 notes(s,'48–51',`Laat deze dia staan tijdens ${phase.toLowerCase()}. Start is de eerste echte opgave, nummer 46 op boekpagina 48. Geen hernummering tot opgave 1. Geen afzonderlijke basis- of zelfstandige sectie: verder met 47 op p.48 en 47A op p.49; doel is 48 op p.50–51. Huiswerk volgens de classroomroute: alle gemengde opgaven 46, 47, 47A en 48 maken en nakijken. 47A houdt het bronlabel extra; er is geen bonus of herhalingssectie. De volledige route is niet als één les getimed. Start 46 vraagt eerder onderwezen bewerkingen: belastingwig (§3.1.1 p.6–9), subsidie over alle verkochte eenheden (§3.1.3 p.23–25), binding en hoeveelheden maximumprijs (§3.1.4 p.32–34), quotumprijs op V (§3.1.5 p.41–42). Laat bij twijfel de uitleg gebruiken, geen nieuwe procedure zelf ontdekken. Keer vóór verder oefenen terug naar hun vastgelopen startstap. Kies 48 voor de bespreking omdat modelkeuze, twee prijzen, budget, oppervlakten en een bronconclusie daarin samenkomen.`, 'Welke bronzin bepaalt jouw rekenroute?', 'De hoofdstukbron noemt pagina 44–47; in het volledige boek zijn de gedrukte pagina’s 48–51.',active===7?'Noteer het volledige huiswerk.':'Volg de aangegeven lesfase.');
 return s;}

// Native numeric XY charts plus editable polygon areas share a fixed inner plot.
const box={left:60,top:222,width:960,height:590},frac={x:.14,y:.06,w:.82,h:.80};
const plot={left:box.left+box.width*frac.x,top:box.top+box.height*frac.y,width:box.width*frac.w,height:box.height*frac.h};
function graph(s,{d0=24,ds=.2,a0=6,as=.1,maxQ=120,maxP=26,tax=0,mark=false,areas=false,example=false}={}){
 const X=q=>plot.left+q/maxQ*plot.width,Y=v=>plot.top+(1-v/maxP)*plot.height;
 // Remove IEEE-754 noise (e.g. 49.99999999999999); retain ten decimals.
 const exact=v=>Number(v.toFixed(10));
 const q0=exact((d0-a0)/(ds+as)),p0=exact(d0-ds*q0),qt=exact((d0-a0-tax)/(ds+as)),pc=exact(d0-ds*qt),pp=exact(a0+as*qt);
 const regions=[];
 function region(name,pts,fill){const xs=pts.map(a=>X(a[0])),ys=pts.map(a=>Y(a[1]));const l=Math.min(...xs),top=Math.min(...ys),w=Math.max(...xs)-l,h=Math.max(...ys)-top;
  const commands=pts.map((a,i)=>({[i?'lineTo':'moveTo']:{x:X(a[0])-l,y:Y(a[1])-top}}));commands.push({close:{}});
  s.shapes.add({geometry:'custom',name:'area-'+name,position:{left:l,top,width:w,height:h},fill,line:{fill:'none',width:0},customPaths:[{width:w,height:h,commands}]});regions.push({name,points:pts,position:{left:l,top,width:w,height:h},commands});}
 if(areas){region('O',[[0,pp],[qt,pp],[qt,pc],[0,pc]],C.tax);region('W',[[qt,pp],[q0,p0],[qt,pc]],C.loss);}
 const endQ=Math.min(maxQ,d0/ds),aEnd=Math.min(maxQ,(maxP-a0)/as);
 const series=[{name:'V',xValues:[0,endQ],values:[d0,d0-ds*endQ],line:{fill:C.blue,width:4},marker:{symbol:'none'}},{name:'A',xValues:[0,aEnd],values:[a0,a0+as*aEnd],line:{fill:C.green,width:4},marker:{symbol:'none'}}];
 function line(name,xs,ys,col=C.muted,width=1.5,dashed=true){series.push({name,xValues:xs,values:ys,line:{fill:col,width,...(dashed?{style:'dashed'}:{})},marker:{symbol:'none'}});}
 if(tax){const end=Math.min(maxQ,(maxP-a0-tax)/as);line('A + t',[0,end],[a0+tax,a0+tax+as*end],C.orange,4,false);}
 if(mark){line('Pc',[0,qt],[pc,pc]);line('Pp',[0,qt],[pp,pp]);line('Qt',[qt,qt],[0,pc]);line('Q0',[q0,q0],[0,p0]);line('Wig',[qt,qt],[pp,pc],C.orange,4,false);}
 for(const item of series){item.xValues=item.xValues.map(exact);item.values=item.values.map(exact);}
 const ch=s.charts.add('scatter',{position:box,series,scatterOptions:{style:'line'},hasLegend:false,
 xAxis:{min:0,max:maxQ,majorUnit:example?20:20,numberFormatCode:'0',title:{text:example?'Q (kaarsen per week)':'Q (bandjes per dag)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},
 yAxis:{min:0,max:maxP,majorUnit:example?4:5,numberFormatCode:'0',title:{text:example?'P (€ per kaars)':'P (€ per bandje)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:.6},line:{fill:C.ink,width:1.5}},chartFill:'none',plotAreaFill:'none'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 text(s,'V',X(maxQ*.86),Y(d0-ds*maxQ*.86)+8,55,38,28,{bold:true,color:C.blue});
 text(s,'A',X(maxQ*.84),Y(a0+as*maxQ*.84)+7,55,38,28,{bold:true,color:C.green});
 if(tax)text(s,'A + t',X(maxQ*.80),Y(a0+tax+as*maxQ*.80)-59,140,38,28,{bold:true,color:C.orange});
 if(mark){text(s,'Pc = '+pc.toFixed(0),X(2),Y(pc)-40,170,34,25,{bold:true});text(s,'Qt = '+qt.toFixed(0),X(qt)-90,plot.top-45,170,36,26,{bold:true});text(s,'Q₀ = '+q0.toFixed(0),X(q0)+8,Y(p0)+88,170,36,25,{bold:true});}
 if(areas){
  for(let q=maxQ/40;q<qt;q+=maxQ/40)s.shapes.add({geometry:'line',name:'hatch-O-'+q,position:{left:X(q),top:Y(pc),width:0,height:Y(pp)-Y(pc)},line:{fill:C.orange,width:1}});
  for(let price=pp+.25;price<pc;price+=.35){const right=price<=p0?(price-a0)/as:(d0-price)/ds;s.shapes.add({geometry:'line',name:'hatch-W-'+price,position:{left:X(qt),top:Y(price),width:X(right)-X(qt),height:0},line:{fill:'#9C3529',width:1.1}});}
  text(s,'O',X(qt*.47),Y((pc+pp)/2)-15,50,36,28,{bold:true});
  text(s,'W',X(q0)+48,Y(pc)-17,50,36,28,{bold:true,color:'#9C3529'});
  s.shapes.add({geometry:'line',name:'W-leader',position:{left:X(qt+(q0-qt)/3),top:Y(pc)+8,width:X(q0)+40-X(qt+(q0-qt)/3),height:Y((pc+pp+p0)/3)-Y(pc)-8,verticalFlip:true},line:{fill:'#9C3529',width:1.4}});
 }
 if(mark)text(s,'Pp = '+pp.toFixed(0),X(2),Y(pp)-34,112,32,25,{bold:true,fill:C.paper});
 geometry.push({slide:p.slides.items.length,box,frac,plot,d0,ds,a0,as,maxQ,maxP,tax,mark,areas,series,regions});return {X,Y};
}
function right(s,heading,body,tail='',color=C.blue){text(s,heading,1080,217,460,94,37,{bold:true,color});text(s,body,1080,330,460,305,34);if(tail)text(s,tail,1080,676,460,146,34,{bold:true,color});}

overview('Startopdracht',2);
{
 const s=slide('Aanpak bij gemengde opgaven');
 const rows=[['1 · Afspraak','Geld per verkoop, prijsgrens of productiegrens?'],['2 · Hoeveelheid','Wat willen partijen? Wat wordt echt verhandeld?'],['3 · Geldstroom','Wie betaalt en wie ontvangt? Welke welvaartsmaat?'],['4 · Conclusie','Brongegeven + berekening + economisch gevolg.']];
 rows.forEach((r,i)=>{const y=207+i*149;text(s,r[0],60,y,520,62,38,{bold:true,color:C.blue});text(s,r[1],615,y,920,100,36);if(i<3)rule(s,60,y+115,1480);});
 notes(s,'6–9, 14–16, 23–25, 32–34, 39–42','Dit is herhaling, geen nieuwe maatregel. Haal bij een fout de relevante eerdere uitleg op. Belasting: Pc = Pp + t, O = t × Qt, maat CS + PS + O. Subsidie: Pc = Pp − s, U = s × Qsub, maat CS + PS − U. Prijsgrens: eerst binding, dan Qv en Qa en de bron over transacties/opkoop. Quotum: eerst binding, dan de prijs op V bij de werkelijk verkochte toegestane hoeveelheid. Er worden geen antwoorden op toegewezen opgaven uitgewerkt.','Welke bronzin begrenst wat je mag concluderen?','Een nette berekening kan de verkeerde hoeveelheid gebruiken.','Herhaal belasting en verlies met een afzonderlijk kort kaarsenvoorbeeld.');
}
{
 const s=slide('Kaarsen: één belasting, twee prijzen',exampleFoot);
 text(s,'Vraag: Pc = 18 − 0,20Q     Aanbod: Pp = 2 + 0,20Q',60,185,1480,60,39,{bold:true,color:C.blue});
 text(s,'Q in kaarsen per week · prijzen in € per kaars · t = € 4 per verkoop',60,269,1480,62,31);
 table(s,[['Stap','Berekening'],['Vrij evenwicht','18 − 0,20Q = 2 + 0,20Q → Q₀ = 40; P₀ = € 10'],['Aanbod in kopersprijzen','Pc = (2 + 0,20Q) + 4 = 6 + 0,20Q'],['Nieuwe hoeveelheid','18 − 0,20Q = 6 + 0,20Q → Qt = 30'],['Twee prijzen','Pc = 18 − 0,20 × 30 = € 12; Pp = 12 − 4 = € 8']],60,365,1480,341,[430,1050],32);
 text(s,'Controle: Pc − Pp = 12 − 8 = € 4 per kaars',60,754,1480,64,39,{bold:true,color:C.orange});
 notes(s,'6–9','Eigen fictieve kaarsenmarkt; andere gegevens dan alle toegewezen opgaven. Veel kopers/verkopers, één product, geen andere veranderingen, effecten voor buitenstaanders of uitvoeringskosten. Vrij: 16 = 0,40Q, Q0 = 40 en P0 = 10. Met belasting: 12 = 0,40Q, Qt = 30. Pc = 12 en oorspronkelijke A geeft Pp = 2 + 0,2 × 30 = 8. Koper en verkoper dragen ieder 2 euro per kaars. Pp is ontvangst vóór productiekosten.','Waar lees je Pp bij de nieuwe hoeveelheid?','De oude prijs plus de hele belasting is niet de nieuwe evenwichtsprijs.','Laat dezelfde twee prijzen terugkomen in de grafiek.',true);
}
{
 const s=slide('Kaarsen: ontvangsten en gemist voordeel',exampleFoot);
 graph(s,{d0:18,ds:.2,a0:2,as:.2,maxQ:80,maxP:24,tax:4,mark:true,areas:true,example:true});
 right(s,'Twee gebieden','O = 4 × 30\n   = € 120 per week\n\nW = ½ × (40 − 30) × 4\n    = € 20 per week','O: verkochte kaarsen\nW: gemiste transacties',C.orange);
 notes(s,'14–16','Eigen voorbeeld. Lees Pc = 12 op V en Pp = 8 op oorspronkelijke A bij Qt = 30. De rechthoek O loopt Q = 0–30 en P = 8–12. W heeft hoekpunten (30,8), (40,10), (30,12). De verticale arcering is O; de horizontale W. Het nieuwe CS = ½ × 30 × (18 − 12) = 90, PS = ½ × 30 × (8 − 2) = 90; met O is de maat 300. Vrij CS = 160 en PS = 160, samen 320. Verschil 20. Vraag leerlingen de twee basissen aan te wijzen. Bij moeite herhaal eerder behandelde surplusdriehoeken. Dit voorbeeld levert geen antwoord op een toegewezen vraag.','Waarom gebruikt O dertig en W tien kaarsen?','Overheidsontvangsten zijn een overdracht; W is voordeel dat niet ontstaat.','Keer terug naar de eigen startpoging en laat verder oefenen.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 48 · Festivalbandjes',targetFoot);
 text(s,'Een gemeente onderzoekt de markt voor eenvoudige festivalbandjes. Verschillende aanbieders verkopen hetzelfde product. Alle bedragen en voorstellen zijn fictief.',60,185,1480,160,36);
 text(s,'Bron 1 · De markt zonder maatregel',60,389,1480,60,37,{bold:true});
 text(s,'Vraag: Pc = 24 − 0,20Q',60,476,1480,65,45,{bold:true,color:C.blue});
 text(s,'Aanbod: Pp = 6 + 0,10Q',60,559,1480,65,45,{bold:true,color:C.green});
 text(s,'Q: bandjes per dag · Pc en Pp: euro per bandje\nZonder maatregel: Pc = Pp\nVrij evenwicht: CS = € 360 per dag; PS = € 180 per dag.',60,673,1480,151,34);
 notes(s,'50','Dit is de volledige context en bron 1 van de echte opgave. Begin de bespreking na de eigen poging. De volgende dia’s geven bronnen 2 en 3, de basisgrafiek en alle vragen zonder antwoord.','Welke eenheden horen bij Q en de prijzen?','De gegeven surplusbedragen horen bij de vrije markt.','Lees de twee alternatieve plannen.');
}
{
 const s=slide('Opgave 48 · Twee alternatieven, niet tegelijk',targetFoot);
 text(s,'Bron 2 · Plan A',60,198,1480,59,39,{bold:true,color:C.blue});
 text(s,'De aanbieder draagt € 3 af per verkocht bandje.\nEr zijn geen andere geldstromen of effecten voor buitenstaanders.\nOok uitvoeringskosten blijven buiten beschouwing.',60,280,1480,175,37);
 rule(s,60,489,1480);
 text(s,'Bron 2 · Plan B',60,532,1480,59,39,{bold:true,color:C.green});
 text(s,'Een verkoopprijs boven € 10 is verboden. Er is geen extra aanvoer.\nAlle aangeboden bandjes worden verkocht aan de vragers met de hoogste betalingsbereidheid.\nEr is geen belasting, subsidie of overheidsopkoop.',60,614,1480,199,36);
 notes(s,'50','Volledige bron 2. De plannen gelden afzonderlijk. Voeg de belasting van A nooit toe aan de prijsregel van B. De toewijzingsregel bij B en afwezigheid van andere geldstromen blijven expliciet. Benoem de maatregelen hier nog niet als antwoord op a.','Welke afspraken moet je bij beide plannen apart houden?','De twee plannen combineren verandert de opgave.','Lees de claim en bekijk de onbewerkte basisgrafiek.');
}
{
 const s=slide('Opgave 48 · Grafiek en beleidsclaim',targetFoot);
 graph(s);
 right(s,'Bron 3','“Plan B maakt een bandje bereikbaar voor iedereen die er bij € 10 een wil.\n\nPlan A levert de overheid geld op; dat geld is volledig verdwenen welvaart.”','Basisgrafiek voor A.\nVoor B is geen tweede\ngrafiek verplicht.');
 notes(s,'50','Bron 3 is volledig overgenomen. De basisgrafiek bevat dezelfde oorspronkelijke functies, Q-as 0–120 en prijsas 0–26 als de boekfiguur. Nog geen oplossingen, gemarkeerde prijzen of gebieden. De leerlingen gebruiken de grafiek voor plan A; voor B volstaan berekeningen en conclusie.','Wat moet je straks berekenen om beide claims te toetsen?','Een lager prijskaartje bewijst geen gegarandeerde aankoop.','Toon alle zes vragen vóór de uitwerking.');
}
{
 const s=slide('Opgave 48 · Vragen a en b',targetFoot);
 text(s,'Gebruik de bronnen en de grafiek op boekpagina 50.\nNoteer berekening, eenheid en conclusie.',60,191,1480,110,34,{color:C.muted});
 text(s,'a. Benoem de maatregelen van plan A en B. Bereken met bron 1 het vrije evenwicht.',60,365,1480,132,40);
 text(s,'b. Bereken voor plan A het nieuwe aanbod in kopersprijzen, de verkochte hoeveelheid, Pc en Pp. Noteer de economische last per bandje voor kopers en verkopers.',60,565,1480,215,40);
 notes(s,'51','Vragen a en b zijn volledig getoond, zonder oplossing. De bronnen blijven in het boek beschikbaar; ga zo nodig terug naar de vorige dia’s.','Heb je in je eigen antwoord beide prijzen én beide lasten genoteerd?','Afdragen en de economische last dragen zijn verschillende bewerkingen.','Toon c en d voordat je antwoorden onthult.');
}
{
 const s=slide('Opgave 48 · Vragen c en d',targetFoot);
 text(s,'c. Bereken bij plan A de overheidsontvangsten, CS, PS en het welvaartsverlies. Gebruik de oorspronkelijke vraag- en aanbodlijn voor de surplusgebieden.',60,223,1480,225,40);
 text(s,'d. Markeer in de basisgrafiek de twee prijzen en de nieuwe hoeveelheid van\nplan A. Arceer de overheidsontvangsten en het welvaartsverlies verschillend. Benoem beide gebieden.',60,535,1480,225,40);
 notes(s,'51','Volledige vragen c en d. Geef nog geen antwoorden. Zowel cijfers als de gemarkeerde grafiek en verschillende arceringen zijn onderdeel van het gevraagde product.','Welke labels en gebieden moeten zichtbaar zijn?','De verschoven aanbodlijn is niet de marginalekostenlijn voor het PS.','Toon e en f.');
}
{
 const s=slide('Opgave 48 · Vragen e en f',targetFoot);
 text(s,'e. Bereken voor plan B Qv, Qa, werkelijke verkopen en tekort. Controleer eerst of de prijsregel bindt.',60,222,1480,161,40);
 text(s,'f. Beoordeel beide delen van de beleidsclaim uit bron 3. Gebruik minstens één berekening per deel. Geef daarna één verschil tussen de plannen dat voor kopers van belang is; trek geen niet-berekende algemene welvaartsconclusie over plan B.',60,464,1480,273,40);
 notes(s,'51','Hiermee zijn alle bronnen, de basisgrafiek en alle deelvragen a–f beschikbaar geweest zonder oplossingen. Laat de klas eerst aangeven welke stap ontbreekt in de eigen poging.','Welke beperking stelt vraag f aan je conclusie?','Een conclusie over toegang is geen volledige welvaartsrangschikking.','Begin nu pas de uitwerking, met het vrije evenwicht.');
}
{
 const s=slide('48a · Maatregelen en vrij evenwicht',targetFoot);
 text(s,'Plan A: belasting per product     Plan B: maximumprijs',60,193,1480,73,39,{bold:true,color:C.blue});
 text(s,'Zonder maatregel: Pc = Pp',60,330,1480,64,40);
 text(s,'24 − 0,20Q = 6 + 0,10Q\n18 = 0,30Q',60,426,1480,130,44);
 text(s,'Q₀ = 60 bandjes per dag',60,603,1480,65,46,{bold:true});
 text(s,'P₀ = 24 − 0,20 × 60 = € 12 per bandje',60,730,1480,69,43,{bold:true,color:C.green});
 notes(s,'50–51','A is belasting omdat per verkoop geld wordt afgedragen; B is maximumprijs omdat verkopen boven een grens verboden zijn. Gelijkstellen geeft 18 = 0,30Q, dus 60. Ook in aanbod: 6 + 0,10 × 60 = 12. Dit vrije evenwicht is het vergelijkingspunt voor beide afzonderlijke plannen.','Welke bronwoorden ondersteunen de modelkeuze?','Gebruik bij het vrije evenwicht nog geen belasting of prijsgrens.','Reken eerst plan A volledig uit.');
}
{
 const s=slide('48b · Aanbod in kopersprijzen',targetFoot);
 text(s,'De aanbieder moet € 3 per verkocht bandje afdragen.',60,190,1480,65,38);
 text(s,'Pc = Pp + 3 = (6 + 0,10Q) + 3',60,316,1480,74,46,{bold:true,color:C.orange});
 text(s,'Nieuw aanbod: Pc = 9 + 0,10Q',60,424,1480,74,46,{bold:true});
 text(s,'24 − 0,20Q = 9 + 0,10Q\n15 = 0,30Q',60,559,1480,134,43);
 text(s,'Qt = 50 bandjes per dag',60,751,1480,68,46,{bold:true,color:C.blue});
 notes(s,'50–51','De oorspronkelijke aanbodfunctie blijft Pp = 6 + 0,10Q. Aanbod in kopersprijzen ligt 3 hoger. Productiekosten zelf verschuiven niet. Los V = A + t op. De verkochte hoeveelheid daalt van 60 naar 50 bandjes per dag.','Waarom tel je de belasting bij Pp op?','Dit is geen vraagverschuiving.','Bereken beide prijzen bij dezelfde Qt.');
}
{
 const s=slide('48b · Prijzen en economische last',targetFoot);
 table(s,[['Uitkomst','Berekening','Bedrag per bandje'],['Kopersprijs Pc','24 − 0,20 × 50','€ 14'],['Verkopersontvangst Pp','6 + 0,10 × 50','€ 11'],['Last koper','14 − 12','€ 2'],['Last verkoper','12 − 11','€ 1']],60,226,1480,416,[550,480,450],34);
 text(s,'Controle: Pc − Pp = 14 − 11 = € 3',60,696,1480,65,43,{bold:true,color:C.orange});
 text(s,'Ook: last koper + last verkoper = 2 + 1 = € 3',60,782,1480,51,34);
 notes(s,'50–51','Kopers betalen 14, verkopers houden na afdracht 11 over, vóór productiekosten. Beide waarden horen bij Qt = 50. Vergelijk elk met P0 = 12: lasten zijn 2 en 1. Twee controles geven dezelfde belasting. Dit is last per verkochte eenheid, niet de volledige daling in surplus.','Wie draagt de meeste last, ondanks dat de aanbieder afdraagt?','Last verkoper is 12 − 11, niet 14 − 11.','Markeer dezelfde gegevens in de grafiek.');
}
{
 const s=slide('48d · Twee prijzen bij dezelfde hoeveelheid',targetFoot);
 graph(s,{tax:3,mark:true});
 right(s,'Plan A','Qt = 50 bandjes per dag\n\nPc = € 14 per bandje\nPp = € 11 per bandje\n\nWig = € 3 per bandje','Pc op V en A + t.\nPp op oorspronkelijke A.');
 notes(s,'50–51','Bouw voort op de onbewerkte basisgrafiek. De nieuwe lijn A + t ligt bij elke hoeveelheid 3 euro boven A. Het snijpunt met V geeft Q = 50 en Pc = 14. Daal op dezelfde verticale lijn naar A voor Pp = 11. De rechte wig ligt tussen die twee punten. De vrije hoeveelheid blijft als referentie 60. Eerst prijzen en hoeveelheden; de gebieden volgen na berekening.','Waarom liggen Pc en Pp op dezelfde verticale lijn?','Pp is niet het snijpunt van A met een willekeurige horizontale prijsregel.','Bereken nu de geldbedragen van c.');
}
{
 const s=slide('48c · Overheidsontvangsten en surplus',targetFoot);
 text(s,'Qt = 50 bandjes per dag · Pc = € 14 en Pp = € 11 per bandje',60,187,1480,69,35,{bold:true,color:C.blue});
 table(s,[['Gebied','Berekening','€ per dag'],['O: alle verkochte bandjes','3 × 50','€ 150'],['CS: onder V, boven Pc','½ × 50 × (24 − 14)','€ 250'],['PS: boven A, onder Pp','½ × 50 × (11 − 6)','€ 125']],60,333,1480,352,[610,560,310],34);
 text(s,'Surplus: gebruik V en de oorspronkelijke A.',60,758,1480,71,42,{bold:true,color:C.green});
 notes(s,'50–51','De CS-driehoek heeft basis 50 bandjes per dag en hoogte 10 euro per bandje. De PS-driehoek heeft dezelfde basis, hoogte 5. Overheidsontvangsten zijn hoogte 3 maal basis 50. Alle uitkomsten zijn euro per dag. De eenheden vallen samen tot geld per periode. De oorspronkelijke aanbodlijn geeft de marginale kosten.','Waarom gebruik je bij PS het intercept 6 en niet 9?','A + t beschrijft de benodigde kopersprijs en is niet de kostengrens van PS.','Neem de overheid mee in de welvaartsvergelijking.');
}
{
 const s=slide('48c · Welvaartsverlies',targetFoot);
 table(s,[['Welvaartsmaat','Berekening','€ per dag'],['Vrije markt: CS + PS','360 + 180','540'],['Plan A: CS + PS + O','250 + 125 + 150','525'],['Welvaartsverlies W','540 − 525','15']],60,232,1480,338,[630,540,310],34);
 text(s,'Controle met de driehoek:',60,632,1480,60,36,{bold:true});
 text(s,'W = ½ × (60 − 50) × 3 = € 15 per dag',60,729,1480,78,44,{bold:true,color:C.orange});
 notes(s,'50–51','Zonder maatregel: 540. Met belasting telt O mee: 525. Het verschil 15 is verloren voordeel van gemiste transacties, geen verdwenen belastinggeld. De driehoekscontrole gebruikt de tien niet meer gerealiseerde bandjes. De bron sluit effecten voor buitenstaanders en uitvoeringskosten uit; ga niet speculeren over latere besteding van de inkomsten.','Welk bedrag zou ontbreken als je alleen CS en PS optelt?','150 euro overheidsontvangsten is niet 150 euro verlies.','Koppel O en W aan verschillende gearceerde gebieden.');
}
{
 const s=slide('48d · Ontvangsten en verlies arceren',targetFoot);
 graph(s,{tax:3,mark:true,areas:true});
 right(s,'O en W','O: rechthoek\nQ: 0 tot 50\nP: € 11 tot € 14\n\nW: driehoek\nQ: 50 tot 60\nTussen V en A','O = € 150 per dag\nW = € 15 per dag',C.orange);
 notes(s,'50–51','O is rechthoek (0,11), (50,11), (50,14), (0,14), verticaal gearceerd. W is driehoek (50,11), (60,12), (50,14), horizontaal gearceerd. De gebieden zijn afzonderlijk benoemd. De hoogte van W is 3 euro; de basis 10 bandjes per dag. Het kleine driehoekje is bewust op dezelfde assen als de basisgrafiek getekend. Label W staat buiten het gebied met een verwijslijn.','Welke transacties horen bij elke arcering?','O ligt over verkochte bandjes, W over gemiste bandjes.','Laat plan A los en begin plan B opnieuw bij het vrije evenwicht.');
}
{
 const s=slide('48e · Maximumprijs en tekort',targetFoot);
 text(s,'Plan B geldt afzonderlijk: € 10 < P₀ = € 12 → bindend',60,185,1480,79,39,{bold:true,color:C.blue});
 table(s,[['Grootheid','Berekening','Bandjes per dag'],['Qv bij € 10','10 = 24 − 0,20Qv → Qv = 70','70'],['Qa bij € 10','10 = 6 + 0,10Qa → Qa = 40','40'],['Werkelijke verkopen','Alle aangeboden bandjes worden verkocht','40'],['Tekort','Qv − Qa = 70 − 40','30']],60,338,1480,360,[440,690,350],32);
 text(s,'Geen extra aanvoer: 70 gewenste aankopen, 40 verkopen.',60,759,1480,70,39,{bold:true,color:C.green});
 notes(s,'50–51','Reset: geen belasting, subsidie of opkoop. De vrije prijs 12 is hoger dan het maximum 10, dus bindend. Oplossen van vraag geeft 14 = 0,20Qv, Qv = 70. Aanbod geeft 4 = 0,10Qa, Qa = 40. Alle 40 worden volgens de bron verkocht aan de hoogste betalingsbereidheden. Tekort 30. Geen tweede grafiek vereist.','Welke bronzin rechtvaardigt de veertig werkelijke verkopen?','Bereken Qa met oorspronkelijke A; A + t hoort alleen bij plan A.','Beoordeel de twee uitspraken met deze cijfers.');
}
{
 const s=slide('48f · Beide delen van de claim toetsen',targetFoot);
 text(s,'“Plan B maakt een bandje bereikbaar voor iedereen die er bij € 10 een wil.”',60,192,1480,108,36,{bold:true});
 text(s,'Onjuist: 70 willen kopen, 40 kopen. Tekort: 70 − 40 = 30 per dag.',60,327,1480,106,37,{color:C.blue});
 rule(s,60,478,1480);
 text(s,'“Plan A levert de overheid geld op; dat geld is volledig verdwenen welvaart.”',60,521,1480,108,36,{bold:true});
 text(s,'Onjuist: O = 3 × 50 = € 150 per dag; W = 540 − 525 = € 15 per dag.\nO telt mee in de welvaartsmaat.',60,664,1480,142,37,{color:C.orange});
 notes(s,'50–51','Eerste deel: betaalbaar tegen 10 betekent niet verkrijgbaar voor iedereen; 30 gewenste aankopen gaan niet door. Tweede deel: het geld bij de overheid is een overdracht, slechts 15 aan voordeel ontstaat niet meer. Elk deel bevat minimaal één expliciete berekening.','Welke berekening weerlegt welk deel van de claim?','Zeg niet alleen dat de claim fout is: noem brongegeven, berekening en gevolg.','Vergelijk één concreet verschil voor kopers.');
}
{
 const s=slide('48f · Prijs en toegang voor kopers',targetFoot);
 table(s,[['Voor kopers','Plan A','Plan B'],['Betaalde prijs per bandje','€ 14','€ 10'],['Werkelijk verkochte bandjes per dag','50','40']],60,229,1480,290,[760,360,360],36);
 text(s,'Onder B betalen kopers die kunnen kopen € 4 minder.\nEr worden ook 10 bandjes per dag minder verkocht.',60,583,1480,126,41,{bold:true,color:C.blue});
 text(s,'Deze vergelijking geeft geen volledige welvaartsrangschikking.',60,771,1480,64,35);
 notes(s,'50–51','De lagere prijs geldt voor wie een bandje bemachtigt. Onder B gaan 40 transacties door, onder A 50. Prijsverschil 14 − 10 = 4 euro; verschil in verkopen 50 − 40 = 10 bandjes per dag. De bron verdeelt onder B op hoogste betalingsbereidheid. Geen niet-berekend oordeel over totale welvaart onder B toevoegen. Laat leerlingen hun eigen volledige a–f nalopen en één ontbrekende stap verbeteren.','Welke kopers profiteren van de lagere prijs?','Een groepsgemiddelde of lagere prijs betekent niet dat iedere koper beter af is.','Ga naar afsluiting en huiswerk.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...authored,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,geometry},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
// Pin the numeric chart viewport so editable annotations stay equation-aligned.
const patch=`import sys,zipfile,xml.etree.ElementTree as E,os\np=sys.argv[1]\nns='http://schemas.openxmlformats.org/drawingml/2006/chart'\nE.register_namespace('c',ns)\nwith zipfile.ZipFile(p) as z: files={n:z.read(n) for n in z.namelist()}\nfor n,b in list(files.items()):\n if '/charts/' not in n or not n.endswith('.xml'): continue\n r=E.fromstring(b); a=r.find('.//{'+ns+'}plotArea')\n if a is None: continue\n l=a.find('{'+ns+'}layout')\n if l is not None: a.remove(l)\n l=E.Element('{'+ns+'}layout');a.insert(0,l);m=E.SubElement(l,'{'+ns+'}manualLayout')\n for k,v in [('layoutTarget','inner'),('xMode','edge'),('yMode','edge'),('wMode','factor'),('hMode','factor'),('x','${frac.x}'),('y','${frac.y}'),('w','${frac.w}'),('h','${frac.h}')]:E.SubElement(m,'{'+ns+'}'+k,{'val':v})\n files[n]=E.tostring(r,encoding='utf-8',xml_declaration=True)\nwith zipfile.ZipFile(p+'.tmp','w',zipfile.ZIP_DEFLATED) as z:\n for n,b in files.items():z.writestr(n,b)\nos.replace(p+'.tmp',p)\n`;
await fs.writeFile(path.join(BUILD,'plot-layout.py'),patch);execFileSync(PYTHON,[path.join(BUILD,'plot-layout.py'),candidate]);
const tableOwners=[...new Set(tables)];
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'3.1.6 Gemengde opgaven - overheidsingrijpen – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tableOwners.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tableOwners,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
