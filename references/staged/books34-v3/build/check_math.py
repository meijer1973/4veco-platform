"""Recompute the new/reconnected numeric cases. No empirical-outcome claim."""
from fractions import Fraction as F
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
rows=[]
def test(name,actual,expected):
 ok=abs(float(actual)-float(expected))<1e-9
 rows.append({'check':name,'actual':float(actual),'expected':float(expected),'pass':ok})
 if not ok:raise AssertionError(name)
def costs(a,b,f,q):return a*q*q+b*q+f
def firm(name,a,b,f,p,capacity,expected_q,expected_profit):
 cand=(p-b)/(2*a);q=max(F(0),min(capacity,cand));w=p*q-costs(a,b,f,q)
 test(name+' feasible output',q,expected_q);test(name+' profit',w,expected_profit)
 test(name+' profit not less than shutdown',min(w+f,0),0)
 test(name+' output within capacity',max(q-capacity,0),0)
 test(name+' profit rectangle',(p-costs(a,b,f,q)/q)*q,w)
 # Concave profit function: constrained maximum also dominates a dense feasible grid.
 test(name+' grid dominance',max(max(p*(capacity*i/100)-costs(a,b,f,capacity*i/100) -w,0) for i in range(101)),0)

a,b,c=F('0.04'),F(4),F(400)
test('3.2.2/17 MK(100)',2*a*100+b,12)
test('3.2.2/17 TK(100)',costs(a,b,c,100),1200)
test('3.2.2/17 TK(150)',costs(a,b,c,150),1900)
test('3.2.2/17 interval',(costs(a,b,c,150)-costs(a,b,c,100))/50,14)
test('3.2.2/17 fixed-cost change TK(100)',costs(a,b,c+100,100),1300)
test('3.2.2/17 unchanged MK',2*a*100+b,12)
test('3.2.2 worked example interval',(costs(F('.1'),2,40,30)-costs(F('.1'),2,40,20))/10,7)
test('3.2.2/14 change in TK at20',costs(F('.1'),3,70,20)-costs(F('.1'),2,40,20),50)
test('3.2.2/15 MK at10',2*F('.2')*10+4,8)
test('3.2.2/15 interval10to20',(costs(F('.2'),4,90,20)-costs(F('.2'),4,90,10))/10,10)
firm('3.2.3/27',F('.04'),4,400,16,F(200),150,500)
firm('3.2.3/27 lower capacity',F('.04'),4,400,16,F(120),120,464)
firm('3.2.4/34 before',F('.1'),2,40,8,F(50),30,50)
firm('3.2.4/34 after',F('.1'),2,40,10,F(50),40,120)
p0=F(40000,5000);p1=F(60000,5000)
test('3.2.4/35 original P',p0,8);test('3.2.4/35 original Q',2500*p0-10000,10000)
test('3.2.4/35 new P',p1,12);test('3.2.4/35 new Q',2500*p1-10000,20000)
firm('3.2.4/35 original firm',F('.02'),4,200,p0,F(250),100,0)
firm('3.2.4/35 new firm',F('.02'),4,200,p1,F(250),200,600)
test('3.2.4/35 GTK',costs(F('.02'),4,200,200)/200,9)
test('3.3.4/38b q',(8-F(2))/F('.1'),60)
firm('4.1.1/7 initial',F('.02'),4,200,10,F(250),150,250)
firm('4.1.1/7 long-run',F('.02'),4,200,8,F(250),100,0)
test('4.1.3/28 MO20',30-F(20),10)
test('4.1.3/28 average extra revenue',F(450-400,10),5)
test('4.1.3/28 extra minus lost',10*15-20*(20-15),50)
# Monopoly p=A-Bq, TK=aq^2+bq+c.
for name,A,B,a,b,c,cap,expectedq,expectedp,expectedw in [
 ('4.1.4/38',40,F('.25'),F('.125'),10,200,80,40,30,400),
 ('4.1.5/45',32,F('.2'),F('.1'),8,120,60,40,24,360)]:
 q=(A-b)/(2*(B+a));p=A-B*q;w=p*q-costs(a,b,c,q)
 test(name+' q',q,expectedq);test(name+' P',p,expectedp);test(name+' W',w,expectedw)
 test(name+' feasibility',max(q-cap,0),0)
 test(name+' shutdown dominance',min(w+c,0),0)
 test(name+' MO=MK',A-2*B*q-(2*a*q+b),0)
firm('4.1.5/45 competitive contrast',F('.1'),8,120,18,F(60),50,130)
# Revised labour consolidation retains these numeric sources.
test('4.3.5/40 labour force',12600+1400,14000)
test('4.3.5/40 participation',F(14000,20000)*100,70)
test('4.3.5/40 unemployment',F(1400,14000)*100,10)
test('4.3.5/40 original wage',F(240+40,20),14)
test('4.3.5/40 new wage',F(280+40,20),16)
test('4.3.5/40 original employment',240-10*14,100)
test('4.3.5/40 new employment',280-10*16,120)
test('4.3.5/40 old unit labour costs',F(24,8),3)
test('4.3.5/40 new unit labour costs',F('25.2')/F('8.8'),F(63,22))
test('4.3.5/40 percentage change',(F(63,22)/3-1)*100,-F(50,11))
test('4.3.5/39 equilibrium wage',F(192,12),16)
test('4.3.5/39 jobs at18',180-6*18,72)
test('4.3.5/39 wage bill',72*20*18,25920)
test('4.3.5/39 excess supply',(-12+6*18)-(180-6*18),24)
result={'scope':'New and reconnected numerical cases; not a complete independent re-audit of all retained exercises.','checks':len(rows),'failures':0,'results':rows}
(ROOT/'checks/math-checks.json').write_text(json.dumps(result,indent=2), encoding='utf-8', newline='\n');print('Math:',len(rows),'passed')
