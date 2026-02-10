// ========================================
// MODAIS
// ========================================

// Modal Produto
function abrirModalProduto() {
  document.getElementById('modalProduto').classList.add('show');
  // ... (resto do código) ...
}

function fecharModalProduto() {
  document.getElementById('modalProduto').classList.remove('show');
}

async function editarProduto(id) {
  // A lógica de "scraping" do DOM é frágil. O ideal seria buscar os dados da API.
  // Mas para não mudar muito, vamos manter por enquanto.
  try {
    const produtos = Array.from(document.querySelectorAll('.produto-card'));
    const produtoCard = produtos.find(card => {
      const deleteBtn = card.querySelector('[onclick*="deletarProduto"]');
      return deleteBtn && deleteBtn.getAttribute('onclick').includes(`(${id})`);
    });
    
    if (!produtoCard) return;
    
    const nome = produtoCard.querySelector('h5').textContent;
    const descricao = produtoCard.querySelector('.produto-descricao').textContent;
    const preco = produtoCard.querySelector('.produto-preco').textContent.replace('R$ ', '').replace(',', '.');
    const disponivel = produtoCard.querySelector('.produto-status').classList.contains('disponivel');
    
    document.getElementById('modalProduto').classList.add('show');
    document.getElementById('produtoId').value = id;
    document.getElementById('produtoNome').value = nome;
    document.getElementById('produtoDescricao').value = descricao === 'Sem descrição' ? '' : descricao;
    document.getElementById('produtoPreco').value = preco;
    document.getElementById('produtoDisponivel').checked = disponivel;
    document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
    
    const categoriaSection = produtoCard.closest('.categoria-section');
    const categoriaId = categoriaSection.getAttribute('data-categoria-id');
    document.getElementById('produtoCategoria').value = categoriaId;
    
  } catch (error) {
    console.error('Erro ao buscar dados do produto para edição:', error);
    alert('Não foi possível carregar os dados do produto para edição.');
  }
}

async function salvarProduto(event) {
  event.preventDefault();
  
  const id = document.getElementById('produtoId').value;
  const nome = document.getElementById('produtoNome').value;
  const descricao = document.getElementById('produtoDescricao').value;
  const precoInput = document.getElementById('produtoPreco').value;
  const categoria_id = document.getElementById('produtoCategoria').value;
  const disponivel = document.getElementById('produtoDisponivel').checked;
  
  // CORREÇÃO 1: Converter para os tipos de dados corretos
  const preco = parseFloat(precoInput);
  const categoriaIdNumerico = parseInt(categoria_id, 10);

  // Validação simples no frontend
  if (!nome || isNaN(preco) || isNaN(categoriaIdNumerico)) {
    alert('Por favor, preencha todos os campos corretamente. O preço e a categoria são obrigatórios.');
    return;
  }
  
  // CORREÇÃO 2: Padronizar a URL da API
  const url = id ? `/dashboard/api/produtos/${id}` : '/dashboard/api/produtos';
  const method = id ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nome,
        descricao,
        preco, // Agora é um número
        categoria_id: categoriaIdNumerico, // Agora é um número
        disponivel,
        // CORREÇÃO 3: Remover ou tornar 'ordem' dinâmico.
        // Se 'ordem' não é usado, remova. Se é, precisa de uma lógica.
        // Por enquanto, vamos remover para evitar o erro de constraint.
        // destaque: false 
      })
    });

    // CORREÇÃO 4: Melhorar o tratamento de erro
    if (!response.ok) {
      // Tenta ler o erro como JSON, caso o backend envie uma mensagem
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido do servidor.' }));
      const errorMessage = errorData.message || `Erro HTTP ${response.status}`;
      console.error('Erro do servidor:', errorMessage);
      alert(`Erro ao salvar produto: ${errorMessage}`);
      return;
    }
   
    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      // Se a resposta for OK (200) mas 'success' for false
      alert(`Erro ao salvar produto: ${data.message || 'Resposta inválida do servidor.'}`);
    }
  } catch (error) {
    console.error('Erro de rede ou inesperado:', error);
    alert('Erro ao salvar produto. Verifique sua conexão e tente novamente.');
  }
}

async function deletarProduto(id) {
  if (!confirm('Tem certeza que deseja deletar este produto?')) {
    return;
  }
  
  try {
    // CORREÇÃO 2 (novamente): Verificar se a URL está correta
    const response = await fetch(`/dashboard/api/produtos/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
        alert(`Erro ao deletar produto: ${errorData.message}`);
        return;
    }

    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      alert(`Erro ao deletar produto: ${data.message}`);
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar produto. Verifique sua conexão.');
  }
}

// Modal Produto
function abrirModalProduto() {
  document.getElementById('modalProduto').classList.add('show');
  document.getElementById('produtoId').value = '';
  document.getElementById('produtoNome').value = '';
  document.getElementById('produtoDescricao').value = '';
  document.getElementById('produtoPreco').value = '';
  document.getElementById('produtoCategoria').value = '';
  document.getElementById('produtoDisponivel').checked = true;
  document.getElementById('modalProdutoTitle').textContent = 'Novo Produto';
}

function fecharModalProduto() {
  document.getElementById('modalProduto').classList.remove('show');
}

async function editarProduto(id) {
  try {
    // Buscar dados do produto
    const produtos = Array.from(document.querySelectorAll('.produto-card'));
    const produtoCard = produtos.find(card => {
      const deleteBtn = card.querySelector('[onclick*="deletarProduto"]');
      return deleteBtn && deleteBtn.getAttribute('onclick').includes(`(${id})`);
    });
    
    if (!produtoCard) return;
    
    const nome = produtoCard.querySelector('h5').textContent;
    const descricao = produtoCard.querySelector('.produto-descricao').textContent;
    const preco = produtoCard.querySelector('.produto-preco').textContent.replace('R$ ', '').replace(',', '.');
    const disponivel = produtoCard.querySelector('.produto-status').classList.contains('disponivel');
    
    // Preencher modal
    document.getElementById('modalProduto').classList.add('show');
    document.getElementById('produtoId').value = id;
    document.getElementById('produtoNome').value = nome;
    document.getElementById('produtoDescricao').value = descricao === 'Sem descrição' ? '' : descricao;
    document.getElementById('produtoPreco').value = preco;
    document.getElementById('produtoDisponivel').checked = disponivel;
    document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
    
    // Encontrar categoria do produto
    const categoriaSection = produtoCard.closest('.categoria-section');
    const categoriaId = categoriaSection.getAttribute('data-categoria-id');
    document.getElementById('produtoCategoria').value = categoriaId;
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function salvarProduto(event) {
  event.preventDefault();
  
  const id = document.getElementById('produtoId').value;
  const nome = document.getElementById('produtoNome').value;
  const descricao = document.getElementById('produtoDescricao').value;
  const preco = document.getElementById('produtoPreco').value;
  const categoria_id = document.getElementById('produtoCategoria').value;
  const disponivel = document.getElementById('produtoDisponivel').checked;
  
  const url = id ? `/api/produtos/${id}` : '/api/produtos';
  const method = id ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        descricao,
        preco,
        categoria_id,
        disponivel,
        destaque: false,
        ordem: 0
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      alert('Erro ao salvar produto');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao salvar produto');
  }
}

async function deletarProduto(id) {
  if (!confirm('Tem certeza que deseja deletar este produto?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      alert('Erro ao deletar produto');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar produto');
  }
}

// ========================================
// QR CODE
// ========================================
function baixarQRCode() {
  const qrCodeImg = document.getElementById('qrCodeImg');
  const link = document.createElement('a');
  link.download = 'qrcode-cardapio.png';
  link.href = qrCodeImg.src;
  link.click();
}

// ========================================
// FECHAR MODAL AO CLICAR FORA
// ========================================
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
  }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('show');
    });
  }
});
