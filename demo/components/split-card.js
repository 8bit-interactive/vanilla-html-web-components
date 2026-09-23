const template = document.querySelector("#split-card-template");

customElements.define("demo-split-card", class extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
      this.shadowRoot.querySelector("button").addEventListener("click", () => {
        throw new Error("Example error from demo/components/split-card.js");
      });
    }
    if (!this.onLocaleChange) this.onLocaleChange = () => this.render();
    window.addEventListener("demo:localechange", this.onLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("demo:localechange", this.onLocaleChange);
  }

  render() {
    for (const element of this.shadowRoot.querySelectorAll("[data-component-i18n]")) {
      element.textContent = window.demoI18n.t(element.dataset.componentI18n);
    }
  }
});
