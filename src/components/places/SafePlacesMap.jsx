import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function SafePlacesMap({ 
  userLocation, 
  places = [], 
  selectedPlace, 
  onSelectPlace,
  height = '500px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = userLocation 
        ? [userLocation.latitude, userLocation.longitude] 
        : [12.9716, 77.5946]; // Default City center

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Do not destroy map eagerly on minor re-renders, only if unmounted
    };
  }, []);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      const userLatLng = [userLocation.latitude, userLocation.longitude];

      if (!userMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `<div class="user-pulse-dot"><div class="user-pulse-ring"></div></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        userMarkerRef.current = L.marker(userLatLng, { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: inherit; font-size: 13px;">
              <strong style="color: #7c3aed;">Your Current Location</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                ${userLocation.address || 'GPS verified point'}
              </div>
            </div>
          `);
      } else {
        userMarkerRef.current.setLatLng(userLatLng);
      }

      map.setView(userLatLng, 14, { animate: true });
    }
  }, [userLocation]);

  // Update Places Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const getMarkerIcon = (type) => {
      let bg = '#7c3aed';
      let symbol = '🛡️';
      if (type === 'police') {
        bg = '#2563eb';
        symbol = '👮';
      } else if (type === 'hospital') {
        bg = '#e11d48';
        symbol = '🏥';
      } else if (type === 'pharmacy') {
        bg = '#059669';
        symbol = '💊';
      }

      return L.divIcon({
        className: 'custom-place-marker',
        html: `
          <div style="
            background: ${bg};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${symbol}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    places.forEach((place) => {
      if (!place.lat || !place.lon) return;

      const marker = L.marker([place.lat, place.lon], {
        icon: getMarkerIcon(place.type)
      });

      const popupContent = `
        <div style="font-family: inherit; min-width: 180px; max-width: 240px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #6d28d9; letter-spacing: 0.5px;">
            ${place.type}
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">
            ${place.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.3;">
            ${place.address || ''}
          </div>
          ${place.phone ? `<div style="font-size: 11px; font-weight: 600; color: #2563eb; margin-top: 4px;">📞 ${place.phone}</div>` : ''}
          <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}" target="_blank" rel="noreferrer" style="font-size: 11px; font-weight: 700; color: #7c3aed; text-decoration: none;">
              Get Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectPlace?.(place);
      });

      markersLayer.addLayer(marker);
    });
  }, [places, onSelectPlace]);

  // Pan to selected place if changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace || !selectedPlace.lat || !selectedPlace.lon) return;

    map.flyTo([selectedPlace.lat, selectedPlace.lon], 16, {
      animate: true,
      duration: 1
    });
  }, [selectedPlace]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-soft" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
