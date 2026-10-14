import { useState } from 'react';
import { useSimOSStore } from '@/store/simos';
import { sfx } from '@/utils/audio';
import { 
  ChevronLeft, 
  Send, 
  Info, 
  Download, 
  CheckCircle2, 
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'screenshots' | 'downloads' | 'school';
  url: string;
  thumbnailUrl?: string;
  source: string;
  license: string;
  licenseType: 'safe_cc' | 'official' | 'copyright_risk' | 'personal';
  timestamp: string;
  fileSize: string;
  resolution: string;
  pedagogicalNote: string;
}

export default function GalleryApp() {
  const { openApp, isDarkMode, hasProofScreenshot } = useSimOSStore();

  const [activeTab, setActiveTab] = useState<'all' | 'screenshots' | 'downloads' | 'school'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showMetadata, setShowMetadata] = useState(true);

  const galleryItems: GalleryItem[] = [
    {
      id: 'proof-screenshot-l1',
      title: 'Screenshot Klarifikasi Hoax SMAN 1',
      category: 'screenshots',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
      source: 'https://sman1-official.sch.id/klarifikasi-hoax',
      license: 'Dokumen Resmi Sekolah (Domain .sch.id)',
      licenseType: 'official',
      timestamp: 'Hari ini, 07:15',
      fileSize: '412 KB',
      resolution: '1080 x 2400 px',
      pedagogicalNote: 'Tangkapan layar otentik dari portal sekolah resmi untuk menangkal disinformasi di grup WhatsApp.'
    },
    {
      id: 'mascot-cc',
      title: 'Maskot Rubah Pentas Seni (CC-BY 4.0)',
      category: 'downloads',
      url: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?q=80&w=600',
      source: 'https://commons.wikimedia.org/wiki/File:Fox_Illustration.png',
      license: 'Creative Commons Attribution (CC-BY 4.0)',
      licenseType: 'safe_cc',
      timestamp: 'Kemarin, 16:40',
      fileSize: '1.2 MB',
      resolution: '2048 x 2048 px',
      pedagogicalNote: 'Karya visual legal untuk poster pensi sekolah, cukup mencantumkan nama ilustrator asli.'
    },
    {
      id: 'poster-copyrighted',
      title: 'Poster Fanart Pinterest (Hak Cipta Penuh)',
      category: 'downloads',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
      source: 'https://pinterest.com/pin/cyber-neon-fox',
      license: 'All Rights Reserved (Hak Cipta Terdaftar)',
      licenseType: 'copyright_risk',
      timestamp: 'Kemarin, 14:20',
      fileSize: '2.4 MB',
      resolution: '1920 x 1080 px',
      pedagogicalNote: 'PERINGATAN HAKI: Karya ini dilarang dicetak atau dijual tanpa kontrak royalti/izin tertulis pemilik.'
    },
    {
      id: 'school-robotics',
      title: 'Dokumentasi Ekskul Robotik SMAN 1',
      category: 'school',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
      source: 'Kamera Siswa SimOS',
      license: 'Dokumentasi Pribadi Siswa',
      licenseType: 'personal',
      timestamp: '08 Okt, 15:30',
      fileSize: '3.1 MB',
      resolution: '4032 x 3024 px',
      pedagogicalNote: 'Dokumentasi kegiatan sekolah bebas digunakan untuk keperluan internal kelompok belajar.'
    },
    {
      id: 'school-class',
      title: 'Suasana Belajar Lab Komputer',
      category: 'school',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
      source: 'Kamera Siswa SimOS',
      license: 'Dokumentasi Pribadi Siswa',
      licenseType: 'personal',
      timestamp: '05 Okt, 10:15',
      fileSize: '2.8 MB',
      resolution: '4032 x 3024 px',
      pedagogicalNote: 'Foto aktivitas kelompok belajar Informatika Fase E.'
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const handleSelectImage = (item: GalleryItem) => {
    sfx.playSend();
    setSelectedImage(item);
  };

  const handleSendToChat = () => {
    sfx.playSend();
    openApp('chat');
  };

  return (
    <div className={`flex flex-col h-full select-none animate-in fade-in duration-200 relative ${
      isDarkMode ? 'bg-neutral-950 text-white' : 'bg-neutral-900 text-white'
    }`}>
      {/* Top Header */}
      <div className="bg-black/90 text-white flex items-center justify-between px-3 py-2 z-10 border-b border-neutral-800 backdrop-blur-md">
        <button 
          onClick={() => openApp('home')} 
          className="flex items-center text-blue-400 hover:text-blue-300 font-semibold text-xs active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="-ml-1" />
          <span>Layar Utama</span>
        </button>

        <div className="flex items-center space-x-1">
          <ImageIcon size={14} className="text-sky-400" />
          <span className="text-xs font-bold">Galeri Foto & Berkas</span>
        </div>

        <span className="text-[10px] font-mono text-neutral-400">
          {galleryItems.length} Foto
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-900/90 border-b border-neutral-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Semua ({galleryItems.length})
        </button>
        <button
          onClick={() => setActiveTab('screenshots')}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 flex items-center space-x-1 ${
            activeTab === 'screenshots'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Camera size={11} />
          <span>Tangkapan Layar</span>
          {hasProofScreenshot && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 flex items-center space-x-1 ${
            activeTab === 'downloads'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Download size={11} />
          <span>Unduhan & Poster</span>
        </button>
        <button
          onClick={() => setActiveTab('school')}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all shrink-0 ${
            activeTab === 'school'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Dokumentasi
        </button>
      </div>

      {/* Proof Screenshot Notification Banner if in Mission 1 */}
      {hasProofScreenshot && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-emerald-300">
          <div className="flex items-center space-x-1.5 truncate">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold truncate">Screenshot Bukti Safari Tersimpan</span>
          </div>
          <button 
            onClick={() => openApp('chat')}
            className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded-full shrink-0"
          >
            Kirim ke Chatter
          </button>
        </div>
      )}

      {/* Grid of Images (3 columns) */}
      <div className="flex-1 overflow-y-auto p-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {filteredItems.map(item => {
            const isVerifiedProof = item.id === 'proof-screenshot-l1' && hasProofScreenshot;
            return (
              <div 
                key={item.id} 
                onClick={() => handleSelectImage(item)}
                className="aspect-square bg-neutral-800 rounded-lg overflow-hidden relative cursor-pointer group active:scale-95 transition-transform"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />

                {/* Badge Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1">
                  <p className="text-[9.5px] text-white font-semibold truncate leading-tight">
                    {item.title}
                  </p>
                </div>

                {isVerifiedProof && (
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 shadow-md">
                    <span>BUKTI</span>
                  </div>
                )}

                {item.licenseType === 'copyright_risk' && (
                  <div className="absolute top-1 right-1 bg-rose-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    <span>HAKI</span>
                  </div>
                )}

                {item.licenseType === 'safe_cc' && (
                  <div className="absolute top-1 right-1 bg-purple-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    <span>CC-BY</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with Pedagogical Metadata */}
      {selectedImage && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in zoom-in-95 duration-200 select-none">
          {/* Lightbox Top Header */}
          <div className="flex justify-between items-center px-3 py-2.5 bg-black/80 border-b border-neutral-800">
            <button 
              onClick={() => setSelectedImage(null)} 
              className="text-white hover:text-neutral-300 flex items-center space-x-1 text-xs font-semibold"
            >
              <ChevronLeft size={22} className="-ml-1" />
              <span>Kembali</span>
            </button>

            <h3 className="text-xs font-bold text-white truncate max-w-[180px]">
              {selectedImage.title}
            </h3>

            <button 
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-1.5 rounded-full transition-colors ${
                showMetadata ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="Info Metadata Berkas"
            >
              <Info size={15} />
            </button>
          </div>

          {/* Image Display Area */}
          <div className="flex-1 flex items-center justify-center p-3 relative overflow-hidden">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xl border border-neutral-800" 
            />
          </div>

          {/* Metadata Inspector Card */}
          {showMetadata && (
            <div className="bg-neutral-900/95 border-t border-neutral-800 p-3 space-y-2 animate-in slide-in-from-bottom duration-200 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="text-neutral-400 text-[10.5px]">Status Lisensi / Hak Cipta:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedImage.licenseType === 'safe_cc'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : selectedImage.licenseType === 'official'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : selectedImage.licenseType === 'copyright_risk'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedImage.license}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-mono">
                <div>
                  <span className="text-neutral-500 block">Waktu Pengambilan:</span>
                  <span className="text-neutral-200">{selectedImage.timestamp}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Resolusi & Ukuran:</span>
                  <span className="text-neutral-200">{selectedImage.resolution} ({selectedImage.fileSize})</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-[10.5px] leading-relaxed text-neutral-300">
                <p>
                  💡 <strong>Catatan Pedagogik:</strong> {selectedImage.pedagogicalNote}
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleSendToChat}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-9 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-98"
              >
                <Send size={14} />
                <span>Buka di Chatter WhatsApp</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
