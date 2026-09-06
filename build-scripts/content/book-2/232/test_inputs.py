"""Physical actual-input/source fixtures; no fabricated pupil authority.
HOW TO ADAPT: copy actual fixed inputs, reject before native effects, preserve
all cases in the output. Test-only fixture restoration never restores outputs.
"""
from pathlib import Path
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_232 as b

class InputTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source_commit=os.environ.get('B232_SOURCE_COMMIT')
        if not cls.source_commit:raise ValueError('B232_SOURCE_COMMIT must bind the actual committed source payload')
        cls.original=b.ROOT;cls.lessons=b.ROOT.parent/'4veco-lessen'
        cls.manifest=b.gate.verify_current(cls.lessons)
        cls.temp=tempfile.TemporaryDirectory(prefix='book2-232-input-probes-',dir='C:/wt')
        cls.fixture=Path(cls.temp.name);cls.p=cls.fixture/'4veco-platform';cls.l=cls.fixture/'4veco-lessen';cls.originals={}
        for row in cls.manifest['inputs']:
            root=cls.original if row['repository']=='4veco-platform' else cls.lessons
            dest=(cls.p if row['repository']=='4veco-platform' else cls.l)/row['path'];cls.put(dest,b.gate.data_path(root/row['path']).read_bytes())
        for n in list(b.gate.PINS)+b.gate.SOURCE_FILES:cls.put(cls.p/n,b.gate.data_path(cls.original/n).read_bytes())
        # Technical Git fixtures read ORIGINAL immutable objects via alternates.
        # They create no substitute approval or source commit.
        for fixture,actual in [(cls.p,cls.original),(cls.l,cls.lessons)]:
            subprocess.run(['git','init','--quiet',str(fixture)],check=True)
            common=subprocess.run(['git','rev-parse','--path-format=absolute','--git-common-dir'],cwd=actual,capture_output=True,check=True).stdout.decode().strip()
            (fixture/'.git/objects/info/alternates').write_bytes((str(Path(common)/'objects').replace('\\','/')+'\n').encode('utf-8'))
        cls.fixture_source_precheck=b.gate.verify_source(cls.source_commit,cls.p)
        if len(cls.fixture_source_precheck)!=11:raise AssertionError('Original technical source fixture unavailable')
        cls.cases=[]

    @classmethod
    def put(cls,p,raw):
        q=b.gate.data_path(p);q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(raw);cls.originals[p]=raw

    @classmethod
    def tearDownClass(cls):
        for p,raw in cls.originals.items():
            if b.gate.data_path(p).read_bytes()!=raw:raise AssertionError('Fixture bytes not restored '+str(p))
        print(json.dumps({'physical_fixture':str(cls.fixture),'cases':cls.cases,'case_count':len(cls.cases),'native_effects':0,'live_input_mutations':0},ensure_ascii=False))
        resolved=cls.fixture.resolve()
        if resolved.parent!=Path('C:/wt').resolve() or not resolved.name.startswith('book2-232-input-probes-'):raise ValueError('Unsafe fixture cleanup')
        cls.temp.cleanup()

    def reject(self,label,source=False):
        effects=[]
        def effect(*args,**kwargs):effects.append(str(args[:1]));raise AssertionError('Unexpected native effect')
        # Git object reads remain real; Node/native calls and filesystem writes trip.
        with patch.object(b,'ROOT',self.p),patch.object(b.gate,'command',side_effect=effect),patch.object(Path,'mkdir',side_effect=effect),patch.object(Path,'write_text',side_effect=effect),patch.object(Path,'write_bytes',side_effect=effect),patch.object(b,'describe',side_effect=effect):
            for route in ['full','direct']:
                with self.assertRaises((ValueError,FileNotFoundError)) as caught:
                    b.build(self.l,self.source_commit,'r999999',self.p/'unused-reservation.json',route)
                self.assertTrue(str(caught.exception))
                if source and not isinstance(caught.exception,FileNotFoundError):
                    self.assertIn('Whole source differs from caller commit:',str(caught.exception))
        self.assertEqual(effects,[])
        self.cases.append({'label':label,'routes':['full','direct'],'before_native_effects':True})

    def test_all_49_missing_forged_and_synchronized(self):
        candidate=self.p/(b.gate.C+'232-inputs.json');grant=self.p/(b.gate.N+'232-release.json')
        for row in self.manifest['inputs']:
            p=(self.p if row['repository']=='4veco-platform' else self.l)/row['path'];file=b.gate.data_path(p);original=self.originals[p]
            try:
                file.unlink();self.reject('missing '+row['path'])
                changed=original+b'\nFORGED_ACTUAL_INPUT\n';file.write_bytes(changed);self.reject('forged '+row['path'])
                bad=json.loads(json.dumps(self.manifest));r=next(r for r in bad['inputs'] if r['path']==row['path'] and r['repository']==row['repository']);r['raw_sha256']=b.sha(changed)
                raw=(json.dumps(bad,ensure_ascii=False,indent=2)+'\n').encode();b.gate.data_path(candidate).write_bytes(raw)
                release=json.loads(self.originals[grant]);release['candidate']['raw_sha256']=b.sha(raw);b.gate.data_path(grant).write_bytes(json.dumps(release).encode())
                self.reject('synchronized actual/candidate/grant '+row['path'])
            finally:
                file.write_bytes(original);b.gate.data_path(candidate).write_bytes(self.originals[candidate]);b.gate.data_path(grant).write_bytes(self.originals[grant])

    def test_whole_grants_helpers_and_reviews(self):
        for n in b.gate.PINS:
            p=self.p/n;file=b.gate.data_path(p);original=self.originals[p]
            try:
                file.unlink();self.reject('missing whole '+n)
                file.write_bytes(original+b'\nFORGED_WHOLE_SOURCE\n');self.reject('forged whole '+n)
            finally:file.write_bytes(original)

    def test_every_whole_authored_source_and_controller(self):
        for n in b.gate.SOURCE_FILES:
            p=self.p/n;file=b.gate.data_path(p);original=self.originals[p]
            try:
                file.write_bytes(original+b'\nUNRELATED_SOURCE_MUTATION\n');self.reject('whole committed source drift '+n,True)
                file.unlink();self.reject('missing whole committed source '+n,True)
            finally:file.write_bytes(original)

    def test_actual_positive_readonly_and_first_node_boundary(self):
        m=b.gate.verify_current(self.l,self.p);self.assertEqual(len(m['inputs']),49)
        self.assertEqual(len(b.gate.verify_source(self.source_commit,self.p)),11)
        b.gate.verify_committed(m,self.l,self.p)
        calls=[]
        def stop(argv,cwd):calls.append([str(v) for v in argv]);raise RuntimeError('POSITIVE_FIRST_NODE_SENTINEL')
        with patch.object(b,'ROOT',self.p),patch.object(b.gate,'command',side_effect=stop):
            with self.assertRaisesRegex(RuntimeError,'POSITIVE_FIRST_NODE_SENTINEL'):
                b.build(self.l,self.source_commit,'r999999',self.p/'unused.json')
        self.assertEqual(calls,[['node',b.gate.N+'gate.cjs','232']])
        self.cases.append({'label':'positive actual physical inputs and committed source reach exact full root gate first','native_success_claim':False})

class ExecutionRoleTests(unittest.TestCase):
    """Real temporary Git worktrees and claims, never actual foreign actor writes.

    Only the fixed test pair basename is relocated. Actor/task/prefix semantics,
    actual branch, Git registration, claim files and ancestry checks remain real.
    No fixture constitutes pupil authority or successful foreign production.
    """
    def fixture(self,role):
        temp=tempfile.TemporaryDirectory(prefix='book2-232-role-test-',dir='C:/wt')
        self.addCleanup(temp.cleanup);base=Path(temp.name)
        actor,suffix,_,evidence=b.gate.ROLES[role]
        binding=(actor,suffix,base.name,evidence)
        override=patch.dict(b.gate.ROLES,{role:binding});override.start();self.addCleanup(override.stop)
        branch=('codex/' if role=='root' else 'agent/')+base.name
        task='BOOK2-TEXTBOOK-PRODUCTION-1'+('-'+suffix if suffix else '')
        locks=[]
        for repo in ('4veco-platform','4veco-lessen'):
            anchor=base/('anchor-'+repo);root=base/repo
            def git(args,cwd=None):return subprocess.run(['git',*args],cwd=cwd,capture_output=True,check=True).stdout.decode().strip()
            git(['init','--quiet',str(anchor)])
            git(['-c','user.name=Technical Fixture','-c','user.email=fixture@example.invalid','commit','--quiet','--allow-empty','-m','Technical identity fixture'],anchor)
            git(['worktree','add','--quiet','-b',branch,str(root)],anchor)
            gitdir=Path(git(['rev-parse','--path-format=absolute','--git-dir'],root))
            claim={'schema':'4veco-agent-worktree-lock.v1','agent_id':actor,'task_id':task,'status':'active',
                   'branch':branch,'repo':repo,'worktree_path':str(root),'git_dir':str(gitdir),
                   'head_sha':git(['rev-parse','HEAD'],root)}
            path=gitdir/'4veco-agent-worktree-lock.json';path.write_text(json.dumps(claim),encoding='utf-8')
            locks.append((path,claim,root))
        return base/'4veco-platform',locks

    def test_fixed_real_assignment_table(self):
        self.assertEqual(b.gate.ROLES,{
          'author':('paragraph_231_specialist_qc','232-BUILD-CURRENT','book2-232-build-current-20260906','232-BUILD-CURRENT'),
          'correction':('paragraph_231_specialist_qc','232-REPRO-ROUTES','book2-232-repro-routes-20260906','232-REPRO-ROUTES'),
          'paragraph-review':('paragraph_224_builder','232-PARAGRAPH-REVIEW','book2-232-paragraph-review-20260906','232-PARAGRAPH-REVIEW'),
          'specialist-qc':('paragraph_214_builder','232-SPECIALIST-QC','book2-232-specialist-qc-20260906','232-SPECIALIST-QC'),
          'root':('codex-root','','book2-part-a-production-20260905','232-QC-ROOT')})
        with self.assertRaisesRegex(ValueError,'Unknown fixed execution role'):b.gate.execution_identity('any-actor')

    def test_five_real_technical_pairs_and_each_claim_counterexample(self):
        cases=[]
        for role in list(b.gate.ROLES):
            root,locks=self.fixture(role)
            actual=b.gate.execution_identity(role,root);self.assertEqual(actual['role'],role)
            for path,original,worktree in locks:
                raw=path.read_bytes()
                for field,value in [('agent_id','IMPERSONATED'),('task_id','WRONG_TASK'),('status','released'),
                   ('schema','forged'),('repo','other'),('branch','agent/wrong'),('worktree_path',str(root/'other')),
                   ('git_dir',str(root/'.git')),('head_sha','0'*40)]:
                    bad=dict(original);bad[field]=value
                    try:
                        path.write_text(json.dumps(bad),encoding='utf-8')
                        with self.assertRaises((ValueError,subprocess.CalledProcessError)):b.gate.execution_identity(role,root)
                        cases.append([role,original['repo'],field])
                    finally:path.write_bytes(raw)
                try:
                    path.unlink()
                    with self.assertRaises(FileNotFoundError):b.gate.execution_identity(role,root)
                finally:path.write_bytes(raw)
                # Actual branch drift, not merely a forged branch field.
                subprocess.run(['git','symbolic-ref','HEAD','refs/heads/agent/wrong'],cwd=worktree,check=True)
                try:
                    with self.assertRaisesRegex(ValueError,'Wrong actual assigned branch'):b.gate.execution_identity(role,root)
                finally:subprocess.run(['git','symbolic-ref','HEAD','refs/heads/'+actual['branch']],cwd=worktree,check=True)
            with self.assertRaisesRegex(ValueError,'Wrong assigned platform worktree'):b.gate.execution_identity(role,root/'other')
            self.assertEqual(b.gate.execution_identity(role,root),actual)
        print(json.dumps({'technical_claim_counterexamples':cases,'count':len(cases),'five_valid_technical_roles':True,'foreign_live_writes':0,'pupil_authority_claim':False}))

    def test_exact_reservation_identity_and_all_route_prewrite_boundary(self):
        for role in list(b.gate.ROLES):
            root,locks=self.fixture(role);identity=b.gate.execution_identity(role,root)
            folder=root/'reports/sprints';folder.mkdir(parents=True)
            reservation=folder/(identity['prefix']+'reservation-r7.json')
            payload={'actor':identity['actor'],'execution':identity,'status':'RESERVED_UNUSED','revision':'r7',
                     'source_commit':'a'*40,'global_scan':{'maximum':6},'maximum_recorded_revision':6}
            reservation.write_text(json.dumps(payload),encoding='utf-8')
            attempt,native,proof=b.gate.namespace_preflight('r7',reservation,'a'*40,root,role)
            self.assertEqual(attempt.name,identity['prefix']+'attempt-r7.json')
            self.assertEqual(native.name,identity['prefix']+'native-r7.json')
            variants=[]
            for field,value in [('actor','wrong'),('status','CONSUMED'),('source_commit','b'*40),('revision','r8'),('maximum_recorded_revision',7),('global_scan',{})]:
                wrong=json.loads(json.dumps(payload));wrong[field]=value;variants.append(wrong)
            for field in ['role','actor','task','prefix','branch']:
                wrong=json.loads(json.dumps(payload));wrong['execution'][field]='CROSS_ROLE';variants.append(wrong)
            wrong=json.loads(json.dumps(payload));wrong['execution']['claims'][1]['claim_sha256']='0'*64;variants.append(wrong)
            for wrong in variants:
                reservation.write_text(json.dumps(wrong),encoding='utf-8')
                for route in ['full','direct']:
                    # Stub ONLY previously separately tested authority to reach the
                    # real namespace predicate; effects and workers are tripwires.
                    with patch.object(b,'ROOT',root),patch.object(b.gate,'preflight',return_value={}),patch.object(Path,'mkdir',side_effect=AssertionError('native mkdir')),patch.object(Path,'write_text',side_effect=AssertionError('native write')),patch.object(b,'describe',side_effect=AssertionError('worker')):
                        with self.assertRaises(ValueError):b.build(root.parent/'4veco-lessen','a'*40,'r7',reservation,route,role)
                self.assertFalse(attempt.exists());self.assertFalse(native.exists());self.assertFalse(proof.exists())
            reservation.write_text(json.dumps(payload),encoding='utf-8')
            with self.assertRaises(ValueError):b.gate.namespace_preflight('r7',folder/'cross-role.json','a'*40,root,role)
            attempt.write_text('{}')
            with self.assertRaisesRegex(ValueError,'Consumed namespace'):b.gate.namespace_preflight('r7',reservation,'a'*40,root,role)
            attempt.unlink();occupied=proof/'232-opgaven-aaaaaaaaaaaa-r7';occupied.mkdir(parents=True)
            with self.assertRaisesRegex(ValueError,'Occupied proof revision'):b.gate.namespace_preflight('r7',reservation,'a'*40,root,role)

    def test_unchanged_pupil_functions_and_original_tests(self):
        import ast
        baseline='e0b47cab498102cd990e66318f5111602c32a6b6'
        paths=['build-scripts/content/book-2/b2_232.py','build-scripts/content/book-2/232/test_inputs.py']
        originals=b.gate.git_blobs(b.ROOT,[baseline+':'+p for p in paths])
        old=ast.parse(originals[0]);new=ast.parse((b.ROOT/paths[0]).read_bytes())
        functions=lambda tree:{n.name:ast.dump(n) for n in tree.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef))}
        before=functions(old);after=functions(new)
        for name in before:
            if name not in ('build','main'):self.assertEqual(before[name],after[name],name)
        oldtests=originals[1].decode('utf-8').split("if __name__=='__main__':unittest.main()")[0]
        current=(b.ROOT/paths[1]).read_text(encoding='utf-8')
        self.assertEqual(current[:len(oldtests)],oldtests,'All original input test bytes retained')
        untouched=['theory.md','exercises.md','answers.md','target-answers.md','assets.js','test_source.py']
        raw=b.gate.git_blobs(b.ROOT,[baseline+':build-scripts/content/book-2/232/'+p for p in untouched])
        for name,expected in zip(untouched,raw):self.assertEqual((b.CONTENT/name).read_bytes(),expected,name)

if __name__=='__main__':unittest.main()
