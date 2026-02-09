const { Pool } = require('pg');

// Configuração PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Testar conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar no PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado ao PostgreSQL (Supabase)');
    console.log('⏰ Horário do servidor:', res.rows[0].now);
  }
});

// Criar tabelas
const initTables = async () => {
  try {
    // Tabela empresas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        cor_gradiente_inicio TEXT DEFAULT '#FF6B6B',
        cor_gradiente_fim TEXT DEFAULT '#4ECDC4',
        cor_botao TEXT DEFAULT '#FF6B6B',
        cor_texto_botao TEXT DEFAULT '#FFFFFF',
        ativo INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela categorias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        ordem INTEGER DEFAULT 0
      )
    `);

    // Tabela produtos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
        categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        disponivel INTEGER DEFAULT 1,
        destaque INTEGER DEFAULT 0,
        ordem INTEGER DEFAULT 0,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabelas verificadas/criadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
  }
};

initTables();

module.exports = pool;
