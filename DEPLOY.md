# Guia de Implantação - Pollyfort PHP

## Passos para Produção

### 1. Preparação do Servidor

#### Hospedagem Compartilhada (cPanel)
```bash
# 1. Acesse o cPanel da sua hospedagem
# 2. Vá em "Gerenciador de Arquivos"
# 3. Navegue até public_html
# 4. Faça upload do arquivo pollyfort-php-website.tar.gz
# 5. Extraia o arquivo
```

#### Servidor VPS/Dedicado
```bash
# Apache
sudo apt update
sudo apt install apache2 php php-mysql php-mbstring php-xml mysql-server

# Nginx + PHP-FPM
sudo apt update
sudo apt install nginx php-fpm php-mysql php-mbstring php-xml mysql-server
```

### 2. Configuração do Banco de Dados

```sql
-- Crie o banco
CREATE DATABASE pollyfort_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crie um usuário específico
CREATE USER 'pollyfort_user'@'localhost' IDENTIFIED BY 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON pollyfort_db.* TO 'pollyfort_user'@'localhost';
FLUSH PRIVILEGES;

-- Execute o script de inicialização
USE pollyfort_db;
SOURCE database/init.sql;
```

### 3. Configuração dos Arquivos

#### api/config.php
```php
// Atualize com suas credenciais reais
define('DB_HOST', 'localhost');
define('DB_USER', 'pollyfort_user');
define('DB_PASS', 'sua_senha_real');
define('DB_NAME', 'pollyfort_db');

// Configuração de email (usando Gmail)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USERNAME', 'comercial@pollyfortrodas.com.br');
define('SMTP_PASSWORD', 'sua_senha_de_app_gmail');

// Altere a senha do admin em produção
define('ADMIN_PASSWORD', 'sua_nova_senha_admin');
```

### 4. Configuração do Servidor Web

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# API Routes
RewriteRule ^api/products/?$ api/products.php [L,QSA]
RewriteRule ^api/categories/?$ api/categories.php [L,QSA]
RewriteRule ^api/quotes/?$ api/quotes.php [L,QSA]
RewriteRule ^api/contact/?$ api/contact.php [L,QSA]

# SPA - Redirect all other requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L,QSA]
```

#### Nginx
```nginx
server {
    listen 80;
    server_name pollyfortrodas.com.br www.pollyfortrodas.com.br;
    root /var/www/pollyfort;
    index index.html;

    # API routes
    location /api/ {
        try_files $uri $uri/ @php;
    }

    location @php {
        rewrite ^/api/(.*)$ /api/$1.php last;
    }

    # PHP handling
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. Configuração SSL (Let's Encrypt)

```bash
# Instale o Certbot
sudo apt install certbot python3-certbot-apache

# Para Apache
sudo certbot --apache -d pollyfortrodas.com.br -d www.pollyfortrodas.com.br

# Para Nginx
sudo certbot --nginx -d pollyfortrodas.com.br -d www.pollyfortrodas.com.br
```

### 6. Permissões de Arquivo

```bash
# Defina as permissões corretas
sudo chown -R www-data:www-data /var/www/pollyfort
sudo chmod -R 755 /var/www/pollyfort
sudo chmod 644 /var/www/pollyfort/api/config.php
```

### 7. Configuração de Email

#### Gmail App Password
1. Acesse sua conta Google
2. Vá em "Segurança" > "Verificação em duas etapas"
3. Gere uma "Senha de app" para a aplicação
4. Use essa senha no `SMTP_PASSWORD`

#### Alternativa SMTP
Configure com seu provedor SMTP preferido atualizando as constantes em `config.php`.

### 8. Monitoramento e Logs

#### Logs do Apache
```bash
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

#### Logs do PHP
```bash
sudo tail -f /var/log/php7.4-fpm.log
```

#### Backup Automático
```bash
# Crie um script de backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u pollyfort_user -p pollyfort_db > backup_$DATE.sql
tar -czf backup_files_$DATE.tar.gz /var/www/pollyfort

# Adicione ao crontab para backup diário
0 2 * * * /path/to/backup_script.sh
```

## Checklist de Produção

- [ ] Banco de dados criado e configurado
- [ ] Credenciais do banco atualizadas
- [ ] Configuração SMTP funcional
- [ ] SSL/HTTPS configurado
- [ ] Permissões de arquivo corretas
- [ ] Senha do admin alterada
- [ ] Backup automático configurado
- [ ] Logs monitorados
- [ ] DNS apontando para o servidor
- [ ] Teste de funcionalidades críticas

## Testes Recomendados

1. **Página inicial**: Carregamento e navegação
2. **Catálogo**: Filtros e busca funcionando
3. **Carrinho**: Adição e remoção de produtos
4. **Orçamentos**: Envio e recebimento de emails
5. **Contato**: Formulário e notificações
6. **Admin**: Login e funcionalidades

## Domínio e DNS

Configure os registros DNS para apontar para seu servidor:

```
A     pollyfortrodas.com.br        IP_DO_SERVIDOR
A     www.pollyfortrodas.com.br    IP_DO_SERVIDOR
```

## Manutenção Contínua

- Monitore logs regularmente
- Mantenha backups atualizados
- Atualize o PHP conforme necessário
- Verifique funcionalidade do email
- Monitore performance e uptime

O site estará funcional após completar estes passos.