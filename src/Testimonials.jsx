import React, { useEffect, useRef, useState } from 'react';
import { Sprout } from 'lucide-react';

const stories = [
  {
    quote:
      'Ostravia brought new life to our tired fields in two seasons. Healthy soil, clear advice, and a team that walks the land with us.',
    name: 'Michael Turner',
    role: 'Greenfield Farms',
    image: '/images/portrait-400.webp',
  },
  {
    quote:
      'For the first time, every acre has a plan. Our soil is healthier, our planting feels considered, and our team knows what comes next.',
    name: 'Sarah Williams',
    role: 'Meadow Grove',
    image: '/images/profile-sarah.webp',
  },
  {
    quote:
      'They listened to how we wanted to use our garden. Now there is a place for slow mornings, family dinners, and something green in every season.',
    name: 'Emma Collins',
    role: 'Home garden project',
    image: '/images/profile-emma.webp',
  },
  {
    quote:
      'The soil assessment changed how we approached the whole field. Practical steps, thoughtful follow-through, and a much clearer view of our land.',
    name: 'Daniel Brooks',
    role: 'Brookside Fields',
    image: '/images/profile-daniel.webp',
  },
  {
    quote:
      'From choosing the plants to planning their care, every detail felt connected. The garden looks settled, natural, and completely at home.',
    name: 'Olivia Reed',
    role: 'Residential landscape project',
    image: '/images/profile-olivia.webp',
  },
  {
    quote:
      'Having sowing, irrigation, and nutrition considered together made the season easier to manage. We finally feel ahead of the work.',
    name: 'James Okafor',
    role: 'Open Acre Growers',
    image: '/images/profile-james.webp',
  },
];
export function Testimonials() {
  const [index, setIndex] = useState(0),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [autoRotate, setAutoRotate] = useState(true),
    [visible, setVisible] = useState(false),
    [reduced, setReduced] = useState(false);
  const region = useRef(null);
  const interacting = hovered || focused;
  useEffect(() => {
    if (!visible) return;
    const image = new Image();
    image.src = stories[(index + 1) % stories.length].image;
  }, [index, visible]);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(preference.matches);
    change();
    preference.addEventListener('change', change);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(region.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', change);
    };
  }, []);
  useEffect(() => {
    if (!autoRotate || interacting || !visible || reduced) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % stories.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [autoRotate, interacting, visible, reduced, index]);
  const current = stories[index];
  return (
    <section
      ref={region}
      className="testimonials dark-panel"
      data-reveal
      aria-label="Illustrative testimonials"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="panel-heading">
        <h2>
          Built for Precision
          <br />
          Growing
        </h2>
        <p>
          Thoughtful care, from the first conversation to the seasons ahead.
          <span className="sample-label">Illustrative client stories</span>
        </p>
      </div>
      <div className="quote-row">
        <div className="portrait">
          <div className="testimonial-avatar" key={current.name}>
            <img
              src={current.image}
              alt={`Illustrative portrait of ${current.name}`}
              width="400"
              height="400"
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="quote-controls">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setIndex((i) => (i - 1 + stories.length) % stories.length)}
            >
              ←
            </button>
            <span>{String(index + 1).padStart(2, '0')} / 06</span>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setIndex((i) => (i + 1) % stories.length)}
            >
              →
            </button>
          </div>
        </div>
        <blockquote
          aria-live={autoRotate && !interacting && !reduced ? 'off' : 'polite'}
          aria-atomic="true"
        >
          <div
            className="testimonial-slide"
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Testimonial ${index + 1} of 6`}
          >
            <span className="quote-mark">“</span>
            <p>{current.quote}</p>
            <footer>
              <Sprout size={29} />
              <div>
                <b>{current.name}</b>
                <small>{current.role}</small>
              </div>
            </footer>
          </div>
          <div className="testimonial-dots" aria-label="Choose testimonial">
            {stories.map((s, i) => (
              <button
                key={s.name}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <span />
              </button>
            ))}
          </div>
        </blockquote>
      </div>
      <label className="carousel-rotation">
        <input
          type="checkbox"
          checked={autoRotate && !reduced}
          disabled={reduced}
          onChange={(event) => setAutoRotate(event.target.checked)}
        />
        Auto-rotate stories{reduced ? ' (reduced motion is on)' : ''}
      </label>
    </section>
  );
}
