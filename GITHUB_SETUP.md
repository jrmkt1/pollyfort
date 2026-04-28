# Guia de Configuração para GitHub

Este guia ajuda você a preparar o projeto Pollyfort para upload no GitHub.

## 📋 Preparação Completa

### 1. Arquivos Criados/Atualizados
- ✅ `.gitignore` - Configurado para ignorar arquivos desnecessários
- ✅ `README.md` - Documentação completa do projeto
- ✅ `LICENSE` - Licença MIT
- ✅ `uploads/products/.gitkeep` - Manter estrutura de diretórios

### 2. Estrutura Limpa
O projeto está agora otimizado para GitHub com:
- Documentação profissional e abrangente
- Ignoração adequada de arquivos sensíveis/temporários
- Estrutura de diretórios preservada
- Instruções claras de instalação e uso

### 3. Próximos Passos

1. **Inicializar repositório Git (se ainda não feito):**
   ```bash
   git init
   ```

2. **Adicionar arquivos ao controle de versão:**
   ```bash
   git add .
   ```

3. **Fazer commit inicial:**
   ```bash
   git commit -m "feat: initial commit - complete e-commerce platform"
   ```

4. **Criar repositório no GitHub:**
   - Acesse https://github.com/new
   - Nomeie o repositório (ex: `pollyfort-ecommerce`)
   - Não inicialize com README (já temos um)
   - Clique em "Create repository"

5. **Conectar e fazer push:**
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/pollyfort-ecommerce.git
   git branch -M main
   git push -u origin main
   ```

## 🔐 Variáveis de Ambiente

Lembre-se de configurar as seguintes variáveis de ambiente no servidor de produção:

```env
DATABASE_URL=postgresql://user:password@host:port/database
SESSION_SECRET=your_secure_session_secret_here
NODE_ENV=production
PORT=3000
```

## 📝 Arquivos Importantes

### Não incluídos no GitHub (.gitignore):
- `node_modules/` - Dependências (reinstaladas via npm install)
- `.env` - Variáveis de ambiente (criar manualmente)
- `uploads/products/*` - Imagens enviadas (estrutura preservada)
- Arquivos temporários e logs

### Incluídos no GitHub:
- Todo o código-fonte da aplicação
- Configurações de build e desenvolvimento
- Documentação completa
- Estrutura de banco de dados
- Scripts de deployment

## 🚀 Deployment

Para deployment em novo ambiente:

1. Clone o repositório
2. Configure variáveis de ambiente
3. Execute `npm install`
4. Configure PostgreSQL
5. Execute `npm run db:push`
6. Execute `npm run db:seed`
7. Execute `npm run build`
8. Execute `npm start`

## ✅ Status do Projeto

- ✅ Sistema de autenticação funcionando
- ✅ Painel administrativo estável
- ✅ Upload de imagens implementado
- ✅ Sistema de produtos completo
- ✅ Integração com PostgreSQL
- ✅ Pronto para production

O projeto está 100% preparado para upload no GitHub!