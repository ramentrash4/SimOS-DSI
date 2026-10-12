import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Award, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  totalStars: number;
}

export default function CertificateModal({ isOpen, onClose, studentName, totalStars }: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI Canvas Dimensions (1200 x 800)
    canvas.width = 1200;
    canvas.height = 800;

    // 1. Background Fill
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1200, 800);

    // 2. Ornate Border
    ctx.strokeStyle = '#1E3A8A'; // Deep Navy
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 1160, 760);

    ctx.strokeStyle = '#D97706'; // Gold Accent
    ctx.lineWidth = 4;
    ctx.strokeRect(34, 34, 1132, 732);

    // Corner decorative accents
    const corners = [
      [34, 34],
      [1166, 34],
      [34, 766],
      [1166, 766]
    ];
    corners.forEach(([x, y]) => {
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Header Text
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', 600, 95);

    ctx.fillStyle = '#6B7280';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('KURIKULUM MERDEKA • DAMPAK SOSIAL INFORMATIKA (DSI) FASE E', 600, 122);

    // 4. Certificate Main Title
    ctx.fillStyle = '#B45309'; // Rich Amber
    ctx.font = 'bold 44px "Georgia", serif';
    ctx.fillText('SERTIFIKAT KELULUSAN', 600, 185);

    ctx.fillStyle = '#1F2937';
    ctx.font = 'italic 18px "Georgia", serif';
    ctx.fillText('Dengan bangga dianugerahkan kepada:', 600, 230);

    // 5. Student Full Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 38px "Georgia", serif';
    ctx.fillText(studentName || 'Pelajar Pancasila', 600, 295);

    // Underline for name
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 310);
    ctx.lineTo(850, 310);
    ctx.stroke();

    // 6. Citation Statement
    ctx.fillStyle = '#374151';
    ctx.font = '17px Inter, sans-serif';
    ctx.fillText(
      'Telah berhasil menyelesaikan seluruh 5 Modul Praktik Simulasi Digital dengan predikat:',
      600,
      355
    );

    // 7. Title Badge "DUTA SIBER MUDA"
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText('★ DUTA SIBER MUDA (15 / 15 BINTANG) ★', 600, 400);

    // 8. 5 Competency Badges Box
    const badges = [
      '1. Literasi Cek Fakta',
      '2. Hak Cipta & HAKI',
      '3. Empati Siber',
      '4. Keamanan Data',
      '5. Akuntabilitas Jejak'
    ];

    badges.forEach((text, i) => {
      const boxX = 140 + i * 188;
      const boxY = 445;
      
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(boxX, boxY, 175, 45);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boxX, boxY, 175, 45);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(text, boxX + 87.5, boxY + 28);
    });

    // 9. Signatures and Date
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Date
    ctx.fillStyle = '#4B5563';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Diterbitkan pada: ${today}`, 600, 550);

    // Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px "Georgia", serif';
    ctx.fillText('Guru Fasilitator Informatika', 240, 640);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Koordinator Pembelajaran DSI', 240, 665);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px "Georgia", serif';
    ctx.fillText('SimOS DSI Platform', 960, 640);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Verifikasi Sertifikat Digital Resmi', 960, 665);

    // Signature lines
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(240, 620);
    ctx.lineTo(440, 620);
    ctx.moveTo(760, 620);
    ctx.lineTo(960, 620);
    ctx.stroke();

    // 10. Golden Seal (Center bottom)
    ctx.save();
    ctx.translate(600, 650);
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('DUTA SIBER', 0, -6);
    ctx.fillText('TERVERIFIKASI', 0, 10);
    ctx.restore();

  }, [isOpen, studentName, totalStars]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Sertifikat_Duta_Siber_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Award className="text-amber-500" size={24} />
            <h3 className="font-bold text-lg text-gray-900">Sertifikat Kelulusan Duta Siber</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Certificate Canvas Preview */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 rounded-xl p-3 border">
          <canvas 
            ref={canvasRef} 
            className="w-full max-w-3xl rounded-lg shadow-md border bg-white"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>Predikat Sempurna: 15 dari 15 Bintang Diraih!</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button 
              onClick={handleDownload}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-500/30"
            >
              <Download size={16} className="mr-2" />
              Unduh Sertifikat (.PNG)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
