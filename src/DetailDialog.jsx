import React from 'react';
import { useAnimatedDialog } from './useAnimatedDialog';
import { X, Sprout, ArrowUpRight } from 'lucide-react';

export function DetailDialog({ title, onClose, onContact }) {
  const { ref, close } = useAnimatedDialog(onClose);
  const copy = {
    'Sowing Window Alerts':
      'Plan every planting with confidence. Understand seasonal conditions, prepare your soil, and find the right window for each crop.',
    'Field Health Walkthrough':
      'Get a closer look at your land. Our team assesses soil structure, crop health, and irrigation to create a practical plan for healthier growth.',
    'Harvest Readiness Review':
      'Make the most of your season. Review crop maturity, field conditions, and the next steps for an efficient, rewarding harvest.',
  };
  return (
    <dialog
      ref={ref}
      className="detail-dialog modal"
      aria-labelledby="dialog-title"
      data-lenis-prevent
    >
      <button type="button" className="modal-close" aria-label="Close details" onClick={close}>
        <X />
      </button>
      <Sprout size={35} />
      <h2 id="dialog-title">{title}</h2>
      <p>{copy[title]}</p>
      <button
        className="button"
        type="button"
        onClick={() => {
          close(onContact);
        }}
      >
        Talk to our team
        <ArrowUpRight size={14} />
      </button>
    </dialog>
  );
}
