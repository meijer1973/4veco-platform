"""Regression tests for R1–R5. Fixtures are not a copy of the live registry."""
from pathlib import Path
import copy, json, re, sys, tempfile, unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'build'))
import records
from prepare_registry_update import prepare, relative_root, REVISION, PREVIOUS_REVISION, BLUEPRINT, COUNTS
from preview_targets import preview_record
ROOT=Path(__file__).resolve().parents[1]


def module():
    return json.loads((ROOT/'curriculum/course-target-exercises-books34-v3.json').read_text(encoding='utf-8'))


def registry_fixture():
    # All 24 preserved records contain nested fields/non-ASCII text to expose
    # accidental normalization/rewriting; no claim of live-registry approval.
    keep=[{'id':f'{b}.{c}.{p}','module':b,'chapter':c,'paragraph':p,
           'context':'€ 20 — café; prijs ≠ winst', 'evidence':{'unchanged':[True, None, 'α']},
           'record_status':'reviewed_final' if b==1 else 'candidate_review_ready'}
          for b in (1,2) for c in (1,2,3) for p in (1,2,3,4)]
    old=[]
    for c,n in {'3.1':6,'3.2':4,'3.3':4,'4.1':4,'4.2':7,'4.3':6}.items():
        old.extend({'id':f'{c}.{p}','module':int(c[0]),'record_status':'placeholder_needs_review'} for p in range(1,n+1))
    return {'schema_version':1,'blueprint_version':'v5','blueprint_source':BLUEPRINT,
            'structure_revision':PREVIOUS_REVISION,'exercises':keep+old,
            'expected_count_bearing_paragraphs':dict(COUNTS),'total_count_bearing_paragraphs':55,
            'test_preparation_policy':{'status':'web_only','count_bearing':False},
            'previous_structural_registry':{'revision':'historical-pre-v2','path':'archive/old.json'},
            '_schema_doc':{'record_status':'old description'}}


class ContextTests(unittest.TestCase):
    def test_context_inside_exercise_survives(self):
        src='<div class="exercise target"><p><b>Opgave 17</b></p><p>TK = 0,04q² + 4q + 400; capaciteit 200 kg per week.</p><p data-question="17a"><b>a.</b>Bereken MK.</p></div>'
        text,h=records.extract_context(src,ROOT)
        self.assertIn('0,04q² + 4q + 400',text)
        self.assertIn('200 kg per week',text)
        self.assertNotIn('Bereken MK.',text)
        self.assertIn('exercise',h)

    def test_unattributed_subquestion_removed(self):
        text,h=records.extract_context('<div class="exercise"><p>Bron: € 18.</p><p><b>b.</b>Een vraag.</p></div>',ROOT)
        self.assertIn('€ 18',text);self.assertNotIn('Een vraag.',text)

    def test_table_cells_and_formula_preserved(self):
        src='<div class="exercise"><p>Eenheden: uren per week.</p><table><tr><th>A</th><th>B</th></tr><tr><td>500</td><td>1.500</td></tr></table><div class="formula">Lᵥ = 240 − 10w</div><p><b>a.</b>Reken uit.</p></div>'
        text,h=records.extract_context(src,ROOT)
        self.assertIn('500 | 1.500',text);self.assertIn('<table>',h)
        self.assertIn('Lᵥ = 240 − 10w',text)

    def test_nested_original_paragraph_keeps_table_not_questions(self):
        src='<div class="exercise"><p>Context € 24.<table><tr><td>600 uur</td><td>3.300 frames</td></tr></table><p><b>a.</b>Reken de vraag uit.</p></div>'
        text,h=records.extract_context(src,ROOT)
        self.assertIn('600 uur',text);self.assertIn('3.300 frames',text)
        self.assertNotIn('Reken de vraag uit.',text);self.assertIn('<table>',h)

    def test_external_source_survives(self):
        text,h=records.extract_context('<div class="source">Bron A: Q = 90.</div><div class="exercise"><p><b>a.</b>Vind P.</p></div>',ROOT)
        self.assertIn('Q = 90',text);self.assertNotIn('Vind P',text)

    def test_actual_derivative_dataset(self):
        r=next(x for x in module()['records'] if x['id']=='3.2.2')
        for phrase in ['0,04q² + 4q + 400','200 kg','euro per week','q = 0']:
            self.assertIn(phrase,r['target_exercise']['context'])

    def test_actual_population_dataset(self):
        r=next(x for x in module()['records'] if x['id']=='4.3.2')
        for phrase in ['5.000','3.000','500','1.500','Lᵥ = 240 − 10w','Lₐ = −40 + 10w','20 uur per week']:
            self.assertIn(phrase,r['target_exercise']['context'])

    def test_consumer_all31_without_manuscript_fallback(self):
        for r in module()['records']:
            with self.subTest(id=r['id']):
                body,figs=preview_record(r)
                self.assertIn(r['target_exercise']['subquestions'][0]['source_question_id'],body)
                self.assertEqual(set(figs),{x['path'] for x in r['target_exercise']['figures']})

    def test_consumer_rejects_lost_figure(self):
        r=copy.deepcopy(next(x for x in module()['records'] if x['target_exercise']['figures']))
        r['target_exercise']['context_html']=re.sub(r'<img[^>]*>','',r['target_exercise']['context_html'])
        with self.assertRaises(ValueError):preview_record(r)

    def test_consumer_rejects_bad_asset_hash(self):
        r=copy.deepcopy(next(x for x in module()['records'] if x['target_exercise']['figures']))
        r['target_exercise']['figures'][0]['sha256']='0'*64
        with self.assertRaises(ValueError):preview_record(r)


class RegistryTests(unittest.TestCase):
    def test_preserves_all24_and_does_not_mutate_input(self):
        old=registry_fixture();before=copy.deepcopy(old);m=module();mbefore=copy.deepcopy(m)
        new=prepare(old,m,'edities/books34-v3')
        self.assertEqual(old,before);self.assertEqual(m,mbefore)
        self.assertEqual(new['exercises'][:24],old['exercises'][:24])
        self.assertEqual(new['previous_structural_registry'],old['previous_structural_registry'])

    def test_top_and_record_revisions_agree(self):
        new=prepare(registry_fixture(),module(),'edities/books34-v3')
        self.assertEqual(new['structure_revision'],REVISION)
        self.assertTrue(all(x['structure_revision']==REVISION for x in new['exercises'][24:]))

    def test_canonical_refs_and_concrete_asset_root(self):
        new=prepare(registry_fixture(),module(),'edities/books34-v3')
        for r in new['exercises'][24:]:
            self.assertEqual(r['source_ref'],f'{BLUEPRINT} §{r["id"]}')
            self.assertEqual(r['source_locator']['student_manuscript'],'edities/books34-v3/'+r['source_pin']['student_file'])
            self.assertEqual(r['target_payload_sha256'],next(x for x in module()['records'] if x['id']==r['id'])['target_payload_sha256'])

    def test_counts_and_collision_titles(self):
        new=prepare(registry_fixture(),module(),'edities/books34-v3')
        self.assertEqual(len(new['exercises']),55)
        byid={r['id']:r for r in new['exercises']}
        self.assertIn('Winstmaximalisatie',byid['3.2.3']['paragraph_title'])
        self.assertIn('Gemengde',byid['4.3.5']['paragraph_title'])
        self.assertNotIn('4.3.6',byid)

    def test_rejects_unknown_revision(self):
        old=registry_fixture();old['structure_revision']='future-unknown'
        with self.assertRaises(ValueError):prepare(old,module(),'edities/books34-v3')

    def test_rejects_lost_preserved_record(self):
        old=registry_fixture();old['exercises'].pop(3)
        with self.assertRaises(ValueError):prepare(old,module(),'edities/books34-v3')

    def test_rejects_duplicate_candidate(self):
        m=module();m['records'][-1]=copy.deepcopy(m['records'][0])
        with self.assertRaises(ValueError):prepare(registry_fixture(),m,'edities/books34-v3')

    def test_rejects_blank_placeholder(self):
        m=module();m['records'][0]['target_exercise']['placeholder']=True
        with self.assertRaises(ValueError):prepare(registry_fixture(),m,'edities/books34-v3')

    def test_rejects_unjustified_final_status(self):
        m=module();m['records'][0]['record_status']='reviewed_final'
        with self.assertRaises(ValueError):prepare(registry_fixture(),m,'edities/books34-v3')

    def test_rejects_noncanonical_source_ref(self):
        m=module();m['records'][0]['source_ref']='books/book-3/foo.md'
        with self.assertRaises(ValueError):prepare(registry_fixture(),m,'edities/books34-v3')

    def test_rejects_unsafe_path_roots(self):
        for value in ['../escape','/absolute','C:/Windows','C:\\Temp','x/../../escape','']:
            with self.subTest(root=value),self.assertRaises(ValueError):relative_root(value)

    def test_same_revision_not_approval_promotion(self):
        first=prepare(registry_fixture(),module(),'edities/books34-v3')
        second=prepare(first,module(),'edities/books34-v3')
        self.assertEqual(second['exercises'],first['exercises'])
        self.assertFalse(second['book34_package_migration']['approval_conferred'])


class FigureTests(unittest.TestCase):
    def test_five_titles_match_current_target(self):
        rows=json.loads((ROOT/'checks/figure-label-contract.json').read_text(encoding='utf-8'))
        byid={r['id']:r for r in module()['records']}
        for row in rows:
            svg=(ROOT/row['svg']).read_text(encoding='utf-8')
            labels=re.findall(r'Doeloefening (\d+) ·',svg)
            self.assertEqual(labels,[byid[row['paragraph_id']]['target_exercise']['exercise_number']]*2)

    def test_old_numbers_fail_same_rule(self):
        rows=json.loads((ROOT/'checks/figure-label-contract.json').read_text(encoding='utf-8'))
        for row in rows:
            svg=(ROOT/row['svg']).read_text(encoding='utf-8')
            corrupted=svg.replace(f'Doeloefening {row["expected_number"]} ·',f'Doeloefening {row["old_number"]} ·')
            self.assertNotEqual(re.findall(r'Doeloefening (\d+) ·',corrupted),[str(row['expected_number'])]*2)

if __name__=='__main__':unittest.main()
