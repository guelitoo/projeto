// Exemplo: script/scriptFuncionario.js

document.addEventListener("DOMContentLoaded", () => {
  const tabelaCorpo = document.getElementById("tabela-corpo");

  // Faz a requisição dos pedidos (pode ser um arquivo JSON ou uma rota da API)
  fetch("../data/pedidos.json")
    .then(response => response.json())
    .then(pedidos => {
      tabelaCorpo.innerHTML = ""; // Limpa antes de preencher

      pedidos.forEach(pedido => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${pedido.id}</td>
          <td>${pedido.cliente}<br><small>${pedido.cnpj}</small></td>
          <td>${pedido.quantidade}</td>
          <td>${pedido.servico}</td>
          <td>R$${pedido.valorUnitario.toFixed(2)}</td>
          <td>R$${(pedido.quantidade * pedido.valorUnitario).toFixed(2)}</td>
          <td>
            <select class="status-select">
              <option value="pendente" ${pedido.status === "pendente" ? "selected" : ""}>Pendente</option>
              <option value="andamento" ${pedido.status === "andamento" ? "selected" : ""}>Em andamento</option>
              <option value="concluido" ${pedido.status === "concluido" ? "selected" : ""}>Concluído</option>
            </select>
          </td>
        `;
        tabelaCorpo.appendChild(tr);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar pedidos:", error);
      tabelaCorpo.innerHTML = "<tr><td colspan='7'>Erro ao carregar os pedidos.</td></tr>";
    });
});
