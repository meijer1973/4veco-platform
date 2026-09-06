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

if __name__=='__main__':unittest.main()
