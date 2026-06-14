import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [profile, setProfile] = useState(null);

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
    setProfile(data);
  }

  async function saveProfile(updates) {
    if (!session?.user?.id) return { error: new Error('No active session') };

    // Call SECURITY DEFINER RPC to bypass RLS
    const { error } = await supabase.rpc('save_profile', {
      p_name:         updates.name         ?? null,
      p_weight_kg:    updates.weight_kg    ?? null,
      p_height_cm:    updates.height_cm    ?? null,
      p_goal:         updates.goal         ?? null,
      p_experience:   updates.experience   ?? null,
      p_days_per_week: updates.days_per_week ?? null,
      p_time_of_day:  updates.time_of_day  ?? null,
      p_rhr:          updates.rhr          ?? null,
      p_onboarded:    updates.onboarded    ?? false,
    });

    if (!error) {
      // Reload fresh profile from DB so App re-renders and exits onboarding
      await loadProfile(session.user.id);
    }

    return { error };
  }

  async function signOut() {
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
