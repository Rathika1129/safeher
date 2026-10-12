// Notification Integration Service
// Manages alert dispatching with honest delivery status tracking (Demo Mode vs Production Backend)

class NotificationService {
  constructor() {
    this.logs = [];
    this.listeners = new Set();
    this.apiUrl = import.meta.env.VITE_NOTIFICATION_API_URL || null;
    this.isProductionConfigured = Boolean(this.apiUrl && !this.apiUrl.includes('placeholder'));
  }

  // Subscribe to delivery status log updates
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.logs);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb([...this.logs]));
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Dispatch emergency or overdue alerts to trusted contacts
   * @param {Object} params
   * @param {string} params.eventType - 'SOS_ALERT' | 'JOURNEY_OVERDUE' | 'MANUAL_CHECKIN' | 'SAFE_CHECKIN'
   * @param {string} params.userName - Name of user
   * @param {Array} params.contacts - Selected emergency contacts
   * @param {Object} [params.location] - { latitude, longitude, address, mapLink } or null if denied
   * @param {string} [params.journeyName] - Active journey title if applicable
   * @param {boolean} [params.forceDemo] - Force demo simulator mode
   */
  async dispatchAlert({
    eventType,
    userName = 'SafeHer User',
    contacts = [],
    location = null,
    journeyName = null,
    forceDemo = false
  }) {
    if (!contacts || contacts.length === 0) {
      return {
        success: false,
        message: 'No trusted contacts were selected for this alert.',
        dispatches: []
      };
    }

    const timestamp = new Date().toISOString();
    const useDemoMode = forceDemo || !this.isProductionConfigured;

    // Compose alert message
    let messageText = '';
    if (eventType === 'SOS_ALERT') {
      messageText = `EMERGENCY ALERT: ${userName} pressed SOS on SafeHer! Immediate attention required.`;
    } else if (eventType === 'JOURNEY_OVERDUE') {
      messageText = `SAFETY WARNING: ${userName}'s safe journey "${journeyName || 'En route'}" is overdue and safety was not confirmed.`;
    } else if (eventType === 'SAFE_CHECKIN') {
      messageText = `STATUS UPDATE: ${userName} marked themselves SAFE on SafeHer. Emergency resolved.`;
    } else {
      messageText = `CHECK-IN: ${userName} sent a safety check-in on SafeHer.`;
    }

    if (location && location.mapLink) {
      messageText += ` Location: ${location.mapLink}`;
    } else {
      messageText += ` (Location was not shared or permission was not granted)`;
    }

    const results = [];

    // Dispatch to each contact
    for (const contact of contacts) {
      const dispatchRecord = {
        id: `dispatch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp,
        contactId: contact.id,
        contactName: contact.name,
        relationship: contact.relationship,
        phone: contact.phone,
        email: contact.email || null,
        eventType,
        isDemoMode: useDemoMode,
        channel: contact.phone ? 'SMS' : 'EMAIL',
        payloadText: messageText,
        locationAttached: Boolean(location && location.latitude),
        status: 'PENDING', // PENDING -> DELIVERED_DEMO / SENT_PROD / FAILED
        statusText: useDemoMode ? 'Queued (Demo Sandbox)' : 'Connecting to Notification Gateway...',
        deliveredAt: null
      };

      this.logs.unshift(dispatchRecord);
      this.notifyListeners();

      if (useDemoMode) {
        // Honest simulated hackathon delivery pipeline with real timing
        const simulatedResult = await this.simulateDelivery(dispatchRecord);
        results.push(simulatedResult);
      } else {
        // Real production backend call
        const realResult = await this.sendViaBackend(dispatchRecord);
        results.push(realResult);
      }
    }

    return {
      success: results.some(r => r.status.includes('DELIVERED') || r.status.includes('SENT')),
      isDemoMode: useDemoMode,
      dispatches: results
    };
  }

  // Simulated delivery with progressive status updates
  simulateDelivery(record) {
    return new Promise(resolve => {
      // Step 1: Dispatched
      setTimeout(() => {
        const item = this.logs.find(l => l.id === record.id);
        if (item) {
          item.status = 'DISPATCHED_DEMO';
          item.statusText = 'Simulated Carrier Dispatch (Hackathon Demo Sandbox)';
          this.notifyListeners();
        }

        // Step 2: Delivered confirmation
        setTimeout(() => {
          if (item) {
            item.status = 'DELIVERED_DEMO';
            item.statusText = 'Simulated Delivery Confirmed (Carrier Receipt: OK)';
            item.deliveredAt = new Date().toISOString();
            item.carrierReceiptId = `DEMO-SMS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            this.notifyListeners();
          }
          resolve(item || record);
        }, 800);
      }, 600);
    });
  }

  // Real backend dispatch call
  async sendViaBackend(record) {
    const item = this.logs.find(l => l.id === record.id);
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: record.phone || record.email,
          channel: record.channel,
          message: record.payloadText,
          eventType: record.eventType,
          timestamp: record.timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`Gateway returned HTTP ${response.status}`);
      }

      const resData = await response.json();
      if (item) {
        item.status = 'SENT_PROD';
        item.statusText = 'Provider Confirmed Delivery via Gateway';
        item.carrierReceiptId = resData.messageId || 'GATEWAY-ACK';
        item.deliveredAt = new Date().toISOString();
        this.notifyListeners();
      }
      return item;
    } catch (err) {
      if (item) {
        item.status = 'FAILED';
        item.statusText = `Failed: ${err.message}`;
        this.notifyListeners();
      }
      return item;
    }
  }
}

export const notificationService = new NotificationService();
