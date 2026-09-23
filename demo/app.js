import { supportedLocales, translate } from "./i18n.js";

let currentLocale = "en";

window.demoI18n = {
  get locale() { return currentLocale; },
  t(key) { return translate(currentLocale, key); }
};

const language = document.querySelector("#language");
const status = document.querySelector("#status");

language.addEventListener("change", () => setLocale(language.value));

setLocale(currentLocale, { announce: false });
loadComponents().catch((error) => {
  console.error(error);
  status.textContent = translate(currentLocale, "loadError");
});

async function setLocale(locale, { announce = true } = {}) {
  if (!supportedLocales.includes(locale)) return;
  currentLocale = locale;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = translate(locale, element.dataset.i18n);
  }

  window.dispatchEvent(new CustomEvent("demo:localechange", { detail: { locale } }));
  if (announce) status.textContent = translate(locale, "languageChanged");
  else if (document.querySelector("demo-inline-card") && document.querySelector("demo-split-card")) {
    status.textContent = translate(locale, "loaded");
  }
}

async function loadComponents() {
  await loadComponent("./components/inline-card.html", "inline");
  const inline = document.createElement("demo-inline-card");
  document.querySelector("#inline-mount").replaceChildren(inline);

  await loadComponent("./components/split-card.html", "split");
  const split = document.createElement("demo-split-card");
  document.querySelector("#split-mount").replaceChildren(split);

  status.textContent = translate(currentLocale, "loaded");
}

async function loadComponent(path, mode) {
  const componentURL = new URL(path, import.meta.url);
  const response = await fetch(componentURL, { cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${componentURL}`);

  const parsed = new DOMParser().parseFromString(await response.text(), "text/html");
  const template = parsed.querySelector("template[id]");
  const sourceScript = parsed.querySelector("script");
  if (!template || !sourceScript) throw new Error(`Invalid component file: ${componentURL}`);

  for (const link of template.content.querySelectorAll("link[href]")) {
    link.href = new URL(link.getAttribute("href"), componentURL).href;
  }
  document.head.append(template);

  const script = document.createElement("script");
  if (mode === "split") {
    script.type = "module";
    const moduleURL = new URL(sourceScript.getAttribute("src"), componentURL);
    moduleURL.searchParams.set("demo", String(Date.now()));
    script.src = moduleURL.href;
  } else {
    script.textContent = `${sourceScript.textContent}\n//# sourceURL=${componentURL.href}#inline-script`;
  }

  const ready = mode === "split"
    ? new Promise((resolve, reject) => {
        script.addEventListener("load", resolve, { once: true });
        script.addEventListener("error", () => reject(new Error(`Could not load ${script.src}`)), { once: true });
      })
    : null;

  document.head.append(script);
  if (ready) await ready;
  script.remove();

  const name = template.id === "inline-card-template" ? "demo-inline-card" : "demo-split-card";
  await customElements.whenDefined(name);
}
