import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { locationService } from '../services/locationService';
import { soundService } from '../services/soundService';
import { notificationService } from '../services/notificationService';
import { INITIAL_CONTACTS, INITIAL_HISTORY_EVENTS } from '../utils/mockData';
import { db, isFirebaseConfigured, collection, addDoc, doc, setDoc, getDocs, deleteDoc } from '../services/firebase';

const SafetyContext = createContext();

const STORAGE_KEYS = {
  CONTACTS: 'safeher_contacts',
  JOURNEY: 'safeher_active_journey',
  JOURNEY_HISTORY: 'safeher_journey_history',
  EVENTS: 'safeher_history_events',
  PREFERENCES: 'safeher_user_preferences',
  CHECK_INS: 'safeher_check_ins'
};

export function SafetyProvider({ children }) {
  const { currentUser } = useAuth();

  // 1. Contacts
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  // 2. Active SOS State:
  // null OR { status: 'COUNTDOWN'|'ACTIVE'|'RESOLVED'|'CANCELLED', countdownRemaining: number, location: object, eventId: string, sirenOn: boolean, createdAt: string }
  const [activeSOS, setActiveSOS] = useState(null);

  // 3. Active Journey State:
  // null OR { id, name, destination, startedAt, expiresAt, durationMinutes, graceMinutes, selectedContacts, status: 'IN_TRANSIT'|'OVERDUE'|'RESOLVED' }
  const [activeJourney, setActiveJourney] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Check if it's already resolved/cancelled
      if (parsed.status === 'RESOLVED' || parsed.status === 'CANCELLED') {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // 4. History Events (SOS, journeys, check-ins, false alarms)
  const [historyEvents, setHistoryEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_HISTORY_EVENTS;
    } catch {
      return INITIAL_HISTORY_EVENTS;
    }
  });

  // 5. Smart Check-ins
  const [checkIns, setCheckIns] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'checkin-init',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'MANUAL',
          note: 'Reached college campus safely. Battery 82%',
          location: 'Library Gate, North Block',
          status: 'ACKNOWLEDGED',
          acknowledgedBy: 'Meera Sharma'
        }
      ];
    } catch {
      return [];
    }
  });

  // 6. User Preferences
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return saved ? JSON.parse(saved) : {
        sirenEnabled: true,
        soundBeeps: true,
        defaultGraceMinutes: 5,
        countdownDurationSeconds: 5,
        autoShareBattery: true,
      };
    } catch {
      return {
        sirenEnabled: true,
        soundBeeps: true,
        defaultGraceMinutes: 5,
        countdownDurationSeconds: 5,
        autoShareBattery: true,
      };
    }
  });

  // 7. Location State
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'locating'
  const [locationError, setLocationError] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(activeJourney));
    } else {
      localStorage.removeItem(STORAGE_KEYS.JOURNEY);
    }
  }, [activeJourney]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(historyEvents));
  }, [historyEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }, [preferences]);

  // Check initial location permission
  useEffect(() => {
    locationService.checkPermissionStatus().then(status => {
      setLocationStatus(status);
      if (status === 'granted') {
        refreshLocation();
      }
    });
  }, []);

  // Location Refresh Method
  const refreshLocation = async () => {
    setLocationStatus('locating');
    setLocationError(null);
    try {
      const pos = await locationService.getCurrentPosition();
      const mapLink = locationService.formatMapLink(pos.latitude, pos.longitude);
      const address = await locationService.reverseGeocode(pos.latitude, pos.longitude);

      const locObj = {
        latitude: pos.latitude,
        longitude: pos.longitude,
        accuracy: pos.accuracy,
        timestamp: pos.timestamp,
        mapLink,
        address
      };
      setCurrentLocation(locObj);
      setLocationStatus('granted');
      return locObj;
    } catch (err) {
      console.warn('Location retrieval notice:', err.message);
      setLocationStatus(err.code === 1 ? 'denied' : 'prompt');
      setLocationError(err.message);
      return null;
    }
  };

  // SOS Countdown Timer effect
  const sosCountdownRef = useRef(null);
  useEffect(() => {
    if (activeSOS && activeSOS.status === 'COUNTDOWN') {
      if (preferences.soundBeeps) {
        soundService.playBeep(520, 0.12);
      }
      sosCountdownRef.current = setInterval(() => {
        setActiveSOS(prev => {
          if (!prev || prev.status !== 'COUNTDOWN') return prev;
          if (prev.countdownRemaining <= 1) {
            clearInterval(sosCountdownRef.current);
            // Escalate to triggered SOS
            executeSOSEscalation(prev);
            return {
              ...prev,
              status: 'ACTIVE',
              countdownRemaining: 0,
              escalatedAt: new Date().toISOString()
            };
          }
          if (preferences.soundBeeps) {
            soundService.playBeep(prev.countdownRemaining > 2 ? 550 : 880, 0.12);
          }
          return {
            ...prev,
            countdownRemaining: prev.countdownRemaining - 1
          };
        });
      }, 1000);

      return () => {
        if (sosCountdownRef.current) clearInterval(sosCountdownRef.current);
      };
    }
  }, [activeSOS?.status]);

  // Execute actual SOS Escalation
  const executeSOSEscalation = async (sosState) => {
    if (preferences.sirenEnabled) {
      soundService.startEmergencySiren();
    }

    // Try to get fresh coordinates if available
    let locationToShare = currentLocation;
    if (!locationToShare) {
      try {
        locationToShare = await refreshLocation();
      } catch {
        locationToShare = null;
      }
    }

    const eligibleContacts = contacts.filter(c => c.receiveEmergencyAlerts);

    // Dispatch notification
    const dispatchResult = await notificationService.dispatchAlert({
      eventType: 'SOS_ALERT',
      userName: currentUser?.displayName || 'SafeHer User',
      contacts: eligibleContacts,
      location: locationToShare,
      forceDemo: false
    });

    // Record Event
    const newEvent = {
      id: sosState.eventId || `sos-${Date.now()}`,
      eventType: 'SOS_ALERT',
      title: '🚨 One-Tap SOS Alert Triggered',
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      deliveryStatus: dispatchResult.isDemoMode ? 'DELIVERED_DEMO' : 'SENT_PROD',
      location: locationToShare ? {
        latitude: locationToShare.latitude,
        longitude: locationToShare.longitude,
        address: locationToShare.address,
        mapLink: locationToShare.mapLink
      } : null,
      notifiedContacts: eligibleContacts.map(c => `${c.name} (${c.relationship})`),
      resolutionNotes: 'Active emergency. Awaiting user safe check-in.'
    };

    setHistoryEvents(prev => [newEvent, ...prev]);

    // Save to Firestore if available
    if (isFirebaseConfigured && currentUser?.uid && db) {
      try {
        const eventsRef = collection(db, 'users', currentUser.uid, 'emergencyEvents');
        await addDoc(eventsRef, newEvent);
      } catch (e) {
        console.warn('Firestore write notice:', e);
      }
    }
  };

  // Trigger SOS (starts cancel window)
  const triggerSOS = () => {
    if (activeSOS && activeSOS.status === 'ACTIVE') return;

    // Proactively request location
    refreshLocation();

    const eventId = `sos-${Date.now()}`;
    setActiveSOS({
      eventId,
      status: 'COUNTDOWN',
      countdownRemaining: preferences.countdownDurationSeconds || 5,
      createdAt: new Date().toISOString(),
      sirenOn: false
    });
  };

  // Immediate SOS (bypasses countdown)
  const triggerImmediateSOS = () => {
    if (sosCountdownRef.current) clearInterval(sosCountdownRef.current);
    const eventId = `sos-${Date.now()}`;
    const newState = {
      eventId,
      status: 'ACTIVE',
      countdownRemaining: 0,
      createdAt: new Date().toISOString(),
      sirenOn: true
    };
    setActiveSOS(newState);
    executeSOSEscalation(newState);
  };

  // Cancel SOS / False Alarm
  const cancelSOS = (reason = 'False alarm cancelled by user') => {
    if (sosCountdownRef.current) clearInterval(sosCountdownRef.current);
    soundService.stopEmergencySiren();

    if (activeSOS) {
      const cancelEvent = {
        id: `cancel-${Date.now()}`,
        eventType: 'FALSE_ALARM',
        title: 'Accidental SOS Trigger (Cancelled)',
        timestamp: new Date().toISOString(),
        status: 'CANCELLED',
        deliveryStatus: activeSOS.status === 'COUNTDOWN' ? 'CANCELLED_BEFORE_DISPATCH' : 'DISPATCHED_FALSE_ALARM_NOTICE',
        location: null,
        notifiedContacts: activeSOS.status === 'ACTIVE' 
          ? contacts.filter(c => c.receiveEmergencyAlerts).map(c => `${c.name} (${c.relationship})`) 
          : [],
        resolutionNotes: reason
      };
      setHistoryEvents(prev => [cancelEvent, ...prev]);
    }

    setActiveSOS(null);
  };

  // Mark Safe (Resolves SOS or Active Journey)
  const markSafe = async (note = 'User marked safe') => {
    soundService.stopEmergencySiren();
    soundService.playSafeChime();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#7c3aed', '#ec4899', '#10b981', '#38bdf8']
      });
    } catch {
      // Confetti is decorative
    }

    // Resolve SOS if active
    if (activeSOS) {
      setHistoryEvents(prev => prev.map(evt => {
        if (evt.id === activeSOS.eventId || evt.status === 'ACTIVE') {
          return {
            ...evt,
            status: 'RESOLVED',
            resolvedAt: new Date().toISOString(),
            resolutionNotes: note
          };
        }
        return evt;
      }));

      // Notify contacts that user is safe
      const eligibleContacts = contacts.filter(c => c.receiveEmergencyAlerts);
      notificationService.dispatchAlert({
        eventType: 'SAFE_CHECKIN',
        userName: currentUser?.displayName || 'SafeHer User',
        contacts: eligibleContacts,
        location: currentLocation,
        forceDemo: false
      });

      setActiveSOS(null);
    }

    // Resolve Journey if active
    if (activeJourney) {
      const resolvedJourney = {
        ...activeJourney,
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
        resolutionNote: note
      };

      // Add to history
      setHistoryEvents(prev => [{
        id: `journey-safe-${Date.now()}`,
        eventType: 'SAFE_CHECKIN',
        title: `Journey Safe Check-in: ${activeJourney.name}`,
        journeyName: activeJourney.name,
        timestamp: new Date().toISOString(),
        status: 'RESOLVED',
        deliveryStatus: 'DELIVERED_DEMO',
        location: currentLocation,
        notifiedContacts: activeJourney.selectedContacts?.map(c => typeof c === 'string' ? c : c.name) || [],
        resolutionNotes: note
      }, ...prev]);

      setActiveJourney(null);
    }

    // Add Check-In record
    const newCheckIn = {
      id: `checkin-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'MANUAL',
      note: note || 'Safe check-in recorded',
      location: currentLocation ? currentLocation.address : 'Current Location',
      status: 'CONFIRMED'
    };
    setCheckIns(prev => [newCheckIn, ...prev]);
  };

  // Start Journey
  const startJourney = ({ name, destination, durationMinutes, graceMinutes = 5, contactIds = [] }) => {
    const startedAt = Date.now();
    const expiresAt = startedAt + (durationMinutes * 60 * 1000);
    const selected = contacts.filter(c => contactIds.includes(c.id));

    const journey = {
      id: `journey-${Date.now()}`,
      name: name.trim() || 'Safe Travel Route',
      destination: destination.trim() || 'Specified Destination',
      startedAt: new Date(startedAt).toISOString(),
      expiresAt, // numeric timestamp for resilient calculation
      durationMinutes,
      graceMinutes,
      selectedContacts: selected,
      status: 'IN_TRANSIT',
      overdueAlertSent: false
    };

    setActiveJourney(journey);
    return journey;
  };

  // Extend Journey
  const extendJourney = (additionalMinutes = 15) => {
    if (!activeJourney) return;
    const additionalMs = additionalMinutes * 60 * 1000;
    setActiveJourney(prev => {
      if (!prev) return null;
      const newExpiresAt = Math.max(Date.now(), prev.expiresAt) + additionalMs;
      return {
        ...prev,
        expiresAt: newExpiresAt,
        durationMinutes: prev.durationMinutes + additionalMinutes,
        status: 'IN_TRANSIT',
        overdueAlertSent: false
      };
    });
  };

  // Cancel Journey
  const cancelJourney = () => {
    if (!activeJourney) return;
    setHistoryEvents(prev => [{
      id: `journey-cancel-${Date.now()}`,
      eventType: 'JOURNEY_CANCELLED',
      title: `Cancelled Journey: ${activeJourney.name}`,
      journeyName: activeJourney.name,
      timestamp: new Date().toISOString(),
      status: 'CANCELLED',
      deliveryStatus: 'N/A',
      location: currentLocation,
      notifiedContacts: [],
      resolutionNotes: 'Journey cancelled by user before reaching destination.'
    }, ...prev]);
    setActiveJourney(null);
  };

  // Journey Timer Heartbeat
  useEffect(() => {
    if (!activeJourney) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const isPastExpiry = now >= activeJourney.expiresAt;
      const gracePeriodMs = (activeJourney.graceMinutes || 5) * 60 * 1000;
      const isPastGrace = now >= (activeJourney.expiresAt + gracePeriodMs);

      if (isPastExpiry && activeJourney.status === 'IN_TRANSIT') {
        // Shift to OVERDUE
        setActiveJourney(prev => prev ? { ...prev, status: 'OVERDUE' } : null);
        if (preferences.soundBeeps) {
          soundService.playBeep(700, 0.25);
        }
      }

      // If grace period elapsed and alert has not been triggered yet
      if (isPastGrace && activeJourney.status === 'OVERDUE' && !activeJourney.overdueAlertSent) {
        setActiveJourney(prev => prev ? { ...prev, overdueAlertSent: true } : null);
        // Auto-escalate overdue alert
        notificationService.dispatchAlert({
          eventType: 'JOURNEY_OVERDUE',
          userName: currentUser?.displayName || 'SafeHer User',
          contacts: activeJourney.selectedContacts || contacts.filter(c => c.receiveEmergencyAlerts),
          location: currentLocation,
          journeyName: activeJourney.name,
          forceDemo: false
        });

        setHistoryEvents(prev => [{
          id: `overdue-alert-${Date.now()}`,
          eventType: 'JOURNEY_OVERDUE',
          title: `⚠️ Overdue Journey Escalation: ${activeJourney.name}`,
          journeyName: activeJourney.name,
          timestamp: new Date().toISOString(),
          status: 'ACTIVE',
          deliveryStatus: 'DELIVERED_DEMO',
          location: currentLocation,
          notifiedContacts: activeJourney.selectedContacts?.map(c => c.name) || [],
          resolutionNotes: `Safety was not confirmed within the ${activeJourney.graceMinutes} minute grace period.`
        }, ...prev]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeJourney, currentLocation, currentUser, contacts, preferences.soundBeeps]);

  // Contact management methods
  const addContact = (contactData) => {
    const newContact = {
      id: `contact-${Date.now()}`,
      name: contactData.name.trim(),
      relationship: contactData.relationship || 'Friend',
      phone: contactData.phone.trim(),
      email: contactData.email ? contactData.email.trim() : '',
      receiveEmergencyAlerts: contactData.receiveEmergencyAlerts ?? true,
      shareLocationConsent: contactData.shareLocationConsent ?? true,
      isPrimary: contacts.length === 0,
      addedAt: new Date().toISOString()
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const editContact = (id, updates) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const toggleEmergencyAlert = (id) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, receiveEmergencyAlerts: !c.receiveEmergencyAlerts } : c
    ));
  };

  // Check-In management
  const performCheckIn = (note = "I'm Safe and at my destination") => {
    const record = {
      id: `checkin-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'MANUAL',
      note,
      location: currentLocation ? currentLocation.address : 'Current Location',
      status: 'CONFIRMED'
    };
    setCheckIns(prev => [record, ...prev]);
    soundService.playSafeChime();
    return record;
  };

  const requestContactCheckIn = (contactId) => {
    const target = contacts.find(c => c.id === contactId);
    if (!target) return;
    const record = {
      id: `req-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'REQUEST',
      note: `Requested status check-in from ${target.name}`,
      location: null,
      status: 'PENDING_ACK',
      contactName: target.name,
      contactPhone: target.phone
    };
    setCheckIns(prev => [record, ...prev]);
    return record;
  };

  // Seed sample demo data
  const loadDemoData = () => {
    setContacts(INITIAL_CONTACTS);
    setHistoryEvents(INITIAL_HISTORY_EVENTS);
    setActiveJourney(null);
    setActiveSOS(null);
  };

  // Clear personal history
  const clearHistory = () => {
    setHistoryEvents([]);
  };

  return (
    <SafetyContext.Provider value={{
      contacts,
      addContact,
      editContact,
      deleteContact,
      toggleEmergencyAlert,
      activeSOS,
      triggerSOS,
      triggerImmediateSOS,
      cancelSOS,
      markSafe,
      activeJourney,
      startJourney,
      extendJourney,
      cancelJourney,
      historyEvents,
      clearHistory,
      checkIns,
      performCheckIn,
      requestContactCheckIn,
      preferences,
      setPreferences,
      currentLocation,
      locationStatus,
      locationError,
      refreshLocation,
      loadDemoData
    }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  return useContext(SafetyContext);
}
