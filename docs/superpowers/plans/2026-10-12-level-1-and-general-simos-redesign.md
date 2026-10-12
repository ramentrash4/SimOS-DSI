# SimOS General System & Level 1 Interactive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghadirkan pembaruan sistemik SimOS (penghapusan visual glitch, default Light Mode, status bar adaptif, navigasi dinamis, petunjuk chat sampingan, collapsible choice drawer) dan perombakan interaktif Level 1 dengan minigames Forwarding Sheet, eksploitasi malware nyata, serta Safari Fact-Checking search engine.

**Architecture:** 
- State SimOS diperluas di `simos.ts` dan `chat.ts` untuk mengelola default Light Mode, unread badges dinamis, kontak berprogres per level, dan status screenshot bukti.
- `SimOSShell.tsx` dan `HomeApp.tsx` distabilkan dengan menghapus animasi scale zoom yang memicu glitch visual, serta status bar dibuat adaptif terhadap aplikasi yang aktif.
- `ChatApp.tsx` dilengkapi dengan *Chats Hub* berbasis level, penampil obrolan petunjuk *read-only*, drawer pilihan respon yang dapat di-collapse, komponen modal *Forward Message*, dan animasi *Broadcast Spamming*.
- `BrowserApp.tsx` ditransformasi menghadirkan mesin pencari interaktif (*SimSearch*) dengan kata kunci, perbandingan domain, dan tombol tangkap bukti resmi.
- `mission1.ts` diperbarui dengan simpul dialog yang saling terhubung mulus dengan minigames baru.

**Tech Stack:** React 19, TypeScript, TailwindCSS, Zustand, Lucide React, Vite.

## Global Constraints
- Tetap menjaga kompatibilitas responsif: edge-to-edge di mobile viewport (`< 640px`) dan iPhone frame elegan di desktop (`>= 640px`).
- Seluruh tipe data TypeScript harus valid dan lulus `npx tsc -b` dengan 0 error.
- Seluruh aset dan komponen harus ter-bundle bersih pada `npm run build`.

---

### Task 1: SimOS Store & Shell Stabilization (Theme, Glitch Fix, Adaptive Status Bar)

**Files:**
- Modify: `src/store/simos.ts`
- Modify: `src/features/simos/components/SimOSShell.tsx`
- Modify: `src/features/simos/components/HomeApp.tsx`
- Modify: `src/components/layouts/FullscreenLayout.tsx`

**Interfaces:**
- Consumes: `useSimOSStore`, `useChatStore`
- Produces: `isDarkMode: false` by default, `activeContactId: string | null`, adaptive status bar styling based on `currentApp`

- [ ] **Step 1: Update SimOS store defaults and state**
  - Set `isDarkMode: false` by default.
  - Tambahkan `activeContactId: string | null` dan aksi `setActiveContactId(id: string | null)`.
  - Tambahkan `hasProofScreenshot: boolean` dan aksi `setHasProofScreenshot(status: boolean)`.

- [ ] **Step 2: Fix bezel sizing glitch and zoom transitions**
  - Di `HomeApp.tsx`, hapus kelas `zoom-in` dari container root:
    ganti `animate-in fade-in zoom-in duration-300` menjadi `animate-in fade-in duration-200`.
  - Di `FullscreenLayout.tsx`, pastikan pembungkus `<Outlet />` tidak mengalami transisi loncat saat inisialisasi.
  - Di `SimOSShell.tsx`, pastikan kontainer langsung mengunci dimensi stabil tanpa animasi delay.

- [ ] **Step 3: Implement Adaptive Status Bar**
  - Di `SimOSShell.tsx`, buat status bar mendeteksi `currentApp`:
    - Jika `currentApp === 'home'`: teks putih, drop-shadow, tanpa border bawah.
    - Jika `currentApp !== 'home'`: teks `text-neutral-800 dark:text-neutral-100`, background `bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md`, dan pembatas halus `border-b border-black/5 dark:border-white/10`.

- [ ] **Step 4: Verify typecheck & visual stability**
  - Jalankan `npx tsc -b` untuk memastikan tidak ada kesalahan tipe.

---

### Task 2: Dynamic Chat Contacts, Read-Only Clues & Collapsible Choice Drawer in ChatApp

**Files:**
- Modify: `src/features/simos/components/ChatApp.tsx`
- Modify: `src/types/mission.ts`

**Interfaces:**
- Consumes: `script.id`, `useChatStore.choices`, `useSimOSStore.activeContactId`
- Produces: Dynamic level-filtered contact lists, read-only chat view for clue contacts (Bimo, Rara), collapsible choice drawer

- [ ] **Step 1: Filter Chat Contacts per Level**
  - Di `ChatApp.tsx`, buat helper `getContactsForLevel(missionId: string)`:
    - Di `m1`: Grup Kelas X-MIPA 1 (main story), Bimo (Teman Sebangku - Clue), Rara (Clue), Grup OSIS SMAN 1, Grup Futsal SMAN 1, Grup Rohis Al-Kautsar.
    - Sembunyikan kontak dari level 2-5 (Rian, Kurir, Siska, Budi) dari Level 1.

- [ ] **Step 2: Implement Read-Only Clue Chat Rooms**
  - Saat kontak Bimo atau Rara diklik di list chat:
    - Buka view obrolan kontak tersebut dengan pesan dialog petunjuk yang relevan.
    - Kolom input bawah menampilkan state terkunci: *"Obrolan ini hanya bisa dibaca (Petunjuk)"* dengan tombol disabled.
    - Tombol `ChevronLeft` di header kembali ke List Chat Hub tanpa memicu reset alur utama.

- [ ] **Step 3: Implement Collapsible Choice Drawer**
  - Ganti tampilan pilihan jawaban yang menutupi chat secara kaku.
  - Ketika `choices` tersedia:
    - Di kolom input bawah, tampilkan tombol pemicu: *"💡 Ketuk untuk memilih jawaban... (X pilihan)"* dengan ikon `ChevronUp`.
    - Saat ditekan, buka drawer choices meluncur naik (*slide-up sheet*) dengan tombol *minimize / sembunyikan* (`ChevronDown`).
    - Saat opsi diklik, panggil `chooseOption(index)` dan otomatis sembunyikan drawer.

- [ ] **Step 4: Update Home Screen Badges & Push Notification Action**
  - Di `HomeApp.tsx`, pastikan badge pada ikon Chatter mencerminkan jumlah unread dinamis.
  - Klik ikon Chatter ➔ Buka Chatter dalam mode List Chat (`isViewingHub: true`).
  - Klik banner Dynamic Island / Push Notif ➔ Buka Chatter langsung ke Room Chat aktif (`isViewingHub: false`).

---

### Task 3: Interactive Forwarding Sheet Minigame & Broadcast Spamming Animation

**Files:**
- Create: `src/features/simos/components/ForwardMessageModal.tsx`
- Create: `src/features/simos/components/SpamBroadcastAnimation.tsx`
- Modify: `src/features/simos/components/ChatApp.tsx`
- Modify: `src/data/missions/mission1.ts`

**Interfaces:**
- Consumes: `ForwardMessageModalProps`, `SpamBroadcastAnimationProps`
- Produces: Interactive forward multi-select sheet, realistic malware spam broadcast overlay

- [ ] **Step 1: Build `ForwardMessageModal.tsx`**
  - Modal bergaya WhatsApp sheet:
    - Header: "Teruskan ke..." dengan tombol batal dan kirim.
    - Daftar checkbox grup: OSIS SMAN 1, Futsal SMAN 1, Rohis Al-Kautsar, Paskibra SMAN 1.
    - Indikator: minimal centang 3 grup.
    - Tombol "Kirim Pesan" dengan animasi loading sesaat dan sfx kirim.

- [ ] **Step 2: Build `SpamBroadcastAnimation.tsx`**
  - Komponen animasi overlay ketika link malware diklik:
    - Glitch audio & visual header: "⚠️ PERINGATAN: KONTROL PERANGKAT DIAMBIL ALIH".
    - Animasi daftar broadcast cepat yang menampilkan bubble chat terkirim secara liar ke 10+ kontak/grup dalam 2 detik.
    - Efek dramatis yang menggambarkan dampak nyata eksploitasi skrip phishing.

- [ ] **Step 3: Connect Forwarding & Malware Exploit to Mission 1 Script**
  - Di `mission1.ts`:
    - Simpul Opsi 1 membuka `ForwardMessageModal`.
    - Setelah selesai forward, masuk pesan dari Edo (Kapten Futsal) yang menantang: *"Coba klik linknya dulu bro, bener gak isinya dari dinas?"*.
    - Link blogspot muncul di chat sebagai link yang dapat diklik pemain.
    - Mengklik link memicu `SpamBroadcastAnimation`, disusul banjir komplain kontak dan debrief kegagalan Pak Guru.

---

### Task 4: Safari Fact-Checking Search Engine Minigame (SimSearch & Screenshot Bukti)

**Files:**
- Modify: `src/features/simos/components/BrowserApp.tsx`
- Modify: `src/data/missions/mission1.ts`
- Modify: `src/store/simos.ts`

**Interfaces:**
- Consumes: `hasProofScreenshot`, `setHasProofScreenshot`
- Produces: Interactive search engine view for Level 1, authentic news portal layout, screenshot capture button

- [ ] **Step 1: Build SimSearch Portal in `BrowserApp.tsx`**
  - Tampilan beranda mesin pencari untuk Level 1:
    - Logo SimSearch dan Search Input aktif.
    - Saran kata kunci yang dapat diklik: *"Pengumuman Libur SMAN 1"*, *"Surat Edaran Dinas Sidak"*, *"Cek Fakta Berita Libur"*.
    - Menampilkan 3 hasil pencarian yang realistis:
      1. `sman1-official.sch.id/klarifikasi-hoax-libur` (Resmi)
      2. `info-diknas-sekolah.blogspot.xyz/libur-mendadak` (Phishing abal-abal)
      3. `sman1-official.sch.id/kalender-akademik` (Jadwal resmi)

- [ ] **Step 2: Build Official School Article with "Ambil Screenshot Bukti"**
  - Halaman pengumuman resmi sekolah:
    - Header portal SMAN 1 berkop Kemdikbud.
    - Spanduk berita merah: "KLARIFIKASI RESMI: KBM BERJALAN NORMAL, BERITA LIBUR ADALAH HOAX".
    - Analisis kejanggalan domain blogspot.
    - Tombol interaktif: **"📸 Ambil Tangkapan Layar (Screenshot Bukti)"**.
    - Menekan tombol menyalakan state `hasProofScreenshot: true`, memutar sfx camera snap, dan memunculkan toast "Bukti tersimpan di memori!".

- [ ] **Step 3: Integrate Proof Delivery to Chatter**
  - Di `ChatApp.tsx`, jika `hasProofScreenshot` aktif dan pemain berada di alur cek fakta:
    - Muncul opsi mengirim lampiran gambar bukti screenshot ke grup kelas.
    - Foto bukti terkirim di chat, Dina membaca dan menarik pesan, dan Pak Guru memberikan apresiasi bintang 3 sempurna.

---

### Task 5: End-to-End Testing & Verification

**Files:**
- Verification only across: `src/store/simos.ts`, `src/features/simos/components/*`, `src/data/missions/mission1.ts`

- [ ] **Step 1: Run TypeScript compiler check**
  - Jalankan `npx tsc -b`. Pastikan 0 error.

- [ ] **Step 2: Run Vite production build check**
  - Jalankan `npm run build`. Pastikan output bundle bersih tanpa kegagalan.

- [ ] **Step 3: Test Gameplay Walkthrough Level 1**
  - Uji alur Cabang 1 (Forwarding Sheet ➔ Klik Link ➔ Spam Animation ➔ Debrief Gagal).
  - Uji alur Cabang 2 (Klarifikasi Dina ➔ Ajak Cek Browser).
  - Uji alur Cabang 3 (Safari SimSearch ➔ Ambil Screenshot ➔ Kirim Bukti ➔ Debrief Berhasil Sempurna).
  - Uji tampilan read-only clue contacts (Bimo & Rara).
  - Uji collapsible choice drawer.
