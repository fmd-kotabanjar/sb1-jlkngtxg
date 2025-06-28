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

    validateRequired($input, ['code', 'user_id']);

    $code = strtoupper(sanitizeInput($input['code']));
    $user_id = (int)$input['user_id'];

    $database = new Database();
    $db = $database->getConnection();

    // Find the redeem code
    $codeQuery = "SELECT * FROM redeem_codes WHERE code = :code AND is_used = FALSE";
    $codeStmt = $db->prepare($codeQuery);
    $codeStmt->bindParam(':code', $code);
    $codeStmt->execute();
    $redeemCode = $codeStmt->fetch();

    if (!$redeemCode) {
        sendError('Invalid or already used code', 404);
    }

    // Check if code is expired
    if ($redeemCode['expires_at'] && strtotime($redeemCode['expires_at']) < time()) {
        sendError('Code has expired', 410);
    }

    $db->beginTransaction();

    try {
        if ($redeemCode['type'] === 'prompt') {
            // Check if user already has this prompt
            $checkClaimedQuery = "SELECT id FROM user_claimed_prompts WHERE user_id = :user_id AND prompt_id = :prompt_id";
            $checkClaimedStmt = $db->prepare($checkClaimedQuery);
            $checkClaimedStmt->bindParam(':user_id', $user_id);
            $checkClaimedStmt->bindParam(':prompt_id', $redeemCode['target_id']);
            $checkClaimedStmt->execute();

            if ($checkClaimedStmt->fetch()) {
                $db->rollback();
                sendError('You already have this prompt', 409);
            }

            // Add prompt to user's claimed prompts
            $claimQuery = "INSERT INTO user_claimed_prompts (user_id, prompt_id) VALUES (:user_id, :prompt_id)";
            $claimStmt = $db->prepare($claimQuery);
            $claimStmt->bindParam(':user_id', $user_id);
            $claimStmt->bindParam(':prompt_id', $redeemCode['target_id']);
            $claimStmt->execute();

            // Get prompt details
            $promptQuery = "SELECT title FROM prompts WHERE id = :id";
            $promptStmt = $db->prepare($promptQuery);
            $promptStmt->bindParam(':id', $redeemCode['target_id']);
            $promptStmt->execute();
            $prompt = $promptStmt->fetch();

            $message = "Successfully claimed prompt: " . $prompt['title'];

        } elseif ($redeemCode['type'] === 'upgrade') {
            // Check if user is already premium or admin
            $userQuery = "SELECT role FROM users WHERE id = :user_id";
            $userStmt = $db->prepare($userQuery);
            $userStmt->bindParam(':user_id', $user_id);
            $userStmt->execute();
            $user = $userStmt->fetch();

            if (in_array($user['role'], ['premium', 'admin'])) {
                $db->rollback();
                sendError('Account is already Premium or Admin', 409);
            }

            // Upgrade user role
            $upgradeQuery = "UPDATE users SET role = :role, request_quota = 15 WHERE id = :user_id";
            $upgradeStmt = $db->prepare($upgradeQuery);
            $upgradeStmt->bindParam(':role', $redeemCode['target_role']);
            $upgradeStmt->bindParam(':user_id', $user_id);
            $upgradeStmt->execute();

            $message = "Successfully upgraded to " . strtoupper($redeemCode['target_role']);
        }

        // Mark code as used
        $markUsedQuery = "UPDATE redeem_codes SET is_used = TRUE, used_by = :user_id, used_at = CURRENT_TIMESTAMP WHERE id = :id";
        $markUsedStmt = $db->prepare($markUsedQuery);
        $markUsedStmt->bindParam(':user_id', $user_id);
        $markUsedStmt->bindParam(':id', $redeemCode['id']);
        $markUsedStmt->execute();

        $db->commit();

        sendResponse([
            'success' => true,
            'message' => $message,
            'type' => $redeemCode['type']
        ]);

    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Redeem code error: " . $e->getMessage());
    sendError('Failed to redeem code', 500);
}
?>