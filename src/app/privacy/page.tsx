import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Learn how ${SITE_NAME} collects, stores, protects, and manages your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-sans text-charcoal">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5 block">
            Legal Statement
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-[2px] bg-gold mb-8" />
          <p className="text-xs font-sans text-muted tracking-wide">
            Last Updated: July 1, 2026
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 text-sm lg:text-base font-light leading-relaxed text-charcoal/80">
          
          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">1. Introduction</h2>
            <p>
              At <strong>{SITE_NAME}</strong>, we are committed to protecting the privacy of our customers and website visitors. This Privacy Policy details how we collect, use, store, and safeguard your personal information when you visit our website, select products, and interact with us for custom sizing orders via WhatsApp.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">2. Information We Collect</h2>
            <p>
              Because we operate on a bespoke, made-to-order basis and execute checkout confirmations directly through WhatsApp, we collect information across these channels:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Contact Information:</strong> Your name, phone number (WhatsApp-reachable), and shipping/delivery address, which you provide when placing custom orders.</li>
              <li><strong>Order Configurations:</strong> Details of your mattress sizes (width, length, depth), chosen colorways, and bedding styles (duvet covers, bedsheets, or both).</li>
              <li><strong>Communication Records:</strong> Texts, messages, and order history sent to our design coordinator via the WhatsApp checkout channel.</li>
              <li><strong>Technical Data:</strong> IP addresses, browser types, device information, and interaction records on our website (gathered via cookies or analytics).</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">3. How We Use Your Information</h2>
            <p>
              Your data is processed to ensure a tailored customer experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To consult on your custom bedding sizing requirements and finalize order handshakes via WhatsApp.</li>
              <li>To manufacture, package, and ship your made-to-order bedding products to your delivery address.</li>
              <li>To address customer support queries, reviews, and feedback.</li>
              <li>To maintain website performance, run safety updates, and prevent fraudulent activity.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">4. Data Sharing and Third Parties</h2>
            <p>
              We value your trust and never sell your personal information. We only share essential details with third parties under these circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>WhatsApp Integration:</strong> When you click the checkout button, your cart detail summary is compiled into a text string and sent to WhatsApp Inc. to facilitate direct ordering.</li>
              <li><strong>Delivery Services:</strong> Shipping address details are shared with verified logistics partners to fulfill your deliveries.</li>
              <li><strong>Database Hosting:</strong> Website data, inventory, reviews, and logged metrics are securely hosted on Supabase DB platforms.</li>
              <li><strong>Compliance with Law:</strong> We may share data if required to meet legal obligations or protect safety and property.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">5. Data Retention and Security</h2>
            <p>
              We retain your contact details and custom sizing metrics in our database as long as needed to fulfill your orders, provide support, or comply with financial bookkeeping. We implement industry-standard secure socket layers (SSL) and supabsase row-level-security (RLS) policies to safeguard database interactions against unauthorized access.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">6. Cookies and Tracking</h2>
            <p>
              Our website uses cookies to store items in your cart and favorites list locally in your browser. You can configure your browser to reject cookies, though doing so may disable cart storage and favorites persistence.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">7. Your Privacy Rights</h2>
            <p>
              You have the right to request access to the personal information we hold about you, request corrections to your delivery details, or ask us to delete your order history from our records. To exercise these rights, please contact our support team via WhatsApp.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">8. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our services or regulatory updates. We encourage you to review this page periodically to stay informed about how we safeguard your information.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
