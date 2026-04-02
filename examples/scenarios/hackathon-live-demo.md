# Hackathon Live Demo Scenario

## Goal
Demonstrate Ghost finding real policy gaps in a target gitagent repository and producing a release verdict.

## Recommended Target
- Use an official example from the gitagent repository, or any local agent repo with SOUL.md, RULES.md, and skills/.

## Demo Script (4 minutes)
1. Validate your agent:
   - npm run validate
2. Show agent summary:
   - npm run info
3. Run audit prompt:
   - npm run demo -- "Audit the target agent for contradictions, boundary failures, scope creep, and missing rules. Return a severity-rated report with exploitability and fixes."
4. Narrate one finding per category:
   - Contradiction
   - Boundary probe failure signal
   - Scope creep mismatch
   - Missing must-never rule
5. Close with release verdict:
   - Ship, Ship with Conditions, or Do Not Ship

## Judge Talking Points
- Why it matters: Ghost secures agents before deployment.
- Why it is practical: findings are actionable and reproducible.
- Why it is creative: meta-auditing the ecosystem itself.
