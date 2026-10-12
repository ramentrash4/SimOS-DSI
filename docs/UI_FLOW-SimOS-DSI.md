# 📄 UI/UX FLOW — SOLO PROJECT
**SimOS DSI** | v1.0 | 10 Oktober 2026
**Referensi:** `PRD-SimOS-DSI.md` | `SRS-SimOS-DSI.md`

---

## 1. SITEMAP & INFORMATION ARCHITECTURE

### Struktur Halaman
```text
/ (Landing Page / Gerbang Masuk)
├── /login (OAuth & Kelengkapan Profil)
└── /app
    ├── /app/dashboard (Dasbor Guru)
    │   ├── tab: Katalog Misi
    │   └── tab: Rekap Nilai Siswa
    └── /app/play/[mission_id] (Area Gameplay - Fullscreen Mode)
```

### Global Navigation
- **Sidebar Kiri (Hanya di Dasbor Guru):** Navigasi gaya aplikasi *Enterprise* yang rapi. Memuat Logo, Menu "Katalog Misi", Menu "Nilai Siswa", dan Avatar Profil di bagian bawah. 
- **In-Game Navigation (Mode Play):** Menggunakan *Gesture Bar* ala iOS di bagian bawah layar untuk kembali ke *Homescreen* virtual.

---

## 2. SCREEN-BY-SCREEN LAYOUT

### [2.1] Screen: `/login` (Autentikasi)
**Primary Goal:** Masuk ke sistem dengan 1 klik (OAuth) dan menentukan Role.
**Layout Type:** *Centered Card* (Minimalis di tengah layar).

**Hierarki Visual (Top to Bottom):**
1. **Header Card:** Logo besar "SimOS DSI" dan teks sambutan santai.
2. **Main Content:** Tombol lebar "Lanjutkan dengan Google".
3. **Modal Lengkapi Profil (Jika akun baru):** Muncul pop-up memilih "Saya Guru" atau "Saya Siswa". Jika Siswa, kolom "Kode Kelas" wajib diisi.

**Key UI Components (shadcn/ui):**
- `Card` (Container utama)
- `Button` (Login OAuth)
- `Dialog` (Modal Profil)
- `Input` & `Label`

---

### [2.2] Screen: `/app/dashboard` (Dasbor Guru)
**Primary Goal:** Memilih misi untuk diproyeksikan, atau melihat nilai siswa.
**Layout Type:** *Dashboard dengan Sidebar Kiri*. Sisa area kanan untuk konten utama.

**Hierarki Visual (Top to Bottom):**
1. **Header Section (Kanan):** Teks "Selamat datang, Pak/Bu [Nama]" dan *Badge* menyala: "Kode Kelas: X-MIPA-1".
2. **Main Content (Katalog Misi):** Deretan *Grid Cards* untuk 5 Misi. Tiap kartu memiliki gambar *thumbnail*, tingkat kesulitan, dan tombol primer "Mulai Proyeksikan".
3. **Main Content (Rekap Nilai):** *Data Table* menampilkan daftar siswa, skor Bintang Misi 1-5, dan total bintang.

**Key UI Components (shadcn/ui):**
- `Sidebar` (Kustom komponen kiri)
- `Card` (Kartu Misi)
- `DataTable` (Daftar Nilai dengan fitur *sort*)
- `Badge` (Status Bintang)

---

### [2.3] Screen: `/app/play/[mission_id]` (SimOS Gameplay)
**Primary Goal:** Menyelesaikan simulasi naratif tanpa gangguan visual eksternal.
**Layout Type:** *Fullscreen API*. Layar monitor/proyektor menjadi hitam penuh, dengan *Phone Mockup Container* di bagian tengah.

**Hierarki Visual (SimOS Homescreen):**
1. **Top Bar iOS:** Jam, Sinyal, Baterai (Statis).
2. **App Grid:** Deretan Ikon Aplikasi (Chatter, InstaPic, Browser).
3. **Dock (Bawah):** Ikon aplikasi inti (Statis).

**Interaksi Aplikasi Virtual:**
- **Chatter:** UI menyerupai WhatsApp iOS. Terdapat animasi *"typing"* (titik-titik bergerak), diikuti munculnya gelembung pesan.
- **Pilihan (*Choice*):** Daftar opsi (A/B/C) muncul melayang dari bawah layar (*Bottom Sheet* bergaya iOS) dan membekukan alur cerita hingga salah satu ditekan.

---

## 3. USER INTERACTIONS & FEEDBACK

### Interaksi Kunci
| Aksi User | Feedback Visual | State Change |
|-----------|-----------------|--------------|
| Klik "Mulai Proyeksikan" | *Browser* meminta izin *Fullscreen API*. Jika disetujui, UI berubah seketika menjadi layar HP Virtual di tengah kegelapan. | Rute berpindah ke `/app/play/[id]`. Layar di- *lock* ke mode *fullscreen*. |
| Menerima Pesan Baru Lintas Aplikasi | Muncul *Push Notification Banner* melayang dari atas layar virtual, berbunyi *"Ting!"*. Bisa diklik untuk berpindah aplikasi. | Transisi State Zustand. |
| Memilih Opsi Fatal (Snowball Effect) | Kontainer SimOS bergetar kencang (*Screen Shake Animation*) 1 detik, diiringi audio *Glitch* dramatis. | Zustand mengunci status misi ke *Failed*. |

### Modals, Drawers & Overlays
- **Modal Debriefing (Akhir Misi):** Menggunakan desain layar penuh (*Overlay*) menutupi UI SimOS. Berisi visual Bintang animasi membesar, Pasal UU ITE, tombol "Kembali ke Dasbor" dan "Unduh Sertifikat" (jika syarat terpenuhi).

---

## 4. EDGE CASES: EMPTY, LOADING, & ERROR STATES

### Empty States (Keadaan Kosong)
| Layar / Komponen | Tampilan saat data kosong | Call to Action (CTA) |
|------------------|---------------------------|----------------------|
| Tabel Rekap Nilai Siswa | Ilustrasi kursi kelas kosong + "Yah, belum ada siswa yang gabung nih." | Teks penunjuk: "Yuk, bagikan Kode Kelas [XYZ] ke grup kelasmu!" |

### Loading States
- **Initial Load PWA:** Menampilkan *Splash Screen* dengan logo SimOS membesar secara perlahan (*Fade in*).
- **Data Fetching Dashboard:** Menampilkan *Skeleton Loader* (baris abu-abu beranimasi pulsa) agar layar tidak terlihat kosong atau patah.

### Error States (Visual)
- **404 Not Found:** Ilustrasi HP *error* dengan teks "Waduh, nyasar ya? Yuk balik ke jalan yang benar." (Tombol ke Beranda).
- **Global Error / Network:** *Toast Notification* berwarna merah di pojok layar berbunyi "Koneksi ke server putus nih. Coba lagi ya!"

---

## 5. DESIGN SYSTEM HOOK

### Tone of Voice (Micro-copy)
- **Gaya Bahasa:** **Kasual & Ramah ala Gen-Z**. Seluruh *micro-copy* (teks *error*, status kosong, petunjuk UI) menggunakan bahasa yang sangat santai, mengalir, dan menyenangkan, menghilangkan kesan "aplikasi sekolah yang kaku".
- **Contoh Sukses:** *"Mantap! Nilai berhasil disimpan."*

### Base Animation / Micro-interactions
- **Transisi Halaman:** *Fade-in* lembut (durasi 200ms).
- **Gelembung Chat (Chatter):** *Slide-up & Fade-in* (`animate-in slide-in-from-bottom-2 duration-300`) agar terasa membal (*bouncy*) seperti UI *chat* asli.
- **Push Notification Banner:** *Slide-down* dari luar atas layar, bertahan 3 detik, lalu *Slide-up* menghilang.

---
---
