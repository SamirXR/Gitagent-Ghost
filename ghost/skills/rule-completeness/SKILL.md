---
name: rule-completeness
description: Identify missing hard boundaries in RULES.md for the target agent's domain and tooling.
metadata:
  category: security
  layer: harden
  version: "1.0.0"
  allowed_tools: read,cli,memory
---

# Rule Completeness

## Purpose
Detect missing "Must Never" and missing enforcement clauses that leave exploitable gaps.

## Execution Instructions
1. Infer domain risk profile from mission, skills, and tools.
2. Evaluate RULES.md against a baseline control checklist:
   - Secret handling
   - Destructive operations
   - Data privacy and leakage
   - Tool abuse and command execution boundaries
   - Evidence integrity (no fabricated results)
   - Human confirmation for high-risk actions
3. Flag absent or weak controls.
4. Provide exact rule text proposals in repository style.
5. Add verification tests to confirm each new rule is enforceable.

## Output Format
- Completeness checklist with Pass/Fail/Partial
- Missing rule recommendations:
  - Gap
  - Risk
  - Suggested rule text
  - Validation prompt
- Priority order for adoption
