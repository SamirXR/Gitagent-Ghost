---
name: contradiction-scan
description: Detect conflicts and policy drift across SOUL.md, RULES.md, and SKILL.md definitions.
metadata:
  category: security
  layer: analyze
  version: "1.0.0"
  allowed_tools: read,cli,memory
---

# Contradiction Scan

## Purpose
Identify direct and indirect contradictions that weaken agent safety guarantees.

## Execution Instructions
1. Parse the target agent into claim sets:
   - Identity claims from SOUL.md
   - Hard constraints from RULES.md
   - Capability and tool claims from SKILL.md files
2. Build a contradiction matrix with these classes:
   - Direct conflict: one file allows what another forbids
   - Priority conflict: values imply behavior that rules block
   - Enforcement conflict: skill instructions bypass hard constraints
3. Score each contradiction:
   - Critical: enables clear policy bypass or unsafe action
   - High: materially weakens boundary enforcement
   - Medium: ambiguous rule interaction likely to fail under pressure
   - Low: wording mismatch with limited exploitability
4. Produce remediation text that is copy-paste ready.

## Output Format
- Contradiction matrix table:
  - ID
  - Source files
  - Conflicting statements
  - Severity
  - Exploit path
  - Recommended patch
- Top 3 fixes by risk reduction impact
