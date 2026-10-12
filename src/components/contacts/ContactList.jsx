import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldAlert, 
  MapPin, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle,
  Bell,
  BellOff
} from 'lucide-react';

export default function ContactList({ contacts = [], onAdd, onEdit, onDelete, onToggleAlert }) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-soft text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">No Trusted Contacts Added</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Build your safety circle. When you trigger SOS or your journey timer is overdue, SafeHer will automatically alert these contacts.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Add First Emergency Contact
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contacts.map((contact) => (
        <div 
          key={contact.id}
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-200 transition-all shadow-soft flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className="inline-block text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-0.5">
                    {contact.relationship}
                  </span>
                </div>
              </div>

              {/* Alert Toggle Status */}
              <button
                type="button"
                onClick={() => onToggleAlert?.(contact.id)}
                className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                  contact.receiveEmergencyAlerts 
                    ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
                title={contact.receiveEmergencyAlerts ? "Receiving emergency alerts (click to pause)" : "Alerts paused (click to activate)"}
              >
                {contact.receiveEmergencyAlerts ? <Bell className="w-4 h-4 text-purple-600" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${contact.phone}`} className="font-medium text-slate-800 hover:text-purple-700">
                  {contact.phone}
                </a>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-500">
                  {contact.shareLocationConsent ? 'Location sharing permitted' : 'Location sharing restricted'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-[11px] font-semibold flex items-center gap-1 ${
              contact.receiveEmergencyAlerts ? 'text-emerald-700' : 'text-slate-400'
            }`}>
              <CheckCircle className="w-3.5 h-3.5" />
              {contact.receiveEmergencyAlerts ? 'Alerts Enabled' : 'Alerts Paused'}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit?.(contact)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                title="Edit Contact"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(contact.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
