<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getQuotes();
        break;
    case 'POST':
        createQuote();
        break;
    case 'PUT':
        updateQuote();
        break;
    case 'DELETE':
        deleteQuote();
        break;
    default:
        errorResponse('Method not allowed', 405);
}

function getQuotes() {
    try {
        $pdo = getDBConnection();
        
        $sql = "SELECT q.*, 
                (SELECT COUNT(*) FROM quote_items qi WHERE qi.quote_id = q.id) as item_count
                FROM quotes q 
                ORDER BY q.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $quotes = $stmt->fetchAll();
        
        jsonResponse($quotes);
        
    } catch (Exception $e) {
        error_log("Error fetching quotes: " . $e->getMessage());
        errorResponse('Failed to fetch quotes', 500);
    }
}

function createQuote() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        validateRequired($input, ['name', 'email', 'phone', 'company', 'message']);
        
        if (!validateEmail($input['email'])) {
            errorResponse('Invalid email format', 400);
        }
        
        $pdo = getDBConnection();
        $pdo->beginTransaction();
        
        try {
            // Insert quote
            $sql = "INSERT INTO quotes (name, email, phone, company, message, status, created_at) 
                    VALUES (?, ?, ?, ?, ?, 'pending', NOW())";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                sanitizeInput($input['name']),
                sanitizeInput($input['email']),
                sanitizeInput($input['phone']),
                sanitizeInput($input['company']),
                sanitizeInput($input['message'])
            ]);
            
            $quoteId = $pdo->lastInsertId();
            
            // Insert quote items if provided
            if (isset($input['items']) && is_array($input['items'])) {
                $itemSql = "INSERT INTO quote_items (quote_id, product_id, product_name, quantity) VALUES (?, ?, ?, ?)";
                $itemStmt = $pdo->prepare($itemSql);
                
                foreach ($input['items'] as $item) {
                    $itemStmt->execute([
                        $quoteId,
                        $item['id'] ?? null,
                        sanitizeInput($item['name'] ?? ''),
                        intval($item['quantity'] ?? 1)
                    ]);
                }
            }
            
            $pdo->commit();
            
            // Send email notification
            sendQuoteNotification($input);
            
            jsonResponse(['message' => 'Quote created successfully', 'id' => $quoteId], 201);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
        
    } catch (Exception $e) {
        error_log("Error creating quote: " . $e->getMessage());
        errorResponse('Failed to create quote', 500);
    }
}

function updateQuote() {
    try {
        $quoteId = $_GET['id'] ?? null;
        if (!$quoteId) {
            errorResponse('Quote ID is required', 400);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $pdo = getDBConnection();
        
        // Check if quote exists
        $stmt = $pdo->prepare("SELECT id FROM quotes WHERE id = ?");
        $stmt->execute([$quoteId]);
        if (!$stmt->fetch()) {
            errorResponse('Quote not found', 404);
        }
        
        $updateFields = [];
        $params = [];
        
        if (isset($input['status'])) {
            $updateFields[] = 'status = ?';
            $params[] = sanitizeInput($input['status']);
        }
        
        if (isset($input['response_message'])) {
            $updateFields[] = 'response_message = ?';
            $params[] = sanitizeInput($input['response_message']);
        }
        
        if (isset($input['total_value'])) {
            $updateFields[] = 'total_value = ?';
            $params[] = sanitizeInput($input['total_value']);
        }
        
        if (isset($input['valid_until'])) {
            $updateFields[] = 'valid_until = ?';
            $params[] = sanitizeInput($input['valid_until']);
        }
        
        if (empty($updateFields)) {
            errorResponse('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $quoteId;
        
        $sql = "UPDATE quotes SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        jsonResponse(['message' => 'Quote updated successfully']);
        
    } catch (Exception $e) {
        error_log("Error updating quote: " . $e->getMessage());
        errorResponse('Failed to update quote', 500);
    }
}

function deleteQuote() {
    try {
        $quoteId = $_GET['id'] ?? null;
        if (!$quoteId) {
            errorResponse('Quote ID is required', 400);
        }
        
        $pdo = getDBConnection();
        $pdo->beginTransaction();
        
        try {
            // Delete quote items first
            $stmt = $pdo->prepare("DELETE FROM quote_items WHERE quote_id = ?");
            $stmt->execute([$quoteId]);
            
            // Delete quote
            $stmt = $pdo->prepare("DELETE FROM quotes WHERE id = ?");
            $stmt->execute([$quoteId]);
            
            if ($stmt->rowCount() === 0) {
                errorResponse('Quote not found', 404);
            }
            
            $pdo->commit();
            
            jsonResponse(['message' => 'Quote deleted successfully']);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
        
    } catch (Exception $e) {
        error_log("Error deleting quote: " . $e->getMessage());
        errorResponse('Failed to delete quote', 500);
    }
}

function sendQuoteNotification($quoteData) {
    $to = COMPANY_EMAIL;
    $subject = "Nova Solicitação de Orçamento - Pollyfort";
    
    $message = "
    <html>
    <head>
        <title>Nova Solicitação de Orçamento</title>
    </head>
    <body>
        <h2>Nova Solicitação de Orçamento</h2>
        <p><strong>Nome:</strong> {$quoteData['name']}</p>
        <p><strong>Email:</strong> {$quoteData['email']}</p>
        <p><strong>Telefone:</strong> {$quoteData['phone']}</p>
        <p><strong>Empresa:</strong> {$quoteData['company']}</p>
        <p><strong>Mensagem:</strong></p>
        <p>{$quoteData['message']}</p>
        
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