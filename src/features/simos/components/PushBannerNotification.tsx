import { useEffect } from 'react';
import { useSimOSStore } from '@/store/simos';
import { sfx } from '@/utils/audio';
import { MessageSquare, Sparkles, Compass, MessageCircle, AlertTriangle } from 'lucide-react';

export default function PushBannerNotification() {
  const { activeBanner, clearBanner, openApp, isDarkMode } = useSimOSStore();

  useEffect(() => {
    if (activeBanner) {
      sfx.playNotification();
      const timer = setTimeout(() => {
        clearBanner();
      }, 6000); // 6s duration for readability
      return () => clearTimeout(timer);
    }
  }, [activeBanner, clearBanner]);

  if (!activeBanner) return null;

  const handleClick = () => {
    if (activeBanner.app === 'chat') {
      useSimOSStore.getState().setActiveContactId('active');
    }
    openApp(activeBanner.app);
    clearBanner();
  };

  const getAppIcon = () => {
    switch (activeBanner.app) {
      case 'chat':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <MessageSquare size={20} />
          </div>
        );
      case 'instapic':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Sparkles size={20} />
          </div>
        );
      case 'browser':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Compass size={20} />
          </div>
        );
      case 'messages':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <MessageCircle size={20} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-600 to-neutral-800 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <AlertTriangle size={20} />
          </div>
        );
    }
  };

  return (
    <div className="absolute top-10 inset-x-3 z-50 animate-in slide-in-from-top-4 duration-300">
      <div 
        onClick={handleClick}
        className={`backdrop-blur-xl border shadow-2xl rounded-2xl p-3 flex items-center space-x-3 cursor-pointer transition-all active:scale-98 ${
          isDarkMode 
            ? 'bg-neutral-900/95 border-neutral-700/60 text-white hover:bg-neutral-850' 
            : 'bg-white/95 border-neutral-200 shadow-xl text-neutral-900 hover:bg-white'
        }`}
      >
        {getAppIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 truncate">
              <h4 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {activeBanner.sender}
              </h4>
              {activeBanner.isHint && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  Petunjuk
                </span>
              )}
            </div>
            <span className={`text-[10px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              baru saja
            </span>
          </div>
          <p className={`text-[12px] leading-snug line-clamp-2 mt-0.5 ${isDarkMode ? 'text-neutral-200' : 'text-neutral-700'}`}>
            {activeBanner.text}
          </p>
          {activeBanner.isHint && (
            <p className="text-[10px] text-blue-500 font-semibold mt-1">
              (Buka aplikasi dari Layar Utama ponsel secara mandiri)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

