import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Care Guide | ${SITE_NAME}`,
  description: 'How to clean, dry, iron, and extend the lifespan of your custom-tailored cotton bedding.',
};

export default function CareGuidePage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-sans text-charcoal">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5 block">
            Fabric Maintenance
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Bedding Care Guide
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mb-8" />
          <p className="text-sm lg:text-base text-muted font-light leading-relaxed max-w-lg mx-auto">
            Your customized bedding is crafted from 100% premium long-staple cotton. Follow this guide to preserve its signature softness, colors, and longevity.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-12 text-sm lg:text-base font-light leading-relaxed text-charcoal/80">
          
          {/* Washing Section */}
          <section className="bg-white border border-border/40 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-serif text-sm">1</span>
              Washing Your Bedding
            </h2>
            <div className="h-px bg-border/40 my-1" />
            <p>
              We recommend washing your sheets and duvet covers every 7–10 days. Always wash bedding sets separately from towels, jeans, or items with zippers or velcro to prevent friction and pilling.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Temperature:</strong> Wash in cool or lukewarm water (maximum 30°C / 85°F). Cool water protects the cotton fibers and preserves the pattern colors.</li>
              <li><strong>Cycle:</strong> Select a gentle, delicate, or medium cycle. Avoid heavy-duty agitation.</li>
              <li><strong>Detergent:</strong> Use a mild, pH-neutral liquid detergent. Avoid harsh powder detergents, chlorine bleaches, and fabric softeners, which coat the cotton fibers and reduce absorbency.</li>
            </ul>
          </section>

          {/* Drying Section */}
          <section className="bg-white border border-border/40 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-serif text-sm">2</span>
              Drying Recommendations
            </h2>
            <div className="h-px bg-border/40 my-1" />
            <p>
              Line drying is the absolute best way to maintain the crispness and integrity of long-staple cotton sateen. It reduces shrinkage and prevents fabric fatigue.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Line Drying (Recommended):</strong> Hang sheets flat in a shaded outdoor spot or well-ventilated indoor rack. Avoid direct, intense sunlight to prevent fading.</li>
              <li><strong>Tumble Drying:</strong> If using a dryer, select a low-heat, delicate setting. Remove the sheets immediately when the cycle ends while they are still slightly damp to reduce wrinkles.</li>
              <li><strong>Avoid High Heat:</strong> Never dry cotton bedding on high heat, as it bakes the fibers, causing them to shrink, weaken, and become brittle.</li>
            </ul>
          </section>

          {/* Ironing Section */}
          <section className="bg-white border border-border/40 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-serif text-sm">3</span>
              Ironing & Wrinkle Removal
            </h2>
            <div className="h-px bg-border/40 my-1" />
            <p>
              As we do not coat our 100% natural cotton sheets in artificial wrinkle-free chemicals (which wash out and irritate skin), they will wrinkle slightly after drying.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Ironing Setting:</strong> Iron on a warm-to-hot cotton setting. For best results, iron the bedding while it is still slightly damp.</li>
              <li><strong>Steam:</strong> Use the steam setting on your iron to smooth out deep creases easily.</li>
              <li><strong>Alternative:</strong> If you do not wish to iron, simply smooth the sheets flat by hand as you pull them from the dryer, and lay them directly onto the bed. The wrinkles will naturally release within a day of use.</li>
            </ul>
          </section>

          {/* Storage Section */}
          <section className="bg-white border border-border/40 p-8 rounded-2xl shadow-sm flex flex-col gap-4">
            <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-serif text-sm">4</span>
              Storing Bedding properly
            </h2>
            <div className="h-px bg-border/40 my-1" />
            <p>
              Always make sure your cotton bedding is completely dry before storing to prevent mildew. Store your sheets in a cool, dry, well-ventilated wardrobe or drawer.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Avoid Plastic Bags:</strong> Avoid storing natural cotton bedding in plastic boxes or vacuum bags, as plastic traps moisture, prevents air circulation, and can yellow the fabric.</li>
              <li><strong>Natural Packaging:</strong> Store bedding sets in their original cotton fabric bag (which we provide) or in folded stacks.</li>
              <li><strong>Scent:</strong> Toss a sachet of dried lavender or cedar blocks into the closet to keep them smelling fresh.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
