import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ScreenFrame, StatusBar, BackButton, MonoLabel,
} from '../chrome.jsx';
import {
  IconCheck, IconTarget, IconFlame, IconBolt, IconHeart, IconBrain,
  IconActivity,
} from '../icons.jsx';
import { F5, L01 } from '../marks.jsx';

// ─── Progress bar ─────────────────────────────────────────────────────
function ProgressBar({ t, step, total }) {
  return (
    <div style={{ padding: '10px 20px 0', display: 'flex', gap: 5 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < step ? t.accent : t.s2,
          transition: 'background 0.3s ease',
        }}/>
      ))}
    </div>
  );
}

// ─── Option card (supports multi-select) ──────────────────────────────
function OptionCard({ t, label, sub, Icon, selected, onSelect }) {
  return (
    <button onClick={onSelect} style={{
      width: '100%', padding: '13px 14px', borderRadius: 14,
      border: selected ? `2px solid ${t.accent}` : `1.5px solid ${t.border}`,
      background: selected ? `${t.accent}18` : t.surface,
      color: t.fg, cursor: 'pointer', textAlign: 'left',
      marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
      boxSizing: 'border-box', transition: 'all 0.14s ease',
    }}>
      {Icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: selected ? `${t.accent}30` : t.s2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: selected ? t.accent : t.fgMuted,
        }}>
          <Icon size={18} stroke={1.9} color={selected ? t.accent : t.fgMuted}/>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: t.fonts.body, fontWeight: 600, fontSize: 14,
          color: t.fg, letterSpacing: '-0.01em',
        }}>{label}</div>
        {sub && (
          <div style={{ fontFamily: t.fonts.body, fontSize: 11.5, color: t.fgMuted, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      {selected && (
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: t.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <IconCheck size={13} stroke={2.6} color="#0A0908"/>
        </div>
      )}
    </button>
  );
}

// ─── Pill selector ────────────────────────────────────────────────────
function PillGroup({ t, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '8px 16px', borderRadius: 20,
            border: active ? 'none' : `1.5px solid ${t.border}`,
            background: active ? t.accent : 'transparent',
            color: active ? '#0A0908' : t.fgMuted,
            fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.14s ease',
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

// ─── Unit toggle ─────────────────────────────────────────────────────
function UnitToggle({ t, unit, options, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 2, background: t.s2, borderRadius: 8,
      padding: 2, border: `1px solid ${t.border}`,
    }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '4px 10px', borderRadius: 6, border: 'none',
          background: unit === opt ? t.accent : 'transparent',
          color: unit === opt ? '#0A0908' : t.fgMuted,
          fontFamily: t.fonts.mono, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.12s ease',
        }}>{opt}</button>
      ))}
    </div>
  );
}

// ─── Primary CTA button ───────────────────────────────────────────────
function PrimaryBtn({ t, children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', background: disabled ? t.s2 : t.accent,
      color: disabled ? t.fgFaint : '#0A0908',
      border: 'none', borderRadius: 14, padding: '16px 0',
      fontFamily: t.fonts.body, fontWeight: 700, fontSize: 16,
      letterSpacing: '-0.01em',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.14s ease',
    }}>{children}</button>
  );
}

// ─── Step 0: Welcome ─────────────────────────────────────────────────
function Step0({ t, onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px 0', flex: 1 }}>
      <div style={{ marginBottom: 28 }}>
        <svg width={70} height={70} viewBox="0 0 80 80">
          <F5 color={t.accent} stroke={7}/>
        </svg>
      </div>

      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 38,
        letterSpacing: '-0.05em', color: t.fg, textAlign: 'center',
        lineHeight: 1.05, marginBottom: 10,
      }}>Welcome to SOMA</div>

      <div style={{
        fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.22em', color: t.accent, textTransform: 'uppercase', marginBottom: 18,
      }}>Cuerpo · Mente · Tiempo</div>

      <div style={{
        fontFamily: t.fonts.body, fontSize: 15, color: t.fgMuted,
        textAlign: 'center', lineHeight: 1.6, maxWidth: 280, marginBottom: 40,
      }}>
        Your holistic fitness system. 6 quick questions to calibrate it.
      </div>

      <div style={{ width: '100%', marginTop: 'auto', paddingBottom: 20 }}>
        <PrimaryBtn t={t} onClick={onNext}>Start →</PrimaryBtn>
      </div>
    </div>
  );
}

// ─── Step 1: Name + Goals (multi-select) ─────────────────────────────
function Step1({ t, name, setName, goals, toggleGoal, onNext }) {
  const goalOptions = [
    { id: 'muscle',      label: 'Build Muscle',       sub: 'Strength & hypertrophy focus',    Icon: IconFlame  },
    { id: 'fat',         label: 'Lose Fat',            sub: 'Body composition & conditioning', Icon: IconBolt   },
    { id: 'performance', label: 'Improve Performance', sub: 'CrossFit, sport, competition',    Icon: IconTarget },
    { id: 'health',      label: 'General Health',      sub: 'Longevity, balance, wellbeing',   Icon: IconHeart  },
  ];

  return (
    <div style={{ padding: '20px 20px 0', flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 28,
        letterSpacing: '-0.04em', color: t.fg, marginBottom: 6,
      }}>About you</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, marginBottom: 24 }}>
        Let's start with the basics.
      </div>

      <div style={{ marginBottom: 24 }}>
        <MonoLabel t={t}>What's your name?</MonoLabel>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First name"
          style={{
            width: '100%', background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: '13px 14px', color: t.fg,
            fontFamily: t.fonts.body, fontSize: 16, fontWeight: 600,
            outline: 'none', boxSizing: 'border-box', marginTop: 8,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <MonoLabel t={t}>What are your goals? (select all that apply)</MonoLabel>
        <div style={{ marginTop: 10 }}>
          {goalOptions.map(g => (
            <OptionCard
              key={g.id} t={t} label={g.label} sub={g.sub} Icon={g.Icon}
              selected={goals.includes(g.id)}
              onSelect={() => toggleGoal(g.id)}
            />
          ))}
        </div>
      </div>

      <PrimaryBtn t={t} onClick={onNext} disabled={!name.trim() || goals.length === 0}>
        Continue
      </PrimaryBtn>
    </div>
  );
}

// ─── Step 2: Training background ─────────────────────────────────────
function Step2({ t, experience, setExperience, level, setLevel, onNext }) {
  const exps = [
    { id: 'lt6m',     label: '< 6 months',  sub: 'Getting started'          },
    { id: '6to18',    label: '6–18 months', sub: 'Building consistency'     },
    { id: '2to4y',    label: '2–4 years',   sub: 'Intermediate athlete'     },
    { id: '5plus',    label: '5+ years',    sub: 'Experienced competitor'   },
  ];
  const levels = [
    { id: 'scaling',  label: 'Scaling most movements', sub: 'Learning the foundations'  },
    { id: 'somerx',   label: 'Some Rx',                sub: 'Getting stronger daily'    },
    { id: 'mostlyrx', label: 'Mostly Rx',              sub: 'Solid across all domains'  },
    { id: 'compete',  label: 'Competing',              sub: 'Serious sport performance' },
  ];

  return (
    <div style={{ padding: '20px 20px 0', flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 28,
        letterSpacing: '-0.04em', color: t.fg, marginBottom: 6,
      }}>Training background</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, marginBottom: 20 }}>
        Helps calibrate your programming intensity.
      </div>

      <div style={{ marginBottom: 20 }}>
        <MonoLabel t={t}>How long have you been training CrossFit?</MonoLabel>
        <div style={{ marginTop: 10 }}>
          {exps.map(e => (
            <OptionCard key={e.id} t={t} label={e.label} sub={e.sub}
              selected={experience === e.id} onSelect={() => setExperience(e.id)}/>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <MonoLabel t={t}>Current level?</MonoLabel>
        <div style={{ marginTop: 10 }}>
          {levels.map(l => (
            <OptionCard key={l.id} t={t} label={l.label} sub={l.sub}
              selected={level === l.id} onSelect={() => setLevel(l.id)}/>
          ))}
        </div>
      </div>

      <PrimaryBtn t={t} onClick={onNext} disabled={!experience || !level}>Continue</PrimaryBtn>
    </div>
  );
}

// ─── Step 3: Schedule ─────────────────────────────────────────────────
function Step3({ t, days, setDays, timeOfDay, setTimeOfDay, onNext }) {
  return (
    <div style={{ padding: '20px 20px 0', flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 28,
        letterSpacing: '-0.04em', color: t.fg, marginBottom: 6,
      }}>Your schedule</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, marginBottom: 24 }}>
        So SOMA can plan recovery and load.
      </div>

      <div style={{ marginBottom: 28 }}>
        <MonoLabel t={t}>How many days/week?</MonoLabel>
        <div style={{ marginTop: 12 }}>
          <PillGroup t={t} options={['3', '4', '5', '6']} value={days} onChange={setDays}/>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <MonoLabel t={t}>Preferred training time</MonoLabel>
        <div style={{ marginTop: 12 }}>
          <PillGroup t={t} options={['Morning', 'Afternoon', 'Evening']} value={timeOfDay} onChange={setTimeOfDay}/>
        </div>
      </div>

      <PrimaryBtn t={t} onClick={onNext} disabled={!days || !timeOfDay}>Continue</PrimaryBtn>
    </div>
  );
}

// ─── Step 4: Health baselines (with unit toggles) ─────────────────────
function Step4({ t, weight, setWeight, height, setHeight, hrRest, setHrRest,
                 weightUnit, setWeightUnit, heightUnit, setHeightUnit, onNext }) {
  const numInput = (placeholder, value, onChange) => (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type="number"
      inputMode="numeric"
      style={{
        width: '100%', background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 12, padding: '13px 14px', color: t.fg,
        fontFamily: t.fonts.mono, fontSize: 24, fontWeight: 700,
        letterSpacing: '-0.03em', outline: 'none', boxSizing: 'border-box',
        textAlign: 'center', marginTop: 8,
      }}
    />
  );

  return (
    <div style={{ padding: '20px 20px 0', flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 28,
        letterSpacing: '-0.04em', color: t.fg, marginBottom: 6,
      }}>Health baselines</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 13, color: t.fgMuted, marginBottom: 24 }}>
        Used to calibrate nutrition and recovery targets.
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MonoLabel t={t}>Body weight</MonoLabel>
          <UnitToggle t={t} unit={weightUnit} options={['kg', 'lbs']} onChange={val => { setWeightUnit(val); setWeight(''); }}/>
        </div>
        {numInput(weightUnit === 'kg' ? '75' : '165', weight, setWeight)}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MonoLabel t={t}>Height</MonoLabel>
          <UnitToggle t={t} unit={heightUnit} options={['cm', 'in']} onChange={val => { setHeightUnit(val); setHeight(''); }}/>
        </div>
        {numInput(heightUnit === 'cm' ? '175' : '69', height, setHeight)}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <MonoLabel t={t}>Resting heart rate (bpm)</MonoLabel>
          <span style={{
            fontFamily: t.fonts.mono, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', color: t.fgFaint, textTransform: 'uppercase',
          }}>optional</span>
        </div>
        {numInput('60', hrRest, setHrRest)}
      </div>

      <PrimaryBtn t={t} onClick={onNext} disabled={!weight || !height}>Continue</PrimaryBtn>
    </div>
  );
}

// ─── Step 5: Done ─────────────────────────────────────────────────────
function Step5({ t, name, saving, saveError, onEnter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px 0', flex: 1 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: `${t.accent}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
      }}>
        <svg width={52} height={52} viewBox="0 0 80 80">
          <L01 color={t.accent} stroke={7}/>
        </svg>
      </div>

      <div style={{
        fontFamily: t.fonts.mono, fontSize: 9.5, fontWeight: 700,
        letterSpacing: '0.22em', color: t.accent, textTransform: 'uppercase', marginBottom: 8,
      }}>Level 1</div>

      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 30,
        letterSpacing: '-0.04em', color: t.fg, textAlign: 'center', lineHeight: 1.1, marginBottom: 4,
      }}>{name ? name + ',' : ''}</div>

      <div style={{
        fontFamily: t.fonts.display, fontWeight: 800, fontSize: 24,
        letterSpacing: '-0.04em', color: t.accent, textAlign: 'center', marginBottom: 24,
      }}>You're The Spark</div>

      <div style={{ width: '100%', maxWidth: 300, marginBottom: 36 }}>
        {[
          { Icon: IconActivity, text: 'SOMA will build a weekly plan tuned to your schedule and level.' },
          { Icon: IconTarget,   text: 'We\'ll track your PRs, WODs, and recovery in one place.'         },
          { Icon: IconBrain,    text: 'Your score evolves as your body and mind grow — 12 levels ahead.' },
        ].map(({ Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: `${t.accent}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <Icon size={15} stroke={1.9} color={t.accent}/>
            </div>
            <div style={{ fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted, lineHeight: 1.5, flex: 1 }}>
              {text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', marginTop: 'auto', paddingBottom: 30 }}>
        {saveError && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 12,
            background: 'rgba(255,69,58,0.12)', border: '1px solid rgba(255,69,58,0.3)',
            fontFamily: t.fonts.body, fontSize: 13, color: '#ff453a',
          }}>{saveError}</div>
        )}
        <PrimaryBtn t={t} onClick={onEnter} disabled={saving}>
          {saving ? 'Guardando...' : 'Entrar a SOMA →'}
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── OnboardingScreen ─────────────────────────────────────────────────
export function OnboardingScreen({ t, onNav, onMenu, onPlus }) {
  const { saveProfile } = useAuth();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName]   = useState('');
  const [goals, setGoals] = useState([]);  // multi-select array

  // Step 2
  const [experience, setExperience] = useState('');
  const [level, setLevel]           = useState('');

  // Step 3
  const [days, setDays]           = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Step 4
  const [weight, setWeight]         = useState('');
  const [height, setHeight]         = useState('');
  const [hrRest, setHrRest]         = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');

  // Step 5
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState(null);

  const totalSteps = 6;
  const next = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  function toggleGoal(id) {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  }

  async function handleEnter() {
    setSaving(true);
    setSaveError(null);

    try {
      const wKg = weight
        ? (weightUnit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight))
        : null;
      const hCm = height
        ? (heightUnit === 'in' ? parseFloat(height) * 2.54 : parseFloat(height))
        : null;

      const { error } = await saveProfile({
        name,
        weight_kg:    wKg ? parseFloat(wKg.toFixed(1)) : null,
        height_cm:    hCm ? parseFloat(hCm.toFixed(0)) : null,
        goal:         goals.join(','),
        experience,
        days_per_week: days ? parseInt(days) : null,
        time_of_day:  timeOfDay,
        rhr:          hrRest ? parseInt(hrRest) : null,
        onboarded:    true,
      });

      if (error) {
        const detail = [error.message, error.hint, error.details, error.code]
          .filter(Boolean).join(' | ');
        setSaveError(detail || `Error desconocido: ${JSON.stringify(error)}`);
        setSaving(false);
      }
    } catch (err) {
      setSaveError(`Excepción: ${err.message}`);
      setSaving(false);
    }
  }

  return (
    <ScreenFrame t={t} accentColor={t.accent}>
      <StatusBar t={t}/>

      {step > 0 && <ProgressBar t={t} step={step} total={totalSteps}/>}

      {step > 0 && step < 5 && (
        <div style={{ padding: '8px 14px 0' }}>
          <BackButton t={t} onBack={back}/>
        </div>
      )}

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: step === 0 ? 'calc(100% - 28px)' : 'calc(100% - 80px)',
        overflow: 'hidden',
      }}>
        {step === 0 && <Step0 t={t} onNext={next}/>}

        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Step1
              t={t}
              name={name} setName={setName}
              goals={goals} toggleGoal={toggleGoal}
              onNext={next}
            />
          </div>
        )}

        {step === 2 && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Step2
              t={t}
              experience={experience} setExperience={setExperience}
              level={level} setLevel={setLevel}
              onNext={next}
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Step3
              t={t}
              days={days} setDays={setDays}
              timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay}
              onNext={next}
            />
          </div>
        )}

        {step === 4 && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Step4
              t={t}
              weight={weight} setWeight={setWeight}
              height={height} setHeight={setHeight}
              hrRest={hrRest} setHrRest={setHrRest}
              weightUnit={weightUnit} setWeightUnit={setWeightUnit}
              heightUnit={heightUnit} setHeightUnit={setHeightUnit}
              onNext={next}
            />
          </div>
        )}

        {step === 5 && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Step5
              t={t}
              name={name}
              saving={saving}
              saveError={saveError}
              onEnter={handleEnter}
            />
          </div>
        )}
      </div>
    </ScreenFrame>
  );
}

export default OnboardingScreen;
