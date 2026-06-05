# UNSCRAMBLE WORD APP

# RELEASE 2 IMPLEMENTATION SPECIFICATION

## Repository

vmanglore/unscramble-word-app

---

# Release Name

Words From Letters

---

# Release Objective

Expand the application from a pure anagram solver into a complete word-generation tool.

Current:

aelpp

Returns:

apple

Target:

aelpp

Returns:

apple
peal
pale
leap
plea
ape
pea
pal
lap

---

# User Story

As a user

I want to enter a set of letters

So that I can find every valid dictionary word that can be created from those letters.

---

# Functional Requirements

## Requirement 1

Create Words From Letters Engine

Location:

lib/engine/

Suggested File:

wordsFromLetters.ts

Required Functions:

* canBuildWord()
* getWordsFromLetters()
* groupWordsByLength()

---

## Requirement 2

Letter Frequency Validation

Words may not use letters more times than available.

Example:

Input:

aelpp

Valid:

apple

Invalid:

appeal

---

## Requirement 3

Dictionary Validation

Generated words must exist in the dictionary.

Use existing dictionary source.

---

## Requirement 4

Frequency Ranking

Results should use existing frequency ranking.

Most common words first.

---

## Requirement 5

Grouped Results

Display:

5 Letter Words

4 Letter Words

3 Letter Words

2 Letter Words

Display groups in descending length order.

---

## Requirement 6

New Route

Create:

/words-from-letters

Page Features:

* Input
* Search Button
* Advanced Filters
* Results

Reuse existing site styling.

---

## Requirement 7

Dynamic Route

Create:

/words-from-letters/[letters]

Example:

/words-from-letters/aelpp

---

## Requirement 8

SEO Metadata

Generate metadata dynamically.

Title:

Words From Letters AELPP

Description:

Find all valid words that can be created from the letters AELPP.

---

## Requirement 9

Related Searches

Display:

* Unscramble AELPP
* 5 Letter Words From AELPP
* 4 Letter Words From AELPP

Internal links only.

---

# Technical Requirements

Reuse existing:

* dictionary.json
* frequencyMap.json
* definitions.json
* lengthMap.json

Remain JSON based.

Do not introduce a database.

Do not modify existing Unscramble behavior.

---

# Files Likely Affected

app/

* app/page.tsx
* app/words-from-letters/page.tsx
* app/words-from-letters/[letters]/page.tsx

lib/engine/

* lib/engine/wordsFromLetters.ts
* lib/engine/wordStore.ts

Possible Updates:

* data/compiled/*

---

# Out Of Scope

Not included in Release 2:

* Categories
* Daily Challenge
* Word Of The Day
* Synonyms
* Antonyms
* Accounts
* User Profiles
* Leaderboards

---

# Performance Requirements

Target Response Time:

< 500ms

Avoid unnecessary full dictionary scans during page rendering.

Prefer precomputed indexes where possible.

---

# Acceptance Criteria

Release is complete when:

1. User enters letters.

2. Application returns all constructible words.

3. Results are grouped by length.

4. Results are frequency ranked.

5. Dynamic routes function.

6. Metadata is generated.

7. Mobile layout verified.

8. Build succeeds.

9. Existing Unscramble functionality continues working.

10. No TypeScript errors.

---

# Deliverables

Codex should provide:

1. Architecture summary.
2. Files modified.
3. Files created.
4. Build verification.
5. Summary of implementation decisions.
6. Future recommendations.
