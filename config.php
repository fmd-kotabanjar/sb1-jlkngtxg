<?php
// Database configuration for hosting
// Update these values according to your hosting provider

// Database settings
define('DB_HOST', 'localhost'); // Usually 'localhost' for shared hosting
define('DB_NAME', 'your_database_name'); // Your database name from hosting panel
define('DB_USER', 'your_database_user'); // Your database username
define('DB_PASS', 'your_database_password'); // Your database password

// Application settings
define('APP_URL', 'https://yourdomain.com'); // Your domain URL
define('APP_ENV', 'production'); // Set to 'production' for live site

// Security settings
define('JWT_SECRET', 'your-super-secret-jwt-key-here'); // Change this to a random string
define('BCRYPT_ROUNDS', 12); // Password hashing rounds

// Error reporting (disable in production)
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Asia/Jakarta');
?>