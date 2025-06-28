<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get query parameters
    $type = $_GET['type'] ?? 'all';
    $category = $_GET['category'] ?? 'all';
    $search = $_GET['search'] ?? '';
    $active_only = $_GET['active_only'] ?? 'true';

    // Build query
    $whereConditions = [];
    $params = [];

    if ($active_only === 'true') {
        $whereConditions[] = "is_active = :active";
        $params[':active'] = 1;
    }

    if ($type !== 'all') {
        $whereConditions[] = "type = :type";
        $params[':type'] = $type;
    }

    if ($category !== 'all') {
        $whereConditions[] = "category = :category";
        $params[':category'] = $category;
    }

    if (!empty($search)) {
        $whereConditions[] = "(title LIKE :search OR description LIKE :search OR JSON_SEARCH(tags, 'one', :search_tag) IS NOT NULL)";
        $params[':search'] = '%' . $search . '%';
        $params[':search_tag'] = '%' . $search . '%';
    }

    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

    $query = "SELECT p.*, u.name as creator_name 
              FROM prompts p 
              LEFT JOIN users u ON p.created_by = u.id 
              $whereClause 
              ORDER BY p.created_at DESC";

    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $prompts = $stmt->fetchAll();

    // Process prompts data
    foreach ($prompts as &$prompt) {
        // Parse JSON tags
        $prompt['tags'] = json_decode($prompt['tags'], true) ?: [];
        
        // Convert boolean
        $prompt['isActive'] = (bool)$prompt['is_active'];
        
        // Format dates
        $prompt['createdAt'] = $prompt['created_at'];
        $prompt['updatedAt'] = $prompt['updated_at'];
        
        // Clean up database field names
        unset($prompt['is_active'], $prompt['created_at'], $prompt['updated_at']);
    }

    sendResponse([
        'success' => true,
        'prompts' => $prompts
    ]);

} catch (Exception $e) {
    error_log("Get prompts error: " . $e->getMessage());
    sendError('Failed to fetch prompts', 500);
}
?>