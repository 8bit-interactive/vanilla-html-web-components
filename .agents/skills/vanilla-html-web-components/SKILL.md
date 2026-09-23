---
name: vanilla-html-web-components
description: Build and maintain small browser-native web components from standalone HTML fragments, with a minimal loader, Shadow DOM CSS isolation, accessible behavior, and multilingual UI. Use this skill whenever a user asks to split HTML pages into reusable components, load component markup from .html files, scope styles without a framework, or localize custom elements.
---

# Vanilla HTML Web Components

Use browser-native templates, custom elements, Shadow DOM, and JavaScript modules to build components without a UI framework. Start with the live examples in `demo/components/` and the loader in `demo/app.js`.

## Component formats

This repository demonstrates two formats:

1. **Single HTML file:** a `<template id="…">` contains its markup and `<style>`, followed by a classic `<script>` that defines the custom element.
2. **Split files:** an HTML fragment contains the template, a stylesheet `<link>`, and a module `<script src="…">`.

The host page fetches and parses the component HTML. Scripts parsed by `DOMParser` are inert, so the loader inserts a fresh script element to execute the component code. Resolve asset URLs against the component HTML URL before inserting the fragment. External JavaScript and CSS then retain real browser resource URLs. An extracted inline script can use `//# sourceURL=…` for a useful DevTools label, but that label is virtual and does not map the DOM back to HTML source lines.

Serve the page over HTTP; `fetch()` of component files is not a `file://` loading strategy. Only load trusted component files because the loader executes their JavaScript.

## CSS scope

Attach component markup and styles to the element's own `attachShadow({ mode: "open" })` root. In the single-file example, the template's `<style>` is cloned into that root. In the split example, the `<link rel="stylesheet">` is inside the template and is cloned into that root.

The selector `:host h1` appears in both examples. Each rule applies to the heading in its own shadow tree, even though the selector is identical and the colors differ. The location of the stylesheet establishes the scope; putting the split stylesheet link in the document `<head>` would make its selectors global. Ordinary selectors do not cross the Shadow DOM boundary. Inherited properties and CSS custom properties can flow through the host, so expose deliberate theme variables when components should inherit a page-level theme.

## Accessibility and localization

- Prefer native controls, semantic elements, clear accessible names, visible keyboard focus, and live status announcements for asynchronous changes.
- Keep heading levels meaningful in the page context. Give every icon-only control an accessible name.
- Keep one component structure and store translated strings in a shared dictionary keyed by locale and message key. Avoid duplicating whole component templates per language.
- Set `document.documentElement.lang` whenever the locale changes. Set `dir="rtl"` for right-to-left locales such as Arabic and use CSS logical properties such as `margin-inline` and `text-align: start`.
- Make custom-element internals update when the locale changes; do not assume document queries can select nodes inside a shadow root.
- Test all supported locales, keyboard operation, computed direction, and automated accessibility checks. Automated checks supplement manual assistive-technology review.

## Adding a component

1. Add a template with a stable ID and a custom-element name containing a hyphen.
2. For scoped CSS, keep `<style>` in the template or place a stylesheet `<link>` in the template. Resolve relative asset URLs against the component file URL.
3. Define the custom element once. Clone the template into its own shadow root and make connection/disconnection safe.
4. Use shared translation keys for all visible text and rerender on the locale-change event.
5. Add a Playwright test for rendering, the expected scoped style, keyboard access, and translated strings.

See `references/accessibility-i18n.md` for implementation notes and authoritative platform references. The runnable examples are under `demo/components/`.
