# Soluções para Problemas de Vinculação de Domínio Externo

## Diagnóstico Rápido

### 1. Verificar Status da Aplicação
Acesse: `https://seu-projeto.seu-usuario.replit.app/health`

Se retornar JSON com status "ok", a aplicação está funcionando.

### 2. Verificar Configuração de Domínio
Acesse: `https://seu-projeto.seu-usuario.replit.app/domain-check`

Verifica se o domínio está configurado corretamente.

## Problemas Mais Comuns e Soluções

### ❌ Erro: "Site não pode ser acessado" / "ERR_NAME_NOT_RESOLVED"

**Causa**: DNS não está configurado ou não propagou

**Soluções**:
1. Verificar configuração DNS no provedor:
   ```
   Tipo: CNAME
   Nome: @ (ou www)
   Valor: SEU-PROJETO.SEU-USUARIO.replit.app
   ```

2. Testar propagação DNS:
   ```bash
   nslookup seu-dominio.com
   dig seu-dominio.com
   ```

3. Usar ferramenta online: whatsmydns.net

4. Aguardar até 48h para propagação completa

### ❌ Erro: "Certificado SSL inválido" / "Não seguro"

**Causa**: Certificado SSL não foi emitido automaticamente

**Soluções**:
1. Verificar se domínio foi adicionado no Replit Deploy
2. Aguardar emissão automática (pode levar algumas horas)
3. Remover e adicionar domínio novamente no Replit
4. Verificar se DNS está correto

### ❌ Erro: "502 Bad Gateway" / "503 Service Unavailable"

**Causa**: Aplicação não está rodando ou com problemas

**Soluções**:
1. Verificar logs no console do Replit
2. Reiniciar o deployment
3. Verificar se variáveis de ambiente estão corretas
4. Testar endpoint de health: `/health`

### ❌ Erro: "404 Not Found" em algumas páginas

**Causa**: Roteamento SPA não configurado corretamente

**Solução**: Já configurado no código para redirecionar para index.html

### ❌ Erro: "CORS" / "Access-Control-Allow-Origin"

**Causa**: Configuração de CORS para domínio personalizado

**Solução**: Definir variável de ambiente `DOMAIN=seu-dominio.com`

## Checklist de Verificação

### ✅ Pré-Deploy
- [ ] Aplicação roda localmente sem erros
- [ ] Build executa sem problemas (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados acessível

### ✅ Deploy no Replit
- [ ] Deploy executado com sucesso
- [ ] URL do Replit acessível
- [ ] Endpoint `/health` retorna status "ok"
- [ ] Todas as funcionalidades testadas

### ✅ Configuração DNS
- [ ] Registro CNAME criado no provedor DNS
- [ ] Valor correto: SEU-PROJETO.SEU-USUARIO.replit.app
- [ ] TTL configurado (300 segundos recomendado)
- [ ] Propagação DNS verificada

### ✅ Configuração no Replit
- [ ] Domínio adicionado em Deploy → Settings → Domains
- [ ] Domínio verificado (marca verde)
- [ ] SSL ativo (cadeado verde)
- [ ] Redirecionamento HTTPS funcionando

### ✅ Testes Finais
- [ ] Site acessível via domínio personalizado
- [ ] HTTPS ativo e funcionando
- [ ] Todas as páginas carregam corretamente
- [ ] Formulários funcionam
- [ ] Admin panel acessível
- [ ] API endpoints respondem

## Comandos de Diagnóstico

### Verificar DNS
```bash
# Verificar registro CNAME
nslookup -type=CNAME seu-dominio.com

# Verificar IP
nslookup seu-dominio.com

# Verificar propagação global
dig seu-dominio.com @8.8.8.8
```

### Testar Conectividade
```bash
# Testar conexão HTTP
curl -I http://seu-dominio.com

# Testar conexão HTTPS
curl -I https://seu-dominio.com

# Testar endpoint específico
curl https://seu-dominio.com/health
```

### Verificar SSL
```bash
# Informações do certificado
openssl s_client -connect seu-dominio.com:443 -servername seu-dominio.com
```

## Ferramentas Úteis Online

- **DNS Propagation**: whatsmydns.net
- **SSL Check**: ssllabs.com/ssltest
- **Domain Health**: downforeveryoneorjustme.com
- **Speed Test**: pagespeed.web.dev
- **Security Check**: securityheaders.com

## Contatos de Suporte

### Replit Support
- Documentação: docs.replit.com
- Community: replit.com/talk
- Support: Via chat no painel do Replit

### Provedores DNS Comuns
- **Cloudflare**: support.cloudflare.com
- **GoDaddy**: godaddy.com/help
- **Namecheap**: namecheap.com/support
- **Registro.br**: registro.br/ajuda

## Scripts de Automação

### Verificação Automática
Execute no terminal do Replit:
```bash
node scripts/domain-setup.js
```

### Deploy Otimizado
```bash
./deploy.sh
```

### Health Check
```bash
curl https://seu-dominio.com/health | jq
```

## Monitoramento Contínuo

Configurar alertas para:
- Site fora do ar (UptimeRobot, StatusCake)
- Certificado SSL expirando
- Performance degradada
- Erros 5xx

---

**Nota**: Se o problema persistir após seguir todos os passos, verifique se não há cache de DNS local ou proxy corporativo interferindo. Teste de diferentes redes/dispositivos.