const STORAGE_KEY = "cb-first-touch-v1";
const MAX_LENGTH = 120;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function clean(value, max = MAX_LENGTH) {
  return typeof value === "string" ? value.trim().slice(0, max) || null : null;
}

function safePage(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    const allowed = new URLSearchParams();
    for (const key of [...UTM_KEYS, "service", "cta_id"]) {
      const item = url.searchParams.get(key);
      if (item) allowed.set(key, item.slice(0, MAX_LENGTH));
    }
    const query = allowed.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`.slice(0, 300);
  } catch {
    return clean(value, 300);
  }
}

function safeReferrer(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin.slice(0, 300);
  } catch {
    return null;
  }
}

function currentTouch() {
  const params = new URLSearchParams(window.location.search);
  return {
    landingPage: safePage(window.location.href),
    referrer: safeReferrer(document.referrer),
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    utmContent: clean(params.get("utm_content")),
    utmTerm: clean(params.get("utm_term")),
    ctaId: null,
  };
}

export function initializeAttribution() {
  try {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentTouch()));
    }
  } catch {
    // Attribution is non-essential; privacy/browser restrictions must not block the site.
  }
}

export function rememberCta(ctaId) {
  if (!ctaId) return;
  try {
    const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") || {};
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ctaId: clean(ctaId) }));
  } catch {
    // No-op when session storage is unavailable.
  }
}

export function getLeadAttribution() {
  let firstTouch = {};
  try {
    firstTouch = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    firstTouch = {};
  }
  const lastTouch = currentTouch();
  return {
    landingPage: safePage(firstTouch.landingPage) || lastTouch.landingPage,
    submissionPage: safePage(window.location.href),
    referrer: safeReferrer(firstTouch.referrer) || lastTouch.referrer,
    utmSource: clean(firstTouch.utmSource) || lastTouch.utmSource,
    utmMedium: clean(firstTouch.utmMedium) || lastTouch.utmMedium,
    utmCampaign: clean(firstTouch.utmCampaign) || lastTouch.utmCampaign,
    utmContent: clean(firstTouch.utmContent) || lastTouch.utmContent,
    utmTerm: clean(firstTouch.utmTerm) || lastTouch.utmTerm,
    ctaId: clean(firstTouch.ctaId),
  };
}

export const _test = { clean, UTM_KEYS };
