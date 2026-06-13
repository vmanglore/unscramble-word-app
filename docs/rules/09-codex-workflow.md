# Codex Workflow Rules

CW-001

Before changing code, review relevant rule documents.

CW-002

Do not modify behavior that violates existing rules.

CW-003

When changing behavior:

1. Update rules
2. Update tests
3. Update code

CW-004

Every PR should include:

Summary

Files Changed

Tests Added

Behavior Impact

CW-005

Preview deployment should be reviewed before merge.

CW-006

Merged branches should be deleted.

CW-007

Business rules are the source of truth.

---

CW-008

Before implementation begins, review applicable documentation.

At minimum:

1. docs/INDEX.md
2. Applicable roadmap documents
3. Applicable specifications
4. Applicable rule documents

Documented behavior takes precedence over assumptions.

---

CW-009

All implementation tasks should follow this sequence:

1. Documentation Review
2. Current State Audit
3. Gap Analysis
4. Implementation
5. Validation
6. Documentation Updates

---

CW-010

If documentation conflicts with implementation:

1. Do not assume implementation is correct.
2. Document the discrepancy.
3. Recommend a resolution.
4. Align implementation with documented behavior unless otherwise approved.

---

CW-011

Every Codex task should identify:

1. Documents reviewed
2. Rules applied
3. Documentation gaps discovered

This information should be included in the task report when practical.

---

CW-012

If a future opportunity is discovered during implementation:

1. Do not automatically expand scope.
2. Document the finding.
3. Add the item to FEATURE_BACKLOG.md.
4. Reference the current release plan if relevant.
5. Evaluate for a future release.

---

CW-013

Implementation should be scoped to the approved task.

Nice-to-have enhancements, UX ideas, future features, and architectural opportunities should be documented rather than added to the current task unless explicitly approved.

---

CW-014

Before opening a PR:

1. Run npm run lint
2. Run npm run build
3. Perform manual validation of affected functionality
4. Verify documentation updates have been completed when required

Local validation is required even if Codex has already performed validation in a sandbox environment.


CW-015

Issue Resolution Documentation Review

When an issue, gap, architectural concern, UX finding, audit finding,
or product decision is identified, contributors must determine whether
project documentation requires updates.

Potential documentation targets include:

* Rules
* Specifications
* Architecture
* Roadmap
* Release Plans
* Feature Backlog
* Research Documents
* Audit Reports

Documentation should be updated before the issue is considered fully resolved.

---

CW-016

Documentation Impact Assessment

Every implementation task should evaluate:

1. What documentation was reviewed?
2. What documentation must be updated?
3. What documentation is affected by the change?
4. What future documentation should be created?

Task reports should identify documentation impacts even when no updates are required.

---

CW-017

Documentation and Implementation Consistency

A change is not considered complete until:

* Code is updated.
* Tests are updated when applicable.
* Relevant documentation is updated.
* Documentation and implementation are consistent.

Known exceptions must be documented explicitly.

---

CW-018

Temporary Policies and Workarounds

When a temporary implementation, workaround, exception, or transitional policy is introduced:

1. Document the reason.
2. Document the intended future replacement.
3. Reference the related architecture or roadmap document.
4. Add a backlog item if future work is required.

Temporary solutions should not become permanent undocumented behavior.

---

CW-019

Architecture Alignment

When an audit identifies that a limitation is caused by missing architecture or metadata rather than an implementation defect:

1. Document the architectural gap.
2. Update the appropriate architecture or specification documents.
3. Avoid implementing behavior that requires unavailable metadata.
4. Prefer roadmap and architecture updates over speculative implementation.

Example:

* Missing word classification metadata should be addressed through the Word Knowledge Layer rather than hard-coded classification rules.
