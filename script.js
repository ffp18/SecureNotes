const container = document.querySelector("#container");

navegarPara("pagina-home", "Bem Vindo(a)!");

function navegarPara(pagina, titulo = undefined) {
  const paginaTemplate = document.createElement(pagina);

  if (titulo) {
    const tituloh4 = document.createElement("h4");
    tituloh4.innerHTML = titulo;
    tituloh4.slot = "tituloNav";
    paginaTemplate.appendChild(tituloh4);
  }

  container.innerHTML = "";
  container.appendChild(paginaTemplate);
}

function registrarNota(codigoNota, descricao, texto) {
  let notas = JSON.parse(localStorage.getItem("notas"));

  if (notas) {
    if (codigoNota) {
      const nota = notas.find((e) => e.codigo == codigoNota);

      if (nota) {
        nota.nota = texto;
        nota.descricao = descricao;
      }
    } else {
      const proximoCodigo =
        notas.reduce((max, item) => Math.max(max, item.codigo), 0) + 1;
      notas.push({ codigo: proximoCodigo, descricao: descricao, nota: texto });
    }
  } else {
    notas = [{ codigo: 1, descricao: descricao, nota: texto }];
  }

  localStorage.setItem("notas", JSON.stringify(notas));
  navegarPara("pagina-home");
}

function notaSelecionada(codigo) {
  const notas = JSON.parse(localStorage.getItem("notas")) || [];
  const notaSelecionada = notas.find((e) => e.codigo == codigo);

  if (notaSelecionada) {
    const templateBase = construirTemplateBase("Alterar Nota", "pagina-home");

    const templateAlteracao = document.createElement("componente-inclusao");
    templateAlteracao.slot = "conteudo";

    templateAlteracao.setAttribute("codigo", notaSelecionada.codigo);
    templateAlteracao.setAttribute("descricao", notaSelecionada.descricao);
    templateAlteracao.setAttribute("nota", notaSelecionada.nota);

    templateBase.appendChild(templateAlteracao);

    container.innerHTML = "";
    container.appendChild(templateBase);
  } else {
    navegarPara("pagina-home");
  }
}

function gravarVoz() {
  console.log("gravarVoz");
}

function construirTemplateBase(titulo, voltarPara) {
  const h3 = document.createElement("h3");
  h3.slot = h3.id = "tituloNav";
  h3.innerHTML = titulo;

  const navbar = document.createElement("componente-navbar");
  navbar.slot = "navbar";
  navbar.appendChild(h3);

  if (voltarPara) {
    const btnVoltar = document.createElement("button");
    btnVoltar.slot = btnVoltar.id = "btnVoltar";
    btnVoltar.innerHTML = "Voltar";
    btnVoltar.dataset.navegar_para = voltarPara;
    btnVoltar.addEventListener("click", (e) =>
      navegarPara(e.target.dataset.navegar_para)
    );

    navbar.appendChild(btnVoltar);
  }

  const footer = document.createElement("componente-footer");
  footer.slot = "footer";

  const paginaBase = document.createElement("pagina-base");
  paginaBase.appendChild(navbar);
  paginaBase.appendChild(footer);

  return paginaBase;
}

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const paginaBase = construirTemplateBase("Secure Notes", undefined);

    const conteudo = document.createElement("componente-home");
    conteudo.slot = "conteudo";

    paginaBase.appendChild(conteudo);

    this.shadowRoot.appendChild(paginaBase);
  }
}

class Home extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    const tbody = document.createElement("tbody");
    tbody.slot = "tbody";

    notas.forEach((e) => {
      const tr = document.createElement("tr");
      const tdCodigo = document.createElement("td");
      const tdDescricao = document.createElement("td");

      tdCodigo.innerHTML = e.codigo;
      tdDescricao.innerHTML = e.descricao;
      tr.appendChild(tdCodigo);
      tr.appendChild(tdDescricao);

      tr.dataset.codigo = e.codigo;
      tr.addEventListener("click", (e) =>
        notaSelecionada(e.target.parentElement.dataset.codigo)
      );
      tbody.appendChild(tr);
    });

    const conteudo = document.querySelector("#home").content.cloneNode(true);
    conteudo.querySelector("#tabela-notas").appendChild(tbody);
    conteudo
      .querySelector("#btn-incluir")
      .addEventListener("click", (e) =>
        navegarPara(e.target.dataset.navegar_para)
      );

    this.shadowRoot.appendChild(conteudo);
  }
}

class InclusaoPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const paginaBase = construirTemplateBase("Inclusao", "pagina-home");

    const conteudo = document.createElement("componente-inclusao");
    conteudo.slot = "conteudo";

    // const btnGravarVoz = document.createElement('gravador-voz');
    // btnGravarVoz.slot = "btnGravarVoz";

    // conteudo.appendChild(btnGravarVoz);

    paginaBase.appendChild(conteudo);

    this.shadowRoot.appendChild(paginaBase);
  }
}

class Inclusao extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document
      .querySelector("#inclusao")
      .content.cloneNode(true);

    this.codigoNota = this.getAttribute("codigo");
    this.InputDescricaoNota = template.querySelector("#descricao-nota");
    this.InputConteudoNota = template.querySelector("#txt-nota");

    template
      .querySelector("#btn-finalizar")
      .addEventListener("click", () =>
        registrarNota(
          this.codigoNota,
          this.InputDescricaoNota.value,
          this.InputConteudoNota.value
        )
      );

    template.querySelector("#btn-audio").addEventListener("click", gravarVoz);

    this.shadowRoot.appendChild(template);
  }

  static get observedAttributes() {
    return ["codigo", "descricao", "nota"];
  }

  attributeChangedCallback(nome, antigo, novo) {
    if (nome === "codigo") {
      this.codigoNota = novo;
    }

    if (nome === "descricao") {
      this.InputDescricaoNota.value = novo;
    }

    if (nome === "nota") {
      this.InputConteudoNota.value = novo;
    }
  }
}

class NavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.querySelector("#navbar").content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = `
      ::slotted(#tituloNav) {
        font-size: 1.8rem;
        font-weight: bold;
        color: #333;
        margin:2.5rem 0;
        text-align: center;
        padding: 10px;
        background-color:rgba(4, 123, 242, 0.33);
        border-radius: 5px;
      }
      ::slotted(#btnVoltar) {
        background-color: #007bff;
        margin: 10px 0;
        text-align: center;
      }
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template);
  }
}

class Footer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.querySelector("#footer").content.cloneNode(true);

    this.shadowRoot.appendChild(template);
  }
}

class PaginaBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document
      .querySelector("#template-base")
      .content.cloneNode(true);

    this.shadowRoot.appendChild(template);
  }
}

// class GravadorVoz extends HTMLElement {
//   constructor() {
//       super();
//       this.attachShadow({ mode: "open" });

//       this.button = document.createElement("button");
//       this.button.textContent = "Gravar por voz";

//       this.shadowRoot.appendChild(this.button);

//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//           this.output.textContent = "Seu navegador não suporta reconhecimento de voz.";
//           this.button.disabled = true;
//           return;
//       }

//       this.recognition = new SpeechRecognition();
//       this.recognition.lang = "pt-BR";
//       this.recognition.continuous = false;
//       this.recognition.interimResults = false;

//       this.recognition.onstart = () => {
//           this.button.textContent = "Ouvindo...";
//       };

//       this.recognition.onresult = (event) => {
//           const transcript = event.results[0][0].transcript;
//           this.output.textContent = `Você disse: ${transcript}`;
//       };

//       this.recognition.onerror = (event) => {
//           this.output.textContent = `Erro: ${event.error}`;
//       };

//       this.recognition.onend = () => {
//           this.button.textContent = "Iniciar Reconhecimento de Voz";
//       };

//       this.button.addEventListener("click", () => {
//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then(() => this.recognition.start())
//             .catch((err) => {
//                 this.output.textContent = `Permissão negada ou erro: ${err.message}`;
//             });
//     });
//   }
// }

// customElements.define("gravador-voz", GravadorVoz);
customElements.define("componente-home", Home);
customElements.define("pagina-home", HomePage);
customElements.define("componente-inclusao", Inclusao);
customElements.define("pagina-inclusao", InclusaoPage);
customElements.define("componente-navbar", NavBar);
customElements.define("componente-footer", Footer);
customElements.define("pagina-base", PaginaBase);
