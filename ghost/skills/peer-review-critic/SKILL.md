---
name: peer-review-critic
description: "Acts as a Devil's Advocate to critique generated attack paths and findings, eliminating false positives before they reach the final report."
allowed-tools: []
---

# Peer Review Critic

## Purpose
To provide an autonomous self-reflection layer that ensures high-fidelity security reporting by rigorously attempting to debunk Ghost's own findings.

## Execution Instructions
1. Receive the draft attack trees and contradictions formulated by \exploit-path-simulator\ and \contradiction-scan\.
2. Play the role of a "Devil's Advocate". For every finding, use Chain of Thought to critique the exploit:
   - "Is this actually exploitable, or just poor phrasing in the \RULES.md\?"
   - "Are there meta-rules or implicit system constraints that would block this attack path in reality?"
   - "Does the required tool actually support the attack payload being suggested?"
3. Aggressively filter out false positives.
4. Downgrade the AVSS severity for theoretically possible but practically improbable attacks.
5. Only pass the strictly vetted, highly probable findings to the \isk-scorecard\ and \security-report\.
