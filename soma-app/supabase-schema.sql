-- SOMA — Supabase schema
-- Run this once in Supabase Dashboard > SQL Editor

-- ─── Profiles ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  goal TEXT,
  experience TEXT,
  days_per_week INTEGER DEFAULT 4,
  time_of_day TEXT DEFAULT 'morning',
  rhr INTEGER,
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- ─── Workouts ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  name TEXT,
  wod_type TEXT,
  score_value NUMERIC,
  score_unit TEXT DEFAULT 'time',
  rx BOOLEAN DEFAULT true,
  rpe INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workouts_own" ON workouts FOR ALL USING (auth.uid() = user_id);

-- ─── Personal records ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  movement TEXT NOT NULL,
  category TEXT DEFAULT 'barbell',
  value NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  logged_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prs_own" ON prs FOR ALL USING (auth.uid() = user_id);

-- ─── Daily habits + mood log ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  habit_ids TEXT[] DEFAULT '{}',
  mood INTEGER DEFAULT 3,
  journal_text TEXT,
  locus_text TEXT,
  UNIQUE(user_id, date)
);

ALTER TABLE daily_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_log_own" ON daily_log FOR ALL USING (auth.uid() = user_id);

-- ─── Nutrition log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_name TEXT,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE nutrition_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nutrition_own" ON nutrition_log FOR ALL USING (auth.uid() = user_id);

-- ─── Supplements log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplements_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplement_ids TEXT[] DEFAULT '{}',
  UNIQUE(user_id, date)
);

ALTER TABLE supplements_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "supplements_own" ON supplements_log FOR ALL USING (auth.uid() = user_id);
