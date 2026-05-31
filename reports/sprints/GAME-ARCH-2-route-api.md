# Sprint GAME-ARCH-2: Route-Layer API

Generated: 2026-05-31

## Purpose

Define the canonical route-layer contract that graph/table, math/calculation,
reasoning, advisory short-check, target-equivalent checkpoint, procedure, and
landing surfaces should consume.

Current implementation evidence:

- `engines/skill-map-engine.js` owns shared route request normalization,
  aspect normalization, view-model construction, progress summary, warnings,
  and boundary flags.
- `engines/skill-map-route-ui.js` renders route view models and local-only
  boundary text.
- `SkillMapRouteUI.getRouteOptions(surfaceKey, defaults, data)` resolves
  `skillMapRoutes` by surface.
- Current consumers include graph, skilltree calculation, reasoning,
  procedure support, and exit-ticket shells.

## Route Request Shape

The route request should remain a small, serializable object.

Primary owner: `engines/skill-map-engine.js`, especially
`SkillMapEngine.createRequest(surface, options)` and
`SkillMapEngine.buildViewModel(config)`.

| Field | Type | Owner | Required | Purpose |
|---|---|---|---|---|
| `paragraph` | string | surface wrapper | yes | Current paragraph, for example `1.1.2` |
| `surface` | string | surface wrapper | yes | `landing`, `graphical`, `calculation`, `reasoning`, `procedure`, `checkpoint`, or `short_check` |
| `mode` | string | route layer | yes | `compact`, `route`, or reviewed restricted-full mode |
| `aspectFilter` | string | route layer / surface | yes | `reasoning`, `calculation`, `graphical`, `checkpoint`, or `mixed` |
| `maxVisibleAvailable` | number | route layer | no | Keeps route panels calm |
| `targetOperationChainId` | string | future target-chain layer | no | Links route to reviewed operation-chain coverage |
| `primaryAction` | object | route config | yes | Student-facing practice/check link |
| `enabled` | boolean | route config | no | Allows a surface to hide route panel when not reviewed |

## Route View Shape

The route layer should return a view model with student-facing fields only.

Primary owner: `engines/skill-map-engine.js`. Primary renderer:
`engines/skill-map-route-ui.js`.

| Field | Type | Required | Student-facing use |
|---|---|---|---|
| `title` | string | yes | Route panel heading |
| `paragraphTarget` | string | yes | What the paragraph route is preparing |
| `routePurpose` | string | yes | Why this practice/check surface matters |
| `aspectFilter` | string | yes | Route category label |
| `visibleSkills` | array | yes | Relevant skill labels and local states |
| `recommendedSkillId` | string | no | Finds the student-facing focus label |
| `primaryAction` | object | yes | Button/link label and href |
| `collapsedCounts` | object | no | Explains hidden route items calmly |
| `boundaryText` | string | yes | Local-only progress boundary |

`visibleSkills` may include internal IDs in data, but rendered route panels may
not expose internal IDs. Student-facing labels must come from route catalog or
skill display names.

## Required Boundary Flags

Every route view must preserve these flags:

```json
{
  "diagnostics": false,
  "adaptiveRouting": false,
  "masteryDecisions": false,
  "automaticSequencing": false,
  "studentFacingAI": false,
  "summativeUse": false,
  "pvProjection": false,
  "pvMachinePromotion": false,
  "studentProductUse": false,
  "targetEquivalentProof": false
}
```

Target-equivalent proof status is never inferred from route progress. It may
only appear after the separate target-equivalent checkpoint gate authorizes it.

## Consumers

| Consumer | Current route state | Required architecture rule |
|---|---|---|
| Landing page | Shows practice and optional check sections | Should ask route layer for recommended practice/check actions instead of hard-coding advice copy |
| Graph/table route | Uses `graphical` route options and shared panel | Keep as reference route consumer |
| Math/calculation route | Uses `calculation` route options in skilltree | Refactor around target-operation chain IDs |
| Reasoning route | Uses `reasoning` route options in sidebar | Refactor around answer-form route tags |
| Procedure support | Uses calculation route options as support | Keep support role; do not become primary math route |
| Advisory short check | Uses checkpoint-style local scope | Must set target-equivalent proof false |
| Target-equivalent checkpoint | Future consumer | Must link to reviewed complete operation chain before completion language |

## Events For Future Implementation

These are planning events, not implementation authorization:

| Event | Emitted by | Stored? | Meaning |
|---|---|---|---|
| `route_viewed` | route panel | no persistent proof | Student saw route context |
| `practice_action_selected` | route panel / landing | no proof | Student opened a route |
| `local_focus_updated` | route layer | local only | Route recommends what to practise next |
| `short_check_advice_ready` | advisory check | local only | Non-binding advice can be shown |
| `target_equivalent_result_ready` | future exit ticket | gated | Only after target-equivalent implementation/gate |

## Extension Rule

If a future surface needs route behavior not covered here, it must extend the
route API first. It must not add a separate route/progress grammar inside a
domain engine.
