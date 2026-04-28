<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getProducts();
        break;
    case 'POST':
        createProduct();
        break;
    case 'PUT':
        updateProduct();
        break;
    case 'DELETE':
        deleteProduct();
        break;
    default:
        errorResponse('Method not allowed', 405);
}

function getProducts() {
    try {
        $pdo = getDBConnection();
        
        // Get filters from query parameters
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $sortBy = $_GET['sortBy'] ?? 'name';
        $sortOrder = $_GET['sortOrder'] ?? 'ASC';
        
        $sql = "SELECT * FROM products WHERE 1=1";
        $params = [];
        
        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }
        
        if ($search) {
            $sql .= " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        // Validate sort fields
        $allowedSortFields = ['name', 'category', 'created_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'name';
        }
        
        $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
        $sql .= " ORDER BY $sortBy $sortOrder";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        
        jsonResponse($products);
        
    } catch (Exception $e) {
        error_log("Error fetching products: " . $e->getMessage());
        errorResponse('Failed to fetch products', 500);
    }
}

function createProduct() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        validateRequired($input, ['name', 'description', 'category']);
        
        $pdo = getDBConnection();
        
        $sql = "INSERT INTO products (name, description, category, specifications, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            sanitizeInput($input['name']),
            sanitizeInput($input['description']),
            sanitizeInput($input['category']),
            sanitizeInput($input['specifications'] ?? ''),
            sanitizeInput($input['image_url'] ?? '')
        ]);
        
        $productId = $pdo->lastInsertId();
        
        // Return the created product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        jsonResponse($product, 201);
        
    } catch (Exception $e) {
        error_log("Error creating product: " . $e->getMessage());
        errorResponse('Failed to create product', 500);
    }
}

function updateProduct() {
    try {
        $productId = $_GET['id'] ?? null;
        if (!$productId) {
            errorResponse('Product ID is required', 400);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $pdo = getDBConnection();
        
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        if (!$stmt->fetch()) {
            errorResponse('Product not found', 404);
        }
        
        $updateFields = [];
        $params = [];
        
        if (isset($input['name'])) {
            $updateFields[] = 'name = ?';
            $params[] = sanitizeInput($input['name']);
        }
        
        if (isset($input['description'])) {
            $updateFields[] = 'description = ?';
            $params[] = sanitizeInput($input['description']);
        }
        
        if (isset($input['category'])) {
            $updateFields[] = 'category = ?';
            $params[] = sanitizeInput($input['category']);
        }
        
        if (isset($input['specifications'])) {
            $updateFields[] = 'specifications = ?';
            $params[] = sanitizeInput($input['specifications']);
        }
        
        if (isset($input['image_url'])) {
            $updateFields[] = 'image_url = ?';
            $params[] = sanitizeInput($input['image_url']);
        }
        
        if (empty($updateFields)) {
            errorResponse('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $productId;
        
        $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Return updated product
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        jsonResponse($product);
        
    } catch (Exception $e) {
        error_log("Error updating product: " . $e->getMessage());
        errorResponse('Failed to update product', 500);
    }
}

function deleteProduct() {
    try {
        $productId = $_GET['id'] ?? null;
        if (!$productId) {
            errorResponse('Product ID is required', 400);
        }
        
        $pdo = getDBConnection();
        
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        if (!$stmt->fetch()) {
            errorResponse('Product not found', 404);
        }
        
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        
        jsonResponse(['message' => 'Product deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Error deleting product: " . $e->getMessage());
        errorResponse('Failed to delete product', 500);
    }
}
?>