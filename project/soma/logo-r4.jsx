// SOMA — Round 4: logo finalists + applications.
// Three things on one canvas:
//   A · 8 finalist marks isolated
//   B · The "mark replaces the O" wordmark, all 8 variants in one row
//   C · Real product applications using the ACTIVE mark + font (tweakable)

const { DesignCanvas, DCSection, DCArtboard } = window;
const { FINAL_MARKS, F1, F2, F3, F4, F5, F6, F7, F8 } = window;
const {
  Wordmark, WordmarkWithMark, StackedLockup, InlineLockup, Monogram,
  FONT_OPTIONS,
} = window;
const {
  AppIconTile, SplashTile, SignInTile, DashboardTile,
  WebHeroTile, WatchTile, StationeryTile, NotificationTile,
} = window;
const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, useTweaks } = window;

// EDITMODE block — host persists tweaks back to this JSON on disk.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "activeMark": "F4",
  "font": "bricolage"
}/*EDITMODE-END*/;

// ─── Reusable tile chrome ───
function Tile({ children, bg = '#FFFFFF', label, id }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      position: 'relative', overflow: 'hidden',
      fontFamily: 'DM Sans, system-ui, sans-serif',
    }}>
      {id && <div style={{
        position: 'absolute', top: 12, left: 16, zIndex: 2,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.16em', color: '#7A746D',
      }}>{id}</div>}
      {children}
      {label && <div style={{
        position: 'absolute', bottom: 12, left: 16, right: 16, zIndex: 2,
        fontFamily: 'DM Sans', fontSize: 11, color: '#7A746D',
        textAlign: 'center',
      }}>{label}</div>}
    </div>
  );
}

// ─── Section A · isolated marks ───
function MarkCard({ id, name, note, Mark, inverted = false }) {
  const bg = inverted ? '#0A0A0A' : '#FFFFFF';
  const fg = inverted ? '#FFFFFF' : '#0A0A0A';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: fg,
      padding: 20, boxSizing: 'border-box', position: 'relative',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 18,
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.16em', color: inverted ? '#7A746D' : '#7A746D',
      }}>{id}</div>
      <svg width="150" height="150" viewBox="0 0 80 80"><Mark color={fg} stroke={8} /></svg>
      <div style={{
        position: 'absolute', bottom: 14, left: 18, right: 18, textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, fontWeight: 600,
          color: fg, lineHeight: 1.3 }}>{name}</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10.5,
          color: inverted ? '#9A938A' : '#7A746D', marginTop: 2 }}>{note}</div>
      </div>
    </div>
  );
}

// ─── Section B · wordmark "O = mark" for each finalist ───
function WordmarkCard({ id, Mark, font, name, inverted = false }) {
  const bg = inverted ? '#0A0A0A' : '#F7F5F0';
  const fg = inverted ? '#F4F1EC' : '#15120E';
  const sub = inverted ? '#7A746D' : '#998F80';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: fg,
      padding: 22, boxSizing: 'border-box', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: 14, left: 20,
        fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.14em', color: sub,
      }}>{id}</div>
      <WordmarkWithMark font={font} Mark={Mark} size={92} color={fg} />
      <div style={{
        position: 'absolute', bottom: 14, left: 20, right: 20,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.12em', color: sub, textAlign: 'center',
        textTransform: 'uppercase',
      }}>{name}</div>
    </div>
  );
}

// ─── Section C · Lockup variants (using ACTIVE mark) ───
function LockupCard({ label, children, bg = '#F7F5F0' }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      padding: 24, boxSizing: 'border-box', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
      <div style={{
        position: 'absolute', bottom: 14, left: 20, right: 20,
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.14em', color: '#998F80', textAlign: 'center',
        textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ─── App ───
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const activeMarkObj = FINAL_MARKS.find(m => m.id === t.activeMark) || FINAL_MARKS[3];
  const ActiveMark = activeMarkObj.Mark;
  const font = t.font;

  return (
    <>
      <DesignCanvas>
        {/* ─── A · 8 finalist marks ─── */}
        <DCSection id="finalists" title="01 · Los 8 finalistas — refinados"
          subtitle="Cada óvalo está dibujado para reemplazar la O de SOMA (rx 32 · ry 30, mismo grosor de stroke que el wordmark). Tus 8 favoritos del round anterior, ahora limpios y consistentes.">
          {FINAL_MARKS.map(m => (
            <DCArtboard key={m.id} id={`fin-${m.id}`}
              label={`${m.id} · ${m.name}`} width={240} height={260}>
              <MarkCard id={m.id} name={m.name} note={m.note} Mark={m.Mark} />
            </DCArtboard>
          ))}
          {/* Inverted strip — one of each on black, to sanity-check both modes */}
          {FINAL_MARKS.map(m => (
            <DCArtboard key={`${m.id}-inv`} id={`fin-${m.id}-inv`}
              label={`${m.id} · sobre negro`} width={180} height={180}>
              <MarkCard id={m.id} name="" note="" Mark={m.Mark} inverted />
            </DCArtboard>
          ))}
        </DCSection>

        {/* ─── B · 8 wordmarks, mark replaces the O ─── */}
        <DCSection id="wordmark-fusion"
          title="02 · La marca ES la O — los 8 wordmarks fusionados"
          subtitle="Tu idea: no es un isotipo separado, es la O de SOMA. Acá las 8 variaciones probando esa fusión, sobre fondo claro y oscuro. El font es global (controlable en Tweaks).">
          {FINAL_MARKS.map(m => (
            <DCArtboard key={`w-${m.id}`} id={`wm-${m.id}`}
              label={`${m.id} · ${m.name}`} width={380} height={200}>
              <WordmarkCard id={m.id} Mark={m.Mark} font={font} name={m.name} />
            </DCArtboard>
          ))}
          {FINAL_MARKS.map(m => (
            <DCArtboard key={`wi-${m.id}`} id={`wmi-${m.id}`}
              label={`${m.id} · invertido`} width={380} height={200}>
              <WordmarkCard id={m.id} Mark={m.Mark} font={font} name={m.name} inverted />
            </DCArtboard>
          ))}
        </DCSection>

        {/* ─── C · Lockup grammar (uses active mark) ─── */}
        <DCSection id="lockups"
          title={`03 · Lockups — gramática de la marca activa (${activeMarkObj.id})`}
          subtitle="Cómo se comporta el mismo logo en distintos formatos: fusionado, apilado, en línea, y el monograma para tiles. Cambia la marca activa en Tweaks para ver las otras.">
          <DCArtboard id="lck-fusion" label="A · Fusionado · la O es el mark"
            width={520} height={240}>
            <LockupCard label="primario · usar siempre que el ancho lo permita">
              <WordmarkWithMark font={font} Mark={ActiveMark} size={110} color="#15120E" />
            </LockupCard>
          </DCArtboard>

          <DCArtboard id="lck-stacked" label="B · Apilado · mark + wordmark"
            width={300} height={300}>
            <LockupCard label="formatos cuadrados · perfil · stories">
              <StackedLockup font={font} Mark={ActiveMark}
                markSize={110} wordSize={52} color="#15120E" />
            </LockupCard>
          </DCArtboard>

          <DCArtboard id="lck-inline" label="C · En línea · mark + wordmark"
            width={420} height={180}>
            <LockupCard label="header de app · firma de email">
              <InlineLockup font={font} Mark={ActiveMark} size={56} color="#15120E" />
            </LockupCard>
          </DCArtboard>

          <DCArtboard id="lck-mono-dark" label="D · Monograma · tile oscuro"
            width={220} height={220}>
            <LockupCard label="app icon · avatar · favicon">
              <Monogram Mark={ActiveMark} size={140} bg="#0A0A0A" fg="#F4F1EC" radius={0.22} />
            </LockupCard>
          </DCArtboard>

          <DCArtboard id="lck-mono-light" label="E · Monograma · tile claro"
            width={220} height={220}>
            <LockupCard label="watermark · embossing">
              <Monogram Mark={ActiveMark} size={140} bg="#F7F5F0" fg="#15120E" radius={0.22} />
            </LockupCard>
          </DCArtboard>

          <DCArtboard id="lck-only-mark" label="F · Sólo el mark"
            width={220} height={220}>
            <LockupCard label="tab bar activo · loader · favicon mínimo">
              <svg width="120" height="120" viewBox="0 0 80 80">
                <ActiveMark color="#15120E" stroke={8} />
              </svg>
            </LockupCard>
          </DCArtboard>
        </DCSection>

        {/* ─── D · Product applications ─── */}
        <DCSection id="apps"
          title={`04 · Aplicaciones del producto (${activeMarkObj.id} · ${activeMarkObj.name})`}
          subtitle="Cómo se siente el logo en cada superficie real de SOMA. Cambia la marca activa en el panel Tweaks para ver todas las opciones de un vistazo.">

          <DCArtboard id="app-icon" label="iOS · app icon"
            width={280} height={340}>
            <AppIconTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-splash" label="Splash screen"
            width={300} height={650}>
            <SplashTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-signin" label="Sign-in"
            width={300} height={650}>
            <SignInTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-dashboard" label="Dashboard · home"
            width={300} height={650}>
            <DashboardTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-watch" label="Apple Watch · face"
            width={300} height={340}>
            <WatchTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-notification" label="Push notification"
            width={420} height={220}>
            <NotificationTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-web-hero" label="Web · landing hero"
            width={900} height={500}>
            <WebHeroTile Mark={ActiveMark} font={font} />
          </DCArtboard>

          <DCArtboard id="app-stationery" label="Papelería · business card"
            width={520} height={300}>
            <StationeryTile Mark={ActiveMark} font={font} />
          </DCArtboard>
        </DCSection>

        {/* ─── E · The matrix · same icon, all 8 marks ─── */}
        <DCSection id="matrix-icons"
          title="05 · Matriz · app icon de cada finalista, lado a lado"
          subtitle="La comparación que importa: cómo se ve cada finalista cuando es lo único que ves en la home screen. Black on black, monocromo.">
          {FINAL_MARKS.map(m => (
            <DCArtboard key={`mi-${m.id}`} id={`mi-${m.id}`}
              label={`${m.id} · ${m.name}`} width={200} height={240}>
              <AppIconTile Mark={m.Mark} font={font} label={m.id} />
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="matrix-watch"
          title="06 · Matriz · watch face de cada finalista"
          subtitle="A 20px, en una superficie minúscula, ¿cuál sobrevive? Esa es la marca.">
          {FINAL_MARKS.map(m => (
            <DCArtboard key={`mw-${m.id}`} id={`mw-${m.id}`}
              label={`${m.id} · ${m.name}`} width={220} height={280}>
              <WatchTile Mark={m.Mark} font={font} />
            </DCArtboard>
          ))}
        </DCSection>

      </DesignCanvas>

      {/* ─── Tweaks ─── */}
      <TweaksPanel title="Tweaks · logo">
        <TweakSection label="Marca activa">
          <TweakSelect
            label="Finalista"
            value={t.activeMark}
            options={FINAL_MARKS.map(m => ({ value: m.id, label: `${m.id} · ${m.name}` }))}
            onChange={(v) => setTweak('activeMark', v)}
          />
        </TweakSection>
        <TweakSection label="Wordmark">
          <TweakSelect
            label="Font"
            value={t.font}
            options={Object.entries(FONT_OPTIONS).map(([k, v]) => ({ value: k, label: v.label }))}
            onChange={(v) => setTweak('font', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
