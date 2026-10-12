import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Clock,
  Radio,
  Send
} from 'lucide-react';
import Modal from '../common/Modal';
import { useSafety } from '../../context/SafetyContext';
import { soundService } from '../../services/soundService';
import { useNotifications } from '../../context/NotificationContext';

export default function SosModal({ isOpen, onClose }) {
  const { 
    activeSOS, 
    triggerSOS, 
    triggerImmediateSOS, 
    cancelSOS, 
    markSafe, 
    contacts, 
    currentLocation, 
    locationStatus, 
    refreshLocation,
    preferences
  } = useSafety();

  const { logs, isDemoMode } = useNotifications();

  const [safeNote, setSafeNote] = useState('');
  const [isMuted, setIsMuted] = useState(!preferences.sirenEnabled);

  const eligibleContacts = contacts.filter(c => c.receiveEmergencyAlerts);

  const handleToggleMute = () => {
    if (isMuted) {
      soundService.startEmergencySiren();
      setIsMuted(false);
    } else {
      soundService.stopEmergencySiren();
      setIsMuted(true);
    }
  };

  const handleMarkSafe = () => {
    markSafe(safeNote || "User confirmed safe through emergency panel");
    setSafeNote('');
    onClose();
  };

  const handleCancelFalseAlarm = () => {
    cancelSOS("Accidental trigger - cancelled by user");
    onClose();
  };

  // If SOS has not been triggered yet when opening modal, provide trigger choice
  const isIdle = !activeSOS;
  const isCountdown = activeSOS?.status === 'COUNTDOWN';
  const isActive = activeSOS?.status === 'ACTIVE';

  return (
    <Modal
      isOpen={isOpen}
      onClose={isCountdown ? handleCancelFalseAlarm : onClose}
      title={isActive ? "🚨 Emergency SOS Active" : isCountdown ? "⚠️ Confirming Emergency SOS" : "Trigger Emergency SOS"}
      maxWidth="max-w-xl"
      showClose={!isCountdown}
    >
      <div className="space-y-5">
        {/* State 1: Modal opened while idle (confirm trigger) */}
        {isIdle && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Are you in an emergency?</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
                This will retrieve your live coordinates and dispatch alerts to your {eligibleContacts.length} trusted contacts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={triggerSOS}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                Start 5s SOS Alert
              </button>
              <button
                type="button"
                onClick={triggerImmediateSOS}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Immediately
              </button>
            </div>
          </div>
        )}

        {/* State 2: Countdown Window (Cancel false alarm) */}
        {isCountdown && (
          <div className="text-center py-6 space-y-5">
            <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-red-600 flex flex-col items-center justify-center text-white shadow-xl">
                <span className="text-4xl font-black">
                  {activeSOS.countdownRemaining}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-200">
                  Seconds
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                Dispatching Emergency Alert...
              </h4>
              <p className="text-sm text-slate-500">
                If this was pressed by mistake, tap the button below to cancel immediately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleCancelFalseAlarm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5 text-red-500" />
                Cancel False Alarm
              </button>
              <button
                type="button"
                onClick={triggerImmediateSOS}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Send Now Without Waiting
              </button>
            </div>
          </div>
        )}

        {/* State 3: Active Emergency Alert Status & Resolution */}
        {isActive && (
          <div className="space-y-5">
            {/* Alert Banner with Siren Toggle */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-red-950 text-sm sm:text-base">
                    SOS Alert Active
                  </h4>
                  <p className="text-xs text-red-700">
                    Contacts alerted • Monitoring live status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isMuted 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                    : 'bg-red-600 border-red-700 text-white hover:bg-red-700 animate-pulse'
                }`}
                title={isMuted ? "Turn on siren" : "Mute siren"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMuted ? "Siren Muted" : "Siren ON"}</span>
              </button>
            </div>

            {/* Live Status Pipeline */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Emergency Delivery Status
              </h5>

              {/* Location Step */}
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentLocation ? 'text-emerald-600' : 'text-amber-500'}`} />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800">Location Status: </span>
                  {currentLocation ? (
                    <span className="text-slate-600">
                      Coordinates captured ({currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}).
                      {currentLocation.mapLink && (
                        <a 
                          href={currentLocation.mapLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-purple-600 hover:underline ml-1 inline-flex items-center gap-0.5"
                        >
                          View Map <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </span>
                  ) : (
                    <span className="text-amber-700">
                      Location permission pending or unavailable.
                      <button 
                        type="button" 
                        onClick={refreshLocation}
                        className="text-purple-600 underline ml-1 font-semibold"
                      >
                        Retry Location
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Contacts Dispatch Step */}
              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800">Trusted Circle ({eligibleContacts.length}): </span>
                  <div className="mt-1 space-y-1">
                    {eligibleContacts.map(contact => {
                      const latestLog = logs.find(l => l.contactId === contact.id);
                      return (
                        <div key={contact.id} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                          <span className="font-medium text-slate-700">
                            {contact.name} ({contact.relationship})
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            latestLog?.status === 'DELIVERED_DEMO' || latestLog?.status === 'SENT_PROD'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}>
                            {latestLog?.statusText || (isDemoMode ? 'Simulating SMS Dispatch' : 'Dispatching...')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Controls */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Safe with friends at campus hostel"
                  value={safeNote}
                  onChange={(e) => setSafeNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleMarkSafe}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  I'm Safe (Resolve Emergency)
                </button>
                <button
                  type="button"
                  onClick={handleCancelFalseAlarm}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-slate-500" />
                  Cancel False Alarm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
