import React, { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { syncUserApi } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Synchronize user profile with MongoDB Atlas
          const syncResult = await syncUserApi({
            firebaseUid: currentUser.uid,
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            photoURL: currentUser.photoURL || '',
          });

          if (syncResult.success) {
            setMongoUser(syncResult.data);
          }
        } catch (err) {
          console.error('[AuthContext Sync Error]:', err.message);
          // Fallback mongoUser if offline or backend unavailable
          setMongoUser({
            firebaseUid: currentUser.uid,
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            role: 'user',
          });
        }
      } else {
        setMongoUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setAuthError(null);

  // Auth Operations
  const handleRegister = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
      
      const syncResult = await syncUserApi({
        firebaseUid: res.user.uid,
        name,
        email,
        photoURL: '',
      });

      if (syncResult.success) {
        setMongoUser(syncResult.data);
      }
      return res.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      
      const syncResult = await syncUserApi({
        firebaseUid: res.user.uid,
        name: res.user.displayName || res.user.email.split('@')[0],
        email: res.user.email,
        photoURL: res.user.photoURL || '',
      });

      if (syncResult.success) {
        setMongoUser(syncResult.data);
      }
      return res.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setMongoUser(null);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    mongoUser,
    loading,
    authError,
    clearError,
    register: handleRegister,
    login: handleLogin,
    googleSignIn: handleGoogleSignIn,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
