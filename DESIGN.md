# 🎨 DESIGN SYSTEM (LINTER)
**Project:** SimOS DSI
**Theme:** iOS Glassmorphism (SimOS) + Minimalist Enterprise (Dashboard)

> **⚠️ PERHATIAN UNTUK AI (IMPECCABLE LINTER):**
> File ini adalah *Source of Truth* (Sumber Kebenaran) untuk semua token UI. 
> Saat melakukan *coding* komponen, **DILARANG** menggunakan nilai Tailwind sembarangan yang melenceng dari spesifikasi di bawah ini!

---

## 1. TYPOGRAPHY (FONT)

Kita menggunakan perpaduan *font* modern yang identik dengan ekosistem Apple (San Francisco) untuk SimOS, dan font teknis untuk Dasbor.

*   **Primary Font (SimOS & UI):** `Inter` (sebagai pengganti San Francisco di web).
    *   *Tailwind Class:* `font-sans`
*   **Monospace (Kode Kelas):** `JetBrains Mono` atau `Geist Mono`.
    *   *Tailwind Class:* `font-mono`

**Hirarki Ukuran (Strict):**
*   **H1 (Judul Layar iOS):** `text-3xl font-bold tracking-tight`
*   **H2 (Nama Misi):** `text-xl font-semibold`
*   **Body (Teks Chat):** `text-base font-normal leading-relaxed`
*   **Micro (Jam/Baterai iOS):** `text-[11px] font-medium tracking-wider`

---

## 2. COLOR PALETTE (TOKEN)

Dilarang keras memakai warna Tailwind lain di luar token ini tanpa persetujuan.

### Dasar Aplikasi (SimOS iOS Mode)
*   **Background (Light):** `#F2F2F7` (`bg-gray-100`)
*   **Surface (Card/Modal):** `#FFFFFF` (`bg-white`)
*   **Text (Primary):** `#000000` (`text-black`)
*   **Text (Secondary/Muted):** `#8E8E93` (`text-gray-400`)

### Identitas Aplikasi (App Colors)
*   **Primary (Action/iOS Blue):** `#007AFF` (`bg-blue-500` / `text-blue-500`)
*   **Chatter (WhatsApp Green):** `#25D366` (Gunakan di *Bubble Chat* pemain)
*   **Chatter (NPC Bubble):** `#FFFFFF` (Teks Hitam)
*   **InstaPic (Brand Gradient):** `bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500`
*   **Browser (Search Bar):** `#E3E3E8` (`bg-gray-200`)

### State Colors (Feedback)
*   **Success:** `#34C759` (`bg-green-500`)
*   **Warning/Glitch:** `#FF9500` (`bg-orange-500`)
*   **Destructive/Error:** `#FF3B30` (`bg-red-500`)

---

## 3. SHAPES & BORDERS (GEOMETRI)

Apple iOS memiliki lengkungan yang sangat spesifik (bukan sekadar `rounded-md`).

*   **Radius SimOS Container (Layar HP):** `40px` (`rounded-[40px]`)
*   **Radius App Icon:** `22.5%` dari lebar ikon (Gunakan `rounded-2xl` untuk ikon `w-14 h-14`).
*   **Radius Chat Bubble:** `18px` (`rounded-[18px]`) dengan sudut tajam di bagian ujung asal pesan.
*   **Radius Dashboard Card (shadcn):** `12px` (`rounded-xl`)
*   **Border Width (Stroke):** `1px` (`border`) untuk semua pembatas tipis.
*   **Border Color:** `#E5E5EA` (`border-gray-200`)

---

## 4. EFFECTS & GLASSMORPHISM

Efek transparan (kaca buram) adalah nyawa dari iOS.

*   **Bottom Dock & Top Navbar iOS:**
    *   *Tailwind:* `bg-white/70 backdrop-blur-md border-b border-gray-200/50`
*   **Shadow (Elevasi Ringan iOS):**
    *   *Tailwind:* `shadow-[0_2px_10px_rgba(0,0,0,0.05)]`
*   **Shadow (SimOS Container Mode Guru):**
    *   *Tailwind:* `shadow-2xl shadow-black/20`

---

## 5. MICRO-INTERACTIONS (ANIMATION)

Semua animasi wajib terasa *smooth*, cepat, dan tidak kaku.

*   **Button Click/Tap:** `active:scale-95 transition-transform duration-100`
*   **Chat Bubble Muncul:** `animate-in slide-in-from-bottom-2 fade-in duration-300 ease-out`
*   **Push Notification Banner:** `animate-in slide-in-from-top-4 fade-in duration-400 ease-spring`
*   **Snowball Effect (Screen Shake):** Gunakan *custom keyframes* `shake` di `tailwind.config.js` (durasi 500ms).

---
*(Dokumen ini akan dibaca secara otomatis oleh AI Koder sebagai pedoman mutlak)*
