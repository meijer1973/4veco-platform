"""Read-only technical child protocol diagnosis, no pupil/native effects."""
import json,os,subprocess,sys
name='2.3.2 Producentensurplus en totaal surplus – paragraaf.html'
code='import json,os,sys;print(json.dumps({"filename":'+repr(name)+',"PATH":os.environ.get("PATH"),"encoding":sys.stdout.encoding},ensure_ascii=False))'
records=[]
for encoding in ['cp1252','utf-8']:
    child_env={**os.environ,'PYTHONIOENCODING':encoding}
    result=subprocess.run([sys.executable,'-c',code],capture_output=True,check=True,env=child_env)
    try:
        decoded=json.loads(result.stdout.decode('utf-8'));ok=decoded['filename']==name and decoded['PATH']==os.environ.get('PATH')
    except UnicodeDecodeError:decoded=None;ok=False
    if ok!=(encoding=='utf-8'):raise AssertionError('Unexpected protocol result')
    records.append({'child_override':{'PYTHONIOENCODING':encoding},'native_effects':0,'strict_utf8_json_round_trip':ok,'PATH_unchanged':child_env['PATH']==os.environ['PATH'],'stdout_hex':result.stdout.hex(),'decoded':decoded})
print(json.dumps({'status':'DIAGNOSIS_CONFIRMED','runtime':sys.executable,'records':records},ensure_ascii=True))
