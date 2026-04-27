// Suppress experimental warning for node:sqlite
process.env.NODE_NO_WARNINGS = '1';

const express = require('express');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin2024';

// Database setup (built-in Node.js SQLite — no native compilation needed)
const db = new DatabaseSync(path.join(__dirname, 'leads.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT DEFAULT '',
    interesse TEXT DEFAULT '',
    mensagem TEXT DEFAULT '',
    origem TEXT DEFAULT 'formulario',
    criado_em TEXT DEFAULT (datetime('now','localtime'))
  )
`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Salvar lead do formulário de interesse
app.post('/api/interesse', (req, res) => {
  const { nome, email, telefone, interesse, mensagem } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ erro: 'E-mail inválido.' });
  }

  const stmt = db.prepare(
    'INSERT INTO leads (nome, email, telefone, interesse, mensagem) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(nome, email, telefone || '', interesse || '', mensagem || '');

  res.json({ sucesso: true, id: result.lastInsertRowid });
});

// API: Listar leads (protegida por token)
app.get('/api/admin/leads', (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }

  const { pagina = 1, limite = 50, busca = '' } = req.query;
  const offset = (Number(pagina) - 1) * Number(limite);

  let rows, totalRow;
  if (busca) {
    const like = `%${busca}%`;
    rows = db.prepare(
      `SELECT * FROM leads WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ?
       ORDER BY criado_em DESC LIMIT ? OFFSET ?`
    ).all(like, like, like, Number(limite), offset);
    totalRow = db.prepare(
      `SELECT COUNT(*) as total FROM leads WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ?`
    ).get(like, like, like);
  } else {
    rows = db.prepare(
      'SELECT * FROM leads ORDER BY criado_em DESC LIMIT ? OFFSET ?'
    ).all(Number(limite), offset);
    totalRow = db.prepare('SELECT COUNT(*) as total FROM leads').get();
  }

  res.json({ leads: rows, total: totalRow.total, pagina: Number(pagina), limite: Number(limite) });
});

// API: Exportar leads como CSV
app.get('/api/admin/leads/csv', (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }

  const rows = db.prepare('SELECT * FROM leads ORDER BY criado_em DESC').all();
  const header = 'ID,Nome,Email,Telefone,Interesse,Mensagem,Data\n';
  const csv = rows.map(r =>
    `${r.id},"${(r.nome||'').replace(/"/g,'""')}","${(r.email||'').replace(/"/g,'""')}","${(r.telefone||'').replace(/"/g,'""')}","${(r.interesse||'').replace(/"/g,'""')}","${(r.mensagem||'').replace(/"/g,'""')}","${r.criado_em}"`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send('﻿' + header + csv);
});

// Admin panel
app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Painel admin: http://localhost:${PORT}/admin`);
  console.log(`Token admin: ${ADMIN_TOKEN}`);
});
