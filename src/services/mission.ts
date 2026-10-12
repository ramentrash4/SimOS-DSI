import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSaveMissionProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, missionId, stars }: { userId: string; missionId: string; stars: number }) => {
      if (!userId) throw new Error('User not authenticated');

      if (userId.startsWith('demo-')) {
        const raw = localStorage.getItem('simos_demo_progress_' + userId) || '[]';
        let list: Array<{ user_id: string; mission_id: string; stars: number; updated_at: string }> = [];
        try {
          list = JSON.parse(raw);
        } catch {
          list = [];
        }
        const existingIdx = list.findIndex(p => p.mission_id === missionId);
        const record = { user_id: userId, mission_id: missionId, stars, updated_at: new Date().toISOString() };
        if (existingIdx >= 0) {
          list[existingIdx] = record;
        } else {
          list.push(record);
        }
        localStorage.setItem('simos_demo_progress_' + userId, JSON.stringify(list));
        return record;
      }
      
      const { data, error } = await supabase
        .from('mission_progress')
        .upsert(
          { 
            user_id: userId, 
            mission_id: missionId, 
            stars, 
            updated_at: new Date().toISOString() 
          },
          { onConflict: 'user_id,mission_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the query that fetches the user's progress
      queryClient.invalidateQueries({ queryKey: ['mission_progress', variables.userId] });
    },
  });
}

// Query to fetch the user's progress
export function useMissionProgress(userId?: string) {
  return useQuery({
    queryKey: ['mission_progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      if (userId.startsWith('demo-')) {
        const raw = localStorage.getItem('simos_demo_progress_' + userId) || '[]';
        try {
          return JSON.parse(raw);
        } catch {
          return [];
        }
      }
      const { data, error } = await supabase
        .from('mission_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

