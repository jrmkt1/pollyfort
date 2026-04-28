<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handleContactForm();
        break;
    default:
        errorResponse('Method not allowed', 405);
}

function handleContactForm() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        validateRequired($input, ['name', 'email', 'message']);
        
        if (!validateEmail($input['email'])) {
            errorResponse('Invalid email format', 400);
        }
        
        $pdo = getDBConnection();
        
        // Insert contact message
        $sql = "INSERT INTO contact_messages (name, email, phone, company, message, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            sanitizeInput($input['name']),
            sanitizeInput($input['email']),
            sanitizeInput($input['phone'] ?? ''),
            sanitizeInput($input['company'] ?? ''),
            sanitizeInput($input['message'])
        ]);
        
        // Send email notification
        sendContactNotification($input);
        
        jsonResponse(['message' => 'Message sent successfully'], 201);
        
    } catch (Exception $e) {
        error_log("Error handling contact form: " . $e->getMessage());
        errorResponse('Failed to send message', 500);
    }
}

function sendContactNotification($contactData) {
    $to = COMPANY_EMAIL;
    $subject = "Nova Mensagem de Contato - Pollyfort";
    
    $message = "
    <html>
    <head>
        <title>Nova Mensagem de Contato</title>
    </head>
    <body>
        <h2>Nova Mensagem de Contato</h2>
        <p><strong>Nome:</strong> {$contactData['name']}</p>
        <p><strong>Email:</strong> {$contactData['email']}</p>
        <p><strong>Telefone:</strong> " . ($contactData['phone'] ?? 'Não informado') . "</p>
        <p><strong>Empresa:</strong> " . ($contactData['company'] ?? 'Não informada') . "</p>
        <p><strong>Mensagem:</strong></p>
        <p>{$contactData['message']}</p>
        
        <p>Data: " . date('d/m/Y H:i:s') . "</p>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . COMPANY_EMAIL . "\r\n";
    
    mail($to, $subject, $message, $headers);
}
?>