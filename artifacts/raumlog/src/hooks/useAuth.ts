import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '@/services/firebase';
import { useAuthStore, AccountType } from '@/store/authStore';
import { verifyToken, registerUser } from '@/lib/api';

export function useAuth() {
  const { setAuth, logout, setLoading, setError } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setLoading(true);
        try {
          const idToken = await fbUser.getIdToken();
          const { user } = await verifyToken(idToken);
          setAuth(user, idToken);
        } catch (err: any) {
          setError(err.message);
          logout();
        }
      } else {
        logout();
      }
      setInitializing(false);
      setLoading(false);
    });

    return unsubscribe;
  }, [setAuth, logout, setLoading, setError]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, role: AccountType = "Cliente") => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const idToken = await userCredential.user.getIdToken();
      const { user } = await registerUser(idToken, role, name);
      setAuth(user, idToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    logout();
  };

  return {
    signInWithGoogle,
    registerWithEmail,
    loginWithEmail,
    logout: handleLogout,
    initializing
  };
}
