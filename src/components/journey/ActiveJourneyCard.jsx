import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  X, 
  AlertTriangle, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { formatSecondsToTimer } from '../../utils/formatters';

export default function ActiveJourneyCard({ onOpenNewJourney }) {
  const { activeJourney, markSafe, extendJourney, cancelJourney } = useSafety();

  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [graceSecondsRemaining, setGraceSecondsRemaining] = useState(0);
  const [percentElapsed, setPercentElapsed] = useState(0);

  // Recalculate remaining seconds against expiresAt
  useEffect(() => {
    if (!activeJourney) return;

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = activeJourney.expiresAt - now;
      const secs = Math.max(0, Math.floor(diffMs / 1000));
      setSecondsRemaining(secs);

      // Total journey time
      const totalDurationSecs = (activeJourney.durationMinutes || 30) * 60;
      const elapsedSecs = totalDurationSecs - secs;
      const pct = Math.min(100, Math.max(0, (elapsedSecs / totalDurationSecs) * 100));
      setPercentElapsed(pct);

      // If overdue, calculate grace remaining
      if (diffMs <= 0) {
        const graceTotalSecs = (activeJourney.graceMinutes || 5) * 60;
        const graceMs = (activeJourney.expiresAt + (graceTotalSecs * 1000)) - now;
        setGraceSecondsRemaining(Math.max(0, Math.floor(graceMs / 1000)));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeJourney]);

  if (!activeJourney) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-soft text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
          <Navigation className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">
            No Active Journey Timer
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Heading home, to college, or taking a cab? Start a safe journey timer so your trusted circle is notified if you are overdue.
          </p>
        </div>
        <button
          id="btn-start-journey"
          type="button"
          onClick={onOpenNewJourney}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md shadow-purple-100 transition-all hover:scale-105"
        >
          <Navigation className="w-4 h-4" />
          Start Safe Journey Timer
        </button>
      </div>
    );
  }

  const isOverdue = secondsRemaining === 0 || activeJourney.status === 'OVERDUE';

  return (
    <div className={`rounded-2xl p-6 border transition-all duration-300 shadow-soft ${
      isOverdue 
        ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400' 
        : 'bg-white border-purple-100'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              isOverdue 
                ? 'bg-amber-200 text-amber-900 animate-pulse' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isOverdue ? 'bg-amber-600' : 'bg-purple-600'} animate-ping`} />
              {isOverdue ? 'JOURNEY OVERDUE' : 'ACTIVE JOURNEY'}
            </span>
            <span className="text-xs text-slate-400">
              Grace window: {activeJourney.graceMinutes}m
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            {activeJourney.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>To: <strong>{activeJourney.destination}</strong></span>
          </div>
        </div>

        {/* Live Big Timer */}
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            {isOverdue ? 'Grace Remaining' : 'Time Remaining'}
          </div>
          <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
            isOverdue ? 'text-amber-600 animate-pulse' : 'text-purple-700'
          }`}>
            {isOverdue ? formatSecondsToTimer(graceSecondsRemaining) : formatSecondsToTimer(secondsRemaining)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 space-y-1">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isOverdue ? 'bg-amber-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${percentElapsed}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Started at {new Date(activeJourney.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>Target: {activeJourney.durationMinutes} mins total</span>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {isOverdue && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Overdue Journey Check-in Required!</span>
          </div>
          <p>
            Please confirm your safety immediately. If the grace period expires without check-in, an emergency alert will be dispatched to your trusted contacts.
          </p>
        </div>
      )}

      {/* Contacts notified info */}
      {activeJourney.selectedContacts?.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>Monitoring contacts: </span>
          <span className="font-medium text-slate-700">
            {activeJourney.selectedContacts.map(c => c.name || c).join(', ')}
          </span>
        </div>
      )}

      {/* Action Controls */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            id="btn-journey-safe"
            type="button"
            onClick={() => markSafe('Reached destination safely via Journey Timer')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            I'm Safe (Complete Journey)
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => extendJourney(15)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Extend +15m
          </button>
          <button
            type="button"
            onClick={() => cancelJourney()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
