import { useEffect } from 'react';
export function usePageMotion(root, page) {
  useEffect(() => {
    let cancelled = false;
    let dispose;
    const load = () =>
      import('./motion.js')
        .then(({ startMotion }) => {
          if (!cancelled) dispose = startMotion(root, page);
        })
        .catch(() => {
          /* Content stays visible if the optional motion chunk cannot load. */
        });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2000 })
      : window.setTimeout(load, 500);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      dispose?.();
    };
  }, [root, page]);
}
