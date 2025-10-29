document.addEventListener("DOMContentLoaded", () => {
  const servicoSelect = document.getElementById("servico");
  const tipoBorrachaContainer = document.getElementById("tipoBorrachaContainer");
  const tipoBorrachaSelect = document.getElementById("tipoBorracha");
  const diametroInput = document.getElementById("diametro");
  const comprimentoInput = document.getElementById("comprimento");
  const quantidadeInput = document.getElementById("quantidade");
  const valorElement = document.getElementById("valor");
  const confirmarBtn = document.querySelector(".btn-confirmar");

  const API_URL_ORCAMENTO = "http://localhost:8080/api/produtos/orcamento";
  const API_URL_CONFIRMAR = "http://localhost:8080/api/produtos/confirmar";

  // Função para formatar valor em reais
  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Mostrar/ocultar campo de tipo de borracha
  servicoSelect.addEventListener("change", () => {
    if (servicoSelect.value === "revestimento") {
      tipoBorrachaContainer.style.display = "block";
    } else {
      tipoBorrachaContainer.style.display = "none";
      tipoBorrachaSelect.value = "";
    }
    calcularOrcamento();
  });

  // Recalcular orçamento ao alterar qualquer campo
  [servicoSelect, tipoBorrachaSelect, diametroInput, comprimentoInput, quantidadeInput].forEach(el => {
    el.addEventListener("change", calcularOrcamento);
  });

  // Função para calcular orçamento (NÃO salva no banco)
  async function calcularOrcamento() {
    const servico = servicoSelect.value;
    const tipoBorracha = tipoBorrachaSelect.value;
    const diametro = parseFloat(diametroInput.value);
    const comprimento = parseFloat(comprimentoInput.value);
    const quantidade = parseInt(quantidadeInput.value) || 1;

    if (!servico || isNaN(diametro) || isNaN(comprimento)) {
      valorElement.textContent = "R$ 0,00";
      return;
    }

    const produto = {
      servico: servico,
      diametro: diametro,
      comprimento: comprimento,
      quantidade: quantidade,
      tipoBorracha: tipoBorracha || null
    };

    try {
      const response = await fetch(API_URL_ORCAMENTO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      if (!response.ok) throw new Error("Erro ao calcular orçamento");

      const data = await response.json();
      const total = data.precoFinal * quantidade;
      valorElement.textContent = formatarMoeda(total);
    } catch (error) {
      console.error("Erro ao calcular orçamento:", error);
      valorElement.textContent = "Erro no cálculo";
    }
  }

  // Botão "CONFIRMAR PEDIDO" → salva produto no banco
  confirmarBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const produto = {
      servico: servicoSelect.value,
      tipoBorracha: tipoBorrachaSelect.value,
      diametro: parseFloat(diametroInput.value),
      comprimento: parseFloat(comprimentoInput.value),
      quantidade: parseInt(quantidadeInput.value) || 1
    };

    try {
      const response = await fetch(API_URL_CONFIRMAR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      if (!response.ok) throw new Error("Erro ao salvar produto");

      alert("✅ Pedido confirmado e salvo com sucesso!");
      window.location.href = "confirmacaoPedido.html";
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error);
      alert("❌ Erro ao confirmar pedido");
    }
  });

  // Calcula valor inicial caso já existam valores preenchidos
  calcularOrcamento();
});
