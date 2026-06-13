# Testing

## Release Verification Commands

Run these checks before creating or approving a release PR:

1. `npm test` — runs the TypeScript regression suite and verifies the `@/` alias resolves in tests.
2. `npm run lint` — runs the repository ESLint checks.
3. `npm run build` — runs the Next.js production build.

For browser-facing Release 1.2 work, also run:

```bash
npm run test:e2e
```

## Regression Coverage

- `tests/unscrambleSearch.test.ts` covers the Release 1.1 search and filter regression foundation.
- Regression test names include the applicable product rule IDs required by TR-004.
- The test harness loads `tests/registerPathAlias.cjs` before TypeScript tests so imports such as `@/lib/engine/wordStore` fail the test command if alias resolution regresses.

## Playwright Browser Smoke Tests

Playwright is the official browser automation framework for Release 1.2 and later browser-facing validation.

Standard command:

```bash
npm run test:e2e
```

If Chromium is not installed in the local Playwright cache, install it first:

```bash
npx playwright install chromium
```

Run a single spec:

```bash
npx playwright test tests/e2e/unscramble-smoke.spec.ts
```

Run one browser project:

```bash
npx playwright test --project=chromium
```

Configuration:

- `playwright.config.ts` defines the browser test runner.
- `tests/e2e/` contains browser smoke tests.
- The default suite runs Chromium desktop and a mobile Chrome viewport.
- Playwright starts `npm run dev` automatically through its `webServer` configuration.
- Existing local servers are reused outside CI.

Browser validation standards:

- Prefer user-visible selectors such as roles, labels, headings, and link text.
- Cover critical journeys before edge cases.
- Keep smoke tests stable and focused; do not turn this suite into exhaustive feature coverage.
- Verify dynamic result routes, grouped sections, collapsible behavior, and core navigation when those surfaces are affected.
- Add or update Playwright coverage when a change affects user-facing browser behavior.
- Keep screenshots and traces as failure artifacts only unless visual regression testing is explicitly added in a future task.

Current baseline coverage:

- Homepage loads and exposes the search interface.
- Homepage search renders grouped results.
- Search can open the dynamic `/unscramble/[letters]` route.
- Dynamic results pages render result counts and word-length groups.
- Collapsible result sections can collapse and expand.
- `/words-from-letters/[letters]` renders grouped results.
- Header navigation to Home and Word Finder remains functional.
- Desktop Chromium and mobile Chrome viewport validation run from the same smoke suite.

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
