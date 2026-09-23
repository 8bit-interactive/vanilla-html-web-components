# Accessibility and localization references

## Platform behavior

- [HTML Living Standard: the `template` element](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
- [HTML Living Standard: custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [MDN: using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [MDN: using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN: `DOMParser.parseFromString()`](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString)

## Language and direction

- [HTML `lang` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang)
- [HTML `dir` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir)
- [W3C: language declarations in HTML](https://www.w3.org/International/questions/qa-html-language-declarations)
- [W3C: text direction](https://www.w3.org/International/articles/inline-bidi-markup/)

Set the language on the document root and use the `dir` attribute for base direction. Prefer logical CSS properties so the same layout adapts to left-to-right and right-to-left writing directions.

## Accessibility testing

- [Playwright: continuous integration](https://playwright.dev/docs/ci)
- [Deque: `@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [W3C Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

Automated axe checks can identify many common issues, but they do not replace keyboard testing or manual review with assistive technology.
