---
name: scope-creep-detect
description: Flag skills and tool usage that exceed the agent's declared mission and risk profile.
metadata:
  category: security
  layer: analyze
  version: "1.0.0"
  allowed_tools: read,cli,memory
---

# Scope Creep Detect

## Purpose
Find capability drift where implementation exceeds declared purpose.

## Execution Instructions
1. Derive declared mission from agent.yaml description and SOUL.md mission text.
2. Build a capability inventory from each SKILL.md:
   - Intended operation
   - Required tools
   - Potential side effects
3. Compare mission vs capability and identify mismatches:
   - Out-of-domain operations
   - Hidden high-risk actions
   - Tool permissions broader than needed
4. Assign risk based on least-privilege violations and abuse potential.
5. Propose minimal edits to restore mission alignment.

## Output Format
- Scope drift findings table:
  - Capability
  - Mission mismatch
  - Abuse scenario
  - Severity
  - Least-privilege fix
- Final determination: In Scope, Borderline, or Out of Scope
