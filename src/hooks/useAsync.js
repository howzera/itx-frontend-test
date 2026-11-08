import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async loader and exposes { status, data, error, retry }.
 * `load` must be stable (wrap it in useCallback): when it changes, the data reloads.
 * Late answers from a previous load are ignored (`active` flag), so a fast
 * navigation never shows the data of the previous product.
 */
export function useAsync(load) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null, error: null });
    load().then(
      (data) => active && setState({ status: 'success', data, error: null }),
      (error) => active && setState({ status: 'error', data: null, error }),
    );
    return () => {
      active = false;
    };
  }, [load, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...state, retry };
}
