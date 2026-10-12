import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Clock, 
  RefreshCw, 
  FileText, 
  Radio, 
  XCircle,
  Server,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export default function DemoControlPanel() {
  const { 
    triggerSOS, 
    cancelSOS, 
    markSafe, 
    startJourney, 
    loadDemoData, 
    activeSOS, 
    activeJourney 
  } = useSafety();

  const { logs, isDemoMode, toggleDemoMode, clearNotificationLogs } = useNotifications();
  const { setDemoUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Quick 10-Second Test Journey trigger
  const handleFastJourneyDemo = () => {
    startJourney({
      name: 'Hackathon Fast Demo (Campus to Hostel)',
      destination: 'Judges Evaluation Bench',
      durationMinutes: 0.17, // ~10 seconds
      graceMinutes: 0.15, // ~9 seconds
      contactIds: ['contact-1', 'contact-2']
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full">
      {/* Floating Pill Toggle */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs shadow-2xl hover:bg-slate-800 border border-slate-700 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span>Hackathon Demo Control</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
        </button>
      </div>

      {/* Expanded Control Box */}
      {isOpen && (
        <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl p-5 border border-purple-500/30 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <h4 className="font-extrabold text-sm text-purple-200">
                Evaluation Test Suite
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              SAFE SANDBOX
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            One-tap triggers to demonstrate end-to-end SafeHer workflows to hackathon judges without waiting minutes.
          </p>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleFastJourneyDemo}
              className="p-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-semibold border border-purple-700 flex flex-col items-start gap-1 transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                <span>10s Journey Test</span>
              </div>
              <span className="text-[10px] text-slate-400">Expires in 10s to show overdue</span>
            </button>

            <button
              type="button"
              onClick={triggerSOS}
              className="p-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 font-semibold border border-red-800 flex flex-col items-start gap-1 transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate SOS</span>
              </div>
              <span className="text-[10px] text-slate-400">5s countdown & Siren</span>
            </button>

            <button
              type="button"
              onClick={() => markSafe('Marked safe via hackathon demo controls')}
              className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-semibold border border-emerald-800 flex flex-col items-start gap-1 transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Safe</span>
              </div>
              <span className="text-[10px] text-slate-400">Confetti & resolve alerts</span>
            </button>

            <button
              type="button"
              onClick={() => cancelSOS('False alarm cancelled via evaluation panel')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 flex flex-col items-start gap-1 transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-white">
                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Cancel False Alarm</span>
              </div>
              <span className="text-[10px] text-slate-400">Stops siren & logs cancel</span>
            </button>
          </div>

          {/* Reset / Seed Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={loadDemoData}
              className="text-purple-300 hover:text-purple-200 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Sample Contacts
            </button>

            <span className="text-slate-400">
              Logs: {logs.length} dispatches
            </span>
          </div>

          {/* Live Notification Delivery Log Drawer */}
          {logs.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Server className="w-3 h-3 text-purple-400" />
                  Live Notification Carrier Log
                </span>
                <button
                  type="button"
                  onClick={clearNotificationLogs}
                  className="text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  Clear
                </button>
              </div>

              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {logs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[10px] space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{log.channel} ➔ {log.contactName} ({log.phone || log.email})</span>
                      <span className={`px-1.5 py-0.2 rounded ${
                        log.status === 'DELIVERED_DEMO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {log.status === 'DELIVERED_DEMO' ? 'DELIVERED (SIM)' : 'PENDING'}
                      </span>
                    </div>
                    <div className="text-slate-400 truncate">
                      {log.payloadText}
                    </div>
                    {log.carrierReceiptId && (
                      <div className="text-[9px] text-purple-400 font-mono">
                        Receipt: {log.carrierReceiptId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
