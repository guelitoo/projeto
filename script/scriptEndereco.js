// Aguarda o carregamento completo do DOM 
document.addEventListener("DOMContentLoaded", () => {	  
	
	// Adiciona evento ao campo de CEP
	const cepInput = document.getElementById("cep");
	if (cepInput) {
		cepInput.addEventListener("input", async function() {
			const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
			
			if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
				try {
					// Faz requisição à API ViaCEP
					const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`); 
					
					if (!response.ok) throw new Error("Erro ao buscar o CEP");
					
					const dados = await response.json();
					
					if (dados.erro) {
						alert("CEP não encontrado.");
						return;
					}
					
					// Preenche os campos com os dados retornados
					const ruaInput = document.getElementById("rua");
					const bairroInput = document.getElementById("bairro");
					const cidadeInput = document.getElementById("cidade");
					const estadoSelect = document.getElementById("estado");

					if (ruaInput) ruaInput.value = dados.logradouro || "";
					if (bairroInput) bairroInput.value = dados.bairro || "";
					if (cidadeInput) cidadeInput.value = dados.localidade || "";
					if (estadoSelect) estadoSelect.value = dados.uf || "";
				
				} catch (error) {
					alert("Erro ao buscar o endereço: " + error.message);
				}
			}
		});
	}

	const form = document.getElementById("cadastroEndereco");
	const clienteId = localStorage.getItem('pessoaId'); // ID salvo no cadastro de cliente

	if (!clienteId) {
		alert("Cliente não encontrado. Por favor, cadastre o cliente primeiro.");
		window.location.href = "cadastrocliente.html";
		return;
	}

	if (form) {
		form.addEventListener("submit", async (event) => {
			event.preventDefault();

			// Captura os valores dos campos
			const estado = document.getElementById("estado")?.value;
			const cidade = document.getElementById("cidade")?.value;
			const bairro = document.getElementById("bairro")?.value;
			const numero = document.getElementById("numero")?.value;
			const cep = document.getElementById("cep")?.value;
			const rua = document.getElementById("rua")?.value;
			const complemento = document.getElementById("complemento")?.value;
			const pais = document.getElementById("pais")?.value || "Brasil";

			try {
				const response = await fetch("http://localhost:8080/enderecos", { 
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ 
						cep,
						rua,
						numero,
						complemento,
						bairro,
						cidade,
						estado,
						pais,
						cliente: {
							idCliente: clienteId // Ligação com o cliente
						}
					})
				});

				if (!response.ok) {
					throw new Error('Erro ao cadastrar endereço');
				}

				await response.json();
				alert("Endereço cadastrado com sucesso!");
				localStorage.removeItem('pessoaId');
				window.location.href = '../index.html'; // Redireciona após sucesso

			} catch (error) {
				console.error('Erro no cadastro:', error);
				alert('Falha ao cadastrar endereço. Tente novamente.');
			}
		});
	}
});
