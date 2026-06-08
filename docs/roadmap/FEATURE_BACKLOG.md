# Feature Backlog

## Backlog Principles

Features should be prioritized by user value, search demand, educational value, SEO opportunity, performance impact, and alignment with the product rules.

The goal is not to create thousands of thin pages. The goal is to create thousands of useful opportunities for word discovery.

## Priority 0 — Product Safety And Regression Guardrails

These items protect existing behavior and should be considered before broad feature expansion.

- Expand regression tests for subset search behavior.
- Expand regression tests for length-filter behavior with long inputs.
- Expand regression tests for blank and placeholder filter values.
- Expand regression tests for combined filter AND logic.
- Add tests that reference applicable business-rule IDs.
- Validate dictionary updates through automated checks.
- Prevent known low-value abbreviations and fragments from returning.
- Keep `npm run lint` and `npm run build` passing before merge.

## Priority 1 — Production Readiness

- Run a full repository review.
- Validate SEO metadata for all major pages.
- Validate canonical URLs.
- Validate sitemap coverage.
- Validate robots configuration.
- Test all dynamic routes.
- Improve internal linking where discoverability is weak.
- Add Google Search Console.
- Submit sitemap to Google.
- Review preview deployment before merging major work.

## Priority 2 — Core Search Quality

- Improve ranking so common and useful words appear ahead of obscure results.
- Improve autocomplete ranking.
- Evaluate real trending words instead of static homepage suggestions.
- Review dictionary source quality.
- Add dictionary quality checks that protect meaningful-word standards.
- Consolidate overlapping search helper modules where it reduces maintenance risk.
- Keep lookup architecture JSON-based unless a future need justifies a database.

## Priority 3 — SEO And Discoverability Enhancements

- Improve internal links between related route families.
- Add more contextual related searches where they help users continue discovery.
- Expand route-level copy for high-intent pages without creating thin content.
- Validate sitemap entries against implemented route families.
- Monitor Search Console queries after setup to prioritize content updates.

## Priority 4 — Analytics And Growth

- Add analytics after core production readiness is complete.
- Track high-demand searches and zero-result searches.
- Use analytics to identify missing dictionary or content opportunities.
- Evaluate monetization only after traffic and user experience are stable.
- Consider AdSense after meaningful traffic starts.

## Priority 5 — Word Pattern Collections

Candidate collection features from the long-term roadmap:

- Palindrome collections.
- Palindrome challenges.
- Longest palindromes.
- Daily palindrome puzzles.
- Reverse word explorer for semordnilaps.
- Semordnilap collections.
- Reverse word challenges.
- Anagram explorer.
- Daily anagram challenge.
- Multi-word anagrams.
- Pangram collections.
- Pangram builder.
- Pangram challenges.
- Ambigram-oriented visual word exploration.
- Tautonym collections.
- Lipogram challenges and writing exercises.

## Priority 6 — Letter Pattern Collections

- Isogram words.
- Heterogram words.
- Double-letter words.
- Triple-letter patterns.
- All-vowel words.
- Words without traditional vowels.

## Priority 7 — Linguistic Curiosity Collections

- Homophones.
- Homographs.
- Heteronyms.
- Contronyms.
- Oxymorons.
- Portmanteaus.
- Onomatopoeia.

## Priority 8 — Discovery Collections

- Rare words.
- Beautiful words.
- Longest words.
- Shortest words.
- Difficult words.

## Priority 9 — Educational Collections

- Words by origin.
- Borrowed words.
- Shakespeare-invented words.
- Words by era.
- Kids educational word collections.
- Learning modules.

## Priority 10 — Category Explorers

- Animals.
- Food.
- Nature.
- Science.
- Sports.
- Geography.
- Technology.
- Space.

## Explicitly Out Of Scope Until Later

- Accounts.
- User profiles.
- Leaderboards.
- Social features.
- Daily challenge mechanics before the core platform is stable.
- Synonyms and antonyms unless they become part of a defined discovery release.
- A database for core lookup unless JSON indexes no longer meet performance or product needs.

## Evaluation Checklist

Before promoting any backlog item into a release plan, confirm:

1. Does it help users find or explore meaningful English words?
2. Does it improve quality rather than merely increasing page count?
3. Does it preserve fast response times?
4. Does it support SEO without harming user experience?
5. Does it fit the current platform maturity?
6. Can it be tested against product and regression rules?
7. Does it avoid reintroducing known regressions?
