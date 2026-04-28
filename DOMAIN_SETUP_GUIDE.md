# Guia de Configuração de Domínio Externo - Pollyfort

## Visão Geral
Este guia explica como vincular um domínio externo ao seu projeto Pollyfort hospedado no Replit.

## Pré-requisitos
1. Projeto Pollyfort funcionando no Replit
2. Domínio próprio registrado (ex: pollyfort.com)
3. Acesso ao painel de controle do seu provedor de domínio

## Passo 1: Configurar o Projeto para Produção

### 1.1 Verificar Configurações do Servidor
O servidor já está configurado para aceitar conexões externas:
- Escuta em `0.0.0.0:5000` (não apenas localhost)
- Suporta CORS para domínios externos
- Configurado para servir arquivos estáticos

### 1.2 Variáveis de Ambiente Necessárias
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://seu_usuario:sua_senha@host:porta/database
SESSION_SECRET=sua_chave_secreta_super_segura
DOMAIN=seu-dominio.com
```

## Passo 2: Deploy no Replit

### 2.1 Configurar o .replit
```toml
[deployment]
run = ["npm", "run", "build", "&&", "npm", "start"]
deploymentTarget = "autoscale"

[[ports]]
localPort = 5000
externalPort = 80
```

### 2.2 Fazer Deploy
1. No Replit, clique em "Deploy"
2. Escolha "Autoscale deployment"
3. Aguarde o deploy ser concluído
4. Anote a URL do deployment (ex: https://seu-projeto.seu-usuario.replit.app)

## Passo 3: Configurar DNS do Domínio

### 3.1 Registro CNAME (Recomendado)
No painel do seu provedor de domínio, crie um registro CNAME:

```
Tipo: CNAME
Nome: @ (ou deixe vazio para domínio raiz)
Valor: seu-projeto.seu-usuario.replit.app
TTL: 300 (5 minutos)
```

### 3.2 Subdomínio (Alternativo)
Para usar um subdomínio (ex: app.pollyfort.com):

```
Tipo: CNAME
Nome: app
Valor: seu-projeto.seu-usuario.replit.app
TTL: 300
```

### 3.3 Registro A (Se CNAME não funcionar)
Alguns provedores não permitem CNAME no domínio raiz. Use registro A:

```
Tipo: A
Nome: @ (ou deixe vazio)
Valor: IP_DO_REPLIT (consulte documentação do Replit)
TTL: 300
```

## Passo 4: Configurar Domínio no Replit

### 4.1 Adicionar Domínio Personalizado
1. No painel do Replit, vá para o projeto deployado
2. Clique em "Settings" → "Domains"
3. Clique em "Add custom domain"
4. Digite seu domínio: `pollyfort.com` ou `www.pollyfort.com`
5. Siga as instruções de verificação

### 4.2 Aguardar Propagação DNS
- A propagação DNS pode levar de 5 minutos a 48 horas
- Use ferramentas como `nslookup` ou sites como whatsmydns.net para verificar

## Passo 5: Configurar HTTPS (SSL)

### 5.1 Certificado Automático
O Replit fornece certificados SSL automaticamente para domínios personalizados verificados.

### 5.2 Redirecionamento HTTPS
Adicione redirecionamento no servidor (já configurado no código):

```javascript
// Já implementado em server/index.ts
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

## Passo 6: Testes e Verificação

### 6.1 Verificar Funcionamento
1. Acesse seu domínio: `https://pollyfort.com`
2. Teste todas as funcionalidades:
   - Navegação entre páginas
   - Sistema de produtos
   - Formulário de cotação
   - Painel administrativo
   - Sistema CMS

### 6.2 Verificar Performance
- Teste velocidade de carregamento
- Verifique responsividade em diferentes dispositivos
- Confirme funcionamento do SSL

## Troubleshooting

### Problema: "Site não encontrado"
**Soluções:**
1. Verificar se o DNS está correto
2. Aguardar propagação DNS (até 48h)
3. Verificar se o domínio foi adicionado corretamente no Replit

### Problema: "Certificado SSL inválido"
**Soluções:**
1. Aguardar emissão automática do certificado (pode levar algumas horas)
2. Verificar se o domínio está corretamente verificado no Replit
3. Tentar remover e adicionar o domínio novamente

### Problema: "Erro 500 - Internal Server Error"
**Soluções:**
1. Verificar logs do servidor no Replit
2. Confirmar variáveis de ambiente estão corretas
3. Verificar conexão com banco de dados

### Problema: "Assets não carregam"
**Soluções:**
1. Verificar se os caminhos estão corretos para produção
2. Confirmar se o build foi executado corretamente
3. Verificar configuração de servir arquivos estáticos

## Configurações Específicas por Provedor

### Cloudflare
```
Tipo: CNAME
Nome: @
Destino: seu-projeto.seu-usuario.replit.app
Proxy: Desabilitado (nuvem cinza)
```

### GoDaddy
```
Tipo: CNAME
Host: @
Aponta para: seu-projeto.seu-usuario.replit.app
TTL: 1 hora
```

### Namecheap
```
Tipo: CNAME Record
Host: @
Valor: seu-projeto.seu-usuario.replit.app
TTL: Automatic
```

### Registro.br
```
Tipo: CNAME
Nome: (vazio para domínio raiz)
Destino: seu-projeto.seu-usuario.replit.app
TTL: 300
```

## Monitoramento e Manutenção

### 6.1 Monitoramento
- Configure alertas para verificar se o site está online
- Use ferramentas como UptimeRobot ou StatusCake
- Monitore performance com Google PageSpeed Insights

### 6.2 Backup
- Configure backup automático do banco de dados
- Mantenha backup dos arquivos de configuração
- Documente todas as configurações de DNS

## Suporte Adicional

Se você encontrar problemas específicos durante a configuração:

1. **Logs do Servidor**: Verifique os logs no console do Replit
2. **Verificação DNS**: Use `dig pollyfort.com` ou `nslookup pollyfort.com`
3. **Teste de Conectividade**: Use `curl -I https://pollyfort.com`
4. **Documentação Replit**: Consulte docs.replit.com para configurações específicas

## Checklist Final

- [ ] Projeto deployado no Replit
- [ ] Domínio configurado no provedor DNS
- [ ] CNAME/A record apontando para Replit
- [ ] Domínio adicionado no painel Replit
- [ ] SSL certificado ativo
- [ ] Site acessível via HTTPS
- [ ] Todas as funcionalidades testadas
- [ ] Performance verificada
- [ ] Monitoramento configurado

---

**Importante**: A propagação DNS pode levar até 48 horas. Seja paciente e teste periodicamente. Se o problema persistir após esse período, verifique novamente todas as configurações ou entre em contato com o suporte do seu provedor de domínio.