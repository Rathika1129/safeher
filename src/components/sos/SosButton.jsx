import React from 'react';
import { AlertCircle, ShieldAlert, Radio } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function SosButton({ onOpenModal }) {
  const { activeSOS, triggerSOS } = useSafety();

  const isTriggered = activeSOS && (activeSOS.status === 'ACTIVE' || activeSOS.status === 'COUNTDOWN');

  const handleClick = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      triggerSOS();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Outer Glow & Ripple Container */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Ripple Rings */}
        <div className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-red-500/20 ${isTriggered ? 'animate-ping' : 'animate-pulse'}`} />
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-red-600/25 animate-ping-slow" />

        {/* Primary Interactive SOS Button */}
        <button
          id="btn-sos-trigger"
          type="button"
          onClick={handleClick}
          className={`relative z-20 flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 rounded-full text-white font-extrabold shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-4 ${
            isTriggered
              ? 'bg-gradient-to-tr from-red-700 via-rose-600 to-red-500 shadow-glow-sos animate-pulse-fast ring-4 ring-red-400'
              : 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 hover:from-red-700 hover:to-rose-600 hover:shadow-glow-sos hover:scale-105'
          }`}
          aria-label="Trigger Emergency SOS Alert"
        >
          {isTriggered ? (
            <ShieldAlert className="w-12 h-12 sm:w-14 sm:h-14 mb-1 animate-bounce text-white drop-shadow-md" />
          ) : (
            <Radio className="w-12 h-12 sm:w-14 sm:h-14 mb-1 text-white drop-shadow-md" />
          )}
          
          <span className="text-2xl sm:text-3xl tracking-wider font-black drop-shadow-md">
            {isTriggered ? 'ALERTING' : 'SOS'}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-red-100 mt-0.5">
            {isTriggered ? 'TAP TO RESOLVE' : 'TAP FOR HELP'}
          </span>
        </button>
      </div>

      {/* Helper Guidance */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-slate-600 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-rose-500 inline-block" />
          <span>Pressing SOS shares your location & notifies your trusted circle.</span>
        </p>
        <span className="text-xs text-slate-400 mt-0.5 block">
          Includes a 5-second countdown to cancel accidental false alarms.
        </span>
      </div>
    </div>
  );
}
