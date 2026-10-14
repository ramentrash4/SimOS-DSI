import { useSimOSStore } from '@/store/simos';
import { 
  MessageSquare, 
  Compass, 
  Sparkles, 
  Image as ImageIcon, 
  ShieldCheck, 
  Calendar,
  CloudSun,
  FileText
} from 'lucide-react';

export default function HomeApp() {
  const { openApp, unreadMessages } = useSimOSStore();

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-800 p-5 pt-8 animate-in fade-in duration-150 relative select-none">
      
      {/* Top iOS Smart Widget Card */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-4 text-white shadow-lg flex items-center justify-between mt-2">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5 text-xs text-white/80 font-medium">
            <Calendar size={13} />
            <span>{today}</span>
          </div>
          <h2 className="text-xl font-bold font-mono tracking-tight">SimOS v2.0</h2>
          <p className="text-[11px] text-white/90">Simulasi Perilaku Siber DSI</p>
        </div>
        <div className="flex flex-col items-end">
          <CloudSun size={28} className="text-amber-300 drop-shadow" />
          <span className="text-xs font-semibold mt-1">28°C Cerah</span>
        </div>
      </div>

      {/* Main Apps Grid (4 columns) */}
      <div className="grid grid-cols-4 gap-y-6 gap-x-3 mt-8 px-1">
        
        {/* Chatter App */}
        <button 
          onClick={() => {
            useSimOSStore.getState().setActiveContactId(null);
            openApp('chat');
          }} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <MessageSquare className="text-white" size={28} />
            {unreadMessages > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold animate-pulse shadow-sm">
                {unreadMessages}
              </div>
            )}
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">Chatter</span>
        </button>

        {/* InstaPic App */}
        <button 
          onClick={() => openApp('instapic')} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <Sparkles className="text-white" size={28} />
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">InstaPic</span>
        </button>

        {/* Browser (Safari) App */}
        <button 
          onClick={() => openApp('browser')} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <Compass className="text-white" size={30} />
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">Browser</span>
        </button>

        {/* Galeri App */}
        <button 
          onClick={() => openApp('gallery')} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <ImageIcon className="text-sky-500" size={28} />
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">Galeri</span>
        </button>

        {/* Catatan / Notes App */}
        <button 
          onClick={() => openApp('notes')} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-gradient-to-b from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <FileText className="text-neutral-900" size={28} />
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">Catatan</span>
        </button>

        {/* Messages (SMS) App */}
        <button 
          onClick={() => openApp('messages')} 
          className="flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-gradient-to-b from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform border border-white/20">
            <MessageSquare className="text-white" size={28} />
          </div>
          <span className="text-white text-xs mt-1.5 font-medium drop-shadow-sm">Pesan (SMS)</span>
        </button>
      </div>

      {/* Educational Agent Hint Card */}
      <div className="mt-auto mb-16 bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-white/90 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-amber-300 mb-0.5">
          <ShieldCheck size={14} />
          <span>Fase E: Dampak Sosial Informatika</span>
        </div>
        <p className="text-[11px] text-white/80 leading-snug">
          Buka Chatter atau notifikasi yang masuk untuk memandu keputusan etika siber.
        </p>
      </div>

      {/* iOS Frosted Glass Bottom Dock */}
      <div className="absolute bottom-2.5 inset-x-4 bg-white/25 backdrop-blur-xl border border-white/30 rounded-3xl p-2.5 flex items-center justify-around shadow-2xl">
        <button 
          onClick={() => openApp('chat')} 
          className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform border border-white/20"
          title="Chatter"
        >
          <MessageSquare className="text-white" size={24} />
        </button>

        <button 
          onClick={() => openApp('messages')} 
          className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform border border-white/20"
          title="Pesan SMS"
        >
          <MessageSquare className="text-white" size={24} />
        </button>

        <button 
          onClick={() => openApp('browser')} 
          className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform border border-white/20"
          title="Browser Safari"
        >
          <Compass className="text-white" size={26} />
        </button>

        <button 
          onClick={() => openApp('instapic')} 
          className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform border border-white/20"
          title="InstaPic"
        >
          <Sparkles className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
}
