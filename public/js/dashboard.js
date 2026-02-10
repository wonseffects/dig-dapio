// ========================================
// MODAIS
// ========================================

// Modal Categoria
function abrirModalCategoria() {
  document.getElementById('modalCategoria').classList.add('show');
  document.getElementById('categoriaId').value = '';
  document.getElementById('categoriaNome').value = '';
  document.getElementById('modalCategoriaTitle').textContent = 'Nova Categoria';
}

function fecharModalCategoria() {
  document.getElementById('modalCategoria').classList.remove('show');
}

function editarCategoria(id, nome) {
  document.getElementById('modalCategoria').classList.add('show');
  document.getElementById('categoriaId').value = id;
  document.getElementById('categoriaNome').value = nome;
  document.getElementById('modalCategoriaTitle').textContent = 'Editar Categoria';
}

async function salvarCategoria(event) {
  event.preventDefault();
  
  const id = document.getElementById('categoriaId').value;
  const nome = document.getElementById('categoriaNome').value;
  
  const url = id ? `/api/categorias/${id}` : '/api/categorias';
  const method = id ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
    method: method,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ nome: nome, ordem: 0 })
  });
    if (!response.ok) {
  const errorText = await response.text();
  console.error('Erro do servidor:', errorText);
  alert('Erro ao salvar categoria: ' + errorText);
  return;
}   
    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      alert('Erro ao salvar categoria');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao salvar categoria');
  }
}

async function deletarCategoria(id) {
  if (!confirm('Tem certeza que deseja deletar esta categoria? Todos os produtos nela serão deletados também.')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/categorias/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      window.location.reload();
    } else {
      alert('Erro ao deletar categoria');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao deletar categoria');
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
