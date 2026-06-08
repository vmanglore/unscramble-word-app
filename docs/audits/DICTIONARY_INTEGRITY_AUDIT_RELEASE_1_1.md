# Dictionary Integrity Audit: Release 1.1

## 1. Scope Reviewed

This audit reviewed dictionary data and search indexes only. It did not modify application code, dictionary data, compiled data, or tests.

Reviewed surfaces:

- Product and audit rules in `docs/rules/*`.
- Release 1.1 roadmap/audit documents in `docs/roadmap/RELEASE_1_1_AUDIT.md` and `docs/roadmap/RELEASE_1_1_EXECUTION_PLAN.md`.
- Regression tests in `tests/*`.
- Current dictionary source files: `data/source/dictionary.json`, `data/source/words.txt`, and the older/raw fixture `data/raw/words.txt`.
- Current compiled dictionary/search files: `data/compiled/signatureMap.json`, `data/compiled/startsWithMap.json`, `data/compiled/endsWithMap.json`, `data/compiled/lengthMap.json`, `data/compiled/frequencyMap.json`, `data/compiled/definitions.json`, and `data/compiled/patternIndex.json`.
- Dictionary/index generation scripts: `scripts/buildIndex.ts`, `scripts/buildSEO.ts`, and `scripts/build-word-maps.ts`.
- Runtime dictionary consumers: `lib/engine/wordStore.ts`, `lib/engine/wordsFromLetters.ts`, and `lib/engine/search.ts`.

Out of scope:

- Reclassifying uncommon but source-backed words as invalid solely because they are obscure.
- Ranking-quality changes.
- Any dictionary cleanup or compiled-index regeneration.

## 2. Sources Checked

### Rules and release documents

- `docs/rules/01-product-principles.md`
  - PP-001: the app helps users find meaningful English words.
  - PP-002 through PP-003: quality and UX are more important than result count.
  - PP-007: business rules take precedence over implementation shortcuts.
- `docs/rules/03-word-quality.md`
  - WQ-001: user-visible results must be valid English words backed by the approved dictionary source.
  - WQ-002: uncommon valid dictionary words should remain available.
  - WQ-003: abbreviations, acronyms, and fragments need approved source policy rather than implementation guesses.
  - WQ-004: ranking may prioritize common/useful words, but must not suppress valid uncommon words solely for rarity.
- `docs/rules/07-data-dictionary.md`
  - DD-002: approved dictionary source is the authority for validity.
  - DD-003: dictionary updates must not reintroduce invalid/generated/non-dictionary strings.
  - DD-004: uncommon approved words should remain available.
  - DD-005: abbreviation/acronym/fragment handling must follow approved policy.
  - DD-007: search indexes must remain consistent with source data.
- `docs/rules/08-testing-regression.md`
  - TR-004: tests should reference applicable rule IDs.
  - TR-005: lint and build must pass before PR creation.
- `docs/rules/CODEX_AUDIT_RULES.md`
  - Source-of-truth order: rules, tests, roadmap, implementation.
  - Evidence must be specific, reproducible, and attributable.
- `docs/rules/10-regression-history.md`
  - RH-003 remains open for non-dictionary strings in results and explicitly says Release 1.1 must preserve uncommon approved words such as `eta`, `tae`, `ers`, `ems`, and `ret` while excluding invalid/generated strings.
  - RH-005 remains open for ranking quality and is separate from dictionary integrity.
- `docs/roadmap/RELEASE_1_1_AUDIT.md`
  - Prior Release 1.1 audit flagged dictionary-backed result integrity, short-entry handling, and ranking as required follow-up areas.
- `docs/roadmap/RELEASE_1_1_EXECUTION_PLAN.md`
  - Release 1.1 execution planning separates dictionary integrity from ranking/UX and emphasizes business-rule consistency.

### Tests

- `tests/unscrambleSearch.test.ts`
  - Confirms subset search behavior, exact `aelpp -> apple`, blank-filter behavior, combined-filter behavior, and dictionary-backed uncommon examples.
  - Uses `getAllWords()` from compiled `lengthMap.json` as the approved-word set at test time, meaning tests currently validate output against compiled data rather than directly against `data/source/dictionary.json`.
- `tests/registerPathAlias.cjs`
  - Provides the CommonJS test alias shim for `@/` imports.
- `tests/tsconfig.json`
  - Uses CommonJS module output for the Node test harness.

### Dictionary and index files

- `data/source/dictionary.json`
- `data/source/words.txt`
- `data/raw/words.txt`
- `data/compiled/signatureMap.json`
- `data/compiled/startsWithMap.json`
- `data/compiled/endsWithMap.json`
- `data/compiled/lengthMap.json`
- `data/compiled/frequencyMap.json`
- `data/compiled/definitions.json`
- `data/compiled/patternIndex.json`

### Reproducible audit commands

The following read-only commands were used for this audit:

```bash
find data -maxdepth 3 -type f -print | sort
wc -c data/source/dictionary.json data/source/words.txt data/compiled/*.json
node /tmp/audit-dict.js > /tmp/audit-summary.json
npm test
npm run lint
npm run build
```

`/tmp/audit-dict.js` was a temporary local audit script that read JSON files and compared normalized source words to compiled index contents. It did not write to the repository.

## 3. Dictionary Source Summary

### Approved dictionary source currently used

`data/source/dictionary.json` is the approved dictionary source currently used by the documented Release 1.1 index build path.

Evidence:

- `scripts/buildIndex.ts` sets `SOURCE_PATH` to `data/source/dictionary.json`.
- `scripts/buildIndex.ts` reads that JSON array, normalizes each `entry.word`, rejects invalid words outside `[a-z]` or outside length 2 through 20, and builds `signatureMap`, `startsWithMap`, `endsWithMap`, `lengthMap`, `frequencyMap`, and `definitions` from the valid normalized set.
- `scripts/buildIndex.ts` also writes `data/source/words.txt` from the same sorted valid source set, making `data/source/words.txt` a derived source-word export, not the primary source.

Summary from read-only audit:

| Item | Count | Evidence | Recommendation |
| --- | ---: | --- | --- |
| Raw entries in `data/source/dictionary.json` | 25,000 | JSON array length from audit script | Keep as current primary source until a stronger policy source is approved. |
| Valid normalized source words used by the compiled maps | 24,297 | Words passing `scripts/buildIndex.ts` validation: length 2-20 and `/^[a-z]+$/` | Keep; this is the source-backed runtime vocabulary. |
| Invalid source entries filtered out by build rules | 703 | 26 too-short entries and 677 non-alphabetic entries | Review/remove from source in a future dictionary cleanup task; do not change in this audit. |
| Duplicate normalized source entries | 0 | No repeated normalized `word` values found | No action. |
| `data/source/words.txt` entries | 24,297 unique entries | Matches valid normalized `dictionary.json` set exactly | Keep as generated export; document generation. |
| `data/raw/words.txt` entries | 28 unique entries | Small fixture-like list: `apple`, `angle`, `amble`, `banana`, `orange`, `listen`, etc. | Review as legacy/demo input because older scripts still reference it. |

### Source malformed/non-alphabetic examples

These entries are present in `data/source/dictionary.json` but are currently filtered out by `scripts/buildIndex.ts`. They are not present in the compiled runtime maps generated by the current build path.

| Classification | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| Remove | `data/source/dictionary.json` | `a`, `i`, `s`, `d`, `b` | Too short for current source policy (`MIN_WORD_LENGTH = 2`). Single-letter entries may be dictionary symbols, but current runtime policy excludes them. | Remove or move to an explicitly excluded/source-raw layer in a future dictionary data cleanup. |
| Remove | `data/source/dictionary.json` | `00`, `0000`, `000`, `1`, `2`, `0.0`, `00.0`, `00th`, `0,000`, `00,000` | Non-alphabetic numeric artifacts; not valid `[a-z]+` word entries for this app. | Remove from approved source or document as raw rejected artifacts. |
| Review | `data/source/dictionary.json` | `it's`, `i'm`, `don't`, `you're`, `that's`, `can't`, `i've`, `didn't`, `i'll` | Contractions are valid English tokens but violate current alphabet-only compiled-index policy. | Product decision: either keep excluded under current app rules, or create a normalized/token policy in a future release. |
| Review | `data/source/dictionary.json` | `u.s`, `c.j`, `garcía`, `française`, `è`, `ó`, `é` | Punctuation/diacritics are not supported by current index validation. Some may be proper names/foreign-language terms rather than target dictionary words. | Product decision; do not silently include without a source policy. |
| Review | `data/source/dictionary.json` | `united's`, `manager's`, `monday's`, `province's`, `district's`, `duke's`, `grandmother's` | Possessives are English text tokens but not current alphabet-only word entries. | Product decision; likely keep excluded unless possessive support is explicitly added. |

## 4. Compiled Index Summary

### Main compiled maps generated from approved source

`signatureMap.json`, `startsWithMap.json`, `endsWithMap.json`, `lengthMap.json`, `frequencyMap.json`, and `definitions.json` are generated or documented by `scripts/buildIndex.ts`.

| Compiled file | Unique words / keys | Source consistency | Notes |
| --- | ---: | --- | --- |
| `data/compiled/signatureMap.json` | 24,297 unique words / 22,171 signature keys | 0 entries missing from source; 0 valid source words missing | Consistent with `data/source/dictionary.json` under current normalization. |
| `data/compiled/startsWithMap.json` | 24,297 unique words / 26 first-letter keys | 0 entries missing from source; 0 valid source words missing | Consistent. |
| `data/compiled/endsWithMap.json` | 24,297 unique words / 20,351 suffix keys | 0 entries missing from source; 0 valid source words missing | Consistent with current script, which indexes suffix lengths 1 through 5. |
| `data/compiled/lengthMap.json` | 24,297 unique words / 17 length keys | 0 entries missing from source; 0 valid source words missing | Consistent. Length keys cover current valid source lengths. |
| `data/compiled/frequencyMap.json` | 24,297 keys | 0 entries missing from source; 0 valid source words missing from frequency map | Consistent; every valid source word has a numeric frequency value. |
| `data/compiled/definitions.json` | 13,495 keys | 0 entries missing from source; 10,802 source words have no compiled definition | Partial by design of source metadata; not a word-index integrity failure. |

Additional consistency checks:

- No duplicate entries were found inside map arrays for `signatureMap`, `startsWithMap`, `endsWithMap`, `lengthMap`, or `patternIndex`.
- No malformed or non-alphabetic entries were found in `signatureMap`, `startsWithMap`, `endsWithMap`, `lengthMap`, `frequencyMap`, or `definitions`.
- All checked keys matched their expected semantics:
  - signature keys matched sorted letters.
  - starts-with keys matched first letter.
  - ends-with keys matched suffix.
  - length keys matched word length.

### Pattern index inconsistency

`data/compiled/patternIndex.json` is inconsistent with the approved source and the other compiled maps.

Evidence:

- `scripts/buildSEO.ts` builds `patternIndex.json` from `data/source/words.txt`.
- Current `data/compiled/patternIndex.json` contains only 21 unique words and 104 pattern keys.
- Four words in `patternIndex.json` are not in the current approved source/derived source-word export: `amble`, `inlets`, `peal`, and `tamers`.
- `patternIndex.json` is missing 24,280 valid source-backed words.
- The contents match the older 28-word `data/raw/words.txt`/demo vocabulary shape more closely than the current 24,297-word approved source export.

| Classification | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| Remove from compiled index or regenerate | `data/compiled/patternIndex.json` | `amble`, `inlets`, `peal`, `tamers` | Entries are present in compiled pattern data but absent from current approved source data. This violates DD-002 and DD-007 for pattern search. | Regenerate `patternIndex.json` from current `data/source/words.txt` after product confirms pattern-search indexing scope. |
| Review | `data/compiled/patternIndex.json` | `apple`, `angle`, `banana`, `orange`, `listen`, `silent`, `enlist`, `stream`, `master` | These are source-backed words, but the index is only a tiny subset and therefore incomplete for the current source. | Decide whether pattern search should use full source vocabulary or an intentionally scoped curated subset; document the policy. |
| Review | `data/raw/words.txt` | `apple`, `angle`, `amble`, `banana`, `orange`, `listen`, `silent`, `enlist`, `inlets`, `tamers`, `peal` | Legacy/demo raw list includes words missing from the current approved source and appears related to stale pattern-index contents. | Either remove legacy dependency from scripts or document it as test/demo-only data. |

## 5. Integrity Findings

| Severity | Finding | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- | --- |
| Critical | Pattern index contains words not backed by approved source. | `data/compiled/patternIndex.json`; `data/source/dictionary.json`; `data/source/words.txt` | `amble`, `inlets`, `peal`, `tamers` | WQ-001 and DD-002 require user-visible results to be backed by the approved source. `lib/engine/search.ts` returns `patternIndex` results directly for pattern lookup. | Regenerate or remove stale pattern-index entries after confirming pattern-search policy. Add a regression test that every compiled pattern-index result exists in the approved source. |
| Critical | Pattern index is missing almost the entire approved source vocabulary. | `data/compiled/patternIndex.json`; `data/source/words.txt` | Missing examples: `aa`, `aaa`, `aap`, `aaron`, `ab`, `abandon`, `abandoned`, `abbreviation`, `ability`, `able` | DD-007 requires search indexes to remain consistent with source data. Pattern search currently cannot represent most source-backed words. | Regenerate full pattern index or document explicit curated-scope exclusions and align tests/business rules. |
| High | Generation paths are fragmented and partially undocumented in package scripts. | `scripts/buildIndex.ts`; `scripts/buildSEO.ts`; `scripts/build-word-maps.ts`; `package.json` | `scripts/buildIndex.ts` uses `data/source/dictionary.json`; `scripts/buildSEO.ts` uses `data/source/words.txt`; `scripts/build-word-maps.ts` uses `data/raw/words.txt`; `package.json` has no dictionary build script | Multiple scripts can write overlapping compiled files from different sources. This creates high risk of stale or mixed-source indexes. | Add one documented npm script for the approved dictionary build and retire or clearly label legacy/demo builders. |
| High | Approved source contains 703 entries that current build rules reject. | `data/source/dictionary.json` | `a`, `i`, `00`, `0000`, `it's`, `don't`, `u.s`, `garcía`, `française` | Current compiled indexes are clean because build logic filters these entries, but the approved source itself mixes valid words, symbols, contractions, numerics, possessives, and non-ASCII tokens. | Clean or tier source data into raw vs approved layers. Keep uncommon valid words; remove malformed artifacts. |
| Medium | Definitions are incomplete for 10,802 source-backed words. | `data/compiled/definitions.json`; `data/source/dictionary.json` | Missing definition examples: `aaa`, `aap`, `abandoning`, `abba`, `abbott`, `abc`, `abd`, `abdel`, `abducted`, `abdul` | Not all valid source words have definitions. This is not a dictionary-validity failure, but features that display definitions must handle blanks. | Keep words available; optionally enrich definitions in a separate content-quality task. |
| Medium | Tests validate dictionary-backed output against compiled `lengthMap`, not directly against the approved source. | `tests/unscrambleSearch.test.ts`; `lib/engine/wordStore.ts` | Test builds `approvedWords` from `getAllWords()`, which reads compiled `lengthMap.json` | A stale compiled map could satisfy the test while drifting from `data/source/dictionary.json`. | Add data-integrity tests comparing compiled maps against normalized approved source data. |
| Medium | Two-letter and three-letter vocabulary is very large and contains many abbreviation/acronym-like entries that need product policy review. | `data/source/words.txt`; `data/compiled/lengthMap.json`; `lib/engine/wordsFromLetters.ts` | Two-letter examples: `bb`, `bc`, `bd`, `bf`, `bg`, `bj`, `bk`, `bn`, `bp`, `bs`, `bt`, `cb`, `cc`; three-letter examples: `abc`, `afc`, `aol`, `bbc`, `bjp`, `bmi`, `bmw`, `cbs`, `cnn`, `dvd`, `ftp`, `gdp`, `gps`, `kgb`, `nfl`, `nyc` | These entries are source-backed, so they should not be removed solely for obscurity. However, DD-005 requires explicit abbreviation/acronym policy. | Product review: classify abbreviation/acronym-only entries as keep/review/remove by policy, separate from ranking. |
| Low | `wordsFromLetters` has a display/ranking-oriented low-value short-word filter that is separate from core dictionary integrity. | `lib/engine/wordsFromLetters.ts` | `sd`, `sf`, `td`, `ts`, `djs`, `drs`, `fdr`, `hrs`, `idf`, `itv`, `tvs`, `vhs` | This does not remove source words from compiled data, but product rules require separating ranking/display quality from validity. | Keep as display UX behavior only if documented; avoid using it as dictionary-validity evidence. |

## 6. Suspicious Entries for Product Review

Important: the following entries are suspicious for policy review, not automatically invalid. Per WQ-002/DD-004, valid dictionary words should remain available even if uncommon. The recommended classifications below distinguish source-backed uncommon words from malformed/stale artifacts.

### Keep: source-backed valid dictionary words or accepted short words

These entries are source-backed and/or explicitly protected by current regression expectations. They should remain available unless the approved dictionary source policy changes.

| Classification | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| Keep | `data/source/words.txt`; `data/compiled/lengthMap.json`; `tests/unscrambleSearch.test.ts` | `eta`, `tae`, `ers`, `ems`, `ret` | RH-003 and regression tests explicitly protect uncommon approved dictionary words. | Keep available; handle ranking separately. |
| Keep | `data/source/words.txt`; `data/compiled/lengthMap.json`; `lib/engine/wordsFromLetters.ts` | `am`, `an`, `as`, `at`, `ax`, `be`, `by`, `do`, `ex`, `go`, `he`, `hi`, `if`, `in`, `is`, `it`, `me`, `my`, `no`, `of`, `oh`, `on`, `or`, `ox`, `pa`, `so`, `to`, `up`, `us`, `we` | These are in the source-backed compiled data and are included in the explicit `commonTwoLetterWords` display allowlist. | Keep. |
| Keep | `data/source/words.txt`; `data/compiled/lengthMap.json` | `aa`, `ae`, `ai`, `ar`, `ba`, `bi`, `bo`, `de`, `ed`, `ef`, `eh`, `el`, `em`, `en`, `er`, `es`, `et`, `fe`, `gi`, `id`, `jo`, `ka`, `ki`, `ko`, `la`, `li`, `lo`, `ma`, `mi`, `mu`, `ne`, `nu`, `od`, `oe`, `oi`, `om`, `op`, `os`, `ow`, `oy`, `pe`, `pi`, `qi`, `re`, `si`, `ta`, `te`, `ti`, `ut`, `xi`, `xu`, `ya`, `ye`, `yo`, `za` | Source-backed short words that look uncommon but may be valid dictionary/game words. | Keep pending source policy; do not remove for obscurity. Ranking may place them lower. |

### Review: abbreviation, acronym, proper-name, fragment, or source-policy ambiguity

The current source contains 465 two-letter entries and 1,232 three-letter entries. The following representative entries should be reviewed under an explicit abbreviation/acronym/proper-name policy.

| Classification | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| Review | `data/source/words.txt`; `data/compiled/lengthMap.json` | `bb`, `bc`, `bd`, `bf`, `bg`, `bj`, `bk`, `bn`, `bp`, `bs`, `bt`, `cb`, `cc`, `cd`, `cf`, `cg`, `cj`, `ck`, `cm`, `cn`, `cp`, `cs`, `ct`, `cv`, `cw`, `db`, `dc`, `df`, `dg`, `dj`, `dk`, `dl`, `dm`, `dp`, `dr`, `ds`, `dt`, `dv`, `dx` | Two-letter combinations are source-backed but many appear abbreviation/code-like rather than standalone words for casual users. | Product review; keep source-backed until explicit policy says otherwise. |
| Review | `data/source/words.txt`; `data/compiled/lengthMap.json` | `abc`, `afc`, `afl`, `afp`, `aol`, `apa`, `apc`, `apr`, `asl`, `atm`, `atp`, `atv`, `avg`, `bbc`, `bbq`, `bce`, `bjp`, `bmi`, `bmw`, `bnp`, `btw`, `cbc`, `cbd`, `cbs`, `cdc`, `ceo`, `cfl`, `cia`, `cma`, `cms`, `cnn`, `cpc`, `cpr`, `css`, `dvd`, `fcc`, `fdr`, `ftp`, `gdp`, `gps`, `irs`, `jfk`, `kfc`, `kgb`, `llc`, `ltd`, `mlb`, `nfl`, `nhl`, `nyc`, `pdf`, `usa`, `www` | Acronym/initialism-like entries may be valid in a broad corpus but need an approved dictionary policy for this product. | Product review; consider display/ranking treatment separately from source validity. |
| Review | `data/source/words.txt`; `data/compiled/lengthMap.json` | `aaron`, `abby`, `abdel`, `abdul`, `abdullah`, `abigail`, `aberdeen`, `ali`, `amy`, `ann` | Proper names/places are source-backed but may or may not align with “meaningful English words” for the game experience. | Product review; do not remove without policy because they are backed by the current source. |
| Review | `lib/engine/wordsFromLetters.ts`; `data/source/words.txt` | `dir`, `dis`, `div`, `djs`, `drs`, `fdr`, `fri`, `gis`, `gst`, `hrs`, `idf`, `ifs`, `irs`, `ist`, `itv`, `rts`, `sd`, `sf`, `sgt`, `sid`, `sti`, `std`, `str`, `td`, `tds`, `thi`, `tis`, `ti`, `tri`, `ts`, `tvs`, `vhs`, `vis` | App already treats these as low-value short words in one UI path, which is a useful review seed but not validity proof. | Product review for abbreviation/fragment policy; keep source data unchanged until policy is approved. |

### Remove: malformed or not backed by approved source

| Classification | File path | Example entries | Reason | Recommended action |
| --- | --- | --- | --- | --- |
| Remove | `data/compiled/patternIndex.json` | `amble`, `inlets`, `peal`, `tamers` | Compiled pattern-index entries are absent from current approved source and derived `data/source/words.txt`. | Remove by regenerating `patternIndex.json` from the current approved source or by removing stale index. |
| Remove | `data/source/dictionary.json` | `00`, `0000`, `000`, `1`, `2`, `0.0`, `00.0`, `00th`, `0,000`, `00,000`, `3x`, `4a`, `p3`, `t3`, `twenty00`, `000d`, `g3` | Numeric/non-alphabetic artifacts cannot be valid runtime word entries under the current source/index policy. | Remove from approved source or keep only in a raw rejected layer. |
| Remove | `data/source/dictionary.json` under current min-length policy | `a`, `i`, `s`, `d`, `b`, `m`, `t`, `e`, `r`, `l`, `p` | Single-letter entries are currently rejected by `MIN_WORD_LENGTH = 2`; runtime indexes do not include them. | Remove from approved source or explicitly document as excluded raw tokens. |

## 7. Keep / Review / Remove Recommendations

### Keep

- Keep `data/source/dictionary.json` as the current approved source for Release 1.1 until a replacement source policy is approved.
- Keep the 24,297 valid normalized source-backed words available in the main compiled maps.
- Keep uncommon source-backed words such as `eta`, `tae`, `ers`, `ems`, and `ret`; their rarity is a ranking issue, not dictionary-integrity evidence.
- Keep main compiled maps (`signatureMap`, `startsWithMap`, `endsWithMap`, `lengthMap`, `frequencyMap`) as consistent with current approved source.

### Review

- Review abbreviation/acronym/proper-name policy for short source-backed entries.
- Review whether pattern search should be a full-source index or an intentionally curated SEO/demo index.
- Review whether `definitions.json` completeness matters for Release 1.1 UX; missing definitions are not invalid words.
- Review legacy script/source paths: `data/raw/words.txt` and `scripts/build-word-maps.ts` should not be able to overwrite production compiled maps without explicit intent.

### Remove

- Remove or regenerate stale `patternIndex.json` entries that are not backed by the approved source (`amble`, `inlets`, `peal`, `tamers`).
- Remove malformed/numeric/non-alphabetic raw source artifacts from the approved source in a future dictionary-data cleanup, or move them to a clearly rejected raw layer.
- Do not remove obscure valid source-backed entries solely because they are unfamiliar.

## 8. Risks

| Risk | Impact | Evidence | Mitigation |
| --- | --- | --- | --- |
| Stale `patternIndex.json` can return non-source-backed words. | Product-rule violation for pattern search; possible recurrence of RH-003. | `patternIndex.json` includes `amble`, `inlets`, `peal`, `tamers` while approved source does not. | Regenerate from approved source and add source-vs-compiled integrity tests. |
| Multiple build scripts can write overlapping compiled files from different sources. | Future releases can accidentally mix demo/raw data with approved dictionary data. | `scripts/buildIndex.ts`, `scripts/buildSEO.ts`, and `scripts/build-word-maps.ts` read different source files. | Create one authoritative dictionary build command and mark old scripts legacy or remove them. |
| Short abbreviation/acronym entries may confuse users if surfaced highly. | UX/ranking quality issue, not automatic dictionary-integrity failure. | 465 two-letter and 1,232 three-letter source-backed entries; many look acronym-like. | Add product policy and ranking/display rules; keep source-backed entries until policy changes. |
| Tests can miss source/compiled drift. | Stale compiled data may pass tests if tests derive approved words from compiled maps. | Current test-approved set uses `getAllWords()` from compiled `lengthMap`. | Add direct data-integrity regression tests reading `data/source/dictionary.json`. |
| Source cleanup could accidentally remove valid uncommon words. | Violates WQ-002/DD-004 and reduces discovery value. | Rules explicitly distinguish invalid/generated strings from uncommon dictionary-backed words. | Require product review classifications before any dictionary removals. |

## 9. Recommended Follow-up Codex Tasks

1. **Add dictionary source-vs-compiled integrity tests.**
   - Read `data/source/dictionary.json`, apply the documented normalization/validation rules, and assert exact equality with `signatureMap`, `startsWithMap`, `endsWithMap`, `lengthMap`, and `frequencyMap` word sets.
   - Assert compiled maps contain no malformed/non-alphabetic words.
   - Assert compiled map arrays contain no duplicates.

2. **Fix or document `patternIndex.json`.**
   - Decide whether pattern search should index all 24,297 approved words or a documented curated subset.
   - Regenerate `patternIndex.json` from the approved current source if full-source pattern search is intended.
   - Add tests ensuring every pattern-index result exists in approved source.

3. **Create an authoritative dictionary build command.**
   - Add an npm script such as `npm run build:dictionary` for the approved build path.
   - Document `scripts/buildIndex.ts` as the production dictionary/index builder.
   - Rename, remove, or label `scripts/build-word-maps.ts` and `data/raw/words.txt` as legacy/demo-only if they remain.

4. **Create a short-word policy review document.**
   - Classify two-letter and three-letter entries into `Keep`, `Review`, and `Remove` with product rationale.
   - Explicitly address abbreviations, acronyms, fragments, proper names, corpus artifacts, and game-valid uncommon words.
   - Keep ranking/display recommendations separate from source-validity decisions.

5. **Clean approved source only after product policy approval.**
   - Remove numeric/non-alphabetic artifacts or move them to a raw rejected layer.
   - Preserve valid uncommon dictionary words.
   - Regenerate compiled indexes and run source-vs-compiled tests after cleanup.

6. **Add documentation for definition coverage.**
   - Document that missing definitions do not invalidate words.
   - Add UX handling if definition display is expanded.

## Test Results

| Command | Result |
| --- | --- |
| `npm test` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
