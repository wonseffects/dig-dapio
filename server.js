require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'mude_isso_urgente',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Middleware de autenticação
const auth = (req, res, next) => {
  if (req.session.empresaId) return next();
  res.redirect('/login');
};

// ===== ROTAS PÚBLICAS =====

app.get('/', (req, res) => {
  if (req.session.empresaId) return res.redirect('/dashboard');
  res.render('home');
});

app.get('/login', (req, res) => {
  if (req.session.empresaId) return res.redirect('/dashboard');
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await db.query('SELECT * FROM empresas WHERE email = $1', [email]);
    
    if (result.rows.length === 0 || !bcrypt.compareSync(senha, result.rows[0].senha)) {
      return res.render('login', { error: 'Email ou senha incorretos' });
    }

    req.session.empresaId = result.rows[0].id;
    req.session.empresaNome = result.rows[0].nome;
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { error: 'Erro ao fazer login' });
  }
});

app.get('/cadastro', (req, res) => {
  if (req.session.empresaId) return res.redirect('/dashboard');
  res.render('cadastro', { error: null, success: null });
});

app.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco } = req.body;

    // Criar slug
    let slug = nome.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    // Verificar se slug já existe
    const slugCheck = await db.query('SELECT id FROM empresas WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    
    await db.query(
      'INSERT INTO empresas (nome, slug, email, senha, telefone, endereco) VALUES ($1, $2, $3, $4, $5, $6)',
      [nome, slug, email, senhaHash, telefone, endereco]
    );

    res.render('cadastro', { error: null, success: 'Cadastro realizado! Faça login.' });
  } catch (error) {
    res.render('cadastro', { error: 'Erro ao cadastrar', success: null });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// ===== DASHBOARD =====

app.get('/dashboard', auth, async (req, res) => {
  try {
    const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [req.session.empresaId]);
    const categorias = await db.query('SELECT * FROM categorias WHERE empresa_id = $1 ORDER BY ordem, nome', [req.session.empresaId]);
    const produtos = await db.query('SELECT p.*, c.nome as categoria_nome FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.empresa_id = $1 ORDER BY c.ordem, p.ordem', [req.session.empresaId]);

    const urlCardapio = `${req.protocol}://${req.get('host')}/${empresa.rows[0].slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(urlCardapio);

    res.render('dashboard', {
      empresa: empresa.rows[0],
      categorias: categorias.rows,
      produtos: produtos.rows,
      qrCodeDataUrl,
      urlCardapio
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar dashboard');
  }
});

app.get('/dashboard/configuracoes', auth, async (req, res) => {
  try {
    const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [req.session.empresaId]);
    res.render('configuracoes', { empresa: empresa.rows[0], success: null, error: null });
  } catch (error) {
    res.status(500).send('Erro');
  }
});

app.post('/dashboard/configuracoes', auth, async (req, res) => {
  try {
    const { nome, telefone, endereco, cor_gradiente_inicio, cor_gradiente_fim, cor_botao, cor_texto_botao } = req.body;
    
    await db.query(
      'UPDATE empresas SET nome=$1, telefone=$2, endereco=$3, cor_gradiente_inicio=$4, cor_gradiente_fim=$5, cor_botao=$6, cor_texto_botao=$7 WHERE id=$8',
      [nome, telefone, endereco, cor_gradiente_inicio, cor_gradiente_fim, cor_botao, cor_texto_botao, req.session.empresaId]
    );

    const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [req.session.empresaId]);
    res.render('configuracoes', { empresa: empresa.rows[0], success: 'Atualizado!', error: null });
  } catch (error) {
    const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [req.session.empresaId]);
    res.render('configuracoes', { empresa: empresa.rows[0], success: null, error: 'Erro' });
  }
});

// ===== API =====

app.post('/api/categorias', auth, async (req, res) => {
  try {
    const { nome } = req.body;
    const result = await db.query('INSERT INTO categorias (empresa_id, nome) VALUES ($1, $2) RETURNING id', [req.session.empresaId, nome]);
    res.json({ success: true, categoriaId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/categorias/:id', auth, async (req, res) => {
  try {
    const { nome } = req.body;
    await db.query('UPDATE categorias SET nome=$1 WHERE id=$2', [nome, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/categorias/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM categorias WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/produtos', auth, async (req, res) => {
  try {
    const { nome, descricao, preco, categoria_id, disponivel } = req.body;
    const result = await db.query(
      'INSERT INTO produtos (empresa_id, categoria_id, nome, descricao, preco, disponivel) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [req.session.empresaId, categoria_id, nome, descricao, preco, disponivel ? 1 : 0]
    );
    res.json({ success: true, produtoId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/produtos/:id', auth, async (req, res) => {
  try {
    const { nome, descricao, preco, categoria_id, disponivel } = req.body;
    await db.query(
      'UPDATE produtos SET nome=$1, descricao=$2, preco=$3, categoria_id=$4, disponivel=$5 WHERE id=$6',
      [nome, descricao, preco, categoria_id, disponivel ? 1 : 0, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/produtos/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ===== CARDÁPIO PÚBLICO =====

app.get('/:slug', async (req, res) => {
  try {
    const rotasSistema = ['login', 'cadastro', 'logout', 'dashboard', 'api'];
    if (rotasSistema.includes(req.params.slug)) return res.status(404).render('404');

    const empresa = await db.query('SELECT * FROM empresas WHERE slug = $1', [req.params.slug]);
    if (empresa.rows.length === 0) return res.status(404).render('404');

    const categorias = await db.query('SELECT * FROM categorias WHERE empresa_id = $1 ORDER BY ordem, nome', [empresa.rows[0].id]);
    const produtos = await db.query('SELECT * FROM produtos WHERE empresa_id = $1 AND disponivel = 1 ORDER BY ordem, nome', [empresa.rows[0].id]);

    const produtosPorCategoria = {};
    categorias.rows.forEach(cat => {
      produtosPorCategoria[cat.id] = {
        ...cat,
        produtos: produtos.rows.filter(p => p.categoria_id === cat.id)
      };
    });

    res.render('cardapio', { empresa: empresa.rows[0], categorias: categorias.rows, produtosPorCategoria });
  } catch (error) {
    res.status(500).send('Erro');
  }
});

// 404
app.use((req, res) => res.status(404).render('404'));

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🍕 Cardápio Digital - Railway + Supabase    ║
║   ✅ Servidor rodando na porta ${PORT}          ║
║   🌐 http://localhost:${PORT}                   ║
╚════════════════════════════════════════════════╝
  `);
});
