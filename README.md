# Vanilla HTML Web Components

A small, dependency-free component loader demo. It compares a single HTML component file with a split HTML/CSS/JavaScript version, then exercises Shadow DOM styling, accessibility, and English, French, Chinese, and Arabic localization.

## Run locally

```sh
python3 -m http.server 8000 --directory demo
```

Open <http://localhost:8000>. The demo must be served over HTTP because it fetches component HTML files.

## What the demo shows

- `demo/components/inline-card.html` keeps a template, a scoped `<style>`, and a classic script together.
- `demo/components/split-card.html` keeps the template separate from its stylesheet and module script.
- Both component stylesheets use the same `:host h1` selector in separate Shadow DOM trees, with different colors.
- `demo/i18n.js` stores translated strings once per locale. The same DOM structure is updated in place; Arabic sets `lang="ar"` and `dir="rtl"`.
- The language control is a native labelled select. Status changes are announced, focus indicators are visible, and layout uses CSS logical properties.

## Tests

```sh
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

Playwright checks component loading, CSS isolation and colors, all four locales, keyboard selection, and axe accessibility results.

## Reusable skill

The Codex skill at `.agents/skills/vanilla-html-web-components/SKILL.md` explains the component format, loader contract, scoping, accessibility, localization, examples, and standards references.

## GitHub Pages

The `CI and Pages` workflow runs tests on pushes to `main` and pull requests. It deploys `demo/` to GitHub Pages only after tests pass on a push to `main`.
