import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  MapPin, 
  Volume2, 
  Lock, 
  Key, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertCircle,
  FileCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

export default function SettingsPage() {
  const { currentUser, updateUserData } = useAuth();
  const { 
    preferences, 
    setPreferences, 
    locationStatus, 
    refreshLocation, 
    loadDemoData, 
    clearHistory 
  } = useSafety();

  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [emergencyPin, setEmergencyPin] = useState(currentUser?.emergencyPin || '1234');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserData({
      displayName: name,
      phone,
      bloodGroup,
      emergencyPin
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTogglePref = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleGraceChange = (e) => {
    setPreferences(prev => ({
      ...prev,
      defaultGraceMinutes: parseInt(e.target.value) || 5
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
            Settings & Governance
          </span>
          <span className="text-xs text-slate-400">
            Profile • Preferences • Privacy
          </span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mt-1">
          Profile & Safety Preferences
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure your emergency parameters, sound alert thresholds, and review transparent privacy controls.
        </p>
      </div>

      {/* 1. Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-700" />
          User Profile & Emergency Medical Notes
        </h3>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group (for first responders)
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                False Alarm Cancellation PIN (4 digits)
              </label>
              <input
                type="text"
                maxLength={4}
                value={emergencyPin}
                onChange={(e) => setEmergencyPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* 2. Alert & Sound Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-700" />
          Emergency Audio & Timing Parameters
        </h3>

        <div className="space-y-4">
          <label className="flex items-start justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 block">
                Emergency Audio Siren
              </span>
              <span className="text-xs text-slate-500 block">
                Synthesizes a loud audible siren when SOS is escalated to deter potential threats and alert nearby bystanders.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.sirenEnabled}
              onChange={() => handleTogglePref('sirenEnabled')}
              className="mt-1 w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
          </label>

          <label className="flex items-start justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 block">
                Audible Countdown Ticks
              </span>
              <span className="text-xs text-slate-500 block">
                Plays audible beeps during the 5-second false alarm countdown window.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.soundBeeps}
              onChange={() => handleTogglePref('soundBeeps')}
              className="mt-1 w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
          </label>

          <div className="p-3 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-slate-900 block">
                Default Journey Overdue Grace Period
              </span>
              <span className="text-xs text-slate-500 block">
                Buffer period allowed before overdue journey triggers emergency notification dispatch.
              </span>
            </div>
            <select
              value={preferences.defaultGraceMinutes}
              onChange={handleGraceChange}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="2">2 minutes</option>
              <option value="5">5 minutes (Default)</option>
              <option value="10">10 minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Location & Privacy Governance */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-700" />
          Location Permission & Privacy Architecture
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800 block">Browser Geolocation Permission:</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold mt-1 ${
              locationStatus === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {locationStatus.toUpperCase()}
            </span>
          </div>

          <button
            type="button"
            onClick={refreshLocation}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors self-start sm:self-auto"
          >
            Check / Refresh GPS
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-4 h-4 text-purple-700" />
            <span>Zero Background Surveillance Guarantee</span>
          </div>
          <p>
            SafeHer never tracks your continuous location in the background. GPS coordinates are queried only during active SOS alert triggers, journey overdue events, or when you explicitly search for nearby safe places.
          </p>
        </div>
      </div>

      {/* 4. Hackathon Reset & Data Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-700" />
          Demo Maintenance & Data Reset
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              loadDemoData();
              alert('Sample Trusted Circle (Mom, Sister, Roommate, Campus Security) restored!');
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Sample Demo Circle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all local audit history events?')) {
                clearHistory();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Event History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
