import { useState } from 'react';
import { useAuthUser, useProfile } from '@/services/auth';
import { useMissionProgress } from '@/services/mission';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Projector, 
  Copy, 
  Check, 
  Award, 
  Star, 
  ShieldCheck, 
  Play,
  Users
} from 'lucide-react';
import CertificateModal from './CertificateModal';

export default function Dashboard() {
  const { data: user } = useAuthUser();
  const { data: profile } = useProfile(user?.id);
  const { data: progress } = useMissionProgress(user?.id);
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  if (!profile) return null;

  const missions = [
    {
      id: 'm1',
      num: 1,
      title: 'Level 1: Pesan Berantai',
      category: 'Literasi Hoax & Cek Fakta',
      desc: 'Saring sebelum sharing! Selidiki kabar libur mendadak lewat peramban resmi sekolah.',
      difficulty: 'Mudah',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'm2',
      num: 2,
      title: 'Level 2: Poster Pensi',
      category: 'HAKI & Plagiarisme',
      desc: 'Hadapi tenggat waktu kritis tanpa mencuri karya ilustrator di internet. Gunakan lisensi Creative Commons!',
      difficulty: 'Sedang',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'm3',
      num: 3,
      title: 'Level 3: Bercanda atau Menyakiti?',
      category: 'Cyberbullying & Empati Digital',
      desc: 'Hentikan perundungan siber dan body shaming dengan fitur report dan dukungan moral privat.',
      difficulty: 'Sedang',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'm4',
      num: 4,
      title: 'Level 4: Kurir Misterius',
      category: 'Keamanan Data & Malware Phishing',
      desc: 'Kenali modus penipuan berkedok file foto resi paket berekstensi .APK penyadap saldo rekening.',
      difficulty: 'Tantangan',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'm5',
      num: 5,
      title: 'Level 5: Jejak yang Tertinggal',
      category: 'Digital Footprint & Akuntabilitas',
      desc: 'Sikapi bocornya rekam jejak digital masa lalu dengan integritas dan kedewasaan pemimpin.',
      difficulty: 'Tantangan',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
  ];

  const handleCopyCode = () => {
    if (profile.class_code) {
      navigator.clipboard.writeText(profile.class_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate student stars
  const progressMap = new Map<string, number>();
  if (progress) {
    progress.forEach((p: any) => {
      progressMap.set(p.mission_id, p.stars);
    });
  }

  const totalStars = Array.from(progressMap.values()).reduce((sum, s) => sum + s, 0);
  const isAllStarsCompleted = totalStars >= 15;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* ============================================================== */}
      {/* TEACHER BANNER SECTION                                         */}
      {/* ============================================================== */}
      {profile.role === 'teacher' ? (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/15">
              <Projector size={14} className="text-yellow-300" />
              <span>Dasbor Fasilitator DSI • Mode Pembelajaran Klasikal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Mengajar, {profile.full_name}!
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Pilih salah satu dari 5 level simulasi di bawah untuk diproyeksikan ke layar proyektor kelas. Siswa dapat berdiskusi vokal untuk menentukan keputusan siber.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center min-w-[220px]">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold mb-1">
              Kode Kelas Anda
            </span>
            <span className="text-3xl font-mono font-extrabold tracking-widest text-yellow-300 my-1">
              {profile.class_code || 'X-MIPA-1'}
            </span>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="sm"
              className="mt-2 w-full bg-white text-indigo-900 hover:bg-indigo-50 border-0 font-bold text-xs"
            >
              {copied ? <Check size={14} className="mr-1.5 text-green-600" /> : <Copy size={14} className="mr-1.5" />}
              {copied ? 'Tersalin!' : 'Salin Kode Kelas'}
            </Button>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* STUDENT BANNER & REPUTATION SECTION                            */
        /* ============================================================== */
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/15">
              <ShieldCheck size={14} className="text-yellow-300" />
              <span>Kelas: {profile.class_code} • Agen DSI</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Halo, {profile.full_name}!
            </h1>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Selesaikan seluruh 5 skenario tantangan siber dengan skor Bintang 3 untuk membuka Sertifikat Resmi <strong>Duta Siber Muda</strong>.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center min-w-[200px] text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold">
              Total Prestasi Bintang
            </span>
            <div className="flex items-center space-x-1.5 my-2">
              <Star size={24} className="text-yellow-300 fill-yellow-300 animate-pulse" />
              <span className="text-3xl font-extrabold text-white">
                {totalStars} <span className="text-lg text-emerald-200">/ 15</span>
              </span>
            </div>

            {isAllStarsCompleted ? (
              <Button
                onClick={() => setIsCertModalOpen(true)}
                size="sm"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-extrabold text-xs shadow-lg mt-1"
              >
                <Award size={14} className="mr-1.5" />
                Buka Sertifikat
              </Button>
            ) : (
              <span className="text-[11px] text-emerald-200">
                {15 - totalStars} bintang lagi untuk sertifikat
              </span>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION CATALOG GRID                                           */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {profile.role === 'teacher' ? 'Katalog Misi Proyektor' : 'Pilih Misi Simulasi'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              5 Misi Lengkap Kurikulum Merdeka Fase E Dampak Sosial Informatika
            </p>
          </div>
          {profile.role === 'teacher' && (
            <Button
              onClick={() => navigate('/app/reports')}
              variant="outline"
              size="sm"
              className="text-xs border-indigo-200 hover:bg-indigo-50 text-indigo-700"
            >
              <Users size={14} className="mr-1.5" />
              Lihat Rekap Nilai Siswa
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m) => {
            const starsEarned = progressMap.get(m.id) || 0;

            return (
              <Card 
                key={m.id} 
                className="hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group overflow-hidden border border-gray-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${m.badgeColor}`}>
                      {m.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      Tingkat: {m.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                    {m.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {m.desc}
                  </p>

                  <div className="pt-2 border-t flex items-center justify-between">
                    {/* Stars Badge for Students */}
                    {profile.role === 'student' ? (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={s <= starsEarned ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-gray-500 ml-1">
                          {starsEarned > 0 ? `${starsEarned}/3` : 'Belum'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-xs text-indigo-600 font-semibold">
                        <Projector size={14} />
                        <span>Mode Layar Proyektor</span>
                      </div>
                    )}

                    <Button 
                      onClick={() => navigate(`/app/play/${m.id}`)}
                      className={`text-xs font-bold px-4 ${
                        profile.role === 'teacher' 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Play size={12} className="mr-1.5" />
                      {profile.role === 'teacher' ? 'Mulai Proyeksi' : 'Mainkan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        studentName={profile.full_name}
        totalStars={totalStars}
      />
    </div>
  );
}
