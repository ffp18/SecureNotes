class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    import("./home.html").then((module) => {
      this.shadowRoot.appendChild(module.template.content.cloneNode(true));
    });
  }
}

customElements.define("home", Home);
