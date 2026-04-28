#!/usr/bin/env node

// Production startup script for Pollyfort
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const isDev = process.env.NODE_ENV !== 'production';

console.log(`🚀 Starting Pollyfort in ${isDev ? 'development' : 'production'} mode`);

// Set production environment variables
if (!isDev) {
  process.env.NODE_ENV = 'production';
  process.env.DOMAIN = 'pollyfortrodas.com.br';
  console.log('🌐 Domain configured: pollyfortrodas.com.br');
}

// Create a simple index.html if it doesn't exist for production fallback
const indexPath = path.resolve(process.cwd(), 'index.html');
if (!fs.existsSync(indexPath) && !isDev) {
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pollyfort - Rodas e Peças para Empilhadeiras</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
        .loading {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Pollyfort</h1>
        <p>Especialistas em rodas e peças para empilhadeiras elétricas</p>
        <div class="loading"></div>
        <p style="margin-top: 20px; font-size: 1rem;">Carregando aplicação...</p>
        <a href="/" class="btn">Atualizar Página</a>
    </div>
    
    <script>
        // Auto refresh every 5 seconds to check if app is loaded
        let attempts = 0;
        const maxAttempts = 12; // 1 minute total
        
        function checkApp() {
            attempts++;
            if (attempts >= maxAttempts) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('p').innerHTML = 'Aplicação carregando... Tente atualizar a página.';
                return;
            }
            
            fetch('/api/products')
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    }
                })
                .catch(() => {
                    setTimeout(checkApp, 5000);
                });
        }
        
        // Start checking after 3 seconds
        setTimeout(checkApp, 3000);
    </script>
</body>
</html>`;
  
  fs.writeFileSync(indexPath, htmlContent);
  console.log('📄 Created fallback index.html');
}

// Start the server
const serverScript = isDev ? 'server/index.ts' : 'dist/index.js';
const command = isDev ? 'tsx' : 'node';

console.log(`⚡ Starting server: ${command} ${serverScript}`);

const server = spawn(command, [serverScript], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: isDev ? 'development' : 'production',
    PORT: '5000',
    DOMAIN: 'pollyfortrodas.com.br'
  }
});

server.on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🛑 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});