# UnscrambleWordNow Architecture

## Repository

vmanglore/unscramble-word-app

---

## Hosting

Vercel

Domain:

unscramblewordnow.com

---

## Technology

* Next.js App Router
* TypeScript

---

## Core Routes

```text
/unscramble/[letters]
/word-length/[length]
/words-starting-with/[letter]
/words-ending-with/[suffix]
/words-with-pattern/[pattern]
```

---

## Current Dictionary Architecture

### Source of Truth

```text
data/source/dictionary.json
```

### Generated Artifacts

```text
data/source/words.txt

data/compiled/signatureMap.json
data/compiled/patternIndex.json
data/compiled/lengthMap.json
data/compiled/startsWithMap.json
data/compiled/endsWithMap.json
data/compiled/frequencyMap.json
```

### Build Flow

```text
dictionary.json
        ↓
scripts/buildIndex.ts
        ↓
words.txt
        ↓
compiled indexes
        ↓
runtime search
```

---

## Runtime Search Architecture

Current search indexes:

* signatureMap.json
* patternIndex.json
* startsWithMap.json
* endsWithMap.json
* lengthMap.json
* frequencyMap.json

Search pages consume compiled indexes rather than raw dictionary sources.

---

## Future Dictionary Source Strategy

### Objective

Build a proprietary word intelligence platform on top of multiple trusted sources.

The platform should not depend on a single dictionary provider.

---

### Tier 1 Sources (Preferred)

Open, automation-friendly sources.

#### Wiktionary

Purpose:

* Definitions
* Parts of speech
* Etymology
* Broad word coverage

#### Wordfreq

Purpose:

* Frequency data
* Popularity rankings
* Common word detection

#### SCOWL

Purpose:

* Curated English word validation
* Supplemental word coverage

#### ENABLE

Purpose:

* Word-game compatibility
* Additional word coverage

---

### Tier 2 Sources (Optional Future)

Commercial metadata providers.

#### Merriam-Webster

Potential use:

* Enhanced definitions
* Pronunciations
* Educational metadata

#### Oxford

Potential use:

* Enhanced definitions
* Pronunciations
* Educational metadata

These sources should only be evaluated if they provide meaningful value beyond Tier 1 sources.

---

### Tier 3 Sources (Specialized Future)

Game-specific lexicons.

#### NWL

Official North American Scrabble lexicon.

#### CSW

Official international Scrabble lexicon.

Potential future use:

* Word Games Profile
* Tournament Scrabble support

---

## Long-Term Knowledge Layer Vision

Future architecture:

```text
Dictionary Sources
        ↓
Normalization
        ↓
Word Knowledge Layer
        ↓
Compiled Indexes
        ↓
Search Experience
```

The Word Knowledge Layer may eventually contain:

* Definition
* Frequency
* Difficulty
* Popularity
* Scrabble Score
* Vowel Count
* Consonant Count
* Related Words
* Recommended Score

The primary platform differentiation should come from the knowledge layer and ranking engine rather than from proprietary dictionary licensing.

---

## Deployment Flow

```text
Local Machine
        ↓
GitHub
        ↓
Vercel
        ↓
Production
```

---

## Rules

* Run `npm run build` before major changes
* Review pull requests before merging
* Keep `main` branch production-ready
* Preserve dictionary integrity
* Generated artifacts must be reproducible from approved source data

