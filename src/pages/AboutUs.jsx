import React from 'react';
import { Target, Eye, ShieldCheck, Factory, Award, Users, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const coreValues = [
    {
      title: 'Our Mission',
      desc: 'To deliver high-precision industrial automation systems and premium electronic components, enabling manufacturing operations to maximize cycle performance and ensure absolute operator safety.',
      icon: <Target className="w-6 h-6 text-brand-teal" />,
      bg: 'bg-brand-teal/5 border-brand-teal/15',
    },
    {
      title: 'Our Vision',
      desc: 'To become India’s premier industrial automation provider and distributor, bridging the gap between legacy machinery and high-speed IIoT integrated smart factory architectures.',
      icon: <Eye className="w-6 h-6 text-brand-orange" />,
      bg: 'bg-brand-orange/5 border-brand-orange/15',
    },
  ];

  const strengths = [
    { title: 'Authorized Distribution', desc: 'Direct access to official parts channels from Siemens, Rockwell, ABB, and Fanuc.', icon: <Award className="w-5 h-5" /> },
    { title: 'Certified Engineering Team', desc: 'In-house panel designers and software developers certified in IEC and UL specifications.', icon: <Users className="w-5 h-5" /> },
    { title: 'UL 508A Panel Assembly Shop', desc: 'State-of-the-art facility featuring automatic wiring tools and rigorous visual simulations.', icon: <Factory className="w-5 h-5" /> },
    { title: 'Rapid Technical Dispatch', desc: 'Pre-sales configuration support and dedicated emergency commissioning response.', icon: <Zap className="w-5 h-5" /> },
  ];

  const timeline = [
    { year: '2012', title: 'Company Scaffolding', desc: 'Incorporated as a custom controls consultation shop in Pune, serving regional forging mills.' },
    { year: '2016', title: 'Authorized Siemens Alliance', desc: 'Appointed as an official systems integration partner, expanding PLC catalog assets.' },
    { year: '2019', title: 'Panel Shop Infrastructure Launch', desc: 'Built a 12,000 sq ft dedicated panel manufacturing workshop meeting UL certification codes.' },
    { year: '2022', title: 'IIoT Software Integration Division', desc: 'Launched proprietary SCADA aggregates and custom cloud analytics integration.' },
    { year: '2026', title: 'FANUC Robotics Partnership', desc: 'Formed a strategic collaborative arms alignment to engineer end-of-arm welding tools.' },
  ];

  return (
    <main className="w-full pt-20">
      
      {/* Banner Title Header */}
      <section className="relative bg-slate-950 py-24 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 z-10">
          <span className="text-[10px] font-bold text-brand-teal tracking-widest uppercase">
            About Skylake
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-none text-glow-teal">
            Our Legacy in Controls Engineering
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            From basic relays to multi-axis collaborative robotics, we power the automation engines that drive modern industry.
          </p>
        </div>
      </section>

      {/* Profile Overview */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
                Company Profile
              </span>
              <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight leading-tight">
                Engineering Custom Automation with Global Standards
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Skylake Automation is a trusted partner for industrial manufacturing sites seeking efficiency, precision, and reliable machine safety. We operate as a full-service distributor and controls developer, providing the physical hardware, distributed I/O, software configurations, and live commissioning expertise required for smart factories.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our approach bypasses typical vendor limitations. By leveraging our deep relationships with manufacturers like Rockwell, Siemens, and ABB, we procure parts directly to prevent markup and reduce lead times. Our team builds panels under strict IEC 61439 codes, ensuring they arrive fully simulated, debugged, and ready for power connections.
              </p>

              {/* Checklist details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                {['Direct Manufacturer Warranty', '99.9% Control Reliability', 'IEC 61439 / UL 508A Standards', '24/7 Field Support Available'].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle className="w-4.5 h-4.5 text-brand-teal shrink-0" />
                    {txt}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual illustration image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-orange/5 rounded-3xl rotate-2" />
              <div className="relative bg-slate-950 rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800"
                  alt="Quality assurance verification"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Statements */}
      <section className="py-24 bg-brand-slate-light border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((val, idx) => (
              <div key={idx} className={`p-8 rounded-2xl border ${val.bg} shadow-sm flex flex-col items-start gap-4`}>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {val.icon}
                </div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  {val.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure & Business Strengths */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
              Infrastructure
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight">
              Our Core Technical Strengths
            </h2>
            <p className="text-xs text-slate-500">
              Why leading industrial manufacturing complexes trust Skylake for critical controls deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {strengths.map((str, idx) => (
              <div key={idx} className="bg-brand-slate-light p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors shadow-sm space-y-4">
                <div className="bg-slate-900 text-brand-teal p-3 rounded-xl inline-flex items-center justify-center">
                  {str.icon}
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {str.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {str.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Vertical Corporate Timeline */}
      <section className="py-24 bg-brand-slate-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1.5 rounded-lg border border-brand-teal/20">
              Our History
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-4xl text-slate-900 tracking-tight">
              Company Milestone Timeline
            </h2>
          </div>

          {/* Timeline Nodes */}
          <div className="relative max-w-3xl mx-auto">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row items-stretch gap-8 md:gap-0">
                  
                  {/* Left hand side content (on alternate items for desktop) */}
                  <div className={`w-full md:w-1/2 flex justify-end md:pr-10 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-3 md:text-right'}`}>
                    <div className="pl-12 md:pl-0">
                      <span className="inline-block text-[10px] font-extrabold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-md mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-display font-bold text-sm text-slate-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Node point marker */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1.5 md:-translate-x-1/2 top-0.5 z-10 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-brand-teal flex items-center justify-center md:order-2" />

                  {/* Empty spacer block for desktop grid alignment */}
                  <div className="hidden md:block w-1/2 md:order-3" />

                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
