# Release 1.1 Execution Plan

## Release Goal

Release 1.1 is a production-readiness hardening release for the Unscramble Word App. The release goal is to make the current search, word-quality, SEO, and browse-page surfaces safe to ship by resolving the release-blocking findings from `docs/roadmap/RELEASE_1_1_AUDIT.md` without expanding product scope.

Release 1.1 is ready only when:

- Regression tests can be run through a reliable release command.
- Tests explicitly map behavior to product rule IDs.
- Core search results are backed by the approved dictionary source, never generated arbitrarily, and keep uncommon valid dictionary words available.
- Ranking behavior is defined, tested, and aligned with human usefulness.
- Major pages emit canonical URLs and are represented in sitemap policy.
- The product decision for `/unscramble/[letters]` search semantics is documented and protected by tests.
- Large browse pages remain useful, mobile-friendly, and performant.
- Follow-up technical debt is either completed where low-risk or explicitly deferred after guardrails are in place.

## Source Inputs

This plan is based on the following source hierarchy and evidence:

1. Product rules in `docs/rules/*`, with `docs/rules/CODEX_AUDIT_RULES.md` defining audit/evidence expectations.
2. Existing regression coverage in `tests/unscrambleSearch.test.ts`.
3. Release findings in `docs/roadmap/RELEASE_1_1_AUDIT.md`.
4. Current implementation files across `app/`, `components/`, `lib/`, `data/compiled/`, and `package.json`.

## Priority Order

| Priority | Workstream | Release Purpose | Risk | Must Ship in 1.1? |
| --- | --- | --- | --- | --- |
| P0 | Regression test foundation | Create trustworthy proof before changing behavior. | High | Yes |
| P1 | Dictionary-backed result integrity | Resolve the Critical business-rule violation. | Critical | Yes |
| P2 | Ranking improvements | Make top results useful and prevent RH-005 regressions. | High | Yes |
| P3 | Canonical URLs | Satisfy SEO-002 for major pages. | High | Yes |
| P4 | Sitemap coverage | Satisfy SEO-003 or document intentional exclusions. | High | Yes |
| P5 | Search behavior consistency decision | Resolve ambiguity between subset search and exact dynamic route behavior. | Medium | Yes |
| P6 | Browse-page UX/performance | Reduce broad-route response-size and mobile usability risk. | Medium | Should ship if implementation risk is controlled |
| P7 | Technical debt cleanup | Consolidate duplicated logic and metadata drift after behavior is protected. | Low/Medium | Optional unless needed by earlier tasks |

## Dependency Map

```text
P0 Regression test foundation
  ├── blocks P1 dictionary-backed result integrity
  ├── blocks P2 ranking improvements
  ├── blocks P3 canonical URL verification
  ├── blocks P4 sitemap verification
  ├── blocks P5 search-behavior decision tests
  └── should precede P6/P7 implementation changes

P1 Dictionary-backed result integrity
  └── blocks final P2 ranking validation because ranking must not promote excluded entries

P2 Ranking improvements
  └── should precede final UX validation for search-result usefulness

P3 Canonical URLs
  └── can run in parallel with P4 after P0 metadata/route test utilities exist

P4 Sitemap coverage
  └── depends on P5 if sitemap policy differs for exact-anagram vs subset-search pages

P5 Search behavior consistency decision
  ├── informs dynamic route implementation/tests
  └── informs canonical/sitemap route policy for `/unscramble/[letters]`

P6 Browse-page UX/performance
  └── should follow P0 and should not change SEO decisions from P3/P4

P7 Technical debt cleanup
  └── should happen only after P0-P6 regression coverage is stable
```

## Task Sequence

### Task 1 — Establish the Regression Test Foundation

**Priority:** P0  
**Risk level:** High  
**Primary objective:** Make regression tests reliable, discoverable, and traceable to rule IDs before behavior changes are made.

#### Scope

- Add a dependable `npm test` or equivalent release-check script that can run TypeScript tests with the `@/` path alias.
- Expand the test harness only as much as needed to cover Release 1.1 behavior.
- Add rule-ID references to test names, comments, or table descriptions to satisfy TR-004.
- Preserve `npm run lint` and `npm run build` as required release checks.

#### Dependencies

- None. This is the first implementation task.
- Must be complete before accepting behavior-changing code for search, ranking, SEO, or browse UX.

#### Acceptance Criteria

- `package.json` exposes a reliable test command, preferably `npm test`.
- The existing `tests/unscrambleSearch.test.ts` test file runs successfully through the release test command.
- Test output fails non-zero on assertion failure.
- Tests include explicit rule-ID references for covered rules, including at minimum SB-002, SB-003, SB-004, SB-005, FLT-002, FLT-006, FLT-007, TR-004, and applicable RH IDs.
- Release verification documentation identifies the required commands: `npm test`, `npm run lint`, and `npm run build`.

#### Regression Tests Required

- Existing alphabet subset search coverage for SB-002/SB-003/RH-001/RH-004.
- Existing `aelpp -> apple` exact-anagram coverage for SB-001.
- Existing blank-filter and placeholder coverage for SB-004/SB-005/FLT-006/RH-002.
- New combined-filter AND coverage for FLT-007/RH-006.
- New test harness self-check documentation or script coverage proving `@/` aliases resolve.

#### Files Likely Affected

- `package.json`
- `tests/unscrambleSearch.test.ts`
- Optional new test utilities under `tests/`
- Optional test documentation updates in `docs/TESTING.md` or `docs/CODEX_TEST.md`

---

### Task 2 — Enforce Dictionary-Backed Result Integrity Across User-Visible Search Results

**Priority:** P1  
**Risk level:** Critical  
**Primary objective:** Resolve the Critical Release 1.1 audit finding by ensuring user-visible search results are backed by the approved dictionary source, without broadly removing obscure but valid dictionary words.

#### Scope

- Define a single shared dictionary-backed result integrity rule for user-visible search output.
- Prevent invalid/generated/non-dictionary strings from all user-visible core search paths.
- Keep valid dictionary-backed words available even when they are uncommon, rare, or surprising to casual users.
- Ensure abbreviations, acronyms, and fragments are included or excluded according to the approved dictionary/source policy, not guessed by implementation.
- Ensure search indexes and source dictionary behavior remain consistent after any filtering.
- Do not rely on UI-only hiding if APIs or dynamic routes can still expose invalid results as normal results.

#### Dependencies

- Depends on Task 1 so RH-003 and dictionary-quality regressions are protected before behavior changes.
- Should complete before Task 3 ranking validation, because ranking must operate on dictionary-backed results and must not be used as a substitute for source validation.

#### Acceptance Criteria

- Core homepage/API search returns only words backed by the approved dictionary source for relevant inputs.
- Core homepage/API search does not return arbitrary/generated/non-dictionary strings.
- User-visible `words-from-letters` behavior uses the same dictionary-backed integrity policy or documents a tested reason for any intentional difference.
- Dictionary/index data and runtime filtering do not conflict with DD-003/DD-005/DD-007.
- Approved dictionary-backed examples from rules, such as `stream`, `master`, `steam`, `teams`, `stare`, `eta`, `tae`, `ers`, `ems`, and `ret`, remain available when buildable and present in the approved source.
- The behavior is documented in tests with PP/WQ/DD/RH rule references.

#### Regression Tests Required

- RH-003 test asserting core search outputs are drawn from the approved dictionary source and do not include generated/non-dictionary strings.
- WQ-002/DD-004 inclusion tests asserting uncommon valid dictionary-backed examples remain available when buildable.
- API-level or engine-level tests for the same policy, depending on the chosen test harness.
- Dictionary/index consistency check if compiled data is modified.

#### Files Likely Affected

- `lib/engine/wordStore.ts`
- `lib/engine/wordsFromLetters.ts`
- `lib/engine/wordFilters.ts`
- `data/source/dictionary.json` or `data/source/words.txt` if source data is changed
- `data/compiled/*.json` if indexes are regenerated
- `tests/unscrambleSearch.test.ts`
- Optional new tests under `tests/`

---

### Task 3 — Improve Ranking for Human-Useful Results

**Priority:** P2  
**Risk level:** High  
**Primary objective:** Align result ordering with WQ-004 and RH-005 so useful, meaningful words are prominent.

#### Scope

- Define ranking expectations for letter-entry searches.
- Adjust ranking so common/frequent/longer/useful words are prioritized without suppressing uncommon valid dictionary-backed words.
- Keep ranking deterministic.
- Avoid maximizing count at the expense of result quality, but do not reduce count by removing valid dictionary-backed words solely because they are uncommon.

#### Dependencies

- Depends on Task 1.
- Should follow Task 2 so invalid/generated/non-dictionary strings do not distort ranking tests.

#### Acceptance Criteria

- For `aelpp`, `apple` appears in the top useful-results position according to the documented ranking rule.
- For `listen`, expected words such as `listen`, `silent`, and `enlist` are available and ordered deterministically.
- For `stream`, useful words such as `stream`, `master`, `steam`, `teams`, and `stare` are prioritized deterministically when present.
- Ranking criteria are documented in tests and map to WQ-004/RH-005.
- Ranking changes do not break subset search, exact anagram inclusion, length filters, blank filters, or combined filters.

#### Regression Tests Required

- Ranking assertion for `aelpp` that checks more than inclusion of `apple`.
- Ranking assertion for `stream` against meaningful examples from WQ-001.
- Determinism test for stable ordering across repeated calls.
- Existing subset/filter regression tests from Task 1 remain passing.

#### Files Likely Affected

- `lib/engine/wordStore.ts`
- `lib/engine/wordsFromLetters.ts`
- `lib/engine/wordApi.ts`
- `data/compiled/frequencyMap.json` if frequency data is adjusted
- `tests/unscrambleSearch.test.ts`
- Optional ranking-focused tests under `tests/`

---

### Task 4 — Add Canonical URLs for Major Routes

**Priority:** P3  
**Risk level:** High  
**Primary objective:** Satisfy SEO-002 by emitting canonical URLs for major static and dynamic pages.

#### Scope

- Add canonical metadata for all major static pages and dynamic route families.
- Use one canonical policy for normalized route parameters, including letter casing and cleaned query path segments.
- Ensure canonical URLs do not introduce redirects or duplicate conflicting metadata.
- Follow the repository's installed Next.js metadata behavior before implementation because this project uses a newer Next.js version with breaking changes.

#### Dependencies

- Depends on Task 1 for metadata/route regression checks.
- Can be implemented in parallel with Task 5 once test utilities are available.
- Should incorporate Task 5 route-inclusion policy if canonical and sitemap route sets are shared.

#### Acceptance Criteria

- Canonical metadata exists for `/`, `/word-finder`, `/words-from-letters`, `/words-from-letters/[letters]`, `/unscramble/[letters]`, `/word-length/[length]`, `/words-starting-with/[letter]`, `/words-ending-with/[suffix]`, and `/words-with-pattern/[pattern]` unless an explicit noindex/exclusion decision is documented.
- Generated canonical URLs are absolute and use the configured production site origin.
- Dynamic canonical URLs normalize inputs consistently.
- Runtime or metadata tests confirm `rel="canonical"` is emitted for representative routes.
- Existing metadata titles/descriptions remain valid and do not regress SEO-001.

#### Regression Tests Required

- Metadata or smoke tests for canonical tags on representative static and dynamic routes.
- Parameter-normalization tests for dynamic canonicals.
- Build test to validate metadata generation compiles under the installed Next.js version.

#### Files Likely Affected

- `app/layout.tsx`
- `app/page.tsx`
- `app/word-finder/page.tsx`
- `app/words-from-letters/page.tsx`
- `app/words-from-letters/[letters]/page.tsx`
- `app/unscramble/[letters]/page.tsx`
- `app/word-length/[length]/page.tsx`
- `app/words-starting-with/[letter]/page.tsx`
- `app/words-ending-with/[suffix]/page.tsx`
- `app/words-with-pattern/[pattern]/page.tsx`
- `lib/seo/metadata.ts`
- New or updated SEO tests under `tests/`

---

### Task 5 — Expand Sitemap Coverage or Document Explicit Exclusions

**Priority:** P4  
**Risk level:** High  
**Primary objective:** Satisfy SEO-003 by making sitemap coverage match implemented major routes and indexing decisions.

#### Scope

- Add missing major static routes and representative dynamic route families to the sitemap where they should be indexed.
- Include `/word-finder` and an explicit policy for `/words-with-pattern/[pattern]`.
- Ensure sitemap entries align with canonical URL policy from Task 4.
- Keep generated sitemap size controlled and useful.

#### Dependencies

- Depends on Task 1 for sitemap regression tests.
- Should coordinate with Task 4 so sitemap URLs and canonical URLs match.
- May depend on Task 5/P5 search semantics decision for `/unscramble/[letters]` indexing policy.

#### Acceptance Criteria

- `app/sitemap.ts` includes all major indexable static pages.
- Dynamic sitemap entries are intentionally scoped and documented.
- If any implemented route family is excluded, the exclusion has a documented SEO/product reason.
- Sitemap URLs use the same production origin and normalized path policy as canonical URLs.
- Sitemap and robots outputs remain valid.

#### Regression Tests Required

- Sitemap test asserting required static routes are present.
- Sitemap test asserting representative dynamic entries are present or intentionally excluded by documented policy.
- Robots test confirming valid output remains available and does not block intended sitemap URLs.
- Build test confirming Next.js route generation remains valid.

#### Files Likely Affected

- `app/sitemap.ts`
- `app/robots.ts` if sitemap references or robots policy need adjustment
- `lib/seo/metadata.ts` or new SEO route utilities
- New or updated SEO tests under `tests/`
- Optional documentation in `docs/roadmap/` or `docs/rules/05-seo.md` if exclusions are policy decisions

---

### Task 6 — Decide and Protect Search Behavior Consistency

**Priority:** P5  
**Risk level:** Medium  
**Primary objective:** Resolve the documented ambiguity between interactive subset search and `/unscramble/[letters]` exact-signature dynamic route behavior.

#### Scope

- Make a product decision: either `/unscramble/[letters]` is exact-anagram-only, or it should mirror subset/buildable search behavior.
- Document the decision in the appropriate rule, architecture, or roadmap file.
- Update implementation only if current behavior conflicts with the decision.
- Protect the chosen behavior with regression tests.

#### Dependencies

- Depends on Task 1.
- Should be decided before finalizing sitemap and canonical policy for `/unscramble/[letters]` route families.
- Must not weaken SB-002/SB-003 for general search unless a clearly labeled exact-anagram mode is introduced.

#### Acceptance Criteria

- Rules or documentation clearly define the difference, if any, between general search, words-from-letters search, and `/unscramble/[letters]` dynamic pages.
- Tests cover the chosen behavior for a representative query such as `aelpp` and a long-input subset case.
- UI copy and route metadata do not imply unsupported behavior.
- Existing homepage/API subset search remains protected.

#### Regression Tests Required

- General search subset behavior test for SB-002/SB-003/RH-004.
- Dynamic route or engine-level test for `/unscramble/[letters]` exact-vs-subset decision.
- API consistency test if API and page behavior are intended to match.
- Documentation/rule reference in tests for SB-006.

#### Files Likely Affected

- `docs/rules/02-search-behavior.md` if the rule needs clarification
- `docs/ARCHITECTURE.md` or `docs/REPOSITORY_ARCHITECTURE.md` if route semantics are documented there
- `app/unscramble/[letters]/page.tsx`
- `app/api/unscramble/route.ts`
- `lib/engine/wordStore.ts`
- `tests/unscrambleSearch.test.ts`
- Optional route-level tests under `tests/`

---

### Task 7 — Improve Browse-Page UX and Performance

**Priority:** P6  
**Risk level:** Medium  
**Primary objective:** Keep broad SEO browse pages useful and mobile-friendly without degrading discoverability.

#### Scope

- Reduce very large unpaginated result pages through pagination, grouping, top-result limits, progressive disclosure, or route-specific summaries.
- Preserve important internal links and SEO discoverability.
- Keep casual-user UX simple.
- Avoid broad architectural refactors unless required for performance.

#### Dependencies

- Depends on Task 1 for regression and smoke coverage.
- Should not conflict with canonical/sitemap policy from Tasks 4 and 5.
- Can ship after blockers if risk is low; otherwise document as a follow-up if Release 1.1 must stay focused on blockers.

#### Acceptance Criteria

- Representative broad routes such as `/word-length/5`, `/words-starting-with/a`, and `/words-ending-with/ing` render smaller, more navigable pages than the audit baseline.
- Pages remain usable on mobile and preserve clear links to continue searching.
- No-result and new-search affordances remain clear.
- SEO pages keep metadata, canonical URLs, sitemap policy, and internal links intact.
- Performance improvement is measured with response-size, render-count, or runtime smoke evidence.

#### Regression Tests Required

- Smoke tests for representative broad browse routes returning HTTP 200.
- Tests or snapshots asserting result limits/pagination controls/group headings are present when expected.
- Internal-link presence checks for route-family discoverability.
- Build test and lint test.

#### Files Likely Affected

- `app/word-length/[length]/page.tsx`
- `app/words-starting-with/[letter]/page.tsx`
- `app/words-ending-with/[suffix]/page.tsx`
- `app/words-with-pattern/[pattern]/page.tsx`
- `components/WordGroup.tsx`
- `components/RelatedLinks.tsx`
- `components/WordsFromLettersResults.tsx`
- `lib/seo/internalLinks.ts`
- `app/globals.css`
- New or updated UX/performance tests under `tests/`

---

### Task 8 — Technical Debt Cleanup After Guardrails

**Priority:** P7  
**Risk level:** Low to Medium  
**Primary objective:** Reduce duplication and metadata drift only after behavior is protected by regression tests.

#### Scope

- Consolidate duplicated letter-cleaning, letter-counting, buildability, filtering, and ranking helpers where practical.
- Standardize metadata branding strings if product agrees on one brand label.
- Consider a shared route/SEO utility for canonical and sitemap URL construction.
- Avoid churn that does not reduce future regression risk.

#### Dependencies

- Depends on Task 1.
- Should follow Tasks 2 and 3 if engine helpers are being consolidated.
- Should follow Tasks 4 and 5 if SEO route utilities are being consolidated.

#### Acceptance Criteria

- Shared helpers replace duplicated behavior without changing tested output unintentionally.
- Branding strings are consistent across metadata if included in Release 1.1.
- All regression tests continue to pass.
- Code is simpler to audit against product rules.

#### Regression Tests Required

- Full `npm test` suite.
- Lint and build.
- Targeted before/after assertions for any consolidated engine helper behavior.
- SEO route utility tests if canonical/sitemap helpers are introduced.

#### Files Likely Affected

- `lib/engine/wordStore.ts`
- `lib/engine/wordsFromLetters.ts`
- `lib/engine/wordFilters.ts`
- `lib/engine/unscrambleEngine.ts`
- `lib/seo/metadata.ts`
- `lib/seo/internalLinks.ts`
- Route files under `app/` with metadata strings
- Tests under `tests/`

## Cross-Task Release Test Matrix

| Area | Required Checks Before Release |
| --- | --- |
| Regression harness | `npm test` or documented equivalent passes locally and in CI/release workflow. |
| Lint/build | `npm run lint` and `npm run build` pass. |
| Search behavior | Exact anagram, subset search, long-input subset search, blank filters, placeholder handling, and combined filters pass. |
| Dictionary-backed integrity | Invalid/generated/non-dictionary strings are absent; uncommon and useful dictionary-backed examples remain available. |
| Ranking | `aelpp`, `listen`, and `stream` ranking expectations pass deterministically. |
| Words from letters | Buildability, grouping, filtering, and quality policy are tested. |
| Canonicals | Representative static and dynamic pages emit expected canonical URLs. |
| Sitemap/robots | Required sitemap entries are present; robots output remains valid. |
| Browse UX/performance | Broad browse routes return 200 and meet the selected pagination/limit/grouping acceptance checks. |
| Documentation | Any intentional product-rule or SEO-policy exceptions are documented before release. |

## Release Exit Criteria

Release 1.1 may be approved only when all of the following are true:

1. All P0-P5 tasks are complete or an explicit product-owner decision documents a scoped deferral with risk acceptance.
2. The Critical dictionary-backed result integrity finding from the Release 1.1 audit is fixed and protected by RH-003 regression tests.
3. High-priority ranking, canonical, sitemap, and regression-test blockers are fixed or formally reclassified with written rationale.
4. `npm test`, `npm run lint`, and `npm run build` pass on the release branch.
5. Representative runtime smoke checks pass for `/`, `/word-finder`, `/words-from-letters`, `/unscramble/aelpp`, `/words-from-letters/aelpp`, `/word-length/5`, `/words-starting-with/a`, `/words-ending-with/ing`, `/words-with-pattern/a__le`, `/sitemap.xml`, and `/robots.txt`.
6. Canonical URLs are present on all major indexable HTML routes.
7. Sitemap coverage matches the documented route indexing policy.
8. Tests include rule-ID references for the behavior they protect.
9. No application behavior is changed without corresponding regression coverage.
10. Any P6-P7 work not included in Release 1.1 is recorded as follow-up work with owner, risk, and acceptance criteria.

## Recommended Implementation Notes

- Keep implementation PRs small and ordered by this plan; do not combine unrelated SEO, engine, and UX changes unless they share a test dependency.
- For Next.js metadata or sitemap implementation, read the relevant installed documentation under `node_modules/next/dist/docs/` before coding because the repository uses a Next.js version with breaking changes.
- Prefer engine-level tests for deterministic word behavior and route/metadata tests for SEO output.
- Avoid changing business rules silently; if implementation requires a product-rule change, update rules and tests together.
- Treat compiled dictionary data as generated or derived unless the repository documents otherwise; if data is regenerated, verify source-data consistency and review diffs carefully.
