import { useEffect } from 'react';
export function usePageMotion(root, page) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    let dispose;
    const events = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'];
    const removeListeners = () =>
      events.forEach((event) => window.removeEventListener(event, load));
    const load = () => {
      removeListeners();
      import('./motion.js')
        .then(({ startMotion }) => {
          if (!cancelled) dispose = startMotion(root, page);
        })
        .catch(() => {
          /* Content stays visible if the optional motion chunk cannot load. */
        });
    };
    // Keep optional scrolling and pointer effects out of the initial render's critical path.
    events.forEach((event) => window.addEventListener(event, load, { passive: true, once: true }));
    return () => {
      cancelled = true;
      removeListeners();
      dispose?.();
    };
  }, [root, page]);
}
