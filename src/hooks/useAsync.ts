import { type DependencyList, useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncResult<T> extends AsyncState<T> {
  /** Whether a successful response returned an empty collection. */
  isEmpty: boolean;
  refetch: () => void;
}

function defaultIsEmpty(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === 'object' && 'items' in data) {
    return Array.isArray((data as { items: unknown[] }).items) && (data as { items: unknown[] }).items.length === 0;
  }
  return false;
}

/**
 * Runs an async factory on mount and whenever `deps` change.
 * Tracks loading/error, exposes `refetch`, and guards against stale responses.
 */
export function useAsync<T>(
  factory: () => Promise<T>,
  deps: DependencyList,
  options?: { isEmpty?: (data: T) => boolean },
): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const reqId = useRef(0);
  const isEmptyFn = options?.isEmpty ?? defaultIsEmpty;

  // factory identity is intentionally excluded — callers pass inline closures.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(factory, deps);

  useEffect(() => {
    const id = ++reqId.current;
    setState((s) => ({ data: s.data, loading: true, error: null }));
    run()
      .then((data) => {
        if (id === reqId.current) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (id === reqId.current) {
          setState({ data: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) });
        }
      });
    return () => {
      // Invalidate in-flight request on unmount / dep change.
      reqId.current++;
    };
  }, [run, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return {
    ...state,
    isEmpty: !state.loading && !state.error && state.data != null && isEmptyFn(state.data),
    refetch,
  };
}
