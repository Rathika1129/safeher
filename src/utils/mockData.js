// Mock Data & Presets for SafeHer

export const INITIAL_CONTACTS = [
  {
    id: 'contact-1',
    name: 'Meera Sharma',
    relationship: 'Mother',
    phone: '+91 98765 43210',
    email: 'meera.sharma@example.com',
    receiveEmergencyAlerts: true,
    shareLocationConsent: true,
    isPrimary: true,
    addedAt: '2026-10-01T08:00:00.000Z'
  },
  {
    id: 'contact-2',
    name: 'Priya Sharma',
    relationship: 'Sister',
    phone: '+91 98765 43211',
    email: 'priya.s@example.com',
    receiveEmergencyAlerts: true,
    shareLocationConsent: true,
    isPrimary: false,
    addedAt: '2026-10-02T10:30:00.000Z'
  },
  {
    id: 'contact-3',
    name: 'Ananya Verma',
    relationship: 'Roommate / Friend',
    phone: '+91 98765 43212',
    email: 'ananya.v@example.com',
    receiveEmergencyAlerts: true,
    shareLocationConsent: true,
    isPrimary: false,
    addedAt: '2026-10-03T14:15:00.000Z'
  },
  {
    id: 'contact-4',
    name: 'Campus Security Control Room',
    relationship: 'Campus Support',
    phone: '+91 98765 43299',
    email: 'security.desk@college.edu',
    receiveEmergencyAlerts: true,
    shareLocationConsent: true,
    isPrimary: false,
    addedAt: '2026-10-04T09:00:00.000Z'
  }
];

export const INITIAL_HISTORY_EVENTS = [
  {
    id: 'event-hist-1',
    eventType: 'SAFE_CHECKIN',
    title: 'Routine Safe Check-in',
    journeyName: 'Campus Library to Hostel Block B',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'RESOLVED',
    deliveryStatus: 'DELIVERED_DEMO',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Near Central Library Gate, University Campus',
      mapLink: 'https://www.google.com/maps?q=12.9716,77.5946'
    },
    notifiedContacts: ['Meera Sharma (Mother)', 'Ananya Verma (Roommate)'],
    resolutionNotes: 'User checked in as safe at hostel reception.'
  },
  {
    id: 'event-hist-2',
    eventType: 'FALSE_ALARM',
    title: 'Accidental SOS Trigger (Cancelled)',
    journeyName: null,
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'FALSE_ALARM',
    deliveryStatus: 'CANCELLED_BEFORE_DISPATCH',
    location: null,
    notifiedContacts: [],
    resolutionNotes: 'Cancelled by user within 5-second countdown grace window.'
  },
  {
    id: 'event-hist-3',
    eventType: 'JOURNEY_OVERDUE',
    title: 'Journey Expiry Grace Period Triggered',
    journeyName: 'Metro Station to Home Commute',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'RESOLVED',
    deliveryStatus: 'DELIVERED_DEMO',
    location: {
      latitude: 12.9760,
      longitude: 77.6030,
      address: 'MG Road Metro Station North Exit',
      mapLink: 'https://www.google.com/maps?q=12.9760,77.6030'
    },
    notifiedContacts: ['Meera Sharma (Mother)'],
    resolutionNotes: 'User confirmed safe after 2 minutes overdue; delay due to metro signal delay.'
  }
];

export const FALLBACK_SAFE_PLACES = [
  {
    id: 'fallback-p1',
    name: 'Central Police Station & Women Help Desk',
    type: 'police',
    lat: 12.9716,
    lon: 77.5946,
    distanceKm: 0.8,
    phone: '112 / 080-22942222',
    openingHours: 'Open 24/7',
    isVerifiedOSM: true,
    address: 'Infantry Road, Near Police Commissioner Office'
  },
  {
    id: 'fallback-h1',
    name: 'Government District Civil Hospital & Emergency Care',
    type: 'hospital',
    lat: 12.9680,
    lon: 77.5890,
    distanceKm: 1.4,
    phone: '108 / 080-22225555',
    openingHours: '24 Hours Emergency Trauma Center',
    isVerifiedOSM: true,
    address: 'Victoria Hospital Campus, City Road'
  },
  {
    id: 'fallback-p2',
    name: 'All-Women Police Station (Special Cell)',
    type: 'police',
    lat: 12.9800,
    lon: 77.6010,
    distanceKm: 2.1,
    phone: '1091 (Women Helpline) / 112',
    openingHours: 'Open 24/7',
    isVerifiedOSM: true,
    address: 'Shivajinagar Circle, Women Support Unit'
  },
  {
    id: 'fallback-ph1',
    name: 'Apollo 24/7 Pharmacy & First Aid Clinic',
    type: 'pharmacy',
    lat: 12.9740,
    lon: 77.5990,
    distanceKm: 0.6,
    phone: '1860-500-0101',
    openingHours: 'Open 24/7',
    isVerifiedOSM: true,
    address: 'Main Commercial Street, Ground Floor'
  }
];
