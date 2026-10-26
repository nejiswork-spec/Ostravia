import { Photo } from './Photo';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowDown, Sprout } from 'lucide-react';

const offerings = [
  {
    title: 'Plant Selection',
    caption: 'The right plant. The right place.',
    body: 'A thriving landscape starts with plants that belong there. We consider soil, light, water, and the changing seasons to build a planting palette that feels natural and grows with purpose.',
    items: [
      'Site and growing-condition review',
      'Seasonal planting palette',
      'Plant sourcing and placement',
    ],
    category: 'Gardens',
  },
  {
    title: 'Soil Building',
    caption: 'Better growth begins below.',
    body: 'Give your land a stronger foundation. We look at soil structure, drainage, and organic matter, then shape a practical care plan around what your ground needs.',
    items: [
      'Soil and drainage assessment',
      'Compost and amendment planning',
      'Long-term soil care guidance',
    ],
    category: 'Farmland',
  },
  {
    title: 'Home Garden',
    caption: 'Make room for everyday nature.',
    body: 'From a quiet corner to a complete outdoor space, we create gardens that fit the way you live. Thoughtful layouts and considered planting bring the whole space together.',
    items: [
      'Garden layout and planting design',
      'Water-wise irrigation planning',
      'Installation and seasonal aftercare',
    ],
    category: 'Gardens',
  },
  {
    title: 'Field Care Unit',
    caption: 'A clear plan for every acre.',
    body: 'Bring sowing, irrigation, and nutrition into one coordinated approach. We help you understand your fields and make considered decisions throughout the growing season.',
    items: [
      'Field condition walkthrough',
      'Crop and irrigation planning',
      'Seasonal monitoring and handover',
    ],
    category: 'Farmland',
  },
];
const projects = [
  {
    name: 'Hachioji Garden',
    type: 'Gardens',
    image: 0,
    lead: 'A place to slow down.',
    description:
      'A garden concept that connects winding paths, layered planting, and open green space. A calm setting designed around everyday moments outdoors.',
    scope: 'Landscape design · Plant selection · Garden care',
  },
  {
    name: 'The Living Field',
    type: 'Farmland',
    image: 2,
    lead: 'Every row, considered.',
    description:
      'A field management concept that brings crop planning, soil care, and irrigation together. Clear planting zones make the land easier to understand and manage.',
    scope: 'Soil building · Field planning · Irrigation',
  },
  {
    name: 'Meadow House',
    type: 'Gardens',
    image: 1,
    lead: 'Nature, closer to home.',
    description:
      'A residential garden concept with space to gather, grow, and unwind. Seasonal planting and simple circulation create a thoughtful extension of the home.',
    scope: 'Home garden · Planting design · Seasonal care',
  },
  {
    name: 'Open Acre',
    type: 'Farmland',
    image: 3,
    lead: 'A stronger start for the season.',
    description:
      'An agricultural landscape concept focused on practical field care. Sowing windows, water use, and nutrition form the starting point for a coordinated growing plan.',
    scope: 'Land assessment · Crop planning · Field care',
  },
];
const pageInfo = {
  about: [
    '01 / ABOUT OSTRAVIA',
    'Rooted in care.',
    'Growing with purpose.',
    'We bring thoughtful design and practical land care together, helping gardens and fields become places that thrive.',
  ],
  services: [
    '02 / OUR SERVICES',
    'Good ground.',
    'Better possibilities.',
    'From the first soil assessment to the next growing season, find the right support for your land.',
  ],
  projects: [
    '03 / SELECTED WORK',
    'Room to grow.',
    'Space to belong.',
    'Explore the possibilities of considered planting, healthy soil, and a clear plan for every acre.',
  ],
};
export function PageContent({ page }) {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const changeFilter = (value) => {
    if (value === filter) return;
    const update = () => {
      setFilter(value);
      setExpanded(null);
    };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => flushSync(update));
    } else update();
  };
  const info =
    page === 'features'
      ? [
          '01 / FEATURES',
          'Every acre, connected.',
          'Every season, considered.',
          'Sowing windows, field health, and harvest planning. A clearer view of the land you manage, all working together.',
        ]
      : pageInfo[page];
  return (
    <div className={`inner-page ${page}-page`}>
      <section className="page-intro">
        <div className="intro-copy" data-reveal>
          <h1>
            {info[1]}
            <br />
            <span>{info[2]}</span>
          </h1>
          <div className="intro-bottom">
            <p>{info[3]}</p>
            <a className="intro-down" href="#page-content" aria-label="Explore this page">
              <ArrowDown size={23} />
            </a>
          </div>
        </div>
        <div
          className={`intro-image intro-${page}`}
          role="img"
          aria-label="Lush agricultural landscape"
        ></div>
      </section>
      {page === 'features' && (
        <div id="page-content">
          <section className="page-section feature-overview section-grid" data-reveal>
            <div>
              <h2>
                Less guesswork.
                <br />
                More room to grow.
              </h2>
              <p className="body-copy">
                Keep the next step in sight. Our approach connects the timing, condition, and care
                of your land, helping you make considered decisions throughout the season.
              </p>
              <div className="mini-images">
                <Photo
                  src="/images/garden-640.webp"
                  loading="lazy"
                  decoding="async"
                  alt="Layered planting and a path through a country garden"
                />
                <Photo
                  src="/images/harvest-640.webp"
                  loading="lazy"
                  decoding="async"
                  alt="Fresh seasonal produce from the garden"
                />
              </div>
            </div>
            <div className="updates">
              {[
                [
                  'Sowing Window Alerts',
                  'Plan planting around the season. Bring crop schedules and local growing conditions into a clear view of what to sow next.',
                ],
                [
                  'Field Health Walkthrough',
                  'Look closer at your soil, water, and planting. Identify the areas that need attention and turn observations into a practical care plan.',
                ],
                [
                  'Harvest Readiness Review',
                  'Prepare for the next stage with a considered review of crop maturity, field conditions, and the work ahead.',
                ],
              ].map(([title, body], i) => (
                <article className={`update ${i === 1 ? 'selected' : ''}`} key={title}>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                    <a className={`button ${i === 1 ? 'light' : ''}`} href={`#feature-${i}`}>
                      Explore feature <ArrowUpRight size={12} />
                    </a>
                  </div>
                  <div className={`update-image image-${i}`} role="img" aria-label={title} />
                </article>
              ))}
            </div>
          </section>
          <section className="dark-panel values" data-reveal>
            <div className="panel-heading">
              <h2>
                Manage Every Acre
                <br />
                as One System
              </h2>
              <p>
                A connected approach to land assessment, crop planning, field care, and the season
                ahead.
              </p>
            </div>
            <div className="value-grid">
              {[
                [
                  'Understand your land',
                  'Start with soil structure, drainage, and growing conditions.',
                ],
                [
                  'Plan with the season',
                  'Bring planting, irrigation, and nutrition into one considered schedule.',
                ],
                [
                  'Keep moving forward',
                  'Review the field, refine the plan, and prepare for the next stage.',
                ],
              ].map(([t, b]) => (
                <article key={t}>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="page-section feature-details">
            {[
              [
                'Sowing Window Alerts',
                'A better start to every season.',
                'A planting plan should work with your land. We consider the crops you want to grow, the condition of the soil, and the timing of seasonal work to shape a clear starting point.',
                'Seasonal planting priorities · Crop schedules · Ground preparation',
              ],
              [
                'Field Health Walkthrough',
                'Know what your ground needs.',
                'From uneven growth to water movement, small observations can reveal a bigger picture. A field walkthrough connects those details to practical next steps for soil, irrigation, and plant care.',
                'Soil condition review · Irrigation observations · Care priorities',
              ],
              [
                'Harvest Readiness Review',
                'Be ready for what comes next.',
                'Bring the season into focus before the harvest. Review field access, crop development, and the tasks ahead so that the transition from growing to gathering feels considered.',
                'Crop maturity review · Field preparation · Next-season planning',
              ],
            ].map(([t, h, b, s], i) => (
              <article
                id={`feature-${i}`}
                className="feature-detail section-grid"
                key={t}
                data-reveal
              >
                <div className={`feature-detail-image image-${i}`} role="img" aria-label={t} />
                <div>
                  <h2>{h}</h2>
                  <p className="body-copy">{b}</p>
                  <p className="feature-scope">{s}</p>
                  <a className="button" href="#contact">
                    Let’s talk about your land
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
      {page === 'about' && (
        <div id="page-content">
          <section className="story section-grid page-section" data-reveal>
            <div>
              <h2>
                A landscape is more
                <br />
                than what you see.
              </h2>
            </div>
            <div className="story-copy">
              <p>
                It is the soil beneath your feet. The water that moves through it. The plants,
                people, and seasons that make it their own.
              </p>
              <p>
                At Ostravia, we start by listening to the land and to you. We connect landscape
                design with practical care, creating a clear path from the first idea to a space
                that keeps growing.
              </p>
              <p>
                Whether it is a home garden or an open field, our approach stays the same:
                understand the ground, make considered choices, and care for what comes next.
              </p>
            </div>
          </section>
          <section className="values dark-panel">
            <div className="panel-heading" data-reveal>
              <h2>Care in every decision.</h2>
              <p>
                Three simple principles guide the way we work, from the smallest planting detail to
                the wider landscape.
              </p>
            </div>
            <div className="value-grid">
              {[
                [
                  'Ground first',
                  'Healthy soil is the foundation. We take time to understand the conditions before shaping a plan.',
                ],
                [
                  'Purposeful design',
                  'Every space should work for the people who use it, with planting and layouts that feel at home.',
                ],
                [
                  'Lasting care',
                  'A handover is a new beginning. We plan for the seasons ahead so your landscape can keep evolving.',
                ],
              ].map(([t, b]) => (
                <article data-reveal key={t}>
                  <Sprout size={25} />
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="page-section section-grid about-method" data-reveal>
            <div className="method-image" role="img" aria-label="A field prepared for growing" />
            <div>
              <h2>
                Close to the land.
                <br />
                Clear at every step.
              </h2>
              <p className="body-copy">
                We begin with a conversation and a site assessment. From there, we develop a plan,
                bring it to life, and make sure you understand how to care for it.
              </p>
              <a className="button" href="/services">
                Explore our services
                <ArrowUpRight size={15} />
              </a>
            </div>
          </section>
        </div>
      )}
      {page === 'services' && (
        <div id="page-content">
          <section className="page-section service-directory">
            <div className="directory-heading" data-reveal>
              <p>
                Choose a service below to explore what goes into a healthier, more considered
                landscape.
              </p>
            </div>
            {offerings.map((s, i) => (
              <article className="offering" key={s.title} id={`service-${i}`} data-reveal>
                <div
                  className="offering-photo"
                  style={{ '--position': `${(i * 100) / 3}%` }}
                  role="img"
                  aria-label={s.title}
                />
                <div className="offering-content">
                  <h2>{s.title}</h2>
                  <h3>{s.caption}</h3>
                  <p>{s.body}</p>
                  <ul>
                    {s.items.map((item) => (
                      <li key={item}>
                        <Sprout size={14} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a className="button" href="#contact">
                    Discuss your space
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </section>
          <section className="process dark-panel" data-reveal>
            <h2>
              One team.
              <br />A considered process.
            </h2>
            <div className="value-grid">
              {[
                [
                  'Discover',
                  'We walk the site, listen to your priorities, and understand the conditions.',
                ],
                [
                  'Design & grow',
                  'We develop a practical plan and coordinate planting, soil care, and implementation.',
                ],
                [
                  'Care & evolve',
                  'We help you understand the next steps and prepare for the seasons ahead.',
                ],
              ].map(([t, b]) => (
                <article key={t}>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="page-section faq" data-reveal>
            <div>
              <h2>Before we get growing.</h2>
            </div>
            <div>
              {[
                [
                  'Where do we start?',
                  'Start with a conversation about your space, priorities, and timeline. A site assessment helps determine the right scope and next steps.',
                ],
                [
                  'Can I combine services?',
                  'Yes. Planting, soil care, garden design, and field planning can be considered together as one coordinated project.',
                ],
                [
                  'Do you help with ongoing care?',
                  'Seasonal care and handover guidance can be included in your project scope. We will discuss the level of support your landscape needs.',
                ],
              ].map(([q, a], i) => (
                <details className="faq-item" name="growing-faq" key={q}>
                  <summary>
                    {q}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-answer" id={`faq-${i}`}>
                    <div>
                      <p>{a}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}
      {page === 'projects' && (
        <section className="page-section portfolio" id="page-content">
          <div className="portfolio-bar" data-reveal>
            <div className="filter-tabs" aria-label="Filter projects">
              {['All', 'Gardens', 'Farmland'].map((t) => (
                <button
                  key={t}
                  aria-pressed={filter === t}
                  className={filter === t ? 'chosen' : ''}
                  onClick={() => changeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="portfolio-grid">
            {projects
              .filter((p) => filter === 'All' || p.type === filter)
              .map((p) => (
                <article
                  className="portfolio-card"
                  key={p.name}
                  style={{ viewTransitionName: `project-${p.image}` }}
                >
                  <button
                    className={`portfolio-image portfolio-image-${p.image}`}
                    onClick={() => setExpanded(expanded === p.name ? null : p.name)}
                    aria-label={`${p.type}: explore ${p.name}`}
                    aria-expanded={expanded === p.name}
                  >
                    <span>{p.type}</span>
                  </button>
                  <div className="portfolio-caption">
                    <h2>{p.name}</h2>
                    <button
                      onClick={() => setExpanded(expanded === p.name ? null : p.name)}
                      aria-expanded={expanded === p.name}
                    >
                      {expanded === p.name ? 'Close story' : 'Explore concept'}{' '}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <p>{p.lead}</p>
                  {expanded === p.name && (
                    <div className="project-story">
                      <p>{p.description}</p>
                      <small>{p.scope}</small>
                      <a href="#contact">
                        Talk about a similar project <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </article>
              ))}
          </div>
          <div className="portfolio-note">
            <Sprout size={22} />
            <p>
              These illustrative project concepts explore the Ostravia approach. Imagery is
              generated; completed client case studies will be added as they become available.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
