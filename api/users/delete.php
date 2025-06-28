<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Method not allowed', 405);
}

try {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        sendError('User ID is required');
    }

    $id = (int)$id;

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

    // Delete user (cascade will handle related records)
    $deleteQuery = "DELETE FROM users WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $id);

    if ($deleteStmt->execute()) {
        sendResponse([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } else {
        sendError('Failed to delete user', 500);
    }

} catch (Exception $e) {
    error_log("Delete user error: " . $e->getMessage());
    sendError('Failed to delete user', 500);
}
?>