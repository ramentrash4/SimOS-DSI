import { useState, useEffect } from 'react';
import { useSimOSStore } from '@/store/simos';
import { useChatStore } from '@/store/chat';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Flag, 
  ShieldAlert, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstaPicApp() {
  const { openApp, isDarkMode } = useSimOSStore();
  const { advanceNode, script, status, currentNodeId, activeSessionId } = useChatStore();
  
  const missionId = script?.id || 'm2';
  
  // States for Level 3 interactive comment reporting
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [isCommentReported, setIsCommentReported] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeStory, setActiveStory] = useState<{ name: string; avatar: string; caption: string } | null>(null);

  // Reset local states when mission restarts or session changes
  useEffect(() => {
    setShowOptionsModal(false);
    setShowReportConfirm(false);
    setIsCommentReported(false);
    setLiked(false);
    setActiveStory(null);
  }, [activeSessionId]);

  // Level 3 Handlers
  const handleOpenCommentOptions = () => {
    setShowOptionsModal(true);
  };

  const handleSelectReport = () => {
    setShowOptionsModal(false);
    setShowReportConfirm(true);
  };

  const handleConfirmReport = () => {
    setShowReportConfirm(false);
    setIsCommentReported(true);
    useChatStore.getState().recordDecision({
      stepTitle: 'Moderasi Komentar Cyberbullying',
      prompt: 'Tindakan terhadap Komentar Pelecehan Maya',
      chosenText: 'Melaporkan Komentar ke Sistem InstaPic (Report Abuse)',
      points: 3,
      nodeId: 'instapic_report',
      alternatives: [
        { text: 'Melaporkan Komentar ke Sistem InstaPic', points: 3 },
        { text: 'Menyerang Balik Maya di Kolom Publik', points: 1 }
      ],
      causalityAnalysis: {
        riskLevel: 'Aman',
        mechanism: 'Menggunakan saluran moderasi resmi platform untuk membersihkan ujaran kebencian.',
        consequence: 'Komentar toksik ditinjau dan dihapus sistem tanpa memicu perkelahian terbuka.',
        bestPracticeRecommendation: 'Laporkan konten berbahaya kepada penyedia platform sebelum eskalasi meluas.'
      }
    });
  };

  const handleSendEmpatheticDM = () => {
    openApp('chat');
    advanceNode('node_dm_siska_start');
  };

  const handleAttackBack = () => {
    setShowOptionsModal(false);
    useChatStore.getState().recordDecision({
      stepTitle: 'Respons Agresi Publik',
      prompt: 'Reaksi terhadap Komentar Jahat Maya',
      chosenText: 'Menyerang Balik Maya dengan Makian di Ruang Publik',
      points: 1,
      nodeId: 'node_attack_back_partial',
      alternatives: [
        { text: 'Melaporkan Komentar ke Sistem InstaPic', points: 3 },
        { text: 'Menyerang Balik Maya di Kolom Publik', points: 1 }
      ],
      causalityAnalysis: {
        riskLevel: 'Sedang',
        mechanism: 'Membalas agresi dengan agresi verbal di kolom komentar publik (Flame War).',
        consequence: 'Memicu perang komentar massal dan mencoreng rekam jejak digital pribadi.',
        bestPracticeRecommendation: 'Jangan membalas kejahatan dengan ujaran kebencian. Gunakan pelaporan dan empati.'
      }
    });
    openApp('chat');
    advanceNode('node_attack_back_partial');
  };

  const stories = [
    { name: 'Cerita Anda', avatar: 'Player', caption: 'Sedang persiapan Pensi Sekolah...', isUser: true },
    { name: 'osis_sman1', avatar: 'OSIS', caption: 'H-3 Pentas Seni Tahunan! Jangan lewatkan panggung utama!' },
    { name: 'dina_a', avatar: 'Dina', caption: 'Lagi belajar buat ujian DSI besok 📚' },
    { name: 'siska_okt', avatar: 'Siska', caption: 'Selfie hari ini, semoga hari kalian menyenangkan ✨' },
    { name: 'rian_sie_acara', avatar: 'Rian', caption: 'Deadline poster pensi mepet banget woy!' },
    { name: 'lambe_sman1', avatar: 'Lambe', caption: 'Eits ada video viral baru nih di lingkungan sekolah 🤫' },
  ];

  return (
    <div className={`flex flex-col h-full relative animate-in zoom-in-95 duration-300 select-none ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-neutral-900'
    }`}>
      {/* Instagram iOS Top Navigation Bar */}
      <div className={`flex items-center justify-between px-3 py-2.5 border-b z-10 shadow-sm ${
        isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <button 
          onClick={() => openApp('home')} 
          className={`p-1 rounded-full active:scale-95 transition-transform ${
            isDarkMode ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-100 text-neutral-800'
          }`}
          title="Layar Utama"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center space-x-1">
          <span className="font-extrabold text-[16px] tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
            InstaPic
          </span>
        </div>
        <button 
          onClick={() => openApp('chat')} 
          className={`p-1 rounded-full relative ${
            isDarkMode ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-100 text-neutral-800'
          }`}
          title="Buka Obrolan"
        >
          <Send size={20} className="-rotate-12" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>
      </div>

      {/* Main Feed Content */}
      <div className={`flex-1 overflow-y-auto pb-16 ${
        isDarkMode ? 'bg-black' : 'bg-neutral-50'
      }`}>
        
        {/* Stories Bar */}
        <div className={`border-b p-2.5 px-3 flex items-center space-x-3 overflow-x-auto no-scrollbar ${
          isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          {stories.map((s, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveStory(s)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-full p-[2.5px] transition-transform group-hover:scale-105 active:scale-95 ${
                s.isUser 
                  ? 'border-2 border-dashed border-neutral-300' 
                  : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
              }`}>
                <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.avatar}`} 
                    alt={s.name} 
                    className="w-full h-full object-cover" 
                  />
                  {s.isUser && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px]">
                      +
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-neutral-700 mt-1 truncate w-14 text-center font-medium">
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* ============================================================== */}
        {/* SCENARIO FOR LEVEL 2: POSTER PENSI & HAKI                      */}
        {/* ============================================================== */}
        {missionId === 'm2' && (
          <div className="bg-white border-b border-neutral-200 pb-4 mb-4">
            {status === 'gameover' || currentNodeId?.includes('fatal') || currentNodeId?.includes('artist') ? (
              // HAKI DISASTER (PLAGIARISM CALLOUT)
              <div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=BayuArtist" alt="Artist" className="w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-xs text-neutral-900">art_by_bayu</span>
                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.2 rounded">Kreator Asli</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Jakarta Selatan • 12 menit yang lalu</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-neutral-500" />
                </div>

                {/* Stolen Artwork Comparison Banner */}
                <div className="w-full bg-neutral-950 p-4 text-center relative border-y border-red-500">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    BUKTI PENCURIAN KARYA
                  </div>
                  <div className="h-44 bg-neutral-900 rounded-xl flex flex-col items-center justify-center p-4 border border-neutral-800 text-neutral-300">
                    <ShieldAlert size={36} className="text-red-500 mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-red-400">MASKOT RUBAH BERHAK CIPTA DICURI</p>
                    <p className="text-[10px] text-neutral-400 mt-1">Dipakai tanpa lisensi oleh panitia pensi SMA Negeri 1</p>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="p-3">
                  <div className="flex justify-between items-center text-neutral-800 mb-2">
                    <div className="flex space-x-4">
                      <Heart size={22} className="text-red-500 fill-red-500" />
                      <MessageCircle size={22} />
                      <Send size={22} />
                    </div>
                    <Bookmark size={22} />
                  </div>
                  <p className="font-bold text-xs text-neutral-900">2,841 suka • 512 komentar</p>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed">
                    <span className="font-bold mr-1.5">art_by_bayu</span>
                    Sangat disayangkan sekelas SMA favorit terang-terangan mengambil karya ilustrasi berbayar saya dari Pinterest tanpa izin, memotong watermark, dan mencetaknya untuk baliho acara sekolah! Stop pembajakan karya seniman lokal! #HAKISekolah #StopPlagiarisme
                  </p>

                  {/* Angry Netizen Comments Flood */}
                  <div className="mt-3 space-y-2 border-t border-neutral-100 pt-2 text-xs">
                    <p><span className="font-bold text-neutral-900">desainer_lokal:</span> Malu-maluin banget panitianya, masa gak paham hak cipta?!</p>
                    <p><span className="font-bold text-neutral-900">alumni_sman1:</span> Astaga malu banget jadi alumni kalau sekolah nyolong karya orang 😭</p>
                    <p><span className="font-bold text-neutral-900">hukum_kreatif:</span> Ini jelas melanggar UU Hak Cipta No 28 Tahun 2014!</p>
                  </div>
                </div>
              </div>
            ) : (
              // LEGAL CREATIVE COMMONS POSTER
              <div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PensiOfficial" alt="OSIS" className="w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-neutral-900">osis_sman1_official</span>
                      <p className="text-[10px] text-neutral-400">Postingan Resmi • Baru saja</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-neutral-500" />
                </div>

                {/* Poster Graphic */}
                <div className="w-full aspect-square bg-gradient-to-br from-indigo-900 via-purple-900 to-neutral-900 flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
                    🦊
                  </div>
                  <h3 className="font-extrabold text-lg tracking-wider text-amber-300">PENTAS SENI 2026</h3>
                  <p className="text-xs text-purple-200 mt-1 font-mono">"Nyalakan Lentera Kreativitas"</p>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full mt-4 text-neutral-300 border border-white/20">
                    Aset Berlisensi: Creative Commons CC-BY 4.0
                  </span>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center text-neutral-800 mb-2">
                    <div className="flex space-x-4">
                      <button onClick={() => setLiked(!liked)}>
                        <Heart size={22} className={liked ? "text-red-500 fill-red-500" : ""} />
                      </button>
                      <MessageCircle size={22} />
                      <Send size={22} />
                    </div>
                    <Bookmark size={22} />
                  </div>
                  <p className="font-bold text-xs text-neutral-900">{liked ? '439' : '438'} suka</p>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed">
                    <span className="font-bold mr-1.5">osis_sman1_official</span>
                    Siap bergembira bersama di Pensi Akbar tahun ini! Terima kasih untuk tim desainer yang menggunakan aset resmi berlisensi terbuka dan menghargai HAKI! 🎨✨
                  </p>
                  <div className="mt-2 space-y-1 text-xs text-neutral-600">
                    <p><span className="font-bold text-neutral-800">maya_10:</span> Keren banget maskot rubahnya! Gak sabar nonton! 🎉</p>
                    <p><span className="font-bold text-neutral-800">andi_pratama:</span> Posternya estetik dan legal tanpa drama hak cipta, mantap!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENARIO FOR LEVEL 3: CYBERBULLYING & EMPATHY                   */}
        {/* ============================================================== */}
        {missionId === 'm3' && (
          <div className={`border-b pb-4 ${
            isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
          }`}>
            {/* Post Header: Siska */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 p-[2px]">
                  <div className={`w-full h-full rounded-full p-[2px] overflow-hidden ${
                    isDarkMode ? 'bg-black' : 'bg-white'
                  }`}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Siska" alt="Siska" className="w-full h-full" />
                  </div>
                </div>
                <div>
                  <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>siska_aurora</span>
                  <p className="text-[10px] text-neutral-400">SMA Negeri 1 • 2 jam yang lalu</p>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-neutral-400" />
            </div>

            {/* Siska's Selfie Photo */}
            <div className="w-full aspect-square bg-neutral-200 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" 
                alt="Selfie Siska" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Post Details */}
            <div className="p-3">
              <div className="flex justify-between items-center text-neutral-800 mb-2">
                <div className="flex space-x-4">
                  <button onClick={() => setLiked(!liked)}>
                    <Heart size={22} className={liked ? "text-red-500 fill-red-500" : ""} />
                  </button>
                  <MessageCircle size={22} />
                  <Send size={22} />
                </div>
                <Bookmark size={22} />
              </div>
              <p className="font-bold text-xs text-neutral-900">{liked ? '53' : '52'} suka</p>
              <p className="text-xs text-neutral-800 mt-1">
                <span className="font-bold mr-1.5">siska_aurora</span>
                Belajar seharian di perpus buat persiapan ujian besok... semangat semuanya! 📚🌸
              </p>

              {/* COMMENTS SECTION */}
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-3">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Kolom Komentar (3):
                </p>

                {/* BULLY COMMENT (MAYA) */}
                {!isCommentReported ? (
                  <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-2.5 flex items-start justify-between">
                    <div className="flex space-x-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-300 flex-shrink-0 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya" className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-neutral-900">maya_queenbee</span>
                          <span className="text-[9px] bg-rose-100 text-rose-600 font-bold px-1 rounded">Body Shaming</span>
                        </div>
                        <p className="text-xs text-rose-950 mt-0.5 leading-snug">
                          "Aslinya dekil, pakai filter apa nih mulus amat wkwk. Bikin ilfeel aja!"
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-1">
                          <span>45m</span>
                          <button onClick={handleOpenCommentOptions} className="font-semibold text-neutral-600 hover:text-neutral-900">
                            Tindakan
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleOpenCommentOptions}
                      className="p-1 hover:bg-rose-100 rounded text-neutral-500 hover:text-neutral-800"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ) : (
                  // COMMENT HIDDEN AFTER REPORT
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2.5 animate-in fade-in">
                    <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Komentar Berhasil Dilaporkan & Dihapus</p>
                      <p className="text-[10px] text-emerald-600">Sistem InstaPic telah menyembunyikan komentar perundungan ini.</p>
                    </div>
                  </div>
                )}

                {/* Friendly other comment */}
                <div className="flex items-start space-x-2.5 text-xs text-neutral-700 px-1">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Budi" className="w-full h-full" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 mr-1.5">budi_santoso:</span>
                    Semangat belajarnya Sis!
                  </div>
                </div>
              </div>

              {/* ACTION CALLOUT AFTER REPORT */}
              {isCommentReported && (
                <div className="mt-4 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-center animate-in slide-in-from-bottom-2">
                  <p className="text-xs font-bold text-blue-900">
                    Langkah 2: Berikan Dukungan Moral Privat
                  </p>
                  <p className="text-[11px] text-blue-700">
                    Siska mungkin merasa terluka dan tertekan. Segera buka Chatter untuk mengirim pesan empati secara pribadi.
                  </p>
                  <Button 
                    onClick={handleSendEmpatheticDM}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    Buka Chatter & Kirim DM ke Siska
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCENARIO FOR LEVEL 5: DIGITAL FOOTPRINT & CANCEL CULTURE       */}
        {/* ============================================================== */}
        {missionId === 'm5' && (
          <div className="bg-white border-b border-neutral-200 pb-4">
            {status === 'success' || currentNodeId?.includes('respect') || currentNodeId?.includes('relieved') || currentNodeId?.includes('video') ? (
              // BUDI'S VIDEO KLARIFIKASI (PERFECT ENDING)
              <div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px]">
                      <div className="w-full h-full bg-white rounded-full p-[2px] overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Budi" className="w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-xs text-neutral-900">budi_santoso</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">Calon Ketua OSIS</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Postingan Resmi • Baru saja</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-neutral-500" />
                </div>

                {/* Video Mockup Player */}
                <div className="w-full aspect-video bg-neutral-900 relative flex flex-col items-center justify-center p-4 text-white overflow-hidden shadow-inner">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg mb-2">
                    <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-white ml-1"></div>
                  </div>
                  <span className="text-xs font-bold text-neutral-200">Klarifikasi & Permohonan Maaf Terbuka</span>
                  <span className="text-[10px] text-neutral-400 mt-1 font-mono">03:42 • Diputar 2.4rb kali</span>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center text-neutral-800 mb-2">
                    <div className="flex space-x-4">
                      <Heart size={22} className="text-red-500 fill-red-500" />
                      <MessageCircle size={22} />
                      <Send size={22} />
                    </div>
                    <Bookmark size={22} />
                  </div>
                  <p className="font-bold text-xs text-neutral-900">1,842 suka • 218 komentar</p>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed">
                    <span className="font-bold mr-1.5">budi_santoso</span>
                    Dengan tulus saya memohon maaf kepada Bapak/Ibu Guru dan seluruh warga sekolah atas perkataan buruk saya 3 tahun lalu. Masa lalu tidak bisa diubah, namun saya berkomitmen membuktikan kedewasaan dan integritas saya hari ini. Terima kasih atas bimbingannya.
                  </p>

                  <div className="mt-3 space-y-2 border-t border-neutral-100 pt-2 text-xs">
                    <p><span className="font-bold text-indigo-700">pak_guru_informatika:</span> Bapak bangga padamu, Budi. Berani mengakui kesalahan dan bertanggung jawab adalah tanda pemimpin sejati.</p>
                    <p><span className="font-bold text-neutral-900">siska_aurora:</span> Ksatria banget kak Budi! Semangat terus, kami tetap dukung! 👏✨</p>
                    <p><span className="font-bold text-neutral-900">ketua_mpk:</span> Kedewasaan sikap seperti ini yang kita butuhkan di OSIS.</p>
                  </div>
                </div>
              </div>
            ) : (
              // SCANDAL EXPOSE (LAMBE SMAN 1)
              <div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                      LS
                    </div>
                    <div>
                      <span className="font-bold text-xs text-neutral-900">lambe_sman1_official</span>
                      <p className="text-[10px] text-neutral-400">Akun Gosip Siswa • 1 jam yang lalu</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-neutral-500" />
                </div>

                {/* Exposed Old Screenshot Banner */}
                <div className="w-full bg-neutral-900 p-4 border-y border-amber-500/50">
                  <div className="bg-white rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="text-[10px] font-mono text-neutral-400">Screenshot: 3 Tahun Lalu (Kelas 7 SMP)</span>
                      <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1 rounded">JEJAK DIGITAL</span>
                    </div>
                    <p className="text-xs font-mono text-neutral-800 leading-relaxed">
                      "Guru MTK rese banget ngasih PR seabrek, guru gak jelas dasar orang tua kolot!" 🤬
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-2 font-mono">Diposting oleh: @budi_santoso (Akun Lama)</p>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-center text-neutral-800 mb-2">
                    <div className="flex space-x-4">
                      <Heart size={22} className="text-red-500 fill-red-500" />
                      <MessageCircle size={22} />
                      <Send size={22} />
                    </div>
                    <Bookmark size={22} />
                  </div>
                  <p className="font-bold text-xs text-neutral-900">1,210 suka • 342 komentar</p>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed">
                    <span className="font-bold mr-1.5">lambe_sman1_official</span>
                    BOCOR! Calon Ketua OSIS nomor urut 1 ternyata punya rekam jejak digital menghina guru di masa lalu. Apakah layak memimpin siswa sekolah kita?! #PemilihanOSIS #JejakDigital
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* BOTTOM SHEET MODAL: COMMENT ACTIONS (FOR LEVEL 3)             */}
      {/* ============================================================== */}
      {showOptionsModal && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-4 animate-in slide-in-from-bottom-4 space-y-2 border-t border-neutral-200">
            <div className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
            <p className="text-xs font-bold text-neutral-500 text-center uppercase tracking-wider mb-2">
              Tindakan Komentar Maya:
            </p>

            <button 
              onClick={handleSelectReport}
              className="w-full text-left p-3.5 text-[14px] font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center border border-red-100 transition-colors"
            >
              <Flag size={18} className="mr-2.5 text-red-600" />
              Laporkan Komentar (Perundungan / Cyberbullying)
            </button>

            <button 
              onClick={handleAttackBack}
              className="w-full text-left p-3.5 text-[13.5px] font-medium text-neutral-800 hover:bg-neutral-100 rounded-xl flex items-center border border-neutral-200 transition-colors"
            >
              <AlertTriangle size={18} className="mr-2.5 text-amber-500" />
              Balas Menyerang Balik di Publik (Adu Mulut)
            </button>

            <button 
              onClick={() => {
                setShowOptionsModal(false);
                openApp('chat');
                advanceNode('node_bystander_fatal');
              }}
              className="w-full text-left p-3.5 text-[13px] font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl flex items-center border border-neutral-200 transition-colors"
            >
              <ShieldAlert size={18} className="mr-2.5 text-neutral-400" />
              Abaikan Saja / Pura-pura Tidak Tahu (Bystander)
            </button>

            <button 
              onClick={() => setShowOptionsModal(false)}
              className="w-full text-center p-3 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION REPORT DIALOG */}
      {showReportConfirm && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full p-4.5 text-center space-y-3 shadow-2xl border border-neutral-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
              <Flag size={24} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900">Laporkan Komentar Maya?</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Komentar ini akan dilaporkan atas pelanggaran <strong>Perundungan Siber (Cyberbullying) & Body Shaming</strong> dan disembunyikan dari linimasa.
            </p>
            <div className="space-y-2 pt-2">
              <Button 
                onClick={handleConfirmReport}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 shadow-md shadow-red-500/20"
              >
                Konfirmasi Laporkan
              </Button>
              <Button 
                onClick={() => setShowReportConfirm(false)}
                variant="outline" 
                className="w-full text-xs"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Instagram Tab Bar */}
      <div className={`border-t px-6 py-2 flex items-center justify-between z-20 ${
        isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
      }`}>
        <button onClick={() => openApp('home')} className={`p-1 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>
          <ChevronLeft size={20} className="hidden" />
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.099l10 9.091v10.81h-7v-6h-6v6h-7v-10.81l10-9.091zm0-2.099l-12 10.909v13.091h9v-6h6v6h9v-13.091l-12-10.909z"/></svg>
        </button>
        <button className={`p-1 ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}>
          <Search size={20} />
        </button>
        <button className={`p-1 ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}>
          <Plus size={22} className="border-2 border-current rounded-md p-0.5" />
        </button>
        <button className={`p-1 ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}>
          <Heart size={20} />
        </button>
        <button className={`p-1 ${isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}>
          <User size={20} />
        </button>
      </div>

      {/* STORY PREVIEW MODAL */}
      {activeStory && (
        <div 
          onClick={() => setActiveStory(null)}
          className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 animate-in fade-in select-none text-white cursor-pointer"
        >
          {/* Story Progress Bar */}
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3">
            <div className="bg-white h-full w-2/3 animate-pulse"></div>
          </div>

          {/* User Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeStory.avatar}`} 
                  alt={activeStory.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-bold text-xs">{activeStory.name}</p>
                <p className="text-[10px] text-white/60">3 jam yang lalu</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveStory(null); }}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Story Image Simulation */}
          <div className="flex-1 my-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-1 mb-4">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeStory.avatar}`} 
                alt="Story" 
                className="w-full h-full rounded-full bg-white" 
              />
            </div>
            <p className="text-sm font-semibold max-w-xs">{activeStory.caption}</p>
            <p className="text-[11px] text-white/50 mt-2">Ketuk layar di mana saja untuk menutup</p>
          </div>

          {/* Reply Bar */}
          <div className="flex items-center space-x-2 pt-2">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs text-white/60">
              Kirim balasan ke {activeStory.name}...
            </div>
            <Heart size={20} className="text-white hover:text-red-500" />
            <Send size={20} className="text-white -rotate-12" />
          </div>
        </div>
      )}

    </div>
  );
}
