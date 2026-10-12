# Spesifikasi Desain: Virtual iOS Phone, Replika Aplikasi & Anti-Collision Event Engine

**Tanggal:** 2026-10-11  
**Status:** Approved by User  
**Target:** SimOS DSI (Roleplay Edukasi Empati & Etika Digital Fase E Kurikulum Merdeka)  

---

## 1. Latar Belakang & Tujuan (Context & Objectives)

Berdasarkan evaluasi terhadap implementasi awal, terdapat beberapa kelemahan kritis yang mengurangi nilai imersi dan stabilitas aplikasi:
1. **Virtual Phone terasa kaku & kurang otentik:** Mekanisme navigasi (kembali, ganti aplikasi, notifikasi, control panel) belum mencerminkan pengalaman ponsel cerdas iOS nyata.
2. **Aplikasi terasa seperti skrip terisolasi:** Chatter (WhatsApp) langsung memaksa masuk ke 1 ruang chat kaku tanpa memiliki halaman Daftar Percakapan (Chats List), InstaPic hanya menampilkan 1 postingan tanpa feed/stories, dan SMS belum menjadi aplikasi mandiri.
3. **Tabrakan Logika & Pesan Ganda:** Pada obrolan Chatter, pesan sering bertabrakan atau terkirim berulang kali akibat loop asinkron tanpa *cancellation token* / *mutex queue* saat terjadi re-render atau pergantian opsi cepat.

**Tujuan Redesain:**
* Membangun sistem operasi virtual berbasis **iOS Otentik** yang responsif dengan gestur alami (Home Bar, App Switcher Carousel 3D, Dynamic Island, Notification Center, dan Control Center).
* Mengubah setiap aplikasi menjadi **replika fungsional yang hidup** (Chatter memiliki daftar kontak dan multi-room chat, InstaPic memiliki stories/feed/like/comment, Safari memiliki URL bar dan tabs, Messages memiliki daftar SMS OTP).
* Menerapkan **Atomic Step Queue Engine** pada `chat.ts` dengan kunci `activeSessionId` dan `isProcessingStep` sehingga tabrakan pesan dan pengiriman ganda tereliminasi 100%.

---

## 2. Arsitektur Virtual iOS & Shell (`SimOSShell.tsx`)

### 2.1 Live Status Bar & Dynamic Island
* **Jam & Tanda Waktu:** Menampilkan waktu sistem aktif yang diperbarui secara dinamis. Mengetuk jam atau sudut kiri atas membuka **Notification Center**.
* **Dynamic Island:**
  * Dalam kondisi idle: Berbentuk pil hitam ramping dengan sensor kamera.
  * Saat ada notifikasi baru (pesan WhatsApp, SMS OTP, tag InstaPic): Beranimasi membesar (*expanded pill*) menampilkan ikon aplikasi, pengirim, dan teks cuplikan.
  * Dapat diketuk langsung untuk berpindah ke aplikasi yang memicu notifikasi.
* **Sudut Kanan Atas:** Menampilkan indikator sinyal seluler, WiFi, baterai, dan audio. Mengetuk sudut ini membuka **Control Center**.

### 2.2 Control Center (`ControlCenterModal.tsx`)
* Panel *frosted glass* kaca buram khas iOS yang meluncur turun dari sudut kanan atas.
* **Fitur interaktif:**
  * Modul Konektivitas: Toggle WiFi & Airplane Mode.
  * Modul Audio & SFX: Slider/toggle volume suara efek Web Audio API (Mute/Unmute real-time).
  * Modul Layar: Toggle Dark Mode SimOS & pengatur kecerahan virtual.
  * Tombol tutup cepat atau gestur geser ke atas.

### 2.3 Notification Center (`NotificationCenterModal.tsx`)
* Meluncur turun dari pucuk layar.
* Menampilkan tumpukan kartu notifikasi iOS yang dikelompokkan berdasarkan aplikasi (Chatter, InstaPic, Messages).
* Setiap kartu menampilkan stempel waktu relatif ("Baru saja", "2m yang lalu").
* Mengetuk kartu notifikasi langsung membuka aplikasi terkait dan menutup Notification Center.
* Tombol **"Bersihkan Semua"** untuk mengosongkan antrean riwayat notifikasi.

### 2.4 App Switcher / Multitasking Tabs (`AppSwitcher.tsx`)
* **Pemicu:** Menggeser Home Bar bawah ke atas (*swipe up & hold*) atau mengetuk ikon tab pintasan di bilah bawah.
* **Tampilan:** Carousel kartu horizontal 3D melengkung yang merepresentasikan aplikasi yang sedang aktif (`openApps`).
* **Interaksi:**
  * Geser horizontal kiri/kanan untuk memilih aplikasi.
  * Ketuk kartu untuk langsung masuk ke aplikasi tersebut dengan status tampilan terakhir yang terjaga (*persistent state*).
  * Geser kartu ke atas (*swipe up to dismiss*) untuk menutup aplikasi dari memori.
  * Ketuk latar belakang kosong untuk kembali ke aplikasi saat ini atau ke Home Screen.

### 2.5 Navigasi Universal & Swipe-to-Back
* **Home Indicator:** Garis pil putih di bagian bawah frame. Ketuk 1x untuk kembali ke Layar Utama (Home).
* **Back Interaction:**
  * Tombol navigasi panah kiri di header setiap aplikasi (`< Chats`, `< Feed`, `< Tab`).
  * Dukungan klik/geser dari tepi kiri frame untuk kembali ke halaman sebelumnya secara alami.

---

## 3. Replika Aplikasi Fungsional (Living App Ecosystem)

### 3.1 Chatter (WhatsApp Replica)
* **Daftar Obrolan (Chats Hub):**
  * Halaman utama obrolan menampilkan daftar room:
    1. *Grup Kelas X-1 (32 anggota)* — Diskusi kelas, pengumuman, dan perdebatan.
    2. *Dina Ananda* — Teman sebangku yang panik mengirim pesan hoaks (Level 1).
    3. *Rian (Sie Acara Pensi)* — Mendesak poster pensi (Level 2).
    4. *Siska* — Korban perundungan siber (Level 3).
    5. *Kurir J&T (+62 821-xxxx)* — Penipu pengirim paket .APK (Level 4).
    6. *Budi Santoso (Ketua OSIS)* — Klarifikasi video skandal (Level 5).
  * Badge hijau notifikasi pesan belum dibaca (*unread count badge*).
  * Filter pencarian kontak chat.
* **Ruang Obrolan (Chat Room):**
  * Navigasi kembali ke daftar chat menggunakan tombol `< Chats (unread)` khas iOS.
  * Indikator status lawan bicara ("online", "sedang mengetik...").
  * Kartu lampiran pesan: File `.APK`, tautan web, dan tombol buka Rapor Edukasi DSI.
  * Choices Bottom Drawer: Pilihan tindakan responsif yang tidak pernah menutupi pesan terakhir.

### 3.2 InstaPic (Instagram Replica)
* **Stories Bar:**
  * Deretan lingkaran avatar cerita teman-teman sekolah di bagian atas feed dengan gradien Instagram.
  * Dapat diketuk untuk membuka pratinjau cerita foto sementara.
* **Scrollable Feed:**
  * Berisi beberapa postingan foto siswa sekolah (foto pensi, kegiatan pramuka, foto kasual Siska, dan postingan akun gosip Lambe SMAN 1).
  * Tombol Love/Like dengan animasi hati melompat dan penghitung suka interaktif.
  * Lembar Komentar: Komentar realistis yang bisa di-scroll.
  * Fitur Moderasi: Tombol 3 titik di samping komentar beracun untuk membuka **Modal Laporkan Komentar** (*Pelecehan / Perundungan Siber / Ujaran Kebencian*).
* **Tab Bar Bawah:** Ikon Home, Search, New Post, Activity, dan Profile.

### 3.3 Safari (Web Browser Replica)
* **Header & Address Bar:**
  * Bilah pencarian dan URL dengan ikon gembok SSL HTTPS (`sman1merdeka.sch.id`).
  * Tombol Refresh dan tombol navigasi Back/Forward.
* **Tab Manager:**
  * Menampilkan tab yang sedang terbuka (Situs Resmi Sekolah, Portal Cek Fakta Mafindo/Kominfo, Pencarian Lisensi Creative Commons).
* **Konten Interaktif:**
  * Portal Resmi SMA Negeri 1 Merdeka dengan banner peringatan merah resmi: *"Klarifikasi: Informasi Libur 3 Hari Adalah Hoaks"*.
  * Hasil pencarian mesin telusur gambar bebas hak cipta.

### 3.4 Messages (Aplikasi SMS iOS)
* Aplikasi pesan SMS bawaan independen berikon hijau iOS.
* Berisi riwayat pesan teks resmi dari Bank dan Operator:
  * SMS OTP kode masuk verifikasi (Level 4).
  * SMS Notifikasi Debit: Pemotongan saldo rekening seketika saat malware aktif.
* Pemain dapat berpindah antara WhatsApp dan SMS menggunakan notifikasi Dynamic Island maupun App Switcher.

---

## 4. Atomic Step Queue Engine (Pencegahan Tabrakan Pesan)

### 4.1 Identifikasi Masalah & Akar Penyebab
* Obrolan sebelumnya mengeksekusi `setTimeout()` dan fungsi `advanceNode()` tanpa validasi sesi aktif.
* Jika terjadi multi-render atau pemain menekan tombol pilihan secara cepat, dua alur proses berjalan paralel di memori sehingga pesan terkirim ganda atau bertumpuk.

### 4.2 Solusi Teknis & State Mutex (`src/store/chat.ts`)
1. **`activeSessionId: number`:**
   * Setiap inisialisasi misi (`startMission`) membangkitkan ID sesi acak berbasis milidetik.
   * Setiap proses asinkron (`advanceNode`) memverifikasi apakah `activeSessionId` miliknya masih sama dengan state global. Jika berbeda, proses langsung dibatalkan (*early abort*).
2. **`isProcessingStep: boolean` (Mutex Lock):**
   * Mengunci eksekusi node baru sampai node saat ini selesai mengetik, merender teks, dan memutar audio SFX.
3. **Button Debounce & Freezing:**
   * Tombol pada *Choices Drawer* seketika didisable begitu diklik pertama kali, mencegah klik berulang (*spam click*).
4. **Single-Mount Guard di `PlayMission` (`src/App.tsx`):**
   * Menggunakan `useRef` untuk memastikan `startMission` hanya dipanggil tepat satu kali per pergantian parameter rute URL (`missionId`).

---

## 5. Rencana Pengujian & Kriteria Sukses (Verification & Success Criteria)

1. **Pengujian Fungsionalitas iOS:**
   * Menggeser/mengetuk Home Bar kembali ke Layar Utama tanpa kehilangan status aplikasi.
   * Membuka App Switcher, berpindah antar kartu aplikasi, dan menutup aplikasi dengan *swipe up*.
   * Membuka Notification Center dan Control Center dari status bar pucuk atas.
2. **Pengujian Replika Aplikasi:**
   * Chatter dapat membuka daftar obrolan multi-kontak dan masuk-keluar obrolan dengan tombol `< Chats`.
   * InstaPic menampilkan stories, feed multi-post, love animation, dan modal laporan komentar.
   * Safari menampilkan address bar, tab manager, dan portal sekolah resmi.
   * Messages menampilkan SMS OTP dan debit perbankan.
3. **Pengujian Stabilitas Pesan:**
   * Tidak ada pesan yang terkirim ganda atau teks yang bertabrakan meskipun pemain mengklik cepat atau berpindah-pindah aplikasi saat NPC sedang mengetik.
   * `tsc -b` dan `npm run build` berhasil 100% dengan 0 error.
