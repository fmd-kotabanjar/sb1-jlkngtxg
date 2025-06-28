# RacikanPrompt - Platform Manajemen Prompt AI

Platform terbaik untuk mengelola, menjelajahi, dan mengklaim prompt AI berkualitas tinggi dengan backend MySQL dan PHP API.

## 🚀 Fitur Utama

### 👥 **Multi-Role System**
- **Basic User**: Akses prompt gratis, 3 request/bulan
- **Premium User**: Akses semua prompt eksklusif, 15 request/bulan
- **Admin**: Kelola semua aspek platform

### 📝 **Manajemen Prompt**
- Prompt gratis, eksklusif, dan super
- Sistem kategori dan tag
- Rating dan usage tracking
- Redeem code system

### 🎯 **Fitur User**
- Request prompt custom
- Favorit prompt
- Klaim kode redeem
- Profile management

### 🛠 **Admin Panel**
- Dashboard statistik
- Kelola prompt dan user
- Review request prompt
- Generate redeem codes

## 📋 Persyaratan Sistem

- **PHP**: 7.4 atau lebih tinggi
- **MySQL**: 5.7 atau lebih tinggi
- **Web Server**: Apache/Nginx dengan mod_rewrite
- **Node.js**: 16+ (untuk development)

## 🔧 Instalasi

### 1. **Persiapan Database**

```sql
-- Buat database baru
CREATE DATABASE racikanprompt_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import struktur database
mysql -u username -p racikanprompt_db < api/config/init.sql
```

### 2. **Konfigurasi Backend**

1. **Upload file API** ke folder `api/` di hosting
2. **Edit konfigurasi database** di `api/config/database.php`:

```php
$this->host = 'localhost'; // Host database
$this->db_name = 'racikanprompt_db'; // Nama database
$this->username = 'your_db_user'; // Username database
$this->password = 'your_db_password'; // Password database
```

3. **Set permissions** untuk folder API:
```bash
chmod 755 api/
chmod 644 api/*.php
chmod 644 api/*/*.php
```

### 3. **Build Frontend**

```bash
# Install dependencies
npm install

# Build untuk production
npm run build

# Upload folder 'dist' ke public_html
```

### 4. **Konfigurasi Web Server**

**Apache (.htaccess sudah included)**
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ api/$1 [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**
```nginx
location /api/ {
    try_files $uri $uri/ /api/index.php?$query_string;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

## 🗄️ Struktur Database

### **Users Table**
- Multi-role system (basic, premium, admin)
- Request quota management
- Password hashing dengan bcrypt

### **Prompts Table**
- Tipe prompt (free, exclusive, super)
- Kategori dan tags (JSON)
- Rating dan usage tracking
- Redeem codes

### **Relationships**
- User claimed prompts (many-to-many)
- User favorite prompts (many-to-many)
- Prompt requests dengan status tracking

## 🔐 Keamanan

### **Backend Security**
- Password hashing dengan bcrypt
- SQL injection protection (PDO prepared statements)
- Input sanitization
- CORS headers
- Error logging

### **Frontend Security**
- XSS protection
- Input validation
- Secure localStorage usage
- API error handling

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: xs(475px), sm(640px), md(768px), lg(1024px), xl(1280px)
- **Touch-friendly** interface
- **Dark mode** support

## 🚀 Deployment ke RumahWeb

### **Langkah Deploy:**

1. **Buat database** di cPanel
2. **Import SQL** dari `api/config/init.sql`
3. **Upload API files** ke folder `api/`
4. **Build React app**: `npm run build`
5. **Upload dist folder** ke `public_html/`
6. **Update database config** di `api/config/database.php`

### **File Structure di Hosting:**
```
public_html/
├── index.html (dari dist/)
├── assets/ (dari dist/)
├── api/
│   ├── config/
│   ├── auth/
│   ├── prompts/
│   ├── users/
│   ├── requests/
│   └── .htaccess
└── .htaccess
```

## 🔧 Konfigurasi Production

### **Environment Variables**
```php
// api/config/database.php
$this->host = $_ENV['DB_HOST'] ?? 'localhost';
$this->db_name = $_ENV['DB_NAME'] ?? 'racikanprompt_db';
$this->username = $_ENV['DB_USER'] ?? 'your_user';
$this->password = $_ENV['DB_PASS'] ?? 'your_password';
```

### **API Endpoints**
```
POST /api/auth/login
POST /api/auth/register
GET  /api/prompts
POST /api/prompts/create
PUT  /api/prompts/update
DELETE /api/prompts/delete
GET  /api/users
PUT  /api/users/update
DELETE /api/users/delete
GET  /api/requests
POST /api/requests/create
PUT  /api/requests/update
POST /api/redeem/claim
POST /api/favorites/toggle
GET  /api/stats/dashboard
```

## 👤 Default Admin Account

```
Email: admin@racikanprompt.com
Password: admin123
```

**⚠️ PENTING**: Ganti password admin setelah login pertama!

## 🐛 Troubleshooting

### **Database Connection Error**
- Periksa kredensial database
- Pastikan database sudah dibuat
- Cek permission user database

### **API 404 Error**
- Pastikan .htaccess aktif
- Cek mod_rewrite Apache
- Verifikasi struktur folder API

### **CORS Error**
- Periksa header CORS di API
- Update domain di konfigurasi

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- **Email**: support@racikanprompt.com
- **Documentation**: Lihat komentar di kode
- **Issues**: Buat issue di repository

## 📄 License

Copyright © 2024 RacikanPrompt. All rights reserved.

---

**🎯 Ready untuk production dengan MySQL + PHP backend!**