import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { formatDateTime } from '../../utils/formatters';

export default function CheckInCard() {
  const { 
    checkIns, 
    performCheckIn, 
    requestContactCheckIn, 
    contacts, 
    activeJourney,
    markSafe,
    currentLocation
  } = useSafety();

  const [customNote, setCustomNote] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  const handleQuickSafe = () => {
    performCheckIn(customNote || "I'm Safe and reached my location smoothly.");
    setCustomNote('');
    setShowSuccessNotice(true);
    setTimeout(() => setShowSuccessNotice(false), 4000);
  };

  const handleRequestCheckIn = (e) => {
    e.preventDefault();
    if (!selectedContactId) return;
    requestContactCheckIn(selectedContactId);
    setSelectedContactId('');
  };

  return (
    <div className="space-y-6">
      {/* Quick I'm Safe Banner */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md">
              Instant Peace of Mind
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black">
              Check in as Safe
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md">
              Sends an immediate status update to your safety circle with your current timestamp and verified checkpoint.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="text"
              placeholder="Add optional note (e.g. Reached hostel room safely)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              id="btn-instant-safe"
              type="button"
              onClick={handleQuickSafe}
              className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-extrabold text-sm hover:bg-emerald-50 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              I'm Safe Now
            </button>
          </div>

          {showSuccessNotice && (
            <div className="p-3 bg-emerald-500/40 border border-emerald-300 rounded-xl text-xs text-white flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Safe check-in recorded and logged to your safety timeline!</span>
            </div>
          )}
        </div>
      </div>

      {/* Active Journey Check-in link if active */}
      {activeJourney && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-purple-950 text-sm">
                Active Journey: {activeJourney.name}
              </h4>
              <p className="text-xs text-purple-700">
                You can complete this journey right now with an "I'm Safe" check-in.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => markSafe('Journey completed safely via Smart Check-in')}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            Complete Journey
          </button>
        </div>
      )}

      {/* Request Check-in from Contact */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Request Check-in from Contact
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Ping a family member or friend to check their safety status.
            </p>
          </div>
        </div>

        <form onSubmit={handleRequestCheckIn} className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedContactId}
            onChange={(e) => setSelectedContactId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">Select a trusted contact...</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.relationship}) - {c.phone}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedContactId}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Ping
          </button>
        </form>
      </div>

      {/* Timeline of Check-ins */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          Recent Check-In Timeline
        </h4>

        <div className="space-y-3">
          {checkIns.map((item) => (
            <div 
              key={item.id} 
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    item.type === 'REQUEST' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.type === 'REQUEST' ? 'Ping Request' : 'Safe Confirmation'}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">
                  {item.note}
                </p>
                {item.location && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  item.status === 'CONFIRMED' || item.status === 'ACKNOWLEDGED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800 animate-pulse'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
