import React from 'react';
import { CheckCircle2, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import CheckInCard from '../components/checkin/CheckInCard';

export default function CheckInPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Smart Check-In
          </span>
          <span className="text-xs text-slate-400">
            Reassure Your Loved Ones
          </span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Safety Checkpoints & Status Updates
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
          Quickly notify your trusted contacts that you have arrived safely, ping family members for their status, and log checkpoints throughout your daily commute.
        </p>
      </div>

      {/* Main CheckIn Component */}
      <CheckInCard />
    </div>
  );
}
