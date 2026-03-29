import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/services/firebase';
import { useAuthStore, AccountType } from '@/store/authStore';

export function useAuth() {
  const { setAuth, logout, setLoading, setError } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setLoading(true);
        try {
          const idToken = await fbUser.getIdToken();
          
          // Verify with local backend to sync database
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to verify token with backend');
          }
          
          const { user } = await res.json();
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
       // We create in firebase first
       const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
       const idToken = await userCredential.user.getIdToken();

       // Then we notify backend to create the user record with the role
       const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ idToken, role, name })
       });

       if (!res.ok) {
           const data = await res.json();
           throw new Error(data.error || 'Failed to finalize registration');
       }
       const { user } = await res.json();
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
