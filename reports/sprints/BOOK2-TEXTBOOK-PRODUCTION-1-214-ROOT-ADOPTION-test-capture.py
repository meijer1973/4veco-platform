"""Run exact committed source tests with complete streamed lossless evidence.

HOW TO ADAPT: two independent pipe-draining threads avoid truncation/deadlock;
each raw stream is hashed while captured directly to a fresh gzip. No raw
hundreds-of-megabytes duplicate, output substitution or native builder call.
"""
import argparse
import datetime
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import threading
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
PRE='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-ROOT-ADOPTION-'
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--attempt',required=True);args=parser.parse_args()
assert re.fullmatch('[a-z0-9-]+',args.attempt)
destination=P/(PRE+'source-tests-'+args.attempt+'.json')
assert not destination.exists()
sha=lambda b:hashlib.sha256(b).hexdigest()
git=lambda root,*args:subprocess.check_output(['git',*args],cwd=root)
source=P/'build-scripts/content/book-2/214/test_source.py'
assert source.read_bytes()==git(P,'show','a62bc517c5c13b4f93bf836ad5bd37b9843e7c55:build-scripts/content/book-2/214/test_source.py')
assert sha(source.read_bytes())=='d9d15811a6b03bd4b755b8706e0d96b689153c440ff61df61b5573cfc3a46f79'
env=dict(os.environ);env.update(PYTHONIOENCODING='utf-8',PYTHONDONTWRITEBYTECODE='1',FOURVECO_PLATFORM_ROOT=str(P),FOURVECO_PLATFORM_SOURCE_REF=git(P,'rev-parse','HEAD').decode().strip(),FOURVECO_PLATFORM_SOURCE_BRANCH='codex/book2-part-a-production-20260905',FOURVECO_LESSEN_ROOT=str(L),FOURVECO_LESSEN_SOURCE_REF=git(L,'rev-parse','HEAD').decode().strip(),FOURVECO_LESSEN_SOURCE_BRANCH='codex/book2-part-a-production-20260905')
paths={name:P/(PRE+'source-tests-'+args.attempt+'-'+name+'.txt.gz') for name in ['stdout','stderr']}
assert all(not f.exists() for f in paths.values())
start=datetime.datetime.now(datetime.timezone.utc).isoformat()
argv=[sys.executable,'-B',str(source)]
process=subprocess.Popen(argv,cwd=P,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
records={};errors=[]
def drain(name,pipe):
    try:
        digest=hashlib.sha256();length=0;tail=b''
        with paths[name].open('xb') as stream:
            with gzip.GzipFile(filename='',mode='wb',fileobj=stream,mtime=0,compresslevel=6) as packed:
                while chunk:=pipe.read(1024*1024):
                    packed.write(chunk);digest.update(chunk);length+=len(chunk);tail=(tail+chunk)[-8192:]
        checked=hashlib.sha256();decoded_length=0
        with gzip.open(paths[name],'rb') as stream:
            while chunk:=stream.read(1024*1024):checked.update(chunk);decoded_length+=len(chunk)
        assert checked.digest()==digest.digest() and decoded_length==length
        records[name]={'path':str(paths[name].relative_to(P)),'gzip_bytes':paths[name].stat().st_size,'gzip_sha256':sha(paths[name].read_bytes()),'raw_bytes':length,'raw_sha256':digest.hexdigest(),'lossless_roundtrip':True,'tail_utf8':tail.decode('utf-8',errors='replace')}
    except BaseException as exc:errors.append(repr(exc));process.kill()
threads=[threading.Thread(target=drain,args=(n,getattr(process,n))) for n in paths]
for thread in threads:thread.start()
exit_code=process.wait()
for thread in threads:thread.join()
result={'argv':argv,'cwd':str(P),'source_commit':'a62bc517c5c13b4f93bf836ad5bd37b9843e7c55','source_sha256':sha(source.read_bytes()),'root_controller_commit':env['FOURVECO_PLATFORM_SOURCE_REF'],'paired':{k:v for k,v in env.items() if k.startswith('FOURVECO_')},'PATH_unchanged':True,'PATH_sha256':sha(env['PATH'].encode()),'start':start,'finish':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exit_code':exit_code,'streams':records,'capture_errors':errors,'tests':13 if not errors and re.search(r'Ran 13 tests in [0-9.]+s',records['stderr']['tail_utf8']) else None,'root_native_rebuilds':0,'temporary_fixtures':'Exact reviewed test TemporaryDirectory cleanup, not foreign existing paths','independent_review':'NOT_CLAIMED'}
with destination.open('x',encoding='utf-8',newline='\n') as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write('\n')
assert not errors,errors
assert exit_code==0 and result['tests']==13 and records['stderr']['tail_utf8'].rstrip().endswith('OK')
assert source.read_bytes()==git(P,'show','HEAD:build-scripts/content/book-2/214/test_source.py')
print(json.dumps({'status':'PASS','tests':13,'exit_code':exit_code,'complete_lossless_streams':{k:{'raw_bytes':v['raw_bytes'],'gzip_bytes':v['gzip_bytes'],'raw_sha256':v['raw_sha256']} for k,v in records.items()},'root_native_rebuilds':0,'independent_review':'NOT_CLAIMED'}))
