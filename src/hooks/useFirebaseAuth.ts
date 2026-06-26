import { useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";

export interface AuthState {
  uid: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  loading: boolean;
  error: string | null;
}

const INITIAL: AuthState = {
  uid: null,
  displayName: null,
  isAnonymous: true,
  loading: true,
  error: null,
};

/**
 * Manages anonymous Firebase auth for the current device.
 * If auth is null (Firebase not configured), returns a stable guest identity
 * using crypto.randomUUID so local and remote adapters can coexist.
 */
export function useFirebaseAuth(auth: Auth | null): AuthState & {
  setDisplayName: (name: string) => Promise<void>;
} {
  const [state, setState] = useState<AuthState>(() => {
    if (!auth) {
      const uid = `local-${crypto.randomUUID().slice(0, 8)}`;
      return { uid, displayName: null, isAnonymous: true, loading: false, error: null };
    }
    return INITIAL;
  });

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setState({
          uid: user.uid,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
          loading: false,
          error: null,
        });
      } else {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : "Auth error",
          }));
        }
      }
    });
    return unsub;
  }, [auth]);

  const setDisplayName = useCallback(
    async (name: string) => {
      if (!auth?.currentUser) return;
      await updateProfile(auth.currentUser, { displayName: name });
      setState((s) => ({ ...s, displayName: name }));
    },
    [auth]
  );

  return { ...state, setDisplayName };
}
