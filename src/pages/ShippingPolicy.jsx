import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ShippingPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/policies/shipping');
        if (res.data && res.data.success && res.data.data) {
          setPolicy(res.data.data);
        } else {
          setPolicy(null);
        }
      } catch (err) {
        console.error('Error fetching shipping policy:', err);
        setPolicy(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <main className="w-full pt-20">
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-4">Loading policy...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="w-full pt-20">
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-display font-bold text-slate-900">Shipping Policy Not Available</h3>
            <p className="text-xs text-slate-500 mt-2">We couldn't retrieve the shipping policy at this time.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full pt-20">
      <section className="bg-slate-950 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white tracking-tight">
            {policy.title}
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-xs text-slate-600 leading-relaxed space-y-6">
          <div>
            <div dangerouslySetInnerHTML={{ __html: policy.content }} />
          </div>
        </div>
      </section>
    </main>
  );
}
