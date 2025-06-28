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

    validateRequired($input, ['id', 'title', 'description', 'content', 'type', 'category']);

    $id = (int)$input['id'];
    $title = sanitizeInput($input['title']);
    $description = sanitizeInput($input['description']);
    $content = $input['content'];
    $type = sanitizeInput($input['type']);
    $category = sanitizeInput($input['category']);
    $tags = isset($input['tags']) ? json_encode($input['tags']) : '[]';
    $is_active = isset($input['isActive']) ? (bool)$input['isActive'] : true;
    $lynk_url = isset($input['lynkUrl']) ? sanitizeInput($input['lynkUrl']) : null;

    if (!in_array($type, ['free', 'exclusive', 'super'])) {
        sendError('Invalid prompt type');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Check if prompt exists
    $checkQuery = "SELECT id FROM prompts WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();

    if (!$checkStmt->fetch()) {
        sendError('Prompt not found', 404);
    }

    // Update prompt
    $updateQuery = "UPDATE prompts SET 
                    title = :title, 
                    description = :description, 
                    content = :content, 
                    type = :type, 
                    category = :category, 
                    tags = :tags, 
                    is_active = :is_active, 
                    lynk_url = :lynk_url,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id";
    
    $stmt = $db->prepare($updateQuery);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':tags', $tags);
    $stmt->bindParam(':is_active', $is_active, PDO::PARAM_BOOL);
    $stmt->bindParam(':lynk_url', $lynk_url);

    if ($stmt->execute()) {
        // Get updated prompt
        $getQuery = "SELECT * FROM prompts WHERE id = :id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':id', $id);
        $getStmt->execute();
        $prompt = $getStmt->fetch();

        // Format response
        $prompt['tags'] = json_decode($prompt['tags'], true) ?: [];
        $prompt['isActive'] = (bool)$prompt['is_active'];
        $prompt['createdAt'] = $prompt['created_at'];
        $prompt['updatedAt'] = $prompt['updated_at'];

        sendResponse([
            'success' => true,
            'prompt' => $prompt
        ]);
    } else {
        sendError('Failed to update prompt', 500);
    }

} catch (Exception $e) {
    error_log("Update prompt error: " . $e->getMessage());
    sendError('Failed to update prompt', 500);
}
?>