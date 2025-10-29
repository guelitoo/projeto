document.addEventListener('DOMContentLoaded', () => {
  const usuarioJson = localStorage.getItem('usuarioLogado');

  if (!usuarioJson) {
    window.location.href = 'index.html';
    return;
  }

  const usuario = JSON.parse(usuarioJson);

  document.getElementById('nome').value = usuario.nome || '';
  document.getElementById('email').value = usuario.email || '';
  document.getElementById('cpfCnpj').value = usuario.cpfCnpj || '';
  document.getElementById('senha').value = usuario.senha || '';

  // Corrige telefone
  const telefoneInput = document.getElementById('telefone');
  if (usuario.telefones && usuario.telefones.length > 0) {
    telefoneInput.value = usuario.telefones[0].numero || '';
  } else {
    telefoneInput.value = '';
  }

  // Permite edição ao clicar no ícone ✎
  document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const field = icon.getAttribute('data-edit');
      const input = document.getElementById(field);
      if (input) input.removeAttribute('readonly');
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../index.html';
  });

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      idCliente: usuario.idCliente,
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value,
      telefones: [{ numero: document.getElementById('telefone').value || '' }],
      cpfCnpj: document.getElementById('cpfCnpj').value
    };

    try {
      const response = await fetch(`http://localhost:8080/clientes/${usuario.idCliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!response.ok) throw new Error('Falha ao salvar alterações');

      const usuarioAtualizado = await response.json();
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
      alert('Alterações salvas com sucesso!');

      document.querySelectorAll('.profile-form input').forEach(input => input.setAttribute('readonly', true));
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar alterações. Tente novamente.');
    }
  });

  document.getElementById('editarEnderecoBtn').addEventListener('click', () => {
    localStorage.setItem('pessoaId', usuario.idCliente);
  });
});
