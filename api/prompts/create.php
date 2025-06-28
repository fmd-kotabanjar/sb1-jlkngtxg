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

    validateRequired($input, ['title', 'description', 'content', 'type', 'category', 'created_by']);

    $title = sanitizeInput($input['title']);
    $description = sanitizeInput($input['description']);
    $content = $input['content']; // Don't sanitize content as it may contain formatting
    $type = sanitizeInput($input['type']);
    $category = sanitizeInput($input['category']);
    $tags = isset($input['tags']) ? json_encode($input['tags']) : '[]';
    $created_by = (int)$input['created_by'];
    $is_active = isset($input['isActive']) ? (bool)$input['isActive'] : true;
    $lynk_url = isset($input['lynkUrl']) ? sanitizeInput($input['lynkUrl']) : null;

    // Validate type
    if (!in_array($type, ['free', 'exclusive', 'super'])) {
        sendError('Invalid prompt type');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Generate redeem code for exclusive/super prompts
    $redeem_code = null;
    $confirmation_url = null;
    
    if (in_array($type, ['exclusive', 'super'])) {
        $prefix = $type === 'exclusive' ? 'EXC' : 'SUP';
        $redeem_code = $prefix . strtoupper(substr(md5(uniqid()), 0, 6));
        $confirmation_url = "https://racikanprompt.bincangkecil.com/xonfpro?id=" . time();
    }

    // Insert prompt
    $insertQuery = "INSERT INTO prompts (title, description, content, type, category, tags, created_by, is_active, redeem_code, lynk_url, confirmation_url) 
                    VALUES (:title, :description, :content, :type, :category, :tags, :created_by, :is_active, :redeem_code, :lynk_url, :confirmation_url)";
    
    $stmt = $db->prepare($insertQuery);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':tags', $tags);
    $stmt->bindParam(':created_by', $created_by);
    $stmt->bindParam(':is_active', $is_active, PDO::PARAM_BOOL);
    $stmt->bindParam(':redeem_code', $redeem_code);
    $stmt->bindParam(':lynk_url', $lynk_url);
    $stmt->bindParam(':confirmation_url', $confirmation_url);

    if ($stmt->execute()) {
        $promptId = $db->lastInsertId();

        // If redeem code was generated, insert it into redeem_codes table
        if ($redeem_code) {
            $redeemQuery = "INSERT INTO redeem_codes (code, type, target_id) VALUES (:code, 'prompt', :target_id)";
            $redeemStmt = $db->prepare($redeemQuery);
            $redeemStmt->bindParam(':code', $redeem_code);
            $redeemStmt->bindParam(':target_id', $promptId);
            $redeemStmt->execute();
        }

        // Get the created prompt
        $getQuery = "SELECT * FROM prompts WHERE id = :id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':id', $promptId);
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
        ], 201);
    } else {
        sendError('Failed to create prompt', 500);
    }

} catch (Exception $e) {
    error_log("Create prompt error: " . $e->getMessage());
    sendError('Failed to create prompt', 500);
}
?>