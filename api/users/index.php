<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get query parameters
    $role = $_GET['role'] ?? 'all';
    $search = $_GET['search'] ?? '';

    // Build query
    $whereConditions = [];
    $params = [];

    if ($role !== 'all') {
        $whereConditions[] = "role = :role";
        $params[':role'] = $role;
    }

    if (!empty($search)) {
        $whereConditions[] = "(name LIKE :search OR email LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

    $query = "SELECT id, email, name, role, request_quota, used_quota, created_at 
              FROM users 
              $whereClause 
              ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $users = $stmt->fetchAll();

    // Get claimed and favorite prompts for each user
    foreach ($users as &$user) {
        $userId = $user['id'];

        // Get claimed prompts
        $claimedQuery = "SELECT prompt_id FROM user_claimed_prompts WHERE user_id = :user_id";
        $claimedStmt = $db->prepare($claimedQuery);
        $claimedStmt->bindParam(':user_id', $userId);
        $claimedStmt->execute();
        $user['claimedPrompts'] = $claimedStmt->fetchAll(PDO::FETCH_COLUMN);

        // Get favorite prompts
        $favoriteQuery = "SELECT prompt_id FROM user_favorite_prompts WHERE user_id = :user_id";
        $favoriteStmt = $db->prepare($favoriteQuery);
        $favoriteStmt->bindParam(':user_id', $userId);
        $favoriteStmt->execute();
        $user['favoritePrompts'] = $favoriteStmt->fetchAll(PDO::FETCH_COLUMN);

        // Format dates
        $user['createdAt'] = $user['created_at'];
        unset($user['created_at']);
    }

    sendResponse([
        'success' => true,
        'users' => $users
    ]);

} catch (Exception $e) {
    error_log("Get users error: " . $e->getMessage());
    sendError('Failed to fetch users', 500);
}
?>