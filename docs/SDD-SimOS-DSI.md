# 📄 SDD — SOLO PROJECT
**SimOS DSI** | v1.0 | 10 Oktober 2026
**Referensi PRD:** `PRD-SimOS-DSI.md`
**Referensi SRS:** `SRS-SimOS-DSI.md`

---

## 1. ARCHITECTURE OVERVIEW

### High-Level Architecture
Sistem ini menggunakan arsitektur **Serverless (BaaS - Backend as a Service)**. Aplikasi *frontend* berupa Progressive Web App (PWA) yang dirender di sisi klien (CSR via Vite/React). PWA ini memuat *engine* simulasi cerita dari *file* statis TypeScript (TS) lokal untuk menjamin kecepatan eksekusi dan keamanan tipe data (*type-safety*). Manajemen status global (*Gameplay State*) diatur oleh Zustand. Pengambilan dan penyimpanan data rekaman skor (*Mission Progress*) ke Supabase PostgreSQL ditangani oleh kombinasi **Supabase Client SDK + React Query (@tanstack/react-query)** untuk memaksimalkan *caching* dan performa *loading state*.

### Infrastructure Diagram
```text
[Siswa / Guru (Browser/PWA)]
      │
      ▼
[Vercel Edge CDN (Hosting Frontend)]
      │
      ├─► [React/Vite Frontend (PWA)]
      │         │
      │         ├─► [Zustand (Global Client State)]
      │         │
      │         ├─► [React Query (Server State Cache)]
      │         │
      │         └─► [Hardcoded TS Story Nodes (Data Misi Lokal)]
      │
      └─► [Supabase Client SDK (Data Flow)]
                │
                ▼
          [Supabase Platform (BaaS)]
                ├─► [Supabase Auth (Google OAuth)]
                └─► [PostgreSQL DB (profiles, mission_progress)]
```

---

## 2. FOLDER STRUCTURE & CODE ORGANIZATION

### Direktori Utama
Menggunakan struktur *Feature-Based* yang ketat agar pemisahan konteks antara UI Dasbor dan UI Simulasi (SimOS) tidak saling bercampur.

```text
/src
  ├── /assets        # Gambar dummy, efek suara (SFX Glitch/Ting), CSS global
  ├── /components    # Komponen shadcn/ui & komponen dasar global
  ├── /features      # Modul fitur mandiri (Logika & UI diisolasi)
  │     ├── /auth           # Login, Supabase Auth, Rute Terproteksi
  │     ├── /dashboard      # Tampilan Guru, Daftar Siswa, Data Tabel
  │     ├── /simos          # Frame HP iOS, Navbar, Chat Bubbles iOS
  │     └── /story-engine   # Logika pembaca node, Data Misi (TS)
  ├── /hooks         # Custom React hooks
  ├── /lib           # Utils, Konfigurasi Supabase (`supabase.ts`)
  ├── /services      # Wrapper Supabase JS untuk dipanggil React Query
  ├── /store         # Zustand stores (`useStoryStore`)
  ├── /types         # TypeScript Interfaces (`StoryNode`, `Mission`)
  └── /utils         # Fungsi helper (formatter, class generator)
```

### Aturan Peletakan Logika (Separation of Concerns)
- **UI Logic:** Hanya di dalam `/components` atau `/features/[nama-fitur]/components`.
- **Business Logic & Fetching:** Dilarang memanggil `supabase.from()` langsung dari komponen UI. Wajib diisolasi ke dalam `/services` dan dibungkus oleh `useQuery`/`useMutation` dari React Query.
- **State Global:** Hanya `/store` (Zustand) yang menyimpan *current node*, *stars*, dan state gameplay.

---

## 3. COMPONENT ARCHITECTURE (FRONTEND)

### Global UI Components
- **Dasbor Guru:** Menggunakan kumpulan pustaka *Headless UI* **shadcn/ui** (mempercepat pembuatan Button, Modal, Table, Input).
- **UI SimOS (Virtual Phone):** Dibangun dari awal (*scratch*) murni menggunakan Tailwind CSS untuk mencapai akurasi estetika **iOS murni** (lengkungan presisi, *glassmorphism*, gelembung *chat* otentik) yang tidak dimiliki *shadcn*.

### State Management Strategy
- **Local State (`useState`):** Mengelola animasi ketik (*typing indicator*), transisi *input* form kode kelas.
- **Global Client State (Zustand):** Mengelola logika simulasi *gameplay* (`currentNodeId`, `activeMissionId`, `currentStars`).
- **Server State (React Query):** Mengelola sinkronisasi data dari/ke Supabase, mem-*bypass* logika `isLoading` dan `isError` manual.

---

## 4. DATABASE SCHEMA DESIGN (FISIK)

### Skema Tabel Fisik (PostgreSQL via Supabase)

**Table: `profiles`**
| Column | Type (DBMS) | Constraints | Indexing |
|--------|-------------|-------------|----------|
| id | UUID | PRIMARY KEY, REFERENCES auth.users ON DELETE CASCADE | ✅ B-Tree |
| role | VARCHAR(20) | CHECK (role IN ('teacher', 'student')) | - |
| full_name | VARCHAR(100) | NOT NULL | - |
| class_code | VARCHAR(20) | NOT NULL | ✅ B-Tree |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | - |

**Table: `mission_progress`**
| Column | Type (DBMS) | Constraints | Indexing |
|--------|-------------|-------------|----------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | - |
| user_id | UUID | REFERENCES profiles(id) ON DELETE CASCADE | ✅ B-Tree |
| mission_id | VARCHAR(50) | NOT NULL | - |
| stars | INT2 | CHECK (stars >= 1 AND stars <= 3) | - |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | - |

### Strategi Indexing & Optimasi
- Membuat komposisi **Unique Index** pada tabel `mission_progress` untuk kombinasi `(user_id, mission_id)` guna memastikan satu siswa hanya memiliki satu rekam jejak final per misi (mencegah duplikasi data saat *upsert*).
- Membuat index pada kolom `class_code` di tabel `profiles` karena fungsi Dasbor Guru akan sering melakukan kueri filter berbasis kode.

---

## 5. API DESIGN & DATA FLOW

### Arsitektur API (Supabase Client Contract)
- **Pola Komunikasi:** Direct RPC / Table Operations via Supabase JS SDK.
- **Data Misi:** Data cerita *game* ditulis dalam bentuk **TypeScript Array of Objects** murni di sisi klien untuk jaminan *Type-Safety* ekstrem dan *auto-complete* IDE.

### Error Handling & Responses (Standardization)
Fungsi pembungkus di `/services` wajib meneruskan struktur *PostgrestError* dari Supabase secara seragam agar mudah ditangkap oleh React Query:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "SUPABASE_ERR_CODE",
    "message": "Human readable message"
  }
}
```

---

## 6. SECURITY IMPLEMENTATION DETAILS

### Otentikasi & Otorisasi
- **Alur Spesifik:** Supabase GoTrue Auth. JWT di-*generate* server, dikelola otomatis oleh *Local Storage* klien.
- **Validasi Otorisasi Klien:** *Route Guarding* React Router. Akun `student` dicegah masuk rute `/dashboard`.
- **Validasi Server (DB):** Row Level Security (RLS) PostgreSQL melindungi akses `profiles` dan `mission_progress` sesuai kepemilikan dan afiliasi `class_code`.

### Penanganan Secret / Environment Variables
Daftar `.env.local` yang dibutuhkan oleh Vite:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 7. CI/CD & DEPLOYMENT PIPELINE

### Git Workflow
- Menggunakan pola: **Trunk-based development**. AI diinstruksikan untuk melakukan *commit* langsung ke `main` secara gesit (tanpa *feature branching*) untuk mempercepat iterasi.
- Konvensi Commit: `feat:`, `fix:`, `chore:`, `refactor:`.

### Pipeline CI/CD (Vercel Automated CI)
Otomatisasi saat dorongan Git ke Vercel:
1. `Linting` (ESLint)
2. `Type Checking` (`tsc --noEmit`)
3. `Build` (`vite build`)

### Deployment Target
- **Frontend Hosting:** Vercel (Terhubung otomatis ke repositori Git).
- **Backend/Database:** Supabase Cloud.

---
---
