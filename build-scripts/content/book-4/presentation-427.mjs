// HOW TO ADAPT: read the classroom recipe, the current manuscript and full answer
// model. Update the adjacent source manifest first. Runtime paths come from the
// installed presentation bundle through environment variables, never this file.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {Presentation,PresentationFile,finalizePresentation,applyPresentationChartFont,
 PYTHON,SKILL,TOOLS,workspace} from '../../presentations/runtime.mjs';
const authored=JSON.parse(await fs.readFile(fileURLToPath(new URL('./presentation-427.manifest.json',import.meta.url)),'utf8'));
const {root:ROOT,build:BUILD,final:FINAL}=await workspace('427');
const p=Presentation.create({slideSize:{width:1600,height:900}});
const C={ink:'#183247',blue:'#1A5276',green:'#20665B',orange:'#A94D16',purple:'#7B2D8E',paper:'#FFFFFF',pale:'#EFF4F7',muted:'#445B6B',line:'#C6D2DB',loss:'#F1948A'};
const FONT='Arial',tables=[],charts=[],slides=[],overviews=[],geometry=[];
const foot='§4.2.7 Gemengde opgaven: marktvormen en marktfalen';
const targetFoot=foot+' · Opgave 58 · Boekpagina 108–109';
const base=`https://github.com/meijer1973/4veco-lessen/blob/${authored.sourceCommit}/${authored.sourceEdition}/`;
function text(s,str,x,y,w,h,size=36,{bold=false,color=C.ink,align='left',name,fill='none'}={}){
 const q=s.shapes.add({geometry:'textbox',name:name||str.slice(0,65),position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});
 q.text=str;q.text.style={typeface:FONT,fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:{left:0,right:0,top:0,bottom:0}};return q;
}
function rule(s,x,y,w,color=C.line){s.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},line:{fill:color,width:2}});}
function slide(title,footer=foot){const s=p.slides.add();s.background.fill=C.paper;text(s,title,60,42,1480,86,50,{bold:true});rule(s,60,146,1480);text(s,footer,60,848,1400,30,21,{color:C.muted});text(s,String(p.slides.items.length),1470,845,70,32,22,{color:C.muted,align:'right',name:'slide-number'});slides.push({number:p.slides.items.length,title});return s;}
function notes(s,pages,explanation,question,pitfall,transition,example=false){s.speakerNotes.textFrame.setText(`Vraag: ${question}\n\nUitleg: ${explanation}\n\nMisvatting: ${pitfall}\n\nOvergang: ${transition}\n\nBron: Boek 4, books34-v3, gedrukte boekpagina ${pages}. ${base}output/Boek_4_Compleet_v3.pdf\nManuscript en antwoordmodel: ${base}chapters/4.2/4.2.7%20manuscript.md en ${base}chapters/4.2/Antwoorden.md\n${example?'Uitlegvoorbeeld — niet uit het boek. Context en gegevens zijn voor deze presentatie gemaakt. De genoemde boekpagina’s ondersteunen alleen de methode.':''}`);}
function table(s,values,x,y,w,h,widths,size=32){const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:C.line,width:1,style:'solid'});for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.ink:(r%2?C.paper:C.pale);cell.text.style={typeface:FONT,fontSize:size,color:r===0?'#FFFFFF':C.ink,bold:r===0,verticalAlignment:'middle',insets:{left:18,right:16,top:10,bottom:10}};}}tables.push(p.slides.items.length);return t;}
const route=['Jas in de kluis of aan de kapstok. Pak agenda, schrift, pen en rekenmachine.','Maak de startopdracht.','Korte herhaling en aanpak.','Werk verder aan de gemengde opgaven, stel vragen en kijk je antwoorden na.','Klaar? Werk aan een ander vak. Geen devices.','Bespreken van de doelopgave: opgave 58.','Zet je huiswerk in je agenda.'];
function overview(phase,active){const s=slide('Deze les: §4.2.7 Gemengde opgaven');overviews.push(p.slides.items.length);
 text(s,'Nu: '+phase,60,112,1450,43,30,{bold:true,color:C.blue,name:'phase'});text(s,'Lesroute',60,185,835,45,35,{bold:true});
 const ys=[244,347,409,476,603,696,774],hs=[90,45,45,103,73,65,50];route.forEach((r,i)=>{const col=active===i+1?C.blue:C.ink;text(s,`${i+1}.`,60,ys[i],48,hs[i],30,{bold:true,color:col,name:'route-number-'+(i+1)});text(s,r,116,ys[i],779,hs[i],30,{bold:active===i+1,color:col,name:'route-'+(i+1)});});
 text(s,'Lesdoelen',972,185,565,45,35,{bold:true});text(s,'Model uit de bron kiezen.\nSurplus en derden meewegen.\nEen beleidsconclusie begrenzen.',972,244,565,123,30,{name:'overview-goals'});rule(s,972,374,568);
 text(s,'Startopdracht',972,401,565,45,35,{bold:true,color:active===2?C.blue:C.ink});text(s,'Pagina 105 · Opgave 55\nSteun: uitleg §§4.2.1–4.2.6',972,455,565,95,30,{name:'overview-start',bold:active===2});rule(s,972,567,568);
 text(s,'Huiswerk',972,595,565,45,35,{bold:true,color:active===7?C.blue:C.ink});text(s,'§4.2.7 · Opgaven 55–60\nVerder: 56–57 · Doel: 58\nExtra gemengd: 59 · Herhaling: 60\nMaken en nakijken',972,654,565,178,30,{name:'overview-homework',bold:active===7});
 notes(s,'105–110',`Laat staan tijdens ${phase.toLowerCase()}. Start 55 is de eerste echte opgave. Er zijn geen aparte basisopgaven. Voorbereiding 55–57, doel 58, extra gemengd 59 en herhaling 60. De classroomroute wijst alle opgaven 55–60 aan als huiswerk, inclusief 60 met behoud van het bronlabel Herhaling. De docentroute noemt 60 aanvullend; hier is hij dus expliciet toegewezen. Geen bonussectie. Opgave 58 is gekozen omdat modelkeuze, berekening, arcering en een begrensde beleidsconclusie samenkomen. De volledige route heeft geen gemeten één-les-fit. Start 55 vraagt eerder onderwezen methoden: monopolie versus efficiënte uitkomst (§4.2.1 p.55–58), externe kosten en wig (§4.2.4 p.78–82), groepsscheiding en doorverkoop (§4.2.2 p.63–65). Laat leerlingen die uitleg bij twijfel gebruiken. Vraag vóór zelfstandig werk welke startstap nog hulp nodig heeft. Beheersing wordt niet verondersteld op grond van eerdere behandeling.`, 'Welke bronzin bepaalt jouw aanpak?', 'De lokale hoofdstukpagina’s 53–58 zijn in het volledige boek 105–110.',active===7?'Noteer alle opgaven en rond het nakijken af.':'Volg de aangegeven lesfase.');return s;
}
// Native XY charts; editable regions use exactly the same fixed plot transform.
const box={left:60,top:222,width:960,height:590},frac={x:.14,y:.06,w:.82,h:.80};
const plot={left:box.left+box.width*frac.x,top:box.top+box.height*frac.y,width:box.width*frac.w,height:box.height*frac.h};
function graph(s,{kind='A',mark=false,loss=false}={}){
 const maxQ=kind==='A'?50:60,maxP=80,X=q=>plot.left+q/maxQ*plot.width,Y=v=>plot.top+(1-v/maxP)*plot.height;
 const series=[],regions=[],hatches=[];
 function line(name,xs,ys,col,width=4,dashed=false){series.push({name,xValues:xs,values:ys,line:{fill:col,width,...(dashed?{style:'dashed'}:{})},marker:{symbol:'none'}});}
 if(loss){const pts=[[20,50],[30,40],[20,30]],xs=pts.map(a=>X(a[0])),ys=pts.map(a=>Y(a[1])),l=Math.min(...xs),t=Math.min(...ys),w=Math.max(...xs)-l,h=Math.max(...ys)-t;const commands=pts.map((a,i)=>({[i?'lineTo':'moveTo']:{x:X(a[0])-l,y:Y(a[1])-t}}));commands.push({close:{}});s.shapes.add({geometry:'custom',name:'area-welvaartsverlies',position:{left:l,top:t,width:w,height:h},fill:C.loss,line:{fill:'none',width:0},customPaths:[{width:w,height:h,commands}]});regions.push({points:pts,position:{left:l,top:t,width:w,height:h},commands});}
 if(kind==='A'){line('Vraag = GO',[0,50],[70,20],C.blue);line('MO',[0,35],[70,0],C.purple,4,true);line('MK',[0,50],[10,60],C.orange);}
 else{line('Vraag',[0,60],[60,0],C.blue);line('A = MK privé',[0,60],[0,60],C.green);line('MK maatschappelijk',[0,60],[20,80],C.orange,4,true);}
 if(mark){const pc=kind==='A'?50:40,pp=kind==='A'?30:20;line('hoeveelheid',[20,20],[0,pc],C.muted,1.5,true);line('hoge prijs',[0,20],[pc,pc],C.muted,1.5,true);line('lage prijs',[0,20],[pp,pp],C.muted,1.5,true);if(kind==='B'){line('belastingwig',[20,20],[20,40],C.orange,5);line('oude hoeveelheid',[30,30],[0,30],C.muted,1.5,true);}if(loss)line('efficiënt',[30,30],[0,40],C.muted,1.5,true);}
 const ch=s.charts.add('scatter',{position:box,series,scatterOptions:{style:'line'},hasLegend:false,dataLabels:{showValue:false,showSeriesName:false},xAxis:{min:0,max:maxQ,majorUnit:10,numberFormatCode:'0',title:{text:kind==='A'?'Q (sessies per week)':'Q (diensten per dag)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},line:{fill:C.ink,width:1.5}},yAxis:{min:0,max:maxP,majorUnit:10,numberFormatCode:'0',title:{text:kind==='A'?'P, MO en MK (€ per sessie)':'P en kosten (€ per dienst)',textStyle:{typeface:FONT,fontSize:25,fill:C.ink}},textStyle:{typeface:FONT,fontSize:24,fill:C.ink},majorGridlines:{fill:C.line,width:.6},line:{fill:C.ink,width:1.5}},chartFill:'none',plotAreaFill:'none'});
 applyPresentationChartFont(ch,{fontFamily:FONT});charts.push(p.slides.items.length);
 if(kind==='A'){text(s,'Vraag = GO',X(36),Y(34)-50,205,40,27,{bold:true,color:C.blue});text(s,'MK',X(44),Y(54)-49,85,36,27,{bold:true,color:C.orange});text(s,'MO',X(7),Y(45)+15,82,36,27,{bold:true,color:C.purple});}
 else{text(s,'Vraag',X(46),Y(14)-50,105,36,27,{bold:true,color:C.blue});text(s,'A = MK privé',X(43),Y(43)+20,210,38,27,{bold:true,color:C.green});text(s,mark?'A + t = MK maatschappelijk':'MK maatschappelijk',X(mark?25:30),mark?205:Y(70)-51,450,40,27,{bold:true,color:C.orange});}
 if(mark){const pc=kind==='A'?50:40,pp=kind==='A'?30:20;text(s,kind==='A'?'Pm = 50':'Pc = 40',X(1),Y(pc)-40,155,35,26,{bold:true,fill:C.paper});text(s,kind==='A'?'MK = 30':'Pp = 20',X(1),Y(pp)+5,155,35,26,{bold:true,fill:C.paper});text(s,kind==='A'?'M':'E₁',X(20)+12,Y(pc)-53,65,40,28,{bold:true});}
 if(loss){for(let v=31;v<50;v+=1.5){const end=v<=40?v-10:70-v;const pos={left:X(20),top:Y(v),width:X(end)-X(20),height:0};s.shapes.add({geometry:'line',name:'hatch-loss-'+v,position:pos,line:{fill:'#9C3529',width:1.2}});hatches.push({v,end,position:pos});}text(s,'E',X(30)+12,Y(40)-58,50,38,28,{bold:true});text(s,'W',X(21),Y(43),50,35,26,{bold:true,color:'#74291F'});}
 let shift=null;if(kind==='B'&&mark){const y=Y(60),x1=X(60),x2=X(40);
  s.shapes.add({geometry:'line',name:'horizontal-shift-arrow',position:{left:x2,top:y,width:x1-x2,height:0},line:{fill:C.orange,width:3}});
  s.shapes.add({geometry:'custom',name:'shift-arrowhead',position:{left:x2,top:y-8,width:13,height:16},fill:'none',line:{fill:C.orange,width:3},customPaths:[{width:13,height:16,commands:[{moveTo:{x:13,y:0}},{lineTo:{x:0,y:8}},{lineTo:{x:13,y:16}}]}]});
  shift={price:60,oldQ:60,newQ:40,position:{left:x2,top:y,width:x1-x2,height:0}};text(s,'Pc = € 60',X(41),y+9,155,32,24,{bold:true,color:C.orange});}
 geometry.push({slide:p.slides.items.length,kind,mark,loss,box,frac,plot,maxQ,maxP,series,regions,hatches,shift});return {X,Y};
}
function right(s,title,body,tail='',color=C.blue){text(s,title,1080,211,460,106,37,{bold:true,color});text(s,body,1080,337,460,290,34);if(tail)text(s,tail,1080,671,460,149,33,{bold:true,color});}

overview('Startopdracht',2);
{
 const s=slide('Modelkeuze en welvaartsrekening');
 table(s,[['Bron gaat over…','Bekende aanpak'],['Marktmacht zonder externe effecten','MO = MK; prijs op vraag; vergelijk TS'],['Gescheiden klantgroepen','Controleer voorwaarden; tel gezamenlijke kosten eenmaal'],['Schade of voordeel voor derden','Gebruik de wig; neem overheid én derden mee']],60,209,1480,410,[560,920],33);
 text(s,'Conclusie: brongegeven + berekening + criterium + beperking',60,688,1480,95,38,{bold:true,color:C.blue});
 notes(s,'55–58, 63–65, 71–72, 78–82, 88–91, 99–100','Korte herhaling. Monopolie: TS=CS+PS, winst=PS−TCK bij dezelfde vaste kosten. Prijsdiscriminatie vraagt marktmacht, herkenbare groepen en verhindering van doorverkoop; gelijke totale afzet bewijst geen gelijke verdeling. Een dalende eigen vraag is ook mogelijk bij monopolistische concurrentie, dus gebruik kenmerken van aanbieders, product en toetreding. Negatieve externe effecten: CS+PS+heffingsopbrengst−totale schade−echte uitvoering. Positieve: CS+PS−subsidie-uitgaven+externe baten−uitvoering. Heffing Pc=Pp+t; subsidie Pp=Pc+s. Bedragen per eenheid vermenigvuldigen met alle gerealiseerde eenheden. Gebruik de eerdere uitleg bij onzekerheid.','Welke partij ontbreekt als je alleen CS en PS telt?','Winst, overheidsbudget en maatschappelijk surplus beantwoorden verschillende vragen.','Herhaal de monopolieprocedure met nieuwe gegevens.');
}
{
 const s=slide('Filmzaal · Hoeveelheid, prijs en winst','Uitlegvoorbeeld — niet uit het boek · Filmzaal');
 text(s,'Eén aanbieder · P = 54 − Q · TK = 40 + 6Q + 0,5Q²',60,185,1480,69,38,{bold:true,color:C.blue});
 text(s,'Q: bezoeken per week · P: € per bezoek · capaciteit 40\nGeen externe effecten; dezelfde € 40 constante kosten.',60,269,1480,109,31);
 table(s,[['Stap','Berekening'],['Hoeveelheid via MO = MK','54 − 2Q = 6 + Q   ⇒   Qm = 16 bezoeken per week'],['Prijs op de vraaglijn','Pm = 54 − 16 = € 38 per bezoek'],['Omzet en kosten','TO = 38 × 16 = 608; TK = 40 + 96 + 128 = 264'],['Winst','608 − 264 = € 344 per week']],60,417,1480,341,[470,1010],32);
 notes(s,'55–58','Eigen fictieve Filmzaal, niet een boekopgave. TO=54Q−Q², dus MO=54−2Q; MK=6+Q. Uit 48=3Q volgt 16. MO gaat van boven naar onder MK en 16≤40. Prijs 38 lees je uit de vraag, niet uit MO. TVK=6×16+0,5×256=224; TK=264, TO=608. Winst=344 euro per week. Dit voorbeeld onthult geen toegewezen antwoord.','Op welke lijn staat de prijs die bezoekers betalen?','MO=MK geeft de hoeveelheid; dat snijpunt geeft niet de verkoopprijs.','Kijk met dezelfde gegevens naar surplus.',true);
}
{
 const s=slide('Filmzaal · Surplus en efficiënte vergelijking','Uitlegvoorbeeld — niet uit het boek · Filmzaal');
 table(s,[['€ per week','Monopolie: Qm = 16','Efficiënt: Qe = 24'],['CS','½ × 16 × (54 − 38) = 128','½ × 24 × (54 − 30) = 288'],['PS = TO − TVK','608 − 224 = 384','720 − 432 = 288'],['TS = CS + PS','512','576']],60,219,1480,370,[440,520,520],31);
 text(s,'Efficiënt: P = MK   ⇒   54 − Q = 6 + Q   ⇒   Qe = 24',60,650,1480,67,38,{bold:true,color:C.green});
 text(s,'Welvaartsverlies = 576 − 512 = € 64 per week',60,751,1480,67,42,{bold:true,color:C.orange});
 notes(s,'55–58','Eigen Filmzaal. Efficiënte vergelijking dezelfde vraag, kosten, vaste kosten en capaciteit; P=30 bij Q=24. TVK=6×24+0,5×24²=432; TO=720. PS=288. Bij monopolie is PS384 en winst344, verschil TCK40. Controle verliesdriehoek: basis24−16=8 en hoogte vraag(16)−MK(16)=38−22=16; helft×8×16=64. Die ligt tussen vraag en MK over de gemiste bezoeken. Toon de exacte arcering later bij het echte doel.','Waarom verschilt PS van winst met € 40?','Hoger producentensurplus bewijst geen hoger totaal surplus.','Herhaal één volledige rekening met derden.',true);
}
{
 const s=slide('Maaltijdbezorging · De volledige rekening','Uitlegvoorbeeld — niet uit het boek · Maaltijdbezorging');
 text(s,'Gegeven weekuitkomsten · schade € 3 per bezorging · heffing € 3',60,183,1480,76,35,{bold:true,color:C.blue});
 table(s,[['Post','Zonder heffing','Met heffing'],['Bezorgingen per week','10','8'],['CS + PS (€ per week)','75','48'],['+ Overheidsontvangsten','0','3 × 8 = 24'],['− Externe schade','3 × 10 = 30','3 × 8 = 24'],['− Uitvoeringskosten','0','2'],['Maatschappelijk surplus','75 − 30 = 45','48 + 24 − 24 − 2 = 46']],60,294,1480,421,[580,390,510],30);
 text(s,'Verandering: 46 − 45 = € 1 per week',60,760,1480,67,41,{bold:true,color:C.green});
 notes(s,'78–82, 99–100','Eigen fictieve concurrerende bezorgmarkt. De uitkomsten zijn gegeven. Ter controle voor de docent komen ze uit Pc = 19 − 0,75Q en Pp = 4 + 0,75Q, met Q in bezorgingen per week. Zonder heffing: Q = 10, P = 11,50, CS en PS elk 37,50. Met heffing van 3: Q = 8, Pc = 13, Pp = 10, CS en PS elk 24. Leerlingen hoeven deze onderliggende functies hier niet op te lossen. De maatschappelijke rekening heeft geen andere posten. Bereken ontvangst en schade over alle acht bezorgingen. €24 ontvangst is een overdracht, €24 schade treft derden, €2 uitvoering gebruikt middelen. De gelijke bedragen ontvangst/schade volgen hier uit de gegevens, niet uit de definitie. Een verbetering van één euro betekent niet dat omwonenden zijn gecompenseerd. Controleer bij subsidie hetzelfde schema met overheidsuitgaven negatief en externe baten positief.','Waarom trek je uitvoering af, maar tel je ontvangst op?','Een betaling is niet automatisch extra voordeel of verbruik van middelen.','Ga terug naar de startpoging en werk verder aan de gemengde opgaven.',true);
}
overview('Zelfstandig werken',4);
{
 const s=slide('Opgave 58 · Bron A: Studio Solo',targetFoot);
 text(s,'Eén aanbieder verhuurt de hele afgebakende markt voor studiosessies.',60,186,1480,105,38);
 text(s,'Vraag: P = 70 − Q\nTK = 100 + 10Q + 0,5Q²\nMK = 10 + Q',60,338,1480,207,43,{bold:true,color:C.blue});
 text(s,'Q: sessies per week · P: euro per sessie · capaciteit: 50 sessies\nConstante kosten blijven deze week gelijk. Geen externe effecten.',60,588,1480,110,33);
 text(s,'Efficiënt bij dezelfde vraag en kosten:\nQe = 30 · Pe = € 40 · TSe = € 900 per week',60,735,1480,101,35,{bold:true,color:C.green});
 notes(s,'108','Volledige bron A, gesplitst van de bijbehorende figuur. De gegeven efficiënte vergelijking is broninformatie, geen onthuld antwoord. Alle marktomvang-, kosten-, capaciteit- en periodeaannames blijven behouden.','Welke voorwaarden blijven bij de vergelijking gelijk?','De efficiënte uitkomst betreft dezelfde markt en kosten.','Bekijk de oningevulde bronfiguur A.');
}
{
 const s=slide('Opgave 58 · Figuur A',targetFoot);graph(s);right(s,'Studio Solo','Vraag = GO\nMO = 70 − 2Q\nMK = 10 + Q','De monopolie-uitkomst\nis nog niet gemarkeerd.');
 notes(s,'108','Figuur31 opnieuw als bewerkbare XY-grafiek. Zelfde domeinen en schaal als bron: Q0–50, verticale as0–80. Vraag70−Q; MO70−2Q tot Q35 op P0; MK10+Q. De bron toont MO al. Geen monopoliepunt, guides of verliesgebied vóór alle vragen.','Welke lijn hoort bij de verkoopprijs?','De hoeveelheid volgt later uit MO/MK.','Lees nu bron B als een afzonderlijke markt.');
}
{
 const s=slide('Opgave 58 · Bron B: Reiniging bij woningen',targetFoot);
 text(s,'Veel aanbieders leveren dezelfde dienst.',60,187,1480,65,39);
 text(s,'Vraag: Pc = 60 − Q\nAanbod: Pp = Q',60,292,1480,133,44,{bold:true,color:C.blue});
 text(s,'Q: diensten per dag · prijzen: euro per dienst\nElke dienst veroorzaakt € 20 niet-vergoede schade aan omwonenden.\nProducenten gaan € 20 per dienst afdragen.',60,475,1480,182,35);
 text(s,'Na heffing: CS en PS elk € 200 per dag\nZonder ingrijpen: maatschappelijk surplus € 300 per dag\nGeen uitvoeringskosten of andere externe effecten.',60,688,1480,140,33,{bold:true,color:C.green});
 notes(s,'108','Volledige bron B. Benoem veel aanbieders, dezelfde dienst en de omwonenden als derde partij. CS/PS na heffing en het maatschappelijk surplus vóór zijn gegeven. Wissel expliciet van sessies per week naar diensten per dag.','Welke post hoort bij de omwonenden?','Tel de geldbedragen van bron A en B nooit bij elkaar op.','Bekijk figuur B zonder opgeloste punten.');
}
{
 const s=slide('Opgave 58 · Figuur B',targetFoot);graph(s,{kind:'B'});right(s,'Reiniging','Vraag: Pc = 60 − Q\nA = MK privé = Q\nMK maatschappelijk\n= Q + 20','Andere markt.\nAndere periode: per dag.');
 notes(s,'108','Figuur32 opnieuw als bewerkbare XY-grafiek met dezelfde Q0–60 en verticale schaal0–80. De maatschappelijke marginale kosten zijn eigen kosten plus €20 niet-vergoede schade per extra dienst. Geen belaste hoeveelheid of twee prijzen gemarkeerd.','Waarom liggen maatschappelijke kosten hoger?','De maatschappelijke-kostenlijn is niet automatisch het ongereguleerde aanbod.','Toon alle zes deelvragen voordat antwoorden verschijnen.');
}
{
 const s=slide('Opgave 58 · Vragen a en b',targetFoot);
 text(s,'Gebruik de bronnen op boekpagina 108. Onderbouw berekeningen\nmet eenheden en conclusies met brongegevens.',60,185,1480,106,33,{color:C.muted});
 text(s,'a. (3p) Bepaal voor Studio Solo de winstmaximale hoeveelheid en verkoopprijs. Bereken ook de winst.',60,366,1480,160,40);
 text(s,'b. (4p) Bereken CS, PS en TS bij Solo en vergelijk met het gegeven TSe. Arceer het welvaartsverlies in figuur A.',60,615,1480,165,40);
 notes(s,'109','Alle tekst en punten van a en b; antwoorden volgen pas na c–f. De bron staat in het boek en op de vorige dia’s.','Heb je zowel berekeningen als arcering voorbereid?','PS is niet hetzelfde als winst.','Toon c en d.');
}
{
 const s=slide('Opgave 58 · Vragen c en d',targetFoot);
 text(s,'c. (3p) Bereken in bron B de belaste hoeveelheid, Pc, Pp en de heffingsopbrengst.',60,250,1480,171,41);
 text(s,'d. (2p) Bereken met bron B het maatschappelijk surplus na de heffing en de verandering ten opzichte van de beginsituatie.',60,536,1480,217,41);
 notes(s,'109','Volledige vragen c en d, zonder antwoorden. Vraag c vraagt vier uitkomsten; vraag d vraagt zowel het niveau na als het verschil met vóór.','Welke periode hoort bij elk bedrag?','Heffingsopbrengst is geen volledige welvaartsverandering.','Toon de verklarings- en beoordelingsvragen.');
}
{
 const s=slide('Opgave 58 · Vragen e en f',targetFoot);
 text(s,'e. (2p) Leg uit waarom minder verkopen bij Solo welvaartsverlies geeft, maar minder diensten in bron B juist verbetering kan geven.',60,236,1480,197,40);
 text(s,'f. (2p) Beoordeel: “Een heffing van € 20 is dus ook vanzelf de beste oplossing voor Studio Solo.”',60,550,1480,200,40);
 notes(s,'109','Hiermee zijn beide complete bronnen, hun grafieken en alle a–f getoond zonder uitwerking. Begin de bespreking alleen nadat leerlingen zelf hebben gewerkt.','Welke oorzaak verschilt tussen de twee markten?','Dezelfde maatregel overnemen zonder oorzaak te onderzoeken is geen onderbouwd advies.','Begin de antwoorden bij Solo: hoeveelheid en prijs.');
}
{
 const s=slide('58a · Hoeveelheid en verkoopprijs',targetFoot);graph(s,{mark:true});right(s,'MO = MK','70 − 2Q = 10 + Q\n60 = 3Q\nQm = 20 sessies/week\n\nPm = 70 − 20\n= € 50 per sessie','20 ≤ capaciteit 50\nPrijs op de vraaglijn.');
 notes(s,'108–109','TO=70Q−Q²; MO=70−2Q. MO gaat van boven naar onder MK; het snijpunt geeft een winstmaximum. Capaciteit50 bindt niet. Bij Q20 is MK30, maar de prijs50 op vraag. M=(20,50). De horizontale lijn op30 markeert MK, geen verkoopprijs.','Waarom is de verkoopprijs geen €30?','MO is extra opbrengst, niet de prijs van elke sessie.','Bereken omzet en totale kosten bij deze hoeveelheid.');
}
{
 const s=slide('58a · Winst van Studio Solo',targetFoot);
 table(s,[['Grootheid','Berekening','€ per week'],['Totale opbrengst','50 × 20','1.000'],['Totale kosten','100 + 10 × 20 + 0,5 × 20²','500'],['Winst = TO − TK','1.000 − 500','500']],60,246,1480,346,[470,700,310],34);
 text(s,'TVK = 200 + 200 = € 400 per week',60,662,1480,68,40,{bold:true,color:C.green});
 text(s,'Controle: PS = 1.000 − 400 = 600; winst = 600 − 100',60,763,1480,65,37,{bold:true});
 notes(s,'108–109','Vul Q = 20 in de gegeven kostenfunctie in. Kwadrateer eerst: 0,5 × 400 = 200. TK = 100 + 200 + 200 = 500. De winst is 500. TVK = 400 en PS = 600. Trek de constante kosten van 100 alleen bij de stap van PS naar winst af. Alle totalen zijn euro per week.','Welke kosten zijn al van het producentensurplus af?','Trek constante kosten niet tweemaal af.','Bereken nu het voordeel voor kopers en producent samen.');
}
{
 const s=slide('58b · Consumenten- en producentensurplus',targetFoot);
 table(s,[['Gebied','Berekening','€ per week'],['CS','½ × 20 × (70 − 50)','200'],['PS: rechthoek + driehoek','20 × (50 − 30) + ½ × 20 × (30 − 10)','600'],['TS = CS + PS','200 + 600','800']],60,235,1480,355,[510,700,270],31);
 text(s,'MK(20) = € 30 · PS is het gebied boven MK, onder Pm',60,652,1480,93,38,{bold:true,color:C.green});
 text(s,'TSe − TSm = 900 − 800 = € 100 per week',60,765,1480,65,42,{bold:true,color:C.orange});
 notes(s,'108–109','CS ligt onder de vraag en boven de prijs van 50 tot Q = 20. De driehoek heeft hoogte 20. PS ligt boven MK = 10 + Q en onder de prijs van 50 tot Q = 20. Het bestaat uit een rechthoek van 20 bij 20 en een driehoek met basis 20 en hoogte 20: samen 600. Controle: TO − TVK = 1.000 − 400 = 600. Dezelfde constante kosten gelden in beide situaties, zodat de verandering van TS bruikbaar is. Het efficiënte TS van 900 is gegeven.','Waarom heeft het PS hier twee eenvoudige deelgebieden?','Alleen de driehoek onder de prijs gebruiken zou het rechthoekige deel missen.','Laat zien waar de ontbrekende100 in figuur A ligt.');
}
{
 const s=slide('58b · Welvaartsverlies in figuur A',targetFoot);graph(s,{mark:true,loss:true});right(s,'W: verloren surplus','Tussen vraag en MK\nQ: 20 tot 30\n\n½ × (30 − 20)\n   × (50 − 30)\n= € 100 per week','Geen betaling aan\neen andere partij.',C.orange);
 notes(s,'108–109','Arceer de driehoek met hoekpunten (20,50), (30,40) en (20,30). De basis is 10 sessies per week en de hoogte 20 euro per sessie. M ligt op (20,50), E op (30,40). Tussen Q = 20 en Q = 30 is de betalingsbereidheid groter dan MK. Deze voordelige transacties ontbreken bij monopolie. Het verlies van 100 klopt met 900 − 800.','Welke gemiste sessies leveren samen nog voordeel op?','De hele daling van CS is niet verloren surplus; een deel verschuift naar de producent.','Reset naar de andere markt en de andere periode: reiniging per dag.');
}
{
 const s=slide('58c · De heffingswig in bron B',targetFoot);
 text(s,'Pc = Pp + 20',60,205,1480,70,47,{bold:true,color:C.blue});
 text(s,'60 − Q = Q + 20\n40 = 2Q',60,327,1480,137,46);
 text(s,'Q = 20 diensten per dag',60,514,1480,68,46,{bold:true});
 text(s,'Pc = 60 − 20 = € 40 per dienst\nPp = 20 = € 20 per dienst',60,621,1480,128,41,{bold:true,color:C.green});
 text(s,'Controle: Pc − Pp = 40 − 20 = € 20 per dienst',60,779,1480,55,35);
 notes(s,'108–109','De inverse vraag geeft Pc en het oorspronkelijke aanbod geeft Pp. Vul ze in Pc = Pp + 20 in en los 40 = 2Q op. Controleer: aanbod geeft 20 en vraag geeft 40, dus de wig is 20. Zonder ingrijpen geeft 60 − Q = Q de uitkomst Q = 30 en P = 30. Gebruik die vergelijking bij e.','Op welke lijn lees je de ontvangst van de producent af?','Niet op het aanbod inclusief heffing, want dat geeft de kopersprijs.','Verbind beide prijzen met de grafiek en de overheidsontvangst.');
}
{
 const s=slide('58c · Twee prijzen en de heffingsopbrengst',targetFoot);graph(s,{kind:'B',mark:true});right(s,'Overheid ontvangt','t × Q = 20 × 20\n= € 400 per dag\n\nPc = € 40 per dienst\nPp = € 20 per dienst','Alle 20 verkochte\ndiensten tellen mee.',C.orange);
 notes(s,'108–109','Het aanbod in kopersprijzen is Q + 20. Hier valt het samen met MK maatschappelijk, doordat de heffing en de externe schade per extra dienst beide 20 zijn. Onderscheid de horizontale verschuiving bij dezelfde Pc van 60: het oorspronkelijke aanbod geeft Q = 60, het belaste aanbod Q = 40. De verticale wig bij dezelfde Q van 20 loopt van Pp = 20 tot Pc = 40. De markthoeveelheid daalt van 30 naar 20. De heffingsopbrengst van 400 is een overdracht en is niet automatisch schadevergoeding.','Waarom vermenigvuldig je met20 en niet met de daling10?','Een heffing per product geldt ook voor verkopen die zonder heffing al plaatsvonden.','Neem omwonenden mee in de volledige maatschappelijke rekening.');
}
{
 const s=slide('58d · Maatschappelijk surplus na de heffing',targetFoot);
 table(s,[['Post','Berekening','€ per dag'],['Consumentensurplus','Gegeven','200'],['Producentensurplus','Gegeven','200'],['+ Heffingsopbrengst','20 × 20','400'],['− Externe schade','20 × 20','−400'],['Maatschappelijk surplus','200 + 200 + 400 − 400','400']],60,215,1480,453,[600,580,300],32);
 text(s,'Verandering: 400 − 300 = + € 100 per dag',60,742,1480,78,44,{bold:true,color:C.green});
 notes(s,'108–109','Elke resterende dienst veroorzaakt nog 20 schade, samen 400. De bron geeft CS en PS van elk 200. Tel de overheidsontvangst van 400 op en trek de externe schade van 400 af. De bron sluit uitvoeringskosten en andere effecten uit. Vóór was het surplus 300, na is het 400: een verbetering van 100 per dag. De twee posten van 400 hebben een verschillende betekenis en bewijzen geen schadevergoeding.','Welke schade blijft na het ingrijpen bestaan?','De ontvangst en schade numeriek wegstrepen zonder beide te noemen verbergt de maatschappelijke rekening.','Vergelijk nu waarom de lagere hoeveelheid anders uitwerkt.');
}
{
 const s=slide('58e · Minder transacties, een ander welvaartseffect',targetFoot);
 table(s,[['','A · Studio Solo','B · Reiniging'],['Oorzaak','Marktmacht; geen externe effecten','Niet-vergoede schade aan derden'],['Vergelijking','Qm = 20 tegenover Qe = 30','Q daalt van 30 naar 20'],['Tussen Q = 20 en Q = 30','Betalingsbereidheid > MK','Maatschappelijke MK > betalingsbereidheid'],['Gevolg','Voordelige sessies ontbreken','Nadelige diensten vervallen']],60,228,1480,425,[330,575,575],31);
 text(s,'A: € 100 verlies per week     B: € 100 verbetering per dag',60,725,1480,105,39,{bold:true,color:C.blue});
 notes(s,'108–109','Vergelijk Solo met de efficiënte hoeveelheid. Tussen 20 en 30 overtreft de betalingsbereidheid de marginale kosten. Door afzet te beperken gaat dat voordeel verloren. In B zijn de maatschappelijke marginale kosten Q + 20 tussen 20 en 30 hoger dan de betalingsbereidheid 60 − Q. Als die diensten vervallen, verbetert het maatschappelijke saldo. Controleer bij Q = 25: in A is de betalingsbereidheid 45 en MK 35; in B zijn ze 35 en 45. De twee markten hebben afzonderlijke eenheden en perioden. Tel hun totalen niet bij elkaar op.','Welke kosten bepalen of een extra transactie zinvol is?','De conclusie is nooit dat minder of meer transacties op zichzelf altijd beter is.','Beoordeel of hetzelfde instrument bij de andere oorzaak past.');
}
{
 const s=slide('58f · Past dezelfde heffing bij Studio Solo?',targetFoot);
 text(s,'“Een heffing van € 20 is dus ook vanzelf de beste oplossing voor Studio Solo.”',60,205,1480,139,39);
 text(s,'Die conclusie volgt niet uit de bronnen.',60,412,1480,69,45,{bold:true,color:C.orange});
 text(s,'Bron B: € 20 externe schade per dienst, bij concurrentie.\nBron A: marktmacht, zonder externe schade.',60,534,1480,133,38);
 text(s,'Een beleidsadvies vraagt analyse van het eigen marktprobleem\nen van de reactie op de maatregel.',60,719,1480,107,37,{bold:true,color:C.blue});
 notes(s,'108–109, 99–100','De heffing van 20 past in B bij 20 externe schade per extra dienst onder de gegeven concurrentievoorwaarden. Solo heeft die schade niet. De beperkte afzet komt daar door marktmacht. Dezelfde heffing overnemen is niet onderbouwd. Voor een uitspraak over het beste beleid zijn passende alternatieven en de gedragsreacties nodig. Deze analyse bewijst geen universele vervangende maatregel. Laat leerlingen hun a–f controleren op berekening, eenheid, arcering, oorzaak en begrenzing en één tekort verbeteren.','Welk brongegeven rechtvaardigt in B juist20 euro?','Succes in één markt bewijst geen geschiktheid in een andere.','Noteer het huiswerk en rond het nakijken af.');
}
overview('Afsluiting / huiswerk',7);

await fs.writeFile(path.join(BUILD,'manifest.json'),JSON.stringify({...authored,slides,overviewSlides:overviews,nativeTableSlides:tables,nativeChartSlides:charts,geometry},null,2));
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
const candidate=path.join(BUILD,'candidate.pptx');await (await PresentationFile.exportPptx(p)).save(candidate);
execFileSync(PYTHON,[path.join(TOOLS,'notes-font.py'),candidate]);
const patch=`import sys,zipfile,xml.etree.ElementTree as E,os\np=sys.argv[1]\nns='http://schemas.openxmlformats.org/drawingml/2006/chart'\nE.register_namespace('c',ns)\nwith zipfile.ZipFile(p) as z: files={n:z.read(n) for n in z.namelist()}\nfor n,b in list(files.items()):\n if '/charts/' not in n or not n.endswith('.xml'): continue\n r=E.fromstring(b);a=r.find('.//{'+ns+'}plotArea')\n if a is None: continue\n l=a.find('{'+ns+'}layout')\n if l is not None:a.remove(l)\n l=E.Element('{'+ns+'}layout');a.insert(0,l);m=E.SubElement(l,'{'+ns+'}manualLayout')\n for k,v in [('layoutTarget','inner'),('xMode','edge'),('yMode','edge'),('wMode','factor'),('hMode','factor'),('x','${frac.x}'),('y','${frac.y}'),('w','${frac.w}'),('h','${frac.h}')]:E.SubElement(m,'{'+ns+'}'+k,{'val':v})\n files[n]=E.tostring(r,encoding='utf-8',xml_declaration=True)\nwith zipfile.ZipFile(p+'.tmp','w',zipfile.ZIP_DEFLATED) as z:\n for n,b in files.items():z.writestr(n,b)\nos.replace(p+'.tmp',p)\n`;
await fs.writeFile(path.join(BUILD,'plot-layout.py'),patch);execFileSync(PYTHON,[path.join(BUILD,'plot-layout.py'),candidate]);
execFileSync(PYTHON,[path.join(TOOLS,'straight-scatter.py'),candidate]);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath:path.join(FINAL,'4.2.7 Gemengde opgaven - marktvormen en marktfalen – presentatie.pptx'),pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit',...tables.flatMap(i=>['--require-native-table-slide',String(i)])],fontPolicy:{basis:'design',families:[FONT]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:path.join(BUILD,'validation-final.json')});
console.log(JSON.stringify({slides:slides.length,finalPath:result.finalPath,package:result.packageIntegrity.status,layoutFindings:result.presentationLayout.findingCount,import:result.firstPartyImport.passed,charts:result.nativeChartValidation.passed}));
