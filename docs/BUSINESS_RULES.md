# Business Rules

Status: Active

Purpose:

This document is the business rules entry point for Codex, developers, and future maintainers.

All official product rules and behavioral requirements are maintained under:

```text
docs/rules/
```

This file should not duplicate detailed rules. It should help contributors find the correct rule documents before making changes.

---

# Required Reading Before Implementation

Before changing product behavior, Codex should review:

```text
docs/INDEX.md
docs/DOCUMENTATION_MAINTENANCE_PROCESS.md
docs/rules/README.md
```

Then review the specific rule files related to the task.

---

# Available Rule Documents

* [`docs/rules/README.md`](rules/README.md) — Product Rules Overview
* [`docs/rules/01-product-principles.md`](rules/01-product-principles.md) — Product Principles
* [`docs/rules/02-search-behavior.md`](rules/02-search-behavior.md) — Search Behavior Rules
* [`docs/rules/03-word-quality.md`](rules/03-word-quality.md) — Word Quality Rules
* [`docs/rules/04-filters.md`](rules/04-filters.md) — Filter Rules
* [`docs/rules/05-seo.md`](rules/05-seo.md) — SEO Rules
* [`docs/rules/06-user-experience.md`](rules/06-user-experience.md) — User Experience Rules
* [`docs/rules/07-data-dictionary.md`](rules/07-data-dictionary.md) — Data and Dictionary Rules
* [`docs/rules/08-testing-regression.md`](rules/08-testing-regression.md) — Testing and Regression Rules
* [`docs/rules/09-codex-workflow.md`](rules/09-codex-workflow.md) — Codex Workflow Rules
* [`docs/rules/10-regression-history.md`](rules/10-regression-history.md) — Regression History
* [`docs/rules/CODEX_AUDIT_RULES.md`](rules/CODEX_AUDIT_RULES.md) — Codex Audit Rules

---

# Documentation Requirement

Every major implementation task must include a documentation impact review.

See:

```text
docs/DOCUMENTATION_MAINTENANCE_PROCESS.md
```

If documentation changes are required, update the affected documents.

If no documentation changes are required, state:

```text
Documentation impact reviewed.
No documentation updates required.
```

---

# Source of Truth Rule

When rules, documentation, and implementation disagree:

1. Product rules define expected behavior.
2. Documentation defines intended direction.
3. Implementation should be updated to match the approved rules and documentation.

Do not silently change behavior without updating the relevant rules or documentation.
