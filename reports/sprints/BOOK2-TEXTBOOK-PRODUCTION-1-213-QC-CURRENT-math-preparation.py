"""Read-only independent mathematics before S1 review import; NOT native QC.

No generator/test module import and no renderer/subprocess/native sideeffect.
Only literal case data are parsed from the source AST, then independently
recomputed. Actual23 methods/native checks remain behind root's sequence gate.
"""
import ast
from fractions import Fraction as F
import hashlib
import json
from pathlib import Path

P=Path(__file__).resolve().parents[2]
source=(P/'build-scripts/content/book-2/b2_213.py').read_bytes()
tree=ast.parse(source.decode('utf-8'))
cases=ast.literal_eval(next(n.value for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='CASES' for t in n.targets)))
expected={
 'holders':([-20,30,60],[3,5],[8,8]),
 'lus':([-12,-4,4,12],[2,2,2],[6,6,6]),
 'bout':([-8,12,24,28],[2,6,10],[12,12,12]),
 'bottles':([-8,0,4],[2,4],[6,6]),
 'patches':([-9,0,9],[2,2],[5,5]),
 'coasters':([-10,2,10],[2,6],[8,8]),
 'draad':([-20,-4,12,28],[1,1,1],[5,5,5]),
 'kaft':([-12,68,116,132],[4,12,20],[24,24,24]),
 'linea':([-200,-150,-100,-50],[3,3,3],[8,8,8]),
 'curva':([-100,25,100,125],[5,15,25],[30,30,30])}
rows=[]
for name,(q,tk,to) in cases.items():
    profit=[revenue-cost for cost,revenue in zip(tk,to)]
    cost,revenue,growth=[],[],[]
    for i in range(1,len(q)):
        dq=q[i]-q[i-1]
        assert dq>0
        k,o,w=F(tk[i]-tk[i-1],dq),F(to[i]-to[i-1],dq),F(profit[i]-profit[i-1],dq)
        assert w==o-k
        cost.append(k);revenue.append(o);growth.append(w)
    assert (profit,cost,revenue)==expected[name],name
    rows.append(dict(case=name,q=q,total_cost=tk,total_revenue=to,profit=profit,MK=list(map(str,cost)),MO=list(map(str,revenue)),profit_change_per_extra_product=list(map(str,growth))))

organizers=[]
for name,tk,to in [('base',[14,22],[12,36]),('A',[24,32],[12,36]),('B',[14,22],[14,42]),('both',[24,32],[14,42])]:
    k,o=F(tk[1]-tk[0],4),F(to[1]-to[0],4)
    assert k==2 and o==(7 if name in ['B','both'] else 6)
    organizers.append(dict(case=name,MK=str(k),MO=str(o),endpoint_profit=to[1]-tk[1]))
assert organizers[-1]['endpoint_profit']==10
assert (18+2*4,5*4,F(26,4),20-26)==(26,20,F('6.5'),-6)
bonus_k=[F(32-20,4),F(56-32,8)];bonus_l=[F(40-20,4),F(56-40,8)]
assert bonus_k==[3,3] and bonus_l==[5,2]
# Two compatible data completions demonstrate actual underdetermination.
fifth=[33-32,39-32];assert fifth==[1,7] and 32<33<56 and 32<39<56
closing=[]
for q in [3,6]:
    tk,to=15+2*q,7*q
    closing.append([q,tk,to,to-tk,str(F(tk,q))])
assert closing==[[3,21,21,0,'7'],[6,27,42,15,'9/2']]
methods={}
for name in ['test_source.py','test_bonus_contract.py','test_succession.py']:
    module=ast.parse((P/'build-scripts/content/book-2/213'/name).read_text('utf-8'))
    methods[name]=[n.name for c in module.body if isinstance(c,ast.ClassDef) for n in c.body if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')]
assert [len(v) for v in methods.values()]==[13,4,6]
print(json.dumps(dict(status='READ_ONLY_MATHEMATICAL_PREPARATION',generator_raw_sha256=hashlib.sha256(source).hexdigest(),
    cases=rows,organizers=organizers,bonus={'K':list(map(str,bonus_k)),'L':list(map(str,bonus_l)),'compatible_fifth_costs':fifth},closing=closing,
    static_method_inventory=methods,methods_counted_but_not_executed=23,
    sequence_gate='WAITING_FOR_DISTINCT_S1_PASS_AND_ROOT_EXACT_BINDINGS',generator_imported=False,native_QC_executed=False,
    no_paragraph_or_specialist_verdict=True),ensure_ascii=False,indent=2))
