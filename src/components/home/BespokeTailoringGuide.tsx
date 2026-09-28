import Button from '@/components/ui/Button';

export default function BespokeTailoringGuide() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-surface">
      {/* Decorative background glow fields */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-gold/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-radial from-charcoal/3 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="reveal relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-white">
              <img
                src="/images/products/rose-room.jpg"
                alt="Bespoke bedding styled in a luxury bedroom"
                className="w-full h-[400px] lg:h-[500px] object-cover hover:scale-102 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Floating custom badge */}
              <div className="absolute bottom-6 left-6 glass-card rounded-2xl px-5 py-4 shadow-xl border border-white/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-sans font-bold text-charcoal tracking-wide">Bespoke Fit</p>
                    <p className="text-[10px] font-sans text-muted">Tailored to your mattress depth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating detail photo */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 w-28 h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-float">
              <img
                src="/images/products/stripe-room.jpg"
                alt="Close-up bedding texture"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text/Details Column */}
          <div className="reveal order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-glow-pulse" />
              <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-charcoal/60">
                Bespoke Fitting
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.15] mb-6">
              Bespoke Bedding,
              <span className="block text-gold mt-1">Tailored for Your Bed.</span>
            </h2>

            <p className="text-sm lg:text-base font-sans text-charcoal/75 leading-relaxed mb-8 max-w-lg font-light">
              No more struggling with sheets that slip off or duvets that drag on the floor. 
              We handcraft every bedding set to your exact mattress size, including deep pillow-tops and custom depths. Perfect sheets, made just for you.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              {[
                {
                  title: 'Precise Dimension Matching',
                  desc: 'Provide your mattress width, length, and depth. We stitch corners and borders to wrap around your mattress perfectly.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2v20" />
                    </svg>
                  ),
                },
                {
                  title: 'Hotel-Grade Materials',
                  desc: 'Crafted with 100% long-staple cotton in a luxurious 300-thread-count sateen weave for supreme breathability.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
                {
                  title: 'WhatsApp Ordering Consultation',
                  desc: 'Build your collection, estimate your sizes, and chat directly with our specialist to confirm your mattress height and customization requirements.',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-charcoal text-white flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-charcoal uppercase tracking-wider mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-sans text-muted leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" href="/collections">
              Explore Collections
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
