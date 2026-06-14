import { type RefObject, useEffect } from 'react';

/** Calls `handler` when a pointer-down occurs outside every provided ref. */
export function useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (list.some((r) => r.current?.contains(target))) return;
      handler();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [refs, handler, enabled]);
}
