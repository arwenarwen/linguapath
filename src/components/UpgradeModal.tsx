import React from 'react';

type Props = {
  open: boolean;
  title?: string;
  body?: string;
  waitTimeLabel?: string;
  onClose: () => void;
  onWatchAd: () => void;
  onGoPro: () => void;
};

export default function UpgradeModal({
  open,
  title = 'You’re on a roll',
  body = 'You’ve completed today’s learning session. Keep going with one more lesson, wait for energy to refill, or unlock Pro for unlimited progress.',
  waitTimeLabel = '1h 40m',
  onClose,
  onWatchAd,
  onGoPro,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-700">Energy depleted</div>
        <h3 className="text-3xl font-bold text-slate-900">{title}</h3>
        <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>

        <div className="mt-8 space-y-3">
          <button onClick={onWatchAd} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left">
            <div className="font-semibold text-slate-900">Watch ad</div>
            <div className="text-sm text-slate-600">Get +20 energy and do one more lesson.</div>
          </button>

          <div className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left">
            <div className="font-semibold text-slate-900">Wait for refill</div>
            <div className="text-sm text-slate-600">Next energy available in {waitTimeLabel}.</div>
          </div>

          <button onClick={onGoPro} className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-left text-white">
            <div className="font-semibold">Go Pro</div>
            <div className="text-sm text-slate-300">Unlimited lessons, unlimited AI, no energy limits.</div>
          </button>
        </div>

        <button onClick={onClose} className="mt-6 text-sm font-semibold text-slate-500">
          Close
        </button>
      </div>
    </div>
  );
}
