import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const locales = [
  { code: "en", dir: "ltr", heading: "Component A · single file", body: "The CSS file uses the same selector as Component A, with its own color." },
  { code: "fr", dir: "ltr", heading: "Composant A · fichier unique", body: "Le fichier CSS utilise le même sélecteur que le composant A, avec sa propre couleur." },
  { code: "zh", dir: "ltr", heading: "组件 A · 单文件", body: "CSS 文件使用与组件 A 相同的选择器，但设置自己的颜色。" },
  { code: "ar", dir: "rtl", heading: "المكوّن A · ملف واحد", body: "يستخدم ملف CSS المحدّد نفسه الموجود في المكوّن A، مع لون خاص به." }
];

async function openDemo(page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Autonomous HTML components", level: 1 })).toBeVisible();
  await expect(page.locator("demo-inline-card")).toBeAttached();
  await expect(page.locator("demo-split-card")).toBeAttached();
}

test("keeps the same scoped selector isolated with a distinct color per component", async ({ page }) => {
  await openDemo(page);

  const inlineHeading = page.locator("demo-inline-card").locator("h1");
  const splitHeading = page.locator("demo-split-card").locator("h1");
  const pageHeading = page.locator("main > header h1");

  await expect(inlineHeading).toHaveCSS("color", "rgb(107, 63, 198)");
  await expect(splitHeading).toHaveCSS("color", "rgb(24, 115, 74)");
  await expect(pageHeading).toHaveCSS("color", "rgb(165, 45, 36)");
  await expect(inlineHeading).not.toHaveCSS("color", "rgb(165, 45, 36)");
  await expect(splitHeading).not.toHaveCSS("color", "rgb(165, 45, 36)");
});

test("updates the same component markup and document direction in all locales", async ({ page }) => {
  await openDemo(page);
  const selector = page.locator("#language");

  for (const locale of locales) {
    await selector.selectOption(locale.code);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
    await expect(page.locator("html")).toHaveAttribute("dir", locale.dir);
    await expect(page.locator("demo-inline-card").locator("h1")).toHaveText(locale.heading);
    await expect(page.locator("demo-split-card").locator("p")).toHaveText(locale.body);
  }
});

test("allows changing language with the keyboard", async ({ page }) => {
  await openDemo(page);
  const selector = page.locator("#language");

  await selector.focus();
  await expect(selector).toBeFocused();
  await selector.press("f");
  await selector.press("Enter");

  await expect(selector).toHaveValue("fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("demo-inline-card").locator("h1")).toHaveText("Composant A · fichier unique");
});

test("has no automated axe violations in any supported locale", async ({ page }) => {
  await openDemo(page);
  const selector = page.locator("#language");

  for (const locale of locales) {
    await selector.selectOption(locale.code);
    await expect(page.locator("html")).toHaveAttribute("lang", locale.code);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, `${locale.code}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});
