import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_full_rpp():
    doc = docx.Document()
    
    # Page setup - Margins 2.54 cm (1 inch)
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(1)
        s.bottom_margin = Inches(1)
        s.left_margin = Inches(1)
        s.right_margin = Inches(1)
        
        # Add Header & Footer
        footer = s.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        f_run = f_p.add_run("RPP Informatika Fase E - Dampak Sosial Informatika | Media: SimOS-DSI")
        f_run.font.name = "Calibri"
        f_run.font.size = Pt(8.5)
        f_run.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

    # Palette
    COLOR_PRIMARY = RGBColor(0x1E, 0x3A, 0x8A)     # Deep Navy
    COLOR_SECONDARY = RGBColor(0x0F, 0x17, 0x2A)   # Dark Slate
    COLOR_MUTED = RGBColor(0x47, 0x55, 0x69)       # Muted Slate
    COLOR_ACCENT = RGBColor(0x25, 0x63, 0xEB)      # Bright Blue

    # Helper functions
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:left w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideV w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def add_callout(text_list, title="CATATAN INTEGRASI MEDIA SimOS-DSI"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>'
            f'  <w:top w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'  <w:bottom w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        run_title = p.add_run(f"📌 {title}\n")
        run_title.bold = True
        run_title.font.name = "Calibri"
        run_title.font.size = Pt(10)
        run_title.font.color.rgb = COLOR_PRIMARY
        
        for t in text_list:
            p2 = cell.add_paragraph()
            p2.paragraph_format.space_before = Pt(1)
            p2.paragraph_format.space_after = Pt(2)
            p2.paragraph_format.line_spacing = 1.15
            run = p2.add_run(t)
            run.font.name = "Calibri"
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_before = Pt(0)
        p_sp.paragraph_format.space_after = Pt(4)

    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(15)
        run.font.color.rgb = COLOR_PRIMARY

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(12)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(11.5)
        run.font.color.rgb = COLOR_SECONDARY

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(12.5)
        run.font.color.rgb = COLOR_PRIMARY

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(11)
        run.font.color.rgb = COLOR_SECONDARY

    def add_p(text, bold_prefix=None, space_after=3):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10.5)
            r_pre.font.color.rgb = COLOR_SECONDARY
        r_txt = p.add_run(text)
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(10.5)
        r_txt.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.bold = True
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(10.5)
            r_pre.font.color.rgb = COLOR_SECONDARY
        r_txt = p.add_run(text)
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(10.5)
        r_txt.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    # -------------------------------------------------------------
    # COVER / HEADER
    # -------------------------------------------------------------
    add_title("RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR")
    add_subtitle("MATA PELAJARAN: INFORMATIKA - FASE E (KELAS X SMA)\nELEMEN: DAMPAK SOSIAL INFORMATIKA (DSI)\nBERBASIS MEDIA SIMULASI INTERAKTIF: SimOS-DSI (Munir Santri)")

    # -------------------------------------------------------------
    # A. IDENTITAS MODUL
    # -------------------------------------------------------------
    add_h1("A. INFORMASI UMUM & IDENTITAS MODUL")
    
    # Table for Identitas
    t_id = doc.add_table(rows=8, cols=2)
    t_id.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_id)
    
    col_widths = [Inches(2.2), Inches(4.3)]
    id_data = [
        ("Nama Penyusun", "Muhammad Mirza Fayzul Haq (NIM: 2405216)"),
        ("Institusi Sekolah", "SMA Negeri 7 Bandung"),
        ("Tahun Penyusunan", "Tahun Ajaran 2024 / 2025"),
        ("Jenjang / Fase / Kelas", "Sekolah Menengah Atas (SMA) / Fase E / Kelas X"),
        ("Mata Pelajaran", "Informatika"),
        ("Elemen Pembelajaran", "Dampak Sosial Informatika (DSI)"),
        ("Alokasi Waktu", "2 Jam Pelajaran (1 Pertemuan x 2 x 45 Menit = 90 Menit)"),
        ("Topik Utama Pembelajaran", "Etika Digital, Keamanan Siber, Penanganan Konflik & Literasi Hukum Digital Remaja")
    ]
    
    for row_idx, (k, v) in enumerate(id_data):
        row = t_id.rows[row_idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = col_widths[0]
        c1.width = col_widths[1]
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_background(c0, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
        set_cell_background(c1, "F8FAFC" if row_idx % 2 == 0 else "FFFFFF")
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.name = "Calibri"
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_SECONDARY
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(v)
        r1.font.name = "Calibri"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    add_p("")
    
    add_h2("1. Kompetensi Awal (Prasyarat)")
    add_p("Peserta didik telah memiliki keterampilan dasar dalam mengoperasikan perangkat smartphone, mengakses internet, berinteraksi di aplikasi perpesanan instan (WhatsApp), serta menjelajahi media sosial (Instagram). Namun, peserta didik belum memiliki pemahaman kritis dan komprehensif mengenai bahaya rekayasa sosial (social engineering), ancaman malware .APK perbankan, batasan lisensi Creative Commons vs pelanggaran hak cipta, dampak psikologis dari Bystander Effect dan Flame War, serta konsekuensi yuridis berdasarkan regulasi UU ITE No. 1/2024, UU PDP No. 27/2022, dan Permendikbudristek No. 46/2023.")

    add_h2("2. Profil Pelajar Pancasila")
    add_bullet(" Mampu mengidentifikasi informasi palsu, menganalisis manipulasi rekayasa sosial, mengevaluasi konsekuensi keputusan digital melalui analisis kausalitas (cause-and-effect), serta menilai kepatuhan terhadap hukum siber secara objektif.", "Bernalar Kritis:")
    add_bullet(" Berkolaborasi dalam kelompok kecil untuk membedah studi kasus siber, berbagi peran dalam investigasi simulasi, serta merumuskan konsensus solusi bersama.", "Bergotong Royong:")
    add_bullet(" Merumuskan tindakan preventif dan kuratif yang aplikatif, orisinal, dan solutif dalam menghadapi berbagai krisis digital di lingkungan remaja.", "Kreatif:")
    add_bullet(" Menunjukkan sikap ksatria dan jujur (akuntabilitas jejak digital), menghormati karya cipta orang lain, serta aktif membela korban perundungan siber (Upstander).", "Berakhlak Mulia (Integritas & Empati):")

    add_h2("3. Sarana dan Prasarana")
    add_bullet(" Aplikasi Mobile-Web Interaktif 'SimOS-DSI' (Simulasi Sistem Operasi Edukasi Dampak Sosial Informatika). Menyajikan lingkungan simulasi smartphone (iOS/Android Virtual OS) berbasis narasi percabangan (branching scenario) yang mengintegrasikan aplikasi tiruan realistis: WhatsApp (Chatter), Instagram (InstaPic), Safari Web Browser, SMS/Messages, serta Dashboard Analisis Kausalitas & Refleksi Pedagogis.", "Media Pembelajaran Utama:")
    add_bullet(" Smartphone peserta didik (minimal 1 perangkat per kelompok kerja beranggotakan 4-5 siswa), Laptop Guru, Proyektor LCD/Smart TV, serta Pengeras Suara (Speaker aktif) untuk mendukung efek suara (audio cues) situasi kritis.", "Perangkat Keras (Hardware):")
    add_bullet(" Peramban Web (Google Chrome / Safari) untuk menjalankan SimOS-DSI secara lokal/daring, jaringan intranet WiFi sekolah atau kuota data.", "Perangkat Lunak & Jaringan:")
    add_bullet(" Lembar Kerja Peserta Didik (LKPD) Interaktif Berbasis Media SimOS-DSI, Kartu Kasus Digital, Salindia Presentasi Pengantar Guru.", "Bahan Ajar & Dokumen:")

    add_callout([
        "Media pembelajaran SimOS-DSI dirancang khusus untuk memecahkan kelemahan metode ceramah konvensional pada materi Dampak Sosial Informatika (DSI).",
        "Melalui simulasi ini, siswa tidak hanya membaca teori, melainkan mengalami langsung konsekuensi dramatis dari setiap keputusan (misal: layar HP glitch saat terkena malware .APK, saldo bank terkuras di aplikasi SMS, atau ledakan perang komentar/flame war di InstaPic).",
        "Setiap akhir simulasi dilengkapi dengan 'Debrief Theory Card' yang memuat istilah kunci DSI, dasar regulasi perundang-undangan Indonesia, serta skenario komparasi 'What-If'."
    ], "KONSEPSI INOVATIF MEDIA SimOS-DSI")

    add_h2("4. Target Peserta Didik")
    add_p("Peserta didik reguler/tipikal Fase E (Kelas X SMA), dengan keberagaman gaya belajar (visual, auditori, kinestetik) yang diakomodasi melalui media simulasi interaktif multimedia SimOS-DSI.")

    add_h2("5. Model, Pendekatan, dan Metode Pembelajaran")
    add_bullet(" Problem-Based Learning (PBL) terintegrasi Scenario-Based Learning (SBL) dan Game-Based Learning (GBL).", "Model Pembelajaran:")
    add_bullet(" Technological Pedagogical Content Knowledge (TPACK) dan Student-Centered Learning.", "Pendekatan:")
    add_bullet(" Simulasi Interaktif Berbasis Keputusan (Branching Simulation), Diskusi Kelompok Kolaboratif, Investigasi Kausalitas (Causality Analysis), Elevator Pitch (Presentasi Solusi Cepat), dan Refleksi Terbimbing.", "Metode Pembelajaran:")

    # -------------------------------------------------------------
    # B. KOMPONEN INTI
    # -------------------------------------------------------------
    add_h1("B. KOMPONEN INTI")
    
    add_h2("1. Capaian Pembelajaran (CP) Fase E - Elemen DSI")
    add_p("Pada akhir fase E, peserta didik mampu memahami sejarah perkembangan komputer dan tokoh-tokohnya, memahami hak kekayaan intelektual, lisensi, aspek teknis, hukum, ekonomi, lingkungan, dan sosial dari produk informatika, serta memahami berbagai bidang studi dan profesi bidang informatika serta peran informatika pada bidang lain.")

    add_h2("2. Alur Tujuan Pembelajaran (ATP) & Tujuan Pembelajaran (TP)")
    add_bullet(" Menganalisis (C4) dampak positif dan negatif penggunaan teknologi informasi, risiko kejahatan siber (malware, phishing), pelanggaran HKI, perundungan siber, dan jejak digital melalui skenario kasus nyata pada media simulasi interaktif SimOS-DSI.", "TP 1 (Kognitif Analisis):")
    add_bullet(" Mengevaluasi (C5) hubungan sebab-akibat (causality mechanism) antara pilihan tindakan pengguna internet dengan konsekuensi hukum (UU ITE, UU PDP, UU Hak Cipta) serta dampak psikologis sosial di ruang maya.", "TP 2 (Evaluasi Kritis):")
    add_bullet(" Merumuskan dan mendemonstrasikan (C6) tindakan preventif, sikap etis, dan solusi mitigasi konkret (actionable solutions) untuk mewujudkan kewargaan digital yang aman, empatik, dan bertanggung jawab.", "TP 3 (Kreasi Solutif):")

    add_h2("3. Indikator Ketercapaian Tujuan Pembelajaran (IKTP)")
    add_bullet("Peserta didik mampu mengidentifikasi ciri-ciri pesan hoaks dan indikasi phishing pada grup percakapan digital.")
    add_bullet("Peserta didik mampu melakukan verifikasi lateral (lateral reading) menggunakan peramban web untuk mengecek keabsahan rilis resmi institusi.")
    add_bullet("Peserta didik mampu membedakan lisensi hak cipta komersial dan Creative Commons (CC) serta menerapkan atribusi legal pada karya visual.")
    add_bullet("Peserta didik mampu menguraikan bahaya Bystander Effect dan eskalasi Flame War pada kolom komentar serta Direct Message (DM) media sosial.")
    add_bullet("Peserta didik mampu mendemonstrasikan prosedur pelaporan resmi (Report Abuse) dan pendampingan moral privat (Upstander) bagi korban perundungan.")
    add_bullet("Peserta didik mampu menganalisis mekanisme manipulasi izin file installer .APK terhadap penyadapan SMS OTP dan pencurian dana perbankan.")
    add_bullet("Peserta didik mampu mengevaluasi permanensi jejak digital (digital footprint) dan menyusun strategi klarifikasi yang jujur dan akuntabel.")

    add_h2("4. Pemahaman Bermakna (Meaningful Understanding)")
    add_p("Setiap ketukan jempol di layar ponsel meninggalkan jejak digital permanen dan konsekuensi nyata. Menjadi warga digital yang cerdas bukan diukur dari seberapa cepat kita meneruskan (forward) pesan atau membalas komentar, melainkan dari keberanian melakukan 'Jeda Kritis' (Critical Thinking Pause), bertabayyun pada sumber resmi, serta menggunakan etika dan empati sebagai perisai perlindungan bersama.")

    add_h2("5. Pertanyaan Pemantik (Driving Questions)")
    add_bullet("Pernahkah kalian menerima pesan di grup WhatsApp yang mengumumkan libur mendadak atau paket kurir mencurigakan? Apakah kalian langsung mengkliknya, dan apa bahaya terbesar yang mengintai jika kita bertindak gegabah?")
    add_bullet("Mengapa orang sering merasa lebih berani menghina atau adu mulut di media sosial daripada di dunia nyata? Apa yang terjadi jika kita membalas makian pelaku perundungan dengan makian balik di ruang publik?")
    add_bullet("Apakah menghapus postingan atau mengklaim 'akun saya di-hack' dapat benar-benar menghapus jejak digital masa lalu kita?")

    add_h2("6. Pemetaan Kasus Pembelajaran Berbantuan Media SimOS-DSI")
    
    t_cases = doc.add_table(rows=6, cols=4)
    t_cases.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_cases)
    
    c_widths = [Inches(1.0), Inches(1.8), Inches(2.0), Inches(1.7)]
    headers = ["Level / Misi", "Fokus Studi Kasus", "Fitur Simulasi SimOS-DSI", "Landasan Regulasi & Etika"]
    
    for c_idx, h in enumerate(headers):
        cell = t_cases.rows[0].cells[c_idx]
        cell.width = c_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    case_rows = [
        ("Level 1\n(Misi 1)", "Krisis Disinformasi & Rekayasa Sosial (Hoax Libur Mendadak)", "Simulasi pesan WhatsApp Dina, link blogspot palsu, Safari browser cek website sman1-official.sch.id, kamera screenshot bukti, modal forward multi-grup.", "UU ITE Pasal 28 Ayat (1)\nPrinsip Jeda Kritis (Saring Sebelum Sharing)"),
        ("Level 2\n(Misi 2)", "Hak Kekayaan Intelektual (HKI) & Lisensi Poster Pensi", "Simulasi chat Rian deadline mepet, browser gambar Creative Commons vs Pinterest curian, live posting InstaPic, somasi DM ilustrator @art_by_kenzo.", "UU Hak Cipta No. 28/2014\nLisensi Creative Commons (CC-BY / CC0)"),
        ("Level 3\n(Misi 3)", "Cyberbullying, Body Shaming & Eskalasi Flame War", "Postingan InstaPic Siska, komentar jahat Maya, 4 tahap eskalasi Flame War komentar & DM adu mulut, tombol Report Abuse, DM empati privat.", "UU ITE Pasal 27A (UU No. 1/2024)\nPermendikbudristek No. 46/2023 (PPKSP)"),
        ("Level 4\n(Misi 4)", "Malware Finansial .APK & Penipuan Kurir Paket", "WhatsApp kurir gadungan, file Resi_Paket.APK, animasi Android Package Installer, layar glitch, SMS penyadapan OTP & pengurasan saldo bank.", "UU PDP No. 27/2022\nUU ITE Pasal 30, 31, 32 (Akses Ilegal & Sniffing)"),
        ("Level 5\n(Misi 5)", "Jejak Digital Masa Lalu & Akuntabilitas Pemimpin", "Akun gosip @lambe_sman1 viral video masa lalu Budi, godaan alibi 'akun dihack', arsip jejak digital (2023 vs 2026), video permohonan maaf jujur.", "Prinsip Etika Digital Nasional\nIntegritas Moral & Akuntabilitas Pemimpin")
    ]
    
    for r_idx, r_data in enumerate(case_rows, start=1):
        row = t_cases.rows[r_idx]
        for c_idx, val in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = c_widths[c_idx]
            set_cell_margins(cell, 60, 60, 80, 80)
            set_cell_background(cell, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.1
            run = p.add_run(val)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.bold = True
                run.font.color.rgb = COLOR_PRIMARY
            else:
                run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    add_p("")

    # -------------------------------------------------------------
    # C. SKENARIO KEGIATAN PEMBELAJARAN DETAIL (90 MENIT)
    # -------------------------------------------------------------
    add_h1("C. SKENARIO KEGIATAN PEMBELAJARAN (90 MENIT)")
    
    add_h2("1. Kegiatan Pendahuluan (15 Menit)")
    add_bullet(" Guru mengucap salam penuh kehangatan, meminta ketua kelas memimpin doa bersama, memeriksa kebersihan kelas, menanyakan kabar siswa, dan mendata presensi kehadiran.", "Orientasi & Pengondisian (3 Menit):")
    add_bullet(" Guru menampilkan layar beranda (lockscreen) aplikasi SimOS-DSI pada layar LCD Proyektor di depan kelas. Guru memutar efek audio notifikasi smartphone beruntun yang memunculkan pesan darurat di WhatsApp dan InstaPic. Guru melemparkan Pertanyaan Pemantik: 'Jika ponsel kalian berdering seperti ini dengan kabar heboh, apa yang langsung kalian lakukan?'. Guru memberi kesempatan 2-3 peserta didik mengemukakan respon spontan mereka.", "Apersepsi & Motivasi Berbantuan SimOS-DSI (7 Menit):")
    add_bullet(" Guru menyampaikan Tujuan Pembelajaran hari ini dan menjelaskan alur bahwa siswa akan bekerja dalam kelompok sebagai 'Konsultan Etika Digital Remaja' yang memecahkan krisis nyata di dunia maya melalui simulasi interaktif SimOS-DSI.", "Penyampaian Tujuan & Pengenalan Media (5 Menit):")

    add_h2("2. Kegiatan Inti - Sintaks Problem-Based Learning (PBL) Berbantuan SimOS-DSI (60 Menit)")

    add_p("Guru menampilkan 5 Modul Krisis Digital pada aplikasi SimOS-DSI di layar utama. Setiap kelompok beranggotakan 4-5 siswa mendapatkan tugas mendalami salah satu skenario krisis (atau menjalankan simulasi bergiliran). Siswa mengamati dinamika awal kasus di mana setiap keputusan membawa risiko sosial, hukum, dan psikologis.", "Fase 1: Orientasi Peserta Didik pada Masalah (10 Menit) - ")
    
    add_p("Peserta didik duduk melingkar dalam kelompok. Perwakilan kelompok membuka tautan aplikasi SimOS-DSI pada smartphone kelompok masing-masing. Guru membagikan Lembar Kerja Peserta Didik (LKPD) Interaktif Berbasis SimOS-DSI. Siswa mencermati petunjuk teknis simulasi: menelusuri percabangan pilihan, mengamati perubahan layar (WhatsApp, Safari, InstaPic, SMS), serta mencatat temuan pada LKPD.", "Fase 2: Mengorganisasikan Peserta Didik untuk Belajar (5 Menit) - ")

    add_p("Peserta didik secara aktif menjalankan simulasi pada aplikasi SimOS-DSI:", "Fase 3: Membimbing Penyelidikan Mandiri & Kelompok Melalui Media SimOS-DSI (20 Menit) - ")
    add_bullet("Siswa berinteraksi dengan simulasi antarmuka smartphone nyata: membaca pesan masuk, memilih opsi respon, membuka aplikasi Safari untuk cek fakta/lisensi, atau memoderasi komentar di InstaPic.")
    add_bullet("Siswa secara sengaja diajak mengeksplorasi cabang keputusan yang salah (misal: mem-forward hoaks ke grup, memasang file .APK, atau meladeni makian bully di kolom komentar) untuk menyaksikan visualisasi dampak buruknya secara nyata (animasi installer malware, penyadapan SMS OTP, saldo terkuras, serta ledakan perang komentar Flame War).")
    add_bullet("Siswa mengkaji kolom 'Review & Pedagogical Debrief Dashboard' di sisi kanan layar aplikasi SimOS-DSI: membaca analisis kausalitas (Causality Analysis), istilah kunci DSI, dasar hukum regulasi, serta skenario What-If.")
    add_bullet("Siswa berdiskusi mengisi LKPD: membedah akar masalah, jebakan psikologis/teknis, regulasi hukum yang dilanggar, serta merumuskan 2 tindakan preventif dan solutif.")
    add_bullet("Guru bertindak sebagai fasilitator berkeliling memantau proses simulasi, memotivasi anggota kelompok yang pasif, serta mencatat performa pada lembar observasi rubrik formatif.")

    add_p("Setiap kelompok menunjuk juru bicara untuk melakukan Elevator Pitch (Presentasi Solutif Cepat) dengan alokasi waktu maksimal 3 menit per kelompok:", "Fase 4: Mengembangkan dan Menyajikan Hasil Karya (15 Menit) - ")
    add_bullet("Kelompok memproyeksikan layar HP/hasil temuan simulasi SimOS-DSI mereka ke depan kelas.")
    add_bullet("Memaparkan: (1) Inti krisis yang terjadi pada simulasi, (2) Konsekuensi fatal jika salah memilih langkah, (3) Dasar hukum regulasi terkait yang dipelajari dari Debrief Card, dan (4) Dua rekomendasi aksi nyata bagi pelajar SMA.")

    add_p("Guru memberikan umpan balik (constructive feedback) dan apresiasi atas presentasi seluruh kelompok. Guru membedah miskonsepsi yang sering terjadi (misal: 'membalas bully di medsos dengan makian bukanlah membela diri, melainkan Flame War yang melanggar UU ITE'; 'file resi paket tidak pernah berekstensi .APK'). Guru merajut kesimpulan komprehensif mengenai 5 pilar kedewasaan digital santri (Tabayyun, Menghargai Hak Cipta, Empati Digital Upstander, Kewaspadaan Siber, dan Akuntabilitas Jejak Digital).", "Fase 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah (10 Menit) - ")

    add_h2("3. Kegiatan Penutup (15 Menit)")
    add_bullet(" Setiap peserta didik menuliskan refleksi singkat pada secarik kertas / formulir digital: 'Sebelum mencoba SimOS-DSI saya mengira ..., namun setelah simulasi saya menyadari bahwa ...'.", "Refleksi Peserta Didik (5 Menit):")
    add_bullet(" Guru bersama peserta didik menyimpulkan intisari pembelajaran hari ini mengenai pentingnya Jeda Kritis (Critical Thinking Pause) dan etika di ruang digital.", "Kesimpulan Kolektif (5 Menit):")
    add_bullet(" Guru mengumumkan kelompok terbaik, memberikan tugas pengayaan/bacaan tindak lanjut, mengajak seluruh siswa berdoa menutup pembelajaran, dan mengucap salam penutup.", "Apresiasi & Doa Penutup (5 Menit):")

    # -------------------------------------------------------------
    # D. ASESMEN PEMBELAJARAN
    # -------------------------------------------------------------
    add_h1("D. ASESMEN PEMBELAJARAN (PENILAIAN LENGKAP)")
    
    add_h2("1. Asesmen Diagnostik (Awal Pembelajaran)")
    add_p("Dilakukan pada apersepsi melalui pertanyaan pemantik dan observasi respon lisan peserta didik terkait kebiasaan berselancar di media sosial dan kepekaan terhadap pesan mencurigakan.")

    add_h2("2. Asesmen Formatif (Proses Pembelajaran)")
    add_bullet(" Penilaian proses saat peserta didik menjalankan skenario percabangan SimOS-DSI, berdiskusi kelompok, menganalisis kausalitas di Debrief Dashboard, dan menyajikan Elevator Pitch (Rubrik Terlampir).", "Observasi Kinerja Simulasi & Diskusi:")
    add_bullet(" Penilaian ketepatan analisis akar masalah, identifikasi pasal hukum, dan kualitas rekomendasi solusi nyata pada LKPD.", "Penilaian Lembar Kerja Peserta Didik (LKPD):")

    add_h2("3. Asesmen Sumatif (Akhir Pembelajaran)")
    add_p("Kuis tes tertulis berbentuk Situational Judgment Test (SJT) / Soal Pilihan Ganda Analisis Kasus Berpikir Tingkat Tinggi (HOTS) sebanyak 5 butir soal yang mencerminkan 5 level skenario SimOS-DSI (Instrumen Terlampir).")

    # -------------------------------------------------------------
    # E. PENGAYAAN DAN REMEDIAL
    # -------------------------------------------------------------
    add_h1("E. PROGRAM PENGAYAAN DAN REMEDIAL")
    
    add_h2("1. Program Pengayaan (Peserta Didik Capaian Tinggi)")
    add_p("Peserta didik yang telah mencapai ketuntasan sempurna (memperoleh bintang 3 pada seluruh misi SimOS-DSI dan nilai LKPD > 85) diberikan penugasan pengayaan:")
    add_bullet("Mengeksplorasi skenario What-If tingkat lanjut pada aplikasi SimOS-DSI untuk mengkaji perspektif pelaku vs korban.")
    add_bullet("Menelaah naskah resmi UU No. 1 Tahun 2024 (Revisi Kedua UU ITE) Pasal 27A & 28 serta UU No. 27 Tahun 2022 (UU PDP).")
    add_bullet("Merancang poster digital / infografis edukasi warga sekolah mengenai 'Panduan Anti-Phishing APK & Pencegahan Cyberbullying' untuk dipublikasikan di mading atau media sosial sekolah.")

    add_h2("2. Program Remedial (Peserta Didik Butuh Bimbingan)")
    add_p("Peserta didik yang belum mencapai kriteria ketuntasan (mengalami game over berulang atau skor LKPD < 70) diberikan bimbingan remedial:")
    add_bullet("Melakukan bimbingan klinis mengulang skenario SimOS-DSI secara perlahan didampingi guru/tutor sebaya.")
    add_bullet("Membaca dan merangkum kembali 'Debrief Theory Card' pada aplikasi SimOS-DSI untuk memahami akar kekeliruan keputusan sebelumnya.")
    add_bullet("Mengerjakan lembar refleksi mandiri sederhana mengenai langkah pencegahan kejahatan digital.")

    # -------------------------------------------------------------
    # F. REFLEKSI GURU
    # -------------------------------------------------------------
    add_h1("F. INSTRUMEN REFLEKSI GURU")
    
    t_ref = doc.add_table(rows=6, cols=3)
    t_ref.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_ref)
    
    ref_widths = [Inches(0.6), Inches(4.5), Inches(1.4)]
    ref_headers = ["No", "Pertanyaan Refleksi Diri Guru", "Hasil Evaluasi / Tindak Lanjut"]
    for c_idx, h in enumerate(ref_headers):
        cell = t_ref.rows[0].cells[c_idx]
        cell.width = ref_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    ref_questions = [
        ("1", "Apakah media simulasi interaktif SimOS-DSI terbukti meningkatkan keterlibatan (engagement) dan nalar kritis siswa dibandingkan metode konvensional?", ""),
        ("2", "Apakah pembagian waktu (90 menit) untuk simulasi, diskusi LKPD, dan elevator pitch berjalan efektif dan proporsional?", ""),
        ("3", "Apakah ada kelompok yang mengalami kendala teknis (gawai/koneksi) saat mengakses SimOS-DSI, dan bagaimana solusinya?", ""),
        ("4", "Apakah tujuan pembelajaran (menganalisis, mengevaluasi kausalitas, dan merumuskan solusi etika digital) tercapai oleh mayoritas siswa?", ""),
        ("5", "Aspek pedagogis apa dari skenario simulasi yang perlu diperkaya atau diperbarui untuk pertemuan berikutnya?", "")
    ]
    
    for r_idx, r_data in enumerate(ref_questions, start=1):
        row = t_ref.rows[r_idx]
        for c_idx, val in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = ref_widths[c_idx]
            set_cell_margins(cell, 60, 60, 80, 80)
            set_cell_background(cell, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.name = "Calibri"
            run.font.size = Pt(9)
            run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 1: LKPD INTERAKTIF BERBASIS SimOS-DSI
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 1: LEMBAR KERJA PESERTA DIDIK (LKPD) TERINTEGRASI SimOS-DSI")
    add_subtitle("LEMBAR KERJA: KONSULTAN ETIKA & KEAMANAN SIBER REMAJA\nBerbantuan Media Simulasi Digital SimOS-DSI")

    add_p("Nama Kelompok: ____________________________________________________")
    add_p("Kelas / Semester: X - _____ / Semester Ganjil")
    add_p("Nama Anggota Kelompok: (1) _______________________  (2) _______________________")
    add_p("                       (3) _______________________  (4) _______________________")
    add_p("Fokus Misi SimOS-DSI: [  ] Level 1 (Hoaks)   [  ] Level 2 (Hak Cipta)   [  ] Level 3 (Cyberbullying)")
    add_p("                      [  ] Level 4 (Malware) [  ] Level 5 (Jejak Digital)")
    add_p("Alokasi Waktu: 20 Menit Diskusi & Simulasi Terbimbing\n")

    add_h2("Petunjuk Kerja:")
    add_bullet("Buka aplikasi SimOS-DSI pada ponsel kelompok kalian dan pilih level misi yang ditugaskan.")
    add_bullet("Jalankan skenario dengan cermat. Coba eksplorasi pilihan keputusan yang berbeda untuk melihat perbedaan konsekuensi langsung pada layar HP simulasi.")
    add_bullet("Buka panel 'Review & Debrief Dashboard' di sisi kanan layar untuk membaca analisis kausalitas, dasar hukum perundang-undangan, dan istilah kunci DSI.")
    add_bullet("Diskusikan bersama kelompok dan jawablah 4 pertanyaan investigasi mendalam di bawah ini!")

    add_h2("Bagian I: Catatan Keputusan Simulasi SimOS-DSI")
    add_p("Tuliskan keputusan yang kelompok kalian ambil dan amati konsekuensinya pada layar HP:", bold_prefix="Instruksi: ")
    
    t_lkpd = doc.add_table(rows=3, cols=3)
    t_lkpd.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_lkpd)
    lkpd_widths = [Inches(1.8), Inches(2.6), Inches(2.1)]
    lkpd_headers = ["Percobaan Langkah", "Tindakan yang Dipilih", "Konsekuensi yang Muncul di HP"]
    for c_idx, h in enumerate(lkpd_headers):
        cell = t_lkpd.rows[0].cells[c_idx]
        cell.width = lkpd_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    lkpd_rows = [
        ("Langkah Salah / Fatal\n(Bad Choice)", "(Tuliskan pilihan yang memicu kegagalan/bencana)...", "(Tuliskan visualisasi layar: glitch, saldo terkuras, somasi, flame war)..."),
        ("Langkah Terbaik\n(Perfect Ending)", "(Tuliskan pilihan bijak berlandaskan etika/hukum)...", "(Tuliskan hasil akhir: masalah selesai aman, diapresiasi guru)...")
    ]
    for r_idx, r_data in enumerate(lkpd_rows, start=1):
        row = t_lkpd.rows[r_idx]
        for c_idx, val in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = lkpd_widths[c_idx]
            set_cell_margins(cell, 80, 80, 100, 100)
            set_cell_background(cell, "F8FAFC" if r_idx == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(val)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(0x47, 0x55, 0x69) if "Tuliskan" in val else COLOR_PRIMARY

    add_p("")

    add_h2("Bagian II: Analisis Kasus & Landasan Yuridis-Etis")
    add_p("1. Identifikasi Masalah & Korban:", bold_prefix="Pertanyaan 1: ")
    add_p("Uraikan masalah utama yang terjadi pada skenario misi kelompok kalian! Siapa saja pihak yang paling dirugikan secara materiil, moral, atau hukum?")
    add_p("Jawaban:\n" + ("." * 180) + "\n" + ("." * 180))

    add_p("2. Analisis Akar Masalah & Rekayasa Sosial / Jebakan Digital:", bold_prefix="Pertanyaan 2: ")
    add_p("Mengapa masalah tersebut sangat mudah menjebak pengguna internet (khususnya remaja)? Trik psikologis (seperti rasa panik, penasaran, atau gengsi) atau kelemahan teknis apa yang dimanfaatkan pelaku?")
    add_p("Jawaban:\n" + ("." * 180) + "\n" + ("." * 180))

    add_p("3. Landasan Regulasi Hukum di Indonesia:", bold_prefix="Pertanyaan 3: ")
    add_p("Berdasarkan informasi pada 'Debrief Card' SimOS-DSI, pasal dan undang-undang apa yang mengatur pelanggaran pada kasus tersebut? Sebutkan konsekuensi sanksi hukumnya!")
    add_p("Jawaban:\n" + ("." * 180) + "\n" + ("." * 180))

    add_p("4. Rumusan Solusi Aksi Konkret (Actionable Recommendation):", bold_prefix="Pertanyaan 4: ")
    add_p("Sebagai Pelajar SMA / Duta Santri Digital, sebutkan minimal 2 tindakan konkret yang dapat kalian lakukan untuk mencegah atau mengatasi masalah serupa di lingkungan sekolah/keluarga!")
    add_p("Jawaban:\n" + ("." * 180) + "\n" + ("." * 180))

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 2: RUBRIK PENILAIAN LENGKAP & OTENTIK
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 2: RUBRIK PENILAIAN OBSERVASI KINERJA (FORMATIF)")
    add_p("Penilaian unjuk kerja kelompok saat melakukan simulasi SimOS-DSI, diskusi pemecahan masalah, dan elevator pitch presentasi menggunakan skala skor 1 (Kurang) hingga 4 (Sangat Baik).")

    t_rubrik = doc.add_table(rows=5, cols=4)
    t_rubrik.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_rubrik)
    rub_widths = [Inches(1.5), Inches(1.8), Inches(1.8), Inches(1.4)]
    rub_headers = ["Aspek yang Dinilai", "Skor 4 (Sangat Baik / Mahir)", "Skor 2-3 (Berkembang / Layak)", "Skor 1 (Perlu Bimbingan)"]
    for c_idx, h in enumerate(rub_headers):
        cell = t_rubrik.rows[0].cells[c_idx]
        cell.width = rub_widths[c_idx]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.bold = True
        run.font.name = "Calibri"
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    rub_rows = [
        ("Bernalar Kritis &\nAnalisis Kasus", "Mampu membedah akar masalah, jebakan psikologis/teknis, dan kausalitas sebab-akibat secara sangat tajam, logis, dan faktual.", "Mampu menguraikan masalah kasus dan akibatnya, namun analisis masih bersifat permukaan/normatif.", "Tidak mampu mengidentifikasi akar masalah kasus digital."),
        ("Literasi Hukum &\nEtika Digital", "Mengidentifikasi landasan hukum (UU ITE/UU PDP/Hak Cipta) secara tepat dan merumuskan etika digital solutif yang aplikatif.", "Menyebutkan aturan hukum, namun pemahaman pasal dan relevansinya terhadap kasus masih terbatas.", "Tidak menyertakan dasar hukum atau melanggar prinsip etika digital."),
        ("Kolaborasi &\nGotong Royong", "Seluruh anggota aktif berdiskusi, berbagi peran simulasi SimOS-DSI secara merata, dan saling menghargai pendapat.", "Diskusi didominasi oleh 1-2 siswa aktif, anggota kelompok lain cenderung pasif atau sekadar menyimak.", "Terlihat bekerja sendiri-sendiri, tidak ada koordinasi kelompok."),
        ("Komunikasi &\nElevator Pitch", "Presentasi sangat lugas, percaya diri, tepat waktu (<=3 menit), berbasis bukti visual simulasi, dan argumentasi meyakinkan.", "Penyampaian cukup jelas namun ragu-ragu, melebihi batas waktu, atau minim elaborasi temuan simulasi.", "Penyampaian tidak jelas, tidak siap presentasi, atau membaca teks sepenuhnya.")
    ]
    
    for r_idx, r_data in enumerate(rub_rows, start=1):
        row = t_rubrik.rows[r_idx]
        for c_idx, val in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = rub_widths[c_idx]
            set_cell_margins(cell, 60, 60, 80, 80)
            set_cell_background(cell, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.1
            run = p.add_run(val)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.bold = True
                run.font.color.rgb = COLOR_PRIMARY
            else:
                run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    add_p("")
    add_p("Rumus Perhitungan Nilai Akhir Kinerja Formatif = (Total Skor yang Diperoleh / 16) x 100", bold_prefix="Pedoman Penskoran: ")
    add_p("Kategori Nilai: 88 - 100 = Sangat Mahir (A) | 75 - 87 = Cakap (B) | 60 - 74 = Layak (C) | < 60 = Perlu Bimbingan (D)")

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 3: BAHAN BACAAN GURU & PESERTA DIDIK
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 3: BAHAN BACAAN GURU & PESERTA DIDIK (MODUL MATERI DSI)")
    
    add_h2("1. Literasi Hoaks, Rekayasa Sosial, dan Jeda Kritis (Materi Misi 1)")
    add_p("Disinformasi dan hoaks di era digital modern jarang disebarkan secara terang-terangan sebagai kebohongan; ia kerap menyamar sebagai 'informasi darurat' atau 'kabar gembira' (seperti pengumuman libur mendadak). Teknik ini dikenal sebagai Social Engineering (Rekayasa Sosial), yakni manipulasi psikologis yang mengeksploitasi emosi manusia agar lengah.")
    add_bullet(" Penipu sering menggunakan domain gratisan seperti .blogspot.com, .wordpress.com, atau domain TLD murah (.xyz, .top) yang menyerupai nama institusi resmi. Domain resmi sekolah di Indonesia menggunakan akhiran .sch.id dan pemerintah menggunakan .go.id.", "Domain Spoofing:")
    add_bullet(" Kebiasaan menahan diri sejenak sebelum menekan tombol forward atau share. Tanyakan pada diri sendiri: Apakah sumbernya primer? Apakah logis? Apa dampak jika berita ini ternyata palsu?", "Jeda Kritis (Critical Thinking Pause):")
    add_bullet(" Melakukan verifikasi dengan membuka tab baru di peramban web dan mencari rilis pers di portal resmi sekolah atau kantor dinas terkait.", "Verifikasi Lateral (Lateral Reading):")
    add_bullet(" Pasal 28 Ayat (1) mengancam pidana penjara hingga 6 tahun dan/atau denda paling banyak Rp 1 Miliar bagi setiap orang yang dengan sengaja menyebarkan berita bohong dan menyesatkan.", "Regulasi UU ITE:")

    add_h2("2. Hak Cipta & Lisensi Creative Commons (Materi Misi 2)")
    add_p("Banyak remaja beranggapan bahwa gambar yang ada di mesin pencari (Google Images) atau Pinterest bebas diambil dan digunakan untuk keperluan kepanitiaan sekolah. Ini adalah miskonsepsi fatal. Setiap karya cipta visual secara otomatis dilindungi Hak Cipta sejak pertama kali diwujudkan (UU No. 28 Tahun 2014).")
    add_bullet(" Hak eksklusif bagi pencipta untuk mendapatkan keuntungan ekonomi atas karyanya. Penggunaan tanpa izin untuk acara yang menjual tiket (seperti Pensi) dapat digolongkan sebagai pelanggaran komersial.", "Hak Ekonomi & Hak Moral:")
    add_bullet(" Sistem lisensi terbuka yang memungkinkan pencipta membagikan karyanya secara legal dengan syarat tertentu:", "Creative Commons (CC):")
    add_bullet(" Gambar domain publik, bebas digunakan untuk tujuan apapun tanpa syarat atribusi.", "  • CC0 (Public Domain):")
    add_bullet(" Boleh digunakan dan dimodifikasi, asalkan mencantumkan nama pencipta dan tautan sumber.", "  • CC-BY (Attribution):")
    add_bullet(" Karya hanya boleh digunakan untuk kegiatan non-komersial.", "  • CC-NC (Non-Commercial):")

    add_h2("3. Cyberbullying, Bystander Effect & Flame War (Materi Misi 3)")
    add_p("Perundungan siber di media sosial sering diawali dari 'bercandaan fisik' (body shaming) di kolom komentar publik. Luka psikologis yang dialami korban seringkali diperparah oleh sikap lingkungan sekitarnya.")
    add_bullet(" Fenomena psikologis di mana saksi mata memilih diam dan tidak membela korban karena menganggap 'itu bukan urusan saya' atau merasa orang lain yang akan menolong.", "Bystander Effect:")
    add_bullet(" Menyerang balik pelaku bully dengan makian atau hinaan fisik di kolom komentar publik justru memicu perdebatan sengit massal (Flame War) yang mengotori jejak digital kedua belah pihak.", "Bahaya Flame War:")
    add_bullet(" Menjadi pembela aktif yang bijak dengan: (1) Menggunakan fitur pelaporan resmi platform (Report Abuse) untuk menghapus komentar toksik, dan (2) Mengirimkan pesan dukungan privat (Direct Message) untuk menguatkan mental korban.", "Peran Upstander Sejati:")
    add_bullet(" Pasal 27A UU No. 1/2024 melarang perbuatan menyerang kehormatan atau nama baik orang lain melalui media elektronik, serta Permendikbudristek No. 46/2023 mewajibkan pencegahan kekerasan psikis di satuan pendidikan.", "Dasar Hukum:")

    add_h2("4. Malware Finansial .APK & Pelindungan Data Pribadi (Materi Misi 4)")
    add_p("Modus operandi kejahatan perbankan digital saat ini marak menggunakan pengiriman file installer aplikasi Android berakhiran .APK (seperti 'Resi_Paket.APK' atau 'Undangan_Pernikahan.APK') melalui WhatsApp.")
    add_bullet(" File foto digital resmi selalu berakhiran .JPG, .JPEG, atau .PNG, TIDAK PERNAH berakhiran .APK.", "Anatomi Ekstensi File:")
    add_bullet(" Saat file .APK terpasang, aplikasi jahat meminta izin akses berisiko tinggi: RECEIVE_SMS, READ_SMS, dan Accessibility Service. Hal ini memungkinkan malware menyadap kode OTP (One-Time Password) dari SMS dan menguras saldo rekening atau e-wallet korban.", "Mekanisme Sniffing OTP:")
    add_bullet(" UU No. 27 Tahun 2022 mewajibkan perlindungan data pribadi keuangan, dan UU ITE Pasal 30-32 melarang keras akses ilegal serta penyadapan sistem elektronik.", "Regulasi PDP:")

    add_h2("5. Jejak Digital Permanen & Akuntabilitas Pemimpin (Materi Misi 5)")
    add_p("Setiap aktivitas di internet tersimpan di server perantara, basis data platform, dan cache mesin pencari (seperti Wayback Machine), serta dapat ditangkap layar (screenshot) oleh pengguna lain.")
    add_bullet(" Mencoba menutupi jejak buruk dengan berbohong ('akun saya dibajak/dihack') adalah blunder fatal di era digital, karena log audit aktivitas server dan IP address dapat membuktikan kebenarannya secara mudah.", "Mitos Alibi Hack:")
    add_bullet(" Menghadapi kesalahan masa lalu secara ksatria: menyampaikan permohonan maaf terbuka yang tulus, mengakui kekhilafan, dan menunjukkan perubahan perilaku nyata adalah tanda kepemimpinan digital yang berintegritas.", "Akuntabilitas Ksatria:")

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 4: INSTRUMEN SOAL ASESMEN SUMATIF (HOTS)
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 4: INSTRUMEN ASESMEN SUMATIF (SITUATIONAL JUDGMENT TEST)")
    add_p("Jawablah pertanyaan analisis kasus di bawah ini dengan memilih satu jawaban yang paling tepat dan beretika!")

    soal_list = [
        ("1. Pada suatu pagi, Anda menerima pesan diteruskan (forward) di grup WhatsApp kelas yang memuat link 'http://sman1-libur.blogspot.com/info-resmi' berisi kabar bahwa sekolah diliburkan total hari ini karena renovasi mendadak. Tindakan pertama yang paling mencerminkan penerapan 'Jeda Kritis' (Critical Thinking Pause) adalah...",
         [
             "A. Langsung membagikan tautan tersebut ke grup angkatan sekolah agar teman lain tidak terlanjur datang ke sekolah.",
             "B. Membuka peramban web dan memeriksa pengumuman resmi di situs berdomain institusi resmi sekolah (.sch.id) sebelum mempercayai atau membagikan pesan tersebut.",
             "C. Mengunduh aplikasi yang terlampir pada situs blogspot tersebut untuk memverifikasi kebenaran berita.",
             "D. Mengabaikan pesan tersebut dan tidak peduli apakah teman-teman sekelas lainnya tertipu atau tidak."
         ],
         "Kunci Jawaban: B (Verifikasi lateral ke situs resmi .sch.id merupakan langkah cek fakta primer yang tepat)."),
        
        ("2. Tim panitia Pensi SMA sedang terdesak tenggat waktu cetak poster utama. Seorang anggota panitia mengusulkan untuk mengambil karya ilustrasi maskot yang sangat bagus dari Pinterest tanpa meminta izin atau lisensi pembuatnya, dengan alasan 'hanya untuk acara internal sekolah'. Ditinjau dari Undang-Undang Hak Cipta No. 28 Tahun 2014 dan etika digital, tindakan yang benar adalah...",
         [
             "A. Menyetujui usulan tersebut asalkan nama ilustrator asli dihapus dari poster agar tidak menimbulkan kecurigaan.",
             "B. Menolak usulan tersebut dan mencari gambar berlisensi terbuka Creative Commons (CC0 atau CC-BY) di peramban web serta menyertakan atribusi yang sah.",
             "C. Tetap menggunakan karya tersebut karena kegiatan sekolah dikecualikan secara mutlak dari segala jenis sanksi hukum hak cipta.",
             "D. Mengubah sedikit warna gambar tersebut menggunakan filter agar tidak terdeteksi oleh mesin pencari hak cipta."
         ],
         "Kunci Jawaban: B (Menggunakan lisensi Creative Commons dan atribusi legal menghormati hak cipta pencipta dan taat hukum)."),

        ("3. Di media sosial Instagram sekolah, Anda melihat seorang siswi pendiam dirundung dengan komentar body shaming yang kasar oleh sekelompok siswa populer hingga korban merasa tertekan dan trauma. Berdasarkan pemahaman mengenai fenomena Bystander Effect dan etika bermedia sosial, respon yang paling bijak dan solutif adalah...",
         [
             "A. Ikut menyerang balik pelaku perundungan di kolom komentar publik dengan menghina bentuk fisiknya agar pelaku jera.",
             "B. Bersikap apatis dan diam saja karena merasa itu masalah pribadi antar sesama siswi yang tidak perlu dicampuri.",
             "C. Memanfaatkan fitur 'Report Abuse' platform untuk membersihkan ujaran kebencian sesuai UU ITE Pasal 27A, serta mengirimkan pesan privat (DM) yang hangat untuk mendukung emosional korban.",
             "D. Mengambil tangkapan layar komentar tersebut dan menyebarkannya ke akun gosip sekolah agar pelaku dirundung massal."
         ],
         "Kunci Jawaban: C (Kombinasi pelaporan resmi platform dan pendampingan moral privat merupakan esensi Upstander sejati)."),

        ("4. Seseorang yang mengaku sebagai kurir ekspedisi mengirimkan pesan WhatsApp berisi file dokumen bernama 'Foto_Resi_Paket.APK' berukuran 5 MB dan mengancam akan mengenakan denda pembatalan Rp 200.000 jika file tersebut tidak segera diunduh dan dipasang. Analisis keamanan siber yang paling tepat terhadap situasi ini adalah...",
         [
             "A. File tersebut adalah format standar foto digital kamera ponsel sehingga sangat aman untuk langsung dipasang di ponsel.",
             "B. File tersebut adalah malware trojan perbankan yang memanfaatkan manipulasi rekayasa sosial (ancaman denda) untuk menyadap izin SMS OTP dan menguras saldo rekening.",
             "C. File tersebut harus segera dibuka di ponsel orang tua agar denda Rp 200.000 tidak ditagihkan ke rumah.",
             "D. Penipu tidak akan bisa mencuri data apapun selama kita tidak membagikan nomor rekening bank secara manual di chat."
         ],
         "Kunci Jawaban: B (Ekstensi .APK adalah program aplikasi yang menyadap SMS OTP secara otomatis di latar belakang)."),

        ("5. Seorang kandidat Ketua OSIS mendapati cuitan kasarnya di masa SMP (3 tahun lalu) yang menghina seorang guru bocor ke linimasa media sosial sekolah dan menjadi perbincangan hangat. Strategi penanganan jejak digital yang paling berintegritas dan bermoral adalah...",
         [
             "A. Membuat klarifikasi bohong bahwa akun media sosialnya pada masa SMP tersebut telah dibajak (dihack) oleh orang lain.",
             "B. Menghapus akun media sosial secara permanen dan menghilang dari lingkungan sekolah (digital ghosting).",
             "C. Mengunggah video klarifikasi jujur yang mengakui kesalahan masa lalu, memohon maaf secara tulus kepada guru dan warga sekolah, serta membuktikan komitmen pertumbuhan kedewasaan dirinya.",
             "D. Mencari aib masa lalu kandidat lawan dan menyebarkannya ke media sosial agar perhatian warganet teralihkan."
         ],
         "Kunci Jawaban: C (Akuntabilitas jujur adalah satu-satunya cara memulihkan reputasi digital tanpa menciptakan kebohongan baru).")
    ]

    for q_text, options, key_text in soal_list:
        add_p(q_text, bold_prefix="")
        for opt in options:
            add_p(opt, space_after=1)
        p_k = add_p(key_text, bold_prefix="Pembahasan: ", space_after=6)
        p_k.runs[0].font.color.rgb = COLOR_PRIMARY

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 5: GLOSARIUM DSI
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 5: GLOSARIUM ISTILAH KUNCI DAMPAK SOSIAL INFORMATIKA (DSI)")
    
    glos_data = [
        ("Akuntabilitas Digital", "Tanggung jawab etis dan moral atas setiap jejak, ucapan, dan tindakan yang dipublikasikan di media elektronik."),
        ("Bystander Effect", "Fenomena psikologis ketika saksi mata kejahatan atau perundungan memilih diam karena merasa bukan tanggung jawab pribadinya."),
        ("Creative Commons (CC)", "Organisasi nirlaba yang menyediakan lisensi hak cipta standar gratis agar pencipta dapat membagikan karyanya secara legal."),
        ("Cyberbullying", "Perilaku intimidasi, penghinaan, atau pelecehan yang dilakukan secara berulang melalui sarana media siber."),
        ("Digital Footprint", "Rekam jejak elektronik permanen yang ditinggalkan oleh pengguna internet dari setiap interaksi, unduhan, dan postingan."),
        ("Domain Spoofing", "Teknik penipuan dengan membuat alamat URL palsu menyerupai nama institusi resmi guna mengelabui calon korban."),
        ("Elevator Pitch", "Presentasi solusi yang disampaikan secara sangat ringkas, padat, dan terstruktur dalam durasi 2 hingga 3 menit."),
        ("Flame War", "Perdebatan sengit dan saling melontarkan makian atau hinaan antarpengguna di ruang publik internet."),
        ("Jeda Kritis (Critical Pause)", "Kebiasaan menahan dorongan impulsif untuk memikirkan keabsahan fakta dan dampak sebelum menyebarkan konten."),
        ("Malware .APK", "Paket aplikasi Android berbahaya yang dirancang untuk menyusup ke perangkat dan menyadap data sensitif (seperti SMS OTP)."),
        ("One-Time Password (OTP)", "Kode sandi sekali pakai yang berfungsi sebagai autentikasi lapis kedua (2FA) untuk mengamankan transaksi finansial."),
        ("Phishing", "Upaya penipuan siber untuk memancing korban menyerahkan data pribadi, kredensial akun, atau uang melalui tautan jebakan."),
        ("Report Abuse", "Fitur resmi pada platform digital untuk melaporkan dan membersihkan konten berbahaya sesuai pedoman komunitas."),
        ("Social Engineering", "Teknik manipulasi psikologis yang mengeksploitasi emosi (ketakutan, kepanikan, rasa senang) agar korban bertindak ceroboh."),
        ("Upstander", "Individu yang mengambil tindakan aktif dan bijak untuk membela serta melindungi korban perundungan siber."),
        ("Verifikasi Lateral", "Metode cek fakta dengan membuka tab peramban baru untuk meneliti reputasi sumber informasi dari kanal institusi independen.")
    ]

    for term, definition in glos_data:
        add_p(f"{term}: {definition}", bold_prefix="• ")

    add_p("")

    # -------------------------------------------------------------
    # LAMPIRAN 6: DAFTAR PUSTAKA & DASAR REGULASI
    # -------------------------------------------------------------
    add_h1("LAMPIRAN 6: DAFTAR PUSTAKA & DASAR REGULASI PERUNDANG-UNDANGAN")
    
    pustaka = [
        "Kementerian Komunikasi dan Informatika RI. (2023). Modul Literasi Digital: Aman, Nyaman, dan Beretika di Dunia Siber. Jakarta: Kominfo.",
        "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2021). Buku Panduan Guru Informatika SMA Kelas X. Jakarta: Pusat Perbukuan Balitbang Kemendikbudristek.",
        "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2021). Informatika untuk SMA Kelas X. Jakarta: Pusat Kurikulum dan Perbukuan.",
        "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia Nomor 46 Tahun 2023 tentang Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan (PPKSP).",
        "Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE).",
        "Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).",
        "Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta."
    ]

    for p_item in pustaka:
        add_p(p_item, space_after=3)

    # -------------------------------------------------------------
    # SIGNATURE BLOCK
    # -------------------------------------------------------------
    add_p("")
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_sig, color="FFFFFF", val="none")
    sig_widths = [Inches(3.2), Inches(3.2)]
    
    c_s0, c_s1 = t_sig.rows[0].cells[0], t_sig.rows[0].cells[1]
    c_s0.width = sig_widths[0]
    c_s1.width = sig_widths[1]
    
    p_s0 = c_s0.paragraphs[0]
    p_s0.paragraph_format.line_spacing = 1.15
    p_s0.add_run("Mengetahui,\nKepala SMA Negeri 7 Bandung\n\n\n\n\n___________________________________\nNIP. ...................................................")
    p_s0.runs[0].font.name = "Calibri"
    p_s0.runs[0].font.size = Pt(9.5)
    
    p_s1 = c_s1.paragraphs[0]
    p_s1.paragraph_format.line_spacing = 1.15
    p_s1.add_run("Bandung, ................................... 2024\nGuru Mata Pelajaran Informatika\n\n\n\n\nMuhammad Mirza Fayzul Haq\nNIM: 2405216")
    p_s1.runs[0].font.name = "Calibri"
    p_s1.runs[0].font.size = Pt(9.5)

    # Save to original filename path
    target_path = "2405216_Muhammad Mirza Fayzul Haq_RPP (RENCANA PELAKSANAAN PEMBELAJARAN).docx"
    doc.save(target_path)
    print(f"RPP DOCX successfully created and saved at: {target_path}")

if __name__ == "__main__":
    create_full_rpp()
