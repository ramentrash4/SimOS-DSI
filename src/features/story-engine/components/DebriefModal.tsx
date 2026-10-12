import { useChatStore } from '@/store/chat';
import { useSaveMissionProgress } from '@/services/mission';
import { useAuthUser } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Star, Shield, BookOpen, RotateCcw, ArrowRight, Award } from 'lucide-react';

export default function DebriefModal() {
  const { status, stars, debriefCard, isDebriefCardOpen, closeDebriefCard, resetMission, script } = useChatStore();
  const { data: user } = useAuthUser();
  const saveProgress = useSaveMissionProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if ((status === 'success' || status === 'partial' || status === 'gameover') && isDebriefCardOpen) {
      if (user?.id && script?.id) {
        saveProgress.mutate({
          userId: user.id,
          missionId: script.id,
          stars: stars || 1
        });
      }
    }
  }, [status, isDebriefCardOpen, user?.id, script?.id, stars, saveProgress.mutate]);

  if (!isDebriefCardOpen || !debriefCard) return null;

  const isSuccess = debriefCard.status === 'BERHASIL' || debriefCard.status === 'BERHASIL SEMPURNA';
  const isPartial = debriefCard.status === 'BERHASIL PARSIAL';

  const badgeColor = isSuccess 
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
    : isPartial 
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-rose-500/20 text-rose-400 border-rose-500/30';

  return (
    <div className="absolute inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start text-white">
        
        {/* Top Header Card */}
        <div className="w-full mt-2 text-center relative">
          <button 
            onClick={closeDebriefCard}
            className="absolute -top-1 right-1 text-white/50 hover:text-white bg-white/10 rounded-full w-7 h-7 flex items-center justify-center text-xs"
            title="Tutup & Lihat Layar HP"
          >
            ✕
          </button>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border mb-2 uppercase tracking-wider ${badgeColor}`}>
            {debriefCard.status}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white mb-1">
            {debriefCard.topicTitle}
          </h2>
          <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
            {debriefCard.summary}
          </p>

          {/* Star Rating Animation */}
          <div className="flex justify-center items-center space-x-2 my-4">
            {[1, 2, 3].map((starIndex) => (
              <div key={starIndex} className="relative">
                <Star
                  size={36}
                  className={`transition-all duration-500 ${
                    starIndex <= debriefCard.stars
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] animate-bounce'
                      : 'text-neutral-700'
                  }`}
                  style={{ animationDelay: `${starIndex * 150}ms` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Cards */}
        <div className="w-full space-y-3 mt-1 pb-20">
          
          {/* Istilah Kunci */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm shadow-sm">
            <div className="flex items-center text-xs font-bold text-sky-400 mb-2">
              <BookOpen size={14} className="mr-1.5" />
              <span>ISTILAH KUNCI DSI</span>
            </div>
            <div className="space-y-2">
              {debriefCard.keyTerms.map((item, idx) => (
                <div key={idx} className="bg-black/30 rounded-xl p-2.5 border border-white/5">
                  <span className="text-xs font-bold text-sky-300">{item.term}: </span>
                  <span className="text-[11px] text-neutral-300 leading-snug">{item.definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dasar Hukum */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5 backdrop-blur-sm shadow-sm">
            <div className="flex items-center text-xs font-bold text-amber-400 mb-1.5">
              <Shield size={14} className="mr-1.5" />
              <span>DASAR HUKUM & REGULASI</span>
            </div>
            <div className="bg-black/30 rounded-xl p-2.5 border border-white/5">
              <p className="text-xs font-semibold text-amber-300">{debriefCard.legalBasis.law}</p>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                {debriefCard.legalBasis.description}
              </p>
            </div>
          </div>

          {/* Pesan Moral Reflektif */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-3.5 text-center shadow-inner">
            <div className="flex justify-center text-indigo-400 mb-1">
              <Award size={16} />
            </div>
            <p className="text-xs italic font-medium text-indigo-200">
              "{debriefCard.moralMessage}"
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 flex space-x-2 z-20">
        <Button
          onClick={() => {
            closeDebriefCard();
            resetMission();
          }}
          variant="outline"
          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-11"
        >
          <RotateCcw size={14} className="mr-1.5" />
          Coba Lagi
        </Button>
        <Button
          onClick={() => {
            closeDebriefCard();
            navigate('/app/dashboard');
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-11 shadow-lg shadow-blue-500/30"
        >
          Kembali ke Dasbor
          <ArrowRight size={14} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
