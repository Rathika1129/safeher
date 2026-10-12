import React from 'react';
import { Shield, Hospital, Pill, Phone, Navigation, ExternalLink, Clock } from 'lucide-react';
import { formatDistance } from '../../utils/formatters';

export default function PlaceCard({ place, isSelected, onSelect }) {
  const getIcon = () => {
    switch (place.type) {
      case 'police':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'hospital':
        return <Hospital className="w-5 h-5 text-rose-600" />;
      case 'pharmacy':
        return <Pill className="w-5 h-5 text-emerald-600" />;
      default:
        return <Shield className="w-5 h-5 text-purple-600" />;
    }
  };

  const getBadgeStyle = () => {
    switch (place.type) {
      case 'police':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hospital':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'pharmacy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`;

  return (
    <div 
      onClick={() => onSelect?.(place)}
      className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
        isSelected 
          ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-300 shadow-md' 
          : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle()}`}>
                {place.type}
              </span>
              {place.distanceKm != null && (
                <span className="text-xs font-semibold text-slate-500">
                  {formatDistance(place.distanceKm)}
                </span>
              )}
            </div>

            <h4 className="font-bold text-slate-900 text-sm mt-1">
              {place.name}
            </h4>

            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              {place.address}
            </p>
          </div>
        </div>
      </div>

      {/* Details Row */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-600">
          {place.phone && (
            <a 
              href={`tel:${place.phone.split('/')[0].trim()}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-purple-700 font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{place.phone}</span>
            </a>
          )}
          {place.openingHours && (
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{place.openingHours}</span>
            </span>
          )}
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-800 font-semibold text-xs transition-colors"
        >
          <Navigation className="w-3 h-3" />
          <span>Directions</span>
          <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
