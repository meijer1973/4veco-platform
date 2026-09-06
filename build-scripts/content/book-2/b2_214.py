"""Governed §214 authoring. Full route; thin wrapper calls the same build.

HOW TO ADAPT: immutable release constants must never be adapted to local drift.
Source author revisions require an explicit new committed source epoch and
full-byte derivation; no runtime pin updates. Native effects occur only after
local/committed release, whole source, current action and durable validation.
The generic print worker is internal, not an authorized standalone route.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).resolve().parent
SOURCE = CONTENT / "214"
BASE_PLATFORM = "bc49af3353bf0ba3a061b2ef3e5ddec3c3a72abb"
RELEASE_COMMIT = "5870a7a4c2d5dc9b170f385b976b0a49953b9be6"
CANDIDATE_COMMIT = "9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56"
REVIEW_COMMIT = "8fc63fe32f030371195f022971a2d5d42ddedeb8"
SOURCE_COMMIT = "8594d5dd8c7cae2821db6a51d9f2725d721f70eb"
SOURCE_SENTINEL = "SOURCE_COMMIT_" + "PENDING_214"
DEPS_SHA256 = "98b3fbae167dc01ff590c60b194be869c9f0cb7c83efccb0007a5f3556cf8f6b"
NATIVE_LESSONS_COMMIT = "PENDING_FIRST_NATIVE_LESSONS_COMMIT"
N = "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-"
C = "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-"
R = "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-REVIEW-"
MODULES = [
    (N+"214-release.json", RELEASE_COMMIT, "f7752aa314f6db0cd8fd2eb076547b96f0624986e96553395e765adeb93dead6"),
    (N+"gate.cjs", RELEASE_COMMIT, "4f3c2ab8a5e877697952f7c951fdc712ff08d2f13c966a1ca86394690314fe5d"),
    (C+"214-inputs.json", CANDIDATE_COMMIT, "8adf329ff71e912335baa11d1e78a28afb8eb807de52306ffd867e35c7f0f376"),
    (C+"check.cjs", CANDIDATE_COMMIT, "927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b"),
    (R+"report.md", REVIEW_COMMIT, "373adbb84185500dfc1c17d27976e0eb7d0ecfb5157bb24ccfe32849415489ed"),
    (R+"independent.json", REVIEW_COMMIT, "8dadf8d9f0c233e1fa5201984419eb8e66bb077c32c6177befb844a2bd984491"),
    (R+"lineage.json", REVIEW_COMMIT, "fdbe250068cc81235c5b3217171a66de5f0412c6350992a24405dd4beb557d40"),
]
TARGET_SHA256 = "fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691"
LESSON_REL = "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven"
STEM = "2.1.4 Gemengde opgaven"
HEADINGS = ["Zo werk je met bronnen", "Opgave 1 — Lichtservice bij de sportclub",
            "Doeloefening — Opgave 2: SmoothBox", "Denkertje / Bonusopgave",
            "Herhaling / Herhaling en interleaving"]
SOURCE_FILES = ["b2_214.py", *["214/"+p for p in (
    "exercises.md", "answers.md", "target-answers.md", "figures.py", "raster.cjs",
    "dependency-pins.json", "direct_print.py", "test_source.py", "check_render.py")]]
EVENTS = []


def sha(b):
    return hashlib.sha256(b).hexdigest()


def data_path(p):
    """Read-only Windows long DATA adapter; never CLI arguments or PATH."""
    p = Path(p)
    if sys.platform == "win32" and len(str(p.absolute())) >= 245:
        return Path("\\\\?\\" + str(p.absolute()))
    return p


def raw(p):
    return data_path(p).read_bytes()


def must(condition, reason):
    if not condition:
        raise ValueError(reason)


def pure_local_gate(lessons, platform=None):
    """Complete raw local checks, no subprocess/mkdir/write/imported worker."""
    platform = platform or ROOT
    roots = {"4veco-platform": platform, "4veco-lessen": lessons}
    for name, _commit, expected in MODULES:
        must(sha(raw(platform/name)) == expected, "Immutable release/module bytes: "+name)
    grant = json.loads(raw(platform/(N+"214-release.json")))
    manifest = json.loads(raw(platform/(C+"214-inputs.json")))
    must(grant["decision"] == "RELEASED_FOR_GATED_PART_A_AUTHORING" and grant["paragraph"] == "2.1.4", "Root permission identity")
    must(len(manifest["inputs"]) == 48, "Complete 48-input contract")
    seen = set()
    for row in manifest["inputs"]:
        key = (row["repository"], row["path"])
        must(key not in seen and row["repository"] in roots, "Input identity/uniqueness")
        seen.add(key)
        b = raw(roots[row["repository"]]/row["path"])
        must(sha(b) == row["raw_sha256"], "Actual raw input: "+row["path"])
        lf = b.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n").encode()
        must(sha(lf) == row["canonical_lf_sha256"], "Actual LF input: "+row["path"])
    dependencies = raw(platform/"build-scripts/content/book-2/214/dependency-pins.json")
    must(sha(dependencies) == DEPS_SHA256, "Immutable dependency list")
    deps = json.loads(dependencies)
    must(deps["commit"] == BASE_PLATFORM, "Dependency commit")
    for row in deps["files"]:
        must(sha(raw(platform/row["path"])) == row["raw_sha256"], "Authority/worker dependency: "+row["path"])
    return grant, manifest, deps


def run(argv, *, cwd=None, env=None, input=None, native=False):
    start = __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()
    r = subprocess.run([str(x) for x in argv], cwd=str(cwd or ROOT), env=env,
                       input=input, capture_output=True, check=False)
    EVENTS.append({"argv": [str(x) for x in argv], "cwd": str(cwd or ROOT),
                   "native_worker": native, "start": start, "exit_code": r.returncode,
                   "stdout": r.stdout.decode("utf-8", "replace"), "stderr": r.stderr.decode("utf-8", "replace")})
    if r.returncode:
        raise RuntimeError(json.dumps(EVENTS[-1], ensure_ascii=False))
    return r.stdout


def git(root, *args):
    return run(["git", *args], cwd=root)


def verify_committed_custody(lessons, manifest, deps):
    for name, commit, expected in MODULES:
        b = git(ROOT, "show", commit+":"+name)
        must(sha(b) == expected and b == raw(ROOT/name), "Committed full release/module: "+name)
    for row in manifest["inputs"]:
        root = ROOT if row["repository"] == "4veco-platform" else lessons
        must(git(root, "show", row["commit"]+":"+row["path"]) == raw(root/row["path"]), "Committed input: "+row["path"])
    for row in deps["files"]:
        must(git(ROOT, "show", BASE_PLATFORM+":"+row["path"]) == raw(ROOT/row["path"]), "Committed dependency: "+row["path"])
    must(re.fullmatch("[a-f0-9]{40}", SOURCE_COMMIT), "Source epoch not yet committed")
    for name in SOURCE_FILES:
        baseline = git(ROOT, "show", SOURCE_COMMIT+":build-scripts/content/book-2/"+name)
        expected = baseline
        if name == "b2_214.py":
            old = ('SOURCE_COMMIT = "'+SOURCE_SENTINEL+'"').encode()
            must(baseline.count(old) == 1, "Once-only immutable source epoch slot")
            expected = baseline.replace(old, ('SOURCE_COMMIT = "'+SOURCE_COMMIT+'"').encode())
        must(raw(CONTENT/name) == expected, "Whole committed source/controller derivation: "+name)


def child_env(lessons):
    env = os.environ.copy()  # inherited PATH is deliberately not normalized
    env.update(PYTHONDONTWRITEBYTECODE="1", PYTHONIOENCODING="utf-8",
               FOURVECO_PLATFORM_ROOT=str(ROOT), FOURVECO_LESSEN_ROOT=str(lessons),
               FOURVECO_PLATFORM_SOURCE_REF=git(ROOT,"rev-parse","HEAD").decode().strip(),
               FOURVECO_LESSEN_SOURCE_REF=git(lessons,"rev-parse","HEAD").decode().strip(),
               FOURVECO_PLATFORM_SOURCE_BRANCH=git(ROOT,"branch","--show-current").decode().strip(),
               FOURVECO_LESSEN_SOURCE_BRANCH=git(lessons,"branch","--show-current").decode().strip())
    return env


def authorize(lessons):
    grant, manifest, deps = pure_local_gate(lessons)
    verify_committed_custody(lessons, manifest, deps)
    env = child_env(lessons)
    run(["node", N+"gate.cjs", "214"], env=env)
    run(["node", "build-scripts/workflows/check-book-outline-currentness.js",
         "--require-approved", "--action", "paragraph_production", "--paragraph", "2.1.4"], env=env)
    run(["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"], env=env)
    return grant, manifest, env


def target_record(platform=None):
    registry = json.loads(raw((platform or ROOT)/"references/authored/course-target-exercises.json"))
    rows = [r for r in registry["exercises"] if r["id"] == "2.1.4"]
    must(len(rows) == 1, "Unique target")
    record = rows[0]
    must(sha(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()) == TARGET_SHA256, "Whole original-order frozen target")
    return record


def table(columns, rows):
    return "| "+" | ".join(columns)+" |\n|"+"|".join("---" for _ in columns)+"|\n" + "\n".join("| "+" | ".join(row)+" |" for row in rows)


def serialize_target(record):
    target = record["target_exercise"]
    out = [target["context"]]
    for source in target["sources"]:
        label = {"bron-a":"Bron A", "bron-b":"Bron B", "basisgrafiek":"Basisgrafiek"}[source["id"]]
        out += ["**"+label+"**", source["content"]]
        if "columns" in source:
            out.append(table(source["columns"], source["rows"]))
    return "\n\n".join(out)


def tables_to_native(md):
    lines, result, i = md.splitlines(), [], 0
    while i < len(lines):
        if lines[i].startswith("|") and i+1 < len(lines) and re.fullmatch(r"[| :\-]+", lines[i+1]):
            headers = [x.strip() for x in lines[i].strip("|").split("|")]
            i += 2
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([x.strip() for x in lines[i].strip("|").split("|")]); i += 1
            widths = ([55,45] if len(headers) == 2 else [30,35,35] if len(headers) == 3 else [25]*4)
            if len(headers) != len(widths):
                widths = [100/len(headers)]*len(headers)
            value = '<table style="break-inside:avoid"><colgroup>' + ''.join(f'<col style="width:{w}%">' for w in widths) + '</colgroup>\n<thead><tr>'
            value += ''.join('<th>'+html.escape(h)+'</th>' for h in headers) + '</tr></thead>\n<tbody>\n'
            for row in rows:
                must(len(row) == len(headers), "Table width")
                value += '<tr>'+''.join('<td>'+html.escape(c)+'</td>' for c in row)+'</tr>\n'
            result.append(value+'</tbody></table>')
        else:
            result.append(lines[i]); i += 1
    return "\n".join(result).rstrip()+"\n"


def documents(record):
    source = raw(SOURCE/"exercises.md").decode()
    answers = raw(SOURCE/"answers.md").decode()
    target_answers = raw(SOURCE/"target-answers.md").decode()
    questions = record["target_exercise"]["subquestions"]
    q = lambda row: f'**Vraag {row["label"]} ({row["points"]} punten).** '+row["prompt"]
    source = source.replace("{{GOALS}}", "\n".join(f"{i}. {goal}" for i,goal in enumerate(record["lesson_goals"],1)))
    source = source.replace("{{TARGET_SOURCES}}", serialize_target(record))
    source = source.replace("{{TARGET_1_4}}", "\n\n".join(q(r) for r in questions[:4]))
    source = source.replace("{{TARGET_5_6}}", "\n\n".join(q(r) for r in questions[4:]))
    for label, model in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_"+label+"}}", model)
    answers = answers.replace("{{TARGET_ANSWERS}}", target_answers)
    must("{{" not in source+answers, "Unfilled source token")
    must(re.findall(r"^## (.+)$", source, re.M) == HEADINGS, "Consolidation headings")
    return {"opgaven": tables_to_native(source), "antwoorden": tables_to_native(answers)}


def load_owned(name):
    spec = importlib.util.spec_from_file_location("b214_"+name, SOURCE/(name+".py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def wrapper_bytes():
    return '''"""Thin §214 entrypoint; no rendering or authorization bypass."""
import argparse
from pathlib import Path
import sys
sys.dont_write_bytecode = True
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--platform-root", type=Path, required=True)
    parser.add_argument("--lessons-root", type=Path, required=True)
    parser.add_argument("--proof-root", type=Path, required=True)
    parser.add_argument("--proof-suffix", required=True)
    args = parser.parse_args()
    sys.path.insert(0, str(args.platform_root / "build-scripts/content/book-2"))
    import b2_214
    b2_214.main(["--lessons-root", str(args.lessons_root), "--proof-root", str(args.proof_root), "--proof-suffix", args.proof_suffix, "--route", "thin"])
if __name__ == "__main__":
    main()
'''.encode()


def native_paths(lessons):
    base = lessons/LESSON_REL
    return ([base/(STEM+" – "+ed+"."+ext) for ed in ["opgaven", "antwoorden"] for ext in ["md", "html", "pdf"]]
            + [base/"_assets"/f"2.1.4_ex_{i}.{ext}" for i in range(1,5) for ext in ["svg", "png"]]
            + [base/"build_pdf.py"])


def namespace_check(proof_root, suffix):
    must(re.fullmatch(r"r[1-9][0-9]*", suffix), "Fresh positive proof revision required")
    requested = int(suffix[1:])
    all_roots = set()
    for repository in (ROOT, ROOT.parent/"4veco-lessen"):
        for item in git(repository, "worktree", "list", "--porcelain", "-z").decode().split("\0"):
            if item.startswith("worktree "):
                all_roots.add(item[9:])
    found = []
    for registered in sorted(all_roots):
        root = Path(registered)
        for directory in (root/"reports", root/"output"):
            if not directory.exists():
                continue
            for current, folders, files in os.walk(data_path(directory)):
                for name in folders+files:
                    relative = str(Path(current)/name)
                    if "214" not in relative:
                        continue
                    matches = re.findall(r"(?:^|[^a-z0-9])r(\d+)(?=$|[^0-9])", relative, re.I)
                    found.extend({"path":relative,"revision":int(v)} for v in matches)
    highest = max((r["revision"] for r in found), default=0)
    must(requested > highest, f"Revision {requested} is not above globally observed {highest}")
    root_abs = proof_root.resolve()
    allowed = (ROOT/"reports").resolve()
    must(root_abs.is_relative_to(allowed) and "214" in root_abs.name, "Owned paragraph214 proof root required")
    must(not proof_root.exists(), "Proof namespace must not yet exist")
    reservation = ROOT/"reports"/"sprints"/("BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT-reservation-"+suffix+".json")
    must(not reservation.exists(), "Reservation already exists")
    return {"all_registered_roots":sorted(all_roots),"observed":found,"highest":highest,
            "requested":requested,"proof_root":str(root_abs),"reservation":str(reservation)}


def reserve(namespace):
    reservation = Path(namespace["reservation"])
    reservation.parent.mkdir(parents=True, exist_ok=True)
    with reservation.open("x", encoding="utf-8", newline="\n") as stream:
        json.dump(namespace,stream,ensure_ascii=False,indent=2)
        stream.write("\n")
    Path(namespace["proof_root"]).mkdir(parents=False, exist_ok=False)


def verify_native_derivation(lessons, docs, assets, *, require_png=False):
    base = lessons/LESSON_REL
    for ed, md in docs.items():
        must(raw(base/(STEM+" – "+ed+".md")) == md.encode(), "Exact current MD derivation: "+ed)
    for name, svg in assets.items():
        must(raw(base/"_assets"/name) == svg.encode(), "Exact current SVG derivation: "+name)
    must(raw(base/"build_pdf.py") == wrapper_bytes(), "Thin wrapper bytes")
    if require_png:
        # An actual earlier committed full-build source/PNG pair, not a live
        # expected-file hash or self-referential manifest. No native invocation.
        must(re.fullmatch("[a-f0-9]{40}", NATIVE_LESSONS_COMMIT), "Actual native source-pair commit required")
        for name, svg in assets.items():
            rel = LESSON_REL+"/_assets/"+name
            must(git(lessons,"show",NATIVE_LESSONS_COMMIT+":"+rel) == svg.encode(), "Committed native SVG derives current source")
            png_rel = rel.replace(".svg",".png")
            must(git(lessons,"show",NATIVE_LESSONS_COMMIT+":"+png_rel) == raw(lessons/png_rel), "Actual committed PNG source-pair derivation")


def build(lessons, proof_root, suffix, *, route="full"):
    must(route in ["full", "thin"], "Unknown build route")
    _grant, _manifest, env = authorize(lessons)
    record = target_record()
    docs = documents(record)
    assets = load_owned("figures").asset_sources()
    namespace = namespace_check(proof_root, suffix)
    reserve(namespace)  # FIRST native filesystem effect, after every authority gate.
    base = lessons/LESSON_REL
    base.mkdir(parents=True, exist_ok=True)
    (base/"_assets").mkdir(exist_ok=True)
    for name, svg in assets.items():
        (base/"_assets"/name).write_bytes(svg.encode())
        run(["node", SOURCE/"raster.cjs", base/"_assets"/name.replace(".svg", ".png")], env=env, input=svg.encode(), native=True)
    for ed, md in docs.items():
        (base/(STEM+" – "+ed+".md")).write_bytes(md.encode())
    (base/"build_pdf.py").write_bytes(wrapper_bytes())
    verify_native_derivation(lessons,docs,assets)
    sys.path.insert(0,str(CONTENT))
    import print_pipeline as pipeline
    proofs = []
    for ed in ["opgaven", "antwoorden"]:
        source = base/(STEM+" – "+ed+".md")
        product = pipeline.build_document(source)
        dest = proof_root/("2.1.4-"+ed+"-"+suffix+"-"+product["pdf_sha256"][:12])
        proofs.append(pipeline.render_proof(product,dest))
    return complete_result(lessons,proof_root,suffix,route,namespace,proofs)


def complete_result(lessons, proof_root, suffix, route, namespace, proofs):
    paths = native_paths(lessons)
    must(len(paths) == 15 and all(p.exists() for p in paths), "Complete 15-file native contract")
    result = {"paragraph":"2.1.4", "role":"AUTHOR_NATIVE_PROOF_NOT_ACCEPTANCE", "route":route,
              "suffix":suffix,"source_commit":SOURCE_COMMIT,"release_commit":RELEASE_COMMIT,
              "release_sha256":MODULES[0][2],"candidate_sha256":MODULES[2][2],
              "inherited_PATH":os.environ.get("PATH"),"python":sys.executable,"argv":sys.argv,
              "namespace":namespace,"processes":EVENTS,
              "native":[{"path":p.relative_to(lessons).as_posix(),"bytes":len(raw(p)),"sha256":sha(raw(p))} for p in paths],
              "proofs":proofs,"inspection":"PENDING; separate personal observations required"}
    with (proof_root/"author-run.json").open("x",encoding="utf-8",newline="\n") as stream:
        json.dump(result,stream,ensure_ascii=False,indent=2); stream.write("\n")
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lessons-root",type=Path,required=True)
    parser.add_argument("--proof-root",type=Path,required=True)
    parser.add_argument("--proof-suffix",required=True)
    parser.add_argument("--route",choices=["full","thin"],default="full")
    args = parser.parse_args(argv)
    try:
        result = build(args.lessons_root,args.proof_root,args.proof_suffix,route=args.route)
    except Exception:
        print(json.dumps({"failed_route":args.route,"suffix":args.proof_suffix,"processes":EVENTS},ensure_ascii=False),file=sys.stderr)
        raise
    print(json.dumps({"status":"NATIVE_CAPTURE_COMPLETE_NOT_ACCEPTED","route":result["route"],
                      "native_files":len(result["native"]),"pages":[len(p["rendered_pages"]) for p in result["proofs"]]}))


if __name__ == "__main__":
    main()
