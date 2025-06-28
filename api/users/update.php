<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }

    validateRequired($input, ['id', 'name', 'email', 'role']);

    $id = (int)$input['id'];
    $name = sanitizeInput($input['name']);
    $email = sanitizeInput($input['email']);
    $role = sanitizeInput($input['role']);
    $request_quota = isset($input['requestQuota']) ? (int)$input['requestQuota'] : 3;
    $used_quota = isset($input['usedQuota']) ? (int)$input['usedQuota'] : 0;

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email format');
    }

    // Validate role
    if (!in_array($role, ['basic', 'premium', 'admin'])) {
        sendError('Invalid role');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Check if user exists
    $checkQuery = "SELECT id FROM users WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();

    if (!$checkStmt->fetch()) {
        sendError('User not found', 404);
    }

    // Check if email is already taken by another user
    $emailCheckQuery = "SELECT id FROM users WHERE email = :email AND id != :id";
    $emailCheckStmt = $db->prepare($emailCheckQuery);
    $emailCheckStmt->bindParam(':email', $email);
    $emailCheckStmt->bindParam(':id', $id);
    $emailCheckStmt->execute();

    if ($emailCheckStmt->fetch()) {
        sendError('Email already taken by another user', 409);
    }

    // Update user
    $updateQuery = "UPDATE users SET 
                    name = :name, 
                    email = :email, 
                    role = :role, 
                    request_quota = :request_quota, 
                    used_quota = :used_quota,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id";
    
    $stmt = $db->prepare($updateQuery);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':request_quota', $request_quota);
    $stmt->bindParam(':used_quota', $used_quota);

    if ($stmt->execute()) {
        // Get updated user
        $getQuery = "SELECT id, email, name, role, request_quota, used_quota, created_at FROM users WHERE id = :id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':id', $id);
        $getStmt->execute();
        $user = $getStmt->fetch();

        // Get claimed and favorite prompts
        $claimedQuery = "SELECT prompt_id FROM user_claimed_prompts WHERE user_id = :user_id";
        $claimedStmt = $db->prepare($claimedQuery);
        $claimedStmt->bindParam(':user_id', $id);
        $claimedStmt->execute();
        $user['claimedPrompts'] = $claimedStmt->fetchAll(PDO::FETCH_COLUMN);

        $favoriteQuery = "SELECT prompt_id FROM user_favorite_prompts WHERE user_id = :user_id";
        $favoriteStmt = $db->prepare($favoriteQuery);
        $favoriteStmt->bindParam(':user_id', $id);
        $favoriteStmt->execute();
        $user['favoritePrompts'] = $favoriteStmt->fetchAll(PDO::FETCH_COLUMN);

        $user['createdAt'] = $user['created_at'];
        unset($user['created_at']);

        sendResponse([
            'success' => true,
            'user' => $user
        ]);
    } else {
        sendError('Failed to update user', 500);
    }

} catch (Exception $e) {
    error_log("Update user error: " . $e->getMessage());
    sendError('Failed to update user', 500);
}
?>