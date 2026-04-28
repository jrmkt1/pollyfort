#!/usr/bin/env node

/**
 * Script de Configuração de Domínio para Pollyfort
 * Facilita a configuração de domínio externo no Replit
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDomain() {
  console.log('\n🌐 Configuração de Domínio Externo - Pollyfort\n');
  
  try {
    const domain = await question('Digite seu domínio (ex: pollyfort.com): ');
    
    if (!domain || !domain.includes('.')) {
      console.log('❌ Domínio inválido. Tente novamente.');
      rl.close();
      return;
    }
    
    console.log('\n📋 Configurações necessárias para seu domínio:');
    console.log(`Domain: ${domain}`);
    
    // Gerar configurações específicas
    const configs = generateDomainConfigs(domain);
    
    console.log('\n🔧 Configurações DNS necessárias:');
    console.log('─'.repeat(50));
    console.log(`Tipo: CNAME`);
    console.log(`Nome: @ (ou deixe vazio)`);
    console.log(`Valor: [SEU-PROJETO].[SEU-USUARIO].replit.app`);
    console.log(`TTL: 300 (5 minutos)`);
    console.log('─'.repeat(50));
    
    // Salvar configuração
    const envConfig = `
# Configuração de Domínio Personalizado
DOMAIN=${domain}
NODE_ENV=production
PORT=5000

# Adicione estas variáveis no Replit Secrets:
# DATABASE_URL=sua_url_do_banco
# SESSION_SECRET=sua_chave_secreta
`;
    
    fs.writeFileSync('.env.domain', envConfig);
    console.log('\n✅ Arquivo .env.domain criado com as configurações');
    
    console.log('\n📚 Próximos passos:');
    console.log('1. Configure o DNS no seu provedor de domínio');
    console.log('2. No Replit Deploy, adicione o domínio personalizado');
    console.log('3. Aguarde a propagação DNS (5min-48h)');
    console.log('4. Teste o acesso: https://' + domain);
    
    // Verificar se já existe deployment
    const hasDeployment = process.env.REPLIT_DEPLOYMENT_ID;
    if (hasDeployment) {
      console.log('\n🚀 Deployment detectado!');
      console.log('Acesse: Deployments → Settings → Domains');
      console.log(`Adicione: ${domain}`);
    } else {
      console.log('\n⚠️ Faça o deploy primeiro:');
      console.log('1. Clique em "Deploy" no Replit');
      console.log('2. Escolha "Autoscale deployment"');
      console.log('3. Depois adicione o domínio personalizado');
    }
    
    console.log('\n🔍 Para verificar a propagação DNS:');
    console.log(`nslookup ${domain}`);
    console.log(`dig ${domain}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    rl.close();
  }
}

function generateDomainConfigs(domain) {
  return {
    domain: domain,
    www: `www.${domain}`,
    https: `https://${domain}`,
    httpsWww: `https://www.${domain}`
  };
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDomain();
}

module.exports = { setupDomain, generateDomainConfigs };