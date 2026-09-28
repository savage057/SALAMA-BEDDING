import { SITE_NAME, NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer">
              {/* Luxury Minimalist Icon */}
              <div className="relative w-9 h-9 rounded-xl bg-white/10 group-hover:bg-gold flex items-center justify-center transition-all duration-500 shadow-md">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-500 group-hover:rotate-180"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="font-serif text-xl lg:text-2xl font-bold tracking-[0.06em] text-white group-hover:text-gold transition-colors duration-300">
                  SALAMA
                </span>
                <span className="text-[8px] font-sans font-bold uppercase tracking-[0.32em] text-gold pl-[1px]">
                  BEDDING
                </span>
              </div>
            </div>
            <p className="text-white/60 font-sans text-sm leading-relaxed max-w-md mb-8">
              Discover premium bedding with vibrant, customizable patterns. 
              From elegant florals and bold geometrics to playful character prints — 
              luxury comfort tailored for every room and every style.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Navigate
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-sans text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="/care" className="text-sm font-sans text-white/60 hover:text-white transition-colors duration-300">
                  Care Guide
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-white/60 hover:text-white transition-colors duration-300"
                >
                  Contact via WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-white/40 font-sans">
              © {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <a
              href="/admin"
              title="Admin Panel"
              className="w-[15px] h-[15px] bg-[#C0C0C0] rotate-45 hover:bg-white hover:scale-110 transition-all duration-300 rounded-[2px]"
              aria-label="Admin Dashboard"
            />
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs text-white/40 hover:text-white/60 font-sans transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/terms" className="text-xs text-white/40 hover:text-white/60 font-sans transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
