// Espera o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroClienteForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Captura os valores dos campos do formulário
        const nome = document.getElementById("nome").value;
        const cpfCnpj = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch("http://localhost:8080/clientes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    cpfCnpj,
                    email,
                    senha,
                    tipoCliente: {
                        idTipoCliente: 1 // Tipo cliente: 2
                    },
                    telefones: [
                        { numero: telefone } // Apenas um telefone por enquanto
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar cliente');
            }

            const data = await response.json();
            localStorage.setItem('pessoaId', data.idCliente);

            // Redireciona para a página de cadastro de endereço
            window.location.href = './cadastroendereco.html';

        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Falha ao cadastrar cliente. Tente novamente.');
        }
    });
});
