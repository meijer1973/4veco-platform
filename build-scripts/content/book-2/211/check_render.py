"""Check actual §211 HTML/PDF text, target cells and printed typography.

Geometry/page reading remains a human or agent visual inspection obligation.
This script never supplies a review verdict or edits a proof manifest.
"""
import json
import re
import sys
from pathlib import Path

import math
from pypdf import PdfReader
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_211 as builder


def normalize(value):
    return re.sub(r"\s+", " ", value).strip()


def inspect(lesson_root):
    folder = lesson_root / builder.LESSON_REL
    record = builder.target_record()
    result = {"paragraph": "2.1.1", "automated_checks": [], "documents": [],
              "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"}
    exercise_fragments = []
    for kind in ("paragraaf", "opgaven", "antwoorden"):
        stem = folder / f"{builder.STEM} – {kind}"
        html_path, pdf_path = Path(str(stem) + ".html"), Path(str(stem) + ".pdf")
        soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
        pdf = PdfReader(pdf_path)
        printed_sizes = []
        def visit(text, cm, tm, font, size):
            if text.strip():
                printed_sizes.append(size * math.sqrt(abs(cm[0]*cm[3] - cm[1]*cm[2])))
        pdf_text = normalize(" ".join(page.extract_text(visitor_text=visit) or "" for page in pdf.pages))
        # The12pt floor includes running footer and page counter, without
        # exclusions. Convert through the actual PDF text transform.
        minimum = min(printed_sizes)
        assert minimum >= 11.99, (kind, "small printed text including footer", minimum)
        for number in range(1, 10):
            assert f"Opgave {number}" in pdf_text, (kind, "missing exercise", number)
        result["documents"].append({"kind": kind, "pages": len(pdf.pages),
                                    "minimum_printed_font_pt_including_footer": round(minimum, 3),
                                    "pdf_sha256": builder.digest(pdf_path)})
        if kind in ("paragraaf", "opgaven"):
            start = soup.find("h2", id="uitgewerkt-voorbeeld")
            exercise_fragments.append("".join(str(node) for node in [start, *start.next_siblings]))
            target = soup.find("h2", id="doeloefening").find_next("div", class_="exercise")
            assert target.find("strong").get_text() == "Opgave 7"
            target_text = normalize(target.get_text(" ", strip=True))
            assert normalize(record["target_exercise"]["context"]) in target_text
            assert normalize(record["target_exercise"]["context"]) in pdf_text
            for question in record["target_exercise"]["subquestions"]:
                assert normalize(question["prompt"]) in target_text, question["label"]
                assert normalize(question["prompt"]) in pdf_text, question["label"]
                assert f"{question['label']}) ({question['points']} punten)" in target_text
            supplied = record["target_exercise"]["sources"][0]
            target_table = target.table
            assert [c.get_text(strip=True) for c in target_table.find_all("th")] == supplied["columns"]
            assert [[c.get_text(strip=True) for c in row.find_all("td")] for row in target_table.tbody.find_all("tr")] == supplied["rows"]
            assert not target.find("ol"), "lettered target silently became a numeric list"
        if kind == "paragraaf":
            for goal in record["lesson_goals"]:
                assert normalize(goal) in pdf_text
    assert exercise_fragments[0] == exercise_fragments[1], "exercise HTML editions drifted"
    result["automated_checks"] = ["all printed text including footer >=12pt", "all exercises present",
        "exact target context/prompts in HTML and PDF", "literal a-e plus4/3/3/3/4points",
        "exact supplied header/row cells", "four exact goals in paragraph PDF",
        "identical exercise HTML fragments"]
    return result


if __name__ == "__main__":
    print(json.dumps(inspect(builder.ROOT.parent / "4veco-lessen"), indent=2))
