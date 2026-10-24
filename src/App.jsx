import { DetailDialog } from './DetailDialog';
import { Testimonials } from './Testimonials';
import { ContactDialog, CONTACT_EMAIL } from './ContactDialog';
import { Photo } from './Photo';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X, Sprout } from 'lucide-react';
import { usePageMotion } from './usePageMotion';
import { PageContent } from './Pages.jsx';

const services = ['Plant Selection', 'Soil Building', 'Home Garden', 'Field Care Unit'];
const descriptions = [
  'Hand-picked greenery for your roots.',
  'Adding structure to your garden landscape.',
  'Crafting the perfect garden space for your home. Whether indoor or outdoor, we get it all ready for your greenery needs.',
  'Expert advice for public gardens and city parks.',
];
function Label({ n, children }) {
  return (
    <div className="eyebrow">
      <span>{n}</span>
      {children}
    </div>
  );
}
function Button({ children, href = '#contact', light = false, onClick }) {
  return onClick ? (
    <button type="button" className={`button ${light ? 'light' : ''}`} onClick={onClick}>
      {children}
      <ArrowUpRight size={14} />
    </button>
  ) : (
    <a className={`button ${light ? 'light' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={14} />
    </a>
  );
}
export function App({ route = '/' }) {
  const page = route.replace(/\/+$/, '').slice(1);
  const innerPage = ['features', 'about', 'services', 'projects'].includes(page);
  const [contactOpen, setContactOpen] = useState(false);
  const root = useRef();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(2);
  const [detail, setDetail] = useState(null);
  const [sent, setSent] = useState(false);
  usePageMotion(root, innerPage ? page : '');
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <div ref={root} className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header>
        <a className="brand" href="/">
          Ostravia<span>®</span>
        </a>
        <nav id="primary-navigation" aria-label="Main navigation" className={menu ? 'open' : ''}>
          {[
            ['Home', '/'],
            ['Features', '/features'],
            ['About', '/about'],
            ['Services', '/services'],
          ].map(([text, href]) => (
            <a
              key={text}
              href={href}
              aria-current={route === href ? 'page' : undefined}
              onClick={() => setMenu(false)}
            >
              {text}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <Button
            onClick={(e) => {
              e.preventDefault();
              setContactOpen(true);
            }}
          >
            Reach us
          </Button>
          <button
            className="menu-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            aria-controls="primary-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {innerPage ? (
          <PageContent page={page} />
        ) : (
          <>
            <section className="hero" id="home">
              <div className="hero-shade" />
              <div className="hero-content">
                <h1>
                  {['Grow More Value From', 'Every Acre You Already Own'].map((t) => (
                    <span className="line-wrap" key={t}>
                      <span className="line">{t}</span>
                    </span>
                  ))}
                </h1>
                <p className="hero-intro">
                  For more than a beautiful landscape. With specialists, soil, and season in mind,
                  we build lasting landscapes that grow more each season while giving back to the
                  ground it grows from.
                </p>
                <div className="hero-actions">
                  <Button light>Get Started</Button>
                  <a href="/projects">
                    Explore Projects <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </section>
            <section className="about section-grid" id="about">
              <div data-reveal>
                <Label n="01">About Us</Label>
                <h2>
                  Built for Better
                  <br />
                  Returns, Built for
                  <br />
                  Living Soil
                </h2>
                <p className="muted about-copy">
                  Do not miss a single planting window. Stay updated on sowing dates, field
                  conditions, and crop schedules across every plot you manage.
                </p>
                <div className="mini-images">
                  <Photo
                    src="/images/garden-640.webp"
                    loading="lazy"
                    decoding="async"
                    alt="Layered planting and a path through a country garden"
                  />
                  <Photo
                    src="/images/soil-640.webp"
                    loading="lazy"
                    decoding="async"
                    alt="Healthy soil and a young seedling"
                  />
                </div>
              </div>
              <div className="updates" data-reveal>
                {[
                  'Sowing Window Alerts',
                  'Field Health Walkthrough',
                  'Harvest Readiness Review',
                ].map((title, i) => (
                  <article className={`update ${i === 1 ? 'selected' : ''}`} key={title}>
                    <div>
                      <h3>{title}</h3>
                      <p>
                        The smart in all about growing things, where growers are in tune with the
                        next moves and clear signals can come.
                      </p>
                      <button
                        className={`button ${i === 1 ? 'light' : ''}`}
                        onClick={() => setDetail(title)}
                      >
                        Learn More <ArrowUpRight size={12} />
                      </button>
                    </div>
                    <div className={`update-image image-${i}`} role="img" aria-label={title} />
                  </article>
                ))}
              </div>
            </section>
            <section id="services" className="services-section">
              <div className="section-heading" data-reveal>
                <div>
                  <Label n="02">Services</Label>
                  <p className="muted">
                    We design Hachioji Garden as a part of our new
                    <br /> Landscape Design Commitment to the country.
                  </p>
                </div>
                <h2>
                  Explore Soil, Season,
                  <br />
                  and Yield with Us
                </h2>
              </div>
              <div className="service-cards" data-reveal>
                {services.map((s, i) => (
                  <button
                    key={s}
                    className={`service-card ${active === i ? 'active' : ''}`}
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    style={{ '--position': `${(i * 100) / 3}%` }}
                  >
                    <div className="service-text">
                      <h3>{s}</h3>
                      <p>{descriptions[i]}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
            <section className="system dark-panel" id="system" data-reveal>
              <div className="panel-heading">
                <h2>
                  Manage Every Acre
                  <br />
                  as One System
                </h2>
                <p>
                  Don’t miss a single moving piece. Check out our upcoming methods to stay updated
                  on green futures, locations, and opportunities.
                </p>
              </div>
              <div className="system-grid">
                {[
                  [
                    'Land Assessment',
                    'Our team of experts meticulously crafts a custom garden design that aligns with your dreams and your local landscape.',
                  ],
                  [
                    'Crop and Planning',
                    'With your design finalized, we put our passion into practice, selecting plants and care methods that thrive in every season.',
                  ],
                  [
                    'Field Implementation',
                    'We bring vision to life with carefully considered, sustainable practices and expert growing plans.',
                  ],
                  [
                    'Harvest and Handover',
                    'The season is the beginning of a lasting journey. Stay connected with clear insights and a plan for what comes next.',
                  ],
                ].map(([title, body], i) => (
                  <article key={title}>
                    <span className="system-dot" />
                    <small>0{i + 1}</small>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="care section-grid">
              <div className="care-photo" data-reveal>
                <div className="photo-label">
                  <Sprout size={16} /> FROM THE GROUND UP
                </div>
              </div>
              <div data-reveal>
                <Label n="03">Types of Service</Label>
                <h2>
                  Our teams handle
                  <br />
                  sowing, irrigation,
                  <br />
                  nutrition
                </h2>
                <div className="pagination">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="design">
                  <div>
                    <h3>System Design</h3>
                    <p className="muted">
                      Crafting thoughtful garden spaces for your home. Whether indoor or outdoor, we
                      get it all ready for your greenery needs.
                    </p>
                    <Button>Learn More</Button>
                  </div>
                  <Photo
                    src="/images/garden-640.webp"
                    loading="lazy"
                    decoding="async"
                    alt="Landscape design inspiration"
                  />
                </div>
              </div>
            </section>
            <Testimonials />
            <section id="work" className="work">
              <div className="section-heading" data-reveal>
                <div>
                  <Label n="04">Work</Label>
                  <p className="muted">
                    We design Hachioji Garden as a part of our new
                    <br /> Landscape Design Commitment to the country.
                  </p>
                </div>
                <h2>
                  Fields Running
                  <br />
                  On Our System
                </h2>
              </div>
              <div className="work-grid" data-reveal>
                {['A greener tomorrow', 'Room for new growth'].map((t, i) => (
                  <a key={t} href="#contact" className={`project project-${i}`}>
                    <span>0{i + 1} / FIELD STORIES</span>
                    <div>
                      <h3>{t}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
        <section id="contact" className="contact dark-panel" data-reveal>
          <Label n="05">Let’s Grow Together</Label>
          <div className="section-grid">
            <h2>
              Good things start
              <br />
              with the ground.
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Let’s talk about my land')}&body=${encodeURIComponent('Hello Ostravia,\n\nI would like to discuss a project.\n\nMy email: ' + e.currentTarget.elements.email.value)}`;
                setSent(true);
              }}
            >
              <label htmlFor="email">A better season starts here.</label>
              <div className="email-input">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  required
                  aria-label="Your email address"
                />
                <button aria-label="Send enquiry">
                  <ArrowRight />
                </button>
              </div>
              <p>
                {sent
                  ? 'Your enquiry is ready in your email app. Send it there to get in touch.'
                  : 'Leave your email and let’s talk about your land.'}
              </p>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="brand">
          Ostravia<span>®</span>
        </div>
        <a className="aivora" href="https://aivora.com" target="_blank" rel="noreferrer">
          <span>Made by</span>
          <Photo src="/aivora.webp" width={220} height={90} alt="Aivora" />
        </a>
        <small>© {new Date().getFullYear()} Ostravia</small>
      </footer>
      {contactOpen && <ContactDialog onClose={() => setContactOpen(false)} />}
      {detail && (
        <DetailDialog
          title={detail}
          onClose={() => setDetail(null)}
          onContact={() => setContactOpen(true)}
        />
      )}
    </div>
  );
}
