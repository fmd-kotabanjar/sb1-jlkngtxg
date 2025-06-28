<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Method not allowed', 405);
}

try {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        sendError('Prompt ID is required');
    }

    $id = (int)$id;

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

    // Delete prompt (cascade will handle related records)
    $deleteQuery = "DELETE FROM prompts WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $id);

    if ($deleteStmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'Prompt deleted successfully'
        ]);
    } else {
        sendError('Failed to delete prompt', 500);
    }

} catch (Exception $e) {
    error_log("Delete prompt error: " . $e->getMessage());
    sendError('Failed to delete prompt', 500);
}
?>