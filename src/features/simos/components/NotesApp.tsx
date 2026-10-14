import { useState, useEffect } from 'react';
import { useSimOSStore } from '@/store/simos';
import { sfx } from '@/utils/audio';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Trash2, 
  FileText, 
  Check, 
  Copy, 
  Edit3, 
  Clock, 
  ShieldCheck, 
  Scale, 
  Palette, 
  AlertTriangle, 
  HeartHandshake,
  Folder,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NoteItem {
  id: string;
  title: string;
  category: 'curriculum' | 'student';
  date: string;
  preview: string;
  content: string;
  icon?: any;
  iconColor?: string;
  isPinned?: boolean;
}

const PRELOADED_NOTES: NoteItem[] = [
  {
    id: 'note-5pilar',
    title: '📌 5 Pilar Kewargaan Digital (DSI)',
    category: 'curriculum',
    date: 'Hari ini, 08:30',
    preview: 'Ringkasan standar kompetensi Informatika Fase E: Akses, Netiket, Literasi...',
    icon: ShieldCheck,
    iconColor: 'text-blue-500',
    isPinned: true,
    content: `## 5 Pilar Kewargaan Digital (Fase E DSI)

1. **Akses Digital (Digital Access):**
   Kesetaraan hak mendapatkan konektivitas internet yang sehat dan bertanggung jawab tanpa diskriminasi.

2. **Komunikasi & Netiket (Digital Communication & Etiquette):**
   Etika bertutur santun di ruang maya. Menghindari *flaming*, ujaran kebencian, dan cyberbullying. Mengedepankan tabayun (klarifikasi).

3. **Literasi Digital & Verifikasi Fakta (Digital Literacy):**
   Kritis membedakan opini vs fakta sahih. Menerapkan verifikasi lateral (*lateral reading*) dan mengecek situs resmi (.go.id / .sch.id).

4. **Keamanan Digital (Cybersecurity & Social Engineering):**
   Menjaga kerahasiaan kredensial (password, OTP, PIN). Waspada terhadap serangan rekayasa sosial berkedok paket/undangan berekstensi .APK.

5. **Hak, Tanggung Jawab & Regulasi (Digital Rights & Law):**
   Menghormati Hak Atas Kekayaan Intelektual (HAKI & Lisensi Creative Commons) serta mematuhi UU ITE No. 1/2024 dan UU PDP No. 27/2022.`
  },
  {
    id: 'note-regulasi',
    title: '⚖️ Regulasi Siber: UU ITE 2024 & UU PDP 2022',
    category: 'curriculum',
    date: 'Kemarin, 14:15',
    preview: 'Pasal 28 hoaks, Pasal 27A pencemaran nama baik, dan perlindungan data pribadi...',
    icon: Scale,
    iconColor: 'text-amber-500',
    isPinned: true,
    content: `## Rangkuman Regulasi Siber Indonesia

### 1. UU ITE No. 1 Tahun 2024 (Perubahan Kedua UU ITE)
* **Pasal 28 ayat (1) & (3):** Larangan menyebarkan berita bohong (hoaks) yang menimbulkan kerugian konsumen atau kerusuhan di masyarakat. Ancaman pidana penjara hingga 6 tahun.
* **Pasal 27A:** Larangan sengaja menyerang kehormatan atau nama baik orang lain di media digital (*cyberbullying* / penghinaan).
* **Pasal 45:** Sanksi pidana dan denda bagi pelaku kejahatan siber terbukti.

### 2. UU PDP No. 27 Tahun 2022 (Pelindungan Data Pribadi)
* **Data Pribadi Spesifik:** Data biometrik, rekam medis, data anak, data keuangan pribadi, dan data orientasi seksual.
* **Data Pribadi Umum:** Nama lengkap, NIK, jenis kelamin, kewarganegaraan, agama, dan data yang dikombinasikan untuk mengidentifikasi seseorang.
* **Kewajiban Pengendali Data:** Meminta persetujuan eksplisit pemilik data, merahasiakan, dan segera melaporkan jika terjadi kebocoran (maksimal 3x24 jam).`
  },
  {
    id: 'note-haki',
    title: '🎨 Panduan Lisensi Creative Commons vs Hak Cipta',
    category: 'curriculum',
    date: '10 Okt, 10:00',
    preview: 'Jenis lisensi CC0, CC-BY, CC-BY-SA, NC, ND dan bahaya plagiarisme visual...',
    icon: Palette,
    iconColor: 'text-purple-500',
    isPinned: false,
    content: `## Panduan Hak Cipta & Creative Commons (CC)

### 1. Hak Cipta Penuh (All Rights Reserved)
* Setiap karya (ilustrasi, foto, musik, font) otomatis dilindungi sejak diwujudkan.
* Mengambil gambar dari Google Images / Pinterest tanpa izin tertulis melanggar UU Hak Cipta No. 28/2014.

### 2. Lisensi Creative Commons (CC)
* **CC0 (Public Domain):** Bebas digunakan untuk komersial/non-komersial tanpa perlu atribusi.
* **CC-BY (Atribusi):** Bebas digunakan, diubah, disebarkan, **WAJIB mencantumkan nama pembuat**.
* **CC-BY-SA (ShareAlike):** Wajib atribusi dan karya turunan harus berlisensi serupa.
* **CC-NC (Non-Commercial):** Tidak boleh untuk kepentingan komersial/jualan berbayar.
* **CC-ND (No-Derivatives):** Tidak boleh diedit atau dipotong (harus karya utuh).`
  },
  {
    id: 'note-malware',
    title: '🛡️ Anatomi Serangan Social Engineering .APK',
    category: 'curriculum',
    date: '8 Okt, 16:20',
    preview: 'Ciri manipulasi sniffing SMS OTP berkedok kurir paket dan surat tilang...',
    icon: AlertTriangle,
    iconColor: 'text-rose-500',
    isPinned: false,
    content: `## Modus Penipuan Sniffing Malware .APK

### Modus Operandi
1. Pelaku mengirim pesan WA mengaku kurir pengantar paket J&T/JNE atau kurir undangan nikah.
2. Pelaku menyertakan lampiran file dengan nama manipulasi: \`Foto_Resi_Paket.apk\`.
3. Korban tertipu menganggapnya sebagai foto (.jpg).

### Izin Berbahaya (Malicious Permissions)
* \`RECEIVE_SMS\` & \`READ_SMS\`: Menyadap pesan SMS masuk secara real-time.
* Kode OTP perbankan diteruskan diam-diam ke server sindikat penipu.
* Pelaku menguras saldo tabungan melalui mobile banking.

### Prosedur Keamanan Standar
* Foto ASLI selalu berformat: **.JPG, .JPEG, .PNG, atau .PDF**.
* Dokumen foto **TIDAK PERNAH** berupa file aplikasi Android **(.APK)**.
* Laporkan nomor penipu melalui situs resmi Kominfo di **AduanKonten.id**.`
  },
  {
    id: 'note-etika',
    title: '🕊️ Jeda Kritis 5 Detik & Anti-Flaming',
    category: 'curriculum',
    date: '5 Okt, 11:10',
    preview: 'Teknik STOP sebelum mengetik komentar amarah atau menyebarkan forward pesan...',
    icon: HeartHandshake,
    iconColor: 'text-emerald-500',
    isPinned: false,
    content: `## Teknik Jeda Kritis (Critical Thinking Pause)

### Rumus S-T-O-P Sebelum Merespons
* **S (Stop):** Tahan jari selama 5 detik sebelum mengetik atau membagikan pesan.
* **T (Think):** Apakah ini fakta atau rumor? Apakah ini menyakiti pihak lain?
* **O (Observe):** Sadari apakah emosi kita sedang dimanipulasi oleh clickbait atau amarah kelompok.
* **P (Proceed with Wisdom):** Respons dengan bijak, verifikasi bukti, atau pilih tidak memperkeruh suasana.

### Jejak Digital Bersifat Permanen
* Tangkapan layar (*screenshot*) dapat disimpan selamanya oleh orang lain.
* Rekam jejak digital dipertimbangkan dalam beasiswa universitas dan seleksi kerja profesional.`
  }
];

export default function NotesApp() {
  const { openApp, isDarkMode } = useSimOSStore();
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('simos_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return PRELOADED_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'curriculum' | 'student'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editor states for active note
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Save student notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simos_notes', JSON.stringify(notes));
    } catch (e) {
      // ignore
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleSelectNote = (note: NoteItem) => {
    sfx.playSend();
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleCreateNewNote = () => {
    sfx.playSend();
    const newId = `note-${Date.now()}`;
    const newNote: NoteItem = {
      id: newId,
      title: 'Catatan Refleksi Baru',
      category: 'student',
      date: 'Baru saja',
      preview: 'Ketik hasil temuan atau jawaban LKPD simulasi kamu di sini...',
      content: `## Catatan Siswa - Refleksi Simulasi DSI

* **Tanggal:** ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
* **Nama Siswa:** Siswa Simulasi SimOS
* **Topik Investigasi:** 

### Temuan Kasus & Analisis Risiko:
1. 

### Keputusan Etis yang Diambil:
* 

### Refleksi Diri terhadap UU ITE & Jejak Digital:
* `,
      icon: FileText,
      iconColor: 'text-amber-500',
      isPinned: false
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newId);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    sfx.playSend();
    setNotes(notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: editTitle.trim() || 'Catatan Tanpa Judul',
          content: editContent,
          preview: editContent.replace(/^[#*\s]+/gm, '').substring(0, 75) + '...',
          date: 'Diedit baru saja'
        };
      }
      return n;
    }));
    setIsEditing(false);
  };

  const handleDeleteNote = (noteId: string) => {
    sfx.playWhoosh();
    setNotes(notes.filter(n => n.id !== noteId));
    if (activeNoteId === noteId) {
      setActiveNoteId(null);
    }
  };

  const handleCopyNoteContent = (text: string, id: string) => {
    sfx.playSend();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredNotes = notes.filter(n => {
    const matchCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className={`flex flex-col h-full select-none animate-in fade-in duration-200 relative ${
      isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-[#F2F2F7] text-neutral-900'
    }`}>
      
      {/* View 1: Notes List */}
      {!activeNote ? (
        <div className="flex flex-col h-full">
          {/* iOS Notes Top Header */}
          <div className={`px-4 pt-4 pb-2 border-b flex flex-col space-y-2.5 ${
            isDarkMode ? 'bg-[#2c2c2e]/80 border-neutral-800' : 'bg-white/80 border-neutral-200'
          } backdrop-blur-md sticky top-0 z-20`}>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => openApp('home')} 
                className="flex items-center text-amber-500 font-semibold text-xs hover:opacity-80 active:scale-95 transition-all"
              >
                <ChevronLeft size={18} className="-ml-1" />
                <span>Layar Utama</span>
              </button>

              <div className="flex items-center space-x-1">
                <Button 
                  onClick={handleCreateNewNote}
                  size="sm"
                  className="h-7 px-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95"
                >
                  <Plus size={14} />
                  <span>Catatan Baru</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h1 className="text-xl font-bold font-sans tracking-tight flex items-center space-x-1.5">
                <Folder size={18} className="text-amber-500" />
                <span>Pusat Catatan DSI</span>
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-semibold">
                {notes.length} Catatan
              </span>
            </div>

            {/* Search Input Bar */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-neutral-800/80 border-neutral-700/60 text-white' : 'bg-neutral-100 border-neutral-300/80 text-neutral-800'
            }`}>
              <Search size={14} className="text-neutral-400 shrink-0" />
              <input 
                type="text"
                placeholder="Cari regulasi, materi DSI, atau catatan LKPD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs focus:outline-none placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-neutral-400 text-xs">✕</button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 pt-0.5 pb-1 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 ${
                  activeCategory === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveCategory('curriculum')}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 flex items-center space-x-1 ${
                  activeCategory === 'curriculum'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                <ShieldCheck size={11} />
                <span>Materi Pedagogik</span>
              </button>
              <button 
                onClick={() => setActiveCategory('student')}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 flex items-center space-x-1 ${
                  activeCategory === 'student'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : isDarkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                <Edit3 size={11} />
                <span>Refleksi LKPD Siswa</span>
              </button>
            </div>
          </div>

          {/* Notes Card Grid / List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredNotes.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-neutral-400 text-center space-y-2 p-4">
                <FileText size={36} className="opacity-40" />
                <p className="text-xs font-medium">Tidak ada catatan yang cocok dengan pencarian.</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const IconComponent = note.icon || FileText;
                return (
                  <div 
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-98 shadow-sm hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-[#2c2c2e] hover:bg-[#3a3a3c] border-neutral-800 text-white' 
                        : 'bg-white hover:bg-amber-50/40 border-neutral-200/90 text-neutral-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                        }`}>
                          <IconComponent size={14} className={note.iconColor || 'text-amber-500'} />
                        </div>
                        <h3 className="font-bold text-xs leading-snug truncate max-w-[220px]">
                          {note.title}
                        </h3>
                      </div>
                      {note.isPinned && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-500 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          Dipin
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] line-clamp-2 mt-1.5 leading-relaxed ${
                      isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      {note.preview}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-500/10 text-[10px] text-neutral-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{note.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold ${
                        note.category === 'curriculum' 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {note.category === 'curriculum' ? 'Pedagogik DSI' : 'Catatan Pribadi'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* View 2: Note Reader & Interactive Editor */
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-200">
          {/* Top Bar for Note Detail */}
          <div className={`px-3 py-2 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#2c2c2e] border-neutral-800' : 'bg-white border-neutral-200'
          } sticky top-0 z-20`}>
            <button 
              onClick={() => {
                if (isEditing) handleSaveNote();
                setActiveNoteId(null);
              }}
              className="flex items-center text-amber-500 font-semibold text-xs hover:opacity-80 active:scale-95"
            >
              <ChevronLeft size={20} className="-ml-1" />
              <span>Semua Catatan</span>
            </button>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleCopyNoteContent(activeNote.content, activeNote.id)}
                className="p-1.5 rounded-full hover:bg-neutral-500/20 text-neutral-400 hover:text-amber-500 active:scale-95 transition-colors"
                title="Salin Isi Catatan"
              >
                {copiedId === activeNote.id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              </button>

              {activeNote.category === 'student' && (
                <>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                      isEditing 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                    }`}
                  >
                    {isEditing ? 'Selesai' : 'Edit'}
                  </button>

                  <button 
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-1.5 rounded-full hover:bg-rose-500/20 text-neutral-400 hover:text-rose-500 active:scale-95 transition-colors"
                    title="Hapus Catatan Ini"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Note Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span className="flex items-center space-x-1">
                <Clock size={11} />
                <span>{activeNote.date}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                activeNote.category === 'curriculum' 
                  ? 'bg-blue-500/10 text-blue-400' 
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {activeNote.category === 'curriculum' ? 'Materi Resmi Kurikulum DSI' : 'Refleksi LKPD'}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Judul Catatan:
                  </label>
                  <input 
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Isi Refleksi / Temuan:
                  </label>
                  <textarea 
                    rows={12}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                </div>

                <Button 
                  onClick={handleSaveNote}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold h-10 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-98"
                >
                  <Check size={15} />
                  <span>Simpan Perubahan Catatan</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-base font-extrabold font-sans tracking-tight border-b pb-2 border-neutral-500/20">
                  {activeNote.title}
                </h1>

                <div className={`prose prose-sm max-w-none text-xs leading-relaxed space-y-2 whitespace-pre-line font-sans ${
                  isDarkMode ? 'text-neutral-300' : 'text-neutral-800'
                }`}>
                  {activeNote.content}
                </div>

                {activeNote.category === 'curriculum' && (
                  <div className="mt-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-2 text-[11px] text-amber-400">
                    <Sparkles size={16} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <strong className="font-bold">Tips Pembelajaran Guru:</strong> Siswa dapat merujuk catatan ini saat menghadapi dilema pilihan di Chatter atau verifikasi di Browser untuk mencapai skor maksimal (⭐⭐⭐).
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
