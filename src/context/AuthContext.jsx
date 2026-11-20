import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { firebaseConfigured, getFirebaseServices } from "../lib/firebaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({ loading: firebaseConfigured(), user: null, claims: null }));

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) return undefined;
    return onAuthStateChanged(services.auth, async (user) => {
      if (!user) {
        setState({ loading: false, user: null, claims: null });
        return;
      }
      try {
        const token = await user.getIdTokenResult();
        setState({ loading: false, user, claims: token.claims });
      } catch {
        setState({ loading: false, user: null, claims: null });
      }
    });
  }, []);

  const value = useMemo(() => ({
    ...state,
    configured: firebaseConfigured(),
    role: state.claims?.crm_role || null,
    brands: Array.isArray(state.claims?.crm_brands) ? state.claims.crm_brands : [],
    async signIn(email, password) {
      const services = getFirebaseServices();
      if (!services) throw new Error("Firebase is not configured.");
      const credential = await signInWithEmailAndPassword(services.auth, email, password);
      const token = await credential.user.getIdTokenResult(true);
      setState({ loading: false, user: credential.user, claims: token.claims });
      return credential.user;
    },
    async signOut() {
      const services = getFirebaseServices();
      if (services) await firebaseSignOut(services.auth);
    },
    async refreshClaims() {
      if (!state.user) return;
      const token = await state.user.getIdTokenResult(true);
      setState((current) => ({ ...current, claims: token.claims }));
    },
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Context hooks intentionally live beside their provider to keep the auth boundary cohesive.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
