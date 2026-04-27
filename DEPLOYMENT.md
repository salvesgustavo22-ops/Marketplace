# Guia de Deploy na Vercel

Este documento fornece instruções detalhadas para publicar o Marketplace na Vercel.

## 📋 Pré-requisitos

- Conta no GitHub (repositório já criado)
- Conta na Vercel (criar em [vercel.com](https://vercel.com))
- Node.js 22.x instalado localmente (opcional, para testes)

## 🚀 Método 1: Deploy via GitHub (Recomendado)

### Passo 1: Preparar o Repositório

Certifique-se de que todas as alterações foram commitadas:

```bash
git add .
git commit -m "Configurar para deploy na Vercel"
git push origin main
```

### Passo 2: Conectar Vercel ao GitHub

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"New Project"**
3. Clique em **"Import Git Repository"**
4. Selecione **"GitHub"** e autorize a Vercel
5. Procure por **"Marketplace"** e clique em **"Import"**

### Passo 3: Configurar Variáveis de Ambiente

Na tela de configuração do projeto:

1. Vá até a seção **"Environment Variables"**
2. Adicione as seguintes variáveis:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `ADMIN_TOKEN` | `sua_senha_forte_aqui` | Token para acesso ao painel admin |
| `NODE_ENV` | `production` | Ambiente de produção |

3. Clique em **"Deploy"**

### Passo 4: Aguardar Conclusão

- A Vercel iniciará o build automaticamente
- Você receberá um link público quando o deploy terminar
- O projeto estará disponível em `https://seu-projeto.vercel.app`

## 🔄 Método 2: Deploy via CLI

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

### Passo 3: Deploy

Na raiz do projeto:

```bash
vercel
```

Siga as instruções:
- Selecione o projeto (ou crie um novo)
- Confirme as variáveis de ambiente
- Aguarde o deploy

## 🔧 Configurações Importantes

### Variáveis de Ambiente na Vercel

Após o primeiro deploy, você pode ajustar as variáveis:

1. Acesse o projeto na Vercel
2. Vá para **Settings > Environment Variables**
3. Edite ou adicione novas variáveis
4. As mudanças entram em efeito no próximo deploy

### Redeploy Manual

Para fazer redeploy sem alterações no código:

1. Acesse o projeto na Vercel
2. Vá para **Deployments**
3. Clique nos três pontos (...) do último deploy
4. Selecione **"Redeploy"**

## 🔐 Segurança

### Proteger o Painel Admin

1. Altere o `ADMIN_TOKEN` para uma senha forte
2. Não compartilhe o token publicamente
3. Mude o token periodicamente

### Backup do Banco de Dados

O banco SQLite é local na Vercel. Para backup:

1. Acesse o painel admin em `https://seu-projeto.vercel.app/admin`
2. Clique em **"Exportar CSV"**
3. Salve o arquivo localmente

## 🐛 Troubleshooting

### Erro: "Build failed"

Verifique:
- Se o `package.json` está correto
- Se todas as dependências estão listadas
- Se o `server.js` não tem erros de sintaxe

### Erro: "Cannot find module 'express'"

Solução:
```bash
npm install
git add package-lock.json
git commit -m "Atualizar package-lock.json"
git push
```

### Erro: "Port is already in use"

A Vercel atribui a porta automaticamente. Verifique se o código usa `process.env.PORT`.

### Painel Admin não funciona

1. Verifique se `ADMIN_TOKEN` está configurado na Vercel
2. Tente fazer redeploy
3. Limpe o cache do navegador (Ctrl+Shift+Delete)

## 📊 Monitoramento

### Logs em Tempo Real

1. Acesse o projeto na Vercel
2. Vá para **Deployments**
3. Clique no último deployment
4. Vá para **Logs** para ver erros e informações

### Métricas

A Vercel fornece:
- Tempo de resposta da API
- Taxa de erro
- Uso de banda

Acesse em **Analytics** no painel do projeto.

## 🔄 Atualizações Contínuas

### Deploy Automático

Toda vez que você faz push para o GitHub:

1. A Vercel detecta automaticamente
2. Inicia um novo build
3. Faz deploy se bem-sucedido

### Desabilitar Deploy Automático

Se precisar:

1. Vá para **Settings > Git**
2. Desabilite **"Automatic Deployments"**

## 📞 Suporte

- Documentação Vercel: [vercel.com/docs](https://vercel.com/docs)
- Issues do projeto: Abra uma issue no GitHub

## ✅ Checklist Final

Antes de publicar:

- [ ] Todas as dependências estão no `package.json`
- [ ] `.env.example` está atualizado
- [ ] `vercel.json` está configurado
- [ ] `ADMIN_TOKEN` é uma senha forte
- [ ] Testes locais passam (`npm start`)
- [ ] Código foi commitado e pushed para o GitHub
- [ ] Variáveis de ambiente estão configuradas na Vercel

## 🎉 Pronto!

Seu Marketplace está publicado na Vercel e acessível globalmente!
