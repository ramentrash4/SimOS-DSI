import { useEffect, useState } from 'react';
import { ShieldAlert, Send } from 'lucide-react';
import { sfx } from '@/utils/audio';

interface SpamBroadcastAnimationProps {
  onFinished: () => void;
}

export default function SpamBroadcastAnimation({ onFinished }: SpamBroadcastAnimationProps) {
  const [sentCount, setSentCount] = useState(0);

  const victimContacts = [
    'Grup OSIS SMAN 1',
    'Ekskul Futsal SMAN 1',
    'Rohis Al-Kautsar',
    'Grup Paskibra SMAN 1',
    'Pak Guru Informatika',
    'Ibu Guru Matematika',
    'Dina Ananda (Ketua Kelas)',
    'Edo (Kapten Futsal)',
    'Sarah (Sekretaris)',
    'Grup Alumni Angkatan 2025',
    'Komite Sekolah SMAN 1',
    'Grup Kelas X-MIPA 2'
  ];

  useEffect(() => {
    sfx.playGlitch();

    const interval = setInterval(() => {
      setSentCount((prev) => {
        if (prev < victimContacts.length) {
          sfx.playSend();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 240);

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3800);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 text-white animate-in fade-in duration-200 select-none">
      
      {/* Glitch Overlay scanline */}
      <div className="absolute inset-0 bg-red-600/20 pointer-events-none mix-blend-multiply animate-pulse"></div>

      {/* Top Threat Banner */}
      <div className="w-full bg-red-600/30 border border-red-500/80 rounded-2xl p-3 text-center space-y-1 mt-6 animate-bounce">
        <div className="flex items-center justify-center space-x-1.5 text-red-400 font-extrabold text-xs tracking-wider uppercase">
          <ShieldAlert size={18} className="animate-spin text-red-500" />
          <span>PERINGATAN SIBER: SKRIP EXPLOIT AKTIF</span>
        </div>
        <p className="text-[11px] text-red-200 font-medium">
          Tautan phishing menginfeksi browser dan mengambil alih sesi pengiriman pesan otomatis!
        </p>
      </div>

      {/* Center Broadcast Feeds */}
      <div className="w-full max-w-xs space-y-2 my-auto">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span>Menyebarkan Spam Broadcast...</span>
          <span className="text-red-400 font-bold">{sentCount} / {victimContacts.length}</span>
        </div>

        <div className="bg-[#111b21] border border-red-900/60 rounded-2xl p-3 h-56 overflow-y-auto space-y-2 shadow-inner">
          {victimContacts.slice(0, sentCount).map((target, idx) => (
            <div 
              key={idx}
              className="bg-[#202c33] p-2 rounded-xl text-left border border-red-500/30 text-[11px] animate-in slide-in-from-bottom-2 duration-150 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <span className="font-bold text-red-400 truncate block">{target}</span>
                <span className="text-[10px] text-neutral-400 truncate block">
                  "Guys besok libur! Cek link ini: http://info-diknas..."
                </span>
              </div>
              <Send size={12} className="text-red-500 ml-2 shrink-0 animate-ping" />
            </div>
          ))}
        </div>

        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-red-500 h-full transition-all duration-200"
            style={{ width: `${(sentCount / victimContacts.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="w-full pb-6 text-center text-xs text-neutral-400 font-mono">
        <p className="animate-pulse text-red-300">
          ⚠️ Token sesi Anda telah bocor ke server peretas phishing!
        </p>
      </div>

    </div>
  );
}
