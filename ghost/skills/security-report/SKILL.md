---
name: security-report
description: Compile all audit outputs into a severity-rated, remediation-first security decision report.
metadata:
  category: security
  layer: report
  version: "1.0.0"
  allowed_tools: read,cli,memory
---

# Security Report

## Purpose
Transform scan and probe outputs into an executive-ready security report.

## Execution Instructions
1. Aggregate findings from contradiction, boundary, scope, and completeness stages.
2. De-duplicate overlapping findings and preserve the highest severity path.
3. For each finding, provide:
   - Evidence
   - Exploitability narrative
   - Business impact
   - Concrete remediation
   - Validation step after patch
4. Create a prioritized remediation backlog ordered by risk reduction per effort.
5. Produce a release verdict:
   - Ship
   - Ship with Conditions
   - Do Not Ship

## Output Format
- Executive summary (5 bullets max)
- Severity breakdown (Critical/High/Medium/Low counts)
- Detailed findings table:
  - ID
  - Category
  - Severity
  - Evidence
  - Fix
  - Validation
- Remediation roadmap (Now, Next, Later)
- Final release verdict with justification
