const filiais = document.querySelectorAll(".filial");
const areaCarga = document.getElementById("areaCarga");
const totalCubagem = document.getElementById("totalCubagem");
const caminhaoIdeal = document.getElementById("caminhaoIdeal");
const lixeira = document.getElementById("lixeira");

let total = 0;
let itemRemovendo = null;

/* Caminhões */
const caminhoes = [
    { nome: "3/4", capacidade: 23.5 },
    { nome: "3/4", capacidade: 27 },
    { nome: "Toco1", capacidade: 40 },
    { nome: "Toco2", capacidade: 45 },
    { nome: "Toco3", capacidade: 47 },
    { nome: "Toco4", capacidade: 51 },
    { nome: "Toco5", capacidade: 57 },
    { nome: "Truck1", capacidade: 63 },
    { nome: "Truck2", capacidade: 84 },
    { nome: "Truck3", capacidade: 85 },
    { nome: "Truck4", capacidade: 70 },
    { nome: "Truck5", capacidade: 87 },
    { nome: "Truck6", capacidade: 90 },
    { nome: "Carreta1", capacidade: 100 },
    { nome: "Carreta3", capacidade: 106 },
];

/* DRAG DAS FILIAIS */
filiais.forEach(filial => {
    filial.addEventListener("dragstart", e => {
        e.dataTransfer.setData("valor", filial.dataset.valor);
        e.dataTransfer.setData("texto", filial.innerText);
        e.dataTransfer.setData("origem", "dia");
    });
});

/* DROP NA ÁREA */
areaCarga.addEventListener("dragover", e => e.preventDefault());

areaCarga.addEventListener("drop", e => {
    e.preventDefault();

    const valor = parseFloat(e.dataTransfer.getData("valor"));
    const texto = e.dataTransfer.getData("texto");
    const origem = e.dataTransfer.getData("origem");

    if(origem === "dia"){
        const novoItem = document.createElement("div");
        novoItem.classList.add("filial");
        novoItem.innerText = texto;
        novoItem.dataset.valor = valor;
        novoItem.draggable = true;

        areaCarga.appendChild(novoItem);
        total += valor;
        atualizarResumo();

        adicionarDragRemocao(novoItem);
    }
});

/* Função para permitir remover */
function adicionarDragRemocao(elemento){
    elemento.addEventListener("dragstart", e => {
        itemRemovendo = elemento;
        e.dataTransfer.setData("remover", elemento.dataset.valor);
    });
}

/* LIXEIRA */
lixeira.addEventListener("dragover", e => e.preventDefault());

lixeira.addEventListener("drop", e => {
    e.preventDefault();

    const valor = parseFloat(e.dataTransfer.getData("remover"));

    if(itemRemovendo){
        total -= valor;
        itemRemovendo.remove();
        atualizarResumo();
        itemRemovendo = null;
    }
});

/* Atualiza total e caminhão */
function atualizarResumo(){
    totalCubagem.innerText = total.toFixed(2) + " m³";

    const caminhao = caminhoes.find(c => total <= c.capacidade);

    if(caminhao){
        caminhaoIdeal.innerText = caminhao.nome + " (" + caminhao.capacidade + " m³)";
    } else {
        caminhaoIdeal.innerText = "Acima da capacidade 🚨";
    }
}

/* ========================= */
/* ARRASTAR A JANELA */
/* ========================= */

const planejamento = document.querySelector(".planejamento");
const header = document.querySelector(".header-drag");

let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - planejamento.offsetLeft;
    offsetY = e.clientY - planejamento.offsetTop;
});

document.addEventListener("mousemove", e => {
    if(!isDragging) return;
    planejamento.style.left = (e.clientX - offsetX) + "px";
    planejamento.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});