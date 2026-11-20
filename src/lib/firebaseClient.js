import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

const configured = Object.values(config).every(Boolean);
let services = null;

export function firebaseConfigured() {
  return configured;
}

export function getFirebaseServices() {
  if (!configured) return null;
  if (services) return services;
  const app = getApps()[0] || initializeApp(config);
  let appCheck = null;
  const siteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
  if (siteKey) {
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
    }
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
  services = { app, auth: getAuth(app), db: getFirestore(app), appCheck };
  return services;
}
