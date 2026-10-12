# Design Specification: SimOS General System & Level 1 Interactive Redesign

- **Date**: 2026-10-12
- **Topic**: General SimOS Improvements (Sizing, Light Mode, Dynamic Navigation, Clue Chats) & Level 1 Gameplay Minigames (Forwarding Sheet, Fake Link Exploit, Safari Fact Checking)
- **Status**: Approved by User

---

## 1. Overview & Objectives

Dokumen ini mendefinisikan perubahan arsitektur menyeluruh pada antarmuka sistem operasi virtual (SimOS) serta perombakan mendalam pada alur skenario Level 1 (Literasi Hoax & Cek Fakta).

Tujuan utama:
1. Menghilangkan segala bug visual (seperti glitch dimensi bezel mengecil saat awal buka).
2. Menghadirkan perilaku OS yang realistis: default Light Mode, status bar adaptif, navigasi berbasis notifikasi vs icon app, dan badge unread yang dinamis.
3. Mengubah interaksi percakapan dari sekadar klik teks menjadi simulasi yang interaktif dengan *Forwarding Sheet minigame*, alur infeksi malware berbasis klik tautan, dan *Safari Fact-Checking search minigame*.
4. Memberikan petunjuk (*clues*) alami melalui chat sampingan teman sekelas yang bersifat *read-only*.
5. Menghilangkan pemaksaan visual opsi jawaban dengan menyediakan mekanisme *collapsible choice drawer*.

---

## 2. General SimOS Architecture & UI Improvements

### 2.1. Penanganan Glitch Ukuran Bezel Ponsel
- **Masalah**: Pada saat pertama kali membuka level, ponsel sempat mengecil sesaat lalu membesar kembali.
- **Penyebab**: Transisi skala pada `FullscreenLayout.tsx` dan kelas Tailwind `animate-in zoom-in` pada komponen `HomeApp.tsx`.
- **Solusi**:
  - Hapus kelas `zoom-in` pada komponen-komponen utama shell.
  - Kunci ukuran kontainer ponsel sejak render frame pertama menggunakan dimensi eksplisit yang stabil pada desktop (`w-full max-w-[375px] h-[812px]`) dan edge-to-edge pada mobile (`w-full h-[100dvh]`).

### 2.2. Default Light Mode & Status Bar Adaptif
- **Default Theme**: Ubah default state `isDarkMode` di `useSimOSStore` menjadi `false`.
- **Status Bar Adaptif**:
  - Di `HomeApp` (wallpaper warna gradien): teks jam & ikon berwarna putih dengan *subtle drop shadow*.
  - Di `ChatApp`, `BrowserApp`, `InstaPicApp`: teks jam & ikon berwarna gelap (`text-neutral-800`), dilengkapi latar belakang *semi-translucent frosted glass* (`bg-white/80 dark:bg-black/80 backdrop-blur-md`) dan garis pembatas halus (`border-b border-black/5 dark:border-white/10`) agar tidak menyatu buta dengan konten aplikasi di bawahnya.

### 2.3. Flow Peluncuran Game & Navigasi
- Saat level dimulai, SimOS selalu mendarat di **Home Screen**.
- Dalam 1 detik pertama, sistem memicu **Push Banner Notification** dari grup kelas:
  - Pengirim: `Grup Kelas X-MIPA 1`
  - Teks: `Dina (Ketua Kelas): PENGUMUMAN PENTING! Besok libur total...`
- **Perilaku Navigasi**:
  - **Jika Banner Notifikasi diklik**: Langsung membuka aplikasi Chatter dan membuka room chat `active` (Grup Kelas).
  - **Jika Ikon Chatter di Home diklik**: Membuka aplikasi Chatter dan menampilkan **List Chat (Hub)** terlebih dahulu.
  - Ikon Chatter di Home Screen menampilkan badge unread sesuai jumlah pesan baru yang belum dibaca (misal: badge `3` di awal level).

### 2.4. Dynamic Chat Contacts & Read-Only In-Game Clues
- `chatContacts` disaring secara dinamis berdasarkan level yang sedang aktif (`m1` s.d. `m5`).
- Untuk **Level 1**, daftar kontak terdiri dari:
  1. **Grup Kelas X-MIPA 1** (Main Story Room - Unread, highlight aktif).
  2. **Bimo (Teman Sebangku)** (Petunjuk 1):
     - Pesan: *"Bro, tautan dari Dina kok aneh ya? Belakangnya .blogspot.xyz bukan web sekolah sman1-official.sch.id..."*
  3. **Rara** (Petunjuk 2):
     - Pesan: *"Eh beneran besok libur? Masa mendadak banget, jangan-jangan hoax tuh..."*
  4. **OSIS SMAN 1** (Grup Ekskul)
  5. **Futsal SMAN 1** (Grup Ekskul)
  6. **Rohis Al-Kautsar** (Grup Ekskul)
- **Read-Only Clues**:
  - Jika pemain mengetuk Bimo atau Rara, aplikasi membuka obrolan mereka.
  - Kolom chat bagian bawah dinonaktifkan dengan placeholder: *"Obrolan ini hanya bisa dibaca (Petunjuk)"*.
  - Pemain dapat menekan tombol panah kembali (`ChevronLeft`) untuk kembali ke daftar chat.

### 2.5. Collapsible Choice Drawer
- Opsi jawaban tidak lagi menutupi layar chat secara permanen.
- Ketika tiba giliran pemain memilih:
  - Input bar di bagian bawah menampilkan status interaktif: *"💡 Ketuk untuk memilih respon... (3 pilihan)"* dengan ikon ekspansi.
  - Jika diketuk, drawer pilihan jawaban akan meluncur naik (*slide-up sheet*).
  - Terdapat tombol *minimize* / *collapse* agar pemain dapat menutup drawer sewaktu-waktu untuk membaca ulang riwayat obrolan di atas.

---

## 3. Level 1 Interactive Redesign (Branching & Minigames)

### 3.1. Alur Awal (Intro)
- Pesan masuk dari Dina di Grup Kelas membagikan info libur mendadak beserta tautan `http://info-diknas-sekolah.blogspot.xyz/libur-mendadak`.
- Dina meminta bantuan menyebarkan ke grup-grup ekskul.
- Muncul 3 pilihan sikap:
  1. Opsi 1: *"Wah asik libur! Langsung forward pesan Dina ke semua grup ekskul."* (Jalur Fatal)
  2. Opsi 2: *"Din, serius ini? Dapat info dari mana? Tautannya kok blogspot aneh ya?"* (Jalur Klarifikasi)
  3. Opsi 3: *"Tunggu Din, jangan disebar dulu! Aku mau buka Browser cek website resmi sekolah dulu."* (Jalur Cek Fakta)

---

### 3.2. Cabang 1: Opsi 1 (Minigame Forwarding & Malware Exploit)
1. **Fase 1: Konfirmasi di Grup Kelas**:
   - Pemain mengirim pesan di grup kelas bahwa dia akan membantu menyebarkan ke semua grup ekskul.
2. **Fase 2: Forwarding Sheet Minigame**:
   - Muncul modal / bottom-sheet bertajuk *"Teruskan Pesan"* ala WhatsApp.
   - Menampilkan daftar grup:
     - `[ ] OSIS SMAN 1`
     - `[ ] Futsal SMAN 1`
     - `[ ] Rohis Al-Kautsar`
     - `[ ] Paskibra SMAN 1`
   - Pemain harus mencentang minimal 3 grup lalu menekan tombol *"Kirim ke X Grup"*.
   - Muncul efek suara pesan terkirim dan toast sukses terkirim.
3. **Fase 3: Tantangan Verifikasi Teman Ekskul**:
   - Pemain menerima pesan dari grup ekskul (misal: *Edo (Kapten Futsal)*):
     *"Bro ini beneran libur? Coba lo klik dulu linknya, bener gak isinya dari dinas? Soalnya turnamen futsal besok!"*
   - Di obrolan muncul pesan berisi link blogspot tersebut.
   - Pemain mengklik tautan `http://info-diknas-sekolah.blogspot.xyz/libur-mendadak`.
4. **Fase 4: Malware Infection & Broadcast Spamming Animation**:
   - Begitu tautan diklik, terjadi efek peretasan: audio glitch, guncangan layar (*shake*), dan dialog eksploitasi skrip.
   - Muncul animasi *Broadcast Spamming*: layar menampilkan riwayat pengiriman otomatis pesan berantai spam ke seluruh kontak WhatsApp dalam hitungan detik.
5. **Fase 5: Eskalasi Protes & Debrief Guru**:
   - Pesan-pesan marah masuk: Edo, Sarah, dan Dina memprotes akun pemain yang menyebarkan link jebakan pencuri akun Google.
   - Pak Guru Informatika masuk dan memberikan evaluasi kesalahan.
   - Transisi ke *Mission Review Dashboard* (Status: GAGAL / 1 Bintang).

---

### 3.3. Cabang 2: Opsi 3 (Minigame Penelusuran Safari & Cek Fakta)
1. **Fase 1: Komitmen Cek Fakta**:
   - Pemain mengingatkan grup kelas untuk menahan diri dan menyatakan akan mengecek portal resmi sekolah.
2. **Fase 2: Navigasi Mandiri ke Browser**:
   - Muncul instruksi di Dynamic Island / banner: *"Buka Browser Safari dari Home Screen untuk memeriksa pengumuman resmi sekolah."*
   - Pemain menekan tombol Home atau App Switcher dan membuka **Safari**.
3. **Fase 3: Minigame Search Engine di Safari**:
   - Safari menampilkan portal mesin pencari sekolah (*SimSearch*).
   - Pemain dapat mengetikkan kata kunci atau memilih saran pencarian:
     - *"Pengumuman Libur SMAN 1"*
     - *"Surat Edaran Sidak Kebersihan Dinas"*
     - *"Kalender Akademik SMAN 1"*
   - Hasil pencarian menampilkan:
     - Hasil 1 (Resmi): `sman1-official.sch.id/pengumuman-klarifikasi-hoax` — **Portal Resmi SMAN 1 (Terverifikasi Kemdikbud)**
     - Hasil 2 (Resmi): `sman1-official.sch.id/kalender-akademik` — **Jadwal KBM Aktif**
     - Hasil 3 (Abal-abal): `info-diknas-sekolah.blogspot.xyz` — **Blog Gratisan Tanpa Verifikasi**
   - Pemain membuka Hasil 1.
   - Halaman portal sekolah menampilkan spanduk merah tegas:
     *"PENGUMUMAN RESMI: KBM BERJALAN NORMAL, BERITA LIBUR TOTAL ADALAH HOAX & MALWARE!"*
   - Pemain menekan tombol interaktif: **"📸 Ambil Screenshot Bukti Resmi"**.
   - Notifikasi mengonfirmasi screenshot tersimpan di galeri.
4. **Fase 4: Pelaporan Bukti di Chatter**:
   - Pemain kembali ke Chatter grup kelas.
   - Muncul tombol lampiran / opsi: *"Kirimkan Bukti Klarifikasi Resmi ke Grup Kelas"*.
   - Foto screenshot spanduk bantahan hoax terkirim ke dalam room chat.
   - Dina membalas dengan rasa syukur: *"Untung kamu cek! Aku tarik pesannya sekarang!"*.
   - Pak Guru Informatika memberikan apresiasi atas penerapan Jeda Kritis (*Critical Thinking Pause*).
   - Transisi ke *Mission Review Dashboard* (Status: BERHASIL SEMPURNA / 3 Bintang).

---

### 3.4. Cabang 3: Opsi 2 (Klarifikasi Dina)
- Dina ragu dan menjelaskan bahwa ia hanya meneruskan dari kakak kelas alumni.
- Percabangan menawarkan 2 opsi lanjutan:
  - Opsi A: *"Yaudah kalau dari kakak kelas pasti bener, aku bantu forward ya."* ➔ Mengalir ke **Cabang 1 (Minigame Forwarding)**.
  - Opsi B: *"Jangan mudah percaya Din, ayo kita cek ke website resmi SMAN 1 sekarang."* ➔ Mengalir ke **Cabang 2 (Safari Fact-Checking)**.

---

## 4. Testing & Verification Plan

1. **Visual Stability**: Memastikan saat membuka `/app/play/m1`, frame bezel langsung kokoh tanpa jumping atau zooming.
2. **Theme Check**: Memverifikasi OS default Light Mode, status bar teks gelap dengan background frosted glass, dan status bar di home screen berwarna putih.
3. **Navigation Check**:
   - Membuka Chatter dari Home ➔ Masuk ke Chat List.
   - Mengetuk Banner ➔ Langsung masuk ke Grup Kelas.
4. **Clues Check**: Membuka chat Bimo dan Rara, memastikan pesan petunjuk tampil, input terkunci read-only, dan tombol kembali berfungsi.
5. **Choice Drawer Check**: Memastikan opsi jawaban bisa di-collapse dan dibuka kembali dengan mengetuk kolom input.
6. **Gameplay Branch 1 Check**: Menjalankan alur Opsi 1, memilih minimal 3 grup di Forward Sheet, mengklik link di grup futsal, menyaksikan animasi broadcast spamming, hingga debrief gagal.
7. **Gameplay Branch 2 Check**: Menjalankan alur Opsi 3, membuka Safari secara mandiri, melakukan pencarian, mengambil screenshot bukti, mengirim bukti ke grup kelas, hingga debrief sukses sempurna.
8. **Compilation Check**: Menjalankan `npx tsc -b` (0 error) dan `npm run build` (0 warning fatal).
