'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/products/stripe-room.jpg',
    title: 'Luxury Comfort,\nTailored for You.',
    subtitle: 'Premium bedding crafted with exquisite patterns and unmatched quality.',
    cta: 'Explore Collections',
    ctaHref: '/collections',
  },
  {
    id: 2,
    image: '/images/products/rose-room.jpg',
    title: 'Where Design\nMeets Comfort.',
    subtitle: 'From bold geometrics to timeless florals — find your signature style.',
    cta: 'Shop Now',
    ctaHref: '/collections',
  },
  {
    id: 3,
    image: '/images/products/rabbit-room.jpg',
    title: 'Every Room\nDeserves Magic.',
    subtitle: 'Playful character prints that bring joy and warmth to every bedroom.',
    cta: 'View Lookbook',
    ctaHref: '/lookbook',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 700);
      }, 300);
    },
    [currentSlide, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Slide Content */}
            <div
              key={currentSlide}
              className="animate-fade-in-up"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 whitespace-pre-line drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <p className="font-sans text-base sm:text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" size="lg" href={slides[currentSlide].ctaHref}>
                  {slides[currentSlide].cta}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="/collections"
                  className="!border-white/40 !text-white hover:!bg-white/10 hover:!border-white/60"
                >
                  Browse All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? 'w-10 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 hover:border-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:bg-white/10 hover:border-white/60 hover:text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 right-12 z-20 hidden lg:flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans rotate-90 origin-center translate-y-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent mt-6 animate-float" />
      </div>
    </section>
  );
}
