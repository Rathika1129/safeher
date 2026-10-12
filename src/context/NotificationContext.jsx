import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(!notificationService.isProductionConfigured);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return unsubscribe;
  }, []);

  const clearNotificationLogs = () => {
    notificationService.clearLogs();
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  return (
    <NotificationContext.Provider value={{
      logs,
      isDemoMode,
      isProductionConfigured: notificationService.isProductionConfigured,
      clearNotificationLogs,
      toggleDemoMode
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
