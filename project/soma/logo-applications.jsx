// SOMA — Application mockups. Black & white only for now;
// theme tints come later. Each tile is a fixed-size frame that
// shows the chosen mark + wordmark applied to a real product surface.

const { Wordmark, WordmarkWithMark, StackedLockup, InlineLockup, Monogram } = window;

// ─── 1 · iOS App Icon, on a home-screen tile ───────────────────────
function AppIconTile({ Mark, font, label = 'SOMA' }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(150deg, #1a1a1a 0%, #2a2a2a 100%)',
      padding: 28, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 14,
    }}>
      <div style={{
        width: 132, height: 132, background: '#0A0A0A',
        borderRadius: 30, boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="88" height="88" viewBox="0 0 80 80" style={{ display: 'block' }}>
          <Mark color="#FFFFFF" stroke={7} />
        </svg>
      </div>
      <div style={{
        fontFamily: '-apple-system, system-ui, sans-serif',
        fontSize: 13, fontWeight: 500, color: '#F4F1EC',
        letterSpacing: 0.1,
      }}>{label}</div>
    </div>
  );
}

// ─── 2 · Splash / launch screen (iPhone proportion) ────────────────
function SplashTile({ Mark, font }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0A0A0A',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 22px 0', color: '#F4F1EC',
        fontFamily: '-apple-system, system-ui', fontSize: 13, fontWeight: 600,
      }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5, fontSize: 12 }}>
          <span>●●●●</span><span>◐</span>
        </span>
      </div>
      {/* center logo */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <StackedLockup font={font} Mark={Mark}
          markSize={120} wordSize={42} color="#F4F1EC" />
      </div>
      {/* bottom tagline */}
      <div style={{
        position: 'absolute', bottom: 36, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600,
        color: '#7A746D', letterSpacing: '0.32em',
      }}>CUERPO · MENTE · TIEMPO</div>
    </div>
  );
}

// ─── 3 · Sign-in screen ────────────────────────────────────────────
function SignInTile({ Mark, font }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0A0A0A',
      padding: '48px 26px 28px', boxSizing: 'border-box', color: '#F4F1EC',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      <InlineLockup font={font} Mark={Mark} size={28} color="#F4F1EC" />

      <div style={{ marginTop: 56 }}>
        <div style={{
          fontFamily: `'${(window.FONT_OPTIONS[font] || window.FONT_OPTIONS.bricolage).family}', sans-serif`,
          fontWeight: 800, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1.08,
        }}>Empieza tu<br />jornada.</div>
        <div style={{ fontSize: 14, color: '#9A938A', marginTop: 12, lineHeight: 1.5 }}>
          Cuerpo, mente y tiempo en una sola app.
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Continuar con Apple', bg: '#F4F1EC', fg: '#0A0A0A' },
          { label: 'Continuar con Google', bg: '#1B1B1B', fg: '#F4F1EC', border: '#2A2A2A' },
          { label: 'Email', bg: 'transparent', fg: '#F4F1EC', border: '#3A3A3A' },
        ].map((b, i) => (
          <div key={i} style={{
            background: b.bg, color: b.fg,
            border: b.border ? `1px solid ${b.border}` : 'none',
            borderRadius: 14, padding: '14px 16px', textAlign: 'center',
            fontSize: 14, fontWeight: 600,
          }}>{b.label}</div>
        ))}
        <div style={{
          fontSize: 11, color: '#6A645D', textAlign: 'center', marginTop: 8,
          lineHeight: 1.5,
        }}>
          Al continuar aceptas los <u>Términos</u> y la <u>Privacidad</u>.
        </div>
      </div>
    </div>
  );
}

// ─── 4 · Dashboard (mobile, dark) ──────────────────────────────────
function DashboardTile({ Mark, font }) {
  const FF = (window.FONT_OPTIONS[font] || window.FONT_OPTIONS.bricolage).family;
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0A0A0A', color: '#F4F1EC',
      padding: '44px 18px 20px', boxSizing: 'border-box', overflow: 'hidden',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      {/* header — wordmark left, avatar right */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 22,
      }}>
        <WordmarkWithMark font={font} Mark={Mark} size={22} color="#F4F1EC" />
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: '#2A2A2A',
        }}></div>
      </div>

      {/* greeting */}
      <div style={{
        fontFamily: `'${FF}', sans-serif`, fontWeight: 800,
        fontSize: 24, letterSpacing: '-0.025em', lineHeight: 1.08,
      }}>Buenas, Elena.</div>
      <div style={{ fontSize: 12, color: '#9A938A', marginTop: 4 }}>
        Jueves 15 · Semana 3 del bloque
      </div>

      {/* recovery widget */}
      <div style={{
        marginTop: 18, padding: 14, background: '#141414', borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <svg width="44" height="44" viewBox="0 0 80 80"><Mark color="#F4F1EC" stroke={7} /></svg>
        <div>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.18em',
            color: '#7A746D' }}>RECOVERY</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 30, fontWeight: 700,
            letterSpacing: '-0.02em', marginTop: 2 }}>87<span style={{
              color: '#9A938A', fontSize: 14, marginLeft: 2 }}>/100</span></div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: '#6A645D',
          textAlign: 'right', lineHeight: 1.4 }}>buen<br />día</div>
      </div>

      {/* quick row of mini widgets */}
      <div style={{
        marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      }}>
        {[
          { label: 'WOD', val: 'LIST', unit: '' },
          { label: 'MACROS', val: '38', unit: '%' },
        ].map((w, i) => (
          <div key={i} style={{
            padding: 12, background: '#141414', borderRadius: 12,
          }}>
            <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono',
              letterSpacing: '0.18em', color: '#7A746D' }}>{w.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700,
              marginTop: 4 }}>{w.val}<span style={{ color: '#9A938A',
                fontSize: 11 }}>{w.unit}</span></div>
          </div>
        ))}
      </div>

      {/* tab bar */}
      <div style={{
        position: 'absolute', bottom: 14, left: 18, right: 18,
        background: '#141414', borderRadius: 24, padding: '10px 14px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {['home', 'train', 'eat', 'log', 'me'].map((t, i) => (
          <div key={t} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === 0 ? '#F4F1EC' : '#3A3A3A',
          }}></div>
        ))}
      </div>
    </div>
  );
}

// ─── 5 · Web landing hero (1440 × 720 scaled) ──────────────────────
function WebHeroTile({ Mark, font }) {
  const FF = (window.FONT_OPTIONS[font] || window.FONT_OPTIONS.bricolage).family;
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0A0A0A', color: '#F4F1EC',
      padding: '28px 44px', boxSizing: 'border-box', overflow: 'hidden',
      position: 'relative', fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      {/* nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <WordmarkWithMark font={font} Mark={Mark} size={26} color="#F4F1EC" />
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', fontSize: 13 }}>
          <span style={{ color: '#9A938A' }}>Producto</span>
          <span style={{ color: '#9A938A' }}>Metodología</span>
          <span style={{ color: '#9A938A' }}>Precios</span>
          <span style={{
            border: '1px solid #3A3A3A', borderRadius: 999,
            padding: '7px 14px', fontWeight: 600,
          }}>Empezar</span>
        </div>
      </div>

      {/* hero */}
      <div style={{
        marginTop: 42, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32,
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', color: '#7A746D', textTransform: 'uppercase',
          }}>· Cuerpo · Mente · Tiempo</div>
          <div style={{
            fontFamily: `'${FF}', sans-serif`, fontWeight: 800, fontSize: 64,
            letterSpacing: '-0.035em', lineHeight: 0.96, marginTop: 14,
          }}>Train<br />everything.</div>
          <div style={{
            fontSize: 15, color: '#9A938A', marginTop: 18, lineHeight: 1.55,
            maxWidth: 360,
          }}>Una sola app para entreno, nutrición, descanso y journal.
            Cero fragmentación, todo cruzado.</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <span style={{
              background: '#F4F1EC', color: '#0A0A0A',
              borderRadius: 999, padding: '11px 22px',
              fontWeight: 600, fontSize: 13,
            }}>Empieza gratis</span>
            <span style={{
              border: '1px solid #3A3A3A', borderRadius: 999,
              padding: '11px 22px', fontWeight: 600, fontSize: 13,
            }}>Ver demo</span>
          </div>
        </div>

        <div style={{
          aspectRatio: '9 / 16', maxHeight: '100%', background: '#141414',
          borderRadius: 28, padding: 18, boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          margin: '0 auto', width: '60%', minHeight: 240,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <svg width="22" height="22" viewBox="0 0 80 80"><Mark color="#F4F1EC" stroke={8} /></svg>
            <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono',
              letterSpacing: '0.18em', color: '#6A645D' }}>WOD</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 36, fontWeight: 700,
              letterSpacing: '-0.02em' }}>21–15<br /><span style={{ fontSize: 18 }}>–9</span></div>
            <div style={{ fontSize: 10, color: '#9A938A', marginTop: 6 }}>
              thruster · pull-up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6 · Apple Watch face ──────────────────────────────────────────
function WatchTile({ Mark, font }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1f1d1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 22, boxSizing: 'border-box',
    }}>
      {/* watch silhouette */}
      <div style={{
        width: 168, height: 200, background: '#0A0A0A',
        borderRadius: 44, border: '4px solid #1a1a1a',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        padding: 16, boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        color: '#F4F1EC', position: 'relative',
      }}>
        {/* top row: time + mark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 700,
            letterSpacing: '-0.02em' }}>9:41</span>
          <svg width="18" height="18" viewBox="0 0 80 80"><Mark color="#F4F1EC" stroke={9} /></svg>
        </div>
        {/* center metric */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <svg width="44" height="44" viewBox="0 0 80 80"><Mark color="#F4F1EC" stroke={6} /></svg>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 700,
            letterSpacing: '-0.02em' }}>87</div>
          <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono',
            letterSpacing: '0.24em', color: '#9A938A' }}>RECOVERY</div>
        </div>
      </div>
    </div>
  );
}

// ─── 7 · Print stationery / business card ──────────────────────────
function StationeryTile({ Mark, font }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#E8DECD',
      padding: 30, boxSizing: 'border-box', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* two cards: dark + light */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
        {/* front (dark) */}
        <div style={{
          width: 200, height: 120, background: '#0A0A0A', color: '#F4F1EC',
          borderRadius: 4, padding: '16px 18px', boxSizing: 'border-box',
          boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <WordmarkWithMark font={font} Mark={Mark} size={20} color="#F4F1EC" />
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8.5,
            letterSpacing: '0.18em', color: '#9A938A', lineHeight: 1.7 }}>
            <div>ELENA CASTILLO</div>
            <div style={{ color: '#6A645D' }}>FUNDADORA · COACH</div>
          </div>
        </div>
        {/* back (light) — big monogram */}
        <div style={{
          width: 200, height: 120, background: '#F4F1EC', color: '#0A0A0A',
          borderRadius: 4, padding: '16px 18px', boxSizing: 'border-box',
          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(-2deg)',
        }}>
          <svg width="60" height="60" viewBox="0 0 80 80"><Mark color="#0A0A0A" stroke={8} /></svg>
        </div>
      </div>
    </div>
  );
}

// ─── 8 · Push notification ─────────────────────────────────────────
function NotificationTile({ Mark, font }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1a1a1c',
      padding: 22, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: 320, background: 'rgba(40,40,44,0.85)',
        backdropFilter: 'blur(20px)', borderRadius: 18, padding: 14,
        display: 'flex', gap: 12, alignItems: 'flex-start',
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      }}>
        <Monogram Mark={Mark} size={38} bg="#0A0A0A" fg="#F4F1EC" radius={0.28} />
        <div style={{ flex: 1, color: '#F4F1EC', fontFamily: '-apple-system, system-ui' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: 0.1 }}>SOMA</span>
            <span style={{ fontSize: 11, color: '#9A938A' }}>ahora</span>
          </div>
          <div style={{ fontSize: 13, color: '#D6D2CB', marginTop: 3,
            lineHeight: 1.4 }}>Tu recovery está en 87. Buen día para entrenar
            fuerza máxima.</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AppIconTile, SplashTile, SignInTile, DashboardTile,
  WebHeroTile, WatchTile, StationeryTile, NotificationTile,
});
