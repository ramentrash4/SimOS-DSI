import { useState } from 'react';
import { ChevronLeft, ShieldAlert, CreditCard, KeyRound, Search, Send, CheckCheck } from 'lucide-react';
import { useSimOSStore } from '@/store/simos';

interface SmsThread {
  id: string;
  sender: string;
  avatarBg: string;
  avatarIcon: any;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Array<{
    id: string;
    text: string;
    sender: 'system' | 'user';
    time: string;
  }>;
}

export default function MessagesApp() {
  const { openApp } = useSimOSStore();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const threads: SmsThread[] = [
    {
      id: 'bank',
      sender: 'Bank Merdeka (14045)',
      avatarBg: 'bg-red-600',
      avatarIcon: CreditCard,
      lastMessage: 'Transaksi debit Rp 2.500.000 ke rekening 9012849182 BERHASIL.',
      time: '11:42',
      unread: true,
      messages: [
        {
          id: 'b1',
          text: 'PERINGATAN: Terdeteksi permintaan otorisasi transaksi finansial dari perangkat Anda.',
          sender: 'system',
          time: '11:40'
        },
        {
          id: 'b2',
          text: 'Transaksi debit Rp 2.500.000 ke Virtual Account 9012849182 BERHASIL. Sisa saldo rekening Anda: Rp 14.500.',
          sender: 'system',
          time: '11:42'
        }
      ]
    },
    {
      id: 'otp',
      sender: 'SMS Verifikasi (OTP)',
      avatarBg: 'bg-amber-600',
      avatarIcon: KeyRound,
      lastMessage: 'JANGAN BERIKAN KODE INI KEPADA SIAPAPUN. Kode OTP: 849201.',
      time: '11:39',
      unread: true,
      messages: [
        {
          id: 'o1',
          text: 'JANGAN PERNAH MEMBERIKAN KODE INI KEPADA SIAPAPUN TERMASUK PIHAK KURIR/BANK.',
          sender: 'system',
          time: '11:38'
        },
        {
          id: 'o2',
          text: 'Kode OTP verifikasi transfer perbankan Anda adalah: 849201. Berlaku 5 menit.',
          sender: 'system',
          time: '11:39'
        }
      ]
    },
    {
      id: 'operator',
      sender: 'Pusat Keamanan Siber',
      avatarBg: 'bg-blue-600',
      avatarIcon: ShieldAlert,
      lastMessage: 'Waspada penipuan sniffing malware file .APK via obrolan pesan.',
      time: '08:15',
      unread: false,
      messages: [
        {
          id: 'p1',
          text: 'Waspada modus penipuan sniffing .APK berkedok resi paket kurir, undangan pernikahan, atau surat tilang. Jangan mengklik atau menginstal aplikasi dari pesan tak dikenal.',
          sender: 'system',
          time: '08:15'
        }
      ]
    }
  ];

  const activeThread = threads.find(t => t.id === activeThreadId);

  return (
    <div className="flex flex-col h-full bg-neutral-100 text-neutral-900 select-none animate-in slide-in-from-right duration-200">
      {/* View 1: Thread Conversation */}
      {activeThread ? (
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="bg-neutral-100 border-b border-neutral-200 px-3 py-2.5 flex items-center justify-between">
            <button 
              onClick={() => setActiveThreadId(null)}
              className="flex items-center text-blue-600 font-semibold text-xs active:scale-95"
            >
              <ChevronLeft size={20} className="-ml-1" />
              <span>Pesan</span>
            </button>
            <div className="text-center">
              <p className="font-bold text-xs">{activeThread.sender}</p>
              <p className="text-[10px] text-neutral-500">Pesan Resmi Operator</p>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
            <div className="text-center">
              <span className="text-[10px] bg-neutral-200/60 text-neutral-600 px-2.5 py-0.5 rounded-full font-medium">
                Pemberitahuan Sistem Resmi
              </span>
            </div>

            {activeThread.messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-[12.5px] leading-relaxed shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9.5px] text-neutral-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Read-only SMS bar */}
          <div className="p-2.5 bg-neutral-100 border-t border-neutral-200 flex items-center space-x-2">
            <div className="flex-1 bg-white border border-neutral-300 rounded-full px-3 py-1.5 text-xs text-neutral-400">
              Pengirim tidak menerima balasan pesan...
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600/40 text-white flex items-center justify-center">
              <Send size={14} />
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Threads List */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-neutral-100 px-4 pt-3 pb-2 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => openApp('home')}
                className="text-blue-600 text-xs font-semibold"
              >
                Layar Utama
              </button>
              <h1 className="font-extrabold text-base tracking-tight">Pesan (SMS)</h1>
              <span className="w-8"></span>
            </div>

            {/* Search Bar */}
            <div className="bg-neutral-200/70 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-neutral-500">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Cari pesan atau kontak..." 
                className="bg-transparent outline-none text-xs w-full text-neutral-800 placeholder-neutral-400"
                disabled
              />
            </div>
          </div>

          {/* Thread List Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-200 bg-white">
            {threads.map((thread) => {
              const Icon = thread.avatarIcon;
              return (
                <div 
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className="p-3.5 flex items-start space-x-3 hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer transition-colors"
                >
                  <div className={`w-11 h-11 rounded-full ${thread.avatarBg} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold text-xs truncate text-neutral-900">{thread.sender}</p>
                      <span className="text-[10px] text-neutral-400 flex-shrink-0">{thread.time}</span>
                    </div>
                    <p className="text-[11.5px] text-neutral-600 truncate leading-snug">
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-neutral-100 border-t border-neutral-200 text-center text-[10px] text-neutral-500 flex items-center justify-center space-x-1">
            <CheckCheck size={12} className="text-emerald-600" />
            <span>Semua SMS tersinkronisasi aman</span>
          </div>
        </div>
      )}
    </div>
  );
}
