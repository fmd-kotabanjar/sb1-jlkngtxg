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

    validateRequired($input, ['email', 'password', 'name']);

    $email = sanitizeInput($input['email']);
    $password = $input['password'];
    $name = sanitizeInput($input['name']);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email format');
    }

    // Validate password length
    if (strlen($password) < 6) {
        sendError('Password must be at least 6 characters');
    }

    $database = new Database();
    $db = $database->getConnection();

    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        sendError('Email already registered', 409);
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $insertQuery = "INSERT INTO users (email, password_hash, name, role, request_quota, used_quota) 
                    VALUES (:email, :password_hash, :name, 'basic', 3, 0)";
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':password_hash', $passwordHash);
    $insertStmt->bindParam(':name', $name);
    
    if ($insertStmt->execute()) {
        $userId = $db->lastInsertId();
        
        // Get the created user
        $userQuery = "SELECT id, email, name, role, request_quota, used_quota, created_at 
                      FROM users WHERE id = :id";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':id', $userId);
        $userStmt->execute();
        $user = $userStmt->fetch();

        // Add empty arrays for new user
        $user['claimedPrompts'] = [];
        $user['favoritePrompts'] = [];

        sendResponse([
            'success' => true,
            'user' => $user
        ], 201);
    } else {
        sendError('Registration failed', 500);
    }

} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    sendError('Registration failed', 500);
}
?>