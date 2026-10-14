import { useEffect, useState } from 'react';
import { Battery, Wifi, Signal, Volume2, VolumeX, Layers, Bell } from 'lucide-react';
import { useSimOSStore } from '@/store/simos';
import { useChatStore } from '@/store/chat';
import { sfx } from '@/utils/audio';
import ChatApp from './ChatApp';
import HomeApp from './HomeApp';
import GalleryApp from './GalleryApp';
import BrowserApp from './BrowserApp';
import InstaPicApp from './InstaPicApp';
import MessagesApp from './MessagesApp';
import ControlCenterModal from './ControlCenterModal';
import NotificationCenterModal from './NotificationCenterModal';
import AppSwitcher from './AppSwitcher';
import PushBannerNotification from './PushBannerNotification';

export default function SimOSShell() {
  const { 
    isBooting, 
    setBooting, 
    currentApp, 
    openApp, 
    glitchLevel, 
    isMuted, 
    toggleMute,
    isDarkMode,
    setControlCenterOpen,
    setNotificationCenterOpen,
    setAppSwitcherOpen,
    activeBanner 
  } = useSimOSStore();
  const { status } = useChatStore();
  const [isShaking, setIsShaking] = useState(false);
  const [timeStr, setTimeStr] = useState(() => 
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 5000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);
    }, 1200); // 1.2 second boot
    return () => clearTimeout(timer);
  }, [setBooting]);

  useEffect(() => {
    if (status === 'gameover' || glitchLevel >= 2) {
      setIsShaking(true);
      sfx.playGlitch();
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
  }, [status, glitchLevel]);

  return (
    <div className={`relative w-full h-full max-w-[430px] sm:w-[380px] sm:min-w-[380px] sm:max-w-[380px] sm:h-[812px] sm:min-h-[812px] sm:max-h-[812px] bg-black sm:rounded-[50px] sm:shadow-2xl sm:border-[10px] sm:border-neutral-900 sm:ring-4 sm:ring-neutral-800/80 overflow-hidden flex-shrink-0 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
      {/* Notch / Dynamic Island */}
      <div 
        onClick={() => {
          if (activeBanner) {
            if (activeBanner.app === 'chat') {
              useSimOSStore.getState().setActiveContactId('active');
            }
            openApp(activeBanner.app);
            useSimOSStore.getState().clearBanner();
          } else {
            setNotificationCenterOpen(true);
          }
        }}
        className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 cursor-pointer group"
        title="Dynamic Island - Ketuk untuk Pemberitahuan"
      >
        <div className={`bg-black rounded-b-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
          activeBanner ? 'w-56 h-6 px-3 bg-neutral-900 border border-neutral-800' : 'w-36 h-5'
        }`}>
          {activeBanner ? (
            <div className="flex items-center space-x-2 text-[10px] text-white font-medium truncate animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="font-bold text-blue-400 truncate">{activeBanner.sender}:</span>
              <span className="truncate text-neutral-300">{activeBanner.text}</span>
            </div>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-neutral-900 mr-2 border border-neutral-800"></div>
              <div className="w-2 h-2 rounded-full bg-blue-950"></div>
            </>
          )}
        </div>
      </div>

      {/* Adaptive Status Bar */}
      <div className={`absolute top-0 inset-x-0 h-12 flex items-center justify-between px-6 text-xs font-semibold z-40 pt-2 select-none transition-colors duration-200 ${
        currentApp === 'home'
          ? 'text-white bg-gradient-to-b from-black/40 to-transparent drop-shadow-sm'
          : isDarkMode
          ? 'text-white bg-neutral-900/85 backdrop-blur-md border-b border-white/10'
          : 'text-neutral-800 bg-white/85 backdrop-blur-md border-b border-black/5'
      }`}>
        {/* Left: Clock / Notification Center Trigger */}
        <button 
          onClick={() => setNotificationCenterOpen(true)}
          className="flex items-center space-x-1 font-mono tracking-tight hover:opacity-80 transition-opacity p-1 -ml-1 rounded-md"
          title="Buka Pusat Pemberitahuan"
        >
          <span>{timeStr}</span>
          <Bell size={10} className={currentApp === 'home' ? 'text-white/60' : 'text-neutral-400'} />
        </button>

        {/* Right: Controls & Control Center Trigger */}
        <div 
          onClick={() => setControlCenterOpen(true)}
          className="flex items-center space-x-2.5 cursor-pointer hover:opacity-80 p-1 -mr-1 rounded-md transition-opacity"
          title="Buka Pusat Kontrol (Control Center)"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMute(); }} 
            title={isMuted ? "Aktifkan Suara" : "Senyap"}
            className="hover:scale-110 transition-transform p-0.5 rounded"
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-500" />}
          </button>
          <Signal size={13} />
          <Wifi size={13} />
          <Battery size={13} />
        </div>
      </div>

      {/* Screen Content with bottom safe area padding */}
      <div className={`w-full h-full pt-12 pb-9 relative overflow-hidden select-none transition-colors ${
        isDarkMode ? 'bg-neutral-950 text-white' : 'bg-background text-foreground'
      }`}>
        {isBooting ? (
          <div className="flex flex-col w-full h-full items-center justify-center bg-black">
            <h1 className="text-white text-3xl font-extrabold tracking-widest animate-pulse font-mono">SimOS</h1>
            <p className="text-neutral-500 text-xs mt-2 font-mono">DSI Edu System</p>
          </div>
        ) : (
          <>
            <PushBannerNotification />
            {currentApp === 'home' && <HomeApp />}
            {currentApp === 'chat' && <ChatApp />}
            {currentApp === 'gallery' && <GalleryApp />}
            {currentApp === 'browser' && <BrowserApp />}
            {currentApp === 'instapic' && <InstaPicApp />}
            {currentApp === 'messages' && <MessagesApp />}
            {currentApp === 'notes' && <div className="p-6">Notes (WIP)</div>}
          </>
        )}
      </div>
      
      {/* Glitch Overlay */}
      {glitchLevel > 0 && (
        <div className={`absolute inset-0 pointer-events-none z-[60] mix-blend-multiply transition-all ${
          glitchLevel === 1 
            ? 'bg-red-500/10 backdrop-blur-[0.5px]' 
            : 'bg-red-600/30 backdrop-blur-[1.5px] animate-pulse border-4 border-red-500'
        }`}>
          <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]"></div>
        </div>
      )}

      {/* iOS Home Gesture Bar & Controls with Guaranteed Contrast Capsule */}
      <div className="absolute bottom-1 inset-x-0 h-7 flex items-center justify-center z-50 pointer-events-auto select-none">
        <div className="flex items-center justify-between px-3.5 py-1 rounded-full shadow-2xl border backdrop-blur-xl bg-neutral-950/95 border-neutral-700/80 text-white shadow-black/80 ring-1 ring-white/20 transition-all">
          <button 
            onClick={() => setAppSwitcherOpen(true)}
            title="App Switcher (Multitasking Tabs)"
            className="text-white/90 hover:text-white active:text-emerald-400 transition-colors p-1 active:scale-90"
          >
            <Layers size={16} />
          </button>

          <div 
            onClick={() => openApp('home')}
            title="Ketuk untuk kembali ke Layar Utama"
            className="cursor-pointer group px-5 py-1"
          >
            <div className="w-24 h-1.5 bg-white rounded-full transition-all group-active:scale-95 shadow-[0_0_6px_rgba(255,255,255,0.7)] group-hover:bg-white/90"></div>
          </div>

          <button 
            onClick={() => setControlCenterOpen(true)}
            title="Pusat Kontrol"
            className="text-white/90 hover:text-white active:text-emerald-400 transition-colors p-1 active:scale-90"
          >
            <div className="w-3.5 h-2.5 border-2 border-white rounded-[2px] flex items-center justify-center">
              <div className="w-1 h-0.5 bg-white"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Modals & System Sheets */}
      <ControlCenterModal />
      <NotificationCenterModal />
      <AppSwitcher />
    </div>
  );
}

