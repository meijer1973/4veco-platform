# Roadmap Versioning

This folder tracks roadmap versions and old roadmap snapshots for future reference.

## Canonical Rule

Live roadmap files stay at their operational paths. For the references team, the live file is:

```text
references/reference-team-roadmap.md
```

Old roadmap snapshots belong under:

```text
docs/roadmaps/outdated/
```

Human-review proposals and comparison documents may stay in `knowledge/` when they are part of a review bundle, but they must be listed in the version index if future agents might confuse them with the live roadmap.

## Version Index

Use these files before interpreting roadmap status:

```text
docs/roadmaps/roadmap-version-index.json
docs/roadmaps/roadmap-version-index.md
```

The JSON file is the machine-readable index. The Markdown file is the human-readable projection.

## Status Values

- `active`: current operational roadmap.
- `outdated`: superseded roadmap snapshot stored in `docs/roadmaps/outdated/`.
- `historical_input`: review, proposal, or old planning source kept for context.
- `pointer`: compatibility note that points from an old path to a new archived path.

## Update Procedure

When a roadmap is replaced:

1. Move the superseded roadmap snapshot to `docs/roadmaps/outdated/`.
2. If old reports point to the previous path, leave a short pointer file at the previous path.
3. Add or update an entry in `roadmap-version-index.json`.
4. Update `roadmap-version-index.md`.
5. Run:

```bash
node build-scripts/references/check-roadmap-version-index.js
```

