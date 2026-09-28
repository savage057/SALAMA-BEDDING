'use client';

import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import HeroCarousel from '@/components/home/HeroCarousel';
import TrustBanner from '@/components/home/TrustBanner';
import BespokeTailoringGuide from '@/components/home/BespokeTailoringGuide';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhatsAppCTA from '@/components/home/WhatsAppCTA';

export default function HomePage() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef}>
      {/* 1. Full-bleed cinematic hero carousel */}
      <HeroCarousel />

      {/* 2. Trust / stats banner */}
      <TrustBanner />

      {/* 3. Bespoke Custom Tailoring Guide */}
      <BespokeTailoringGuide />

      {/* 3.5. Featured products segment */}
      <FeaturedProducts />

      {/* 5. WhatsApp order CTA */}
      <WhatsAppCTA />
    </div>
  );
}
