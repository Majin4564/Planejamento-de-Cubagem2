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
    maintainAspectRatio: false, // 👈 necessário para controlar altura
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

/* DRAG & DROP */
document.querySelectorAll(".filial").forEach(f => {
  f.addEventListener("dragstart", () => dragged = f);
});

document.querySelectorAll(".dia").forEach(dia => {
  dia.addEventListener("dragover", e => e.preventDefault());
  dia.addEventListener("drop", () => {
    if (dragged) {
      dia.appendChild(dragged);
      atualizarTotais();
    }
  });
});

/* ATUALIZA TOTAIS */
function atualizarTotais() {
  const totais = [0, 0, 0, 0, 0];

  document.querySelectorAll(".dia").forEach((dia, index) => {
    dia.querySelectorAll(".filial").forEach(f => {
      totais[index] += parseFloat(f.dataset.valor);
    });

    document
      .querySelector(`.card[data-dia="${dias[index]}"] span`)
      .textContent = totais[index].toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + " m³";
  });

  chart.data.datasets[0].data = totais;
  chart.update();
}


atualizarTotais();