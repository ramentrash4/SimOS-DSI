import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuthUser() {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const demoUserJson = localStorage.getItem('simos_demo_user');
      if (demoUserJson) {
        try {
          return JSON.parse(demoUserJson);
        } catch {
          // ignore corrupted json
        }
      }
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error && error.message !== 'Auth session missing!') throw error;
      return user;
    }
  });
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      if (userId.startsWith('demo-')) {
        const demoProfileJson = localStorage.getItem('simos_demo_profile');
        if (demoProfileJson) {
          try {
            return JSON.parse(demoProfileJson);
          } catch {
            // ignore
          }
        }
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role, fullName, classCode }: { id: string, role: 'teacher' | 'student', fullName: string, classCode: string }) => {
      if (id.startsWith('demo-')) {
        const profileData = { id, role, full_name: fullName, class_code: classCode };
        localStorage.setItem('simos_demo_profile', JSON.stringify(profileData));
        return profileData;
      }
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id, role, full_name: fullName, class_code: classCode });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
    }
  });
}

export function loginAsDemo(role: 'teacher' | 'student') {
  const demoUser = {
    id: role === 'teacher' ? 'demo-teacher-01' : 'demo-student-01',
    email: `${role}@demo.school`,
    user_metadata: {
      full_name: role === 'teacher' ? 'Bpk. Budi Santoso, S.Kom' : 'Ahmad Santri'
    }
  };

  const demoProfile = {
    id: demoUser.id,
    role,
    full_name: role === 'teacher' ? 'Bpk. Budi Santoso, S.Kom' : 'Ahmad Santri',
    class_code: 'DEMO-X1'
  };

  localStorage.setItem('simos_demo_user', JSON.stringify(demoUser));
  localStorage.setItem('simos_demo_profile', JSON.stringify(demoProfile));
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app/dashboard`,
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  localStorage.removeItem('simos_demo_user');
  localStorage.removeItem('simos_demo_profile');
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore if not logged in via supabase
  }
}

