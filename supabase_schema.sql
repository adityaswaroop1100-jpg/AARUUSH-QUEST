-- ==============================================================================
-- AARUUSH QUEST - SUPABASE PARTICIPANTS & SCORING TABLE SCHEMA
-- Run this in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Create the participants table
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  srm_mail_id TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 50,
  completed_portals INTEGER NOT NULL DEFAULT 0,
  total_solved_questions INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC DEFAULT 100,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  rank TEXT DEFAULT 'TECH INITIATE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create index on registration_number and participant_id for fast lookup
CREATE INDEX IF NOT EXISTS idx_participants_reg_no ON public.participants (registration_number);
CREATE INDEX IF NOT EXISTS idx_participants_part_id ON public.participants (participant_id);
CREATE INDEX IF NOT EXISTS idx_participants_score ON public.participants (score DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive policies for public participant creation & update
DROP POLICY IF EXISTS "Allow public insert on participants" ON public.participants;
CREATE POLICY "Allow public insert on participants"
  ON public.participants
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on participants" ON public.participants;
CREATE POLICY "Allow public update on participants"
  ON public.participants
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on participants" ON public.participants;
CREATE POLICY "Allow public read on participants"
  ON public.participants
  FOR SELECT
  USING (true);
