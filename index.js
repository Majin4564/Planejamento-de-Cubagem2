const ctx = document.getElementById("grafico").getContext("2d");
const dias = ["SEG", "TER", "QUA", "QUI", "SEX"];
let dragged = null;

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: dias,
    datasets: [
      {
        label: "Cubagem (m³)",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
      {
        label: "Meta diária (749.557 m³)",
        type: "line",
        data: [749.557, 749.557, 749.557, 749.557, 749.557],
        borderColor: "red",
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#333",
        font: {
          weight: "bold",
          size: 11,
        },
        formatter: (value) => {
          if (value === 0) return "";
          return (
            value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + " m³"
          );
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
  plugins: [ChartDataLabels],
});

/* =========================
   DRAG & DROP
========================= */
document.querySelectorAll(".filial").forEach((f) => {
  f.addEventListener("dragstart", () => (dragged = f));
});

document.querySelectorAll(".dia").forEach((dia) => {
  dia.addEventListener("dragover", (e) => e.preventDefault());

  dia.addEventListener("drop", () => {
    if (!dragged) return;

    const titulo = dia.querySelector("h3, h4, h2, .titulo");

    if (titulo) {
      titulo.insertAdjacentElement("afterend", dragged);
    } else {
      dia.prepend(dragged);
    }

    atualizarTotais();
  });
});

/* =========================
   ATUALIZA TOTAIS
========================= */
function atualizarTotais() {
  const totais = {
    SEG: 0,
    TER: 0,
    QUA: 0,
    QUI: 0,
    SEX: 0,
  };

  document.querySelectorAll(".dia").forEach((dia) => {
    const diaVisual = dia.dataset.dia;
    const indexVisual = dias.indexOf(diaVisual);

    dia.querySelectorAll(".filial").forEach((f) => {
      const valor = parseFloat(f.dataset.valor) || 0;

      const destinoIndex = (indexVisual + 1) % dias.length;
      const destinoDia = dias[destinoIndex];

      totais[destinoDia] += valor;
    });
  });

  /* total da semana */
  const totalSemana = Object.values(totais).reduce((a, b) => a + b, 0);

  // Atualiza cards e gráfico
  dias.forEach((diaNome, index) => {
    const card = document.querySelector(`.card[data-dia="${diaNome}"]`);
    const cardSpan = card?.querySelector("span");
    const percentual = card?.querySelector(".percentual");

    if (cardSpan) {
      cardSpan.textContent =
        totais[diaNome].toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " m³";
    }

    /* calcular porcentagem */
    const porcentagem =
      totalSemana > 0 ? (totais[diaNome] / totalSemana) * 100 : 0;

    if (percentual) {
      percentual.textContent = porcentagem.toFixed(1) + "%";
    }

    chart.data.datasets[0].data[index] = totais[diaNome];
  });

  chart.update();
}
const tooltip = document.getElementById("tooltipFilial");

function calcularRankPercentual() {

  const filiais = [...document.querySelectorAll(".filial")];

  const dados = filiais.map(f => ({
    el: f,
    valor: parseFloat(f.dataset.valor) || 0
  }));

  const total = dados.reduce((s, f) => s + f.valor, 0);

  const ordenado = [...dados].sort((a,b)=> b.valor - a.valor);

  ordenado.forEach((f,i)=>{
    f.el.dataset.rank = i + 1;
  });

  dados.forEach(f=>{
    const percentual = total > 0 ? (f.valor / total) * 100 : 0;
    f.el.dataset.percentual = percentual.toFixed(1);
  });

}

calcularRankPercentual();


document.querySelectorAll(".filial").forEach(f=>{

  f.addEventListener("mousemove",(e)=>{

    const valor = parseFloat(f.dataset.valor) || 0;
    const rank = f.dataset.rank;
    const percentual = f.dataset.percentual;

    tooltip.innerHTML = `
      <strong>${f.innerText}</strong><br>
      📦 Cubagem: ${valor.toLocaleString("pt-BR",{minimumFractionDigits:2})} m³<br>
      🏆 Rank: ${rank}<br>
      📊 Participação: ${percentual}%
    `;

    tooltip.style.left = e.pageX + 12 + "px";
    tooltip.style.top = e.pageY + 12 + "px";

    tooltip.classList.add("show");

  });

  f.addEventListener("mouseleave",()=>{
    tooltip.classList.remove("show");
  });

});
atualizarTotais();