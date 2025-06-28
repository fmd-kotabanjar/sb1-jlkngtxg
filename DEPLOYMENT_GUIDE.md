# 🚀 Panduan Lengkap Deploy RacikanPrompt ke Hosting

## 📋 Persiapan Sebelum Deploy

### 1. Yang Anda Butuhkan:
- ✅ Akses cPanel hosting RumahWeb
- ✅ Domain yang sudah pointing ke hosting
- ✅ File aplikasi yang sudah di-build

### 2. Struktur File yang Akan Di-upload:
```
public_html/
├── index.html (dari folder dist/)
├── assets/ (dari folder dist/)
├── api/
│   ├── config/
│   ├── auth/
│   ├── prompts/
│   └── .htaccess
└── .htaccess
```

---

## 🗄️ LANGKAH 1: Setup Database MySQL

### A. Buat Database di cPanel
1. **Login ke cPanel** RumahWeb
2. **Cari "MySQL Databases"** atau "Database MySQL"
3. **Buat Database Baru:**
   - Nama database: `racikanprompt` (akan jadi `namauser_racikanprompt`)
   - Klik "Create Database"

### B. Buat User Database
1. **Di bagian "MySQL Users":**
   - Username: `dbuser` (akan jadi `namauser_dbuser`)
   - Password: `buatPasswordKuat123!`
   - Klik "Create User"

### C. Hubungkan User ke Database
1. **Di bagian "Add User to Database":**
   - Pilih user yang baru dibuat
   - Pilih database yang baru dibuat
   - Centang "ALL PRIVILEGES"
   - Klik "Make Changes"

### D. Import Database
1. **Buka phpMyAdmin** dari cPanel
2. **Pilih database** yang baru dibuat
3. **Klik tab "SQL"**
4. **Copy-paste SQL berikut** dan klik "Go":

```sql
-- Copy semua SQL dari file yang saya berikan di atas
-- (SQL yang ada di supabase/migrations/20250628143239_falling_reef.sql)
```

---

## 📁 LANGKAH 2: Upload File Backend (API)

### A. Siapkan File API
1. **Buat folder `api`** di komputer Anda
2. **Copy semua file dari folder `api/`** project ini
3. **Edit file `api/config/database.php`:**

```php
<?php
// Ganti bagian constructor dengan kredensial Anda:
public function __construct() {
    $this->host = 'localhost';
    $this->db_name = 'namauser_racikanprompt';  // Ganti namauser
    $this->username = 'namauser_dbuser';        // Ganti namauser  
    $this->password = 'buatPasswordKuat123!';   // Password Anda
}
```

### B. Upload ke Hosting
1. **Buka File Manager** di cPanel
2. **Masuk ke folder `public_html`**
3. **Upload folder `api`** (bisa zip dulu, lalu extract)
4. **Pastikan struktur seperti ini:**
   ```
   public_html/
   └── api/
       ├── config/
       ├── auth/
       ├── prompts/
       ├── users/
       ├── requests/
       ├── redeem/
       ├── favorites/
       ├── stats/
       └── .htaccess
   ```

---

## 🌐 LANGKAH 3: Build & Upload Frontend

### A. Build Aplikasi React
1. **Buka terminal** di folder project
2. **Jalankan perintah:**
   ```bash
   npm run build
   ```
3. **Tunggu sampai selesai** (akan ada folder `dist`)

### B. Upload Frontend
1. **Buka folder `dist`** yang baru dibuat
2. **Select semua file** di dalam folder `dist`:
   - `index.html`
   - folder `assets/`
3. **Upload ke `public_html`** (bukan ke dalam folder)
4. **Upload juga file `.htaccess`** dari root project

### C. Struktur Final di Hosting:
```
public_html/
├── index.html          ← dari dist/
├── assets/            ← dari dist/
│   ├── index-xxx.css
│   └── index-xxx.js
├── api/               ← folder API
│   └── ...
└── .htaccess          ← dari root project
```

---

## ⚙️ LANGKAH 4: Konfigurasi File

### A. Edit .htaccess Utama
**File: `public_html/.htaccess`**
```apache
RewriteEngine On

# Handle React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

### B. Pastikan .htaccess API
**File: `public_html/api/.htaccess`** (sudah ada, pastikan tidak berubah)

---

## 🧪 LANGKAH 5: Testing

### A. Test Database Connection
1. **Buka browser:** `https://domain-anda.com/api/prompts`
2. **Harus muncul JSON** dengan data prompts
3. **Jika error:** cek kredensial database

### B. Test Frontend
1. **Buka:** `https://domain-anda.com`
2. **Harus muncul halaman login** RacikanPrompt
3. **Test login dengan:**
   - Email: `admin@racikanprompt.com`
   - Password: `demo123`

---

## 🔧 TROUBLESHOOTING

### ❌ Layar Putih/Blank
**Penyebab & Solusi:**
1. **File tidak ter-upload lengkap**
   - Re-upload semua file dari folder `dist`
   
2. **Path salah di .htaccess**
   - Pastikan .htaccess ada di `public_html/`
   
3. **Error JavaScript**
   - Buka Developer Tools (F12) → Console
   - Lihat error yang muncul

### ❌ API Error 404
**Penyebab & Solusi:**
1. **Folder api tidak ada**
   - Upload ulang folder `api/`
   
2. **Database connection error**
   - Cek kredensial di `api/config/database.php`
   
3. **Permissions salah**
   - Set permission folder `api/` ke 755

### ❌ Database Connection Failed
**Penyebab & Solusi:**
1. **Kredensial salah**
   - Cek nama database, username, password
   
2. **Database belum dibuat**
   - Buat database di cPanel
   
3. **User tidak punya akses**
   - Assign user ke database dengan ALL PRIVILEGES

---

## 📞 Bantuan Lebih Lanjut

### Jika Masih Error:
1. **Cek error log** di cPanel → Error Logs
2. **Screenshot error** yang muncul
3. **Beri tahu saya:**
   - URL website Anda
   - Error message yang muncul
   - Langkah mana yang bermasalah

### File Penting untuk Dicek:
- `public_html/index.html` ← Harus ada
- `public_html/assets/` ← Harus ada folder ini
- `public_html/api/config/database.php` ← Kredensial benar
- `public_html/.htaccess` ← Routing React

---

## ✅ Checklist Deploy

- [ ] Database MySQL dibuat
- [ ] User database dibuat dan di-assign
- [ ] SQL di-import via phpMyAdmin
- [ ] Folder `api/` di-upload ke `public_html/api/`
- [ ] File `database.php` diedit dengan kredensial benar
- [ ] `npm run build` dijalankan
- [ ] File dari `dist/` di-upload ke `public_html/`
- [ ] File `.htaccess` di-upload ke `public_html/`
- [ ] Test buka website
- [ ] Test login dengan akun demo

**Setelah semua checklist ✅, website Anda siap digunakan!**