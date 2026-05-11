# 📖 Panduan Pengguna AssetFlow

**URL Aplikasi:** [assetflow-azure.vercel.app](https://assetflow-azure.vercel.app)

AssetFlow adalah aplikasi manajemen inventaris, peminjaman, dan pengambilan barang untuk operasional IT Support.

---

## Daftar Isi

1. [Halaman Utama](#1-halaman-utama)
2. [Mode Non-Admin (Tanpa Login)](#2-mode-non-admin)
3. [Mode Admin (Dengan Login)](#3-mode-admin)

---

## 1. Halaman Utama

Saat membuka aplikasi, kamu akan melihat dua pilihan:

- **Admin** — Untuk petugas yang mengelola data (perlu login)
- **Non-Admin** — Untuk karyawan yang ingin meminjam atau mengambil barang (cukup PIN)

---

## 2. Mode Non-Admin

### 2.1 Masukkan PIN

1. Klik tombol **"Non-Admin"** di halaman utama
2. Masukkan PIN yang diberikan oleh admin
3. Klik **"Masuk"**

### 2.2 Pilih Menu

Setelah PIN berhasil, kamu akan melihat 4 menu:

| Menu | Fungsi |
|------|--------|
| **Peminjaman Barang** | Pinjam barang yang nanti akan dikembalikan |
| **Pengambilan Barang Elektrik** | Ambil barang elektrik (tidak dikembalikan) |
| **Pengambilan Barang Mekanik** | Ambil barang mekanik (tidak dikembalikan) |
| **Pengambilan Barang Facility** | Ambil barang facility (tidak dikembalikan) |

### 2.3 Peminjaman Barang

1. Klik **"Peminjaman Barang"**
2. Pilih barang yang ingin dipinjam (barang bertanda "Habis" tidak bisa dipilih)
3. Isi **Nama Peminjam** dan **Kontak** (email atau WhatsApp)
4. ⚠️ **Klik "Simpan"** sebelum menutup form
5. Selesai — admin akan memproses pengembalian nanti

### 2.4 Pengambilan Barang

1. Klik salah satu menu pengambilan (Elektrik / Mekanik / Facility)
2. Isi data berikut:
   - **Nama** — Nama lengkap kamu
   - **Departemen** — Departemen tempat kamu bekerja
   - **Barang** — Pilih barang yang ingin diambil
   - **Jumlah** — Berapa banyak yang diambil
   - **Jenis Keperluan** — Untuk apa barang ini digunakan
3. ⚠️ **Klik "Simpan"** sebelum menutup form
4. Stok barang akan otomatis berkurang

> 💡 **Tips:** Barang yang stoknya 0 akan muncul dengan label "(Habis)" dan tidak bisa dipilih.

---

## 3. Mode Admin

### 3.1 Login

1. Klik tombol **"Admin"** di halaman utama
2. Masukkan **Email** dan **Password** akun admin
3. Klik **"Sign in"**

### 3.2 Dashboard

Setelah login, halaman pertama yang muncul adalah **Dashboard** dengan informasi:

- Total barang Elektrik, Mekanik, dan Facility
- Jumlah barang yang stoknya habis (perlu restock)
- Total peminjaman aktif (belum dikembalikan)
- Total pengambilan barang (semua kategori)

### 3.3 Inventory (Kelola Barang)

Halaman ini menampilkan semua barang yang ada di gudang.

**Menambah barang baru:**
1. Klik tombol **"Barang Masuk"** di pojok kanan atas
2. Isi: Nama Barang, Kategori, Jumlah, dan Supplier
3. Klik **"Simpan"**

**Menghapus barang:**
1. Klik ikon titik tiga (⋮) di baris barang
2. Pilih **"Hapus"**
3. Konfirmasi penghapusan

### 3.4 Data Peminjaman

Halaman ini menampilkan semua peminjaman barang.

**Mengembalikan barang:**
1. Cari peminjaman dengan status **"Active"**
2. Klik tombol **"Return"** di baris tersebut
3. Status berubah menjadi "Returned" dan stok barang bertambah kembali

### 3.5 Data Pengambilan

Halaman ini menampilkan riwayat pengambilan barang dengan 3 tab:

- **Elektrik** — Semua pengambilan barang elektrik
- **Mekanik** — Semua pengambilan barang mekanik
- **Facility** — Semua pengambilan barang facility

Setiap tab menampilkan: nama barang, siapa yang mengambil, departemen, jumlah, keperluan, dan tanggal.

### 3.6 Logout

1. Klik area profil di bagian bawah sidebar (kiri)
2. Klik **"Logout"**

---

## Navigasi Cepat (Keyboard)

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + K` atau `Cmd + K` | Buka Command Menu |
| `D D` | Ke Dashboard |
| `I I` | Ke Inventory |
| `L L` | Ke Data Peminjaman |
| `P P` | Ke Data Pengambilan |

---

## FAQ

**Q: PIN Non-Admin berapa?**
A: Tanyakan ke admin IT. PIN ini sama untuk semua karyawan.

**Q: Barang yang saya mau ambil bertulisan "Habis", bagaimana?**
A: Hubungi admin untuk restock barang tersebut.

**Q: Saya salah input pengambilan, bisa dibatalkan?**
A: Hubungi admin untuk koreksi data.

**Q: Bagaimana cara mengembalikan barang yang dipinjam?**
A: Kembalikan barang fisik ke admin, lalu admin akan klik "Return" di sistem.

---

## Kontak Support

Jika mengalami kendala, hubungi tim IT Support.
