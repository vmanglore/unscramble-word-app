# Release Plan

## Planning Status

This plan consolidates the current roadmap, release notes, business rules, regression history, and long-term backlog into a single release-oriented view.

## Release 1 — Production Foundation

Status: Completed

### Objective

Create and deploy the first production-ready version of Unscramble Word Now with core word lookup, SEO route foundations, and Vercel hosting.

### Delivered Scope

- GitHub repository and Vercel deployment.
- Production domain configuration for `unscramblewordnow.com`.
- Core Next.js App Router structure.
- Homepage unscramble experience.
- Dynamic unscramble route.
- Dynamic SEO route families for word length, starting letters, ending letters, and wildcard patterns.
- Route metadata improvements.
- Sitemap and robots routes.
- Local dictionary-based lookup.
- Contextual related links.
- Compiled dictionary indexes.
- Frequency-based ranking.
- Word definitions in results.
- Shared navigation and shared filtering components.

## Release 2 — Words From Letters

Status: Completed

### Objective

Expand the application from a pure anagram solver into a complete word-generation tool that finds every valid dictionary word that can be created from a set of letters.

### Delivered Scope

- Words-from-letters engine.
- Letter-frequency validation so words cannot use letters more times than available.
- Dictionary validation using existing local data.
- Existing frequency ranking reused for result ordering.
- Grouped results by descending word length.
- `/words-from-letters` route.
- `/words-from-letters/[letters]` dynamic route.
- Dynamic SEO metadata.
- Related internal searches.
- JSON-based architecture retained without introducing a database.

### Release 2 Constraints

- Do not modify existing unscramble behavior unintentionally.
- Keep response time target below 500ms for the feature.
- Keep categories, daily challenge, synonyms, antonyms, accounts, profiles, and leaderboards out of scope.

## Release 3 — Production Readiness And SEO Validation

Status: Current Priority

### Objective

Harden the existing product before expanding into larger discovery features.

### Planned Scope

- Run a repository review focused on search behavior, SEO, and maintainability.
- Validate route metadata for all major pages.
- Validate canonical URLs.
- Validate `sitemap.xml` coverage.
- Validate `robots.txt` output.
- Test all dynamic route families.
- Improve internal linking where it helps discoverability.
- Add Google Search Console.
- Submit the sitemap to Google.
- Keep the main branch production-ready.

### Release Criteria

- `npm run lint` passes.
- `npm run build` passes before merge.
- Critical route families are manually or programmatically checked.
- SEO metadata and sitemap behavior are verified.
- Existing regression protections remain intact.

## Release 4 — Regression Coverage And Quality Guardrails

Status: Planned

### Objective

Reduce risk around recurring search, filter, and word-quality regressions.

### Planned Scope

- Expand automated tests around documented regression history.
- Ensure every fixed bug has a regression test where practical.
- Add tests that cite applicable rule IDs for search behavior, filters, word quality, and dictionary updates.
- Protect subset searches with long inputs.
- Protect blank and placeholder filter handling.
- Protect low-value word filtering decisions.
- Protect stable AND behavior for combined filters.

### Release Criteria

- Regression tests cover RH-001 through RH-006 where implementation hooks exist.
- Test names or comments reference relevant business-rule IDs.
- Dictionary or ranking changes require matching test updates.

## Release 5 — Ranking, Dictionary, And Autocomplete Improvements

Status: Planned

### Objective

Improve result usefulness without destabilizing the core search experience.

### Planned Scope

- Improve autocomplete ranking.
- Evaluate real trending words instead of static suggestions.
- Refine frequency ranking for common, useful words.
- Review dictionary quality to reduce rare fragments and low-value entries.
- Add validation for dictionary updates.

### Release Criteria

- Ranking changes improve useful words ahead of rare or low-value entries.
- Dictionary updates do not reintroduce known fragments or abbreviations.
- Performance remains under the product response-time target.

## Release 6 — Analytics And Growth Foundations

Status: Future

### Objective

Add measurement and growth tooling after production and SEO foundations are stable.

### Planned Scope

- Add analytics.
- Use analytics to identify high-demand searches and missing content opportunities.
- Evaluate monetization options such as AdSense after traffic starts.
- Use search demand to prioritize future collection pages.

### Release Criteria

- Analytics respects site performance and user experience.
- Growth decisions are informed by demand rather than raw page volume.

## Release 7 — Word Discovery Collections

Status: Future / Strategic Backlog

### Objective

Grow beyond utility search into curated word discovery and educational collections.

### Candidate Scope

- Palindromes.
- Semordnilaps.
- Anagrams.
- Pangrams.
- Isograms and heterograms.
- Double-letter and triple-letter words.
- Words without traditional vowels.
- Homophones, homographs, heteronyms, and contronyms.
- Rare, beautiful, difficult, long, and short word collections.
- Words by origin, borrowed words, Shakespeare-invented words, and words by era.
- Category explorers for animals, food, nature, science, sports, geography, technology, and space.

### Prioritization Criteria

Before implementation, each collection should be evaluated for:

1. Alignment with the Explore Words vision.
2. User demand.
3. Search trend opportunity.
4. Educational value.
5. SEO potential.
6. Platform maturity.
7. Ability to encourage useful exploration instead of generating thin pages.

## Always-On Engineering Rules

- Review relevant rule documents before changing behavior.
- Update rules, tests, and code together when behavior changes intentionally.
- Run `npm run build` before major changes.
- Review preview deployments before merge.
- Keep business rules as the source of truth.
