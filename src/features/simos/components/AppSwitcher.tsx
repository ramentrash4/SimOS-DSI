import { X, MessageCircle, Sparkles, Compass, MessageSquare, Image, Home, FileText } from 'lucide-react';
import { useSimOSStore, type AppName } from '@/store/simos';
import { sfx } from '@/utils/audio';

export default function AppSwitcher() {
  const { 
    isAppSwitcherOpen, 
    setAppSwitcherOpen, 
    openApps, 
    currentApp, 
    openApp, 
    closeApp 
  } = useSimOSStore();

  if (!isAppSwitcherOpen) return null;

  const getAppMeta = (app: AppName) => {
    switch (app) {
      case 'chat':
        return {
          name: 'Chatter',
          icon: <MessageCircle size={14} className="text-white" />,
          color: 'bg-[#075E54]',
          headerText: 'Grup Kelas X-1',
          bgPreview: 'bg-[#EFEAE2]'
        };
      case 'instapic':
        return {
          name: 'InstaPic',
          icon: <Sparkles size={14} className="text-white" />,
          color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
          headerText: 'Feed & Stories',
          bgPreview: 'bg-white'
        };
      case 'browser':
        return {
          name: 'Safari',
          icon: <Compass size={14} className="text-white" />,
          color: 'bg-blue-600',
          headerText: 'Portal SMAN 1 Merdeka',
          bgPreview: 'bg-slate-50'
        };
      case 'messages':
        return {
          name: 'Messages',
          icon: <MessageSquare size={14} className="text-white" />,
          color: 'bg-emerald-600',
          headerText: 'SMS Bank & OTP',
          bgPreview: 'bg-neutral-100'
        };
      case 'gallery':
        return {
          name: 'Galeri',
          icon: <Image size={14} className="text-white" />,
          color: 'bg-indigo-600',
          headerText: 'Foto & Poster',
          bgPreview: 'bg-neutral-900'
        };
      case 'notes':
        return {
          name: 'Catatan',
          icon: <FileText size={14} className="text-neutral-950" />,
          color: 'bg-amber-400',
          headerText: 'Pusat Catatan DSI',
          bgPreview: 'bg-amber-50'
        };
      default:
        return {
          name: 'Layar Utama',
          icon: <Home size={14} className="text-white" />,
          color: 'bg-neutral-800',
          headerText: 'Home Screen',
          bgPreview: 'bg-neutral-800'
        };
    }
  };

  const handleSelectApp = (app: AppName) => {
    sfx.playSend();
    openApp(app);
  };

  const handleCloseCard = (e: React.MouseEvent, app: AppName) => {
    e.stopPropagation();
    sfx.playWhoosh();
    closeApp(app);
  };

  const displayedApps = openApps.filter(a => a !== 'home');

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200 flex flex-col justify-between p-4 pt-12 select-none text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-2 pb-2">
        <p className="text-xs font-semibold text-white/70">Aplikasi Terbuka ({displayedApps.length})</p>
        <button 
          onClick={() => setAppSwitcherOpen(false)}
          className="text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90"
        >
          Selesai
        </button>
      </div>

      {/* 3D App Cards Carousel */}
      <div className="flex-1 flex items-center overflow-x-auto py-4 px-2 space-x-4 snap-x snap-mandatory no-scrollbar">
        {displayedApps.length === 0 ? (
          <div className="w-full text-center text-white/50 space-y-3">
            <p className="text-sm font-medium">Tidak ada aplikasi di latar belakang</p>
            <button 
              onClick={() => openApp('home')}
              className="text-xs px-4 py-2 bg-white/15 rounded-xl hover:bg-white/25"
            >
              Kembali ke Layar Utama
            </button>
          </div>
        ) : (
          displayedApps.map((app) => {
            const meta = getAppMeta(app);
            const isCurrent = currentApp === app;

            return (
              <div 
                key={app}
                onClick={() => handleSelectApp(app)}
                className={`flex-shrink-0 w-64 h-[420px] rounded-[32px] p-2 flex flex-col justify-between cursor-pointer snap-center transition-all duration-200 transform shadow-2xl border ${
                  isCurrent 
                    ? 'ring-2 ring-blue-500 scale-100 border-white/30 bg-neutral-900/90' 
                    : 'scale-95 opacity-80 hover:opacity-100 hover:scale-98 border-white/10 bg-neutral-900/70'
                }`}
              >
                {/* Card Top Title Bar */}
                <div className="flex items-center justify-between px-2 pt-1 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-lg ${meta.color} flex items-center justify-center shadow-sm`}>
                      {meta.icon}
                    </div>
                    <span className="text-xs font-bold text-white tracking-tight">{meta.name}</span>
                  </div>
                  <button 
                    onClick={(e) => handleCloseCard(e, app)}
                    title="Tutup Aplikasi"
                    className="w-6 h-6 rounded-full bg-white/15 hover:bg-red-500 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90"
                  >
                    <X size={12} />
                  </button>
                </div>

                {/* Card Preview Body */}
                <div className={`flex-1 rounded-[22px] overflow-hidden ${meta.bgPreview} border border-neutral-700/50 flex flex-col relative p-3 shadow-inner text-neutral-800`}>
                  <div className="w-full h-3 rounded-full bg-neutral-200/80 mb-2"></div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-2">
                    <div className={`w-12 h-12 rounded-2xl ${meta.color} flex items-center justify-center mb-2 shadow-md`}>
                      {meta.icon}
                    </div>
                    <p className="font-bold text-xs">{meta.headerText}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Ketuk untuk melanjutkan</p>
                  </div>
                </div>

                {/* Bottom App label */}
                <div className="text-center pt-2 pb-1">
                  <span className="text-[10px] font-medium text-white/60">Geser ke atas untuk menutup</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Dismiss Indicator */}
      <div 
        onClick={() => setAppSwitcherOpen(false)}
        className="flex flex-col items-center justify-center cursor-pointer pt-2 group"
      >
        <div className="w-32 h-1 bg-white/60 group-hover:bg-white rounded-full transition-all"></div>
        <span className="text-[10px] text-white/40 mt-1">Ketuk untuk kembali</span>
      </div>
    </div>
  );
}
