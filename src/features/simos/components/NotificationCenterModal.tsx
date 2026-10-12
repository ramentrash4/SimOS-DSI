import { Bell, Trash2, ChevronUp, MessageCircle, Sparkles, MessageSquare } from 'lucide-react';
import { useSimOSStore, type AppName } from '@/store/simos';
import { sfx } from '@/utils/audio';

export default function NotificationCenterModal() {
  const { 
    isNotificationCenterOpen, 
    setNotificationCenterOpen, 
    notifications, 
    clearNotifications,
    openApp 
  } = useSimOSStore();

  if (!isNotificationCenterOpen) return null;

  const handleOpenApp = (app: AppName) => {
    sfx.playSend();
    openApp(app);
    setNotificationCenterOpen(false);
  };

  const getAppBadge = (app: AppName) => {
    switch (app) {
      case 'chat':
        return {
          name: 'Chatter',
          icon: <MessageCircle size={14} className="text-[#25D366]" />,
          color: 'bg-emerald-500/20 text-emerald-300'
        };
      case 'instapic':
        return {
          name: 'InstaPic',
          icon: <Sparkles size={14} className="text-pink-400" />,
          color: 'bg-pink-500/20 text-pink-300'
        };
      case 'messages':
        return {
          name: 'Messages',
          icon: <MessageSquare size={14} className="text-blue-400" />,
          color: 'bg-blue-500/20 text-blue-300'
        };
      default:
        return {
          name: 'Sistem',
          icon: <Bell size={14} className="text-amber-400" />,
          color: 'bg-amber-500/20 text-amber-300'
        };
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200 flex flex-col p-4 pt-10 select-none text-white">
      {/* Top iOS Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Bell size={16} className="text-white/70" />
          <h2 className="font-bold text-sm tracking-wide">Pusat Pemberitahuan</h2>
        </div>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <button 
              onClick={() => { clearNotifications(); sfx.playSend(); }}
              className="text-xs px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white/80 flex items-center space-x-1"
              title="Bersihkan Semua Notifikasi"
            >
              <Trash2 size={12} />
              <span>Bersihkan</span>
            </button>
          )}
          <button 
            onClick={() => setNotificationCenterOpen(false)}
            className="p-1 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      {/* Date & Time display */}
      <div className="py-5 text-center">
        <p className="text-4xl font-extralight tracking-tight font-sans">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-xs text-white/60 font-medium mt-1">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {notifications.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-white/40 space-y-2">
            <Bell size={32} className="opacity-30" />
            <p className="text-xs font-medium">Tidak ada pemberitahuan baru</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const badge = getAppBadge(notif.app);
            return (
              <div 
                key={notif.id}
                onClick={() => handleOpenApp(notif.app)}
                className="bg-white/15 hover:bg-white/25 active:scale-98 transition-all backdrop-blur-md border border-white/10 rounded-2xl p-3 cursor-pointer shadow-lg group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    {badge.icon}
                    <span className="text-[11px] font-bold text-white/90">{badge.name}</span>
                  </div>
                  <span className="text-[10px] text-white/50">Baru saja</span>
                </div>
                <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {notif.sender}
                </p>
                <p className="text-[11.5px] text-white/80 line-clamp-2 mt-0.5 leading-snug">
                  {notif.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Dismiss bottom indicator */}
      <div 
        onClick={() => setNotificationCenterOpen(false)}
        className="flex flex-col items-center justify-center cursor-pointer pt-3 group"
      >
        <div className="w-28 h-1 bg-white/50 group-hover:bg-white rounded-full transition-all"></div>
        <span className="text-[10px] text-white/40 mt-1">Ketuk untuk kembali</span>
      </div>
    </div>
  );
}
