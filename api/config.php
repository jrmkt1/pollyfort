<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pollyfort_db');

// Company information
define('COMPANY_NAME', 'Pollyfort');
define('COMPANY_EMAIL', 'comercial@pollyfortrodas.com.br');
define('COMPANY_PHONE', '(19) 99912-8023');
define('COMPANY_ADDRESS', 'R ANTONIO DO VALLE MELO Nº88 - Centro - Sumaré/SP - CEP: 13.170-010');
define('COMPANY_CNPJ', '45.647.003/0001-50');

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', COMPANY_EMAIL);
define('SMTP_PASSWORD', ''); // Set your SMTP password
define('SMTP_ENCRYPTION', 'tls');

// Security
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'pollyfort2025'); // Change in production
define('JWT_SECRET', 'pollyfort_secret_key_2025'); // Change in production

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection function
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

// Response helper functions
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function errorResponse($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit();
}

// Input validation
function validateRequired($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            errorResponse("Field '$field' is required", 400);
        }
    }
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Email validation
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Generate UUID
function generateUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}
?>