# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Implementation Review Round 1

Reviewer: lead-review subagent

Verdict: REQUEST_CHANGES

Findings:

1. `check-active-governance-wording.js` did not scan
   `RESEARCH_AGENT_PROMPT.md` in either repository, even though those prompts
   are active agent-facing entrypoints changed by this work.
2. `check-pptx-skill-mirror.js` guarded only
   `.claude/commands/econ-pptx-templates.md` instead of the entire retired
   `.claude/commands/**` policy surface.
3. The committed plan used a generated-index glob in the active-surface sweep
   command that is fragile in PowerShell.

Conclusion: Core deletion and integration-lane wording were directionally
right, but checker coverage needed hardening before PR creation.
