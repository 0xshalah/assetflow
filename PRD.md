# Product Requirements Document (PRD) v3.0

**Project Name:** AssetFlow (Web-Based Inventory & Loan Tracking System)  
**Document Version:** 3.0  
**Target Platform:** Web Application (Responsive Desktop & Mobile)  
**Repository:** [github.com/0xshalah/assetflow](https://github.com/0xshalah/assetflow)

---

## 1. Product Overview

AssetFlow adalah aplikasi manajemen inventaris, pelacakan peminjaman, dan pencatatan pengambilan barang. Dirancang untuk operasional IT Support dan manajemen aset dengan dua mode akses: **Admin** (full control via Supabase Auth) dan **Non-Admin** (input langsung tanpa login, cukup PIN global).

### Use Case
- Mencatat barang masuk ke inventory dengan spesifikasi lengkap
- Melacak peminjaman barang (loan) oleh pengguna
- Mencatat pengambilan barang consumable (pickup) per departemen
- Memonitor stok secara real-time dengan peringatan dinamis per barang

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS v4 + shadcn/ui (New York style) |
| **Database** | Supabase PostgreSQL |
| **ORM** | Drizzle ORM |
| **Auth (Admin)** | Supabase Auth (Email & Password) |
| **Auth (Non-Admin)** | PIN Global (server-validated) |
| **Validation** | Zod (`.strict()` on all inputs) |
| **Export** | xlsx (SheetJS) |
| **Charts** | Recharts |
| **Testing** | Jest + React Testing Library |
| **Deployment** | Vercel |
| **Keep-Alive** | Vercel Cron Job (ping DB setiap jam) |

---

## 3. Access Model

### 3.1 Landing Page (`/`)

Tampilan pertama menampilkan dua opsi:
- **Admin** → redirect ke `/auth/sign-in` (Supabase Auth)
- **Non-Admin** → redirect ke `/guest` (prompt PIN)

### 3.2 Admin Auth (Supabase)

- Login via email + password (`signInWithPassword`)
- Role disimpan di `user.user_metadata.role`
- Server-side guard: `requireAdmin()` di setiap Server Action
- Middleware: memproteksi seluruh route `/dashboard/*` jika tidak login
- Rate limiting: maks 20 POST request ke `/auth/*` per IP per menit

### 3.3 Non-Admin PIN

- Satu PIN global untuk semua non-admin
- Disimpan di `NON_ADMIN_PIN` environment variable
- Divalidasi server-side via Server Action (`validatePin`)
- Disimpan di `sessionStorage` browser (`guest_verified`)
- Tidak ada session/cookie — divalidasi per-visit

---

## 4. Database Schema

### 4.1 Table: `items` (Inventory Barang)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | ID unik |
| `name` | TEXT | NOT NULL | Nama barang |
| `specification` | TEXT | NOT NULL, DEFAULT `''` | Spesifikasi barang |
| `category` | TEXT | NOT NULL, ENUM (`lemari-c01`, `lemari-c02`, `lemari-c03`) | Kategori lokasi lemari |
| `quantity` | INTEGER | NOT NULL, DEFAULT `0` | Jumlah stok saat ini |
| `unit` | TEXT | NOT NULL, DEFAULT `''` | Unit satuan (pcs, box, dll.) |
| `supplier` | TEXT | NOT NULL | Nama supplier |
| `minimum_stock` | INTEGER | NOT NULL, DEFAULT `0` | **Batas stok minimum** (dinamis) |
| `received_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Tanggal & waktu barang masuk |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Waktu record dibuat |

### 4.2 Table: `loans` (Peminjaman Barang)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | ID unik |
| `item_id` | UUID | FK → items.id, ON DELETE RESTRICT | Barang yang dipinjam |
| `borrower_name` | TEXT | NOT NULL | Nama peminjam |
| `borrower_contact` | TEXT | NOT NULL | Kontak peminjam |
| `loan_date` | TIMESTAMPTZ | NOT NULL, DEFAULT `now()` | Tanggal pinjam |
| `return_date` | TIMESTAMPTZ | NULLABLE | Tanggal pengembalian |
| `status` | TEXT | NOT NULL, DEFAULT `active` | `active` / `returned` |

**Logika:** Saat loan dibuat, `items.quantity` dikurangi 1. Saat `returnLoan()`, `items.quantity` ditambah 1.

### 4.3 Table: `pickups` (Pengambilan Barang Consumable)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | ID unik |
| `item_id` | UUID | FK → items.id, ON DELETE RESTRICT | Barang yang diambil |
| `person_name` | TEXT | NOT NULL | Nama pengambil |
| `department_origin` | TEXT | NOT NULL | Departemen asal pengambil |
| `quantity` | INTEGER | NOT NULL | Jumlah diambil |
| `purpose` | TEXT | NOT NULL | Keperluan pengambilan |
| `issued_by` | TEXT | NOT NULL | Nama petugas yang mengeluarkan |
| `issuer_department` | TEXT | NOT NULL, DEFAULT `'FMD'` | Departemen petugas |
| `picked_at` | TIMESTAMPTZ | NOT NULL | Tanggal & waktu pengambilan |

**Logika:** Saat pickup dibuat, `items.quantity` dikurangi sejumlah `pickup.quantity`.

---

## 5. Features

### 5.1 Landing Page (`/`)

- Dua tombol besar: **"Admin"** dan **"Non-Admin"**
- Jika user sudah login (Admin), auto-redirect ke `/dashboard/overview`

### 5.2 Admin Dashboard (`/dashboard/overview`)

6 Metric Cards dalam 3-kolom grid:

| # | Metric | Logika / SQL |
|---|---|---|
| 1 | Total Barang Lemari C-01 | `SUM(quantity) WHERE category = 'lemari-c01'` |
| 2 | Total Barang Lemari C-02 | `SUM(quantity) WHERE category = 'lemari-c02'` |
| 3 | Total Barang Lemari C-03 | `SUM(quantity) WHERE category = 'lemari-c03'` |
| 4 | Barang Habis (Stok 0) | `COUNT(*) WHERE quantity = 0` |
| 5 | Peminjaman Aktif | `COUNT(*) WHERE status = 'active'` |
| 6 | **Barang Hampir Habis** | `COUNT(*) WHERE quantity > 0 AND quantity <= minimum_stock` |

#### Logika "Barang Hampir Habis" (Dinamis)

- **Indikator lama (dihapus):** Hardcoded `quantity < 7` untuk semua barang
- **Indikator baru (v3.0):** `quantity <= minimum_stock`, di mana `minimum_stock` adalah nilai yang diinput admin per-barang saat menambahkan inventory
- Setiap barang bisa memiliki batas minimum berbeda (5, 10, 3, dst.)

### 5.3 Admin: Inventory (`/dashboard/inventory`)

#### DataTable Semua Barang
| Kolom | Keterangan |
|---|---|
| Nama Barang | `items.name` |
| Spesifikasi | `items.specification` |
| Kategori | Badge: Lemari C-01 / C-02 / C-03 |
| Stok | Angka; **kuning** jika `0 < quantity <= minimum_stock`, **merah** jika `quantity = 0` |
| Unit | `items.unit` |
| Supplier | `items.supplier` |
| Tgl Masuk | `items.received_at` format `dd MMM yyyy` (id-ID) |
| Aksi | Dropdown: Hapus |

#### Form Input Barang Masuk (AddItemSheet)
Slide-over dari kanan dengan 9 field:

| # | Field | Tipe | Validasi |
|---|---|---|---|
| 1 | Nama Barang | Text | Required, max 200 |
| 2 | Spesifikasi | Text | Optional, max 500 |
| 3 | Kategori Barang | Select | `Lemari C-01` / `C-02` / `C-03` |
| 4 | Jumlah Barang Masuk (Qty) | Number | Required, min 1, max 99999 |
| 5 | Unit | Text | Required, max 50 |
| 6 | Supplier | Text | Required, max 200 |
| 7 | Tanggal Barang Masuk | Date | Required, default today |
| 8 | Waktu Barang Masuk | Time | Required, default now |
| 9 | **Jumlah Batas Stok Minimum Barang** | Number | Optional, min 0, max 99999, default 0 |

Tombol **"Simpan"** → validasi client-side + Zod server → insert ke database + revalidate cache.

### 5.4 Admin: Data Peminjaman (`/dashboard/loans`)

- DataTable semua peminjaman (active & returned)
- Action: **Mark as Returned** (hanya untuk status `active`)
- Saat return: `items.quantity` +1, status → `returned`, `return_date` diisi

### 5.5 Admin: Data Pengambilan (`/dashboard/pickups`)

- 3 tab: **Lemari C-01 | Lemari C-02 | Lemari C-03**
- DataTable per tab dengan kolom: Barang, Pengambil, Dept. Asal, Qty, Keperluan, Dikeluarkan Oleh, Tanggal
- Export to Excel per tab

### 5.6 Non-Admin Flow (`/guest`)

#### Step 1: PIN Entry
- 4 input OTP-style, auto-fokus
- Validasi server-side terhadap `NON_ADMIN_PIN`

#### Step 2: Guest Menu (`/guest/menu`)
4 action cards:
1. **Peminjaman Barang** — Sheet: pilih barang (stok > 0), isi nama peminjam, kontak
2. **Pengambilan Barang Lemari C-01** — Sheet: pilih barang C-01, isi nama, departemen (dropdown 9 opsi), qty, keperluan, petugas (dropdown 24 nama)
3. **Pengambilan Barang Lemari C-02** — Sheet: sama, filter C-02
4. **Pengambilan Barang Lemari C-03** — Sheet: sama, filter C-03

---

## 6. Sidebar Navigation (Admin)

```
Dashboard      → /dashboard/overview
Inventory      → /dashboard/inventory
Data Peminjaman → /dashboard/loans
Data Pengambilan → /dashboard/pickups
Profile        → /dashboard/profile
```

---

## 7. Keep-Alive Cron Job

Supabase Free Tier mem-pause database yang tidak ada aktivitas. Untuk mencegah ini:

- **File:** `src/app/api/cron/keep-alive/route.ts`
- **Schedule:** `0 * * * *` (setiap jam)
- **Konfigurasi:** `vercel.json` → `crons` array
- **Aksi:** `SELECT 1` sederhana untuk menjaga koneksi tetap hidup

---

## 8. Security

| Lapisan | Mekanisme |
|---|---|
| **Admin Auth** | Supabase Auth + `requireAdmin()` server-side guard |
| **Non-Admin Auth** | PIN validated server-side, sessionStorage only |
| **Route Protection** | Middleware: redirect unauthenticated ke `/auth/sign-in` |
| **Input Validation** | Zod `.strict()` pada semua Server Action input |
| **Rate Limiting** | Maks 20 POST / menit ke `/auth/*` |
| **Audit Trail** | Structured logging via `logger.audit()` |
| **Foreign Keys** | ON DELETE RESTRICT mencegah orphan records |
| **Environment** | `.env*` di-gitignore, credentials tidak pernah exposed ke client |

---

## 9. Testing

| Test Suite | Scope |
|---|---|
| `db/items-schema.test.ts` | Validasi schema Drizzle |
| `inventory/schemas.test.ts` | Validasi Zod create/update schema |
| `inventory/actions.test.ts` | Unit test createItem, updateItem, deleteItem |
| `overview/actions.test.ts` | Unit test getDashboardMetrics (6 query) |
| `components/metric-card.test.tsx` | Render test MetricCard |
| `components/inventory-table.test.tsx` | Rendering table, low-stock highlighting |
| `components/add-item-sheet.test.tsx` | Form rendering & submit |
| `components/pickups-tabs.test.tsx` | Tab switching & empty state |

Run: `npm test` / `npm run test:watch` / `npm run test:coverage`

---

## 10. Deployment

### Vercel Setup
1. Root Directory: `next-shadcn-dashboard-starter-main`
2. Build Command: `next build` (auto-detected)
3. Framework: Next.js (auto-detected)
4. Environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NON_ADMIN_PIN`
   - `NEXT_PUBLIC_SENTRY_DISABLED=true`

### Database Migration
```bash
# Direct SQL via Node.js (existing connection)
node -e "const p=require('postgres');(async()=>{const sql=p({...});await sql.unsafe('ALTER TABLE items ADD COLUMN IF NOT EXISTS minimum_stock integer NOT NULL DEFAULT 0');await sql.end()})()"
```

---

## 11. Changelog

### v3.0 (Current)
- Menambahkan kolom `minimum_stock` ke tabel `items`
- Menambahkan field ke-9 "Jumlah Batas Stok Minimum Barang" di form inventory
- Mengganti logika hardcoded `quantity < 7` menjadi `quantity <= minimum_stock` (per-barang)
- Menambahkan `specification` dan `unit` ke schema
- Mengganti kategori `elektrik/mekanik/facility` → `lemari-c01/c02/c03`
- Menambahkan Vercel Cron Job untuk keep-alive database
- Menambahkan `issued_by` dan `issuer_department` ke tabel pickups
- Unit tests untuk schema, actions, dan components

### v2.0
- Migrasi dari mock data ke Supabase PostgreSQL + Drizzle ORM
- Implementasi dual-access (Admin + Non-Admin PIN)
- Landing page dengan dua tombol
- Sheet-based form untuk input (slide-over)
- Export to Excel

### v1.0
- Initial release dengan mock data
- Basic inventory CRUD
- Dashboard metrics
