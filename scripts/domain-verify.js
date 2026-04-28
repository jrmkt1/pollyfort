#!/usr/bin/env node

/**
 * Verificador Automático de Domínio - Pollyfort
 * Testa e diagnostica problemas de vinculação de domínio externo
 */

const { exec } = require('child_process');
const https = require('https');
const http = require('http');

class DomainVerifier {
  constructor(domain) {
    this.domain = domain;
    this.results = {
      dns: false,
      http: false,
      https: false,
      ssl: false,
      replit: false,
      health: false
    };
  }

  async verifyAll() {
    console.log(`\n🔍 Verificando domínio: ${this.domain}\n`);

    await this.checkDNS();
    await this.checkHTTP();
    await this.checkHTTPS();
    await this.checkSSL();
    await this.checkHealth();

    this.generateReport();
  }

  async checkDNS() {
    return new Promise((resolve) => {
      console.log('📡 Verificando DNS...');
      exec(`nslookup ${this.domain}`, (error, stdout, stderr) => {
        if (!error && stdout.includes('Address:')) {
          // Verificar se está apontando para si mesmo (loop)
          if (stdout.includes(this.domain)) {
            console.log('❌ DNS: CNAME em loop - apontando para si mesmo');
            console.log('   ERRO: Não pode apontar pollyfortrodas.com.br para pollyfortrodas.com.br');
            console.log('   CORRETO: Aponte para SEU-PROJETO.SEU-USUARIO.replit.app');
          } else if (stdout.includes('replit.app')) {
            console.log('✅ DNS: Configurado corretamente');
            this.results.dns = true;
          } else {
            console.log('❌ DNS: Não está apontando para Replit');
            console.log('   Configure CNAME para SEU-PROJETO.SEU-USUARIO.replit.app');
          }
        } else {
          console.log('❌ DNS: Não configurado ou não propagado');
          console.log('   Configure um registro CNAME apontando para SEU-PROJETO.SEU-USUARIO.replit.app');
        }
        resolve();
      });
    });
  }

  async checkHTTP() {
    return new Promise((resolve) => {
      console.log('🌐 Verificando HTTP...');
      const req = http.get(`http://${this.domain}`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          console.log('✅ HTTP: Acessível');
          this.results.http = true;
        } else {
          console.log(`❌ HTTP: Status ${res.statusCode}`);
        }
        resolve();
      });

      req.on('error', (error) => {
        console.log('❌ HTTP: Não acessível');
        console.log(`   Erro: ${error.message}`);
        resolve();
      });

      req.setTimeout(10000, () => {
        console.log('❌ HTTP: Timeout');
        req.destroy();
        resolve();
      });
    });
  }

  async checkHTTPS() {
    return new Promise((resolve) => {
      console.log('🔒 Verificando HTTPS...');
      const req = https.get(`https://${this.domain}`, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ HTTPS: Funcionando');
          this.results.https = true;
          this.results.ssl = true;
        } else if (res.statusCode === 301 || res.statusCode === 302) {
          console.log('✅ HTTPS: Redirecionamento ativo');
          this.results.https = true;
        } else {
          console.log(`❌ HTTPS: Status ${res.statusCode}`);
        }
        resolve();
      });

      req.on('error', (error) => {
        console.log('❌ HTTPS: Não acessível');
        if (error.code === 'CERT_AUTHORITY_INVALID') {
          console.log('   Problema: Certificado SSL inválido');
        } else if (error.code === 'ENOTFOUND') {
          console.log('   Problema: DNS não resolvido');
        } else {
          console.log(`   Erro: ${error.message}`);
        }
        resolve();
      });

      req.setTimeout(10000, () => {
        console.log('❌ HTTPS: Timeout');
        req.destroy();
        resolve();
      });
    });
  }

  async checkSSL() {
    return new Promise((resolve) => {
      console.log('🛡️ Verificando certificado SSL...');
      exec(`echo | openssl s_client -connect ${this.domain}:443 -servername ${this.domain} 2>/dev/null | openssl x509 -noout -dates`, (error, stdout, stderr) => {
        if (!error && stdout.includes('notAfter')) {
          console.log('✅ SSL: Certificado válido');
          const match = stdout.match(/notAfter=(.+)/);
          if (match) {
            console.log(`   Expira em: ${match[1]}`);
          }
          this.results.ssl = true;
        } else {
          console.log('❌ SSL: Certificado não encontrado ou inválido');
        }
        resolve();
      });
    });
  }

  async checkHealth() {
    return new Promise((resolve) => {
      console.log('❤️ Verificando health check...');
      const req = https.get(`https://${this.domain}/health`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            if (health.status === 'ok') {
              console.log('✅ Health: Aplicação funcionando');
              console.log(`   Uptime: ${Math.floor(health.uptime / 60)} minutos`);
              this.results.health = true;
            } else {
              console.log('❌ Health: Aplicação com problemas');
            }
          } catch (error) {
            console.log('❌ Health: Resposta inválida');
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        console.log('❌ Health: Endpoint não acessível');
        resolve();
      });

      req.setTimeout(10000, () => {
        console.log('❌ Health: Timeout');
        req.destroy();
        resolve();
      });
    });
  }

  generateReport() {
    console.log('\n📊 RELATÓRIO DE VERIFICAÇÃO');
    console.log('═'.repeat(40));

    const checks = [
      { name: 'DNS Configurado', status: this.results.dns },
      { name: 'HTTP Acessível', status: this.results.http },
      { name: 'HTTPS Funcionando', status: this.results.https },
      { name: 'SSL Válido', status: this.results.ssl },
      { name: 'Aplicação Saudável', status: this.results.health }
    ];

    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
    });

    const successCount = Object.values(this.results).filter(Boolean).length;
    const totalChecks = Object.keys(this.results).length;

    console.log('\n📈 STATUS GERAL');
    console.log(`${successCount}/${totalChecks} verificações passaram`);

    if (successCount === totalChecks) {
      console.log('🎉 Domínio configurado com sucesso!');
    } else {
      console.log('\n🔧 PRÓXIMOS PASSOS:');
      this.generateTroubleshootingSteps();
    }
  }

  generateTroubleshootingSteps() {
    if (!this.results.dns) {
      console.log('1. Configure DNS no seu provedor:');
      console.log('   Tipo: CNAME, Nome: @, Valor: SEU-PROJETO.SEU-USUARIO.replit.app');
    }

    if (!this.results.http && this.results.dns) {
      console.log('2. Verifique se a aplicação está deployada no Replit');
    }

    if (!this.results.https && this.results.http) {
      console.log('3. Adicione o domínio no Replit Deploy → Settings → Domains');
    }

    if (!this.results.ssl && this.results.https) {
      console.log('4. Aguarde a emissão automática do certificado SSL (até 24h)');
    }

    if (!this.results.health) {
      console.log('5. Verifique logs da aplicação no console do Replit');
    }
  }
}

// Executar verificação
async function main() {
  const domain = process.argv[2];

  if (!domain) {
    console.log('Uso: node scripts/domain-verify.js seu-dominio.com');
    process.exit(1);
  }

  const verifier = new DomainVerifier(domain);
  await verifier.verifyAll();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DomainVerifier;