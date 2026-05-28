import React from 'react';

export default function ShippingPolicy() {
  return (
    <main className="w-full pt-20">
      
      {/* Header banner */}
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            Shipping & Dispatch Policy
          </h1>
          <p className="text-xs text-slate-400">
            Learn about packaging codes, freight calculations, and transit damage procedures.
          </p>
        </div>
      </section>

      {/* Main policy body text */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-xs text-slate-600 leading-relaxed space-y-6">
          
          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">1. Order Dispatch Timelines</h3>
            <p>
              All standard catalog orders (PLCs, HMIs, drives, and sensors) are dispatched within 24 to 48 hours, provided the items are indicated in stock at our Pune or Bangalore fulfillment hubs. Customized panel builds, MCC centers, and custom engineered cabinets will follow the milestones stipulated in the official engineering draft quote.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">2. Logistics & Carrier Integration</h3>
            <p>
              We collaborate with premium national logistics partners including Blue Dart, TCI Express, and DHL Express to ensure safe, traceable transport of sensitive electronic modules. Tracking registers are sent automatically via email and WhatsApp upon carrier pick-up.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">3. Freight Calculations & Duties</h3>
            <p>
              Freight fees are calculated at checkout based on weight, dimensions, and geographic location. For commercial quotes processed outside the online cart, freight tariffs will be explicitly line-itemed on the Proforma Invoice. All local taxes, octane levies, and road entry permits (where applicable) are the buyer’s responsibility.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">4. Packaging Security</h3>
            <p>
              Sensitive electronic modules are wrapped in high-grade ESD anti-static packaging bags, bubble-wrapped, and packed in reinforced double-walled corrugated fiberboard containers. Robotics cells and heavy variable drives are secured inside custom-built heat-treated wooden crates conforming to ISPM 15 standards.
            </p>
          </div>

          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-sm mb-3">5. Transit Damage & Discrepancies</h3>
            <p>
              All shipments are fully insured against transit theft, loss, and physical breakage. Buyers must inspect the package container exterior upon delivery. If visible signs of tampering or severe cardboard collapse are present, please follow these guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Record the delivery receipt containing a descriptive warning tag (e.g., "Received box torn/damaged").</li>
              <li>Capture high-resolution photographs of the unopened boxes and the component serial numbers.</li>
              <li>Notify our support team within 48 hours of container delivery at <a href="mailto:support@skylakeautomation.com" className="text-brand-teal font-bold hover:underline">support@skylakeautomation.com</a> to initiate an insurance assessment and secure replacement components.</li>
            </ul>
          </div>

        </div>
      </section>

    </main>
  );
}
