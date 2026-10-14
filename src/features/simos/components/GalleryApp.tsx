import { useState } from 'react';
import { useSimOSStore } from '@/store/simos';
import { useChatStore } from '@/store/chat';
import { ChevronLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GalleryApp() {
  const { openApp } = useSimOSStore();
  const { advanceNode } = useChatStore();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    { id: 1, type: 'sensitive', url: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=200' },
    { id: 2, type: 'normal', url: 'https://images.unsplash.com/photo-1506744626753-eda81419728a?q=80&w=200' },
    { id: 3, type: 'normal', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=200' },
  ];

  const handleSend = () => {
    // If they send any photo, trigger gameover for mission 4
    openApp('chat');
    advanceNode('gameover_grooming');
  };

  return (
    <div className="flex flex-col h-full bg-black relative animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="bg-black/90 text-white flex items-center px-2 py-3 z-10 h-16 absolute top-0 inset-x-0">
        <button onClick={() => { openApp('chat'); advanceNode('success_end'); }} className="flex items-center text-white mr-2">
          <ChevronLeft size={28} />
          <span className="text-sm">Batal & Kembali</span>
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pt-16 pb-20 p-1">
        <div className="grid grid-cols-3 gap-1">
          {images.map(img => (
            <div key={img.id} className="aspect-square bg-gray-800 relative cursor-pointer" onClick={() => setSelectedImage(img.id)}>
              <img src={img.url} alt="Gallery item" className={`w-full h-full object-cover ${img.type === 'sensitive' ? 'blur-md' : ''}`} />
              {img.type === 'sensitive' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-[10px] bg-red-500/80 px-2 py-1 rounded-full">SENSITIF</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-4 pt-12 z-50 bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => setSelectedImage(null)} className="text-white">
              <ChevronLeft size={32} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {images.find(i => i.id === selectedImage)?.type === 'sensitive' ? (
              <div className="text-center p-6 w-full">
                <div className="w-full aspect-square mx-auto bg-gray-900 rounded-lg flex items-center justify-center border border-red-500/30 overflow-hidden relative">
                  <img src={images.find(i => i.id === selectedImage)?.url} className="w-full h-full object-cover blur-xl" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4">
                    <span className="text-red-500 text-4xl mb-4">⚠️</span>
                    <p className="text-white text-sm">Konten ini diburamkan karena melanggar pedoman simulasi (konten sensitif/berbahaya).</p>
                  </div>
                </div>
              </div>
            ) : (
              <img src={images.find(i => i.id === selectedImage)?.url} className="w-full max-h-full object-contain" />
            )}
          </div>
          
          <div className="p-6 pb-12 bg-gradient-to-t from-black/80 to-transparent">
            <Button onClick={handleSend} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-lg flex items-center justify-center">
              Kirim ke Chat <Send size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
