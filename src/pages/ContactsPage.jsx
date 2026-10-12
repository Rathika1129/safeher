import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import ContactList from '../components/contacts/ContactList';
import ContactModal from '../components/contacts/ContactModal';

export default function ContactsPage() {
  const { contacts, addContact, editContact, deleteContact, toggleEmergencyAlert, loadDemoData } = useSafety();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (contactData) => {
    if (editingContact) {
      editContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }
  };

  const eligibleCount = contacts.filter(c => c.receiveEmergencyAlerts).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              Trusted Circle
            </span>
            <span className="text-xs text-slate-400">
              {eligibleCount} of {contacts.length} primed for emergency dispatch
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Emergency Contacts Management
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            When you trigger an SOS or fail to check in from an overdue journey, SafeHer dispatches alerts directly to these verified contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <ContactList
        contacts={contacts}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={deleteContact}
        onToggleAlert={toggleEmergencyAlert}
      />

      {/* Privacy Architecture Notice */}
      <div className="bg-purple-50/80 rounded-2xl p-6 border border-purple-200 space-y-3">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
          <Lock className="w-4 h-4 text-purple-700" />
          <span>Strict User-Scoped Data Privacy Pledge</span>
        </div>
        <p className="text-xs text-purple-800 leading-relaxed">
          In SafeHer, all contact records are stored strictly within the authenticated user's private collection (<code className="bg-purple-200/60 px-1 py-0.5 rounded text-purple-900">users/{'{userId}'}/trustedContacts/{'{contactId}'}</code>). Enforced by Firestore Security Rules, no unauthorized third party can ever view or query your safety circle.
        </p>
      </div>

      {/* Add / Edit Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={editingContact}
      />
    </div>
  );
}
