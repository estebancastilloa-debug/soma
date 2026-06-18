// Lightweight markdown renderer for NotebookLM responses.
// Supports: # / ## / ### headings, - / * / numbered bullets, **bold**, blank lines.

function renderInline(text, t, keyBase) {
  // split on **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={`${keyBase}-${i}`} style={{ color: t.fg, fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    }
    return <span key={`${keyBase}-${i}`}>{p}</span>;
  });
}

export function Markdown({ t, text }) {
  if (!text) return null;
  const lines = String(text).replace(/\r/g, '').split('\n');
  const out = [];
  let bullets = null;

  const flushBullets = (key) => {
    if (bullets) {
      out.push(
        <ul key={`ul-${key}`} style={{ margin: '4px 0 10px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted, lineHeight: 1.55 }}>
              {renderInline(b, t, `b${key}-${i}`)}
            </li>
          ))}
        </ul>
      );
      bullets = null;
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) { flushBullets(idx); return; }

    const bulletMatch = line.match(/^(?:[-*•]\s+|\d+\.\s+)(.*)$/);
    if (bulletMatch) {
      if (!bullets) bullets = [];
      bullets.push(bulletMatch[1]);
      return;
    }
    flushBullets(idx);

    if (line.startsWith('### ')) {
      out.push(<div key={idx} style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 13.5, color: t.fg, margin: '10px 0 4px' }}>{renderInline(line.slice(4), t, idx)}</div>);
    } else if (line.startsWith('## ')) {
      out.push(<div key={idx} style={{ fontFamily: t.fonts.display, fontWeight: 700, fontSize: 16, color: t.fg, margin: '12px 0 5px' }}>{renderInline(line.slice(3), t, idx)}</div>);
    } else if (line.startsWith('# ')) {
      out.push(<div key={idx} style={{ fontFamily: t.fonts.display, fontWeight: 800, fontSize: 19, color: t.fg, margin: '12px 0 6px', letterSpacing: '-0.02em' }}>{renderInline(line.slice(2), t, idx)}</div>);
    } else {
      out.push(<p key={idx} style={{ fontFamily: t.fonts.body, fontSize: 13.5, color: t.fgMuted, lineHeight: 1.6, margin: '0 0 8px' }}>{renderInline(line, t, idx)}</p>);
    }
  });
  flushBullets('end');

  return <div>{out}</div>;
}
