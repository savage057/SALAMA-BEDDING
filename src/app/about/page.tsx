'use client';

import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import { SITE_NAME } from '@/lib/constants';

function getPillarIcon(iconName: string) {
  switch (iconName) {
    case 'sizing':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'weave':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'custom':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}

export default function AboutPage() {
  const scrollRef = useScrollReveal();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load about data');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin mb-4" />
        <p className="text-xs font-sans text-muted tracking-wider uppercase">Loading About Page...</p>
      </div>
    );
  }

  // Fallback to static values if fetch failed
  const hero = data?.hero || {
    subtitle: 'Our Heritage & Vision',
    title: 'Crafting the Art of Restful Luxury',
    description: `Welcome to ${SITE_NAME}, where we believe that a bedroom is more than just a place to sleep—it is your personal sanctuary.`,
  };

  const story = data?.story || {
    subtitle: `The Story of ${SITE_NAME}`,
    title: 'Bridging Elegant Design with Personal Customization',
    paragraph1: 'Salama Bedding was born from a simple observation: finding high-quality bedding that perfectly fits your mattress size while matching your unique taste is unnecessarily difficult. Most options are either mass-produced in low-grade materials, or fail to account for non-standard sizing.',
    paragraph2: 'We set out to create a luxury experience where premium long-staple cotton meets beautiful, curated patterns—from minimalist geometries and classic heritage florals to whimsical novelty prints. Every bedding set is made to order, ensuring it wraps your bed in absolute perfection.',
  };

  const image = data?.image || { url: '/images/about_hero_bedroom.png' };
  const pillars = data?.pillars || [];

  return (
    <div ref={scrollRef} className="bg-background min-h-screen pt-24 pb-20 overflow-hidden font-sans">
      {/* 1. Hero Section */}
      <section className="relative px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto text-center">
        <div className="reveal revealed flex flex-col items-center">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5 block animate-fade-in-down">
            {hero.subtitle}
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-charcoal max-w-3xl leading-[1.1] mb-6 animate-scale-in">
            {hero.title}
          </h1>
          <div className="w-16 h-[2px] bg-gold mb-8 animate-glow-pulse" />
          <p className="text-sm lg:text-base text-muted max-w-xl font-light leading-relaxed animate-fade-in">
            {hero.description}
          </p>
        </div>
      </section>

      {/* 2. Narrative Section */}
      <section className="px-6 lg:px-12 py-12 lg:py-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text block */}
          <div className="reveal revealed flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
            <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold animate-fade-in">
              {story.subtitle}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal leading-tight animate-fade-in">
              {story.title}
            </h2>
            <p className="text-xs lg:text-sm text-charcoal/80 leading-relaxed font-light animate-fade-in">
              {story.paragraph1}
            </p>
            <p className="text-xs lg:text-sm text-charcoal/80 leading-relaxed font-light animate-fade-in">
              {story.paragraph2}
            </p>
            <div className="flex gap-8 mt-4 border-t border-border/40 pt-6 animate-fade-in">
              <div>
                <p className="font-serif text-2xl lg:text-3xl font-bold text-gold">100%</p>
                <p className="text-[10px] text-muted uppercase font-bold tracking-wider mt-1">Premium Cotton</p>
              </div>
              <div>
                <p className="font-serif text-2xl lg:text-3xl font-bold text-gold">Tailored</p>
                <p className="text-[10px] text-muted uppercase font-bold tracking-wider mt-1">To Mattress Specs</p>
              </div>
              <div>
                <p className="font-serif text-2xl lg:text-3xl font-bold text-gold">WhatsApp</p>
                <p className="text-[10px] text-muted uppercase font-bold tracking-wider mt-1">Direct Orders</p>
              </div>
            </div>
          </div>

          {/* Image block */}
          <div className="reveal scale-in revealed order-1 lg:order-2">
            <div className="relative group rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-surface animate-float">
              <img
                src={image.url}
                alt="Premium Bedroom styled with Salama Bedding"
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars */}
      {pillars.length > 0 && (
        <section className="bg-surface/30 border-y border-border/20 py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="reveal revealed text-center mb-16 flex flex-col items-center">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5">
                Our Foundations
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-4">
                Designed for Comfort, Crafted to Last
              </h2>
              <p className="text-xs lg:text-sm text-muted max-w-md font-light leading-relaxed">
                We refuse to cut corners. Every sheet, duvet cover, and pillowcase we create conforms to three core quality promises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar: any, index: number) => (
                <div
                  key={pillar.id}
                  className="reveal revealed bg-white border border-border/40 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gold/10 text-gold flex items-center justify-center rounded-xl mb-6">
                    {getPillarIcon(pillar.icon)}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-3">{pillar.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Process Timeline */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="reveal revealed text-center mb-16 flex flex-col items-center">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5">
            How It Works
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-4">
            Custom Sizing in Three Simple Steps
          </h2>
          <p className="text-xs lg:text-sm text-muted max-w-md font-light leading-relaxed">
            We operate on a personal made-to-order basis. Here is how we deliver bespoke comfort to your home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-border/60 z-0" />

          {/* Step 1 */}
          <div className="reveal revealed flex flex-col items-center text-center relative z-10">
            <div className="w-12 h-12 bg-charcoal text-white rounded-full flex items-center justify-center font-serif font-bold text-lg mb-6 shadow-md">
              1
            </div>
            <h3 className="font-serif text-md font-bold text-charcoal mb-2">Select Your Design</h3>
            <p className="text-xs text-muted max-w-xs font-light leading-relaxed">
              Browse our collections of custom patterns. Experiment with colors and styling choices.
            </p>
          </div>

          {/* Step 2 */}
          <div className="reveal revealed flex flex-col items-center text-center relative z-10">
            <div className="w-12 h-12 bg-charcoal text-white rounded-full flex items-center justify-center font-serif font-bold text-lg mb-6 shadow-md">
              2
            </div>
            <h3 className="font-serif text-md font-bold text-charcoal mb-2">Measure Your Mattress</h3>
            <p className="text-xs text-muted max-w-xs font-light leading-relaxed">
              Verify your bed specifications (Twin, Full, Queen, King, or custom depth). We construct pieces exactly to these dimensions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="reveal revealed flex flex-col items-center text-center relative z-10">
            <div className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center font-serif font-bold text-lg mb-6 shadow-md animate-glow-pulse">
              3
            </div>
            <h3 className="font-serif text-md font-bold text-charcoal mb-2">WhatsApp Consultation</h3>
            <p className="text-xs text-muted max-w-xs font-light leading-relaxed">
              Send your bag estimate via WhatsApp. Our design specialist will confirm custom requests, shipping details, and finalize your order.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="px-6 lg:px-12 py-10 max-w-[1400px] mx-auto">
        <div className="reveal scale-in bg-charcoal text-white rounded-3xl p-10 lg:p-16 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          {/* Subtle glow sphere */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          
          <span className="font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4 block">
            Begin Customizing
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6 max-w-lg leading-tight">
            Ready to Redefine Your Bedtime Experience?
          </h2>
          <p className="text-xs lg:text-sm text-white/70 max-w-md font-light leading-relaxed mb-8">
            Explore our geometric, floral, and novelty prints, select your mattress size, and place your order directly through WhatsApp.
          </p>
          
          <a
            id="about-cta-btn"
            href="/collections"
            className="px-8 py-3.5 bg-gold hover:bg-gold-light text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Explore Collections
          </a>
        </div>
      </section>
    </div>
  );
}
