import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { ScreenFrame, StatusBar } from '../chrome.jsx';
import { F5 } from '../marks.jsx';

export function AuthScreen({ t }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else setSuccess('Revisa tu email y haz clic en el enlace de confirmación. Luego vuelve aquí para entrar.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(
        error.message.includes('Invalid') ? 'Email o contraseña incorrectos.' : error.message
      );
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: 14,
    border: `1px solid ${t.divider}`, background: t.surface, color: t.fg,
    fontFamily: t.fonts.body, fontSize: 16, outline: 'none',
    boxSizing: 'border-box', marginBottom: 10,
  };

  return (
    <ScreenFrame t={t}>
      <StatusBar t={t}/>

      <div style={{
        height: 'calc(100% - 44px)', display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        padding: '0 28px',
      }}>
        {/* Mark + wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <svg width="64" height="64" viewBox="0 0 80 80" style={{ display: 'block', margin: '0 auto 16px' }}>
            <F5 color={t.accent} stroke={6}/>
          </svg>
          <div style={{
            fontFamily: t.fonts.display, fontWeight: 800, fontSize: 32,
            letterSpacing: '-0.045em', color: t.fg,
          }}>SOMA</div>
          <div style={{
            fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', color: t.fgMuted,
            textTransform: 'uppercase', marginTop: 6,
          }}>Cuerpo · Mente · Tiempo</div>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 4, padding: 3,
          background: t.surface, borderRadius: 999,
          border: `1px solid ${t.divider}`, marginBottom: 20,
        }}>
          {[['login', 'Entrar'], ['signup', 'Crear cuenta']].map(([m, lab]) => (
            <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 999, border: 'none',
                cursor: 'pointer', fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14,
                background: mode === m ? t.fg : 'transparent',
                color: mode === m ? t.bg : t.fgMuted,
                transition: 'background 0.15s',
              }}>{lab}</button>
          ))}
        </div>

        {/* Inputs */}
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" style={inputStyle}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña (mín. 6 caracteres)" style={{ ...inputStyle, marginBottom: 16 }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 14,
            background: `${t.semantic.low}22`, border: `1px solid ${t.semantic.low}44`,
            fontFamily: t.fonts.body, fontSize: 13, color: t.semantic.low,
          }}>{error}</div>
        )}

        {success && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 14,
            background: `${t.semantic.ok}22`, border: `1px solid ${t.semantic.ok}44`,
            fontFamily: t.fonts.body, fontSize: 13, color: t.semantic.ok,
          }}>{success}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            cursor: loading ? 'default' : 'pointer',
            background: (!email || !password) ? t.s2 : t.accent,
            color: (!email || !password) ? t.fgFaint : t.onAccent,
            fontFamily: t.fonts.body, fontWeight: 700, fontSize: 16,
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </div>
    </ScreenFrame>
  );
}
