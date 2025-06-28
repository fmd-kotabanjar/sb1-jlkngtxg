<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get query parameters
    $user_id = $_GET['user_id'] ?? null;
    $status = $_GET['status'] ?? 'all';
    $priority = $_GET['priority'] ?? 'all';
    $search = $_GET['search'] ?? '';

    // Build query
    $whereConditions = [];
    $params = [];

    if ($user_id) {
        $whereConditions[] = "pr.user_id = :user_id";
        $params[':user_id'] = $user_id;
    }

    if ($status !== 'all') {
        $whereConditions[] = "pr.status = :status";
        $params[':status'] = $status;
    }

    if ($priority !== 'all') {
        $whereConditions[] = "pr.priority = :priority";
        $params[':priority'] = $priority;
    }

    if (!empty($search)) {
        $whereConditions[] = "(pr.title LIKE :search OR pr.description LIKE :search OR u.name LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

    $query = "SELECT pr.*, u.name as userName 
              FROM prompt_requests pr 
              LEFT JOIN users u ON pr.user_id = u.id 
              $whereClause 
              ORDER BY pr.created_at DESC";

    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $requests = $stmt->fetchAll();

    // Format response
    foreach ($requests as &$request) {
        $request['createdAt'] = $request['created_at'];
        $request['updatedAt'] = $request['updated_at'];
        unset($request['created_at'], $request['updated_at']);
    }

    sendResponse([
        'success' => true,
        'requests' => $requests
    ]);

} catch (Exception $e) {
    error_log("Get requests error: " . $e->getMessage());
    sendError('Failed to fetch requests', 500);
}
?>