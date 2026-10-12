import { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Plane, 
  Bluetooth, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Flashlight, 
  Calculator, 
  Timer, 
  Signal, 
  ChevronUp,
  Sliders
} from 'lucide-react';
import { useSimOSStore } from '@/store/simos';
import { sfx } from '@/utils/audio';

export default function ControlCenterModal() {
  const { 
    isControlCenterOpen, 
    setControlCenterOpen, 
    isMuted, 
    toggleMute, 
    isDarkMode, 
    toggleDarkMode 
  } = useSimOSStore();

  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isAirplaneOn, setIsAirplaneOn] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [brightness, setBrightness] = useState(85);

  if (!isControlCenterOpen) return null;

  const handleToggleWifi = () => {
    setIsWifiOn(!isWifiOn);
    sfx.playSend();
  };

  const handleToggleAirplane = () => {
    setIsAirplaneOn(!isAirplaneOn);
    if (!isAirplaneOn) setIsWifiOn(false);
    sfx.playSend();
  };

  const handleToggleFlashlight = () => {
    setIsFlashlightOn(!isFlashlightOn);
    sfx.playSend();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-200 flex flex-col justify-between p-4 pt-12 select-none">
      {/* Tap outside top header */}
      <div className="flex items-center justify-between px-2 text-white/80">
        <div className="flex items-center space-x-1.5 text-xs font-medium">
          <Sliders size={14} className="text-white/60" />
          <span>Control Center</span>
        </div>
        <button 
          onClick={() => setControlCenterOpen(false)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-2 gap-3.5 my-auto animate-in slide-in-from-top-6 duration-300">
        {/* Connectivity 2x2 Plate */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[28px] p-3.5 border border-white/10 grid grid-cols-2 gap-2.5 shadow-lg">
          <button 
            onClick={handleToggleAirplane}
            className={`p-3 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isAirplaneOn ? 'bg-amber-500 text-white' : 'bg-white/15 text-white/70 hover:bg-white/25'
            }`}
            title="Mode Pesawat"
          >
            <Plane size={18} />
          </button>

          <button 
            className="p-3 rounded-full flex items-center justify-center bg-emerald-500 text-white active:scale-95 transition-all"
            title="Data Seluler"
          >
            <Signal size={18} />
          </button>

          <button 
            onClick={handleToggleWifi}
            className={`p-3 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isWifiOn ? 'bg-blue-500 text-white' : 'bg-white/15 text-white/70 hover:bg-white/25'
            }`}
            title="Wi-Fi"
          >
            {isWifiOn ? <Wifi size={18} /> : <WifiOff size={18} />}
          </button>

          <button 
            onClick={() => { setIsBluetoothOn(!isBluetoothOn); sfx.playSend(); }}
            className={`p-3 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isBluetoothOn ? 'bg-blue-500 text-white' : 'bg-white/15 text-white/70 hover:bg-white/25'
            }`}
            title="Bluetooth"
          >
            <Bluetooth size={18} />
          </button>
        </div>

        {/* Media / Sound Output Plate */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[28px] p-3.5 border border-white/10 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="font-semibold text-[11px] truncate">SimOS Synthesizer</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          <div className="py-2">
            <p className="text-[13px] font-bold text-white truncate">Web Audio Engine</p>
            <p className="text-[10px] text-white/60">Stereo 44.1kHz • Normal</p>
          </div>
          <button 
            onClick={() => { toggleMute(); sfx.playSend(); }}
            className={`w-full py-1.5 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
              isMuted ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Suara Hening' : 'Audio Aktif'}</span>
          </button>
        </div>

        {/* Brightness Slider */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[28px] p-3.5 border border-white/10 flex flex-col justify-between h-36 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-white/70 font-medium">
            <span>Kecerahan</span>
            <span>{brightness}%</span>
          </div>
          <div className="relative w-full h-16 bg-white/15 rounded-2xl overflow-hidden flex items-end">
            <div 
              className="w-full bg-white transition-all duration-150"
              style={{ height: `${brightness}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center pt-1">
            <button 
              onClick={() => setBrightness(Math.max(20, brightness - 15))}
              className="text-xs px-2 py-0.5 bg-white/15 rounded-md hover:bg-white/25 active:scale-95"
            >
              -
            </button>
            <button 
              onClick={() => setBrightness(Math.min(100, brightness + 15))}
              className="text-xs px-2 py-0.5 bg-white/15 rounded-md hover:bg-white/25 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Volume & Dark Mode Slider */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[28px] p-3.5 border border-white/10 flex flex-col justify-between h-36 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-white/70 font-medium">
            <span>Tampilan</span>
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </div>
          <button 
            onClick={() => { toggleDarkMode(); sfx.playSend(); }}
            className={`w-full flex-1 my-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isDarkMode ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-neutral-900'
            }`}
          >
            {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
            <span className="text-[11px] font-bold mt-1">{isDarkMode ? 'Mode Gelap' : 'Mode Terang'}</span>
          </button>
        </div>

        {/* Bottom Quick Toggles */}
        <div className="col-span-2 grid grid-cols-3 gap-2.5">
          <button 
            onClick={handleToggleFlashlight}
            className={`py-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs font-semibold border border-white/10 transition-all ${
              isFlashlightOn ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Flashlight size={16} />
            <span className="text-[11px]">Senter</span>
          </button>

          <button 
            onClick={() => sfx.playNotification()}
            className="py-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white/10 text-white border border-white/10 hover:bg-white/20 active:scale-95"
          >
            <Timer size={16} />
            <span className="text-[11px]">Timer</span>
          </button>

          <button 
            onClick={() => sfx.playSend()}
            className="py-3 rounded-2xl flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white/10 text-white border border-white/10 hover:bg-white/20 active:scale-95"
          >
            <Calculator size={16} />
            <span className="text-[11px]">Hitung</span>
          </button>
        </div>
      </div>

      {/* Swipe up dismissal hint */}
      <div 
        onClick={() => setControlCenterOpen(false)}
        className="flex flex-col items-center justify-center cursor-pointer pt-2 group"
      >
        <div className="w-28 h-1 bg-white/50 group-hover:bg-white rounded-full transition-all"></div>
        <span className="text-[10px] text-white/50 mt-1">Ketuk untuk menutup</span>
      </div>
    </div>
  );
}
