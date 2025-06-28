<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get total counts
    $totalUsersQuery = "SELECT COUNT(*) as count FROM users";
    $totalUsersStmt = $db->prepare($totalUsersQuery);
    $totalUsersStmt->execute();
    $totalUsers = $totalUsersStmt->fetch()['count'];

    $totalPromptsQuery = "SELECT COUNT(*) as count FROM prompts WHERE is_active = TRUE";
    $totalPromptsStmt = $db->prepare($totalPromptsQuery);
    $totalPromptsStmt->execute();
    $totalPrompts = $totalPromptsStmt->fetch()['count'];

    $totalRequestsQuery = "SELECT COUNT(*) as count FROM prompt_requests";
    $totalRequestsStmt = $db->prepare($totalRequestsQuery);
    $totalRequestsStmt->execute();
    $totalRequests = $totalRequestsStmt->fetch()['count'];

    $pendingRequestsQuery = "SELECT COUNT(*) as count FROM prompt_requests WHERE status = 'pending'";
    $pendingRequestsStmt = $db->prepare($pendingRequestsQuery);
    $pendingRequestsStmt->execute();
    $pendingRequests = $pendingRequestsStmt->fetch()['count'];

    // Get prompt type counts
    $promptTypesQuery = "SELECT type, COUNT(*) as count FROM prompts WHERE is_active = TRUE GROUP BY type";
    $promptTypesStmt = $db->prepare($promptTypesQuery);
    $promptTypesStmt->execute();
    $promptTypes = $promptTypesStmt->fetchAll();

    $promptTypeStats = [
        'free' => 0,
        'exclusive' => 0,
        'super' => 0
    ];

    foreach ($promptTypes as $type) {
        $promptTypeStats[$type['type']] = (int)$type['count'];
    }

    // Get user role counts
    $userRolesQuery = "SELECT role, COUNT(*) as count FROM users GROUP BY role";
    $userRolesStmt = $db->prepare($userRolesQuery);
    $userRolesStmt->execute();
    $userRoles = $userRolesStmt->fetchAll();

    $userRoleStats = [
        'basic' => 0,
        'premium' => 0,
        'admin' => 0
    ];

    foreach ($userRoles as $role) {
        $userRoleStats[$role['role']] = (int)$role['count'];
    }

    sendResponse([
        'success' => true,
        'stats' => [
            'totalUsers' => (int)$totalUsers,
            'totalPrompts' => (int)$totalPrompts,
            'totalRequests' => (int)$totalRequests,
            'pendingRequests' => (int)$pendingRequests,
            'promptTypes' => $promptTypeStats,
            'userRoles' => $userRoleStats
        ]
    ]);

} catch (Exception $e) {
    error_log("Get stats error: " . $e->getMessage());
    sendError('Failed to fetch stats', 500);
}
?>