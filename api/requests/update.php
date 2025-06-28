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

    validateRequired($input, ['id', 'status']);

    $id = (int)$input['id'];
    $status = sanitizeInput($input['status']);
    $admin_notes = isset($input['adminNotes']) ? sanitizeInput($input['adminNotes']) : null;

    // Validate status
    if (!in_array($status, ['pending', 'approved', 'rejected'])) {
        sendError('Invalid status');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Check if request exists
    $checkQuery = "SELECT id FROM prompt_requests WHERE id = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();

    if (!$checkStmt->fetch()) {
        sendError('Request not found', 404);
    }

    // Update request
    $updateQuery = "UPDATE prompt_requests SET 
                    status = :status, 
                    admin_notes = :admin_notes,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id";
    
    $stmt = $db->prepare($updateQuery);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':admin_notes', $admin_notes);

    if ($stmt->execute()) {
        // Get updated request
        $getQuery = "SELECT pr.*, u.name as userName 
                     FROM prompt_requests pr 
                     LEFT JOIN users u ON pr.user_id = u.id 
                     WHERE pr.id = :id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':id', $id);
        $getStmt->execute();
        $request = $getStmt->fetch();

        // Format response
        $request['createdAt'] = $request['created_at'];
        $request['updatedAt'] = $request['updated_at'];
        unset($request['created_at'], $request['updated_at']);

        sendResponse([
            'success' => true,
            'request' => $request
        ]);
    } else {
        sendError('Failed to update request', 500);
    }

} catch (Exception $e) {
    error_log("Update request error: " . $e->getMessage());
    sendError('Failed to update request', 500);
}
?>