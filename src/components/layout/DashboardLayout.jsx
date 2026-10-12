import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Clock, 
  Navigation, 
  History, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Radio,
  LogOut,
  User,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';
import { soundService } from '../../services/soundService';
import DemoControlPanel from '../demo/DemoControlPanel';
import SosModal from '../sos/SosModal';
import NewJourneyModal from '../journey/NewJourneyModal';
import { formatSecondsToTimer } from '../../utils/formatters';

export default function DashboardLayout({ activeTab, onSelectTab, children }) {
  const { 
    activeSOS, 
    activeJourney, 
    markSafe, 
    locationStatus, 
    refreshLocation, 
    currentLocation 
  } = useSafety();

  const { currentUser, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isNewJourneyModalOpen, setIsNewJourneyModalOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Safety Dashboard', icon: Shield },
    { id: 'journey', label: 'Safe Journey Timer', icon: Clock, badge: activeJourney ? 'Active' : null },
    { id: 'places', label: 'Nearby Safe Places', icon: MapPin },
    { id: 'contacts', label: 'Trusted Circle', icon: Users },
    { id: 'checkin', label: 'Smart Check-In', icon: CheckCircle },
    { id: 'history', label: 'Emergency History', icon: History },
    { id: 'settings', label: 'Profile & Privacy', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 🚨 Emergency Floating Banner if SOS is active */}
      {activeSOS && activeSOS.status === 'ACTIVE' && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 shadow-lg flex items-center justify-between text-xs sm:text-sm font-bold z-50 sticky top-0 animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-ping" />
            <span>EMERGENCY SOS ACTIVE: Alerts dispatched to your trusted circle</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSosModalOpen(true)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold text-xs transition-colors"
            >
              View Status
            </button>
            <button
              type="button"
              onClick={() => markSafe('Marked safe from emergency banner')}
              className="px-3 py-1 bg-white text-red-700 hover:bg-red-50 rounded-lg font-extrabold text-xs transition-colors"
            >
              I'm Safe
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
                  Safe<span className="text-purple-600">Her</span>
                </span>
                <span className="hidden md:block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Every Journey Deserves a Safe Return
                </span>
              </div>
            </button>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location Status Pill */}
            <button
              type="button"
              onClick={refreshLocation}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                locationStatus === 'granted'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : locationStatus === 'denied'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
              title="Click to refresh your GPS coordinates"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {locationStatus === 'granted' 
                  ? 'GPS Active' 
                  : locationStatus === 'locating' 
                  ? 'Locating...' 
                  : 'Enable GPS'}
              </span>
            </button>

            {/* Quick SOS Trigger button in Navbar */}
            <button
              id="nav-sos-btn"
              type="button"
              onClick={() => setIsSosModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-200 transition-all flex items-center gap-1.5 active:scale-95 animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* User Profile Info */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                {currentUser?.displayName?.charAt(0) || 'U'}
              </div>
              <span className="font-semibold text-slate-700 max-w-[120px] truncate">
                {currentUser?.displayName || 'User'}
              </span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <nav className="bg-white rounded-2xl p-3 border border-purple-100 shadow-soft space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-pink-400 text-slate-900' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-5 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                24/7 National Emergency
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-purple-800/60">
                <span className="text-purple-200">National Emergency</span>
                <a href="tel:112" className="font-bold text-pink-300 hover:underline">112</a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-purple-800/60">
                <span className="text-purple-200">Women Helpline</span>
                <a href="tel:1091" className="font-bold text-pink-300 hover:underline">1091</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-purple-200">Ambulance Service</span>
                <a href="tel:108" className="font-bold text-pink-300 hover:underline">108</a>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-purple-700" />
                    <span className="font-black text-lg text-slate-900">SafeHer Menu</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isActive
                            ? 'bg-purple-700 text-white shadow-md'
                            : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-pink-700 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around py-2 shadow-lg">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'dashboard' ? 'text-purple-700' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('journey')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold relative ${
            activeTab === 'journey' ? 'text-purple-700' : 'text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Journey</span>
          {activeJourney && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          )}
        </button>

        {/* SOS Center Floating Button */}
        <button
          type="button"
          onClick={() => setIsSosModalOpen(true)}
          className="flex flex-col items-center justify-center -translate-y-4 w-12 h-12 rounded-full bg-red-600 text-white shadow-xl shadow-red-300 font-black text-xs animate-pulse ring-4 ring-white"
        >
          SOS
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('places')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'places' ? 'text-purple-700' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Places</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('contacts')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'contacts' ? 'text-purple-700' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Circle</span>
        </button>
      </nav>

      {/* Global Modals */}
      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      <NewJourneyModal
        isOpen={isNewJourneyModalOpen}
        onClose={() => setIsNewJourneyModalOpen(false)}
      />

      {/* Dedicated Hackathon Demo Controller */}
      <DemoControlPanel />
    </div>
  );
}
