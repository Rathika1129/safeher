// OpenStreetMap Overpass API Service to fetch genuine nearby safe places:
// - Police stations (amenity=police)
// - Hospitals & Clinics (amenity=hospital, amenity=clinic)
// - 24/7 Pharmacies (amenity=pharmacy)

import { locationService } from './locationService';

class OverpassService {
  constructor() {
    this.cache = new Map();
  }

  // Construct Overpass QL query
  buildQuery(lat, lon, radiusMeters = 3500) {
    return `
      [out:json][timeout:25];
      (
        node["amenity"="police"](around:${radiusMeters},${lat},${lon});
        way["amenity"="police"](around:${radiusMeters},${lat},${lon});
        node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
        node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
        node["amenity"="pharmacy"](around:${radiusMeters},${lat},${lon});
      );
      out center 25;
    `;
  }

  async fetchNearbySafePlaces(lat, lon, radiusMeters = 4000) {
    const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}_${radiusMeters}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const query = this.buildQuery(lat, lon, radiusMeters);
    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ];

    let lastError = null;
    let data = null;

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          data = await response.json();
          break;
        } else if (response.status === 429) {
          throw new Error('Overpass API rate limit reached. Please wait a moment before refreshing.');
        } else {
          throw new Error(`Overpass API responded with HTTP ${response.status}`);
        }
      } catch (err) {
        lastError = err;
        console.warn(`SafeHer Overpass fetch failed on ${endpoint}:`, err.message);
      }
    }

    if (!data || !data.elements || data.elements.length === 0) {
      if (lastError && lastError.message.includes('rate limit')) {
        throw lastError;
      }
      // If genuine API returned no results or was unreachable, let's return structured verified data or an empty result
      return [];
    }

    const processed = data.elements.map(el => {
      const elLat = el.lat || (el.center && el.center.lat);
      const elLon = el.lon || (el.center && el.center.lon);
      const tags = el.tags || {};

      let type = 'other';
      if (tags.amenity === 'police') type = 'police';
      else if (tags.amenity === 'hospital' || tags.amenity === 'clinic') type = 'hospital';
      else if (tags.amenity === 'pharmacy') type = 'pharmacy';

      const name = tags.name || tags['name:en'] || this.getDefaultName(type);
      const distanceKm = locationService.calculateDistance(lat, lon, elLat, elLon);

      const street = tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : null;
      const city = tags['addr:city'] || tags['addr:suburb'] || null;
      const address = [street, city].filter(Boolean).join(', ') || tags.address || 'Address registered on OpenStreetMap';

      return {
        id: `osm-${el.type}-${el.id}`,
        osmId: el.id,
        name,
        type,
        lat: elLat,
        lon: elLon,
        distanceKm: distanceKm ? parseFloat(distanceKm.toFixed(2)) : null,
        phone: tags.phone || tags['contact:phone'] || (type === 'police' ? '112 / 100' : null),
        emergencyPhone: tags['emergency:phone'] || null,
        openingHours: tags.opening_hours || (tags['24/7'] === 'yes' ? 'Open 24/7' : null),
        isVerifiedOSM: true,
        address,
        website: tags.website || tags['contact:website'] || null
      };
    });

    // Sort by proximity
    processed.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    this.cache.set(cacheKey, processed);
    return processed;
  }

  getDefaultName(type) {
    switch (type) {
      case 'police': return 'Police Station / Help Desk';
      case 'hospital': return 'Public Health Facility / Hospital';
      case 'pharmacy': return 'Pharmacy / Medical Dispensary';
      default: return 'Public Support Center';
    }
  }
}

export const overpassService = new OverpassService();
