const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "tarefas.json");

const lista = document.getElementById("lista");

let tarefas = carregar();

function carregar() {

    if (!fs.existsSync(arquivo)) {
        fs.writeFileSync(arquivo, "[]");
    }

    return JSON.parse(
        fs.readFileSync(arquivo, "utf8")
    );

}

function salvar() {

    fs.writeFileSync(
        arquivo,
        JSON.stringify(tarefas, null, 4)
    );

}

function renderizar() {

    lista.innerHTML = "";

    tarefas.forEach((tarefa, indice) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="esquerda">

                <input
                    type="checkbox"
                    ${tarefa.feito ? "checked" : ""}
                    onchange="alternar(${indice})">

                <span class="${tarefa.feito ? "feito" : ""}">
                    ${tarefa.tarefa}
                </span>

            </div>

            <button
                class="btnExcluir"
                onclick="excluir(${indice})">
                X
            </button>
        `;

        lista.appendChild(li);

    });

}

function adicionar() {

    const campo = document.getElementById("novaTarefa");

    const texto = campo.value.trim();

    if (texto === "")
        return;

    tarefas.push({
        tarefa: texto,
        feito: false
    });

    salvar();

    campo.value = "";

    renderizar();

}

function alternar(indice) {

    tarefas[indice].feito = !tarefas[indice].feito;

    salvar();

    renderizar();

}

function excluir(indice) {

    tarefas.splice(indice, 1);

    salvar();

    renderizar();

}

document
    .getElementById("novaTarefa")
    .addEventListener("keydown", function (e) {

        if (e.key === "Enter")
            adicionar();

    });

renderizar();