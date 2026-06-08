# Product Vision

## Product

Unscramble Word Now is a fast, SEO-friendly word discovery platform for people who want to turn letters, patterns, and constraints into useful English words.

The project started as an unscramble tool and is evolving into a broader word-finding experience that supports anagrams, subset-letter searches, word-length browsing, prefix and suffix discovery, wildcard pattern pages, and future educational language collections.

## Vision Statement

Help users quickly find meaningful English words from any clue, letter set, or pattern while making word discovery simple, trustworthy, and enjoyable.

## Target Users

- Casual users solving scrambled-word puzzles.
- Word-game players looking for useful candidate words.
- Students, writers, and language learners exploring English words.
- Search users landing on specific word-list pages from Google.

## Core Product Promise

Users should be able to enter letters or a word pattern and get ranked, meaningful, human-useful English words in under one second.

## Product Principles

The active product rules define the product direction:

- Help users find meaningful English words.
- Prefer quality over raw result count.
- Preserve a simple casual-user experience.
- Keep response times fast.
- Support long-term SEO growth without degrading user experience.
- Treat business rules as the source of truth for behavior.

## Current Product Pillars

### 1. Fast Word Discovery

The app relies on precompiled JSON indexes instead of runtime database queries. This keeps pages and API lookups lightweight and suitable for static or server-rendered SEO routes.

### 2. Meaningful Search Results

Search and ranking should prioritize common, useful English words. Low-value abbreviations and dictionary fragments should remain excluded unless a future business decision explicitly approves them.

### 3. Flexible Search Behavior

Users may search with more letters than a result needs. Subset search is a core behavior, while exact anagram behavior should only be required when an explicit exact-anagram mode exists.

### 4. Stable Filters

Length, starts-with, ends-with, and contains filters are optional. Blank or placeholder filter values must be ignored, and intentional filters combine with AND logic.

### 5. SEO-Friendly Word Pages

Dynamic route families should create useful, indexable pages for high-intent word searches while remaining accurate, canonical, and easy to navigate.

### 6. Long-Term Word Exploration

Future growth should expand beyond direct unscrambling into educational and curiosity-driven collections such as palindromes, semordnilaps, anagrams, pangrams, homophones, rare words, beautiful words, and category-based word explorers.

## Current Platform Capabilities

- Homepage unscramble experience.
- Dynamic unscramble pages at `/unscramble/[letters]`.
- Word finder page with shared filters.
- Words-from-letters search at `/words-from-letters` and `/words-from-letters/[letters]`.
- SEO route families for word length, starting letters, ending letters, and wildcard patterns.
- Internal related links.
- Sitemap and robots metadata routes.
- Precompiled dictionary, frequency, definition, signature, length, prefix, suffix, and pattern indexes.

## Quality Bar

A feature is ready only when it:

1. Preserves existing search and filter behavior.
2. Uses meaningful dictionary data.
3. Maintains fast response times.
4. Includes or updates regression coverage when behavior changes.
5. Supports SEO without sacrificing usability.
6. Fits the simple word-discovery product direction.

## Non-Goals For The Near Term

- User accounts.
- Profiles.
- Leaderboards.
- Databases or server-side persistence for core word lookup.
- Social features.
- Broad game mechanics before the core search experience is production-ready.

## Long-Term Direction

Unscramble Word Now should become a word discovery platform, not only an anagram solver. The product should grow through useful search utilities first, then curated educational collections and discovery experiences once production readiness, SEO foundations, and regression protections are stable.
