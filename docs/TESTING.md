# Testing

## Release Verification Commands

Run these checks before creating or approving a release PR:

1. `npm test` — runs the TypeScript regression suite and verifies the `@/` alias resolves in tests.
2. `npm run lint` — runs the repository ESLint checks.
3. `npm run build` — runs the Next.js production build.

## Regression Coverage

- `tests/unscrambleSearch.test.ts` covers the Release 1.1 search and filter regression foundation.
- Regression test names include the applicable product rule IDs required by TR-004.
- The test harness loads `tests/registerPathAlias.cjs` before TypeScript tests so imports such as `@/lib/engine/wordStore` fail the test command if alias resolution regresses.

## Manual Surface Checklist

- Homepage
- Unscramble Route
- Word Length Route
- Starts With Route
- Ends With Route
- Pattern Route
- Sitemap
- Robots
- Search Console
