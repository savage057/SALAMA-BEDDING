import { WHATSAPP_NUMBER } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function WhatsAppCTA() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/3 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-gold/8 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* WhatsApp Icon */}
          <div className="reveal inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 border border-white/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>

          <h2 className="reveal font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6">
            Ready to Order?
            <span className="block text-gold mt-2">Let&apos;s Chat.</span>
          </h2>

          <p className="reveal text-base lg:text-lg font-sans text-white/50 leading-relaxed mb-10 max-w-lg mx-auto">
            Browse our collections, build your cart, and complete your order via WhatsApp. 
            Personal service, no complicated checkout — just direct conversation with our team.
          </p>

          <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="gold"
              size="lg"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20SALAMA%20Bedding%2C%20I'd%20like%20to%20learn%20more%20about%20your%20products!`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/collections"
              className="!border-white/30 !text-white hover:!bg-white/10"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
