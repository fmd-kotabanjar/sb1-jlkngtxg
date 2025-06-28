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

    validateRequired($input, ['email', 'password']);

    $email = sanitizeInput($input['email']);
    $password = $input['password'];

    $database = new Database();
    $db = $database->getConnection();

    // Get user by email
    $query = "SELECT id, email, password_hash, name, role, request_quota, used_quota, created_at 
              FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendError('Invalid email or password', 401);
    }

    // Get user's claimed prompts
    $claimedQuery = "SELECT prompt_id FROM user_claimed_prompts WHERE user_id = :user_id";
    $claimedStmt = $db->prepare($claimedQuery);
    $claimedStmt->bindParam(':user_id', $user['id']);
    $claimedStmt->execute();
    $claimedPrompts = $claimedStmt->fetchAll(PDO::FETCH_COLUMN);

    // Get user's favorite prompts
    $favoriteQuery = "SELECT prompt_id FROM user_favorite_prompts WHERE user_id = :user_id";
    $favoriteStmt = $db->prepare($favoriteQuery);
    $favoriteStmt->bindParam(':user_id', $user['id']);
    $favoriteStmt->execute();
    $favoritePrompts = $favoriteStmt->fetchAll(PDO::FETCH_COLUMN);

    // Remove password hash from response
    unset($user['password_hash']);
    
    // Add arrays to user data
    $user['claimedPrompts'] = array_map('strval', $claimedPrompts);
    $user['favoritePrompts'] = array_map('strval', $favoritePrompts);

    sendResponse([
        'success' => true,
        'user' => $user
    ]);

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendError('Login failed', 500);
}
?>