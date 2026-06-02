UnscrambleWordNow Architecture
Repository

vmanglore/unscramble-word-app

Hosting
Vercel
Domain: unscramblewordnow.com
Technology
Next.js App Router
TypeScript
Core Routes
/unscramble/[letters]
/word-length/[length]
/words-starting-with/[letter]
/words-ending-with/[suffix]
/words-with-pattern/[pattern]
Data Sources
signatureMap.json
patternIndex.json
startsWithMap.json
endsWithMap.json
lengthMap.json
Deployment Flow

Local Machine → GitHub → Vercel → Production

Rules
Run npm run build before major changes
Review pull requests before merging
Keep main branch production-ready
