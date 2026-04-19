"""
Extract all basisopgaven antwoorden.docx files into structured JSON.
Reads from /tmp/claude-work/antwoorden/ (pre-copied to avoid OneDrive path issues).
Output: /tmp/claude-work/antwoorden-extracted.json
"""
import sys, json, os, re
sys.stdout.reconfigure(encoding='utf-8')
from docx import Document

# Map paragraph numbers to their metadata
PAR_META = {
    "3.1.1": {"name": "Markt en marktstructuur", "chapter": "Markten"},
    "3.1.2": {"name": "Marktvormen", "chapter": "Markten"},
    "3.1.3": {"name": "Toepassen", "chapter": "Markten"},
    "3.2.1": {"name": "Marktevenwicht", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.2": {"name": "Volkomen concurrentie", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.3": {"name": "Monopolie", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.4": {"name": "Oligopolie", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.5": {"name": "Monopolistische concurrentie", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.6": {"name": "Marktvormen en hun economische doelmatigheid", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.2.7": {"name": "Toepassen", "chapter": "Marktvormen en hun marktevenwicht"},
    "3.3.1": {"name": "De rol van de overheid", "chapter": "Overheid"},
    "3.3.2": {"name": "Overheidsbeleid", "chapter": "Overheid"},
    "3.3.3": {"name": "Collectieve goederen", "chapter": "Overheid"},
    "3.3.4": {"name": "Toepassen", "chapter": "Overheid"},
    "3.4.1": {"name": "Internationale handel", "chapter": "Internationale markten"},
    "3.4.2": {"name": "Inter-industriele handel", "chapter": "Internationale markten"},
    "3.4.3": {"name": "Intra-industriele handel", "chapter": "Internationale markten"},
    "3.4.4": {"name": "Internationale productieketens", "chapter": "Internationale markten"},
    "3.4.5": {"name": "Internationaal handelsbeleid", "chapter": "Internationale markten"},
    "3.4.6": {"name": "Toepassen", "chapter": "Internationale markten"},
}

def extract_exercises(filepath):
    """Parse a docx answer file into structured exercises."""
    doc = Document(filepath)
    exercises = []
    current_ex = None
    current_dv = None
    title = ""

    for para in doc.paragraphs:
        text = para.text.strip()
        style = para.style.name
        if not text:
            continue

        # Title line (first Normal paragraph)
        if style == "Normal" and not title and not text.startswith("Oefening"):
            title = text
            continue

        # New exercise
        m = re.match(r"Oefening\s+(\d+)", text)
        if m and style == "Normal":
            if current_ex:
                if current_dv:
                    current_ex["deelvragen"].append(current_dv)
                exercises.append(current_ex)
            current_ex = {"nr": int(m.group(1)), "deelvragen": [], "instructie": "", "introductie": ""}
            current_dv = None
            continue

        if not current_ex:
            continue

        # Instruction
        if style == "Opdracht_Instructie":
            current_ex["instructie"] = (current_ex["instructie"] + " " + text).strip()
            continue

        # Introduction (context with formulas)
        if style == "Opdracht_Introductie":
            current_ex["introductie"] = (current_ex["introductie"] + " " + text).strip()
            continue

        # Sub-question (a, b, c, ...)
        if style == "Opdracht_Deelvraag":
            if current_dv:
                current_ex["deelvragen"].append(current_dv)
            parts = text.split("\t", 1)
            label = parts[0].strip() if len(parts) > 1 else ""
            question = parts[1].strip() if len(parts) > 1 else text
            current_dv = {"label": label, "question": question, "answers": []}
            continue

        # Standalone question
        if style == "Opdracht_Vraag":
            if current_dv:
                current_ex["deelvragen"].append(current_dv)
            # Check if it's a sub-item (A, B, C, etc.)
            sub_m = re.match(r"^([A-F])\t(.+)$", text)
            if sub_m and current_ex["deelvragen"]:
                # Append as sub-item to last question
                last = current_ex["deelvragen"][-1]
                if "sub_items" not in last:
                    last["sub_items"] = []
                last["sub_items"].append({"label": sub_m.group(1), "text": sub_m.group(2)})
                current_dv = None
                continue
            current_dv = {"label": "", "question": text, "answers": []}
            continue

        # Multiple choice option
        if style == "Opdracht_Opsomming":
            if current_dv:
                if "options" not in current_dv:
                    current_dv["options"] = []
                current_dv["options"].append(text)
            continue

        # Answer line
        if style == "Opdracht_Antwoord-regel" or "Antwoord" in style:
            if current_dv:
                current_dv["answers"].append(text)
            elif current_ex["deelvragen"]:
                current_ex["deelvragen"][-1]["answers"].append(text)
            continue

    # Flush last exercise
    if current_ex:
        if current_dv:
            current_ex["deelvragen"].append(current_dv)
        exercises.append(current_ex)

    return {"title": title, "exercises": exercises}

# ── Main ──
src_dir = os.path.expandvars(r"${TEMP}\claude-work\antwoorden")
if not os.path.exists(src_dir):
    # Try git-bash path
    src_dir = os.path.expanduser(r"~\AppData\Local\Temp\claude-work\antwoorden")
results = {}

for filename in sorted(os.listdir(src_dir)):
    if not filename.endswith(".docx"):
        continue
    par_nr = filename.replace("_antwoorden.docx", "")

    # Skip 3.1.2 (already has begeleide inoefening)
    if par_nr == "3.1.2":
        continue

    filepath = os.path.join(src_dir, filename)
    print(f"Extracting {par_nr}...", file=sys.stderr)

    data = extract_exercises(filepath)
    meta = PAR_META.get(par_nr, {"name": par_nr, "chapter": ""})
    data["par_nr"] = par_nr
    data["name"] = meta["name"]
    data["chapter"] = meta["chapter"]

    results[par_nr] = data

# Write output
out_path = os.path.join(os.path.dirname(src_dir), "antwoorden-extracted.json")
with open(out_path, "w", encoding="utf-8") as fh:
    json.dump(results, fh, ensure_ascii=False, indent=2)

print(f"\nExtracted {len(results)} paragraphs", file=sys.stderr)
for k, v in sorted(results.items()):
    ex_count = len(v["exercises"])
    dv_count = sum(len(e["deelvragen"]) for e in v["exercises"])
    print(f"  {k} {v['name']}: {ex_count} ex, {dv_count} dv", file=sys.stderr)
