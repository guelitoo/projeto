// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('loginForm');

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const email = document.getElementById('email').value.trim();
		const senha = document.getElementById('senha').value.trim();

		if (!email || !senha) {
			alert('Preencha todos os campos!');
			return;
		}

		try {
			const response = await fetch('http://localhost:8080/clientes/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, senha })
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error('Email ou senha inválidos.');
				}
				throw new Error('Erro na autenticação.');
			}

			const usuario = await response.json();

			// Armazena os dados do usuário logado no localStorage
			localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

			// Redireciona para a página principal ou perfil
			window.location.href = "../pages/indexLogado.html";
		} catch (error) {
			alert(error.message);
			console.error('Erro no login:', error);
		}
	});
});
