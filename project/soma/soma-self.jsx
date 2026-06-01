// SOMA — Self / Inner Map data.
// Four frameworks that help the user answer:
//   "What I am · How I should be · Why I'm different · What that means"
//
//  1. Biotypes (Rodrigo García Platas humoral model)
//  2. Childhood Wounds (5 core)
//  3. Polarity (masculine / feminine — operational, not gendered)
//  4. ADHD / Dopamine profile
//
// Each framework has: definition, the user's inferred type (mock for now),
// signs, shadow, and personalized intervention.

// ──────────── 1 · BIOTYPES ────────────────────────────────────────
const BIOTYPES = [
  {
    id: 'choleric', lab: 'Choleric', es: 'Colérico',
    nature: 'Dry · Hot', element: 'Fire',
    drive: 'Strategy, rules, power',
    signs: ['Quick to anger', 'Hangry outbursts', 'Direct, impatient',
      'Goal-obsessed', 'Hates inefficiency'],
    shadow: 'Tyranny — leadership without empathy.',
    intervention: 'Practice compassionate leadership. Pause 3s before reacting. Lead by example, not decree.',
    appAction: 'When you log rapid anger, SOMA prompts: "Was that reaction yours, or did the situation own you?"',
  },
  {
    id: 'sanguine', lab: 'Sanguine', es: 'Sanguíneo',
    nature: 'Wet · Hot', element: 'Air',
    drive: 'Charisma, pleasure, connection',
    signs: ['Highly social', 'Pleasure-seeking', 'Easy to charm',
      'Impulsive', 'Loves novelty'],
    shadow: 'Identity drain — performing for external validation.',
    intervention: 'Ask: am I draining myself to be liked? Schedule pure solo time. Decline 1 invitation/week.',
    appAction: 'After impulsive social logs, SOMA asks: "Did this drain you or fill you?"',
  },
  {
    id: 'melancholic', lab: 'Melancholic', es: 'Melancólico',
    nature: 'Dry · Cold', element: 'Earth',
    drive: 'Depth, analysis, individual mastery',
    signs: ['Deeply intellectual', 'Prefers solitude', 'Perfectionist',
      'Slow to commit', 'High standards'],
    shadow: 'Isolation — using thought as armor.',
    intervention: 'Reach out once daily. Frame emotional friction as a logic puzzle to engage instead of avoid.',
    appAction: 'SOMA frames mental-health prompts as analytical, never emotional-heavy.',
  },
  {
    id: 'phlegmatic', lab: 'Phlegmatic', es: 'Flemático',
    nature: 'Wet · Cold', element: 'Water',
    drive: 'Empathy, harmony, service',
    signs: ['Ultimate caretaker', 'Decisions from feeling', 'Avoids conflict',
      'Loyal beyond reason', 'Carries others\' weight'],
    shadow: 'Self-erasure — exhausted by caring.',
    intervention: 'Set ONE firm boundary today. Check: am I exhausting myself for someone else?',
    appAction: 'SOMA adopts a soft, containing tone. Repeatedly prompts boundary checks.',
  },
];

// ──────────── 2 · CHILDHOOD WOUNDS ────────────────────────────────
const WOUNDS = [
  {
    id: 'rejection', lab: 'Rejection',
    pattern: 'Hyper-independence. Disappearing when you most need help.',
    triggers: ['Asking for help feels shameful',
      'Solo retreat when overwhelmed',
      'Distance from people who care'],
    mask: 'The Fleeing one — small, invisible, untouchable.',
    prompt: 'When did you learn that expressing your needs was a burden?',
    intervention: 'Ask for help once today. Stay in the room when uncomfortable.',
  },
  {
    id: 'abandonment', lab: 'Abandonment',
    pattern: 'Clinging or pre-emptive withdrawal. Anxiety about people leaving.',
    triggers: ['Anxious when partner is distant',
      'Over-give to keep people close',
      'Test relationships repeatedly'],
    mask: 'The Dependent — fused, fearful of solitude.',
    prompt: 'Who in your past left when you needed them?',
    intervention: 'Sit with aloneness for 10 min without phone. Notice the wave passes.',
  },
  {
    id: 'humiliation', lab: 'Humiliation',
    pattern: 'Body shame, over-giving, prone to self-deprecation.',
    triggers: ['Discomfort being seen', 'Over-eating in private',
      'Diminishing yourself out loud'],
    mask: 'The Masochist — carries others to justify space.',
    prompt: 'When did you learn your needs were "too much"?',
    intervention: 'State one need clearly. Take up physical space — square shoulders, open chest.',
  },
  {
    id: 'betrayal', lab: 'Betrayal',
    pattern: 'Control, hyper-vigilance, distrust of authority.',
    triggers: ['Need to be in charge', 'Suspicion of strangers\' motives',
      'Cynicism about institutions'],
    mask: 'The Controlling — strong on the outside, locked inside.',
    prompt: 'Whose broken promise still lives in your body?',
    intervention: 'Delegate one task fully today. Don\'t check in. Practice trust as muscle.',
  },
  {
    id: 'injustice', lab: 'Injustice',
    pattern: 'Rigidity, perfectionism, harsh self-criticism.',
    triggers: ['Outraged by unfairness', 'Cold to your own mistakes',
      'Body holds tension in shoulders/jaw'],
    mask: 'The Rigid — coldness disguised as righteousness.',
    prompt: 'Where do you still demand perfection from yourself?',
    intervention: 'Forgive one of your past mistakes. Out loud. Today.',
  },
];

// ──────────── 3 · POLARITY ────────────────────────────────────────
const POLARITY = {
  masculine: {
    lab: 'Masculine',
    drive: 'Status, logic, problem-solving, competition',
    signs: ['Task-execution mode', 'Heavy training', 'Strategic thinking',
      'Cold, focused, directional'],
    risk: 'When stuck here all day, emotional connection feels impossible. Partner conflict spikes.',
    reset: 'Alpha-state recovery: stare at clouds, walk in nature, sit still. No phone.',
  },
  feminine: {
    lab: 'Feminine',
    drive: 'Connection, containment, flow, beauty',
    signs: ['Open, receptive', 'Tuned to others\' states', 'Non-linear thinking',
      'Warm, holding, present'],
    risk: 'When stuck here all day, decisions feel impossible. Direction collapses into care-taking.',
    reset: 'Take one concrete action. Set one firm priority. Decline one ask.',
  },
};

// ──────────── 4 · ADHD / DOPAMINE PROFILE ─────────────────────────
const ADHD_PROFILE = {
  lab: 'Dopamine-Variable',
  description: 'Your attention is not broken — it\'s context-dependent. Tasks with novelty or reward pull effortlessly; routine work requires friction-removal tactics.',
  pulls: ['Novelty', 'Stakes', 'Time pressure', 'Music in the right key',
    'Movement before thinking'],
  drains: ['Open-ended tasks', 'Boring meetings', 'Long sit', 'No external accountability'],
  protocols: [
    'Voice-to-text brain dumps — bypass the writing friction',
    'Body before brain — 5 min movement before deep work',
    'External accountability — share one daily intent publicly',
    '"What was your brain magnetically drawn to today?" instead of "What did you do?"',
    'Friction removal: phone in another room, laptop in one app, no tabs',
  ],
};

Object.assign(window, { BIOTYPES, WOUNDS, POLARITY, ADHD_PROFILE });
