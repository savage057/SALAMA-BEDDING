import Button from '@/components/ui/Button';

export default function VisualizerPreview() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-surface">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-gold/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-radial from-charcoal/3 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="reveal relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/products/anime-room.jpg"
                alt="Bedroom styled with SALAMA BEDDING products"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="lazy"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 glass-card rounded-xl px-5 py-3.5 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-sans font-semibold text-charcoal">Room View</p>
                    <p className="text-[10px] font-sans text-muted">Swap colorways live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating thumbnail */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 w-28 h-28 lg:w-36 lg:h-36 rounded-xl overflow-hidden shadow-xl border-4 border-white animate-float">
              <img
                src="/images/products/stripe-room.jpg"
                alt="Bedding pattern close-up"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="reveal order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-glow-pulse" />
              <span className="text-xs font-sans font-medium uppercase tracking-[0.15em] text-charcoal/60">
                New Feature
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.15] mb-6">
              See It in Your
              <span className="block text-gold mt-1">Room First.</span>
            </h2>

            <p className="text-base lg:text-lg font-sans text-charcoal/60 leading-relaxed mb-8 max-w-lg">
              Our Room View Switcher lets you see exactly how each colorway looks styled on a real bed. 
              Swap patterns and colors seamlessly — no guesswork, no surprises. 
              What you see is what you get.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: '🎨', text: 'Switch between colorways with one click' },
                { icon: '🛏️', text: 'Real room photography, not 3D renders' },
                { icon: '🔍', text: 'Zoom in on fabric weave and pattern detail' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-sans text-charcoal/70">{item.text}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" href="/collections">
              Try Room View
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
