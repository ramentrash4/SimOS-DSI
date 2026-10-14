import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  Projector,
  Smartphone,
  Globe
} from 'lucide-react';
import { useChatStore } from '@/store/chat';
import MissionReviewDashboard from '@/features/story-engine/components/MissionReviewDashboard';

export default function FullscreenLayout() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'phone'>('dashboard');

  const { status, isDebriefCardOpen, debriefCard } = useChatStore();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleZoomIn = () => setScale((s) => Math.min(1.35, s + 0.1));
  const handleZoomOut = () => setScale((s) => Math.max(0.85, s - 0.1));

  const missionTitles: Record<string, string> = {
    m1: 'Level 1: Pesan Berantai (Hoax)',
    m2: 'Level 2: Poster Pensi (HAKI)',
    m3: 'Level 3: Bercanda atau Menyakiti? (Bullying)',
    m4: 'Level 4: Kurir Misterius (Malware APK)',
    m5: 'Level 5: Jejak yang Tertinggal (Footprint)'
  };

  const currentTitle = missionId ? missionTitles[missionId] || 'SimOS DSI' : 'SimOS DSI';

  const isMissionCompleted = (status === 'success' || status === 'partial' || status === 'gameover') && isDebriefCardOpen && Boolean(debriefCard);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-between overflow-x-hidden relative select-none">
      
      {/* Top Floating Facilitator Bar (Mode Proyektor) */}
      <header className="w-full z-40 bg-neutral-900/85 backdrop-blur-md border-b border-neutral-800/80 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            onClick={() => navigate('/app/dashboard')}
            variant="ghost"
            size="sm"
            className="text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold px-2.5 sm:px-3"
          >
            <ArrowLeft size={16} className="mr-1 sm:mr-1.5" />
            <span className="hidden xs:inline">Dasbor</span>
          </Button>

          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-neutral-800/80 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-neutral-300 border border-neutral-700/50">
            <Projector size={13} className="text-yellow-400 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-[280px]">{currentTitle}</span>
          </div>

          {/* If mission completed, allow quick toggle between Web Dashboard and Phone View */}
          {isMissionCompleted && (
            <div className="hidden sm:flex items-center bg-neutral-800/90 rounded-lg p-0.5 border border-neutral-700 ml-2">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe size={13} />
                <span>Web Pedagogik</span>
              </button>
              <button
                onClick={() => setViewMode('phone')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'phone'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone size={13} />
                <span>Layar Ponsel</span>
              </button>
            </div>
          )}
        </div>

        {/* Presentation Controls: Zoom & Fullscreen */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {(!isMissionCompleted || viewMode === 'phone') && (
            <div className="hidden sm:flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700">
              <Button
                onClick={handleZoomOut}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-neutral-300 hover:text-white"
                title="Perkecil Ukuran"
              >
                <ZoomOut size={14} />
              </Button>
              <span className="text-[11px] font-mono px-2 text-neutral-300">
                {Math.round(scale * 100)}%
              </span>
              <Button
                onClick={handleZoomIn}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-neutral-300 hover:text-white"
                title="Perbesar Ukuran"
              >
                <ZoomIn size={14} />
              </Button>
            </div>
          )}

          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700 px-2 sm:px-3"
            title="Layar Penuh Proyektor"
          >
            {isFullscreen ? <Minimize size={14} className="sm:mr-1" /> : <Maximize size={14} className="sm:mr-1" />}
            <span className="hidden md:inline">{isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      {isMissionCompleted ? (
        /* SPLIT SCREEN LAYOUT: 30% Phone on the left, 70% Analysis on the right */
        <main className="flex-1 w-full h-[calc(100dvh-50px)] flex flex-col lg:flex-row items-stretch overflow-hidden">
          {/* Left Column: 30% Virtual Phone Screen (Synced with Analysis) */}
          <div className="w-full lg:w-[32%] xl:w-[30%] min-w-[340px] max-w-[430px] h-[48vh] lg:h-full flex items-center justify-center p-2 lg:p-4 bg-neutral-950/80 border-b lg:border-b-0 lg:border-r border-neutral-800/80 shrink-0 overflow-hidden relative">
            <div 
              style={{ transform: `scale(${scale * 0.90})`, transformOrigin: 'center center' }}
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
            >
              <Outlet />
            </div>
          </div>

          {/* Right Column: 70% Comprehensive Causality & Debrief Analysis */}
          <div className="flex-1 w-full h-[52vh] lg:h-full overflow-y-auto bg-neutral-900/60 p-2 sm:p-4 lg:p-6">
            <MissionReviewDashboard />
          </div>
        </main>
      ) : (
        /* Phone View (Playing simulation) */
        <main className="flex-1 w-full h-[calc(100dvh-50px)] flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden sm:overflow-auto">
          <div 
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            className="w-full h-full sm:w-auto sm:h-auto flex items-center justify-center transition-transform duration-200"
          >
            <Outlet />
          </div>
        </main>
      )}

      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
