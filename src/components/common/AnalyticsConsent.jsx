import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  analyticsConfigured,
  getAnalyticsConsent,
  initializeAnalytics,
  installCtaTracking,
  setAnalyticsConsent,
  trackPageView,
} from "../../lib/analytics";

export function AnalyticsManager() {
  const location = useLocation();
  const [choice, setChoice] = useState(getAnalyticsConsent());

  useEffect(() => {
    initializeAnalytics();
    return installCtaTracking();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  if (!analyticsConfigured() || choice) return null;

  const decide = (value) => {
    setAnalyticsConsent(value);
    setChoice(value);
    if (value === "granted") trackPageView(`${location.pathname}${location.search}`);
  };

  return (
    <aside className="cb-consent-banner" aria-label="Analytics preferences">
      <p>
        CodeBell would like to use privacy-conscious analytics to understand website usage. Analytics
        remains off unless you allow it. <a href="/privacy-policy">Read the Privacy Policy</a>.
      </p>
      <div>
        <button type="button" onClick={() => decide("denied")}>Decline</button>
        <button type="button" className="primary" onClick={() => decide("granted")}>Allow analytics</button>
      </div>
    </aside>
  );
}
