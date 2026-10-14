import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store/chat';
import { useAuthUser } from '@/services/auth';
import { useSaveMissionProgress } from '@/services/mission';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Scale, 
  GitFork, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  Clock,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { useEffect } from 'react';
import type { PlayerDecision } from '@/types/mission';

interface MissionReviewDashboardProps {
  onTogglePhoneView?: () => void;
}

export default function MissionReviewDashboard({ onTogglePhoneView }: MissionReviewDashboardProps) {
  const { 
    status, 
    stars, 
    debriefCard, 
    resetMission, 
    decisionHistory, 
    script,
    closeDebriefCard
  } = useChatStore();

  const { data: user } = useAuthUser();
  const saveProgress = useSaveMissionProgress();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'journey' | 'pedagogy' | 'whatif'>('journey');
  const [selectedDecisionIndex, setSelectedDecisionIndex] = useState<number>(0);

  // Auto save progress to Supabase when dashboard opens
  useEffect(() => {
    if ((status === 'success' || status === 'partial' || status === 'gameover') && debriefCard) {
      if (user?.id && script?.id) {
        saveProgress.mutate({
          userId: user.id,
          missionId: script.id,
          stars: stars || 1
        });
      }
    }
  }, [status, debriefCard, user?.id, script?.id, stars, saveProgress.mutate]);

  const effectiveDecisions: PlayerDecision[] = decisionHistory.length > 0 
    ? decisionHistory 
    : [
        {
          id: 'def-1',
          stepIndex: 1,
          stepTitle: 'Penyelesaian Skenario',
          prompt: 'Evaluasi Respons Utama Pemain',
          chosenText: debriefCard?.summary || 'Tindakan simulasi',
          points: debriefCard?.stars || 1,
          nodeId: 'end',
          alternatives: [],
          timestamp: new Date(),
          causalityAnalysis: {
            riskLevel: debriefCard?.status?.includes('BERHASIL') ? 'Aman' : debriefCard?.status === 'BERHASIL PARSIAL' ? 'Sedang' : 'Kritis',
            mechanism: debriefCard?.status?.includes('BERHASIL') 
              ? 'Tindakan diverifikasi dengan sumber resmi atau perlindungan privasi yang tepat.' 
              : 'Terdapat celah keamanan atau keputusan impulsif dalam alur simulasi.',
            consequence: debriefCard?.status?.includes('BERHASIL') 
              ? 'Berhasil mencegah eskalasi risiko siber dan menjaga reputasi digital.' 
              : 'Memicu kerentanan data atau dampak etika digital.',
            bestPracticeRecommendation: 'Terapkan Jeda Kritis 5 Detik dan verifikasi berlapis sebelum berinteraksi di ruang siber.'
          }
        }
      ];

  const currentDecision = effectiveDecisions[selectedDecisionIndex] || effectiveDecisions[0];

  // Synchronize phone view with currently analyzed decision
  useEffect(() => {
    if (currentDecision?.nodeId) {
      useChatStore.getState().setHighlightedDecisionNodeId(currentDecision.nodeId);
    }
  }, [currentDecision?.nodeId]);

  if (!debriefCard) return null;

  const isSuccess = debriefCard.status === 'BERHASIL' || debriefCard.status === 'BERHASIL SEMPURNA';
  const isPartial = debriefCard.status === 'BERHASIL PARSIAL';
  
  const statusColor = isSuccess 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' 
    : isPartial 
    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' 
    : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex flex-col items-center justify-start pb-16 animate-in fade-in duration-500">
      
      {/* Top Banner & Hero Header */}
      <div className="w-full border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-30 px-4 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Mission & Result Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4 w-full md:w-auto">
            <div className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-center shrink-0 ${statusColor}`}>
              {isSuccess ? (
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : isPartial ? (
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wide ${statusColor}`}>
                  {debriefCard.status}
                </span>
                <span className="text-[11px] sm:text-xs text-neutral-400 font-mono">
                  {script?.title || 'Simulasi DSI'}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white truncate mt-0.5">
                {debriefCard.topicTitle}
              </h1>
            </div>
          </div>

          {/* Star Rating & Quick Navigation Controls */}
          <div className="flex items-center justify-between w-full md:w-auto space-x-3 shrink-0">
            {/* 3-Star Rating with Glow */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 bg-neutral-950/80 px-3 py-1.5 rounded-2xl border border-neutral-800">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= debriefCard.stars;
                return (
                  <div key={starIdx} className="relative">
                    <Star
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${
                        isEarned
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] scale-110'
                          : 'text-neutral-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center space-x-2">
              {onTogglePhoneView && (
                <Button
                  onClick={onTogglePhoneView}
                  variant="outline"
                  size="sm"
                  className="bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 text-xs h-9 px-3 font-semibold"
                  title="Lihat Layar Ponsel Terakhir"
                >
                  <Smartphone size={14} className="mr-1.5 text-blue-400" />
                  <span className="hidden sm:inline">Layar HP</span>
                </Button>
              )}

              <Button
                onClick={() => {
                  closeDebriefCard();
                  resetMission();
                }}
                variant="outline"
                size="sm"
                className="bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 text-xs h-9 px-3 font-semibold"
                title="Ulangi Simulasi dari Awal"
              >
                <RotateCcw size={14} className="mr-1.5 text-amber-400" />
                <span>Ulangi</span>
              </Button>

              <Button
                onClick={() => {
                  closeDebriefCard();
                  navigate('/app/dashboard');
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 px-3.5 shadow-lg shadow-blue-500/25"
              >
                <span>Dasbor</span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex flex-col space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'journey'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <GitFork size={15} />
            <span>Alur Keputusan Interaktif ({effectiveDecisions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pedagogy')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'pedagogy'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <BookOpen size={15} />
            <span>Analisis Pedagogik & Hukum</span>
          </button>

          <button
            onClick={() => setActiveTab('whatif')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'whatif'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Sparkles size={15} />
            <span>Simulasi Alternatif ("Bagaimana Jika?")</span>
          </button>
        </div>

        {/* Tab 1: Interactive Decision Journey & Causality Flow */}
        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            
            {/* Left Column: Decision Step Selector Timeline (Lg: 4 cols) */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
                <span>Rangkaian Tindakan Kamu</span>
                <span className="font-mono text-blue-400">{selectedDecisionIndex + 1} / {effectiveDecisions.length}</span>
              </div>

              <div className="space-y-2.5">
                {effectiveDecisions.map((decision, idx) => {
                  const isSelected = idx === selectedDecisionIndex;
                  const isRiskCritical = decision.causalityAnalysis?.riskLevel === 'Kritis';
                  const isRiskWarning = decision.causalityAnalysis?.riskLevel === 'Sedang';

                  return (
                    <div
                      key={decision.id || idx}
                      onClick={() => {
                        setSelectedDecisionIndex(idx);
                        useChatStore.getState().setHighlightedDecisionNodeId(decision.nodeId);
                      }}
                      onMouseEnter={() => {
                        useChatStore.getState().setHighlightedDecisionNodeId(decision.nodeId);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40' 
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isSelected ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-neutral-200 truncate max-w-[150px]">
                            {decision.stepTitle}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isRiskCritical 
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
                            : isRiskWarning 
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        }`}>
                          {decision.causalityAnalysis?.riskLevel || 'Aman'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 font-medium line-clamp-2 leading-snug">
                        "{decision.chosenText}"
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Summary Callout */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-400 space-y-2 mt-2">
                <div className="flex items-center text-blue-400 font-bold">
                  <Info size={14} className="mr-1.5" />
                  <span>Petunjuk Eksplorasi</span>
                </div>
                <p className="leading-relaxed">
                  Pilih setiap langkah di atas untuk membedah rantai kausalitas: bagaimana pilihanmu berdampak pada risiko siber, psikologis, dan hukum di dunia nyata.
                </p>
              </div>
            </div>

            {/* Right Column: Detailed Causality Motion & Inspector (Lg: 8 cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-5">
              
              {/* Selected Choice Header */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Clock size={13} className="text-blue-400" />
                    <span>Langkah #{selectedDecisionIndex + 1}: {currentDecision.prompt}</span>
                  </span>

                  <span className="text-xs font-mono text-neutral-400">
                    Nilai Bobot: <strong className="text-yellow-400">{currentDecision.points} Bintang</strong>
                  </span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 mt-2">
                  <span className="text-[11px] font-bold uppercase text-blue-400 tracking-wide block mb-1">
                    Keputusan yang Diambil:
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    "{currentDecision.chosenText}"
                  </p>
                </div>
              </div>

              {/* Causality Chain Cards (Animated Motion Nodes) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
                  <span>Rantai Kausalitas Digital (Sebab ➔ Akibat)</span>
                  <span className="text-[11px] text-blue-400 flex items-center">
                    <Sparkles size={12} className="mr-1" />
                    Analisis Algoritmik & Sosial
                  </span>
                </div>

                {/* Node 1: Technical & Behavioral Mechanism */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-blue-950/30 border border-neutral-800 hover:border-blue-500/40 rounded-2xl p-4.5 transition-all shadow-md">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Layers size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider">
                        1. Mekanisme di Balik Layar (Sistem & Psikologi)
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed font-medium">
                        {currentDecision.causalityAnalysis?.mechanism || 'Keputusan ini merefleksikan cara kamu merespons rangsangan informasi di ruang digital.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Connector Arrow */}
                <div className="flex justify-center -my-1 text-neutral-600">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500/60 to-amber-500/60"></div>
                </div>

                {/* Node 2: Real Consequence */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-4.5 transition-all shadow-md">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Flame size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                        2. Dampak Nyata di Dunia Riil
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed font-medium">
                        {currentDecision.causalityAnalysis?.consequence || 'Dampak dirasakan langsung pada reputasi, keamanan perangkat, atau integritas sosial santri.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Connector Arrow */}
                <div className="flex justify-center -my-1 text-neutral-600">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-amber-500/60 to-emerald-500/60"></div>
                </div>

                {/* Node 3: DSI Best Practice Recommendation */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-emerald-950/30 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-4.5 transition-all shadow-md">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                        3. Rekomendasi Sikap Digital Santri (DSI Standard)
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed font-medium">
                        {currentDecision.causalityAnalysis?.bestPracticeRecommendation || 'Terapkan Jeda Kritis 5 Detik dan verifikasi bukti sebelum mengambil tindakan.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Alternative Comparison (What could you have chosen?) */}
              {currentDecision.alternatives && currentDecision.alternatives.length > 1 && (
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4.5">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2.5">
                    Perbandingan Pilihan yang Tersedia di Percabangan Ini:
                  </span>
                  <div className="space-y-2">
                    {currentDecision.alternatives.map((alt, aIdx) => {
                      const isChosen = alt.text === currentDecision.chosenText;
                      return (
                        <div 
                          key={aIdx} 
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            isChosen 
                              ? 'bg-blue-900/20 border-blue-500/40 text-blue-200 font-semibold' 
                              : 'bg-black/30 border-neutral-800/80 text-neutral-400'
                          }`}
                        >
                          <span className="truncate pr-2">{alt.text}</span>
                          <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                            {isChosen ? '✔️ Dipilih' : `${alt.points} Bintang`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: Comprehensive Pedagogical Objectives & Legal Deep-Dive */}
        {activeTab === 'pedagogy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            
            {/* Left Column: Pedagogical Objectives & Key Concepts */}
            <div className="flex flex-col space-y-5">
              
              {/* Pedagogical Objectives Card */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Award size={16} />
                  <span>Capaian & Tujuan Pedagogik DSI</span>
                </div>
                
                <div className="space-y-2.5">
                  {(debriefCard.pedagogicalObjectives || [
                    'Mengembangkan kemampuan berpikir kritis (Critical Thinking Pause) dalam menyikapi rangsangan digital.',
                    'Memahami arsitektur ancaman siber berbasis manipulasi sosial (Social Engineering).',
                    'Menginternalisasi akhlak dan adab digital santri dalam menjaga privasi serta kehormatan sesama.'
                  ]).map((obj, oIdx) => (
                    <div key={oIdx} className="flex items-start space-x-2.5 text-xs text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Istilah Kunci DSI Card */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-lg flex-1">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <BookOpen size={16} />
                  <span>Kamus Istilah Kunci (Digital Literacy Glossary)</span>
                </div>

                <div className="space-y-3">
                  {debriefCard.keyTerms.map((item, idx) => (
                    <div key={idx} className="bg-black/40 border border-neutral-800 rounded-xl p-3.5 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <h4 className="text-xs font-bold text-sky-300 tracking-wide">{item.term}</h4>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed pl-4">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Legal Basis & Santri Moral Reflection */}
            <div className="flex flex-col space-y-5">
              
              {/* Dasar Hukum & Regulasi Indonesia */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
                  <Scale size={16} />
                  <span>Landasan Hukum & Regulasi Republik Indonesia</span>
                </div>

                <div className="bg-neutral-950 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">
                    {debriefCard.legalBasis.law}
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {debriefCard.legalBasis.description}
                  </p>
                </div>

                {/* Regulatory Tags */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-400">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                    🏛️ UU ITE No. 1/2024
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                    🛡️ UU PDP No. 27/2022
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                    ⚖️ Permendikbudristek No. 46/2023
                  </span>
                </div>
              </div>

              {/* Moral Message & Santri Reflection Card */}
              <div className="bg-gradient-to-br from-indigo-950/70 via-neutral-900 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
                    <Sparkles size={16} />
                    <span>Refleksi Nilai & Adab Digital Santri</span>
                  </div>

                  <blockquote className="text-sm sm:text-base italic font-serif text-indigo-100 leading-relaxed border-l-2 border-indigo-500/50 pl-4 my-2">
                    "{debriefCard.moralMessage}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-indigo-500/20 mt-4 flex items-center justify-between text-xs text-indigo-300/80">
                  <span>Modul DSI Santri Digital</span>
                  <span className="font-mono">Integritas • Tabayyun • Keadilan</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 3: Interactive What-If Scenarios Simulator */}
        {activeTab === 'whatif' && (
          <div className="flex flex-col space-y-4 animate-in fade-in duration-300">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-neutral-300">
                <HelpCircle size={16} className="text-purple-400 shrink-0" />
                <span>
                  <strong>Laboratorium Simulasi Cabang:</strong> Pelajari skenario alternatif dan konsekuensi nyata jika keputusan berbeda diambil dalam misi ini.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(debriefCard.whatIfScenarios || [
                {
                  choiceTitle: 'Langsung Membagikan Pesan Tanpa Verifikasi',
                  description: 'Siswa langsung mem-forward pesan berantai ke seluruh grup kelas karena takut ketinggalan informasi.',
                  outcomeSummary: 'Hoax menyebar ke ratusan santri, memicu kepanikan massal, dan berpotensi terjerat sanksi pelanggaran UU ITE.',
                  riskLevel: 'Kritis'
                },
                {
                  choiceTitle: 'Mendiamkan Saja Tanpa Melakukan Cek Fakta',
                  description: 'Siswa tidak ikut menyebarkan, namun juga tidak mengingatkan pengirim atau teman-teman sekelas.',
                  outcomeSummary: 'Diri sendiri selamat dari hoax, namun teman sekelas tetap menjadi korban disinformasi karena ketiadaan intervensi kritis.',
                  riskLevel: 'Sedang'
                },
                {
                  choiceTitle: 'Melakukan Tabayyun & Menunjukkan Sumber Primer',
                  description: 'Siswa membuka portal resmi sekolah, mengambil tangkapan layar pengumuman resmi, dan mengklarifikasi secara sopan.',
                  outcomeSummary: 'Penyebaran hoax terputus seketika, ketua kelas menarik pesan, dan suasana kelas kembali kondusif.',
                  riskLevel: 'Aman'
                }
              ]).map((scenario, sIdx) => {
                const isCrit = scenario.riskLevel === 'Kritis';
                const isWarn = scenario.riskLevel === 'Sedang';

                return (
                  <div 
                    key={sIdx}
                    className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-neutral-500 uppercase">
                          Skenario #{sIdx + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCrit 
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
                            : isWarn 
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        }`}>
                          {scenario.riskLevel}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                        {scenario.choiceTitle}
                      </h3>

                      <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="bg-black/50 p-3 rounded-xl border border-neutral-800/80 mt-2">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">
                        Hasil Simulasi Cabang:
                      </span>
                      <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                        {scenario.outcomeSummary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
