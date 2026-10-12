// Geolocation Service for SafeHer

class LocationService {
  // Check permission state (granted, prompt, denied)
  async checkPermissionStatus() {
    if (!navigator.permissions || !navigator.permissions.query) {
      return 'unknown';
    }
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'prompt', 'denied'
    } catch {
      return 'unknown';
    }
  }

  // Get current position with clear error messages and configurable timeout
  getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp || Date.now(),
          });
        },
        (error) => {
          let message = 'Unable to retrieve location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access was denied. Please allow location access in your browser settings to share accurate coordinates.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is currently unavailable. Using network estimate or last known point.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please check your GPS signal and retry.';
              break;
            default:
              message = error.message || message;
          }
          const err = new Error(message);
          err.code = error.code;
          reject(err);
        },
        defaultOptions
      );
    });
  }

  // Generate emergency map link
  formatMapLink(lat, lng) {
    if (!lat || !lng) return null;
    return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  }

  formatOSMLink(lat, lng) {
    if (!lat || !lng) return null;
    return `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lng.toFixed(6)}#map=16/${lat.toFixed(6)}/${lng.toFixed(6)}`;
  }

  // Reverse geocode lat/lng to readable address via Nominatim
  async reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SafeHer-Hackathon-App/1.0'
        }
      });
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (e) {
      console.warn('Reverse geocode fallback:', e);
      return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
    }
  }

  // Forward geocode search query (e.g., city or landmark search)
  async searchPlace(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SafeHer-Hackathon-App/1.0'
        }
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      return data.map(item => ({
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
      }));
    } catch (e) {
      console.warn('Place search error:', e);
      return [];
    }
  }

  // Calculate distance between two coordinates using Haversine formula (in km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const locationService = new LocationService();
