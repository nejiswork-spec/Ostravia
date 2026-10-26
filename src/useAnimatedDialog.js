import { useCallback, useEffect, useRef } from 'react';

export function useAnimatedDialog(onClose) {
  const ref = useRef(null);
  const callback = useRef(onClose);
  const closing = useRef(false);
  callback.current = onClose;
  const close = useCallback((afterClose) => {
    if (closing.current) return;
    closing.current = true;
    const finish = () => {
      callback.current();
      if (typeof afterClose === 'function') afterClose();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !ref.current?.animate) {
      finish();
      return;
    }
    const animation = ref.current.animate(
      [
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(12px) scale(.985)' },
      ],
      { duration: 180, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
    );
    animation.finished.then(finish, finish);
  }, []);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const backdrop = (event) => {
      if (event.target === dialog) close();
    };
    const cancel = (event) => {
      event.preventDefault();
      close();
    };
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const controls = [
        ...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'),
      ].filter(
        (element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length,
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    };
    dialog.addEventListener('click', backdrop);
    dialog.addEventListener('cancel', cancel);
    dialog.addEventListener('keydown', trapFocus);
    dialog.showModal();
    const animation = matchMedia('(prefers-reduced-motion: reduce)').matches
      ? null
      : dialog.animate(
          [
            { transform: 'translateY(16px) scale(.985)' },
            { transform: 'translateY(0) scale(1)' },
          ],
          { duration: 320, easing: 'cubic-bezier(.22,.68,.2,1)' },
        );
    return () => {
      animation?.cancel();
      dialog.close();
      dialog.removeEventListener('click', backdrop);
      dialog.removeEventListener('cancel', cancel);
      dialog.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = previousOverflow;
      queueMicrotask(() => {
        if (!document.querySelector('dialog[open]')) previousFocus?.focus({ preventScroll: true });
      });
    };
  }, [close]);
  return { ref, close };
}
