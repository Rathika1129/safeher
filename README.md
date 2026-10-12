# SafeHer — Every Journey Deserves a Safe Return 🛡️

SafeHer is a modern, social-impact web application built to help women manage personal safety while travelling, commuting to college, returning late from work, or navigating unfamiliar locations.

---

## 🌟 Key Features

1. **One-Tap Emergency SOS**
   - Prominent, pulsating emergency SOS button with audible synthesizer siren.
   - 5-second countdown grace window allowing immediate cancellation of accidental false alarms.
   - Captures GPS coordinates and generates emergency map links.
   - Dispatches emergency notifications to your trusted circle with live delivery status tracking.
   - One-tap "I'm Safe" emergency resolution with audio chime.

2. **Safe Journey Timer**
   - Plan routes with expected durations and custom grace periods.
   - Real-time countdown timer that recalculates against stored expiry timestamps across page refreshes.
   - Fast "+15m Extend" and "I'm Safe" completion buttons.
   - Overdue warning banner with automatic emergency alert escalation if safety is unconfirmed.
   - Includes **⚡ 10-Second Test Journey** for rapid hackathon judge demonstrations.

3. **Nearby Safe Havens (Interactive Map)**
   - Interactive Leaflet & OpenStreetMap interface.
   - Queries the genuine OpenStreetMap Overpass API for nearby:
     - 🛡️ Police stations & women help desks (`amenity=police`)
     - 🏥 24-hour trauma hospitals & clinics (`amenity=hospital`)
     - 💊 Pharmacies & medical dispensaries (`amenity=pharmacy`)
   - Synchronized results list with exact distances and turn-by-turn navigation links.
   - Manual search bar (Nominatim geocoding) for planning prospective routes.

4. **Trusted Circle Management**
   - Add, edit, and delete emergency contacts with relationship badges.
   - Toggle emergency alert permissions per contact.
   - Explicit consent tracking for GPS coordinate sharing.
   - Scoped strictly to the authenticated user under Firestore security rules.

5. **Smart Check-In**
   - One-tap "I'm Safe" check-in checkpoint logging.
   - Ping trusted contacts to request their safety status.
   - Historical check-in timeline.

6. **Emergency History & Audit Trail**
   - Filterable audit log of all SOS alerts, journeys, false alarms, and check-ins.
   - Filter by event type, resolution status, and keywords.
   - Detailed event inspection modal showing coordinates, recipient status, and resolution notes.

7. **Hackathon Demo Control Suite**
   - Dedicated floating evaluator panel to demonstrate 10s journeys, simulated SOS, safe check-in, and carrier SMS logs with simulated carrier receipts.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Leaflet, OpenStreetMap, Overpass API, Nominatim Geocoding
- **Audio Synthesizer**: Web Audio API (real emergency siren, countdown ticks, and chimes)
- **Database & Auth**: Firebase Authentication & Cloud Firestore (with resilient local storage fallback for offline demo)
- **Styling**: Tailored deep violet (`#5B21B6`), rich purple (`#7C3AED`), pink accents, glassmorphism, responsive mobile-first UI

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
git clone <repo-url>
cd safeher
npm install
```

### 3. Running Locally
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## ⚙️ Configuration & Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Fallback |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | Local Demo mode active if empty |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Local Demo mode |
| `VITE_FIREBASE_PROJECT_ID` | Cloud Firestore Project ID | Local Demo mode |
| `VITE_NOTIFICATION_API_URL` | Backend Gateway Webhook URL | Hackathon Demo Sandbox if empty |

*Note: SafeHer is built with an zero-crash architecture. If Firebase credentials are not provided, it automatically activates the Hackathon Sandbox mode with sample contacts and persistent local storage.*

---

## 🔒 Firestore Security Rules

Deploy the included `firestore.rules` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

Rules summary:
- Users can strictly read and write documents inside `users/{userId}` where `request.auth.uid == userId`.
- All sub-collections (`trustedContacts`, `journeys`, `emergencyEvents`, `checkIns`) inherit user scoping.
- Global access is denied by default.

---

## 🎬 3-Minute Hackathon Presentation Script

For a two-member team presenting to judges:

1. **Introduction (30s)**:
   - *"Hello judges, we are Team SafeHer. Millions of women navigate unsafe commutes daily without reliable safeguards. SafeHer is our answer — 'Every Journey Deserves a Safe Return'."*
2. **One-Tap SOS & Siren Demo (45s)**:
   - Click the large circular **SOS** button on the Dashboard.
   - Show the 5-second countdown timer and siren.
   - Click **Cancel False Alarm** to show how accidental presses are safely cancelled and logged.
   - Next, press **Send Immediately** to show the emergency dispatch status and Google Maps coordinate link.
   - Tap **I'm Safe** to show instant resolution, safe chime, and confetti celebration.
3. **Safe Journey Timer (45s)**:
   - Open **Hackathon Demo Control** (bottom-right floating pill) and click **"10s Journey Test"**.
   - Show the live countdown timer on the Dashboard.
   - Watch the timer reach 0:00 and shift into **Overdue Warning** mode with grace period countdown!
   - Highlight: *"SafeHer stores expiry timestamps in the database, meaning refreshing the page or closing the tab will not lose the remaining time."*
   - Click **"I'm Safe"** to mark the journey completed.
4. **Nearby Safe Places (30s)**:
   - Navigate to **Nearby Safe Places**.
   - Show the Leaflet map with police stations (blue), hospitals (rose), and 24/7 pharmacies (green).
   - Click on a police station marker to open directions and emergency call hotline.
5. **Conclusion & Privacy Ethics (30s)**:
   - Point out that SafeHer never performs continuous background surveillance without consent.
   - Show the **Emergency History** audit trail and **Live Notification Carrier Log**.

---

## ⚠️ Real-World Limitations & Disclosures

- **Browser Timers**: In a purely client-side browser app, timers can pause when a mobile device locks or suspends the tab. SafeHer stores the numeric `expiresAt` timestamp so it recalculates accurately upon reopening. For production 24/7 background execution, a server-side scheduled queue (e.g. Firebase Cloud Tasks or AWS EventBridge) should be hooked up to `VITE_NOTIFICATION_API_URL`.
- **Emergency Services**: SafeHer does not directly dial 112 or police dispatch unless an authorized government emergency API integration is established.
- **Demo Mode**: Real SMS notifications require paid carrier credits (Twilio / AWS SNS / Fast2SMS). The demo mode transparently simulates carrier dispatches with realistic receipt IDs.
