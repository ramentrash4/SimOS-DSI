# 📄 PRD — SOLO PROJECT
**SimOS DSI** | v1.0 | 10 Oktober 2026

---

## 1. PRODUCT VISION & OBJECTIVES

### Elevator Pitch
SimOS DSI adalah *game* edukasi berbasis *roleplay* berupa replika *smartphone* (OS virtual) yang dirancang untuk melatih empati digital dan jeda kritis siswa SMA terhadap ancaman siber (Hoax, Phishing, Cyberbullying, HAKI, dan Jejak Digital) yang dapat dimainkan secara klasikal via proyektor maupun penugasan mandiri.

### Problem Statement
Siswa SMA kelas 10 (Fase E) seringkali hanya mendapatkan materi Dampak Sosial Informatika (DSI) sebatas teori hafalan. Akibatnya, saat menghadapi kasus nyata di media sosial, mereka tetap rentan menjadi korban atau pelaku. Selain itu, keterbatasan infrastruktur gawai yang merata di kelas sering menyulitkan guru mengadakan simulasi praktik secara interaktif.

### Success Metrics

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| Kecepatan Muat Aplikasi (FCP) | < 2 Detik | Google Lighthouse / Network tab |
| Waktu Setup Kelas (Guru) | < 30 Detik | Pengukuran waktu dari Login hingga layar *game* tampil |
| Tingkat Kesuksesan Login Siswa | > 95% | Log autentikasi Supabase tanpa *error* |

---

## 2. USER PERSONAS & USER FLOW

### Deep Personas
1. **Guru Informatika (Sang Fasilitator):** Berusia 25-45 tahun. Sangat sibuk dengan administrasi. Butuh media mengajar yang "*plug-and-play*" tanpa hambatan teknis di kelas. Definisi suksesnya adalah melihat siswa aktif berdebat di kelas saat jam pelajaran DSI tanpa harus pusing mengurus registrasi atau kendala *device* siswa.
2. **Siswa Kelas 10 (Sang Pemain):** Remaja usia 15-16 tahun, melek teknologi, aktif di medsos, sangat takut tertinggal tren (FOMO), dan peduli pada reputasi sosial. Mereka benci aplikasi sekolah yang kekanak-kanakan. Definisi suksesnya adalah menamatkan game dengan 3 bintang tanpa terkena konsekuensi memalukan/merugikan di dalam simulasi.

### Jobs-to-be-Done (JTBD)
- **Sebagai Guru,** saya ingin memutar skenario *game* pilihan di proyektor dan mengontrol alur *chat*-nya, agar kelas bisa berdiskusi mengambil keputusan siber tanpa mewajibkan siswa memegang HP masing-masing.
- **Sebagai Siswa,** saya ingin login dengan cepat di rumah, lalu menyelesaikan simulasi konflik medsos (PR dari guru), agar saya mendapat skor Bintang 3 tanpa bosan.

### Happy Path
*(Alur Mode Proyektor Klasikal)* Guru login $\rightarrow$ Buka Dasbor $\rightarrow$ Pilih "Misi 2: HAKI" $\rightarrow$ Layar berubah menjadi UI SimOS $\rightarrow$ Guru membaca *chat* yang muncul otomatis secara bertahap $\rightarrow$ Menghentikan layar di titik percabangan $\rightarrow$ Kelas voting Opsi B $\rightarrow$ Game tamat di Akhir Baik $\rightarrow$ Layar Rapor Teori muncul untuk dicatat siswa.

---

## 3. THE VIBE & DESIGN BRIEF

### Mood & Aesthetics
Modern, *Sleek*, Nyata (Realistis), *Immersive*. Menggunakan estetika **iOS (Apple)** dengan efek *glassmorphism* (kaca buram), sudut melengkung, dan ikonografi minimalis (SF Symbols).

### Anti-References
Jangan menggunakan gaya *flat-vector* kekanak-kanakan, warna neon yang mencolok, atau desain Android jadul. Dilarang terlihat seperti aplikasi modul sekolah yang membosankan.

### Referensi Inspirasi
Replika layar utama iOS terbaru, desain WhatsApp iOS untuk aplikasi Chatter, dan desain Instagram iOS untuk aplikasi InstaPic.

---

## 4. FUNCTIONAL REQUIREMENTS

### ✅ Must Have — Wajib Ada di v1.0
- [ ] Kerangka UI "Virtual Phone" (SimOS) bergaya iOS yang responsif dan skalabel di layar proyektor.
- [ ] Aplikasi **Chatter** (Kloning WhatsApp) dengan fitur *Auto-scroll* jeda dinamis (efek *typing*).
- [ ] Aplikasi **InstaPic** (Kloning Instagram) dengan UI kolom komentar dan gambar.
- [ ] Aplikasi **Browser** dengan mekanik *Auto-complete puzzle* (klik sejarah pencarian yang benar, bukan ketik bebas).
- [ ] 5 Skenario Misi Utama lengkap dengan percabangan dan *Snowball Effect* visual/audio (Hoax, HAKI, Cyberbullying, Phishing, Jejak Digital).
- [ ] Tampilan Rapor & Teori Debriefing (Pop-up) di akhir misi.
- [ ] Dasbor Guru (Katalog Misi) berbasis web.
- [ ] Integrasi Autentikasi Supabase (Email/Google Auth) untuk Mode Siswa (PR).
- [ ] Sistem Penilaian Bintang (1-3) per level tersimpan di *database*.

### 🔶 Should Have — Penting tapi Bukan Prioritas Utama
- [ ] Suara Notifikasi (*Ting / Pop*) dan Audio Glitch yang bisa di *mute/unmute*.
- [ ] Generate otomatis "Sertifikat Duta Siber" (Gambar) jika 5 misi selesai dengan 3 bintang.

### 💡 Could Have — Bonus Jika Ada Waktu
- [ ] Animasi transisi (*swipe/fade*) yang sangat halus saat berpindah aplikasi di dalam SimOS.
- [ ] Halaman profil avatar siswa.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
Aplikasi harus dimuat (FCP) kurang dari 2 detik. Semua aset *dummy* gambar (seperti foto paket, foto *selfie*) harus di-*compress* secara optimal ke format WebP.

### SEO & Accessibility (a11y)
SEO diabaikan (hanya *meta tag* dasar). Aksesibilitas visual mengandalkan *zoom browser* murni, sehingga struktur HTML harus mendukung penskalaan *zoom* tanpa merusak *layout* fleksibel (menggunakan *rem* atau persentase yang tepat).

### Responsiveness
| Breakpoint | Nama | Aturan Layout |
|------------|------|---------------|
| < 640px | Mobile | Tampilan SimOS penuh memenuhi 100% layar HP siswa (Mode PR). |
| 640px – 1024px | Tablet | SimOS di tengah, memakan 80% lebar layar. |
| > 1024px | Desktop | UI SimOS dibingkai proporsional (max-width ~400px) di tengah layar dengan *background* estetis (Mode Guru/Proyektor). |

---

## 6. TECH STACK & AI CONSTRAINTS

### Saran Teknologi
| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Framework | React (Vite) / PWA | Cepat, efisien, mendukung PWA untuk diinstal di *mobile*. |
| Styling | Tailwind CSS | Produksi UI kloning OS jauh lebih efisien. |
| State Management | Zustand | Ringan, minim *boilerplate*, sempurna untuk melacak status percabangan cerita. |
| Database & Auth | Supabase | Solusi backend *real-time* yang cepat untuk autentikasi dan rekam nilai. |
| Hosting | Vercel | Standar industri untuk Vite/React, *deploy* instan dan stabil. |

### AI Constraints

**Penamaan & Struktur:**
- Wajib menggunakan standar *Best Practice* industri (Modular).
- Gunakan struktur *Feature-based* (`/features/chatter/components`, dll).
- Wajib menggunakan *Functional Components* dengan *Arrow Functions*.
- Penamaan variabel gunakan `camelCase`, komponen `PascalCase`.

**Larangan:**
- ❌ Dilarang menggunakan nilai ukur *arbitrary* acak di Tailwind (misal `w-[31px]`), gunakan kelas utilitas standar (seperti `w-8`) sebisa mungkin.
- ❌ Jangan mengeksekusi *coding* sampai seluruh UI/UX Flow disetujui.

**Kewajiban:**
- ✅ Gunakan TypeScript dengan *Strict Typing* (definisikan *interface/type* dengan jelas untuk struktur `Misi` dan `Pilihan`).

### Out of Scope (v1.0)
- ❌ Fitur "Download ke Excel (.CSV)" untuk rekap nilai di Dasbor Guru ditunda ke v1.1.

---

## 7. MILESTONES

| Versi | Scope Fitur | Target Selesai |
|-------|-------------|----------------|
| **v1.0 MVP** | Semua `Must Have` + `Should Have` | Selesai Task Breakdown pertama |
| **v1.1** | Ekspor Excel (CSV), Fitur Profil | Pasca Evaluasi MVP |
| **v1.2+** | Semua `Could Have` (Animasi Halus dll) | Tahap Pemolesan Akhir |
