import { useState, useEffect } from 'react';
import { useSimOSStore } from '@/store/simos';
import { useChatStore } from '@/store/chat';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  RotateCw, 
  Share, 
  Search, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert,
  Camera,
  MessageCircle,
  Clock,
  Highlighter,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type BrowserView = 'search_home' | 'school_official' | 'fake_blog' | 'forum_pelajar' | 'old_news' | 'image_search';

export default function BrowserApp() {
  const { openApp, showBanner, isDarkMode, hasProofScreenshot, setHasProofScreenshot } = useSimOSStore();
  const { advanceNode, script, activeSessionId } = useChatStore();
  
  const isMission2 = script?.id === 'm2';

  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<BrowserView>(isMission2 ? 'image_search' : 'search_home');
  const [currentUrl, setCurrentUrl] = useState(isMission2 ? 'https://pinterest.com/search/fox-mascot' : 'https://search.simos.net');
  const [hasFoundProof, setHasFoundProof] = useState(false);
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showTabSwitcher, setShowTabSwitcher] = useState(false);
  
  // Interactive Text Highlighter State (Level 1 Minigame)
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  const [highlightFeedback, setHighlightFeedback] = useState<string | null>(null);

  useEffect(() => {
    const isM2 = script?.id === 'm2';
    setSearchQuery('');
    setCurrentView(isM2 ? 'image_search' : 'search_home');
    setCurrentUrl(isM2 ? 'https://pinterest.com/search/fox-mascot' : 'https://search.simos.net');
    setHasFoundProof(false);
    setIsScreenshotTaken(false);
    setIsFlashing(false);
    setShowTabSwitcher(false);
    setHighlightedParagraph(null);
    setHighlightFeedback(null);
  }, [activeSessionId, script?.id]);

  const searchResultsL1 = [
    {
      id: 'official',
      title: 'Portal Resmi SMAN 1: Klarifikasi Isu Libur KBM Sidak Dinas',
      url: 'https://sman1-official.sch.id/klarifikasi-hoax',
      domain: 'sman1-official.sch.id',
      badge: 'Portal Resmi (.sch.id)',
      badgeColor: 'emerald',
      snippet: 'Surat Edaran Resmi Kepala Sekolah No. 421/089/2026: Menanggapi kabar libur massal mendadak karena sidak Dinas Kebersihan, sekolah memberikan klarifikasi resmi...',
      target: 'school_official' as BrowserView,
      isPrimary: true
    },
    {
      id: 'phishing',
      title: 'HOT NEWS: Libur Mendadak Sidak Massal Dinas Kebersihan!',
      url: 'http://info-diknas-sekolah.blogspot.xyz/libur-mendadak',
      domain: 'info-diknas-sekolah.blogspot.xyz',
      badge: 'Blogspot Gratisan (.xyz)',
      badgeColor: 'rose',
      snippet: 'Dapatkan pengumuman surat edaran izin libur 3 hari serentak. Wajib klik tombol dan bagikan ke 10 grup WhatsApp untuk mengaktifkan kode izin...',
      target: 'fake_blog' as BrowserView,
      isPrimary: false
    },
    {
      id: 'forum',
      title: '[Diskusi Siswa] Besok SMAN 1 Beneran Libur Gak Sih Woy?',
      url: 'https://forum-pelajar-santai.net/thread/libur-besok',
      domain: 'forum-pelajar-santai.net',
      badge: 'Forum Opini Siswa',
      badgeColor: 'amber',
      snippet: 'Thread komunitas: "@rizky_99: Katanya besok ada sidak, beneran gak? @bimo_tekno: Woy jangan gampang percaya kabar burung, mending cek portal resmi sekolah..."',
      target: 'forum_pelajar' as BrowserView,
      isPrimary: false
    },
    {
      id: 'archive',
      title: 'Dinas Lingkungan Hidup Fogging Rutin di Sekolah (Arsip 2024)',
      url: 'https://berita-kota.com/arsip/2024/sidak-sekolah',
      domain: 'berita-kota.com/arsip/2024',
      badge: 'Berita Basi (Arsip 2024)',
      badgeColor: 'purple',
      snippet: 'Dipublikasikan 14 September 2024: Program penyemprotan massal berkala tahun lalu berjalan tanpa mengganggu jam KBM siswa sekolah...',
      target: 'old_news' as BrowserView,
      isPrimary: false
    }
  ];

  const handleNavigate = (target: BrowserView, url: string) => {
    setCurrentView(target);
    setCurrentUrl(url);
    if (target === 'school_official') {
      setHasFoundProof(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('libur') || q.includes('hoax') || q.includes('sekolah') || q.includes('sman') || q.includes('edaran') || q.includes('jadwal') || q.includes('pengumuman')) {
      handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax');
    } else if (q.includes('blogspot') || q.includes('diknas') || q.includes('xyz')) {
      handleNavigate('fake_blog', 'http://info-diknas-sekolah.blogspot.xyz');
    } else if (q.includes('forum') || q.includes('tanya') || q.includes('gosip')) {
      handleNavigate('forum_pelajar', 'https://forum-pelajar-santai.net/thread/libur-besok');
    } else if (q.includes('arsip') || q.includes('lama') || q.includes('2024')) {
      handleNavigate('old_news', 'https://berita-kota.com/arsip/2024/sidak-sekolah');
    } else {
      handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax');
    }
  };

  const handleParagraphClick = (pId: number) => {
    setHighlightedParagraph(pId);
    if (pId === 2) {
      setHighlightFeedback('✅ Tepat sekali! Kalimat penegasan fakta kunci berhasil ditandai (highlight). Tombol screenshot bukti sekarang terbuka.');
    } else if (pId === 1) {
      setHighlightFeedback('ℹ️ Ini hanya pengantar latar belakang. Cari kalimat yang secara tegas menyatakan bantahan hoax!');
    } else {
      setHighlightFeedback('ℹ️ Ini adalah himbauan umum sekolah. Temukan kalimat inti yang menegaskan status KBM besok!');
    }
  };

  const handleCaptureScreenshot = () => {
    if (highlightedParagraph !== 2) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
    setHasProofScreenshot(true);
    setIsScreenshotTaken(true);
    showBanner({
      app: 'chat',
      sender: 'Kamera / Galeri',
      text: '📸 Screenshot bukti klarifikasi resmi berhasil disimpan! Buka WhatsApp untuk mengirimkannya.'
    });
  };

  const handleReturnToChatWithProof = () => {
    useSimOSStore.getState().setActiveContactId('active');
    openApp('chat');
  };

  const handleSelectAsset = (assetType: 'pinterest' | 'creative_commons' | 'plain') => {
    if (assetType === 'pinterest') {
      useChatStore.getState().recordDecision({
        stepTitle: 'Pemilihan Aset Gambar Pensi',
        prompt: 'Sumber Gambar Poster Maskot Pensi',
        chosenText: 'Mengambil Gambar Rubah dari Pinterest (Art by Bayu)',
        points: 0,
        nodeId: 'node_steal_pinterest_fatal',
        alternatives: [
          { text: 'Pinterest (Karya Seniman Berhak Cipta)', points: 0 },
          { text: 'Freepik / Unsplash (Creative Commons CC-BY)', points: 3 },
          { text: 'Poster Tipografi Polos Tanpa Gambar', points: 2 }
        ],
        causalityAnalysis: {
          riskLevel: 'Kritis',
          mechanism: 'Mengambil karya ilustrator tanpa izin dan memotong watermark untuk publikasi publik.',
          consequence: 'Dituduh plagiarisme di medsos, ancaman sengketa hukum UU Hak Cipta, dan mencoreng reputasi sekolah.',
          bestPracticeRecommendation: 'Selalu gunakan aset dengan lisensi terbuka atau buat karya orisinal sendiri.'
        }
      });
      showBanner({
        app: 'chat',
        sender: 'Rian (Panitia Pensi)',
        text: 'File Pinterest diterima! Langsung dikirim ke percetakan baliho...'
      });
      openApp('chat');
      advanceNode('node_steal_pinterest_fatal');
    } else if (assetType === 'creative_commons') {
      useChatStore.getState().recordDecision({
        stepTitle: 'Pemilihan Aset Gambar Pensi',
        prompt: 'Sumber Gambar Poster Maskot Pensi',
        chosenText: 'Menggunakan Vektor Rubah Berlisensi Creative Commons (CC-BY)',
        points: 3,
        nodeId: 'node_use_creative_commons',
        alternatives: [
          { text: 'Pinterest (Karya Seniman Berhak Cipta)', points: 0 },
          { text: 'Freepik / Unsplash (Creative Commons CC-BY)', points: 3 },
          { text: 'Poster Tipografi Polos Tanpa Gambar', points: 2 }
        ],
        causalityAnalysis: {
          riskLevel: 'Aman',
          mechanism: 'Memilih materi grafis berlisensi publik terbuka dan menyertakan atribusi kepada kreator asli.',
          consequence: 'Poster tampil memikat, bebas dari risiko royalti hukum, dan mematuhi etika kekayaan intelektual.',
          bestPracticeRecommendation: 'Manfaatkan lisensi Creative Commons untuk kebutuhan karya publik yang legal dan etis.'
        }
      });
      showBanner({
        app: 'chat',
        sender: 'Rian (Panitia Pensi)',
        text: 'Keren! Gambar Creative Commons legal langsung dipasang ke poster!'
      });
      openApp('chat');
      advanceNode('node_use_creative_commons');
    } else {
      useChatStore.getState().recordDecision({
        stepTitle: 'Pemilihan Aset Gambar Pensi',
        prompt: 'Sumber Gambar Poster Maskot Pensi',
        chosenText: 'Menggunakan Desain Tipografi Polos Tanpa Maskot',
        points: 2,
        nodeId: 'node_plain_poster_partial',
        alternatives: [
          { text: 'Pinterest (Karya Seniman Berhak Cipta)', points: 0 },
          { text: 'Freepik / Unsplash (Creative Commons CC-BY)', points: 3 },
          { text: 'Poster Tipografi Polos Tanpa Gambar', points: 2 }
        ],
        causalityAnalysis: {
          riskLevel: 'Sedang',
          mechanism: 'Menolak pelanggaran hak cipta namun tidak memanfaatkan alternatif repositori aset legal.',
          consequence: 'Aman dari tuntutan hukum namun hasil visual monoton dan mengurangi daya pikat promosi.',
          bestPracticeRecommendation: 'Pelajari platform repositori gambar legal gratis seperti Unsplash atau Wikimedia Commons.'
        }
      });
      showBanner({
        app: 'chat',
        sender: 'Rian (Panitia Pensi)',
        text: 'Menggunakan konsep poster teks minimalis...'
      });
      openApp('chat');
      advanceNode('node_plain_poster_partial');
    }
  };

  return (
    <div className={`flex flex-col h-full relative animate-in slide-in-from-right duration-300 ${
      isDarkMode ? 'bg-[#121212] text-white' : 'bg-white text-neutral-900'
    }`}>
      {/* Safari-like Top Navigation Bar */}
      <div className={`flex flex-col pt-1 border-b shadow-sm z-10 select-none ${
        isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-gray-100 border-gray-300'
      }`}>
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex space-x-1 text-blue-500">
            <button 
              onClick={() => {
                if (currentView !== 'search_home') {
                  setCurrentView('search_home');
                  setCurrentUrl('https://search.simos.net');
                } else {
                  openApp('chat');
                }
              }}
              className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-200'}`}
              title="Kembali"
            >
              <ChevronLeft size={22} />
            </button>
            <button disabled className="p-1 opacity-30">
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Address Bar */}
          <div className={`flex-1 mx-2 flex items-center justify-center rounded-xl px-2.5 py-1 border ${
            isDarkMode 
              ? 'bg-[#2c2c2e] border-neutral-700/60 text-white' 
              : 'bg-gray-200/90 border-gray-300/50 text-gray-800'
          }`}>
            <Lock size={11} className={currentUrl.startsWith('https') ? 'text-green-500 mr-1' : 'text-red-500 mr-1'} />
            <span className="text-[12px] font-mono truncate max-w-[170px]">{currentUrl}</span>
          </div>

          <RotateCw size={17} className="text-blue-500 cursor-pointer mr-1" />
        </div>
      </div>

      {/* Page Content */}
      <div className={`flex-1 overflow-y-auto relative pb-16 ${
        isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'
      }`}>
        
        {/* VIEW 1: SEARCH ENGINE (SIMSEARCH) */}
        {currentView === 'search_home' && (
          <div className="p-3.5 space-y-3.5">
            <div className="text-center pt-3 pb-1">
              <h1 className="text-2xl font-extrabold tracking-tight">
                <span className="text-blue-500">S</span>
                <span className="text-red-500">i</span>
                <span className="text-yellow-500">m</span>
                <span className="text-blue-500">S</span>
                <span className="text-green-500">e</span>
                <span className="text-red-500">a</span>
                <span className="text-blue-500">r</span>
                <span className="text-purple-500">c</span>
                <span className="text-amber-500">h</span>
              </h1>
              <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                {isMission2 ? 'Pencarian Gambar & Referensi Desain' : 'Mesin Pencari Informasi & Cek Fakta Edukasi'}
              </p>
            </div>

            {/* Interactive Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`border-2 rounded-2xl p-2 shadow-sm flex items-center space-x-2 transition-all ${
                isDarkMode 
                  ? 'bg-[#1c1c1e] border-blue-500/80 text-white focus-within:ring-2 focus-within:ring-blue-500' 
                  : 'bg-white border-blue-400 text-gray-700 focus-within:ring-2 focus-within:ring-blue-400'
              }`}>
                <Search size={16} className="text-blue-500 shrink-0 ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isMission2 ? 'Cari: maskot rubah, poster...' : 'Ketik: libur, pengumuman SMAN 1, sidak...'}
                  className={`w-full bg-transparent text-xs font-medium outline-none ${
                    isDarkMode ? 'placeholder-neutral-500 text-white' : 'placeholder-neutral-400 text-neutral-900'
                  }`}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    className="text-neutral-400 hover:text-neutral-200 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shrink-0 active:scale-95 transition-transform"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Level 1 Search Results: 4 Distinct Web Sources */}
            {!isMission2 && (
              <div className="space-y-2.5 mt-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Hasil Penelusuran ({searchResultsL1.length} Sumber):
                  </p>
                  <span className="text-[10px] text-blue-500 font-medium">Pilih sumber terpercaya</span>
                </div>

                {searchResultsL1.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.target, item.url)}
                    className={`p-3 border rounded-xl transition-all shadow-sm cursor-pointer group active:scale-98 ${
                      isDarkMode 
                        ? 'bg-[#1c1c1e] hover:bg-[#252528] border-neutral-800' 
                        : 'bg-white hover:bg-blue-50/50 hover:border-blue-300 border-gray-200'
                    } ${item.isPrimary ? 'ring-1 ring-emerald-500/30' : ''}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                        {item.domain}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : item.badgeColor === 'rose'
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className={`text-xs font-bold leading-snug group-hover:underline ${
                      item.isPrimary 
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold' 
                        : isDarkMode ? 'text-neutral-100' : 'text-neutral-900'
                    }`}>
                      {item.title}
                    </h3>

                    <p className={`text-[11px] mt-1 leading-relaxed line-clamp-2 ${
                      isDarkMode ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: OFFICIAL SCHOOL WEBSITE (REAL FACT CHECK MINIGAME) */}
        {currentView === 'school_official' && (
          <div className="p-3.5 space-y-3 animate-in fade-in duration-300">
            {/* School Header */}
            <div className={`p-3 rounded-xl border shadow-sm flex items-center justify-between ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">
                  SMAN1
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <h2 className="text-xs font-bold">SMA NEGERI 1 OFFICIAL</h2>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">sman1-official.sch.id • Portal Terverifikasi</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                Sumber Resmi
              </span>
            </div>

            {/* RED ALERT HOAX BANNER */}
            <div className="bg-red-600 text-white p-3.5 rounded-2xl shadow-md border-2 border-red-700 space-y-1.5">
              <div className="flex items-center space-x-1.5">
                <AlertOctagon size={20} className="animate-pulse flex-shrink-0 text-white" />
                <h3 className="font-extrabold text-xs uppercase tracking-wide">
                  PENGUMUMAN RESMI: KABAR LIBUR KBM ADALAH HOAX!
                </h3>
              </div>
              <p className="text-[11px] leading-relaxed text-red-100">
                Surat Edaran Kepala Sekolah Nomor: 421/089/2026 tentang Klarifikasi Berita Bohong Sidak Kebersihan.
              </p>
            </div>

            {/* Interactive Highlighter Tutorial Note */}
            <div className="bg-amber-500/15 border border-amber-500/30 p-2.5 rounded-xl flex items-start space-x-2 text-[11px] text-amber-700 dark:text-amber-300">
              <Highlighter size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Misi Cek Fakta (Jeda Kritis):</p>
                <p className="mt-0.5 text-[10.5px]">
                  Ketuk kalimat di bawah yang membuktikan secara sah bahwa berita libur adalah HOAX untuk menyorotnya (highlight) sebelum mengambil screenshot bukti.
                </p>
              </div>
            </div>

            {/* Circular Letter Paragraphs (Interactive Tap to Highlight) */}
            <div className={`p-3.5 rounded-2xl border space-y-3 ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              {/* Paragraph 1 */}
              <div 
                onClick={() => handleParagraphClick(1)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all border text-[11.5px] leading-relaxed ${
                  highlightedParagraph === 1
                    ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-100'
                    : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 border-transparent text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">Paragraf 1 (Pengantar):</span>
                "Menanggapi beredarnya pesan berantai di WhatsApp yang mengatasnamakan Dinas Kebersihan dan mengklaim adanya sidak kebersihan serentak yang meliburkan sekolah..."
              </div>

              {/* Paragraph 2 - TARGET FACT */}
              <div 
                onClick={() => handleParagraphClick(2)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all border-2 text-[12px] leading-relaxed font-semibold relative ${
                  highlightedParagraph === 2
                    ? 'bg-yellow-200 dark:bg-yellow-900/60 border-yellow-400 text-neutral-900 dark:text-yellow-100 shadow-md ring-2 ring-yellow-400/50'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 border-dashed border-emerald-300 dark:border-emerald-800 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Paragraf 2 (Pernyataan Kunci):
                  </span>
                  {highlightedParagraph === 2 && (
                    <span className="text-[9px] bg-yellow-400 text-black font-extrabold px-1.5 py-0.2 rounded shadow-sm">
                      TER-HIGHLIGHT ✨
                    </span>
                  )}
                </div>
                "DENGAN INI PIHAK SEKOLAH MENEGASKAN BAHWA BESOK KEGIATAN BELAJAR MENGAJAR (KBM) BERJALAN NORMAL SEPERTI BIASA. BERITA LIBUR TOTAL KARENA SIDAK KEBERSIHAN DINAS ADALAH HOAX (TIDAK BENAR) DAN BUKAN DARI PIHAK SEKOLAH."
              </div>

              {/* Paragraph 3 */}
              <div 
                onClick={() => handleParagraphClick(3)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all border text-[11.5px] leading-relaxed ${
                  highlightedParagraph === 3
                    ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-100'
                    : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 border-transparent text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="text-[10px] font-bold text-neutral-400 block mb-0.5">Paragraf 3 (Himbauan):</span>
                "Seluruh siswa diimbau untuk tidak menyebarluaskan pesan yang belum diverifikasi serta tidak mengklik tautan mencurigakan yang berpotensi menyusupkan malware atau pencurian akun Google."
              </div>
            </div>

            {/* Realtime Feedback Banner */}
            {highlightFeedback && (
              <div className="p-2 px-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-600 dark:text-blue-400 font-medium animate-in fade-in">
                {highlightFeedback}
              </div>
            )}

            {/* Screenshot Action Card */}
            {(!isScreenshotTaken && !hasProofScreenshot) ? (
              <div className={`p-3 rounded-2xl border-2 transition-all ${
                highlightedParagraph === 2
                  ? isDarkMode ? 'bg-blue-950/50 border-blue-500' : 'bg-blue-50 border-blue-400 shadow-md'
                  : isDarkMode ? 'bg-[#1c1c1e] border-neutral-800 opacity-60' : 'bg-gray-100 border-gray-300 opacity-70'
              }`}>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    highlightedParagraph === 2 ? 'bg-blue-600 animate-pulse' : 'bg-neutral-500'
                  }`}>
                    <Camera size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">
                      {highlightedParagraph === 2 ? '📸 Siap Ambil Screenshot Bukti' : '🔒 Sorot (Highlight) Paragraf Kunci Dulu'}
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      {highlightedParagraph === 2 
                        ? 'Tangkapan layar akan disimpan ke Galeri HP untuk dikirim ke WhatsApp.' 
                        : 'Ketuk Paragraf 2 di atas untuk mengaktifkan tombol tangkapan layar.'}
                    </p>
                  </div>
                </div>

                <Button 
                  disabled={highlightedParagraph !== 2}
                  onClick={handleCaptureScreenshot}
                  className={`w-full text-xs font-bold py-2 shadow-md flex items-center justify-center space-x-1.5 transition-all ${
                    highlightedParagraph === 2
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-98'
                      : 'bg-neutral-400 text-neutral-200 cursor-not-allowed'
                  }`}
                >
                  <Camera size={15} />
                  <span>Ambil Screenshot Bukti Resmi</span>
                </Button>
              </div>
            ) : (
              <div className={`p-3 rounded-2xl border space-y-2 animate-in zoom-in-95 duration-200 ${
                isDarkMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-100' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      BUKTI RESMI TERSIMPAN DI GALERI!
                    </h4>
                    <p className="text-[10px] text-neutral-400">Screenshot siap dilampirkan ke obrolan grup kelas.</p>
                  </div>
                </div>
                <Button 
                  onClick={handleReturnToChatWithProof}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 active:scale-98"
                >
                  <MessageCircle size={15} />
                  <span>Kembali ke WhatsApp & Kirim Bukti</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PHISHING BLOGSPOT SITE */}
        {currentView === 'fake_blog' && (
          <div className="p-3.5 space-y-3 animate-in fade-in duration-300">
            <div className="bg-rose-500/15 border border-rose-500/40 p-2.5 rounded-xl text-center text-rose-600 dark:text-rose-400">
              <div className="flex items-center justify-center space-x-1 text-xs font-bold">
                <ShieldAlert size={14} />
                <span>PERINGATAN: SITUS GRATISAN BERBAHAYA</span>
              </div>
              <p className="text-[10px] mt-0.5">Domain .blogspot.xyz bukan situs resmi instansi pemerintah (.go.id / .sch.id).</p>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-gray-300'
            }`}>
              <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">SPAM CLICKBAIT</span>
              <h2 className="text-xs font-bold text-red-600 leading-snug">
                HOT: SURAT EDARAN SIDAK DINAS KEBERSIHAN LIBUR TOTAL BESOK!
              </h2>
              <div className="p-3 bg-neutral-900 rounded-xl text-center space-y-1 text-neutral-300 text-xs border border-neutral-800">
                <p className="font-mono text-[11px] text-amber-400">⚡ Klaim Izin Libur 3 Hari</p>
                <p className="text-[10px] text-neutral-400">Bagikan tautan ini ke 10 grup WhatsApp untuk mengunduh dokumen!</p>
                <div className="w-full py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold mt-1">
                  [UNDUH IZIN_LIBUR.APK] ⚠️
                </div>
              </div>
              <p className="text-[10.5px] text-neutral-400 leading-relaxed">
                Tautan ini tidak memiliki stempel resmi dan sengaja memancing emosi gembira siswa agar menyebarkan malware.
              </p>
            </div>

            <Button 
              onClick={() => handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax')}
              className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              Cek Portal Resmi SMAN 1 Saja (.sch.id)
            </Button>
          </div>
        )}

        {/* VIEW 4: STUDENT FORUM (UNVERIFIED OPINIONS) */}
        {currentView === 'forum_pelajar' && (
          <div className="p-3.5 space-y-3 animate-in fade-in duration-300">
            <div className="bg-amber-500/15 border border-amber-500/30 p-2.5 rounded-xl text-amber-700 dark:text-amber-300 text-[11px]">
              <div className="flex items-center space-x-1 font-bold">
                <Info size={14} />
                <span>Forum Diskusi Pelajar (Bukan Sumber Resmi)</span>
              </div>
              <p className="text-[10px] mt-0.5">Opini dan perdebatan di forum media sosial tidak bisa dijadikan bukti keabsahan fakta.</p>
            </div>

            <div className={`p-3 rounded-2xl border divide-y ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800 divide-neutral-800' : 'bg-white border-gray-200 divide-gray-100'
            }`}>
              <div className="pb-2.5">
                <h3 className="font-bold text-xs text-blue-500">[Tanya] Besok SMAN 1 Beneran Libur Gak Sih Woy?</h3>
                <p className="text-[10px] text-neutral-400">Diposting oleh @rizky_99 • 15 menit lalu</p>
              </div>
              <div className="py-2 space-y-2 text-[11px]">
                <div className="p-2 rounded-lg bg-neutral-500/10">
                  <span className="font-bold text-emerald-500">@dina_chairwoman: </span>
                  <span>Ada yang kirim link blogspot ke aku katanya libur sidak kebersihan dinas, beneran gak ya?</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-500/10">
                  <span className="font-bold text-blue-500">@kevin_futsal: </span>
                  <span>Wah kalau libur jadwal tanding futsal gimana dong?</span>
                </div>
                <div className="p-2 rounded-lg bg-neutral-500/10">
                  <span className="font-bold text-amber-500">@bimo_tekno: </span>
                  <span>Woy jangan gampang kemakan hoax! Domain blogspot gratisan itu jebakan. Mending lo semua cek web resmi sekolah sman1-official.sch.id!</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax')}
              className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              Buka Web Resmi SMAN 1 Sesuai Saran Bimo
            </Button>
          </div>
        )}

        {/* VIEW 5: OUTDATED 2024 NEWS (IRRELEVANT ARCHIVE) */}
        {currentView === 'old_news' && (
          <div className="p-3.5 space-y-3 animate-in fade-in duration-300">
            <div className="bg-purple-500/15 border border-purple-500/30 p-2.5 rounded-xl text-purple-700 dark:text-purple-300 text-[11px]">
              <div className="flex items-center space-x-1 font-bold">
                <Clock size={14} />
                <span>Peringatan: Berita Kedaluwarsa (Arsip Lama)</span>
              </div>
              <p className="text-[10px] mt-0.5">Berita ini dipublikasikan pada tahun 2024 dan tidak ada sangkut pautnya dengan jadwal sekolah besok!</p>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-gray-200'
            }`}>
              <span className="text-[10px] text-neutral-400 font-mono">14 September 2024 • Rubrik Lingkungan</span>
              <h2 className="text-xs font-bold">Dinas Lingkungan Hidup Fogging Rutin di Sekolah</h2>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Pada tahun 2024 lalu, kegiatan penyemprotan dilakukan di akhir pekan tanpa meliburkan jam pelajaran sekolah. Pihak dinas menegaskan tidak pernah meliburkan sekolah secara mendadak lewat pesan WhatsApp.
              </p>
            </div>

            <Button 
              onClick={() => handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax')}
              className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
            >
              Buka Pengumuman Terbaru SMAN 1
            </Button>
          </div>
        )}

        {/* VIEW: IMAGE SEARCH (PINTEREST & STOCK ASSETS FOR LEVEL 2) */}
        {currentView === 'image_search' && (
          <div className="p-3.5 space-y-4 animate-in fade-in duration-300">
            <div className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                  P
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-none">Hasil Pencarian: "Maskot Rubah"</h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">3 gambar ditemukan • Perhatikan Lisensi HAKI!</p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full">
                Level 2 DSI
              </span>
            </div>

            {/* CARD 1: PINTEREST (COPYRIGHTED ARTIST ASSET) */}
            <div className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${
              isDarkMode ? 'bg-[#1c1c1e] border-rose-900/50' : 'bg-white border-rose-200'
            }`}>
              <div className="p-2.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-rose-500 font-bold text-[11px]">
                  <ShieldAlert size={14} />
                  <span>Karya Berhak Cipta (Pinterest)</span>
                </div>
                <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">
                  © All Rights Reserved
                </span>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="w-full h-36 bg-neutral-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-3 text-center border border-neutral-800">
                  <div className="text-4xl mb-1">🦊</div>
                  <p className="text-xs font-bold text-amber-400">Digital Fox Mascot - Character Design</p>
                  <p className="text-[10px] text-neutral-400">Oleh: Bayu Pratama (@art_by_bayu)</p>
                  <div className="absolute inset-x-0 bottom-1 flex justify-center">
                    <span className="text-[9px] text-neutral-500 font-mono">WATERMARK: © ART BY BAYU • DO NOT REPOST</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] leading-snug">
                    Ilustrasi rubah api keren karya seniman lokal. Terdapat watermark hak cipta di bagian bawah.
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-[10px] text-amber-600 dark:text-amber-400">
                    ⚠️ <strong>Pelanggaran Hak Cipta:</strong> Mengambil dan memotong watermark tanpa izin dapat berujung sengketa UU Hak Cipta dan mempermalukan sekolah di media sosial!
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectAsset('pinterest')}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 active:scale-98"
                >
                  Gunakan Gambar Ini (Potong Watermark)
                </Button>
              </div>
            </div>

            {/* CARD 2: CREATIVE COMMONS OPEN SOURCE ASSET */}
            <div className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${
              isDarkMode ? 'bg-[#1c1c1e] border-emerald-900/50' : 'bg-white border-emerald-200'
            }`}>
              <div className="p-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  <CheckCircle2 size={14} />
                  <span>Lisensi Terbuka (Creative Commons)</span>
                </div>
                <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                  CC-BY 4.0 Bebas Pakai
                </span>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="w-full h-36 bg-gradient-to-br from-emerald-900 to-teal-950 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-3 text-center border border-emerald-800">
                  <div className="text-4xl mb-1">🦊✨</div>
                  <p className="text-xs font-bold text-emerald-300">Geometric Fox Vector Art</p>
                  <p className="text-[10px] text-neutral-300">Freepik Open Asset • Lisensi Terbuka</p>
                  <div className="absolute inset-x-0 bottom-1 flex justify-center">
                    <span className="text-[9px] text-emerald-400/80 font-mono">LISENSI: Boleh digunakan dengan atribusi pencipta</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] leading-snug">
                    Vektor berkualitas tinggi yang dilepas oleh kreatornya dengan lisensi CC-BY untuk kepentingan publik dan edukasi.
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-[10px] text-emerald-600 dark:text-emerald-400">
                    ✅ <strong>Etika Legal Terpenuhi:</strong> Legal digunakan untuk poster sekolah dengan menyertakan kredit nama pembuat.
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectAsset('creative_commons')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 active:scale-98"
                >
                  Gunakan Vektor Creative Commons (Legal & Beretika)
                </Button>
              </div>
            </div>

            {/* CARD 3: TYPOGRAPHY MINIMALIST */}
            <div className={`border rounded-2xl overflow-hidden shadow-sm transition-all ${
              isDarkMode ? 'bg-[#1c1c1e] border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="p-2.5 bg-neutral-500/10 border-b border-neutral-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-neutral-400 font-bold text-[11px]">
                  <Sparkles size={14} />
                  <span>Desain Tipografi Murni (Tanpa Gambar Luar)</span>
                </div>
                <span className="text-[9px] bg-neutral-600 text-white font-bold px-1.5 py-0.5 rounded">
                  Orisinal
                </span>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="w-full h-28 bg-neutral-800 rounded-xl flex flex-col items-center justify-center p-3 text-center border border-neutral-700">
                  <h3 className="text-base font-black tracking-widest text-white">PENSI SMANSA 2026</h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Konsep Minimalis Font & Warna Saja</p>
                </div>

                <p className="text-[11px] leading-snug">
                  Tidak mengambil gambar dari manapun dan hanya mengandalkan teks font bawaan. Aman dari tuntutan hukum namun visual kurang menarik.
                </p>

                <Button
                  onClick={() => handleSelectAsset('plain')}
                  variant="outline"
                  className="w-full text-xs font-bold py-2 border-neutral-600 hover:bg-neutral-800"
                >
                  Pilih Konsep Tipografi Saja
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Safari-like Bottom Navigation Bar */}
      <div className={`border-t h-11 flex justify-between items-center px-4 text-blue-500 absolute bottom-0 inset-x-0 select-none z-20 ${
        isDarkMode ? 'bg-[#1c1c1e]/95 backdrop-blur border-neutral-800' : 'bg-gray-100/95 backdrop-blur border-gray-300'
      }`}>
        <button onClick={() => setCurrentView('search_home')} title="Cari"><ChevronLeft size={22} /></button>
        <button disabled className="opacity-30"><ChevronRight size={22} /></button>
        <button onClick={() => openApp('chat')} title="Bagikan ke Chat"><Share size={19} /></button>
        <button 
          onClick={() => setShowTabSwitcher(!showTabSwitcher)} 
          className="w-5 h-5 border-2 border-blue-500 rounded flex items-center justify-center font-bold text-[10px] active:scale-90 transition-transform"
          title="Kelola Tab Safari"
        >
          {showTabSwitcher ? '✕' : (hasFoundProof ? '2' : '1')}
        </button>
      </div>

      {/* SAFARI TAB SWITCHER OVERLAY */}
      {showTabSwitcher && (
        <div className="absolute inset-0 z-30 bg-neutral-900/90 backdrop-blur-md p-4 pt-12 pb-14 flex flex-col justify-between animate-in fade-in">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-700 text-white">
              <span className="font-bold text-xs">Tab Safari Terbuka</span>
              <button 
                onClick={() => setShowTabSwitcher(false)}
                className="text-xs text-blue-400 font-semibold"
              >
                Selesai
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Tab 1: Search */}
              <div 
                onClick={() => { setCurrentView('search_home'); setCurrentUrl('https://search.simos.net'); setShowTabSwitcher(false); }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  currentView === 'search_home' ? 'border-blue-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-800/60'
                }`}
              >
                <div className="h-24 bg-neutral-800 rounded-lg flex items-center justify-center mb-1.5 p-2 border border-neutral-700">
                  <Search size={24} className="text-blue-500" />
                </div>
                <p className="text-[11px] font-bold text-white truncate">Search SimOS</p>
                <p className="text-[9px] text-neutral-400">search.simos.net</p>
              </div>

              {/* Tab 2: School Portal or Pinterest */}
              <div 
                onClick={() => { 
                  if (isMission2) {
                    handleNavigate('image_search', 'https://pinterest.com/search/fox-mascot');
                  } else {
                    handleNavigate('school_official', 'https://sman1-official.sch.id/klarifikasi-hoax'); 
                  }
                  setShowTabSwitcher(false); 
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  (currentView === 'school_official' || currentView === 'image_search') ? 'border-blue-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-800/60'
                }`}
              >
                <div className="h-24 bg-neutral-800 rounded-lg flex items-center justify-center mb-1.5 p-2 text-white border border-neutral-700">
                  {isMission2 ? <Sparkles size={24} className="text-amber-400" /> : <ShieldCheck size={24} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] font-bold text-white truncate">
                  {isMission2 ? 'Pinterest Fox Mascot' : 'Portal SMAN 1'}
                </p>
                <p className="text-[9px] text-neutral-400">
                  {isMission2 ? 'pinterest.com' : 'sman1-official.sch.id'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => { setCurrentView('search_home'); setCurrentUrl('https://search.simos.net'); setShowTabSwitcher(false); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md"
            >
              + Buka Tab Baru
            </button>
          </div>
        </div>
      )}

      {/* Camera shutter flash effect when screenshot taken */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-300" />
      )}
    </div>
  );
}
