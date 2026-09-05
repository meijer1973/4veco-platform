# Sprint BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW: Command Log

## C:/Python314/python.exe build-scripts/content/book-2/223/test_source.py

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:18:03.298Z`
- finished_at: `2026-09-05T18:18:03.733Z`
- duration_ms: `435`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `aac8d2bb7cbffdd5f4ef5efdaee0ff548b68afa6ed548eaa8b2b074af47465dc`

### stdout excerpt

```text

```

### stderr excerpt

```text
.......
----------------------------------------------------------------------
Ran 7 tests in 0.018s

OK

```
## npm.cmd run check:book-outline-currentness -- --require-approved --action specialist_review --paragraph 2.2.3

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:18:03.786Z`
- finished_at: `2026-09-05T18:18:06.216Z`
- duration_ms: `2430`
- exit_code: `0`
- stdout_sha256: `734e1bb11d02b25778a0571faee47a509533aa6e89566375de2d798c7302630b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:book-outline-currentness
> node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action specialist_review --paragraph 2.2.3

Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3

```

### stderr excerpt

```text

```
## npm.cmd run check:book2-target-authority-remediation

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:18:06.259Z`
- finished_at: `2026-09-05T18:18:07.882Z`
- duration_ms: `1623`
- exit_code: `0`
- stdout_sha256: `6f198b95137388a1cad3ab4775d82e870059edc84e075a29b591d26b6977b97e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:book2-target-authority-remediation
> node build-scripts/workflows/check-book2-target-authority-remediation.js --durable && node build-scripts/workflows/check-book2-candidate-approval-block.js

Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
Book 2 candidate approval block: PASS
- retired after fully evidenced Issue #229 target integration

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-probes.py

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:18:07.926Z`
- finished_at: `2026-09-05T18:18:08.022Z`
- duration_ms: `96`
- exit_code: `0`
- stdout_sha256: `87f651537fc0742afd69638310744c482b69e88bd86af70a8bb47aa60688a855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "reviewer": "paragraph_223_independent_review",
  "candidate_platform": "8dc54d78a222cff2225d88aae8c7d23141953cc1",
  "candidate_lessons": "b23e0056511fc5b9b10f0b8e6bbe130d2599c36b",
  "pass_0": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb",
      "pages": 15,
      "manifest_sha256": "54a684ab32f7ac453f270867d18f70ccb097cecaa7e57f337fcc199772cab25d"
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80",
      "pages": 10,
      "manifest_sha256": "43f41e2c6377e13a629ad7f8b95aa38765906ae42d871bc763ffaadca9111128"
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10",
      "pages": 7,
      "manifest_sha256": "b4b068c88c34fd00704f0a6ab3b8a9122f24c27a5b7ff2c582167968c6d75691"
    }
  ],
  "asset_inventory": [
    "2.2.3_fig_1.png",
    "2.2.3_fig_1.svg",
    "2.2.3_fig_2.png",
    "2.2.3_fig_2.svg",
    "2.2.3_fig_3.png",
    "2.2.3_fig_3.svg",
    "2.2.3_fig_4.png",
    "2.2.3_fig_4.svg"
  ],
  "independent_rational_cases": {
    "worked": {
      "Q_old": "200",
      "Q_income": "230",
      "Q_reset_price": "204",
      "percent_Q": "15",
      "percent_Y": "20",
      "Ei_exact": "3/4"
    },
    "guided_4": {
      "Q_old": "160",
      "Q_income": "180",
      "Q_reset_price": "162",
      "percent_Q": "25/2",
      "percent_Y": "20",
      "Ei_exact": "5/8"
    },
    "guided_5": {
      "Q_old": "200",
      "Q_income": "220",
      "Q_reset_price": "205",
      "percent_Q": "10",
      "percent_Y": "20",
      "Ei_exact": "1/2"
    },
    "independent_8": {
      "Q_old": "180",
      "Q_income": "200",
      "Q_reset_price": "184",
      "percent_Q": "100/9",
      "percent_Y": "20",
      "Ei_exact": "5/9"
    },
    "target_9": {
      "Q_old": "390",
      "Q_income": "420",
      "Q_reset_price": "392",
      "percent_Q": "100/13",
      "percent_Y": "10",
      "Ei_exact": "10/13"
    }
  },
  "direct_ratio_checks": 17,
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "immutable_build_manifest_sha256": "f88345226b61e9e2dd9d0ace8067caf2847280c324ab313c9b26ca8d184aa565"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/223/check_render.py --lesson-root "\\\\?\\C:\\wt\\book2-223-independent-review-20260905\\4veco-lessen" --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-local-manifest.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-check.json

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:18:08.065Z`
- finished_at: `2026-09-05T18:18:16.446Z`
- duration_ms: `8381`
- exit_code: `0`
- stdout_sha256: `6b8155ff1bd786f1ca2c52c2b5879928105183041a39dfa23fa93a0a1f7688ae`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.3",
  "automated_status": "PASS",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb",
      "pages": 15,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 14.117,
      "proof_directory": "C:\\wt\\book2-223-independent-review-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\223-paragraaf-ca27f8bd6cbb-r3",
      "all_page_hashes_match": true,
      "zip_members": [
        "2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.html",
        "2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.md",
        "2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.pdf",
        "_assets/2.2.3_fig_1.png",
        "_assets/2.2.3_fig_1.svg",
        "_assets/2.2.3_fig_2.png",
        "_assets/2.2.3_fig_2.svg",
        "_assets/2.2.3_fig_3.png",
        "_assets/2.2.3_fig_3.svg",
        "_assets/2.2.3_fig_4.png",
        "_assets/2.2.3_fig_4.svg"
      ],
      "page_map": [
        {
          "page": 1,
          "words": 314,
          "exercises": [],
          "opening": "2.2.3 Inkomenselasticiteit en kruislingse elasticiteit Dezelfde eigen prijs, toch een ande"
        },
        {
          "page": 2,
          "words": 128,
          "exercises": [],
          "opening": "Goed %\u0394Y %\u0394Qv Ei=%\u0394Qv/%\u0394Y Luxe picknickmanden +10% +15% +15%/+10%=1,5 Eenvoudige lunchpakk"
        },
        {
          "page": 3,
          "words": 175,
          "exercises": [],
          "opening": "Definitie: inferieur goed Een goed met Ei<0: inkomen en gevraagde hoeveelheid veranderen i"
        },
        {
          "page": 4,
          "words": 227,
          "exercises": [],
          "opening": "\u201cInferieur\u201d is geen oordeel over kwaliteit of over de koper. Ook zegt de indeling niet of "
        },
        {
          "page": 5,
          "words": 174,
          "exercises": [],
          "opening": "Figuur 3: Elke verhouding benoemt een hoeveelheidsgoed \u00e9n een ander prijsgoed. Let op - va"
        },
        {
          "page": 6,
          "words": 287,
          "exercises": [],
          "opening": "De co\u00ebffici\u00ebnten horen bij deze eenheden. De term 0,005Y levert een bijdrage aan abonnemen"
        },
        {
          "page": 7,
          "words": 312,
          "exercises": [],
          "opening": "2. De prijs van een ander goed verandert De prijs van papieren boeken stijgt 20%. De vraag"
        },
        {
          "page": 8,
          "words": 179,
          "exercises": [],
          "opening": "Figuur 4: Vergelijk afzonderlijke veranderingen steeds met dezelfde beginsituatie. Stap 3 "
        },
        {
          "page": 9,
          "words": 311,
          "exercises": [
            "1",
            "2"
          ],
          "opening": "Onthouden Gebruik (nieuw\u2212oud)/oud\u00d7 100%. Oude Q, Y en P moeten positief zijn; de procentue"
        },
        {
          "page": 10,
          "words": 208,
          "exercises": [
            "3"
          ],
          "opening": "Begeleide inoefening Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening."
        },
        {
          "page": 11,
          "words": 239,
          "exercises": [
            "4",
            "
...[truncated 7602 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-probes.py

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:14.855Z`
- finished_at: `2026-09-05T18:23:14.966Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `87f651537fc0742afd69638310744c482b69e88bd86af70a8bb47aa60688a855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "reviewer": "paragraph_223_independent_review",
  "candidate_platform": "8dc54d78a222cff2225d88aae8c7d23141953cc1",
  "candidate_lessons": "b23e0056511fc5b9b10f0b8e6bbe130d2599c36b",
  "pass_0": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb",
      "pages": 15,
      "manifest_sha256": "54a684ab32f7ac453f270867d18f70ccb097cecaa7e57f337fcc199772cab25d"
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80",
      "pages": 10,
      "manifest_sha256": "43f41e2c6377e13a629ad7f8b95aa38765906ae42d871bc763ffaadca9111128"
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10",
      "pages": 7,
      "manifest_sha256": "b4b068c88c34fd00704f0a6ab3b8a9122f24c27a5b7ff2c582167968c6d75691"
    }
  ],
  "asset_inventory": [
    "2.2.3_fig_1.png",
    "2.2.3_fig_1.svg",
    "2.2.3_fig_2.png",
    "2.2.3_fig_2.svg",
    "2.2.3_fig_3.png",
    "2.2.3_fig_3.svg",
    "2.2.3_fig_4.png",
    "2.2.3_fig_4.svg"
  ],
  "independent_rational_cases": {
    "worked": {
      "Q_old": "200",
      "Q_income": "230",
      "Q_reset_price": "204",
      "percent_Q": "15",
      "percent_Y": "20",
      "Ei_exact": "3/4"
    },
    "guided_4": {
      "Q_old": "160",
      "Q_income": "180",
      "Q_reset_price": "162",
      "percent_Q": "25/2",
      "percent_Y": "20",
      "Ei_exact": "5/8"
    },
    "guided_5": {
      "Q_old": "200",
      "Q_income": "220",
      "Q_reset_price": "205",
      "percent_Q": "10",
      "percent_Y": "20",
      "Ei_exact": "1/2"
    },
    "independent_8": {
      "Q_old": "180",
      "Q_income": "200",
      "Q_reset_price": "184",
      "percent_Q": "100/9",
      "percent_Y": "20",
      "Ei_exact": "5/9"
    },
    "target_9": {
      "Q_old": "390",
      "Q_income": "420",
      "Q_reset_price": "392",
      "percent_Q": "100/13",
      "percent_Y": "10",
      "Ei_exact": "10/13"
    }
  },
  "direct_ratio_checks": 17,
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "immutable_build_manifest_sha256": "f88345226b61e9e2dd9d0ace8067caf2847280c324ab313c9b26ca8d184aa565"
}

```

### stderr excerpt

```text

```
## npm.cmd run check:governance-freshness

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:15.009Z`
- finished_at: `2026-09-05T18:23:16.147Z`
- duration_ms: `1138`
- exit_code: `0`
- stdout_sha256: `f71285d10a881f39473c8614ef246fe2aa9801c1a48a79ab177bb2bfdbfffe35`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

> 4veco-platform@1.0.0 check:governance-freshness
> node build-scripts/review-gates/check-governance-freshness.js

{
  "ok": true,
  "remote": "origin",
  "remote_ref": "origin/main",
  "origin_main_sha": "96416b6b5bd57094576e9aba0a42d682584ec479",
  "head_sha": "8dc54d78a222cff2225d88aae8c7d23141953cc1",
  "allow_policy_edit": false,
  "files": [
    "AGENTS.md",
    "AGENT_GITHUB_ENTRY.md",
    "docs/review/pr-readiness-routing-policy.md",
    "docs/review/pr-integration-lane-policy.md",
    "docs/review/pr-throughput-policy.md",
    "package.json",
    ".github/workflows/platform-ci.yml",
    "build-scripts/ci/check-branch-protection.js"
  ],
  "differing_files": [],
  "failures": []
}

```

### stderr excerpt

```text

```
## git diff --check

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:16.189Z`
- finished_at: `2026-09-05T18:23:16.245Z`
- duration_ms: `56`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## git -C ../4veco-lessen diff --check

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:16.288Z`
- finished_at: `2026-09-05T18:23:16.380Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base d180eff8924ad014c4a1f362c2b6fcbb53283e91 --head HEAD

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:24:03.322Z`
- finished_at: `2026-09-05T18:24:03.447Z`
- duration_ms: `125`
- exit_code: `0`
- stdout_sha256: `6a0d2974c25fc4c9c9855c4b1d594a7a71448bf22c77c7b87218fd327a24aaff`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 7
  - build-scripts/content/book-2/223/answers.md
  - build-scripts/content/book-2/223/check_render.py
  - build-scripts/content/book-2/223/exercises.md
  - build-scripts/content/book-2/223/target-answers.md
  - build-scripts/content/book-2/223/test_source.py
  - build-scripts/content/book-2/223/theory.md
  - build-scripts/content/book-2/b2_223.py
- generated index/report: 6
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
  - reports/internal-dashboard/dashboard-data.json
  - reports/internal-dashboard/index.html
- review evidence: 54
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/page
...[truncated 1838 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base 7f6e6622592af016e29e10ec7a9370f3f9b89ac4 --head HEAD

- cwd: `C:\wt\book2-223-independent-review-20260905\4veco-platform`
- started_at: `2026-09-05T18:24:03.502Z`
- finished_at: `2026-09-05T18:24:03.617Z`
- duration_ms: `115`
- exit_code: `0`
- stdout_sha256: `31b744f5ee0f7651ed534a7272d194f0ed3a3621c7ee7dd91fad7a8d3e4f9f14`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 21
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_4.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_4.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofds
...[truncated 86 chars]
```

### stderr excerpt

```text

```
