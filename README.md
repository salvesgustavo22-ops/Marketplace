# Marketplace INSS/TRF3

Marketplace de tutoriais para ação no TRF3 contra o INSS sem advogado.

## 🚀 Stack Tecnológico

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Database**: SQLite (Node.js built-in)
- **Hosting**: Vercel

## 📋 Pré-requisitos

- Node.js 22.x ou superior
- npm ou yarn
- Conta na Vercel (para deploy)

## 🛠️ Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/salvesgustavo22-ops/Marketplace.git
cd Marketplace
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📏 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `ADMIN_TOKEN` | Token para acesso ao painel admin | admin2024 |
| `NODE_ENV` | Ambiente de execução | production |

## 🌐 Endpoints da API

### Público

- `POST /api/interesse` - Registra interesse do usuário
  - Body: `{ nome, email, telefone?, interesse?, mensagem? }`
  - Response: `{ sucesso: true, id: number }`

### Protegido (requer token)

- `GET /api/admin/leads` - Lista leads com paginação
  - Query: `token=<ADMIN_TOKEN>&pagina=1&limite=50&busca=`
  - Response: `{ leads: [], total: number, pagina: number, limite: number }`

- `GET /api/admin/leads/csv` - Exporta leads em CSV
  - Query: `token=<ADMIN_TOKEN>`
  - Response: Arquivo CSV

- `GET /admin` - Painel administrativo
  - Acesso: Requer token no painel web

## 🚀 Deploy na Vercel

### Opção 1: Via CLI

```bash
npm install -g vercel
vercel
```

### Opção 2: Via GitHub

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Selecione o repositório `Marketplace`
5. Configure as variáveis de ambiente no painel da Vercel:
   - `ADMIN_TOKEN`: sua senha forte
   - `NODE_ENV`: production
6. Clique em "Deploy"

### Configuração de Variáveis de Ambiente na Vercel

No painel da Vercel, vá para **Settings > Environment Variables** e adicione:

```
ADMIN_TOKEN=sua_senha_forte_aqui
NODE_ENV=production
```

## 📂 Estrutura do Projeto

```
Marketplace/
├── server.js              # Servidor Express
├── package.json           # Dependências
├── vercel.json           # Configuração Vercel
├── .env.example          # Exemplo de variáveis
├── .gitignore            # Arquivos ignorados
├── public/
│   ├── index.html        # Landing page
│   ├── admin.html        # Painel administrativo
│   ├── css/
│   │   └── style.css     # Estilos
│   └── js/
│       └── main.js       # Scripts frontend
└── README.md             # Este arquivo
```

## 🔐 Segurança

- O token admin é armazenado em variáveis de ambiente
- Senhas são validadas no backend
- CORS está configurado para aceitar requisições
- Banco de dados SQLite é local e não versionado

## 🐛 Troubleshooting

### Erro: "DatabaseSync is not defined"
Certifique-se de que está usando Node.js 22.x ou superior, que inclui o módulo `node:sqlite`.

### Erro: "Porta já em uso"
Altere a variável `PORT` ou encerre o processo usando a porta 3000.

### Erro: "Token inválido" no painel admin
Verifique se a variável `ADMIN_TOKEN` está configurada corretamente na Vercel.

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

## 📄 Licença

MIT - Veja LICENSE para detalhes. 
