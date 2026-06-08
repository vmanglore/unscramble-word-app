# Codex Release Audit Rules

Purpose:
Define the repeatable audit process Codex must use to evaluate release readiness. This document does not define product behavior.

## Source-of-Truth Hierarchy
When evidence conflicts, use this order:

1. `docs/rules/*`
2. Regression tests
3. `docs/roadmap/*`
4. Implementation

Implementation is not automatically correct. Treat implementation as evidence of current behavior only, and escalate conflicts against higher sources.

## Audit Process
1. Identify release scope from roadmap and changed files.
2. Map each scoped behavior to applicable rules and regression tests.
3. Compare roadmap intent, test coverage, and implementation against the hierarchy.
4. Record only evidence traceable to files, commands, or observed behavior.
5. Classify every finding by severity.
6. Produce the Release Audit output before recommending readiness.

## Required Audit Sections
Each Release Audit must include:

1. Scope Reviewed
2. Sources Checked
3. Rule Compliance
4. Regression Coverage
5. Roadmap Alignment
6. Implementation Findings
7. Conflicts and Gaps
8. Severity Summary
9. Required Actions
10. Release Readiness Decision

## Severity Levels
Critical:
A product-rule violation, data integrity issue, release-blocking regression, or source-of-truth conflict that could ship incorrect behavior.

High:
A likely user-visible defect, missing regression protection for changed behavior, or unmet roadmap commitment.

Medium:
An incomplete audit trail, unclear requirement mapping, weak evidence, or non-blocking discrepancy.

Low:
A documentation, naming, formatting, or process issue that does not affect release behavior or test confidence.

## Evidence Standards
Audit evidence must be specific, reproducible, and attributable.

Required evidence includes one or more of:

- File path and relevant section, rule ID, test name, or line range.
- Exact command run and pass, fail, or warning result.
- Observed UI or runtime behavior with reproduction steps.
- Explicit note when evidence is absent or inconclusive.

Do not rely on assumptions, implementation alone, or undocumented intent as proof of correctness.

## Release Audit Output Format
Use this structure for every future release:

```md
# Release Audit: <release name or version>

## Scope Reviewed
- <roadmap items, changed areas, and excluded areas>

## Sources Checked
- Rules: <files reviewed>
- Regression tests: <tests reviewed or run>
- Roadmap: <files reviewed>
- Implementation: <files reviewed or behavior observed>

## Findings
| Severity | Area | Finding | Evidence | Required Action |
| --- | --- | --- | --- | --- |
| <level> | <area> | <finding> | <evidence> | <action> |

## Conflicts and Gaps
- <source-of-truth conflicts, missing tests, or inconclusive evidence>

## Severity Summary
- Critical: <count>
- High: <count>
- Medium: <count>
- Low: <count>

## Release Readiness Decision
<Ready / Ready with noted follow-ups / Not ready>

## Required Actions Before Release
- <blocking actions, if any>
```
