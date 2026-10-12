import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  ShieldAlert, 
  XCircle, 
  Clock,
  Users
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { formatDateTime, getStatusBadgeConfig } from '../utils/formatters';
import Modal from '../components/common/Modal';

export default function HistoryPage() {
  const { historyEvents, clearHistory } = useSafety();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = historyEvents.filter(event => {
    if (typeFilter !== 'ALL' && event.eventType !== typeFilter) return false;
    if (statusFilter !== 'ALL' && event.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = event.title?.toLowerCase().includes(q);
      const matchJourney = event.journeyName?.toLowerCase().includes(q);
      const matchNotes = event.resolutionNotes?.toLowerCase().includes(q);
      if (!matchTitle && !matchJourney && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              Audit Logs
            </span>
            <span className="text-xs text-slate-400">
              {historyEvents.length} recorded events
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Emergency & Journey History
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            A comprehensive, verifiable audit log of all emergency alerts, journey timers, false alarms, and safe check-ins.
          </p>
        </div>

        {historyEvents.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your local history records?')) {
                clearHistory();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="ALL">All Event Types</option>
            <option value="SOS_ALERT">SOS Emergency Alerts</option>
            <option value="JOURNEY_OVERDUE">Journey Overdue Alerts</option>
            <option value="SAFE_CHECKIN">Safe Check-Ins</option>
            <option value="FALSE_ALARM">False Alarm Cancellations</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved / Safe</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FALSE_ALARM">False Alarm</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events, notes, journeys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Event Records List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-xs border border-slate-200 space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">No events matched your filter.</p>
            <p>Try resetting filters or triggering a test journey or SOS to see the audit trail.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const badgeCfg = getStatusBadgeConfig(event.status);
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-purple-200 hover:shadow-soft transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${badgeCfg.bg} ${badgeCfg.text} ${badgeCfg.border}`}>
                      {event.eventType}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDateTime(event.timestamp)}
                    </span>
                    {event.deliveryStatus && (
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        Delivery: {event.deliveryStatus}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 truncate">
                    {event.title}
                  </h4>

                  {event.journeyName && (
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <span>Journey:</span>
                      <strong className="text-slate-800">{event.journeyName}</strong>
                    </div>
                  )}

                  {event.resolutionNotes && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {event.resolutionNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeCfg.bg} ${badgeCfg.text} ${badgeCfg.border}`}>
                    {badgeCfg.label}
                  </span>

                  <button
                    type="button"
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Event Details Inspection Modal */}
      {selectedEvent && (
        <Modal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title="Emergency Event Audit Inspection"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-base">{selectedEvent.title}</span>
                <span className="font-mono text-[10px] text-slate-400">{selectedEvent.id}</span>
              </div>
              <div className="text-slate-500 text-xs">
                Timestamp: <strong>{formatDateTime(selectedEvent.timestamp)}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Event Classification:</span>
                <span className="font-bold text-purple-700">{selectedEvent.eventType}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Resolution Status:</span>
                <span className="font-bold text-slate-800">{selectedEvent.status}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Delivery Gateway Status:</span>
                <span className="font-bold text-emerald-700">{selectedEvent.deliveryStatus || 'N/A'}</span>
              </div>

              {selectedEvent.journeyName && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Associated Journey:</span>
                  <span className="font-bold text-slate-800">{selectedEvent.journeyName}</span>
                </div>
              )}

              {selectedEvent.notifiedContacts?.length > 0 && (
                <div className="py-1.5 border-b border-slate-100 space-y-1">
                  <span className="text-slate-500 block">Notified Circle:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.notifiedContacts.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.location ? (
                <div className="py-2 space-y-1">
                  <span className="text-slate-500 block">Captured Coordinates:</span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div>{selectedEvent.location.address || 'Address registered'}</div>
                    <div className="font-mono text-purple-700">
                      {selectedEvent.location.latitude?.toFixed(4)}, {selectedEvent.location.longitude?.toFixed(4)}
                    </div>
                    {selectedEvent.location.mapLink && (
                      <a 
                        href={selectedEvent.location.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 hover:underline font-bold inline-flex items-center gap-1 mt-1"
                      >
                        Open in Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-1.5 text-slate-400 text-xs italic">
                  Location was not attached (either denied by user or cancelled during countdown).
                </div>
              )}

              {selectedEvent.resolutionNotes && (
                <div className="py-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                  <span className="font-bold block text-xs mb-0.5">Resolution Notes:</span>
                  <span>{selectedEvent.resolutionNotes}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all text-xs"
            >
              Close Details
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
