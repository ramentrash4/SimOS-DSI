import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuthUser, useProfile, signOut } from "@/services/auth";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
  const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError } = useAuthUser();
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error: profileError } = useProfile(user?.id);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col space-y-2">
        <div className="text-lg font-semibold animate-pulse">Memuat Dasbor...</div>
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
        <p className="text-red-500 font-semibold">Gagal memuat Dasbor.</p>
        <p className="text-sm text-gray-600 max-w-md">Pastikan tabel Database sudah terbuat di Supabase.</p>
        <div className="bg-red-50 text-red-700 p-4 rounded text-xs max-w-lg text-left break-words">
          <strong>Detail Error:</strong><br />
          User Error: {userError ? userError.message || JSON.stringify(userError) : 'None'}<br />
          Profile Error: {profileError ? profileError.message || JSON.stringify(profileError) : 'None'}
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">Muat Ulang</Button>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r bg-card flex flex-col p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-8 text-primary">SimOS DSI</h2>
        <div className="mb-4">
          <p className="text-sm font-semibold">{profile.full_name}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
          <p className="text-xs text-muted-foreground">{profile.role === 'teacher' ? 'Kode Kelas:' : 'Kelas:'} {profile.class_code}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/app/dashboard" className="block px-4 py-2 rounded-md hover:bg-accent text-sm font-medium">Dasbor</Link>
          {profile.role === 'teacher' && (
            <Link to="/app/reports" className="block px-4 py-2 rounded-md hover:bg-accent text-sm font-medium">Laporan Kelas</Link>
          )}
        </nav>
        <Button variant="outline" className="mt-auto w-full" onClick={() => signOut()}>Keluar</Button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
