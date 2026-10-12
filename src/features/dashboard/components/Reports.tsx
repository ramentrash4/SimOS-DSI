import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthUser, useProfile } from '@/services/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Users, Award, Search, Star } from 'lucide-react';

export default function Reports() {
  const { data: user } = useAuthUser();
  const { data: profile } = useProfile(user?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', profile?.class_code],
    queryFn: async () => {
      if (!profile?.class_code) return [];
      if (profile?.id?.startsWith('demo-')) {
        return [
          { id: 'demo-s1', full_name: 'Ahmad Santri', mission_progress: [{ mission_id: 'm1', stars: 3 }, { mission_id: 'm2', stars: 3 }, { mission_id: 'm3', stars: 2 }, { mission_id: 'm4', stars: 3 }, { mission_id: 'm5', stars: 3 }] },
          { id: 'demo-s2', full_name: 'Siti Rahmawati', mission_progress: [{ mission_id: 'm1', stars: 3 }, { mission_id: 'm2', stars: 3 }, { mission_id: 'm3', stars: 3 }, { mission_id: 'm4', stars: 2 }, { mission_id: 'm5', stars: 3 }] },
          { id: 'demo-s3', full_name: 'Budi Kurniawan', mission_progress: [{ mission_id: 'm1', stars: 2 }, { mission_id: 'm2', stars: 2 }, { mission_id: 'm3', stars: 1 }, { mission_id: 'm4', stars: 3 }] },
          { id: 'demo-s4', full_name: 'Dina Ananda', mission_progress: [{ mission_id: 'm1', stars: 3 }, { mission_id: 'm2', stars: 3 }] },
          { id: 'demo-s5', full_name: 'Farhan Rizki', mission_progress: [{ mission_id: 'm1', stars: 1 }] }
        ];
      }
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, full_name,
          mission_progress(mission_id, stars)
        `)
        .eq('role', 'student')
        .eq('class_code', profile.class_code);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.class_code && profile.role === 'teacher'
  });

  if (profile?.role !== 'teacher') return null;

  const handleCopyCode = () => {
    if (profile.class_code) {
      navigator.clipboard.writeText(profile.class_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredStudents = students?.filter((s: any) => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Users size={16} />
            <span>Rekapitulasi Pembelajaran Kelas</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Daftar Nilai Siswa — Kelas {profile.class_code}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau perolehan bintang siswa di seluruh 5 level simulasi Dampak Sosial Informatika.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-indigo-50 border border-indigo-100 p-2.5 px-4 rounded-xl">
          <div>
            <span className="text-[10px] text-indigo-500 font-semibold uppercase block">Kunci Akses Siswa</span>
            <span className="font-mono font-extrabold text-indigo-900 text-lg">{profile.class_code}</span>
          </div>
          <Button 
            onClick={handleCopyCode}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8"
          >
            {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
            {copied ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-gray-800">
              Roster & Progres Kelulusan ({filteredStudents.length} Siswa)
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-9 bg-white"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100/50">
                <TableHead className="font-bold text-xs text-gray-700">Nama Siswa</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">L1: Hoax</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">L2: HAKI</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">L3: Bully</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">L4: Kurir</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">L5: Jejak</TableHead>
                <TableHead className="text-center font-bold text-xs text-gray-700">Total Bintang</TableHead>
                <TableHead className="text-right font-bold text-xs text-gray-700">Predikat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s: any) => {
                const pMap = new Map<string, number>();
                s.mission_progress?.forEach((p: any) => {
                  pMap.set(p.mission_id, p.stars || 0);
                });

                const totalStars = Array.from(pMap.values()).reduce((sum, v) => sum + v, 0);
                const isDutaSiber = totalStars >= 15;

                return (
                  <TableRow key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <TableCell className="font-semibold text-xs text-gray-900">
                      {s.full_name}
                    </TableCell>
                    {['m1', 'm2', 'm3', 'm4', 'm5'].map((mId) => {
                      const st = pMap.get(mId) || 0;
                      return (
                        <TableCell key={mId} className="text-center text-xs">
                          {st > 0 ? (
                            <span className="inline-flex items-center text-amber-500 font-bold">
                              {st}<Star size={11} className="fill-amber-400 ml-0.5" />
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <span className="font-bold text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-800">
                        {totalStars} / 15
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {isDutaSiber ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                          <Award size={11} className="mr-1 text-amber-600" />
                          Duta Siber Muda
                        </span>
                      ) : totalStars > 0 ? (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Sedang Belajar
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Belum Memulai</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* EMPTY STATE */}
              {filteredStudents.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                      <Users size={36} className="text-gray-300" />
                      <p className="font-bold text-sm text-gray-700">Yah, belum ada siswa yang bergabung nih.</p>
                      <p className="text-xs text-gray-500 max-w-sm">
                        Bagikan Kode Kelas <strong className="text-indigo-600 font-mono font-bold">[{profile.class_code}]</strong> ke grup kelas agar siswa terhubung saat mendaftar!
                      </p>
                      <Button onClick={handleCopyCode} variant="outline" size="sm" className="mt-2 text-xs">
                        <Copy size={12} className="mr-1.5" />
                        Salin Kode Kelas
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
