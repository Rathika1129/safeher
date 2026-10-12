import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, HeartHandshake, Shield, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Roommate',
  'Friend',
  'Partner',
  'Guardian',
  'Campus Security',
  'Colleague',
  'Other'
];

export default function ContactModal({ isOpen, onClose, onSave, contactToEdit }) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [receiveEmergencyAlerts, setReceiveEmergencyAlerts] = useState(true);
  const [shareLocationConsent, setShareLocationConsent] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name || '');
      setRelationship(contactToEdit.relationship || 'Mother');
      setPhone(contactToEdit.phone || '');
      setEmail(contactToEdit.email || '');
      setReceiveEmergencyAlerts(contactToEdit.receiveEmergencyAlerts ?? true);
      setShareLocationConsent(contactToEdit.shareLocationConsent ?? true);
    } else {
      setName('');
      setRelationship('Mother');
      setPhone('+91 ');
      setEmail('');
      setReceiveEmergencyAlerts(true);
      setShareLocationConsent(true);
    }
    setErrors({});
  }, [contactToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Contact name is required.';
    if (!phone.trim() || phone.trim().length < 8) {
      errs.phone = 'Valid phone number is required to receive SMS alerts.';
    }
    if (!shareLocationConsent) {
      errs.consent = 'Explicit consent is required to share safety alerts.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(contactToEdit || {}),
      name,
      relationship,
      phone,
      email,
      receiveEmergencyAlerts,
      shareLocationConsent
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? "Edit Trusted Contact" : "Add Trusted Emergency Contact"}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Meera Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Relationship *
          </label>
          <div className="relative">
            <HeartHandshake className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {RELATIONSHIPS.map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number (for SMS & Calls) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
        </div>

        {/* Optional Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              placeholder="contact@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Toggles & Permissions */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveEmergencyAlerts}
              onChange={(e) => setReceiveEmergencyAlerts(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Enable for Emergency SOS Alerts
              </span>
              <span className="text-[11px] text-slate-500 block">
                This contact will automatically receive alerts when you trigger SOS or an overdue journey alert.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={shareLocationConsent}
              onChange={(e) => setShareLocationConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Explicit Location Sharing Consent *
              </span>
              <span className="text-[11px] text-slate-500 block">
                I grant consent for SafeHer to include my live GPS coordinates link only during an active alert.
              </span>
            </div>
          </label>
          {errors.consent && <p className="text-xs text-rose-600">{errors.consent}</p>}
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <span>
            SafeHer stores emergency contact information strictly scoped to your private user profile in Firestore. Contact numbers are never made public or used for marketing.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-100 transition-all"
          >
            {contactToEdit ? "Save Changes" : "Add to Circle"}
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
