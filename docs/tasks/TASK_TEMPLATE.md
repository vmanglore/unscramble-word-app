# Codex Task Template

Project:
<PROJECT_NAME>

Branch:
<BRANCH_NAME>

Task:
<TASK_NAME>

Goal:
<SHORT_DESCRIPTION>

---

# Documentation-Driven Development

Documentation and business rules are the source of truth.

Before implementation begins, all applicable documentation must be reviewed.

Follow all requirements defined in:

* docs/rules/09-codex-workflow.md
* Applicable business rules
* Applicable specifications
* Applicable roadmap documents

Do not implement behavior that contradicts documented requirements.

---

# Phase 1 - Documentation Review

Review:

* docs/INDEX.md
* Applicable roadmap documents
* Applicable specifications
* Applicable rule documents
* Any documents directly related to this task

Report:

1. Documents reviewed
2. Rules applied
3. Documentation gaps discovered
4. Documentation updates potentially required

---

# Phase 2 - Current State Audit

Review the current implementation.

Identify:

1. Relevant components
2. Relevant services
3. Relevant routes
4. Existing behavior
5. Existing limitations
6. Existing tests

Determine whether the requested functionality already exists partially or completely.

Do not modify code during this phase.

---

# Phase 3 - Gap Analysis

Compare:

Current State

vs

Desired State

Identify:

* Missing functionality
* Documentation conflicts
* Architecture concerns
* Risks
* Dependencies

Report findings before implementation.

---

# Phase 4 - Implementation

Implement only the approved scope.

Requirements:

<IMPLEMENTATION_REQUIREMENTS>

Constraints:

<IMPLEMENTATION_CONSTRAINTS>

Out of Scope:

<OUT_OF_SCOPE_ITEMS>

Do not expand scope automatically.

Future opportunities should be documented rather than implemented.

---

# Phase 5 - Validation

Run:

npm run lint

npm run build

Run all applicable tests.

Perform manual verification where appropriate.

Verify:

* No regressions
* No build errors
* No console errors
* No hydration errors
* Existing functionality remains intact

---

# Phase 6 - Documentation Impact Assessment

Determine whether documentation updates are required.

Potential updates:

* Rules
* Specifications
* Architecture
* Roadmap
* Release Plans
* Feature Backlog
* Audit Documents

Update documentation when required.

If no documentation updates are required, explain why.

---

# Deliverables

Provide:

1. Documentation Review Summary
2. Current State Audit Summary
3. Gap Analysis Summary
4. Implementation Summary
5. Files Changed
6. Validation Results
7. Documentation Updates
8. Future Opportunities Identified
9. Risks or Follow-up Work

---

# Completion Criteria

Task is complete only when:

* Code is implemented.
* Validation passes.
* Documentation is updated if required.
* Documentation and implementation are consistent.
* Deliverables are provided.
