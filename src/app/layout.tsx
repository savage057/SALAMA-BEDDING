import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'SALAMA BEDDING — Luxury Comfort, Tailored for You',
    template: '%s | SALAMA BEDDING',
  },
  description:
    'Discover premium bedding with vibrant, customizable patterns — from elegant florals and geometric designs to playful character prints. Browse our collections and order via WhatsApp.',
  keywords: [
    'luxury bedding',
    'premium bedding Nigeria',
    'duvet covers',
    'comforter sets',
    'bedding patterns',
    'geometric bedding',
    'floral bedding',
    'character print bedding',
    'SALAMA BEDDING',
  ],
  openGraph: {
    title: 'SALAMA BEDDING — Luxury Comfort, Tailored for You',
    description:
      'Premium bedding with vibrant, customizable patterns. Browse our collections and order via WhatsApp.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'SALAMA BEDDING',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SALAMA BEDDING — Luxury Comfort, Tailored for You',
    description:
      'Premium bedding with vibrant, customizable patterns. Browse our collections and order via WhatsApp.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-charcoal">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
