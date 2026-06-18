import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

const LS_PROFILE = 'soma_profile';
function loadLocalProfile() {
  try { return JSON.parse(localStorage.getItem(LS_PROFILE) || 'null'); } catch { return null; }
}
function saveLocalProfile(p) {
  try { localStorage.setItem(LS_PROFILE, JSON.stringify(p)); } catch {}
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [profile, setProfile] = useState(() => loadLocalProfile()); // instant from cache

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      if (session) loadProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      if (session) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    // Merge: cloud as base, local overlay (keeps offline edits + extra fields like age)
    const local = loadLocalProfile() || {};
    const merged = { ...(data || {}), ...local };
    setProfile(merged);
    saveLocalProfile(merged);
  }

  async function saveProfile(updates) {
    // 1) Persist locally + update state immediately (always works, even offline)
    const merged = { ...(profile || {}), ...updates };
    saveLocalProfile(merged);
    setProfile(merged);

    // 2) Best-effort cloud sync (only the fields the RPC supports)
    if (session?.user?.id) {
      try {
        await supabase.rpc('save_profile', {
          p_name:         merged.name         ?? null,
          p_weight_kg:    merged.weight_kg    ?? null,
          p_height_cm:    merged.height_cm    ?? null,
          p_goal:         merged.goal         ?? null,
          p_experience:   merged.experience   ?? null,
          p_days_per_week: merged.days_per_week ?? null,
          p_time_of_day:  merged.time_of_day  ?? null,
          p_rhr:          merged.rhr          ?? null,
          p_onboarded:    merged.onboarded    ?? false,
        });
      } catch { /* offline — local copy keeps the data */ }
    }
    return { error: null };
  }

  async function signOut() {
    try { localStorage.removeItem(LS_PROFILE); } catch {}
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{
      session,
      profile,
      saveProfile,
      signOut,
      loading: session === undefined,
      user: session?.user ?? null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
