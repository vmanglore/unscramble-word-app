# Regression History

Purpose:
Track important regressions, bug fixes, and business-rule decisions that affect search behavior, filter handling, and result quality.

This document is a historical companion to the active product rules. The rules remain the source of truth for expected behavior; this file records why specific protections exist and which known issues they guard against.

## RH-001 — Length-filter search returned 0 results for long inputs

Issue:
Length-filter searches returned no results when users entered a long set of letters, even though valid shorter subset matches should have been available.

Status:
Fixed

Related rule IDs:
SB-002, SB-003, SB-006, FLT-001, FLT-002, FLT-008, TR-001, TR-002, TR-004

Notes:
The search experience must support subset searches. A user may enter more letters than a result requires, and a length filter should restrict result word length without converting the query into an exact-anagram search. This protects searches such as a full alphabet input with a shorter requested word length.

## RH-002 — Placeholder and blank filter values affected results

Issue:
Placeholder values or blank filter fields were treated as real filters, causing valid results to be incorrectly removed or search behavior to differ from user intent.

Status:
Fixed

Related rule IDs:
SB-004, SB-005, SB-006, FLT-001, FLT-003, FLT-004, FLT-005, FLT-006, FLT-007, FLT-008, UX-005, UX-006, TR-001, TR-002, TR-004

Notes:
Optional filters must only affect results when the user supplies an intentional value. Blank values must be ignored, and UI placeholder text must never become search input. Multiple intentionally supplied filters are still combined with AND logic.

## RH-003 — Non-dictionary strings appeared in results

Issue:
Invalid/generated/non-dictionary strings can appear in search results when result generation is not constrained by the approved dictionary source. Earlier examples included short low-value entries such as mr, sr, rt, rs, and similar terms whose eligibility depends on the approved source policy.

Status:
Open

Related rule IDs:
PP-001, PP-002, PP-003, WQ-001, WQ-002, WQ-003, WQ-005, DD-001, DD-002, DD-003, DD-004, DD-005, DD-006, TR-001, TR-002, TR-004

Notes:
The product is intended to help users find valid English words from the approved dictionary source, not maximize raw generated combinations. Release 1.1 must protect dictionary-backed result integrity: invalid/generated/non-dictionary strings should never be returned, while uncommon but valid dictionary-backed words such as eta, tae, ers, ems, and ret should remain available when present in the approved source. Abbreviations, acronyms, and fragments should be included or excluded according to the approved dictionary/source policy rather than guessed by implementation.

## RH-004 — Searches incorrectly required all entered letters

Issue:
Search behavior could regress into requiring every entered letter to be used, which breaks subset-search use cases and makes long inputs behave as if exact anagram mode were always enabled.

Status:
Fixed

Related rule IDs:
SB-001, SB-002, SB-003, SB-006, FLT-008, TR-001, TR-002, TR-004

Notes:
Exact anagram searches are valid, but the general search mode must not require all entered letters unless an explicit exact-anagram mode exists. This distinction is central to long-input searches and filtered subset results.

## RH-005 — Result ranking favored quantity over useful words

Issue:
Search results risked surfacing rare or low-use entries ahead of words that are more useful to humans.

Status:
Open

Related rule IDs:
PP-001, PP-002, PP-003, WQ-001, WQ-004, WQ-005, DD-001, DD-002, DD-003, UX-003, TR-003, TR-004

Notes:
Word quality is an ongoing business-rule concern. Ranking may prioritize common, frequently used, longer, and broadly useful English words before rare words, but ranking must not suppress valid uncommon words solely because they are uncommon. Dictionary updates and ranking changes should be validated so invalid/generated/non-dictionary strings are not introduced or promoted.

## RH-006 — Filter behavior instability across releases

Issue:
Optional filters and combined filter behavior have been a recurring regression risk, especially when search logic changes are made without updating rules and tests together.

Status:
Open

Related rule IDs:
SB-006, FLT-001, FLT-002, FLT-003, FLT-004, FLT-005, FLT-006, FLT-007, FLT-008, TR-001, TR-002, TR-003, TR-004, CW-001, CW-002, CW-003, CW-007

Notes:
Filter behavior must remain stable across releases. Future changes should review the rule documents first, update business rules when behavior changes intentionally, and include regression coverage that cites the applicable rule IDs.
