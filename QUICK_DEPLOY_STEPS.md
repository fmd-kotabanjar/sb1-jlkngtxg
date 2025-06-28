# 🚀 Langkah Cepat Deploy (5 Menit)

## 1. 🗄️ Setup Database (2 menit)
```
cPanel → MySQL Databases → Buat database "racikanprompt"
cPanel → MySQL Users → Buat user "dbuser" 
cPanel → Add User to Database → Assign dengan ALL PRIVILEGES
phpMyAdmin → Import SQL dari file yang saya berikan
```

## 2. 📁 Upload Backend (1 menit)
```
Copy folder api/ ke public_html/api/
Edit api/config/database.php dengan kredensial database Anda
```

## 3. 🌐 Upload Frontend (1 menit)
```
Terminal: npm run build
Upload semua file dari folder dist/ ke public_html/
Upload file .htaccess ke public_html/
```

## 4. ✅ Test (1 menit)
```
Buka: https://domain-anda.com
Login: admin@racikanprompt.com / demo123
```

## 🆘 Jika Error:
- **Layar putih**: Cek apakah file dari dist/ ter-upload semua
- **API error**: Cek kredensial database di api/config/database.php
- **404 error**: Pastikan .htaccess ada di public_html/

**Total waktu: 5 menit jika semua berjalan lancar!**