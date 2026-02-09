# 🍕 Cardápio Digital - Railway + Supabase

Versão **LIMPA e LEVE** para deploy direto no Railway com Supabase.

## 🚀 Deploy Rápido (5 minutos)

### 1️⃣ Criar Banco no Supabase

1. Acesse https://supabase.com
2. Crie novo projeto
3. Anote a senha do banco
4. Vá em **Settings → Database**
5. Copie a **Connection String**:
   ```
   postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres
   ```

### 2️⃣ Deploy no Railway

1. Faça push deste código para o GitHub
2. Acesse https://railway.app
3. New Project → Deploy from GitHub repo
4. Selecione seu repositório
5. Adicione as variáveis:
   - `DATABASE_URL` = Connection string do Supabase
   - `SESSION_SECRET` = String aleatória (ex: `abc123xyz789`)
6. Deploy automático! ✨

### 3️⃣ Pronto!

Acesse a URL fornecida pelo Railway e crie sua primeira conta!

---

## 📁 Estrutura Simples

```
cardapio-railway-supabase/
├── server.js           # Servidor completo
├── database.js         # Conexão PostgreSQL
├── package.json        # Dependências
├── views/              # Templates EJS
├── public/             # CSS e JS
└── .env.example        # Exemplo de config
```

## 🔧 Testar Localmente (Opcional)

```bash
npm install
# Crie .env com sua DATABASE_URL
npm start
# Acesse http://localhost:3000
```

## ✅ Funcionalidades

- ✅ Sistema multi-empresas
- ✅ Dashboard completo
- ✅ Cardápio personalizável
- ✅ QR Code automático
- ✅ **Dados nunca são perdidos!**

## 🔑 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
SESSION_SECRET=sua_string_aleatoria_aqui
PORT=3000
```

## 🆘 Problemas?

- **Erro de conexão:** Verifique DATABASE_URL
- **Deploy falha:** Certifique-se que tem `package.json` na raiz
- **Banco vazio:** As tabelas são criadas automaticamente

---

**Desenvolvido com ❤️ - Versão simplificada para Railway**
