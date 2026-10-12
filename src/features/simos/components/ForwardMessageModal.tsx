import { useState } from 'react';
import { Check, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sfx } from '@/utils/audio';
import { useSimOSStore } from '@/store/simos';

interface ForwardMessageModalProps {
  onClose: () => void;
  onForwardComplete: () => void;
}

export default function ForwardMessageModal({ onClose, onForwardComplete }: ForwardMessageModalProps) {
  const { isDarkMode } = useSimOSStore();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableGroups = [
    { id: 'futsal', name: 'Ekskul Futsal SMAN 1', members: 18, icon: '⚽' },
    { id: 'osis', name: 'OSIS SMAN 1', members: 24, icon: '🏛️' },
    { id: 'rohis', name: 'Rohis Al-Kautsar', members: 15, icon: '🕌' },
    { id: 'paskibra', name: 'Paskibraka SMAN 1', members: 20, icon: '🇮🇩' },
    { id: 'pramuka', name: 'Gudep Pramuka Wira', members: 22, icon: '🏕️' }
  ];

  const toggleGroup = (id: string) => {
    if (selectedGroups.includes(id)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== id));
    } else {
      setSelectedGroups([...selectedGroups, id]);
    }
  };

  const handleForward = () => {
    if (selectedGroups.length < 3) return;

    setIsSubmitting(true);
    sfx.playSend();

    setTimeout(() => {
      onForwardComplete();
    }, 1000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
      <div className={`border-t rounded-t-3xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[82%] pb-12 flex flex-col ${
        isDarkMode 
          ? 'bg-[#111b21] border-[#202c33] text-white' 
          : 'bg-white border-neutral-200 text-neutral-900'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDarkMode ? 'border-[#202c33]' : 'border-neutral-200'
        }`}>
          <div>
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
              Teruskan Pesan Berantai
            </h3>
            <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Pilih minimal 3 grup ekskul untuk membagikan berita
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDarkMode ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Preview Box */}
        <div className={`my-3 p-2.5 rounded-xl border text-[11px] space-y-1 ${
          isDarkMode 
            ? 'bg-[#202c33]/70 border-neutral-700/60 text-neutral-300' 
            : 'bg-neutral-100 border-neutral-200 text-neutral-700'
        }`}>
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <span>Pesan yang akan diteruskan:</span>
          </span>
          <p className="line-clamp-2 italic text-neutral-800 dark:text-neutral-200">
            "PENGUMUMAN PENTING! Besok kita LIBUR TOTAL karena sidak Dinas... http://info-diknas-sekolah.blogspot.xyz/libur-mendadak"
          </p>
        </div>

        {/* Groups Checklist */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1">
          {availableGroups.map((g) => {
            const isChecked = selectedGroups.includes(g.id);

            return (
              <div 
                key={g.id}
                onClick={() => toggleGroup(g.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked 
                    ? isDarkMode 
                      ? 'bg-[#005c4b]/30 border-emerald-500/60 text-white' 
                      : 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : isDarkMode 
                      ? 'bg-[#202c33]/40 border-neutral-800 text-neutral-300 hover:bg-[#202c33]'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{g.icon}</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">{g.name}</p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>{g.members} anggota</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  isChecked 
                    ? 'bg-[#00a884] border-[#00a884] text-white' 
                    : isDarkMode 
                      ? 'border-neutral-600 bg-neutral-900/40' 
                      : 'border-neutral-300 bg-white'
                }`}>
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          isDarkMode ? 'border-[#202c33]' : 'border-neutral-200'
        }`}>
          <span className={`text-xs font-mono ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Terpilih: <strong className={selectedGroups.length >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>
              {selectedGroups.length} / 3 grup
            </strong>
          </span>

          <Button 
            onClick={handleForward}
            disabled={selectedGroups.length < 3 || isSubmitting}
            className={`text-xs font-bold px-4 h-9 shadow-md transition-all ${
              selectedGroups.length >= 3 
                ? 'bg-[#00a884] hover:bg-[#008f6f] text-white shadow-emerald-500/20' 
                : isDarkMode 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span>Meneruskan ke Grup...</span>
            ) : (
              <span className="flex items-center space-x-1.5">
                <span>Teruskan Sekarang</span>
                <Send size={13} />
              </span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
