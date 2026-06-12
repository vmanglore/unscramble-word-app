# Internal Linking Specification

Version: 1.0

Status: Active

Priority: High

Related Documents:

* STRATEGIC_POSITIONING.md
* WORD_KNOWLEDGE_LAYER.md
* SEO_OPPORTUNITY_MATRIX.md
* ARCHITECTURE.md

---

# Purpose

This document defines how pages within the platform should link to each other.

Internal linking serves four primary goals:

1. Improve user discovery.
2. Improve SEO.
3. Improve crawl efficiency.
4. Increase engagement.

Every page should help users answer their current question while encouraging exploration of related content.

---

# Core Principle

A page should never be a dead end.

Every page should provide meaningful pathways to additional relevant content.

---

# Internal Linking Objectives

## User Objective

Help users discover useful content quickly.

Example:

```text
Unscramble APPLE
    ↓
5 Letter Words
    ↓
Words Starting With A
    ↓
Words Ending With LE
```

Users should naturally continue exploring.

---

## SEO Objective

Distribute authority across the site.

Benefits:

* Improved crawl coverage
* Faster indexing
* Better page discovery
* Stronger topical relevance

---

## Platform Objective

Increase pages viewed per session.

Success Metric:

```text
Pages Per Session
```

Target:

Increase over time through intelligent linking.

---

# Linking Hierarchy

Internal links should follow a logical hierarchy.

---

## Level 1

Primary Navigation

Available on all pages.

Examples:

```text
Home
Word Finder
Words From Letters
```

Purpose:

Site-wide navigation.

---

## Level 2

Page Context Links

Links directly related to the current page.

Example:

```text
Unscramble APPLE
```

Links:

```text
5 Letter Words
Words Starting With A
Words Ending With LE
```

Purpose:

Immediate relevance.

---

## Level 3

Discovery Links

Links that encourage exploration.

Examples:

```text
Related Words
Popular Words
Similar Patterns
```

Purpose:

Increase engagement.

---

## Level 4

Knowledge Links

Future Word Knowledge Layer integration.

Examples:

```text
Related Words
Word Families
Categories
Topics
```

Purpose:

Knowledge graph expansion.

---

# Global Linking Rules

## Rule 1

Every indexable page must contain at least:

```text
5-10 internal links
```

---

## Rule 2

Links must be relevant.

Never create links solely for SEO.

Bad:

```text
Random word pages
```

Good:

```text
Closely related word pages
```

---

## Rule 3

Important pages should receive more links.

Examples:

```text
Home
Word Finder
Words From Letters
```

These should receive links from many areas.

---

## Rule 4

Links should be crawlable.

Requirements:

* Standard anchor tags
* Server-rendered when possible
* Not hidden behind JavaScript interactions

---

# Page-Specific Linking Rules

---

# Home Page

Purpose:

Primary hub.

Should link to:

```text
Unscramble Tool
Word Finder
Popular Categories
Popular Searches
```

Target:

20+ internal links.

---

# Unscramble Pages

Example:

```text
/unscramble/apple
```

Should link to:

```text
5 Letter Words
Words Starting With A
Words Ending With LE
Words Containing P
Related Searches
```

Target:

10-20 internal links.

---

# Word Length Pages

Example:

```text
/word-length/5
```

Should link to:

```text
4 Letter Words
6 Letter Words
Popular Starting Letters
Popular Ending Letters
```

Target:

10-15 internal links.

---

# Starts With Pages

Example:

```text
/words-starting-with/a
```

Should link to:

```text
Related Starting Letters
Popular Word Lengths
Ending Pages
```

Target:

10-15 internal links.

---

# Ends With Pages

Example:

```text
/words-ending-with/ing
```

Should link to:

```text
Related Suffixes
Length Pages
Popular Searches
```

Target:

10-15 internal links.

---

# Contains Pages

Example:

```text
/words-containing/ing
```

Should link to:

```text
Starts With Pages
Ends With Pages
Pattern Pages
```

Target:

10-15 internal links.

---

# Future Word Pages

Example:

```text
/word/apple
```

Should link to:

```text
Definition
Related Words
Word Family
Categories
Similar Words
```

Target:

15-25 internal links.

---

# Related Links Component

A reusable component should eventually power most page-level internal linking.

Example:

```text
Related Searches
```

Possible contents:

```text
Words Starting With A
Words Ending With LE
Words Containing PP
5 Letter Words
```

Benefits:

* Consistent UX
* Consistent SEO
* Easier maintenance

---

# Anchor Text Rules

Anchor text should be descriptive.

Good:

```text
5 Letter Words
Words Starting With A
Words Ending With ING
```

Bad:

```text
Click Here
Read More
View Page
```

---

# Breadcrumb Strategy

Every indexable page should support breadcrumbs.

Example:

```text
Home
  >
Words From Letters
  >
APPLE
```

Benefits:

* User navigation
* Structured data
* SEO

---

# Related Searches Strategy

Related searches should be:

* Relevant
* Useful
* Predictable

Not random.

Example:

For:

```text
APPLE
```

Good:

```text
5 Letter Words
Words Starting With A
Words Ending With LE
```

Bad:

```text
Zebra
Quantum
Banana
```

---

# Future Knowledge Layer Integration

Future links may be generated from metadata.

Example:

```text
APPLE
```

Knowledge Layer:

```text
Fruit
Orchard
Pear
Food
```

Links:

```text
Related Fruits
Related Foods
Related Vocabulary
```

This becomes a major discovery engine.

---

# Crawl Efficiency Rules

Avoid excessive links.

Maximum guideline:

```text
100 links per page
```

Most pages should remain below:

```text
50 links
```

Quality is more important than quantity.

---

# Internal Link Priority

Highest Priority

```text
Home
Word Finder
Words From Letters
```

---

Medium Priority

```text
Word Length Pages
Starts With Pages
Ends With Pages
Contains Pages
```

---

Future Priority

```text
Word Pages
Knowledge Pages
Category Pages
```

---

# Metrics

Monitor:

```text
Pages Per Session
Average Session Duration
Crawl Coverage
Indexed Pages
Internal Link Count
```

Success occurs when users naturally move between related pages without needing to return to search engines.

---

# Future Evolution

Phase 1

Manual linking.

---

Phase 2

Rule-based linking.

Examples:

```text
Length
Prefix
Suffix
Contains
```

---

Phase 3

Knowledge-layer linking.

Examples:

```text
Related Words
Word Families
Categories
Difficulty Groups
```

---

Phase 4

Intelligent discovery engine.

Links generated from:

```text
Word relationships
Popularity
User behavior
Knowledge graph
```

---

# Guiding Principle

Every page should answer a question.

Every page should also suggest the next question.

Internal linking is the mechanism that turns a collection of pages into a discovery platform.
