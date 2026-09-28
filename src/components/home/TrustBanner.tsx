export default function TrustBanner() {
  const stats = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      value: 'Premium',
      label: 'Quality Fabrics',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
          <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1" />
        </svg>
      ),
      value: '50+',
      label: 'Unique Patterns',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      value: 'Nationwide',
      label: 'Delivery Across Nigeria',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      value: '100%',
      label: 'Satisfaction Guaranteed',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-y border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="reveal text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface text-charcoal mb-4 group-hover:bg-charcoal group-hover:text-white transition-all duration-500">
                {stat.icon}
              </div>
              <div className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-sans uppercase tracking-[0.15em] text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
