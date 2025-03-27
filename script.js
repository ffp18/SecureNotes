const btnHome = document.querySelector("#btn-home");
const container = document.querySelector("#container");

btnHome.addEventListener("click", trocaPagina);

function trocaPagina(e) {
  console.log(e.target.dataset.template);
  const template = document.querySelector(`#${e.target.dataset.template}`);
  console.log(template.content.cloneNode(true));
  container.innerHTML = template.innerHTMLcontent.cloneNode(true);
}
