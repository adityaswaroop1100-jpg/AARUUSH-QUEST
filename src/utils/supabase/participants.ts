import { supabase } from './client';

export interface ParticipantFormData {
  name: string;
  registration_number: string;
  srm_mail_id: string;
  contact_number: string;
  participant_id: string;
}

export interface ParticipantRecord extends ParticipantFormData {
  id?: string;
  score: number;
  completed_portals: number;
  total_solved_questions: number;
  accuracy?: number;
  time_spent_seconds: number;
  rank?: string;
}

const LOCAL_STORAGE_KEY = 'aaruush_quest_participant';
const LOCAL_STORAGE_ID_KEY = 'aaruush_quest_participant_db_id';

/**
 * Credentials are not pre-filled - every player enters fresh details
 */
export function getStoredParticipant(): ParticipantFormData | null {
  return null;
}

/**
 * Register participant in Supabase upon quest initialization
 */
export async function registerParticipant(data: ParticipantFormData): Promise<{ success: boolean; id?: string; error?: string }> {
  // Always cache locally first for resilience
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to cache participant locally:', err);
  }

  try {
    const payload = {
      name: data.name.trim(),
      registration_number: data.registration_number.trim().toUpperCase(),
      srm_mail_id: data.srm_mail_id.trim().toLowerCase(),
      contact_number: data.contact_number.trim(),
      participant_id: data.participant_id.trim().toUpperCase(),
      score: 50, // Standard minimum score base
      completed_portals: 0,
      total_solved_questions: 0,
      accuracy: 100,
      time_spent_seconds: 0,
      rank: 'TECH INITIATE',
      updated_at: new Date().toISOString(),
    };

    const { data: insertedData, error } = await supabase
      .from('participants')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.warn('Supabase insertion notice (table may need creation or RLS):', error.message);
      return { success: true, error: error.message };
    }

    if (insertedData?.id) {
      localStorage.setItem(LOCAL_STORAGE_ID_KEY, insertedData.id);
      return { success: true, id: insertedData.id };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase network error, using local fallback:', err?.message || err);
    return { success: true, error: err?.message };
  }
}

/**
 * Update the participant's score, solved domains, and rank in Supabase in real-time
 */
export async function updateParticipantLiveScore(
  recordId: string | null,
  participant: ParticipantFormData | null,
  scoreData: {
    score: number;
    completedPortals: number;
    totalSolvedQuestions: number;
    timeSpentSec: number;
    rank?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const idToUse = recordId || localStorage.getItem(LOCAL_STORAGE_ID_KEY);

    const updatePayload: Record<string, any> = {
      score: scoreData.score,
      completed_portals: scoreData.completedPortals,
      total_solved_questions: scoreData.totalSolvedQuestions,
      time_spent_seconds: scoreData.timeSpentSec,
      updated_at: new Date().toISOString(),
    };

    if (scoreData.rank) {
      updatePayload.rank = scoreData.rank;
    }

    // 1. Primary: update by Supabase row UUID
    if (idToUse) {
      const { error } = await supabase
        .from('participants')
        .update(updatePayload)
        .eq('id', idToUse);

      if (!error) return { success: true };
      console.warn('Update by ID warning:', error.message);
    }

    // 2. Fallback: update by registration_number and participant_id
    if (participant?.registration_number && participant?.participant_id) {
      const { error: fallbackError } = await supabase
        .from('participants')
        .update(updatePayload)
        .eq('registration_number', participant.registration_number.trim().toUpperCase())
        .eq('participant_id', participant.participant_id.trim().toUpperCase());

      if (!fallbackError) return { success: true };
      console.warn('Fallback update notice:', fallbackError.message);
      return { success: false, error: fallbackError.message };
    }

    return { success: false, error: 'No identifier available for update' };
  } catch (err: any) {
    console.warn('Error saving live score to database:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Backwards-compatible wrapper for final score update
 */
export const updateParticipantFinalScore = (
  participant: ParticipantFormData,
  scoreData: {
    score: number;
    completedPortals: number;
    totalSolvedQuestions: number;
    timeSpentSec: number;
    rank: string;
  }
) => updateParticipantLiveScore(null, participant, scoreData);
