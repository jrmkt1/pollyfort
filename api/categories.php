<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCategories();
        break;
    default:
        errorResponse('Method not allowed', 405);
}

function getCategories() {
    try {
        $pdo = getDBConnection();
        
        $sql = "SELECT category as name, COUNT(*) as count 
                FROM products 
                GROUP BY category 
                ORDER BY category";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $categories = $stmt->fetchAll();
        
        jsonResponse($categories);
        
    } catch (Exception $e) {
        error_log("Error fetching categories: " . $e->getMessage());
        errorResponse('Failed to fetch categories', 500);
    }
}
?>