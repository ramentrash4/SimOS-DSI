import { useState, useEffect } from 'react';
import { useSimOSStore } from '@/store/simos';
import { useChatStore } from '@/store/chat';
import { sfx } from '@/utils/audio';
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
  X,
  Flame,
  Phone,
  Video,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InstaPicApp() {
  const { openApp, isDarkMode, showBanner } = useSimOSStore();
  const { advanceNode, script, status, currentNodeId, activeSessionId, highlightedDecisionNodeId } = useChatStore();
  
  const missionId = script?.id || 'm2';
  
  // States for Level 3 interactive comment reporting & Flame War
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [isCommentReported, setIsCommentReported] = useState(false);
  const [isFlameWarActive, setIsFlameWarActive] = useState(false);
  const [flameWarStep, setFlameWarStep] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [activeStory, setActiveStory] = useState<{ name: string; avatar: string; caption: string } | null>(null);

  // States for Level 5 interactive footprint analysis
  const [timelineYear, setTimelineYear] = useState<'2023' | '2026'>('2023');
  const [showFootprintAnalyzer, setShowFootprintAnalyzer] = useState(false);

  // States for Instagram Direct (Chat IG) & Flame War DMs
  const [igView, setIgView] = useState<'feed' | 'dm_inbox' | 'dm_chat'>('feed');
  const [activeDmUser, setActiveDmUser] = useState<'maya' | 'siska' | 'kenzo' | 'lambe' | null>(null);
  const [isMayaBlocked, setIsMayaBlocked] = useState(false);
  const [newDmMessage, setNewDmMessage] = useState('');
  const [extraDmMessages, setExtraDmMessages] = useState<Array<{ sender: 'player' | 'maya'; text: string; time: string }>>([]);

  // Reset local states when mission restarts or session changes
  useEffect(() => {
    setShowOptionsModal(false);
    setShowReportConfirm(false);
    setIsCommentReported(false);
    setIsFlameWarActive(false);
    setFlameWarStep(0);
    setLiked(false);
    setActiveStory(null);
    setTimelineYear('2023');
    setShowFootprintAnalyzer(false);
    setIgView('feed');
    setActiveDmUser(null);
    setIsMayaBlocked(false);
    setNewDmMessage('');
    setExtraDmMessages([]);
  }, [activeSessionId]);

  // Synchronize Flame War state with current game node or review highlight
  useEffect(() => {
    if (
      currentNodeId === 'node_attack_back_partial' || 
      currentNodeId === 'node_system_flame_war' || 
      highlightedDecisionNodeId === 'node_attack_back_partial' ||
      highlightedDecisionNodeId === 'flame_war'
    ) {
      setIsFlameWarActive(true);
      if (flameWarStep < 4) {
        setFlameWarStep(4);
      }
    }
  }, [currentNodeId, highlightedDecisionNodeId, flameWarStep]);

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
    sfx.playCamera();
    sfx.playSuccess();

    useChatStore.getState().recordDecision({
      stepTitle: 'Moderasi Komentar Cyberbullying',
      prompt: 'Tindakan terhadap Komentar Pelecehan Maya',
      chosenText: 'Melaporkan Komentar ke Sistem InstaPic (Report Abuse)',
      points: 3,
      nodeId: 'instapic_report',
      targetApp: 'instapic',
      targetView: 'report_confirmed',
      alternatives: [
        { text: 'Melaporkan Komentar ke Sistem InstaPic (Report)', points: 3 },
        { text: 'Menyerang Balik Maya di Kolom Publik (Flame War)', points: 1 }
      ],
      causalityAnalysis: {
        riskLevel: 'Aman',
        mechanism: 'Menggunakan saluran moderasi resmi platform untuk membersihkan ujaran kebencian.',
        consequence: 'Komentar toksik ditinjau dan dihapus sistem tanpa memicu perkelahian terbuka.',
        bestPracticeRecommendation: 'Laporkan konten berbahaya kepada penyedia platform sebelum eskalasi meluas.'
      }
    });

    showBanner({
      app: 'instapic',
      sender: 'InstaPic Support',
      text: '🛡️ Laporan diterima: Komentar telah disembunyikan dan ditinjau.'
    });
  };

  const handleSendEmpatheticDM = () => {
    useSimOSStore.getState().setActiveContactId('active');
    openApp('chat');
    advanceNode('node_dm_siska_start');
  };

  const handleAttackBack = () => {
    setShowOptionsModal(false);
    setIsFlameWarActive(true);
    setFlameWarStep(1);
    sfx.playSend();

    useChatStore.getState().recordDecision({
      stepTitle: 'Respons Agresi Publik (Flame War)',
      prompt: 'Reaksi terhadap Komentar Jahat Maya',
      chosenText: 'Menyerang Balik Maya dengan Makian di Kolom Publik',
      points: 1,
      nodeId: 'node_attack_back_partial',
      targetApp: 'instapic',
      targetView: 'flame_war',
      alternatives: [
        { text: 'Melaporkan Komentar ke Sistem InstaPic (Report)', points: 3 },
        { text: 'Menyerang Balik Maya di Kolom Publik (Flame War)', points: 1 }
      ],
      causalityAnalysis: {
        riskLevel: 'Sedang',
        mechanism: 'Membalas agresi dengan agresi verbal di kolom komentar publik (Flame War).',
        consequence: 'Memicu perang komentar massal, mempermalukan nama sekolah, dan mencoreng rekam jejak digital pribadi.',
        bestPracticeRecommendation: 'Jangan membalas kejahatan dengan ujaran kebencian. Gunakan saluran pelaporan resmi dan empati privat.'
      }
    });

    // Step 2: Maya fires back in real-time
    setTimeout(() => {
      setFlameWarStep(2);
      sfx.playGlitch();
      useSimOSStore.getState().setGlitchLevel(1);
    }, 900);

    // Step 3: Peer dogpile
    setTimeout(() => {
      setFlameWarStep(3);
      sfx.playNotification();
    }, 2000);

    // Step 4: Teacher BK Intervention
    setTimeout(() => {
      setFlameWarStep(4);
      sfx.playNotification();
      showBanner({
        app: 'chat',
        sender: 'Pak Guru BK / Wali Kelas',
        text: 'Bapak memantau kegaduhan dan makian kalian di IG Siska! Besok pagi ke ruang BK!'
      });
    }, 3200);
  };

  const handleSendDm = () => {
    if (!newDmMessage.trim()) return;
    const playerMsg = newDmMessage.trim();
    setNewDmMessage('');
    sfx.playSend();

    setExtraDmMessages(prev => [
      ...prev,
      { sender: 'player', text: playerMsg, time: 'Baru saja' }
    ]);

    if (activeDmUser === 'maya' && !isMayaBlocked) {
      setTimeout(() => {
        sfx.playNotification();
        setExtraDmMessages(prev => [
          ...prev,
          {
            sender: 'maya',
            text: 'Dih gak usah sok ceramah lu! Liat aja besok di sekolah ya!',
            time: 'Baru saja'
          }
        ]);
      }, 1000);
    }
  };

  const handleBlockMaya = () => {
    setIsMayaBlocked(true);
    sfx.playSuccess();
    showBanner({
      app: 'instapic',
      sender: 'InstaPic Safety Center',
      text: '🛡️ Pengguna @maya_queenbee telah berhasil diblokir dan dilaporkan atas pelecehan verbal.'
    });
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
      {/* Instagram iOS Top Navigation Bar - DYNAMIC BASED ON igView */}
      {igView === 'feed' && (
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
            onClick={() => setIgView('dm_inbox')} 
            className={`p-1 rounded-full relative active:scale-95 transition-transform ${
              isDarkMode ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-100 text-neutral-800'
            }`}
            title="Pesan Langsung (Chat IG)"
          >
            <Send size={20} className="-rotate-12" />
            {(isFlameWarActive || missionId === 'm3') && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-black"></span>
            )}
          </button>
        </div>
      )}

      {igView === 'dm_inbox' && (
        <div className={`flex items-center justify-between px-3 py-2.5 border-b z-10 shadow-sm ${
          isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIgView('feed')} 
              className={`p-1 rounded-full active:scale-95 transition-transform ${
                isDarkMode ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
              title="Kembali ke Beranda"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="font-extrabold text-[15px] tracking-tight">
              Pesan Langsung (Chat IG)
            </span>
          </div>
          <span className="text-xs font-semibold text-neutral-400">@player</span>
        </div>
      )}

      {igView === 'dm_chat' && (
        <div className={`flex items-center justify-between px-3 py-2 border-b z-10 shadow-sm ${
          isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center space-x-2.5 min-w-0">
            <button 
              onClick={() => setIgView('dm_inbox')} 
              className={`p-1 rounded-full active:scale-95 transition-transform ${
                isDarkMode ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 ring-1 ring-neutral-400 flex-shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                  activeDmUser === 'maya' ? 'Maya' : activeDmUser === 'siska' ? 'Siska' : activeDmUser === 'kenzo' ? 'Kenzo' : 'Lambe'
                }`} 
                alt="Avatar" 
                className="w-full h-full"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs leading-none truncate">
                {activeDmUser === 'maya' ? 'maya_queenbee' : activeDmUser === 'siska' ? 'siska_aurora' : activeDmUser === 'kenzo' ? 'art_by_kenzo' : 'lambe_sman1'}
              </p>
              <p className="text-[10px] text-emerald-500 font-medium leading-tight mt-0.5">
                {isMayaBlocked && activeDmUser === 'maya' ? 'Diblokir' : 'Aktif sekarang'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-neutral-400">
            <button title="Panggilan Suara" onClick={() => showBanner({ app: 'instapic', sender: 'InstaPic', text: 'Panggilan dinonaktifkan demi privasi.' })}>
              <Phone size={17} />
            </button>
            <button title="Panggilan Video" onClick={() => showBanner({ app: 'instapic', sender: 'InstaPic', text: 'Panggilan video dinonaktifkan demi privasi.' })}>
              <Video size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {igView === 'feed' && (
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
          <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4">
            {status === 'gameover' || currentNodeId?.includes('fatal') || currentNodeId?.includes('artist') || highlightedDecisionNodeId === 'node_steal_pinterest_fatal' ? (
              // HAKI DISASTER (PLAGIARISM CALLOUT)
              <div>
                {highlightedDecisionNodeId === 'node_steal_pinterest_fatal' && (
                  <div className="bg-rose-600 text-white p-2.5 text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1">
                    <ShieldAlert size={14} />
                    <span>Langkah Keputusan: Pelanggaran Hak Cipta Memotong Watermark</span>
                  </div>
                )}
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
                {highlightedDecisionNodeId === 'node_use_creative_commons' && (
                  <div className="bg-emerald-600 text-white p-2.5 text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Langkah Keputusan: Menggunakan Aset Berlisensi Terbuka (Legal & Beretika)</span>
                  </div>
                )}
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
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Kolom Komentar ({isFlameWarActive ? (flameWarStep >= 3 ? '58' : '19') : (isCommentReported ? '2' : '3')}):
                  </p>
                  {isFlameWarActive && (
                    <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-500 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center animate-pulse">
                      <Flame size={11} className="mr-1 text-red-500" />
                      FLAME WAR MELEDAK
                    </span>
                  )}
                </div>

                {/* FLAME WAR DRAMATIC BANNER */}
                {isFlameWarActive && (
                  <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-3 rounded-2xl shadow-lg shadow-rose-500/30 space-y-1 animate-in zoom-in-95 border border-rose-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 font-black text-xs uppercase tracking-wide">
                        <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
                        <span>PERANG KOMENTAR SENGIT (FLAME WAR)</span>
                      </div>
                      <span className="text-[9px] bg-black/40 px-2 py-0.5 rounded-full font-mono font-bold">
                        Eskalasi: Tinggi
                      </span>
                    </div>
                    <p className="text-[10px] text-rose-100 leading-tight">
                      Saling lempar makian fisik di linimasa terbuka menciptakan jejak digital toksik permanen dan disaksikan seluruh warga sekolah!
                    </p>
                  </div>
                )}

                {/* DM LABRAKAN BUTTON CALLOUT */}
                {isFlameWarActive && (
                  <div className="bg-gradient-to-r from-rose-950/70 via-red-950/70 to-purple-950/70 border-2 border-rose-500 rounded-2xl p-3 space-y-2 animate-in zoom-in-95 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-rose-400 font-extrabold text-xs">
                        <Flame size={15} className="text-red-500 animate-bounce" />
                        <span>PERANG MERAMBAT KE CHAT IG (DM)</span>
                      </div>
                      <span className="text-[9px] bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                        1 DM Baru
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-snug">
                      Maya melabrakmu lewat pesan langsung: <em>"Woy siapa lo ikut campur urusan gue?!"</em>
                    </p>
                    <button 
                      onClick={() => { setActiveDmUser('maya'); setIgView('dm_chat'); }}
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all"
                    >
                      <MessageCircle size={15} />
                      <span>Buka & Lihat Labrakan di Chat DM Maya (@maya_queenbee)</span>
                    </button>
                  </div>
                )}

                {/* BULLY COMMENT (MAYA) */}
                {!isCommentReported ? (
                  <div className={`rounded-xl p-2.5 flex items-start justify-between transition-all ${
                    isFlameWarActive
                      ? 'bg-rose-950/40 border-2 border-rose-500/80 text-rose-100 shadow-sm'
                      : 'bg-rose-50/60 border border-rose-200/80'
                  }`}>
                    <div className="flex space-x-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-300 flex-shrink-0 overflow-hidden ring-1 ring-rose-400">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya" className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white">maya_queenbee</span>
                          <span className="text-[9px] bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-bold px-1 rounded">Pemantik Bully</span>
                        </div>
                        <p className="text-xs text-rose-950 dark:text-rose-100 mt-0.5 leading-snug">
                          "Aslinya dekil, pakai filter apa nih mulus amat wkwk. Bikin ilfeel aja!"
                        </p>
                        <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-1">
                          <span>45m</span>
                          {!isFlameWarActive && (
                            <button onClick={handleOpenCommentOptions} className="font-semibold text-neutral-600 dark:text-neutral-300 hover:underline">
                              Tindakan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isFlameWarActive && (
                      <button 
                        onClick={handleOpenCommentOptions}
                        className="p-1 hover:bg-rose-100 rounded text-neutral-500 hover:text-neutral-800"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  // COMMENT HIDDEN AFTER REPORT
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center space-x-2.5 animate-in fade-in">
                    <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Komentar Berhasil Dilaporkan & Dihapus</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Sistem InstaPic telah menyembunyikan komentar perundungan ini.</p>
                    </div>
                  </div>
                )}

                {/* FLAME WAR STEP 1: PLAYER AGGRESSIVE REPLY */}
                {isFlameWarActive && flameWarStep >= 1 && (
                  <div className="bg-rose-500/15 border-2 border-rose-500/80 rounded-xl p-2.5 flex items-start space-x-2.5 animate-in slide-in-from-bottom-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow">
                      Anda
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white">Anda (Pemain)</span>
                        <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">Membalas Makian</span>
                      </div>
                      <p className="text-xs text-red-950 dark:text-red-200 mt-0.5 leading-snug font-semibold">
                        "@maya_queenbee Maksud lo apa ngatain Siska?! Muka lo sendiri tuh kayak dakocan, sok cantik banget jadi cewek! Ngaca dulu deh!"
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1">Baru saja • Dibalas secara publik</p>
                    </div>
                  </div>
                )}

                {/* FLAME WAR STEP 2: MAYA RETALIATES WITH POISON */}
                {isFlameWarActive && flameWarStep >= 2 && (
                  <div className="bg-rose-500/20 border-2 border-rose-500 rounded-xl p-2.5 flex items-start space-x-2.5 animate-in slide-in-from-bottom-2 shadow-md">
                    <div className="w-7 h-7 rounded-full bg-neutral-300 flex-shrink-0 overflow-hidden ring-2 ring-rose-500">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya" className="w-full h-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-rose-600 dark:text-rose-400 font-black">maya_queenbee</span>
                        <span className="text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded animate-pulse">Menyerang Balik</span>
                      </div>
                      <p className="text-xs text-rose-950 dark:text-rose-100 mt-0.5 leading-snug font-bold">
                        "@player Dih siapa lo ikut campur urusan orang?! Temen lo aja yang baperan, gak usah sok jadi pahlawan kesiangan! Lu berdua sama-sama caper & norak! 🤮🔥"
                      </p>
                      <p className="text-[10px] text-rose-400 mt-1 font-mono">15 detik yang lalu • 14 suka</p>
                    </div>
                  </div>
                )}

                {/* FLAME WAR STEP 3: PEERS & SPECTATORS DOGPILE */}
                {isFlameWarActive && flameWarStep >= 3 && (
                  <div className="space-y-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 animate-in fade-in">
                    <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Keisha" alt="Keisha" className="w-full h-full" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white mr-1.5">keisha_glam:</span>
                        Wkwkwk ada yang kepanasan nih gengs 🔥 hajar terus May!
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reza" alt="Reza" className="w-full h-full" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white mr-1.5">reza_futsal:</span>
                        Waduh rame bener woy, gelar tiker dulu popcorn ready 🍿🍿
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dina" alt="Dina" className="w-full h-full" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white mr-1.5">dina_chair:</span>
                        Woy stop woy! Ini kolom komentar publik, malu dibaca guru dan adik kelas!
                      </div>
                    </div>
                  </div>
                )}

                {/* FLAME WAR STEP 4: BK TEACHER INTERVENTION & DEBRIEF LINK */}
                {isFlameWarActive && flameWarStep >= 4 && (
                  <div className="mt-3 p-3.5 bg-amber-500/15 border-2 border-amber-500 rounded-2xl space-y-2 animate-in zoom-in-95 shadow-lg">
                    <div className="flex items-center space-x-2 text-amber-500 font-extrabold text-xs">
                      <AlertTriangle size={18} />
                      <span>PERINGATAN RESMI GURU BK / WALI KELAS</span>
                    </div>
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      <strong>Pak Guru BK:</strong> "Bapak menerima laporan dan melihat langsung adu mulut kasar kalian di linimasa IG Siska. Tindakan saling menghina fisik melanggar aturan tata tertib digital sekolah. Besok pagi kalian berdua dipanggil ke ruang BK!"
                    </p>
                    <Button 
                      onClick={() => {
                        advanceNode('node_teacher_debrief_partial');
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 shadow-md shadow-amber-500/20 active:scale-98"
                    >
                      Buka Rapat BK & Lihat Hasil Evaluasi (Debrief)
                      <ArrowRight size={14} className="ml-1.5" />
                    </Button>
                  </div>
                )}

                {/* Friendly other comment (when no flame war) */}
                {!isFlameWarActive && (
                  <div className="flex items-start space-x-2.5 text-xs text-neutral-700 dark:text-neutral-300 px-1">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Budi" className="w-full h-full" />
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white mr-1.5">budi_santoso:</span>
                      Semangat belajarnya Sis!
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION CALLOUT AFTER REPORT */}
              {isCommentReported && (
                <div className="mt-4 p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2 text-center animate-in slide-in-from-bottom-2">
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    Langkah 2: Berikan Dukungan Moral Privat
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400">
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
            {status === 'success' || currentNodeId?.includes('respect') || currentNodeId?.includes('relieved') || currentNodeId?.includes('video') || highlightedDecisionNodeId === 'node_apology_mature_success' ? (
              // BUDI'S VIDEO KLARIFIKASI (PERFECT ENDING)
              <div>
                {highlightedDecisionNodeId === 'node_apology_mature_success' && (
                  <div className="bg-emerald-600 text-white p-2.5 text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Langkah Keputusan: Video Permohonan Maaf Tulus & Bertanggung Jawab</span>
                  </div>
                )}
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

                  {/* Public Sentiment Meter */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span className="text-emerald-700 dark:text-emerald-300">Sentimen Komunitas Sekolah:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">94% Respek & Memaafkan</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '94%' }} />
                      <div className="h-full bg-rose-400 rounded-r-full" style={{ width: '6%' }} />
                    </div>
                    <p className="text-[9.5px] text-neutral-500 dark:text-neutral-400">
                      Keberanian bertanggung jawab secara jujur menyelamatkan integritas Budi di mata guru dan siswa.
                    </p>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-2 text-xs">
                    <p><span className="font-bold text-indigo-700 dark:text-indigo-400">pak_guru_informatika:</span> Bapak bangga padamu, Budi. Berani mengakui kesalahan dan bertanggung jawab adalah tanda pemimpin sejati.</p>
                    <p><span className="font-bold text-neutral-900 dark:text-neutral-100">siska_aurora:</span> Ksatria banget kak Budi! Semangat terus, kami tetap dukung! 👏✨</p>
                    <p><span className="font-bold text-neutral-900 dark:text-neutral-100">ketua_mpk:</span> Kedewasaan sikap seperti ini yang kita butuhkan di OSIS.</p>
                  </div>
                </div>
              </div>
            ) : (
              // SCANDAL EXPOSE (LAMBE SMAN 1)
              <div>
                {highlightedDecisionNodeId === 'node_lie_hack_fatal' && (
                  <div className="bg-rose-600 text-white p-2.5 text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1">
                    <ShieldAlert size={14} />
                    <span>Langkah Keputusan: Berbohong Mengaku Akun Dihack (Terbongkar Forensik)</span>
                  </div>
                )}
                {highlightedDecisionNodeId === 'node_revenge_toxic_fatal' && (
                  <div className="bg-rose-600 text-white p-2.5 text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-1">
                    <ShieldAlert size={14} />
                    <span>Langkah Keputusan: Membalas Doxxing Aib Lawan di Media Sosial</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                      LS
                    </div>
                    <div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white">lambe_sman1_official</span>
                      <p className="text-[10px] text-neutral-400">Akun Gosip Siswa • 1 jam yang lalu</p>
                    </div>
                  </div>
                  <MoreHorizontal size={18} className="text-neutral-500" />
                </div>

                {/* Exposed Old Screenshot Banner with Interactive Footprint Inspector */}
                <div className="w-full bg-neutral-900 p-3.5 border-y border-amber-500/50 space-y-2.5">
                  <div className="bg-white rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {timelineYear === '2023' ? '🗓️ Arsip Status: September 2023 (Kelas 7 SMP)' : '📱 Viral Kembali: Oktober 2026 (Kelas 10 SMA)'}
                      </span>
                      <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                        JEJAK DIGITAL
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-800 leading-relaxed">
                      "Guru MTK rese banget ngasih PR seabrek, guru gak jelas dasar orang tua kolot!" 🤬
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-2 font-mono flex items-center justify-between">
                      <span>Diposting oleh: @budi_santoso (Akun Lama)</span>
                      <span className="text-[9px] text-rose-500 font-bold">Tangkapan Layar Pihak Ketiga</span>
                    </p>
                  </div>

                  {/* Interactive Footprint Timeline Scrubber */}
                  <div className="bg-neutral-800/90 rounded-xl p-2.5 border border-neutral-700 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300">
                      <span>Mesin Waktu Jejak Digital:</span>
                      <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-neutral-700">
                        <button
                          onClick={() => setTimelineYear('2023')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                            timelineYear === '2023' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          2023 (SMP)
                        </button>
                        <button
                          onClick={() => setTimelineYear('2026')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                            timelineYear === '2026' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          2026 (SMA)
                        </button>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-neutral-300 leading-relaxed">
                      {timelineYear === '2023' 
                        ? 'ℹ️ Pada 2023, Budi menghapus status ini 2 jam setelah diunggah. Budi mengira jejaknya sudah musnah selamanya.'
                        : '🚨 Pada 2026, tangkapan layar yang sempat disimpan oleh teman sekolah muncul kembali saat pencalonan Ketua OSIS.'}
                    </p>

                    <button
                      onClick={() => setShowFootprintAnalyzer(!showFootprintAnalyzer)}
                      className="w-full py-1 text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold text-center block"
                    >
                      {showFootprintAnalyzer ? 'Tutup Analisis Forensik' : '🔍 Mengapa Jejak Digital Bersifat Permanen? (Baca Penjelasan)'}
                    </button>

                    {showFootprintAnalyzer && (
                      <div className="p-2 rounded-lg bg-black/50 border border-neutral-700 text-[10px] text-neutral-300 space-y-1 animate-in fade-in">
                        <p className="font-bold text-yellow-400">Prinsip Abadi Jejak Digital (DSI Concept):</p>
                        <p>1. <strong>Screenshot Caching:</strong> Pengguna lain dapat menangkap bukti dalam hitungan detik sebelum tombol delete ditekan.</p>
                        <p>2. <strong>Web Archive:</strong> Server perantara dan mesin pencari mengarsipkan metadata publik.</p>
                        <p>3. <strong>Solusi Integritas:</strong> Menutup jejak dengan alibi "akun dihack" mudah dibantah lewat audit log IP.</p>
                      </div>
                    )}
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
                  <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100">1,210 suka • 342 komentar</p>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-1 leading-relaxed">
                    <span className="font-bold mr-1.5">lambe_sman1_official</span>
                    BOCOR! Calon Ketua OSIS nomor urut 1 ternyata punya rekam jejak digital menghina guru di masa lalu. Apakah layak memimpin siswa sekolah kita?! #PemilihanOSIS #JejakDigital
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      )}

      {/* ============================================================== */}
      {/* DM INBOX VIEW                                                  */}
      {/* ============================================================== */}
      {igView === 'dm_inbox' && (
        <div className={`flex-1 overflow-y-auto divide-y pb-16 ${
          isDarkMode ? 'divide-neutral-800 bg-black text-white' : 'divide-neutral-100 bg-white text-neutral-900'
        }`}>
          <div className="p-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Cari pesan atau obrolan..." 
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none ${
                  isDarkMode ? 'bg-neutral-900 text-white border border-neutral-800' : 'bg-neutral-100 text-neutral-900 border border-neutral-200'
                }`}
                readOnly
              />
            </div>
          </div>

          <div className="px-3 py-2 flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Obrolan Pesan</span>
            <span className="text-blue-500 font-semibold cursor-pointer">Permintaan (0)</span>
          </div>

          {/* Level 3 Threads */}
          {missionId === 'm3' && (
            <>
              <div 
                onClick={() => { setActiveDmUser('maya'); setIgView('dm_chat'); }}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-200 ring-2 ring-rose-500 flex-shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" alt="Maya" className="w-full h-full" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-black"></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">maya_queenbee</span>
                      <span className="text-[10px] text-neutral-400">1m</span>
                    </div>
                    <p className={`text-xs truncate ${isMayaBlocked ? 'text-neutral-400 italic' : (isFlameWarActive ? 'text-red-500 font-bold' : 'text-neutral-500')}`}>
                      {isMayaBlocked ? '[Akun ini telah diblokir]' : (isFlameWarActive ? 'Bacot lu! Tunggu aja besok di parkiran!' : 'Maksud lo apa belain Siska?!')}
                    </p>
                  </div>
                </div>
                {!isMayaBlocked && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2 flex-shrink-0"></span>
                )}
              </div>

              <div 
                onClick={() => { setActiveDmUser('siska'); setIgView('dm_chat'); }}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-200 ring-1 ring-neutral-300 flex-shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Siska" alt="Siska" className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">siska_aurora</span>
                      <span className="text-[10px] text-neutral-400">10m</span>
                    </div>
                    <p className="text-xs truncate text-neutral-500">
                      {isCommentReported ? 'Makasih banyak ya udah belain aku tadi 🥺❤️' : 'Makasih ya udah jadi teman baikku...'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Level 2 Thread */}
          {missionId === 'm2' && (
            <div 
              onClick={() => { setActiveDmUser('kenzo'); setIgView('dm_chat'); }}
              className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                isDarkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-200 ring-2 ring-amber-500 flex-shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kenzo" alt="Kenzo" className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">art_by_kenzo</span>
                    <span className="text-[10px] text-neutral-400">15m</span>
                  </div>
                  <p className="text-xs truncate text-amber-500 font-semibold">
                    Mohon klarifikasi izin lisensi maskot pensi SMAN 1.
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2 flex-shrink-0"></span>
            </div>
          )}

          {/* Level 5 Thread */}
          {missionId === 'm5' && (
            <div 
              onClick={() => { setActiveDmUser('lambe'); setIgView('dm_chat'); }}
              className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                isDarkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-neutral-200 ring-2 ring-purple-500 flex-shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lambe" alt="Lambe" className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">lambe_sman1</span>
                    <span className="text-[10px] text-neutral-400">20m</span>
                  </div>
                  <p className="text-xs truncate text-neutral-500">
                    Video klarifikasi Budi viral di linimasa...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* DM CHAT ROOM VIEW                                              */}
      {/* ============================================================== */}
      {igView === 'dm_chat' && (
        <div className={`flex-1 flex flex-col justify-between overflow-hidden ${
          isDarkMode ? 'bg-black text-white' : 'bg-white text-neutral-900'
        }`}>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Profile Card Header inside Chat */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 ring-2 ring-neutral-300 mb-2">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    activeDmUser === 'maya' ? 'Maya' : activeDmUser === 'siska' ? 'Siska' : activeDmUser === 'kenzo' ? 'Kenzo' : 'Lambe'
                  }`} 
                  alt="Avatar" 
                  className="w-full h-full" 
                />
              </div>
              <p className="font-extrabold text-sm">
                {activeDmUser === 'maya' ? 'maya_queenbee' : activeDmUser === 'siska' ? 'siska_aurora' : activeDmUser === 'kenzo' ? 'art_by_kenzo' : 'lambe_sman1'}
              </p>
              <p className="text-[11px] text-neutral-400">
                {activeDmUser === 'maya' ? '1.2k pengikut • 48 postingan' : activeDmUser === 'siska' ? '450 pengikut • 12 postingan' : 'Akun Terverifikasi'}
              </p>

              {activeDmUser === 'maya' && !isMayaBlocked && (
                <button 
                  onClick={handleBlockMaya}
                  className="mt-3 px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Ban size={13} />
                  <span>Laporkan & Blokir Akun Maya</span>
                </button>
              )}
            </div>

            {/* Chat Messages for Maya */}
            {activeDmUser === 'maya' && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Heh @player! Lu ngapain sih sok jagoan pake ngatain muka gue di komentar?!
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Urusan gue sama Siska, gak usah ikut campur lu bocah caper!
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs">
                    Kalo berani jangan cuma keroyokan nge-bully fisik orang di sosmed! Sadar diri dong perbuatan lo itu jahat dan melanggar aturan sekolah!
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-rose-900/60 border border-rose-500/60 text-white rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs font-medium">
                    Bacot lu! Geng gue di kelas 11 udah tandain muka lu. Liat aja besok di parkiran! 🔥
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs">
                    Silakan aja, semua chat dan komentar lo udah gue screenshot buat bukti lapor ke BK dan Kepala Sekolah!
                  </div>
                </div>

                {extraDmMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'player' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-rose-900/60 border border-rose-500/60 text-white rounded-tl-sm font-medium'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isMayaBlocked && (
                  <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-center text-xs text-red-400 font-semibold mt-4">
                    🛡️ Anda telah memblokir @maya_queenbee. Pesan dari pengguna ini tidak akan dapat dikirimkan lagi.
                  </div>
                )}
              </div>
            )}

            {/* Siska DM */}
            {activeDmUser === 'siska' && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Hai... Makasih banyak ya udah belain aku tadi 🥺❤️
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Tadinya aku nangis banget di kamar dan malu mau masuk sekolah...
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs">
                    Sama-sama Siska! Jangan dengerin omongan orang yang gak beretika. Kamu hebat dan teman-teman lain selalu dukung kamu!
                  </div>
                </div>
              </div>
            )}

            {/* Kenzo DM */}
            {activeDmUser === 'kenzo' && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-amber-900/40 border border-amber-500/40 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Halo panitia pensi SMAN 1. Saya pembuat ilustrasi maskot di poster kalian. Mohon izin atau lisensinya diperjelas sebelum masuk sengketa HKI.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs">
                    Halo Mas Kenzo, mohon maaf atas kelalaian tim kami. Kami sudah mengganti poster dengan lisensi Creative Commons resmi dan menyertakan atribusi legal.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Terima kasih atas itikad baik dan respon cepatnya! Semoga pensinya sukses dan lancar.
                  </div>
                </div>
              </div>
            )}

            {/* Lambe DM */}
            {activeDmUser === 'lambe' && (
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-start">
                  <div className="max-w-[78%] bg-neutral-200 dark:bg-neutral-800 rounded-2xl rounded-tl-sm px-3.5 py-2 text-xs">
                    Halo bro, video klarifikasi Budi udah viral di linimasa. Banyak yang respek sama sikap ksatria dan permohonan maafnya.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2 text-xs">
                    Syukurlah, Budi berani bertanggung jawab atas kesalahan masa lalunya daripada mencari alasan bohong.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar at Bottom of Chat */}
          {!isMayaBlocked && (
            <div className={`p-2.5 border-t flex items-center space-x-2 ${
              isDarkMode ? 'bg-black border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <input 
                type="text" 
                value={newDmMessage}
                onChange={(e) => setNewDmMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendDm()}
                placeholder="Kirim balasan pesan..." 
                className={`flex-1 px-3.5 py-2 rounded-full text-xs outline-none ${
                  isDarkMode ? 'bg-neutral-900 text-white border border-neutral-800' : 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                }`}
              />
              <button 
                onClick={handleSendDm}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white active:scale-95 transition-transform"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM SHEET MODAL: MULTI-CATEGORY REPORTING (LEVEL 3)        */}
      {/* ============================================================== */}
      {showOptionsModal && (
        <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-t-3xl p-4 animate-in slide-in-from-bottom-4 space-y-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-500 text-center uppercase tracking-wider mb-2">
              Pusat Moderasi Konten & Tindakan:
            </p>

            <button 
              onClick={handleSelectReport}
              className="w-full text-left p-3 text-[13px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl flex items-center justify-between border border-red-200 dark:border-red-900/50 transition-colors"
            >
              <div className="flex items-center">
                <Flag size={18} className="mr-2.5 text-red-600 shrink-0" />
                <div>
                  <p className="leading-tight">Laporkan Pelecehan / Body Shaming</p>
                  <p className="text-[10px] text-neutral-400 font-normal mt-0.5">Melanggar Panduan Komunitas & Pasal 27A UU ITE</p>
                </div>
              </div>
              <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-600 px-2 py-0.5 rounded-full font-bold">Rekomendasi</span>
            </button>

            <button 
              onClick={handleAttackBack}
              className="w-full text-left p-3 text-[13px] font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl flex items-center border border-amber-200 dark:border-amber-900/50 transition-colors"
            >
              <AlertTriangle size={18} className="mr-2.5 text-amber-500 shrink-0" />
              <div>
                <p className="leading-tight">Balas Menyerang Balik Maya di Publik (Adu Mulut)</p>
                <p className="text-[10px] text-neutral-400 font-normal mt-0.5">Memicu Flame War & merusak rekam jejak digital pribadi</p>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowOptionsModal(false);
                openApp('chat');
                advanceNode('node_bystander_fatal');
              }}
              className="w-full text-left p-3 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl flex items-center border border-neutral-200 dark:border-neutral-800 transition-colors"
            >
              <ShieldAlert size={18} className="mr-2.5 text-neutral-400 shrink-0" />
              <div>
                <p className="leading-tight">Abaikan Saja / Pura-pura Tidak Tahu</p>
                <p className="text-[10px] text-neutral-400 font-normal mt-0.5">Bystander Effect: Membiarkan korban terluka sendirian</p>
              </div>
            </button>

            <button 
              onClick={() => setShowOptionsModal(false)}
              className="w-full text-center p-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION REPORT DIALOG */}
      {showReportConfirm && (
        <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full p-4.5 text-center space-y-3 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-red-600 mx-auto">
              <Flag size={24} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Laporkan Komentar Maya?</h3>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-1.5 text-left bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <p>
                Komentar ini memenuhi unsur <strong>Pelecehan Verbal & Body Shaming</strong>.
              </p>
              <p className="text-[10.5px] text-neutral-400 font-mono">
                Dasar Hukum: Pasal 27A UU No. 1/2024 (Revisi UU ITE) tentang larangan penyerangan kehormatan atau nama baik orang lain di ruang elektronik.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <Button 
                onClick={handleConfirmReport}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 shadow-md shadow-red-500/20"
              >
                Konfirmasi Laporkan & Bersihkan Komentar
              </Button>
              <Button 
                onClick={() => setShowReportConfirm(false)}
                variant="outline" 
                className="w-full text-xs"
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Instagram Tab Bar */}
      {igView !== 'dm_chat' && (
        <div className={`border-t px-6 py-2 flex items-center justify-between z-20 ${
          isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
        }`}>
          <button 
            onClick={() => { setIgView('feed'); }} 
            className={`p-1 ${igView === 'feed' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-neutral-500' : 'text-neutral-400')}`}
          >
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
      )}

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
