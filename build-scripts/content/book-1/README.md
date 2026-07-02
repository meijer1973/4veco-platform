# Book 1 Content Scripts

Store reusable Book 1 content builders here when the first companion MVP
produces stable reference scripts.

Keep filenames paragraph-scoped where useful, for example:

- `b1-111-presentation-v2-model.js`
- `b1-112-presentation-v2-model.js`
- `b1-113-presentation-v2-model.js`
- `b1-111-samenvatting.js`
- `b1-111-opgaven.js`

Presentation V2 decks are registered in `presentation-v2-registry.js` and
built through `build-presentation-v2.js --all`. The active registered deck set
is `b1-111`, `b1-112`, and `b1-113`; keep paragraph wrappers such as
`b1-111-presentation-v2.js` only as compatibility entrypoints.

Older `*-presentatie.js` scripts and `convert_presentatie.py` are legacy
Office/full-package surfaces. Do not extend them for new semantic-model-driven
web/PPTX presentations unless the requested product explicitly needs that
legacy path.
Do not place generated output in this directory.
