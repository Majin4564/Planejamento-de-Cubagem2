const ctx = document.getElementById("grafico").getContext("2d");
const dias = ["SEG", "TER", "QUA", "QUI", "SEX"];
let dragged = null;

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: dias,
    datasets: [{
      label: "Cubagem (m³)",
      data: [0, 0, 0, 0, 0],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderRadius: 6,
      barPercentage: 0.5,
      categoryPercentage: 0.6
    }]
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
          size: 11
        },
        formatter: (value) => {
          if (value === 0) return "";
          return value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + " m³";
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
  plugins: [ChartDataLabels]
});


/* =========================
   DRAG & DROP
========================= */
document.querySelectorAll(".filial").forEach(f => {
  f.addEventListener("dragstart", () => dragged = f);
});

document.querySelectorAll(".dia").forEach(dia => {
  dia.addEventListener("dragover", e => e.preventDefault());

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
   REGRA FIXA: +2 DIAS
========================= */
function atualizarTotais() {

  const totais = {
    SEG: 0,
    TER: 0,
    QUA: 0,
    QUI: 0,
    SEX: 0
  };

  document.querySelectorAll(".dia").forEach((dia) => {

    const diaVisual = dia.dataset.dia;
    const indexVisual = dias.indexOf(diaVisual);

    dia.querySelectorAll(".filial").forEach(f => {

      const valor = parseFloat(f.dataset.valor) || 0;

      const destinoIndex = (indexVisual + 1) % dias.length;
      const destinoDia = dias[destinoIndex];

      totais[destinoDia] += valor;

    });

  });

  // Atualiza cards e gráfico
  dias.forEach((diaNome, index) => {

    const cardSpan = document.querySelector(`.card[data-dia="${diaNome}"] span`);

    if (cardSpan) {
      cardSpan.textContent =
        totais[diaNome].toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + " m³";
    }

    chart.data.datasets[0].data[index] = totais[diaNome];
 });

  chart.update();
}

atualizarTotais();