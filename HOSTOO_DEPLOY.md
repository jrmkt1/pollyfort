# Deploy Hostoo/cPanel

Este projeto roda como aplicacao Node.js com Express servindo o frontend gerado em `dist/public`.

## Arquivos que devem ir para a Hostoo

- `app.js`
- `package.json`
- `package-lock.json`
- `dist/`
- `data/`
- `uploads/`

Nao envie `.env` publico. Configure as variaveis pelo painel da aplicacao Node.js.

## Configuracao no cPanel

1. Abra `Setup Node.js App` ou `Application Manager`.
2. Crie uma aplicacao Node.js para o dominio/subdominio.
3. Defina o diretorio da aplicacao para a pasta onde os arquivos foram enviados.
4. Defina o arquivo de inicializacao como `app.js`.
5. Configure as variaveis:
   - `NODE_ENV=production`
   - `SESSION_SECRET=<valor-seguro>`
   - `DATABASE_URL=<url-do-postgres>` se houver banco PostgreSQL
   - SMTP/SendGrid se o formulario de contato precisar enviar email
6. Execute `npm install` pelo painel/terminal.
7. Reinicie a aplicacao Node.js.

## Observacoes

- O app funciona sem PostgreSQL usando dados importados de `data/imported-products.json`, mas recursos administrativos persistentes dependem do banco.
- O processo deve escutar a porta fornecida pelo ambiente da hospedagem. O servidor ja usa `process.env.PORT`.
