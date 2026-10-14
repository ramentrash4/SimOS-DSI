import { useState, useEffect } from 'react';
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
  Globe,
  Columns
} from 'lucide-react';
import { useChatStore } from '@/store/chat';
import MissionReviewDashboard from '@/features/story-engine/components/MissionReviewDashboard';

export default function FullscreenLayout() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [userScale, setUserScale] = useState(1);
  const [autoScale, setAutoScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'both' | 'dashboard' | 'phone'>('both');

  const { status, debriefCard } = useChatStore();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleZoomIn = () => setUserScale((s) => Math.min(1.3, Number((s + 0.08).toFixed(2))));
  const handleZoomOut = () => setUserScale((s) => Math.max(0.75, Number((s - 0.08).toFixed(2))));

  const missionTitles: Record<string, string> = {
    m1: 'Level 1: Pesan Berantai (Hoax)',
    m2: 'Level 2: Poster Pensi (HAKI)',
    m3: 'Level 3: Bercanda atau Menyakiti? (Bullying)',
    m4: 'Level 4: Kurir Misterius (Malware APK)',
    m5: 'Level 5: Jejak yang Tertinggal (Footprint)'
  };

  const currentTitle = missionId ? missionTitles[missionId] || 'SimOS DSI' : 'SimOS DSI';

  const isMissionCompleted = (status === 'success' || status === 'partial' || status === 'gameover') && Boolean(debriefCard);

  // Dynamic responsive auto-scale calculation
  useEffect(() => {
    const calculateScale = () => {
      const windowH = window.innerHeight;
      const windowW = window.innerWidth;
      const topBarH = 52;
      const availableH = windowH - topBarH - 24;

      let availableW = windowW - 24;
      if (isMissionCompleted && windowW >= 1024 && viewMode !== 'phone') {
        availableW = Math.min(windowW * 0.32, 430);
      } else if (isMissionCompleted && windowW < 1024 && viewMode === 'both') {
        const halfH = (availableH * 0.46) - 10;
        const scaleH = halfH / 812;
        const scaleW = availableW / 380;
        setAutoScale(Math.min(1, Math.max(0.45, Math.min(scaleH, scaleW))));
        return;
      }

      const scaleH = availableH / 812;
      const scaleW = availableW / 380;
      const calculated = Math.min(1, Math.min(scaleH, scaleW));
      setAutoScale(Math.max(0.55, calculated));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMissionCompleted, viewMode]);

  const effectiveScale = Number((autoScale * userScale).toFixed(3));

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-between overflow-x-hidden relative select-none">
      
      {/* Top Floating Facilitator Bar (Mode Proyektor) */}
      <header className="w-full z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-lg h-[52px]">
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

          {/* If mission completed, allow view toggling (Both / Dashboard / Phone) */}
          {isMissionCompleted && (
            <div className="hidden sm:flex items-center bg-neutral-800/90 rounded-lg p-0.5 border border-neutral-700 ml-2">
              <button
                onClick={() => setViewMode('both')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'both'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Berdampingan (Ponsel & Analisis)"
              >
                <Columns size={13} />
                <span className="hidden md:inline">Berdampingan</span>
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Hanya Tampilan Analisis Pedagogik"
              >
                <Globe size={13} />
                <span>Analisis</span>
              </button>
              <button
                onClick={() => setViewMode('phone')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'phone'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Hanya Tampilan Ponsel Virtual"
              >
                <Smartphone size={13} />
                <span>Ponsel</span>
              </button>
            </div>
          )}
        </div>

        {/* Presentation Controls: Zoom & Fullscreen */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
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
              {Math.round(effectiveScale * 100)}%
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

      {/* Main Container - Single persistent element tree to prevent unmounting Outlet */}
      <main className={`flex-1 w-full h-[calc(100dvh-52px)] flex overflow-hidden ${
        isMissionCompleted
          ? (viewMode === 'phone'
              ? 'flex-col items-center justify-center p-2'
              : viewMode === 'dashboard'
              ? 'flex-col lg:flex-row'
              : 'flex-col lg:flex-row items-stretch')
          : 'flex-col items-center justify-center p-0 sm:p-2'
      }`}>
        {/* Virtual Phone Section - Always mounted so game state never resets! */}
        <div className={`transition-all duration-300 flex items-center justify-center shrink-0 overflow-hidden relative ${
          isMissionCompleted
            ? (viewMode === 'dashboard'
                ? 'hidden lg:flex lg:w-[32%] xl:w-[30%] min-w-[320px] max-w-[430px] h-full p-2 bg-neutral-950/80 border-r border-neutral-800/80'
                : viewMode === 'phone'
                ? 'w-full h-full p-2'
                : 'w-full lg:w-[32%] xl:w-[30%] min-w-[320px] max-w-[430px] h-[45vh] lg:h-full p-2 bg-neutral-950/80 border-b lg:border-b-0 lg:border-r border-neutral-800/80')
            : 'w-full h-full p-0 sm:p-2'
        }`}>
          <div 
            style={{ 
              transform: `scale(${effectiveScale})`, 
              transformOrigin: 'center center' 
            }}
            className="flex items-center justify-center transition-transform duration-200"
          >
            <Outlet />
          </div>
        </div>

        {/* Right Column: Pedagogical Analysis Dashboard */}
        {isMissionCompleted && viewMode !== 'phone' && (
          <div className="flex-1 w-full h-[55vh] lg:h-full overflow-y-auto bg-neutral-900/60 p-2 sm:p-4 lg:p-6 animate-in fade-in duration-300">
            <MissionReviewDashboard onTogglePhoneView={() => setViewMode('phone')} />
          </div>
        )}
      </main>

      {/* Ambient Floor Glow */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
