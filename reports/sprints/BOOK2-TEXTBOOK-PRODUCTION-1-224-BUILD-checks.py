"""HOW TO ADAPT: actual §224 author check packet; never independent acceptance.
Only new own-prefix results are written; every command exit/stdout is retained.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/"build-scripts/content/book-2/224"))
import check_render
import b2_224 as b

PREFIX="BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD"
CONTROLLER_PATH="reports/sprints/"+PREFIX+"-controller.py"
CONTROLLER_COMMIT="0e2349ecf50e817482bf2f5c1d6d5aedc32c9323"
spec=importlib.util.spec_from_file_location("c224",ROOT/CONTROLLER_PATH)
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)


def probes():
    originals={path:c.git(ROOT,"show",c.SOURCE_COMMIT+":"+path) for path in c.SOURCE_PATHS}
    originals[CONTROLLER_PATH]=c.git(ROOT,"show",CONTROLLER_COMMIT+":"+CONTROLLER_PATH)
    c.verify_bound_bytes(ROOT,originals)
    rows=[]
    with tempfile.TemporaryDirectory(prefix="b224-src-",dir="C:/wt" if os.name=="nt" else None) as temporary:
        fixture=Path(temporary)
        for relative,raw in originals.items():
            path=fixture/relative;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(raw)
        c.verify_bound_bytes(fixture,originals)
        def reject(label):
            with patch.object(subprocess,"run",side_effect=AssertionError("Unexpected subprocess")) as effects, \
                 patch.object(Path,"mkdir",side_effect=AssertionError("Unexpected directory")) as mkdir, \
                 patch.object(Path,"write_bytes",side_effect=AssertionError("Unexpected output")) as write:
                try:c.verify_bound_bytes(fixture,originals)
                except (ValueError,FileNotFoundError):pass
                else:raise AssertionError("Source mutation accepted: "+label)
                effects.assert_not_called();mkdir.assert_not_called();write.assert_not_called()
            rows.append({"case":label,"rejected":True,"native_effects":0})
        for relative,raw in originals.items():
            path=fixture/relative
            path.unlink();reject("missing whole "+relative);path.write_bytes(raw)
            path.write_bytes(raw+b"\n# unrelated drift\n");reject("unrelated whole "+relative);path.write_bytes(raw)
        mutations=[
            ("exercises.md","“procentuele verandering van\nde vraag naar …”", "“vraag naar …”", "level ratio in optional cross help"),
            ("exercises.md","4,8 op 5","4,3 op 5","source service rating"),
            ("exercises.md","een goed met Ei = 0 en een goed met Ei = 1.","een goed met Ei < 0 en een goed met Ei = 1.","boundary question"),
            ("exercises.md","Pc = 20 en Y = 20.000.","Pc = 20 en Y = 20.000/12.","annual income unit"),
            ("exercises.md","Begin vervolgens opnieuw","Ga zonder terugzetten verder","reset removed"),
            ("exercises.md","{{TARGET}}","{{TARGET}}\nEen extra grafiek tekenen.","extra target graph"),
            ("exercises.md","Bij vraag 6 en de volgende doeloefening kies je zelf de aanpak","Gebruik bij alle doelvragen de ingevulde hulp","fading removed"),
            ("answers.md","**−12%**","**−10%**","wrong revenue result"),
            ("answers.md","**1,5 × 0,6 = 0,9**","**1,5 + 0,6 = 2,1**","finite additive shortcut"),
            ("answers.md","**Ek = −10% / +20% = −0,5**","**Ek = −10% / +10% = −1**","wrong price source"),
            ("answers.md","**200**, niet met 220","**220**, niet met 200","wrong scenario base"),
            ("answers.md","**Ei = +10% / +20% = 0,5**","**Ei = 0,005**","coefficient as elasticity"),
            ("answers.md","**Ei = 0 en Ei = 1 geen","**Ei = 0 en Ei = 1 een normale","boundary category drift"),
            ("target-answers.md","precies de twee","minstens drie","target limitations changed"),
            ("target-answers.md","geen periode","één maand","unprovided target period"),
            ("target-answers.md","P = 12 en Pc = 10","P = 10 en Pc = 12","fixed target prices swapped"),
            ("answers.md","4. Begrensde conclusie:","4. Onbeperkte voorspelling:","bonus fourth criterion changed"),
        ]
        for filename,old,new,label in mutations:
            relative="build-scripts/content/book-2/224/"+filename;raw=originals[relative]
            if raw.count(old.encode())!=1:raise ValueError("Mutation anchor not unique: "+label)
            (fixture/relative).write_bytes(raw.replace(old.encode(),new.encode(),1));reject(label);(fixture/relative).write_bytes(raw)
        # Change both source and a guard literal: immutable external originals
        # still reject the whole candidate rather than learning changed hashes.
        relative="build-scripts/content/book-2/b2_224.py"
        (fixture/relative).write_bytes(originals[relative].replace(b.TARGET_HASH.encode(),b"0"*64,1))
        (fixture/CONTROLLER_PATH).write_bytes(originals[CONTROLLER_PATH].replace(c.SOURCE_COMMIT.encode(),b"0"*40,1))
        reject("synchronized generator target pin and controller source-commit drift")
    return {"status":"PASS","cases":rows,"total":len(rows),"immutable_source_commit":c.SOURCE_COMMIT,
            "immutable_controller_commit":CONTROLLER_COMMIT,"whole_files":[{"path":p,"sha256":b.sha(raw)} for p,raw in originals.items()]}


def run(manifest,label):
    evidence=ROOT/"reports/sprints"/(PREFIX+"-evidence")
    if (evidence/f"224-checks-{label}.json").exists():raise ValueError("Fresh check label required")
    result={"actor":"paragraph_224_builder","independent_review":False,"probes":probes(),"commands":[]}
    folder=c.LESSONS/b.LESSON_REL
    commands=[
        [sys.executable,"build-scripts/content/book-2/224/test_source.py"],
        [sys.executable,"build-scripts/content/book-2/224/check_render.py","--lesson-root",str(c.LESSONS),"--manifest",str(manifest),"--rebuild"],
        ["node","scripts/validate-paragraph.js","--mode","part-a","--profile","student-web",str(folder)],
        ["node","scripts/validate-paragraph.js","--mode","part-a","--profile","publisher-print",str(folder)],
        ["node","build-scripts/workflows/check-book-outline-currentness.js","--require-approved","--action","paragraph_production","--paragraph","2.2.4"],
        ["node","build-scripts/workflows/check-book2-target-authority-remediation.js","--durable"],
        ["node","build-scripts/sprints/check-sprint-bundle.js","BOOK2-TEXTBOOK-PRODUCTION-1"],
    ]
    env=dict(os.environ);env["PYTHONIOENCODING"]="utf-8";env["PYTHONDONTWRITEBYTECODE"]="1"
    for index,command in enumerate(commands):
        completed=subprocess.run(command,cwd=ROOT,capture_output=True,env=env)
        row={"argv":command,"cwd":str(ROOT),"exit_code":completed.returncode,
             "stdout":completed.stdout.decode("utf-8",errors="replace"),"stderr":completed.stderr.decode("utf-8",errors="replace"),
             "stdout_raw_sha256":b.sha(completed.stdout),"stderr_raw_sha256":b.sha(completed.stderr)}
        result["commands"].append(row)
        print(f"command {index+1}/{len(commands)}: exit {completed.returncode}",flush=True)
    result["status"]="PASS" if all(r["exit_code"]==0 for r in result["commands"]) else "FAIL"
    # Separate semantic checker data, not a fabricated rendering record.
    if result["commands"][1]["exit_code"]==0:
        result["rendered_native_checks"]=check_render.check(c.LESSONS,manifest)
    path=evidence/f"224-checks-{label}.json";c.write_new(path,result)
    print(json.dumps({"status":result["status"],"path":str(path),"sha256":b.digest(path),"source_probes":result["probes"]["total"]}))
    if result["status"]!="PASS":raise SystemExit(1)


if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("--manifest",type=Path,required=True);parser.add_argument("--label",required=True)
    args=parser.parse_args();run(args.manifest,args.label)
