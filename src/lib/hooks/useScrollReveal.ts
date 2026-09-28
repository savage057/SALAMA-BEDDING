'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that triggers a CSS class on elements when they enter the viewport.
 * Uses IntersectionObserver for smooth reveal-on-scroll animations.
 */
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      const elements = ref.current.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));
    }

    return observer;
  }, [threshold]);

  useEffect(() => {
    const observer = observe();
    return () => observer?.disconnect();
  }, [observe]);

  return ref;
}
