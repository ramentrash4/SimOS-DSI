# SimOS DSI - Level Design Document (LDD)

Dokumen ini berisi spesifikasi narasi, percabangan cerita, dan materi pembelajaran untuk setiap misi di dalam aplikasi SimOS DSI.

## Daftar Level (Library Misi)
1. **Level 1: "Pesan Berantai"** (Status: **Selesai Didesain**) - Topik: Literasi Hoax & Cek Fakta
2. **Level 2: "Poster Pensi"** (Status: **Selesai Didesain**) - Topik: HAKI & Plagiarisme
3. **Level 3: "Bercanda atau Menyakiti?"** (Status: **Selesai Didesain**) - Topik: Cyberbullying & Empati
4. **Level 4: "Kurir Misterius"** (Status: **Selesai Didesain**) - Topik: Keamanan Data & Phishing
5. **Level 5: "Jejak yang Tertinggal"** (Status: **Selesai Didesain**) - Topik: Jejak Digital / Digital Footprint

---

## 📖 Detail Desain: Level 1 - "Pesan Berantai"
- **Topik Utama:** Hoax, Social Engineering, Malware (Phishing).
- **Aplikasi yang Digunakan:** Chatter (WA), Browser.
- **Karakter NPC:** Dina (Ketua Kelas), Pak Guru Informatika.

### Skenario & Percabangan (Flowchart)
**Awal Misi:** 
Dina (Ketua Kelas) mengirim pesan *forward* di grup Chatter: 
*"PENGUMUMAN PENTING! 🚨 Teman-teman, besok kita LIBUR TOTAL karena tiba-tiba ada sidak kebersihan dan penyemprotan massal dari Dinas. Tolong bantu sebar ke grup ekskul ya!"*
(Disertai tautan mencurigakan: `http://info-diknas-sekolah.blogspot.xyz/libur-mendadak`)

**Percabangan 1:**
- **[Opsi A]** "Wah asik libur!" -> Tekan tombol *Forward* ke grup lain. 
  *(Lanjut ke Akhir Buruk).*
- **[Opsi B]** "Din, serius ini? Dapat info dari mana?" 
  *(Dina membalas: "Aku cuma di-forward dari kakak kelas. Harusnya bener kan?". Pemain kembali diberi opsi untuk Forward [Opsi A] atau Cek Browser [Opsi C]).*
- **[Opsi C]** Keluar dari Chatter -> Buka Browser -> Ketik pencarian.
  *(Lanjut ke Akhir Baik).*

### Akhir Cerita (Snowball Consequences)
**Akhir Buruk (Kena Hack):**
Layar HP *glitch*. Aplikasi Chatter bergerak sendiri mengirimkan *spam link* iklan ke semua kontak. Muncul banyak notifikasi dari teman yang marah. Status: **GAGAL**.

**Akhir Baik (Pahlawan Kelas):**
Di *Browser*, pemain menemukan spanduk merah di web sekolah resmi: "Berita Libur adalah HOAX". Pemain kembali ke Chatter dan membalas Dina. Dina menghapus pesan. Status: **BERHASIL**.

### Layar Debriefing & Teori (Gabungan Chat & Kartu)
Setelah mencapai salah satu akhir cerita, muncul *chat* pribadi dari **Pak Guru Informatika** di Chatter:
- *Jika Gagal:* "Bapak lihat akunmu mengirim spam. Ini akibat menekan link aneh (Malware/Social Engineering)."
- *Jika Berhasil:* "Bagus, jeda kritis dan kebiasaan cek fakta telah mencegah hoax di kelas."

Pak Guru mengirimkan *file attachment*. Jika diklik, layar meredup dan memunculkan **Kartu Ringkasan (Rapor)** berisi:
1. **Status:** GAGAL / BERHASIL.
2. **Istilah Kunci:** Phishing, Malware, Hoax.
3. **Dasar Hukum:** UU ITE Pasal 28 (Penyebaran Berita Bohong).
4. **Pesan Moral:** *Think Before You Click*.

---

## 📖 Detail Desain: Level 2 - "Poster Pensi"
- **Topik Utama:** Hak Kekayaan Intelektual (HAKI), Plagiarisme, Lisensi Gambar.
- **Aplikasi yang Digunakan:** Chatter (WA), InstaPic (IG).
- **Karakter NPC:** Rian (Ketua Panitia Pensi), Pak Guru Informatika.

### Skenario & Percabangan (Flowchart)
**Awal Misi:**
Di grup Chatter "Panitia Inti Pensi", Rian mengirim pesan panik:
*"Gawat! Desainer kita sakit. File poster harus dikirim ke percetakan SEKARANG JUGA. Tolong cari gambar 'Maskot Rubah' di Google atau Pinterest, langsung comot aja terus tempelin teks. Cepat ya, 10 menit lagi ditunggu!"*

**Percabangan 1:**
- **[Opsi A]** "Oke, aku nemu gambar bagus di Pinterest, aku save dan pakai ya!" -> *(Lanjut ke Akhir Buruk).*
- **[Opsi B]** "Itu bahaya kena copyright. Aku cari gambar gratis yang ada lisensi Creative Commons (Freepik/Unsplash) aja ya, biar aman." -> *(Lanjut ke Akhir Baik).*
- **[Opsi C]** "Nggak mau! Itu pencurian. Mending poster kita polos aja daripada maling karya orang!" -> *(Lanjut ke Akhir Baik dengan Rian ngomel).*

### Akhir Cerita (Snowball Consequences)
**Akhir Buruk (Viral Dihujat):**
Poster diunggah ke *InstaPic*. Layar bergetar dipenuhi notifikasi. Seorang ilustrator membuat postingan: *"SMA X terang-terangan nyolong karya berbayar saya untuk promosi acara!"*. Ratusan netizen palsu menghujat di kolom komentar InstaPic sekolah. Reputasi sekolah hancur. Status: **GAGAL**.

**Akhir Baik (Aman & Legal):**
Poster diunggah menggunakan aset *Creative Commons* (atau polos). Komentar audiens di InstaPic positif. Acara berjalan lancar tanpa drama hukum. Status: **BERHASIL**.

### Layar Debriefing & Teori (Gabungan Chat & Kartu)
*Chat* dari **Pak Guru Informatika** di Chatter:
- *Jika Gagal:* "Bapak lihat keramaian di media sosial tentang poster pensi kita. Mengambil gambar dari internet tanpa melihat lisensi adalah pelanggaran Hak Cipta yang serius."
- *Jika Berhasil:* "Bapak dengar kamu bersikeras menggunakan aset gratis berlisensi. Keputusan bagus, etika digital dan menghargai karya orang lain itu wajib."

**Kartu Ringkasan (Rapor):**
1. **Status:** GAGAL / BERHASIL.
2. **Istilah Kunci:** Copyright, Creative Commons, Plagiarisme.
3. **Dasar Hukum:** UU Hak Cipta (Pencurian kekayaan intelektual untuk tujuan komersial/publikasi).
4. **Pesan Moral:** *Karya orang lain bukan barang gratisan di internet.*

---

## 📖 Detail Desain: Level 3 - "Bercanda atau Menyakiti?"
- **Topik Utama:** Cyberbullying, Body Shaming, Bystander Effect, Empati Digital.
- **Aplikasi yang Digunakan:** InstaPic (IG), Chatter (WA).
- **Karakter NPC:** Siska (Korban), Maya (Pelaku/Bully), Pak Guru Informatika.

### Skenario & Percabangan (Flowchart)
**Awal Misi:**
Pemain sedang membuka beranda *InstaPic*. Terdapat postingan foto *selfie* Siska. Di kolom komentar, Maya dan gengnya menulis ejekan (*body shaming*): *"Aslinya dekil, pakai filter apa nih mulus amat wkwk."*

**Percabangan 1 (Reaksi Pemain):**
- **[Opsi A / B - Ikut-ikutan / Bystander]** "Hahaha iya nih beda banget." atau mengabaikan (scroll lewat). -> *(Lanjut ke Akhir Buruk).*
- **[Opsi C - Pembelaan Publik]** Membalas komentar Maya: "Kalian jahat banget, stop body shaming!" -> *(Lanjut ke Akhir Parsial).*
- **[Opsi D - Empati & Report]** Menggunakan fitur *Report* pada komentar Maya, lalu mengirim DM pribadi via Chatter ke Siska untuk menyemangati. -> *(Lanjut ke Akhir Sempurna).*

### Akhir Cerita (Snowball Consequences)
**Akhir Buruk (Korban Depresi):**
Transisi ke hari berikutnya. Di Chatter Grup Kelas, Wali Kelas mengumumkan Siska sakit. Teman sebangku Siska DM pemain: *"Siska nangis terus dari semalam, trauma dan minta pindah sekolah."* Pemain dihantui rasa bersalah. Status: **GAGAL (Rendah Empati)**.

**Akhir Parsial (Perang Komentar):**
Terjadi adu mulut panjang antara pemain dan kelompok Maya. Notifikasi InstaPic jebol. Jejak digital kelas menjadi kotor, meski Siska merasa dibela. Status: **BERHASIL PARSIAL**.

**Akhir Sempurna (Pahlawan Empati):**
Komentar Maya dihapus oleh sistem. Siska membalas DM pemain: *"Makasih banyak ya, aku tadi hampir mau hapus akun. Aku jadi agak tenangan."* Korban terselamatkan secara mental tanpa memicu keributan publik. Status: **BERHASIL SEMPURNA**.

### Layar Debriefing & Teori (Gabungan Chat & Kartu)
*Chat* dari **Pak Guru Informatika** di Chatter:
- *Jika Gagal:* "Bapak membaca kejadian di akun Siska. Menjadi penonton yang diam (*Bystander*) saat temanmu dibully sama buruknya dengan ikut membully."
- *Jika Berhasil (Opsi D):* "Bapak bangga padamu. Menggunakan fitur Report dan memberi dukungan moral secara privat adalah langkah paling bijak."

**Kartu Ringkasan (Rapor):**
1. **Status:** GAGAL / BERHASIL.
2. **Istilah Kunci:** Cyberbullying, Body Shaming, Bystander Effect, Fitur Report.
3. **Dasar Hukum:** UU ITE (Penghinaan & Pencemaran Nama Baik).
4. **Pesan Moral:** *Ketikamu bisa menjadi pisau atau perisai bagi mental orang lain.*

---

## 📖 Detail Desain: Level 4 - "Kurir Misterius"
- **Topik Utama:** Malware, Phishing, Social Engineering, Keamanan Data.
- **Aplikasi yang Digunakan:** Chatter (WA).
- **Karakter NPC:** Kurir (Penipu), Pak Guru Informatika.

### Skenario & Percabangan (Flowchart)
**Awal Misi:**
Ada *chat* masuk dari nomor tak dikenal di aplikasi Chatter (tanpa foto profil). 
*"Halo kak, ini kurir. Ada paket COD tapi alamatnya kepotong. Tolong cek foto resinya di bawah ini benar atau tidak ya kak."* 
Di bawah pesan itu, terdapat *file* lampiran bernama: `Foto_Resi_Paket.APK`.

**Percabangan 1 (Reaksi Pemain):**
- **[Opsi A - Impulsif]** Menekan *file* tersebut karena penasaran ada paket. -> *(Lanjut ke Akhir Buruk).*
- **[Opsi B - Polos]** Membalas pesan untuk bertanya. Penipu membalas dengan ancaman denda retur. Pemain kembali dihadapkan pilihan (Unduh atau Tolak).
- **[Opsi C - Jeda Kritis]** Melihat ekstensi `.APK` dan menyadari itu adalah aplikasi jahat, bukan foto asli (`.JPG`). Memilih "Blokir Nomor". -> *(Lanjut ke Akhir Baik).*

### Akhir Cerita (Snowball Consequences)
**Akhir Buruk (Pengurasan Saldo):**
HP mengalami *glitch* hebat. Masuk rentetan notifikasi SMS: *"Kode OTP e-Wallet Anda adalah 4812. JANGAN BERIKAN KE SIAPAPUN"*. Tak lama disusul SMS baru: *"Transfer berhasil. Saldo Rp 500.000 telah dikirim."* Tabungan pemain ludes seketika akibat *malware* penyadap. Status: **GAGAL**.

**Akhir Baik (Tameng Siber):**
Nomor berhasil diblokir. Tidak ada *file* jahat yang terpasang, sistem HP aman. Status: **BERHASIL**.

### Layar Debriefing & Teori (Gabungan Chat & Kartu)
*Chat* dari **Pak Guru Informatika**:
- *Jika Gagal:* "Bapak dapat laporan saldomu terkuras. File berekstensi .APK adalah sebuah aplikasi pencuri data (Malware), bukan dokumen foto."
- *Jika Berhasil:* "Kerja bagus. Kejelian melihat jenis ekstensi file adalah pertahanan utama dalam keamanan siber."

**Kartu Ringkasan (Rapor):**
1. **Status:** GAGAL / BERHASIL.
2. **Istilah Kunci:** Malware, Phishing, Social Engineering, File Extension.
3. **Dasar Hukum:** UU ITE (Akses Ilegal ke Perangkat Komputer / Hacking).
4. **Pesan Moral:** *Jangan sembarang instal aplikasi dari luar sumber resmi.*

---

## 📖 Detail Desain: Level 5 - "Jejak yang Tertinggal"
- **Topik Utama:** Digital Footprint (Jejak Digital), Cancel Culture, Reputasi Digital.
- **Aplikasi yang Digunakan:** Chatter (WA), InstaPic (IG).
- **Karakter NPC:** Budi (Calon Ketua OSIS), Pak Guru Informatika.

### Skenario & Percabangan (Flowchart)
**Awal Misi:**
Di *Chatter*, Budi (teman dekat pemain) menge-chat dengan panik:
*"Gawat! Kubu lawan baru aja nge-post screenshot dari akun InstaPic gue 3 tahun lalu. Waktu itu gue pernah nulis status yang menghina guru pakai kata-kata kasar. Gimana nih, pemilihan OSIS tinggal besok?!"*

**Percabangan 1 (Strategi Krisis):**
- **[Opsi A - Berbohong]** "Udah, ngeles aja! Bilang di grup kalau akun lo waktu itu di-hack orang." -> *(Lanjut ke Akhir Buruk 1).*
- **[Opsi B - Balas Dendam]** "Jangan mau kalah! Kita ubek-ubek juga sosmed kubu lawan, pasti mereka punya aib masa lalu. Kita viralin balik!" -> *(Lanjut ke Akhir Buruk 2).*
- **[Opsi C - Bertanggung Jawab]** "Jangan bohong. Lo harus bikin video klarifikasi, minta maaf terbuka, dan buktikan kalau lo yang sekarang sudah lebih dewasa." -> *(Lanjut ke Akhir Baik).*

### Akhir Cerita (Snowball Consequences)
**Akhir Buruk 1 (Kebohongan Terbongkar):**
Kubu lawan merilis bukti digital lain yang membuktikan Budi tidak di-*hack*. Budi dicap sebagai pembohong dan didiskualifikasi secara tidak hormat oleh Kepala Sekolah. Status: **GAGAL**.

**Akhir Buruk 2 (Perang Toksik):**
Pemain dan Budi memviralkan aib lawan. *InstaPic* sekolah berubah jadi medan perang saling hujat. Kepala Sekolah marah besar dan membekukan seluruh kegiatan OSIS tahun itu. Status: **GAGAL**.

**Akhir Baik (Pendewasaan):**
Budi mem-posting video permintaan maaf yang tulus. Meski masih ada yang menyindir, mayoritas guru dan siswa menghargai kejujurannya. Budi tetap diizinkan ikut pemilihan. Status: **BERHASIL**.

### Layar Debriefing & Teori (Gabungan Chat & Kartu)
*Chat* dari **Pak Guru Informatika**:
- *Jika Gagal:* "Bapak sangat kecewa. Jejak digital buruk di masa lalu tidak seharusnya ditutupi dengan kebohongan baru atau balas dendam."
- *Jika Berhasil:* "Bapak menghargai saranmu ke Budi. Mengakui kesalahan masa lalu butuh keberanian. Ingat, internet tidak pernah lupa."

**Kartu Ringkasan (Rapor):**
1. **Status:** GAGAL / BERHASIL.
2. **Istilah Kunci:** Digital Footprint, Cancel Culture, Accountability.
3. **Dasar Hukum:** UU ITE (Rekam Jejak Elektronik).
4. **Pesan Moral:** *Internet tidak pernah lupa. Jadilah versi dirimu yang lebih baik hari ini.*
