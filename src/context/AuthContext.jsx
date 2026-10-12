import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  isFirebaseConfigured, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from '../services/firebase';

const AuthContext = createContext();

const LOCAL_USER_KEY = 'safeher_current_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'SafeHer User',
            photoURL: user.photoURL,
            phone: user.phoneNumber || '+91 98765 00000',
            bloodGroup: 'B+',
            emergencyPin: '4321',
            createdAt: user.metadata?.creationTime || new Date().toISOString()
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local fallback for offline/hackathon demo
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch {
          setCurrentUser(null);
        }
      } else {
        // Default demo user for instant hackathon evaluation
        const defaultUser = {
          uid: 'demo-user-101',
          email: 'demo@safeher.app',
          displayName: 'Aarohi Sen',
          phone: '+91 98765 12345',
          bloodGroup: 'O+',
          emergencyPin: '1234',
          createdAt: new Date().toISOString(),
          isDemoUser: true
        };
        setCurrentUser(defaultUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
      } catch (err) {
        let msg = 'Failed to sign in. Please check your credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email or password.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Please enter a valid email address.';
        }
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Local demo login
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      const demoUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        phone: '+91 98765 12345',
        bloodGroup: 'O+',
        emergencyPin: '1234',
        createdAt: new Date().toISOString(),
        isDemoUser: true
      };
      setCurrentUser(demoUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
      return demoUser;
    }
  };

  const register = async ({ email, password, name, phone, bloodGroup, emergencyPin }) => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name && cred.user) {
          await updateProfile(cred.user, { displayName: name });
        }
        const userObj = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: name || cred.user.displayName,
          phone: phone || '',
          bloodGroup: bloodGroup || 'Unknown',
          emergencyPin: emergencyPin || '0000',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(userObj);
        return cred.user;
      } catch (err) {
        let msg = 'Failed to create account.';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'An account with this email already exists.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password should be at least 6 characters.';
        }
        setAuthError(msg);
        throw new Error(msg);
      }
    } else {
      // Local register
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: name || email.split('@')[0],
        phone: phone || '+91 98765 12345',
        bloodGroup: bloodGroup || 'O+',
        emergencyPin: emergencyPin || '1234',
        createdAt: new Date().toISOString(),
        isDemoUser: true
      };
      setCurrentUser(newUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
      return newUser;
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const resetPassword = async (email) => {
    if (!email) throw new Error('Please enter your registered email address.');
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Demo simulated reset
      console.log('Password reset link sent to demo user email:', email);
    }
  };

  const updateUserData = (updates) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setDemoUser = () => {
    const demo = {
      uid: 'demo-user-101',
      email: 'aarohi.sen@college.edu',
      displayName: 'Aarohi Sen',
      phone: '+91 98765 12345',
      bloodGroup: 'O+',
      emergencyPin: '1234',
      createdAt: new Date().toISOString(),
      isDemoUser: true
    };
    setCurrentUser(demo);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demo));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      authError,
      isFirebaseConfigured,
      login,
      register,
      logout,
      resetPassword,
      updateUserData,
      setDemoUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
