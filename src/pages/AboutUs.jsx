import React, { useState, useEffect } from 'react';
import { Target, Eye, ShieldCheck, Factory, Award, Users, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { companyProfileService } from '../services/companyProfileService';

export default function AboutUs() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await companyProfileService.get();
        if (response.success && response.data) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Error fetching company profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Only display data returned from the API (company_profile, mission, vision, achievements)

  return (
    <main className="w-full pt-20">
      
      {/* Banner Title Header */}
      <section className="relative bg-slate-950 py-24 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 z-10">
          <span className="text-[20px] font-bold text-brand-teal tracking-widest uppercase">
            About 3Ark
          </span>
          {/* <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-none text-glow-teal">
            {profile?.company_profile || profile?.companyProfile || ''}
          </h1> */}
          {/* <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {profile?.mission || ''}
          </p> */}
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
                Corporate Profile & Heritage
              </h2>
              <div 
                className="text-xs text-slate-500 leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: profile?.company_profile || profile?.companyProfile || '' }}
              />
              
            </div>

            {/* Visual illustration image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-orange/5 rounded-3xl rotate-2" />
              <div className="relative bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-sm aspect-video md:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800"
                  alt="Quality assurance verification"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-24 bg-brand-slate-light border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border bg-white shadow-sm flex flex-col items-start gap-4">
              <h3 className="font-display font-extrabold text-lg text-slate-900">Mission</h3>
              <div 
                className="text-xs text-slate-500 leading-relaxed rich-text-content w-full text-left"
                dangerouslySetInnerHTML={{ __html: profile?.mission || '' }}
              />
            </div>
            <div className="p-8 rounded-2xl border bg-white shadow-sm flex flex-col items-start gap-4">
              <h3 className="font-display font-extrabold text-lg text-slate-900">Vision</h3>
              <div 
                className="text-xs text-slate-500 leading-relaxed rich-text-content w-full text-left"
                dangerouslySetInnerHTML={{ __html: profile?.vision || '' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display font-extrabold text-lg text-slate-900 mb-6">Milestones</h3>

          {Array.isArray(profile?.achievements) && profile.achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl border bg-brand-slate-light text-xs text-slate-700">
                  {m}
                </div>
              ))}
            </div>
          ) : (profile?.achievements || profile?.achievement) ? (
            <div 
              className="text-xs text-slate-500 leading-relaxed rich-text-content"
              dangerouslySetInnerHTML={{ __html: profile?.achievements || profile?.achievement }}
            />
          ) : (
            <p className="text-xs text-slate-500">No achievements available.</p>
          )}
        </div>
      </section>

    </main>
  );
}
