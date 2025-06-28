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

    validateRequired($input, ['user_id', 'prompt_id']);

    $user_id = (int)$input['user_id'];
    $prompt_id = (int)$input['prompt_id'];

    $database = new Database();
    $db = $database->getConnection();

    // Check if already favorited
    $checkQuery = "SELECT id FROM user_favorite_prompts WHERE user_id = :user_id AND prompt_id = :prompt_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':user_id', $user_id);
    $checkStmt->bindParam(':prompt_id', $prompt_id);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        // Remove from favorites
        $deleteQuery = "DELETE FROM user_favorite_prompts WHERE user_id = :user_id AND prompt_id = :prompt_id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':user_id', $user_id);
        $deleteStmt->bindParam(':prompt_id', $prompt_id);
        $deleteStmt->execute();

        $action = 'removed';
    } else {
        // Add to favorites
        $insertQuery = "INSERT INTO user_favorite_prompts (user_id, prompt_id) VALUES (:user_id, :prompt_id)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':user_id', $user_id);
        $insertStmt->bindParam(':prompt_id', $prompt_id);
        $insertStmt->execute();

        $action = 'added';
    }

    sendResponse([
        'success' => true,
        'action' => $action
    ]);

} catch (Exception $e) {
    error_log("Toggle favorite error: " . $e->getMessage());
    sendError('Failed to toggle favorite', 500);
}
?>