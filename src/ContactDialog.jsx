import React from 'react';
import { useAnimatedDialog } from './useAnimatedDialog';
import { ArrowUpRight, X, Sprout } from 'lucide-react';

export const CONTACT_EMAIL = 'hello@ostravia.com';
export function ContactDialog({ onClose }) {
  const { ref, close } = useAnimatedDialog(onClose);
  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = `Ostravia enquiry | ${values.get('service')}`;
    const body = `Hello Ostravia,\n\n${values.get('message')}\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nInterested in: ${values.get('service')}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return (
    <dialog className="contact-dialog" data-lenis-prevent ref={ref} aria-labelledby="contact-title">
      <div className="contact-dialog-content">
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Close contact form"
        >
          <X />
        </button>
        <Sprout size={30} />
        <span className="page-kicker">LET’S GROW TOGETHER</span>
        <h2 id="contact-title">
          Tell us about
          <br />
          your space.
        </h2>
        <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
          <ArrowUpRight size={16} />
        </a>
        <form onSubmit={submit}>
          <div className="contact-fields">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                placeholder="Full name"
                required
                maxLength={120}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>
          </div>
          <label>
            What can we help with?
            <select name="service" defaultValue="General enquiry">
              {[
                'General enquiry',
                'Plant selection',
                'Soil building',
                'Home garden',
                'Field care',
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            A little about your project
            <textarea
              name="message"
              placeholder="Tell us about your land, ideas, and timing…"
              required
              rows={3}
              maxLength={3000}
            />
          </label>
          <button className="button" type="submit">
            Compose enquiry
            <ArrowUpRight size={16} />
          </button>
          <p className="compose-note">Opens your email app with your message ready to send.</p>
        </form>
      </div>
    </dialog>
  );
}
