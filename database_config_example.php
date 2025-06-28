<?php
// Contoh konfigurasi database untuk RumahWeb
// Edit file api/config/database.php dengan informasi ini

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Ganti dengan kredensial database RumahWeb Anda
        $this->host = 'localhost';                    // Biasanya localhost
        $this->db_name = 'namauser_racikanprompt';   // Format: namauser_namadatabase
        $this->username = 'namauser_dbuser';         // Username database
        $this->password = 'password_database_anda';   // Password database
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed");
        }

        return $this->conn;
    }

    public function closeConnection() {
        $this->conn = null;
    }
}
?>