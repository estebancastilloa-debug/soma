import { useEffect, useRef } from 'react';

// Simple LIFO stack of "close" handlers so the Android back gesture/button
// (and a swipe-down on sheets) can dismiss the topmost overlay.
const stack = [];

export function pushBack(fn) {
  stack.push(fn);
  return () => {
    const i = stack.indexOf(fn);
    if (i >= 0) stack.splice(i, 1);
  };
}

// Returns true if an overlay was closed
export function popBack() {
  const fn = stack.pop();
  if (fn) { try { fn(); } catch {} return true; }
  return false;
}

export function hasBack() {
  return stack.length > 0;
}

// Register an overlay's onClose while it is open
export function useBackClose(open, onClose) {
  const ref = useRef(onClose);
  ref.current = onClose;
  useEffect(() => {
    if (!open) return;
    const fn = () => ref.current && ref.current();
    return pushBack(fn);
  }, [open]);
}
