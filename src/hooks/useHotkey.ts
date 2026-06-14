import { useEffect } from 'react';

/**
 * Registers a global keyboard shortcut. Use "mod" for Cmd (macOS) / Ctrl (others).
 * Example: useHotkey('mod+k', () => openPalette()).
 */
export function useHotkey(combo: string, handler: (e: KeyboardEvent) => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split('+');
    const key = parts[parts.length - 1];
    const needMod = parts.includes('mod');
    const needShift = parts.includes('shift');
    const needAlt = parts.includes('alt');

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (needMod && !mod) return;
      if (!needMod && mod) return;
      if (needShift !== e.shiftKey) return;
      if (needAlt !== e.altKey) return;
      if (e.key.toLowerCase() !== key) return;
      handler(e);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [combo, handler, enabled]);
}
