import React from 'react';

export default function PricingPageSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">Pricing</div>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">Learn for free. Upgrade when you want unlimited progress.</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Start with real value, then unlock the full experience when you’re ready to move faster.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Free</div>
          <div className="mt-2 text-4xl font-bold text-slate-900">$0</div>
          <p className="mt-4 text-slate-600">A generous starting point for exploring the app and building a real beginner foundation.</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            <li>Full A1 access</li>
            <li>Placement test A1–C2</li>
            <li>A2+ preview lessons</li>
            <li>Energy system for A2+ progression</li>
            <li>Limited AI support</li>
            <li>Ads available for energy refills</li>
          </ul>
          <button className="mt-8 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">Start Free</button>
        </div>

        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <div className="text-sm font-semibold uppercase tracking-wide text-orange-300">Pro</div>
          <div className="mt-2 text-4xl font-bold">$6.99<span className="text-lg font-medium text-slate-300">/month</span></div>
          <div className="mt-1 text-sm text-slate-300">$69.99/year</div>
          <p className="mt-4 text-slate-300">Built for learners who want momentum, personalization, and no limits.</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li>Full A1–C2 access</li>
            <li>No energy limits</li>
            <li>Unlimited AI tutor</li>
            <li>Speaking simulations and corrections</li>
            <li>Practice based on mistakes</li>
            <li>No ads</li>
          </ul>
          <button className="mt-8 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white">Go Pro</button>
        </div>
      </div>
    </section>
  );
}
