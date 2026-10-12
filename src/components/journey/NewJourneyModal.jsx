import React, { useState } from 'react';
import { Navigation, Clock, Shield, AlertCircle, Check, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { useSafety } from '../../context/SafetyContext';

const PRESETS = [
  { label: 'Campus Commute', destination: 'University Main Hostel', duration: 25 },
  { label: 'Metro Ride Home', destination: 'City Center Metro', duration: 45 },
  { label: 'Late Evening Cab', destination: 'Home Residence', duration: 35 },
  { label: '⚡ 10-Sec Demo (Hackathon)', destination: 'Judges Evaluation Demo', duration: 0.17 }, // 10 seconds!
];

export default function NewJourneyModal({ isOpen, onClose }) {
  const { contacts, startJourney } = useSafety();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [graceMinutes, setGraceMinutes] = useState(5);
  const [selectedContactIds, setSelectedContactIds] = useState(() => 
    contacts.filter(c => c.receiveEmergencyAlerts).map(c => c.id)
  );

  const applyPreset = (preset) => {
    setName(preset.label);
    setDestination(preset.destination);
    setDurationMinutes(preset.duration);
  };

  const handleToggleContact = (id) => {
    setSelectedContactIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    startJourney({
      name,
      destination: destination.trim() || 'Specified destination',
      durationMinutes: parseFloat(durationMinutes) || 30,
      graceMinutes: parseInt(graceMinutes) || 5,
      contactIds: selectedContactIds
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Safe Journey Timer"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Quick Route Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-2 rounded-xl text-left border text-xs transition-all ${
                  p.duration < 1 
                    ? 'border-pink-300 bg-pink-50 hover:bg-pink-100 text-pink-900 font-semibold' 
                    : 'border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{p.label}</span>
                  <span className="text-[10px] text-slate-500">
                    {p.duration < 1 ? '10 sec' : `${p.duration}m`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Journey Name / Route
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Return from Library to Hostel Block"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Address
            </label>
            <input
              type="text"
              placeholder="e.g. Campus Hostel B or 42 Park Avenue"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Duration
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">mins</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Overdue Grace Period
              </label>
              <select
                value={graceMinutes}
                onChange={(e) => setGraceMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="2">2 minutes</option>
                <option value="5">5 minutes (Recommended)</option>
                <option value="10">10 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Notify Contacts if Overdue ({selectedContactIds.length} selected)
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
            {contacts.map(c => {
              const isSelected = selectedContactIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => handleToggleContact(c.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-purple-100 text-purple-900 font-semibold' : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.name} ({c.relationship})</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architectural Disclaimer Required by Prompt */}
        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-[11px] text-purple-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Resilient Architecture Notice</span>
          </div>
          <p>
            Journey expiry timestamps are stored in Firestore/localStorage so the timer survives page reloads. In full deployment, a cloud-scheduled task handles overdue alerts if the device is offline.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-100 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Start Journey Timer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
