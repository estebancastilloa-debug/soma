import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusBar, PillarHeader, MonoLabel, ScreenFrame, Fab } from '../chrome.jsx';
import { IconPlus, IconCheck } from '../icons.jsx';
import { F5 } from '../marks.jsx';

const STORAGE_KEY = 'soma_supplements_list';

function loadList() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function SupplementsScreen({ t, onNav, onMenu, onPlus }) {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const [supps, setSupps]       = useState(loadList);
  const [taken, setTaken]       = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [adding, setAdding]     = useState(false);

  // New supplement form state
  const [newName, setNewName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newTime, setNewTime] = useState('Mañana');
  const [newCat,  setNewCat]  = useState('Salud');

  useEffect(() => {
    if (!user) return;
    supabase.from('supplements_log')
      .select('supplement_ids')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.supplement_ids?.length) setTaken(data.supplement_ids);
      });
  }, [user]);

  async function toggleTaken(id) {
    const next = taken.includes(id) ? taken.filter(x => x !== id) : [...taken, id];
    setTaken(next);
    if (!user) return;
    await supabase.from('supplements_log').upsert(
      { user_id: user.id, date: today, supplement_ids: next },
      { onConflict: 'user_id,date' }
    );
  }

  function addSupplement() {
    if (!newName.trim()) return;
    const supp = {
      id:   Date.now().toString(),
      name: newName.trim(),
      dose: newDose.trim() || '',
      time: newTime,
      cat:  newCat,
    };
    const next = [...supps, supp];
    setSupps(next);
    saveList(next);
    setNewName(''); setNewDose(''); setNewTime('Mañana'); setNewCat('Salud');
    setAdding(false);
  }

  function deleteSupp(id) {
    const next = supps.filter(s => s.id !== id);
    setSupps(next);
    saveList(next);
    setTaken(t => t.filter(x => x !== id));
  }

  const progress = supps.length ? taken.length / supps.length : 0;

  return (
    <ScreenFrame t={t} accentColor={t.secondary}>
      <StatusBar t={t}/>
      <PillarHeader t={t} title="Suplementos"
        sub={`Protocolo · ${supps.length} items`}
        pillarColor={t.secondary} onMenu={onMenu}/>

      <div style={{ height: 'calc(100% - 56px)', overflow: 'auto', paddingBottom: 100 }}>

        {/* Daily progress hero */}
        <div style={{
          margin: '14px 20px 0', padding: '16px 18px', background: t.secondary,
          color: '#0A0908', borderRadius: 18, position: 'relative', overflow: 'hidden',
        }}>
          <MonoLabel t={t} color="#0A090888">hoy</MonoLabel>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 48,
              letterSpacing: '-0.04em', lineHeight: 0.9,
            }}>{taken.length}</span>
            <span style={{ fontFamily: t.fonts.body, fontSize: 16, opacity: 0.6 }}>
              /{supps.length} tomados
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#0A090820', marginTop: 12 }}>
            <div style={{
              width: (progress * 100) + '%', height: '100%',
              background: '#0A0908', borderRadius: 3, opacity: 0.6,
              transition: 'width 0.3s',
            }}/>
          </div>
          <svg width="100" height="100" viewBox="0 0 80 80"
            style={{ position: 'absolute', right: -10, top: -10, opacity: 0.12 }}>
            <F5 color="#0A0908" stroke={4}/>
          </svg>
        </div>

        {/* Empty state */}
        {supps.length === 0 && (
          <div style={{ margin: '40px 20px', textAlign: 'center' }}>
            <div style={{
              fontFamily: t.fonts.body, fontSize: 15, fontWeight: 600,
              color: t.fg, marginBottom: 8,
            }}>Sin suplementos todavía</div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, lineHeight: 1.5 }}>
              Agrega los suplementos que tomas y marca cuáles tomaste hoy.
            </div>
          </div>
        )}

        {/* Supplement list */}
        {supps.map(s => {
          const isTaken   = taken.includes(s.id);
          const isExpanded = expanded === s.id;
          return (
            <div key={s.id} style={{
              margin: '8px 20px 0', background: t.surface,
              borderRadius: 16, border: '1px solid ' + t.divider, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => toggleTaken(s.id)} style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0, border: 'none',
                  cursor: 'pointer',
                  background: isTaken ? t.semantic?.ok || '#34c759' : t.s2,
                  color: isTaken ? '#0A0908' : t.fgMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isTaken
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <polyline points="4,12 10,18 20,6"/>
                      </svg>
                    : <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid currentColor' }}/>
                  }
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14, color: t.fg,
                    textDecoration: isTaken ? 'line-through' : 'none',
                    opacity: isTaken ? 0.5 : 1,
                  }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                    {s.dose && <span style={{
                      fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
                      letterSpacing: '0.12em', color: t.accent, textTransform: 'uppercase',
                    }}>{s.dose}</span>}
                    {s.dose && <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgFaint }}>·</span>}
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 9.5, color: t.fgMuted }}>{s.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{
                    fontFamily: t.fonts.mono, fontSize: 8.5, fontWeight: 700,
                    letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase',
                  }}>{s.cat}</span>
                  <button onClick={() => deleteSupp(s.id)} style={{
                    border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                    fontFamily: t.fonts.mono, fontSize: 9, color: t.fgFaint, textDecoration: 'underline',
                  }}>eliminar</button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add supplement button */}
        <button onClick={() => setAdding(true)} style={{
          margin: '10px 20px 0', width: 'calc(100% - 40px)',
          padding: '13px', borderRadius: 14, cursor: 'pointer',
          border: '1px dashed ' + t.divider, background: 'transparent', color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <IconPlus size={16} stroke={2}/>
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>Agregar suplemento</span>
        </button>

      </div>

      {/* Add supplement sheet */}
      {adding && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 80,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: t.bg,
            borderRadius: '24px 24px 0 0',
            padding: '24px 20px calc(24px + env(safe-area-inset-bottom))',
            boxSizing: 'border-box',
          }}>
            <div style={{
              fontFamily: t.fonts.display, fontWeight: 800, fontSize: 22,
              letterSpacing: '-0.03em', color: t.fg, marginBottom: 20,
            }}>Nuevo suplemento</div>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <MonoLabel t={t}>Nombre</MonoLabel>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="Creatina monohidrato"
                style={{
                  width: '100%', marginTop: 8, padding: '12px 14px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.surface, color: t.fg,
                  fontFamily: t.fonts.body, fontSize: 15, outline: 'none', boxSizing: 'border-box',
                }}/>
            </div>

            {/* Dose */}
            <div style={{ marginBottom: 14 }}>
              <MonoLabel t={t}>Dosis (opcional)</MonoLabel>
              <input value={newDose} onChange={e => setNewDose(e.target.value)}
                placeholder="5g"
                style={{
                  width: '100%', marginTop: 8, padding: '12px 14px', borderRadius: 12,
                  border: `1px solid ${t.border}`, background: t.surface, color: t.fg,
                  fontFamily: t.fonts.body, fontSize: 15, outline: 'none', boxSizing: 'border-box',
                }}/>
            </div>

            {/* Time */}
            <div style={{ marginBottom: 14 }}>
              <MonoLabel t={t}>Momento</MonoLabel>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {['Mañana', 'Con comida', 'Pre-entreno', 'Post-entreno', 'Noche'].map(opt => (
                  <button key={opt} onClick={() => setNewTime(opt)} style={{
                    padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: newTime === opt ? t.accent : t.s2,
                    color: newTime === opt ? '#0A0908' : t.fgMuted,
                    fontFamily: t.fonts.body, fontSize: 13, fontWeight: 600,
                  }}>{opt}</button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <MonoLabel t={t}>Categoría</MonoLabel>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {['Salud', 'Rendimiento', 'Recuperación', 'Sueño', 'Cognitivo'].map(opt => (
                  <button key={opt} onClick={() => setNewCat(opt)} style={{
                    padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: newCat === opt ? t.accent : t.s2,
                    color: newCat === opt ? '#0A0908' : t.fgMuted,
                    fontFamily: t.fonts.body, fontSize: 13, fontWeight: 600,
                  }}>{opt}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
              <button onClick={() => setAdding(false)} style={{
                padding: '14px', borderRadius: 14,
                border: `1px solid ${t.border}`, background: 'transparent', color: t.fg,
                fontFamily: t.fonts.body, fontWeight: 600, cursor: 'pointer', fontSize: 15,
              }}>Cancelar</button>
              <button onClick={addSupplement} disabled={!newName.trim()} style={{
                padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: newName.trim() ? t.accent : t.s2,
                color: newName.trim() ? '#0A0908' : t.fgFaint,
                fontFamily: t.fonts.body, fontWeight: 700, fontSize: 15,
              }}>Agregar</button>
            </div>
          </div>
        </div>
      )}

      <Fab t={t} onClick={onPlus}/>
    </ScreenFrame>
  );
}
