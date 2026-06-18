# Product Requirements Document (PRD) v2.0
**Project Name:** AssetFlow (Web-Based Inventory & Loan Tracking System)
**Document Version:** 2.0
**Target Platform:** Web Application (Responsive Desktop & Mobile)

## 1. Product Overview
AssetFlow adalah aplikasi manajemen inventaris, pelacakan peminjaman, dan pencatatan pengambilan barang. Dirancang untuk operasional IT Support dan manajemen aset dengan dua mode akses: Admin (full control) dan Non-Admin (input langsung tanpa login, cukup PIN).

## 2. Tech Stack
* **Frontend:** Next.js 16 (App Router) + React 19
* **Styling:** Tailwind CSS v4 + Shadcn UI (Vercel theme, Geist font)
* **Database:** Supabase PostgreSQL + Drizzle ORM
* **Auth (Admin):** Supabase Auth (Email & Password)
* **Auth (Non-Admin):** PIN Global (server-validated)
* **Export:** xlsx (SheetJS) client-side
* **Deployment:** Vercel

## 3. Access Model

### Landing Page
Tampilan pertama menampilkan dua opsi:
- **Admin** → redirect ke halaman login (Supabase Auth)
- **Non-Admin** → prompt PIN global → jika benar, masuk ke halaman input

### PIN Global
- Satu PIN sama untuk semua non-admin
- Disimpan di environment variable (`NON_ADMIN_PIN`)
- Divalidasi server-side via Server Action
- Tidak ada session/cookie — PIN divalidasi per-visit

### Admin Auth
- Login via email + password (Supabase Auth)
- Hanya akun dengan role `admin` di user_metadata yang bisa login
- Session-based (cookie, refresh via middleware)

## 4. Database Schema

### Table: `items` (Inventory Barang)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default random | ID unik |
| name | Text | NOT NULL | Nama barang |
| category | Text | NOT NULL | `elektrik`, `mekanik`, `facility` |
| quantity | Integer | NOT NULL, default 0 | Jumlah stok saat ini |
| supplier | Text | NOT NULL | Nama supplier |
| received_at | Timestamptz | NOT NULL, default now() | Tanggal barang masuk |
| created_at | Timestamptz | NOT NULL, default now() | Waktu record dibuat |

### Table: `loans` (Peminjaman Barang)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default random | ID unik |
| item_id | UUID | FK → items.id | Barang yang dipinjam |
| borrower_name | Text | NOT NULL | Nama peminjam |
| borrower_contact | Text | NOT NULL | Kontak peminjam |
| loan_date | Timestamptz | NOT NULL, default now() | Tanggal pinjam |
| return_date | Timestamptz | Nullable | Tanggal kembali |
| status | Text | NOT NULL, default `active` | `active`, `returned` |

### Table: `pickups` (Pengambilan Barang — Consumable)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default random | ID unik |
| item_id | UUID | FK → items.id | Barang yang diambil |
| person_name | Text | NOT NULL | Nama pengambil |
| department | Text | NOT NULL | Departemen |
| quantity | Integer | NOT NULL | Jumlah diambil |
| purpose | Text | NOT NULL | Jenis keperluan |
| picked_at | Timestamptz | NOT NULL, default now() | Tanggal & waktu pengambilan |

## 5. Features

### 5.1 Landing Page
- Dua tombol besar: "Admin" dan "Non-Admin"
- Apple-style minimalis, centered

### 5.2 Non-Admin Flow (setelah PIN)
Menampilkan 4 menu card:
1. **Peminjaman Barang** — Sheet slide-over: pilih barang (yang stok > 0), isi nama, kontak
2. **Pengambilan Barang Elektrik** — Sheet: isi nama, departemen, pilih barang elektrik, jumlah, keperluan
3. **Pengambilan Barang Mekanik** — Sheet: sama, filter mekanik
4. **Pengambilan Barang Facility** — Sheet: sama, filter facility

Stok 0 = barang masih muncul tapi disabled (tidak bisa dipilih).
Reminder toast "Jangan lupa klik Simpan!" saat form dibuka.

### 5.3 Admin Dashboard
Metric cards:
1. Total barang (Elektrik + Mekanik + Facility)
2. Barang habis (quantity = 0)
3. Total peminjaman aktif
4. Total pengambilan (semua kategori)

### 5.4 Admin: Inventory
- DataTable semua barang
- Input barang masuk: nama, kategori (elektrik/mekanik/facility), jumlah, supplier, tanggal, waktu
- Edit & Delete

### 5.5 Admin: Data Peminjaman
- DataTable semua peminjaman
- Action: Mark as Returned
- Export to Excel

### 5.6 Admin: Data Pengambilan
- 1 halaman dengan 3 tab: Elektrik | Mekanik | Facility
- DataTable per tab
- Export to Excel

## 6. Sidebar Navigation (Admin)
- Dashboard
- Inventory
- Data Peminjaman
- Data Pengambilan

## 7. Security
- Admin: Supabase Auth + requireAdmin() server-side
- Non-Admin: PIN validated server-side, no session stored
- Zod .strict() on all inputs
- Structured logging + audit trail
- Security headers (HSTS, X-Frame-Options, etc.)
- Rate limiting on auth endpoints
- PII purge after 30 days (borrower_contact)
