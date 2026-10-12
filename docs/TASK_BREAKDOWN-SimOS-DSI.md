# 📄 TASK BREAKDOWN — SOLO PROJECT
**SimOS DSI (Dampak Sosial Informatika - Game Edukasi Simulasi HP Virtual)** | v2.0 | 11 Oktober 2026
**Referensi Dokumen:** `PRD-SimOS-DSI.md`, `SRS-SimOS-DSI.md`, `SDD-SimOS-DSI.md`, `UI_FLOW-SimOS-DSI.md`, `DESIGN.md`, `specs/2026-10-10-simos-dsi-level-design.md`, `specs/2026-10-10-simos-dsi-design.md`

---
> **Cara Pakai:**
> File ini adalah *Project Manager* & panduan eksekusi menyeluruh untuk menghasilkan **Produk Jadi Utuh (Production-Ready)**, BUKAN sekadar MVP prototipe.
> Setiap task atomik `[ ]` harus diselesaikan dengan standar produksi, divalidasi hingga bebas bug, dan ditandai `[x]` secara tertib.
>
> **Label Task:**
> - `[SEQUENTIAL]` → Dikerjakan oleh agen utama secara berurutan karena ada *hard dependency*.
> - `[PARALLELIZABLE]` → Task independen yang siap diparalelkan antar modul tanpa konflik status.
> - `[DELEGATE]` → Sub-task perancangan data atau komponen mandiri yang diisolasi.
---

## 0. ORCHESTRATION STRATEGY

> *Dianalisis dari seluruh spesifikasi narasi, kurikulum Fase E Kurikulum Merdeka, arsitektur iOS SimOS, dan ekosistem Dasbor Guru.*

```
[FONDASI ARSITEKTUR & DESAIN]
Phase 1 (Setup & Schema Supabase) ──► Phase 2 (Engine SimOS Shell iOS, Audio SFX, Multi-App Router)
                                              │
      ┌───────────────────────────────────────┴───────────────────────────────────────┐
      ▼                                                                               ▼
[IMPLEMENTASI LEVEL 1 - 5 LENGKAP]                                          [EKOSISTEM GURU & SISWA]
- Level 1: "Pesan Berantai" (Hoax & Cek Fakta Browser)                       - Dasbor Guru (Katalog & Roster Kelas)
- Level 2: "Poster Pensi" (HAKI, Plagiarisme, InstaPic & Chatter)            - Mode Proyektor Klasikal (Zoom/Fullscreen)
- Level 3: "Bercanda atau Menyakiti?" (Cyberbullying, Report & DM Siska)     - Integrasi Auth & Profil Kode Kelas
- Level 4: "Kurir Misterius" (Malware APK, Phishing, Simulasi SMS OTP)       - Generator Sertifikat Duta Siber (HTML5 Canvas)
- Level 5: "Jejak yang Tertinggal" (Digital Footprint, OSIS Cancel Culture)   - Kartu Teori Debriefing & Dasar Hukum UU ITE
      │                                                                               │
      └───────────────────────────────────────┬───────────────────────────────────────┘
                                              ▼
                                Phase 4: Refinement, Polish, Haptic Audio & Responsive
                                              ▼
                                Phase 5: QC & Pengujian Akhir (Tunggu Approval User)
```

---

## 1. PHASE 1: INITIALIZATION, DATABASE SCHEMA & SECURITY [SEQUENTIAL]

- [x] **T-1.1** `[SEQUENTIAL]` Inisiasi struktur proyek React + Vite + TypeScript (Strict) dengan Tailwind CSS dan Shadcn UI sesuai SDD.
- [x] **T-1.2** `[SEQUENTIAL]` Setup konfigurasi environment `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) dan penanganan state offline / fallback.
- [x] **T-1.3** `[SEQUENTIAL]` Terapkan skema basis data PostgreSQL di Supabase:
  - Tabel `profiles`: `id` (UUID PK), `role` (`teacher` / `student`), `full_name` (VARCHAR), `class_code` (VARCHAR), `created_at`.
  - Tabel `mission_progress`: `id` (UUID PK), `user_id` (FK profiles), `mission_id` (VARCHAR), `stars` (INT2 1-3), `updated_at`.
- [x] **T-1.4** `[SEQUENTIAL]` Konfigurasi Row Level Security (RLS) PostgreSQL untuk mencegah *infinite recursion* pada tabel `profiles` dan membatasi akses guru hanya ke siswa di kelasnya.
- [x] **T-1.5** `[SEQUENTIAL]` Setup konfigurasi Desain Token iOS sesuai `docs/DESIGN.md` (Warna `#007AFF`, `#25D366`, Radius 40px/18px, Glassmorphism `backdrop-blur-md`, animasi Shake).

**⛔ CHECKPOINT 1:** Fondasi basis data dan konfigurasi lingkungan telah teruji dan aman.

---

## 2. PHASE 2: CORE SIMOS ENGINE & MULTI-APP FRAMEWORK [SEQUENTIAL]

- [x] **T-2.1** `[SEQUENTIAL]` Bangun Frame Mockup iPhone (SimOSShell) bergaya iOS murni:
  - Notch / Dynamic Island realistis di bagian atas.
  - Status Bar interaktif (Jam real-time, Ikon Sinyal, Wi-Fi, Baterai, dan tombol kontrol Suara Mute/Unmute).
  - iOS Home Gesture Bar di bagian bawah (kembali ke *Homescreen* dengan satu klik).
  - Kontainer layar responsif (100% layar pada Mobile `<640px`, proporsional tengah pada Desktop/Proyektor).
- [x] **T-2.2** `[SEQUENTIAL]` Bangun Web Audio SFX Engine (Zero-dependency / Bebas 404):
  - Audio Sintesis / Web Audio API untuk suara notifikasi masuk (*Ting / Pop*).
  - Suara kirim pesan (*Whoosh*).
  - Efek audio *Glitch / Error buzz* saat konsekuensi buruk terjadi.
  - Efek audio *Success Fanfare* saat misi berhasil.
  - Sinkronisasi toggle Mute/Unmute di `useSimOSStore`.
- [x] **T-2.3** `[SEQUENTIAL]` Bangun Push Notification Banner Simulator:
  - Notifikasi melayang (*slide-down from top*) saat ada pesan baru lintas aplikasi (misal pemain di Browser, ada notif Chatter/SMS).
  - Interaktif: Klik banner langsung membuka aplikasi pengirim.
- [x] **T-2.4** `[SEQUENTIAL]` Perluas Store Dialog & State Engine (`useChatStore` & `useSimOSStore`):
  - Dukungan multi-kanal: Grup Chat ("Grup Kelas X", "Panitia Pensi") vs DM Pribadi (Pak Guru, Siska, Budi, Kurir).
  - Pacing pengetikan dinamis sesuai formula: `Panjang_Karakter * 50ms` dengan indikator titik animasi (*Typing Indicator*).
  - Dukungan perintah aksi otomatis (`[SYSTEM_ACTION:openApp:...]`, `[SYSTEM_ACTION:glitch:...]`, `[SYSTEM_ACTION:shake]`, `[SYSTEM_ACTION:sms:...]`).
  - Sistem penilaian akumulasi bintang (1-3 Bintang) dengan proteksi *High-Score Retention* (skor tertinggi tidak tertimpa).
- [x] **T-2.5** `[SEQUENTIAL]` Bangun Komponen Universal Debriefing & Teori (Gabungan Chat & Kartu Rapor):
  - Tahap 1: Chat evaluasi personal dari **Pak Guru Informatika** di Chatter sesuai cabang akhir yang diraih.
  - Tahap 2: Klik lampiran Pak Guru memunculkan **Kartu Ringkasan (Rapor)** *overlay*:
    - Status Misi (GAGAL / BERHASIL / BERHASIL PARSIAL / BERHASIL SEMPURNA).
    - Animasi Bintang 1-3.
    - Istilah Kunci (Key Terms & Definisi).
    - Dasar Hukum & Regulasi (UU ITE / UU Hak Cipta pasal spesifik).
    - Pesan Moral (Kutipan reflektif).
    - Tombol "Coba Lagi" (Replay) & "Kembali ke Dasbor".

**⛔ CHECKPOINT 2:** Engine OS Virtual, audio internal, notifikasi lintas aplikasi, dan sistem debriefing universal siap digunakan oleh seluruh level. [SELESAI]

---

## 3. PHASE 3: IMPLEMENTASI LENGKAP SELURUH LEVEL & MEKANIK [PARALLELIZABLE]

### 🎮 Milestone 3.1: Level 1 - "Pesan Berantai" (Literasi Hoax & Cek Fakta)
*Topik: Hoax, Social Engineering, Cek Fakta, Jeda Kritis*
*Aplikasi Terlibat: Chatter (Grup Kelas & DM Pak Guru), Browser*
*NPC: Dina (Ketua Kelas), Pak Guru Informatika*

- [x] **T-3.1.1** `[DELEGATE]` Buat Struktur Narasi Lengkap Level 1 (`src/data/missions/mission1.ts`):
  - Dina mengirim pesan *forward* heboh: sidak kebersihan Dinas & libur total besok, link: `http://info-diknas-sekolah.blogspot.xyz/libur-mendadak`.
  - Percabangan Opsi A: Forward ke grup lain $\rightarrow$ Snowball Buruk.
  - Percabangan Opsi B: Tanya keabsahan Dina $\rightarrow$ Dina jawab dari kakak kelas $\rightarrow$ Opsi forward atau cek browser.
  - Percabangan Opsi C: Buka Browser untuk cek fakta.
  - Cabang Akhir Buruk: Layar HP glitch hebat, Chatter bergerak sendiri mengirim spam link ke semua kontak, rentetan chat teman marah, status GAGAL (1 Bintang).
  - Cabang Akhir Baik: Temukan banner di web sekolah, klarifikasi ke Dina, Dina hapus pesan & minta maaf, status BERHASIL (3 Bintang).
  - Dialog debriefing Pak Guru Informatika (khusus Level 1) & Data Kartu Rapor (UU ITE Pasal 28 - Penyebaran Berita Bohong, istilah Phishing & Malware).
- [x] **T-3.1.2** `[DELEGATE]` Bangun Mekanik Browser Cek Fakta (Teka-Teki Auto-Complete History):
  - Tampilan Safari iOS lengkap dengan URL Address Bar & tombol navigasi.
  - Mekanik pencarian berbasis *puzzle/keyword suggestions*: Klik kata kunci yang tepat ("Website Resmi SMAN 1", "Pengumuman Sidak Kebersihan Dinas", dll) untuk menghindari salah ketik.
  - Halaman Web Resmi Sekolah dengan spanduk merah mencolok: *"PENGUMUMAN RESMI: Berita Libur Besok Adalah HOAX!"*.
  - Halaman Blogspot Phishing mencurigakan jika pemain membuka tautan palsu.
- [x] **T-3.1.3** `[SEQUENTIAL]` Integrasi Alur Level 1:
  - Transisi mulus antara Chatter $\leftrightarrow$ Browser.
  - Animasi chat spam otomatis saat terkena hack (efek bola salju).
  - Munculnya chat penutup Pak Guru Informatika dan Kartu Rapor.
- [x] **T-3.1.4** `[SEQUENTIAL]` Testing & QC Skenario Level 1 (Jalur Opsi A, B, C dan kalkulasi bintang 1 & 3).

---

### 🎨 Milestone 3.2: Level 2 - "Poster Pensi" (HAKI, Plagiarisme & Lisensi Gambar)
*Topik: Hak Cipta, Plagiarisme, Lisensi Creative Commons, Etika Digital*
*Aplikasi Terlibat: Chatter (Grup Panitia Inti Pensi & DM Pak Guru), InstaPic*
*NPC: Rian (Ketua Panitia Pensi), Ilustrator Asli, Pak Guru Informatika*

- [x] **T-3.2.1** `[DELEGATE]` Buat Struktur Narasi Lengkap Level 2 (`src/data/missions/mission2.ts`):
  - Rian panik di grup "Panitia Inti Pensi": desainer sakit, cetak poster 10 menit lagi, suruh comot gambar maskot rubah di Google/Pinterest tanpa izin.
  - Percabangan Opsi A: Comot gambar Pinterest tanpa izin $\rightarrow$ Snowball Buruk.
  - Percabangan Opsi B: Tolak comot & cari gambar gratis berlisensi Creative Commons (Freepik/Unsplash) $\rightarrow$ Snowball Baik.
  - Percabangan Opsi C: Menolak keras dengan ketus & usulkan poster polos $\rightarrow$ Snowball Parsial (Rian menggerutu).
  - Cabang Akhir Buruk: Poster diunggah ke InstaPic $\rightarrow$ Muncul postingan/komentar ilustrator asli melabrak SMA pencuri karya $\rightarrow$ Banjir komentar hujatan netizen $\rightarrow$ HP bergetar tiada henti $\rightarrow$ GAGAL (1 Bintang).
  - Cabang Akhir Baik: Poster diunggah dengan aset CC $\rightarrow$ Komentar apresiatif di InstaPic $\rightarrow$ Pensi aman tanpa tuntutan $\rightarrow$ BERHASIL (3 Bintang).
  - Cabang Akhir Parsial: Poster polos terbit $\rightarrow$ Hubungan tim tegang tapi aman hukum $\rightarrow$ BERHASIL PARSIAL (2 Bintang).
  - Debriefing Pak Guru Informatika & Kartu Rapor (UU Hak Cipta, istilah Copyright, Creative Commons, Plagiarisme).
- [x] **T-3.2.2** `[DELEGATE]` Bangun Fitur InstaPic untuk Kasus Poster Pensi:
  - Tampilan Feed InstaPic dengan postingan poster acara Pensi sekolah.
  - Tampilan feed alternatif: Postingan ilustrator asli yang memamerkan bukti karya curian disertai ratusan komentar pedas netizen.
  - Animasi getaran dan lonjakan notifikasi Instagram saat akun sekolah diamuk netizen.
- [x] **T-3.2.3** `[SEQUENTIAL]` Integrasi Alur Level 2:
  - Transisi antara grup panitia Chatter $\leftrightarrow$ InstaPic.
  - Eksekusi konsekuensi viral vs apresiatif.
  - Chat evaluasi Pak Guru dan pembukaan Rapor HAKI.
- [x] **T-3.2.4** `[SEQUENTIAL]` Testing & QC Skenario Level 2 (Jalur Opsi A, B, C dan kalkulasi bintang 1, 2, 3).

---

### 🛡️ Milestone 3.3: Level 3 - "Bercanda atau Menyakiti?" (Cyberbullying & Empati)
*Topik: Cyberbullying, Body Shaming, Bystander Effect, Fitur Report, Empati Digital*
*Aplikasi Terlibat: InstaPic (Postingan & Kolom Komentar), Chatter (DM Siska & Pak Guru)*
*NPC: Siska (Korban), Maya (Pelaku Bully), Teman Sebangku, Pak Guru Informatika*

- [x] **T-3.3.1** `[DELEGATE]` Buat Struktur Narasi Lengkap Level 3 (`src/data/missions/mission3.ts`):
  - Pemain melihat postingan selfie Siska di InstaPic dengan komentar body shaming dari Maya: *"Aslinya dekil, pakai filter apa nih mulus amat wkwk."*
  - Percabangan Opsi A/B: Ikut menertawakan ("Hahaha iya nih beda") atau scroll lewat diam saja (Bystander).
  - Percabangan Opsi C: Membalas komentar Maya di publik secara agresif ("Kalian jahat banget, stop body shaming!").
  - Percabangan Opsi D: Menekan tombol opsi pada komentar $\rightarrow$ Pilih "Laporkan Komentar" $\rightarrow$ Buka Chatter $\rightarrow$ Kirim DM penyemangat ke Siska secara privat.
  - Cabang Akhir Buruk: Transisi ke hari berikutnya $\rightarrow$ Wali kelas umumkan Siska sakit $\rightarrow$ Teman sebangku DM bahwa Siska depresi, trauma, dan ingin pindah sekolah $\rightarrow$ GAGAL (1 Bintang).
  - Cabang Akhir Parsial: Perang komentar panas di InstaPic $\rightarrow$ Notifikasi jebol $\rightarrow$ Jejak digital kelas kotor dan toxic meski Siska merasa dibela $\rightarrow$ BERHASIL PARSIAL (2 Bintang).
  - Cabang Akhir Sempurna: Komentar Maya dihapus otomatis oleh sistem $\rightarrow$ Siska membalas DM Chatter: *"Makasih banyak ya, tadi aku hampir mau hapus akun... aku jadi agak tenangan"* $\rightarrow$ Korban terlindungi tanpa drama publik $\rightarrow$ BERHASIL SEMPURNA (3 Bintang).
  - Debriefing Pak Guru Informatika & Kartu Rapor (UU ITE Pencemaran Nama Baik/Penghinaan, Bystander Effect, Fitur Report).
- [x] **T-3.3.2** `[DELEGATE]` Pemutakhiran Komponen InstaPic Interaktif:
  - Menu titik tiga pada komentar Maya dengan opsi: "Laporkan Komentar" & "Balas Komentar".
  - Modal konfirmasi pelaporan perundungan siber (*Report Cyberbullying*).
  - Efek dinamis: Komentar langsung lenyap dengan status "Komentar disembunyikan karena melanggar pedoman komunitas".
- [x] **T-3.3.3** `[SEQUENTIAL]` Integrasi Alur Level 3:
  - Deteksi aksi: Dari InstaPic berpindah ke Chatter membuka kontak "Siska".
  - Pilihan dialog empati saat DM Siska.
  - Chat evaluasi Pak Guru dan penyerahan Rapor Empati Digital.
- [x] **T-3.3.4** `[SEQUENTIAL]` Testing & QC Skenario Level 3 (Jalur Opsi A/B, C, D dan kalkulasi bintang 1, 2, 3).

---

### 📦 Milestone 3.4: Level 4 - "Kurir Misterius" (Malware APK & Phishing Saldo)
*Topik: Malware, Trojan, Ekstensi File, Keamanan Data, Phishing*
*Aplikasi Terlibat: Chatter (DM Kurir Misterius & Pak Guru), Simulasi Notifikasi SMS & Saldo*
*NPC: Kurir Palsu (Penipu), Pak Guru Informatika*

- [x] **T-3.4.1** `[DELEGATE]` Buat Struktur Narasi Lengkap Level 4 (`src/data/missions/mission4.ts`):
  - Pesan masuk di Chatter dari nomor tak dikenal (tanpa PP): *"Halo kak, ini kurir. Ada paket COD tapi alamat kepotong. Tolong cek foto resinya di bawah ini benar atau tidak ya kak."*
  - Lampiran file: `Foto_Resi_Paket.APK` (berikon dokumen/android, bukan foto `.JPG`).
  - Percabangan Opsi A: Langsung klik/unduh file APK karena penasaran.
  - Percabangan Opsi B: Balas tanya kurir $\rightarrow$ Penipu membalas mengancam denda retur jika tidak segera dibuka $\rightarrow$ Pilihan unduh atau tolak/blokir.
  - Percabangan Opsi C: Jeda Kritis $\rightarrow$ Sadar ekstensi adalah `.APK` bukan `.JPG` $\rightarrow$ Pilih "Blokir & Laporkan Nomor".
  - Cabang Akhir Buruk: Layar HP glitch hebat $\rightarrow$ Notifikasi SMS masuk bertubi-tubi: *"Kode OTP e-Wallet Anda adalah 4812. JANGAN BERIKAN KE SIAPAPUN"* $\rightarrow$ Disusul SMS baru: *"Transfer berhasil. Saldo Rp 500.000 telah dikirim"* $\rightarrow$ Tabungan ludes tersadap malware $\rightarrow$ GAGAL (1 Bintang).
  - Cabang Akhir Baik: Nomor berhasil diblokir $\rightarrow$ Tidak ada file jahat terpasang $\rightarrow$ Sistem HP dan tabungan aman $\rightarrow$ BERHASIL (3 Bintang).
  - Debriefing Pak Guru Informatika & Kartu Rapor (UU ITE Pasal Akses Ilegal / Hacking, istilah Malware, Social Engineering, File Extension).
- [x] **T-3.4.2** `[DELEGATE]` Bangun Komponen Chat Lampiran File APK & Simulasi SMS Banner:
  - Gelembung khusus file lampiran di Chatter: Kartu dokumen dengan ekstensi `.APK` yang mencurigakan dan tombol unduh.
  - Komponen Simulasi Notifikasi SMS Masuk: Banner pesan SMS asli yang muncul di bagian atas layar ponsel dengan teks OTP dan notifikasi debet saldo.
- [x] **T-3.4.3** `[SEQUENTIAL]` Integrasi Alur Level 4:
  - Efek dramatis saat mengklik APK: Suara glitch, getaran layar, rentetan notifikasi SMS pencurian data.
  - Chat evaluasi Pak Guru dan penyerahan Rapor Keamanan Siber.
- [x] **T-3.4.4** `[SEQUENTIAL]` Testing & QC Skenario Level 4 (Jalur Opsi A, B, C dan kalkulasi bintang 1 & 3).

---

### 👣 Milestone 3.5: Level 5 - "Jejak yang Tertinggal" (Digital Footprint & Reputasi)
*Topik: Jejak Digital, Rekam Jejak Elektronik, Cancel Culture, Akuntabilitas*
*Aplikasi Terlibat: Chatter (DM Budi & Pak Guru), InstaPic (Postingan Bukti & Video Klarifikasi)*
*NPC: Budi (Calon Ketua OSIS), Kubu Lawan, Kepala Sekolah, Pak Guru Informatika*

- [x] **T-3.5.1** `[DELEGATE]` Buat Struktur Narasi Lengkap Level 5 (`src/data/missions/mission5.ts`):
  - Budi (sahabat pemain, Calon Ketua OSIS) chat panik di Chatter: kubu lawan baru saja memposting screenshot InstaPic Budi 3 tahun lalu saat ia mengejek guru dengan kata kasar. Pemilihan OSIS tinggal besok!
  - Percabangan Opsi A: Sarankan berbohong ("Udah, ngeles aja! Bilang di grup kalau akun lo waktu itu di-hack orang").
  - Percabangan Opsi B: Sarankan balas dendam ("Kita cari juga aib masa lalu lawan, kita viralin balik!").
  - Percabangan Opsi C: Sarankan ksatria & bertanggung jawab ("Jangan bohong. Lo harus bikin video klarifikasi, minta maaf terbuka, dan buktikan lo sudah lebih dewasa sekarang").
  - Cabang Akhir Buruk 1: Kubu lawan merilis bukti digital lanjutan membuktikan akun tidak pernah di-hack $\rightarrow$ Budi dicap pembohong dan didiskualifikasi tidak hormat oleh Kepala Sekolah $\rightarrow$ GAGAL (1 Bintang).
  - Cabang Akhir Buruk 2: Saling serang aib di medsos $\rightarrow$ InstaPic sekolah jadi medan toxic $\rightarrow$ Kepala Sekolah marah besar dan membekukan seluruh kegiatan OSIS $\rightarrow$ GAGAL (1 Bintang).
  - Cabang Akhir Baik: Budi mengunggah video permintaan maaf yang tulus di InstaPic $\rightarrow$ Warga sekolah dan guru menghargai kedewasaan & kejujurannya $\rightarrow$ Tetap diizinkan ikut pemilihan $\rightarrow$ BERHASIL (3 Bintang).
  - Debriefing Pak Guru Informatika & Kartu Rapor (UU ITE Rekam Jejak Elektronik, Digital Footprint, Cancel Culture, Accountability).
- [x] **T-3.5.2** `[DELEGATE]` Bangun Tampilan InstaPic Skandal OSIS & Klarifikasi:
  - Tampilan postingan kubu lawan dengan screenshot jejak digital masa lalu.
  - Tampilan postingan video klarifikasi Budi dengan komentar apresiasi kedewasaan.
- [x] **T-3.5.3** `[SEQUENTIAL]` Integrasi Alur Level 5 & Trigger Kelulusan Grand Finale:
  - Chat evaluasi Pak Guru dan penyerahan Rapor Jejak Digital.
  - Kalkulasi total bintang di seluruh 5 Misi (Jika 5 misi x 3 bintang = 15 bintang penuh, aktifkan status Duta Siber).
- [x] **T-3.5.4** `[SEQUENTIAL]` Testing & QC Skenario Level 5 (Jalur Opsi A, B, C dan kalkulasi bintang 1 & 3).

---

## 4. PHASE 4: FITUR PRODUK JADI — DASBOR GURU, SERTIFIKAT & AUTH [PARALLELIZABLE]

- [x] **T-4.1** `[PARALLELIZABLE]` Dasbor Guru & Manajemen Kelas (Sesuai `UI_FLOW-SimOS-DSI.md`):
  - Tampilan Tab 1: **Katalog Misi** (5 Kartu Misi lengkap dengan thumbnail, ringkasan topik DSI, indikator kesulitan, dan tombol "Mulai Proyeksikan").
  - Tampilan Tab 2: **Rekap Nilai Siswa** (Tabel data real-time: Nama Lengkap Siswa, Bintang per Misi 1-5, Total Bintang, Status Kelulusan Duta Siber).
  - Manajemen Kode Kelas: Tampilan kode kelas guru (misal `X-MIPA-1`) dengan tombol *1-Click Copy* untuk dibagikan ke siswa.
  - Tampilan *Empty State* yang ramah jika belum ada siswa bergabung.
- [x] **T-4.2** `[PARALLELIZABLE]` Mode Presentasi Proyektor Klasikal (Mode Guru):
  - Integrasi Fullscreen API: Klik "Mulai Proyeksikan" mengubah browser ke layar penuh dengan latar ambient gelap dan mockup iPhone di tengah.
  - Kontrol Zoom / Ukuran Teks agar keterbacaan sempurna dari bangku belakang kelas.
  - Tombol kontrol fasilitator: Pause/Play jeda teks dan tombol pemilihan opsi untuk mengakomodasi diskusi vokal kelas.
- [x] **T-4.3** `[PARALLELIZABLE]` Generator Sertifikat "Duta Siber" (HTML5 Canvas Client-Side):
  - Render sertifikat otomatis berbasis Canvas tanpa ketergantungan storage backend:
    - Desain sertifikat resmi bernuansa emas/biru institusional dengan watermark keamanan.
    - Judul: "SERTIFIKAT KELULUSAN DUTA SIBER".
    - Nama Lengkap Siswa (diambil dari profil autentikasi).
    - Nilai Sempurna: 15 / 15 Bintang di 5 Misi Dampak Sosial Informatika.
    - Tanggal penerbitan otomatis.
    - 5 Lencana Kompetensi: Cek Fakta, HAKI, Empati Siber, Keamanan Data, Jejak Digital.
  - Tombol unduh langsung dalam format gambar `.PNG` berkualitas tinggi.
- [x] **T-4.4** `[PARALLELIZABLE]` Autentikasi Siswa & Alur Lengkapi Profil:
  - Login Google OAuth / Email dengan Supabase.
  - Modal "Lengkapi Profil": Pemilihan peran Guru / Siswa.
  - Siswa wajib memasukkan `class_code` yang valid sebelum diarahkan ke Dasbor Misi.
  - Route Guarding: Siswa dicegah mengakses menu kelola kelas guru; profil tersimpan persisten.

---

## 5. PHASE 5: POLISHING, ACCESSIBILITY & QUALITY CONTROL [SEQUENTIAL]

- [x] **T-5.1** `[SEQUENTIAL]` Audit Tampilan & Ergonomi iOS Glassmorphism:
  - Verifikasi seluruh radius sudut (40px frame, 18px bubble, 22.5% ikon).
  - Konsistensi warna Apple iOS (Primary Blue `#007AFF`, WhatsApp Green `#25D366`, Warning `#FF9500`, Red `#FF3B30`).
  - Animasi transisi antar aplikasi (Home $\leftrightarrow$ Chatter $\leftrightarrow$ InstaPic $\leftrightarrow$ Browser).
- [x] **T-5.2** `[SEQUENTIAL]` Audit Performa & Kompresi Aset:
  - Pastikan semua avatar dan gambar mockup terkompresi optimal (format WebP/SVG).
  - Verifikasi First Contentful Paint (FCP) < 2 detik dan navigasi chat 60 FPS.
- [x] **T-5.3** `[SEQUENTIAL]` End-to-End Simulation QC (Seluruh 5 Level):
  - Eksekusi menyeluruh dari Login $\rightarrow$ Memilih Misi 1 s/d 5 $\rightarrow$ Semua opsi baik dan buruk $\rightarrow$ Rapor debriefing $\rightarrow$ Rekap di Dasbor Guru $\rightarrow$ Unduh Sertifikat Duta Siber.
- [x] **T-5.4** `[SEQUENTIAL]` Verifikasi Kode Akhir & Bebas Error:
  - Jalankan `tsc --noEmit` untuk memastikan 100% bebas dari error TypeScript.
  - Pastikan zero unhandled promise rejections atau warning console.

---

## 6. PHASE 6: DEPLOYMENT [BLOCKED - WAJIB MENUNGGU PERSETUJUAN USER]

> ⚠️ **ATURAN MUTLAK:** Fase ini **TIDAK BOLEH DIEKSEKUSI** sampai user melakukan QC menyeluruh dan secara eksplisit menyatakan: *"Semua revisi selesai, aplikasi sempurna"*.

- [ ] **T-6.1** `[SEQUENTIAL]` Build Production bundle (`npm run build`).
- [ ] **T-6.2** `[SEQUENTIAL]` Pengujian Smoke Test pada bundle build lokal.
- [ ] **T-6.3** `[SEQUENTIAL]` Deployment ke Production Vercel dan verifikasi koneksi Supabase Live.

---

## 📋 INSTRUKSI EKSEKUSI (AGEN UTAMA)
1. Setiap pengerjaan wajib merujuk secara presisi pada `docs/superpowers/specs/2026-10-10-simos-dsi-level-design.md`.
2. Seluruh 5 level wajib memiliki teks dialog, karakter NPC asli (Dina, Rian, Siska, Kurir, Budi, Pak Guru), dan kartu rapor hukum yang lengkap.
3. Tidak ada konten placeholder atau singkatan tiruan. Aplikasi harus menjadi produk jadi yang hidup dan imersif.
