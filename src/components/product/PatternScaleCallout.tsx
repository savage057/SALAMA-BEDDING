import React from 'react';

interface PatternScaleCalloutProps {
  note: string;
}

export default function PatternScaleCallout({ note }: PatternScaleCalloutProps) {
  return (
    <div className="flex gap-4 p-4 bg-surface rounded-xl border border-border/40">
      <div className="flex-shrink-0 text-charcoal/60 mt-0.5">
        {/* Ruler/Measuring Icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.3 8.11 15.89 2.7a1 1 0 0 0-1.41 0L2.7 14.48a1 1 0 0 0 0 1.41l5.41 5.41a1 1 0 0 0 1.42 0L21.3 9.53a1 1 0 0 0 0-1.42z" />
          <line x1="8.6" y1="5.9" x2="18.1" y2="15.4" />
          <line x1="10.8" y1="8.1" x2="12.2" y2="9.5" />
          <line x1="13" y1="10.3" x2="14.4" y2="11.7" />
          <line x1="15.2" y1="12.5" x2="16.6" y2="13.9" />
        </svg>
      </div>
      <div>
        <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-charcoal mb-1">
          Pattern Scale &amp; Detail
        </h4>
        <p className="text-xs font-sans text-charcoal/60 leading-relaxed">
          {note}. We believe in absolute transparency so you can shop with confidence.
        </p>
      </div>
    </div>
  );
}
