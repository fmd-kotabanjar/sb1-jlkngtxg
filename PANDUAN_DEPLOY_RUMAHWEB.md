# 🚀 Panduan Deploy RacikanPrompt ke RumahWeb

## 📋 Checklist Deployment (Total: ~15 menit)

### 1. 🗄️ Setup Database MySQL (5 menit)
- [ ] Login ke cPanel RumahWeb
- [ ] Buat database baru: `racikanprompt`
- [ ] Buat user database: `dbuser`
- [ ] Assign user ke database dengan ALL PRIVILEGES
- [ ] Buka phpMyAdmin
- [ ] Import SQL dari file: `database_schema_mysql.sql`

### 2. 📁 Upload Backend API (3 menit)
- [ ] Upload folder `api/` ke `public_html/api/`
- [ ] Copy `api/config/database_rumahweb.php` ke `api/config/database.php`
- [ ] Edit kredensial database di `api/config/database.php`
- [ ] Test API: buka `https://domain-anda.com/api/prompts`

### 3. 🌐 Build & Upload Frontend (5 menit)
- [ ] Jalankan: `npm run build`
- [ ] Upload semua file dari folder `dist/` ke `public_html/`
- [ ] Upload file `.htaccess` ke `public_html/`
- [ ] Test website: buka `https://domain-anda.com`

### 4. ✅ Testing (2 menit)
- [ ] Buka website di browser
- [ ] Test login dengan: admin@racikanprompt.com / demo123
- [ ] Test fitur utama: jelajahi, klaim kode, request prompt
- [ ] Test halaman konfirmasi: `/xonfpro?id=2`

---

## 🔧 Konfigurasi Database

Edit file `api/config/database.php`:

```php
$this->host = 'localhost';
$this->db_name = 'namauser_racikanprompt';  // Ganti namauser
$this->username = 'namauser_dbuser';        // Ganti namauser  
$this->password = 'password_anda';          // Password database
```

**Contoh:**
```php
$this->host = 'localhost';
$this->db_name = 'johndoe_racikanprompt';
$this->username = 'johndoe_dbuser';
$this->password = 'mySecurePassword123!';
```

---

## 📁 Struktur File di RumahWeb

```
public_html/
├── index.html          ← dari dist/
├── assets/            ← dari dist/
│   ├── index-xxx.css
│   └── index-xxx.js
├── api/               ← folder API
│   ├── config/
│   │   └── database.php
│   ├── auth/
│   ├── prompts/
│   ├── users/
│   ├── requests/
│   ├── redeem/
│   ├── favorites/
│   ├── stats/
│   └── .htaccess
└── .htaccess          ← dari root project
```

---

## 🆘 Troubleshooting

### ❌ Layar Putih/Blank
**Solusi:**
- Cek apakah semua file dari `dist/` ter-upload
- Pastikan `.htaccess` ada di `public_html/`
- Buka Developer Tools (F12) → Console untuk lihat error

### ❌ API Error 404
**Solusi:**
- Pastikan folder `api/` ada di `public_html/api/`
- Cek kredensial database di `api/config/database.php`
- Test langsung: `https://domain-anda.com/api/prompts`

### ❌ Database Connection Failed
**Solusi:**
- Cek nama database, username, password
- Pastikan user di-assign ke database dengan ALL PRIVILEGES
- Pastikan database sudah di-import dengan benar

### ❌ Halaman Konfirmasi Error
**Solusi:**
- Pastikan data prompts sudah ter-import ke database
- Test dengan URL: `/xonfpro?id=2` atau `/xonfpro?id=3`

---

## 🎯 Fitur yang Sudah Siap

### ✅ **Frontend Features:**
- Dashboard responsif untuk semua role (basic, premium, admin)
- Sistem login/register dengan demo accounts
- Jelajahi prompt dengan filter dan search
- Klaim kode redeem untuk prompt eksklusif
- Request prompt dengan quota management
- Halaman konfirmasi yang robust
- Manajemen profil user
- Dark mode support

### ✅ **Admin Features:**
- Dashboard admin dengan statistik lengkap
- Kelola prompt (CRUD, export, bulk upload)
- Kelola user (edit role, quota, dll)
- Kelola request prompt (approve/reject)
- **Kelola produk digital (BARU!)**
- Export data ke TSV format

### ✅ **Backend API:**
- PHP MySQL backend yang kompatibel dengan shared hosting
- RESTful API endpoints lengkap
- Authentication system
- Role-based access control
- Input validation dan sanitization
- Error handling yang proper

---

## 🔐 Default Login Accounts

```
Admin:
Email: admin@racikanprompt.com
Password: demo123

Premium User:
Email: premium@example.com  
Password: demo123

Basic User:
Email: basic@example.com
Password: demo123
```

---

## 📞 Support

Jika ada masalah:
1. Cek error log di cPanel → Error Logs
2. Screenshot error yang muncul
3. Pastikan semua file ter-upload dengan benar
4. Test API endpoints secara langsung

**Total waktu deployment: ~15 menit**
**Platform siap production dengan fitur lengkap!** 🚀