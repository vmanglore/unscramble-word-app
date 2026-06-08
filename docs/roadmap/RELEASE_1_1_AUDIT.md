# Release Audit: Release 1.1

## Scope Reviewed
- Release 1 production foundation and Release 1.1 production-readiness audit surface: core unscramble search, filters, word quality, ranking, SEO metadata/canonicals/sitemap/robots, dynamic route families, internal links, UX, and maintainability.
- Roadmap scope treated as current readiness hardening because the roadmap lists Release 3 / production readiness as the current priority and Release 1 as completed foundation scope.
- Excluded areas: code changes, new feature implementation, analytics/Search Console setup verification outside the repository, preview deployment review, and external production crawl.

## Sources Checked
- Rules: `docs/rules/01-product-principles.md`, `docs/rules/02-search-behavior.md`, `docs/rules/03-word-quality.md`, `docs/rules/04-filters.md`, `docs/rules/05-seo.md`, `docs/rules/06-user-experience.md`, `docs/rules/07-data-dictionary.md`, `docs/rules/08-testing-regression.md`, `docs/rules/09-codex-workflow.md`, `docs/rules/10-regression-history.md`, `docs/rules/CODEX_AUDIT_RULES.md`.
- Regression tests: `tests/unscrambleSearch.test.ts`; attempted direct execution with `npx ts-node --project tsconfig.json --transpile-only -r tsconfig-paths/register tests/unscrambleSearch.test.ts`.
- Roadmap: `docs/roadmap/RELEASE_PLAN.md`, `docs/roadmap/RELEASE_HISTORY.md`, `docs/roadmap/FEATURE_BACKLOG.md`, `docs/roadmap/PRODUCT_VISION.md`, `docs/roadmap/release-2.md`.
- Implementation: `app/page.tsx`, `app/api/unscramble/route.ts`, `app/unscramble/[letters]/page.tsx`, `app/words-from-letters/page.tsx`, `app/words-from-letters/[letters]/page.tsx`, `app/word-finder/page.tsx`, `app/word-length/[length]/page.tsx`, `app/words-starting-with/[letter]/page.tsx`, `app/words-ending-with/[suffix]/page.tsx`, `app/words-with-pattern/[pattern]/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/engine/wordStore.ts`, `lib/engine/wordsFromLetters.ts`, `components/RelatedLinks.tsx`, `components/SiteHeader.tsx`, and compiled dictionary/index data where noted.
- Commands/checks:
  - `npm run lint` — pass.
  - `npm run build` — pass.
  - `npx ts-node --project tsconfig.json --transpile-only -r tsconfig-paths/register tests/unscrambleSearch.test.ts` — fail: `Cannot find package '@/lib' imported from ... tests/unscrambleSearch.test.ts`.
  - Local runtime smoke check with `npm run start` plus Python `urllib.request` for `/`, `/word-finder`, `/words-from-letters`, `/unscramble/aelpp`, `/words-from-letters/aelpp`, `/word-length/5`, `/words-starting-with/a`, `/words-ending-with/ing`, `/words-with-pattern/a__le`, `/sitemap.xml`, and `/robots.txt` — all returned HTTP 200; none of the HTML route responses contained `rel="canonical"`.
  - Node data probe against `data/compiled/lengthMap.json`, `data/compiled/frequencyMap.json`, and `data/compiled/signatureMap.json` — found short entries in the compiled data and candidate search output whose Release 1.1 handling must be determined by approved dictionary/source policy, not by broad uncommon-word removal.

## Rule Compliance
- Search behavior: subset search and length filtering are implemented in `getFilteredUnscramble()` through buildable-word filtering, not exact-signature-only matching, which aligns with SB-002 and SB-003 for the homepage/API path. However, `/unscramble/[letters]` still uses exact-signature `getUnscramble()` only, so behavior differs between interactive search and the dynamic SEO route.
- Filter behavior: blank filters are cleaned before filtering and multiple intentional filters are applied sequentially, consistent with FLT-006 and FLT-007 in the shared `filterWords()` helper.
- Word quality: the core unscramble path must be validated for dictionary-backed result integrity. Release 1.1 should prevent invalid/generated/non-dictionary strings, while keeping uncommon but valid dictionary-backed words available according to WQ-001 through WQ-003 and DD-002 through DD-005.
- Ranking: `rankWords()` sorts by raw frequency first, then length, then alphabetically. This can promote very short common words above more useful target words for letter-entry searches, conflicting with WQ-004 and PP-002/PP-003 when the user intent is to find meaningful words from letters.
- SEO: route metadata exists on several route families, but canonical URLs are absent across observed pages and no `alternates.canonical` usage exists in `app/`. This violates SEO-002. Sitemap source omits implemented major routes such as `/word-finder` and `/words-with-pattern/[pattern]`, which conflicts with SEO-003 and the roadmap’s sitemap-coverage validation objective.
- UX: no-result and blank-input feedback exists on the homepage and form pages, but several SEO browse routes render very large unpaginated chip lists, creating performance and usability risk for mobile users and casual users.
- Testing: lint and build pass, but the repository’s only regression test cannot currently be run with the attempted command because path alias resolution is not wired for that execution path. Tests also do not cite applicable rule IDs, violating TR-004.

## Regression Coverage
- Existing coverage in `tests/unscrambleSearch.test.ts` checks: alphabet subset search, `aelpp` includes `apple`, `listen` includes expected words, length-filtered long-input results for lengths 2 through 10, blank filters, and placeholder non-application.
- Missing coverage:
  - No executable npm script for the regression test file; attempted direct `ts-node` execution fails on the `@/lib` alias.
  - Tests do not reference business-rule IDs, contrary to TR-004.
  - No automated coverage for RH-003 dictionary-backed result integrity on the homepage/API `getFilteredUnscramble()` path, including protection that invalid/generated strings are absent and uncommon valid dictionary words remain available.
  - No automated coverage for RH-005 ranking quality; `aelpp` only asserts that `apple` is included, not that useful words are prioritized ahead of less useful very short words while uncommon valid words remain available.
  - No automated coverage for Release 2 words-from-letters behavior (`canBuildWord`, `getWordsFromLetters`, `groupWordsByLength`), dynamic route metadata, related searches, or grouped descending-length display.
  - No automated coverage for SEO-002 canonical URLs, SEO-003 sitemap coverage, or SEO-004 robots output.

## Roadmap Alignment
- Aligned: Release 1 foundation routes and Release 2 words-from-letters routes exist; lint and build pass; robots route returns valid basic output; the app remains JSON-based without a database.
- Not aligned with current production-readiness priority:
  - Release 3 calls for validating route metadata, canonical URLs, sitemap coverage, robots output, dynamic route families, and internal links before keeping the main branch production-ready.
  - Canonicals are missing on observed major pages.
  - Sitemap coverage omits implemented major route families and static utility routes.
  - Dynamic route smoke checks returned HTTP 200, but there is no automated regression protection for those checks.
- Not aligned with Release 4 / backlog guardrails: regression tests do not cover all documented regression-history items and do not cite rule IDs.
- Not aligned with Release 5 ranking/dictionary direction: current ranking and compiled data need clearer dictionary-backed integrity checks so invalid/generated strings are not surfaced while uncommon valid dictionary words remain available.

## Implementation Findings
| Severity | Area | Finding | Evidence | Required Action |
| --- | --- | --- | --- | --- |
| Critical | Dictionary-backed result integrity / business rules | The core unscramble search needs an explicit shared policy that guarantees all returned words are backed by the approved dictionary source without broadly removing obscure but valid dictionary words. This maps to WQ-001, WQ-002, WQ-003, DD-002, DD-003, DD-004, DD-005, and RH-003. | A Node probe found short entries in `data/compiled/lengthMap.json` and candidate output. Under the updated product decision, entries such as `eta`, `tae`, `ers`, `ems`, and `ret` must remain available if present in the approved dictionary source; invalid/generated/non-dictionary strings must never be returned; abbreviations, acronyms, and fragments follow source policy. | Add shared dictionary-backed integrity checks for user-visible search paths and RH-003 regression tests that prove results come from the approved dictionary while uncommon valid words remain available. |
| High | Ranking / search quality | Useful target words can be ranked behind very short or less useful words. For `aelpp`, `apple` is not ranked first in the core search candidate order; the probe returned `la`, `al`, `el`, `le`, then `apple`. | `rankWords()` sorts frequency before length; tests only assert `apple` inclusion, not useful ranking. WQ-004 allows common/frequent/longer/useful ordering but requires uncommon valid dictionary-backed words to remain available. | Define and test ranking expectations for core letter searches, including `aelpp` and `stream`, without removing valid uncommon dictionary words solely because they are uncommon. |
| High | SEO / canonicals | Canonical URLs are absent across major observed pages. | `rg -n "canonical|alternates" app` returned no matches. Runtime smoke checks for `/`, `/word-finder`, `/words-from-letters`, `/unscramble/aelpp`, `/words-from-letters/aelpp`, `/word-length/5`, `/words-starting-with/a`, `/words-ending-with/ing`, and `/words-with-pattern/a__le` returned HTTP 200 but no `rel="canonical"`. SEO-002 requires canonical URLs. | Add route-level or layout-level canonical metadata that emits correct canonical URLs for static and dynamic routes. |
| High | SEO / sitemap coverage | Sitemap coverage omits implemented major routes and route families. | `app/sitemap.ts` includes home, `/words-from-letters`, `/unscramble/{signature}`, `/words-from-letters/{signature}`, starting-letter pages, four ending pages, and length pages, but does not include `/word-finder` or `/words-with-pattern/[pattern]`. SEO-003 requires sitemap coverage, and Release 3 calls for sitemap coverage validation. | Add `/word-finder` and appropriate pattern-route sitemap entries or explicitly document why they should be excluded from indexing. |
| High | Regression testing | The only regression test file is not executable through the attempted direct command, and no npm test script exists. | `package.json` defines `dev`, `build`, `start`, and `lint`, but no `test` script. `npx ts-node --project tsconfig.json --transpile-only -r tsconfig-paths/register tests/unscrambleSearch.test.ts` failed with `Cannot find package '@/lib'`. TR-005 requires checks before PR creation and Release 4 requires expanded regression guardrails. | Add a reliable test runner/script that supports TypeScript and the `@/` alias, then wire it into release checks. |
| High | Regression coverage | Tests do not reference applicable rule IDs and do not cover RH-003, RH-005, RH-006 combined-filter AND behavior, words-from-letters, or SEO checks. | `tests/unscrambleSearch.test.ts` contains assertions but no rule-ID comments or test names; TR-004 requires tests to reference applicable rule IDs. | Expand and label regression coverage for search, filters, word quality, ranking, words-from-letters, sitemap, robots, and canonical metadata. |
| Medium | Search behavior consistency | Interactive homepage/API search and `/unscramble/[letters]` dynamic route use different semantics: interactive search supports subset/buildable words, while the dynamic route uses exact signature lookup only. | `app/api/unscramble/route.ts` calls `getFilteredUnscramble()`, while `app/unscramble/[letters]/page.tsx` calls `getUnscramble()`. SB-006 says search behavior must remain consistent across releases. | Decide whether `/unscramble/[letters]` is exact-anagram-only or should mirror subset behavior; document the distinction and add tests either way. |
| Medium | UX / performance | Large browse routes render unpaginated full result lists, creating mobile and response-size risk. | Runtime smoke response sizes included `/word-length/5` at approximately 568 KB, `/words-starting-with/a` at approximately 320 KB, and `/words-ending-with/ing` at approximately 314 KB. UX-001 targets instantaneous search and UX-002 requires mobile support. | Add pagination, grouping, top-result summaries, or limits for broad SEO browse pages while preserving discoverability. |
| Medium | Internal linking | Related links are generic and can duplicate route-family coverage without necessarily linking to the most relevant next search. | `RelatedLinks` defaults to starting-with, ending-with, length, and unscramble links; `words-from-letters/[letters]` adds more specific links, but pattern and browse routes rely on generic defaults. SEO-005 requires discoverability-supporting internal links. | Create route-family-specific related-link strategies and add sitemap/internal-link validation for important pages. |
| Low | Metadata consistency | Brand names differ between metadata strings (`Unscramble Word App`, `Unscramble Word Now`, `Word Solver`). | `app/words-from-letters/[letters]/page.tsx` uses `Unscramble Word App`; other routes use `Unscramble Word Now` or `Word Solver`. | Standardize metadata branding. |
| Low | Technical debt | Search and word-quality logic is duplicated between `wordStore.ts` and `wordsFromLetters.ts`. | Both files implement letter cleaning, letter counting, buildability checks, and filtering/ranking orchestration. | Consolidate shared engine helpers after regression coverage is in place. |

## Conflicts and Gaps
- Source-of-truth gap: word-quality rules and regression history require dictionary-backed result integrity, but compiled data and core search output need tests proving every returned result is source-backed and that uncommon valid source words are preserved.
- Source-of-truth conflict: SEO rules require canonicals, but implementation and runtime HTML checks show no canonical tags.
- Source-of-truth conflict: sitemap coverage is required, but implemented major pages and route families are omitted from `app/sitemap.ts`.
- Test gap: regression tests cannot be treated as release-ready evidence until there is a reliable command/script that runs them with path aliases.
- Test gap: tests do not reference rule IDs, so the audit trail from business rules to regression protection is incomplete.
- Evidence gap: no preview deployment, production Search Console, or live sitemap submission evidence was available in the repository.
- Requirement ambiguity: `/unscramble/[letters]` may intentionally be exact-anagram SEO behavior while homepage search is subset/buildable behavior, but the distinction is not documented in rules or tests.

## Severity Summary
- Critical: 1
- High: 5
- Medium: 3
- Low: 2

## Required Actions
- Enforce dictionary-backed result integrity across user-visible core search outputs and add RH-003 regression coverage that does not remove valid uncommon dictionary words solely because they are uncommon.
- Define ranking acceptance criteria and protect them with tests for common examples such as `aelpp`, `listen`, and `stream`.
- Add canonical URL metadata for every major static and dynamic route.
- Expand sitemap coverage to include implemented major routes or document intentional exclusions.
- Add a reliable `npm test` script or equivalent release-check command for TypeScript regression tests with `@/` alias support.
- Add tests with rule-ID references for search behavior, filters, word quality, ranking, words-from-letters, sitemap, robots, and canonical metadata.
- Document or reconcile the semantic difference between interactive subset search and `/unscramble/[letters]` exact-signature route.
- Improve broad browse-page UX/performance through pagination, grouping, or result limits.

## Release Readiness Decision
Not ready.

Release 1.1 should not be approved for release until the Critical dictionary-backed integrity/business-rule violation is fixed and the High SEO and regression-test blockers are addressed or explicitly deferred by product decision. Lint and build passing are positive signals, but they are not sufficient because current evidence shows source-of-truth conflicts against product rules and incomplete regression protection.

## Required Actions Before Release
- Blocker: enforce dictionary-backed result integrity in core unscramble outputs and add regression tests for RH-003.
- Blocker: implement canonical URLs for major routes or document an explicit rule change deferring SEO-002.
- Blocker: correct sitemap coverage for major routes or document intentional noindex/exclusion decisions.
- Blocker: provide a passing regression-test command and update tests to cite rule IDs.
- Blocker: add or update ranking regression coverage for user-useful word ordering.
