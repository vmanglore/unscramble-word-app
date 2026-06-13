# Word Quality Rules

WQ-001
User-visible results must be valid English words backed by the approved dictionary source.

The app must not generate or return arbitrary letter combinations that are not present in the approved dictionary source.

Examples of valid dictionary-backed words that may be returned when present in the approved source:
stream
master
steam
teams
stare
eta
tae
ers
ems
ret

WQ-002
Valid dictionary words should remain available even if they are uncommon, rare, or surprising to casual users.

Uncommon dictionary-backed words can make the game more interesting because users can discover valid words they did not already know.

WQ-003
Abbreviations, acronyms, and fragments should be included or excluded according to the approved dictionary/source policy.

Implementation must not guess that a term is invalid only because it looks uncommon, short, technical, abbreviated, or fragment-like.

WQ-004
Ranking may prioritize:

1. Common English words
2. Frequently used words
3. Longer words
4. Useful words for casual players
5. Rare or uncommon dictionary-backed words

Ranking may place common or useful words first, but valid uncommon dictionary-backed words must not be suppressed or removed solely because they are uncommon.

WQ-005
Results should be useful to humans while preserving dictionary-backed result integrity.

Quality improvements must distinguish invalid/generated/non-dictionary strings from valid uncommon dictionary words.


Temporary Display Quality Policy

Until Word Knowledge Layer classification metadata exists,
the platform may apply limited curated display filtering
to improve Recommended Results.

This filtering:

- Does not affect dictionary validity.
- Does not remove words from the source dictionary.
- Does not affect future Rare Words support.
- Exists solely to improve default user experience.

This policy should be replaced by metadata-driven
classification when Word Knowledge Layer capabilities
become available.
