import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat';
import { useSimOSStore } from '@/store/simos';
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  Video, 
  Users, 
  FileWarning, 
  ExternalLink, 
  Download, 
  Search, 
  ChevronDown, 
  Lightbulb,
  Smile,
  Paperclip,
  Camera,
  Mic,
  CircleDashed,
  PhoneCall,
  PhoneMissed,
  MoreVertical,
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import ForwardMessageModal from './ForwardMessageModal';
import SpamBroadcastAnimation from './SpamBroadcastAnimation';

export default function ChatApp() {
  const { 
    openApp, 
    setUnreadMessages, 
    isDarkMode, 
    activeContactId, 
    setActiveContactId,
    hasProofScreenshot,
    readContacts,
    markContactAsRead
  } = useSimOSStore();

  const { 
    messages, 
    isNpcTyping, 
    choices, 
    chooseOption, 
    script, 
    advanceNode, 
    openDebriefCard,
    status,
    activeSessionId,
    highlightedDecisionNodeId,
    decisionHistory
  } = useChatStore();

  const endRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'updates' | 'communities' | 'calls'>('chats');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const [isChoicesExpanded, setIsChoicesExpanded] = useState(true);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showSpamAnimation, setShowSpamAnimation] = useState(false);
  const [isFutsalForwarded, setIsFutsalForwarded] = useState(false);
  const [viewingStory, setViewingStory] = useState<{ name: string; avatarSeed: string; time: string; text: string; bg?: string } | null>(null);
  const [pendingForwardIndex, setPendingForwardIndex] = useState<number | null>(null);

  // Level 4: Interactive Sandbox File & Permission Inspector
  const [inspectingApkAttachment, setInspectingApkAttachment] = useState<{ fileName: string; fileSize: string } | null>(null);

  // Reset local states when mission restarts or session changes
  useEffect(() => {
    setIsFutsalForwarded(false);
    setShowForwardModal(false);
    setShowSpamAnimation(false);
    setViewingStory(null);
    setPendingForwardIndex(null);
    setInspectingApkAttachment(null);
  }, [activeSessionId]);

  const missionId = script?.id || 'm1';

  // Automatically reset unread count when reading active story room
  useEffect(() => {
    if (activeContactId === 'active') {
      setUnreadMessages(0);
    }
  }, [activeContactId, setUnreadMessages]);

  // Expand choices automatically whenever new choices arrive while playing
  useEffect(() => {
    if (status === 'playing' && choices && choices.length > 0) {
      setIsChoicesExpanded(true);
    }
  }, [choices, status]);

  // Isolated autoscroll to bottom (ONLY within messages container to prevent screen displacement)
  useEffect(() => {
    if (activeContactId === 'active' && !highlightedDecisionNodeId) {
      const scrollBottom = () => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      scrollBottom();
      const timer = setTimeout(scrollBottom, 70);
      return () => clearTimeout(timer);
    }
  }, [messages, isNpcTyping, choices, activeContactId, isChoicesExpanded, hasProofScreenshot, highlightedDecisionNodeId]);

  // Isolated scroll to highlighted decision message during review dashboard inspection
  useEffect(() => {
    if (highlightedDecisionNodeId && activeContactId === 'active' && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const el = container.querySelector('[data-highlighted-message="true"]') as HTMLElement | null;
      if (el) {
        const topPos = el.offsetTop - (container.clientHeight / 2) + (el.clientHeight / 2);
        container.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }
  }, [highlightedDecisionNodeId, activeContactId]);

  const channelTitle = script?.channelName || 'Grup Kelas X-MIPA 1';
  const isGroup = script?.isGroup ?? true;
  const avatarSeed = script?.avatarSeed || 'ClassGroup1';

interface ChatContact {
  id: string;
  name: string;
  avatarSeed: string;
  isGroup: boolean;
  lastMsg: string;
  time: string;
  unread: number;
  highlight?: boolean;
  isClue?: boolean;
}

  // Level-specific contacts filter
  const getContactsForLevel = (mId: string): ChatContact[] => {
    const isMainUnread = (!readContacts['active'] && activeContactId !== 'active') ? 1 : 0;
    const activeItem: ChatContact = {
      id: 'active',
      name: channelTitle,
      avatarSeed: avatarSeed,
      isGroup: isGroup,
      lastMsg: messages.length > 0 ? messages[messages.length - 1].text : 'PENGUMUMAN PENTING! Besok libur total...',
      time: '11:45',
      unread: isMainUnread,
      highlight: true
    };

    if (mId === 'm1') {
      return [
        activeItem,
        {
          id: 'bimo',
          name: 'Bimo (Teman Sebangku)',
          avatarSeed: 'Bimo',
          isGroup: false,
          lastMsg: 'Bro, link Dina aneh deh, domainnya blogspot bukan web sekolah...',
          time: '11:42',
          unread: (!readContacts['bimo'] && activeContactId !== 'bimo') ? 1 : 0,
          isClue: true
        },
        {
          id: 'rara',
          name: 'Rara',
          avatarSeed: 'Rara',
          isGroup: false,
          lastMsg: 'Eh beneran libur gak sih? Takutnya hoax tuh...',
          time: '11:38',
          unread: (!readContacts['rara'] && activeContactId !== 'rara') ? 1 : 0,
          isClue: true
        },
        {
          id: 'futsal',
          name: 'Ekskul Futsal SMAN 1',
          avatarSeed: 'FutsalTeam',
          isGroup: true,
          lastMsg: isFutsalForwarded ? 'Edo: Bro seriusan besok libur? Coba lo klik dulu linknya...' : 'Edo: Sparing besok sore tetap jalan ya guys!',
          time: isFutsalForwarded ? '11:46' : '10:15',
          unread: (!readContacts['futsal'] && activeContactId !== 'futsal' && isFutsalForwarded) ? 1 : 0
        },
        {
          id: 'osis',
          name: 'OSIS SMAN 1',
          avatarSeed: 'OsisSmansa',
          isGroup: true,
          lastMsg: 'Rapat koordinasi pameran diundur ke hari Kamis.',
          time: '09:20',
          unread: 0
        },
        {
          id: 'rohis',
          name: 'Rohis Al-Kautsar',
          avatarSeed: 'RohisClub',
          isGroup: true,
          lastMsg: 'Kajian rutin ba\'da Ashar di musholla sekolah.',
          time: 'Kemarin',
          unread: 0
        }
      ];
    }

    if (mId === 'm2') {
      return [
        activeItem,
        {
          id: 'dina',
          name: 'Dina Ananda',
          avatarSeed: 'Dina',
          isGroup: false,
          lastMsg: 'Makasih udah ingetin cek web sekolah kemarin ya!',
          time: 'Kemarin',
          unread: 0
        },
        {
          id: 'bimo',
          name: 'Bimo',
          avatarSeed: 'Bimo',
          isGroup: false,
          lastMsg: 'Gimana poster pensi dari Rian udah kelar?',
          time: '10:20',
          unread: 0
        },
        {
          id: 'osis',
          name: 'OSIS SMAN 1',
          avatarSeed: 'OsisSmansa',
          isGroup: true,
          lastMsg: 'Desain poster pensi ditunggu hari ini.',
          time: '09:00',
          unread: 0
        }
      ];
    }

    if (mId === 'm3') {
      return [
        activeItem,
        {
          id: 'siska',
          name: 'Siska Aurora',
          avatarSeed: 'Siska',
          isGroup: false,
          lastMsg: 'Aku drop banget baca komentar di InstaPic...',
          time: '11:00',
          unread: (!readContacts['siska'] && activeContactId !== 'siska') ? 1 : 0
        },
        {
          id: 'dina',
          name: 'Dina Ananda',
          avatarSeed: 'Dina',
          isGroup: false,
          lastMsg: 'Maya parah banget komennya di foto Siska.',
          time: '10:45',
          unread: 0
        }
      ];
    }

    // Default for m4 & m5
    return [
      activeItem,
      {
        id: 'dina',
        name: 'Dina Ananda',
        avatarSeed: 'Dina',
        isGroup: false,
        lastMsg: 'Ada info terbaru dari OSIS?',
        time: 'Kemarin',
        unread: 0
      },
      {
        id: 'bimo',
        name: 'Bimo',
        avatarSeed: 'Bimo',
        isGroup: false,
        lastMsg: 'Siap bro!',
        time: 'Kemarin',
        unread: 0
      }
    ];
  };

  const chatContacts = getContactsForLevel(missionId);

  // Read-only Clue Messages Generator
  const getClueMessages = (contactId: string) => {
    switch (contactId) {
      case 'bimo':
        return [
          { sender: 'Bimo', text: 'Bro, lo udah baca chat dari Dina di grup kelas barusan?', time: '11:41' },
          { sender: 'Bimo', text: 'Tautannya kok mencurigakan banget ya, domainnya .blogspot.xyz bukan domain resmi sman1-official.sch.id sekolah kita.', time: '11:42' },
          { sender: 'Bimo', text: 'Jangan-jangan itu jebakan phishing atau link spam malware. Saran gue jangan lo sebar kemana-mana bro, mending lo cek dulu ke website resmi sekolah!', time: '11:42' }
        ];
      case 'rara':
        return [
          { sender: 'Rara', text: 'Hai! Menurut lo info libur mendadak dari Dina itu beneran valid gak ya?', time: '11:37' },
          { sender: 'Rara', text: 'Minggu lalu Pak Guru Informatika bilang kalau ada edaran resmi pasti diumumkan lewat web sman1-official.sch.id sekolah kita.', time: '11:38' },
          { sender: 'Rara', text: 'Hati-hati ya jangan buru-buru forward ke grup lain sebelum ada bukti resmi!', time: '11:38' }
        ];
      case 'futsal':
        if (isFutsalForwarded) {
          return [
            { sender: 'Edo (Kapten)', text: 'Pemberitahuan: Jadwal tanding futsal antar kelas besok sore tetap jalan ya!', time: '10:10' },
            { sender: 'Kevin', text: 'Siap kapten, kumpul jam 15.30 di lapangan indoor.', time: '10:15' },
            { sender: 'Kamu', isPlayer: true, text: '⏩ Pesan Diteruskan:\nPENGUMUMAN PENTING! Besok kita LIBUR TOTAL karena sidak Dinas... http://info-diknas-sekolah.blogspot.xyz/libur-mendadak', time: '11:46' },
            { sender: 'Edo (Kapten)', text: 'Bro seriusan besok libur? Padahal besok ada jadwal tanding futsal antar kelas! Coba lo klik dulu linknya, beneran dari dinas gak tuh? Kok domain blogspot mencurigakan gitu?', time: '11:46' },
            { sender: 'Kevin', text: 'Iya bro, jangan asal forward! Coba buka linknya lo cek dulu isinya!', time: '11:47' }
          ];
        }
        return [
          { sender: 'Edo (Kapten)', text: 'Pemberitahuan: Jadwal tanding futsal antar kelas besok sore tetap jalan ya!', time: '10:10' },
          { sender: 'Kevin', text: 'Siap kapten, kumpul jam 15.30 di lapangan indoor.', time: '10:15' }
        ];
      case 'osis':
        return [
          { sender: 'Budi (Ketua OSIS)', text: 'Rapat koordinasi pameran diundur ke hari Kamis ya rekan-rekan pengurus.', time: '09:15' },
          { sender: 'Sarah', text: 'Noted Kak Budi.', time: '09:20' }
        ];
      case 'rohis':
        return [
          { sender: 'Farhan', text: 'Kajian rutin ba\'da Ashar di musholla sekolah, jangan lupa hadir ya ikhwah.', time: 'Kemarin' }
        ];
      default:
        return [
          { sender: 'Teman', text: 'Hai! Ada tugas yang belum selesai?', time: 'Kemarin' }
        ];
    }
  };

  // Handlers for interactive minigames
  const handleOpenForwardModal = (choiceIndex: number) => {
    setPendingForwardIndex(choiceIndex);
    setShowForwardModal(true);
  };

  const handleCloseForwardModal = () => {
    setShowForwardModal(false);
    setPendingForwardIndex(null);
  };

  const handleCompleteForward = () => {
    setShowForwardModal(false);
    setIsFutsalForwarded(true);
    markContactAsRead('futsal');
    const idx = pendingForwardIndex;
    setPendingForwardIndex(null);
    if (idx !== null) {
      chooseOption(idx);
    }
    useSimOSStore.getState().showBanner({
      app: 'chat',
      sender: 'WhatsApp System',
      text: '⏩ Pesan berhasil diteruskan ke 3 grup (Grup Futsal, OSIS, Rohis)'
    });
    setTimeout(() => {
      setActiveContactId('futsal');
    }, 500);
  };

  const handleSendProof = () => {
    if (!hasProofScreenshot) return;
    useSimOSStore.getState().setHasProofScreenshot(false);
    useChatStore.getState().recordDecision({
      stepTitle: 'Verifikasi Portal Sekolah (Cek Fakta)',
      prompt: 'Laporkan temuan cek faktamu kepada Dina',
      chosenText: 'Melampirkan bukti screenshot bantahan resmi dari portal sman1-official.sch.id',
      points: 3,
      nodeId: 'node_send_proof_screenshot',
      alternatives: [
        { text: 'Melampirkan bukti screenshot bantahan resmi dari web sekolah', points: 3 }
      ],
      causalityAnalysis: {
        riskLevel: 'Aman',
        mechanism: 'Menerapkan jeda kritis (Critical Thinking Pause) dan verifikasi bukti sahih ke website resmi sekolah.',
        consequence: 'Menyelesaikan krisis secara elegan, melindungi diri & orang lain tanpa jejak toksik.',
        bestPracticeRecommendation: 'Selalu terapkan prinsip 5 Detik Jeda Kritis, verifikasi lateral, dan empati sebelum bertindak di ruang digital.'
      }
    });
    advanceNode('node_send_proof_screenshot');
  };

  const handleTriggerMalwareLink = () => {
    setShowSpamAnimation(true);
  };

  const handleFinishSpamAnimation = () => {
    setShowSpamAnimation(false);
    advanceNode('node_hacked_glitch');
  };

  // ==============================================================
  // VIEW 1: WHATSAPP HUB (TABS: CHATS, STATUS, KOMUNITAS, PANGGILAN)
  // ==============================================================
  if (activeContactId === null) {
    const filteredChats = chatContacts.filter(c => {
      if (chatFilter === 'unread') return c.unread > 0;
      if (chatFilter === 'groups') return c.isGroup;
      return true;
    });

    const totalUnread = chatContacts.reduce((acc, c) => acc + (c.unread || 0), 0);

    return (
      <div className={`flex flex-col h-full select-none animate-in fade-in duration-200 relative ${
        isDarkMode ? 'bg-[#111b21] text-white' : 'bg-white text-neutral-900'
      }`}>
        {/* WhatsApp Top Header */}
        <div className={`px-4 pt-2 pb-2 border-b select-none ${
          isDarkMode ? 'bg-[#111b21] border-[#202c33]' : 'bg-white border-neutral-100'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-extrabold tracking-tight text-[#00a884]">
              WhatsApp
            </h1>
            <div className="flex items-center space-x-3 text-neutral-500 dark:text-neutral-400">
              <button onClick={() => openApp('home')} title="Layar Utama"><Camera size={18} /></button>
              <button title="Cari"><Search size={18} /></button>
              <button title="Menu"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Search bar & Filter Pills (Only on chats tab) */}
          {activeTab === 'chats' && (
            <div className="space-y-2 mt-2">
              <div className={`rounded-xl px-3 py-1.5 flex items-center space-x-2 ${
                isDarkMode ? 'bg-[#202c33] text-neutral-300' : 'bg-neutral-100 text-neutral-400'
              }`}>
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Cari chat atau kontak..." 
                  className={`bg-transparent outline-none text-xs w-full placeholder-neutral-400 ${
                    isDarkMode ? 'text-white' : 'text-neutral-800'
                  }`}
                  disabled
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
                <button
                  onClick={() => setChatFilter('all')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    chatFilter === 'all'
                      ? 'bg-[#00a884] text-white font-bold'
                      : isDarkMode ? 'bg-[#202c33] text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setChatFilter('unread')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    chatFilter === 'unread'
                      ? 'bg-[#00a884] text-white font-bold'
                      : isDarkMode ? 'bg-[#202c33] text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Belum Dibaca {totalUnread > 0 && `(${totalUnread})`}
                </button>
                <button
                  onClick={() => setChatFilter('groups')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    chatFilter === 'groups'
                      ? 'bg-[#00a884] text-white font-bold'
                      : isDarkMode ? 'bg-[#202c33] text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Grup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: CHATS LIST */}
        {activeTab === 'chats' && (
          <div className={`flex-1 overflow-y-auto divide-y pb-20 ${isDarkMode ? 'divide-[#202c33]' : 'divide-neutral-100'}`}>
            {filteredChats.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => {
                  markContactAsRead(contact.id);
                  setActiveContactId(contact.id);
                }}
                className={`p-3 flex items-center space-x-3 cursor-pointer transition-colors ${
                  contact.id === 'active'
                    ? isDarkMode ? 'bg-[#202c33]/40 hover:bg-[#202c33]/80' : 'bg-emerald-50/70 hover:bg-emerald-50'
                    : isDarkMode ? 'hover:bg-[#202c33]/60 active:bg-[#202c33]' : 'hover:bg-neutral-50 active:bg-neutral-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border relative ${
                  isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-200 border-neutral-200'
                }`}>
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatarSeed}`} 
                    alt={contact.name} 
                    className="w-full h-full object-cover" 
                  />
                  {contact.highlight && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-1 min-w-0">
                      <p className={`font-bold text-[13.5px] truncate ${
                        contact.highlight
                          ? isDarkMode ? 'text-emerald-400' : 'text-emerald-800 font-extrabold'
                          : isDarkMode ? 'text-neutral-100' : 'text-neutral-900'
                      }`}>
                        {contact.name}
                      </p>
                      {contact.isGroup && <Users size={12} className="text-neutral-400 flex-shrink-0" />}
                      {contact.isClue && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold shrink-0">
                          Petunjuk
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 flex-shrink-0">{contact.time}</span>
                  </div>
                  <p className={`text-[12px] truncate leading-snug ${
                    contact.unread > 0 
                      ? isDarkMode ? 'text-white font-semibold' : 'text-neutral-900 font-bold'
                      : isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {contact.lastMsg}
                  </p>
                </div>

                {contact.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: UPDATES / STATUS (WHATSAPP STATUS) */}
        {activeTab === 'updates' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Status</h2>
            
            {/* My Status */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MePlayer" alt="Me" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  +
                </span>
              </div>
              <div>
                <p className="font-bold text-xs text-neutral-900 dark:text-white">Status saya</p>
                <p className="text-[11px] text-neutral-400">Ketuk untuk menambahkan pembaruan status</p>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Pembaruan Terkini</p>
              
              {[
                { name: 'Dina (Ketua Kelas)', avatarSeed: 'Dina', time: '30 menit lalu', text: 'Besok beneran libur gak ya guys? 🤔 Jangan sampe kita kena zonk massal wkwk', bg: 'from-purple-600 to-indigo-700' },
                { name: 'Bimo', avatarSeed: 'Bimo', time: '45 menit lalu', text: 'Push rank mumpung denger kabar libur, tapi kok linknya mencurigakan ya...', bg: 'from-emerald-600 to-teal-800' },
                { name: 'Rara', avatarSeed: 'Rara', time: '1 jam lalu', text: 'Kalo info libur resmi, pasti diposting di web resmi sekolah sman1-official.sch.id!', bg: 'from-amber-600 to-rose-700' },
                { name: 'OSIS SMAN 1', avatarSeed: 'OsisSmansa', time: '3 jam lalu', text: 'Pemberitahuan: Rapat koordinasi panitia pameran kreasi siswa diundur ke hari Kamis.', bg: 'from-blue-600 to-cyan-800' }
              ].map((st, i) => (
                <div 
                  key={i} 
                  onClick={() => setViewingStory(st)}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-full p-0.5 border-2 border-[#00a884] overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${st.avatarSeed}`} alt={st.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">{st.name}</p>
                    <p className="text-[11px] text-neutral-400">{st.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMMUNITIES */}
        {activeTab === 'communities' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Komunitas</h2>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#202c33]/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-2">
                🏛️
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Komunitas Digital SMAN 1</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">Wadah koordinasi resmi seluruh siswa, organisasi intra sekolah, dan ekskul.</p>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Grup Komunitas</p>
              {['📢 Informasi Resmi Angkatan 2026', '🏛️ OSIS & MPK SMAN 1', '⚽ Paguyuban Ekstrakurikuler Olahraga'].map((grp, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-center space-x-3 ${isDarkMode ? 'bg-[#202c33]/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <span className="text-lg">👥</span>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{grp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CALLS */}
        {activeTab === 'calls' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Panggilan</h2>
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Terbaru</p>
              {[
                { name: 'Dina (Ketua Kelas)', type: 'missed', time: 'Kemarin, 19:40' },
                { name: 'Bimo', type: 'incoming', time: '2 hari lalu, 14:15' },
                { name: 'Ekskul Futsal SMAN 1', type: 'missed', time: '3 hari lalu, 16:30' }
              ].map((call, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${call.name}`} alt={call.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className={`font-bold text-xs ${call.type === 'missed' ? 'text-red-500' : 'text-neutral-900 dark:text-white'}`}>{call.name}</p>
                      <div className="flex items-center space-x-1 text-[10px] text-neutral-400">
                        {call.type === 'missed' ? <PhoneMissed size={11} className="text-red-500" /> : <PhoneCall size={11} className="text-emerald-500" />}
                        <span>{call.time}</span>
                      </div>
                    </div>
                  </div>
                  <Phone size={16} className="text-[#00a884] cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Bottom Tab Bar (WhatsApp 4 Tabs) */}
        <div className={`border-t px-4 py-2 flex items-center justify-between text-[10px] font-medium absolute bottom-0 inset-x-0 z-20 pb-7 sm:pb-3 ${
          isDarkMode ? 'bg-[#111b21] border-[#202c33] text-neutral-400' : 'bg-white border-neutral-200 text-neutral-500'
        }`}>
          <button 
            onClick={() => setActiveTab('chats')}
            className={`flex flex-col items-center relative py-1 px-3 ${activeTab === 'chats' ? 'text-[#00a884] font-bold' : 'hover:text-neutral-300'}`}
          >
            <MessageSquare size={18} />
            <span className="mt-0.5">Chat</span>
            {totalUnread > 0 && (
              <span className="absolute top-0 right-2 w-4 h-4 bg-[#25D366] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('updates')}
            className={`flex flex-col items-center py-1 px-3 ${activeTab === 'updates' ? 'text-[#00a884] font-bold' : 'hover:text-neutral-300'}`}
          >
            <CircleDashed size={18} />
            <span className="mt-0.5">Pembaruan</span>
          </button>

          <button 
            onClick={() => setActiveTab('communities')}
            className={`flex flex-col items-center py-1 px-3 ${activeTab === 'communities' ? 'text-[#00a884] font-bold' : 'hover:text-neutral-300'}`}
          >
            <Users size={18} />
            <span className="mt-0.5">Komunitas</span>
          </button>

          <button 
            onClick={() => setActiveTab('calls')}
            className={`flex flex-col items-center py-1 px-3 ${activeTab === 'calls' ? 'text-[#00a884] font-bold' : 'hover:text-neutral-300'}`}
          >
            <Phone size={18} />
            <span className="mt-0.5">Panggilan</span>
          </button>
        </div>

        {/* WhatsApp Status Story Viewer Modal */}
        {viewingStory && (
          <div className="absolute inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-4 animate-in fade-in duration-200">
            {/* Progress bar */}
            <div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-white rounded-full animate-pulse w-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-700">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewingStory.avatarSeed}`} alt={viewingStory.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-xs">{viewingStory.name}</p>
                    <p className="text-[10px] text-white/60">{viewingStory.time}</p>
                  </div>
                </div>
                <button onClick={() => setViewingStory(null)} className="p-1 rounded-full text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Story Card Content */}
            <div className={`p-6 rounded-3xl bg-gradient-to-br ${viewingStory.bg || 'from-emerald-700 to-teal-900'} shadow-2xl text-center space-y-4 my-auto`}>
              <p className="text-sm font-semibold leading-relaxed">
                "{viewingStory.text}"
              </p>
            </div>

            {/* Bottom reply footer */}
            <div className="text-center pb-8">
              <p className="text-[11px] text-white/50">Balasan status dinonaktifkan dalam mode simulasi</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================================================
  // ==============================================================
  // VIEW 2: READ-ONLY CLUE CHAT ROOM (BIMO, RARA, FUTSAL, OSIS)
  // ==============================================================
  if (activeContactId !== 'active') {
    const clueContact = chatContacts.find((c) => c.id === activeContactId);
    const clueMessages = getClueMessages(activeContactId);

    return (
      <div className={`flex flex-col h-full relative animate-in slide-in-from-right duration-200 ${
        isDarkMode ? 'bg-[#0b141a]' : 'bg-[#EFEAE2]'
      }`}>
        {/* WhatsApp Chat Header */}
        <div className={`text-white flex items-center px-2 py-2.5 shadow-md z-10 h-16 select-none ${
          isDarkMode ? 'bg-[#202c33] border-b border-[#2a3942]' : 'bg-[#075E54]'
        }`}>
          <button 
            onClick={() => setActiveContactId(null)} 
            className="flex items-center text-white mr-1 p-1 rounded-full hover:bg-white/10 active:scale-95 transition-transform"
            title="Kembali ke Daftar Chats"
          >
            <ChevronLeft size={22} className="-mr-0.5" />
            <span className="text-xs font-semibold">Chats</span>
          </button>

          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/20 ml-1 bg-emerald-100">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${clueContact?.avatarSeed || 'Student'}`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="ml-2.5 flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h2 className="font-bold text-[14px] leading-tight truncate text-white">
                {clueContact?.name || 'Obrolan'}
              </h2>
            </div>
            <p className="text-[11px] text-white/80 truncate">
              {clueContact?.isGroup ? 'Grup Sekolah' : 'online'}
            </p>
          </div>

          <div className="flex items-center space-x-3 px-1 text-white/90">
            <Video size={18} className="cursor-pointer hover:text-white" />
            <Phone size={18} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Clue Notice Banner */}
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 flex items-center space-x-2 text-[11px] text-amber-700 dark:text-amber-300">
          <Lightbulb size={13} className="shrink-0 text-amber-500" />
          <span>
            {activeContactId === 'futsal' && isFutsalForwarded
              ? 'Pesan diteruskan ke Grup Futsal! Teman-teman menanyakan keabsahan link.'
              : 'Obrolan ini adalah petunjuk sampingan untuk membantumu mengambil keputusan.'}
          </span>
        </div>

        {/* Messages Feed */}
        <div className={`flex-1 overflow-y-auto p-3.5 space-y-2.5 pb-16 ${
          isDarkMode 
            ? 'bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]' 
            : 'bg-[radial-gradient(#d4ccc3_1px,transparent_1px)] [background-size:16px_16px]'
        }`}>
          {clueMessages.map((m, idx) => {
            const isMalwareLink = m.text.includes('blogspot.xyz');

            return (
              <div key={idx} className={`flex ${m.isPlayer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-2.5 px-3.5 text-[13px] shadow-sm relative border ${
                  m.isPlayer
                    ? isDarkMode 
                      ? 'bg-[#005c4b] text-neutral-100 rounded-tr-none border-[#005c4b]' 
                      : 'bg-[#DCF8C6] text-neutral-900 rounded-tr-none border-[#c2e2aa]'
                    : isDarkMode 
                      ? 'bg-[#202c33] text-neutral-100 rounded-tl-none border-[#2a3942]' 
                      : 'bg-white text-neutral-900 rounded-tl-none border-neutral-200/50'
                }`}>
                  <p className={`font-bold text-[11px] mb-0.5 ${
                    m.isPlayer 
                      ? 'text-white/80' 
                      : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    {m.sender}
                  </p>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {/* Clickable Malware Test Action if message has fake link */}
                  {isMalwareLink && (
                    <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10">
                      <button
                        onClick={handleTriggerMalwareLink}
                        className="text-[11px] font-mono text-red-500 dark:text-red-400 underline font-bold flex items-center space-x-1 hover:text-red-600 active:scale-95 transition-transform"
                      >
                        <span>👉 Ketuk untuk Buka Tautan: blogspot.xyz</span>
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-400 float-right mt-1 ml-2">
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Read-Only Disabled Input Bar */}
        <div className="p-2.5 border-t border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-xs text-neutral-500 dark:text-neutral-400 font-medium absolute bottom-0 inset-x-0">
          <span>🔒 Obrolan ini hanya bisa dibaca (Petunjuk Ekskul)</span>
        </div>

        {/* Modals placed inside View 2 as well */}
        {showForwardModal && (
          <ForwardMessageModal 
            onClose={handleCloseForwardModal}
            onForwardComplete={handleCompleteForward}
          />
        )}
        {showSpamAnimation && (
          <SpamBroadcastAnimation 
            onFinished={handleFinishSpamAnimation}
          />
        )}
      </div>
    );
  }

  // ==============================================================
  // VIEW 3: ACTIVE MAIN STORY ROOM CHAT (GRUP KELAS)
  // ==============================================================
  const isWaitingForProof = script?.id === 'm1' && !hasProofScreenshot && messages.some(m => m.text.includes('Safari'));

  return (
    <div className={`flex flex-col h-full relative animate-in slide-in-from-right duration-200 ${
      isDarkMode ? 'bg-[#0b141a]' : 'bg-[#EFEAE2]'
    }`}>
      {/* WhatsApp iOS Header */}
      <div className={`text-white flex items-center px-2 py-2.5 shadow-md z-10 h-16 select-none ${
        isDarkMode ? 'bg-[#202c33] border-b border-[#2a3942]' : 'bg-[#075E54]'
      }`}>
        <button 
          onClick={() => setActiveContactId(null)} 
          className="flex items-center text-white mr-1 p-1 rounded-full hover:bg-white/10 active:scale-95 transition-transform"
          title="Kembali ke Daftar Chats"
        >
          <ChevronLeft size={22} className="-mr-0.5" />
          <span className="text-xs font-semibold">Chats</span>
        </button>

        <div className="w-10 h-10 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/20 ml-1">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <h2 className="font-bold text-[14.5px] leading-tight truncate text-white">{channelTitle}</h2>
            {isGroup && <Users size={12} className="text-white/70 flex-shrink-0" />}
          </div>
          <p className="text-[11px] text-white/80 truncate">
            {isNpcTyping 
              ? 'sedang mengetik...' 
              : isGroup 
              ? `${script?.memberCount || '36'} anggota` 
              : 'online'}
          </p>
        </div>

        <div className="flex items-center space-x-3 px-1 text-white/90">
          <Video size={18} className="cursor-pointer hover:text-white" />
          <Phone size={18} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Messages Feed */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-3.5 space-y-2.5 relative transition-all duration-200 ${
        isDarkMode 
          ? 'bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]' 
          : 'bg-[radial-gradient(#d4ccc3_1px,transparent_1px)] [background-size:16px_16px]'
      } ${
        choices && choices.length > 0 && isChoicesExpanded
          ? (choices.length > 2 ? 'pb-72' : 'pb-56') 
          : 'pb-20'
      }`}>
        {messages.map((m) => {
          const isMalwareLinkMsg = m.text.includes('blogspot.xyz');
          const isHighlighted = Boolean(
            highlightedDecisionNodeId && (
              (m.nodeId && m.nodeId === highlightedDecisionNodeId) ||
              decisionHistory.some(d => d.nodeId === highlightedDecisionNodeId && (m.text === d.chosenText || m.text.includes(d.chosenText)))
            )
          );

          return (
            <div 
              key={m.id} 
              data-highlighted-message={isHighlighted ? "true" : undefined}
              className={`flex flex-col ${m.sender === 'player' ? 'items-end' : 'items-start'} transition-all`}
            >
              {isHighlighted && (
                <div className="flex items-center space-x-1 mb-1 px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-black shadow-lg animate-bounce z-30">
                  <Sparkles size={12} className="text-black" />
                  <span>Langkah Keputusan Sedang Dianalisis</span>
                </div>
              )}
              <div 
                className={`max-w-[85%] rounded-2xl p-2.5 px-3.5 text-[13.5px] shadow-sm relative transition-all ${
                  isHighlighted 
                    ? 'ring-4 ring-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.7)] scale-[1.02] z-20' 
                    : ''
                } ${
                  m.sender === 'player' 
                    ? isDarkMode 
                      ? 'bg-[#005c4b] text-neutral-100 rounded-tr-none' 
                      : 'bg-[#DCF8C6] text-neutral-900 rounded-tr-none'
                    : isDarkMode 
                      ? 'bg-[#202c33] text-neutral-100 rounded-tl-none border border-[#2a3942]' 
                      : 'bg-white text-neutral-900 rounded-tl-none border border-neutral-200/50'
                }`}
              >
                {/* NPC Name in Group Chats */}
                {m.sender === 'npc' && m.npcName && isGroup && (
                  <p className={`text-[11px] font-bold mb-0.5 leading-none ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    {m.npcName}
                  </p>
                )}

                {/* Message Text with Clickable Malware Exploit Link if in Fake Link Stage */}
                <p className="leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </p>

                {/* Clickable Malware Test Action if message has fake link */}
                {isMalwareLinkMsg && (
                  <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10">
                    <button
                      onClick={handleTriggerMalwareLink}
                      className="text-[11px] font-mono text-red-500 dark:text-red-400 underline font-bold flex items-center space-x-1 hover:text-red-600 active:scale-95 transition-transform"
                    >
                      <span>👉 Ketuk untuk Buka Tautan: blogspot.xyz</span>
                    </button>
                  </div>
                )}

                {/* Attachment Cards */}
                {m.attachment && m.attachment.type === 'apk' && (() => {
                  const apk = m.attachment;
                  return (
                    <div 
                      onClick={() => setInspectingApkAttachment({ fileName: apk.fileName, fileSize: apk.fileSize })}
                      className={`mt-2 p-2.5 rounded-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all group ${
                        isDarkMode 
                          ? 'bg-rose-950/60 border border-rose-800 text-rose-200 hover:bg-rose-900/60' 
                          : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                          <FileWarning size={20} />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold truncate max-w-[150px] ${isDarkMode ? 'text-rose-200' : 'text-red-700'}`}>
                            {apk.fileName}
                          </p>
                          <p className={`text-[10px] font-mono ${isDarkMode ? 'text-rose-400' : 'text-red-500'}`}>
                            {apk.fileSize} • File Paket Android
                          </p>
                        </div>
                      </div>
                      <Download size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                  );
                })()}

                {m.attachment && m.attachment.type === 'image' && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-black/10 shadow-sm">
                    <img src={m.attachment.url} alt="Lampiran Bukti" className="w-full h-auto object-cover max-h-48" />
                    {m.attachment.caption && (
                      <p className="p-2 text-xs bg-black/60 text-white font-medium">{m.attachment.caption}</p>
                    )}
                  </div>
                )}

                {m.attachment && m.attachment.type === 'report' && (
                  <div 
                    onClick={openDebriefCard}
                    className={`mt-2 p-2.5 rounded-xl flex items-center justify-between cursor-pointer active:scale-98 transition-all ${
                      isDarkMode 
                        ? 'bg-blue-950/60 border border-blue-800 text-blue-200 hover:bg-blue-900/60' 
                        : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        📄 {m.attachment.title}
                      </p>
                      <p className={`text-[10px] ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                        Ketuk untuk membuka Rapor DSI
                      </p>
                    </div>
                    <ExternalLink size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] float-right mt-1 ml-2 select-none text-neutral-400">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* NPC Typing Indicator */}
        {isNpcTyping && (
          <div className="flex justify-start animate-in fade-in duration-200">
            <div className={`rounded-2xl rounded-tl-none p-2.5 px-3.5 shadow-sm flex items-center space-x-1.5 ${
              isDarkMode 
                ? 'bg-[#202c33] border border-[#2a3942]' 
                : 'bg-white border border-neutral-200/50'
            }`}>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Collapsible Choice Drawer */}
      {status === 'playing' && !isNpcTyping && choices && choices.length > 0 && isChoicesExpanded && (
        <div className={`absolute bottom-16 inset-x-2 backdrop-blur-md shadow-2xl rounded-2xl p-3 z-30 animate-in slide-in-from-bottom-4 duration-300 border ${
          isDarkMode 
            ? 'bg-[#111b21]/95 border-neutral-700 text-white' 
            : 'bg-white/95 border-neutral-300 text-neutral-800'
        }`}>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1 ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <Lightbulb size={13} className="text-yellow-400 mr-1" />
              <span>Tentukan Sikapmu (Jeda Kritis):</span>
            </p>
            <button
              onClick={() => setIsChoicesExpanded(false)}
              className="text-[11px] text-blue-500 hover:underline flex items-center space-x-0.5"
              title="Sembunyikan Opsi"
            >
              <span>Sembunyikan</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {choices.map((choice, idx) => {
              const isForwardChoice = Boolean((choice as any).isForwardAction || choice.nextNodeId === 'node_forward_fatal');

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isForwardChoice) {
                      handleOpenForwardModal(idx);
                    } else {
                      chooseOption(idx);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl active:scale-98 transition-all border text-[13px] font-medium leading-snug shadow-sm ${
                    isDarkMode 
                      ? 'bg-[#202c33] hover:bg-[#005c4b] border-neutral-700 text-white' 
                      : 'bg-neutral-50 hover:bg-[#DCF8C6] border-neutral-200 text-neutral-800'
                  }`}
                >
                  {choice.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Authentic WhatsApp Input Bar */}
      <div className="absolute bottom-1.5 inset-x-0 px-2.5 py-1.5 flex items-center space-x-2 z-20 select-none">
        {/* Main WhatsApp Input Capsule */}
        <div 
          onClick={() => {
            if (status === 'playing' && !isNpcTyping && choices && choices.length > 0) {
              setIsChoicesExpanded(!isChoicesExpanded);
            }
          }}
          className={`flex-1 rounded-full px-3.5 py-2 flex items-center space-x-2 shadow-sm border transition-all ${
            status === 'playing' && !isNpcTyping && choices && choices.length > 0 ? 'cursor-pointer hover:border-emerald-500/50' : ''
          } ${
            isDarkMode 
              ? 'bg-[#202c33] border-[#2a3942] text-neutral-200' 
              : 'bg-white border-neutral-300 text-neutral-800'
          }`}
        >
          {/* Smile / Emoji Icon */}
          <button type="button" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 shrink-0">
            <Smile size={20} />
          </button>

          {/* Text Placeholder / Content */}
          <div className="flex-1 min-w-0">
            {hasProofScreenshot ? (
              <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center truncate">
                <Camera size={14} className="mr-1.5 shrink-0 animate-pulse text-emerald-500" />
                1 Screenshot Bukti Klarifikasi Siap Dikirim
              </span>
            ) : status === 'playing' && !isNpcTyping && choices && choices.length > 0 ? (
              <span className="text-[12px] text-neutral-500 dark:text-neutral-400 truncate flex items-center">
                <span>Ketik pesan...</span>
                <span className="ml-1.5 text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {choices.length} Pilihan Balasan {isChoicesExpanded ? '▲' : '▼'}
                </span>
              </span>
            ) : isWaitingForProof ? (
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 italic truncate">
                Ketik pesan... (Buka Safari untuk cek bukti)
              </span>
            ) : (
              <span className="text-[12px] text-neutral-400 dark:text-neutral-500 italic truncate">
                {status !== 'playing' ? 'Simulasi selesai' : 'Ketik pesan...'}
              </span>
            )}
          </div>

          {/* Paperclip */}
          <button type="button" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 shrink-0">
            <Paperclip size={18} />
          </button>

          {/* Camera icon */}
          <button 
            type="button" 
            onClick={(e) => {
              if (hasProofScreenshot) {
                e.stopPropagation();
                handleSendProof();
              }
            }}
            className={`shrink-0 ${hasProofScreenshot ? 'text-emerald-500 animate-pulse' : 'text-neutral-400'}`}
          >
            <Camera size={19} />
          </button>
        </div>

        {/* Circular Send / Mic button */}
        {hasProofScreenshot ? (
          <button 
            onClick={handleSendProof}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#00a884] hover:bg-[#008f6f] shadow-md flex-shrink-0 active:scale-95 transition-transform animate-bounce"
            title="Kirim Bukti Screenshot Cek Fakta"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        ) : status === 'playing' && !isNpcTyping && choices && choices.length > 0 ? (
          <button 
            onClick={() => setIsChoicesExpanded(!isChoicesExpanded)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#00a884] hover:bg-[#008f6f] shadow-md flex-shrink-0 active:scale-95 transition-transform"
            title={isChoicesExpanded ? "Tutup Pilihan" : "Buka Pilihan Respon"}
          >
            <Send size={16} className="ml-0.5" />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#00a884]/60 shadow-md flex-shrink-0 opacity-70">
            <Mic size={18} />
          </div>
        )}
      </div>

      {/* Minigame 1: Forward Message Sheet */}
      {showForwardModal && (
        <ForwardMessageModal 
          onClose={handleCloseForwardModal}
          onForwardComplete={handleCompleteForward}
        />
      )}

      {/* Minigame 2: Malware Spam Broadcast Animation */}
      {showSpamAnimation && (
        <SpamBroadcastAnimation 
          onFinished={handleFinishSpamAnimation}
        />
      )}

      {/* Level 4 Minigame: Sandbox APK & Permission Inspector Modal */}
      {inspectingApkAttachment && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex flex-col justify-center items-center animate-in fade-in duration-200">
          <div className={`w-full max-w-[340px] rounded-3xl p-4 border shadow-2xl space-y-3 ${
            isDarkMode ? 'bg-[#1c1c1e] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                  <FileWarning size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">SimOS Sandbox Inspector</h3>
                  <p className="text-[10px] text-neutral-400">Analisis Keamanan Berkas Kurir</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingApkAttachment(null)}
                className="w-6 h-6 rounded-full bg-neutral-500/20 flex items-center justify-center text-xs font-bold hover:bg-neutral-500/40"
              >
                ✕
              </button>
            </div>

            {/* File Anatomy Card */}
            <div className="p-2.5 rounded-xl bg-neutral-500/10 border border-neutral-500/20 space-y-1.5 font-mono text-[10.5px]">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Nama Berkas:</span>
                <span className="font-bold text-rose-400">{inspectingApkAttachment.fileName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Ekstensi Sebenarnya:</span>
                <span className="font-bold text-rose-400 bg-rose-500/15 px-1 py-0.2 rounded">.APK (Executable Binary)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Klaim Pengirim:</span>
                <span className="font-bold text-amber-400">Foto Resi Paket (.JPG palsu)</span>
              </div>
            </div>

            {/* Permissions Threat Analysis */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-rose-500 flex items-center">
                <AlertOctagon size={13} className="mr-1" />
                <span>Izin Akses Berbahaya yang Diminta:</span>
              </p>
              <div className="space-y-1 text-[10px] bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl text-neutral-300">
                <p>🚨 <strong>RECEIVE_SMS:</strong> Menyadap seluruh SMS masuk, termasuk kode OTP Mobile Banking.</p>
                <p>🚨 <strong>READ_CONTACTS:</strong> Mencuri kontak telepon untuk menyebarkan malware ke kerabat.</p>
                <p>🚨 <strong>INTERNET:</strong> Mengirim data pribadi ke server penipu secara diam-diam.</p>
              </div>
            </div>

            {/* Pedagogical Rule */}
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10.5px] text-blue-300 leading-relaxed">
              💡 <strong>Prinsip Jeda Kritis 5 Detik:</strong> Dokumen foto resi pengiriman asli SELALU berformat <code className="bg-black/30 px-1 rounded">.JPG</code>, <code className="bg-black/30 px-1 rounded">.PNG</code>, atau <code className="bg-black/30 px-1 rounded">.PDF</code>. Dokumen foto TIDAK PERNAH berupa file instalasi aplikasi Android (.APK)!
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setInspectingApkAttachment(null);
                  useChatStore.getState().recordDecision({
                    stepTitle: 'Deteksi & Penolakan Malware APK',
                    prompt: 'Analisis Izin File APK Kurir Misterius',
                    chosenText: 'Tolak, Hapus Berkas APK Berbahaya, dan Blokir Nomor Kurir',
                    points: 3,
                    nodeId: 'node_block_courier_safe',
                    alternatives: [
                      { text: 'Pasang File APK Tanpa Memeriksa Ekstensi', points: 0 },
                      { text: 'Tolak & Blokir Nomor Kurir Berbahaya', points: 3 }
                    ],
                    causalityAnalysis: {
                      riskLevel: 'Aman',
                      mechanism: 'Mengenali manipulasi ekstensi .APK dan menolak instalasi aplikasi pihak ketiga tak dikenal.',
                      consequence: 'Saldo tabungan dan kode SMS OTP perbankan terlindungi sepenuhnya dari penyadapan.',
                      bestPracticeRecommendation: 'Jangan pernah memasang file .APK dari pesan WhatsApp atau kontak tak dikenal.'
                    }
                  });
                  advanceNode('node_block_courier_safe');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/30 active:scale-98 flex items-center justify-center space-x-1.5 transition-all"
              >
                <ShieldCheck size={14} />
                <span>Tolak, Karantina & Blokir Nomor (Aman)</span>
              </button>

              <button
                onClick={() => {
                  setInspectingApkAttachment(null);
                  advanceNode('download_apk_fatal');
                }}
                className="w-full border border-rose-800/80 text-rose-400 hover:bg-rose-950/40 text-xs py-1.5 rounded-xl transition-colors font-medium"
              >
                <span>Bypass Sandbox & Pasang Tetap Lanjut (Risiko Tinggi)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
