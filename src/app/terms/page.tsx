import { SITE_NAME } from '@/lib/constants';

export const metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Read the Terms of Service for ${SITE_NAME} regarding custom bedding tailoring and WhatsApp ordering.`,
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 font-sans text-charcoal">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="font-serif text-xs font-bold uppercase tracking-widest text-gold mb-3.5 block">
            Agreement & Policy
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Terms of Service
          </h1>
          <div className="w-16 h-[2px] bg-gold mb-8" />
          <p className="text-xs font-sans text-muted tracking-wide">
            Last Updated: July 1, 2026
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 text-sm lg:text-base font-light leading-relaxed text-charcoal/80">
          
          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">1. Acceptance of Terms</h2>
            <p>
              By accessing our website and utilizing our custom-ordering platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">2. Bespoke Tailoring & Sizing Specifications</h2>
            <p>
              Because <strong>{SITE_NAME}</strong> specializes in custom, made-to-order bedding, please note:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Measurement Accuracy:</strong> The customer is solely responsible for providing accurate mattress dimensions (width, length, and depth/height) during the WhatsApp order consultation. We are not liable for bedding sets that do not fit due to incorrect measurements provided by the customer.</li>
              <li><strong>Product Type Inclusions:</strong> Please refer to the product tags in the catalog. Bedding sets marked as "Bedsheet" or "Duvet & Bedsheet" come with bedsheets included. Sets marked as "Duvet Only" do not include fitted or flat bedsheets.</li>
              <li><strong>Handcrafted Tolerances:</strong> Because our bedding is individually stitched to order, slight variations in color, pattern alignment, or dimensions (within a 1cm tolerance) may occur.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">3. WhatsApp ordering & Handshake</h2>
            <p>
              Our website checkout serves as an order estimator:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Adding items to your cart and clicking "Order via WhatsApp" generates a details summary that is forwarded to our team.</li>
              <li>No contract or sales agreement is finalized until our coordinator confirms stock availability, custom dimensions, shipping fees, and receives payment confirmation from you.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">4. Payments & Invoicing</h2>
            <p>
              Prices listed on the website are base estimates and may carry modifiers based on selected sizes (e.g. King size adjustments). Final invoices including local shipping charges are issued during your WhatsApp chat. Payment instructions (such as direct bank transfers) will be shared during consultation. Production begins only after payment is cleared.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">5. Returns, Cancellations, and Refunds</h2>
            <p>
              Our refund policy is strictly shaped by the custom nature of our products:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Custom-Made Items:</strong> Bedding sets constructed to custom sizes or specific height dimensions are non-refundable and cannot be returned or exchanged unless they suffer from manufacturing defects (e.g. loose seams, incorrect print) or sizing discrepancy relative to the agreed invoice measurements.</li>
              <li><strong>Cancellations:</strong> You may cancel or modify an order within 12 hours of payment confirmation. After 12 hours, fabric cutting and tailoring starts, and cancellation is no longer possible.</li>
              <li><strong>Defective Items:</strong> If you receive a damaged or defectively stitched item, please notify us within 48 hours of delivery with photos of the defect, and we will tailor a replacement set for you.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">6. Shipping and Delivery</h2>
            <p>
              Custom tailoring takes time. Standard tailoring and processing takes approximately 5–10 business days before shipping, depending on current order queue volumes. Shipping durations vary by location and will be estimated during checkout consultation. We are not liable for transit delays caused by third-party logistics companies.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-serif text-xl font-bold text-charcoal">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Any updates will be published directly on this page, and your continued use of our website or services constitutes acceptance of the new terms.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
