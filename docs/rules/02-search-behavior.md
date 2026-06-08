# Search Behavior Rules

SB-001
Exact anagram searches should return valid words.

Example:
aelpp -> apple

SB-002
Subset searches are supported.

Users may enter more letters than required.

Example:
abcdefghijklmnopqrstuvwxyz

should return valid words.

SB-003
Searches must not require all entered letters
unless an explicit exact-anagram mode exists.

SB-004
Blank filters must not affect results.

SB-005
Placeholder values must never be treated as filter values.

SB-006
Search behavior must remain consistent across releases.