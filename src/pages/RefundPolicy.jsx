import React from 'react';

export default function RefundPolicy() {
  return (
    <main className="w-full pt-20">
      
      {/* Header banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Refunds & Return Policy
          </h1>
          <p className="text-xs text-slate-400">
            Understand return windows, warranty rules, restocking fees, and custom cabinet limitations.
          </p>
        </div>
      </section>

      {/* Main policy body text */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-xs text-slate-600 leading-relaxed space-y-6">
          
          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">1. Return Window</h3>
            <p>
              Standard, unaltered catalog products (e.g., unopened Siemens or Allen-Bradley modules in original manufacturer packaging with factory seals intact) can be returned within 10 days of delivery for a product exchange or credit note.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">2. Exclusions & Custom Work</h3>
            <p>
              We cannot accept returns, provide refunds, or cancel orders for customized switchgear panels, motor control centers (MCC), programmed software databases, and components that have been mounted, wired, programmed, or powered up. These sales are final and covered exclusively by standard manufacturer warranty agreements.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">3. Restocking Charges</h3>
            <p>
              Approved returns of standard catalog parts are subject to a 15% restocking fee. This covers quality assurance inspection, ESD testing, and repackaging to verify the item is in pristine condition for future system deployment.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">4. Warranty Claims</h3>
            <p>
              All products carry a minimum 12-month standard manufacturer warranty from the date of dispatch. If a component experiences internal hardware failure or processor bricking during standard operation, please submit a diagnostic report along with our warranty claim form. We will coordinate directly with the manufacturer to facilitate evaluation, repair, or unit replacement.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">5. Return Shipping Procedure</h3>
            <p>
              To return an eligible catalog product, you must obtain a Return Material Authorization (RMA) code. Please contact your dedicated account manager or email <a href="mailto:support@skylakeautomation.com" className="text-brand-teal font-bold hover:underline">support@skylakeautomation.com</a>. Packages sent without an RMA code will be rejected at our warehouse gates. Return freight charges must be pre-paid by the buyer.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
