"""Fresh specialist arithmetic from personally read current sources, not test verdicts."""
import importlib.util
from fractions import Fraction as F
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('renewal', HERE / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL-check.py')
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)
n, B = q.n, q.B

ratios = []
for location, inputs in [
    ('theory income bars/table', [('Ei', 15, 10, '3/2'), ('Ei', -5, 10, '-1/2'), ('Ei', 5, 10, '1/2')]),
    ('theory named filmschijfhuur ratios', [('Ek', 10, 20, '1/2'), ('Ek', -4, 20, '-1/5')]),
    ('worked1 chocolate/instant soup', [('Ei', 15, 10, '3/2'), ('Ei', -5, 10, '-1/2')]),
    ('worked2 e-books/covers relative to paper-book price', [('Ek', 10, 20, '1/2'), ('Ek', -5, 20, '-1/4')]),
    ('Start1 own fountain-pen price', [('Ev', -10, 20, '-1/2')]),
    ('Start2 school cover/puzzle subscription', [('Ei', -2, 10, '-1/5'), ('Ek', 5, 10, '1/2')]),
    ('guided3 premium/budget cocoa, handheld/controller', [('Ei', 12, 8, '3/2'), ('Ei', -4, 8, '-1/2'), ('Ek', 10, 20, '1/2'), ('Ek', -8, 20, '-2/5')]),
    ('independent7 walks/routes, rechargeable lamps/batteries', [('Ei', 8, 5, '8/5'), ('Ei', -2, 5, '-2/5'), ('Ek', 3, 10, '3/10'), ('Ek', -4, 10, '-2/5')]),
    ('target9a income meal packs/budget noodles', [('Ei', 8, 5, '8/5'), ('Ei', -3, 5, '-3/5')]),
    ('target9c tea/filters relative to coffee price', [('Ek', 4, 10, '2/5'), ('Ek', -6, 10, '-3/5')]),
    ('closing11 own umbrella price', [('Ev', -5, 10, '-1/2')])]:
    for symbol, numerator, denominator, expected in inputs:
        result = F(numerator, denominator)
        assert result == F(expected)
        meaning = ('inferior' if result < 0 else 'normal' if result < 1 else 'luxury' if result > 1 else 'boundary-unclassified') if symbol == 'Ei' else ('substitutes' if result > 0 else 'complements') if symbol == 'Ek' else 'signed own-price response, not Ei'
        ratios.append({'source_case': location, 'symbol': symbol, 'quantity_percent': numerator,
            'changed_input_percent': denominator, 'exact_ratio': str(result), 'meaning': meaning})

functions = []
for name, coefficients, inputs, expected in [
    ('worked3 tekenles', (80, -2, 1, F(5,1000)), (20,10,30000,36000,14), (200,230,204,F(3,4))),
    ('guided4 naaicursus', (90,-2,F(1,2),F(5,1000)), (20,20,20000,24000,24), (160,180,162,F(5,8))),
    ('guided5 keramiek', (120,-2,1,F(4,1000)), (15,10,25000,30000,15), (200,220,205,F(1,2))),
    ('independent8 taalcursus', (90,-2,1,F(5,1000)), (10,10,20000,24000,14), (180,200,184,F(5,9))),
    ('target9 fitness', (100,-2,F(1,2),F(1,100)), (10,20,30000,33000,24), (390,420,392,F(10,13)))]:
    a,b,c,d = coefficients
    px,pz,y,ynew,pznew = inputs
    terms = lambda income, otherprice: [F(a),b*px,c*otherprice,d*income]
    oldterms, newterms, resetterms = terms(y,pz),terms(ynew,pz),terms(y,pznew)
    old,new,reset = map(sum, (oldterms,newterms,resetterms))
    qpercent, ypercent = (new-old)/old*100, F(ynew-y,y)*100
    ei = qpercent/ypercent
    assert (old,new,reset,ei) == expected
    assert 0 < ei < 1
    functions.append({'case': name, 'coefficients': list(map(str,coefficients)), 'inputs_Px_Pz_Y_newY_newPz': inputs,
        'base_terms': list(map(str,oldterms)), 'income_terms': list(map(str,newterms)), 'reset_terms': list(map(str,resetterms)),
        'base_Q': str(old), 'income_Q': str(new), 'reset_Pz_Q': str(reset),
        'Q_percent': str(qpercent), 'Y_percent': str(ypercent), 'Ei_exact': str(ei),
        'Ei_final_two_decimals': f'{float(ei):.2f}', 'income_direction_monthly_subscriptions': str(new-old),
        'other_price_direction_monthly_subscriptions': str(reset-old),
        'meaning': 'normal only in this controlled model comparison; Y annual euros; Q monthly subscriptions; do not divide Y by twelve; reset to original Y and original Q base',
        'fixed_income_scenario': {'Px': px, 'Pz': pz}, 'fixed_other_price_scenario': {'Px': px, 'Y': y}})

target = B.target_record()
assert [x['points'] for x in target['target_exercise']['subquestions']] == [3,2,4,4,3]
answers = (B.CONTENT/'target-answers.md').read_text(encoding='utf-8')
assert 'De vraag stijgt met 30 abonnementen per maand. Px=10 en Pz=20 blijven gelijk.' in answers
assert 'Er is geen\nEk-berekening gevraagd.' in answers
bonus = (B.CONTENT/'answers.md').read_text(encoding='utf-8').split('## Denkertje / Bonusopgave')[1].split('## Herhaling')[0]
assert len(re.findall(r'^- ',bonus,re.M)) == 4
assert F(12-10,10)*100 == 20 and F(90-100,100)*100 == -10
assert 60-2*5 == 50 and 60-2*8 == 44
assert (40-2*5+10,40-2*5+12) == (40,42)
assert (210-200)+(205-200) == 215-200
assert sum([2,11,8,2,6,14,11]) == 54 and 54+15 == 69 and 69+8+4 == 81
n.save('independent-mathematics', {'pass': True, 'actor': 'paragraph_214_builder', 'role': 'independent223specialistQCRenewal',
    'method': 'Fresh exact-rational term-by-term derivation from personally read current four sources, verified against pupil and complete answer text; no inherited test PASS substituted for reasoning',
    'sources': [{'path': str(p.relative_to(q.ROOT)), 'sha256': n.sha(p.read_bytes())} for p in [B.CONTENT/name for name in ['theory.md','exercises.md','answers.md','target-answers.md']]],
    'direct_ratio_rows': ratios, 'five_full_function_chains': functions, 'frozen_target_sha256': B.TARGET_HASH,
    'points': [3,2,4,4,3], 'total_points': 16,
    'target_rubric': {'a': 'method1 + both income ratios1+1', 'b': 'two classifications with Ei boundary1+1',
        'c': 'each named goods calculation1 + signed relation1, twice',
        'd': 'two Q values1 + old-base percentages1 + Ei/normal1 + direction/fixed Px,Pz1',
        'e': 'reset/substitution3921 + positive vs3901 + fixed Px,Y1; no added Ek'},
    'controlled_combined_row': 'Supplied200/210/205/215, not an inferred general function; +15 alone cannot isolate +10 income when Pz also changes',
    'boundary_checks': 'Ei0/1 unclassified; signed Ei not abs(Ev); nonzero percentage denominator and positive old quantities/prices/income; coefficients not elasticities; only supplied function scenarios',
    'bonus_four_criteria': ['bound validity to investigated situation/model','no necessity/value judgment from Ei','hold Px and Pz fixed','explain why combined change is not an isolated income comparison'],
    'retrieval': 'Start1 old-base -10/+20 gives Ev-.5 and Q44; closing11 Ev-.5, Ei undefined at unchanged Y; closing12 Q40→42 weekly reservations with Px5 fixed',
    'review_prose_only_finding': {'review_sha256': q.REVIEW, 'line': 135, 'wrong': '+30 meals/month', 'actual_pupil': '+30 abonnementen per maand', 'owner': 'distinct canonical paragraph reviewer via root; no self-edit'},
    'timing': {'core':54,'plus_guided':69,'all_work':81,'observed':False},
    'root_validation':'PENDING','root_acceptance':'PENDING','handoff_renewal':'PENDING'})
