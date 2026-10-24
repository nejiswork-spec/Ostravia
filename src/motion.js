import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

export function startMotion(root, page) {
  document.title = page
    ? `${page.charAt(0).toUpperCase()}${page.slice(1)} | Ostravia`
    : 'Ostravia | Grow More Value';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose = () => {};
  const setup = () => {
    dispose();
    if (preference.matches) {
      dispose = () => {};
      return;
    }
    const cleanups = [];
    const lenis = new Lenis({ duration: 1.15, anchors: true, autoRaf: true, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const bounds = new Map();
    const invalidate = () => bounds.clear();
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate, { passive: true });
    const ctx = gsap.context(() => {
      if (window.scrollY < 80) {
        gsap.from('.hero h1 .line,.intro-copy h1', {
          y: 12,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
        });
        gsap.from('.hero-intro,.hero-actions,.intro-bottom', {
          y: 9,
          stagger: 0.06,
          duration: 0.75,
          ease: 'power3.out',
        });
      }
      const reveal = (elements, trigger) => {
        if (trigger.getBoundingClientRect().top < window.innerHeight * 0.94) return;
        gsap.from(elements, {
          opacity: 0,
          y: 24,
          stagger: 0.065,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger, start: 'top 92%', once: true },
        });
      };
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        if (el.closest('.page-intro') || el.parentElement.closest('[data-reveal]')) return;
        reveal(
          el.matches('.updates,.service-cards,.work-grid,.portfolio-grid') ? [...el.children] : el,
          el,
        );
      });
      gsap.utils.toArray('.system-grid,.value-grid,.portfolio-grid').forEach((el) => {
        if (!el.closest('[data-reveal]')) reveal([...el.children], el);
      });
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const getBounds = (el) => {
          if (!bounds.has(el)) bounds.set(el, el.getBoundingClientRect());
          return bounds.get(el);
        };
        root.current.querySelectorAll('.updates .update').forEach((card) => {
          gsap.set(card, { transformPerspective: 1300 });
          const tiltX = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power3.out' });
          const tiltY = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power3.out' });
          const move = (e) => {
            const box = getBounds(card);
            const x = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
            const y = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
            tiltX((0.5 - y) * 2);
            tiltY((x - 0.5) * 2);
            card.style.setProperty('--pointer-x', `${x * 100}%`);
            card.style.setProperty('--pointer-y', `${y * 100}%`);
          };
          const leave = () => {
            tiltX(0);
            tiltY(0);
            bounds.delete(card);
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
            card.style.removeProperty('--pointer-x');
            card.style.removeProperty('--pointer-y');
          });
        });
        root.current.querySelectorAll('.button,.intro-down,.email-input button').forEach((el) => {
          const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' }),
            y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
          const move = (e) => {
            const box = getBounds(el);
            x((e.clientX - box.left - box.width / 2) * 0.08);
            y((e.clientY - box.top - box.height / 2) * 0.1);
          };
          const leave = () => {
            x(0);
            y(0);
            bounds.delete(el);
          };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          });
        });
      }
    }, root);
    let refresh;
    const observer = new ResizeObserver(() => {
      clearTimeout(refresh);
      refresh = setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    observer.observe(root.current);
    dispose = () => {
      observer.disconnect();
      clearTimeout(refresh);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      cleanups.forEach((fn) => fn());
      ctx.revert();
      lenis.destroy();
    };
  };
  setup();
  preference.addEventListener('change', setup);
  return () => {
    preference.removeEventListener('change', setup);
    dispose();
  };
}
