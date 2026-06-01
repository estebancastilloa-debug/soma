export const HABITS = [
  // BODY
  { id:'mobility', cat:'body', lab:'Daily mobility',     sub:'10 min · long-hold stretches', icon:'balance',  why:'Joint centration and tissue capacity prevent injury and unlock harder training.', examples:['Couch stretch 2 min/side','Pigeon hold 90s/side','Wall ankle dorsiflexion','Thoracic foam roll','Lat hang 60s'] },
  { id:'cold',     cat:'body', lab:'Cold plunge',        sub:'Morning · norepinephrine spike', icon:'water',  why:'Spikes dopamine and norepinephrine, builds stress tolerance.', examples:['Cold shower 3 min','Plunge 14°C · 2 min','Cold lake swim'] },
  { id:'sauna',    cat:'body', lab:'Sauna',              sub:'Heat shock proteins · recovery', icon:'flame',  why:'Heat shock proteins · cardiovascular adaptation · recovery.', examples:['20 min @ 80°C','Sauna-cold-sauna contrast','Steam room 15 min'] },
  { id:'grip',     cat:'body', lab:'Grip strength check',sub:'CNS readiness gauge',  icon:'dumbbell',  why:'A >5% drop from your best score = CNS fatigued. Tells you to back off.', examples:['Dynamometer 3 reps both hands','Plate pinch 30s timed','Dead hang max time'] },
  { id:'walk',     cat:'body', lab:'Outdoor walk',       sub:'Zone 2 · sunlight',   icon:'sun',       why:'Zone 2 cardio + sunlight + decompression all in one.', examples:['45-min walk after lunch','Morning walk before phone','Walking call'] },
  // MIND
  { id:'callus',   cat:'mind', lab:'Callus the mind',    sub:'One uncomfortable task', icon:'flame', why:'Inoculate against future trauma by voluntarily seeking discomfort.', norepeat:true, examples:['Cold shower 3+ min','Hard conversation you postponed','5 min stillness · no phone','A 16h+ fast','A workout in your hated modality'] },
  { id:'stoic',    cat:'mind', lab:'Dichotomy of control',sub:'Stoic reflection',   icon:'balance', why:"Separate what you control from what you don't. Shift locus from victim to agent.", examples:["Name one thing you tried to control today that wasn't yours",'Name one thing you control and acted on'] },
  { id:'meditate', cat:'mind', lab:'Meditation',         sub:'10 min · still mind', icon:'recovery',why:'Builds the pause between stimulus and response. Reduces cortisol.', examples:['10 min breath focus','Body scan 15 min','Loving-kindness meditation'] },
  { id:'journal',  cat:'mind', lab:'Journal',            sub:'5 min · uncensored',  icon:'heart',   why:'Externalizes thought loops. Builds metacognition over time.', examples:['Morning pages 750 words','Gratitude 3 things','Stoic reflection','Polarity mapping'] },
  { id:'breath',   cat:'mind', lab:'Breathwork',         sub:'Box breathing · physiological sigh', icon:'recovery', why:'Down-regulates the nervous system in minutes.', examples:['Box breathing 4-4-4-4 × 10','Physiological sigh 5 reps','4-7-8 breathing before bed'] },
  // FUEL
  { id:'hydrate',  cat:'fuel', lab:'Hydrate goal',       sub:'8 glasses · morning first', icon:'water', why:'Even 2% dehydration impairs performance by 10–20%.', examples:['32oz on waking','Electrolytes post-workout','Track in app'] },
  { id:'protgoal', cat:'fuel', lab:'Hit protein goal',   sub:'0.8g/lb body weight',  icon:'protein',why:'The most impactful nutritional lever for body composition.', examples:['Greek yogurt + whey smoothie','Chicken + rice + eggs','Protein-first at each meal'] },
  { id:'creatine', cat:'fuel', lab:'Take creatine',      sub:'5g daily · any time',  icon:'bolt',   why:'The most evidence-backed supplement for strength + cognition.', examples:['5g in morning coffee','5g post-workout shake'] },
  // SOCIAL
  { id:'connect',  cat:'social',lab:'Deep connection',   sub:'30 min · screen-free', icon:'heart',  why:'Loneliness is as damaging as smoking 15 cigarettes a day.', examples:['Dinner with family · no phones','1:1 walk with a friend','Call someone you miss'] },
  { id:'gratitude',cat:'social',lab:'Express gratitude', sub:'Tell someone',         icon:'heart',  why:'Gratitude practice rewires the brain toward positive valence over time.', examples:['Text a genuine thank-you','Tell a family member why they matter','Write 3 things + who contributed'] },
];

export const HABIT_CATS = [
  { id:'body',   lab:'Body',   color:'train' },
  { id:'mind',   lab:'Mind',   color:'records' },
  { id:'fuel',   lab:'Fuel',   color:'eat' },
  { id:'social', lab:'Social', color:'journal' },
];

export const PROMPTS = [
  { cat:'Stoic',     text:'What happened today that was outside your control? How did you respond vs. how could you have responded?' },
  { cat:'Gratitude', text:'Name three things that went well today. What role did you play in each?' },
  { cat:'Body',      text:'How did your body feel during training today? What would you change about yesterday to feel better right now?' },
  { cat:'Somatic',   text:'Where are you holding tension in your body right now? What emotion might that tension be carrying?' },
  { cat:'Polarity',  text:'What masculine energy showed up in your life today? Where did you need more structure and direction?' },
  { cat:'Mindset',   text:"What's one belief you hold about yourself that might be limiting your performance?" },
  { cat:'Recovery',  text:'Rate your sleep quality 1-10. What was the last thing you thought about before falling asleep?' },
  { cat:'Nutrition', text:'How did your food choices today reflect your goals? Where did you succeed — where did you compromise?' },
];
