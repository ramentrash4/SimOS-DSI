import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, loginAsDemo, useAuthUser, useProfile, useUpdateProfile } from "@/services/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, UserCheck, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError } = useAuthUser();
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();
  
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [classCode, setClassCode] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user && !isProfileLoading) {
      if (!profile) {
        setFullName(user.user_metadata?.full_name || '');
        setShowRoleDialog(true);
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [user, profile, isProfileLoading, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDemoLogin = (demoRole: 'teacher' | 'student') => {
    loginAsDemo(demoRole);
    queryClient.invalidateQueries({ queryKey: ['authUser'] });
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    navigate('/app/dashboard');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (role === 'student' && !classCode) return alert('Kode Kelas wajib diisi!');
    
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        role,
        fullName,
        classCode: role === 'teacher' ? Math.random().toString(36).substring(2, 8).toUpperCase() : classCode
      });
      setShowRoleDialog(false);
      navigate('/app/dashboard');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil.');
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col space-y-2">
        <div className="text-lg font-semibold animate-pulse">Memuat Login...</div>
        <code className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          User: {isUserLoading ? 'Loading' : user ? 'Found' : 'Null'} | 
          Profile: {isProfileLoading ? 'Loading' : profile ? 'Found' : 'Null'}
        </code>
      </div>
    );
  }

  if (isUserError || isProfileError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col space-y-4 p-4 text-center">
        <p className="text-red-500 font-semibold">Gagal memuat data dari Database.</p>
        <p className="text-sm text-gray-600 max-w-md">Pastikan Anda sudah menjalankan kode SQL dari file <code>supabase/migrations/20261011000000_init.sql</code> di SQL Editor Supabase.</p>
        <div className="bg-red-50 text-red-700 p-4 rounded text-xs max-w-lg text-left break-words">
          <strong>Detail Error:</strong><br />
          User Error: {userError ? userError.message || JSON.stringify(userError) : 'None'}<br />
          Profile Error: {profileError ? profileError.message || JSON.stringify(profileError) : 'None'}
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border border-neutral-200/80 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SimOS DSI</CardTitle>
          <CardDescription className="text-neutral-500 text-sm">
            Simulasi Roleplay Empati & Etika Digital untuk Siswa Fase E (Kurikulum Merdeka)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full h-11 font-medium bg-neutral-900 hover:bg-neutral-800 text-white" onClick={handleLogin}>
            Lanjutkan dengan Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-neutral-400 font-semibold tracking-wider">
                Atau Mode Uji Cepat (Demo)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button"
              variant="outline" 
              className="h-auto py-2.5 px-3 flex flex-col items-center justify-center border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 text-neutral-700 text-xs font-semibold group"
              onClick={() => handleDemoLogin('teacher')}
            >
              <GraduationCap className="h-5 w-5 mb-1 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Demo Guru</span>
              <span className="text-[10px] font-normal text-neutral-400 mt-0.5">Pantau & Rapor</span>
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="h-auto py-2.5 px-3 flex flex-col items-center justify-center border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 text-xs font-semibold group"
              onClick={() => handleDemoLogin('student')}
            >
              <UserCheck className="h-5 w-5 mb-1 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Demo Siswa</span>
              <span className="text-[10px] font-normal text-neutral-400 mt-0.5">Main 5 Level</span>
            </Button>
          </div>

          <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1 pt-1">
            <Sparkles size={12} className="text-amber-500" /> 
            Mode Demo dapat langsung dimainkan tanpa kredensial OAuth
          </p>
        </CardContent>
      </Card>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lengkapi Profil</DialogTitle>
            <DialogDescription>Pilih peran Anda sebelum melanjutkan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Peran</label>
              <div className="flex space-x-4">
                <Button variant={role === 'teacher' ? 'default' : 'outline'} onClick={() => setRole('teacher')}>Guru</Button>
                <Button variant={role === 'student' ? 'default' : 'outline'} onClick={() => setRole('student')}>Siswa</Button>
              </div>
            </div>
            {role === 'student' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Kode Kelas</label>
                <Input value={classCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClassCode(e.target.value)} placeholder="Contoh: X-MIPA-1" />
              </div>
            )}
            <Button className="w-full" onClick={handleSaveProfile} disabled={updateProfile.isPending}>Simpan & Lanjutkan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
