# 📄 SRS — SOLO PROJECT
**SimOS DSI** | v1.0 | 10 Oktober 2026
**Referensi PRD:** `PRD-SimOS-DSI.md`

---

## 1. SYSTEM OVERVIEW

### System Context
SimOS DSI adalah aplikasi *game* edukasi berbasis *Progressive Web App* (PWA). Klien (Frontend) menggunakan React (Vite) dengan manajemen state Zustand untuk menjalankan mesin cerita bercabang (*branching narrative engine*) secara *client-side*. Data nilai dan autentikasi dikomunikasikan secara langsung dari klien ke *Backend-as-a-Service* (Supabase) menggunakan Supabase JS Client tanpa melalui perantara *server* kustom (Serverless architecture). Data percabangan cerita (Story Nodes) di-*hardcode* sebagai file statis JSON/TS di sisi klien untuk memastikan latensi nol selama permainan.

### Tech Boundaries
- **In System:** Frontend PWA (UI SimOS, Mesin Cerita, Dasbor Guru, Logika Audio/Glitch, Generator Sertifikat Canvas HTML).
- **Third-party:** Supabase Auth (Manajemen Pengguna & OAuth), Supabase Database (PostgreSQL untuk menyimpan profil dan skor misi).

### Glossary & Definisi
| Istilah | Definisi |
|---------|----------|
| SimOS | Antarmuka utama aplikasi yang menyimulasikan sistem operasi *smartphone* fiktif. |
| Story Node | Titik tunggal dalam alur cerita (berupa 1 *bubble chat* atau 1 pop-up opsi). |
| RLS | *Row Level Security*, sistem keamanan basis data bawaan Supabase untuk membatasi akses data. |
| Class Code | Kode unik (*string*) yang digenerate oleh guru untuk dibagikan ke siswa sebagai kunci pengait data nilai. |

---

## 2. ACTOR & ROLE DEFINITIONS

### Daftar Actor
| Actor | Deskripsi | Cara Masuk Sistem |
|-------|-----------|-------------------|
| **Teacher (Guru)** | Pemilik kelas. Mengelola kode kelas dan memantau nilai. | Login via Email/Password atau Google Auth. Memilih *role* 'teacher'. |
| **Student (Siswa)** | Pemain game. Memasukkan kode kelas saat mendaftar. | Login via Google Auth. Memilih *role* 'student'. |
| **Guest** | Pengguna anonim. | Akses ke Landing Page dan halaman Login. |

### Permission Matrix
| Aksi / Fitur | Teacher | Student | Guest |
|--------------|---------|---------|-------|
| Mengakses UI SimOS (Bermain) | ✅ | ✅ | ❌ |
| Membuat & Mengelola Class Code | ✅ | ❌ | ❌ |
| Membaca skor semua siswa di 1 Class Code | ✅ | ❌ | ❌ |
| Menulis/Memperbarui skor sendiri | ✅ | ✅ | ❌ |

---

## 3. FUNCTIONAL SPECIFICATIONS

### [3.1] Autentikasi & Registrasi (Siswa & Guru)
**Use Case:**
```
Precondition  : Guest berada di halaman /login
Actor         : Student / Teacher

Main Flow     :
  1. Actor menekan tombol "Login with Google".
  2. Sistem memanggil Supabase OAuth provider.
  3. Supabase merespons → Sukses otorisasi.
  4. Sistem mengecek apakah profil Actor sudah lengkap.
  5. Sistem merespons → Menampilkan pop-up "Lengkapi Profil" (Role dan Nama).
  6. Jika Role == Student, tampilkan *input* "Class Code".
  7. Actor mengisi data dan *submit*.
  8. Sistem menyimpan profil dan me-redirect ke /dashboard.

Error Flow A  : [Class Code Tidak Ditemukan]
  → Sistem merespons "Kode Kelas tidak valid." (Code: AUTH_ERR_CLASS)

Postcondition : Actor terautentikasi dan berada di Dasbor.
```
**Business Rules:**
- BR-AUTH-01: Session dijaga aktif (*persisted*) menggunakan *default behavior* Supabase GoTrue (Local Storage).
- BR-AUTH-02: Seorang *Student* wajib memasukkan `class_code` yang valid (dibuat oleh Teacher) untuk bisa menyelesaikan registrasi.

---

### [3.2] Engine Simulasi Cerita (Gameplay)
**Use Case:**
```
Precondition  : Actor memilih misi dari Dasbor dan masuk ke UI SimOS
Actor         : Student / Teacher

Main Flow     :
  1. Sistem memuat file JSON statis dari misi yang dipilih.
  2. Sistem merender `StoryNode` urutan pertama.
  3. Sistem melakukan jeda/delay sesuai BR-SIM-01.
  4. Sistem memunculkan UI *chat bubble*.
  5. Sistem menunggu *input* Actor (Jika node berupa *Choice*).
  6. Actor memilih opsi.
  7. Sistem merender `StoryNode` cabang berikutnya.
  
Alt Flow      : [Efek Bola Salju]
  → Jika opsi memicu konsekuensi buruk, sistem merender efek *Screen Shake* dan memutar SFX *Glitch* secara simultan dengan *Story Node* berikutnya.

Postcondition : Misi mencapai `StoryNode` tipe END (Debriefing), skor dihitung.
```
**Business Rules:**
- BR-SIM-01: Panjang jeda *Auto-scroll* dikalkulasi dengan `Panjang_Karakter * 50ms`.
- BR-SIM-02: Pilihan yang diambil bersifat absolut dan tidak dapat di- *undo*.

---

### [3.3] Kalkulasi Skor & Pembuatan Sertifikat
**Use Case:**
```
Precondition  : Actor mencapai Node Debriefing
Actor         : Student

Main Flow     :
  1. Sistem mengkalkulasi jumlah Bintang (1-3) berdasarkan *path* yang dilalui.
  2. Sistem melakukan pemanggilan Supabase SDK untuk melakukan UPSERT nilai.
  3. Sistem merespons → Menampilkan UI Rapor.
  4. Sistem mengecek total bintang di semua misi (Jika 5 misi x 3 bintang = 15).
  5. Jika terpenuhi, sistem menampilkan tombol "Unduh Sertifikat".
  6. Actor mengklik tombol.
  7. Sistem me-render HTML Canvas berisi *background* sertifikat + nama Actor, lalu men-*trigger* pengunduhan file *image* lokal.
```
**Business Rules:**
- BR-SCORE-01: Skor yang disimpan di Supabase selalu skor Bintang tertinggi yang pernah dicapai Actor.
- BR-CERT-01: Pembuatan sertifikat tidak menggunakan *backend storage*, melainkan dirender murni secara *client-side* menggunakan pustaka *canvas* (misal `html2canvas`).

---

## 4. DATA MODELS

### Entity Definitions

**Entity: `profiles`**
```
Nama Field    | Tipe Data      | Constraint              | Default   | Keterangan
──────────────|────────────────|─────────────────────────|───────────|────────────
id            | UUID           | PRIMARY KEY             |           | FK ke auth.users
role          | VARCHAR(20)    | 'teacher' OR 'student'  |           | NOT NULL
full_name     | VARCHAR(100)   | NOT NULL                |           |
class_code    | VARCHAR(20)    |                         |           | Teacher: kode miliknya. Student: kode afiliasi.
created_at    | TIMESTAMP      | NOT NULL                | NOW()     |
```

**Entity: `mission_progress`**
```
Nama Field    | Tipe Data      | Constraint              | Default   | Keterangan
──────────────|────────────────|─────────────────────────|───────────|────────────
id            | UUID           | PRIMARY KEY             | auto-gen  |
user_id       | UUID           | FK(profiles.id)         |           | NOT NULL
mission_id    | VARCHAR(50)    | NOT NULL                |           | (Contoh: 'mission_1')
stars         | INT2           | MIN(1), MAX(3)          | 1         |
updated_at    | TIMESTAMP      | NOT NULL                | NOW()     |
```

*(Catatan: Data `Story Nodes` tidak disimpan di database, melainkan di-hardcode dalam file statis TypeScript/JSON di frontend).*

---

## 5. SUPABASE RLS & CLIENT CONTRACTS

Aplikasi ini menggunakan pola *Serverless*, sehingga interaksi data diatur oleh pemanggilan *Supabase Client SDK* di sisi *Frontend*, diamankan dengan kebijakan *Row Level Security* (RLS) di PostgreSQL.

### RLS Policies: `profiles`
| Operasi | Actor | Kebijakan (Policy) |
|---------|-------|--------------------|
| SELECT | Teacher | Bisa melihat profilnya sendiri, ATAU profil Student yang `class_code`-nya sama. |
| SELECT | Student | Hanya bisa melihat profilnya sendiri (`auth.uid() = id`). |
| INSERT | Auth/User | Mengizinkan pembuatan row baru saat *Sign Up* (dikunci hanya untuk ID miliknya sendiri). |
| UPDATE | Auth/User | Hanya bisa mengubah row miliknya sendiri (`auth.uid() = id`). |

### RLS Policies: `mission_progress`
| Operasi | Actor | Kebijakan (Policy) |
|---------|-------|--------------------|
| SELECT | Teacher | Bisa melihat progress jika `user_id` berafiliasi dengan `class_code` Teacher tersebut. |
| SELECT | Student | Hanya bisa melihat progress miliknya sendiri (`auth.uid() = user_id`). |
| INSERT | Student/Teacher | Hanya bisa menginsert progress untuk ID miliknya sendiri (`auth.uid() = user_id`). |
| UPDATE | Student/Teacher | Hanya bisa mengupdate progress untuk ID miliknya sendiri (`auth.uid() = user_id`). |

---

## 6. NON-FUNCTIONAL SPECIFICATIONS

### Performance
| Metrik | Target | Kondisi Pengukuran |
|--------|--------|-------------------|
| DB Query Time (Read) | < 50ms | Memuat Dasbor Guru |
| Time to First Byte (TTFB) | < 500ms | Saat pemuatan halaman statis dari Vercel Edge CDN |
| Story Node Render Time | < 16ms | Pergantian antrian *chat* (mencapai 60 FPS) |

### Security
- **Authentication:** JWT RS256 yang ditangani otomatis oleh Supabase GoTrue.
- **Row Level Security:** Seluruh tabel wajib mengaktifkan RLS (*Enable Row Level Security* di Supabase). Tidak boleh ada operasi `anon` (Guest) yang diizinkan menulis ke *database*.

---

## 7. STATE MACHINES

### Status Misi (Zustand Global State)
Status diatur oleh *engine* cerita di Frontend (Zustand).

**States:**
| State | Deskripsi |
|-------|-----------|
| `IDLE` | Berada di luar misi (di Dasbor / Layar *Homescreen* SimOS). |
| `PLAYING` | Mesin merender rentetan *Story Node* secara otomatis sesuai jeda waktu. |
| `WAITING_INPUT` | Mesin berhenti, memunculkan opsi pilihan untuk Actor. |
| `DEBRIEFING` | Cerita selesai, layar rapor dimunculkan. |

**Transisi yang Diizinkan:**
| Dari State | Ke State | Trigger | Actor |
|------------|----------|---------|-------|
| `IDLE` | `PLAYING` | Mengklik aplikasi untuk memulai misi. | User |
| `PLAYING` | `WAITING_INPUT` | Tipe *node* saat ini adalah `CHOICE`. | Sistem |
| `WAITING_INPUT` | `PLAYING` | Sebuah opsi dipilih. | User |
| `PLAYING` | `DEBRIEFING` | Tipe *node* saat ini adalah `END`. | Sistem |
| `DEBRIEFING` | `IDLE` | Menekan tombol "Kembali ke Dasbor". | User |
