import { BRAND_ID } from "../config/services";
import { rememberCta } from "./attribution";

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "";
const CONSENT_KEY = "cb-analytics-consent-v1";
let initialized = false;
let lastPageView = "";

export function getAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

export function initializeAnalytics() {
  if (initialized || !MEASUREMENT_ID || getAnalyticsConsent() !== "granted") return false;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  script.dataset.codebellAnalytics = "true";
  document.head.appendChild(script);
  return true;
}

export function setAnalyticsConsent(state) {
  if (!['granted', 'denied'].includes(state)) return;
  try {
    localStorage.setItem(CONSENT_KEY, state);
  } catch {
    // Keep consent in-memory only when storage is unavailable.
  }
  if (state === "granted") initializeAnalytics();
  if (initialized) gtag("consent", "update", { analytics_storage: state });
}

export function trackEvent(name, parameters = {}) {
  if (!initialized || getAnalyticsConsent() !== "granted") return;
  const safeParameters = Object.fromEntries(
    Object.entries({ brand: BRAND_ID, ...parameters })
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 100) : value]),
  );
  gtag("event", name, safeParameters);
}

export function trackPageView(path) {
  if (!initialized || getAnalyticsConsent() !== "granted" || lastPageView === path) return;
  lastPageView = path;
  trackEvent("page_view", { page_path: path, page_title: document.title });
}

export function installCtaTracking() {
  const handler = (event) => {
    const target = event.target.closest?.("[data-cta-id]");
    if (!target) return;
    const ctaId = target.dataset.ctaId;
    rememberCta(ctaId);
    trackEvent("cta_click", { cta_id: ctaId, service: target.dataset.service || "", source_page: window.location.pathname });
    if (target.dataset.consultation === "true") trackEvent("consultation_click", { cta_id: ctaId, source_page: window.location.pathname });
    if (target.dataset.whatsapp === "true") trackEvent("whatsapp_click", { cta_id: ctaId, source_page: window.location.pathname });
    if (target.dataset.service) trackEvent("service_interest", { cta_id: ctaId, service: target.dataset.service, source_page: window.location.pathname });
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}

export function analyticsConfigured() {
  return Boolean(MEASUREMENT_ID);
}
