# Virtual iOS Phone, Replika Aplikasi & Anti-Collision Event Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun ulang sistem operasi virtual SimOS agar bertransformasi menjadi smartphone iOS nyata (App Switcher 3D, Dynamic Island, Notification Center, Control Center, Gestur Alami), melengkapi replika aplikasi (Chatter multi-room, InstaPic stories/feed, Safari URL/tabs, Messages SMS), dan mengeliminasi tabrakan obrolan dengan Atomic Step Queue Engine.

**Architecture:** Mengisolasi logika status ponsel di `simos.ts` dengan dukungan stack aplikasi terbuka (`openApps`), modal sistem iOS (*Control Center, Notification Center, App Switcher*), dan gestur terpadu di `SimOSShell.tsx`. Mengamankan mesin obrolan di `chat.ts` dengan kunci `activeSessionId` dan `isProcessingStep` agar proses asinkron tidak pernah tumpang tindih. Setiap aplikasi (Chatter, InstaPic, Safari, Messages) dibuat memiliki arsitektur navigasi mandiri dengan preservasi state.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Zustand, Web Audio API, Vite.

## Global Constraints
- Mematuhi pedoman iOS glassmorphism (Inter font, backdrop-blur-md, sudut rounded-2xl s/d rounded-[50px]).
- Menjaga kepatuhan kurikulum Informatika Fase E dan alur 5 level (`docs/superpowers/specs/2026-10-10-simos-dsi-level-design.md`).
- Bebas error TypeScript (`tsc -b` harus selalu exit 0).
- Tidak ada data/komponen placeholder; semua aplikasi harus memiliki konten interaktif yang hidup.
- Fase 6 (Deployment) tetap terkunci sampai persetujuan eksplisit user.

---

### Task 1: Atomic Step Queue Engine & Session Lock di Obrolan

**Files:**
- Modify: `src/store/chat.ts`
- Modify: `src/App.tsx:20-41`
- Test: Verifikasi via `npx tsc -b` dan pengujian klik cepat di chat

**Interfaces:**
- Produces: `useChatStore` dengan `activeSessionId: number`, `isProcessingStep: boolean`, pembatalan proses lama saat ganti misi, dan debounce pilihan.

- [x] **Step 1: Modifikasi `src/store/chat.ts` dengan `activeSessionId` dan mutex `isProcessingStep`**
  - Tambahkan properti `activeSessionId: number` dan `isProcessingStep: boolean` ke `ChatState`.
  - Di `startMission`, generate `sessionId = Date.now()`, set `activeSessionId: sessionId`, `isProcessingStep: false`, dan reset semua state.
  - Di `advanceNode`, cek apakah `sessionId !== get().activeSessionId`. Jika berbeda, batalkan eksekusi segera.
  - Kunci `isProcessingStep = true` selama penundaan mengetik dan render pesan, lalu buka kunci setelahnya.
  - Di `chooseOption`, kunci tombol seketika saat diklik pertama kali.

- [x] **Step 2: Pasang single-mount guard di `src/App.tsx` (`PlayMission`)**
  - Gunakan `useRef<string | null>(null)` untuk melacak `lastMissionIdRef`.
  - Pastikan `startMission()` hanya dieksekusi saat `missionId` benar-benar berubah, mencegah pemanggilan ganda dari React StrictMode.

- [x] **Step 3: Jalankan verifikasi tipe TypeScript**
  - Perintah: `npx tsc -b`
  - Ekspektasi: Exit code 0.

---

### Task 2: Modul iOS Control Center & Integrasi Audio SFX

**Files:**
- Create: `src/features/simos/components/ControlCenterModal.tsx`
- Modify: `src/store/simos.ts`
- Test: Verifikasi buka/tutup Control Center dan toggle audio

**Interfaces:**
- Consumes: `useSimOSStore` (`isMuted`, `toggleMute`)
- Produces: `isControlCenterOpen: boolean`, `setControlCenterOpen: (open: boolean) => void`, `isDarkMode: boolean`, `toggleDarkMode: () => void`.

- [x] **Step 1: Perbarui `src/store/simos.ts` untuk mendukung Control Center & Mode Gelap**
  - Tambahkan properti `isControlCenterOpen: boolean` dan `isDarkMode: boolean`.
  - Tambahkan aksi `setControlCenterOpen` dan `toggleDarkMode`.

- [x] **Step 2: Buat komponen `ControlCenterModal.tsx`**
  - Desain panel kaca buram *frosted glass* (`bg-black/60 backdrop-blur-xl border border-white/10`).
  * Grid modul khas iOS:
    * Modul Konektivitas: Tombol interaktif WiFi, Bluetooth, Mode Pesawat, Data Seluler.
    * Modul Audio: Slider/toggle volume SFX terhubung ke `sfx` audio synthesizer.
    * Modul Tampilan: Toggle Dark Mode dan brightness slider visual.
    * Modul Pintasan: Senter virtual dan kalkulator/catatan.
  - Tombol tutup atau gestur geser ke atas.

- [x] **Step 3: Jalankan verifikasi kompilasi**
  - Perintah: `npx tsc -b`
  - Ekspektasi: Exit code 0.

---

### Task 3: Dynamic Island Interaktif & iOS Notification Center

**Files:**
- Create: `src/features/simos/components/NotificationCenterModal.tsx`
- Modify: `src/features/simos/components/SimOSShell.tsx`
- Modify: `src/store/simos.ts`
- Test: Trigger notifikasi push dan buka Notification Center

**Interfaces:**
- Produces: `notificationsHistory: PushBanner[]`, `addNotificationHistory: (banner: PushBanner) => void`, `clearNotifications: () => void`, `isNotificationCenterOpen: boolean`.

- [x] **Step 1: Tambahkan riwayat notifikasi ke `src/store/simos.ts`**
  - Buat state `notifications: PushBanner[]` dan boolean `isNotificationCenterOpen`.
  - Setiap kali `showBanner()` dipanggil, masukkan juga ke `notifications`.

- [x] **Step 2: Buat komponen `NotificationCenterModal.tsx`**
  - Lembar geser turun dari atas dengan tanggal/jam besar khas iOS.
  - Daftar kartu notifikasi berkelompok (Chatter, InstaPic, Messages) dengan tombol "Bersihkan Semua".
  - Mengetuk kartu langsung membuka aplikasi bersangkutan dan menutup modal.

- [x] **Step 3: Tingkatkan Dynamic Island di `SimOSShell.tsx`**
  - Animasi Dynamic Island yang membesar (*expand*) saat `activeBanner` ada, menampilkan ikon aplikasi dan cuplikan pesan dengan transisi halus.

---

### Task 4: App Switcher / Multitasking Card Carousel 3D

**Files:**
- Create: `src/features/simos/components/AppSwitcher.tsx`
- Modify: `src/store/simos.ts`
- Test: Navigasi App Switcher, swipe horizontal, switch app, kill app

**Interfaces:**
- Consumes: `openApps: AppName[]`, `currentApp: AppName`
- Produces: `isAppSwitcherOpen: boolean`, `setAppSwitcherOpen: (open: boolean) => void`, `closeApp: (app: AppName) => void`.

- [x] **Step 1: Tambahkan multi-app stack ke `src/store/simos.ts`**
  - Tambahkan array `openApps: AppName[]` default `['home', 'chat']`.
  - Saat `openApp(name)` dipanggil, jika aplikasi belum ada di `openApps`, tambahkan ke dalam array.
  - Tambahkan aksi `closeApp(name)` untuk menghapus aplikasi dari `openApps`.

- [x] **Step 2: Buat komponen `AppSwitcher.tsx`**
  - Carousel horizontal 3D kartu aplikasi dengan nama dan ikon di atas kartu.
  - Kartu aktif terangkat di tengah, kartu lainnya melengkung di samping.
  - Menggeser kartu ke atas (*swipe up*) memicu animasi keluar dan menghapus dari `openApps`.
  - Mengetuk kartu membuka aplikasi tersebut dan menutup App Switcher.

---

### Task 5: Upgrade Chatter (WhatsApp): Chats Hub & Multi-Room Chats

**Files:**
- Modify: `src/features/simos/components/ChatApp.tsx`
- Modify: `src/types/mission.ts`
- Test: Navigasi Chats Hub -> Chat Room -> `< Chats` kembali ke Hub

**Interfaces:**
- Produces: Tampilan `activeRoomId: string | null` di dalam Chatter. Jika null, tampilkan **Chats Hub** (Daftar Percakapan). Jika terisi, tampilkan **Chat Room**.

- [x] **Step 1: Buat UI Chats Hub di `ChatApp.tsx`**
  - Header iOS: Teks "Edit", judul besar "Chats", dan ikon kamera/tulis pesan.
  - Bilah pencarian obrolan "Search".
  - Daftar percakapan realistis:
    * Grup Kelas X-1 (32 anggota)
    * Dina Ananda (Pesan berantai hoaks)
    * Rian (Sie Acara Pensi)
    * Siska (Curhat & dukungan moral)
    * Kurir J&T Express (+62 821-xxxx)
    * Budi Santoso (Ketua OSIS)
  - Setiap kontak memiliki foto profil, pratinjau pesan terakhir, waktu, dan badge unread hijau jika ada pesan baru.

- [x] **Step 2: Integrasikan Chat Room dengan tombol `< Chats (unread)`**
  - Saat kontak diklik, masuk ke obrolan kontak tersebut.
  - Tombol kiri atas mengembalikan pemain ke Chats Hub tanpa me-reset riwayat chat.

---

### Task 6: Upgrade InstaPic (Instagram): Stories Bar, Feed Multi-Post & Moderasi

**Files:**
- Modify: `src/features/simos/components/InstaPicApp.tsx`
- Test: Scroll feed, klik like hati, buka stories, buka komentar, buka report modal

- [x] **Step 1: Bangun Stories Bar di pucuk InstaPic**
  - Deretan lingkaran avatar dengan gradien cerita Instagram (Cerita Saya, Dina, Rian, Siska, Lambe SMAN 1).
  - Mengetuk lingkaran membuka modal pratinjau cerita foto selama 3 detik.

- [x] **Step 2: Buat Feed Multi-Post yang Beragam**
  - Postingan 1: Akun resmi OSIS / Pensi SMAN 1 (Level 2).
  - Postingan 2: Foto kegiatan pramuka / olahraga siswa (postingan organik).
  - Postingan 3: Foto kasual Siska dengan kolom komentar beracun dan tombol report (Level 3).
  - Postingan 4: Video klarifikasi / postingan akun gosip Lambe SMAN 1 (Level 5).

- [x] **Step 3: Tambahkan Animasi Like & Modal Laporan Komentar**
  - Double tap atau klik ikon hati memicu animasi pop hati merah dan menambah hitungan suka.
  - Lembar komentar dengan opsi 3-titik untuk melaporkan komentar negatif ke tim keamanan siber sekolah.

---

### Task 7: Upgrade Safari Browser: Address Bar, Tab Manager & Portal Cek Fakta

**Files:**
- Modify: `src/features/simos/components/BrowserApp.tsx`
- Test: Ganti tab, input URL bar, buka portal resmi sekolah

- [x] **Step 1: Pasang Address Bar Interaktif**
  - Bilah atas dengan ikon gembok SSL HTTPS, input URL, dan tombol reload.
  - Mengetik atau memilih pintasan cepat (Portal Sekolah, Cek Fakta Mafindo, Google Image).

- [x] **Step 2: Pasang Tab Switcher Safari**
  - Tombol tab di pojok kanan bawah memunculkan kisi-kisi tab yang terbuka (Portal Sekolah vs Mesin Pencarian vs Blog Edukasi).

- [x] **Step 3: Perkaya Portal Resmi SMAN 1 Merdeka**
  - Tampilan portal sekolah otentik dengan logo resmi, navigasi agenda, dan pengumuman *Red Alert* menyangkal hoaks libur 3 hari.

---

### Task 8: Aplikasi Pesan Mandiri (Messages / SMS App)

**Files:**
- Create: `src/features/simos/components/MessagesApp.tsx`
- Modify: `src/store/simos.ts`
- Modify: `src/features/simos/components/HomeApp.tsx`
- Test: Buka Messages dari Home atau dock, baca SMS OTP dan debit bank

- [x] **Step 1: Daftarkan aplikasi `'messages'` ke `AppName` di `src/store/simos.ts`**
  - Tambahkan `'messages'` ke tipe union `AppName`.

- [x] **Step 2: Buat komponen `MessagesApp.tsx`**
  - Tampilan aplikasi SMS bawaan iOS berwarna hijau.
  - Daftar percakapan SMS:
    * Bank Merdeka (+14045): "Transaksi debit Rp 2.500.000 berhasil."
    * Layanan OTP (+62 811): "JANGAN BERIKAN KODE INI KEPADA SIAPAPUN. Kode OTP Anda: 849201."
    * Operator Seluler: Peringatan keamanan akun.
  - Tampilan obrolan gelembung biru/abu-abu khas iOS iMessage.

- [x] **Step 3: Pasang ikon Messages di Layar Utama (`HomeApp.tsx`) dan Dock Bawah**

---

### Task 9: Perakitan Sistem Shell & Gestur Alami di `SimOSShell.tsx`

**Files:**
- Modify: `src/features/simos/components/SimOSShell.tsx`
- Modify: `src/features/simos/components/HomeApp.tsx`
- Test: Uji alur lengkap interaksi iOS: Home, App Switcher, Control Center, Notifikasi, Back

- [x] **Step 1: Pasang komponen modal ke dalam `SimOSShell.tsx`**
  - Masukkan `ControlCenterModal`, `NotificationCenterModal`, `AppSwitcher`, dan rute aplikasi `messages`.

- [x] **Step 2: Pasang gestur interaktif**
  - Geser Home Bar ke atas (atau klik tombol tab) memicu `setAppSwitcherOpen(true)`.
  - Klik sudut kiri atas / jam memicu `setNotificationCenterOpen(true)`.
  - Klik sudut kanan atas memicu `setControlCenterOpen(true)`.

- [x] **Step 3: Verifikasi kompilasi dan build**
  - Jalankan `npx tsc -b`.
  - Jalankan `npm run build`.

---

### Task 10: Penyelarasan Seluruh 5 Misi & Verifikasi Akhir

**Files:**
- Modify: `src/data/missions/mission1.ts`
- Modify: `src/data/missions/mission2.ts`
- Modify: `src/data/missions/mission3.ts`
- Modify: `src/data/missions/mission4.ts`
- Modify: `src/data/missions/mission5.ts`
- Test: Jalankan kelima misi dari Level 1 hingga Level 5 secara utuh

- [x] **Step 1: Sesuaikan pemicu aksi antar aplikasi di skrip misi**
  - Pastikan notifikasi push memicu kemunculan di Dynamic Island dan Notification Center.
  - Pastikan Level 4 mengarahkan interaksi SMS ke aplikasi Messages secara elegan.

- [x] **Step 2: Verifikasi Bebas Tabrakan Obrolan**
  - Uji Level 1 s/d Level 5 dengan berpindah aplikasi saat teks sedang mengetik.
  - Konfirmasi tidak ada pesan dobel atau teks yang bertabrakan.

- [x] **Step 3: Verifikasi Akhir & Laporan Kesiapan QC**
  - Jalankan `npx tsc -b` dan pastikan 0 error.
  - Jalankan `npm run build` dan pastikan build bundle sukses.
