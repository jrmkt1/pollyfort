-- Pollyfort Database Schema
CREATE DATABASE IF NOT EXISTS pollyfort_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pollyfort_db;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    specifications TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name)
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'responded', 'completed', 'cancelled') DEFAULT 'pending',
    response_message TEXT,
    total_value VARCHAR(50),
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Quote items table
CREATE TABLE IF NOT EXISTS quote_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'responded') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, description, category, specifications, image_url) VALUES
('Roda de Tração 230x70mm - Linha Pesada', 'Roda de poliuretano de alta resistência para empilhadeiras de grande porte. Ideal para operações pesadas com durabilidade excepcional.', 'Rodas de Tração', 'Diâmetro: 230mm, Largura: 70mm, Capacidade: 3000kg, Material: Poliuretano de alta densidade', 'assets/images/roda-tracao-230.jpg'),
('Roda de Carga 180x50mm - Linha Standard', 'Roda de poliuretano padrão para aplicações gerais em empilhadeiras de médio porte. Oferece excelente relação custo-benefício.', 'Rodas de Carga', 'Diâmetro: 180mm, Largura: 50mm, Capacidade: 2000kg, Material: Poliuretano standard', 'assets/images/roda-carga-180.jpg'),
('Roda Direcional 125x40mm - Linha Compacta', 'Roda de poliuretano compacta para direção de empilhadeiras pequenas e médias. Design otimizado para manobrabilidade.', 'Rodas Direcionais', 'Diâmetro: 125mm, Largura: 40mm, Capacidade: 1500kg, Material: Poliuretano flexível', 'assets/images/roda-direcional-125.jpg'),
('Roda de Tração 200x75mm - Linha Média', 'Roda de poliuretano para empilhadeiras de porte médio. Ideal para uso intensivo em ambientes industriais.', 'Rodas de Tração', 'Diâmetro: 200mm, Largura: 75mm, Capacidade: 2500kg, Material: Poliuretano reforçado', 'assets/images/roda-tracao-200.jpg'),
('Roda de Carga 160x45mm - Linha Econômica', 'Roda de poliuretano econômica para aplicações básicas. Boa durabilidade com preço acessível.', 'Rodas de Carga', 'Diâmetro: 160mm, Largura: 45mm, Capacidade: 1800kg, Material: Poliuretano econômico', 'assets/images/roda-carga-160.jpg'),
('Roda Direcional 110x35mm - Linha Compacta', 'Roda de poliuretano ultra compacta para empilhadeiras pequenas. Perfeita para espaços reduzidos.', 'Rodas Direcionais', 'Diâmetro: 110mm, Largura: 35mm, Capacidade: 1200kg, Material: Poliuretano compacto', 'assets/images/roda-direcional-110.jpg');

-- Insert default admin user (password: pollyfort2025)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@pollyfortrodas.com.br');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_title', 'Pollyfort - Rodas para Empilhadeiras'),
('company_name', 'Pollyfort'),
('company_email', 'comercial@pollyfortrodas.com.br'),
('company_phone', '(19) 99912-8023'),
('company_address', 'R ANTONIO DO VALLE MELO Nº88 - Centro - Sumaré/SP - CEP: 13.170-010'),
('company_cnpj', '45.647.003/0001-50'),
('meta_description', 'Especialista em rodas de poliuretano para empilhadeiras. Qualidade superior, durabilidade garantida e atendimento personalizado em Sumaré-SP.'),
('meta_keywords', 'rodas empilhadeira, poliuretano, rodas tração, rodas carga, rodas direcionais, Sumaré SP'),
('google_analytics_id', ''),
('facebook_pixel_id', ''),
('whatsapp_number', '5519999128023');