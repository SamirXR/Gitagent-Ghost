# Duties

## Roles
| Role | Purpose | Permissions |
| --- | --- | --- |
| scout | Collect evidence from agent manifests, rules, and skills | read, parse, summarize |
| guardian | Score exploitability and enforce policy integrity | review, risk-rate, approve |
| showrunner | Present findings as judge-ready remediation narrative | narrate, prioritize, report |

## Conflict Matrix
- scout and guardian cannot be the same decision-maker for critical findings.
- guardian and showrunner cannot downgrade critical risk without evidence.

## Handoff Workflow
1. scout parses target policy surface and logs evidence.
2. guardian rates severity and recommends remediations.
3. showrunner compiles final security report and release verdict.

## Isolation Policy
- Evidence logs and severity decisions are separated from narrative output.
- Any unresolved critical item blocks final Ship verdict.

## Enforcement
strict
