# OrangeHRM Playwright JS Suite

Test automation suite for the OrangeHRM demo app (https://opensource-demo.orangehrmlive.com),
built with Playwright + JavaScript. Covers e2e, ui, api, and visual regression testing.

## Setup

```bash
npm install
npm run install:browsers
```

## Running tests

```bash
npm test                # everything, all projects
npm run test:e2e        # only tests/e2e
npm run test:ui-suite   # only tests/ui
npm run test:api        # only tests/api
npm run test:visual     # only tests/visual
npm run test:headed     # see the browser
npm run test:ui         # Playwright's interactive UI mode
```

## Environments

Controlled via the `ENV` variable, loaded in `playwright.config.js`:

```bash
npm test              # uses .env        (qa, default)
npm run test:staging  # uses .env.staging
npm run test:prod     # uses .env.prod
```

## Project layout

- `pages/` — Page Object Models (one class per page/component)
- `fixtures/` — custom `test`/`expect` that inject page objects + auto-fixtures
- `utils/` — helpers (retry logic, API client, data generators)
- `config/` — global setup/teardown; `.auth/user.json` (gitignored) holds cached login state
- `tests/e2e` — full user journeys across multiple pages
- `tests/ui` — isolated component/page behavior
- `tests/api` — REST-level checks, no browser
- `tests/visual` — `toHaveScreenshot` regression checks
- `test-data/` — JSON fixtures for users, employees, etc.
- `reports/` — HTML/JSON/JUnit output (gitignored, generated on run)

## Reports

```bash
npm run report   # opens the last HTML report
```
