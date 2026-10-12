# SimOS DSI - Game Edukasi Dampak Sosial Informatika

## 1. Ringkasan Eksekutif
SimOS DSI adalah aplikasi edukasi interaktif berbasis peran (*Roleplay*) yang dikemas dalam bentuk "OS / HP Virtual". Aplikasi ini dirancang khusus untuk materi Dampak Sosial Informatika (DSI) Fase E (Kelas 10) Kurikulum Merdeka. Tujuannya adalah menjembatani kesenjangan antara teori dan perilaku asli siswa di dunia maya dengan melatih "Jeda Kritis" (berpikir sebelum bertindak) dan "Empati Digital".

## 2. Fondasi Pedagogi & Kurikulum
- **Target Kompetensi:** Melatih refleks empati dan kewaspadaan siber, bukan sekadar hafalan teori.
- **Topik Utama yang Dicakup:**
  1. Keamanan Data Pribadi & Jejak Digital (*Phishing, Scam*).
  2. Etika Komunikasi & Interaksi Sosial (*Cyberbullying, Hoax*).
  3. Hak Kekayaan Intelektual (Plagiarisme, Lisensi Karya).
- **Mode Pembelajaran Klasikal:** Aplikasi mendukung pembelajaran lewat proyektor kelas. Guru bertindak sebagai moderator, dan kelas berdiskusi secara vokal (angkat tangan) untuk menentukan pilihan (*Choice*) yang akan diambil di layar proyektor, mengatasi kendala infrastruktur gawai siswa.

## 3. Mekanik Narasi & Permainan (Game Design)
- **Struktur Progresi (Mission Hub):** Permainan dibagi menjadi beberapa "Misi Lepas" (Skenario) yang berdiri sendiri. Ini memungkinkan guru memilih misi yang relevan dengan RPP hari itu.
- **Efek Bola Salju (Snowball Consequence):** 
  - Tidak ada sistem *Game Over* instan (Sistem Benar/Salah).
  - Pilihan yang buruk akan memicu percabangan narasi di mana situasi menjadi semakin kacau (contoh: ditegur pencipta karya, memicu drama viral, hingga perangkat terkena virus maya).
  - Setelah narasi selesai, layar "Debriefing/Evaluasi" akan muncul untuk menjelaskan teori DSI terkait dan menunjukkan dampak dari pilihan kelas/siswa.

## 4. Arsitektur UI/UX (Ekosistem SimOS)
Layar permainan menyimulasikan antarmuka *smartphone* modern dengan aplikasi fiktif:
1. **Mission Center (Agen DSI):** Hub utama untuk memilih misi dan melihat evaluasi akhir.
2. **Chatter:** Parodi aplikasi pesan (WhatsApp) untuk interaksi personal, penyebaran *hoax* via grup, dan *social engineering*.
3. **VibeCheck / InstaPic:** Parodi media sosial (Instagram/X) untuk melihat dampak publik, *cyberbullying*, dan jejak digital.
4. **Browser:** Aplikasi simulasi *browser* untuk memfasilitasi riset mandiri dan "Cek Fakta" berita di dalam game.
- **Tampilan Skalabel:** UI dirancang responsif. Jika dimainkan di proyektor kelas, elemen teks akan membesar (Mode Guru) agar terbaca dari kursi belakang.

## 5. Dasbor Guru (Teacher Ecosystem)
- Guru tidak dibebani kewajiban merangkai cerita *branching* yang rumit secara mandiri.
- Aplikasi menyediakan **Library Misi** (*default scenarios*) berkualitas tinggi buatan developer yang mencakup topik-topik DSI.
- Tugas utama guru di Web Dasbor adalah:
  1. Meluncurkan misi ke layar proyektor (Present Mode).
  2. (Opsional) Mengirim kode misi ke HP siswa jika kelas mendukung pemakaian HP individu.

## 6. Arsitektur Teknis & Stack
- **Frontend / Klien:** React (Progressive Web App / React Native for Web) menggunakan Vite/Next.js. Ini memastikan aplikasi bisa diakses via URL di laptop guru (untuk proyektor) sekaligus bisa diunduh sebagai aplikasi seluler di HP siswa (PWA).
- **Backend & Database:** Supabase (PostgreSQL, Authentication, Row Level Security).
- **Data Model (Garis Besar):**
  - `Missions`: Data skenario, ID awal percabangan.
  - `Story_Nodes`: Kotak dialog, aplikasi tujuan (Chatter/IG), pilihan ganda, dan pointer ke node berikutnya (Logika Efek Bola Salju).
  - `Classrooms` & `Progress`: Menyimpan rekam jejak penyelesaian kelas.

## 6. Mekanika Tambahan (UX, Gamifikasi & Autentikasi)
Berdasarkan pendalaman konsep, game ini dilengkapi fitur operasional berikut:
1. **Pacing Teks Dinamis:** Pesan masuk secara otomatis (real-time) dengan jeda yang disesuaikan berdasarkan panjang teks (menyimulasikan "sedang mengetik") untuk menjaga keterbacaan di proyektor.
2. **Audio & Haptic Visual:** SFX notifikasi yang realistis (Ting/Pop). Saat konsekuensi buruk terjadi, terdapat *screen shake* (layar bergetar) dan SFX *glitch/error* yang dramatis untuk efek kejut.
3. **Sistem Penilaian (Gamifikasi):** Menggunakan **Sistem Bintang (1-3 Bintang)** per level/misi. Gagal mendapat 0/1 bintang, Berhasil Parsial 2 bintang, dan Berhasil Sempurna 3 bintang.
4. **Autentikasi Siswa:** Untuk mode tugas individu di rumah, login siswa menggunakan integrasi resmi (Email/Google Auth) demi integritas data akademik dan mencegah akun anonim palsu.
5. **Mekanik Browser (Cek Fakta):** Tidak menggunakan pengetikan bebas (*free typing*) untuk menghindari *bug*. Menggunakan sistem "Teka-teki Riwayat Pencarian" (*Auto-complete puzzle*) di mana pemain harus mengklik kata kunci pencarian yang paling tepat dari opsi yang disediakan.
6. **Aksesibilitas Visual:** Mempertahankan UI standar (*native-look*) agar tetap imersif. (Guru menggunakan *zoom* peramban jika dirasa ukuran teks kurang besar di proyektor).
7. **Penghargaan Pamungkas (Reward):** Siswa yang berhasil mendapatkan 3 Bintang di seluruh misi akan membuka (*unlock*) sebuah gambar Sertifikat / *Badge* "Duta Siber" yang memuat nama mereka secara otomatis (siap unduh/share).

## 7. Rencana Minimum Viable Product (MVP)
1. Aplikasi frontend web yang responsif dengan *frame* SimOS.
2. Integrasi 3 aplikasi *dummy* di dalamnya: Mission Center, Chatter, VibeCheck, ditambah Browser.
3. Skenario Misi *default* yang didesain secara bercabang. (Catatan: Untuk detail skenario, percabangan cerita, dan desain tiap level, silakan merujuk pada dokumen terpisah: `2026-10-10-simos-dsi-level-design.md`).
4. Fitur presentasi untuk guru di kelas (klik navigasi klasikal).
