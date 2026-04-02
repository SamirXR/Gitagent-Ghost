# Risk Assessment

## Agent
- Name: ghost
- Version: 0.1.0
- Risk tier: standard

## Scope
Ghost performs policy and security audits for gitagent repositories. It does not execute production side effects, financial transactions, or account actions.

## Risk Profile
- Primary risk: inaccurate or unverifiable findings that could mislead release decisions.
- Secondary risk: potential leakage of sensitive data if source content is included without redaction.

## Existing Controls
- Evidence-first reporting is required in RULES.md.
- Communications controls enforce fair and non-misleading language.
- Data governance requires PII redaction and confidential handling.
- Segregation of duties enforces maker/checker split for final verdict publication.
- Audit logging and retention are enabled in compliance settings.

## Residual Risk
Residual risk is medium-low after controls, with ongoing quarterly validation and monthly communications/recordkeeping reviews.

## Next Review
- Cadence: quarterly
- Owner: repository-owner
