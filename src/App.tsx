import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '@/components/layouts/AuthLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FullscreenLayout from '@/components/layouts/FullscreenLayout';
import Login from '@/features/auth/components/Login';
import Dashboard from '@/features/dashboard/components/Dashboard';
import Reports from '@/features/dashboard/components/Reports';
import SimOSShell from '@/features/simos/components/SimOSShell';

import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '@/store/chat';
import { mission1 } from '@/data/missions/mission1';
import { mission2 } from '@/data/missions/mission2';
import { mission3 } from '@/data/missions/mission3';
import { mission4 } from '@/data/missions/mission4';
import { mission5 } from '@/data/missions/mission5';

const PlayMission = () => {
  const { missionId } = useParams();
  const startMission = useChatStore((state) => state.startMission);
  const script = useChatStore((state) => state.script);
  const status = useChatStore((state) => state.status);
  const lastMissionIdRef = useRef<string | null>(null);

  useEffect(() => {
    // If the active mission in the store is already this mission, DO NOT restart it!
    if (script?.id === missionId) {
      lastMissionIdRef.current = missionId || null;
      return;
    }
    if (lastMissionIdRef.current === missionId) return;
    lastMissionIdRef.current = missionId || null;

    if (missionId === 'm1') {
      startMission(mission1);
    } else if (missionId === 'm2') {
      startMission(mission2);
    } else if (missionId === 'm3') {
      startMission(mission3);
    } else if (missionId === 'm4') {
      startMission(mission4);
    } else if (missionId === 'm5') {
      startMission(mission5);
    }
  }, [missionId, startMission, script?.id, status]);

  return <SimOSShell />;
};

const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.startsWith('http');

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex h-screen items-center justify-center p-4 text-center bg-gray-100">
        <div className="max-w-md space-y-4 bg-white p-8 rounded-xl shadow-md border border-red-200">
          <h1 className="text-2xl font-bold text-red-600">Konfigurasi Dibutuhkan</h1>
          <p className="text-gray-700 text-sm">File <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500">.env.local</code> belum diisi dengan kredensial Supabase yang valid.</p>
          <p className="text-gray-600 text-sm">Silakan isi <strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong> terlebih dahulu, lalu *restart* server Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/app" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="/app/play" element={<FullscreenLayout />}>
          <Route path=":missionId" element={<PlayMission />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
