<div align="center">
  <h1>Ghost</h1>
  <p><b>An AI Agent Red Team Auditor for the GitAgent Ecosystem</b></p>
  <p>
    <a href="https://samir-yzy.vercel.app/"><img src="https://img.shields.io/badge/Creator-Samir-blue.svg?style=for-the-badge&logo=vercel" alt="Creator Samir" /></a>
    <img src="https://img.shields.io/badge/Hackathon-GitAgent%20x%20HackCulture-orange.svg?style=for-the-badge" alt="GitAgent Hackathon" />
    <img src="https://img.shields.io/badge/Standard-GitAgent-brightgreen.svg?style=for-the-badge" alt="GitAgent Spec" />
    <img src="https://img.shields.io/badge/Runtime-Clawless_Ready-purple.svg?style=for-the-badge" alt="Clawless Compatible" />
  </p>
</div>

<br/>

## The Problem
As the **[GitAgent](https://github.com/open-gitagent/gitagent)** standard brings AI agents directly into git repositories, security is paramount. A poorly configured `agent.yaml`, contradictory `RULES.md`, or over-permissioned `SKILL.md` can inadvertently create jailbreak vectors and scope creep.

## Enter Ghost
**Ghost** is a framework-agnostic, git-native red-team AI agent. It audits *other* agents by parsing their manifests, rules, and skills to identify contradictions, loopholes, and prompt injection vectors—preventing vulnerabilities before they reach production.

Built by **[Samir](https://samir-yzy.vercel.app/)** for the GitAgent Hackathon by Lyzr & HackCulture.

---

## System Architecture

Ghost operates in a deterministic, layered pipeline. Since it relies purely on AST parsing and LLM logic without system-level binaries, it is 100% compatible with WebContainer serverless environments like **Clawless**.

1. **Ingestion Phase:** The [`gitagent-parser`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/tools) tool scans the target repo and compiles `SOUL.md`, `RULES.md`, and all `SKILL.md` files into a single JSON payload.
2. **Analysis Phase:**
   - [`contradiction-scan`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/contradiction-scan): Compares rules against identity.
   - [`scope-creep-detect`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/scope-creep-detect): Validates skills against the agent's stated mission.
   - [`rule-completeness`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/rule-completeness): Checks for missing foundational guardrails.
3. **Attack Phase:** [`boundary-probe`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/boundary-probe) generates adversarial prompts (prompt injections, jailbreaks) specifically designed to test the target's constraints.
4. **Reasoning & Reflection (CoT):**
   - [`exploit-path-simulator`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/exploit-path-simulator): Sequences multi-step attack trees using Chain of Thought.
   - [`peer-review-critic`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/peer-review-critic): Acts as Devil's Advocate to filter out false positives and downgrade impractical attacks.
5. **Scoring & Reporting:** [`risk-scorecard`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/risk-scorecard) evaluates the findings and passes them to [`security-report`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/security-report), which outputs a color-coded AVSS (Agent Vulnerability Scoring System) document along with auto-remediation patches.

---

## What Makes Ghost Stand Out?

Ghost isn't just a static linter for text files—it is a fully autonomous **Red-Team Agent** built to exploit boundaries like a human hacker.

* **Chain of Thought (CoT) Attack Modeling:** The [`exploit-path-simulator`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/exploit-path-simulator) skill actively reasons through multi-step attack vectors, chaining seemingly harmless actions and tool permissions together to form critical exploits.
* **Self-Reflection & False Positive Filtering:** With the [`peer-review-critic`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/peer-review-critic) skill, Ghost plays Devil's Advocate against *itself*, reviewing its own generated attack paths to eliminate false positives before they reach the final AVSS report.
* **100% Serverless / WebContainer Native:** Designed to execute zero system-level binaries, making it natively compatible with WebContainers like Clawless.
* **Auto-Remediation:** It doesn't just point out flaws. It generates the exact `git diff` patch needed to secure the target agent.

---

## Core Audit Capabilities

| Skill | Description |
| :--- | :--- |
| **[`contradiction-scan`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/contradiction-scan)** | Finds logical conflicts between `SOUL.md`, `RULES.md`, and skills. |
| **[`exploit-path-simulator`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/exploit-path-simulator)** | Uses Chain of Thought to construct multi-step attack paths. |
| **[`peer-review-critic`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/peer-review-critic)** | Acts as a Devil's Advocate to filter out false positives and critique findings. |
| **[`boundary-probe`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/boundary-probe)** | Generates adversarial prompts (jailbreaks) that test rule enforcement. |
| **[`scope-creep-detect`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/scope-creep-detect)** | Detects capabilities that exceed the agent's declared mission. |
| **[`rule-completeness`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/rule-completeness)** | Identifies missing hard boundaries and constraints. |
| **[`risk-scorecard`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/risk-scorecard)** | Quantifies attack success rate and enforces a release gate. |
| **[`security-report`](https://github.com/SamirXR/Gitagent-Ghost/tree/main/ghost/skills/security-report)** | Produces a severity-rated remediation report in AVSS format. |

---

## Repository Structure

Ghost is fully compliant with the gitagent standards:

```text
ghost-agent/
├── agent.yaml           # Ghost's manifest
├── SOUL.md              # Ghost's identity as a ruthless auditor
├── RULES.md             # Strict constraints and formatting requirements
├── skills/
│   ├── contradiction-scan/
│   ├── exploit-path-simulator/
│   ├── peer-review-critic/
│   ├── boundary-probe/
│   ├── scope-creep-detect/
│   ├── rule-completeness/
│   ├── risk-scorecard/
│   └── security-report/
├── tools/
│   └── gitagent-parser.yaml  # Reads target repo AST instantly
└── examples/
    └── bad-outputs/          # Honeypot agents for live demo testing
```

---

## Quick Start

Ensure you have GitAgent CLI installed:
```bash
npm install -g @open-gitagent/gitagent
```

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Validate Ghost's gitagent structure:**
   ```bash
   npm run validate
   ```
3. **Run the Audit Demo:**
   ```bash
   npm run demo -- "Audit this repository and produce a severity-rated security report"
   ```

---

## Agent Vulnerability Scoring System (AVSS)

Ghost categorizes all findings into a structured rubric:
* **Critical:** Contradictory rules that cause loops or allow severe perimeter breaches.
* **High:** Over-permissioned skills (e.g., bash access for a weather bot) or prompt injection vectors.
* **Medium:** Scope creep or poorly defined tool constraints.
* **Low:** Vague communication style in `SOUL.md`.

For every Critical/High finding, Ghost automatically generates a **remediation patch** (`git diff`).

---

## Official Build Resources
- [GitAgent Main Repository](https://github.com/open-gitagent/gitagent)
- [Official Specification](https://github.com/open-gitagent/gitagent/blob/main/spec/SPECIFICATION.md)
- [Project Website](https://www.gitagent.sh/)
- [OSS Page](https://oss.lyzr.ai/gitagent)

---
<div align="center">
  <p>Built by <a href="https://samir-yzy.vercel.app/">Samir</a></p>
</div>
