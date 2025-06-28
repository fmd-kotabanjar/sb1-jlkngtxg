<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }

    validateRequired($input, ['user_id', 'title', 'description', 'category']);

    $user_id = (int)$input['user_id'];
    $title = sanitizeInput($input['title']);
    $description = sanitizeInput($input['description']);
    $category = sanitizeInput($input['category']);
    $priority = isset($input['priority']) ? sanitizeInput($input['priority']) : 'medium';

    // Validate priority
    if (!in_array($priority, ['low', 'medium', 'high'])) {
        sendError('Invalid priority');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Check user quota
    $userQuery = "SELECT request_quota, used_quota FROM users WHERE id = :user_id";
    $userStmt = $db->prepare($userQuery);
    $userStmt->bindParam(':user_id', $user_id);
    $userStmt->execute();
    $user = $userStmt->fetch();

    if (!$user) {
        sendError('User not found', 404);
    }

    if ($user['used_quota'] >= $user['request_quota']) {
        sendError('Request quota exceeded', 403);
    }

    // Insert request
    $insertQuery = "INSERT INTO prompt_requests (user_id, title, description, category, priority) 
                    VALUES (:user_id, :title, :description, :category, :priority)";
    
    $stmt = $db->prepare($insertQuery);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':priority', $priority);

    if ($stmt->execute()) {
        $requestId = $db->lastInsertId();

        // Update user quota
        $updateQuotaQuery = "UPDATE users SET used_quota = used_quota + 1 WHERE id = :user_id";
        $updateQuotaStmt = $db->prepare($updateQuotaQuery);
        $updateQuotaStmt->bindParam(':user_id', $user_id);
        $updateQuotaStmt->execute();

        // Get the created request with user name
        $getQuery = "SELECT pr.*, u.name as userName 
                     FROM prompt_requests pr 
                     LEFT JOIN users u ON pr.user_id = u.id 
                     WHERE pr.id = :id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':id', $requestId);
        $getStmt->execute();
        $request = $getStmt->fetch();

        // Format response
        $request['createdAt'] = $request['created_at'];
        $request['updatedAt'] = $request['updated_at'];
        unset($request['created_at'], $request['updated_at']);

        sendResponse([
            'success' => true,
            'request' => $request
        ], 201);
    } else {
        sendError('Failed to create request', 500);
    }

} catch (Exception $e) {
    error_log("Create request error: " . $e->getMessage());
    sendError('Failed to create request', 500);
}
?>