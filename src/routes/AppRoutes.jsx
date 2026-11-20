import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import ScrollTop from "../components/common/ScrollTop";
import { AnalyticsManager } from "../components/common/AnalyticsConsent";
import RouteLoader from "../components/common/RouteLoader";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Contact = lazy(() => import("../pages/Contact"));
const Support = lazy(() => import("../pages/Support"));
const FAQs = lazy(() => import("../pages/FAQs"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/Terms"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Chatbot = lazy(() => import("../components/chatbot/Chatbot"));
const CrmAuthBoundary = lazy(() => import("../components/crm/CrmAuthBoundary"));
const ProtectedCrmRoute = lazy(() => import("../components/crm/ProtectedCrmRoute"));
const CRMLogin = lazy(() => import("../pages/crm/CRMLogin"));
const CRMDashboard = lazy(() => import("../pages/crm/CRMDashboard"));
const CRMLeadDetail = lazy(() => import("../pages/crm/CRMLeadDetail"));

function RouteFallback() {
  return <RouteLoader />;
}

function DeferredChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(handle);
  }, []);

  return ready ? <Suspense fallback={null}><Chatbot /></Suspense> : null;
}

function AppShellExtras() {
  const { pathname } = useLocation();
  return (
    <>
      <AnalyticsManager />
      {!pathname.startsWith("/internal/") && <DeferredChatbot />}
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/internal/crm" element={<CrmAuthBoundary />}>
            <Route path="login" element={<CRMLogin />} />
            <Route index element={<ProtectedCrmRoute><CRMDashboard /></ProtectedCrmRoute>} />
            <Route path="leads/:leadId" element={<ProtectedCrmRoute><CRMLeadDetail /></ProtectedCrmRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <AppShellExtras />
    </BrowserRouter>
  );
}
