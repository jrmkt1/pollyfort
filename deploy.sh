#!/bin/bash

echo "🚀 Configurando deploy para pollyfortrodas.com.br"

# Configurar variáveis de ambiente para produção
export NODE_ENV=production
export DOMAIN=pollyfortrodas.com.br

# Verificar se a aplicação está funcionando
echo "📡 Testando aplicação..."
curl -s http://localhost:5000/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Aplicação funcionando localmente"
else
    echo "❌ Erro: Aplicação não está respondendo"
    exit 1
fi

# Testar endpoints essenciais
echo "🔍 Testando endpoints..."
curl -s http://localhost:5000/api/products > /dev/null && echo "✅ API Products OK" || echo "❌ API Products falhou"
curl -s http://localhost:5000/api/categories > /dev/null && echo "✅ API Categories OK" || echo "❌ API Categories falhou"

# Criar arquivo de configuração do domínio
echo "🌐 Configurando domínio personalizado..."
cat > domain-config.json << EOF
{
  "domain": "pollyfortrodas.com.br",
  "production": true,
  "https": true,
  "cors": {
    "origin": ["https://pollyfortrodas.com.br", "https://www.pollyfortrodas.com.br"],
    "credentials": true
  },
  "headers": {
    "security": true,
    "hsts": true
  }
}
EOF

echo "📋 Configuração do domínio:"
echo "1. No seu provedor DNS, configure:"
echo "   Tipo: CNAME"
echo "   Nome: @ (ou www)"
echo "   Valor: SEU-PROJETO.SEU-USUARIO.replit.app"
echo ""
echo "2. No Replit Deploy:"
echo "   - Acesse Deployments → Settings → Domains"
echo "   - Adicione: pollyfortrodas.com.br"
echo "   - Aguarde verificação automática"
echo ""
echo "3. Verificar funcionamento:"
echo "   curl https://pollyfortrodas.com.br/health"
echo ""

# Verificar se os scripts de domínio existem
if [ -f "scripts/domain-verify.js" ]; then
    echo "🔧 Para verificar o domínio após configuração:"
    echo "   node scripts/domain-verify.js pollyfortrodas.com.br"
fi

echo "✅ Deploy configurado para produção com domínio personalizado"
echo "🌐 Domínio: https://pollyfortrodas.com.br"