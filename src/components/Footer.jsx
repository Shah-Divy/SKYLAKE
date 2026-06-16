import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Youtube, Facebook, Instagram, PhoneCall } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, url: 'https://linkedin.com' },
    { name: 'YouTube', icon: <Youtube className="w-4 h-4" />, url: 'https://youtube.com' },
    { name: 'Facebook', icon: <Facebook className="w-4 h-4" />, url: 'https://facebook.com' },
    { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, url: 'https://instagram.com' },
    { name: 'WhatsApp', icon: <PhoneCall className="w-4 h-4" />, url: 'https://wa.me/919999999999' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-900">
          
          {/* Column 1: Company Profile Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={encodeURI('/3ARK logo.png')} alt="3ARK" className="w-30 h-30 object-contain" />
              <span className="font-display font-bold text-lg tracking-tight text-white">
                3ARK
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              Authorized industrial systems integrator and engineering consultants. Providing premium automation, motion controllers, switchgears, and process analytics.
            </p>
            {/* Social media icons */}
            {/* <div className="flex gap-2">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 bg-slate-900 hover:bg-brand-teal hover:text-slate-950 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Corporate Info
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-brand-teal transition-colors">
                  Company Profile & Profile
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-brand-teal transition-colors">
                  Partner Brands
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-brand-teal transition-colors">
                  Technical Download Center
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-brand-teal transition-colors">
                  Company News Releases
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-teal transition-colors">
                  Expert Insights Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions Range */}
          {/* <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Systems Catalog
            </h4>
            <ul className="space-y-2.5 text-xs">
              {mockCategories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-brand-teal transition-colors block truncate"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase">
              Headquarters
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  601-Kohinoor Bussiness Hub, Near Ranasan Toll Plaza, S P Ring Road, Naroda GIDC, Ahmedabad, Gujarat - 382330, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-teal shrink-0" />
                <span>+91 98986-00605</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href="mailto:info@3ark.in" className="hover:text-brand-teal transition-colors">
                  info@3ark.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright / policy links */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} 3ARK Private Limited. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/shipping-policy" className="hover:text-brand-teal transition-colors">
              Shipping & Delivery Policy
            </Link>
            <Link to="/refund-policy" className="hover:text-brand-teal transition-colors">
              Refunds & Cancellation Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
