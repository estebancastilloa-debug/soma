// Keeps SOMA_APP_GUIDE.json in sync on every build (`npm run build`).
// - meta.currentBuild  ← APP_BUILD in src/screens/Profile.jsx
// - meta.lastUpdated   ← today's date
// - meta.detectedDataKeys ← all soma_* keys found in src (flags new ones)
// Never fails the build: any error is logged and ignored.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?)$/.test(name)) out.push(p);
  }
  return out;
}

try {
  const guidePath = join(root, 'SOMA_APP_GUIDE.json');
  const guide = JSON.parse(readFileSync(guidePath, 'utf8'));

  // 1) build number from Profile.jsx
  try {
    const profile = readFileSync(join(root, 'src/screens/Profile.jsx'), 'utf8');
    const m = profile.match(/APP_BUILD\s*=\s*['"]([^'"]+)['"]/);
    if (m) guide.meta.currentBuild = m[1];
  } catch {}

  // 2) date
  guide.meta.lastUpdated = new Date().toISOString().slice(0, 10);

  // 3) detected data keys (flags any new soma_* key not yet documented)
  try {
    const keys = new Set();
    for (const file of walk(join(root, 'src'))) {
      const src = readFileSync(file, 'utf8');
      for (const k of src.match(/soma_[a-z_]+/g) || []) keys.add(k);
    }
    const documented = new Set(Object.keys(guide.dataModel?.localStorage || {}));
    guide.meta.detectedDataKeys = [...keys].sort();
    guide.meta.undocumentedDataKeys = [...keys].filter(k => !documented.has(k) && k !== 'soma_open_logform').sort();
  } catch {}

  writeFileSync(guidePath, JSON.stringify(guide, null, 2) + '\n');
  console.log(`[guide] synced → build ${guide.meta.currentBuild}, ${guide.meta.lastUpdated}`);
} catch (e) {
  console.warn('[guide] skipped:', e.message);
}
