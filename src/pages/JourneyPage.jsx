import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import ActiveJourneyCard from '../components/journey/ActiveJourneyCard';
import NewJourneyModal from '../components/journey/NewJourneyModal';
import { formatDateTime } from '../utils/formatters';

export default function JourneyPage() {
  const { 
    activeJourney, 
    historyEvents 
  } = useSafety();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const pastJourneys = historyEvents.filter(e => 
    e.eventType === 'SAFE_CHECKIN' || e.eventType === 'JOURNEY_OVERDUE' || e.eventType === 'JOURNEY_CANCELLED'
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              Safe Journey Timer
            </span>
            <span className="text-xs text-slate-400">
              Persistent & Resilient Tracking
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Journey Countdown & Overdue Safeguard
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Going for an evening walk or taking public transit? Set your arrival timer. If you are overdue, your trusted circle will be alerted automatically.
          </p>
        </div>

        {!activeJourney && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Journey Timer</span>
          </button>
        )}
      </div>

      {/* Active Journey Card */}
      <ActiveJourneyCard onOpenNewJourney={() => setIsModalOpen(true)} />

      {/* Historical Completed Journeys */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            Past Journeys History
          </h3>
          <span className="text-xs text-slate-400">
            {pastJourneys.length} logged
          </span>
        </div>

        {pastJourneys.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No completed journeys recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {pastJourneys.map((j) => (
              <div 
                key={j.id} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {j.journeyName || j.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      j.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {j.status}
                    </span>
                  </div>

                  <span className="text-slate-400 block">
                    {formatDateTime(j.timestamp)}
                  </span>

                  {j.resolutionNotes && (
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {j.resolutionNotes}
                    </p>
                  )}
                </div>

                {j.location && (
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span className="max-w-xs truncate">{j.location.address || 'Location recorded'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <NewJourneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
