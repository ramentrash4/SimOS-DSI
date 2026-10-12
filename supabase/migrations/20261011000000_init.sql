-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('teacher', 'student')),
  full_name VARCHAR(100) NOT NULL,
  class_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mission_progress table
CREATE TABLE public.mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id VARCHAR(50) NOT NULL,
  stars INT2 CHECK (stars >= 1 AND stars <= 3),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index for mission progress
CREATE UNIQUE INDEX mission_progress_user_mission_idx ON public.mission_progress(user_id, mission_id);
-- Index for class code
CREATE INDEX profiles_class_code_idx ON public.profiles(class_code);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Authenticated users can view any profile" 
ON public.profiles FOR SELECT USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (
  auth.uid() = id
);

-- Mission Progress Policies
CREATE POLICY "Users can view their own progress or teachers can view their students progress"
ON public.mission_progress FOR SELECT USING (
  auth.uid() = user_id OR
  (EXISTS (
    SELECT 1 FROM public.profiles as t, public.profiles as s
    WHERE t.id = auth.uid() AND t.role = 'teacher' AND s.id = mission_progress.user_id AND t.class_code = s.class_code
  ))
);

CREATE POLICY "Users can insert their own progress"
ON public.mission_progress FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own progress"
ON public.mission_progress FOR UPDATE USING (
  auth.uid() = user_id
);
