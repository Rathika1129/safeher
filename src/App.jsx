import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import JourneyPage from './pages/JourneyPage';
import SafePlacesPage from './pages/SafePlacesPage';
import CheckInPage from './pages/CheckInPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { currentUser } = useAuth();

  // Navigation views: 'landing' | 'login' | 'register' | 'app'
  const [view, setView] = useState(() => {
    return currentUser ? 'app' : 'landing';
  });

  // Active dashboard tab: 'dashboard' | 'journey' | 'places' | 'contacts' | 'checkin' | 'history' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // If not logged in, render public views
  if (!currentUser) {
    if (view === 'login') {
      return (
        <LoginPage
          onNavigateRegister={() => setView('register')}
          onLoginSuccess={() => setView('app')}
        />
      );
    }
    if (view === 'register') {
      return (
        <RegisterPage
          onNavigateLogin={() => setView('login')}
          onRegisterSuccess={() => setView('app')}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setView('login')}
        onDemoLogin={() => setView('login')}
      />
    );
  }

  // Render authenticated application
  return (
    <DashboardLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage onNavigateTab={setActiveTab} />}
      {activeTab === 'journey' && <JourneyPage />}
      {activeTab === 'places' && <SafePlacesPage />}
      {activeTab === 'contacts' && <ContactsPage />}
      {activeTab === 'checkin' && <CheckInPage />}
      {activeTab === 'history' && <HistoryPage />}
      {activeTab === 'settings' && <SettingsPage />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SafetyProvider>
          <AppContent />
        </SafetyProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
