import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Radio, 
  Sparkles,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import SosButton from '../components/sos/SosButton';
import SosModal from '../components/sos/SosModal';
import ActiveJourneyCard from '../components/journey/ActiveJourneyCard';
import NewJourneyModal from '../components/journey/NewJourneyModal';
import { formatDateTime, getStatusBadgeConfig } from '../utils/formatters';

export default function DashboardPage({ onNavigateTab }) {
  const { 
    currentUser 
  } = useAuth();

  const { 
    activeSOS, 
    contacts, 
    activeJourney, 
    historyEvents, 
    currentLocation, 
    locationStatus, 
    refreshLocation,
    markSafe,
    performCheckIn
  } = useSafety();

  const { isDemoMode } = useNotifications();

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isNewJourneyModalOpen, setIsNewJourneyModalOpen] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const eligibleContacts = contacts.filter(c => c.receiveEmergencyAlerts);

  const handleInstantSafe = () => {
    performCheckIn("Routine 'I'm Safe' check-in from Dashboard");
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Status Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                Safety Overview
              </span>
              {isDemoMode && (
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-[10px] font-bold">
                  HACKATHON DEMO SANDBOX
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser?.displayName || 'Aarohi'} 👋
            </h1>

            <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
              SafeHer is actively standing by. Your circle consists of {contacts.length} trusted contacts ({eligibleContacts.length} primed for emergency dispatch).
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 md:items-end">
            <button
              type="button"
              onClick={refreshLocation}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                locationStatus === 'granted'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {locationStatus === 'granted' ? 'Location Sharing Ready' : 'Location Not Set (Tap to Enable)'}
              </span>
            </button>

            {currentLocation?.address && (
              <span className="text-[11px] text-purple-300 max-w-xs truncate hidden sm:block">
                📍 {currentLocation.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Action Hub: Large SOS & Quick Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SOS Central Command */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-soft flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                Emergency Command Center
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant SOS dispatch to your selected trusted circle with a 5-second false alarm cancel buffer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSosModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100"
            >
              Emergency Details ↗
            </button>
          </div>

          {/* The Hero SOS Button */}
          <SosButton onOpenModal={() => setIsSosModalOpen(true)} />

          {/* Bottom Bar inside SOS Card: Quick "I'm Safe" */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {justCheckedIn ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your safety check-in was successfully recorded!
                </span>
              ) : (
                <span>All clear? Ping your family in one tap.</span>
              )}
            </div>

            <button
              id="dash-quick-safe"
              type="button"
              onClick={handleInstantSafe}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>I'm Safe Check-in</span>
            </button>
          </div>
        </div>

        {/* Right Col: Active Journey & Shortcuts */}
        <div className="space-y-6">
          {/* Active Journey Card */}
          <ActiveJourneyCard onOpenNewJourney={() => setIsNewJourneyModalOpen(true)} />

          {/* Nearby Safe Places Shortcut */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Nearest Safe Places
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('places')}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Open Map ➔
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div 
                onClick={() => onNavigateTab('places')}
                className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition-colors"
              >
                <div>
                  <span className="font-bold text-blue-950 block">Police Help Desk</span>
                  <span className="text-[11px] text-blue-800">24/7 Verified Women Desk</span>
                </div>
                <span className="font-extrabold text-blue-700">~ 800m</span>
              </div>

              <div 
                onClick={() => onNavigateTab('places')}
                className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-center justify-between cursor-pointer hover:bg-rose-100/60 transition-colors"
              >
                <div>
                  <span className="font-bold text-rose-950 block">Civil Hospital & Trauma</span>
                  <span className="text-[11px] text-rose-800">24 Hours Emergency Unit</span>
                </div>
                <span className="font-extrabold text-rose-700">~ 1.4 km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trusted Circle Summary & Recent Emergency Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trusted Circle Quick View */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              Trusted Circle ({contacts.length})
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('contacts')}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2.5">
            {contacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{contact.name}</h5>
                    <span className="text-[11px] text-slate-400">{contact.relationship}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    contact.receiveEmergencyAlerts ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {contact.receiveEmergencyAlerts ? 'Alerts ON' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events / Audit Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-700" />
              Recent Safety Events & Notifications
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('history')}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              View Full History ➔
            </button>
          </div>

          <div className="space-y-2.5">
            {historyEvents.slice(0, 3).map(event => {
              const badgeCfg = getStatusBadgeConfig(event.status);
              return (
                <div key={event.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeCfg.bg} ${badgeCfg.text}`}>
                        {event.eventType}
                      </span>
                      <span className="text-slate-400">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-sm">
                      {event.title}
                    </h5>

                    {event.resolutionNotes && (
                      <p className="text-slate-500 text-[11px]">
                        {event.resolutionNotes}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeCfg.bg} ${badgeCfg.text} ${badgeCfg.border}`}>
                      {badgeCfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* New Journey Modal */}
      <NewJourneyModal
        isOpen={isNewJourneyModalOpen}
        onClose={() => setIsNewJourneyModalOpen(false)}
      />
    </div>
  );
}
