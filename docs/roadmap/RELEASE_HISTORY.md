# Release History

## Overview

This history summarizes the project timeline from repository initialization through the current documentation and regression-rule work. It is based on the repository commit history and current project documentation.

## Timeline

### Initial Project Setup

- Created the Next.js application from Create Next App.
- Added the initial repository baseline.
- Stabilized routing and production build behavior.

### Production And Documentation Foundation

- Added initial architecture documentation.
- Added the first roadmap and testing notes.
- Connected the app to the Vercel deployment flow.
- Documented the production domain: `unscramblewordnow.com`.

### Core SEO Routes

- Added route metadata.
- Improved SEO-oriented pages.
- Added dynamic route families for:
  - `/unscramble/[letters]`
  - `/word-length/[length]`
  - `/words-starting-with/[letter]`
  - `/words-ending-with/[suffix]`
  - `/words-with-pattern/[pattern]`
- Added sitemap and robots support.

### Unscramble Experience Iteration

- Improved unscramble result page copy.
- Fixed a trending-words hydration mismatch.
- Added fixed homepage word suggestions.
- Standardized the unscramble results layout.
- Tested navigation between homepage searches and result pages.
- Restored inline homepage search results.
- Switched unscramble results to local dictionary data.
- Added contextual related links.

### Dictionary, Ranking, And Word Details

- Added word details and contextual related links.
- Added compact word details on homepage results.
- Added a starter word frequency map.
- Built compiled indexes from dictionary source data.
- Ranked word results by frequency.
- Returned best-word definitions from the unscramble API.
- Returned definitions for all unscramble results.

### Word Finder And Shared Search Infrastructure

- Added search count analytics data.
- Added shared site navigation.
- Added a flexible word finder engine.
- Added dictionary definitions and the word finder foundation.
- Shared word filter logic across tools.
- Added a word finder page and shared filters.
- Added filter support to the unscramble API.
- Added advanced filters to the unscrambler.
- Enhanced unscrambler behavior with filters and dynamic word details.

### Release 2 — Words From Letters

- Added the Release 2 roadmap document.
- Implemented the words-from-letters engine and pages.
- Added support for creating all valid words from supplied letters.
- Added grouped output by word length.
- Added `/words-from-letters` and `/words-from-letters/[letters]` routes.

### Long-Term Product Strategy

- Added the long-term roadmap for word pattern, language, discovery, educational, and category collections.
- Captured future opportunities including palindromes, semordnilaps, anagrams, pangrams, homophones, rare words, beautiful words, and category explorers.

### Codex And Preview Workflow

- Added a Codex integration test document.
- Added a Vercel preview test document.
- Established PR-based workflow expectations through documentation.

### Search And Filter Regression Fixes

- Fixed length-filtered unscramble searches so long inputs can still return shorter subset matches.
- Fixed subset unscramble searches so general search does not incorrectly require all entered letters.
- Documented these behaviors in regression history and product rules.

### Business Rules Framework

- Added the initial business rules framework under `docs/rules/`.
- Converted `docs/BUSINESS_RULES.md` into a pointer to the rule documents.
- Added product principles, search behavior rules, word quality rules, filter rules, SEO rules, user experience rules, data and dictionary rules, testing and regression rules, and Codex workflow rules.

### Regression History Documentation

- Added regression history for major search, filter, and word-quality decisions.
- Documented fixed and open regression risks:
  - RH-001: Length-filter search returned 0 results for long inputs.
  - RH-002: Placeholder and blank filter values affected results.
  - RH-003: Meaningless word fragments appeared in results.
  - RH-004: Searches incorrectly required all entered letters.
  - RH-005: Result ranking favored quantity over useful words.
  - RH-006: Filter behavior instability across releases.

## Current State

The app is a deployed word discovery utility with:

- Core unscramble search.
- Words-from-letters search.
- Word finder functionality.
- Dynamic SEO pages.
- Precompiled local word indexes.
- Frequency ranking and definitions.
- Shared filters.
- Business rules and regression-history documentation.

## Current Release Focus

The current priority is production readiness and testing:

- Repository review.
- SEO metadata validation.
- Sitemap and robots validation.
- Dynamic route testing.
- Internal linking improvements.
- Google Search Console setup.
- Sitemap submission.
