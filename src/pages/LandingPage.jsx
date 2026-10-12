import React from 'react';
import { 
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Lock, 
  Heart,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onDemoLogin }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Top Navbar */}
      <nav className="border-b border-purple-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Safe<span className="text-purple-600">Her</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onDemoLogin}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Launch Demo Mode</span>
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/70 via-slate-50 to-slate-50 pointer-events-none" />
        
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span>Social Impact Women's Safety Web Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Every Journey Deserves a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">Safe Return.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            SafeHer empowers women travelling to college, work, or unfamiliar cities with intelligent one-tap SOS alerts, resilient journey timers, and instant nearby verified safe havens.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-demo-btn"
              type="button"
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white font-extrabold text-base shadow-xl shadow-purple-300 transition-all hover:scale-105 flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-pink-300" />
              <span>Explore Hackathon Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200 shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Core Trust Pill Badges */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              No Continuous Tracking Without Consent
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-600" />
              5-Second False Alarm Grace Window
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Overpass OSM Verified Safe Places
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built Specifically for Real-World Safety Needs
            </h2>
            <p className="text-sm text-slate-500">
              Three core safety pillars engineered for rapid action during vulnerable journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: One-Tap SOS */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-red-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                1. One-Tap Emergency SOS
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Instant emergency escalation with a 5-second cancel buffer for false alarms. Immediately captures GPS coordinates and notifies your selected trusted circle with live status tracking.
              </p>
            </div>

            {/* Pillar 2: Safe Journey Timer */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-purple-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Safe Journey Timer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Heading home late? Set an expected arrival time. If you do not check in before the grace period ends, SafeHer automatically initiates alert escalations to your circle.
              </p>
            </div>

            {/* Pillar 3: Nearby Safe Places */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-blue-200 hover:shadow-soft transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                3. Nearby Safe Havens
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Locate closest police stations, 24/7 trauma hospitals, and pharmacies using live OpenStreetMap data, complete with distance indicators and one-tap driving directions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">
            SafeHer — Every Journey Deserves a Safe Return
          </p>
          <p>
            Developed for social impact & hackathon evaluation. Built with React, Tailwind CSS, Leaflet, and Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
