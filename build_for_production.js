const fs = require('fs');
const path = require('path');

console.log('🚀 Building RacikanPrompt for Production...\n');

// 1. Update API configuration for production
console.log('📝 Updating API configuration...');
const apiConfigPath = path.join(__dirname, 'src', 'config', 'api.ts');
let apiConfig = fs.readFileSync(apiConfigPath, 'utf8');

// Update API base URL for production
apiConfig = apiConfig.replace(
  /const API_BASE_URL = process\.env\.NODE_ENV === 'production'[\s\S]*?;/,
  `const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Production: relative path
  : '/api'; // Development: also use relative path for consistency`
);

fs.writeFileSync(apiConfigPath, apiConfig);
console.log('✅ API configuration updated');

// 2. Create production database config
console.log('📝 Creating production database config...');
const prodDbConfig = `<?php
// Production database configuration for RumahWeb
// Copy this content to api/config/database.php and update credentials

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // GANTI DENGAN KREDENSIAL DATABASE RUMAHWEB ANDA
        $this->host = 'localhost';                      // Biasanya localhost
        $this->db_name = 'namauser_racikanprompt';     // Format: namauser_namadatabase
        $this->username = 'namauser_dbuser';           // Username database Anda
        $this->password = 'password_database_anda';     // Password database Anda
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
            throw new Exception("Database connection failed: " . $exception->getMessage());
        }

        return $this->conn;
    }

    public function closeConnection() {
        $this->conn = null;
    }
}

// Response helper functions
function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function sendError($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit();
}

function validateRequired($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            sendError("Field '$field' is required", 400);
        }
    }
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}
?>`;

fs.writeFileSync(path.join(__dirname, 'api', 'config', 'database_production.php'), prodDbConfig);
console.log('✅ Production database config created');

// 3. Create deployment guide
console.log('📝 Creating deployment guide...');
const deploymentGuide = `# 🚀 Panduan Deploy RacikanPrompt ke RumahWeb

## 📋 Checklist Deployment

### 1. 🗄️ Setup Database MySQL (5 menit)
- [ ] Login ke cPanel RumahWeb
- [ ] Buat database baru: \`racikanprompt\`
- [ ] Buat user database: \`dbuser\`
- [ ] Assign user ke database dengan ALL PRIVILEGES
- [ ] Buka phpMyAdmin
- [ ] Import SQL dari file: \`supabase/migrations/20250628143239_falling_reef.sql\`

### 2. 📁 Upload Backend API (3 menit)
- [ ] Upload folder \`api/\` ke \`public_html/api/\`
- [ ] Copy \`api/config/database_production.php\` ke \`api/config/database.php\`
- [ ] Edit kredensial database di \`api/config/database.php\`
- [ ] Test API: buka \`https://domain-anda.com/api/prompts\`

### 3. 🌐 Build & Upload Frontend (2 menit)
- [ ] Jalankan: \`npm run build\`
- [ ] Upload semua file dari folder \`dist/\` ke \`public_html/\`
- [ ] Upload file \`.htaccess\` ke \`public_html/\`
- [ ] Test website: buka \`https://domain-anda.com\`

### 4. ✅ Testing (2 menit)
- [ ] Buka website di browser
- [ ] Test login dengan: admin@racikanprompt.com / demo123
- [ ] Test fitur utama: jelajahi, klaim kode, request prompt

## 🔧 Konfigurasi Database

Edit file \`api/config/database.php\`:

\`\`\`php
$this->host = 'localhost';
$this->db_name = 'namauser_racikanprompt';  // Ganti namauser
$this->username = 'namauser_dbuser';        // Ganti namauser  
$this->password = 'password_anda';          // Password database
\`\`\`

## 🆘 Troubleshooting

### Layar Putih/Blank
- Cek apakah semua file dari \`dist/\` ter-upload
- Pastikan \`.htaccess\` ada di \`public_html/\`

### API Error 404
- Pastikan folder \`api/\` ada di \`public_html/api/\`
- Cek kredensial database

### Database Connection Failed
- Cek nama database, username, password
- Pastikan user di-assign ke database

## 📞 Support
Jika ada masalah, hubungi admin dengan screenshot error yang muncul.

**Total waktu deployment: ~10 menit**
`;

fs.writeFileSync(path.join(__dirname, 'DEPLOYMENT_GUIDE.md'), deploymentGuide);
console.log('✅ Deployment guide created');

console.log('\n🎉 Production build preparation completed!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run build');
console.log('2. Follow DEPLOYMENT_GUIDE.md');
console.log('3. Upload files to RumahWeb hosting');
console.log('\n✨ Your app will be ready for production!');